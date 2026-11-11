# Lessons Log

Read this before every build. Each entry is a mistake that cost time on a real project, the fix, and where the fix now lives in the skill docs. When a build hits something new, add an entry here **and** fix the doc that was wrong, then push both.

Format: **What happened** → **Fix** → *Now in*

---

## 2026-11-03 · Green Dots Nashik (Kisaan Saathi, Hindi, agriculture)

### Lovable

1. **The bot base in SKILL.md could not be remixed.** Siza (`2937b9e5…`) returned "remix blocked", then "source project's Lovable Cloud database isn't available". Tourist Saarthi (`8fd0d5fd…`) failed the same way. → Remixed `d816ead9-ef48-4fb9-8af2-26ae06bc157a` (Blue Dots SA NLC, single-persona base), which worked first time. → *Now in* `SKILL.md` reference IDs, `bot/SKILL.md` Step 1.
2. **The new base differs from the documented one.** No Hero section on the page (PersonasSection carries the heading), `questions.english` key hard-coded in PersonaModal and CallForm, "Questions she might ask" hard-coded, CallForm had a hard-coded agentId, outDid logic in the edge function. → Read every file listed in `bot/SKILL.md` Step 2 and also `PersonaModal.tsx`, `PersonaCard.tsx`, `Footer.tsx`, `index.html`, `src/index.css` before prompting. → *Now in* `bot/SKILL.md` Step 2.
3. **`send_message` and `list_messages` results are often too large to return.** → Read the saved output with `jq -r '.status, .commit_sha, .cost_credits'` and `jq -r '.content' | tail -c 1500`. If a call times out, `list_messages` (limit 2) then jq. → *Now in* `bot/SKILL.md` Step 3.
4. **Lovable cannot open its secure secrets form from MCP.** It asks the user to type secrets in Project Settings. → The Raya agent ID is not secret: put it in the edge function as the fallback (`Deno.env.get('RAYA_AGENT_ID_X') ?? '<uuid>'`). Only `RAYA_API_KEY` must be a secret. **Correction (2026-11-04): remixes keep the secret's name but not necessarily a working value.** Lovable's "the check passed" only meant the secret existed. See lesson 34. → *Now in* `bot/edge-function-template.ts`, `shared/raya.md`.
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

## 2026-11-04 · Pink Dots Tiruppur (Sakhi, Hindi, women workers: hostels and child care)

The Nashik lessons paid off: the Raya agent, memory, Lovable wiring, photos and bot-to-bot tests all ran without asking the user for anything except the brief and persona approval. First-round calls all ended cleanly with one `Goodbye`.

### Speed

25. **Remix from the latest finished project, not the original base.** Copying last week's finished map and bot meant the seeker cards, Hindi questions, `imagePosition`, agent-ID fallback and Goodbye close were already in place. The bot took 2 Lovable messages instead of 4, and the map took 1 instead of 3. → *Now in* `SKILL.md` reference IDs (use "Latest finished" rows as bases).
26. **Run research, photos and Lovable work in parallel.** Start the research agent as soon as the geography is set. Write the brief and personas while it runs, then generate photos and send bot sections while waiting for approval or research.
27. **Attach large data files to `send_message` instead of pasting them.** Upload the merged dots file with `get_file_upload_url` + PUT (text/plain) and tell Lovable to copy it byte for byte. This keeps the message small and the data exact.

### Lovable

28. **Never ask Lovable to delete assets a remixed project inherited.** `lovable-assets delete` on the copied placeholders could break the source project's photos if the files are shared. They were not shared this time (each asset is keyed to its project), but there's no need to take the risk. Leave old assets in place. → *Now in* `image-generation/README.md`.

### Copy

29. **The nav tagline must say what the bot does, not what it provides.** "Work, a room and child care near you" read as if Sakhi gives women jobs and rooms. Use "Helps you find hostels, child care and jobs in Tiruppur". This matters more when listings are unverified. → *Now in* `content/anti-slop-rules.md`.

### Raya prompts

30. **Every worked example in the prompt must follow every rule.** The creche example left out the "not checked" sentence, and the bot copied the example instead of the rule. Check examples against the safety rules before deploying. It happened twice in this build: the provider example also left out the "anything else?" question, so the bot closed in the same turn as the match until every example ended with it. → *Now in* `bot/prompt-anatomy.md`.
31. **Tag seeker rows in the directory with what they need** (`| NEEDS: CRECHE`, `HOSTEL`, `JOB`). Without a tag, the bot offered a woman who needed a room to a day-care provider. Tags alone were not enough when the wrong row was closer. What worked was splitting Women Requests into separate lists by need, and telling the provider persona to use only its list. → *Now in* `bot/prompt-anatomy.md`.
32. **Output fields can grade safety for you.** Add a field such as `unverified_flagged` so `call_output` shows when a safety rule was skipped. It caught the same miss as the transcript review.
33. **Persona leaks still happen.** The bot guessed the area and the child's age. The fix is a concrete open-question example in Phase 2 that asks for exactly those facts.

### Testing the website path

34. **Bot-to-bot tests never touched the website's call function, so a broken `RAYA_API_KEY` secret went unnoticed until the user pressed Call.** Our tests call Raya directly with the local key. The site goes through the Lovable edge function, which had an invalid key in both remixed bots. → After deploying the edge function, call it once yourself, aimed at the tester agent's number so no human phone rings:
    ```bash
    curl -s https://<supabase-ref>.supabase.co/functions/v1/initiate-call -H "Content-Type: application/json" -H "apikey: <publishable key>" -H "Authorization: Bearer <publishable key>" -d '{"phone":"1204404272","countryCode":"+91","personaId":"<persona-id>"}'
    ```
    The Supabase ref and publishable key are in the Lovable project's `.env`. A 401 "Invalid API key" means the user must re-enter `RAYA_API_KEY` in Lovable → Cloud → Secrets (Lovable cannot open that form over MCP). Ask for it at the start of the build, not at the end. → *Now in* `bot/SKILL.md` Step 6, `shared/raya.md`.
35. **A copied Lovable project does not reliably bring a working `RAYA_API_KEY`.** Tested 2026-11-04: a fresh copy of Sakhi (whose key worked) had no key at all, and the earlier copies had a stale one. Lovable cannot set or overwrite secrets over MCP. → Each new bot needs the key typed in by the user once, under **Project Settings → Secrets** (not the Cloud tab). Ask for it at the start of the build, then test the call path with the curl in lesson 34.
36. **Never move a working site onto a new dependency before that dependency is proven.** I switched Kisaan Saathi to the shared call relay before the relay had a key, so the key the user then entered in Kisaan Saathi had no effect and the site stayed broken. → Build and test the new piece end to end first, then switch one site and test that, and keep the old path until both pass. The shared relay was dropped on 2026-11-05: every bot calls Raya directly with its own `RAYA_API_KEY` secret (lesson 35). Do not rebuild a relay.

## 2026-11-06 · Red Dots Guwahati (map only; Aryan built the Sahai Line bot himself)

37. **A remixed map loses `GOOGLE_MAPS_API_KEY` too, just as a bot loses `RAYA_API_KEY`.** The remix of the Pink map answered "GOOGLE_MAPS_API_KEY not configured". → Straight after the remix, curl `get-google-maps-key` with the publishable key from the project's `.env` and print only whether `apiKey` is present, never the value. If it is missing, ask the user to add it in Project Settings → Secrets right then, and carry on with the data while they do. → *Now in* `dot/SKILL.md` Step 1.
38. **When the user has built the bot, its `src/data/personas.ts` is the brief.** Sahai Line's personas named the places (Gorchuk, Boko, Jorabat, Ulubari, Maligaon), the providers each story needs, and the schemes. Seed the research agent with those stories so every persona has a dot that answers it, and pick the map's "You" persona from them. → *Now in* `dot/SKILL.md` Step 0.
39. **Research is thin for informal services, so say so on the map.** No towing operator, late-night bike garage or Boko truck-tyre shop could be confirmed. Fill those gaps with fictional rows marked `verified: "Unverified"`, with no phone number and "Example listing for this prototype" in the description, rather than inventing numbers. Don't label any hospital "cashless" without an official list; use police rows' 112 instead of officer mobiles, which rotate.
40. **A map that spans a city and a highway 50 km out opens unreadably zoomed out.** → Fit the opening bounds to dots within 25 km of the "You" marker and leave far dots on the map for panning.
41. **Lovable may move colours into CSS variables.** `stroke="var(--x)"` in SVG attributes and marker HTML strings does not resolve reliably (Safari). → Ask for literal hex in JS colour constants and marker HTML; CSS tokens can stay in `index.css`.

## 2026-11-07 · Orange Dots Udupi (call-only page, agent built by Aryan)

42. **A call-only bot page is the latest bot with the personas taken out.** Copy the latest finished bot, remove the personas section and dropdown, and send only `{ phone, countryCode }`. Before deciding what goes in `agent_args`, GET the agent and list the `${...}` variables in its instructions. This agent used only `${contact_memory}`, so it needed none.
43. **A copied bot can pop up a secrets form for names from an older base** (`RAYA_AGENT_ID_MALA`, `RAYA_AGENT_ID_SIZA`, `RAYA_UPDATE_ACCESS_TOKEN`). Only `RAYA_API_KEY` matters. Tell the user which one to fill so they don't fill four.
44. **Python `urllib` gets 403 from Raya's agent list here; curl works with the same key.** Raya likely blocks the default Python User-Agent. Use curl, or set a User-Agent header.

## 2026-11-11 · Sakhi "ends abruptly" (team feedback)

45. **Never put a time limit the bot has to measure in the prompt.** "Calls must end by 3 minutes" made Sakhi close at about 2 minutes, in the middle of a caller's questions. The bot can't see a clock. → Leave time to `max_call_duration_mins` and its exceed message; in the prompt, only ask for short answers. → *Now in* `bot/prompt-anatomy.md` must-have 11.
46. **Answering a question is not closing, especially when the answer sounds like the closing line.** The provider closing line was "your day-care will show on the map…", so when a provider asked "how will I show on the map?" the bot answered with the closing line and hung up. It also closed after "I can't send a link". → Every answer, including a "can't do that", ends with the "anything else?" line, and each case gets a worked example. → *Now in* `bot/prompt-anatomy.md` must-have 2.
47. **Read the team's real calls before testing.** `GET /api/call?agent_id=…` lists them; the transcript is in `call_transcript`, not `transcript`. Then write tester personas that replay what real callers did (several follow-up questions, out-of-scope asks) — our original personas asked one thing and said goodbye, so they never hit this bug.

## 2026-11-11 · Audit of this chat's prototypes (dot types, no login, dummy data, sensitive terms)

48. **Every prototype ships fictional sample data.** Green, Pink and Red maps carried 102 real organisations from research, with real addresses and phone numbers, and the Sakhi and Kisaan Saathi prompts read the same names aloud. → Use research only to make the data realistic: invent neutral names (no deity names, no surnames, no community markers), drop addresses, and drop every phone number except national helplines (108, 112, 181, 1098, 1033, 1077). Government service types can keep generic names ("District Social Welfare Office") with no contact details. `scripts/make_dummy_dots.py` does the conversion from a rename map. → *Now in* `SKILL.md` rule 11, `content/dot-data-guide.md`.
49. **Fictional people: first name and initial only.** No surnames (they signal caste or community), no state of origin ("from Bihar"), no marital status. I named three placeholder businesses after surnames, one of them a community name; use place names for businesses.
50. **Keep disclaimers in the UI, not in the data.** My generated descriptions ended with "Sample listing for this prototype." and the card then added the same line, so cards said it twice. Lovable caught it. → Data rows describe the place; the card shows the sample note.
51. **Change bot and map data together.** When dot names change, update the bot prompt's directory rows *and* its worked examples (they are in Hindi script, so a plain name replace misses them), redeploy, and run one test call per bot.
