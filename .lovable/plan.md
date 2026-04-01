## Plan: Redesign Booking Page with Setmore Direct Links

### Overview

Replace the current custom booking system (`BookingSystem.tsx`) with a premium, static front-end page where every treatment links directly to its specific Setmore booking page. No iframe, no custom booking flow.

### Page Structure

1. **Hero** - "Book Your Treatment" title, subtext, scroll-to-services CTA
2. **Quick Start** - Two cards: Skin Consultation + Returning Client (repeat session)
3. **Treatment Categories** - Collapsible sections, each containing service cards
4. **How Booking Works** - 4-step visual guide
5. **FAQ** - Existing FAQ content retained

### Categories and Services

All services extracted from your live Setmore page, organized into these categories (skipping "DO NOT BOOK" placeholder items):

- **Consultations** (3): Skin Consultation, Prescriber Consultation, Repeat Session Bookings
- **Dermal Filler** (14): Lip Filler 1ml/0.5ml, Facial Balancing 2-7ml, Nose Filler, Tear Trough, Jawline, Cheek, Chin, Marionette Lines, Smile Lines, Filler Dissolve, Touch Up/Refresh
- **Anti-Wrinkle** (10): 1/2/3/6 Areas, Masseter, Lip Flip, Bunny Lines, Gummy Smile, Brow Lift, Excessive Sweating, Anti-Wrinkle Consultation
- **Chemical Peels** (10): BioRePeel Face/Body, Level 1/2 Face/Back, courses
- **Intimate Pigment Treatment** (6+courses): Bikini Line, Underarm, Inner Thigh, single + courses
- **Skin Treatments** (5): BioRePeel Face/Body, Glass Skin Treatment, courses
- **Skin Boosters** (8): Seventy Hyal, Polynucleotides, Profhilo, Under Eye, Lumi Eyes, courses
- **Microneedling** (7): Hydrating Serum, Skin Booster, Stretch Mark, Face Texture Repair, Stretch Mark Repair, courses
- **HydroFacial** (2): Hydrafacial, Glass Skin Hydrafacial
- **Fat Dissolve** (6+courses): Small/Medium/Large, courses
- **Body Contouring** (10+): Body Sculpting single/two area, Lymphatic Drainage, combinations, Ultimate Body Reset, courses
- **Wellness** (2): B12 Injection, Biotin Injection
- **IV Drip Therapy** (2): IV Vitamin Drip, IV Booster Add-On
- **Other** (various): Intimate Peels, Melanostop treatments, Review Appointment

### Service Card Design

Each card shows:

- Service name
- Price (e.g. "From £150")
- One-line description
- "Book Now" button linking to exact Setmore URL (`target="_blank" rel="noopener noreferrer"`)
- Small policy text: "By booking, you agree to our [booking policies](/terms)"

### Data Architecture

A single `SERVICES` constant array at the top of the file with typed objects:

```typescript
type Service = {
  title: string;
  price: string;
  description: string;
  category: string;
  setmoreUrl: string;
};
```

This makes future edits simple - just update the URL or price in one place.

### Design Details

- Black, cream, gold palette matching Hive Clinic branding
- Cormorant Garamond headings, Satoshi body text
- Clean card grid (2 columns desktop, 1 mobile)
- Collapsible category sections with smooth animation
- Standard hyphens only, no em dashes, no emojis
- No clutter, no bright colours, no oversized promo blocks

### Technical Changes

- **File modified**: `src/pages/BookingSystem.tsx` - complete rewrite (much simpler, ~400 lines)
- **Route stays the same**: `/bookings`
- **No database dependency** - all service data is hardcoded for reliability and speed
- **No iframe** - pure React components with external Setmore links

### What Gets Removed

- Custom date/time picker, calendar logic
- Payment/Stripe checkout flow
- Addon selection, discount code validation
- All database queries (treatments, availability, bookings, etc.)
- Multi-step wizard UI

The existing booking backend tables remain untouched for admin use.