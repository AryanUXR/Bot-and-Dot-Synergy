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
- [ ] Raya agent ID (create agent first via `shared/raya.md`)
- [ ] Approved personas (3 is standard: 2 seekers + 1 provider/mentor)
- [ ] Bot colour (hex)

### Step 1: Remix
```
Lovable:remix_project
  project_id: 2937b9e5-2f19-44d7-ad16-82efd6b5b9b7
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

### Step 3: Send Lovable prompts — one section at a time

Wait for each build to succeed before sending the next.

**Section 1 — Visual identity** → `bot/prompts/01-visual-identity.md`
**Section 2 — personas.ts replacement** → `bot/prompts/02-personas-ts.md`
**Section 3 — Hero copy and heading** → `bot/prompts/03-hero-copy.md`
**Section 4 — Edge function** → `bot/prompts/04-edge-function.md`
**Section 5 — Supabase call log migration** → `bot/prompts/05-supabase-migration.md`

### Step 4: Generate and upload persona images
→ `image-generation/README.md`

### Step 5: Post-build checks
→ `bot/post-build-checklist.md`

### Step 6: Test the live bot
→ `bot/testing.md` — 3-tier testing framework
→ `bot/voice-test-harness.md` — agent-to-agent test setup
→ `bot/persona-lint.md` — lint your tester persona before using it

A build is not done until Tier 1 (fix verification) and Tier 2 (blast-radius regression) are passed with real call transcripts.
