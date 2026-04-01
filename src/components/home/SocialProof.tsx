import { motion } from "framer-motion";
import { Star, ArrowRight } from "lucide-react";

interface Review {
  name: string;
  text: string;
  stars: number;
}

interface SocialProofProps {
  reviews: Review[];
}

const SocialProof = ({ reviews }: SocialProofProps) => {
  return (
    <section className="py-20 md:py-28 bg-foreground text-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} className="fill-gold text-gold" />
              ))}
            </div>
            <span className="font-body text-[11px] text-background/40 tracking-[0.1em] uppercase">100+ Five Star Reviews</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl text-background">
            Don't just take our word for it.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative p-7 md:p-8 border border-white/[0.06]"
            >
              <div className="flex gap-0.5 mb-5">
                {Array.from({ length: r.stars }).map((_, j) => (
                  <Star key={j} size={10} className="fill-gold text-gold" />
                ))}
              </div>
              <p className="font-body text-background/60 leading-relaxed text-sm mb-6">"{r.text}"</p>
              <p className="font-body text-[10px] tracking-[0.2em] uppercase text-background/30">{r.name}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8"
        >
          <a
            href="https://share.google/mBcefh9rsj2qmoRlJ"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-body text-[11px] tracking-[0.15em] uppercase text-gold hover:text-background transition-colors"
          >
            Read all Google reviews <ArrowRight size={12} />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default SocialProof;
