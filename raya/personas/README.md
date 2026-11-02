# Raya Tester Personas

Each file here is a tester persona — instructions for the testing agent to role-play during a voice test.

## File naming

```
[bot-slug]-[persona-id]-[scenario].md
```

Examples:
- `siza-nomsa-cold-call.md`
- `saarthi-rahul-new-seeker.md`
- `karigar-stanzin-returning.md`

## Before use

Every persona file must pass `persona_lint.py` with zero ERRORs:

```bash
python3 scripts/persona_lint.py raya/personas/[file].md
```

See `bot/persona-lint.md` for the six checks and how to fix them.

## Backups

`_backups/` contains automatic backups of the testing agent's state before each persona PATCH.
These are git-ignored — local safety net only.
