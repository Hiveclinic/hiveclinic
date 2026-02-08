import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";

const BookingCancelled = () => {
  return (
    <Layout>
      <section className="py-24">
        <div className="max-w-lg mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
              <X size={36} className="text-muted-foreground" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl mb-4">Booking Cancelled</h1>
            <p className="font-body text-muted-foreground mb-8">
              Your payment wasn't completed and no booking has been made. You haven't been charged.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/bookings" className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-accent transition-colors">
                Try Again <ArrowRight size={14} />
              </Link>
              <a
                href="https://wa.me/447795008114"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-border font-body text-sm tracking-widest uppercase hover:border-gold transition-colors"
              >
                Need Help?
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default BookingCancelled;
