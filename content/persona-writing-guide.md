# Persona Writing Guide

How to write the three standard personas for a Blue Dots bot prototype. Read `anti-slop-rules.md` first and apply throughout.

## The three persona slots

| Slot | Archetype | Relationship to the problem |
|------|-----------|----------------------------|
| 1 | Early-stage seeker | Has the qualification or skill. No clients, no capital, no clear path. |
| 2 | Mid-stage seeker | Already earning informally. Blocked from scaling by one specific constraint. |
| 3 | Provider / mentor | Experienced. Calls to understand how to support seekers, or to connect seekers to resources. |

## What makes a persona work

A persona works when a first-time visitor immediately recognises a real person they know, or recognises themselves. It fails when it reads like a demographic category.

**Works:** "Kgomotso is 21 years old, from Westenburg in Polokwane. Every morning for the past eight months she has baked fat cakes in her mother's kitchen and sold them at the Seshego taxi rank. She sells out before 9am, every single day."

**Fails:** "Kgomotso is a young female food entrepreneur from Polokwane who is passionate about growing her informal business."

## The `about` paragraph structure

Write exactly three paragraphs. Each has a job:

**Paragraph 1: Establish the person.** Name, age, location, what they do or have done. One specific fact that makes them real — an achievement, a duration, a number. No adjectives.

**Paragraph 2: Name the obstacle.** What is the gap between where they are and where they need to be? Make it concrete: a missing document, a missing tool, a missing relationship, a missing number. The reader should feel the friction.

**Paragraph 3: State the call's purpose.** What do they need the bot to do for them? One clear ask. Not abstract. The paragraph ends with the call starting.

## The `traits` array

Five bullet strings. Each is a complete fact, not a phrase:

```
"24 years old, Seshego, Polokwane, Limpopo"          ← who and where
"Completed Electrical Engineering N6 at Capricorn TVET"  ← what they have
"No tools, no startup capital, no clients yet"        ← what they lack
"Wants to start an electrical installation micro-business"  ← what they want
"Needs equipment finance and her first client pipeline"  ← what this call is for
```

Never write: "Passionate about entrepreneurship" or "Committed to making a difference".

## The `questions` array

5-6 questions the caller might actually ask during the conversation. Specific to their situation and geography.

For English bots: plain English, direct question form.
For Hindi bots: Devanagari script only, no Roman transliteration.

**Works:** "Where can I get funding for tools and equipment in Polokwane?"
**Fails:** "What financial opportunities are available for me?"

## The `dropdownLabel` field

Format: `[Full Name] — [Archetype short description] ([Intent])`

```
"Nomsa Dlamini — TVET Graduate (Wants to Start)"
"Kgomotso Sithole — Informal Food Seller (Wants to Grow)"
"Mandisa Khumalo — Entrepreneurship Coach (Mentor)"
```

## The `experience` field

One sentence. What the caller will experience on this call. Specific to this persona and bot.

```
"Nomsa is at the beginning of her self-employment journey. Siza will help her
identify the right first steps — from equipment finance to finding her first
clients in the Blue Dots network in Polokwane."
```

Apply `anti-slop-rules.md` before finalising: check for em dashes, passive voice, banned words.
