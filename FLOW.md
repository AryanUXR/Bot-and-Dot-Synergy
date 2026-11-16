# The build flow: seven stages

Every Bot + Dot build runs through these seven stages in order, whatever platforms the builder uses. Each stage has an output, and you don't move on until that output exists and passes its gate.

New to the skill? Run `onboarding/SKILL.md` first. It sets up the builder's own accounts and writes `config/local.json`.

| # | Stage | Output | Gate (must pass before the next stage) |
|---|---|---|---|
| 1 | Understand the use case | `use-cases/<slug>/brief.md`, `personas.md` and `schema/` (Domain Mapping, Config Note, Mapping Sheet) | The user has approved the brief, the personas and the schema |
| 2 | Specify the tech requirements | `use-cases/<slug>/tech-spec.md` | Every capability has a platform, and every platform passes `scripts/preflight.py` |
| 3 | Choose alternatives where an API is missing | the same tech spec, with a "Fallbacks" section | No capability is left unmet; each gap has a named fallback the user has agreed to |
| 4 | QC against the rules | `python3 scripts/qc_check.py <slug>` report | No FAIL. Every WARN is either fixed or explained in the handover |
| 5 | Build on the standard template UI | the bot page and dot map | Matches `starter/UI-SPEC.md`; page title and tagline pass the copy rule |
| 6 | Test calls | test log in `use-cases/<slug>/tests.md` | Website-path call works; every persona passes bot-to-bot or a phone test; one Goodbye per call |
| 7 | Hand over with presentation notes | `use-cases/<slug>/handover.md` | Readiness report attached; demo script written; known limits stated |

---

## Stage 1: Understand the use case

**Read:** `content/use-case-brief-template.md`, `content/persona-writing-guide.md`.

0. **Check the fit** if anyone is unsure the idea suits Blue Dots, or it has no clear provider side. Run the fit check in `counsel/SKILL.md` and share the verdict. A "not a fit yet" stops here, with what would make it fit.
1. Take the infographic or brief. Pull out everything you can before asking: the problem, who seeks, who provides, the place, the language, the before/after quotes, and the manager's steer.
2. Ask **one round** of questions for what can't be inferred: city or district, language, bot name, and anything to emphasise. Propose a default for each.
3. Write `brief.md`, then three personas: two seekers and one provider. They're fictional, use first name and initial, and carry no sensitive labels (`onboarding/non-negotiables.md` 1–2).
4. Get the user's approval on the brief and personas.
5. **Map the schema** with schema-mapper, using the approved brief and personas as its documents (`shared/schema-mapper.md`). It produces the Domain Mapping, the Config Note and the Mapping Sheet in `use-cases/<slug>/schema/`. Its need list becomes the map's sectors and filters; its fields become what the dots carry and what the bot asks. No access to schema-mapper? Skip this step and follow `content/dot-data-guide.md`.
6. Get the user's approval on the schema before Stage 2.

## Stage 2: Specify the tech requirements

**Read:** `onboarding/stack-options.md`.

Write `tech-spec.md` from the template below. For each capability, name the builder's platform, the account it lives in, and the credential's *location* (never its value).

```markdown
# Tech spec: <programme>
| Capability | Needed for | Platform | Account / project | Credential location | Preflight |
|---|---|---|---|---|---|
| Outbound voice call through an API | bot calls the visitor | | | `.env` / host secrets | voice |
| Per-call persona variable | one agent, several stories | | | | |
| Agent-chosen hang-up | clean call endings | | | | |
| Transcripts through an API | testing, fixing | | | | |
| Voice and language: <language>, <gender> | the bot's voice | | | | |
| Phone number for <country> | the bot can call there | | | | |
| Public web page + one server function | bot page, call trigger | | | | |
| Map with custom markers | dot map | | | | |
| Persona images | persona cards | | | | images |
| Tester (second agent or own phone) | Stage 6 | | | | tester |
| Git remote | keeping prompts, data, lessons | | | | git |
```

Run `python3 scripts/preflight.py` and paste the result under the table.

## Stage 3: Alternatives where an API is missing

**Read:** `onboarding/fallbacks.md`.

For every row in the tech spec with no platform, or a platform that lacks the capability, pick a fallback from `fallbacks.md`. Write it under "Fallbacks" in the tech spec, saying what the visitor or demo audience will experience differently. Get the user's agreement on any fallback that changes the demo, for example "visitors call a number instead of getting a call".

## Stage 4: QC against the rules

**Read:** `onboarding/non-negotiables.md`.

**Gate: the four audit checks.** Run
`python3 scripts/audit.py <slug> --map-src <map code> --bot-src <bot code> --map-url <published map link>`.
All four must PASS:
1. all types of dots are visible;
2. the map opens without a login;
3. all data is dummy data;
4. nothing sensitive in the map data, persona text or bot prompt.

Run it here on the data and personas, again after Stage 5 with the map code and published link, and once more before handover. Paste its Result block into `tests.md` and the handover.

Then run `python3 scripts/qc_check.py <slug>`. It checks:
- the data files: fictional data, helplines only, no sensitive labels, every dot type present;
- the bot prompt: the Goodbye close, "anything else?" after answers, no time limits, no promises.

Then do the manual checks it lists. Run QC again after every change to data or prompts.

## Stage 5: Build on the standard template UI

**Read:** `starter/UI-SPEC.md`. That is the template every Dots prototype uses, whatever builds it.
- **No app builder, or any host:** copy `starter/`, replace `public/personas.json` and `public/dots.json`, and deploy (`starter/README.md`).
- **Lovable:** `bot/SKILL.md` and `dot/SKILL.md`. Remix your own latest finished project.
- **Another app builder:** give it `starter/UI-SPEC.md` and the two JSON files, and ask it to reproduce the spec exactly.

**Gate: the UI matches the template.** Run both checks before Stage 6, and again after any UI change:
1. `python3 scripts/ui_check.py bot <your source folder> <a finished bot's folder>` (and `map` for the map). The second folder is the reference. Any card, label or photo style that differs from it fails.
2. Paste `scripts/card_alignment.js` into the browser console on the bot page, at 1440 px and 390 px wide. It must print PASS: every card in a row has the same top, height, photo, name and label position.

Fix every FAIL before testing calls. Inconsistent cards look broken in a demo even when the bot works.

## Stage 6: Test calls

**Read:** `bot/voice-test-harness.md`, `onboarding/fix-from-feedback.md`.

1. **Website path first.** Place one call through the deployed call function, to your own tester or your own phone. It must connect.
2. **Every persona.** Run bot-to-bot, or phone tests, from the persona scripts. Include one "real caller" script with several follow-up questions and an out-of-scope request.
3. **Grade each call:**
   - it matches the directory;
   - the safety lines are said;
   - "anything else?" comes after each answer;
   - there is exactly one Goodbye, said only when the caller is done.
4. Log the results in `tests.md`. Fix, then re-run only the personas that failed.

Note: calls to a tester agent can fail to connect now and then. Retry once before treating it as a bug.

## Stage 7: Hand over with presentation notes

**Read:** `onboarding/handover-template.md`, `onboarding/readiness-report.md`.

Write `handover.md`:
- the links;
- the readiness report;
- a three-minute demo script;
- what is fictional;
- known limits and the fallbacks used;
- test results;
- who to contact for changes.

**EkStep builds:** also make the deck with `ekstep/collateral/SKILL.md` and add it to the handover links.

Then record anything new in `LESSONS.md` and push.
