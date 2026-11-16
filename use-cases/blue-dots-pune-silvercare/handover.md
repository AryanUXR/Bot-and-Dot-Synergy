# Blue Dots Pune · Silver economy (elder care): handover

**Built 16 Nov 2026.**

## Links
- **Bot:** https://saathi-seva-pune.lovable.app. Lovable project `3acb5e84-c0ac-4aa6-8066-ae8be6d2d38a`, remixed from Pet Saathi.
- **Map:** https://bluedotspuneeldercare.lovable.app. Lovable project `b79fc59c-d626-4896-9e12-e2c7a2b3ab4f`, remixed from the pet care map. It opens with no login.
- **Voice agent:** Saathi Seva Hinglish · Blue Dots Pune, Raya `95470a88-87a7-4520-bbad-cf02f737db7d`. Hindi language, female voice, 5-minute limit, memory on, nudge after 5 s of silence.

## Readiness
| Check | Status |
|---|---|
| Four audit checks (`scripts/audit.py`) | ✅ all pass: map data, persona text, prompt, published link |
| Test calls (`tests.md`) | ✅ Arjun, Vimal, Kavita (Vimal and Kavita after one prompt fix) |
| Persona photos | ✅ Gemini, checked by eye; saved in `images/` |
| Header | ✅ Blue Dots logo, blue gradient |
| Map colours | ✅ one blue for every pin and filter; sectors told apart by icon |

## Three-minute demo
1. Open the map. Point to Kothrud ("You": Arjun's mother's home), the attendant services and clinics nearby, and the white pins for families asking for care.
2. On the bot page, pick Arjun and take the call on speaker. Say his mother lives alone in Kothrud and needs someone for a few hours a day.
3. Saathi Seva names CareNest Home Attendants (1 km) and says their staff are background-checked. Ask the monthly cost: she won't give a number.
4. On the map, click CareNest: it's the same place she named.

## What's fictional
- Every name, listing and request is invented. The localities are real Pune areas.
- No phone numbers or addresses. The only numbers are the national helplines 112 and Elderline 14567.
- No health conditions appear in names or labels.

## Known limits
- The bot can't book, call or connect anyone, and can't vouch for staff. "Background-checked" is only said where a listing says so.
- Health and care is an area for exploration in the Blue Dots documents (KD p.20), not evidence.

## Data
`make_data.py` is the single source. It writes `careDots.ts` (the map) and `raya/directory.md` (the bot's directory).
