#!/usr/bin/env node
// Manage who can create a saved account (email + password) on the Blue Dots Assistant.
//   node scripts/whitelist.mjs list   --env uat|prod
//   node scripts/whitelist.mjs add    --env uat a@x.org b@y.org
//   node scripts/whitelist.mjs remove --env uat a@x.org
//   node scripts/whitelist.mjs reset  --env uat a@x.org   (forgets their password; they choose a new one at next sign-in)
// Reads the store secrets from raya/.env (ASSISTANT_KV_SECRET_UAT / _PROD). Prints emails only, never secrets.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const envText = fs.readFileSync(path.resolve(here, "..", "..", "raya", ".env"), "utf8");
const val = (k) => envText.match(new RegExp(`^${k}=(.*)$`, "m"))?.[1]?.trim().replace(/^["']|["']$/g, "");
const args = process.argv.slice(2);
const cmd = args[0];
const env = args[args.indexOf("--env") + 1];
const emails = args.slice(1).filter((a, i, all) => a !== "--env" && all[i] !== "--env" && a.includes("@")).map((e) => e.trim().toLowerCase());
if (!["list", "add", "remove", "reset"].includes(cmd) || !["uat", "prod"].includes(env)) {
  console.log("Usage: node scripts/whitelist.mjs list|add|remove|reset --env uat|prod [emails...]");
  process.exit(1);
}
const URL_ = "https://vqvonmoktpvfvzlhtiqo.supabase.co/rest/v1/rpc/";
const KEY = "sb_publishable_dDXgHdCQiEZb4DInN9h_aA_U1csSHkc"; // publishable (public) key; access is checked by the secret
const secret = val(env === "uat" ? "ASSISTANT_KV_SECRET_UAT" : "ASSISTANT_KV_SECRET_PROD");
async function rpc(fn, extra) {
  const r = await fetch(URL_ + fn, { method: "POST", headers: { apikey: KEY, "Content-Type": "application/json" }, body: JSON.stringify({ p_env: env, p_secret: secret, ...extra }) });
  if (!r.ok) throw new Error(`${fn} ${r.status}`);
  return r.status === 204 ? null : r.json();
}
const list = JSON.parse((await rpc("assistant_kv_get", { p_key: "auth:allow" })) ?? "[]");
if (cmd === "add") for (const e of emails) if (!list.includes(e)) list.push(e);
if (cmd === "remove") for (const e of emails) list.splice(list.indexOf(e) >>> 0, list.includes(e) ? 1 : 0);
if (cmd === "add" || cmd === "remove") await rpc("assistant_kv_set", { p_key: "auth:allow", p_value: JSON.stringify(list.sort()) });
if (cmd === "reset") for (const e of emails) { await rpc("assistant_kv_del", { p_key: `user:${e}` }); console.log(`reset: ${e}`); }
console.log(`${env} whitelist (${list.length}): ${list.sort().join(", ") || "(empty)"}`);
