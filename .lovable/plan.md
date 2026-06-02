## Direction

Rebuild the HNY CLUB page on a clean **black + white + three-pink** system that transitions out of the main hiveclinicuk.com home (black ink stays the through-line, beige/gold/mocha are gone). Then replace the 4-card pricing block with the **full editorial flyer** layout from your reference image — all 10 tiers plus the 1L bespoke note, big serif headline, rose-pink chips, hairline ledger, trust band.

## The new palette (scoped to `.hny-club` only)

No browns. No copper rose-gold. Just black, white, and three pinks that ladder cleanly.

| Token | Hex | Use |
|---|---|---|
| `--hny-ink` | `#0B0B0B` | Headlines, prices, body ink — bridges with main site black |
| `--hny-snow` | `#FFFFFF` | Price ledger card, contrast surfaces |
| `--hny-petal` | `#FBE7E0` | Page wall — palest baby pink |
| `--hny-blush` | `#F4CFC4` | Chips, alt sections, trust band |
| `--hny-rose` | `#E8A597` | Dividers, hover, hairlines, accent |

Buttons become **solid black on pink** (matches main site CTAs), with a `--hny-rose` ghost variant for secondaries. CTA hover = black → rose. No more rose-gold metal anywhere.

## Type system

- **Display:** `DM Serif Display` (Google Font) — heavier editorial serif, the one in your flyer. Replaces Tenor Sans for headlines. Used for `INTRODUCTORY PRICING`, section H2s, prices.
- **Eyebrow / chips / labels:** `Inter` 500 small-caps, tracked `0.28em`.
- **Body:** `Inter` 300/400.

Italiana is fully removed. Tenor Sans stays only on the logo lockup (existing asset).

## The pricing section — editorial flyer build

```text
┌─────────────────────────────────────────┐
│                                         │   ← petal wall (#FBE7E0)
│   [HNY CLUB logo]                       │
│   INTRODUCTORY                          │
│   PRICING                               │   ← DM Serif Display, ink, ~88px
│   Ultrasound-led Liquid BBL & Hip Dip   │
│                                         │
│   [⌖ DEANSGATE, MANCHESTER]             │   ← blush chip, ink text, small-caps
│   [⌖ CONSULTATION REQUIRED]             │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │  100ml                  £499    │   │   ← snow card, ink ink
│   │  ─────── hairline rose ──────── │   │
│   │  150ml                  £649    │   │
│   │  200ml                  £799    │   │
│   │  250ml                  £999    │   │
│   │  300ml                  £1,199  │   │   ← bold row (most loved)
│   │  350ml                  £1,449  │   │
│   │  400ml                  £1,699  │   │
│   │  500ml                  £1,999  │   │   ← bold row (most loved)
│   │  600ml                  £2,399  │   │
│   │  800ml                  £2,999  │   │
│   │  ─────────────────────────────  │   │
│   │  1L bespoke sculpt — consult    │   │   ← italic footnote
│   └─────────────────────────────────┘   │
│                                         │
│   · LIQUID BBL · HIP DIP FILLER ·       │   ← marquee, rose
│     BODY CONTOURING ·                   │
│                                         │
│  ╔═════════════════════════════════════╗│
│  ║  ⎙  PAYMENT PLANS  │  ⌖  2-WEEK     ║│   ← blush trust band
│  ║     AVAILABLE       │   REVIEW &     ║│
│  ║                     │   SUPPORT      ║│
│  ╚═════════════════════════════════════╝│
│                                         │
│   DM TO ENQUIRE OR BOOK YOUR CONSULT    │   ← eyebrow
│   [SECURE £100 DEPOSIT] [BOOK CONSULT]  │   ← black pills
│   [CHAT FIRST XX]                       │
└─────────────────────────────────────────┘
```

Mobile (390px): everything stacks. Price ledger goes edge-to-edge (12px gutter), ml left / £ right, 13px Inter for ml + 15px DM Serif for price, rows ~44px tall. Total ledger fits without scrolling on one screen.

Featured rows (300ml, 500ml): subtle blush row-background `#FBE7E0` + slightly bolder ink, no pill, no badge.

## Site-wide palette ripple

Because the new tokens are CSS variables, the rest of the HNY page (hero, marquee, what-to-expect, do's & don'ts, FAQ, final letter) automatically swings to the new black/white/pink system — same components, no copy or layout changes outside the pricing block.

## Pricing data update

```ts
const pricing = [
  { ml: "100ml", price: "£499" },
  { ml: "150ml", price: "£649" },
  { ml: "200ml", price: "£799" },
  { ml: "250ml", price: "£999" },
  { ml: "300ml", price: "£1,199", featured: true },
  { ml: "350ml", price: "£1,449" },
  { ml: "400ml", price: "£1,699" },
  { ml: "500ml", price: "£1,999", featured: true },
  { ml: "600ml", price: "£2,399" },
  { ml: "800ml", price: "£2,999" },
];
// + 1L bespoke footnote (consultation only, no public price)
```

Each row stays a WhatsApp deep-link (`waLink(p.ml)`) so the booking funnel is unchanged.

## Files touched

- **`src/index.css`** — replace `.hny-club` CSS variables (3 pinks + ink + snow); swap `font-display` / `display-xl` / `display-lg` to DM Serif Display; rewrite `btn-dainty` / `btn-ghost` to black-on-pink; remove `price-card` / `price-card-featured` / `price-tab` (replaced by ledger styles); add `.price-ledger`, `.price-row`, `.price-row-featured`, `.hny-chip`, `.trust-band`. Add `@import` for DM Serif Display.
- **`src/pages/HnyClub.tsx`** — replace the pricing grid (currently lines ~255-300) with the editorial flyer block: headline + chips + 10-row ledger + 1L footnote + marquee strip + trust band + CTA row. Update `pricing` array to 10 tiers.
- **`src/components/HnyLayout.tsx`** — swap header CTA colour from `--hny-pink-deep` to `--hny-ink` (black-on-pink, matches main site).

## After build

Screenshot at 390px to verify: (a) headline doesn't wrap awkwardly, (b) the full 10-row ledger fits one screen, (c) chips and trust band sit on the right pink tones, (d) page transitions feel continuous with hiveclinicuk.com when navigating in.

Ready to switch to build mode and ship.