import { motion } from "framer-motion";
import { ArrowUpRight, Camera, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { trackBookNow } from "@/hooks/use-tracking";
import { LUXE } from "@/lib/stock-images";

// Three signature treatments. Editorial cards. No "this month's specials" energy.
const signatures = [
  {
    eyebrow: "House Signature",
    title: "Lip Filler",
    subtitle: "Naturally plump. Never overdone.",
    price: "from £99",
    image: LUXE.lips,
    link: "/treatments/lip-fillers-manchester",
    src: "home_signature_lips",
  },
  {
    eyebrow: "Skin Hero",
    title: "Profhilo",
    subtitle: "Glass-like glow in 4 weeks.",
    price: "from £230",
    image: LUXE.profhilo,
    link: "/treatments/skin-boosters-manchester",
    src: "home_signature_profhilo",
  },
  {
    eyebrow: "Limited",
    title: "Hive Tox Day",
    subtitle: "Anti-wrinkle, refined and elegant.",
    price: "from £120",
    image: LUXE.tox,
    link: "/treatments/anti-wrinkle-injections-manchester",
    src: "home_signature_tox",
  },
];

const OffersSection = () => (
  <section className="py-24 md:py-32 bg-blush/40 relative" aria-label="Signature treatments">
    <div className="max-w-7xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14"
      >
        <div>
          <p className="eyebrow text-burgundy mb-4 flex items-center gap-2">
            <Sparkles size={12} className="text-burgundy" /> The Signature Edit
          </p>
          <h2 className="font-display text-4xl md:text-6xl text-ink leading-[1.02] max-w-2xl">
            Three treatments, one
            <span className="font-script italic text-burgundy"> obsession.</span>
          </h2>
        </div>
        <Link
          to="/treatments"
          className="self-start inline-flex items-center gap-2 font-body text-[11px] tracking-[0.28em] uppercase text-ink/60 hover:text-burgundy border-b border-burgundy/30 pb-1 transition-colors"
        >
          Full menu
          <ArrowUpRight size={13} />
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {signatures.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
          >
            <Link
              to={s.link}
              onClick={() => trackBookNow(s.src, undefined, s.title)}
              className="block group"
            >
              <div className="relative overflow-hidden bg-ink/5 aspect-[4/5] mb-5">
                <img
                  src={s.image}
                  alt={s.title}
                  className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-[1200ms] ease-out"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 bg-bone/95 px-3 py-1">
                  <span className="eyebrow text-burgundy">{s.eyebrow}</span>
                </div>
                <div className="absolute bottom-4 right-4 btn-gold w-20 h-20 rounded-full flex flex-col items-center justify-center text-center shadow-xl">
                  <span className="font-body text-[8px] tracking-[0.25em] uppercase text-ink/70">From</span>
                  <span className="font-display text-base text-ink leading-none">{s.price.replace('from ', '')}</span>
                </div>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <div>
                  <h3 className="font-display text-2xl md:text-3xl text-ink group-hover:text-burgundy transition-colors">
                    {s.title}
                  </h3>
                  <p className="font-body text-sm text-ink/60 mt-1">{s.subtitle}</p>
                </div>
                <ArrowUpRight size={20} className="text-ink/30 group-hover:text-burgundy group-hover:-translate-y-1 group-hover:translate-x-1 transition-all flex-shrink-0" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Content model strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-ink text-bone p-8 md:p-12 bg-noise"
      >
        <div className="lg:col-span-7">
          <p className="eyebrow text-rose mb-3 flex items-center gap-2">
            <Camera size={12} /> Content Model Programme
          </p>
          <h3 className="font-display text-2xl md:text-4xl leading-tight mb-3">
            Camera-confident? Treatments at <span className="font-script italic text-rose">reduced rates</span>.
          </h3>
          <p className="font-body text-sm text-bone/65 leading-relaxed max-w-xl">
            Trade your before-and-afters for premium treatments. From £99 lip filler to £399 4ml facial balancing.
          </p>
        </div>
        <div className="lg:col-span-5 flex flex-col sm:flex-row gap-3 lg:justify-end">
          <Link
            to="/content-models"
            className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-bone text-ink font-body text-[11px] tracking-[0.28em] uppercase hover:bg-rose hover:text-ink transition-colors"
          >
            See the programme
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

export default OffersSection;
