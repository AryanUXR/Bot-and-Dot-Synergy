"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import clsx from "clsx";
import {
  Gauge, FileText, Users, Layers, Map as MapIcon, Phone, Check, Minus, X, Lock, Globe, Loader2, PanelRightClose,
  MapPin, Languages, Palette, Bot as BotIcon, Share2, Lightbulb,
} from "lucide-react";
import type { AssetKind, Assets, Persona } from "@/lib/types";
import { COLOURS } from "@/lib/types";
import { SectorIcon } from "./icons";
import BotPanel from "./BotPanel";
import { TOOL_LABEL } from "./useAssistant";

const MapView = dynamic(() => import("./MapView"), { ssr: false, loading: () => <div className="skeleton h-full w-full rounded-none" /> });

const TABS: { kind: AssetKind; label: string; icon: typeof MapIcon }[] = [
  { kind: "fit", label: "Fit check", icon: Gauge },
  { kind: "brief", label: "Brief", icon: FileText },
  { kind: "personas", label: "Personas", icon: Users },
  { kind: "schema", label: "Schema", icon: Layers },
  { kind: "map", label: "Map", icon: MapIcon },
  { kind: "bot", label: "Voice bot", icon: Phone },
];

export default function Canvas({ projectId, title, assets, focus, fresh, running, onSeen, onClose, onPhoto, onToast }: {
  projectId: string; title: string; assets: Assets; focus: { kind: AssetKind; n: number } | null; fresh: Set<AssetKind>;
  running: { name: string; asset?: AssetKind } | null; onSeen: (k: AssetKind) => void; onClose: () => void;
  onPhoto: (personaId: string, key: string) => void; onToast: (t: string) => void;
}) {
  const shown = TABS.filter((t) => assets[t.kind] || running?.asset === t.kind);
  const [tab, setTab] = useState<AssetKind>(shown[shown.length - 1]?.kind ?? "brief");
  useEffect(() => { if (focus) setTab(focus.kind); }, [focus]);
  useEffect(() => { if (!assets[tab] && shown.length && running?.asset !== tab) setTab(shown[shown.length - 1].kind); }, [assets, tab, shown, running]);
  useEffect(() => { onSeen(tab); }, [tab, fresh, onSeen]);

  const share = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/p/${projectId}`);
    onToast("Link copied. Anyone with it can call the bot and see the map.");
  };
  const busyHere = running?.asset === tab && !assets[tab];
  const current = TABS.find((t) => t.kind === tab);

  return (
    <section className="flex h-full min-w-0 flex-col bg-white">
      <header className="flex h-[45px] shrink-0 items-center gap-1 px-3">
        <div className="flex min-w-0 flex-1 items-center gap-1 text-[14px]">
          <span className="truncate text-muted">{assets.brief?.title ?? title}</span>
          {current && <><span className="text-faint">/</span><span className="truncate text-ink">{current.label}</span></>}
        </div>
        {assets.brief && <button onClick={share} className="flex h-7 items-center gap-1.5 rounded-[4px] px-2 text-[14px] text-ink-2 hover:bg-hover"><Share2 className="h-3.5 w-3.5" /> Share</button>}
        <button onClick={onClose} aria-label="Close preview" className="grid h-7 w-7 place-items-center rounded-[4px] text-muted hover:bg-hover"><PanelRightClose className="h-4 w-4" /></button>
      </header>

      <nav className="flex shrink-0 gap-0.5 overflow-x-auto px-3 shadow-[inset_0_-1px_0_rgba(55,53,47,0.09)]" role="tablist">
        {shown.map((t) => {
          const busy = running?.asset === t.kind;
          const on = tab === t.kind;
          return (
            <button key={t.kind} role="tab" aria-selected={on} onClick={() => setTab(t.kind)}
              className={clsx("relative flex h-9 shrink-0 items-center gap-1.5 px-2 text-[14px] transition-colors",
                on ? "text-ink shadow-[inset_0_-2px_0_#37352f]" : "text-muted hover:text-ink")}>
              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <t.icon className="h-3.5 w-3.5" />}
              {t.label}
              {fresh.has(t.kind) && !on && <span className="ml-0.5 h-1.5 w-1.5 rounded-full bg-brand" />}
            </button>
          );
        })}
      </nav>

      <div className="relative min-h-0 flex-1">
        <div key={tab + (busyHere ? "-busy" : "")} className={clsx("absolute inset-0", tab === "map" && assets.map && !busyHere ? "" : "scroll-quiet overflow-y-auto")}>
          {busyHere ? <Building name={running!.name} kind={tab} /> :
            tab === "fit" && assets.fit ? <FitPanel a={assets} /> :
            tab === "brief" && assets.brief ? <BriefPanel a={assets} /> :
            tab === "personas" && assets.personas ? <PersonasPanel projectId={projectId} a={assets} onPhoto={onPhoto} /> :
            tab === "schema" && assets.schema ? <SchemaPanel a={assets} /> :
            tab === "map" && assets.map ? <MapView map={assets.map} schema={assets.schema} personas={assets.personas} /> :
            tab === "bot" && assets.bot ? <BotPanel projectId={projectId} assets={assets} onToast={onToast} /> : null}
        </div>
      </div>
    </section>
  );
}

const Page = ({ children, wide }: { children: React.ReactNode; wide?: boolean }) => (
  <div className={clsx("mx-auto px-10 pb-16 pt-10", wide ? "max-w-[900px]" : "max-w-[720px]")}>{children}</div>
);
const H = ({ children }: { children: React.ReactNode }) => <h3 className="mb-1 mt-8 text-[20px] font-semibold leading-snug text-ink">{children}</h3>;

function Building({ name, kind }: { name: string; kind: AssetKind }) {
  const [label] = TOOL_LABEL[name] ?? ["Working"];
  return (
    <Page>
      <div className="flex items-center gap-2 text-[14px] text-muted"><Loader2 className="h-4 w-4 animate-spin" />{label}…</div>
      {kind === "map" ? <div className="skeleton mt-6 h-[60vh] w-full" /> : (
        <div className="mt-6 space-y-3">
          <div className="skeleton h-9 w-2/3" />
          <div className="space-y-2 pt-3">{[0, 1, 2].map((i) => <div key={i} className="skeleton h-5 w-1/2" />)}</div>
          <div className="space-y-2 pt-4"><div className="skeleton h-4 w-full" /><div className="skeleton h-4 w-11/12" /><div className="skeleton h-4 w-4/5" /></div>
        </div>
      )}
    </Page>
  );
}

function Prop({ icon: I, label, children }: { icon: typeof MapIcon; label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-[34px] items-start py-1.5 text-[14px]">
      <div className="flex w-[160px] shrink-0 items-center gap-1.5 pt-px text-muted"><I className="h-4 w-4" />{label}</div>
      <div className="min-w-0 flex-1 text-ink">{children}</div>
    </div>
  );
}

const Tag = ({ children, tone = "gray" }: { children: React.ReactNode; tone?: "gray" | "blue" | "green" | "orange" | "red" }) => {
  const c = { gray: "bg-[#e3e2e0] text-[#32302c]", blue: "bg-[#d3e5ef] text-[#183347]", green: "bg-[#dbeddb] text-[#1c3829]", orange: "bg-[#fadec9] text-[#49290e]", red: "bg-[#ffe2dd] text-[#5d1715]" }[tone];
  return <span className={clsx("inline-flex h-5 items-center whitespace-nowrap rounded-[3px] px-1.5 text-[13px] leading-none", c)}>{children}</span>;
};

function FitPanel({ a }: { a: Assets }) {
  const f = a.fit!;
  const v = { fits: ["Fits", "green"], fits_with_changes: ["Fits with changes", "orange"], not_yet: ["Not a fit yet", "red"] }[f.verdict] as [string, "green" | "orange" | "red"];
  const icon = { yes: <Check className="h-4 w-4 text-good" />, partly: <Minus className="h-4 w-4 text-warn" />, no: <X className="h-4 w-4 text-bad" /> };
  return (
    <Page>
      <h1 className="text-[32px] font-bold leading-tight tracking-[-0.01em] text-ink">Fit check</h1>
      <div className="mt-4"><Prop icon={Gauge} label="Verdict"><Tag tone={v[1]}>{v[0]}</Tag></Prop></div>
      <div className="mt-4 flex gap-3 rounded-[4px] bg-[#f1f1ef] px-4 py-3.5 text-[16px] leading-relaxed text-ink">
        <Lightbulb className="mt-1 h-5 w-5 shrink-0 text-muted" /><p>{f.summary}</p>
      </div>
      <H>Against the Blue Dots criteria</H>
      <div className="mt-2">
        {f.criteria.map((c, i) => (
          <div key={i} className="flex gap-3 py-2 shadow-[inset_0_-1px_0_rgba(55,53,47,0.09)]">
            <span className="mt-[3px]">{icon[c.result]}</span>
            <div><div className="text-[15px] text-ink">{c.name}</div><div className="text-[14px] leading-relaxed text-muted">{c.note}</div></div>
          </div>
        ))}
      </div>
      {f.to_make_it_fit.length > 0 && (<><H>To make it fit</H>
        <ul className="list-disc space-y-1 pl-6 text-[16px] leading-relaxed text-ink marker:text-ink">{f.to_make_it_fit.map((t, i) => <li key={i}>{t}</li>)}</ul></>)}
    </Page>
  );
}

function BriefPanel({ a }: { a: Assets }) {
  const b = a.brief!;
  const c = COLOURS[b.colour];
  return (
    <Page>
      <h1 className="text-[40px] font-bold leading-[1.15] tracking-[-0.015em] text-ink">{b.title}</h1>
      <div className="mt-5">
        <Prop icon={Palette} label="Programme"><span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: c.hex }} />{c.label} · {c.area}</span></Prop>
        <Prop icon={MapPin} label="Place">{b.place}</Prop>
        <Prop icon={Languages} label="Language">{b.language}</Prop>
        <Prop icon={BotIcon} label="Voice bot">{b.bot_name} <span className="text-muted">· {b.tagline}</span></Prop>
      </div>
      <div className="my-6 h-px bg-line" />
      <H>The problem</H><p className="text-[16px] leading-relaxed text-ink">{b.problem}</p>
      <H>Who is looking for help</H><p className="text-[16px] leading-relaxed text-ink">{b.seekers}</p>
      <H>Who provides it</H><p className="text-[16px] leading-relaxed text-ink">{b.providers}</p>
      <H>Why nearness and voice matter</H><p className="text-[16px] leading-relaxed text-ink">{b.why_it_matters}</p>
    </Page>
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
    <div className={clsx("relative overflow-hidden bg-[#f1f1ef]", className)}>
      {photoKey ? (
        <img src={`/api/photo/${projectId}/${p.id}?k=${photoKey}`} alt={`Portrait of ${p.name} (generated)`} className="h-full w-full object-cover" />
      ) : (
        <div className={clsx("grid h-full w-full place-items-center", state === "making" && "skeleton rounded-none")}>
          <span className="text-[20px] font-medium text-faint">{initials}</span>
        </div>
      )}
    </div>
  );
}

function PersonasPanel({ projectId, a, onPhoto }: { projectId: string; a: Assets; onPhoto: (id: string, key: string) => void }) {
  return (
    <Page wide>
      <h1 className="text-[32px] font-bold leading-tight tracking-[-0.01em] text-ink">Personas</h1>
      <p className="mt-1 text-[14px] text-muted">Fictional people. Photos are generated.</p>
      <div className="mt-6 grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
        {a.personas!.map((p) => (
          <div key={p.id} className="flex flex-col overflow-hidden rounded-[6px] bg-white shadow-card transition-colors hover:bg-[#fbfbfa]">
            <PersonaPhoto projectId={projectId} p={p} photoKey={a.photos?.[p.id]} onPhoto={onPhoto} className="aspect-[16/11]" />
            <div className="flex flex-1 flex-col gap-2 p-3">
              <div className="text-[15px] font-semibold text-ink">{p.name}</div>
              <div className="flex flex-wrap gap-1"><Tag tone={p.side === "seeker" ? "blue" : "green"}>{p.side === "seeker" ? "Looking for help" : "Provides help"}</Tag><Tag>{p.area}</Tag><Tag>{p.age}</Tag></div>
              <p className="text-[14px] italic leading-snug text-ink-2">“{p.quote}”</p>
              <p className="text-[14px] leading-relaxed text-muted">{p.story}</p>
              <p className="mt-auto text-[14px] leading-relaxed text-ink"><span className="text-muted">Needs </span>{p.need}</p>
            </div>
          </div>
        ))}
      </div>
    </Page>
  );
}

function SchemaPanel({ a }: { a: Assets }) {
  const s = a.schema!;
  const th = "h-[34px] px-2 text-left align-middle text-[14px] font-normal text-muted";
  const td = "px-2 py-2 align-top text-[14px] text-ink";
  const Fields = ({ title, rows }: { title: string; rows: typeof s.seeker_fields }) => (
    <>
      <H>{title}</H>
      <table className="mt-2 w-full border-collapse">
        <thead><tr className="shadow-[inset_0_-1px_0_rgba(55,53,47,0.09),inset_0_1px_0_rgba(55,53,47,0.09)]">
          <th className={th}>Field</th><th className={th}>Example</th><th className={clsx(th, "w-[150px]")}>Who sees it</th></tr></thead>
        <tbody>
          {rows.map((f) => (
            <tr key={f.key} className="shadow-[inset_0_-1px_0_rgba(55,53,47,0.09)]">
              <td className={td}>{f.label}<div className="font-mono text-[12px] text-faint">{f.key}</div></td>
              <td className={clsx(td, "text-ink-2")}>{f.example}</td>
              <td className={td}><span className="inline-flex items-center gap-1 text-[14px] text-muted">{f.visible === "public" ? <><Globe className="h-3.5 w-3.5" />On the map</> : <><Lock className="h-3.5 w-3.5" />After both agree</>}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
  return (
    <Page wide>
      <h1 className="text-[32px] font-bold leading-tight tracking-[-0.01em] text-ink">Schema</h1>
      <p className="mt-1 text-[14px] text-muted">What each side is asked, and who sees what.</p>
      <H>Sectors on the map</H>
      <div className="mt-2">
        {s.sectors.map((x) => (
          <div key={x.id} className="flex items-start gap-3 py-2 shadow-[inset_0_-1px_0_rgba(55,53,47,0.09)]">
            <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand text-white"><SectorIcon name={x.icon} className="h-3.5 w-3.5" /></span>
            <div><div className="text-[15px] text-ink">{x.label}</div><div className="text-[14px] text-muted">{x.description}</div></div>
          </div>
        ))}
      </div>
      <Fields title="People looking for help share" rows={s.seeker_fields} />
      <Fields title="Providers share" rows={s.provider_fields} />
      <p className="mt-6 text-[14px] leading-relaxed text-muted">{s.notes}</p>
    </Page>
  );
}
