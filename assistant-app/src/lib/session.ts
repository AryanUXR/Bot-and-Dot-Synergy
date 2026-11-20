import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";

// Anyone can use the assistant. Each browser gets a guest workspace (cookie bd_ws, set by
// middleware.ts). People on the whitelist can sign in with email and password (lib/accounts.ts);
// then their work lives in an account workspace they can open from any device.
export const WS_COOKIE = "bd_ws";
export const USER_COOKIE = "bd_user";
export const YEAR = 60 * 60 * 24 * 365;

const secret = () => crypto.createHash("sha256").update(`bd-auth:${process.env.AUTH_SECRET ?? process.env.KV_SECRET ?? "local-dev-only"}`).digest();

export const accountWorkspace = (email: string) => "u_" + crypto.createHmac("sha256", secret()).update(email.toLowerCase()).digest("hex").slice(0, 20);

// A signed, expiring token naming the signed-in email: base64url(json).hmac
export function signUser(email: string, name: string, days = 30): string {
  const body = Buffer.from(JSON.stringify({ e: email.toLowerCase(), n: name, x: Date.now() + days * 864e5 })).toString("base64url");
  const mac = crypto.createHmac("sha256", secret()).update(body).digest("base64url");
  return `${body}.${mac}`;
}
export function readUser(token?: string | null): { email: string; name: string } | null {
  if (!token) return null;
  const [body, mac] = token.split(".");
  if (!body || !mac) return null;
  const want = crypto.createHmac("sha256", secret()).update(body).digest("base64url");
  if (want.length !== mac.length || !crypto.timingSafeEqual(Buffer.from(want), Buffer.from(mac))) return null;
  try {
    const j = JSON.parse(Buffer.from(body, "base64url").toString()) as { e: string; n: string; x: number };
    return j.x > Date.now() ? { email: j.e, name: j.n } : null;
  } catch { return null; }
}

export const cookieOpts = { httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/" };

export interface Session { ok: boolean; workspace: string | null; guestWorkspace: string | null; name: string | null; email: string | null; guest: boolean }

export async function session(): Promise<Session> {
  const c = await cookies();
  const guestWs = c.get(WS_COOKIE)?.value ?? null;
  const user = readUser(c.get(USER_COOKIE)?.value);
  if (user) return { ok: true, workspace: accountWorkspace(user.email), guestWorkspace: guestWs, name: user.name || null, email: user.email, guest: false };
  return { ok: !!guestWs, workspace: guestWs, guestWorkspace: guestWs, name: null, email: null, guest: true };
}

// A one-way hash of the caller's network address, for per-network limits (never stored raw).
export function networkId(req: Request): string {
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || req.headers.get("x-real-ip") || "local";
  return crypto.createHmac("sha256", secret()).update(`ip:${ip}`).digest("hex").slice(0, 16);
}
