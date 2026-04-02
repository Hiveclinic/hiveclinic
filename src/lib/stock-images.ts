// Local gallery images used as default fallbacks until replaced via admin dashboard
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";

// Category-specific images for relevant fallbacks
import catDermalFiller from "@/assets/categories/cat-dermal-filler.jpg";
import catAntiWrinkle from "@/assets/categories/cat-anti-wrinkle.jpg";
import catSkinBoosters from "@/assets/categories/cat-skin-boosters.jpg";
import catHydrafacial from "@/assets/categories/cat-hydrofacial.jpg";
import catChemicalPeels from "@/assets/categories/cat-chemical-peels.jpg";
import catMicroneedling from "@/assets/categories/cat-microneedling.jpg";
import catFatDissolve from "@/assets/categories/cat-fat-dissolve.jpg";
import catConsultations from "@/assets/categories/cat-consultations.jpg";
import catIntimatePigment from "@/assets/categories/cat-intimate-pigment.jpg";
import catWellness from "@/assets/categories/cat-wellness.jpg";
import catIvDrip from "@/assets/categories/cat-iv-drip.jpg";
import catSkinTreatments from "@/assets/categories/cat-skin-treatments.jpg";

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

  // Lip Fillers — uses dermal filler category image
  lipfillers_hero: catDermalFiller,
  lipfillers_secondary: gallery4,
  lipfillers_testimonial: gallery5,

  // Lip Filler Landing
  lipfillerlanding_hero: catDermalFiller,
  lipfillerlanding_secondary: gallery4,

  // Dermal Filler
  dermalfiller_hero: catDermalFiller,
  dermalfiller_secondary: gallery5,
  dermalfiller_testimonial: gallery6,

  // Anti-Wrinkle
  antiwrinkle_hero: catAntiWrinkle,
  antiwrinkle_secondary: gallery1,
  antiwrinkle_tertiary: gallery6,

  // Skin Boosters
  skinboosters_hero: catSkinBoosters,
  skinboosters_secondary: catSkinTreatments,

  // HydraFacial
  hydrafacial_hero: catHydrafacial,
  hydrafacial_secondary: gallery3,

  // Chemical Peels
  chemicalpeels_hero: catChemicalPeels,
  chemicalpeels_secondary: catSkinTreatments,

  // Microneedling
  microneedling_hero: catMicroneedling,
  microneedling_secondary: catSkinTreatments,

  // Mesotherapy
  mesotherapy_hero: catSkinBoosters,
  mesotherapy_secondary: catSkinTreatments,

  // PRP
  prp_hero: catSkinBoosters,
  prp_secondary: catSkinTreatments,

  // LED Therapy
  ledtherapy_hero: catConsultations,
  ledtherapy_secondary: catSkinTreatments,

  // Dermaplaning
  dermaplaning_hero: catChemicalPeels,
  dermaplaning_secondary: catSkinTreatments,

  // Facial Balancing
  facialbalancing_hero: catDermalFiller,
  facialbalancing_secondary: catAntiWrinkle,

  // Fat Dissolve
  fatdissolve_hero: catFatDissolve,
  fatdissolve_secondary: gallery5,

  // Acne Treatment
  acnetreatment_hero: catChemicalPeels,
  acnetreatment_secondary: catSkinTreatments,

  // Hyperpigmentation
  hyperpigmentation_hero: catIntimatePigment,
  hyperpigmentation_secondary: catSkinTreatments,

  // Consultations
  consultations_hero: catConsultations,

  // Intimate Peels
  intimatepeels_hero: catWellness,

  // Micro Sclerotherapy
  microsclerotherapy_hero: gallery2,
  microsclerotherapy_secondary: gallery3,

  // Muse Landing
  muselanding_hero: catDermalFiller,

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
