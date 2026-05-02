import { motion } from "framer-motion";
import { ArrowUpRight, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { trackBookNow } from "@/hooks/use-tracking";
import { LUXE } from "@/lib/stock-images";

interface HeroSectionProps {
  heroImg: string;
}

const HeroSection = ({ heroImg }: HeroSectionProps) => {
  return (
    <section className="relative min-h-[92vh] bg-blush-gradient bg-noise overflow-hidden" aria-label="Hive Clinic Manchester">
      {/* Subtle vertical chrome rule */}
      <div className="absolute top-0 bottom-0 left-1/2 w-px bg-chrome/30 hidden lg:block" />

      <div className="relative max-w-7xl mx-auto px-6 pt-10 lg:pt-16 pb-24 lg:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Copy column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 relative z-10"
          >
            <p className="eyebrow text-burgundy mb-6 flex items-center gap-3">
              <span className="inline-block w-8 h-px bg-burgundy/60" />
              Hive Clinic · Manchester
            </p>

            <h1 className="font-display text-[clamp(2.8rem,9vw,7rem)] leading-[0.92] text-ink mb-8">
              Soft girl.
              <br />
              <span className="display-italic text-burgundy">Sharp</span>
              <span className="font-script italic text-burgundy"> results.</span>
            </h1>

            <p className="font-body text-base md:text-[17px] text-ink/70 leading-[1.7] mb-10 max-w-xl">
              Manchester's most-loved aesthetic studio for naturally beautiful lips, sculpted skin and that unmistakable second-look glow. Tailored treatments, premium products, results you'll actually want to talk about.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link
                to="/bookings#book"
                onClick={() => trackBookNow("home_hero")}
                className="btn-burgundy group inline-flex items-center justify-center gap-3 px-9 py-4 font-body text-[11px] tracking-[0.28em] uppercase"
              >
                Book Treatment
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center gap-3 px-9 py-4 border border-ink/20 text-ink font-body text-[11px] tracking-[0.28em] uppercase hover:bg-ink hover:text-bone transition-colors"
              >
                See Price List
              </Link>
            </div>

            {/* Trust row */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-6 border-t border-ink/10">
              <div className="flex items-center gap-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={12} className="fill-gold text-gold" />
                ))}
                <span className="ml-2 font-body text-[11px] tracking-wider text-ink/70">5.0 Google · 100+ reviews</span>
              </div>
              <span className="hidden sm:block w-px h-4 bg-ink/15" />
              <span className="font-body text-[11px] tracking-wider text-ink/60">Qualified Practitioners</span>
              <span className="hidden sm:block w-px h-4 bg-ink/15" />
              <span className="font-body text-[11px] tracking-wider text-ink/60">Klarna · Clearpay</span>
            </div>
          </motion.div>

          {/* Image column - layered polaroid */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotate: -1 }}
            animate={{ opacity: 1, y: 0, rotate: 1.5 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="polaroid relative max-w-md mx-auto">
              <img
                src={heroImg}
                alt="Hive Clinic Manchester aesthetic editorial portrait"
                className="w-full aspect-[4/5] object-cover"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
              <p className="absolute bottom-3 left-0 right-0 text-center font-script text-base text-ink/70">
                The Hive Edit · 26
              </p>
            </div>

            {/* Floating gold price disc */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.7 }}
              className="absolute -top-4 -left-4 md:-left-8 z-10 flex flex-col items-center justify-center w-28 h-28 rounded-full btn-gold rotate-[-8deg]"
            >
              <span className="font-body text-[8px] tracking-[0.3em] uppercase text-ink/70">From</span>
              <span className="font-display text-3xl text-ink leading-none">£99</span>
              <span className="font-body text-[8px] tracking-[0.25em] uppercase text-ink/70 mt-0.5">Lip Filler</span>
            </motion.div>

            {/* Secondary stamp */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="absolute -bottom-6 -right-2 md:-right-6 z-10 bg-ink text-bone px-5 py-3 rotate-[5deg] shadow-xl"
            >
              <p className="font-script text-base leading-none">Manchester's</p>
              <p className="font-display text-lg leading-none mt-1">it-girl clinic</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Press marquee will follow */}
      <div className="hairline" />
    </section>
  );
};

export default HeroSection;
