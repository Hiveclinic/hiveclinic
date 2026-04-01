import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star, Shield, Award, CheckCircle } from "lucide-react";
import Layout from "@/components/Layout";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useSiteImage } from "@/hooks/use-site-image";
import { STOCK } from "@/lib/stock-images";

const treatments = [
  { name: "Small Area", desc: "Chin, bra fat, jawline, upper arms, or lower abdomen.", price: "£120" },
  { name: "Medium Area", desc: "Full lower abdomen, upper abdomen, waist, flanks, or upper arms.", price: "£180" },
  { name: "Large Area", desc: "Full abdomen, back rolls, hips, or thighs.", price: "£250" },
];

const faqs = [
  { q: "How does fat dissolving work?", a: "Fat dissolving injections use deoxycholic acid to break down fat cells in targeted areas. The destroyed fat cells are then naturally eliminated by your body over the following weeks." },
  { q: "How many sessions do I need?", a: "Most clients see optimal results after 2-4 sessions, spaced 4-6 weeks apart. The number of sessions depends on the area and amount of fat being treated." },
  { q: "Is fat dissolving painful?", a: "You may feel a mild stinging sensation during injection, followed by some swelling and tenderness for a few days. This is a normal part of the process and indicates the treatment is working." },
  { q: "Are results permanent?", a: "Yes. Once fat cells are destroyed, they do not regenerate. However, maintaining a healthy lifestyle is important to prevent remaining fat cells from enlarging." },
  { q: "How much does fat dissolving cost in Manchester?", a: "Fat dissolving treatments at Hive Clinic start from £120 for a small area. Larger areas are priced at £180-£250 per session." },
];

const FatDissolve = () => {
  usePageMeta(
    "Fat Dissolving Manchester City Centre | Hive Clinic",
    "Non-surgical fat dissolving injections from £120 at Hive Clinic, Manchester City Centre. Target stubborn fat on chin, abdomen, flanks and more. Book today."
  );
  const heroImg = useSiteImage("fatdissolve_hero", STOCK.fatdissolve_hero);
  const secondaryImg = useSiteImage("fatdissolve_secondary", STOCK.fatdissolve_secondary);

  return (
  <Layout>
    <section className="relative min-h-[80vh] flex items-center">
      <div className="absolute inset-0">
        <img src={heroImg} alt="Fat dissolving injections Manchester - non-surgical body contouring at Hive Clinic" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-transparent" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-xl">
          <p className="font-body text-sm text-gold uppercase tracking-[0.2em] mb-4">Non-Surgical Body Contouring</p>
          <h1 className="font-display text-5xl md:text-7xl text-white leading-[1.1] mb-6">Fat Dissolving Manchester</h1>
          <p className="font-body text-lg text-white/80 mb-6">
            Non-surgical fat reduction from £120. Target stubborn fat on chin, abdomen, flanks, and more at Hive Clinic, Deansgate.
          </p>
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-2"><Shield size={14} className="text-gold" /><span className="font-body text-sm text-white/70">Non-Surgical</span></div>
            <div className="flex items-center gap-2"><Award size={14} className="text-gold" /><span className="font-body text-sm text-white/70">Permanent Results</span></div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
                href="https://hiveclinicuk.setmore.com/book?products=a30c5362-956b-4139-b14d-9daaf9a5569a&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-body text-sm tracking-widest uppercase hover:bg-white/90 transition-colors">
                Book Consultation <ArrowRight size={14} />
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
        <h2 className="font-display text-4xl md:text-5xl text-center mb-4">Treatment Areas</h2>
        <p className="font-body text-muted-foreground text-center mb-16 max-w-lg mx-auto">Target stubborn pockets of fat that resist diet and exercise.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {treatments.map((t) => (
            <div key={t.name} className="border border-border p-8 hover:border-gold transition-colors group">
              <h3 className="font-display text-2xl mb-3 group-hover:text-gold transition-colors">{t.name}</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">{t.desc}</p>
              <p className="font-display text-3xl">{t.price}</p>
              <p className="font-body text-xs text-muted-foreground mt-1">per session</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-24 bg-secondary">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-display text-4xl md:text-5xl mb-6">Why Fat Dissolving at Hive</h2>
            <p className="font-body text-muted-foreground leading-relaxed mb-8">
              Fat dissolving is a safe, effective alternative to liposuction. Our treatments permanently destroy fat cells in targeted areas, giving you a more contoured silhouette without surgery or significant downtime.
            </p>
            <div className="space-y-4">
              {["Permanent fat cell destruction", "Non-surgical with minimal downtime", "Multiple body areas treatable", "Tailored to your body goals", "Consultation included", "Results visible from 4-6 weeks"].map((b) => (
                <div key={b} className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-gold flex-shrink-0" />
                  <span className="font-body text-sm">{b}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="aspect-[4/5] overflow-hidden">
            <img src={secondaryImg} alt="Fat dissolving body contouring results" className="w-full h-full object-cover" loading="lazy" />
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
            { name: "Megan T.", text: "I'd tried everything to shift my double chin. After 2 sessions the difference is unbelievable. So worth it." },
            { name: "Leah R.", text: "The fat dissolving on my flanks has made such a difference to my confidence. Bianca explained everything so clearly." },
            { name: "Danielle K.", text: "Non-surgical and permanent results - what more could you want? Hive is the best clinic in Manchester." },
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
          <Link to="/treatments/micro-sclerotherapy-manchester" className="px-6 py-3 border border-border hover:border-gold transition-colors font-body text-sm tracking-wider">Micro Sclerotherapy</Link>
          <Link to="/treatments/skin-boosters-manchester" className="px-6 py-3 border border-border hover:border-gold transition-colors font-body text-sm tracking-wider">Skin Boosters</Link>
        </div>
      </div>
    </section>

    <section className="py-24">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="font-display text-4xl md:text-5xl mb-4">Ready to Contour?</h2>
        <p className="font-body text-muted-foreground mb-8">Book a consultation to discuss your body goals and create a personalised plan.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
                href="https://hiveclinicuk.setmore.com/book?products=a30c5362-956b-4139-b14d-9daaf9a5569a&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-accent transition-colors">
                Book Consultation <ArrowRight size={14} />
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

export default FatDissolve;
