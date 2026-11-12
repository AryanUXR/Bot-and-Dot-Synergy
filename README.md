> **New here? Start with [`onboarding/SKILL.md`](onboarding/SKILL.md).** Bring your own accounts and platforms; nobody shares keys. Then run `python3 scripts/preflight.py` to check your setup.

# Bot-and-Dot-Synergy

Claude skill system for building Blue Dots bot and dot prototypes — give Claude a use case, get a working Raya voice AI bot and a Google Maps discovery platform, end to end.

## What this does

Give Claude a use case brief — a sector, a geography, a seeker type, a problem to solve — and this skill system guides it to build two working prototypes:

**Dot Prototype** — a public Google Maps discovery platform where seekers explore providers, resources, and services as coloured dots on a map. No login. Filterable by sector. Works on mobile. Built on Lovable + Supabase.

**Bot Prototype** — a Raya-powered voice AI landing page where visitors choose a persona and receive an outbound call, experiencing the use case through that person's journey. Built on Lovable + Supabase + Raya.

Both prototypes share a Supabase backend: Raya tool calls write caller data async, the dot map reads from the same tables in realtime. Callers become dots.

## Who this is for

Anyone at EkStep or a partner organisation who needs to prototype a new Dots use case — a new sector, a new geography, a new population. Zero build time between "we have a use case" and "here is a working demo."

## How to use

Share a brief with Claude in the Blue Dots EkStep project. Claude reads this repo and orchestrates the full build — content, Raya agent, Lovable prompts, dot data, persona images — in sequence.

Start: point Claude at `SKILL.md`.

## Repo structure

```
SKILL.md                          ← Claude entry point
shared/                           ← Patterns used by both bot and dot
bot/                              ← Bot prototype pipeline + templates
dot/                              ← Dot prototype pipeline + templates
image-generation/                 ← Automated persona image pipeline
content/                          ← Writing rules + content templates
```

## Reference prototypes

| Prototype | Type | Lovable ID |
|-----------|------|-----------|
| Blue Dots SA NLC | Bot base | `d816ead9-ef48-4fb9-8af2-26ae06bc157a` |
| Blue Dots SA (Siza), old: remix fails | Bot base, retired | `2937b9e5-2f19-44d7-ad16-82efd6b5b9b7` |
| Red Dots Ladakh | Dot base | `ac07c375-8ae5-49b8-a6c3-12d837bf3ded` |
