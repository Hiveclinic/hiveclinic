import { motion } from "framer-motion";
import { Star } from "lucide-react";

const items = [
  "5.0 Google Rating",
  "Five-Star Reviews",
  "Qualified Practitioners",
  "Bespoke Treatment Plans",
  "Manchester City Centre",
  "Klarna / Clearpay",
  "CE-Marked Products",
];

const PressMarquee = () => (
  <section
    className="relative py-2.5 md:py-3 bg-bone-deep/60 text-ink/80 overflow-hidden border-y border-champagne/25"
    aria-label="Trust marks"
  >
    <div className="absolute inset-y-0 left-0 w-16 md:w-24 bg-gradient-to-r from-bone-deep/90 to-transparent z-10 pointer-events-none" />
    <div className="absolute inset-y-0 right-0 w-16 md:w-24 bg-gradient-to-l from-bone-deep/90 to-transparent z-10 pointer-events-none" />
    <motion.div
      initial={{ x: 0 }}
      animate={{ x: "-50%" }}
      transition={{ duration: 56, repeat: Infinity, ease: "linear" }}
      className="flex gap-8 md:gap-10 whitespace-nowrap items-center"
      style={{ width: "max-content" }}
    >
      {[...items, ...items, ...items].map((it, i) => (
        <div key={i} className="flex items-center gap-4 md:gap-5 shrink-0">
          <Star size={8} className="fill-champagne text-champagne" strokeWidth={0} />
          <span className="font-display text-[12px] md:text-[13px] tracking-[0.18em] uppercase text-ink/75">
            {it}
          </span>
          <span className="text-champagne/40 text-base leading-none">·</span>
        </div>
      ))}
    </motion.div>
  </section>
);

export default PressMarquee;
