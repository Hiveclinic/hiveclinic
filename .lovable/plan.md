
# Comprehensive Hive Clinic Upgrade Plan

This is a large-scale update covering the admin calendar, client images, booking UX, Stripe fix, email automations, treatment menu, cancellation messaging, rescheduling notifications, and more. Here is the full breakdown.

---

## 1. Admin Calendar - Full Editing and Rescheduling

**Current state:** The calendar shows bookings and supports drag-and-drop but cannot edit booking details.

**Changes:**
- Add a click-to-open detail modal on each booking in the calendar
- Modal allows editing customer name, email, phone, date, time, status, notes, and treatment
- Status changes trigger the same email logic (aftercare on completed, cancellation email on cancelled)
- Reschedule via drag-and-drop already works - will ensure it also sends a notification email to the admin

---

## 2. Client Images Fix (Before/After Upload and Viewing)

**Current state:** The storage bucket `client-images` is private, but `getPublicUrl` is called which won't work for private buckets. Signed URLs are generated but may not load properly.

**Changes:**
- Fix the upload flow to correctly use signed URLs for display (remove `getPublicUrl` call)
- Ensure images load via `createSignedUrl` on expand
- Add a lightbox/enlarged view when clicking an image

---

## 3. Icons - Fine Line Luxury Style

**Current state:** Uses Lucide React icons which are already line-style but some may appear chunky at certain sizes.

**Changes:**
- Reduce icon sizes throughout admin and booking pages (use `size={14}` or `size={16}` consistently)
- Use `strokeWidth={1.5}` on key icons for a finer, more luxury feel
- Replace any emoji usage in emails with plain text or gold bullet characters

---

## 4. Booking Page Layout Simplification

**Current state:** The booking page shows all treatments in a grid with category filters, add-ons, and the anti-wrinkle calculator all on the same view.

**Changes:**
- Restructure into a cleaner category-first flow: user picks category, then sees treatments within that category
- Collapse add-ons into a subtle expandable section rather than a full grid
- Use more whitespace and reduce visual density
- Cleaner progress stepper with thinner lines

---

## 5. Stripe Payment Fix

**Current state:** The key provided (`mk_1SydNKPOpm31z20vG9XXsiML`) starts with `mk_` which is not a valid Stripe secret key format. Stripe secret keys start with `sk_live_` or `sk_test_`.

**Changes:**
- The Stripe integration code is correct but the key itself is invalid
- You will need to provide a valid Stripe secret key (starting with `sk_test_` or `sk_live_`) from your Stripe dashboard at stripe.com
- I will add better error handling in the checkout function to surface clear messages when the key is misconfigured

---

## 6. Cancellation Email - Remove Refund Mention

**Current state:** The customer portal says "You may be eligible for a refund - we'll be in touch" and the cancellation email mentions refund policy.

**Changes:**
- Remove the refund toast message from `CustomerPortal.tsx`
- Update the cancellation email template to remove refund language
- Replace with: "If you'd like to rebook, please contact us via WhatsApp or visit our website."

---

## 7. Admin Notification on Customer Reschedule

**Current state:** When a customer reschedules, only the customer gets an email.

**Changes:**
- Add a "reschedule" email type in `send-booking-email` that also sends a notification to the admin email (e.g. hello@hiveclinicuk.com)
- Include old date/time and new date/time in the admin notification

---

## 8. Results Page - Less Prominent

**Changes:**
- Remove "Results" from the main navigation links in `Layout.tsx`
- Keep the page accessible via direct URL and footer link

---

## 9. Scroll to Top on Page Navigation

**Current state:** `ScrollToTop` component is already implemented and included in `App.tsx`. This should already be working.

**Changes:**
- Verify it uses `behavior: "instant"` (it does) - no change needed

---

## 10. Body Font Upgrade

**Current state:** Uses Satoshi which is modern but can feel casual.

**Changes:**
- No font change needed - Satoshi is a premium body font used by luxury brands. However, I will increase letter-spacing slightly on body text and reduce font weights to create a more refined feel
- Increase tracking on uppercase elements for a more editorial look

---

## 11. Email Automations and Mailchimp

**Current state:** Email sending works via Resend edge function. Mailchimp API key and audience ID are already configured as secrets.

**Changes:**
- Add Mailchimp subscribe trigger when a booking is created (add customer email to the audience list)
- The `mailchimp-subscribe` edge function already exists - I will wire it into the booking flow
- This enables you to set up automations in Mailchimp based on subscriber tags

---

## 12. Full Treatment Menu Update

**Changes:**
- Insert all treatments from the provided Setmore menu as database records with correct categories, pricing, and descriptions
- Categories: Consultations, Chemical Peels, Intimate & Body Peels, Microneedling & Skin Repair, HydraFacial, Dermaplaning, LED Light Therapy, Mesotherapy, PRP, Skin Boosters, Dermal Filler, Facial Balancing, Anti-Wrinkle, Fat Dissolve, Micro Sclerotherapy
- Create variants where applicable (e.g. Lip Filler 0.5ml/0.8ml/1ml, Fat Dissolve Small/Medium/Large)
- Create course packages (e.g. Level 1 Face Course of 3)

---

## 13. Treatment Landing Page Updates and Category Routes

**Changes:**
- Update `CATEGORY_ROUTES` mapping to cover all new categories
- Add new treatment pages for categories that don't have one (Consultations, Dermaplaning, LED, Mesotherapy, PRP, Facial Balancing, Micro Sclerotherapy)

---

## 14. Quiz Personalisation

**Changes:**
- Update the Treatment Helper quiz to branch based on individual answers rather than a generic path
- Body-focused concerns route to fat dissolve/body peels, face concerns route to facials/peels/injectables, specific areas like lips/jawline route directly to filler options

---

## 15. Aftercare Chatbot Emergency Detection

**Changes:**
- Update the `ai-aftercare` edge function system prompt to include emergency detection keywords (severe swelling, vision changes, difficulty breathing, excessive bleeding, allergic reaction)
- When detected, respond with urgent tone and recommend calling 999 or going to A&E immediately

---

## 16. Client Import/Export in Setmore Format

**Changes:**
- Update the CSV export to match Setmore's export layout (Name, Email, Phone, Service, Date, Time)
- Update CSV import to accept Setmore export format

---

## 17. Search Bar

**Changes:**
- Add a search icon in the navigation header that expands into a search overlay
- Searches across treatments, blog posts, and pages

---

## 18. Website Editability Note

Images and text are managed through the admin dashboard (announcement banner, treatments, add-ons). For full CMS-like editability of all page content outside of Lovable, a headless CMS integration would be needed - but the current admin dashboard covers the most frequently changed content.

---

## 19. Security Review

- Review all RLS policies on all tables
- Ensure no public write access to sensitive tables
- Verify edge functions validate inputs properly
- Check storage bucket policies for client-images

---

## Technical Details

### Database Changes
- Insert full treatment menu (treatments, treatment_variants, treatment_packages)
- No schema changes needed - existing tables support all features

### Edge Function Updates
- `send-booking-email`: Add reschedule admin notification, remove refund language from cancellation
- `ai-aftercare`: Update system prompt for emergency detection
- `create-booking-checkout`: Better Stripe error handling
- `mailchimp-subscribe`: Wire into booking flow

### Frontend File Changes
- `AdminCalendarView.tsx`: Add booking detail modal with full edit capability
- `AdminClientsTab.tsx`: Fix image upload/display with signed URLs
- `BookingSystem.tsx`: Simplify layout, category-first flow
- `CustomerPortal.tsx`: Remove refund mention from cancellation
- `Layout.tsx`: Remove Results from nav, add search
- `index.css`: Refine typography spacing
- New treatment landing pages for uncovered categories
- `TreatmentHelper.tsx`: Branching quiz logic

### Files to Create
- Treatment pages for new categories (Dermaplaning, LED, Mesotherapy, PRP, Facial Balancing, Micro Sclerotherapy)

This is a multi-step implementation that will require several messages to complete fully.
