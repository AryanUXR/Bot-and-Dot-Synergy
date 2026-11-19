"use client";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import clsx from "clsx";
import { PanelLeft, PanelRightOpen, Plus, Trash2, Search, Map as MapIcon, Phone, FileText, Gauge, Users, Layers, LogOut } from "lucide-react";
import type { AssetKind, ProjectSummary } from "@/lib/types";
import { COLOURS } from "@/lib/types";
import { useAssistant } from "./useAssistant";
import { Composer, EmptyState, Messages } from "./Chat";
import Canvas from "./Canvas";
import { DotsMark } from "./icons";

const HAS_ICON: Record<AssetKind, typeof MapIcon> = { fit: Gauge, brief: FileText, personas: Users, schema: Layers, map: MapIcon, bot: Phone };

function group(ps: ProjectSummary[]) {
  const day = 86400000, now = Date.now();
  const g: [string, ProjectSummary[]][] = [["Today", []], ["This week", []], ["Earlier", []]];
  for (const p of ps) (now - p.updated_at < day ? g[0][1] : now - p.updated_at < 7 * day ? g[1][1] : g[2][1]).push(p);
  return g.filter(([, l]) => l.length);
}

function Sidebar({ open, projects, current, name, onNew, onOpen, onDelete, onToggle }: {
  open: boolean; projects: ProjectSummary[]; current: string | null; name: string | null;
  onNew: () => void; onOpen: (id: string) => void; onDelete: (id: string) => void; onToggle: () => void;
}) {
  const [q, setQ] = useState("");
  const list = projects.filter((p) => p.title.toLowerCase().includes(q.toLowerCase()));
  return (
    <motion.aside initial={false} animate={{ width: open ? 272 : 0 }} transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
      className="shrink-0 overflow-hidden border-r border-line bg-[#f1f3f6]">
      <div className="flex h-full w-[272px] flex-col">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2"><DotsMark className="h-7 w-7" /><span className="text-[14.5px] font-semibold tracking-tight">Blue Dots Assistant</span></div>
          <button onClick={onToggle} aria-label="Close sidebar" className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-white hover:text-ink"><PanelLeft className="h-4 w-4" /></button>
        </div>
        <div className="space-y-2 px-3">
          <button onClick={onNew} className="flex h-10 w-full items-center gap-2 rounded-xl border border-line bg-panel px-3 text-[14px] font-medium text-ink shadow-card transition hover:border-brand-line">
            <Plus className="h-4 w-4 text-brand" /> New conversation <kbd className="ml-auto rounded border border-line px-1.5 text-[11px] text-faint">⌘K</kbd>
          </button>
          <label className="flex h-9 items-center gap-2 rounded-xl px-3 text-muted focus-within:bg-white">
            <Search className="h-3.5 w-3.5" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search your work" className="w-full bg-transparent text-[13.5px] text-ink outline-none placeholder:text-faint" />
          </label>
        </div>
        <div className="scroll-quiet mt-2 min-h-0 flex-1 overflow-y-auto px-2 pb-3">
          {group(list).map(([label, items]) => (
            <div key={label} className="mt-3">
              <div className="px-3 pb-1 text-[11.5px] font-medium text-faint">{label}</div>
              {items.map((p) => (
                <div key={p.id} className={clsx("group relative flex items-center rounded-xl transition", current === p.id ? "bg-white shadow-card" : "hover:bg-white/70")}>
                  <button onClick={() => onOpen(p.id)} className="min-w-0 flex-1 px-3 py-2 text-left">
                    <div className="flex items-center gap-2">
                      {p.colour && <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: COLOURS[p.colour].hex }} />}
                      <span className="truncate text-[13.5px] text-ink">{p.title}</span>
                    </div>
                    {p.has.length > 0 && (
                      <div className="mt-1 flex gap-1 pl-0.5">{p.has.map((k) => { const I = HAS_ICON[k]; return <I key={k} className="h-3 w-3 text-faint" />; })}</div>
                    )}
                  </button>
                  <button onClick={() => { if (confirm(`Delete "${p.title}"? Its chat and assets will be removed. Voice bots stay on the voice platform.`)) onDelete(p.id); }}
                    aria-label="Delete" className="mr-1.5 hidden h-7 w-7 shrink-0 place-items-center rounded-lg text-faint hover:bg-wash hover:text-bad group-hover:grid">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ))}
          {!projects.length && <p className="px-4 pt-6 text-[13px] leading-relaxed text-faint">Your conversations and everything you build are saved here.</p>}
        </div>
        <div className="flex items-center gap-2.5 border-t border-line px-4 py-3">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-brand text-[13px] font-semibold text-white">{(name ?? "Y")[0].toUpperCase()}</div>
          <div className="min-w-0 flex-1"><div className="truncate text-[13.5px] font-medium">{name ?? "You"}</div><div className="text-[11.5px] text-faint">Seeded by EkStep</div></div>
          <button aria-label="Sign out" onClick={async () => { await fetch("/api/access", { method: "DELETE" }); window.location.href = "/"; }}
            className="grid h-8 w-8 place-items-center rounded-lg text-faint hover:bg-white hover:text-ink"><LogOut className="h-3.5 w-3.5" /></button>
        </div>
      </div>
    </motion.aside>
  );
}

export default function Workspace({ initialId }: { initialId: string | null }) {
  const a = useAssistant(initialId);
  const [side, setSide] = useState(true);
  const [canvasOpen, setCanvasOpen] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const hasAssets = !!a.project && (Object.keys(a.project.assets).some((k) => k !== "photos") || !!a.running);
  const showCanvas = hasAssets && canvasOpen;

  useEffect(() => { if (a.running?.asset) setCanvasOpen(true); }, [a.running]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); a.open(null); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [a]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 3200); return () => clearTimeout(t); }, [toast]);
  useEffect(() => { document.title = a.project?.title ? `${a.project.title} · Blue Dots Assistant` : "Blue Dots Assistant"; }, [a.project?.title]);

  const openAsset = useCallback((k: AssetKind) => { setCanvasOpen(true); a.seen(k); }, [a]);
  const [focus, setFocus] = useState<{ kind: AssetKind; n: number } | null>(null);
  useEffect(() => { if (a.focus) setFocus({ kind: a.focus.kind, n: Date.now() }); }, [a.focus]);

  return (
    <div className="flex h-screen overflow-hidden bg-canvas">
      <Sidebar open={side} projects={a.projects} current={a.project?.id ?? null} name={a.name}
        onNew={() => a.open(null)} onOpen={(id) => a.open(id)} onDelete={(id) => a.remove(id)} onToggle={() => setSide(false)} />

      <main className="relative flex min-w-0 flex-1">
        <div className={clsx("flex min-w-0 flex-col transition-[flex-basis] duration-300", showCanvas ? "basis-full lg:basis-[44%] lg:border-r lg:border-line" : "basis-full")}>
          <div className="flex h-14 shrink-0 items-center gap-2 px-3">
            {!side && <button onClick={() => setSide(true)} aria-label="Open sidebar" className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-wash hover:text-ink"><PanelLeft className="h-4 w-4" /></button>}
            <div className="min-w-0 flex-1 truncate px-1 text-[14px] font-medium text-ink-2">{a.project?.title}</div>
            {hasAssets && !canvasOpen && (
              <button onClick={() => setCanvasOpen(true)} className="flex h-8 items-center gap-1.5 rounded-lg border border-line px-3 text-[13px] text-ink-2 hover:bg-wash">
                <PanelRightOpen className="h-3.5 w-3.5" /> Open canvas
              </button>
            )}
          </div>
          {a.loading ? <div className="flex-1" /> : !a.project || a.project.ui.length === 0 ? (
            <>
              <EmptyState name={a.name} onPick={(t) => a.send(t)} />
              <Composer onSend={a.send} onStop={a.stop} streaming={a.streaming} autoFocus />
            </>
          ) : (
            <>
              <Messages ui={a.project.ui} streaming={a.streaming} error={a.error}
                onOpen={(k) => { openAsset(k); setFocus({ kind: k, n: Date.now() }); }}
                onRetry={() => a.send("Please carry on from where you stopped.")} />
              <Composer onSend={a.send} onStop={a.stop} streaming={a.streaming} placeholder="Reply, or ask for a change…" />
            </>
          )}
        </div>

        <AnimatePresence>
          {showCanvas && a.project && (
            <motion.div key="canvas" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 24 }} transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
              className="absolute inset-0 z-30 min-w-0 shadow-pop lg:static lg:z-auto lg:flex-1 lg:shadow-none">
              <Canvas projectId={a.project.id} title={a.project.title} assets={a.project.assets} focus={focus} fresh={a.fresh} running={a.running}
                onSeen={a.seen} onClose={() => setCanvasOpen(false)} onPhoto={a.setPhoto} onToast={setToast} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 12, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: 12, x: "-50%" }}
            className="fixed bottom-6 left-1/2 z-[2000] rounded-xl bg-ink px-4 py-2.5 text-[13.5px] text-white shadow-pop">{toast}</motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
