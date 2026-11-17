#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.12"
# dependencies = ["fonttools==4.66.1", "brotli==1.2.0"]
# ///
"""Subset the site's web fonts. Run by hand; commit what it writes.

    uv run scripts/fonts/subset.py           # regenerate everything
    uv run scripts/fonts/subset.py --check   # regenerate in memory, fail if the
                                             # committed files differ

This is not part of the build. `next build` only reads the committed output:

    src/fonts/*.woff2            Geist Sans + the two Geist Pixel faces in use
    src/fonts/geist-sans.ts      next/font declarations (generated)
    src/fonts/geist-pixel.ts     next/font declarations (generated)
    public/fonts/Hand-*.woff2    the handwriting face (.font-reenie)
    src/styles/globals.css       only the block between the fonts:hand markers

Each font is cut to the characters, weight range and OpenType features the
site uses, loses its hinting, and is split in two: a core file (ASCII, everyday
punctuation and every character the site's own content draws) and an extended
file (the rest of Latin-1 and Latin Extended-A) that sits behind `unicode-range`
and is only downloaded by a page that draws one of its characters.

RERUN WHEN
  * Site content starts using a character that is in a source font but in
    neither output file (Cyrillic, Vietnamese, Greek, maths, arrows beyond the
    ones listed below, superscripts...). Until then that character is drawn by
    the system fallback font. Add it to the family's `content` list.
  * A character from the extended file starts appearing next to ordinary
    letters in the site's own content. It renders correctly from the extended
    file, but kerning across the two files is lost; move it into `content`.
  * CSS or a component asks Geist Sans for a weight below 400 (400-900 is
    kept), sets `font-variation-settings`, or turns on an OpenType feature that
    is not in `features` (font-feature-settings, font-variant-*: fractions,
    ordinals, stylistic sets, superscripts...).
  * A page other than /privacy starts using .font-pixel-line / .font-pixel-dot
    (no rerun needed, but that page must import src/fonts/geist-pixel.ts; see
    the note in globals.css).
  * `hyphens: auto` is introduced. None of these fonts has U+2010, so that
    would not need a new character, but re-check it against a font upgrade.
  * The `geist` package is upgraded (the pinned hashes below will fail), or the
    handwriting source in scripts/fonts/sources changes.
  * The core/extended split in this file changes.

After a rerun that changes any .woff2, pixel-diff the site before and after:
three fontTools defaults were found to change rendering here and are pinned off
below (glyph names dropped, font bounding box recalculated, upper weight bound
cut). Hinting is dropped, which only Windows rasterisers can notice.

Output is deterministic for the pinned fontTools and brotli versions: the same
sources and config give byte-identical files. The Geist sources are read from
node_modules, so the `geist` dependency must stay installed even though no
application code imports it any more.
"""

from __future__ import annotations

import argparse
import hashlib
import io
import re
import sys
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ROOT = Path(__file__).resolve().parents[2]

# --------------------------------------------------------------------------
# Config
# --------------------------------------------------------------------------

ASCII = "".join(chr(c) for c in range(0x20, 0x7F))
# Punctuation most pages use: NBSP, curly quotes, en/em dash, ellipsis, and the
# U+2010 hyphen `hyphens: auto` would draw (absent from every source font today;
# listed so a font upgrade that adds it keeps it in core).
PUNCTUATION = "".join(
    chr(c) for c in (0x00A0, 0x2018, 0x2019, 0x201C, 0x201D, 0x2013, 0x2014, 0x2026, 0x2010)
)
LATIN_1 = range(0x00A0, 0x0100)
LATIN_EXT_A = range(0x0100, 0x0180)

# OpenType features browsers apply without being asked, where the font has them.
DEFAULT_FEATURES = ["ccmp", "locl", "liga", "kern", "mark", "mkmk"]

GEIST_PIXEL_FALLBACK = [
    "Geist Mono",
    "ui-monospace",
    "SFMono-Regular",
    "Roboto Mono",
    "Menlo",
    "Monaco",
    "Liberation Mono",
    "DejaVu Sans Mono",
    "Courier New",
    "monospace",
]

FAMILIES = [
    {
        "name": "GeistSans",
        "source": "node_modules/geist/dist/fonts/geist-sans/Geist-Variable.woff2",
        "sha256": "e24cec106619c03f0b3519e31b9bc55e0d5e926b6a95b8d798cd8cef215b1505",
        "out_dir": "src/fonts",
        "out_stem": "GeistSans",
        # Characters the site's own content draws with this face (found by a
        # browser pass over every route plus a scan of src/). Upper/lower-case
        # partners are added automatically, because `uppercase` is used.
        # Written as code points: several are invisible or look like ASCII.
        "content": [
            0x00A9,  # copyright
            0x00B7,  # middle dot
            0x00BA,  # masculine ordinal ("nº")
            0x00E9,  # e acute ("cliché", "risqué", "Ambré")
            0x0101,  # a macron ("Tāmaki", uppercased on /lab/broadsheet)
            # Cyrillic ie: six lyric lines were pasted with it in place of a
            # Latin e. It sits inside Latin words, so it must kern with them.
            0x0435,
            # Single guillemets. Only the right one is used; fontTools keeps
            # the left one with it as its mirror pair, so it is listed.
            0x2039, 0x203A,
            0x2190, 0x2191, 0x2192, 0x2193, 0x2197,  # arrows
            0x2117,  # sound recording copyright
            0x2153,  # one third
            0x25CB, 0x25CF,  # hollow and filled circle
        ],
        # Weights requested anywhere: 400, 500, 600, 700 (font-normal/medium/
        # semibold/bold and the browser's bold). Nothing sets wght directly.
        # The upper bound stays at the source's 900 on purpose: cutting at 700
        # makes fontTools rescale and re-round every delta, which moves bold
        # outlines by up to 0.85/1000 em for a 0.5 KB saving. Dropping only the
        # 100-400 half leaves 400-900 exactly as in the source.
        "axes": {"wght": (400, 900)},
        # tnum: `tabular-nums` is used across the ledger and forum.
        "features": DEFAULT_FEATURES + ["tnum"],
        "core_features": ["ccmp", "kern", "liga", "locl", "tnum"],
        "rename": None,  # OFL without a Reserved Font Name
    },
    {
        "name": "GeistPixelLine",
        "source": "node_modules/geist/dist/fonts/geist-pixel/GeistPixel-Line.woff2",
        "sha256": "3a22f02388d8b30780ec260eb064e9701f75a1f9bac7f9e79d5efdf96f8d4259",
        "out_dir": "src/fonts",
        "out_stem": "GeistPixelLine",
        "content": [],  # draws "privacy." only
        "axes": None,
        "features": DEFAULT_FEATURES,
        "core_features": ["ccmp", "kern", "liga", "locl"],
        "rename": None,
    },
    {
        "name": "GeistPixelCircle",
        "source": "node_modules/geist/dist/fonts/geist-pixel/GeistPixel-Circle.woff2",
        "sha256": "37ab6a97e397e1725dd80d075ea2a4067a57aa225f0c44788668e6e17b4caaa9",
        "out_dir": "src/fonts",
        "out_stem": "GeistPixelCircle",
        "content": [0x2199],  # south-west arrow on the privacy page's back link
        "axes": None,
        "features": DEFAULT_FEATURES,
        "core_features": ["ccmp", "kern", "liga", "locl"],
        "rename": None,
    },
    {
        "name": "ReenieBeanie",
        "source": "scripts/fonts/sources/ReenieBeanie-Regular.ttf",
        "sha256": "f3b0fc248a510101281bfc2f81815b9758ff9bcc7400c42827791a8d36d14698",
        "out_dir": "public/fonts",
        "out_stem": "Hand",
        "content": [],
        "axes": None,
        "features": DEFAULT_FEATURES,
        "core_features": [],  # the source has no GSUB or GPOS at all
        # OFL with "Reserved Font Name Reenie Beanie": a subset is a Modified
        # Version and may not carry that name internally. The CSS family name
        # (.font-reenie -> "ReenieBeanie") is ours and stays.
        "rename": {"family": "Ledger Hand", "reserved": ["Reenie", "Beanie"]},
    },
]

FONT_BBOX = ("xMin", "yMin", "xMax", "yMax")
HINTING_TABLES = ("fpgm", "prep", "cvt ", "cvar", "hdmx", "VDMX", "LTSH")
# Next derives the fallback face's size-adjust from the average advance of this
# string (next/font/local get-fallback-metrics-from-font-file).
NEXT_AVG_STRING = "aaabcdeeeefghiijklmnnoopqrrssttuvwxyz      "


class Failure(Exception):
    pass


# --------------------------------------------------------------------------
# Subsetting
# --------------------------------------------------------------------------


def with_case_partners(chars: str) -> set[int]:
    out: set[int] = set()
    for ch in chars:
        out.add(ord(ch))
        for other in (ch.upper(), ch.lower()):
            if len(other) == 1:
                out.add(ord(other))
    return out


def load_source(family: dict) -> TTFont:
    path = ROOT / family["source"]
    data = path.read_bytes()
    digest = hashlib.sha256(data).hexdigest()
    if digest != family["sha256"]:
        raise Failure(
            f"{family['source']} has changed (sha256 {digest}). Re-measure the new "
            "font, update the config and the pinned hash, and pixel-diff the result."
        )
    font = TTFont(io.BytesIO(data), recalcTimestamp=False)
    if family["axes"]:
        instancer.instantiateVariableFont(font, family["axes"], inplace=True)
    return font


def reload(font: TTFont) -> TTFont:
    """Round-trip through bytes. Each subset needs its own copy, and subsetting
    the instancer's in-memory result directly fails in gvar (KeyError: .notdef)."""
    buf = io.BytesIO()
    flavor, font.flavor = font.flavor, None
    font.save(buf)
    font.flavor = flavor
    return TTFont(io.BytesIO(buf.getvalue()), recalcTimestamp=False)


def rename(font: TTFont, family_name: str, part: str) -> None:
    ps = family_name.replace(" ", "") + "-" + part
    values = {
        1: f"{family_name} {part}",
        3: f"subset;{ps}",
        4: f"{family_name} {part}",
        6: ps,
        16: family_name,
        17: part,
        21: family_name,
        25: family_name.replace(" ", ""),
    }
    present = {n.nameID for n in font["name"].names}
    for name_id, value in values.items():
        if name_id in present or name_id in (1, 3, 4, 6):
            for record in list(font["name"].names):
                if record.nameID == name_id:
                    record.string = value
            if name_id not in present:
                font["name"].setName(value, name_id, 3, 1, 0x409)


def make_subset(base: TTFont, family: dict, unicodes: set[int], part: str) -> bytes:
    font = reload(base)
    options = subset.Options()
    options.layout_features = list(family["features"])
    options.layout_scripts = ["*"]
    options.hinting = False
    options.desubroutinize = True
    # Keep glyph names (post format 2). Dropping them is the usual advice and
    # saves about 0.5 KB a file, but Chrome on macOS then rasterises every glyph
    # differently at 1x device pixel ratio (measured: same outlines, different
    # edge anti-aliasing; identical at 2x). verify() pins this.
    options.glyph_names = True
    options.notdef_outline = True
    options.name_IDs = [0, 1, 2, 3, 4, 5, 6, 13, 14, 16, 17, 21, 25]
    options.name_languages = [0x409]
    options.recalc_timestamp = False
    options.prune_unicode_ranges = True
    options.drop_tables += ["meta"]
    subsetter = subset.Subsetter(options)
    subsetter.populate(unicodes=sorted(unicodes))
    subsetter.subset(font)
    if family["rename"]:
        rename(font, family["rename"]["family"], part.capitalize())
    # Keep the source's font-wide bounding box. fontTools would shrink it to the
    # surviving glyphs, and Chrome on macOS then anti-aliases a few glyph edges
    # differently at 1x (measured). verify() pins this too.
    font.recalcBBoxes = False
    for field in FONT_BBOX:
        setattr(font["head"], field, getattr(base["head"], field))
    font.flavor = "woff2"
    out = io.BytesIO()
    font.save(out)
    return out.getvalue()


# --------------------------------------------------------------------------
# Read-back checks
# --------------------------------------------------------------------------


def features_of(font: TTFont) -> set[str]:
    tags: set[str] = set()
    for table in ("GSUB", "GPOS"):
        if table in font and font[table].table.FeatureList:
            tags |= {r.FeatureTag for r in font[table].table.FeatureList.FeatureRecord}
    return tags


def feature_variations(font: TTFont) -> int:
    total = 0
    for table in ("GSUB", "GPOS"):
        if table in font:
            fv = getattr(font[table].table, "FeatureVariations", None)
            total += len(fv.FeatureVariationRecord) if fv else 0
    return total


def axes_of(font: TTFont) -> dict[str, tuple[float, float, float]]:
    if "fvar" not in font:
        return {}
    return {a.axisTag: (a.minValue, a.defaultValue, a.maxValue) for a in font["fvar"].axes}


def instructed_glyphs(font: TTFont) -> int:
    count = 0
    if "glyf" in font:
        for name in font.getGlyphOrder():
            glyph = font["glyf"][name]
            if getattr(glyph, "program", None) is not None and glyph.program.getBytecode():
                count += 1
    return count


def avg_advance(font: TTFont) -> float:
    cmap = font.getBestCmap()
    hmtx = font["hmtx"]
    return sum(hmtx[cmap[ord(c)]][0] for c in NEXT_AVG_STRING) / len(NEXT_AVG_STRING)


def vertical_metrics(font: TTFont) -> tuple:
    hhea, os2, head = font["hhea"], font["OS/2"], font["head"]
    return (
        head.unitsPerEm, hhea.ascent, hhea.descent, hhea.lineGap,
        os2.sTypoAscender, os2.sTypoDescender, os2.sTypoLineGap,
        os2.usWinAscent, os2.usWinDescent, os2.fsSelection & 0x80,
    )  # fmt: skip


def unicode_range(codepoints: set[int]) -> str:
    cps = sorted(codepoints)
    parts, i = [], 0
    while i < len(cps):
        j = i
        while j + 1 < len(cps) and cps[j + 1] == cps[j] + 1:
            j += 1
        parts.append(f"U+{cps[i]:X}" if i == j else f"U+{cps[i]:X}-{cps[j]:X}")
        i = j + 1
    return ",".join(parts)


def verify(family: dict, part: str, data: bytes, expected: set[int], source: TTFont) -> dict:
    """Re-read a generated file and fail loudly if it is not what was asked for."""
    font = TTFont(io.BytesIO(data))
    label = f"{family['out_stem']}-{part}"
    problems: list[str] = []
    cmap = set(font.getBestCmap())
    if cmap != expected:
        problems.append(
            f"cmap differs: missing {unicode_range(expected - cmap) or '-'}, "
            f"unexpected {unicode_range(cmap - expected) or '-'}"
        )
    if font.flavor != "woff2":
        problems.append(f"flavor is {font.flavor}")
    if [getattr(font["head"], f) for f in FONT_BBOX] != [getattr(source["head"], f) for f in FONT_BBOX]:
        problems.append("font bounding box differs from the source")
    if font["post"].formatType != source["post"].formatType:
        problems.append(f"post table format changed to {font['post'].formatType} (glyph names lost)")
    # Limited axes keep the source default, so the default instance (and with
    # it every check below against the untouched source) is unchanged.
    want_axes = {
        tag: (float(lo), axes_of(source)[tag][1], float(hi))
        for tag, (lo, hi) in (family["axes"] or {}).items()
    }
    if axes_of(font) != want_axes:
        problems.append(f"axes are {axes_of(font)}, wanted {want_axes}")
    got = features_of(font)
    wanted = set(family["features"])
    if got - wanted:
        problems.append(f"unwanted features kept: {sorted(got - wanted)}")
    # A feature legitimately vanishes from a file when none of its glyphs survive
    # (mark/mkmk go with the combining marks), so the core file's surviving set
    # is pinned per family in `core_features` and any drift fails here.
    if part == "core" and got != set(family["core_features"]):
        problems.append(f"core features are {sorted(got)}, expected {sorted(family['core_features'])}")
    if feature_variations(font) != feature_variations(source):
        problems.append("feature variations (rvrn) changed")
    hint_tables = [t for t in HINTING_TABLES if t in font]
    if hint_tables or instructed_glyphs(font):
        problems.append(f"hinting left: tables {hint_tables}, {instructed_glyphs(font)} instructed glyphs")
    if vertical_metrics(font) != vertical_metrics(source):
        problems.append(f"vertical metrics changed: {vertical_metrics(source)} -> {vertical_metrics(font)}")
    if part == "core" and avg_advance(font) != avg_advance(source):
        problems.append("average advance changed: the generated fallback face's size-adjust would move")
    # Every kept glyph must have the advance and (default-instance) outline of the source.
    src_cmap, new_cmap = source.getBestCmap(), font.getBestCmap()
    src_glyf, new_glyf = source["glyf"], font["glyf"]
    for cp in sorted(cmap):
        a, b = src_cmap[cp], new_cmap[cp]
        if source["hmtx"][a] != font["hmtx"][b]:
            problems.append(f"U+{cp:04X} advance/lsb changed")
        if src_glyf[a].numberOfContours > 0 and src_glyf[a].getCoordinates(src_glyf)[0] != new_glyf[b].getCoordinates(new_glyf)[0]:
            problems.append(f"U+{cp:04X} outline changed")
    if family["rename"]:
        for record in font["name"].names:
            if record.nameID in (1, 3, 4, 6, 16, 17, 21, 25):
                text = record.toUnicode()
                if any(word.lower() in text.lower() for word in family["rename"]["reserved"]):
                    problems.append(f"name ID {record.nameID} still carries the reserved name: {text!r}")
    licence = " ".join(r.toUnicode() for r in font["name"].names if r.nameID in (0, 13))
    if not licence.strip():
        problems.append("copyright/licence name records were dropped")
    if problems:
        raise Failure(f"{label}: " + "; ".join(problems))
    return {
        "label": label,
        "bytes": len(data),
        "glyphs": font["maxp"].numGlyphs,
        "chars": len(cmap),
        "axes": axes_of(font),
        "features": sorted(got),
        "range": unicode_range(cmap),
        "family_name": font["name"].getDebugName(1),
        "gasp": sorted(font["gasp"].gaspRange.items()) if "gasp" in font else None,
    }


# --------------------------------------------------------------------------
# Generated declarations
# --------------------------------------------------------------------------

TS_HEADER = """\
// GENERATED by scripts/fonts/subset.py. Do not edit by hand: change the config
// in that script and rerun it (see its header for when a rerun is needed).
//
// Each face is split in two. The core file (ASCII, everyday punctuation and the
// characters the site's own content uses) is the only one preloaded. The
// extended file (the rest of Latin-1 and Latin Extended-A) sits behind
// `unicode-range` and is fetched only by a page that draws one of its
// characters. In CSS the extended variable must come FIRST in the stack, e.g.
//   var(--font-geist-sans-ext), var(--font-geist-sans)
// The core variable ends with the metric-matched fallback face Next generates;
// an extended face listed after it would never get to draw anything.
import localFont from "next/font/local";
"""


def ts_string_list(items: list[str], indent: str) -> str:
    return "\n".join(f'{indent}"{item}",' for item in items)


def ts_value(value: str) -> str:
    """A `value:` property laid out the way Prettier would."""
    one_line = f'      value: "{value}",'
    return one_line if len(one_line) <= 80 else f'      value:\n        "{value}",'


def geist_sans_ts(ranges: dict[str, str]) -> str:
    return f"""{TS_HEADER}
export const GeistSans = localFont({{
  src: "./GeistSans-core.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
  declarations: [
    {{
      prop: "unicode-range",
{ts_value(ranges['GeistSans-core'])}
    }},
  ],
}});

export const GeistSansExt = localFont({{
  src: "./GeistSans-ext.woff2",
  variable: "--font-geist-sans-ext",
  weight: "100 900",
  preload: false,
  adjustFontFallback: false,
  declarations: [
    {{
      prop: "unicode-range",
{ts_value(ranges['GeistSans-ext'])}
    }},
  ],
}});
"""


def geist_pixel_ts(ranges: dict[str, str]) -> str:
    blocks = []
    for face, var in (("Line", "line"), ("Circle", "circle")):
        blocks.append(f"""
export const GeistPixel{face} = localFont({{
  src: "./GeistPixel{face}-core.woff2",
  variable: "--font-geist-pixel-{var}",
  weight: "500",
  fallback: [
{ts_string_list(GEIST_PIXEL_FALLBACK, "    ")}
  ],
  adjustFontFallback: false,
  declarations: [
    {{
      prop: "unicode-range",
{ts_value(ranges[f'GeistPixel{face}-core'])}
    }},
  ],
}});

export const GeistPixel{face}Ext = localFont({{
  src: "./GeistPixel{face}-ext.woff2",
  variable: "--font-geist-pixel-{var}-ext",
  weight: "500",
  preload: false,
  adjustFontFallback: false,
  declarations: [
    {{
      prop: "unicode-range",
{ts_value(ranges[f'GeistPixel{face}-ext'])}
    }},
  ],
}});
""")
    note = (
        "\n// Only the privacy page draws these faces, so only it imports this module:\n"
        "// next/font preloads a face on the routes whose page or layout imports it.\n"
    )
    return TS_HEADER + note + "".join(blocks)


HAND_START = "/* fonts:hand:start (generated by scripts/fonts/subset.py; do not edit) */"
HAND_END = "/* fonts:hand:end */"


def css_unicode_range(value: str) -> str:
    """Lay the descriptor out the way Prettier would, so formatting is stable."""
    items = value.split(",")
    one_line = "    unicode-range: " + ", ".join(items) + ";"
    if len(one_line) <= 80:
        return one_line
    lines, current = [], "     "
    for i, item in enumerate(items):
        piece = " " + item + ("," if i < len(items) - 1 else ";")
        if len(current) + len(piece) > 80:
            lines.append(current)
            current = "     "
        current += piece
    lines.append(current)
    return "    unicode-range:\n" + "\n".join(lines)


def hand_css(ranges: dict[str, str]) -> str:
    faces = []
    for part in ("core", "ext"):
        faces.append(
            "  @font-face {\n"
            '    font-family: "ReenieBeanie";\n'
            f'    src: url("/fonts/Hand-{part}.woff2") format("woff2");\n'
            "    font-weight: normal;\n"
            "    font-style: normal;\n"
            f"{css_unicode_range(ranges[f'Hand-{part}'])}\n"
            "  }\n"
        )
    return f"{HAND_START}\n" + "\n".join(faces) + f"  {HAND_END}"


def patch_globals(css: str, block: str) -> str:
    pattern = re.compile(re.escape(HAND_START) + r".*?" + re.escape(HAND_END), re.S)
    if not pattern.search(css):
        raise Failure("src/styles/globals.css has lost its fonts:hand markers")
    return pattern.sub(lambda _: block, css)


# --------------------------------------------------------------------------


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("--check", action="store_true", help="fail if committed output differs")
    args = parser.parse_args()

    outputs: dict[Path, bytes] = {}
    ranges: dict[str, str] = {}
    for family in FAMILIES:
        source = TTFont(io.BytesIO((ROOT / family["source"]).read_bytes()))
        base = load_source(family)
        available = set(base.getBestCmap())
        core_want = with_case_partners(ASCII + PUNCTUATION + "".join(map(chr, family["content"])))
        ext_want = (set(LATIN_1) | set(LATIN_EXT_A)) - core_want
        absent = sorted(core_want - available)
        print(f"\n{family['name']}  <- {family['source']} ({(ROOT / family['source']).stat().st_size} bytes)")
        if absent:
            print(f"  not in the source font, left to the fallback as today: {unicode_range(set(absent))}")
        dropped = available - core_want - ext_want
        print(f"  dropped from the source: {len(dropped)} characters ({unicode_range(dropped)})")
        for part, want in (("core", core_want & available), ("ext", ext_want & available)):
            data = make_subset(base, family, want, part)
            info = verify(family, part, data, want, source)
            ranges[info["label"]] = info["range"]
            outputs[ROOT / family["out_dir"] / f"{info['label']}.woff2"] = data
            print(
                f"  {info['label']}.woff2: {info['bytes']} bytes, {info['glyphs']} glyphs, "
                f"{info['chars']} characters, axes {info['axes'] or 'none'}, "
                f"features {','.join(info['features']) or 'none'}, hinting none, "
                f"gasp {info['gasp']}, name '{info['family_name']}'"
            )
            print(f"    unicode-range: {info['range']}")

    outputs[ROOT / "src/fonts/geist-sans.ts"] = geist_sans_ts(ranges).encode()
    outputs[ROOT / "src/fonts/geist-pixel.ts"] = geist_pixel_ts(ranges).encode()
    globals_path = ROOT / "src/styles/globals.css"
    outputs[globals_path] = patch_globals(globals_path.read_text(), hand_css(ranges)).encode()

    stale = [p for p, data in outputs.items() if not p.exists() or p.read_bytes() != data]
    if args.check:
        if stale:
            print("\nOut of date: " + ", ".join(str(p.relative_to(ROOT)) for p in stale))
            return 1
        print("\nCommitted font output matches the config.")
        return 0
    for path, data in outputs.items():
        path.parent.mkdir(parents=True, exist_ok=True)
        if not path.exists() or path.read_bytes() != data:
            path.write_bytes(data)
    print(f"\nWrote {len(stale)} changed file(s) of {len(outputs)}.")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Failure as error:
        print(f"\nFAILED: {error}", file=sys.stderr)
        sys.exit(1)
