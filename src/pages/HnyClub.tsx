import { useState } from "react";
import { motion } from "framer-motion";
import HnyLayout, { INSTAGRAM_URL, WHATSAPP_URL, DEPOSIT_URL } from "@/components/HnyLayout";
import { usePageMeta } from "@/hooks/use-page-meta";
import heroBaddie from "@/assets/hny/hero-baddie.jpg";
import heroWoman from "@/assets/hny/hero-woman.jpg";
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

const GRADIENT = "linear-gradient(135deg, var(--hny-rose-gold), var(--hny-rose-gold-deep))";

const waLink = (ml: string) =>
  `https://wa.me/447795008114?text=${encodeURIComponent(`Hi HNY CLUB, I'd like a virtual chat about Liquid BBL (${ml}) in Manchester.`)}`;

const pricing = [
  { ml: "100ml", price: "£499", monthly: "from £41/mo", note: "Subtle definition, soft enhancement" },
  { ml: "250ml", price: "£999", monthly: "from £83/mo", note: "Soft hip dip correction" },
  { ml: "300ml", price: "£1,199", monthly: "from £99/mo", note: "Lift and projection" },
  { ml: "500ml", price: "£1,999", monthly: "from £166/mo", note: "Sculpted curve" },
  { ml: "800ml", price: "£2,999", monthly: "from £249/mo", note: "Statement silhouette" },
  { ml: "1L Bespoke", price: "£3,499", monthly: "from £291/mo", note: "Fully bespoke transformation" },
];

const expectSteps = [
  { t: "Arrival", d: "Welcomed into the private Deansgate suite. Tea, water, soft lighting. Your phone stays yours, your privacy stays ours." },
  { t: "Assessment", d: "We review your goals, anatomy, lifestyle and medical history. Honest guidance on volume, projection and what is realistic for your shape." },
  { t: "Ultrasound Mapping", d: "Live ultrasound is used to map vessels and tissue planes before any product is placed. This is what makes ultrasound-led BBL filler safer and more precise." },
  { t: "Numbing", d: "Topical numbing is applied and the product itself contains lidocaine. Most clients describe a pressure sensation rather than pain." },
  { t: "Sculpting", d: "Hyaluronic acid filler is placed in considered layers to add volume, lift and projection while balancing hip dips. Treatment time is typically 45 to 75 minutes." },
  { t: "Review", d: "We review your shape together standing and seated, take consented photographs and walk you through aftercare in writing." },
  { t: "Leaving", d: "You walk out the same day in your own clothes. Light daily activity is fine, full results refine across two to four weeks." },
];

const prepareGroups = [
  {
    when: "Two weeks before",
    items: [
      "Avoid non-essential blood thinners (ibuprofen, aspirin, fish oil, vitamin E, high-dose turmeric). Always check with your GP first.",
      "Pause retinol or active acids near the lower back and buttocks.",
      "No new injectable or laser treatments to the area.",
      "Increase daily water intake and prioritise protein in your meals.",
    ],
  },
  {
    when: "48 hours before",
    items: [
      "No alcohol, no recreational substances.",
      "No intense exercise, sauna, steam or sunbeds.",
      "Avoid fake tan on the treatment area.",
      "Eat a full meal on the day of treatment.",
    ],
  },
  {
    when: "Day of",
    items: [
      "Arrive freshly showered with clean skin, no body lotion or oil on the area.",
      "Wear comfortable, loose clothing and bring soft underwear with no thick seams.",
      "Bring a light snack and water for after treatment.",
      "Allow up to 90 minutes for the appointment in total.",
    ],
  },
];

const aftercareGroups = [
  {
    when: "First 24 hours",
    items: [
      "No prolonged sitting directly on the treated area. Lean to one side or use a soft cushion under your thighs.",
      "Sleep on your front or side for the first night.",
      "No alcohol, no strenuous exercise, no hot baths.",
      "Mild swelling, tenderness, warmth or light bruising can be normal.",
    ],
  },
  {
    when: "First week",
    items: [
      "Light walking is encouraged from day one.",
      "Avoid gym, spin, sauna, steam, hot yoga and swimming for 7 days.",
      "Sleep on your front or side where possible.",
      "Stay hydrated and keep protein intake high to support healing.",
    ],
  },
  {
    when: "First month",
    items: [
      "Return to normal training gradually from day 8.",
      "Avoid deep tissue massage to the area for 4 weeks.",
      "Final shape refines and softens across 2 to 4 weeks.",
      "Your complimentary 2 week review is booked in before you leave clinic.",
    ],
  },
];

const contactTriggers = [
  "Sudden increase in pain, swelling or redness after the first 48 hours",
  "Skin colour change to white, purple or grey in the treated area",
  "Fever, flu-like symptoms or feeling generally unwell",
  "Any concern at all - we would always rather hear from you",
];

const faqs = [
  { q: "What is a Liquid BBL?", a: "A Liquid BBL, also known as a non-surgical Brazilian Butt Lift or BBL filler, uses advanced hyaluronic acid dermal filler to add volume, lift and projection to the buttocks and balance hip dips. There is no surgery, no general anaesthetic and minimal downtime, making it a safer alternative to traditional fat transfer BBL." },
  { q: "How is this different from a surgical BBL?", a: "A surgical BBL transfers fat under general anaesthetic with weeks of strict downtime and significant risk. A Liquid BBL at HNY Club uses CE-marked hyaluronic acid filler placed under live ultrasound, with no surgery, no scars and most clients back to light daily activity the same day. It is reversible and shapes results in considered stages." },
  { q: "Is the Liquid BBL safe?", a: "At HNY Club every Liquid BBL is performed under live ultrasound guidance by qualified aesthetic practitioners. Ultrasound allows us to visualise vessels and tissue planes before any product is placed, which is the gold standard for body contouring with filler." },
  { q: "Is there downtime?", a: "Most clients return to light daily activity the next day. Avoid the gym, sauna, sunbeds and sitting for long periods directly on the treated area for 48 hours. Mild swelling, tenderness or light bruising can be normal for a few days." },
  { q: "Is the treatment painful?", a: "Topical numbing is applied before treatment and the product itself contains lidocaine. Most clients describe the sensation as pressure rather than pain." },
  { q: "How long do results last?", a: "Liquid BBL results typically last 12 to 18 months depending on volume placed, product used, your lifestyle and individual metabolism. Top-up appointments can be booked once results begin to soften." },
  { q: "Can it be reversed?", a: "Yes. Because we use hyaluronic acid based filler, results can be dissolved with hyaluronidase if ever needed. This is one of the safety advantages over surgical BBL or permanent products." },
  { q: "Who is not suitable?", a: "You must be 21 or over, in good general health and not pregnant or breastfeeding. We do not treat anyone with active skin infection in the area, certain autoimmune conditions, bleeding disorders or recent permanent filler in the same area. Suitability is fully assessed in clinic before any treatment is booked." },
  { q: "When can I exercise again?", a: "Light walking from day one. Avoid the gym, spin, hot yoga and swimming for 7 days. Most clients return to full training from day 8 to 10." },
  { q: "Can I fly after treatment?", a: "We recommend avoiding long-haul flights for 7 days to reduce swelling and prolonged sitting. Short flights from day 3 onwards are usually fine for most clients." },
  { q: "Can I pay in instalments?", a: "Yes. Klarna, Clearpay and PayItMonthly are available across every Liquid BBL package, subject to provider approval. Plans can spread the cost across up to 12 months with 0% options available." },
  { q: "How does the £100 deposit work?", a: "A £100 deposit secures your slot and is fully redeemable against the cost of your treatment. It covers your in-depth in-clinic consultation, ultrasound assessment and tailored plan." },
  { q: "What is the virtual chat?", a: "A friendly Instagram or WhatsApp conversation with our team to answer questions, share guidance and help you decide if a Liquid BBL is right for you. No pressure, no commitment." },
];

const marqueeWords = [
  "Liquid BBL Manchester",
  "Non-Surgical BBL",
  "Hip Dip Filler",
  "BBL Filler",
  "Body Contouring",
  "Bum Filler Manchester",
  "Buttock Filler",
  "Ultrasound Led",
  "0% Payment Plans",
];

const Chapter = ({ n, title, sub }: { n: string; title: string; sub?: string }) => (
  <div className="mb-10 md:mb-14">
    <div className="flex items-center gap-4 mb-4">
      <span className="chapter-num">Chapter {n}</span>
      <span className="flex-1 h-px" style={{ background: "var(--hny-champagne)" }} />
    </div>
    <h2 className="display-lg" style={{ color: "var(--hny-mocha)" }}>{title}</h2>
    {sub && <p className="font-body text-base md:text-lg mt-4 max-w-2xl leading-relaxed" style={{ color: "var(--hny-soft-brown)" }}>{sub}</p>}
  </div>
);

const HnyClub = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  usePageMeta(
    "Liquid BBL Manchester | Non-Surgical BBL, Hip Dip Filler & Body Contouring | HNY Club",
    "Luxury Liquid BBL Manchester at HNY Club. Ultrasound-led non-surgical Brazilian Butt Lift, hip dip filler, BBL filler and body contouring in Deansgate. From £499. Klarna, Clearpay and PayItMonthly available.",
    {
      canonicalPath: "/liquid-bbl-manchester",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "HNY Club by Hive Clinic",
          description: "Ultrasound-led Liquid BBL, non-surgical Brazilian Butt Lift, hip dip filler and body contouring in Deansgate, Manchester.",
          url: "https://www.hiveclinicuk.com/liquid-bbl-manchester",
          telephone: "+447795008114",
          image: "https://www.hiveclinicuk.com/og-hny.jpg",
          priceRange: "££",
          areaServed: "Manchester",
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
            price: p.price.replace(/[£,]/g, "").replace(/[^\d.]/g, ""),
            priceCurrency: "GBP",
            availability: "https://schema.org/InStock",
          })),
        },
        {
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "What to expect at your Liquid BBL appointment",
          step: expectSteps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.t, text: s.d })),
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.hiveclinicuk.com/" },
            { "@type": "ListItem", position: 2, name: "Liquid BBL Manchester", item: "https://www.hiveclinicuk.com/liquid-bbl-manchester" },
          ],
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
      {/* ============ EDITORIAL HERO ============ */}
      <section className="relative overflow-hidden" style={{ background: "var(--hny-cream)" }}>
        <div className="max-w-[1320px] mx-auto px-5 md:px-10 pt-6 pb-12 md:pt-10 md:pb-20 grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-14 items-end">
          <motion.div {...fadeUp}>
            <div className="flex items-center gap-3 mb-5">
              <span className="kicker" style={{ color: "var(--hny-rose-gold-deep)" }}>HNY CLUB</span>
              <span className="w-10 h-px" style={{ background: "var(--hny-rose-gold-deep)" }} />
              <span className="kicker" style={{ color: "var(--hny-soft-brown)" }}>Vol. 01 / Manchester</span>
            </div>
            <h1 className="display-xl" style={{ color: "var(--hny-mocha)" }}>
              The Liquid BBL.
            </h1>
            <p className="font-body text-base md:text-lg leading-relaxed mt-6 mb-8 max-w-xl" style={{ color: "var(--hny-soft-brown)" }}>
              Non-surgical Brazilian Butt Lift, hip dip filler and body contouring in Deansgate Manchester. Ultrasound-led, walk-in walk-out, and tailored to your shape. The luxury alternative to surgical BBL.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-7 py-3.5 rounded-full text-white font-body text-[11px] tracking-[0.25em] uppercase hover:opacity-90 transition"
                style={{ background: GRADIENT }}
              >
                Virtual Chat on Instagram
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-7 py-3.5 rounded-full font-body text-[11px] tracking-[0.25em] uppercase border transition hover:opacity-70"
                style={{ borderColor: "var(--hny-mocha)", color: "var(--hny-mocha)" }}
              >
                WhatsApp Us
              </a>
            </div>

            <a href="#pricing" className="inline-block mt-6 font-body text-[11px] tracking-[0.22em] uppercase hover:opacity-70" style={{ color: "var(--hny-rose-gold-deep)" }}>
              Secure your slot from £100 deposit
            </a>
          </motion.div>

          <motion.div {...fadeUp} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
            <div className="relative aspect-[3/4] rounded-[2px] overflow-hidden shadow-[0_40px_90px_-30px_rgba(194,24,91,0.45)]" style={{ background: "var(--hny-mocha)" }}>
              <img
                src={heroBaddie}
                alt="Liquid BBL Manchester - luxury non-surgical Brazilian Butt Lift at HNY Club"
                className="w-full h-full object-cover"
                width={1280}
                height={1600}
                fetchPriority="high"
              />
              <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, transparent 50%, rgba(26,14,20,0.6) 100%)" }} />
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-white">
                <span className="font-body text-[10px] tracking-[0.3em] uppercase opacity-90">Deansgate, M3</span>
                <span className="font-display text-sm opacity-90">No. 001</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ MARQUEE ============ */}
      <section className="py-5 border-y overflow-hidden" style={{ borderColor: "var(--hny-champagne)", background: "var(--hny-blush)" }}>
        <div className="marquee-track font-display text-2xl md:text-4xl" style={{ color: "var(--hny-mocha)" }}>
          {[...marqueeWords, ...marqueeWords, ...marqueeWords].map((w, i) => (
            <span key={i} className="flex items-center gap-12">
              {w}
              <span className="inline-block w-2 h-2 rounded-full" style={{ background: "var(--hny-rose-gold)" }} />
            </span>
          ))}
        </div>
      </section>

      {/* ============ CHAPTER 01 - TREATMENT ============ */}
      <section id="treatment" className="py-20 md:py-28" style={{ background: "var(--hny-cream)" }}>
        <div className="max-w-[1240px] mx-auto px-5 md:px-10">
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20 items-start">
            <motion.div {...fadeUp} className="lg:sticky lg:top-32">
              <div className="aspect-[3/4] rounded-[2px] overflow-hidden">
                <img src={lifestyle1} alt="Non-surgical BBL Manchester - sculpted feminine silhouette by HNY Club" className="w-full h-full object-cover" loading="lazy" />
              </div>
            </motion.div>
            <motion.div {...fadeUp}>
              <Chapter n="01" title="The Treatment" sub="Liquid BBL, hip dip filler, BBL filler and body contouring. One ultrasound-led method, three ways to wear it." />
              <div className="space-y-5 font-body text-base md:text-lg leading-relaxed" style={{ color: "var(--hny-soft-brown)" }}>
                <p>A Liquid BBL is a non-surgical Brazilian Butt Lift performed with advanced hyaluronic acid filler. We use the filler to add volume to the buttocks, lift and project the upper pole, and soften hip dips so the silhouette reads as one continuous, feminine curve from waist to thigh.</p>
                <p>Every treatment at HNY Club is performed under live ultrasound. That is what allows us to map vessels and tissue planes in real time, place product safely, and shape results with precision. No general anaesthetic. No scars. No theatre.</p>
                <p>Most clients are in and out in under 90 minutes and back to light daily life the same day. Final shape refines across two to four weeks and typically holds for 12 to 18 months. Because the product is hyaluronic acid based, it can be adjusted, topped up or dissolved.</p>
              </div>
              <div className="mt-8 grid sm:grid-cols-2 gap-x-8 gap-y-3 font-body text-sm" style={{ color: "var(--hny-mocha)" }}>
                {[
                  "Lifts and projects the buttocks",
                  "Corrects and softens hip dips",
                  "Adds feminine curve and volume",
                  "Reversible hyaluronic acid filler",
                  "Walk-in walk-out, same day",
                  "Results last 12 to 18 months",
                ].map((b) => (
                  <div key={b} className="flex items-start gap-3 py-2 border-t" style={{ borderColor: "var(--hny-champagne)" }}>
                    <span className="font-display text-xs mt-1" style={{ color: "var(--hny-rose-gold-deep)" }}>+</span>
                    {b}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ CHAPTER 02 - PRICELIST ============ */}
      <section id="pricing" className="py-20 md:py-28" style={{ background: "var(--hny-nude)" }}>
        <div className="max-w-[1240px] mx-auto px-5 md:px-10">
          <motion.div {...fadeUp}>
            <Chapter n="02" title="The Pricelist" sub="Transparent pricing by volume. Every package includes in-clinic consultation, ultrasound-led treatment and a complimentary 2 week review." />
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {pricing.map((p, i) => (
              <motion.a
                key={p.ml}
                href={waLink(p.ml)}
                target="_blank"
                rel="noopener noreferrer"
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group p-7 md:p-8 rounded-[2px] border bg-white hover:shadow-[0_24px_60px_-30px_rgba(194,24,91,0.45)] transition-shadow flex flex-col"
                style={{ borderColor: "var(--hny-champagne)" }}
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="chapter-num">No. 0{i + 1}</span>
                  <span className="font-body text-[10px] tracking-[0.2em] uppercase px-2.5 py-1 rounded-full" style={{ background: "var(--hny-blush)", color: "var(--hny-rose-gold-deep)" }}>{p.ml}</span>
                </div>
                <div className="font-display text-5xl md:text-6xl mb-3" style={{ color: "var(--hny-mocha)" }}>{p.price}</div>
                <div className="font-body text-[13px] mb-1" style={{ color: "var(--hny-mocha)" }}>{p.note}</div>
                <div className="font-body text-sm" style={{ color: "var(--hny-soft-brown)" }}>{p.monthly} with Klarna</div>
                <div className="mt-7 pt-5 border-t flex items-center justify-between" style={{ borderColor: "var(--hny-champagne)" }}>
                  <span className="font-body text-[11px] tracking-[0.22em] uppercase" style={{ color: "var(--hny-rose-gold-deep)" }}>Reserve on WhatsApp</span>
                  <span className="font-body text-sm group-hover:translate-x-1 transition-transform" style={{ color: "var(--hny-rose-gold-deep)" }}>→</span>
                </div>
              </motion.a>
            ))}
          </div>

          <motion.div {...fadeUp} className="mt-10 p-7 md:p-9 rounded-[2px] text-center" style={{ background: "var(--hny-mocha)" }}>
            <span className="kicker" style={{ color: "var(--hny-rose-gold)" }}>Reserve your slot</span>
            <p className="font-display text-2xl md:text-3xl mt-3 mb-2" style={{ color: "#FFE0EC" }}>£100 deposit, fully redeemable</p>
            <p className="font-body text-sm max-w-xl mx-auto" style={{ color: "#F8C8D8" }}>
              Includes your in-depth in-clinic consultation, ultrasound assessment and tailored plan. Fully redeemable against your treatment.
            </p>
            <a href={DEPOSIT_URL} className="inline-block mt-5 px-7 py-3 rounded-full font-body text-[11px] tracking-[0.25em] uppercase" style={{ background: GRADIENT, color: "white" }}>
              Secure £100 Deposit
            </a>
          </motion.div>

          <p className="font-body text-xs italic text-center mt-6" style={{ color: "var(--hny-soft-brown)" }}>
            Suitability confirmed in clinic before any treatment. 21+ only. Finance subject to provider approval.
          </p>
        </div>
      </section>

      {/* ============ CHAPTER 03 - PAYMENT PLANS ============ */}
      <section id="plans" className="py-20 md:py-24" style={{ background: "var(--hny-blush)" }}>
        <div className="max-w-[1240px] mx-auto px-5 md:px-10">
          <motion.div {...fadeUp}>
            <Chapter n="03" title="Payment Plans" sub="Spread the cost. Klarna, Clearpay and PayItMonthly are available across every Liquid BBL package, with 0% options available subject to provider approval." />
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { logo: klarnaLogo, name: "Klarna", desc: "Pay in 3 or spread monthly. Soft credit check, no impact on your score." },
              { logo: clearpayLogo, name: "Clearpay", desc: "Pay in 4 instalments over 6 weeks. Interest-free." },
              { logo: payItMonthlyLogo, name: "PayItMonthly", desc: "Spread up to 12 months. 0% finance options available." },
            ].map((p, i) => (
              <motion.div
                key={p.name}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="p-7 rounded-[2px] border bg-white flex flex-col"
                style={{ borderColor: "var(--hny-champagne)" }}
              >
                <div className="h-12 flex items-center mb-5">
                  <img src={p.logo} alt={`${p.name} payment plans for Liquid BBL Manchester`} className="h-7 md:h-8 w-auto" />
                </div>
                <h3 className="font-display text-xl mb-2" style={{ color: "var(--hny-mocha)" }}>{p.name}</h3>
                <p className="font-body text-sm leading-relaxed flex-1" style={{ color: "var(--hny-soft-brown)" }}>{p.desc}</p>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="mt-5 font-body text-[11px] tracking-[0.22em] uppercase" style={{ color: "var(--hny-rose-gold-deep)" }}>
                  Ask about {p.name} →
                </a>
              </motion.div>
            ))}
          </div>
          <p className="font-body text-xs italic text-center mt-8 max-w-xl mx-auto" style={{ color: "var(--hny-soft-brown)" }}>
            Example: a £1,199 Liquid BBL split with PayItMonthly is from £99 per month over 12 months. Subject to provider approval.
          </p>
        </div>
      </section>

      {/* ============ CHAPTER 04 - WHAT TO EXPECT ============ */}
      <section id="expect" className="py-20 md:py-28" style={{ background: "var(--hny-cream)" }}>
        <div className="max-w-[1240px] mx-auto px-5 md:px-10">
          <motion.div {...fadeUp}>
            <Chapter n="04" title="What to expect" sub="Step by step, from the moment you walk into the Deansgate suite to the moment you leave." />
          </motion.div>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
            {expectSteps.map((s, i) => (
              <motion.div
                key={s.t}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="flex gap-5 py-5 border-t"
                style={{ borderColor: "var(--hny-champagne)" }}
              >
                <span className="font-display text-3xl flex-shrink-0 w-12" style={{ color: "var(--hny-rose-gold-deep)" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-lg md:text-xl mb-1.5" style={{ color: "var(--hny-mocha)" }}>{s.t}</h3>
                  <p className="font-body text-sm md:text-base leading-relaxed" style={{ color: "var(--hny-soft-brown)" }}>{s.d}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CHAPTER 05 - PREPARE ============ */}
      <section id="prepare" className="py-20 md:py-28" style={{ background: "var(--hny-nude)" }}>
        <div className="max-w-[1240px] mx-auto px-5 md:px-10">
          <motion.div {...fadeUp}>
            <Chapter n="05" title="Prepare" sub="Small choices in the days before treatment make a real difference to swelling, bruising and how quickly your shape refines." />
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5">
            {prepareGroups.map((g, i) => (
              <motion.div
                key={g.when}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="p-7 rounded-[2px] border bg-white"
                style={{ borderColor: "var(--hny-champagne)" }}
              >
                <span className="kicker" style={{ color: "var(--hny-rose-gold-deep)" }}>{g.when}</span>
                <ul className="mt-5 space-y-3.5">
                  {g.items.map((it) => (
                    <li key={it} className="flex gap-3 font-body text-sm leading-relaxed" style={{ color: "var(--hny-soft-brown)" }}>
                      <span className="font-display text-base flex-shrink-0" style={{ color: "var(--hny-rose-gold-deep)" }}>+</span>
                      {it}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CHAPTER 06 - AFTERCARE ============ */}
      <section id="aftercare" className="py-20 md:py-28" style={{ background: "var(--hny-cream)" }}>
        <div className="max-w-[1240px] mx-auto px-5 md:px-10">
          <motion.div {...fadeUp}>
            <Chapter n="06" title="Aftercare" sub="A clear plan for the hours, days and weeks after your Liquid BBL. Stick to this and you give your results the best chance to settle beautifully." />
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5 mb-10">
            {aftercareGroups.map((g, i) => (
              <motion.div
                key={g.when}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="p-7 rounded-[2px] border bg-white"
                style={{ borderColor: "var(--hny-champagne)" }}
              >
                <span className="kicker" style={{ color: "var(--hny-rose-gold-deep)" }}>{g.when}</span>
                <ul className="mt-5 space-y-3.5">
                  {g.items.map((it) => (
                    <li key={it} className="flex gap-3 font-body text-sm leading-relaxed" style={{ color: "var(--hny-soft-brown)" }}>
                      <span className="font-display text-base flex-shrink-0" style={{ color: "var(--hny-rose-gold-deep)" }}>+</span>
                      {it}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          <motion.div {...fadeUp} className="p-7 md:p-9 rounded-[2px]" style={{ background: "var(--hny-mocha)" }}>
            <div className="grid md:grid-cols-[1fr_1.5fr] gap-6 items-start">
              <div>
                <span className="kicker" style={{ color: "var(--hny-rose-gold)" }}>Contact us if</span>
                <p className="font-display text-2xl mt-3" style={{ color: "#FFE0EC" }}>You feel anything at all is off.</p>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-block mt-4 px-6 py-3 rounded-full font-body text-[11px] tracking-[0.25em] uppercase" style={{ background: GRADIENT, color: "white" }}>
                  WhatsApp Your Practitioner
                </a>
              </div>
              <ul className="space-y-3 font-body text-sm leading-relaxed" style={{ color: "#F8C8D8" }}>
                {contactTriggers.map((t) => (
                  <li key={t} className="flex gap-3">
                    <span className="font-display text-base flex-shrink-0" style={{ color: "var(--hny-rose-gold)" }}>+</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ CHAPTER 07 - RESULTS ============ */}
      <section id="results" className="py-20 md:py-28" style={{ background: "var(--hny-nude)" }}>
        <div className="max-w-[1240px] mx-auto px-5 md:px-10">
          <motion.div {...fadeUp}>
            <Chapter n="07" title="Results" sub="Real client outcomes shared with consent. Individual results vary based on anatomy, volume placed and aftercare." />
          </motion.div>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { src: result1, cap: "Liquid BBL Manchester, 300ml. Hip dip correction and lift." },
              { src: result2, cap: "Non-surgical BBL Manchester, 500ml. Projection and sculpted curve." },
            ].map((r, i) => (
              <motion.figure
                key={i}
                {...fadeUp}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="overflow-hidden rounded-[2px] border bg-white"
                style={{ borderColor: "var(--hny-champagne)" }}
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={r.src}
                    alt={`Liquid BBL Manchester before and after result ${i + 1} - HNY Club non-surgical Brazilian Butt Lift`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <figcaption className="px-5 py-4 font-body text-xs tracking-wide" style={{ color: "var(--hny-soft-brown)" }}>
                  {r.cap}
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CHAPTER 08 - THE EXPERIENCE ============ */}
      <section className="relative overflow-hidden" style={{ background: "var(--hny-mocha)" }}>
        <div className="grid lg:grid-cols-2 items-stretch">
          <div className="aspect-[4/5] lg:aspect-auto">
            <img src={heroWoman} alt="HNY Club Manchester - private Deansgate suite for Liquid BBL and body contouring" className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div className="px-6 md:px-14 py-16 md:py-24 flex items-center">
            <div className="max-w-lg">
              <span className="chapter-num" style={{ color: "var(--hny-rose-gold)" }}>Chapter 08</span>
              <h2 className="display-lg mt-3 mb-5" style={{ color: "#FFE0EC" }}>The experience.</h2>
              <p className="font-body text-base md:text-lg leading-relaxed mb-5" style={{ color: "#F8C8D8" }}>
                A private Deansgate suite. Soft lighting, considered playlists and tea on arrival. Your appointment is yours, your phone stays yours, your privacy stays ours.
              </p>
              <p className="font-body text-base md:text-lg leading-relaxed mb-7" style={{ color: "#F8C8D8" }}>
                HNY Club exists for the woman who wants more curve without the operating theatre. Subtle or statement, your shape, your call.
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

      {/* ============ CHAPTER 09 - FAQ ============ */}
      <section id="faq" className="py-20 md:py-28" style={{ background: "var(--hny-cream)" }}>
        <div className="max-w-3xl mx-auto px-5 md:px-8">
          <motion.div {...fadeUp}>
            <Chapter n="09" title="Frequently Asked" sub="Everything most clients want to know before booking a Liquid BBL in Manchester. If your question is not here, send us a WhatsApp." />
          </motion.div>
          <div className="space-y-3">
            {faqs.map((f, i) => {
              const open = openFaq === i;
              return (
                <motion.div
                  key={f.q}
                  {...fadeUp}
                  transition={{ duration: 0.4, delay: i * 0.03 }}
                  className="border rounded-[2px] bg-white overflow-hidden"
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

      {/* ============ EDITORIAL CTA BAND ============ */}
      <section className="py-20 md:py-28" style={{ background: "var(--hny-mocha)" }}>
        <div className="max-w-4xl mx-auto px-5 md:px-8 text-center">
          <motion.div {...fadeUp}>
            <span className="kicker" style={{ color: "var(--hny-rose-gold)" }}>Ready when you are</span>
            <h2 className="display-lg mt-4 mb-5" style={{ color: "#FFE0EC" }}>
              Start with a virtual chat.
            </h2>
            <p className="font-body text-base md:text-lg max-w-xl mx-auto mb-8" style={{ color: "#F8C8D8" }}>
              No pressure. No commitment. An honest conversation with our team to help you decide whether a Liquid BBL is right for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-7 py-3.5 rounded-full text-white font-body text-[11px] tracking-[0.25em] uppercase" style={{ background: GRADIENT }}>
                DM on Instagram
              </a>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-7 py-3.5 rounded-full font-body text-[11px] tracking-[0.25em] uppercase border" style={{ borderColor: "#F8C8D8", color: "#FFE0EC" }}>
                WhatsApp Chat
              </a>
              <a href={DEPOSIT_URL} className="inline-flex items-center justify-center px-7 py-3.5 rounded-full font-body text-[11px] tracking-[0.25em] uppercase" style={{ background: "#FFE0EC", color: "var(--hny-mocha)" }}>
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
