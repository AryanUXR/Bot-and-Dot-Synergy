// Where a person is in the Blue Dots journey, and what qualifies them for the next stage.
// Stages and exits come from the concept Doc "Conceptualising the Blue Dots Assistant" §2:
// Awareness -> Consideration -> Trial -> Launch -> Scale. The assistant works today through Trial.
//
// Some criteria are read from what exists (a fit check, a brief, a built bot). The rest are judged
// after each exchange by a small classifier (lib/journeyClassifier.ts) and stored on the project.
import type { Assets } from "./types";

export type Stage = "awareness" | "consideration" | "trial" | "launch";
export type Who = "decision_maker" | "implementation_incharge" | "network_operator" | "enabler" | "other" | "unknown";

// What the classifier remembers between turns. Every flag only ever goes from false to true.
export interface JourneySignals {
  who: Who;
  understands: boolean; // can say what a Blue Dot is: both sides, voice, nearby, consent
  seen_evidence: boolean; // has heard what the pilots showed
  has_idea: boolean; // has named a use case of their own: a place, who needs help, who provides
  idea: string; // that idea in a few words
  brief_approved: boolean; // said yes to the brief and personas
  tried: boolean; // has called the bot or explored the map
  wants_launch: boolean; // is asking about deployment, procurement, activation or scale
}

export const EMPTY_SIGNALS: JourneySignals = {
  who: "unknown", understands: false, seen_evidence: false, has_idea: false, idea: "",
  brief_approved: false, tried: false, wants_launch: false,
};

export interface Criterion { key: string; label: string; met: boolean }
export interface Journey { stage: Stage; criteria: Criterion[]; next: string; options: string[]; who: Who }

export const STAGES: { id: Stage; label: string; question: string; leaveWith: string }[] = [
  { id: "awareness", label: "Understand", question: "Is this relevant to me, and is it credible?", leaveWith: "A reason to explore a use case of their own" },
  { id: "consideration", label: "Shape the idea", question: "Would it work here, and what would it take?", leaveWith: "An agreed use case and the people in it" },
  { id: "trial", label: "Try it", question: "Can I see it working for my people?", leaveWith: "A working prototype and a safe demo" },
  { id: "launch", label: "Launch", question: "How do we stand it up in a real district?", leaveWith: "A plan with the EkStep team" },
];

// The stage is the first one whose exit criteria aren't all met.
export function deriveJourney(s: JourneySignals, a: Assets, options: string[] = []): Journey {
  const fitOk = !!a.fit && a.fit.verdict !== "not_yet";
  const built = !!a.bot && !!a.map;
  const tried = s.tried || (a.bot?.calls ?? 0) > 0;
  const groups: Record<Stage, Criterion[]> = {
    awareness: [
      { key: "understands", label: "Knows what a Blue Dot is and how it works", met: s.understands || s.has_idea || fitOk },
      { key: "has_idea", label: "Has an idea of their own: a place and the people", met: s.has_idea || !!a.fit || !!a.brief },
    ],
    consideration: [
      { key: "fit", label: "The idea fits Blue Dots (fit check)", met: fitOk || built }, // built: they chose to skip ahead
      { key: "brief", label: "A brief and three personas", met: !!a.brief && !!a.personas },
      { key: "approved", label: "They approved the brief and personas", met: s.brief_approved || built },
    ],
    trial: [
      { key: "built", label: "Voice bot and dot map built", met: built },
      { key: "tried", label: "They tried the call or the map", met: tried },
    ],
    launch: [],
  };
  let stage: Stage = "awareness";
  for (const st of ["awareness", "consideration", "trial"] as Stage[]) {
    stage = st;
    if (groups[st].some((c) => !c.met)) break;
    if (st === "trial") stage = "launch";
  }
  if (s.wants_launch && stage === "trial" && built) stage = "launch";
  const criteria = groups[stage];
  const firstOpen = criteria.find((c) => !c.met);
  return { stage, criteria, next: firstOpen?.label ?? "", options: options.length ? options : fallbackOptions(stage, firstOpen?.key), who: s.who };
}

// Suggested replies when the classifier hasn't given any. In the person's voice.
function fallbackOptions(stage: Stage, open?: string): string[] {
  switch (stage) {
    case "awareness":
      return open === "understands"
        ? ["What is a Blue Dot, in simple words?", "What has it shown so far?", "How is it different from a job portal?"]
        : ["I have an idea for my district", "Where is Blue Dots running today?", "What has it shown so far?"];
    case "consideration":
      return open === "fit" ? ["Check if my idea fits", "What makes an idea a good fit?"]
        : open === "brief" ? ["Help me shape it into a brief", "Who would run it locally?"]
        : ["Yes, the brief and personas look right", "Change one of the personas"];
    case "trial":
      return open === "built" ? ["Build the voice bot and the map"] : ["How do I try the call?", "Change something in the prototype"];
    case "launch":
      return ["What would a real rollout take?", "What does it cost to run?", "Who do I talk to at EkStep?"];
  }
}

// What the assistant is told before it replies (sent with the person's message, not in the cached prompt).
export function journeyNote(j: Journey): string {
  const st = STAGES.find((x) => x.id === j.stage)!;
  const met = j.criteria.filter((c) => c.met).map((c) => c.label);
  const open = j.criteria.filter((c) => !c.met).map((c) => c.label);
  const who = j.who === "unknown" ? "not known yet" : j.who.replace(/_/g, " ");
  return [
    `(Journey state, from the assistant's records, not from the person. Stage: ${st.label} (${j.stage}). Their question: "${st.question}".`,
    met.length ? `Done: ${met.join("; ")}.` : "",
    open.length ? `Still open: ${open.join("; ")}. Your follow-up should move them toward: ${j.next}.` : `This stage is complete; they qualify for the next one.`,
    `Who they are: ${who}. This describes the conversation before this message: if this message shows they have moved on (they say they know Blue Dots, name an idea of their own, approve, or ask to build), act on this message. Follow the stage rules in your instructions.)`,
  ].filter(Boolean).join(" ");
}
