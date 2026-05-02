import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Users, PoundSterling, TrendingUp, Clock, Star, Package, AlertTriangle, FileText, Plus, Upload, Tag, UserPlus } from "lucide-react";
import { format, subDays, startOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

type QuickStats = {
  todayBookings: number;
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
  newClientsWeek: number;
  repeatRate: number;
  consultationsBooked: number;
  packageSales: number;
  noShows: number;
  pendingForms: number;
  lowStockAlerts: number;
};

type RevenueDataPoint = { label: string; revenue: number };
type TreatmentPopularity = { name: string; count: number };
type UpcomingBooking = { id: string; customer_name: string; treatment_name: string; booking_time: string; status: string };

const CHART_COLORS = ["hsl(30, 40%, 40%)", "hsl(30, 40%, 55%)", "hsl(30, 40%, 70%)", "hsl(0, 0%, 30%)", "hsl(0, 0%, 50%)", "hsl(0, 0%, 70%)"];

const AdminDashboardHome = ({ onNavigate }: { onNavigate: (tab: string) => void }) => {
  const [stats, setStats] = useState<QuickStats>({
    todayBookings: 0, todayRevenue: 0, weekRevenue: 0, monthRevenue: 0,
    newClientsWeek: 0, repeatRate: 0, consultationsBooked: 0, packageSales: 0,
    noShows: 0, pendingForms: 0, lowStockAlerts: 0,
  });
  const [weeklyRevenue, setWeeklyRevenue] = useState<RevenueDataPoint[]>([]);
  const [topTreatments, setTopTreatments] = useState<TreatmentPopularity[]>([]);
  const [upcoming, setUpcoming] = useState<UpcomingBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      const today = format(new Date(), "yyyy-MM-dd");
      const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd");
      const monthStart = format(startOfMonth(new Date()), "yyyy-MM-dd");
      const monthEnd = format(endOfMonth(new Date()), "yyyy-MM-dd");

      const [todayBookingsRes, weekBookingsRes, monthBookingsRes, allBookingsRes, upcomingRes, inventoryRes, formsRes] = await Promise.all([
        supabase.from("bookings").select("id, total_price, status").eq("booking_date", today),
        supabase.from("bookings").select("id, total_price, booking_date, status, customer_email").gte("booking_date", weekStart),
        supabase.from("bookings").select("id, total_price, booking_date, status, treatment_id, treatments(name)").gte("booking_date", monthStart).lte("booking_date", monthEnd),
        supabase.from("bookings").select("customer_email, booking_date, status"),
        supabase.from("bookings").select("id, customer_name, booking_time, status, treatments(name)").eq("booking_date", today).in("status", ["confirmed", "pending"]).order("booking_time"),
        supabase.from("inventory_items").select("id").lte("stock_level", 5).eq("active", true),
        supabase.from("consent_submissions").select("id").eq("status", "pending"),
      ]);

      const todayData = todayBookingsRes.data || [];
      const weekData = weekBookingsRes.data || [];
      const monthData = monthBookingsRes.data || [];
      const allData = allBookingsRes.data || [];

      // Calculate stats
      const todayConfirmed = todayData.filter(b => b.status !== "cancelled");
      const todayRevenue = todayConfirmed.reduce((s, b) => s + Number(b.total_price), 0);
      const weekConfirmed = weekData.filter(b => b.status !== "cancelled");
      const weekRevenue = weekConfirmed.reduce((s, b) => s + Number(b.total_price), 0);
      const monthConfirmed = monthData.filter(b => b.status !== "cancelled");
      const monthRevenue = monthConfirmed.reduce((s, b) => s + Number(b.total_price), 0);

      // New clients this week
      const allEmails = new Set(allData.filter(b => b.booking_date < weekStart).map(b => b.customer_email));
      const weekEmails = new Set(weekData.map(b => b.customer_email));
      const newClients = [...weekEmails].filter(e => !allEmails.has(e)).length;

      // Repeat rate
      const emailCounts = new Map<string, number>();
      allData.filter(b => b.status === "completed").forEach(b => emailCounts.set(b.customer_email, (emailCounts.get(b.customer_email) || 0) + 1));
      const totalClients = emailCounts.size;
      const repeats = [...emailCounts.values()].filter(c => c > 1).length;
      const repeatRate = totalClients > 0 ? Math.round((repeats / totalClients) * 100) : 0;

      // No shows this month
      const noShows = monthData.filter(b => b.status === "no_show").length;

      // Top treatments
      const treatmentCounts = new Map<string, number>();
      monthData.filter(b => b.status !== "cancelled").forEach(b => {
        const name = (b.treatments as any)?.name || "Unknown";
        treatmentCounts.set(name, (treatmentCounts.get(name) || 0) + 1);
      });
      const sortedTreatments = [...treatmentCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, count]) => ({ name, count }));

      // Weekly revenue (last 8 weeks)
      const weeklyData: RevenueDataPoint[] = [];
      for (let i = 7; i >= 0; i--) {
        const ws = startOfWeek(subDays(new Date(), i * 7), { weekStartsOn: 1 });
        const we = subDays(startOfWeek(subDays(new Date(), (i - 1) * 7), { weekStartsOn: 1 }), 1);
        const wsStr = format(ws, "yyyy-MM-dd");
        const weStr = format(we, "yyyy-MM-dd");
        const rev = allData.filter(b => b.booking_date >= wsStr && b.booking_date <= weStr && b.status !== "cancelled")
          .reduce((s, b) => s + Number((b as any).total_price || 0), 0);
        weeklyData.push({ label: format(ws, "d MMM"), revenue: rev });
      }

      // Upcoming today
      const upcomingBookings: UpcomingBooking[] = (upcomingRes.data || []).slice(0, 8).map((b: any) => ({
        id: b.id,
        customer_name: b.customer_name,
        treatment_name: b.treatments?.name || "Treatment",
        booking_time: b.booking_time?.slice(0, 5),
        status: b.status,
      }));

      setStats({
        todayBookings: todayConfirmed.length,
        todayRevenue,
        weekRevenue,
        monthRevenue,
        newClientsWeek: newClients,
        repeatRate,
        consultationsBooked: monthData.filter(b => (b.treatments as any)?.name?.toLowerCase().includes("consultation")).length,
        packageSales: 0,
        noShows,
        pendingForms: formsRes.data?.length || 0,
        lowStockAlerts: inventoryRes.data?.length || 0,
      });
      setWeeklyRevenue(weeklyData);
      setTopTreatments(sortedTreatments);
      setUpcoming(upcomingBookings);
      setLoading(false);
    };

    fetchDashboard();
  }, []);

  if (loading) return <div className="py-12 text-center"><p className="font-body text-sm text-muted-foreground animate-pulse">Loading dashboard...</p></div>;

  const kpiCards = [
    { label: "Today's Bookings", value: stats.todayBookings, icon: Calendar, color: "text-blue-600" },
    { label: "Today's Revenue", value: `£${stats.todayRevenue.toLocaleString("en-GB")}`, icon: PoundSterling, color: "text-green-600" },
    { label: "This Week", value: `£${stats.weekRevenue.toLocaleString("en-GB")}`, icon: TrendingUp, color: "text-accent" },
    { label: "This Month", value: `£${stats.monthRevenue.toLocaleString("en-GB")}`, icon: PoundSterling, color: "text-accent" },
    { label: "New Clients", value: stats.newClientsWeek, icon: UserPlus, subtitle: "this week" },
    { label: "Repeat Rate", value: `${stats.repeatRate}%`, icon: Users },
    { label: "No-Shows", value: stats.noShows, icon: AlertTriangle, color: stats.noShows > 0 ? "text-orange-500" : "" },
    { label: "Pending Forms", value: stats.pendingForms, icon: FileText, color: stats.pendingForms > 0 ? "text-yellow-600" : "" },
  ];

  const quickActions = [
    { label: "New Booking", icon: Plus, tab: "calendar" },
    { label: "Add Client", icon: UserPlus, tab: "clients" },
    { label: "Upload Photo", icon: Upload, tab: "media" },
    { label: "Create Discount", icon: Tag, tab: "discounts" },
  ];

  return (
    <div className="space-y-6">
      <CatalogDriftBanner onNavigate={onNavigate} />
      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kpiCards.map((card) => (
          <div key={card.label} className="bg-card border border-border rounded-xl p-4 hover:border-accent/30 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <card.icon size={14} strokeWidth={1.5} className={`${card.color || "text-muted-foreground"}`} />
              <span className="font-body text-[11px] text-muted-foreground uppercase tracking-wider">{card.label}</span>
            </div>
            <p className="font-display text-2xl">{card.value}</p>
            {card.subtitle && <p className="font-body text-[10px] text-muted-foreground">{card.subtitle}</p>}
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 flex-wrap">
        {quickActions.map(action => (
          <button key={action.label} onClick={() => onNavigate(action.tab)} className="flex items-center gap-2 px-4 py-2.5 bg-foreground text-background rounded-lg font-body text-xs tracking-wider uppercase hover:bg-accent transition-colors">
            <action.icon size={14} /> {action.label}
          </button>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <h3 className="font-display text-lg mb-4">Revenue — Last 8 Weeks</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyRevenue}>
                <XAxis dataKey="label" tick={{ fontSize: 11, fontFamily: "Satoshi" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fontFamily: "Satoshi" }} axisLine={false} tickLine={false} tickFormatter={v => `£${v}`} />
                <Tooltip formatter={(v: number) => [`£${v.toLocaleString("en-GB")}`, "Revenue"]} contentStyle={{ fontFamily: "Satoshi", fontSize: 12, borderRadius: 8, border: "1px solid hsl(30, 10%, 90%)" }} />
                <Bar dataKey="revenue" fill="hsl(30, 40%, 40%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Treatments */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-display text-lg mb-4">Most Booked</h3>
          {topTreatments.length === 0 ? (
            <p className="font-body text-sm text-muted-foreground">No data yet</p>
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={topTreatments} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={40} paddingAngle={2}>
                    {topTreatments.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ fontFamily: "Satoshi", fontSize: 12, borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                {topTreatments.map((t, i) => (
                  <span key={t.name} className="flex items-center gap-1 font-body text-[10px] text-muted-foreground">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                    {t.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upcoming + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Upcoming Today */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg">Today's Schedule</h3>
            <button onClick={() => onNavigate("calendar")} className="font-body text-xs text-accent hover:underline">View Calendar →</button>
          </div>
          {upcoming.length === 0 ? (
            <div className="py-8 text-center"><p className="font-body text-sm text-muted-foreground">No appointments today</p></div>
          ) : (
            <div className="space-y-2">
              {upcoming.map(b => (
                <div key={b.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="font-body text-xs text-muted-foreground w-12">{b.booking_time}</span>
                    <div>
                      <p className="font-body text-sm font-medium">{b.customer_name}</p>
                      <p className="font-body text-[11px] text-muted-foreground">{b.treatment_name}</p>
                    </div>
                  </div>
                  <span className={`font-body text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    b.status === "confirmed" ? "bg-blue-500/10 text-blue-600" : "bg-yellow-500/10 text-yellow-600"
                  }`}>{b.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Alerts */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-display text-lg mb-4">Alerts & Reminders</h3>
          <div className="space-y-3">
            {stats.pendingForms > 0 && (
              <div className="flex items-center gap-3 py-2.5 px-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
                <FileText size={14} className="text-yellow-600" />
                <span className="font-body text-sm">{stats.pendingForms} pending consent form{stats.pendingForms > 1 ? "s" : ""}</span>
                <button onClick={() => onNavigate("consultations")} className="ml-auto font-body text-xs text-accent">View →</button>
              </div>
            )}
            {stats.lowStockAlerts > 0 && (
              <div className="flex items-center gap-3 py-2.5 px-3 rounded-lg bg-orange-500/5 border border-orange-500/20">
                <AlertTriangle size={14} className="text-orange-500" />
                <span className="font-body text-sm">{stats.lowStockAlerts} low stock item{stats.lowStockAlerts > 1 ? "s" : ""}</span>
                <button onClick={() => onNavigate("inventory")} className="ml-auto font-body text-xs text-accent">View →</button>
              </div>
            )}
            {stats.noShows > 0 && (
              <div className="flex items-center gap-3 py-2.5 px-3 rounded-lg bg-red-500/5 border border-red-500/20">
                <AlertTriangle size={14} className="text-red-500" />
                <span className="font-body text-sm">{stats.noShows} no-show{stats.noShows > 1 ? "s" : ""} this month</span>
              </div>
            )}
            {stats.pendingForms === 0 && stats.lowStockAlerts === 0 && stats.noShows === 0 && (
              <div className="py-8 text-center"><Star size={18} className="mx-auto text-accent mb-2" /><p className="font-body text-sm text-muted-foreground">All clear — no alerts</p></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function CatalogDriftBanner({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const [state, setState] = useState<{ in_sync: boolean; issues: number; ran_at: string } | null>(null);
  useEffect(() => {
    supabase
      .from("catalog_sync_log")
      .select("in_sync, issues_count, ran_at")
      .order("ran_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setState({ in_sync: data.in_sync, issues: data.issues_count, ran_at: data.ran_at });
      });
  }, []);
  if (!state || state.in_sync) return null;
  return (
    <button
      onClick={() => onNavigate("catalog-sync")}
      className="w-full text-left border-l-4 border-l-amber-500 border border-border bg-amber-50/50 hover:bg-amber-50 transition-colors p-4 flex items-center gap-3"
    >
      <AlertTriangle size={18} className="text-amber-600 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-body text-sm font-medium">Catalog drift detected — {state.issues} issue{state.issues === 1 ? "" : "s"} between website and live booking scheduler.</p>
        <p className="font-body text-xs text-muted-foreground">Last checked {new Date(state.ran_at).toLocaleString("en-GB")} · Click to review.</p>
      </div>
    </button>
  );
}

export default AdminDashboardHome;

