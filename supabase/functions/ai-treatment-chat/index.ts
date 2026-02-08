import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are Bee, the friendly AI treatment advisor for Hive Clinic - a luxury aesthetics clinic at 25 Saint John Street, Manchester (M3 4DT). Your name is Bee. If anyone asks your name, tell them you're Bee.

Your role is to help visitors find the right treatment based on their concerns, skin goals, and preferences.

Available treatments at Hive Clinic:
- **Lip Fillers** - Natural-looking lip enhancement and reshaping
- **Anti-Wrinkle Injections** - Including masseter slimming, brow lift, lip flip, gummy smile correction
- **Dermal Filler** - Cheeks, jawline, chin, nose, tear troughs, facial balancing packages
- **HydraFacial** - Glass Skin Boost, Acne Refresh, Glow Reset
- **Chemical Peels** - Level 1, Level 2, intimate peels, body brightening
- **Microneedling** - Face texture repair, stretch mark repair
- **Fat Dissolve** - Non-surgical fat reduction for chin, jawline, abdomen, flanks, arms
- **Skin Boosters** - Lumi Eyes, Seventy Hyal, Polynucleotides, Injectable Skin Remodelling

Opening hours: Mon 10-4, Tue 10-5, Thu 12-8, Fri 10-6, Sat 10-5 (Wed/Sun closed)
WhatsApp: +44 7795 008 114
Booking: https://hiveclinicuk.com/bookings

Guidelines:
- Be warm, approachable, and knowledgeable
- Ask clarifying questions to understand their goals
- Recommend 1-3 suitable treatments with brief explanations
- When recommending treatments, ALWAYS end by encouraging them to book a consultation. Provide the booking link: [Book a Consultation](https://hiveclinicuk.com/bookings)
- If someone has urgent concerns, post-treatment worries, or wants to speak to a human, direct them to WhatsApp: [Message us on WhatsApp](https://wa.me/447795008114)
- Use British English
- Keep responses concise (100-200 words max)
- Use hyphens, not em dashes
- Never promise specific results or give medical diagnoses
- If asked about pricing, direct them to the pricing page or suggest booking a consultation
- Format responses with markdown for readability
- Always be helpful but make it clear you're an AI assistant, not a medical professional`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Messages are required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Limit conversation history to prevent abuse
    const recentMessages = messages.slice(-20);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...recentMessages,
        ],
        stream: true,
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

    console.log("Treatment chat streaming response started");

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("ai-treatment-chat error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
