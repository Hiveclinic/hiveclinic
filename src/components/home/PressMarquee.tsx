import { motion } from "framer-motion";
import { Award, MapPin, Quote, ShieldCheck, Sparkles, Star } from "lucide-react";

// Premium editorial trust bar that sits high on the page.
// Replaces the "boring" generic banner with a magazine-style
// statement + scrolling marquee of values.
const items = [
  { icon: Star, text: "100+ Five-star reviews" },
  { icon: ShieldCheck, text: "Qualified prescriber" },
  { icon: Award, text: "CE-marked products" },
  { icon: Sparkles, text: "Bespoke treatment plans" },
  { icon: MapPin, text: "Manchester city centre" },
  { icon: Star, text: "100+ Five-star reviews" },
  { icon: ShieldCheck, text: "Qualified prescriber" },
  { icon: Award, text: "CE-marked products" },
  { icon: Sparkles, text: "Bespoke treatment plans" },
  { icon: MapPin, text: "Manchester city centre" },
];

const PressMarquee = () => (
  <section
    className="relative py-10 md:py-14 bg-foreground text-background overflow-hidden"
    aria-label="Trust marks"
  >
    <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-foreground to-transparent z-10 pointer-events-none" />
    <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-foreground to-transparent z-10 pointer-events-none" />
    <motion.div
      initial={{ x: 0 }}
      animate={{ x: "-50%" }}
      transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
      className="flex gap-12 whitespace-nowrap"
      style={{ width: "max-content" }}
    >
      {[...items, ...items].map((it, i) => (
        <div key={i} className="flex items-center gap-3 shrink-0">
          <it.icon size={14} strokeWidth={1.5} className="text-gold" />
          <span className="font-body text-[11px] tracking-[0.4em] uppercase text-background/80">
            {it.text}
          </span>
          <Quote
            size={10}
            strokeWidth={1.5}
            className="text-gold/40 ml-6 rotate-180"
          />
        </div>
      ))}
    </motion.div>
  </section>
);

export default PressMarquee;
