import { motion } from "framer-motion";
import { ArrowUpRight, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { trackBookNow } from "@/hooks/use-tracking";

interface HeroSectionProps {
  heroImg: string;
}

const HeroSection = ({ heroImg }: HeroSectionProps) => {
  return (
    <section className="relative bg-bone overflow-hidden" aria-label="Hive Clinic Manchester">
      <div className="container-edit pt-12 md:pt-20 pb-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
          {/* Copy column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 relative z-10"
          >
            <p className="eyebrow text-champagne mb-8 flex items-center gap-3">
              <span className="inline-block w-10 h-px bg-champagne/60" />
              Hive Clinic / Manchester
            </p>

            <h1 className="font-display text-[clamp(2.6rem,8.5vw,6.4rem)] leading-[0.95] text-ink mb-8 tracking-tight">
              Soft girl.
              <br />
              <span className="display-italic text-aubergine">Sharp results.</span>
            </h1>

            <p className="font-body text-base md:text-[17px] text-ink/65 leading-[1.75] mb-10 max-w-xl">
              Manchester's quietly-loved aesthetic studio for naturally beautiful lips, sculpted skin and that unmistakable second-look glow. Tailored treatments, premium products, results worth talking about.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-12">
              <Link
                to="/bookings"
                onClick={() => trackBookNow("home_hero")}
                className="btn-ink group inline-flex items-center justify-center gap-3 px-9 py-4 font-body text-[11px] tracking-[0.3em] uppercase"
              >
                Book Treatment
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={1.5} />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center gap-3 px-9 py-4 border border-ink/15 text-ink font-body text-[11px] tracking-[0.3em] uppercase hover:bg-ink hover:text-bone transition-colors"
              >
                View Price List
              </Link>
            </div>

            {/* Trust row */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-7 border-t border-ink/10">
              <div className="flex items-center gap-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={11} className="fill-champagne text-champagne" strokeWidth={0} />
                ))}
                <span className="ml-2 font-body text-[11px] tracking-wider text-ink/65">5.0 Google / 100+ reviews</span>
              </div>
              <span className="hidden sm:block w-px h-4 bg-ink/15" />
              <span className="font-body text-[11px] tracking-wider text-ink/55">Qualified Practitioners</span>
              <span className="hidden sm:block w-px h-4 bg-ink/15" />
              <span className="font-body text-[11px] tracking-wider text-ink/55">Klarna / Clearpay</span>
            </div>
          </motion.div>

          {/* Image column — single editorial frame, no rotation, no stamps */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative"
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
              {/* Quiet gold rule on the side */}
              <div className="absolute -left-2 top-8 bottom-8 w-px bg-champagne/40 hidden md:block" />
              {/* Caption */}
              <p className="absolute -bottom-7 left-0 font-body text-[10px] tracking-[0.3em] uppercase text-ink/50">
                The Hive Edit / Vol. 26
              </p>
              <p className="absolute -bottom-7 right-0 font-serif-accent italic text-sm text-champagne">
                Manchester
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="hairline" />
    </section>
  );
};

export default HeroSection;
