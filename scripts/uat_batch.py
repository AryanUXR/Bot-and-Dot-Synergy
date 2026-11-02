#!/usr/bin/env python3
"""Run a BATCH of Purple Dots UAT scenarios agent-to-agent, one call per persona.

For each persona: PATCH the tester's prompt -> POST /api/call -> poll to terminal -> save the
full call JSON. Restores the tester's original prompt + duration cap at the end (always, even on
error), because the tester is a BORROWED Blue-Dots-owned asset.

Usage: uat_batch.py <outdir> <persona.md>[:label] ...
Env:   raya/.env
"""
import json, os, sys, time, urllib.request, urllib.error, datetime, ssl

# The macOS python cert store went missing mid-session (2026-09-15) and every API call died with
# CERTIFICATE_VERIFY_FAILED. Pin verification to certifi's bundle so runs don't depend on it.
try:
    import certifi
    _SSLCTX = ssl.create_default_context(cafile=certifi.where())
except Exception:
    _SSLCTX = ssl.create_default_context()

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_env = {}
for _l in open(os.path.join(REPO, "raya/.env")):
    _l = _l.strip()
    if "=" in _l and not _l.startswith("#"):
        k, v = _l.split("=", 1); _env[k.strip()] = v.strip()
BASE = _env["RAYA_BASE_URL"].rstrip("/")
# PD_RAYA_TOKEN_VAR names WHICH key in raya/.env to authenticate with, so a run can target
# the old EkStep account (RAYA_OLD_API_TOKEN) without the secret passing through argv or env.
KEY = _env[os.environ.get("PD_RAYA_TOKEN_VAR", "RAYA_API_TOKEN")]
# The BOT and the TESTER can live on different Raya accounts (the TBT inbound bot is on the old
# account; the only tester holding an in_did is on the new one). PD_TESTER_TOKEN_VAR names the key
# used for the tester's own /api/agent/<TESTER> calls; it defaults to the same key as the bot, so
# existing single-account runs behave exactly as before.
TESTER_KEY = _env[os.environ.get("PD_TESTER_TOKEN_VAR",
                                 os.environ.get("PD_RAYA_TOKEN_VAR", "RAYA_API_TOKEN"))]
BOT = os.environ.get("PD_BOT", "db21effb-91a9-4af6-b3d2-8efed46c0415")
# The tester is NOT ours. It has been a borrowed Blue Dots agent, and after the 2026-09-22 account
# move it is an agent we can dial but not (yet) configure. Both values are env-overridable so
# swapping testers is a config change, not a code edit:
#   PD_TESTER=<uuid>  PD_TESTER_DID=<10-digit>  python3 scripts/uat_batch.py ...
# Leaving them as constants is what made the September tester swap a code change under time
# pressure, which is how the Kannada language/voice mismatch survived into 76 voided calls.
# Defaults are OUR OWN tester, created 2026-09-22 on this account (see raya/agents.json
# _tester_agent). The previous defaults were the BORROWED Blue Dots tester f60e0899 / DID
# 1204404272, which 404s on this account -- a run without the env vars would have dialled
# another account's line. Keep the env overrides: swapping testers stays a config change.
TESTER = os.environ.get("PD_TESTER", "1e8faf6a-db15-4796-81f1-55b9e9aab358")
TESTER_DID_10 = os.environ.get("PD_TESTER_DID", "8044484499")
# contact_phone is what the bot LOOKS UP -- it comes from agent_args, NOT from the dialled
# number. Verified 2026-09-15: dialled 1204404272 while args said 917946350285, and get_profile
# queried +917946350285. So the profile state under test is chosen per-run via PD_CONTACT_PHONE,
# and the tester DID is only how the call connects.
# The tester is a BORROWED Blue Dots agent configured for KANNADA (language ac4d6be6 + voice
# c343cabe). Patching only `instructions` left a Kannada ASR/TTS stack reading Hindi Devanagari
# aloud: numbers came out as Kannada ("mūvatta nālku" for 34), audio degraded to
# "*No audio/User is speaking softly*", and 6 of 10 Stage-2 calls were void. Root-caused
# 2026-09-15. We now also patch language+voice to the SAME Hindi pair the Purple bot uses, and
# restore all of it in the finally block.
TESTER_LANG_HI  = "38695ff2-ee6f-4a1c-837b-27ab241377f7"   # Hindi (as on the Purple bot)
TESTER_VOICE_HI = "bc303a66-1fb8-4e66-9b15-7b9b71567003"   # Hindi voice (as on the Purple bot)
# The tester's ASR/TTS stack MUST match the language the persona speaks, or the Kannada->void
# failure above repeats. Default to Hindi; override to the bot's own language/voice when the
# persona is Kannada (PD_TESTER_LANG / PD_TESTER_VOICE = the Kannada bot's language_id/voice_id).
TESTER_LANG  = os.environ.get("PD_TESTER_LANG",  TESTER_LANG_HI)
TESTER_VOICE = os.environ.get("PD_TESTER_VOICE", TESTER_VOICE_HI)
TESTER_LANG_LABEL = os.environ.get("PD_TESTER_LANG_LABEL", "Hindi")
# INBOUND mode: instead of the bot dialling the tester, the persona-loaded tester DIALS this DID
# (the bot-under-test's inbound line). The bot then receives a true inbound call. agent_args go to
# the CALLER (tester), so the bot sees no campaign args and identifies the caller by caller-ID —
# exactly a cold/returning inbound. The prompt-baseline guard is skipped in this mode (we cannot
# GET the receiving bot's prompt through the caller).
INBOUND_DIAL = os.environ.get("PD_INBOUND_DIAL")  # 10-digit DID of the bot's inbound line, or None
CONTACT_PHONE = os.environ.get("PD_CONTACT_PHONE", "917946350285")
CONTACT_NAME = os.environ.get("PD_CONTACT_NAME", "रमेश यादव")
ARGS = {"contact_name": CONTACT_NAME, "contact_phone": CONTACT_PHONE,
        "contact_reference": "सुरेश", "contact_reference_salutation": "जी", "country_code": "91"}
# The INBOUND agent declares only contact_phone and country_code — it has no referrer and no
# caller name, because on a real inbound call it learns who it is speaking to by asking.
# Sending the outbound bot's extra variables to it is at best noise and at worst a rejected
# request, so PD_ARGS_MINIMAL=1 trims agent_args to exactly what that agent declares.
if os.environ.get("PD_ARGS_MINIMAL") == "1":
    ARGS = {"contact_phone": CONTACT_PHONE, "country_code": "91"}
# KKB Slim reads ${location} (the caller's job-search area, campaign-set) in the location turn.
# Pass it via PD_LOCATION on outbound runs; inbound (minimal) learns location by asking.
if os.environ.get("PD_LOCATION") and os.environ.get("PD_ARGS_MINIMAL") != "1":
    ARGS["location"] = os.environ["PD_LOCATION"]
UA = "Mozilla/5.0 (compatible; raya-deploy/1.0; +prompt-tuner)"


def req(method, path, body=None, tries=3):
    # Route by path: anything addressing the tester agent authenticates with TESTER_KEY.
    _key = TESTER_KEY if TESTER in path else KEY
    for a in range(tries):
        data = json.dumps(body).encode() if body is not None else None
        h = {"X-API-Key": _key, "User-Agent": UA, "Accept": "application/json"}
        if data is not None:
            h["Content-Type"] = "application/json"
        r = urllib.request.Request(BASE + path, data=data, headers=h, method=method)
        try:
            with urllib.request.urlopen(r, timeout=40, context=_SSLCTX) as resp:
                raw = resp.read().decode()
                return resp.status, (json.loads(raw) if raw.strip() else {})
        except urllib.error.HTTPError as e:
            body_txt = e.read().decode()[:300]
            if e.code == 429 and a < tries - 1:
                print(f"    429 rate-limited, backing off 20s", flush=True); time.sleep(20); continue
            return e.code, {"_err": body_txt}
        except Exception as e:
            if a < tries - 1: time.sleep(5); continue
            return 0, {"_err": f"{type(e).__name__}: {e}"}


def latest_call_uuid():
    _, d = req("GET", f"/api/call?agent_id={BOT}&limit=1")
    c = (d.get("calls") or d.get("data") or [])
    return c[0]["uuid"] if c else None


CONNECT_TRIES = 3          # bridging is intermittent; a dial can fail instantly with dur=0
SETTLE = int(os.environ.get("PD_SETTLE", "30"))   # sec to wait after switching tester language


def bot_prompt_hash(tries=5):
    """sha256[:12] + length of the LIVE bot prompt, or (None, None) if it cannot be read.

    NEVER returns a hash for an empty read. A 429 once made this return sha256("") = e3b0c442…,
    which was then accepted as the run's baseline - so the guard compared every later call against
    nothing. A guard that silently accepts a null reading is worse than no guard at all.
    """
    import hashlib
    for a in range(tries):
        st, d = req("GET", f"/api/agent/{BOT}")
        ins = d.get("instructions") or ""
        if ins:
            return hashlib.sha256(ins.encode()).hexdigest()[:12], len(ins)
        print(f"    prompt hash read empty (HTTP {st}) — retry {a+1}/{tries} after 30s", flush=True)
        time.sleep(30)
    return None, None


# The product owner edits the live prompt directly. It changed twice mid-campaign, and the first
# Stage 2 (10 calls) had to be discarded because results could not be attributed to a version.
# Logging the hash around the batch was not enough - a change at call 3 of 220 would not surface
# until the end. So: capture it once, re-check before EVERY call, and abort the batch the moment
# it moves. Every saved result carries the hash it ran against.
BASELINE = {"sha": None, "len": None}


def provider_count(lat=27.56888987134783, lng=80.6801513397425):
    """How many providers the search area holds RIGHT NOW.

    The hash guard catches the PROMPT changing mid-run. It does not catch the DATA changing, and
    that happened twice: a Sitapur provider appeared between calls 6 and 7 of the first pilot
    (so calls 1-6 and 7-15 measured different worlds), and the index went 1 -> 5 just before the
    second. Without this, a rate like "search returned nothing in 6 of 15" silently mixes two
    environments. Stamped per call so results stay attributable. Best-effort: never fail a batch.
    """
    try:
        _, a = req("GET", f"/api/agent/{BOT}")
        sp = [t for t in a["tools"]["llm_tools"]
              if t["function"]["name"] == "get_providers_for_location"][0]["api_details"]
        body = {"context": {"version": "1.0.0", "messageId": "m-fingerprint",
                            "networkId": "purple_dot", "domain": "provider",
                            "itemType": "profile_1.0"},
                "message": {"intent": {"spatial": [{"op": "s_dwithin",
                                "geometry": {"type": "Point", "coordinates": [lng, lat]},
                                "distanceMeters": 30000}]},
                            "pagination": {"limit": 50, "offset": 0}}}
        h = dict(sp["header"]); h["User-Agent"] = UA
        h["Content-Type"] = "application/json"; h["Accept"] = "application/json"
        r = urllib.request.urlopen(urllib.request.Request(
            sp["url"], data=json.dumps(body).encode(), headers=h, method="POST"),
            timeout=25, context=_SSLCTX)
        return len(json.loads(r.read().decode())["message"]["items"])
    except Exception:
        return None


def tester_text(raw):
    """Strip OUR metadata before handing a persona to the tester.

    A persona file carries two audiences: the caller behaviour the tester must act out, and the
    grading criteria / case numbers that are notes to US. The tester has no business reading the
    latter — they are English test prose in a Hindi persona, and the two longest personas
    (1.9k/2.2k chars, both with big trailing grading blocks) are the ones that kept coming back
    with the tester mute. Keep the files self-documenting; send only the behaviour.
    """
    out, skip = [], False
    for ln in raw.splitlines():
        st = ln.strip()
        if st.startswith("<!--"):
            skip = True
        if skip:
            if "-->" in st:
                skip = False
            continue
        if st.lower().startswith("## grading"):
            break                      # grading block is trailing; everything after is ours
        out.append(ln)
    return "\n".join(out).strip() + "\n"


def run_one(pfile, label, outdir, _try=1):
    print(f"\n{'='*64}\n### {label}  ({os.path.basename(pfile)})", flush=True)
    raw = open(pfile, encoding="utf-8").read()
    text = tester_text(raw)
    st, resp = req("PATCH", f"/api/agent/{TESTER}", {"instructions": text})
    if (resp.get("instructions") or "").rstrip() != text.rstrip():
        # A transport error here (HTTP 0) is transient, not a bot result. Skipping cost us one
        # half of the S2-h pair on 2026-09-16 and left the club ungradeable, so retry instead.
        if _try < CONNECT_TRIES:
            print(f"  !! persona PATCH not verified (HTTP {st}) — retry {_try+1}/{CONNECT_TRIES} "
                  f"after 30s", flush=True)
            time.sleep(30)
            return run_one(pfile, label, outdir, _try + 1)
        print(f"  !! persona PATCH not verified (HTTP {st}) after {CONNECT_TRIES} tries — "
              f"skipping", flush=True)
        return None
    # Language is set once per batch (see main). Re-verify per call: a silent revert would
    # void the result without any other symptom.
    if resp.get("language_id") != TESTER_LANG or resp.get("voice_id") != TESTER_VOICE:
        print(f"  !! tester LANGUAGE/VOICE not {TESTER_LANG_LABEL} (lang={resp.get('language_id')} "
              f"voice={resp.get('voice_id')}) — refusing to run, results would be void",
              flush=True); return None
    print(f"  persona loaded ({len(text)} of {len(raw)} chars, metadata stripped) "
          f"| tester lang={TESTER_LANG_LABEL}", flush=True)
    # Prompt-version gate. Abort rather than keep collecting results against a moved target.
    # Skipped in INBOUND mode: the receiving bot's prompt is not reachable through the caller.
    if not INBOUND_DIAL:
        sha, ln = bot_prompt_hash()
        if sha is None:
            print("  !! could not read the live prompt hash — refusing to run this call rather than "
                  "record a result that cannot be attributed to a prompt version", flush=True)
            return None
        if BASELINE["sha"] is None:
            BASELINE["sha"], BASELINE["len"] = sha, ln
            print(f"  prompt baseline {sha} ({ln} chars)", flush=True)
        elif sha != BASELINE["sha"]:
            print(f"\n!!!! ABORTING BATCH — THE LIVE PROMPT CHANGED MID-RUN !!!!\n"
                  f"     baseline {BASELINE['sha']} ({BASELINE['len']} chars)\n"
                  f"     now      {sha} ({ln} chars)\n"
                  f"     Results already saved are valid for {BASELINE['sha']}. Everything from here "
                  f"would be against a different prompt.\n"
                  f"     Reconcile (raya_deploy.py pull) and restart the batch.", flush=True)
            raise SystemExit(3)
    before = latest_call_uuid()
    # INBOUND: the persona-loaded TESTER dials the bot's inbound DID. OUTBOUND: the bot dials tester.
    _agent = TESTER if INBOUND_DIAL else BOT
    _to = INBOUND_DIAL if INBOUND_DIAL else TESTER_DID_10
    st, resp = req("POST", "/api/call", {"agent_id": _agent, "to_number": _to,
                                         "agent_args": ARGS, "country_code": "91",
                                         "timezone": "Asia/Kolkata"})
    if st >= 300:
        print(f"  !! call fire failed HTTP {st}: {resp.get('_err')}", flush=True); return None
    print(f"  call fired (HTTP {st})", flush=True)
    # POST /api/call returns the new call's uuid directly:
    #   {"message": "Call initiated successfully", "uuid": "<uuid>"}
    # Use it. The old path ignored that and polled latest_call_uuid() every 20s (sleeping FIRST)
    # for up to 10 minutes, waiting for the call to surface in the LIST endpoint — which in
    # practice happened only once the call was well underway. Measured cost: ~4.5 min of the ~8 min
    # wall time per call, against 3.5 min of actual talk time. It also hammered the list endpoint,
    # which is what made the batch 429-prone.
    cid = resp.get("uuid") or resp.get("call_uuid") or (resp.get("data") or {}).get("uuid")
    if not cid:
        # Fall back to the old discovery loop if the response shape ever changes, so a silent
        # API change degrades to "slow" rather than "every call fails".
        print("  !! POST returned no uuid — falling back to list polling", flush=True)
        for _ in range(30):
            time.sleep(20)
            u = latest_call_uuid()
            if u and u != before:
                cid = u; break
    if not cid:
        print("  !! no new call appeared", flush=True); return None
    print(f"  call {cid}", flush=True)
    for i in range(80):
        _, c = req("GET", f"/api/call/{cid}")
        oc = c.get("call_outcome") or c.get("outcome") or ""
        tr = c.get("call_transcript") or []
        # The `outcome` field LAGS, sometimes by hours: three calls on 2026-09-22 still read
        # Pending/0s/0turns long after they had run full 224s conversations, and waiting on it
        # cost ~20 min of dead polling per call (measured 26 min/call against 4 min of talk).
        # `call_end_time` is set equal to call_start_time while a call is in flight and only
        # moves once it really ends, where end-start matches call_duration to the second
        # (verified across recorded calls). So treat a moved end_time as terminal regardless of
        # what `outcome` says, and keep the old outcome test as a second route.
        _st, _en = c.get("call_start_time"), c.get("call_end_time")
        ended = bool(_st and _en and _en > _st)
        if (ended and tr) or (oc not in ("Pending", "") and (tr or (c.get("call_duration") or 0) > 0
                                          or oc in ("Failure", "Unanswered"))):
            for _ in range(3):          # call_output lags; wait briefly — but not on a dead call
                if c.get("call_output") or not (c.get("call_transcript") or []): break
                time.sleep(10); _, c = req("GET", f"/api/call/{cid}")
            tr = c.get("call_transcript") or []
            # Intermittent telephony: an instant Failure with no transcript is a BRIDGING
            # failure, not a bot result. Retry the connect rather than recording a false finding.
            # Gate on the TRANSCRIPT, not the duration: a degenerate connect can report
            # Completed with dur=1 and no transcript, which is still a bridging failure.
            if not tr:
                if _try < CONNECT_TRIES:
                    print(f"  bridging failed ({oc}, dur={c.get('call_duration')}, no transcript) — retry {_try+1}"
                          f"/{CONNECT_TRIES} after 45s", flush=True)
                    time.sleep(45)
                    return run_one(pfile, label, outdir, _try + 1)
                print(f"  !! bridging failed {CONNECT_TRIES}x — NOT a bot finding", flush=True)
                return None
            # A MUTE TESTER is a harness failure, not a bot result: the call bridges, the bot
            # delivers its ~28s opening, the tester never speaks, and the call dies at ~30s. The
            # bridging check above misses it because a 3-turn transcript DOES exist. Seen in
            # 3 of 10 Stage-2 calls (2026-09-15) and it survived the Kannada->Hindi fix, so
            # retry it rather than record a false "bot exited on the audio branch".
            uts = [str(t.get("content") or "") for t in tr if t.get("role") == "user"]
            real = [u for u in uts if u.strip() and "No audio" not in u
                    and u.strip().lower() not in ("hello", "hello.")]
            if not real:
                if _try < CONNECT_TRIES:
                    print(f"  tester never spoke ({len(tr)} turns, dur={c.get('call_duration')}) "
                          f"— harness void, retry {_try+1}/{CONNECT_TRIES} after 45s", flush=True)
                    time.sleep(45)
                    return run_one(pfile, label, outdir, _try + 1)
                print(f"  !! tester mute {CONNECT_TRIES}x — NOT a bot finding", flush=True)
                return None
            path = os.path.join(outdir, f"{label}_{cid[:8]}.json")
            c["_providers_in_area"] = provider_count()  # data fingerprint, see provider_count()
            c["_prompt_sha"] = BASELINE["sha"]          # key every result to its prompt version
            c["_prompt_len"] = BASELINE["len"]
            c["_persona"] = os.path.basename(pfile)
            c["_contact_phone"] = CONTACT_PHONE
            json.dump(c, open(path, "w"), ensure_ascii=False, indent=1)
            ntc = sum(len(t.get("tool_calls") or []) for t in (c.get("call_transcript") or []))
            print(f"  DONE {oc} | dur={c.get('call_duration')}s | turns={len(c.get('call_transcript') or [])}"
                  f" | tool_calls={ntc} | output={'yes' if c.get('call_output') else 'NULL'}", flush=True)
            return path
        time.sleep(10)
    print("  !! never reached terminal", flush=True); return None


def acquire_tester_lock():
    """Mutex on the SHARED tester. Two batches running at once fight over the tester's
    language/voice PATCH + restore: one corrupts the other's calls and can leave the borrowed
    agent in a persona-loaded state (2026-10-07 KN/HI edge collision). Hold an flock for the whole
    batch; a second batch refuses to start rather than overlap. Auto-released when the process exits.
    Keyed on the tester uuid so batches against different testers don't block each other."""
    import fcntl
    lockpath = os.path.join(REPO, "raya", f".tester-{TESTER}.lock")
    f = open(lockpath, "w")
    try:
        fcntl.flock(f, fcntl.LOCK_EX | fcntl.LOCK_NB)
    except OSError:
        sys.exit(f"ABORT: another uat_batch already holds the tester lock ({lockpath}). "
                 f"The tester is shared — run batches ONE AT A TIME (wait for the running one to "
                 f"finish). Not starting, to avoid corrupting the in-flight batch.")
    f.write(f"pid={os.getpid()} {datetime.datetime.now().isoformat()}\n"); f.flush()
    return f  # keep a ref so the fd (and the lock) lives for the whole run


def main():
    outdir = sys.argv[1]; os.makedirs(outdir, exist_ok=True)
    _tester_lock = acquire_tester_lock()  # noqa: F841 (held for the batch's lifetime)
    specs = []
    for a in sys.argv[2:]:
        if ":" in a and not a.endswith(".md"):
            f, l = a.rsplit(":", 1)
        else:
            f, l = a, os.path.splitext(os.path.basename(a))[0]
        specs.append((f, l))
    # Pre-flight every persona. Cheaper to fail here than to discover a mute tester 15 calls in.
    import subprocess
    lint = subprocess.run([sys.executable, os.path.join(REPO, "scripts/persona_lint.py")]
                          + [f for f, _ in specs], capture_output=True, text=True)
    if lint.returncode != 0:
        print(lint.stdout); print(lint.stderr)
        sys.exit("ABORT: persona lint failed — fix the personas before spending calls.")
    print(f"persona lint: {len(specs)} spec(s) clean", flush=True)
    _, t0 = req("GET", f"/api/agent/{TESTER}")
    orig_ins = t0.get("instructions") or ""; orig_dur = t0.get("max_call_duration_mins")
    orig_lang = t0.get("language_id"); orig_voice = t0.get("voice_id")
    # The bot greets first. A tester with say_hello=True greets over it and garbles the opening —
    # the Blue Dots tester ships with it ON, ours is OFF. Force it off, restore whatever it was.
    orig_hello = t0.get("say_hello")
    # A failed backup GET used to return empty/None for everything, and the finally block would
    # then PATCH the BORROWED Blue Dots tester to empty instructions + null language/voice.
    # Near-miss 2026-09-15. Refuse to touch the agent unless the backup is complete.
    if not orig_ins.strip() or not orig_lang or not orig_voice or not orig_dur:
        sys.exit(f"ABORT: tester backup incomplete (ins={len(orig_ins)} chars, dur={orig_dur}, "
                 f"lang={orig_lang}, voice={orig_voice}). Refusing to run — a restore from this "
                 f"would wipe the borrowed Blue Dots agent. Check API reachability first.")
    bdir = os.path.join(REPO, "raya/personas/_backups"); os.makedirs(bdir, exist_ok=True)
    ts = datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
    open(os.path.join(bdir, f"BATCH-{ts}.txt"), "w", encoding="utf-8").write(orig_ins)
    open(os.path.join(bdir, f"BATCH-{ts}.config.json"), "w").write(json.dumps(
        {"max_call_duration_mins": orig_dur, "language_id": orig_lang, "voice_id": orig_voice},
        indent=1))
    print(f"tester backed up ({len(orig_ins)} chars, dur={orig_dur}, "
          f"lang={orig_lang}, voice={orig_voice})", flush=True)
    print(f"contact_phone under test = {CONTACT_PHONE}  (dialled DID = {TESTER_DID_10})", flush=True)
    # Switch the tester to the persona language ONCE per batch. A language/voice change appears to
    # re-provision the voice pipeline: a call fired seconds after the PATCH came back with the
    # tester mute and the call dead at 6s (smoke test 2026-09-15), so give it time to settle.
    st, r = req("PATCH", f"/api/agent/{TESTER}", {"language_id": TESTER_LANG,
                                                 "voice_id": TESTER_VOICE,
                                                 "max_call_duration_mins": 15,
                                                 "say_hello": False})
    if r.get("language_id") != TESTER_LANG or r.get("voice_id") != TESTER_VOICE:
        print(f"!! could not switch tester to {TESTER_LANG_LABEL} (HTTP {st}) — aborting", flush=True)
        req("PATCH", f"/api/agent/{TESTER}", {"instructions": orig_ins,
                                              "max_call_duration_mins": orig_dur,
                                              "language_id": orig_lang, "voice_id": orig_voice})
        sys.exit(1)
    print(f"tester switched to {TESTER_LANG_LABEL} (lang={TESTER_LANG[:8]}, voice={TESTER_VOICE[:8]}), "
          f"settling {SETTLE}s", flush=True)
    time.sleep(SETTLE)
    try:
        for i, (f, l) in enumerate(specs):
            run_one(f, l, outdir)
            if i < len(specs) - 1:
                time.sleep(60)          # wider spacing: bursts degrade bridging (3/7 failed at 20s)
    finally:
        restore = {"instructions": orig_ins}
        if orig_hello is not None:
            restore["say_hello"] = orig_hello
        for k, v in (("max_call_duration_mins", orig_dur), ("language_id", orig_lang),
                     ("voice_id", orig_voice)):
            if v:                      # never null out a field we failed to read
                restore[k] = v
        st, r = req("PATCH", f"/api/agent/{TESTER}", restore)
        ok = (r.get("instructions") or "").rstrip() == orig_ins.rstrip()
        lang_ok = r.get("language_id") == orig_lang and r.get("voice_id") == orig_voice
        print(f"\nTESTER RESTORED: HTTP {st} | instructions_match={ok} | "
              f"dur={r.get('max_call_duration_mins')} | lang/voice_restored={lang_ok}", flush=True)
        if not (ok and lang_ok):
            print("  !! RESTORE INCOMPLETE — Blue Dots tester left modified. "
                  f"Backup: raya/personas/_backups/BATCH-{ts}.txt (+ .config.json)", flush=True)


if __name__ == "__main__":
    main()
