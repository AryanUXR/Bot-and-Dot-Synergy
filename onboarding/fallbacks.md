# Fallbacks when a capability or API is missing

Use these in Stage 3 of `FLOW.md`. Each fallback says what changes for the visitor or the demo audience. Tell the user that plainly, and get their agreement when it changes the demo.

## Voice

| Missing | Fallback | What changes |
|---|---|---|
| **Outbound calls through an API** (the platform only takes incoming calls) | Publish the bot's **inbound number** on the page as "Call this number and say you're <persona>". The persona is chosen by what the caller says, or by a short menu at the start of the call. | The visitor dials instead of being called. Persona selection is less reliable, so add a line to the prompt asking which story they're playing. |
| **A phone number in the target country** | (a) a **web call** button, if the platform offers in-browser calling; or (b) a number in a nearby country, if the platform allows it and the cost is acceptable. | (a) Needs a microphone and a good connection, not a phone. (b) The caller sees a foreign number and may not pick up, so say so on the page. |
| **Per-call variables** (`persona`) | One agent per persona, each with its own prompt. The call function picks the agent ID by persona. | More agents to maintain. Prompt fixes must be copied to every one of them. |
| **Agent-chosen hang-up** (no keyword, no end-call tool) | Set a short maximum call length on the platform, and have the closing line tell the caller they can hang up now. | Calls may end on the time limit. Keep the limit generous: 5 minutes or more. |
| **Transcripts through an API** | Download transcripts from the platform's dashboard after each test. | Testing and fixing are manual and slower. |
| **A language or voice** (the language isn't offered) | The nearest language the persona would plausibly speak (for example Hindi for migrant workers in Tamil Nadu), or English with local words. | Note it in the handover. Ask the programme lead whether that's acceptable. |
| **A second agent for bot-to-bot tests** | Test from your own phone with the persona scripts in `raya/personas/` as a guide. | Slower, and each change needs a manual call. Test fewer personas per round. |
| **Any voice platform at all** (no account yet) | Build the bot page and map anyway. The Call button shows "Calls are being set up" (set `VOICE_PLATFORM=none`). | The demo shows the journey and the map, but no live call. |

## Web page and hosting

| Missing | Fallback | What changes |
|---|---|---|
| **An app builder** (Lovable, Bolt or similar) | `starter/`: plain HTML with no build step, deployable to Vercel, Netlify or Cloudflare Pages, and runnable locally with `node starter/dev-server.mjs`. | Nothing for the visitor. Edits happen in files, not in a builder's chat. |
| **A server function** (static hosting only) | Host the call function separately (a free serverless function on another host) and point the page's `fetch` at that URL. Or use the inbound-number fallback. | One more place to deploy. |
| **A secret store** | Use the host's environment variables. Never put a key in page code. | None. |

## Map

| Missing | Fallback | What changes |
|---|---|---|
| **A Google Maps key, or billing** | Leaflet or MapLibre with OpenStreetMap tiles. This is what `starter/public/map.html` uses, with no key. | Different base-map look. For a public launch, read the OpenStreetMap tile usage policy or use a hosted tile provider. |
| **Reliable map loading on slow phones** | The **List** view (already in the template) as the first screen on mobile. | Visitors see a list first and can switch to the map. |

## Images

| Missing | Fallback | What changes |
|---|---|---|
| **An image model** | Initials on the persona's colour. `starter/` does this when `photo` is empty. Or illustrated avatars made by hand. | Less personal. Make the traits and story stronger to make up for it. |
| **Consent for real photos** | Never use photos of real people without written consent. Use initials or generated images instead. | None. |

## Data

| Missing | Fallback | What changes |
|---|---|---|
| **Local research** (no time, or no public sources) | Build fictional dots from the shape of the place: neighbourhoods from the map, typical service types, and plausible distances. Never real names. | Fine for a prototype. Mark it as sample data, as the template already does. |
