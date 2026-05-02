import { motion } from "framer-motion";
import { ArrowUpRight, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { trackBookNow } from "@/hooks/use-tracking";
import klarnaLogo from "@/assets/klarna-logo.png";
import clearpayLogo from "@/assets/clearpay-logo.png";

interface HeroSectionProps {
  heroImg: string;
}

const HeroSection = ({ heroImg }: HeroSectionProps) => {
  return (
    <section className="relative bg-bone overflow-hidden" aria-label="Hive Clinic Manchester">
      <div className="container-edit pt-6 md:pt-20 pb-10 md:pb-24">
        {/* Mobile: image first. Desktop: copy left, image right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 items-end">
          {/* Image column — order-first on mobile so phone users see imagery instantly */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 lg:order-2 relative"
          >
            <div className="relative">
              <img
                src={heroImg}
                alt="Hive Clinic Manchester — aesthetic editorial portrait"
                className="w-full aspect-[4/5] object-cover"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
              <div className="absolute -left-2 top-8 bottom-8 w-px bg-champagne/40 hidden md:block" />
              <p className="hidden md:block absolute -bottom-7 left-0 font-body text-[10px] tracking-[0.3em] uppercase text-ink/50">
                The Hive Edit / Vol. 26
              </p>
              <p className="hidden md:block absolute -bottom-7 right-0 font-serif-accent italic text-sm text-champagne">
                Manchester
              </p>
            </div>
          </motion.div>

          {/* Copy column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 lg:order-1 relative z-10"
          >
            <p className="eyebrow text-champagne mb-5 md:mb-8 flex items-center gap-3">
              <span className="inline-block w-8 md:w-10 h-px bg-champagne/60" />
              Hive Clinic / Manchester
            </p>

            <h1 className="font-display text-[clamp(2.1rem,9vw,6.4rem)] leading-[0.92] text-ink mb-5 md:mb-8 -tracking-[0.01em]">
              Soft girl.
              <br />
              <span className="display-italic text-aubergine">Sharp results.</span>
            </h1>

            <p className="font-body text-[15px] md:text-[17px] text-ink/65 leading-[1.65] mb-7 md:mb-10 max-w-xl">
              Manchester's quietly-loved aesthetic studio for naturally beautiful lips, sculpted skin and that unmistakable second-look glow. Tailored treatments, premium products, results worth talking about.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8 md:mb-12">
              <Link
                to="/bookings"
                onClick={() => trackBookNow("home_hero")}
                className="btn-ink group inline-flex items-center justify-center gap-3 px-9 py-4 font-body text-[11px] tracking-[0.3em] uppercase"
              >
                Book Treatment
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={1.5} />
              </Link>
              <Link
                to="/treatments"
                className="inline-flex items-center justify-center gap-3 px-9 py-4 border border-ink/15 text-ink font-body text-[11px] tracking-[0.3em] uppercase hover:bg-ink hover:text-bone transition-colors"
              >
                View Treatments
              </Link>
            </div>

            {/* Trust row */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-6 md:pt-7 border-t border-ink/10">
              <div className="flex items-center gap-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={11} className="fill-champagne text-champagne" strokeWidth={0} />
                ))}
                <span className="ml-2 font-body text-[11px] tracking-wider text-ink/65">5.0 Google / Five-Star Reviews</span>
              </div>
              <span className="hidden sm:block w-px h-4 bg-ink/15" />
              <span className="font-body text-[11px] tracking-wider text-ink/55">Qualified Practitioners</span>
              <span className="hidden sm:block w-px h-4 bg-ink/15" />
              <div className="flex items-center gap-2.5">
                <span className="font-body text-[10px] tracking-[0.2em] uppercase text-ink/45">Pay in 3</span>
                <img src={klarnaLogo} alt="Klarna" className="h-4 opacity-80" />
                <img src={clearpayLogo} alt="Clearpay" className="h-4 opacity-80" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="hairline" />
    </section>
  );
};

export default HeroSection;
