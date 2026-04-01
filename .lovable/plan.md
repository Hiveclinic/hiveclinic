# Rebuild Booking Page — Clean Premium Setmore Flow

## What Changes

`**src/pages/BookingSystem.tsx**` — full rewrite (~250 lines replacing ~867 lines)

Remove all database fetching, booking logic, Stripe integration, multi-step flow, and state management. Replace with a static, conversion-focused page.

## Page Structure

1. **Hero** — "Book Your Treatment" heading, subtext, smooth-scroll CTA to Most Booked
2. **Quick Start** — Two cards: Skin Consultation + Returning Client, each → Setmore new tab
3. **Treatment Categories** — Clean sections (not accordions) for: Skin Treatments, Skin Boosters, Microneedling, Hydrafacial, Injectables, Anti-Wrinkle, Intimate Pigment Treatments, Body, Wellness, IV Drip Therapy. Each card: name, price, one-line benefit, Book Now button
4. **How Booking Works** — 4 numbered steps, minimal layout
5. **FAQ** — Reuse existing FAQ data/accordion
6. **Policy link** — Small muted text under every Book Now button linking to `https://hiveclinicuk.com/policies`

## Design

- Black/cream/gold palette, Cormorant Garamond headings, clean body text
- Mobile-first, large buttons (min 48px), generous spacing
- Light framer-motion fade-ins only
- All CTAs → `https://hiveclinicuk.setmore.com` with `target="_blank" rel="noopener noreferrer"`
- Use hyphens only (no em dashes)

## What's Removed

- All Supabase queries (treatments, availability, bookings, addons, packages, settings)
- Multi-step booking flow, date picker, time slots, customer form
- Discount code logic, Stripe checkout, all related state (~600 lines of logic)

## No Other Files Changed

- Route stays `/bookings` → `BookingSystem`
- No database, backend, or dependency changes