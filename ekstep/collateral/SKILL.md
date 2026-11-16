---
name: blue-dots-collateral
description: EkStep only. Builds a PowerPoint deck for a finished Dots prototype from EkStep's Blue Dots template (the Ghaziabad Future Ready deck), filled with the use case's own research, personas, map and needs. Run it at FLOW Stage 7, after the bot and map are built and tested, or whenever someone asks for "the deck", "collateral", "a pptx for this use case" or "slides for the prototype".
---

# Collateral generator (EkStep only)

After every prototype is built, make a deck that presents it in EkStep's own style. Like `ekstep/HEADER.md`, this belongs to us. It uses our template and logo and is **not** part of the shared skill.

- **Template:** `template.pptx`. A copy of *[Blue Dots] Ghaziabad Future Ready* (15 slides). Don't edit it by hand. If the design changes, replace the file and check the shape ids in `build_deck.py`.
- **Generator:** `build_deck.py <spec.json>`. Keeps the slides you name, fills them, drops the rest. Needs only `lxml`.
- **Example:** `use-cases/white-dots-lucknow/collateral/deck.json`, which builds `White_Dots_Lucknow.pptx`. `example-spec.json` here is the same spec with paths from this folder.
- **Output:** `use-cases/<use-case>/collateral/` holds `deck.json`, `map.png` and `<Use_Case>.pptx`.

## When

At **FLOW Stage 7**, after the tests pass and before `handover.md` is written. The deck goes into the handover links. Rebuild it whenever the brief, personas or map change.

## 1. Gather the research (read, don't invent)

| Slide | Comes from |
|---|---|
| title | the brief: colour, place, the one-line promise |
| crisis | `research-notes.md` figures, each with its source. If the use case has none, reuse the Ghaziabad figures (GZ slide 4) and say so in the notes |
| voice | the bot: language and what it captures |
| map | the published map (screenshot) and two real cards from the prototype data: one seeker, one provider |
| people | two persona photos from `images/` (Gemini, never Lovable) and what each persona wants |
| needs | the dots data and the brief's phases: what people ask for, who provides; the stat is a count from the data |
| use_cases, geographies, thanks | kept as they are: EkStep's own status slides |

Sources for Blue Dots facts are in `counsel/knowledge.md` (KD, GZ). Use them exactly, with the citation in the notes.

## 2. Honesty rules

- **No made-up results.** A prototype has no outcomes yet. Never claim placements, call volumes, users or "before and after" figures for it.
- **The "surfaced" slide (template slide 9)** shows real outcomes. Use it only when the use case has real, sourced figures; it's left out by default.
- **Quotes** on the needs slide come from the brief or a persona. Label them so ("from the White Dots brief"), never as a real caller.
- **Personas** are fictional, with generated photos. Say so in the notes.
- **Status slides** (use cases, geographies) are EkStep's. Don't change a status unless KD or a newer EkStep source says so.

## 3. Capture the map

Use the published map URL from `ekstep/prototypes.md`:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars --window-size=1342,800 --virtual-time-budget=20000 --screenshot="$PWD/map_full.png" "<map url>"
```

Then crop away the "Edit with Lovable" badge in the bottom-right. This keeps the top-left 1241×740 at the template's aspect ratio:

```bash
swift ekstep/collateral/tools/crop.swift map_full.png map.png 1241 740
```

Look at `map.png` before using it: pins loaded, the legend visible, no badge.

## 4. Write the spec

Start from the example. Top-level keys:

| Key | Meaning |
|---|---|
| `out` | output path (`file:` paths are relative to the spec) |
| `colour` | the Dots colour for highlights on dark backgrounds (hex, no `#`) |
| `ink` | a darker shade for highlights on white slides. Set it when `colour` is pale (White, Yellow, Golden) |
| `slides` | slide names in order. Default: `title, crisis, voice, map, people, needs, use_cases, geographies, thanks`. Also available: `context` (India's informal economy), `surfaced` |
| `<slide>` | content for each slide you fill |
| `notes` | speaker notes per slide: where each figure comes from, and what's fictional |

**Markup in text:**
- `*text*` takes the box's highlight style: the coloured or bold run.
- `^AI^` is superscript.
- A newline breaks the line inside a paragraph.
- A blank line (`\n\n`) starts a new paragraph.

**Slots and limits.** The generator warns when something won't fit:
- **crisis:** exactly 6 `rows`, a `headline` and a `result`.
- **map:**
  - `side` text;
  - `place` (one short line, such as the city);
  - `seeker` and `provider` cards: a `title` and up to 4 `lines` of `*Label:* value`;
  - `"image": "remove"` drops a card's photo;
  - the screenshot is `image`.
- **people:** `left` and `right` each take an `image` and a `caption` of 12 words or fewer.
- **needs:**
  - two panels;
  - left: up to 2 groups of chips, plus 0–2 quotes;
  - right: 1 group, plus an optional `stat` (`value`, `label`) and 0–2 quotes;
  - chips are 1–3 words; keep each group to one or two rows.
- **surfaced:** a `headline`, `text` by shape id, and `remove` by shape id. Advanced: read the template first.

## 5. Build and check

```bash
python3 ekstep/collateral/build_deck.py use-cases/<use-case>/collateral/deck.json
ekstep/collateral/tools/qa.sh use-cases/<use-case>/collateral/<Use_Case>.pptx /tmp/deck-qa
```

`qa.sh` exports the deck through Keynote and renders each slide to a PNG. **Look at every slide** and check for:
- text overflowing or wrapping badly (the location card, chips, captions);
- captions under the right photos;
- highlight colour readable on white;
- leftover Ghaziabad text or pins;
- empty panels.

Fix the spec, rebuild, and check again. Fix any warning before handing over.

## 6. Hand over

Add the deck to `handover.md` with the bot and map links, and commit `deck.json`, `map.png` and the `.pptx`. The deck is about 14 MB because of the template's background images.
