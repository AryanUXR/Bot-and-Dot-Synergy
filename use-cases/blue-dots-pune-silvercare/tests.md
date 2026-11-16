# Saathi Seva: bot-to-bot tests (16 Nov 2026)

Tester: `Testing Agent- Blue Dots` (`f60e0899`) on 911204404272, borrowed from Pink Sakhi Inbound for each run and returned after.

| Persona file | Call | Result | Notes |
|---|---|---|---|
| `raya/personas/saathiseva-arjun-attendant.md` | `39c8be09`, 82 s | ✅ PASS | Asked where his mother lives, then measured from Kothrud. Named CareNest (1 km, background-checked staff) and Karve Nagar Care Agency (3 km). On trust: background-checked, but meet the agency yourself. No fee. One close. |
| `raya/personas/saathiseva-vimal-daycare.md` | `f6c2b7be`, 79 s | ❌ FAIL | Loneliness and a BP-medicine question came in one turn. It answered only the medicine (correctly, no advice), skipped Elderline, and said "a clinic nearby" without naming one. |
| `raya/personas/saathiseva-kavita-work.md` | `aae3ee83`, 102 s | ❌ FAIL | Asked for a day shift, it said there was nothing besides Nalini. It missed Leela (Aundh 4 km, daytime attendant). |
| `raya/personas/saathiseva-vimal-daycare.md` | `5a149485`, 98 s | ✅ PASS | After the fix: Sukhad (Aundh 1 km) and Pashan Golden Years (4 km); Elderline 14567 plus Baner Evening Companions for loneliness; no medicine advice, named Baner Family Clinic (4 km). |
| `raya/personas/saathiseva-kavita-work.md` | `1a128b81`, 103 s | ✅ PASS | After the fix: Nalini (Baner 1 km) and Ramesh (Balewadi 3 km); for a day shift Leela (Aundh 4 km). Her own row never offered. Her first reply came through as no audio, and the bot re-asked instead of going silent (the 5 s nudge working). |
