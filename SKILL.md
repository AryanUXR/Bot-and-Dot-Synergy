# Blue Dots — Bot + Dot Prototype Skill

Entry point. Read this file first, then fetch only the sub-files your task needs via their raw GitHub URLs.

Base URL for all files:
`https://raw.githubusercontent.com/AryanUXR/Bot-and-Dot-Synergy/main/`

---

## Routing — what are you building?

| Task | Fetch these files (in order) |
|------|------------------------------|
| New use case brief → full build | `content/use-case-brief-template.md` → `bot/SKILL.md` → `dot/SKILL.md` |
| Bot prototype only | `bot/SKILL.md` |
| Dot prototype only | `dot/SKILL.md` |
| Persona images only | `image-generation/README.md` |
| Content / writing only | `content/README.md` |
| DB sync between bot and dot | `shared/async-sync-architecture.md` |
| Raya agent setup | `shared/raya.md` |

---

## Standing rules — apply to every build

1. **No login on the dot map** — `App.tsx` has `/` and `/home` routing only, both pointing to `LaunchPage`. No `AuthPage`, no phone auth, no `RequireAuth` wrapper on the map route.
2. **Google Maps only** — `useGoogleMaps` hook + Advanced Marker Elements. Never Leaflet or OpenStreetMap.
3. **Async bot↔dot DB** — Raya tool calls write caller data to Supabase during the call. The dot map reads from the same Supabase tables with a realtime subscription. The two prototypes are separate Lovable projects but share one Supabase project.
4. **Remix, never scratch** — always `remix_project` from a reference. Never `create_project` from zero.
5. **Read before prompting** — before sending any Lovable prompt, read the remixed project's key files. Do not assume. Read.
6. **Section by section** — one `send_message` per section. Wait for build success before the next.
7. **No slop** — apply `content/anti-slop-rules.md` to all generated copy before it goes into any Lovable prompt.
8. **Images are automated** — use `image-generation/README.md`, not manual Gemini generation.

---

## Credentials + workspace

- Lovable workspace ID: `5mdf5lcGjqX0MUaRc1ZX`
- Raya API key: stored in project memory (ways-of-working-tools.md)
- Raya endpoint: `https://v1.getraya.app/api/call`
- Google Maps API key: in project memory (ways-of-working-tools.md) — set as `VITE_GOOGLE_MAPS_API_KEY` in Lovable env vars
- Gemini API key: in project memory (ways-of-working-tools.md) — set as `GEMINI_API_KEY` env var when running image generation script

---

## Reference project IDs

| Purpose | Lovable ID |
|---------|-----------|
| Bot base (SA Siza) | `2937b9e5-2f19-44d7-ad16-82efd6b5b9b7` |
| Dot base (Red Dots Ladakh) | `ac07c375-8ae5-49b8-a6c3-12d837bf3ded` |

---

## Full pipeline (brief → working prototypes)

```
1. Parse brief          → content/use-case-brief-template.md
2. Draft content        → content/persona-writing-guide.md
                          content/dot-data-guide.md
                          content/anti-slop-rules.md
3. Create Raya agent    → shared/raya.md
4. Build bot prototype  → bot/SKILL.md
5. Generate images      → image-generation/README.md
6. Build dot prototype  → dot/SKILL.md
7. Wire async DB sync   → shared/async-sync-architecture.md
8. Post-build checks    → bot/post-build-checklist.md
                          dot/post-build-checklist.md
```
