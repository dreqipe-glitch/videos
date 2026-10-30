"""Female «سْلَاامْ… سْلَاحْ!» master, used by the series intro and the end tag.

The dry voice is untouched: no pitch shift, no time-stretch, no EQ, no compression. Mono is duplicated to stereo at
48 kHz. Only «سْلَاحْ!» (from 1.10 s) feeds a short open-courtyard reverb (RT60 0.75 s, a few wall slaps) so the end
does not cut off dry; «سْلَاامْ» and the silence after it get no reverb. The level is set with plain gain
(target -14 LUFS integrated, true peak <= -1 dBTP); master.sh does the measurement.

Run: python -I build_voice.py <voice decoded @48k mono f32 wav> <out pre-master wav>
"""
import sys
import numpy as np
import soundfile as sf

SR = 48000
SEND_FROM = 1.10  # s: just before the «سْلَاحْ» attack (1.16)
RT60 = 0.75       # s
TAIL = 0.95       # s of room for the tail after the voice ends

dry, sr = sf.read(sys.argv[1], always_2d=True)
assert sr == SR
dry = dry[:, 0]
N = len(dry) + int(TAIL * SR)
v = np.zeros(N); v[:len(dry)] = dry
rng = np.random.default_rng(81)


def band(x, lo, hi, soft=0.15):
    """zero-phase band-pass in the frequency domain with soft edges"""
    X = np.fft.rfft(x, axis=0)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    m = np.clip((f - lo * (1 - soft)) / (lo * soft * 2), 0, 1) * np.clip((hi * (1 + soft) - f) / (hi * soft * 2), 0, 1)
    return np.fft.irfft(X * (m[:, None] if X.ndim == 2 else m), n=len(x), axis=0)


# impulse response: decorrelated noise with an RT60 decay, plus slaps off the courtyard walls
ir_len = int(SR * 1.2)
ti = np.arange(ir_len) / SR
ir = rng.standard_normal((ir_len, 2)) * np.exp(-6.91 * ti / RT60)[:, None]
ir[: int(0.02 * SR)] = 0  # 20 ms pre-delay keeps the attack dry
ir = band(ir, 220, 5000)
for dt, g in [(0.048, 0.45), (0.115, 0.32), (0.2, 0.36), (0.33, 0.18)]:
    k = int(dt * SR); ir[k, 0] += g * 25; ir[k + 31, 1] += g * 25
ir /= np.sqrt((ir ** 2).sum(0, keepdims=True))

send = np.clip((np.arange(N) / SR - SEND_FROM) / 0.03, 0, 1)
src = v * send
wet = np.stack([np.fft.irfft(np.fft.rfft(src, 2 * N) * np.fft.rfft(ir[:, c], 2 * N))[:N] for c in range(2)], 1)
# subtle: the wet sits 15 dB under the dry «سْلَاحْ»
w2 = v[int(1.16 * SR):int(1.74 * SR)]
wet *= np.sqrt((w2 ** 2).mean()) / (np.sqrt((wet[int(1.16 * SR):int(1.74 * SR)] ** 2).mean()) + 1e-12) * 10 ** (-15 / 20)
# end cleanly: the tail is faded out over its last 150 ms
fade = np.ones(N); k = int(0.15 * SR); fade[-k:] = np.cos(np.linspace(0, np.pi / 2, k)) ** 2
out = (np.stack([v, v], 1) + wet) * fade[:, None]
sf.write(sys.argv[2], out.astype(np.float32), SR, subtype="FLOAT")
print("length s", round(N / SR, 3), "peak dBFS", round(20 * np.log10(np.abs(out).max()), 2))
