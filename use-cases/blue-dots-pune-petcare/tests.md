# Pet Saathi: bot-to-bot tests (16 Nov 2026)

Tester: `Testing Agent- Blue Dots` (`f60e0899`) on 911204404272. The number was borrowed back from Pink Sakhi Inbound for the run, then returned.

| Persona file | Call | Result | Notes |
|---|---|---|---|
| `raya/personas/petsaathi-rohan-vet.md` | `9b616b5b`, 81 s | ✅ PASS | Paws & Care (Kothrud 1 km, open Sundays) and Bavdhan Mobile Vet (4 km). No medicine, no fee. One close. |
| `raya/personas/petsaathi-meera-sitter.md` | `9ad95fb4`, 78 s | ✅ PASS | Pashan Pet Sitters Circle and Whiskers Cat Hostel (both 4 km from Baner). Can't book; points to the map. Baner Pet Supplies (1 km) for food and litter. The first try dropped at 2 s (tester flake, lesson 57); the retry passed. |
| `raya/personas/petsaathi-anjali-clients.md` | `91c5f175`, 82 s | ❌ FAIL | Asked about weekend work, it offered Bavdhan Mobile Vet as "needing help". Prompt fixed (only Requests rows need help; name one if only one fits). |
| `raya/personas/petsaathi-anjali-clients.md` | `e18f7d72`, 80 s | ✅ PASS | Kavya (Aundh 1 km) and Nikhil (Baner 4 km). For weekends it names only Nikhil. Her own row is never offered. One close. |
