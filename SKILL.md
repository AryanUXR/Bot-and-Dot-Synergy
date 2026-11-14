# Blue Dots — Bot + Dot Prototype Skill

Entry point. People start with `GUIDE.md`, which explains how to use this skill and where everything is. **New here, or no `config/local.json`? Start with `onboarding/SKILL.md`.** It works out your role, helps you pick your own platforms, sets up and checks *your own* accounts, and writes your config. Otherwise read this file, then `LESSONS.md` (mistakes from past builds and their fixes), then only the sub-files your task needs.

**Bring your own platform.** Nobody shares keys or accounts. Raya, Lovable, Google Maps and Gemini are the *tested defaults*, not requirements: see `onboarding/stack-options.md`. IDs, numbers and paths in these docs are EkStep's own examples. Always use the values in your `config/local.json` instead.

Read every file from the local clone, not from GitHub URLs. The repo is private, so raw GitHub links return 404.
- Local clone: `local_clone_path` in your `config/local.json` (EkStep's is `/Users/turock/Desktop/EkStep Foundation/Bot-and-Dot-Synergy`)
- Run `git pull` on `main` before starting so you have the latest lessons.
- Remote, for pushing lessons back: your own `origin` (EkStep's is `https://github.com/AryanUXR/Bot-and-Dot-Synergy`, `main`)

---

## Routing — what are you building?

| Task | Fetch these files (in order) |
|------|------------------------------|
| First time, or new machine | `onboarding/SKILL.md` |
| **Any new build (the 7 stages)** | `FLOW.md`: understand → tech spec → fallbacks → QC → template UI → test calls → handover |
| No app builder or map key | `starter/` (plain HTML + one call function, OpenStreetMap) |
| Review a prototype before a demo | `onboarding/readiness-report.md` |
| Fix a live bot from feedback | `onboarding/fix-from-feedback.md` |
| New use case brief → full build | `content/use-case-brief-template.md` → `bot/SKILL.md` → `dot/SKILL.md` |
| Bot prototype only | `bot/SKILL.md` |
| Dot prototype only | `dot/SKILL.md` |
| Persona images only | `image-generation/README.md` |
| Content / writing only | `content/README.md` |
| DB sync between bot and dot | `shared/async-sync-architecture.md` |
| Raya agent setup | `shared/raya.md` |

---

## The four audit checks — every prototype, every time

Before anyone outside the build sees a prototype, and again after every data, persona or map change, it must pass all four:

1. **All types of dots are visible.** Requests and providers (for example job seekers, employers and service providers) are all on the map, every filter has dots, and nothing is hidden when the map opens.
2. **The map opens without a login.** Check the published link a visitor will get, not the editor preview.
3. **All data is dummy data.** Invented names, no addresses, no emails, no phone numbers except national helplines.
4. **Nothing sensitive.** No caste, religion, community, state of origin, marital status, surnames, or gender-biased or ableist words, in the map data, the persona text on the bot page, or the bot prompt.

Run `python3 scripts/audit.py <slug> --map-src <map code> --bot-src <bot code> --map-url <published map link>`. It prints PASS or FAIL for each of the four. Any FAIL blocks Stage 6 and handover. It works whatever platform you build on: it only reads files and opens the link.

## Standing rules — apply to every build

1. **No login on the dot map** — `App.tsx` has `/` and `/home` routing only, both pointing to `LaunchPage`. No `AuthPage`, no phone auth, no `RequireAuth` wrapper on the map route.
2. **Use the map provider in your config.** Google Maps with Advanced Markers is the tested default. Don't switch providers in the middle of a build.
3. **Async bot↔dot DB** — Raya tool calls write caller data to Supabase during the call. The dot map reads from the same Supabase tables with a realtime subscription. The two prototypes are separate Lovable projects but share one Supabase project.
4. **Remix your latest finished project** rather than starting from zero. A first-ever build starts from the templates in `bot/` and `dot/`; after that, your own latest project is the base.
5. **Read before prompting** — before sending any Lovable prompt, read the remixed project's key files. Do not assume. Read.
6. **Section by section** — one `send_message` per section. Wait for build success before the next.
7. **No slop** — apply `content/anti-slop-rules.md` to all generated copy before it goes into any Lovable prompt.
8. **Images are automated, from Gemini only** — run `image-generation/vertex_generate.py` (see `image-generation/README.md`). Never use Lovable-generated images. Persona photos must show the face clearly.
9. **Do the whole build end to end** — create the Raya agent, deploy prompts and memory, wire Lovable, run bot-to-bot tests, generate images and commit, without handing steps back. Only stop for what needs a human: a missing credential, an IAM role, a sign-in.
10. **Learn and push back** — when something goes wrong, add an entry to `LESSONS.md`, fix the doc that was wrong, and push both so the next build starts with the fix.
11. **All data is fictional** — maps and bots use invented names, first name + initial for people, no addresses and no phone numbers except national helplines. No surnames, state of origin, caste, religion or marital status. See `LESSONS.md` 48–51.

---

## Credentials + workspace

- Lovable workspace ID: `5mdf5lcGjqX0MUaRc1ZX`
- **All local secrets live in `raya/.env`** (git-ignored, template in `raya/.env.template`). The user types the values in themselves. Never ask for a key in chat, never commit the file, and check it with `scripts/preflight.py`, which never prints a value.
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

## Full pipeline

Follow `FLOW.md`. It has seven stages, each with an output and a gate:

1. Understand the use case → brief and personas, approved
2. Specify the tech requirements → `tech-spec.md`, preflight passing
3. Choose alternatives where an API is missing → `onboarding/fallbacks.md`
4. QC against the rules → `scripts/audit.py` (the four audit checks) and `scripts/qc_check.py`, no FAIL
5. Build on the standard template UI → `starter/UI-SPEC.md` (Lovable route: `bot/SKILL.md`, `dot/SKILL.md`), then `scripts/ui_check.py` and `scripts/card_alignment.js`, no FAIL
6. Test calls → website path first, then every persona
7. Hand over with presentation notes → `onboarding/handover-template.md`
