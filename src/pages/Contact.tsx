import { motion } from "framer-motion";
import { useState } from "react";
import Layout from "@/components/Layout";
import { MapPin, Clock, Phone, Mail } from "lucide-react";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
            {/* Form */}
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
                        required
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
                    className="w-full px-8 py-4 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-accent transition-colors"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Info + Map */}
            <div className="space-y-8">
              <div className="space-y-6">
                {[
                  { icon: MapPin, text: "Deansgate, Manchester City Centre, M3" },
                  { icon: Clock, text: "Mon – Fri: 10am – 7pm | Sat: 10am – 5pm | Sun: Closed" },
                  { icon: Phone, text: "+44 7000 000 000" },
                  { icon: Mail, text: "hello@hiveclinicuk.com" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-start gap-4">
                    <Icon size={18} className="text-gold mt-0.5 flex-shrink-0" />
                    <p className="font-body text-sm text-foreground/80">{text}</p>
                  </div>
                ))}
              </div>

              {/* Map placeholder */}
              <div className="aspect-video bg-muted flex items-center justify-center border border-border">
                <p className="font-body text-sm text-muted-foreground">Map placeholder — embed Google Maps here</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
