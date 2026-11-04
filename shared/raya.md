# Raya — Agent Creation, Deployment, and Call API

Raya is the voice AI platform (LitWiz Labs) that powers all bot prototypes.

## API reference

- Base URL: `https://v1.getraya.app/api`
- Auth header: `X-API-Key: [key]` on every request

**Two credential names — two contexts. Do not mix them:**

| Context | Env var name | Where it lives |
|---------|-------------|----------------|
| Local test scripts (`scripts/*.py`) | `RAYA_API_TOKEN` | `raya/.env` (git-ignored) |
| Supabase edge function (Lovable bot) | `RAYA_API_KEY` | Supabase project → Edge Function secrets |

Both hold the same key value. The name difference exists because the scripts were written independently of the Lovable edge function. The key lives in `raya/.env`; if it is missing, ask the user once and write it there.

Full API docs: `https://docs.litwizlabs.com/llms.txt` (agents OpenAPI at `/api-reference/agents-openapi.json`).

## Creating a Raya agent — do it via the API, not the dashboard

```
POST /api/agent
X-API-Key: [key]
Content-Type: application/json

{
  "name": "Kisaan Saathi Hindi · Green Dots Nashik",
  "instructions": "[full conversation prompt]",
  "output_instructions": "[how to fill output_fields]",
  "output_fields": [{ "key": "persona", "description": "..." }, ...],
  "language_id": "38695ff2-ee6f-4a1c-837b-27ab241377f7",   // Hindi India
  "voice_id": "9a1dd39c-5125-4c63-afc7-ae9f917a8111",      // B. Arjun (Hindi, M)
  "max_call_duration_mins": 4,
  "call_duration_exceed_message": "[spoken line in the target language]",
  "allow_interruption": true
}
```

Returns 201 with the agent including `uuid`. Language and voice UUIDs: `/documentation/agent-language-options.md` and `/documentation/agent-voice-options.md` on the docs site. Pick a voice whose gender matches the prompt's self-references (Hindi "बोल रहा हूँ" is masculine). Record the uuid in `raya/agents.json`.

List agents: `GET /api/agent?limit=100` → `{ "agents": [{ "id", "name", ... }] }`.

### Memory — undocumented but supported

The create schema has no memory field, but PATCH accepts it:

```
PATCH /api/agent/{uuid}
{ "memory_enabled": true, "memory_instructions": "[memory prompt text]" }
```

Verified 2026-11-03: GET returns both fields afterwards.

## Updating a Raya agent

```
PATCH /api/agent/{agent_uuid}
X-API-Key: [key]
Content-Type: application/json

{ "instructions": "[full system prompt text]" }
```

Verify with `GET /api/agent/{uuid}`: as of Nov 2026 it returns full `instructions`, `output_fields`, `output_instructions`, `memory_instructions` and settings. Compare against the local file (strip trailing whitespace). Older note that GET returned empty instructions no longer applies.

## Ending the call — hard rule

Raya hangs up when the agent says the word `Goodbye` (Latin script) at the end of its turn. Every closing line must end with exactly `Goodbye`, once, nothing after it. Without it the agent and the caller trade goodbyes until the call-duration limit. See `bot/prompt-anatomy.md` for the closing pattern.

Always snapshot the current prompt before editing:
```bash
scripts/prompt-version.sh save [BotName] pre-[change-label]
```

## Firing an outbound call

```
POST /api/call
X-API-Key: [key]
Content-Type: application/json

{
  "agent_id": "[agent_uuid]",
  "to_number": "[digits only — no + or spaces]",
  "country_code": "[e.g. 91 or 27]",
  "agent_args": { "persona": "[persona id slug]" },
  "timezone": "[e.g. Asia/Kolkata | Africa/Johannesburg]"
}
```

**Do NOT pass `out_did` in the body.** Passing it explicitly causes Unanswered on test calls. Omit it and Raya routes correctly. If a remixed base still computes an `outDid` variable in its edge function, remove it.

## Rate limiting

POST /api/call is rate-limited to roughly 1 call per 13 seconds. On 429:

```python
if response.status == 429:
    retry_after = response.json().get("retry_after", 15)
    time.sleep(retry_after + 2)
    # then retry
```

Never fire two calls back-to-back without a sleep. In the Lovable edge function, use the 3-attempt retry loop from `bot/edge-function-template.ts`.

## Reading call transcripts

```
GET /api/call?agent_id={uuid}&limit=100&offset={offset}
```
Returns paginated list with `calls[]`, each having `uuid`, `outcome`, `call_duration`, `call_start_time`.

```
GET /api/call/{call_uuid}
```
Returns the full call object. **This endpoint LAGS** immediately after a call ends — poll every 15–18 seconds until outcome is terminal and transcript is non-empty.

`call_output` (the filled output fields) is often `null` right after the call even when the transcript is ready. Re-read a minute later before grading it.

### Terminal outcomes
`Completed` | `Failure` | `Unanswered` | `No Answer` | `Rejected` | `Busy` | `Canceled`

### Reading tool calls from the transcript — CRITICAL

A transcript turn that fires a tool call has `content = null`. The payload is in `tool_calls[]`:

```python
for turn in transcript:
    # Tool call made by the agent:
    for tc in (turn.get("tool_calls") or []):
        fn = tc.get("function") or {}
        name = fn.get("name")
        args = fn.get("arguments")   # ← the actual payload — not turn["content"]
    # Spoken content:
    content = turn.get("content")
```

A reader that only checks `content` misses every tool payload bug (wrong field, wrong format, missing value). Always read `tool_calls[].function.arguments`.

## Three prompt types per agent

Every Raya agent has three prompt files:

| Type | File | Notes |
|------|------|-------|
| Conversation | `[Agent]/[Agent] [Language].md` | One per language. What the bot says. |
| Memory | `[Agent]/[Agent] Memory.md` | One file, language-agnostic. English output. |
| Output | `[Agent]/[Agent] Output.md` | One file, language-agnostic. Extracts call variables. |

## Memory injection block

When memory is enabled, every conversation prompt must contain this block verbatim:

```
### Contact context
Here is the caller context:
{${contact_memory}}
```

Language-agnostic — same three lines in English in every language file. Never translate. Placement: inside the intro rules section.

## Prompt writing rules

- **Instructions always in English.** Only spoken lines (quoted dialogue) are in the target language.
- **Surgical edits only.** Change only what the task requires. Preserve spoken lines, variable names (`${...}`), tool names, JSON payloads, section structure.
- **One edit at a time.** No reformatting, re-ordering, or cleanup while making a content change.
- **Changelog entry required** after every edit — see `bot/prompt-anatomy.md`.

## Persona arg

`agent_args.persona` = the persona's `id` slug from `personas.ts`. The Raya system prompt uses `${persona}` as a variable. The slug must exactly match what the Raya prompt expects — case-sensitive, hyphen-exact.

## Env var naming convention

| Bot type | Env var |
|----------|---------|
| Single agent | `RAYA_AGENT_ID_[BOTNAME]` |
| Hindi variant | `RAYA_AGENT_ID_[BOTNAME]_HINDI` |
| Kannada variant | `RAYA_AGENT_ID_[BOTNAME]_KANNADA` |
| English variant | `RAYA_AGENT_ID_[BOTNAME]_ENGLISH` |
| API key | `RAYA_API_KEY` |

BOTNAME = uppercase slug e.g. SIZA, SAARTHI, KARIGAR.

The agent ID is not a secret. Lovable cannot open its secure secrets form over MCP, so put the uuid in the edge function as the fallback (`Deno.env.get('RAYA_AGENT_ID_X') ?? '<uuid>'`) instead of waiting for the user to add a secret. Only `RAYA_API_KEY` must be a secret. A remix keeps the secret's name but its value may be stale: test the deployed function once (see `bot/SKILL.md` Step 6) and, if Raya returns 401, have the user re-enter the key in Lovable → Cloud → Secrets.
