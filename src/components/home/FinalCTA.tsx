import { motion } from "framer-motion";
import { ArrowUpRight, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { trackBookNow } from "@/hooks/use-tracking";

const FinalCTA = () => (
  <section className="relative py-28 md:py-36 bg-ink text-bone overflow-hidden bg-noise" aria-label="Book your glow">
    {/* Burgundy glow */}
    <div className="absolute inset-0 opacity-40 pointer-events-none">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-burgundy blur-[180px]" />
    </div>
    <p
      className="absolute -bottom-12 left-1/2 -translate-x-1/2 font-script italic text-[22vw] leading-none text-rose/[0.06] select-none pointer-events-none whitespace-nowrap"
      aria-hidden
    >
      glow
    </p>

    <div className="relative max-w-3xl mx-auto px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <p className="eyebrow text-rose mb-6">Ready when you are</p>
        <h2 className="font-display text-5xl md:text-7xl text-bone mb-8 leading-[1.02]">
          Book your <span className="font-script italic text-rose">glow.</span>
        </h2>
        <p className="font-body text-base text-bone/55 mb-12 max-w-md mx-auto leading-[1.7]">
          Same-week appointments often available. Free consultations by phone. We'll plan it around your life.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
          <Link
            to="/bookings#book"
            onClick={() => trackBookNow("home_final")}
            className="btn-burgundy group inline-flex items-center gap-3 px-10 py-4 font-body text-[11px] tracking-[0.28em] uppercase"
          >
            Book Treatment
            <ArrowUpRight size={14} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <a
            href="tel:+441612730000"
            className="inline-flex items-center gap-3 px-10 py-4 border border-bone/15 text-bone/80 font-body text-[11px] tracking-[0.28em] uppercase hover:border-rose hover:text-rose transition-colors"
          >
            <Phone size={13} /> Free Consultation
          </a>
        </div>

        <div className="border-t border-bone/[0.08] pt-6">
          <p className="font-body text-[11px] text-bone/40 tracking-[0.18em] uppercase">
            25 Saint John Street · Manchester M3 4DT · Klarna · Clearpay
          </p>
        </div>
      </motion.div>
    </div>
  </section>
);

export default FinalCTA;
