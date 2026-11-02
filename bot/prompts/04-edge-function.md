# Bot Prompt 4 — Edge Function

Send after Section 3 builds successfully.

Copy the template from `bot/edge-function-template.ts`, fill in BOTNAME and timezone, then send this prompt:

---

```
## Section 4: Replace the initiate-call edge function

Replace the entire contents of supabase/functions/initiate-call/index.ts with the following:

[PASTE FILLED-IN edge-function-template.ts HERE]

Do not change anything else in the edge functions folder.
```

---

## Checklist before sending

- [ ] BOTNAME replaced with your bot's uppercase slug (e.g. SIZA, SAARTHI)
- [ ] timezone set correctly (Asia/Kolkata for India, Africa/Johannesburg for SA)
- [ ] outDid logic correct for your geography
