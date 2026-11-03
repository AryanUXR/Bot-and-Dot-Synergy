# Kisaan Saathi — Changelog

## 2026-11-03 — Fixes from bot-to-bot testing
- **Feedback/bug:** In three tester calls (Sunita, Ganesh, Rahul) the bot never hung up and looped goodbyes. It also said the closing line after every answer, guessed problems the caller had not stated, promised to pass a provider's details to farmers, wished a mechanic a good harvest, and offered a labour request to a mechanic.
- **Change:** Closing line now said once and ends with `Goodbye` so Raya hangs up. Asks "और किसी चीज़ की ज़रूरत है?" after each match. Separate provider close. No persona details before the caller states them, and open questions only. Never promise to pass details on. Providers only get Farmer Requests that match their service, with a worked example for Rahul.
- **Files:** KisaanSaathi Hindi.md (deployed via PATCH), KisaanSaathi Memory.md (memory enabled via PATCH)
- **Result:** Re-tests end cleanly in 63 to 125 s and fill every output field. Open: the bot still adds one guess ("हाइड्रोलिक") after its open question to Ganesh.

## 2026-11-03 — Agent created
- **Change:** Created agent 440e0bee-0500-4989-bfcc-5f459cda8a9e (Hindi, voice B. Arjun, 4 min limit) with conversation, output and memory prompts.
