# Choosing a stack

Users bring their own platforms. For each layer:
- **Must do:** what the method needs. A platform missing one of these needs a workaround, so say which one.
- **Tested default:** the platform the skill has been run end to end on. Its guide is in `setup-guides/`.
- **Alternatives:** platforms people commonly use for this layer. These are *not* tested with this skill. Check the platform's current docs against the "must do" list before committing.

Prices, free tiers and features change often. Never quote a price from memory: send the user to the platform's pricing page.

---

## 1. AI coding agent

**Must do:**
- read this repo;
- run shell commands, such as `curl` and `python3`;
- call the app builder, if it has an API or connector;
- edit files.

**Tested default:** Claude Code. The skill's instructions and tools assume it.

**Alternatives:** other agentic coding tools that can run shell commands and read files. Expect to translate tool names; the method itself carries over.

## 2. Voice agent platform (the bot)

**Must do:**
1. Create an agent with a system prompt in the target language, with a voice that matches the persona's gender.
2. Place an **outbound call** to a number given through an API, so the website can trigger a call.
3. Pass per-call variables into the prompt (`persona`), so one agent can play several stories.
4. End the call when the agent decides to, through a hang-up keyword or an end-call tool.
5. Return transcripts through an API, for testing and fixing from real calls.

**Nice to have:**
- structured output after the call (fields extracted from the transcript);
- memory across calls;
- a way to create a second "tester" agent that can phone the bot.

**Tested default:** Raya (LitWiz Labs). It does all of the above. The hang-up keyword is `Goodbye`. Guide: `setup-guides/raya.md`.

**Alternatives:** Vapi, Retell AI, Bland AI, Bolna, ElevenLabs Agents, or a custom stack on a telephony provider such as Exotel, Plivo or Twilio. Check against the list above, especially:
- Indian outbound numbers, if calling in India;
- the languages and voices offered;
- how a call is ended.

**What changes when you switch:**
- `shared/raya.md` and `bot/edge-function-template.ts` hold the Raya API calls. Write the equivalent for the new platform, and keep the same request shape from the website (`phone`, `countryCode`, `personaId`).
- The `Goodbye` rule becomes "whatever this platform uses to end a call".

## 3. App builder and hosting (bot page and map)

**Must do:**
1. Host a public web page with no login.
2. Run one small server function. It keeps the voice-platform key off the browser and places the call.
3. Store secrets for that function.
4. Let the agent change code reliably, through an API, a connector or a git repo the agent can push to.

**Tested default:** Lovable, with Lovable Cloud (Supabase) edge functions. Guide: `setup-guides/lovable.md`.

**Alternatives:**
- other AI app builders, such as Bolt or v0;
- Replit;
- plain code in a git repo, deployed to Vercel, Netlify or Cloudflare Pages, with a serverless function.

With plain code, the agent edits files directly, with no prompts to an app builder. That's often simpler and easier to review.

**What changes when you switch:** the Lovable-specific steps in `bot/SKILL.md` and `dot/SKILL.md`, such as remix and `send_message`. The components, data files and copy rules stay the same.

## 4. Map provider (the dot map)

**Must do:**
- custom markers with an icon and colour per sector;
- click a marker to open a card;
- fit the view to a set of points.

**Tested default:** Google Maps JavaScript API with Advanced Markers. Guide: `setup-guides/google-maps.md`.

**Alternatives:**
- Mapbox GL JS;
- MapLibre GL or Leaflet with OpenStreetMap tiles. These need no key, but read the tile provider's usage policy before any public launch.

**What changes when you switch:** `src/hooks/useGoogleMaps.ts` and the marker code in `LaunchPage.tsx`. The data shape, cards, filters and list view stay the same.

## 5. Image generation (persona photos)

**Must do:**
- produce photorealistic portraits;
- follow a detailed prompt, especially "face clearly visible, waist-up".

**Tested default:** Gemini image models through Vertex AI or Google AI Studio, called by `image-generation/vertex_generate.py`. Guide: `setup-guides/gemini-images.md`.

**Alternatives:**
- other image models with an API (OpenAI, Stability and others);
- the user's own photos, *with written consent from the people pictured*.

**Rule whatever you use:**
- Don't let the app builder invent images on its own; they come out generic and off-brief.
- Check every face before uploading.
- Never use photos of real people without consent.

## 6. Code storage (git)

**Must do:**
- keep the user's own copy of this skill;
- keep their prompts, data and lessons, so their next build starts where the last one ended.

**Tested default:** a private GitHub repository. Guide: `setup-guides/github.md`.

**Alternatives:** GitLab, Bitbucket, or any git host.

## 7. Database (optional)

Only needed if the bot should write callers onto the live map during calls. Hardcoded data is the default and is enough for a prototype.

**Tested default:** Supabase, which comes with Lovable Cloud. See `shared/async-sync-architecture.md`.
