"""Move an inbound number (in_did) between Raya agents, and put it back. Every move is verified by reading both agents.

Usage:
  python3 scripts/raya_did.py show <agent_uuid> [<agent_uuid> ...]
  python3 scripts/raya_did.py move <did> <from_uuid> <to_uuid>

Order matters: the number comes off the old agent first, then goes on the new one. If the second
step fails, the script puts it straight back on the old agent. A stored in_did does not prove the
phone line routes to it, so place one real call afterwards.

Reads the key from raya/.env (RAYA_API_TOKEN). Never prints it.
"""
import json, os, subprocess, sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = "https://v1.getraya.app"
PINK_INBOUND = "d37ecf8d-cacf-4d75-a6d3-4fc142e99b75"   # Sakhi Hindi Inbound · Pink Dots Tiruppur
TESTER = "f60e0899-aa3a-4be7-9b4f-0296bd28ef48"  # Testing Agent- Blue Dots, in_did 911204404272


def key():
    for line in open(os.path.join(REPO, "raya", ".env"), encoding="utf-8"):
        if line.startswith("RAYA_API_TOKEN="):
            return line.split("=", 1)[1].strip().strip("'\"")
    sys.exit("RAYA_API_TOKEN not found in raya/.env")


def req(method, path, body=None):
    args = ["curl", "-s", "-m", "60", "-X", method, "-H", f"X-API-Key: {key()}", "-H", "Content-Type: application/json",
            BASE + path, "-w", "\n%{http_code}"]
    if body is not None:
        args += ["--data-binary", json.dumps(body)]
    out = subprocess.run(args, capture_output=True, text=True).stdout
    text, code = out.rsplit("\n", 1)
    try:
        return int(code), json.loads(text)
    except ValueError:
        return int(code), text


def numbers(uuid):
    st, d = req("GET", f"/api/agent/{uuid}")
    if st != 200 or not isinstance(d, dict):
        sys.exit(f"GET {uuid}: HTTP {st}")
    return d.get("name"), d.get("in_did"), d.get("out_did")


def show(*uuids):
    for u in uuids:
        name, i, o = numbers(u)
        print(f"  {u[:8]}  in_did={i}  out_did={o}  {name}")


def set_in(uuid, did):
    st, d = req("PATCH", f"/api/agent/{uuid}", {"in_did": did})
    ok = st == 200 and isinstance(d, dict) and not d.get("error")
    print(f"  PATCH {uuid[:8]} in_did={did} -> HTTP {st}{'' if ok else ' ' + str(d)[:200]}")
    return ok


def move(did, src, dst):
    did = int(did)
    _, src_in, _ = numbers(src)
    _, dst_in, _ = numbers(dst)
    if int(src_in or 0) != did:
        sys.exit(f"Refusing: {src[:8]} holds in_did={src_in}, not {did}.")
    if dst_in:
        sys.exit(f"Refusing: {dst[:8]} already holds in_did={dst_in}. Clear it first.")
    print("Before:"); show(src, dst)
    if not set_in(src, None):
        sys.exit("Could not clear the number from the source agent. Nothing changed.")
    if not set_in(dst, did):
        print("Could not set it on the target. Putting it back on the source.")
        set_in(src, did); show(src, dst); sys.exit(1)
    print("After:"); show(src, dst)
    _, a, _ = numbers(src); _, b, _ = numbers(dst)
    if a is None and int(b or 0) == did:
        print(f"OK: {did} moved from {src[:8]} to {dst[:8]}. Place one real call to confirm it routes.")
    else:
        sys.exit("Verification failed: check both agents now.")


def main():
    if len(sys.argv) < 2:
        print(__doc__); sys.exit(2)
    cmd = sys.argv[1]
    if cmd == "show":
        show(*sys.argv[2:])
    elif cmd == "move" and len(sys.argv) == 5:
        move(*sys.argv[2:])
    else:
        print(__doc__); sys.exit(2)


if __name__ == "__main__":
    main()
