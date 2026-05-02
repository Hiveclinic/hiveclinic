import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Clock, ShieldCheck } from "lucide-react";
import Layout from "@/components/Layout";
import { usePageMeta } from "@/hooks/use-page-meta";
import { supabase } from "@/integrations/supabase/client";

// Order categories the same way Acuity presents them
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

const fmt = (n: number) =>
  n === 0 ? "Free" : `£${Number(n).toFixed(0)}`;

export default function Pricing() {
  usePageMeta(
    "Treatment Prices | Hive Clinic Manchester",
    "Full transparent price list for every aesthetic treatment at Hive Clinic Manchester. Anti-wrinkle, lip filler, skin boosters, peels, facial balancing and more.",
  );

  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <Layout>
      {/* Hero */}
      <section className="relative bg-summer-gradient pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-sun-soft pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-body text-[11px] tracking-[0.4em] uppercase text-gold mb-5"
          >
            Transparent Pricing — Synced With Booking
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="font-display text-5xl md:text-7xl leading-[1.05] mb-6"
          >
            Every treatment.<br />
            <span className="italic text-gold">Every price.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="font-body text-base text-muted-foreground max-w-xl mx-auto leading-relaxed mb-10"
          >
            The exact menu you see at checkout — service names, durations and
            prices pulled live from our booking system. No hidden fees, no
            surprises.
          </motion.p>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {[
              { icon: ShieldCheck, label: "Synced with the live scheduler" },
              { icon: Clock, label: "Updated nightly" },
              { icon: Sparkles, label: "Qualified prescriber" },
            ].map((b) => (
              <div key={b.label} className="flex items-center gap-2">
                <b.icon size={13} strokeWidth={1.5} className="text-gold" />
                <span className="font-body text-[11px] tracking-widest uppercase text-muted-foreground">
                  {b.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category nav */}
      {!loading && (
        <section className="sticky top-[64px] z-30 bg-background/85 backdrop-blur-md border-b border-border">
          <div className="max-w-6xl mx-auto px-6 py-3 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {grouped.map(([cat]) => (
                <a
                  key={cat}
                  href={`#${slug(cat)}`}
                  className="px-4 py-2 font-body text-[11px] tracking-widest uppercase text-muted-foreground hover:text-foreground border border-transparent hover:border-gold/30 transition-all"
                >
                  {cat}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Price tables */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          {loading ? (
            <p className="text-center font-body text-muted-foreground animate-pulse">
              Loading prices…
            </p>
          ) : (
            <div className="space-y-24">
              {grouped.map(([cat, items], catIndex) => {
                const lowest = Math.min(
                  ...items.map((i) =>
                    i.on_offer && i.offer_price ? Number(i.offer_price) : Number(i.price),
                  ).filter((n) => n > 0),
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
                    {/* Category header — editorial */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end mb-10 pb-6 border-b border-sand">
                      <div className="md:col-span-1 hidden md:block">
                        <p className="font-display text-5xl text-gold/40 italic">
                          {String(catIndex + 1).padStart(2, "0")}
                        </p>
                      </div>
                      <div className="md:col-span-8">
                        <p className="font-body text-[10px] tracking-[0.4em] uppercase text-gold mb-2">
                          Category
                        </p>
                        <h2 className="font-display text-4xl md:text-5xl leading-tight">
                          {cat}
                        </h2>
                      </div>
                      <div className="md:col-span-3 md:text-right">
                        <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground mb-1">
                          From
                        </p>
                        <p className="font-display text-3xl">
                          {Number.isFinite(lowest) ? fmt(lowest) : "Free"}
                        </p>
                      </div>
                    </div>

                    {/* Items */}
                    <ul>
                      {items.map((it) => {
                        const showOffer = it.on_offer && it.offer_price;
                        return (
                          <li
                            key={it.id}
                            className="group grid grid-cols-12 gap-4 items-baseline py-5 border-b border-border last:border-b-0"
                          >
                            <div className="col-span-12 sm:col-span-7">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-display text-xl md:text-2xl leading-tight">
                                  {it.name}
                                </h3>
                                {it.offer_label && (
                                  <span className="inline-flex font-body text-[9px] tracking-widest uppercase text-gold border border-gold/40 px-2 py-0.5">
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

                            {/* leader dots on md+ */}
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
                                  <span className="font-display text-2xl text-gold">
                                    {fmt(Number(it.offer_price))}
                                  </span>
                                </div>
                              ) : (
                                <span className="font-display text-2xl">
                                  {fmt(Number(it.price))}
                                </span>
                              )}
                            </div>
                            <div className="col-span-5 sm:col-span-1 sm:text-right">
                              <Link
                                to={`/bookings${it.acuity_appointment_type_id ? `?type=${it.acuity_appointment_type_id}` : ""}`}
                                className="inline-flex items-center gap-1 font-body text-[10px] tracking-widest uppercase text-foreground/70 hover:text-gold transition-colors"
                              >
                                Book <ArrowRight size={10} />
                              </Link>
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

      {/* Footer CTA */}
      <section className="py-24 bg-cream-warm border-t border-sand">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="font-body text-[10px] tracking-[0.4em] uppercase text-gold mb-4">
            Not sure where to start?
          </p>
          <h3 className="font-display text-4xl md:text-5xl mb-6 leading-tight">
            Book a free consultation. <span className="italic text-gold">We'll build your plan.</span>
          </h3>
          <p className="font-body text-sm text-muted-foreground mb-8">
            Every treatment requires a qualified-practitioner consultation where applicable.
          </p>
          <Link
            to="/bookings"
            className="inline-flex items-center gap-2 px-10 py-4 bg-foreground text-background font-body text-xs tracking-widest uppercase hover:bg-accent transition-colors"
          >
            Book Now <ArrowRight size={13} />
          </Link>
        </div>
      </section>
    </Layout>
  );
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
