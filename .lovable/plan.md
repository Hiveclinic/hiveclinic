

# Phase 9: Pre-Launch SEO, Compliance, Credibility & Conversion Optimisation

This is a large scope with 18 items. I'll group them by what's already done, what needs code changes, and what's not feasible in this stack.

## Already Done (No Changes Needed)
- **#9 Policy Pages**: Privacy (`/privacy`) and Terms (`/terms`) already exist with full content and footer links
- **#15 Favicon**: Already set in `index.html` line 121 (Hive Clinic logo PNG)
- **#16 Tracking**: GA (`G-V16HNNVZ90`) and Meta Pixel (`1385983552443887`) already in `index.html`. Google Search Console just needs the site verified via GA (no code change)
- **#17 Footer**: Already has clinic name, Manchester City Centre, Instagram, TikTok, booking link, Terms, Privacy links

## Changes to Implement

### 1. SEO Page Titles & Meta Descriptions (Items #1, #2)

No pages currently set `document.title` or page-level meta descriptions. Create a reusable `usePageMeta` hook that sets both `document.title` and a `<meta name="description">` tag via DOM manipulation in `useEffect`.

Apply to every page:
- Homepage: "Hive Clinic | Aesthetic Clinic Manchester City Centre"
- Lip Fillers: "Lip Filler Manchester City Centre | Hive Clinic"
- HydraFacial: "Hydrafacial Manchester City Centre | Hive Clinic"
- Chemical Peels: "Chemical Peels Manchester City Centre | Hive Clinic"
- Microneedling: "Microneedling Manchester City Centre | Hive Clinic"
- Skin Boosters: "Skin Boosters Manchester City Centre | Hive Clinic"
- Mesotherapy: "Mesotherapy Manchester City Centre | Hive Clinic"
- Anti-Wrinkle: "Anti-Wrinkle Consultation Manchester City Centre | Hive Clinic"
- Dermal Filler: "Dermal Filler Manchester City Centre | Hive Clinic"
- Fat Dissolve: "Fat Dissolving Manchester City Centre | Hive Clinic"
- Dermaplaning: "Dermaplaning Manchester City Centre | Hive Clinic"
- LED Therapy: "LED Light Therapy Manchester City Centre | Hive Clinic"
- PRP: "PRP Therapy Manchester City Centre | Hive Clinic"
- Facial Balancing: "Facial Balancing Manchester City Centre | Hive Clinic"
- Micro Sclerotherapy: "Micro Sclerotherapy Manchester City Centre | Hive Clinic"
- Intimate Peels: "Intimate & Body Peels Manchester City Centre | Hive Clinic"
- Consultations: "Free Consultation Manchester City Centre | Hive Clinic"
- Pricing, About, Contact, Blog, Results, Bookings, Aftercare, Terms, Privacy — all get unique titles + descriptions

**New file**: `src/hooks/use-page-meta.ts`
**Files edited**: All ~25 page components (add one-line hook call each)

### 2. Local SEO Copy (Item #3)

Add a brief local SEO paragraph to the homepage hero subtitle and the "About" intro. Update `index.html` structured data opening hours to match the current actual hours.

**Files edited**: `src/pages/Index.tsx` (hero subtitle), `index.html` (structured data hours)

### 3. Meet Bianca Section on Homepage (Item #4)

Add a new section between the Reviews and Blog sections on the homepage with title "Meet Bianca", short practitioner bio text, and a placeholder photo (using existing `gallery2` image which is already used on the About page for Bianca).

**File edited**: `src/pages/Index.tsx`

### 4. Compliance Wording (Item #5)

Update `AntiWrinkle.tsx` page to use "Anti-Wrinkle Consultation" / "Wrinkle Relaxing Treatment — Consultation Required" language. Add a small compliance note: "A consultation with a qualified prescriber is required prior to treatment where applicable."

Also add the compliance note to the homepage highlights where Anti-Wrinkle is mentioned, and to the footer Services list.

**Files edited**: `src/pages/AntiWrinkle.tsx`, `src/pages/Index.tsx`, `src/components/Layout.tsx`

### 5. Treatment Page Structure Consistency (Item #6)

Most treatment pages already follow: Hero → Overview/Benefits → Who it's for (implicit) → FAQ → CTA. The pages that are thinner (Mesotherapy, PRP, Dermaplaning, LEDTherapy, IntimatePeels, MicroSclerotherapy, FacialBalancing) are missing a "Who is this suitable for" and "Downtime & Recovery" section. Add these as brief content blocks between the overview and FAQ sections.

**Files edited**: ~7 thinner treatment pages

### 6. Booking Button Placement (Item #7)

Most pages already have hero CTA + bottom CTA. Ensure every treatment page has a mid-page "Book Appointment" or "Book Consultation" button in the overview/benefits section. Pages like LipFillers and AntiWrinkle already have this pattern. Apply to those that don't.

**Files edited**: Treatment pages missing mid-page CTA

### 7. Trust Signals Section (Item #8)

Add a trust signals strip near the bottom of the homepage (before the final CTA) with 4 items: "Fully insured aesthetic clinic", "Professional consultation process", "Medical grade skincare products", "Professional sterile treatment environment".

**File edited**: `src/pages/Index.tsx`

### 8. Google Reviews Section (Item #10)

The homepage already has a "What Our Clients Say" section with 6 reviews and a "Read All Google Reviews" link to the Google review page. Rename the section heading to "Client Reviews" per request.

**File edited**: `src/pages/Index.tsx`

### 9. Instagram Embed (Item #11)

Embed an Instagram feed section on the homepage. Since we can't use server-side APIs, use a simple approach: link grid to the Instagram profile with a "Follow us on Instagram" CTA. A true embed would require an Instagram embed widget or third-party service.

**File edited**: `src/pages/Index.tsx`

### 10. Image Alt Text (Item #12)

Audit and update all `alt` attributes across treatment pages to be descriptive and include location keywords. Most already have good alt text but some are generic like "gallery image".

**Files edited**: Multiple pages (alt text updates)

### 11. Mobile Spacing & Sticky Booking Button (Items #13, #14)

Add a sticky "Book Appointment" button on mobile (fixed bottom bar, visible only on non-admin, non-booking pages). Audit and tighten vertical padding on mobile for key sections.

**Files edited**: `src/components/Layout.tsx` (add sticky mobile booking bar)

### 12. Internal Linking (Item #18)

Add a "Related Treatments" section at the bottom of each treatment page (before final CTA) with 2-3 links to related treatments.

**Files edited**: All treatment pages

### 13. Cancellation Policy Footer Link (Item #9 partial)

Terms page already covers cancellation policy in detail. Add a "Cancellation Policy" link in the footer that anchors to the Terms page cancellation section.

**File edited**: `src/components/Layout.tsx`

---

## Summary of Files

**New files:**
- `src/hooks/use-page-meta.ts` — reusable hook for title + meta description

**Edited files (~30+):**
- `index.html` — update structured data opening hours
- `src/pages/Index.tsx` — Meet Bianca section, trust signals, client reviews rename, Instagram section, compliance note
- `src/components/Layout.tsx` — sticky mobile booking button, cancellation policy link, compliance note in footer
- `src/pages/AntiWrinkle.tsx` — compliance wording
- All 16 treatment pages — `usePageMeta` hook, alt text, related treatments section, mid-page CTA where missing, suitability/downtime sections for thinner pages
- `src/pages/About.tsx`, `Pricing.tsx`, `Contact.tsx`, `Blog.tsx`, `Results.tsx`, `Aftercare.tsx`, `Terms.tsx`, `Privacy.tsx`, `Bookings.tsx` — `usePageMeta` hook

**No database or edge function changes needed.**

