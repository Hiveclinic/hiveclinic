import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Filter, ArrowUpDown } from "lucide-react";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { usePageMeta } from "@/hooks/use-page-meta";

type Offer = {
  id: string;
  name: string;
  slug: string;
  price: number;
  offer_price: number | null;
  offer_label: string | null;
  description: string | null;
  duration_mins: number;
  category: string;
};

type SortOption = "default" | "price-low" | "price-high" | "savings";

const SORT_LABELS: Record<SortOption, string> = {
  default: "Featured",
  "price-low": "Price: Low to High",
  "price-high": "Price: High to Low",
  savings: "Biggest Savings",
};

const Offers = () => {
  usePageMeta(
    "Current Offers | Hive Clinic Manchester",
    "Browse all current offers and limited-time deals on aesthetic treatments at Hive Clinic, Manchester City Centre."
  );

  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("treatments")
      .select("id, name, slug, price, offer_price, offer_label, description, duration_mins, category")
      .eq("active", true)
      .eq("on_offer", true)
      .order("sort_order")
      .then(({ data }) => {
        if (data) setOffers(data as Offer[]);
        setLoading(false);
      });
  }, []);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(offers.map((o) => o.category)));
    return ["All", ...cats.sort()];
  }, [offers]);

  const filtered = useMemo(() => {
    let items = selectedCategory === "All" ? [...offers] : offers.filter((o) => o.category === selectedCategory);

    const getDisplayPrice = (o: Offer) => (o.offer_price != null && o.offer_price > 0 ? o.offer_price : o.price);
    const getSavings = (o: Offer) => (o.offer_price != null && o.offer_price > 0 ? o.price - o.offer_price : 0);

    switch (sortBy) {
      case "price-low":
        items.sort((a, b) => getDisplayPrice(a) - getDisplayPrice(b));
        break;
      case "price-high":
        items.sort((a, b) => getDisplayPrice(b) - getDisplayPrice(a));
        break;
      case "savings":
        items.sort((a, b) => getSavings(b) - getSavings(a));
        break;
    }

    return items;
  }, [offers, selectedCategory, sortBy]);

  return (
    <Layout>
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles size={20} className="text-gold" />
              <h1 className="font-display text-4xl md:text-5xl">Current Offers</h1>
            </div>
            <p className="font-body text-muted-foreground max-w-lg mx-auto">
              Limited-time savings on our most popular treatments. Don't miss out.
            </p>
          </motion.div>

          {/* Filters & Sort */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12"
          >
            {/* Category Filter */}
            {categories.length > 2 && (
              <div className="flex flex-wrap items-center gap-3">
                <Filter size={14} className="text-muted-foreground" />
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 font-body text-xs tracking-widest uppercase border transition-colors ${
                      selectedCategory === cat
                        ? "border-gold bg-gold/10 text-gold"
                        : "border-border text-muted-foreground hover:border-gold/50 hover:text-foreground"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* Sort */}
            <div className="flex items-center gap-2">
              <ArrowUpDown size={14} className="text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-2 font-body text-xs tracking-widest uppercase border border-border bg-background text-foreground cursor-pointer hover:border-gold/50 transition-colors"
              >
                {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
                  <option key={key} value={key}>{SORT_LABELS[key]}</option>
                ))}
              </select>
            </div>
          </motion.div>

          {loading ? (
            <div className="text-center py-20">
              <p className="font-body text-muted-foreground">Loading offers...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-body text-muted-foreground">No offers available right now. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((offer, i) => (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="border border-gold/30 bg-background p-6 h-full flex flex-col group hover:border-gold transition-colors">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      {offer.offer_label && (
                        <span className="px-3 py-1 bg-gold/10 text-gold font-body text-xs tracking-wider uppercase">
                          {offer.offer_label}
                        </span>
                      )}
                      <span className="px-3 py-1 bg-secondary font-body text-xs tracking-wider uppercase text-muted-foreground ml-auto">
                        {offer.category}
                      </span>
                    </div>
                    <h2 className="font-display text-xl mb-2 group-hover:text-gold transition-colors">{offer.name}</h2>
                    {offer.description && (
                      <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                        {offer.description}
                      </p>
                    )}
                    <div className="mt-auto">
                      <div className="flex items-baseline gap-3 mb-4">
                        {offer.offer_price != null && offer.offer_price > 0 ? (
                          <>
                            <span className="font-body text-sm line-through text-muted-foreground">
                              £{Number(offer.price).toFixed(0)}
                            </span>
                            <span className="font-display text-2xl text-gold">
                              £{Number(offer.offer_price).toFixed(0)}
                            </span>
                            <span className="font-body text-xs text-green-600 font-medium">
                              Save £{(Number(offer.price) - Number(offer.offer_price)).toFixed(0)}
                            </span>
                          </>
                        ) : (
                          <span className="font-display text-2xl text-gold">£{Number(offer.price).toFixed(0)}</span>
                        )}
                        <span className="font-body text-xs text-muted-foreground">· {offer.duration_mins} mins</span>
                      </div>
                      <Link
                        to={`/bookings?treatment=${offer.slug}`}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background font-body text-xs tracking-widest uppercase hover:bg-accent transition-colors w-full justify-center"
                      >
                        Book Now <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Offers;
