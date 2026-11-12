"""Preflight: check the user's OWN setup, layer by layer. Never prints a secret.

Usage:
  python3 scripts/preflight.py              # all checks
  python3 scripts/preflight.py --only voice # one layer: config, git, voice, images, tester

Reads config/local.json (non-secret) and raya/.env (secrets, git-ignored).
Each check prints OK, MISSING (something to set up) or FAIL (set up but not working),
with one line on what to do next. Exit code is 0 only when nothing FAILs.
"""
import json, os, ssl, subprocess, sys, urllib.request, urllib.error

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if not os.environ.get("SSL_CERT_FILE") and os.path.exists("/etc/ssl/cert.pem"):
    os.environ["SSL_CERT_FILE"] = "/etc/ssl/cert.pem"
CTX = ssl.create_default_context(cafile=os.environ.get("SSL_CERT_FILE"))
UA = {"User-Agent": "bot-and-dot-preflight/1.0"}

results = []


def report(layer, status, msg):
    results.append(status)
    print(f"{status:8} {layer:8} {msg}")


def load_env():
    env = {}
    for p in (os.path.join(REPO, "raya/.env"), os.path.join(REPO, ".env")):
        if os.path.exists(p):
            for line in open(p):
                line = line.strip()
                if "=" in line and not line.startswith("#"):
                    k, v = line.split("=", 1)
                    v = v.strip().strip('"')
                    if v and not v.startswith("["):  # skip template placeholders
                        env[k.strip()] = v
    return env


def load_config():
    p = os.path.join(REPO, "config/local.json")
    return json.load(open(p)) if os.path.exists(p) else None


def http(url, headers=None, data=None, method=None):
    req = urllib.request.Request(url, data=data, headers={**UA, **(headers or {})}, method=method)
    try:
        with urllib.request.urlopen(req, context=CTX, timeout=30) as r:
            return r.status, r.read()
    except urllib.error.HTTPError as e:
        return e.code, e.read()
    except Exception as e:
        return None, str(e).encode()


def check_config(cfg):
    if cfg is None:
        report("config", "MISSING", "No config/local.json. Run onboarding (onboarding/SKILL.md) or copy config/local.example.json.")
        return
    stack = cfg.get("stack", {})
    unset = [k for k, v in stack.items() if not v or "|" in str(v)]
    report("config", "OK" if not unset else "MISSING",
           "Stack chosen for every layer." if not unset else f"Choose a platform for: {', '.join(unset)} (onboarding/stack-options.md).")


def check_git(cfg):
    st, _ = 0, None
    r = subprocess.run(["git", "-C", REPO, "remote", "get-url", "origin"], capture_output=True, text=True)
    if r.returncode != 0:
        report("git", "MISSING", "No 'origin' remote. Create your own private repo and add it (onboarding/setup-guides/github.md).")
        return
    r = subprocess.run(["git", "-C", REPO, "ls-remote", "--heads", "origin"], capture_output=True, text=True, timeout=60)
    if r.returncode != 0:
        report("git", "FAIL", "Cannot read origin. Check your git credential covers this repo (setup-guides/github.md).")
        return
    r = subprocess.run(["git", "-C", REPO, "push", "--dry-run", "origin", "HEAD"], capture_output=True, text=True, timeout=60)
    report("git", "OK" if r.returncode == 0 else "FAIL",
           "Can read and push to origin." if r.returncode == 0 else "Can read but not push. Your token needs Contents: write for this repo.")


def check_voice(cfg, env):
    platform = (cfg or {}).get("stack", {}).get("voice", "raya")
    if platform != "raya":
        report("voice", "MISSING", f"No automatic check for '{platform}' yet. Add one following onboarding/setup-guides/any-platform.md step 5.")
        return
    key = env.get("RAYA_API_TOKEN")
    if not key:
        report("voice", "MISSING", "RAYA_API_TOKEN not set in raya/.env. You type it in yourself (setup-guides/raya.md).")
        return
    base = (cfg or {}).get("voice", {}).get("base_url") or env.get("RAYA_BASE_URL") or "https://v1.getraya.app"
    st, body = http(f"{base.rstrip('/')}/api/agent?limit=5", {"X-API-Key": key})
    if st == 200:
        try:
            n = len(json.loads(body).get("agents", []))
        except Exception:
            n = "?"
        report("voice", "OK", f"Raya key works ({n} agents visible).")
    else:
        report("voice", "FAIL", f"Raya returned {st}. 401 means a wrong key; see setup-guides/raya.md 'If it fails'.")


def check_tester(cfg):
    t = (cfg or {}).get("tester", {})
    if t.get("agent_id") and t.get("dial_number"):
        report("tester", "OK", "Your own tester agent is recorded in config.")
    else:
        report("tester", "MISSING", "No tester agent of your own yet. Create one (onboarding/SKILL.md Step 6), or test from your own phone.")


def check_images(cfg, env):
    sa = env.get("GOOGLE_SA_KEY")
    if sa:
        if not os.path.exists(sa):
            report("images", "FAIL", "GOOGLE_SA_KEY points to a file that does not exist.")
            return
        try:
            sys.path.insert(0, os.path.join(REPO, "image-generation"))
            from vertex_generate import access_token
            access_token(json.load(open(sa)))
            report("images", "OK", "Service account can get a Google token. If generation still returns 403, add the Vertex AI User role.")
        except Exception as e:
            report("images", "FAIL", f"Service account token failed ({type(e).__name__}). Check the key file and role (setup-guides/gemini-images.md).")
        return
    key = env.get("GEMINI_API_KEY")
    if key:
        st, _ = http("https://generativelanguage.googleapis.com/v1beta/models?pageSize=1", {"x-goog-api-key": key})
        report("images", "OK" if st == 200 else "FAIL",
               "Gemini key works." if st == 200 else f"Gemini key returned {st}. Check it, or credits (setup-guides/gemini-images.md).")
        return
    report("images", "MISSING", "No image credential. Set GOOGLE_SA_KEY or GEMINI_API_KEY in raya/.env, or note your own image tool in config.")


def main():
    only = sys.argv[sys.argv.index("--only") + 1] if "--only" in sys.argv else None
    cfg, env = load_config(), load_env()
    checks = {
        "config": lambda: check_config(cfg),
        "git": lambda: check_git(cfg),
        "voice": lambda: check_voice(cfg, env),
        "tester": lambda: check_tester(cfg),
        "images": lambda: check_images(cfg, env),
    }
    for name, fn in checks.items():
        if only in (None, name):
            fn()
    print("\nApp builder and map keys live in your app builder's secret store, so they are checked from the page itself:")
    print("  the website call test in bot/SKILL.md Step 6, and the map loading without a Google Maps error.")
    sys.exit(1 if "FAIL" in results else 0)


if __name__ == "__main__":
    main()
