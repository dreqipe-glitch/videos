"""Series intro sound: the female «سْلَاامْ… سْلَاحْ!» command with the effects built around it. Every effect is
synthesised here (royalty-free by construction). Output: 48 kHz stereo, pre-master; master.sh brings it to
-14 LUFS / -1 dBTP.

Timing (seconds, 30 fps), measured on audio/intro_voice_female_final.wav: «سْلَاامْ» 0.165-0.635 (F5-F19), silence,
«سْلَاحْ!» attack 1.160 (F35), loudest 1.333 (F40) = rifle lands + name slams + drum; exit whip F86-F95; total 3.2.
Run: python -I build_audio.py <audio/intro_voice_female_final.wav> <out.wav> [original|processed]
"original" (default) is used now: the voice master already carries its reverb tail, so it passes through untouched.
"original" (default): the voice passes through untouched (no gain, no echo); only the effects bed is scaled so the
sum never clips, and no mastering is applied afterwards. "processed": lowered voice + parade-ground echo, then
master.sh to -14 LUFS / -1 dBTP.
"""
import sys
import numpy as np
import soundfile as sf

SR = 48000
DUR = 3.2
N = int(SR * DUR)
rng = np.random.default_rng(81)
t_all = np.arange(N) / SR


def band(x, lo, hi, soft=0.15):
    """zero-phase band-pass in the frequency domain with soft edges"""
    X = np.fft.rfft(x, axis=0)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    m = np.clip((f - lo * (1 - soft)) / (lo * soft * 2 + 1e-9), 0, 1) if lo > 0 else np.ones_like(f)
    m *= np.clip((hi * (1 + soft) - f) / (hi * soft * 2), 0, 1)
    if X.ndim == 2:
        m = m[:, None]
    return np.fft.irfft(X * m, n=len(x), axis=0)


def place(buf, sig, at, gain=1.0):
    i = int(at * SR)
    sig = sig if sig.ndim == 2 else np.stack([sig, sig], 1)
    n = min(len(sig), len(buf) - i)
    buf[i:i + n] += sig[:n] * gain


def env_exp(n, tau):
    return np.exp(-np.arange(n) / SR / tau)


def stereo(mono, width=0.0, seed=1):
    if width == 0:
        return np.stack([mono, mono], 1)
    d = int(SR * 0.0006 * seed)
    return np.stack([mono, np.roll(mono, d) * (1 - width) + mono * width], 1)


# ---------- the command: lower the clipped peak, add a parade-ground echo ----------
MODE = sys.argv[3] if len(sys.argv) > 3 else "original"
voice, sr = sf.read(sys.argv[1], always_2d=True)
assert sr == SR
voice = voice[:, :2] * (10 ** (-3 / 20) if MODE == "processed" else 1.0)
v = np.zeros((N, 2)); v[:len(voice)] = voice[:N]

ir_len = int(SR * 2.0)
ti = np.arange(ir_len) / SR
ir = np.stack([rng.standard_normal(ir_len), rng.standard_normal(ir_len)], 1) * np.exp(-6.9 * ti / 1.7)[:, None]
ir = band(ir, 180, 5200)
for dt, g in [(0.045, 0.5), (0.11, 0.35), (0.19, 0.42), (0.37, 0.25)]:  # slaps off the parade-ground walls
    k = int(dt * SR); ir[k, 0] += g * 30; ir[k + 37, 1] += g * 30
ir /= np.sqrt((ir ** 2).sum(0, keepdims=True))
wet = np.stack([np.fft.irfft(np.fft.rfft(v[:, c], 2 * N) * np.fft.rfft(ir[:, c], 2 * N))[:N] for c in range(2)], 1)
wet = band(wet, 160, 7000)
wet *= (np.sqrt((v ** 2).mean()) / (np.sqrt((wet ** 2).mean()) + 1e-12)) * 10 ** (-2 / 20)
voice_bus = v + wet if MODE == "processed" else v.copy()
mix = np.zeros((N, 2))  # effects bed; the voice is added at the end

# ---------- low boom swelling under «سلااام», released into the hit ----------
ATK, HIT = 35 / 30, 40 / 30
n = int(SR * 1.8)
tt = np.arange(n) / SR
swell = np.clip(tt / HIT, 0, 1) ** 2.2 * np.where(tt < HIT, 1.0, np.exp(-(tt - HIT) / 0.22))
boom = (np.sin(2 * np.pi * 41 * tt) + 0.45 * np.sin(2 * np.pi * 82 * tt + 0.7)) * swell
boom += band(rng.standard_normal(n), 25, 140) * swell * 0.9
place(mix, stereo(boom), 0.0, 0.16)

# ---------- rifle move whoosh (F35-F40) ----------
n = int(SR * 0.2)
tt = np.arange(n) / SR
wh = band(rng.standard_normal(n), 700, 4200) * np.sin(np.pi * np.clip(tt / 0.17, 0, 1)) ** 2
place(mix, stereo(wh, 0.6, 3), ATK, 0.07)

# ---------- rifle clack + heel stomp, landing on F40 ----------
n = int(SR * 0.45)
tt = np.arange(n) / SR
click = np.zeros(n); click[:96] = np.hanning(192)[96:]
metal = sum(a * np.sin(2 * np.pi * f * tt + p) for f, a, p in [(1850, 1, 0), (2950, 0.7, 1.1), (4100, 0.45, 2.3)]) * env_exp(n, 0.06)
crack = band(rng.standard_normal(n), 1500, 9000) * env_exp(n, 0.022)
slap = band(rng.standard_normal(n), 500, 1100) * env_exp(n, 0.015)
clack = click * 1.2 + metal * 0.35 + crack * 0.9 + slap * 0.8
place(mix, stereo(clack, 0.8, 2), HIT, 0.55)
f_sweep = 95 * np.exp(-tt / 0.12) + 44
stomp = np.sin(2 * np.pi * np.cumsum(f_sweep) / SR) * env_exp(n, 0.075) + band(rng.standard_normal(n), 40, 400) * env_exp(n, 0.03) * 0.8
place(mix, stereo(stomp), HIT + 0.004, 0.6)

# ---------- drum hit + brass sting on the page name, which slams in on the same frame (F40) ----------
REV = HIT
n = int(SR * 1.4)
tt = np.arange(n) / SR
f_t = 85 + 10 * np.exp(-tt / 0.05)
drum = (np.sin(2 * np.pi * np.cumsum(f_t) / SR) + 0.4 * np.sin(2 * np.pi * np.cumsum(f_t * 1.5) / SR) + 0.25 * np.sin(2 * np.pi * np.cumsum(f_t * 2) / SR)) * env_exp(n, 0.45)
drum += band(rng.standard_normal(n), 80, 2500) * env_exp(n, 0.02) * 0.6
place(mix, stereo(drum), REV, 0.15)
brass = np.zeros(n)
for f0 in [146.83, 220.0, 293.66, 369.99]:  # D major
    vib = 1 + 0.003 * np.sin(2 * np.pi * 5.2 * tt)
    for h in range(1, 9):
        brass += (h ** -1.4) * np.sin(2 * np.pi * f0 * h * np.cumsum(vib) / SR + h)
brass *= np.clip(tt / 0.035, 0, 1) * np.exp(-np.maximum(tt - 0.25, 0) / 0.42)
brass = band(brass, 120, 3800)
brass_st = stereo(brass, 0.7, 4)
brass_wet = np.stack([np.fft.irfft(np.fft.rfft(brass_st[:, c], 2 * n) * np.fft.rfft(ir[:n, c], 2 * n))[:n] for c in range(2)], 1)
place(mix, brass_st / np.abs(brass_st).max() * 0.055 + brass_wet / np.abs(brass_wet).max() * 0.03, REV, 1.0)

# ---------- wind for the flag, with a gust after the command ----------
wind = band(np.cumsum(rng.standard_normal((N, 2)), 0), 150, 1100)
wind /= np.abs(wind).max()
mod = 0.6 + 0.4 * np.sin(2 * np.pi * 0.35 * t_all + 1.0)
gust = 1 + 1.2 * np.exp(-((t_all - (HIT + 0.2)) / 0.35) ** 2)
mix += wind * (mod * gust)[:, None] * 0.03

# ---------- exit whip (F86-F95) ----------
n = int(SR * 0.42)
tt = np.arange(n) / SR
rise = band(rng.standard_normal(n), 900, 7000) * (tt / tt[-1]) ** 2.5
place(mix, stereo(rise, 0.7, 5), DUR - 0.42, 0.06)

# soft edges on the effects bed: no click at the start, no abrupt stop at the end
fade = np.ones(N); fade[:int(0.004 * SR)] = np.linspace(0, 1, int(0.004 * SR))
fade[-int(0.06 * SR):] = np.linspace(1, 0, int(0.06 * SR)) ** 1.5
mix *= fade[:, None]
if MODE == "processed":
    out = voice_bus + mix
    out *= 0.89 / np.abs(out).max()
else:
    # the effects were balanced against a voice 3 dB lower; keep that balance, then lower only the effects
    # until the sum stays under the original's own peak
    mix *= 10 ** (3 / 20)
    # keep the voice on top: the effects dip 6 dB wherever the voice is speaking (20 ms attack, 150 ms release)
    venv = np.abs(voice_bus).max(1)
    B0 = 240
    lvl = np.repeat([venv[i:i + B0].max() for i in range(0, N, B0)], B0)[:N]
    duck = np.where(lvl > 10 ** (-35 / 20), 10 ** (-6 / 20), 1.0)
    sm = np.empty(N); g0 = 1.0
    for i in range(0, N, B0):
        tgt = duck[i]; c = 1 - np.exp(-B0 / SR / (0.02 if tgt < g0 else 0.15)); g0 += (tgt - g0) * c; sm[i:i + B0] = g0
    mix *= sm[:, None]
    # duck the effects only where the sum would pass the original's own peak (5 ms blocks, look-ahead, smoothed)
    ceiling = max(np.abs(voice_bus).max(), 10 ** (-0.3 / 20))
    B = 240
    g = np.ones(N)
    for _ in range(6):
        over = np.abs(voice_bus + mix * g[:, None]).max(1)
        if over.max() <= ceiling:
            break
        room = np.clip(ceiling - np.abs(voice_bus).max(1), 0, None) / (np.abs(mix).max(1) + 1e-9)
        nb = int(np.ceil(N / B))
        gb = np.array([min(1.0, room[i * B:(i + 1) * B].min()) for i in range(nb)])
        gb = np.minimum.reduce([np.roll(gb, k) for k in (-2, -1, 0, 1, 2)])  # look-ahead / hold
        ker = np.hanning(9); ker /= ker.sum()
        gb = np.minimum(gb, np.convolve(gb, ker, mode="same"))
        g = np.minimum(g, np.repeat(gb, B)[:N] * 0.995)
    out = voice_bus + mix * g[:, None]
    print("effects ducked by up to", round(20 * np.log10(g.min() + 1e-9), 1), "dB on", round((g < 0.99).mean() * 100, 1), "% of the time")
sf.write(sys.argv[2], out.astype(np.float32), SR, subtype="FLOAT")
print("peak dBFS", round(20 * np.log10(np.abs(out).max()), 2))
