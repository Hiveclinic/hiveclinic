## Goal

Kill the current "warm beige" look. Rebuild Home + Treatments + Pricing + Bookings shell as a **girly luxury baddie** brand — think Bond Street meets Manchester it-girl. Rose-quartz + chrome + deep burgundy, glossy editorial, magazine layouts, AI-generated lifestyle imagery on every section. Ad-landing-ready (clear hook, social proof above fold, sticky CTA), and lazy-user friendly (one-tap Book paths). All copy stripped of em/en dashes.

## New Visual Identity

**Palette (replaces current beige in `index.css`)**

- `--ink` deep aubergine `#1A0E14`
- `--blush` warm nude `#F4E3DC`
- `--rose` rose-quartz `#E8B4B8`
- `--burgundy` `#5C1A2B` (CTA + accent)
- `--chrome` polished silver `#C9C5BE` (hairlines, frames)
- `--gold` champagne `#C9A66B` (kept, refined)
- White-cream base `#FBF7F4`

**Typography (new pairing, more unique than Cormorant + Satoshi)**

- Display: **Fraunces** (variable serif, soft optical sizes, very "luxury baddie")
- Body: **Inter Tight** (clean modern sans)
- Accent script for hero pull-words: **Italiana** or italic Fraunces
- All caps eyebrow uses 0.32em tracking

**Texture**

- Grain overlay (`bg-noise`) on dark sections
- Soft blush gradients, glass cards (`backdrop-blur` on rose)
- Chrome hairline dividers, gold serif numerals (01 / 02 / 03)
- Subtle Framer scroll reveals, no bouncing

## Page Rebuilds

### Home (`src/pages/Index.tsx` + components)

1. **Hero**: full-bleed AI lifestyle portrait (luxury Manchester girl, soft blush light), oversized italic display "Skin that earns the second look.", tiny eyebrow "Hive Clinic · Manchester", dual CTA (Book Treatment / Free Consultation), 5-star ticker + "as seen on" press row directly under fold.
2. **Sticky mobile Book bar** (always visible on /, /treatments, /pricing) — lazy-user conversion.
3. **Signature Edit** section (3 hero treatments: Lip Filler, Profhilo, Hive Tox Day) with glossy editorial cards, real prices.
4. **The Hive Method** strip (4 icons: Consult / Tailor / Treat / Glow) — ad LP credibility.
5. **Results gallery** redesigned as polaroid wall with chrome frames.
6. **Reviews wall** styled like IG screenshots.
7. **Founder quote** — Bianca portrait left, italic pull-quote right.
8. **Conversion FAQ** (4 questions, Acuity-deep-link CTAs).
9. **Final CTA** dark aubergine block with gold serif "Book your glow." + WhatsApp + Phone.

### Treatments (`src/pages/Treatments.tsx`)

- Mirror live Acuity category structure exactly (already validated in catalog-sync).
- Magazine grid: each category = full-width band with imagery, eyebrow, italic title, intro, then card list of services with exact Acuity names + prices and a per-item "Book" deep-link (fires `trackBookNow`).
- Hive Tox Day pinned top as "Limited" ribbon.

### Pricing (`src/pages/Pricing.tsx`)

- Editorial price index, alphabetical by category, tab switcher (All / Single / Courses / Offers).
- Sticky search.
- Each row: service name (Acuity-exact), duration, price, Book link.

### Bookings (`src/pages/Bookings.tsx` shell)

- Keep Acuity embed, but wrap in luxury frame (blush border, gold corner ornaments, "What happens next" sidebar with 3 steps + reassurance copy).

## Imagery Plan

Generate fresh AI lifestyle imagery via Lovable AI (`google/gemini-3-pro-image-preview`) and store in `site-images` bucket. Replace current stock fallbacks. Set required keys via `useSiteImage`:

- `hero_home` — editorial portrait
- `signature_lips`, `signature_profhilo`, `signature_tox`
- `category_injectables`, `category_skin`, `category_peels`, `category_body`, `category_intimate`
- `founder_portrait`
- `clinic_interior_1`, `clinic_interior_2`
- `texture_blush`, `texture_chrome` (background plates)

Fallback to curated Unsplash in `STOCK` if a key is empty (already supported).

## SEO Uplift

- Expand `usePageMeta` defaults: location keywords ("aesthetic clinic Manchester city centre", "lip filler M3", "Profhilo Manchester").
- Add `MedicalBusiness` + `BreadcrumbList` + `FAQPage` + per-treatment `Service` JSON-LD on landing pages.
- Per-page Open Graph + Twitter card images (use new hero renders).
- Add `<link rel="canonical">` and an `og:image` per page.
- New `public/sitemap.xml` + `public/robots.txt` updated; add `<link rel="preconnect">` for fonts.
- Internal linking: every treatment LP cross-links to 3 related treatments.

## Ad-Landing Readiness

- New reusable `AdHero` variant (props: headline, subhead, offer, image) used on `/lip-filler`, `/anti-wrinkle`, `/dermal-filler`, `/hydrafacial` LPs.
- Above-fold: trust row (5★, Facial Balncing & Skin Specialist, .
- Sticky CTA bar mobile.
- Inline lead form (name, phone, treatment of interest) → writes to existing `leads` table, fires Meta CAPI `Lead` + GA4 `generate_lead`.
- Thank-you state with one-tap WhatsApp.

## Em/En Dash Sweep

Replace every `—` and `–` across `src/` with standard hyphen `-` or rewrite the sentence. Files affected (18): Treatments, Pricing, AntiWrinkle, ConsentForm, HeroSection, EditorialQuote, all admin tabs listed above. Add an eslint-style regex check note in README.

## Technical Steps (in order)

1. **Tokens**: rewrite `:root` in `src/index.css` with new palette + grain utility + `bg-noise`. Extend `tailwind.config.ts` with `ink`, `blush`, `rose`, `burgundy`, `chrome`.
2. **Fonts**: swap Google Fonts import to Fraunces + Inter Tight + Italiana; update `font-display` / body classes.
3. **Imagery**: generate 12 hero/category images via Lovable AI, upload to `site-images` bucket, seed `site_images` table rows.
4. **Components**: rebuild `HeroSection`, `TreatmentShowcase`, `OffersSection`, `WhyHive`, `EditorialQuote`, `FinalCTA`, `SocialProof`, `ResultsGallery`, `PressMarquee`. New `StickyBookBar`, `AdHero`, `LeadInlineForm`.
5. **Pages**: rebuild `Index.tsx`, `Treatments.tsx`, `Pricing.tsx`, `Bookings.tsx` shell.
6. **SEO**: extend `use-page-meta`, add JSON-LD helpers, sitemap, robots, OG images.
7. **Dash sweep**: regex replace across listed files.
8. **Verify**: re-run `catalog-sync-check` to confirm prices still match Acuity; manual mobile QA at 390px.

## Out of scope (this round)

- Other treatment LPs beyond the 4 ad-priority ones (will follow same pattern next).
- Admin dashboard styling (unchanged).
- New analytics events beyond `generate_lead` (existing `trackBookNow` already wired).

## Confirm before I build

- Palette: aubergine + blush + burgundy + champagne + chrome. OK?
- Fonts: Fraunces + Inter Tight + Italiana. OK?
- Hero headline direction: "Skin that earns the second look." (alt: "Manchester's worst-kept beauty secret." / "Soft girl. Sharp results.")
- Sticky mobile Book bar always on. OK?
- Inline lead form on ad LPs (writes to existing `leads`). OK?