# Readiness report (for reviewers)

For a manager or programme lead who wants to know whether a prototype is safe to show. It needs no accounts or keys, just the links.

Ask for the bot link and the map link. Then check each line, say how it was checked, and mark it ✅, ⚠️ or ❌.

| # | Check | How to check |
|---|---|---|
| 1 | Map opens without a login | Open the published link in a private browser window |
| 2 | Every dot type is visible | Every filter on, and both request and provider dots on the map. Count dots per filter in the list view |
| 3 | All data is fictional | Open 5 random cards. No real business names, addresses or personal phone numbers; helplines only |
| 4 | No sensitive labels | Scan names and descriptions: first name and initial only, no surnames, caste, religion, origin or marital status |
| 5 | Copy says what the bot does | Read the page title and tagline aloud. Does it promise something the bot doesn't hand over? |
| 6 | Persona faces are clear | Look at each persona card |
| 7 | A call works from the page | Press Call with a reviewer's own number. Confirm a call arrives within a minute |
| 8 | The call ends cleanly | During that call, ask two follow-up questions, then say thanks. It should answer both, then say goodbye once |
| 9 | Map loads on every device | Check on a phone. No "didn't load Google Maps correctly" message |

Checks 1–4 are the four audit checks. If you have the repo, `python3 scripts/audit.py <slug> --map-url <link>` runs them for you; otherwise use the manual steps above.

Write the result as a short plain-language summary: what is ready, what isn't, and who fixes each item. If the builder's test-call results exist, add a line for them. Offer to save the report as a file the reviewer can forward.
