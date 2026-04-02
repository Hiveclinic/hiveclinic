import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star, Shield, Award, CheckCircle } from "lucide-react";
import Layout from "@/components/Layout";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useSiteImage } from "@/hooks/use-site-image";
import { STOCK } from "@/lib/stock-images";

const treatments = [
  { name: "Microneedling with Hydrating Serum", desc: "Dr Pen microneedling with hyaluronic acid serum for improved texture and tone.", price: "£160" },
  { name: "Microneedling with Skin Booster", desc: "Microneedling combined with mesotherapy or booster infusion for deeper rejuvenation.", price: "£200" },
  { name: "Stretch Mark Microneedling", desc: "Stimulates collagen to improve stretch mark texture. 3-6 sessions recommended.", price: "£180" },
];

const faqs = [
  { q: "What is microneedling?", a: "Microneedling uses tiny, sterile needles to create controlled micro-injuries in the skin. This triggers your body's natural healing response, stimulating collagen and elastin production for smoother, firmer skin." },
  { q: "Does microneedling hurt?", a: "A topical numbing cream is applied before treatment to minimise discomfort. Most clients describe the sensation as a light scratching feeling." },
  { q: "How many sessions do I need?", a: "For optimal results, we typically recommend 3-6 sessions spaced 4-6 weeks apart. Improvement is progressive and builds with each treatment." },
  { q: "What is the downtime?", a: "Expect redness and mild sensitivity for 24-48 hours, similar to mild sunburn. Most clients return to normal activities the following day." },
  { q: "How much does microneedling cost in Manchester?", a: "Microneedling at Hive Clinic starts from £160 for microneedling texture repair. Stretch mark repair with salmon DNA is £150 per session." },
];

const Microneedling = () => {
  usePageMeta(
    "Microneedling Manchester City Centre | Hive Clinic",
    "Advanced microneedling with chemical peel from £160 at Hive Clinic, Manchester City Centre. Repair scars, texture, pores and stretch marks. Book now."
  );
  const heroImg = useSiteImage("microneedling_hero", STOCK.microneedling_hero);
  const secondaryImg = useSiteImage("microneedling_secondary", STOCK.microneedling_secondary);

  return (
  <Layout>
    <section className="relative min-h-[80vh] flex items-center">
      <div className="absolute inset-0">
        <img src={heroImg} alt="Microneedling treatment Manchester - skin texture repair at Hive Clinic" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-transparent" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-xl">
          <p className="font-body text-sm text-gold uppercase tracking-[0.2em] mb-4">Advanced Skin Repair</p>
          <h1 className="font-display text-5xl md:text-7xl text-white leading-[1.1] mb-6">Microneedling Manchester</h1>
          <p className="font-body text-lg text-white/80 mb-6">
            Advanced microneedling with chemical peel from £160. Repair scars, texture, pores, and stretch marks at Hive Clinic, Deansgate.
          </p>
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-2"><Shield size={14} className="text-gold" /><span className="font-body text-sm text-white/70">Clinical-Grade Treatment</span></div>
            <div className="flex items-center gap-2"><Award size={14} className="text-gold" /><span className="font-body text-sm text-white/70">5-Star Rated</span></div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
                href="https://hiveclinicuk.setmore.com/book?step=additional-products&products=63c50b04-45cf-4989-a970-7c9462548d27&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false"
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
        <h2 className="font-display text-4xl md:text-5xl text-center mb-4">Our Microneedling Treatments</h2>
        <p className="font-body text-muted-foreground text-center mb-16 max-w-lg mx-auto">Stimulate your skin's natural repair process for visibly smoother, healthier skin.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
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
            <img src={secondaryImg} alt="Microneedling results at Hive Clinic Manchester" className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div>
            <h2 className="font-display text-4xl md:text-5xl mb-6">Why Microneedling at Hive</h2>
            <p className="font-body text-muted-foreground leading-relaxed mb-8">
              Our microneedling treatments combine advanced needling technology with medical-grade peels and serums for superior results compared to microneedling alone.
            </p>
            <div className="space-y-4">
              {["Combined with chemical peel for enhanced results", "Treats scars, pores, fine lines, and texture", "Stretch mark repair with salmon DNA", "Stimulates natural collagen production", "Progressive improvement with each session", "Full aftercare support provided"].map((b) => (
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
            { name: "Chloe D.", text: "My acne scarring has improved so much after just 3 sessions. The combination with the chemical peel makes such a difference." },
            { name: "Amina Y.", text: "I had the stretch mark treatment and I'm amazed at the results. The salmon DNA really helps with healing." },
            { name: "Jessica F.", text: "My pores look so much smaller and my skin texture is the smoothest it's ever been. Absolutely love Hive." },
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
          <Link to="/treatments/prp-therapy-manchester" className="px-6 py-3 border border-border hover:border-gold transition-colors font-body text-sm tracking-wider">PRP Therapy</Link>
          <Link to="/treatments/skin-boosters-manchester" className="px-6 py-3 border border-border hover:border-gold transition-colors font-body text-sm tracking-wider">Skin Boosters</Link>
        </div>
      </div>
    </section>

    <section className="py-24">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="font-display text-4xl md:text-5xl mb-4">Ready to Repair and Renew?</h2>
        <p className="font-body text-muted-foreground mb-8">Book a consultation to discuss your skin concerns and create a treatment plan.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
                href="https://hiveclinicuk.setmore.com/book?step=additional-products&products=63c50b04-45cf-4989-a970-7c9462548d27&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false"
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

export default Microneedling;
