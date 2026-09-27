"""Stitch the scratch AI-voice clips into one "recording" per chapter, with natural pauses.

The preview then runs through exactly the same path as the trainer's real recordings:
    python3 tools/scratch_narration.py && python3 tools/align.py --dir build/scratch_narration && python3 tools/timing.py --mode narration
"""
import json

import numpy as np
import soundfile as sf

from common import AUDIO, BUILD, ROOT, load_script

PAUSE_BEAT, PAUSE_SCENE, LEAD_IN, TAIL = 0.45, 0.9, 0.6, 0.8


def main():
    man = json.loads((AUDIO / "scratch_manifest.json").read_text())
    out = BUILD / "scratch_narration"
    out.mkdir(parents=True, exist_ok=True)
    for ch in load_script()["chapters"]:
        parts, sr = [], None
        for si, sc in enumerate(ch["scenes"]):
            for i, _ in enumerate(sc["beats"]):
                a, sr = sf.read(ROOT / man[f"{sc['id']}:{i}"]["file"], dtype="float32")
                if not parts:
                    parts.append(np.zeros(int(sr * LEAD_IN), np.float32))
                elif i == 0:
                    parts.append(np.zeros(int(sr * PAUSE_SCENE), np.float32))
                else:
                    parts.append(np.zeros(int(sr * PAUSE_BEAT), np.float32))
                parts.append(a)
        parts.append(np.zeros(int(sr * TAIL), np.float32))
        sf.write(out / f"{ch['id']}.wav", np.concatenate(parts), sr)
    print(f"scratch recordings written to {out.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
