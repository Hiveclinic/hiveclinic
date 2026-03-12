

# Create a Centralised `send-email` Edge Function

## What and Why

Right now, `send-booking-email` is the only function that calls Resend directly, and it's tightly coupled to booking data. You want a generic, reusable email sender that any edge function or frontend call can use — a single point for all email delivery.

## Plan

### 1. New Edge Function: `supabase/functions/send-email/index.ts`

A simple, generic email sender that accepts `to`, `subject`, and `html` (and optional `from` override), calls Resend, and returns the result.

```
POST /functions/v1/send-email
Body: { to: string | string[], subject: string, html: string, from?: string }
Returns: { success: true, id: string }
```

- Reads `RESEND_API_KEY` and `EMAIL_FROM` from secrets
- `from` defaults to `EMAIL_FROM` secret if not provided
- Validates required fields, returns 400 on missing params
- CORS headers included

### 2. Update `supabase/config.toml`

Add `[functions.send-email]` with `verify_jwt = false`.

### 3. Refactor `send-booking-email` to use `send-email`

Replace direct `resend.emails.send()` calls in `send-booking-email` with internal calls to `send-email`. This makes `send-booking-email` responsible only for building the HTML/subject from booking data, while `send-email` handles delivery. This is optional and can be done later to avoid breaking anything now.

## Files

| File | Action |
|------|--------|
| `supabase/functions/send-email/index.ts` | Create — generic Resend wrapper |
| `supabase/config.toml` | Add `send-email` function entry |

No database changes needed. Secrets (`RESEND_API_KEY`, `EMAIL_FROM`) are already configured.

