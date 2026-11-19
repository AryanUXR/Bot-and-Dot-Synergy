"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import clsx from "clsx";
import { Phone, Map as MapIcon } from "lucide-react";
import type { Assets } from "@/lib/types";
import BotPanel from "./BotPanel";

const MapView = dynamic(() => import("./MapView"), { ssr: false, loading: () => <div className="skeleton h-full w-full rounded-none" /> });

export default function SharePage({ projectId, assets }: { projectId: string; assets: Assets }) {
  const tabs = [assets.bot && "bot", assets.map && "map"].filter(Boolean) as ("bot" | "map")[];
  const [tab, setTab] = useState<"bot" | "map">(tabs[0] ?? "map");
  if (!tabs.length) {
    return <div className="grid min-h-screen place-items-center p-8 text-center text-muted">This prototype is still being built. Check back soon.</div>;
  }
  return (
    <div className="flex h-screen flex-col bg-canvas">
      {tabs.length > 1 && (
        <div className="absolute right-4 top-5 z-[1000] flex gap-1 rounded-xl bg-white/95 p-1 shadow-pop">
          {tabs.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={clsx("flex h-8 items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium", tab === t ? "bg-brand text-white" : "text-ink-2 hover:bg-wash")}>
              {t === "bot" ? <Phone className="h-3.5 w-3.5" /> : <MapIcon className="h-3.5 w-3.5" />}{t === "bot" ? "Call the bot" : "See the map"}
            </button>
          ))}
        </div>
      )}
      <div className="relative min-h-0 flex-1 overflow-y-auto">
        {tab === "bot" && assets.bot ? <BotPanel projectId={projectId} assets={assets} publicView /> :
          assets.map ? <div className="absolute inset-0"><MapView map={assets.map} schema={assets.schema} personas={assets.personas} /></div> : null}
      </div>
    </div>
  );
}
