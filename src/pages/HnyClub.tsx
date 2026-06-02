import { useState } from "react";
import { motion } from "framer-motion";
import HnyLayout, { INSTAGRAM_URL, WHATSAPP_URL, DEPOSIT_URL } from "@/components/HnyLayout";
import { usePageMeta } from "@/hooks/use-page-meta";
import heroBaddie from "@/assets/hny/hero-baddie.jpg";
import suite from "@/assets/hny/suite.jpg";
import lifestyle1 from "@/assets/hny/lifestyle-1.jpg";
import result1 from "@/assets/hny/result-1.jpg";
import result2 from "@/assets/hny/result-2.jpg";
import klarnaLogo from "@/assets/klarna-logo.png";
import clearpayLogo from "@/assets/clearpay-logo.png";
import payItMonthlyLogo from "@/assets/hny/payitmonthly-logo.png";

const fade = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

const waLink = (ml: string) =>
  `https://wa.me/447795008114?text=${encodeURIComponent(`hey babe, i'd love a virtual chat about Liquid BBL Manchester (${ml}) xx`)}`;

const pricing = [
  { ml: "100ml", price: "£499", monthly: "from £41/mo", note: "soft enhancement" },
  { ml: "250ml", price: "£999", monthly: "from £83/mo", note: "hip dip filler" },
  { ml: "300ml", price: "£1,199", monthly: "from £99/mo", note: "lift & projection" },
  { ml: "500ml", price: "£1,999", monthly: "from £166/mo", note: "sculpted curve" },
  { ml: "800ml", price: "£2,999", monthly: "from £249/mo", note: "statement silhouette" },
  { ml: "1L bespoke", price: "£3,499", monthly: "from £291/mo", note: "fully bespoke contour" },
];

const expectSteps = [
  { t: "you arrive", d: "tea, soft lighting, your favourite playlist on in our private Deansgate suite. we take our time with you." },
  { t: "we talk", d: "honest chat about your shape, your goals, and what's realistic for body contouring in Manchester. no upselling, ever." },
  { t: "ultrasound mapping", d: "we map vessels and tissue planes under live ultrasound before a single drop of BBL filler is placed. the safer way." },
  { t: "numbing", d: "topical numbing and lidocaine inside the body filler. most babes say it feels like pressure, not pain." },
  { t: "sculpting", d: "hyaluronic acid filler placed in considered layers to lift, project and balance hip dips. 45 to 75 minutes." },
  { t: "the reveal", d: "we look at your shape together standing and seated. consented photos, written aftercare, a hug, and you're out." },
];

const prepareList = [
  { when: "two weeks before", items: ["skip blood thinners (ibuprofen, fish oil, vitamin E) - check with your GP first", "pause retinol on the lower back & bum", "no new injectables or laser to the area", "drink water like it's your job, prioritise protein"] },
  { when: "48 hours before", items: ["no alcohol, babe", "skip the gym, sauna, sunbeds", "no fake tan on the area", "eat a proper meal before your appointment"] },
  { when: "day of", items: ["clean skin, no body lotion or oil on the area", "wear something comfy with soft underwear", "bring a snack and water for after", "allow up to 90 minutes total"] },
];

const aftercareList = [
  { when: "first 24 hours", items: ["no sitting directly on the area - lean to one side or use a cushion", "sleep on your front or side tonight", "no alcohol, gym or hot baths", "mild swelling, warmth or bruising is totally normal"] },
  { when: "first week", items: ["light walks are encouraged from day one", "no gym, spin, sauna, steam or swimming for 7 days", "front or side sleeping where possible", "hydrate, hydrate, hydrate"] },
  { when: "first month", items: ["ease back into training from day 8", "no deep tissue massage to the area for 4 weeks", "final shape refines across 2 to 4 weeks", "your free 2 week review is already booked"] },
];

const faqs = [
  { q: "what is a Liquid BBL?", a: "A Liquid BBL is a non-surgical Brazilian Butt Lift using advanced hyaluronic acid BBL filler to add volume, lift the bum and soften hip dips. No surgery, no general anaesthetic, no theatre. Walk in, walk out. It's one of the most requested body contouring treatments in Manchester." },
  { q: "how is this different from a surgical BBL?", a: "Surgical BBL means general anaesthetic, fat transfer and weeks of strict downtime. Liquid BBL Manchester with HNY Club is filler-based, ultrasound-led, same-day, scar-free and fully reversible if you ever wanted it dissolved." },
  { q: "is it safe?", a: "Every Liquid BBL at HNY Club is performed under live ultrasound by qualified aesthetic practitioners. Ultrasound lets us see vessels and tissue planes in real time, which is the gold standard for body filler and BBL filler placement." },
  { q: "does it hurt?", a: "Topical numbing first, plus lidocaine inside the filler. Most babes describe pressure, not pain." },
  { q: "is there downtime?", a: "Most clients are back to light daily life the next day. Skip the gym, sauna and sitting on the area for 48 hours. Light swelling or bruising can be normal for a few days." },
  { q: "how long does it last?", a: "Typically 12 to 18 months, depending on volume, lifestyle and metabolism. Top-ups can be booked once your shape softens." },
  { q: "can it be reversed?", a: "Yes. Because it's hyaluronic acid based body filler, results can be dissolved with hyaluronidase if you ever wanted to. That's a real safety win over surgical BBL." },
  { q: "who isn't suitable?", a: "You need to be 21+, in good general health, not pregnant or breastfeeding. We don't treat anyone with active infection in the area, certain autoimmune conditions, bleeding disorders or recent permanent filler in the same area." },
  { q: "when can I work out again?", a: "Light walking from day one. Skip the gym, spin, hot yoga and swimming for 7 days. Most babes are back to full training from day 8 to 10." },
  { q: "can I fly after?", a: "Short flights from day 3 are usually fine. Skip long-haul for 7 days to reduce swelling and prolonged sitting." },
  { q: "can I pay monthly?", a: "Absolutely. Klarna, Clearpay and PayItMonthly are all available, spread over up to 12 months with 0% options. Subject to provider approval." },
  { q: "how does the £100 deposit work?", a: "£100 secures your slot and is fully redeemable against your treatment. It covers your in-clinic consultation, ultrasound assessment and tailored body contouring plan." },
];

const marqueeWords = [
  "Liquid BBL Manchester",
  "BBL Filler",
  "Body Contouring Manchester",
  "Hip Dip Filler",
  "Body Filler",
  "Non-Surgical BBL",
  "Bum Filler Manchester",
  "Ultrasound Led",
];

const DualCTA = ({ primary = "join the honey club" }: { primary?: string }) => (
  <div className="flex flex-wrap gap-2.5 items-center">
    <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-dainty">
      {primary} xx
    </a>
    <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="font-script text-base md:text-lg underline underline-offset-4 decoration-1 hover:opacity-70" style={{ color: "var(--hny-rose-gold-deep)" }}>
      or DM us
    </a>
  </div>
);

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <p className="font-script text-lg md:text-xl mb-2.5" style={{ color: "var(--hny-rose-gold-deep)" }}>
    {children}
  </p>
);

const HnyClub = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  usePageMeta(
    "Liquid BBL Manchester | BBL Filler, Hip Dip Filler & Body Contouring | HNY Club",
    "Luxury Liquid BBL Manchester at HNY Club. Ultrasound-led BBL filler, body filler, hip dip filler and body contouring in Deansgate. From £499 with Klarna, Clearpay and PayItMonthly.",
    {
      canonicalPath: "/liquid-bbl-manchester",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "HNY Club by Hive Clinic",
          description: "Ultrasound-led Liquid BBL, BBL filler, hip dip filler, body filler and body contouring in Deansgate, Manchester.",
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
          serviceType: "Non-surgical Brazilian Butt Lift, BBL filler, body contouring, hip dip filler",
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
      {/* ============== HERO LETTER ============== */}
      <section className="relative overflow-hidden" style={{ background: "var(--hny-cream)" }}>
        <div className="max-w-[1180px] mx-auto px-5 md:px-10 pt-3 pb-10 md:pt-8 md:pb-16 grid lg:grid-cols-[1.05fr_1fr] gap-8 lg:gap-14 items-center">
          <motion.div {...fade}>
            <p className="font-script text-xl md:text-2xl mb-2" style={{ color: "var(--hny-rose-gold-deep)" }}>
              hey babe,
            </p>
            <h1 className="display-xl" style={{ color: "var(--hny-mocha)" }}>
              ready to join the <em className="font-script" style={{ color: "var(--hny-rose-gold-deep)" }}>honey club</em>?
            </h1>
            <p className="font-body text-[15px] md:text-lg leading-[1.65] mt-4 mb-6 max-w-xl" style={{ color: "var(--hny-soft-brown)" }}>
              luxury <strong>Liquid BBL Manchester</strong>, hip dip filler and body contouring at HNY Club, Deansgate. ultrasound-led BBL filler, walk-in walk-out, tailored to your shape. the soft alternative to surgical BBL.
            </p>

            <DualCTA primary="virtual chat on whatsapp" />

            <p className="font-body text-[11px] mt-4 tracking-wide" style={{ color: "var(--hny-soft-brown)" }}>
              from £499 · klarna · clearpay · payitmonthly · 0% available
            </p>
          </motion.div>

          <motion.div {...fade} transition={{ duration: 0.8 }} className="relative">
            <div className="aspect-[4/5] md:aspect-[3/4] rounded-[34%/8%] overflow-hidden" style={{ boxShadow: "0 40px 80px -36px rgba(167,117,96,0.45)" }}>
              <img
                src={heroBaddie}
                alt="Liquid BBL Manchester - luxury non-surgical Brazilian Butt Lift and BBL filler at HNY Club Deansgate"
                className="w-full h-full object-cover"
                width={1280}
                height={1600}
                fetchPriority="high"
              />
            </div>
            <p className="font-script absolute -bottom-2 left-1/2 -translate-x-1/2 text-base md:text-lg whitespace-nowrap px-4 py-1.5 rounded-full" style={{ background: "var(--hny-cream-card)", color: "var(--hny-rose-gold-deep)" }}>
              xoxo, hny club
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============== MARQUEE ============== */}
      <section className="py-3 overflow-hidden" style={{ background: "var(--hny-blush)" }}>
        <div className="marquee-track font-display italic text-xl md:text-2xl" style={{ color: "var(--hny-mocha)" }}>
          {[...marqueeWords, ...marqueeWords, ...marqueeWords].map((w, i) => (
            <span key={i} className="flex items-center gap-8">
              {w}
              <span className="font-script text-xl" style={{ color: "var(--hny-rose-gold-deep)" }}>♡</span>
            </span>
          ))}
        </div>
      </section>

      {/* ============== TREATMENT ============== */}
      <section id="treatment" className="py-14 md:py-24" style={{ background: "var(--hny-cream)" }}>
        <div className="max-w-2xl mx-auto px-6 md:px-8">
          <motion.div {...fade} className="text-center mb-8 md:mb-10">
            <Eyebrow>so, what is it?</Eyebrow>
            <h2 className="display-lg" style={{ color: "var(--hny-mocha)" }}>
              BBL filler & body contouring, in plain english.
            </h2>
          </motion.div>
          <motion.div {...fade} className="space-y-5 font-body text-[15px] md:text-lg leading-[1.75]" style={{ color: "var(--hny-soft-brown)" }}>
            <p>
              Think of it as a non-surgical Brazilian Butt Lift. We use advanced hyaluronic acid <strong>BBL filler</strong> to add volume, lift and projection to your bum and soften hip dips, so your silhouette reads as one continuous, feminine curve from waist to thigh.
            </p>
            <p>
              Every <strong>body contouring Manchester</strong> appointment at HNY Club is done under live ultrasound so we can see exactly where we're placing product. No general anaesthetic, no scars, no theatre. You're in and out the same day and back to light daily life the next.
            </p>
            <p className="font-script text-xl md:text-2xl text-center pt-1" style={{ color: "var(--hny-rose-gold-deep)" }}>
              snatched, sculpted, unapologetically you.
            </p>
          </motion.div>

          <motion.div {...fade} className="mt-8 flex justify-center">
            <DualCTA primary="i want this" />
          </motion.div>
        </div>
      </section>

      {/* ============== PRICING ============== */}
      <section id="pricing" className="py-14 md:py-24" style={{ background: "var(--hny-nude)" }}>
        <div className="max-w-[1000px] mx-auto px-5 md:px-10">
          <motion.div {...fade} className="text-center mb-10">
            <Eyebrow>the pricelist</Eyebrow>
            <h2 className="display-lg" style={{ color: "var(--hny-mocha)" }}>your curve, your call.</h2>
            <p className="font-body text-[14px] md:text-base mt-3 max-w-xl mx-auto" style={{ color: "var(--hny-soft-brown)" }}>
              transparent BBL filler pricing by volume. every package includes consultation, ultrasound-led treatment and your free 2 week review.
            </p>
          </motion.div>

          <ul>
            {pricing.map((p, i) => (
              <motion.li
                key={p.ml}
                {...fade}
                transition={{ duration: 0.4, delay: i * 0.03 }}
                style={{ borderTop: i === 0 ? "1px solid rgba(167,117,96,0.22)" : undefined, borderBottom: "1px solid rgba(167,117,96,0.22)" }}
              >
                <a
                  href={waLink(p.ml)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_2fr_auto] gap-x-4 sm:gap-x-8 items-baseline py-5 md:py-6 sm:hover:px-3 transition-all duration-300"
                >
                  <span className="font-display italic text-xl sm:text-2xl md:text-3xl" style={{ color: "var(--hny-mocha)" }}>{p.ml}</span>
                  <span className="hidden sm:block font-body text-sm md:text-base" style={{ color: "var(--hny-soft-brown)" }}>
                    {p.note} · {p.monthly}
                  </span>
                  <span className="font-display text-xl sm:text-2xl md:text-3xl text-right sm:group-hover:translate-x-1 transition-transform" style={{ color: "var(--hny-rose-gold-deep)" }}>
                    {p.price}
                  </span>
                  <span className="sm:hidden col-span-2 font-body text-[12px] -mt-1 pb-1" style={{ color: "var(--hny-soft-brown)" }}>
                    {p.note} · {p.monthly}
                  </span>
                </a>
              </motion.li>
            ))}
          </ul>

          <motion.div {...fade} className="mt-10 text-center">
            <p className="font-script text-lg md:text-xl mb-4 max-w-md mx-auto" style={{ color: "var(--hny-rose-gold-deep)" }}>
              £100 deposit secures your slot. fully redeemable against your treatment.
            </p>
            <div className="flex flex-wrap justify-center gap-2.5">
              <a href={DEPOSIT_URL} className="btn-dainty">secure £100 deposit</a>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost">chat first xx</a>
            </div>
            <div className="mt-8 flex items-center justify-center gap-6 flex-wrap opacity-90">
              <img src={klarnaLogo} alt="Klarna payment plans for Liquid BBL Manchester" className="h-5 md:h-6" loading="lazy" />
              <img src={clearpayLogo} alt="Clearpay payment plans for BBL filler Manchester" className="h-4 md:h-5" loading="lazy" />
              <img src={payItMonthlyLogo} alt="PayItMonthly finance for body contouring Manchester" className="h-5 md:h-6" loading="lazy" />
            </div>
            <p className="font-body text-[11px] italic mt-4 max-w-md mx-auto" style={{ color: "var(--hny-soft-brown)" }}>
              spread up to 12 months, 0% options available, subject to provider approval. 21+ only.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============== WHAT TO EXPECT ============== */}
      <section id="expect" className="py-14 md:py-24" style={{ background: "var(--hny-cream)" }}>
        <div className="max-w-[1000px] mx-auto px-5 md:px-10 grid lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-14 items-start">
          <motion.div {...fade} className="lg:sticky lg:top-32">
            <div className="aspect-[4/5] rounded-[34%/6%] overflow-hidden">
              <img src={lifestyle1} alt="Non-surgical BBL Manchester - what to expect at HNY Club body contouring suite" className="w-full h-full object-cover" loading="lazy" />
            </div>
          </motion.div>
          <motion.div {...fade}>
            <Eyebrow>what to expect</Eyebrow>
            <h2 className="display-lg mb-2.5" style={{ color: "var(--hny-mocha)" }}>your appointment, step by step.</h2>
            <p className="font-body text-[15px] md:text-base mb-7 leading-relaxed" style={{ color: "var(--hny-soft-brown)" }}>
              we love a babe who knows what she's signing up for. here's exactly how your Liquid BBL Manchester appointment goes.
            </p>
            <ol className="space-y-6">
              {expectSteps.map((s, i) => (
                <li key={s.t} className="grid grid-cols-[auto_1fr] gap-4">
                  <span className="font-display italic text-2xl md:text-3xl leading-none pt-0.5" style={{ color: "var(--hny-rose-gold-deep)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display italic text-lg md:text-xl mb-1" style={{ color: "var(--hny-mocha)" }}>{s.t}</h3>
                    <p className="font-body text-[14px] md:text-base leading-relaxed" style={{ color: "var(--hny-soft-brown)" }}>{s.d}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-8">
              <DualCTA primary="book your slot" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============== PREPARE ============== */}
      <section id="prepare" className="py-14 md:py-24" style={{ background: "var(--hny-blush)" }}>
        <div className="max-w-[1000px] mx-auto px-5 md:px-10">
          <motion.div {...fade} className="text-center mb-10">
            <Eyebrow>before your appointment</Eyebrow>
            <h2 className="display-lg" style={{ color: "var(--hny-mocha)" }}>how to prepare, babe.</h2>
            <p className="font-body text-[14px] md:text-base mt-3 max-w-xl mx-auto" style={{ color: "var(--hny-soft-brown)" }}>
              small choices in the days before your BBL filler make a real difference to swelling, bruising and how quickly your shape settles.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            {prepareList.map((g) => (
              <motion.div key={g.when} {...fade}>
                <h3 className="font-script text-xl md:text-2xl mb-3" style={{ color: "var(--hny-rose-gold-deep)" }}>{g.when}</h3>
                <ul className="space-y-2.5 font-body text-[14px] md:text-base leading-relaxed" style={{ color: "var(--hny-soft-brown)" }}>
                  {g.items.map((it) => (
                    <li key={it} className="flex gap-2.5">
                      <span className="font-script text-lg flex-shrink-0 leading-none pt-1" style={{ color: "var(--hny-rose-gold-deep)" }}>♡</span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== AFTERCARE ============== */}
      <section id="aftercare" className="py-14 md:py-24" style={{ background: "var(--hny-cream)" }}>
        <div className="max-w-[1000px] mx-auto px-5 md:px-10">
          <motion.div {...fade} className="text-center mb-10">
            <Eyebrow>post care</Eyebrow>
            <h2 className="display-lg" style={{ color: "var(--hny-mocha)" }}>looking after your new shape.</h2>
            <p className="font-body text-[14px] md:text-base mt-3 max-w-xl mx-auto" style={{ color: "var(--hny-soft-brown)" }}>
              stick to this and you give your body contouring results the best chance to settle beautifully.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            {aftercareList.map((g) => (
              <motion.div key={g.when} {...fade}>
                <h3 className="font-script text-xl md:text-2xl mb-3" style={{ color: "var(--hny-rose-gold-deep)" }}>{g.when}</h3>
                <ul className="space-y-2.5 font-body text-[14px] md:text-base leading-relaxed" style={{ color: "var(--hny-soft-brown)" }}>
                  {g.items.map((it) => (
                    <li key={it} className="flex gap-2.5">
                      <span className="font-script text-lg flex-shrink-0 leading-none pt-1" style={{ color: "var(--hny-rose-gold-deep)" }}>♡</span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          <motion.p {...fade} className="font-script text-lg md:text-xl text-center mt-10 max-w-md mx-auto" style={{ color: "var(--hny-rose-gold-deep)" }}>
            anything feels off? message your practitioner on whatsapp anytime. we're always here.
          </motion.p>
        </div>
      </section>

      {/* ============== RESULTS ============== */}
      <section id="results" className="py-14 md:py-24" style={{ background: "var(--hny-nude)" }}>
        <div className="max-w-[1000px] mx-auto px-5 md:px-10">
          <motion.div {...fade} className="text-center mb-10">
            <Eyebrow>real results</Eyebrow>
            <h2 className="display-lg" style={{ color: "var(--hny-mocha)" }}>your before & after.</h2>
            <p className="font-body text-[14px] md:text-base mt-3 max-w-xl mx-auto" style={{ color: "var(--hny-soft-brown)" }}>
              real client results from Liquid BBL Manchester, shared with consent. individual outcomes vary based on anatomy, volume placed and aftercare.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {[
              { src: result1, cap: "Liquid BBL Manchester, 300ml. hip dip filler & lift." },
              { src: result2, cap: "Non-surgical BBL Manchester, 500ml. projection & sculpted curve." },
            ].map((r, i) => (
              <motion.figure key={i} {...fade} transition={{ duration: 0.7, delay: i * 0.1 }}>
                <div className="aspect-[4/5] overflow-hidden rounded-[30%/5%]">
                  <img
                    src={r.src}
                    alt={`Liquid BBL Manchester before and after ${i + 1} - HNY Club BBL filler & body contouring`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <figcaption className="font-script text-base md:text-lg mt-3 text-center" style={{ color: "var(--hny-rose-gold-deep)" }}>
                  {r.cap}
                </figcaption>
              </motion.figure>
            ))}
          </div>
          <motion.div {...fade} className="mt-10 flex justify-center">
            <DualCTA primary="i want results like this" />
          </motion.div>
        </div>
      </section>

      {/* ============== EXPERIENCE (real suite photo) ============== */}
      <section className="relative overflow-hidden" style={{ background: "var(--hny-cream)" }}>
        <div className="grid lg:grid-cols-2 items-stretch">
          <div className="aspect-[4/5] lg:aspect-auto">
            <img src={suite} alt="HNY Club Manchester - private Deansgate suite for Liquid BBL and body contouring" className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div className="px-6 md:px-12 py-12 md:py-20 flex items-center" style={{ background: "var(--hny-cream)" }}>
            <div className="max-w-md">
              <Eyebrow>the honey club</Eyebrow>
              <h2 className="display-lg mb-4" style={{ color: "var(--hny-mocha)" }}>more than a treatment. a feeling.</h2>
              <p className="font-body text-[15px] md:text-base leading-relaxed mb-4" style={{ color: "var(--hny-soft-brown)" }}>
                a private Deansgate suite. soft lighting. considered playlists. tea on arrival. your appointment is yours, your phone stays yours, your privacy stays ours.
              </p>
              <p className="font-body text-[15px] md:text-base leading-relaxed mb-6" style={{ color: "var(--hny-soft-brown)" }}>
                HNY Club exists for the babe who wants more curve without the operating theatre. subtle or statement, your shape, your call.
              </p>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-dainty">
                see more on instagram
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============== FAQ ============== */}
      <section id="faq" className="py-14 md:py-24" style={{ background: "var(--hny-cream)" }}>
        <div className="max-w-2xl mx-auto px-5 md:px-8">
          <motion.div {...fade} className="text-center mb-10">
            <Eyebrow>your questions, answered</Eyebrow>
            <h2 className="display-lg" style={{ color: "var(--hny-mocha)" }}>ask me anything, babe.</h2>
          </motion.div>
          <div>
            {faqs.map((f, i) => {
              const open = openFaq === i;
              return (
                <motion.div
                  key={f.q}
                  {...fade}
                  transition={{ duration: 0.35, delay: i * 0.02 }}
                  className="border-b"
                  style={{ borderColor: "rgba(167,117,96,0.22)" }}
                >
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="w-full flex items-center justify-between gap-4 py-4 md:py-5 text-left"
                    aria-expanded={open}
                  >
                    <span className="font-display italic text-base md:text-xl pr-2" style={{ color: "var(--hny-mocha)" }}>{f.q}</span>
                    <span className="font-display text-xl flex-shrink-0" style={{ color: "var(--hny-rose-gold-deep)" }}>{open ? "−" : "+"}</span>
                  </button>
                  {open && (
                    <div className="pb-5 pr-6 font-body text-[14px] md:text-base leading-relaxed" style={{ color: "var(--hny-soft-brown)" }}>
                      {f.a}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
          <motion.p {...fade} className="font-script text-lg md:text-xl text-center mt-10" style={{ color: "var(--hny-rose-gold-deep)" }}>
            still wondering? slide into our DMs. no question is too small. xx
          </motion.p>
        </div>
      </section>

      {/* ============== FINAL LETTER ============== */}
      <section className="py-16 md:py-24" style={{ background: "var(--hny-nude)" }}>
        <div className="max-w-xl mx-auto px-6 text-center">
          <motion.div {...fade}>
            <p className="font-script text-xl mb-2" style={{ color: "var(--hny-rose-gold-deep)" }}>p.s.</p>
            <h2 className="display-lg mb-5" style={{ color: "var(--hny-mocha)" }}>
              ready to join the <em className="font-script" style={{ color: "var(--hny-rose-gold-deep)" }}>honey club</em>?
            </h2>
            <p className="font-body text-[15px] md:text-base mb-7 leading-relaxed" style={{ color: "var(--hny-soft-brown)" }}>
              no pressure. no commitment. just an honest chat with us to see if Liquid BBL Manchester is right for you.
            </p>
            <div className="flex flex-wrap gap-2.5 justify-center">
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-dainty">whatsapp us</a>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost">DM on instagram</a>
              <a href={DEPOSIT_URL} className="btn-ghost" style={{ borderColor: "var(--hny-mocha)", color: "var(--hny-mocha)" }}>£100 deposit</a>
            </div>
            <p className="font-script text-xl md:text-2xl mt-8" style={{ color: "var(--hny-rose-gold-deep)" }}>
              xoxo, hny club
            </p>
            <div className="mt-6 font-body text-[11px] flex flex-wrap justify-center gap-x-5 gap-y-1.5" style={{ color: "var(--hny-soft-brown)" }}>
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
