"""Turn a dots data file into fictional sample data.

For every row: rename (if in the map), drop address, drop contact unless it is a
national helpline, drop `verified`, drop `// source:` and `// CHECK coords` comments.
Rows that were real organisations get a neutral templated description.

Usage: python3 scripts/make_dummy_dots.py <in.ts> <out.ts> <renames.json>
renames.json: {"<id>": {"name": "...", "description": "..."(optional), "contact": "..."(optional)}}
"""
import json, re, sys

HELPLINES = {"108", "112", "181", "1098", "1033", "1077", "1066"}

src, out, ren_path = sys.argv[1], sys.argv[2], sys.argv[3]
ren = json.load(open(ren_path))
s = open(src).read()

# Mark which rows were real (preceded by a // source: line) before stripping comments.
real_ids = set(re.findall(r'// source:[^\n]*\n\s*\{\s*id:\s*(\d+)', s))

s = re.sub(r'\n[ \t]*// source:[^\n]*', '', s)
s = re.sub(r'[ \t]*// CHECK coords', '', s)
s = re.sub(r'[ \t]*// ~?\d+ ?m off [^\n]*', '', s)


def fix_row(m):
    b = m.group(0)
    rid = re.search(r'id:\s*(\d+)', b).group(1)
    r = ren.get(rid, {})
    b = re.sub(r'\n[ \t]*address:\s*"[^"]*",', '', b)
    b = re.sub(r',?\s*address:\s*"[^"]*"', '', b)
    b = re.sub(r'\n[ \t]*verified:\s*"[^"]*",', '', b)
    c = re.search(r'contact:\s*"([^"]*)"', b)
    keep = r.get("contact") or (c.group(1) if c and c.group(1).replace(" ", "") in HELPLINES else None)
    b = re.sub(r'\n[ \t]*contact:\s*"[^"]*",', '', b)
    if keep:
        b = re.sub(r'(\n([ \t]*)description:)', lambda mm: f'\n{mm.group(2)}contact: "{keep}",{mm.group(1)}', b, count=1)
    if "name" in r:
        b = re.sub(r'name:\s*"[^"]*"', 'name: ' + json.dumps(r["name"], ensure_ascii=False), b, count=1)
    if "area" in r:
        b = re.sub(r'area:\s*"[^"]*"', 'area: ' + json.dumps(r["area"], ensure_ascii=False), b, count=1)
    desc = r.get("description")
    if desc is None and rid in real_ids:
        ot = re.search(r'org_type:\s*"([^"]*)"', b)
        ar = re.search(r'area:\s*"([^"]*)"', b)
        desc = f"{ot.group(1) if ot else 'Service'} serving {ar.group(1) if ar else 'the area'}."
    if desc is not None:
        b = re.sub(r'description:\s*"(?:[^"\\]|\\.)*"', 'description: ' + json.dumps(desc, ensure_ascii=False), b, count=1)
    return b


s = re.sub(r'\{\s*\n?\s*id:\s*\d+,.*?\n\s*\},', fix_row, s, flags=re.S)
s = re.sub(r'(?m)^// (Real organisations|Rows with verified|Coordinates are|Rows marked|Private hostels|"listed, not checked"|No hospital is labelled|Police rows use)[^\n]*\n(//[^\n]*\n)*', '', s)
s = "// All rows are fictional sample data for this prototype. Names, people and requests are made up;\n// only national helplines (108, 112, 181, 1098, 1033, 1077) are real numbers.\n" + s
open(out, "w").write(s)
print(f"{src}: {len(real_ids)} real rows rewritten, {len(ren)} renames")
