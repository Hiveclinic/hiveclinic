

## Plan: Fix Broken Setmore Booking Links

### Problem

All Setmore booking URLs across ~24 files use `step=date-time&staffSelected=true` parameters that Setmore doesn't support, causing error pages.

### Fix

Revert every Setmore URL to the working format by removing `step=date-time` and changing `staffSelected=true` back to `staffSelected=false`. This returns users to the standard Setmore service selection/booking flow which works correctly.

**Before:**
```
https://hiveclinicuk.setmore.com/book?step=date-time&products=XXX&type=service&staff=YYY&staffSelected=true
```

**After:**
```
https://hiveclinicuk.setmore.com/book?step=additional-products&products=XXX&type=service&staff=YYY&staffSelected=false
```

### Files affected (~24 files)

All treatment landing pages, BookingSystem.tsx, Index.tsx, HeroSection.tsx, ModelCTA.tsx, and any other file containing Setmore URLs. This is a simple find-and-replace across all files:

1. Replace `step=date-time` → `step=additional-products`
2. Replace `staffSelected=true` → `staffSelected=false`

No layout or design changes.

