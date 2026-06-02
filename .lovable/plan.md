## What's wrong now

- **Wrong font direction.** The HNY CLUB logo is a tall geometric **sans-serif** in rose-gold (Tenor Sans / Jost / Outfit family), not a serif. Italiana on the prices reads "AI display font", especially on numerals (£499, 100ml).
- **Pink is too pale.** The current `#FBE4DA` is washed out vs. the deeper rose-mauve wall in the brand photo.
- **Pricing cards feel generic.** Solid blocks, a tacky pink pill, and Italiana numerals don't read "luxury beauty counter".

## The new concept (one direction, executed cleanly)

**"Boutique counter"** — a quiet, rose-gold boutique aesthetic. Geometric all-caps sans throughout (mirrors the logo metal), deepened pink walls, rose-gold hairline frames on the cards, no pills, no gradients.

### 1. Type system (scoped to `.hny-club` only — rest of site untouched)

- **Display:** `Tenor Sans` — clean tall geometric sans, all caps, wide tracking (0.18-0.32em). Used for H1/H2, tier volumes, prices.
- **Body:** `Inter` 300/400 — already in use, stays.
- **Small accent / "from £X/mo":** `Inter` italic at 10-11px, mocha at 70%.
- **Drop completely:** Italiana, Cormorant Garamond (from this sub-brand only).

H1 example: `HEY BABE, READY TO JOIN THE HNY CLUB?` in Tenor Sans all-caps, wide tracking — directly echoes the logo lockup.

### 2. Palette deepen (CSS variables only)

```
--hny-cream:      #EFC9BE   (was #FBE4DA — deeper warm pink wall)
--hny-cream-card: #F6D9CF   (card surface)
--hny-nude:       #E8B8AA   (alt section)
--hny-rose-gold:      #C28F78
--hny-rose-gold-deep: #A06B55   (logo metal exact)
--hny-mocha:      #3C1F16   (deeper cocoa ink)
```

Hex pulled from the suite-wall photo; rose-gold matches the logo letter colour.

### 3. Pricing card redesign

```text
┌─────────────────────────┐
│         · 100ML ·       │   ← Tenor Sans, tracked, mocha
│                         │
│         £499            │   ← Tenor Sans 300, large, rose-gold
│                         │
│   ────  hairline  ────  │
│                         │
│    soft enhancement     │   ← Inter, mocha 70%
│      from £41/mo        │   ← Inter italic, rose-gold
└─────────────────────────┘
```

- **Frame:** 1px solid rose-gold hairline (no shadows, no gradients).
- **Featured tiers (300ml, 500ml):** 1px solid rose-gold-deep border + a tiny top-centre tab that reads `· MOST LOVED ·` in tracked Tenor Sans (no pink pill, no rounded background).
- **Layout:** 2-col mobile / 3-col desktop, equal-height, very slight hover lift (translateY -2px) + border colour deepens. No card-to-card gradients.
- **No emojis, no `♡`** — replaced with mid-dot separators `·`.

### 4. Buttons / pills (carry the new vocabulary)

- Already squared, solid pink. I'll keep them squared but switch the active colour from `--hny-pink-deep` to `--hny-rose-gold-deep` (logo metal) so CTAs match the boutique aesthetic, with the same mocha-invert on hover.

### 5. Apply once, ripple through the page

Because everything is scoped variables + a few utility classes (`.display-xl`, `.display-lg`, `.btn-dainty`, `.price-card`), the new direction propagates through every section on `/liquid-bbl-manchester` automatically — hero, marquee, treatment, what-to-expect, do's & don'ts, FAQ, final letter. No copy changes.

## Files touched

- `src/index.css` — palette variables, `.font-display`, `.display-xl`, `.display-lg`, `.btn-dainty`, `.price-card` rules inside the `.hny-club` scope.
- `src/pages/HnyClub.tsx` — replace the pink `LOVED` pill with the tracked top-centre tab; tighten the card markup (volume + price + hairline + descriptor + monthly); remove the heart accent in tier eyebrows.

That's it. No new fonts to import beyond Tenor Sans (already loaded globally). No layout shifts elsewhere on the site.

## After approval

Switch to build mode and I'll apply the change in one pass, then screenshot the pricing grid at 390px to verify it reads as a boutique counter, not a SaaS pricing table.