"use client";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import clsx from "clsx";
import { ChevronsLeft, Menu, PanelRightOpen, SquarePen, Trash2, Search, LogOut, FileText, MessageSquare } from "lucide-react";
import type { AssetKind, ProjectSummary } from "@/lib/types";
import { COLOURS } from "@/lib/types";
import { useAssistant } from "./useAssistant";
import { Composer, EmptyState, Messages } from "./Chat";
import Canvas from "./Canvas";
import { BrandChip } from "./icons";

function group(ps: ProjectSummary[]) {
  const day = 86400000, now = Date.now();
  const g: [string, ProjectSummary[]][] = [["Today", []], ["Previous 7 days", []], ["Older", []]];
  for (const p of ps) (now - p.updated_at < day ? g[0][1] : now - p.updated_at < 7 * day ? g[1][1] : g[2][1]).push(p);
  return g.filter(([, l]) => l.length);
}

const row = "flex h-[28px] w-full items-center gap-2 rounded-[5px] px-2 text-[14px] text-ink-2 transition-colors hover:bg-hover";

function Sidebar({ open, settled, projects, current, name, onNew, onOpen, onDelete, onToggle }: {
  open: boolean; settled: boolean; projects: ProjectSummary[]; current: string | null; name: string | null;
  onNew: () => void; onOpen: (id: string) => void; onDelete: (id: string) => void; onToggle: () => void;
}) {
  const [q, setQ] = useState("");
  const [searching, setSearching] = useState(false);
  const list = projects.filter((p) => p.title.toLowerCase().includes(q.toLowerCase()));
  return (
    <motion.aside initial={false} animate={{ width: open ? 248 : 0 }} transition={{ duration: settled ? 0.2 : 0, ease: [0.2, 0.8, 0.2, 1] }}
      className={clsx(!settled && "max-lg:hidden", "shrink-0 overflow-hidden bg-side shadow-[inset_-1px_0_0_rgba(255,255,255,0.07)] max-lg:fixed max-lg:inset-y-0 max-lg:left-0 max-lg:z-50 max-lg:shadow-pop")}>
      <div className="flex h-full w-[248px] flex-col">
        <div className="group flex h-[52px] items-center gap-2 px-3">
          <BrandChip compact />
          <span className="min-w-0 flex-1" />
          <button onClick={onToggle} aria-label="Close sidebar" className="grid h-6 w-6 place-items-center rounded-[4px] text-faint opacity-0 transition hover:bg-press hover:text-muted group-hover:opacity-100 max-lg:opacity-100">
            <ChevronsLeft className="h-4 w-4" />
          </button>
        </div>
        <div className="px-2.5 pb-2">
          <button onClick={onNew} className="m-btn flex h-9 w-full items-center gap-2 rounded-[8px] border border-brand-line bg-gradient-to-r from-[#123a6b] to-[#0f1c2b] px-3 text-[14px] text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:from-[#16457f]">
            <SquarePen className="h-4 w-4" /> New chat <span className="ml-auto text-[11px] text-muted">⌘K</span>
          </button>
        </div>
        <div className="space-y-px px-1.5">
          <button onClick={() => setSearching((s) => !s)} className={row}><Search className="h-4 w-4 text-faint" /> Search</button>
          {searching && (
            <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search your work"
              className="mx-1 mb-1 h-7 w-[calc(100%-8px)] rounded-[4px] border border-line-2 bg-panel px-2 text-[13px] outline-none focus:border-brand" />
          )}

        </div>
        <div className="scroll-quiet mt-3 min-h-0 flex-1 overflow-y-auto px-1.5 pb-3">
          {group(list).map(([label, items]) => (
            <div key={label} className="mb-3">
              <div className="px-2 pb-1 pt-1 text-[12px] font-medium text-faint">{label}</div>
              {items.map((p) => (
                <div key={p.id} className={clsx("group relative flex items-center rounded-[5px] transition-colors", current === p.id ? "bg-press" : "hover:bg-hover")}>
                  <button onClick={() => onOpen(p.id)} className="flex h-[28px] min-w-0 flex-1 items-center gap-2 px-2 text-left">
                    {p.colour ? <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: COLOURS[p.colour].hex }} /> :
                      p.has.length ? <FileText className="h-4 w-4 shrink-0 text-faint" /> : <MessageSquare className="h-4 w-4 shrink-0 text-faint" />}
                    <span className={clsx("truncate text-[14px]", current === p.id ? "font-medium text-ink" : "text-ink-2")}>{p.title}</span>
                  </button>
                  <button onClick={() => { if (confirm(`Delete "${p.title}"? Its chat and work are removed. The voice bot stays on the voice platform.`)) onDelete(p.id); }}
                    aria-label={`Delete ${p.title}`} className="mr-1 hidden h-6 w-6 shrink-0 place-items-center rounded-[4px] text-faint hover:bg-press hover:text-ink group-hover:grid">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ))}
          {!projects.length && <p className="px-2 pt-2 text-[13px] leading-relaxed text-faint">Your chats and what you build in them are saved here.</p>}
        </div>
        <div className="flex items-center gap-2 px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]">
          <span className="grid h-[22px] w-[22px] place-items-center rounded-[4px] bg-wash text-[12px] font-medium text-ink-2">{(name ?? "Y")[0].toUpperCase()}</span>
          <span className="min-w-0 flex-1 truncate text-[14px] text-ink-2">{name ?? "You"}</span>
          <button aria-label="Sign out" onClick={async () => { await fetch("/api/access", { method: "DELETE" }); window.location.href = "/"; }}
            className="grid h-6 w-6 place-items-center rounded-[4px] text-faint hover:bg-press hover:text-ink"><LogOut className="h-3.5 w-3.5" /></button>
        </div>
      </div>
    </motion.aside>
  );
}

export default function Workspace({ initialId }: { initialId: string | null }) {
  const a = useAssistant(initialId);
  const [side, setSide] = useState(true);
  const [settled, setSettled] = useState(false);
  const [canvasOpen, setCanvasOpen] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const hasAssets = !!a.project && (Object.keys(a.project.assets).some((k) => k !== "photos") || !!a.running);
  const showCanvas = hasAssets && canvasOpen;

  useEffect(() => { if (a.running?.asset) setCanvasOpen(true); }, [a.running]);
  useEffect(() => { if (window.innerWidth < 1024) setSide(false); requestAnimationFrame(() => setSettled(true)); }, []);
  const narrow = () => typeof window !== "undefined" && window.innerWidth < 1024;
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
    <div className="flex h-screen overflow-hidden">
      <Sidebar open={side} settled={settled} projects={a.projects} current={a.project?.id ?? null} name={a.name}
        onNew={() => { a.open(null); if (narrow()) setSide(false); }} onOpen={(id) => { a.open(id); if (narrow()) setSide(false); }}
        onDelete={(id) => a.remove(id)} onToggle={() => setSide(false)} />

      {side && settled && <button aria-label="Close sidebar" onClick={() => setSide(false)} className="fixed inset-0 z-40 bg-[rgba(15,15,15,0.4)] lg:hidden" />}
      <main className="relative flex min-w-0 flex-1">
        <div className={clsx("flex min-w-0 flex-col", showCanvas ? "basis-full lg:basis-[42%] lg:shadow-[inset_-1px_0_0_rgba(255,255,255,0.08)]" : "basis-full")}>
          <div className="flex h-[45px] shrink-0 items-center gap-1 px-3">
            {!side && <button onClick={() => setSide(true)} aria-label="Open sidebar" className="grid h-7 w-7 place-items-center rounded-[4px] text-muted hover:bg-hover"><Menu className="h-4 w-4" /></button>}
            <div className="min-w-0 flex-1 truncate px-1.5 text-[14px] text-ink-2">{a.project?.title ?? "New chat"}</div>
            {hasAssets && !canvasOpen && (
              <button onClick={() => setCanvasOpen(true)} className="flex h-7 items-center gap-1.5 rounded-[4px] px-2 text-[14px] text-muted hover:bg-hover">
                <PanelRightOpen className="h-4 w-4" /> Preview
              </button>
            )}
          </div>
          {a.loading ? <div className="flex-1" /> : !a.project || a.project.ui.length === 0 ? (
            <>
              <EmptyState name={a.name} onPick={(t) => a.send(t)} onSend={a.send} onStop={a.stop} streaming={a.streaming} />
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
            <motion.div key="canvas" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
              className="absolute inset-0 z-30 min-w-0 bg-panel lg:static lg:z-auto lg:flex-1">
              <Canvas projectId={a.project.id} title={a.project.title} assets={a.project.assets} focus={focus} fresh={a.fresh} running={a.running}
                onSeen={a.seen} onClose={() => setCanvasOpen(false)} onPhoto={a.setPhoto} onToast={setToast} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 8, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: 8, x: "-50%" }}
            className="fixed bottom-6 left-1/2 z-[2000] rounded-[6px] bg-[#262626] px-3.5 py-2 text-[14px] text-white shadow-pop">{toast}</motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
