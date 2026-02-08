import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, User, LogOut, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

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
  treatments?: { name: string } | null;
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
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setLoading(false); return; }
      setUser(session.user);

      const { data } = await supabase
        .from("bookings")
        .select("*, treatments(name)")
        .eq("user_id", session.user.id)
        .order("booking_date", { ascending: false });

      if (data) setBookings(data as unknown as Booking[]);
      setLoading(false);
    };
    init();
  }, []);

  const cancelBooking = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    const { error } = await supabase.from("bookings").update({ status: "cancelled" }).eq("id", id);
    if (error) { toast.error("Failed to cancel"); return; }
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "cancelled" } : b));
    toast.success("Booking cancelled. You may be eligible for a refund — we'll be in touch.");
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

          {/* Quick Action */}
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
                    <div className="flex items-center gap-3 mt-3">
                      <span className="font-body text-xs text-muted-foreground">{b.duration_mins} mins · £{Number(b.total_price).toFixed(2)}</span>
                      {(b.status === "confirmed" || b.status === "pending") && (
                        <button onClick={() => cancelBooking(b.id)} className="ml-auto px-4 py-1.5 border border-border font-body text-xs tracking-wider uppercase text-muted-foreground hover:text-red-500 hover:border-red-500 transition-colors">
                          Cancel
                        </button>
                      )}
                    </div>
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
                      <span className="ml-auto font-body text-xs text-muted-foreground">
                        {new Date(b.booking_date + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
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
