import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ResultsGalleryProps {
  images: string[];
}

const ResultsGallery = ({ images }: ResultsGalleryProps) => (
  <section className="py-20 md:py-28 bg-foreground text-background" aria-label="Treatment results gallery">
    <div className="max-w-7xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12"
      >
        <div>
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-gold mb-3">Results</p>
          <h2 className="font-display text-3xl md:text-5xl text-background">See the difference.</h2>
        </div>
        <Link
          to="/results"
          className="inline-flex items-center gap-2 font-body text-[11px] tracking-[0.15em] uppercase text-background/40 hover:text-gold transition-colors"
        >
          View all results <ArrowRight size={12} />
        </Link>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
        {images.slice(0, 6).map((img, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.5 }}
            className="overflow-hidden group aspect-[4/5]"
          >
            <img
              src={img}
              alt={`Hive Clinic treatment result ${i + 1}`}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
              loading="lazy"
            />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ResultsGallery;
