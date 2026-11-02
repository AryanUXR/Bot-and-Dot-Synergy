#!/usr/bin/env python3
"""Pre-flight a tester persona. Every check here is a mistake we actually paid for.

  1  SHORT-REPLY   a one- or two-word spoken line. Voided S2-c 6x on "विनोद।" and S2-h 6x on
                   "हाँ जी।" — the audio pipeline drops them and the bot hears silence.
  2  SILENCE-WORD  "Stop there" / "Then WAIT" / "say nothing" as a standing instruction. The
                   tester takes them literally and stops talking for the rest of the call.
  3  VAGUE-TRIGGER "later" / "if the call is still going" — no trigger condition, so the step
                   never fires. The safety-a escalation never ran in either call because of this.
  4  MULTI-TERMINAL more than one call-ending case in one journey. Only the first can ever be
                   graded; the plan forbids it and a persona shipped with three anyway.
  5  NO-CATCHALL   no "never fall silent" fallback, so an unlisted question produces dead air.
  6  NO-STATE      no machine-readable REQUIRES-STATE declaration, so nobody can check the
                   persona against the profile actually seeded. An S2-i persona claimed Low
                   Vision while the profile held Locomotor, and it nearly produced a false
                   "recommends sewing to a blind caller" finding.

Usage: persona_lint.py raya/personas/v2-out-*.md [--phone 919877000101] [--strict]
Exit 1 if any ERROR (or, with --strict, any WARN).
"""
import re, sys, os, json

# Only the IMPERATIVE forms. "Never stay silent" is the correct instruction, not a bug.
SILENCE = [r"stop there", r"then\s+WAIT", r"\bWait\.\s", r"do not speak"]
NEGATED = re.compile(r"(never|don't|do not|not to)\s+\S{0,12}\s*$", re.I)
VAGUE   = [r"if (?:the call|it) is (?:somehow )?still going", r"\blater,", r"if it is still",
           r"somehow still", r"if the call is still"]
TERMINAL_PAT = re.compile(r"Exit(?:\s+Scenario)?\s*#?\s*(\d+)|Scenario\s+(\d+)", re.I)

def spoken_lines(text):
    """Quoted strings that the tester is told to SAY (Devanagari, no Latin)."""
    out = []
    for m in re.finditer(r'"([^"\n]{1,60})"', text):
        q = m.group(1).strip()
        if not q or re.search(r"[A-Za-z]", q):
            continue
        line_start = text.rfind("\n", 0, m.start()) + 1
        line = text[line_start:text.find("\n", m.start()) if text.find("\n", m.start()) > 0 else len(text)]
        # skip quotes inside a NEGATIVE instruction ("never reply with just …")
        if re.search(r"never|do not|don't|bare word", line, re.I):
            continue
        out.append((q, line.strip()[:70]))
    return out

def behaviour_block(text):
    """Only the part the tester actually receives (mirrors uat_batch.tester_text)."""
    out, skip = [], False
    for ln in text.splitlines():
        st = ln.strip()
        if st.startswith("<!--"): skip = True
        if skip:
            if "-->" in st: skip = False
            continue
        if st.lower().startswith("## grading"): break
        out.append(ln)
    return "\n".join(out)

def in_parenthetical(body, pos):
    """True if pos sits inside ( ... ) - i.e. one of our own notes about a previous mistake,
    not an instruction to the tester."""
    op = body.rfind("(", 0, pos); cl = body.rfind(")", 0, pos)
    if op == -1 or op < cl:
        return False
    nxt = body.find(")", pos)
    return nxt != -1 and (nxt - op) < 600


def lint(path, phone=None):
    raw = open(path, encoding="utf-8").read()
    body = behaviour_block(raw)
    errs, warns = [], []
    # A persona may declare a deliberate exception, e.g. the no-audio persona is SUPPOSED to be
    # silent. It must say so explicitly: <!-- LINT-ALLOW: SILENCE-WORD reason -->
    allowed = {m.group(1) for m in re.finditer(r"LINT-ALLOW:\s*([A-Z-]+)", raw)}

    for q, line in spoken_lines(body):
        words = [w for w in re.split(r"[\s,।]+", q.strip(" ।.!?")) if w]
        if len(words) <= 2:
            errs.append(f"SHORT-REPLY  {q!r}  ({len(words)} word(s))  in: {line}")
        elif len(q.replace("।", "").strip()) <= 11:
            warns.append(f"SHORT-ISH    {q!r}  ({len(words)} words, {len(q)} chars)  in: {line}")

    for pat in SILENCE:
        for m in re.finditer(pat, body, re.I):
            if in_parenthetical(body, m.start()):
                continue                      # our own note about a past mistake
            if NEGATED.search(body[max(0, m.start()-25):m.start()]):
                continue                      # "never stop there" etc.
            ctx = body[max(0, m.start()-40):m.start()+60].replace("\n", " ")
            errs.append(f"SILENCE-WORD {m.group(0)!r}  in: …{ctx.strip()}…")
    for m in re.finditer(r"say nothing", body, re.I):
        ctx = body[max(0, m.start()-30):m.start()+70].replace("\n", " ")
        if not re.search(r"after|goodbye|closing", ctx, re.I):
            errs.append(f"SILENCE-WORD 'say nothing' with no 'after the goodbye' qualifier: …{ctx.strip()}…")

    seen_vague = set()
    for pat in VAGUE:
        for m in re.finditer(pat, body, re.I):
            if in_parenthetical(body, m.start()):
                continue                      # our own note about a past mistake
            key = body[max(0, m.start()-20):m.start()+40]
            if key in seen_vague:
                continue                      # overlapping patterns, one finding
            seen_vague.add(key)
            ctx = body[max(0, m.start()-40):m.start()+70].replace("\n", " ")
            errs.append(f"VAGUE-TRIGGER {m.group(0)!r} — give it a counted trigger. in: …{ctx.strip()}…")

    exits = set()
    for m in TERMINAL_PAT.finditer(body):
        exits.add(m.group(1) or m.group(2))
    if len(exits) > 1:
        errs.append(f"MULTI-TERMINAL this journey names {len(exits)} endings ({sorted(exits)}); "
                    f"only the first can ever be graded — split the file")

    if not re.search(r"never fall silent", body, re.I):
        errs.append("NO-CATCHALL  add the never-fall-silent fallback (before the ## Grading block, "
                    "or tester_text() strips it)")

    m = re.search(r"REQUIRES-STATE:\s*([a-z_,]+)", raw)
    if not m:
        warns.append("NO-STATE  add '<!-- REQUIRES-STATE: <state> -->' so the persona can be "
                     "checked against the seeded profile")
    elif phone:
        wants = [w.strip() for w in m.group(1).split(",") if w.strip()]
        if "any" in wants:
            return ([e for e in errs if e.split()[0] not in allowed], warns)
        want = wants[0]
        try:
            sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
            import importlib.util
            sp = importlib.util.spec_from_file_location("pd", os.path.join(
                os.path.dirname(os.path.abspath(__file__)), "pd_seed_profile.py"))
            pd = importlib.util.module_from_spec(sp); sp.loader.exec_module(pd)
            got = pd.get(phone)
            items = got.get("items") or []
            if "none" in wants:
                if items:
                    errs.append(f"STATE-MISMATCH persona needs NO profile on {phone}, "
                                f"but {len(items)} profile(s) exist there")
            elif not items:
                errs.append(f"STATE-MISMATCH persona needs {want!r} but {phone} has NO profile")
            else:
                st = items[0].get("item_state", {})
                exp = pd.state(want, phone)
                # looking_for_details is free prose the bot rewrites on every successful save,
                # so it is not part of the profile SHAPE a persona depends on.
                FREE = {"looking_for_details"}
                oks=[]
                for w in wants:
                    e2 = pd.state(w, phone)
                    d2 = [k for k in e2 if k not in FREE
                          and (st.get(k) or None) != (e2.get(k) or None)]
                    oks.append((w, d2))
                if all(d for _, d in oks):
                    w0, d0 = oks[0]
                    errs.append(f"STATE-MISMATCH persona needs {'/'.join(wants)}; "
                                f"{phone} differs on {d0} (vs {w0!r})")
        except Exception as e:
            warns.append(f"STATE-CHECK could not verify against {phone}: {type(e).__name__}: {e}")

    errs = [e for e in errs if e.split()[0] not in allowed]
    return errs, warns

def main():
    args = [a for a in sys.argv[1:]]
    strict = "--strict" in args; args = [a for a in args if a != "--strict"]
    phone = None
    if "--phone" in args:
        i = args.index("--phone"); phone = args[i+1]; del args[i:i+2]
    bad = 0
    for path in args:
        errs, warns = lint(path, phone)
        name = os.path.basename(path)
        if not errs and not warns:
            print(f"OK    {name}"); continue
        print(f"{'FAIL' if errs else 'WARN'}  {name}")
        for e in errs:  print(f"        ERROR {e}")
        for w in warns: print(f"        warn  {w}")
        if errs or (strict and warns): bad += 1
    print(f"\n{len(args)} persona(s) checked, {bad} with blocking issues")
    sys.exit(1 if bad else 0)

if __name__ == "__main__":
    main()
