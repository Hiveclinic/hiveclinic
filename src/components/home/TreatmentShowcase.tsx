import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const treatments = [
  { title: "Lip Fillers", desc: "Subtle volume and natural definition", link: "/treatments/lip-fillers-manchester", from: "£120", tag: "Most Popular" },
  { title: "Anti-Wrinkle", desc: "Soften lines, prevent new ones forming", link: "/treatments/anti-wrinkle-manchester", from: "£140" },
  { title: "Dermal Filler", desc: "Restore volume and contour key features", link: "/treatments/dermal-filler-manchester", from: "£150" },
  { title: "Skin Boosters", desc: "Deep hydration and radiance from within", link: "/treatments/skin-boosters-manchester", from: "£130" },
  { title: "HydraFacial", desc: "Deep cleanse, exfoliate and hydrate", link: "/treatments/hydrafacial-manchester", from: "£150" },
  { title: "Chemical Peels", desc: "Medical-grade skin renewal and clarity", link: "/treatments/chemical-peels-manchester", from: "£95" },
];

const TreatmentShowcase = () => (
  <section className="py-20 md:py-28" aria-label="Popular treatments">
    <div className="max-w-7xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14"
      >
        <div>
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-gold mb-3">Treatments</p>
          <h2 className="font-display text-3xl md:text-5xl leading-tight">Tailored to you.</h2>
        </div>
        <Link
          to="/bookings"
          className="inline-flex items-center gap-2 font-body text-[11px] tracking-[0.15em] uppercase text-muted-foreground hover:text-gold transition-colors"
        >
          Full treatment menu <ArrowRight size={12} />
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
        {treatments.map((t, i) => (
          <motion.div
            key={t.title}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.5 }}
          >
            <Link
              to={t.link}
              className="group flex flex-col justify-between p-8 md:p-10 bg-background hover:bg-secondary/40 transition-all duration-300 h-full min-h-[180px]"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="font-display text-xl md:text-2xl group-hover:text-gold transition-colors duration-300">{t.title}</h3>
                  {t.tag && (
                    <span className="font-body text-[8px] tracking-[0.2em] uppercase text-gold/70 border border-gold/20 px-2 py-0.5">
                      {t.tag}
                    </span>
                  )}
                </div>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{t.desc}</p>
              </div>
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/60">
                <span className="font-body text-sm text-foreground/70">From {t.from}</span>
                <ArrowRight size={14} className="text-muted-foreground/40 group-hover:text-gold group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TreatmentShowcase;
