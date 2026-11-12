# Handover: Golden Dots Patna (Sahayika)

## Links
- **Bot page:** https://lovable.dev/projects/168e5c3b-ee4b-49a7-b2c2-0d1fd6f37200 (published)
- **Map:** https://lovable.dev/projects/d19b8c1c-d650-4a77-a4f0-ce1c84830870 (not yet published)
- **Built with:** Raya (agent `5d13b69c`, Hindi, female voice) · Lovable · Google Maps (stored key) · Gemini images (Vertex)

## Readiness
| # | Check | Result |
|---|---|---|
| 1 | Map opens without login | ✅ public routes only. ⚠️ the map isn't published yet |
| 2 | Every dot type visible | ✅ 9 filters; 42 helpers, 12 requests (Lovable screenshot) |
| 3 | All data fictional | ✅ `qc_check.py`: no phones, addresses or real names; real scheme names only |
| 4 | No sensitive labels | ✅ first name + initial; the bot never asks caste, religion, category or marital status |
| 5 | Copy says what the bot does | ✅ "Helps you find who can help with schemes, documents and services in Patna" |
| 6 | Persona faces clear | ✅ three Gemini photos, faces large and sharp |
| 7 | A call works from the page | ✅ website path, Raya 200 |
| 8 | The call ends cleanly | ✅ one Goodbye in all 4 personas' final rounds |
| 9 | Map loads on every device | ⚠️ checked only in Lovable's desktop screenshot |

## Three-minute demo script
1. **The problem (30 s).** "Help exists: Jeevika didis, help desks, schemes. People just can't find it." Then the "before" quote: *"I kept hearing about these schemes, but I didn't know who could help me."*
2. **The map (60 s).**
   - Open the map and turn off everything except **SHGs** and **Requests**.
   - Click Meera's request in Phulwari Sharif (needs an Ayushman card), then the Asha Didi help point next to her.
   - "A neighbour who can help is a few minutes away, and neither knew about the other."
3. **The call (75 s).**
   - On the bot page, pick **Rekha**. Enter the presenter's number and press Call. On speaker, ask: "आयुष्मान कार्ड कहाँ बनता है, कितने पैसे लगेंगे?"
   - Then ask: "आप ही फ़ॉर्म भर दो?". Then say thanks.
   - Point out three things: it named two helpers nearby, it didn't invent a fee, and it closed once.
4. **Close (15 s).** The "after" quote, *"I found a Jeevika Didi just a few minutes away."*, then what a rollout adds: real verified helpers, and live sync from calls to the map.

*Backup:* record one good call beforehand in case the room's network fails.

## What is fictional
All helpers, people, SHGs and requests are sample data. Localities and public scheme names are real. The bot's only real numbers are national and Bihar helplines: 112, 181, 1098, 14567, 1930 and 1100.

## Known limits
- Bihar scheme details come partly from news and guide sites, so Sahayika says "can get" and "the help desk will check" rather than quoting amounts.
- Minor: it sometimes adds "anything else?" after its own question.
- Maithili and Bhojpuri aren't supported. It replies in simple Hindi.

## Test results
See `tests.md`. All four personas pass after two prompt rounds, and the website-path call works.
