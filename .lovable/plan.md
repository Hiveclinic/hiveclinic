## HNY CLUB by Hive Clinic — Liquid BBL landing page

A premium, editorial sub-brand page rendered inside the existing Hive Clinic site, but with its own slim top nav and softer visual identity. The rest of the website is untouched.

### Route & files

- New route: `/liquid-bbl-manchester` (registered in `src/App.tsx`)
- New page: `src/pages/HnyClub.tsx`
- New layout (HNY CLUB only): `src/components/HnyLayout.tsx` — slim nav (Home / Treatments / Skin / Injectables / HNY CLUB / Book Consultation), Hive Clinic footer reused, HNY CLUB link injected into Quick Links
- Logo slot: `src/assets/hny-club-logo.png` placeholder (commented "replace with uploaded logo"); the hero falls back to a typeset wordmark — "HNY CLUB" in Cormorant serif with "by Hive Clinic" underneath — until you upload one
- Sitemap entry added in `public/sitemap.xml`; "HNY CLUB" added to footer Quick Links sitewide

### Visual system (scoped to this page)

Tokens added under a `.hny-club` scope in `src/index.css` so nothing leaks to other pages:

- Blush `#F7EBE5`, cream `#FBF6F1`, champagne `#E8D5C0`, soft brown `#7A5C4B`, rose-gold `#C9A78B → #B08968` gradient
- Headings: Cormorant Garamond (already loaded); body: Satoshi (already loaded)
- Buttons: rose-gold gradient with subtle inner highlight, generous letter-spacing, no harsh black
- Cards: cream with 1px champagne hairline, soft shadow
- Spacing: generous, editorial; smaller hero than typical Hive pages

### Page sections

1. **Hero** — small refined wordmark, headline, subtext, 3 inline trust points, two CTAs (Book Consultation £100 / View Introductory Prices anchor), Klarna + Clearpay payment chip, single tasteful editorial image
2. **Trust bar** — slim row with 5 line-icon items
3. **Treatments** — 4 cream cards (Liquid BBL, Hip Dip Filler, Signature Sculpt, Bespoke 1L Sculpt Plan) with images and "Learn more"
4. **Pricing + Payment plans** — two-column: left pricing table (Standard vs Introductory, 8 rows + disclaimer), right large Klarna & Clearpay cards with copy
5. **Consultation & Treatment Planning** — text + bullets + £100 redeemable note + CTA, paired with a luxury consultation-room image
6. **Why HNY CLUB** — 5 icon cards using approved wording only (no banned phrases)
7. **Pre-care / Aftercare** — two side-by-side cards + PDF note
8. **Final CTA** — heading, text, big Book Consultation £100 button, Klarna/Clearpay line
9. **Footer** — existing Hive Clinic footer with HNY CLUB link added

All CTAs link to `/bookings`. A persistent floating "Book Consultation" button on mobile keeps booking visible.

### Imagery

Generated now via `imagegen` (premium where it matters): hero (editorial soft-nude body contouring), 4 treatment thumbnails, 1 consultation/ultrasound scene, 1 ambient pricing-section image. All loaded through `useSiteImage` so the admin Media Library can swap each one to a real clinic photo later without code changes — image keys: `hny_hero`, `hny_card_liquid_bbl`, `hny_card_hip_dip`, `hny_card_signature_sculpt`, `hny_card_bespoke_1l`, `hny_consultation`, `hny_pricing_ambient`.

### SEO (per-route via existing `usePageMeta` hook)

- Title: `Liquid BBL Manchester | HNY CLUB by Hive Clinic`
- Description: `Ultrasound-led Liquid BBL, hip dip filler and non-surgical body contouring at Hive Clinic, Deansgate Manchester. Consultation required. Payment plans available.`
- Canonical: `https://hiveclinicuk.com/liquid-bbl-manchester`
- Keywords/H tags target: Liquid BBL Manchester, non-surgical BBL Manchester, hip dip filler Manchester, body/buttock filler Manchester, ultrasound-led body contouring Manchester, Deansgate aesthetics clinic
- JSON-LD: MedicalBusiness + Service + BreadcrumbList + Offer (introductory pricing)
- Sitemap entry added

### Compliance / copy guardrails

Banned phrases excluded: "medical-led", "doctor-led", "guaranteed results", "surgery alternative", "safe guaranteed". Approved language used throughout: ultrasound-led, consultation-led, suitability assessed, tailored, structured, safety-focused, realistic results. Consultation suitability disclaimer present.

### Responsive

- Mobile: single column, pricing table converted to stacked rows with clear Standard/Introductory labels, sticky Book Consultation bar at bottom
- Desktop: two-column pricing + payment, generous max-w-6xl spacing

### Out of scope

- Site-wide nav changes (HNY CLUB nav is page-scoped per your answer)
- Uploading the final HNY CLUB logo (typeset fallback ships now; drop the PNG into `src/assets/hny-club-logo.png` and it auto-appears)
- Real clinic photography (generated editorial images ship now; swap via Admin → Media Library)
