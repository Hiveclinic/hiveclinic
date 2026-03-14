import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star, Shield, Award, Clock, CheckCircle } from "lucide-react";
import Layout from "@/components/Layout";
import ModelCTA from "@/components/ModelCTA";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useSiteImage } from "@/hooks/use-site-image";
import { STOCK } from "@/lib/stock-images";

const treatments = [
  { name: "Lip Filler", desc: "Natural-looking volume and shape enhancement.", from: "£80" },
  { name: "Cheek Filler", desc: "Restore volume and define cheekbone contours.", from: "£160" },
  { name: "Jawline Filler", desc: "Sculpt and define the jawline for a sharper profile.", from: "£170" },
  { name: "Chin Filler", desc: "Balance facial proportions with chin projection.", from: "£160" },
  { name: "Nose Filler", desc: "Non-surgical nose reshaping for a smoother profile.", from: "£200" },
  { name: "Tear Trough Filler", desc: "Reduce dark circles and hollows under the eyes.", from: "£200" },
  { name: "Smile Lines", desc: "Soften nasolabial folds for a more youthful appearance.", from: "£150" },
  { name: "Facial Balancing", desc: "Multi-area packages for complete facial harmony.", from: "£350" },
];

const faqs = [
  { q: "How long does dermal filler last?", a: "Depending on the area treated and the product used, results typically last 6-18 months. Lip filler tends to last 6-12 months, while jawline and cheek filler can last up to 18 months." },
  { q: "Is dermal filler safe?", a: "Yes, when administered by a qualified practitioner. At Hive Clinic, we use only premium hyaluronic acid fillers and all treatments are carried out by a fully qualified and insured prescriber." },
  { q: "Will it look natural?", a: "Absolutely. We specialise in subtle, balanced enhancements that complement your natural features. Our approach is always 'less is more' - you'll look like the best version of yourself." },
  { q: "What is facial balancing?", a: "Facial balancing uses filler strategically across multiple areas to create overall facial harmony. Rather than treating one area in isolation, we look at the whole face to achieve the most natural, proportionate result." },
  { q: "How much does dermal filler cost in Manchester?", a: "Dermal filler at Hive Clinic starts from £80 for lip filler (0.5ml). Facial balancing packages start from £350 for 3ml. All treatments include a free consultation." },
];

const DermalFiller = () => {
  usePageMeta(
    "Dermal Filler Manchester City Centre | Hive Clinic",
    "Expert dermal filler treatments from £80 at Hive Clinic, Manchester City Centre. Lip, cheek, jawline and facial balancing by a qualified prescriber. Book today."
  );
  const heroImg = useSiteImage("dermalfiller_hero", gallery4);
  const secondaryImg = useSiteImage("dermalfiller_secondary", gallery1);
  const testimonialImg = useSiteImage("dermalfiller_testimonial", gallery2);

  return (
  <Layout>
    <section className="relative min-h-[80vh] flex items-center">
      <div className="absolute inset-0">
        <img src={heroImg} alt="Dermal filler treatment Manchester - lip, cheek, jawline filler at Hive Clinic" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-transparent" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-xl">
          <p className="font-body text-sm text-gold uppercase tracking-[0.2em] mb-4">Expert Facial Sculpting</p>
          <h1 className="font-display text-5xl md:text-7xl text-white leading-[1.1] mb-6">Dermal Filler Manchester</h1>
          <p className="font-body text-lg text-white/80 mb-6">
            Expert lip, cheek, jawline, and facial balancing treatments from £80. Natural results by a qualified prescriber in Deansgate.
          </p>
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-2"><Shield size={14} className="text-gold" /><span className="font-body text-sm text-white/70">Qualified Prescriber</span></div>
            <div className="flex items-center gap-2"><Award size={14} className="text-gold" /><span className="font-body text-sm text-white/70">5-Star Rated</span></div>
            <div className="flex items-center gap-2"><Clock size={14} className="text-gold" /><span className="font-body text-sm text-white/70">Same-Week Appointments</span></div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/bookings?category=Dermal Filler" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-body text-sm tracking-widest uppercase hover:bg-white/90 transition-colors">
              Book Free Consultation <ArrowRight size={14} />
            </Link>
            <a href="https://wa.me/447795008114" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/40 text-white font-body text-sm tracking-widest uppercase hover:border-white transition-colors">
              Message Us
            </a>
          </div>
        </motion.div>
      </div>
    </section>

    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-display text-4xl md:text-5xl text-center mb-4">Our Dermal Filler Treatments</h2>
        <p className="font-body text-muted-foreground text-center mb-16 max-w-lg mx-auto">From subtle lip enhancement to full facial balancing - every treatment is tailored to your unique features.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {treatments.map((t) => (
            <div key={t.name} className="border border-border p-6 hover:border-gold transition-colors group">
              <h3 className="font-display text-xl mb-2 group-hover:text-gold transition-colors">{t.name}</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">{t.desc}</p>
              <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">From <span className="text-foreground font-display text-xl">{t.from}</span></p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-24 bg-secondary">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="aspect-[4/5] overflow-hidden">
            <img src={secondaryImg} alt="Dermal filler before and after Manchester" className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div>
            <h2 className="font-display text-4xl md:text-5xl mb-6">Why Clients Choose Hive</h2>
            <p className="font-body text-muted-foreground leading-relaxed mb-8">
              Our approach is rooted in facial anatomy and artistry. We don't just inject filler - we sculpt, balance, and enhance your natural beauty with precision.
            </p>
            <div className="space-y-4">
              {["Premium hyaluronic acid fillers only", "Anatomy-led, conservative approach", "Full consultation included", "Facial balancing packages available", "Klarna and Clearpay accepted", "Aftercare support at every step"].map((b) => (
                <div key={b} className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-gold flex-shrink-0" />
                  <span className="font-body text-sm">{b}</span>
                </div>
              ))}
            </div>
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
            { name: "Emily R.", text: "My lips look incredible - subtle, natural, and exactly what I asked for. Bianca is the best in Manchester." },
            { name: "Sophie T.", text: "I had the 5ml facial balancing and the transformation is unreal. Everything just looks so harmonious now." },
            { name: "Aisha M.", text: "I've been to other clinics before and Hive is on another level. The jawline filler has completely changed my profile." },
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
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="font-display text-4xl md:text-5xl mb-4">Real Results</h2>
        <p className="font-body text-muted-foreground mb-12">Natural enhancements, visible transformations.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[secondaryImg, testimonialImg, heroImg].map((img, i) => (
            <div key={i} className="aspect-square overflow-hidden">
              <img src={img} alt={`Dermal filler result ${i + 1} at Hive Clinic Manchester`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-24">
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
          <Link to="/treatments/lip-fillers-manchester" className="px-6 py-3 border border-border hover:border-gold transition-colors font-body text-sm tracking-wider">Lip Fillers</Link>
          <Link to="/treatments/facial-balancing-manchester" className="px-6 py-3 border border-border hover:border-gold transition-colors font-body text-sm tracking-wider">Facial Balancing</Link>
          <Link to="/treatments/anti-wrinkle-injections-manchester" className="px-6 py-3 border border-border hover:border-gold transition-colors font-body text-sm tracking-wider">Anti-Wrinkle Consultation</Link>
        </div>
      </div>
    </section>

    <section className="py-24 bg-secondary">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="font-display text-4xl md:text-5xl mb-4">Ready to Enhance?</h2>
        <p className="font-body text-muted-foreground mb-8">Book a free, no-obligation consultation to discuss your goals with our expert prescriber.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/bookings?category=Dermal Filler" className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-accent transition-colors">
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

export default DermalFiller;
