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
