import { motion } from "framer-motion";
import { ArrowUpRight, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { trackBookNow } from "@/hooks/use-tracking";

const FinalCTA = () => (
  <section className="relative section-y bg-ink text-bone overflow-hidden bg-noise" aria-label="Book your appointment">
    <div className="absolute inset-0 opacity-30 pointer-events-none">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[640px] rounded-full bg-aubergine blur-[160px]" />
    </div>

    <div className="relative container-edit max-w-3xl text-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <p className="eyebrow text-champagne mb-6">Ready when you are</p>
        <h2 className="font-display text-5xl md:text-7xl text-bone mb-8 leading-[1.02] tracking-tight">
          Book your <span className="display-italic text-champagne">moment.</span>
        </h2>
        <p className="font-body text-base text-bone/55 mb-12 max-w-md mx-auto leading-[1.75]">
          Same-week appointments often available. Free phone consultations. Treatments tailored to fit your life.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
          <Link
            to="/bookings"
            onClick={() => trackBookNow("home_final")}
            className="btn-champagne group inline-flex items-center gap-3 px-10 py-4 font-body text-[11px] tracking-[0.3em] uppercase"
          >
            Book Treatment
            <ArrowUpRight size={14} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={1.5} />
          </Link>
          <a
            href="tel:+447795008114"
            className="inline-flex items-center gap-3 px-10 py-4 border border-bone/15 text-bone/80 font-body text-[11px] tracking-[0.3em] uppercase hover:border-champagne hover:text-champagne transition-colors"
          >
            <Phone size={13} strokeWidth={1.5} /> Free Consultation
          </a>
        </div>

        <div className="border-t border-bone/[0.08] pt-6">
          <p className="font-body text-[11px] text-bone/40 tracking-[0.22em] uppercase">
            25 Saint John Street / Manchester M3 4DT / Klarna / Clearpay
          </p>
        </div>
      </motion.div>
    </div>
  </section>
);

export default FinalCTA;
