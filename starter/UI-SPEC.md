# Dots template UI: the standard every prototype follows

This is the look and behaviour of every Dots prototype, whatever builds it: Lovable, another app builder, or the plain-code `starter/`. Give this file, `personas.json` and `dots.json` to any builder, and the result should match.

## Shared
- **One colour per programme:** a primary and a darker shade (Pink `#C2185B` / `#6A1B4D`, Red `#DC143C` / `#8B0000`, Green `#2D6A2E` / `#1F4D21`, Orange `#E8731A` / `#8B3A1A`). Everything else is white, slate grey and the colour.
- **Font:** a clean sans-serif (system UI or Geist). Headings bold, in the dark shade.
- **Works at 375 px wide** with no sideways scroll. Text contrast at least WCAG AA.
- **No login anywhere.**

## Bot page
1. **Top bar:** a coloured dot, "<Programme> · <Bot name>", and under it the tagline. The tagline says what the bot does ("Helps you find…"). On the right: a link to the map.
2. **Heading and subheading:** the heading is short and concrete ("Two workers. One day-care. Three calls."). The subheading says how it works in one or two sentences.
3. **Persona cards:** three across on desktop, one per row on a phone. Each card has:
   - a photo, face clearly visible, cropped to the face; or the initial on a colour gradient if there is no photo;
   - first name and initial;
   - an uppercase label in the colour ("THE WORKING MOTHER");
   - three short traits.
4. **Call form** (opens on a card click, as a modal or bottom sheet):
   - background: a gradient from the primary to the dark shade, or the warm orange-to-yellow variant;
   - title: "Call as <Name>";
   - a note on language and length ("Sakhi will call you in Hindi. Talk as this person for 2 to 3 minutes.");
   - fields: country code (default to the programme's country) and phone number, digits only;
   - a full-width light button, "Call me →";
   - a status line: "Connecting…", then "<Bot> will call you in a few seconds." or a plain error;
   - under that, two sample questions in the bot's language.
5. **Footer:** the programme and areas on the left; "Voice AI powered by <platform>" on the right.

## Dot map
1. **Full-screen map.** It opens fitted to the dots around the "You" marker (within about 25 km). Far dots stay on the map for panning.
2. **Filter panel,** top left: a 3 × 3 grid of sector buttons, each with an icon and a short label. All are on by default, and they fill with the colour when on. It can be collapsed to a "Filters" pill.
3. **Pins:**
   - providers: filled colour circle with a white icon;
   - requests: white circle with a coloured border and coloured icon;
   - "You": a white pin with a pulsing ring.
4. **Map / List toggle,** a pill at the bottom centre. The list shows name · area, the sector in colour, and the first offer.
5. **Dot card** (bottom sheet on a phone):
   - a colour gradient header with a tag (org type, "Request · Needs X", or "You"), the name and the area;
   - offers as chips;
   - an About text;
   - a small grey line: "Sample listing for this prototype." or "Sample request for this prototype.";
   - for providers: Call (greyed out when there's no number) and Directions buttons.
6. **Programme-specific notes,** only where needed. For example, health and ambulance cards show "Medical emergency? Call 108 first."
