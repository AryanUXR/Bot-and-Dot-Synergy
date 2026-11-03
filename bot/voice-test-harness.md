# Voice Test Harness — Agent-to-Agent Testing

Tests a live Raya bot by having a tester agent call it as a human persona.

## How it works

```
[scripts/raya_testrun.py]
  1. PATCH tester agent with persona instructions
  2. POST /api/call  (bot_uuid → tester's inbound DID)
  3. Poll for terminal status (every 18s, up to 22 polls)
  4. Dump: transcript + call_output (bot leg) + tester leg
```

The tester agent is a dedicated Raya agent with an inbound DID. It receives the call, role-plays the persona, and the conversation runs. You grade the transcript against checklists.

## Tester agent

The team's tester agent is "Testing Agent- Blue Dots": entry `tester-bluedots` in `raya/agents.json` (uuid `f60e0899-aa3a-4be7-9b4f-0296bd28ef48`, inbound DID `911204404272`, pass `1204404272` as the 10-digit number to `raya_testrun.py`). It is an inbound agent — it receives, not initiates. It speaks Hindi with a female voice, which is fine for male personas.

The tester is shared with other teams. When you finish, put its original persona back:
```bash
python3 scripts/raya_testcall.py persona f60e0899-aa3a-4be7-9b4f-0296bd28ef48 "$(ls -tr raya/personas/_backups/f60e0899-* | head -1)"
```
Check that the oldest backup is from before your session started.

## Setup before each test

**Step 1: Write a persona file**

A tester persona is a markdown file that tells the tester agent what to say and do on the call. Run it through `scripts/persona_lint.py` before using it — see `bot/persona-lint.md`.

**Step 2: Load the persona onto the tester**

```bash
python3 scripts/raya_testcall.py persona [tester_uuid] raya/personas/[persona-file].md
```

This PATCHes the tester agent with the persona instructions. It automatically backs up the current tester state first.

**Step 3: Set the tester language (if needed)**

```bash
python3 scripts/raya_testcall.py lang [tester_uuid] hi   # Hindi
python3 scripts/raya_testcall.py lang [tester_uuid] kn   # Kannada
```

**Step 4: Run the test**

```bash
python3 scripts/raya_testrun.py [bot_uuid] [tester_10digit_DID] [args.json] [tester_uuid] [label]
```

`args.json` = the `agent_args` to pass with the call (persona ID, any campaign args).

## Telephony reality — what the script handles

From real operational experience:

- Rate limit: ~1 call per 13s. 429 → back off `retry_after + 2` seconds.
- **Bridging is intermittent.** Some dials fail immediately (outcome Failure/Unanswered, duration=0, no transcript). Script retries up to 4 times with 45s cooldown between attempts.
- **Do NOT pass `out_did`** in the POST body — passing it explicitly caused Unanswered in testing. Omit it.
- **GET /api/call/{uuid} lags** right after a call. Script polls every 18s until outcome is terminal AND transcript is non-empty.
- The tester (callee) receives NO `agent_args` — scenario selection is done by PATCHing the tester prompt (Step 2), not per call.

## Reading the output

The script dumps:

```
[label] BOT [uuid] outcome=Completed dur=87
call_output: { ... }

TRANSCRIPT:
[user] नमस्ते...
[assistant] नमस्ते, मैं...
[assistant->TOOL] save_profile({"name": "Rahul", ...})
[tool] {"success": true}
[assistant] ...
```

Always check `tool_calls` entries — `content` is null on those turns.

## Grading after the test

1. Did the bot complete the intended journey? (`full_journey_completed` in call_output)
2. Did all tool calls fire with the right arguments?
3. Did the bot stay in language?
4. Any silent turns or unexpected drops?
5. If a fix was being tested: did the specific bug not occur?

## Inbound test (new caller — no profile)

To test how the bot handles a brand new caller with no stored profile, use `scripts/inbound_newcaller.py`. This temporarily repurposes the Purple inbound agent as a seeker and calls the KKB inbound DID from a number with no known profile.

**The Purple agent is a live PwD service line — always restored in a `try/finally` block. Keep the test window short.**
