# Dot Card — Bottom Sheet Pattern

The DotCard is a bottom sheet on mobile, centered modal on desktop. It opens when a dot is tapped.

## Component structure

```tsx
const DotCard = ({ dot, onClose }: { dot: Dot; onClose: () => void }) => {
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${
    encodeURIComponent(dot.address || `${dot.lat},${dot.lng}`)
  }`;
  const telHref = dot.contact ? `tel:${dot.contact.replace(/\s+/g, "")}` : undefined;

  return (
    // Full-screen overlay with dark scrim
    <div
      className="fixed inset-0 z-[2000] bg-black/40 flex items-end sm:items-center justify-center p-0 sm:p-6"
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[88dvh] overflow-y-auto"
      >
        {/* Header band — gradient with dot colour */}
        <div
          className="p-5 pb-4 relative rounded-t-3xl sm:rounded-t-2xl"
          style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_DARK})` }}
        >
          <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full bg-white/20 hover:bg-white/30">
            <X size={16} className="text-white" />
          </button>
          <div className="pr-8">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/25 text-white px-2 py-0.5 rounded-full">
              {dot.org_type}
            </span>
            <h2 className="text-white font-bold text-lg leading-tight mt-2">{dot.name}</h2>
            <p className="text-white/80 text-xs flex items-center gap-1 mt-1">
              <MapPin size={11} /> {dot.area}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <Row label="Sector" value={dot.sector} />

          {dot.address && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Address</p>
              <p className="text-sm text-slate-700 flex items-start gap-1.5">
                <MapPin size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
                {dot.address}
              </p>
            </div>
          )}

          {dot.offers && dot.offers.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">What they offer</p>
              <div className="flex flex-wrap gap-1.5">
                {dot.offers.map(o => (
                  <span
                    key={o}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: `${PRIMARY}15`, color: PRIMARY }}
                  >
                    {o}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">About</p>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg">
              {dot.description}
            </p>
          </div>

          {/* CTAs */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {telHref ? (
              <a
                href={telHref}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: PRIMARY }}
              >
                <Phone size={14} /> Call
              </a>
            ) : (
              <span
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold text-white opacity-40 cursor-not-allowed"
                style={{ background: PRIMARY }}
              >
                <Phone size={14} /> Call
              </span>
            )}
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold border"
              style={{ borderColor: PRIMARY, color: PRIMARY }}
            >
              <Navigation size={14} /> Directions
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">{label}</p>
    <p className="text-sm font-semibold text-slate-800">{value}</p>
  </div>
);
```

## Rules

- Call CTA: use `<a href="tel:...">` not a button — native phone dialler. Dimmed if no contact number.
- Directions CTA: always opens Google Maps search in new tab — never in-app navigation.
- `max-h-[88dvh] overflow-y-auto` prevents the card from taller than the screen on long descriptions.
- `bg-black/40` scrim + `onClick={onClose}` on the overlay allows tap-outside-to-close.
- `e.stopPropagation()` on the card content prevents the overlay click from firing.
