"""Check a prototype's UI against the template (starter/UI-SPEC.md). Stage 5 of FLOW.md.

Usage:
  python3 scripts/ui_check.py bot <source folder> [<source folder> ...]
  python3 scripts/ui_check.py map <source folder> [<source folder> ...]
  add --ekstep for EkStep's own builds: also checks the Blue Dots header (ekstep/HEADER.md)

A source folder is a local copy of the project's code: for Lovable, the files under src/ plus
index.html and tailwind.config; for the starter, starter/public. Pass several folders to also
compare them with each other: the first one is the reference, and any card, label or photo
style that differs from it is flagged. Prints FAIL / WARN / OK lines. Exit code 1 on any FAIL.

What a script can't see (check by eye on a screenshot at 1440 px and 390 px):
  every card's top, photo, name and label line up; nothing scrolls sideways on a phone.
"""
import glob, os, re, sys

results = []


def say(level, area, msg):
    results.append(level)
    print(f"  {level:5} {area:8} {msg}")


def read_all(folder, pattern):
    out = {}
    for p in glob.glob(os.path.join(folder, "**", pattern), recursive=True):
        if "/ui/" in p or "node_modules" in p:
            continue
        try:
            out[p] = open(p, encoding="utf-8").read()
        except Exception:
            pass
    return out


def find_file(files, *names):
    for n in names:
        for p, t in files.items():
            if os.path.basename(p) == n:
                return p, t
    return None, ""


def class_of(text, marker):
    """className string on the first JSX element whose className contains marker."""
    for m in re.finditer(r'className=(?:"([^"]*)"|\{`([^`]*)`\})', text):
        c = m.group(1) or m.group(2)
        if marker in c:
            return c
    return ""


def card_signature(folder):
    files = {**read_all(folder, "*.tsx"), **read_all(folder, "*.html"), **read_all(folder, "*.js")}
    p, card = find_file(files, "PersonaCard.tsx")
    if not card:  # plain HTML starter: the card markup lives in index.html
        p, card = find_file(files, "index.html")
    sig = {}
    css = re.search(r"\.card \.photo\s*\{[^}]*\bheight:\s*(\d+px)", card)
    if css:  # plain HTML + CSS (the starter)
        sig["photo height"] = css.group(1)
        sig["equal heights"] = "yes" if re.search(r"\.card\s*\{[^}]*height:\s*100%[^}]*flex-direction:\s*column", card) else "no"
        sig["label"] = "chip" if re.search(r"\.card \.label\s*\{[^}]*border-radius[^}]*#1F2937", card, re.I) else "text"
        sig["entrance"] = "moves" if re.search(r"\.card:hover[^{]*\{[^}]*transform", card) else "fade"
        return p, card, sig
    img_h = re.search(r'(?:relative )?(h-\[\d+px\]|h-\d+|aspect-\[[^\]]+\]|aspect-\w+)[^"]*overflow-hidden', card)
    sig["photo height"] = img_h.group(1) if img_h else "?"
    sig["equal heights"] = "yes" if re.search(r"\bh-full\b", card) and "flex-col" in card else "no"
    sig["label"] = "chip" if re.search(r"inline-flex items-center gap-2 rounded-full px-3 py-1", card) else "text"
    sig["entrance"] = "moves" if re.search(r"initial=\{\{[^}]*\by\s*:", card) else "fade"
    return p, card, sig


def check_bot(folder, ekstep=False):
    files = {**read_all(folder, "*.tsx"), **read_all(folder, "*.ts"), **read_all(folder, "*.html"),
             **read_all(folder, "*.css"), **read_all(folder, "*.js")}
    allt = "\n".join(files.values())
    p, card, sig = card_signature(folder)
    if not card:
        say("FAIL", "cards", "No persona card found (PersonaCard.tsx or the card markup).")
        return sig

    # 1. Animation fights (LESSONS 59)
    moves = re.search(r"initial=\{\{[^}]*\by\s*:", card) or re.search(r"whileHover=\{\{[^}]*\by\s*:", card)
    css_moves = re.search(r"\btransition-all\b|hover:-?translate-y", card) if "className" in card else None
    if moves and css_moves:
        say("FAIL", "cards", f"Card moves with framer `y` and with CSS ({css_moves.group(0)}) at once: cards stop at different heights.")
    elif re.search(r"initial=\{\{[^}]*\by\s*:", card):
        say("WARN", "cards", "Card entrance slides in on y. The spec is fade only.")
    else:
        say("OK", "cards", "Card animation can't leave cards at different heights.")

    # 2. Equal heights
    grid = class_of(allt, "grid-cols") or ("md:grid-cols-3" if re.search(r"repeat\(3, 1fr\)", allt) else "")
    if sig["equal heights"] == "no":
        say("FAIL", "cards", "Card isn't `h-full flex flex-col`: cards in a row will have different heights.")
    else:
        say("OK", "cards", "Cards stretch to equal heights.")
    if grid and not re.search(r"(md|lg):grid-cols-3", grid):
        say("WARN", "cards", f"Persona grid isn't 3 across on desktop: '{grid}'.")

    # 3. Fixed photo height
    say("OK" if sig["photo height"] != "?" else "FAIL", "cards",
        f"Photo box has a fixed height ({sig['photo height']})." if sig["photo height"] != "?" else "Photo box has no fixed height: photos will differ.")

    # 4. One label style (LESSONS 60)
    if re.search(r"persona\.id\s*===|\[\s*['\"][a-z-]+['\"]\s*,\s*['\"][a-z-]+['\"]\s*\]\.includes\(persona", card):
        say("FAIL", "cards", "Card has a special case for some personas. Every card must use the same markup.")
    if sig["label"] == "chip":
        say("OK", "cards", "Labels are pale chips with dark text.")
    else:
        say("FAIL", "cards", "Label is plain coloured text. Use the pale chip (colour at ~12% behind #1F2937 text).")

    # 5. Page parts the spec requires
    checks = [
        ("top bar", r"Dots</|Dots\s*·|Dots\"|Dots'|\.programme\}", "programme name in the top bar"),
        ("top bar", r"href=\{?[\"'`][^\"'`]*(lovable\.app|map|dots)[^\"'`]*[\"'`]", "a link to the map"),
        ("call", r"Call as\b|Call as \{|Call as \$\{", "the call form title 'Call as <Name>'"),
        ("call", r"Call me", "the 'Call me →' button"),
        ("call", r"Connecting", "a 'Connecting…' status"),
        ("footer", r"Voice AI powered by", "'Voice AI powered by <platform>' in the footer"),
    ]
    if ekstep:  # the EkStep header (ekstep/HEADER.md) has the Blue Dots logo instead of a programme label or map link
        checks = [c for c in checks if c[0] != "top bar"]
    for area, pat, what in checks:
        if re.search(pat, allt, re.I):
            say("OK", area, f"Has {what}.")
        else:
            say("WARN", area, f"Missing {what}.")

    # 6. Persona data: first name + initial, no state of origin
    pp, pdata = find_file(files, "personas.ts", "personas.json")
    names = re.findall(r'\bname:\s*["\']([^"\']+)["\']|"name":\s*"([^"]+)"', pdata)
    names = [a or b for a, b in names]
    bad = [n for n in names if not re.fullmatch(r"\S+ [A-Z]\.", n.strip())]
    if names and bad:
        say("WARN", "data", f"{len(bad)} persona name(s) aren't 'First I.': {', '.join(bad[:4])}.")
    origin = re.findall(r"from [A-Z][a-z]+(?:, [A-Z][a-z]+)?(?:,? (?:Jharkhand|Odisha|Bihar|Uttar Pradesh|West Bengal|Assam|Rajasthan|Nepal|Bangladesh))", pdata)
    if origin:
        say("FAIL", "data", f"Persona traits name a home state: '{origin[0]}' (non-negotiable 2).")
    return sig


def check_ekstep_header(folder):
    files = {**read_all(folder, "*.tsx"), **read_all(folder, "*.json")}
    p, nav = find_file(files, "Nav.tsx", "Header.tsx", "Navbar.tsx")
    if not nav:
        say("FAIL", "header", "No Nav/Header component found."); return
    if not re.search(r"blue-dots-logo", nav):
        say("FAIL", "header", "The Blue Dots AI logo isn't in the header (ekstep/HEADER.md).")
    else:
        lp, logo = find_file(files, "blue-dots-logo.png.asset.json")
        if '"image/png"' in logo and re.search(r'"size"\s*:\s*22304', logo):
            say("OK", "header", "Header uses the official Blue Dots AI logo.")
        else:
            say("FAIL", "header", "Header logo isn't the official file (899 × 290 PNG, 22,304 bytes). Upload ekstep/assets/blue-dots-logo.png.")
    grad = re.search(r"bg-gradient-to-r from-\[#[0-9A-Fa-f]{6}\] to-\[#[0-9A-Fa-f]{6}\]", nav) \
        or re.search(r"bg-\[image:var\(--[\w-]+\)\]|className=\"[^\"]*\b[\w-]*header[\w-]*\b", nav)
    if grad and "h-20" in nav:
        say("OK", "header", "80 px gradient bar.")
    else:
        say("FAIL", "header", "Header isn't the 80 px gradient bar from Divya 2.0.")
    if re.search(r"initial=\{\{[^}]*y\s*:|scrolled", nav):
        say("WARN", "header", "Header animates or changes on scroll. The standard bar is static.")
    if not re.search(r"h-9 sm:h-12 w-auto", nav):
        say("WARN", "header", "Logo isn't h-9 sm:h-12 w-auto: it will be a different size from the other bots.")
    if not re.search(r"h-7 sm:h-9 w-px bg-(white|primary-foreground)/25", nav):
        say("WARN", "header", "No divider (h-7 sm:h-9) between the logo and the bot name.")
    if not re.search(r"text-lg sm:text-2xl[^\"]*truncate", nav):
        say("WARN", "header", "Bot name isn't text-lg sm:text-2xl truncate: it can wrap onto two lines on a phone.")


def check_map(folder):
    files = {**read_all(folder, "*.tsx"), **read_all(folder, "*.ts"), **read_all(folder, "*.html"), **read_all(folder, "*.js")}
    allt = "\n".join(files.values())
    checks = [
        ("FAIL", "access", r"supabase\.auth|signIn|<Login|/login|useAuth\(", "a login", True),
        ("WARN", "filters", r"Filters", "a collapsible 'Filters' panel", False),
        ("WARN", "filters", r"grid-cols-3|repeat\(3", "a 3 × 3 filter grid", False),
        ("WARN", "toggle", r"\bList\b", "the Map / List toggle", False),
        ("WARN", "pins", r"\bYou\b", "the 'You' marker", False),
        ("WARN", "card", r"Sample (listing|request) for this prototype", "the sample-data note on cards", False),
        ("WARN", "card", r"Directions", "a Directions button", False),
        ("WARN", "card", r"Call 108 first", "the 'Call 108 first' note on health cards", False),
    ]
    for lvl, area, pat, what, bad_if_found in checks:
        found = re.search(pat, allt)
        if bad_if_found:
            say(lvl if found else "OK", area, f"Has {what}." if found else f"No {what}.")
        else:
            say("OK" if found else lvl, area, f"Has {what}." if found else f"Missing {what}.")
    if re.search(r"VITE_GOOGLE_MAPS|GOOGLE_MAPS_API_KEY", allt) and not re.search(r"FALLBACK_GOOGLE_MAPS_API_KEY", allt):
        say("WARN", "map", "No stored fallback Maps key: the map may not load (LESSONS 58).")


def main():
    if len(sys.argv) < 3 or sys.argv[1] not in ("bot", "map"):
        print(__doc__); sys.exit(2)
    ekstep = "--ekstep" in sys.argv
    kind, folders = sys.argv[1], [a for a in sys.argv[2:] if a != "--ekstep"]
    sigs = {}
    for f in folders:
        print(f"\n{os.path.basename(os.path.normpath(f))}")
        sigs[f] = check_bot(f, ekstep) if kind == "bot" else check_map(f)
        if ekstep and kind == "bot":
            check_ekstep_header(f)
    if kind == "bot" and len(folders) > 1:
        ref = folders[0]
        print(f"\nCompared with {os.path.basename(os.path.normpath(ref))} (the reference)")
        for f in folders[1:]:
            diffs = [f"{k}: {sigs[f].get(k)} vs {v}" for k, v in sigs[ref].items() if sigs[f].get(k) != v]
            name = os.path.basename(os.path.normpath(f))
            if diffs:
                results.append("FAIL")
                print(f"  FAIL  {name}: " + "; ".join(diffs))
            else:
                print(f"  OK    {name} matches.")
    print("\nCheck by eye too: a screenshot at 1440 px and 390 px, with every card's top, photo, name and label in line.")
    sys.exit(1 if "FAIL" in results else 0)


if __name__ == "__main__":
    main()
