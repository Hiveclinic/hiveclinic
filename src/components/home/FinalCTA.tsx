import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import klarnaLogo from "@/assets/klarna-logo.png";
import clearpayLogo from "@/assets/clearpay-logo.png";

const SETMORE_CONSULTATION = "https://hiveclinicuk.setmore.com/book?step=additional-products&products=745f4a19-36cf-403c-8f7e-608f494585db&type=service&staff=0a5b72c9-c493-414f-9822-50a8b097701e&staffSelected=false";

const FinalCTA = () => (
  <section className="relative py-24 md:py-32 bg-foreground text-background overflow-hidden" aria-label="Book a consultation">
    <div className="absolute inset-0 opacity-[0.03]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gold blur-[150px]" />
    </div>

    <div className="relative max-w-3xl mx-auto px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <p className="font-body text-[10px] tracking-[0.3em] uppercase text-gold mb-6">Get Started</p>
        <h2 className="font-display text-3xl md:text-5xl text-background mb-6 leading-tight">
          Your journey starts with a conversation.
        </h2>
        <p className="font-body text-[15px] text-background/35 mb-10 max-w-md mx-auto leading-[1.7]">
          Book a consultation to discuss your goals — no pressure, no obligation. Just expert advice tailored to you.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
          <a
            href={SETMORE_CONSULTATION}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-10 py-4 bg-gold text-white font-body text-[11px] tracking-[0.2em] uppercase hover:bg-gold-dark transition-colors duration-300"
          >
            Book Consultation
            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <Link
            to="/bookings"
            className="inline-flex items-center gap-3 px-10 py-4 border border-white/10 text-background/60 font-body text-[11px] tracking-[0.2em] uppercase hover:border-white/25 hover:text-background transition-colors duration-300"
          >
            Browse Treatments
          </Link>
        </div>

        <div className="border-t border-white/[0.06] pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <p className="font-body text-[10px] text-background/15 tracking-[0.12em]">
              25 Saint John Street, Manchester M3 4DT
            </p>
            <div className="flex items-center gap-4">
              <span className="font-body text-[10px] text-background/15 tracking-[0.15em] uppercase">Pay in instalments</span>
              <img src={klarnaLogo} alt="Klarna" className="h-3.5 opacity-20" />
              <img src={clearpayLogo} alt="Clearpay" className="h-3.5 opacity-20" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default FinalCTA;
