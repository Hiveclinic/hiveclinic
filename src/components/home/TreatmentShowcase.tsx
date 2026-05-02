import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { trackBookNow } from "@/hooks/use-tracking";
import { LUXE } from "@/lib/stock-images";
import catSkinTreatments from "@/assets/categories/cat-skin-treatments.jpg";
import catFatDissolve from "@/assets/categories/cat-fat-dissolve.jpg";
import catFacialBalancing from "@/assets/categories/cat-facial-balancing.jpg";

const FALLBACK: Record<string, string> = {
  "Anti Wrinkle (Botox)": LUXE.tox,
  Lips: LUXE.lips,
  "Facial Balancing": catFacialBalancing,
  "Skin Boosters": LUXE.profhilo,
  "Skin Treatments": catSkinTreatments,
  "Chemical Peels": LUXE.peels,
  "Fat Dissolve": catFatDissolve,
};

const LINKS: Record<string, string> = {
  "Anti Wrinkle (Botox)": "/treatments/anti-wrinkle-injections-manchester",
  Lips: "/treatments/lip-fillers-manchester",
  "Facial Balancing": "/treatments/facial-balancing-manchester",
  "Skin Boosters": "/treatments/skin-boosters-manchester",
  "Skin Treatments": "/treatments/microneedling-manchester",
  "Chemical Peels": "/treatments/chemical-peels-manchester",
  "Fat Dissolve": "/treatments/fat-dissolving-manchester",
};

const ORDER = [
  "Anti Wrinkle (Botox)",
  "Lips",
  "Facial Balancing",
  "Skin Boosters",
  "Skin Treatments",
  "Chemical Peels",
  "Fat Dissolve",
];

type Row = { name: string; category: string; price: number; on_offer: boolean; offer_price: number | null; image_url: string | null };
type Cat = { title: string; from: string; count: number; img: string; link: string };

const TreatmentShowcase = () => {
  const [cats, setCats] = useState<Cat[]>([]);

  useEffect(() => {
    supabase
      .from("treatments")
      .select("name, category, price, on_offer, offer_price, image_url")
      .eq("active", true)
      .then(({ data }) => {
        if (!data) return;
        const map = new Map<string, Row[]>();
        for (const r of data as Row[]) {
          if (!ORDER.includes(r.category)) continue;
          if (!map.has(r.category)) map.set(r.category, []);
          map.get(r.category)!.push(r);
        }
        const built: Cat[] = ORDER.filter((c) => map.has(c)).map((c) => {
          const list = map.get(c)!;
          const lowest = Math.min(
            ...list
              .map((t) => (t.on_offer && t.offer_price ? Number(t.offer_price) : Number(t.price)))
              .filter((n) => n > 0),
          );
          const firstImg = list.find((t) => t.image_url)?.image_url;
          return {
            title: c,
            from: !Number.isFinite(lowest) || lowest === 0 ? "POA" : `£${lowest.toFixed(0)}`,
            count: list.length,
            img: firstImg || FALLBACK[c] || LUXE.lips,
            link: LINKS[c] || `/treatments`,
          };
        });
        setCats(built);
      });
  }, []);

  return (
    <section className="py-24 md:py-32 bg-ink text-bone bg-noise" aria-label="Treatment categories">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
        >
          <div>
            <p className="eyebrow text-rose mb-4">The Menu</p>
            <h2 className="font-display text-4xl md:text-6xl text-bone leading-[1.02]">
              Pick your
              <span className="font-script italic text-rose"> ritual.</span>
            </h2>
          </div>
          <Link
            to="/pricing"
            className="self-start inline-flex items-center gap-2 font-body text-[11px] tracking-[0.28em] uppercase text-bone/60 hover:text-rose border-b border-rose/40 pb-1 transition-colors"
          >
            Full price list <ArrowUpRight size={13} />
          </Link>
        </motion.div>

        <div className="border-t border-bone/10">
          {cats.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.04, duration: 0.5 }}
              className="border-b border-bone/10 group"
            >
              <Link
                to={c.link}
                onClick={() => trackBookNow("home_showcase", c.title)}
                className="grid grid-cols-12 gap-4 md:gap-8 items-center py-7 md:py-10 hover:bg-bone/[0.03] transition-colors"
              >
                <div className="col-span-3 md:col-span-2">
                  <div className="aspect-[4/5] overflow-hidden bg-bone/5">
                    <img
                      src={c.img}
                      alt={`${c.title} treatments`}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1200ms]"
                    />
                  </div>
                </div>
                <div className="col-span-6 md:col-span-7">
                  <div className="flex items-baseline gap-4 flex-wrap">
                    <span className="numeral text-xl md:text-2xl">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display text-2xl md:text-5xl text-bone group-hover:text-rose transition-colors">
                      {c.title}
                    </h3>
                  </div>
                  <p className="font-body text-[11px] tracking-[0.28em] uppercase text-bone/40 mt-3 ml-0 md:ml-9">
                    {c.count} {c.count === 1 ? "treatment" : "treatments"}
                  </p>
                </div>
                <div className="col-span-3 md:col-span-3 text-right">
                  <p className="font-body text-[10px] tracking-[0.28em] uppercase text-bone/40 mb-1">From</p>
                  <div className="flex items-center justify-end gap-3">
                    <span className="font-display text-2xl md:text-4xl text-bone">{c.from}</span>
                    <ArrowUpRight size={18} className="text-bone/30 group-hover:text-rose group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TreatmentShowcase;
