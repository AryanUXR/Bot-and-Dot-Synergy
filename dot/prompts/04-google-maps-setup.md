# Dot Prompt 4 — Google Maps Setup

```
## Section 4: Google Maps integration

1. In src/hooks/useGoogleMaps.ts — verify the VITE_GOOGLE_MAPS_API_KEY is loaded correctly:

const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

Do not hardcode the API key. If this file does not exist, create it using the pattern in shared/google-maps.md.

2. In Lovable project settings → Environment Variables, add:
VITE_GOOGLE_MAPS_API_KEY = [the Maps API key starting with AIzaSy...]

3. In src/pages/LaunchPage.tsx — update the map initialisation:
- Centre: { lat: [LAT], lng: [LNG] }
- zoom: DEFAULT_ZOOM from mapData.ts
- Primary colour constant: const PRIMARY = "[PRIMARY_HEX]";
- Primary dark constant: const PRIMARY_DARK = "[PRIMARY_DARK_HEX]";

4. Update the self persona marker in LaunchPage.tsx:
const SELF_PERSONA = {
  name: "[Seeker name for this prototype]",
  area: "[Seeker's area]",
  about: "[One paragraph — who they are, what they need]",
  looking_for: ["Tag 1", "Tag 2", "Tag 3", "Tag 4"],
  lat: [CENTRE_LAT],
  lng: [CENTRE_LNG],
};
```
