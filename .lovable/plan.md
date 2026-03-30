

# Meta Tracking Setup — Pixel + Conversions API + CRM Leads

## Summary

Complete Meta tracking integration: update the Pixel ID globally, add browser events across the site, build a secure Conversions API edge function, create a leads table with CRM stages, and add an admin test utility tab.

---

## Part 1 — Update Meta Pixel (index.html)

The site already has a Meta Pixel installed (ID `1385983552443887`). Replace it with the new Pixel ID `3990951841193317` in `index.html`. Update both the script init and the noscript fallback img tag.

## Part 2 — Browser Events (use-tracking.ts + various pages)

The `trackEvent` helper already fires `fbq('track', ...)`. Add specific event calls:

- **ViewContent** — fire on treatment detail pages (DermalFiller, LipFillers, AntiWrinkle, etc.) and Offers page via a `useEffect` in each page or a shared hook
- **Lead** — already fires on contact form submit (`trackContactSubmit`). Ensure it also fires on consultation form submit
- **Contact** — fire on WhatsApp button click, contact form submit, and any DM intent links
- **Schedule** — fire on booking intent clicks (BookingSystem page load or "Book Now" button clicks)
- **CompleteRegistration** — fire on VIP popup email signup success

Update `use-tracking.ts` with new helper functions: `trackViewContent`, `trackSchedule`, `trackCompleteRegistration`, `trackContact`. Wire these into the relevant components.

## Part 3 — Conversions API Edge Function

Create `supabase/functions/meta-capi/index.ts`:

- Accepts POST with: `event_name`, `email`, `phone`, `lead_id`, `click_id`, `test_event_code`
- Reads `META_CAPI_ACCESS_TOKEN` from env
- Normalizes email/phone, hashes with SHA-256 server-side
- Builds Meta CAPI payload with `action_source: "system_generated"`, `custom_data.event_source: "crm"`, `custom_data.lead_event_source: "Hive Clinic CRM"`
- POSTs to `https://graph.facebook.com/v25.0/3990951841193317/events`
- Returns Meta's response or a clean error
- CORS headers for admin frontend calls
- Auth: requires authenticated admin user (checks JWT + admin role)

Add to `supabase/config.toml` with `verify_jwt = false` (validate in code).

**Secret needed**: `META_CAPI_ACCESS_TOKEN` — will request via add_secret tool.

## Part 4 — CRM Leads Table

Create a `leads` table via migration:

| Column | Type | Default |
|---|---|---|
| id | uuid | gen_random_uuid() |
| customer_email | text | required |
| customer_name | text | nullable |
| customer_phone | text | nullable |
| lead_source | text | 'website' |
| status | text | 'Lead' |
| meta_click_id | text | nullable |
| meta_sent_at | timestamptz | nullable |
| notes | text | nullable |
| created_at | timestamptz | now() |
| updated_at | timestamptz | now() |

RLS: admin-only for all operations. Status values: Lead, QualifiedLead, ConsultationBooked, ConsultationCompleted, Purchase.

## Part 5 — Admin Meta Test Tab

Create `src/components/admin/AdminMetaTestTab.tsx`:

- Form fields: event name (dropdown of CRM stages), email, phone, lead ID, click ID, test event code (optional)
- Validates inputs with zod
- Calls the `meta-capi` edge function
- Displays Meta's response in a success/error panel
- Admin-only (already protected by admin auth)

Add a "Meta CAPI" tab to the Admin page under the "Business" or "Admin" nav group.

## Part 6 — Admin Leads Management

Create `src/components/admin/AdminLeadsTab.tsx`:

- List leads with status badges
- Change lead status via dropdown — on status change, auto-fire the CAPI event to Meta
- Add to admin nav under "Clients" group

---

## Files to Create
- `supabase/functions/meta-capi/index.ts`
- `src/components/admin/AdminMetaTestTab.tsx`
- `src/components/admin/AdminLeadsTab.tsx`
- Migration SQL for `leads` table

## Files to Modify
- `index.html` — swap Pixel ID
- `src/hooks/use-tracking.ts` — add ViewContent, Schedule, CompleteRegistration, Contact helpers
- `src/components/WhatsAppButton.tsx` — fire Contact event on click
- `src/components/VIPPopup.tsx` — fire CompleteRegistration on signup
- `src/pages/BookingSystem.tsx` — fire Schedule event
- Treatment pages — fire ViewContent event (via shared hook or individual useEffect)
- `src/pages/Contact.tsx` — fire Contact event on submit
- `src/pages/Admin.tsx` — add leads + meta-test tabs to nav and rendering
- `supabase/config.toml` — add meta-capi function config

## Secret Required
- `META_CAPI_ACCESS_TOKEN` — will prompt you to paste your Meta access token

