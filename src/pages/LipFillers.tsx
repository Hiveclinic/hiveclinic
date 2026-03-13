import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star, Shield, Award, Clock, CheckCircle } from "lucide-react";
import Layout from "@/components/Layout";
import ModelCTA from "@/components/ModelCTA";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import { usePageMeta } from "@/hooks/use-page-meta";

const faqs = [
  { q: "Does lip filler hurt?", a: "We use a topical numbing cream and the filler itself contains anaesthetic, so most clients describe it as a mild pressure. Comfort is our priority." },
  { q: "How long does lip filler last?", a: "Results typically last 6-12 months depending on the product used and your metabolism. We offer top-up appointments to maintain your look." },
  { q: "Will my lips look natural?", a: "Absolutely. We specialise in subtle, balanced enhancements that complement your facial proportions. No one needs to know - unless you tell them." },
  { q: "How much does lip filler cost?", a: "Lip filler at Hive Clinic starts from just £80 for 0.5ml. A full consultation is included to discuss the best approach for your goals." },
  { q: "Is there any downtime?", a: "You may experience mild swelling for 24-48 hours. Most clients return to normal activities immediately after treatment." },
];

const LipFillers = () => {
  usePageMeta(
    "Lip Filler Manchester City Centre | Hive Clinic",
    "Natural-looking lip filler from £80 at Hive Clinic, Manchester City Centre. Expert lip enhancement by a qualified prescriber in Deansgate. Book your free consultation."
  );

  return (
  <Layout>
    {/* Hero */}
    <section className="relative min-h-[80vh] flex items-center">
      <div className="absolute inset-0">
        <img src={gallery4} alt="Lip filler treatment Manchester - natural results at Hive Clinic" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-transparent" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-xl">
          <p className="font-body text-sm text-gold uppercase tracking-[0.2em] mb-4">Manchester's Most Trusted Clinic</p>
          <h1 className="font-display text-5xl md:text-7xl text-white leading-[1.1] mb-6">
            Lip Fillers Manchester
          </h1>
          <p className="font-body text-lg text-white/80 mb-6">
            Natural-looking lip enhancement from just £80. Expert results by a qualified prescriber in the heart of Deansgate.
          </p>
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-2"><Shield size={14} className="text-gold" /><span className="font-body text-sm text-white/70">Qualified Prescriber</span></div>
            <div className="flex items-center gap-2"><Award size={14} className="text-gold" /><span className="font-body text-sm text-white/70">5-Star Rated</span></div>
            <div className="flex items-center gap-2"><Clock size={14} className="text-gold" /><span className="font-body text-sm text-white/70">Same-Week Appointments</span></div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/bookings?category=Lip Fillers" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-body text-sm tracking-widest uppercase hover:bg-white/90 transition-colors">
              Book Free Consultation <ArrowRight size={14} />
            </Link>
            <a href="https://wa.me/447795008114" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/40 text-white font-body text-sm tracking-widest uppercase hover:border-white transition-colors">
              Message Us
            </a>
          </div>
        </motion.div>
      </div>
    </section>

    {/* What We Offer */}
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-display text-4xl md:text-5xl mb-6">Subtle Enhancement, Stunning Results</h2>
            <p className="font-body text-muted-foreground leading-relaxed mb-8">
              At Hive Clinic, we believe less is more. Our lip filler treatments are designed to enhance your natural shape - adding volume, definition, and symmetry without ever looking overdone.
            </p>
            <div className="space-y-4 mb-8">
              {["Natural-looking volume and shape", "Premium hyaluronic acid fillers", "Tailored to your facial proportions", "Includes full consultation", "Aftercare support included"].map((b) => (
                <div key={b} className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-gold flex-shrink-0" />
                  <span className="font-body text-sm">{b}</span>
                </div>
              ))}
            </div>
            <div className="border border-border p-6">
              <p className="font-body text-sm text-muted-foreground uppercase tracking-wider mb-2">Starting from</p>
              <p className="font-display text-4xl">£80 <span className="text-lg text-muted-foreground">/ 0.5ml</span></p>
              <p className="font-body text-xs text-muted-foreground mt-1">Pay in instalments with Klarna or Clearpay</p>
            </div>
          </div>
          <div className="aspect-[4/5] overflow-hidden">
            <img src={gallery1} alt="Lip filler before and after results Manchester" className="w-full h-full object-cover" loading="lazy" />
          </div>
        </div>
      </div>
    </section>

    {/* Social Proof */}
    <section className="py-24 bg-secondary">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-display text-4xl md:text-5xl text-center mb-4">What Our Clients Say</h2>
        <p className="font-body text-muted-foreground text-center mb-16">Rated 5 stars across 100+ reviews</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Emily R.", text: "My lips look incredible - subtle, natural, and exactly what I asked for. Bianca is the best in Manchester." },
            { name: "Sophie T.", text: "I was so nervous for my first time but Bianca made me feel completely at ease. The results are perfect." },
            { name: "Aisha M.", text: "I've been to other clinics before and Hive is on another level. Will never go anywhere else." },
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

    {/* Before/After */}
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="font-display text-4xl md:text-5xl mb-4">Real Results</h2>
        <p className="font-body text-muted-foreground mb-12">See the difference for yourself.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[gallery1, gallery2, gallery4].map((img, i) => (
            <div key={i} className="aspect-square overflow-hidden">
              <img src={img} alt={`Lip filler result ${i + 1} at Hive Clinic Manchester`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* FAQ */}
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
          <Link to="/treatments/dermal-filler-manchester" className="px-6 py-3 border border-border hover:border-gold transition-colors font-body text-sm tracking-wider">Dermal Filler</Link>
          <Link to="/treatments/facial-balancing-manchester" className="px-6 py-3 border border-border hover:border-gold transition-colors font-body text-sm tracking-wider">Facial Balancing</Link>
          <Link to="/treatments/skin-boosters-manchester" className="px-6 py-3 border border-border hover:border-gold transition-colors font-body text-sm tracking-wider">Skin Boosters</Link>
        </div>
      </div>
    </section>

    {/* Final CTA */}
    <section className="py-24">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="font-display text-4xl md:text-5xl mb-4">Ready for Your Perfect Pout?</h2>
        <p className="font-body text-muted-foreground mb-8">Book a free consultation - no obligation, just a friendly chat about your goals.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/bookings?category=Lip Fillers" className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-accent transition-colors">
            Book Free Consultation <ArrowRight size={14} />
          </Link>
          <a href="https://wa.me/447795008114" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-10 py-4 border border-border font-body text-sm tracking-widest uppercase hover:border-gold transition-colors">
            Message Us on WhatsApp
          </a>
        </div>
        <p className="font-body text-xs text-muted-foreground mt-6">25 Saint John Street, Manchester M3 4DT</p>
      </div>
    </section>

      <ModelCTA />
  </Layout>
  );
};

export default LipFillers;
