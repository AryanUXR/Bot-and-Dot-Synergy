# Blue Dots Assistant

A chat platform where anyone can ask about Blue Dots, check whether an idea fits, shape it into a brief and personas, and build a working voice bot and dot map. Next.js on Vercel; Claude for the assistant, Raya for voice bots, Gemini on Vertex for persona photos, Google Maps for the map.

## Two instances

| | Address | Use it for |
|---|---|---|
| **UAT** | https://blue-dots-assistant-uat.vercel.app | Trying every change first. Shows a "UAT" badge. |
| **Production** | https://blue-dots-assistant.vercel.app | Demos and real users. Only builds checked on UAT. |

Both are projects in the BlueDots team on Vercel, each with its own access code (the `ACCESS_CODE` setting on that project) and environment variables. Their data lives in Supabase (the campaign-manager project, table `assistant_kv`), with UAT and production rows kept apart by `KV_ENV` and each instance's own secret, so testing never touches production data. Access codes are shared privately, never written in this repository.

## Releasing a change

1. `scripts/deploy.sh uat` and check the change on UAT.
2. `scripts/deploy.sh prod` (it asks you to confirm UAT was checked).

## Settings on each Vercel project

`RAYA_API_TOKEN`, `RAYA_BASE_URL`, `GOOGLE_SA_JSON` (base64 service-account key), `ACCESS_CODE`, `ANTHROPIC_API_KEY`, and the store: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `KV_ENV` (`uat` or `prod`) and `KV_SECRET`. UAT also sets `NEXT_PUBLIC_APP_ENV=uat`. Never commit a key or a code.

## Local development

Keys come from `../raya/.env`. Run `npm run dev` (port 3100). Without Upstash, data is kept in `.data/`.

## The store

`assistant_kv` (env, key, value) has row security on and no policies, so the public key cannot read or write it directly. The app goes through three functions, `assistant_kv_get`, `assistant_kv_set` and `assistant_kv_del`, which check the instance's secret against a SHA-256 fingerprint in `assistant_secret`. The secrets themselves live only in `raya/.env` (`ASSISTANT_KV_SECRET_UAT`, `ASSISTANT_KV_SECRET_PROD`) and on Vercel.
