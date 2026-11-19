import { session } from "@/lib/session";
import AccessGate from "@/components/AccessGate";
import Workspace from "@/components/Workspace";

export default async function Conversation({ params }: { params: Promise<{ id: string }> }) {
  const s = await session();
  const { id } = await params;
  return s.ok ? <Workspace initialId={id} /> : <AccessGate />;
}
