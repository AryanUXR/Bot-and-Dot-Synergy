"use client";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { BrandChip, EnvBadge } from "./icons";
import NetworkBackground from "./NetworkBackground";

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
    <main className="relative flex min-h-screen flex-col">
      <NetworkBackground className="pointer-events-none fixed inset-0 h-full w-full" />
      <header className="relative flex h-14 items-center gap-3 px-5"><BrandChip /><EnvBadge /></header>
      <div className="relative mx-auto flex w-full max-w-[360px] flex-1 flex-col justify-center pb-20">
        <h1 className="text-center text-[30px] font-medium leading-tight tracking-[-0.035em] text-ink">Blue Dots Assistant</h1>
        <p className="mt-2 text-center text-[15px] leading-relaxed text-muted">
          Check whether an idea fits the Blue Dots approach, shape it into a brief, and build a voice bot and a map you can show.
        </p>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <label className="block">
            <span className="mb-1 block text-[12px] font-medium text-muted">Your name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Priya" autoComplete="given-name"
              className="h-10 w-full rounded-[8px] border border-line-2 bg-wash px-2.5 text-[14px] text-ink outline-none transition placeholder:text-faint focus:border-brand focus:bg-panel focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)]" />
          </label>
          <label className="block">
            <span className="mb-1 block text-[12px] font-medium text-muted">Access code</span>
            <input value={code} onChange={(e) => { setCode(e.target.value); setErr(null); }} placeholder="From your invite" autoFocus
              className="h-10 w-full rounded-[8px] border border-line-2 bg-wash px-2.5 text-[14px] text-ink outline-none transition placeholder:text-faint focus:border-brand focus:bg-panel focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)]" />
          </label>
          {err && <p role="alert" className="text-[13px] text-bad">{err}</p>}
          <button type="submit" disabled={busy}
            className="m-btn btn-primary flex h-10 w-full items-center justify-center rounded-[9px] text-[14px] font-medium">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Continue"}
          </button>
        </form>
        <p className="mt-6 text-center text-[12px] leading-relaxed text-faint">Everything made here uses fictional people and organisations. Seeded by EkStep Foundation.{process.env.NEXT_PUBLIC_APP_ENV === "uat" && " This is the test site: the EkStep team reads chats here to improve the assistant."}</p>
      </div>
    </main>
  );
}
