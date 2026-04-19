

## Migrate from Setmore to Acuity Scheduling

### Goal
Replace every Setmore touchpoint with Acuity, embed the Acuity scheduler as a premium in-page experience on `/bookings`, and add embedded schedulers on high-intent treatment landing pages. Keep existing Stripe/deposit/admin infrastructure untouched (per your answer).

### What you still need to send
Paste your Acuity embed snippet (the `<iframe ...>` plus the `embed.js` `<script>` Acuity gives you under **Customize Appearance → Direct scheduling page → Embed**). I'll drop it into a single `AcuityEmbed` component so it's used everywhere consistently.

If you also have **category-specific** Acuity URLs (e.g. an "owner=XXX&appointmentType=YYY" link for Lips), share those too - they'll power the high-intent embeds. Otherwise all embeds show the full scheduler.

---

### 1. New shared component: `AcuityEmbed`
- `src/components/AcuityEmbed.tsx`
- Loads Acuity's `embed.js` once, renders the iframe inside a centered, max-width 900px, cream-background container with 80px vertical padding.
- Props: `appointmentTypeId?` (filters scheduler to one category), `minHeight?` (default ~900px), `className?`.
- Mobile: `width: 100%`, no horizontal scroll, removes Acuity's default border.
- Brand wrapper: soft cream (`bg-secondary`), no harsh borders, generous whitespace - matches the editorial aesthetic.

### 2. `/bookings` page rebuild (`src/pages/BookingSystem.tsx`)
- Remove the entire SERVICES array, CATEGORIES, OfferCard, search/filter UI.
- Keep: page header, Offers + Content Model highlight banners (now linking to scrolled embed), FAQ section.
- New layout:
  ```text
  Hero (title + subtitle)
  Offers / Content Model banners (compact)
  <AcuityEmbed id="book" />     ← centered, 900px, cream bg, 80px padding
  FAQ
  ```
- Scroll-to-section anchor: `#book`.

### 3. Global "Book Now" button behaviour
- New helper `useBookNow()` hook (or simple util):
  - On `/bookings`: smooth scroll to `#book`.
  - Anywhere else: `navigate('/bookings#book')`.
- Update `Layout`/`NavLink`/sticky mobile button/`HeroSection`/`FinalCTA`/`ModelCTA`/`TreatmentChatbot` etc. to use it. No `target="_blank"`, no Setmore URLs.

### 4. Treatment pages - mixed strategy
- **Embed scheduler at bottom of high-intent pages** (Book Now scrolls to it):
  - `LipFillers`, `LipFillerLanding`, `FacialBalancing`, `AntiWrinkle`, `DermalFiller`, `MuseLanding`
  - Use `<AcuityEmbed appointmentTypeId={...} />` if you supply category IDs, else full scheduler.
- **Link to `/bookings#book`** (no embed) for all other pages:
  - `HydraFacial`, `ChemicalPeels`, `SkinBoosters`, `FatDissolve`, `Microneedling`, `Dermaplaning`, `LEDTherapy`, `Mesotherapy`, `PRP`, `MicroSclerotherapy`, `Consultations`, `IntimatePeels`, `AcneTreatment`, `HyperpigmentationTreatment`, `BlogPost`, `Treatments`.

### 5. Sweep & remove all Setmore references
- Replace every `https://hiveclinicuk.setmore.com/...` link with the Book Now helper across **~28 files** (homepage `HeroSection`, `FinalCTA`, `OffersSection`, `MuseLanding`, all treatment pages, `BlogPost`, `Treatments`, etc.).
- Rename the `SETMORE_CONSULTATION` constant in `HeroSection.tsx` and remove similar constants elsewhere.
- Update the comment in `Treatments.tsx` ("synced with Setmore + DB categories" → "synced with Acuity").
- Leave `supabase/types.ts` `setmore_booking_id` column alone (auto-generated; the column itself can be dropped later via migration if desired - not part of this pass).

### 6. Out of scope (per your answer "keep everything")
- Not touching: `confirm-booking`, `create-booking-checkout`, `stripe-webhook`, `BookingSuccess`, `BookingCancelled`, `AdminBookingsTab`, `bookings` table. These remain functional for any non-Acuity flows you keep.

---

### Files touched (high level)
- **New**: `src/components/AcuityEmbed.tsx`, `src/hooks/use-book-now.ts`
- **Rewritten**: `src/pages/BookingSystem.tsx`
- **Edited (CTA swap + optional embed)**: `src/components/home/HeroSection.tsx`, `FinalCTA.tsx`, `OffersSection.tsx`, `Layout.tsx`, `ModelCTA.tsx`, `TreatmentChatbot.tsx`, `src/pages/MuseLanding.tsx`, `LipFillers.tsx`, `LipFillerLanding.tsx`, `FacialBalancing.tsx`, `AntiWrinkle.tsx`, `DermalFiller.tsx`, plus all remaining treatment landing pages, `Treatments.tsx`, `BlogPost.tsx`, `Consultations.tsx`.

### Open question (must answer before I implement)
Paste the Acuity embed snippet (and any category-specific URLs you want for Lips / Facial Balancing / Anti-Wrinkle / Dermal Filler / MuseLanding). Once that lands, I'll execute the plan in one pass.

