import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Video, MapPin, Stethoscope } from "lucide-react";
import Layout from "@/components/Layout";
import gallery3 from "@/assets/gallery-3.jpg";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useSiteImage } from "@/hooks/use-site-image";

const Consultations = () => {
  usePageMeta("Free Consultation Manchester City Centre | Hive Clinic", "Book a free consultation at Hive Clinic, Manchester City Centre. Online or in-person consultations available for all treatments.");
  const heroImg = useSiteImage("consultations_hero", gallery3);
  return (
  <Layout>
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-16">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-gold mb-4">Your Journey Starts Here</p>
          <h1 className="font-display text-5xl md:text-6xl mb-4">Consultations</h1>
          <p className="font-body text-muted-foreground max-w-xl mx-auto leading-relaxed">Every treatment at Hive Clinic begins with a thorough consultation. We take the time to understand your goals and create a personalised plan.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="border border-border p-8 text-center">
            <Video size={24} strokeWidth={1.5} className="text-gold mx-auto mb-4" />
            <h3 className="font-display text-2xl mb-2">Free Online Consultation</h3>
            <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-4">30 minutes · Free</p>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">Suitability check, treatment planning, and pre-book guidance — all from the comfort of your home.</p>
            <Link to="/bookings?category=Consultations" className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background font-body text-xs tracking-widest uppercase hover:bg-accent transition-colors">Book Free Consultation <ArrowRight size={12} /></Link>
          </div>

          <div className="border border-border p-8 text-center">
            <MapPin size={24} strokeWidth={1.5} className="text-gold mx-auto mb-4" />
            <h3 className="font-display text-2xl mb-2">In-Person Consultation</h3>
            <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-4">30 minutes · £25</p>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">Full skin analysis, personalised treatment plan, and aftercare advice. Redeemable against any course or treatment booked.</p>
            <Link to="/bookings?category=Consultations" className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background font-body text-xs tracking-widest uppercase hover:bg-accent transition-colors">Book Now <ArrowRight size={12} /></Link>
          </div>

          <div className="border border-border p-8 text-center">
            <Stethoscope size={24} strokeWidth={1.5} className="text-gold mx-auto mb-4" />
            <h3 className="font-display text-2xl mb-2">Prescriber Consultation</h3>
            <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-4">Anti-Wrinkle · £30</p>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">Required prior to anti-wrinkle injections. This is a separate medical service provided by our prescriber.</p>
            <Link to="/bookings?category=Consultations" className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background font-body text-xs tracking-widest uppercase hover:bg-accent transition-colors">Book Now <ArrowRight size={12} /></Link>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="aspect-[4/5] overflow-hidden">
            <img src={gallery3} alt="Hive Clinic consultation room Manchester" className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div>
            <h2 className="font-display text-4xl mb-6">Why a Consultation Matters</h2>
            <p className="font-body text-muted-foreground leading-relaxed mb-8">A consultation isn't just a formality — it's the foundation of your treatment. We assess your skin, discuss your concerns, and create a bespoke plan that aligns with your goals and budget.</p>
            <div className="space-y-4">
              {["Thorough skin assessment", "Honest, realistic expectations", "No pressure — ever", "Treatment plan tailored to you", "All questions answered"].map(b => (
                <div key={b} className="flex items-center gap-3"><CheckCircle size={14} strokeWidth={1.5} className="text-gold flex-shrink-0" /><span className="font-body text-sm">{b}</span></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  </Layout>
  );
};

export default Consultations;
