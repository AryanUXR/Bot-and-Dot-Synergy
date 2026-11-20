// Checks counsel/facts.json against the source texts in counsel/sources.
// 1. Every evidence and place_evidence quote appears in its source (whitespace, quotes and page breaks ignored).
// 2. Every number in a claim appears in that fact's evidence.
// 3. A fact tied only to districts names the district in its evidence or place_evidence.
// Run: node counsel/check_facts.mjs   (exits 1 on any failure)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(fs.readFileSync(path.join(here, "facts.json"), "utf8"));
export const norm = (s) => s.replace(/=== page \d+ ===/g, " ").replace(/[’‘]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, "-").replace(/\s+/g, " ").trim().toLowerCase();
export const numbers = (s) => (s.replace(/(\d),(?=\d)/g, "$1").match(/\d+(?:\.\d+)?/g) ?? []).map(Number);
const ALIASES = { "Ghaziabad": ["ghaziabad"], "Hubli-Dharwad": ["hubli", "dharwad"], "Basti": ["basti"], "Udupi": ["udupi"] };

const text = Object.fromEntries(Object.entries(data.sources).map(([k, f]) => [k, norm(fs.readFileSync(path.join(here, "sources", f), "utf8"))]));
const errors = [];
const ids = new Set();
for (const f of data.facts) {
  if (ids.has(f.id)) errors.push(`${f.id}: duplicate id`);
  ids.add(f.id);
  for (const pl of f.places) if (!data.places.includes(pl)) errors.push(`${f.id}: unknown place "${pl}"`);
  const quotes = [...f.evidence, ...(f.place_evidence ? [f.place_evidence] : [])];
  for (const q of quotes) {
    if (!text[q.src]) { errors.push(`${f.id}: unknown source ${q.src}`); continue; }
    if (!text[q.src].includes(norm(q.text))) errors.push(`${f.id}: quote not found in ${q.src}: "${q.text.slice(0, 70)}…"`);
  }
  const have = new Set(f.evidence.flatMap((q) => numbers(q.text)));
  const missing = numbers(f.claim).filter((n) => !have.has(n));
  if (missing.length) errors.push(`${f.id}: claim numbers not in evidence: ${missing.join(", ")}`);
  const districts = f.places.filter((p) => ALIASES[p]);
  if (districts.length && districts.length === f.places.length) {
    const all = norm(quotes.map((q) => q.text).join(" "));
    for (const d of districts) if (!ALIASES[d].some((a) => all.includes(a))) errors.push(`${f.id}: no quote names ${d}`);
  }
}
if (errors.length) { console.error(errors.join("\n")); console.error(`\n${errors.length} problem(s) in ${data.facts.length} facts.`); process.exit(1); }
console.log(`facts.json OK: ${data.facts.length} facts, every quote found in its source, every number traced.`);
