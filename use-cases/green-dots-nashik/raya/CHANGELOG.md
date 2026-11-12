# Kisaan Saathi — Changelog

## 2026-11-03 — Fixes from bot-to-bot testing
- **Feedback/bug:** In three tester calls (Sunita, Ganesh, Rahul) the bot never hung up and looped goodbyes. It also said the closing line after every answer, guessed problems the caller had not stated, promised to pass a provider's details to farmers, wished a mechanic a good harvest, and offered a labour request to a mechanic.
- **Change:** Closing line now said once and ends with `Goodbye` so Raya hangs up. Asks "और किसी चीज़ की ज़रूरत है?" after each match. Separate provider close. No persona details before the caller states them, and open questions only. Never promise to pass details on. Providers only get Farmer Requests that match their service, with a worked example for Rahul.
- **Files:** KisaanSaathi Hindi.md (deployed via PATCH), KisaanSaathi Memory.md (memory enabled via PATCH)
- **Result:** Re-tests end cleanly in 63 to 125 s and fill every output field. Open: the bot still adds one guess ("हाइड्रोलिक") after its open question to Ganesh.

## 2026-11-03 — Agent created
- **Change:** Created agent 440e0bee-0500-4989-bfcc-5f459cda8a9e (Hindi, voice B. Arjun, 4 min limit) with conversation, output and memory prompts.

## 2026-11-11 — Fictional directory
- **Feedback/bug:** Audit: all prototype data must be dummy. The directory listed real market yards, dealers, banks and research stations, and fictional experts had realistic phone numbers.
- **Change:** Every row renamed to a fictional name; people are first name + initial; contact column "-"; brand names removed from offers; worked example now uses जौळके ट्रैक्टर वर्क्स and संदीप जी.
- **Files:** KisaanSaathi Hindi.md. Retested: ganesh-tractor, Completed 133 s, one Goodbye.

## 2026-11-12 — Remove the time limit (found by qc_check.py)
- **Feedback/bug:** Same rule that made Sakhi hang up early: "Calls must end by 3 minutes."
- **Change:** Replaced it with "no time-based closing; answering is never closing". Raised `max_call_duration_mins` to 5.
- **Files:** KisaanSaathi Hindi.md. Snapshot in versions/KisaanSaathi/pre-time-limit.
