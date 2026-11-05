"""MMS_FA forced alignment of the reference script (one word per token) against the reel's voice-over.
Run: <venv>/bin/python -I align_script.py <vo16k.wav> <script.txt> <out.json>
Writes start/end per word (seconds) and the mean token score; a low score flags a word that may not match the audio."""
import json, re, sys
import soundfile as sf
import torch, torchaudio
import uroman as ur
from torchaudio.pipelines import MMS_FA as bundle

wav_path, script_path, out_path = sys.argv[1:4]
words = open(script_path, encoding="utf-8").read().split()
U = ur.Uroman()
dic = bundle.get_dict()


def toks(s):
    r = re.sub(r"[^a-z' ]", "", U.romanize_string(s).lower()).replace(" ", "")
    return [c for c in r if c in dic] or ["a"]


T = [toks(w) for w in words]
model = bundle.get_model(with_star=False).eval()
data, sr = sf.read(wav_path, dtype="float32")
wav = torch.from_numpy(data).unsqueeze(0)
if sr != bundle.sample_rate:
    wav = torchaudio.functional.resample(wav, sr, bundle.sample_rate)
with torch.inference_mode():
    em, _ = model(wav)
    em = torch.log_softmax(em, dim=-1)
flat = [dic[c] for t in T for c in t]
ali, scores = torchaudio.functional.forced_align(em, torch.tensor([flat], dtype=torch.int32), blank=0)
spans = torchaudio.functional.merge_tokens(ali[0], scores[0].exp())
ratio = wav.shape[1] / em.shape[1] / bundle.sample_rate
out, k = [], 0
for i, t in enumerate(T):
    sp = spans[k:k + len(t)]
    k += len(t)
    out.append({"i": i, "text": words[i], "start": round(sp[0].start * ratio, 3), "end": round(sp[-1].end * ratio, 3),
                "score": round(sum(x.score for x in sp) / len(sp), 2)})
json.dump(out, open(out_path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
for o in out:
    print(o["i"], "%6.3f %6.3f" % (o["start"], o["end"]), "F%d" % round(o["start"] * 30), o["score"], o["text"])
