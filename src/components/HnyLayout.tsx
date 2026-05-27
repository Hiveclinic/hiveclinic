import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import instagramLogo from "@/assets/instagram-logo.png";
import tiktokLogo from "@/assets/tiktok-logo.png";
import klarnaLogo from "@/assets/klarna-logo.png";
import clearpayLogo from "@/assets/clearpay-logo.png";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/treatments", label: "Treatments" },
  { to: "/treatments?cat=skin", label: "Skin" },
  { to: "/treatments?cat=injectables", label: "Injectables" },
  { to: "/liquid-bbl-manchester", label: "HNY CLUB" },
];

const HnyLayout = ({ children }: { children: React.ReactNode }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="hny-club min-h-screen flex flex-col" style={{ background: "var(--hny-cream)", color: "var(--hny-ink)" }}>
      {/* Slim refined nav */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b" style={{ background: "rgba(251, 246, 241, 0.92)", borderColor: "var(--hny-champagne)" }}>
        <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/liquid-bbl-manchester" className="flex flex-col leading-none">
            <span className="font-display tracking-[0.35em] text-[15px]" style={{ color: "var(--hny-ink)" }}>HNY CLUB</span>
            <span className="font-body italic text-[10px] tracking-[0.2em] mt-0.5" style={{ color: "var(--hny-soft-brown)" }}>by Hive Clinic</span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((l) => (
              <Link
                key={l.to + l.label}
                to={l.to}
                className="font-body text-[11px] tracking-[0.25em] uppercase transition-colors hover:opacity-60"
                style={{ color: l.label === "HNY CLUB" ? "var(--hny-rose-gold)" : "var(--hny-ink)" }}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/bookings"
              className="px-6 py-2.5 font-body text-[11px] tracking-[0.25em] uppercase rounded-full text-white transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(135deg, var(--hny-rose-gold), var(--hny-rose-gold-deep))" }}
            >
              Book Consultation
            </Link>
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden" aria-label="Toggle menu" style={{ color: "var(--hny-ink)" }}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="lg:hidden border-t overflow-hidden" style={{ borderColor: "var(--hny-champagne)", background: "var(--hny-cream)" }}>
              <div className="px-6 py-5 flex flex-col gap-3">
                {navLinks.map((l) => (
                  <Link key={l.to + l.label} to={l.to} onClick={() => setMobileOpen(false)} className="font-body text-[12px] tracking-[0.25em] uppercase" style={{ color: l.label === "HNY CLUB" ? "var(--hny-rose-gold)" : "var(--hny-ink)" }}>
                    {l.label}
                  </Link>
                ))}
                <Link to="/bookings" onClick={() => setMobileOpen(false)} className="mt-2 px-6 py-3 rounded-full text-white text-center font-body text-[11px] tracking-[0.25em] uppercase" style={{ background: "linear-gradient(135deg, var(--hny-rose-gold), var(--hny-rose-gold-deep))" }}>
                  Book Consultation
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1 pt-[72px]">{children}</main>

      {/* Refined footer matching HNY palette but linking to full Hive Clinic site */}
      <footer className="border-t mt-16" style={{ borderColor: "var(--hny-champagne)", background: "var(--hny-blush)" }}>
        <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="font-display tracking-[0.35em] text-base" style={{ color: "var(--hny-ink)" }}>HNY CLUB</div>
            <div className="font-body italic text-[11px] tracking-[0.2em] mt-1 mb-4" style={{ color: "var(--hny-soft-brown)" }}>by Hive Clinic</div>
            <p className="font-body text-sm leading-relaxed" style={{ color: "var(--hny-soft-brown)" }}>
              Ultrasound-led body contouring. Deansgate, Manchester City Centre.
            </p>
          </div>
          <div>
            <h4 className="font-display text-base mb-3" style={{ color: "var(--hny-ink)" }}>Explore</h4>
            {[
              { to: "/", label: "Hive Clinic Home" },
              { to: "/liquid-bbl-manchester", label: "HNY CLUB" },
              { to: "/treatments", label: "All Treatments" },
              { to: "/aftercare", label: "Aftercare" },
              { to: "/contact", label: "Contact" },
            ].map((l) => (
              <Link key={l.to + l.label} to={l.to} className="block font-body text-sm mb-2 hover:opacity-70" style={{ color: "var(--hny-soft-brown)" }}>
                {l.label}
              </Link>
            ))}
          </div>
          <div>
            <h4 className="font-display text-base mb-3" style={{ color: "var(--hny-ink)" }}>Visit</h4>
            <p className="font-body text-sm" style={{ color: "var(--hny-soft-brown)" }}>Deansgate</p>
            <p className="font-body text-sm" style={{ color: "var(--hny-soft-brown)" }}>Manchester City Centre</p>
            <div className="mt-4 flex gap-3">
              <a href="https://instagram.com/hiveclinicuk" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><img src={instagramLogo} alt="Instagram" className="h-6 w-6 opacity-70 hover:opacity-100" /></a>
              <a href="https://tiktok.com/@hiveclinicuk" target="_blank" rel="noopener noreferrer" aria-label="TikTok"><img src={tiktokLogo} alt="TikTok" className="h-6 w-6 opacity-70 hover:opacity-100 rounded-full" /></a>
            </div>
          </div>
          <div>
            <h4 className="font-display text-base mb-3" style={{ color: "var(--hny-ink)" }}>Pay your way</h4>
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
        <Link to="/bookings" className="block w-full py-3.5 text-center rounded-full text-white font-body text-[12px] tracking-[0.25em] uppercase" style={{ background: "linear-gradient(135deg, var(--hny-rose-gold), var(--hny-rose-gold-deep))" }}>
          Book Consultation · £100
        </Link>
      </div>
    </div>
  );
};

export default HnyLayout;
