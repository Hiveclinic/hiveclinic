import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Award, Clock, CheckCircle, Star } from "lucide-react";
import Layout from "@/components/Layout";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useSiteImage } from "@/hooks/use-site-image";
import { STOCK } from "@/lib/stock-images";

const faqs = [
  { q: "How much does lip filler cost in Manchester?", a: "Lip filler at Hive Clinic starts from just £80 for 0.5ml. We offer a range of premium hyaluronic acid fillers to suit different goals and budgets." },
  { q: "Does lip filler hurt?", a: "We use topical numbing cream and the filler contains built-in anaesthetic. Most clients describe the sensation as mild pressure rather than pain." },
  { q: "How long does lip filler last?", a: "Results typically last 6-12 months depending on the product used and your metabolism. We offer affordable top-up appointments." },
  { q: "Will my lips look natural?", a: "Absolutely. We specialise in subtle, balanced enhancements that complement your facial proportions. Natural results are our signature." },
  { q: "What's the difference between 0.5ml and 1ml?", a: "0.5ml gives a subtle enhancement — perfect for first-timers or a natural refresh. 1ml provides more noticeable volume and definition. Bianca will advise during your consultation." },
  { q: "Is there any downtime?", a: "Mild swelling is normal for 24-48 hours. Most clients return to their daily routine immediately after treatment." },
];

const reviews = [
  { name: "Sophie M.", text: "Best lip filler I've ever had. So natural and Bianca made me feel completely at ease. Already booked my top-up!" },
  { name: "Lauren T.", text: "I was so nervous but Bianca talked me through everything. My lips look amazing — subtle but exactly what I wanted." },
  { name: "Jessica R.", text: "Finally found a clinic in Manchester I trust. The results speak for themselves. 10/10 recommend Hive Clinic." },
];

const LipFillerLanding = () => {
  usePageMeta(
    "Lip Filler Manchester | From £80 | Hive Clinic",
    "Natural-looking lip filler from £80 in Manchester City Centre. Expert lip enhancement by a qualified prescriber at Hive Clinic, Deansgate. Book your free consultation today."
  );
  const heroImg = useSiteImage("lipfillerlanding_hero", STOCK.lipfillerlanding_hero);
  const secondaryImg = useSiteImage("lipfillerlanding_secondary", STOCK.lipfillerlanding_secondary);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Lip filler treatment at Hive Clinic Manchester City Centre" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-xl">
            <p className="font-body text-sm text-gold uppercase tracking-[0.2em] mb-4">Manchester's Most Trusted Clinic</p>
            <h1 className="font-display text-5xl md:text-7xl text-white leading-[1.1] mb-6">
              Lip Filler Manchester
            </h1>
            <p className="font-body text-lg text-white/80 mb-4">
              Natural-looking lip enhancement from just £80. Expert results by a qualified prescriber in the heart of Manchester City Centre.
            </p>
            <div className="flex items-center gap-1 mb-6">
              {[1,2,3,4,5].map(i => <Star key={i} size={16} className="text-gold fill-gold" />)}
              <span className="font-body text-sm text-white/60 ml-2">5.0 on Google Reviews</span>
            </div>
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2"><Shield size={14} className="text-gold" /><span className="font-body text-sm text-white/70">Qualified Prescriber</span></div>
              <div className="flex items-center gap-2"><Award size={14} className="text-gold" /><span className="font-body text-sm text-white/70">Premium Fillers Only</span></div>
              <div className="flex items-center gap-2"><Clock size={14} className="text-gold" /><span className="font-body text-sm text-white/70">Same-Week Appointments</span></div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://hiveclinicuk.setmore.com/book?step=date-time&products=8316cf5c-ce1f-4868-83be-6e95c9390c75&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=true"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-body text-sm tracking-widest uppercase hover:bg-white/90 transition-colors">
                Book Free Consultation <ArrowRight size={14} />
              </a>
              <a href="https://wa.me/447795008114" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/40 text-white font-body text-sm tracking-widest uppercase hover:border-white transition-colors">
                Message Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Strip */}
      <section className="bg-foreground text-background py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div>
              <p className="font-display text-3xl">£80</p>
              <p className="font-body text-sm text-background/60">0.5ml — Subtle Enhancement</p>
            </div>
            <div>
              <p className="font-display text-3xl">£120</p>
              <p className="font-body text-sm text-background/60">1ml — Full Volume</p>
            </div>
            <div>
              <p className="font-body text-xs text-background/40 mt-1">Pay in instalments with</p>
              <p className="font-body text-sm text-background/60">Klarna or Clearpay</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Hive */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-display text-4xl md:text-5xl mb-6">Why Choose Hive Clinic for Lip Filler?</h2>
              <p className="font-body text-muted-foreground leading-relaxed mb-6">
                Finding the right clinic for lip filler in Manchester can feel overwhelming. At Hive Clinic, Bianca specialises exclusively in subtle, natural-looking lip enhancement — no overfilled results, no cookie-cutter approach.
              </p>
              <p className="font-body text-muted-foreground leading-relaxed mb-8">
                Every treatment begins with a thorough consultation where we discuss your goals, assess your facial proportions, and recommend the perfect amount of filler to achieve the look you want.
              </p>
              <div className="space-y-4 mb-8">
                {["Natural results — never overdone", "Premium hyaluronic acid fillers", "Tailored to your facial proportions", "Free consultation included", "Aftercare support and follow-up", "Pay from £80 — instalments available"].map((b) => (
                  <div key={b} className="flex items-center gap-3">
                    <CheckCircle size={16} className="text-gold flex-shrink-0" />
                    <span className="font-body text-sm">{b}</span>
                  </div>
                ))}
              </div>
              <a
                href="https://hiveclinicuk.setmore.com/book?step=date-time&products=8316cf5c-ce1f-4868-83be-6e95c9390c75&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=true"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-foreground/90 transition-colors">
                Book Consultation <ArrowRight size={14} />
              </a>
            </div>
            <div>
              <img src={secondaryImg} alt="Natural lip filler results at Hive Clinic Manchester" className="w-full aspect-[4/5] object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 bg-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-display text-4xl text-center mb-4">What Our Clients Say</h2>
          <p className="font-body text-muted-foreground text-center mb-12">Real reviews from real clients</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((r) => (
              <div key={r.name} className="bg-background p-8 border border-border">
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(i => <Star key={i} size={14} className="text-gold fill-gold" />)}
                </div>
                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">"{r.text}"</p>
                <p className="font-body text-sm font-medium">{r.name}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <a href="https://g.co/kgs/S5LLaZS" target="_blank" rel="noopener noreferrer" className="font-body text-sm text-muted-foreground underline hover:text-foreground transition-colors">
              Read all Google Reviews →
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-display text-4xl text-center mb-12">Lip Filler FAQ</h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-secondary p-6 border border-border">
                <h3 className="font-display text-lg mb-2">{faq.q}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Treatments */}
      <section className="py-16 bg-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-display text-2xl text-center mb-8">You May Also Be Interested In</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/treatments/dermal-filler-manchester" className="font-body text-sm px-6 py-3 border border-border hover:border-foreground/30 transition-colors">Dermal Filler</Link>
            <Link to="/treatments/facial-balancing-manchester" className="font-body text-sm px-6 py-3 border border-border hover:border-foreground/30 transition-colors">Facial Balancing</Link>
            <Link to="/treatments/skin-boosters-manchester" className="font-body text-sm px-6 py-3 border border-border hover:border-foreground/30 transition-colors">Skin Boosters</Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display text-4xl md:text-5xl mb-6">Book Your Lip Filler Consultation</h2>
          <p className="font-body text-muted-foreground mb-8 max-w-xl mx-auto">
            Free consultations available this week. Hive Clinic, Manchester City Centre — Deansgate.
          </p>
          <a
                href="https://hiveclinicuk.setmore.com/book?step=date-time&products=8316cf5c-ce1f-4868-83be-6e95c9390c75&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=true"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-10 py-4 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-foreground/90 transition-colors">
                Book Now <ArrowRight size={14} />
              </a>
        </div>
      </section>
    </Layout>
  );
};

export default LipFillerLanding;
