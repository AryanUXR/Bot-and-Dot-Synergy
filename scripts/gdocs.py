#!/usr/bin/env python3
"""Minimal Google Docs API client via the service account (same key lookup as gsheets.py).

  python3 scripts/gdocs.py get <doc_id> [--out file.json]        # full document JSON (saves to --out)
  python3 scripts/gdocs.py batch <doc_id> <requests.json>        # apply a batchUpdate, guarded by the
                                                                 # doc's current revisionId
  python3 scripts/gdocs.py sync-guide <doc_id> [GUIDE.md]        # replace the doc's content with GUIDE.md (same file,
                                                                 # same link) and reapply the guide's formatting
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


def token(scope=SCOPE):
    sa = gsheets.load_key()
    now = int(time.time())
    claim = {"iss": sa["client_email"], "scope": scope, "aud": gsheets.TOKEN_URL, "iat": now, "exp": now + 3600}
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


# Formatting for the guide doc (agreed 15 Nov 2026). Table widths are keyed by the first header cell, in points.
WIDTHS = {"": [90, 189, 189], "I want to…": [128, 124, 140, 76], "#": [24, 92, 96, 112, 144],
          "Check": [112, 226, 130], "Task": [150, 318], "Where": [150, 318], "Word": [140, 328]}
NEW_PAGE_BEFORE = ("4. The build",)


def _text(el):
    return "".join(r.get("textRun", {}).get("content", "") for r in el["paragraph"]["elements"]).strip()


def guide_format_requests(doc):
    PT = lambda x: {"magnitude": x, "unit": "PT"}
    req, prev = [], None
    for el in doc["body"]["content"]:
        if "paragraph" in el:
            p = el["paragraph"]; st = p["paragraphStyle"].get("namedStyleType", ""); rng = {"startIndex": el["startIndex"], "endIndex": el["endIndex"]}
            if st.startswith("HEADING"):
                above = {"HEADING_1": 0, "HEADING_2": 22, "HEADING_3": 14}.get(st, 14)
                style = {"spaceAbove": PT(above), "spaceBelow": PT(10 if st == "HEADING_1" else 8 if st == "HEADING_2" else 6), "keepWithNext": True}
                fields = "spaceAbove,spaceBelow,keepWithNext"
                if _text(el).startswith(NEW_PAGE_BEFORE):
                    style.update(pageBreakBefore=True, spaceAbove=PT(0)); fields += ",pageBreakBefore"
            elif "bullet" in p:
                style, fields = {"spaceAbove": PT(2), "spaceBelow": PT(2), "lineSpacing": 115}, "spaceAbove,spaceBelow,lineSpacing"
            else:
                style, fields = {"spaceAbove": PT(10 if prev == "table" else 6), "spaceBelow": PT(6), "lineSpacing": 115}, "spaceAbove,spaceBelow,lineSpacing"
            req.append({"updateParagraphStyle": {"range": rng, "paragraphStyle": style, "fields": fields}})
            prev = "para"
        elif "table" in el:
            t = el["table"]; loc = {"index": el["startIndex"]}
            first = "".join(_text(c) for c in t["tableRows"][0]["tableCells"][0]["content"] if "paragraph" in c)
            w = WIDTHS.get(first)
            if t["columns"] > 1 and w and len(w) == t["columns"]:
                for j, x in enumerate(w):
                    req.append({"updateTableColumnProperties": {"tableStartLocation": loc, "columnIndices": [j],
                                "tableColumnProperties": {"widthType": "FIXED_WIDTH", "width": PT(x)}, "fields": "widthType,width"}})
            elif t["columns"] > 1:
                print(f"note: no width set for table starting {first!r} ({t['columns']} columns); add it to WIDTHS")
            req.append({"updateTableRowStyle": {"tableStartLocation": loc, "rowIndices": list(range(t["rows"])),
                        "tableRowStyle": {"preventOverflow": True}, "fields": "preventOverflow"}})
            prev = "table"
        else:
            prev = None
    return req


def sync_guide(doc_id, md_path):
    import guide_html
    html_doc = guide_html.convert(open(md_path, encoding="utf-8").read())
    drive_tok = token("https://www.googleapis.com/auth/drive")
    code, out = curl(["-X", "PATCH", "-H", "Authorization: Bearer " + drive_tok, "-H", "Content-Type: text/html; charset=utf-8",
                      "--data-binary", "@-", f"https://www.googleapis.com/upload/drive/v3/files/{doc_id}?uploadType=media"], html_doc)
    if code != 200:
        sys.exit(f"Drive content upload -> HTTP {code}\n{out[:600]}")
    tok = token()
    doc = call(tok, doc_id)
    req = guide_format_requests(doc)
    call(tok, doc_id + ":batchUpdate", "POST", {"requests": req, "writeControl": {"requiredRevisionId": doc["revisionId"]}})
    print(f"synced {md_path} into {doc_id} (same link) and applied {len(req)} formatting request(s)")


def main():
    if len(sys.argv) >= 3 and sys.argv[1] == "sync-guide":
        sync_guide(sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else os.path.join(gsheets.REPO_ROOT, "GUIDE.md"))
        return
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
