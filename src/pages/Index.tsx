import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import TreatmentHelper from "@/components/TreatmentHelper";
import { supabase } from "@/integrations/supabase/client";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useSiteImage } from "@/hooks/use-site-image";
import { STOCK } from "@/lib/stock-images";
import { motion } from "framer-motion";

import HeroSection from "@/components/home/HeroSection";
import TreatmentShowcase from "@/components/home/TreatmentShowcase";
import ResultsGallery from "@/components/home/ResultsGallery";
import SocialProof from "@/components/home/SocialProof";
import BlogPreview from "@/components/home/BlogPreview";
import FinalCTA from "@/components/home/FinalCTA";
import WhyHive from "@/components/home/WhyHive";

const staticReviews = [
  { name: "Sarah J.", text: "I had lip fillers done by Bianca and I'm so happy with the results. She listened to what I wanted and made me feel so comfortable.", stars: 5 },
  { name: "Laura M.", text: "The clinic is beautiful and the staff are so friendly. I had the hydrafacial and my skin has never felt so good!", stars: 5 },
  { name: "Amy S.", text: "I was nervous about getting anti-wrinkle injections but Bianca was so gentle and explained everything so well. I'm so pleased with the results.", stars: 5 },
];

const Index = () => {
  usePageMeta(
    "Hive Clinic | Aesthetic Clinic Manchester City Centre",
    "Advanced aesthetic treatments in Manchester City Centre. Lip fillers, dermal filler, anti-wrinkle, skin boosters, HydraFacial and more. Book your consultation today."
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

  // JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "name": "Hive Clinic",
    "description": "Advanced aesthetic treatments in Manchester City Centre",
    "url": "https://hiveclinic.lovable.app",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "25 Saint John Street",
      "addressLocality": "Manchester",
      "postalCode": "M3 4DT",
      "addressCountry": "GB"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "reviewCount": "100",
      "bestRating": "5"
    },
    "priceRange": "££"
  };

  return (
    <Layout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection heroImg={heroImg} />
      <WhyHive />
      <TreatmentShowcase />
      <ResultsGallery images={galleryImages} />
      <SocialProof reviews={reviews} />
      {/* Treatment Finder */}
      <section className="py-20 md:py-28 border-b border-border" aria-label="Treatment finder">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="font-body text-[10px] tracking-[0.3em] uppercase text-gold mb-3">Not Sure Where to Start?</p>
              <h2 className="font-display text-3xl md:text-4xl mb-4">Find your perfect treatment.</h2>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                Answer a few quick questions and we'll recommend the best treatments for your goals and skin type.
              </p>
            </motion.div>
            <TreatmentHelper />
          </div>
        </div>
      </section>
      <BlogPreview />
      <FinalCTA />
    </Layout>
  );
};

export default Index;
