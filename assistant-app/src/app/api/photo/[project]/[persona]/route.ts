import sharp from "sharp";
import { session } from "@/lib/session";
import { getPhoto, getProject, savePhoto } from "@/lib/store";
import { generatePortrait } from "@/lib/images";

export const runtime = "nodejs";
export const maxDuration = 120;

type Ctx = { params: Promise<{ project: string; persona: string }> };

const inflight = new Map<string, Promise<void>>();

// Public: persona photos appear on shared bot pages too.
export async function GET(_: Request, { params }: Ctx) {
  const { project, persona } = await params;
  const p = await getProject(project);
  const key = p?.assets.photos?.[persona];
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
  if (p.assets.photos?.[persona]) return Response.json({ ok: true, key: p.assets.photos[persona] });

  const job = `${project}:${persona}`;
  if (!inflight.has(job)) {
    inflight.set(job, (async () => {
      const prompt = `${per.photo_prompt}. Photorealistic portrait photograph, head and shoulders, face clearly visible and well lit, warm natural light, Indian setting, shallow depth of field. No text, no logos, no watermarks.`;
      const img = await generatePortrait(prompt);
      const small = await sharp(Buffer.from(img.base64, "base64")).resize(640, 640, { fit: "cover" }).webp({ quality: 82 }).toBuffer();
      const key = `${project}-${persona}-${Date.now()}`;
      await savePhoto(key, small.toString("base64"), "image/webp");
      const fresh = await getProject(project);
      if (fresh) {
        fresh.assets.photos = { ...(fresh.assets.photos ?? {}), [persona]: key };
        const { saveProject } = await import("@/lib/store");
        await saveProject(fresh);
      }
    })().finally(() => setTimeout(() => inflight.delete(job), 1000)));
  }
  try {
    await inflight.get(job);
    const fresh = await getProject(project);
    return Response.json({ ok: true, key: fresh?.assets.photos?.[persona] });
  } catch (e) {
    console.error("[photo]", e);
    return Response.json({ error: "The photo couldn't be made. Try again in a moment." }, { status: 502 });
  }
}
