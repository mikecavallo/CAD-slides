"""Shared paths and helpers for the video build tools."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCRIPT = ROOT / "script" / "lesson.json"
BUILD = ROOT / "build"
AUDIO = BUILD / "audio"
NARRATION_DIR = ROOT / "narration"  # the trainer's recordings go here: ch00.wav, ch01.m4a, ...
FPS = 30

# pacing (seconds)
LEAD = 0.7          # scene starts this long before its first beat
GAP = 0.45          # silence between beats (scratch voice)
SCENE_GAP = 0.35    # extra breath between scenes (scratch voice)
TAIL = 3.0          # hold after the last beat of a chapter (room for the logo close)
HOLD = 1.2          # narration mode: silent hold added after each scene so its last visual can land and be read
BUMPER = 2.8        # chapter title card length


def load_script():
    return json.loads(SCRIPT.read_text())


def words(s):
    return re.findall(r"[A-Za-z0-9']+", s)


def chapter_num(ch_id):
    return int(re.sub(r"\D", "", ch_id))


def iter_scenes(script):
    for ch in script["chapters"]:
        for sc in ch["scenes"]:
            yield ch, sc
