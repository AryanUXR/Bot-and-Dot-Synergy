import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { USER_COOKIE, WS_COOKIE, accountWorkspace, cookieOpts, readUser, signUser } from "@/lib/session";
import { isAllowed, getAccount, createAccount, checkPassword, tooManyAttempts, noteFailure, validEmail } from "@/lib/accounts";
import { moveProjects } from "@/lib/store";

const DAYS = 30;
const slow = () => new Promise((r) => setTimeout(r, 500));

// Sign in (or, the first time for a whitelisted email, create the account and choose a password).
export async function POST(req: Request) {
  const { email = "", password = "", name = "" } = (await req.json().catch(() => ({}))) as { email?: string; password?: string; name?: string };
  if (!validEmail(email)) return NextResponse.json({ ok: false, error: "Enter a valid email address." }, { status: 400 });
  if (!(await isAllowed(email))) {
    await slow();
    return NextResponse.json({ ok: false, error: "This email isn't on the list for saved accounts yet. Ask the EkStep team to add it. You can keep using the assistant without signing in." }, { status: 403 });
  }
  if (await tooManyAttempts(email)) return NextResponse.json({ ok: false, error: "Too many tries. Wait an hour and try again." }, { status: 429 });

  let account = await getAccount(email);
  if (!account) {
    if (password.length < 10) return NextResponse.json({ ok: false, needsSetup: true, error: "Choose a password of at least 10 characters." }, { status: 400 });
    if (!name.trim()) return NextResponse.json({ ok: false, needsSetup: true, error: "Add your name." }, { status: 400 });
    account = await createAccount(email, name, password);
  } else if (!(await checkPassword(account, password))) {
    await noteFailure(email);
    await slow();
    return NextResponse.json({ ok: false, error: "That password didn't match. Try again." }, { status: 401 });
  }

  // Bring this browser's guest chats into the account.
  const c = await cookies();
  const guestWs = c.get(WS_COOKIE)?.value ?? "";
  const moved = guestWs && !guestWs.startsWith("u_") ? await moveProjects(guestWs, accountWorkspace(account.email)) : 0;

  const res = NextResponse.json({ ok: true, name: account.name, moved });
  res.cookies.set(USER_COOKIE, signUser(account.email, account.name, DAYS), { ...cookieOpts, maxAge: DAYS * 86400 });
  return res;
}

// Is this email set up yet? Lets the sign-in form ask for a name and new password the first time.
export async function GET(req: Request) {
  const email = new URL(req.url).searchParams.get("email") ?? "";
  if (!validEmail(email)) return NextResponse.json({ allowed: false, exists: false });
  const allowed = await isAllowed(email);
  return NextResponse.json({ allowed, exists: allowed ? !!(await getAccount(email)) : false });
}

// Sign out: back to a fresh guest workspace in this browser.
export async function DELETE() {
  const c = await cookies();
  const res = NextResponse.json({ ok: true, was: readUser(c.get(USER_COOKIE)?.value)?.email ?? null });
  res.cookies.delete(USER_COOKIE);
  return res;
}
