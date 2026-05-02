import { useCallback } from "react";

const ACUITY_URL = "https://hiveclinicuk.as.me/";
const ACUITY_SCHEDULE_BASE = "https://hiveclinicuk.as.me/schedule/9c3d2206";
const ACUITY_CALENDAR_ID = "13962538";

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
 * Routes the user to /bookings#book and emits a window event with the
 * pre-built Acuity URL so the embedded iframe can deep-link without leaving
 * the site. The native browser back button continues to work.
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
      } else if (eOrOptions && typeof (eOrOptions as React.MouseEvent).preventDefault === "function") {
        (eOrOptions as React.MouseEvent).preventDefault?.();
        opts = maybeCategory;
      } else {
        opts = eOrOptions as BookNowOptions | undefined;
      }
      const url = buildUrl(opts);

      // If we're already on /bookings, just dispatch the event so the embed updates.
      if (typeof window !== "undefined" && window.location.pathname === "/bookings") {
        window.dispatchEvent(new CustomEvent("hive:book", { detail: { url } }));
        const el = document.getElementById("book");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        // Persist target URL for the bookings page to pick up on mount.
        try {
          sessionStorage.setItem("hive:bookUrl", url);
        } catch {}
        window.location.href = "/bookings#book";
      }
    },
    [],
  );
};

export const ACUITY_BOOKING_URL = ACUITY_URL;
export { buildUrl as buildAcuityBookingUrl };
