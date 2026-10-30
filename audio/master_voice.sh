#!/usr/bin/env bash
# Builds audio/intro_voice_female_final.wav from the female source mp3.
# Decode → 48 kHz mono (resample only: same pitch, same timing) → build_voice.py (stereo + «سْلَاحْ» reverb tail)
# → plain gain to -14 LUFS integrated. Fails if the true peak ends up above -1 dBTP.
set -euo pipefail
cd "$(dirname "$0")"
SRC=intro_voice_female_source.mp3
OUT=intro_voice_female_final.wav
TMP=$(mktemp -d)
ffmpeg -v error -y -i "$SRC" -af aresample=48000:resampler=soxr:precision=28 -ac 1 -c:a pcm_f32le "$TMP/dry.wav"
python3 -I build_voice.py "$TMP/dry.wav" "$TMP/pre.wav"
I=$(ffmpeg -hide_banner -i "$TMP/pre.wav" -af ebur128=framelog=quiet -f null - 2>&1 | awk '/^ +I:/{print $2}')
GAIN=$(python3 -c "print(-14 - $I)")
ffmpeg -v error -y -i "$TMP/pre.wav" -af "volume=${GAIN}dB" -c:a pcm_s24le "$OUT"
rm -rf "$TMP"
R=$(ffmpeg -hide_banner -i "$OUT" -af ebur128=peak=true:framelog=quiet -f null - 2>&1)
echo "$R" | grep -E "^ +(I|Peak):"
TP=$(echo "$R" | awk '/^ +Peak:/{print $2}')
python3 -c "import sys; sys.exit(0 if $TP <= -1.0 else 'true peak $TP dBTP is above -1')"
ffprobe -v error -show_entries stream=sample_rate,channels,sample_fmt:format=duration -of compact "$OUT"
