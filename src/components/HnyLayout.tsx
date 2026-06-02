import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import instagramLogo from "@/assets/instagram-logo.png";
import tiktokLogo from "@/assets/tiktok-logo.png";
import klarnaLogo from "@/assets/hny/klarna-mark.png";
import clearpayLogo from "@/assets/hny/clearpay-mark.png";
import payItMonthlyLogo from "@/assets/hny/payitmonthly-mark.png";
import hnyLogo from "@/assets/hny/logo.png";

// Central CTA destinations — swap these one-liners when external links are ready.
export const INSTAGRAM_URL = "https://www.instagram.com/thehnyclub/";
export const WHATSAPP_URL =
  "https://wa.me/447795008114?text=Hi%20HNY%20CLUB%2C%20I%27d%20like%20to%20book%20a%20virtual%20chat%20about%20Liquid%20BBL";
export const CONSULT_URL = "https://Hiveclinicuk.as.me/?calendarID=14132488"; // Acuity consultation booking
export const DEPOSIT_URL = "/bookings"; // £100 deposit checkout — swap to Stripe link when ready

const navAnchors = [
  { href: "#treatment", label: "Treatment" },
  { href: "#pricing", label: "Pricing" },
  { href: "#prepare", label: "Prepare" },
  { href: "#aftercare", label: "Aftercare" },
  { href: "#faq", label: "FAQ" },
];

const HnyLayout = ({ children }: { children: React.ReactNode }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div
      className="hny-club min-h-screen flex flex-col"
      style={{ background: "var(--hny-cream)", color: "var(--hny-ink)" }}
    >
      <header
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b"
        style={{ background: "rgba(246, 241, 234, 0.92)", borderColor: "var(--hny-champagne)" }}
      >
        <nav className="max-w-7xl mx-auto px-5 md:px-8 py-2 flex items-center justify-between">
          <Link to="/liquid-bbl-manchester" aria-label="HNY CLUB by Hive Clinic" className="flex items-center">
            <img
              src={hnyLogo}
              alt="HNY CLUB by Hive Clinic - Liquid BBL Manchester"
              className="h-14 md:h-24 w-auto"
            />
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navAnchors.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="font-body text-[11px] tracking-[0.24em] uppercase transition-opacity hover:opacity-60"
                style={{ color: "var(--hny-mocha)" }}
              >
                {l.label}
              </a>
            ))}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 font-body text-[11px] tracking-[0.24em] uppercase rounded-full text-white transition-opacity hover:opacity-90"
              style={{ background: "var(--hny-ink)" }}
            >
              Book Virtual Chat
            </a>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden"
            aria-label="Toggle menu"
            style={{ color: "var(--hny-mocha)" }}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t overflow-hidden"
              style={{ borderColor: "var(--hny-champagne)", background: "var(--hny-cream)" }}
            >
              <div className="px-6 py-5 flex flex-col gap-3">
                {navAnchors.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className="font-body text-[12px] tracking-[0.22em] uppercase py-1"
                    style={{ color: "var(--hny-mocha)" }}
                  >
                    {l.label}
                  </a>
                ))}
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 px-6 py-3 rounded-full text-white text-center font-body text-[11px] tracking-[0.22em] uppercase"
                  style={{ background: "var(--hny-ink)" }}
                >
                  Book Virtual Chat
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1 pt-[72px] md:pt-[120px]">{children}</main>

      <footer className="border-t" style={{ borderColor: "var(--hny-champagne)", background: "var(--hny-nude)" }}>
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <img src={hnyLogo} alt="HNY CLUB by Hive Clinic" className="h-20 w-auto mb-4" />
            <p className="font-body text-sm leading-relaxed" style={{ color: "var(--hny-soft-brown)" }}>
              Ultrasound-led non-surgical body contouring at Hive Clinic, Deansgate, Manchester.
            </p>
          </div>
          <div>
            <h4 className="font-display text-base mb-3 tracking-wide" style={{ color: "var(--hny-mocha)" }}>Explore</h4>
            {navAnchors.map((l) => (
              <a key={l.href} href={l.href} className="block font-body text-sm mb-2 hover:opacity-70" style={{ color: "var(--hny-soft-brown)" }}>
                {l.label}
              </a>
            ))}
            <Link to="/" className="block font-body text-sm mb-2 hover:opacity-70" style={{ color: "var(--hny-soft-brown)" }}>
              Hive Clinic Home
            </Link>
          </div>
          <div>
            <h4 className="font-display text-base mb-3 tracking-wide" style={{ color: "var(--hny-mocha)" }}>Visit</h4>
            <p className="font-body text-sm" style={{ color: "var(--hny-soft-brown)" }}>22 St John Street</p>
            <p className="font-body text-sm" style={{ color: "var(--hny-soft-brown)" }}>Deansgate, Manchester M3 4EB</p>
            <a href="tel:+447795008114" className="font-body text-sm block mt-1 hover:opacity-70" style={{ color: "var(--hny-soft-brown)" }}>+44 7795 008114</a>
            <div className="mt-4 flex gap-3">
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <img src={instagramLogo} alt="Instagram" className="h-6 w-6 opacity-70 hover:opacity-100" />
              </a>
              <a href="https://tiktok.com/@hiveclinicuk" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <img src={tiktokLogo} alt="TikTok" className="h-6 w-6 opacity-70 hover:opacity-100 rounded-full" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-display text-base mb-3 tracking-wide" style={{ color: "var(--hny-mocha)" }}>Pay your way</h4>
            <p className="font-body text-xs mb-3" style={{ color: "var(--hny-soft-brown)" }}>
              Klarna, Clearpay and PayItMonthly plans available, subject to provider approval.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <img src={klarnaLogo} alt="Klarna" className="h-5 opacity-80" />
              <img src={clearpayLogo} alt="Clearpay" className="h-5 opacity-80" />
              <img src={payItMonthlyLogo} alt="PayItMonthly" className="h-5 opacity-80" />
            </div>
          </div>
        </div>
        <div className="border-t" style={{ borderColor: "var(--hny-champagne)" }}>
          <div className="max-w-6xl mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-3">
            <p className="font-body text-[11px]" style={{ color: "var(--hny-soft-brown)" }}>
              © 2026 HNY CLUB by Hive Clinic. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/terms" className="font-body text-[11px] hover:opacity-70" style={{ color: "var(--hny-soft-brown)" }}>Terms</Link>
              <Link to="/privacy" className="font-body text-[11px] hover:opacity-70" style={{ color: "var(--hny-soft-brown)" }}>Privacy</Link>
              <Link to="/contact" className="font-body text-[11px] hover:opacity-70" style={{ color: "var(--hny-soft-brown)" }}>Contact</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Sticky mobile CTA */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex gap-2"
        style={{ background: "rgba(246, 241, 234, 0.97)", borderColor: "var(--hny-champagne)" }}
      >
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3.5 text-center rounded-full text-white font-body text-[12px] tracking-[0.22em] uppercase"
          style={{ background: "var(--hny-ink)" }}
        >
          WhatsApp
        </a>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3.5 text-center rounded-full font-body text-[12px] tracking-[0.22em] uppercase border"
          style={{ borderColor: "var(--hny-mocha)", color: "var(--hny-mocha)" }}
        >
          Instagram
        </a>
      </div>
    </div>
  );
};

// Back-compat: previous code imported BOOK_URL — keep alias so external imports don't break.
export const BOOK_URL = DEPOSIT_URL;

export default HnyLayout;
