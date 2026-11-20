// Runs the reply checker over every assistant reply saved by simulation runs, to look for false alarms.
// Run: node sim/factcheck-scan.mjs [runDir]
import fs from "node:fs";
import path from "node:path";
import { makeChecker } from "../src/lib/factcheck.ts";
import { FACTS } from "../src/generated/facts.ts";
const check = makeChecker(FACTS);
const root = process.argv[2] ?? "sim/runs";
const files = fs.readdirSync(root, { recursive: true }).filter((f) => String(f).endsWith("result.json")).map((f) => path.join(root, String(f)));
const tally = {};
for (const f of files) {
  const r = JSON.parse(fs.readFileSync(f, "utf8"));
  for (const t of (r.transcript ?? []).filter((m) => m.role === "assistant").map((m) => m.text ?? "")) {
    if (t.length < 40) continue;
    for (const i of check(t).issues) {
      tally[i.kind] = (tally[i.kind] ?? 0) + 1;
      if (process.env.SHOW === i.kind) console.log(`[${path.basename(path.dirname(f))}] ${i.detail}\n   ${i.sentence.slice(0, 200)}`);
    }
  }
}
console.log(files.length, "transcripts", tally);
