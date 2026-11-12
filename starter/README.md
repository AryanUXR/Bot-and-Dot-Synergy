# Dots starter: build without any app builder or map key

This is a working bot page and dot map in plain HTML, plus one call function. You need **one** account, for whichever voice platform you choose. The map uses OpenStreetMap, which needs no key. No build step.

Tested: Raya voice + this starter's local server placed a real call (12 Nov 2026). Vercel and Netlify configs are included but haven't been deployed yet. Check them on your first deploy.

## Run it locally
```bash
cd starter
cp .env.example .env      # then type in your own values; never paste keys into chat
node dev-server.mjs       # open http://localhost:5173 and /map.html
```

## Make it yours
- `public/personas.json`: bot name, programme, colours, tagline, three personas (photos are optional).
- `public/dots.json`: map centre, the "You" marker, sectors with icons, and dots. Keep it fictional (`onboarding/non-negotiables.md`).
- Run `python3 ../scripts/qc_check.py public/dots.json --prompt <your bot prompt>` before showing anyone.

## Choose the voice platform
Set `VOICE_PLATFORM` in `.env` (or in the host's environment variables):
- `raya`: tested.
- `vapi`, `retell`, `bland`: written from the platforms' public APIs but not yet tested. Check each field against their current docs, run one call, then mark the adapter tested.
- `none`: the page works and the Call button says calls are being set up.
- Something else: copy `api/_lib/adapters/raya.js`, keep the `placeCall({ phone, countryCode, personaId }, env)` shape, and add it to `api/_lib/call.js`.

## Deploy
- **Vercel:** import the `starter` folder; `vercel.json` serves `public/`, and `api/call.js` is the function. Add your env variables in Project Settings.
- **Netlify:** `netlify.toml` publishes `public/`, and `netlify/functions/call.js` serves `/api/call`. Add env variables in Site settings.
- **Anything else:** serve `public/` as static files, and run `api/_lib/call.js`'s `handleCall(request, env)` behind `POST /api/call`.

## Safety built in
- Keys stay on the server; the page never sees them.
- The browser only gets a plain message, never the voice platform's raw error.
- `ALLOWED_PERSONAS` limits what the endpoint will place calls for. Consider adding your host's rate limiting before a public launch.
