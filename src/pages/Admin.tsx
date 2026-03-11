import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { LogOut, Calendar, Tag, Clock, CalendarX, Users, Mail, Stethoscope, Download, CreditCard, LayoutGrid, UserCheck, Settings, Menu, X, ChevronDown, ChevronRight, Star } from "lucide-react";
import { toast } from "sonner";
import AdminBookingsTab from "@/components/admin/AdminBookingsTab";
import AdminAvailabilityTab from "@/components/admin/AdminAvailabilityTab";
import AdminDiscountCodesTab from "@/components/admin/AdminDiscountCodesTab";
import AdminBlockedDatesTab from "@/components/admin/AdminBlockedDatesTab";
import AdminTreatmentsTab from "@/components/admin/AdminTreatmentsTab";
import AdminPaymentPlansTab from "@/components/admin/AdminPaymentPlansTab";
import AdminCalendarView from "@/components/admin/AdminCalendarView";
import AdminClientsTab from "@/components/admin/AdminClientsTab";
import AdminSiteTab from "@/components/admin/AdminSiteTab";
import AdminReviewsTab from "@/components/admin/AdminReviewsTab";

type TabKey = "bookings" | "calendar" | "treatments" | "availability" | "blocked" | "discounts" | "payments" | "clients" | "contacts" | "subscribers" | "site" | "reviews";

const NAV_GROUPS = [
  {
    label: "Bookings",
    items: [
      { key: "calendar" as TabKey, label: "Calendar", icon: <LayoutGrid size={14} /> },
      { key: "bookings" as TabKey, label: "Bookings", icon: <Calendar size={14} /> },
    ],
  },
  {
    label: "Business",
    items: [
      { key: "treatments" as TabKey, label: "Treatments", icon: <Stethoscope size={14} /> },
      { key: "payments" as TabKey, label: "Payment Plans", icon: <CreditCard size={14} /> },
      { key: "discounts" as TabKey, label: "Discounts", icon: <Tag size={14} /> },
    ],
  },
  {
    label: "Clients",
    items: [
      { key: "clients" as TabKey, label: "Clients", icon: <UserCheck size={14} /> },
      { key: "contacts" as TabKey, label: "Enquiries", icon: <Mail size={14} /> },
      { key: "subscribers" as TabKey, label: "VIP List", icon: <Users size={14} /> },
    ],
  },
  {
    label: "Settings",
    items: [
      { key: "site" as TabKey, label: "Site Settings", icon: <Settings size={14} /> },
      { key: "availability" as TabKey, label: "Availability", icon: <Clock size={14} /> },
      { key: "blocked" as TabKey, label: "Blocked Dates", icon: <CalendarX size={14} /> },
    ],
  },
];

interface ContactSubmission {
  id: string; name: string; email: string; phone: string | null; message: string; created_at: string; contacted: boolean; contacted_at: string | null;
}

interface EmailSubscriber {
  id: string; email: string; created_at: string;
}

interface QuickStats {
  todayBookings: number;
  pendingEnquiries: number;
  monthRevenue: number;
}

const Admin = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tab, setTab] = useState<TabKey>("calendar");
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [subscribers, setSubscribers] = useState<EmailSubscriber[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "contacted">("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState<QuickStats>({ todayBookings: 0, pendingEnquiries: 0, monthRevenue: 0 });
  const [expandedGroups, setExpandedGroups] = useState<string[]>(NAV_GROUPS.map(g => g.label));
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) navigate("/hive-admin-login");
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) navigate("/hive-admin-login");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!session) return;
    const fetchData = async () => {
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id).eq("role", "admin");
      if (!roles || roles.length === 0) { setIsAdmin(false); setLoading(false); return; }
      setIsAdmin(true);

      const today = new Date().toISOString().slice(0, 10);
      const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10);

      const [contactsRes, subsRes, todayBookingsRes, pendingRes, revenueRes] = await Promise.all([
        supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }),
        supabase.from("email_subscribers").select("*").order("created_at", { ascending: false }),
        supabase.from("bookings").select("id").eq("booking_date", today).in("status", ["confirmed", "pending"]),
        supabase.from("contact_submissions").select("id").eq("contacted", false),
        supabase.from("bookings").select("total_price").gte("booking_date", monthStart).eq("status", "confirmed"),
      ]);

      setSubmissions((contactsRes.data as ContactSubmission[]) || []);
      setSubscribers((subsRes.data as EmailSubscriber[]) || []);
      setStats({
        todayBookings: todayBookingsRes.data?.length || 0,
        pendingEnquiries: pendingRes.data?.length || 0,
        monthRevenue: (revenueRes.data || []).reduce((sum, b) => sum + Number(b.total_price), 0),
      });
      setLoading(false);
    };
    fetchData();
  }, [session]);

  const handleSignOut = async () => { await supabase.auth.signOut(); navigate("/hive-admin-login"); };

  const toggleContacted = async (id: string, current: boolean) => {
    const newStatus = !current;
    const contactedAt = newStatus ? new Date().toISOString() : null;
    const { error } = await supabase.from("contact_submissions").update({ contacted: newStatus, contacted_at: contactedAt }).eq("id", id);
    if (error) { toast.error("Failed to update"); return; }
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, contacted: newStatus, contacted_at: contactedAt } : s));
    toast.success(newStatus ? "Marked as contacted" : "Marked as pending");
  };

  const filteredSubmissions = submissions.filter(s => filter === "all" ? true : filter === "pending" ? !s.contacted : s.contacted);

  const exportCSV = (data: any[], filename: string) => {
    if (!data.length) return;
    const headers = Object.keys(data[0]);
    const csv = [headers.join(","), ...data.map(r => headers.map(h => `"${(r as any)[h] || ""}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${filename}-${new Date().toISOString().slice(0,10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const toggleGroup = (label: string) => {
    setExpandedGroups(prev => prev.includes(label) ? prev.filter(g => g !== label) : [...prev, label]);
  };

  if (loading) return <Layout><section className="py-24 text-center"><p className="font-body text-muted-foreground">Loading...</p></section></Layout>;
  if (!isAdmin) return (
    <Layout><section className="py-24 text-center"><div className="max-w-md mx-auto px-6">
      <h1 className="font-display text-3xl mb-4">Access Denied</h1>
      <p className="font-body text-muted-foreground mb-6">You don't have admin privileges.</p>
      <button onClick={handleSignOut} className="px-8 py-3 bg-foreground text-background font-body text-sm tracking-widest uppercase">Sign Out</button>
    </div></section></Layout>
  );

  const SidebarContent = () => (
    <nav className="space-y-1">
      {NAV_GROUPS.map(group => {
        const isExpanded = expandedGroups.includes(group.label);
        return (
          <div key={group.label}>
            <button
              onClick={() => toggleGroup(group.label)}
              className="w-full flex items-center justify-between px-3 py-2 font-body text-xs text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
            >
              {group.label}
              {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            </button>
            {isExpanded && (
              <div className="space-y-0.5 mb-2">
                {group.items.map(item => (
                  <button
                    key={item.key}
                    onClick={() => { setTab(item.key); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-2 px-4 py-2.5 font-body text-sm transition-colors rounded-sm ${
                      tab === item.key
                        ? "bg-foreground text-background"
                        : "text-foreground/70 hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    {item.icon} {item.label}
                    {item.key === "contacts" && stats.pendingEnquiries > 0 && (
                      <span className="ml-auto px-1.5 py-0.5 bg-gold/20 text-gold font-body text-[10px]">{stats.pendingEnquiries}</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );

  return (
    <Layout>
      <section className="pt-16 pb-24 lg:pb-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 border border-border hover:border-gold transition-colors">
                {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
              </button>
              <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-display text-3xl">Dashboard</motion.h1>
            </div>
            <button onClick={handleSignOut} className="flex items-center gap-2 px-4 py-2 border border-border font-body text-xs hover:border-gold transition-colors">
              <LogOut size={14} /> Sign Out
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
            <div className="border border-border p-4">
              <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">Today</p>
              <p className="font-display text-2xl">{stats.todayBookings}</p>
              <p className="font-body text-xs text-muted-foreground">bookings</p>
            </div>
            <div className="border border-border p-4">
              <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">Pending</p>
              <p className="font-display text-2xl">{stats.pendingEnquiries}</p>
              <p className="font-body text-xs text-muted-foreground">enquiries</p>
            </div>
            <div className="border border-border p-4">
              <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">This Month</p>
              <p className="font-display text-2xl">£{stats.monthRevenue.toLocaleString("en-GB", { maximumFractionDigits: 0 })}</p>
              <p className="font-body text-xs text-muted-foreground">revenue</p>
            </div>
          </div>

          {/* Layout: Sidebar + Content */}
          <div className="flex gap-6">
            {/* Sidebar - Desktop */}
            <div className="hidden lg:block w-52 flex-shrink-0">
              <div className="sticky top-24 border border-border p-3">
                <SidebarContent />
              </div>
            </div>

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
              <div className="fixed inset-0 z-50 lg:hidden">
                <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
                <div className="absolute left-0 top-0 bottom-0 w-64 bg-background border-r border-border p-4 overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display text-lg">Navigation</h2>
                    <button onClick={() => setSidebarOpen(false)}><X size={16} /></button>
                  </div>
                  <SidebarContent />
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {tab === "bookings" && <AdminBookingsTab />}
              {tab === "calendar" && <AdminCalendarView />}
              {tab === "treatments" && <AdminTreatmentsTab />}
              {tab === "payments" && <AdminPaymentPlansTab />}
              {tab === "clients" && <AdminClientsTab />}
              {tab === "availability" && <AdminAvailabilityTab />}
              {tab === "blocked" && <AdminBlockedDatesTab />}
              {tab === "discounts" && <AdminDiscountCodesTab />}
              {tab === "site" && <AdminSiteTab />}
              {tab === "reviews" && <AdminReviewsTab />}

              {tab === "contacts" && (
                <>
                  <div className="flex flex-wrap gap-3 mb-6">
                    {(["all", "pending", "contacted"] as const).map(f => (
                      <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 font-body text-xs tracking-wider uppercase border transition-colors ${filter === f ? "border-gold text-gold" : "border-border text-muted-foreground hover:border-foreground"}`}>
                        {f === "all" ? `All (${submissions.length})` : f === "pending" ? `Pending (${submissions.filter(s => !s.contacted).length})` : `Contacted (${submissions.filter(s => s.contacted).length})`}
                      </button>
                    ))}
                    <button onClick={() => exportCSV(filteredSubmissions.map(s => ({ Name: s.name, Email: s.email, Phone: s.phone || "", Message: s.message, Status: s.contacted ? "Contacted" : "Pending" })), "enquiries")} className="ml-auto flex items-center gap-2 font-body text-xs text-muted-foreground hover:text-foreground"><Download size={14} /> Export</button>
                  </div>
                  {filteredSubmissions.length === 0 ? (
                    <div className="p-12 bg-secondary text-center"><p className="font-body text-muted-foreground">No enquiries.</p></div>
                  ) : (
                    <div className="space-y-3">
                      {filteredSubmissions.map(sub => (
                        <div key={sub.id} className={`border p-5 ${sub.contacted ? "border-border/50 opacity-70" : "border-border hover:border-gold/30"} transition-colors`}>
                          <div className="flex flex-wrap gap-4 items-center mb-3">
                            <button onClick={() => toggleContacted(sub.id, sub.contacted)} className={`px-3 py-1 border font-body text-xs tracking-wider uppercase transition-colors ${sub.contacted ? "border-green-600/30 text-green-600" : "border-gold/30 text-gold"}`}>
                              {sub.contacted ? "✓ Contacted" : "✕ Pending"}
                            </button>
                            <span className="font-body text-sm font-medium">{sub.name}</span>
                            <a href={`mailto:${sub.email}`} className="font-body text-xs hover:text-gold transition-colors">{sub.email}</a>
                            {sub.phone && <a href={`tel:${sub.phone}`} className="font-body text-xs">{sub.phone}</a>}
                            <span className="ml-auto font-body text-xs text-muted-foreground">{new Date(sub.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                          </div>
                          <p className="font-body text-sm text-foreground/80">{sub.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {tab === "subscribers" && (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <p className="font-body text-sm text-muted-foreground">{subscribers.length} VIP subscribers</p>
                    <button onClick={() => exportCSV(subscribers.map(s => ({ Email: s.email, Date: new Date(s.created_at).toLocaleDateString("en-GB") })), "vip-subscribers")} className="flex items-center gap-2 font-body text-xs text-muted-foreground hover:text-foreground"><Download size={14} /> Export</button>
                  </div>
                  {subscribers.length === 0 ? (
                    <div className="p-12 bg-secondary text-center"><p className="font-body text-muted-foreground">No subscribers yet.</p></div>
                  ) : (
                    <div className="border border-border">
                      {subscribers.map((sub, i) => (
                        <div key={sub.id} className={`flex items-center justify-between px-6 py-4 ${i !== subscribers.length - 1 ? "border-b border-border" : ""}`}>
                          <a href={`mailto:${sub.email}`} className="font-body text-sm hover:text-gold transition-colors">{sub.email}</a>
                          <span className="font-body text-xs text-muted-foreground">{new Date(sub.created_at).toLocaleDateString("en-GB")}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Bottom Nav */}
        <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-background border-t border-border">
          <div className="grid grid-cols-5 gap-0">
            {[
              { key: "calendar" as TabKey, label: "Calendar", icon: <LayoutGrid size={18} /> },
              { key: "bookings" as TabKey, label: "Bookings", icon: <Calendar size={18} /> },
              { key: "clients" as TabKey, label: "Clients", icon: <UserCheck size={18} /> },
              { key: "treatments" as TabKey, label: "Treatments", icon: <Stethoscope size={18} /> },
              { key: "site" as TabKey, label: "Settings", icon: <Settings size={18} /> },
            ].map(item => (
              <button
                key={item.key}
                onClick={() => { setTab(item.key); setSidebarOpen(false); }}
                className={`flex flex-col items-center gap-0.5 py-2.5 font-body text-[10px] tracking-wider uppercase transition-colors ${
                  tab === item.key ? "text-gold" : "text-muted-foreground"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Admin;
