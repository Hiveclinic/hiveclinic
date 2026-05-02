# Custom Acuity Booking - Final Wire-Up

## Status

The three secure server-side endpoints are already built and deployed:

- `acuity-catalog` -> GET services (appointment types + categories)
- `acuity-availability` -> GET dates + times for a given `appointmentTypeId`
- `acuity-create-appointment` -> POST to book (name, email, phone, appointmentTypeId, datetime)

All three:
- Use HTTP Basic Auth with `ACUITY_USER_ID` + `ACUITY_API_KEY` (server-side only, never exposed to the browser)
- Hit `https://acuityscheduling.com/api/v1`
- Are fronted via `supabase.functions.invoke()` from the client

**Blocker:** As of the last test (seconds ago), Acuity is still returning:
> 403 - "API access is only available on Powerhouse plans"

This means the Powerhouse upgrade either hasn't activated on Acuity's side yet or the API key was issued before the upgrade and needs to be re-generated.

## Step 1 - Verify Powerhouse access (required before anything else)

1. In Acuity: **Integrations -> API** -> confirm "API access is enabled" (no upgrade banner).
2. **Reset the API key** (recommended - the old key was issued under the previous plan and may still carry the old permission scope). Paste the new key when prompted.
3. I'll re-test `acuity-catalog`. Expected: a JSON payload with `categories` and `treatments`.

If 403 persists after a fresh key, the upgrade hasn't fully propagated on Acuity's end - usually 5-10 minutes; sometimes a support ticket.

## Step 2 - Build the custom booking UI

Once `/api/acuity/services` returns 200, replace the current Setmore-style `/bookings` page with a true in-site flow:

```text
/bookings
  +-- FeaturedStrip       (auto-detect offers via name/category match: "Tox", "Offer", "Limited")
  +-- CategoryTabs        (driven by live Acuity categories)
  +-- TreatmentGrid       (cards: name, duration, price, "Book" CTA)
  +-- BookingDrawer       (opens on card tap)
        +-- Step 1: DatePicker        (calls acuity-availability?date=...)
        +-- Step 2: TimeSlots         (calls acuity-availability?appointmentTypeId&date)
        +-- Step 3: ClientForm        (name / email / phone)
        +-- Step 4: Confirm           (POST acuity-create-appointment)
        +-- Step 5: Success           (redirect to Acuity's confirmationPage URL so existing consent forms run)
```

Design tokens (already added):
- `--cream`, `--cream-warm`, `--champagne` for the summer refresh
- Cormorant Garamond headings, Satoshi body, fine-line 1.5px icons (project core rules)

UX rules respected:
- One screen, progressive disclosure via drawer
- No heavy animations, no embed
- Standard hyphens (-) in copy, "Anti-Wrinkle Consultation" never abbreviated
- "Booking source of truth" memory updated from Setmore -> Acuity

## Step 3 - Frontend hooks

New hooks under `src/hooks/`:
- `useAcuityCatalog()` - 60s SWR, falls back to cached snapshot if API is down
- `useAcuityAvailability(typeId, date)`
- `useCreateAcuityAppointment()`

## Step 4 - Cleanup

- Delete the Setmore deep-link logic from `use-book-now.ts` (now obsolete)
- Drop `src/components/admin/AdminTreatmentsTab.tsx` Setmore/Acuity ID inputs (catalog is now read live)
- Update memory: booking source of truth -> Acuity API

## What I will NOT do

- Embed Acuity (per your spec)
- Call Acuity from the browser
- Ship secrets to the frontend bundle
- Rebuild the consent-form flow (Acuity already handles it post-book)

## Action needed from you before I build the UI

Reply once you've confirmed in Acuity that **Integrations -> API** shows access enabled and (ideally) that you've reset the key. I'll re-test, and on a 200 response I'll build Steps 2-4 in one pass.