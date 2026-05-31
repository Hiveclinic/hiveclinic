## HNY CLUB landing page — redesign & restructure

A focused rebuild of `/liquid-bbl-manchester`. Keeps the dedicated HNY layout, swaps the visual language to match the rose-gold logo and reference poster, restructures so pricing + Book Consultation surface immediately, and adds the uploaded video and before/after results.

### Assets to wire in
- `user-uploads://B4179565-8DE4-4866-82D6-A3A3B3623F1A.PNG` → `src/assets/hny/logo.png` (rose-gold HNYCLUB wordmark, used in nav + hero)
- `user-uploads://371ddc75ed6b4cc38466a458d8dab885.MOV` → `public/hny/hero.mp4` (converted to web-friendly mp4 via ffmpeg, muted autoplay loop)
- `user-uploads://6C8E750C-...JPG` and `20E7FE6A-...JPG` → `src/assets/hny/result-1.jpg`, `result-2.jpg` (before/after results section)

### Visual direction (less pink, still in Hive Clinic family)
- Replace blush-dominant palette with warm nude + deep mocha + rose-gold accent only:
  - `--hny-cream: #F6F1EA` (page bg)
  - `--hny-nude: #E8DCCB` (section bands)
  - `--hny-mocha: #2A1F1A` (primary text / dark sections like the reference poster)
  - `--hny-rose-gold: #C58B6F` (accent, used sparingly on numbers, dividers, CTA)
  - Pink reduced to a single soft tint used only behind pricing numbers
- Typography change: drop Cormorant Garamond. Use **Tenor Sans** (refined geometric serif-sans, matches the logo's thin uppercase letterforms) for display, **Inter** for body. Loaded via Google Fonts in `index.html`, scoped under `.hny-club`.
- Logo replaces typeset wordmark in both nav and hero (mix-blend on light bg, full-color on dark bg).

### New page structure (pricing + CTA no longer at bottom)

```text
1. NAV (slim, logo + Book Consultation pill)
2. HERO — split: left = headline + 3 trust points + dual CTA (Book Consultation / View Pricing↓)
              right = autoplay muted looping video (the uploaded .MOV)
   Sticky "Book Consultation" appears on mobile from here down.
3. PRICING STRIP (immediately under hero, above the fold on desktop)
   - BBL Filler ml tiers (100/250/300/500/800ml — £499 / £999 / £1,199 / £1,999 / £2,999)
   - Klarna · Clearpay · PayItMonthly chips
   - Inline "Book Consultation" CTA
4. TREATMENT MENU (4 cards: Liquid BBL · Hip Dip Filler · Signature Sculpt · Bespoke 1L Plan)
   - Each card: name, 1-line desc, "from £X", Book button
5. RESULTS — before/after pair using the two uploaded JPGs, with consent caption
6. HOW IT WORKS — 3 steps (Consultation → Plan → Sculpt), ultrasound-led note
7. WHY HNY CLUB — 5 fine-line icon points
8. FAQ — 6 questions (downtime, pain, longevity, suitability, payment plans, consultation fee)
9. FINAL CTA band — Book Consultation + phone + Deansgate address
10. FOOTER (existing HNY footer, trimmed)
```

### Book Consultation button
All Book CTAs route through a single `BOOK_URL` constant in `HnyClub.tsx`. Default: `/bookings` (current Hive flow). When the user shares the external link, swap the one constant. Opens in new tab when external (`target="_blank" rel="noopener"`).

### SEO (one-pager, indexable)
- Title: `Liquid BBL Manchester | HNY CLUB by Hive Clinic` (unchanged)
- Meta description unchanged
- H1: "Liquid BBL & Non-Surgical Body Contouring, Manchester"
- Section H2s aligned with target keywords (liquid bbl manchester, hip dip filler manchester, non-surgical body contouring deansgate)
- JSON-LD: `MedicalBusiness` + `Service` + `FAQPage` (new, from FAQ section) + `BreadcrumbList` + `VideoObject` for the hero video
- Single H1, semantic sections, alt text on logo/results, `loading="lazy"` on below-fold images, `preload="metadata"` on video, canonical already in place

### Video handling
- Convert .MOV → mp4 (h264, faststart) + webm via ffmpeg into `public/hny/`
- `<video autoplay muted loop playsinline poster="">` with poster frame extracted from frame 1
- Reduced motion: respects `prefers-reduced-motion` (pauses, shows poster)

### Files
- **Edit** `src/pages/HnyClub.tsx` — full restructure per outline above
- **Edit** `src/components/HnyLayout.tsx` — replace typeset wordmark with logo image, update palette vars
- **Edit** `src/index.css` — replace `.hny-club` token block (new palette, Tenor Sans + Inter)
- **Edit** `index.html` — add Tenor Sans + Inter Google Fonts link
- **Create** `src/assets/hny/logo.png`, `result-1.jpg`, `result-2.jpg`
- **Create** `public/hny/hero.mp4`, `hero.webm`, `hero-poster.jpg`
- **Delete** the 6 unused generated texture images in `src/assets/hny/` (hero.jpg, card-*.jpg, consultation.jpg) — no longer referenced

### Out of scope
- Site-wide nav/footer (HNY page only)
- Real BOOK_URL (placeholder `/bookings` until you share the link — one-line swap)
- Admin Media Library swap hooks (page now ships with final assets, no fallback layer needed)
