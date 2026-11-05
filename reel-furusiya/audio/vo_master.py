"""Reel 2 voice-over master. Timing is never changed: both stages only multiply the signal by a gain.
  nr    <in.wav> <out.wav>          light noise reduction: zero-phase STFT gain (overlap-add, no delay), noise profile
                                    learnt from the quietest non-silent frames (the pauses), at most 10 dB of reduction
  level <in.wav> <out.wav> <dB>     gain, then a transparent true-peak limiter: 4x-oversampled peak detection,
                                    1.5 ms look-ahead applied without delay, 60 ms release, ceiling -1.3 dBTP
Run with the scratch venv: python -I vo_master.py nr|level ..."""
import sys
import numpy as np
import soundfile as sf
from scipy.ndimage import minimum_filter1d, uniform_filter, uniform_filter1d
from scipy.signal import istft, resample_poly, stft

mode, src, dst = sys.argv[1:4]
x, sr = sf.read(src, always_2d=True, dtype="float64")


def nr(x):
    nfft, hop = 2048, 512
    _, _, Z = stft(x.T, fs=sr, window="hann", nperseg=nfft, noverlap=nfft - hop)
    P = (np.abs(Z) ** 2).mean(0)  # power, both channels
    E = P.sum(0)
    live = E > 1e-10  # leave digital silence alone
    quiet = live & (E <= np.percentile(E[live], 15))
    N = P[:, quiet].mean(1, keepdims=True)
    Ps = uniform_filter(P, size=(3, 3), mode="nearest")
    G = np.sqrt(np.clip(1 - 2.0 * N / np.maximum(Ps, 1e-20), 0, 1))
    G = np.maximum(G, 10 ** (-10 / 20))  # light: never more than 10 dB down
    G = uniform_filter1d(G, 3, axis=1, mode="nearest")  # no musical noise
    G[:, ~live] = 1.0
    _, y = istft(Z * G[None], fs=sr, window="hann", nperseg=nfft, noverlap=nfft - hop)
    return y.T[: len(x)]


def level(x, gain_db, ceiling_db=-1.3, la_ms=1.5, rel_ms=60):
    y = x * 10 ** (gain_db / 20)
    up = resample_poly(y, 4, 1, axis=0)
    env = np.abs(up).max(1).reshape(-1, 4).max(1)[: len(y)]  # true-peak estimate per sample
    req = np.minimum(1.0, 10 ** (ceiling_db / 20) / np.maximum(env, 1e-9))
    w = 2 * int(la_ms / 1000 * sr) + 1
    g = uniform_filter1d(minimum_filter1d(req, w, mode="nearest"), w, mode="nearest")  # reaches req before each peak
    k = 1 - np.exp(-1 / (rel_ms / 1000 * sr))
    out = np.empty_like(g)
    prev = 1.0
    for i, gi in enumerate(g):  # release: rise back to unity smoothly, never above the look-ahead curve
        prev = min(gi, prev + (1 - prev) * k)
        out[i] = prev
    red = out < 0.999
    print(f"limiter: gain reduction on {red.mean() * 100:.2f}% of samples, max {-20 * np.log10(out.min()):.2f} dB")
    return y * out[:, None]


if mode == "nr":
    y = nr(x)
elif mode == "level":
    y = level(x, float(sys.argv[4]))
else:
    raise SystemExit("mode: nr | level")
sf.write(dst, y.astype(np.float32), sr, subtype="FLOAT")
