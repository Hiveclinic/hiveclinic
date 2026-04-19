import { useCallback } from "react";

const ACUITY_URL = "https://hiveclinicuk.as.me/";

/**
 * Hook for unified Book Now behaviour.
 * Opens Acuity scheduling in a new tab. Optional category deep-links
 * straight to that section in Acuity.
 */
export const useBookNow = () => {
  return useCallback((eOrCategory?: React.MouseEvent | string, maybeCategory?: string) => {
    let category: string | undefined;
    if (typeof eOrCategory === "string") {
      category = eOrCategory;
    } else {
      eOrCategory?.preventDefault?.();
      category = maybeCategory;
    }
    const url = category
      ? `${ACUITY_URL}?category=${encodeURIComponent(category)}`
      : ACUITY_URL;
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);
};

export const ACUITY_BOOKING_URL = ACUITY_URL;
