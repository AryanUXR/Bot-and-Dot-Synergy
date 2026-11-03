# Lessons Log

Read this before every build. Each entry is a mistake that cost time on a real project, the fix, and where the fix now lives in the skill docs. When a build hits something new, add an entry here **and** fix the doc that was wrong, then push both.

Format: **What happened** → **Fix** → *Now in*

---

## 2026-11-03 · Green Dots Nashik (Kisaan Saathi, Hindi, agriculture)

### Lovable

1. **The bot base in SKILL.md could not be remixed.** Siza (`2937b9e5…`) returned "remix blocked", then "source project's Lovable Cloud database isn't available". Tourist Saarthi (`8fd0d5fd…`) failed the same way. → Remixed `d816ead9-ef48-4fb9-8af2-26ae06bc157a` (Blue Dots SA NLC, single-persona base), which worked first time. → *Now in* `SKILL.md` reference IDs, `bot/SKILL.md` Step 1.
2. **The new base differs from the documented one.** No Hero section on the page (PersonasSection carries the heading), `questions.english` key hard-coded in PersonaModal and CallForm, "Questions she might ask" hard-coded, CallForm had a hard-coded agentId, outDid logic in the edge function. → Read every file listed in `bot/SKILL.md` Step 2 and also `PersonaModal.tsx`, `PersonaCard.tsx`, `Footer.tsx`, `index.html`, `src/index.css` before prompting. → *Now in* `bot/SKILL.md` Step 2.
3. **`send_message` and `list_messages` results are often too large to return.** → Read the saved output with `jq -r '.status, .commit_sha, .cost_credits'` and `jq -r '.content' | tail -c 1500`. If a call times out, `list_messages` (limit 2) then jq. → *Now in* `bot/SKILL.md` Step 3.
4. **Lovable cannot open its secure secrets form from MCP.** It asks the user to type secrets in Project Settings. → The Raya agent ID is not secret: put it in the edge function as the fallback (`Deno.env.get('RAYA_AGENT_ID_X') ?? '<uuid>'`). Only `RAYA_API_KEY` must be a secret, and remixes keep it. → *Now in* `bot/edge-function-template.ts`, `shared/raya.md`.
5. **Preview URLs need a Lovable login, and the sandbox dev server does not proxy CDN assets.** Images look broken in Lovable's own sandbox checks. → Ask Lovable to curl `https://id-preview--<id>.lovable.app/__l5e/assets-v1/...` for 200 image/png, and ask the user to eyeball the preview once.
6. **Never use Lovable-generated images.** User rule. → Generate with Gemini, upload with `get_file_upload_url` + PUT, attach to `send_message`, tell Lovable "use this exact file, do not generate, edit or crop". → *Now in* `SKILL.md` rule 8, `image-generation/README.md`.

### Raya

7. **Docs said agents can only be created in the dashboard. Wrong.** `POST /api/agent` creates an agent with instructions, output fields, language and voice in one call. `GET /api/agent?limit=100` lists agents. → *Now in* `shared/raya.md`.
8. **Memory has no documented field, but the API accepts one.** `PATCH /api/agent/{id}` with `{"memory_enabled": true, "memory_instructions": "..."}` works and reads back on GET. → *Now in* `shared/raya.md`.
9. **Docs said GET returns empty instructions. Not true any more.** GET returned full instructions, output fields and memory, and we used it to verify every deploy. → *Now in* `shared/raya.md`.
10. **The bot never hung up.** All three test calls ended in 20+ turns of "राम-राम / नमस्ते" until the tester's limit cut them off. → The closing line must end with the word `Goodbye` in Latin script, once, nothing after it. Raya ends the call on it. Any utterance after the close gets the same line again. → *Now in* `bot/prompt-anatomy.md`, `shared/raya.md`.
11. **The bot said its closing line after every answer, then kept talking.** → After each match ask "anything else?" in the target language. Close exactly once, when the caller has nothing more. → *Now in* `bot/prompt-anatomy.md`.
12. **The bot leaked persona context.** It asked "is it the hydraulic?" before the caller said so, because the prompt's persona section described the problem. Two rounds of fixes reduced but did not remove it. → Tell the prompt never to say a persona detail before the caller does, and to ask open questions. Keep persona context short. → *Now in* `bot/prompt-anatomy.md`.
13. **The bot promised things that never happen after a call** ("I will tell Ganesh about you"). → Prohibit any promise of post-call action. → *Now in* `bot/prompt-anatomy.md`.
14. **Provider persona got a seeker's closing line** ("good harvest" to a mechanic) **and was offered unrelated requests** (labour to a mechanic). → One closing line per role. Match farmer requests to the provider's actual service, with a worked example. → *Now in* `bot/prompt-anatomy.md`.
15. **`call_output` is null right after the call.** It fills in a minute later. → Re-read `GET /api/call/{uuid}` before grading output fields.
16. **The Raya API key was not on the machine** (docs said "project memory", which did not exist) and `raya/.env` was not git-ignored. → Key lives only in `raya/.env`, which is now ignored. → *Now in* `.gitignore`, `raya/.env.template`, `SKILL.md` credentials.

### Testing

17. **Bot-to-bot testing is mandatory, not optional, and must be done before handing over.** Phone tests by the user are not a substitute. → Three tester personas, one per bot persona, linted, run with `scripts/raya_testrun.py` against the shared tester. → *Now in* `bot/SKILL.md` Step 6, `raya/agents.json` (tester uuid and DID).
18. **The tester agent UUID was "in agents.json" per the harness doc but was not there.** → Added `tester-bluedots` with uuid, inbound DID and the 10-digit dial number. Restore its original persona from `raya/personas/_backups/` (oldest file) after testing. → *Now in* `raya/agents.json`, `bot/voice-test-harness.md`.
19. **Scripts failed with SSL certificate errors** on python.org Python for macOS. → Scripts now fall back to `/etc/ssl/cert.pem` themselves. → *Now in* `scripts/raya_*.py`.

### Images

20. **The AI Studio Gemini key ran out of prepaid credit, and a top-up did not reach the API for 10+ minutes.** An OAuth client secret JSON is not an API key. → Use Vertex AI with the service account (`blue-dots-admin@blue-dots-project`). It needed the role **Agent Platform User**: Google renamed "Vertex AI User" to this. → *Now in* `image-generation/README.md`, `image-generation/vertex_generate.py`.
21. **Vertex model names differ.** `gemini-3-pro-image-preview` returns 404 on Vertex; `gemini-3-pro-image` and `gemini-2.5-flash-image` work on the `global` location. → *Now in* `image-generation/vertex_generate.py`.
22. **Gemini made scene errors**: a whole tractor inside a service van, a brand badge on a tractor, a 42-year-old who looked 60. → Generate 2 options per persona and look at every one before upload. Spell out what must not appear. → *Now in* `image-generation/README.md`.
23. **The user rejected a wide landscape shot because the face was too small.** → Persona photos are medium close-ups, waist up, face large, sharp, evenly lit, turned toward the camera, background soft. Set `imagePosition` on each persona so cards crop to the face. → *Now in* `image-generation/gemini-prompt-template.md`.

### Working style

24. **The user expects the whole build done end to end** (agent creation, memory, Lovable wiring, tests, images, commits) without handing steps back. Only ask for what truly needs a human: a missing credential, an IAM role, a sign-in. → *Now in* `SKILL.md` standing rules.
