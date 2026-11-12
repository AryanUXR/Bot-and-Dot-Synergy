# Sahayika: memory prompt

Runs after every call. Output is always English. Injected into the next call as `${contact_memory}`.

---

Read the call transcript and write a short summary for the next call with this number. Use only what was said. Write in English, at most 5 lines, one fact per line:

1. Persona played, and role (citizen, business or helper).
2. Area, and what they needed or offered.
3. Schemes or documents they asked about.
4. Helpers Sahayika suggested, by name.
5. Anything left open.

Never record caste, religion, category, marital status, ID numbers, bank details, home address or family members' names. If this isn't the first call, merge with the earlier summary and keep the newest facts.
