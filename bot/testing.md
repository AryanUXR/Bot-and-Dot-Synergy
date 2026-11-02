# Bot Testing — Three-Tier Framework

**A change is not DONE when files are edited or deployed. It is DONE when tested.**

Never report a change as "done", "fixed", or "confirmed" until it has been tested and confirmed working with a real call transcript. If telephony is down, mark the change VERIFY-PENDING — never claim confirmed on an untested change.

## The three tiers — mandatory for every change

### Tier 1 — Fix verification

Did the bug get fixed? Reproduce the exact reported failure on each affected bot variant. Confirm it no longer occurs in a real call transcript. No transcript, no claim.

### Tier 2 — Blast-radius regression

Did the fix break anything adjacent? A fix can break its neighbours. Enumerate what the change could have affected — the same section, shared agnostic logic, the sibling language variant, the tool payload it touches — and run targeted tests around those areas.

### Tier 3 — Standing regression

A full regression suite runs once a day. Critical findings are surfaced. This catches drift since the last run.

## Rule: test every variant independently

"It works for Hindi, so Kannada is fine" is a recipe for disaster. A change verified on one bot/language is NOT verified on its twins. Every affected variant is tested independently — Hindi AND Kannada, each bot separately — even when the edited logic is identical agnostic content. Runtime adherence, ASR, and TTS differ per language.

## Agent-to-agent test pattern

The standard test is: a tester agent (inbound DID) role-plays a human persona; the bot under test calls the tester's DID; they converse; you grade the transcript.

See `bot/voice-test-harness.md` for the full setup.

## What to grade

From the transcript:
- Did the bot complete the intended journey?
- Did all tool calls fire with correct arguments? (Read `tool_calls[].function.arguments`, not `content`)
- Did the bot handle unexpected replies without breaking flow?
- Did the bot stay in the correct language?
- Were there silent turns (dead air)?
- Did the bot end the call correctly?

From `call_output`:
- Are the expected output flags set correctly?
- Is `drop_reason` accurate if the call ended early?
- Are any fields missing that should have been captured?

## Diagnosing a bad call

Use `scripts/raya_call.py [agent_uuid] [limit]` to pull recent call transcripts:

```bash
python3 scripts/raya_call.py [agent_uuid] 5
```

This shows: `agent_args`, `call_output`, and the full transcript including tool_calls with arguments. It is the primary debugging tool — always read the actual transcript before attributing a bug to the prompt.

## Not every bug is a prompt bug — push back

Root-cause every report against BOTH the real transcript AND the call's input args before touching a prompt. Common non-prompt causes:

- **Input error** — args sent to the wrong field, malformed values. The prompt is fine; the inputs weren't. Say so, make no edit.
- **Backend/runtime** — API errors, model ignoring a clear instruction. More prompt prose does not fix this; escalate for a platform fix.
- **Telephony flakiness** — call didn't bridge, audio dropout, 0-second duration with no transcript. Retry before diagnosing.
