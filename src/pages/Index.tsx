import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star, Shield, Award, Clock } from "lucide-react";
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
  { title: "Chemical Peels", desc: "Targeted peels for face, back, and body to transform skin tone and texture.", link: "/treatments/chemical-peels-manchester" },
  { title: "HydraFacial", desc: "Deep cleansing facials for glass-like, refreshed skin.", link: "/treatments/hydrafacial-manchester" },
  { title: "Dermal Filler", desc: "Expert lip, cheek, jawline, and facial balancing treatments.", link: "/treatments/dermal-filler-manchester" },
  { title: "Anti-Wrinkle", desc: "Precision injections for a naturally refreshed appearance.", link: "/treatments/anti-wrinkle-injections-manchester" },
  { title: "Skin Boosters", desc: "Deep hydration for luminous, glass-like skin.", link: "/treatments/skin-boosters-manchester" },
];

const reviews = [
  { name: "Aisha M.", text: "Absolutely the best clinic in Manchester. Bianca is incredible - my skin has never looked better.", stars: 5 },
  { name: "Georgia L.", text: "The attention to detail is unreal. I felt so comfortable and the results were beyond what I expected.", stars: 5 },
  { name: "Priya K.", text: "Finally found somewhere that actually listens. Subtle, natural results every time.", stars: 5 },
  { name: "Sophie R.", text: "Had my lip filler done here and I'm obsessed. So natural, nobody can tell it's filler. Already booked my next appointment.", stars: 5 },
  { name: "Lauren T.", text: "Bianca explained everything so clearly before my anti-wrinkle treatment. Zero pressure, amazing results. Highly recommend.", stars: 5 },
  { name: "Hannah B.", text: "The clinic is gorgeous and spotlessly clean. My HydraFacial left my skin glowing for days. Will be back monthly.", stars: 5 },
];

const trustPoints = [
  { icon: Shield, text: "Qualified & Insured Prescriber" },
  { icon: Award, text: "5-Star Rated on Google" },
  { icon: Clock, text: "Same-Week Appointments Available" },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="absolute inset-0">
          <img src={gallery6} alt="Hive Clinic - Premium Aesthetics Manchester" className="w-full h-full object-cover" />
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
              Manchester's most trusted aesthetics clinic.
            </h1>
            <p className="font-body text-lg text-white/80 mb-4">
              Expert lip fillers, anti-wrinkle injections, and skin treatments in Deansgate. Results you'll love - guaranteed.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              {trustPoints.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2">
                  <Icon size={14} className="text-gold" />
                  <span className="font-body text-sm text-white/70">{text}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/bookings"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-body text-sm tracking-widest uppercase hover:bg-white/90 transition-colors"
              >
                Book Free Consultation <ArrowRight size={14} />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/40 text-white font-body text-sm tracking-widest uppercase hover:border-white transition-colors"
              >
                View Prices
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="py-8 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center gap-8">
          <p className="font-body text-sm text-muted-foreground tracking-wider uppercase">Pay with</p>
          <img src={klarnaLogo} alt="Klarna - pay later" className="h-8" />
          <img src={clearpayLogo} alt="Clearpay - pay in instalments" className="h-8" />
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
            <h2 className="font-display text-4xl md:text-5xl mb-4">Our Treatments</h2>
            <p className="font-body text-muted-foreground max-w-lg mx-auto">
              From subtle enhancements to full facial transformations - every treatment is tailored to you.
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
              >
                <Link
                  to={h.link}
                  className="block p-6 border border-border hover:border-gold transition-colors group h-full"
                >
                  <h3 className="font-display text-xl mb-3 group-hover:text-gold transition-colors">{h.title}</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{h.desc}</p>
                  <span className="inline-flex items-center gap-1 mt-4 font-body text-xs text-gold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more <ArrowRight size={12} />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Before/After Gallery */}
      <section className="py-24 bg-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl mb-4">Real Results, Real Clients</h2>
            <p className="font-body text-muted-foreground">See the transformations for yourself.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[gallery1, gallery2, gallery3, gallery4, gallery5, gallery6].map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="aspect-square overflow-hidden group"
              >
                <img
                  src={img}
                  alt={`Hive Clinic treatment result ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/results"
              className="inline-flex items-center gap-2 font-body text-sm tracking-widest uppercase text-gold hover:text-foreground transition-colors"
            >
              View All Results <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Treatment Helper */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl mb-4">Not Sure Where to Start?</h2>
            <p className="font-body text-muted-foreground">Answer 4 quick questions and we'll recommend the perfect treatment for you.</p>
          </div>
          <TreatmentHelper />
        </div>
      </section>

      {/* Reviews */}
      <section className="py-24 bg-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-display text-4xl md:text-5xl text-center mb-4">What Our Clients Say</h2>
          <p className="font-body text-muted-foreground text-center mb-16">Rated 5 stars across 100+ reviews</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((r) => (
              <div key={r.name} className="p-8 border border-border bg-background">
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

      {/* Final CTA */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl md:text-5xl mb-4">Ready to Start Your Journey?</h2>
            <p className="font-body text-muted-foreground mb-8 max-w-lg mx-auto">
              Book a free, no-obligation consultation with Bianca. We'll create a personalised treatment plan tailored to your goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/bookings"
                className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-accent transition-colors"
              >
                Book Free Consultation <ArrowRight size={14} />
              </Link>
              <a
                href="https://wa.me/447795008114"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-10 py-4 border border-border font-body text-sm tracking-widest uppercase hover:border-gold transition-colors"
              >
                Message Us on WhatsApp
              </a>
            </div>
            <p className="font-body text-xs text-muted-foreground mt-6">
              25 Saint John Street, Manchester M3 4DT - Tue, Thu-Sat
            </p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
