import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
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
    const { bookingId, sessionId } = await req.json();
    if (!bookingId || !sessionId) throw new Error("Missing booking or session ID");

    // Verify Stripe payment
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      throw new Error("Payment not completed");
    }

    // Get the booking
    const { data: booking, error: bookingError } = await supabaseClient
      .from("bookings")
      .select("*, treatments(*)")
      .eq("id", bookingId)
      .single();

    if (bookingError || !booking) throw new Error("Booking not found");

    const isDeposit = Number(booking.deposit_amount) > 0 && Number(booking.deposit_amount) < Number(booking.total_price);

    // Update booking status
    await supabaseClient
      .from("bookings")
      .update({
        status: "confirmed",
        payment_status: isDeposit ? "deposit_paid" : "fully_paid",
        stripe_payment_intent_id: session.payment_intent as string,
      })
      .eq("id", bookingId);

    // Increment discount code usage if applicable
    if (booking.discount_code_id) {
      await supabaseClient
        .from("discount_codes")
        .update({ used_count: booking.discount_codes?.used_count + 1 || 1 })
        .eq("id", booking.discount_code_id);
    }

    console.log(`[CONFIRM-BOOKING] Booking ${bookingId} confirmed`);

    return new Response(JSON.stringify({
      success: true,
      booking: {
        id: booking.id,
        treatment: booking.treatments?.name,
        date: booking.booking_date,
        time: booking.booking_time,
        customerName: booking.customer_name,
        customerEmail: booking.customer_email,
        totalPrice: booking.total_price,
        depositAmount: booking.deposit_amount,
        paymentStatus: isDeposit ? "deposit_paid" : "fully_paid",
      }
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("[CONFIRM-BOOKING] Error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
