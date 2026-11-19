import { session } from "@/lib/session";
import AccessGate from "@/components/AccessGate";
import Workspace from "@/components/Workspace";

export default async function Home() {
  const s = await session();
  return s.ok ? <Workspace initialId={null} /> : <AccessGate />;
}
