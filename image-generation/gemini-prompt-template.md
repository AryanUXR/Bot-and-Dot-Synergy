# Gemini Imagen — Persona Image Prompt Formula

## Format rules (apply to every persona image)

- Photorealistic
- Horizontal / landscape / 16:9 aspect ratio
- **Face first.** Medium close-up, framed from the waist up. The face is large in the frame, sharply in focus, evenly lit, turned toward the camera with eyes visible, and not covered or shadowed by a scarf or cap brim. A wide shot with a small figure gets rejected.
- Subject in the left half of the frame; context (workplace, field, street) behind them, softly out of focus
- Spell out what must NOT appear when the scene invites a mistake ("the tractor is completely unbranded", "inside the van are only toolboxes, nothing large")
- State the age with visual cues ("only a little grey at the temples") so the model does not age the subject
- No text, logos, readable signage, or watermarks
- Expression aligned to persona's emotional state (not smiling — focused, thoughtful, or quietly determined)
- Specific location markers from the actual geography (landmark, craft setting, market type, urban texture)
- Lighting: natural daylight or golden hour
- End with: `Photorealistic. 16:9 horizontal framing.`

## Prompt formula

```
Medium close-up portrait, framed from the waist up, of a [AGE]-year-old [GENDER] [DESCRIPTION OF WHAT THEY DO] in [SPECIFIC LOCATION IN GEOGRAPHY].
Their face is the clear focus: large in the frame, sharply in focus, evenly lit, turned toward the camera.
[VISUAL CONTEXT: what is around them, what they are wearing, what they are doing].
[EXPRESSION AND BODY LANGUAGE].
[SPECIFIC LOCATION DETAIL: a named area, type of street, type of building visible in background].
Natural daylight. Photorealistic. 16:9 horizontal framing.
```

## Persona type guidance

### Early-stage seeker (wants to start)
- Setting: at home, at a training centre, or on their street — not at a workplace yet
- Body language: looking outward, thinking ahead — not yet doing the work
- Expression: quiet determination, not desperation

### Mid-stage seeker (wants to scale)
- Setting: mid-activity at their actual work — selling, cooking, making, repairing
- Body language: in motion, engaged with a product or a customer
- Expression: focused, slightly frustrated by constraints

### Provider / mentor
- Setting: a professional context — an office, a counter, a coaching space
- Body language: listening or explaining — a posture of guidance
- Expression: calm authority

## Examples

### Nomsa Dlamini (24, electrician, Seshego, Polokwane)
```
A 24-year-old Black South African woman in electrical work gear standing
at the entrance of a brick house in Seshego township, Polokwane, Limpopo.
She holds a notebook and looks at an electrical junction box on the wall.
Her expression is focused, assessing — not yet doing the work, on the
verge of her first independent job. Seshego township street visible
behind her: low brick homes, a few acacia trees, late afternoon light.
Photorealistic. 16:9 horizontal framing.
```

### Stanzin Dorje (42, guesthouse owner, Leh Old Town)
```
A 42-year-old Ladakhi man in traditional goncha jacket sitting at the
reception desk of a small stone-walled guesthouse in Leh Old Town, Ladakh.
He reviews a printed booking ledger and a mobile phone side by side,
expression focused and slightly worried. Old Leh palace visible through
the window behind him. Warm interior light against cool stone walls.
Photorealistic. 16:9 horizontal framing.
```

## Not allowed in persona images

- Text on clothing, walls, or signs (Gemini may generate readable text — prompt explicitly prohibits it)
- Group scenes (one subject only)
- Staged studio photography aesthetic
- Generic stock-photo smiling
- Iconic or globally recognisable landmarks (Taj Mahal, Eiffel Tower etc.) — use local neighbourhood context instead
