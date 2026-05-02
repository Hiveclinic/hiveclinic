import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ResultsGalleryProps { images: string[]; }

// Polaroid wall - editorial scrapbook
const ResultsGallery = ({ images }: ResultsGalleryProps) => {
  const rotations = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "-rotate-1", "rotate-1"];
  return (
    <section className="py-24 md:py-32 bg-bone bg-noise" aria-label="Results gallery">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14"
        >
          <div>
            <p className="eyebrow text-burgundy mb-4">The Edit</p>
            <h2 className="font-display text-4xl md:text-6xl text-ink leading-[1.02]">
              Results worth a
              <span className="font-script italic text-burgundy"> screenshot.</span>
            </h2>
          </div>
          <Link
            to="/results"
            className="self-start inline-flex items-center gap-2 font-body text-[11px] tracking-[0.28em] uppercase text-ink/60 hover:text-burgundy border-b border-burgundy/30 pb-1 transition-colors"
          >
            View all <ArrowUpRight size={13} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {images.slice(0, 6).map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.6 }}
              className={`polaroid ${rotations[i % rotations.length]} hover:rotate-0 hover:-translate-y-1 transition-transform duration-500`}
            >
              <div className="overflow-hidden bg-ink/5">
                <img
                  src={img}
                  alt={`Hive Clinic result ${i + 1}`}
                  className="w-full aspect-[4/5] object-cover"
                  loading="lazy"
                />
              </div>
              <p className="absolute bottom-3 left-0 right-0 text-center font-script text-sm text-ink/60">
                no. {String(i + 1).padStart(2, "0")}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResultsGallery;
