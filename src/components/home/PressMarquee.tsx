import { motion } from "framer-motion";
import { Star } from "lucide-react";

const items = [
  "5.0 Google Rating",
  "100+ Five-Star Reviews",
  "Qualified Practitioners",
  "Bespoke Treatment Plans",
  "Manchester City Centre",
  "Klarna / Clearpay",
  "CE-Marked Products",
];

const PressMarquee = () => (
  <section
    className="relative py-5 md:py-6 bg-ink text-bone overflow-hidden border-y border-champagne/30"
    aria-label="Trust marks"
  >
    <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink to-transparent z-10 pointer-events-none" />
    <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink to-transparent z-10 pointer-events-none" />
    <motion.div
      initial={{ x: 0 }}
      animate={{ x: "-50%" }}
      transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
      className="flex gap-12 whitespace-nowrap items-center"
      style={{ width: "max-content" }}
    >
      {[...items, ...items, ...items].map((it, i) => (
        <div key={i} className="flex items-center gap-6 shrink-0">
          <Star size={10} className="fill-champagne text-champagne" strokeWidth={0} />
          <span className="font-serif-accent italic text-[14px] md:text-[15px] text-bone/85 tracking-wider">
            {it}
          </span>
          <span className="text-champagne/40 text-xl leading-none">/</span>
        </div>
      ))}
    </motion.div>
  </section>
);

export default PressMarquee;
