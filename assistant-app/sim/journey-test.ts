// Offline tests for the journey stages (src/lib/journey.ts). Run: npx jiti sim/journey-test.ts
import { deriveJourney, journeyNote, EMPTY_SIGNALS, type JourneySignals } from "../src/lib/journey";
import type { Assets } from "../src/lib/types";

const fit = (verdict: "fits" | "fits_with_changes" | "not_yet") => ({ verdict, summary: "", criteria: [], to_make_it_fit: [] }) as unknown as Assets["fit"];
const brief = { title: "Pet care in Pune" } as unknown as Assets["brief"];
const personas = [{ id: "a" }, { id: "b" }, { id: "c" }] as unknown as Assets["personas"];
const map = { dots: [] } as unknown as Assets["map"];
const bot = (calls = 0) => ({ calls }) as unknown as Assets["bot"];
const S = (x: Partial<JourneySignals> = {}): JourneySignals => ({ ...EMPTY_SIGNALS, ...x });

const cases: [string, JourneySignals, Assets, string, string][] = [
  ["Knows nothing", S(), {}, "awareness", "Knows what a Blue Dot is and how it works"],
  ["Understands, no idea yet", S({ understands: true }), {}, "awareness", "Has an idea of their own: a place and the people"],
  ["Named an idea", S({ understands: true, has_idea: true }), {}, "consideration", "The idea fits Blue Dots (fit check)"],
  ["Idea doesn't fit yet", S({ has_idea: true }), { fit: fit("not_yet") }, "consideration", "The idea fits Blue Dots (fit check)"],
  ["Fits, no brief", S({ has_idea: true }), { fit: fit("fits_with_changes") }, "consideration", "A brief and three personas"],
  ["Brief written, not approved", S({ has_idea: true }), { fit: fit("fits"), brief, personas }, "consideration", "They approved the brief and personas"],
  ["Approved, not built", S({ has_idea: true, brief_approved: true }), { fit: fit("fits"), brief, personas }, "trial", "Voice bot and dot map built"],
  ["Built, not tried", S({ has_idea: true }), { fit: fit("fits"), brief, personas, map, bot: bot(0) }, "trial", "They tried the call or the map"],
  ["Built and called", S({ has_idea: true }), { fit: fit("fits"), brief, personas, map, bot: bot(2) }, "launch", ""],
  ["Skipped ahead: built without a fit check", S({ has_idea: true }), { brief, personas, map, bot: bot(0) }, "trial", "They tried the call or the map"],
];

let fail = 0;
for (const [name, s, a, stage, next] of cases) {
  const j = deriveJourney(s, a);
  const ok = j.stage === stage && j.next === next && j.options.length >= 1;
  if (!ok) fail++;
  console.log(`${ok ? "✓" : "✗"} ${name}: ${j.stage} · next "${j.next}" · options ${JSON.stringify(j.options)}`);
}
// An awareness-stage person must never be offered a build.
const aw = deriveJourney(S(), {});
const bad = aw.options.some((o) => /build|prototype|brief/i.test(o));
console.log(bad ? (fail++, "✗ awareness options offer a build") : "✓ awareness options never offer a build");
console.log("\nNote sample:\n" + journeyNote(deriveJourney(S({ understands: true }), {})));
console.log(fail ? `\n${fail} failing` : "\nall passing");
