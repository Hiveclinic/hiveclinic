import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Award, Clock, CheckCircle } from "lucide-react";
import Layout from "@/components/Layout";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useSiteImage } from "@/hooks/use-site-image";
import { STOCK } from "@/lib/stock-images";

const faqs = [
  { q: "What is PRP?", a: "PRP (Platelet Rich Plasma) therapy uses your own blood to create a concentrated serum rich in growth factors that stimulates skin repair and regeneration." },
  { q: "What can PRP treat?", a: "PRP is effective for facial rejuvenation (vampire facial), dark circles under the eyes, and scalp treatments for hair thinning or loss." },
  { q: "Is PRP painful?", a: "We apply topical numbing cream before treatment. Most clients describe it as mild discomfort rather than pain." },
  { q: "How long do results take?", a: "You will see gradual improvement over 4-6 weeks as new collagen forms. Optimal results are typically seen after a course of 3 treatments." },
];

const PRP = () => {
  usePageMeta(
    "PRP Therapy Manchester City Centre | Hive Clinic",
    "PRP platelet rich plasma therapy at Hive Clinic, Manchester City Centre. Natural skin rejuvenation and hair restoration using your own plasma. Book today."
  );
  const heroImg = useSiteImage("prp_hero", STOCK.prp_hero);
  const secondaryImg = useSiteImage("prp_secondary", STOCK.prp_secondary);

  return (
    <Layout>
      <section className="relative min-h-[70vh] flex items-center">
        <div className="absolute inset-0">
          <img src={heroImg} alt="PRP therapy treatment at Hive Clinic Manchester City Centre" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-xl">
            <p className="font-body text-sm text-gold uppercase tracking-[0.2em] mb-4">Regenerative Medicine</p>
            <h1 className="font-display text-5xl md:text-7xl text-white leading-[1.1] mb-6">PRP Therapy Manchester</h1>
            <p className="font-body text-lg text-white/80 mb-6">Harness your body's own healing power for natural skin rejuvenation and hair restoration.</p>
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2"><Shield size={14} strokeWidth={1.5} className="text-gold" /><span className="font-body text-sm text-white/70">Your Own Plasma</span></div>
              <div className="flex items-center gap-2"><Award size={14} strokeWidth={1.5} className="text-gold" /><span className="font-body text-sm text-white/70">100% Natural</span></div>
              <div className="flex items-center gap-2"><Clock size={14} strokeWidth={1.5} className="text-gold" /><span className="font-body text-sm text-white/70">60 Min Treatment</span></div>
            </div>
            <Link to="/bookings?category=PRP" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-body text-sm tracking-widest uppercase hover:bg-white/90 transition-colors">Book Now <ArrowRight size={14} /></Link>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-display text-4xl md:text-5xl mb-6">Your Body's Own Rejuvenation</h2>
            <p className="font-body text-muted-foreground leading-relaxed mb-8">PRP therapy harnesses the growth factors in your own blood to stimulate collagen production, improve skin texture, reduce scarring, and support hair growth. It's 100% natural and tailored entirely to you.</p>
            <div className="space-y-4 mb-8">
              {["Vampire Facial — skin rejuvenation", "Under Eye — dark circles & texture", "Scalp — hair growth support", "100% natural using your own plasma", "Consultation required"].map(b => (
                <div key={b} className="flex items-center gap-3"><CheckCircle size={14} strokeWidth={1.5} className="text-gold flex-shrink-0" /><span className="font-body text-sm">{b}</span></div>
              ))}
            </div>
            <div className="border border-border p-6 mb-8">
              <p className="font-body text-sm text-muted-foreground uppercase tracking-wider mb-2">Pricing</p>
              <p className="font-display text-2xl">Facial / Under Eye — £325</p>
              <p className="font-display text-2xl mt-1">Scalp — £425</p>
            </div>
            <Link to="/bookings?category=PRP" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-accent transition-colors">
              Book Consultation <ArrowRight size={14} />
            </Link>
          </div>
          <div className="aspect-[4/5] overflow-hidden"><img src={secondaryImg} alt="PRP therapy results at Hive Clinic Manchester City Centre" className="w-full h-full object-cover" loading="lazy" /></div>
        </div>
      </section>

      {/* Who Is This For + Downtime */}
      <section className="py-24 bg-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h3 className="font-display text-2xl mb-4">Who Is This Suitable For?</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                PRP is suitable for anyone wanting natural skin rejuvenation, those with acne scarring, fine lines, dark under-eye circles, or hair thinning. It's ideal for clients who prefer a 100% natural approach using their own blood plasma.
              </p>
            </div>
            <div>
              <h3 className="font-display text-2xl mb-4">Downtime & Recovery</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                Expect redness and mild swelling for 24-48 hours, similar to sunburn. Small pinpoint marks may be visible for 1-2 days. Avoid makeup for 12 hours and direct sun for 48 hours post-treatment.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-display text-4xl md:text-5xl text-center mb-16">Frequently Asked Questions</h2>
          <div className="space-y-8">{faqs.map(faq => (<div key={faq.q} className="border-b border-border pb-8"><h3 className="font-display text-xl mb-3">{faq.q}</h3><p className="font-body text-sm text-muted-foreground leading-relaxed">{faq.a}</p></div>))}</div>
        </div>
      </section>

      {/* Related Treatments */}
      <section className="py-16 border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="font-display text-2xl text-center mb-8">Related Treatments</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/treatments/microneedling-manchester" className="px-6 py-3 border border-border hover:border-gold transition-colors font-body text-sm tracking-wider">Microneedling</Link>
            <Link to="/treatments/skin-boosters-manchester" className="px-6 py-3 border border-border hover:border-gold transition-colors font-body text-sm tracking-wider">Skin Boosters</Link>
            <Link to="/treatments/mesotherapy-manchester" className="px-6 py-3 border border-border hover:border-gold transition-colors font-body text-sm tracking-wider">Mesotherapy</Link>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display text-4xl md:text-5xl mb-4">Regenerate. Renew. Restore.</h2>
          <p className="font-body text-muted-foreground mb-8">Book your PRP consultation today.</p>
          <Link to="/bookings?category=PRP" className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-accent transition-colors">Book Now <ArrowRight size={14} /></Link>
        </div>
      </section>
    </Layout>
  );
};

export default PRP;
