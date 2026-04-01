import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Award, Clock, CheckCircle } from "lucide-react";
import Layout from "@/components/Layout";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useSiteImage } from "@/hooks/use-site-image";
import { STOCK } from "@/lib/stock-images";

const faqs = [
  { q: "What causes hyperpigmentation?", a: "Hyperpigmentation can be caused by sun exposure, hormonal changes (melasma), acne scarring, skin injuries or inflammation. A consultation helps identify the root cause." },
  { q: "Which treatment is best for dark spots?", a: "It depends on the type and depth. Chemical peels and microneedling are highly effective. We often combine treatments for the best results." },
  { q: "How many sessions will I need?", a: "Most clients see noticeable improvement in 3-6 sessions. Stubborn pigmentation like melasma may require ongoing maintenance treatments." },
  { q: "Is there any downtime?", a: "Mild peeling or redness for a few days depending on the treatment. HydraFacial has zero downtime. We'll explain what to expect during your consultation." },
  { q: "Can I treat hyperpigmentation on my body?", a: "Yes. We offer body-specific peels including intimate peels for hyperpigmentation in sensitive areas." },
];

const treatments = [
  { name: "Chemical Peels", desc: "Targeted peels to break down excess melanin and reveal brighter, even-toned skin", link: "/treatments/chemical-peels-manchester" },
  { name: "Microneedling", desc: "Stimulate cell turnover to fade dark spots and improve overall skin clarity", link: "/treatments/microneedling-manchester" },
  { name: "HydraFacial", desc: "Deep cleanse and brighten with serums designed to target uneven skin tone", link: "/treatments/hydrafacial-manchester" },
  { name: "Mesotherapy", desc: "Vitamin cocktails delivered directly into the skin to brighten and rejuvenate", link: "/treatments/mesotherapy-manchester" },
];

const HyperpigmentationTreatment = () => {
  usePageMeta(
    "Hyperpigmentation Treatment Manchester | Hive Clinic",
    "Advanced hyperpigmentation treatments in Manchester City Centre. Chemical peels, microneedling and skin brightening at Hive Clinic. Book a free skin consultation today."
  );
  const heroImg = useSiteImage("hyperpigmentation_hero", STOCK.hyperpigmentation_hero);
  const secondaryImg = useSiteImage("hyperpigmentation_secondary", STOCK.hyperpigmentation_secondary);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Hyperpigmentation treatment at Hive Clinic Manchester City Centre" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-xl">
            <p className="font-body text-sm text-gold uppercase tracking-[0.2em] mb-4">Specialist Skin Clinic</p>
            <h1 className="font-display text-5xl md:text-7xl text-white leading-[1.1] mb-6">
              Hyperpigmentation Treatment Manchester
            </h1>
            <p className="font-body text-lg text-white/80 mb-6">
              Fade dark spots, melasma and uneven skin tone with advanced skin treatments at Hive Clinic, Manchester City Centre.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2"><Shield size={14} className="text-gold" /><span className="font-body text-sm text-white/70">Qualified Practitioner</span></div>
              <div className="flex items-center gap-2"><Award size={14} className="text-gold" /><span className="font-body text-sm text-white/70">5-Star Rated</span></div>
              <div className="flex items-center gap-2"><Clock size={14} className="text-gold" /><span className="font-body text-sm text-white/70">Free Consultation</span></div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://hiveclinicuk.setmore.com/book?products=745f4a19-36cf-403c-8f7e-608f494585db&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false"
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

      {/* Problem + Solution */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-display text-4xl md:text-5xl mb-6">Uneven Skin Tone Holding You Back?</h2>
              <p className="font-body text-muted-foreground leading-relaxed mb-6">
                Hyperpigmentation — dark patches, sun spots, melasma and post-inflammatory marks — is one of the most common skin concerns. At Hive Clinic in Manchester City Centre, we use advanced professional treatments to target excess melanin production and restore an even, radiant complexion.
              </p>
              <p className="font-body text-muted-foreground leading-relaxed mb-8">
                Bianca will assess your pigmentation type during a thorough consultation and recommend a tailored treatment plan using the most effective combination of treatments for your skin.
              </p>
              <div className="space-y-4 mb-8">
                {["Fade dark spots and sun damage", "Treat melasma and hormonal pigmentation", "Even out post-acne marks", "Brighten overall skin tone", "Medical-grade peels and serums"].map((b) => (
                  <div key={b} className="flex items-center gap-3">
                    <CheckCircle size={16} className="text-gold flex-shrink-0" />
                    <span className="font-body text-sm">{b}</span>
                  </div>
                ))}
              </div>
              <a
                href="https://hiveclinicuk.setmore.com/book?products=745f4a19-36cf-403c-8f7e-608f494585db&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-foreground/90 transition-colors">
                Book Consultation <ArrowRight size={14} />
              </a>
            </div>
            <div>
              <img src={secondaryImg} alt="Skin brightening results after hyperpigmentation treatment at Hive Clinic Manchester" className="w-full aspect-[4/5] object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Treatments */}
      <section className="py-24 bg-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-display text-4xl md:text-5xl text-center mb-4">Treatments for Hyperpigmentation</h2>
          <p className="font-body text-muted-foreground text-center max-w-2xl mx-auto mb-16">
            We combine the most effective treatments to fade pigmentation and prevent it from returning.
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
            Our hyperpigmentation treatments are suitable for anyone experiencing:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {["Sun spots and sun damage", "Melasma or hormonal pigmentation", "Post-acne dark marks", "Age spots", "Uneven skin tone and dullness", "Body pigmentation and dark areas"].map((item) => (
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
          <h2 className="font-display text-4xl md:text-5xl mb-6">Ready for Brighter, Even Skin?</h2>
          <p className="font-body text-muted-foreground mb-8 max-w-xl mx-auto">
            Book a free skin consultation at Hive Clinic, Manchester City Centre. We'll create a personalised plan to fade your pigmentation and restore your glow.
          </p>
          <a
                href="https://hiveclinicuk.setmore.com/book?products=745f4a19-36cf-403c-8f7e-608f494585db&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-10 py-4 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-foreground/90 transition-colors">
                Book Consultation <ArrowRight size={14} />
              </a>
        </div>
      </section>
    </Layout>
  );
};

export default HyperpigmentationTreatment;
