import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Calendar, Clock, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";

const BookingSuccess = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("booking_id");
  const sessionId = searchParams.get("session_id");
  const isFree = searchParams.get("free") === "true";
  const [booking, setBooking] = useState<any>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isFree && bookingId) {
      setConfirmed(true);
      return;
    }
    if (bookingId && sessionId) {
      confirmBooking();
    }
  }, [bookingId, sessionId, isFree]);

  const confirmBooking = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("confirm-booking", {
        body: { bookingId, sessionId },
      });
      if (error || data?.error) {
        setError(data?.error || "Failed to confirm booking");
        return;
      }
      setBooking(data.booking);
      setConfirmed(true);
    } catch (e) {
      setError("Something went wrong confirming your booking.");
    }
  };

  return (
    <Layout>
      <section className="py-24">
        <div className="max-w-lg mx-auto px-6 text-center">
          {confirmed ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
                <Check size={36} className="text-gold" />
              </div>
              <h1 className="font-display text-4xl md:text-5xl mb-4">Booking Confirmed!</h1>
              <p className="font-body text-muted-foreground mb-8">
                Thank you for booking with Hive Clinic. A confirmation email has been sent to your inbox.
              </p>

              {booking && (
                <div className="border border-border p-6 text-left mb-8">
                  <h3 className="font-display text-lg mb-4">Your Appointment</h3>
                  <div className="space-y-3 font-body text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Treatment</span>
                      <span>{booking.treatment}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-1"><Calendar size={12} /> Date</span>
                      <span>{booking.date}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-1"><Clock size={12} /> Time</span>
                      <span>{booking.time}</span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-3">
                      <span className="text-muted-foreground">Payment</span>
                      <span className="text-gold capitalize">{booking.paymentStatus?.replace("_", " ")}</span>
                    </div>
                    {booking.paymentStatus === "deposit_paid" && (
                      <p className="text-xs text-muted-foreground">
                        Remaining £{(Number(booking.totalPrice) - Number(booking.depositAmount)).toFixed(2)} due at your appointment.
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/" className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-accent transition-colors">
                  Back to Home <ArrowRight size={14} />
                </Link>
                <a
                  href="https://wa.me/447795008114"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-border font-body text-sm tracking-widest uppercase hover:border-gold transition-colors"
                >
                  Message Us
                </a>
              </div>
            </motion.div>
          ) : error ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="font-display text-4xl mb-4">Something Went Wrong</h1>
              <p className="font-body text-muted-foreground mb-6">{error}</p>
              <Link to="/bookings" className="inline-flex items-center gap-2 font-body text-sm text-gold hover:text-foreground transition-colors">
                Try booking again <ArrowRight size={14} />
              </Link>
            </motion.div>
          ) : (
            <div className="animate-pulse">
              <div className="w-20 h-20 rounded-full bg-secondary mx-auto mb-6" />
              <div className="h-8 bg-secondary rounded w-48 mx-auto mb-4" />
              <div className="h-4 bg-secondary rounded w-64 mx-auto" />
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default BookingSuccess;
