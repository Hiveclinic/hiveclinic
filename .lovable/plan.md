

# Plan: Add Appropriate Stock Images Across the Website

## Overview
Currently, all 60+ image slots across the website reuse the same 6 generic gallery photos as fallbacks. This plan replaces those with high-quality, relevant Unsplash stock images that match each treatment/page context.

## Approach
Replace the fallback URLs in each page component's `useSiteImage` calls and in the `IMAGE_SLOTS` config with curated Unsplash stock image URLs. Unsplash provides free, high-quality images accessible via direct URLs (e.g., `https://images.unsplash.com/photo-XXXXX?w=800&q=80`).

## Image Assignments

| Page / Slot | Image Theme |
|---|---|
| **Homepage hero** | Luxury aesthetic clinic interior / beauty treatment |
| **Homepage gallery (6)** | Mix of: glowing skin close-up, lip treatment, facial treatment, skincare products, clinic interior, woman with clear skin |
| **About (2)** | Professional female practitioner portrait, clinic workspace |
| **Lip Fillers (3)** | Close-up lips/face, lip treatment scene, happy client |
| **Dermal Filler (3)** | Facial contouring, injection close-up, elegant woman |
| **Anti-Wrinkle (3)** | Mature skin care, forehead treatment, natural beauty |
| **Skin Boosters (2)** | Dewy/glowing skin, serum application |
| **HydraFacial (2)** | Facial machine treatment, radiant skin |
| **Chemical Peels (2)** | Skin texture, peel application |
| **Microneedling (2)** | Derma pen device, smooth skin |
| **Mesotherapy (2)** | Injection treatment, skin rejuvenation |
| **PRP (2)** | Blood/plasma vial, facial treatment |
| **LED Therapy (2)** | LED mask/panel, glowing skin |
| **Dermaplaning (2)** | Blade treatment, smooth complexion |
| **Facial Balancing (2)** | Symmetrical face, profile beauty |
| **Fat Dissolve (2)** | Body contouring, jawline |
| **Acne Treatment (2)** | Clear skin transformation, skincare routine |
| **Hyperpigmentation (2)** | Even skin tone, dark spot treatment |
| **Consultations (1)** | Consultation/discussion scene |
| **Intimate Peels (1)** | Abstract beauty/wellness |
| **Micro Sclerotherapy (2)** | Leg treatment, smooth legs |
| **Muse Landing (1)** | Content creator/model aesthetic |
| **Results (6)** | Before/after style treatment results |
| **Blog (6)** | Skincare editorial, beauty tips, clinic life |

## Technical Changes

1. **Each treatment page file** (20+ files): Update the fallback parameter in `useSiteImage()` calls from local gallery imports to Unsplash URLs. Remove unused gallery imports.

2. **`AdminSiteTab.tsx`**: Update the `fallback` property in every `IMAGE_SLOTS` entry to use the matching Unsplash URL.

3. **`Index.tsx`**: Update gallery fallbacks to relevant Unsplash URLs.

4. **`Results.tsx`**: Update result image fallbacks.

5. **`Blog.tsx`**: Update blog thumbnail fallbacks.

The local `gallery-*.jpg` assets remain in the repo as a safety net but will no longer be the default display. Admins can still override any image via the dashboard.

## Files Modified
- `src/components/admin/AdminSiteTab.tsx`
- `src/pages/Index.tsx`
- `src/pages/About.tsx`
- `src/pages/LipFillers.tsx`
- `src/pages/LipFillerLanding.tsx`
- `src/pages/DermalFiller.tsx`
- `src/pages/AntiWrinkle.tsx`
- `src/pages/SkinBoosters.tsx`
- `src/pages/HydraFacial.tsx`
- `src/pages/ChemicalPeels.tsx`
- `src/pages/Microneedling.tsx`
- `src/pages/Mesotherapy.tsx`
- `src/pages/PRP.tsx`
- `src/pages/LEDTherapy.tsx`
- `src/pages/Dermaplaning.tsx`
- `src/pages/FacialBalancing.tsx`
- `src/pages/FatDissolve.tsx`
- `src/pages/AcneTreatment.tsx`
- `src/pages/HyperpigmentationTreatment.tsx`
- `src/pages/Consultations.tsx`
- `src/pages/IntimatePeels.tsx`
- `src/pages/MicroSclerotherapy.tsx`
- `src/pages/MuseLanding.tsx`
- `src/pages/Results.tsx`
- `src/pages/Blog.tsx`

