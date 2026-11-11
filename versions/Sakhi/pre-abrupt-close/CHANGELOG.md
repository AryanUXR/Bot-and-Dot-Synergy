# Sakhi — Changelog

## 2026-11-04 — Fixes from bot-to-bot testing
- **Feedback/bug:** Round 1 (all three calls ended cleanly with one Goodbye): the creche example lacked the "not checked" sentence, so Sasmita's creches were not flagged. The bot guessed Sasmita's area and child's age. Meena was offered a woman needing a room. Later rounds: Meena's call closed in the same turn as the match.
- **Change:** "Not checked" sentence required in every turn naming a hostel or day-care, and added to the creche example. Concrete open-question example for Phase 2. Women Requests split into "need child care" and "need a room or a job" lists, provider uses only the first. Every worked example ends with "और किसी चीज़ की ज़रूरत है?". Never close in the same turn as a match.
- **Files:** Sakhi Hindi.md (deployed via PATCH)
- **Result:** Rinki, Sasmita and Meena all pass (112-118 s, one Goodbye each).

## 2026-11-04 — Agent created
- **Change:** Created agent ef1d518e-5347-47fd-8987-b9ad90194667 (Hindi, voice B. Ananya, female, 4 min limit) with conversation, output (12 fields incl. safety checks) and memory prompts.
