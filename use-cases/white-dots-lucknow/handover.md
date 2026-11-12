# Handover: White Dots Lucknow (Parivar Saathi)

## Links
- **Bot page:** https://lovable.dev/projects/d157af22-6343-4b13-a64f-10d5347589a7 (not yet published)
- **Map:** https://lovable.dev/projects/2f44ffbe-4dba-436a-92ed-d880d799172f (not yet published)
- **Built with:** Raya (agent `4973a151`, Hindi, male voice) · Lovable · Google Maps (stored key) · Gemini images

## Readiness
| # | Check | Result |
|---|---|---|
| 1 | Map opens without login | ✅ public routes. ⚠️ not yet published |
| 2 | Every dot type visible | ✅ all 9 Dot colours, 36 providers + 8 requests (seen in Lovable's screenshot) |
| 3 | All data fictional | ✅ `qc_check.py` passes |
| 4 | No sensitive labels | ✅ first name + initial; the bot never asks caste or income |
| 5 | Copy says what the bot does | ✅ "Helps your family find jobs, courses, services and support near home in Lucknow" |
| 6 | Persona faces clear | ✅ four Gemini photos |
| 7 | A call works from the page | ✅ website path, Raya 200 |
| 8 | The call ends cleanly | ✅ one Goodbye in every test call |
| 9 | Map loads on every device | ⚠️ desktop screenshot only |

## Three-minute demo script
1. **The problem (30 s).** *"Every time someone at home has a need, we end up asking ten different people."*
2. **The map (60 s).**
   - Open the map: nine colours, one family's house pin in Alambagh. Say "each colour is a Dots programme".
   - Turn on only Skills (yellow) and Business (brown).
   - Click the trade institute 2 km from the house, then the packaging supplier in Aminabad.
   - "The son's course and the father's supplier are both a short ride from home."
3. **The call (75 s).**
   - Pick **Sunita** and call on speaker. Ask: "हमारे समूह को लोन कैसे मिलेगा?", then "चिकनकारी के खरीदार कहाँ मिलेंगे?", then thanks.
   - Point out three things: two correct desks, real distances, and it didn't promise the loan.
4. **Close (15 s).** *"Turns out many of my family's needs can be met by local services."*

**Card layout:** fixed 12 Nov, after Aryan spotted uneven gaps. All cards now share the same tops, photos, names and labels, and every label uses one chip style.

## What is fictional
- All helpers, people and requests are sample data.
- Localities (including Malihabad, Chowk and Bakshi Ka Talab) and public scheme names are real.
- The only real numbers are the national helplines 108, 112, 181 and 1098.

## Known limits
- One slip in testing: a place was described in the wrong area.
- The bot speaks Hindi only.
