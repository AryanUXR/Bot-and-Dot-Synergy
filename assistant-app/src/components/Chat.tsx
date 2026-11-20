"use client";
import { memo, useEffect, useLayoutEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AnimatePresence, motion } from "motion/react";
import clsx from "clsx";
import {
  ArrowUp, Square, Sparkles, Check, Copy, ChevronRight, Loader2, AlertCircle, ArrowDown, CornerDownRight,
  Map as MapIcon, Users, FileText, Layers, Phone, Gauge, BookOpen, Target, PenLine, Hammer,
  Landmark, HeartHandshake, Wrench, Compass, ArrowRight,
} from "lucide-react";
import type { AssetKind, ProjectSummary, UiMessage, UiPart } from "@/lib/types";
import { TOOL_LABEL } from "./useAssistant";
import { AtlasOrb } from "./AtlasOrb";

const ASSET_ICON: Record<AssetKind, typeof MapIcon> = { fit: Gauge, brief: FileText, personas: Users, schema: Layers, map: MapIcon, bot: Phone };

const STARTERS = [
  { icon: BookOpen, title: "Ask about Blue Dots", text: "What has Blue Dots shown in Ghaziabad and Hubli?", prompt: "What has Blue Dots shown so far in Ghaziabad and Hubli-Dharwad?" },
  { icon: Target, title: "Check if an idea fits", text: "Working mothers in Tiruppur finding creches nearby", prompt: "Can Blue Dots work for working mothers in Tiruppur finding day-care and creches near them?" },
  { icon: PenLine, title: "Shape an idea into a brief", text: "Turn a rough idea into a problem, people and personas", prompt: "I have an idea for a Dots network but it's still rough. Help me shape it into a clear problem statement with personas." },
  { icon: Hammer, title: "Build a voice bot and a map", text: "Elder home care in Pune, end to end", prompt: "Build a bot and a dot map for elderly people and families in Pune finding home nurses, attendants and day-care centres near them." },
];

const ROLES = [
  { icon: Landmark, title: "I lead a district or department", prompt: "I lead a district or department. What could Blue Dots do for us, and what has it shown so far?" },
  { icon: HeartHandshake, title: "I run a programme or NGO", prompt: "I run a programme or NGO and I have an idea I'd like to try. Where do I start?" },
  { icon: Wrench, title: "I build or support deployments", prompt: "I build or support deployments (as a programme partner, system integrator, or voice or cloud provider). What would working on Blue Dots involve?" },
  { icon: Compass, title: "I'm just curious", prompt: "I'm just curious. What is Blue Dots, in simple words?" },
];

export function EmptyState({ name, onPick, onSend, onStop, streaming, latest, onOpenLatest }: {
  name: string | null; onPick: (t: string) => void; onSend: (t: string) => void; onStop: () => void; streaming: boolean;
  latest?: ProjectSummary | null; onOpenLatest?: (id: string) => void;
}) {
  const first = name?.split(" ")[0];
  return (
    <div className="scroll-quiet flex flex-1 flex-col overflow-y-auto">
      <div className="mx-auto flex w-full max-w-[760px] flex-1 flex-col items-center justify-center px-6 pb-10 pt-6">
        <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
          <div className="relative grid place-items-center">
            <span aria-hidden className="absolute h-[150px] w-[150px] rounded-full bg-[radial-gradient(circle_at_40%_35%,rgba(103,232,249,0.22),rgba(37,99,235,0.12)_45%,transparent_70%)] blur-md" />
            <span aria-hidden className="absolute h-[148px] w-[148px] rounded-full shadow-[inset_0_0_30px_rgba(56,189,248,0.25),0_0_60px_rgba(37,99,235,0.25)]" />
            <AtlasOrb size={190} active={streaming} className="relative" />
          </div>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 text-center text-[34px] font-medium leading-tight tracking-[-0.035em] text-ink">
          {first ? `Hi ${first}` : "Hi, I'm the Blue Dots assistant"}
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-2 max-w-[520px] text-center text-[17px] leading-[1.5] text-ink-2">
          {first
            ? latest ? "Pick up where you left off, or start something new." : "Tell me about a place and the people you want to help, or ask anything about Blue Dots."
            : "Tell me a little about you, and I'll start in the right place."}
        </motion.p>
        {first && latest && onOpenLatest && (
          <motion.button type="button" onClick={() => onOpenLatest(latest.id)} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="group mx-auto mt-5 flex w-full max-w-[420px] items-center gap-3 rounded-[10px] border border-line-2 bg-panel/80 px-4 py-3 text-left transition-colors hover:border-brand-line hover:bg-wash">
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[14.5px] font-medium text-ink">{latest.title}</span>
              <span className="mt-0.5 flex items-center gap-1.5 text-[12.5px] text-muted">
                {latest.has.length ? latest.has.map((k) => { const I = ASSET_ICON[k]; return <I key={k} className="h-3.5 w-3.5" aria-label={k} />; }) : "Chat"}
                <span className="ml-1">· {ago(latest.updated_at)}</span>
              </span>
            </span>
            <ArrowRight className="h-4 w-4 text-muted transition-transform group-hover:translate-x-0.5" aria-hidden />
          </motion.button>
        )}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="mt-8 w-full">
          <Composer onSend={onSend} onStop={onStop} streaming={streaming} autoFocus hero />
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75, duration: 0.6 }} className="mt-4 flex flex-wrap justify-center gap-2">
          {(first ? STARTERS : ROLES).map((s) => (
            <button key={s.title} onClick={() => onPick(s.prompt)} title={s.prompt}
              className="m-btn flex h-9 items-center gap-2 rounded-[8px] border border-line-2 bg-panel/70 px-3 text-[13.5px] text-ink-2 hover:border-brand-line hover:bg-wash hover:text-ink">
              <s.icon className="h-4 w-4 text-muted" /> {s.title}
            </button>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function ago(ms: number) {
  const m = Math.round((Date.now() - ms) / 60000);
  if (m < 60) return m <= 1 ? "just now" : `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.round(h / 24);
  return d === 1 ? "yesterday" : `${d} days ago`;
}

function Thinking({ part, live }: { part: Extract<UiPart, { type: "thinking" }>; live: boolean }) {
  const [open, setOpen] = useState(false);
  const done = part.seconds != null;
  return (
    <div className="my-1">
      <button onClick={() => setOpen((o) => !o)} className="-ml-1 flex items-center gap-1 rounded-[4px] px-1 py-0.5 text-[14px] text-muted hover:bg-hover">
        <ChevronRight className={clsx("h-3.5 w-3.5 transition-transform", open && "rotate-90")} />
        {done ? <span>Thought for {part.seconds}s</span> : <span>Thinking{live && <Ellipsis />}</span>}
      </button>
      <AnimatePresence initial={false}>
        {open && part.text && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="ml-[7px] mt-1 whitespace-pre-wrap pl-4 text-[14px] leading-relaxed text-muted shadow-[inset_2px_0_0_rgba(255,255,255,0.16)]">{part.text.trim()}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Ellipsis() {
  return <span aria-hidden className="inline-flex w-4">{[0, 1, 2].map((i) => <span key={i} className="animate-pulse-dot" style={{ animationDelay: `${i * 0.2}s` }}>.</span>)}</span>;
}

function ToolRow({ part, onOpen }: { part: Extract<UiPart, { type: "tool" }>; onOpen: (k: AssetKind) => void }) {
  const [busy, label] = TOOL_LABEL[part.name] ?? ["Working", "Done"];
  const Icon = part.asset ? ASSET_ICON[part.asset] : FileText;
  const running = part.status === "running";
  const bad = part.status === "error";
  const clickable = !!part.asset && part.status === "done";
  return (
    <button onClick={() => clickable && onOpen(part.asset!)} disabled={!clickable}
      className={clsx("-ml-1 my-0.5 flex max-w-full items-center gap-2 rounded-[4px] px-1 py-1 text-left text-[14px]", clickable && "hover:bg-hover")}>
      <CornerDownRight className="h-3.5 w-3.5 shrink-0 text-faint" />
      {running ? <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted" /> : bad ? <AlertCircle className="h-4 w-4 shrink-0 text-faint" /> : <Icon className="h-4 w-4 shrink-0 text-muted" />}
      {running ? <span className="text-muted">{busy}<Ellipsis /></span> : (
        <span className="min-w-0 truncate">
          <span className={clsx(bad ? "text-muted" : "text-ink underline decoration-[rgba(255,255,255,0.3)] underline-offset-[3px]")}>{label}</span>
          {part.summary && <span className="text-muted"> · {part.summary}</span>}
        </span>
      )}
    </button>
  );
}

// Source markers like [KD p.7] (or the older "(KD p.7)") become small grey superscripts
// that name the document on hover, so answers read naturally but stay traceable.
const SOURCE_NAMES: Record<string, string> = {
  KD: "The Blue Dots AI Economy: Key Details",
  GZ: "Ghaziabad Future Ready deck",
  PQ: "Blue Dots Personas and Question Map",
  DS: "Blue Dots documentation site",
};
const SOURCE_RE = /\s?[[(]((?:KD|GZ|PQ|DS)\b[^\])]{0,40})[\])]/g;
function sourceTitle(tag: string) {
  return tag.split(/[;,] (?=KD|GZ|PQ|DS)/).map((t) => {
    const key = t.trim().slice(0, 2);
    const rest = t.trim().slice(2).replace(/^:\s*/, "").trim();
    return `${SOURCE_NAMES[key] ?? key}${rest ? `, ${rest.replace(/^p\.\s?(\S*[–-]\S*)/, "pages $1").replace(/^p\./, "page ").replace(/^slide\s(\S*[–-])/, "slides $1")}` : ""}`;
  }).join("; ");
}
function withSourceLinks(text: string) {
  return text.replace(SOURCE_RE, (_m, tag: string) => ` [${tag.trim()}](#src:${encodeURIComponent(tag.trim())})`);
}

const Markdown = memo(function Markdown({ text }: { text: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
      a: ({ href, children, ...p }) => {
        if (href?.startsWith("#src:")) {
          const tag = decodeURIComponent(href.slice(5));
          return (
            <sup title={`Source: ${sourceTitle(tag)}`} className="ml-0.5 cursor-help rounded-[3px] bg-wash px-1 py-px align-super text-[10.5px] font-normal tracking-normal text-faint no-underline">
              {tag}
            </sup>
          );
        }
        return <a href={href} {...p} target="_blank" rel="noreferrer">{children}</a>;
      },
    }}>{withSourceLinks(text)}</ReactMarkdown>
  );
});

// Reveals streamed text smoothly, word by word, the way Claude's apps do, instead of in jumps.
// Speeds up when it falls behind so it never lags the stream by much; shows everything at once
// for saved messages and for people who prefer reduced motion.
function useSmoothText(text: string, animate: boolean) {
  const [shown, setShown] = useState(animate ? 0 : text.length);
  const target = useRef(text);
  target.current = text;
  useEffect(() => {
    if (!animate || (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) { setShown(text.length); return; }
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      setShown((cur) => {
        const left = target.current.length - cur;
        if (left <= 0) return cur;
        // A steady, readable pace (like Claude's apps): about 90 characters a second, rising to at most
        // 320 when a long burst arrives at once, so a 1,200-character reply plays out in about 4 seconds.
        const perSecond = Math.min(320, Math.max(90, left * 1.2));
        return Math.min(target.current.length, cur + Math.max(1, Math.round((perSecond * dt) / 1000)));
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [animate, text.length]); // eslint-disable-line react-hooks/exhaustive-deps
  if (shown >= text.length) return { text, done: true };
  // Stop at a word boundary so half-words don't flicker.
  const cut = text.lastIndexOf(" ", shown);
  return { text: text.slice(0, cut > 0 ? cut : shown), done: false };
}

function SmoothMarkdown({ text, animate, caret }: { text: string; animate: boolean; caret: boolean }) {
  const s = useSmoothText(text, animate);
  return <div className={clsx("prose-chat my-1.5", (caret || !s.done) && "caret")}><Markdown text={s.text} /></div>;
}

function AssistantMessage({ m, live, onOpen }: { m: UiMessage; live: boolean; onOpen: (k: AssetKind) => void }) {
  const [copied, setCopied] = useState(false);
  // Animate only messages that were streaming while on screen, not ones loaded from history.
  const animated = useRef(live);
  if (live) animated.current = true;
  const text = m.parts.filter((p) => p.type === "text").map((p) => (p as { text: string }).text).join("\n\n");
  const lastIdx = m.parts.length - 1;
  return (
    <div className="group flex gap-3">
      <div className="-ml-1 shrink-0 pt-0.5"><AtlasOrb size={30} active={live} /></div>
      <div className="min-w-0 flex-1">
      {live && m.parts.length === 0 && <div className="pt-1 text-[14px] text-muted">Thinking<Ellipsis /></div>}
      {m.parts.map((p, i) => {
        if (p.type === "thinking") return <Thinking key={i} part={p} live={live && i === lastIdx} />;
        if (p.type === "tool") return <ToolRow key={p.id} part={p} onOpen={onOpen} />;
        return <SmoothMarkdown key={i} text={p.text} animate={animated.current} caret={live && i === lastIdx} />;
      })}
      {!live && text && (
        <div className="mt-1 flex h-6 items-center opacity-0 transition-opacity group-hover:opacity-100">
          <button aria-label="Copy" onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1400); }}
            className="-ml-1 grid h-6 w-6 place-items-center rounded-[4px] text-faint hover:bg-hover hover:text-muted">
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
      )}
      </div>
    </div>
  );
}

function UserMessage({ m }: { m: UiMessage }) {
  const text = (m.parts[0] as { text: string })?.text ?? "";
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] whitespace-pre-wrap rounded-[12px] border border-line-2 bg-wash px-3.5 py-2 text-[16px] leading-relaxed text-ink">{text}</div>
    </div>
  );
}

export function Messages({ ui, streaming, onOpen, error, onRetry, options = [], onPick }: {
  ui: UiMessage[]; streaming: boolean; onOpen: (k: AssetKind) => void; error: string | null; onRetry: () => void;
  options?: string[]; onPick?: (text: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const stick = useRef(true);
  const [away, setAway] = useState(false);
  useLayoutEffect(() => { const el = ref.current; if (el && stick.current) el.scrollTop = el.scrollHeight; });
  useEffect(() => { stick.current = true; setAway(false); }, [ui.length]);

  // Screen readers: say when a reply starts, and read it once it has finished (WCAG 4.1.3).
  const [said, setSaid] = useState("");
  const wasStreaming = useRef(streaming);
  useEffect(() => {
    if (streaming && !wasStreaming.current) setSaid("The assistant is replying.");
    if (!streaming && wasStreaming.current) {
      const last = ui[ui.length - 1];
      const text = last?.role === "assistant" ? last.parts.filter((p) => p.type === "text").map((p) => (p as { text: string }).text).join(" ") : "";
      setSaid(text ? "The assistant replied: " + text.replace(/\[[^\]]*\]/g, "").replace(/[*_#`>]/g, "").replace(/\s+/g, " ").trim() : "");
    }
    wasStreaming.current = streaming;
  }, [streaming, ui]);

  return (
    <div className="relative min-h-0 flex-1">
      <div aria-live="polite" className="sr-only">{said}</div>
      <div ref={ref} onScroll={(e) => {
        const el = e.currentTarget;
        const near = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
        stick.current = near; setAway(!near);
      }} className="scroll-quiet absolute inset-0 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-[680px] flex-col gap-6 px-6 pb-8 pt-6">
          {ui.map((m, i) => (
            <div key={m.id}>
              {m.role === "user" ? <UserMessage m={m} /> : <AssistantMessage m={m} live={streaming && i === ui.length - 1} onOpen={onOpen} />}
            </div>
          ))}
          {!streaming && !error && options.length > 0 && onPick && ui[ui.length - 1]?.role === "assistant" && (
            <div role="group" aria-label="Suggested replies" className="-mt-2 flex flex-wrap gap-2 pl-10">
              {options.map((o) => (
                <button key={o} type="button" onClick={() => onPick(o)}
                  className="rounded-full border border-line-2 bg-panel/80 px-3 py-1.5 text-left text-[13.5px] text-ink-2 transition-colors hover:border-brand-line hover:bg-wash hover:text-ink">
                  {o}
                </button>
              ))}
            </div>
          )}
          {error && (
            <div role="alert" className="flex items-start gap-2.5 rounded-[4px] bg-bad-soft px-3 py-2.5 text-[14px] text-ink">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-bad" />
              <div className="flex-1">{error}</div>
              <button onClick={onRetry} className="text-muted underline underline-offset-2 hover:text-ink">Try again</button>
            </div>
          )}
        </div>
      </div>
      {away && (
        <button onClick={() => { const el = ref.current; if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" }); }}
          aria-label="Scroll to the latest message"
          className="absolute bottom-3 left-1/2 grid h-8 w-8 -translate-x-1/2 place-items-center rounded-full bg-panel text-muted shadow-pop hover:text-ink">
          <ArrowDown className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

const MODES = [
  { id: "ask", label: "Ask", icon: BookOpen, hint: "Ask anything about Blue Dots…" },
  { id: "fit", label: "Check fit", icon: Target, hint: "Describe the idea: who needs what, and where…" },
  { id: "brief", label: "Shape a brief", icon: PenLine, hint: "Tell me the rough idea; I'll ask what's missing…" },
  { id: "build", label: "Build", icon: Hammer, hint: "Name the place and the people; I'll build the bot and the map…" },
] as const;
const MODE_PREFIX: Record<string, string> = { ask: "", fit: "Check whether this fits Blue Dots: ", brief: "Help me shape this into a brief and personas: ", build: "Build a bot and a dot map for: " };

export function Composer({ onSend, onStop, streaming, autoFocus, placeholder, hero }: {
  onSend: (t: string) => void; onStop: () => void; streaming: boolean; autoFocus?: boolean; placeholder?: string; hero?: boolean;
}) {
  const [mode, setMode] = useState<string>("ask");
  const [text, setText] = useState("");
  const ta = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => { const el = ta.current; if (!el) return; el.style.height = "0px"; el.style.height = Math.min(el.scrollHeight, 220) + "px"; }, [text]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !["TEXTAREA", "INPUT"].includes(document.activeElement?.tagName ?? "")) { e.preventDefault(); ta.current?.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const submit = () => { if (!text.trim() || streaming) return; onSend(hero ? MODE_PREFIX[mode] + text : text); setText(""); };
  const can = text.trim().length > 0;
  const hint = hero ? MODES.find((m) => m.id === mode)!.hint : placeholder ?? "Reply, or ask for a change…";
  return (
    <div className={clsx("mx-auto w-full", hero ? "" : "max-w-[720px] px-6 pb-4")}>
      <div className={clsx("composer-lit flex flex-col rounded-[14px] border border-line-2 bg-panel/90 shadow-composer transition-colors focus-within:border-brand-line", hero && "min-h-[150px]")}>
        <textarea ref={ta} value={text} autoFocus={autoFocus} rows={hero ? 3 : 1}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); submit(); } }}
          placeholder={hint}
          className="block max-h-[220px] w-full flex-1 resize-none bg-transparent px-4 pb-1 pt-3.5 text-[16px] leading-relaxed text-ink outline-none placeholder:text-faint" />
        <div className="flex items-center gap-2 px-3 pb-3">
          {hero && (
            <div className="flex flex-wrap gap-1.5">
              {MODES.map((m) => (
                <button key={m.id} onClick={() => setMode(m.id)} aria-pressed={mode === m.id}
                  className={clsx("m-btn flex h-8 items-center gap-1.5 rounded-[7px] border px-2.5 text-[13px] transition-colors",
                    mode === m.id ? "border-brand-line bg-brand-soft text-ink" : "border-line-2 bg-wash text-muted hover:text-ink")}>
                  <m.icon className="h-3.5 w-3.5" /> {m.label}
                </button>
              ))}
            </div>
          )}
          <div className="ml-auto">
            {streaming ? (
              <button onClick={onStop} aria-label="Stop" className="m-btn grid h-9 w-9 place-items-center rounded-[9px] bg-ink text-canvas hover:bg-ink-2">
                <Square className="h-3.5 w-3.5 fill-current" />
              </button>
            ) : hero ? (
              <button onClick={submit} disabled={!can}
                className={clsx("m-btn flex h-9 items-center gap-2 rounded-[9px] px-4 text-[14px] font-medium transition-opacity", can ? "btn-primary" : "btn-primary opacity-50")}>
                <Sparkles className="h-4 w-4" /> Start
              </button>
            ) : (
              <button onClick={submit} aria-label="Send" disabled={!can}
                className={clsx("m-btn grid h-9 w-9 place-items-center rounded-[9px] transition-opacity", can ? "btn-primary" : "btn-primary opacity-40")}>
                <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>
      </div>
      {!hero && <p className="mt-2 text-center text-[12px] text-faint">The assistant can make mistakes. People and organisations it creates are fictional.{process.env.NEXT_PUBLIC_APP_ENV === "uat" && " This is the test site: the EkStep team reads chats here to improve it."}</p>}
    </div>
  );
}
