import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Award, Clock, CheckCircle } from "lucide-react";
import Layout from "@/components/Layout";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useSiteImage } from "@/hooks/use-site-image";

const faqs = [
  { q: "What does LED light therapy do?", a: "LED therapy uses different wavelengths of light to target specific skin concerns. Red light stimulates collagen, blue light targets acne-causing bacteria, green reduces pigmentation, and yellow soothes inflammation." },
  { q: "Is LED light therapy safe?", a: "Yes, LED is non-invasive and suitable for all skin types. There is no UV light involved and no downtime whatsoever." },
  { q: "How many sessions do I need?", a: "For best results, we recommend a course of 6 sessions. However, you will notice improvements even after a single session." },
  { q: "Can I combine LED with other treatments?", a: "Absolutely. LED is an excellent add-on to facials, peels, and microneedling treatments to accelerate healing and enhance results." },
];

const LEDTherapy = () => {
  usePageMeta(
    "LED Light Therapy Manchester City Centre | Hive Clinic",
    "LED light therapy sessions from £45 at Hive Clinic, Manchester City Centre. Non-invasive skin healing for acne, pigmentation and ageing. Book today."
  );
  const heroImg = useSiteImage("ledtherapy_hero", gallery5);
  const secondaryImg = useSiteImage("ledtherapy_secondary", gallery3);

  return (
    <Layout>
      <section className="relative min-h-[70vh] flex items-center">
        <div className="absolute inset-0">
          <img src={heroImg} alt="LED light therapy treatment at Hive Clinic Manchester City Centre" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-xl">
            <p className="font-body text-sm text-gold uppercase tracking-[0.2em] mb-4">Advanced Skin Science</p>
            <h1 className="font-display text-5xl md:text-7xl text-white leading-[1.1] mb-6">LED Light Therapy Manchester</h1>
            <p className="font-body text-lg text-white/80 mb-6">Targeted light therapy to heal, rejuvenate, and transform your skin — zero downtime.</p>
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2"><Shield size={14} strokeWidth={1.5} className="text-gold" /><span className="font-body text-sm text-white/70">Non-Invasive</span></div>
              <div className="flex items-center gap-2"><Award size={14} strokeWidth={1.5} className="text-gold" /><span className="font-body text-sm text-white/70">All Skin Types</span></div>
              <div className="flex items-center gap-2"><Clock size={14} strokeWidth={1.5} className="text-gold" /><span className="font-body text-sm text-white/70">30 Min Sessions</span></div>
            </div>
            <Link to="/bookings?category=LED Light Therapy" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-body text-sm tracking-widest uppercase hover:bg-white/90 transition-colors">
              Book Now <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-display text-4xl md:text-5xl mb-6">Science-Backed Skin Healing</h2>
              <p className="font-body text-muted-foreground leading-relaxed mb-8">Our medical-grade LED panels deliver precise wavelengths of light to stimulate cellular repair, boost collagen production, and calm inflammation. Each session is tailored to your skin's needs.</p>
              <div className="space-y-4 mb-8">
                {["Red light — collagen stimulation", "Blue light — acne & bacteria", "Green light — pigmentation", "Yellow light — inflammation & redness", "No downtime or discomfort"].map(b => (
                  <div key={b} className="flex items-center gap-3"><CheckCircle size={14} strokeWidth={1.5} className="text-gold flex-shrink-0" /><span className="font-body text-sm">{b}</span></div>
                ))}
              </div>
              <div className="border border-border p-6 mb-8">
                <p className="font-body text-sm text-muted-foreground uppercase tracking-wider mb-2">Pricing</p>
                <p className="font-display text-3xl">£45 <span className="text-lg text-muted-foreground">per session</span></p>
                <p className="font-display text-xl mt-2">£250 <span className="text-lg text-muted-foreground">course of 6</span></p>
              </div>
              <Link to="/bookings?category=LED Light Therapy" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-accent transition-colors">
                Book Appointment <ArrowRight size={14} />
              </Link>
            </div>
            <div className="aspect-[4/5] overflow-hidden"><img src={gallery3} alt="LED light therapy results at Hive Clinic Manchester City Centre" className="w-full h-full object-cover" loading="lazy" /></div>
          </div>
        </div>
      </section>

      {/* Who Is This For + Downtime */}
      <section className="py-24 bg-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h3 className="font-display text-2xl mb-4">Who Is This Suitable For?</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                LED light therapy is suitable for all skin types and concerns. It's particularly effective for acne-prone skin, those with rosacea or redness, anyone wanting to boost collagen, and as a healing accelerator after other treatments.
              </p>
            </div>
            <div>
              <h3 className="font-display text-2xl mb-4">Downtime & Recovery</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                There is zero downtime. LED therapy is completely non-invasive with no discomfort. You can apply makeup and return to all normal activities immediately after your session.
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
            <Link to="/treatments/hydrafacial-manchester" className="px-6 py-3 border border-border hover:border-gold transition-colors font-body text-sm tracking-wider">HydraFacial</Link>
            <Link to="/treatments/chemical-peels-manchester" className="px-6 py-3 border border-border hover:border-gold transition-colors font-body text-sm tracking-wider">Chemical Peels</Link>
            <Link to="/treatments/microneedling-manchester" className="px-6 py-3 border border-border hover:border-gold transition-colors font-body text-sm tracking-wider">Microneedling</Link>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display text-4xl md:text-5xl mb-4">Start Your Skin Transformation</h2>
          <p className="font-body text-muted-foreground mb-8">Book an LED session or course today.</p>
          <Link to="/bookings?category=LED Light Therapy" className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-accent transition-colors">Book Now <ArrowRight size={14} /></Link>
        </div>
      </section>
    </Layout>
  );
};

export default LEDTherapy;
