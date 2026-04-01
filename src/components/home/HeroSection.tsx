import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const SETMORE_CONSULTATION = "https://hiveclinicuk.setmore.com/book?step=date-time&products=745f4a19-36cf-403c-8f7e-608f494585db&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=true";

interface HeroSectionProps {
  heroImg: string;
}

const HeroSection = ({ heroImg }: HeroSectionProps) => {
  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.08]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0.6]);

  return (
    <section className="relative h-screen overflow-hidden">
      <motion.div className="absolute inset-0" style={{ scale: heroScale, opacity: heroOpacity }}>
        <img
          src={heroImg}
          alt="Hive Clinic - Premium Aesthetics Manchester"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent md:bg-gradient-to-t md:from-black/70 md:via-black/30 md:to-black/5" />
      </motion.div>

      <div className="relative z-10 h-full flex flex-col justify-end pb-12 md:pb-20">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl"
          >
            <div className="flex items-center gap-2 mb-5">
              <MapPin size={11} className="text-gold" strokeWidth={1.5} />
              <p className="font-body text-[10px] tracking-[0.3em] uppercase text-white/50">
                Deansgate, Manchester
              </p>
            </div>

            <h1 className="font-display text-[clamp(2.2rem,6.5vw,4.5rem)] text-white leading-[1.02] mb-5">
              Advanced aesthetics, <br className="hidden md:block" />
              <span className="italic text-gold">naturally</span> refined.
            </h1>

            <p className="font-body text-sm md:text-base text-white/50 leading-relaxed mb-8 max-w-md">
              Medically-led treatments by qualified prescribers in Manchester City Centre. Natural results you will love.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={SETMORE_CONSULTATION}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-gold text-white font-body text-[11px] tracking-[0.2em] uppercase hover:bg-gold-dark transition-colors duration-300"
              >
                Book Free Phone Consultation
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <Link
                to="/bookings"
                className="inline-flex items-center justify-center gap-3 px-8 py-3.5 border border-white/15 text-white font-body text-[11px] tracking-[0.2em] uppercase hover:border-white/40 transition-colors duration-300"
              >
                View Menu
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Trust bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="max-w-7xl mx-auto px-6 w-full mt-10"
        >
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
            {["Qualified Prescribers", "5-Star Google Rated", "Same-Week Availability", "Premium Products Only"].map((t) => (
              <span key={t} className="font-body text-[10px] text-white/30 tracking-[0.12em] uppercase">
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
