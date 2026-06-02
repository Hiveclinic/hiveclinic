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

const fade = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

const GRADIENT = "linear-gradient(135deg, var(--hny-rose-gold), var(--hny-rose-gold-deep))";

const waLink = (ml: string) =>
  `https://wa.me/447795008114?text=${encodeURIComponent(`hey babe, i'd love a virtual chat about Liquid BBL (${ml}) xx`)}`;

const pricing = [
  { ml: "100ml", price: "£499", monthly: "from £41/mo", note: "soft enhancement" },
  { ml: "250ml", price: "£999", monthly: "from £83/mo", note: "hip dip correction" },
  { ml: "300ml", price: "£1,199", monthly: "from £99/mo", note: "lift & projection" },
  { ml: "500ml", price: "£1,999", monthly: "from £166/mo", note: "sculpted curve" },
  { ml: "800ml", price: "£2,999", monthly: "from £249/mo", note: "statement silhouette" },
  { ml: "1L Bespoke", price: "£3,499", monthly: "from £291/mo", note: "fully bespoke" },
];

const expectSteps = [
  { t: "you arrive", d: "tea on the table, your favourite playlist on, soft lighting in our private Deansgate suite. we take our time with you." },
  { t: "we talk", d: "honest chat about your shape, your goals and what's realistic. no upselling, no pressure. ever." },
  { t: "ultrasound mapping", d: "we map vessels and tissue planes under live ultrasound before a single drop of filler is placed. this is the safer way." },
  { t: "numbing", d: "topical numbing and lidocaine in the filler itself. most babes say it feels like pressure, not pain." },
  { t: "sculpting", d: "hyaluronic acid filler placed in considered layers to lift, project and balance hip dips. typically 45 to 75 minutes." },
  { t: "the reveal", d: "we look at your shape together standing and seated. consented photos, written aftercare, a hug, and you're out." },
];

const prepareList = [
  { when: "two weeks before", items: ["skip blood thinners (ibuprofen, fish oil, vitamin E) - check with your GP first", "pause retinol on the lower back & bum", "no new injectables or laser to the area", "drink water like it's your job, prioritise protein"] },
  { when: "48 hours before", items: ["no alcohol, babe", "skip the gym, sauna, sunbeds", "no fake tan on the area", "eat a proper meal before your appointment"] },
  { when: "day of", items: ["clean skin, no body lotion or oil", "wear something comfy with soft underwear", "bring a snack and water for after", "allow up to 90 minutes total"] },
];

const aftercareList = [
  { when: "first 24 hours", items: ["no sitting directly on the area - lean to one side or use a cushion", "sleep on your front or side tonight", "no alcohol, no gym, no hot baths", "mild swelling, warmth or bruising is totally normal"] },
  { when: "first week", items: ["light walks are encouraged from day one", "no gym, spin, sauna, steam or swimming for 7 days", "front or side sleeping where possible", "hydrate, hydrate, hydrate"] },
  { when: "first month", items: ["ease back into training from day 8", "no deep tissue massage to the area for 4 weeks", "final shape refines across 2 to 4 weeks", "your free 2 week review is already booked"] },
];

const faqs = [
  { q: "what actually is a Liquid BBL?", a: "A Liquid BBL is a non-surgical Brazilian Butt Lift using advanced hyaluronic acid filler to add volume, lift the bum and soften hip dips. No surgery, no general anaesthetic, no theatre. Walk-in, walk-out." },
  { q: "how is this different from a surgical BBL?", a: "Surgical BBL means general anaesthetic, fat transfer and weeks of strict downtime. Liquid BBL with us is filler-based, ultrasound-led, same-day, scar-free and fully reversible if you ever wanted it dissolved." },
  { q: "is it safe?", a: "Every Liquid BBL at HNY Club is performed under live ultrasound by qualified aesthetic practitioners. Ultrasound lets us see vessels and tissue planes in real time, which is the gold standard for body filler." },
  { q: "does it hurt?", a: "Topical numbing first, plus lidocaine inside the filler. Most babes describe pressure, not pain." },
  { q: "is there downtime?", a: "Most clients are back to light daily life the next day. Skip the gym, sauna and sitting on the area for 48 hours. Light swelling or bruising can be normal for a few days." },
  { q: "how long does it last?", a: "Typically 12 to 18 months, depending on volume, lifestyle and metabolism. Top-ups can be booked once your shape softens." },
  { q: "can it be reversed?", a: "Yes. Because it's hyaluronic acid based, results can be dissolved with hyaluronidase if you ever wanted to. That's a real safety win over surgical BBL." },
  { q: "who isn't suitable?", a: "You need to be 21+, in good general health, not pregnant or breastfeeding. We don't treat anyone with active infection in the area, certain autoimmune conditions, bleeding disorders or recent permanent filler in the same area." },
  { q: "when can I work out again?", a: "Light walking from day one. Skip the gym, spin, hot yoga and swimming for 7 days. Most babes are back to full training from day 8 to 10." },
  { q: "can I fly after?", a: "Short flights from day 3 are usually fine. Skip long-haul for 7 days to reduce swelling and prolonged sitting." },
  { q: "can I pay monthly?", a: "Absolutely. Klarna, Clearpay and PayItMonthly are all available, spread over up to 12 months with 0% options. Subject to provider approval." },
  { q: "how does the £100 deposit work?", a: "£100 secures your slot and is fully redeemable against your treatment. It covers your in-clinic consultation, ultrasound assessment and tailored plan." },
];

const marqueeWords = [
  "Liquid BBL Manchester",
  "Non-Surgical BBL",
  "Hip Dip Filler",
  "BBL Filler",
  "Body Contouring",
  "Bum Filler Manchester",
  "Ultrasound Led",
  "0% Payment Plans",
];

const InlineCTA = ({ label = "join the honey club", variant = "solid" }: { label?: string; variant?: "solid" | "ghost" }) => (
  <div className="flex flex-wrap gap-3 items-center">
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center px-7 py-3.5 rounded-full text-white font-body text-[11px] tracking-[0.22em] uppercase hover:opacity-90 transition shadow-[0_14px_30px_-14px_rgba(168,106,63,0.55)]"
      style={{ background: GRADIENT }}
    >
      {label} xx
    </a>
    {variant === "solid" && (
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="font-script text-lg md:text-xl underline underline-offset-4 decoration-1 hover:opacity-70"
        style={{ color: "var(--hny-rose-gold-deep)" }}
      >
        or DM us on Instagram
      </a>
    )}
  </div>
);

const SectionEyebrow = ({ children }: { children: React.ReactNode }) => (
  <p className="font-script text-xl md:text-2xl mb-3" style={{ color: "var(--hny-rose-gold-deep)" }}>
    {children}
  </p>
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
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        },
      ],
    }
  );

  return (
    <HnyLayout>
      {/* ==================== HERO LETTER ==================== */}
      <section className="relative overflow-hidden" style={{ background: "var(--hny-cream)" }}>
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 pt-4 pb-10 md:pt-10 md:pb-20 grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-16 items-center">
          <motion.div {...fade}>
            <p className="font-script text-2xl md:text-3xl mb-3" style={{ color: "var(--hny-rose-gold-deep)" }}>
              hey babe,
            </p>
            <h1 className="display-xl" style={{ color: "var(--hny-mocha)" }}>
              ready to join the <em className="font-script" style={{ color: "var(--hny-rose-gold-deep)" }}>honey club</em>?
            </h1>
            <p className="font-body text-base md:text-lg leading-relaxed mt-5 mb-7 max-w-xl" style={{ color: "var(--hny-soft-brown)" }}>
              luxury Liquid BBL, hip dip filler and body contouring in Manchester. ultrasound-led, walk-in walk-out, and tailored to your shape. no surgery, no theatre, no stress. just curves.
            </p>

            <InlineCTA label="virtual chat on whatsapp" />

            <p className="font-body text-xs mt-5" style={{ color: "var(--hny-soft-brown)" }}>
              from £499 · klarna · clearpay · payitmonthly · 0% available
            </p>
          </motion.div>

          <motion.div {...fade} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="relative">
            <div className="aspect-[3/4] rounded-[40%/8%] overflow-hidden" style={{ boxShadow: "0 50px 100px -40px rgba(168,106,63,0.45)" }}>
              <img
                src={heroBaddie}
                alt="Liquid BBL Manchester - luxury non-surgical Brazilian Butt Lift at HNY Club"
                className="w-full h-full object-cover"
                width={1280}
                height={1600}
                fetchPriority="high"
              />
            </div>
            <p className="font-script absolute -bottom-3 left-1/2 -translate-x-1/2 text-xl whitespace-nowrap px-5 py-2 rounded-full" style={{ background: "var(--hny-cream-card)", color: "var(--hny-rose-gold-deep)" }}>
              xoxo, hny club
            </p>
          </motion.div>
        </div>
      </section>

      {/* ==================== MARQUEE ==================== */}
      <section className="py-4 overflow-hidden" style={{ background: "var(--hny-blush)" }}>
        <div className="marquee-track font-display italic text-2xl md:text-3xl" style={{ color: "var(--hny-mocha)" }}>
          {[...marqueeWords, ...marqueeWords, ...marqueeWords].map((w, i) => (
            <span key={i} className="flex items-center gap-10">
              {w}
              <span className="font-script text-2xl" style={{ color: "var(--hny-rose-gold-deep)" }}>♡</span>
            </span>
          ))}
        </div>
      </section>

      {/* ==================== THE TREATMENT (LETTER STYLE) ==================== */}
      <section id="treatment" className="py-20 md:py-28" style={{ background: "var(--hny-cream)" }}>
        <div className="max-w-3xl mx-auto px-6 md:px-8">
          <motion.div {...fade} className="text-center mb-12">
            <SectionEyebrow>so, what is it?</SectionEyebrow>
            <h2 className="display-lg" style={{ color: "var(--hny-mocha)" }}>
              the liquid bbl, in plain english.
            </h2>
          </motion.div>
          <motion.div {...fade} className="space-y-6 font-body text-lg md:text-xl leading-[1.75]" style={{ color: "var(--hny-soft-brown)" }}>
            <p>
              think of it as a non-surgical Brazilian Butt Lift. we use advanced hyaluronic acid filler to add volume, lift and projection to your bum and soften hip dips so your silhouette reads as one beautiful continuous curve.
            </p>
            <p>
              every treatment is done under live ultrasound so we can see exactly where we're placing product. no general anaesthetic. no scars. no theatre. you're in and out the same day, back to light daily life the next.
            </p>
            <p className="font-script text-2xl md:text-3xl text-center pt-2" style={{ color: "var(--hny-rose-gold-deep)" }}>
              snatched, sculpted, unapologetically you.
            </p>
          </motion.div>

          <motion.div {...fade} className="mt-12 text-center">
            <InlineCTA label="i want this" />
          </motion.div>
        </div>
      </section>

      {/* ==================== PRICING (CLEAN, NO HARSH BOXES) ==================== */}
      <section id="pricing" className="py-20 md:py-28" style={{ background: "var(--hny-nude)" }}>
        <div className="max-w-[1100px] mx-auto px-5 md:px-10">
          <motion.div {...fade} className="text-center mb-12 md:mb-14">
            <SectionEyebrow>the pricelist</SectionEyebrow>
            <h2 className="display-lg" style={{ color: "var(--hny-mocha)" }}>your curve, your call.</h2>
            <p className="font-body text-base md:text-lg mt-4 max-w-xl mx-auto" style={{ color: "var(--hny-soft-brown)" }}>
              transparent pricing by volume. every package includes consultation, ultrasound-led treatment and your free 2 week review.
            </p>
          </motion.div>

          <div className="divide-y" style={{ borderColor: "rgba(168,106,63,0.22)" }}>
            {pricing.map((p, i) => (
              <motion.a
                key={p.ml}
                href={waLink(p.ml)}
                target="_blank"
                rel="noopener noreferrer"
                {...fade}
                transition={{ duration: 0.45, delay: i * 0.04 }}
                className="group grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_2fr_auto] gap-4 sm:gap-8 items-baseline py-6 hover:px-4 transition-all duration-300"
                style={{ borderTop: i === 0 ? "1px solid rgba(168,106,63,0.22)" : undefined, borderBottom: "1px solid rgba(168,106,63,0.22)" }}
              >
                <span className="font-display italic text-2xl md:text-3xl" style={{ color: "var(--hny-mocha)" }}>{p.ml}</span>
                <span className="hidden sm:block font-body text-sm md:text-base" style={{ color: "var(--hny-soft-brown)" }}>
                  {p.note} · {p.monthly}
                </span>
                <span className="font-display text-2xl md:text-3xl text-right group-hover:translate-x-1 transition-transform" style={{ color: "var(--hny-rose-gold-deep)" }}>
                  {p.price}
                </span>
                <span className="sm:hidden col-span-2 font-body text-xs -mt-2" style={{ color: "var(--hny-soft-brown)" }}>
                  {p.note} · {p.monthly}
                </span>
              </motion.a>
            ))}
          </div>

          <motion.div {...fade} className="mt-14 text-center">
            <p className="font-script text-xl md:text-2xl mb-2" style={{ color: "var(--hny-rose-gold-deep)" }}>
              £100 deposit secures your slot. fully redeemable against your treatment.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-5">
              <a href={DEPOSIT_URL} className="inline-block px-7 py-3.5 rounded-full text-white font-body text-[11px] tracking-[0.22em] uppercase shadow-[0_14px_30px_-14px_rgba(168,106,63,0.55)]" style={{ background: GRADIENT }}>
                secure £100 deposit
              </a>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-block px-7 py-3.5 rounded-full font-body text-[11px] tracking-[0.22em] uppercase" style={{ border: "1px solid var(--hny-mocha)", color: "var(--hny-mocha)" }}>
                chat first xx
              </a>
            </div>
            <div className="mt-10 flex items-center justify-center gap-7 flex-wrap opacity-90">
              <img src={klarnaLogo} alt="Klarna payment plans for Liquid BBL Manchester" className="h-6 md:h-7" />
              <img src={clearpayLogo} alt="Clearpay payment plans for Liquid BBL Manchester" className="h-5 md:h-6" />
              <img src={payItMonthlyLogo} alt="PayItMonthly finance for Liquid BBL Manchester" className="h-6 md:h-7" />
            </div>
            <p className="font-body text-xs italic mt-5" style={{ color: "var(--hny-soft-brown)" }}>
              spread up to 12 months, 0% options available, subject to provider approval. 21+ only.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ==================== WHAT TO EXPECT ==================== */}
      <section id="expect" className="py-20 md:py-28" style={{ background: "var(--hny-cream)" }}>
        <div className="max-w-[1100px] mx-auto px-5 md:px-10 grid lg:grid-cols-[1fr_1.2fr] gap-12 items-start">
          <motion.div {...fade} className="lg:sticky lg:top-32">
            <div className="aspect-[4/5] rounded-[42%/6%] overflow-hidden">
              <img src={lifestyle1} alt="Non-surgical BBL Manchester - what to expect at HNY Club" className="w-full h-full object-cover" loading="lazy" />
            </div>
          </motion.div>
          <motion.div {...fade}>
            <SectionEyebrow>what to expect</SectionEyebrow>
            <h2 className="display-lg mb-3" style={{ color: "var(--hny-mocha)" }}>your appointment, step by step.</h2>
            <p className="font-body text-base md:text-lg mb-8 leading-relaxed" style={{ color: "var(--hny-soft-brown)" }}>
              we love a babe who knows what she's signing up for. here's exactly how it goes.
            </p>
            <ol className="space-y-7">
              {expectSteps.map((s, i) => (
                <li key={s.t} className="grid grid-cols-[auto_1fr] gap-5">
                  <span className="font-display italic text-3xl md:text-4xl" style={{ color: "var(--hny-rose-gold-deep)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display italic text-xl md:text-2xl mb-1" style={{ color: "var(--hny-mocha)" }}>{s.t}</h3>
                    <p className="font-body text-base leading-relaxed" style={{ color: "var(--hny-soft-brown)" }}>{s.d}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-10">
              <InlineCTA label="book your slot" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== PREPARE ==================== */}
      <section id="prepare" className="py-20 md:py-28" style={{ background: "var(--hny-blush)" }}>
        <div className="max-w-[1100px] mx-auto px-5 md:px-10">
          <motion.div {...fade} className="text-center mb-14">
            <SectionEyebrow>before your appointment</SectionEyebrow>
            <h2 className="display-lg" style={{ color: "var(--hny-mocha)" }}>how to prepare, babe.</h2>
            <p className="font-body text-base md:text-lg mt-4 max-w-xl mx-auto" style={{ color: "var(--hny-soft-brown)" }}>
              small choices in the days before make a real difference to swelling, bruising and how quickly your shape settles.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-10 md:gap-12">
            {prepareList.map((g) => (
              <motion.div key={g.when} {...fade}>
                <h3 className="font-script text-2xl mb-4" style={{ color: "var(--hny-rose-gold-deep)" }}>{g.when}</h3>
                <ul className="space-y-3 font-body text-base leading-relaxed" style={{ color: "var(--hny-soft-brown)" }}>
                  {g.items.map((it) => (
                    <li key={it} className="flex gap-3">
                      <span className="font-script text-xl flex-shrink-0 leading-tight" style={{ color: "var(--hny-rose-gold-deep)" }}>♡</span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== AFTERCARE / POST CARE ==================== */}
      <section id="aftercare" className="py-20 md:py-28" style={{ background: "var(--hny-cream)" }}>
        <div className="max-w-[1100px] mx-auto px-5 md:px-10">
          <motion.div {...fade} className="text-center mb-14">
            <SectionEyebrow>post care</SectionEyebrow>
            <h2 className="display-lg" style={{ color: "var(--hny-mocha)" }}>looking after your new shape.</h2>
            <p className="font-body text-base md:text-lg mt-4 max-w-xl mx-auto" style={{ color: "var(--hny-soft-brown)" }}>
              stick to this and you give your results the best chance to settle beautifully.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-10 md:gap-12">
            {aftercareList.map((g) => (
              <motion.div key={g.when} {...fade}>
                <h3 className="font-script text-2xl mb-4" style={{ color: "var(--hny-rose-gold-deep)" }}>{g.when}</h3>
                <ul className="space-y-3 font-body text-base leading-relaxed" style={{ color: "var(--hny-soft-brown)" }}>
                  {g.items.map((it) => (
                    <li key={it} className="flex gap-3">
                      <span className="font-script text-xl flex-shrink-0 leading-tight" style={{ color: "var(--hny-rose-gold-deep)" }}>♡</span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          <motion.p {...fade} className="font-script text-xl md:text-2xl text-center mt-14 max-w-xl mx-auto" style={{ color: "var(--hny-rose-gold-deep)" }}>
            anything feels off? message your practitioner on whatsapp anytime. we're always here.
          </motion.p>
        </div>
      </section>

      {/* ==================== RESULTS ==================== */}
      <section id="results" className="py-20 md:py-28" style={{ background: "var(--hny-nude)" }}>
        <div className="max-w-[1100px] mx-auto px-5 md:px-10">
          <motion.div {...fade} className="text-center mb-12">
            <SectionEyebrow>real results</SectionEyebrow>
            <h2 className="display-lg" style={{ color: "var(--hny-mocha)" }}>your before & after.</h2>
            <p className="font-body text-base md:text-lg mt-4 max-w-xl mx-auto" style={{ color: "var(--hny-soft-brown)" }}>
              real client results shared with consent. individual outcomes vary based on anatomy, volume placed and aftercare.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6 md:gap-10">
            {[
              { src: result1, cap: "Liquid BBL Manchester, 300ml. hip dip correction & lift." },
              { src: result2, cap: "Non-surgical BBL Manchester, 500ml. projection & sculpted curve." },
            ].map((r, i) => (
              <motion.figure key={i} {...fade} transition={{ duration: 0.7, delay: i * 0.1 }}>
                <div className="aspect-[4/5] overflow-hidden rounded-[36%/6%]">
                  <img
                    src={r.src}
                    alt={`Liquid BBL Manchester before and after result ${i + 1} - HNY Club non-surgical Brazilian Butt Lift`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <figcaption className="font-script text-lg mt-4 text-center" style={{ color: "var(--hny-rose-gold-deep)" }}>
                  {r.cap}
                </figcaption>
              </motion.figure>
            ))}
          </div>
          <motion.div {...fade} className="text-center mt-12">
            <InlineCTA label="i want results like this" />
          </motion.div>
        </div>
      </section>

      {/* ==================== EXPERIENCE ==================== */}
      <section className="relative overflow-hidden" style={{ background: "var(--hny-mocha)" }}>
        <div className="grid lg:grid-cols-2 items-stretch">
          <div className="aspect-[4/5] lg:aspect-auto">
            <img src={heroWoman} alt="HNY Club Manchester - private Deansgate suite for Liquid BBL" className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div className="px-6 md:px-14 py-16 md:py-24 flex items-center">
            <div className="max-w-lg">
              <p className="font-script text-2xl mb-3" style={{ color: "var(--hny-rose-gold)" }}>the honey club</p>
              <h2 className="display-lg mb-5" style={{ color: "var(--hny-cream)" }}>more than a treatment. a feeling.</h2>
              <p className="font-body text-base md:text-lg leading-relaxed mb-5" style={{ color: "var(--hny-nude)" }}>
                a private Deansgate suite. soft lighting. considered playlists. tea on arrival. your appointment is yours, your phone stays yours, your privacy stays ours.
              </p>
              <p className="font-body text-base md:text-lg leading-relaxed mb-7" style={{ color: "var(--hny-nude)" }}>
                HNY Club exists for the babe who wants more curve without the operating theatre. subtle or statement, your shape, your call.
              </p>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-7 py-3.5 rounded-full font-body text-[11px] tracking-[0.22em] uppercase"
                style={{ background: GRADIENT, color: "white" }}
              >
                see more on instagram
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FAQ ==================== */}
      <section id="faq" className="py-20 md:py-28" style={{ background: "var(--hny-cream)" }}>
        <div className="max-w-3xl mx-auto px-5 md:px-8">
          <motion.div {...fade} className="text-center mb-12">
            <SectionEyebrow>your questions, answered</SectionEyebrow>
            <h2 className="display-lg" style={{ color: "var(--hny-mocha)" }}>ask me anything, babe.</h2>
          </motion.div>
          <div>
            {faqs.map((f, i) => {
              const open = openFaq === i;
              return (
                <motion.div
                  key={f.q}
                  {...fade}
                  transition={{ duration: 0.4, delay: i * 0.03 }}
                  className="border-b"
                  style={{ borderColor: "rgba(168,106,63,0.22)" }}
                >
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="w-full flex items-center justify-between gap-4 py-5 text-left"
                    aria-expanded={open}
                  >
                    <span className="font-display italic text-xl md:text-2xl" style={{ color: "var(--hny-mocha)" }}>{f.q}</span>
                    <span className="font-display text-2xl flex-shrink-0" style={{ color: "var(--hny-rose-gold-deep)" }}>{open ? "−" : "+"}</span>
                  </button>
                  {open && (
                    <div className="pb-6 pr-8 font-body text-base leading-relaxed" style={{ color: "var(--hny-soft-brown)" }}>
                      {f.a}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
          <motion.p {...fade} className="font-script text-xl md:text-2xl text-center mt-12" style={{ color: "var(--hny-rose-gold-deep)" }}>
            still wondering? slide into our DMs. no question is too small. xx
          </motion.p>
        </div>
      </section>

      {/* ==================== FINAL LETTER ==================== */}
      <section className="py-20 md:py-28" style={{ background: "var(--hny-nude)" }}>
        <div className="max-w-2xl mx-auto px-6 text-center">
          <motion.div {...fade}>
            <p className="font-script text-2xl mb-3" style={{ color: "var(--hny-rose-gold-deep)" }}>p.s.</p>
            <h2 className="display-lg mb-6" style={{ color: "var(--hny-mocha)" }}>
              ready to join the <em className="font-script" style={{ color: "var(--hny-rose-gold-deep)" }}>honey club</em>?
            </h2>
            <p className="font-body text-base md:text-lg mb-9 leading-relaxed" style={{ color: "var(--hny-soft-brown)" }}>
              no pressure. no commitment. just an honest chat with us to help you decide if a Liquid BBL is right for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="px-7 py-3.5 rounded-full text-white font-body text-[11px] tracking-[0.22em] uppercase shadow-[0_14px_30px_-14px_rgba(168,106,63,0.55)]" style={{ background: GRADIENT }}>
                whatsapp us
              </a>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="px-7 py-3.5 rounded-full font-body text-[11px] tracking-[0.22em] uppercase" style={{ border: "1px solid var(--hny-mocha)", color: "var(--hny-mocha)" }}>
                DM on instagram
              </a>
              <a href={DEPOSIT_URL} className="px-7 py-3.5 rounded-full font-body text-[11px] tracking-[0.22em] uppercase" style={{ background: "var(--hny-mocha)", color: "var(--hny-cream)" }}>
                secure £100 deposit
              </a>
            </div>
            <p className="font-script text-2xl mt-10" style={{ color: "var(--hny-rose-gold-deep)" }}>
              xoxo, hny club
            </p>
            <div className="mt-8 font-body text-xs flex flex-wrap justify-center gap-x-6 gap-y-2" style={{ color: "var(--hny-soft-brown)" }}>
              <span>25 Saint John Street, Deansgate, Manchester M3 4DT</span>
              <a href="tel:+447795008114" className="hover:opacity-70">+44 7795 008114</a>
            </div>
          </motion.div>
        </div>
      </section>
    </HnyLayout>
  );
};

export default HnyClub;
