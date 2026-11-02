// supabase/functions/initiate-call/index.ts
// Copy this file directly. Replace BOTNAME and timezone.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const ok = (data: unknown) =>
    new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  const fail = (msg: string, details: Record<string, unknown> = {}) =>
    new Response(JSON.stringify({ success: false, error: msg, ...details }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const RAYA_API_KEY = Deno.env.get("RAYA_API_KEY");
    if (!RAYA_API_KEY) return fail("RAYA_API_KEY not configured");

    // CHANGE: replace BOTNAME with your bot's name e.g. SIZA, SAARTHI, KARIGAR
    const RAYA_AGENT_ID = Deno.env.get("RAYA_AGENT_ID_BOTNAME");
    if (!RAYA_AGENT_ID) return fail("RAYA_AGENT_ID_BOTNAME not configured");

    const { phone, countryCode, personaId } = await req.json();
    if (!phone || !countryCode || !personaId) {
      return fail("phone, countryCode, and personaId are required");
    }

    const cleanCountryCode = countryCode.replace("+", "");
    const requestCorrelationId = crypto.randomUUID();

    // NOTE: out_did is intentionally NOT included in the call body.
    // Passing out_did explicitly causes 'Unanswered' on Raya — omit it and Raya routes correctly.
    // (Learned from raya_testrun.py operational notes.)
    const callBody = JSON.stringify({
      agent_id: RAYA_AGENT_ID,
      to_number: phone,
      country_code: cleanCountryCode,
      agent_args: { persona: personaId },
      // CHANGE: set correct timezone for your geography
      // India: "Asia/Kolkata"
      // South Africa: "Africa/Johannesburg"
      // UAE: "Asia/Dubai"
      timezone: "Asia/Kolkata",
    });

    let response!: Response;
    let rawText = "";
    let data: unknown;
    let rayaCorrelationId: string | null = null;

    // Retry up to 3 times on 429 rate limit
    for (let attempt = 0; attempt < 3; attempt++) {
      response = await fetch("https://v1.getraya.app/api/call", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": RAYA_API_KEY,
          "X-Correlation-ID": requestCorrelationId,
        },
        body: callBody,
      });

      rayaCorrelationId = response.headers.get("x-correlation-id") || requestCorrelationId;
      rawText = await response.text();
      try { data = JSON.parse(rawText); } catch { data = rawText; }

      console.log(`[Raya] Attempt ${attempt + 1} | Status: ${response.status} | Correlation: ${rayaCorrelationId}`);

      if (response.status === 429) {
        const retryAfter = (data as any)?.retry_after || 1;
        await new Promise((r) => setTimeout(r, retryAfter * 1000));
        continue;
      }
      break;
    }

    if (!response.ok) {
      return fail(`Raya error [${response.status}]: ${rawText}`, {
        rayaStatus: response.status,
        rayaCorrelationId,
        rayaResponse: rawText,
      });
    }

    return ok({ success: true, data, rayaStatus: response.status, rayaCorrelationId });

  } catch (error: unknown) {
    console.error("initiate-call error:", error);
    return fail(error instanceof Error ? error.message : "Unknown error");
  }
});
