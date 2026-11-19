import "server-only";
import { config } from "./env";

// Language and voice ids taken from live Blue Dots agents on our Raya account.
export const LANGUAGES: Record<string, { language_id: string; female: string; male: string }> = {
  Hindi: { language_id: "38695ff2-ee6f-4a1c-837b-27ab241377f7", female: "bc303a66-1fb8-4e66-9b15-7b9b71567003", male: "9a1dd39c-5125-4c63-afc7-ae9f917a8111" },
  Hinglish: { language_id: "38695ff2-ee6f-4a1c-837b-27ab241377f7", female: "bc303a66-1fb8-4e66-9b15-7b9b71567003", male: "9a1dd39c-5125-4c63-afc7-ae9f917a8111" },
  English: { language_id: "14b8d8a0-5c56-450d-877d-cd3d7d922a00", female: "f6bf3b4d-babf-4740-856f-ba68cbc1e0c3", male: "f6bf3b4d-babf-4740-856f-ba68cbc1e0c3" },
  Kannada: { language_id: "ac4d6be6-3da2-4936-a841-0b23c7323446", female: "c343cabe-629e-48f6-998d-7fa4d6d3c20a", male: "c343cabe-629e-48f6-998d-7fa4d6d3c20a" },
  Marathi: { language_id: "9046a14a-e2f6-46df-95e8-3a9883ca40f7", female: "daf1d34b-e65c-4553-88fe-54d66c10b912", male: "daf1d34b-e65c-4553-88fe-54d66c10b912" },
  Telugu: { language_id: "100912e7-cf45-46f8-af36-713699e1deff", female: "ab1f540f-90d4-4d23-b5ec-a4bf5197a402", male: "ab1f540f-90d4-4d23-b5ec-a4bf5197a402" },
  Odia: { language_id: "3d733888-98ca-4d4f-87d6-7bf278caa480", female: "a5784bf2-f79b-4f84-bbde-75323d533dc1", male: "a5784bf2-f79b-4f84-bbde-75323d533dc1" },
  Assamese: { language_id: "795a422d-62df-49cc-ba85-b268b384bf48", female: "227e27f1-83c5-4771-b08f-35f3ed512b79", male: "227e27f1-83c5-4771-b08f-35f3ed512b79" },
};

async function raya(method: string, path: string, body?: unknown) {
  const key = config.rayaKey;
  if (!key) throw new Error("Voice platform key is not configured");
  const r = await fetch(`${config.rayaBase}${path}`, {
    method,
    headers: { "X-API-Key": key, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await r.text();
  let data: unknown = null;
  try { data = JSON.parse(text); } catch { data = text; }
  return { ok: r.ok, status: r.status, data };
}

export async function createAgent(opts: {
  name: string; instructions: string; language: string; gender: "female" | "male"; overtime_line: string;
}): Promise<string> {
  const lang = LANGUAGES[opts.language] ?? LANGUAGES.Hindi;
  const res = await raya("POST", "/api/agent", {
    name: opts.name,
    instructions: opts.instructions,
    language_id: lang.language_id,
    voice_id: opts.gender === "male" ? lang.male : lang.female,
    max_call_duration_mins: 4,
    call_duration_exceed_message: opts.overtime_line,
    allow_interruption: true,
  });
  if (!res.ok) throw new Error(`Agent not created (${res.status})`);
  const d = res.data as { uuid?: string; id?: string; agent?: { uuid?: string; id?: string } };
  const id = d.uuid ?? d.id ?? d.agent?.uuid ?? d.agent?.id;
  if (!id) throw new Error("Agent created but no id returned");
  // A lost first reply used to end calls in silence; nudge after 5 s (LESSONS 79).
  await raya("PATCH", `/api/agent/${id}`, { allowed_silence_before_nudge: 5 });
  return id;
}

export async function updateAgentInstructions(id: string, instructions: string) {
  const res = await raya("PATCH", `/api/agent/${id}`, { instructions });
  if (!res.ok) throw new Error(`Agent not updated (${res.status})`);
}

export async function placeCall(agentId: string, phone: string, countryCode: string, persona: string) {
  const body = { agent_id: agentId, to_number: phone, country_code: countryCode, agent_args: { persona }, timezone: "Asia/Kolkata" };
  for (let attempt = 0; attempt < 3; attempt++) {
    const r = await raya("POST", "/api/call", body);
    if (r.status === 429 && attempt < 2) { await new Promise((s) => setTimeout(s, 8000)); continue; }
    return r;
  }
  return { ok: false, status: 429, data: null };
}
