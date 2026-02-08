import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Clock, User, Mail, Phone, Check, X, AlertTriangle, Download, Search, Filter, Bell } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

type Booking = {
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
  discount_amount: number | null;
  notes: string | null;
  created_at: string;
  treatment_id: string;
  treatments?: { name: string } | null;
};

const STATUS_OPTIONS = ["confirmed", "completed", "cancelled", "no_show", "pending"];
const STATUS_COLORS: Record<string, string> = {
  confirmed: "text-blue-600 border-blue-600/30",
  completed: "text-green-600 border-green-600/30",
  cancelled: "text-red-500 border-red-500/30",
  no_show: "text-orange-500 border-orange-500/30",
  pending: "text-yellow-600 border-yellow-600/30",
};

const AdminBookingsTab = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const fetchBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("bookings")
      .select("*, treatments(name)")
      .order("booking_date", { ascending: false });

    if (data) setBookings(data as unknown as Booking[]);
    if (error) toast.error("Failed to load bookings");
    setLoading(false);
  };

  useEffect(() => { fetchBookings(); }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    const booking = bookings.find(b => b.id === id);
    if (!booking) return;

    // Confirm destructive actions
    if (newStatus === "cancelled" && !confirm(`Cancel ${booking.customer_name}'s booking? An email will be sent.`)) return;
    if (newStatus === "completed" && !confirm(`Mark ${booking.customer_name}'s booking as completed? An aftercare email will be sent.`)) return;
    if (newStatus === "no_show" && !confirm(`Mark ${booking.customer_name} as no-show?`)) return;

    const { error } = await supabase
      .from("bookings")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update status");
      return;
    }
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
    toast.success(`Booking marked as ${newStatus}`);

    // Send email based on status change
    if (newStatus === "completed") {
      supabase.functions.invoke("send-booking-email", { body: { bookingId: id, emailType: "aftercare" } })
        .then(() => toast.success("Aftercare email sent"))
        .catch(() => toast.error("Failed to send aftercare email"));
    } else if (newStatus === "cancelled") {
      supabase.functions.invoke("send-booking-email", { body: { bookingId: id, emailType: "cancellation" } })
        .then(() => toast.success("Cancellation email sent"))
        .catch(() => toast.error("Failed to send cancellation email"));
    }
  };

  const sendReminder = async (id: string) => {
    const booking = bookings.find(b => b.id === id);
    if (!booking) return;
    if (!confirm(`Send a reminder email to ${booking.customer_name}?`)) return;

    try {
      await supabase.functions.invoke("send-booking-email", { body: { bookingId: id, emailType: "reminder" } });
      toast.success("Reminder sent!");
    } catch {
      toast.error("Failed to send reminder");
    }
  };

  const filtered = bookings
    .filter(b => statusFilter === "all" || b.status === statusFilter)
    .filter(b => {
      if (!search) return true;
      const s = search.toLowerCase();
      return b.customer_name.toLowerCase().includes(s) || b.customer_email.toLowerCase().includes(s);
    });

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === "confirmed").length,
    completed: bookings.filter(b => b.status === "completed").length,
    cancelled: bookings.filter(b => b.status === "cancelled").length,
    noShow: bookings.filter(b => b.status === "no_show").length,
    revenue: bookings.filter(b => b.payment_status === "fully_paid" || b.payment_status === "deposit_paid").reduce((sum, b) => sum + Number(b.total_price), 0),
  };

  const exportCSV = () => {
    const rows = filtered.map(b => ({
      Name: b.customer_name,
      Email: b.customer_email,
      Phone: b.customer_phone || "",
      Treatment: (b.treatments as any)?.name || "",
      Date: b.booking_date,
      Time: b.booking_time,
      Status: b.status,
      Payment: b.payment_status,
      Total: `£${Number(b.total_price).toFixed(2)}`,
    }));
    const headers = Object.keys(rows[0] || {});
    const csv = [headers.join(","), ...rows.map(r => headers.map(h => `"${(r as any)[h]}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `bookings-${new Date().toISOString().slice(0,10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="py-12 text-center"><p className="font-body text-muted-foreground animate-pulse">Loading bookings...</p></div>;

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
        {[
          { label: "Total", value: stats.total },
          { label: "Confirmed", value: stats.confirmed, color: "text-blue-600" },
          { label: "Completed", value: stats.completed, color: "text-green-600" },
          { label: "Cancelled", value: stats.cancelled, color: "text-red-500" },
          { label: "No Shows", value: stats.noShow, color: "text-orange-500" },
          { label: "Revenue", value: `£${stats.revenue.toFixed(0)}`, color: "text-gold" },
        ].map(s => (
          <div key={s.label} className="border border-border p-4">
            <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1">{s.label}</p>
            <p className={`font-display text-2xl ${s.color || ""}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2 border border-border bg-transparent font-body text-sm focus:border-gold focus:outline-none"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", ...STATUS_OPTIONS].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 font-body text-xs tracking-wider uppercase border transition-colors ${statusFilter === s ? "border-gold text-gold" : "border-border text-muted-foreground hover:border-foreground"}`}
            >
              {s === "no_show" ? "No Show" : s}
            </button>
          ))}
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 border border-border font-body text-xs tracking-wider uppercase text-muted-foreground hover:text-foreground hover:border-foreground transition-colors">
          <Download size={14} /> Export
        </button>
      </div>

      {/* Bookings List */}
      {filtered.length === 0 ? (
        <div className="p-12 bg-secondary text-center">
          <p className="font-body text-muted-foreground">No bookings found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(b => (
            <div key={b.id} className="border border-border p-5 hover:border-gold/30 transition-colors">
              <div className="flex flex-wrap gap-4 items-center mb-3">
                <div className="flex items-center gap-2">
                  <User size={14} className="text-gold" />
                  <span className="font-body text-sm font-medium">{b.customer_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-muted-foreground" />
                  <a href={`mailto:${b.customer_email}`} className="font-body text-xs hover:text-gold transition-colors">{b.customer_email}</a>
                </div>
                {b.customer_phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-muted-foreground" />
                    <a href={`tel:${b.customer_phone}`} className="font-body text-xs">{b.customer_phone}</a>
                  </div>
                )}
                <div className="ml-auto flex items-center gap-2">
                  <Calendar size={14} className="text-muted-foreground" />
                  <span className="font-body text-xs text-muted-foreground">{b.booking_date} at {b.booking_time?.slice(0, 5)}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 items-center">
                <span className="font-body text-xs bg-secondary px-2 py-1">{(b.treatments as any)?.name || "Treatment"}</span>
                <span className="font-body text-xs text-muted-foreground">{b.duration_mins} mins</span>
                <span className="font-body text-xs font-medium">£{Number(b.total_price).toFixed(2)}</span>
                {Number(b.deposit_amount) > 0 && (
                  <span className="font-body text-xs text-gold">Deposit: £{Number(b.deposit_amount).toFixed(2)}</span>
                )}

                <div className="ml-auto flex gap-2 flex-wrap">
                  {b.status === "confirmed" && (
                    <button onClick={() => sendReminder(b.id)} className="px-2 py-1 border border-border text-muted-foreground hover:text-gold hover:border-gold font-body text-xs tracking-wider uppercase transition-colors flex items-center gap-1">
                      <Bell size={12} /> Remind
                    </button>
                  )}
                  {STATUS_OPTIONS.map(s => (
                    <button
                      key={s}
                      onClick={() => updateStatus(b.id, s)}
                      className={`px-2 py-1 border font-body text-xs tracking-wider uppercase transition-colors ${b.status === s ? STATUS_COLORS[s] || "" : "border-border text-muted-foreground hover:border-foreground opacity-50 hover:opacity-100"}`}
                    >
                      {s === "no_show" ? "No Show" : s}
                    </button>
                  ))}
                </div>
              </div>
              {b.notes && <p className="font-body text-xs text-muted-foreground mt-2 italic">Note: {b.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBookingsTab;
