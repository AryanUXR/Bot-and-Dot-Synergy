# Bot Prompt Anatomy — Three Prompt Types

Every Raya agent has three prompt files. They work together but are edited separately.

## 1. Conversation prompt

**What it is:** What the bot actually says. One file per language.

**Structure:**
- Input variables section — lists `${persona}`, `${contact_memory}`, and any campaign args
- Memory injection block (mandatory when memory is enabled):
  ```
  ### Contact context
  Here is the caller context:
  {${contact_memory}}
  ```
- Phase/step structure — the call flow
- Tool call definitions — what tools the bot can call and when
- Routing/exit conditions
- Prohibited behaviour rules

**Language rule — hard:**
Instructions are ALWAYS in English. Only spoken lines (quoted dialogue, example conversations, TTS number spellings) are in the target language. A section whose rules are written in Hindi/Kannada is a bug — rewrite the prose to English and keep only the spoken lines translated.

**Multi-language:** Hindi is master (edited first). Kannada/other languages are mirrors (adapted, not just copied). Language-agnostic content is verbatim; language-specific content (spoken lines, greetings, example dialogue, local place names) is adapted.

**Must-haves from bot-to-bot testing.** Each one fixed a real failure; see `LESSONS.md`. Put all of them in every new conversation prompt.

1. **Close with `Goodbye`.** Every closing line ends with the word `Goodbye` in Latin script, once, nothing after it. Raya hangs up on it. Without it the call becomes a goodbye loop.
2. **Close once.** After each answer or match, ask one short "anything else?" line in the target language (Hindi: "और किसी चीज़ की ज़रूरत है?"). Say the closing line only when the caller has nothing more, says goodbye or thanks you. Answering a question is never closing, even when the answer sounds like the closing line or is "I can't do that" (send a link, book, call someone): end it with the "anything else?" line too. If the caller speaks after the close, repeat the same closing line once.
3. **One closing line per role.** A seeker and a provider get different closes, for example no "good harvest" to a mechanic.
4. **No persona leaks.** The persona section tells the bot where the call is likely to go. The bot must never say a detail from it before the caller does. Ask open questions and never offer a list of guesses. Keep the persona section to one line per persona.
5. **No promises after the call.** Nothing executes once the call ends. Prohibit "I will tell X about you", "they will call you", and any offer to pass details on.
6. **Providers get matched requests only.** When a provider calls, offer only seeker requests whose need matches the provider's service, nearest first, with a worked example in the prompt. Refer to seekers by first name and village only.
7. **At most two options per turn**, each with name, village and distance.
8. **Never invent.** No providers, phone numbers, prices or schemes outside the directory. Say plainly when nothing fits.
9. **Examples obey every rule.** Each worked example must follow every rule and safety line, because the bot copies examples more than it follows rules.
10. **Tag seeker rows with what they need** (`| NEEDS: CRECHE`) so providers only get matching requests.
11. **No time limits in the prompt.** The bot cannot see a clock. Set `max_call_duration_mins` and `call_duration_exceed_message` on the agent instead; in the prompt ask only for short answers.

## 2. Memory prompt

**What it is:** Runs after every call. Reads the transcript and writes a structured summary (`contact_memory`) that is injected into the next call's conversation prompt.

**One file, language-agnostic.** Output is always English. No cross-language twin.

**When to edit:** When you need to add or change what is remembered between calls. Route edits through `/update-memory`.

## 3. Output prompt

**What it is:** Runs after every call. Extracts call variables (e.g. `full_journey_completed`, `drop_reason`, `applied_to_job`) from the transcript into a structured object for the feedback dashboard.

**One file, language-agnostic.** Output is always English. No cross-language twin.

**When to edit:** When you add a new call outcome that needs to be tracked. Route edits through `/update-output`.

## Changelog rule

Every prompt edit (conversation, memory, or output) appends an entry to the agent's `CHANGELOG.md`:

```markdown
## YYYY-MM-DD — <short title>
- **Feedback/bug:** what prompted the change
- **Change:** what was changed
- **Files:** which files were touched
- **Ported from:** <source agent> (only for cross-agent ports)
```

## Before every edit — snapshot first

```bash
scripts/prompt-version.sh save [Agent] pre-[change-label]
```

This saves the current prompt files locally in `versions/[Agent]/`. If the edit breaks the bot, restore with:

```bash
scripts/prompt-version.sh restore [Agent] pre-[change-label]
```

The restore auto-saves the broken state first, so it is reversible.

## Deploying a changed prompt to Raya

```bash
python3 scripts/raya_deploy.py [agent_slug]
```

This PATCHes the live agent via the Raya API. Verify the PATCH response — never use a subsequent GET to confirm (GET returns empty instructions on Raya).

A change is not DONE when deployed. It is DONE when tested. See `bot/testing.md`.
