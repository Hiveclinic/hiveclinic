import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Star, Shield, Award, Clock, Sparkles, CheckCircle } from "lucide-react";
import Layout from "@/components/Layout";
import TreatmentHelper from "@/components/TreatmentHelper";
import { supabase } from "@/integrations/supabase/client";
import { usePageMeta } from "@/hooks/use-page-meta";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";
import { useSiteImage } from "@/hooks/use-site-image";
import klarnaLogo from "@/assets/klarna-logo.png";
import clearpayLogo from "@/assets/clearpay-logo.png";

const highlights = [
  { title: "Chemical Peels", desc: "Targeted peels for face, back, and body to transform skin tone and texture.", link: "/treatments/chemical-peels-manchester" },
  { title: "HydraFacial", desc: "Deep cleansing facials for glass-like, refreshed skin.", link: "/treatments/hydrafacial-manchester" },
  { title: "Dermal Filler", desc: "Expert lip, cheek, jawline, and facial balancing treatments.", link: "/treatments/dermal-filler-manchester" },
  { title: "Anti-Wrinkle Consultation", desc: "Wrinkle relaxing treatment — consultation required for a naturally refreshed appearance.", link: "/treatments/anti-wrinkle-injections-manchester" },
  { title: "Skin Boosters", desc: "Deep hydration for luminous, glass-like skin.", link: "/treatments/skin-boosters-manchester" },
];

const staticReviews = [
  { name: "Aisha M.", text: "Absolutely the best clinic in Manchester. Bianca is incredible - my skin has never looked better.", stars: 5 },
  { name: "Georgia L.", text: "The attention to detail is unreal. I felt so comfortable and the results were beyond what I expected.", stars: 5 },
  { name: "Priya K.", text: "Finally found somewhere that actually listens. Subtle, natural results every time.", stars: 5 },
  { name: "Sophie R.", text: "Had my lip filler done here and I'm obsessed. So natural, nobody can tell it's filler. Already booked my next appointment.", stars: 5 },
  { name: "Lauren T.", text: "Bianca explained everything so clearly before my anti-wrinkle treatment. Zero pressure, amazing results. Highly recommend.", stars: 5 },
  { name: "Hannah B.", text: "The clinic is gorgeous and spotlessly clean. My HydraFacial left my skin glowing for days. Will be back monthly.", stars: 5 },
];

const trustPoints = [
  { icon: Shield, text: "Qualified & Insured Prescriber" },
  { icon: Award, text: "5-Star Rated on Google" },
  { icon: Clock, text: "Same-Week Appointments Available" },
];

type Offer = {
  id: string;
  name: string;
  slug: string;
  price: number;
  offer_price: number | null;
  offer_label: string | null;
  description: string | null;
  duration_mins: number;
};

const Index = () => {
  usePageMeta(
    "Hive Clinic | Aesthetic Clinic Manchester City Centre",
    "Hive Clinic offers advanced skin treatments in Manchester City Centre including chemical peels, hydrafacial, microneedling, skin boosters and lip enhancement. Book a consultation today."
  );
  const [offers, setOffers] = useState<Offer[]>([]);
  const heroImg = useSiteImage("hero_home", gallery6);
  const gal1 = useSiteImage("gallery_1", gallery1);
  const gal2 = useSiteImage("gallery_2", gallery2);
  const gal3 = useSiteImage("gallery_3", gallery3);
  const gal4 = useSiteImage("gallery_4", gallery4);
  const gal5 = useSiteImage("gallery_5", gallery5);
  const gal6 = useSiteImage("gallery_6", gallery6);
  const galleryImages = [gal1, gal2, gal3, gal4, gal5, gal6];

  useEffect(() => {
    supabase
      .from("treatments")
      .select("id, name, slug, price, offer_price, offer_label, description, duration_mins")
      .eq("active", true)
      .eq("on_offer", true)
      .order("sort_order")
      .then(({ data }) => {
        if (data) setOffers(data as Offer[]);
      });
  }, []);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Hive Clinic - Premium Aesthetics Manchester" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            <h1 className="font-display text-5xl md:text-7xl text-white leading-[1.1] mb-6">
              Manchester's most trusted aesthetics clinic.
            </h1>
            <p className="font-body text-lg text-white/80 mb-4">
              Hive Clinic is a specialist aesthetic clinic located in Manchester City Centre offering advanced skin treatments, lip fillers, and aesthetic procedures in Deansgate.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              {trustPoints.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2">
                  <Icon size={14} className="text-gold" />
                  <span className="font-body text-sm text-white/70">{text}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/bookings?category=Consultations"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-body text-sm tracking-widest uppercase hover:bg-white/90 transition-colors"
              >
                Book Free Consultation <ArrowRight size={14} />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/40 text-white font-body text-sm tracking-widest uppercase hover:border-white transition-colors"
              >
                View Prices
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="py-8 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center gap-8">
          <p className="font-body text-sm text-muted-foreground tracking-wider uppercase">Pay with</p>
          <img src={klarnaLogo} alt="Klarna - pay later" className="h-8" />
          <img src={clearpayLogo} alt="Clearpay - pay in instalments" className="h-8" />
        </div>
      </section>

      {/* Highlights */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl mb-4">Our Treatments</h2>
            <p className="font-body text-muted-foreground max-w-lg mx-auto">
              From subtle enhancements to full facial transformations - every treatment is tailored to you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {highlights.map((h, i) => (
              <motion.div
                key={h.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={h.link}
                  className="block p-6 border border-border hover:border-gold transition-colors group h-full"
                >
                  <h3 className="font-display text-xl mb-3 group-hover:text-gold transition-colors">{h.title}</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{h.desc}</p>
                  <span className="inline-flex items-center gap-1 mt-4 font-body text-xs text-gold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more <ArrowRight size={12} />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Current Offers */}
      {offers.length > 0 && (
        <section className="py-24 bg-secondary">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles size={20} className="text-gold" />
                <h2 className="font-display text-4xl md:text-5xl">Current Offers</h2>
              </div>
              <p className="font-body text-muted-foreground max-w-lg mx-auto">
                Limited-time savings on our most popular treatments.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.map((offer, i) => (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="border border-gold/30 bg-background p-6 h-full flex flex-col group hover:border-gold transition-colors">
                    {offer.offer_label && (
                      <span className="self-start px-3 py-1 bg-gold/10 text-gold font-body text-xs tracking-wider uppercase mb-4">
                        {offer.offer_label}
                      </span>
                    )}
                    <h3 className="font-display text-xl mb-2 group-hover:text-gold transition-colors">{offer.name}</h3>
                    {offer.description && (
                      <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">{offer.description}</p>
                    )}
                    <div className="mt-auto">
                      <div className="flex items-baseline gap-3 mb-4">
                        <span className="font-body text-sm line-through text-muted-foreground">£{Number(offer.price).toFixed(0)}</span>
                        <span className="font-display text-2xl text-gold">£{Number(offer.offer_price).toFixed(0)}</span>
                        <span className="font-body text-xs text-muted-foreground">· {offer.duration_mins} mins</span>
                      </div>
                      <Link
                        to={`/bookings?treatment=${offer.slug}`}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background font-body text-xs tracking-widest uppercase hover:bg-accent transition-colors w-full justify-center"
                      >
                        Book Now <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Before/After Gallery */}
      <section className="py-24 bg-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl mb-4">Real Results, Real Clients</h2>
            <p className="font-body text-muted-foreground">See the transformations for yourself.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="aspect-square overflow-hidden group"
              >
                <img
                  src={img}
                  alt={`Hive Clinic treatment result ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/results"
              className="inline-flex items-center gap-2 font-body text-sm tracking-widest uppercase text-gold hover:text-foreground transition-colors"
            >
              View All Results <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Treatment Helper */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl mb-4">Not Sure Where to Start?</h2>
            <p className="font-body text-muted-foreground">Answer 4 quick questions and we'll recommend the perfect treatment for you.</p>
          </div>
          <TreatmentHelper />
        </div>
      </section>

      {/* Reviews */}
      <section className="py-24 bg-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-display text-4xl md:text-5xl text-center mb-4">Client Reviews</h2>
          <p className="font-body text-muted-foreground text-center mb-16">Rated 5 stars across 100+ Google reviews</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((r) => (
              <div key={r.name} className="p-8 border border-border bg-background">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: r.stars }).map((_, i) => (
                    <Star key={i} size={14} className="fill-gold text-gold" />
                  ))}
                </div>
                <p className="font-body text-foreground/80 mb-6 leading-relaxed italic">"{r.text}"</p>
                <p className="font-body text-sm tracking-wider uppercase text-muted-foreground">{r.name}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <a
              href="https://share.google/mBcefh9rsj2qmoRlJ"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-body text-sm tracking-widest uppercase text-gold hover:text-foreground transition-colors"
            >
              Read All Google Reviews <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl mb-4">The Hive Edit</h2>
            <p className="font-body text-muted-foreground">Expert skincare tips, treatment guides, and clinic news.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { slug: "what-to-expect-first-filler", title: "What to Expect at Your First Filler Appointment", img: gallery1, date: "February 2026" },
              { slug: "lip-filler-aftercare-guide", title: "Lip Filler Aftercare: Your Complete Guide", img: gallery4, date: "January 2026" },
              { slug: "hydrafacial-benefits-skin", title: "5 Benefits of HydraFacial for Every Skin Type", img: gallery3, date: "January 2026" },
            ].map((post) => (
              <Link key={post.slug} to={`/blog/${post.slug}`} className="group">
                <div className="aspect-[4/5] overflow-hidden mb-4">
                  <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
                <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-2">{post.date}</p>
                <h3 className="font-display text-xl mb-2 group-hover:text-gold transition-colors">{post.title}</h3>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/blog" className="inline-flex items-center gap-2 font-body text-sm tracking-widest uppercase text-gold hover:text-foreground transition-colors">
              Read All Posts <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Meet Bianca */}
      <section className="py-24 bg-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="aspect-[4/5] overflow-hidden">
              <img src={gal2} alt="Bianca - practitioner at Hive Clinic Manchester City Centre" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div>
              <p className="font-body text-xs tracking-[0.3em] uppercase text-gold mb-4">The Practitioner</p>
              <h2 className="font-display text-4xl md:text-5xl mb-6">Meet Bianca</h2>
              <p className="font-body text-muted-foreground leading-relaxed mb-6">
                Bianca is the practitioner behind Hive Clinic, specialising in advanced skin treatments and aesthetic procedures designed to improve skin quality and enhance natural features. Treatments are delivered with a focus on consultation, safety and personalised results.
              </p>
              <p className="font-body text-muted-foreground leading-relaxed mb-8">
                With a conservative, anatomy-led approach, every treatment at Hive Clinic is tailored to enhance your natural beauty — never to change it.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 font-body text-sm tracking-widest uppercase text-gold hover:text-foreground transition-colors"
              >
                Learn More About Bianca <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="font-display text-4xl md:text-5xl mb-4">Follow Us on Instagram</h2>
          <p className="font-body text-muted-foreground mb-12">Stay up to date with our latest treatments, results, and clinic news.</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {galleryImages.map((img, i) => (
              <a
                key={i}
                href="https://instagram.com/hiveclinicuk"
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-square overflow-hidden group"
              >
                <img src={img} alt={`Hive Clinic Instagram post ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              </a>
            ))}
          </div>
          <a
            href="https://instagram.com/hiveclinicuk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-body text-sm tracking-widest uppercase text-gold hover:text-foreground transition-colors mt-8"
          >
            @hiveclinicuk <ArrowRight size={14} />
          </a>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-16 border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Shield, text: "Fully insured aesthetic clinic" },
              { icon: CheckCircle, text: "Professional consultation process" },
              { icon: Award, text: "Medical grade skincare products used" },
              { icon: Sparkles, text: "Professional sterile treatment environment" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex flex-col items-center gap-3">
                <Icon size={24} className="text-gold" />
                <p className="font-body text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl md:text-5xl mb-4">Ready to Start Your Journey?</h2>
            <p className="font-body text-muted-foreground mb-8 max-w-lg mx-auto">
              Book a free, no-obligation consultation with Bianca. We'll create a personalised treatment plan tailored to your goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/bookings?category=Consultations"
                className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-accent transition-colors"
              >
                Book Free Consultation <ArrowRight size={14} />
              </Link>
              <a
                href="https://wa.me/447795008114"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-10 py-4 border border-border font-body text-sm tracking-widest uppercase hover:border-gold transition-colors"
              >
                Message Us on WhatsApp
              </a>
            </div>
            <p className="font-body text-xs text-muted-foreground mt-6">
              25 Saint John Street, Manchester M3 4DT - Tue, Thu-Sat
            </p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
