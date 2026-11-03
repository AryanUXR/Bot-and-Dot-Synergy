# Green Dots Nashik — Use Case Brief

Source: Green Dots AI infographic (labour, equipment repair and storage are digitally dark in agriculture; ₹/$12B crop value lost annually, partly from discovery delays at harvest).

```
USE CASE BRIEF
==============

## 1. Programme name
Green Dots Nashik

## 2. Dots colour
Green
- Primary:      #2D6A2E
- Primary dark: #1F4D21
- Accent:       #4C9A4F

## 3. Geography
- Region: Nashik district farm belt (Niphad, Dindori, Chandwad, Sinnar talukas)
- Country: India (Maharashtra)
- Map centre: around Pimpalgaon Baswant / Ozar (verify during dot build)
- Zoom: 10 (covers Nashik city edge to Lasalgaon)

## 4. Seeker type
Smallholder farmer (onion, grape, tomato, wheat) who cannot find labour,
a mechanic or storage in time during harvest and spraying windows.

## 5. Provider type
Labour contractors (mukadams) and labour nakas, tractor and pump repair
workshops, Custom Hiring Centres, cold storages and pack houses, APMC mandis
and FPOs, banks (KCC) and crop insurance, KVKs and taluka agriculture offices,
local experts and agents.

## 6. Bot name
Kisaan Saathi

## 7. Language(s)
[x] Hindi
Note: Marathi is the first language in Nashik. Hindi is widely understood.
A Marathi variant can be added later as RAYA_AGENT_ID_KISAANSAATHI_MARATHI.

## 8. Personas (3)
See personas.md.
1. Sunita Pawar — onion farmer, needs harvest labour this week (early-stage)
2. Ganesh Shinde — grape farmer who rents his tractor to neighbours, tractor broke mid-spraying (mid-stage)
3. Rahul Gaikwad — tractor and pump mechanic who wants farmers to find him (provider)

## 9. Sector list
1. Farm Labour
2. Equipment Repair
3. Machinery Rental
4. Cold Storage & Warehousing
5. Mandi & Market Access
6. Finance & Insurance
7. Government & Training
8. Experts & Agents
9. Farmer Requests   ← seeker dots: hardcoded farmer intent

## 10. Supabase project
Only what the bot base already uses for the call log. No shared dot table.

## 11. Async sync
[x] No — both seeker and provider dots are hardcoded from research.
Deviation from base schema: dots carry `type: "provider" | "seeker"` so farmer
requests render as a distinct marker on the map.

## 12. Anything else
- Before/after line from the infographic drives the hero:
  "I lost an entire day just trying to find someone to repair my tractor."
  → "Turns out, the help I needed was just 3 km away."
- Calls are 2-3 minutes.
```
