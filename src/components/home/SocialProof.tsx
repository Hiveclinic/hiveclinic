import { motion } from "framer-motion";
import { Star, ArrowUpRight } from "lucide-react";

interface Review { name: string; text: string; stars: number; }
interface SocialProofProps { reviews: Review[]; }

const SocialProof = ({ reviews }: SocialProofProps) => (
  <section className="py-24 md:py-32 bg-blush/30 bg-noise" aria-label="Client reviews">
    <div className="max-w-7xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14"
      >
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} className="fill-gold text-gold" />
              ))}
            </div>
            <span className="eyebrow text-ink/60">5.0 on Google · 100+ reviews</span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl text-ink leading-[1.02]">
            They came back.
            <span className="font-script italic text-burgundy"> Twice.</span>
          </h2>
        </div>
        <a
          href="https://share.google/mBcefh9rsj2qmoRlJ"
          target="_blank"
          rel="noopener noreferrer"
          className="self-start inline-flex items-center gap-2 font-body text-[11px] tracking-[0.28em] uppercase text-ink/60 hover:text-burgundy transition-colors border-b border-burgundy/30 pb-1"
        >
          Read all reviews <ArrowUpRight size={13} />
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
            className="bg-bone p-8 md:p-10 relative shadow-[0_18px_40px_-24px_hsl(var(--ink)/0.18)]"
            style={{ transform: i === 1 ? "rotate(0.5deg)" : i === 0 ? "rotate(-0.4deg)" : "rotate(0.3deg)" }}
          >
            <span className="font-script italic text-5xl text-rose/40 absolute top-4 left-6 leading-none">"</span>
            <div className="flex gap-0.5 mb-4 mt-4">
              {Array.from({ length: r.stars }).map((_, j) => (
                <Star key={j} size={11} className="fill-gold text-gold" />
              ))}
            </div>
            <p className="font-body text-ink/75 leading-[1.75] text-[15px] mb-6">{r.text}</p>
            <footer className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-rose/40 flex items-center justify-center">
                <span className="font-display italic text-burgundy text-sm">{r.name.charAt(0)}</span>
              </div>
              <span className="font-body text-[11px] tracking-[0.22em] uppercase text-ink/60">{r.name}</span>
            </footer>
          </motion.blockquote>
        ))}
      </div>
    </div>
  </section>
);

export default SocialProof;
