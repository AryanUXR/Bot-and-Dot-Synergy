import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { ACCESS_COOKIE, NAME_COOKIE, WS_COOKIE, accessToken, codeMatches } from "@/lib/session";
import { config } from "@/lib/env";
import { cookies } from "next/headers";

const YEAR = 60 * 60 * 24 * 365;

export async function POST(req: Request) {
  const { code, name } = (await req.json().catch(() => ({}))) as { code?: string; name?: string };
  if (!code || !codeMatches(code)) {
    await new Promise((r) => setTimeout(r, 600)); // slow down guessing
    return NextResponse.json({ ok: false, error: "That code didn't work. Check it and try again." }, { status: 401 });
  }
  const c = await cookies();
  const existing = c.get(WS_COOKIE)?.value;
  const res = NextResponse.json({ ok: true });
  const opts = { httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/", maxAge: YEAR };
  res.cookies.set(ACCESS_COOKIE, accessToken(config.accessCode), opts);
  res.cookies.set(WS_COOKIE, existing ?? nanoid(16), opts);
  const clean = (name ?? "").trim().slice(0, 40);
  if (clean) res.cookies.set(NAME_COOKIE, encodeURIComponent(clean), opts);
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(ACCESS_COOKIE);
  return res;
}
