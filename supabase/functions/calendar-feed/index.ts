import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

serve(async (req) => {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  // Use a dedicated, randomly-generated secret (NOT derived from the public anon key).
  const expectedToken = Deno.env.get("CALENDAR_FEED_PASSWORD") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

  if (!expectedToken || !token || token.length < 16 || token !== expectedToken) {
    return new Response("Unauthorized", { status: 401 });
  }

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

    const now = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "").substring(0, 15) + "Z";
    let ics = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Hive Clinic//Bookings//EN\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\nX-WR-CALNAME:Hive Clinic Bookings\r\nX-WR-TIMEZONE:Europe/London\r\n`;

    for (const b of (bookings ?? []) as any[]) {
      const startDate = new Date(`${b.booking_date}T${b.booking_time}`);
      const endDate = new Date(startDate.getTime() + (b.duration_mins ?? 60) * 60 * 1000);
      const startTime = startDate.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "").substring(0, 15);
      const endTime = endDate.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "").substring(0, 15);
      const summary = `${b.treatments?.name ?? "Booking"} - ${b.customer_name ?? ""}`.replace(/[,;\\]/g, " ");
      const desc = `Status: ${b.status}\\nPayment: ${b.payment_status ?? ""}`;
      ics += `BEGIN:VEVENT\r\nUID:${b.id}@hiveclinic\r\nDTSTAMP:${now}\r\nDTSTART:${startTime}Z\r\nDTEND:${endTime}Z\r\nSUMMARY:${summary}\r\nDESCRIPTION:${desc}\r\nEND:VEVENT\r\n`;
    }
    ics += `END:VCALENDAR\r\n`;

    return new Response(ics, {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (e) {
    return new Response(`Error: ${e instanceof Error ? e.message : String(e)}`, { status: 500 });
  }
});
