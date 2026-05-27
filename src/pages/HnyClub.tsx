import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, Heart, MapPin, CalendarCheck, ArrowRight, Check } from "lucide-react";
import HnyLayout from "@/components/HnyLayout";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useSiteImage } from "@/hooks/use-site-image";
import heroImg from "@/assets/hny/hero.jpg";
import cardLiquid from "@/assets/hny/card-liquid-bbl.jpg";
import cardHipDip from "@/assets/hny/card-hip-dip.jpg";
import cardSignature from "@/assets/hny/card-signature.jpg";
import cardBespoke from "@/assets/hny/card-bespoke.jpg";
import consultationImg from "@/assets/hny/consultation.jpg";
import klarnaLogo from "@/assets/klarna-logo.png";
import clearpayLogo from "@/assets/clearpay-logo.png";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

const pricing = [
  { name: "Liquid BBL — 100ml", standard: "£699", intro: "£499" },
  { name: "Liquid BBL — 200ml", standard: "£1,099", intro: "£799" },
  { name: "Liquid BBL — 300ml", standard: "£1,499", intro: "£999" },
  { name: "Liquid BBL — 400ml", standard: "£1,899", intro: "£1,299" },
  { name: "Liquid BBL — 500ml", standard: "£2,299", intro: "£1,599" },
  { name: "Liquid BBL — 600ml", standard: "£2,699", intro: "£1,899" },
  { name: "Liquid BBL — 800ml", standard: "£3,499", intro: "£2,499" },
  { name: "Bespoke 1L Sculpt Plan", standard: "from £3,999", intro: "Consultation only" },
];

const treatments = [
  { title: "Liquid BBL", text: "Enhance shape, volume and projection for a naturally lifted silhouette.", img: cardLiquid },
  { title: "Hip Dip Filler", text: "Smooth hip dips and create a more balanced, feminine contour.", img: cardHipDip },
  { title: "Signature Sculpt", text: "A tailored plan combining projection, hip dip balancing and body contouring.", img: cardSignature },
  { title: "Bespoke 1L Sculpt Plan", text: "Personalised high-volume plan for fuller, harmonious body contouring. Consultation only.", img: cardBespoke },
];

const whyPoints = [
  { icon: Sparkles, label: "Ultrasound-led planning" },
  { icon: Heart, label: "Tailored to your anatomy" },
  { icon: CalendarCheck, label: "2-week review included" },
  { icon: ShieldCheck, label: "Ongoing support" },
  { icon: Check, label: "Full pre-care & aftercare PDF" },
];

const trustBar = [
  "Refined results",
  "Ultrasound-led treatment planning",
  "2-week review included",
  "Ongoing support",
  "Deansgate, Manchester",
];

const HnyClub = () => {
  usePageMeta(
    "Liquid BBL Manchester | HNY CLUB by Hive Clinic",
    "Ultrasound-led Liquid BBL, hip dip filler and non-surgical body contouring at Hive Clinic, Deansgate Manchester. Consultation required. Payment plans available.",
    {
      canonicalPath: "/liquid-bbl-manchester",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "MedicalBusiness",
          name: "HNY CLUB by Hive Clinic",
          description: "Ultrasound-led Liquid BBL and non-surgical body contouring in Deansgate, Manchester.",
          url: "https://www.hiveclinicuk.com/liquid-bbl-manchester",
          address: { "@type": "PostalAddress", addressLocality: "Manchester", streetAddress: "Deansgate", addressCountry: "GB" },
        },
        {
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Liquid BBL Manchester",
          serviceType: "Non-surgical body contouring",
          areaServed: "Manchester",
          provider: { "@type": "MedicalBusiness", name: "HNY CLUB by Hive Clinic" },
          offers: pricing.slice(0, 7).map((p) => ({ "@type": "Offer", name: p.name, price: p.intro.replace(/[£,]/g, ""), priceCurrency: "GBP" })),
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Hive Clinic", item: "https://www.hiveclinicuk.com/" },
            { "@type": "ListItem", position: 2, name: "HNY CLUB", item: "https://www.hiveclinicuk.com/liquid-bbl-manchester" },
          ],
        },
      ],
    }
  );

  const hero = useSiteImage("hny_hero", heroImg);
  const consult = useSiteImage("hny_consultation", consultationImg);

  return (
    <HnyLayout>
      {/* HERO */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(180deg, var(--hny-cream) 0%, var(--hny-blush) 100%)" }}>
        <div className="max-w-6xl mx-auto px-6 pt-14 pb-16 md:pt-20 md:pb-24 grid md:grid-cols-2 gap-12 items-center">
          <motion.div {...fadeUp}>
            <div className="inline-flex flex-col mb-7">
              <span className="font-display tracking-[0.4em] text-[13px] md:text-sm" style={{ color: "var(--hny-ink)" }}>HNY CLUB</span>
              <span className="font-body italic text-[11px] tracking-[0.25em] mt-1" style={{ color: "var(--hny-soft-brown)" }}>by Hive Clinic</span>
              <span className="block h-px w-12 mt-4" style={{ background: "var(--hny-rose-gold)" }} />
            </div>
            <h1 className="font-display text-3xl md:text-5xl leading-[1.1] mb-5" style={{ color: "var(--hny-ink)" }}>
              Ultrasound-led Liquid BBL & body contouring in Deansgate, Manchester City Centre
            </h1>
            <p className="font-body text-base md:text-lg leading-relaxed mb-7 max-w-xl" style={{ color: "var(--hny-soft-brown)" }}>
              A refined approach to non-surgical body enhancement, designed for clients seeking hip dip contouring, soft projection and tailored body sculpting without surgery.
            </p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 mb-8">
              {["Ultrasound-led planning", "Tailored to your anatomy", "2-week review included"].map((t) => (
                <li key={t} className="flex items-center gap-2 font-body text-xs tracking-wide" style={{ color: "var(--hny-ink)" }}>
                  <span className="h-1 w-1 rounded-full" style={{ background: "var(--hny-rose-gold)" }} />
                  {t}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/bookings" className="px-7 py-3.5 rounded-full text-white font-body text-[11px] tracking-[0.25em] uppercase shadow-sm hover:opacity-90 transition" style={{ background: "linear-gradient(135deg, var(--hny-rose-gold), var(--hny-rose-gold-deep))" }}>
                Book Consultation · £100
              </Link>
              <a href="#pricing" className="px-7 py-3.5 rounded-full font-body text-[11px] tracking-[0.25em] uppercase border transition hover:opacity-70" style={{ borderColor: "var(--hny-rose-gold)", color: "var(--hny-soft-brown)" }}>
                View Introductory Prices
              </a>
            </div>
            <div className="mt-6 inline-flex items-center gap-3 px-4 py-2.5 rounded-full border" style={{ background: "var(--hny-cream)", borderColor: "var(--hny-champagne)" }}>
              <span className="font-body text-[10px] tracking-[0.2em] uppercase" style={{ color: "var(--hny-soft-brown)" }}>Flexible plans</span>
              <img src={klarnaLogo} alt="Klarna" className="h-3.5" />
              <img src={clearpayLogo} alt="Clearpay" className="h-3.5" />
            </div>
          </motion.div>

          <motion.div {...fadeUp} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
            <div className="relative aspect-[4/5] rounded-[2px] overflow-hidden shadow-[0_30px_60px_-30px_rgba(122,92,75,0.4)]">
              <img src={hero} alt="HNY CLUB editorial soft luxury aesthetic" className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 60%, rgba(247,235,229,0.35) 100%)" }} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="border-y" style={{ borderColor: "var(--hny-champagne)", background: "var(--hny-cream)" }}>
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
          {trustBar.map((t, i) => (
            <div key={t} className="flex items-center gap-3">
              {i === trustBar.length - 1 ? <MapPin size={14} strokeWidth={1.2} style={{ color: "var(--hny-rose-gold)" }} /> : <span className="h-1 w-1 rounded-full" style={{ background: "var(--hny-rose-gold)" }} />}
              <span className="font-body text-[11px] tracking-[0.18em] uppercase" style={{ color: "var(--hny-soft-brown)" }}>{t}</span>
            </div>
          ))}
        </div>
      </section>

      {/* TREATMENTS */}
      <section className="py-20" style={{ background: "var(--hny-cream)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-14">
            <span className="font-body text-[10px] tracking-[0.3em] uppercase" style={{ color: "var(--hny-rose-gold)" }}>The Menu</span>
            <h2 className="font-display text-3xl md:text-4xl mt-3" style={{ color: "var(--hny-ink)" }}>Our Body Contouring Treatments</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {treatments.map((t, i) => (
              <motion.article key={t.title} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.08 }} className="group flex flex-col rounded-[2px] overflow-hidden border" style={{ background: "var(--hny-cream-card)", borderColor: "var(--hny-champagne)" }}>
                <div className="aspect-[4/5] overflow-hidden">
                  <img src={t.img} alt={t.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-display text-xl mb-2" style={{ color: "var(--hny-ink)" }}>{t.title}</h3>
                  <p className="font-body text-sm leading-relaxed flex-1" style={{ color: "var(--hny-soft-brown)" }}>{t.text}</p>
                  <Link to="/bookings" className="mt-5 inline-flex items-center gap-2 font-body text-[11px] tracking-[0.2em] uppercase hover:gap-3 transition-all" style={{ color: "var(--hny-rose-gold-deep)" }}>
                    Learn more <ArrowRight size={12} />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING + PAYMENT PLANS */}
      <section id="pricing" className="py-20" style={{ background: "var(--hny-blush)" }}>
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-[1.2fr_1fr] gap-12">
          <motion.div {...fadeUp}>
            <span className="font-body text-[10px] tracking-[0.3em] uppercase" style={{ color: "var(--hny-rose-gold)" }}>Introductory Pricing</span>
            <h2 className="font-display text-3xl md:text-4xl mt-3 mb-8" style={{ color: "var(--hny-ink)" }}>A limited-time invitation</h2>

            <div className="rounded-[2px] overflow-hidden border" style={{ background: "var(--hny-cream-card)", borderColor: "var(--hny-champagne)" }}>
              <div className="hidden md:grid grid-cols-[1.4fr_1fr_1fr] gap-4 px-6 py-3 border-b" style={{ borderColor: "var(--hny-champagne)", background: "var(--hny-cream)" }}>
                <span className="font-body text-[10px] tracking-[0.25em] uppercase" style={{ color: "var(--hny-soft-brown)" }}>Treatment</span>
                <span className="font-body text-[10px] tracking-[0.25em] uppercase text-right" style={{ color: "var(--hny-soft-brown)" }}>Standard</span>
                <span className="font-body text-[10px] tracking-[0.25em] uppercase text-right" style={{ color: "var(--hny-rose-gold-deep)" }}>Introductory</span>
              </div>
              {pricing.map((p) => (
                <div key={p.name} className="grid grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr] gap-2 md:gap-4 px-6 py-4 border-b last:border-0" style={{ borderColor: "var(--hny-champagne)" }}>
                  <span className="col-span-2 md:col-span-1 font-display text-base" style={{ color: "var(--hny-ink)" }}>{p.name}</span>
                  <span className="font-body text-sm md:text-right line-through" style={{ color: "var(--hny-soft-brown)" }}>
                    <span className="md:hidden text-[10px] tracking-wider uppercase mr-2" style={{ color: "var(--hny-soft-brown)" }}>Std</span>{p.standard}
                  </span>
                  <span className="font-body text-base md:text-right font-medium" style={{ color: "var(--hny-rose-gold-deep)" }}>
                    <span className="md:hidden text-[10px] tracking-wider uppercase mr-2" style={{ color: "var(--hny-rose-gold)" }}>Intro</span>{p.intro}
                  </span>
                </div>
              ))}
            </div>
            <p className="font-body text-xs italic mt-4 leading-relaxed" style={{ color: "var(--hny-soft-brown)" }}>
              Introductory pricing is available for a limited time only. Consultation and suitability approval required before treatment.
            </p>
          </motion.div>

          <motion.div {...fadeUp} className="lg:sticky lg:top-24 lg:self-start">
            <span className="font-body text-[10px] tracking-[0.3em] uppercase" style={{ color: "var(--hny-rose-gold)" }}>Payment plans</span>
            <h2 className="font-display text-3xl md:text-4xl mt-3 mb-5" style={{ color: "var(--hny-ink)" }}>Flexible payment plans</h2>
            <p className="font-body text-sm leading-relaxed mb-7" style={{ color: "var(--hny-soft-brown)" }}>
              Spread the cost of your treatment with Klarna or Clearpay, subject to provider approval. Payment plan options are available on selected appointments.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-5 p-5 rounded-[2px] border" style={{ background: "var(--hny-cream-card)", borderColor: "var(--hny-champagne)" }}>
                <img src={klarnaLogo} alt="Klarna" className="h-8" />
                <div>
                  <div className="font-display text-base" style={{ color: "var(--hny-ink)" }}>Pay with Klarna</div>
                  <div className="font-body text-xs" style={{ color: "var(--hny-soft-brown)" }}>Spread the cost in 3 or finance over longer terms.</div>
                </div>
              </div>
              <div className="flex items-center gap-5 p-5 rounded-[2px] border" style={{ background: "var(--hny-cream-card)", borderColor: "var(--hny-champagne)" }}>
                <img src={clearpayLogo} alt="Clearpay" className="h-8" />
                <div>
                  <div className="font-display text-base" style={{ color: "var(--hny-ink)" }}>Pay with Clearpay</div>
                  <div className="font-body text-xs" style={{ color: "var(--hny-soft-brown)" }}>Split your payment into 4 interest-free instalments.</div>
                </div>
              </div>
            </div>
            <Link to="/bookings" className="mt-7 inline-flex w-full justify-center px-7 py-3.5 rounded-full text-white font-body text-[11px] tracking-[0.25em] uppercase" style={{ background: "linear-gradient(135deg, var(--hny-rose-gold), var(--hny-rose-gold-deep))" }}>
              Book Consultation · £100
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CONSULTATION */}
      <section className="py-20" style={{ background: "var(--hny-cream)" }}>
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <motion.div {...fadeUp} className="aspect-[4/5] rounded-[2px] overflow-hidden border" style={{ borderColor: "var(--hny-champagne)" }}>
            <img src={consult} alt="Luxury consultation room with ultrasound at HNY CLUB by Hive Clinic, Deansgate" loading="lazy" className="w-full h-full object-cover" />
          </motion.div>
          <motion.div {...fadeUp}>
            <span className="font-body text-[10px] tracking-[0.3em] uppercase" style={{ color: "var(--hny-rose-gold)" }}>Consultation</span>
            <h2 className="font-display text-3xl md:text-4xl mt-3 mb-5" style={{ color: "var(--hny-ink)" }}>Consultation & Treatment Planning</h2>
            <p className="font-body text-base leading-relaxed mb-6" style={{ color: "var(--hny-soft-brown)" }}>
              Every HNY CLUB journey begins with a detailed consultation to assess your suitability, discuss your body goals and create a tailored treatment plan.
            </p>
            <div className="inline-flex items-baseline gap-2 mb-6">
              <span className="font-display text-4xl" style={{ color: "var(--hny-rose-gold-deep)" }}>£100</span>
              <span className="font-body text-xs tracking-wide" style={{ color: "var(--hny-soft-brown)" }}>consultation fee</span>
            </div>
            <ul className="space-y-2.5 mb-6">
              {[
                "Suitability screening",
                "Ultrasound-led treatment planning",
                "Tailored ml recommendation",
                "Pricing breakdown",
                "Pre-care and aftercare guidance",
                "2-week review included after treatment",
                "Ongoing support after your appointment",
              ].map((b) => (
                <li key={b} className="flex items-start gap-3 font-body text-sm" style={{ color: "var(--hny-ink)" }}>
                  <Check size={14} strokeWidth={1.5} style={{ color: "var(--hny-rose-gold)" }} className="mt-1 flex-shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
            <p className="font-body text-xs italic leading-relaxed mb-6" style={{ color: "var(--hny-soft-brown)" }}>
              The £100 consultation fee is redeemable against treatment if you are suitable and book within 14 days.
            </p>
            <Link to="/bookings" className="inline-block px-7 py-3.5 rounded-full text-white font-body text-[11px] tracking-[0.25em] uppercase" style={{ background: "linear-gradient(135deg, var(--hny-rose-gold), var(--hny-rose-gold-deep))" }}>
              Book Consultation
            </Link>
          </motion.div>
        </div>
      </section>

      {/* WHY */}
      <section className="py-20" style={{ background: "var(--hny-blush)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-12">
            <span className="font-body text-[10px] tracking-[0.3em] uppercase" style={{ color: "var(--hny-rose-gold)" }}>The HNY difference</span>
            <h2 className="font-display text-3xl md:text-4xl mt-3" style={{ color: "var(--hny-ink)" }}>Why choose HNY CLUB by Hive Clinic?</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {whyPoints.map((p, i) => (
              <motion.div key={p.label} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.06 }} className="p-6 text-center rounded-[2px] border" style={{ background: "var(--hny-cream-card)", borderColor: "var(--hny-champagne)" }}>
                <p.icon size={22} strokeWidth={1.2} className="mx-auto mb-4" style={{ color: "var(--hny-rose-gold-deep)" }} />
                <p className="font-display text-sm leading-snug" style={{ color: "var(--hny-ink)" }}>{p.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRE / AFTERCARE */}
      <section className="py-20" style={{ background: "var(--hny-cream)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-12">
            <span className="font-body text-[10px] tracking-[0.3em] uppercase" style={{ color: "var(--hny-rose-gold)" }}>Care</span>
            <h2 className="font-display text-3xl md:text-4xl mt-3" style={{ color: "var(--hny-ink)" }}>Pre-care & Aftercare</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Before your appointment",
                items: [
                  "Avoid alcohol for 24-48 hours",
                  "Avoid sunbeds and intense exercise before treatment",
                  "Arrive hydrated and well",
                  "Wear comfortable clothing",
                  "Full preparation guide will be sent before treatment",
                ],
              },
              {
                title: "After your appointment",
                items: [
                  "Mild swelling, tenderness or bruising can be normal",
                  "Avoid gym, heat and alcohol for 48 hours",
                  "Avoid pressure on the treated area as advised",
                  "Attend your 2-week review",
                  "Full aftercare PDF will be provided",
                ],
              },
            ].map((c) => (
              <motion.div key={c.title} {...fadeUp} className="p-8 rounded-[2px] border" style={{ background: "var(--hny-cream-card)", borderColor: "var(--hny-champagne)" }}>
                <h3 className="font-display text-xl mb-5" style={{ color: "var(--hny-ink)" }}>{c.title}</h3>
                <ul className="space-y-2.5">
                  {c.items.map((i) => (
                    <li key={i} className="flex items-start gap-3 font-body text-sm" style={{ color: "var(--hny-soft-brown)" }}>
                      <span className="mt-2 h-1 w-1 rounded-full flex-shrink-0" style={{ background: "var(--hny-rose-gold)" }} />
                      {i}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          <p className="font-body text-xs italic text-center mt-6" style={{ color: "var(--hny-soft-brown)" }}>
            A full pre-care and aftercare PDF will be sent before your appointment.
          </p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24" style={{ background: "linear-gradient(180deg, var(--hny-blush) 0%, var(--hny-champagne) 100%)" }}>
        <motion.div {...fadeUp} className="max-w-2xl mx-auto px-6 text-center">
          <span className="font-body text-[10px] tracking-[0.3em] uppercase" style={{ color: "var(--hny-rose-gold-deep)" }}>Begin your journey</span>
          <h2 className="font-display text-4xl md:text-5xl mt-3 mb-5" style={{ color: "var(--hny-ink)" }}>Ready to begin?</h2>
          <p className="font-body text-base leading-relaxed mb-8" style={{ color: "var(--hny-soft-brown)" }}>
            Start your HNY CLUB journey with a personalised consultation at Hive Clinic, Deansgate.
          </p>
          <Link to="/bookings" className="inline-block px-9 py-4 rounded-full text-white font-body text-[12px] tracking-[0.3em] uppercase shadow-md hover:opacity-90 transition" style={{ background: "linear-gradient(135deg, var(--hny-rose-gold), var(--hny-rose-gold-deep))" }}>
            Book Consultation · £100
          </Link>
          <p className="font-body text-xs mt-5" style={{ color: "var(--hny-soft-brown)" }}>
            Flexible payment plans available with Klarna and Clearpay.
          </p>
        </motion.div>
      </section>
    </HnyLayout>
  );
};

export default HnyClub;
