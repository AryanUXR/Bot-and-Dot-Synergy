# Dot Prototype — Build Pipeline

A dot prototype is a fully public Google Maps page. No login. Sector-filtered coloured dots on the map. Clicking a dot opens a card with Call + Directions CTAs. Built on Lovable + Supabase.

## Files to read for this build

Fetch these in order before writing any Lovable prompts:

1. `dot/architecture.md` — component structure
2. `dot/dot-schema.md` — TypeScript interface + dot data writing rules
3. `dot/sector-config.md` — icon SVG library, filter tile grid
4. `dot/dot-card.md` — DotCard bottom sheet pattern
5. `shared/google-maps.md` — Maps hook, markers, spread-dots algorithm
6. `shared/supabase.md` — RLS, realtime pattern
7. `content/dot-data-guide.md` — how to write dot names and descriptions
8. `content/anti-slop-rules.md`

## Build sequence

### Step 0: Confirm inputs
If a bot for this use case already exists, read its `src/data/personas.ts` first. Its stories give you the places, the providers each persona needs and the "You" persona (LESSONS.md 38).
- [ ] Dot colour (hex)
- [ ] Geography: name, centre lat/lng (verify via web search)
- [ ] Seeker type: who is the "You" persona on the map
- [ ] Provider type: what kinds of dots are shown
- [ ] Sector list: 6-9 filter categories
- [ ] Supabase project (same one as the bot prototype for this use case)
- [ ] Google Maps API key — the remixed base reads it through the `get-google-maps-key` edge function from the `GOOGLE_MAPS_API_KEY` secret. The user sets it in Project Settings → Secrets; Lovable cannot open the secure form over MCP.

### Step 1: Remix
```
Lovable:remix_project
  project_id: <latest finished dot in SKILL.md reference IDs>   # carries every fix so far; ac07c375 is the original Ladakh base
  workspace_id: 5mdf5lcGjqX0MUaRc1ZX
  project_name: [colour]-dots-[geography-slug]
  include_history: false
  include_custom_knowledge: false
```

**Maps key:** the EkStep map bases carry a stored key in `src/hooks/useGoogleMaps.ts` (`FALLBACK_GOOGLE_MAPS_API_KEY`), used whenever the project has no `GOOGLE_MAPS_API_KEY` secret. So a new copy works with **no secret**: don't ask for one. Never add a secret unless it's a key that allows `*.lovable.app`; a restricted secret overrides the stored key and breaks the map (Red Dots, 11 Nov). Outside EkStep, use your own key (`onboarding/setup-guides/google-maps.md`) or the no-key OpenStreetMap map in `starter/`.

### Step 2: Read the remixed project
Read before writing a single prompt:
- `src/App.tsx`
- `src/pages/LaunchPage.tsx`
- `src/data/<previous city>Dots.ts` (the finished map's data file, e.g. `guwahatiDots.ts`)
- `src/lib/mapData.ts`
- `src/hooks/useGoogleMaps.ts`

### Step 3: Send Lovable prompts — one section at a time

**Section 1 — Visual identity** → `dot/prompts/01-visual-identity.md`
**Section 2 — Dot data file** → `dot/prompts/02-dot-data.md`
**Section 3 — Sector config** → `dot/prompts/03-sector-config.md`
**Section 4 — Google Maps setup** → `dot/prompts/04-google-maps-setup.md`
**Section 5 — Dot card** → `dot/prompts/05-dot-card.md`
**Section 6 — Supabase sync (optional)** → `dot/prompts/06-supabase-sync.md`

### Step 4: Post-build checks
→ `dot/post-build-checklist.md`
