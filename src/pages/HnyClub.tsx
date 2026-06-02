import { useState } from "react";
import { motion } from "framer-motion";
import HnyLayout, { INSTAGRAM_URL, WHATSAPP_URL, DEPOSIT_URL } from "@/components/HnyLayout";
import { usePageMeta } from "@/hooks/use-page-meta";
import heroBaddie from "@/assets/hny/hero-baddie.jpg";
import lifestyle1 from "@/assets/hny/lifestyle-1.jpg";
import lifestyle2 from "@/assets/hny/lifestyle-2.jpg";
import result1 from "@/assets/hny/result-1.jpg";
import result2 from "@/assets/hny/result-2.jpg";
import hnyLogo from "@/assets/hny/logo.png";
import klarnaLogo from "@/assets/klarna-logo.png";
import clearpayLogo from "@/assets/clearpay-logo.png";
import payItMonthlyLogo from "@/assets/hny/payitmonthly-logo.png";

const fadeUp = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

const pricing = [
  { ml: "100ml", price: "£499", monthly: "from £41/mo", note: "Subtle definition" },
  { ml: "250ml", price: "£999", monthly: "from £83/mo", note: "Soft hip dip correction" },
  { ml: "300ml", price: "£1,199", monthly: "from £99/mo", note: "Lift & projection" },
  { ml: "500ml", price: "£1,999", monthly: "from £166/mo", note: "Sculpted curve" },
  { ml: "800ml", price: "£2,999", monthly: "from £249/mo", note: "Statement silhouette" },
  { ml: "1L Bespoke", price: "£3,499", monthly: "from £291/mo", note: "Fully bespoke transformation" },
];

const whyPoints = [
  { label: "Ultrasound Guided", text: "Every Liquid BBL at HNY Club is planned and performed under live ultrasound for safer, more precise filler placement and a smoother, more natural finish." },
  { label: "No Surgery, No Downtime", text: "Walk in, walk out. Most clients return to light daily activity the same day with no general anaesthetic, no scars and no extended recovery." },
  { label: "Discreet Deansgate Suite", text: "A private, considered space in the heart of Manchester. Total discretion, luxury aftercare and a calendar built around your privacy." },
  { label: "Aftercare Included", text: "Personal aftercare guidance, garment advice and a complimentary 2-week review with every Liquid BBL plan." },
];

const faqs = [
  { q: "What is a Liquid BBL?", a: "A Liquid BBL, also known as a non-surgical Brazilian Butt Lift, uses advanced hyaluronic acid dermal filler to add volume, lift and projection to the buttocks and balance hip dips. There is no surgery, no general anaesthetic and minimal downtime — making it a safer alternative to traditional fat transfer BBL." },
  { q: "Is the Liquid BBL safe?", a: "Yes. At HNY Club every Liquid BBL is performed under live ultrasound guidance by qualified aesthetic practitioners. We use only CE-marked, reversible hyaluronic acid filler designed for body contouring." },
  { q: "Is there downtime?", a: "Most clients return to light daily activity the next day. Avoid the gym, sauna, sunbeds and sitting for long periods directly on the treated area for 48 hours. Mild swelling, tenderness or bruising can be normal for a few days." },
  { q: "Is the treatment painful?", a: "Topical numbing is applied before treatment and the product itself contains lidocaine. Most clients describe it as a pressure sensation rather than pain." },
  { q: "How long do results last?", a: "Liquid BBL results typically last 12 to 18 months depending on volume placed, product used, your lifestyle and individual metabolism. Top-up appointments can be booked once results begin to soften." },
  { q: "Can I pay in instalments?", a: "Yes. Klarna, Clearpay and PayItMonthly are available across every Liquid BBL package, subject to provider approval. Plans can spread the cost across up to 12 months with 0% options available." },
  { q: "How does the £100 deposit work?", a: "A £100 deposit secures your slot and is fully redeemable against the cost of your treatment. It covers your in-depth in-clinic consultation, ultrasound assessment and tailored plan." },
  { q: "What is the virtual chat?", a: "A friendly Instagram or WhatsApp conversation with our team to answer questions, share guidance and help you decide if Liquid BBL is right for you. No pressure, no commitment." },
  { q: "Am I suitable?", a: "Suitability is confirmed at your in-clinic consultation. You must be 21 or over, in good general health and not pregnant or breastfeeding." },
];

const GRADIENT = "linear-gradient(135deg, var(--hny-rose-gold), var(--hny-rose-gold-deep))";

const HnyClub = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  usePageMeta(
    "Liquid BBL Manchester | Non-Surgical BBL & Hip Dip Filler | HNY Club",
    "Award-worthy Liquid BBL and non-surgical Brazilian Butt Lift in Manchester. Ultrasound-led hip dip filler, bum filler and body contouring at HNY Club, Deansgate. From £499. Klarna, Clearpay and PayItMonthly available.",
    {
      canonicalPath: "/liquid-bbl-manchester",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "HNY Club by Hive Clinic",
          description: "Ultrasound-led Liquid BBL, non-surgical Brazilian Butt Lift and hip dip filler in Deansgate, Manchester.",
          url: "https://www.hiveclinicuk.com/liquid-bbl-manchester",
          telephone: "+447795008114",
          priceRange: "££",
          address: { "@type": "PostalAddress", streetAddress: "25 Saint John Street", addressLocality: "Manchester", postalCode: "M3 4DT", addressCountry: "GB" },
        },
        {
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Liquid BBL Manchester",
          serviceType: "Non-surgical Brazilian Butt Lift",
          areaServed: "Manchester",
          provider: { "@type": "LocalBusiness", name: "HNY Club by Hive Clinic" },
          offers: pricing.map((p) => ({
            "@type": "Offer",
            name: `Liquid BBL ${p.ml}`,
            price: p.price.replace(/[£,]/g, ""),
            priceCurrency: "GBP",
            availability: "https://schema.org/InStock",
          })),
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        },
      ],
    }
  );

  return (
    <HnyLayout>
      {/* HERO ====================================================== */}
      <section className="relative overflow-hidden" style={{ background: "var(--hny-cream)" }}>
        <div className="max-w-7xl mx-auto px-5 md:px-8 pt-8 pb-14 md:pt-14 md:pb-20 grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-16 items-center">
          <motion.div {...fadeUp}>
            <span className="font-body text-[10px] tracking-[0.35em] uppercase" style={{ color: "var(--hny-rose-gold-deep)" }}>
              HNY Club · Deansgate Manchester
            </span>
            <h1 className="font-display text-[2.15rem] sm:text-5xl lg:text-[3.7rem] leading-[1.04] mt-4 mb-5" style={{ color: "var(--hny-mocha)" }}>
              Liquid BBL & Non-Surgical Brazilian Butt Lift, Manchester
            </h1>
            <p className="font-body text-base md:text-lg leading-relaxed mb-7 max-w-xl" style={{ color: "var(--hny-soft-brown)" }}>
              The luxury alternative to surgical BBL. Ultrasound-led bum filler, hip dip correction and body contouring tailored to your shape — no surgery, no scars, no extended downtime.
            </p>

            <ul className="flex flex-wrap gap-2 mb-8">
              {["Ultrasound Guided", "No Surgery · No Downtime", "Klarna · Clearpay · PayItMonthly"].map((t) => (
                <li
                  key={t}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border font-body text-[11px] tracking-[0.1em]"
                  style={{ borderColor: "var(--hny-champagne)", background: "var(--hny-cream-card)", color: "var(--hny-mocha)" }}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--hny-rose-gold)" }} />
                  {t}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-white font-body text-[11px] tracking-[0.25em] uppercase shadow-sm hover:opacity-90 transition"
                style={{ background: GRADIENT }}
              >
                Virtual Chat on Instagram
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-body text-[11px] tracking-[0.25em] uppercase border transition hover:opacity-70"
                style={{ borderColor: "var(--hny-mocha)", color: "var(--hny-mocha)" }}
              >
                WhatsApp Us
              </a>
            </div>

            <a href="#pricing" className="inline-block mt-6 font-body text-[11px] tracking-[0.22em] uppercase hover:opacity-70" style={{ color: "var(--hny-rose-gold-deep)" }}>
              Secure your slot from £100 deposit →
            </a>
          </motion.div>

          <motion.div {...fadeUp} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
            <div
              className="relative aspect-[4/5] lg:aspect-[9/12] rounded-[4px] overflow-hidden shadow-[0_40px_90px_-30px_rgba(194,24,91,0.45)]"
              style={{ background: "var(--hny-mocha)" }}
            >
              <img
                src={heroBaddie}
                alt="Liquid BBL Manchester — luxury non-surgical Brazilian Butt Lift at HNY Club"
                className="w-full h-full object-cover"
                width={1280}
                height={1600}
                fetchPriority="high"
              />
              <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, transparent 55%, rgba(26,14,20,0.55) 100%)" }} />
              <img
                src={hnyLogo}
                alt=""
                aria-hidden="true"
                className="absolute top-6 left-6 right-6 mx-auto h-24 md:h-32 w-auto opacity-95"
                style={{ filter: "drop-shadow(0 4px 14px rgba(0,0,0,0.45))" }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* PAYMENT PLANS STRIP ======================================= */}
      <section id="plans" className="py-12 md:py-14" style={{ background: "var(--hny-blush)" }}>
        <div className="max-w-6xl mx-auto px-5 md:px-8 grid md:grid-cols-[1.2fr_1fr] gap-8 items-center">
          <motion.div {...fadeUp}>
            <span className="font-body text-[10px] tracking-[0.35em] uppercase" style={{ color: "var(--hny-rose-gold-deep)" }}>
              Spread the Cost
            </span>
            <h2 className="font-display text-3xl md:text-[2.4rem] leading-[1.1] mt-3 mb-3" style={{ color: "var(--hny-mocha)" }}>
              Liquid BBL from £41/month
            </h2>
            <p className="font-body text-base leading-relaxed max-w-xl" style={{ color: "var(--hny-soft-brown)" }}>
              Treat yourself today, pay over time. We offer <strong>Klarna</strong>, <strong>Clearpay</strong> and <strong>PayItMonthly</strong> across every Liquid BBL package — 0% options available, subject to provider approval.
            </p>
          </motion.div>
          <motion.div {...fadeUp} className="flex flex-col gap-4">
            <div
              className="flex items-center justify-around gap-4 px-6 py-5 rounded-[4px] border bg-white"
              style={{ borderColor: "var(--hny-champagne)" }}
            >
              <img src={klarnaLogo} alt="Klarna" className="h-6 md:h-7" />
              <span className="h-6 w-px" style={{ background: "var(--hny-champagne)" }} />
              <img src={clearpayLogo} alt="Clearpay" className="h-5 md:h-6" />
              <span className="h-6 w-px" style={{ background: "var(--hny-champagne)" }} />
              <img src={payItMonthlyLogo} alt="PayItMonthly" className="h-6 md:h-7" />
            </div>
            <div className="flex gap-2">
              <a
                href="#pricing"
                className="flex-1 text-center px-5 py-3 rounded-full text-white font-body text-[11px] tracking-[0.22em] uppercase"
                style={{ background: GRADIENT }}
              >
                See Pricing
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center px-5 py-3 rounded-full font-body text-[11px] tracking-[0.22em] uppercase border"
                style={{ borderColor: "var(--hny-mocha)", color: "var(--hny-mocha)" }}
              >
                Ask on WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* INTRO / WHAT IS LIQUID BBL ================================ */}
      <section className="py-16 md:py-24" style={{ background: "var(--hny-cream)" }}>
        <div className="max-w-6xl mx-auto px-5 md:px-8 grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-16 items-center">
          <motion.div {...fadeUp} className="order-2 lg:order-1">
            <div className="aspect-[4/5] rounded-[4px] overflow-hidden">
              <img src={lifestyle1} alt="Sculpted feminine silhouette after Liquid BBL Manchester" className="w-full h-full object-cover" loading="lazy" />
            </div>
          </motion.div>
          <motion.div {...fadeUp} className="order-1 lg:order-2">
            <span className="font-body text-[10px] tracking-[0.35em] uppercase" style={{ color: "var(--hny-rose-gold-deep)" }}>
              What is a Liquid BBL?
            </span>
            <h2 className="font-display text-3xl md:text-[2.6rem] leading-[1.1] mt-3 mb-5" style={{ color: "var(--hny-mocha)" }}>
              The non-surgical Brazilian Butt Lift, redefined.
            </h2>
            <p className="font-body text-base md:text-lg leading-relaxed mb-4" style={{ color: "var(--hny-soft-brown)" }}>
              A Liquid BBL uses advanced hyaluronic acid filler to lift, project and shape the buttocks — softening hip dips and creating a fuller, more sculpted silhouette without surgery, scars or general anaesthetic.
            </p>
              <p className="font-body text-base md:text-lg leading-relaxed mb-6" style={{ color: "var(--hny-soft-brown)" }}>
              At HNY Club every treatment is delivered under live ultrasound guidance for safer, more precise placement — giving you a natural, snatched finish in under 60 minutes.
            </p>
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2 font-body text-sm" style={{ color: "var(--hny-mocha)" }}>
              {[
                "Lifts and projects the buttocks",
                "Corrects and softens hip dips",
                "Adds volume & feminine curve",
                "Reversible HA filler",
                "Same-day, walk-in walk-out",
                "Results last 12–18 months",
              ].map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: "var(--hny-rose-gold)" }} />
                  {b}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* PRICING =================================================== */}
      <section id="pricing" className="py-16 md:py-24" style={{ background: "var(--hny-nude)" }}>
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <motion.div {...fadeUp} className="text-center mb-12">
            <span className="font-body text-[10px] tracking-[0.35em] uppercase" style={{ color: "var(--hny-rose-gold-deep)" }}>
              Transparent Pricing
            </span>
            <h2 className="font-display text-3xl md:text-[2.6rem] leading-[1.1] mt-3" style={{ color: "var(--hny-mocha)" }}>
              Liquid BBL & Bum Filler by Volume
            </h2>
            <p className="font-body text-sm md:text-base mt-3 max-w-xl mx-auto" style={{ color: "var(--hny-soft-brown)" }}>
              Advanced ultrasound-led BBL filler to enhance your curves, balance hip dips and create a naturally sculpted silhouette. All packages include consultation, treatment and aftercare review.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {pricing.map((p, i) => (
              <motion.a
                key={p.ml}
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group p-7 md:p-8 rounded-[4px] border bg-white hover:shadow-[0_24px_60px_-30px_rgba(194,24,91,0.45)] transition-shadow flex flex-col"
                style={{ borderColor: "var(--hny-champagne)" }}
              >
                <div
                  className="inline-flex self-start px-3 py-1 rounded-full font-body text-[10px] tracking-[0.25em] uppercase mb-5"
                  style={{ background: "var(--hny-blush)", color: "var(--hny-rose-gold-deep)" }}
                >
                  {p.ml}
                </div>
                <div className="font-display text-4xl md:text-5xl mb-2" style={{ color: "var(--hny-mocha)" }}>{p.price}</div>
                <div className="font-body text-[13px] mb-1" style={{ color: "var(--hny-mocha)" }}>{p.note}</div>
                <div className="font-body text-sm" style={{ color: "var(--hny-soft-brown)" }}>{p.monthly} with Klarna</div>
                <div className="mt-6 pt-5 border-t flex items-center justify-between" style={{ borderColor: "var(--hny-champagne)" }}>
                  <span className="font-body text-[11px] tracking-[0.22em] uppercase" style={{ color: "var(--hny-rose-gold-deep)" }}>
                    Reserve Slot
                  </span>
                  <span className="font-body text-sm group-hover:translate-x-1 transition-transform" style={{ color: "var(--hny-rose-gold-deep)" }}>→</span>
                </div>
              </motion.a>
            ))}
          </div>

          <motion.div {...fadeUp} className="mt-10 p-6 md:p-7 rounded-[4px] text-center" style={{ background: "var(--hny-mocha)" }}>
            <p className="font-display text-lg md:text-xl mb-1" style={{ color: "#FFE0EC" }}>
              £100 deposit secures your slot
            </p>
            <p className="font-body text-sm" style={{ color: "#F8C8D8" }}>
              Fully redeemable against your treatment. Includes in-depth in-clinic consultation, ultrasound assessment and tailored plan.
            </p>
            <a
              href={DEPOSIT_URL}
              className="inline-block mt-5 px-7 py-3 rounded-full font-body text-[11px] tracking-[0.25em] uppercase"
              style={{ background: GRADIENT, color: "white" }}
            >
              Secure £100 Deposit
            </a>
          </motion.div>

          <p className="font-body text-xs italic text-center mt-6" style={{ color: "var(--hny-soft-brown)" }}>
            Suitability assessment required before treatment. 21+ only. Subject to provider approval for finance.
          </p>
        </div>
      </section>

      {/* WHY HNY =================================================== */}
      <section className="py-16 md:py-20" style={{ background: "var(--hny-cream)" }}>
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <motion.div {...fadeUp} className="text-center mb-12">
            <span className="font-body text-[10px] tracking-[0.35em] uppercase" style={{ color: "var(--hny-rose-gold-deep)" }}>
              The HNY Difference
            </span>
            <h2 className="font-display text-3xl md:text-[2.4rem] mt-3" style={{ color: "var(--hny-mocha)" }}>
              Why HNY Club
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {whyPoints.map((p, i) => (
              <motion.div
                key={p.label}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="p-7 rounded-[4px] border bg-white"
                style={{ borderColor: "var(--hny-champagne)" }}
              >
                <div className="font-display text-2xl mb-3" style={{ color: "var(--hny-rose-gold-deep)" }}>0{i + 1}</div>
                <h3 className="font-display text-lg mt-1 mb-2" style={{ color: "var(--hny-mocha)" }}>{p.label}</h3>
                <p className="font-body text-sm leading-relaxed" style={{ color: "var(--hny-soft-brown)" }}>{p.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS ============================================== */}
      <section className="py-16 md:py-20" style={{ background: "var(--hny-blush)" }}>
        <div className="max-w-5xl mx-auto px-5 md:px-8">
          <motion.div {...fadeUp} className="text-center mb-12">
            <span className="font-body text-[10px] tracking-[0.35em] uppercase" style={{ color: "var(--hny-rose-gold-deep)" }}>
              The Process
            </span>
            <h2 className="font-display text-3xl md:text-[2.4rem] mt-3" style={{ color: "var(--hny-mocha)" }}>
              How it works
            </h2>
          </motion.div>
          <ol className="grid md:grid-cols-3 gap-5">
            {[
              { n: "01", t: "Virtual Chat", d: "Start with a friendly Instagram or WhatsApp chat. Share your goals, ask questions, get honest guidance — no pressure." },
              { n: "02", t: "Plan & Deposit", d: "Reserve your slot with a £100 deposit. We book your in-clinic consultation and ultrasound assessment." },
              { n: "03", t: "Sculpt in Clinic", d: "Treatment performed under ultrasound guidance in our Deansgate suite, with a complimentary 2-week review included." },
            ].map((s, i) => (
              <motion.li
                key={s.n}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="p-7 rounded-[4px] border bg-white"
                style={{ borderColor: "var(--hny-champagne)" }}
              >
                <div className="font-display text-3xl mb-3" style={{ color: "var(--hny-rose-gold-deep)" }}>{s.n}</div>
                <h3 className="font-display text-lg mb-2" style={{ color: "var(--hny-mocha)" }}>{s.t}</h3>
                <p className="font-body text-sm leading-relaxed" style={{ color: "var(--hny-soft-brown)" }}>{s.d}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* RESULTS =================================================== */}
      <section id="results" className="py-16 md:py-20" style={{ background: "var(--hny-cream)" }}>
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <motion.div {...fadeUp} className="text-center mb-12">
            <span className="font-body text-[10px] tracking-[0.35em] uppercase" style={{ color: "var(--hny-rose-gold-deep)" }}>
              Real Results
            </span>
            <h2 className="font-display text-3xl md:text-[2.4rem] mt-3" style={{ color: "var(--hny-mocha)" }}>
              Before & After
            </h2>
            <p className="font-body text-sm mt-3 max-w-xl mx-auto" style={{ color: "var(--hny-soft-brown)" }}>
              Real client results shared with consent. Individual outcomes vary based on anatomy, volume placed and aftercare.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-5">
            {[result1, result2].map((src, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="overflow-hidden rounded-[4px] border bg-white"
                style={{ borderColor: "var(--hny-champagne)" }}
              >
                <img
                  src={src}
                  alt={`Liquid BBL Manchester before and after result ${i + 1} at HNY Club`}
                  loading="lazy"
                  className="w-full h-auto object-cover block"
                />
              </motion.div>
            ))}
          </div>
          <p className="font-body text-xs italic text-center mt-6" style={{ color: "var(--hny-soft-brown)" }}>
            Photography shared with explicit client consent.
          </p>
        </div>
      </section>

      {/* LIFESTYLE BAND ============================================ */}
      <section className="relative overflow-hidden" style={{ background: "var(--hny-mocha)" }}>
        <div className="grid md:grid-cols-2 items-stretch">
          <div className="aspect-[4/5] md:aspect-auto">
            <img src={lifestyle2} alt="Confident curves after Liquid BBL at HNY Club Manchester" className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div className="px-6 md:px-12 py-14 md:py-20 flex items-center">
            <div className="max-w-md">
              <span className="font-body text-[10px] tracking-[0.35em] uppercase" style={{ color: "var(--hny-rose-gold)" }}>
                The HNY Edit
              </span>
              <h2 className="font-display text-3xl md:text-[2.6rem] leading-[1.1] mt-3 mb-5" style={{ color: "#FFE0EC" }}>
                Snatched, sculpted, unapologetically you.
              </h2>
              <p className="font-body text-base leading-relaxed mb-7" style={{ color: "#F8C8D8" }}>
                Liquid BBL at HNY Club is for the woman who wants more curve without the operating theatre. Subtle or statement — your shape, your call.
              </p>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-7 py-3.5 rounded-full font-body text-[11px] tracking-[0.25em] uppercase"
                style={{ background: GRADIENT, color: "white" }}
              >
                See More on Instagram
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ ======================================================= */}
      <section id="faq" className="py-16 md:py-24" style={{ background: "var(--hny-cream)" }}>
        <div className="max-w-3xl mx-auto px-5 md:px-8">
          <motion.div {...fadeUp} className="text-center mb-10">
            <span className="font-body text-[10px] tracking-[0.35em] uppercase" style={{ color: "var(--hny-rose-gold-deep)" }}>
              Frequently Asked
            </span>
            <h2 className="font-display text-3xl md:text-[2.4rem] mt-3" style={{ color: "var(--hny-mocha)" }}>
              Your questions, answered
            </h2>
          </motion.div>
          <div className="space-y-3">
            {faqs.map((f, i) => {
              const open = openFaq === i;
              return (
                <motion.div
                  key={f.q}
                  {...fadeUp}
                  transition={{ duration: 0.4, delay: i * 0.03 }}
                  className="border rounded-[4px] bg-white overflow-hidden"
                  style={{ borderColor: "var(--hny-champagne)" }}
                >
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-5 md:px-6 py-4 md:py-5 text-left"
                    aria-expanded={open}
                  >
                    <span className="font-display text-base md:text-lg" style={{ color: "var(--hny-mocha)" }}>{f.q}</span>
                    <span className="font-display text-xl flex-shrink-0" style={{ color: "var(--hny-rose-gold-deep)" }}>{open ? "−" : "+"}</span>
                  </button>
                  {open && (
                    <div className="px-5 md:px-6 pb-5 md:pb-6 font-body text-sm leading-relaxed" style={{ color: "var(--hny-soft-brown)" }}>
                      {f.a}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL CTA ================================================= */}
      <section className="py-16 md:py-24" style={{ background: "var(--hny-mocha)" }}>
        <div className="max-w-4xl mx-auto px-5 md:px-8 text-center">
          <motion.div {...fadeUp}>
            <span className="font-body text-[10px] tracking-[0.35em] uppercase" style={{ color: "var(--hny-rose-gold)" }}>
              Ready when you are
            </span>
            <h2 className="font-display text-4xl md:text-[3rem] leading-[1.05] mt-4 mb-5" style={{ color: "#FFE0EC" }}>
              Start with a virtual chat
            </h2>
            <p className="font-body text-base md:text-lg max-w-xl mx-auto mb-8" style={{ color: "#F8C8D8" }}>
              No pressure. No commitment. Just an honest conversation with our team to help you decide.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-white font-body text-[11px] tracking-[0.25em] uppercase"
                style={{ background: GRADIENT }}
              >
                DM on Instagram
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-body text-[11px] tracking-[0.25em] uppercase border"
                style={{ borderColor: "#F8C8D8", color: "#FFE0EC" }}
              >
                WhatsApp Chat
              </a>
              <a
                href={DEPOSIT_URL}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-body text-[11px] tracking-[0.25em] uppercase"
                style={{ background: "#FFE0EC", color: "var(--hny-mocha)" }}
              >
                Secure £100 Deposit
              </a>
            </div>
            <div className="mt-10 pt-8 border-t flex flex-wrap justify-center gap-x-8 gap-y-2 font-body text-xs" style={{ borderColor: "rgba(248,200,216,0.25)", color: "#F8C8D8" }}>
              <span>25 Saint John Street, Deansgate, Manchester M3 4DT</span>
              <a href="tel:+447795008114" className="hover:opacity-80">+44 7795 008114</a>
            </div>
          </motion.div>
        </div>
      </section>
    </HnyLayout>
  );
};

export default HnyClub;
