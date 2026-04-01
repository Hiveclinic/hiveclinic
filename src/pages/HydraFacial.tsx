import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star, Shield, Award, Clock, CheckCircle } from "lucide-react";
import Layout from "@/components/Layout";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useSiteImage } from "@/hooks/use-site-image";
import { STOCK } from "@/lib/stock-images";

const treatments = [
  { name: "Glass Skin Boost", desc: "Deep cleansing and intense hydration for a luminous, glass-like finish.", price: "£140" },
  { name: "Acne Refresh", desc: "Targeted extraction and purification to clear congested, breakout-prone skin.", price: "£130" },
  { name: "Glow Reset", desc: "A full skin reset - perfect for dull, tired, or dehydrated complexions.", price: "£120" },
];

const faqs = [
  { q: "What is a HydraFacial?", a: "A HydraFacial is a multi-step facial treatment that combines cleansing, exfoliation, extraction, and hydration using patented technology. It delivers instant, visible results with no downtime." },
  { q: "Is a HydraFacial suitable for all skin types?", a: "Yes. HydraFacials are gentle enough for sensitive skin yet effective enough for oily, acne-prone, or mature skin. Your practitioner will customise the treatment to your specific needs." },
  { q: "How often should I get a HydraFacial?", a: "For optimal results, we recommend a HydraFacial every 4-6 weeks. Many clients book monthly as part of their ongoing skincare routine." },
  { q: "Is there any downtime?", a: "None at all. You can return to your normal routine immediately. Most clients apply makeup and go straight back to work or socialising." },
  { q: "How much does a HydraFacial cost in Manchester?", a: "HydraFacials at Hive Clinic start from £120. Each treatment is tailored to your skin's needs and includes a full consultation." },
];

const HydraFacial = () => {
  usePageMeta(
    "Hydrafacial Manchester City Centre | Hive Clinic",
    "Deep cleansing Hydrafacial treatments from £120 at Hive Clinic, Manchester City Centre. Achieve glass-like radiant skin with zero downtime. Book today."
  );
  const heroImg = useSiteImage("hydrafacial_hero", STOCK.hydrafacial_hero);
  const secondaryImg = useSiteImage("hydrafacial_secondary", STOCK.hydrafacial_secondary);

  return (
  <Layout>
    <section className="relative min-h-[80vh] flex items-center">
      <div className="absolute inset-0">
        <img src={heroImg} alt="HydraFacial treatment Manchester - glass skin at Hive Clinic" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-transparent" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-xl">
          <p className="font-body text-sm text-gold uppercase tracking-[0.2em] mb-4">The Ultimate Skin Reset</p>
          <h1 className="font-display text-5xl md:text-7xl text-white leading-[1.1] mb-6">HydraFacial Manchester</h1>
          <p className="font-body text-lg text-white/80 mb-6">
            Deep cleansing, hydrating facials from £120. Achieve glass-like, radiant skin with zero downtime at Hive Clinic, Deansgate.
          </p>
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-2"><Shield size={14} className="text-gold" /><span className="font-body text-sm text-white/70">Clinical-Grade Products</span></div>
            <div className="flex items-center gap-2"><Award size={14} className="text-gold" /><span className="font-body text-sm text-white/70">5-Star Rated</span></div>
            <div className="flex items-center gap-2"><Clock size={14} className="text-gold" /><span className="font-body text-sm text-white/70">Zero Downtime</span></div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
                href="https://hiveclinicuk.setmore.com/book?products=1b7e4418-5f0a-452a-96b2-11fe4e558825&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-body text-sm tracking-widest uppercase hover:bg-white/90 transition-colors">
                Book Now <ArrowRight size={14} />
              </a>
            <a href="https://wa.me/447795008114" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/40 text-white font-body text-sm tracking-widest uppercase hover:border-white transition-colors">
              Message Us
            </a>
          </div>
        </motion.div>
      </div>
    </section>

    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-display text-4xl md:text-5xl text-center mb-4">Our HydraFacial Treatments</h2>
        <p className="font-body text-muted-foreground text-center mb-16 max-w-lg mx-auto">Every facial is tailored to your skin type and concerns for maximum results.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <img src={secondaryImg} alt="HydraFacial results at Hive Clinic Manchester" className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div>
            <h2 className="font-display text-4xl md:text-5xl mb-6">Why HydraFacial at Hive</h2>
            <p className="font-body text-muted-foreground leading-relaxed mb-8">
              Unlike traditional facials, the HydraFacial uses patented vortex technology to cleanse, extract, and hydrate simultaneously. The result is visibly brighter, clearer, and more hydrated skin from your very first session.
            </p>
            <div className="space-y-4">
              {["Suitable for all skin types", "Immediate, visible results", "Zero downtime - return to your day", "Targets acne, pigmentation, and fine lines", "Pairs perfectly with in-clinic treatments", "Clinical-grade serums and hydration"].map((b) => (
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
            { name: "Jade W.", text: "My skin has never looked this good. The Glass Skin Boost is absolutely worth it - I'm glowing for days after." },
            { name: "Rebecca S.", text: "I get a HydraFacial every month now. It's become my non-negotiable skincare ritual. Bianca is amazing." },
            { name: "Priya K.", text: "I had the Acne Refresh and my skin cleared up so much after just one session. Can't recommend enough." },
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

    {/* Related Treatments */}
    <section className="py-16 border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <h3 className="font-display text-2xl text-center mb-8">Related Treatments</h3>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/treatments/chemical-peels-manchester" className="px-6 py-3 border border-border hover:border-gold transition-colors font-body text-sm tracking-wider">Chemical Peels</Link>
          <Link to="/treatments/dermaplaning-manchester" className="px-6 py-3 border border-border hover:border-gold transition-colors font-body text-sm tracking-wider">Dermaplaning</Link>
          <Link to="/treatments/led-light-therapy-manchester" className="px-6 py-3 border border-border hover:border-gold transition-colors font-body text-sm tracking-wider">LED Light Therapy</Link>
        </div>
      </div>
    </section>

    <section className="py-24">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="font-display text-4xl md:text-5xl mb-4">Ready for Your Best Skin?</h2>
        <p className="font-body text-muted-foreground mb-8">Book your HydraFacial today - no downtime, just results.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
                href="https://hiveclinicuk.setmore.com/book?products=1b7e4418-5f0a-452a-96b2-11fe4e558825&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-accent transition-colors">
                Book Now <ArrowRight size={14} />
              </a>
          <a href="https://wa.me/447795008114" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-10 py-4 border border-border font-body text-sm tracking-widest uppercase hover:border-gold transition-colors">
            Message Us on WhatsApp
          </a>
        </div>
        <p className="font-body text-xs text-muted-foreground mt-6">25 Saint John Street, Manchester M3 4DT</p>
      </div>
    </section>
  </Layout>
  );
};

export default HydraFacial;
