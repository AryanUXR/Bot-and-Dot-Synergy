import "server-only";
import fs from "node:fs";
import path from "node:path";

// Keys come from the host's environment. In local development they may also live in
// the repo's raya/.env (never committed), so the team keeps one key file.
let loaded = false;
function loadRepoEnv() {
  if (loaded) return;
  loaded = true;
  const file = path.resolve(process.cwd(), "..", "raya", ".env");
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#") || !t.includes("=")) continue;
    const i = t.indexOf("=");
    const k = t.slice(0, i).trim();
    const v = t.slice(i + 1).trim().replace(/^["']|["']$/g, "");
    if (!(k in process.env) || !process.env[k]) process.env[k] = v;
  }
}

export function env(name: string): string | undefined {
  loadRepoEnv();
  return process.env[name] || undefined;
}

export const config = {
  get anthropicKey() { return env("ANTHROPIC_API_KEY"); },
  get rayaKey() { return env("RAYA_API_TOKEN") ?? env("RAYA_API_KEY"); },
  get rayaBase() { return (env("RAYA_BASE_URL") ?? "https://v1.getraya.app").replace(/\/$/, ""); },
  get geminiKey() { return env("GEMINI_API_KEY"); },
  get accessCode() { return env("ACCESS_CODE") ?? "bluedots"; },
  get model() { return env("ASSISTANT_MODEL") ?? "claude-opus-5-5"; },
  get maxBotsPerWorkspace() { return Number(env("MAX_BOTS_PER_WORKSPACE") ?? 6); },
  get maxCallsPerProject() { return Number(env("MAX_CALLS_PER_PROJECT") ?? 15); },
};
