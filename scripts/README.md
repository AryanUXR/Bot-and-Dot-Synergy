# Scripts

Python/bash scripts for Raya bot deployment, testing, and data access.

All scripts read credentials from `raya/.env`:
```
RAYA_BASE_URL=https://v1.getraya.app
RAYA_API_TOKEN=[team API key]
```

| Script | What it does |
|--------|-------------|
| `raya_call.py` | Dump recent call transcripts for an agent, including tool_call arguments |
| `raya_testcall.py` | Manage the tester agent: `whoami`, `persona`, `lang`, `call` subcommands |
| `raya_testrun.py` | Run one end-to-end agent-to-agent voice test and dump the graded transcript |
| `persona_lint.py` | Pre-flight a tester persona file — checks 6 known failure modes |
| `prompt-version.sh` | Snapshot, list, diff, and restore prompt files before/after edits |
| `uat_batch.py` | Shared HTTP client used by raya_testrun and raya_testcall |
| `uat_dump.py` | Pretty-print saved UAT call JSON files with tool_calls |
| `gsheets.py` | Read/write Google Sheets via service account (feedback tracker) |

## Quick start — run a test

```bash
# 1. Write a persona file — raya/personas/[name].md
# 2. Lint it
python3 scripts/persona_lint.py raya/personas/[name].md

# 3. Load persona onto tester agent
python3 scripts/raya_testcall.py persona [tester_uuid] raya/personas/[name].md

# 4. Create args file — {"persona": "nomsa-dlamini"}
echo '{"persona": "nomsa-dlamini"}' > /tmp/args.json

# 5. Run the test (India bots — default timezone Asia/Kolkata)
python3 scripts/raya_testrun.py [bot_uuid] [tester_10digit_DID] /tmp/args.json [tester_uuid] test-1

# For non-India bots (e.g. South Africa):
RAYA_TIMEZONE=Africa/Johannesburg RAYA_CC=27 python3 scripts/raya_testrun.py [bot_uuid] [tester_DID] /tmp/args.json [tester_uuid] test-sa

# 6. If the test produces a bad call, read what actually happened
python3 scripts/raya_call.py [bot_uuid] 3
```

## Setup — raya/.env

Copy the template and fill in the key:
```bash
cp raya/.env.template raya/.env
# then edit raya/.env with the team API key from project memory
```

`raya/.env` is git-ignored. Never commit it.

```
RAYA_BASE_URL=https://v1.getraya.app
RAYA_API_TOKEN=[team Raya API key — same value as RAYA_API_KEY in Supabase secrets]
```

Note: scripts use `RAYA_API_TOKEN`; the Supabase edge function uses `RAYA_API_KEY`. Same key value, different variable names. See `shared/raya.md` for the full explanation.
