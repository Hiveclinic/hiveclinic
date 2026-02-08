import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { LogOut, Mail, Phone, User, Calendar, Users, Check, X, Download } from "lucide-react";
import { toast } from "sonner";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  created_at: string;
  contacted: boolean;
  contacted_at: string | null;
}

interface EmailSubscriber {
  id: string;
  email: string;
  created_at: string;
}

const Admin = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [subscribers, setSubscribers] = useState<EmailSubscriber[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tab, setTab] = useState<"contacts" | "subscribers">("contacts");
  const [filter, setFilter] = useState<"all" | "pending" | "contacted">("all");
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (!session) {
          navigate("/auth");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!session) return;

    const fetchData = async () => {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin");

      if (!roles || roles.length === 0) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const toggleContacted = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    const contactedAt = newStatus ? new Date().toISOString() : null;

    const { error } = await supabase
      .from("contact_submissions")
      .update({ contacted: newStatus, contacted_at: contactedAt })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update status.");
      return;
    }

    setSubmissions((prev) =>
      prev.map((s) => s.id === id ? { ...s, contacted: newStatus, contacted_at: contactedAt } : s)
    );
    toast.success(newStatus ? "Marked as contacted." : "Marked as pending.");
  };

  const exportContactsCSV = () => {
    const rows = filteredSubmissions.map((s) => ({
      Name: s.name,
      Email: s.email,
      Phone: s.phone || "",
      Message: s.message.replace(/"/g, '""'),
      Status: s.contacted ? "Contacted" : "Pending",
      "Contacted At": s.contacted_at ? new Date(s.contacted_at).toLocaleDateString("en-GB") : "",
      "Submitted At": new Date(s.created_at).toLocaleDateString("en-GB"),
    }));

    const headers = Object.keys(rows[0] || {});
    const csv = [
      headers.join(","),
      ...rows.map((r) => headers.map((h) => `"${(r as Record<string, string>)[h]}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hive-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportSubscribersCSV = () => {
    const rows = subscribers.map((s) => ({
      Email: s.email,
      "Subscribed At": new Date(s.created_at).toLocaleDateString("en-GB"),
    }));

    const headers = Object.keys(rows[0] || {});
    const csv = [
      headers.join(","),
      ...rows.map((r) => headers.map((h) => `"${(r as Record<string, string>)[h]}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hive-vip-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredSubmissions = submissions.filter((s) => {
    if (filter === "pending") return !s.contacted;
    if (filter === "contacted") return s.contacted;
    return true;
  });

  const pendingCount = submissions.filter((s) => !s.contacted).length;
  const contactedCount = submissions.filter((s) => s.contacted).length;

  if (loading) {
    return (
      <Layout>
        <section className="py-24 text-center">
          <p className="font-body text-muted-foreground">Loading...</p>
        </section>
      </Layout>
    );
  }

  if (!isAdmin) {
    return (
      <Layout>
        <section className="py-24 text-center">
          <div className="max-w-md mx-auto px-6">
            <h1 className="font-display text-3xl mb-4">Access Denied</h1>
            <p className="font-body text-muted-foreground mb-6">You don't have admin privileges.</p>
            <button onClick={handleSignOut} className="px-8 py-3 bg-foreground text-background font-body text-sm tracking-widest uppercase">
              Sign Out
            </button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="font-display text-4xl">Dashboard</h1>
            </motion.div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-6 py-2 border border-border font-body text-sm hover:border-gold transition-colors"
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="border border-border p-5">
              <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Enquiries</p>
              <p className="font-display text-3xl">{submissions.length}</p>
            </div>
            <div className="border border-border p-5">
              <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1">Pending</p>
              <p className="font-display text-3xl text-gold">{pendingCount}</p>
            </div>
            <div className="border border-border p-5">
              <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1">Contacted</p>
              <p className="font-display text-3xl">{contactedCount}</p>
            </div>
            <div className="border border-border p-5">
              <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1">VIP Subscribers</p>
              <p className="font-display text-3xl">{subscribers.length}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center justify-between border-b border-border mb-6">
            <div className="flex gap-4">
              <button
                onClick={() => setTab("contacts")}
                className={`pb-3 font-body text-sm tracking-wider uppercase transition-colors ${tab === "contacts" ? "text-gold border-b-2 border-gold" : "text-muted-foreground hover:text-foreground"}`}
              >
                Enquiries ({submissions.length})
              </button>
              <button
                onClick={() => setTab("subscribers")}
                className={`pb-3 font-body text-sm tracking-wider uppercase transition-colors ${tab === "subscribers" ? "text-gold border-b-2 border-gold" : "text-muted-foreground hover:text-foreground"}`}
              >
                <span className="flex items-center gap-2"><Users size={14} /> VIP List ({subscribers.length})</span>
              </button>
            </div>
            <button
              onClick={tab === "contacts" ? exportContactsCSV : exportSubscribersCSV}
              disabled={(tab === "contacts" && filteredSubmissions.length === 0) || (tab === "subscribers" && subscribers.length === 0)}
              className="flex items-center gap-2 pb-3 font-body text-xs tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
            >
              <Download size={14} /> Export CSV
            </button>
          </div>

          {tab === "contacts" && (
            <>
              {/* Filter */}
              <div className="flex gap-3 mb-6">
                {(["all", "pending", "contacted"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 font-body text-xs tracking-wider uppercase border transition-colors ${filter === f ? "border-gold text-gold" : "border-border text-muted-foreground hover:border-foreground"}`}
                  >
                    {f === "all" ? `All (${submissions.length})` : f === "pending" ? `Pending (${pendingCount})` : `Contacted (${contactedCount})`}
                  </button>
                ))}
              </div>

              {filteredSubmissions.length === 0 ? (
                <div className="p-12 bg-secondary text-center">
                  <p className="font-body text-muted-foreground">No enquiries to show.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredSubmissions.map((sub) => (
                    <motion.div
                      key={sub.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`border p-6 transition-colors ${sub.contacted ? "border-border/50 opacity-70" : "border-border hover:border-gold/30"}`}
                    >
                      <div className="flex flex-wrap gap-4 md:gap-6 mb-4 items-center">
                        <button
                          onClick={() => toggleContacted(sub.id, sub.contacted)}
                          className={`flex items-center gap-2 px-3 py-1.5 border text-xs font-body tracking-wider uppercase transition-colors ${
                            sub.contacted
                              ? "border-green-600/30 text-green-600 hover:border-green-600"
                              : "border-gold/30 text-gold hover:border-gold"
                          }`}
                          title={sub.contacted ? "Mark as pending" : "Mark as contacted"}
                        >
                          {sub.contacted ? <><Check size={12} /> Contacted</> : <><X size={12} /> Pending</>}
                        </button>
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-gold" />
                          <span className="font-body text-sm font-medium">{sub.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-gold" />
                          <a href={`mailto:${sub.email}`} className="font-body text-sm hover:text-gold transition-colors">{sub.email}</a>
                        </div>
                        {sub.phone && (
                          <div className="flex items-center gap-2">
                            <Phone size={14} className="text-gold" />
                            <a href={`tel:${sub.phone}`} className="font-body text-sm hover:text-gold transition-colors">{sub.phone}</a>
                          </div>
                        )}
                        <div className="flex items-center gap-2 ml-auto">
                          <Calendar size={14} className="text-muted-foreground" />
                          <span className="font-body text-xs text-muted-foreground">
                            {new Date(sub.created_at).toLocaleDateString("en-GB", {
                              day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                            })}
                          </span>
                        </div>
                      </div>
                      <p className="font-body text-sm text-foreground/80 leading-relaxed">{sub.message}</p>
                      {sub.contacted && sub.contacted_at && (
                        <p className="font-body text-xs text-muted-foreground mt-3">
                          Contacted on {new Date(sub.contacted_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}

          {tab === "subscribers" && (
            <>
              {subscribers.length === 0 ? (
                <div className="p-12 bg-secondary text-center">
                  <p className="font-body text-muted-foreground">No VIP subscribers yet.</p>
                </div>
              ) : (
                <div className="border border-border">
                  {subscribers.map((sub, i) => (
                    <div
                      key={sub.id}
                      className={`flex items-center justify-between px-6 py-4 ${i !== subscribers.length - 1 ? "border-b border-border" : ""}`}
                    >
                      <div className="flex items-center gap-3">
                        <Mail size={14} className="text-gold" />
                        <a href={`mailto:${sub.email}`} className="font-body text-sm hover:text-gold transition-colors">{sub.email}</a>
                      </div>
                      <span className="font-body text-xs text-muted-foreground">
                        {new Date(sub.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
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
