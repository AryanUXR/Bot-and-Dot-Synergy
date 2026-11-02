# Dot Data — Schema and Writing Rules

## TypeScript interface

```typescript
// src/data/[name]Dots.ts

export interface [Name]Dot {
  id: number;                  // sequential integer — never UUID in the data file
  type: "provider";            // always "provider" for current prototypes
  name: string;                // official name of the organisation or expert
  area: string;                // neighbourhood / locality — not city (city goes in mapData)
  lat: number;                 // decimal degrees — verify via web search, never from memory
  lng: number;                 // decimal degrees
  sector: string;              // must exactly match one of the SECTORS list in LaunchPage
  org_type?: string;           // short label — "Bank" | "Government Office" | "NGO" | "Expert" etc.
  offers?: string[];           // 2-5 tags — what this dot provides
  address?: string;            // street address if known
  contact?: string;            // phone number as string — include STD code
  description: string;         // 1-2 sentence description — see writing rules below
}

export const [NAME]_DOTS: [Name]Dot[] = [
  // ... dot entries
];
```

## Dot data composition

Every prototype should have 35-50 dots across the sector categories. Composition:

| Type | Count | Source |
|------|-------|--------|
| Real organisations | 25-35 | Research-verified: banks, govt offices, NGOs, markets with real addresses |
| Expert / agent personas | 8-12 | Fictional but believable individuals — one per major seeker need |

For real organisations: verify address and phone via web search. Use approximate coordinates accurate to neighbourhood level.

For expert personas: use locally appropriate names. Give them a specific specialisation, years of experience, and a contact number. Set `org_type` to `"Expert"` or `"[Specialism] Consultant"`. Set `sector` to `"Experts & Agents"`.

## Dot description writing rules

From `content/dot-data-guide.md` — short version:

- **One or two sentences only.** No more.
- **First sentence: what they do.** State it directly — no "dedicated to" or "committed to".
- **Second sentence: the specific value.** The most useful thing a seeker would want to know.
- **No adjectives that don't carry information.** "Leading", "premier", "trusted" → delete.
- **Include at least one concrete fact.** A loan limit, a distance, a programme name, a language spoken.

BAD: `"A leading financial institution dedicated to supporting small businesses and entrepreneurs in the region."`

GOOD: `"Main SBI branch in Leh. Handles Mudra Shishu/Kishore/Tarun, PMEGP disbursement, and general business loans."`

## Sector exact match

The `sector` field in each dot must exactly match (case-sensitive, space-sensitive) one of the SECTORS array in LaunchPage.tsx. If they don't match, the dot will be invisible when that filter tile is active.

Always output both the SECTORS array and the dot data in the same prompt to ensure they match.

## Coordinate accuracy

- City-level accuracy is not enough. Use neighbourhood-level coordinates.
- For real organisations: look up the address and use coordinates for that address.
- For expert personas: use a coordinate within the area they serve, at the neighbourhood level.
- Never use the city centre coordinate for multiple dots in the same city.
- Verify with: `https://maps.google.com/?q=[address]` — note the coordinates shown.
