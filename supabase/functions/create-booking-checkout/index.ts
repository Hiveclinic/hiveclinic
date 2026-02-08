import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: unknown) => {
  console.log(`[BOOKING-CHECKOUT] ${step}${details ? ` - ${JSON.stringify(details)}` : ''}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const {
      treatmentId,
      bookingDate,
      bookingTime,
      customerName,
      customerEmail,
      customerPhone,
      paymentMode, // 'deposit' or 'full'
      discountCode,
      notes,
    } = await req.json();

    if (!treatmentId || !bookingDate || !bookingTime || !customerName || !customerEmail) {
      throw new Error("Missing required booking fields");
    }

    // Get treatment details
    const { data: treatment, error: treatmentError } = await supabaseClient
      .from("treatments")
      .select("*")
      .eq("id", treatmentId)
      .eq("active", true)
      .single();

    if (treatmentError || !treatment) throw new Error("Treatment not found or inactive");
    logStep("Treatment found", { name: treatment.name, price: treatment.price });

    // Check for existing booking at this slot
    const { data: existingBooking } = await supabaseClient
      .from("bookings")
      .select("id")
      .eq("booking_date", bookingDate)
      .eq("booking_time", bookingTime)
      .in("status", ["pending", "confirmed"])
      .limit(1);

    if (existingBooking && existingBooking.length > 0) {
      throw new Error("This time slot is no longer available. Please choose another.");
    }

    // Apply discount if provided
    let discountAmount = 0;
    let discountCodeId: string | null = null;

    if (discountCode) {
      const { data: discount } = await supabaseClient
        .from("discount_codes")
        .select("*")
        .eq("code", discountCode.toUpperCase())
        .eq("active", true)
        .single();

      if (discount) {
        const now = new Date();
        const validFrom = discount.valid_from ? new Date(discount.valid_from) : null;
        const validUntil = discount.valid_until ? new Date(discount.valid_until) : null;

        if (validFrom && now < validFrom) throw new Error("Discount code is not yet valid");
        if (validUntil && now > validUntil) throw new Error("Discount code has expired");
        if (discount.max_uses && discount.used_count >= discount.max_uses) throw new Error("Discount code usage limit reached");
        if (Number(treatment.price) < Number(discount.min_spend)) throw new Error(`Minimum spend of £${discount.min_spend} required for this code`);

        // Check if applicable to this treatment
        if (discount.applicable_treatments && discount.applicable_treatments.length > 0) {
          if (!discount.applicable_treatments.includes(treatmentId)) {
            throw new Error("Discount code not valid for this treatment");
          }
        }

        if (discount.discount_type === "percentage") {
          discountAmount = (Number(treatment.price) * Number(discount.discount_value)) / 100;
        } else {
          discountAmount = Number(discount.discount_value);
        }

        discountCodeId = discount.id;
        logStep("Discount applied", { code: discountCode, amount: discountAmount });
      } else {
        throw new Error("Invalid discount code");
      }
    }

    const totalPrice = Math.max(0, Number(treatment.price) - discountAmount);
    const isDeposit = paymentMode === "deposit" && treatment.deposit_required;
    const chargeAmount = isDeposit ? Number(treatment.deposit_amount) : totalPrice;

    // Check if authenticated user
    let userId: string | null = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: userData } = await supabaseClient.auth.getUser(token);
      userId = userData.user?.id || null;
    }

    // Free treatment (e.g. consultation) - create booking directly
    if (chargeAmount === 0) {
      const { data: booking, error: bookingError } = await supabaseClient
        .from("bookings")
        .insert({
          treatment_id: treatmentId,
          user_id: userId,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          booking_date: bookingDate,
          booking_time: bookingTime,
          duration_mins: treatment.duration_mins,
          status: "confirmed",
          payment_status: "fully_paid",
          total_price: 0,
          deposit_amount: 0,
          discount_code_id: discountCodeId,
          discount_amount: discountAmount,
          notes,
        })
        .select()
        .single();

      if (bookingError) throw new Error(`Failed to create booking: ${bookingError.message}`);

      // Increment discount usage
      if (discountCodeId) {
        await supabaseClient.rpc("increment_discount_usage", { discount_id: discountCodeId });
      }

      return new Response(JSON.stringify({ bookingId: booking.id, free: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Create pending booking
    const { data: booking, error: bookingError } = await supabaseClient
      .from("bookings")
      .insert({
        treatment_id: treatmentId,
        user_id: userId,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        booking_date: bookingDate,
        booking_time: bookingTime,
        duration_mins: treatment.duration_mins,
        status: "pending",
        payment_status: "pending",
        total_price: totalPrice,
        deposit_amount: isDeposit ? Number(treatment.deposit_amount) : 0,
        discount_code_id: discountCodeId,
        discount_amount: discountAmount,
        notes,
      })
      .select()
      .single();

    if (bookingError) throw new Error(`Failed to create booking: ${bookingError.message}`);
    logStep("Booking created", { bookingId: booking.id });

    // Create Stripe checkout session
    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    const origin = req.headers.get("origin") || "https://hiveclinic.lovable.app";

    const session = await stripe.checkout.sessions.create({
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: `${treatment.name}${isDeposit ? " (Deposit)" : ""}`,
              description: `${bookingDate} at ${bookingTime}${isDeposit ? ` — Remaining £${(totalPrice - chargeAmount).toFixed(2)} due at appointment` : ""}`,
            },
            unit_amount: Math.round(chargeAmount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/booking-success?booking_id=${booking.id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/booking-cancelled?booking_id=${booking.id}`,
      metadata: {
        booking_id: booking.id,
        treatment_name: treatment.name,
        is_deposit: String(isDeposit),
      },
    });

    // Update booking with stripe session ID
    await supabaseClient
      .from("bookings")
      .update({ stripe_session_id: session.id })
      .eq("id", booking.id);

    logStep("Stripe session created", { sessionId: session.id });

    return new Response(JSON.stringify({ url: session.url, bookingId: booking.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    logStep("ERROR", { message: msg });
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
