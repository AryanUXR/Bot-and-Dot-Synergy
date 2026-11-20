import { getProject, photoRefs } from "@/lib/store";
import { corsHeaders, preflight } from "@/lib/cors";

// Read-only data for public prototype pages (the share page and the Lovable viewer).
// The assets only: never the chat, the bot's instructions or its voice-platform id.
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const cors = corsHeaders(req);
  const p = await getProject((await params).id);
  if (!p || !p.assets.brief) return Response.json({ error: "Not found." }, { status: 404, headers: cors });
  const { brief, personas, schema, map, bot } = p.assets;
  const base = new URL(req.url).origin;
  const refs = await photoRefs(p);
  return Response.json({
    id: p.id,
    updated_at: p.updated_at,
    // Older builds lack the library fields; fill them from what they have.
    brief: {
      ...brief,
      heading: brief.heading ?? `Pick someone to be, and ${brief.bot_name} will call you.`,
      subheading: brief.subheading ?? `Each persona is a fictional person in ${brief.place}. Take the call as them and ask what they would ask.`,
    },
    personas: (personas ?? []).map(({ photo_prompt: _omit, ...x }) => ({
      ...x,
      traits: x.traits ?? [`${x.age}, ${x.occupation}`, `Lives in ${x.area}`, x.need],
      questions: x.questions ?? [],
      photo_url: refs[x.id] ? `${base}/api/photo/${p.id}/${x.id}` : null,
    })),
    schema,
    map: map ? { ...map, dots: map.dots.map((d) => ({ ...d, org_type: d.org_type ?? (d.kind === "request" ? "Request" : schema?.sectors.find((s) => s.id === d.sector)?.label ?? "Provider"), offers: d.offers ?? [] })) } : null,
    bot: bot ? { name: bot.name, language: bot.language, voice_gender: bot.voice_gender, greeting: bot.greeting, live: !!bot.agent_id } : null,
    call: { url: `${base}/api/call`, body: { projectId: p.id, personaId: "<persona id>", phone: "<digits>", countryCode: "91" } },
  }, { headers: { ...cors, "Cache-Control": "public, max-age=60" } });
}

export const OPTIONS = preflight;
