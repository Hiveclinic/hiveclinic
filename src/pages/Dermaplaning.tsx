import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Award, Clock, CheckCircle } from "lucide-react";
import Layout from "@/components/Layout";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery3 from "@/assets/gallery-3.jpg";

const faqs = [
  { q: "What is dermaplaning?", a: "Dermaplaning is a gentle exfoliation treatment that uses a sterile surgical blade to remove dead skin cells and vellus hair (peach fuzz) from the face, leaving skin instantly smoother and brighter." },
  { q: "Does dermaplaning hurt?", a: "Not at all. The treatment is painless and feels like a gentle brushing sensation across the skin. Most clients find it very relaxing." },
  { q: "Will the hair grow back thicker?", a: "No — this is a common myth. Vellus hair grows back at the same rate and texture. It will not become coarser or darker." },
  { q: "How often should I have dermaplaning?", a: "Every 3-4 weeks is ideal, in line with your skin's natural renewal cycle. It's also an excellent pre-event treatment." },
  { q: "Can I combine dermaplaning with other treatments?", a: "Absolutely. Dermaplaning pairs beautifully with chemical peels and hydration facials for enhanced product penetration and results." },
];

const Dermaplaning = () => (
  <Layout>
    <section className="relative min-h-[70vh] flex items-center">
      <div className="absolute inset-0">
        <img src={gallery3} alt="Dermaplaning treatment Manchester" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-transparent" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-xl">
          <p className="font-body text-sm text-gold uppercase tracking-[0.2em] mb-4">Skin Refinement</p>
          <h1 className="font-display text-5xl md:text-7xl text-white leading-[1.1] mb-6">Dermaplaning Manchester</h1>
          <p className="font-body text-lg text-white/80 mb-6">Instant smoothness and glow. Remove dead skin and peach fuzz for a flawless, radiant complexion.</p>
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-2"><Shield size={14} strokeWidth={1.5} className="text-gold" /><span className="font-body text-sm text-white/70">Sterile Technique</span></div>
            <div className="flex items-center gap-2"><Award size={14} strokeWidth={1.5} className="text-gold" /><span className="font-body text-sm text-white/70">5-Star Rated</span></div>
            <div className="flex items-center gap-2"><Clock size={14} strokeWidth={1.5} className="text-gold" /><span className="font-body text-sm text-white/70">30 Min Treatment</span></div>
          </div>
          <Link to="/bookings?category=Dermaplaning" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-body text-sm tracking-widest uppercase hover:bg-white/90 transition-colors">
            Book Now <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>

    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-display text-4xl md:text-5xl mb-6">Smooth, Glowing Skin in Minutes</h2>
            <p className="font-body text-muted-foreground leading-relaxed mb-8">Dermaplaning is one of our most-loved treatments for instant results. By gently removing the outermost layer of dead skin cells and fine facial hair, your skin immediately looks brighter, feels smoother, and absorbs products more effectively.</p>
            <div className="space-y-4 mb-8">
              {["Removes dead skin and vellus hair", "Instant glow and smoothness", "Perfect pre-event treatment", "Enhanced product absorption", "Zero downtime"].map(b => (
                <div key={b} className="flex items-center gap-3"><CheckCircle size={14} strokeWidth={1.5} className="text-gold flex-shrink-0" /><span className="font-body text-sm">{b}</span></div>
              ))}
            </div>
            <div className="border border-border p-6">
              <p className="font-body text-sm text-muted-foreground uppercase tracking-wider mb-2">Pricing</p>
              <p className="font-display text-3xl">£75 <span className="text-lg text-muted-foreground">Skin Polish</span></p>
              <p className="font-display text-xl mt-2">£115 <span className="text-lg text-muted-foreground">+ Hydration Facial</span></p>
            </div>
          </div>
          <div className="aspect-[4/5] overflow-hidden"><img src={gallery1} alt="Dermaplaning results" className="w-full h-full object-cover" loading="lazy" /></div>
        </div>
      </div>
    </section>

    <section className="py-24 bg-secondary">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="font-display text-4xl md:text-5xl text-center mb-16">Frequently Asked Questions</h2>
        <div className="space-y-8">
          {faqs.map(faq => (
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
        <h2 className="font-display text-4xl md:text-5xl mb-4">Ready for Radiant Skin?</h2>
        <p className="font-body text-muted-foreground mb-8">Book your dermaplaning treatment today.</p>
        <Link to="/bookings?category=Dermaplaning" className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-accent transition-colors">
          Book Now <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  </Layout>
);

export default Dermaplaning;
