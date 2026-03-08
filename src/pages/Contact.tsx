import { motion } from "framer-motion";
import { useState } from "react";
import Layout from "@/components/Layout";
import { MapPin, Clock, Phone, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import { usePageMeta } from "@/hooks/use-page-meta";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200, "Name is too long"),
  email: z.string().trim().email("Please enter a valid email").max(255, "Email is too long"),
  phone: z.string().trim().max(30, "Phone number is too long").optional().or(z.literal("")),
  message: z.string().trim().min(1, "Message is required").max(5000, "Message is too long"),
});

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("contact_submissions").insert({
      name: result.data.name,
      email: result.data.email,
      phone: result.data.phone || null,
      message: result.data.message,
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
                      {errors[field.key] && <p className="font-body text-xs text-red-500 mt-1">{errors[field.key]}</p>}
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
                      maxLength={5000}
                    />
                    {errors.message && <p className="font-body text-xs text-red-500 mt-1">{errors.message}</p>}
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
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2374.5!2d-2.2508!3d53.4794!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487bb1c16c0ee7e5%3A0x6a3c8e3e0e9e4f0a!2s25%20St%20John%20St%2C%20Manchester%20M3%204DT!5e0!3m2!1sen!2suk!4v1700000000000"
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
