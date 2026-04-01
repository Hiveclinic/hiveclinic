import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { ArrowLeft, ArrowRight } from "lucide-react";

const posts: Record<string, { title: string; date: string; content: string[] }> = {
  "what-to-expect-first-filler": {
    title: "What to Expect at Your First Filler Appointment",
    date: "February 2026",
    content: [
      "If you're considering dermal filler for the first time, it's completely normal to feel a mix of excitement and nerves. At Hive Clinic, we make sure every client feels informed, comfortable, and confident before any treatment begins.",
      "Your journey starts with a thorough consultation where we discuss your goals, medical history, and expectations. This is your time to ask questions - no question is too small.",
      "During the treatment, a topical numbing cream is applied to minimise discomfort. The procedure itself typically takes 15-30 minutes, depending on the area being treated.",
      "Aftercare is just as important. Expect some mild swelling for 24-48 hours, and avoid intense exercise, alcohol, and excessive heat for the first day. We'll provide you with full aftercare instructions.",
      "Results are visible immediately but settle beautifully over the following two weeks. We always recommend a review appointment to ensure you're happy with the outcome.",
    ],
  },
  "lip-filler-aftercare-guide": {
    title: "Lip Filler Aftercare: Your Complete Guide",
    date: "January 2026",
    content: [
      "Congratulations on your new lips! Proper aftercare is essential for achieving the best possible results from your lip filler treatment. Here's everything you need to know.",
      "For the first 24 hours, avoid touching, pressing, or massaging your lips. The filler needs time to settle into position. Swelling is completely normal and typically peaks at 24-48 hours before gradually subsiding.",
      "Apply a cold compress (not ice directly) if needed for comfort. Avoid hot drinks, spicy food, and strenuous exercise for 24 hours. Alcohol should be avoided for at least 24 hours as it can increase swelling and bruising.",
      "Keep your lips hydrated with a gentle lip balm. Avoid wearing lipstick or lip products for at least 6 hours post-treatment. Sleep with your head slightly elevated for the first night to minimise swelling.",
      "Most clients see their final result at around 2 weeks once all swelling has subsided. If you notice any asymmetry or unevenness before this point, don't worry - it's likely just swelling resolving at different rates.",
      "Book a review appointment at 2-4 weeks so your practitioner can assess the results and make any adjustments if needed. At Hive Clinic, we include this follow-up as part of your treatment.",
    ],
  },
  "hydrafacial-benefits-skin": {
    title: "5 Benefits of HydraFacial for Every Skin Type",
    date: "January 2026",
    content: [
      "HydraFacial has rapidly become one of the most sought-after facial treatments in Manchester, and for good reason. Here are five benefits that make it a favourite at Hive Clinic.",
      "1. Instant results with zero downtime. Unlike many skin treatments that require days of recovery, a HydraFacial delivers immediately visible results. You can quite literally walk out glowing and go straight to dinner.",
      "2. Suitable for every skin type. Whether you have oily, dry, sensitive, or combination skin, HydraFacial can be customised to address your specific concerns. The treatment uses gentle vortex technology that's effective without being harsh.",
      "3. Deep cleansing beyond what home care can achieve. The patented vortex suction technology extracts impurities, dead skin cells, and sebum from pores at a depth that no at-home product can reach. This is why regular HydraFacials are such a game-changer for congested skin.",
      "4. Hydration that actually lasts. Unlike topical moisturisers that sit on the surface, HydraFacial infuses powerful serums deep into the skin. Hyaluronic acid, peptides, and antioxidants are delivered directly where they're needed most.",
      "5. It pairs beautifully with other treatments. Many of our clients combine their HydraFacial with other treatments like skin boosters or microneedling for enhanced results. Your practitioner can recommend the perfect combination for your skin goals.",
    ],
  },
  "skincare-routine-glow": {
    title: "The Ultimate Skincare Routine for Glass Skin",
    date: "December 2025",
    content: [
      "Glass skin - that impossibly dewy, translucent-looking complexion - isn't just about genetics. With the right routine and professional treatments, it's achievable for everyone.",
      "Start with a gentle cleanser that doesn't strip your skin. Follow with a hydrating toner and layer on a serum rich in hyaluronic acid. Seal everything in with a quality moisturiser and SPF during the day.",
      "In-clinic treatments like injectable skin boosters and HydraFacials supercharge your at-home routine by delivering deep hydration and stimulating collagen production beneath the surface.",
      "Consistency is key. The best results come from combining a dedicated home routine with regular professional treatments. Book a skin consultation to get a personalised plan.",
    ],
  },
  "skin-boosters-vs-fillers": {
    title: "Skin Boosters vs Fillers: What's the Difference?",
    date: "November 2025",
    content: [
      "Both skin boosters and dermal fillers involve injectable hyaluronic acid, but they serve very different purposes.",
      "Dermal fillers add volume and structure to specific areas - think lips, cheeks, jawline. They're about shaping and contouring. Results are immediate and can last 6-18 months.",
      "Skin boosters, on the other hand, disperse across a wide area to hydrate and stimulate collagen and elastin production. They improve overall skin quality, laxity, and glow rather than adding volume.",
      "Many of our clients benefit from both. A common approach is to address specific concerns with filler and maintain overall skin health with skin booster treatments two to three times a year.",
      "Not sure which is right for you? Book a consultation and we'll guide you to the perfect plan.",
    ],
  },
  "chemical-peel-guide-manchester": {
    title: "Chemical Peels: Everything You Need to Know",
    date: "November 2025",
    content: [
      "Chemical peels are one of the most effective treatments for improving skin texture, tone, and clarity. Whether you're dealing with acne scarring, hyperpigmentation, or just want brighter, smoother skin, there's a peel for you.",
      "At Hive Clinic, we offer two levels of chemical peels. Level 1 peels are ideal for treating hormonal breakouts, mild scarring, and rough texture. They include an antibacterial cleanse and clarifying mask for a comprehensive treatment.",
      "Level 2 peels are stronger and specifically designed for stubborn pigmentation issues like melasma and dark spots. These are our most popular peels for clients seeking dramatic improvement in skin tone evenness.",
      "We also offer intimate peels and body brightening treatments for areas like underarms, elbows, knees, and hands. These specialist peels are designed to brighten and even out skin tone in areas that traditional skincare can't reach.",
      "Most clients benefit from a course of 3-8 sessions depending on their concerns. We offer course packages at reduced prices to make ongoing treatment more accessible. Your practitioner will recommend the right plan during your consultation.",
      "Aftercare is important - expect mild peeling and redness for 2-5 days. Strict sun protection is essential, and we'll provide you with everything you need to know to get the best results from your treatment.",
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
            <p className="font-body text-sm text-muted-foreground mb-6">Book a free consultation to discuss your treatment goals.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://hiveclinicuk.setmore.com/book?step=date-time&products=745f4a19-36cf-403c-8f7e-608f494585db&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=true"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-accent transition-colors"
              >
                Book Consultation <ArrowRight size={14} />
              </a>
              <a
                href="https://wa.me/447795008114"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3 border border-border font-body text-sm tracking-widest uppercase hover:border-gold transition-colors"
              >
                Message Us on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default BlogPost;
