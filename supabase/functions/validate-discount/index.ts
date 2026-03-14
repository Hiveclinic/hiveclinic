import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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
    const { code, treatmentId, treatmentIds, treatmentPrice } = await req.json();
    if (!code) throw new Error("Discount code required");

    const { data: discount, error } = await supabaseClient
      .from("discount_codes")
      .select("*")
      .eq("code", code.toUpperCase().trim())
      .eq("active", true)
      .single();

    if (error || !discount) {
      return new Response(JSON.stringify({ valid: false, error: "Invalid discount code" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const now = new Date();
    if (discount.valid_from && now < new Date(discount.valid_from)) {
      return new Response(JSON.stringify({ valid: false, error: "Code not yet valid" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200,
      });
    }
    if (discount.valid_until && now > new Date(discount.valid_until)) {
      return new Response(JSON.stringify({ valid: false, error: "Code has expired" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200,
      });
    }
    if (discount.max_uses && discount.used_count >= discount.max_uses) {
      return new Response(JSON.stringify({ valid: false, error: "Code usage limit reached" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200,
      });
    }
    if (treatmentPrice && Number(treatmentPrice) < Number(discount.min_spend)) {
      return new Response(JSON.stringify({ valid: false, error: `Minimum spend £${discount.min_spend} required` }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200,
      });
    }

    // Check applicable_treatments (whitelist) — if set, treatment must be in the list
    const allTreatmentIds = treatmentIds?.length ? treatmentIds : (treatmentId ? [treatmentId] : []);
    if (discount.applicable_treatments?.length > 0 && allTreatmentIds.length > 0) {
      const allAllowed = allTreatmentIds.every((id: string) => discount.applicable_treatments.includes(id));
      if (!allAllowed) {
        return new Response(JSON.stringify({ valid: false, error: "Code not valid for one or more selected treatments" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200,
        });
      }
    }

    // Check excluded_treatments (blacklist) — if any selected treatment is excluded, reject
    if (discount.excluded_treatments?.length > 0 && allTreatmentIds.length > 0) {
      const hasExcluded = allTreatmentIds.some((id: string) => discount.excluded_treatments.includes(id));
      if (hasExcluded) {
        return new Response(JSON.stringify({ valid: false, error: "Code not valid for one or more selected treatments" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200,
        });
      }
    }

    let discountAmount = 0;
    if (treatmentPrice) {
      discountAmount = discount.discount_type === "percentage"
        ? (Number(treatmentPrice) * Number(discount.discount_value)) / 100
        : Number(discount.discount_value);
    }

    return new Response(JSON.stringify({
      valid: true,
      discountType: discount.discount_type,
      discountValue: Number(discount.discount_value),
      discountAmount,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ valid: false, error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
