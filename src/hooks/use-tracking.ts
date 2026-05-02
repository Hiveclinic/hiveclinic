import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    fbq: (...args: any[]) => void;
  }
}

export const useTracking = () => {
  useEffect(() => {
    // GA and Meta Pixel are initialized in index.html
    // This hook can be used for event tracking
  }, []);
};

export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  // Google Analytics event
  if (window.gtag) {
    window.gtag("event", eventName, params);
  }
  // Meta Pixel event
  if (window.fbq) {
    window.fbq("track", eventName, params);
  }
};

export const trackBookingClick = (source: string) => {
  trackEvent("booking_click", { source });
};

/**
 * Unified tracker for "Book Now" CTAs across Home, Treatments, Pricing, etc.
 * Fires both GA4 (`book_now_click`) and Meta Pixel events with rich params so
 * we can segment by surface, category and treatment in dashboards.
 */
export const trackBookNow = (
  source: string,
  category?: string,
  treatment?: string,
) => {
  const payload: Record<string, string> = { source };
  if (category) payload.category = category;
  if (treatment) payload.treatment = treatment;
  trackEvent("book_now_click", payload);
  // Also fire a generic InitiateCheckout-style signal for Meta
  if (window.fbq) {
    window.fbq("trackCustom", "BookNowClick", payload);
  }
};

export const trackWhatsAppClick = (source: string) => {
  trackEvent("whatsapp_click", { source });
};

export const trackContactSubmit = () => {
  trackEvent("Lead");
  trackEvent("contact_form_submit");
};
