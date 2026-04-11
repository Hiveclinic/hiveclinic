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

const SocialProof = ({ reviews }: SocialProofProps) => (
  <section className="py-20 md:py-28 bg-secondary" aria-label="Client reviews">
    <div className="max-w-7xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14"
      >
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={13} className="fill-gold text-gold" />
              ))}
            </div>
            <span className="font-body text-[11px] text-muted-foreground tracking-[0.1em] uppercase">5.0 on Google</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl">
            Don't just take our word for it.
          </h2>
        </div>
        <a
          href="https://share.google/mBcefh9rsj2qmoRlJ"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-body text-[11px] tracking-[0.15em] uppercase text-muted-foreground hover:text-gold transition-colors"
        >
          Read all reviews <ArrowRight size={12} />
        </a>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.slice(0, 3).map((r, i) => (
          <motion.blockquote
            key={r.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="bg-background p-8 md:p-10 border border-border"
          >
            <div className="flex gap-0.5 mb-5">
              {Array.from({ length: r.stars }).map((_, j) => (
                <Star key={j} size={10} className="fill-gold text-gold" />
              ))}
            </div>
            <p className="font-body text-foreground/70 leading-[1.75] text-sm mb-6">"{r.text}"</p>
            <footer className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">{r.name}</footer>
          </motion.blockquote>
        ))}
      </div>
    </div>
  </section>
);

export default SocialProof;
