"""Waveform + per-frame loudness of the female voice master with every sync point marked (30 fps).
Run: python -I plot_sync.py <intro_voice_female_final.wav> <out.png>"""
import sys
import numpy as np
import soundfile as sf
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

x, sr = sf.read(sys.argv[1]); x = x[:, 0]
t = np.arange(len(x)) / sr
fr = sr / 30
db = [20 * np.log10(np.sqrt(np.mean(x[int(f * fr):int((f + 1) * fr)] ** 2)) + 1e-9) for f in range(int(len(x) / fr))]
fig, (a1, a2) = plt.subplots(2, 1, figsize=(16, 8), sharex=True, gridspec_kw={"height_ratios": [3, 2]}, facecolor="#0B1320")
for a in (a1, a2):
    a.set_facecolor("#0B1320"); a.tick_params(colors="#F4F1EA"); [s.set_color("#445") for s in a.spines.values()]
a1.plot(t, x, color="#F4F1EA", lw=0.5)
a1.set_ylim(-1, 1); a1.set_ylabel("amplitude", color="#F4F1EA")
a1.set_title('Female "Salaam... Slah!" master (−14 LUFS, −1.8 dBTP) — sync points at 30 fps', color="#F4F1EA", fontsize=14)
a2.bar(np.arange(len(db)) / 30, np.array(db) + 90, bottom=-90, width=1 / 30 * 0.9, align="edge", color="#FF95A5")
a2.set_ylim(-90, 0); a2.set_ylabel("RMS per frame (dB)", color="#F4F1EA"); a2.set_xlabel("seconds (tag: + 79.40 s in the reel)", color="#F4F1EA")
a2.set_xticks(np.arange(0, 2.8, 0.1)); a2.grid(axis="x", color="#223", lw=0.5)
spans = [(0.165, 0.635, "#1F9A5A", "SALAAM  F5–F19"), (0.635, 1.160, "#445", "silence  F20–F34"), (1.160, 1.74, "#C1272D", "SLAH!  F35–F52"), (1.74, 2.55, "#E5677D", "reverb tail")]
for a in (a1, a2):
    for s0, s1, c, _ in spans:
        a.axvspan(s0, s1, color=c, alpha=0.18)
marks = [(0.165, "F5 0.167 s\nSALAAM onset"), (0.635, "F19 0.635 s\nword ends"), (1.160, "F35 1.160 s\nATTACK: snap / slam starts"),
         (1.333, "F40 1.333 s\nLOUDEST: pose lands,\nflash, shake, title"), (1.74, "F52 1.74 s\nvoice ends")]
for s, lab in marks:
    for a in (a1, a2):
        a.axvline(s, color="#FFC4CD", lw=1.4)
    a1.text(s + 0.01, 0.62 if s not in (1.333,) else -0.95, lab, color="#FFC4CD", fontsize=9, va="bottom")
for a in (a1, a2):
    a.axvline(1.40, color="#AEB6C4", lw=1, ls="--")
a1.text(1.80, -0.55, "dashed 1.40 s = value in the brief:\na dip between two humps, not the peak", color="#AEB6C4", fontsize=8)
for s0, s1, c, lab in spans:
    a2.text((s0 + s1) / 2, -84, lab, color="#F4F1EA", ha="center", fontsize=9)
plt.tight_layout(); plt.savefig(sys.argv[2], dpi=110, facecolor=fig.get_facecolor())
