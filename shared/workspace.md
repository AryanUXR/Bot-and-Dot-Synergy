# Lovable Workspace and Project Conventions

## Workspace

- Workspace ID: `5mdf5lcGjqX0MUaRc1ZX`
- Org: EkStep Foundation

## Reference (remix source) projects

Always remix from one of these — never build from scratch:

| Use case | Reference project | Lovable ID |
|----------|-------------------|-----------|
| Bot prototype (any sector, English or Hindi) | Blue Dots SA — Siza | `2937b9e5-2f19-44d7-ad16-82efd6b5b9b7` |
| Dot prototype (any sector, no login) | Red Dots Ladakh | `ac07c375-8ae5-49b8-a6c3-12d837bf3ded` |

## Project naming convention

Slugs for remixed projects:

```
[colour]-dots-[geography-slug]        → dot prototype
[botname]-bot-[geography-slug]        → bot prototype
```

Examples:
- `orange-dots-jaipur`
- `siza-bot-polokwane`
- `karigar-bot-varanasi`

## Remix call

```
Lovable:remix_project
  project_id: [reference project ID above]
  workspace_id: 5mdf5lcGjqX0MUaRc1ZX
  project_name: [slug]
  include_history: false
  include_custom_knowledge: false
```

Note the new project ID from the response. All subsequent Lovable tool calls use the new project ID, never the reference project ID.

## Key files to read after every remix

Before sending any prompts, always read:

**For a bot remix:**
```
src/App.tsx
src/data/personas.ts
src/components/PersonasSection.tsx
src/components/CallForm.tsx
src/components/Nav.tsx
supabase/functions/initiate-call/index.ts
```

**For a dot remix:**
```
src/App.tsx
src/pages/LaunchPage.tsx
src/data/[name]Dots.ts
src/lib/mapData.ts
src/hooks/useGoogleMaps.ts
```

## Guardrails

- Never send a `send_message` to a reference/source project — that modifies the template for everyone. Always work on the remixed copy.
- Never create a new Supabase project for each prototype if an existing one fits — share the project between bot and dot.
- Never build from `create_project` — the base stack and boilerplate come from the reference project.
