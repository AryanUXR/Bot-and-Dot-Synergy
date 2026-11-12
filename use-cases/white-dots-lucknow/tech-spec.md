# Tech spec: White Dots Lucknow (Parivar Saathi)

The stack is the same as Golden Dots: the tested EkStep defaults.

| Item | Value |
|---|---|
| Agent | Raya `4973a151-df82-4f3d-bf4b-8acf208b5c2a` (Hindi `38695ff2`, male voice B. Arjun `9a1dd39c`) |
| Bot page | Lovable `d157af22-6343-4b13-a64f-10d5347589a7`. Needs the `RAYA_API_KEY` secret |
| Map | Lovable `2f44ffbe-4dba-436a-92ed-d880d799172f`, with the stored Maps key |
| Images | Gemini via Vertex |

**What's new for White:** each of the nine sectors carries its own Dot colour (`SECTOR_COLOURS` in `whiteDots.ts`).

**Fallbacks:** none needed.
