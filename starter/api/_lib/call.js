// Platform-neutral call handler. Uses only web-standard Request/Response, so it runs on
// Vercel, Netlify, Cloudflare and the local dev server unchanged.
// The voice platform is chosen by VOICE_PLATFORM and lives in ./adapters/<name>.js.
import raya from "./adapters/raya.js";
import vapi from "./adapters/vapi.js";
import retell from "./adapters/retell.js";
import bland from "./adapters/bland.js";

const ADAPTERS = { raya, vapi, retell, bland };
const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

export async function handleCall(request, env) {
  if (request.method !== "POST") return json({ success: false, message: "Use POST." }, 405);
  let body;
  try { body = await request.json(); } catch { return json({ success: false, message: "Bad request." }, 400); }

  const phone = String(body.phone || "").replace(/\D/g, "");
  const countryCode = String(body.countryCode || "").replace(/\D/g, "");
  const personaId = String(body.personaId || "");
  if (phone.length < 6 || phone.length > 15 || !countryCode) {
    return json({ success: false, message: "Enter a valid phone number." }, 400);
  }
  // Optional: only allow persona ids you publish (comma-separated), so the endpoint can't be used for anything else.
  const allowed = (env.ALLOWED_PERSONAS || "").split(",").map(s => s.trim()).filter(Boolean);
  if (allowed.length && !allowed.includes(personaId)) return json({ success: false, message: "Unknown persona." }, 400);

  const name = (env.VOICE_PLATFORM || "raya").toLowerCase();
  if (name === "none") return json({ success: false, message: "Calls are being set up. Please check back soon." }, 200);
  const adapter = ADAPTERS[name];
  if (!adapter) return json({ success: false, message: "Calling is not set up yet." }, 500);

  try {
    const r = await adapter.placeCall({ phone, countryCode, personaId }, env);
    if (r.ok) return json({ success: true });
    console.error(`[${name}] call failed`, r.status, r.detail);   // details stay in server logs, never in the browser
    if (r.status === 429) return json({ success: false, message: "Our calling service is busy. Try again in a minute." }, 200);
    return json({ success: false, message: "The call could not be placed. Please try again later." }, 200);
  } catch (e) {
    console.error(`[${name}] error`, e);
    return json({ success: false, message: "The call could not be placed. Please try again later." }, 200);
  }
}
