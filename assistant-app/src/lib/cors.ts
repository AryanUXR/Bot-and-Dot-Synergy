// Lets the public prototype viewer (a Lovable site) read prototypes and place calls.
// Only these origins get CORS headers; everything else is same-origin as before.
const ALLOWED = [/^https:\/\/[a-z0-9-]+\.lovable\.app$/, /^https:\/\/[a-z0-9-]+\.lovableproject\.com$/, /^http:\/\/localhost:\d+$/];
const extra = (process.env.VIEWER_ORIGINS ?? "").split(",").map((s) => s.trim()).filter(Boolean);

export function corsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") ?? "";
  if (!origin || !(extra.includes(origin) || ALLOWED.some((re) => re.test(origin)))) return {};
  return { "Access-Control-Allow-Origin": origin, "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Max-Age": "86400", Vary: "Origin" };
}

export function preflight(req: Request) {
  return new Response(null, { status: 204, headers: corsHeaders(req) });
}
