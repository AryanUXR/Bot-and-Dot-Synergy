# Dot Prototype — Sector Config and Icon Library

## Standard SVG icon paths (24x24 viewBox, stroke only)

Copy-paste these directly into LaunchPage's `ICON_PATHS` record. Add or remove sectors for each prototype.

```typescript
const ICON_PATHS: Record<string, string> = {
  "Capital & Finance":
    `<path d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3a6 6 0 0 0 0-5H6"/>`,
  "Government Schemes":
    `<line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7 12 2"/>`,
  "Compliance & Licensing":
    `<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>`,
  "Market Access":
    `<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>`,
  "Logistics & Packaging":
    `<rect x="1" y="3" width="15" height="13" rx="1"/><path d="m16 8 5 0 2 5v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>`,
  "Training & Skills":
    `<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 6 3 6 3s3 0 6-3v-5"/>`,
  "Handicrafts & Artisans":
    `<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>`,
  "Agro-Food Processing":
    `<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>`,
  "Experts & Agents":
    `<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>`,
  "Healthcare":
    `<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>`,
  "Education":
    `<path d="M22 10v6M2 10l10-5 10 5-10 5z"/>`,
  "Tourism & Hospitality":
    `<circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>`,
  "Road Safety":
    `<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>`,
};
```

## Short labels (for list view pill and filter tile)

```typescript
const SHORT_LABELS: Record<string, string> = {
  "Capital & Finance":      "Finance",
  "Government Schemes":     "Schemes",
  "Compliance & Licensing": "Compliance",
  "Market Access":          "Market",
  "Logistics & Packaging":  "Logistics",
  "Training & Skills":      "Training",
  "Handicrafts & Artisans": "Handicrafts",
  "Agro-Food Processing":   "Agro-Food",
  "Experts & Agents":       "Experts",
  "Tourism & Hospitality":  "Tourism",
};

const shortLabel = (s: string) => SHORT_LABELS[s] ?? s.split(" ")[0];
```

## Filter tile grid pattern

3-column grid. Active tiles show primary colour, inactive are white. Compact, touch-friendly.

```tsx
<div className="grid grid-cols-3 gap-1.5">
  {SECTORS.map(s => {
    const on = activeSectors.has(s);
    const path = ICON_PATHS[s];
    return (
      <button
        key={s}
        onClick={() => toggleSector(s)}
        className="flex flex-col items-center gap-1 rounded-lg p-1.5 transition-colors border"
        style={{
          background: on ? PRIMARY : "#fff",
          color: on ? "#fff" : "#334155",
          borderColor: on ? PRIMARY : "#e2e8f0",
        }}
      >
        <svg
          width="16" height="16" viewBox="0 0 24 24"
          fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          dangerouslySetInnerHTML={{ __html: path }}
        />
        <span className="text-[9px] leading-tight text-center font-semibold">
          {shortLabel(s)}
        </span>
      </button>
    );
  })}
</div>
```

## Sector filter logic — exact match required

Never use `.includes()` — it causes false matches across sector names that share words.

```typescript
const filteredDots = useMemo(() => {
  return dots.filter(d => {
    if (activeSectors.size === SECTORS.length) return true; // all on = show all
    return activeSectors.has(d.sector); // exact match
  });
}, [dots, activeSectors]);
```
