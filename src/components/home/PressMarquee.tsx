import { motion } from "framer-motion";
import { Star } from "lucide-react";

// Editorial trust marquee. Magazine masthead vibe.
const items = [
  "5.0 Google Rating",
  "100+ Five-Star Reviews",
  "Qualified Practitioners",
  "Bespoke Treatment Plans",
  "Manchester City Centre",
  "Klarna · Clearpay",
  "CE-Marked Products",
];

const PressMarquee = () => (
  <section
    className="relative py-6 md:py-7 bg-ink text-bone overflow-hidden border-y border-burgundy/40"
    aria-label="Trust marks"
  >
    <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink to-transparent z-10 pointer-events-none" />
    <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink to-transparent z-10 pointer-events-none" />
    <motion.div
      initial={{ x: 0 }}
      animate={{ x: "-50%" }}
      transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
      className="flex gap-12 whitespace-nowrap items-center"
      style={{ width: "max-content" }}
    >
      {[...items, ...items, ...items].map((it, i) => (
        <div key={i} className="flex items-center gap-6 shrink-0">
          <Star size={11} className="fill-gold text-gold" />
          <span className="font-display italic text-[15px] md:text-lg text-bone/90">
            {it}
          </span>
          <span className="font-script text-rose/60 text-2xl leading-none">·</span>
        </div>
      ))}
    </motion.div>
  </section>
);

export default PressMarquee;
