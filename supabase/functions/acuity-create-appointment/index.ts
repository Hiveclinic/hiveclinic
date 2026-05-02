// deno-lint-ignore-file no-explicit-any
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ACUITY_BASE = "https://acuityscheduling.com/api/v1";

interface BookingPayload {
  appointmentTypeID: number;
  datetime: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  notes?: string;
}

const validate = (b: any): { ok: true; value: BookingPayload } | { ok: false; error: string } => {
  if (!b || typeof b !== "object") return { ok: false, error: "Invalid body" };
  const id = Number(b.appointmentTypeID);
  if (!Number.isFinite(id) || id <= 0) return { ok: false, error: "Invalid appointmentTypeID" };
  if (typeof b.datetime !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(b.datetime))
    return { ok: false, error: "Invalid datetime" };
  const firstName = String(b.firstName ?? "").trim();
  const lastName = String(b.lastName ?? "").trim();
  const email = String(b.email ?? "").trim();
  if (!firstName || firstName.length > 80) return { ok: false, error: "Invalid first name" };
  if (!lastName || lastName.length > 80) return { ok: false, error: "Invalid last name" };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200)
    return { ok: false, error: "Invalid email" };
  const phone = b.phone ? String(b.phone).trim().slice(0, 40) : undefined;
  const notes = b.notes ? String(b.notes).trim().slice(0, 1000) : undefined;
  return { ok: true, value: { appointmentTypeID: id, datetime: b.datetime, firstName, lastName, email, phone, notes } };
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json().catch(() => null);
    const parsed = validate(body);
    if (!parsed.ok) {
      return new Response(JSON.stringify({ error: parsed.error }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = Deno.env.get("ACUITY_USER_ID");
    const apiKey = Deno.env.get("ACUITY_API_KEY");
    if (!userId || !apiKey) throw new Error("acuity_credentials_missing");

    const auth = btoa(`${userId}:${apiKey}`);
    const r = await fetch(`${ACUITY_BASE}/appointments`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsed.value),
    });

    const data: any = await r.json().catch(() => ({}));
    if (!r.ok) {
      console.error("Acuity book error", r.status, data);
      const message = typeof data?.message === "string" ? data.message : "Could not create appointment. Please try another time.";
      return new Response(JSON.stringify({ error: message }), {
        status: r.status === 400 || r.status === 409 ? r.status : 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({
      id: data.id,
      confirmationPage: data.confirmationPage,
      confirmationPagePaymentLink: data.confirmationPagePaymentLink,
      datetime: data.datetime,
      type: data.type,
      price: data.price,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("acuity-create-appointment error", err);
    return new Response(JSON.stringify({ error: "Booking failed. Please try again." }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
