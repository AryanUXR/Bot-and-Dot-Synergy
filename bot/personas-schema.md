# Bot Personas — Schema and Writing Rules

## TypeScript interface

```typescript
// src/data/personas.ts

export interface Persona {
  id: string;
  // Slug — lowercase, hyphens only.
  // MUST exactly match what the Raya system prompt expects as ${persona}.

  name: string;
  // First name only for Hindi bots.
  // Full name for English bots (e.g. "Nomsa Dlamini").

  fullName: string;
  // Display name shown in the UI.

  location: string;
  // THE ARCHETYPE LABEL IN CAPS — e.g. "THE TVET GRADUATE", "THE INHERITED CRAFT ARTISAN"
  // This is NOT a geographic location — it is the persona's archetype descriptor.

  locationColor: string;
  // Hex — the accent colour for this persona's card. Can be a shade of the primary.

  gradientCSS: string;
  // CSS gradient string for the card background.
  // e.g. "linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)"

  traits: string[];
  // 4-5 bullet strings shown on the card.
  // Each trait is one concrete fact: age, location, situation, what they have, what they need.
  // No adjectives. No "passionate about". Just facts.

  about: string[];
  // 2-3 paragraph strings shown in the persona modal.
  // Each paragraph is 3-5 sentences. Together they tell a story.
  // See persona-writing-guide.md for the paragraph structure.

  questions: {
    hindi?: string[];    // Devanagari script — never Roman transliteration
    english?: string[];  // English questions for English bots
  };
  // 5-6 sample questions the caller might ask.
  // These appear in the modal as conversation starters.

  defaultQuestionLang: "hindi" | "english";

  dropdownLabel: string;
  // Shown in the CallForm persona selector dropdown.
  // Format: "[Full Name] — [archetype short label]"
  // e.g. "Nomsa Dlamini — TVET Graduate (Wants to Start)"

  experience: string;
  // One sentence shown below the CallForm submit button.
  // Describes what the caller will experience on the call.
}
```

## Critical rules

- `id` must be a lowercase hyphen-slug. It is passed as `agent_args.persona` to Raya. A mismatch breaks persona routing.
- `location` is the archetype label, not a place name. Always `THE [LABEL]` in all caps.
- Hindi bots: questions in Devanagari only. Never Roman transliteration. Never both.
- English bots: omit `hindi` key entirely.
- Image handling: images are generated via the image-generation pipeline and uploaded to Lovable assets. The asset URL goes into the component — there is no `image` field in the TypeScript interface.

## Standard persona set (3 personas)

Every bot uses three personas by default:

| Slot | Type | Description |
|------|------|-------------|
| 1 | Early-stage seeker | Has the skill/qualification, no clients/capital/path yet |
| 2 | Mid-stage seeker | Already earning informally, blocked from scaling |
| 3 | Provider / mentor | Experienced, provides guidance — calls as a provider, not a seeker |

The mentor/provider persona gives stakeholders a provider-side perspective on the same Raya bot.

## Persona card gradient colours

Vary shades of the bot's primary colour across the three personas:

```typescript
const PRIMARY = "#1E40AF"; // bot primary
const personas = [
  { gradientCSS: `linear-gradient(135deg, ${PRIMARY} 0%, #3B82F6 100%)` },    // lighter
  { gradientCSS: `linear-gradient(135deg, #1E3A8A 0%, ${PRIMARY} 100%)` },    // mid
  { gradientCSS: `linear-gradient(135deg, #0F2A6B 0%, ${PRIMARY} 100%)` },    // darkest
];
```
