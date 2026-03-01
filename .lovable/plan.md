
# Phase 4: Webhook, Offers, Admin Cleanup, Notifications, and Email Fixes

## 1. Stripe Webhook for Reliable Booking Confirmation

Currently bookings are confirmed via the redirect URL (`confirm-booking` called from `BookingSuccess.tsx`). This is fragile -- if the user closes the browser before the redirect completes, the booking stays "pending" forever.

**Changes:**
- Create a new edge function `stripe-webhook` that listens for `checkout.session.completed` events
- Verify the webhook signature using the Stripe webhook secret
- Extract `booking_id` from session metadata, confirm the booking, send confirmation email, and send admin notification
- Add `STRIPE_WEBHOOK_SECRET` as a new secret (you'll get this from your Stripe dashboard after creating the webhook endpoint)
- Keep the existing `confirm-booking` function as a fallback (idempotent -- skip if already confirmed)
- The webhook URL will be: `https://kyjzjgdcfisuxogledux.supabase.co/functions/v1/stripe-webhook`

## 2. Admin Booking Notification (Email + SMS-ready)

Every new confirmed booking should notify you immediately.

**Changes to `confirm-booking` and the new `stripe-webhook`:**
- After confirming a booking, call `send-booking-email` with a new `emailType: "admin_new_booking"` that sends an email to `hello@hiveclinicuk.com` with the customer name, treatment, date/time, and payment status
- Add the `admin_new_booking` email template to `send-booking-email` edge function
- For SMS: add a note in the admin email suggesting WhatsApp Business API integration as a future enhancement (no SMS provider is currently connected)

## 3. Fix Emails Going to Junk

Booking emails currently send from `noreply@hiveclinic.lovable.app` via Resend. This is a generic subdomain which triggers spam filters.

**Fix:**
- Update the `from` address in `send-booking-email` to use your verified custom domain: `Hive Clinic <noreply@notify.hiveclinicuk.com>` (since `notify.hiveclinicuk.com` is already DNS-verified for auth emails)
- This single change across all `resend.emails.send()` calls will dramatically improve deliverability

## 4. Make Course Sessions Bookable (Not Contact Page)

Currently course suggestions link to `/contact?subject=Course%20Enquiry`. Instead, they should be directly bookable.

**Changes to `BookingSystem.tsx`:**
- Replace the "Enquire" link with a "Book Course" button
- When clicked, replace the single treatment selection with the course package: set the price to the package `total_price`, update duration to `duration_mins * sessions_count`, and store the `package_id`
- Pass `packageId` to `create-booking-checkout` so the booking records which package was purchased
- The checkout line item will show the course name and price

**Changes to `create-booking-checkout`:**
- Accept optional `packageId` parameter
- If provided, fetch the package and use its `total_price` instead of summing individual treatment prices
- Set `package_id` on the booking record

## 5. Offers Section on Homepage

Add a dedicated "Current Offers" section to the homepage that pulls treatments where `on_offer = true`.

**Changes to `Index.tsx`:**
- Add a new section after the highlights grid titled "Current Offers"
- Query `treatments` table for `on_offer = true` and `active = true`
- Display each offer as a card showing: treatment name, original price (crossed out), offer price, offer label, and a "Book Now" link to `/bookings`
- If no offers exist, the section is hidden entirely
- Style matches the existing luxury aesthetic (gold accents, serif headings)

## 6. Admin Dashboard Cleanup and Simplification

The current dashboard has 11 tabs displayed as a long horizontal row of buttons. This is hard to navigate, especially on mobile.

**Changes to `Admin.tsx`:**
- Replace the flat tab bar with a **sidebar navigation** layout on desktop (collapsible on mobile)
- Group tabs into sections:
  - **Bookings**: Calendar, Bookings
  - **Business**: Treatments, Payment Plans, Discounts
  - **Clients**: Clients, Enquiries, VIP List
  - **Settings**: Site Settings, Availability, Blocked Dates
- Add a quick-stats bar at the top showing: today's bookings count, pending enquiries, and total revenue this month
- Keep all existing functionality -- just reorganize the navigation

## 7. AI-Assisted Treatment Creation in Admin

Add an AI helper to the treatment creation form that auto-fills fields based on a treatment name.

**Changes to `AdminTreatmentsTab.tsx`:**
- Add a "Generate with AI" button next to the treatment name input
- When clicked, call a new edge function `ai-treatment-suggest` that takes a treatment name and returns suggested: description, category, duration, price range, and slug
- Admin can review and edit the suggestions before saving
- Uses the Lovable AI integration (no external API key needed)

**New edge function: `ai-treatment-suggest`**
- Accepts `{ name: string }` 
- Calls the Lovable AI model to generate treatment metadata
- Returns `{ description, category, duration_mins, suggested_price, slug }`

## 8. Email Template Preview

Preview the signup email template to verify branding is correct.

**Action:** After implementation, provide preview links for all auth email templates so you can verify logo, colors, and copy visually.

---

## Technical Summary

### New Edge Functions:
- `stripe-webhook` -- Stripe webhook handler for `checkout.session.completed`
- `ai-treatment-suggest` -- AI-powered treatment field suggestions

### Edge Functions to Update:
- `send-booking-email` -- add `admin_new_booking` email type; change `from` address to `notify.hiveclinicuk.com`
- `create-booking-checkout` -- accept `packageId` for course bookings
- `confirm-booking` -- trigger admin notification after confirmation

### New Secrets Needed:
- `STRIPE_WEBHOOK_SECRET` -- from Stripe dashboard after creating the webhook endpoint

### Frontend Files to Edit:
- `src/pages/Index.tsx` -- add Offers section
- `src/pages/Admin.tsx` -- sidebar nav layout with grouped sections and stats bar
- `src/pages/BookingSystem.tsx` -- make courses bookable directly (replace "Enquire" with "Book Course")
- `src/components/admin/AdminTreatmentsTab.tsx` -- add AI-assisted treatment creation

### Database Changes:
- None (existing `package_id` column on `bookings` already supports course bookings)
