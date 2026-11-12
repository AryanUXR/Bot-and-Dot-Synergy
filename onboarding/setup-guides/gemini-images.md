# Gemini images (persona photos): tested default

There are two ways in; pick one.

**A. Google AI Studio key (quickest).**
1. Create a key in Google AI Studio with the user's own account.
2. Put it in `raya/.env` as `GEMINI_API_KEY=...`. The user types it in.
3. If the account is prepaid, credits can run out. A top-up can take a while to reach the API (LESSONS.md 20).

**B. Vertex AI with a service account (steadier for teams).**
1. In their own Google Cloud project, enable Vertex AI and create a service account.
2. Give the service account the role **Vertex AI User**. Some consoles now call it **Agent Platform User** (LESSONS.md 20).
3. Download its JSON key. Keep it **outside the repo** and put its path in `raya/.env` as `GOOGLE_SA_KEY=/full/path/key.json`.
4. Model names differ on Vertex: use `gemini-3-pro-image` or `gemini-2.5-flash-image` on the `global` location (LESSONS.md 21).

**Verify.** Run `python3 scripts/preflight.py --only images`. It gets a token or checks the key, and prints only OK or the error.

**Use.** `image-generation/vertex_generate.py`, with the prompt rules in `image-generation/gemini-prompt-template.md`: face large and sharp, waist-up, generate two options, and check every one before uploading.
