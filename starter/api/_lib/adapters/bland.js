// Bland AI. NOT YET TESTED with this starter. Check against Bland's current API docs
// (send call endpoint, pathway or task, request data) before relying on it, then mark it tested.
// env: BLAND_API_KEY, BLAND_PATHWAY_ID
export default {
  async placeCall({ phone, countryCode, personaId }, env) {
    const r = await fetch("https://api.bland.ai/v1/calls", {
      method: "POST",
      headers: { "Content-Type": "application/json", authorization: env.BLAND_API_KEY },
      body: JSON.stringify({
        phone_number: `+${countryCode}${phone}`,
        pathway_id: env.BLAND_PATHWAY_ID,
        request_data: { persona: personaId },
      }),
    });
    return { ok: r.ok, status: r.status, detail: (await r.text()).slice(0, 300) };
  },
};
