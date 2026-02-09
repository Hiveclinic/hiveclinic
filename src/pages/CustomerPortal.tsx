import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, User, LogOut, ChevronRight, RefreshCw } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format, addDays, startOfDay, differenceInHours, parse } from "date-fns";

type Booking = {
  id: string;
  booking_date: string;
  booking_time: string;
  duration_mins: number;
  status: string;
  payment_status: string;
  total_price: number;
  deposit_amount: number | null;
  notes: string | null;
  created_at: string;
  reschedule_count: number;
  treatments?: { name: string } | null;
};

type AvailabilitySlot = {
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
};

const STATUS_COLORS: Record<string, string> = {
  confirmed: "text-blue-600",
  completed: "text-green-600",
  cancelled: "text-red-500",
  no_show: "text-orange-500",
  pending: "text-yellow-600",
};

const CustomerPortal = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [existingBookings, setExistingBookings] = useState<{ booking_date: string; booking_time: string }[]>([]);
  const [newDate, setNewDate] = useState<Date | null>(null);
  const [newTime, setNewTime] = useState<string | null>(null);
  const [rescheduling, setRescheduling] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setLoading(false); return; }
      setUser(session.user);

      const [bookingsRes, availRes, blockedRes, existingRes] = await Promise.all([
        supabase.from("bookings").select("*, treatments(name)").eq("user_id", session.user.id).order("booking_date", { ascending: false }),
        supabase.from("availability").select("*"),
        supabase.from("blocked_dates").select("blocked_date"),
        supabase.from("bookings").select("booking_date, booking_time").in("status", ["pending", "confirmed"]),
      ]);

      if (bookingsRes.data) setBookings(bookingsRes.data as unknown as Booking[]);
      if (availRes.data) setAvailability(availRes.data as AvailabilitySlot[]);
      if (blockedRes.data) setBlockedDates(blockedRes.data.map((d: any) => d.blocked_date));
      if (existingRes.data) setExistingBookings(existingRes.data);
      setLoading(false);
    };
    init();
  }, []);

  const cancelBooking = async (id: string) => {
    const booking = bookings.find(b => b.id === id);
    if (!booking) return;

    const bookingDateTime = new Date(`${booking.booking_date}T${booking.booking_time}`);
    const hoursUntil = differenceInHours(bookingDateTime, new Date());

    if (hoursUntil < 48) {
      toast.error("Cancellations must be made at least 48 hours before your appointment.");
      return;
    }

    if (!confirm("Are you sure you want to cancel this booking?")) return;
    const { error } = await supabase.from("bookings").update({ status: "cancelled" }).eq("id", id);
    if (error) { toast.error("Failed to cancel"); return; }
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "cancelled" } : b));
    toast.success("Booking cancelled. If you'd like to rebook, contact us via WhatsApp or visit our website.");
  };

  const canReschedule = (booking: Booking) => {
    if (booking.status !== "confirmed" && booking.status !== "pending") return false;
    if ((booking.reschedule_count || 0) >= 2) return false;
    const bookingDateTime = new Date(`${booking.booking_date}T${booking.booking_time}`);
    return differenceInHours(bookingDateTime, new Date()) >= 48;
  };

  const availableDates = () => {
    const dates: Date[] = [];
    const today = startOfDay(new Date());
    for (let i = 1; i <= 30; i++) {
      const date = addDays(today, i);
      const dayOfWeek = date.getDay();
      const avail = availability.find(a => a.day_of_week === dayOfWeek);
      const dateStr = format(date, "yyyy-MM-dd");
      if (avail?.is_available && !blockedDates.includes(dateStr)) dates.push(date);
    }
    return dates;
  };

  const getTimeSlots = (date: Date, durationMins: number) => {
    const dayOfWeek = date.getDay();
    const avail = availability.find(a => a.day_of_week === dayOfWeek);
    if (!avail?.is_available) return [];

    const slots: string[] = [];
    const [startH, startM] = avail.start_time.split(":").map(Number);
    const [endH, endM] = avail.end_time.split(":").map(Number);
    const startMins = startH * 60 + startM;
    const endMins = endH * 60 + endM;
    const dateStr = format(date, "yyyy-MM-dd");

    for (let m = startMins; m + durationMins <= endMins; m += 30) {
      const h = Math.floor(m / 60);
      const min = m % 60;
      const timeStr = `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
      const taken = existingBookings.some(b => b.booking_date === dateStr && b.booking_time === `${timeStr}:00`);
      if (!taken) slots.push(timeStr);
    }
    return slots;
  };

  const handleReschedule = async (id: string) => {
    if (!newDate || !newTime) { toast.error("Please select a new date and time"); return; }
    const booking = bookings.find(b => b.id === id);
    if (!booking) return;

    setRescheduling(true);
    const { error } = await supabase.from("bookings").update({
      booking_date: format(newDate, "yyyy-MM-dd"),
      booking_time: `${newTime}:00`,
      reschedule_count: (booking.reschedule_count || 0) + 1,
    }).eq("id", id);

    if (error) {
      toast.error("Failed to reschedule");
      setRescheduling(false);
      return;
    }

    // Send reschedule confirmation email
    supabase.functions.invoke("send-booking-email", { body: { bookingId: id, emailType: "reschedule" } }).catch(() => {});

    setBookings(prev => prev.map(b => b.id === id ? {
      ...b,
      booking_date: format(newDate, "yyyy-MM-dd"),
      booking_time: `${newTime}:00`,
      reschedule_count: (b.reschedule_count || 0) + 1,
    } : b));
    toast.success("Appointment rescheduled successfully!");
    setRescheduleId(null);
    setNewDate(null);
    setNewTime(null);
    setRescheduling(false);
  };

  const upcomingBookings = bookings.filter(b => b.status === "confirmed" || b.status === "pending");
  const pastBookings = bookings.filter(b => b.status === "completed" || b.status === "cancelled" || b.status === "no_show");

  if (loading) return <Layout><section className="py-24 text-center"><p className="font-body text-muted-foreground animate-pulse">Loading...</p></section></Layout>;

  if (!user) {
    return (
      <Layout>
        <section className="py-24">
          <div className="max-w-lg mx-auto px-6 text-center">
            <h1 className="font-display text-5xl mb-4">My Appointments</h1>
            <p className="font-body text-muted-foreground mb-8">Sign in to view your booking history, reschedule, or manage your appointments.</p>
            <Link to="/auth" className="inline-flex items-center gap-2 px-8 py-4 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-accent transition-colors">
              Sign In <ChevronRight size={14} />
            </Link>
            <p className="font-body text-xs text-muted-foreground mt-6">Don't have an account? You can create one when signing in.</p>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between mb-10">
            <div>
              <h1 className="font-display text-4xl md:text-5xl">My Appointments</h1>
              <p className="font-body text-muted-foreground mt-2">{user.email}</p>
            </div>
            <button onClick={async () => { await supabase.auth.signOut(); navigate("/"); }} className="flex items-center gap-2 px-4 py-2 border border-border font-body text-xs tracking-wider uppercase hover:border-gold transition-colors">
              <LogOut size={14} /> Sign Out
            </button>
          </motion.div>

          <Link to="/bookings" className="block border border-gold/30 bg-gold/5 p-6 mb-10 text-center hover:border-gold transition-colors">
            <p className="font-display text-xl mb-1">Book a New Treatment</p>
            <p className="font-body text-xs text-muted-foreground">Browse our full range of treatments and secure your slot online.</p>
          </Link>

          {/* Upcoming */}
          <div className="mb-10">
            <h2 className="font-display text-2xl mb-4">Upcoming ({upcomingBookings.length})</h2>
            {upcomingBookings.length === 0 ? (
              <div className="p-8 bg-secondary text-center"><p className="font-body text-muted-foreground">No upcoming appointments.</p></div>
            ) : (
              <div className="space-y-3">
                {upcomingBookings.map(b => (
                  <div key={b.id} className="border border-border p-5 hover:border-gold/30 transition-colors">
                    <div className="flex flex-wrap gap-4 items-center mb-2">
                      <span className="font-body text-sm font-medium">{(b.treatments as any)?.name || "Treatment"}</span>
                      <span className={`font-body text-xs uppercase tracking-wider ${STATUS_COLORS[b.status] || ""}`}>{b.status}</span>
                      <span className="ml-auto font-body text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar size={12} /> {new Date(b.booking_date + "T00:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}
                      </span>
                      <span className="font-body text-xs text-muted-foreground flex items-center gap-1">
                        <Clock size={12} /> {b.booking_time?.slice(0, 5)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-3 flex-wrap">
                      <span className="font-body text-xs text-muted-foreground">{b.duration_mins} mins - £{Number(b.total_price).toFixed(2)}</span>
                      {(b.reschedule_count || 0) > 0 && (
                        <span className="font-body text-[10px] text-muted-foreground">Rescheduled {b.reschedule_count}/2</span>
                      )}
                      <div className="ml-auto flex gap-2">
                        {canReschedule(b) && (
                          <button onClick={() => { setRescheduleId(rescheduleId === b.id ? null : b.id); setNewDate(null); setNewTime(null); }} className="px-4 py-1.5 border border-border font-body text-xs tracking-wider uppercase text-muted-foreground hover:text-gold hover:border-gold transition-colors flex items-center gap-1">
                            <RefreshCw size={12} /> Reschedule
                          </button>
                        )}
                        {(b.status === "confirmed" || b.status === "pending") && (
                          <button onClick={() => cancelBooking(b.id)} className="px-4 py-1.5 border border-border font-body text-xs tracking-wider uppercase text-muted-foreground hover:text-red-500 hover:border-red-500 transition-colors">
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Reschedule panel */}
                    {rescheduleId === b.id && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="font-body text-xs text-muted-foreground mb-3">
                          Select a new date and time. You can reschedule up to 2 times, at least 48 hours before your appointment.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-2">New Date</p>
                            <div className="grid grid-cols-3 gap-1 max-h-48 overflow-y-auto">
                              {availableDates().map(date => (
                                <button key={date.toISOString()} onClick={() => { setNewDate(date); setNewTime(null); }} className={`p-2 border text-center transition-all text-xs ${newDate?.toDateString() === date.toDateString() ? "border-gold bg-gold/5" : "border-border hover:border-gold/50"}`}>
                                  <p className="font-body text-[10px] text-muted-foreground">{format(date, "EEE")}</p>
                                  <p className="font-display text-sm">{format(date, "d MMM")}</p>
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-2">New Time</p>
                            {newDate ? (
                              <div className="grid grid-cols-3 gap-1 max-h-48 overflow-y-auto">
                                {getTimeSlots(newDate, b.duration_mins).map(time => (
                                  <button key={time} onClick={() => setNewTime(time)} className={`py-2 px-2 border font-body text-xs transition-all ${newTime === time ? "border-gold bg-gold/5" : "border-border hover:border-gold/50"}`}>{time}</button>
                                ))}
                              </div>
                            ) : <p className="font-body text-xs text-muted-foreground">Select a date first.</p>}
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <button onClick={() => handleReschedule(b.id)} disabled={!newDate || !newTime || rescheduling} className="px-4 py-2 bg-foreground text-background font-body text-xs uppercase tracking-wider hover:bg-accent transition-colors disabled:opacity-30">
                            {rescheduling ? "Rescheduling..." : "Confirm Reschedule"}
                          </button>
                          <button onClick={() => setRescheduleId(null)} className="px-4 py-2 border border-border font-body text-xs uppercase tracking-wider hover:border-foreground transition-colors">Cancel</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past */}
          <div>
            <h2 className="font-display text-2xl mb-4">Past Appointments ({pastBookings.length})</h2>
            {pastBookings.length === 0 ? (
              <div className="p-8 bg-secondary text-center"><p className="font-body text-muted-foreground">No past appointments.</p></div>
            ) : (
              <div className="space-y-3">
                {pastBookings.map(b => (
                  <div key={b.id} className="border border-border/50 p-5 opacity-70">
                    <div className="flex flex-wrap gap-4 items-center">
                      <span className="font-body text-sm">{(b.treatments as any)?.name || "Treatment"}</span>
                      <span className={`font-body text-xs uppercase tracking-wider ${STATUS_COLORS[b.status] || ""}`}>{b.status === "no_show" ? "No Show" : b.status}</span>
                      <span className="ml-auto font-body text-xs text-muted-foreground">{new Date(b.booking_date + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                      <span className="font-body text-xs">£{Number(b.total_price).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CustomerPortal;
