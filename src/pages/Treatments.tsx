import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";

const categories = [
  {
    title: "Skin Rituals",
    desc: "Luxury facials, chemical peels, and bespoke skin treatments designed to deeply cleanse, hydrate, and rejuvenate.",
    img: gallery4,
    treatments: ["Signature Facial", "Chemical Peel", "HydraFacial", "LED Light Therapy"],
  },
  {
    title: "Enhancements",
    desc: "Expert injectable treatments including lip filler, cheek filler, jawline contouring, and anti-wrinkle injections.",
    img: gallery3,
    treatments: ["Lip Filler", "Cheek Filler", "Jawline Filler", "Anti-Wrinkle Treatment", "Chin Filler"],
  },
  {
    title: "Skin Boosters",
    desc: "Injectable moisturisers that work beneath the skin's surface to restore hydration and create a natural glow.",
    img: gallery5,
    treatments: ["Profhilo", "Skinvive", "Polynucleotides"],
  },
  {
    title: "Vitamin Boosts",
    desc: "IV drips and intramuscular vitamin injections to boost energy, immunity, and skin health from within.",
    img: gallery6,
    treatments: ["Vitamin B12 Shot", "Glow Drip", "Immunity Drip", "Energy Drip"],
  },
  {
    title: "Corrective Care",
    desc: "Advanced treatments targeting acne scarring, pigmentation, enlarged pores, and uneven skin texture.",
    img: gallery1,
    treatments: ["Microneedling", "PRP Facial", "Laser Treatment", "Scar Revision"],
  },
];

const Treatments = () => (
  <Layout>
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-20">
          <h1 className="font-display text-5xl md:text-6xl mb-4">Our Treatments</h1>
          <p className="font-body text-muted-foreground max-w-lg mx-auto">
            Every treatment is tailored to you. Prescriber consultation required for toxin-based treatments.
          </p>
        </motion.div>

        <div className="space-y-24">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${i % 2 !== 0 ? "lg:direction-rtl" : ""}`}
            >
              <div className={i % 2 !== 0 ? "lg:order-2" : ""}>
                <div className="aspect-[4/5] overflow-hidden">
                  <img src={cat.img} alt={cat.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
              </div>
              <div className={i % 2 !== 0 ? "lg:order-1" : ""}>
                <h2 className="font-display text-4xl mb-4">{cat.title}</h2>
                <p className="font-body text-muted-foreground mb-8 leading-relaxed">{cat.desc}</p>
                <ul className="space-y-3 mb-8">
                  {cat.treatments.map((t) => (
                    <li key={t} className="font-body text-sm flex items-center gap-3">
                      <span className="w-1.5 h-1.5 bg-gold rounded-full flex-shrink-0" />
                      {t}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/bookings"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-accent transition-colors"
                >
                  Book Now
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default Treatments;
