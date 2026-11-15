# White Dots Lucknow: schema (trial run, 15 Nov 2026)

The first run of schema-mapper inside a Bot-and-Dot build (`shared/schema-mapper.md`). It was made with `sm.py new … --mode have_documents`, with `brief.md` and `personas.md` as inputs.

**Filled from the brief, with quotes:**
- T0.1 problem;
- T0.3 providers;
- T0.8 how people join (voice bot);
- T0.9 Lucknow district, Hindi.

**Still to ask (Tier 0):**
- T0.2: are minors in scope?
- T0.4: which 3 to 5 of the nine needs start first? The brief lists all nine Dot colours; the four personas point to Education & Skilling, Jobs, Business, and SHGs. This is open item 1.
- T0.6: what "nearby" means.
- T0.7: what people see, and when.
- T0.10: what success looks like, and what happens after a connection.

**Tool note for Parth:** `status` marks T0.5 (aggregators) done while no phase 1 need is picked, because the check passes on an empty list.

**Next:** answer those five questions, then run `sm.py defaults`, `validate` and `render` (validate and render need `jsonschema` and `python-docx`; see `shared/schema-mapper.md`).
