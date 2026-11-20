// Loads a prototype made with the Blue Dots Assistant from its public, read-only endpoint.
// Nothing secret comes through here: no chat, no bot instructions, no keys.
import { useQuery } from "@tanstack/react-query";
import { icons, type LucideIcon } from "lucide-react";

export const API = {
  prod: "https://blue-dots-assistant.vercel.app",
  uat: "https://blue-dots-assistant-uat.vercel.app",
} as const;
export type Env = keyof typeof API;

export interface ProtoPersona {
  id: string; name: string; side: "seeker" | "provider"; age: number; area: string; occupation: string;
  story: string; need: string; quote: string; gender: "female" | "male";
  traits: string[]; questions: string[]; photo_url: string | null;
}
export interface ProtoSector { id: string; label: string; icon: string; description: string }
export interface ProtoDot {
  id: string; name: string; kind: "provider" | "request"; sector: string; area: string; detail: string;
  hours?: string; org_type: string; offers: string[]; lat: number; lng: number;
}
export interface Prototype {
  id: string;
  updated_at: number;
  brief: {
    title: string; colour: keyof typeof COLOURS; place: string; language: string; problem: string;
    seekers: string; providers: string; why_it_matters: string; bot_name: string; tagline: string;
    heading: string; subheading: string;
  };
  personas: ProtoPersona[];
  schema: { sectors: ProtoSector[] } | null;
  map: { center: { lat: number; lng: number }; zoom: number; you_area: string; areas: { name: string; lat: number; lng: number }[]; dots: ProtoDot[] } | null;
  bot: { name: string; language: string; voice_gender: "female" | "male"; greeting: string; live: boolean } | null;
}

// Programme colours (same table as the assistant). Pins and filters always use one blue.
export const COLOURS = {
  blue: { hex: "#2563EB", label: "Blue Dots" },
  purple: { hex: "#7B5EA7", label: "Purple Dots" },
  red: { hex: "#DC2626", label: "Red Dots" },
  orange: { hex: "#EA580C", label: "Orange Dots" },
  yellow: { hex: "#CA8A04", label: "Yellow Dots" },
  green: { hex: "#16A34A", label: "Green Dots" },
  pink: { hex: "#DB2777", label: "Pink Dots" },
  golden: { hex: "#B7791F", label: "Golden Dots" },
  white: { hex: "#64748B", label: "White Dots" },
  brown: { hex: "#92400E", label: "Brown Dots" },
} as const;
export const PIN_BLUE = "#2563EB";
export const LOGO_URL = `${API.prod}/blue-dots-logo.png`;

export function programmeOf(p: Prototype) {
  const c = COLOURS[p.brief.colour] ?? COLOURS.blue;
  return { colour: c.hex, label: `${c.label} ${p.brief.place.split(",")[0]}` };
}

// Lucide icon by its kebab-case name ("paw-print" -> PawPrint).
export function iconFor(name: string): LucideIcon {
  const key = name.split("-").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join("");
  return (icons as Record<string, LucideIcon>)[key] ?? icons.MapPin;
}

// BCP 47 code for the bot's spoken language, so screen readers use the right voice.
export function langCode(language?: string) {
  const l = (language ?? "").toLowerCase();
  const map: [RegExp, string][] = [[/kannada/, "kn"], [/tamil/, "ta"], [/telugu/, "te"], [/marathi/, "mr"], [/bengali|bangla/, "bn"], [/gujarati/, "gu"], [/malayalam/, "ml"], [/odia|oriya/, "or"], [/punjabi/, "pa"], [/assamese/, "as"], [/urdu/, "ur"], [/hindi|hinglish/, "hi"]];
  return map.find(([re]) => re.test(l))?.[1] ?? "en";
}

export async function loadPrototype(env: Env, id: string): Promise<Prototype> {
  const r = await fetch(`${API[env]}/api/public/${encodeURIComponent(id)}`);
  if (r.status === 404) throw new Error("not-found");
  if (!r.ok) throw new Error("unavailable");
  return r.json();
}

export function usePrototype(env: Env, id: string | undefined) {
  return useQuery({ queryKey: ["prototype", env, id], queryFn: () => loadPrototype(env, id!), enabled: !!id, retry: 1, staleTime: 60_000 });
}

// Places a real call through the assistant. Country code as digits only, e.g. "91".
export async function placeCall(env: Env, projectId: string, personaId: string, phone: string, countryCode: string): Promise<{ ok: boolean; message?: string }> {
  try {
    const r = await fetch(`${API[env]}/api/call`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, personaId, phone, countryCode: countryCode.replace(/\D/g, "") }),
    });
    return await r.json();
  } catch {
    return { ok: false, message: "The call couldn't be placed. Check your connection and try again." };
  }
}

// Where the "You" marker goes: the area named in the map, else the map centre.
export function selfLocation(p: Prototype) {
  const a = p.map?.areas.find((x) => x.name.toLowerCase() === p.map!.you_area.toLowerCase());
  return a ? { lat: a.lat, lng: a.lng, label: `You · ${a.name}` } : { lat: p.map!.center.lat, lng: p.map!.center.lng, label: "You" };
}

export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371, dLat = ((b.lat - a.lat) * Math.PI) / 180, dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}
