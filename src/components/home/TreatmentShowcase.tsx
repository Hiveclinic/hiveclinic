import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const treatments = [
  { title: "Lip Fillers", desc: "Subtle volume and natural definition", link: "/treatments/lip-fillers-manchester", from: "£120", tag: "Most Popular" },
  { title: "Anti-Wrinkle", desc: "Soften lines, prevent new ones forming", link: "/treatments/anti-wrinkle-manchester", from: "£140", tag: null },
  { title: "Dermal Filler", desc: "Restore volume and smooth fine lines", link: "/treatments/dermal-filler-manchester", from: "£150", tag: null },
  { title: "Skin Boosters", desc: "Radiant, deeply hydrated complexion", link: "/treatments/skin-boosters-manchester", from: "£130", tag: null },
  { title: "HydraFacial", desc: "Deep cleanse, exfoliate and hydrate", link: "/treatments/hydrafacial-manchester", from: "£150", tag: "Skin Favourite" },
  { title: "Chemical Peels", desc: "Medical-grade skin renewal", link: "/treatments/chemical-peels-manchester", from: "£95", tag: null },
];

const TreatmentShowcase = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12"
        >
          <div>
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-gold mb-2">Our Treatments</p>
            <h2 className="font-display text-3xl md:text-5xl leading-tight">Tailored to you.</h2>
          </div>
          <Link
            to="/bookings"
            className="inline-flex items-center gap-2 font-body text-[11px] tracking-[0.15em] uppercase text-muted-foreground hover:text-gold transition-colors"
          >
            Full treatment menu <ArrowRight size={12} />
          </Link>
        </motion.div>

        {/* 2-column staggered grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {treatments.map((t, i) => (
            <motion.div
              key={t.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
            >
              <Link
                to={t.link}
                className="group flex items-center justify-between p-6 md:p-8 border border-border hover:border-gold/30 bg-background hover:bg-secondary/50 transition-all duration-300"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-display text-xl md:text-2xl group-hover:text-gold transition-colors duration-300">{t.title}</h3>
                    {t.tag && (
                      <span className="font-body text-[9px] tracking-[0.15em] uppercase text-gold border border-gold/30 px-2 py-0.5">
                        {t.tag}
                      </span>
                    )}
                  </div>
                  <p className="font-body text-sm text-muted-foreground">{t.desc}</p>
                </div>
                <div className="flex items-center gap-4 ml-4 shrink-0">
                  <span className="font-body text-sm text-foreground/80">From {t.from}</span>
                  <ArrowRight size={14} className="text-muted-foreground group-hover:text-gold group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TreatmentShowcase;
