import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import klarnaLogo from "@/assets/klarna-logo.png";
import clearpayLogo from "@/assets/clearpay-logo.png";
import { usePageMeta } from "@/hooks/use-page-meta";
import { supabase } from "@/integrations/supabase/client";

type Treatment = {
  id: string;
  name: string;
  category: string;
  price: number;
  active: boolean;
  sort_order: number | null;
  on_offer: boolean;
  offer_price: number | null;
};

type Variant = {
  id: string;
  treatment_id: string;
  name: string;
  price: number;
  active: boolean;
};

type Package = {
  id: string;
  treatment_id: string;
  name: string;
  sessions_count: number;
  total_price: number;
  active: boolean;
};

type MenuSection = {
  category: string;
  items: { name: string; price: string }[];
  courses?: { name: string; price: string }[];
};

const Pricing = () => {
  usePageMeta(
    "Treatment Prices | Hive Clinic Manchester",
    "View all treatment prices at Hive Clinic Manchester. Chemical peels, dermal filler, lip filler, HydraFacial, skin boosters and more."
  );

  const [menu, setMenu] = useState<MenuSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      const [tRes, vRes, pRes] = await Promise.all([
        supabase.from("treatments").select("id, name, category, price, active, sort_order, on_offer, offer_price").eq("active", true).order("sort_order"),
        supabase.from("treatment_variants").select("id, treatment_id, name, price, active").eq("active", true).order("sort_order"),
        supabase.from("treatment_packages").select("id, treatment_id, name, sessions_count, total_price, active").eq("active", true).order("sort_order"),
      ]);

      const treatments = (tRes.data || []) as Treatment[];
      const variants = (vRes.data || []) as Variant[];
      const packages = (pRes.data || []) as Package[];

      // Group by category, maintaining sort order
      const categoryOrder: string[] = [];
      const categoryMap = new Map<string, Treatment[]>();

      for (const t of treatments) {
        if (!categoryMap.has(t.category)) {
          categoryOrder.push(t.category);
          categoryMap.set(t.category, []);
        }
        categoryMap.get(t.category)!.push(t);
      }

      const sections: MenuSection[] = categoryOrder.map(category => {
        const catTreatments = categoryMap.get(category) || [];
        const items: { name: string; price: string }[] = [];
        const courses: { name: string; price: string }[] = [];

        for (const t of catTreatments) {
          const tVariants = variants.filter(v => v.treatment_id === t.id);
          const tPackages = packages.filter(p => p.treatment_id === t.id);

          if (tVariants.length > 0) {
            // Show variants as individual items
            for (const v of tVariants) {
              items.push({
                name: `${t.name} - ${v.name}`,
                price: `£${Number(v.price).toFixed(0)}`,
              });
            }
          } else {
            // Show the base treatment
            const displayPrice = t.on_offer && t.offer_price ? t.offer_price : t.price;
            items.push({
              name: t.name,
              price: `£${Number(displayPrice).toFixed(0)}`,
            });
          }

          // Add packages as courses
          for (const p of tPackages) {
            courses.push({
              name: p.name,
              price: `£${Number(p.total_price).toFixed(0)}`,
            });
          }
        }

        const section: MenuSection = { category, items };
        if (courses.length > 0) section.courses = courses;
        return section;
      });

      setMenu(sections);
      setLoading(false);
    };

    fetchMenu();
  }, []);

  return (
    <Layout>
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-20">
            <h1 className="font-display text-5xl md:text-6xl mb-4">Treatment Menu</h1>
            <p className="font-body text-muted-foreground">
              All prices are starting prices. Final pricing confirmed during consultation.
            </p>
          </motion.div>

          {loading ? (
            <div className="py-12 text-center">
              <p className="font-body text-muted-foreground animate-pulse">Loading prices...</p>
            </div>
          ) : (
            <div className="space-y-16">
              {menu.map((section) => (
                <div key={section.category}>
                  <h2 className="font-display text-3xl mb-6 pb-3 border-b border-gold/30">{section.category}</h2>
                  <div className="space-y-0">
                    {section.items.map((item, i) => (
                      <div key={`${item.name}-${i}`} className="flex justify-between items-baseline py-4 border-b border-border">
                        <span className="font-body text-foreground">{item.name}</span>
                        <span className="font-body text-sm text-gold ml-4 whitespace-nowrap">{item.price}</span>
                      </div>
                    ))}
                  </div>
                  {section.courses && (
                    <div className="mt-6">
                      <h3 className="font-display text-xl mb-3 text-muted-foreground">Courses</h3>
                      {section.courses.map((item, i) => (
                        <div key={`${item.name}-${i}`} className="flex justify-between items-baseline py-3 border-b border-border">
                          <span className="font-body text-foreground text-sm">{item.name}</span>
                          <span className="font-body text-sm text-gold ml-4 whitespace-nowrap">{item.price}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-16">
            <Link
              to="/bookings?category=Consultations"
              className="inline-flex items-center gap-2 px-10 py-4 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-accent transition-colors"
            >
              Book Your Consultation
            </Link>
            <div className="flex items-center justify-center gap-6 mt-6">
              <img src={klarnaLogo} alt="Klarna" className="h-8" />
              <img src={clearpayLogo} alt="Clearpay" className="h-8" />
            </div>
            <p className="font-body text-xs text-muted-foreground mt-3">
              Available for eligible treatments.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Pricing;
