"""Shared paths and helpers for the video build tools."""
import json
import os
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
# which video to build: LESSON=lesson-ch2.json python3 tools/... (default: the Chapter 1 video)
SCRIPT = ROOT / "script" / os.environ.get("LESSON", "lesson.json")
LESSON_TAG = "" if SCRIPT.name == "lesson.json" else "-" + SCRIPT.stem.replace("lesson-", "")  # e.g. "-ch2", for file names
BUILD = ROOT / "build"
AUDIO = BUILD / "audio"
NARRATION_DIR = ROOT / "narration"  # the trainer's recordings go here: ch00.wav, ch01.m4a, ...
CLIPS_DIR = ROOT / "clips"  # the trainer's own videos for video slides, named by scene id: tm01s04.mp4 (gitignored)
CLIP_EXT = (".mp4", ".mov", ".m4v", ".webm", ".mkv", ".avi")
FPS = 30

# pacing (seconds)
LEAD = 0.7          # scene starts this long before its first beat
GAP = 0.45          # silence between beats (scratch voice)
SCENE_GAP = 0.35    # extra breath between scenes (scratch voice)
TAIL = 3.0          # hold after the last beat of a chapter (room for the logo close)
HOLD = 1.6          # narration mode: minimum time from a scene's last word to its cut. The trainer's own pause counts;
                    # silence is only added when her pause is shorter, so deliberate pauses play exactly as recorded
BUMPER = 2.8        # chapter title card length


def load_script():
    return json.loads(SCRIPT.read_text())


def words(s):
    return re.findall(r"[A-Za-z0-9']+", spoken(s))


# "[pause]" in a beat's text marks a deliberate pause: shown in the doc and the script PDF, silent in the
# preview voice, and ignored when matching the trainer's recording (her own pause is what plays).
PAUSE_RE = re.compile(r"\s*\[pause\]\s*", re.I)
PAUSE_SEC = 1.5


def spoken(s):
    """The words actually said: the text without [pause] markers."""
    return re.sub(r"\s+", " ", PAUSE_RE.sub(" ", s)).strip()


def chapter_num(ch_id):
    d = re.sub(r"\D", "", ch_id)
    return int(d) if d else 0  # a standalone video has no chapter number (the footer tab stays empty)


def iter_scenes(script):
    for ch in script["chapters"]:
        for sc in ch["scenes"]:
            yield ch, sc


def find_clip(scene_id):
    """The trainer's video for a video slide: clips/<scene id>.<ext>, case does not matter. None until it is added."""
    if not CLIPS_DIR.is_dir():
        return None
    for f in sorted(CLIPS_DIR.iterdir()):
        if f.suffix.lower() in CLIP_EXT and f.stem.lower() == scene_id.lower():
            return f
    return None


def media_dur(path):
    import subprocess
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)], capture_output=True, text=True, check=True).stdout
    return float(out.strip())
