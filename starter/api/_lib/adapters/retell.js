// Retell AI. NOT YET TESTED with this starter. Check against Retell's current API docs
// (create phone call endpoint, from number, dynamic variables) before relying on it, then mark it tested.
// env: RETELL_API_KEY, RETELL_FROM_NUMBER (E.164, e.g. +1415...), RETELL_AGENT_ID
export default {
  async placeCall({ phone, countryCode, personaId }, env) {
    const r = await fetch("https://api.retellai.com/v2/create-phone-call", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${env.RETELL_API_KEY}` },
      body: JSON.stringify({
        from_number: env.RETELL_FROM_NUMBER,
        to_number: `+${countryCode}${phone}`,
        override_agent_id: env.RETELL_AGENT_ID,
        retell_llm_dynamic_variables: { persona: personaId },
      }),
    });
    return { ok: r.ok, status: r.status, detail: (await r.text()).slice(0, 300) };
  },
};
