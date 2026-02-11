import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Award, Clock, CheckCircle } from "lucide-react";
import Layout from "@/components/Layout";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery4 from "@/assets/gallery-4.jpg";

const faqs = [
  { q: "What is mesotherapy?", a: "Mesotherapy involves micro-injections of vitamins, hyaluronic acid, and peptides directly into the skin to nourish, hydrate, and rejuvenate from within." },
  { q: "Does mesotherapy hurt?", a: "Discomfort is minimal. We use very fine needles and topical numbing cream is applied beforehand for comfort." },
  { q: "How many sessions are recommended?", a: "A course of 3-6 sessions spaced 2-4 weeks apart is typically recommended for optimal results. Maintenance sessions can follow." },
  { q: "What areas can be treated?", a: "We offer mesotherapy for the face (hydration and brightening), under eye (dark circles and crepiness), and scalp (hair thinning support)." },
];

const Mesotherapy = () => (
  <Layout>
    <section className="relative min-h-[70vh] flex items-center">
      <div className="absolute inset-0">
        <img src={gallery4} alt="Mesotherapy treatment Manchester" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-transparent" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-xl">
          <p className="font-body text-sm text-gold uppercase tracking-[0.2em] mb-4">Skin Rejuvenation</p>
          <h1 className="font-display text-5xl md:text-7xl text-white leading-[1.1] mb-6">Mesotherapy Manchester</h1>
          <p className="font-body text-lg text-white/80 mb-6">Deep nourishment and hydration delivered directly where your skin needs it most.</p>
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-2"><Shield size={14} strokeWidth={1.5} className="text-gold" /><span className="font-body text-sm text-white/70">Vitamin Infusion</span></div>
            <div className="flex items-center gap-2"><Award size={14} strokeWidth={1.5} className="text-gold" /><span className="font-body text-sm text-white/70">Face, Eye & Scalp</span></div>
            <div className="flex items-center gap-2"><Clock size={14} strokeWidth={1.5} className="text-gold" /><span className="font-body text-sm text-white/70">45 Min Treatment</span></div>
          </div>
          <Link to="/bookings" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-body text-sm tracking-widest uppercase hover:bg-white/90 transition-colors">Book Now <ArrowRight size={14} /></Link>
        </motion.div>
      </div>
    </section>

    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="font-display text-4xl md:text-5xl mb-6">Feed Your Skin From Within</h2>
          <p className="font-body text-muted-foreground leading-relaxed mb-8">Mesotherapy delivers a tailored cocktail of vitamins, minerals, and hyaluronic acid directly into the mesoderm — the layer of skin where cellular renewal happens. The result is deeply hydrated, luminous, and healthier-looking skin.</p>
          <div className="space-y-4 mb-8">
            {["Face hydration & brightening", "Under eye rejuvenation", "Scalp — hair support therapy", "Customised vitamin cocktails", "Course discounts available"].map(b => (
              <div key={b} className="flex items-center gap-3"><CheckCircle size={14} strokeWidth={1.5} className="text-gold flex-shrink-0" /><span className="font-body text-sm">{b}</span></div>
            ))}
          </div>
          <div className="border border-border p-6">
            <p className="font-body text-sm text-muted-foreground uppercase tracking-wider mb-2">Pricing</p>
            <p className="font-display text-2xl">Face / Under Eye — £155</p>
            <p className="font-display text-2xl mt-1">Scalp — £210</p>
            <p className="font-body text-xs text-muted-foreground mt-2">Course of 3: 10% saving · Course of 6: 15% saving</p>
          </div>
        </div>
        <div className="aspect-[4/5] overflow-hidden"><img src={gallery1} alt="Mesotherapy results" className="w-full h-full object-cover" loading="lazy" /></div>
      </div>
    </section>

    <section className="py-24 bg-secondary">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="font-display text-4xl md:text-5xl text-center mb-16">Frequently Asked Questions</h2>
        <div className="space-y-8">{faqs.map(faq => (<div key={faq.q} className="border-b border-border pb-8"><h3 className="font-display text-xl mb-3">{faq.q}</h3><p className="font-body text-sm text-muted-foreground leading-relaxed">{faq.a}</p></div>))}</div>
      </div>
    </section>

    <section className="py-24">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="font-display text-4xl md:text-5xl mb-4">Nourish Your Skin Today</h2>
        <p className="font-body text-muted-foreground mb-8">Book a mesotherapy consultation or treatment.</p>
        <Link to="/bookings" className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-accent transition-colors">Book Now <ArrowRight size={14} /></Link>
      </div>
    </section>
  </Layout>
);

export default Mesotherapy;
