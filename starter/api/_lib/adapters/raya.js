// Raya (LitWiz Labs). TESTED with this starter.
// env: RAYA_API_KEY, RAYA_AGENT_ID, optional RAYA_BASE_URL (default https://v1.getraya.app), CALL_TIMEZONE
// Never send out_did: let Raya pick the outbound number (LESSONS.md).
export default {
  async placeCall({ phone, countryCode, personaId }, env) {
    const base = (env.RAYA_BASE_URL || "https://v1.getraya.app").replace(/\/$/, "");
    const body = JSON.stringify({
      agent_id: env.RAYA_AGENT_ID,
      to_number: phone,
      country_code: countryCode,
      agent_args: personaId ? { persona: personaId } : undefined,
      timezone: env.CALL_TIMEZONE || "Asia/Kolkata",
    });
    for (let attempt = 0; attempt < 3; attempt++) {
      const r = await fetch(`${base}/api/call`, {
        method: "POST", headers: { "Content-Type": "application/json", "X-API-Key": env.RAYA_API_KEY }, body,
      });
      const text = await r.text();
      if (r.status === 429 && attempt < 2) { await new Promise(s => setTimeout(s, 15000)); continue; }
      return { ok: r.ok, status: r.status, detail: text.slice(0, 300) };
    }
  },
};
