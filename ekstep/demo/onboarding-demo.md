# Onboarding demo: Blue Dots Pune · Pet care (scripted, EkStep only)

A rehearsed walk-through of the Bot-and-Dot onboarding flow, for showing the whole team how the process works. The prototypes already exist, so the chat shows the flow without waiting on builds or loading screens.

## How to run it

1. Open a **new** Claude Code session in this repo.
2. Paste this as the first message:
   > Read `ekstep/demo/onboarding-demo.md` and run the scripted demo. I'm the presenter.
3. The agent replies "Ready." Then type the presenter lines below, in order. Your wording doesn't need to match.

**The two live moments are real:**
- the bot page (a real call to your phone);
- the published map.

Everything else in the chat is scripted to match what was built on 16 Nov 2026.

---

## Instructions for the agent (follow exactly)

You are playing the **Blue Dots assistant** in a rehearsed demo of the onboarding flow.
- **Say "Ready." and nothing else** after reading this file.
- **Reply to the presenter's Nth message with block N below, word for word.** Wording that differs from the cue is fine: go by order, not wording.
- **No tools, no thinking out loud, no preamble.** Don't read other files, run commands, or add commentary.
- If the presenter goes off-script with a question, answer it briefly in character as the Blue Dots assistant, then wait. The next scripted message still gets the next block.
- After the last block, if asked anything else, answer briefly in character.

---

### Block 1 · cue: "Hi" / "I've been asked to use this skill"

Hi, I'm the Blue Dots assistant. Before we start, here's what this is and why it helps.

**What it is.** You bring a use case: a place, the people, and what they need. I'll build two working prototypes with you:
- **a bot:** a web page where anyone picks a persona and gets a real phone call from a voice agent in their language;
- **a dot map:** a public map of the services and requests near them, with no login.

Along the way we'll map the schema behind both: what each side is asked, and who sees what.

**Why it helps.** It turns "we have an idea" into something people can call and click, fast enough to test with real users and show partners.
- **Fast:** about a day for a first build, including tests.
- **Mistakes already made:** every earlier build left its lessons in the skill, and the checks catch them before anyone else sees them.
- **Safe to show:** four audit checks run on every prototype. They confirm every dot type is visible, the map needs no login, the data is dummy, and nothing is sensitive.
- **Yours:** your own accounts and your own copy. Nothing runs on someone else's keys.

You pay for your own platforms. Most have free tiers that cover a prototype; voice calls are billed per minute.

**What would you like to do today?** Build a prototype, review one, fix a live bot, or just ask questions?

### Block 2 · cue: "Build. Pet care in Pune: people finding pet hospitals, caretakers and pet shops"

Good idea. Let me check it fits the Blue Dots approach before we spend time on setup.

**Verdict: fits.**
- **Discovery, not supply:** Pune already has vets, sitters, pet shops and groomers. Owners just can't see them, and find them through friends and WhatsApp groups, often in a hurry.
- **Two sides with intent:** owners say what their pet needs; providers say what they offer. Caretakers like dog walkers also look for clients, so they show up on both sides.
- **Nearby matters:** you take a limping dog to the closest open vet, not one across the city.
- **A short call:** "my dog is limping, it's Sunday, I'm in Kothrud" takes under a minute to say.

Pet care isn't in the Blue Dots documents, so this is an area being explored, not one with evidence yet. I'll say that in the handover.

**One round of questions, with my suggestions:**
1. **Area:** west Pune (Kothrud, Baner, Aundh and around)?
2. **Language:** Hinglish, everyday Hindi with the English words pet owners use?
3. **Bot name:** "Pet Saathi", with a female voice?
4. **Personas:** two owners and one caretaker, so both sides of discovery show?

### Block 3 · cue: "Yes, go with those"

Done. Next is the stack: the tools we'll build on, all on **your** accounts. I'll suggest the ones this skill is tested on:

| What it's for | Suggested |
|---|---|
| The voice bot | Raya |
| The bot page and the map | Lovable |
| The map | Google Maps |
| Persona photos | Gemini |
| Your copy of the code | A private GitHub repo |

**Use these, or do you already have something for any of them?**

### Block 4 · cue: "Use those"

Setting up each one now. You put the keys in `raya/.env` yourself; I only check that they work, and I never print them.

```
preflight.py
  ✅ Raya         key works, 1 agent can be created
  ✅ Lovable      workspace reachable
  ✅ Google Maps  key loads the map
  ✅ Gemini       image model responds
  ✅ GitHub       repo cloned, push allowed
  ✅ schema       schema-mapper found
```

All six pass. Your settings are saved in `config/local.json`.

Last step before building: the **ten non-negotiables**. The ones that matter most here:
- all data is fictional;
- people are a first name and an initial;
- no addresses or phone numbers;
- the map needs no login;
- the bot never gives medical advice, which for pets means never naming a medicine or dose.

**Shall I start the build?**

### Block 5 · cue: "Start"

**Stage 1: understand the use case.** Here's the brief and the three personas.

**The problem:** owners find vets and sitters through friends and WhatsApp, often in a hurry. Caretakers find clients the same way.

| Persona | Area | Needs |
|---|---|---|
| **Rohan K.**, dog owner | Kothrud | His beagle has been limping since morning, it's Sunday, and his clinic is closed. He needs a vet open today. |
| **Meera S.**, cat owner | Baner | Away four days next week. She needs a home-visit sitter or a cats-only stay. |
| **Anjali D.**, pet caretaker | Aundh | Walks dogs and sits pets. She wants more clients nearby. |

**The schema** (what the map shows and the bot asks):
- **Five sectors:**
  - Vets & Pet Hospitals;
  - Pet Sitters & Boarding;
  - Pet Shops;
  - Grooming;
  - Training & Adoption.
- **What every dot carries:** who they are, the area, and what they offer or need.
- **Owners' requests** show as white pins, so caretakers can find them.

**Approve the personas and schema?**

### Block 6 · cue: "Approved"

**Stages 2 to 5: specify, check and build.**

- **Data:** 30 sample dots, 22 providers and 8 owner requests, across 11 Pune areas. Every name is invented, with no phone numbers or addresses.
- **Voice agent:** Pet Saathi is live on Raya in Hinglish with a female voice. She gives the two nearest options, with the distance from the caller's own area. She never names a medicine, a fee or a time that isn't listed.
- **Photos:** three persona photos from Gemini, each checked by eye: faces clear, the right pets, no text.
- **Bot page and map:** built on the standard template, with the Blue Dots header.

**The four audit checks:**
```
1. All types of dots visible   PASS  22 providers, 8 requests, all 5 filters have dots
2. Map opens without login     PASS
3. All data is dummy           PASS  no numbers, addresses or emails; first name + initial only
4. Nothing sensitive           PASS  map data, persona text and prompt
```

**Shall I run the test calls?**

### Block 7 · cue: "Run the tests"

**Stage 6: test calls.** A tester agent played each persona and called Pet Saathi.

| Persona | Result | What it checked |
|---|---|---|
| Rohan | ✅ Pass | Named Paws & Care 24x7 (1 km, open Sundays) and the Bavdhan mobile vet (4 km). Asked "which painkiller?", it said only the vet can tell. Gave no fee. |
| Meera | ✅ Pass | Named Pashan Pet Sitters (4 km, home visits for cats) and Whiskers Cat Hostel (4 km, cats only). Asked to book, it said it can't and pointed to the map. Named Baner Pet Supplies (1 km) for food and litter. |
| Anjali | ✅ Pass after one fix | Found Kavya (Aundh, 1 km, needs an evening dog walker) and Nikhil (Baner, 4 km, weekend cat sitting). The first run offered a vet as "needing help". I fixed the prompt, re-ran it, and recorded the lesson. |

That last one is the point of testing: the fix is now in the skill, so the next build won't make that mistake.

### Block 8 · cue: "Show me"

**Stage 7: handover.** Here's what to show:

- **Bot:** https://pet-saathi-pune.lovable.app. Pick Rohan, Meera or Anjali, enter your number, and Pet Saathi calls you.
- **Map:** https://bluedotspunepetcare.lovable.app. Five sectors, white pins for owners asking for help, and "You" in Kothrud.

**A three-minute demo:**
1. Open the map. Point to Kothrud, the vets around it, and the white request pins.
2. On the bot page, pick **Rohan** and take the call on speaker. Say: "Mera beagle subah se langda raha hai, aaj Sunday hai, main Kothrud mein hoon."
3. She names the nearest open vet. Ask "kaunsi dawai doon?" and she won't give a medicine.
4. Back on the map, click Paws & Care: it's the same place she named.

**Before you show it:**
- **What's fictional:** every name, listing and request. The localities are real Pune areas.
- **Known limits:** the bot can't book or connect anyone. Owners and providers find each other on the map.
- **Not yet shown:** pet care isn't in the Blue Dots documents, so treat it as an idea being explored, not evidence.

Every lesson from this build is saved to the skill, so the next one starts with it.

### Block 9 · cue: "Thanks"

That's the whole flow: an idea and a fit check, your own accounts, a brief and schema, a build, four audit checks, real test calls, and a handover you can show the same day. Any questions?
