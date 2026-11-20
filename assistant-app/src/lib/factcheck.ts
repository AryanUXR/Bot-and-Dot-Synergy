// Checks the assistant's replies before people see them. Plain code, no model calls.
//
// 1. Figures. A figure about Blue Dots must cite a row of the facts table ([F23]), every number in the
//    sentence must be in the cited rows, and the place the sentence (or its list heading) names must be a
//    place the row allows. A known figure with no [F..] marker, or a percentage/lakh/crore/₹ figure in a
//    Blue Dots sentence that matches no row, is also flagged.
// 2. Voice (EkStep comms rules): no em dashes, "credible" not "trust", never "the documents say".
//
// Voice problems are fixed in place. Figure problems are returned for the caller to correct or drop.
// This file has no imports so it can be tested with plain Node (see sim/factcheck-test.mjs).

export type Fact = { id: string; places: string[]; claim: string; cite: string; topic: string };
export type Issue = { kind: "uncited" | "unknown_figure" | "wrong_number" | "wrong_place" | "no_place" | "unknown_fact"; sentence: string; detail: string };
export type Check = { text: string; issues: Issue[]; sentences: { text: string; start: number; issues: Issue[] }[] };

const HELPLINES = new Set([112, 181, 1098, 14567, 108]);
const PLACE_TERMS: [string, RegExp][] = [
  ["Ghaziabad", /\bghaziabad\b/i],
  ["Hubli-Dharwad", /\b(hubli|dharwad)\b/i],
  ["Basti", /\bbasti\b/i],
  ["Udupi", /\budupi\b/i],
  ["Across the pilots", /\b(across (the|both) (pilots|districts)|both (pilots|districts)|in both\b|across implementations|across the two)/i],
  ["National", /\b(india|indian|nationally|national(?! (employment |job )?(portals?|platforms?|career))|across the country|census)\b/i],
  ["Projection", /\b(if scaled|scaled up|could make|could gain|200 districts|projection)\b/i],
  ["Startup pilots", /\b(baylink|digital labour chowk|netpractice|startup|accelerator)/i],
  ["Illustrative", /\b(illustrat|for example|say,)/i],
];
const PROTOTYPE = /\b(made-up|fictional|prototype|personas?|localities|providers and|requests? from|on the map|map tab|dots across|voice bot|brief)\b/i;
const DISTRICTS = new Set(["Ghaziabad", "Hubli-Dharwad", "Basti", "Udupi"]);
const DOC_TALK = /\b(the (documents?|docs?|sources?|deck|report|knowledge base) (say|says|said|mention|mentions|state|states|show|shows|note|notes)|according to (the )?(documents?|sources?|KD|GZ)|KD (says|mentions)|the doc mentions)\b/i;

export const numbersIn = (s: string) =>
  (s.replace(/(\d),(?=\d)/g, "$1").match(/\d+(?:\.\d+)?/g) ?? []).map(Number);

function placesIn(s: string): Set<string> {
  const out = new Set<string>();
  for (const [p, re] of PLACE_TERMS) if (re.test(s)) out.add(p);
  return out;
}

// Numbers that are figures (not list numbering, years, helplines, or small counts like "3 personas").
function figuresIn(s: string): { n: number; strong: boolean }[] {
  const t = s.replace(/\[[^\]]*\]/g, " ").replace(/\((?:KD|GZ|PQ|DS)\b[^)]*\)/g, " ").replace(/^\s*(\d+[.)]|[-*•])\s+/, " ");
  const out: { n: number; strong: boolean }[] = [];
  const re = /(₹\s?)?(\d[\d,]*(?:\.\d+)?)(\s?(%|per ?cent|lakh|crore|km|x\b|L\b|minutes?|mins?|hours?|days?|weeks?))?/gi;
  for (const m of t.matchAll(re)) {
    const n = Number(m[2].replace(/,/g, ""));
    if (!Number.isFinite(n) || HELPLINES.has(n)) continue;
    if (n >= 1900 && n <= 2100 && !m[1] && !m[3]) continue; // a year
    const strong = !!m[1] || /%|per ?cent|lakh|crore/i.test(m[3] ?? "");
    if (!strong && n <= 12 && !m[3]) continue; // small counts
    out.push({ n, strong });
  }
  return out;
}

type Seg = { text: string; start: number; ctx: Set<string> };

// Split a reply into sentences, each with the places its list heading or paragraph lead-in named.
function segment(text: string): Seg[] {
  const segs: Seg[] = [];
  let ctx = new Set<string>();
  let offset = 0;
  for (const line of text.split("\n")) {
    const isItem = /^\s*([-*•]|\d+[.)])\s+/.test(line);
    const blank = !line.trim();
    if (!blank && !isItem) ctx = new Set<string>(); // new prose paragraph: its own context
    // Protect bracketed markers and abbreviations from sentence splitting.
    const safe = line.replace(/\[[^\]]*\]/g, (m) => m.replace(/\./g, "․")).replace(/\b(p|a\.m|p\.m|e\.g|i\.e|Rs|no|vs)\./gi, (m) => m.replace(/\./g, "․"));
    const parts = safe.split(/(?<=[.?!])\s+(?=[A-Z₹"(*\d])/);
    let pos = 0;
    for (const part of parts) {
      const idx = safe.indexOf(part, pos);
      const real = line.slice(idx, idx + part.length);
      pos = idx + part.length;
      if (real.trim()) segs.push({ text: real, start: offset + idx, ctx: new Set(ctx) });
      // A lead-in (ends with ":" or is a bold label) sets the context for what follows.
      const label = real.match(/^\s*(?:[-*•]\s+)?\*\*([^*]+)\*\*/);
      if (!isItem && /:\s*$/.test(real)) ctx = placesIn(real);
      else if (isItem && label) { /* item label applies to the item only */ }
      else if (!isItem) for (const p of placesIn(real)) ctx.add(p);
    }
    offset += line.length + 1;
  }
  return segs;
}

export function makeChecker(facts: Fact[]) {
  const byId = new Map(facts.map((f) => [f.id, f]));
  const factNums = new Map(facts.map((f) => [f.id, new Set(numbersIn(f.claim))]));
  const allNums = new Map<number, string[]>();
  for (const f of facts) for (const n of factNums.get(f.id)!) allNums.set(n, [...(allNums.get(n) ?? []), f.id]);

  function checkSentence(s: Seg, item: boolean, itemLabelPlaces: Set<string>): Issue[] {
    const issues: Issue[] = [];
    const ids = [...s.text.matchAll(/\bF\d{1,3}\b/g)].map((m) => m[0]).filter((id) => /\[[^\]]*\]/.test(s.text));
    const figs = figuresIn(s.text);
    const own = placesIn(s.text.replace(/\[[^\]]*\]/g, " "));
    const ownDistrict = [...own].some((p) => DISTRICTS.has(p));
    const scope = ownDistrict ? own : new Set([...own, ...(itemLabelPlaces.size ? itemLabelPlaces : s.ctx)]);
    const scopeDistricts = [...scope].filter((p) => DISTRICTS.has(p));

    if (ids.length) {
      const cited = ids.map((id) => byId.get(id)).filter(Boolean) as Fact[];
      for (const id of ids) if (!byId.has(id)) issues.push({ kind: "unknown_fact", sentence: s.text, detail: `${id} is not in the facts table` });
      const have = new Set(cited.flatMap((f) => [...factNums.get(f.id)!]));
      for (const { n } of figs) if (!have.has(n)) issues.push({ kind: "wrong_number", sentence: s.text, detail: `${n} is not in ${ids.join(", ")}` });
      for (const f of cited) {
        const ok = f.places.some((p) => scope.has(p));
        const districtOnly = f.places.every((p) => DISTRICTS.has(p));
        if (scopeDistricts.length && !ok) {
          // A general fact is fine unless this sentence itself puts it in a district.
          const general = !f.places.some((p) => DISTRICTS.has(p));
          if (!(general && !own.size && !item)) issues.push({ kind: "wrong_place", sentence: s.text, detail: `${f.id} is ${f.places.join(" / ")}, but this says ${scopeDistricts.join(" / ")}` });
        } else if (!scopeDistricts.length && districtOnly && !ok) {
          issues.push({ kind: "no_place", sentence: s.text, detail: `${f.id} is a ${f.places.join(" / ")} figure; say so` });
        } else if (scope.size && !ok && !districtOnly && [...scope].some((p) => p !== "National") && f.places.every((p) => DISTRICTS.has(p) || p === "Projection")) {
          issues.push({ kind: "wrong_place", sentence: s.text, detail: `${f.id} is ${f.places.join(" / ")}` });
        }
      }
    } else {
      // Plain numbers (no %, lakh, crore, ₹) count only in a sentence about real places, not the prototype.
      const realPlace = [...scope].some((p) => DISTRICTS.has(p) || p === "Across the pilots" || p === "National");
      const prototype = PROTOTYPE.test(s.text);
      const known = figs.filter(({ n, strong }) => allNums.has(n) && (strong || (n >= 13 && realPlace && !prototype)));
      if (known.length) {
        const guess = [...new Set(known.flatMap(({ n }) => allNums.get(n)!))].slice(0, 4).join(", ");
        issues.push({ kind: "uncited", sentence: s.text, detail: `figure ${known.map((k) => k.n).join(", ")} has no fact id (maybe ${guess})` });
      } else {
        const strangers = figs.filter(({ n, strong }) => strong && !allNums.has(n));
        const aboutBlueDots = scope.size > 0 || /\b(blue dots?|pilot|district|msme|applications?|job seekers?|candidates?)\b/i.test(s.text);
        if (strangers.length && aboutBlueDots) issues.push({ kind: "unknown_figure", sentence: s.text, detail: `${strangers.map((k) => k.n).join(", ")} is not in the facts table` });
      }
    }
    return issues;
  }

  return function check(raw: string, from = 0): Check {
    const text = fixVoice(raw);
    const segs = segment(text);
    const sentences: Check["sentences"] = [];
    for (const s of segs) {
      if (s.start < from) continue;
      const line = text.slice(text.lastIndexOf("\n", s.start) + 1).split("\n")[0];
      const item = /^\s*([-*•]|\d+[.)])\s+/.test(line);
      const label = line.match(/^\s*(?:[-*•]|\d+[.)])\s+\*\*([^*]+)\*\*/);
      const issues = checkSentence(s, item, label ? placesIn(label[1]) : new Set());
      if (DOC_TALK.test(s.text)) issues.push({ kind: "unknown_figure", sentence: s.text, detail: "talks about 'the documents'; state the fact instead" });
      sentences.push({ text: s.text, start: s.start, issues });
    }
    return { text, issues: sentences.flatMap((s) => s.issues), sentences };
  };
}

// EkStep comms voice: fixed in place, no model needed.
export function fixVoice(s: string): string {
  return s
    .replace(/\s*—\s*/g, ", ")
    .replace(/\btrustworthy\b/g, "credible").replace(/\bTrustworthy\b/g, "Credible")
    .replace(/\btrusted\b/g, "credible").replace(/\bTrusted\b/g, "Credible")
    .replace(/\btrust\b/g, "credibility").replace(/\bTrust\b/g, "Credibility");
}

// Turn [F23] markers into source markers people can read: [KD p.7–8]. Same marker for repeats.
export function renderMarkers(s: string, facts: Fact[]): string {
  const byId = new Map(facts.map((f) => [f.id, f]));
  return s.replace(/\[((?:F\d{1,3})(?:\s*[,;]\s*F\d{1,3})*)\]/g, (_, ids: string) => {
    const cites = [...new Set(ids.split(/\s*[,;]\s*/).flatMap((id) => (byId.get(id)?.cite ?? "").split(/;\s*/)).filter(Boolean))];
    return cites.length ? `[${cites.join("; ")}]` : "";
  });
}

// Drop sentences that still fail after correction, keeping the rest of the reply intact.
export function dropSentences(text: string, bad: { start: number; text: string }[]): string {
  let out = text;
  for (const b of [...bad].sort((a, z) => z.start - a.start)) out = out.slice(0, b.start) + out.slice(b.start + b.text.length);
  return out.replace(/^\s*([-*•]|\d+[.)])\s*$/gm, "").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}
