"""The four audit checks every Dots prototype must pass before anyone sees it.

  1. All types of dots are visible: requests and providers (and every service type) are on the map,
     every filter has dots, and nothing is hidden by default.
  2. The map opens without a login.
  3. All data is dummy data: invented names, no addresses, no emails, no phone numbers except
     national helplines, no rows copied from real organisations.
  4. Nothing sensitive: no caste, religion, community, state of origin, marital status, surnames,
     gender-biased or ableist words, in the map data, the map page (e.g. the 'You' card), the persona
     text or the bot prompt.

Usage:
  python3 scripts/audit.py <use-case slug or folder>
        [--map-src <map source folder>]   map code (Lovable: src/ copy; starter: starter/public)
        [--bot-src <bot source folder>]   bot page code, to scan persona text
        [--map-url <public map URL>]      the link people will open, checked live with no login
        [--prompt <bot prompt .md>]

Run it at Stage 4 of FLOW.md and again before handover. Exit code 1 if any check fails.
Works for any platform: it reads files and opens a URL, nothing else.
"""
import glob, os, re, subprocess, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from qc_check import HELPLINES, SENSITIVE, rows_of, field, find_inputs  # noqa: E402

GENDER_BIAS = [r"\bhousewife\b", r"\bwomen'?s work\b", r"\bman'?s job\b", r"\bmanpower\b", r"\bgirls only\b(?! hostel)",
               r"\bfair[- ]skinned\b", r"\bbeautiful\b", r"\bweaker sex\b", r"\bbread ?winner\b"]
ORIGIN = r"\bfrom (?:[A-Z][a-z]+, )?(?:Bihar|Jharkhand|Odisha|Orissa|Uttar Pradesh|UP|West Bengal|Bengal|Assam|Nepal|Bangladesh|Rajasthan|Madhya Pradesh|Chhattisgarh|Tamil Nadu|Kerala|Karnataka|Maharashtra|Gujarat|Punjab|Haryana)\b"
FULL_NAME = r"\b([A-Z][a-z]{2,}) (Kumari|Devi|Sharma|Singh|Yadav|Das|Deka|Bora|Sheikh|Khan|Nayak|Pawar|Shinde|Gaikwad|Patel|Gupta|Verma|Mishra|Reddy|Nair|Iyer|Rao|Ahmed|Ansari|Paswan|Ram|Mandal|Prasad|Choudhary|Jha|Thakur|Pandey|Tiwari|Dubey)\b"

status = {}


def mark(check, ok, msg, warn=False):
    level = "OK" if ok else ("WARN" if warn else "FAIL")
    if not ok and not warn:
        status[check] = False
    status.setdefault(check, True)
    print(f"  {level:5} {msg}")


def read(paths):
    return "\n".join(open(p, encoding="utf-8", errors="ignore").read() for p in paths)


def sources(folder, exts=("tsx", "ts", "js", "jsx", "html", "json")):
    out = []
    for e in exts:
        out += [p for p in glob.glob(os.path.join(folder, "**", f"*.{e}"), recursive=True)
                if "/ui/" not in p and "node_modules" not in p and not p.endswith(".asset.json")]
    return out


def check1(data_text, map_text):
    print("\n1. All types of dots are visible")
    rows = rows_of(data_text)
    seekers = [r for r in rows if field(r, "type") == "seeker"]
    providers = [r for r in rows if field(r, "type") == "provider"]
    mark(1, bool(seekers) and bool(providers), f"{len(seekers)} requests and {len(providers)} providers on the map."
         if seekers and providers else f"Need both requests and providers: {len(seekers)} requests, {len(providers)} providers.")
    m = re.search(r"SECTORS\s*=\s*\[(.*?)\]", data_text, re.S)
    sectors = re.findall(r'"([^"]+)"', m.group(1)) if m else []
    counts = {}
    for r in rows:
        counts[field(r, "sector")] = counts.get(field(r, "sector"), 0) + 1
    empty = [s for s in sectors if not counts.get(s)]
    if sectors:
        mark(1, not empty, f"All {len(sectors)} filters have dots." if not empty else f"Filters with no dots: {', '.join(empty)}.")
    thin = [s for s in sectors if 0 < counts.get(s, 0) < 2]
    if thin:
        mark(1, False, f"Only one dot in: {', '.join(thin)}. Two or more makes the filter worth clicking.", warn=True)
    if map_text:
        hidden = re.search(r"useState[^(]*\(\s*['\"](provider|seeker|providers|requests)['\"]", map_text)
        mark(1, not hidden, "No dot type hidden by default." if not hidden else f"The map starts filtered to '{hidden.group(1)}': show every type by default.")
        default_off = re.search(r"useState[^(]*\(\s*(new Set\(\s*\)|\[\s*\])\s*\)", map_text)
        if default_off and re.search(r"activeSectors|selectedSectors|enabled", map_text):
            mark(1, False, "A sector filter may start empty. Every filter should be on when the map opens.", warn=True)


def check2(map_text, map_url):
    print("\n2. The map opens without a login")
    if map_text:
        auth = re.search(r"supabase\.auth\.(signIn|getSession|getUser)|<Login|/login['\"]|useAuth\(|RequireAuth|ProtectedRoute|signInWith", map_text)
        mark(2, not auth, "No login in the map code." if not auth else f"Login code in the map: '{auth.group(0)}'.")
    if map_url:
        r = subprocess.run(["curl", "-s", "-L", "-o", "/dev/null", "-w", "%{http_code} %{url_effective}", "-m", "20", map_url],
                           capture_output=True, text=True)
        code, _, final = (r.stdout or "000 ").partition(" ")
        login_redirect = re.search(r"login|signin|sign-in|auth", final, re.I)
        ok = code == "200" and not login_redirect
        mark(2, ok, f"{map_url} opens for a logged-out visitor (HTTP {code})." if ok else
             f"{map_url} doesn't open for a logged-out visitor: HTTP {code}, ended at {final}. "
             "Publish it publicly, or share the published link, not the editor preview.")
    else:
        mark(2, False, "No --map-url given: open the shared link in a private window and confirm the map loads with no sign-in.", warn=True)


def check3(data_text, persona_text):
    print("\n3. All data is dummy data")
    rows = rows_of(data_text)
    mark(3, not re.search(r"//\s*source:", data_text), "No rows copied from real organisations ('// source:' markers)."
         if not re.search(r"//\s*source:", data_text) else "Rows still carry '// source:' markers: real organisations. Make them fictional.")
    bad = sorted({c for r in rows if (c := field(r, "contact")) and re.sub(r"\D", "", c) not in HELPLINES})
    mark(3, not bad, "Only national helplines as phone numbers." if not bad else f"{len(bad)} phone number(s) that aren't helplines.")
    both = data_text + "\n" + persona_text
    phones = sorted({n for n in re.findall(r"(?<!\d)(?:\+?91[ -]?)?[6-9]\d{9}(?!\d)|\b0\d{2,4}[ -]?\d{6,8}\b", both)})
    mark(3, not phones, "No mobile or landline numbers anywhere." if not phones else f"{len(phones)} phone-like number(s) in data or persona text.")
    n_addr = sum(1 for r in rows if field(r, "address"))
    mark(3, not n_addr, "No street addresses." if not n_addr else f"{n_addr} row(s) have an address.")
    email = re.search(r"[\w.+-]+@[\w-]+\.[\w.]+", both)
    mark(3, not email, "No email addresses." if not email else "An email address is in the data or persona text.")
    seekers = [field(r, "name") or "" for r in rows if field(r, "type") == "seeker"]
    def ok_name(n):
        if n.startswith("Hiring:"):
            return True
        m = re.search(r"reported by (.+)$", n)
        who = (m.group(1) if m else n.split("·")[0]).strip()
        return bool(re.fullmatch(r"\S+ [A-Z]\.|a [a-z]+|.+ (SHG|Group|Samuh|Committee)", who))
    long_names = [n for n in seekers if n and not ok_name(n)]
    mark(3, not long_names, "Every person on the map is a first name and an initial." if not long_names
         else f"{len(long_names)} name(s) aren't 'First I.', e.g. '{long_names[0]}'.")


def check4(data_text, persona_text, prompt_text, map_page_text=""):
    print("\n4. Nothing sensitive (caste, religion, community, origin, marital status, gender bias, ableist words)")
    for label, text, strict in (("map data", data_text, True), ("map page text", map_page_text, True),
                                ("persona text", persona_text, True), ("bot prompt", prompt_text, False)):
        if not text:
            continue
        hits = sorted({m.group(0) for pat in SENSITIVE + GENDER_BIAS for m in re.finditer(pat, text, re.I)})
        if strict:
            mark(4, not hits, f"No sensitive words in the {label}." if not hits else f"Sensitive words in the {label}: {', '.join(hits)}.")
        elif hits:
            mark(4, False, f"Words to check in the {label}: {', '.join(hits)}. Fine only inside a 'never ask / never say' rule.", warn=True)
        origin = sorted({m.group(0) for m in re.finditer(ORIGIN, text)})
        if origin and strict:
            mark(4, False, f"State of origin in the {label}: {', '.join(origin[:3])}.")
        full = sorted({m.group(0) for m in re.finditer(FULL_NAME, text)})
        if full and strict:
            mark(4, False, f"Surnames in the {label}: {', '.join(full[:4])}. Use a first name and an initial.")
        marital = re.search(r"\b(husband|wife|widow|divorc\w*|married|unmarried|mother-in-law|father-in-law)\b", text, re.I)
        if marital and strict:
            mark(4, False, f"Marital or in-law detail in the {label}: '{marital.group(0)}'. Leave it out unless the story needs it.", warn=True)


def main():
    if len(sys.argv) < 2:
        print(__doc__); sys.exit(2)
    args = sys.argv[1:]
    opt = lambda k: args[args.index(k) + 1] if k in args else None
    folder, data, prompt = find_inputs(args[0], opt("--prompt"))
    data_text = read(data) if data else ""
    map_src, bot_src, map_url = opt("--map-src"), opt("--bot-src"), opt("--map-url")
    map_text = read(sources(map_src)) if map_src else ""
    persona_files = []
    if bot_src:
        persona_files = [p for p in sources(bot_src) if re.search(r"personas?\.(ts|json)$|Persona|Hero|PersonasSection", os.path.basename(p))
                         and "oldPersona" not in p]
    else:
        persona_files = glob.glob(os.path.join(folder, "personas.*")) + glob.glob(os.path.join(folder, "*ersonas.ts"))
    persona_text = read(persona_files) if persona_files else ""
    prompt_text = open(prompt, encoding="utf-8").read() if prompt else ""

    print(f"Audit: {os.path.basename(os.path.normpath(folder))}")
    if not data_text:
        print("  FAIL  No dot data found."); sys.exit(1)
    check1(data_text, map_text)
    check2(map_text, map_url)
    check3(data_text, persona_text)
    # Map page text: the page code itself (the "You" card, headings, notes), not other cities' leftover data files.
    map_page_text = read([p for p in sources(map_src) if "/data/" not in p and not p.endswith(".json")]) if map_src else ""
    check4(data_text, persona_text, prompt_text, map_page_text)

    print("\nResult")
    names = {1: "All types of dots visible", 2: "Map opens without login", 3: "All data is dummy", 4: "Nothing sensitive"}
    for k in (1, 2, 3, 4):
        print(f"  {'PASS' if status.get(k, True) else 'FAIL'}  {k}. {names[k]}")
    if not persona_text:
        print("  (Persona text not scanned: pass --bot-src to check the bot page's personas.)")
    sys.exit(0 if all(status.get(k, True) for k in (1, 2, 3, 4)) else 1)


if __name__ == "__main__":
    main()
