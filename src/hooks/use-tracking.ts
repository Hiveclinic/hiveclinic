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

export const trackWhatsAppClick = (source: string) => {
  trackEvent("whatsapp_click", { source });
};

export const trackContactSubmit = () => {
  trackEvent("Lead");
  trackEvent("contact_form_submit");
};
