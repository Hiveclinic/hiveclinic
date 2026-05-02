import { motion } from "framer-motion";
import { LUXE } from "@/lib/stock-images";

const EditorialQuote = () => (
  <section className="relative section-y bg-ink text-bone bg-noise overflow-hidden">
    <div className="container-edit max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="lg:col-span-4"
      >
        <div className="relative max-w-xs mx-auto lg:mx-0">
          <img
            src={LUXE.founder}
            alt="Bianca, founder of Hive Clinic Manchester"
            className="w-full aspect-[4/5] object-cover"
            loading="lazy"
          />
          <div className="absolute -right-2 top-8 bottom-8 w-px bg-champagne/40 hidden md:block" />
          <p className="mt-4 font-body text-[10px] tracking-[0.3em] uppercase text-bone/55">
            Bianca / Founder
          </p>
        </div>
      </motion.div>

      <div className="lg:col-span-8">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="eyebrow text-champagne mb-6"
        >
          A note from the founder
        </motion.p>

        <motion.blockquote
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="font-display text-3xl md:text-5xl leading-[1.18] mb-8 tracking-tight"
        >
          Aesthetics shouldn't feel <span className="display-italic text-champagne">clinical</span>. It should feel like you, on your <span className="display-italic text-champagne">best day</span>, every day.
        </motion.blockquote>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="flex items-center gap-3"
        >
          <div className="h-px w-12 bg-champagne" />
          <p className="font-body text-[11px] tracking-[0.32em] uppercase text-bone/55">
            Bianca / Founder &amp; Lead Aesthetician
          </p>
        </motion.div>
      </div>
    </div>
  </section>
);

export default EditorialQuote;
