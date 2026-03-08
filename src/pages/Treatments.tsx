import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star, Sparkles } from "lucide-react";
import Layout from "@/components/Layout";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";
import { usePageMeta } from "@/hooks/use-page-meta";

const categories = [
  { title: "Lip Fillers", desc: "Natural-looking lip enhancement tailored to your face shape. From subtle hydration to a fuller pout.", img: gallery1, link: "/treatments/lip-fillers-manchester", highlight: "Most Popular", startingFrom: "£90" },
  { title: "Anti-Wrinkle", desc: "Precision injections to smooth fine lines and prevent new ones. Includes brow lift, lip flip, masseter slimming.", img: gallery3, link: "/treatments/anti-wrinkle-injections-manchester", highlight: "Preventative & Corrective", startingFrom: "£120" },
  { title: "Dermal Filler", desc: "Expert contouring for cheeks, jawline, chin, nose, and tear troughs.", img: gallery4, link: "/treatments/dermal-filler-manchester", highlight: "Full Facial Balancing", startingFrom: "£90" },
  { title: "HydraFacial", desc: "Deep cleansing, hydrating facials for glass-like skin, acne support, and glow reset.", img: gallery3, link: "/treatments/hydrafacial-manchester", highlight: "Instant Results", startingFrom: "£125" },
  { title: "Chemical Peels", desc: "Targeted peels for face, back, and body — including intimate brightening treatments.", img: gallery4, link: "/treatments/chemical-peels-manchester", highlight: "Face, Body & Intimate", startingFrom: "£85" },
  { title: "Skin Boosters", desc: "Injectable moisturisers for deep hydration and luminous, glass-skin glow.", img: gallery1, link: "/treatments/skin-boosters-manchester", highlight: "Deep Hydration", startingFrom: "£135" },
  { title: "Microneedling", desc: "Advanced collagen induction for texture repair, scarring, pores, and stretch marks.", img: gallery5, link: "/treatments/microneedling-manchester", highlight: "Collagen Boosting", startingFrom: "£140" },
  { title: "Fat Dissolve", desc: "Non-surgical fat reduction for chin, jawline, abdomen, flanks, and arms.", img: gallery6, link: "/treatments/fat-dissolving-manchester", highlight: "Permanent Results", startingFrom: "£125" },
  { title: "Dermaplaning", desc: "Instant smoothness and glow. Remove dead skin and peach fuzz for a flawless complexion.", img: gallery3, link: "/treatments/dermaplaning-manchester", highlight: "Instant Glow", startingFrom: "£75" },
  { title: "LED Light Therapy", desc: "Targeted light therapy to heal, rejuvenate, and transform your skin — zero downtime.", img: gallery5, link: "/treatments/led-light-therapy-manchester", highlight: "Non-Invasive", startingFrom: "£45" },
  { title: "Mesotherapy", desc: "Vitamin-rich micro-injections for face hydration, under eye, and scalp hair support.", img: gallery1, link: "/treatments/mesotherapy-manchester", highlight: "Vitamin Infusion", startingFrom: "£155" },
  { title: "PRP Therapy", desc: "Harness your body's own healing power for skin rejuvenation and hair restoration.", img: gallery4, link: "/treatments/prp-manchester", highlight: "100% Natural", startingFrom: "£325" },
  { title: "Facial Balancing", desc: "Multi-area filler treatment for harmonious facial proportions and symmetry.", img: gallery4, link: "/treatments/facial-balancing-manchester", highlight: "Transformative", startingFrom: "£380" },
  { title: "Micro Sclerotherapy", desc: "Effective treatment for leg thread veins. Reclaim confidence in your skin.", img: gallery5, link: "/treatments/micro-sclerotherapy-manchester", highlight: "Thread Vein Removal", startingFrom: "£225" },
  { title: "Intimate & Body Peels", desc: "Gentle peels for intimate areas and body. Brightening and tone refinement.", img: gallery3, link: "/treatments/intimate-peels-manchester", highlight: "Specialist", startingFrom: "£85" },
  { title: "Consultations", desc: "Free online, in-person, and prescriber consultations. Your journey starts here.", img: gallery3, link: "/treatments/consultations", highlight: "Start Here", startingFrom: "Free" },
];

const Treatments = () => {
  usePageMeta("Treatments | Hive Clinic Manchester City Centre", "Browse all aesthetic treatments at Hive Clinic, Manchester City Centre. Lip fillers, skin boosters, chemical peels, microneedling and more.");
  return (
  <Layout>
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-6">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-gold mb-4">Expert Aesthetics</p>
          <h1 className="font-display text-5xl md:text-6xl mb-4">Our Treatments</h1>
          <p className="font-body text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Every treatment is tailored to you. From subtle enhancements to transformative results — all delivered by qualified practitioners in our Manchester city centre clinic.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-6 mb-16">
          {["Qualified Prescriber", "100+ 5-Star Reviews", "Free Consultations", "Pay Monthly Available"].map((badge) => (
            <div key={badge} className="flex items-center gap-2">
              <Star size={12} className="text-gold fill-gold" />
              <span className="font-body text-xs tracking-wider uppercase text-muted-foreground">{badge}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat, i) => (
            <motion.div key={cat.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }}>
              <Link to={cat.link} className="group block border border-border hover:border-gold/40 transition-all overflow-hidden">
                <div className="aspect-[16/9] overflow-hidden relative">
                  <img src={cat.img} alt={`${cat.title} treatment in Manchester`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <div>
                      <p className="font-body text-xs tracking-widest uppercase text-gold mb-1">{cat.highlight}</p>
                      <h2 className="font-display text-2xl md:text-3xl text-white">{cat.title}</h2>
                    </div>
                    <span className="font-body text-xs text-white/70 tracking-wider">From {cat.startingFrom}</span>
                  </div>
                </div>
                <div className="p-6">
                  <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">{cat.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 font-body text-xs text-gold uppercase tracking-widest group-hover:gap-3 transition-all">Learn More <ArrowRight size={12} /></span>
                    <Link to={`/bookings?category=${encodeURIComponent(cat.title)}`} onClick={(e) => e.stopPropagation()} className="px-4 py-2 bg-foreground text-background font-body text-xs tracking-widest uppercase hover:bg-accent transition-colors">Book Now</Link>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-16 border border-gold/20 p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
          <Sparkles size={22} className="text-gold mx-auto mb-4" />
          <h3 className="font-display text-3xl mb-3">Not Sure Which Treatment Is Right for You?</h3>
          <p className="font-body text-sm text-muted-foreground mb-6 max-w-md mx-auto">Book a free consultation and we'll create a personalised treatment plan.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/bookings?category=Consultations" className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-accent transition-colors">Book Free Consultation <ArrowRight size={14} /></Link>
            <a href="https://wa.me/447795008114" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-10 py-4 border border-border font-body text-sm tracking-widest uppercase hover:border-gold transition-colors">Message on WhatsApp</a>
          </div>
        </motion.div>
      </div>
    </section>
  </Layout>
  );
};

export default Treatments;
