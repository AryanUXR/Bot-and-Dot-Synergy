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

Both hold the same key value. The name difference exists because the scripts were written independently of the Lovable edge function. Retrieve the key value from project memory.

## Creating / updating a Raya agent

Deploy a prompt to an agent with a PATCH — this is the only write path:

```
PATCH /api/agent/{agent_uuid}
X-API-Key: [key]
Content-Type: application/json

{ "instructions": "[full system prompt text]" }
```

**Critical:** `GET /api/agent/{uuid}` returns EMPTY instructions on Raya — never use GET to verify what is live. Verify against the PATCH response body, not a subsequent GET.

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

**Do NOT pass `out_did` in the body.** Passing it explicitly causes Unanswered on test calls. Omit it and Raya routes correctly.

### Outbound DID routing (in the Lovable edge function)

```typescript
const outDid = cleanCountryCode === '91' ? '918037006352' : '19786849695';
```

India (91) → `918037006352`. All others → `19786849695`.

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
