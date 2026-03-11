import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import {
  LogOut, Calendar, Tag, Clock, CalendarX, Users, Mail, Stethoscope, Download, CreditCard,
  LayoutGrid, UserCheck, Settings, Menu, X, ChevronDown, ChevronRight, Star, Home,
  FileText, Package, PoundSterling, Megaphone, Image, Shield, BarChart3
} from "lucide-react";
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
import AdminDashboardHome from "@/components/admin/AdminDashboardHome";
import AdminFinanceTab from "@/components/admin/AdminFinanceTab";
import AdminConsultationsTab from "@/components/admin/AdminConsultationsTab";
import AdminInventoryTab from "@/components/admin/AdminInventoryTab";
import AdminMarketingTab from "@/components/admin/AdminMarketingTab";
import AdminMediaLibraryTab from "@/components/admin/AdminMediaLibraryTab";
import AdminStaffTab from "@/components/admin/AdminStaffTab";
import AdminSettingsTab from "@/components/admin/AdminSettingsTab";

type TabKey = "dashboard" | "bookings" | "calendar" | "treatments" | "availability" | "blocked" | "discounts" | "payments" | "clients" | "contacts" | "subscribers" | "site" | "reviews" | "finance" | "consultations" | "inventory" | "marketing" | "media" | "staff" | "settings" | "packages";

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { key: "dashboard" as TabKey, label: "Dashboard", icon: <Home size={15} strokeWidth={1.5} /> },
    ],
  },
  {
    label: "Scheduling",
    items: [
      { key: "calendar" as TabKey, label: "Calendar", icon: <LayoutGrid size={15} strokeWidth={1.5} /> },
      { key: "bookings" as TabKey, label: "Bookings", icon: <Calendar size={15} strokeWidth={1.5} /> },
    ],
  },
  {
    label: "Clients",
    items: [
      { key: "clients" as TabKey, label: "Clients", icon: <UserCheck size={15} strokeWidth={1.5} /> },
      { key: "consultations" as TabKey, label: "Consent Forms", icon: <FileText size={15} strokeWidth={1.5} /> },
      { key: "contacts" as TabKey, label: "Enquiries", icon: <Mail size={15} strokeWidth={1.5} /> },
    ],
  },
  {
    label: "Services",
    items: [
      { key: "treatments" as TabKey, label: "Treatments", icon: <Stethoscope size={15} strokeWidth={1.5} /> },
      { key: "packages" as TabKey, label: "Packages", icon: <Package size={15} strokeWidth={1.5} /> },
      { key: "discounts" as TabKey, label: "Discounts", icon: <Tag size={15} strokeWidth={1.5} /> },
    ],
  },
  {
    label: "Business",
    items: [
      { key: "finance" as TabKey, label: "Finance", icon: <PoundSterling size={15} strokeWidth={1.5} /> },
      { key: "marketing" as TabKey, label: "Marketing", icon: <Megaphone size={15} strokeWidth={1.5} /> },
      { key: "reviews" as TabKey, label: "Reviews", icon: <Star size={15} strokeWidth={1.5} /> },
      { key: "inventory" as TabKey, label: "Inventory", icon: <BarChart3 size={15} strokeWidth={1.5} /> },
    ],
  },
  {
    label: "Admin",
    items: [
      { key: "media" as TabKey, label: "Media Library", icon: <Image size={15} strokeWidth={1.5} /> },
      { key: "staff" as TabKey, label: "Staff", icon: <Shield size={15} strokeWidth={1.5} /> },
      { key: "settings" as TabKey, label: "Settings", icon: <Settings size={15} strokeWidth={1.5} /> },
      { key: "site" as TabKey, label: "Site Settings", icon: <Settings size={15} strokeWidth={1.5} /> },
      { key: "availability" as TabKey, label: "Availability", icon: <Clock size={15} strokeWidth={1.5} /> },
      { key: "blocked" as TabKey, label: "Blocked Dates", icon: <CalendarX size={15} strokeWidth={1.5} /> },
    ],
  },
];

interface ContactSubmission {
  id: string; name: string; email: string; phone: string | null; message: string; created_at: string; contacted: boolean; contacted_at: string | null;
}

interface EmailSubscriber {
  id: string; email: string; created_at: string;
}

const Admin = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tab, setTab] = useState<TabKey>("dashboard");
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [subscribers, setSubscribers] = useState<EmailSubscriber[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "contacted">("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingEnquiries, setPendingEnquiries] = useState(0);
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

      const [contactsRes, subsRes, pendingRes] = await Promise.all([
        supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }),
        supabase.from("email_subscribers").select("*").order("created_at", { ascending: false }),
        supabase.from("contact_submissions").select("id").eq("contacted", false),
      ]);

      setSubmissions((contactsRes.data as ContactSubmission[]) || []);
      setSubscribers((subsRes.data as EmailSubscriber[]) || []);
      setPendingEnquiries(pendingRes.data?.length || 0);
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
      <button onClick={handleSignOut} className="px-8 py-3 bg-foreground text-background rounded-lg font-body text-sm tracking-widest uppercase">Sign Out</button>
    </div></section></Layout>
  );

  // Find active group for current tab
  const activeGroup = NAV_GROUPS.find(g => g.items.some(i => i.key === tab))?.label;

  const SidebarContent = () => (
    <nav className="space-y-1 px-1">
      {NAV_GROUPS.map(group => {
        const isExpanded = expandedGroups.includes(group.label);
        const isActiveGroup = group.label === activeGroup;
        return (
          <div key={group.label} className="mb-1">
            <button
              onClick={() => toggleGroup(group.label)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-body text-[11px] uppercase tracking-wider transition-colors ${
                isActiveGroup ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {group.label}
              {isExpanded ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
            </button>
            {isExpanded && (
              <div className="space-y-0.5 mt-0.5">
                {group.items.map(item => (
                  <button
                    key={item.key}
                    onClick={() => { setTab(item.key); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 font-body text-sm transition-all rounded-lg ${
                      tab === item.key
                        ? "bg-foreground text-background font-medium"
                        : "text-foreground/60 hover:text-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {item.key === "contacts" && pendingEnquiries > 0 && (
                      <span className="ml-auto px-1.5 py-0.5 bg-accent/20 text-accent font-body text-[9px] rounded-full">{pendingEnquiries}</span>
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

  const currentTabLabel = NAV_GROUPS.flatMap(g => g.items).find(i => i.key === tab)?.label || "Dashboard";

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 lg:px-6 h-14">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors">
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <span className="font-display text-xl tracking-tight">Hive</span>
            <span className="hidden sm:inline font-body text-xs text-muted-foreground uppercase tracking-widest">Clinic Manager</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-body text-xs text-muted-foreground hidden sm:block">{session?.user?.email}</span>
            <button onClick={handleSignOut} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border font-body text-xs hover:border-accent transition-colors">
              <LogOut size={12} /> Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block w-56 flex-shrink-0 border-r border-border bg-background min-h-[calc(100vh-3.5rem)] sticky top-14">
          <div className="py-4 overflow-y-auto h-full">
            <SidebarContent />
          </div>
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-64 bg-background border-r border-border overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <span className="font-display text-lg">Navigation</span>
                <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-secondary"><X size={16} /></button>
              </div>
              <div className="py-3">
                <SidebarContent />
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 min-w-0 pb-24 lg:pb-8">
          <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-6">
              <span className="font-body text-xs text-muted-foreground">{activeGroup}</span>
              <ChevronRight size={10} className="text-muted-foreground" />
              <span className="font-body text-xs font-medium">{currentTabLabel}</span>
            </div>

            {tab === "dashboard" && <AdminDashboardHome onNavigate={(t) => setTab(t as TabKey)} />}
            {tab === "bookings" && <AdminBookingsTab />}
            {tab === "calendar" && <AdminCalendarView />}
            {tab === "treatments" && <AdminTreatmentsTab />}
            {tab === "packages" && <AdminPaymentPlansTab />}
            {tab === "payments" && <AdminPaymentPlansTab />}
            {tab === "clients" && <AdminClientsTab />}
            {tab === "consultations" && <AdminConsultationsTab />}
            {tab === "availability" && <AdminAvailabilityTab />}
            {tab === "blocked" && <AdminBlockedDatesTab />}
            {tab === "discounts" && <AdminDiscountCodesTab />}
            {tab === "finance" && <AdminFinanceTab />}
            {tab === "marketing" && <AdminMarketingTab />}
            {tab === "inventory" && <AdminInventoryTab />}
            {tab === "media" && <AdminMediaLibraryTab />}
            {tab === "staff" && <AdminStaffTab />}
            {tab === "settings" && <AdminSettingsTab />}
            {tab === "site" && <AdminSiteTab />}
            {tab === "reviews" && <AdminReviewsTab />}

            {tab === "contacts" && (
              <>
                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                  <h2 className="font-display text-2xl">Enquiries</h2>
                  <button onClick={() => exportCSV(filteredSubmissions.map(s => ({ Name: s.name, Email: s.email, Phone: s.phone || "", Message: s.message, Status: s.contacted ? "Contacted" : "Pending" })), "enquiries")} className="flex items-center gap-2 font-body text-xs text-muted-foreground hover:text-foreground"><Download size={14} /> Export</button>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {(["all", "pending", "contacted"] as const).map(f => (
                    <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 font-body text-xs tracking-wider uppercase border rounded-lg transition-colors ${filter === f ? "border-accent text-accent" : "border-border text-muted-foreground hover:border-foreground"}`}>
                      {f === "all" ? `All (${submissions.length})` : f === "pending" ? `Pending (${submissions.filter(s => !s.contacted).length})` : `Contacted (${submissions.filter(s => s.contacted).length})`}
                    </button>
                  ))}
                </div>
                {filteredSubmissions.length === 0 ? (
                  <div className="p-12 bg-card border border-border rounded-xl text-center"><p className="font-body text-muted-foreground">No enquiries.</p></div>
                ) : (
                  <div className="space-y-2">
                    {filteredSubmissions.map(sub => (
                      <div key={sub.id} className={`bg-card border rounded-xl p-5 transition-colors ${sub.contacted ? "border-border/50 opacity-70" : "border-border hover:border-accent/30"}`}>
                        <div className="flex flex-wrap gap-4 items-center mb-3">
                          <button onClick={() => toggleContacted(sub.id, sub.contacted)} className={`px-3 py-1 border rounded-lg font-body text-xs tracking-wider uppercase transition-colors ${sub.contacted ? "border-green-600/30 text-green-600" : "border-accent/30 text-accent"}`}>
                            {sub.contacted ? "✓ Contacted" : "○ Pending"}
                          </button>
                          <span className="font-body text-sm font-medium">{sub.name}</span>
                          <a href={`mailto:${sub.email}`} className="font-body text-xs hover:text-accent transition-colors">{sub.email}</a>
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
                  <h2 className="font-display text-2xl">VIP Subscribers</h2>
                  <button onClick={() => exportCSV(subscribers.map(s => ({ Email: s.email, Date: new Date(s.created_at).toLocaleDateString("en-GB") })), "vip-subscribers")} className="flex items-center gap-2 font-body text-xs text-muted-foreground hover:text-foreground"><Download size={14} /> Export</button>
                </div>
                {subscribers.length === 0 ? (
                  <div className="p-12 bg-card border border-border rounded-xl text-center"><p className="font-body text-muted-foreground">No subscribers yet.</p></div>
                ) : (
                  <div className="bg-card border border-border rounded-xl overflow-hidden">
                    {subscribers.map((sub, i) => (
                      <div key={sub.id} className={`flex items-center justify-between px-6 py-4 ${i !== subscribers.length - 1 ? "border-b border-border" : ""}`}>
                        <a href={`mailto:${sub.email}`} className="font-body text-sm hover:text-accent transition-colors">{sub.email}</a>
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
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-background/95 backdrop-blur-sm border-t border-border">
        <div className="grid grid-cols-5 gap-0">
          {[
            { key: "dashboard" as TabKey, label: "Home", icon: <Home size={18} strokeWidth={1.5} /> },
            { key: "calendar" as TabKey, label: "Calendar", icon: <LayoutGrid size={18} strokeWidth={1.5} /> },
            { key: "clients" as TabKey, label: "Clients", icon: <UserCheck size={18} strokeWidth={1.5} /> },
            { key: "finance" as TabKey, label: "Finance", icon: <PoundSterling size={18} strokeWidth={1.5} /> },
            { key: "settings" as TabKey, label: "More", icon: <Menu size={18} strokeWidth={1.5} /> },
          ].map(item => (
            <button
              key={item.key}
              onClick={() => { item.key === "settings" ? setSidebarOpen(true) : setTab(item.key); }}
              className={`flex flex-col items-center gap-0.5 py-2.5 font-body text-[10px] tracking-wider uppercase transition-colors ${
                tab === item.key ? "text-accent" : "text-muted-foreground"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
