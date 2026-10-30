# «سْلَاامْ سْلَاحْ» female voice — sync table (30 fps)

Voice: `audio/intro_voice_female_final.wav` (from `intro_voice_female_source.mp3`, 1.78 s decoded).
Stereo 48 kHz, −14.0 LUFS integrated, −1.8 dBTP. No pitch, time or speed change. Reverb only on «سْلَاحْ» (RT60 0.75 s, −15 dB under the dry voice), so the file runs 2.73 s.

Measured with silencedetect (−50 dB, d=0.03) and per-frame RMS:

| Point | Brief | Measured | Frame | Note |
| --- | --- | --- | --- | --- |
| «سْلَاامْ» onset | ≈0.15 | 0.165 (soft «س» from 0.025) | F5 | within 1 frame |
| «سْلَاامْ» end / silence start | 0.65 | 0.650 | F19 | |
| silence end / «سْلَاحْ» attack | 1.16 | 1.160 | F35 | |
| «سْلَاحْ» loudest | ≈1.40 | **1.333** | **F40** | 1.40 (F42) is a dip between two humps (F40 −7 dB, F44 −9 dB). 2 frames off, so the measured value is used |
| voice ends | ≈1.74 | 1.741 | F52 | |

## Part A — series intro (96 frames = 3.2 s, length unchanged)

| Event | Old audio (s) | Old frame | New audio (s) | New frame |
| --- | --- | --- | --- | --- |
| «سْلَاامْ» onset → preparatory move (straightens, chin up, rifle drawn up) | 0.05 | F2 (move at F24) | 0.165 | F5 (move F5–F12) |
| Build-up: light sweep + name scrim | — | sweep F41 (after the snap), scrim F48 | across the word | F5–F19 |
| «سْلَاامْ» ends | 0.95 | F28 | 0.650 | F19 |
| Held silence: camera stops, one glint off the muzzle | 0.95–1.00 | F28–F29 | 0.650–1.160 | F20–F34 (glint F25–F33) |
| «سْلَاحْ» attack → «Présentez armes» snap starts | 1.00 | F30 | 1.160 | **F35** |
| Loudest → pose lands, 2-frame flash, micro-shake, name slams, rifle clack + heel stomp + drum | 1.033 | pose F34, name F52 | 1.333 | **F40** (flash F40–F41, shake F40–F43) |
| Avatar + pink underline, then hashtag | — | F50 / F60 / F66 | — | F44 / F44 / F52 |
| Voice ends; reverb tail, pose and name hold | 1.42 | F43 | 1.741 | F52 → ~F75 |
| Exit whip | — | F86–F95 | — | F86–F95 (unchanged) |

Snap: the old 4-frame move (F30→F34) is now 5 frames (F35→F40, one in-between added): never faster than before.
SFX re-timed: boom swell under «سْلَاامْ» and the silence, released on F40; whoosh F35; clack + stomp F40; drum + brass F40 (was F52); wind gust 1.53 s; exit whip unchanged. The effects dip 6 dB whenever the voice speaks, so the voice stays on top. Mix: −13.9 LUFS, −1.5 dBTP.

## Part B — end tag (81 frames = 2.70 s, T0 = reel 79.40 s = reel frame 2382)

| Event | Tag time (s) | Tag frame | Reel time (s) | Reel frame |
| --- | --- | --- | --- | --- |
| Outro's last frame fades to navy | 0.000–0.133 | F0–F4 | 79.400–79.533 | 2382–2386 |
| «سْلَاامْ» writes in right→left, stretch eases out | 0.165–0.650 | F5–F19 | 79.565–80.050 | 2387–2401 |
| Silence: text completely still | 0.650–1.160 | F20–F34 | 80.050–80.560 | 2402–2416 |
| «سْلَاحْ» slams in at scale 1.15 | 1.160 | **F35** | 80.560 | 2417 |
| Impact at scale 1.0: white flash 2 frames, tiny shake (option 2: underline draws F40–F48) | 1.333 | **F40** | 80.733 | 2422 |
| Voice ends; soft pink glow pulses once | 1.741 | F52 (glow F43–F66) | 81.141 | 2434 |
| Fade to black | 2.367–2.700 | F71–F80 | 81.767–82.100 | 2453–2462 |
| End | 2.700 | | **82.100** | 2463 frames total |

Audio: reel audio untouched up to 79.40 s; the tag voice starts at 79.40 s (first sound 79.425 s, «سْلَاامْ» onset 79.565 s), 0.475 s after the reel's own «سْلَاحْ» ends (79.09 s in the word map; the brief's 78.75 s is that word's start). Tag voice level matched to the reel voiceover at render time.
