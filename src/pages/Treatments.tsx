import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Star, Sparkles } from "lucide-react";
import Layout from "@/components/Layout";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";
import { usePageMeta } from "@/hooks/use-page-meta";
import { supabase } from "@/integrations/supabase/client";

// Fallback images by category
const CATEGORY_IMAGES: Record<string, string> = {
  "Fillers": gallery1,
  "Anti-Wrinkle": gallery3,
  "Facials": gallery3,
  "Peels": gallery4,
  "Skin Rejuvenation": gallery1,
  "Fat Dissolve": gallery6,
  "Micro Sclerotherapy": gallery5,
  "Consultations": gallery3,
  "Content Model": gallery5,
};

// Fallback links by category slug
const CATEGORY_LINKS: Record<string, string> = {
  "Fillers": "/treatments/lip-fillers-manchester",
  "Anti-Wrinkle": "/treatments/anti-wrinkle-injections-manchester",
  "Facials": "/treatments/hydrafacial-manchester",
  "Peels": "/treatments/chemical-peels-manchester",
  "Skin Rejuvenation": "/treatments/skin-boosters-manchester",
  "Fat Dissolve": "/treatments/fat-dissolving-manchester",
  "Micro Sclerotherapy": "/treatments/micro-sclerotherapy-manchester",
  "Consultations": "/treatments/consultations",
  "Content Model": "/muse",
};

type CategoryCard = {
  title: string;
  desc: string;
  img: string;
  link: string;
  startingFrom: string;
  treatmentCount: number;
};

const Treatments = () => {
  usePageMeta("Treatments | Hive Clinic Manchester City Centre", "Browse all aesthetic treatments at Hive Clinic, Manchester City Centre. Lip fillers, skin boosters, chemical peels, microneedling and more.");

  const [categories, setCategories] = useState<CategoryCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTreatments = async () => {
      const { data } = await supabase
        .from("treatments")
        .select("name, category, price, description, image_url, slug, on_offer, offer_price")
        .eq("active", true)
        .order("sort_order");

      if (data) {
        const categoryMap = new Map<string, typeof data>();
        const categoryOrder: string[] = [];

        for (const t of data) {
          if (!categoryMap.has(t.category)) {
            categoryOrder.push(t.category);
            categoryMap.set(t.category, []);
          }
          categoryMap.get(t.category)!.push(t);
        }

        const cards: CategoryCard[] = categoryOrder.map(cat => {
          const treatments = categoryMap.get(cat)!;
          const lowestPrice = Math.min(...treatments.map(t => {
            if (t.on_offer && t.offer_price) return Number(t.offer_price);
            return Number(t.price);
          }));
          const firstWithImage = treatments.find(t => t.image_url);
          const firstWithDesc = treatments.find(t => t.description);

          return {
            title: cat,
            desc: firstWithDesc?.description || `Expert ${cat.toLowerCase()} treatments tailored to you.`,
            img: firstWithImage?.image_url || CATEGORY_IMAGES[cat] || gallery3,
            link: CATEGORY_LINKS[cat] || `/bookings?category=${encodeURIComponent(cat)}`,
            startingFrom: lowestPrice === 0 ? "Free" : `£${lowestPrice.toFixed(0)}`,
            treatmentCount: treatments.length,
          };
        });

        setCategories(cards);
      }
      setLoading(false);
    };

    fetchTreatments();
  }, []);

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

          {loading ? (
            <div className="py-12 text-center">
              <p className="font-body text-muted-foreground animate-pulse">Loading treatments...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categories.map((cat, i) => (
                <motion.div key={cat.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }}>
                  <Link to={cat.link} className="group block border border-border hover:border-gold/40 transition-all overflow-hidden">
                    <div className="aspect-[16/9] overflow-hidden relative">
                      <img src={cat.img} alt={`${cat.title} treatment in Manchester`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                        <div>
                          <p className="font-body text-xs tracking-widest uppercase text-gold mb-1">{cat.treatmentCount} treatment{cat.treatmentCount !== 1 ? "s" : ""}</p>
                          <h2 className="font-display text-2xl md:text-3xl text-white">{cat.title}</h2>
                        </div>
                        <span className="font-body text-xs text-white/70 tracking-wider">From {cat.startingFrom}</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">{cat.desc}</p>
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-2 font-body text-xs text-gold uppercase tracking-widest group-hover:gap-3 transition-all">Learn More <ArrowRight size={12} /></span>
                        <Link to={`/bookings?category=${encodeURIComponent(cat.title)}`} onClick={(e) => e.stopPropagation()} className="px-4 py-2 bg-foreground text-background font-body text-xs tracking-widest uppercase hover:bg-accent transition-colors">Book Now</Link>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-16 border border-gold/20 p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
            <Sparkles size={22} className="text-gold mx-auto mb-4" />
            <h3 className="font-display text-3xl mb-3">Not Sure Which Treatment Is Right for You?</h3>
            <p className="font-body text-sm text-muted-foreground mb-6 max-w-md mx-auto">Book a free consultation and we'll create a personalised treatment plan.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://hiveclinicuk.setmore.com/book?step=additional-products&products=745f4a19-36cf-403c-8f7e-608f494585db&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-accent transition-colors">
                Book Free Consultation <ArrowRight size={14} />
              </a>
              <a href="https://wa.me/447795008114" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-10 py-4 border border-border font-body text-sm tracking-widest uppercase hover:border-gold transition-colors">Message on WhatsApp</a>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Treatments;
