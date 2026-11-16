#!/usr/bin/env python3
"""Build a use-case deck from EkStep's Blue Dots template (ekstep/collateral/template.pptx).

  python3 ekstep/collateral/build_deck.py <spec.json>

The spec (see SKILL.md and example-spec.json) names the slides to keep, in order, and the content for each.
Text uses light markup: *text* takes the slide's highlight style (the coloured or bold run in that box),
^text^ takes the superscript style ("AI" in "Blue Dots^AI"). A newline is a line break inside the paragraph
(the template's own style); a blank line starts the next paragraph.
Every shape stays where the template put it; only text, images and chip layout change. Needs only lxml.
"""
import copy, json, os, re, shutil, sys, tempfile, zipfile
from lxml import etree

HERE = os.path.dirname(os.path.abspath(__file__))
NS = {"p": "http://schemas.openxmlformats.org/presentationml/2006/main",
      "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
      "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
      "pr": "http://schemas.openxmlformats.org/package/2006/relationships",
      "ct": "http://schemas.openxmlformats.org/package/2006/content-types"}
A = "{%s}" % NS["a"]
R_IMG = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/image"
EMU_IN = 914400

# Template slide numbers for each named slide
SLIDES = {"title": 1, "context": 2, "crisis": 4, "voice": 5, "map": 6, "people": 7,
          "surfaced": 9, "needs": 10, "use_cases": 13, "geographies": 14, "thanks": 15}
ON_WHITE = {"voice"}   # highlight text sits on white here
DEFAULT_ORDER = ["title", "crisis", "voice", "map", "people", "needs", "use_cases", "geographies", "thanks"]

# Map slide: everything drawn over the Ghaziabad screenshot (pins, badges, legend). Removed when the map changes.
MAP_OVERLAYS = [159, 163, 167, 168, 171, 175, 179, 183, 187, 191, 192, 195, 196, 199, 200, 203, 204, 205, 208, 209,
                212, 213, 216, 217, 221, 225, 228, 231, 234, 237, 240, 243, 246, 249, 263, 267, 270, 271, 274, 275,
                278, 279, 290, 300, 252, 253, 254, 255, 256, 257, 258]
# Needs slide chips: (background id, text id) in template order, per panel and group.
NEEDS = {
    "left": {"title": 386, "labels": [389, 399], "groups": [[(391, 392), (393, 394), (395, 396), (397, 398)],
             [(400, 401), (402, 403), (404, 405), (406, 407), (408, 409), (410, 411), (412, 413), (414, 415)]],
             "panel": 385, "stop_y": 416, "quotes": [(418, 419, 420), (421, 422, 423)], "stat": None},
    "right": {"title": 426, "labels": [429], "groups": [[(430, 431), (432, 433), (434, 435), (436, 437), (438, 439),
              (440, 441), (442, 443), (444, 445), (446, 447), (448, 449), (450, 451), (452, 453)]],
              "panel": 425, "stop_y": 454, "quotes": [(460, 461, 462), (463, 464, 465)], "stat": (456, 457)},
}


def die(msg):
    sys.exit("error: " + msg)


class Slide:
    def __init__(self, root, num):
        self.dir, self.num = root, num
        self.path = os.path.join(root, "ppt", "slides", f"slide{num}.xml")
        self.rels_path = os.path.join(root, "ppt", "slides", "_rels", f"slide{num}.xml.rels")
        self.tree = etree.parse(self.path)
        self.rels = etree.parse(self.rels_path)

    def shape(self, sid):
        for el in self.tree.iter("{%s}sp" % NS["p"], "{%s}pic" % NS["p"], "{%s}grpSp" % NS["p"], "{%s}cxnSp" % NS["p"]):
            nv = el.find("./*/p:cNvPr", NS)
            if nv is not None and nv.get("id") == str(sid):
                return el
        die(f"slide {self.num}: no shape with id {sid}")

    def save(self):
        self.tree.write(self.path, xml_declaration=True, encoding="UTF-8", standalone=True)
        self.rels.write(self.rels_path, xml_declaration=True, encoding="UTF-8", standalone=True)

    # ---- text
    def set_text(self, sid, value, colour=None):
        sp = self.shape(sid)
        body = sp.find(".//p:txBody", NS)
        paras = body.findall("a:p", NS)
        content = [p for p in paras if _has_text(p)] or paras[:1]
        blocks = str(value).split("\n\n")
        anchor = content[-1]
        for i, block in enumerate(blocks):
            tmpl = content[min(i, len(content) - 1)]
            new = _build_para(tmpl, block.split("\n"), colour)
            if i < len(content):
                content[i].addprevious(new)
            else:
                anchor.addnext(new)
            anchor = new
        for p in content:
            body.remove(p)

    def remove(self, *sids):
        for sid in sids:
            el = self.shape(sid)
            parent = el.getparent()
            parent.remove(el)
            _prune_empty_groups(parent)

    # ---- images
    def set_image(self, sid, src):
        if not os.path.exists(src):
            die(f"image not found: {src}")
        ext = os.path.splitext(src)[1].lower().replace("jpeg", "jpg")
        if ext not in (".png", ".jpg"):
            die(f"images must be .png or .jpg: {src}")
        name = f"collateral_s{self.num}_{sid}{ext}"
        shutil.copy(src, os.path.join(self.dir, "ppt", "media", name))
        rel_root = self.rels.getroot()
        rid = "rIdC%s" % sid
        rel = etree.SubElement(rel_root, "{%s}Relationship" % NS["pr"])
        rel.set("Id", rid); rel.set("Type", R_IMG); rel.set("Target", f"../media/{name}")
        blip = self.shape(sid).find(".//a:blip", NS)
        old = blip.get("{%s}embed" % NS["r"])
        blip.set("{%s}embed" % NS["r"], rid)
        if old and ('"%s"' % old) not in etree.tostring(self.tree).decode():
            for r in list(rel_root):
                if r.get("Id") == old:
                    rel_root.remove(r)
        # Show the whole new picture inside the old frame: drop the template's crop.
        src_rect = self.shape(sid).find(".//a:srcRect", NS)
        if src_rect is not None:
            src_rect.getparent().remove(src_rect)

    def geometry(self, sid):
        off = self.shape(sid).find(".//a:xfrm/a:off", NS)
        ext = self.shape(sid).find(".//a:xfrm/a:ext", NS)
        return int(off.get("x")), int(off.get("y")), int(ext.get("cx")), int(ext.get("cy"))

    def move(self, sid, x=None, y=None, cx=None):
        xfrm = self.shape(sid).find(".//a:xfrm", NS)
        off, ext = xfrm.find("a:off", NS), xfrm.find("a:ext", NS)
        if x is not None: off.set("x", str(int(x)))
        if y is not None: off.set("y", str(int(y)))
        if cx is not None: ext.set("cx", str(int(cx)))


def _prune_empty_groups(el):
    while el is not None and etree.QName(el).localname == "grpSp":
        kids = [c for c in el if etree.QName(c).localname in ("sp", "pic", "grpSp", "cxnSp", "graphicFrame")]
        if kids:
            return
        parent = el.getparent(); parent.remove(el); el = parent


def _run_styles(tpara):
    runs = [r for r in tpara.findall("a:r", NS) if (r.findtext("a:t", namespaces=NS) or "").strip()] or tpara.findall("a:r", NS)
    rprs = [r.find("a:rPr", NS) for r in runs]
    rprs = [x if x is not None else etree.Element(A + "rPr") for x in rprs]
    def bold(x): return x.get("b") == "1"
    def colour(x):
        c = x.find(".//a:srgbClr", NS); s = x.find(".//a:schemeClr", NS)
        return (c.get("val") if c is not None else "") + (s.get("val") if s is not None else "")
    sup = next((x for x in rprs if x.get("baseline") and int(x.get("baseline")) > 0), None)
    plain = [x for x in rprs if x is not sup]
    if not plain:
        plain = [etree.Element(A + "rPr")]
    if any(bold(x) for x in plain) and any(not bold(x) for x in plain):
        base = next(x for x in plain if not bold(x)); hi = next(x for x in plain if bold(x))
    else:
        base = plain[0]
        hi = next((x for x in plain if colour(x) != colour(base)), None)
        if hi is None:
            hi = copy.deepcopy(base); hi.set("b", "1")
    if sup is None:
        sup = copy.deepcopy(hi); sup.set("baseline", "30000")
    return base, hi, sup


def _recolour(rpr, colour):
    for f in rpr.findall("a:solidFill", NS):
        rpr.remove(f)
    fill = etree.Element(A + "solidFill"); clr = etree.SubElement(fill, A + "srgbClr"); clr.set("val", colour)
    # solidFill must come before latin/ea/cs/sym/hlinkClick in rPr
    idx = 0
    for i, c in enumerate(rpr):
        if etree.QName(c).localname in ("ln",):
            idx = i + 1
    rpr.insert(idx, fill)


def _has_text(p):
    return any((r.findtext("a:t", namespaces=NS) or "").strip() for r in p.findall("a:r", NS))


def _build_para(tpara, lines, colour):
    base, hi, sup = _run_styles(tpara)
    para = copy.deepcopy(tpara)
    kids = [c for c in para if etree.QName(c).localname in ("r", "br", "fld")]
    trailing = 0
    for c in reversed(kids):  # spacing breaks the template keeps after its text
        if etree.QName(c).localname == "br": trailing += 1
        else: break
    for c in kids:
        para.remove(c)
    end = para.find("a:endParaRPr", NS)
    def add(el):
        if end is not None: end.addprevious(el)
        else: para.append(el)
    def br():
        b = etree.Element(A + "br"); r = copy.deepcopy(base); r.tag = A + "rPr"; b.append(r); return b
    for li, line in enumerate(lines):
        if li: add(br())
        for kind, text in _segments(line):
            rpr = copy.deepcopy({"base": base, "hi": hi, "sup": sup}[kind]); rpr.tag = A + "rPr"
            if colour and kind in ("hi", "sup"):
                _recolour(rpr, colour)
            r = etree.Element(A + "r"); r.append(rpr)
            t = etree.SubElement(r, A + "t"); t.text = text
            if text != text.strip():
                t.set("{http://www.w3.org/XML/1998/namespace}space", "preserve")
            add(r)
    for _ in range(trailing):
        add(br())
    return para


def _segments(line):
    out = []
    for m in re.finditer(r"\*([^*]+)\*|\^([^^]+)\^|([^*^]+)", line):
        if m.group(1): out.append(("hi", m.group(1)))
        elif m.group(2): out.append(("sup", m.group(2)))
        else: out.append(("base", m.group(3)))
    return out or [("base", "")]


# ------------------------------------------------------------------ slides

def fill_title(s, d, colour):
    s.set_text(58, d["title"], colour)
    s.set_text(59, d["subtitle"])


def fill_crisis(s, d, colour):
    s.set_text(116, d["headline"], colour)
    rows = d["rows"]
    slots = [121, 141, 122, 123, 124, 137]
    if len(rows) != 6:
        die("crisis.rows needs exactly 6 lines (row 1 has two lines; rows 2 to 5 one each)")
    for sid, text in zip(slots, rows):
        s.set_text(sid, text)
    s.set_text(119, d["result"])


def fill_voice(s, d, colour):
    # White background: a pale Dots colour vanishes here, so use the darker "ink" colour.
    s.set_text(150, d["text"], colour)


def fill_map(s, d, colour):
    s.set_text(304, d["headline"], colour)
    s.set_image(157, d["image"])
    s.remove(*MAP_OVERLAYS)
    s.set_text(158, d["side"])
    s.set_text(261, d["place"])
    for key, title_id, lines_id, img_id in (("seeker", 283, 284, 297), ("provider", 294, 295, 298)):
        card = d[key]
        s.set_text(title_id, card["title"])
        s.set_text(lines_id, "\n".join(card["lines"]))
        if card.get("image") == "remove":
            s.remove(img_id)  # no fitting photo: better none than a wrong one
        elif card.get("image"):
            s.set_image(img_id, card["image"])


def fill_people(s, d, colour):
    s.set_text(313, d["headline"], colour)
    # Pictures and captions are separate shapes; pair them by position, left to right.
    pics = sorted((314, 315), key=lambda i: s.geometry(i)[0])
    caps = sorted((316, 317), key=lambda i: s.geometry(i)[0])
    for img, cap, side in zip(pics, caps, ("left", "right")):
        s.set_image(img, d[side]["image"])
        s.set_text(cap, d[side]["caption"])
    s.set_text(318, d["tagline"])
    s.set_text(319, d["sub"])


def _chip_width(text):
    # Calibrated on the template's own chips (8 pt): about 0.20 in plus 0.070 in per character (Keynote renders a touch wider).
    return int((0.20 + 0.070 * len(text)) * EMU_IN)


def fill_needs(s, d, colour):
    s.set_text(467, d["headline"], colour)
    for side, spec in NEEDS.items():
        panel = d[side]
        s.set_text(spec["title"], panel["title"])
        px, _, pcx, _ = s.geometry(spec["panel"])
        right_edge = px + pcx - int(0.15 * EMU_IN)
        stop_y = s.geometry(spec["stop_y"])[1]
        groups = panel["groups"]
        if len(groups) > len(spec["labels"]):
            die(f"needs.{side} has room for {len(spec['labels'])} group(s)")
        bg0x, bg0y, _, bg_cy = s.geometry(spec["groups"][0][0][0])
        tx_dx = s.geometry(spec["groups"][0][0][1])[0] - bg0x
        tx_dy = s.geometry(spec["groups"][0][0][1])[1] - bg0y
        row_step = int(0.25 * EMU_IN)
        label_to_chips = bg0y - s.geometry(spec["labels"][0])[1]   # 0.17 in on the template
        label_dx = s.geometry(spec["labels"][0])[0]
        y = s.geometry(spec["labels"][0])[1]
        slots = [pair for g in spec["groups"] for pair in g]
        used = 0
        for gi, label_id in enumerate(spec["labels"]):
            if gi >= len(groups):
                s.remove(label_id); continue
            g = groups[gi]
            s.move(label_id, x=label_dx, y=y); s.set_text(label_id, g["label"])
            y += label_to_chips
            x = bg0x
            for chip in g["chips"]:
                if used >= len(slots):
                    print(f"warning: needs.{side}: only {len(slots)} chips fit; dropped '{chip}'"); continue
                bg_id, tx_id = slots[used]; used += 1
                w = _chip_width(chip)
                if x + w > right_edge and x > bg0x:
                    x = bg0x; y += row_step
                s.move(bg_id, x=x, y=y, cx=w)
                s.move(tx_id, x=x + tx_dx, y=y + tx_dy, cx=w - int(0.17 * EMU_IN))
                s.set_text(tx_id, chip)
                x += w + int(0.08 * EMU_IN)
            y += int(0.31 * EMU_IN)   # last chip row to the next label, as on the template
        if y - int(0.06 * EMU_IN) > stop_y:
            print(f"warning: needs.{side}: chips run past the divider; use fewer or shorter chips")
        for bg_id, tx_id in slots[used:]:
            s.remove(bg_id, tx_id)
        quotes = panel.get("quotes", [])
        for qi, (bar, q, by) in enumerate(spec["quotes"]):
            if qi < len(quotes):
                s.set_text(q, quotes[qi]["text"]); s.set_text(by, quotes[qi]["by"])
            else:
                s.remove(bar, q, by)
        if spec["stat"]:
            if panel.get("stat"):
                s.set_text(spec["stat"][0], panel["stat"]["value"]); s.set_text(spec["stat"][1], panel["stat"]["label"])
            else:
                s.remove(*spec["stat"])


def fill_surfaced(s, d, colour):
    s.set_text(335, d["headline"], colour)
    for sid, text in d.get("text", {}).items():
        s.set_text(int(sid), text)
    if d.get("remove"):
        s.remove(*d["remove"])


FILL = {"title": fill_title, "crisis": fill_crisis, "voice": fill_voice, "map": fill_map, "people": fill_people,
        "needs": fill_needs, "surfaced": fill_surfaced}


def set_notes(root, num, text):
    rels = etree.parse(os.path.join(root, "ppt", "slides", "_rels", f"slide{num}.xml.rels"))
    target = next((r.get("Target") for r in rels.getroot() if r.get("Type").endswith("/notesSlide")), None)
    if not target:
        return
    path = os.path.normpath(os.path.join(root, "ppt", "slides", target))
    t = etree.parse(path)
    for sp in t.iter("{%s}sp" % NS["p"]):
        ph = sp.find(".//p:nvPr/p:ph", NS)
        if ph is not None and ph.get("type") == "body":
            body = sp.find(".//p:txBody", NS)
            for p in body.findall("a:p", NS):
                body.remove(p)
            for line in (text or "").split("\n"):
                p = etree.SubElement(body, A + "p"); r = etree.SubElement(p, A + "r")
                etree.SubElement(r, A + "rPr").set("lang", "en-GB")
                etree.SubElement(r, A + "t").text = line
    t.write(path, xml_declaration=True, encoding="UTF-8", standalone=True)


# ------------------------------------------------------------------ package

def keep_slides(root, nums_in_order):
    pres_path = os.path.join(root, "ppt", "presentation.xml")
    rels_path = os.path.join(root, "ppt", "_rels", "presentation.xml.rels")
    ct_path = os.path.join(root, "[Content_Types].xml")
    pres, rels, ct = etree.parse(pres_path), etree.parse(rels_path), etree.parse(ct_path)
    rid_to_num = {r.get("Id"): int(re.search(r"slide(\d+)\.xml", r.get("Target")).group(1))
                  for r in rels.getroot() if r.get("Type").endswith("/slide")}
    lst = pres.find(".//p:sldIdLst", NS)
    by_num = {rid_to_num[e.get("{%s}id" % NS["r"])]: e for e in lst}
    for e in list(lst):
        lst.remove(e)
    for n in nums_in_order:
        lst.append(by_num[n])
    drop = [n for n in rid_to_num.values() if n not in nums_in_order]
    for r in list(rels.getroot()):
        if r.get("Type").endswith("/slide") and rid_to_num[r.get("Id")] in drop:
            rels.getroot().remove(r)
    for n in drop:
        srels = os.path.join(root, "ppt", "slides", "_rels", f"slide{n}.xml.rels")
        notes = [x.get("Target") for x in etree.parse(srels).getroot() if x.get("Type").endswith("/notesSlide")]
        for t in notes:
            npath = os.path.normpath(os.path.join(root, "ppt", "slides", t))
            nrels = os.path.join(os.path.dirname(npath), "_rels", os.path.basename(npath) + ".rels")
            for f in (npath, nrels):
                if os.path.exists(f): os.remove(f)
            _drop_override(ct, "/ppt/notesSlides/" + os.path.basename(npath))
        os.remove(os.path.join(root, "ppt", "slides", f"slide{n}.xml")); os.remove(srels)
        _drop_override(ct, f"/ppt/slides/slide{n}.xml")
    pres.write(pres_path, xml_declaration=True, encoding="UTF-8", standalone=True)
    rels.write(rels_path, xml_declaration=True, encoding="UTF-8", standalone=True)
    ct.write(ct_path, xml_declaration=True, encoding="UTF-8", standalone=True)
    _drop_unused_media(root)


def _drop_override(ct, part):
    for o in list(ct.getroot()):
        if o.get("PartName") == part:
            ct.getroot().remove(o)


def _drop_unused_media(root):
    used = set()
    for dp, _, files in os.walk(root):
        for f in files:
            if f.endswith(".rels"):
                for r in etree.parse(os.path.join(dp, f)).getroot():
                    t = r.get("Target") or ""
                    if "media/" in t:
                        used.add(os.path.basename(t))
    media = os.path.join(root, "ppt", "media")
    for f in os.listdir(media):
        if f not in used:
            os.remove(os.path.join(media, f))


def main():
    if len(sys.argv) != 2:
        print(__doc__); sys.exit(2)
    spec_path = os.path.abspath(sys.argv[1]); base = os.path.dirname(spec_path)
    spec = json.load(open(spec_path, encoding="utf-8"))
    order = spec.get("slides", DEFAULT_ORDER)
    for k in order:
        if k not in SLIDES: die(f"unknown slide '{k}'; choose from {list(SLIDES)}")
    def resolve(v):
        if isinstance(v, dict): return {k: resolve(x) for k, x in v.items()}
        if isinstance(v, list): return [resolve(x) for x in v]
        if isinstance(v, str) and v.startswith("file:"): return os.path.normpath(os.path.join(base, v[5:]))
        return v
    spec = resolve(spec)
    template = spec.get("template") or os.path.join(HERE, "template.pptx")
    out = spec["out"]
    work = tempfile.mkdtemp(prefix="deck-")
    try:
        zipfile.ZipFile(template).extractall(work)
        colour = spec.get("colour")
        for key in order:
            num = SLIDES[key]
            if key in FILL:
                if key not in spec: die(f"spec has no '{key}' section")
                # Slides on a white background take "ink" (a darker shade) when the Dots colour is pale.
                c = spec.get("ink", colour) if key in ON_WHITE else colour
                s = Slide(work, num); FILL[key](s, spec[key], c); s.save()
            set_notes(work, num, spec.get("notes", {}).get(key, ""))
        keep_slides(work, [SLIDES[k] for k in order])
        os.makedirs(os.path.dirname(out), exist_ok=True)
        if os.path.exists(out): os.remove(out)
        with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
            ct = "[Content_Types].xml"
            z.write(os.path.join(work, ct), ct)  # content types first
            for dp, _, files in os.walk(work):
                for f in files:
                    full = os.path.join(dp, f); arc = os.path.relpath(full, work)
                    if arc != ct: z.write(full, arc)
        print(f"wrote {out} ({len(order)} slides, {os.path.getsize(out)//1024} KB)")
    finally:
        shutil.rmtree(work, ignore_errors=True)


if __name__ == "__main__":
    main()
