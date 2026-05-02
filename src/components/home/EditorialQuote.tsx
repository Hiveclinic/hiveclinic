import { motion } from "framer-motion";

// Magazine-style editorial pull-quote that breaks up the page rhythm.
const EditorialQuote = () => (
  <section className="relative py-24 md:py-36 bg-summer-cream overflow-hidden">
    <div className="absolute inset-0 bg-sun-soft pointer-events-none" />

    {/* Decorative type */}
    <p
      className="absolute top-6 left-1/2 -translate-x-1/2 font-display italic text-[18vw] leading-none text-gold/[0.06] select-none pointer-events-none"
      aria-hidden
    >
      Hive
    </p>

    <div className="relative max-w-4xl mx-auto px-6 text-center">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-body text-[10px] tracking-[0.5em] uppercase text-gold mb-8"
      >
        — A note from the founder —
      </motion.p>

      <motion.blockquote
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.05 }}
        className="font-display text-3xl md:text-5xl leading-tight md:leading-[1.15] mb-10"
      >
        “Aesthetics should never feel <span className="italic text-gold">clinical</span>. It should feel like
        you, on your <span className="italic text-gold">best day</span> — every day.”
      </motion.blockquote>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15 }}
        className="inline-flex items-center gap-3"
      >
        <div className="h-px w-12 bg-gold" />
        <p className="font-body text-[11px] tracking-[0.3em] uppercase text-muted-foreground">
          Bianca · Founder & Lead Aesthetician
        </p>
        <div className="h-px w-12 bg-gold" />
      </motion.div>
    </div>
  </section>
);

export default EditorialQuote;
