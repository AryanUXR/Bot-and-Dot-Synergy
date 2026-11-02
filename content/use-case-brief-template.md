# Use Case Brief Template

Fill this in when starting a new dot/bot prototype build. Claude reads this to extract the spec before any building begins.

---

```
USE CASE BRIEF
==============

## 1. Programme name
What is this prototype called?
e.g. "Brown Dots Ladakh", "Siza — Blue Dots South Africa"

## 2. Dots colour
What colour are the dots on the map?
e.g. Blue (#1E40AF), Brown (#D97706), Red (#DC2626), Orange (#EA580C), Purple (#7C3AED)

## 3. Geography
Where is this prototype set?
- Region / district / city:
- Country:
- Map centre (lat, lng): [verify via web search before using]
- Typical zoom level: [11 for city, 9 for district, 7 for region]

## 4. Seeker type
Who is the person on the seeker side?
e.g. "TVET graduate who wants to start a micro-business"
e.g. "MSME owner in the hospitality sector looking for working capital"
e.g. "Young farmer trying to access agro-processing support"

## 5. Provider type
What kinds of organisations or people are shown as dots on the map?
e.g. "Banks, government offices, training centres, compliance agents, market facilitators"

## 6. Bot name
What is the voice AI called?
e.g. "Siza", "Saarthi", "Karigar", "Safar"

## 7. Language(s)
What language(s) does the bot speak?
[ ] Hindi
[ ] Kannada
[ ] English
[ ] Other: ___

## 8. Personas (3)
Describe the three personas in brief — enough for Claude to write them:

Persona 1 (early-stage seeker):
  Name: 
  Age: 
  Location (area, city):
  What they have:
  What they lack:
  What they need from the bot:

Persona 2 (mid-stage seeker):
  Name:
  Age:
  Location:
  What they have:
  What they lack:
  What they need from the bot:

Persona 3 (provider / mentor):
  Name:
  Age:
  Role:
  Why they are calling:

## 9. Sector list
List the filter categories for the dot map (6-9 sectors):
1.
2.
3.
4.
5.
6.
(7.)
(8.)
(9.)

## 10. Supabase project
Is there an existing Supabase project to use, or does a new one need to be created?
[ ] Existing — URL: ___
[ ] New project needed

## 11. Async sync
Should bot call data sync to the dot map?
[ ] Yes — callers should eventually appear as dots
[ ] No — dot map is seeded with static research data only

## 12. Anything else
Any constraints, existing assets (images, copy), or special requirements:
```
