import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useSiteImage } from "@/hooks/use-site-image";

const resultLabels = [
  "Skin Glow Treatment",
  "Lip Enhancement",
  "Facial Treatment",
  "Skin Rejuvenation",
  "Post-Treatment Glow",
  "Skincare Ritual",
];

const Results = () => {
  usePageMeta("Results Gallery | Hive Clinic Manchester City Centre", "See real treatment results from Hive Clinic, Manchester City Centre. Before and after photos from lip fillers, skin treatments and more.");

  const r1 = useSiteImage("results_1", gallery1);
  const r2 = useSiteImage("results_2", gallery3);
  const r3 = useSiteImage("results_3", gallery4);
  const r4 = useSiteImage("results_4", gallery5);
  const r5 = useSiteImage("results_5", gallery2);
  const r6 = useSiteImage("results_6", gallery6);
  const results = [
    { img: r1, label: resultLabels[0] },
    { img: r2, label: resultLabels[1] },
    { img: r3, label: resultLabels[2] },
    { img: r4, label: resultLabels[3] },
    { img: r5, label: resultLabels[4] },
    { img: r6, label: resultLabels[5] },
  ];

  return (
  <Layout>
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-16">
          <h1 className="font-display text-5xl md:text-6xl mb-4">Results Gallery</h1>
          <p className="font-body text-muted-foreground max-w-lg mx-auto">
Real results from real clients. Individual results may vary.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group"
            >
              <div className="aspect-[3/4] overflow-hidden mb-3">
                <img
                  src={r.img}
                  alt={r.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <p className="font-body text-sm text-muted-foreground">{r.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 p-6 bg-secondary text-center">
          <p className="font-body text-xs text-muted-foreground">
            Disclaimer: All images are from real clients who have given consent. Individual results may vary. Treatments
            should only be carried out after a professional consultation.
          </p>
        </div>
      </div>
    </section>
  </Layout>
  );
};

export default Results;
