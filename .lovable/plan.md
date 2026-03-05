

# Phase 7: Delete/Export/Rebook Clients, Delete/Export Bookings, Image Cropping

## 1. Delete & Rebook Clients

**`AdminClientsTab.tsx`:**
- Add a "Delete" button per client row that deletes all their bookings, notes, and images, then removes from view
- Add a "Rebook" button per client that navigates to `/bookings?email=CLIENT_EMAIL&name=CLIENT_NAME` to pre-fill their details
- Update `BookingSystem.tsx` to read `email` and `name` from URL params and pre-fill the customer form fields

## 2. Delete & Export Bookings

**`AdminBookingsTab.tsx`:**
- Add a "Delete" button per booking (with confirmation) that deletes the booking record from the database
- The export button already exists and works -- no changes needed there

## 3. Export Clients (Already Works)

The export CSV button already exists in `AdminClientsTab.tsx`. No changes needed.

## 4. Image Cropping in Admin Site Settings

**`AdminSiteTab.tsx`:**
- Add a built-in image cropper using a `<canvas>`-based approach (no new dependency needed)
- When an image is uploaded, show a crop modal with drag-to-crop and aspect ratio presets (16:9 for hero, 1:1 for gallery)
- After cropping, upload the cropped result to the `site-images` bucket
- Add a "Preview" thumbnail next to each image slot showing the current image
- Add a "Paste URL" input as an alternative to file upload (already exists, just make it more prominent)

## 5. Mark Treatment as On Offer (Testing Note)

The admin `AdminTreatmentsTab.tsx` already has `on_offer`, `offer_price`, and `offer_label` fields in the edit form. The homepage `Index.tsx` already queries for `on_offer = true`. This should work -- I will verify the treatment edit form includes these fields.

---

## Technical Summary

### Files to Edit:
- `AdminClientsTab.tsx` -- add Delete and Rebook buttons per client
- `AdminBookingsTab.tsx` -- add Delete button per booking
- `AdminSiteTab.tsx` -- add image crop modal with canvas-based cropping
- `BookingSystem.tsx` -- read `email`/`name` URL params to pre-fill customer form

### No Database or Edge Function Changes Needed
- Bookings table doesn't have a DELETE RLS policy for admins, so we need a migration to add one

### Database Migration:
- Add DELETE policy on `bookings` table for admins: `has_role(auth.uid(), 'admin'::app_role)`

