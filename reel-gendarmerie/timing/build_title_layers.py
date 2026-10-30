"""Splits the static title card (source frames 1–28) into 2.5D layers for the animated intro.

Inputs: the full-res frame, the ML figure matte (hyperframes remove-background on the figure crop), LaMa ONNX.
Outputs (hf/assets/title/): plate.jpg (inpainted background), flag.png, qmark.png, figure.png, t_sual.png,
t_youm.png, burst.png, sil_mask.png (soft mask for the gendarme silhouette glow), each RGBA at full canvas size
or trimmed with offsets recorded in layers.json.

Run with the scratchpad venv:  python -I build_title_layers.py <frame.png> <fig_matte.png> <lama.onnx> <outdir>
"""
import json, sys, pathlib
import numpy as np, cv2
from PIL import Image
from scipy import ndimage as ndi
import onnxruntime as ort

frame_p, figm_p, lama_p, out_p = sys.argv[1:5]
out = pathlib.Path(out_p); out.mkdir(parents=True, exist_ok=True)
P = np.asarray(Image.open(frame_p).convert("RGB")).astype(np.float32)
H, W = P.shape[:2]
R, G, B = P[..., 0], P[..., 1], P[..., 2]
yy, xx = np.mgrid[0:H, 0:W]


def smooth(x, a, b):
    t = np.clip((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


def fill_small_holes(m, max_area):
    """fill holes in a binary mask up to max_area px (specular highlights), keep letter counters"""
    holes = ndi.binary_fill_holes(m) & ~m
    lab, n = ndi.label(holes)
    if n == 0:
        return m
    areas = ndi.sum(holes, lab, range(1, n + 1))
    small = np.isin(lab, [i + 1 for i, a in enumerate(areas) if a <= max_area])
    return m | small


def keyed(score, lo, hi, region, max_hole):
    a = smooth(score, lo, hi) * region
    core = fill_small_holes(a > 0.5, max_hole)
    a = np.maximum(a, core.astype(np.float32))
    return a


redness = R - np.maximum(G, B)

# (b) flag: red cloth and green star against blue/white sky. Bottom edge cut where the «؟» begins.
flag_region = ((yy < 640) & (xx < 640)) | ((xx >= 545) & (xx < 650) & (yy < 728))
flag_score = np.maximum(R - B, G - B)
a_flag = keyed(flag_score, 10, 55, flag_region, 60000)
a_flag = np.where(xx > 470, cv2.GaussianBlur(a_flag, (0, 0), 2.5), a_flag)
# feather the hazy corner where the region cut is a straight line, so no hard edge shows when the flag waves
soft_region = cv2.GaussianBlur(flag_region.astype(np.float32), (0, 0), 14)
a_flag = np.where((xx > 280) & (yy > 560), a_flag * np.clip(soft_region * 1.6 - 0.3, 0, 1), a_flag)

# (f) burst lines above the title
burst_region = (xx >= 590) & (xx < 845) & (yy >= 785) & (yy < 920)
a_burst = keyed(redness, 35, 90, burst_region, 50)

# (e1) «سؤال»: red extruded letters
sual_region = (xx >= 540) & (xx < 1040) & (yy >= 920) & (yy < 1152)
a_sual = keyed(redness, 30, 80, sual_region, 220)

# (d2) «؟» and its dot
q_region = (xx >= 95) & (xx < 575) & (yy >= 632) & (yy < 1392) & ~flag_region
# solid red core → the «؟» body and its dot only (drops the flag's pink haze and the white rim highlights)
q_core = (redness > 60) & q_region
lab, n = ndi.label(q_core)
sizes = ndi.sum(q_core, lab, range(1, n + 1))
keep_ids = [i + 1 for i in np.argsort(sizes)[::-1][:2]]
q_core = ndi.binary_fill_holes(np.isin(lab, keep_ids))
a_q = smooth(redness, 30, 80) * ndi.binary_dilation(q_core, iterations=3)
a_q = np.maximum(a_q, ndi.binary_erosion(q_core, iterations=1).astype(np.float32))

# (d1) white figure: ML matte placed back on the canvas, minus red, largest component only
fm = np.asarray(Image.open(figm_p).convert("RGBA")).astype(np.float32)[..., 3] / 255.0
a_fig = np.zeros((H, W), np.float32)
a_fig[620:620 + fm.shape[0], 30:30 + fm.shape[1]] = fm
a_fig *= (redness < 45) & (xx < 335)
lab, n = ndi.label(a_fig > 0.5)
if n:
    big = 1 + int(np.argmax(ndi.sum(a_fig > 0.5, lab, range(1, n + 1))))
    keep = ndi.binary_dilation(lab == big, iterations=6)
    a_fig *= keep

# (e2) «اليوم»: silver letters on a near-white horizon. Difference matte against an inpainted background.
youm_box = (xx >= 515) & (xx < 950) & (yy >= 1108) & (yy < 1362)
lum = 0.299 * R + 0.587 * G + 0.114 * B
sat = (np.max(P, axis=2) - np.min(P, axis=2))
rough = youm_box & ((lum < 212) | (sat > 34)) & (a_sual < 0.5)
rough = ndi.binary_closing(rough, iterations=4)
rough = fill_small_holes(rough, 900)

sess = ort.InferenceSession(lama_p)


def lama(img, mask, box):
    """inpaint img (float RGB 0–255) inside mask (bool) within box (x0,y0,x1,y1), at 512 then resized back"""
    x0, y0, x1, y1 = box
    crop = img[y0:y1, x0:x1]
    m = mask[y0:y1, x0:x1].astype(np.float32)
    ci = cv2.resize(crop, (512, 512), interpolation=cv2.INTER_AREA) / 255.0
    cm = (cv2.resize(m, (512, 512), interpolation=cv2.INTER_LINEAR) > 0.01).astype(np.float32)
    o = sess.run(None, {"image": ci.transpose(2, 0, 1)[None].astype(np.float32), "mask": cm[None, None]})[0][0]
    o = o.transpose(1, 2, 0)
    if o.max() <= 1.5:
        o = o * 255.0
    o = cv2.resize(o, (x1 - x0, y1 - y0), interpolation=cv2.INTER_CUBIC)
    res = img.copy()
    feather = cv2.GaussianBlur(m, (0, 0), 3)
    feather = np.maximum(feather, m)[..., None]
    res[y0:y1, x0:x1] = crop * (1 - feather) + o * feather
    return res


def box_around(mask, margin, minsize=512):
    ys, xs = np.where(mask)
    x0, x1, y0, y1 = xs.min() - margin, xs.max() + margin, ys.min() - margin, ys.max() + margin
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    s = max(x1 - x0, y1 - y0, minsize)
    x0, x1 = int(max(0, cx - s / 2)), int(min(W, cx + s / 2))
    y0, y1 = int(max(0, cy - s / 2)), int(min(H, cy + s / 2))
    return x0, y0, x1, y1


bg_youm = lama(P, ndi.binary_dilation(rough, iterations=8), box_around(rough, 60))
diff = np.abs(P - bg_youm).max(axis=2)
a_youm = smooth(diff, 10, 42) * youm_box
a_youm = np.maximum(a_youm, ndi.binary_erosion(rough, iterations=2).astype(np.float32))
a_youm = np.maximum(a_youm, fill_small_holes(a_youm > 0.35, 1400).astype(np.float32)) * (a_sual < 0.5)

# the «؟» continues behind the figure: close its shape there and fill the colour from the visible red
q_full = ndi.binary_closing(a_q > 0.5, structure=np.ones((3, 3)), iterations=18) & q_region
q_hidden = q_full & (a_fig > 0.3) & ~(a_q > 0.5)
q_rgb = P.copy()
if q_hidden.any():
    red_only = (a_q > 0.5).astype(np.uint8)
    src = (P * red_only[..., None]).astype(np.uint8)
    q_rgb = cv2.inpaint(src, (q_hidden | ~(a_q > 0.5) & q_full).astype(np.uint8), 9, cv2.INPAINT_TELEA).astype(np.float32)
    q_rgb = np.where((a_q > 0.5)[..., None], P, q_rgb)
a_qfull = np.maximum(a_q, q_hidden.astype(np.float32))

# background plate: everything that moves is removed, plus the baked-in reflections and contact shadows.
# Every pass masks ALL holes (so LaMa only ever sees true background as context), filling overlapping tiles
# top to bottom; each committed fill becomes clean context for the next tile, which avoids seams.
dil = lambda a, n: ndi.binary_dilation(a > 0.04, iterations=n)
refl = ndi.binary_dilation((yy > 1385) & (redness > 4), iterations=24)
flag_fringe = (xx >= 430) & (xx < 680) & (yy >= 420) & (yy < 760) & ((redness > 4) | dil(a_flag, 26))
fig_refl = (xx >= 40) & (xx < 330) & (yy >= 1425) & (yy < 1740)
contact = (xx >= 30) & (xx < 980) & (yy >= 1300) & (yy < 1440) & (lum < 205)
hole = (dil(a_burst, 10) | dil(a_sual, 14) | dil(a_youm, 14) | dil(a_qfull, 34) | dil(a_fig, 16) | dil(a_flag, 8)
        | refl | fig_refl | flag_fringe | ndi.binary_dilation(contact, iterations=8))
plate = P.copy()
remaining = hole.copy()
T, STEP = 760, 380
for y0 in range(0, H - STEP, STEP):
    for x0 in range(0, W - STEP, STEP):
        bx = (min(x0, W - T) if W > T else 0, min(y0, H - T), min(x0, W - T) + T if W > T else W, min(y0, H - T) + T)
        m = remaining & (xx >= bx[0]) & (xx < bx[2]) & (yy >= bx[1]) & (yy < bx[3])
        if m.any():
            # the model sees every unfilled hole pixel in the tile as masked
            plate = lama(plate, m, bx)
            # commit the upper-left part of the tile; the rest is redone with more context by later tiles
            commit = (xx >= bx[0]) & (xx < bx[0] + STEP + 190) & (yy >= bx[1]) & (yy < bx[1] + STEP + 190)
            remaining &= ~commit
if remaining.any():
    plate = lama(plate, remaining, box_around(remaining, 120, 512))

# gendarme silhouette: soft mask of the darker blue figure against the brighter sky/city
sil_box = (xx >= 830) & (yy >= 575) & (yy < 1150)
blur_bg = cv2.GaussianBlur(P, (0, 0), 40)
dark = (blur_bg - P).mean(axis=2)
a_sil = smooth(dark, 4, 22) * sil_box * (B > R)
a_sil = cv2.GaussianBlur(a_sil, (0, 0), 3)


def save(name, rgb, a):
    a8 = (np.clip(a, 0, 1) * 255).astype(np.uint8)
    ys, xs = np.where(a8 > 2)
    x0, x1, y0, y1 = max(0, xs.min() - 4), min(W, xs.max() + 5), max(0, ys.min() - 4), min(H, ys.max() + 5)
    rgba = np.dstack([np.clip(rgb, 0, 255).astype(np.uint8), a8])[y0:y1, x0:x1]
    Image.fromarray(rgba, "RGBA").save(out / f"{name}.png", optimize=True)
    return {"x": int(x0), "y": int(y0), "w": int(x1 - x0), "h": int(y1 - y0)}


meta = {
    "flag": save("flag", P, a_flag),
    "burst": save("burst", P, a_burst),
    "t_sual": save("t_sual", P, a_sual),
    "t_youm": save("t_youm", P, a_youm),
    "qmark": save("qmark", q_rgb, a_qfull),
    "figure": save("figure", P, a_fig),
    "sil": save("sil", P, a_sil),
}
Image.fromarray(np.clip(plate, 0, 255).astype(np.uint8)).save(out / "plate.jpg", quality=95)
json.dump(meta, open(out / "layers.json", "w"), indent=1)
print(json.dumps(meta))

# drifting sky: the plate's sky as its own layer, feathered above the skyline and around the silhouette
sky_a = 1 - smooth(yy.astype(np.float32), 600, 780)
sil_hole = cv2.GaussianBlur(((xx >= 790) & (yy >= 540)).astype(np.float32), (0, 0), 40)
sky_a = np.clip(sky_a * (1 - sil_hole), 0, 1)
Image.fromarray(np.dstack([np.clip(plate, 0, 255).astype(np.uint8), (sky_a * 255).astype(np.uint8)])[:800], "RGBA").save(out / "sky.png", optimize=True)
# silhouette wash: a heavily blurred plate over the silhouette; fading it out fades the silhouette in
wash_a = cv2.GaussianBlur(ndi.binary_dilation(a_sil > 0.08, iterations=14).astype(np.float32), (0, 0), 10)
meta["sil_wash"] = save("sil_wash", cv2.GaussianBlur(plate, (0, 0), 28), wash_a)
json.dump(meta, open(out / "layers.json", "w"), indent=1)
