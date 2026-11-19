"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import clsx from "clsx";
import {
  Gauge, FileText, Users, Layers, Map as MapIcon, Phone, Check, Minus, X, Lock, Globe, Link2, Loader2, PanelRightClose, Quote, Sparkles,
} from "lucide-react";
import type { AssetKind, Assets, Persona } from "@/lib/types";
import { COLOURS } from "@/lib/types";
import { SectorIcon } from "./icons";
import BotPanel from "./BotPanel";
import { TOOL_LABEL } from "./useAssistant";

const MapView = dynamic(() => import("./MapView"), { ssr: false, loading: () => <div className="skeleton h-full w-full rounded-none" /> });

const TABS: { kind: AssetKind; label: string; icon: typeof MapIcon }[] = [
  { kind: "fit", label: "Fit", icon: Gauge },
  { kind: "brief", label: "Brief", icon: FileText },
  { kind: "personas", label: "Personas", icon: Users },
  { kind: "schema", label: "Schema", icon: Layers },
  { kind: "map", label: "Map", icon: MapIcon },
  { kind: "bot", label: "Bot", icon: Phone },
];

export default function Canvas({ projectId, title, assets, focus, fresh, running, onSeen, onClose, onPhoto, onToast }: {
  projectId: string; title: string; assets: Assets; focus: { kind: AssetKind; n: number } | null; fresh: Set<AssetKind>;
  running: { name: string; asset?: AssetKind } | null; onSeen: (k: AssetKind) => void; onClose: () => void;
  onPhoto: (personaId: string, key: string) => void; onToast: (t: string) => void;
}) {
  const available = TABS.filter((t) => assets[t.kind] || running?.asset === t.kind);
  const [tab, setTab] = useState<AssetKind>(available[available.length - 1]?.kind ?? "brief");
  useEffect(() => { if (focus) setTab(focus.kind); }, [focus]);
  useEffect(() => { if (!assets[tab] && available.length && running?.asset !== tab) setTab(available[available.length - 1].kind); }, [assets, tab, available, running]);
  useEffect(() => { onSeen(tab); }, [tab, fresh, onSeen]);

  const share = async () => {
    const url = `${window.location.origin}/p/${projectId}`;
    await navigator.clipboard.writeText(url);
    onToast("Share link copied. Anyone with it can see the bot page and map.");
  };
  const busyHere = running?.asset === tab && !assets[tab];
  const colour = assets.brief ? COLOURS[assets.brief.colour] : null;

  return (
    <section className="flex h-full min-w-0 flex-col bg-panel">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-line px-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {colour && <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: colour.hex }} />}
            <h2 className="truncate text-[14px] font-semibold text-ink">{assets.brief?.title ?? title}</h2>
          </div>
          {assets.brief && <p className="truncate text-[12px] text-muted">{colour?.label} · {assets.brief.place}</p>}
        </div>
        {assets.brief && (
          <button onClick={share} className="flex h-8 items-center gap-1.5 rounded-lg border border-line px-3 text-[13px] font-medium text-ink-2 transition hover:border-brand-line hover:bg-brand-soft hover:text-brand">
            <Link2 className="h-3.5 w-3.5" /> Share
          </button>
        )}
        <button onClick={onClose} aria-label="Close canvas" className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-wash hover:text-ink">
          <PanelRightClose className="h-4 w-4" />
        </button>
      </header>

      <nav className="flex shrink-0 gap-1 overflow-x-auto border-b border-line px-3 py-2" role="tablist">
        {TABS.map((t) => {
          const has = !!assets[t.kind];
          const busy = running?.asset === t.kind;
          const on = tab === t.kind;
          return (
            <button key={t.kind} role="tab" aria-selected={on} disabled={!has && !busy} onClick={() => setTab(t.kind)}
              className={clsx("relative flex h-8 items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium transition",
                on ? "bg-wash text-ink" : has || busy ? "text-ink-2 hover:bg-wash/70" : "cursor-default text-faint/70")}>
              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin text-brand" /> : <t.icon className="h-3.5 w-3.5" />}
              {t.label}
              {fresh.has(t.kind) && !on && <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-brand" />}
            </button>
          );
        })}
      </nav>

      <div className="relative min-h-0 flex-1">
        <AnimatePresence mode="wait">
          <motion.div key={tab + (busyHere ? "-busy" : "")} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
            className={clsx("absolute inset-0", tab === "map" && assets.map && !busyHere ? "" : "scroll-quiet overflow-y-auto")}>
            {busyHere ? <Building name={running!.name} kind={tab} /> :
              tab === "fit" && assets.fit ? <FitPanel a={assets} /> :
              tab === "brief" && assets.brief ? <BriefPanel a={assets} /> :
              tab === "personas" && assets.personas ? <PersonasPanel projectId={projectId} a={assets} onPhoto={onPhoto} /> :
              tab === "schema" && assets.schema ? <SchemaPanel a={assets} /> :
              tab === "map" && assets.map ? <MapView map={assets.map} schema={assets.schema} personas={assets.personas} /> :
              tab === "bot" && assets.bot ? <BotPanel projectId={projectId} assets={assets} onToast={onToast} /> :
              <Empty />}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function Empty() {
  return (
    <div className="grid h-full place-items-center p-10 text-center">
      <div>
        <Sparkles className="mx-auto h-6 w-6 text-faint" />
        <p className="mt-3 text-[14px] text-muted">What you make together appears here.</p>
      </div>
    </div>
  );
}

function Building({ name, kind }: { name: string; kind: AssetKind }) {
  const [label] = TOOL_LABEL[name] ?? ["Working"];
  return (
    <div className="p-8">
      <div className="flex items-center gap-2 text-[14px] font-medium"><Loader2 className="h-4 w-4 animate-spin text-brand" /><span className="shimmer-text">{label}…</span></div>
      {kind === "map" ? <div className="skeleton mt-6 h-[60vh] w-full" /> : (
        <div className="mt-6 space-y-3">
          <div className="skeleton h-7 w-2/3" />
          <div className="skeleton h-4 w-full" /><div className="skeleton h-4 w-11/12" /><div className="skeleton h-4 w-4/5" />
          <div className="grid grid-cols-3 gap-3 pt-4">{[0, 1, 2].map((i) => <div key={i} className="skeleton h-40" />)}</div>
        </div>
      )}
    </div>
  );
}

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-2 text-[11.5px] font-semibold uppercase tracking-[0.08em] text-faint">{children}</div>
);

function FitPanel({ a }: { a: Assets }) {
  const f = a.fit!;
  const v = {
    fits: { label: "Fits", cls: "bg-good-soft text-good", ring: "border-[#bfe5d4]" },
    fits_with_changes: { label: "Fits with changes", cls: "bg-warn-soft text-warn", ring: "border-[#f3d9b5]" },
    not_yet: { label: "Not a fit yet", cls: "bg-bad-soft text-bad", ring: "border-[#f5d0c5]" },
  }[f.verdict];
  const icon = { yes: <Check className="h-3.5 w-3.5" />, partly: <Minus className="h-3.5 w-3.5" />, no: <X className="h-3.5 w-3.5" /> };
  const iconCls = { yes: "bg-good-soft text-good", partly: "bg-warn-soft text-warn", no: "bg-bad-soft text-bad" };
  return (
    <div className="mx-auto max-w-[760px] p-8">
      <div className={clsx("rounded-2xl border p-6", v.ring)}>
        <span className={clsx("inline-flex items-center rounded-full px-3 py-1 text-[13px] font-semibold", v.cls)}>{v.label}</span>
        <p className="mt-3 font-serif text-[24px] leading-snug text-ink">{f.summary}</p>
      </div>
      <div className="mt-8"><SectionLabel>Against the Blue Dots criteria</SectionLabel>
        <ul className="divide-y divide-line rounded-2xl border border-line">
          {f.criteria.map((c, i) => (
            <motion.li key={i} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} className="flex gap-3 px-4 py-3">
              <span className={clsx("mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full", iconCls[c.result])}>{icon[c.result]}</span>
              <div><div className="text-[14px] font-medium text-ink">{c.name}</div><div className="text-[13px] leading-relaxed text-muted">{c.note}</div></div>
            </motion.li>
          ))}
        </ul>
      </div>
      {f.to_make_it_fit.length > 0 && (
        <div className="mt-8"><SectionLabel>To make it fit</SectionLabel>
          <ul className="space-y-2">{f.to_make_it_fit.map((t, i) => <li key={i} className="flex gap-2.5 text-[14px] text-ink-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />{t}</li>)}</ul>
        </div>
      )}
    </div>
  );
}

function BriefPanel({ a }: { a: Assets }) {
  const b = a.brief!;
  const c = COLOURS[b.colour];
  const rows: [string, string][] = [["Who is looking", b.seekers], ["Who provides", b.providers], ["Why it matters", b.why_it_matters]];
  return (
    <article className="mx-auto max-w-[760px] p-8">
      <div className="flex flex-wrap items-center gap-2 text-[12.5px]">
        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-semibold text-white" style={{ background: c.hex }}>{c.label}</span>
        <span className="rounded-full bg-wash px-2.5 py-1 text-ink-2">{b.place}</span>
        <span className="rounded-full bg-wash px-2.5 py-1 text-ink-2">{b.language}</span>
      </div>
      <h1 className="mt-5 font-serif text-[40px] leading-[1.05] tracking-tight text-ink">{b.title}</h1>
      <p className="mt-4 text-[17px] leading-relaxed text-ink-2">{b.problem}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {rows.map(([k, v]) => (
          <div key={k} className="rounded-2xl border border-line p-4"><SectionLabel>{k}</SectionLabel><p className="text-[14px] leading-relaxed text-ink-2">{v}</p></div>
        ))}
      </div>
      <div className="mt-8 flex items-center gap-4 rounded-2xl bg-wash p-5">
        <div className="grid h-11 w-11 place-items-center rounded-xl text-white" style={{ background: c.hex }}><Phone className="h-5 w-5" /></div>
        <div><div className="text-[15px] font-semibold text-ink">{b.bot_name}</div><div className="text-[13.5px] text-muted">{b.tagline}</div></div>
      </div>
    </article>
  );
}

export function PersonaPhoto({ projectId, p, photoKey, onPhoto, auto = true, className }: {
  projectId: string; p: Persona; photoKey?: string; onPhoto?: (id: string, key: string) => void; auto?: boolean; className?: string;
}) {
  const [state, setState] = useState<"idle" | "making" | "failed">("idle");
  useEffect(() => {
    if (photoKey || !auto || state !== "idle") return;
    setState("making");
    fetch(`/api/photo/${projectId}/${p.id}`, { method: "POST" })
      .then((r) => r.json()).then((j) => { if (j.key) onPhoto?.(p.id, j.key); else setState("failed"); })
      .catch(() => setState("failed"));
  }, [photoKey, auto, state, projectId, p.id, onPhoto]);
  const initials = p.name.split(/\s+/).map((x) => x[0]).join("").slice(0, 2);
  return (
    <div className={clsx("relative overflow-hidden bg-wash", className)}>
      {photoKey ? (
        <motion.img key={photoKey} initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
          src={`/api/photo/${projectId}/${p.id}?k=${photoKey}`} alt={`Portrait of ${p.name} (generated)`} className="h-full w-full object-cover" />
      ) : (
        <div className={clsx("grid h-full w-full place-items-center", state === "making" && "skeleton rounded-none")}>
          <span className="text-[22px] font-semibold text-faint">{initials}</span>
          {state === "making" && <span className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/90 px-2 py-0.5 text-[11px] text-muted">Making photo…</span>}
        </div>
      )}
    </div>
  );
}

function PersonasPanel({ projectId, a, onPhoto }: { projectId: string; a: Assets; onPhoto: (id: string, key: string) => void }) {
  return (
    <div className="p-6">
      <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(230px,1fr))]">
        {a.personas!.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="flex flex-col overflow-hidden rounded-2xl border border-line bg-panel shadow-card">
            <PersonaPhoto projectId={projectId} p={p} photoKey={a.photos?.[p.id]} onPhoto={onPhoto} className="aspect-[4/3.4]" />
            <div className="flex flex-1 flex-col p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="text-[16px] font-semibold text-ink">{p.name}</div>
                <span className={clsx("rounded-full px-2 py-0.5 text-[11.5px] font-semibold", p.side === "seeker" ? "bg-brand-soft text-brand" : "bg-good-soft text-good")}>
                  {p.side === "seeker" ? "Looking for help" : "Provides help"}
                </span>
              </div>
              <div className="mt-0.5 text-[12.5px] text-muted">{p.age} · {p.occupation} · {p.area}</div>
              <p className="mt-3 flex gap-1.5 font-serif text-[17px] italic leading-snug text-ink"><Quote className="mt-1 h-3.5 w-3.5 shrink-0 text-faint" />{p.quote}</p>
              <p className="mt-3 text-[13.5px] leading-relaxed text-ink-2">{p.story}</p>
              <div className="mt-auto pt-3"><div className="rounded-xl bg-wash px-3 py-2 text-[13px] text-ink-2"><span className="font-medium text-ink">Needs: </span>{p.need}</div></div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SchemaPanel({ a }: { a: Assets }) {
  const s = a.schema!;
  const Fields = ({ title, rows }: { title: string; rows: typeof s.seeker_fields }) => (
    <div className="overflow-hidden rounded-2xl border border-line">
      <div className="border-b border-line bg-wash px-4 py-2.5 text-[13px] font-semibold text-ink">{title}</div>
      <table className="w-full text-left text-[13px]">
        <tbody>
          {rows.map((f) => (
            <tr key={f.key} className="border-b border-line last:border-0">
              <td className="px-4 py-2.5 align-top"><div className="font-medium text-ink">{f.label}</div><div className="font-mono text-[11.5px] text-faint">{f.key}</div></td>
              <td className="px-2 py-2.5 align-top text-ink-2">{f.example}</td>
              <td className="px-4 py-2.5 text-right align-top">
                <span className={clsx("inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[11.5px] font-medium", f.visible === "public" ? "bg-brand-soft text-brand" : "bg-wash text-ink-2")}>
                  {f.visible === "public" ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}{f.visible === "public" ? "On the map" : "After both agree"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  return (
    <div className="mx-auto max-w-[820px] p-8">
      <SectionLabel>Sectors on the map</SectionLabel>
      <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
        {s.sectors.map((x) => (
          <div key={x.id} className="flex gap-3 rounded-2xl border border-line p-4">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand text-white"><SectorIcon name={x.icon} className="h-4 w-4" /></span>
            <div><div className="text-[14px] font-medium text-ink">{x.label}</div><div className="text-[12.5px] leading-snug text-muted">{x.description}</div></div>
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Fields title="What people looking for help share" rows={s.seeker_fields} />
        <Fields title="What providers share" rows={s.provider_fields} />
      </div>
      <p className="mt-6 text-[13.5px] leading-relaxed text-muted">{s.notes}</p>
    </div>
  );
}
