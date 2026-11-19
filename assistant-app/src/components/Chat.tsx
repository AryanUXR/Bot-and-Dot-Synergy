"use client";
import { memo, useEffect, useLayoutEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AnimatePresence, motion } from "motion/react";
import clsx from "clsx";
import {
  ArrowUp, Square, Check, Copy, ChevronRight, Loader2, AlertCircle, ArrowDown, Sparkles, MessageCircleQuestion,
  Target, PenLine, Rocket, Map as MapIcon, Users, FileText, Layers, Phone, Gauge,
} from "lucide-react";
import type { AssetKind, UiMessage, UiPart } from "@/lib/types";
import { TOOL_LABEL } from "./useAssistant";
import { DotsMark } from "./icons";

const ASSET_ICON: Record<AssetKind, typeof MapIcon> = { fit: Gauge, brief: FileText, personas: Users, schema: Layers, map: MapIcon, bot: Phone };

const STARTERS = [
  { icon: MessageCircleQuestion, title: "Ask about Blue Dots", text: "What is Blue Dots, and what has it shown so far?", prompt: "What is Blue Dots, and what has it shown so far?" },
  { icon: Target, title: "Check if my idea fits", text: "Mothers finding day-care near them in Tiruppur", prompt: "Can Blue Dots work for working mothers in Tiruppur finding day-care and creches near them?" },
  { icon: PenLine, title: "Sharpen my problem", text: "Help me turn an idea into a clear brief and personas", prompt: "I have an idea for a Dots network but it's still fuzzy. Help me sharpen it into a clear problem statement with personas." },
  { icon: Rocket, title: "Build a bot and a map", text: "Elder home care in Pune, end to end", prompt: "Build a bot and a dot map for elderly people and families in Pune finding home nurses, attendants and day-care centres near them." },
];

export function EmptyState({ name, onPick }: { name: string | null; onPick: (t: string) => void }) {
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  return (
    <div className="mx-auto flex w-full max-w-[680px] flex-1 flex-col justify-center px-6 pb-10">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}>
        <DotsMark className="h-10 w-10" />
        <h1 className="mt-6 font-serif text-[40px] leading-[1.08] tracking-tight text-ink">
          {greet}{name ? `, ${name}` : ""}.<br />
          <span className="text-muted">What are we working on?</span>
        </h1>
        <p className="mt-3 max-w-[520px] text-[15px] leading-relaxed text-muted">
          Tell me about a place and the people in it. I&apos;ll help you check the idea, sharpen it, and build a voice bot and a dot map you can show today.
        </p>
      </motion.div>
      <div className="mt-8 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {STARTERS.map((s, i) => (
          <motion.button key={s.title} onClick={() => onPick(s.prompt)}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + i * 0.05, duration: 0.4 }}
            className="group rounded-2xl border border-line bg-panel p-4 text-left shadow-card transition hover:-translate-y-0.5 hover:border-brand-line hover:shadow-pop">
            <s.icon className="h-[18px] w-[18px] text-brand" />
            <div className="mt-3 text-[14px] font-medium text-ink">{s.title}</div>
            <div className="mt-0.5 text-[13px] leading-snug text-muted">{s.text}</div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function Thinking({ part, live }: { part: Extract<UiPart, { type: "thinking" }>; live: boolean }) {
  const [open, setOpen] = useState(false);
  const done = part.seconds != null;
  const preview = part.text.trim().split("\n").filter(Boolean).pop()?.replace(/[*#_`]/g, "") ?? "";
  return (
    <div className="mb-2">
      <button onClick={() => setOpen((o) => !o)} className="group flex items-center gap-1.5 text-[13px] text-muted hover:text-ink-2">
        <ChevronRight className={clsx("h-3.5 w-3.5 transition-transform", open && "rotate-90")} />
        {done ? <span>Thought for {part.seconds}s</span> : <span className="shimmer-text">Thinking</span>}
      </button>
      {!done && live && preview && !open && (
        <div className="ml-5 mt-1 line-clamp-1 text-[12.5px] text-faint">{preview}</div>
      )}
      <AnimatePresence initial={false}>
        {open && part.text && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden">
            <div className="ml-[7px] mt-2 whitespace-pre-wrap border-l border-line pl-4 text-[13px] leading-relaxed text-muted">{part.text.trim()}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ToolChip({ part, onOpen }: { part: Extract<UiPart, { type: "tool" }>; onOpen: (k: AssetKind) => void }) {
  const [busy, doneLabel] = TOOL_LABEL[part.name] ?? ["Working", "Done"];
  const Icon = part.asset ? ASSET_ICON[part.asset] : Sparkles;
  const running = part.status === "running";
  const bad = part.status === "error";
  return (
    <motion.button layout initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
      onClick={() => part.asset && !bad && onOpen(part.asset)}
      className={clsx(
        "my-1 mr-2 inline-flex max-w-full items-center gap-2 rounded-xl border px-3 py-2 text-left text-[13px] transition",
        running && "border-brand-line bg-brand-soft/60",
        part.status === "done" && "border-line bg-panel hover:border-brand-line hover:shadow-card",
        bad && "border-line bg-wash text-muted",
      )}>
      <span className={clsx("grid h-6 w-6 shrink-0 place-items-center rounded-lg", running ? "bg-brand text-white" : bad ? "bg-line text-muted" : "bg-brand-soft text-brand")}>
        {running ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : bad ? <AlertCircle className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
      </span>
      <span className="min-w-0">
        <span className={clsx("block font-medium", running ? "shimmer-text" : "text-ink")}>{running ? `${busy}…` : doneLabel}</span>
        {!running && part.summary && <span className="block truncate text-[12px] text-muted">{part.summary}</span>}
      </span>
      {part.status === "done" && <Check className="ml-1 h-3.5 w-3.5 shrink-0 text-good" />}
    </motion.button>
  );
}

const Markdown = memo(function Markdown({ text }: { text: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ a: (p) => <a {...p} target="_blank" rel="noreferrer" /> }}>
      {text}
    </ReactMarkdown>
  );
});

function AssistantMessage({ m, live, onOpen }: { m: UiMessage; live: boolean; onOpen: (k: AssetKind) => void }) {
  const [copied, setCopied] = useState(false);
  const text = m.parts.filter((p) => p.type === "text").map((p) => (p as { text: string }).text).join("\n\n");
  const lastIdx = m.parts.length - 1;
  const waiting = live && m.parts.length === 0;
  return (
    <div className="group flex gap-3.5">
      <div className="pt-0.5"><DotsMark className="h-7 w-7" /></div>
      <div className="min-w-0 flex-1">
        {waiting && <div className="flex h-7 items-center gap-1">{[0, 1, 2].map((i) => <span key={i} className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse-dot" style={{ animationDelay: `${i * 0.18}s` }} />)}</div>}
        {m.parts.map((p, i) => {
          if (p.type === "thinking") return <Thinking key={i} part={p} live={live && i === lastIdx} />;
          if (p.type === "tool") return <ToolChip key={p.id} part={p} onOpen={onOpen} />;
          return (
            <div key={i} className={clsx("prose-chat my-1", live && i === lastIdx && "caret-host")}>
              <Markdown text={p.text} />
            </div>
          );
        })}
        {live && m.parts.length > 0 && m.parts[lastIdx]?.type === "text" && <span className="caret" aria-hidden />}
        {!live && text && (
          <div className="mt-1.5 flex h-7 items-center gap-1 opacity-0 transition group-hover:opacity-100">
            <button aria-label="Copy" onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1400); }}
              className="grid h-7 w-7 place-items-center rounded-lg text-muted hover:bg-wash hover:text-ink">
              {copied ? <Check className="h-3.5 w-3.5 text-good" /> : <Copy className="h-3.5 w-3.5" />}
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
      <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-[#eaeef5] px-4 py-2.5 text-[15px] leading-relaxed text-ink">{text}</div>
    </div>
  );
}

export function Messages({ ui, streaming, onOpen, error, onRetry }: {
  ui: UiMessage[]; streaming: boolean; onOpen: (k: AssetKind) => void; error: string | null; onRetry: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const stick = useRef(true);
  const [away, setAway] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (el && stick.current) el.scrollTop = el.scrollHeight;
  });
  useEffect(() => { stick.current = true; setAway(false); }, [ui.length]);

  return (
    <div className="relative min-h-0 flex-1">
      <div ref={ref} onScroll={(e) => {
        const el = e.currentTarget;
        const near = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
        stick.current = near; setAway(!near);
      }} className="scroll-quiet absolute inset-0 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-[720px] flex-col gap-7 px-6 pb-8 pt-8">
          {ui.map((m, i) => (
            <motion.div key={m.id} initial={i >= ui.length - 2 ? { opacity: 0, y: 6 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
              {m.role === "user" ? <UserMessage m={m} /> : <AssistantMessage m={m} live={streaming && i === ui.length - 1} onOpen={onOpen} />}
            </motion.div>
          ))}
          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-[#f5d0c5] bg-bad-soft px-4 py-3 text-[14px] text-[#8a2a0a]">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <div className="flex-1">{error}</div>
              <button onClick={onRetry} className="font-medium underline underline-offset-2">Try again</button>
            </div>
          )}
        </div>
      </div>
      <AnimatePresence>
        {away && (
          <motion.button initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
            onClick={() => { const el = ref.current; if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" }); }}
            className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-line bg-panel px-3 py-1.5 text-[12.5px] text-ink-2 shadow-pop">
            <ArrowDown className="h-3.5 w-3.5" /> Latest
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Composer({ onSend, onStop, streaming, autoFocus, placeholder }: {
  onSend: (t: string) => void; onStop: () => void; streaming: boolean; autoFocus?: boolean; placeholder?: string;
}) {
  const [text, setText] = useState("");
  const ta = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => {
    const el = ta.current; if (!el) return;
    el.style.height = "0px"; el.style.height = Math.min(el.scrollHeight, 220) + "px";
  }, [text]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "TEXTAREA" && document.activeElement?.tagName !== "INPUT") { e.preventDefault(); ta.current?.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const submit = () => { if (!text.trim() || streaming) return; onSend(text); setText(""); };
  const can = text.trim().length > 0;
  return (
    <div className="mx-auto w-full max-w-[720px] px-6 pb-5">
      <div className="rounded-[22px] border border-line-2 bg-panel shadow-composer transition focus-within:border-brand-line">
        <textarea ref={ta} value={text} autoFocus={autoFocus} rows={1}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); submit(); } }}
          placeholder={placeholder ?? "Describe a place, the people, and what they need…"}
          className="block max-h-[220px] w-full resize-none bg-transparent px-5 pb-1 pt-4 text-[15px] leading-relaxed text-ink outline-none placeholder:text-faint" />
        <div className="flex items-center justify-between px-3 pb-3 pt-1">
          <span className="pl-2 text-[12px] text-faint">{streaming ? "Working… you can keep typing" : "Enter to send · Shift + Enter for a new line"}</span>
          {streaming ? (
            <button onClick={onStop} aria-label="Stop" className="grid h-9 w-9 place-items-center rounded-full bg-ink text-white transition hover:bg-ink-2">
              <Square className="h-3.5 w-3.5 fill-current" />
            </button>
          ) : (
            <button onClick={submit} aria-label="Send" disabled={!can}
              className={clsx("grid h-9 w-9 place-items-center rounded-full transition", can ? "bg-brand text-white hover:bg-brand-2 active:scale-95" : "bg-wash text-faint")}>
              <ArrowUp className="h-[18px] w-[18px]" />
            </button>
          )}
        </div>
      </div>
      <p className="mt-2 text-center text-[11.5px] text-faint">The assistant can make mistakes. All people and places on maps are fictional.</p>
    </div>
  );
}
