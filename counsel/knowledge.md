# Blue Dots: what the documents say (knowledge base for the counsel skill)

Everything here comes from EkStep's own documents and docs site, kept in `sources/`:

| Key | Source |
|---|---|
| **KD** | *The Blue Dots^AI Economy: Key Details* (21 pages), `sources/blue-dots-ai-economy-key-details.pdf` (text: `.txt`) |
| **GZ** | *[Blue Dots] Ghaziabad Future Ready* deck (15 slides), `sources/ghaziabad-future-ready-deck.txt` |
| **PQ** | *Blue Dots Personas and Question Map* (11 Oct 2026): who asks what, by phase, and how well docs.bluedotseconomy.org answers it. `sources/blue-dots-personas-and-question-map.docx` (text: `.txt`) |
| **DS** | Five pages of EkStep's docs site, docs.bluedotseconomy.org, fetched 19 Nov 2026 (pages last updated 16 Nov): *Blue Dots as a DPG*, *Schema-Driven Model*, *Customisation & Branding*, *Cost & Sizing*, *AI Diffusion DPG*. `sources/docs-site-selected-pages.txt` |

Cite a figure by its fact id, e.g. **[F23]** (see `facts.md`). Cite anything else as **(KD p.N)**, **(GZ slide N)**, **(PQ)** or **(DS: page title)**. When a question needs a fact that isn't here, read the source text. If it isn't there either, say so plainly and never estimate.

---

## 1. The idea in one paragraph

Across India's districts, people, businesses and service providers are often a few kilometres apart but can't find each other. Much of this activity is **"digitally dark"**: present on both sides, yet invisible to the other (KD p.1). Blue Dots makes local demand and supply discoverable to one another:
- A person, business or provider says **who they are, what they have and what they want**, in their own language, in a voice conversation.
- That takes **about 1 minute 40 seconds and costs about ₹2**, against about ₹500 and two weeks through field surveys [F40].
- That intent becomes a **Blue Dot**: a relevant, nearby signal that others can discover and act on.

## 2. Core concepts

- **The paradox of proximity:** demand and supply sit close together, yet stay invisible to one another (KD p.3).
- **Why discovery breaks down:** (KD p.3)
  - searching costs time and money;
  - credibility is hard to establish (two in three people answer only numbers they recognise [F41]);
  - reaching an opportunity costs travel.
- **Personalised, proximal discovery** is the unlock. (KD p.4–5)
  - *Personalised:* relevant to the person's need, capability and circumstances.
  - *Proximal:* close enough to act on, with "close" defined by the person and the journey, not a fixed radius.
- **A Blue Dot** is intent, structured, consented and placed on a shared local map, where relevant people and institutions nearby can find it and act on it. A dot can be reused as needs change (KD p.5, p.17).
- **Why now: DPI 2.0 and AI.** NITI Aayog's April 2026 *DPI@2047* roadmap uses the term "blue dot" itself, in "MSME Jobs Finding Local Talent" and "Benefits finding Beneficiaries" (KD p.5). Voice AI makes discovery viable in Tier 2 and 3 India: high-intent callers in Ghaziabad talked for 10 minutes or more [F6].
- **From efficiency to productivity.** Lower discovery cost saves time and money, and raises productivity: closer hires stay longer, and matches improve. Income earned locally is spent locally, so districts become "counter-magnets" to migration, as Ghaziabad's Chief Development Officer put it (KD p.4).

## 3. How every implementation is built (KD p.5–6, Appendix A p.18–19)

1. **Persona and problem:** a specific person, business or organisation, and a concrete discovery problem. This decides whose intent is captured, what "nearby" means and what a useful connection looks like.
2. **Institutional anchor** from *samaaj, sarkaar or bazaar* (society, government or market): district administrations, a ministry or department, a foundation, an association. The anchor brings relationships, local knowledge and ownership.
3. **Local ecosystem.** Institutions people already recognise (MSME associations, ITIs and colleges, NGOs, self-help groups, ASHA supervisors, district departments) act as **aggregators**, bringing people in, and as **providers**, responding to visible demand.
4. **Enablers:** startups, training organisations and service providers who build services on the demand that becomes visible.
5. **Solution:** three parts.
   - voice AI agents that capture intent in the person's own language;
   - a shared map where intent becomes discoverable;
   - open Digital Public Goods that structure, verify and connect it. These are the Signal component (who I am, what I want, what I have), the Aggregator component and the map interface (KD p.20).

**Technology is about 30% of the work; the local ecosystem is the other 70%** [F36].

## 4. The colours (KD p.6–7, Appendix B p.19–20)

| Colour | Area | What becomes discoverable | Status in KD |
|---|---|---|---|
| Blue | Livelihoods | Work, counselling, skilling, entrepreneurship support, and the people seeking them | Live: Ghaziabad, Hubli-Dharwad; UP and Karnataka scaling |
| Purple | Disability | Services, assistive devices, schemes and opportunities for persons with disabilities, and their providers | Live in Basti; rolling out under a DEPwD MoU [F63] |
| Yellow | Education and skilling | Tutors, coaching, learning and credentials, and learners | mySATHI Foundation with CL Educate and IIT Kharagpur |
| Orange | Tourism, arts and culture | Experiences, homestays, artisans, performers, guides, and tourists | OneTAC, Udupi [F80] |
| Brown | Enterprise (emerging) | Markets, suppliers, services, capital and schemes for businesses | MSME associations (AIMO, IIA, KCCI), UP MSME Department |
| Golden | Welfare and public services (emerging) | Schemes, benefits, public services and last-mile support, and eligible citizens | Under discussion with a state government (KD p.13) |
| Red | Emergency help | (being discussed) | Being discussed (KD p.19); GZ slide 13 lists the Assam transport department under Emergency, with no status |
| Green | Agriculture | Farmers, buyers, equipment providers, local institutions | Area for exploration |
| Pink | Women's work | Flexible, nearby work and support for women joining or returning to the workforce | Area for exploration |
| White | One household | A household's needs across all its members, in one view | Area for exploration |

Also named as areas for exploration: financial access, health and care, and government schemes (KD p.20). **These are not evidence from current implementations** (KD p.20). Say so when you counsel on them.

## 5. Evidence: every figure lives in the facts table

**Every figure about Blue Dots is in `facts.md` (generated from `facts.json`), one row per figure, with its place and the exact source sentence.** Use no figure that isn't there. Before stating one:
1. Find its row by topic.
2. Say the place the row gives. A row for Hubli-Dharwad is never a Ghaziabad result, and a row for "Across the pilots", "Blue Dots overall" or "National" is never put under one district.
3. Cite the row's id in square brackets, e.g. [F23]. The id shows as its source to the reader.
4. Use the row's words for the figure (over, under, about, nearly), not rounder or stronger ones.

`counsel/check_facts.mjs` checks every row against the source text; run it after any change.

**What has not been shown yet** (no figures; say these plainly)
- **Purple Dots:** the district rollout has only just gone live in Basti, so outcomes are still emerging (KD p.9). RCI-registered professionals list free, and contact is shared only once both sides consent (KD p.9).
- **Yellow Dots:** a credential that stays with the candidate and appears on a map is the plan; the analytical map of the BFSI candidate pool is a next step, not yet built (KD p.10).
- **Orange Dots:** commission-free and not a booking platform; practitioners are validated by the district; the tourist side opens in November 2026 (KD p.11).
- **Brown and Golden Dots** are emerging; Golden Dots is under discussion with a state government (KD p.12–13).
- **Pink, Green and White Dots** are areas for exploration, with no implementation (KD p.20).
- **Beyond India** (KD p.3; GZ slide 14): the UAE Prime Minister's Office is an advocate. GZ slide 14 shows South Africa (entrepreneurship) and Egypt (livelihoods) as starting, and Thailand, Ghana, Rwanda and Sri Lanka as in talks.
- **Where sources differ:** GZ slide 14 shows Purple Dots live in 10 districts; KD says 14 under the DEPwD MoU [F63]. Use KD.

## 6. Learnings to draw on (KD section 5; cite the page, or the fact id for a figure)

| # | Learning | Short form | Page |
|---|---|---|---|
| 5.1 | Demand and supply already exist but stay unseen | Visibility is often the first constraint, not absence | KD p.14 |
| 5.2 | Speaking reveals demand that forms miss | Each extra need captured costs little more effort [F35] | KD p.14 |
| 5.3 | Livelihoods is more than a job | Counselling, skilling, credit and starting a business are pathways too | KD p.15 |
| 5.4 | Discovery exposes participation gaps | Many women held back until they knew about safety, proximity, amenities and shifts [F32] | KD p.15 |
| 5.5 | Proximity changes the economics | "Local" is often very close, defined by the person and the journey [F37] [F111] [F112] [F113] | KD p.15 |
| 5.6 | Earning and spending locally | A local job can leave more disposable income than a metro one | KD p.15 |
| 5.7 | Lower discovery cost widens participation | Remove steps; complete the action within the call | KD p.15 |
| 5.8 | The cost of acquiring customers falls | Discovery time drops [F38]; in Hubli-Dharwad, training organisations cut mobilisation costs [F25] | KD p.16 |
| 5.9 | Credentials make talent legible | Credentials can shift where employers create demand | KD p.16 |
| 5.10 | Credibility carries discovery | Cold AI calls plateau [F34]; use institutions people know, inbound numbers and verification | KD p.16 |
| 5.11 | Aggregated demand becomes local intelligence | Shift and bus mismatches in Hubli-Dharwad [F24]; what women look for | KD p.17 |
| 5.12 | Technology is a small part; the ecosystem is most of the work [F36] | A Joint Facilitation Centre plus weekly reviews | KD p.17 |
| 5.13 | Value extends beyond the first connection | A dot is reused as needs change | KD p.17 |

## 7. Who asks, and what they ask (PQ)

**Seven personas.** Adopters own the deployment and hold convening authority. Enablers are tech partners who help adopters put the approach and the DPGs into their context. In most cases adopters need enablers. District, state and central adopters ask largely the same questions; a few are central-only.

| Group | Persona | Who | Owns |
|---|---|---|---|
| Adopter | Decision Maker | DM, Secretary, Mission Director, Joint Secretary | The decision, budget, convening authority, sustained attention |
| Adopter | Implementation In-charge | CDO, nodal officer, state IT cell, programme director | Enablers, aggregators, rollout and reporting |
| Adopter | Network Operator | An organisation running its own network, or a node in a shared one | Its network, participants and their data |
| Enabler | PMU (programme management partner) | A consulting firm acting as the adopter's PMU | Design, governance, rollout, reporting |
| Enabler | SI (system integrator) | A technology implementation partner | Deploying, configuring, integrating and operating the DPGs |
| Enabler | Voice AI provider | Speech, LLM and telephony | The stack behind the voice agents |
| Enabler | Cloud or hosting provider | Public cloud, government cloud, or own data centre | The infrastructure the DPGs run on |

**Three phases:** *Setup* (deciding and standing it up), *Pilot* (the first district running, building density and outcomes), *Scale* (more districts or use cases, interoperability, sustainability).

**Typical questions** (full list in the source):
- *Decision Maker.* Setup: why this, and how is it different from my portal? Why a DPG? Is it like ONDC? What does it cost? Which use case first? What is my role? What does EkStep do? Pilot: what share of dots leads to an outcome, is any outcome guaranteed? Scale: other districts, other domains and colours, keep enablers or hand over, who owns the dots.
- *Implementation In-charge.* Setup: which enablers and how to procure, who leads, own infrastructure or new, which officials, local anchor, aggregators, minimum data per dot, camps, no field team, languages, voice or WhatsApp, time to go live. Pilot: tracking journeys, verification, bad actors, enabler reporting, voice vendor, cost, proximity. Scale: connecting portals and departments, adding languages, enablers carrying over.
- *Network Operator:* discovering supply and demand for my network; whether I must share dots back; data accountability.
- *PMU:* the activation playbook, PMU vs SI roles, success metrics, aggregator convenings, review cadence, multi-district teams, handover to government.
- *SI:* configuration vs build, clouds and OS, GPUs, connecting data, concurrency, voice integration, DPG upgrades, adding instances and domains.
- *Voice AI provider:* integration points, language and pricing baselines, dialects, concurrency, one agent in many languages, pricing at volume.
- *Cloud or hosting:* pilot sizing, self-hosting, security and VPN, data residency, multi-district tenancy.

**What the docs site answers** (as of 11 Oct 2026): of 69 questions, 16 answered, 31 partly, 22 not at all [F45]. Strongest on the Decision Maker's "why" and on pilot evidence; weakest for enablers. The site sections PQ names are useful pointers: *Introduction, Approach, Blue Dots as a DPG, District Activation, The Dots Family, Use Cases, Pilots, What We're Learning, Participant Profiles, Blue Dot Lifecycle, Aggregators, Networks Domains & Instances, AI Voice Agent Prompts, AI Diffusion DPG, Infrastructure & Deployment, Adaptor Onboarding, API Reference*.

Facts PQ reports from the site (cite as "per PQ, the docs site says…"):
- District Activation: the use case to start with, the decision maker's role (convening, signal, sustained attention; a Collector-level champion with a Secretary or Mission Director sponsor), officials to bring in (DIC, employment exchange, Joint Facilitation Centre), success metrics, and going live in **under 90 days** (no technical setup time given) [F43].
- A facilitation team of **6 to 8** with a small PMU (Approach) [F44]. One district only.
- Cost: only **"under ₹10 per voice interaction"** (Pilots) [F42]. No capex or opex.
- Languages documented: Hindi and Kannada. WhatsApp is planned (AI Diffusion DPG).
- Deployment documented for AWS EKS and local Docker only; TLS, Kong rate limiting and Keycloak, no VPN.
- No one owns the map; sharing is by consent. Data ownership is not stated.

**Known gaps, in PQ's priority order:**
1. Cost: capex, opex, optimisation.
2. Enablers: which ones, procurement, PMU vs SI split, reporting, handover.
3. EkStep's role.
4. Sizing: concurrency, pilot sizing, GPUs.
5. Clouds beyond AWS, data residency, VPN.
6. Data ownership, sharing obligations, use by central ministries.
7. Effort to add a language or dialect.

The Network Operator has no pilot-phase questions yet.

**Where PQ and KD differ, use KD and say so if asked.** PQ quotes the site as "70% of applications within 15 km" and "about 50% vs about 5% in targeted drives". KD says over 70% within **5 km** (KD p.7) and over 50% at targeted drives against under 10% at broad job fairs. The site wording may differ from KD; KD is the fuller write-up with its sources. Some EkStep research on Ghaziabad uses 70% within 15 km, from operational data that is not in these sources; if asked about the difference, say the figures come from different data and suggest the EkStep team.


## 8. Practical answers from the docs site (DS)

Four questions officials and enablers ask early, answered from EkStep's docs site. Where KD and DS differ, use KD for evidence and DS for how the software works and what it costs.

**Why a DPG, and is it like ONDC?** Blue Dots is built as Digital Public Goods: open-source building blocks any organisation can deploy, run and extend, so no single company owns it and no one owns the map. The docs site compares it to UPI: as UPI lets any bank or app send money through one shared system, Blue Dots lets anyone list what they need or offer, and others find them through the same shared rules. Instances talk to each other through an open protocol (DS: Blue Dots as a DPG). **The documents do not compare Blue Dots with ONDC.** Give the UPI comparison, say there is no ONDC comparison in the documents, and suggest asking the EkStep team for one.

**What is configuration and what is build?** Most of a deployment is configuration, not code:
- **Configuration (no code changes):** which domain (colour) a deployment runs, its fields and forms (schema files such as `network.json`), consent text, branding (logo, colours, language), operational settings (SMS gateway, the phone number for voice calls, admin emails), dashboards and the landing page. "A new district or state can start without a custom build each time" (DS: Blue Dots as a DPG; Schema-Driven Model; Customisation & Branding).
- **Build or set-up work:** standing up the infrastructure (scripts exist for AWS; other clouds need adapting), integrating with existing systems, a new colour that has no published minimum standard yet (Pink, Green and Brown have none), and anything beyond the reference set-up such as firewalls and security controls (DS: Schema-Driven Model; Cost & Sizing).
- Published minimum standards: Blue (jobs), Yellow (education), Purple (disability) and Orange (tourism) (DS: Schema-Driven Model).

**What does it cost to run, and how big a setup?** Point to the **cost calculator**, https://cost-calculator.bluedotseconomy.org/. It takes the expected number of blue dots (10,000 to 5 lakh [F56]), how many are active in a month, the cloud (AWS, Azure, GCP, Tata Cloud or NIC MeghRaj), and whether a test copy, high availability or a disaster recovery site is needed. It gives the monthly and annual cost and a bill of quantities for procurement (DS: Cost & Sizing). Example, for 1 lakh blue dots with 10% active a month on AWS, at list prices without GST [F50] [F51] [F52] [F53]:

| Setup | Cloud a month | Total a month (adds SMS, voice, maps) |
|---|---|---|
| Standard | ₹47,973 | ₹85,973 |
| Standard with a test copy | ₹95,134 | ₹1,33,134 |
| High availability | ₹1,33,273 | ₹1,71,273 |
| High availability with a DR site | ₹2,72,534 | ₹3,10,534 |

- A standard setup (2 servers) serves about **60,000 active blue dots a month**; high availability (3 servers) about **1,20,000** [F54].
- Voice AI calls are assumed at one 3-minute call a month per active blue dot at ₹1 a minute; SMS at 4 a month at ₹0.20 each [F55].
- **Not included:** one-time setup work, staff to run and support it, firewalls and security controls beyond the basic one, and negotiated discounts. Say these are "indicative list prices, not a quote" (DS: Cost & Sizing).

**Voice or WhatsApp?** Voice works today. A **WhatsApp channel is planned**, not available (DS: AI Diffusion DPG). Prototypes from this skill are voice only. Languages documented on the site are Hindi and Kannada (PQ).

**Still not answered by any source:** a direct ONDC comparison, full costs including setup and staff, procurement and the PMU/SI split, EkStep's role, data ownership, and the effort to add a language.


## 9. The PM Internship Scheme (PMIS), for demos built around it

Source **PMIS**: the official portal https://pminternship.mca.gov.in/ and its FAQs for candidates, companies and states (Ministry of Corporate Affairs), captured 20 Nov 2026 in `sources/pm-internship-scheme.txt`. Cite as [PMIS: Candidate FAQ], [PMIS: State FAQ], [PMIS: Company FAQ] or [PMIS: portal home]. PMIS is a separate government scheme: its facts are about PMIS, never Blue Dots results, and its figures are in the facts table (F130 to F137).

**What it is.** A Government of India scheme, anchored by the Ministry of Corporate Affairs, that offers paid internships in top companies to young people not in full-time work or full-time education, to make them more employable. It runs end to end through the PMIS portal and mobile app, with money paid by Direct Benefit Transfer [PMIS: State FAQ]. It doesn't guarantee a job [PMIS: Candidate FAQ].

**Who can apply.** Indian citizens aged 18 to 25 who have passed 10th or 12th, or hold an ITI certificate, a polytechnic diploma, or a graduate or postgraduate degree, and who aren't in full-time employment or full-time education [F132]. Not eligible: graduates of institutions such as IITs, IIMs, IIITs, IISc, IISER and NLUs; holders of CA, CMA, CS, MBBS, BDS, MD, MS, MBA, MPhil or PhD; anyone in or done with a government skilling, apprenticeship or NATS/NAPS programme; and families with income above ₹12 lakh [F134] or a permanent government employee [PMIS: Candidate FAQ]. (The State FAQ also lists NITs; the Candidate FAQ doesn't. Say so if asked.)

**How it works for a candidate.** Register free with Aadhaar e-KYC on the portal or app, which supports several Indian languages; browse by state, district, sector, role and qualification; apply to up to 3 at a time [F136]; companies see a shortlist the portal shares; accept an offer within 14 days [F136]; at least half the internship is spent at the workplace [PMIS: Candidate FAQ]; money as in F133; a completion certificate is issued jointly by MCA and the company [PMIS: portal home]. Help: complaints on the portal, a chatbot, and the helpline [F137].

**How states and districts take part** [PMIS: State FAQ]: a State Nodal Department brings together Skills, Higher Education, Industries and Labour; a State Nodal Officer and State PMIS Cell run outreach and weekly reviews; a **District Nodal Officer drives outreach to ITIs, polytechnics, colleges and employment exchanges, and on-ground counselling**. States review registrations, applications, offers pending, joining, dropouts and complaints weekly, filtered by district.

**Where Blue Dots fits** (say this carefully): the Ministry of Corporate Affairs is enabling the Blue Dots rails through the PM Internship Scheme [KD p.8]. The portal already lets young people search close to home by district [PMIS: portal home], and Blue Dots evidence says nearness decides whether an internship is taken [F113]. A natural prototype: a voice bot young people in one district can call, in their language, to find PMIS internships nearby, check eligibility and get help applying, with the district's colleges, ITIs and employment exchange as the local ecosystem, and a map of nearby host companies. Don't claim any integration, data sharing or official endorsement beyond KD p.8; say the details are for MCA and the EkStep team.
