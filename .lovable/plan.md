# Booking flow + visual polish pass

## Problems being fixed

1. **Booking page is confusing** — `/bookings` (`BookingSystem.tsx`) is dense and disorganised. The Pricing page layout already works perfectly.
2. **Acuity is a one-way street** — `useBookNow` does `window.location.href = ...`, which navigates away from the site entirely (no back button works because Acuity is a different origin). Should open in a new tab so the site stays underneath.
3. **Treatment cards on Treatments page look clickable but aren't always** — `<Link>` wraps the image/title but doesn't deep-link to Acuity; users expect to land on the booking calendar in 1 click.
4. **No imagery above the fold on mobile** — hero image is in a side column that drops below the copy on small screens, so phone users see only text first.
5. **Everything looks zoomed on phone** — display sizes (`clamp(2.6rem,8.5vw,6.4rem)`, large hero padding) are too aggressive on 375–414px viewports.
6. **Klarna/Clearpay logos** — files already exist (`src/assets/klarna-logo.png`, `clearpay-logo.png`) but are never rendered. Need to surface them in the hero trust row + footer + booking page.
7. **Image regression** — some category cards now use AI-generated replacements; user wants the originals from hiveclinicuk.com restored.
8. **Fonts feel airy** — letter-spacing slightly too open; user wants tighter and a touch more "girly luxury".

## Plan

### 1. Booking page — rebuild as the Pricing layout

- **Delete** `src/pages/BookingSystem.tsx` content, replace with the exact structure of `Pricing.tsx` (hero + sticky category nav + grouped price tables + footer CTA).
- Keep route `/bookings` so all existing internal links still work.
- Rename hero copy to focus on **booking** not pricing ("Book your treatment" / "Tap any service to book instantly").
- Each row's "Book" button calls `useBookNow({ category, appointmentTypeId })` so users land directly on the right Acuity service in 1 tap.
- Add an FAQ accordion (3–4 items: consultation requirement, deposit, rescheduling, prescriber consult).
- Redirect `/pricing` → `/bookings` (or keep both pointing to the same component) so we have one source of truth and stop duplicating maintenance.

### 2. Open Acuity minimised on same page like before **tab** (so back button works)

In `src/hooks/use-book-now.ts`, change:

```
window.location.href = buildUrl(opts);
```

to:

```
window.open(buildUrl(opts), "_blank", "noopener,noreferrer");
```

This means the Hive site stays open in the original tab — closing the Acuity tab returns to where they were.

### 3. Treatments page — make cards genuinely clickable to Acuity

- Replace inner `<Link to={cat.link}>` (which currently goes to a static info page) with a single `<button>` that calls `useBookNow(cat.title)`.
- Optional small "Learn more" text link on each row for the info page, so the card itself = book, the secondary link = read.
- Keep current category card layout (it matches the Pricing page rhythm well).

### 4. Mobile sizing pass

- Hero: reorder so the **image renders first on mobile** (`flex-col-reverse` at `<lg`), and shrink the display clamp to `clamp(2.1rem, 9vw, 6.4rem)`.
- Reduce hero vertical padding on mobile from `pt-12 pb-16` to `pt-6 pb-10`.
- Globally tighten section padding on mobile via the existing `.section-y` utility (already uses `clamp(4rem, 9vw, 8rem)` — drop the lower bound to `2.5rem`).
- Treatments/Pricing page: shrink category h2 from `text-2xl md:text-4xl` to `text-xl md:text-3xl`, image col from `col-span-3` to `col-span-4` on mobile so it reads as a card not a thumbnail.

### 5. Klarna / Clearpay logos

- Hero trust row (`HeroSection.tsx`): replace the text "Klarna / Clearpay" with the two PNG logos (h-4, opacity-70).
- Footer (`Layout.tsx`): add the same two logos in the "Payments" line.
- New `/bookings` page: small "Pay in 3 with Klarna or Clearpay" strip under the hero with both logos.

### 6. Image restoration

- Revert `Treatments.tsx` `CATEGORY_IMAGES` map to the **original (non `-new`)** assets that were used before:
  - `cat-anti-wrinkle.jpg` (not `-new`)
  - `cat-chemical-peels.jpg` (not `-new`)
  - `cat-dermal-filler.jpg` (not `-new`)
- Restore `cat-skin-rejuvenation.jpg` and `cat-wellness.jpg` from git history (they were overwritten with AI versions in the last pass — I can pull them back via `git show HEAD~N:path > file`).
- Add the **luxe imagery set** (`src/assets/luxe/*.jpg`) into homepage gallery + Why Hive section so original brand photography is surfaced front-and-centre. Note: the live site `hiveclinicuk.com` couldn't be scraped during exploration, so I'll use the photography already in the repo (gallery-1…6, luxe set, bianca.jpg, cat-* originals). If you want specific photos pulled from the live site, please paste/upload them.

### 7. Typography — tighter + slightly more feminine

In `src/index.css`:

- Body letter-spacing: `0.005em` → `-0.005em`.
- Display (Tenor Sans) letter-spacing: `0.005em` → `-0.01em`, line-height tightened on h1 from `0.95` → `0.92`.
- Eyebrow: keep wide tracking (it's the editorial signature).
- Add a softer italic accent: swap `Marcellus` italic for `**Italiana**` (same family of high-end editorial serifs but with a more feminine, slightly script-adjacent feel) on `.display-italic` only — keeps body/headings neutral and only adds the "girly luxury" on accent words like *Sharp results.*
- Numerals: keep Tenor lining figures.

### 8. Tracking

- All new Book buttons fire `trackBookNow(source, category, treatment)` so analytics still works after the new-tab change.

## Files touched

- `src/pages/BookingSystem.tsx` — full rewrite (Pricing layout + FAQ + Klarna strip)
- `src/pages/Pricing.tsx` — could either redirect to `/bookings` or stay as alias; will keep alias to avoid breaking SEO
- `src/pages/Treatments.tsx` — card → direct Acuity book button, image map reverted
- `src/hooks/use-book-now.ts` — `window.open(_blank)` instead of nav
- `src/components/home/HeroSection.tsx` — image-first on mobile, smaller clamp, Klarna+Clearpay logos
- `src/components/Layout.tsx` — Klarna/Clearpay logos in footer
- `src/index.css` — tighter tracking, Italiana accent font, mobile section padding
- Restore overwritten image files from git history

## What I'm NOT doing (please flag if you want any of these)

- I'm **not** scraping hiveclinicuk.com photos — the fetch timed out. Will use existing originals in the repo. If you want exact photos from the live site, drag-and-drop them in chat and I'll swap them in.
- I'm **not** touching the admin dashboard layout.
- I'm **not** changing the colour palette (already locked to nude+cocoa+aubergine+rose).