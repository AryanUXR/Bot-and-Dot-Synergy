// Vapi. NOT YET TESTED with this starter. Check every field against Vapi's current API docs
// (outbound call endpoint, phone number id, variable values) before relying on it, then mark it tested.
// env: VAPI_API_KEY, VAPI_ASSISTANT_ID, VAPI_PHONE_NUMBER_ID
export default {
  async placeCall({ phone, countryCode, personaId }, env) {
    const r = await fetch("https://api.vapi.ai/call", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${env.VAPI_API_KEY}` },
      body: JSON.stringify({
        assistantId: env.VAPI_ASSISTANT_ID,
        phoneNumberId: env.VAPI_PHONE_NUMBER_ID,
        customer: { number: `+${countryCode}${phone}` },
        assistantOverrides: { variableValues: { persona: personaId } },
      }),
    });
    return { ok: r.ok, status: r.status, detail: (await r.text()).slice(0, 300) };
  },
};
