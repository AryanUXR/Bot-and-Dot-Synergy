# Dot Prototype — Architecture

## What it is

A fully public Google Maps page. No login. Sector-filtered coloured dots on the map. A "You" marker shows the seeker's position and context. Clicking a dot opens a DotCard bottom sheet with Call + Directions CTAs. Map/List view toggle at the bottom.

## Route structure

```
src/App.tsx
  /          → LaunchPage.tsx     ← same component
  /home      → LaunchPage.tsx     ← same component
  *          → NotFound.tsx
```

No auth routes. No AdminDashboard in the public-facing dot prototype. The map is public.

## Component map

```
LaunchPage.tsx                       ← entire UI lives here (all in one file is standard)
  useGoogleMaps()                    ← async Maps script loader
  mapRef                             ← Google Maps instance
  spreadDots()                       ← deduplication algorithm
  SECTORS[]                          ← filter config
  ICON_PATHS{}                       ← SVG icon per sector
  selfMarkerHTML()                   ← "You" marker with pulse ring
  markerHTML(dot)                    ← provider dot marker (coloured circle + icon)
  
  [map view]
    Filter panel (top-left, collapsible)
      3-column sector tile grid
    Self persona marker (centre)
    Provider dot markers (each sector colour)
    DotCard (bottom sheet, on dot tap)
    SelfCard (bottom sheet, on self tap)
    Nav island (bottom centre, map/list toggle)
  
  [list view]
    Sticky header (count + sector pills)
    Scrollable dot list (tap → DotCard)
```

## Data source

Static TypeScript file: `src/data/[name]Dots.ts`
OR
Supabase table with realtime subscription (when async sync is needed)

Both are valid. The static file is simpler to start with; switch to Supabase when live caller data needs to appear on the map.

## What to change vs what to keep

### CHANGE per prototype
- Primary colour constant (`const PRIMARY = "[HEX]"`)
- Geography name and coordinates in `mapData.ts`
- Dot data file (`src/data/[name]Dots.ts`)
- SECTORS array and ICON_PATHS object
- Self persona (`SELF_PERSONA` constant)
- Index.html title and description

### NEVER CHANGE (without specific reason)
- `useGoogleMaps` hook structure
- Spread-dots algorithm
- Advanced Marker Element pattern
- Filter tile grid layout (3 columns)
- Exact-match filter logic (never `.includes()`)
- DotCard bottom-sheet structure
- Map/List nav island
- Safe area inset padding patterns (for iOS)
