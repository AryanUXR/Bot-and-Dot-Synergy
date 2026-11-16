# Blue Dots Pune · Pet care: handover

**Built 16 Nov 2026** for the team demo of the onboarding flow (`ekstep/demo/onboarding-demo.md`).

## Links
- **Bot:** https://pet-saathi-pune.lovable.app. Lovable project `2ff86ee9-33a9-46e8-a911-c5b915608b25`, remixed from Parivar Saathi.
- **Map:** https://bluedotspunepetcare.lovable.app. Lovable project `2667bede-b7fc-4789-bbd8-564746797c04`, remixed from White Dots Lucknow. It opens with no login.
- **Voice agent:** Pet Saathi Hinglish · Blue Dots Pune, Raya `a32be3aa-29f3-4e7d-9959-5d7e74dd5ec4`. Hindi language, female voice, 5-minute limit, memory on.

## Readiness
| Check | Status |
|---|---|
| Four audit checks (`scripts/audit.py`) | ✅ all pass: map data, persona text, prompt, published link |
| Test calls (`tests.md`) | ✅ Rohan, Meera, Anjali |
| Persona photos | ✅ Gemini, checked by eye; saved in `images/` |
| Header | ✅ Blue Dots logo, blue gradient `#0B63CE → #0A3D8F` |

## Three-minute demo
1. Open the map. Point to Kothrud, the vets nearby, and the white request pins.
2. On the bot page, pick Rohan and take the call on speaker. Say his line: his beagle is limping, it's Sunday, he's in Kothrud.
3. Pet Saathi names Paws & Care 24x7 (1 km, open Sundays). Ask which medicine to give: she says only the vet can tell.
4. On the map, click Paws & Care to show it's the same place.

## What's fictional
- Every name, listing and request is invented. The localities are real Pune areas.
- No phone numbers or addresses. Distances are rough road distances from Kothrud, Baner and Aundh.

## Known limits
- The bot can't book, call or connect anyone. Owners and providers find each other on the map.
- The map's Call button is disabled (no numbers).
- Pet care isn't in the Blue Dots documents. It's a new area being explored, not evidence.

## Data
`make_data.py` is the single source. It writes `petDots.ts` (the map) and `raya/directory.md` (the bot's directory). After changing it, rebuild `raya/PetSaathi Hinglish.md` from the prompt head plus the directory, and redeploy both.
