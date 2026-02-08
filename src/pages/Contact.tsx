import { motion } from "framer-motion";
import { useState } from "react";
import Layout from "@/components/Layout";
import { MapPin, Clock, Phone, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("contact_submissions").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      message: form.message.trim(),
    });
    setLoading(false);
    if (error) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    setSubmitted(true);
  };

  return (
    <Layout>
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-16">
            <h1 className="font-display text-5xl md:text-6xl mb-4">Get in Touch</h1>
            <p className="font-body text-muted-foreground">We'd love to hear from you.</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              {submitted ? (
                <div className="p-12 bg-secondary text-center">
                  <h3 className="font-display text-2xl mb-2">Thank you!</h3>
                  <p className="font-body text-muted-foreground">We'll be in touch shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {[
                    { key: "name", label: "Full Name", type: "text" },
                    { key: "email", label: "Email", type: "email" },
                    { key: "phone", label: "Phone", type: "tel" },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="font-body text-sm uppercase tracking-wider mb-2 block">{field.label}</label>
                      <input
                        type={field.type}
                        required={field.key !== "phone"}
                        value={form[field.key as keyof typeof form]}
                        onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                        className="w-full border border-border bg-transparent px-4 py-3 font-body text-sm focus:border-gold focus:outline-none transition-colors"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="font-body text-sm uppercase tracking-wider mb-2 block">Message</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full border border-border bg-transparent px-4 py-3 font-body text-sm focus:border-gold focus:outline-none transition-colors resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-8 py-4 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-accent transition-colors disabled:opacity-50"
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>

            <div className="space-y-8">
              <div className="space-y-6">
                {[
                  { icon: MapPin, text: "25 Saint John Street, Manchester, M3 4DT" },
                  { icon: Clock, text: "Mon: 10-4 | Tue: 10-5 | Thu: 12-8 | Fri: 10-6 | Sat: 10-5 | Wed/Sun: Closed" },
                  { icon: Phone, text: "+44 7795 008 114" },
                  { icon: Mail, text: "hello@hiveclinicuk.com" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-start gap-4">
                    <Icon size={18} className="text-gold mt-0.5 flex-shrink-0" />
                    <p className="font-body text-sm text-foreground/80">{text}</p>
                  </div>
                ))}
              </div>

              <div className="aspect-video border border-border overflow-hidden">
                <iframe
                  src="https://www.google.com/maps?q=25+Saint+John+Street,+Manchester,+M3+4DT,+UK&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Hive Clinic - 25 Saint John Street, Manchester M3 4DT"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
