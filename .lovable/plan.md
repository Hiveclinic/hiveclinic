## Goal

Replace the current redirect-only `/bookings` page with a fully custom Hive Clinic booking flow powered by the live Acuity API. Categories, treatments, availability, offers and appointment creation all come from Acuity. Confirmation + consent stay inside Acuity (per your decision). Site gets a subtle summer refresh.

## Security note - read first

The API key you pasted in chat is now exposed in the conversation log. **Please rotate it in Acuity → Business Settings → Integrations → API → "Reset key"** before we use it. The new key will be stored as an encrypted Supabase secret (`ACUITY_API_KEY`), only ever read by edge functions, never bundled into the browser, never committed to the repo.

---

## Pre-work (immediately after you approve)

I'll request two secrets via the secrets tool. You paste them into the prompt (not the chat):
1. `ACUITY_USER_ID` = `39098354`
2. `ACUITY_API_KEY` = the **new** key after rotation

Then I build everything below.

---

## What gets built

### 1. Three Acuity edge functions (server-side only, HTTP Basic Auth)

| Function | Acuity endpoint | Purpose |
|---|---|---|
| `acuity-catalog` | `GET /api/v1/appointment-types` + `GET /api/v1/categories` | Live category + treatment list with prices, durations, and any `discountPrice` |
| `acuity-availability` | `GET /availability/dates` and `GET /availability/times` | Bookable days, then time slots for a chosen date + appointment type |
| `acuity-create-appointment` | `POST /api/v1/appointments` | Creates the appointment with name/email/phone/notes, returns Acuity's confirmation URL |

Notes:
- 60-second in-memory cache on `acuity-catalog` so repeat visitors don't hammer Acuity.
- All inputs validated with zod; clear 400s on bad input.
- All responses include CORS headers.
- Errors logged but Acuity's raw error body never leaked to the client.

### 2. New `/bookings` flow (single page, progressive disclosure)

```text
[Hero - Book Your Treatment]
   ↓
[Featured / Offers strip]    auto-detected: any type with discountPrice, or
   ↓                         category name containing OFFER / TOX / SPECIAL
[Category tabs]              only the live Acuity categories
   ↓
[Treatment grid]             card: name, price, duration, "Select"
   ↓
[Date picker]                calendar from /availability/dates
   ↓
[Time slots]                 chips from /availability/times
   ↓
[Details form]               name, email, phone, notes (zod validated)
   ↓
[Policies + GDPR consent]    writes to existing gdpr_consents
   ↓
[Confirm & Book]             calls acuity-create-appointment
   ↓
window.location → Acuity confirmation URL (where consent + payment live)
```

Mobile: full-width single column, 48px+ tap targets, sticky "Continue" button.
Desktop: centred at max-w-2xl, steps stack inline as completed.

### 3. Offers - automatic from Acuity

No admin toggle. The catalog function flags `featured: true` when `discountPrice` is set or the parent category name matches `/offer|tox|special/i`. The Featured strip hides cleanly when nothing is flagged.

### 4. Confirmation + consent

Per your decision, Acuity already handles confirmation + consent. So:
- After successful API call → redirect to the `confirmationPage` URL Acuity returns.
- No new `/booking-confirmation` page.
- Existing `consent_form_templates` / `consent_submissions` left alone (still used by admin + customer portal).

### 5. Summer refresh (subtle, brand-safe)

- New `--cream` token (~`30 25% 97%`) for `/bookings` page background instead of pure white.
- New muted `--champagne` token (~`38 30% 70%`) used only on hover states + the featured ribbon.
- Lighter section dividers (~5% lighter than current `--border`).
- Softer card shadows (`shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)]`).
- A touch more breathing room (py-20 → py-24 on hero + offers).

Black, cream and gold remain primary. No tropical themes, no bright colours.

### 6. Database

One small additive migration: `acuity_cache` singleton table (`id text pk | data jsonb | fetched_at timestamptz`) so the page still loads instantly if Acuity has a hiccup. RLS: admins manage, anyone can select. **No destructive changes.** Existing `treatments` table stays - it still drives `/treatments/*` SEO pages and the admin dashboard, just no longer renders `/bookings`.

### 7. Files

```text
NEW   supabase/functions/acuity-catalog/index.ts
NEW   supabase/functions/acuity-availability/index.ts
NEW   supabase/functions/acuity-create-appointment/index.ts
NEW   supabase/migrations/<ts>_acuity_cache.sql
NEW   src/components/booking/FeaturedStrip.tsx
NEW   src/components/booking/CategoryTabs.tsx
NEW   src/components/booking/TreatmentGrid.tsx
NEW   src/components/booking/DateTimePicker.tsx
NEW   src/components/booking/DetailsForm.tsx
NEW   src/hooks/use-acuity-catalog.ts
NEW   src/hooks/use-acuity-availability.ts
EDIT  src/pages/BookingSystem.tsx   - rewritten as orchestrator
EDIT  src/pages/Bookings.tsx        - redirect to /bookings
EDIT  src/index.css                 - cream + champagne tokens
EDIT  tailwind.config.ts            - expose new tokens
```

Untouched: admin dashboard, all `/treatments/*` landing pages, consent system, payment system, every other booking flow.

### 8. Acceptance checks

- `/bookings` loads live category + treatment list under 800ms (cached).
- Treatment → date → time → details → "Confirm" creates a real Acuity appointment (verifiable in Acuity dashboard).
- Any Acuity type with `discountPrice` appears in Featured with strikethrough pricing.
- API keys never in network requests or browser bundle.
- Mobile single-column with 48px+ tap targets.
- Black/cream/gold preserved; only page background and a couple of hover states show summer refresh.

---

## Out of scope (so this stays focused)

- Per-user OAuth, rebuilding admin dashboard, Stripe checkout changes, consent form rewrite, treatment landing pages, IV/Wellness/Body categories that don't exist on Acuity.