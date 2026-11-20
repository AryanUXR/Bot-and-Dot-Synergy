# Blue Dots prototype viewer

Source of the public site that shows prototypes made with the Blue Dots Assistant, in the Dots library layout (`starter/UI-SPEC.md`).

- **Live:** https://blue-dots-prototypes.lovable.app (Lovable project `blue-dots-prototype-viewer`, EkStep ONEST Team workspace, remixed from the library map `blue-dots-pune-petcare`).
- **Routes:** `/p/<id>` bot page, `/p/<id>/map` dot map; `/uat/p/...` reads from the UAT assistant.
- **Data:** read-only `GET <assistant>/api/public/<id>` (no chat, bot instructions or keys); calls go through `POST <assistant>/api/call`. Both allow only `*.lovable.app` origins (`assistant-app/src/lib/cors.ts`).
- **Files here are the source of truth.** To change the viewer, edit these files, then send them to the Lovable project to place verbatim (as on 20 Nov 2026: one message, 1.6 credits). Don't let Lovable redesign them.

| File | Adapted from (library) |
|---|---|
| `src/pages/BotPage.tsx` | bot page `pet-saathi-bot-pune`: Nav, PersonasSection, PersonaCard, PersonaModal, CallForm, Footer |
| `src/pages/MapPage.tsx` | map `blue-dots-pune-petcare`: LaunchPage (spread, filters, You marker, DotCard, SelfCard, list, nav island), one blue |
| `src/lib/prototype.ts` | data loader, colours, icons, call |
| `src/pages/viewerShared.tsx` | fonts, loading and error states, landing page |
| `src/App.tsx` | routes |
