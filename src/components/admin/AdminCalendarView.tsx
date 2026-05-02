import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Clock, User, X, Mail, Phone, StickyNote, Check, CreditCard, Link as LinkIcon, DollarSign, PoundSterling, Banknote, CalendarPlus } from "lucide-react";
import { format, addDays, startOfWeek, isSameDay, startOfMonth, endOfMonth, addMonths, subMonths, eachDayOfInterval, getDay } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";

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

type Treatment = { id: string; name: string };

type PaymentPlan = {
  id: string;
  booking_id: string;
  total_amount: number;
  total_instalments: number;
  paid_instalments: number;
  instalment_amount: number;
  next_payment_date: string | null;
  status: string;
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
const PAYMENT_METHODS = ["Card (Stripe)", "Cash", "Bank Transfer (Tide)", "Other"];

const AdminCalendarView = () => {
  const isMobile = useIsMobile();
  const [bookings, setBookings] = useState<CalendarBooking[]>([]);
  const [allBookings, setAllBookings] = useState<CalendarBooking[]>([]);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [mobileDate, setMobileDate] = useState(new Date());
  const [monthDate, setMonthDate] = useState(new Date());
  const [dragBooking, setDragBooking] = useState<CalendarBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [editBooking, setEditBooking] = useState<CalendarBooking | null>(null);
  const [editForm, setEditForm] = useState<{
    customer_name: string; customer_email: string; customer_phone: string;
    status: string; notes: string; booking_date: string; booking_time: string; total_price: string;
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [creatingPaymentLink, setCreatingPaymentLink] = useState(false);
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">(isMobile ? "day" : "week");

  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentRef, setPaymentRef] = useState("");
  const [showPaymentMethodPicker, setShowPaymentMethodPicker] = useState(false);

  const [paymentPlan, setPaymentPlan] = useState<PaymentPlan | null>(null);
  const [showCreatePlan, setShowCreatePlan] = useState(false);
  const [planInstalments, setPlanInstalments] = useState("3");
  const [planAmount, setPlanAmount] = useState("");
  const [planNextDate, setPlanNextDate] = useState("");
  const [loadingPlan, setLoadingPlan] = useState(false);

  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

  const fetchData = async () => {
    setLoading(true);
    const startStr = format(weekDays[0], "yyyy-MM-dd");
    const endStr = format(weekDays[6], "yyyy-MM-dd");

    // Also fetch month range for month view
    const mStart = format(startOfMonth(monthDate), "yyyy-MM-dd");
    const mEnd = format(endOfMonth(monthDate), "yyyy-MM-dd");
    const rangeStart = startStr < mStart ? startStr : mStart;
    const rangeEnd = endStr > mEnd ? endStr : mEnd;

    const [bookRes, availRes, treatRes] = await Promise.all([
      supabase.from("bookings").select("id, customer_name, customer_email, customer_phone, booking_date, booking_time, duration_mins, status, payment_status, total_price, deposit_amount, notes, treatment_id, treatments(name)")
        .gte("booking_date", rangeStart).lte("booking_date", rangeEnd),
      supabase.from("availability").select("*"),
      supabase.from("treatments").select("id, name").eq("active", true).order("name"),
    ]);

    if (bookRes.data) {
      const all = bookRes.data as unknown as CalendarBooking[];
      setAllBookings(all);
      setBookings(all.filter(b => b.booking_date >= startStr && b.booking_date <= endStr));
    }
    if (availRes.data) setAvailability(availRes.data as Availability[]);
    if (treatRes.data) setTreatments(treatRes.data as Treatment[]);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [weekStart, monthDate]);

  const fetchPaymentPlan = async (bookingId: string) => {
    const { data } = await supabase.from("payment_plans").select("*").eq("booking_id", bookingId).maybeSingle();
    setPaymentPlan(data as PaymentPlan | null);
  };

  const openEdit = (booking: CalendarBooking) => {
    setEditBooking(booking);
    setEditForm({
      customer_name: booking.customer_name, customer_email: booking.customer_email,
      customer_phone: booking.customer_phone || "", status: booking.status,
      notes: booking.notes || "", booking_date: booking.booking_date,
      booking_time: booking.booking_time.slice(0, 5), total_price: String(booking.total_price),
    });
    setPaymentAmount(String((Number(booking.total_price) - Number(booking.deposit_amount || 0)).toFixed(2)));
    setPaymentMethod(""); setPaymentRef("");
    setShowPaymentMethodPicker(false); setShowCreatePlan(false); setPaymentPlan(null);
    fetchPaymentPlan(booking.id);
  };

  const saveEdit = async () => {
    if (!editBooking || !editForm) return;
    setSaving(true);
    const oldDate = editBooking.booking_date;
    const oldTime = editBooking.booking_time;
    const { error } = await supabase.from("bookings").update({
      customer_name: editForm.customer_name, customer_email: editForm.customer_email,
      customer_phone: editForm.customer_phone || null, status: editForm.status,
      notes: editForm.notes || null, booking_date: editForm.booking_date,
      booking_time: editForm.booking_time.length === 5 ? `${editForm.booking_time}:00` : editForm.booking_time,
      total_price: Number(editForm.total_price),
    }).eq("id", editBooking.id);
    if (error) { toast.error("Failed to update booking"); setSaving(false); return; }
    if (editBooking.status !== editForm.status) {
      if (editForm.status === "completed") supabase.functions.invoke("send-booking-email", { body: { bookingId: editBooking.id, emailType: "aftercare" } }).catch(() => {});
      else if (editForm.status === "cancelled") supabase.functions.invoke("send-booking-email", { body: { bookingId: editBooking.id, emailType: "cancellation" } }).catch(() => {});
    }
    if (editForm.booking_date !== oldDate || `${editForm.booking_time}:00` !== oldTime)
      supabase.functions.invoke("send-booking-email", { body: { bookingId: editBooking.id, emailType: "reschedule", oldDate, oldTime } }).catch(() => {});
    toast.success("Booking updated");
    setEditBooking(null); setEditForm(null); setSaving(false);
    fetchData();
  };

  const handleSendPaymentLink = async () => {
    if (!editBooking) return;
    setCreatingPaymentLink(true);
    try {
      const amount = Number(paymentAmount) || (Number(editBooking.total_price) - Number(editBooking.deposit_amount || 0));
      const { data, error } = await supabase.functions.invoke("create-payment-link", {
        body: { amount, bookingId: editBooking.id, treatmentName: (editBooking.treatments as any)?.name || "Treatment", customerEmail: editBooking.customer_email },
      });
      if (error || data?.error) throw new Error(data?.error || "Failed");
      await navigator.clipboard.writeText(data.url);
      toast.success("Payment link copied to clipboard!");
    } catch (err) { toast.error(err instanceof Error ? err.message : "Failed to create payment link"); }
    finally { setCreatingPaymentLink(false); }
  };

  const handleTakeCardPayment = async () => {
    if (!editBooking) return;
    setCreatingPaymentLink(true);
    try {
      const amount = Number(paymentAmount) || (Number(editBooking.total_price) - Number(editBooking.deposit_amount || 0));
      const { data, error } = await supabase.functions.invoke("create-payment-link", {
        body: { amount, bookingId: editBooking.id, treatmentName: (editBooking.treatments as any)?.name || "Treatment", customerEmail: editBooking.customer_email },
      });
      if (error || data?.error) throw new Error(data?.error || "Failed");
      window.open(data.url, "_blank");
      toast.success("Payment page opened in new tab");
    } catch (err) { toast.error(err instanceof Error ? err.message : "Failed to create payment link"); }
    finally { setCreatingPaymentLink(false); }
  };

  const handleMarkPaid = async (method?: string) => {
    if (!editBooking) return;
    const noteAddition = method ? `\n[Paid via ${method}${paymentRef ? ` - Ref: ${paymentRef}` : ""}]` : "";
    const currentNotes = editForm?.notes || editBooking.notes || "";
    const { error } = await supabase.from("bookings").update({ payment_status: "fully_paid", notes: noteAddition ? `${currentNotes}${noteAddition}` : currentNotes }).eq("id", editBooking.id);
    if (error) { toast.error("Failed to update"); return; }
    toast.success(`Marked as fully paid${method ? ` (${method})` : ""}`);
    setEditBooking(prev => prev ? { ...prev, payment_status: "fully_paid" } : null);
    setShowPaymentMethodPicker(false);
    fetchData();
  };

  const handleCreatePlan = async () => {
    if (!editBooking) return;
    setLoadingPlan(true);
    const total = Number(editForm?.total_price || editBooking.total_price);
    const instalments = Number(planInstalments) || 3;
    const amount = Number(planAmount) || (total / instalments);
    const { error } = await supabase.from("payment_plans").insert({
      booking_id: editBooking.id, total_amount: total, total_instalments: instalments,
      instalment_amount: Number(amount.toFixed(2)), next_payment_date: planNextDate || null,
      paid_instalments: 0, status: "active",
    });
    if (error) { toast.error("Failed to create plan"); setLoadingPlan(false); return; }
    toast.success("Payment plan created");
    setShowCreatePlan(false); setLoadingPlan(false);
    fetchPaymentPlan(editBooking.id);
  };

  const handleRecordInstalment = async () => {
    if (!paymentPlan) return;
    const newPaid = paymentPlan.paid_instalments + 1;
    const newStatus = newPaid >= paymentPlan.total_instalments ? "completed" : "active";
    const { error } = await supabase.from("payment_plans").update({ paid_instalments: newPaid, status: newStatus }).eq("id", paymentPlan.id);
    if (error) { toast.error("Failed to update"); return; }
    if (newStatus === "completed" && editBooking) await supabase.from("bookings").update({ payment_status: "fully_paid" }).eq("id", editBooking.id);
    toast.success(`Instalment ${newPaid}/${paymentPlan.total_instalments} recorded`);
    if (editBooking) fetchPaymentPlan(editBooking.id);
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
    return bookings.filter(b => b.booking_date === dateStr && b.status !== "cancelled" && parseInt(b.booking_time.split(":")[0]) === hour);
  };

  const isDayAvailable = (date: Date) => {
    const avail = availability.find(a => a.day_of_week === date.getDay());
    return avail?.is_available ?? false;
  };

  const showPaymentActions = editBooking && (editBooking.payment_status === "pending" || editBooking.payment_status === "deposit_paid");

  const mobileDayBookings = useMemo(() => {
    const dateStr = format(mobileDate, "yyyy-MM-dd");
    return allBookings.filter(b => b.booking_date === dateStr && b.status !== "cancelled").sort((a, b) => a.booking_time.localeCompare(b.booking_time));
  }, [allBookings, mobileDate]);

  // Month view data
  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const firstDayOffset = (getDay(monthStart) + 6) % 7; // Monday = 0

  const getMonthDayBookings = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return allBookings.filter(b => b.booking_date === dateStr && b.status !== "cancelled");
  };

  return (
    <div>
      {/* View Mode Toggle + Navigation */}
      <div className="flex items-center justify-between mb-4 sm:mb-6 flex-wrap gap-2">
        <button onClick={() => {
          if (viewMode === "month") setMonthDate(subMonths(monthDate, 1));
          else if (viewMode === "day" || isMobile) setMobileDate(addDays(mobileDate, -1));
          else setWeekStart(addDays(weekStart, -7));
        }} className="p-2 border border-border hover:border-accent transition-colors rounded-lg">
          <ChevronLeft size={14} strokeWidth={1.5} />
        </button>

        <div className="flex items-center gap-3">
          {!isMobile && (
            <div className="flex border border-border rounded-lg overflow-hidden">
              {(["day", "week", "month"] as const).map(mode => (
                <button key={mode} onClick={() => setViewMode(mode)}
                  className={`px-3 py-1.5 font-body text-xs uppercase tracking-wider transition-colors ${viewMode === mode ? "bg-foreground text-background" : "hover:bg-secondary"}`}>
                  {mode}
                </button>
              ))}
            </div>
          )}
          <h3 className="font-display text-lg sm:text-xl text-center">
            {viewMode === "month"
              ? format(monthDate, "MMMM yyyy")
              : viewMode === "day" || isMobile
                ? format(mobileDate, "EEE d MMM yyyy")
                : `${format(weekDays[0], "d MMM")} - ${format(weekDays[6], "d MMM yyyy")}`}
          </h3>
        </div>

        <div className="flex gap-2">
          <button onClick={() => {
            setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
            setMobileDate(new Date());
            setMonthDate(new Date());
          }} className="px-2 sm:px-3 py-2 border border-border font-body text-xs uppercase tracking-wider hover:border-accent transition-colors rounded-lg">Today</button>
          <button onClick={() => {
            if (viewMode === "month") setMonthDate(addMonths(monthDate, 1));
            else if (viewMode === "day" || isMobile) setMobileDate(addDays(mobileDate, 1));
            else setWeekStart(addDays(weekStart, 7));
          }} className="p-2 border border-border hover:border-accent transition-colors rounded-lg">
            <ChevronRight size={14} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center"><p className="font-body text-muted-foreground animate-pulse">Loading calendar...</p></div>
      ) : (viewMode === "day" || isMobile) ? (
        /* Day View */
        <div>
          {!isDayAvailable(mobileDate) && (
            <div className="p-4 bg-secondary text-center mb-3 rounded-lg">
              <p className="font-body text-sm text-muted-foreground">Closed</p>
            </div>
          )}
          {mobileDayBookings.length === 0 && isDayAvailable(mobileDate) ? (
            <div className="p-8 bg-secondary text-center rounded-lg">
              <p className="font-body text-sm text-muted-foreground">No bookings</p>
            </div>
          ) : (
            <div className="space-y-2">
              {mobileDayBookings.map(b => (
                <div key={b.id} onClick={() => openEdit(b)}
                  className={`border rounded-lg p-3 cursor-pointer transition-colors hover:border-accent/30 ${STATUS_BG[b.status] || "bg-secondary"}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-body text-sm font-medium">{b.customer_name}</span>
                    <span className="font-body text-xs">{b.booking_time.slice(0, 5)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-body text-xs opacity-70">{(b.treatments as any)?.name} - {b.duration_mins}m</span>
                    <span className="font-body text-xs font-medium">£{Number(b.total_price).toFixed(0)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : viewMode === "month" ? (
        /* Month Grid */
        <div className="border border-border rounded-xl overflow-hidden">
          <div className="grid grid-cols-7 bg-secondary">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
              <div key={d} className="p-2 text-center font-body text-xs text-muted-foreground uppercase tracking-wider">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {Array.from({ length: firstDayOffset }).map((_, i) => (
              <div key={`empty-${i}`} className="p-2 border-t border-r border-border min-h-[80px] bg-secondary/20" />
            ))}
            {monthDays.map(day => {
              const dayBookings = getMonthDayBookings(day);
              const isToday = isSameDay(day, new Date());
              const available = isDayAvailable(day);
              return (
                <div key={day.toISOString()} onClick={() => { setMobileDate(day); setViewMode("day"); }}
                  className={`p-2 border-t border-r border-border min-h-[80px] cursor-pointer hover:bg-accent/5 transition-colors ${!available ? "bg-secondary/30" : ""} ${isToday ? "bg-accent/10" : ""}`}>
                  <p className={`font-body text-xs mb-1 ${isToday ? "text-accent font-bold" : "text-muted-foreground"}`}>{format(day, "d")}</p>
                  {dayBookings.slice(0, 3).map(b => (
                    <div key={b.id} className={`px-1 py-0.5 mb-0.5 rounded text-[10px] font-body truncate ${STATUS_BG[b.status] || "bg-secondary"}`}>
                      {b.booking_time.slice(0, 5)} {b.customer_name.split(" ")[0]}
                    </div>
                  ))}
                  {dayBookings.length > 3 && (
                    <p className="font-body text-[10px] text-muted-foreground">+{dayBookings.length - 3} more</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Desktop Week Grid */
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            <div className="grid grid-cols-8 border-b border-border">
              <div className="p-2 font-body text-xs text-muted-foreground">Time</div>
              {weekDays.map(day => (
                <div key={day.toISOString()} className={`p-2 text-center ${isSameDay(day, new Date()) ? "bg-accent/10" : ""} ${!isDayAvailable(day) ? "opacity-40" : ""}`}>
                  <p className="font-body text-xs text-muted-foreground">{format(day, "EEE")}</p>
                  <p className={`font-display text-lg ${isSameDay(day, new Date()) ? "text-accent" : ""}`}>{format(day, "d")}</p>
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
                      className={`p-1 border-l border-border/30 ${available ? "cursor-pointer hover:bg-accent/5" : "bg-secondary/30"} ${isSameDay(day, new Date()) ? "bg-accent/5" : ""}`}
                      onDragOver={e => { if (available) e.preventDefault(); }}
                      onDrop={() => handleDrop(day, hour)}>
                      {slotBookings.map(b => (
                        <div key={b.id} draggable onDragStart={() => setDragBooking(b)} onDragEnd={() => setDragBooking(null)} onClick={() => openEdit(b)}
                          className={`px-2 py-1 mb-1 border rounded text-xs cursor-pointer hover:ring-1 hover:ring-accent/50 ${STATUS_BG[b.status] || "bg-secondary"}`}>
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

      <p className="font-body text-xs text-muted-foreground mt-4 text-center">
        {isMobile ? "Tap a booking to edit details." : "Click a booking to edit details. Drag and drop to reschedule."}
      </p>

      {/* Edit Modal */}
      {editBooking && editForm && (
        <div className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center p-0 lg:p-4" onClick={() => { setEditBooking(null); setEditForm(null); }}>
          <div className="bg-background border border-border w-full h-full lg:h-auto lg:max-w-lg lg:max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-display text-xl">Edit Booking</h3>
              <button onClick={() => { setEditBooking(null); setEditForm(null); }} className="text-muted-foreground hover:text-foreground"><X size={16} strokeWidth={1.5} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="font-body text-xs uppercase tracking-wider text-muted-foreground block mb-1">Customer Name</label>
                <input value={editForm.customer_name} onChange={e => setEditForm({ ...editForm, customer_name: e.target.value })}
                  className="w-full border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-accent focus:outline-none rounded-lg" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-body text-xs uppercase tracking-wider text-muted-foreground block mb-1">Email</label>
                  <input value={editForm.customer_email} onChange={e => setEditForm({ ...editForm, customer_email: e.target.value })}
                    className="w-full border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-accent focus:outline-none rounded-lg" />
                </div>
                <div>
                  <label className="font-body text-xs uppercase tracking-wider text-muted-foreground block mb-1">Phone</label>
                  <input value={editForm.customer_phone} onChange={e => setEditForm({ ...editForm, customer_phone: e.target.value })}
                    className="w-full border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-accent focus:outline-none rounded-lg" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-body text-xs uppercase tracking-wider text-muted-foreground block mb-1">Date</label>
                  <input type="date" value={editForm.booking_date} onChange={e => setEditForm({ ...editForm, booking_date: e.target.value })}
                    className="w-full border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-accent focus:outline-none rounded-lg" />
                </div>
                <div>
                  <label className="font-body text-xs uppercase tracking-wider text-muted-foreground block mb-1">Time</label>
                  <input type="time" value={editForm.booking_time} onChange={e => setEditForm({ ...editForm, booking_time: e.target.value })}
                    className="w-full border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-accent focus:outline-none rounded-lg" />
                </div>
              </div>
              <div>
                <label className="font-body text-xs uppercase tracking-wider text-muted-foreground block mb-1">Total Price (£)</label>
                <input type="number" step="0.01" value={editForm.total_price} onChange={e => setEditForm({ ...editForm, total_price: e.target.value })}
                  className="w-full border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-accent focus:outline-none rounded-lg" />
              </div>
              <div>
                <label className="font-body text-xs uppercase tracking-wider text-muted-foreground block mb-1">Status</label>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map(s => (
                    <button key={s} onClick={() => setEditForm({ ...editForm, status: s })}
                      className={`px-3 py-1.5 border font-body text-xs uppercase tracking-wider rounded-lg transition-colors ${editForm.status === s ? "border-accent bg-accent/10 text-accent" : "border-border text-muted-foreground hover:border-foreground"}`}>
                      {s === "no_show" ? "No Show" : s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="font-body text-xs uppercase tracking-wider text-muted-foreground block mb-1">Notes</label>
                <textarea value={editForm.notes} onChange={e => setEditForm({ ...editForm, notes: e.target.value })} rows={3}
                  className="w-full border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-accent focus:outline-none resize-none rounded-lg" />
              </div>

              {showPaymentActions && (
                <div className="border border-accent/30 bg-accent/5 p-4 space-y-3 rounded-lg">
                  <p className="font-body text-xs uppercase tracking-wider text-accent flex items-center gap-1"><CreditCard size={12} /> Payment Actions</p>
                  <p className="font-body text-xs text-muted-foreground">
                    Outstanding: £{(Number(editForm.total_price || editBooking.total_price) - Number(editBooking.deposit_amount || 0)).toFixed(2)}
                    {editBooking.payment_status === "deposit_paid" && ` (deposit of £${Number(editBooking.deposit_amount).toFixed(2)} received)`}
                  </p>
                  <div>
                    <label className="font-body text-xs text-muted-foreground block mb-1">Charge Amount (£)</label>
                    <input type="number" step="0.01" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)}
                      className="w-full border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-accent focus:outline-none rounded-lg" />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button onClick={handleTakeCardPayment} disabled={creatingPaymentLink}
                      className="flex items-center gap-1 px-3 py-2 bg-foreground text-background font-body text-xs uppercase tracking-wider rounded-lg hover:bg-accent transition-colors disabled:opacity-50">
                      <CreditCard size={12} /> {creatingPaymentLink ? "Creating..." : "Take Card Payment"}
                    </button>
                    <button onClick={handleSendPaymentLink} disabled={creatingPaymentLink}
                      className="flex items-center gap-1 px-3 py-2 border border-border font-body text-xs uppercase tracking-wider rounded-lg hover:border-accent transition-colors disabled:opacity-50">
                      <LinkIcon size={12} /> Send Link
                    </button>
                  </div>
                  {!showPaymentMethodPicker ? (
                    <button onClick={() => setShowPaymentMethodPicker(true)}
                      className="flex items-center gap-1 px-3 py-2 border border-green-600/30 text-green-600 font-body text-xs uppercase tracking-wider rounded-lg hover:bg-green-600/10 transition-colors w-full justify-center">
                      <DollarSign size={12} /> Mark as Paid
                    </button>
                  ) : (
                    <div className="border border-border p-3 space-y-2 rounded-lg">
                      <p className="font-body text-xs text-muted-foreground">Payment method:</p>
                      <div className="flex flex-wrap gap-2">
                        {PAYMENT_METHODS.map(m => (
                          <button key={m} onClick={() => setPaymentMethod(m)}
                            className={`px-3 py-1.5 border font-body text-xs rounded-lg transition-colors ${paymentMethod === m ? "border-accent bg-accent/10 text-accent" : "border-border text-muted-foreground hover:border-foreground"}`}>
                            {m}
                          </button>
                        ))}
                      </div>
                      <input value={paymentRef} onChange={e => setPaymentRef(e.target.value)} placeholder="Reference (optional)"
                        className="w-full border border-border bg-transparent px-3 py-2 font-body text-xs focus:border-accent focus:outline-none rounded-lg" />
                      <div className="flex gap-2">
                        <button onClick={() => handleMarkPaid(paymentMethod || "Manual")}
                          className="flex-1 px-3 py-2 bg-green-600 text-white font-body text-xs uppercase tracking-wider rounded-lg hover:bg-green-700 transition-colors">Confirm Paid</button>
                        <button onClick={() => setShowPaymentMethodPicker(false)}
                          className="px-3 py-2 border border-border font-body text-xs uppercase tracking-wider rounded-lg hover:border-foreground transition-colors">Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Payment Plan Section */}
              <div className="border border-border p-4 space-y-3 rounded-lg">
                <p className="font-body text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1"><Banknote size={12} /> Payment Plan</p>
                {paymentPlan ? (
                  <div className="space-y-2">
                    <div className="font-body text-xs space-y-1">
                      <p>Total: £{Number(paymentPlan.total_amount).toFixed(2)} - {paymentPlan.total_instalments} instalments of £{Number(paymentPlan.instalment_amount).toFixed(2)}</p>
                      <p>Paid: {paymentPlan.paid_instalments}/{paymentPlan.total_instalments} - Status: <span className={paymentPlan.status === "completed" ? "text-green-600" : "text-accent"}>{paymentPlan.status}</span></p>
                      {paymentPlan.next_payment_date && <p>Next payment: {paymentPlan.next_payment_date}</p>}
                    </div>
                    {paymentPlan.status === "active" && (
                      <button onClick={handleRecordInstalment}
                        className="flex items-center gap-1 px-3 py-2 bg-foreground text-background font-body text-xs uppercase tracking-wider rounded-lg hover:bg-accent transition-colors">
                        <Check size={12} /> Record Instalment
                      </button>
                    )}
                  </div>
                ) : !showCreatePlan ? (
                  <button onClick={() => {
                    const total = Number(editForm?.total_price || editBooking.total_price);
                    setPlanAmount(String((total / 3).toFixed(2)));
                    setPlanNextDate(format(addDays(new Date(), 30), "yyyy-MM-dd"));
                    setShowCreatePlan(true);
                  }}
                    className="flex items-center gap-1 px-3 py-2 border border-border font-body text-xs uppercase tracking-wider rounded-lg hover:border-accent transition-colors">
                    <CalendarPlus size={12} /> Create Payment Plan
                  </button>
                ) : (
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="font-body text-[10px] text-muted-foreground block mb-1">Instalments</label>
                        <input type="number" value={planInstalments} onChange={e => {
                          setPlanInstalments(e.target.value);
                          const total = Number(editForm?.total_price || editBooking.total_price);
                          setPlanAmount(String((total / (Number(e.target.value) || 1)).toFixed(2)));
                        }}
                          className="w-full border border-border bg-transparent px-3 py-2 font-body text-xs focus:border-accent focus:outline-none rounded-lg" />
                      </div>
                      <div>
                        <label className="font-body text-[10px] text-muted-foreground block mb-1">Per Instalment (£)</label>
                        <input type="number" step="0.01" value={planAmount} onChange={e => setPlanAmount(e.target.value)}
                          className="w-full border border-border bg-transparent px-3 py-2 font-body text-xs focus:border-accent focus:outline-none rounded-lg" />
                      </div>
                    </div>
                    <div>
                      <label className="font-body text-[10px] text-muted-foreground block mb-1">Next Payment Date</label>
                      <input type="date" value={planNextDate} onChange={e => setPlanNextDate(e.target.value)}
                        className="w-full border border-border bg-transparent px-3 py-2 font-body text-xs focus:border-accent focus:outline-none rounded-lg" />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={handleCreatePlan} disabled={loadingPlan}
                        className="flex-1 px-3 py-2 bg-foreground text-background font-body text-xs uppercase tracking-wider rounded-lg hover:bg-accent transition-colors disabled:opacity-50">
                        {loadingPlan ? "Creating..." : "Create Plan"}
                      </button>
                      <button onClick={() => setShowCreatePlan(false)}
                        className="px-3 py-2 border border-border font-body text-xs uppercase tracking-wider rounded-lg hover:border-foreground transition-colors">Cancel</button>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-border pt-4 flex items-center justify-between flex-wrap gap-2">
                <div className="font-body text-xs text-muted-foreground">
                  <p>Treatment: {(editBooking.treatments as any)?.name}</p>
                  <p>Total: £{Number(editForm.total_price).toFixed(2)} - <span className={editBooking.payment_status === "fully_paid" ? "text-green-600" : "text-accent"}>{editBooking.payment_status}</span></p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditBooking(null); setEditForm(null); }} className="px-4 py-2 border border-border font-body text-xs uppercase tracking-wider rounded-lg hover:border-foreground transition-colors">Cancel</button>
                  <button onClick={saveEdit} disabled={saving} className="px-4 py-2 bg-foreground text-background font-body text-xs uppercase tracking-wider rounded-lg hover:bg-accent transition-colors disabled:opacity-50 flex items-center gap-1">
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
