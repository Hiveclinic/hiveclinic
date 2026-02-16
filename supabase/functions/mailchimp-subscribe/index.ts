import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const MAILCHIMP_API_KEY = Deno.env.get("MAILCHIMP_API_KEY");
    const MAILCHIMP_AUDIENCE_ID = Deno.env.get("MAILCHIMP_AUDIENCE_ID");

    if (!MAILCHIMP_API_KEY || !MAILCHIMP_AUDIENCE_ID) {
      throw new Error("Mailchimp credentials not configured");
    }

    const dc = MAILCHIMP_API_KEY.split("-").pop();

    const { email, firstName, lastName, tags } = await req.json();

    if (!email || typeof email !== "string") {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email) || email.length > 255) {
      return new Response(JSON.stringify({ error: "Invalid email format" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build merge fields
    const mergeFields: Record<string, string> = {};
    if (firstName) mergeFields.FNAME = firstName;
    if (lastName) mergeFields.LNAME = lastName;

    // Build tags array
    const memberTags = ["Website Signup"];
    if (tags && Array.isArray(tags)) {
      memberTags.push(...tags);
    }

    const response = await fetch(
      `https://${dc}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${MAILCHIMP_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_address: email,
          status: "subscribed",
          merge_fields: Object.keys(mergeFields).length > 0 ? mergeFields : undefined,
          tags: memberTags,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      if (data.title === "Member Exists") {
        // Update existing member's tags and merge fields
        const emailHash = await crypto.subtle.digest("MD5", new TextEncoder().encode(email.toLowerCase())).then(buf => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join(""));
        
        // Update merge fields if provided
        if (Object.keys(mergeFields).length > 0) {
          await fetch(`https://${dc}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members/${emailHash}`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${MAILCHIMP_API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({ merge_fields: mergeFields }),
          }).catch(() => {});
        }

        // Add new tags
        if (memberTags.length > 0) {
          await fetch(`https://${dc}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members/${emailHash}/tags`, {
            method: "POST",
            headers: { Authorization: `Bearer ${MAILCHIMP_API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({ tags: memberTags.map(t => ({ name: t, status: "active" })) }),
          }).catch(() => {});
        }

        return new Response(JSON.stringify({ success: true, already_member: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      console.error("Mailchimp error:", data);
      throw new Error(`Mailchimp API error [${response.status}]: ${data.detail || data.title}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
