import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { Redis } from "@upstash/redis";
import { env } from "./env";
import type { Project, ProjectSummary, AssetKind } from "./types";

// One small key-value interface. Upstash Redis when it is configured (Vercel),
// JSON files under .data/ otherwise (local development).
interface KV {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  del(key: string): Promise<void>;
}

class FileKV implements KV {
  // On Vercel only /tmp is writable, and it is per instance: use Upstash there.
  dir = process.env.VERCEL ? "/tmp/bd-data" : path.resolve(process.cwd(), ".data");
  private file(key: string) { return path.join(this.dir, encodeURIComponent(key)); }
  async get(key: string) {
    try { return await fs.readFile(this.file(key), "utf8"); } catch { return null; }
  }
  async set(key: string, value: string) {
    await fs.mkdir(this.dir, { recursive: true });
    const tmp = this.file(key) + ".tmp";
    await fs.writeFile(tmp, value);
    await fs.rename(tmp, this.file(key));
  }
  async del(key: string) { await fs.rm(this.file(key), { force: true }); }
}

class RedisKV implements KV {
  constructor(private r: Redis) {}
  async get(key: string) {
    const v = await this.r.get<string>(key);
    if (v == null) return null;
    return typeof v === "string" ? v : JSON.stringify(v);
  }
  async set(key: string, value: string) { await this.r.set(key, value); }
  async del(key: string) { await this.r.del(key); }
}

let kv: KV | null = null;
function store(): KV {
  if (kv) return kv;
  const url = env("KV_REST_API_URL") ?? env("UPSTASH_REDIS_REST_URL");
  const token = env("KV_REST_API_TOKEN") ?? env("UPSTASH_REDIS_REST_TOKEN");
  kv = url && token ? new RedisKV(new Redis({ url, token, automaticDeserialization: false })) : new FileKV();
  return kv;
}

export function storageKind() {
  return store() instanceof RedisKV ? "redis" : "files";
}

const pKey = (id: string) => `project:${id}`;
const wKey = (ws: string) => `workspace:${ws}`;

export async function getProject(id: string): Promise<Project | null> {
  const raw = await store().get(pKey(id));
  return raw ? (JSON.parse(raw) as Project) : null;
}

export async function saveProject(p: Project): Promise<void> {
  p.updated_at = Date.now();
  // Photos are written by a separate request; never let a stale copy drop them.
  const stored = await getProject(p.id);
  if (stored?.assets.photos) {
    const ids = new Set((p.assets.personas ?? []).map((x) => x.id));
    const merged = { ...stored.assets.photos, ...(p.assets.photos ?? {}) };
    p.assets.photos = Object.fromEntries(Object.entries(merged).filter(([id]) => ids.has(id)));
  }
  await store().set(pKey(p.id), JSON.stringify(p));
  const list = await listIds(p.workspace);
  if (!list.includes(p.id)) {
    list.unshift(p.id);
    await store().set(wKey(p.workspace), JSON.stringify(list));
  }
}

async function listIds(ws: string): Promise<string[]> {
  const raw = await store().get(wKey(ws));
  return raw ? (JSON.parse(raw) as string[]) : [];
}

export async function listProjects(ws: string): Promise<ProjectSummary[]> {
  const ids = await listIds(ws);
  const out: ProjectSummary[] = [];
  for (const id of ids) {
    const p = await getProject(id);
    if (!p) continue;
    const has = (Object.keys(p.assets) as (keyof typeof p.assets)[])
      .filter((k) => k !== "photos" && p.assets[k]) as AssetKind[];
    out.push({ id: p.id, title: p.title, updated_at: p.updated_at, colour: p.assets.brief?.colour, has });
  }
  return out.sort((a, b) => b.updated_at - a.updated_at);
}

export async function deleteProject(ws: string, id: string): Promise<void> {
  const ids = (await listIds(ws)).filter((x) => x !== id);
  await store().set(wKey(ws), JSON.stringify(ids));
  await store().del(pKey(id));
}

// Persona photos are stored apart from the project so the project stays small.
export async function savePhoto(key: string, base64: string, mime: string) {
  await store().set(`photo:${key}`, JSON.stringify({ base64, mime }));
}
// Which photo belongs to a persona, kept apart from the project so a photo
// arriving mid-chat never overwrites the project the chat is writing.
export async function setPhotoRef(project: string, persona: string, key: string) {
  await store().set(`photoref:${project}:${persona}`, key);
}
export async function getPhotoRef(project: string, persona: string) {
  return store().get(`photoref:${project}:${persona}`);
}
export async function photoRefs(p: Project): Promise<Record<string, string>> {
  const out: Record<string, string> = { ...(p.assets.photos ?? {}) };
  for (const per of p.assets.personas ?? []) {
    const k = await getPhotoRef(p.id, per.id);
    if (k) out[per.id] = k;
  }
  return out;
}
export async function getPhoto(key: string): Promise<{ base64: string; mime: string } | null> {
  const raw = await store().get(`photo:${key}`);
  return raw ? JSON.parse(raw) : null;
}

// Simple counters for spend limits.
export async function bump(key: string): Promise<number> {
  const raw = await store().get(`count:${key}`);
  const n = (raw ? Number(raw) : 0) + 1;
  await store().set(`count:${key}`, String(n));
  return n;
}
export async function count(key: string): Promise<number> {
  const raw = await store().get(`count:${key}`);
  return raw ? Number(raw) : 0;
}
