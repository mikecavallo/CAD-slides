"""A short review video of only the slides that changed, cut from the finished video.

    python3 tools/changes_reel.py --video out/NAME.mp4 --ids tm01s02,tm01s04 --out out/NAME-changes.mp4

Each part carries a small label at the top left with its slide title and where it sits in the full video, so feedback
timestamps can still be given against the full video.
"""
import argparse
import json
import subprocess
import tempfile
from pathlib import Path

from common import BUILD

FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"


def ts(sec):
    return f"{int(sec // 60)}:{int(sec % 60):02d}"


def esc(s):
    return s.replace("\\", "\\\\").replace(":", "\\:").replace("'", "’").replace("%", "\\%")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--video", required=True)
    ap.add_argument("--ids", required=True, help="comma-separated segment ids, in any order (they play in video order)")
    ap.add_argument("--out", required=True)
    args = ap.parse_args()
    timing = json.loads((BUILD / "timing.json").read_text())
    want = set(args.ids.split(","))
    segs = [s for s in timing["segments"] if s["id"] in want]
    missing = want - {s["id"] for s in segs}
    if missing:
        raise SystemExit(f"unknown ids: {', '.join(sorted(missing))}")
    tmp = Path(tempfile.mkdtemp())
    parts = []
    for i, s in enumerate(segs):
        label = esc(f"{s.get('heading') or s.get('chapterTitle', '')}   (full video {ts(s['start'])})")
        part = tmp / f"p{i:02d}.mp4"
        vf = (f"drawtext=fontfile={FONT}:text='{label}':x=24:y=20:fontsize=26:fontcolor=white:"
              f"box=1:boxcolor=0x2c4a17@0.85:boxborderw=12")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{s['start']:.3f}", "-i", args.video, "-t", f"{s['dur']:.3f}",
                        "-vf", vf, "-c:v", "libx264", "-crf", "24", "-preset", "medium", "-c:a", "aac", "-b:a", "128k",
                        "-ar", "48000", "-ac", "2", str(part)], check=True)
        parts.append(part)
    lst = tmp / "list.txt"
    lst.write_text("".join(f"file '{p}'\n" for p in parts))
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(lst), "-c", "copy",
                    "-movflags", "+faststart", args.out], check=True)
    total = sum(s["dur"] for s in segs)
    print(f"changes reel: {len(segs)} slides, {total / 60:.1f} min -> {args.out}")


if __name__ == "__main__":
    main()
