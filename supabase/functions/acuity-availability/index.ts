const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ACUITY_BASE = "https://acuityscheduling.com/api/v1";

const fetchAcuity = async (path: string, userId: string, apiKey: string) => {
  const auth = btoa(`${userId}:${apiKey}`);
  const r = await fetch(`${ACUITY_BASE}${path}`, {
    headers: { Authorization: `Basic ${auth}`, Accept: "application/json" },
  });
  if (!r.ok) {
    const body = await r.text();
    console.error(`Acuity ${path} -> ${r.status}: ${body.slice(0, 300)}`);
    throw new Error(`acuity_${r.status}`);
  }
  return r.json();
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const appointmentTypeId = url.searchParams.get("appointmentTypeID");
    const month = url.searchParams.get("month"); // YYYY-MM (for dates)
    const date = url.searchParams.get("date");   // YYYY-MM-DD (for times)

    if (!appointmentTypeId || !/^\d+$/.test(appointmentTypeId)) {
      return new Response(JSON.stringify({ error: "Invalid appointmentTypeID" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = Deno.env.get("ACUITY_USER_ID");
    const apiKey = Deno.env.get("ACUITY_API_KEY");
    if (!userId || !apiKey) throw new Error("acuity_credentials_missing");

    if (date) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return new Response(JSON.stringify({ error: "Invalid date" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const slots = await fetchAcuity(
        `/availability/times?appointmentTypeID=${appointmentTypeId}&date=${date}`,
        userId, apiKey,
      );
      return new Response(JSON.stringify({ slots }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (month) {
      if (!/^\d{4}-\d{2}$/.test(month)) {
        return new Response(JSON.stringify({ error: "Invalid month" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const dates = await fetchAcuity(
        `/availability/dates?appointmentTypeID=${appointmentTypeId}&month=${month}`,
        userId, apiKey,
      );
      return new Response(JSON.stringify({ dates }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Provide month or date" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("acuity-availability error", err);
    return new Response(JSON.stringify({ error: "Failed to load availability" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
