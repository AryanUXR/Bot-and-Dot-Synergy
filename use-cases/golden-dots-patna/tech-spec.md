# Tech spec: Golden Dots Patna (Sahayika)

| Capability | Needed for | Platform | Account / project | Credential location | Preflight |
|---|---|---|---|---|---|
| Outbound voice call through an API | the bot calls the visitor | Raya | EkStep Raya account; agent `5d13b69c-3c67-4136-aa8b-a3e98d63d618` | `raya/.env` (scripts); Lovable secret `RAYA_API_KEY` (website) | voice ✅ |
| Per-call persona variable | one agent, three stories | Raya `agent_args.persona` | same | none needed | ✅ |
| Agent-chosen hang-up | clean call endings | Raya keyword `Goodbye` | same | none needed | ✅ |
| Transcripts through an API | testing, fixing | Raya `GET /api/call` | same | `raya/.env` | ✅ |
| Voice and language: Hindi, female | Sahayika's voice | Raya B. Ananya (`bc303a66`), Hindi (`38695ff2`) | same | none needed | ✅ |
| Phone number for India | calling Indian numbers | Raya-provisioned outbound number | same | none needed | ✅ |
| Public web page + one server function | bot page, call trigger | Lovable + Lovable Cloud edge function | Lovable `168e5c3b-ee4b-49a7-b2c2-0d1fd6f37200` | Lovable Project Settings → Secrets | website-path test (Stage 6) |
| Map with custom markers | dot map | Google Maps (Advanced Markers), using the code's fallback key | Lovable `d19b8c1c-d650-4a77-a4f0-ce1c84830870` | none set in this project, so the fallback key is used | page load |
| Persona images | persona cards | Gemini via Vertex AI (`gemini-3-pro-image`) | EkStep Google Cloud project | `GOOGLE_SA_KEY` path in `raya/.env` | images ✅ |
| Tester | Stage 6 | EkStep tester agent `f60e0899` | shared tester (restore its persona afterwards) | none needed | ✅ |
| Git remote | prompts, data, lessons | GitHub `AryanUXR/Bot-and-Dot-Synergy` | | macOS keychain | git ✅ |

## Fallbacks
None needed: every capability is met by the tested EkStep stack.

If Google Maps breaks again (as on Red, after a restricted key was added as a secret), the fallback is the OpenStreetMap map in `starter/public/map.html` with the same `goldenDots.ts` data converted to `dots.json`.
