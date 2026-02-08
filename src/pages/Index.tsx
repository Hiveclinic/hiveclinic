import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import Layout from "@/components/Layout";
import TreatmentHelper from "@/components/TreatmentHelper";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";

const highlights = [
  { title: "Skin Rituals", desc: "Bespoke facials designed to deeply nourish and transform." },
  { title: "Enhancements", desc: "Dermal fillers & anti-wrinkle treatments for subtle refinement." },
  { title: "Skin Boosters", desc: "Deep hydration for luminous, glass-like skin." },
  { title: "Vitamin Boosts", desc: "IV drips & boosters for radiance from within." },
  { title: "Corrective Care", desc: "Advanced solutions for scarring, pigmentation & texture." },
];

const reviews = [
  { name: "Aisha M.", text: "Absolutely the best clinic in Manchester. Bianca is incredible - my skin has never looked better.", stars: 5 },
  { name: "Georgia L.", text: "The attention to detail is unreal. I felt so comfortable and the results were beyond what I expected.", stars: 5 },
  { name: "Priya K.", text: "Finally found somewhere that actually listens. Subtle, natural results every time.", stars: 5 },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="absolute inset-0">
          <img src={gallery6} alt="Hive Clinic" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            <h1 className="font-display text-5xl md:text-7xl text-white leading-[1.1] mb-6">
              A new standard in injectables.
            </h1>
            <p className="font-body text-lg text-white/80 mb-8">
              Curated for the quietly confident.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/bookings"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-body text-sm tracking-widest uppercase hover:bg-white/90 transition-colors"
              >
                Book Now <ArrowRight size={14} />
              </Link>
              <Link
                to="/treatments"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/40 text-white font-body text-sm tracking-widest uppercase hover:border-white transition-colors"
              >
                Explore Treatments
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="py-8 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center gap-8">
          <p className="font-body text-sm text-muted-foreground tracking-wider uppercase">Pay with</p>
          <div className="w-20 h-8 bg-muted flex items-center justify-center font-body text-xs text-muted-foreground">Klarna</div>
          <div className="w-20 h-8 bg-muted flex items-center justify-center font-body text-xs text-muted-foreground">Clearpay</div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl mb-4">Our Expertise</h2>
            <p className="font-body text-muted-foreground max-w-lg mx-auto">
              Every treatment at Hive is tailored to enhance your natural beauty with precision and care.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {highlights.map((h, i) => (
              <motion.div
                key={h.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 border border-border hover:border-gold transition-colors group"
              >
                <h3 className="font-display text-xl mb-3 group-hover:text-gold transition-colors">{h.title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{h.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Treatment Helper */}
      <section className="py-24 bg-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl mb-4">Not Sure Where to Start?</h2>
            <p className="font-body text-muted-foreground">Take our quick quiz to find your perfect treatment.</p>
          </div>
          <TreatmentHelper />
        </div>
      </section>

      {/* Reviews */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-display text-4xl md:text-5xl text-center mb-16">What Our Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((r) => (
              <div key={r.name} className="p-8 border border-border">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: r.stars }).map((_, i) => (
                    <Star key={i} size={14} className="fill-gold text-gold" />
                  ))}
                </div>
                <p className="font-body text-foreground/80 mb-6 leading-relaxed italic">"{r.text}"</p>
                <p className="font-body text-sm tracking-wider uppercase text-muted-foreground">{r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram */}
      <section className="py-24 bg-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-display text-4xl text-center mb-4">Follow the Glow</h2>
          <p className="font-body text-muted-foreground text-center mb-12">@hiveclinicuk</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {[gallery1, gallery2, gallery3, gallery4, gallery5, gallery6].map((img, i) => (
              <a
                key={i}
                href="https://instagram.com/hiveclinicuk"
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-square overflow-hidden group"
              >
                <img
                  src={img}
                  alt={`Hive Clinic gallery ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </a>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
