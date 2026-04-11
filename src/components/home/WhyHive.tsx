import { motion } from "framer-motion";

const pillars = [
  {
    number: "01",
    title: "Personalised Plans",
    text: "Every treatment begins with a thorough consultation. We create a bespoke plan tailored to your facial anatomy and aesthetic goals.",
  },
  {
    number: "02",
    title: "Premium Products",
    text: "We use only leading, CE-marked dermal fillers and medical-grade skincare. No compromises on quality or safety.",
  },
  {
    number: "03",
    title: "Qualified Practitioners",
    text: "All injectable treatments are performed by trained aesthetic practitioners with extensive experience in facial aesthetics.",
  },
  {
    number: "04",
    title: "Transparent Pricing",
    text: "Clear pricing with no hidden fees. 20% deposit to secure your appointment - the remaining balance is paid on the day.",
  },
];

const WhyHive = () => (
  <section className="py-20 md:py-28 border-b border-border" aria-label="Why choose Hive Clinic">
    <div className="max-w-7xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-14"
      >
        <p className="font-body text-[10px] tracking-[0.3em] uppercase text-gold mb-3">Why Hive Clinic</p>
        <h2 className="font-display text-3xl md:text-5xl leading-tight max-w-lg">
          Built on trust,<br />delivered with precision.
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-border">
        {pillars.map((p, i) => (
          <motion.div
            key={p.number}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className={`p-8 md:p-10 ${i < pillars.length - 1 ? "border-b lg:border-b-0 lg:border-r border-border" : ""}`}
          >
            <span className="font-display text-2xl text-gold/30 block mb-4">{p.number}</span>
            <h3 className="font-display text-lg mb-3">{p.title}</h3>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">{p.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyHive;
