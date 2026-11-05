#!/usr/bin/env bash
# Reel 2 «دور المرأة الدركية في مجال الفروسية»: renders and assembles every delivery file.
#   output/furusiya/reel_furusiya_final.mp4        series intro + reel (inserts, captions, hashtag, avatar) + end tag
#   output/furusiya/reel_furusiya_final_share.mp4  the same, two-pass encoded under 30 MB
#   output/furusiya/insert_1.mp4 … insert_4.mp4     the four inserts alone (H.264, CRF 16, no audio), for CapCut
#   output/furusiya/intro_salam_slah_female.mp4, end_tag_furusiya.mp4  the intro and end tag as rendered
# Footage frames are untouched except for the captions and the hashtag/avatar overlay. Audio (audio/final_audio.sh):
# intro and end tag at their master level, the reel voice-over brought up to them; whole film -14 LUFS, <= -1 dBTP.
# Usage: PY=<python with numpy, scipy, soundfile> ./deliver.sh   (needs hf/assets/media/reel.mp4, the original reel)
#        SKIP_RENDER=1 reuses the HyperFrames renders and redoes only the cuts, the join and the audio.
set -euo pipefail
cd "$(dirname "$0")"
HERE=$(pwd); ROOT=$(cd .. && pwd)
HFCLI="npx --yes hyperframes@0.8.211"
SRC=$HERE/hf/assets/media/reel.mp4
OUT=$ROOT/output/furusiya
mkdir -p "$OUT" hf/renders "$ROOT/series-intro/hf/renders" "$ROOT/end-tag/hf/renders"

if [ "${SKIP_RENDER:-0}" != 1 ]; then
# 1. the reel's two layers: inserts (footage hidden) and captions (transparent); both carry the brand overlay
(cd hf && $HFCLI render --fps 30 --crf 10 --variables '{"layer":"inserts"}' --skill hyperframes -o renders/inserts_full.mp4)
(cd hf && $HFCLI render --fps 30 --format mov --variables '{"layer":"captions"}' --skill hyperframes -o renders/captions.mov)

# 2. series intro (female voice) and end tag (option 1), the tag opening on this reel's own last frame (F1997)
(cd "$ROOT/series-intro/hf" && $HFCLI render --fps 30 --crf 10 --skill hyperframes -o renders/intro_female.mp4)
ffmpeg -v error -y -i hf/renders/inserts_full.mp4 -vf "select=eq(n\,1997)" -frames:v 1 "$ROOT/end-tag/hf/assets/bridge_furusiya.png"
(cd "$ROOT/end-tag/hf" && $HFCLI render --fps 30 --crf 10 --variables '{"bridge":"assets/bridge_furusiya.png"}' --skill hyperframes -o renders/tag_furusiya.mp4)
cp "$ROOT/series-intro/hf/renders/intro_female.mp4" "$OUT/intro_salam_slah_female.mp4"
cp "$ROOT/end-tag/hf/renders/tag_furusiya.mp4" "$OUT/end_tag_furusiya.mp4"
fi

# 3. the four inserts, cut from the inserts layer at the gap frames
cut() { ffmpeg -v error -y -i hf/renders/inserts_full.mp4 -vf "select='between(n\,$1\,$2)',setpts=N/30/TB" -r 30 -an \
  -c:v libx264 -preset slow -crf 16 -pix_fmt yuv420p -movflags +faststart "$OUT/$3"; }
cut 0 130 insert_1.mp4
cut 848 917 insert_2.mp4
cut 1100 1262 insert_3.mp4
cut 1388 1997 insert_4.mp4

# 4. final picture: intro + (footage + captions layer + inserts in the gaps) + end tag, one encode, no audio yet.
# Frames are renumbered (setpts) rather than resampled, so all 96 + 1998 + 81 frames are kept.
GAPS="between(n,0,130)+between(n,848,917)+between(n,1100,1262)+between(n,1388,1997)"
ffmpeg -v error -y -i "$ROOT/series-intro/hf/renders/intro_female.mp4" -i "$SRC" -i hf/renders/captions.mov -i hf/renders/inserts_full.mp4 \
  -i "$ROOT/end-tag/hf/renders/tag_furusiya.mp4" -filter_complex \
  "[1:v][2:v]overlay=0:0:format=auto:eof_action=pass[r1];[r1][3:v]overlay=0:0:enable='$GAPS':eof_action=pass,trim=end_frame=1998[rv];\
   [0:v]setpts=N/30/TB,format=yuv420p,setsar=1[v0];[rv]setpts=N/30/TB,format=yuv420p,setsar=1[v1];[4:v]setpts=N/30/TB,format=yuv420p,setsar=1[v2];\
   [v0][v1][v2]concat=n=3:v=1:a=0,setpts=N/30/TB[v]" \
  -map "[v]" -an -c:v libx264 -preset slow -crf 14 -pix_fmt yuv420p -r 30 -movflags +faststart "$OUT/reel_furusiya_final.mp4"

# 5. the audio (voice-over to -14 LUFS, intro and end tag at master level), muxed onto that picture, and the share copy
(cd audio && ./final_audio.sh)

ls -l "$OUT"
for f in reel_furusiya_final.mp4 reel_furusiya_final_share.mp4; do
  ffprobe -v error -count_frames -show_entries stream=codec_name,width,height,r_frame_rate,nb_read_frames:format=duration -of compact "$OUT/$f"
done
