# Handover: Purple Dots Lucknow (map)

## Links
- **Bot (built by Aryan):** https://lovable.dev/projects/3b35a5d0-f9ab-416c-8bd9-d1c0cb65ce4f (Raya agent `6bc38769`)
- **Map:** https://lovable.dev/projects/5329af7a-2a48-4221-b651-86213c978489 (not yet published)
- **Built with:** Lovable · Google Maps (stored key, no secret needed)

## Readiness
| # | Check | Result |
|---|---|---|
| 1 | Map opens without login | ✅ public routes. ⚠️ not yet published |
| 2 | Every dot type visible | ✅ 9 filters; 35 providers, 12 requests (10 people + 2 employers) |
| 3 | All data fictional | ✅ `qc_check.py` passes; real localities and scheme names only |
| 4 | No sensitive labels | ✅ first name + initial; person-first disability language, checked by QC |
| 5 | Copy says what it does | ✅ "Jobs, services and support near you" |
| 6–8 | Persona photos, calls | Covered by Aryan's bot. Not re-tested here |
| 9 | Map loads on every device | ⚠️ the Lovable screenshot predates the conversion. Check the rendered map once |

**Accessibility added:**
- an `aria-label` on every marker;
- keyboard-focusable pins and buttons with visible focus rings;
- Escape closes cards;
- AA contrast.

## Three-minute demo script
1. **The problem (30 s).** "About 100 million PwDs are ready to work. Every month waiting for a device or training is lost income." Then: *"I wish someone would look at my skills before my disability."*
2. **The map (60 s).**
   - Show only **Jobs** and **Requests**.
   - Click **Hiring: Sunrise Customer Care** in Gomti Nagar ("4 roles, low vision welcome").
   - Then turn on **Tech** and click the screen-reader training in Aliganj, next to Gaurav.
   - Say: "An employer, a training centre and a job seeker who couldn't see each other."
3. **The call (75 s).** Use Aryan's bot. Pick Gaurav or Ravi and call on speaker.
4. **Close (15 s).** *"Glad to know there are so many opportunities built around inclusion."*

## What is fictional
All places, people and employer requests are sample data. The localities, and the scheme names (UDID, ADIP, divyang pension), are real.

## Known limits
- The Basti dots (for Deepak) are about 180 km from Lucknow, so they're outside the opening view. Pan or zoom out to see them.
- The bot's persona cards still use full names. Moving to first name + initial under rule 2 is Aryan's call.
