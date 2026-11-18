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

## 2026-11-14: Inbound agent created
- **Request:** Aryan: an inbound Sakhi for Pink Dots, on a temporary number that can be restored.
- **Change:** new agent `Sakhi Hindi Inbound · Pink Dots Tiruppur` (`d37ecf8d`). Its prompt is a copy of `Sakhi Hindi.md` with four changes:
  1. an answering greeting;
  2. works out the caller's role (seeker or provider) instead of reading `${persona}`;
  3. `${contact_phone}` and `${country_code}` as reference-only inputs;
  4. "Who may call" replaces the persona notes, and also drops the surnames and home districts.
  Directory row "Meena Devi" became "Meena D.". Same voice, language, timing, memory and output fields as outbound, except the output field `persona` became `story`.
- **Number:** none yet. 917946350283 (borrowed from the Purple tester) did not route and was returned. The tester number 911204404272 routed, passed call `d76a20ee` (133 s), and was returned and re-checked. See `INBOUND-NUMBER.md`.
- **Files:** `Sakhi Inbound Hindi.md`, `Sakhi Inbound Output.md`, `Sakhi Inbound Memory.md`, `INBOUND-NUMBER.md`, `raya/agents.json`, `raya/personas/sakhi-inbound-rinki-hostel.md`, `scripts/raya_did.py`.

## 2026-11-14 (later): Number lent; greeting no longer uses memory
- **Number:** at Aryan's request, 911204404272 was lent from the Blue Dots tester (`f60e0899`). Check call answered by Sakhi. The return command is in `INBOUND-NUMBER.md`.
- **Fix:** a check call greeted with "last time you asked about child care", but that memory came from another bot's call with the same shared caller ID. Removed the optional earlier-need mention from Phase 1. Memory is now used only if it clearly describes an earlier Pink Dots call. Redeployed; the next call greeted cleanly.
- 18 Nov 2026: moved to its own number 918040837122 (allotted to Pink Dots). Test call 93fded49 passed. 911204404272 returned to the tester (check call 20f9aa24 reached it).
