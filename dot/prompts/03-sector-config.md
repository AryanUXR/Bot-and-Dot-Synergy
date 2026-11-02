# Dot Prompt 3 — Sector Config

Using the sectors for this prototype (from the spec), fill in the SECTORS list and ICON_PATHS using icons from `dot/sector-config.md`.

```
## Section 3: Sector config in LaunchPage.tsx

Replace the SECTORS array and ICON_PATHS in src/pages/LaunchPage.tsx:

const SECTORS = [
  [LIST YOUR SECTOR STRINGS HERE — one per line, in order]
];

const ICON_PATHS: Record<string, string> = {
  [PASTE ONLY THE ENTRIES FOR YOUR SECTORS]
};

const SHORT_LABELS: Record<string, string> = {
  [PASTE SHORT LABEL ENTRIES FOR SECTORS NEEDING ABBREVIATION]
};
```

Ensure every sector in the dot data file (src/data/[name]Dots.ts) has a matching entry in SECTORS and ICON_PATHS.
