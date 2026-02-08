import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";

const menu = [
  {
    category: "Skin Rituals",
    items: [
      { name: "Signature Facial", price: "from £85" },
      { name: "Chemical Peel", price: "from £95" },
      { name: "HydraFacial", price: "from £120" },
      { name: "LED Light Therapy", price: "from £50" },
    ],
  },
  {
    category: "Enhancements",
    items: [
      { name: "Lip Filler (0.5ml)", price: "from £150" },
      { name: "Lip Filler (1ml)", price: "from £220" },
      { name: "Cheek Filler", price: "from £250" },
      { name: "Jawline Filler", price: "from £280" },
      { name: "Anti-Wrinkle Treatment", price: "from £180" },
      { name: "Chin Filler", price: "from £220" },
    ],
  },
  {
    category: "Skin Boosters",
    items: [
      { name: "Profhilo", price: "from £280" },
      { name: "Skinvive", price: "from £250" },
      { name: "Polynucleotides", price: "from £300" },
    ],
  },
  {
    category: "Vitamin Boosts",
    items: [
      { name: "Vitamin B12 Shot", price: "from £30" },
      { name: "Glow Drip", price: "from £150" },
      { name: "Immunity Drip", price: "from £150" },
      { name: "Energy Drip", price: "from £150" },
    ],
  },
  {
    category: "Corrective Care",
    items: [
      { name: "Microneedling", price: "from £180" },
      { name: "PRP Facial", price: "from £250" },
      { name: "Scar Revision (per session)", price: "from £200" },
    ],
  },
];

const Pricing = () => (
  <Layout>
    <section className="py-24">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-20">
          <h1 className="font-display text-5xl md:text-6xl mb-4">Treatment Menu</h1>
          <p className="font-body text-muted-foreground">
            All prices are starting prices. Final pricing confirmed during consultation.
          </p>
        </motion.div>

        <div className="space-y-16">
          {menu.map((section) => (
            <div key={section.category}>
              <h2 className="font-display text-3xl mb-6 pb-3 border-b border-gold/30">{section.category}</h2>
              <div className="space-y-0">
                {section.items.map((item) => (
                  <div key={item.name} className="flex justify-between items-baseline py-4 border-b border-border">
                    <span className="font-body text-foreground">{item.name}</span>
                    <span className="font-body text-sm text-gold ml-4 whitespace-nowrap">{item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link
            to="/bookings"
            className="inline-flex items-center gap-2 px-10 py-4 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-accent transition-colors"
          >
            Book Your Consultation
          </Link>
          <p className="font-body text-xs text-muted-foreground mt-4">
            Klarna & Clearpay available for eligible treatments.
          </p>
        </div>
      </div>
    </section>
  </Layout>
);

export default Pricing;
