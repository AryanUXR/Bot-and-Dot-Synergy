/// <reference types="google.maps" />
// The dot map of a prototype, adapted from the library's LaunchPage (blue-dots-pune-petcare):
// same loader, AdvancedMarkers, spread algorithm, filter grid, You marker, DotCard, SelfCard,
// list view and nav island, driven by the prototype's data. Every pin and filter is one blue.
import { createElement, useEffect, useMemo, useRef, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Link, useParams } from "react-router-dom";
import { X, MapPin, Phone, Navigation, Filter, Map as MapIcon, List as ListIcon, ArrowLeft } from "lucide-react";
import { useGoogleMaps, CLEAN_MAP_STYLE } from "@/hooks/useGoogleMaps";
import { type Env, type Prototype, usePrototype, iconFor, PIN_BLUE, selfLocation, distanceKm } from "@/lib/prototype";
import { LoadState, useLibraryFonts, BODY } from "@/pages/viewerShared";

const CHARCOAL = "#0A3D8F";
const CHARCOAL_RING = "rgba(10,61,143,0.18)";
const CHARCOAL_SHADOW = "rgba(10,61,143,0.4)";

type MapDot = {
  id: string; type: "provider" | "seeker"; name: string; area: string; lat: number; lng: number;
  sector: string; icon: string; org_type: string; offers: string[]; description: string; hours?: string;
};

function toDots(p: Prototype): MapDot[] {
  const sectors = p.schema?.sectors ?? [];
  return (p.map?.dots ?? []).map((d) => {
    const s = sectors.find((x) => x.id === d.sector);
    return {
      id: d.id, type: d.kind === "request" ? "seeker" : "provider", name: d.name, area: d.area, lat: d.lat, lng: d.lng,
      sector: s?.label ?? d.sector, icon: s?.icon ?? "map-pin", org_type: d.org_type, offers: d.offers ?? [], description: d.detail, hours: d.hours,
    };
  });
}

const iconSvg = (name: string, colour: string, size = 20) =>
  renderToStaticMarkup(createElement(iconFor(name), { size, color: colour, strokeWidth: 2, "aria-hidden": true }));

function selfMarkerHTML(): HTMLElement {
  const el = document.createElement("div");
  el.innerHTML = `
    <div style="position:relative;width:42px;height:42px;display:flex;align-items:center;justify-content:center;cursor:pointer;">
      <div style="position:absolute;inset:-6px;border-radius:50%;background:${CHARCOAL_RING};animation:pulse-ring 2s cubic-bezier(0.4,0,0.6,1) infinite;"></div>
      <div style="width:42px;height:42px;border-radius:50%;background:#ffffff;border:3px solid ${CHARCOAL};box-shadow:0 2px 10px ${CHARCOAL_SHADOW};display:flex;align-items:center;justify-content:center;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${CHARCOAL}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/></svg>
      </div>
    </div>`;
  return el.firstElementChild as HTMLElement;
}

// Spread dots that share a near-identical coordinate into a small ring (library algorithm).
function spreadDots(dots: MapDot[]): (MapDot & { _lat: number; _lng: number })[] {
  const groups = new Map<string, MapDot[]>();
  for (const d of dots) {
    const key = `${d.lat.toFixed(3)},${d.lng.toFixed(3)}`;
    groups.set(key, [...(groups.get(key) ?? []), d]);
  }
  const out: (MapDot & { _lat: number; _lng: number })[] = [];
  for (const arr of groups.values()) {
    if (arr.length === 1) { out.push({ ...arr[0], _lat: arr[0].lat, _lng: arr[0].lng }); continue; }
    const R = 0.0016;
    arr.forEach((d, i) => {
      const a = (2 * Math.PI * i) / arr.length;
      out.push({ ...d, _lat: d.lat + R * Math.sin(a), _lng: d.lng + (R * Math.cos(a)) / Math.cos((d.lat * Math.PI) / 180) });
    });
  }
  return out;
}

const shortLabel = (s: string) => (s.length <= 11 ? s : s.split(/[\s,&]+/)[0]);

function markerHTML(dot: MapDot): HTMLElement {
  const el = document.createElement("div");
  const seeker = dot.type === "seeker";
  el.innerHTML = `
    <div style="cursor:pointer;width:42px;height:42px;border-radius:50%;background:${seeker ? "#ffffff" : PIN_BLUE};display:flex;align-items:center;justify-content:center;border:${seeker ? `2.5px solid ${PIN_BLUE}` : "2.5px solid #ffffff"};box-shadow:0 2px 8px rgba(0,0,0,0.22);">
      ${iconSvg(dot.icon, seeker ? PIN_BLUE : "#ffffff")}
    </div>`;
  const node = el.firstElementChild as HTMLElement;
  const label = `${dot.name}, ${seeker ? "looking for help" : "offers help"}, ${dot.sector}, ${dot.area}`;
  node.setAttribute("role", "button");
  node.setAttribute("tabindex", "0");
  node.setAttribute("aria-label", label);
  node.setAttribute("title", label);
  return node;
}

export default function MapPage({ env }: { env: Env }) {
  const { id } = useParams();
  const q = usePrototype(env, id);
  useLibraryFonts();
  useEffect(() => { if (q.data) document.title = `Map · ${q.data.brief.bot_name} · ${q.data.brief.title}`; }, [q.data]);
  if (!q.data) return <LoadState error={q.error as Error | null} />;
  if (!q.data.map) return <LoadState error={new Error("not-found")} />;
  return <MapView p={q.data} botHref={env === "uat" ? `/uat/p/${q.data.id}` : `/p/${q.data.id}`} />;
}

function MapView({ p, botHref }: { p: Prototype; botHref: string }) {
  const { ready, error } = useGoogleMaps();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const dots = useMemo(() => toDots(p), [p]);
  const sectors = useMemo(() => (p.schema?.sectors ?? []).map((s) => ({ label: s.label, icon: s.icon })), [p]);
  const self = useMemo(() => selfLocation(p), [p]);
  const seeker = p.personas.find((x) => x.side === "seeker") ?? p.personas[0];
  const [selected, setSelected] = useState<MapDot | null>(null);
  const [active, setActive] = useState<Set<string>>(() => new Set(sectors.map((s) => s.label)));
  const [filterOpen, setFilterOpen] = useState(() => typeof window === "undefined" || window.innerWidth >= 640);
  const [view, setView] = useState<"map" | "list">("map");
  const [selfOpen, setSelfOpen] = useState(false);

  const filtered = useMemo(() => dots.filter((d) => active.has(d.sector)), [dots, active]);
  const spread = useMemo(() => spreadDots(filtered), [filtered]);

  useEffect(() => {
    if (!ready || !mapRef.current || mapInstance.current) return;
    const g = (window as any).google;
    mapInstance.current = new g.maps.Map(mapRef.current, {
      center: p.map!.center, zoom: p.map!.zoom, minZoom: 9, maxZoom: 18,
      disableDefaultUI: true, zoomControl: true, styles: CLEAN_MAP_STYLE, gestureHandling: "greedy", mapId: "DEMO_MAP_ID",
    });
  }, [ready, p]);

  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !ready) return;
    const g = (window as any).google;
    markersRef.current.forEach((m: any) => { m.map = null; });
    markersRef.current = [];
    spread.forEach((dot) => {
      const content = markerHTML(dot);
      const marker = new g.maps.marker.AdvancedMarkerElement({ map, position: { lat: dot._lat, lng: dot._lng }, content, zIndex: 1000, title: content.getAttribute("title") });
      const open = () => setSelected(dot);
      content.addEventListener("click", (e: Event) => { e.stopPropagation(); open(); });
      content.addEventListener("keydown", (e: KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); open(); } });
      marker.addListener("gmp-click", open);
      markersRef.current.push(marker);
    });
    // Fit to the dots within 25 km of "You", plus You (library behaviour).
    const bounds = new g.maps.LatLngBounds();
    spread.filter((d) => distanceKm(self, { lat: d._lat, lng: d._lng }) <= 25).forEach((d) => bounds.extend({ lat: d._lat, lng: d._lng }));
    bounds.extend({ lat: self.lat, lng: self.lng });
    map.fitBounds(bounds, { top: 80, right: 80, bottom: 120, left: 80 });
  }, [spread, ready, self]);

  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !ready) return;
    const g = (window as any).google;
    const content = selfMarkerHTML();
    content.setAttribute("role", "button");
    content.setAttribute("tabindex", "0");
    content.setAttribute("aria-label", self.label);
    const marker = new g.maps.marker.AdvancedMarkerElement({ map, position: { lat: self.lat, lng: self.lng }, content, zIndex: 2000, title: self.label });
    const open = () => setSelfOpen(true);
    content.addEventListener("click", (e: Event) => { e.stopPropagation(); open(); });
    content.addEventListener("keydown", (e: KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); open(); } });
    marker.addListener("gmp-click", open);
    return () => { marker.map = null; };
  }, [ready, self]);

  const toggle = (s: string) => setActive((prev) => { const n = new Set(prev); if (n.has(s)) n.delete(s); else n.add(s); return n; });

  return (
    <div className="relative w-screen h-[100dvh] overflow-hidden" style={BODY}>
      <style>{`
        @keyframes pulse-ring { 0% { transform: scale(0.6); opacity: 1; } 100% { transform: scale(1.8); opacity: 0; } }
        button:focus-visible, a:focus-visible, [role="button"]:focus-visible { outline: 3px solid ${CHARCOAL}; outline-offset: 2px; border-radius: 8px; }
      `}</style>
      <h1 className="sr-only">Map of {p.brief.title}</h1>
      <div ref={mapRef} className="absolute inset-0" />

      {/* Back to the bot page */}
      <Link to={botHref} className="absolute z-[1000] right-3 rounded-full bg-white/95 backdrop-blur border border-slate-200 shadow-md px-3 py-2 flex items-center gap-1.5 text-xs font-semibold text-slate-700"
        style={{ top: `calc(env(safe-area-inset-top) + 1rem)` }}>
        <ArrowLeft size={14} aria-hidden="true" /> Call {p.brief.bot_name}
      </Link>

      {/* Filter panel */}
      <div className={`absolute z-[1000] ${view === "map" ? "" : "hidden"}`} style={{ left: 12, top: `calc(env(safe-area-inset-top) + 1rem)` }}>
        {filterOpen ? (
          <div className="w-64 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Sectors</span>
              <button onClick={() => setFilterOpen(false)} aria-label="Close filters" className="text-slate-500 hover:text-slate-700"><X size={14} /></button>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {sectors.map((s) => {
                const on = active.has(s.label);
                const Icon = iconFor(s.icon);
                return (
                  <button key={s.label} onClick={() => toggle(s.label)} aria-pressed={on} aria-label={s.label}
                    className="flex flex-col items-center gap-1 rounded-lg p-1.5 transition-colors border"
                    style={{ background: on ? PIN_BLUE : "#fff", color: on ? "#fff" : PIN_BLUE, borderColor: PIN_BLUE }}>
                    <Icon size={16} aria-hidden="true" />
                    <span className="text-[9px] leading-tight text-center font-semibold">{shortLabel(s.label)}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-slate-500 mt-2 leading-snug">Filled pins offer help; white pins are people asking for it. Everyone here is fictional.</p>
          </div>
        ) : (
          <button onClick={() => setFilterOpen(true)} className="rounded-full bg-white/95 backdrop-blur border border-slate-200 shadow-md px-3 py-2 flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <Filter size={14} aria-hidden="true" /> Filters
          </button>
        )}
      </div>

      {error && (
        <div className="absolute inset-0 z-[1500] flex items-center justify-center bg-white/80">
          <p className="text-red-600 font-semibold">{error}</p>
        </div>
      )}

      {view === "list" && (
        <div className="absolute inset-0 z-[1100] bg-slate-50 flex flex-col" style={{ paddingTop: `calc(env(safe-area-inset-top) + 1rem)` }}>
          <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-slate-200 px-4 py-3">
            <p className="text-xs font-bold text-slate-900">{filtered.length} dots · {p.brief.place.split(",")[0]}</p>
            <div className="flex gap-1.5 mt-2 overflow-x-auto pb-1">
              {sectors.map((s) => {
                const on = active.has(s.label);
                return (
                  <button key={s.label} onClick={() => toggle(s.label)} aria-pressed={on} aria-label={s.label}
                    className="text-[10px] font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap"
                    style={{ background: on ? CHARCOAL : "#fff", color: on ? "#fff" : "#334155", borderColor: on ? CHARCOAL : "#e2e8f0" }}>
                    {shortLabel(s.label)}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 pb-32">
            {filtered.map((dot) => (
              <button key={dot.id} onClick={() => setSelected(dot)} aria-label={`${dot.name}, ${dot.sector}, ${dot.area}`}
                className="w-full text-left bg-white rounded-xl border border-slate-200 shadow-sm p-3 flex items-start gap-3 hover:border-slate-300">
                <span className="mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0" style={dot.type === "seeker" ? { background: "#fff", border: `2.5px solid ${PIN_BLUE}` } : { background: PIN_BLUE }} />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-slate-900 truncate">{dot.name} <span className="font-normal text-slate-500">· {dot.area}</span></p>
                  <p className="text-[11px] font-semibold mt-0.5" style={{ color: PIN_BLUE }}>{dot.sector}</p>
                  {dot.offers[0] && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{dot.offers[0]}</p>}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="absolute left-1/2 -translate-x-1/2 z-[1300]" style={{ bottom: `calc(env(safe-area-inset-bottom) + 2.5rem)` }}>
        <div className="flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 shadow-lg p-1.5" role="group" aria-label="View">
          {([{ k: "map", label: "Map", Icon: MapIcon }, { k: "list", label: "List", Icon: ListIcon }] as const).map(({ k, label, Icon }) => {
            const on = view === k;
            return (
              <button key={k} onClick={() => setView(k)} aria-pressed={on} className="flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold transition-colors"
                style={{ background: on ? CHARCOAL : "transparent", color: on ? "#fff" : "#475569" }}>
                <Icon size={16} aria-hidden="true" /> {label}
              </button>
            );
          })}
        </div>
      </div>

      {selected && <DotCard dot={selected} onClose={() => setSelected(null)} />}
      {selfOpen && seeker && (
        <SelfCard onClose={() => setSelfOpen(false)} name={seeker.name} area={`${p.map!.you_area}, ${p.brief.place.split(",")[0]}`}
          who={seeker.occupation} lookingFor={seeker.traits.length ? [seeker.need] : [seeker.need]} about={seeker.story} />
      )}
    </div>
  );
}

function useEscapeClose(onClose: () => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
}

function DotCard({ dot, onClose }: { dot: MapDot; onClose: () => void }) {
  useEscapeClose(onClose);
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${dot.lat},${dot.lng}`)}`;
  const seeker = dot.type === "seeker";
  return (
    <div className="fixed inset-0 z-[2000] bg-black/40 flex items-end sm:items-center justify-center p-0 sm:p-6" onClick={onClose} role="dialog" aria-modal="true" aria-label={`${dot.name}, ${dot.sector}`}>
      <div onClick={(e) => e.stopPropagation()} className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[88dvh] overflow-y-auto">
        <div className="p-5 pb-4 relative rounded-t-3xl sm:rounded-t-2xl" style={{ background: `linear-gradient(135deg, ${PIN_BLUE}, ${CHARCOAL})` }}>
          <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 p-1 rounded-full bg-white/20 hover:bg-white/30"><X size={16} className="text-white" /></button>
          <div className="pr-8">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/25 text-white px-2 py-0.5 rounded-full">{seeker ? `Request · ${dot.offers[0] ?? dot.org_type}` : dot.org_type}</span>
            <h2 className="text-white font-bold text-lg leading-tight mt-2">{dot.name}</h2>
            <p className="text-white/85 text-xs flex items-center gap-1 mt-1"><MapPin size={11} aria-hidden="true" /> {dot.area}{dot.hours ? ` · ${dot.hours}` : ""}</p>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <Row label="Sector" value={dot.sector} />
          {dot.offers.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">{seeker ? "What they need" : "What they offer"}</p>
              <div className="flex flex-wrap gap-1.5">
                {dot.offers.map((o) => <span key={o} className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: `${PIN_BLUE}1A`, color: "#1F2937" }}>{o}</span>)}
              </div>
            </div>
          )}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">About</p>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg">{dot.description}</p>
            <p className="text-[11px] text-slate-500 mt-1.5">{seeker ? "Sample request for this prototype." : "Sample listing for this prototype."}</p>
          </div>
          <div className={`pt-1 ${seeker ? "" : "grid grid-cols-2 gap-2"}`}>
            {!seeker && (
              <span aria-disabled="true" className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold text-white opacity-40 cursor-not-allowed" style={{ background: CHARCOAL }}>
                <Phone size={14} aria-hidden="true" /> Call
              </span>
            )}
            <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold border" style={{ borderColor: CHARCOAL, color: CHARCOAL }}>
              <Navigation size={14} aria-hidden="true" /> Directions
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function SelfCard({ onClose, name, area, who, lookingFor, about }: { onClose: () => void; name: string; area: string; who: string; lookingFor: string[]; about: string }) {
  useEscapeClose(onClose);
  return (
    <div className="fixed inset-0 z-[2000] bg-black/40 flex items-end sm:items-center justify-center p-0 sm:p-6" onClick={onClose} role="dialog" aria-modal="true" aria-label={name}>
      <div onClick={(e) => e.stopPropagation()} className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[88dvh] overflow-y-auto">
        <div className="p-5 pb-4 relative rounded-t-3xl sm:rounded-t-2xl" style={{ background: CHARCOAL }}>
          <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 p-1 rounded-full bg-white/20 hover:bg-white/30"><X size={16} className="text-white" /></button>
          <div className="pr-8">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/25 text-white px-2 py-0.5 rounded-full">You</span>
            <h2 className="text-white font-bold text-lg leading-tight mt-2">{name}</h2>
            <p className="text-white/85 text-xs flex items-center gap-1 mt-1"><MapPin size={11} aria-hidden="true" /> {area}</p>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Row label="Who" value={who} />
            <Row label="Sector" value="Looking for help" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Looking for</p>
            <div className="flex flex-wrap gap-1.5">
              {lookingFor.map((o) => <span key={o} className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: "rgba(31,41,55,0.08)", color: CHARCOAL }}>{o}</span>)}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">About</p>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg">{about}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const Row = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">{label}</p>
    <p className="text-sm font-semibold text-slate-800">{value}</p>
  </div>
);
