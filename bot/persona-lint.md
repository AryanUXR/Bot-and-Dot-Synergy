# Tester Persona Linting — Six Failure Modes

Every tester persona file must pass `scripts/persona_lint.py` before use. These checks encode real failures from past tests — each one caused a wasted call.

## Run the linter

```bash
python3 scripts/persona_lint.py raya/personas/[persona-file].md
```

Exits 1 if any ERROR. With `--strict`, exits 1 on any WARN too.

**The `--phone` flag** checks that the seeded Supabase profile matches what the persona expects:
```bash
python3 scripts/persona_lint.py raya/personas/[persona-file].md --phone 919XXXXXXXXX
```

This requires `scripts/pd_seed_profile.py` (from the Prompt Tuner repo — not included here). The base checks (checks 1–5) work without it. Use `<!-- REQUIRES-STATE: any -->` in your persona file to skip the state check if you don't have this script.

## The six checks

### 1. SHORT-REPLY
A spoken line of 1–2 words. The audio pipeline drops short audio and the bot hears silence.

BAD: `"विनोद।"` or `"हाँ जी।"` as a standalone spoken line

These caused 6 wasted calls each before the check was added. Every spoken line must be a complete utterance, not a single word or affirmation.

### 2. SILENCE-WORD
Imperative instructions like "Stop there", "Then WAIT", "say nothing" (without a qualifier like "after the goodbye").

The tester takes these literally and stops talking for the rest of the call.

BAD: `"Then WAIT for the bot to respond."`
GOOD: `"After the bot confirms, wait for them to offer the next step."`

Use the `<!-- LINT-ALLOW: SILENCE-WORD reason -->` marker only for personas deliberately designed to test silence handling.

### 3. VAGUE-TRIGGER
Conditions like "later", "if the call is still going", "if it is somehow still going" — no counted trigger, so the step never fires.

BAD: `"If the call is still going after the job discussion, ask about the wage."`
GOOD: `"After the bot reads the job title, ask about the wage before accepting."`

Every conditional step needs a concrete trigger — a thing the bot just said, an action just taken, or a step number.

### 4. MULTI-TERMINAL
More than one call-ending scenario (Exit #1, Exit #2) in one persona file. Only the first can ever be graded. Split into separate persona files.

### 5. NO-CATCHALL
No "never fall silent" fallback. If the bot asks something not in the persona's script, the tester hangs up silently.

Every persona must include before the grading section:
```
Never fall silent. If the bot asks something not covered above, respond briefly 
with a plausible answer that stays in character.
```

### 6. NO-STATE
No `<!-- REQUIRES-STATE: [state] -->` declaration. Without it, nobody can verify the seeded profile matches what the persona expects.

At the top of every persona file:
```html
<!-- REQUIRES-STATE: new_seeker -->
<!-- or -->
<!-- REQUIRES-STATE: returning_seeker -->
<!-- or -->
<!-- REQUIRES-STATE: any -->
```

If the persona is designed for a caller with a specific profile state, state it so the test harness can verify before calling.

## Persona file structure

A good tester persona file has:

```markdown
<!-- REQUIRES-STATE: [state] -->

## Persona: [Name]
[Who they are, what they want from this call — 2-3 sentences]

## Journey

**Step 1:** [What they say at the start]
Spoken line: "[exact Devanagari/Kannada/English utterance]"

**Step 2:** [After the bot does X, do Y]
...

## Exit Scenario #1: [condition]
[What signals the call is complete for this persona]

Never fall silent. If asked something not listed above, respond briefly in character.

## Grading
[What pass/fail looks like for this persona's journey]
```
