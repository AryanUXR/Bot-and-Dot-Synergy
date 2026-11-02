#!/usr/bin/env npx ts-node
/**
 * Automated persona image generation + Lovable upload pipeline.
 *
 * Usage:
 *   GEMINI_API_KEY=... LOVABLE_PROJECT_ID=... npx ts-node generate-and-upload.ts
 *
 * Requirements:
 *   npm install node-fetch @google/generative-ai fs-extra
 */

import * as fs from "fs";
import * as path from "path";

// ---- Config ----
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const LOVABLE_PROJECT_ID = process.env.LOVABLE_PROJECT_ID || "";
const PERSONAS_PATH = process.env.PERSONAS_PATH || "src/data/personas.ts";
const OUTPUT_DIR = "src/assets";

if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY env var required");
if (!LOVABLE_PROJECT_ID) throw new Error("LOVABLE_PROJECT_ID env var required");

// ---- Read personas.ts ----
// Parses persona IDs and enough context to build image prompts.
// Extend this to extract traits/location if your personas.ts structure changes.

interface PersonaStub {
  id: string;
  fullName: string;
  location: string;     // archetype label — used in prompt context
  traits: string[];     // first 3 used for image context
}

function parsePersonas(filePath: string): PersonaStub[] {
  const content = fs.readFileSync(filePath, "utf-8");
  // Simple regex extraction — works for the standard personas.ts schema
  const personas: PersonaStub[] = [];
  const idMatches = [...content.matchAll(/id:\s*["']([^"']+)["']/g)];
  const nameMatches = [...content.matchAll(/fullName:\s*["']([^"']+)["']/g)];
  const locationMatches = [...content.matchAll(/location:\s*["']([^"']+)["']/g)];

  for (let i = 0; i < idMatches.length; i++) {
    personas.push({
      id: idMatches[i][1],
      fullName: nameMatches[i]?.[1] || "",
      location: locationMatches[i]?.[1] || "",
      traits: [],
    });
  }
  return personas;
}

// ---- Build Gemini image prompt ----
// CUSTOMISE: extend this function with geography and sector context for your prototype.

function buildImagePrompt(persona: PersonaStub, geography: string): string {
  return (
    `A photorealistic portrait of ${persona.fullName}, archetype: ${persona.location}. ` +
    `They are in ${geography}. ` +
    `The subject occupies the left two-thirds of the frame. Context and setting visible on the right. ` +
    `Natural daylight. No text, logos, or readable signage. ` +
    `Expression: focused, thoughtful, quiet determination. ` +
    `Photorealistic. 16:9 horizontal framing.`
  );
}

// ---- Call Gemini Imagen ----

async function generateImage(prompt: string): Promise<Buffer> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        instances: [{ prompt }],
        parameters: {
          sampleCount: 1,
          aspectRatio: "16:9",
          personGeneration: "ALLOW_ADULT",
        },
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini Imagen error ${response.status}: ${err}`);
  }

  const data = await response.json() as any;
  const base64 = data.predictions?.[0]?.bytesBase64Encoded;
  if (!base64) throw new Error("No image returned from Gemini");
  return Buffer.from(base64, "base64");
}

// ---- Upload to Lovable ----
//
// NOTE: This step requires a Lovable API token (different from the Supabase anon key).
// Set LOVABLE_API_TOKEN in your environment before running.
//
// Alternatively — and this is the recommended path — use the Lovable MCP tool
// `mcp__Lovable__get_file_upload_url` directly from Claude rather than running this script.
// The MCP tool handles authentication internally and is the safest upload method.
//
// The upload flow when using the REST API directly:
// 1. POST to get a presigned upload URL + file_id
// 2. PUT the image bytes to the presigned URL
// 3. The file_id (or a returned CDN URL) is what goes into the .asset.json file

const LOVABLE_API_TOKEN = process.env.LOVABLE_API_TOKEN || "";

async function uploadToLovable(
  projectId: string,
  fileName: string,
  imageBuffer: Buffer
): Promise<string> {
  if (!LOVABLE_API_TOKEN) {
    throw new Error(
      "LOVABLE_API_TOKEN not set. Either set it, or use the Lovable MCP tool " +
      "(mcp__Lovable__get_file_upload_url) from Claude directly — recommended."
    );
  }

  // Step 1: Get presigned upload URL
  const urlRes = await fetch("https://api.lovable.dev/api/projects/file-upload-url", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${LOVABLE_API_TOKEN}`,
    },
    body: JSON.stringify({ project_id: projectId, file_name: fileName, content_type: "image/png" }),
  });

  if (!urlRes.ok) throw new Error(`Lovable get_file_upload_url failed: ${await urlRes.text()}`);
  const { upload_url, file_id } = await urlRes.json() as any;

  // Step 2: PUT image to presigned URL
  const putRes = await fetch(upload_url, {
    method: "PUT",
    headers: { "Content-Type": "image/png" },
    body: imageBuffer,
  });

  if (!putRes.ok) throw new Error(`Lovable upload PUT failed: ${await putRes.text()}`);

  // Step 3: Return the CDN URL / file_id for use in the .asset.json file
  // The exact field name in the response may vary — inspect urlRes.json() output on first run
  return upload_url.split("?")[0]; // presigned URL base is typically the CDN path
}

// ---- Write asset JSON ----

function writeAssetJson(personaId: string, cdnUrl: string) {
  const assetPath = path.join(OUTPUT_DIR, `${personaId}.png.asset.json`);
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(assetPath, JSON.stringify({ url: cdnUrl }, null, 2));
  console.log(`  Wrote: ${assetPath}`);
}

// ---- Main ----

async function main() {
  const GEOGRAPHY = process.env.GEOGRAPHY || "India"; // override per prototype
  const personas = parsePersonas(PERSONAS_PATH);

  console.log(`Found ${personas.length} personas in ${PERSONAS_PATH}`);

  for (const persona of personas) {
    console.log(`\nProcessing: ${persona.fullName} (${persona.id})`);

    try {
      const prompt = buildImagePrompt(persona, GEOGRAPHY);
      console.log(`  Prompt: ${prompt.slice(0, 100)}...`);

      const imageBuffer = await generateImage(prompt);
      console.log(`  Generated image (${imageBuffer.length} bytes)`);

      const cdnUrl = await uploadToLovable(LOVABLE_PROJECT_ID, `${persona.id}.png`, imageBuffer);
      console.log(`  Uploaded → ${cdnUrl}`);

      writeAssetJson(persona.id, cdnUrl);
    } catch (err) {
      console.error(`  FAILED: ${(err as Error).message}`);
      // Continue with next persona rather than aborting
    }
  }

  console.log("\nDone. Review src/assets/*.asset.json and verify URLs before deploying.");
}

main().catch(console.error);
