import { session } from "@/lib/session";
import { listProjects } from "@/lib/store";

export async function GET() {
  const s = await session();
  if (!s.ok || !s.workspace) return Response.json({ error: "Enter the access code first." }, { status: 401 });
  return Response.json({ projects: await listProjects(s.workspace), name: s.name });
}
