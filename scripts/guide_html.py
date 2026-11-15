"""Convert GUIDE.md to HTML that Google Drive turns into a clean Google Doc (headings, lists, tables, code boxes).

Used by `scripts/gdocs.py sync-guide`. Handles only what GUIDE.md uses: #/##/### headings, paragraphs, > notes,
numbered and bulleted lists (with indented sub-bullets and code), tables, ``` code blocks, `code`, **bold**, *italic*.
Links become plain text (the repo is private, so they would not open from the doc).
"""
import html
import re

MONO = "font-family:'Roboto Mono','Courier New',monospace;font-size:9.5pt"
DOC_NOTE = ("> **Maintained by the EkStep Bot-and-Dot team.** Last reviewed: **{date}**. This doc has the same content as "
            "`GUIDE.md` in the skill's repo, which the AI agent reads. When one changes, update the other the same day. "
            "If either doesn't match the repo's files, the repo wins.")


def _inline(t):
    t = html.escape(t, quote=False)
    t = re.sub(r"`([^`]+)`", lambda m: f'<span style="{MONO}">{m.group(1)}</span>', t)
    t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    t = re.sub(r"(?<![\w*])\*([^*\n]+?)\*(?![\w*])", r"<i>\1</i>", t)
    return re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", t)


def _code(lines):
    rows = ['<span style="%s">%s</span>' % (MONO, html.escape(c).replace(" ", "&nbsp;")) for c in lines]
    return ('<table style="border-collapse:collapse;width:100%"><tr><td style="background:#F3F4F6;padding:6pt;'
            'border:1px solid #E5E7EB">' + "<br>".join(rows) + "</td></tr></table>")


def convert(md):
    # The doc's top note says it mirrors GUIDE.md; keep GUIDE.md's own review date.
    m = re.search(r"^> \*\*Maintained by.*$", md, re.M)
    if m:
        date = re.search(r"Last reviewed: \*\*(.+?)\*\*", m.group(0))
        md = md.replace(m.group(0), DOC_NOTE.format(date=date.group(1) if date else ""))
    if "$" in md:
        raise ValueError("GUIDE.md contains '$': Google Docs turns text between two $ signs into a formula. Reword it.")
    out, L, i = [], md.split("\n"), 0
    while i < len(L):
        line, s = L[i], L[i].strip()
        if s.startswith("```"):
            i += 1; code = []
            while not L[i].strip().startswith("```"):
                code.append(L[i][3:] if L[i].startswith("   ") else L[i]); i += 1
            i += 1; out.append(_code(code)); continue
        if not s or s == "---":
            i += 1; continue
        h = re.match(r"^(#{1,3}) (.*)", s)
        if h:
            n = len(h.group(1)); out.append(f"<h{n}>{_inline(h.group(2))}</h{n}>"); i += 1; continue
        if s.startswith("|"):
            rows = []
            while i < len(L) and L[i].strip().startswith("|"):
                r = L[i].strip()
                if not re.match(r"^\|[\s:|-]+\|$", r):
                    rows.append([c.strip() for c in r.strip("|").split("|")])
                i += 1
            t = '<table style="border-collapse:collapse;width:100%">'
            for k, r in enumerate(rows):
                t += "<tr>" + "".join(
                    f'<td style="border:1px solid #D1D5DB;padding:4pt;{"background:#EEF2FF;" if k == 0 else ""}">'
                    + (f"<b>{_inline(c)}</b>" if k == 0 and c else _inline(c)) + "</td>" for c in r) + "</tr>"
            out.append(t + "</table>"); continue
        if s.startswith("> "):
            out.append(f'<p style="background:#F3F4F6;padding:6pt">{_inline(s[2:])}</p>'); i += 1; continue
        if re.match(r"^\d+\. ", s) or re.match(r"^- ", s):
            tag = "ol" if re.match(r"^\d+\. ", s) else "ul"; items = []
            while i < len(L):
                t, ts = L[i], L[i].strip()
                m1 = re.match(r"^\d+\. (.*)", t) if tag == "ol" else re.match(r"^- (.*)", t)
                if m1:
                    items.append([_inline(m1.group(1)), [], None]); i += 1; continue
                m2 = re.match(r"^\s{2,}- (.*)", t)
                if m2 and items:
                    items[-1][1].append(_inline(m2.group(1))); i += 1; continue
                if ts.startswith("```") and t.startswith("   ") and items:
                    i += 1; code = []
                    while not L[i].strip().startswith("```"):
                        code.append(L[i][3:] if L[i].startswith("   ") else L[i]); i += 1
                    i += 1; items[-1][2] = _code(code); continue
                break
            out.append(f"<{tag}>" + "".join(
                f"<li>{a}" + (f"<ul>{''.join(f'<li>{x}</li>' for x in b)}</ul>" if b else "") + "</li>"
                for a, b, _ in items) + f"</{tag}>")
            out += [c for _, _, c in items if c]
            continue
        out.append(f"<p>{_inline(s)}</p>"); i += 1
    return ('<html><head><meta charset="utf-8"></head><body style="font-family:Arial;font-size:11pt">'
            + "\n".join(out) + "</body></html>")
