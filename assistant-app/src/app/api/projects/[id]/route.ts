import { session } from "@/lib/session";
import { deleteProject, getProject, saveProject } from "@/lib/store";

type Ctx = { params: Promise<{ id: string }> };

async function own(id: string) {
  const s = await session();
  if (!s.ok || !s.workspace) return { error: Response.json({ error: "Enter the access code first." }, { status: 401 }) };
  const p = await getProject(id);
  if (!p || p.workspace !== s.workspace) return { error: Response.json({ error: "Not found." }, { status: 404 }) };
  return { p, ws: s.workspace };
}

export async function GET(_: Request, { params }: Ctx) {
  const r = await own((await params).id);
  if (r.error) return r.error;
  const { transcript: _t, ...rest } = r.p;
  return Response.json({ project: rest });
}

export async function PATCH(req: Request, { params }: Ctx) {
  const r = await own((await params).id);
  if (r.error) return r.error;
  const { title } = (await req.json().catch(() => ({}))) as { title?: string };
  if (title?.trim()) { r.p.title = title.trim().slice(0, 80); await saveProject(r.p); }
  return Response.json({ ok: true });
}

export async function DELETE(_: Request, { params }: Ctx) {
  const r = await own((await params).id);
  if (r.error) return r.error;
  await deleteProject(r.ws, r.p.id);
  return Response.json({ ok: true });
}
