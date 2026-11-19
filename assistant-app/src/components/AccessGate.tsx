"use client";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { BrandChip } from "./icons";

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
    <main className="flex min-h-screen flex-col bg-white">
      <header className="flex h-14 items-center px-5"><BrandChip /></header>
      <div className="mx-auto flex w-full max-w-[340px] flex-1 flex-col justify-center pb-24">
        <h1 className="text-[28px] font-bold leading-tight tracking-[-0.01em] text-ink">Blue Dots Assistant</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">
          Check whether an idea fits the Blue Dots approach, shape it into a brief, and build a voice bot and a map you can show.
        </p>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <label className="block">
            <span className="mb-1 block text-[12px] font-medium text-muted">Your name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Priya" autoComplete="given-name"
              className="h-9 w-full rounded-md border border-line-2 bg-[#fbfbfa] px-2.5 text-[14px] text-ink outline-none transition placeholder:text-faint focus:border-brand focus:bg-white focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)]" />
          </label>
          <label className="block">
            <span className="mb-1 block text-[12px] font-medium text-muted">Access code</span>
            <input value={code} onChange={(e) => { setCode(e.target.value); setErr(null); }} placeholder="From your invite" autoFocus
              className="h-9 w-full rounded-md border border-line-2 bg-[#fbfbfa] px-2.5 text-[14px] text-ink outline-none transition placeholder:text-faint focus:border-brand focus:bg-white focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)]" />
          </label>
          {err && <p role="alert" className="text-[13px] text-bad">{err}</p>}
          <button type="submit" disabled={busy}
            className="flex h-9 w-full items-center justify-center rounded-md bg-brand text-[14px] font-medium text-white transition hover:bg-brand-2 active:translate-y-px">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Continue"}
          </button>
        </form>
        <p className="mt-6 text-[12px] leading-relaxed text-faint">Everything made here uses fictional people and organisations. Seeded by EkStep Foundation.</p>
      </div>
    </main>
  );
}
