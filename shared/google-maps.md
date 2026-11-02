# Google Maps — Standard Patterns for Dot Prototypes

All dot prototypes use Google Maps JavaScript API with Advanced Marker Elements.

## API key

Key is stored in project memory (`ways-of-working-tools.md`). Retrieve it from there — do not hardcode it in repo files or Lovable prompt text.

Set it as `VITE_GOOGLE_MAPS_API_KEY` in Lovable project settings → Environment Variables for every dot prototype.

Enable these APIs in Google Cloud Console (already done for the current key):
- Maps JavaScript API
- Places API (if location search is needed)

## useGoogleMaps hook

Every dot prototype uses this hook to load the Maps script asynchronously:

```typescript
// src/hooks/useGoogleMaps.ts
import { useEffect, useState } from "react";

export const CLEAN_MAP_STYLE = [
  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "transit", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
];

export function useGoogleMaps() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if ((window as any).google?.maps) { setReady(true); return; }
    const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!key) { setError("VITE_GOOGLE_MAPS_API_KEY not set"); return; }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=marker&v=beta`;
    script.async = true;
    script.onload = () => setReady(true);
    script.onerror = () => setError("Failed to load Google Maps");
    document.head.appendChild(script);
  }, []);

  return { ready, error };
}
```

## Map initialisation

```typescript
const g = (window as any).google;
mapInstance.current = new g.maps.Map(mapRef.current, {
  center: { lat: CENTER_LAT, lng: CENTER_LNG },
  zoom: DEFAULT_ZOOM,
  minZoom: MIN_ZOOM,
  maxZoom: MAX_ZOOM,
  disableDefaultUI: true,
  zoomControl: true,
  styles: CLEAN_MAP_STYLE,
  gestureHandling: "greedy",
  mapId: "DEMO_MAP_ID",
});
```

Note: `styles` only applies when mapId is not a real Cloud Console map ID. For vector maps configure styling in Cloud Console, not in code.

## Advanced Marker Elements

```typescript
const marker = new g.maps.marker.AdvancedMarkerElement({
  map,
  position: { lat: dot._lat, lng: dot._lng },
  content: markerHTMLElement,   // HTMLElement, not string
  zIndex: 1000,
});
marker.addListener("gmp-click", () => setSelected(dot));
// Also attach click on content element for touch:
content.addEventListener("click", (e) => { e.stopPropagation(); setSelected(dot); });
```

Marker cleanup on re-render: set `marker.map = null` for each marker in `markersRef.current` before recreating.

## Spread dots algorithm

Dots sharing a near-identical coordinate (within ~100m) fan out into a ring to prevent overlap. Always apply this before rendering markers.

```typescript
function spreadDots<T extends { lat: number; lng: number }>(
  dots: T[]
): (T & { _lat: number; _lng: number })[] {
  const groups = new Map<string, T[]>();
  for (const d of dots) {
    const key = `${d.lat.toFixed(3)},${d.lng.toFixed(3)}`; // ~100m bucket
    const arr = groups.get(key) || [];
    arr.push(d);
    groups.set(key, arr);
  }
  const out: (T & { _lat: number; _lng: number })[] = [];
  for (const arr of groups.values()) {
    if (arr.length === 1) {
      out.push({ ...arr[0], _lat: arr[0].lat, _lng: arr[0].lng });
    } else {
      const R = 0.0016; // ~170m ring radius
      arr.forEach((d, i) => {
        const angle = (2 * Math.PI * i) / arr.length;
        out.push({
          ...d,
          _lat: d.lat + R * Math.sin(angle),
          _lng: d.lng + R * Math.cos(angle) / Math.cos(d.lat * Math.PI / 180),
        });
      });
    }
  }
  return out;
}
```

## Self persona marker

Every dot prototype has a "You" marker showing the seeker's context. This is always hardcoded (not from DB) and uses a pulsing ring animation.

```typescript
const SELF_PERSONA = {
  name: "[Seeker name]",
  area: "[Seeker area]",
  about: "[One paragraph — who this person is, what they need]",
  looking_for: ["Tag 1", "Tag 2", "Tag 3"],
  lat: CENTER_LAT,
  lng: CENTER_LNG,
};

function selfMarkerHTML(): HTMLElement {
  const el = document.createElement("div");
  el.innerHTML = `
    <div style="position:relative;width:42px;height:42px;display:flex;align-items:center;justify-content:center;cursor:pointer;">
      <div style="position:absolute;inset:-6px;border-radius:50%;background:rgba([R],[G],[B],0.15);animation:pulse-ring 2s cubic-bezier(0.4,0,0.6,1) infinite;"></div>
      <div style="width:42px;height:42px;border-radius:50%;background:#ffffff;border:3px solid [PRIMARY_HEX];box-shadow:0 2px 10px rgba([R],[G],[B],0.4);display:flex;align-items:center;justify-content:center;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="[PRIMARY_HEX]" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="8" r="4"/><path d="M4 22c0-4.4 3.6-8 8-8s8 3.6 8 8"/>
        </svg>
      </div>
    </div>`;
  return el.firstElementChild as HTMLElement;
}
```

Add this CSS to LaunchPage: `@keyframes pulse-ring { 0% { transform: scale(0.6); opacity: 1; } 100% { transform: scale(1.8); opacity: 0; } }`

## mapData.ts

Every prototype needs `src/lib/mapData.ts`:

```typescript
export const [GEO_NAME]_CENTER: [number, number] = [LAT, LNG];
export const DEFAULT_ZOOM = 11;
export const MIN_ZOOM = 8;
export const MAX_ZOOM = 18;
```

Always verify coordinates via web search before committing. Never use coordinates from memory.
