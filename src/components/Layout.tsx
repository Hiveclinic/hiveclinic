import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.png";
import WhatsAppButton from "./WhatsAppButton";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/treatments", label: "Treatments" },
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "About" },
  { to: "/results", label: "Results" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
  { to: "/bookings", label: "Book Now" },
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex-shrink-0">
            <img src={logo} alt="Hive Clinic" className="h-14 mix-blend-multiply dark:invert" style={{ background: 'transparent' }} />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) =>
              link.label === "Book Now" ? (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-6 py-2.5 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-accent transition-colors"
                >
                  {link.label}
                </Link>
              ) : (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`font-body text-sm tracking-widest uppercase transition-colors hover:text-gold ${
                    location.pathname === link.to ? "text-gold" : "text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-foreground"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-background border-t border-border overflow-hidden"
            >
              <div className="px-6 py-6 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`font-body text-sm tracking-widest uppercase ${
                      link.label === "Book Now"
                        ? "bg-foreground text-background px-6 py-3 text-center"
                        : location.pathname === link.to
                        ? "text-gold"
                        : "text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main */}
      <main className="flex-1 pt-[73px]">{children}</main>

      {/* Footer */}
      <footer className="bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <img src={logo} alt="Hive Clinic" className="h-12 invert mb-4" />
              <p className="font-body text-sm text-background/60 leading-relaxed">
                A new standard in injectables. Manchester City Centre, Deansgate.
              </p>
            </div>
            <div>
              <h4 className="font-display text-lg mb-4">Quick Links</h4>
              {navLinks.slice(0, 4).map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block font-body text-sm text-background/60 hover:text-background mb-2"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div>
              <h4 className="font-display text-lg mb-4">Services</h4>
              {["Skin Rituals", "Enhancements", "Skin Boosters", "Vitamin Boosts", "Corrective Care"].map((s) => (
                <p key={s} className="font-body text-sm text-background/60 mb-2">{s}</p>
              ))}
            </div>
            <div>
              <h4 className="font-display text-lg mb-4">Opening Hours</h4>
              <div className="font-body text-sm text-background/60 space-y-1">
                <p>Mon - Fri: 10am - 7pm</p>
                <p>Sat: 10am - 5pm</p>
                <p>Sun: Closed</p>
              </div>
              <div className="mt-4 flex gap-4">
                <a href="https://instagram.com/hiveclinicuk" target="_blank" rel="noopener noreferrer" className="text-background/60 hover:text-background text-sm">Instagram</a>
                <a href="https://tiktok.com/@hiveclinicuk" target="_blank" rel="noopener noreferrer" className="text-background/60 hover:text-background text-sm">TikTok</a>
              </div>
            </div>
          </div>
          <div className="border-t border-background/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-body text-xs text-background/40">
              © 2026 Hive Clinic. All rights reserved.
            </p>
            <p className="font-body text-xs text-background/40">
              Manchester City Centre, Deansgate
            </p>
          </div>
        </div>
      </footer>

      <WhatsAppButton />
    </div>
  );
};

export default Layout;
