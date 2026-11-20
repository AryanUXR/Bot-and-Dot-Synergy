"use client";
/* global google */
// The dot map, built to the Dots library standard (starter/UI-SPEC.md) and the library map
// blue-dots-pune-petcare (LaunchPage.tsx): light map, 3-column sector filter panel, filled pins
// for providers and white pins for requests (one blue, sectors told apart by icon), the "You"
// house marker with a pulse, a dot card as a bottom sheet, a SelfCard, and a Map/List island.
// The public viewer (viewer/src/pages/MapPage.tsx) shows the same thing.
import { useEffect, useMemo, useRef, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { X, MapPin, Phone, Navigation, Filter, Map as MapIcon, List as ListIcon } from "lucide-react";
import type { MapData, Persona, SchemaDoc, Dot } from "@/lib/types";
import { SectorIcon } from "./icons";

const BLUE = "#2563EB";
const CHARCOAL = "#0A3D8F";
const CHARCOAL_RING = "rgba(10,61,143,0.18)";
const CHARCOAL_SHADOW = "rgba(10,61,143,0.4)";
// EkStep's stored Maps key (the same one the Lovable map bases fall back to).
const KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "AIzaSyAsMGjvi-e04B38mWT1kc-tCYb6YlnogCE";

// The live library maps show Google's standard colours (their mapId overrides the clean style
// in their code), so this map does too; only business pins are hidden so dots stay readable.
const STYLE = [{ featureType: "poi.business", stylers: [{ visibility: "off" }] }];

let loader: Promise<void> | null = null;
function loadMaps(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if ((window as unknown as { google?: { maps?: unknown } }).google?.maps) return Promise.resolve();
  if (!loader) {
    loader = new Promise((res, rej) => {
      (window as unknown as Record<string, unknown>).__bdMapsReady = () => res();
      const s = document.createElement("script");
      s.src = `https://maps.googleapis.com/maps/api/js?key=${KEY}&v=weekly&callback=__bdMapsReady`;
      s.async = true;
      s.onerror = () => rej(new Error("maps"));
      document.head.appendChild(s);
    });
  }
  return loader;
}

type MapDot = Dot & { sectorLabel: string; icon: string };

// Short filter labels that never repeat: the sector's own short label, else its first word,
// else enough words to tell it apart from the others.
export function shortLabels(sectors: { id: string; label: string; short_label?: string }[]): Record<string, string> {
  const out: Record<string, string> = {};
  const first = (l: string, n: number) => l.split(/[\s,&]+/).filter(Boolean).slice(0, n).join(" ");
  for (const s of sectors) {
    if (s.short_label) { out[s.id] = s.short_label; continue; }
    let n = 1;
    let cand = first(s.label, n);
    while (sectors.some((o) => o.id !== s.id && first(o.label, n).toLowerCase() === cand.toLowerCase()) && n < 4) cand = first(s.label, ++n);
    out[s.id] = cand;
  }
  return out;
}

function pinEl(dot: MapDot): HTMLButtonElement {
  const request = dot.kind === "request";
  const svg = renderToStaticMarkup(<SectorIcon name={dot.icon} />).replace("<svg", `<svg width="20" height="20" aria-hidden="true" style="stroke:${request ? BLUE : "#fff"}"`);
  const el = document.createElement("button");
  el.type = "button";
  el.className = "dot-pin";
  el.setAttribute("aria-label", `${dot.name}, ${request ? "looking for help" : "offers help"}, ${dot.sectorLabel}, ${dot.area}`);
  el.title = `${dot.name}, ${dot.sectorLabel}`;
  // Pin size follows the zoom (--bd-pin on the map), so a district-wide view doesn't bury dots.
  el.style.cssText = `position:absolute;width:var(--bd-pin,42px);height:var(--bd-pin,42px);margin:calc(var(--bd-pin,42px) / -2) 0 0 calc(var(--bd-pin,42px) / -2);padding:0;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;
    background:${request ? "#ffffff" : BLUE};border:2.5px solid ${request ? BLUE : "#ffffff"};box-shadow:0 2px 8px rgba(0,0,0,0.22)`;
  el.innerHTML = svg.replace('width="20" height="20"', 'width="48%" height="48%"');
  return el;
}

function selfEl(label: string): HTMLButtonElement {
  const el = document.createElement("button");
  el.type = "button";
  el.className = "dot-pin";
  el.setAttribute("aria-label", label);
  el.style.cssText = "position:absolute;width:var(--bd-pin,42px);height:var(--bd-pin,42px);margin:calc(var(--bd-pin,42px) / -2) 0 0 calc(var(--bd-pin,42px) / -2);padding:0;border:0;background:transparent;cursor:pointer";
  el.innerHTML = `
    <span style="position:absolute;inset:-6px;border-radius:50%;background:${CHARCOAL_RING};animation:bd-pulse-ring 2s cubic-bezier(0.4,0,0.6,1) infinite;"></span>
    <span style="position:absolute;inset:0;border-radius:50%;background:#ffffff;border:3px solid ${CHARCOAL};box-shadow:0 2px 10px ${CHARCOAL_SHADOW};display:flex;align-items:center;justify-content:center;">
      <svg width="48%" height="48%" viewBox="0 0 24 24" fill="none" stroke="${CHARCOAL}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/></svg>
    </span>`;
  return el;
}

// Spread dots that share a near-identical coordinate into a small ring (library algorithm).
function spread(dots: MapDot[]) {
  const groups = new Map<string, MapDot[]>();
  for (const d of dots) { const k = `${d.lat.toFixed(3)},${d.lng.toFixed(3)}`; groups.set(k, [...(groups.get(k) ?? []), d]); }
  const out: (MapDot & { _lat: number; _lng: number })[] = [];
  for (const arr of groups.values()) {
    if (arr.length === 1) { out.push({ ...arr[0], _lat: arr[0].lat, _lng: arr[0].lng }); continue; }
    arr.forEach((d, i) => { const a = (2 * Math.PI * i) / arr.length, R = 0.0016; out.push({ ...d, _lat: d.lat + R * Math.sin(a), _lng: d.lng + (R * Math.cos(a)) / Math.cos((d.lat * Math.PI) / 180) }); });
  }
  return out;
}

const km = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
  const dLat = ((b.lat - a.lat) * Math.PI) / 180, dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(s));
};

export default function MapView({ map, schema, personas }: { map: MapData; schema?: SchemaDoc; personas?: Persona[]; height?: string; animate?: boolean }) {
  const el = useRef<HTMLDivElement>(null);
  const gmap = useRef<google.maps.Map | null>(null);
  const overlays = useRef<google.maps.OverlayView[]>([]);
  const bounds = useRef<google.maps.LatLngBounds | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const sectors = useMemo(() => schema?.sectors ?? [], [schema]);
  const shorts = useMemo(() => shortLabels(sectors), [sectors]);
  const dots: MapDot[] = useMemo(() => map.dots.map((d) => {
    const s = sectors.find((x) => x.id === d.sector);
    return { ...d, sectorLabel: s?.label ?? d.sector, icon: s?.icon ?? "map-pin" };
  }), [map.dots, sectors]);
  const [active, setActive] = useState<Set<string>>(() => new Set(sectors.map((s) => s.id)));
  useEffect(() => { setActive(new Set(sectors.map((s) => s.id))); }, [sectors]);
  const [filterOpen, setFilterOpen] = useState(true);
  const [view, setView] = useState<"map" | "list">("map");
  const [selected, setSelected] = useState<MapDot | null>(null);
  const [selfOpen, setSelfOpen] = useState(false);

  const youArea = map.areas.find((a) => a.name.toLowerCase() === map.you_area.toLowerCase());
  const self = youArea ? { lat: youArea.lat, lng: youArea.lng } : map.center;
  const seeker = personas?.find((p) => p.side === "seeker" && p.area.toLowerCase() === map.you_area.toLowerCase()) ?? personas?.find((p) => p.side === "seeker");
  const filtered = useMemo(() => dots.filter((d) => !sectors.length || active.has(d.sector)), [dots, active, sectors.length]);

  useEffect(() => {
    let alive = true;
    loadMaps().then(() => {
      if (!alive || !el.current) return;
      gmap.current = new google.maps.Map(el.current, {
        center: map.center, zoom: map.zoom, styles: STYLE, disableDefaultUI: true, zoomControl: true,
        zoomControlOptions: { position: google.maps.ControlPosition.RIGHT_BOTTOM }, clickableIcons: false, gestureHandling: "greedy",
      });
      const sizePins = () => {
        const z = gmap.current?.getZoom() ?? 12;
        el.current?.style.setProperty("--bd-pin", z >= 13 ? "42px" : z === 12 ? "34px" : z === 11 ? "28px" : "24px");
      };
      gmap.current.addListener("zoom_changed", sizePins);
      sizePins();
      setReady(true);
    }).catch(() => setFailed(true));
    return () => { alive = false; };
  }, [map.center, map.zoom]);

  useEffect(() => {
    const m = gmap.current;
    if (!ready || !m) return;
    overlays.current.forEach((o) => o.setMap(null));
    overlays.current = [];
    class HtmlMarker extends google.maps.OverlayView {
      constructor(private pos: google.maps.LatLngLiteral, private node: HTMLElement, private z = 1) { super(); }
      onAdd() { this.node.style.zIndex = String(this.z); this.getPanes()!.overlayMouseTarget.appendChild(this.node); }
      draw() { const p = this.getProjection().fromLatLngToDivPixel(new google.maps.LatLng(this.pos)); if (p) { this.node.style.left = `${p.x}px`; this.node.style.top = `${p.y}px`; } }
      onRemove() { this.node.remove(); }
    }
    const placed = spread(filtered);
    placed.forEach((d) => {
      const node = pinEl(d);
      node.addEventListener("click", (e) => { e.stopPropagation(); setSelected(d); });
      const o = new HtmlMarker({ lat: d._lat, lng: d._lng }, node, d.kind === "request" ? 2 : 1);
      o.setMap(m);
      overlays.current.push(o);
    });
    const youNode = selfEl(`You · ${youArea?.name ?? map.you_area}`);
    youNode.addEventListener("click", (e) => { e.stopPropagation(); setSelfOpen(true); });
    const you = new HtmlMarker(self, youNode, 5);
    you.setMap(m);
    overlays.current.push(you);
    // Fit to the dots within 25 km of "You", plus You (library behaviour).
    const b = new google.maps.LatLngBounds();
    placed.filter((d) => km(self, { lat: d._lat, lng: d._lng }) <= 25).forEach((d) => b.extend({ lat: d._lat, lng: d._lng }));
    b.extend(self);
    bounds.current = b;
    fit();
  }, [ready, filtered, self.lat, self.lng]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fit the view to the dots. The canvas tab may still be opening (no size yet) when the dots are
  // placed, which leaves the map zoomed out over the whole region, so fit again once it has a size.
  function fit() {
    const m = gmap.current, b = bounds.current, box = el.current;
    if (!m || !b || !box || box.clientWidth < 50 || box.clientHeight < 50) return;
    m.fitBounds(b, { top: 70, bottom: 110, left: 40, right: 40 });
    google.maps.event.addListenerOnce(m, "idle", () => {
      const z = m.getZoom() ?? 12;
      if (z > 15) m.setZoom(15);
      if (z < 10) m.setZoom(10);
    });
  }
  useEffect(() => {
    const box = el.current;
    if (!box || typeof ResizeObserver === "undefined") return;
    let last = "";
    const ro = new ResizeObserver(() => {
      const size = `${box.clientWidth}x${box.clientHeight}`;
      if (size !== last) { last = size; fit(); }
    });
    ro.observe(box);
    return () => ro.disconnect();
  }, [ready]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = (id: string) => setActive((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#e8eaed]">
      <style>{`@keyframes bd-pulse-ring { 0% { transform: scale(0.6); opacity: 1; } 100% { transform: scale(1.8); opacity: 0; } }`}</style>
      <div ref={el} className="absolute inset-0" />
      {!ready && !failed && <div className="absolute inset-0 animate-pulse bg-slate-200" />}
      {failed && <div className="absolute inset-0 grid place-items-center text-[14px] text-slate-600">The map couldn&apos;t load. Check the connection and reload.</div>}

      {sectors.length > 0 && view === "map" && (
        <div className="absolute left-3 top-3 z-10">
          {filterOpen ? (
            <div className="w-64 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur-md">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Sectors</span>
                <button type="button" onClick={() => setFilterOpen(false)} aria-label="Close filters" className="text-slate-500 hover:text-slate-800"><X size={14} /></button>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {sectors.map((s) => {
                  const on = active.has(s.id);
                  return (
                    <button key={s.id} type="button" onClick={() => toggle(s.id)} aria-pressed={on} aria-label={s.label} title={s.label}
                      className="flex flex-col items-center gap-1 rounded-lg border p-1.5 transition-colors"
                      style={{ background: on ? BLUE : "#fff", color: on ? "#fff" : BLUE, borderColor: BLUE }}>
                      <SectorIcon name={s.icon} className="h-4 w-4" />
                      <span className="text-center text-[9px] font-semibold leading-tight">{shorts[s.id]}</span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-[10px] leading-snug text-slate-600">Filled pins offer help; white pins are people asking for it. Everyone here is fictional.</p>
            </div>
          ) : (
            <button type="button" onClick={() => setFilterOpen(true)} className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/95 px-3 py-2 text-xs font-semibold text-slate-700 shadow-md backdrop-blur">
              <Filter size={14} aria-hidden /> Filters
            </button>
          )}
        </div>
      )}

      {view === "list" && (
        <section aria-label="Dots as a list" className="absolute inset-0 z-[5] flex flex-col bg-slate-50">
          <div className="border-b border-slate-200 bg-white/95 px-4 py-3">
            <p className="text-xs font-bold text-slate-900">{filtered.length} dots</p>
            <div className="mt-2 flex gap-1.5 overflow-x-auto pb-1">
              {sectors.map((s) => {
                const on = active.has(s.id);
                return (
                  <button key={s.id} type="button" onClick={() => toggle(s.id)} aria-pressed={on} aria-label={s.label}
                    className="whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-semibold"
                    style={{ background: on ? CHARCOAL : "#fff", color: on ? "#fff" : "#334155", borderColor: on ? CHARCOAL : "#e2e8f0" }}>
                    {shorts[s.id]}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto p-3 pb-28">
            {filtered.map((d) => (
              <button key={d.id} type="button" onClick={() => setSelected(d)} aria-label={`${d.name}, ${d.sectorLabel}, ${d.area}`}
                className="flex w-full items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left shadow-sm hover:border-slate-300">
                <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full" style={d.kind === "request" ? { background: "#fff", border: `2.5px solid ${BLUE}` } : { background: BLUE }} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-slate-900">{d.name} <span className="font-normal text-slate-600">· {d.area}</span></span>
                  <span className="mt-0.5 block text-[11px] font-semibold" style={{ color: BLUE }}>{d.sectorLabel}</span>
                  {(d.offers?.[0] ?? d.detail) && <span className="mt-1 line-clamp-2 block text-xs text-slate-600">{d.offers?.[0] ?? d.detail}</span>}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2">
        <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/95 p-1.5 shadow-lg backdrop-blur-md" role="group" aria-label="View">
          {([{ k: "map", label: "Map", Icon: MapIcon }, { k: "list", label: "List", Icon: ListIcon }] as const).map(({ k, label, Icon }) => (
            <button key={k} type="button" onClick={() => setView(k)} aria-pressed={view === k}
              className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors"
              style={{ background: view === k ? CHARCOAL : "transparent", color: view === k ? "#fff" : "#475569" }}>
              <Icon size={16} aria-hidden /> {label}
            </button>
          ))}
        </div>
      </div>

      {selected && <DotCard dot={selected} onClose={() => setSelected(null)} />}
      {selfOpen && seeker && (
        <Sheet label={`You are ${seeker.name}`} onClose={() => setSelfOpen(false)} header={CHARCOAL} tag="You are here" title={seeker.name} subtitle={`${seeker.occupation} · ${map.you_area}`}>
          <p className="text-[15px] leading-relaxed text-slate-800">{seeker.story}</p>
          <div>
            <p className="mb-1.5 text-[11px] font-semibold text-slate-600">What {seeker.name.split(" ")[0]} is looking for</p>
            <p className="rounded-lg bg-slate-50 p-3 text-sm leading-relaxed text-slate-700">{seeker.need}</p>
          </div>
          <p className="text-[12px] leading-snug text-slate-500">The map shows what is near {seeker.name.split(" ")[0]}, one of the made-up people in this demo. Tap a pin to see who offers or needs help.</p>
        </Sheet>
      )}
    </div>
  );
}

function Sheet({ label, onClose, header, tag, title, subtitle, children }: {
  label: string; onClose: () => void; header: string; tag: string; title: string; subtitle: string; children: React.ReactNode;
}) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <div className="absolute inset-0 z-30 flex items-end justify-center bg-black/40 sm:items-center sm:p-6" onClick={onClose} role="dialog" aria-modal="true" aria-label={label}>
      <div onClick={(e) => e.stopPropagation()} className="max-h-[88%] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:max-w-md sm:rounded-2xl">
        <div className="relative rounded-t-3xl p-5 pb-4 sm:rounded-t-2xl" style={{ background: header }}>
          <button type="button" onClick={onClose} aria-label="Close" className="absolute right-4 top-4 rounded-full bg-white/20 p-1 hover:bg-white/30"><X size={16} className="text-white" /></button>
          <div className="pr-8">
            <span className="rounded-full bg-white/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">{tag}</span>
            <h2 className="mt-2 text-lg font-bold leading-tight text-white">{title}</h2>
            <p className="mt-1 flex items-center gap-1 text-xs text-white/85"><MapPin size={11} aria-hidden /> {subtitle}</p>
          </div>
        </div>
        <div className="space-y-4 p-5">{children}</div>
      </div>
    </div>
  );
}

// The dot card, in words a first-time visitor understands: who this is, what they offer or need,
// when, and that it's made up for the demo. Layout follows the library DotCard.
function DotCard({ dot, onClose }: { dot: MapDot; onClose: () => void }) {
  const request = dot.kind === "request";
  const first = dot.name.split(" ")[0];
  const who = dot.org_type && !/^(request|provider|person)$/i.test(dot.org_type) ? dot.org_type : "";
  const directions = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${dot.lat},${dot.lng}`)}`;
  return (
    <Sheet label={`${dot.name}, ${request ? "looking for help" : "offers help"}`} onClose={onClose} header={`linear-gradient(135deg, ${BLUE}, ${CHARCOAL})`}
      tag={request ? "Looking for help" : "Offers help"}
      title={dot.name} subtitle={who ? `${who} · ${dot.area}` : dot.area}>
      <p className="text-[15px] leading-relaxed text-slate-800">{dot.detail}</p>
      {dot.offers && dot.offers.length > 0 && (
        <div>
          <p className="mb-1.5 text-[11px] font-semibold text-slate-600">{request ? `What ${first} is looking for` : "What they offer"}</p>
          <div className="flex flex-wrap gap-1.5">
            {dot.offers.map((o) => <span key={o} className="rounded-full px-2.5 py-1 text-[12px] font-medium" style={{ background: `${BLUE}1A`, color: "#1F2937" }}>{o}</span>)}
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <Row label="Type of help" value={dot.sectorLabel} />
        {dot.hours && <Row label={request ? "When" : "Available"} value={dot.hours} />}
      </div>
      {!request && (
        <div className="grid grid-cols-2 gap-2 pt-1">
          <span aria-disabled="true" title="Calling is switched off in this demo" className="flex cursor-not-allowed items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold text-white opacity-40" style={{ background: CHARCOAL }}>
            <Phone size={14} aria-hidden /> Call
          </span>
          <a href={directions} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-sm font-semibold" style={{ borderColor: CHARCOAL, color: CHARCOAL }}>
            <Navigation size={14} aria-hidden /> Directions
          </a>
        </div>
      )}
      <p className="text-[12px] leading-snug text-slate-500">
        {request
          ? `${first} is made up for this demo. In a real network, people nearby who can help would see this request and respond.`
          : "This listing is made up for this demo. Calling is switched off."}
      </p>
    </Sheet>
  );
}

const Row = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="mb-0.5 text-[11px] font-semibold text-slate-600">{label}</p>
    <p className="text-sm font-semibold text-slate-800">{value}</p>
  </div>
);
