# Dot Prompt 2 — Dot Data File

Before generating this prompt, create the full dot data file using `dot/dot-schema.md` and `content/dot-data-guide.md`.

```
## Section 2: Replace dot data file

Replace the entire contents of src/data/[oldName]Dots.ts with a new file at src/data/[newName]Dots.ts:

[PASTE FULL GENERATED DOT DATA FILE HERE]

Also update src/lib/mapData.ts:

export const [GEO_NAME]_CENTER: [number, number] = [[LAT], [LNG]];
export const DEFAULT_ZOOM = [ZOOM];  // 11 for city-level, 9 for district, 7 for region
export const MIN_ZOOM = 7;
export const MAX_ZOOM = 18;

Update the import in src/pages/LaunchPage.tsx to use the new data file name.
```

## Notes

- Data file must export both the interface type and the dots array
- The constant name (e.g. `LADAKH_DOTS`) must match what LaunchPage imports
- Map centre coordinates: verify via web search before using
- `DEFAULT_ZOOM`: 11 works for a single city; 9 for a district; 7 for a multi-district region
