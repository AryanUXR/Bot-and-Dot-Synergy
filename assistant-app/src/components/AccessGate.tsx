"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Loader2 } from "lucide-react";
import { DotsMark } from "./icons";

const DOTS = Array.from({ length: 38 }, (_, i) => ({
  x: (i * 37) % 100, y: (i * 53) % 100, r: 3 + ((i * 7) % 6), d: 6 + (i % 7), o: 0.12 + ((i * 13) % 30) / 100,
}));

export default function AccessGate() {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) { setErr("Enter the access code you were given."); return; }
    setBusy(true); setErr(null);
    const r = await fetch("/api/access", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code, name }) });
    if (r.ok) { window.location.reload(); return; }
    const j = await r.json().catch(() => ({}));
    setErr(j.error ?? "That code didn't work. Check it and try again.");
    setBusy(false);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0b1530] text-white">
      <div aria-hidden className="absolute inset-0">
        {DOTS.map((d, i) => (
          <motion.span key={i} className="absolute rounded-full bg-[#5b8cff]"
            style={{ left: `${d.x}%`, top: `${d.y}%`, width: d.r * 2, height: d.r * 2, opacity: d.o }}
            animate={{ y: [0, -14, 0], opacity: [d.o, d.o * 2, d.o] }}
            transition={{ duration: d.d, repeat: Infinity, ease: "easeInOut", delay: i * 0.17 }} />
        ))}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.28),transparent_60%)]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}>
          <img src="/blue-dots-logo.png" alt="Blue Dots AI — Seeded by EkStep" width={899} height={290} className="h-11 w-auto" />
          <h1 className="mt-10 font-serif text-[44px] leading-[1.05] tracking-tight">
            From an idea to a bot<br />and a map, <span className="italic text-[#9db8ff]">in minutes.</span>
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-white/70">
            Talk through your use case with the Blue Dots assistant. Check it fits, sharpen the problem, and build a voice bot people can call and a map of the help around them.
          </p>

          <form onSubmit={submit} className="mt-9 space-y-3">
            <label className="block">
              <span className="mb-1.5 block text-[13px] text-white/60">Your name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Priya" autoComplete="given-name"
                className="h-12 w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 text-[15px] outline-none transition placeholder:text-white/30 focus:border-[#7aa2ff] focus:bg-white/[0.09]" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[13px] text-white/60">Access code</span>
              <input value={code} onChange={(e) => { setCode(e.target.value); setErr(null); }} placeholder="The code from your invite" autoFocus
                className="h-12 w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 text-[15px] outline-none transition placeholder:text-white/30 focus:border-[#7aa2ff] focus:bg-white/[0.09]" />
            </label>
            {err && <p role="alert" className="text-[13px] text-[#ffb4a1]">{err}</p>}
            <button type="submit" disabled={busy}
              className="group mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white text-[15px] font-medium text-[#0b1530] transition hover:bg-[#e8efff] active:scale-[0.99]">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Start <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" /></>}
            </button>
          </form>
          <p className="mt-8 flex items-center gap-2 text-[12px] text-white/40"><DotsMark className="h-4 w-4" /> Everything you build here uses fictional data.</p>
        </motion.div>
      </div>
    </main>
  );
}
