import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star, Shield, Award, CheckCircle } from "lucide-react";
import Layout from "@/components/Layout";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";

const treatments = [
  { name: "Lumi Eyes", desc: "Brighten and rejuvenate the under-eye area with this specialist polynucleotide treatment.", price: "£140" },
  { name: "Seventy Hyal", desc: "Deep hydration booster for plumper, dewy skin with long-lasting moisture retention.", price: "£160" },
  { name: "Polynucleotides", desc: "Bio-stimulating injections that regenerate skin cells and improve elasticity from within.", price: "£180" },
  { name: "Injectable Skin Remodelling", desc: "The gold standard in skin remodelling - stimulates collagen and elastin for total skin rejuvenation.", price: "£250" },
];

const faqs = [
  { q: "What are skin boosters?", a: "Skin boosters are injectable treatments that deliver deep hydration beneath the skin's surface. Unlike fillers, they don't add volume - they improve overall skin quality, texture, and radiance." },
  { q: "What is the difference between skin remodelling and fillers?", a: "Skin remodelling treatments disperse across a wide area to stimulate collagen and elastin. Fillers add volume to specific areas. Many clients benefit from both." },
  { q: "How many sessions do I need?", a: "Most skin boosters require 2 sessions 4 weeks apart for optimal results. Our injectable remodelling treatment is typically 2 sessions, with maintenance every 6 months." },
  { q: "When will I see results?", a: "You may notice improved hydration immediately, but the full collagen-stimulating effects develop over 4-8 weeks as your skin regenerates from within." },
  { q: "How much do skin boosters cost in Manchester?", a: "Skin boosters at Hive Clinic start from £140 for Lumi Eyes. Our injectable skin remodelling treatment, our most popular skin booster, is £250 per session." },
];

const SkinBoosters = () => (
  <Layout>
    <section className="relative min-h-[80vh] flex items-center">
      <div className="absolute inset-0">
        <img src={gallery1} alt="Skin booster treatment Manchester - Profhilo at Hive Clinic" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-transparent" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-xl">
          <p className="font-body text-sm text-gold uppercase tracking-[0.2em] mb-4">Glow From Within</p>
          <h1 className="font-display text-5xl md:text-7xl text-white leading-[1.1] mb-6">Skin Boosters Manchester</h1>
          <p className="font-body text-lg text-white/80 mb-6">
            Profhilo, polynucleotides, and advanced skin boosters from £140. Deep hydration and collagen stimulation at Hive Clinic, Deansgate.
          </p>
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-2"><Shield size={14} className="text-gold" /><span className="font-body text-sm text-white/70">Bio-Stimulating Technology</span></div>
            <div className="flex items-center gap-2"><Award size={14} className="text-gold" /><span className="font-body text-sm text-white/70">5-Star Rated</span></div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/bookings" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-body text-sm tracking-widest uppercase hover:bg-white/90 transition-colors">
              Book Now <ArrowRight size={14} />
            </Link>
            <a href="https://wa.me/447795008114" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/40 text-white font-body text-sm tracking-widest uppercase hover:border-white transition-colors">
              Message Us
            </a>
          </div>
        </motion.div>
      </div>
    </section>

    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-display text-4xl md:text-5xl text-center mb-4">Our Skin Booster Treatments</h2>
        <p className="font-body text-muted-foreground text-center mb-16 max-w-lg mx-auto">Advanced injectable hydration that works beneath the surface for lasting radiance.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {treatments.map((t) => (
            <div key={t.name} className="border border-border p-8 hover:border-gold transition-colors group">
              <h3 className="font-display text-2xl mb-3 group-hover:text-gold transition-colors">{t.name}</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">{t.desc}</p>
              <p className="font-display text-3xl">{t.price}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-24 bg-secondary">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="aspect-[4/5] overflow-hidden">
            <img src={gallery2} alt="Profhilo skin booster results Manchester" className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div>
            <h2 className="font-display text-4xl md:text-5xl mb-6">Why Skin Boosters at Hive</h2>
            <p className="font-body text-muted-foreground leading-relaxed mb-8">
              Skin boosters are the secret to that effortless, lit-from-within glow. They work by stimulating your skin's own regeneration processes for results that look completely natural.
            </p>
            <div className="space-y-4">
              {["Bio-stimulating collagen production", "Deep hydration that lasts months", "Improves skin laxity and elasticity", "Suitable for face, neck, and hands", "Minimal downtime", "Pairs beautifully with other treatments"].map((b) => (
                <div key={b} className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-gold flex-shrink-0" />
                  <span className="font-body text-sm">{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-display text-4xl md:text-5xl text-center mb-4">What Our Clients Say</h2>
        <p className="font-body text-muted-foreground text-center mb-16">Rated 5 stars across 100+ reviews</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Hannah L.", text: "Profhilo has genuinely changed my skin. It looks plumper, dewier, and I've had so many compliments." },
            { name: "Nina P.", text: "The Lumi Eyes treatment is incredible. My under-eyes look so much brighter and less tired. Worth every penny." },
            { name: "Zara M.", text: "I've tried skin boosters elsewhere but Bianca's technique is on another level. The results are so natural." },
          ].map((r) => (
            <div key={r.name} className="p-8 border border-border bg-background">
              <div className="flex gap-1 mb-4">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} className="fill-gold text-gold" />)}</div>
              <p className="font-body text-foreground/80 mb-6 leading-relaxed italic">"{r.text}"</p>
              <p className="font-body text-sm tracking-wider uppercase text-muted-foreground">{r.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-24 bg-secondary">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="font-display text-4xl md:text-5xl text-center mb-16">Frequently Asked Questions</h2>
        <div className="space-y-8">
          {faqs.map((faq) => (
            <div key={faq.q} className="border-b border-border pb-8">
              <h3 className="font-display text-xl mb-3">{faq.q}</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-24">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="font-display text-4xl md:text-5xl mb-4">Ready to Glow?</h2>
        <p className="font-body text-muted-foreground mb-8">Book a consultation to discover the perfect skin booster for your goals.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/bookings" className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-accent transition-colors">
            Book Now <ArrowRight size={14} />
          </Link>
          <a href="https://wa.me/447795008114" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-10 py-4 border border-border font-body text-sm tracking-widest uppercase hover:border-gold transition-colors">
            Message Us on WhatsApp
          </a>
        </div>
        <p className="font-body text-xs text-muted-foreground mt-6">25 Saint John Street, Manchester M3 4DT</p>
      </div>
    </section>
  </Layout>
);

export default SkinBoosters;
