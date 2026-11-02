# Dot Prototype — Post-Build Checklist

```
MAP
□ Map loads without errors (no "VITE_GOOGLE_MAPS_API_KEY not set" error)
□ Map centred on correct geography
□ All dots visible at default zoom
□ Spread-dots: no dots hidden behind each other at the same coordinate
□ Self persona marker (You) visible with pulse animation
□ Clicking self marker opens self persona card

FILTERS
□ Filter panel visible top-left on map view
□ All sector tiles display correct icons
□ Tapping a tile toggles it (filled = active, outline = inactive)
□ Toggling a tile filters dots correctly (exact match, not partial)
□ Filter pill row visible in list view

DOTS
□ Dot markers correct colour
□ Dot markers show correct icon for their sector
□ Tapping a dot opens the correct DotCard
□ DotCard: org_type badge visible in header
□ DotCard: name and area correct
□ DotCard: sector correct (matches filter tile that would show it)
□ DotCard: offers tags display
□ DotCard: description is ≤2 sentences, no adjective padding
□ DotCard: Call CTA — dimmed if no contact, live link if contact exists
□ DotCard: Directions CTA — opens Google Maps in new tab

LIST VIEW
□ Map/List toggle works
□ List shows dots sorted correctly
□ Tapping a list item opens its DotCard

MOBILE
□ Layout correct on 390px width (iPhone 14)
□ DotCard is full-width bottom sheet on mobile
□ DotCard does not overflow screen height
□ Filter panel does not overlap nav island

DATA INTEGRITY
□ No dots from the previous prototype (Ladakh data) remain in the data file
□ All sector values in the dot data file match SECTORS array exactly
□ All coordinates verified (not default 0,0)
□ Expert personas have locally appropriate names and believable backstories
```
