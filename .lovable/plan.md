

## Plan: Resync Treatments with Setmore + Keep Stripe Checkout + Manual Booking Notifications

### Problem

Comparing your live Setmore page against the hardcoded website data, there are numerous mismatches:

**Price differences found:**
- Facial Balancing 3ml: Website £350 vs Setmore £420
- Facial Balancing 5ml: Website £500 vs Setmore £650
- Anti-Wrinkle 2 Areas: Website £179 vs Setmore £180
- Masseter: Website £240 vs Setmore £230
- Lip Flip: Website £85 vs Setmore £140
- Seventy Hyal Skin Booster: Website £160 vs Setmore £140
- Profhilo: Website £250 vs Setmore £280

**Wrong Setmore product IDs (links go to wrong service):**
- Facial Balancing 3ml, 5ml
- Anti-Wrinkle 2 Areas, 3 Areas
- Masseter, Lip Flip
- Seventy Hyal, Polynucleotides, Profhilo

**Missing from website:**
- Several services in the "Other" category on Setmore (duplicate listings, review appointments, etc.)
- "DO NOT BOOK" header entries on Setmore need to be filtered out

**URL format:**
- Setmore's own links use `step=additional-products` - this needs to be added back to all URLs

---

### What Will Be Done

#### 1. Full Treatment Data Resync (~1 file, major rewrite)

Rewrite the entire `SERVICES` array in `BookingSystem.tsx` to match Setmore exactly:
- Correct all prices to match Setmore
- Correct all product IDs to match Setmore
- Add `step=additional-products` back to all URLs (Setmore's own format)
- Filter out "DO NOT BOOK" placeholder entries
- Match category names to Setmore's structure
- Remove services that no longer exist on Setmore

#### 2. Update Treatment Landing Page Links (~20+ files)

Update all individual treatment pages with corrected Setmore URLs and `step=additional-products` format.

#### 3. Update Homepage + Component Links (~3 files)

Fix HeroSection, FinalCTA, and any other components with Setmore links.

#### 4. Keep Stripe Checkout (no changes)

The existing Stripe checkout flow via `create-booking-checkout` edge function stays as-is. No modifications needed.

#### 5. Booking Notification System (new)

When a booking comes through your website's Stripe checkout, you already get a confirmation email. To help you manually add these to Setmore:
- Enhance the existing `send-booking-email` edge function to also send a clinic-facing notification email with all booking details (name, treatment, date, time)
- This gives you a clear email to reference when adding the booking to Setmore manually

---

### Technical Details

**Files modified:**
- `src/pages/BookingSystem.tsx` - full SERVICES array rewrite with corrected data
- `src/components/home/HeroSection.tsx` - URL format fix
- `src/components/home/FinalCTA.tsx` - URL format fix
- ~20 treatment landing pages - URL corrections
- `supabase/functions/send-booking-email/index.ts` - add clinic notification email

**No database changes needed.**

**Future Setmore sync:** Since Setmore doesn't offer a public API for automated syncing, when you update treatments on Setmore, you would ask me to re-scrape and update the website to match. This is the most reliable approach given Setmore's limitations.

