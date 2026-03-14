// Local gallery images used as default fallbacks until replaced via admin dashboard
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";

export const STOCK = {
  // Homepage
  hero_home: gallery1,
  gallery_1: gallery1,
  gallery_2: gallery2,
  gallery_3: gallery3,
  gallery_4: gallery4,
  gallery_5: gallery5,
  gallery_6: gallery6,

  // About
  about_hero: gallery1,
  about_secondary: gallery2,

  // Lip Fillers
  lipfillers_hero: gallery3,
  lipfillers_secondary: gallery4,
  lipfillers_testimonial: gallery5,

  // Lip Filler Landing
  lipfillerlanding_hero: gallery3,
  lipfillerlanding_secondary: gallery4,

  // Dermal Filler
  dermalfiller_hero: gallery2,
  dermalfiller_secondary: gallery5,
  dermalfiller_testimonial: gallery6,

  // Anti-Wrinkle
  antiwrinkle_hero: gallery4,
  antiwrinkle_secondary: gallery1,
  antiwrinkle_tertiary: gallery6,

  // Skin Boosters
  skinboosters_hero: gallery5,
  skinboosters_secondary: gallery2,

  // HydraFacial
  hydrafacial_hero: gallery6,
  hydrafacial_secondary: gallery3,

  // Chemical Peels
  chemicalpeels_hero: gallery1,
  chemicalpeels_secondary: gallery4,

  // Microneedling
  microneedling_hero: gallery2,
  microneedling_secondary: gallery5,

  // Mesotherapy
  mesotherapy_hero: gallery3,
  mesotherapy_secondary: gallery6,

  // PRP
  prp_hero: gallery4,
  prp_secondary: gallery1,

  // LED Therapy
  ledtherapy_hero: gallery5,
  ledtherapy_secondary: gallery2,

  // Dermaplaning
  dermaplaning_hero: gallery6,
  dermaplaning_secondary: gallery3,

  // Facial Balancing
  facialbalancing_hero: gallery1,
  facialbalancing_secondary: gallery4,

  // Fat Dissolve
  fatdissolve_hero: gallery2,
  fatdissolve_secondary: gallery5,

  // Acne Treatment
  acnetreatment_hero: gallery3,
  acnetreatment_secondary: gallery6,

  // Hyperpigmentation
  hyperpigmentation_hero: gallery4,
  hyperpigmentation_secondary: gallery1,

  // Consultations
  consultations_hero: gallery5,

  // Intimate Peels
  intimatepeels_hero: gallery6,

  // Micro Sclerotherapy
  microsclerotherapy_hero: gallery2,
  microsclerotherapy_secondary: gallery3,

  // Muse Landing
  muselanding_hero: gallery1,

  // Results
  results_1: gallery1,
  results_2: gallery2,
  results_3: gallery3,
  results_4: gallery4,
  results_5: gallery5,
  results_6: gallery6,

  // Blog
  blog_1: gallery1,
  blog_2: gallery2,
  blog_3: gallery3,
  blog_4: gallery4,
  blog_5: gallery5,
  blog_6: gallery6,
} as const;
