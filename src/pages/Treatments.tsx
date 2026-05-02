import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck, Award, Star } from "lucide-react";
import Layout from "@/components/Layout";
import { usePageMeta } from "@/hooks/use-page-meta";
import { supabase } from "@/integrations/supabase/client";
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
      {/* Editorial hero */}
      <section className="relative bg-summer-gradient pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-sun-soft pointer-events-none" />
        {/* Giant decorative type */}
        <p
          className="absolute -bottom-10 -right-10 font-display italic text-[28vw] leading-none text-gold/[0.05] select-none pointer-events-none"
          aria-hidden
        >
          edit
        </p>

        <div className="relative max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-end">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:col-span-8"
            >
              <p className="font-body text-[11px] tracking-[0.4em] uppercase text-gold mb-6">
                The Hive Edit — Spring / Summer 26
              </p>
              <h1 className="font-display text-6xl md:text-8xl leading-[0.95]">
                A treatment <br />
                <span className="italic text-gold">for every</span> <br />
                version of you.
              </h1>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="md:col-span-4"
            >
              <p className="font-body text-base text-muted-foreground leading-relaxed mb-6">
                From subtle refinements to architectural sculpting — every
                appointment begins with a conversation, and ends with a result
                that feels distinctly you.
              </p>
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 font-body text-[11px] tracking-widest uppercase text-foreground border-b border-gold pb-1 hover:text-gold transition-colors"
              >
                See full price list <ArrowRight size={12} />
              </Link>
            </motion.div>
          </div>

          {/* Trust strip */}
          <div className="mt-16 pt-8 border-t border-sand grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: ShieldCheck, label: "Qualified Prescriber" },
              { icon: Star, label: "100+ Five-Star Reviews" },
              { icon: Sparkles, label: "Free Consultations" },
              { icon: Award, label: "Pay Monthly Available" },
            ].map((b) => (
              <div key={b.label} className="flex items-center gap-3">
                <b.icon size={14} strokeWidth={1.5} className="text-gold" />
                <span className="font-body text-[11px] tracking-widest uppercase text-muted-foreground">
                  {b.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories — magazine-style asymmetric grid */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <p className="text-center font-body text-muted-foreground animate-pulse">
              Loading the edit…
            </p>
          ) : (
            <div className="space-y-20 md:space-y-28">
              {categories.map((cat, i) => {
                const reverse = i % 2 === 1;
                return (
                  <motion.article
                    key={cat.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6 }}
                    className={`grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-14 items-center ${
                      reverse ? "md:[&>*:first-child]:order-2" : ""
                    }`}
                  >
                    {/* Image */}
                    <Link
                      to={cat.link}
                      className="md:col-span-7 group block relative overflow-hidden"
                    >
                      <div className="aspect-[4/5] md:aspect-[16/11] overflow-hidden bg-muted">
                        <img
                          src={cat.img}
                          alt={`${cat.title} treatments at Hive Clinic Manchester`}
                          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-[1200ms] ease-out"
                          loading="lazy"
                        />
                      </div>
                      {/* Floating index */}
                      <div className="absolute top-5 left-5 bg-background/90 backdrop-blur px-3 py-2">
                        <span className="font-display italic text-2xl text-gold">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="font-body text-[10px] tracking-widest uppercase text-muted-foreground ml-2">
                          / {String(categories.length).padStart(2, "0")}
                        </span>
                      </div>
                      {cat.hasOffer && (
                        <div className="absolute top-5 right-5 bg-gold text-background font-body text-[10px] tracking-widest uppercase px-3 py-1.5">
                          Offer
                        </div>
                      )}
                    </Link>

                    {/* Copy */}
                    <div className="md:col-span-5">
                      <p className="font-body text-[10px] tracking-[0.4em] uppercase text-gold mb-4">
                        {cat.treatmentCount} treatment
                        {cat.treatmentCount !== 1 ? "s" : ""}
                      </p>
                      <h2 className="font-display text-4xl md:text-5xl leading-tight mb-3">
                        {cat.title}
                      </h2>
                      <p className="font-display italic text-xl text-gold/80 mb-5">
                        {cat.tagline}
                      </p>
                      <p className="font-body text-sm text-muted-foreground leading-relaxed mb-8 max-w-md">
                        {cat.desc}
                      </p>

                      <div className="flex items-end justify-between border-t border-sand pt-5">
                        <div>
                          <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground mb-1">
                            From
                          </p>
                          <p className="font-display text-3xl">
                            {cat.startingFrom}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                          <Link
                            to={cat.link}
                            className="inline-flex items-center gap-2 font-body text-[11px] tracking-widest uppercase text-foreground hover:text-gold transition-colors"
                          >
                            Explore <ArrowRight size={12} />
                          </Link>
                          <Link
                            to="/bookings"
                            className="inline-flex items-center gap-2 px-5 py-3 bg-foreground text-background font-body text-[11px] tracking-widest uppercase hover:bg-accent transition-colors"
                          >
                            Book
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-28 bg-cream-warm border-t border-sand overflow-hidden">
        <div className="absolute inset-0 bg-sun-soft pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <Sparkles size={22} className="text-gold mx-auto mb-5" />
          <h3 className="font-display text-4xl md:text-5xl mb-5 leading-tight">
            Not sure which treatment is right?
          </h3>
          <p className="font-body text-base text-muted-foreground mb-10 max-w-md mx-auto">
            Book a free consultation and we'll create a personalised plan
            tailored to your goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/bookings#book"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-foreground text-background font-body text-xs tracking-widest uppercase hover:bg-accent transition-colors"
            >
              Book Free Consultation <ArrowRight size={14} />
            </a>
            <a
              href="https://wa.me/447795008114"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 border border-foreground/20 font-body text-xs tracking-widest uppercase hover:border-gold hover:text-gold transition-colors"
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
