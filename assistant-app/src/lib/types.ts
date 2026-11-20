// Shared shapes for a project and its assets. Used on the server and in the browser.

export type Colour =
  | "blue" | "purple" | "red" | "orange" | "yellow" | "green" | "pink" | "golden" | "white" | "brown";

export interface FitCriterion { name: string; result: "yes" | "partly" | "no"; note: string }
export interface FitCheck {
  verdict: "fits" | "fits_with_changes" | "not_yet";
  summary: string;
  criteria: FitCriterion[];
  to_make_it_fit: string[];
}

export interface Brief {
  title: string;
  colour: Colour;
  place: string;
  language: string;
  problem: string;
  seekers: string;
  providers: string;
  why_it_matters: string;
  bot_name: string;
  tagline: string;
  heading?: string; // bot page heading (library standard); older builds lack it
  subheading?: string;
}

export interface Persona {
  id: string;
  name: string;
  side: "seeker" | "provider";
  age: number;
  area: string;
  occupation: string;
  story: string;
  need: string;
  quote: string;
  gender: "female" | "male";
  photo_prompt: string;
  traits?: string[]; // three short facts for the persona card
  questions?: string[]; // sample questions, in the bot's language
}

export interface SchemaField { key: string; label: string; example: string; visible: "public" | "after_connect" }
export interface Sector { id: string; label: string; icon: string; description: string }
export interface SchemaDoc {
  sectors: Sector[];
  seeker_fields: SchemaField[];
  provider_fields: SchemaField[];
  notes: string;
}

export interface Area { name: string; lat: number; lng: number }
export interface Dot {
  id: string;
  name: string;
  kind: "provider" | "request";
  sector: string;
  area: string;
  detail: string;
  hours?: string;
  org_type?: string;
  offers?: string[];
  lat: number;
  lng: number;
}
export interface MapData {
  center: { lat: number; lng: number };
  zoom: number;
  you_area: string;
  areas: Area[];
  dots: Dot[];
}

export interface Bot {
  agent_id: string;
  name: string;
  language: string;
  voice_gender: "female" | "male";
  greeting: string;
  created_at: number;
  calls: number;
  prompt?: string; // the full instructions sent to the voice platform (kept for QC; never public)
}

export interface Assets {
  fit?: FitCheck;
  brief?: Brief;
  personas?: Persona[];
  schema?: SchemaDoc;
  map?: MapData;
  bot?: Bot;
  photos?: Record<string, string>; // persona id -> photo key
}

export type AssetKind = keyof Omit<Assets, "photos">;

// What the chat UI renders. Kept apart from the API transcript so the UI never
// depends on the API's block shapes.
export type UiPart =
  | { type: "text"; text: string }
  | { type: "thinking"; text: string; seconds?: number }
  | { type: "tool"; id: string; name: string; status: "running" | "done" | "error"; summary?: string; asset?: AssetKind };

export interface UiMessage { id: string; role: "user" | "assistant"; parts: UiPart[]; at: number }

export interface ProjectSummary { id: string; title: string; updated_at: number; colour?: Colour; has: AssetKind[] }

export interface Project {
  id: string;
  workspace: string;
  owner_name?: string; // the name typed at sign-in, for reviewing test chats
  title: string;
  created_at: number;
  updated_at: number;
  ui: UiMessage[];
  transcript: unknown[]; // Anthropic beta message params, stored exactly as returned
  assets: Assets;
  usage?: Usage; // token use for this chat, summed over every model call
  note?: string; // what the reply checker corrected last turn, passed to the model with the next message
}

export interface Usage { calls: number; input: number; cache_read: number; cache_write: number; output: number; usd: number }

// Events streamed from /api/chat to the browser (one JSON object per SSE message).
export type StreamEvent =
  | { type: "start"; message_id: string }
  | { type: "thinking"; delta: string }
  | { type: "thinking_done"; seconds: number }
  | { type: "text"; delta: string }
  | { type: "tool_start"; id: string; name: string }
  | { type: "tool_done"; id: string; name: string; status: "done" | "error"; summary: string; asset?: AssetKind }
  | { type: "asset"; kind: AssetKind; data: unknown }
  | { type: "title"; title: string }
  | { type: "done" }
  | { type: "error"; message: string };

export const COLOURS: Record<Colour, { hex: string; deep: string; label: string; area: string }> = {
  blue: { hex: "#2563EB", deep: "#1D4ED8", label: "Blue Dots", area: "Jobs and livelihoods" },
  purple: { hex: "#7B5EA7", deep: "#534AB7", label: "Purple Dots", area: "Disability" },
  red: { hex: "#DC2626", deep: "#B91C1C", label: "Red Dots", area: "Road safety and emergencies" },
  orange: { hex: "#EA580C", deep: "#C2410C", label: "Orange Dots", area: "Tourism" },
  yellow: { hex: "#CA8A04", deep: "#A16207", label: "Yellow Dots", area: "Education" },
  green: { hex: "#16A34A", deep: "#15803D", label: "Green Dots", area: "Farming" },
  pink: { hex: "#DB2777", deep: "#BE185D", label: "Pink Dots", area: "Women's work and support" },
  golden: { hex: "#B7791F", deep: "#975A16", label: "Golden Dots", area: "Schemes and entitlements" },
  white: { hex: "#64748B", deep: "#475569", label: "White Dots", area: "Care and family support" },
  brown: { hex: "#92400E", deep: "#78350F", label: "Brown Dots", area: "Artisans and crafts" },
};
