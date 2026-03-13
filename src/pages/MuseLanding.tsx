import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Camera, Check } from "lucide-react";
import Layout from "@/components/Layout";
import gallery4 from "@/assets/gallery-4.jpg";
import { usePageMeta } from "@/hooks/use-page-meta";

const pricingData = [
  {
    category: "Lip Filler",
    items: [
      { name: "0.5ml Lip Filler", price: "£65" },
      { name: "0.8ml Lip Filler", price: "£95" },
      { name: "1ml Lip Filler", price: "£110" },
    ],
  },
  {
    category: "Dermal Filler",
    items: [
      { name: "Chin Filler", price: "£120" },
      { name: "Cheek Filler (per ml)", price: "£120" },
      { name: "Jawline Filler (per ml)", price: "£130" },
      { name: "Tear Trough", price: "£150" },
    ],
  },
  {
    category: "Facial Balancing",
    items: [
      { name: "3ml Facial Balancing", price: "£270" },
      { name: "5ml Facial Balancing", price: "£395" },
      { name: "7ml Facial Balancing", price: "£520" },
    ],
  },
  {
    category: "Anti Wrinkle",
    items: [
      { name: "1 Area", price: "£99" },
      { name: "2 Areas", price: "£145" },
      { name: "3 Areas", price: "£175" },
      { name: "Masseter Jaw Slimming", price: "£195" },
    ],
  },
  {
    category: "Skin Boosters",
    items: [
      { name: "Lumi Eyes", price: "£110" },
      { name: "Seventy Hyal", price: "£125" },
      { name: "Polynucleotides", price: "£140" },
      { name: "Profhilo", price: "£195" },
    ],
  },
  {
    category: "Skin Treatments",
    items: [
      { name: "Hydrafacial", price: "£95" },
      { name: "Chemical Peel", price: "£65" },
    ],
  },
];

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const MuseLanding = () => {
  usePageMeta(
    "Become a Hive Clinic Model | Content Sessions Manchester",
    "Exclusive content pricing on aesthetic treatments at Hive Clinic, Deansgate Manchester. Book your model session for reduced rates on lip filler, dermal filler, anti-wrinkle and more."
  );

  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center">
        <div className="absolute inset-0">
          <img
            src={gallery4}
            alt="Hive Clinic Muse content session"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <Camera size={14} className="text-gold" />
              <p className="font-body text-sm text-gold uppercase tracking-[0.2em]">
                Content Sessions
              </p>
            </div>
            <h1 className="font-display text-5xl md:text-7xl text-white leading-[1.1] mb-6">
              Become a Hive Clinic Model
            </h1>
            <p className="font-body text-lg text-white/80 mb-4 max-w-xl mx-auto">
              Receive exclusive content pricing on selected aesthetic treatments
              when featured in Hive Clinic photography and video content.
            </p>
            <div className="flex items-center justify-center gap-2 mb-8">
              <MapPin size={14} className="text-gold" />
              <span className="font-body text-sm text-white/60">
                Deansgate, Manchester
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#pricing"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-body text-sm tracking-widest uppercase hover:bg-white/90 transition-colors"
              >
                View Model Pricing
              </a>
              <Link
                to="/bookings"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/40 text-white font-body text-sm tracking-widest uppercase hover:border-white transition-colors"
              >
                Book Muse Appointment <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What Are Muse Sessions */}
      <section className="py-20 bg-secondary">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div {...fadeIn}>
            <h2 className="font-display text-4xl md:text-5xl mb-6">
              What Are Muse Sessions?
            </h2>
            <p className="font-body text-muted-foreground leading-relaxed mb-4">
              Hive Muse sessions are limited appointments where treatments are
              offered at exclusive content rates in exchange for allowing Hive
              Clinic to photograph or film the treatment and results for social
              media and marketing.
            </p>
            <p className="font-body text-muted-foreground leading-relaxed">
              Content may include before and after photos, treatment clips, or
              short video content.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Model Pricing */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeIn}>
            <h2 className="font-display text-4xl md:text-5xl text-center mb-4">
              Model Pricing
            </h2>
            <p className="font-body text-muted-foreground text-center mb-12">
              Exclusive rates for content sessions
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pricingData.map((cat, i) => (
              <motion.div
                key={cat.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="border border-border p-8"
              >
                <h3 className="font-display text-2xl mb-6 text-center">
                  {cat.category}
                </h3>
                <div className="space-y-4">
                  {cat.items.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between"
                    >
                      <span className="font-body text-sm text-foreground">
                        {item.name}
                      </span>
                      <span className="font-body text-sm font-medium text-gold">
                        {item.price}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Information */}
      <section className="py-20 bg-foreground text-background">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div {...fadeIn}>
            <h2 className="font-display text-4xl text-center mb-12">
              Important Information
            </h2>
            <div className="space-y-5">
              {[
                "Content sessions require consent for photos and video",
                "Treatments are carried out at Hive Clinic in Deansgate",
                "Limited availability each month",
                "Full consultation is carried out before treatment",
              ].map((point) => (
                <div key={point} className="flex items-start gap-4">
                  <Check
                    size={16}
                    className="text-gold flex-shrink-0 mt-0.5"
                  />
                  <span className="font-body text-sm text-background/80">
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Booking CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div {...fadeIn}>
            <h2 className="font-display text-4xl md:text-5xl mb-6">
              Book Your Muse Appointment
            </h2>
            <p className="font-body text-muted-foreground mb-8">
              Secure your content session at exclusive rates.
            </p>
            <Link
              to="/bookings"
              className="inline-flex items-center gap-2 px-10 py-4 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-foreground/90 transition-colors"
            >
              Book Content Session <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-secondary">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div {...fadeIn}>
            <p className="font-display text-3xl md:text-5xl leading-tight mb-8">
              Limited Hive Muse appointments available each month
            </p>
            <Link
              to="/bookings"
              className="inline-flex items-center gap-2 px-10 py-4 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-foreground/90 transition-colors"
            >
              Book Now <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default MuseLanding;
