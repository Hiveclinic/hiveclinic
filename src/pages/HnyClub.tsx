import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, Heart, CalendarCheck, Check, ArrowRight, Plus, Minus, MapPin, Phone } from "lucide-react";
import HnyLayout, { BOOK_URL } from "@/components/HnyLayout";
import { usePageMeta } from "@/hooks/use-page-meta";
import result1 from "@/assets/hny/result-1.jpg";
import result2 from "@/assets/hny/result-2.jpg";
import klarnaLogo from "@/assets/klarna-logo.png";
import clearpayLogo from "@/assets/clearpay-logo.png";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

const pricing = [
  { ml: "100ml", price: "£499" },
  { ml: "250ml", price: "£999" },
  { ml: "300ml", price: "£1,199" },
  { ml: "500ml", price: "£1,999" },
  { ml: "800ml", price: "£2,999" },
];

const treatments = [
  { title: "Liquid BBL", from: "from £499", text: "Enhance shape, volume and projection for a naturally lifted silhouette." },
  { title: "Hip Dip Filler", from: "from £499", text: "Smooth hip dips for a balanced, feminine contour." },
  { title: "Signature Sculpt", from: "from £999", text: "Tailored projection, hip dip balancing and contouring." },
  { title: "Bespoke 1L Plan", from: "Consultation", text: "Personalised high-volume plan for harmonious body contouring." },
];

const whyPoints = [
  { icon: Sparkles, label: "Ultrasound-led planning" },
  { icon: Heart, label: "Tailored to your anatomy" },
  { icon: CalendarCheck, label: "2-week review included" },
  { icon: ShieldCheck, label: "Ongoing aftercare support" },
  { icon: Check, label: "Pre & aftercare PDF" },
];

const faqs = [
  { q: "Is there downtime?", a: "Most clients return to light daily activity the next day. Avoid the gym, heat and pressure on the treated area for 48 hours. Mild swelling, tenderness or bruising can be normal." },
  { q: "Is the treatment painful?", a: "Topical numbing is applied before treatment. Most clients describe it as a pressure sensation rather than pain." },
  { q: "How long do results last?", a: "Results typically last 12-18 months depending on the product, volume placed and your individual metabolism." },
  { q: "Am I suitable?", a: "Suitability is confirmed at consultation. You must be 21+, in good health and not pregnant or breastfeeding." },
  { q: "Can I pay in instalments?", a: "Yes — Klarna and Clearpay are available, subject to provider approval." },
  { q: "What does the consultation include?", a: "Suitability screening, ultrasound-led planning, tailored ml recommendation, full pricing breakdown, and pre/aftercare guidance. The £100 fee is redeemable against treatment booked within 14 days." },
];

const GRADIENT = "linear-gradient(135deg, var(--hny-rose-gold), var(--hny-rose-gold-deep))";
const BookLink = ({ children, className, variant = "primary" }: { children: React.ReactNode; className?: string; variant?: "primary" | "ghost" }) => {
  const external = /^https?:/i.test(BOOK_URL);
  const style = variant === "primary" ? { background: GRADIENT } : undefined;
  return external ? (
    <a href={BOOK_URL} target="_blank" rel="noopener noreferrer" className={className} style={style}>{children}</a>
  ) : (
    <Link to={BOOK_URL} className={className} style={style}>{children}</Link>
  );
};

const HnyClub = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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
          telephone: "+447795008114",
          address: { "@type": "PostalAddress", streetAddress: "25 Saint John Street", addressLocality: "Manchester", postalCode: "M3 4DT", addressCountry: "GB" },
        },
        {
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Liquid BBL Manchester",
          serviceType: "Non-surgical body contouring",
          areaServed: "Manchester",
          provider: { "@type": "MedicalBusiness", name: "HNY CLUB by Hive Clinic" },
          offers: pricing.map((p) => ({ "@type": "Offer", name: `Liquid BBL ${p.ml}`, price: p.price.replace(/[£,]/g, ""), priceCurrency: "GBP" })),
        },
        {
          "@context": "https://schema.org",
          "@type": "VideoObject",
          name: "HNY CLUB by Hive Clinic — Liquid BBL Manchester",
          description: "Ultrasound-led Liquid BBL and non-surgical body contouring at Hive Clinic, Deansgate Manchester.",
          thumbnailUrl: "https://www.hiveclinicuk.com/hny/hero-poster.jpg",
          contentUrl: "https://www.hiveclinicuk.com/hny/hero.mp4",
          uploadDate: "2026-05-27",
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
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

  return (
    <HnyLayout>
      {/* HERO ====================================================== */}
      <section className="relative overflow-hidden" style={{ background: "var(--hny-cream)" }}>
        <div className="max-w-7xl mx-auto px-6 pt-10 pb-12 md:pt-16 md:pb-20 grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-14 items-center">
          <motion.div {...fadeUp}>
            <span className="font-body text-[10px] tracking-[0.35em] uppercase" style={{ color: "var(--hny-rose-gold-deep)" }}>
              Non-surgical body contouring · Manchester
            </span>
            <h1 className="font-display text-[2.1rem] sm:text-5xl lg:text-[3.6rem] leading-[1.05] mt-4 mb-5" style={{ color: "var(--hny-mocha)" }}>
              Liquid BBL & Non-Surgical Body Contouring, Deansgate&nbsp;Manchester
            </h1>
            <p className="font-body text-base md:text-lg leading-relaxed mb-6 max-w-xl" style={{ color: "var(--hny-soft-brown)" }}>
              A refined, ultrasound-led approach to hip dip correction, soft projection and tailored body sculpting — designed around your anatomy, by qualified practitioners at Hive Clinic.
            </p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 mb-7">
              {["Ultrasound-led planning", "Tailored treatment plan", "2-week review included"].map((t) => (
                <li key={t} className="flex items-center gap-2 font-body text-xs tracking-wide" style={{ color: "var(--hny-mocha)" }}>
                  <span className="h-1 w-1 rounded-full" style={{ background: "var(--hny-rose-gold)" }} />
                  {t}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center gap-3">
              <BookLink className="inline-flex items-center px-7 py-3.5 rounded-full text-white font-body text-[11px] tracking-[0.25em] uppercase shadow-sm hover:opacity-90 transition" >
                Book Consultation
              </BookLink>
              <a href="#pricing" className="px-7 py-3.5 rounded-full font-body text-[11px] tracking-[0.25em] uppercase border transition hover:opacity-70" style={{ borderColor: "var(--hny-rose-gold)", color: "var(--hny-mocha)" }}>
                View Pricing
              </a>
            </div>
            <div className="mt-6 inline-flex items-center gap-3 px-4 py-2.5 rounded-full border" style={{ background: "var(--hny-cream-card)", borderColor: "var(--hny-champagne)" }}>
              <span className="font-body text-[10px] tracking-[0.2em] uppercase" style={{ color: "var(--hny-soft-brown)" }}>Pay later</span>
              <img src={klarnaLogo} alt="Klarna" className="h-3.5" />
              <img src={clearpayLogo} alt="Clearpay" className="h-3.5" />
            </div>
          </motion.div>

          <motion.div {...fadeUp} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
            <div className="relative aspect-[9/14] sm:aspect-[4/5] lg:aspect-[9/13] rounded-[3px] overflow-hidden shadow-[0_30px_80px_-30px_rgba(58,40,30,0.45)]" style={{ background: "var(--hny-mocha)" }}>
              <video
                src="/hny/hero.mp4"
                poster="/hny/hero-poster.jpg"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, transparent 55%, rgba(42,31,26,0.35) 100%)" }} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* PRICING — ABOVE THE FOLD ================================== */}
      <section id="pricing" className="py-16 md:py-20" style={{ background: "var(--hny-mocha)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeUp} className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <div>
              <span className="font-body text-[10px] tracking-[0.35em] uppercase" style={{ color: "var(--hny-rose-gold)" }}>Treatment Prices</span>
              <h2 className="font-display text-3xl md:text-4xl mt-3" style={{ color: "#F6E9DE" }}>BBL Filler — by volume</h2>
              <p className="font-body text-sm mt-2 max-w-md" style={{ color: "#C9B7A6" }}>Advanced BBL filler to enhance your curves, add volume and create a naturally sculpted look.</p>
            </div>
            <BookLink className="px-7 py-3.5 rounded-full text-white font-body text-[11px] tracking-[0.25em] uppercase hover:opacity-90 transition" >
              Book Consultation
            </BookLink>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {pricing.map((p, i) => (
              <motion.div
                key={p.ml}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="p-6 text-center rounded-[3px] border"
                style={{ background: "rgba(246,233,222,0.04)", borderColor: "rgba(197,139,111,0.35)" }}
              >
                <div className="font-body text-[11px] tracking-[0.3em] uppercase mb-3" style={{ color: "var(--hny-rose-gold)" }}>{p.ml}</div>
                <div className="font-display text-3xl md:text-4xl" style={{ color: "#F6E9DE" }}>{p.price}</div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-center">
            <span className="font-body text-[10px] tracking-[0.25em] uppercase" style={{ color: "#C9B7A6" }}>Pay later options</span>
            <img src={klarnaLogo} alt="Klarna" className="h-5 opacity-90" />
            <img src={clearpayLogo} alt="Clearpay" className="h-5 opacity-90" />
          </div>
          <p className="font-body text-xs italic text-center mt-6 max-w-2xl mx-auto" style={{ color: "#A89684" }}>
            Consultation and suitability approval required before treatment. 21+ only.
          </p>
        </div>
      </section>

      {/* TREATMENT MENU ============================================ */}
      <section className="py-16 md:py-20" style={{ background: "var(--hny-cream)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-12">
            <span className="font-body text-[10px] tracking-[0.35em] uppercase" style={{ color: "var(--hny-rose-gold-deep)" }}>The Menu</span>
            <h2 className="font-display text-3xl md:text-4xl mt-3" style={{ color: "var(--hny-mocha)" }}>Our Body Contouring Treatments</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {treatments.map((t, i) => (
              <motion.article
                key={t.title}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.07 }}
                className="p-7 rounded-[3px] border flex flex-col"
                style={{ background: "var(--hny-cream-card)", borderColor: "var(--hny-champagne)" }}
              >
                <div className="font-body text-[10px] tracking-[0.3em] uppercase mb-3" style={{ color: "var(--hny-rose-gold-deep)" }}>{t.from}</div>
                <h3 className="font-display text-xl mb-3" style={{ color: "var(--hny-mocha)" }}>{t.title}</h3>
                <p className="font-body text-sm leading-relaxed flex-1" style={{ color: "var(--hny-soft-brown)" }}>{t.text}</p>
                <BookLink className="mt-5 inline-flex items-center gap-2 font-body text-[11px] tracking-[0.22em] uppercase hover:gap-3 transition-all">
                  <span style={{ color: "var(--hny-rose-gold-deep)" }}>Book Consultation</span>
                  <ArrowRight size={12} style={{ color: "var(--hny-rose-gold-deep)" }} />
                </BookLink>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* RESULTS =================================================== */}
      <section id="results" className="py-16 md:py-20" style={{ background: "var(--hny-nude)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-12">
            <span className="font-body text-[10px] tracking-[0.35em] uppercase" style={{ color: "var(--hny-rose-gold-deep)" }}>Real Results</span>
            <h2 className="font-display text-3xl md:text-4xl mt-3" style={{ color: "var(--hny-mocha)" }}>Before & After</h2>
            <p className="font-body text-sm mt-3 max-w-xl mx-auto" style={{ color: "var(--hny-soft-brown)" }}>
              Real client results shared with consent. Individual outcomes vary based on anatomy, product volume and aftercare adherence.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-5">
            {[result1, result2].map((src, i) => (
              <motion.div key={i} {...fadeUp} transition={{ duration: 0.7, delay: i * 0.1 }} className="overflow-hidden rounded-[3px] border" style={{ borderColor: "var(--hny-champagne)" }}>
                <img src={src} alt={`HNY CLUB Liquid BBL before and after result ${i + 1}, Manchester`} loading="lazy" className="w-full h-auto object-cover block" />
              </motion.div>
            ))}
          </div>
          <p className="font-body text-xs italic text-center mt-6" style={{ color: "var(--hny-soft-brown)" }}>
            Photography shared with explicit client consent.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS ============================================== */}
      <section className="py-16 md:py-20" style={{ background: "var(--hny-cream)" }}>
        <div className="max-w-5xl mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-12">
            <span className="font-body text-[10px] tracking-[0.35em] uppercase" style={{ color: "var(--hny-rose-gold-deep)" }}>The Process</span>
            <h2 className="font-display text-3xl md:text-4xl mt-3" style={{ color: "var(--hny-mocha)" }}>How it works</h2>
          </motion.div>
          <ol className="grid md:grid-cols-3 gap-6">
            {[
              { n: "01", t: "Consultation", d: "£100 in-depth consultation with suitability screening and ultrasound assessment." },
              { n: "02", t: "Tailored Plan", d: "A personalised treatment plan with ml recommendation, pricing and pre-care guidance." },
              { n: "03", t: "Sculpt & Review", d: "Treatment performed under ultrasound guidance, followed by a 2-week review." },
            ].map((s, i) => (
              <motion.li key={s.n} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.08 }} className="p-7 rounded-[3px] border" style={{ background: "var(--hny-cream-card)", borderColor: "var(--hny-champagne)" }}>
                <div className="font-display text-2xl mb-3" style={{ color: "var(--hny-rose-gold-deep)" }}>{s.n}</div>
                <h3 className="font-display text-lg mb-2" style={{ color: "var(--hny-mocha)" }}>{s.t}</h3>
                <p className="font-body text-sm leading-relaxed" style={{ color: "var(--hny-soft-brown)" }}>{s.d}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* WHY ======================================================= */}
      <section className="py-16 md:py-20" style={{ background: "var(--hny-nude)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-10">
            <span className="font-body text-[10px] tracking-[0.35em] uppercase" style={{ color: "var(--hny-rose-gold-deep)" }}>The HNY Difference</span>
            <h2 className="font-display text-3xl md:text-4xl mt-3" style={{ color: "var(--hny-mocha)" }}>Why HNY CLUB by Hive Clinic</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {whyPoints.map((p, i) => (
              <motion.div key={p.label} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.06 }} className="p-6 text-center rounded-[3px] border" style={{ background: "var(--hny-cream-card)", borderColor: "var(--hny-champagne)" }}>
                <p.icon size={22} strokeWidth={1.2} className="mx-auto mb-4" style={{ color: "var(--hny-rose-gold-deep)" }} />
                <p className="font-display text-sm leading-snug" style={{ color: "var(--hny-mocha)" }}>{p.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ ======================================================= */}
      <section id="faq" className="py-16 md:py-20" style={{ background: "var(--hny-cream)" }}>
        <div className="max-w-3xl mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-10">
            <span className="font-body text-[10px] tracking-[0.35em] uppercase" style={{ color: "var(--hny-rose-gold-deep)" }}>Questions</span>
            <h2 className="font-display text-3xl md:text-4xl mt-3" style={{ color: "var(--hny-mocha)" }}>Frequently asked</h2>
          </motion.div>
          <div className="divide-y" style={{ borderColor: "var(--hny-champagne)" }}>
            {faqs.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={f.q} className="border-t last:border-b" style={{ borderColor: "var(--hny-champagne)" }}>
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="w-full flex items-center justify-between gap-4 py-5 text-left"
                    aria-expanded={open}
                  >
                    <span className="font-display text-base md:text-lg" style={{ color: "var(--hny-mocha)" }}>{f.q}</span>
                    {open ? <Minus size={16} style={{ color: "var(--hny-rose-gold-deep)" }} /> : <Plus size={16} style={{ color: "var(--hny-rose-gold-deep)" }} />}
                  </button>
                  {open && (
                    <p className="font-body text-sm leading-relaxed pb-6 pr-8" style={{ color: "var(--hny-soft-brown)" }}>{f.a}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL CTA ================================================= */}
      <section className="py-20" style={{ background: "var(--hny-mocha)" }}>
        <motion.div {...fadeUp} className="max-w-2xl mx-auto px-6 text-center">
          <span className="font-body text-[10px] tracking-[0.35em] uppercase" style={{ color: "var(--hny-rose-gold)" }}>Begin your journey</span>
          <h2 className="font-display text-4xl md:text-5xl mt-3 mb-5" style={{ color: "#F6E9DE" }}>Ready to begin?</h2>
          <p className="font-body text-base leading-relaxed mb-8" style={{ color: "#C9B7A6" }}>
            Start your HNY CLUB journey with a personalised consultation at Hive Clinic, Deansgate.
          </p>
          <BookLink className="inline-block px-9 py-4 rounded-full text-white font-body text-[12px] tracking-[0.3em] uppercase shadow-md hover:opacity-90 transition" >
            Book Consultation
          </BookLink>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-body text-xs" style={{ color: "#C9B7A6" }}>
            <span className="inline-flex items-center gap-2"><MapPin size={12} /> 25 Saint John Street, Deansgate, Manchester</span>
            <a href="tel:+447795008114" className="inline-flex items-center gap-2 hover:opacity-80"><Phone size={12} /> +44 7795 008114</a>
          </div>
        </motion.div>
      </section>
    </HnyLayout>
  );
};

export default HnyClub;
