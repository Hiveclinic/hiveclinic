import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const emailSchema = z.string().trim().email("Please enter a valid email").max(255);

const VIPPopup = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const already = localStorage.getItem("hive_vip_dismissed");
    if (already) return;

    const timer = setTimeout(() => setShow(true), 8000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setShow(false);
    setDismissed(true);
    localStorage.setItem("hive_vip_dismissed", "true");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message || "Invalid email");
      setLoading(false);
      return;
    }
    const trimmedEmail = parsed.data.toLowerCase();

    // Save to database
    const { error } = await supabase
      .from("email_subscribers")
      .insert({ email: trimmedEmail });

    if (error) {
      if (error.code === "23505") {
        toast.info("You're already on our VIP list.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } else {
      toast.success("Welcome to the VIP list! We'll be in touch.");

      // Sync to Mailchimp in background (don't block UI)
      supabase.functions.invoke("mailchimp-subscribe", {
        body: { email: trimmedEmail },
      }).catch(console.error);
    }

    setLoading(false);
    handleClose();
  };

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-background border border-border max-w-md w-full p-10"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="text-center">
              <p className="font-body text-xs tracking-[0.3em] uppercase text-gold mb-3">
                Exclusive Access
              </p>
              <h3 className="font-display text-3xl mb-3">
                Join the VIP List
              </h3>
              <p className="font-body text-sm text-muted-foreground mb-8 leading-relaxed">
                Be the first to hear about new treatments, exclusive offers, and priority booking slots.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full border border-border bg-transparent px-4 py-3 font-body text-sm focus:border-gold focus:outline-none transition-colors text-center"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-8 py-4 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-accent transition-colors disabled:opacity-50"
                >
                  {loading ? "Joining..." : "Get VIP Access"}
                </button>
              </form>

              <p className="font-body text-xs text-muted-foreground mt-4">
                No spam, ever. Unsubscribe anytime.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VIPPopup;
