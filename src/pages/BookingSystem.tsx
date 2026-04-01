import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { ChevronDown, Calendar, Clock, Shield, CheckCircle } from "lucide-react";
import { useState } from "react";
import { usePageMeta } from "@/hooks/use-page-meta";

const SETMORE_URL = "https://hiveclinicuk.setmore.com";
const POLICY_URL = "https://hiveclinicuk.com/policies";

const faqs = [
  { q: "Do I need a consultation first?", a: "Yes - for all injectable treatments, an initial consultation is required. This ensures your safety and allows us to create a personalised treatment plan." },
  { q: "Is there any downtime?", a: "It depends on the treatment. Most facial treatments have minimal downtime. Injectables may involve slight swelling for 24-48 hours. We will discuss this during your consultation." },
  { q: "How do I prepare for my appointment?", a: "Avoid alcohol 24 hours before, arrive with a clean face if possible, and let us know about any medications or allergies." },
  { q: "Can I pay in instalments?", a: "Yes! We offer Klarna and Clearpay for eligible treatments, so you can spread the cost." },
  { q: "What if I need to reschedule?", a: "We ask for at least 24 hours notice for cancellations or rescheduling. Late cancellations may incur a fee." },
];

const categories = [
  {
    title: "Skin Treatments",
    services: [
      { name: "BioRePeel Face", price: "£95", benefit: "Clear, smooth, refined skin" },
      { name: "BioRePeel Body", price: "£120", benefit: "Full body skin renewal" },
      { name: "Glass Skin Treatment", price: "£140", benefit: "Hydrated, radiant finish" },
      { name: "Chemical Peel", price: "£80", benefit: "Deep exfoliation and renewal" },
      { name: "Dermaplaning", price: "£55", benefit: "Smooth, peach-fuzz free skin" },
      { name: "LED Light Therapy", price: "£40", benefit: "Calm, heal and rejuvenate" },
    ],
  },
  {
    title: "Skin Boosters",
    services: [
      { name: "Profhilo", price: "£280", benefit: "Deep hydration and skin remodelling" },
      { name: "Seventy Hyal", price: "£200", benefit: "Lightweight skin boost" },
      { name: "Polynucleotides", price: "£250", benefit: "Bio-regenerative skin repair" },
    ],
  },
  {
    title: "Microneedling",
    services: [
      { name: "Microneedling Face", price: "£150", benefit: "Collagen stimulation and renewal" },
      { name: "Microneedling with PRP", price: "£250", benefit: "Enhanced healing with platelet-rich plasma" },
    ],
  },
  {
    title: "Hydrafacial",
    services: [
      { name: "Hydrafacial Signature", price: "£99", benefit: "Deep cleanse, extract and hydrate" },
      { name: "Hydrafacial Deluxe", price: "£140", benefit: "Signature plus LED and boosters" },
    ],
  },
  {
    title: "Injectables",
    services: [
      { name: "Lip Filler 0.5ml", price: "£100", benefit: "Subtle natural enhancement" },
      { name: "Lip Filler 1ml", price: "£160", benefit: "Natural volume and shape" },
      { name: "Dermal Filler 1ml", price: "£180", benefit: "Restore volume and contour" },
      { name: "Jaw and Chin Filler", price: "£250", benefit: "Define and sculpt the jawline" },
      { name: "Cheek Filler", price: "£250", benefit: "Lift and restore cheek volume" },
      { name: "Non-Surgical Rhinoplasty", price: "£280", benefit: "Reshape without surgery" },
    ],
  },
  {
    title: "Anti-Wrinkle",
    services: [
      { name: "Anti-Wrinkle 1 Area", price: "£120", benefit: "Smooth fine lines" },
      { name: "Anti-Wrinkle 2 Areas", price: "£180", benefit: "Forehead and frown lines" },
      { name: "Anti-Wrinkle 3 Areas", price: "£220", benefit: "Full upper face treatment" },
    ],
  },
  {
    title: "Intimate Pigment Treatments",
    services: [
      { name: "Intimate Peel", price: "£80", benefit: "Even tone and brighten" },
      { name: "Intimate Peel Course (3)", price: "£200", benefit: "Progressive results" },
    ],
  },
  {
    title: "Body",
    services: [
      { name: "Fat Dissolving", price: "£180", benefit: "Reduce stubborn fat pockets" },
      { name: "Micro-Sclerotherapy", price: "£200", benefit: "Treat thread veins" },
    ],
  },
  {
    title: "Wellness",
    services: [
      { name: "PRP Hair Restoration", price: "£250", benefit: "Stimulate natural hair growth" },
      { name: "PRP Facial", price: "£200", benefit: "Natural skin rejuvenation" },
    ],
  },
  {
    title: "IV Drip Therapy",
    services: [
      { name: "Immunity Boost IV", price: "£150", benefit: "Strengthen your immune system" },
      { name: "Glow IV", price: "£150", benefit: "Radiance from within" },
      { name: "Energy IV", price: "£150", benefit: "Revitalise and recharge" },
    ],
  },
];

const BookNowButton = ({ className = "" }: { className?: string }) => (
  <div className={className}>
    <a
      href={SETMORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center h-12 px-8 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors text-sm"
    >
      Book Now
    </a>
    <p className="text-xs text-muted-foreground mt-2">
      By booking, you agree to our{" "}
      <a href={POLICY_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
        booking policies
      </a>
    </p>
  </div>
);

const ServiceCard = ({ name, price, benefit }: { name: string; price: string; benefit: string }) => (
  <div className="border border-border rounded-lg p-5 flex flex-col justify-between gap-4 bg-card">
    <div>
      <div className="flex items-baseline justify-between gap-2 mb-1">
        <h4 className="font-medium text-sm">{name}</h4>
        <span className="text-sm font-medium text-primary whitespace-nowrap">{price}</span>
      </div>
      <p className="text-xs text-muted-foreground">{benefit}</p>
    </div>
    <BookNowButton />
  </div>
);

const BookingSystem = () => {
  usePageMeta(
    "Book Appointment | Hive Clinic Manchester",
    "Book your aesthetic treatment at Hive Clinic, Manchester. Lip fillers, skin treatments, consultations and more."
  );
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const scrollToTreatments = () => {
    document.getElementById("treatments")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="font-display text-5xl md:text-6xl mb-4">Book Your Treatment</h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Refined, natural results. Select your treatment below.
            </p>
            <button
              onClick={scrollToTreatments}
              className="inline-flex items-center justify-center h-12 px-8 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors text-sm"
            >
              Book Now
            </button>
          </motion.div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-display text-3xl text-center mb-8">Not sure where to start?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "Skin Consultation", text: "Personalised treatment plan" },
              { title: "Returning Client", text: "Continue your treatment journey" },
            ].map((card) => (
              <div key={card.title} className="border border-border rounded-lg p-6 text-center bg-card">
                <h3 className="font-display text-xl mb-2">{card.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{card.text}</p>
                <BookNowButton />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Treatment Categories */}
      <section id="treatments" className="pb-20">
        <div className="max-w-5xl mx-auto px-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="mb-16"
            >
              <h3 className="font-display text-2xl mb-6 border-b border-border pb-3">{cat.title}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cat.services.map((s) => (
                  <ServiceCard key={s.name} {...s} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How Booking Works */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-display text-3xl text-center mb-10">How booking works</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Calendar, label: "Choose your treatment" },
              { icon: Clock, label: "Select your time" },
              { icon: Shield, label: "Secure your appointment" },
              { icon: CheckCircle, label: "Receive confirmation" },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-10 h-10 rounded-full border border-primary flex items-center justify-center mx-auto mb-3">
                  <span className="text-sm font-medium text-primary">{i + 1}</span>
                </div>
                <p className="text-sm text-muted-foreground">{step.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-display text-3xl text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-0">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-border">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between py-5 text-left"
                >
                  <span className="font-medium text-sm">{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`flex-shrink-0 ml-4 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                  />
                </button>
                {openFaq === i && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="pb-5">
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BookingSystem;
