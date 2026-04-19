import { useCallback } from "react";

const ACUITY_URL = "https://hiveclinicuk.as.me/";
const ACUITY_SCHEDULE_BASE = "https://hiveclinicuk.as.me/schedule/9c3d2206";
const ACUITY_CALENDAR_ID = "13962538";

// Map our clean category labels back to the exact Acuity category path segment.
const ACUITY_CATEGORY_MAP: Record<string, string> = {
  "Anti Wrinkle (Botox)": "✦ ANTI WRINKLE (BOTOX)",
  "Chemical Peels": "✦ CHEMCIAL PEELS",
  "Consultation": "✦ CONSULTATION",
  "Correction": "✦ CORRECTION",
  "Facial Balancing": "✦ FACIAL BALANCING",
  "Fat Dissolve": "✦ FAT DISSOLVE",
  "Lips": "✦ LIPS",
  "Skin Boosters": "✦ SKIN BOOSTERS",
  "Skin Treatments": "✦ SKIN TREATMENTS",
};

interface BookNowOptions {
  category?: string;
  appointmentTypeId?: string;
}

const buildUrl = (opts?: BookNowOptions | string): string => {
  if (!opts) return ACUITY_URL;
  const o: BookNowOptions = typeof opts === "string" ? { category: opts } : opts;
  const acuityCat = o.category ? ACUITY_CATEGORY_MAP[o.category] ?? o.category : undefined;
  if (acuityCat && o.appointmentTypeId) {
    return `${ACUITY_SCHEDULE_BASE}/category/${encodeURIComponent(acuityCat)}/appointment/${o.appointmentTypeId}/calendar/${ACUITY_CALENDAR_ID}`;
  }
  if (acuityCat) {
    return `${ACUITY_SCHEDULE_BASE}/category/${encodeURIComponent(acuityCat)}`;
  }
  return ACUITY_URL;
};

/**
 * Hook for unified Book Now behaviour.
 * Opens Acuity scheduling in a new tab. Optional category + appointmentTypeId
 * deep-links straight to that calendar pre-filtered to the chosen service.
 *
 * Usage:
 *   const book = useBookNow();
 *   book();                                          // generic scheduler
 *   book("Lips");                                    // category landing
 *   book(e, "Lips");                                 // event + category
 *   book({ category: "Lips", appointmentTypeId: "92112291" }); // specific service
 */
export const useBookNow = () => {
  return useCallback(
    (
      eOrOptions?: React.MouseEvent | string | BookNowOptions,
      maybeCategory?: string,
    ) => {
      let opts: BookNowOptions | string | undefined;
      if (typeof eOrOptions === "string") {
        opts = eOrOptions;
      } else if (eOrOptions && "preventDefault" in eOrOptions) {
        eOrOptions.preventDefault?.();
        opts = maybeCategory;
      } else {
        opts = eOrOptions;
      }
      window.open(buildUrl(opts), "_blank", "noopener,noreferrer");
    },
    [],
  );
};

export const ACUITY_BOOKING_URL = ACUITY_URL;
export { buildUrl as buildAcuityBookingUrl };
