

# Redesign Booking Emails, Add Admin Notifications, Update Muse Pricing, Create Muse Landing Page

## 1. Redesign All Booking Email Templates (send-booking-email)

The current emails use a basic text header ("Hive Clinic" in Georgia). The redesign will use the actual Hive Clinic logo from the `email-assets` storage bucket, match the brand palette (black `#0d0d0d`, cream `#f5f0eb`, gold `#c9a96e`), and use the Cormorant Garamond / Satoshi font stack with web-safe fallbacks.

**Changes to `supabase/functions/send-booking-email/index.ts`:**

- Replace `headerHtml` with a version that uses the logo image from `https://kyjzjgdcfisuxogledux.supabase.co/storage/v1/object/public/email-assets/logo.png` (matching the auth email templates), a gold divider line, and refined spacing
- Replace `footerHtml` with a cleaner footer using gold accents, uppercase tracking, matching the auth email template style
- Update all body typography: use `'Satoshi', 'Helvetica Neue', Arial, sans-serif` for body, `'Cormorant Garamond', Georgia, serif` for headings
- Replace all em dashes with normal hyphens (`-`) throughout
- Use gold `#c9a96e` for accent borders (already in place on the left-border cards)
- Match the exact aesthetic of the existing auth email templates (signup, recovery, etc.)

## 2. Send Admin Copy on Every Booking Email Type

Currently, only `confirmation` triggers a separate `admin_new_booking` email, and `reschedule` / `client_cancelled` send admin emails. But `reminder` and `aftercare` do not notify admin.

**Change:** After every client email is sent (confirmation, reminder, aftercare, cancellation), also send a copy to `hello@hiveclinicuk.com` with the subject prefixed (e.g. "Client Copy: Booking Confirmed - Lip Filler"). This way the admin always gets a notification of every email the client receives.

The `confirmation` flow already sends `admin_new_booking` separately. We will keep that and additionally send the client's confirmation email as a CC/copy to admin so the admin sees exactly what the client sees.

**Implementation:** At the bottom of the function, after `sendEmail(booking.customer_email, subject, html)`, add `sendEmail(ADMIN_EMAIL, \`[Copy] \${subject}\`, html)` for all standard email types. The reschedule and client_cancelled paths already handle admin emails, so those will continue as-is.

## 3. Update Muse/Model Pricing

Based on the uploaded pricing graphic, the prices differ from the previous plan. Key differences from the reference image:

| Category | Item | Muse Price |
|---|---|---|
| Lip Filler | 0.5ml | £65 |
| Lip Filler | 0.8ml | £95 |
| Lip Filler | 1ml | £110 |
| Dermal Filler | Chin | £120 |
| Dermal Filler | Cheek (per ml) | £120 |
| Dermal Filler | Jawline (per ml) | £130 |
| Dermal Filler | Tear Trough | £150 |
| Facial Balancing | 3ml | £270 |
| Facial Balancing | 5ml | £395 |
| Facial Balancing | 7ml | £520 |
| Anti Wrinkle | 1 Area | £99 |
| Anti Wrinkle | 2 Areas | £145 |
| Anti Wrinkle | 3 Areas | £175 |
| Anti Wrinkle | Masseter Jaw Slimming | £195 |
| Skin Boosters | Lumi Eyes | £110 |
| Skin Boosters | Seventy Hyal | £125 |
| Skin Boosters | Polynucleotides | £140 |
| Skin Boosters | Profhilo | £195 |
| Skin Treatments | Hydrafacial | £95 |
| Skin Treatments | Chemical Peel | £65 |

The heading should say "Model Pricing" (not "Muse Pricing"). No RRP / strikethrough - just clean prices with a normal hyphen separator (e.g. "0.5ml Lip Filler - £65").

## 4. Create Muse/Model Landing Page

**New file: `src/pages/MuseLanding.tsx`**

A standalone, ad-optimised landing page at `/muse` with:
- Hero: dark background with gallery image, "Become a Hive Clinic Muse" headline, location via Lucide MapPin, two CTAs
- "What Are Muse Sessions" explainer on cream background
- Model Pricing grid (data from the image above) - clean 2-col layout on desktop, 1-col mobile, no strikethrough/RRP, normal hyphens
- Important Information bullets with gold indicators
- Booking CTA linking to `/bookings`
- Final CTA section

Uses existing `Layout`, `usePageMeta`, `framer-motion`, gallery assets, brand fonts/colours.

**Updated file: `src/App.tsx`** - add route for `/muse`.

## Files Changed

| File | Action |
|---|---|
| `supabase/functions/send-booking-email/index.ts` | Redesign all email templates, add admin copy on all types |
| `src/pages/MuseLanding.tsx` | Create - model landing page |
| `src/App.tsx` | Add `/muse` route |

No database changes needed.

