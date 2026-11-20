import sharp from "sharp";
import { session } from "@/lib/session";
import { getPhoto, getPhotoRef, getProject, savePhoto, setPhotoRef } from "@/lib/store";
import { generatePortrait } from "@/lib/images";

export const runtime = "nodejs";
export const maxDuration = 120;

type Ctx = { params: Promise<{ project: string; persona: string }> };

const inflight = new Map<string, Promise<string>>();

// Public: persona photos appear on shared bot pages too.
export async function GET(_: Request, { params }: Ctx) {
  const { project, persona } = await params;
  const key = (await getPhotoRef(project, persona)) ?? (await getProject(project))?.assets.photos?.[persona];
  if (!key) return new Response(null, { status: 404 });
  const img = await getPhoto(key);
  if (!img) return new Response(null, { status: 404 });
  return new Response(Buffer.from(img.base64, "base64"), {
    headers: { "Content-Type": img.mime, "Cache-Control": "public, max-age=31536000, immutable" },
  });
}

// Owner only: generate the persona's photo if it doesn't exist yet.
export async function POST(_: Request, { params }: Ctx) {
  const { project, persona } = await params;
  const s = await session();
  if (!s.ok) return Response.json({ error: "Enter the access code first." }, { status: 401 });
  const p = await getProject(project);
  if (!p || p.workspace !== s.workspace) return Response.json({ error: "Not found." }, { status: 404 });
  const per = p.assets.personas?.find((x) => x.id === persona);
  if (!per) return Response.json({ error: "No such persona." }, { status: 404 });
  const existing = await getPhotoRef(project, persona);
  if (existing) return Response.json({ ok: true, key: existing });

  const job = `${project}:${persona}`;
  if (!inflight.has(job)) {
    inflight.set(job, (async () => {
      const prompt = `${per.photo_prompt}. Photorealistic portrait photograph, head and shoulders, face clearly visible and well lit, warm natural light, Indian setting, shallow depth of field. No text, no logos, no watermarks.`;
      const img = await generatePortrait(prompt);
      const small = await sharp(Buffer.from(img.base64, "base64")).resize(640, 640, { fit: "cover" }).webp({ quality: 82 }).toBuffer();
      const key = `${project}-${persona}-${Date.now()}`;
      await savePhoto(key, small.toString("base64"), "image/webp");
      await setPhotoRef(project, persona, key);
      return key;
    })().finally(() => setTimeout(() => inflight.delete(job), 1000)));
  }
  try {
    const key = await inflight.get(job)!;
    return Response.json({ ok: true, key });
  } catch (e) {
    console.error("[photo]", e);
    return Response.json({ error: "The photo couldn't be made. Try again in a moment." }, { status: 502 });
  }
}
