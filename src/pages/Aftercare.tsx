import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import AIAftercare from "@/components/AIAftercare";
import { usePageMeta } from "@/hooks/use-page-meta";
const aftercareGuides = [
  {
    title: "Lip Filler Aftercare",
    treatment: "Lip Fillers",
    timeframe: "First 48 Hours",
    dos: [
      "Apply a cold compress gently to reduce swelling",
      "Stay well hydrated - drink at least 2 litres of water daily",
      "Sleep with your head slightly elevated for the first night",
      "Take paracetamol if you experience mild discomfort",
      "Keep the area clean and avoid touching your lips unnecessarily",
    ],
    donts: [
      "Avoid intense exercise for 24-48 hours",
      "Do not consume very hot food or drinks for 24 hours",
      "Avoid alcohol for at least 24 hours",
      "Do not apply makeup to the lip area for 24 hours",
      "Avoid kissing or applying pressure to the lips for 48 hours",
      "Do not book dental appointments for 2 weeks",
    ],
    healing: "Mild swelling and bruising is completely normal and typically subsides within 3-5 days. Final results are visible at 2-4 weeks once the filler has fully settled.",
  },
  {
    title: "Anti-Wrinkle Aftercare",
    treatment: "Anti-Wrinkle Injections",
    timeframe: "First 24 Hours",
    dos: [
      "Gently exercise the treated muscles by frowning and raising eyebrows for 1-2 hours",
      "Remain upright for at least 4 hours after treatment",
      "Continue your normal skincare routine after 24 hours",
      "Be patient - full results take 10-14 days to develop",
    ],
    donts: [
      "Do not lie down or bend forward for 4 hours post-treatment",
      "Avoid rubbing or massaging the treated area for 24 hours",
      "Do not exercise vigorously for 24 hours",
      "Avoid facials, saunas, and steam rooms for 48 hours",
      "Do not consume excessive alcohol for 24 hours",
      "Avoid wearing tight headbands or hats that press on the treated area",
    ],
    healing: "You may notice small red bumps at injection sites which fade within a few hours. Results begin to appear at 3-5 days with full effect at 10-14 days. A review appointment at 2 weeks is recommended.",
  },
  {
    title: "Dermal Filler Aftercare",
    treatment: "Dermal Filler (Cheeks, Jawline, Chin)",
    timeframe: "First 48 Hours",
    dos: [
      "Apply ice packs wrapped in a cloth for 10 minutes at a time to reduce swelling",
      "Sleep on your back with your head elevated for the first two nights",
      "Take arnica supplements to help reduce bruising",
      "Stay hydrated and eat soft foods if jaw area was treated",
    ],
    donts: [
      "Avoid strenuous exercise for 48 hours",
      "Do not apply makeup to the area for 12 hours",
      "Avoid extreme heat (saunas, sunbeds, hot baths) for 2 weeks",
      "Do not massage or manipulate the treated area unless instructed",
      "Avoid dental work for 2 weeks",
      "Do not sleep on the treated side for 2 nights",
    ],
    healing: "Swelling peaks at 24-48 hours and gradually subsides over 1-2 weeks. Bruising, if present, typically resolves within 7-10 days. The final, settled result is visible at 4 weeks.",
  },
  {
    title: "HydraFacial Aftercare",
    treatment: "HydraFacial",
    timeframe: "First 24 Hours",
    dos: [
      "Apply SPF 50 sunscreen before going outside",
      "Keep skin hydrated with a gentle moisturiser",
      "Enjoy your glow - you can apply makeup after 6 hours if needed",
      "Continue drinking plenty of water",
    ],
    donts: [
      "Avoid direct sun exposure for 48 hours",
      "Do not use exfoliating products (AHAs, BHAs, retinol) for 48 hours",
      "Avoid very hot showers or steam for 24 hours",
      "Do not pick or scratch the skin",
    ],
    healing: "There is no downtime with HydraFacial. Your skin may appear slightly flushed for 1-2 hours post-treatment. The glow is immediate and continues to improve over 5-7 days.",
  },
  {
    title: "Chemical Peel Aftercare",
    treatment: "Chemical Peels",
    timeframe: "First 7 Days",
    dos: [
      "Apply SPF 50 daily - this is essential during the healing process",
      "Use a gentle, fragrance-free moisturiser to support healing",
      "Let any peeling skin shed naturally",
      "Keep the skin hydrated with hyaluronic acid serums",
    ],
    donts: [
      "Do not pick, peel, or scratch flaking skin",
      "Avoid direct sun exposure and sunbeds for 2 weeks minimum",
      "Do not use active ingredients (retinol, AHAs, BHAs, vitamin C) for 7 days",
      "Avoid intense exercise that causes heavy sweating for 48 hours",
      "Do not have any other facial treatments for 2 weeks",
      "Avoid swimming pools, saunas, and steam rooms for 1 week",
    ],
    healing: "Mild redness and tightness is normal for 1-3 days. Peeling typically begins on day 3-4 and can last up to 7 days depending on the peel depth. Full results are visible at 2-4 weeks.",
  },
  {
    title: "Microneedling Aftercare",
    treatment: "Microneedling",
    timeframe: "First 72 Hours",
    dos: [
      "Apply the post-treatment serum provided to you",
      "Use SPF 50 daily for at least 2 weeks",
      "Keep skin hydrated with gentle, fragrance-free products",
      "Use clean pillowcases for the first few nights",
    ],
    donts: [
      "Do not apply makeup for 24 hours",
      "Avoid touching your face with unwashed hands",
      "Do not exercise or sweat heavily for 48 hours",
      "Avoid active skincare (retinol, AHAs, vitamin C) for 5-7 days",
      "Do not swim or use saunas for 72 hours",
      "Avoid direct sun exposure for 2 weeks",
    ],
    healing: "Redness similar to mild sunburn is expected for 24-48 hours. Skin may feel tight and dry for 3-5 days. Visible skin improvements begin at 2 weeks with optimal results after a course of treatments.",
  },
];

const Aftercare = () => (
  <Layout>
    {/* Hero */}
    <section className="py-24">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-16">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-gold mb-4">Post-Treatment Guide</p>
          <h1 className="font-display text-5xl md:text-6xl mb-4">Aftercare Advice</h1>
          <p className="font-body text-muted-foreground max-w-lg mx-auto">
            Your treatment doesn't end when you leave the clinic. Follow these guidelines to get the best possible results.
          </p>
        </motion.div>

        {/* AI Personalised Aftercare */}
        <div className="my-16">
          <AIAftercare />
        </div>

        <div className="space-y-16">
          {aftercareGuides.map((guide, i) => (
            <motion.div
              key={guide.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="border border-border p-8 md:p-10"
            >
              <div className="flex items-baseline justify-between flex-wrap gap-2 mb-2">
                <h2 className="font-display text-3xl">{guide.title}</h2>
                <span className="font-body text-xs tracking-widest uppercase text-gold">{guide.timeframe}</span>
              </div>
              <p className="font-body text-sm text-muted-foreground mb-8">{guide.treatment}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="font-display text-lg mb-4 text-green-600">Do</h3>
                  <ul className="space-y-3">
                    {guide.dos.map((d) => (
                      <li key={d} className="font-body text-sm text-foreground/80 flex gap-3">
                        <span className="text-green-600 mt-0.5 flex-shrink-0">+</span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-display text-lg mb-4 text-red-500">Don't</h3>
                  <ul className="space-y-3">
                    {guide.donts.map((d) => (
                      <li key={d} className="font-body text-sm text-foreground/80 flex gap-3">
                        <span className="text-red-500 mt-0.5 flex-shrink-0">-</span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-secondary p-6">
                <h4 className="font-display text-sm uppercase tracking-wider mb-2">What to Expect</h4>
                <p className="font-body text-sm text-foreground/80 leading-relaxed">{guide.healing}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Emergency */}
        <div className="mt-16 border border-gold/30 p-8 text-center">
          <h3 className="font-display text-2xl mb-3">Concerns After Treatment?</h3>
          <p className="font-body text-sm text-muted-foreground mb-6 max-w-md mx-auto">
            If you experience anything unexpected after your treatment, don't hesitate to contact us. We're here to support you.
          </p>
          <a
            href="https://wa.me/447795008114"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-accent transition-colors"
          >
            Message Us on WhatsApp <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </section>
  </Layout>
);

export default Aftercare;
