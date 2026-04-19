import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * Hook for unified Book Now behaviour.
 * - On /bookings: smooth-scrolls to the embedded scheduler (#book).
 * - Anywhere else: navigates to /bookings#book.
 */
export const useBookNow = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return useCallback(
    (e?: React.MouseEvent) => {
      e?.preventDefault();
      if (location.pathname === "/bookings") {
        const el = document.getElementById("book");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
      }
      navigate("/bookings#book");
    },
    [location.pathname, navigate]
  );
};
