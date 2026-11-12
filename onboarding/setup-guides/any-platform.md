# Setting up any platform

Use this for a platform that has no guide of its own. Go through it with the user one step at a time.

1. **Account.** The user signs up with their own organisation's email. Check that this layer's "must do" list in `../stack-options.md` is met, and say plainly which items need a workaround.
2. **Plan and cost.** Send them to the platform's pricing page. Don't quote prices from memory. Note whether a card is needed even for a free tier.
3. **Credential.** Find out what the platform issues (API key, token or service account) and where to create it. Choose the narrowest scope that works.
4. **Where it lives:**
   - Keys used by local scripts go in `.env` at the repo root. The file is git-ignored; copy it from `.env.example`.
   - Keys used by the website go in the app builder's or host's secret store. Never put them in browser code.
   - The user types the value in themselves. You never see it, and nothing gets pasted into chat.
5. **Verify.** Make one cheap, read-only API call that proves the key works, such as listing agents or projects. Print only success or failure, never the key. Add it to `scripts/preflight.py` as a new check, so it can be re-run later.
6. **Record.** Put the platform name and any non-secret IDs (workspace, project, agent) in `config/local.json`.
7. **If it fails:**
   - 401 or 403 means a wrong key or missing permission.
   - 404 usually means a wrong base URL or region.
   - 429 means rate-limited, so wait and retry.

   Write anything new into `LESSONS.md`.
