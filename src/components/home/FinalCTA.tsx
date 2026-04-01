import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import klarnaLogo from "@/assets/klarna-logo.png";
import clearpayLogo from "@/assets/clearpay-logo.png";

const SETMORE_CONSULTATION = "https://hiveclinicuk.setmore.com/book?products=745f4a19-36cf-403c-8f7e-608f494585db&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false";

const FinalCTA = () => {
  return (
    <section className="relative py-24 md:py-32 bg-foreground text-background overflow-hidden">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 opacity-[0.04]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold blur-[120px]" />
      </div>

      <div className="relative max-w-2xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-gold mb-5">Get Started</p>
          <h2 className="font-display text-3xl md:text-5xl text-background mb-5 leading-tight">
            Your journey starts with a conversation.
          </h2>
          <p className="font-body text-sm text-background/40 mb-8 max-w-md mx-auto leading-relaxed">
            Book a free phone consultation - no obligation, just a friendly chat about your goals with our team.
          </p>
          <a
            href={SETMORE_CONSULTATION}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-10 py-4 bg-gold text-white font-body text-[11px] tracking-[0.2em] uppercase hover:bg-gold-dark transition-colors duration-300"
          >
            Book Free Phone Consultation
            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </a>

          <div className="flex items-center justify-center gap-2 mt-8 mb-10">
            <MapPin size={11} className="text-background/30" strokeWidth={1.5} />
            <p className="font-body text-[10px] text-background/30 tracking-[0.1em]">25 Saint John Street, Manchester M3 4DT</p>
          </div>

          <div className="flex items-center justify-center gap-6 pt-6 border-t border-white/[0.06]">
            <span className="font-body text-[10px] text-background/20 tracking-[0.15em] uppercase">Pay in instalments</span>
            <img src={klarnaLogo} alt="Klarna" className="h-4 opacity-30" />
            <img src={clearpayLogo} alt="Clearpay" className="h-4 opacity-30" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
