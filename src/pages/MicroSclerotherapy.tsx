import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Award, Clock, CheckCircle } from "lucide-react";
import Layout from "@/components/Layout";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useSiteImage } from "@/hooks/use-site-image";

const faqs = [
  { q: "What is micro sclerotherapy?", a: "Micro sclerotherapy is a minimally invasive treatment for thread veins (spider veins) on the legs. A sclerosing solution is injected into the affected veins, causing them to collapse and fade." },
  { q: "Is the treatment painful?", a: "Most clients describe it as a mild stinging sensation. The needles used are very fine and the procedure is well-tolerated." },
  { q: "How many sessions will I need?", a: "Most clients need 2-3 sessions spaced 6-8 weeks apart for optimal clearance. This depends on the extent of the thread veins." },
  { q: "Is there any aftercare?", a: "Yes — compression stockings must be worn for 1-2 weeks after treatment. You should also avoid hot baths, strenuous exercise, and sun exposure during this period." },
  { q: "Can all thread veins be treated?", a: "We treat leg thread veins only. A consultation is required to assess suitability. Varicose veins require different treatment." },
];

const MicroSclerotherapy = () => {
  usePageMeta(
    "Micro Sclerotherapy Manchester City Centre | Hive Clinic",
    "Micro sclerotherapy for thread vein removal at Hive Clinic, Manchester City Centre. Effective treatment for spider veins on legs. Book your consultation."
  );
  const heroImg = useSiteImage("microsclerotherapy_hero", gallery5);
  const secondaryImg = useSiteImage("microsclerotherapy_secondary", gallery6);

  return (
    <Layout>
      <section className="relative min-h-[70vh] flex items-center">
        <div className="absolute inset-0">
          <img src={gallery5} alt="Micro sclerotherapy treatment at Hive Clinic Manchester City Centre" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-xl">
            <p className="font-body text-sm text-gold uppercase tracking-[0.2em] mb-4">Thread Vein Removal</p>
            <h1 className="font-display text-5xl md:text-7xl text-white leading-[1.1] mb-6">Micro Sclerotherapy Manchester</h1>
            <p className="font-body text-lg text-white/80 mb-6">Effective treatment for leg thread veins. Reclaim confidence in your skin.</p>
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2"><Shield size={14} strokeWidth={1.5} className="text-gold" /><span className="font-body text-sm text-white/70">Medical-Grade</span></div>
              <div className="flex items-center gap-2"><Award size={14} strokeWidth={1.5} className="text-gold" /><span className="font-body text-sm text-white/70">Consultation Required</span></div>
              <div className="flex items-center gap-2"><Clock size={14} strokeWidth={1.5} className="text-gold" /><span className="font-body text-sm text-white/70">30-60 Min Sessions</span></div>
            </div>
            <Link to="/bookings?category=Micro Sclerotherapy" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-body text-sm tracking-widest uppercase hover:bg-white/90 transition-colors">Book Consultation <ArrowRight size={14} /></Link>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-display text-4xl md:text-5xl mb-6">Clear, Confident Legs</h2>
            <p className="font-body text-muted-foreground leading-relaxed mb-8">Thread veins are a common concern that can affect confidence. Our micro sclerotherapy treatments use a proven technique to collapse and fade spider veins on the legs, giving you smoother, clearer skin.</p>
            <div className="space-y-4 mb-8">
              {["Targets leg thread veins (spider veins)", "Proven sclerosing technique", "Multiple sessions for best results", "Compression aftercare included", "Consultation required before treatment"].map(b => (
                <div key={b} className="flex items-center gap-3"><CheckCircle size={14} strokeWidth={1.5} className="text-gold flex-shrink-0" /><span className="font-body text-sm">{b}</span></div>
              ))}
            </div>
            <div className="border border-border p-6 mb-8">
              <p className="font-body text-sm text-muted-foreground uppercase tracking-wider mb-2">Pricing</p>
              <div className="space-y-2">
                <p className="font-display text-2xl">Small Area — £225</p>
                <p className="font-display text-2xl">Medium Area — £325</p>
                <p className="font-display text-2xl">Large Area — £475</p>
              </div>
            </div>
            <Link to="/bookings?category=Micro Sclerotherapy" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-accent transition-colors">
              Book Consultation <ArrowRight size={14} />
            </Link>
          </div>
          <div className="aspect-[4/5] overflow-hidden"><img src={gallery6} alt="Thread vein treatment results at Hive Clinic Manchester City Centre" className="w-full h-full object-cover" loading="lazy" /></div>
        </div>
      </section>

      {/* Who Is This For + Downtime */}
      <section className="py-24 bg-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h3 className="font-display text-2xl mb-4">Who Is This Suitable For?</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                Micro sclerotherapy is suitable for adults with visible thread veins (spider veins) on the legs. A consultation is required to assess suitability. This treatment is not suitable for varicose veins or during pregnancy.
              </p>
            </div>
            <div>
              <h3 className="font-display text-2xl mb-4">Downtime & Recovery</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                Compression stockings must be worn for 1-2 weeks. Avoid hot baths, saunas, and strenuous exercise during this period. Bruising and temporary darkening of treated veins is normal and fades over several weeks.
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
            <Link to="/treatments/fat-dissolving-manchester" className="px-6 py-3 border border-border hover:border-gold transition-colors font-body text-sm tracking-wider">Fat Dissolving</Link>
            <Link to="/treatments/skin-boosters-manchester" className="px-6 py-3 border border-border hover:border-gold transition-colors font-body text-sm tracking-wider">Skin Boosters</Link>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display text-4xl md:text-5xl mb-4">Reclaim Your Confidence</h2>
          <p className="font-body text-muted-foreground mb-8">Book a consultation to discuss your thread vein concerns.</p>
          <Link to="/bookings?category=Micro Sclerotherapy" className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-accent transition-colors">Book Consultation <ArrowRight size={14} /></Link>
        </div>
      </section>
    </Layout>
  );
};

export default MicroSclerotherapy;
