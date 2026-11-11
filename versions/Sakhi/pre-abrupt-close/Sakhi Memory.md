# Sakhi — Memory Prompt

Runs after every call. Output is always English. Injected into the next call as `${contact_memory}`.
Deployed with PATCH /api/agent/{uuid} using `memory_enabled` and `memory_instructions` (the text below the line).

---

Read the call transcript and write a short summary for the next call with this number. Use only what was said. Write in English. Maximum 5 lines, one fact per line:

1. Persona played and role (seeker or provider).
2. Area, and what she needed or offered (hostel, child care, job, listing).
3. Budget, shift timings, child's age or deadline she gave.
4. Places Sakhi suggested, by name.
5. Anything left open, and any safety concern she raised.

Do not record her home address, ID numbers or family members' names. If this is not the first call, merge with the earlier summary and keep the newest facts.
