import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star, Shield, Award, Clock, CheckCircle } from "lucide-react";
import Layout from "@/components/Layout";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";

const treatments = [
  { name: "Anti-Wrinkle Injections", desc: "Smooth forehead lines, frown lines, and crow's feet for a naturally refreshed look.", from: "£179" },
  { name: "Masseter Jaw Slimming", desc: "Slim and contour the jawline for a more defined, feminine shape.", from: "£240" },
  { name: "Brow Lift", desc: "Subtly elevate the brow for a more open, youthful eye area.", from: "£150" },
  { name: "Lip Flip", desc: "Enhance the upper lip shape without filler for a natural pout.", from: "£120" },
  { name: "Gummy Smile Correction", desc: "Reduce gum visibility when smiling for a more balanced look.", from: "£120" },
];

const faqs = [
  { q: "How long do anti-wrinkle injections last?", a: "Results typically last 3–4 months. With regular treatments, many clients find results last longer over time as muscles weaken." },
  { q: "Will I still be able to move my face?", a: "Absolutely. We use precise dosing to soften lines while preserving natural movement and expression. You'll look refreshed, never frozen." },
  { q: "How quickly will I see results?", a: "You'll start to notice results within 3–5 days, with full effect visible at around 2 weeks." },
  { q: "Is the treatment painful?", a: "Most clients describe it as a tiny pinch. The needles used are extremely fine, and the procedure takes just 10–15 minutes." },
  { q: "How much do anti-wrinkle injections cost?", a: "Anti-wrinkle treatments at Hive Clinic start from £120. A full consultation is included to discuss the best approach for your concerns." },
];

const AntiWrinkle = () => (
  <Layout>
    {/* Hero */}
    <section className="relative min-h-[80vh] flex items-center">
      <div className="absolute inset-0">
        <img src={gallery6} alt="Anti-wrinkle injections Manchester - Hive Clinic Deansgate" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-transparent" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-xl">
          <p className="font-body text-sm text-gold uppercase tracking-[0.2em] mb-4">Look Refreshed, Never Frozen</p>
          <h1 className="font-display text-5xl md:text-7xl text-white leading-[1.1] mb-6">
            Anti-Wrinkle Injections Manchester
          </h1>
          <p className="font-body text-lg text-white/80 mb-6">
            Precision anti-wrinkle treatments from £120. Soften lines and restore a naturally youthful appearance with a qualified prescriber at Hive Clinic, Deansgate.
          </p>
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-2"><Shield size={14} className="text-gold" /><span className="font-body text-sm text-white/70">Qualified Prescriber</span></div>
            <div className="flex items-center gap-2"><Award size={14} className="text-gold" /><span className="font-body text-sm text-white/70">5-Star Rated</span></div>
            <div className="flex items-center gap-2"><Clock size={14} className="text-gold" /><span className="font-body text-sm text-white/70">Results in 3–5 Days</span></div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/bookings?category=Anti-Wrinkle" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-body text-sm tracking-widest uppercase hover:bg-white/90 transition-colors">
              Book Free Consultation <ArrowRight size={14} />
            </Link>
            <a href="https://wa.me/447795008114" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/40 text-white font-body text-sm tracking-widest uppercase hover:border-white transition-colors">
              Message Us
            </a>
          </div>
        </motion.div>
      </div>
    </section>

    {/* Treatment Options */}
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-display text-4xl md:text-5xl text-center mb-4">Our Anti-Wrinkle Treatments</h2>
        <p className="font-body text-muted-foreground text-center mb-16 max-w-lg mx-auto">Every treatment is tailored to your unique facial anatomy for results that look effortlessly natural.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {treatments.map((t) => (
            <div key={t.name} className="border border-border p-8 hover:border-gold transition-colors group">
              <h3 className="font-display text-2xl mb-3 group-hover:text-gold transition-colors">{t.name}</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">{t.desc}</p>
              <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">From <span className="text-foreground font-display text-xl">{t.from}</span></p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Why Hive */}
    <section className="py-24 bg-secondary">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="aspect-[4/5] overflow-hidden">
            <img src={gallery3} alt="Anti-wrinkle treatment results at Hive Clinic" className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div>
            <h2 className="font-display text-4xl md:text-5xl mb-6">Why Clients Choose Hive</h2>
            <p className="font-body text-muted-foreground leading-relaxed mb-8">
              We take a conservative, anatomy-led approach. That means every injection is placed with precision to achieve the most natural result possible.
            </p>
            <div className="space-y-4">
              {["Qualified and insured prescriber", "Anatomy-led, conservative approach", "Premium products only", "Full consultation included", "No pressure, no upselling", "Aftercare support at every step"].map((b) => (
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

    {/* Reviews */}
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-display text-4xl md:text-5xl text-center mb-4">What Our Clients Say</h2>
        <p className="font-body text-muted-foreground text-center mb-16">Rated 5 stars across 100+ reviews</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Sarah T.", text: "I look 10 years younger but completely natural. Bianca is incredibly skilled and made me feel so comfortable." },
            { name: "Lauren H.", text: "The best anti-wrinkle treatment I've ever had. Subtle, precise, and exactly what I wanted." },
            { name: "Georgia L.", text: "I was worried about looking frozen but the results are so natural. Everyone just says I look well-rested." },
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

    {/* Results */}
    <section className="py-24 bg-secondary">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="font-display text-4xl md:text-5xl mb-4">Real Results</h2>
        <p className="font-body text-muted-foreground mb-12">Subtle, natural, and refreshed.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[gallery3, gallery5, gallery6].map((img, i) => (
            <div key={i} className="aspect-square overflow-hidden">
              <img src={img} alt={`Anti-wrinkle result ${i + 1} at Hive Clinic Manchester`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* FAQ */}
    <section className="py-24">
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

    {/* Final CTA */}
    <section className="py-24 bg-secondary">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="font-display text-4xl md:text-5xl mb-4">Turn Back the Clock</h2>
        <p className="font-body text-muted-foreground mb-8">Book a free, no-obligation consultation to discuss your goals with our expert prescriber.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/bookings?category=Anti-Wrinkle" className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-accent transition-colors">
            Book Free Consultation <ArrowRight size={14} />
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

export default AntiWrinkle;
