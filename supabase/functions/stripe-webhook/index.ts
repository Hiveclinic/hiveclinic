import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const logStep = (step: string, details?: unknown) => {
  console.log(`[STRIPE-WEBHOOK] ${step}${details ? ` - ${JSON.stringify(details)}` : ""}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: { "Access-Control-Allow-Origin": "*" } });
  }

  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

  if (!stripeKey) {
    logStep("ERROR", "STRIPE_SECRET_KEY not set");
    return new Response("Server config error", { status: 500 });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const body = await req.text();
    let event: Stripe.Event;

    // Verify signature if webhook secret is set, otherwise parse directly
    if (webhookSecret) {
      const sig = req.headers.get("stripe-signature");
      if (!sig) {
        logStep("ERROR", "Missing stripe-signature header");
        return new Response("Missing signature", { status: 400 });
      }
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } else {
      // Fallback: parse without verification (dev mode)
      event = JSON.parse(body);
      logStep("WARNING", "No STRIPE_WEBHOOK_SECRET set, skipping signature verification");
    }

    logStep("Event received", { type: event.type, id: event.id });

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const bookingId = session.metadata?.booking_id;

      if (!bookingId) {
        logStep("WARNING", "No booking_id in session metadata");
        return new Response(JSON.stringify({ received: true }), { status: 200 });
      }

      logStep("Processing booking confirmation", { bookingId });

      // Get booking
      const { data: booking, error: bookingError } = await supabaseClient
        .from("bookings")
        .select("*, treatments(name)")
        .eq("id", bookingId)
        .single();

      if (bookingError || !booking) {
        logStep("ERROR", `Booking not found: ${bookingId}`);
        return new Response(JSON.stringify({ received: true }), { status: 200 });
      }

      // Idempotent: skip if already confirmed
      if (booking.status === "confirmed") {
        logStep("Already confirmed, skipping", { bookingId });
        return new Response(JSON.stringify({ received: true, already_confirmed: true }), { status: 200 });
      }

      const isDeposit = Number(booking.deposit_amount) > 0 && Number(booking.deposit_amount) < Number(booking.total_price);

      // Confirm booking
      await supabaseClient
        .from("bookings")
        .update({
          status: "confirmed",
          payment_status: isDeposit ? "deposit_paid" : "fully_paid",
          stripe_payment_intent_id: session.payment_intent as string,
        })
        .eq("id", bookingId);

      logStep("Booking confirmed", { bookingId, isDeposit });

      // Increment discount code usage
      if (booking.discount_code_id) {
        const { data: dc } = await supabaseClient
          .from("discount_codes")
          .select("used_count")
          .eq("id", booking.discount_code_id)
          .single();
        if (dc) {
          await supabaseClient
            .from("discount_codes")
            .update({ used_count: (dc.used_count || 0) + 1 })
            .eq("id", booking.discount_code_id);
        }
      }

      // Send confirmation email (non-blocking)
      try {
        await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/send-booking-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}` },
          body: JSON.stringify({ bookingId, emailType: "confirmation" }),
        });
      } catch (e) {
        logStep("Confirmation email failed (non-blocking)", e);
      }

      // Send admin notification (non-blocking)
      try {
        await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/send-booking-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}` },
          body: JSON.stringify({ bookingId, emailType: "admin_new_booking" }),
        });
      } catch (e) {
        logStep("Admin notification failed (non-blocking)", e);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    logStep("ERROR", { message: msg });
    return new Response(JSON.stringify({ error: msg }), { status: 400 });
  }
});
