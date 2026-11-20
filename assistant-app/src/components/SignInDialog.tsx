"use client";
// Sign in to save work: whitelisted emails only. Step 1 asks for the email; step 2 asks for the
// password, or, the first time, a name and a new password. Guests' chats move into the account.
import { useEffect, useRef, useState } from "react";
import { Loader2, X } from "lucide-react";

const field = "block h-10 w-full rounded-[8px] border border-line-2 bg-wash px-3 text-[14px] text-ink outline-none transition-colors placeholder:text-faint focus:border-brand-2 focus:bg-panel focus:shadow-[0_0_0_3px_rgba(37,99,235,0.18)]";

export default function SignInDialog({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "password" | "create">("email");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", k);
    box.current?.querySelector<HTMLInputElement>("input")?.focus();
    return () => window.removeEventListener("keydown", k);
  }, [onClose, step]);

  async function next(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (step === "email") {
      setBusy(true);
      const j = await fetch(`/api/auth?email=${encodeURIComponent(email)}`).then((r) => r.json()).catch(() => ({}));
      setBusy(false);
      if (!j.allowed) { setErr("This email isn't on the list for saved accounts yet. Ask the EkStep team to add it. You can keep using the assistant without signing in."); return; }
      setStep(j.exists ? "password" : "create");
      return;
    }
    setBusy(true);
    const r = await fetch("/api/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password, name }) });
    const j = await r.json().catch(() => ({}));
    if (r.ok) { window.location.reload(); return; }
    setBusy(false);
    setErr(j.error ?? "That didn't work. Try again.");
  }

  return (
    <div className="fixed inset-0 z-[2500] grid place-items-center bg-black/60 p-4" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="signin-title">
      <div ref={box} onClick={(e) => e.stopPropagation()} className="relative w-full max-w-[360px] rounded-[12px] border border-line-2 bg-panel p-6 shadow-pop">
        <button type="button" onClick={onClose} aria-label="Close" className="absolute right-4 top-[22px] grid h-7 w-7 place-items-center rounded-[6px] text-muted hover:bg-hover hover:text-ink"><X className="h-4 w-4" /></button>
        <h2 id="signin-title" className="pr-8 text-[18px] font-medium leading-[1.3] text-ink">Save your work</h2>
        <p className="mt-1.5 text-[14px] leading-[1.5] text-muted">
          {step === "create" ? "First time here. Add your name and choose a password." : "Keep your chats and prototypes, on any device."}
        </p>
        <form onSubmit={next} className="mt-5 space-y-3.5">
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-medium text-ink-2">Email</span>
            <input type="email" autoComplete="email" value={email} disabled={step !== "email"} onChange={(e) => setEmail(e.target.value)} placeholder="you@organisation.org" className={field} />
          </label>
          {step === "create" && (
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-medium text-ink-2">Your name</span>
              <input autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Priya" className={field} />
            </label>
          )}
          {step !== "email" && (
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-medium text-ink-2">{step === "create" ? "Choose a password" : "Password"}</span>
              <input type="password" autoComplete={step === "create" ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} className={field} />
            </label>
          )}
          {err && <p role="alert" className="text-[13px] leading-[1.45] text-bad">{err}</p>}
          <button type="submit" disabled={busy} className="!mt-4 flex h-10 w-full items-center justify-center rounded-[8px] bg-brand text-[14px] font-medium text-white transition-colors hover:bg-brand-2 disabled:opacity-60">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : step === "email" ? "Continue" : step === "create" ? "Create account" : "Sign in"}
          </button>
          {step !== "email" && (
            <button type="button" onClick={() => { setStep("email"); setPassword(""); setErr(null); }} className="!mt-2 h-8 w-full text-center text-[13px] text-muted hover:text-ink">Use a different email</button>
          )}
        </form>
        {step === "email" && <p className="mt-3 text-[12px] leading-[1.45] text-faint">For invited emails. Chats from this browser move into your account.</p>}
        {step === "create" && <p className="mt-3 text-[12px] leading-[1.45] text-faint">At least 10 characters.</p>}
      </div>
    </div>
  );
}
