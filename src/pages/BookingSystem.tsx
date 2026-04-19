import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronDown, ArrowDown, Flame, Camera, ArrowRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import AcuityEmbed from "@/components/AcuityEmbed";
import { usePageMeta } from "@/hooks/use-page-meta";

const faqs = [
  { q: "Do I need a consultation first?", a: "Yes - for all injectable treatments, an initial consultation is required. This ensures your safety and allows us to create a personalised treatment plan." },
  { q: "Is there any downtime?", a: "It depends on the treatment. Most facial treatments have minimal downtime. Injectables may involve slight swelling for 24-48 hours. We will discuss this during your consultation." },
  { q: "How do I prepare for my appointment?", a: "Avoid alcohol 24 hours before, arrive with a clean face if possible, and let us know about any medications or allergies." },
  { q: "Can I pay in instalments?", a: "Yes. We offer flexible payment plans for eligible treatments via Klarna and Clearpay." },
  { q: "What if I need to reschedule?", a: "We ask for at least 48 hours notice for cancellations or rescheduling. Late cancellations may incur a fee." },
  { q: "What is the deposit policy?", a: "A deposit may be required to secure your appointment depending on the treatment. The remaining balance is paid on the day." },
];

const steps = [
  { number: "01", title: "Choose", description: "Select your treatment from the menu." },
  { number: "02", title: "Schedule", description: "Pick your preferred date and time." },
  { number: "03", title: "Confirm", description: "Secure your slot in seconds." },
  { number: "04", title: "Arrive", description: "We handle the rest on the day." },
];

const BookingSystem = () => {
  usePageMeta(
    "Book Your Treatment | Hive Clinic Manchester",
    "Book your aesthetic treatment at Hive Clinic, Manchester City Centre. Live availability for lip fillers, skin treatments, anti-wrinkle and more."
  );
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const location = useLocation();

  // Smooth-scroll to #book if hash is present.
  useEffect(() => {
    if (location.hash === "#book") {
      const t = setTimeout(() => {
        document.getElementById("book")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
      return () => clearTimeout(t);
    }
  }, [location]);

  const scrollToBook = () => {
    document.getElementById("book")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-foreground text-background">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="font-body text-[10px] tracking-[0.4em] uppercase text-background/50 mb-8">Manchester City Centre</p>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl mb-6 leading-[0.95] tracking-tight">
              Book Your<br />
              <span className="italic font-light">Treatment</span>
            </h1>
            <p className="font-body text-sm md:text-base text-background/60 max-w-md mx-auto mb-10 leading-relaxed">
              Live availability. Real-time booking. Choose your treatment, pick a slot, you're in.
            </p>
          </motion.div>

          <motion.button
            onClick={scrollToBook}
            className="mx-auto flex flex-col items-center gap-2 text-background/40 hover:text-background/80 transition-colors"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          >
            <span className="font-body text-[10px] tracking-[0.3em] uppercase">Open Scheduler</span>
            <ArrowDown size={16} />
          </motion.button>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {steps.map((step, i) => (
              <div
                key={step.number}
                className={`p-6 md:p-8 ${i < 3 ? "md:border-r border-border" : ""} ${i < 2 ? "border-b md:border-b-0 border-border" : ""} ${i === 0 || i === 2 ? "border-r md:border-r border-border" : ""}`}
              >
                <span className="font-display text-2xl text-accent/40 block mb-2">{step.number}</span>
                <h3 className="font-display text-base mb-1">{step.title}</h3>
                <p className="font-body text-[11px] text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlight banners: Offers + Content Model */}
      <section className="py-14 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={scrollToBook}
            className="group text-left bg-secondary/40 hover:bg-secondary transition-all duration-300 p-8 border border-border hover:border-accent/40"
          >
            <div className="flex items-center gap-2 mb-3">
              <Flame size={14} className="text-accent" />
              <span className="font-body text-[10px] tracking-[0.25em] uppercase text-accent font-semibold">Limited Offers</span>
            </div>
            <h3 className="font-display text-2xl md:text-3xl mb-2 group-hover:text-accent transition-colors">This month's specials</h3>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
              Signature lip filler and facial balancing packages at limited promotional pricing. Available now in the scheduler.
            </p>
            <span className="inline-flex items-center gap-2 font-body text-[11px] tracking-[0.2em] uppercase text-foreground group-hover:text-accent transition-colors">
              Open Scheduler <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </button>

          <Link
            to="/content-models"
            className="group text-left bg-foreground text-background hover:bg-accent transition-all duration-300 p-8 border border-foreground"
          >
            <div className="flex items-center gap-2 mb-3">
              <Camera size={14} className="text-gold" />
              <span className="font-body text-[10px] tracking-[0.25em] uppercase text-gold font-semibold">Content Model Programme</span>
            </div>
            <h3 className="font-display text-2xl md:text-3xl mb-2">Reduced rates for content</h3>
            <p className="font-body text-sm text-background/60 leading-relaxed mb-4">
              Treatments at reduced prices in exchange for before and after content for our portfolio.
            </p>
            <span className="inline-flex items-center gap-2 font-body text-[11px] tracking-[0.2em] uppercase text-gold">
              View Programme <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </section>

      {/* Acuity scheduler embed */}
      <AcuityEmbed id="book" />

      {/* FAQ */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <p className="font-body text-[10px] tracking-[0.3em] uppercase text-accent mb-4">Support</p>
              <h2 className="font-display text-3xl md:text-4xl mb-4">Common Questions</h2>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                Everything you need to know before your appointment.
              </p>
            </div>
            <div className="md:col-span-8">
              {faqs.map((faq, i) => (
                <div key={i} className="border-b border-border/60">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between py-5 text-left group"
                  >
                    <span className="font-body text-sm font-medium group-hover:text-accent transition-colors">{faq.q}</span>
                    <ChevronDown
                      size={16}
                      className={`flex-shrink-0 ml-4 text-muted-foreground transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`}
                    />
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="font-body text-sm text-muted-foreground leading-relaxed pb-5">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Booking Policy footer strip */}
      <section className="py-10 border-t border-border">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="font-body text-[11px] text-muted-foreground leading-relaxed">
            48 hours notice required to reschedule. No-shows may forfeit any deposit. Treatments are non-refundable; results vary. Cash or card accepted.
          </p>
          <Link to="/terms" className="font-body text-[10px] text-accent tracking-wider uppercase underline mt-3 inline-block hover:text-foreground transition-colors">
            View full booking policies
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default BookingSystem;
