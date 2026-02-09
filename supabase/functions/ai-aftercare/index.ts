import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Rate limiting
const rateLimiter = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(ip: string, limit = 10, windowMs = 60000): boolean {
  const now = Date.now();
  const record = rateLimiter.get(ip);
  if (!record || now > record.resetAt) {
    rateLimiter.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (record.count >= limit) return false;
  record.count++;
  return true;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
  if (!checkRateLimit(clientIp)) {
    return new Response(JSON.stringify({ error: "Too many requests. Please try again shortly." }), {
      status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { treatment, concerns } = await req.json();

    if (!treatment || typeof treatment !== "string") {
      return new Response(JSON.stringify({ error: "Treatment is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `You are a specialist aftercare advisor for Hive Clinic, a luxury aesthetics clinic in Manchester. 
You provide personalised post-treatment aftercare advice based on the treatment type and any specific concerns the patient has.

Guidelines:
- Be warm, professional, and reassuring
- Give specific, actionable advice tailored to their concerns
- Always remind them to contact Hive Clinic on WhatsApp (+44 7795 008 114) if they have any worries
- Use British English spelling
- Format with clear sections using markdown: ## headings, bullet points, **bold** for emphasis
- Keep responses concise but thorough (200-300 words)
- Include a timeline of what to expect during healing
- Never diagnose medical conditions - always recommend contacting the clinic for unusual symptoms
- Do NOT use em dashes, use hyphens instead

EMERGENCY DETECTION - CRITICAL:
If the patient describes ANY of the following symptoms, you MUST respond with URGENT language and clear emergency instructions BEFORE any other advice:
- Severe swelling that is rapidly worsening or spreading
- Vision changes, blurred vision, or any eye-related symptoms after facial filler
- Difficulty breathing or swallowing
- Excessive or uncontrollable bleeding
- Signs of allergic reaction (hives, throat tightening, widespread rash)
- Skin turning white, blue, or grey near the treatment area (possible vascular occlusion)
- Intense pain that is getting significantly worse rather than improving
- High fever (above 38.5C) with redness and heat at the treatment site

For ANY of these symptoms, your response MUST:
1. Start with "## URGENT - Seek Immediate Help" in bold
2. Tell them to call 999 or go to A&E immediately if breathing/vision is affected
3. Tell them to call the clinic emergency WhatsApp (+44 7795 008 114) RIGHT NOW
4. Be direct and urgent in tone - do not downplay the concern
5. Then provide any relevant first aid while waiting for help`;

    const userMessage = concerns 
      ? `I just had ${treatment} treatment. My specific concerns are: ${concerns}. Please give me personalised aftercare advice.`
      : `I just had ${treatment} treatment. Please give me personalised aftercare advice.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "We're experiencing high demand. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      throw new Error("AI service error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "Unable to generate advice at this time.";

    console.log("Aftercare advice generated for:", treatment);

    return new Response(JSON.stringify({ advice: content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("ai-aftercare error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
