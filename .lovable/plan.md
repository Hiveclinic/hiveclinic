
# Comprehensive Hive Clinic Implementation - Phase 2

This plan covers Stripe fix, booking page redesign, full treatment menu insertion, new treatment pages, client image fix, and security review.

---

## 1. Stripe Payment Fix (Critical - Priority 1)

The provided key `rk_live_51SHs6sPOpm31z20v...` starts with `rk_live_` which is a **restricted key**. This should work with Stripe Checkout as long as it has the required permissions (checkout sessions, payment intents). The key will be stored as the `STRIPE_SECRET_KEY` secret.

**Changes:**
- Store the provided Stripe key as `STRIPE_SECRET_KEY` via the secrets tool
- Add better error logging in `create-booking-checkout` to surface Stripe-specific errors (e.g. invalid key format, missing permissions)
- Add a try/catch specifically around the `stripe.checkout.sessions.create` call with detailed error messages
- Redeploy `create-booking-checkout` and `confirm-booking` edge functions

---

## 2. Booking Page Redesign - Category-First Flow with Popular Section

**Current state:** All treatments shown in a flat grid with category filter buttons at the top. Cluttered feel.

**New design:**
- **"Most Popular" section** at the top showing 4-5 highlighted treatments (Lip Fillers, Anti-Wrinkle, HydraFacial, Dermal Filler)
- **Category cards** below - user clicks a category to expand and see treatments within it
- **Collapsible add-ons** - shown as a subtle "Add extras" expandable section after treatment selection, not a full grid
- **Anti-wrinkle area calculator** only appears when anti-wrinkle is selected (inline, not a separate section)
- **Cleaner spacing** throughout with more whitespace
- Progress stepper remains the same (it's already clean)

**File:** `src/pages/BookingSystem.tsx` - full rewrite of step 0 (treatment selection)

---

## 3. Full Treatment Menu Database Insertion

Delete all existing treatments and insert the complete Setmore menu. This uses SQL migrations to handle the data operations cleanly.

**Categories and treatments to insert (48+ treatments):**

- **Consultations** (3): Free Online, In-Person £25, Prescriber £30
- **Chemical Peels** (5): Level 1 Face £85, Level 1 Back £95, Level 2 Face £110, Level 2 Back £125, Level 2 Body Areas £110
- **Intimate & Body Peels** (3): Small £85, Medium £110, Large £140
- **Microneedling & Skin Repair** (2): Skin Texture £140, Stretch Mark £160
- **HydraFacial** (3): Glass Skin £145, Acne Refresh £135, Glow Reset £125
- **Dermaplaning** (2): Skin Polish £75, + Hydration Facial £115
- **LED Light Therapy** (1): LED 30 mins £45
- **Mesotherapy** (3): Face £155, Under Eye £155, Scalp £210
- **PRP** (3): Facial £325, Under Eye £325, Scalp £425
- **Skin Boosters** (4): Lumi Eyes £135, Seventy Hyal £155, Polynucleotides £175, Profhilo £250
- **Dermal Filler** (9): Lips 0.5ml £90, 0.8ml £135, 1ml £165, Smile Lines £165, Marionette £165, Chin £175, Cheeks £175, Jawline £185, Nose £225, Tear Trough £225
- **Facial Balancing** (3): 3ml £380, 5ml £540, 7ml £720
- **Anti-Wrinkle** (9): 2 Areas £185, 3 Areas £225, 6 Areas £360, Masseter £250, Bunny Lines £120, Lip Flip £120, Gummy Smile £120, Chin Dimpling £120, DAO £120, Brow Lift £150
- **Fat Dissolve** (3): Small £125, Medium £180, Large £250
- **Micro Sclerotherapy** (3): Small £225, Medium £325, Large £475

**Course packages** (via `treatment_packages` table):
- Level 1 Face x3 £230, Level 1 Back x3 £260, Level 2 Face x3 £300, Level 2 Back x3 £330
- Intimate Small x3 £235, Medium x3 £300, Large x3 £380
- Microneedling x3 (10% off), x6 (15% off)
- LED x6 £250
- Mesotherapy x3 (10% off), x6 (15% off)
- Lumi Eyes x3 £390, Seventy Hyal x2 £290, Polynucleotides x3 £495, Profhilo x2 £480

---

## 4. New Treatment Landing Pages

Create 6 new treatment pages following the same pattern as `LipFillers.tsx`:

- `/treatments/dermaplaning-manchester` - Dermaplaning
- `/treatments/led-light-therapy-manchester` - LED Light Therapy
- `/treatments/mesotherapy-manchester` - Mesotherapy
- `/treatments/prp-manchester` - PRP
- `/treatments/facial-balancing-manchester` - Facial Balancing
- `/treatments/micro-sclerotherapy-manchester` - Micro Sclerotherapy
- `/treatments/consultations` - Consultations
- `/treatments/intimate-peels-manchester` - Intimate & Body Peels

Each page will include: hero section, treatment description, pricing grid, FAQs, and booking CTA.

**Also update:**
- `src/App.tsx` - add new routes
- `src/pages/Treatments.tsx` - add new categories to the grid
- `CATEGORY_ROUTES` in `BookingSystem.tsx` - map all new categories

---

## 5. Client Images Fix (Signed URLs)

**Current bug:** Line 115 in `AdminClientsTab.tsx` calls `getPublicUrl()` which won't work on a private bucket. The signed URL logic exists (line 137-147) but images may not display on initial load.

**Fix:**
- Remove the `getPublicUrl` call (line 115)
- Ensure `loadSignedUrl` is called for all images when a client is expanded
- Add a lightbox modal for clicking on images to see full size
- Add loading states for images

---

## 6. Update Anti-Wrinkle Area Pricing

Current pricing in the booking calculator uses old values (1 area £100, 2 areas £170, 3 areas £220). Update to match the Setmore menu:
- 2 Areas - £185
- 3 Areas - £225
- 6 Areas - £360

Remove "1 Area" option since the Setmore menu doesn't list it. The individual treatments (Masseter, Bunny Lines, etc.) will be separate selectable treatments.

---

## 7. Security Review

Current RLS policies are solid. Key checks:
- All admin tables use `has_role(auth.uid(), 'admin')` - correct
- Bookings allow public INSERT with `true` check - correct for guest checkout
- Contact submissions allow public INSERT - correct
- Storage bucket `client-images` is private - correct
- Edge functions validate inputs before processing - will add better validation for the Stripe key

No critical security issues found. Minor improvement: add rate limiting awareness to edge functions via error messages.

---

## 8. Mailchimp Integration in Booking Flow

Wire the existing `mailchimp-subscribe` edge function into `create-booking-checkout` to auto-subscribe customers when they book.

---

## Technical Summary

### Files to Edit:
- `src/pages/BookingSystem.tsx` - redesign step 0
- `src/components/admin/AdminClientsTab.tsx` - fix signed URLs
- `supabase/functions/create-booking-checkout/index.ts` - better Stripe error handling + Mailchimp trigger
- `src/App.tsx` - add 8 new routes
- `src/pages/Treatments.tsx` - add new categories

### Files to Create:
- `src/pages/Dermaplaning.tsx`
- `src/pages/LEDTherapy.tsx`
- `src/pages/Mesotherapy.tsx`
- `src/pages/PRP.tsx`
- `src/pages/FacialBalancing.tsx`
- `src/pages/MicroSclerotherapy.tsx`
- `src/pages/Consultations.tsx`
- `src/pages/IntimatePeels.tsx`

### Database Changes:
- Delete existing treatments and re-insert full menu (48+ treatments)
- Insert course packages into `treatment_packages`

### Edge Functions to Deploy:
- `create-booking-checkout` (Stripe error handling + Mailchimp)
- `confirm-booking` (redeployed)

### Secrets:
- Update `STRIPE_SECRET_KEY` with the provided restricted key
