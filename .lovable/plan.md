# HNY Club — Font Revert, Palette Fix, Address Fix, Aftercare, Finance Bar

## 1. Font — revert to Cormorant Garamond
In `src/index.css`:
- `.font-display`, `.display-xl`, `.display-lg`, `.font-script` → `'Cormorant Garamond', serif` (italic for script/accents)
- Remove `text-transform: uppercase` from display rules
- Keep `Inter` for body, chips, buttons, small-caps labels
- Drop the `@import` for DM Serif Display

## 2. Palette — 5-shade pink ladder (scoped to `.hny-club`)
Replace pink tokens in `src/index.css`:
- `--hny-petal: #FFE0E9` (page wall, palest)
- `--hny-blush-soft: #FFC2D4` (chips, trust band)
- `--hny-rose: #FF9EBB` (hairlines, dividers, hover)
- `--hny-rose-deep: #FF7AA2` (featured row tint, links)
- `--hny-cranberry: #E05780` (deepest accent, CTA hover)
- `--hny-ink: #0B0B0B`, `--hny-snow: #FFFFFF`

Back-compat aliases (`--hny-cream`, `--hny-mocha`, `--hny-soft-brown`, `--hny-rose-gold`, `--hny-pink`, etc.) remap to this ladder so nothing breaks. CTAs stay solid black on pink; hover flips to `--hny-cranberry`.

## 3. Address fix
`25 Saint John Street, M3 4DT` → `22 St John Street, M3 4EB`
- `src/components/HnyLayout.tsx` footer
- Any JSON-LD `LocalBusiness` block on this page
- Grep other treatment pages for the old address and update wherever it appears

## 4. Aftercare copy
On HNY Club aftercare list:
- Add to "can't" list: **No flights for 2 weeks post-treatment** (DVT/swelling risk, especially long-haul)
- Replace existing "no flying long-haul or prolonged sitting for 7 days" with the 2-week version
- Add to "first month" section: `avoid flights for 2 weeks post-treatment`
- Tighten any residual "no downtime" language

## 5. Finance strip — elegant inline bar (no middots)
Replace the current finance strip under the pricing ledger with a single hairline-bordered bar, items separated by **generous whitespace only** (no `·`, no pipes):

> *From £41/month*   0% APR options   Klarna   Clearpay   PayItMonthly

- Top + bottom hairline: 1px `--hny-rose` at 40% opacity
- Vertical padding: 18px desktop / 14px mobile
- `From £41/month` → Cormorant Garamond italic, 17px, `--hny-ink`
- `0% APR options` → Inter 400, 12px, small-caps, tracked `0.18em`, `--hny-ink`
- `Klarna   Clearpay   PayItMonthly` → Inter 500, 12px, small-caps, tracked `0.22em`, `--hny-rose-deep`
- Item spacing: ~32px gap desktop, ~20px gap mobile (flex with gap, wraps cleanly)
- Mobile (390px): wraps to 2 lines — price + APR on line 1, providers on line 2

## Files touched
- `src/index.css` — fonts, palette, finance bar classes
- `src/pages/HnyClub.tsx` — finance bar markup, aftercare copy
- `src/components/HnyLayout.tsx` — address
- Any other file containing the old address string

No layout moves, no new sections, no changes to anything you liked.
