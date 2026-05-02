import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { ChevronDown, ArrowDown, Flame, Camera, ArrowRight, Search, Clock, ExternalLink, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import { usePageMeta } from "@/hooks/use-page-meta";
import { ACUITY_BOOKING_URL } from "@/hooks/use-book-now";
import { supabase } from "@/integrations/supabase/client";

const faqs = [
  { q: "Do I need a consultation first?", a: "Yes - for all injectable treatments, an initial consultation is required. This ensures your safety and allows us to create a personalised treatment plan." },
  { q: "Is there any downtime?", a: "It depends on the treatment. Most facial treatments have minimal downtime. Injectables may involve slight swelling for 24-48 hours. We will discuss this during your consultation." },
  { q: "How do I prepare for my appointment?", a: "Avoid alcohol 24 hours before, arrive with a clean face if possible, and let us know about any medications or allergies." },
  { q: "Can I pay in instalments?", a: "Yes. We offer flexible payment plans for eligible treatments via Klarna and Clearpay." },
  { q: "What if I need to reschedule?", a: "We ask for at least 48 hours notice for cancellations or rescheduling. Late cancellations may incur a fee." },
  { q: "What is the deposit policy?", a: "A deposit may be required to secure your appointment depending on the treatment. The remaining balance is paid on the day." },
];

const steps = [
  { number: "01", title: "Choose", description: "Browse the treatment menu." },
  { number: "02", title: "Review", description: "See details, duration and price." },
  { number: "03", title: "Schedule", description: "Pick your slot on Acuity." },
  { number: "04", title: "Confirm", description: "Secure checkout, instant booking." },
];

interface Treatment {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  duration_mins: number;
  on_offer: boolean;
  offer_price: number | null;
  offer_label: string | null;
  description: string | null;
  acuity_appointment_type_id: string | null;
  sort_order: number | null;
}

// Map our clean category labels back to the exact Acuity category path segment.
// Acuity URLs require the "✦ " prefix as it appears in the source scheduler.
const ACUITY_CATEGORY_MAP: Record<string, string> = {
  "Anti Wrinkle (Botox)": "✦ ANTI WRINKLE (BOTOX)",
  "Chemical Peels": "✦ CHEMCIAL PEELS",
  "Consultation": "✦ CONSULTATION",
  "Correction": "✦ CORRECTION",
  "Facial Balancing": "✦ FACIAL BALANCING",
  "Fat Dissolve": "✦ FAT DISSOLVE",
  "Lips": "✦ LIPS",
  "Skin Boosters": "✦ SKIN BOOSTERS",
  "Skin Treatments": "✦ SKIN TREATMENTS",
};

// Single shared calendar (Bianca Spencer) on the live Acuity scheduler.
const ACUITY_CALENDAR_ID = "13962538";
const ACUITY_SCHEDULE_BASE = "https://hiveclinicuk.as.me/schedule/9c3d2206";

const buildAcuityUrl = (t: Treatment) => {
  const acuityCat = ACUITY_CATEGORY_MAP[t.category];
  if (t.acuity_appointment_type_id && acuityCat) {
    return `${ACUITY_SCHEDULE_BASE}/category/${encodeURIComponent(acuityCat)}/appointment/${t.acuity_appointment_type_id}/calendar/${ACUITY_CALENDAR_ID}`;
  }
  if (acuityCat) {
    return `${ACUITY_SCHEDULE_BASE}/category/${encodeURIComponent(acuityCat)}`;
  }
  return ACUITY_BOOKING_URL;
};

const BookingSystem = () => {
  usePageMeta(
    "Book Your Treatment | Hive Clinic Manchester",
    "Book your aesthetic treatment at Hive Clinic, Manchester City Centre. Live availability via Acuity for lip fillers, skin treatments, anti-wrinkle and more."
  );
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [details, setDetails] = useState<Treatment | null>(null);
  const [scheduling, setScheduling] = useState<Treatment | null>(null);

  const { data: treatments = [], isLoading } = useQuery({
    queryKey: ["bookings-treatments-v2"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("treatments")
        .select("id, name, slug, category, price, duration_mins, on_offer, offer_price, offer_label, description, acuity_appointment_type_id, sort_order")
        .eq("active", true)
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Treatment[];
    },
  });

  const categories = useMemo(() => {
    const set = new Set<string>();
    treatments.forEach(t => set.add(t.category));
    return ["All", ...Array.from(set).sort()];
  }, [treatments]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return treatments.filter(t => {
      if (activeCategory !== "All" && t.category !== activeCategory) return false;
      if (q && !t.name.toLowerCase().includes(q) && !t.category.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [treatments, activeCategory, search]);

  const scrollToPicker = () => {
    document.getElementById("picker")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-foreground text-background">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="font-body text-[10px] tracking-[0.4em] uppercase text-background/50 mb-8">Manchester City Centre</p>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl mb-6 leading-[0.95] tracking-tight">
              Book Your<br />
              <span className="italic font-light">Treatment</span>
            </h1>
            <p className="font-body text-sm md:text-base text-background/60 max-w-md mx-auto mb-10 leading-relaxed">
              Browse the menu, review your treatment, then book instantly on our secure scheduler.
            </p>
          </motion.div>

          <motion.button
            onClick={scrollToPicker}
            className="mx-auto flex flex-col items-center gap-2 text-background/40 hover:text-background/80 transition-colors"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          >
            <span className="font-body text-[10px] tracking-[0.3em] uppercase">Browse Treatments</span>
            <ArrowDown size={16} />
          </motion.button>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {steps.map((step, i) => (
              <div
                key={step.number}
                className={`p-6 md:p-8 ${i < 3 ? "md:border-r border-border" : ""} ${i < 2 ? "border-b md:border-b-0 border-border" : ""} ${i === 0 || i === 2 ? "border-r md:border-r border-border" : ""}`}
              >
                <span className="font-display text-2xl text-accent/40 block mb-2">{step.number}</span>
                <h3 className="font-display text-base mb-1">{step.title}</h3>
                <p className="font-body text-[11px] text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlight banners */}
      <section className="py-14 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={scrollToPicker}
            className="group text-left bg-secondary/40 hover:bg-secondary transition-all duration-300 p-8 border border-border hover:border-accent/40"
          >
            <div className="flex items-center gap-2 mb-3">
              <Flame size={14} className="text-accent" />
              <span className="font-body text-[10px] tracking-[0.25em] uppercase text-accent font-semibold">Limited Offers</span>
            </div>
            <h3 className="font-display text-2xl md:text-3xl mb-2 group-hover:text-accent transition-colors">This month's specials</h3>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
              Signature treatments at limited promotional pricing.
            </p>
            <span className="inline-flex items-center gap-2 font-body text-[11px] tracking-[0.2em] uppercase text-foreground group-hover:text-accent transition-colors">
              Browse Treatments <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </button>

          <Link
            to="/content-models"
            className="group text-left bg-foreground text-background hover:bg-accent transition-all duration-300 p-8 border border-foreground"
          >
            <div className="flex items-center gap-2 mb-3">
              <Camera size={14} className="text-gold" />
              <span className="font-body text-[10px] tracking-[0.25em] uppercase text-gold font-semibold">Content Model Programme</span>
            </div>
            <h3 className="font-display text-2xl md:text-3xl mb-2">Reduced rates for content</h3>
            <p className="font-body text-sm text-background/60 leading-relaxed mb-4">
              Treatments at reduced prices in exchange for before and after content for our portfolio.
            </p>
            <span className="inline-flex items-center gap-2 font-body text-[11px] tracking-[0.2em] uppercase text-gold">
              View Programme <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </section>

      {/* Treatment Picker */}
      <section id="picker" className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-accent mb-3">Choose Your Treatment</p>
            <h2 className="font-display text-3xl md:text-5xl mb-4">The Menu</h2>
            <p className="font-body text-sm text-muted-foreground max-w-xl mx-auto">
              Tap any treatment to review details. Booking opens in our secure scheduler.
            </p>
          </div>

          {/* Search */}
          <div className="max-w-md mx-auto mb-8 relative">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search treatments..."
              className="w-full bg-background border border-border pl-11 pr-4 py-3 font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          {/* Category chips */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 font-body text-[10px] tracking-[0.2em] uppercase border transition-all ${
                  activeCategory === cat
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background text-muted-foreground border-border hover:border-accent hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Cards grid */}
          {isLoading ? (
            <div className="text-center py-20 font-body text-xs tracking-[0.3em] uppercase text-muted-foreground">
              Loading treatments...
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 font-body text-sm text-muted-foreground">
              No treatments match your search.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(t => {
                const displayPrice = t.on_offer && t.offer_price ? t.offer_price : t.price;
                return (
                  <button
                    key={t.id}
                    onClick={() => setDetails(t)}
                    className="group text-left bg-background p-6 border border-border hover:border-accent/60 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-[9px] tracking-[0.25em] uppercase text-accent mb-2">{t.category}</p>
                        <h3 className="font-display text-xl leading-tight group-hover:text-accent transition-colors">
                          {t.name}
                        </h3>
                      </div>
                      {t.on_offer && (
                        <span className="flex-shrink-0 bg-accent text-accent-foreground text-[9px] tracking-[0.15em] uppercase px-2 py-1 font-medium">
                          {t.offer_label || "Offer"}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                      <span className="inline-flex items-center gap-1.5 font-body text-[11px] text-muted-foreground">
                        <Clock size={11} /> {t.duration_mins} min
                      </span>
                      {t.on_offer && t.offer_price ? (
                        <div className="flex items-baseline gap-2">
                          <span className="font-body text-xs line-through text-muted-foreground">£{Number(t.price).toFixed(0)}</span>
                          <span className="font-display text-2xl text-accent">£{Number(displayPrice).toFixed(0)}</span>
                        </div>
                      ) : (
                        <span className="font-display text-2xl">£{Number(displayPrice).toFixed(0)}</span>
                      )}
                    </div>

                    <div className="mt-4 inline-flex items-center gap-2 font-body text-[10px] tracking-[0.2em] uppercase text-foreground group-hover:text-accent transition-colors">
                      View Details
                      <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Details Modal */}
      <AnimatePresence>
        {details && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDetails(null)}
            className="fixed inset-0 z-[100] bg-foreground/70 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-6"
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-background w-full md:max-w-lg md:mx-auto max-h-[90vh] overflow-y-auto border-t md:border border-border shadow-2xl"
            >
              <button
                onClick={() => setDetails(null)}
                aria-label="Close"
                className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-colors z-10"
              >
                <X size={18} />
              </button>

              <div className="p-7 md:p-9">
                <p className="font-body text-[10px] tracking-[0.3em] uppercase text-accent mb-3">{details.category}</p>
                <h3 className="font-display text-3xl md:text-4xl leading-tight mb-5">{details.name}</h3>

                <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-border">
                  {details.on_offer && details.offer_price ? (
                    <>
                      <span className="font-display text-4xl text-accent">£{Number(details.offer_price).toFixed(0)}</span>
                      <span className="font-body text-base line-through text-muted-foreground">£{Number(details.price).toFixed(0)}</span>
                      {details.offer_label && (
                        <span className="ml-auto bg-accent text-accent-foreground text-[9px] tracking-[0.15em] uppercase px-2 py-1 font-medium">
                          {details.offer_label}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="font-display text-4xl">£{Number(details.price).toFixed(0)}</span>
                  )}
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Clock size={14} />
                    <span className="font-body text-sm">{details.duration_mins} minute appointment</span>
                  </div>
                  {details.description && (
                    <p className="font-body text-sm text-muted-foreground leading-relaxed pt-2">
                      {details.description}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => {
                    setScheduling(details);
                    setDetails(null);
                  }}
                  className="group flex items-center justify-center gap-2 w-full bg-foreground text-background py-4 font-body text-xs tracking-[0.25em] uppercase hover:bg-accent transition-colors"
                >
                  Schedule Appointment
                  <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
                <p className="text-center font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mt-4">
                  Live availability · Secure scheduler
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Embedded Acuity Scheduler */}
      <AnimatePresence>
        {scheduling && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setScheduling(null)}
            className="fixed inset-0 z-[110] bg-foreground/80 backdrop-blur-sm flex items-stretch md:items-center justify-center md:p-6"
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-cream w-full md:max-w-3xl md:mx-auto h-full md:h-[90vh] flex flex-col border-t md:border border-border shadow-2xl"
            >
              {/* Branded header */}
              <div className="flex items-center justify-between px-5 md:px-7 py-4 border-b border-border bg-background/60 backdrop-blur-md">
                <div className="min-w-0">
                  <p className="font-body text-[9px] tracking-[0.3em] uppercase text-accent mb-1 truncate">{scheduling.category}</p>
                  <h3 className="font-display text-lg md:text-xl leading-tight truncate">{scheduling.name}</h3>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <a
                    href={buildAcuityUrl(scheduling)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open scheduler in new tab"
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ExternalLink size={16} />
                  </a>
                  <button
                    onClick={() => setScheduling(null)}
                    aria-label="Close scheduler"
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Embedded scheduler */}
              <iframe
                src={buildAcuityUrl(scheduling)}
                title={`Book ${scheduling.name}`}
                className="flex-1 w-full bg-cream"
                frameBorder={0}
                loading="lazy"
                allow="payment"
              />

              <p className="px-5 py-3 text-center font-body text-[9px] tracking-[0.25em] uppercase text-muted-foreground border-t border-border bg-background/60">
                Secure booking · Powered by Acuity
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAQ */}
      <section className="py-24 bg-background border-t border-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <p className="font-body text-[10px] tracking-[0.3em] uppercase text-accent mb-4">Support</p>
              <h2 className="font-display text-3xl md:text-4xl mb-4">Common Questions</h2>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                Everything you need to know before your appointment.
              </p>
            </div>
            <div className="md:col-span-8">
              {faqs.map((faq, i) => (
                <div key={i} className="border-b border-border/60">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between py-5 text-left group"
                  >
                    <span className="font-body text-sm font-medium group-hover:text-accent transition-colors">{faq.q}</span>
                    <ChevronDown
                      size={16}
                      className={`flex-shrink-0 ml-4 text-muted-foreground transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`}
                    />
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="font-body text-sm text-muted-foreground leading-relaxed pb-5">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Booking Policy footer strip */}
      <section className="py-10 border-t border-border">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="font-body text-[11px] text-muted-foreground leading-relaxed">
            48 hours notice required to reschedule. No-shows may forfeit any deposit. Treatments are non-refundable; results vary. Cash or card accepted.
          </p>
          <Link to="/terms" className="font-body text-[10px] text-accent tracking-wider uppercase underline mt-3 inline-block hover:text-foreground transition-colors">
            View full booking policies
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default BookingSystem;
