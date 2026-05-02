# Hive Clinic — Manchester

Production website for Hive Clinic (Deansgate, Manchester). Built on Lovable Cloud (React + Vite + Supabase). The treatment menu is kept in lockstep with the live Acuity scheduler via an automated catalog-sync validator.

- **Production**: https://www.hiveclinicuk.com
- **Lovable preview**: https://hiveclinic.lovable.app
- **Booking source of truth**: https://hiveclinicuk.as.me/schedule/9c3d2206
- **Admin**: `/hive-admin`

---

## Deploy checklist

### 1. Publish

- **Frontend**: open the project in Lovable → click **Publish → Update**. Frontend goes live on `hiveclinicuk.com` within ~30s.
- **Backend** (edge functions, migrations): deploy automatically when changes are merged. No manual step.

### 2. Required environment variables

Frontend `.env` (auto-managed by Lovable Cloud — do not edit by hand):

| Var | Purpose |
|---|---|
| `VITE_SUPABASE_URL` | Backend URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Public anon key |
| `VITE_SUPABASE_PROJECT_ID` | Project ref |

Edge-function secrets (set in Lovable Cloud → Backend → Secrets):

| Secret | Used by |
|---|---|
| `STRIPE_SECRET_KEY` | `create-booking-checkout`, `stripe-webhook`, `create-payment-link` |
| `RESEND_API_KEY` | `send-email`, `send-booking-email`, `send-reminders`, `auth-email-hook` |
| `EMAIL_FROM` | All transactional emails |
| `MAILCHIMP_API_KEY`, `MAILCHIMP_AUDIENCE_ID` | `mailchimp-subscribe` |
| `LOVABLE_API_KEY` | `ai-aftercare`, `ai-treatment-chat`, `ai-treatment-suggest` |
| `META_PIXEL_ID`, `GA_MEASUREMENT_ID` | Analytics (also referenced in `index.html`) |
| `CALENDAR_FEED_PASSWORD` | `calendar-feed` iCal token |
| `ACUITY_USER_ID`, `ACUITY_API_KEY` | Reserved (sync currently scrapes the public scheduler) |

### 3. Post-deploy verification

Run through this every time you publish a change that touches treatments, pricing, or booking:

1. **Catalog parity** — `/hive-admin` → **Catalog Sync** → click **Run Check Now**. Expect "Menu matches the live scheduler" (0 issues). If drift is shown, click **View** on each diff card and copy the suggested SQL fix.
2. **Pricing spot-check** — pick 3 random rows on `/pricing` and confirm both name and price match the corresponding entry on https://hiveclinicuk.as.me/schedule/9c3d2206.
3. **Treatments page** — visit `/treatments`, confirm category list renders and the **Book** button on each row links to `/bookings#book`.
4. **Book Now tracking** — open GA4 → **Realtime** in one tab and Meta Events Manager → **Test Events** in another. Click **Book Now** on Home hero, a Treatments row, and a Pricing row. Confirm a `book_now_click` event fires with the correct `source` (`home_hero`, `treatments_grid`, `pricing_row`) and, where applicable, `category` and `treatment` params.
5. **Embedded booking flow** — `/bookings#book` → confirm the Acuity scheduler embed renders and a test category opens correctly.
6. **Nightly cron** — confirm the catalog validator is scheduled:
   ```sql
   select jobname, schedule, active from cron.job where jobname ilike '%catalog%';
   ```
   Expect one active job running nightly.
7. **Security baseline** — admin ops only: re-run the Supabase linter and confirm 0 SECURITY warnings for the catalog validator path.

### 4. Rollback

In Lovable: open **Version History** → select the last known-good version → **Restore**. Frontend reverts immediately; database migrations are not rolled back automatically — coordinate with the DB if a schema change is involved.

---

## Local development

```sh
git clone <repo>
cd hive-clinic
npm install
npm run dev
```

Stack: Vite, React 18, TypeScript, Tailwind CSS, shadcn/ui, framer-motion, Supabase (Lovable Cloud).

## Catalog sync — how it works

- **Validator**: `supabase/functions/catalog-sync-check` scrapes the live Acuity scheduler, diffs it against `public.treatments`, writes a structured report to `public.catalog_sync_log`.
- **Manual run**: `/hive-admin` → **Catalog Sync** → **Run Check Now**.
- **Automatic run**: nightly via `pg_cron` + `pg_net`.
- **Status banner**: the admin dashboard home shows the most recent sync status (green when in sync, amber when drift is detected).

## Repo conventions

- **Memory rules**: `mem://index.md` documents project-wide aesthetic, copy, compliance, and security rules. Honour them.
- **Never edit**: `src/integrations/supabase/client.ts`, `src/integrations/supabase/types.ts`, `.env`.
