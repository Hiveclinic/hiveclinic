import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ResultsGalleryProps {
  images: string[];
}

const ResultsGallery = ({ images }: ResultsGalleryProps) => {
  return (
    <section className="py-20 md:py-28 bg-secondary">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12"
        >
          <div>
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-gold mb-2">Real Results</p>
            <h2 className="font-display text-3xl md:text-5xl">See the difference.</h2>
          </div>
          <Link
            to="/results"
            className="inline-flex items-center gap-2 font-body text-[11px] tracking-[0.15em] uppercase text-muted-foreground hover:text-gold transition-colors"
          >
            View all results <ArrowRight size={12} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
          {images.slice(0, 6).map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`overflow-hidden group ${
                i === 0 ? "col-span-2 row-span-2 aspect-[3/4]" : "aspect-square"
              }`}
            >
              <img
                src={img}
                alt={`Treatment result ${i + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
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
