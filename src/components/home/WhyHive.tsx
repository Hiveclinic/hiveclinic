import { motion } from "framer-motion";

const pillars = [
  { number: "01", title: "Consult", text: "We listen first. Your goals, your face, your lifestyle. Honest advice, no upsell." },
  { number: "02", title: "Tailor", text: "Bespoke plan using premium CE-marked products and the right technique for you." },
  { number: "03", title: "Treat", text: "Calm, comfortable studio. Numbing cream, gentle technique, beautiful surroundings." },
  { number: "04", title: "Glow", text: "Aftercare that actually works. WhatsApp support and follow-up guaranteed." },
];

const WhyHive = () => (
  <section className="section-y bg-bone relative" aria-label="The Hive Method">
    <div className="container-edit">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16 md:mb-20"
      >
        <p className="eyebrow text-champagne mb-5">The Hive Method</p>
        <h2 className="font-display text-4xl md:text-6xl leading-[1.05] text-ink max-w-3xl mx-auto tracking-tight">
          Quietly luxurious. <span className="display-italic text-aubergine">Loud</span> on results.
        </h2>
        <div className="hairline mt-10 max-w-xs mx-auto" />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
        {pillars.map((p, i) => (
          <motion.div
            key={p.number}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="bg-bone p-10 md:p-12 group hover:bg-bone-deep/60 transition-colors duration-500"
          >
            <span className="numeral text-3xl block mb-6 group-hover:scale-110 transition-transform origin-left">
              {p.number}
            </span>
            <h3 className="font-display text-2xl md:text-3xl text-ink mb-4">{p.title}</h3>
            <p className="font-body text-sm text-ink/65 leading-[1.75]">{p.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyHive;
