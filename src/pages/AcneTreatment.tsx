import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Award, Clock, CheckCircle, Star } from "lucide-react";
import Layout from "@/components/Layout";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useSiteImage } from "@/hooks/use-site-image";

const faqs = [
  { q: "What treatments help with acne?", a: "We offer chemical peels, HydraFacial, microneedling and LED light therapy — all proven to target active acne, reduce breakouts and improve skin texture over time." },
  { q: "How many sessions will I need?", a: "Most clients see visible improvement after 3-6 sessions depending on severity. We create a personalised treatment plan during your consultation." },
  { q: "Can you treat acne scars?", a: "Yes. Microneedling and chemical peels are particularly effective at reducing acne scarring, promoting collagen production and smoothing skin texture." },
  { q: "Is there any downtime?", a: "Downtime varies by treatment. Chemical peels may cause mild flaking for 2-5 days. HydraFacial has zero downtime. We'll advise you during consultation." },
  { q: "Do I need a consultation first?", a: "Yes. Every acne treatment plan begins with a thorough skin consultation so we can recommend the most effective approach for your skin type and concerns." },
];

const treatments = [
  { name: "Chemical Peels", desc: "Exfoliate dead skin, unclog pores and reduce active breakouts", link: "/treatments/chemical-peels-manchester" },
  { name: "HydraFacial", desc: "Deep cleanse, extract and hydrate for clearer, healthier skin", link: "/treatments/hydrafacial-manchester" },
  { name: "Microneedling", desc: "Stimulate collagen to smooth acne scars and improve texture", link: "/treatments/microneedling-manchester" },
  { name: "LED Light Therapy", desc: "Blue light kills acne-causing bacteria and reduces inflammation", link: "/treatments/led-light-therapy-manchester" },
];

const AcneTreatment = () => {
  usePageMeta(
    "Acne Treatment Manchester City Centre | Hive Clinic",
    "Effective acne treatments in Manchester City Centre including chemical peels, HydraFacial, microneedling and LED therapy. Clear skin starts with a free consultation at Hive Clinic."
  );

  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center">
        <div className="absolute inset-0">
          <img src={gallery3} alt="Acne treatment at Hive Clinic Manchester City Centre" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-xl">
            <p className="font-body text-sm text-gold uppercase tracking-[0.2em] mb-4">Specialist Skin Clinic</p>
            <h1 className="font-display text-5xl md:text-7xl text-white leading-[1.1] mb-6">
              Acne Treatment Manchester
            </h1>
            <p className="font-body text-lg text-white/80 mb-6">
              Targeted treatments to clear breakouts, reduce scarring and restore your confidence. Expert skin consultations in Manchester City Centre.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2"><Shield size={14} className="text-gold" /><span className="font-body text-sm text-white/70">Qualified Practitioner</span></div>
              <div className="flex items-center gap-2"><Award size={14} className="text-gold" /><span className="font-body text-sm text-white/70">5-Star Rated</span></div>
              <div className="flex items-center gap-2"><Clock size={14} className="text-gold" /><span className="font-body text-sm text-white/70">Free Consultation</span></div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/bookings" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-body text-sm tracking-widest uppercase hover:bg-white/90 transition-colors">
                Book Consultation <ArrowRight size={14} />
              </Link>
              <a href="https://wa.me/447795008114" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/40 text-white font-body text-sm tracking-widest uppercase hover:border-white transition-colors">
                Message Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem + Solution */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-display text-4xl md:text-5xl mb-6">Struggling With Breakouts?</h2>
              <p className="font-body text-muted-foreground leading-relaxed mb-6">
                Acne affects people of all ages and can seriously impact your confidence. At Hive Clinic in Manchester City Centre, we offer a range of advanced skin treatments specifically designed to target the root causes of acne — from excess oil production and clogged pores to bacteria and inflammation.
              </p>
              <p className="font-body text-muted-foreground leading-relaxed mb-8">
                Whether you're dealing with active breakouts, persistent blackheads, or acne scarring, Bianca will create a personalised treatment plan tailored to your skin type and goals.
              </p>
              <div className="space-y-4 mb-8">
                {["Reduce active breakouts and prevent future ones", "Smooth acne scars and uneven skin texture", "Unclog pores and control oil production", "Personalised treatment plans", "Medical-grade products and professional equipment"].map((b) => (
                  <div key={b} className="flex items-center gap-3">
                    <CheckCircle size={16} className="text-gold flex-shrink-0" />
                    <span className="font-body text-sm">{b}</span>
                  </div>
                ))}
              </div>
              <Link to="/bookings" className="inline-flex items-center gap-2 px-8 py-4 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-foreground/90 transition-colors">
                Book Consultation <ArrowRight size={14} />
              </Link>
            </div>
            <div>
              <img src={gallery1} alt="Clear skin results after acne treatment at Hive Clinic Manchester" className="w-full aspect-[4/5] object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Treatments We Recommend */}
      <section className="py-24 bg-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-display text-4xl md:text-5xl text-center mb-4">Treatments for Acne</h2>
          <p className="font-body text-muted-foreground text-center max-w-2xl mx-auto mb-16">
            We combine the most effective professional treatments to clear your skin and keep it that way. Every plan starts with a consultation.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {treatments.map((t) => (
              <Link key={t.name} to={t.link} className="group bg-background p-8 border border-border hover:border-foreground/20 transition-colors">
                <h3 className="font-display text-2xl mb-3 group-hover:text-gold transition-colors">{t.name}</h3>
                <p className="font-body text-sm text-muted-foreground mb-4">{t.desc}</p>
                <span className="font-body text-sm uppercase tracking-widest flex items-center gap-2 text-foreground">
                  Learn More <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Who Is This For */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-display text-4xl md:text-5xl text-center mb-4">Who Is This For?</h2>
          <p className="font-body text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Our acne treatments in Manchester are suitable for anyone experiencing:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {["Persistent breakouts that won't clear", "Hormonal or adult-onset acne", "Oily or congested skin", "Blackheads and whiteheads", "Acne scarring and texture issues", "Post-acne hyperpigmentation"].map((item) => (
              <div key={item} className="flex items-start gap-3 p-4 border border-border">
                <CheckCircle size={16} className="text-gold flex-shrink-0 mt-0.5" />
                <span className="font-body text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-secondary">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-display text-4xl text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-background p-6 border border-border">
                <h3 className="font-display text-lg mb-2">{faq.q}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display text-4xl md:text-5xl mb-6">Ready to Clear Your Skin?</h2>
          <p className="font-body text-muted-foreground mb-8 max-w-xl mx-auto">
            Book a free skin consultation at Hive Clinic, Manchester City Centre. We'll assess your skin, recommend the right treatments, and create a plan that works for you.
          </p>
          <Link to="/bookings" className="inline-flex items-center gap-2 px-10 py-4 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-foreground/90 transition-colors">
            Book Consultation <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default AcneTreatment;
