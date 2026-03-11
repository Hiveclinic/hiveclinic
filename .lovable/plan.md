

# Phase 10: Premium Admin Dashboard Rebuild + Dynamic Website Sync

This is a major rebuild of the admin dashboard to match premium booking platforms (Fresha, Square Appointments) and make the entire website dynamically driven by admin data.

## 1. Manual Client CRUD

**`AdminClientsTab.tsx`:**
- Add "New Client" button that opens an inline form (name, email, phone, DOB, medical notes)
- Inserts into `customer_profiles` with placeholder `user_id`
- Add "Edit" button on each client card to edit name, phone, email inline
- Merge `customer_profiles` data into the client list (currently only reads from bookings)

**Database:** Add RLS policy for admin INSERT and UPDATE on `customer_profiles`. Add admin DELETE policy.

## 2. Dynamic Pricing Page (Website Syncs with Admin)

**`Pricing.tsx`:**
- Replace the entire hardcoded `menu` array with a database query
- Fetch treatments + variants + packages from DB, group by category
- When admin changes a price, the pricing page automatically reflects it

**`Treatments.tsx`:**
- Replace the hardcoded `categories` array with DB-driven treatments
- Fetch `name`, `description`, `price`, `image_url`, `slug`, `category` from `treatments` table

## 3. Reviews Management (Admin-managed Google Reviews)

**Database migration:**
- Create `reviews` table: `id uuid`, `name text`, `text text`, `stars int default 5`, `source text default 'google'`, `active boolean default true`, `created_at timestamptz default now()`
- RLS: public SELECT where active=true, admin ALL

**`Admin.tsx`:** Add "Reviews" tab to admin nav (under Business group)
**`Index.tsx`:** Fetch reviews from DB instead of hardcoded array, with fallback to static data

**Admin Reviews UI:** CRUD for reviews — add, edit, delete. Toggle active/inactive. This lets admin paste in real Google reviews.

## 4. Improved Image Upload UX

**`AdminSiteTab.tsx`:**
- Add drag-and-drop zones for image upload (styled drop area with dashed border)
- Show larger preview thumbnails (current ones are tiny)
- Prominent "Replace" button overlay on each image
- Remove the separate URL paste input (simplify UX)

## 5. Mobile Admin Polish (Fresha-style)

**All admin components — ensure everything fits mobile width:**

**`Admin.tsx`:**
- Add `pb-20` to main content to prevent bottom nav overlap
- Stats cards: already responsive, verify padding

**`AdminCalendarView.tsx`:**
- Mobile edit modal: ensure inputs stack vertically, full-width buttons
- Payment section: stack controls vertically on mobile

**`AdminBookingsTab.tsx`:**
- Booking cards: ensure status buttons wrap properly on mobile
- Search input: full width on mobile

**`AdminTreatmentsTab.tsx`:**
- Treatment edit form: stack 4-column grid into single column on mobile
- Variant/package forms: full-width inputs on mobile
- Category filter: horizontal scroll with `overflow-x-auto`

**`AdminClientsTab.tsx`:**
- Client expanded view: ensure notes, images, and action buttons are full-width on mobile
- Stats grid: already `grid-cols-2`, verify fit

**`AdminSiteTab.tsx`:**
- Addon forms: stack vertically on mobile
- Image grid: single column on mobile

## 6. Treatment Menu Fully Editable

The treatment menu is already fully editable in `AdminTreatmentsTab.tsx` (CRUD, drag reorder, variants, packages, offers, categories). The gap is that the website doesn't read from it. Items 2 above (dynamic Pricing/Treatments pages) closes this gap completely.

---

## Technical Summary

### Database Migration:
- Create `reviews` table with RLS (public SELECT active, admin ALL)
- Add admin INSERT/DELETE policies on `customer_profiles`

### Files to Edit:
- `src/pages/Admin.tsx` — add Reviews tab, bottom padding for mobile nav
- `src/pages/Pricing.tsx` — replace hardcoded menu with DB query
- `src/pages/Treatments.tsx` — replace hardcoded categories with DB query
- `src/pages/Index.tsx` — fetch reviews from DB
- `src/components/admin/AdminClientsTab.tsx` — add manual create/edit client
- `src/components/admin/AdminSiteTab.tsx` — drag-and-drop image upload, larger previews
- `src/components/admin/AdminTreatmentsTab.tsx` — mobile form fixes
- `src/components/admin/AdminBookingsTab.tsx` — mobile width fixes
- `src/components/admin/AdminCalendarView.tsx` — mobile modal fixes

### No edge function changes needed.

