import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ResultsGalleryProps { images: string[]; }

// Editorial grid — no rotated polaroids, no captions cluttering the image.
const ResultsGallery = ({ images }: ResultsGalleryProps) => {
  return (
    <section className="section-y bg-bone" aria-label="Results gallery">
      <div className="container-edit">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14 md:mb-20"
        >
          <div>
            <p className="eyebrow text-champagne mb-5">The Edit</p>
            <h2 className="font-display text-4xl md:text-6xl text-ink leading-[1.04] tracking-tight">
              Results worth a <span className="display-italic text-aubergine">screenshot.</span>
            </h2>
          </div>
          <Link
            to="/results"
            className="self-start inline-flex items-center gap-2 font-body text-[11px] tracking-[0.3em] uppercase text-ink/60 hover:text-aubergine border-b border-aubergine/30 pb-1 transition-colors"
          >
            View all <ArrowUpRight size={13} strokeWidth={1.5} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
          {images.slice(0, 6).map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              className="overflow-hidden bg-ink/5"
            >
              <img
                src={img}
                alt={`Hive Clinic result ${i + 1}`}
                className="w-full aspect-[4/5] object-cover hover:scale-[1.04] transition-transform duration-[1200ms]"
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResultsGallery;
