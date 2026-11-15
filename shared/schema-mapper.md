# Schema mapping: from the use case to the schema

**schema-mapper** is a companion skill by Parth (EkStep), kept in its own private repo: `parthekstep/schema-mapper`. It takes a use case ("we want to help X find Y") to the schema a real Dots network runs on. Bot-and-Dot uses it in Stage 1 of `FLOW.md`, as soon as the brief and personas are approved, so the prototype and the eventual real network share one schema.

## What it produces

All three documents come from one `model.json`, and every value records where it came from: a document, a question, a default, an inference, or still open.

| Output | What it is | Who reads it |
|---|---|---|
| **Domain Mapping** (.docx) | The business view. Per need: who I am, what I have, what I want; aggregators; connections; metrics; outcomes. | The programme lead or department, who sign it off |
| **Config Note** (.docx) | The fields each side fills in (seeker, provider, aggregators), the connect flow and consent | Programme and tech |
| **Mapping Sheet** (.xlsx) | Every field with its settings: who can see it, matching, search, filter, card, go-live. Review colours: green = said or documented, yellow = assumed (review it), red = open. | The tech partner, to configure the real platform |
| `network.json` + forms (optional last step) | The files a Blue Dots deployment reads | The tech partner |

## Setup (once)

1. **Access.** The repo is private: ask Parth to add your GitHub account. Clone it next to this repo, or download it, and put the path in `config/local.json` under `schema_mapper.path`. EkStep's copy is at `Desktop/EkStep Foundation/Claude Skills/schema-mapper-main`.
2. **Its tools** run with `uv` (`uv run tools/sm.py …`). Without `uv`, plain Python 3.10+ works: run `python3 tools/sm.py …` instead.
   - `new`, `status` and `defaults` need nothing extra.
   - `validate` needs `jsonschema`.
   - `render` needs `openpyxl` (for the sheet) and `python-docx` (for the .docx copies). It always writes Markdown copies too.
3. **Check it:** `python3 scripts/preflight.py --only schema`.

No access? Skip this step and write the dot data from `content/dot-data-guide.md`, as before. The prototype still works; it just won't share a schema with a real network.

## How to run it inside a build (Stage 1, after the brief and personas are approved)

Run schema-mapper's `map-network` skill in **"I have documents" mode**, with this build's documents as its inputs:

```bash
cd <schema_mapper.path>
uv run tools/sm.py new "<bot-and-dot>/use-cases/<slug>/schema" --name "<Programme> <Place>" --mode have_documents
```

1. Copy `brief.md` and `personas.md` (and the infographic, if there is one) into `use-cases/<slug>/schema/inputs/`.
2. Follow schema-mapper's skills from its repo: `map-network`, then `extract-inputs`, `domain-mapping`, `config-note` and `schema-sheet`. They ask only what the brief leaves open, in programme language. **For a prototype, take the minimum path:**
   - Tier 0 live;
   - Tiers 1 and 2 shown as defaults for review.
3. `uv run tools/sm.py validate <model>` must be clean, then `uv run tools/sm.py render <model>`.
4. Show the user the Domain Mapping's first use case and the seeker field list. Get a yes before Stage 2.

The run folder stays in the use case: `use-cases/<slug>/schema/` holds `model.json`, `inputs/` and `outputs/` (the three documents).

## How the schema drives the rest of the build

The schema is the single source. When it changes, update these to match; don't let them drift:

| Schema part | Becomes |
|---|---|
| The need list (T0.4, `looking_for` / `services_offered`) | The map's **sectors and filters**. Each need is a filter, and every filter must have dots (audit check 1). |
| Provider categories (`provider_category`) | The provider types on dot cards ("org type" tag) |
| Seeker fields (who I am, what I have, location) | What the **bot asks** on a call, and the request dots' fields |
| Field keys | The bot's **output fields**. Use the same keys, so call data lines up with the real network. |
| "Visible only after both sides agree" fields | Never shown on a dot card or said by the bot before a connection. They also count as sensitive for audit check 4. |
| Aggregators (T0.5) | The "who brings people onto the network" line in the handover |
| Phase 1 needs (3 to 5) | The personas' needs. Each persona maps to one of them. |

## What it doesn't change

- The four audit checks and the non-negotiables still apply. schema-mapper's own rules (for example, nothing marked private can be used for matching) sit on top of them, never instead.
- The dot data is still fictional. The schema says *which fields* a dot has, never real people's values.
- Don't hand-edit its rendered documents: change `model.json` and render again.
