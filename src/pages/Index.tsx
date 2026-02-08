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
import klarnaLogo from "@/assets/klarna-logo.png";
import clearpayLogo from "@/assets/clearpay-logo.png";

const highlights = [
  { title: "Chemical Peels", desc: "Targeted peels for face, back, and body to transform skin tone and texture." },
  { title: "HydraFacial", desc: "Deep cleansing facials for glass-like, refreshed skin." },
  { title: "Dermal Filler", desc: "Expert lip, cheek, jawline, and facial balancing treatments." },
  { title: "Anti-Wrinkle", desc: "Precision injections for a naturally refreshed appearance." },
  { title: "Skin Boosters", desc: "Deep hydration for luminous, glass-like skin." },
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
          <img src={klarnaLogo} alt="Klarna" className="h-8" />
          <img src={clearpayLogo} alt="Clearpay" className="h-8" />
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
          <p className="font-body text-muted-foreground text-center mb-12">
            <a href="https://instagram.com/hiveclinicuk" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">
              @hiveclinicuk
            </a>
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {[gallery1, gallery2, gallery3, gallery4, gallery5, gallery6].map((img, i) => (
              <a
                key={i}
                href="https://instagram.com/hiveclinicuk"
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-square overflow-hidden group relative"
              >
                <img
                  src={img}
                  alt={`Hive Clinic gallery ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
