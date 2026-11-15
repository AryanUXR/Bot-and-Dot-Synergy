#!/usr/bin/env python3
"""Minimal Google Docs API client via the service account (same key lookup as gsheets.py).

  python3 scripts/gdocs.py get <doc_id> [--out file.json]        # full document JSON (saves to --out)
  python3 scripts/gdocs.py batch <doc_id> <requests.json>        # apply a batchUpdate, guarded by the
                                                                 # doc's current revisionId
The doc must be shared with the service account (Editor) first. Uses curl for HTTPS (this Mac's
python.org build has no CA bundle). Reads the key path from $GOOGLE_SA_KEY or raya/.env. Never prints the key.
"""
import json
import os
import subprocess
import sys
import time
import urllib.parse

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import gsheets  # noqa: E402  (reuses its key lookup and signing helpers)

from cryptography.hazmat.primitives import hashes, serialization  # noqa: E402
from cryptography.hazmat.primitives.asymmetric import padding  # noqa: E402

SCOPE = "https://www.googleapis.com/auth/documents"
DOCS = "https://docs.googleapis.com/v1/documents/"

if not os.environ.get("GOOGLE_SA_KEY"):  # fall back to the path in raya/.env
    _env = os.path.join(gsheets.REPO_ROOT, "raya", ".env")
    if os.path.exists(_env):
        for _l in open(_env, encoding="utf-8"):
            if _l.startswith("GOOGLE_SA_KEY="):
                os.environ["GOOGLE_SA_KEY"] = _l.split("=", 1)[1].strip().strip("'\"")


def curl(args, data=None):
    r = subprocess.run(["curl", "-s", "-m", "60", "-w", "\n%{http_code}"] + args, input=data,
                       capture_output=True, text=True)
    body, code = r.stdout.rsplit("\n", 1)
    return int(code), body


def token():
    sa = gsheets.load_key()
    now = int(time.time())
    claim = {"iss": sa["client_email"], "scope": SCOPE, "aud": gsheets.TOKEN_URL, "iat": now, "exp": now + 3600}
    si = gsheets.b64u(json.dumps({"alg": "RS256", "typ": "JWT"}).encode()) + b"." + gsheets.b64u(json.dumps(claim).encode())
    pk = serialization.load_pem_private_key(sa["private_key"].encode(), password=None)
    assertion = (si + b"." + gsheets.b64u(pk.sign(si, padding.PKCS1v15(), hashes.SHA256()))).decode()
    form = urllib.parse.urlencode({"grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer", "assertion": assertion})
    code, body = curl(["-X", "POST", "-H", "Content-Type: application/x-www-form-urlencoded", "--data-binary", "@-",
                       gsheets.TOKEN_URL], form)
    if code != 200:
        sys.exit(f"token exchange failed: HTTP {code}\n{body[:400]}")
    return json.loads(body)["access_token"]


def call(tok, path, method="GET", body=None):
    args = ["-X", method, "-H", "Authorization: Bearer " + tok, "-H", "Content-Type: application/json", DOCS + path]
    data = None
    if body is not None:
        args[4:4] = ["--data-binary", "@-"]
        data = json.dumps(body)
    code, out = curl(args, data)
    if code != 200:
        sys.exit(f"Docs API {method} {path} -> HTTP {code}\n{out[:800]}")
    return json.loads(out or "{}")


def main():
    if len(sys.argv) < 3 or sys.argv[1] not in ("get", "batch"):
        print(__doc__); sys.exit(2)
    tok = token()
    cmd, doc_id = sys.argv[1], sys.argv[2]
    if cmd == "get":
        doc = call(tok, doc_id)
        if "--out" in sys.argv:
            out = sys.argv[sys.argv.index("--out") + 1]
            json.dump(doc, open(out, "w"), ensure_ascii=False)
            print(f"saved {out}: title={doc.get('title')!r} revision={doc.get('revisionId')}")
        else:
            print(json.dumps(doc, ensure_ascii=False))
    else:
        requests = json.load(open(sys.argv[3]))
        rev = call(tok, doc_id).get("revisionId")
        res = call(tok, doc_id + ":batchUpdate", "POST",
                   {"requests": requests, "writeControl": {"requiredRevisionId": rev}})
        print(f"applied {len(requests)} request(s); new revision {res.get('writeControl', {}).get('requiredRevisionId')}")


if __name__ == "__main__":
    main()
