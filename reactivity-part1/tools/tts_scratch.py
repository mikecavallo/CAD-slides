"""Generate a SCRATCH narration track (AI voice) one clip per beat.

Only used to time the visuals and to preview pacing. The final video uses the trainer's own
recordings (see tools/align.py). Clips are cached by text, so re-running only renders changed beats.

    python3 tools/tts_scratch.py [--voice af_heart] [--speed 0.92]
"""
import argparse
import hashlib
import json
import sys

import soundfile as sf

import numpy as np

from common import AUDIO, PAUSE_RE, PAUSE_SEC, load_script, iter_scenes

MODEL_DIR = "/opt/tts"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--voice", default="af_heart")
    ap.add_argument("--speed", type=float, default=0.92)
    args = ap.parse_args()

    from kokoro_onnx import Kokoro
    k = Kokoro(f"{MODEL_DIR}/kokoro-v1.0.onnx", f"{MODEL_DIR}/voices-v1.0.bin")

    out = AUDIO / "scratch"
    out.mkdir(parents=True, exist_ok=True)
    manifest = {}
    script = load_script()
    for ch, sc in iter_scenes(script):
        for i, b in enumerate(sc["beats"]):
            text = b["say"].strip()
            key = hashlib.sha1(f"{args.voice}|{args.speed}|{text}".encode()).hexdigest()[:12]
            path = out / f"{sc['id']}_{i:02d}_{key}.wav"
            if not path.exists():
                # [pause] markers become real silence, so the preview shows the pause
                parts, sr = [], 24000
                for j, piece in enumerate(p.strip() for p in PAUSE_RE.split(text)):
                    if j:
                        parts.append(np.zeros(int(PAUSE_SEC * sr), dtype=np.float32))
                    if piece:
                        a, sr = k.create(piece, voice=args.voice, speed=args.speed, lang="en-us")
                        parts.append(np.asarray(a, dtype=np.float32))
                samples = np.concatenate(parts)
                sf.write(path, samples, sr)
                print(f"  tts {path.name}  {len(samples) / sr:.2f}s", flush=True)
            info = sf.info(path)
            manifest[f"{sc['id']}:{i}"] = {"file": str(path.relative_to(AUDIO.parent.parent)), "dur": info.frames / info.samplerate, "sr": info.samplerate}
    (AUDIO / "scratch_manifest.json").write_text(json.dumps(manifest, indent=1))
    total = sum(v["dur"] for v in manifest.values())
    print(f"scratch voice: {len(manifest)} beats, {total / 60:.1f} min of speech")


if __name__ == "__main__":
    sys.exit(main())
