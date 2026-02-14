import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session) {
          navigate("/hive-admin");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        navigate("/hive-admin");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    <Layout>
      <section className="py-24">
        <div className="max-w-md mx-auto px-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-12">
            <h1 className="font-display text-4xl mb-2">Staff Login</h1>
            <p className="font-body text-muted-foreground text-sm">Authorised personnel only.</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="font-body text-sm uppercase tracking-wider mb-2 block">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-border bg-transparent px-4 py-3 font-body text-sm focus:border-gold focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="font-body text-sm uppercase tracking-wider mb-2 block">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-border bg-transparent px-4 py-3 font-body text-sm focus:border-gold focus:outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-4 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-accent transition-colors disabled:opacity-50"
            >
              {loading ? "Please wait..." : "Sign In"}
            </button>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default Auth;
