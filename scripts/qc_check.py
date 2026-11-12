"""QC a use case against the non-negotiables (onboarding/non-negotiables.md). Stage 4 of FLOW.md.

Usage:
  python3 scripts/qc_check.py <use-case-slug | folder | data file> [--prompt <conversation prompt .md>]

Finds dot data (*.ts or dots.json) and the bot's conversation prompt (raya/<Bot> <Language>.md)
in use-cases/<slug>/ unless given explicitly. Prints FAIL / WARN / OK lines, then the manual
checks no script can do. Exit code 1 if anything FAILs.
"""
import glob, json, os, re, sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HELPLINES = {"108", "112", "181", "1098", "1033", "1077", "100", "101", "102", "1091"}
SENSITIVE = [
    r"\bcaste\b", r"\bjati\b", r"\bdalit", r"\badivasi", r"\btribal\b", r"\bSC/ST\b", r"\bOBC\b", r"\bscheduled (caste|tribe)",
    r"\bbrahmin", r"\bmuslim", r"\bhindu\b", r"\bchristian\b", r"\breligio", r"\bhusband\b", r"\bwidow", r"\bdivorc",
    r"\bseparated from\b", r"\bfrom (bihar|jharkhand|odisha|orissa|uttar pradesh|up|bengal|west bengal|assam|nepal|bangladesh|rajasthan|madhya pradesh|chhattisgarh)\b",
    r"\bbihari\b", r"\billiterate\b", r"\bfair[- ]skinned\b", r"\bhousewife\b",
    "जाति", "दलित", "आदिवासी", "मुस्लिम", "हिंदू", "विधवा", "बिहारी",
]
results = []


def say(level, area, msg):
    results.append(level)
    print(f"{level:5} {area:7} {msg}")


def find_inputs(arg, prompt_arg):
    if os.path.isfile(arg):
        data = [arg]; folder = os.path.dirname(arg)
    else:
        folder = arg if os.path.isdir(arg) else os.path.join(REPO, "use-cases", arg)
        data = [p for p in glob.glob(os.path.join(folder, "*.ts")) if "Dots" in os.path.basename(p)] \
            or glob.glob(os.path.join(folder, "*.ts")) or glob.glob(os.path.join(folder, "**/dots.json"), recursive=True)
    prompt = prompt_arg
    if not prompt:
        cands = [p for p in glob.glob(os.path.join(folder, "raya", "*.md"))
                 if not re.search(r"(Memory|Output|CHANGELOG)", os.path.basename(p))]
        prompt = cands[0] if cands else None
    return folder, data, prompt


def rows_of(text):
    # One dot = one object literal holding an id. Works for .ts rows and dots.json objects.
    return [m.group(0) for m in re.finditer(r"\{[^{}]*?\"?id\"?\s*:\s*\d+[^{}]*\}", text, re.S)]


def field(row, key):
    m = re.search(r'"?%s"?\s*:\s*"((?:[^"\\]|\\.)*)"' % key, row)
    return m.group(1) if m else None


def check_data(paths):
    if not paths:
        say("FAIL", "data", "No dot data file found."); return
    text = "\n".join(open(p, encoding="utf-8").read() for p in paths)
    rows = rows_of(text)
    if not rows:
        say("FAIL", "data", "Could not read any dot rows."); return
    say("OK", "data", f"{len(rows)} dots read from {', '.join(os.path.basename(p) for p in paths)}.")

    if re.search(r"//\s*source:", text):
        say("FAIL", "data", "Rows still carry '// source:' markers: these were real organisations. Make them fictional (rule 1).")
    bad_contacts = sorted({c for r in rows if (c := field(r, "contact")) and re.sub(r"\D", "", c) not in HELPLINES})
    if bad_contacts:
        say("FAIL", "data", f"{len(bad_contacts)} non-helpline contact(s), e.g. a number ending …{re.sub(chr(92)+'D','',bad_contacts[0])[-3:]}. Only national helplines are allowed (rule 1).")
    else:
        say("OK", "data", "No phone numbers except helplines.")
    n_addr = sum(1 for r in rows if field(r, "address"))
    say("FAIL" if n_addr else "OK", "data", f"{n_addr} row(s) have an address (rule 1)." if n_addr else "No addresses.")
    if re.search(r"[\w.+-]+@[\w-]+\.[\w.]+", text):
        say("FAIL", "data", "An email address is in the data (rule 1).")

    hits = sorted({m.group(0) for pat in SENSITIVE for m in re.finditer(pat, text, re.I)})
    say("FAIL" if hits else "OK", "data", f"Sensitive terms: {', '.join(hits)} (rule 2)." if hits else "No sensitive terms found.")

    seekers = [r for r in rows if field(r, "type") == "seeker"]
    def ok_name(n):
        m = re.search(r"reported by (.+)$", n)
        who = m.group(1) if m else n.split("·")[0]
        return bool(re.fullmatch(r"\S+ [A-Z]\.|a [a-z]+|.+ (SHG|Group|Samuh|Committee)", who.strip()))
    long_names = [field(r, "name") for r in seekers if field(r, "name") and not ok_name(field(r, "name"))]
    if long_names:
        say("WARN", "data", f"{len(long_names)} request name(s) aren't 'First I.' style, e.g. '{long_names[0]}' (rule 2).")

    m = re.search(r"SECTORS\s*=\s*\[(.*?)\]", text, re.S)
    sectors = re.findall(r'"([^"]+)"', m.group(1)) if m else []
    if not sectors and paths[0].endswith(".json"):
        try:
            sectors = [s["name"] for s in json.load(open(paths[0])).get("sectors", [])]
        except Exception:
            pass
    counts = {}
    for r in rows:
        counts[field(r, "sector")] = counts.get(field(r, "sector"), 0) + 1
    empty = [s for s in sectors if not counts.get(s)]
    say("FAIL" if empty else "OK", "data", f"Filters with no dots: {', '.join(empty)} (rule 3)." if empty else f"All {len(sectors)} filters have dots.")
    n_prov = sum(1 for r in rows if field(r, "type") == "provider")
    if not seekers or not n_prov:
        say("FAIL", "data", f"Need both requests and providers on the map: {len(seekers)} requests, {n_prov} providers (rule 3).")
    else:
        say("OK", "data", f"{len(seekers)} requests and {n_prov} providers.")
    dup = sum(1 for r in rows if (d := field(r, "description")) and "for this prototype" in d)
    if dup:
        say("WARN", "data", f"{dup} description(s) contain 'for this prototype': the card already shows that note (LESSONS.md 50).")


def check_prompt(path):
    if not path:
        say("WARN", "prompt", "No conversation prompt found. Pass --prompt if the bot has one."); return
    t = open(path, encoding="utf-8").read()
    say("OK", "prompt", f"Reading {os.path.basename(path)}.")
    if "Goodbye" not in t:
        say("FAIL", "prompt", "No closing line ends with the hang-up word (Goodbye on Raya) (rule 7).")
    else:
        closers = re.findall(r'"[^"\n]*Goodbye[^"\n]*"', t)
        bad = [c for c in closers if not c.rstrip('"').rstrip().endswith("Goodbye")]
        say("FAIL" if bad else "OK", "prompt", f"Closing line has words after Goodbye: {bad[0][:60]} (rule 7)." if bad else f"{len(closers)} closing line(s) end with Goodbye.")
    if not re.search(r"और किसी चीज़ की ज़रूरत है|anything else", t, re.I):
        say("FAIL", "prompt", "No 'anything else?' line after answers (rule 7).")
    if re.search(r"(must|should) end (by|within|in) \d+ ?min|end by \d+ ?minutes|calls must end by", t, re.I):
        say("FAIL", "prompt", "A time limit is in the prompt. The bot can't see a clock (rule 8).")
    else:
        say("OK", "prompt", "No time limits in the prompt.")
    promise = re.search(r"\b(I will|I'll) (tell|inform|pass|send|share|call you back)\b", t, re.I)
    if promise and not re.search(r"(do not|don't|never|no) (offer or )?promise", t, re.I):
        say("WARN", "prompt", f"Possible post-call promise: '{promise.group(0)}' (rule 8).")
    nums = sorted({n for n in re.findall(r"\b\d{3,5}[ -]?\d{5,7}\b", t) if re.sub(r'\D', '', n) not in HELPLINES})
    if nums:
        say("FAIL", "prompt", f"{len(nums)} phone-like number(s) in the prompt or directory (rule 1).")
    hits = sorted({m.group(0) for pat in SENSITIVE for m in re.finditer(pat, t, re.I)})
    # The prompt may legitimately tell the bot NOT to ask about a husband etc., so these are warnings.
    if hits:
        say("WARN", "prompt", f"Sensitive terms present: {', '.join(hits)}. Fine only if they're in a 'never ask' rule (rule 2).")


def main():
    if len(sys.argv) < 2:
        print(__doc__); sys.exit(2)
    prompt_arg = sys.argv[sys.argv.index("--prompt") + 1] if "--prompt" in sys.argv else None
    folder, data, prompt = find_inputs(sys.argv[1], prompt_arg)
    check_data(data)
    check_prompt(prompt)
    print("""
Manual checks (no script can do these):
  - Page title and tagline say what the bot does, not what it gives (rule 5).
  - Every persona photo shows the face clearly, and no real person's photo is used without consent (rule 6).
  - The map opens in a private window with no login (rule 4).
  - Website-path call and bot-to-bot tests are logged in tests.md (rule 9).""")
    sys.exit(1 if "FAIL" in results else 0)


if __name__ == "__main__":
    main()
