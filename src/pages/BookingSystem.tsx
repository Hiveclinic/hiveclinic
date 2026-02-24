import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, ChevronRight, ChevronLeft, Tag, Plus, Check, ArrowRight, Sparkles, ChevronDown, X, Package } from "lucide-react";
import { format, addDays, startOfDay } from "date-fns";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
  on_offer: boolean;
  offer_price: number | null;
  offer_label: string | null;
};

type Addon = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration_mins: number;
  applicable_categories: string[] | null;
};

type Availability = {
  day_of_week: number;
  start_time: string;
  end_time: string;
  slot_duration_mins: number;
  is_available: boolean;
};

type TreatmentPackage = {
  id: string;
  name: string;
  treatment_id: string;
  sessions_count: number;
  total_price: number;
  price_per_session: number;
  valid_days: number;
};

const STEPS = ["Treatments", "Date & Time", "Your Details", "Payment"];

const CATEGORY_ROUTES: Record<string, string> = {
  "Lip Fillers": "/treatments/lip-fillers-manchester",
  "Anti-Wrinkle": "/treatments/anti-wrinkle-injections-manchester",
  "Dermal Filler": "/treatments/dermal-filler-manchester",
  "HydraFacial": "/treatments/hydrafacial-manchester",
  "Chemical Peels": "/treatments/chemical-peels-manchester",
  "Skin Boosters": "/treatments/skin-boosters-manchester",
  "Fat Dissolve": "/treatments/fat-dissolving-manchester",
  "Microneedling": "/treatments/microneedling-manchester",
  "Dermaplaning": "/treatments/dermaplaning-manchester",
  "LED Light Therapy": "/treatments/led-light-therapy-manchester",
  "Mesotherapy": "/treatments/mesotherapy-manchester",
  "PRP": "/treatments/prp-manchester",
  "Facial Balancing": "/treatments/facial-balancing-manchester",
  "Micro Sclerotherapy": "/treatments/micro-sclerotherapy-manchester",
  "Consultations": "/treatments/consultations",
  "Intimate & Body Peels": "/treatments/intimate-peels-manchester",
};

const POPULAR_SLUGS = ["lip-filler-05ml", "anti-wrinkle-2-areas", "glass-skin-boost", "dermal-filler-lips-1ml", "profhilo"];

const BookingSystem = () => {
  const [step, setStep] = useState(0);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [addons, setAddons] = useState<Addon[]>([]);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [existingBookings, setExistingBookings] = useState<{ booking_date: string; booking_time: string }[]>([]);
  const [packages, setPackages] = useState<TreatmentPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Multi-treatment selection
  const [selectedTreatments, setSelectedTreatments] = useState<Treatment[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
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
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [addonsOpen, setAddonsOpen] = useState(false);
  const [showCoursePrompt, setShowCoursePrompt] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const [treatRes, availRes, blockedRes, bookingsRes, addonsRes, packagesRes] = await Promise.all([
      supabase.from("treatments").select("*").eq("active", true).order("sort_order"),
      supabase.from("availability").select("*"),
      supabase.from("blocked_dates").select("blocked_date"),
      supabase.from("bookings").select("booking_date, booking_time").in("status", ["pending", "confirmed"]),
      supabase.from("treatment_addons").select("*").eq("active", true).order("sort_order"),
      supabase.from("treatment_packages").select("*").eq("active", true).order("sort_order"),
    ]);
    if (treatRes.data) setTreatments(treatRes.data as Treatment[]);
    if (availRes.data) setAvailability(availRes.data as Availability[]);
    if (blockedRes.data) setBlockedDates(blockedRes.data.map((d: { blocked_date: string }) => d.blocked_date));
    if (bookingsRes.data) setExistingBookings(bookingsRes.data);
    if (addonsRes.data) setAddons(addonsRes.data as Addon[]);
    if (packagesRes.data) setPackages(packagesRes.data as TreatmentPackage[]);
    setLoading(false);
  };

  const categories = useMemo(() => {
    const cats = [...new Set(treatments.map((t) => t.category))];
    return cats.sort();
  }, [treatments]);

  const popularTreatments = useMemo(() => {
    return treatments.filter(t => POPULAR_SLUGS.includes(t.slug)).slice(0, 5);
  }, [treatments]);

  const categoryTreatments = useMemo(() => {
    if (!expandedCategory) return [];
    return treatments.filter(t => t.category === expandedCategory);
  }, [treatments, expandedCategory]);

  // Primary treatment for addon filtering
  const primaryTreatment = selectedTreatments[0] || null;

  const applicableAddons = useMemo(() => {
    if (!primaryTreatment) return [];
    const selectedCategories = [...new Set(selectedTreatments.map(t => t.category))];
    return addons.filter(a => {
      if (!a.applicable_categories || a.applicable_categories.length === 0) return true;
      return selectedCategories.some(c => a.applicable_categories!.includes(c));
    });
  }, [selectedTreatments, addons, primaryTreatment]);

  // Course suggestions for selected treatments
  const courseSuggestions = useMemo(() => {
    if (selectedTreatments.length === 0) return [];
    const suggestions: { treatment: Treatment; pkg: TreatmentPackage; savings: number; singleTotal: number }[] = [];
    for (const t of selectedTreatments) {
      const treatmentPackages = packages.filter(p => p.treatment_id === t.id);
      for (const pkg of treatmentPackages) {
        const singleTotal = Number(t.price) * pkg.sessions_count;
        const savings = singleTotal - Number(pkg.total_price);
        if (savings > 0) {
          suggestions.push({ treatment: t, pkg, savings, singleTotal });
        }
      }
    }
    return suggestions;
  }, [selectedTreatments, packages]);

  const toggleAddon = (id: string) => {
    setSelectedAddons(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  const addonsTotal = useMemo(() => {
    return selectedAddons.reduce((sum, id) => {
      const addon = addons.find(a => a.id === id);
      return sum + (addon ? addon.price : 0);
    }, 0);
  }, [selectedAddons, addons]);

  const addonsDuration = useMemo(() => {
    return selectedAddons.reduce((sum, id) => {
      const addon = addons.find(a => a.id === id);
      return sum + (addon ? addon.duration_mins : 0);
    }, 0);
  }, [selectedAddons, addons]);

  const treatmentsTotal = useMemo(() => {
    return selectedTreatments.reduce((sum, t) => {
      const price = t.on_offer && t.offer_price ? Number(t.offer_price) : Number(t.price);
      return sum + price;
    }, 0);
  }, [selectedTreatments]);

  const treatmentsDuration = useMemo(() => {
    return selectedTreatments.reduce((sum, t) => sum + t.duration_mins, 0);
  }, [selectedTreatments]);

  const totalDuration = treatmentsDuration + addonsDuration;

  // Check if any selected treatment requires deposit
  const depositRequired = selectedTreatments.some(t => t.deposit_required);
  const totalDeposit = selectedTreatments.reduce((sum, t) => t.deposit_required ? sum + Number(t.deposit_amount) : sum, 0);

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

  const timeSlots = useMemo(() => {
    if (!selectedDate || selectedTreatments.length === 0) return [];
    const dayOfWeek = selectedDate.getDay();
    const avail = availability.find((a) => a.day_of_week === dayOfWeek);
    if (!avail || !avail.is_available) return [];

    const slots: string[] = [];
    const [startH, startM] = avail.start_time.split(":").map(Number);
    const [endH, endM] = avail.end_time.split(":").map(Number);
    const startMins = startH * 60 + startM;
    const endMins = endH * 60 + endM;
    const dateStr = format(selectedDate, "yyyy-MM-dd");

    for (let m = startMins; m + totalDuration <= endMins; m += 30) {
      const h = Math.floor(m / 60);
      const min = m % 60;
      const timeStr = `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
      const taken = existingBookings.some(
        (b) => b.booking_date === dateStr && b.booking_time === `${timeStr}:00`
      );
      if (!taken) slots.push(timeStr);
    }
    return slots;
  }, [selectedDate, selectedTreatments, availability, existingBookings, totalDuration]);

  const totalPrice = useMemo(() => {
    const base = treatmentsTotal + addonsTotal;
    const discount = discountResult?.valid ? discountResult.discountAmount : 0;
    return Math.max(0, base - discount);
  }, [treatmentsTotal, addonsTotal, discountResult]);

  const chargeAmount = useMemo(() => {
    if (selectedTreatments.length === 0) return 0;
    if (paymentMode === "deposit" && depositRequired) {
      return totalDeposit;
    }
    return totalPrice;
  }, [selectedTreatments, paymentMode, totalPrice, depositRequired, totalDeposit]);

  const applyDiscount = async () => {
    if (!discountCode.trim() || selectedTreatments.length === 0) return;
    setDiscountError("");
    setDiscountResult(null);
    const { data, error } = await supabase.functions.invoke("validate-discount", {
      body: { code: discountCode.trim(), treatmentId: primaryTreatment!.id, treatmentPrice: treatmentsTotal + addonsTotal },
    });
    if (error) { setDiscountError("Failed to validate code"); return; }
    if (data.valid) { setDiscountResult(data); } else { setDiscountError(data.error || "Invalid code"); }
  };

  const handleBooking = async () => {
    if (selectedTreatments.length === 0 || !selectedDate || !selectedTime || !customerName || !customerEmail) return;
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-booking-checkout", {
        body: {
          treatmentId: primaryTreatment!.id,
          treatmentIds: selectedTreatments.map(t => t.id),
          bookingDate: format(selectedDate, "yyyy-MM-dd"),
          bookingTime: selectedTime,
          customerName, customerEmail, customerPhone, paymentMode,
          discountCode: discountResult?.valid ? discountCode : undefined,
          notes, addonIds: selectedAddons, addonTotal: addonsTotal,
        },
      });
      if (error) throw new Error("Failed to create booking");
      if (data.error) throw new Error(data.error);
      if (data.free) { window.location.href = `/booking-success?booking_id=${data.bookingId}&free=true`; }
      else if (data.url) { window.location.href = data.url; }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally { setSubmitting(false); }
  };

  const canProceed = () => {
    switch (step) {
      case 0: return selectedTreatments.length > 0;
      case 1: return !!selectedDate && !!selectedTime;
      case 2: return customerName.trim().length > 1 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail) && customerPhone.trim().length >= 10;
      case 3: return true;
      default: return false;
    }
  };

  const toggleTreatment = (t: Treatment) => {
    const isSelected = selectedTreatments.some(s => s.id === t.id);
    if (isSelected) {
      setSelectedTreatments(prev => prev.filter(s => s.id !== t.id));
    } else {
      setSelectedTreatments(prev => [...prev, t]);
    }
    setSelectedAddons([]);
    setAddonsOpen(false);
  };

  const removeTreatment = (id: string) => {
    setSelectedTreatments(prev => prev.filter(t => t.id !== id));
  };

  // When selected treatments change, check for course suggestions
  useEffect(() => {
    if (courseSuggestions.length > 0 && selectedTreatments.length > 0) {
      setShowCoursePrompt(true);
    } else {
      setShowCoursePrompt(false);
    }
  }, [courseSuggestions, selectedTreatments.length]);

  // When first treatment is added, set payment mode
  useEffect(() => {
    if (selectedTreatments.length > 0 && depositRequired) {
      setPaymentMode("deposit");
    } else {
      setPaymentMode("full");
    }
  }, [selectedTreatments, depositRequired]);

  const TreatmentCard = ({ t }: { t: Treatment }) => {
    const isSelected = selectedTreatments.some(s => s.id === t.id);
    const price = t.on_offer && t.offer_price ? Number(t.offer_price) : Number(t.price);
    return (
      <button
        onClick={() => toggleTreatment(t)}
        className={`w-full text-left p-4 border transition-all ${isSelected ? "border-gold bg-gold/5" : "border-border hover:border-gold/40"}`}
      >
        <div className="flex justify-between items-start gap-3">
          <div className="min-w-0 flex-1">
            <h4 className="font-display text-base leading-tight">{t.name}</h4>
            <p className="font-body text-xs text-muted-foreground mt-1">{t.duration_mins} mins</p>
            {t.description && <p className="font-body text-xs text-muted-foreground mt-1 line-clamp-1">{t.description}</p>}
          </div>
          <div className="text-right flex-shrink-0">
            {t.on_offer && t.offer_price ? (
              <div>
                <p className="font-body text-xs line-through text-muted-foreground">£{Number(t.price).toFixed(0)}</p>
                <p className="font-display text-base text-gold">£{Number(t.offer_price).toFixed(0)}</p>
              </div>
            ) : (
              <p className="font-display text-base">{price === 0 ? "Free" : `£${price}`}</p>
            )}
          </div>
        </div>
        {isSelected && (
          <div className="flex items-center gap-1 text-gold mt-2">
            <Check size={12} strokeWidth={1.5} />
            <span className="font-body text-xs">Selected</span>
          </div>
        )}
      </button>
    );
  };

  if (loading) {
    return (
      <Layout>
        <section className="py-24">
          <div className="max-w-3xl mx-auto px-6 text-center">
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
        <div className="max-w-3xl mx-auto px-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl mb-3">Book Your Treatment</h1>
            <p className="font-body text-sm text-muted-foreground">Select one or more treatments. Secure your appointment with instant confirmation.</p>
          </motion.div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-12">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-body text-xs transition-colors ${
                  i < step ? "bg-gold text-white" : i === step ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"
                }`}>
                  {i < step ? <Check size={12} strokeWidth={1.5} /> : i + 1}
                </div>
                <span className={`font-body text-xs hidden sm:block ${i === step ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
                {i < STEPS.length - 1 && <ChevronRight size={12} className="text-muted-foreground" />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Step 0: Treatment Selection */}
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                
                {/* Selected treatments summary chips */}
                {selectedTreatments.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedTreatments.map(t => {
                      const price = t.on_offer && t.offer_price ? Number(t.offer_price) : Number(t.price);
                      return (
                        <div key={t.id} className="flex items-center gap-2 border border-gold bg-gold/5 px-3 py-2">
                          <span className="font-body text-xs">{t.name} · £{price}</span>
                          <button onClick={(e) => { e.stopPropagation(); removeTreatment(t.id); }} className="text-muted-foreground hover:text-foreground">
                            <X size={12} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Course / Package Suggestions */}
                {showCoursePrompt && courseSuggestions.length > 0 && (
                  <div className="border border-gold/40 bg-gold/5 p-5 space-y-3">
                    <div className="flex items-center gap-2">
                      <Package size={16} strokeWidth={1.5} className="text-gold" />
                      <h3 className="font-display text-base">Save with a Course</h3>
                    </div>
                    {courseSuggestions.map(({ treatment, pkg, savings, singleTotal }) => (
                      <div key={pkg.id} className="flex items-start justify-between gap-3 border border-border p-3 bg-background">
                        <div>
                          <p className="font-body text-sm font-medium">{pkg.name}</p>
                          <p className="font-body text-xs text-muted-foreground">
                            {pkg.sessions_count} sessions of {treatment.name}
                          </p>
                          <p className="font-body text-xs text-muted-foreground mt-1">
                            <span className="line-through">£{singleTotal.toFixed(0)}</span>
                            {" → "}
                            <span className="text-gold font-semibold">£{Number(pkg.total_price).toFixed(0)}</span>
                            {" · "}
                            <span className="text-gold">Save £{savings.toFixed(0)}</span>
                          </p>
                        </div>
                        <a
                          href={`/contact?subject=Course%20Enquiry%20-%20${encodeURIComponent(pkg.name)}`}
                          className="px-4 py-2 bg-foreground text-background font-body text-xs tracking-wider uppercase hover:bg-accent transition-colors flex-shrink-0"
                        >
                          Enquire
                        </a>
                      </div>
                    ))}
                    <button onClick={() => setShowCoursePrompt(false)} className="font-body text-xs text-muted-foreground hover:text-foreground">
                      No thanks, continue with single session
                    </button>
                  </div>
                )}

                {/* Most Popular */}
                {popularTreatments.length > 0 && !expandedCategory && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles size={14} strokeWidth={1.5} className="text-gold" />
                      <h3 className="font-display text-lg">Most Popular</h3>
                    </div>
                    <div className="space-y-2">
                      {popularTreatments.map(t => <TreatmentCard key={t.id} t={t} />)}
                    </div>
                  </div>
                )}

                {/* Category Browser */}
                <div>
                  <h3 className="font-display text-lg mb-4">{expandedCategory ? expandedCategory : "Browse by Category"}</h3>
                  
                  {expandedCategory ? (
                    <div>
                      <button onClick={() => setExpandedCategory(null)} className="font-body text-xs text-gold mb-4 flex items-center gap-1 hover:underline">
                        <ChevronLeft size={12} /> All categories
                      </button>
                      <div className="space-y-2">
                        {categoryTreatments.map(t => <TreatmentCard key={t.id} t={t} />)}
                      </div>
                      {CATEGORY_ROUTES[expandedCategory] && (
                        <a href={CATEGORY_ROUTES[expandedCategory]} className="font-body text-xs text-gold hover:underline mt-3 inline-block" target="_blank" rel="noopener noreferrer">
                          Learn more about {expandedCategory} →
                        </a>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {categories.map(cat => {
                        const count = treatments.filter(t => t.category === cat).length;
                        const minPrice = Math.min(...treatments.filter(t => t.category === cat).map(t => Number(t.price)));
                        return (
                          <button
                            key={cat}
                            onClick={() => setExpandedCategory(cat)}
                            className="p-4 border border-border hover:border-gold/40 text-left transition-all group"
                          >
                            <h4 className="font-display text-sm leading-tight">{cat}</h4>
                            <p className="font-body text-xs text-muted-foreground mt-1">
                              {count} treatment{count > 1 ? "s" : ""} · from £{minPrice === 0 ? "Free" : minPrice}
                            </p>
                            <span className="font-body text-[10px] text-gold uppercase tracking-wider mt-2 inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              View <ChevronRight size={10} />
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Collapsible Add-ons */}
                {selectedTreatments.length > 0 && applicableAddons.length > 0 && (
                  <Collapsible open={addonsOpen} onOpenChange={setAddonsOpen}>
                    <CollapsibleTrigger className="w-full flex items-center justify-between p-3 border border-border hover:border-gold/40 transition-colors">
                      <span className="font-body text-sm flex items-center gap-2">
                        <Plus size={12} strokeWidth={1.5} /> Add extras
                        {selectedAddons.length > 0 && (
                          <span className="text-gold text-xs">({selectedAddons.length} selected · +£{addonsTotal})</span>
                        )}
                      </span>
                      <ChevronDown size={14} className={`text-muted-foreground transition-transform ${addonsOpen ? "rotate-180" : ""}`} />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2 space-y-2">
                      {applicableAddons.map(addon => {
                        const isAdded = selectedAddons.includes(addon.id);
                        return (
                          <button key={addon.id} onClick={() => toggleAddon(addon.id)}
                            className={`w-full p-3 border text-left transition-all ${isAdded ? "border-gold bg-gold/5" : "border-border hover:border-gold/40"}`}>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-body text-sm">{addon.name}</p>
                                {addon.description && <p className="font-body text-xs text-muted-foreground">{addon.description}</p>}
                              </div>
                              <span className="font-body text-sm flex items-center gap-2">
                                +£{Number(addon.price).toFixed(0)}
                                {isAdded ? <Check size={12} className="text-gold" /> : <Plus size={12} className="text-muted-foreground" />}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </CollapsibleContent>
                  </Collapsible>
                )}

                {/* Selection summary */}
                {selectedTreatments.length > 0 && (
                  <div className="border border-gold/30 bg-gold/5 p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">
                          {selectedTreatments.length} treatment{selectedTreatments.length > 1 ? "s" : ""} selected
                        </p>
                        <p className="font-display text-sm">
                          {selectedTreatments.map(t => t.name).join(" + ")}
                        </p>
                        <p className="font-body text-xs text-muted-foreground mt-1">{totalDuration} mins total</p>
                      </div>
                      <p className="font-display text-lg text-gold">£{(treatmentsTotal + addonsTotal).toFixed(0)}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 1: Date & Time */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-display text-lg mb-4 flex items-center gap-2"><Calendar size={16} strokeWidth={1.5} /> Choose a Date</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {availableDates.map((date) => (
                        <button key={date.toISOString()} onClick={() => { setSelectedDate(date); setSelectedTime(null); }} className={`p-3 border text-center transition-all ${selectedDate?.toDateString() === date.toDateString() ? "border-gold bg-gold/5" : "border-border hover:border-gold/40"}`}>
                          <p className="font-body text-xs text-muted-foreground">{format(date, "EEE")}</p>
                          <p className="font-display text-lg">{format(date, "d")}</p>
                          <p className="font-body text-xs text-muted-foreground">{format(date, "MMM")}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-display text-lg mb-4 flex items-center gap-2"><Clock size={16} strokeWidth={1.5} /> Choose a Time</h3>
                    {selectedDate ? (
                      timeSlots.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2">
                          {timeSlots.map((time) => (
                            <button key={time} onClick={() => setSelectedTime(time)} className={`py-3 px-4 border font-body text-sm transition-all ${selectedTime === time ? "border-gold bg-gold/5" : "border-border hover:border-gold/40"}`}>{time}</button>
                          ))}
                        </div>
                      ) : <p className="font-body text-sm text-muted-foreground">No available slots on this date.</p>
                    ) : <p className="font-body text-sm text-muted-foreground">Select a date first.</p>}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Customer Details */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="max-w-lg mx-auto space-y-6">
                  <div>
                    <label className="font-body text-sm block mb-2">Full Name *</label>
                    <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full border border-border bg-transparent px-4 py-3 font-body text-sm focus:border-gold focus:outline-none transition-colors" placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="font-body text-sm block mb-2">Email Address *</label>
                    <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className="w-full border border-border bg-transparent px-4 py-3 font-body text-sm focus:border-gold focus:outline-none transition-colors" placeholder="your@email.com" />
                  </div>
                  <div>
                    <label className="font-body text-sm block mb-2">Phone Number *</label>
                    <input type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-full border border-border bg-transparent px-4 py-3 font-body text-sm focus:border-gold focus:outline-none transition-colors" placeholder="07XXX XXXXXX" />
                    {customerPhone.length > 0 && customerPhone.trim().length < 10 && (
                      <p className="font-body text-xs text-destructive mt-1">Please enter a valid UK phone number</p>
                    )}
                  </div>
                  <div>
                    <label className="font-body text-sm block mb-2">Notes (optional)</label>
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full border border-border bg-transparent px-4 py-3 font-body text-sm focus:border-gold focus:outline-none transition-colors resize-none" placeholder="Any allergies, preferences, or things we should know..." />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Payment Summary */}
            {step === 3 && selectedTreatments.length > 0 && selectedDate && selectedTime && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="max-w-lg mx-auto">
                  <div className="border border-border p-6 mb-6">
                    <h3 className="font-display text-lg mb-4">Booking Summary</h3>
                    <div className="space-y-3 font-body text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">Treatment{selectedTreatments.length > 1 ? "s" : ""}</span><span>{selectedTreatments.map(t => t.name).join(", ")}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span>{format(selectedDate, "EEEE, d MMMM yyyy")}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Time</span><span>{selectedTime}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Duration</span><span>{totalDuration} mins</span></div>
                      <div className="border-t border-border pt-3">
                        {selectedTreatments.map(t => {
                          const p = t.on_offer && t.offer_price ? Number(t.offer_price) : Number(t.price);
                          return <div key={t.id} className="flex justify-between"><span className="text-muted-foreground">{t.name}</span><span>£{p.toFixed(2)}</span></div>;
                        })}
                        {selectedAddons.length > 0 && selectedAddons.map(id => {
                          const addon = addons.find(a => a.id === id);
                          return addon ? <div key={id} className="flex justify-between text-xs text-muted-foreground"><span>+ {addon.name}</span><span>£{Number(addon.price).toFixed(2)}</span></div> : null;
                        })}
                        {discountResult?.valid && <div className="flex justify-between text-gold mt-1"><span>Discount</span><span>-£{discountResult.discountAmount.toFixed(2)}</span></div>}
                        <div className="flex justify-between font-semibold mt-2 text-lg"><span>Total</span><span>£{totalPrice.toFixed(2)}</span></div>
                      </div>
                    </div>
                  </div>

                  {totalPrice > 0 && (
                    <div className="mb-6">
                      <label className="font-body text-sm block mb-2 flex items-center gap-2"><Tag size={14} strokeWidth={1.5} /> Discount Code</label>
                      <div className="flex gap-2">
                        <input type="text" value={discountCode} onChange={(e) => { setDiscountCode(e.target.value); setDiscountError(""); setDiscountResult(null); }} className="flex-1 border border-border bg-transparent px-4 py-3 font-body text-sm uppercase focus:border-gold focus:outline-none" placeholder="Enter code" />
                        <button onClick={applyDiscount} className="px-6 py-3 bg-foreground text-background font-body text-sm tracking-wider uppercase hover:bg-accent transition-colors">Apply</button>
                      </div>
                      {discountError && <p className="font-body text-xs text-destructive mt-2">{discountError}</p>}
                      {discountResult?.valid && <p className="font-body text-xs text-gold mt-2">Discount applied — saving £{discountResult.discountAmount.toFixed(2)}</p>}
                    </div>
                  )}

                  {depositRequired && totalPrice > 0 && (
                    <div className="mb-6">
                      <label className="font-body text-sm block mb-3">Payment Option</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => setPaymentMode("deposit")} className={`p-4 border text-left transition-all ${paymentMode === "deposit" ? "border-gold bg-gold/5" : "border-border hover:border-gold/40"}`}>
                          <p className="font-display text-sm">Pay Deposit</p>
                          <p className="font-body text-xs text-muted-foreground mt-1">£{totalDeposit.toFixed(0)} now</p>
                        </button>
                        <button onClick={() => setPaymentMode("full")} className={`p-4 border text-left transition-all ${paymentMode === "full" ? "border-gold bg-gold/5" : "border-border hover:border-gold/40"}`}>
                          <p className="font-display text-sm">Pay in Full</p>
                          <p className="font-body text-xs text-muted-foreground mt-1">£{totalPrice.toFixed(0)} total</p>
                        </button>
                      </div>
                    </div>
                  )}

                  {totalPrice > 0 && (
                    <div className="border border-gold bg-gold/5 p-4 mb-6 text-center">
                      <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">Amount to pay now</p>
                      <p className="font-display text-3xl text-gold">£{chargeAmount.toFixed(2)}</p>
                      {paymentMode === "deposit" && depositRequired && (
                        <p className="font-body text-xs text-muted-foreground mt-1">Remaining £{(totalPrice - chargeAmount).toFixed(2)} due at appointment</p>
                      )}
                    </div>
                  )}

                  <button onClick={handleBooking} disabled={submitting} className="w-full py-4 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-accent transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                    {submitting ? <span className="animate-pulse">Processing...</span> : totalPrice === 0 ? <>Confirm Booking <ArrowRight size={14} /></> : <>Proceed to Payment <ArrowRight size={14} /></>}
                  </button>
                  <p className="font-body text-xs text-muted-foreground text-center mt-4">Payments processed securely via Stripe.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-10">
            <button onClick={() => setStep(Math.max(0, step - 1))} className={`flex items-center gap-2 font-body text-sm tracking-wider uppercase hover:text-gold transition-colors ${step === 0 ? "invisible" : ""}`}>
              <ChevronLeft size={14} strokeWidth={1.5} /> Back
            </button>
            {step < 3 && (
              <button onClick={() => setStep(step + 1)} disabled={!canProceed()} className="flex items-center gap-2 px-8 py-3 bg-foreground text-background font-body text-sm tracking-wider uppercase hover:bg-accent transition-colors disabled:opacity-30">
                Continue <ChevronRight size={14} strokeWidth={1.5} />
              </button>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BookingSystem;
