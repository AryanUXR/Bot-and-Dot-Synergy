# Automated Persona Image Generation

This pipeline replaces the manual Gemini → download → upload → paste URL workflow with an automated script.

## Path 0 — Vertex AI with the service account (use this first)

Worked end to end on 2026-11-03. No browser sign-in, no prepaid credit to run out.

1. **Prompts.** Write `use-cases/<project>/image-prompts.md` with one `## <persona-id>` section per persona, following `gemini-prompt-template.md`. Faces must be clearly visible: medium close-up, waist up.
2. **Generate two options per persona:**
   ```bash
   python3 image-generation/vertex_generate.py use-cases/<project>/image-prompts.md /tmp/<project>-img --options 2
   ```
   The script reads `GOOGLE_SA_KEY` (path to the service account JSON) from `raya/.env`. It tries `gemini-3-pro-image`, then `gemini-2.5-flash-image`.
3. **Look at every image before uploading.** Gemini makes scene errors. Real examples: a whole tractor inside a service van, a brand badge on a tractor, a 42-year-old who looked 60, a face too small to see in a wide shot. Fix the prompt by spelling out what must not appear, append it as a `### <persona-id>` section (the later heading wins), and regenerate only that persona with `--only <id>`.
4. **Upload.** For each image, call `get_file_upload_url` (Lovable MCP), then PUT the bytes with the returned headers. Attach all file_ids to one `send_message` that says: use these exact files, do not generate, edit or crop any image. Have Lovable create the assets as `src/assets/<persona-id>.png.asset.json`, map them in `PersonasSection.tsx`, and set an `imagePosition` per persona (for example `"35% 20%"`) so cards and the modal header crop to the face.
5. **Save copies.** Save JPEG copies to `use-cases/<project>/images/` and commit them with the prompts that produced them.

**Never use Lovable-generated images.**

**Setup, once per project:**
- The service account (`blue-dots-admin@blue-dots-project.iam.gserviceaccount.com`) needs the role **Agent Platform User** in its project. Google renamed "Vertex AI User" to this; pick it under the Vertex AI category.
- The Vertex AI API must be enabled, with billing on the project.
- A 403 with `aiplatform.endpoints.predict denied` means the role is missing. Granting it is the user's job.
- `gemini-3-pro-image-preview` returns 404 on Vertex; use the GA names above.
- An OAuth client secret JSON (`"web": {"client_id"...}`) is not usable here.

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
export GEMINI_API_KEY=[from raya/.env]
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
