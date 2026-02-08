import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  { q: "Do I need a consultation first?", a: "Yes - for all injectable treatments, an initial consultation is required. This ensures your safety and allows us to create a personalised treatment plan." },
  { q: "Is there any downtime?", a: "It depends on the treatment. Most facial treatments have minimal downtime. Injectables may involve slight swelling for 24-48 hours. We'll discuss this during your consultation." },
  { q: "How do I prepare for my appointment?", a: "Avoid alcohol 24 hours before, arrive with a clean face if possible, and let us know about any medications or allergies." },
  { q: "Can I pay in instalments?", a: "Yes! We offer Klarna and Clearpay for eligible treatments, so you can spread the cost." },
  { q: "What if I need to reschedule?", a: "We ask for at least 24 hours' notice for cancellations or rescheduling. Late cancellations may incur a fee." },
];

const Bookings = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <Layout>
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-16">
            <h1 className="font-display text-5xl md:text-6xl mb-4">Book Your Appointment</h1>
            <p className="font-body text-muted-foreground">
              Secure your slot online. Consultations are available for all first-time clients.
            </p>
          </motion.div>

          {/* Booking embed */}
          <div className="mb-24">
            <iframe
              src="https://hiveclinicuk.setmore.com"
              title="Book an appointment at Hive Clinic"
              className="w-full border border-border"
              style={{ height: "700px" }}
              loading="lazy"
            />
          </div>

          {/* FAQ */}
          <div>
            <h2 className="font-display text-3xl text-center mb-10">Frequently Asked Questions</h2>
            <div className="space-y-0">
              {faqs.map((faq, i) => (
                <div key={i} className="border-b border-border">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between py-5 text-left"
                  >
                    <span className="font-body font-medium">{faq.q}</span>
                    <ChevronDown
                      size={18}
                      className={`flex-shrink-0 ml-4 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openFaq === i && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="pb-5"
                    >
                      <p className="font-body text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Bookings;
