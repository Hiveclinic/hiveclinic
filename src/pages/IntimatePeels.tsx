import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Shield, CheckCircle } from "lucide-react";
import Layout from "@/components/Layout";
import gallery3 from "@/assets/gallery-3.jpg";
import { usePageMeta } from "@/hooks/use-page-meta";

const faqs = [
  { q: "What areas can be treated?", a: "Bikini line, inner thighs, and underarms. We also treat other body areas on consultation." },
  { q: "Is this a skin whitening treatment?", a: "No. Intimate peels are designed for brightening and tone refinement only — evening out discolouration caused by friction, hormones, or shaving." },
  { q: "How many sessions are recommended?", a: "A course of 3 is recommended for optimal results, with sessions spaced 2-4 weeks apart." },
  { q: "Is the treatment painful?", a: "You may feel a mild tingling or warmth during application. The peel is carefully formulated for sensitive areas." },
];

const IntimatePeels = () => {
  usePageMeta(
    "Intimate & Body Peels Manchester City Centre | Hive Clinic",
    "Intimate and body brightening peels at Hive Clinic, Manchester City Centre. Gentle professional peels for bikini line, underarms and body areas. Book your appointment."
  );

  return (
    <Layout>
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-16">
            <p className="font-body text-xs tracking-[0.3em] uppercase text-gold mb-4">Specialist Body Treatments</p>
            <h1 className="font-display text-5xl md:text-6xl mb-4">Intimate & Body Peels</h1>
            <p className="font-body text-muted-foreground max-w-xl mx-auto leading-relaxed">Gentle, professional peels for intimate and body areas. Brightening and tone refinement in a safe, comfortable environment.</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
            <div>
              <h2 className="font-display text-4xl mb-6">Confidence in Every Detail</h2>
              <p className="font-body text-muted-foreground leading-relaxed mb-8">Our intimate and body peels use gentle, professional-grade formulations to address discolouration and uneven tone in sensitive areas. Treatments are carried out in complete privacy and comfort.</p>
              <div className="space-y-4 mb-8">
                {["Bikini line, inner thighs & underarms", "Brightening & tone refinement", "Not a whitening treatment", "Course packages available", "Complete privacy and discretion"].map(b => (
                  <div key={b} className="flex items-center gap-3"><CheckCircle size={14} strokeWidth={1.5} className="text-gold flex-shrink-0" /><span className="font-body text-sm">{b}</span></div>
                ))}
              </div>
              <div className="border border-border p-6 mb-8">
                <p className="font-body text-sm text-muted-foreground uppercase tracking-wider mb-3">Pricing</p>
                <div className="space-y-2">
                  <div className="flex justify-between"><span className="font-body text-sm">Small Area</span><span className="font-display text-lg">£85</span></div>
                  <div className="flex justify-between"><span className="font-body text-sm">Medium Area</span><span className="font-display text-lg">£110</span></div>
                  <div className="flex justify-between"><span className="font-body text-sm">Large Area</span><span className="font-display text-lg">£140</span></div>
                </div>
                <p className="font-body text-xs text-muted-foreground mt-3">Courses: Small x3 £235 · Medium x3 £300 · Large x3 £380</p>
              </div>
              <Link to="/bookings?category=Intimate %26 Body Peels" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-accent transition-colors">
                Book Appointment <ArrowRight size={14} />
              </Link>
            </div>
            <div className="aspect-[4/5] overflow-hidden">
              <img src={gallery3} alt="Body peel treatment at Hive Clinic Manchester City Centre" className="w-full h-full object-cover" loading="lazy" />
            </div>
          </div>

          {/* Who Is This For + Downtime */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16 py-16 border-t border-b border-border">
            <div>
              <h3 className="font-display text-2xl mb-4">Who Is This Suitable For?</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                Intimate and body peels are suitable for anyone experiencing discolouration in intimate areas, underarms, inner thighs, or other body zones caused by friction, hormones, or shaving. All skin types welcome.
              </p>
            </div>
            <div>
              <h3 className="font-display text-2xl mb-4">Downtime & Recovery</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                Mild tingling during application is normal. Slight pinkness may last a few hours. Avoid tight clothing on treated areas for 24 hours and use SPF if the area is exposed to sunlight.
              </p>
            </div>
          </div>

          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-4xl text-center mb-16">Frequently Asked Questions</h2>
            <div className="space-y-8">{faqs.map(faq => (<div key={faq.q} className="border-b border-border pb-8"><h3 className="font-display text-xl mb-3">{faq.q}</h3><p className="font-body text-sm text-muted-foreground leading-relaxed">{faq.a}</p></div>))}</div>
          </div>

          {/* Related Treatments */}
          <div className="mt-16 pt-16 border-t border-border">
            <h3 className="font-display text-2xl text-center mb-8">Related Treatments</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/treatments/chemical-peels-manchester" className="px-6 py-3 border border-border hover:border-gold transition-colors font-body text-sm tracking-wider">Chemical Peels</Link>
              <Link to="/treatments/dermaplaning-manchester" className="px-6 py-3 border border-border hover:border-gold transition-colors font-body text-sm tracking-wider">Dermaplaning</Link>
              <Link to="/treatments/hydrafacial-manchester" className="px-6 py-3 border border-border hover:border-gold transition-colors font-body text-sm tracking-wider">HydraFacial</Link>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link to="/bookings?category=Intimate %26 Body Peels" className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-accent transition-colors">Book Now <ArrowRight size={14} /></Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default IntimatePeels;
