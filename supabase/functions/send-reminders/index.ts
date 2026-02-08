import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: unknown) => {
  console.log(`[SEND-REMINDERS] ${step}${details ? ` - ${JSON.stringify(details)}` : ""}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().slice(0, 10);

    logStep("Checking bookings for", { date: tomorrowStr });

    // Find confirmed bookings for tomorrow that haven't had reminders sent
    const { data: bookings, error } = await supabaseClient
      .from("bookings")
      .select("id, customer_name, customer_email")
      .eq("booking_date", tomorrowStr)
      .eq("status", "confirmed")
      .eq("reminder_sent", false);

    if (error) throw new Error(`Failed to fetch bookings: ${error.message}`);
    if (!bookings || bookings.length === 0) {
      logStep("No reminders to send");
      return new Response(JSON.stringify({ sent: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    logStep(`Found ${bookings.length} bookings needing reminders`);

    let sent = 0;
    for (const booking of bookings) {
      try {
        // Call the send-booking-email function
        const emailRes = await fetch(
          `${Deno.env.get("SUPABASE_URL")}/functions/v1/send-booking-email`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
            },
            body: JSON.stringify({ bookingId: booking.id, emailType: "reminder" }),
          }
        );

        if (emailRes.ok) {
          // Mark reminder as sent
          await supabaseClient
            .from("bookings")
            .update({ reminder_sent: true })
            .eq("id", booking.id);
          sent++;
          logStep(`Reminder sent to ${booking.customer_name}`);
        } else {
          logStep(`Failed to send reminder to ${booking.customer_name}`);
        }
      } catch (err) {
        logStep(`Error sending reminder to ${booking.customer_name}`, { error: String(err) });
      }
    }

    logStep(`Completed: ${sent}/${bookings.length} reminders sent`);

    return new Response(JSON.stringify({ sent, total: bookings.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
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
