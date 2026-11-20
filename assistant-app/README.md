# Blue Dots Assistant

A chat platform where anyone can ask about Blue Dots, check whether an idea fits, shape it into a brief and personas, and build a working voice bot and dot map. Next.js on Vercel; Claude for the assistant, Raya for voice bots, Gemini on Vertex for persona photos, Google Maps for the map.

## Two instances

| | Address | Use it for |
|---|---|---|
| **UAT** | https://blue-dots-assistant-uat.vercel.app | Trying every change first. Shows a "UAT" badge. |
| **Production** | https://blue-dots-assistant.vercel.app | Demos and real users. Only builds checked on UAT. |

Both are projects in the BlueDots team on Vercel, each with its own access code (the `ACCESS_CODE` setting on that project), environment variables and storage, so testing never touches production data. Access codes are shared privately, never written in this repository.

## Releasing a change

1. `scripts/deploy.sh uat` and check the change on UAT.
2. `scripts/deploy.sh prod` (it asks you to confirm UAT was checked).

## Settings on each Vercel project

`RAYA_API_TOKEN`, `RAYA_BASE_URL`, `GOOGLE_SA_JSON` (base64 service-account key), `ACCESS_CODE`, `ANTHROPIC_API_KEY`, and Upstash Redis (`KV_REST_API_URL`, `KV_REST_API_TOKEN`, added by connecting an Upstash database). UAT also sets `NEXT_PUBLIC_APP_ENV=uat`. Never commit a key or a code.

## Local development

Keys come from `../raya/.env`. Run `npm run dev` (port 3100). Without Upstash, data is kept in `.data/`.
