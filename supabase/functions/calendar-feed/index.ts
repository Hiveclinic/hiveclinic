import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

serve(async (req) => {
  // Support HTTP Basic Auth (for Outlook/iPhone calendar subscriptions)
  const feedPassword = Deno.env.get("CALENDAR_FEED_PASSWORD") ?? "";
  const expectedUser = "hive";

  const authHeader = req.headers.get("Authorization") ?? "";
  let authenticated = false;

  if (authHeader.startsWith("Basic ")) {
    const decoded = atob(authHeader.substring(6));
    const [user, pass] = decoded.split(":");
    if (user === expectedUser && pass === feedPassword) {
      authenticated = true;
    }
  }

  // Also support ?token= query param as fallback
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  if (token && token === feedPassword) {
    authenticated = true;
  }

  if (!authenticated) {
    return new Response("Unauthorized", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Hive Clinic Calendar"',
      },
    });
  }

  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    serviceKey,
    { auth: { persistSession: false } }
  );

  try {
    const { data: bookings, error } = await supabaseClient
      .from("bookings")
      .select("*, treatments(name)")
      .in("status", ["confirmed", "pending"])
      .order("booking_date", { ascending: true });

    if (error) throw error;

    const now = new Date();
    const stamp = now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

    let ical = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Hive Clinic//Booking Calendar//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "X-WR-CALNAME:Hive Clinic Bookings",
      "X-WR-TIMEZONE:Europe/London",
    ];

    for (const b of bookings || []) {
      const dateStr = b.booking_date.replace(/-/g, "");
      const [hours, minutes] = b.booking_time.split(":");
      const startTime = `${dateStr}T${hours}${minutes}00`;

      const startDate = new Date(`${b.booking_date}T${b.booking_time}`);
      const endDate = new Date(startDate.getTime() + b.duration_mins * 60000);
      const endTime = endDate.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "").substring(0, 15);

      const treatmentName = b.treatments?.name || "Booking";
      const summary = `${treatmentName} - ${b.customer_name}`;
      const description = [
        `Client: ${b.customer_name}`,
        `Email: ${b.customer_email}`,
        b.customer_phone ? `Phone: ${b.customer_phone}` : "",
        `Price: £${b.total_price}`,
        `Payment: ${b.payment_status}`,
        b.notes ? `Notes: ${b.notes}` : "",
      ].filter(Boolean).join("\\n");

      ical.push(
        "BEGIN:VEVENT",
        `UID:${b.id}@hiveclinic`,
        `DTSTAMP:${stamp}`,
        `DTSTART;TZID=Europe/London:${startTime}`,
        `DTEND;TZID=Europe/London:${endTime}`,
        `SUMMARY:${summary}`,
        `DESCRIPTION:${description}`,
        `STATUS:CONFIRMED`,
        "END:VEVENT"
      );
    }

    ical.push("END:VCALENDAR");

    return new Response(ical.join("\r\n"), {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": 'attachment; filename="hive-clinic-bookings.ics"',
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("[CALENDAR-FEED] Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
});
