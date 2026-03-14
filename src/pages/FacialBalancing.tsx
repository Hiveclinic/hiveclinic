import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Award, Clock, CheckCircle } from "lucide-react";
import Layout from "@/components/Layout";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useSiteImage } from "@/hooks/use-site-image";

const faqs = [
  { q: "What is facial balancing?", a: "Facial balancing uses strategic placement of dermal filler across multiple areas of the face to create harmonious proportions and symmetry — rather than treating one area in isolation." },
  { q: "How much filler is used?", a: "We offer 3ml, 5ml, and 7ml packages depending on your goals. A personalised treatment plan is created following your assessment." },
  { q: "Is there downtime?", a: "You may experience mild swelling or bruising for 2-5 days. Most clients return to normal activities within 24 hours." },
  { q: "How long do results last?", a: "Results typically last 12-18 months depending on the areas treated and the products used." },
];

const FacialBalancing = () => {
  usePageMeta(
    "Facial Balancing Manchester City Centre | Hive Clinic",
    "Facial balancing packages from £380 at Hive Clinic, Manchester City Centre. Multi-area dermal filler for complete facial harmony. Book your consultation."
  );
  const heroImg = useSiteImage("facialbalancing_hero", gallery4);
  const secondaryImg = useSiteImage("facialbalancing_secondary", gallery1);

  return (
    <Layout>
      <section className="relative min-h-[70vh] flex items-center">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Facial balancing treatment at Hive Clinic Manchester City Centre" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-xl">
            <p className="font-body text-sm text-gold uppercase tracking-[0.2em] mb-4">Expert Contouring</p>
            <h1 className="font-display text-5xl md:text-7xl text-white leading-[1.1] mb-6">Facial Balancing Manchester</h1>
            <p className="font-body text-lg text-white/80 mb-6">Full-face harmony through strategic filler placement. Sculpt, define, and balance your features.</p>
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2"><Shield size={14} strokeWidth={1.5} className="text-gold" /><span className="font-body text-sm text-white/70">Bespoke Plans</span></div>
              <div className="flex items-center gap-2"><Award size={14} strokeWidth={1.5} className="text-gold" /><span className="font-body text-sm text-white/70">Premium Fillers</span></div>
              <div className="flex items-center gap-2"><Clock size={14} strokeWidth={1.5} className="text-gold" /><span className="font-body text-sm text-white/70">60-90 Mins</span></div>
            </div>
            <Link to="/bookings?category=Facial Balancing" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-body text-sm tracking-widest uppercase hover:bg-white/90 transition-colors">Book Consultation <ArrowRight size={14} /></Link>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-display text-4xl md:text-5xl mb-6">The Art of Proportion</h2>
            <p className="font-body text-muted-foreground leading-relaxed mb-8">Facial balancing is our most transformative service. Rather than treating one area, we assess your entire face to create a cohesive, natural result. Whether it's adding definition to the jawline, projection to the chin, or structure to the cheeks — every millilitre is placed with purpose.</p>
            <div className="space-y-4 mb-8">
              {["Multi-area treatment in one session", "Personalised to your facial structure", "Premium hyaluronic acid fillers", "Natural, proportionate results", "Comprehensive aftercare included"].map(b => (
                <div key={b} className="flex items-center gap-3"><CheckCircle size={14} strokeWidth={1.5} className="text-gold flex-shrink-0" /><span className="font-body text-sm">{b}</span></div>
              ))}
            </div>
            <div className="border border-border p-6 mb-8">
              <p className="font-body text-sm text-muted-foreground uppercase tracking-wider mb-2">Packages</p>
              <div className="space-y-2">
                <p className="font-display text-2xl">3ml — £380</p>
                <p className="font-display text-2xl">5ml — £540</p>
                <p className="font-display text-2xl">7ml — £720</p>
              </div>
            </div>
            <Link to="/bookings?category=Facial Balancing" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-accent transition-colors">
              Book Consultation <ArrowRight size={14} />
            </Link>
          </div>
          <div className="aspect-[4/5] overflow-hidden"><img src={secondaryImg} alt="Facial balancing results at Hive Clinic Manchester City Centre" className="w-full h-full object-cover" loading="lazy" /></div>
        </div>
      </section>

      {/* Who Is This For + Downtime */}
      <section className="py-24 bg-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h3 className="font-display text-2xl mb-4">Who Is This Suitable For?</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                Facial balancing is ideal for clients who want overall facial harmony rather than treating one area in isolation. Suitable for those looking to improve jawline definition, chin projection, cheekbone structure, or overall symmetry.
              </p>
            </div>
            <div>
              <h3 className="font-display text-2xl mb-4">Downtime & Recovery</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                Mild swelling and potential bruising for 2-5 days is normal. Most clients return to normal activities within 24 hours. We provide full aftercare instructions and follow-up support.
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
            <Link to="/treatments/dermal-filler-manchester" className="px-6 py-3 border border-border hover:border-gold transition-colors font-body text-sm tracking-wider">Dermal Filler</Link>
            <Link to="/treatments/lip-fillers-manchester" className="px-6 py-3 border border-border hover:border-gold transition-colors font-body text-sm tracking-wider">Lip Fillers</Link>
            <Link to="/treatments/anti-wrinkle-injections-manchester" className="px-6 py-3 border border-border hover:border-gold transition-colors font-body text-sm tracking-wider">Anti-Wrinkle Consultation</Link>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display text-4xl md:text-5xl mb-4">Transform Your Profile</h2>
          <p className="font-body text-muted-foreground mb-8">Book a facial balancing consultation.</p>
          <Link to="/bookings?category=Facial Balancing" className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-accent transition-colors">Book Consultation <ArrowRight size={14} /></Link>
        </div>
      </section>
    </Layout>
  );
};

export default FacialBalancing;
