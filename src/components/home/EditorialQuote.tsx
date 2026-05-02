import { motion } from "framer-motion";
import { LUXE } from "@/lib/stock-images";

const EditorialQuote = () => (
  <section className="relative py-24 md:py-36 bg-ink text-bone bg-noise overflow-hidden">
    {/* Giant decorative type */}
    <p
      className="absolute -top-6 left-1/2 -translate-x-1/2 font-display italic text-[28vw] leading-none text-bone/[0.04] select-none pointer-events-none whitespace-nowrap"
      aria-hidden
    >
      hive.
    </p>

    <div className="relative max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="lg:col-span-4"
      >
        <div className="polaroid max-w-xs mx-auto lg:mx-0 -rotate-2">
          <img
            src={LUXE.founder}
            alt="Bianca, founder of Hive Clinic Manchester"
            className="w-full aspect-[4/5] object-cover"
            loading="lazy"
          />
          <p className="absolute bottom-3 left-0 right-0 text-center font-script text-base text-ink/70">
            Bianca · Founder
          </p>
        </div>
      </motion.div>

      <div className="lg:col-span-8">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="eyebrow text-rose mb-6"
        >
          A note from the founder
        </motion.p>

        <motion.blockquote
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="font-display text-3xl md:text-5xl leading-[1.15] mb-8"
        >
          Aesthetics shouldn't feel <span className="font-script italic text-rose">clinical</span>. It should feel like you, on your <span className="font-script italic text-rose">best day</span>, every day.
        </motion.blockquote>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="flex items-center gap-3"
        >
          <div className="h-px w-12 bg-gold" />
          <p className="font-body text-[11px] tracking-[0.32em] uppercase text-bone/60">
            Bianca · Founder & Lead Aesthetician
          </p>
        </motion.div>
      </div>
    </div>
  </section>
);

export default EditorialQuote;
