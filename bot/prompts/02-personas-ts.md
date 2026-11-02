# Bot Prompt 2 — personas.ts Replacement

Send this after Section 1 builds successfully.

Write the full `personas.ts` content using the schema in `bot/personas-schema.md` and the writing rules from `content/persona-writing-guide.md`.

---

```
## Section 2: Replace personas.ts

Replace the entire contents of src/data/personas.ts with the following:

[PASTE FULL GENERATED personas.ts HERE]

Do not change anything else. Only replace this file.
```

---

## How to generate the personas.ts content

1. Read `bot/personas-schema.md` for the TypeScript interface
2. Read `content/persona-writing-guide.md` for writing rules
3. Read `content/anti-slop-rules.md` and apply before finalising
4. Generate 3 personas: early-stage seeker, mid-stage seeker, provider/mentor
5. Ensure `id` slugs match exactly what the Raya system prompt expects as `${persona}`
6. Apply `content/anti-slop-rules.md` to all traits, about paragraphs, and questions
7. Paste the complete generated file into the prompt above
