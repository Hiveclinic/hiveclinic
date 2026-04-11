import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const SETMORE_CONSULTATION = "https://hiveclinicuk.setmore.com/book?step=additional-products&products=745f4a19-36cf-403c-8f7e-608f494585db&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false";

interface HeroSectionProps {
  heroImg: string;
}

const HeroSection = ({ heroImg }: HeroSectionProps) => {
  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.06]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0.5]);

  return (
    <section className="relative h-screen overflow-hidden" aria-label="Hero">
      <motion.div className="absolute inset-0" style={{ scale: heroScale, opacity: heroOpacity }}>
        <img
          src={heroImg}
          alt="Hive Clinic aesthetic treatment room in Manchester City Centre"
          className="w-full h-full object-cover transition-opacity duration-700"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
      </motion.div>

      <div className="relative z-10 h-full flex flex-col justify-end pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <p className="font-body text-[10px] tracking-[0.35em] uppercase text-white/40 mb-6">
              Deansgate, Manchester
            </p>

            <h1 className="font-display text-[clamp(2.4rem,7vw,5rem)] text-white leading-[1.02] mb-6">
              Advanced aesthetics,{" "}
              <span className="italic text-gold">naturally</span> refined.
            </h1>

            <p className="font-body text-[15px] text-white/45 leading-[1.7] mb-10 max-w-lg">
              Expert treatments by qualified practitioners. Personalised plans, premium products, and natural results - in the heart of Manchester.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={SETMORE_CONSULTATION}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-gold text-white font-body text-[11px] tracking-[0.2em] uppercase hover:bg-gold-dark transition-colors duration-300"
              >
                Book Consultation
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <Link
                to="/bookings"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-white/12 text-white font-body text-[11px] tracking-[0.2em] uppercase hover:border-white/30 transition-colors duration-300"
              >
                View Treatment Menu
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="max-w-7xl mx-auto px-6 w-full mt-12"
        >
          <div className="border-t border-white/[0.08] pt-5">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
              {[
                "Qualified Practitioners",
                "5.0 Google Rating",
                "Same-Week Availability",
                "Klarna Available",
              ].map((t, i) => (
                <div key={t} className="flex items-center gap-3">
                  {i > 0 && <span className="hidden sm:block w-px h-3 bg-white/10" />}
                  <span className="font-body text-[10px] text-white/25 tracking-[0.15em] uppercase">
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
