# The ten non-negotiables

Go through these once with every new builder. Each one exists because breaking it cost a demo or a real person's trust.

1. **All data is fictional.** Invent names for businesses and people, include no addresses, and include no phone numbers except national helplines (in India: 108, 112, 181, 1098, 1033, 1077). *Why:* real numbers on a public map send strangers to real people, and real business names make claims we haven't checked.
2. **No sensitive labels.** For disability, use person-first, respectful words ("person with low vision", "uses crutches"), never "handicapped", "suffering from", "victim" or "confined to a wheelchair". People get a first name and an initial. No surnames, no caste or community, no religion, no state of origin, no marital status (say "family" or "a family member", never husband or wife). Where a persona lives now is fine and often needed: the bot and the map serve that place. What's out is where a migrant came *from*. Businesses are named after places or neutral words. *Why:* surnames and origins signal caste and community, and stereotyping hurts the very people the programme serves.
3. **Every dot type is visible.** Requests (seekers) and providers both appear on the map, and every filter has at least one dot. *Why:* a map with only providers can't show the matching the programme is about.
4. **The map opens without a login.** *Why:* the people it's for won't make accounts.
5. **The copy says what the bot does, not what it gives.** Write "Helps you find hostels", not "A room near you". *Why:* over-promising on unverified listings sets people up to be let down.
6. **Persona photos come from an image model and show the face clearly.** Never let the app builder make up its own images. *Why:* the face is how a visitor connects with the persona, and builder-made images come out generic.
7. **Every call closes properly, and only once.** End each closing line with the platform's hang-up signal (`Goodbye` on Raya). Ask "anything else?" after every answer. Close only when the caller is done. *Why:* without this, calls either loop or hang up mid-question.
8. **No time limits or promises in the prompt.** The bot can't see a clock, and nothing happens after a call ends. *Why:* a "3-minute" rule made a bot hang up early, and "I'll tell them about you" is a lie.
9. **Test on the real path before you say it works.** Place one call through the website's own call button code to your own tester number, then run bot-to-bot calls that copy how real callers behave. *Why:* our tests once passed while the website's key was broken.
10. **Never move a working thing onto something untested.** Prove the new piece end to end first, and keep the old path until both pass. *Why:* a half-built relay once broke a live site.

Rules 1–4 are the four audit checks. `scripts/audit.py` tests them on every prototype; see `SKILL.md`.

And one about secrets: **never paste a key into chat.** Put it in `.env` or the platform's secret store yourself.
