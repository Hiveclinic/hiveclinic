import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { ArrowLeft } from "lucide-react";

const posts: Record<string, { title: string; date: string; content: string[] }> = {
  "what-to-expect-first-filler": {
    title: "What to Expect at Your First Filler Appointment",
    date: "January 2026",
    content: [
      "If you're considering dermal filler for the first time, it's completely normal to feel a mix of excitement and nerves. At Hive Clinic, we make sure every client feels informed, comfortable, and confident before any treatment begins.",
      "Your journey starts with a thorough consultation where we discuss your goals, medical history, and expectations. This is your time to ask questions - no question is too small.",
      "During the treatment, a topical numbing cream is applied to minimise discomfort. The procedure itself typically takes 15-30 minutes, depending on the area being treated.",
      "Aftercare is just as important. Expect some mild swelling for 24-48 hours, and avoid intense exercise, alcohol, and excessive heat for the first day. We'll provide you with full aftercare instructions.",
      "Results are visible immediately but settle beautifully over the following two weeks. We always recommend a review appointment to ensure you're happy with the outcome.",
    ],
  },
  "skincare-routine-glow": {
    title: "The Ultimate Skincare Routine for Glass Skin",
    date: "December 2025",
    content: [
      "Glass skin - that impossibly dewy, translucent-looking complexion - isn't just about genetics. With the right routine and professional treatments, it's achievable for everyone.",
      "Start with a gentle cleanser that doesn't strip your skin. Follow with a hydrating toner and layer on a serum rich in hyaluronic acid. Seal everything in with a quality moisturiser and SPF during the day.",
      "In-clinic treatments like Profhilo and HydraFacials supercharge your at-home routine by delivering deep hydration and stimulating collagen production beneath the surface.",
      "Consistency is key. The best results come from combining a dedicated home routine with regular professional treatments. Book a skin consultation to get a personalised plan.",
    ],
  },
  "profhilo-vs-fillers": {
    title: "Profhilo vs Fillers: What's the Difference?",
    date: "November 2025",
    content: [
      "Both Profhilo and dermal fillers involve injectable hyaluronic acid, but they serve very different purposes.",
      "Dermal fillers add volume and structure to specific areas — think lips, cheeks, jawline. They're about shaping and contouring. Results are immediate and can last 6–18 months.",
      "Profhilo, on the other hand, is a skin booster. It disperses across a wide area to hydrate and stimulate collagen and elastin production. It improves overall skin quality, laxity, and glow rather than adding volume.",
      "Many of our clients benefit from both. A common approach is to address specific concerns with filler and maintain overall skin health with Profhilo treatments two to three times a year.",
      "Not sure which is right for you? Book a consultation and we'll guide you to the perfect plan.",
    ],
  },
};

const BlogPost = () => {
  const { slug } = useParams();
  const post = posts[slug || ""];

  if (!post) {
    return (
      <Layout>
        <div className="py-24 text-center">
          <h1 className="font-display text-4xl mb-4">Post Not Found</h1>
          <Link to="/blog" className="text-gold underline font-body">Back to Blog</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="py-24">
        <div className="max-w-3xl mx-auto px-6">
          <Link to="/blog" className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft size={14} /> Back to Blog
          </Link>
          <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-3">{post.date}</p>
          <h1 className="font-display text-4xl md:text-5xl mb-10">{post.title}</h1>
          <div className="space-y-6">
            {post.content.map((p, i) => (
              <p key={i} className="font-body text-foreground/80 leading-relaxed">{p}</p>
            ))}
          </div>
          <div className="mt-16 p-8 bg-secondary text-center">
            <h3 className="font-display text-2xl mb-3">Ready to book?</h3>
            <Link
              to="/bookings"
              className="inline-flex items-center gap-2 px-8 py-3 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-accent transition-colors"
            >
              Book Consultation
            </Link>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default BlogPost;
