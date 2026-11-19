"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import clsx from "clsx";
import { Phone, PhoneCall, Check, Loader2, Languages } from "lucide-react";
import type { Assets } from "@/lib/types";
import { COLOURS } from "@/lib/types";
import { PersonaPhoto } from "./Canvas";

type CallState = "idle" | "placing" | "ringing" | "error";

export default function BotPanel({ projectId, assets, onToast, publicView = false }: {
  projectId: string; assets: Assets; onToast?: (t: string) => void; publicView?: boolean;
}) {
  const b = assets.brief!;
  const c = COLOURS[b.colour];
  const personas = assets.personas ?? [];
  const [pick, setPick] = useState(personas[0]?.id ?? "");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState<CallState>("idle");
  const [msg, setMsg] = useState<string | null>(null);
  const chosen = personas.find((p) => p.id === pick);

  async function call(e: React.FormEvent) {
    e.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 10) { setState("error"); setMsg("Enter a 10-digit mobile number."); return; }
    setState("placing"); setMsg(null);
    const r = await fetch("/api/call", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ projectId, personaId: pick, phone: digits, countryCode: "91" }) });
    const j = await r.json().catch(() => ({}));
    if (r.ok && j.ok) { setState("ringing"); onToast?.(`${b.bot_name} is calling you now.`); setTimeout(() => setState("idle"), 45000); }
    else { setState("error"); setMsg(j.message ?? "The call couldn't be placed. Try again in a moment."); }
  }

  return (
    <div className="min-h-full bg-canvas">
      <div className="relative overflow-hidden" style={{ background: `linear-gradient(90deg, ${c.hex}, ${c.deep})` }}>
        <div className="flex h-20 items-center gap-3 px-6 sm:gap-4">
          <img src="/blue-dots-logo.png" alt="Blue Dots AI — Seeded by EkStep" width={899} height={290} className="h-9 w-auto sm:h-11" />
          <span className="h-7 w-px bg-white/25 sm:h-9" />
          <div className="min-w-0">
            <div className="truncate text-lg font-bold text-white sm:text-2xl">{b.bot_name}</div>
            <div className="truncate text-xs text-white/80">{b.tagline}</div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />
      </div>

      <div className="mx-auto max-w-[880px] px-6 py-8">
        <div className="flex flex-wrap items-center gap-2 text-[12.5px] text-muted">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-good-soft px-2.5 py-1 font-semibold text-good"><span className="h-1.5 w-1.5 rounded-full bg-good" /> Live</span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-wash px-2.5 py-1"><Languages className="h-3.5 w-3.5" /> {b.language}</span>
          <span className="rounded-full bg-wash px-2.5 py-1">{b.place}</span>
        </div>
        <h2 className="mt-4 font-serif text-[30px] leading-tight text-ink">Pick someone to be, and {b.bot_name} will call you.</h2>
        <p className="mt-2 text-[14.5px] text-muted">Each persona is a fictional person in {b.place}. Take the call as them and ask what they would ask.</p>

        <div className="mt-6 grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
          {personas.map((p) => {
            const on = p.id === pick;
            return (
              <button key={p.id} onClick={() => setPick(p.id)}
                className={clsx("flex gap-3 rounded-2xl border bg-panel p-3 text-left transition",
                  on ? "border-brand shadow-[0_0_0_3px_rgba(37,99,235,0.12)]" : "border-line hover:border-brand-line")}>
                <PersonaPhoto projectId={projectId} p={p} photoKey={assets.photos?.[p.id]} auto={!publicView} className="h-16 w-16 shrink-0 rounded-xl" />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-[14.5px] font-semibold text-ink">{p.name}{on && <Check className="h-4 w-4 text-brand" />}</div>
                  <div className="text-[12px] text-muted">{p.area}</div>
                  <div className="mt-1 line-clamp-2 text-[12.5px] leading-snug text-ink-2">{p.need}</div>
                </div>
              </button>
            );
          })}
        </div>

        <form onSubmit={call} className="mt-6 rounded-2xl border border-line bg-panel p-5 shadow-card">
          <label className="text-[13px] font-medium text-ink-2" htmlFor="phone">Your mobile number</label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <div className="flex h-12 flex-1 items-center rounded-xl border border-line-2 bg-panel focus-within:border-brand">
              <span className="pl-4 pr-2 text-[15px] text-muted">+91</span>
              <input id="phone" inputMode="numeric" autoComplete="tel-national" value={phone} placeholder="98765 43210"
                onChange={(e) => { setPhone(e.target.value.replace(/[^\d\s]/g, "").slice(0, 12)); if (state === "error") setState("idle"); }}
                className="h-full w-full rounded-r-xl bg-transparent pr-4 text-[16px] tracking-wide outline-none placeholder:text-faint" />
            </div>
            <button type="submit" disabled={state === "placing" || state === "ringing"}
              className={clsx("relative flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-[15px] font-semibold text-white transition active:scale-[0.99]",
                state === "ringing" ? "bg-good" : "bg-brand hover:bg-brand-2")}>
              {state === "placing" ? <><Loader2 className="h-4 w-4 animate-spin" /> Placing the call</> :
                state === "ringing" ? <><span className="relative grid h-5 w-5 place-items-center"><span className="absolute inset-0 rounded-full bg-white/50 animate-ring" /><PhoneCall className="relative h-4 w-4" /></span> Calling you now</> :
                <><Phone className="h-4 w-4" /> Call me as {chosen?.name.split(" ")[0] ?? "this persona"}</>}
            </button>
          </div>
          <AnimatePresence>
            {msg && <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} role="alert" className="mt-3 text-[13px] text-bad">{msg}</motion.p>}
          </AnimatePresence>
          <p className="mt-3 text-[12px] text-faint">Your number is used only to place this call. Calls last up to four minutes.</p>
        </form>

        {assets.bot?.greeting && (
          <div className="mt-6 rounded-2xl bg-wash p-5">
            <div className="text-[11.5px] font-semibold uppercase tracking-[0.08em] text-faint">How {b.bot_name} opens</div>
            <p className="mt-2 font-serif text-[19px] leading-snug text-ink">“{assets.bot.greeting}”</p>
          </div>
        )}
      </div>
    </div>
  );
}
