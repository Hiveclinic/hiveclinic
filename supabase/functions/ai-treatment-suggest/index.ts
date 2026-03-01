import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name } = await req.json();
    if (!name || name.trim().length < 2) throw new Error("Treatment name required");

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) throw new Error("LOVABLE_API_KEY not configured");

    const prompt = `You are an aesthetics clinic treatment database assistant. Given the treatment name "${name}", generate a JSON object with these fields:
- description: A compelling 1-2 sentence description for a luxury aesthetics clinic website (no medical jargon, client-facing)
- category: The most appropriate category from this list: Lip Fillers, Anti-Wrinkle, Dermal Filler, HydraFacial, Chemical Peels, Skin Boosters, Fat Dissolve, Microneedling, Dermaplaning, LED Light Therapy, Mesotherapy, PRP, Facial Balancing, Micro Sclerotherapy, Consultations, Intimate & Body Peels. If none fit, suggest a new category name.
- duration_mins: Typical duration in minutes (number)
- suggested_price: Typical UK price in pounds (number)
- slug: URL-friendly slug

Return ONLY valid JSON, no markdown or explanation.`;

    const response = await fetch("https://api.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    // Parse JSON from response (handle markdown code blocks)
    let jsonStr = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) jsonStr = jsonMatch[1];
    
    const suggestion = JSON.parse(jsonStr.trim());

    return new Response(JSON.stringify(suggestion), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("[AI-TREATMENT-SUGGEST] Error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
