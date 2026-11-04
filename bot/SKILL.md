# Bot Prototype — Build Pipeline

A bot prototype is a single-page Lovable app with: Nav → PersonasSection → Footer.
No login. No map. Visitors pick a persona and receive an outbound Raya call.

## Files to read for this build

Fetch these in order before writing any Lovable prompts:

1. `bot/architecture.md` — full component structure
2. `bot/personas-schema.md` — TypeScript interface + writing rules
3. `bot/edge-function-template.ts` — copy-paste edge function
4. `bot/call-form-template.tsx` — copy-paste CallForm
5. `content/persona-writing-guide.md` — how to write good personas
6. `content/anti-slop-rules.md` — apply before any copy goes into Lovable
7. `shared/raya.md` — agent creation and API patterns
8. `bot/env-vars.md` — env var checklist

## Build sequence

### Step 0: Confirm inputs
Before starting, you must have:
- [ ] Confirmed spec: bot name, language, target geography, sector, seeker types
- [ ] Raya agent ID — create it yourself with `POST /api/agent` (`shared/raya.md`), then PATCH memory. Do not ask the user to use the dashboard.
- [ ] Approved personas (3 is standard: 2 seekers + 1 provider/mentor)
- [ ] Bot colour (hex)

### Step 1: Remix
```
Lovable:remix_project
  project_id: d816ead9-ef48-4fb9-8af2-26ae06bc157a   # Blue Dots SA NLC. The old Siza base 2937b9e5 fails to remix.
  workspace_id: 5mdf5lcGjqX0MUaRc1ZX
  project_name: [botname-bot-geography]
  include_history: false
  include_custom_knowledge: false
```

### Step 2: Read the remixed project
Read these files before writing a single prompt:
- `src/data/personas.ts`
- `src/components/CallForm.tsx`
- `src/components/Nav.tsx`
- `supabase/functions/initiate-call/index.ts`
- `src/components/PersonasSection.tsx`
- `src/components/PersonaModal.tsx`, `src/components/PersonaCard.tsx`, `src/components/Footer.tsx`
- `index.html`, `src/index.css`

Bases drift from the docs. On the d816ead9 base: there is no Hero on the page (PersonasSection holds the heading and subheading as default props), `questions.english` is read in PersonaModal and CallForm, "Questions she might ask" is hard-coded, and colours are hard-coded hex in PersonaModal gradients as well as CSS variables.

### Step 3: Send Lovable prompts — one section at a time

Wait for each build to succeed before sending the next.

`send_message` results are often too large to return and get saved to a file. Read them with `jq -r '"\(.status) \(.commit_sha) \(.cost_credits)"'` and `jq -r '.content' | tail -c 1500`. If the call times out, run `list_messages` with limit 2 and read the newest entry with jq.

**Section 1 — Visual identity** → `bot/prompts/01-visual-identity.md`
**Section 2 — personas.ts replacement** → `bot/prompts/02-personas-ts.md`
**Section 3 — Hero copy and heading** → `bot/prompts/03-hero-copy.md`
**Section 4 — Edge function** → `bot/prompts/04-edge-function.md`
**Section 5 — Supabase call log migration** → `bot/prompts/05-supabase-migration.md`

### Step 4: Generate and upload persona images
→ `image-generation/README.md` (Gemini via `image-generation/vertex_generate.py`, never Lovable-generated, faces clearly visible)

### Step 5: Post-build checks
→ `bot/post-build-checklist.md`

### Step 6: Test the live bot
→ `bot/testing.md` — 3-tier testing framework
→ `bot/voice-test-harness.md` — agent-to-agent test setup
→ `bot/persona-lint.md` — lint your tester persona before using it

A build is not done until Tier 1 (fix verification) and Tier 2 (blast-radius regression) are passed with real call transcripts.

Run this yourself before handing over. Do not ask the user for their phone number as a substitute.

0. Test the website path first: call the deployed `initiate-call` function with curl, using the tester's `dial_as` number as `phone` (command in `LESSONS.md` lesson 34). It must return `success: true`. A 401 means the `RAYA_API_KEY` secret needs re-entering by the user.
1. Write one tester persona per bot persona in `raya/personas/[bot]-[persona]-[scenario].md` and lint each with `scripts/persona_lint.py`.
2. For each one: `scripts/raya_testcall.py persona <tester_uuid> <file>`, then `scripts/raya_testrun.py <bot_uuid> <tester dial_as> args.json <tester_uuid> <label>`. The tester uuid and `dial_as` number are in `raya/agents.json` (`tester-bluedots`). Run the calls one after another in the background, about 2 to 5 minutes each.
3. Grade each transcript. The call must end with one `Goodbye`, not a goodbye loop. Check matches against the directory, prohibitions, and `call_output` (re-read it after a minute if it is null).
4. Fix the prompt, PATCH, re-run only the personas that failed.
5. Put the tester's original persona back from the oldest file in `raya/personas/_backups/`.
