# Blue Dots — Bot + Dot Prototype Skill

Entry point. Read this file first, then `LESSONS.md` (mistakes from past builds and their fixes), then read only the sub-files your task needs.

Read every file from the local clone, not from GitHub URLs. The repo is private, so raw GitHub links return 404.
- Local clone: `/Users/turock/Desktop/EkStep Foundation/Bot-and-Dot-Synergy`
- Run `git pull` on `main` before starting so you have the latest lessons.
- Remote, for pushing lessons back: `https://github.com/AryanUXR/Bot-and-Dot-Synergy` (`main`)

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
8. **Images are automated, from Gemini only** — run `image-generation/vertex_generate.py` (see `image-generation/README.md`). Never use Lovable-generated images. Persona photos must show the face clearly.
9. **Do the whole build end to end** — create the Raya agent, deploy prompts and memory, wire Lovable, run bot-to-bot tests, generate images and commit, without handing steps back. Only stop for what needs a human: a missing credential, an IAM role, a sign-in.
10. **Learn and push back** — when something goes wrong, add an entry to `LESSONS.md`, fix the doc that was wrong, and push both so the next build starts with the fix.

---

## Credentials + workspace

- Lovable workspace ID: `5mdf5lcGjqX0MUaRc1ZX`
- **All local secrets live in `raya/.env`** (git-ignored, template in `raya/.env.template`). If the file is missing, ask the user for the values once and write it. Never commit it.
  - `RAYA_API_TOKEN` — Raya API key (same value as `RAYA_API_KEY` in the bot's Supabase secrets, which remixes keep)
  - `GOOGLE_SA_KEY` — path to the Google service account JSON used for Vertex AI images
  - `GEMINI_API_KEY` — optional AI Studio key (prepaid credit can run out)
- Raya base URL: `https://v1.getraya.app/api`
- Google Maps API key: set as the `GOOGLE_MAPS_API_KEY` secret in the dot project's Lovable settings (the user types it in; Lovable cannot open the secure form over MCP)

---

## Reference project IDs

| Purpose | Lovable ID |
|---------|-----------|
| Bot base (Blue Dots SA NLC) | `d816ead9-ef48-4fb9-8af2-26ae06bc157a` |
| Bot base, old (SA Siza) — remix fails, database unavailable since Nov 2026 | `2937b9e5-2f19-44d7-ad16-82efd6b5b9b7` |
| Dot base (Red Dots Ladakh) | `ac07c375-8ae5-49b8-a6c3-12d837bf3ded` |
| Use the latest finished bot/dot below as the remix base: it carries every fix so far. | |
| Latest finished bot (Sakhi, Hindi, female voice) | `b405dafa-656a-493c-b367-684aec4406df` |
| Red Dots bot (Sahai Line, Guwahati, built by Aryan) | `2dcccbc9-11c6-4e81-b08d-ee3f9a7b0e4e` |
| Previous bot (Kisaan Saathi, Hindi) | `ed2e96e3-5297-48bb-bbb0-d74d9ec89741` |
| Latest finished dot (Red Dots Guwahati, road safety, 9 sectors, 25 km opening bounds) | `3d87126c-5381-4fbd-9203-df03837849d2` |
| Previous dot (Pink Dots Tiruppur) | `fcc91ca3-91ca-4a40-8c23-c62cc2960681` |
| Older dot (Green Dots Nashik) | `49c43ba5-e7e8-4d43-ae23-0fb88ab49e61` |

Raya tester agent for bot-to-bot tests: see `raya/agents.json` (`tester-bluedots`).

---

## Full pipeline (brief → working prototypes)

```
1. Parse brief          → content/use-case-brief-template.md
2. Draft content        → content/persona-writing-guide.md
                          content/dot-data-guide.md
                          content/anti-slop-rules.md
3. Create Raya agent    → shared/raya.md  (POST /api/agent, then PATCH memory)
4. Build bot prototype  → bot/SKILL.md
5. Generate images      → image-generation/README.md
6. Build dot prototype  → dot/SKILL.md
7. Wire async DB sync   → shared/async-sync-architecture.md (skip when the brief says dots are hardcoded)
8. Bot-to-bot tests     → bot/voice-test-harness.md  (mandatory before handover)
9. Post-build checks    → bot/post-build-checklist.md
                          dot/post-build-checklist.md
10. Write back lessons  → LESSONS.md + the doc that was wrong, then push
```
