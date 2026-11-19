import type { Area, Dot, MapData, Persona } from "./types";

export function km(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371, toR = (d: number) => (d * Math.PI) / 180;
  const dLat = toR(b.lat - a.lat), dLng = toR(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toR(a.lat)) * Math.cos(toR(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0) / 4294967295;
}

// Place a dot near its area's centre, deterministically, 0.3 to 1.6 km away.
export function placeNear(area: Area, seed: string) {
  const angle = hash(seed + "a") * Math.PI * 2;
  const dist = 0.3 + hash(seed + "d") * 1.3;
  const dLat = (dist / 111) * Math.cos(angle);
  const dLng = (dist / (111 * Math.cos((area.lat * Math.PI) / 180))) * Math.sin(angle);
  return { lat: +(area.lat + dLat).toFixed(5), lng: +(area.lng + dLng).toFixed(5) };
}

export function findArea(areas: Area[], name: string): Area | undefined {
  const n = name.trim().toLowerCase();
  return areas.find((a) => a.name.toLowerCase() === n) ?? areas.find((a) => n.includes(a.name.toLowerCase()) || a.name.toLowerCase().includes(n));
}

// The bot's directory: every dot, with its distance from each persona's area.
export function directory(map: MapData, personas: Persona[], sectorLabel: (id: string) => string) {
  const origins = personas
    .map((p) => ({ p, a: findArea(map.areas, p.area) }))
    .filter((x): x is { p: Persona; a: Area } => !!x.a);
  const lines: string[] = [];
  const row = (d: Dot) => {
    const dist = origins.map(({ p, a }) => `${Math.max(1, Math.round(km(a, d)))} km from ${a.name} (${p.id})`).join("; ");
    return `- ${d.name} | ${sectorLabel(d.sector)} | ${d.area} | ${d.detail}${d.hours ? ` | ${d.hours}` : ""} | ${dist}`;
  };
  const providers = map.dots.filter((d) => d.kind === "provider");
  const requests = map.dots.filter((d) => d.kind === "request");
  lines.push("## Providers and services (fictional)");
  providers.forEach((d) => lines.push(row(d)));
  if (requests.length) {
    lines.push("", "## Requests from people looking for help (fictional; shown on the map as white pins)");
    requests.forEach((d) => lines.push(row(d)));
  }
  return lines.join("\n");
}
