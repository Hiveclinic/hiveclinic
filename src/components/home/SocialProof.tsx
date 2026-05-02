import { motion } from "framer-motion";
import { Star, ArrowUpRight } from "lucide-react";

interface Review { name: string; text: string; stars: number; }
interface SocialProofProps { reviews: Review[]; }

const SocialProof = ({ reviews }: SocialProofProps) => (
  <section className="section-y bg-bone-deep" aria-label="Client reviews">
    <div className="container-edit">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14 md:mb-20"
      >
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={13} className="fill-champagne text-champagne" strokeWidth={0} />
              ))}
            </div>
            <span className="eyebrow text-ink/55">5.0 on Google / 100+ reviews</span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl text-ink leading-[1.04] tracking-tight">
            They came back. <span className="display-italic text-aubergine">Twice.</span>
          </h2>
        </div>
        <a
          href="https://share.google/mBcefh9rsj2qmoRlJ"
          target="_blank"
          rel="noopener noreferrer"
          className="self-start inline-flex items-center gap-2 font-body text-[11px] tracking-[0.3em] uppercase text-ink/60 hover:text-aubergine transition-colors border-b border-aubergine/30 pb-1"
        >
          Read all reviews <ArrowUpRight size={13} strokeWidth={1.5} />
        </a>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
        {reviews.slice(0, 3).map((r, i) => (
          <motion.blockquote
            key={r.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="bg-bone p-8 md:p-10 border border-border"
          >
            <div className="flex gap-0.5 mb-4">
              {Array.from({ length: r.stars }).map((_, j) => (
                <Star key={j} size={11} className="fill-champagne text-champagne" strokeWidth={0} />
              ))}
            </div>
            <p className="font-body text-ink/75 leading-[1.8] text-[15px] mb-6">{r.text}</p>
            <footer className="flex items-center gap-3 pt-5 border-t border-border">
              <div className="w-8 h-8 rounded-full bg-aubergine/10 flex items-center justify-center">
                <span className="font-display text-aubergine text-sm">{r.name.charAt(0)}</span>
              </div>
              <span className="font-body text-[11px] tracking-[0.25em] uppercase text-ink/55">{r.name}</span>
            </footer>
          </motion.blockquote>
        ))}
      </div>
    </div>
  </section>
);

export default SocialProof;
