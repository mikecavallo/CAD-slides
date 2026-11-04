"""Narrate a lesson with an ElevenLabs voice (the trainer's cloned voice), one "recording" per slide.

The output is a folder of per-slide takes named by scene id, so the build treats them exactly like real recordings:

    LESSON=lesson-mechanics.json python3 tools/tts_elevenlabs.py
    LESSON=lesson-mechanics.json python3 tools/align.py --dir build/eleven_narration
    LESSON=lesson-mechanics.json python3 tools/timing.py --mode narration
    node tools/render.mjs --workers 3 && LESSON=lesson-mechanics.json python3 tools/assemble.py --name NAME

Setup: the API key comes from the environment (ELEVENLABS_API_KEY, or a network secret the proxy adds for
api.elevenlabs.io; never commit it).
The voice is --voice, else ELEVENLABS_VOICE_ID, else the lesson's series "voice" field, else the one voice on the
account whose name contains "Tori". `--list-voices` shows the account's voices; `--dry-run` shows how many characters
(credits) a run would use without calling the API.

Each beat is generated separately and cached by voice, model, settings and text (build/audio/eleven/), so after a
script edit only the changed beats are paid for. The neighbouring beats are sent as context so the delivery flows.
[pause] markers become real silence, as in the scratch voice.

The trainer's own recordings win: a slide with a take in narration/ (Ch01s05.m4a, Ch01s07_part_1.m4a, ...) is not
generated; its take is copied into the output folder instead, so one build mixes real takes and the clone.
--all-clone ignores the recordings. Default model: eleven_v4 (Tori chose it over multilingual_v2 on Nov 4).
"""
import argparse
import hashlib
import re
import shutil
import json
import os
import subprocess
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

import numpy as np
import soundfile as sf

from common import AUDIO, BUILD, PAUSE_RE, PAUSE_SEC, ROOT, iter_scenes, load_script

API = "https://api.elevenlabs.io/v1"
SR = 44100
LEAD_IN, PAUSE_BEAT, TAIL = 0.3, 0.45, 0.5
AUDIO_EXT = {".wav", ".m4a", ".mp3", ".aac", ".flac", ".ogg", ".mov", ".mp4", ".aiff", ".aif", ".webm", ".opus"}


def takes_for(folder, sid):
    """The trainer's recording(s) of one slide in folder: ch01s05.m4a, or pieces like Ch01s07_part_1 / ch01s07 part 2."""
    if not folder.is_dir():
        return []
    pat = re.compile(rf"^{re.escape(sid)}(?:[ _-]*part[ _-]*\d+)?$", re.I)
    return sorted(p for p in folder.iterdir() if p.suffix.lower() in AUDIO_EXT and pat.match(p.stem))


def call(path, key, body=None, accept="application/json", tries=5):
    """GET (body None) or POST JSON; retries rate limits and server errors. Returns the raw response bytes."""
    data = json.dumps(body).encode() if body is not None else None
    for n in range(tries):
        headers = {"Content-Type": "application/json", "Accept": accept}
        if key:  # without it, a network secret for api.elevenlabs.io may add the key on the way out
            headers["xi-api-key"] = key
        req = urllib.request.Request(API + path, data=data, method="POST" if data else "GET", headers=headers)
        try:
            with urllib.request.urlopen(req, timeout=180) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            msg = e.read().decode(errors="replace")[:400]
            if e.code in (429, 500, 502, 503, 504) and n < tries - 1:
                time.sleep(2 ** (n + 1))
                continue
            hint = " (check the API key: ELEVENLABS_API_KEY or the environment's network secret)" if e.code in (401, 403) else ""
            sys.exit(f"ElevenLabs {e.code} on {path.split('?')[0]}{hint}: {msg}")
        except urllib.error.URLError as e:
            if n < tries - 1:
                time.sleep(2 ** (n + 1))
                continue
            sys.exit(f"ElevenLabs unreachable: {e.reason}")


def voices(key):
    return json.loads(call("/voices", key))["voices"]


def pick_voice(args, key, script):
    v = args.voice or os.environ.get("ELEVENLABS_VOICE_ID") or (script.get("series") or {}).get("voice")
    if v:
        return v
    mine = [x for x in voices(key) if "tori" in x["name"].lower()]
    if len(mine) == 1:
        print(f"voice: {mine[0]['name']} ({mine[0]['voice_id']})")
        return mine[0]["voice_id"]
    sys.exit("Pick the voice with --voice ID (see --list-voices): " + (", ".join(x["name"] for x in mine) or "no voice named Tori"))


def pieces(text):
    """A beat split at its [pause] markers (empty pieces kept, so indexes stay stable)."""
    return [p.strip() for p in PAUSE_RE.split(text.strip())]


def clip_path(cache, sid, i, j, voice, model, settings, piece):
    tag = json.dumps([voice, model, settings, piece], sort_keys=True)
    return cache / f"{sid}_{i:02d}_{j}_{hashlib.sha1(tag.encode()).hexdigest()[:12]}.mp3"


def to_samples(mp3):
    """Decode the API's MP3 to mono float32 at SR."""
    r = subprocess.run(["ffmpeg", "-v", "error", "-i", "pipe:0", "-f", "f32le", "-ac", "1", "-ar", str(SR), "pipe:1"],
                       input=mp3, capture_output=True, check=True)
    return np.frombuffer(r.stdout, dtype=np.float32)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--voice", help="ElevenLabs voice id")
    ap.add_argument("--model", default="eleven_v4")
    ap.add_argument("--stability", type=float, default=0.5)
    ap.add_argument("--similarity", type=float, default=0.8)
    ap.add_argument("--style", type=float, default=0.0)
    ap.add_argument("--speed", type=float, default=1.0, help="0.7 to 1.2")
    ap.add_argument("--only", help="comma-separated scene ids")
    ap.add_argument("--out", default=str(BUILD / "eleven_narration"))
    ap.add_argument("--recordings", default=str(ROOT / "narration"), help="the trainer's own takes, used instead of the clone")
    ap.add_argument("--all-clone", action="store_true", help="ignore the trainer's recordings")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--list-voices", action="store_true")
    args = ap.parse_args()

    key = os.environ.get("ELEVENLABS_API_KEY", "").strip()
    if not key and not args.dry_run:
        print("ELEVENLABS_API_KEY is not set; trying the environment's network secret for api.elevenlabs.io")
    if args.list_voices:
        for x in voices(key):
            print(f"{x['voice_id']}  {x['name']}  ({x.get('category', '')})")
        return

    script = load_script()
    only = set(args.only.split(",")) if args.only else None
    settings = {"stability": args.stability, "similarity_boost": args.similarity, "style": args.style,
                "use_speaker_boost": True, "speed": args.speed}
    voice = pick_voice(args, key, script) if not args.dry_run else (args.voice or "VOICE")
    cache = AUDIO / "eleven"
    cache.mkdir(parents=True, exist_ok=True)
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)

    scenes = [sc for _, sc in iter_scenes(script) if not only or sc["id"] in only]
    recorded = {} if args.all_clone else {sc["id"]: t for sc in scenes if (t := takes_for(Path(args.recordings), sc["id"]))}
    todo, chars = [], 0
    for sc in scenes:
        if sc["id"] in recorded:
            continue
        says = [b["say"].strip() for b in sc["beats"]]
        for i, text in enumerate(says):
            for j, piece in enumerate(pieces(text)):
                if not piece:
                    continue
                path = clip_path(cache, sc["id"], i, j, voice, args.model, settings, piece)
                if not path.exists():
                    todo.append((path, piece, says[i - 1] if i else "", says[i + 1] if i + 1 < len(says) else ""))
                    chars += len(piece)
    print(f"{len(scenes)} slides ({len(recorded)} with the trainer's own takes); {len(todo)} beats to generate, "
          f"about {chars:,} characters (credits)")
    if args.dry_run:
        return

    for k, (path, piece, prev, nxt) in enumerate(todo, 1):
        body = {"text": piece, "model_id": args.model, "voice_settings": settings}
        if prev:
            body["previous_text"] = PAUSE_RE.sub(" ", prev)
        if nxt:
            body["next_text"] = PAUSE_RE.sub(" ", nxt)
        path.write_bytes(call(f"/text-to-speech/{voice}?output_format=mp3_44100_128", key, body, accept="audio/mpeg"))
        print(f"  [{k}/{len(todo)}] {path.name}", flush=True)

    # one take per slide: lead-in, beats with a short breath between them, [pause] silences, tail
    for sc in scenes:
        for old in takes_for(out, sc["id"]):  # a slide's earlier take (clone or real) must not linger beside the new one
            old.unlink()
        if sc["id"] in recorded:
            for t in recorded[sc["id"]]:
                shutil.copy2(t, out / t.name)
            continue
        parts = [np.zeros(int(SR * LEAD_IN), np.float32)]
        for i, b in enumerate(sc["beats"]):
            if i:
                parts.append(np.zeros(int(SR * PAUSE_BEAT), np.float32))
            for j, piece in enumerate(pieces(b["say"])):
                if j:
                    parts.append(np.zeros(int(SR * PAUSE_SEC), np.float32))
                if piece:
                    parts.append(to_samples(clip_path(cache, sc["id"], i, j, voice, args.model, settings, piece).read_bytes()))
        parts.append(np.zeros(int(SR * TAIL), np.float32))
        sf.write(out / f"{sc['id']}.wav", np.concatenate(parts), SR)
    print(f"takes written to {out.relative_to(ROOT) if out.is_relative_to(ROOT) else out}; next: align.py --dir {out}")


if __name__ == "__main__":
    sys.exit(main())
