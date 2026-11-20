import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { STAGES, deriveJourney, type Journey, type JourneySignals } from "./journey";
import type { Assets } from "./types";

// After each exchange, a small, cheap model judges what the person now knows and wants,
// and suggests two or three replies that move them to the next step of their stage.
// About 1,500 tokens in and 150 out on Haiku 5.5: roughly a tenth of a US cent.
const MODEL = process.env.JOURNEY_MODEL ?? "claude-haiku-5-5";

const Out = z.object({
  who: z.enum(["decision_maker", "implementation_incharge", "network_operator", "enabler", "other", "unknown"]),
  understands: z.boolean(),
  seen_evidence: z.boolean(),
  has_idea: z.boolean(),
  idea: z.string().max(140),
  brief_approved: z.boolean(),
  tried: z.boolean(),
  wants_launch: z.boolean(),
  options: z.array(z.string().max(60)).min(2).max(3),
});

const SYSTEM = `You track where a person is in the Blue Dots journey, from a conversation with the Blue Dots assistant. Reply with JSON only.

Stages: ${STAGES.map((s) => `${s.id} ("${s.question}"; they leave with: ${s.leaveWith})`).join("; ")}.

Fields (each true/false flag stays true once it is true; set it true only on clear evidence in the conversation):
- who: decision_maker (DM, Secretary, Mission Director), implementation_incharge (CDO, nodal officer, programme director), network_operator (runs its own network), enabler (consultant, PMU, system integrator, voice or cloud provider), other, or unknown.
- understands: they have heard what a Blue Dot is (people on both sides say what they need or offer by voice, and find each other nearby, with consent) and showed no confusion about it.
- seen_evidence: the assistant has told them what the pilots showed.
- has_idea: they have named a use case of their own, with at least a place or a group of people. idea: that use case in a few words, or "".
- brief_approved: they said yes to the brief and personas (or asked to build from them).
- tried: they said they called the bot or explored the map.
- wants_launch: they are asking about real deployment, procurement, activation, rollout or scale.
- options: two or three short replies the PERSON could send next, in their voice, under 60 characters each. Each must move them toward the first open step of their CURRENT stage, or answer something they are likely to wonder now. Never suggest a step two stages ahead: no "build a prototype" before they have an idea and a brief; no rollout questions before a prototype. If their idea doesn't fit yet, suggest reframing it.`;

export async function classifyJourney(
  client: Anthropic,
  prev: JourneySignals,
  assets: Assets,
  lastUser: string,
  lastReply: string,
): Promise<{ signals: JourneySignals; journey: Journey; usage: { input: number; output: number } } | null> {
  const before = deriveJourney(prev, assets);
  const facts = [
    assets.fit ? `fit check: ${assets.fit.verdict}` : "no fit check",
    assets.brief ? `brief: ${assets.brief.title} in ${assets.brief.place}` : "no brief",
    assets.personas ? `${assets.personas.length} personas` : "no personas",
    assets.bot && assets.map ? "voice bot and map built" : "nothing built",
  ].join("; ");
  try {
    const r = await client.messages.create({
      model: MODEL, max_tokens: 400,
      thinking: { type: "disabled" },
      output_config: { effort: "low" },
      system: SYSTEM,
      messages: [{
        role: "user",
        content: `Previous record: ${JSON.stringify(prev)}\nWhat exists: ${facts}\nCurrent stage: ${before.stage}; first open step: ${before.next || "none"}\n\nPERSON: ${lastUser.slice(0, 1500)}\n\nASSISTANT: ${lastReply.slice(0, 2500)}`,
      }],
    } as Anthropic.MessageCreateParamsNonStreaming);
    const t = r.content.filter((b): b is Anthropic.TextBlock => b.type === "text").map((b) => b.text).join("");
    const parsed = Out.safeParse(JSON.parse(t.slice(t.indexOf("{"), t.lastIndexOf("}") + 1)));
    if (!parsed.success) return null;
    const o = parsed.data;
    // Flags only move forward.
    const signals: JourneySignals = {
      who: o.who !== "unknown" ? o.who : prev.who,
      understands: prev.understands || o.understands,
      seen_evidence: prev.seen_evidence || o.seen_evidence,
      has_idea: prev.has_idea || o.has_idea,
      idea: o.idea || prev.idea,
      brief_approved: prev.brief_approved || o.brief_approved,
      tried: prev.tried || o.tried,
      wants_launch: prev.wants_launch || o.wants_launch,
    };
    return { signals, journey: deriveJourney(signals, assets, o.options), usage: { input: r.usage.input_tokens, output: r.usage.output_tokens } };
  } catch (e) {
    console.error("[journey]", e instanceof Error ? e.message : e);
    return null;
  }
}
