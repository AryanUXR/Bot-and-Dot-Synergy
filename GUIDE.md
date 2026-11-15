# Bot-and-Dot Synergy: user guide

How to use this skill and find your way around it. Read this first, then follow the link for whatever you're doing.

> **Maintained by the EkStep Bot-and-Dot team.** Last reviewed: **15 Nov 2026**. EkStep keeps a Google Doc copy (link in `ekstep/prototypes.md`), so update both. If something here doesn't match the repo, the repo wins: fix this guide in the same commit (see [Keeping this guide current](#keeping-this-guide-current)).

---

## 1. What this skill does

You give an AI coding agent (Claude Code is the tested one) a use case: a place, the people, and what they need. The skill guides it to build two linked prototypes:

| | What it is | What a visitor does |
|---|---|---|
| **Bot** | A web page with persona cards and a voice agent behind it | Picks a persona, enters a phone number, and gets a call from the bot in their language |
| **Dot** | A public map of services and requests, with no login | Filters by type, taps a dot, and reads its card |

A first build takes about one to two days, including tests. Once your accounts are set up, a build takes a few hours.

**One schema from idea to real network.** A companion skill, **schema-mapper**, turns the approved brief into the same Domain Mapping, Config Note and Mapping Sheet a real Dots network is configured from, so the prototype and the real network use the same fields.

**You bring your own platforms.** Raya (voice), Lovable (app builder), Google Maps and Gemini (images) are the *tested defaults*, not requirements. Nobody shares keys or accounts. If a platform is missing something, `onboarding/fallbacks.md` has a workaround. `starter/` builds both prototypes with no app builder and no map key.

---

## 2. Start here

**First time on this machine** (there's no `config/local.json`):
1. Clone the repo and run `git pull` on `main`.
2. Open it in your AI coding agent and say: *"Set me up for Bot-and-Dot"*. That runs `onboarding/SKILL.md`, which:
   - asks your role;
   - helps you choose platforms;
   - walks you through creating *your own* accounts;
   - checks each one live;
   - writes `config/local.json`.
3. Put your keys in `raya/.env` yourself (template: `raya/.env.template`). **Never paste a key into chat.**
4. Check everything with:
   ```bash
   python3 scripts/preflight.py
   ```
   It never prints a key.

**Already set up:** `git pull`, then tell the agent what you want, for example *"Build a bot and dot for Yellow Dots in Jaipur"*. It reads `SKILL.md`, then `LESSONS.md`, then only the files your task needs.

---

## 3. Pick your route

| I want to… | Say to the agent | It follows | You need accounts? |
|---|---|---|---|
| **Build** a new prototype | "Build a bot and dot for …" | `FLOW.md` (7 stages) | Yes |
| Build **without** an app builder or map key | "Use the starter" | `starter/README.md` | A voice platform only |
| **Review** a prototype before a demo | "Is this ready to show?" + the two links | `onboarding/readiness-report.md` | No |
| **Fix** a live bot from feedback | "Callers say the bot …" | `onboarding/fix-from-feedback.md` | Voice platform |
| **Audit** a prototype against the four checks | "Audit the … prototype" | `scripts/audit.py` | No (repo only) |
| Make **persona photos** only | "Make persona photos for …" | `image-generation/README.md` | Image model |
| Write **content** only (brief, personas, dots) | "Draft the brief for …" | `content/README.md` | No |
| Map the **schema** for a use case (Domain Mapping, Config Note, Mapping Sheet) | "Map the schema for …" | `shared/schema-mapper.md` | Access to schema-mapper |
| Just look around | read this guide | — | No |

---

## 4. The build, stage by stage

`FLOW.md` is the full version. Each stage ends in a **gate**: don't move on until it passes.

| # | Stage | You get | Gate | Main files |
|---|---|---|---|---|
| 1 | Understand the use case | `brief.md`, `personas.md`, then the schema in `schema/` | You approve the personas, then the schema | `content/use-case-brief-template.md`, `content/persona-writing-guide.md`, `shared/schema-mapper.md` |
| 2 | Tech spec | `tech-spec.md` | `preflight.py` passes | `onboarding/stack-options.md` |
| 3 | Fallbacks | Workarounds written into the spec | Any change to the demo agreed with you | `onboarding/fallbacks.md` |
| 4 | QC against the rules | Dummy data, clean text | **The four audit checks pass** | `onboarding/non-negotiables.md`, `scripts/audit.py`, `scripts/qc_check.py` |
| 5 | Build on the template UI | Bot page and map | `ui_check.py` and `card_alignment.js` pass | `starter/UI-SPEC.md`, `bot/SKILL.md`, `dot/SKILL.md` |
| 6 | Test calls | `tests.md` with transcripts | One call through the website works, then every persona passes | `bot/voice-test-harness.md`, `bot/testing.md` |
| 7 | Handover | `handover.md` with presentation notes | Readiness report all ✅ | `onboarding/handover-template.md` |

Everything for one use case lives in `use-cases/<colour>-dots-<place>/`. `use-cases/white-dots-lucknow/` is a complete example.

---

## 5. The checks, and how to run them

### The four audit checks (every prototype, every time)
1. **All types of dots are visible.** Requests and providers are both on the map, every filter has dots, and nothing is hidden when the map opens.
2. **The map opens without a login.** Check the *published* link, not the editor preview.
3. **All data is dummy data.** Invented names, no addresses or emails, and no phone numbers except national helplines.
4. **Nothing sensitive.** No caste, religion, community, state of origin, marital status, surnames, or gender-biased or ableist words, anywhere: map data, the map page, persona text, the bot prompt.

```bash
python3 scripts/audit.py <use-case-slug> --map-src <map code> --bot-src <bot code> --map-url <published map link>
```
It prints PASS or FAIL for each check. Any FAIL blocks testing and handover.

### All the checks at a glance

| Check | Command | When |
|---|---|---|
| Setup | `python3 scripts/preflight.py` | Once, then whenever something changes |
| Four audit checks | `python3 scripts/audit.py <slug> …` | Stage 4, after Stage 5, before handover |
| Data and prompt rules | `python3 scripts/qc_check.py <slug>` | Stage 4, after any data or prompt change |
| UI matches the template | `python3 scripts/ui_check.py bot <your code> <a finished bot's code>` (add `--ekstep` for EkStep builds; use `map` for maps) | Stage 5, after any UI change |
| Cards line up | Paste `scripts/card_alignment.js` into the browser console at 1440 px and 390 px | Stage 5 |
| Test-caller persona | `python3 scripts/persona_lint.py raya/personas/<file>.md` | Before each bot-to-bot test |

---

## 6. Common tasks

| Task | How |
|---|---|
| Run one bot-to-bot test call | `scripts/README.md` → *Quick start*. Persona files are in `raya/personas/`. |
| Read what happened on a call | `python3 scripts/raya_call.py <agent_uuid> 3` |
| Change a bot prompt safely | Snapshot first with `scripts/prompt-version.sh`, make the smallest edit, redeploy, compare live against the file, and add a line to that bot's `CHANGELOG.md` |
| Turn real rows into dummy data | `python3 scripts/make_dummy_dots.py <in.ts> <out.ts> <renames.json>`: drops addresses and non-helpline numbers, and renames rows from your JSON map of id → fictional name |
| Make persona photos | `image-generation/vertex_generate.py <prompts.md> <out_dir> --options 2`. Check every face before using it. |
| Move a phone number between voice agents | `python3 scripts/raya_did.py move <number> <from_uuid> <to_uuid>`, then place one real call to prove it routes |
| Deploy the plain-code version | `starter/README.md` (Vercel or Netlify) |

---

## 7. Where things are

| Where | What's there |
|---|---|
| `GUIDE.md` | This guide |
| `SKILL.md` | The agent's entry point: routing, rules, IDs |
| `FLOW.md` | The 7 build stages and their gates |
| `LESSONS.md` | Every mistake made so far, and its fix. Read before building. |
| `onboarding/` | First-run setup, platform choices, fallbacks, non-negotiables, readiness report, handover template, fixing from feedback |
| `onboarding/setup-guides/` | One guide per platform: Raya, Lovable, Google Maps, Gemini, GitHub, and any other |
| `bot/` | Building the bot page: steps, prompt anatomy, testing |
| `dot/` | Building the map: steps, data shape, cards, sectors |
| `content/` | Writing rules: brief template, personas, dot data, anti-slop |
| `starter/` | Plain HTML, one call function and an OpenStreetMap map. `UI-SPEC.md` is the template. |
| `scripts/` | Checks, test calls, number moves (see `scripts/README.md`) |
| `raya/` | Voice agent registry (`agents.json`), test personas, and your `.env` (never committed) |
| `image-generation/` | Persona photo pipeline |
| `shared/` | Notes on Raya, Google Maps, Supabase and the workspace, and how schema mapping fits in (`schema-mapper.md`) |
| `use-cases/` | One folder per prototype: brief, personas, data, prompts, tests, handover |
| `versions/` | Snapshots of prompts before big changes |
| `research/` | Who uses this skill, and why it works the way it does |
| `ekstep/` | EkStep's own builds only (header, logo, live links). Not for other teams. |
| `config/` | `local.example.json`. Your `local.json` is never committed. |

---

## 8. Rules you'll hit most often

The full ten are in `onboarding/non-negotiables.md`, each with the reason behind it. The ones that come up most:

- **People are a first name and an initial** ("Meena D."). No surnames, no home state for migrants, no marital status. Where a persona lives now is fine.
- **The copy says what the bot does** ("Helps you find hostels"), never what it gives.
- **Every call closes once.** Closing lines end with the platform's hang-up word (`Goodbye` on Raya). Every answer ends with "anything else?". There are no time limits in prompts, and no promises about what happens after the call.
- **Persona photos come from an image model,** face clearly visible. Never let the app builder invent images.
- **Test on the real path.** One call through the website's own call button before anything else.
- **Keys stay out of chat.** They go in `raya/.env` or the platform's secret store, typed by you.

---

## 9. Words used in this skill

| Word | Meaning |
|---|---|
| **Bot** | The voice agent and the web page that triggers its calls |
| **Dot** | One pin on the map, or the whole map prototype |
| **Seeker / request** | Someone who needs something. Shown as a white pin with a coloured ring. |
| **Provider** | A service or person who can help. Shown as a filled coloured pin. |
| **Persona** | A fictional person whose story a visitor plays on the call |
| **Tester agent** | A second voice agent that phones the bot and plays a persona, for automated tests |
| **Inbound / outbound** | The caller dials the bot / the bot calls the person |
| **Inbound number (`in_did`)** | The phone number a voice agent answers on |
| **Gate** | The check that must pass before the next stage |
| **Remix** | Copying a finished Lovable project as the start of a new one |
| **Schema** | What each side is asked, and who can see what. schema-mapper writes it as a Domain Mapping (business view), a Config Note (fields per side) and a Mapping Sheet (the settings tech uses). |

---

## 10. When something goes wrong

1. Check `LESSONS.md`. Most problems have happened before. Search it for the symptom.
2. Read the real call: `python3 scripts/raya_call.py <agent_uuid> 3`. Don't guess from the prompt.
3. Follow `onboarding/fix-from-feedback.md` to fix it from evidence.
4. When it's fixed, **add a lesson** to `LESSONS.md` and fix the doc that was wrong, in the same commit.

---

## Keeping this guide current

This guide is a map. The real instructions live in the files it points to. Update it when:
- a file or folder is added, moved or renamed;
- a new script or check is added (add it to section 5 or 6, and to `scripts/README.md`);
- a stage, gate or route changes in `FLOW.md` or `SKILL.md`;
- a rule is added to `onboarding/non-negotiables.md` that people will meet often (section 8).

When you update it:
- change the *Last reviewed* date at the top;
- keep the language plain, and explain any term the first time it appears;
- check every path you mention exists.

Quick check that every path with a folder in it still exists. Short names such as `brief.md` are per-use-case files, and `config/local.json` is created by each user, so both are skipped:
```bash
grep -oE '`[a-zA-Z0-9_.-]+/[a-zA-Z0-9_./-]+`' GUIDE.md | tr -d '`' | grep -v 'config/local.json' | sort -u | xargs -I{} sh -c 'test -e {} || echo missing: {}'
```
