import { session } from "@/lib/session";
import { listProjects } from "@/lib/store";

export async function GET() {
  const s = await session();
  if (!s.ok || !s.workspace) return Response.json({ error: "Reload the page and try again." }, { status: 401 });
  return Response.json({ projects: await listProjects(s.workspace), name: s.name, email: s.email, guest: s.guest });
}
