import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProject, photoRefs } from "@/lib/store";
import SharePage from "@/components/SharePage";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProject((await params).id);
  const b = p?.assets.brief;
  return { title: b ? `${b.bot_name} · ${b.title}` : "Blue Dots", description: b?.tagline };
}

export default async function Share({ params }: Props) {
  const p = await getProject((await params).id);
  if (!p?.assets.brief) notFound();
  const { brief, personas, schema, map, bot } = p.assets;
  const photos = await photoRefs(p);
  return <SharePage projectId={p.id} assets={{ brief, personas, schema, map, photos, bot: bot ? { ...bot, agent_id: "" } : undefined }} />;
}
