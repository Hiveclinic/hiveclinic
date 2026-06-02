## HNY CLUB — Editorial Information Rebuild (Gucci / Juicy Couture energy)

Recast `/liquid-bbl-manchester` as a fashion-house style editorial one-pager. Oversized type, magazine grid, lookbook imagery, chaptered sections that read like a brand book. Every piece of info a client needs (prepare, what to expect, aftercare, FAQs) lives on the page. CTAs to WhatsApp / Instagram / £100 deposit are the conversion engine. Built to rank locally on Google for BBL filler, body contouring, body filler, non-surgical BBL, hip dip filler in Manchester.

### Visual direction — match the HNY logo
- Pull the logo's exact colour story as the source of truth: warm rose-gold / blush / champagne on cream, deep mocha ink, hot baddie-pink accent. No new palette; everything keys off the logo.
- Masthead nav with oversized transparent logo, ultra-thin uppercase anchor links, hairline rule
- Hero as full-bleed editorial cover: oversized Tenor Sans H1 left ("THE LIQUID BBL"), tiny kicker ("HNY CLUB / VOL. 01 / MANCHESTER"), lookbook image right
- Type scale pushed magazine-large (clamp 48-140px display), tracked-out uppercase eyebrows, Inter body in long-form columns
- Chapter dividers: "CHAPTER 01 — PREPARE" with numerical rules, like a printed lookbook
- Sexy-luxury girl energy: blush gradients, soft grain, generous negative space, gold hairlines
- Imagery only, no decorative icons. **Use the user-uploaded images** (existing `hero-baddie.jpg`, `result-1/2.jpg`, `lifestyle-1/2.jpg`, `logo.png`, `payitmonthly-logo.png`) — crop/resize via CSS `object-fit` and aspect-ratio frames to fit each editorial slot. No new AI imagery.
- Subtle scroll-reveal fades via framer-motion (already installed)
- **No em dashes anywhere.** Standard hyphens only, copy will be re-audited.

### Page architecture (single page, anchor-linked)

```text
1.  MASTHEAD NAV       Logo + anchors (Treatment, Pricing, Prepare, Aftercare, FAQ, Book)
2.  EDITORIAL HERO     Oversized H1, kicker, dual CTA, lookbook image
3.  MARQUEE STRIP      Scrolling tagline (BBL Filler, Non-Surgical BBL, Hip Dip Filler, Body Contouring, Manchester, 0% Plans)
4.  CHAPTER 01 - THE TREATMENT
    What a Liquid BBL is, who it's for, how it differs from surgical BBL, results timeline
5.  CHAPTER 02 - THE PRICELIST
    Large clickable price tiles 100ml to 1L, Klarna and PayItMonthly inline figures, £100 deposit note
6.  CHAPTER 03 - PAYMENT PLANS
    Klarna, Clearpay, PayItMonthly side-by-side, example monthly breakdowns, eligibility note
7.  CHAPTER 04 - WHAT TO EXPECT
    In-clinic journey step by step: arrival, assessment, ultrasound mapping, treatment, recovery, leaving
8.  CHAPTER 05 - PREPARE
    Two-week, 48-hour, day-of checklists (hydration, avoid blood thinners, no alcohol, eat beforehand, comfy clothing)
9.  CHAPTER 06 - AFTERCARE
    First 24h, first week, first month, do's and don'ts, when results settle, when to contact us
10. CHAPTER 07 - RESULTS
    Editorial before/after pair using existing uploaded JPGs, consent caption
11. CHAPTER 08 - THE EXPERIENCE
    Lifestyle imagery + copy on the Deansgate suite, discretion, the HNY CLUB feeling
12. CHAPTER 09 - FAQ
    12 questions: downtime, pain, longevity, suitability, contraindications, plans, deposit, virtual chat, reversibility, complications, flying, exercise
13. EDITORIAL CTA BAND Dark mocha, oversized type, three CTAs (Instagram, WhatsApp, £100 Deposit), address/phone/hours
14. FOOTER             Existing HNY footer (unchanged)
```

### Content (no em dashes, compliant phrasing)
- Prepare checklist (2-week / 48h / day-of)
- Aftercare checklist (24h / 1 week / 1 month) with "contact us" trigger list
- What to expect walkthrough (6-8 steps, editorial tone)
- Expanded FAQ (add: contraindications, who isn't suitable, can it be reversed, complications, can I fly, when can I exercise, when can I sit normally)
- Marquee tagline loop
- Chapter intros (1-2 paragraphs each), keyword-rich but readable

### SEO (rank on Google for Manchester BBL / body contouring terms)
**Target keyword cluster** woven naturally into H1/H2/H3, intros, FAQ answers, alt text, JSON-LD:
- liquid bbl manchester · non-surgical bbl manchester · bbl filler manchester · body filler manchester · body contouring manchester · hip dip filler manchester · sculptra bbl alternative · non surgical butt lift manchester · buttock filler manchester · 0% finance bbl

**On-page**
- Single H1: "Liquid BBL Manchester — Non-Surgical Body Contouring & Hip Dip Filler at HNY CLUB" (hyphen, not em dash)
- Each chapter H2 carries a secondary keyword
- Long-form copy ~1,800-2,200 words total (Google rewards depth on commercial pages)
- Descriptive alt text on every uploaded image with location + treatment keywords
- Internal anchor nav doubles as crawl/dwell signal
- Lazy-load below-fold imagery for LCP

**Structured data (extend existing JSON-LD)**
- `MedicalBusiness` with `areaServed: Manchester`, geo, opening hours, image
- `Service` with `serviceType: Non-Surgical BBL`, `provider`, `areaServed`
- `Offer` per price tier (100ml £499 through 1L £3,499)
- `FAQPage` with all 12 Q&As
- `HowTo` for "What to Expect" steps
- `BreadcrumbList`
- `LocalBusiness` aggregate rating (only if real reviews available; otherwise omit to stay compliant)

**Off-page hooks (note for follow-up, not built this pass)**
- Ensure `/liquid-bbl-manchester` is in `public/sitemap.xml` with high priority
- Canonical to itself

### CTAs (plumbing unchanged)
- `INSTAGRAM_URL`, `WHATSAPP_URL`, `DEPOSIT_URL` constants already in `HnyLayout.tsx`
- "Virtual Chat" wording on initial CTAs; "Secure your slot - £100 deposit" on deposit CTA
- Every price tile clickable → WhatsApp pre-filled with chosen ml tier
- Sticky mobile CTA bar stays

### Mobile
- Hero stacks, lookbook image first
- Chapter numbering as inline eyebrow on mobile, left-margin rail on desktop
- Price tiles → horizontal snap-scroll
- Prepare / Aftercare checklists → accordions to control length
- 44px+ tap targets, sticky bottom CTA unchanged

### Files to edit
- `src/pages/HnyClub.tsx` — full restructure to chapter model, expanded copy, expanded JSON-LD
- `src/components/HnyLayout.tsx` — nav anchors updated to new chapter IDs, masthead spacing tweaks
- `src/index.css` — add editorial tokens (chapter rule, marquee keyframes, oversize display clamps); palette unchanged, pulled from logo
- `public/sitemap.xml` — verify `/liquid-bbl-manchester` entry priority

### Reuse only
- All imagery: existing uploaded files in `src/assets/hny/` — cropped/resized via CSS, no regeneration
- Logo: existing transparent PNG
- Fonts: Tenor Sans + Inter (already loaded)

### Out of scope
- Hive Clinic main site
- Real Stripe deposit checkout (stays `/bookings` until link supplied)
- New imagery generation
- Backend or schema changes

### One question before build
Confirm the price tiers stay as currently shown (100ml £499 · 250ml £999 · 300ml £1,199 · 500ml £1,999 · 800ml £2,999 · 1L £3,499), or send updated figures so I bake the correct prices into the tiles and `Offer` schema in one pass.
