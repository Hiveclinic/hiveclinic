

## Plan: Site Restructure - Remove Pages, Sync with Setmore, Add Content Models

### Overview

Major restructure: remove 3 features (announcement banner, pricing page, offers page), update the treatment menu to match Setmore data, make all booking CTAs across ~20+ treatment pages link directly to Setmore, and create a new Content Models page.

---

### 1. Remove Announcement Banner

- Remove `<AnnouncementBanner />` from `src/components/Layout.tsx`
- Delete `src/components/AnnouncementBanner.tsx`

### 2. Remove Pricing Page

- Remove `/pricing` route from `App.tsx`
- Delete `src/pages/Pricing.tsx`
- Remove "Pricing" from `navLinks` in `Layout.tsx`
- Update any internal links to `/pricing` across pages (e.g. Index.tsx links to pricing → redirect to `/bookings`)

### 3. Remove Offers Page

- Remove `/offers` route from `App.tsx`
- Delete `src/pages/Offers.tsx`
- Remove "Offers" from `navLinks` in `Layout.tsx`
- Update any internal links to `/offers` across pages (e.g. Index.tsx)

### 4. Update Treatment Menu Page

Replace the current `Pricing.tsx` (being removed) purpose with the booking page itself serving as the menu. The `/bookings` page already has all Setmore-synced categories and prices with courses and single sessions clearly separated via collapsible sections.

Enhance the existing `BookingSystem.tsx` to better partition courses vs single sessions within each category:
- Within each collapsible category, show two sub-sections: "Single Sessions" and "Courses" (when courses exist)
- This makes it easy to distinguish between one-off treatments and multi-session packages

### 5. Update All Treatment Landing Pages to Link to Setmore

Across ~20+ treatment pages, replace every `<Link to="/bookings?category=...">` with a direct `<a href="SETMORE_URL" target="_blank" rel="noopener noreferrer">` link.

Each treatment page will link to the most relevant Setmore consultation/booking URL. Files affected:
- `LipFillers.tsx` → Lip Filler 1ml Setmore URL
- `AntiWrinkle.tsx` → Anti-Wrinkle Consultation Setmore URL
- `DermalFiller.tsx` → Skin Consultation Setmore URL
- `HydraFacial.tsx` → Hydrafacial Setmore URL
- `ChemicalPeels.tsx` → BioRePeel Face Setmore URL
- `SkinBoosters.tsx` → Seventy Hyal Setmore URL
- `FatDissolve.tsx` → Fat Dissolving Small Setmore URL
- `Microneedling.tsx` → Microneedling Setmore URL
- `Dermaplaning.tsx` → Skin Consultation Setmore URL
- `LEDTherapy.tsx` → Skin Consultation Setmore URL
- `Mesotherapy.tsx` → Skin Consultation Setmore URL
- `PRP.tsx` → Skin Consultation Setmore URL
- `FacialBalancing.tsx` → Facial Balancing 2ml Setmore URL
- `MicroSclerotherapy.tsx` → Skin Consultation Setmore URL
- `Consultations.tsx` → Skin Consultation Setmore URL
- `IntimatePeels.tsx` → Intimate Peel Setmore URL
- `AcneTreatment.tsx` → Skin Consultation Setmore URL
- `HyperpigmentationTreatment.tsx` → Skin Consultation Setmore URL
- `LipFillerLanding.tsx` → Lip Filler 1ml Setmore URL
- `Index.tsx` → Skin Consultation Setmore URL (hero CTA)
- `Contact.tsx`, `About.tsx`, `Aftercare.tsx` etc. if they have booking links
- `MuseLanding.tsx` → will be handled separately (Content Models page)

Also update `ModelCTA.tsx` component if it links to `/bookings`.

### 6. Create Content Models Page

Replace `MuseLanding.tsx` with a new "Content Models" page that:
- Shows model-priced treatments organized by category (same structure as booking page)
- Each treatment links to its specific Setmore booking URL
- If no treatments are available, displays:
  > "Sorry, we have no more slots available. Sign up to our WhatsApp group chat to be notified when new dates are added."
  > With link to: `https://chat.whatsapp.com/EghTmYahXgY6P2f1J1BD6I?mode=gi_t`

The page will use a hardcoded `MODEL_SERVICES` array (same structure as `SERVICES` in BookingSystem). When you add "Content Model" category treatments in Setmore, you update this array. The empty-state fallback with WhatsApp link shows when the array is empty.

### 7. Update Navigation

Update `navLinks` in `Layout.tsx`:
- Remove "Offers"
- Remove "Pricing"
- Add "Content Models" linking to `/muse` (or rename route to `/content-models`)

---

### Technical Summary

- **Files deleted**: `AnnouncementBanner.tsx`, `Pricing.tsx`, `Offers.tsx`
- **Files heavily edited**: `Layout.tsx` (nav + banner), `App.tsx` (routes), `BookingSystem.tsx` (course partitioning), `MuseLanding.tsx` (rewrite to Content Models)
- **Files with link updates**: ~20+ treatment pages, `Index.tsx`, `ModelCTA.tsx`, `Contact.tsx`
- **No database changes needed** - all hardcoded service data
- Approximately 25 files modified, 3 files deleted

