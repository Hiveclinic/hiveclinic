## HNY CLUB — Liquid BBL Manchester (one-page rebuild)

A focused rebuild of `/liquid-bbl-manchester` only. Hive Clinic main site is untouched. Goal: a luxury, ultrasound-led, ads-ready landing page with a clear path to **Book a Virtual Chat (Instagram/WhatsApp)** or **Secure your slot (£100 deposit)**.

### Inspiration blend
- **Serenity / London Beauty / Aesthetic Ace / CLNQ** — sticky pricing rail, big hero, trust strip, before/after, FAQ, sticky bottom CTA on mobile.
- **Acuity / Shopify polish** — clean rounded cards, generous spacing, soft shadows, micro-pill chips for payment plans, large clickable price tiles (not a wall of text).

### Brand & visual direction
- Drop the pink-heavy palette. Pull the **rose-gold from the HNY logo** as the single accent over a warm nude/cream base + deep mocha ink. Logo rendered large and **transparent** (mix-blend on light, full-colour on dark hero band).
- Typography stays Tenor Sans (display) + Inter (body), already loaded.
- No em dashes anywhere in copy. Standard hyphens only.
- Replace stock placeholder hero with a **generated AI hero woman** (luxe editorial portrait, soft warm lighting, side profile / back silhouette suggesting body contouring without explicit clinical imagery) — passes content filters and on-brand.

### Page structure (single page, anchor-linked nav)

```text
1. SLIM NAV  — big transparent HNY logo left, anchors: Pricing · Plans · Results · FAQ, "Book Virtual Chat" pill right
2. HERO (above the fold)
   - Left: H1 "Liquid BBL & Non-Surgical Body Contouring, Manchester"
           sub: ultrasound-led · medically qualified · Deansgate
           3 trust pills (Ultrasound-Guided · 0% Payment Plans · 500+ Treatments)
           Dual CTA: [Book Virtual Chat on Instagram] [WhatsApp Us]
           Tertiary text link: "Secure your slot from £100 deposit"
   - Right: AI hero woman image, rose-gold gradient wash, logo overlay top-right
   - Sticky mobile CTA bar appears from here down
3. PAYMENT PLANS STRIP (full-width band, rose-gold tint)
   - "Spread the cost. Treat yourself today."
   - Klarna · Clearpay · PayItMonthly chips, large logos
   - "From £41/month on a 12-month plan" headline figure
   - Inline [See Pricing ↓] [Book Virtual Chat]
4. PRICING (the hero of the page — large, scannable, clickable)
   - Section title "Transparent Pricing"
   - 5 price tiles in 2 rows (desktop) / horizontal snap-scroll (mobile):
     100ml £499 · 250ml £999 · 300ml £1,199 · 500ml £1,999 · 800ml £2,999 · 1L £3,499 (Bespoke)
   - Each tile: ml badge · price · "from £X/month with Klarna" · Book button (links to virtual chat)
   - Below: "£100 deposit secures your slot, redeemable against treatment"
5. WHY HNY CLUB — 4 fine-line icons:
   Ultrasound-Guided · Medically Qualified · Discreet Deansgate Suite · Aftercare Included
6. HOW IT WORKS — 3 steps (Virtual Chat → Plan & Deposit → In-Clinic Sculpt)
7. RESULTS — before/after pair (existing uploaded JPGs) with consent caption + carousel-ready layout
8. WHAT'S INCLUDED — bullet list of inclusions, ultrasound emphasis
9. FAQ — 8 questions (downtime, pain, longevity, suitability, payment plans, deposit policy, virtual chat, safety)
10. FINAL CTA BAND (dark mocha)
    - "Ready to be sculpted?"
    - [DM on Instagram] [WhatsApp Chat] [Secure £100 Deposit]
    - Address · phone · opening hours
11. FOOTER (trimmed HNY footer)
```

### CTAs & conversion plumbing
- **Three destinations**, all centralised as constants in `HnyClub.tsx`:
  - `INSTAGRAM_URL` → `https://instagram.com/hiveclinicuk` (DM CTA)
  - `WHATSAPP_URL` → `https://wa.me/447795008114?text=Hi%20HNY%20CLUB%2C%20I%27d%20like%20to%20book%20a%20virtual%20chat%20about%20Liquid%20BBL`
  - `DEPOSIT_URL` → `/bookings` (swap when external Setmore/Stripe link supplied)
- Language: **"Virtual Chat"** everywhere, never "consultation" in CTAs. Body copy may still reference clinic consultation flow where compliance requires.
- Hide the existing WhatsApp floating button on this route to avoid CTA clash (the in-page CTAs replace it).

### Ads readiness (Google + Meta)
- Single H1, semantic sections, descriptive alt text, lazy images below the fold.
- All CTAs as real `<a>`/`<Link>` (no JS-only buttons) so Google Ads + Meta Pixel can track.
- Fire existing tracking hooks (`use-tracking.ts`) on CTA clicks: `Lead` event on virtual chat clicks, `InitiateCheckout` on deposit click.
- Meta CAPI: reuse current Pixel integration; no new events needed beyond mapping the 3 CTAs.
- Mobile-first: 16px+ body, 44px+ tap targets, sticky bottom CTA, price tiles reflow to snap-scroll.

### SEO
- Title/description unchanged (already optimised).
- H1: "Liquid BBL & Non-Surgical Body Contouring, Manchester"
- JSON-LD: `MedicalBusiness` + `Service` + `FAQPage` + `BreadcrumbList` + `Offer` (per price tier) + `VideoObject` if hero video retained.
- Anchor links in nav double as internal jump links for dwell-time + crawl signals.
- Keep canonical, sitemap entry already in place.

### Hero media decision
Replace the current video with the AI woman still as primary hero (faster LCP, ads-friendly). Keep the existing `hero.mp4` as an optional muted loop in a smaller "atmosphere" slot inside the Results or Why section — or drop entirely if it slows mobile. **Default: drop the video from the hero, keep the still.** One-line revert if you want it back.

### Files
- **Edit** `src/pages/HnyClub.tsx` — full restructure per outline
- **Edit** `src/components/HnyLayout.tsx` — bigger transparent logo, anchor nav (Pricing/Plans/Results/FAQ), Virtual Chat pill instead of Book Consultation, hide global WhatsApp button on this route (or guard in `App.tsx`)
- **Edit** `src/index.css` — minor token tweak: stronger rose-gold accent, payment-plan band tint
- **Create** `src/assets/hny/hero-woman.jpg` (generated, premium tier for legibility-safe editorial portrait)
- **Keep** existing logo, result-1/2, hero.mp4 (mp4 demoted or removed from render)

### Out of scope
- Site-wide nav/footer
- Real Stripe deposit checkout (uses `/bookings` placeholder until you share the link)
- New backend / database changes
- Touching any other Hive Clinic route

### Open question before build
Only one: **WhatsApp number** — confirm `+44 7795 008114` (the number used by the global WhatsApp button) is the correct line for HNY virtual chats, or share a different one.
