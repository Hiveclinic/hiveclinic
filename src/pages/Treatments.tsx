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
    title: "Chemical Peels",
    desc: "Targeted chemical peels for face, back, and body - including intimate and body brightening treatments for even skin tone.",
    img: gallery4,
    link: "/treatments/chemical-peels-manchester",
    treatments: ["Level 1 Chemical Peel", "Level 2 Chemical Peel", "Intimate Peels", "Body Brightening Treatments"],
  },
  {
    title: "HydraFacial",
    desc: "Deep cleansing, hydrating facials designed to deliver glass-like skin, tackle acne, and reset your glow.",
    img: gallery3,
    link: "/treatments/hydrafacial-manchester",
    treatments: ["Glass Skin Boost", "Acne Refresh", "Glow Reset"],
  },
  {
    title: "Microneedling",
    desc: "Advanced microneedling with chemical peel for texture repair, scarring, pores, and stretch marks.",
    img: gallery5,
    link: "/treatments/microneedling-manchester",
    treatments: ["Face Texture Repair", "Stretch Mark Repair"],
  },
  {
    title: "Fat Dissolve",
    desc: "Non-surgical fat reduction for chin, jawline, abdomen, flanks, arms, and more.",
    img: gallery6,
    link: "/treatments/fat-dissolving-manchester",
    treatments: ["Small Area", "Medium Area", "Large Area"],
  },
  {
    title: "Skin Boosters",
    desc: "Injectable moisturisers that work beneath the skin's surface to restore hydration and create a natural glow.",
    img: gallery1,
    link: "/treatments/skin-boosters-manchester",
    treatments: ["Lumi Eyes", "Seventy Hyal", "Polynucleotides", "Injectable Skin Remodelling"],
  },
  {
    title: "Dermal Filler",
    desc: "Expert filler treatments for lips, cheeks, jawline, chin, nose, tear troughs, and facial balancing packages.",
    img: gallery4,
    link: "/treatments/dermal-filler-manchester",
    treatments: ["Lip Filler", "Cheek Filler", "Jawline Filler", "Nose Filler", "Tear Trough Filler", "Facial Balancing"],
  },
  {
    title: "Anti-Wrinkle",
    desc: "Precision anti-wrinkle injections including masseter slimming, brow lift, lip flip, and gummy smile correction.",
    img: gallery3,
    link: "/treatments/anti-wrinkle-injections-manchester",
    treatments: ["Anti Wrinkle Injections", "Masseter Jaw Slimming", "Lip Flip", "Brow Lift", "Gummy Smile Correction"],
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
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`}
            >
              <div className={i % 2 !== 0 ? "lg:order-2" : ""}>
                <Link to={cat.link} className="block aspect-[4/5] overflow-hidden group">
                  <img src={cat.img} alt={`${cat.title} treatment in Manchester`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </Link>
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
                <div className="flex gap-4">
                  <Link
                    to={cat.link}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-accent transition-colors"
                  >
                    Learn More
                  </Link>
                  <Link
                    to="/bookings"
                    className="inline-flex items-center gap-2 px-8 py-3 border border-border font-body text-sm tracking-widest uppercase hover:border-gold transition-colors"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default Treatments;
