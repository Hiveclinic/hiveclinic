import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import klarnaLogo from "@/assets/klarna-logo.png";
import clearpayLogo from "@/assets/clearpay-logo.png";

const menu = [
  {
    category: "Chemical Peels",
    items: [
      { name: "Level 1 Chemical Peel - Face", price: "£85" },
      { name: "Level 1 Chemical Peel - Back", price: "£95" },
      { name: "Level 2 Chemical Peel - Face", price: "£110" },
      { name: "Level 2 Chemical Peel - Back", price: "£125" },
    ],
    courses: [
      { name: "Level 1 Face Course of 3", price: "£230" },
      { name: "Level 1 Back Course of 3", price: "£260" },
      { name: "Level 2 Face Course of 3", price: "£300" },
      { name: "Level 2 Back Course of 3", price: "£330" },
    ],
  },
  {
    category: "Intimate and Body Peels",
    items: [
      { name: "Intimate Peel Small Area", price: "£75" },
      { name: "Intimate Peel Medium Area", price: "£95" },
      { name: "Intimate Peel Large Area", price: "£120" },
    ],
    courses: [
      { name: "Small Area Course of 3", price: "£210" },
      { name: "Medium Area Course of 3", price: "£265" },
      { name: "Large Area Course of 3", price: "£330" },
    ],
    extras: [
      { name: "Hands Melanostop Body", price: "£120" },
      { name: "Underarms Melanostop Body", price: "£150" },
      { name: "Elbows and Knees Melanostop Body", price: "£130" },
    ],
  },
  {
    category: "Microneedling",
    items: [
      { name: "Face Texture Repair - Scars, pores and glow (Microneedling with chemical peel)", price: "£130" },
      { name: "Stretch Mark Repair (Salmon DNA and hydration)", price: "£150" },
    ],
  },
  {
    category: "HydraFacial",
    items: [
      { name: "Glass Skin Boost", price: "£140" },
      { name: "Acne Refresh", price: "£130" },
      { name: "Glow Reset", price: "£120" },
    ],
  },
  {
    category: "Fat Dissolve",
    items: [
      { name: "Small Area - Chin, Bra Fat, Jawline, Upper Arms, Lower Abdomen", price: "£120" },
      { name: "Medium Area - Full Lower Abdomen, Upper Abdomen, Waist, Flanks, Upper Arms", price: "£180" },
      { name: "Large Area - Full Abdomen, Back Rolls, Hips, Thighs", price: "£250" },
    ],
  },
  {
    category: "Skin Boosters",
    items: [
      { name: "Lumi Eyes", price: "£140" },
      { name: "Seventy Hyal", price: "£160" },
      { name: "Polynucleotides", price: "£180" },
      { name: "Profhilo", price: "£250" },
    ],
  },
  {
    category: "Dermal Filler",
    items: [
      { name: "Lip Filler 0.5ml", price: "£80" },
      { name: "Lip Filler 0.8ml", price: "£120" },
      { name: "Lip Filler 1ml", price: "£150" },
      { name: "Smile Lines", price: "£150" },
      { name: "Marionette Lines", price: "£150" },
      { name: "Chin Filler", price: "£160" },
      { name: "Cheek Filler per ml", price: "£160" },
      { name: "Jawline Filler per ml", price: "£170" },
      { name: "Nose Filler", price: "£200" },
      { name: "Tear Trough Filler", price: "£200" },
    ],
  },
  {
    category: "Facial Balancing Packages",
    items: [
      { name: "3ml Facial Balancing", price: "£350" },
      { name: "5ml Facial Balancing", price: "£500" },
      { name: "7ml Facial Balancing", price: "£650" },
    ],
  },
  {
    category: "Anti-Wrinkle",
    items: [
      { name: "Anti Wrinkle Injections - 2 Areas", price: "£179" },
      { name: "Anti Wrinkle Injections - 3 Areas", price: "£220" },
      { name: "Anti Wrinkle Injections - 6 Areas", price: "£360" },
      { name: "Masseter Jaw Slimming", price: "£240" },
      { name: "Bunny Lines", price: "£120" },
      { name: "Lip Flip", price: "£120" },
      { name: "Gummy Smile Correction", price: "£120" },
      { name: "Chin Dimpling", price: "£120" },
      { name: "DAO", price: "£120" },
      { name: "Brow Lift", price: "£150" },
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
              {section.courses && (
                <div className="mt-6">
                  <h3 className="font-display text-xl mb-3 text-muted-foreground">Courses</h3>
                  {section.courses.map((item) => (
                    <div key={item.name} className="flex justify-between items-baseline py-3 border-b border-border">
                      <span className="font-body text-foreground text-sm">{item.name}</span>
                      <span className="font-body text-sm text-gold ml-4 whitespace-nowrap">{item.price}</span>
                    </div>
                  ))}
                </div>
              )}
              {section.extras && (
                <div className="mt-6">
                  {section.extras.map((item) => (
                    <div key={item.name} className="flex justify-between items-baseline py-3 border-b border-border">
                      <span className="font-body text-foreground text-sm">{item.name}</span>
                      <span className="font-body text-sm text-gold ml-4 whitespace-nowrap">{item.price}</span>
                    </div>
                  ))}
                </div>
              )}
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

export default Pricing;
