import { useEffect, useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Clock, ShieldCheck, ChevronDown } from "lucide-react";
import Layout from "@/components/Layout";
import { usePageMeta } from "@/hooks/use-page-meta";
import { supabase } from "@/integrations/supabase/client";
import { trackBookNow } from "@/hooks/use-tracking";
import { useBookNow, ACUITY_BOOKING_URL } from "@/hooks/use-book-now";
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
    q: "Do I need a consultation first?",
    a: "Yes — for all injectable treatments a consultation with a qualified prescriber is required. This ensures your safety and allows us to build a tailored treatment plan.",
  },
  {
    q: "Can I pay in instalments?",
    a: "Yes. We offer Klarna and Clearpay on most treatments at checkout. Choose your slot, then select your preferred payment method.",
  },
  {
    q: "What if I need to reschedule?",
    a: "We ask for at least 48 hours notice. Late cancellations or no-shows may forfeit the booking deposit (20% of treatment cost).",
  },
  {
    q: "How early should I arrive?",
    a: "Please arrive at your exact appointment time — not earlier. Our space is small and we treat one client at a time so we can give you our full attention.",
  },
];

export default function BookingSystem() {
  usePageMeta(
    "Book a Treatment | Hive Clinic Manchester",
    "Book your aesthetic treatment at Hive Clinic Manchester. Tap any service to open the live calendar — same names, same prices, no surprises. Klarna & Clearpay available.",
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

  return (
    <Layout>
      {/* Hero */}
      <section className="relative bg-ink text-bone pt-20 md:pt-28 pb-14 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-champagne blur-[180px]" />
        </div>
        <div className="relative max-w-5xl mx-auto px-5 md:px-8 text-center">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="eyebrow text-champagne mb-5"
          >
            Live Booking — Tap & Go
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="font-display text-[clamp(2.2rem,7vw,5rem)] leading-[0.98] mb-5 text-bone"
          >
            Book your treatment.
            <br />
            <span className="display-italic text-champagne">No fuss.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="font-body text-sm md:text-base text-bone/60 max-w-xl mx-auto leading-relaxed mb-7"
          >
            Tap any service below to open the live calendar — straight to the right slot.
            Same names, same prices, paid securely on the day or in 3 with Klarna / Clearpay.
          </motion.p>

          {/* Klarna / Clearpay strip */}
          <div className="flex items-center justify-center gap-5 mb-8">
            <span className="eyebrow text-bone/50">Pay in 3</span>
            <img src={klarnaLogo} alt="Klarna" className="h-5 md:h-6 opacity-90" />
            <img src={clearpayLogo} alt="Clearpay" className="h-5 md:h-6 opacity-90" />
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {[
              { icon: ShieldCheck, label: "Qualified prescriber" },
              { icon: Clock, label: "48hr cancellation" },
              { icon: Sparkles, label: "Synced with calendar" },
            ].map((b) => (
              <div key={b.label} className="flex items-center gap-2">
                <b.icon size={12} strokeWidth={1.5} className="text-champagne" />
                <span className="font-body text-[10px] tracking-[0.3em] uppercase text-bone/55">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category nav */}
      {!loading && (
        <section className="sticky top-[89px] z-30 bg-background/90 backdrop-blur-md border-b border-border">
          <div className="max-w-6xl mx-auto px-4 py-2.5 overflow-x-auto">
            <div className="flex gap-1 min-w-max">
              {grouped.map(([cat]) => (
                <a
                  key={cat}
                  href={`#${slug(cat)}`}
                  className="px-3 py-1.5 font-body text-[10px] tracking-[0.25em] uppercase text-muted-foreground hover:text-foreground border border-transparent hover:border-champagne/30 transition-all whitespace-nowrap"
                >
                  {cat}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Menu */}
      <section className="py-12 md:py-20 bg-background">
        <div className="max-w-5xl mx-auto px-5 md:px-8">
          {loading ? (
            <p className="text-center font-body text-muted-foreground animate-pulse">Loading the menu…</p>
          ) : (
            <div className="space-y-16 md:space-y-24">
              {grouped.map(([cat, items], catIndex) => {
                const lowest = Math.min(
                  ...items
                    .map((i) => (i.on_offer && i.offer_price ? Number(i.offer_price) : Number(i.price)))
                    .filter((n) => n > 0),
                );
                return (
                  <motion.div
                    key={cat}
                    id={slug(cat)}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5 }}
                    className="scroll-mt-32"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-end mb-6 md:mb-10 pb-4 md:pb-6 border-b border-border">
                      <div className="md:col-span-1 hidden md:block">
                        <p className="font-display text-5xl text-champagne/40 italic">
                          {String(catIndex + 1).padStart(2, "0")}
                        </p>
                      </div>
                      <div className="md:col-span-8">
                        <p className="eyebrow text-champagne mb-2">Category</p>
                        <h2 className="font-display text-2xl md:text-4xl leading-tight">{cat}</h2>
                      </div>
                      <div className="md:col-span-3 md:text-right">
                        <p className="eyebrow text-muted-foreground mb-1">From</p>
                        <p className="font-display text-2xl md:text-3xl">{Number.isFinite(lowest) ? fmt(lowest) : "Free"}</p>
                      </div>
                    </div>

                    <ul>
                      {items.map((it) => {
                        const showOffer = it.on_offer && it.offer_price;
                        return (
                          <li
                            key={it.id}
                            className="group grid grid-cols-12 gap-3 md:gap-4 items-baseline py-4 md:py-5 border-b border-border last:border-b-0"
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
        <div className="max-w-5xl mx-auto px-5 md:px-8 py-12 md:py-16">
          <div className="text-center mb-6">
            <p className="eyebrow text-champagne mb-3">Live Calendar</p>
            <h2 className="font-display text-2xl md:text-4xl leading-tight">Pick your moment.</h2>
            <p className="font-body text-sm text-muted-foreground mt-3 max-w-md mx-auto">
              The scheduler below stays right here — use the back arrows inside it to switch service,
              or scroll up to pick a different one from the menu.
            </p>
          </div>
          <div className="bg-background border border-border shadow-lg overflow-hidden" style={{ minHeight: "780px" }}>
            <iframe
              key={embedUrl}
              src={embedUrl}
              title="Hive Clinic booking"
              width="100%"
              height="780"
              frameBorder="0"
              className="w-full block"
            />
          </div>
          <p className="font-body text-[11px] text-muted-foreground text-center mt-4">
            Trouble with the embed?{" "}
            <a
              href={embedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-champagne hover:underline"
            >
              Open the booking page in a new tab
            </a>
            .
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-2xl mx-auto px-5 md:px-8">
          <p className="eyebrow text-champagne text-center mb-3">Before you book</p>
          <h2 className="font-display text-3xl md:text-4xl text-center mb-10">Quick answers.</h2>
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
