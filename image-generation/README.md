# Automated Persona Image Generation

This pipeline replaces the manual Gemini → download → upload → paste URL workflow with an automated script.

## What it does

For each persona in `personas.ts`:
1. Builds a photorealistic image prompt from the persona's traits, archetype, and geography
2. Calls Gemini Imagen API → gets image bytes
3. Calls Lovable `get_file_upload_url` → PUTs the image → gets a CDN URL
4. Writes the CDN URL back into the project as an asset JSON file
5. Updates the asset import in `PersonasSection.tsx`

## Two paths — MCP (recommended) vs standalone script

### Path 1: MCP tool (recommended — Claude handles auth)

When running inside Claude with the Lovable connector active:

1. Claude generates each Gemini image prompt (from `image-generation/gemini-prompt-template.md`)
2. Claude calls Gemini Imagen API to generate the image
3. Claude calls `mcp__Lovable__get_file_upload_url` → PUTs the bytes → gets CDN URL
4. Claude sends a Lovable prompt to update the asset JSON files

This is the preferred path — no tokens to manage, no script to run.

### Path 2: Standalone script (requires additional credentials)

```bash
export LOVABLE_PROJECT_ID=2937b9e5-...
export PERSONAS_PATH=src/data/personas.ts
export GEMINI_API_KEY=[from project memory]
export LOVABLE_API_TOKEN=[Lovable API token — separate from Supabase keys]
export GEOGRAPHY="Ladakh, India"
npx ts-node image-generation/generate-and-upload.ts
```

**Note:** The standalone script requires a `LOVABLE_API_TOKEN` which is separate from the Supabase anon key. If you don't have one, use Path 1 (MCP) instead.

## Image prompt formula

See `image-generation/gemini-prompt-template.md` for the exact formula used for each persona type.

## Output

The script creates/updates one file per persona:
`src/assets/[persona-id].png.asset.json`

Each file contains: `{ "url": "https://lovable-assets.cdn/..." }`

The script also patches `src/components/PersonasSection.tsx` to import the new asset files.

## Manual fallback

If the script fails or you don't have a Gemini key:
1. Open `gemini-prompt-template.md`
2. Fill in the formula for each persona
3. Generate in Google AI Studio → download as PNG
4. In Lovable: Assets tab → Upload → copy URL
5. Update `src/assets/[persona-id].png.asset.json` manually
