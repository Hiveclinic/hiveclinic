import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { STOCK } from "@/lib/stock-images";

const posts = [
  { slug: "what-to-expect-first-filler", title: "What to Expect at Your First Filler Appointment", img: STOCK.blog_1, date: "February 2026" },
  { slug: "lip-filler-aftercare-guide", title: "Lip Filler Aftercare: Your Complete Guide", img: STOCK.blog_2, date: "January 2026" },
  { slug: "hydrafacial-benefits-skin", title: "5 Benefits of HydraFacial for Every Skin Type", img: STOCK.blog_3, date: "January 2026" },
];

const BlogPreview = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12"
        >
          <div>
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-gold mb-2">The Hive Edit</p>
            <h2 className="font-display text-3xl md:text-5xl">Expert guides and news.</h2>
          </div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 font-body text-[11px] tracking-[0.15em] uppercase text-muted-foreground hover:text-gold transition-colors"
          >
            All posts <ArrowRight size={12} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {posts.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link to={`/blog/${post.slug}`} className="group block">
                <div className="aspect-[4/5] overflow-hidden mb-4">
                  <img
                    src={post.img}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
                <p className="font-body text-[10px] text-muted-foreground tracking-[0.15em] uppercase mb-2">{post.date}</p>
                <h3 className="font-display text-lg group-hover:text-gold transition-colors duration-300 leading-snug">{post.title}</h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
