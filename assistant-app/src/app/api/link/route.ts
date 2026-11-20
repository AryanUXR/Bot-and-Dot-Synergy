import { linkKey, readLink } from "@/lib/links";

// Reads one web page for the chat (lib/links.ts). Runs in Mumbai because some Indian government
// sites only answer Indian addresses. Only the chat route calls it, with a key derived from the
// server's secret, so it can't be used as an open proxy.
export const runtime = "nodejs";
export const preferredRegion = "bom1";
export const maxDuration = 45;

export async function POST(req: Request) {
  if (req.headers.get("x-link-key") !== linkKey()) return Response.json({ error: "forbidden" }, { status: 403 });
  const { url } = (await req.json().catch(() => ({}))) as { url?: string };
  if (!url || typeof url !== "string" || url.length > 2000) return Response.json({ error: "bad url" }, { status: 400 });
  return Response.json(await readLink(url));
}
