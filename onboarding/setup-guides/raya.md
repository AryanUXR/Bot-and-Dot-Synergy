# Raya (voice agent platform): tested default

Raya is made by LitWiz Labs. API docs: https://docs.litwizlabs.com/llms.txt

1. **Account.** The user requests their own Raya account from LitWiz Labs, for their own organisation. Each organisation has its own account; there is no shared one.
2. **API key.** Created in the Raya dashboard.
3. **Where it lives.** It goes in two places, and the user types both in themselves:
   - Local scripts: `raya/.env` as `RAYA_API_TOKEN=...`, with `RAYA_BASE_URL=https://v1.getraya.app`. Copy the file from `raya/.env.template`.
   - Website call function: the app builder's secret store as `RAYA_API_KEY`. On Lovable that's Project Settings → Secrets.
4. **Verify.** Run `python3 scripts/preflight.py --only voice`, which lists agents and prints only OK or the error.
5. **Phone numbers.** Outbound calls need a number provisioned on their account. Ask Raya which numbers they have and for which countries. Don't pass `out_did` in call requests: let Raya pick the number (LESSONS.md 7, and `shared/raya.md`).
6. **Their own tester agent.** Create a second agent with `POST /api/agent`, set up with an **inbound** number from Raya. Record its ID and number in `config/local.json` under `tester`. The test scripts dial that number and play a persona (`bot/voice-test-harness.md`). Never use another team's tester.
7. **If it fails:**
   - **401 "Invalid API key":** the key is wrong, or the website's secret wasn't set. Copied projects don't bring secrets with them (LESSONS.md 35).
   - **Python 403 on the agent list:** use curl, or set a User-Agent header (LESSONS.md 44).
   - **SSL errors:** the scripts fall back to `/etc/ssl/cert.pem`.
