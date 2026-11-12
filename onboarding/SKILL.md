---
name: bot-and-dot-onboarding
description: First-run onboarding for the Bot-and-Dot skill. Use when someone is new to the skill, has no `config/local.json`, says "how do I start", "set me up", "I want to build a Dots prototype", or wants to review or fix a prototype they did not build. It works out their role, helps them choose a stack (any voice platform, app builder, map and image tool), guides them through creating their own accounts, checks every connection live, and writes their local config. It never shares or asks for EkStep's keys.
---

# Bot-and-Dot onboarding

This skill gets a new person from "I was told to use this" to a verified setup in about 20 minutes. Run it before the main `SKILL.md` whenever `config/local.json` is missing.

Why it exists: see `research/who-uses-this-skill.md`. The hardest moments for new users are getting access, learning the rules by breaking them, and a demo failing in front of people. Onboarding handles those three before any build starts.

## Ground rules for you, the agent

- **Never share, reuse or suggest EkStep's keys, accounts, workspace IDs, tester numbers or remix bases.** Every user brings their own. If a doc elsewhere in this repo names an EkStep ID, treat it as an example of what to look up, not a value to use.
- **Never ask anyone to paste a secret into chat.** Tell them which file or secret store it goes in, have them put it there themselves, then verify it with a check that never prints the value (`scripts/preflight.py`).
- **The user's platforms are their choice.** Recommend the tested default and say why, give the alternatives, and accept their pick. The method doesn't depend on any one platform. `stack-options.md` lists what each layer has to be able to do.
- **Plain words.** No unexplained jargon: say "the phone number the bot calls from", not "DID". The first time you use a term, define it in one clause.
- **One question round per step.** Bundle your questions and propose defaults. Don't drip-feed them.
- **Verify, don't assume.** Nothing counts as set up until a live check passes.

## Step 0: Is this person already set up?

If `config/local.json` exists, read it. Then greet them by role, run `python3 scripts/preflight.py` and go straight to the route they want. Skip the rest of this file.

## Step 1: Who are you, and what do you want today?

Ask one question and offer four routes:

| Route | For | Goes to |
|---|---|---|
| **Build** a prototype | builders, first-timers, partners | Steps 2–7, then the main `SKILL.md` |
| **Review** a prototype | managers, programme leads | `readiness-report.md` only. No accounts needed |
| **Fix** a live bot from feedback | prompt tuners, QA | Steps 2–5 for the voice platform only, then `fix-from-feedback.md` |
| **Just looking** | anyone curious | Step 2, then stop |

A reviewer never needs keys or accounts. Don't walk them through setup.

## Step 2: Show what they'll get (30 seconds)

Explain in four lines:
- **Bot:** a web page where a visitor picks a persona and gets a phone call from a voice agent in their language.
- **Dot:** a public map of services and requests near them, filterable by type, with no login.
- **Time:** about 1–2 days for a first build, including tests. A few hours once set up.
- **Cost:** they pay for their own platforms. Most have free tiers for a prototype. Voice calls are usually billed per minute, so say so.

If they have an infographic or brief, ask for it now. Their use case drives the rest of the steps.

## Step 3: Choose the stack

Use `stack-options.md`. For each layer, ask whether they already use a platform for it. If not, recommend the tested default. Layers:

1. AI coding agent: what runs this skill.
2. Voice agent platform: the bot.
3. App builder and hosting: the bot page and the map.
4. Map provider.
5. Image generation: persona photos.
6. Code storage (git), so they keep their own copy and lessons.
7. Database: optional, only for a live bot-to-map sync.

Write their choices down as you go. They go into `config/local.json` in Step 5.

If they pick something outside the tested defaults, check it against that layer's capability list in `stack-options.md`. Tell them plainly what will need adapting. An example: "your voice platform has no way to end a call on a keyword, so we'll use its end-call tool instead."

## Step 4: Set up their own accounts

For each chosen platform:
1. Open the matching guide in `setup-guides/`. If there isn't one, use `setup-guides/any-platform.md`.
2. Walk them through it one platform at a time: create the account, find the key or token, and decide where it lives.
3. **Secrets go in `.env`**, which is git-ignored, or in the platform's own secret store. Copy `.env.example` to `.env` and let *them* fill in the values.
4. Run `python3 scripts/preflight.py --only <layer>` after each one. Move on only when it passes.

When a check fails, read the error, name the likely cause and the fix in one or two sentences, and retry. Common causes are in each guide's "If it fails" section.

## Step 5: Write their local config

Copy `config/local.example.json` to `config/local.json`. It's git-ignored and holds no secrets. Fill in:
- name and role;
- the chosen platform for each layer;
- their workspace or project IDs;
- their own tester agent and its number, if any;
- default language;
- clone path.

The rest of the skill reads values from here instead of the EkStep examples in the docs.

## Step 6: Their own tester

Bot-to-bot testing needs a second agent that phones the bot, or that the bot phones, and plays a caller. Help them create one **in their own voice platform**, following `setup-guides/` for that platform. If their platform can't do this, testing is done from their own phone using the same persona scripts. Say that this is slower and that every change needs a manual call.

Never use another team's tester agent or number.

## Step 7: The non-negotiables

Go through `non-negotiables.md` once: ten rules, each with the reason it exists. Ask them to confirm. Most of these rules were learned the hard way, and each one has cost a demo.

## Step 8: A safe first run

Offer a dry run that touches nothing shared or public. Take their infographic, or `onboarding/sample-brief.md`, and produce:
- the brief;
- three personas;
- ten dummy dots.

The dry run creates no agents and no projects, and it publishes nothing. They see the method working before spending money or credits.

Then hand over to the main `SKILL.md` for the real build.

## Step 9: Remember them

Save role, stack and preferences in `config/local.json`, under `profile`. Next time, Step 0 skips onboarding.

If they hit something these guides didn't cover, add it to `LESSONS.md` and fix the guide.
