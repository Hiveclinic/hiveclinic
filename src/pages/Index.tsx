import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Star, Shield, Award, Clock, CheckCircle, Sparkles, MapPin } from "lucide-react";
import Layout from "@/components/Layout";
import TreatmentHelper from "@/components/TreatmentHelper";
import { supabase } from "@/integrations/supabase/client";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useSiteImage } from "@/hooks/use-site-image";
import { STOCK } from "@/lib/stock-images";
import klarnaLogo from "@/assets/klarna-logo.png";
import clearpayLogo from "@/assets/clearpay-logo.png";

const SETMORE_CONSULTATION = "https://hiveclinicuk.setmore.com/book?step=date-time&products=745f4a19-36cf-403c-8f7e-608f494585db&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=true";

const highlights = [
  { title: "Lip Fillers", desc: "Subtle volume and natural definition.", link: "/treatments/lip-fillers-manchester", from: "£120" },
  { title: "Dermal Filler", desc: "Restore volume and smooth fine lines.", link: "/treatments/dermal-filler-manchester", from: "£150" },
  { title: "Anti-Wrinkle", desc: "Soften lines and prevent new ones forming.", link: "/treatments/anti-wrinkle-manchester", from: "£140" },
  { title: "Skin Boosters", desc: "Radiant, hydrated complexion.", link: "/treatments/skin-boosters-manchester", from: "£130" },
  { title: "HydraFacial", desc: "Deep cleanse, exfoliate, and hydrate.", link: "/treatments/hydrafacial-manchester", from: "£150" },
  { title: "Chemical Peels", desc: "Medical-grade skin renewal.", link: "/treatments/chemical-peels-manchester", from: "£85" },
];

const trustPoints = [
  { icon: Shield, text: "Qualified Prescribers" },
  { icon: Award, text: "5-Star Rated" },
  { icon: Clock, text: "Same-Week Bookings" },
  { icon: CheckCircle, text: "Premium Products" },
  { icon: Sparkles, text: "Natural Results" },
];

const staticReviews = [
  { name: "Sarah J.", text: "I had lip fillers done by Bianca and I'm so happy with the results. She listened to what I wanted and made me feel so comfortable.", stars: 5 },
  { name: "Laura M.", text: "The clinic is beautiful and the staff are so friendly. I had the hydrafacial and my skin has never felt so good!", stars: 5 },
  { name: "Amy S.", text: "I was nervous about getting anti-wrinkle injections but Bianca was so gentle and explained everything so well. I'm so pleased with the results.", stars: 5 },
];

const Index = () => {
  usePageMeta(
    "Hive Clinic | Aesthetic Clinic Manchester City Centre",
    "Hive Clinic offers advanced skin treatments in Manchester City Centre including chemical peels, hydrafacial, microneedling, skin boosters and lip enhancement. Book a consultation today."
  );
  const [reviews, setReviews] = useState(staticReviews);
  const heroImg = useSiteImage("hero_home", STOCK.hero_home);
  const gal1 = useSiteImage("gallery_1", STOCK.gallery_1);
  const gal2 = useSiteImage("gallery_2", STOCK.gallery_2);
  const gal3 = useSiteImage("gallery_3", STOCK.gallery_3);
  const gal4 = useSiteImage("gallery_4", STOCK.gallery_4);
  const gal5 = useSiteImage("gallery_5", STOCK.gallery_5);
  const gal6 = useSiteImage("gallery_6", STOCK.gallery_6);
  const galleryImages = [gal1, gal2, gal3, gal4, gal5, gal6];

  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 80]);

  useEffect(() => {
    supabase
      .from("reviews")
      .select("name, text, stars")
      .eq("active", true)
      .order("created_at", { ascending: false })
      .limit(6)
      .then(({ data }) => {
        if (data && data.length > 0) setReviews(data as { name: string; text: string; stars: number }[]);
      });
  }, []);

  return (
    <Layout>
      {/* Hero - Full viewport, editorial */}
      <section className="relative min-h-screen flex items-end overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <img
            src={heroImg}
            alt="Hive Clinic - Premium Aesthetics Manchester"
            className="w-full h-[110%] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        </motion.div>

        <div className="relative z-10 w-full">
          {/* Trust ticker */}
          <div className="border-b border-white/10">
            <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
              {trustPoints.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2">
                  <Icon size={12} className="text-gold" strokeWidth={1.5} />
                  <span className="font-body text-[11px] text-white/50 tracking-[0.15em] uppercase">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-2xl"
            >
              <p className="font-body text-[11px] tracking-[0.3em] uppercase text-gold mb-6">
                Manchester City Centre
              </p>
              <h1 className="font-display text-[clamp(2.5rem,7vw,5.5rem)] text-white leading-[1.05] mb-6">
                Where science meets artistry.
              </h1>
              <p className="font-body text-base md:text-lg text-white/60 leading-relaxed mb-10 max-w-lg">
                Advanced aesthetic treatments delivered with precision and care in the heart of Deansgate.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={SETMORE_CONSULTATION}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-3 px-10 py-4 bg-white text-foreground font-body text-[11px] tracking-[0.2em] uppercase hover:bg-gold hover:text-white transition-all duration-300"
                >
                  Book Consultation
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </a>
                <Link
                  to="/bookings"
                  className="inline-flex items-center justify-center gap-3 px-10 py-4 border border-white/20 text-white font-body text-[11px] tracking-[0.2em] uppercase hover:border-white/60 transition-colors duration-300"
                >
                  View Treatments
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Payment strip */}
      <section className="py-6 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center gap-8">
          <span className="font-body text-[11px] text-muted-foreground tracking-[0.2em] uppercase">Pay in instalments with</span>
          <img src={klarnaLogo} alt="Klarna" className="h-6 opacity-60 hover:opacity-100 transition-opacity" />
          <img src={clearpayLogo} alt="Clearpay" className="h-6 opacity-60 hover:opacity-100 transition-opacity" />
        </div>
      </section>

      {/* Treatments - Editorial grid */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16"
          >
            <div>
              <p className="font-body text-[11px] tracking-[0.3em] uppercase text-gold mb-3">Treatments</p>
              <h2 className="font-display text-4xl md:text-5xl leading-tight">Tailored to you.</h2>
            </div>
            <Link
              to="/bookings"
              className="inline-flex items-center gap-2 font-body text-[11px] tracking-[0.2em] uppercase text-muted-foreground hover:text-gold transition-colors"
            >
              View full menu <ArrowRight size={12} />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
            {highlights.map((h, i) => (
              <motion.div
                key={h.title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  to={h.link}
                  className="block bg-background p-8 md:p-10 group h-full hover:bg-secondary transition-colors duration-300"
                >
                  <div className="flex items-start justify-between mb-6">
                    <h3 className="font-display text-2xl group-hover:text-gold transition-colors duration-300">{h.title}</h3>
                    <ArrowRight size={16} className="text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-gold transition-all duration-300 mt-2 -translate-x-2 group-hover:translate-x-0" />
                  </div>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">{h.desc}</p>
                  <p className="font-body text-[11px] tracking-[0.15em] uppercase text-gold">From {h.from}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Results gallery - Masonry-style */}
      <section className="py-24 md:py-32 bg-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="font-body text-[11px] tracking-[0.3em] uppercase text-gold mb-3">Results</p>
            <h2 className="font-display text-4xl md:text-5xl mb-4">Real clients. Real transformations.</h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {galleryImages.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className={`overflow-hidden group ${i === 0 ? "row-span-2 aspect-[3/4]" : "aspect-square"}`}
              >
                <img
                  src={img}
                  alt={`Hive Clinic treatment result ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/results"
              className="inline-flex items-center gap-2 font-body text-[11px] tracking-[0.2em] uppercase text-gold hover:text-foreground transition-colors"
            >
              View all results <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* Treatment finder */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="font-body text-[11px] tracking-[0.3em] uppercase text-gold mb-3">Not sure?</p>
              <h2 className="font-display text-4xl md:text-5xl mb-6">Find your perfect treatment.</h2>
              <p className="font-body text-muted-foreground leading-relaxed">
                Answer a few quick questions and we will recommend the best treatments for your goals and skin type.
              </p>
            </motion.div>
            <TreatmentHelper />
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-24 md:py-32 bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16"
          >
            <div>
              <p className="font-body text-[11px] tracking-[0.3em] uppercase text-gold mb-3">Reviews</p>
              <h2 className="font-display text-4xl md:text-5xl text-background">Rated 5 stars across 100+ reviews.</h2>
            </div>
            <a
              href="https://share.google/mBcefh9rsj2qmoRlJ"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-body text-[11px] tracking-[0.2em] uppercase text-gold hover:text-background transition-colors"
            >
              Google reviews <ArrowRight size={12} />
            </a>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px">
            {reviews.map((r, i) => (
              <motion.div
                key={r.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 md:p-10 border border-white/8"
              >
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: r.stars }).map((_, j) => (
                    <Star key={j} size={12} className="fill-gold text-gold" />
                  ))}
                </div>
                <p className="font-body text-background/70 leading-relaxed mb-8 italic text-sm">"{r.text}"</p>
                <p className="font-body text-[11px] tracking-[0.2em] uppercase text-background/40">{r.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog preview */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16"
          >
            <div>
              <p className="font-body text-[11px] tracking-[0.3em] uppercase text-gold mb-3">The Hive Edit</p>
              <h2 className="font-display text-4xl md:text-5xl">Expert guides and clinic news.</h2>
            </div>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 font-body text-[11px] tracking-[0.2em] uppercase text-muted-foreground hover:text-gold transition-colors"
            >
              All posts <ArrowRight size={12} />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { slug: "what-to-expect-first-filler", title: "What to Expect at Your First Filler Appointment", img: STOCK.blog_1, date: "February 2026" },
              { slug: "lip-filler-aftercare-guide", title: "Lip Filler Aftercare: Your Complete Guide", img: STOCK.blog_2, date: "January 2026" },
              { slug: "hydrafacial-benefits-skin", title: "5 Benefits of HydraFacial for Every Skin Type", img: STOCK.blog_3, date: "January 2026" },
            ].map((post, i) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={`/blog/${post.slug}`} className="group block">
                  <div className="aspect-[4/5] overflow-hidden mb-5">
                    <img
                      src={post.img}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                  </div>
                  <p className="font-body text-[11px] text-muted-foreground tracking-[0.15em] uppercase mb-3">{post.date}</p>
                  <h3 className="font-display text-xl group-hover:text-gold transition-colors duration-300">{post.title}</h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-32 md:py-40 bg-secondary overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="w-full h-full" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)", backgroundSize: "40px 40px" }} />
        </div>
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="font-body text-[11px] tracking-[0.3em] uppercase text-gold mb-6">Get started</p>
            <h2 className="font-display text-4xl md:text-6xl mb-6">Your journey begins here.</h2>
            <p className="font-body text-muted-foreground mb-10 max-w-md mx-auto">
              Book a free phone consultation - no obligation, just a friendly chat about your goals.
            </p>
            <a
              href={SETMORE_CONSULTATION}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-12 py-5 bg-foreground text-background font-body text-[11px] tracking-[0.2em] uppercase hover:bg-gold transition-colors duration-300"
            >
              Book Free Consultation
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <div className="flex items-center justify-center gap-2 mt-8">
              <MapPin size={12} className="text-muted-foreground" strokeWidth={1.5} />
              <p className="font-body text-[11px] text-muted-foreground tracking-[0.1em]">25 Saint John Street, Manchester M3 4DT</p>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
