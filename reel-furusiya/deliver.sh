#!/usr/bin/env bash
# Reel 2 «دور المرأة الدركية في مجال الفروسية»: renders and assembles every delivery file.
#   output/furusiya/reel_furusiya_final.mp4        series intro + reel (inserts, captions, hashtag, avatar) + end tag
#   output/furusiya/reel_furusiya_final_share.mp4  the same, two-pass encoded under 30 MB
#   output/furusiya/insert_1.mp4 … insert_4.mp4     the four inserts alone (H.264, CRF 16, no audio), for CapCut
#   output/furusiya/intro_salam_slah_female.mp4, end_tag_furusiya.mp4  the intro and end tag as rendered
# Footage frames are untouched except for the captions and the hashtag/avatar overlay. The reel's audio samples are
# untouched (decoded and re-encoded once, because three parts are joined). The intro mix and the end-tag voice (female
# master, -14 LUFS) are lowered to the reel voice-over's loudness, so the voice level stays the same across both joins.
# Usage: ./deliver.sh   (needs hf/assets/media/reel.mp4, the original reel)
set -euo pipefail
cd "$(dirname "$0")"
HERE=$(pwd); ROOT=$(cd .. && pwd)
HFCLI="npx --yes hyperframes@0.8.211"
SRC=$HERE/hf/assets/media/reel.mp4
OUT=$ROOT/output/furusiya
INTRO_A=$ROOT/series-intro/hf/assets/audio/intro_mix.wav
TAG_A=$ROOT/end-tag/hf/assets/audio/tag_voice.wav
mkdir -p "$OUT" hf/renders "$ROOT/series-intro/hf/renders" "$ROOT/end-tag/hf/renders"
lufs() { ffmpeg -hide_banner -i "$1" -vn -af ebur128=framelog=quiet -f null - 2>&1 | awk '/^ +I:/{print $2}'; }

# 1. the reel's two layers: inserts (footage hidden) and captions (transparent); both carry the brand overlay
(cd hf && $HFCLI render --fps 30 --crf 10 --variables '{"layer":"inserts"}' --skill hyperframes -o renders/inserts_full.mp4)
(cd hf && $HFCLI render --fps 30 --format mov --variables '{"layer":"captions"}' --skill hyperframes -o renders/captions.mov)

# 2. series intro (female voice) and end tag (option 1), the tag opening on this reel's own last frame (F1997)
(cd "$ROOT/series-intro/hf" && $HFCLI render --fps 30 --crf 10 --skill hyperframes -o renders/intro_female.mp4)
ffmpeg -v error -y -i hf/renders/inserts_full.mp4 -vf "select=eq(n\,1997)" -frames:v 1 "$ROOT/end-tag/hf/assets/bridge_furusiya.png"
(cd "$ROOT/end-tag/hf" && $HFCLI render --fps 30 --crf 10 --variables '{"bridge":"assets/bridge_furusiya.png"}' --skill hyperframes -o renders/tag_furusiya.mp4)
cp "$ROOT/series-intro/hf/renders/intro_female.mp4" "$OUT/intro_salam_slah_female.mp4"
cp "$ROOT/end-tag/hf/renders/tag_furusiya.mp4" "$OUT/end_tag_furusiya.mp4"

# 3. the four inserts, cut from the inserts layer at the gap frames
cut() { ffmpeg -v error -y -i hf/renders/inserts_full.mp4 -vf "select='between(n\,$1\,$2)',setpts=N/30/TB" -r 30 -an \
  -c:v libx264 -preset slow -crf 16 -pix_fmt yuv420p -movflags +faststart "$OUT/$3"; }
cut 0 130 insert_1.mp4
cut 848 917 insert_2.mp4
cut 1100 1262 insert_3.mp4
cut 1388 1997 insert_4.mp4

# 4. final: intro + (footage + captions layer + inserts in the gaps) + end tag, one encode
VO=$(lufs "$SRC"); MASTER=$(lufs "$TAG_A")
GAIN=$(python3 -c "print(round($VO - $MASTER, 2))")
echo "reel voice-over $VO LUFS, female master $MASTER LUFS -> intro and end tag gain $GAIN dB"
GAPS="between(n,0,130)+between(n,848,917)+between(n,1100,1262)+between(n,1388,1997)"
ffmpeg -v error -y -i "$ROOT/series-intro/hf/renders/intro_female.mp4" -i "$SRC" -i hf/renders/captions.mov -i hf/renders/inserts_full.mp4 \
  -i "$ROOT/end-tag/hf/renders/tag_furusiya.mp4" -i "$INTRO_A" -i "$TAG_A" -filter_complex \
  "[1:v][2:v]overlay=0:0:format=auto[r1];[r1][3:v]overlay=0:0:enable='$GAPS'[rv];\
   [0:v]fps=30,format=yuv420p,setsar=1[v0];[rv]fps=30,format=yuv420p,setsar=1[v1];[4:v]fps=30,format=yuv420p,setsar=1[v2];\
   [v0][v1][v2]concat=n=3:v=1:a=0[v];\
   [5:a]aresample=44100:resampler=soxr,volume=${GAIN}dB,atrim=0:3.2,apad=whole_dur=3.2[a0];\
   [1:a]atrim=0:66.6,apad=whole_dur=66.6[a1];\
   [6:a]aresample=44100:resampler=soxr,volume=${GAIN}dB,atrim=0:2.7,apad=whole_dur=2.7[a2];\
   [a0][a1][a2]concat=n=3:v=0:a=1[a]" \
  -map "[v]" -map "[a]" -c:v libx264 -preset slow -crf 14 -pix_fmt yuv420p -r 30 \
  -c:a aac -b:a 320k -ar 44100 -movflags +faststart "$OUT/reel_furusiya_final.mp4"

# 5. share copy under 30 MB: two-pass at a bitrate that fits, same picture and sound
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT/reel_furusiya_final.mp4")
VB=$(python3 -c "print(int((28.5 * 8 * 1024 * 1024 / $D - 128000) / 1000))")
P=$(mktemp -d)
ffmpeg -v error -y -i "$OUT/reel_furusiya_final.mp4" -c:v libx264 -preset slow -b:v ${VB}k -pass 1 -passlogfile "$P/x" -an -f null /dev/null
ffmpeg -v error -y -i "$OUT/reel_furusiya_final.mp4" -c:v libx264 -preset slow -b:v ${VB}k -maxrate $((VB * 2))k -bufsize $((VB * 2))k -pass 2 -passlogfile "$P/x" \
  -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart "$OUT/reel_furusiya_final_share.mp4"
rm -rf "$P"

ls -l "$OUT"
for f in reel_furusiya_final.mp4 reel_furusiya_final_share.mp4; do
  ffprobe -v error -count_frames -show_entries stream=codec_name,width,height,r_frame_rate,nb_read_frames:format=duration -of compact "$OUT/$f"
done
