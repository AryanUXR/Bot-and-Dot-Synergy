"use client";
import { memo, useEffect, useLayoutEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AnimatePresence, motion } from "motion/react";
import clsx from "clsx";
import {
  ArrowUp, Square, Check, Copy, ChevronRight, Loader2, AlertCircle, ArrowDown, CornerDownRight,
  Map as MapIcon, Users, FileText, Layers, Phone, Gauge, BookOpen, Target, PenLine, Hammer,
} from "lucide-react";
import type { AssetKind, UiMessage, UiPart } from "@/lib/types";
import { TOOL_LABEL } from "./useAssistant";

const ASSET_ICON: Record<AssetKind, typeof MapIcon> = { fit: Gauge, brief: FileText, personas: Users, schema: Layers, map: MapIcon, bot: Phone };

const STARTERS = [
  { icon: BookOpen, title: "Ask about Blue Dots", text: "What has Blue Dots shown in Ghaziabad and Hubli?", prompt: "What has Blue Dots shown so far in Ghaziabad and Hubli-Dharwad?" },
  { icon: Target, title: "Check if an idea fits", text: "Working mothers in Tiruppur finding creches nearby", prompt: "Can Blue Dots work for working mothers in Tiruppur finding day-care and creches near them?" },
  { icon: PenLine, title: "Shape an idea into a brief", text: "Turn a rough idea into a problem, people and personas", prompt: "I have an idea for a Dots network but it's still rough. Help me shape it into a clear problem statement with personas." },
  { icon: Hammer, title: "Build a voice bot and a map", text: "Elder home care in Pune, end to end", prompt: "Build a bot and a dot map for elderly people and families in Pune finding home nurses, attendants and day-care centres near them." },
];

export function EmptyState({ onPick }: { name: string | null; onPick: (t: string) => void }) {
  return (
    <div className="scroll-quiet flex-1 overflow-y-auto">
      <div className="mx-auto w-full max-w-[640px] px-6 pb-8 pt-[12vh]">
        <h1 className="text-[30px] font-bold leading-[1.2] tracking-[-0.01em] text-ink">Start with a place and the people in it</h1>
        <p className="mt-2 text-[16px] leading-relaxed text-muted">
          Describe who needs help, who provides it, and where. The assistant checks the idea against the Blue Dots approach, writes the brief and personas, and builds a voice bot and a map you can share.
        </p>
        <div className="mt-8 text-[12px] font-medium text-faint">Try one of these</div>
        <div className="mt-1.5 -mx-2">
          {STARTERS.map((s) => (
            <button key={s.title} onClick={() => onPick(s.prompt)}
              className="flex w-full items-start gap-3 rounded-[5px] px-2 py-2 text-left transition-colors hover:bg-hover">
              <s.icon className="mt-[3px] h-[18px] w-[18px] shrink-0 text-muted" />
              <span className="min-w-0">
                <span className="block text-[15px] text-ink">{s.title}</span>
                <span className="block text-[14px] text-muted">{s.text}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
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
            <div className="ml-[7px] mt-1 whitespace-pre-wrap pl-4 text-[14px] leading-relaxed text-muted shadow-[inset_2px_0_0_rgba(55,53,47,0.16)]">{part.text.trim()}</div>
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
          <span className={clsx(bad ? "text-muted" : "text-ink underline decoration-[rgba(55,53,47,0.25)] underline-offset-[3px]")}>{label}</span>
          {part.summary && <span className="text-muted"> · {part.summary}</span>}
        </span>
      )}
    </button>
  );
}

const Markdown = memo(function Markdown({ text }: { text: string }) {
  return <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ a: (p) => <a {...p} target="_blank" rel="noreferrer" /> }}>{text}</ReactMarkdown>;
});

function AssistantMessage({ m, live, onOpen }: { m: UiMessage; live: boolean; onOpen: (k: AssetKind) => void }) {
  const [copied, setCopied] = useState(false);
  const text = m.parts.filter((p) => p.type === "text").map((p) => (p as { text: string }).text).join("\n\n");
  const lastIdx = m.parts.length - 1;
  return (
    <div className="group">
      {live && m.parts.length === 0 && <div className="text-[14px] text-muted">Thinking<Ellipsis /></div>}
      {m.parts.map((p, i) => {
        if (p.type === "thinking") return <Thinking key={i} part={p} live={live && i === lastIdx} />;
        if (p.type === "tool") return <ToolRow key={p.id} part={p} onOpen={onOpen} />;
        return <div key={i} className={clsx("prose-chat my-1.5", live && i === lastIdx && "caret")}><Markdown text={p.text} /></div>;
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
  );
}

function UserMessage({ m }: { m: UiMessage }) {
  const text = (m.parts[0] as { text: string })?.text ?? "";
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] whitespace-pre-wrap rounded-[10px] bg-[#f1f1ef] px-3 py-2 text-[16px] leading-relaxed text-ink">{text}</div>
    </div>
  );
}

export function Messages({ ui, streaming, onOpen, error, onRetry }: {
  ui: UiMessage[]; streaming: boolean; onOpen: (k: AssetKind) => void; error: string | null; onRetry: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const stick = useRef(true);
  const [away, setAway] = useState(false);
  useLayoutEffect(() => { const el = ref.current; if (el && stick.current) el.scrollTop = el.scrollHeight; });
  useEffect(() => { stick.current = true; setAway(false); }, [ui.length]);

  return (
    <div className="relative min-h-0 flex-1">
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
          {error && (
            <div className="flex items-start gap-2.5 rounded-[4px] bg-bad-soft px-3 py-2.5 text-[14px] text-ink">
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
          className="absolute bottom-3 left-1/2 grid h-8 w-8 -translate-x-1/2 place-items-center rounded-full bg-white text-muted shadow-pop hover:text-ink">
          <ArrowDown className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export function Composer({ onSend, onStop, streaming, autoFocus, placeholder }: {
  onSend: (t: string) => void; onStop: () => void; streaming: boolean; autoFocus?: boolean; placeholder?: string;
}) {
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
  const submit = () => { if (!text.trim() || streaming) return; onSend(text); setText(""); };
  const can = text.trim().length > 0;
  return (
    <div className="mx-auto w-full max-w-[680px] px-6 pb-4">
      <div className="rounded-[10px] bg-white shadow-composer transition-shadow focus-within:shadow-[0_0_0_1px_rgba(37,99,235,0.5),0_2px_4px_rgba(15,15,15,0.06)]">
        <textarea ref={ta} value={text} autoFocus={autoFocus} rows={1}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); submit(); } }}
          placeholder={placeholder ?? "Describe a place, the people, and what they need…"}
          className="block max-h-[220px] w-full resize-none bg-transparent px-3.5 pb-1 pt-3 text-[16px] leading-relaxed text-ink outline-none placeholder:text-faint" />
        <div className="flex items-center justify-end gap-2 px-2.5 pb-2.5">
          {streaming ? (
            <button onClick={onStop} aria-label="Stop" className="grid h-7 w-7 place-items-center rounded-full bg-ink text-white hover:bg-ink-2">
              <Square className="h-3 w-3 fill-current" />
            </button>
          ) : (
            <button onClick={submit} aria-label="Send" disabled={!can}
              className={clsx("grid h-7 w-7 place-items-center rounded-full transition-colors", can ? "bg-brand text-white hover:bg-brand-2" : "bg-[#e9e9e7] text-white")}>
              <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>
      <p className="mt-2 text-center text-[12px] text-faint">The assistant can make mistakes. People and organisations it creates are fictional.</p>
    </div>
  );
}
