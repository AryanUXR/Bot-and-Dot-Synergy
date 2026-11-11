# Sakhi — Changelog

## 2026-11-04 — Fixes from bot-to-bot testing
- **Feedback/bug:** Round 1 (all three calls ended cleanly with one Goodbye): the creche example lacked the "not checked" sentence, so Sasmita's creches were not flagged. The bot guessed Sasmita's area and child's age. Meena was offered a woman needing a room. Later rounds: Meena's call closed in the same turn as the match.
- **Change:** "Not checked" sentence required in every turn naming a hostel or day-care, and added to the creche example. Concrete open-question example for Phase 2. Women Requests split into "need child care" and "need a room or a job" lists, provider uses only the first. Every worked example ends with "और किसी चीज़ की ज़रूरत है?". Never close in the same turn as a match.
- **Files:** Sakhi Hindi.md (deployed via PATCH)
- **Result:** Rinki, Sasmita and Meena all pass (112-118 s, one Goodbye each).

## 2026-11-04 — Agent created
- **Change:** Created agent ef1d518e-5347-47fd-8987-b9ad90194667 (Hindi, voice B. Ananya, female, 4 min limit) with conversation, output (12 fields incl. safety checks) and memory prompts.

## 2026-11-11 — Stop closing calls early
- **Feedback/bug:** The team said calls end abruptly. In their 10–11 Nov calls Sakhi said Goodbye straight after answering a question: a Google Maps link request (seeker) and "how will I show on the map" (provider, whose answer matched the closing line). The prompt also said "Calls must end by 3 minutes", which the bot cannot measure.
- **Change:** Answering a question is never closing; every answer, including "I can't send a link", ends with "और किसी चीज़ की ज़रूरत है?". Two worked examples (map link, provider map question). Unclear or recorded-message replies get one simpler re-ask. Removed the 3-minute rule. Raised `max_call_duration_mins` from 4 to 5.
- **Files:** Sakhi Hindi.md (Phase 3, Phase 4, Prohibited); agent setting via PATCH. Snapshot in versions/Sakhi/pre-abrupt-close.

## 2026-11-11 — No timelines; "anything else?" only after answers
- **Feedback/bug:** Bot-to-bot retest: told a provider her listing would show "in one or two days" (invented), and once tacked "anything else?" onto its own question.
- **Change:** One rule plus a spoken fallback line: never give times or day counts; add "anything else?" only after an answer.
- **Files:** Sakhi Hindi.md (Phase 3).

## 2026-11-11 — Fictional directory
- **Feedback/bug:** Audit: all prototype data must be dummy. The directory listed real hostels, creches, employers and offices.
- **Change:** Every directory row renamed to a fictional, neutral name; contact column "-" except 181; worked examples now use इनिया / सुदर hostels and सनी डेज़ / लिटिल स्टेप्स day care; state-of-origin labels removed from women's requests and the opening description.
- **Files:** Sakhi Hindi.md. Retested: rinki-hostel, Completed 147 s, one Goodbye.
