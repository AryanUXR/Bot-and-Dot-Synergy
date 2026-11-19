import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";
import { config } from "./env";

export const ACCESS_COOKIE = "bd_access";
export const WS_COOKIE = "bd_ws";
export const NAME_COOKIE = "bd_name";

export function accessToken(code: string) {
  return crypto.createHash("sha256").update(`bluedots:${code.trim().toLowerCase()}`).digest("hex").slice(0, 32);
}

export function codeMatches(code: string) {
  const a = Buffer.from(accessToken(code));
  const b = Buffer.from(accessToken(config.accessCode));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function session(): Promise<{ ok: boolean; workspace: string | null; name: string | null }> {
  const c = await cookies();
  const ok = c.get(ACCESS_COOKIE)?.value === accessToken(config.accessCode);
  const ws = c.get(WS_COOKIE)?.value ?? null;
  const name = c.get(NAME_COOKIE)?.value ?? null;
  return { ok: ok && !!ws, workspace: ok ? ws : null, name: name ? decodeURIComponent(name) : null };
}
