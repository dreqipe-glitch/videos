#!/usr/bin/env bash
# Renders the inserts and the captions layer, cuts insert_1/2/3 at the measured gap frames, and composites
# everything over the original reel. The original audio is stream-copied untouched.
# Usage: reel-gendarmerie/deliver.sh /path/to/original_reel.mp4
set -euo pipefail
SRC="${1:?original reel mp4}"
HERE="$(cd "$(dirname "$0")" && pwd)"
HF="$HERE/hf"
OUT="$HERE/../output/gendarmerie"
mkdir -p "$OUT" "$HF/renders"
cd "$HF"
HFCLI="npx --yes hyperframes@0.8.211"

# title card (static source frames 0–28) and gap frames (blackdetect pix_th=0.10, confirmed frame by frame)
G0="0 28"; G1="157 199"; G2="596 1673"; G3="2101 2381"

$HFCLI render --fps 30 --crf 10 --variables '{"layer":"inserts"}' --skill hyperframes -o renders/inserts_full.mp4
$HFCLI render --fps 30 --format mov --variables '{"layer":"captions"}' --skill hyperframes -o renders/captions.mov

cut() { # $1 first frame, $2 last frame, $3 output
  ffmpeg -v error -y -i renders/inserts_full.mp4 -vf "select='between(n\,$1\,$2)',setpts=N/30/TB" -r 30 -an \
    -c:v libx264 -preset slow -crf 14 -pix_fmt yuv420p -movflags +faststart "$3"
}
cut $G0 "$OUT/insert_0_title.mp4"
cut $G1 "$OUT/insert_1.mp4"
cut $G2 "$OUT/insert_2.mp4"
cut $G3 "$OUT/insert_3.mp4"

# captions over the footage, then the title card and the inserts on exactly their frames
ffmpeg -v error -y -i "$SRC" -i renders/captions.mov -i renders/inserts_full.mp4 -filter_complex \
  "[0:v][1:v]overlay=0:0:format=auto[c];[c][2:v]overlay=0:0:enable='between(n,0,28)+between(n,157,199)+between(n,596,1673)+between(n,2101,2381)',format=yuv420p[v]" \
  -map "[v]" -map 0:a -c:a copy -c:v libx264 -preset slow -crf 14 -r 30 -movflags +faststart "$OUT/reel_final.mp4"

ffprobe -v error -show_entries stream=codec_type,nb_frames,duration -of compact "$OUT/reel_final.mp4"
