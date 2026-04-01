import { Link } from "react-router-dom";
import { Camera, ArrowRight } from "lucide-react";

const ModelCTA = () => (
  <section className="py-16">
    <div className="max-w-7xl mx-auto px-6">
      <div className="relative border border-gold/30 bg-foreground text-background p-8 md:p-12 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <Camera size={20} className="text-gold flex-shrink-0 mt-1" strokeWidth={1.5} />
            <div>
              <h3 className="font-display text-2xl md:text-3xl mb-2">
                Become a Content Model
              </h3>
              <p className="font-body text-sm text-background/70 max-w-md">
                Get exclusive reduced pricing on selected treatments in exchange for featuring in our photo and video content.
              </p>
            </div>
          </div>
          <Link
            to="/content-models"
            className="inline-flex items-center gap-2 px-8 py-3 border border-gold text-gold font-body text-xs tracking-widest uppercase hover:bg-gold hover:text-foreground transition-colors flex-shrink-0"
          >
            View Model Pricing <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default ModelCTA;
