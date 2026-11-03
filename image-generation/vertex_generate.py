#!/usr/bin/env python3
"""Generate persona photos with Gemini on Vertex AI using a service account.

Usage:
  python3 image-generation/vertex_generate.py <prompts.md> <out_dir> [--options N] [--only id1,id2]

<prompts.md> holds one section per persona, the persona id as the heading and the
prompt as the paragraph under it (the heading may carry a note in brackets):

  ## sunita-onion-farmer (early-stage seeker)
  Medium close-up portrait ... Photorealistic. 16:9 horizontal framing.

A later heading with the same id (e.g. a "### sunita-onion-farmer" v2 section) wins,
so revised prompts can be appended without deleting the originals.

Writes <out_dir>/<id>-<n>.png. Look at every option before uploading: Gemini makes
scene errors (a tractor inside a van, brand badges, faces too small to see).

Auth: GOOGLE_SA_KEY (path to the service account JSON) from the environment or raya/.env.
The service account needs the "Agent Platform User" role (formerly "Vertex AI User")
in its project, and the Vertex AI API must be enabled. No browser sign-in.
"""
import argparse, base64, json, os, re, subprocess, sys, tempfile, time
import urllib.error, urllib.parse, urllib.request

# python.org builds on macOS ship without a CA bundle; fall back to the system one.
if not os.environ.get("SSL_CERT_FILE") and os.path.exists("/etc/ssl/cert.pem"):
    os.environ["SSL_CERT_FILE"] = "/etc/ssl/cert.pem"

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Vertex names: "gemini-3-pro-image-preview" 404s on Vertex; use the GA name.
MODELS = ["gemini-3-pro-image", "gemini-2.5-flash-image"]
ENDPOINT = ("https://aiplatform.googleapis.com/v1/projects/{project}/locations/global/"
            "publishers/google/models/{model}:generateContent")


def sa_key_path():
    path = os.environ.get("GOOGLE_SA_KEY")
    env = os.path.join(REPO, "raya/.env")
    if not path and os.path.exists(env):
        for line in open(env):
            if line.startswith("GOOGLE_SA_KEY="):
                path = line.split("=", 1)[1].strip()
    if not path or not os.path.exists(path):
        sys.exit("GOOGLE_SA_KEY not set or file missing (set it in raya/.env).")
    return path


def access_token(sa):
    b64 = lambda x: base64.urlsafe_b64encode(x).rstrip(b"=")
    now = int(time.time())
    head = b64(json.dumps({"alg": "RS256", "typ": "JWT"}).encode())
    claim = b64(json.dumps({"iss": sa["client_email"], "aud": sa["token_uri"], "iat": now, "exp": now + 3600,
                            "scope": "https://www.googleapis.com/auth/cloud-platform"}).encode())
    # Sign with openssl so the script needs no third-party packages.
    fd, pem = tempfile.mkstemp(suffix=".pem")
    try:
        os.write(fd, sa["private_key"].encode()); os.close(fd)
        sig = subprocess.run(["openssl", "dgst", "-sha256", "-sign", pem], input=head + b"." + claim,
                             capture_output=True, check=True).stdout
    finally:
        os.remove(pem)
    body = urllib.parse.urlencode({"grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer",
                                   "assertion": (head + b"." + claim + b"." + b64(sig)).decode()}).encode()
    return json.load(urllib.request.urlopen(urllib.request.Request(sa["token_uri"], data=body)))["access_token"]


def parse_prompts(path):
    prompts = {}
    for m in re.finditer(r"^#{2,3} ([a-z0-9-]+)[^\n]*\n+([^#\n][^\n]+)", open(path, encoding="utf-8").read(), re.M):
        prompts[m.group(1)] = m.group(2).strip()
    return prompts


def generate(token, project, prompt):
    body = {"contents": [{"role": "user", "parts": [{"text": prompt}]}],
            "generationConfig": {"responseModalities": ["TEXT", "IMAGE"], "imageConfig": {"aspectRatio": "16:9"}}}
    for model in MODELS:
        req = urllib.request.Request(ENDPOINT.format(project=project, model=model), data=json.dumps(body).encode(),
                                     headers={"Content-Type": "application/json", "Authorization": "Bearer " + token})
        try:
            data = json.load(urllib.request.urlopen(req, timeout=240))
        except urllib.error.HTTPError as e:
            msg = e.read().decode()[:200]
            if e.code == 403:
                sys.exit(f"403 from Vertex: give the service account the 'Agent Platform User' role. {msg}")
            print(f"  {model}: HTTP {e.code} {msg}", flush=True)
            continue
        parts = [p for p in data["candidates"][0]["content"]["parts"] if "inlineData" in p]
        if parts:
            return model, base64.b64decode(parts[0]["inlineData"]["data"])
    return None, None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("prompts"); ap.add_argument("out_dir")
    ap.add_argument("--options", type=int, default=2, help="images per persona to choose from")
    ap.add_argument("--only", default="", help="comma-separated persona ids")
    a = ap.parse_args()
    sa = json.load(open(sa_key_path()))
    token = access_token(sa)
    prompts = parse_prompts(a.prompts)
    only = [x for x in a.only.split(",") if x]
    os.makedirs(a.out_dir, exist_ok=True)
    for pid, prompt in prompts.items():
        if only and pid not in only:
            continue
        for n in range(1, a.options + 1):
            model, img = generate(token, sa["project_id"], prompt)
            if not img:
                print(f"{pid}-{n}: no image"); continue
            out = os.path.join(a.out_dir, f"{pid}-{n}.png")
            open(out, "wb").write(img)
            print(f"{pid}-{n}: {model} -> {out}", flush=True)


if __name__ == "__main__":
    main()
