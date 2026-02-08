import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { LogOut, Mail, Phone, User, Calendar, Users } from "lucide-react";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  created_at: string;
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

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-border">
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

          {tab === "contacts" && (
            <>
              {submissions.length === 0 ? (
                <div className="p-12 bg-secondary text-center">
                  <p className="font-body text-muted-foreground">No contact submissions yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {submissions.map((sub) => (
                    <motion.div
                      key={sub.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-border p-6 hover:border-gold/30 transition-colors"
                    >
                      <div className="flex flex-wrap gap-6 mb-4">
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
