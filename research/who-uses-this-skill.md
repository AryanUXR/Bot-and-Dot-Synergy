# Who uses the Bot-and-Dot skill, and where it hurts

Draft 0.1 · 12 Nov 2026 · input for the onboarding skill

**What this is.** Proto-personas, empathy maps and a journey map for anyone who runs this skill, not just the person who wrote it.

**What it is built from.**
- Five builds: Green Nashik, Pink Tiruppur, Red Guwahati, Orange Udupi and the Sakhi fix.
- The 51 entries in `LESSONS.md`.
- The team's real Sakhi calls.
- The Lovable workspace, which has about 90 prototypes made by several people.

**What it is not.** No one outside this chat has been interviewed. Every persona is a hypothesis. Each one ends with what we would need to check.

---

## 1. Who the users are

There are six kinds of user. The first four are people on or near the team. The fifth is outside EkStep. The sixth is not a person.

| # | Persona | Uses the skill to… | How often | Technical comfort |
|---|---|---|---|---|
| 1 | **Builder.** A product or research consultant, like Aryan | turn an infographic into a working bot and map | weekly | high: Claude Code, Lovable, APIs |
| 2 | **First-time builder.** A new teammate, intern or fellow | build their first use case | once, then monthly | medium: has used Claude, never Raya or Lovable MCP |
| 3 | **Reviewer.** A programme lead, like Vineela or Nandan | ask for a prototype, judge it, demo it | per use case | low on tooling, high on judgement |
| 4 | **Tuner.** Prompt and QA, like Surabhi | fix a live bot after feedback ("it ends abruptly") | ad hoc, under pressure | medium |
| 5 | **Partner adopter.** An NGO, state mission or another foundation | run the skill in their own accounts, city and language | rarely, high stakes | varies |
| 6 | **The agent.** Claude reading `SKILL.md` | follow the skill without a human filling the gaps | every run | literal reader |

The agent is on this list on purpose. Half the lessons are places where the docs told the agent something false: "agents can only be created in the dashboard", "GET returns empty instructions", "the key is in project memory". If the agent can't follow the skill, every human persona feels it as "the build stalled".

---

## 2. Personas and empathy maps

### Persona 1: Arjun, the Builder

> "I have the infographic and the manager's steer. Do the whole thing and don't come back to me unless you need a key."

**Who:**
- A product and research consultant who makes one or two use cases a week to show funders and state partners.
- Judged on how fast a believable demo exists.

**Goal:** a bot that rings his phone and a map that opens without a login, both in the same afternoon.

| Says | Thinks |
|---|---|
| "The point is for you to do all this without me." · "You're supposed to do bot-to-bot testing." · "Learn from mistakes and push them to GitHub." | Every question back to me is time I don't have. If it breaks in front of my manager, that's on me. |
| **Does** | **Feels** |
| Pastes an infographic, answers 3–4 spec questions, approves personas, enters keys in Lovable when asked, clicks Call himself. | Impatient with set-up steps. Burned when something "done" fails live: the 401 on the call button, calls that end abruptly. Proud when lessons compound. |

**What hurts:**
- Credentials have to be added by hand in every project: the Raya key, then the Maps key.
- Agent steps report "done" when they aren't.
- The same mistake can come back on the next use case.

**Must be true for him:**
- One set-up, then hands-off builds.
- Anything marked "done" has been tested on the real path.

**To check:** do other builders want the same hands-off style, or more control?

### Persona 2: Meera, the First-time Builder

> "My manager sent me this Orange Dots slide and said 'use the skill'. Where do I even start?"

**Who:**
- Joined the programme last month and is comfortable with ChatGPT and Claude.
- Has never touched Raya, the Lovable connector, Vertex or a private GitHub repo.

**Goal:** a first prototype she isn't embarrassed by, without breaking anything shared.

| Says | Thinks |
|---|---|
| "Which keys do I need?" · "Is it OK that it remixed someone's project?" · "What's a tester agent?" | Am I allowed to touch the shared tester? Will I overwrite Aryan's bot? What happens if I use a real hostel's phone number? |
| **Does** | **Feels** |
| Reads the README, gets lost in 30 files, asks a colleague, copies an old project by hand. | Anxious about breaking shared accounts. Overwhelmed by jargon: DID, `agent_args`, remix, edge function. Relieved by a checklist. |

**What hurts, from what already happened in this chat:**
- The repo is private, so raw links return 404 (lesson 5).
- Several secrets live in several places: `raya/.env`, Lovable Secrets, a service-account file, a GitHub token.
- The IAM role she needs has been renamed (lesson 20).
- Rules she'd only learn by breaking them:
  - no Lovable images;
  - faces must be visible;
  - dummy data only;
  - no caste or origin labels;
  - end every call with Goodbye.
- Shared things she can damage without knowing:
  - the tester agent's persona;
  - the tester number, which is also registered as a Purple Dots test seeker;
  - other people's projects.

**Must be true for her:**
- A guided first run that checks her access before any build starts.
- Plain words.
- Hard stops before anything shared or public.

**To check:** what access do new joiners actually get on day one? Who issues the Raya key?

### Persona 3: Vineela, the Reviewer

> "I need to show Red Dots to the transport department on Thursday. Is it safe to demo?"

**Who:**
- Runs the programme, sets priorities ("emphasise accommodation and child care") and presents to partners.
- Doesn't run the skill herself.

**Goal:** confidence that the prototype is accurate, safe and demo-ready, without reading code.

| Says | Thinks |
|---|---|
| "The copy seems misleading." · "The team says it ends abruptly." · "All data must be dummy. No caste terms." | One wrong number or one real person's phone on a public map is a reputational risk. |
| **Does** | **Feels** |
| Opens the link, clicks around, places a call, sends one-line feedback through the builder. | Exposed when a demo fails. Frustrated when the same class of issue shows up again across use cases. |

**What hurts:**
- She has no single "is this ready?" view.
- Problems surface late, in a meeting or after the team tries it, and the reasons reach her second-hand.

**Must be true for her:**
- A short, plain readiness report per prototype, against her criteria:
  - all dot types visible;
  - no login;
  - dummy data;
  - no sensitive terms;
  - calls end cleanly.

**To check:** which criteria does she apply that we haven't seen yet, such as accessibility, language or partner branding?

### Persona 4: Surabhi, the Tuner

> "Partners say the bot hangs up mid-question. I need to know why before tomorrow's call."

**Who:** runs stress tests and edits live prompts, often straight in the Raya dashboard.

**Goal:** find the cause from real calls, fix it, prove it's fixed, and leave a record.

| Says | Thinks |
|---|---|
| "Which version is live?" · "Did the change break another persona?" | The repo and the live agent may have drifted. Is someone else using the tester line right now? |
| **Does** | **Feels** |
| Pulls transcripts, edits the prompt, runs a few calls, updates the changelog when she remembers. | Rushed and wary. Satisfied when a replay of the bad call passes. |

**What hurts:**
- Field names that are easy to misread: the transcript is in `call_transcript`, not `transcript`.
- The tester's own personas are too polite, so they miss real behaviour.
- One shared tester number for everyone.

**Must be true for her:**
- A path that runs real calls → replay tester → fix → regression test → changelog.
- A live-vs-repo diff before any edit.

**To check:** how often is the dashboard edited directly? Should the skill refuse to deploy when live ≠ repo?

### Persona 5: Rohan, the Partner Adopter

> "We run a livelihood mission in Odisha. Can we make Blue Dots for Ganjam in Odia with our own accounts?"

**Who:** a programme or tech lead at a partner. Has their own Lovable, their own telephony, maybe their own LLM budget.

**Goal:** reuse the method without EkStep's accounts, people or assumptions.

**What hurts, from the skill as written today:**
- EkStep-specific details are hard-coded:
  - workspace ID `5mdf5lcGjqX0MUaRc1ZX`;
  - Aryan's local paths;
  - the remix bases;
  - the tester DID;
  - the Gemini service account.
- Hindi is the default everywhere.
- "Ask Aryan" is assumed in places.
- The Hindi worked examples break when names change (lesson 51).

**Must be true for him:**
- Every EkStep-specific value lives in one config file.
- A language choice at the start.
- A version of the method that works with no EkStep account.

**To check:** do partners want to run it themselves, or would they rather EkStep runs it for them? This decides how much to invest in portability.

### Persona 6: The Agent

**What hurts:**
- Docs that lag reality. Wrong statements about Raya cost several lessons.
- Instructions that can't be checked, such as "make sure it works".
- Rules scattered across 30 files.

**Must be true:**
- A short list of non-negotiables at the top.
- Every "done" tied to a test it can run.
- A config to read instead of IDs scattered through the text.

---

## 3. Journey map

The journey runs from "I have an infographic" to "it's live and someone uses it". It is drawn for Meera, the first-time builder, the hardest case. The other personas' extra pains are marked **[R]** Reviewer, **[T]** Tuner, **[P]** Partner.

| Stage | Doing | Thinking / feeling | Pain points (evidence) | Opportunity for onboarding |
|---|---|---|---|---|
| **1. Hear about it** | Gets a slide and "use the skill" | Curious, unsure if it's for her | No one-line description of what the skill produces and how long it takes | A 30-second "what you'll get" with a real example: Pink Dots, bot and map |
| **2. Get access** | Hunts for the repo, keys and connectors | 😟 Lowest point. Blocked, asking around | Private repo, so raw URLs 404 (L5). Keys in four places. Vertex role renamed (L20). GitHub token per repo, so 403s (Snowbell journal). **[P]** none of these accounts exist | **Preflight.** Check each access live, say exactly what's missing and who grants it, store nothing secret in chat |
| **3. Learn the rules** | Skims SKILL.md and LESSONS.md | Overwhelmed: 51 lessons | Rules learned by breaking them: Lovable images, faces, dummy data, sensitive terms, Goodbye (L6, L10, L23, L48–49) | **Ten non-negotiables on one screen**, each with its reason, confirmed once |
| **4. Brief** | Turns the infographic into a spec | Some confidence | Questions arrive one at a time. Geography, language and name get asked late | **One intake round.** Read the infographic, propose the full spec, ask only what can't be inferred |
| **5. Content** | Personas, data, copy, photos | Engaged | Real orgs slip into the data (L48). Taglines over-promise (L29). Wide photos (L23) | Generate dummy data by default. Copy and photo checks run before anything goes to Lovable |
| **6. Build** | Raya agent, Lovable remix, wiring | Hopeful, then puzzled | Copies lose secrets (L35, L37). Wrong remix base (L1, L25). Lovable timeouts (L3). **[P]** hard-coded workspace | Use the latest finished base. **Ask for each secret at the start**, then confirm it's live with curl |
| **7. Test** | Bot-to-bot calls, website path | Relief, or panic | Tests skipped the website path (L34). Tester personas too polite (L47). Shared tester number collides with Purple Dots. **[T]** live ≠ repo | Test the website path first. Include replay-style tester personas. Reserve the tester and put its persona back |
| **8. Review and demo** | Sends links to the manager | 😬 Exposed | **[R]** No readiness view. Issues found in the meeting: abrupt calls, misleading copy, real data | A **readiness report**: five audit checks plus test-call results, in plain words |
| **9. Live and feedback** | Team and partners use it | Proud, then pinged | **[T]** "Ends abruptly", but which calls? Needs real-transcript triage (L45–47) | A "fix from feedback" path: pull calls, replay, fix, regress, changelog |
| **10. Learn back** | Writes lessons, pushes | Satisfied | Push fails with a token issue. Lessons pile up unsorted (51 now) | Fold lessons into the right doc. Keep LESSONS.md as history, not required reading |

**The emotional low points** are stage 2 (access), stage 8 (demo) and stage 9 (field feedback). Stages 2 and 3 decide whether a first-time builder tries again. Stage 8 decides whether a reviewer trusts the next prototype.

---

## 4. What this means for an onboarding skill

Onboarding is not a tutorial. It is the **first 20 minutes** that make the next 20 builds safe. From the map, it has to do these things:

1. **Find out who you are and route you:**
   - build;
   - review a prototype;
   - fix a live bot;
   - set up for a new organisation.

   Each route has its own short path; a reviewer never sees API keys.
2. **Run a preflight with live checks, never assumptions.** Check:
   - repo access;
   - `raya/.env` present and the key valid;
   - Lovable connector and workspace;
   - Google image access;
   - git push rights;
   - tester agent free.

   Name exactly what's missing and who can grant it.
3. **Teach the non-negotiables once:**
   - dummy data;
   - no sensitive terms;
   - Gemini images only, faces visible;
   - Goodbye close;
   - test the website path;
   - remix the latest base;
   - copy says what the bot does;
   - never move a working site onto something untested.
4. **Write a local config** (`config/local.json`, git-ignored):
   - workspace ID;
   - tester agent and number;
   - remix bases;
   - language default;
   - clone path.

   The rest of the skill reads from it, so a partner can swap in their own.
5. **Offer a first build at low risk:** a dry run that writes a brief and personas for a sample infographic without touching shared accounts.
6. **For reviewers:** produce a readiness report for any prototype against the audit checklist.
7. **Close the loop:** record the person's role and preferences, so the next run skips onboarding.

## 5. Open questions to settle before building

1. Who issues Raya keys and the Lovable workspace invite to a new joiner? (Persona 2)
2. Should onboarding *create* a personal tester agent per builder, to end the shared-number collisions? (Personas 2, 4)
3. Partners: do we make the skill run outside EkStep accounts now, or later? (Persona 5)
4. Does the reviewer want the readiness report in chat, as a page, or posted somewhere? (Persona 3)
