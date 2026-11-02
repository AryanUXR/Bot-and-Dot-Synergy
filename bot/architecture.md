# Bot Prototype — Architecture

## What it is

A single Lovable page with three components: Nav + PersonasSection + Footer. No map. No login. Visitors read about 3 personas, click one to open a modal with questions and a call form, enter their phone number, and receive an outbound call from Raya.

## Route structure

```
src/App.tsx
  /          → Index.tsx
  *          → NotFound.tsx

src/pages/Index.tsx
  <Nav />
  <PersonasSection />
  <Footer />
```

No auth routes. No /home route. No AdminDashboard in the public-facing bot prototype.

## Component map

```
Index.tsx
  Nav.tsx                        ← bot name, tagline, primary colour background
  PersonasSection.tsx            ← hero heading + subheading + 3 persona cards
    PersonaCard.tsx              ← one card per persona — image, name, archetype, traits
    PersonaModal.tsx             ← opens on card click — about text, questions, CallForm
      CallForm.tsx               ← country code + persona dropdown + submit → edge function
  Footer.tsx                     ← minimal, optional
```

## Data flow

```
personas.ts                      ← TypeScript array — source of truth
  ↓ imported by
PersonasSection.tsx
  ↓ passes persona to
PersonaModal.tsx → CallForm.tsx
  ↓ on submit: supabase.functions.invoke("initiate-call")
  ↓
supabase/functions/initiate-call/index.ts
  ↓ calls
https://v1.getraya.app/api/call
  ↓ Raya dials
[visitor's phone]
```

## Persona images

Stored as `.asset.json` files: `src/assets/[persona-id].png.asset.json`
Each contains: `{ "url": "https://..." }`
Imported in `PersonasSection.tsx` and mapped by persona ID.
Generated via the image-generation pipeline — never manually downloaded and re-uploaded.

## What to change vs what to keep

### CHANGE per prototype
- Bot name and tagline in `Nav.tsx`
- Primary colour in `tailwind.config.ts` and CSS variables
- `personas.ts` — full replacement
- Hero heading and subheading in `PersonasSection.tsx`
- Edge function env var name and timezone
- Persona images

### NEVER CHANGE (without specific reason)
- The three-card PersonasSection layout
- PersonaModal interaction pattern (click card → modal → CallForm)
- CallForm submission logic (invoke → Raya → show success/error)
- Retry logic in the edge function
- Country code routing for outbound DID
