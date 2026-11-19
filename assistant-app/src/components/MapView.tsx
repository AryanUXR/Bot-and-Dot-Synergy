"use client";
/* global google */
import { useEffect, useMemo, useRef, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import clsx from "clsx";
import type { MapData, Persona, SchemaDoc } from "@/lib/types";
import { SectorIcon } from "./icons";

const BLUE = "#2563EB";
// EkStep's stored Maps key (the same one the Lovable map bases fall back to).
const KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "AIzaSyAsMGjvi-e04B38mWT1kc-tCYb6YlnogCE";

const STYLE = [
  { elementType: "geometry", stylers: [{ color: "#f3f4f6" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8a919e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f3f4f6" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#4b5563" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#e3efe4" }, { visibility: "on" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#e5e7eb" }] },
  { featureType: "road.local", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#cfdcf3" }] },
];

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

function esc(s: string) { return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!); }

function pinEl(icon: string, request: boolean, delay: number) {
  const svg = renderToStaticMarkup(<SectorIcon name={icon} />).replace("<svg", `<svg width="15" height="15" style="stroke:${request ? BLUE : "#fff"}"`);
  const el = document.createElement("div");
  el.className = "dot-pin";
  el.style.cssText = `position:absolute;width:30px;height:30px;margin:-15px 0 0 -15px;border-radius:999px;cursor:pointer;display:grid;place-items:center;
    background:${request ? "#fff" : BLUE};box-shadow:0 0 0 2.5px ${request ? BLUE : "#fff"},0 4px 10px rgba(16,24,40,.28);
    opacity:0;transform:scale(.6);transition:opacity .35s ease ${delay}ms, transform .35s cubic-bezier(.2,.9,.3,1.3) ${delay}ms`;
  el.innerHTML = svg;
  requestAnimationFrame(() => requestAnimationFrame(() => { el.style.opacity = "1"; el.style.transform = "scale(1)"; }));
  return el;
}

type GMap = google.maps.Map;

export default function MapView({ map, schema }: { map: MapData; schema?: SchemaDoc; personas?: Persona[]; height?: string; animate?: boolean }) {
  const el = useRef<HTMLDivElement>(null);
  const gmap = useRef<GMap | null>(null);
  const overlays = useRef<google.maps.OverlayView[]>([]);
  const info = useRef<google.maps.InfoWindow | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);
  const sectors = useMemo(() => schema?.sectors ?? [], [schema]);

  useEffect(() => {
    let alive = true;
    loadMaps().then(() => {
      if (!alive || !el.current) return;
      gmap.current = new google.maps.Map(el.current, {
        center: map.center, zoom: map.zoom, styles: STYLE, disableDefaultUI: true, zoomControl: true,
        zoomControlOptions: { position: google.maps.ControlPosition.RIGHT_BOTTOM }, clickableIcons: false, gestureHandling: "greedy",
      });
      info.current = new google.maps.InfoWindow({ disableAutoPan: false });
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
      draw() {
        const p = this.getProjection().fromLatLngToDivPixel(new google.maps.LatLng(this.pos));
        if (p) { this.node.style.left = `${p.x}px`; this.node.style.top = `${p.y}px`; }
      }
      onRemove() { this.node.remove(); }
    }

    const sectorOf = (id: string) => sectors.find((s) => s.id === id);
    const visible = map.dots.filter((d) => !filter || d.sector === filter);
    visible.forEach((d, i) => {
      const s = sectorOf(d.sector);
      const node = pinEl(s?.icon ?? "map-pin", d.kind === "request", Math.min(i * 22, 700));
      node.addEventListener("click", (e) => {
        e.stopPropagation();
        info.current?.setContent(`<div style="padding:4px 6px 2px;max-width:250px;font-family:var(--font-sans)">
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px">
            <span style="font-size:11px;font-weight:600;color:${BLUE};background:#eef3fe;border-radius:999px;padding:2px 8px">${esc(s?.label ?? d.sector)}</span>
            ${d.kind === "request" ? `<span style="font-size:11px;font-weight:600;color:#344054;background:#f1f3f6;border-radius:999px;padding:2px 8px">Looking for help</span>` : ""}
          </div>
          <div style="font-size:15px;font-weight:600;color:#0b1220;line-height:1.3">${esc(d.name)}</div>
          <div style="font-size:13px;color:#344054;margin-top:4px;line-height:1.45">${esc(d.detail)}</div>
          <div style="font-size:12px;color:#667085;margin-top:8px">${esc(d.area)}${d.hours ? " · " + esc(d.hours) : ""}</div></div>`);
        info.current?.setPosition({ lat: d.lat, lng: d.lng });
        info.current?.setOptions({ pixelOffset: new google.maps.Size(0, -16) });
        info.current?.open({ map: m });
      });
      const o = new HtmlMarker({ lat: d.lat, lng: d.lng }, node, d.kind === "request" ? 2 : 1);
      o.setMap(m);
      overlays.current.push(o);
    });

    const you = map.areas.find((a) => a.name.toLowerCase() === map.you_area.toLowerCase());
    if (you) {
      const node = document.createElement("div");
      node.style.cssText = "position:absolute;width:0;height:0";
      node.innerHTML = `<div style="position:absolute;left:-9px;top:-9px;width:18px;height:18px"><span style="position:absolute;inset:-10px;border-radius:999px;background:rgba(37,99,235,.18)"></span><span style="position:absolute;inset:0;border-radius:999px;background:#0b1220;box-shadow:0 0 0 3px #fff,0 4px 10px rgba(0,0,0,.3)"></span></div>
        <div style="position:absolute;left:16px;top:-11px;white-space:nowrap;font:600 12px var(--font-sans);color:#0b1220;background:#fff;padding:3px 9px;border-radius:999px;box-shadow:0 2px 8px rgba(16,24,40,.18)">You · ${esc(you.name)}</div>`;
      const o = new HtmlMarker({ lat: you.lat, lng: you.lng }, node, 5);
      o.setMap(m);
      overlays.current.push(o);
    }
    if (!filter && map.dots.length) {
      const b = new google.maps.LatLngBounds();
      map.dots.forEach((d) => b.extend({ lat: d.lat, lng: d.lng }));
      m.fitBounds(b, { top: 90, bottom: 60, left: 40, right: 40 });
    }
    m.addListener("click", () => info.current?.close());
  }, [ready, map, sectors, filter]);

  const counts = useMemo(() => Object.fromEntries(sectors.map((s) => [s.id, map.dots.filter((d) => d.sector === s.id).length])), [sectors, map.dots]);

  return (
    <div className="relative h-full w-full">
      <div ref={el} className="absolute inset-0 bg-[#f3f4f6]" />
      {!ready && !failed && <div className="skeleton absolute inset-0 rounded-none" />}
      {failed && <div className="absolute inset-0 grid place-items-center text-[14px] text-muted">The map couldn&apos;t load. Check the connection and reload.</div>}
      {sectors.length > 0 && (
        <div className="pointer-events-none absolute inset-x-3 top-3 z-10 flex flex-wrap gap-1.5">
          <button onClick={() => setFilter(null)}
            className={clsx("pointer-events-auto rounded-full px-3 py-1.5 text-[12.5px] font-medium shadow-pop transition", !filter ? "bg-brand text-white" : "bg-white text-ink-2 hover:bg-brand-soft")}>
            All · {map.dots.length}
          </button>
          {sectors.map((s) => (
            <button key={s.id} onClick={() => setFilter((f) => (f === s.id ? null : s.id))}
              className={clsx("pointer-events-auto flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-medium shadow-pop transition",
                filter === s.id ? "bg-brand text-white" : "bg-white text-ink-2 hover:bg-brand-soft")}>
              <SectorIcon name={s.icon} className="h-3.5 w-3.5" /> {s.label} <span className={filter === s.id ? "text-white/70" : "text-faint"}>{counts[s.id]}</span>
            </button>
          ))}
        </div>
      )}
      <div className="pointer-events-none absolute bottom-3 left-3 z-10 flex items-center gap-3 rounded-full bg-white/95 px-3 py-1.5 text-[12px] text-ink-2 shadow-pop">
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-brand ring-2 ring-white" /> Offers help</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-white ring-2 ring-brand" /> Looking for help</span>
      </div>
    </div>
  );
}
