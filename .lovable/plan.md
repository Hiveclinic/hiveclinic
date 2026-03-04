

# Phase 6: Testing, Deep-Linking Fix, Mailchimp & Email Setup

This plan covers the user's requests: testing admin features, fixing deep-links across all treatment pages, ensuring Mailchimp is connected, and answering the email/notifications question.

## 1. Update All Treatment Page "Book Now" Links with Deep-Linking

Currently 21 treatment pages link to `/bookings` without any `?category=` or `?treatment=` parameter. Each page should use the appropriate category parameter so the booking system auto-expands the right category.

**Files to update (each page's `to="/bookings"` links become `to="/bookings?category=CategoryName"`):**

- `HydraFacial.tsx` → `?category=HydraFacial`
- `DermalFiller.tsx` → `?category=Dermal Filler`
- `FacialBalancing.tsx` → `?category=Facial Balancing`
- `Mesotherapy.tsx` → `?category=Mesotherapy`
- `LipFillers.tsx` → `?category=Lip Fillers`
- `AntiWrinkle.tsx` → `?category=Anti-Wrinkle`
- `ChemicalPeels.tsx` → `?category=Chemical Peels`
- `SkinBoosters.tsx` → `?category=Skin Boosters`
- `FatDissolve.tsx` → `?category=Fat Dissolve`
- `Microneedling.tsx` → `?category=Microneedling`
- `Dermaplaning.tsx` → `?category=Dermaplaning`
- `LEDTherapy.tsx` → `?category=LED Light Therapy`
- `PRP.tsx` → `?category=PRP`
- `MicroSclerotherapy.tsx` → `?category=Micro Sclerotherapy`
- `IntimatePeels.tsx` → `?category=Intimate & Body Peels`
- `Pricing.tsx`, `Treatments.tsx`, `Results.tsx`, `Aftercare.tsx`, `BlogPost.tsx` → `?category=Consultations` (for generic "Book Now" CTAs)

Pages like `BookingCancelled.tsx` and `BookingSuccess.tsx` should remain as `/bookings` (no pre-selection needed for retry flows).

## 2. Mailchimp Connection Status

Mailchimp is already connected. The secrets `MAILCHIMP_API_KEY` and `MAILCHIMP_AUDIENCE_ID` are configured. The `mailchimp-subscribe` edge function syncs VIP popup subscribers and can be extended. To ensure you get notified of bookings:

- Admin booking notifications are already implemented: `send-booking-email` sends an `admin_new_booking` email to `hello@hiveclinicuk.com` whenever a booking is confirmed (via the stripe webhook and confirm-booking function).
- Mailchimp is for marketing list management (VIP subscribers, newsletter). It does not handle transactional booking notifications -- those go through Resend via `notify.hiveclinicuk.com`.

**No code changes needed for Mailchimp.** The integration is live. You can verify subscribers are syncing by checking your Mailchimp audience for the "Website Popup" and "VIP Subscriber" tags.

## 3. Browser Testing Plan

After implementing the deep-link updates, I will use browser automation to:

1. Navigate to the admin dashboard, click a booking in the calendar, and verify the edit modal shows price editing, payment plan creation, and Take Card Payment button.
2. Visit `/bookings?category=Consultations` and verify the Consultations category auto-expands.
3. Check the homepage for the Current Offers section (if any treatments are marked as on offer).
4. Verify the Site Settings image upload flow works with the `useSiteImage` hook.

---

## Technical Summary

### Files to Edit:
- 15+ treatment pages: Update `to="/bookings"` → `to="/bookings?category=X"` (simple find-and-replace per file)

### No New Edge Functions or Database Changes Needed

### Answers to User Questions:
- **Mailchimp**: Already connected via `MAILCHIMP_API_KEY` + `MAILCHIMP_AUDIENCE_ID` secrets. The `mailchimp-subscribe` function handles audience sync.
- **Booking notifications**: Already sending to `hello@hiveclinicuk.com` via the `admin_new_booking` email type in `send-booking-email`. This triggers on every confirmed booking.
- **Email sender**: Already using `noreply@notify.hiveclinicuk.com` (verified domain) for all booking emails.

