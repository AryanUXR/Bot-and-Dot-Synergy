# Dot Data Writing Guide

How to write the provider/organisation data for a dot prototype. Read `anti-slop-rules.md` first.

## Name field

Use the full official name. Include the branch or locality in the name when there are multiple branches.

BAD: `"SBI Bank"`
GOOD: `"State Bank of India — Leh Main Branch"`

BAD: `"Government Office"`
GOOD: `"LAHDC (Leh) — Hill Council Secretariat"`

## Area field

Use the neighbourhood or locality name only — not the city. The city is implied by the map geography.

BAD: `"Leh, Ladakh"`
GOOD: `"Main Bazaar, Leh"`
GOOD: `"Fort Road, Leh"`
GOOD: `"Changspa, Leh"`

## org_type field

Short category label. Guides the badge shown in the DotCard header.

Examples: `"Bank"` | `"Government Office"` | `"Post Office / Logistics"` | `"NGO"` |
`"Training Centre"` | `"Market / Bazaar"` | `"Expert"` | `"MSME Consultant"` | `"Common Service Centre"`

## offers field

2-5 short tags. These are the specific things a seeker can get from this dot.

BAD: `["Financial Services", "Business Support"]`
GOOD: `["Mudra Loan", "PMEGP", "Working Capital"]`
GOOD: `["FSSAI Basic Registration", "UDYAM Registration", "Aadhaar Services"]`

Each tag should be a programme name, a service type, or a specific thing — not a category.

## description field

Maximum 2 sentences. Apply anti-slop-rules.md.

**Formula:**
- Sentence 1: What the organisation IS + what it DOES. Direct statement. No mission language.
- Sentence 2: The specific value for a seeker at this geography. Programme names, limits, languages, special access.

BAD:
`"A comprehensive financial institution providing a wide range of banking services to support the business community of Leh district."`

GOOD:
`"Main SBI branch in Leh. Handles Mudra Shishu/Kishore/Tarun, PMEGP disbursement, and general business loans."`

BAD:
`"Roshan is a dedicated compliance consultant committed to helping Ladakhi food businesses succeed."`

GOOD:
`"Leh-based FSSAI consultant with 6 years of experience helping Ladakhi food producers get food licenses. Assists with FoSCoS portal in Hindi. Home visits to Nubra and Sham Valley available in summer."`

## Expert persona rows — special rules

Expert/agent persona dots are fictional but must be believable. Rules:

- Use locally appropriate names for the geography (not generic Hindi or English names for a Ladakhi prototype)
- Specialisation must be narrow and specific — not "business consultant"
- Years of experience must be stated
- Contact number: use a realistic format for the geography (mobile starting with 94xxx for J&K)
- The description's second sentence should name the specific type of client they serve
- `verified` field: `"Unverified"` — never write "Mock" or "Test"
- `org_type`: `"[Specialism] Expert"` or `"[Specialism] Consultant"`

## Coordinate accuracy

Never use city-centre coordinates for multiple dots. Each dot should have its own coordinate at neighbourhood level.

Process:
1. Look up the organisation's actual address (web search)
2. Find approximate lat/lng for that address (Google Maps or OpenStreetMap)
3. Verify the coordinate is within the correct neighbourhood before using it

For expert personas: use a coordinate in the area the expert serves. Do not cluster all experts at the same coordinate.

## Data completeness targets

Every prototype should have at minimum:

| Sector | Min dots |
|--------|----------|
| Capital & Finance | 3 |
| Government Schemes | 3 |
| Compliance & Licensing | 2 |
| Market Access | 2 |
| Training & Skills | 2 |
| Experts & Agents | 8 (one per major seeker need) |
| Other sectors | 1-2 each |

Total: 35-50 dots.
