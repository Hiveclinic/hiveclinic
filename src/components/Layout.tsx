import { Link, useLocation, useNavigate } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Search as SearchIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.png";
import WhatsAppButton from "./WhatsAppButton";
import VIPPopup from "./VIPPopup";
import TreatmentChatbot from "./TreatmentChatbot";

import instagramLogo from "@/assets/instagram-logo.png";
import tiktokLogo from "@/assets/tiktok-logo.png";
import { supabase } from "@/integrations/supabase/client";

const navLinks = [{
  to: "/",
  label: "Home"
}, {
  to: "/treatments",
  label: "Treatments"
}, {
  to: "/content-models",
  label: "Content Models"
}, {
  to: "/about",
  label: "About"
}, {
  to: "/aftercare",
  label: "Aftercare"
}, {
  to: "/blog",
  label: "Blog"
}, {
  to: "/contact",
  label: "Contact"
}, {
  to: "/bookings",
  label: "Book Now"
}];

type SearchResult = {
  type: "treatment" | "page";
  name: string;
  link: string;
};

const STATIC_PAGES: SearchResult[] = [
  { type: "page", name: "Home", link: "/" },
  { type: "page", name: "Treatments", link: "/treatments" },
  { type: "page", name: "Pricing", link: "/pricing" },
  { type: "page", name: "About Us", link: "/about" },
  { type: "page", name: "Results & Gallery", link: "/results" },
  { type: "page", name: "Aftercare", link: "/aftercare" },
  { type: "page", name: "Blog", link: "/blog" },
  { type: "page", name: "Contact", link: "/contact" },
  { type: "page", name: "Book Now", link: "/bookings" },
  { type: "page", name: "My Appointments", link: "/my-appointments" },
  { type: "page", name: "Privacy Policy", link: "/privacy" },
  { type: "page", name: "Terms & Conditions", link: "/terms" },
];

const Layout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [treatments, setTreatments] = useState<{ name: string; slug: string; category: string }[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.from("treatments").select("name, slug, category").eq("active", true).order("name").then(({ data }) => {
      if (data) setTreatments(data);
    });
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    const treatmentResults: SearchResult[] = treatments
      .filter(t => t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q))
      .slice(0, 6)
      .map(t => ({ type: "treatment", name: t.name, link: "/bookings" }));
    const pageResults = STATIC_PAGES.filter(p => p.name.toLowerCase().includes(q));
    setSearchResults([...treatmentResults, ...pageResults].slice(0, 8));
  }, [searchQuery, treatments]);

  const handleSearchSelect = (result: SearchResult) => {
    setSearchOpen(false);
    setSearchQuery("");
    navigate(result.link);
  };

  return <div className="min-h-screen flex flex-col bg-background text-foreground">
      <AnnouncementBanner />
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex-shrink-0">
            <img alt="Hive Clinic" className="h-20 md:h-24" src="/lovable-uploads/287bf846-68c9-4ce8-89d0-2589ecb9e5a7.png" style={{ background: 'transparent', mixBlendMode: 'multiply' }} />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => link.label === "Book Now" ? <Link key={link.to} to={link.to} className="px-6 py-2.5 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-accent transition-colors">
                  {link.label}
                </Link> : <Link key={link.to} to={link.to} className={`font-body text-sm tracking-widest uppercase transition-colors hover:text-gold ${location.pathname === link.to ? "text-gold" : "text-foreground"}`}>
                  {link.label}
                </Link>)}
            <button onClick={() => setSearchOpen(true)} className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Search">
              <SearchIcon size={16} strokeWidth={1.5} />
            </button>
          </div>

          {/* Mobile toggle */}
          <div className="flex items-center gap-3 lg:hidden">
            <button onClick={() => setSearchOpen(true)} className="text-muted-foreground hover:text-foreground" aria-label="Search">
              <SearchIcon size={18} strokeWidth={1.5} />
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="text-foreground" aria-label="Toggle menu">
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && <motion.div initial={{
          opacity: 0,
          height: 0
        }} animate={{
          opacity: 1,
          height: "auto"
        }} exit={{
          opacity: 0,
          height: 0
        }} className="lg:hidden bg-background border-t border-border overflow-hidden">
              <div className="px-6 py-6 flex flex-col gap-4">
                {navLinks.map(link => <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)} className={`font-body text-sm tracking-widest uppercase ${link.label === "Book Now" ? "bg-foreground text-background px-6 py-3 text-center" : location.pathname === link.to ? "text-gold" : "text-foreground"}`}>
                    {link.label}
                  </Link>)}
              </div>
            </motion.div>}
        </AnimatePresence>
      </header>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-foreground/60 backdrop-blur-sm flex items-start justify-center pt-24"
            onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-background border border-border w-full max-w-xl mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center border-b border-border px-5">
                <SearchIcon size={16} strokeWidth={1.5} className="text-muted-foreground" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search treatments, pages..."
                  className="flex-1 bg-transparent px-3 py-4 font-body text-sm focus:outline-none"
                  onKeyDown={e => {
                    if (e.key === "Escape") { setSearchOpen(false); setSearchQuery(""); }
                    if (e.key === "Enter" && searchResults.length > 0) handleSearchSelect(searchResults[0]);
                  }}
                />
                <button onClick={() => { setSearchOpen(false); setSearchQuery(""); }} className="text-muted-foreground hover:text-foreground">
                  <X size={16} strokeWidth={1.5} />
                </button>
              </div>
              {searchResults.length > 0 && (
                <div className="max-h-80 overflow-y-auto">
                  {searchResults.map((r, i) => (
                    <button
                      key={`${r.type}-${r.name}-${i}`}
                      onClick={() => handleSearchSelect(r)}
                      className="w-full text-left px-5 py-3 hover:bg-secondary transition-colors flex items-center gap-3 border-b border-border/50 last:border-0"
                    >
                      <span className="font-body text-[10px] uppercase tracking-wider text-muted-foreground w-16">{r.type}</span>
                      <span className="font-body text-sm">{r.name}</span>
                    </button>
                  ))}
                </div>
              )}
              {searchQuery && searchResults.length === 0 && (
                <div className="p-8 text-center">
                  <p className="font-body text-sm text-muted-foreground">No results found for "{searchQuery}"</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main */}
      <main className="flex-1 pt-[89px]">{children}</main>

      {/* Footer */}
      <footer className="bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <img alt="Hive Clinic" className="h-14 invert mb-4 brightness-0 invert" src="/lovable-uploads/af7c9fcb-cbc7-403e-b2bb-d4d8bb0a804c.png" />
              <p className="font-body text-sm text-background/60 leading-relaxed">
                A new standard in injectables. Manchester City Centre, Deansgate.
              </p>
            </div>
            <div>
              <h4 className="font-display text-lg mb-4">Quick Links</h4>
              {navLinks.slice(0, 4).map(link => <Link key={link.to} to={link.to} className="block font-body text-sm text-background/60 hover:text-background mb-2">
                  {link.label}
                </Link>)}
              <Link to="/aftercare" className="block font-body text-sm text-background/60 hover:text-background mb-2">
                Aftercare
              </Link>
              <Link to="/results" className="block font-body text-sm text-background/60 hover:text-background mb-2">
                Results
              </Link>
            </div>
            <div>
              <h4 className="font-display text-lg mb-4">Treatments</h4>
              {[
                { name: "Lip Filler", to: "/lip-filler-manchester" },
                { name: "Dermal Filler", to: "/treatments/dermal-filler-manchester" },
                { name: "Anti-Wrinkle Consultation", to: "/treatments/anti-wrinkle-injections-manchester" },
                { name: "HydraFacial", to: "/treatments/hydrafacial-manchester" },
                { name: "Chemical Peels", to: "/treatments/chemical-peels-manchester" },
                { name: "Skin Boosters", to: "/treatments/skin-boosters-manchester" },
                { name: "Microneedling", to: "/treatments/microneedling-manchester" },
                { name: "Acne Treatment", to: "/acne-treatment-manchester" },
                { name: "Hyperpigmentation", to: "/hyperpigmentation-treatment-manchester" },
                { name: "Fat Dissolve", to: "/treatments/fat-dissolving-manchester" },
                { name: "Mesotherapy", to: "/treatments/mesotherapy-manchester" },
                { name: "All Treatments", to: "/treatments" },
              ].map(s => (
                <Link key={s.to} to={s.to} className="block font-body text-sm text-background/60 hover:text-background mb-2">{s.name}</Link>
              ))}
              <p className="font-body text-xs text-background/40 mt-3 italic">A consultation with a qualified prescriber is required prior to treatment where applicable.</p>
            </div>
            <div>
              <h4 className="font-display text-lg mb-4">Opening Hours</h4>
              <div className="font-body text-sm text-background/60 space-y-1">
                <p>Mon: 10:00 - 17:00</p>
                <p>Tue: 10:00 - 17:00</p>
                <p>Wed: Closed</p>
                <p>Thu: 11:00 - 18:30</p>
                <p>Fri: 10:00 - 17:00</p>
                <p>Sat: 10:00 - 15:00</p>
                <p>Sun: Closed</p>
              </div>
              <p className="font-body text-xs text-background/40 mt-3">Bank holiday hours may vary.</p>
              <p className="font-body text-xs text-background/40 mt-1">Appointments are required. Limited same-week availability may be released.</p>
              <div className="mt-4 flex gap-4 items-center">
                <a href="https://instagram.com/hiveclinicuk" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <img src={instagramLogo} alt="Instagram" className="h-7 w-7 opacity-80 hover:opacity-100 transition-opacity" />
                </a>
                <a href="https://tiktok.com/@hiveclinicuk" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                  <img src={tiktokLogo} alt="TikTok" className="h-7 w-7 rounded-full object-cover opacity-80 hover:opacity-100 transition-opacity" style={{ clipPath: 'circle(50%)' }} />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-background/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-body text-xs text-background/40">
              © 2026 Hive Clinic. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              <p className="font-body text-xs text-background/40">
                Manchester City Centre, Deansgate
              </p>
              <Link to="/terms" className="font-body text-xs text-background/40 hover:text-background/60 transition-colors">
                Terms & Conditions
              </Link>
              <Link to="/privacy" className="font-body text-xs text-background/40 hover:text-background/60 transition-colors">
                Privacy
              </Link>
              <Link to="/terms#cancellation" className="font-body text-xs text-background/40 hover:text-background/60 transition-colors">
                Cancellation Policy
              </Link>
              <Link to="/auth" className="font-body text-xs text-background/20 hover:text-background/40 transition-colors">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Sticky Mobile Booking Button */}
      {!["/bookings", "/admin", "/auth", "/my-appointments"].some(p => location.pathname.startsWith(p)) && (
        <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-background border-t border-border p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <Link
            to="/bookings"
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-foreground text-background font-body text-sm tracking-widest uppercase"
          >
            <CalendarDays size={16} />
            Book Appointment
          </Link>
        </div>
      )}

      <VIPPopup />
      <TreatmentChatbot />
    </div>;
};
export default Layout;
