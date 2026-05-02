import { motion } from "framer-motion";
import { ArrowUpRight, Camera } from "lucide-react";
import { Link } from "react-router-dom";
import { trackBookNow } from "@/hooks/use-tracking";
import { useBookNow } from "@/hooks/use-book-now";
import { LUXE } from "@/lib/stock-images";

// Three signature treatments — sleek editorial cards.
const signatures = [
  {
    eyebrow: "House Signature",
    title: "Lip Filler",
    subtitle: "Naturally plump. Never overdone.",
    price: "from £99",
    image: LUXE.lips,
    category: "Lips",
    src: "home_signature_lips",
  },
  {
    eyebrow: "Skin Hero",
    title: "Profhilo",
    subtitle: "Glass-like glow in 4 weeks.",
    price: "from £230",
    image: LUXE.profhilo,
    category: "Skin Boosters",
    src: "home_signature_profhilo",
  },
  {
    eyebrow: "Quietly Booked",
    title: "Anti-Wrinkle",
    subtitle: "Refined. Subtle. Never frozen.",
    price: "from £150",
    image: LUXE.tox,
    category: "Anti Wrinkle (Botox)",
    src: "home_signature_tox",
  },
];

const OffersSection = () => {
  const book = useBookNow();
  return (
    <section className="section-y bg-bone-deep relative" aria-label="Signature treatments">
      <div className="container-edit">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14 md:mb-20"
        >
          <div>
            <p className="eyebrow text-champagne mb-5">The Signature Edit</p>
            <h2 className="font-display text-4xl md:text-6xl text-ink leading-[1.04] max-w-2xl tracking-tight">
              Three treatments. One <span className="display-italic text-aubergine">obsession.</span>
            </h2>
          </div>
          <Link
            to="/treatments"
            className="self-start inline-flex items-center gap-2 font-body text-[11px] tracking-[0.3em] uppercase text-ink/60 hover:text-aubergine border-b border-aubergine/30 pb-1 transition-colors"
          >
            Full menu <ArrowUpRight size={13} strokeWidth={1.5} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
          {signatures.map((s, i) => (
            <motion.button
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              onClick={() => { trackBookNow(s.src, s.category, s.title); book(s.category); }}
              className="block group text-left"
            >
              <div className="relative overflow-hidden bg-ink/5 aspect-[4/5] mb-5">
                <img
                  src={s.image}
                  alt={s.title}
                  className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-[1200ms] ease-out"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 bg-bone/95 px-3 py-1">
                  <span className="eyebrow text-aubergine">{s.eyebrow}</span>
                </div>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <div>
                  <h3 className="font-display text-2xl md:text-3xl text-ink group-hover:text-aubergine transition-colors">
                    {s.title}
                  </h3>
                  <p className="font-body text-sm text-ink/55 mt-1">{s.subtitle}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-body text-[9px] tracking-[0.3em] uppercase text-ink/40">From</p>
                  <p className="font-display text-lg text-champagne">{s.price.replace("from ", "")}</p>
                </div>
              </div>
            </motion.button>
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
            <p className="eyebrow text-champagne mb-3 flex items-center gap-2">
              <Camera size={12} strokeWidth={1.5} /> Content Model Programme
            </p>
            <h3 className="font-display text-2xl md:text-4xl leading-tight mb-3 tracking-tight">
              Camera-confident? Treatments at <span className="display-italic text-champagne">reduced rates</span>.
            </h3>
            <p className="font-body text-sm text-bone/65 leading-[1.7] max-w-xl">
              Trade your before-and-afters for premium treatments. From £99 lip filler to £399 4ml facial balancing.
            </p>
          </div>
          <div className="lg:col-span-5 flex flex-col sm:flex-row gap-3 lg:justify-end">
            <Link
              to="/content-models"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-bone text-ink font-body text-[11px] tracking-[0.3em] uppercase hover:bg-champagne transition-colors"
            >
              See the Programme
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OffersSection;
