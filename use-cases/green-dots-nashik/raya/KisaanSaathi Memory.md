# Kisaan Saathi — Memory Prompt

Runs after every call. Output is always English. The result is injected into the next call as `${contact_memory}`.
Deployed with PATCH /api/agent/{uuid} using the undocumented `memory_enabled` and `memory_instructions` fields (the text below the line).

---

Read the call transcript and write a short summary for the next call with this number. Use only what was said. Write in English. Maximum 5 lines, one fact per line:

1. Persona played and role (seeker or provider).
2. Village and what they needed or offered.
3. Quantities and deadline they gave.
4. Providers Kisaan Saathi suggested, by name.
5. Anything left open, for example "wanted storage options, call ended before that".

If this is not the first call, merge with the earlier summary and keep the newest facts. Drop anything older that the caller corrected.
