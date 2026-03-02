
# Phase 5: Admin Payments, Price Editing, Pre-selected Bookings, and Image Fix

## 1. Manual Payment via Calendar (Stripe or Custom)

Currently the calendar edit modal shows "Send Payment Link" and "Mark as Paid". We will enhance this with:

- **Take Payment via Stripe**: Add a "Take Card Payment" button that creates a Stripe Checkout session for a custom amount (admin can type the amount). This generates a payment URL the admin can open on their device or share with the client.
- **Editable payment amount**: Admin can adjust the charge amount in the modal (e.g. for partial payments, adjustments, or Tide transfers).
- **Record manual payment**: Extend "Mark as Paid" to allow choosing a method (Cash, Bank Transfer/Tide, Card) and entering an optional reference. This updates `payment_status` and stores the method in notes.

### Changes:
- `AdminCalendarView.tsx`: Add amount input field, payment method selector, and custom Stripe checkout button.
- `create-payment-link` edge function: Already supports custom amounts -- will reuse this.

## 2. Edit Treatment Price and Payment Plan from Calendar

The edit modal currently shows treatment info as read-only. We will add:

- **Editable price**: Add a "Total Price" input field to the edit form so admins can override the booking price directly.
- **Payment plan quick-create**: Add a "Create Payment Plan" button that opens an inline form to split the total into instalments (number of payments, amount per instalment, next date). This inserts into `payment_plans` table.
- **View/edit existing plan**: If a payment plan already exists for the booking, show it inline with edit controls.

### Changes:
- `AdminCalendarView.tsx`: Add `total_price` to edit form, fetch and display payment plans for the selected booking, and add create/edit plan UI.

## 3. Fix Admin Image Updates Not Working

The current `AdminSiteTab.tsx` image management updates the `site_images` table, but the frontend pages (Index.tsx, Treatments.tsx, etc.) use hardcoded imports (`import gallery1 from "@/assets/gallery-1.jpg"`). The `site_images` table is never read by these pages, so changes have no effect.

### Fix:
- Create a reusable hook `useSiteImage(key: string, fallback: string)` that queries `site_images` for the given key and returns the URL (or fallback if not found).
- Update `Index.tsx` hero image to use `useSiteImage("hero_home", gallery6)`.
- Update gallery images on the homepage to use `useSiteImage("gallery_1", gallery1)`, etc.
- Pre-populate the `site_images` table with standard keys: `hero_home`, `gallery_1` through `gallery_6`.
- This way, when you upload/paste a URL in admin, it actually takes effect on the live site.

### Changes:
- New hook: `src/hooks/use-site-image.ts`
- `Index.tsx`: Replace hardcoded gallery imports with the hook for key images.
- Database: Insert default rows into `site_images` for the standard keys.

## 4. Pre-select Treatment When Linking to Bookings

Currently all "Book Now" links go to `/bookings` without any context. Treatment pages and offer cards should pre-select the relevant treatment.

### Fix:
- `BookingSystem.tsx`: Read URL search params on mount (e.g. `?treatment=lip-filler-05ml` or `?category=Consultations`). If a `treatment` slug is provided, auto-select that treatment and optionally skip to step 1. If a `category` is provided, auto-expand that category.
- Update key links across the site to include the slug:
  - `Index.tsx` offer cards: `to={"/bookings?treatment=" + offer.slug}`
  - `Index.tsx` "Book Free Consultation" CTA: `to="/bookings?category=Consultations"`
  - `Consultations.tsx` links: add `?treatment=free-online-consultation` (or appropriate slug)
  - Treatment pages (LipFillers, AntiWrinkle, etc.): Update their "Book Now" links to pass the category.

### Changes:
- `BookingSystem.tsx`: Add `useSearchParams` to read `treatment` and `category` query params, auto-select on mount.
- `Index.tsx`: Update offer card links and hero CTA.
- `Consultations.tsx`: Update booking links with treatment slugs.
- Other treatment pages: Update "Book Now" links with `?category=CategoryName`.

## 5. Homepage Offers Section Verification

The offers section in `Index.tsx` already queries `treatments` where `on_offer = true`. If no treatments are marked as on offer, the section is hidden. This is working correctly in code -- the section just needs data. We will insert a test offer via the database to verify it displays.

---

## Technical Summary

### Frontend Files to Edit:
- `src/components/admin/AdminCalendarView.tsx` -- manual payments, price editing, payment plan management
- `src/pages/BookingSystem.tsx` -- pre-select treatment from URL params
- `src/pages/Index.tsx` -- update links with treatment slugs, use site images hook
- `src/pages/Consultations.tsx` -- update booking links with slugs

### Frontend Files to Create:
- `src/hooks/use-site-image.ts` -- reusable hook for dynamic site images

### Database Changes:
- Insert default `site_images` rows for hero and gallery keys (data insert, not schema change)

### Edge Functions:
- No new functions needed (reuse `create-payment-link`)
