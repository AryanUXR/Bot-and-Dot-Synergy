import "server-only";
import { z } from "zod";
import type Anthropic from "@anthropic-ai/sdk";
import type { AssetKind, Dot, Project, StreamEvent } from "./types";
import { findArea, placeNear, directory } from "./geo";
import { createAgent, updateAgentInstructions, LANGUAGES } from "./raya";
import { config } from "./env";
import { count, bump } from "./store";

export const ICONS = [
  "briefcase", "stethoscope", "hospital", "pill", "home", "graduation-cap", "book", "wrench", "hammer", "truck", "car", "bus",
  "shopping-bag", "store", "heart-handshake", "baby", "paw-print", "utensils", "landmark", "sprout", "tractor", "shield",
  "users", "accessibility", "scissors", "shirt", "bed", "dumbbell", "palette", "map-pin", "phone", "bike", "fuel", "siren",
] as const;

const colour = z.enum(["blue", "purple", "red", "orange", "yellow", "green", "pink", "golden", "white", "brown"]);

const FitInput = z.object({
  verdict: z.enum(["fits", "fits_with_changes", "not_yet"]),
  summary: z.string().describe("One or two sentences: the verdict and the main reason."),
  criteria: z.array(z.object({
    name: z.string().describe("Short criterion name, e.g. 'A discovery problem'"),
    result: z.enum(["yes", "partly", "no"]),
    note: z.string().describe("One sentence on why, specific to this idea."),
  })).min(5).max(9),
  to_make_it_fit: z.array(z.string()).max(4).describe("Concrete changes that would make it fit or fit better. Empty if it fits as is."),
});

const BriefInput = z.object({
  title: z.string().describe("Short name for the use case, e.g. 'Pet care in Pune'"),
  colour: colour.describe("The Dots colour this belongs to"),
  place: z.string().describe("City or district, and state"),
  language: z.enum(["Hindi", "Hinglish", "English", "Kannada", "Marathi", "Telugu", "Odia", "Assamese"]),
  problem: z.string().describe("The problem in two or three plain sentences"),
  seekers: z.string().describe("Who is looking for help, and what they need"),
  providers: z.string().describe("Who provides, and what they offer"),
  why_it_matters: z.string().describe("Why nearness and voice matter here, one or two sentences"),
  bot_name: z.string().describe("The voice bot's name, e.g. 'Pet Saathi'"),
  tagline: z.string().describe("One-line promise for the bot page, under 70 characters"),
});

const PersonasInput = z.object({
  personas: z.array(z.object({
    id: z.string().regex(/^[a-z0-9-]+$/).describe("Lowercase slug, e.g. 'rohan-dog-owner'"),
    name: z.string().describe("First name and initial, e.g. 'Rohan K.'"),
    side: z.enum(["seeker", "provider"]),
    age: z.number().int().min(16).max(90),
    area: z.string().describe("A real locality in the place; reuse the exact same name in build_map areas"),
    occupation: z.string(),
    story: z.string().describe("Two or three sentences about their situation today"),
    need: z.string().describe("What they want from the bot, in their terms"),
    quote: z.string().describe("A short line in their own voice"),
    gender: z.enum(["female", "male"]),
    photo_prompt: z.string().describe("Photorealistic portrait prompt: age, look, clothing, setting from their life, natural light, face clearly visible, no text or logos"),
  })).min(2).max(4),
});

const SchemaInput = z.object({
  sectors: z.array(z.object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    label: z.string().describe("Filter label on the map, e.g. 'Vets and clinics'"),
    icon: z.enum(ICONS),
    description: z.string(),
  })).min(3).max(7),
  seeker_fields: z.array(z.object({
    key: z.string().regex(/^[a-z0-9_]+$/), label: z.string(), example: z.string(),
    visible: z.enum(["public", "after_connect"]),
  })).min(3).max(10),
  provider_fields: z.array(z.object({
    key: z.string().regex(/^[a-z0-9_]+$/), label: z.string(), example: z.string(),
    visible: z.enum(["public", "after_connect"]),
  })).min(3).max(10),
  notes: z.string().describe("One or two sentences on consent and who sees what"),
});

const MapInput = z.object({
  center: z.object({ lat: z.number(), lng: z.number() }),
  zoom: z.number().int().min(10).max(15).describe("12 for a city, 11 for a district"),
  you_area: z.string().describe("The area where the 'You' marker goes, usually the first seeker persona's area"),
  areas: z.array(z.object({ name: z.string(), lat: z.number(), lng: z.number() })).min(4).max(12),
  dots: z.array(z.object({
    name: z.string().describe("Fictional, e.g. 'Paws and Care Clinic' or 'Kavya S.' for a person"),
    kind: z.enum(["provider", "request"]),
    sector: z.string().describe("A sector id from set_schema"),
    area: z.string().describe("One of the areas above, same spelling"),
    detail: z.string().describe("What they offer or need, one short sentence"),
    hours: z.string().optional().describe("Opening hours or availability, if it matters"),
  })).min(12).max(40),
});

// The voice bot is written in the structure of the hand-built reference prompts
// (use-cases/blue-dots-pune-petcare and -silvercare). The server assembles the sections
// and adds the rules every bot must carry, so no build can leave them out.
const spoken = (what: string) => z.string().describe(`${what}. Spoken line, in the bot's language, in quotes-free plain text.`);
const BotInput = z.object({
  role: z.string().describe("Who the bot is and its tone, 2 to 4 sentences, in English. Name, what it helps with, who calls it."),
  language_rules: z.string().describe("How the bot speaks, in English: which language or mix, everyday words to prefer, words to avoid. 2 to 4 sentences."),
  greeting: spoken("The first line of the call: who the bot is and an open question about what they need"),
  understand: z.string().describe("Phase 2 instructions in English: what to find out (the need, the area, timing) in at most two short questions, with those questions as spoken lines in the bot's language. No example places or distances."),
  match: z.string().describe("Phase 3 instructions in English: how to choose from the directory for this domain (what counts as a good match, what to say when nothing fits). No example places, names or distances."),
  anything_else_line: spoken("Asked after every answer: is there anything else"),
  reask_line: spoken("Said when the caller's reply didn't come through: please say that again"),
  emergency_line: spoken("For an emergency in this domain: call 112 now, said with the number as spoken digits"),
  safety_rules: z.array(z.object({
    when: z.string().describe("The situation, in English"),
    say: spoken("What the bot says"),
  })).min(2).max(6).describe("Domain safety rules beyond emergencies, e.g. a domain helpline (181, 1098, 14567) when someone is unsafe, distressed or lonely; scams asking for money in advance"),
  prohibited: z.array(z.string()).min(2).max(8).describe("Things this bot must never do in this domain, in English (e.g. never say which medicine to take). Never quote an offensive word, even to forbid it: write 'use respectful, person-first words' instead."),
  closing_line: spoken("The closing line, ending with the English word Goodbye"),
  overtime_line: spoken("For when the call runs out of time, ending with Goodbye"),
  voice_gender: z.enum(["female", "male"]),
});

type ToolDef = { name: string; description: string; schema: z.ZodType };
const DEFS: ToolDef[] = [
  { name: "record_fit_check", description: "Record the fit check for an idea. Shows on the Fit tab.", schema: FitInput },
  { name: "update_brief", description: "Write or replace the use-case brief. Shows on the Brief tab.", schema: BriefInput },
  { name: "set_personas", description: "Write or replace all personas (two seekers and one provider). Shows on the Personas tab; photos are made automatically.", schema: PersonasInput },
  { name: "set_schema", description: "Write or replace the schema: map sectors and the fields each side fills in. Shows on the Schema tab.", schema: SchemaInput },
  { name: "build_map", description: "Write or replace the dot map: localities with coordinates and fictional dots. Needs set_schema first. Shows on the Map tab.", schema: MapInput },
  { name: "create_voice_bot", description: "Create or update the live voice bot from the brief, personas and map. Needs update_brief, set_personas and build_map first. Shows on the Bot tab, where the person can take a real call.", schema: BotInput },
];

export const TOOLS: Anthropic.Beta.Messages.BetaTool[] = DEFS.map((d) => {
  const js = z.toJSONSchema(d.schema) as Record<string, unknown>;
  delete js.$schema;
  return {
    name: d.name,
    description: d.description,
    input_schema: js as Anthropic.Beta.Messages.BetaTool.InputSchema,
    eager_input_streaming: true,
  };
});

export const TOOL_ASSET: Record<string, AssetKind> = {
  record_fit_check: "fit", update_brief: "brief", set_personas: "personas", set_schema: "schema", build_map: "map", create_voice_bot: "bot",
};

export const TOOL_LABEL: Record<string, [string, string]> = {
  record_fit_check: ["Checking the fit", "Fit check"],
  update_brief: ["Writing the brief", "Brief"],
  set_personas: ["Creating personas", "Personas"],
  set_schema: ["Mapping the schema", "Schema"],
  build_map: ["Placing dots on the map", "Map"],
  create_voice_bot: ["Setting up the voice bot", "Voice bot"],
};

const SENSITIVE = /(\+?\d[\d\s-]{8,}\d)|(@[a-z0-9-]+\.[a-z]{2,})|(https?:\/\/)|(\bwww\.)/i;
function checkClean(texts: string[]) {
  const bad = texts.find((t) => SENSITIVE.test(t.replace(/\b(112|181|1098|14567|108|102|100|101|1930|155260)\b/g, "")));
  return bad ? `Remove contact details (phone numbers, emails, links) from: "${bad.slice(0, 80)}"` : null;
}

export type Emit = (e: StreamEvent) => void;

export async function runTool(name: string, rawInput: unknown, project: Project, emit: Emit, opts: { simulate?: boolean } = {}): Promise<{ ok: boolean; result: string; summary: string }> {
  const def = DEFS.find((d) => d.name === name);
  if (!def) return { ok: false, result: `Unknown tool ${name}`, summary: "Unknown tool" };
  const parsed = def.schema.safeParse(rawInput);
  if (!parsed.success) {
    const issues = parsed.error.issues.slice(0, 6).map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    return { ok: false, result: `INVALID_INPUT: ${issues}. Call the tool again with the full, corrected input.`, summary: "Needs another try" };
  }
  const input = parsed.data as never;
  const a = project.assets;
  try {
    switch (name) {
      case "record_fit_check": {
        const fit = input as z.infer<typeof FitInput>;
        a.fit = fit;
        emit({ type: "asset", kind: "fit", data: fit });
        const label = { fits: "Fits", fits_with_changes: "Fits with changes", not_yet: "Not a fit yet" }[fit.verdict];
        return { ok: true, result: `Saved. Verdict shown: ${label}.`, summary: label };
      }
      case "update_brief": {
        const b = input as z.infer<typeof BriefInput>;
        const dirty = checkClean([b.problem, b.seekers, b.providers]);
        if (dirty) return { ok: false, result: dirty, summary: "Needs another try" };
        a.brief = b;
        if (!project.title || project.title === "New conversation" || project.title.length > 40) project.title = b.title;
        emit({ type: "asset", kind: "brief", data: b });
        emit({ type: "title", title: project.title });
        return { ok: true, result: "Brief saved and shown on the Brief tab.", summary: b.title };
      }
      case "set_personas": {
        const { personas } = input as z.infer<typeof PersonasInput>;
        const dirty = checkClean(personas.flatMap((p) => [p.story, p.need, p.quote]));
        if (dirty) return { ok: false, result: dirty, summary: "Needs another try" };
        a.personas = personas;
        a.photos = Object.fromEntries(Object.entries(a.photos ?? {}).filter(([id]) => personas.some((p) => p.id === id)));
        emit({ type: "asset", kind: "personas", data: personas });
        return { ok: true, result: `${personas.length} personas saved; photos are being generated.`, summary: personas.map((p) => p.name).join(", ") };
      }
      case "set_schema": {
        const s = input as z.infer<typeof SchemaInput>;
        a.schema = s;
        emit({ type: "asset", kind: "schema", data: s });
        return { ok: true, result: `Schema saved with sectors: ${s.sectors.map((x) => `${x.id} (${x.label})`).join(", ")}.`, summary: `${s.sectors.length} sectors` };
      }
      case "build_map": {
        const m = input as z.infer<typeof MapInput>;
        if (!a.schema) return { ok: false, result: "Call set_schema first.", summary: "Needs the schema first" };
        const sectorIds = new Set(a.schema.sectors.map((s) => s.id));
        const problems: string[] = [];
        const dirty = checkClean(m.dots.flatMap((d) => [d.name, d.detail]));
        if (dirty) problems.push(dirty);
        const dots: Dot[] = m.dots.map((d, i) => {
          const area = findArea(m.areas, d.area);
          if (!area) problems.push(`dot "${d.name}" has area "${d.area}" not in areas`);
          if (!sectorIds.has(d.sector)) problems.push(`dot "${d.name}" has unknown sector "${d.sector}"`);
          const pos = area ? placeNear(area, `${d.name}-${i}`) : m.center;
          return { id: `d${i + 1}`, ...d, area: area?.name ?? d.area, ...pos };
        });
        const empty = a.schema.sectors.filter((s) => !dots.some((d) => d.sector === s.id && d.kind === "provider"));
        if (empty.length) problems.push(`sectors with no provider dots: ${empty.map((s) => s.id).join(", ")}`);
        if (problems.length) return { ok: false, result: `Fix and call build_map again: ${problems.slice(0, 6).join("; ")}`, summary: "Needs another try" };
        a.map = { center: m.center, zoom: m.zoom, you_area: m.you_area, areas: m.areas, dots };
        emit({ type: "asset", kind: "map", data: a.map });
        const prov = dots.filter((d) => d.kind === "provider").length;
        return { ok: true, result: `Map saved: ${prov} providers and ${dots.length - prov} requests across ${m.areas.length} areas.`, summary: `${dots.length} dots in ${m.areas.length} areas` };
      }
      case "create_voice_bot": {
        const b = input as z.infer<typeof BotInput>;
        if (!a.brief || !a.personas || !a.map || !a.schema) {
          return { ok: false, result: "Needs update_brief, set_personas, set_schema and build_map first.", summary: "Needs the brief, personas and map first" };
        }
        if (!/goodbye\s*[.!]?\s*$/i.test(b.closing_line.trim()) || !/goodbye\s*[.!]?\s*$/i.test(b.overtime_line.trim())) {
          return { ok: false, result: "closing_line and overtime_line must end with the English word Goodbye.", summary: "Needs another try" };
        }
        if (!/112|एक[- ]एक[- ]दो|ಒಂದು|one one two/i.test(b.emergency_line)) {
          return { ok: false, result: "emergency_line must tell the caller to call 112.", summary: "Needs another try" };
        }
        const sector = (id: string) => a.schema!.sectors.find((s) => s.id === id)?.label ?? id;
        const instructions = composeBotPrompt(project, b, directory(a.map, a.personas, sector));
        if (a.bot?.agent_id) {
          if (!opts.simulate) await updateAgentInstructions(a.bot.agent_id, instructions);
          a.bot = { ...a.bot, greeting: b.greeting, voice_gender: b.voice_gender, prompt: instructions };
        } else {
          const made = await count(`bots:${project.workspace}`);
          if (made >= config.maxBotsPerWorkspace) {
            return { ok: false, result: "This workspace has reached its limit of voice bots. Tell the person and suggest reusing an existing project.", summary: "Bot limit reached" };
          }
          const id = opts.simulate ? `sim-${project.id}` : await createAgent({
            name: `${a.brief.bot_name} · ${a.brief.title} (Assistant)`.slice(0, 90),
            instructions, language: a.brief.language, gender: b.voice_gender, overtime_line: b.overtime_line,
          });
          if (!opts.simulate) await bump(`bots:${project.workspace}`);
          a.bot = { agent_id: id, name: a.brief.bot_name, language: a.brief.language, voice_gender: b.voice_gender, greeting: b.greeting, created_at: Date.now(), calls: 0, prompt: instructions };
        }
        const { prompt: _hidden, ...botView } = a.bot; // eslint-disable-line @typescript-eslint/no-unused-vars
        emit({ type: "asset", kind: "bot", data: botView });
        return { ok: true, result: `Voice bot "${a.brief.bot_name}" is live in ${a.brief.language}. The person can call it from the Bot tab as any persona.`, summary: `${a.brief.bot_name} is live` };
      }
    }
  } catch (e) {
    console.error(`[tool ${name}]`, e);
    return { ok: false, result: `The tool failed: ${(e as Error).message}. Tell the person plainly and offer to try again.`, summary: "Something went wrong" };
  }
  return { ok: false, result: "Unhandled", summary: "Unhandled" };
}

function composeBotPrompt(project: Project, b: z.infer<typeof BotInput>, dir: string) {
  const a = project.assets;
  const name = a.brief!.bot_name;
  const lang = a.brief!.language;
  const q = (t: string) => `"${t.trim().replace(/^["“]|["”]$/g, "")}"`;
  const personaBlock = a.personas!.map((p) =>
    `- \`${p.id}\`: ${p.name}, ${p.age}, ${p.occupation}, in ${p.area}. ${p.side === "seeker" ? "Looking for" : "Offers, and looks for"}: ${p.need}`).join("\n");
  return `# ${name}: conversation prompt (${lang})

## Role
${b.role.trim()}

## Input variables
- \`\${persona}\`: the id of the persona this call is for (see Persona context). Treat the caller as that person, living in their area, and measure distances from that area. If it is empty or unknown, ask which area they are calling from.

## Language rules
${b.language_rules.trim()}
- Short sentences. One question at a time.
- Say helpline numbers digit by digit.

## Call flow

### Phase 1: Greeting (1 turn)
Say: ${q(b.greeting)}

### Phase 2: Understand the need (1 to 2 turns)
${b.understand.trim()}

### Phase 3: Match (1 to 2 turns)
${b.match.trim()}
- Answer only from the Directory. Give at most the two nearest suitable options, each with its area and its distance from the caller's area as listed. Never invent a place, number, address, fee, timing or distance.
- After each answer, ask if there is anything else: ${q(b.anything_else_line)}

### Phase 4: Close (1 turn, exactly once)
When the caller has nothing else, say: ${q(b.closing_line)}
Say Goodbye once, at the very end, and nothing after it. Never close because of silence.

## Safety rules (these override the call flow)
- **Emergency, 112** (someone is hurt, in danger or very unwell): first say ${q(b.emergency_line)}
${b.safety_rules.map((r) => `- **${r.when.trim()}**: say ${q(r.say)}`).join("\n")}
- **Never ask** for an address, phone number, Aadhaar, bank details, income or health details. The area is enough.
- **Never promise** that someone is available, a price, a timing or that a place is safe. Say they can ask there.
- **If you hear nothing, or get a nudge after your turn**, the caller may have spoken and not come through. Say ${q(b.reask_line)} If it happens again, ask a simpler question.

## Persona context
${personaBlock}

## Prohibited
${b.prohibited.map((x) => `- ${x.trim()}`).join("\n")}
- No medical, legal or financial advice.
- No names, numbers or addresses that are not in the Directory, except national helplines.
- Never claim to book, transfer or connect anyone: they can see the details on the Blue Dots map.
- Never ask about community, religion or family status.
- If the call runs out of time, say ${q(b.overtime_line)}

## Directory
This is fictional demo data. It is the only source of places and distances.

${dir}`;
}

export const LANGUAGE_NAMES = Object.keys(LANGUAGES);
