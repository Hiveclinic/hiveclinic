import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { LogOut, Calendar, Tag, Clock, CalendarX, Users, Mail, Stethoscope, Download } from "lucide-react";
import { toast } from "sonner";
import AdminBookingsTab from "@/components/admin/AdminBookingsTab";
import AdminAvailabilityTab from "@/components/admin/AdminAvailabilityTab";
import AdminDiscountCodesTab from "@/components/admin/AdminDiscountCodesTab";
import AdminBlockedDatesTab from "@/components/admin/AdminBlockedDatesTab";
import AdminTreatmentsTab from "@/components/admin/AdminTreatmentsTab";

type TabKey = "bookings" | "treatments" | "availability" | "blocked" | "discounts" | "contacts" | "subscribers";

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "bookings", label: "Bookings", icon: <Calendar size={14} /> },
  { key: "treatments", label: "Treatments", icon: <Stethoscope size={14} /> },
  { key: "availability", label: "Availability", icon: <Clock size={14} /> },
  { key: "blocked", label: "Blocked Dates", icon: <CalendarX size={14} /> },
  { key: "discounts", label: "Discounts", icon: <Tag size={14} /> },
  { key: "contacts", label: "Enquiries", icon: <Mail size={14} /> },
  { key: "subscribers", label: "VIP List", icon: <Users size={14} /> },
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
  const [tab, setTab] = useState<TabKey>("bookings");
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [subscribers, setSubscribers] = useState<EmailSubscriber[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "contacted">("all");
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) navigate("/auth");
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) navigate("/auth");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!session) return;
    const fetchData = async () => {
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id).eq("role", "admin");
      if (!roles || roles.length === 0) { setIsAdmin(false); setLoading(false); return; }
      setIsAdmin(true);
      const [contactsRes, subsRes] = await Promise.all([
        supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }),
        supabase.from("email_subscribers").select("*").order("created_at", { ascending: false }),
      ]);
      setSubmissions((contactsRes.data as ContactSubmission[]) || []);
      setSubscribers((subsRes.data as EmailSubscriber[]) || []);
      setLoading(false);
    };
    fetchData();
  }, [session]);

  const handleSignOut = async () => { await supabase.auth.signOut(); navigate("/auth"); };

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

  if (loading) return <Layout><section className="py-24 text-center"><p className="font-body text-muted-foreground">Loading...</p></section></Layout>;
  if (!isAdmin) return (
    <Layout><section className="py-24 text-center"><div className="max-w-md mx-auto px-6">
      <h1 className="font-display text-3xl mb-4">Access Denied</h1>
      <p className="font-body text-muted-foreground mb-6">You don't have admin privileges.</p>
      <button onClick={handleSignOut} className="px-8 py-3 bg-foreground text-background font-body text-sm tracking-widest uppercase">Sign Out</button>
    </div></section></Layout>
  );

  return (
    <Layout>
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="font-display text-4xl">Dashboard</h1>
            </motion.div>
            <button onClick={handleSignOut} className="flex items-center gap-2 px-6 py-2 border border-border font-body text-sm hover:border-gold transition-colors">
              <LogOut size={14} /> Sign Out
            </button>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-border mb-8 pb-3">
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-4 py-2 font-body text-xs tracking-wider uppercase transition-colors ${tab === t.key ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {tab === "bookings" && <AdminBookingsTab />}
          {tab === "treatments" && <AdminTreatmentsTab />}
          {tab === "availability" && <AdminAvailabilityTab />}
          {tab === "blocked" && <AdminBlockedDatesTab />}
          {tab === "discounts" && <AdminDiscountCodesTab />}

          {tab === "contacts" && (
            <>
              <div className="flex gap-3 mb-6">
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
      </section>
    </Layout>
  );
};

export default Admin;
