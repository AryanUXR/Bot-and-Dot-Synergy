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

37. **(Corrected 12 Nov: the map base has a stored key and needs no secret; see `dot/SKILL.md` Step 1.) A remixed map loses `GOOGLE_MAPS_API_KEY` too, just as a bot loses `RAYA_API_KEY`.** The remix of the Pink map answered "GOOGLE_MAPS_API_KEY not configured". → Straight after the remix, curl `get-google-maps-key` with the publishable key from the project's `.env` and print only whether `apiKey` is present, never the value. If it is missing, ask the user to add it in Project Settings → Secrets right then, and carry on with the data while they do. → *Now in* `dot/SKILL.md` Step 1.
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

## 2026-11-12 · Opening the skill to everyone (bring your own platform)

52. **The skill was written for one person's accounts.** It hard-coded EkStep's workspace, keys, tester number, local paths and "Google Maps only". Nobody outside the team could run it, and the keys must not be shared anyway. → Added `onboarding/`: route by role, choose a stack against capability lists, set up *your own* accounts with per-platform guides, check them with `scripts/preflight.py` (never prints a secret), and write a git-ignored `config/local.json`. EkStep values in the docs are now examples. Research behind it: `research/who-uses-this-skill.md`.
53. **Never ask for a key in chat.** Users type secrets into `raya/.env` or the platform's secret store, and the agent checks them with a call that prints only OK or FAIL.

## 2026-11-12 · Building without Lovable, Raya, Google Maps or Gemini

54. **The method must not depend on any one platform.** → `starter/`: plain HTML bot page and map, Leaflet with OpenStreetMap (no key), and one web-standard call function with an adapter per voice platform. Raya is tested; Vapi, Retell and Bland are written but untested. Proven 12 Nov 2026 with a real 202-second call placed through `node starter/dev-server.mjs`. → *Now in* `FLOW.md` stage 5, `onboarding/stack-options.md`.
55. **Every build follows seven stages, each with a gate:** understand → tech spec → fallbacks → QC → template UI → test calls → handover. → *Now in* `FLOW.md`, `onboarding/fallbacks.md`, `onboarding/handover-template.md`, `starter/UI-SPEC.md`.
56. **Automate the rules check.** `scripts/qc_check.py` found Kisaan Saathi still had the "calls must end by 3 minutes" rule that had broken Sakhi, and on the old Pink data it flags every issue the manual audit found. Run it before every handover.
57. **Calls to a tester agent sometimes fail to connect** (outcome Failure, 0 s). Retry once before treating it as a bug.

58. **Use the stored Maps key, don't ask for one.** The map bases fall back to a key built into `useGoogleMaps.ts` when no secret is set. Golden Dots rendered on it with no secret. Red Dots broke only because a restricted key was added as a secret, which overrides the stored one. → *Now in* `dot/SKILL.md` Step 1.

## 2026-11-12 · Golden, Purple and White Dots

59. **Persona cards stopped at different heights.** The card animated `y` with framer-motion while Tailwind `transition-all` and `hover:-translate-y-3` also moved it, so cards froze part-way (Ravi on Golden; Aman and Rakesh on White). → Opacity-only entrance, a framer hover lift, `h-full flex flex-col` for equal heights. → *Now in* `starter/UI-SPEC.md`.
60. **One label style for every card.** Coloured label text fails contrast for yellow and gold, and a one-off dark chip for those two made the row look broken. → Every label is a pale chip of the persona colour with dark text and a colour dot. → *Now in* `starter/UI-SPEC.md`.
61. **Bots copy examples to the wrong place.** Sahayika moved a Phulwari example to Patna City; Parivar Saathi gave places "1 km" that were 7 and 11 km away and invented "safe travel arranged". → Each prompt now says to read each row's own area and distance, never add features not in the row's offers, and use examples only for their own area or section, with a wrong/right pair. → *Now in* `bot/prompt-anatomy.md` must-have 12.
62. **Name an amount and the bot will invent one.** Sahayika said a card takes "a few weeks" and costs "up to ₹100". → Give a spoken line for fees, salaries and times with no number in it.
63. **Fixing one bot leaves the rest inconsistent.** The card fix went to White and Golden only. An audit then found five more bots with the old moving cards, unequal heights, coloured-text labels, mixed headers, and surnames and home states still in persona text. → `scripts/ui_check.py` compares every prototype with a finished one, and `scripts/card_alignment.js` measures the real page. Both are now a gate in FLOW Stage 5. When a UI fix lands on one prototype, run the check on all of them and send the same fix everywhere.
64. **A Lovable upload works once.** One uploaded `file_id` sent to six projects reached only the first; the other five said "no attachment" and kept the old logo. → Get a fresh upload URL for every project you send a file to.
65. **Lovable turns an uploaded logo into the favicon on its own.** Three bots replaced their tab icon with the logo, unasked. → When sending a brand file, say "keep the favicon as it is".
66. **The audit missed the bot pages.** QC scanned the map data and the prompt, but not the persona text on the bot page. That's how Pink's home states, surnames and "husband" stayed live, and how Red's cards showed full surnames. → `scripts/audit.py` runs the four audit checks across map data, persona text and prompt. It also opens the published map link with no login, because Lovable's preview links always need one. → *Now a gate in* `SKILL.md` and FLOW Stage 4.
67. **Where someone lives is not where they come from.** Cleaning Purple, I moved Deepak from Basti to Lucknow. That broke the story: the voice agent has Basti services built in for him, and the map has Basti dots. → Remove the state of origin for migrants ("from Gumla, Jharkhand") and every marital detail ("family member" instead of wife or husband). Keep where the persona lives. Before changing a persona's location, check the prompt and the map.
68. **Setting `in_did` moves calls only on a routed number.** On Raya, `PATCH {"in_did": …}` succeeds for any number, but calls arrive only if LitWiz has routed that number to Raya's inbound side. `917946350283` was accepted, yet calls died in 3 s with no agent logging them. `911204404272` followed `in_did` to a new agent and back within a minute. → After any number change, place one real call and check the *receiving* agent's call log. To test an inbound bot, use a throwaway caller agent (`POST /api/agent`, `say_hello: false`) and delete it after. Tell the caller persona plainly that it is the caller: an LLM caller greeted as the helpline.
69. **Raya's call memory follows the phone number, not the bot.** A new Sakhi Inbound agent received another bot's summary ("child care in Dadar") for a caller ID that 17 bots share. A real person who has called two EkStep lines can get the same mix-up. → Never let a bot say an earlier call back to the caller ("last time you asked…") unless the memory clearly comes from the same service. Test bots should not share caller IDs if memory is on.
70. **The schema comes before the dots.** The prototypes invented their fields and sectors per build, so none of them matched the schema a real network would use. → Stage 1 now runs schema-mapper (`shared/schema-mapper.md`) on the approved brief and personas. Its need list becomes the map's filters, and its fields become what the dots carry and the bot asks. The first trial (White Dots) filled 4 of 10 framing answers from the brief alone, and flagged that nine needs are too many for phase 1.
71. **Fixed page breaks go stale.** A page break that kept one table whole on 15 Nov left a half-blank page as soon as a row was added elsewhere. The empty paragraph Docs keeps after a final table also spilled onto a blank last page once it was given paragraph spacing. → Keep headings with the next paragraph and stop table rows splitting, not fixed breaks. Give the trailing empty paragraph no space. Export and check every page after each change.

## 2026-11-16 · Counsel and collateral

72. **Not every idea is a Blue Dots use case.** A one-sided information bot or a national online marketplace fails the approach before a line is built. → `counsel/SKILL.md` answers questions only from EkStep's two documents, with page citations, and runs a nine-point fit check before Stage 1. "Not a fit yet" stops the build. → *Now in* FLOW Stage 1 step 0 and the onboarding routes.
73. **Filling a template deck: keep its own paragraph structure.** The Google-Slides-exported template draws lines as `<a:br>` inside one paragraph and spaces blocks with empty paragraphs. Replacing paragraph by paragraph dropped subtitle styles and overlapped dividers. Pictures and their captions are separate shapes, so pairing them by id swapped the captions. A pale Dots colour (White) vanished as highlight text on white slides. → `ekstep/collateral/build_deck.py` keeps spacer paragraphs and breaks, pairs pictures and captions by position, and takes an `ink` colour for white slides.
74. **Screenshots of a Lovable site carry the "Edit with Lovable" badge.** → Crop the bottom-right (`ekstep/collateral/tools/crop.swift`) and look at the image before using it.
75. **Keynote export hangs on a large .pptx opened over AppleScript.** The open call times out after two minutes while Keynote is still importing. → `tools/qa.sh` opens the file with `open -a`, polls until the document exists, then exports. Render every slide and look at it: the generator's warnings don't catch wrapped text.

## 2026-11-16 · Blue Dots Pune pet care (demo build)

76. **A bot serving both sides can pass a provider off as a request.** Asked about weekend work for a caretaker, Pet Saathi offered a mobile vet as "needing weekend help". It had filled the second slot from the wrong section. → When a provider is looking for clients, only rows under "Requests" are people who need help. If only one fits, name just one and say so. The closing line shouldn't assume the caller has the need (a caretaker has no pet).
77. **Generate the bot's directory and the map data from one source.** `use-cases/blue-dots-pune-petcare/make_data.py` writes both `petDots.ts` and `raya/directory.md`, with each row's distance from every persona's area. All three tests used the right distances first time. Attach the data file to the Lovable message instead of pasting it, so nothing is retyped.
78. **Check a long Lovable message before sending.** A message went out with a placeholder where the personas file should have been. Lovable spotted it and skipped that step, but don't rely on that.
79. **A lost first reply turns into a dropped call.** On a real call, Pet Saathi greeted, the caller replied, but the reply never reached the transcript. The bot waited, the line went dead silent, and the caller hung up after about 5 seconds. Every agent had `allowed_silence_before_nudge` at 20 s, far longer than anyone waits on a silent phone. → Set it to about 5 s, and give the prompt a re-ask line for silence or a nudge ("sorry, your voice didn't come through, please say it again"). To diagnose a drop: download the recording, plot loudness per quarter-second, and look for speech that never reached the transcript followed by digital silence (that's the caller hanging up).
