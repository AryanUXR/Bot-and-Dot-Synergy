import { getProject, saveProject, bump } from "@/lib/store";
import { placeCall } from "@/lib/raya";
import { config } from "@/lib/env";
import { corsHeaders, preflight } from "@/lib/cors";

export const OPTIONS = preflight;

export const runtime = "nodejs";

// Places a real call from a project's voice bot. Used by the canvas and the public
// share page, so it is capped per project rather than gated by the access code.
export async function POST(req: Request) {
  const cors = corsHeaders(req);
  const { projectId, personaId, phone, countryCode } = (await req.json().catch(() => ({}))) as Record<string, string>;
  const digits = String(phone ?? "").replace(/\D/g, "");
  const cc = String(countryCode ?? "91").replace(/\D/g, "") || "91";
  if (digits.length < 8 || digits.length > 13) return Response.json({ ok: false, message: "Enter a valid phone number." }, { status: 400, headers: cors });
  const p = projectId ? await getProject(projectId) : null;
  if (!p?.assets.bot) return Response.json({ ok: false, message: "This bot isn't set up yet." }, { status: 404, headers: cors });
  const persona = p.assets.personas?.find((x) => x.id === personaId);
  if (!persona) return Response.json({ ok: false, message: "Pick a persona first." }, { status: 400, headers: cors });
  const n = await bump(`calls:${p.id}`);
  if (n > config.maxCallsPerProject) return Response.json({ ok: false, message: "This demo has used all its calls for now." }, { status: 429, headers: cors });

  const r = await placeCall(p.assets.bot.agent_id, digits, cc, persona.id);
  if (!r.ok) {
    console.error("[call]", r.status, JSON.stringify(r.data).slice(0, 300));
    return Response.json({ ok: false, message: r.status === 429 ? "The calling service is busy. Try again in a minute." : "The call couldn't be placed. Try again in a moment." }, { status: 502, headers: cors });
  }
  p.assets.bot.calls = (p.assets.bot.calls ?? 0) + 1;
  await saveProject(p);
  return Response.json({ ok: true }, { headers: cors });
}
