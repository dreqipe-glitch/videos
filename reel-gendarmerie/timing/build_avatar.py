"""Page avatar: circular crop of the supplied portrait on face and cap. The background sign (text) is inpainted
outside the cap so no lettering shows; the face itself is untouched. Output 360 px (downscale only).
Run: python -I build_avatar.py <portrait.jpg> <lama.onnx> <out.png>"""
import sys
import numpy as np, cv2
from PIL import Image, ImageDraw
import onnxruntime as ort

src, lama_p, out_p = sys.argv[1:4]
P = np.asarray(Image.open(src).convert("RGB")).astype(np.float32)
H, W = P.shape[:2]
# cap outline (traced), grown a few px so the inpaint never eats the cap edge
cap = [(316, 200), (320, 165), (330, 120), (360, 84), (420, 56), (500, 40), (600, 34), (700, 40), (780, 58),
       (832, 84), (868, 120), (884, 170), (882, 220), (862, 262)]
m = Image.new("L", (W, H), 0)
d = ImageDraw.Draw(m)
d.rectangle((300, 8, 1005, 205), fill=255)
d.polygon(cap + [(862, 420), (316, 420)], fill=0)
mask = np.asarray(m) > 0
sess = ort.InferenceSession(lama_p)


def lama(img, msk, box):
    x0, y0, x1, y1 = box
    crop, mm = img[y0:y1, x0:x1], msk[y0:y1, x0:x1].astype(np.float32)
    ci = cv2.resize(crop, (512, 512), interpolation=cv2.INTER_AREA) / 255.0
    cm = (cv2.resize(mm, (512, 512)) > 0.01).astype(np.float32)
    o = sess.run(None, {"image": ci.transpose(2, 0, 1)[None].astype(np.float32), "mask": cm[None, None]})[0][0].transpose(1, 2, 0)
    if o.max() <= 1.5:
        o *= 255.0
    o = cv2.resize(o, (x1 - x0, y1 - y0), interpolation=cv2.INTER_CUBIC)
    f = np.maximum(cv2.GaussianBlur(mm, (0, 0), 2), mm)[..., None]
    res = img.copy()
    res[y0:y1, x0:x1] = crop * (1 - f) + o * f
    return res


P2 = lama(P, mask, (250, 0, 670, 420))
P2 = lama(P2, mask, (620, 0, 1040, 420))
cx, cy, r = 580, 365, 330
sq = P2[cy - r:cy + r, cx - r:cx + r]
img = Image.fromarray(np.clip(sq, 0, 255).astype(np.uint8)).resize((360, 360), Image.LANCZOS)
a = Image.new("L", (360 * 4, 360 * 4), 0)
ImageDraw.Draw(a).ellipse((0, 0, 360 * 4 - 1, 360 * 4 - 1), fill=255)
img.putalpha(a.resize((360, 360), Image.LANCZOS))
img.save(out_p, optimize=True)
