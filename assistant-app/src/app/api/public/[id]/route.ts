import { getProject } from "@/lib/store";

// Read-only data for the public share page: the assets only, never the chat.
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const p = await getProject((await params).id);
  if (!p || !p.assets.brief) return Response.json({ error: "Not found." }, { status: 404 });
  const { brief, personas, schema, map, bot, photos } = p.assets;
  return Response.json({
    id: p.id, title: p.title,
    assets: { brief, personas, schema, map, photos, bot: bot ? { name: bot.name, language: bot.language, live: true } : undefined },
  });
}
