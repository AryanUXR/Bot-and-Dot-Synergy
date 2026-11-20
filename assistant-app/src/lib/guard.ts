import Anthropic from "@anthropic-ai/sdk";
import { FACTS } from "../generated/facts";
import { makeChecker, renderMarkers, fixVoice, dropSentences, type Issue } from "./factcheck";

// Checks each sentence of a streaming reply before it reaches the person.
// Sentences that pass stream straight through (with [F23] turned into readable source markers).
// From the first sentence that fails, the rest of the text block is held, corrected once by the
// model against the facts table, checked again, and anything still failing is dropped.

const check = makeChecker(FACTS);
const FACT_LINES = FACTS.map((f) => `${f.id} [${f.places.join(" / ")}] ${f.claim} (${f.cite})`).join("\n");

const CORRECT_SYSTEM = `You fix one part of a reply from the Blue Dots assistant before it is shown. The part breaks the figure rules listed under Problems.
Rules:
- Every figure about Blue Dots must come from the facts table below, worded as its row is (over, under, about, nearly), with the row id in square brackets right after it, e.g. [F23].
- Say the place the row gives. A row's figure may only be put under a place listed in its brackets. "Across the pilots", "Blue Dots overall" and "National" rows are never put under one district.
- If a figure has no row, remove it and keep the sentence's point without a number.
- Never say "the documents say" or similar; just state the fact.
- Keep everything else: meaning, tone, markdown, length and the closing question. No em dashes. Say "credible", never "trust".
Return only the rewritten part, nothing else.

Facts table:
${FACT_LINES}`;

export type GateResult = { corrected: boolean; issues: Issue[] };

export class ReplyGate {
  private shown = ""; // checked text already sent (voice-fixed, with [F..] ids)
  private held = ""; // raw model text not yet sent
  private holding = false;
  private found: Issue[] = [];
  constructor(private emit: (text: string) => void, private client: Anthropic, private model: string) {}

  push(delta: string) {
    this.held += delta;
    if (this.holding) return;
    // Release whole sentences or lines only.
    const cut = lastBoundary(this.held);
    if (cut <= 0) return;
    this.release(this.held.slice(0, cut), false);
  }

  // Called when the text block ends.
  async end(): Promise<GateResult> {
    if (!this.holding && this.held) this.release(this.held, true);
    if (this.holding && this.held) await this.correct();
    const r = { corrected: this.found.length > 0, issues: this.found };
    this.shown = ""; this.held = ""; this.holding = false; this.found = [];
    return r;
  }

  private release(chunk: string, final: boolean) {
    const fixed = fixVoice(chunk);
    const res = check(this.shown + fixed, this.shown.length);
    if (res.issues.length) { this.holding = true; this.found.push(...res.issues); return; }
    this.send(fixed);
    this.held = this.held.slice(chunk.length);
    if (final) this.held = "";
  }

  private send(fixed: string) {
    this.shown += fixed;
    const out = renderMarkers(fixed, FACTS);
    if (out) this.emit(out);
  }

  private async correct() {
    const base = this.shown;
    const raw = fixVoice(this.held);
    const problems = check(base + raw, base.length).issues;
    let text = raw;
    if (problems.length) {
      try {
        const r = await this.client.messages.create({
          model: this.model, max_tokens: 4000,
          output_config: { effort: "low" },
          system: CORRECT_SYSTEM,
          messages: [{ role: "user", content: `Already shown (do not repeat):\n<<<\n${base.slice(-1500)}\n>>>\n\nRewrite this part:\n<<<\n${raw}\n>>>\n\nProblems:\n${problems.map((p) => `- ${p.detail}: "${p.sentence.trim().slice(0, 200)}"`).join("\n")}` }],
        } as Anthropic.MessageCreateParamsNonStreaming);
        const out = r.content.filter((b): b is Anthropic.TextBlock => b.type === "text").map((b) => b.text).join("").trim();
        if (out) text = fixVoice((raw.startsWith("\n") ? "\n" : "") + out.replace(/^<<<\s*|\s*>>>$/g, ""));
      } catch (e) {
        console.error("[guard] correction failed", e instanceof Error ? e.message : e);
      }
      // Anything still failing is dropped rather than shown.
      const again = check(base + text, base.length);
      const bad = again.sentences.filter((s) => s.issues.length).map((s) => ({ start: s.start - base.length, text: s.text }));
      if (bad.length) { console.warn("[guard] dropped", bad.length, "sentence(s)"); text = dropSentences(text, bad); }
    }
    if (text.trim()) this.send((base && !/^\s/.test(text) ? " " : "") + text);
    this.held = "";
  }
}

// The end of the last complete sentence or line in s, or 0 if there isn't one yet.
function lastBoundary(s: string): number {
  let best = s.lastIndexOf("\n") + 1;
  const re = /[.?!:](?:\s*\[[^\]]*\])?(?=\s)/g;
  // Don't cut inside an open [ marker.
  const open = s.lastIndexOf("[") > s.lastIndexOf("]");
  for (const m of s.matchAll(re)) {
    const end = m.index + m[0].length;
    const before = s.slice(Math.max(0, m.index - 4), m.index + 1);
    if (/\b(p|a\.m|p\.m|e\.g|i\.e|vs|no)\.$/i.test(before) || /\d\.$/.test(before) && /^\d/.test(s.slice(end + 1))) continue;
    if (end > best && end < s.length) best = end;
  }
  if (open) best = Math.min(best, s.lastIndexOf("["));
  return best;
}
