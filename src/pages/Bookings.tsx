import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { ChevronDown, ExternalLink, ShieldCheck, Clock, Sparkles, Phone } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { usePageMeta } from "@/hooks/use-page-meta";
import { trackBookNow } from "@/hooks/use-tracking";

const SETMORE_URL = "https://hiveclinicuk.as.me/";

const faqs = [
  {
    q: "Do I need a consultation before my treatment?",
    a: "Yes. For all injectable and prescription-led treatments a consultation with our qualified prescriber is required. Online consultations are free; in-clinic consultations are £25 and fully redeemable against your treatment.",
  },
  {
    q: "Why does the prescriber need to consult before injectables?",
    a: "UK aesthetic regulations require a face-to-face or video assessment with a qualified prescriber for any prescription-only medicine (POMs) such as anti-wrinkle injections. This protects you and ensures the treatment is medically appropriate.",
  },
  {
    q: "How does the deposit work?",
    a: "We take a 20% non-refundable booking fee at the time of booking to secure your slot. The remaining balance is paid at the appointment by card, cash or bank transfer.",
  },
  {
    q: "What is your cancellation and reschedule policy?",
    a: "We require a minimum of 48 hours' notice to reschedule. Late cancellations and no-shows forfeit the booking fee. You can manage your booking from the confirmation email.",
  },
  {
    q: "How early should I arrive?",
    a: "Please arrive at your exact appointment time — no earlier and no later. We run a tight schedule to give every client our full attention.",
  },
  {
    q: "Is there any downtime?",
    a: "Most treatments have minimal downtime. Injectables can cause slight swelling for 24-48 hours; peels may flake for 3-5 days. We talk you through what to expect during your consultation.",
  },
  {
    q: "Can I pay in instalments?",
    a: "Yes. We accept Klarna and Clearpay on eligible treatments at checkout, so you can spread the cost.",
  },
];

const Bookings = () => {
  usePageMeta(
    "Book Your Appointment | Hive Clinic Manchester",
    "Book your aesthetic treatment at Hive Clinic, Manchester. Live availability, secure deposit, prescriber consultations for injectables. Open Tue-Sat.",
    {
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    },
  );

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <Layout>
      {/* Editorial hero */}
      <section className="relative bg-foreground text-background pt-28 md:pt-32 pb-16 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-gold blur-[180px]" />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-body text-[11px] tracking-[0.45em] uppercase text-gold mb-5"
          >
            Live Booking
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="font-display text-5xl md:text-7xl text-background leading-[1] mb-6"
          >
            Reserve your slot
            <br />
            <span className="font-script text-gold text-6xl md:text-8xl leading-[0.9]">at the Hive</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="font-body text-base text-background/60 mt-6 max-w-xl mx-auto leading-relaxed"
          >
            Pick a date, choose your treatment and secure with a 20% deposit.
            For anti-wrinkle and prescription-led work, please book a
            consultation first.
          </motion.p>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-8">
            {[
              { icon: ShieldCheck, label: "Qualified prescriber" },
              { icon: Clock, label: "Live availability" },
              { icon: Sparkles, label: "Secure deposit" },
            ].map((b) => (
              <div key={b.label} className="flex items-center gap-2">
                <b.icon size={13} strokeWidth={1.5} className="text-gold" />
                <span className="font-body text-[11px] tracking-widest uppercase text-background/55">
                  {b.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Setmore embed */}
      <section id="book" className="relative bg-background py-16 md:py-20 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex items-end justify-between mb-6 px-2">
            <div>
              <p className="font-body text-[10px] tracking-[0.4em] uppercase text-gold mb-2">
                Step 01
              </p>
              <h2 className="font-display text-2xl md:text-3xl">Choose your treatment</h2>
            </div>
            <a
              href={SETMORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackBookNow("bookings_open_full", "scheduler")}
              className="hidden md:inline-flex items-center gap-2 font-body text-[11px] tracking-widest uppercase text-foreground/70 hover:text-gold transition-colors"
            >
              Open in new tab <ExternalLink size={12} />
            </a>
          </div>

          <div className="relative border border-chrome/40 bg-bone overflow-hidden shadow-[0_30px_80px_-40px_hsl(var(--ink)/0.35)]">
            <iframe
              src={SETMORE_URL}
              title="Hive Clinic booking scheduler"
              className="w-full block"
              style={{ height: "min(900px, 90vh)", minHeight: 700 }}
              loading="lazy"
              onLoad={() => trackBookNow("bookings_iframe_loaded", "scheduler")}
            />
          </div>

          <p className="text-center font-body text-[11px] tracking-widest uppercase text-muted-foreground mt-4">
            Trouble loading? <a href={SETMORE_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-gold" onClick={() => trackBookNow("bookings_fallback_link", "scheduler")}>Open the scheduler in a new tab</a>
          </p>
        </div>
      </section>

      {/* Consultation requirements callout */}
      <section className="bg-blush/30 border-y border-chrome/40 py-14">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-start">
          <div>
            <p className="font-body text-[10px] tracking-[0.4em] uppercase text-gold mb-3">Important</p>
            <h2 className="font-display text-3xl md:text-4xl leading-tight">
              Prescriber consultation
              <br />
              <span className="font-script text-gold text-4xl">required first</span>
            </h2>
          </div>
          <div className="space-y-4 font-body text-sm leading-relaxed text-foreground/80">
            <p>
              UK regulations require a qualified prescriber to assess you in
              person or by video before any prescription-only injectable
              (anti-wrinkle, fat dissolve and certain skin boosters).
            </p>
            <p>
              If it's your first injectable visit, please book an
              <strong className="font-semibold"> Anti-Wrinkle Consultation</strong> or a
              <strong className="font-semibold"> Free Online Consultation</strong> from the scheduler above.
            </p>
            <Link
              to="/consultations"
              className="inline-flex items-center gap-2 font-body text-[11px] tracking-widest uppercase text-foreground hover:text-gold transition-colors border-b border-foreground/40 hover:border-gold pb-1"
            >
              Read consultation guide
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-24 bg-background">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="font-body text-[10px] tracking-[0.4em] uppercase text-gold mb-3">
              Frequently asked
            </p>
            <h2 className="font-display text-4xl md:text-5xl leading-tight">
              Questions, <span className="font-script text-gold text-5xl">answered.</span>
            </h2>
          </div>

          <div>
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-border">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between py-5 text-left group"
                  aria-expanded={openFaq === i}
                >
                  <span className="font-display text-lg md:text-xl pr-4 group-hover:text-gold transition-colors">
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`flex-shrink-0 transition-transform text-foreground/60 ${openFaq === i ? "rotate-180 text-gold" : ""}`}
                  />
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="pb-6"
                  >
                    <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-2xl">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer help bar */}
      <section className="bg-foreground text-background py-14">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="font-body text-[10px] tracking-[0.4em] uppercase text-gold mb-3">
            Need a hand?
          </p>
          <h3 className="font-display text-3xl md:text-4xl text-background mb-6">
            Speak to the team directly
          </h3>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="tel:+447795008114"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gold text-foreground font-body text-[11px] tracking-widest uppercase hover:bg-gold-light transition-colors"
            >
              <Phone size={13} /> Call 07795 008 114
            </a>
            <a
              href="https://wa.me/447795008114"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-background/20 text-background font-body text-[11px] tracking-widest uppercase hover:border-gold hover:text-gold transition-colors"
            >
              Message on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Bookings;
