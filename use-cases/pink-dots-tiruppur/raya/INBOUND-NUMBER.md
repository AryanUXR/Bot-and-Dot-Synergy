# Pink Dots inbound: number status

**Status (14 Nov 2026):** the inbound agent `Sakhi Hindi Inbound · Pink Dots Tiruppur` (`d37ecf8d-cacf-4d75-a6d3-4fc142e99b75`) is built and has passed one real inbound call. **It has no number.** Every borrowed number was returned and checked.

## What was tried

| Number | Borrowed from | Result | Returned |
|---|---|---|---|
| 917946350283 | Testing Agent- Purple Dots (`3abfc4ca`), idle since 10 Nov | ❌ **Doesn't route.** Two calls connected for 3–7 s; a "hello" answered and no agent on the account logged the call | ✅ back on `3abfc4ca` |
| 911204404272 | Testing Agent- Blue Dots (`f60e0899`), our tester | ✅ **Routes.** Inbound call `d76a20ee`, 133 s, passed (see below) | ✅ back on `f60e0899`; a check call reached the tester at 14:17 (51 s) |

**What this shows:**
- Changing `in_did` moves calls only for numbers that LitWiz has routed to Raya's inbound side.
- `…4272` follows `in_did` both ways.
- `…0283` doesn't route to any agent on this account, including the Purple tester it's set on. All 100 of that tester's recent calls were outgoing. The Purple team should know their tester's inbound line doesn't work.

## Numbers on the account (14 Nov)

| Number | Agent | Why it can't be lent long-term |
|---|---|---|
| 911204404271 | DKB Hindi Signals | real callers, calls today |
| 911204404272 | Testing Agent- Blue Dots | our shared tester (22 calls today from other teams' bots) |
| 911204404274 | KKB Slim Hindi Signals (A/B) | real callers, 10k+ calls |
| 911204413383 | Maya Inbound Signals | real callers from personal mobiles |
| 917946350283 | Testing Agent- Purple Dots | doesn't route |
| 917946350285 | [LATEST INBOUND] Purple Dots | Purple team's inbound bot |
| 918037006352 | KKB Slim Kannada Signals (A/B) | real callers; also the caller ID of 17 bots |

## Passing test call (`d76a20ee`, on the tester's number)
- Greeting: "नमस्ते, मैं सखी बोल रही हूँ, पिंक डॉट्स तिरुप्पुर से। बताइए, आज मैं आपकी क्या मदद कर सकती हूँ?"
- Worked out that Rinki is a seeker from what she said. Asked budget, then named Iniya Women's Hostel (4 km) and Sudar Ladies Hostel (5 km), with the "listed, not checked" sentence.
- Company-hostel warning, plus 181 and the One Stop Centre. Switched to jobs when asked. One closing line, ending on `Goodbye`.
- Output: `story: new-arrival`, `caller_role: Seeker`, `unverified_flagged: Yes`, `helpline_given: Yes`.

## To give Pink a number
1. **Best:** ask LitWiz Labs for one inbound number routed to Raya. Then:
   `python3 scripts/raya_did.py show d37ecf8d-cacf-4d75-a6d3-4fc142e99b75`, and PATCH `{"in_did": <number>}`.
2. **For a demo only:** lend it the tester's number for the session, then move it back:
   ```bash
   python3 scripts/raya_did.py move 911204404272 f60e0899-aa3a-4be7-9b4f-0296bd28ef48 d37ecf8d-cacf-4d75-a6d3-4fc142e99b75
   ```
   ```bash
   python3 scripts/raya_did.py move 911204404272 d37ecf8d-cacf-4d75-a6d3-4fc142e99b75 f60e0899-aa3a-4be7-9b4f-0296bd28ef48
   ```
   While lent, every bot-to-bot test on the account that dials the tester reaches Sakhi instead. After moving it back, place one call to confirm it reaches the tester.

Always confirm with a real call: a stored number doesn't prove the line routes.
