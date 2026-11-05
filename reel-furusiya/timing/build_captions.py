"""Builds reel-furusiya/hf/compositions/captions.html from words-aligned.json (MMS alignment of the reference script).
Captions only cover the footage: F131–F847, F918–F1099, F1263–F1387. The style is reel 1's (shared render_captions)."""
import json, pathlib, sys
here = pathlib.Path(__file__).parent
sys.path.insert(0, str(here.parent.parent / "reel-gendarmerie/timing"))
from build_captions import group_sections, render_captions  # noqa: E402

A = json.load(open(here / "words-aligned.json", encoding="utf-8"))
W = lambda *ix: [(A[i]["text"], A[i]["start"], A[i]["end"]) for i in ix]

SECTIONS = [
    (131 / 30, 848 / 30, [
        W(7, 8, 9), W(10, 11, 12),
        W(13, 14, 15), W(16, 17), W(18, 19, 20, 21), W(22, 23),
        W(24, 25, 26), W(27, 28, 29, 30), W(31, 32, 33),
        W(34, 35, 36), W(37, 38, 39), W(40, 41, 42), W(43, 44), W(45, 46, 47),
        W(48, 49), W(50, 51), W(52, 53),
    ]),
    (918 / 30, 1100 / 30, [
        W(55, 56, 57), W(58, 59), W(60, 61), W(62, 63, 64), W(65, 66),
    ]),
    (1263 / 30, 1388 / 30, [
        W(78, 79), W(80, 81, 82), W(83, 84),
    ]),
]

groups = group_sections(SECTIONS)
render_captions(groups, 66.6, here.parent / "hf/compositions/captions.html")
for op, cl, words in groups:
    print(f"{op:6.2f}-{cl:6.2f}  " + " ".join(w[0] for w in words))
