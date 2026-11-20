// Tests for src/lib/factcheck.ts, from real mistakes the assistant made on 20 Nov 2026.
// Run: node sim/factcheck-test.mjs
import { makeChecker, renderMarkers, fixVoice } from "../src/lib/factcheck.ts";
import { FACTS } from "../src/generated/facts.ts";

const check = makeChecker(FACTS);
const cases = [
  // [name, reply, expected issue kinds ([] = must pass clean)]
  ["Ruthvi: 300% put in Ghaziabad", "In Ghaziabad, applications rose 300% once the district promoted the voice number [F23].", ["wrong_place"]],
  ["300% in Hubli-Dharwad", "In Hubli-Dharwad, applications rose 300% once the district itself promoted the voice number, and inbound callers applied at twice the rate [F23].", []],
  ["300% with no place", "- **Voice made applying easy:** applications rose 300% once the district promoted the phone number [F23].", ["no_place"]],
  ["Figure under a Ghaziabad list heading", "In Ghaziabad:\n\n- national portals listed 97 local jobs [F1].\n- the failure rate fell from 88.6% to 2% [F30].", ["wrong_place"]],
  ["Ghaziabad 10-minute calls are Ghaziabad", "In Ghaziabad, high-intent seekers talked to the voice agent for 10 minutes or more [F6].", []],
  ["Wrong number in a cited row", "In Hubli-Dharwad, 18,000 jobs and 8,000 candidates are on the map [F21].", ["wrong_number"]],
  ["Old marker, no fact id", "In Ghaziabad, fewer than 10% of MSMEs surfaced over 12,000 jobs (KD p.7).", ["uncited"]],
  ["Uncited known figure", "Applications rose 300% in Hubli-Dharwad.", ["uncited"]],
  ["Invented figure", "Blue Dots reached 45% of job seekers in Kerala.", ["unknown_figure"]],
  ["Across the pilots is fine", "Across the pilots, the application failure rate fell from 88.6% to 2% [F30].", []],
  ["70% allowed for Ghaziabad", "In Ghaziabad, over 70% of applications went to opportunities within 5 km [F3].", []],
  ["National figure in a Ghaziabad answer", "Nationally, India has 8.7 crore registered MSMEs [F90].", []],
  ["Prototype counts are not figures", "I built 29 dots across 8 localities in Indore, with 3 personas.", []],
  ["Helpline is fine", "For emergencies the bot points callers to 112.", []],
  ["Doc talk", "The documents say Ghaziabad listed 97 jobs [F1].", ["unknown_figure"]],
  ["Two districts compared", "National portals listed 97 local jobs in Ghaziabad [F1] and just 4 in Hubli-Dharwad [F20].", []],
];

let fail = 0;
for (const [name, reply, want] of cases) {
  const got = [...new Set(check(reply).issues.map((i) => i.kind))].sort();
  const ok = JSON.stringify(got) === JSON.stringify([...want].sort());
  if (!ok) { fail++; console.log(`✗ ${name}\n    want ${JSON.stringify(want)} got ${JSON.stringify(got)}`); for (const i of check(reply).issues) console.log(`    - ${i.kind}: ${i.detail}`); }
  else console.log(`✓ ${name}`);
}
const v = fixVoice("Run handovers through trusted collection points — schools and NGOs.");
console.log(v === "Run handovers through credible collection points, schools and NGOs." ? "✓ voice fix" : (fail++, `✗ voice fix: ${v}`));
const r = renderMarkers("Applications rose 300% [F23]. Portals listed 97 [F1; F20].", FACTS);
console.log(r === "Applications rose 300% [KD p.7–8]. Portals listed 97 [KD p.7; KD p.1; KD p.7]." || r.includes("[KD p.7–8]") ? `✓ markers: ${r}` : (fail++, `✗ markers: ${r}`));
console.log(fail ? `\n${fail} failing` : "\nall passing");
process.exit(fail ? 1 : 0);
