import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, ChevronRight, ChevronLeft, Tag, Sparkles, Check, ArrowRight } from "lucide-react";
import { format, addDays, isBefore, startOfDay, parse } from "date-fns";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";

type Treatment = {
  id: string;
  name: string;
  slug: string;
  category: string;
  duration_mins: number;
  price: number;
  deposit_amount: number;
  deposit_required: boolean;
  payment_type: string;
  description: string | null;
};

type Availability = {
  day_of_week: number;
  start_time: string;
  end_time: string;
  slot_duration_mins: number;
  is_available: boolean;
};

const STEPS = ["Treatment", "Date & Time", "Your Details", "Payment"];

// Map treatment categories to their info page routes
const CATEGORY_ROUTES: Record<string, string> = {
  "Lip Fillers": "/treatments/lip-fillers-manchester",
  "Anti-Wrinkle": "/treatments/anti-wrinkle-injections-manchester",
  "Dermal Filler": "/treatments/dermal-filler-manchester",
  "HydraFacial": "/treatments/hydrafacial-manchester",
  "Chemical Peels": "/treatments/chemical-peels-manchester",
  "Skin Boosters": "/treatments/skin-boosters-manchester",
  "Fat Dissolve": "/treatments/fat-dissolving-manchester",
  "Microneedling": "/treatments/microneedling-manchester",
};

const BookingSystem = () => {
  const [step, setStep] = useState(0);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [existingBookings, setExistingBookings] = useState<{ booking_date: string; booking_time: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Booking state
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [discountResult, setDiscountResult] = useState<{ valid: boolean; discountAmount: number; discountValue: number; discountType: string } | null>(null);
  const [discountError, setDiscountError] = useState("");
  const [paymentMode, setPaymentMode] = useState<"deposit" | "full">("full");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [treatRes, availRes, blockedRes, bookingsRes] = await Promise.all([
      supabase.from("treatments").select("*").eq("active", true).order("sort_order"),
      supabase.from("availability").select("*"),
      supabase.from("blocked_dates").select("blocked_date"),
      supabase.from("bookings").select("booking_date, booking_time").in("status", ["pending", "confirmed"]),
    ]);
    if (treatRes.data) setTreatments(treatRes.data as Treatment[]);
    if (availRes.data) setAvailability(availRes.data as Availability[]);
    if (blockedRes.data) setBlockedDates(blockedRes.data.map((d: { blocked_date: string }) => d.blocked_date));
    if (bookingsRes.data) setExistingBookings(bookingsRes.data);
    setLoading(false);
  };

  const categories = useMemo(() => {
    const cats = [...new Set(treatments.map((t) => t.category))];
    return cats.sort();
  }, [treatments]);

  const filteredTreatments = selectedCategory
    ? treatments.filter((t) => t.category === selectedCategory)
    : treatments;

  // Generate available dates (next 30 days)
  const availableDates = useMemo(() => {
    const dates: Date[] = [];
    const today = startOfDay(new Date());
    for (let i = 1; i <= 30; i++) {
      const date = addDays(today, i);
      const dayOfWeek = date.getDay();
      const avail = availability.find((a) => a.day_of_week === dayOfWeek);
      const dateStr = format(date, "yyyy-MM-dd");
      if (avail?.is_available && !blockedDates.includes(dateStr)) {
        dates.push(date);
      }
    }
    return dates;
  }, [availability, blockedDates]);

  // Generate time slots for selected date
  const timeSlots = useMemo(() => {
    if (!selectedDate || !selectedTreatment) return [];
    const dayOfWeek = selectedDate.getDay();
    const avail = availability.find((a) => a.day_of_week === dayOfWeek);
    if (!avail || !avail.is_available) return [];

    const slots: string[] = [];
    const [startH, startM] = avail.start_time.split(":").map(Number);
    const [endH, endM] = avail.end_time.split(":").map(Number);
    const startMins = startH * 60 + startM;
    const endMins = endH * 60 + endM;
    const duration = selectedTreatment.duration_mins;
    const dateStr = format(selectedDate, "yyyy-MM-dd");

    for (let m = startMins; m + duration <= endMins; m += 30) {
      const h = Math.floor(m / 60);
      const min = m % 60;
      const timeStr = `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
      // Check if slot is taken
      const taken = existingBookings.some(
        (b) => b.booking_date === dateStr && b.booking_time === `${timeStr}:00`
      );
      if (!taken) slots.push(timeStr);
    }
    return slots;
  }, [selectedDate, selectedTreatment, availability, existingBookings]);

  const totalPrice = useMemo(() => {
    if (!selectedTreatment) return 0;
    const base = Number(selectedTreatment.price);
    const discount = discountResult?.valid ? discountResult.discountAmount : 0;
    return Math.max(0, base - discount);
  }, [selectedTreatment, discountResult]);

  const chargeAmount = useMemo(() => {
    if (!selectedTreatment) return 0;
    if (paymentMode === "deposit" && selectedTreatment.deposit_required) {
      return Number(selectedTreatment.deposit_amount);
    }
    return totalPrice;
  }, [selectedTreatment, paymentMode, totalPrice]);

  const applyDiscount = async () => {
    if (!discountCode.trim() || !selectedTreatment) return;
    setDiscountError("");
    setDiscountResult(null);

    const { data, error } = await supabase.functions.invoke("validate-discount", {
      body: {
        code: discountCode.trim(),
        treatmentId: selectedTreatment.id,
        treatmentPrice: selectedTreatment.price,
      },
    });

    if (error) {
      setDiscountError("Failed to validate code");
      return;
    }
    if (data.valid) {
      setDiscountResult(data);
    } else {
      setDiscountError(data.error || "Invalid code");
    }
  };

  const handleBooking = async () => {
    if (!selectedTreatment || !selectedDate || !selectedTime || !customerName || !customerEmail) return;
    setSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke("create-booking-checkout", {
        body: {
          treatmentId: selectedTreatment.id,
          bookingDate: format(selectedDate, "yyyy-MM-dd"),
          bookingTime: selectedTime,
          customerName,
          customerEmail,
          customerPhone,
          paymentMode,
          discountCode: discountResult?.valid ? discountCode : undefined,
          notes,
        },
      });

      if (error) throw new Error("Failed to create booking");
      if (data.error) throw new Error(data.error);

      if (data.free) {
        // Free consultation — redirect to success
        window.location.href = `/booking-success?booking_id=${data.bookingId}&free=true`;
      } else if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 0: return !!selectedTreatment;
      case 1: return !!selectedDate && !!selectedTime;
      case 2: return customerName.trim().length > 1 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail) && customerPhone.trim().length >= 10;
      case 3: return true;
      default: return false;
    }
  };

  if (loading) {
    return (
      <Layout>
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-secondary rounded w-48 mx-auto mb-4" />
              <div className="h-4 bg-secondary rounded w-64 mx-auto" />
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-12">
            <h1 className="font-display text-5xl md:text-6xl mb-4">Book Your Treatment</h1>
            <p className="font-body text-muted-foreground">Secure your appointment online with instant confirmation.</p>
          </motion.div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-12">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-body text-xs transition-colors ${
                  i < step ? "bg-gold text-white" : i === step ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"
                }`}>
                  {i < step ? <Check size={14} /> : i + 1}
                </div>
                <span className={`font-body text-xs hidden sm:block ${i === step ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
                {i < STEPS.length - 1 && <ChevronRight size={14} className="text-muted-foreground" />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Treatment Selection */}
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex flex-wrap gap-2 mb-8 justify-center">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-4 py-2 font-body text-xs tracking-wider uppercase border transition-colors ${!selectedCategory ? "bg-foreground text-background border-foreground" : "border-border hover:border-gold"}`}
                  >
                    All
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 font-body text-xs tracking-wider uppercase border transition-colors ${selectedCategory === cat ? "bg-foreground text-background border-foreground" : "border-border hover:border-gold"}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredTreatments.map((t) => (
                    <div
                      key={t.id}
                      className={`text-left p-5 border transition-all ${
                        selectedTreatment?.id === t.id
                          ? "border-gold bg-gold/5"
                          : "border-border hover:border-gold/50"
                      }`}
                    >
                      <button
                        onClick={() => {
                          setSelectedTreatment(t);
                          setPaymentMode(t.deposit_required ? "deposit" : "full");
                        }}
                        className="w-full text-left"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-display text-lg">{t.name}</h3>
                            <p className="font-body text-xs text-muted-foreground mt-1">{t.duration_mins} mins</p>
                          </div>
                          <div className="text-right">
                            <p className="font-display text-lg">
                              {Number(t.price) === 0 ? "Free" : `£${Number(t.price).toFixed(0)}`}
                            </p>
                            {t.deposit_required && (
                              <p className="font-body text-xs text-gold">£{Number(t.deposit_amount).toFixed(0)} deposit</p>
                            )}
                          </div>
                        </div>
                      </button>
                      <div className="flex items-center justify-between mt-2">
                        {t.slug && (
                          <a href={`/treatments/${t.slug}`} className="font-body text-xs text-gold hover:underline transition-colors" target="_blank" rel="noopener noreferrer">
                            More info →
                          </a>
                        )}
                        {selectedTreatment?.id === t.id && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1 text-gold ml-auto">
                            <Check size={14} />
                            <span className="font-body text-xs">Selected</span>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Date & Time */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Date Selection */}
                  <div>
                    <h3 className="font-display text-xl mb-4 flex items-center gap-2">
                      <Calendar size={18} /> Choose a Date
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      {availableDates.map((date) => (
                        <button
                          key={date.toISOString()}
                          onClick={() => { setSelectedDate(date); setSelectedTime(null); }}
                          className={`p-3 border text-center transition-all ${
                            selectedDate?.toDateString() === date.toDateString()
                              ? "border-gold bg-gold/5"
                              : "border-border hover:border-gold/50"
                          }`}
                        >
                          <p className="font-body text-xs text-muted-foreground">{format(date, "EEE")}</p>
                          <p className="font-display text-lg">{format(date, "d")}</p>
                          <p className="font-body text-xs text-muted-foreground">{format(date, "MMM")}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Selection */}
                  <div>
                    <h3 className="font-display text-xl mb-4 flex items-center gap-2">
                      <Clock size={18} /> Choose a Time
                    </h3>
                    {selectedDate ? (
                      timeSlots.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2">
                          {timeSlots.map((time) => (
                            <button
                              key={time}
                              onClick={() => setSelectedTime(time)}
                              className={`py-3 px-4 border font-body text-sm transition-all ${
                                selectedTime === time
                                  ? "border-gold bg-gold/5"
                                  : "border-border hover:border-gold/50"
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="font-body text-sm text-muted-foreground">No available slots on this date.</p>
                      )
                    ) : (
                      <p className="font-body text-sm text-muted-foreground">Select a date first.</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Customer Details */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="max-w-lg mx-auto space-y-6">
                  <div>
                    <label className="font-body text-sm block mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full border border-border bg-transparent px-4 py-3 font-body text-sm focus:border-gold focus:outline-none transition-colors"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="font-body text-sm block mb-2">Email Address *</label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full border border-border bg-transparent px-4 py-3 font-body text-sm focus:border-gold focus:outline-none transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="font-body text-sm block mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full border border-border bg-transparent px-4 py-3 font-body text-sm focus:border-gold focus:outline-none transition-colors"
                      placeholder="07XXX XXXXXX"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-body text-sm block mb-2">Notes (optional)</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="w-full border border-border bg-transparent px-4 py-3 font-body text-sm focus:border-gold focus:outline-none transition-colors resize-none"
                      placeholder="Any allergies, preferences, or things we should know..."
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Payment Summary */}
            {step === 3 && selectedTreatment && selectedDate && selectedTime && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="max-w-lg mx-auto">
                  {/* Booking Summary */}
                  <div className="border border-border p-6 mb-6">
                    <h3 className="font-display text-xl mb-4">Booking Summary</h3>
                    <div className="space-y-3 font-body text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Treatment</span>
                        <span>{selectedTreatment.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date</span>
                        <span>{format(selectedDate, "EEEE, d MMMM yyyy")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Time</span>
                        <span>{selectedTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration</span>
                        <span>{selectedTreatment.duration_mins} minutes</span>
                      </div>
                      <div className="border-t border-border pt-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Treatment Price</span>
                          <span>£{Number(selectedTreatment.price).toFixed(2)}</span>
                        </div>
                        {discountResult?.valid && (
                          <div className="flex justify-between text-gold">
                            <span>Discount</span>
                            <span>-£{discountResult.discountAmount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-semibold mt-2 text-lg">
                          <span>Total</span>
                          <span>£{totalPrice.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Discount Code */}
                  {totalPrice > 0 && (
                    <div className="mb-6">
                      <label className="font-body text-sm block mb-2 flex items-center gap-2">
                        <Tag size={14} /> Discount Code
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={discountCode}
                          onChange={(e) => { setDiscountCode(e.target.value); setDiscountError(""); setDiscountResult(null); }}
                          className="flex-1 border border-border bg-transparent px-4 py-3 font-body text-sm uppercase focus:border-gold focus:outline-none transition-colors"
                          placeholder="Enter code"
                        />
                        <button
                          onClick={applyDiscount}
                          className="px-6 py-3 bg-foreground text-background font-body text-sm tracking-wider uppercase hover:bg-accent transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                      {discountError && <p className="font-body text-xs text-destructive mt-2">{discountError}</p>}
                      {discountResult?.valid && (
                        <p className="font-body text-xs text-gold mt-2">
                          ✓ {discountResult.discountType === "percentage" ? `${discountResult.discountValue}%` : `£${discountResult.discountValue}`} discount applied
                        </p>
                      )}
                    </div>
                  )}

                  {/* Payment Mode */}
                  {selectedTreatment.deposit_required && totalPrice > 0 && (
                    <div className="mb-6">
                      <label className="font-body text-sm block mb-3">Payment Option</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setPaymentMode("deposit")}
                          className={`p-4 border text-left transition-all ${
                            paymentMode === "deposit" ? "border-gold bg-gold/5" : "border-border hover:border-gold/50"
                          }`}
                        >
                          <p className="font-display text-base">Pay Deposit</p>
                          <p className="font-body text-xs text-muted-foreground mt-1">
                            £{Number(selectedTreatment.deposit_amount).toFixed(0)} now, rest at appointment
                          </p>
                        </button>
                        <button
                          onClick={() => setPaymentMode("full")}
                          className={`p-4 border text-left transition-all ${
                            paymentMode === "full" ? "border-gold bg-gold/5" : "border-border hover:border-gold/50"
                          }`}
                        >
                          <p className="font-display text-base">Pay in Full</p>
                          <p className="font-body text-xs text-muted-foreground mt-1">
                            £{totalPrice.toFixed(0)} — nothing to pay later
                          </p>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Pay Now Amount */}
                  {totalPrice > 0 && (
                    <div className="border border-gold bg-gold/5 p-4 mb-6 text-center">
                      <p className="font-body text-sm text-muted-foreground">Amount to pay now</p>
                      <p className="font-display text-3xl text-gold">£{chargeAmount.toFixed(2)}</p>
                      {paymentMode === "deposit" && selectedTreatment.deposit_required && (
                        <p className="font-body text-xs text-muted-foreground mt-1">
                          Remaining £{(totalPrice - chargeAmount).toFixed(2)} due at your appointment
                        </p>
                      )}
                    </div>
                  )}

                  {/* Book Button */}
                  <button
                    onClick={handleBooking}
                    disabled={submitting}
                    className="w-full py-4 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-accent transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <span className="animate-pulse">Processing...</span>
                    ) : totalPrice === 0 ? (
                      <>Confirm Free Booking <ArrowRight size={14} /></>
                    ) : (
                      <>Proceed to Secure Payment <ArrowRight size={14} /></>
                    )}
                  </button>

                  <p className="font-body text-xs text-muted-foreground text-center mt-4">
                    Payments are processed securely via Stripe. Your card details are never stored on our servers.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-10">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              className={`flex items-center gap-2 font-body text-sm tracking-wider uppercase hover:text-gold transition-colors ${step === 0 ? "invisible" : ""}`}
            >
              <ChevronLeft size={14} /> Back
            </button>
            {step < 3 && (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-8 py-3 bg-foreground text-background font-body text-sm tracking-wider uppercase hover:bg-accent transition-colors disabled:opacity-30"
              >
                Continue <ChevronRight size={14} />
              </button>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BookingSystem;
