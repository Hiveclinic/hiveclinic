import { useEffect, useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Clock, ShieldCheck, ChevronDown, Maximize2, ExternalLink, RefreshCw, X } from "lucide-react";
import Layout from "@/components/Layout";
import { usePageMeta } from "@/hooks/use-page-meta";
import { supabase } from "@/integrations/supabase/client";
import { trackBookNow } from "@/hooks/use-tracking";
import { useBookNow, ACUITY_BOOKING_URL, buildAcuityBookingUrl } from "@/hooks/use-book-now";
import klarnaLogo from "@/assets/klarna-logo.png";
import clearpayLogo from "@/assets/clearpay-logo.png";

const CATEGORY_ORDER = [
  "Offers",
  "Anti Wrinkle (Botox)",
  "Lips",
  "Facial Balancing",
  "Skin Boosters",
  "Skin Treatments",
  "Chemical Peels",
  "Fat Dissolve",
  "Consultation",
  "Correction",
  "Content Model",
];

type Row = {
  id: string;
  name: string;
  category: string;
  price: number;
  on_offer: boolean;
  offer_price: number | null;
  offer_label: string | null;
  duration_mins: number;
  acuity_appointment_type_id: string | null;
  sort_order: number;
};

const fmt = (n: number) => (n === 0 ? "Free" : `£${Number(n).toFixed(0)}`);

const faqs = [
  {
    q: "Do I need a consultation before treatment?",
    a: "Yes — every injectable treatment includes a face-to-face consultation with a qualified prescriber, either before the appointment or as the first part of it. We'll review your medical history, discuss your goals and confirm the treatment is right for you.",
  },
  {
    q: "Can I pay with Klarna or Clearpay?",
    a: "Yes. Both are available at checkout on the booking confirmation step. You'll be able to split your treatment into 3 interest-free payments. Klarna and Clearpay handle their own credit checks; approval isn't guaranteed.",
  },
  {
    q: "How much is the booking deposit?",
    a: "A 20% non-refundable deposit secures your appointment, deducted from your final balance on the day. The rest can be paid by card, cash, bank transfer or Klarna / Clearpay.",
  },
  {
    q: "What's your cancellation policy?",
    a: "We need at least 48 hours notice to reschedule or cancel. Inside 48 hours the deposit is forfeited; no-shows are charged for the full appointment. The earlier you let us know, the easier it is for someone on the waiting list.",
  },
  {
    q: "When should I arrive?",
    a: "Please arrive at your exact appointment time, not earlier. The studio is intimate and we treat one client at a time so you get our full attention.",
  },
  {
    q: "Where are you based?",
    a: "Hive Clinic, 25 Saint John Street, Manchester M3 4DT — two minutes from Deansgate. Paid street parking and several NCP car parks are within a five-minute walk.",
  },
];

export default function BookingSystem() {
  usePageMeta(
    "Book Aesthetic Treatments Manchester | Hive Clinic",
    "Book lip filler, anti-wrinkle, skin boosters and more at Hive Clinic Manchester. Live calendar, transparent prices, Klarna and Clearpay accepted. 25 Saint John Street, M3 4DT.",
    {
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://www.hiveclinicuk.com/" },
          { "@type": "ListItem", position: 2, name: "Book", item: "https://www.hiveclinicuk.com/bookings" },
        ],
      },
    },
  );

  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [embedUrl, setEmbedUrl] = useState<string>(ACUITY_BOOKING_URL);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [expanded, setExpanded] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [iframeNonce, setIframeNonce] = useState(0);
  const embedRef = useRef<HTMLDivElement>(null);
  const book = useBookNow();

  useEffect(() => {
    supabase
      .from("treatments")
      .select(
        "id, name, category, price, on_offer, offer_price, offer_label, duration_mins, acuity_appointment_type_id, sort_order",
      )
      .eq("active", true)
      .order("sort_order")
      .then(({ data }) => {
        if (data) setRows(data as Row[]);
        setLoading(false);
      });
  }, []);

  // Pick up an inbound deep-link (set by useBookNow before navigation)
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("hive:bookUrl");
      if (stored) {
        setEmbedUrl(stored);
        sessionStorage.removeItem("hive:bookUrl");
        setTimeout(() => {
          document.getElementById("book")?.scrollIntoView({ behavior: "smooth" });
        }, 250);
      }
    } catch {}

    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.url) setEmbedUrl(detail.url);
    };
    window.addEventListener("hive:book", handler);
    return () => window.removeEventListener("hive:book", handler);
  }, []);

  // Reset iframe loading state on URL change or manual retry
  useEffect(() => {
    setIframeLoading(true);
  }, [embedUrl, iframeNonce]);

  const grouped = useMemo(() => {
    const map = new Map<string, Row[]>();
    for (const r of rows) {
      if (!map.has(r.category)) map.set(r.category, []);
      map.get(r.category)!.push(r);
    }
    const ordered: Array<[string, Row[]]> = [];
    for (const c of CATEGORY_ORDER) if (map.has(c)) ordered.push([c, map.get(c)!]);
    for (const [c, list] of map) if (!CATEGORY_ORDER.includes(c)) ordered.push([c, list]);
    return ordered;
  }, [rows]);

  const handleBook = (cat: string, item: Row) => {
    trackBookNow("bookings_row", cat, item.name);
    book({ category: item.category, appointmentTypeId: item.acuity_appointment_type_id ?? undefined });
  };

  const handleCategoryBook = (cat: string) => {
    trackBookNow("bookings_category_nav", cat);
    book(cat);
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative bg-ink text-bone pt-16 md:pt-24 pb-12 md:pb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-champagne blur-[180px]" />
        </div>
        <div className="relative max-w-4xl mx-auto px-5 md:px-8 text-center">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="eyebrow text-champagne mb-4"
          >
            Live Booking
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="font-display text-[clamp(2rem,6.5vw,4.5rem)] leading-[0.98] mb-4 text-bone"
          >
            Book a treatment
            <br />
            <span className="display-italic text-champagne">in seconds.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="font-body text-[15px] md:text-base text-bone/65 max-w-lg mx-auto leading-[1.7] mb-6"
          >
            Pick a treatment from the menu — the live calendar opens to that exact service. Pay a 20% deposit to confirm, the balance comes due on the day.
          </motion.p>

          {/* Klarna / Clearpay strip */}
          <div className="flex items-center justify-center gap-4 mb-7">
            <span className="eyebrow text-bone/45">Pay in 3</span>
            <img src={klarnaLogo} alt="Klarna" className="h-5 md:h-6" />
            <img src={clearpayLogo} alt="Clearpay" className="h-5 md:h-6" />
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {[
              { icon: ShieldCheck, label: "Qualified prescriber" },
              { icon: Clock, label: "48hr cancellation" },
              { icon: Sparkles, label: "Manchester · M3 4DT" },
            ].map((b) => (
              <div key={b.label} className="flex items-center gap-2">
                <b.icon size={12} strokeWidth={1.5} className="text-champagne" />
                <span className="font-body text-[10px] tracking-[0.3em] uppercase text-bone/55">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category nav — taps deep-link the iframe AND scroll to it */}
      {!loading && (
        <section className="sticky top-[89px] z-30 bg-background/92 backdrop-blur-md border-b border-border">
          <div className="max-w-6xl mx-auto px-4 py-2.5 overflow-x-auto">
            <div className="flex gap-1 min-w-max items-center">
              <span className="eyebrow text-muted-foreground pr-2">Jump to</span>
              {grouped.map(([cat]) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryBook(cat)}
                  className="px-3 py-1.5 font-body text-[10px] tracking-[0.25em] uppercase text-muted-foreground hover:text-foreground border border-transparent hover:border-champagne/40 transition-all whitespace-nowrap"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Menu */}
      <section className="py-10 md:py-16 bg-background">
        <div className="max-w-5xl mx-auto px-5 md:px-8">
          {loading ? (
            <p className="text-center font-body text-muted-foreground animate-pulse">Loading menu…</p>
          ) : (
            <div className="space-y-14 md:space-y-20">
              {grouped.map(([cat, items], catIndex) => {
                const lowest = Math.min(
                  ...items
                    .map((i) => (i.on_offer && i.offer_price ? Number(i.offer_price) : Number(i.price)))
                    .filter((n) => n > 0),
                );
                return (
                  <motion.div
                    key={cat}
                    id={`cat-${slug(cat)}`}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5 }}
                    className="scroll-mt-32"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6 items-end mb-5 md:mb-8 pb-3 md:pb-5 border-b border-border">
                      <div className="md:col-span-1 hidden md:block">
                        <p className="font-display text-5xl text-champagne/40 italic">
                          {String(catIndex + 1).padStart(2, "0")}
                        </p>
                      </div>
                      <div className="md:col-span-7">
                        <p className="eyebrow text-champagne mb-2">Category</p>
                        <h2 className="font-display text-2xl md:text-4xl leading-tight">{cat}</h2>
                      </div>
                      <div className="md:col-span-2 md:text-right">
                        <p className="eyebrow text-muted-foreground mb-1">From</p>
                        <p className="font-display text-2xl md:text-3xl">
                          {Number.isFinite(lowest) ? fmt(lowest) : "Free"}
                        </p>
                      </div>
                      <div className="md:col-span-2 md:text-right">
                        <button
                          type="button"
                          onClick={() => handleCategoryBook(cat)}
                          className="inline-flex items-center gap-1.5 font-body text-[10px] tracking-[0.25em] uppercase text-foreground hover:text-champagne border-b border-champagne/40 hover:border-champagne pb-0.5 transition-colors"
                        >
                          Open in calendar <ArrowRight size={11} />
                        </button>
                      </div>
                    </div>

                    <ul>
                      {items.map((it) => {
                        const showOffer = it.on_offer && it.offer_price;
                        return (
                          <li
                            key={it.id}
                            className="group grid grid-cols-12 gap-3 md:gap-4 items-baseline py-4 border-b border-border last:border-b-0"
                          >
                            <div className="col-span-12 sm:col-span-7">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-display text-lg md:text-xl leading-tight">{it.name}</h3>
                                {it.offer_label && (
                                  <span className="inline-flex font-body text-[9px] tracking-widest uppercase text-champagne border border-champagne/40 px-2 py-0.5">
                                    {it.offer_label}
                                  </span>
                                )}
                              </div>
                              {it.duration_mins > 0 && (
                                <p className="font-body text-[11px] text-muted-foreground tracking-wider mt-1">
                                  {it.duration_mins} min
                                </p>
                              )}
                            </div>

                            <div
                              className="hidden sm:block col-span-2 border-b border-dotted border-border/80 mb-3"
                              aria-hidden
                            />

                            <div className="col-span-7 sm:col-span-2 sm:text-right">
                              {showOffer ? (
                                <div>
                                  <span className="font-body text-xs text-muted-foreground line-through mr-2">
                                    £{Number(it.price).toFixed(0)}
                                  </span>
                                  <span className="font-display text-xl md:text-2xl text-champagne">
                                    {fmt(Number(it.offer_price))}
                                  </span>
                                </div>
                              ) : (
                                <span className="font-display text-xl md:text-2xl">{fmt(Number(it.price))}</span>
                              )}
                            </div>
                            <div className="col-span-5 sm:col-span-1 sm:text-right">
                              <button
                                type="button"
                                onClick={() => handleBook(cat, it)}
                                className="inline-flex items-center gap-1 font-body text-[10px] tracking-[0.25em] uppercase text-foreground/80 hover:text-champagne transition-colors"
                              >
                                Book <ArrowRight size={10} />
                              </button>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Embedded Acuity scheduler */}
      <section id="book" className="bg-bone-deep/40 border-y border-border" ref={embedRef}>
        <div className={`mx-auto px-5 md:px-8 py-10 md:py-14 ${expanded ? "max-w-7xl" : "max-w-5xl"}`}>
          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <p className="eyebrow text-champagne mb-2">Live Calendar</p>
              <h2 className="font-display text-2xl md:text-3xl leading-tight">Pick your time.</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIframeNonce((n) => n + 1)}
                className="inline-flex items-center gap-1.5 px-3 py-2 border border-border hover:border-champagne text-foreground/70 hover:text-foreground font-body text-[10px] tracking-[0.25em] uppercase transition-colors"
                aria-label="Reload calendar"
              >
                <RefreshCw size={12} strokeWidth={1.5} className={iframeLoading ? "animate-spin" : ""} />
                Reload
              </button>
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 border border-border hover:border-champagne text-foreground/70 hover:text-foreground font-body text-[10px] tracking-[0.25em] uppercase transition-colors"
                aria-label={expanded ? "Collapse calendar" : "Expand calendar"}
              >
                <Maximize2 size={12} strokeWidth={1.5} />
                {expanded ? "Collapse" : "Expand"}
              </button>
              <a
                href={embedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 border border-border hover:border-champagne text-foreground/70 hover:text-foreground font-body text-[10px] tracking-[0.25em] uppercase transition-colors"
              >
                <ExternalLink size={12} strokeWidth={1.5} />
                New tab
              </a>
            </div>
          </div>
          <div
            className="relative bg-background border border-border shadow-lg overflow-hidden"
            style={{ minHeight: expanded ? "920px" : "780px" }}
          >
            {iframeLoading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5 bg-background/95 backdrop-blur-sm px-6">
                {/* Skeleton mimic of Acuity calendar */}
                <div className="w-full max-w-md space-y-4 animate-pulse">
                  <div className="h-5 w-2/3 bg-muted rounded mx-auto" />
                  <div className="h-3 w-1/2 bg-muted/70 rounded mx-auto" />
                  <div className="grid grid-cols-7 gap-2 pt-4">
                    {Array.from({ length: 21 }).map((_, i) => (
                      <div key={i} className="h-9 bg-muted/60 rounded" />
                    ))}
                  </div>
                  <div className="flex gap-2 pt-3">
                    <div className="h-10 flex-1 bg-muted/70 rounded" />
                    <div className="h-10 flex-1 bg-muted/70 rounded" />
                    <div className="h-10 flex-1 bg-muted/70 rounded" />
                  </div>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <p className="font-body text-[11px] tracking-[0.3em] uppercase text-muted-foreground">
                    Loading live calendar…
                  </p>
                  <button
                    type="button"
                    onClick={() => setIframeNonce((n) => n + 1)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 border border-champagne/50 hover:border-champagne text-champagne font-body text-[10px] tracking-[0.25em] uppercase transition-colors"
                  >
                    <RefreshCw size={12} strokeWidth={1.5} />
                    Taking a while? Retry
                  </button>
                </div>
              </div>
            )}
            <iframe
              key={`${embedUrl}-${iframeNonce}`}
              src={embedUrl}
              title="Hive Clinic booking calendar"
              width="100%"
              height={expanded ? 920 : 780}
              frameBorder="0"
              className="w-full block"
              onLoad={() => setIframeLoading(false)}
            />
          </div>
          <p className="font-body text-[11px] text-muted-foreground mt-3">
            Tip: tap a treatment from the menu above to jump straight to its calendar.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 md:py-20 bg-background">
        <div className="max-w-2xl mx-auto px-5 md:px-8">
          <p className="eyebrow text-champagne text-center mb-3">Before you book</p>
          <h2 className="font-display text-3xl md:text-4xl text-center mb-8">Good to know.</h2>
          <div className="divide-y divide-border border-y border-border">
            {faqs.map((f, i) => (
              <button
                key={f.q}
                type="button"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left py-5 flex items-start justify-between gap-4 group"
                aria-expanded={openFaq === i}
              >
                <div className="flex-1">
                  <h3 className="font-display text-lg md:text-xl group-hover:text-champagne transition-colors">{f.q}</h3>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.p
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="font-body text-sm text-muted-foreground leading-relaxed overflow-hidden"
                      >
                        {f.a}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
                <ChevronDown
                  size={18}
                  strokeWidth={1.5}
                  className={`text-champagne mt-1 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                />
              </button>
            ))}
          </div>
          <p className="font-body text-xs text-muted-foreground italic text-center mt-8">
            A consultation with a qualified prescriber is required prior to treatment where applicable.
          </p>
        </div>
      </section>
    </Layout>
  );
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
