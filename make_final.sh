#!/usr/bin/env bash
# One complete file: the series intro, then the full reel (title, inserts, hashtag, avatar, captions, outro).
# Both audio parts are brought to the same loudness (-14 LUFS, true peak <= -1 dBTP) before they are joined.
# Usage: ./make_final.sh <original reel mp4>   (needs output/gendarmerie/reel_final.mp4 from reel-gendarmerie/deliver.sh)
set -euo pipefail
cd "$(dirname "$0")"
SRC="${1:?original reel mp4}"
INTRO_V=output/series-intro/intro_9x16.mp4
INTRO_A=series-intro/hf/assets/audio/intro_mix.wav
REEL_V=output/gendarmerie/reel_final.mp4
OUT=output/salam_slah_FINAL.mp4
TMP=$(mktemp -d)

norm() { # $1 in, $2 out: two-pass loudnorm to -14 LUFS / -1.5 dBTP at 48 kHz
  local J
  J=$(ffmpeg -hide_banner -i "$1" -vn -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
  g() { echo "$J" | python3 -c "import json,sys; print(json.load(sys.stdin)['$1'])"; }
  ffmpeg -v error -y -i "$1" -vn -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true,aresample=48000" -ac 2 -c:a pcm_s24le "$2"
}
norm "$INTRO_A" "$TMP/intro.wav"
norm "$SRC" "$TMP/reel.wav"

# video: intro (96 frames) then reel (2382 frames), re-encoded once; audio: the two normalised parts back to back
ffmpeg -v error -y -i "$INTRO_V" -i "$REEL_V" -i "$TMP/intro.wav" -i "$TMP/reel.wav" -filter_complex \
  "[0:v]fps=30,format=yuv420p,setsar=1[v0];[1:v]fps=30,format=yuv420p,setsar=1[v1];[v0][v1]concat=n=2:v=1:a=0[v];\
   [2:a]atrim=0:3.2,apad=whole_dur=3.2[a0];[3:a]atrim=0:79.4,apad=whole_dur=79.4[a1];[a0][a1]concat=n=2:v=0:a=1[a]" \
  -map "[v]" -map "[a]" -c:v libx264 -preset slow -crf 14 -pix_fmt yuv420p -r 30 -c:a aac -b:a 256k -ar 48000 -movflags +faststart "$OUT"
rm -rf "$TMP"
ffprobe -v error -show_entries stream=codec_name,width,height,nb_frames,duration -of compact "$OUT"
ffmpeg -hide_banner -i "$OUT" -vn -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|Peak):"
