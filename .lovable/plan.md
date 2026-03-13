

# Phase 3: Admin Enhancements, Multi-Treatment Booking, and Fixes

## 1. Fix 404 on Admin Login (Published Site)

The route `/hive-admin-login` exists in the code and works in preview. The 404 on the published site (`hiveclinicuk.com//hive-admin-login`) is caused by the double slash `//` in the URL. This is a hosting/domain redirect issue -- the custom domain is likely appending a trailing slash to the base URL before the path.

**Fix:** The app needs to be re-published so the latest routes are deployed. No code change needed -- the route is correctly defined at line 82 of `App.tsx`. The double slash in the URL you shared is the problem -- use `hiveclinicuk.com/hive-admin-login` (single slash).

---

## 2. Website Image Management via Admin

Currently there's no way to update hero images, gallery images, or page images from the admin dashboard. These are hardcoded in component files.

**Changes:**
- Add a new "Images" section to `AdminSiteTab.tsx` that stores editable image URLs in the `site_settings` table (or a new `site_images` table)
- Create a `site_images` table with fields: `key` (text, e.g. "hero_home", "gallery_1"), `image_url` (text), `alt_text` (text), `updated_at`
- Admin can upload images to the `client-images` bucket (or a new public `site-images` bucket) and the URL is saved
- Frontend pages read from this table and fall back to the hardcoded defaults if no override exists
- Create a public storage bucket `site-images` for website content images

---

## 3. Treatment Menu Reordering

Drag-and-drop reordering already exists in `AdminTreatmentsTab.tsx` (lines 144-155). The `sort_order` is saved on drag end. This already works. If it feels unresponsive, I will add visual feedback (highlight, ghost element).

**Enhancement:** Add category-level reordering so you can control the order categories appear on the booking page (not just treatments within a category).

---

## 4. Take Payment from Calendar (Admin)

Add a "Take Payment" button in the calendar edit modal that creates a Stripe Payment Link for the outstanding balance and copies it to clipboard (so admin can send it to the client).

**Changes to `AdminCalendarView.tsx`:**
- Add a "Send Payment Link" button in the edit modal for bookings with `payment_status` of "pending" or "deposit_paid"
- This calls an edge function that creates a Stripe Payment Link for the remaining balance
- Link is copied to clipboard so admin can share via WhatsApp/SMS
- Add a "Mark as Paid" button for in-person/cash payments that updates `payment_status` to "fully_paid"

**New edge function:** `create-payment-link` -- creates a Stripe Payment Link for a given amount and booking reference.

---

## 5. Payment Plan Customisation

Currently `AdminPaymentPlansTab.tsx` allows creating plans and recording payments, but you cannot edit the instalment amount after creation.

**Changes:**
- Add an "Edit" button on each active plan
- Allow editing: `instalment_amount`, `total_instalments`, `total_amount`, `next_payment_date`
- Add a "Record Custom Amount" option when recording a payment (instead of always recording the fixed instalment amount)
- Show remaining balance clearly

---

## 6. Cancellation Sync Between Admin and Client

Currently:
- Admin cancels via calendar -> updates DB status to "cancelled" and sends cancellation email to client. Client sees it in their portal (already works via DB read).
- Client cancels via portal -> updates DB status to "cancelled". Admin sees it in bookings/calendar (already works via DB read).

**Missing:** When a client cancels, the admin doesn't get notified.

**Fix:** In `CustomerPortal.tsx` `cancelBooking` function, after updating the booking status, trigger `send-booking-email` with a new `emailType: "client_cancelled"` that sends a notification to the admin email.

---

## 7. Mailchimp Email Automations

The `mailchimp-subscribe` edge function already exists and works. It's already wired into the booking checkout flow. To set up automations:

**What I will do:**
- Update `mailchimp-subscribe` to accept and pass `firstName`, `lastName`, and `tags` (e.g. "Booked Client", treatment category)
- Add tags based on treatment category so you can create targeted automations in Mailchimp
- Ensure the VIP popup signup also triggers the function (it already does via `email_subscribers` table insert, but needs to call the edge function too)

**What you need to do in Mailchimp:**
- Log into your Mailchimp account
- Go to Automations and create journeys based on tags (e.g. "Welcome" email for new subscribers, "Post-Treatment" for booked clients)
- The integration will automatically tag contacts when they book

---

## 8. Multiple Treatment Selection + Course Suggestions

This is the biggest feature. Currently only one treatment can be selected per booking.

**Changes to `BookingSystem.tsx`:**
- Allow selecting multiple treatments (change `selectedTreatment` from single to array `selectedTreatments`)
- Show a running total of all selected treatments
- After selection, check if any selected treatment has packages in `treatment_packages` and show a "Save with a Course" prompt
- Display savings: "Book 3 sessions of Level 1 Face Peel and save £25 (£230 vs £255)"
- Duration and time slot calculation accounts for combined treatment time
- Checkout sends all treatment IDs

**Changes to `create-booking-checkout`:**
- Accept an array of treatment IDs
- Create line items for each treatment in the Stripe checkout session
- Store multiple treatment references in the booking (use the existing `addon_ids` pattern or add a `treatment_ids` array column)

**Database change:**
- Add `treatment_ids` (uuid array) column to `bookings` table to support multi-treatment bookings
- Keep `treatment_id` for backwards compatibility (primary treatment)

---

## Technical Summary

### Database Changes:
- New table: `site_images` (key, image_url, alt_text, updated_at) with RLS for admin write, public read
- New storage bucket: `site-images` (public)
- Add column `treatment_ids` (uuid[]) to `bookings` table

### Edge Functions:
- New: `create-payment-link` -- generates Stripe Payment Link
- Update: `mailchimp-subscribe` -- accept firstName, lastName, tags
- Update: `send-booking-email` -- add "client_cancelled" email type for admin notification

### Frontend Files to Edit:
- `AdminCalendarView.tsx` -- add payment link + mark as paid buttons
- `AdminPaymentPlansTab.tsx` -- add edit and custom payment recording
- `AdminSiteTab.tsx` -- add image management section
- `BookingSystem.tsx` -- multi-treatment selection + course suggestions
- `CustomerPortal.tsx` -- trigger admin notification on client cancellation
- `create-booking-checkout` -- support multiple treatments

### Frontend Files to Create:
- None (all changes are to existing files)

