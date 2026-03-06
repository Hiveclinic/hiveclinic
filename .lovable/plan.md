

# Phase 8: Opening Hours Update, Remove Image Cropper, Mobile-Friendly Admin

## 1. Remove Image Cropper

Delete `src/components/admin/ImageCropModal.tsx` and remove its usage from `AdminSiteTab.tsx`. Revert the upload flow to directly upload the selected file without a crop step (the `onFileSelected` function will call `handleImageUpload` directly with the raw file).

### Changes:
- Delete `src/components/admin/ImageCropModal.tsx`
- `AdminSiteTab.tsx`: Remove `ImageCropModal` import, remove `cropFile` state, remove `onCropComplete`, change `onFileSelected` to upload directly. Remove the crop modal render at the bottom.

## 2. Update Opening Hours in Footer

Update the text-only content in `Layout.tsx` footer (lines 249-257).

Replace with:
```
Mon: 10:00 - 17:00
Tue: 10:00 - 17:00
Wed: Closed
Thu: 11:00 - 18:30
Fri: 10:00 - 17:00
Sat: 10:00 - 15:00
Sun: Closed
```

Add two small notes underneath:
- "Bank holiday hours may vary."
- "Appointments are required. Limited same-week availability may be released."

No layout, styling, font, colour, or spacing changes.

## 3. Mobile-Friendly Admin Dashboard

The current admin has several mobile pain points: the calendar grid has `min-w-[900px]`, booking cards stack poorly, stats overflow on small screens. The goal is to make it feel like a premium booking app (think Fresha/Square Appointments) on mobile.

### Changes to `Admin.tsx`:
- Make quick stats responsive: `grid-cols-1 sm:grid-cols-3` instead of `grid-cols-3`
- Add bottom navigation bar on mobile (visible only on `lg:hidden`) with the 5 most-used tabs (Calendar, Bookings, Clients, Treatments, Settings) as icon buttons — replacing the hamburger sidebar pattern for faster access
- Reduce header padding on mobile

### Changes to `AdminCalendarView.tsx`:
- **Mobile day view**: On mobile (`< lg`), show a single-day view instead of the 7-day week grid. Add left/right arrows to navigate between days. Show bookings as a vertical list for that day.
- Keep the full week grid on desktop (no changes there)
- Make the edit modal full-screen on mobile (`max-w-lg` → `w-full h-full lg:max-w-lg lg:h-auto lg:max-h-[90vh]`)

### Changes to `AdminBookingsTab.tsx`:
- Make booking cards stack better on mobile: status buttons wrap into a 2-column grid on small screens
- Stats grid: `grid-cols-2 sm:grid-cols-3 md:grid-cols-6`
- Filter buttons scroll horizontally on mobile with `overflow-x-auto`

### Changes to `AdminClientsTab.tsx`:
- Client cards: stack info vertically on mobile instead of flex-row
- Action buttons (Delete, Rebook) full-width on mobile

### Changes to `AdminSiteTab.tsx`:
- Image management cards: stack preview and inputs vertically on mobile

---

## Technical Summary

### Files to Delete:
- `src/components/admin/ImageCropModal.tsx`

### Files to Edit:
- `src/components/Layout.tsx` — update opening hours text
- `src/components/admin/AdminSiteTab.tsx` — remove cropper, improve mobile layout
- `src/pages/Admin.tsx` — add mobile bottom nav, responsive stats
- `src/components/admin/AdminCalendarView.tsx` — mobile day view, full-screen modal
- `src/components/admin/AdminBookingsTab.tsx` — responsive cards and filters
- `src/components/admin/AdminClientsTab.tsx` — responsive client cards

### No database or edge function changes needed.

