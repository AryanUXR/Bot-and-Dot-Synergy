# Lovable (app builder): tested default

1. **Account and workspace.** The user creates their own Lovable account and workspace at lovable.dev. Paid plans give more credits; check the pricing page.
2. **Connect it to the coding agent.** In Claude, add the Lovable connector (Settings → Connectors) and sign in with *their* Lovable account. Check it by listing workspaces. Record the workspace ID in `config/local.json` as `app_builder.workspace_id`.
3. **First project.** EkStep's projects are not shared, so the user can't remix them. Their first bot and first map are built from the templates and prompts in `bot/` and `dot/`. After that, their latest finished project becomes their own remix base. Record it in `config/local.json` under `app_builder.bases`.
4. **Secrets.**
   - Lovable can't set secrets over the connector. The user adds them in Project Settings → Secrets: `RAYA_API_KEY` (or their voice platform's key) and `GOOGLE_MAPS_API_KEY`.
   - Copied (remixed) projects do **not** reliably bring secret values with them. Re-enter them in every new project (LESSONS.md 35, 37).
5. **Verify.** After the call function is deployed, run the website-path test in `bot/SKILL.md` Step 6. Point it at the user's own tester number, so no real person's phone rings.
6. **If it fails:**
   - Preview links ask for a Lovable login. Publish the project to check it without one.
   - Lovable's sandbox doesn't load uploaded images (LESSONS.md 5).
   - Big messages time out. Use `list_messages` to read the result (LESSONS.md 3).
