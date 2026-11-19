import "server-only";
import crypto from "node:crypto";
import fs from "node:fs";
import { env } from "./env";

// Persona photos with Gemini. Prefers Vertex AI through the service account
// (GOOGLE_SA_JSON holds the key JSON on the host; GOOGLE_SA_KEY is a path locally),
// and falls back to the Gemini API key.

interface SA { client_email: string; private_key: string; token_uri: string; project_id: string }

function serviceAccount(): SA | null {
  const json = env("GOOGLE_SA_JSON");
  if (json) return JSON.parse(json.trim().startsWith("{") ? json : Buffer.from(json, "base64").toString("utf8"));
  const p = env("GOOGLE_SA_KEY");
  if (p && fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, "utf8"));
  return null;
}

let cached: { token: string; exp: number } | null = null;
async function accessToken(sa: SA) {
  if (cached && cached.exp > Date.now() + 60_000) return cached.token;
  const b64 = (o: object | Buffer) =>
    (Buffer.isBuffer(o) ? o : Buffer.from(JSON.stringify(o))).toString("base64url");
  const now = Math.floor(Date.now() / 1000);
  const unsigned = `${b64({ alg: "RS256", typ: "JWT" })}.${b64({
    iss: sa.client_email, aud: sa.token_uri, iat: now, exp: now + 3600,
    scope: "https://www.googleapis.com/auth/cloud-platform",
  })}`;
  const sig = crypto.createSign("RSA-SHA256").update(unsigned).sign(sa.private_key);
  const r = await fetch(sa.token_uri, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${unsigned}.${b64(sig)}` }),
  });
  if (!r.ok) throw new Error(`token ${r.status}`);
  const j = (await r.json()) as { access_token: string; expires_in: number };
  cached = { token: j.access_token, exp: Date.now() + j.expires_in * 1000 };
  return j.access_token;
}

type Part = { inlineData?: { data: string; mimeType: string } };

export async function generatePortrait(prompt: string): Promise<{ base64: string; mime: string }> {
  const body = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { responseModalities: ["TEXT", "IMAGE"], imageConfig: { aspectRatio: "1:1" } },
  };
  const errors: string[] = [];
  const sa = serviceAccount();
  if (sa) {
    const token = await accessToken(sa);
    for (const model of ["gemini-2.5-flash-image", "gemini-3-pro-image"]) {
      const r = await fetch(
        `https://aiplatform.googleapis.com/v1/projects/${sa.project_id}/locations/global/publishers/google/models/${model}:generateContent`,
        { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(body) },
      );
      if (!r.ok) { errors.push(`vertex ${model} ${r.status}`); continue; }
      const j = (await r.json()) as { candidates?: { content?: { parts?: Part[] } }[] };
      const part = j.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
      if (part?.inlineData) return { base64: part.inlineData.data, mime: part.inlineData.mimeType };
      errors.push(`vertex ${model} no image`);
    }
  }
  const key = env("GEMINI_API_KEY");
  if (key) {
    const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent", {
      method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": key }, body: JSON.stringify(body),
    });
    if (r.ok) {
      const j = (await r.json()) as { candidates?: { content?: { parts?: Part[] } }[] };
      const part = j.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
      if (part?.inlineData) return { base64: part.inlineData.data, mime: part.inlineData.mimeType };
    }
    errors.push(`gemini api ${r.status}`);
  }
  throw new Error(`No image: ${errors.join("; ") || "no image credentials"}`);
}
