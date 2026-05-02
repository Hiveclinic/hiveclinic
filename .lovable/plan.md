# Plan: IG/Acuity-vibe redesign + tracking + deploy docs + sync drill-down + security

## 1. Redesign Home + Treatments to match Instagram & Acuity vibe

The Instagram grid is **moody, image-led, dark/cream contrast, large product-style typography, lots of black backgrounds with white serif over editorial hero images, gold price discs**. The current pages still feel "summer gradient + warm cream" — too soft.

**Home (`src/pages/Index.tsx`, `src/components/home/HeroSection.tsx`, `OffersSection.tsx`, `TreatmentShowcase.tsx`)**
- Rework hero into **dark, fashion-editorial style**: full-bleed practitioner/lip portrait, deep black overlay on bottom 50% (not gradient), white serif headline left-aligned with italic gold accent, tiny tracked-out tagline above. Remove the soft amber wash overlay.
- Add a new **"Signature Packages"** section right under hero — black background, 3 cards (Signature Lip £99, Facial Balance £220, Skin Reset 2-Session) styled like the IG promo tiles with circular gold price disc top-right.
- Convert `TreatmentShowcase` into an **Acuity-style category list**: full-width row per category (image left, name + "From £X" + arrow right), thin divider lines, no rounded cards. Mirrors how Acuity displays categories.
- Replace the soft `bg-summer-gradient` sections with a **black/cream alternating rhythm** so the page feels closer to IG's grid.

**Treatments (`src/pages/Treatments.tsx`)**
- Drop the "Spring/Summer 26" hero copy and big italic "edit" decorative type; replace with **dark hero** mirroring Acuity scheduler: black bg, white serif "Treatments", tiny gold "Select a category to begin" subtitle, then jump straight into category list.
- Replace the magazine asymmetric grid with a **vertical Acuity-style category list** (image thumbnail + name + treatment count + "From" + arrow). Matches the live booking flow visually so the website→booking transition feels seamless.
- Add a sticky bottom CTA strip on mobile mimicking IG profile feel.

**Tokens (`src/index.css`, `tailwind.config.ts`)**
- Tighten palette: keep `--gold`, but introduce `--ink` (true black) and `--bone` (warm off-white) usage for alternating sections. No new fonts.

## 2. Analytics tracking on Book Now buttons

Extend `src/hooks/use-tracking.ts`:
```ts
export const trackBookNow = (source: string, category?: string, treatment?: string) => {
  trackEvent("book_now_click", { source, category, treatment });
};
```
Wire it into:
- **Home**: `HeroSection.tsx` (`source: "home_hero"`), `OffersSection.tsx` (`source: "home_offers"`, plus `treatment`), `TreatmentShowcase.tsx` (`source: "home_showcase"`, plus `category`), `FinalCTA.tsx` (`source: "home_final"`).
- **Treatments**: every `Book` button on the category cards (`source: "treatments_grid"`, plus `category`).
- **Pricing**: every per-row Book link (`source: "pricing_row"`, plus `category` + `treatment`) and the bottom CTA (`source: "pricing_footer"`).

Fires both GA `gtag` and Meta `fbq` events; viewable in GA4 Realtime and Meta Events Manager → Test Events.

## 3. Catalog Sync — "View diffs" drill-down + status section

Extend `AdminCatalogSyncTab.tsx`:
- **Per-history-row "View" button** that loads that historical run's full report into a slide-over panel (uses the existing `report` JSON column, no new query needed).
- **Drill-down per diff item** (click a row → reveals): Acuity ID, category, both prices, suggested SQL fix.
- **Copy & Export controls** on each `DiffCard`:
  - "Copy as CSV" → clipboard, columns: type, name, acuity_id, acuity_price, db_price, category.
  - "Export JSON" → download `catalog-diff-<timestamp>.json`.
  - "Copy SQL fix" on price mismatches → generates `UPDATE public.treatments SET price=<acuity_price> WHERE id='<db_id>';`.
- **Status header card** (always visible, even when in sync): big "Last successful sync" timestamp, next scheduled run (~03:00 nightly), small green/amber pill, link to history.

Add a tiny **public-style status block** inside the existing Admin Dashboard home (already has `CatalogDriftBanner`) — extend it to always show a one-line "Catalog last checked X ago · in sync ✓" even when healthy, not only when drift is detected.

## 4. Deploy checklist in README

Replace `README.md` with a Hive-Clinic-specific deploy guide:
- **Publish**: click Publish in Lovable; frontend goes live at `hiveclinicuk.com`. Backend (edge functions, migrations) deploys automatically.
- **Required env vars** (all already set, listed for reference): `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`, plus edge-function secrets (`STRIPE_SECRET_KEY`, `RESEND_API_KEY`, `MAILCHIMP_API_KEY`, `GA_MEASUREMENT_ID`, `META_PIXEL_ID`, `LOVABLE_API_KEY`, `EMAIL_FROM`, `CALENDAR_FEED_PASSWORD`).
- **Post-deploy verification checklist**:
  1. Visit `/hive-admin` → Catalog Sync → "Run Check Now" → confirm "0 issues".
  2. Spot-check 3 prices on `/pricing` against `https://hiveclinicuk.as.me/schedule/9c3d2206`.
  3. Verify Book Now from Home, Treatments, Pricing all open Acuity to the right category.
  4. Check GA4 Realtime for `book_now_click` event after a test click.
  5. Check Meta Events Manager → Test Events for matching pixel fire.
  6. Confirm nightly cron is scheduled: `select * from cron.job where jobname like '%catalog%';`.
- **Rollback**: use Lovable version history → restore previous published version.

## 5. Resolve Supabase linter warnings

Five **WARN: RLS Policy Always True** on INSERT policies that are intentionally public:
- `bookings` "Anyone can create bookings"
- `consent_submissions` "Anyone can insert submissions"
- `contact_submissions` "Anyone can submit contact form"
- `email_subscribers` "Anyone can subscribe"
- `gdpr_consents` "Anyone can insert consent"

**Fix**: Tighten with `WITH CHECK` validation (e.g. require non-null required fields and reject obviously malformed input) so the policy is no longer literally `true`. Example for `bookings`:
```sql
DROP POLICY "Anyone can create bookings" ON public.bookings;
CREATE POLICY "Anyone can create bookings" ON public.bookings
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    customer_email IS NOT NULL
    AND customer_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND customer_name IS NOT NULL
    AND length(customer_name) BETWEEN 1 AND 200
  );
```
Apply analogous tightening to the other four (validate email format, length ≤ reasonable max, required fields non-null). This satisfies the linter and adds a real anti-spam layer.

Two **Public Bucket Allows Listing** warnings (`site-images`, `email-assets`):
- Both buckets are intentionally public for image delivery, but the SELECT policy currently allows listing the entire bucket. Replace with a SELECT policy scoped to **read-by-name only** — clients can fetch a known object URL but can't `list()`:
```sql
-- Drop the broad SELECT policy and replace with one that requires a specific name
DROP POLICY "Public read site-images" ON storage.objects;
CREATE POLICY "Public read site-images by name" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'site-images' AND name IS NOT NULL);
```
Plus revoke list permission via setting bucket `public=true` but removing `storage.objects` LIST capability (the policy approach above is what the linter actually checks).

Two **SECURITY DEFINER function executable** warnings on `public.has_role`:
- This function is intentionally SECURITY DEFINER to break RLS recursion (per memory rule). It already takes `_user_id` and `_role` so it doesn't leak data, but the linter flags it because it's in an exposed schema.
- **Fix**: `REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon, authenticated;` then `GRANT EXECUTE ... TO postgres, service_role;`. RLS policies that call `has_role()` keep working because policies execute as the table owner, not the calling role.

After applying, **re-run `supabase--linter`** and confirm warnings cleared, then **re-run `catalog-sync-check`** to confirm validator still produces "0 issues / in sync".

## Technical summary

Files to edit:
- `src/pages/Index.tsx`, `src/components/home/HeroSection.tsx`, `src/components/home/OffersSection.tsx`, `src/components/home/TreatmentShowcase.tsx`, `src/components/home/FinalCTA.tsx`
- `src/pages/Treatments.tsx`, `src/pages/Pricing.tsx`
- `src/hooks/use-tracking.ts` (add `trackBookNow`)
- `src/components/admin/AdminCatalogSyncTab.tsx` (drill-down, copy/export, status header)
- `src/components/admin/AdminDashboardHome.tsx` (always-visible sync status line)
- `src/index.css`, `tailwind.config.ts` (ink/bone tokens)
- `README.md` (full rewrite as deploy checklist)

Migration:
- One SQL migration: tighten 5 INSERT RLS policies, tighten 2 storage SELECT policies, revoke `has_role` execute from `anon`/`authenticated`.

No new tables, no new edge functions, no new secrets required.