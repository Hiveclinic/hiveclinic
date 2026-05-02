import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Layout from "@/components/Layout";
import { usePageMeta } from "@/hooks/use-page-meta";
import { supabase } from "@/integrations/supabase/client";
import { trackBookNow } from "@/hooks/use-tracking";
import gallery3 from "@/assets/gallery-3.jpg";
import catConsultations from "@/assets/categories/cat-consultations.jpg";
import catDermalFiller from "@/assets/categories/cat-dermal-filler-new.jpg";
import catAntiWrinkle from "@/assets/categories/cat-anti-wrinkle-new.jpg";
import catChemicalPeels from "@/assets/categories/cat-chemical-peels-new.jpg";
import catIntimatePigment from "@/assets/categories/cat-intimate-pigment.jpg";
import catSkinTreatments from "@/assets/categories/cat-skin-treatments.jpg";
import catSkinBoosters from "@/assets/categories/cat-skin-boosters.jpg";
import catMicroneedling from "@/assets/categories/cat-microneedling.jpg";
import catHydrafacial from "@/assets/categories/cat-hydrofacial.jpg";
import catFatDissolve from "@/assets/categories/cat-fat-dissolve.jpg";
import catWellness from "@/assets/categories/cat-wellness.jpg";
import catIvDrip from "@/assets/categories/cat-iv-drip.jpg";
import catFacialBalancing from "@/assets/categories/cat-facial-balancing.jpg";
import catContentModel from "@/assets/categories/cat-content-model.jpg";

const CATEGORY_IMAGES: Record<string, string> = {
  Consultation: catConsultations,
  Consultations: catConsultations,
  "Dermal Filler": catDermalFiller,
  "Anti Wrinkle (Botox)": catAntiWrinkle,
  "Anti-Wrinkle": catAntiWrinkle,
  "Chemical Peels": catChemicalPeels,
  "Intimate Pigment Treatment": catIntimatePigment,
  "Skin Treatments": catSkinTreatments,
  "Skin Boosters": catSkinBoosters,
  Microneedling: catMicroneedling,
  HydroFacial: catHydrafacial,
  "Fat Dissolve": catFatDissolve,
  Wellness: catWellness,
  "IV Drip Therapy": catIvDrip,
  "Facial Balancing": catFacialBalancing,
  "Content Model": catContentModel,
  Lips: catDermalFiller,
  Offers: catChemicalPeels,
  Correction: catConsultations,
};

const CATEGORY_LINKS: Record<string, string> = {
  Consultation: "/treatments/consultations",
  Consultations: "/treatments/consultations",
  "Dermal Filler": "/treatments/lip-fillers-manchester",
  "Anti Wrinkle (Botox)": "/treatments/anti-wrinkle-injections-manchester",
  "Anti-Wrinkle": "/treatments/anti-wrinkle-injections-manchester",
  "Chemical Peels": "/treatments/chemical-peels-manchester",
  "Intimate Pigment Treatment": "/treatments/intimate-peels-manchester",
  "Skin Treatments": "/treatments/microneedling-manchester",
  "Skin Boosters": "/treatments/skin-boosters-manchester",
  Microneedling: "/treatments/microneedling-manchester",
  HydroFacial: "/treatments/hydrafacial-manchester",
  "Fat Dissolve": "/treatments/fat-dissolving-manchester",
  Wellness: "/bookings",
  "IV Drip Therapy": "/bookings",
  "Facial Balancing": "/treatments/facial-balancing-manchester",
  "Content Model": "/content-models",
  Lips: "/treatments/lip-fillers-manchester",
  Offers: "/pricing#offers",
  Correction: "/treatments/consultations",
};

// Categorical taglines for editorial intro lines
const CATEGORY_TAGLINES: Record<string, string> = {
  "Anti Wrinkle (Botox)": "Soften lines. Preserve expression.",
  Lips: "Naturally enhanced. Perfectly proportioned.",
  "Facial Balancing": "Sculpted contours. Architectural harmony.",
  "Skin Boosters": "Hydration that lives in the skin.",
  "Skin Treatments": "Refined texture. Renewed clarity.",
  "Chemical Peels": "Reset the surface. Reveal what's beneath.",
  "Fat Dissolve": "Refine the silhouette. Without surgery.",
  Consultation: "Begin with a conversation.",
  Correction: "Reset and start again.",
  "Content Model": "Premium results. Reduced rates.",
  Offers: "Limited windows. Exceptional value.",
};

// Display order — luxury-first, offers first to drive conversion
const CATEGORY_ORDER = [
  "Offers",
  "Anti Wrinkle (Botox)",
  "Lips",
  "Facial Balancing",
  "Skin Boosters",
  "Skin Treatments",
  "Chemical Peels",
  "Fat Dissolve",
  "Consultation",
  "Correction",
  "Content Model",
];

type CategoryCard = {
  title: string;
  desc: string;
  tagline: string;
  img: string;
  link: string;
  startingFrom: string;
  treatmentCount: number;
  hasOffer: boolean;
};

const Treatments = () => {
  usePageMeta(
    "Treatments | Hive Clinic Manchester City Centre",
    "Browse all aesthetic treatments at Hive Clinic, Manchester City Centre. Lip fillers, skin boosters, chemical peels, microneedling and more.",
  );

  const [categories, setCategories] = useState<CategoryCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTreatments = async () => {
      const { data } = await supabase
        .from("treatments")
        .select(
          "name, category, price, description, image_url, slug, on_offer, offer_price",
        )
        .eq("active", true)
        .order("sort_order");

      if (data) {
        const map = new Map<string, typeof data>();
        for (const t of data) {
          if (!map.has(t.category)) map.set(t.category, []);
          map.get(t.category)!.push(t);
        }

        const ordered: string[] = [];
        for (const c of CATEGORY_ORDER) if (map.has(c)) ordered.push(c);
        for (const c of map.keys()) if (!CATEGORY_ORDER.includes(c)) ordered.push(c);

        const cards: CategoryCard[] = ordered.map((cat) => {
          const list = map.get(cat)!;
          const lowest = Math.min(
            ...list.map((t) =>
              t.on_offer && t.offer_price ? Number(t.offer_price) : Number(t.price),
            ).filter((n) => n > 0),
          );
          const firstWithImage = list.find((t) => t.image_url);
          const firstWithDesc = list.find((t) => t.description);
          const hasOffer = list.some((t) => t.on_offer);

          return {
            title: cat,
            desc:
              firstWithDesc?.description ||
              `Expert ${cat.toLowerCase()} treatments tailored to you.`,
            tagline: CATEGORY_TAGLINES[cat] || "Expert care, beautifully delivered.",
            img: firstWithImage?.image_url || CATEGORY_IMAGES[cat] || gallery3,
            link: CATEGORY_LINKS[cat] || `/bookings?category=${encodeURIComponent(cat)}`,
            startingFrom: !Number.isFinite(lowest) || lowest === 0 ? "Free" : `£${lowest.toFixed(0)}`,
            treatmentCount: list.length,
            hasOffer,
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
      {/* Dark editorial hero — mirrors the Acuity scheduler vibe */}
      <section className="relative bg-foreground text-background pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gold blur-[180px]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-body text-[11px] tracking-[0.45em] uppercase text-gold mb-6"
          >
            The Hive Menu
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="font-display text-5xl md:text-7xl text-background leading-[0.98] max-w-4xl"
          >
            Treatments. <span className="italic text-gold">Tailored to you.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="font-body text-base text-background/55 mt-8 max-w-xl leading-relaxed"
          >
            Select a category to explore. Every treatment mirrors what you'll
            see at booking — same names, same prices, same expert care.
          </motion.p>
        </div>
      </section>

      {/* Acuity-style category list */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          {loading ? (
            <p className="text-center font-body text-muted-foreground animate-pulse">
              Loading the menu…
            </p>
          ) : (
            <div className="border-t border-border">
              {categories.map((cat, i) => (
                <motion.article
                  key={cat.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: i * 0.04, duration: 0.5 }}
                  className="border-b border-border group"
                >
                  <div className="grid grid-cols-12 gap-4 md:gap-8 items-center py-6 md:py-8">
                    {/* Image */}
                    <Link
                      to={cat.link}
                      className="col-span-3 md:col-span-2 block"
                    >
                      <div className="aspect-square overflow-hidden bg-secondary">
                        <img
                          src={cat.img}
                          alt={`${cat.title} treatments at Hive Clinic Manchester`}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                    </Link>

                    {/* Title */}
                    <Link
                      to={cat.link}
                      className="col-span-9 md:col-span-6"
                    >
                      <div className="flex items-baseline gap-3 flex-wrap">
                        <span className="font-display italic text-base text-gold/60">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <h2 className="font-display text-2xl md:text-4xl group-hover:text-gold transition-colors">
                          {cat.title}
                        </h2>
                        {cat.hasOffer && (
                          <span className="font-body text-[9px] tracking-[0.25em] uppercase text-gold border border-gold/40 px-2 py-0.5">
                            Offer
                          </span>
                        )}
                      </div>
                      <p className="font-display italic text-sm md:text-base text-gold/70 mt-1.5">
                        {cat.tagline}
                      </p>
                      <p className="font-body text-[11px] tracking-[0.25em] uppercase text-muted-foreground mt-2">
                        {cat.treatmentCount} {cat.treatmentCount === 1 ? "treatment" : "treatments"}
                      </p>
                    </Link>

                    {/* Price + Book */}
                    <div className="col-span-12 md:col-span-4 md:text-right pt-4 md:pt-0 border-t md:border-t-0 border-border/50 mt-2 md:mt-0">
                      <div className="flex md:flex-col md:items-end items-center justify-between md:gap-3 gap-4">
                        <div className="md:text-right">
                          <p className="font-body text-[10px] tracking-[0.25em] uppercase text-muted-foreground">From</p>
                          <p className="font-display text-2xl md:text-3xl">{cat.startingFrom}</p>
                        </div>
                        <Link
                          to="/bookings#book"
                          onClick={() => trackBookNow("treatments_grid", cat.title)}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background font-body text-[10px] tracking-[0.25em] uppercase hover:bg-gold transition-colors"
                        >
                          Book <ArrowRight size={12} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 md:py-28 bg-foreground text-background border-t border-white/10 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gold blur-[160px]" />
        </div>
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <Sparkles size={20} className="text-gold mx-auto mb-5" />
          <h3 className="font-display text-4xl md:text-5xl mb-5 leading-tight text-background">
            Not sure which treatment is right?
          </h3>
          <p className="font-body text-base text-background/55 mb-10 max-w-md mx-auto">
            Book a free consultation and we'll create a personalised plan
            tailored to your goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/bookings#book"
              onClick={() => trackBookNow("treatments_footer")}
              className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-gold text-white font-body text-xs tracking-[0.25em] uppercase hover:bg-gold-dark transition-colors"
            >
              Book Free Consultation <ArrowRight size={14} />
            </Link>
            <a
              href="https://wa.me/447795008114"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 border border-white/20 text-background font-body text-xs tracking-[0.25em] uppercase hover:border-gold hover:text-gold transition-colors"
            >
              Message on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Treatments;
