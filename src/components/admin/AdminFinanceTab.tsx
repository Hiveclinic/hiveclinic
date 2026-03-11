import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Download, PoundSterling, TrendingUp, TrendingDown, CreditCard } from "lucide-react";
import { format, subMonths, startOfMonth, endOfMonth, startOfWeek, subDays, startOfDay } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

type Booking = {
  id: string;
  booking_date: string;
  total_price: number;
  deposit_amount: number | null;
  discount_amount: number | null;
  status: string;
  payment_status: string;
  customer_email: string;
  treatments?: { name: string } | null;
};

const AdminFinanceTab = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"week" | "month" | "quarter">("month");

  useEffect(() => {
    const fetch = async () => {
      const sixMonthsAgo = format(subMonths(new Date(), 6), "yyyy-MM-dd");
      const { data } = await supabase.from("bookings").select("id, booking_date, total_price, deposit_amount, discount_amount, status, payment_status, customer_email, treatments(name)").gte("booking_date", sixMonthsAgo);
      if (data) setBookings(data as unknown as Booking[]);
      setLoading(false);
    };
    fetch();
  }, []);

  const confirmed = bookings.filter(b => b.status !== "cancelled");
  const completed = bookings.filter(b => b.status === "completed");
  const totalRevenue = confirmed.reduce((s, b) => s + Number(b.total_price), 0);
  const totalDeposits = confirmed.reduce((s, b) => s + Number(b.deposit_amount || 0), 0);
  const totalDiscounts = confirmed.reduce((s, b) => s + Number(b.discount_amount || 0), 0);
  const outstanding = confirmed.filter(b => b.payment_status === "pending" || b.payment_status === "deposit_paid").reduce((s, b) => s + (Number(b.total_price) - Number(b.deposit_amount || 0)), 0);
  const noShowLoss = bookings.filter(b => b.status === "no_show").reduce((s, b) => s + Number(b.total_price), 0);
  const avgSpend = completed.length > 0 ? totalRevenue / new Set(completed.map(b => b.customer_email)).size : 0;

  // Revenue by treatment
  const treatmentRevenue = new Map<string, number>();
  confirmed.forEach(b => {
    const name = (b.treatments as any)?.name || "Unknown";
    treatmentRevenue.set(name, (treatmentRevenue.get(name) || 0) + Number(b.total_price));
  });
  const treatmentData = [...treatmentRevenue.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, revenue]) => ({ name: name.length > 15 ? name.slice(0, 15) + "…" : name, revenue }));

  // Monthly trend
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const ms = startOfMonth(subMonths(new Date(), i));
    const me = endOfMonth(subMonths(new Date(), i));
    const msStr = format(ms, "yyyy-MM-dd");
    const meStr = format(me, "yyyy-MM-dd");
    const rev = confirmed.filter(b => b.booking_date >= msStr && b.booking_date <= meStr).reduce((s, b) => s + Number(b.total_price), 0);
    monthlyData.push({ label: format(ms, "MMM"), revenue: rev });
  }

  const exportCSV = () => {
    const headers = ["Date", "Client", "Treatment", "Price", "Deposit", "Discount", "Status", "Payment"];
    const rows = confirmed.map(b => [b.booking_date, b.customer_email, (b.treatments as any)?.name || "", b.total_price, b.deposit_amount || 0, b.discount_amount || 0, b.status, b.payment_status]);
    const csv = [headers.join(","), ...rows.map(r => r.map(v => `"${v}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `finance-report-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="py-12 text-center"><p className="font-body text-sm text-muted-foreground animate-pulse">Loading finance data...</p></div>;

  const cards = [
    { label: "Total Revenue", value: `£${totalRevenue.toLocaleString("en-GB", { maximumFractionDigits: 0 })}`, icon: PoundSterling, color: "text-green-600" },
    { label: "Deposits Collected", value: `£${totalDeposits.toLocaleString("en-GB", { maximumFractionDigits: 0 })}`, icon: CreditCard },
    { label: "Outstanding", value: `£${outstanding.toLocaleString("en-GB", { maximumFractionDigits: 0 })}`, icon: TrendingDown, color: outstanding > 0 ? "text-orange-500" : "" },
    { label: "Discounts Given", value: `£${totalDiscounts.toLocaleString("en-GB", { maximumFractionDigits: 0 })}`, icon: TrendingDown },
    { label: "No-Show Losses", value: `£${noShowLoss.toLocaleString("en-GB", { maximumFractionDigits: 0 })}`, icon: TrendingDown, color: noShowLoss > 0 ? "text-red-500" : "" },
    { label: "Avg Client Spend", value: `£${avgSpend.toLocaleString("en-GB", { maximumFractionDigits: 0 })}`, icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl">Finance</h2>
        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg font-body text-xs uppercase tracking-wider hover:border-accent transition-colors">
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {cards.map(c => (
          <div key={c.label} className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <c.icon size={12} strokeWidth={1.5} className={c.color || "text-muted-foreground"} />
              <span className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">{c.label}</span>
            </div>
            <p className="font-display text-xl">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Revenue Trend */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-display text-lg mb-4">Revenue Trend — 6 Months</h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <XAxis dataKey="label" tick={{ fontSize: 11, fontFamily: "Satoshi" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fontFamily: "Satoshi" }} axisLine={false} tickLine={false} tickFormatter={v => `£${v}`} />
              <Tooltip formatter={(v: number) => [`£${v.toLocaleString("en-GB")}`, "Revenue"]} contentStyle={{ fontFamily: "Satoshi", fontSize: 12, borderRadius: 8 }} />
              <Line type="monotone" dataKey="revenue" stroke="hsl(30, 40%, 40%)" strokeWidth={2} dot={{ fill: "hsl(30, 40%, 40%)", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue by Treatment */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-display text-lg mb-4">Revenue by Treatment</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={treatmentData} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 11, fontFamily: "Satoshi" }} axisLine={false} tickLine={false} tickFormatter={v => `£${v}`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fontFamily: "Satoshi" }} axisLine={false} tickLine={false} width={120} />
              <Tooltip formatter={(v: number) => [`£${v.toLocaleString("en-GB")}`, "Revenue"]} contentStyle={{ fontFamily: "Satoshi", fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="revenue" fill="hsl(30, 40%, 40%)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminFinanceTab;
