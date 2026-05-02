import { motion } from "framer-motion";
import { ArrowRight, Flame, Camera } from "lucide-react";
import { Link } from "react-router-dom";
import { trackBookNow } from "@/hooks/use-tracking";

const offers = [
  {
    title: "Signature 1ml Lip Filler",
    price: "£99",
    description: "Tailored 1ml lip enhancement with personalised lip shaping and full aftercare. Limited availability.",
  },
  {
    title: "2ml Facial Balance Package",
    price: "£220",
    description: "2ml dermal filler placed across lips, chin, cheeks, or jawline for overall facial harmony.",
  },
];

const modelServices = [
  { title: "1ml Lip Filler", price: "£99" },
  { title: "2ml Facial Balancing", price: "£199" },
  { title: "3ml Facial Balancing", price: "£299" },
  { title: "4ml Facial Balancing", price: "£399" },
  { title: "Feature Refinement", price: "£120" },
];

const OffersSection = () => (
  <section className="py-20 md:py-28 border-b border-border" aria-label="Current offers and content model programme">
    <div className="max-w-7xl mx-auto px-6">
      {/* Offers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <div className="flex items-center gap-2 mb-3">
          <Flame size={14} className="text-gold" />
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-gold">Limited Offers</p>
        </div>
        <h2 className="font-display text-3xl md:text-5xl leading-tight mb-10">
          This month's specials.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border">
          {offers.map((o, i) => (
            <motion.div
              key={o.title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="bg-background"
            >
              <Link
                to="/bookings#book"
                onClick={() => trackBookNow("home_offers", undefined, o.title)}
                className="group flex flex-col justify-between p-8 md:p-10 h-full hover:bg-secondary/40 transition-all duration-300"
              >
                <div>
                  <span className="inline-block font-body text-[8px] tracking-[0.2em] uppercase text-gold border border-gold/25 px-2 py-0.5 mb-4">
                    Limited Offer
                  </span>
                  <h3 className="font-display text-xl md:text-2xl group-hover:text-gold transition-colors duration-300 mb-2">{o.title}</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{o.description}</p>
                </div>
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/60">
                  <span className="font-display text-2xl text-gold">{o.price}</span>
                  <ArrowRight size={14} className="text-muted-foreground/40 group-hover:text-gold group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Content Model Programme */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Camera size={14} className="text-gold" />
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-gold">Content Model Programme</p>
        </div>
        <h2 className="font-display text-2xl md:text-4xl leading-tight mb-4">
          Reduced rates for content.
        </h2>
        <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-xl mb-8">
          Get treatments at reduced prices in exchange for before and after photos and video content for our portfolio. Perfect if you are camera-confident and looking for a great deal.
        </p>

        <div className="border border-border bg-background">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-border">
            {modelServices.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="p-6 bg-background text-center"
              >
                <p className="font-display text-sm mb-1">{s.title}</p>
                <p className="font-display text-xl text-gold">{s.price}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link
            to="/content-models"
            className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-gold text-white font-body text-[11px] tracking-[0.2em] uppercase hover:bg-gold-dark transition-colors duration-300"
          >
            View Model Programme
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/bookings#book"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-border text-foreground/60 font-body text-[11px] tracking-[0.2em] uppercase hover:border-gold/30 hover:text-gold transition-colors duration-300"
          >
            Full Treatment Menu
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

export default OffersSection;
