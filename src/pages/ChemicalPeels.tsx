import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star, Shield, Award, CheckCircle } from "lucide-react";
import Layout from "@/components/Layout";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useSiteImage } from "@/hooks/use-site-image";
import { STOCK } from "@/lib/stock-images";

const treatments = [
  { name: "BioRePeel Face", desc: "Medical-grade peel to improve acne, texture, and pigmentation with minimal downtime.", price: "£95" },
  { name: "BioRePeel Body", desc: "Targets back, chest, or shoulders for acne and pigmentation.", price: "£110" },
  { name: "Level 1 Chemical Peel - Back", desc: "Intensive peel for hormonal breakouts, scarring and rough texture. Includes antibacterial cleanse.", price: "£95" },
  { name: "Level 2 Chemical Peel - Face", desc: "A stronger depigmenting peel for dark spots, melasma, and uneven skin tone.", price: "£110" },
  { name: "Intimate Peel - Small Area", desc: "Gentle brightening peel for intimate areas, underarms, or targeted zones.", price: "from £75" },
  { name: "Body Brightening Treatment", desc: "Specialist depigmenting treatment for hands, underarms, elbows, and knees.", price: "from £120" },
];

const faqs = [
  { q: "What does a chemical peel do?", a: "Chemical peels remove dead skin cells and stimulate cell renewal. They improve texture, reduce scarring, treat hyperpigmentation, and leave skin smoother and more even-toned." },
  { q: "How many sessions do I need?", a: "We typically recommend 3-8 sessions depending on your concerns. Results improve progressively with each treatment. Course packages are available at a reduced price." },
  { q: "Is a chemical peel painful?", a: "You may feel a mild tingling or warming sensation during the peel, which is completely normal. Any discomfort is temporary and subsides quickly." },
  { q: "What is the downtime?", a: "Mild peeling and redness may occur for 2-5 days depending on the strength of the peel. We provide full aftercare instructions to support healing." },
  { q: "How much do chemical peels cost in Manchester?", a: "Chemical peels at Hive Clinic start from £95 for a single session. Course packages of 3 are available from £230, offering better value for ongoing treatment plans." },
];

const ChemicalPeels = () => {
  usePageMeta(
    "Chemical Peels Manchester City Centre | Hive Clinic",
    "Professional chemical peels from £95 at Hive Clinic, Manchester City Centre. Treat acne, scarring, pigmentation and uneven texture. Book a consultation."
  );
  const heroImg = useSiteImage("chemicalpeels_hero", STOCK.chemicalpeels_hero);
  const secondaryImg = useSiteImage("chemicalpeels_secondary", STOCK.chemicalpeels_secondary);

  return (
  <Layout>
    <section className="relative min-h-[80vh] flex items-center">
      <div className="absolute inset-0">
        <img src={heroImg} alt="Chemical peel treatment Manchester - Hive Clinic Deansgate" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-transparent" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-xl">
          <p className="font-body text-sm text-gold uppercase tracking-[0.2em] mb-4">Transform Your Skin</p>
          <h1 className="font-display text-5xl md:text-7xl text-white leading-[1.1] mb-6">Chemical Peels Manchester</h1>
          <p className="font-body text-lg text-white/80 mb-6">
            Professional chemical peels from £95. Target acne, scarring, pigmentation, and uneven texture at Hive Clinic, Deansgate.
          </p>
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-2"><Shield size={14} className="text-gold" /><span className="font-body text-sm text-white/70">Clinical-Grade Peels</span></div>
            <div className="flex items-center gap-2"><Award size={14} className="text-gold" /><span className="font-body text-sm text-white/70">5-Star Rated</span></div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
                href="https://hiveclinicuk.setmore.com/book?step=additional-products&products=e065bcdb-44e5-4f70-bb9c-6c62fdcc5490%7Cd453b54f-1bf8-4c49-9403-eaa77cf778a8&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false"
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
        <h2 className="font-display text-4xl md:text-5xl text-center mb-4">Our Chemical Peel Treatments</h2>
        <p className="font-body text-muted-foreground text-center mb-16 max-w-lg mx-auto">From mild brightening peels to intensive depigmenting treatments - tailored to your skin.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {treatments.map((t) => (
            <div key={t.name} className="border border-border p-8 hover:border-gold transition-colors group">
              <h3 className="font-display text-xl mb-3 group-hover:text-gold transition-colors">{t.name}</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">{t.desc}</p>
              <p className="font-display text-2xl">{t.price}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <p className="font-body text-sm text-muted-foreground">Course packages of 3 available from £210. <Link to="/bookings" className="text-gold hover:underline">View full pricing</Link></p>
        </div>
      </div>
    </section>

    <section className="py-24 bg-secondary">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-display text-4xl md:text-5xl mb-6">Why Choose Hive for Chemical Peels</h2>
            <p className="font-body text-muted-foreground leading-relaxed mb-8">
              Our peels are medical-grade and professionally administered to ensure safety and maximum results. Every treatment is preceded by a thorough skin assessment.
            </p>
            <div className="space-y-4">
              {["Medical-grade products only", "Skin assessment included", "Face, back, and body treatments", "Intimate and body brightening peels available", "Course packages for best results", "Full aftercare support"].map((b) => (
                <div key={b} className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-gold flex-shrink-0" />
                  <span className="font-body text-sm">{b}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="aspect-[4/5] overflow-hidden">
            <img src={secondaryImg} alt="Chemical peel results Manchester" className="w-full h-full object-cover" loading="lazy" />
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
            { name: "Fatima A.", text: "My skin texture has completely transformed after 3 sessions. The pigmentation on my cheeks has faded dramatically." },
            { name: "Charlotte B.", text: "I had terrible back acne scarring and Bianca recommended a course of Level 1 peels. The difference is incredible." },
            { name: "Amira H.", text: "The body brightening treatment for my underarms was something I'd been looking for everywhere. So glad I found Hive." },
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
          <Link to="/treatments/microneedling-manchester" className="px-6 py-3 border border-border hover:border-gold transition-colors font-body text-sm tracking-wider">Microneedling</Link>
          <Link to="/treatments/hydrafacial-manchester" className="px-6 py-3 border border-border hover:border-gold transition-colors font-body text-sm tracking-wider">HydraFacial</Link>
          <Link to="/treatments/intimate-body-peels-manchester" className="px-6 py-3 border border-border hover:border-gold transition-colors font-body text-sm tracking-wider">Intimate & Body Peels</Link>
        </div>
      </div>
    </section>

    <section className="py-24">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="font-display text-4xl md:text-5xl mb-4">Ready to Transform Your Skin?</h2>
        <p className="font-body text-muted-foreground mb-8">Book a consultation to discuss the best peel for your skin type and concerns.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
                href="https://hiveclinicuk.setmore.com/book?step=additional-products&products=e065bcdb-44e5-4f70-bb9c-6c62fdcc5490%7Cd453b54f-1bf8-4c49-9403-eaa77cf778a8&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false"
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

export default ChemicalPeels;
