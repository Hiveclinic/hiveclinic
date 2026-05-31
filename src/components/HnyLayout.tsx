import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import instagramLogo from "@/assets/instagram-logo.png";
import tiktokLogo from "@/assets/tiktok-logo.png";
import klarnaLogo from "@/assets/klarna-logo.png";
import clearpayLogo from "@/assets/clearpay-logo.png";
import hnyLogo from "@/assets/hny/logo.png";

const navLinks = [
  { to: "/", label: "Hive Clinic" },
  { to: "/treatments", label: "Treatments" },
  { to: "/liquid-bbl-manchester#pricing", label: "Pricing" },
  { to: "/liquid-bbl-manchester#results", label: "Results" },
  { to: "/liquid-bbl-manchester#faq", label: "FAQ" },
];

export const BOOK_URL = "/bookings"; // TODO: swap to external link when provided

const HnyLayout = ({ children }: { children: React.ReactNode }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isExternal = /^https?:/i.test(BOOK_URL);

  const BookBtn = ({ className = "", label = "Book Consultation" }: { className?: string; label?: string }) =>
    isExternal ? (
      <a href={BOOK_URL} target="_blank" rel="noopener noreferrer" className={className} style={{ background: "linear-gradient(135deg, var(--hny-rose-gold), var(--hny-rose-gold-deep))" }}>
        {label}
      </a>
    ) : (
      <Link to={BOOK_URL} className={className} style={{ background: "linear-gradient(135deg, var(--hny-rose-gold), var(--hny-rose-gold-deep))" }}>
        {label}
      </Link>
    );

  return (
    <div className="hny-club min-h-screen flex flex-col" style={{ background: "var(--hny-cream)", color: "var(--hny-ink)" }}>
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b" style={{ background: "rgba(246, 241, 234, 0.94)", borderColor: "var(--hny-champagne)" }}>
        <nav className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link to="/liquid-bbl-manchester" className="flex items-center" aria-label="HNY CLUB by Hive Clinic">
            <img src={hnyLogo} alt="HNY CLUB by Hive Clinic" className="h-10 md:h-12 w-auto" />
          </Link>

          <div className="hidden lg:flex items-center gap-9">
            {navLinks.map((l) => (
              <Link
                key={l.to + l.label}
                to={l.to}
                className="font-body text-[11px] tracking-[0.22em] uppercase transition-colors hover:opacity-60"
                style={{ color: "var(--hny-mocha)" }}
              >
                {l.label}
              </Link>
            ))}
            <BookBtn className="px-6 py-2.5 font-body text-[11px] tracking-[0.22em] uppercase rounded-full text-white transition-opacity hover:opacity-90" />
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden" aria-label="Toggle menu" style={{ color: "var(--hny-mocha)" }}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="lg:hidden border-t overflow-hidden" style={{ borderColor: "var(--hny-champagne)", background: "var(--hny-cream)" }}>
              <div className="px-6 py-5 flex flex-col gap-3">
                {navLinks.map((l) => (
                  <Link key={l.to + l.label} to={l.to} onClick={() => setMobileOpen(false)} className="font-body text-[12px] tracking-[0.22em] uppercase" style={{ color: "var(--hny-mocha)" }}>
                    {l.label}
                  </Link>
                ))}
                <BookBtn className="mt-2 px-6 py-3 rounded-full text-white text-center font-body text-[11px] tracking-[0.22em] uppercase" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1 pt-[68px]">{children}</main>

      <footer className="border-t mt-16" style={{ borderColor: "var(--hny-champagne)", background: "var(--hny-nude)" }}>
        <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <img src={hnyLogo} alt="HNY CLUB by Hive Clinic" className="h-12 w-auto mb-4" />
            <p className="font-body text-sm leading-relaxed" style={{ color: "var(--hny-soft-brown)" }}>
              Non-surgical body contouring at Hive Clinic, Deansgate, Manchester.
            </p>
          </div>
          <div>
            <h4 className="font-display text-base mb-3 tracking-wide" style={{ color: "var(--hny-mocha)" }}>Explore</h4>
            {[
              { to: "/", label: "Hive Clinic Home" },
              { to: "/liquid-bbl-manchester#pricing", label: "Pricing" },
              { to: "/liquid-bbl-manchester#results", label: "Results" },
              { to: "/liquid-bbl-manchester#faq", label: "FAQ" },
              { to: "/contact", label: "Contact" },
            ].map((l) => (
              <Link key={l.to + l.label} to={l.to} className="block font-body text-sm mb-2 hover:opacity-70" style={{ color: "var(--hny-soft-brown)" }}>
                {l.label}
              </Link>
            ))}
          </div>
          <div>
            <h4 className="font-display text-base mb-3 tracking-wide" style={{ color: "var(--hny-mocha)" }}>Visit</h4>
            <p className="font-body text-sm" style={{ color: "var(--hny-soft-brown)" }}>25 Saint John Street</p>
            <p className="font-body text-sm" style={{ color: "var(--hny-soft-brown)" }}>Deansgate, Manchester M3 4DT</p>
            <div className="mt-4 flex gap-3">
              <a href="https://instagram.com/hiveclinicuk" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><img src={instagramLogo} alt="Instagram" className="h-6 w-6 opacity-70 hover:opacity-100" /></a>
              <a href="https://tiktok.com/@hiveclinicuk" target="_blank" rel="noopener noreferrer" aria-label="TikTok"><img src={tiktokLogo} alt="TikTok" className="h-6 w-6 opacity-70 hover:opacity-100 rounded-full" /></a>
            </div>
          </div>
          <div>
            <h4 className="font-display text-base mb-3 tracking-wide" style={{ color: "var(--hny-mocha)" }}>Pay your way</h4>
            <p className="font-body text-xs mb-3" style={{ color: "var(--hny-soft-brown)" }}>Flexible payment plans available, subject to provider approval.</p>
            <div className="flex items-center gap-3">
              <img src={klarnaLogo} alt="Klarna" className="h-5 opacity-80" />
              <img src={clearpayLogo} alt="Clearpay" className="h-5 opacity-80" />
            </div>
          </div>
        </div>
        <div className="border-t" style={{ borderColor: "var(--hny-champagne)" }}>
          <div className="max-w-6xl mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-3">
            <p className="font-body text-[11px]" style={{ color: "var(--hny-soft-brown)" }}>© 2026 HNY CLUB by Hive Clinic.</p>
            <div className="flex flex-wrap gap-4">
              <Link to="/terms" className="font-body text-[11px] hover:opacity-70" style={{ color: "var(--hny-soft-brown)" }}>Terms</Link>
              <Link to="/privacy" className="font-body text-[11px] hover:opacity-70" style={{ color: "var(--hny-soft-brown)" }}>Privacy</Link>
              <Link to="/contact" className="font-body text-[11px] hover:opacity-70" style={{ color: "var(--hny-soft-brown)" }}>Contact</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Sticky mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]" style={{ background: "var(--hny-cream)", borderColor: "var(--hny-champagne)" }}>
        <BookBtn className="block w-full py-3.5 text-center rounded-full text-white font-body text-[12px] tracking-[0.25em] uppercase" />
      </div>
    </div>
  );
};

export default HnyLayout;
