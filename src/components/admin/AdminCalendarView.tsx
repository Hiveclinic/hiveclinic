import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Clock, User, X, Mail, Phone, StickyNote, Check, CreditCard, Link as LinkIcon, DollarSign } from "lucide-react";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";

type CalendarBooking = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  booking_date: string;
  booking_time: string;
  duration_mins: number;
  status: string;
  payment_status: string;
  total_price: number;
  deposit_amount: number | null;
  notes: string | null;
  treatment_id: string;
  treatments?: { name: string } | null;
};

type Availability = {
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
};

type Treatment = {
  id: string;
  name: string;
};

const STATUS_BG: Record<string, string> = {
  confirmed: "bg-blue-500/20 border-blue-500/40 text-blue-700",
  completed: "bg-green-500/20 border-green-500/40 text-green-700",
  cancelled: "bg-red-500/20 border-red-500/40 text-red-400 line-through opacity-50",
  no_show: "bg-orange-500/20 border-orange-500/40 text-orange-600",
  pending: "bg-yellow-500/20 border-yellow-500/40 text-yellow-700",
};

const STATUSES = ["pending", "confirmed", "completed", "cancelled", "no_show"];
const HOURS = Array.from({ length: 14 }, (_, i) => i + 8);

const AdminCalendarView = () => {
  const [bookings, setBookings] = useState<CalendarBooking[]>([]);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [dragBooking, setDragBooking] = useState<CalendarBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [editBooking, setEditBooking] = useState<CalendarBooking | null>(null);
  const [editForm, setEditForm] = useState<{
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    status: string;
    notes: string;
    booking_date: string;
    booking_time: string;
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [creatingPaymentLink, setCreatingPaymentLink] = useState(false);

  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

  const fetchData = async () => {
    setLoading(true);
    const startStr = format(weekDays[0], "yyyy-MM-dd");
    const endStr = format(weekDays[6], "yyyy-MM-dd");

    const [bookRes, availRes, treatRes] = await Promise.all([
      supabase.from("bookings").select("id, customer_name, customer_email, customer_phone, booking_date, booking_time, duration_mins, status, payment_status, total_price, deposit_amount, notes, treatment_id, treatments(name)")
        .gte("booking_date", startStr).lte("booking_date", endStr),
      supabase.from("availability").select("*"),
      supabase.from("treatments").select("id, name").eq("active", true).order("name"),
    ]);

    if (bookRes.data) setBookings(bookRes.data as unknown as CalendarBooking[]);
    if (availRes.data) setAvailability(availRes.data as Availability[]);
    if (treatRes.data) setTreatments(treatRes.data as Treatment[]);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [weekStart]);

  const openEdit = (booking: CalendarBooking) => {
    setEditBooking(booking);
    setEditForm({
      customer_name: booking.customer_name,
      customer_email: booking.customer_email,
      customer_phone: booking.customer_phone || "",
      status: booking.status,
      notes: booking.notes || "",
      booking_date: booking.booking_date,
      booking_time: booking.booking_time.slice(0, 5),
    });
  };

  const saveEdit = async () => {
    if (!editBooking || !editForm) return;
    setSaving(true);

    const oldStatus = editBooking.status;
    const newStatus = editForm.status;
    const oldDate = editBooking.booking_date;
    const oldTime = editBooking.booking_time;

    const { error } = await supabase.from("bookings").update({
      customer_name: editForm.customer_name,
      customer_email: editForm.customer_email,
      customer_phone: editForm.customer_phone || null,
      status: editForm.status,
      notes: editForm.notes || null,
      booking_date: editForm.booking_date,
      booking_time: editForm.booking_time.length === 5 ? `${editForm.booking_time}:00` : editForm.booking_time,
    }).eq("id", editBooking.id);

    if (error) {
      toast.error("Failed to update booking");
      setSaving(false);
      return;
    }

    if (oldStatus !== newStatus) {
      if (newStatus === "completed") {
        supabase.functions.invoke("send-booking-email", { body: { bookingId: editBooking.id, emailType: "aftercare" } }).catch(() => {});
      } else if (newStatus === "cancelled") {
        supabase.functions.invoke("send-booking-email", { body: { bookingId: editBooking.id, emailType: "cancellation" } }).catch(() => {});
      }
    }

    if (editForm.booking_date !== oldDate || `${editForm.booking_time}:00` !== oldTime) {
      supabase.functions.invoke("send-booking-email", { body: { bookingId: editBooking.id, emailType: "reschedule", oldDate, oldTime } }).catch(() => {});
    }

    toast.success("Booking updated");
    setEditBooking(null);
    setEditForm(null);
    setSaving(false);
    fetchData();
  };

  const handleSendPaymentLink = async () => {
    if (!editBooking) return;
    setCreatingPaymentLink(true);
    try {
      const remaining = Number(editBooking.total_price) - Number(editBooking.deposit_amount || 0);
      const { data, error } = await supabase.functions.invoke("create-payment-link", {
        body: {
          amount: remaining,
          bookingId: editBooking.id,
          treatmentName: (editBooking.treatments as any)?.name || "Treatment",
          customerEmail: editBooking.customer_email,
        },
      });
      if (error || data?.error) throw new Error(data?.error || "Failed");
      await navigator.clipboard.writeText(data.url);
      toast.success("Payment link copied to clipboard! Send it to the client.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create payment link");
    } finally {
      setCreatingPaymentLink(false);
    }
  };

  const handleMarkPaid = async () => {
    if (!editBooking) return;
    const { error } = await supabase.from("bookings").update({ payment_status: "fully_paid" }).eq("id", editBooking.id);
    if (error) { toast.error("Failed to update"); return; }
    toast.success("Marked as fully paid");
    setEditBooking(prev => prev ? { ...prev, payment_status: "fully_paid" } : null);
    fetchData();
  };

  const handleDrop = async (date: Date, hour: number) => {
    if (!dragBooking) return;
    const newDate = format(date, "yyyy-MM-dd");
    const newTime = `${String(hour).padStart(2, "0")}:00`;
    const dayAvail = availability.find(a => a.day_of_week === date.getDay());
    if (!dayAvail?.is_available) { toast.error("That day is unavailable"); setDragBooking(null); return; }
    const oldDate = dragBooking.booking_date;
    const oldTime = dragBooking.booking_time;
    const { error } = await supabase.from("bookings").update({ booking_date: newDate, booking_time: newTime }).eq("id", dragBooking.id);
    if (error) { toast.error("Failed to reschedule"); } else {
      toast.success(`${dragBooking.customer_name} moved to ${format(date, "EEE d MMM")} at ${newTime}`);
      supabase.functions.invoke("send-booking-email", { body: { bookingId: dragBooking.id, emailType: "reschedule", oldDate, oldTime } }).catch(() => {});
      fetchData();
    }
    setDragBooking(null);
  };

  const getBookingsForSlot = (date: Date, hour: number) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return bookings.filter(b => {
      if (b.booking_date !== dateStr) return false;
      if (b.status === "cancelled") return false;
      return parseInt(b.booking_time.split(":")[0]) === hour;
    });
  };

  const isDayAvailable = (date: Date) => {
    const avail = availability.find(a => a.day_of_week === date.getDay());
    return avail?.is_available ?? false;
  };

  const showPaymentActions = editBooking && (editBooking.payment_status === "pending" || editBooking.payment_status === "deposit_paid");

  return (
    <div>
      {/* Week Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setWeekStart(addDays(weekStart, -7))} className="p-2 border border-border hover:border-gold transition-colors">
          <ChevronLeft size={14} strokeWidth={1.5} />
        </button>
        <h3 className="font-display text-xl">
          {format(weekDays[0], "d MMM")} - {format(weekDays[6], "d MMM yyyy")}
        </h3>
        <div className="flex gap-2">
          <button onClick={() => setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))} className="px-3 py-2 border border-border font-body text-xs uppercase tracking-wider hover:border-gold transition-colors">Today</button>
          <button onClick={() => setWeekStart(addDays(weekStart, 7))} className="p-2 border border-border hover:border-gold transition-colors">
            <ChevronRight size={14} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center"><p className="font-body text-muted-foreground animate-pulse">Loading calendar...</p></div>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            <div className="grid grid-cols-8 border-b border-border">
              <div className="p-2 font-body text-xs text-muted-foreground">Time</div>
              {weekDays.map(day => (
                <div key={day.toISOString()} className={`p-2 text-center ${isSameDay(day, new Date()) ? "bg-gold/10" : ""} ${!isDayAvailable(day) ? "opacity-40" : ""}`}>
                  <p className="font-body text-xs text-muted-foreground">{format(day, "EEE")}</p>
                  <p className={`font-display text-lg ${isSameDay(day, new Date()) ? "text-gold" : ""}`}>{format(day, "d")}</p>
                </div>
              ))}
            </div>
            {HOURS.map(hour => (
              <div key={hour} className="grid grid-cols-8 border-b border-border/50 min-h-[60px]">
                <div className="p-2 font-body text-xs text-muted-foreground flex items-start">{`${String(hour).padStart(2, "0")}:00`}</div>
                {weekDays.map(day => {
                  const slotBookings = getBookingsForSlot(day, hour);
                  const available = isDayAvailable(day);
                  return (
                    <div key={`${day.toISOString()}-${hour}`}
                      className={`p-1 border-l border-border/30 ${available ? "cursor-pointer hover:bg-gold/5" : "bg-secondary/30"} ${isSameDay(day, new Date()) ? "bg-gold/5" : ""}`}
                      onDragOver={e => { if (available) e.preventDefault(); }}
                      onDrop={() => handleDrop(day, hour)}
                    >
                      {slotBookings.map(b => (
                        <div key={b.id} draggable onDragStart={() => setDragBooking(b)} onDragEnd={() => setDragBooking(null)} onClick={() => openEdit(b)}
                          className={`px-2 py-1 mb-1 border rounded text-xs cursor-pointer hover:ring-1 hover:ring-gold/50 ${STATUS_BG[b.status] || "bg-secondary"}`}>
                          <p className="font-body font-medium truncate">{b.customer_name}</p>
                          <p className="font-body text-[10px] opacity-70 truncate">{(b.treatments as any)?.name} - {b.duration_mins}m</p>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="font-body text-xs text-muted-foreground mt-4 text-center">Click a booking to edit details. Drag and drop to reschedule.</p>

      {/* Edit Modal */}
      {editBooking && editForm && (
        <div className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center p-4" onClick={() => { setEditBooking(null); setEditForm(null); }}>
          <div className="bg-background border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-display text-xl">Edit Booking</h3>
              <button onClick={() => { setEditBooking(null); setEditForm(null); }} className="text-muted-foreground hover:text-foreground"><X size={16} strokeWidth={1.5} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="font-body text-xs uppercase tracking-wider text-muted-foreground block mb-1">Customer Name</label>
                <input value={editForm.customer_name} onChange={e => setEditForm({ ...editForm, customer_name: e.target.value })}
                  className="w-full border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-body text-xs uppercase tracking-wider text-muted-foreground block mb-1">Email</label>
                  <input value={editForm.customer_email} onChange={e => setEditForm({ ...editForm, customer_email: e.target.value })}
                    className="w-full border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none" />
                </div>
                <div>
                  <label className="font-body text-xs uppercase tracking-wider text-muted-foreground block mb-1">Phone</label>
                  <input value={editForm.customer_phone} onChange={e => setEditForm({ ...editForm, customer_phone: e.target.value })}
                    className="w-full border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-body text-xs uppercase tracking-wider text-muted-foreground block mb-1">Date</label>
                  <input type="date" value={editForm.booking_date} onChange={e => setEditForm({ ...editForm, booking_date: e.target.value })}
                    className="w-full border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none" />
                </div>
                <div>
                  <label className="font-body text-xs uppercase tracking-wider text-muted-foreground block mb-1">Time</label>
                  <input type="time" value={editForm.booking_time} onChange={e => setEditForm({ ...editForm, booking_time: e.target.value })}
                    className="w-full border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="font-body text-xs uppercase tracking-wider text-muted-foreground block mb-1">Status</label>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map(s => (
                    <button key={s} onClick={() => setEditForm({ ...editForm, status: s })}
                      className={`px-3 py-1.5 border font-body text-xs uppercase tracking-wider transition-colors ${editForm.status === s ? "border-gold bg-gold/10 text-gold" : "border-border text-muted-foreground hover:border-foreground"}`}>
                      {s === "no_show" ? "No Show" : s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="font-body text-xs uppercase tracking-wider text-muted-foreground block mb-1">Notes</label>
                <textarea value={editForm.notes} onChange={e => setEditForm({ ...editForm, notes: e.target.value })} rows={3}
                  className="w-full border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none resize-none" />
              </div>

              {/* Payment Actions */}
              {showPaymentActions && (
                <div className="border border-gold/30 bg-gold/5 p-4 space-y-3">
                  <p className="font-body text-xs uppercase tracking-wider text-gold flex items-center gap-1"><CreditCard size={12} /> Payment Actions</p>
                  <p className="font-body text-xs text-muted-foreground">
                    Outstanding: £{(Number(editBooking.total_price) - Number(editBooking.deposit_amount || 0)).toFixed(2)}
                    {editBooking.payment_status === "deposit_paid" && ` (deposit of £${Number(editBooking.deposit_amount).toFixed(2)} received)`}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <button onClick={handleSendPaymentLink} disabled={creatingPaymentLink}
                      className="flex items-center gap-1 px-3 py-2 bg-foreground text-background font-body text-xs uppercase tracking-wider hover:bg-accent transition-colors disabled:opacity-50">
                      <LinkIcon size={12} /> {creatingPaymentLink ? "Creating..." : "Send Payment Link"}
                    </button>
                    <button onClick={handleMarkPaid}
                      className="flex items-center gap-1 px-3 py-2 border border-green-600/30 text-green-600 font-body text-xs uppercase tracking-wider hover:bg-green-600/10 transition-colors">
                      <DollarSign size={12} /> Mark as Paid
                    </button>
                  </div>
                </div>
              )}

              <div className="border-t border-border pt-4 flex items-center justify-between">
                <div className="font-body text-xs text-muted-foreground">
                  <p>Treatment: {(editBooking.treatments as any)?.name}</p>
                  <p>Total: £{Number(editBooking.total_price).toFixed(2)} — <span className={editBooking.payment_status === "fully_paid" ? "text-green-600" : "text-gold"}>{editBooking.payment_status}</span></p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditBooking(null); setEditForm(null); }} className="px-4 py-2 border border-border font-body text-xs uppercase tracking-wider hover:border-foreground transition-colors">Cancel</button>
                  <button onClick={saveEdit} disabled={saving} className="px-4 py-2 bg-foreground text-background font-body text-xs uppercase tracking-wider hover:bg-accent transition-colors disabled:opacity-50 flex items-center gap-1">
                    <Check size={12} strokeWidth={1.5} /> {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCalendarView;
