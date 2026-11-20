"use client";
// Where the person is in the journey (Understand, Shape the idea, Try it, Launch), with what's
// left in the current stage on hover or focus. Stage names come from lib/journey.ts.
import clsx from "clsx";
import { Check } from "lucide-react";
import { STAGES, type Journey } from "@/lib/journey";

export default function JourneyBar({ journey }: { journey?: Journey }) {
  const current = STAGES.findIndex((s) => s.id === (journey?.stage ?? "awareness"));
  const stage = STAGES[current];
  const open = journey?.criteria.filter((c) => !c.met) ?? [];
  const tip = open.length ? `Next: ${open.map((c) => c.label.toLowerCase()).join("; then ")}.` : "This stage is done.";
  return (
    <div className="group relative" tabIndex={0} aria-label={`Stage ${current + 1} of ${STAGES.length}: ${stage.label}. ${tip}`}>
      <ol className="hidden items-center gap-1 text-[12.5px] md:flex" aria-hidden="true">
        {STAGES.map((s, i) => (
          <li key={s.id} className="flex items-center gap-1">
            {i > 0 && <span className="text-faint">›</span>}
            <span className={clsx("flex items-center gap-1 rounded-[4px] px-1.5 py-0.5",
              i === current ? "bg-brand-soft text-ink" : i < current ? "text-muted" : "text-faint")}>
              {i < current ? <Check className="h-3 w-3 text-good" /> : <span className={clsx("h-1.5 w-1.5 rounded-full", i === current ? "bg-brand-2" : "bg-line-2")} />}
              {s.label}
            </span>
          </li>
        ))}
      </ol>
      <span className="flex items-center gap-1.5 rounded-[4px] bg-brand-soft px-1.5 py-0.5 text-[12.5px] text-ink md:hidden" aria-hidden="true">
        <span className="h-1.5 w-1.5 rounded-full bg-brand-2" /> {current + 1}/{STAGES.length} {stage.label}
      </span>
      <div role="tooltip" className="pointer-events-none absolute right-0 top-full z-50 mt-1.5 hidden w-[280px] rounded-[6px] bg-[#1b232c] p-3 text-[13px] leading-relaxed text-ink-2 shadow-pop group-hover:block group-focus:block">
        <div className="font-medium text-ink">{stage.label}</div>
        <div className="text-muted">{stage.question}</div>
        {journey && journey.criteria.length > 0 && (
          <ul className="mt-2 space-y-1">
            {journey.criteria.map((c) => (
              <li key={c.key} className="flex gap-1.5">
                {c.met ? <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-good" /> : <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-line-2" />}
                <span className={c.met ? "text-muted" : "text-ink-2"}>{c.label}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
