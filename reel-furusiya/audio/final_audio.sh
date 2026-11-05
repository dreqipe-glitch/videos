#!/usr/bin/env bash
# Reel 2 final audio and mux (the video stream of reel_furusiya_final.mp4 is copied, never re-encoded).
#   intro_mix.wav (female master, as delivered) + reel voice-over brought to -14 LUFS + tag_voice.wav (as delivered)
#   voice-over: light noise reduction, gain, transparent true-peak limiter (vo_master.py; timing unchanged)
#   whole film: -14 LUFS integrated, true peak <= -1 dBTP, checked after AAC encoding
# Then the share copy under 30 MB. Usage: PY=<python with numpy, scipy, soundfile> ./final_audio.sh
set -euo pipefail
cd "$(dirname "$0")"
R=$(cd .. && pwd); ROOT=$(cd ../.. && pwd)
PY=${PY:-python3}
SRC=$R/hf/assets/media/reel.mp4
OUT=$ROOT/output/furusiya
FINAL=$OUT/reel_furusiya_final.mp4
W=$(mktemp -d)
meas() { ffmpeg -hide_banner -i "$1" -vn -af ebur128=peak=true:framelog=quiet -f null - 2>&1 | awk '/^ +I:/{i=$2} /^ +Peak:/{p=$2} END{print i, p}'; }

ffmpeg -v error -y -i "$SRC" -vn -c:a pcm_f32le "$W/vo_src.wav"
$PY -I vo_master.py nr "$W/vo_src.wav" "$W/vo_nr.wav"
read -r I _ < <(meas "$W/vo_nr.wav")
G=$(python3 -c "print(round(-13.9 - $I, 2))")  # 0.1 dB over the target makes up what the limiter takes off
echo "voice-over after noise reduction: $I LUFS -> gain $G dB"
$PY -I vo_master.py level "$W/vo_nr.wav" "$W/vo_final.wav" "$G"

ffmpeg -v error -y -i "$ROOT/series-intro/hf/assets/audio/intro_mix.wav" -i "$W/vo_final.wav" -i "$ROOT/end-tag/hf/assets/audio/tag_voice.wav" -filter_complex \
  "[0:a]aresample=44100:resampler=soxr,atrim=0:3.2,apad=whole_dur=3.2[a0];[1:a]atrim=0:66.6,apad=whole_dur=66.6[a1];\
   [2:a]aresample=44100:resampler=soxr,atrim=0:2.7,apad=whole_dur=2.7[a2];[a0][a1][a2]concat=n=3:v=0:a=1" -c:a pcm_f32le "$W/film.wav"
echo "film mix (I, TP): $(meas "$W/film.wav")"

ffmpeg -v error -y -i "$FINAL" -i "$W/film.wav" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k -ar 44100 -movflags +faststart "$W/final.mp4"
read -r I TP < <(meas "$W/final.mp4")
echo "final after AAC (I, TP): $I $TP"
python3 -c "import sys; sys.exit(0 if $TP <= -1.0 else 'true peak $TP dBTP is above -1 after encoding')"
mv "$W/final.mp4" "$FINAL"

# share copy under 30 MB: two-pass video at a bitrate that fits, AAC 128 kbit/s from the same mix
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$FINAL")
VB=$(python3 -c "print(int((28.5 * 8 * 1024 * 1024 / $D - 128000) / 1000))")
ffmpeg -v error -y -i "$FINAL" -c:v libx264 -preset slow -b:v ${VB}k -pass 1 -passlogfile "$W/x" -an -f null /dev/null
ffmpeg -v error -y -i "$FINAL" -i "$W/film.wav" -map 0:v -map 1:a -c:v libx264 -preset slow -b:v ${VB}k -maxrate $((VB * 2))k -bufsize $((VB * 2))k \
  -pass 2 -passlogfile "$W/x" -pix_fmt yuv420p -c:a aac -b:a 128k -ar 44100 -movflags +faststart "$OUT/reel_furusiya_final_share.mp4"
echo "share (I, TP): $(meas "$OUT/reel_furusiya_final_share.mp4")"
rm -rf "$W"
ls -l "$FINAL" "$OUT/reel_furusiya_final_share.mp4"
