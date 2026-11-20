import { NextResponse, type NextRequest } from "next/server";

// Give every browser a guest workspace on its first visit, so anyone can use the assistant
// without a code. The cookie is also added to this request, so the page can read it at once.
const WS_COOKIE = "bd_ws";
const YEAR = 60 * 60 * 24 * 365;

export function middleware(req: NextRequest) {
  if (req.cookies.get(WS_COOKIE)?.value) return NextResponse.next();
  const ws = "g_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16);
  const headers = new Headers(req.headers);
  headers.set("cookie", [req.headers.get("cookie"), `${WS_COOKIE}=${ws}`].filter(Boolean).join("; "));
  const res = NextResponse.next({ request: { headers } });
  res.cookies.set(WS_COOKIE, ws, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: YEAR });
  return res;
}

export const config = {
  // Pages and the APIs that need a workspace; not static files, public share pages or the public API.
  matcher: ["/", "/c/:path*", "/api/chat", "/api/projects/:path*", "/api/photo/:path*", "/api/auth/:path*", "/api/dev/:path*"],
};
