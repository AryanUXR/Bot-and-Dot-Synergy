import Workspace from "@/components/Workspace";

// Open to anyone: middleware.ts gives each browser a guest workspace.
export default function Home() {
  return <Workspace initialId={null} />;
}
