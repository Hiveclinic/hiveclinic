import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { trackBookNow } from "@/hooks/use-tracking";

interface HeroSectionProps {
  heroImg: string;
}

const HeroSection = ({ heroImg }: HeroSectionProps) => {
  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.06]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0.45]);

  return (
    <section className="relative h-screen overflow-hidden bg-foreground" aria-label="Hero">
      <motion.div className="absolute inset-0" style={{ scale: heroScale, opacity: heroOpacity }}>
        <img
          src={heroImg}
          alt="Hive Clinic aesthetic treatment room in Manchester City Centre"
          className="w-full h-full object-cover"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        {/* Dark editorial wash — IG-grid feel: deep black bottom, clear top */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
      </motion.div>

      {/* Editorial overline top-left */}
      <div className="absolute top-24 md:top-28 left-6 md:left-12 z-10">
        <p className="font-body text-[10px] tracking-[0.45em] uppercase text-white/60">
          Hive Clinic — Est. Manchester
        </p>
      </div>

      {/* Floating gold price disc — IG promo-tile style */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-28 md:top-32 right-6 md:right-12 z-10 hidden md:flex flex-col items-center justify-center w-28 h-28 rounded-full bg-gold/95 shadow-xl"
      >
        <p className="font-body text-[8px] tracking-[0.3em] uppercase text-white/80">From</p>
        <p className="font-display text-3xl text-white leading-none">£99</p>
        <p className="font-body text-[8px] tracking-[0.2em] uppercase text-white/80 mt-0.5">Lip Filler</p>
      </motion.div>

      <div className="relative z-10 h-full flex flex-col justify-end pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <p className="font-body text-[10px] tracking-[0.4em] uppercase text-gold/90 mb-6">
              Deansgate · Manchester
            </p>

            <h1 className="font-display text-[clamp(2.6rem,8vw,6rem)] text-white leading-[0.98] mb-8">
              Sculpted softly. <br />
              <span className="italic text-gold">Refined</span> beautifully.
            </h1>

            <p className="font-body text-[15px] text-white/65 leading-[1.7] mb-10 max-w-lg">
              Expert aesthetic treatments by qualified practitioners. Personalised plans, premium products, and naturally refined results — in the heart of Manchester.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/bookings#book"
                onClick={() => trackBookNow("home_hero")}
                className="group inline-flex items-center justify-center gap-3 px-9 py-4 bg-gold text-white font-body text-[11px] tracking-[0.25em] uppercase hover:bg-gold-dark transition-colors duration-300"
              >
                Book Now
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center gap-3 px-9 py-4 border border-white/20 text-white font-body text-[11px] tracking-[0.25em] uppercase hover:border-gold hover:text-gold transition-colors duration-300"
              >
                View Price List
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Trust strip — tighter, more luxurious */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="max-w-7xl mx-auto px-6 w-full mt-12"
        >
          <div className="border-t border-white/[0.1] pt-5">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
              {[
                "Qualified Practitioners",
                "5.0 · Google Rated",
                "Same-Week Availability",
                "Klarna · Clearpay",
              ].map((t, i) => (
                <div key={t} className="flex items-center gap-3">
                  {i > 0 && <span className="hidden sm:block w-px h-3 bg-white/15" />}
                  <span className="font-body text-[10px] text-white/40 tracking-[0.18em] uppercase">
                    {t}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
