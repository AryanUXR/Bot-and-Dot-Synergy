# Bot Prototype — Post-Build Checklist

Run through this before sharing the prototype URL.

```
VISUAL
□ Bot name correct in Nav
□ Tagline correct
□ Primary colour applied correctly across cards and buttons
□ All three persona cards visible and distinct

PERSONAS
□ Persona card images uploaded (via image-generation pipeline)
□ Persona modal opens correctly for each persona
□ Traits display correctly (no truncation)
□ About paragraphs display correctly (2-3 paragraphs)
□ Sample questions display in correct language (Devanagari for Hindi bots)
□ Dropdown labels correct in CallForm selector

CALL FLOW
□ Persona dropdown works — selecting a persona pre-selects in CallForm
□ Country code selector shows correct default
□ Phone number input accepts digits only
□ Submit button disabled until valid phone + persona selected
□ Call initiates successfully (test with your own number)
□ Raya picks up and introduces the correct persona by name
□ Rate limit: wait 20+ seconds between test calls

SUPABASE
□ RAYA_API_KEY set in Supabase Edge Function secrets
□ RAYA_AGENT_ID_[BOTNAME] set correctly
□ initiate-call edge function deployed

POST-CALL
□ Call log appears in Supabase (if call_log table is configured)
□ Caller data written to dots table (if async sync is configured)

TESTING — TIER 1 (Fix verification — required before marking done)
□ Tester persona file written and linted (scripts/persona_lint.py — zero ERRORs)
□ Tester persona loaded onto testing agent (scripts/raya_testcall.py persona)
□ End-to-end test call completed (scripts/raya_testrun.py)
□ Bot transcript reviewed — correct persona name, correct language, tool calls fired
□ call_output fields correct (journey completed, no unexpected drop_reason)

TESTING — TIER 2 (Blast-radius regression — required before sharing prototype URL)
□ Test with each of the 3 personas in turn
□ Test with an invalid phone number (confirm graceful error, no crash)
□ Test with a second call within 15s (confirm rate limit handled — no silent failure)
□ Read transcript with scripts/raya_call.py and verify tool_calls arguments
```
