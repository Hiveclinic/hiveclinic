

## Plan: Launch Preparation — Reset Data, Update Prices, Booking Fee, Consent Form

This is a large multi-part task to prepare the site for public launch.

---

### 1. Clear Test Data from Database

Run SQL migrations to delete all test data:
- Delete all rows from `reviews` (5 test reviews)
- Delete all rows from `bookings` (13 test bookings)
- Delete all rows from `payments` (associated test payments)
- Delete all rows from `consent_submissions` 
- Delete all rows from `admin_client_notes`
- Delete all rows from `client_packages`
- Delete all rows from `contact_submissions`
- Delete all rows from `consent_form_templates` (remove the test "m,m" template)

Customer profiles table is already empty. Email subscribers will be preserved (those are real signups).

---

### 2. Update All Treatment Prices to Match Price Lists

Based on the uploaded images, update prices in the `treatments` table via SQL migration. Key changes:

**Regular prices (from images 6 & 7):**
- Anti-Wrinkle 2 Areas: £185 → £179
- Anti-Wrinkle 3 Areas: £225 → £220
- Anti-Wrinkle 1 Area: remove (not on regular price list — only show 2, 3, 6 Areas)
- Masseter: £250 → £240
- Skin Boosters: Lumi Eyes £140, Seventy Hyal £160, Polynucleotides £180, Profhilo £250
- Dermal Filler: Lip 0.5ml £80, 0.8ml £120, 1ml £150, Smile Lines £150, Marionette Lines £150, Chin £160, Cheek per ml £160, Jawline per ml £170, Nose £200, Tear Trough £200
- Facial Balancing: 3ml £350, 5ml £500, 7ml £650
- Chemical Peels: Level 1 Face £85, Back £95, Level 2 Face £110, Back £125
- Intimate Peels: Small £75, Medium £95, Large £120
- Melanostop Body: Hands £120, Underarms £150, Elbows/Knees £130
- Microneedling: Face Texture Repair £130, Stretch Mark Repair £150
- HydraFacial: Glass Skin Boost £140, Acne Refresh £130, Glow Reset £120
- Fat Dissolve: Small £120, Medium £180, Large £250

**Model prices (from image 1) — update Content Model category:**
- Lip Filler: 0.5ml £65, 0.8ml £95, 1ml £110 (already correct)
- Chin Filler £120, Cheek £120, Jawline £130, Tear Trough £150 (already correct)
- Facial Balancing: 3ml £270, 5ml £395, 7ml £520 (already correct)
- Anti-Wrinkle model: 1 Area £99, 2 Areas £145, 3 Areas £175 (check/update)
- Masseter model: £195
- Skin Boosters model: Lumi Eyes £110, Seventy Hyal £125, Polynucleotides £140, Profhilo £195
- Skin Treatments model: Hydrafacial £95, Chemical Peel £65

Also update the hardcoded `pricingData` in `src/pages/MuseLanding.tsx` to match.

---

### 3. Set 20% Booking Fee on All Treatments

- Update **every** treatment in the database: `deposit_required = true`, `deposit_amount = ROUND(price * 0.20)`, `payment_type = 'deposit'`
- Exception: Free consultations (price = 0) keep deposit_required = false

**Rename "deposit" to "booking fee" across the codebase:**
- `src/pages/BookingSystem.tsx` — Change all UI labels: "Pay Deposit" → "Pay Booking Fee", "deposit" references in text
- `src/pages/Terms.tsx` — Update terminology throughout
- `src/components/admin/AdminBookingsTab.tsx` — Admin labels
- `supabase/functions/create-booking-checkout/index.ts` — Stripe metadata descriptions
- `supabase/functions/send-booking-email/index.ts` — Email text

Note: Database column names (`deposit_amount`, `deposit_required`) stay the same — only UI-facing text changes.

---

### 4. Add Arrival Time Policy

Add a notice in the booking confirmation step (Step 3 in BookingSystem.tsx) and in Terms.tsx:
- "Please arrive at your exact appointment time. Do not arrive early or late as a member of the team will need to let you into the clinic."

---

### 5. Create Master Consent Form

**A. Create the consent form template in the database** via SQL migration — insert a comprehensive `consent_form_templates` record with all 10 sections as structured JSON fields.

**B. Create a new public-facing page `src/pages/ConsentForm.tsx`** with:
- Hive Clinic branding (black, white, gold)
- All 10 sections from the specification (Client Info, Medical Questionnaire, Treatment Understanding, Risks, Aftercare, No Guarantee, Treatment Refusal, Photography/Marketing, Payment Policy, Declaration)
- Digital signature pad (canvas-based)
- Tick boxes for consent sections
- Form submission stores to `consent_submissions` table
- PDF download button (using browser print/PDF or jsPDF)

**C. Add route** `/consent-form` in App.tsx

**D. Link consent form** in the booking confirmation email and booking success page so clients can complete it before their appointment.

---

### Technical Summary

- **Database migrations**: Clear test data, update prices, set 20% booking fees, insert master consent template
- **Files to edit**: `BookingSystem.tsx`, `MuseLanding.tsx`, `Terms.tsx`, admin booking/finance tabs, edge functions for email text
- **New file**: `src/pages/ConsentForm.tsx`
- **Route addition**: `App.tsx`
- Approximately 8-10 files modified, 1 new file created

