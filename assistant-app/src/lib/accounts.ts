import "server-only";
import crypto from "node:crypto";
import { promisify } from "node:util";
import { kvGet, kvSet, bump, count } from "./store";

// Accounts for saving work: only whitelisted emails can have one. The first time a whitelisted
// person signs in, they choose their password; after that they sign in with it. Passwords are
// never stored, only a salted scrypt hash. The whitelist is the store key "auth:allow" (a JSON
// list), managed with scripts/whitelist.mjs, plus any emails in the ALLOWED_EMAILS setting.
const scrypt = promisify(crypto.scrypt) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;
const norm = (e: string) => e.trim().toLowerCase();
export const validEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.trim());

export interface Account { email: string; name: string; salt: string; hash: string; created_at: number }

export async function isAllowed(email: string): Promise<boolean> {
  const e = norm(email);
  const fromEnv = (process.env.ALLOWED_EMAILS ?? "").split(",").map(norm).filter(Boolean);
  if (fromEnv.includes(e)) return true;
  const raw = await kvGet("auth:allow");
  const list: string[] = raw ? JSON.parse(raw) : [];
  return list.map(norm).includes(e);
}

export async function getAccount(email: string): Promise<Account | null> {
  const raw = await kvGet(`user:${norm(email)}`);
  return raw ? (JSON.parse(raw) as Account) : null;
}

export async function createAccount(email: string, name: string, password: string): Promise<Account> {
  const salt = crypto.randomBytes(16);
  const hash = await scrypt(password, salt, 64);
  const a: Account = { email: norm(email), name: name.trim().slice(0, 40), salt: salt.toString("base64"), hash: hash.toString("base64"), created_at: Date.now() };
  await kvSet(`user:${a.email}`, JSON.stringify(a));
  return a;
}

export async function checkPassword(a: Account, password: string): Promise<boolean> {
  const got = await scrypt(password, Buffer.from(a.salt, "base64"), 64);
  const want = Buffer.from(a.hash, "base64");
  return got.length === want.length && crypto.timingSafeEqual(got, want);
}

// At most 8 wrong passwords per email per hour.
export async function tooManyAttempts(email: string): Promise<boolean> {
  return (await count(`login-fail:${norm(email)}:${new Date().toISOString().slice(0, 13)}`)) >= 8;
}
export async function noteFailure(email: string) {
  await bump(`login-fail:${norm(email)}:${new Date().toISOString().slice(0, 13)}`).catch(() => {});
}
