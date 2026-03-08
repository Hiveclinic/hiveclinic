import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";
import { usePageMeta } from "@/hooks/use-page-meta";

const posts = [
  {
    slug: "what-to-expect-first-filler",
    title: "What to Expect at Your First Filler Appointment",
    excerpt: "Nervous about your first injectable treatment? Here's everything you need to know before, during, and after.",
    date: "February 2026",
    img: gallery1,
  },
  {
    slug: "lip-filler-aftercare-guide",
    title: "Lip Filler Aftercare: Your Complete Guide",
    excerpt: "Everything you need to know about caring for your lips after filler treatment for the best possible results.",
    date: "January 2026",
    img: gallery4,
  },
  {
    slug: "hydrafacial-benefits-skin",
    title: "5 Benefits of HydraFacial for Every Skin Type",
    excerpt: "Discover why HydraFacial has become the most popular facial treatment in Manchester and what it can do for your skin.",
    date: "January 2026",
    img: gallery3,
  },
  {
    slug: "skincare-routine-glow",
    title: "The Ultimate Skincare Routine for Glass Skin",
    excerpt: "Our top tips for building a routine that complements your in-clinic treatments for maximum glow.",
    date: "December 2025",
    img: gallery2,
  },
  {
    slug: "skin-boosters-vs-fillers",
    title: "Skin Boosters vs Fillers: What's the Difference?",
    excerpt: "Two of the most popular injectable treatments - but they do very different things. Let us explain.",
    date: "November 2025",
    img: gallery6,
  },
  {
    slug: "chemical-peel-guide-manchester",
    title: "Chemical Peels: Everything You Need to Know",
    excerpt: "From mild brightening peels to intensive treatments - a complete guide to chemical peels and what to expect.",
    date: "November 2025",
    img: gallery5,
  },
];

const Blog = () => (
  <Layout>
    <section className="py-24">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-16">
          <h1 className="font-display text-5xl md:text-6xl mb-4">The Hive Edit</h1>
          <p className="font-body text-muted-foreground">Expert insights, skincare tips, and treatment guides from Hive Clinic Manchester.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link key={post.slug} to={`/blog/${post.slug}`} className="group">
              <div className="aspect-[4/5] overflow-hidden mb-4">
                <img
                  src={post.img}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-2">{post.date}</p>
              <h2 className="font-display text-xl mb-2 group-hover:text-gold transition-colors">{post.title}</h2>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default Blog;
