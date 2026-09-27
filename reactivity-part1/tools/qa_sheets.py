"""Contact sheets sampled from the RENDERED segments, for reviewing motion, transitions and timing.

    python3 tools/qa_sheets.py [--every 1.5] [--only ch03s02,ch03s03]

Writes build/qa/<segment>_<k>.jpg (4x3 tiles of 480x270, each stamped with its scene time) and
build/qa/<segment>.txt listing when each beat starts and what is being said.
"""
import argparse
import json
import subprocess

from common import BUILD

FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--every", type=float, default=1.5)
    ap.add_argument("--only")
    args = ap.parse_args()
    timing = json.loads((BUILD / "timing.json").read_text())
    out = BUILD / "qa"
    out.mkdir(exist_ok=True)
    only = set(args.only.split(",")) if args.only else None
    for seg in timing["segments"]:
        if seg["kind"] != "scene" or (only and seg["id"] not in only):
            continue
        src = BUILD / "segments" / f"{seg['id']}.mp4"
        if not src.exists():
            print("missing", src.name)
            continue
        for old in out.glob(f"{seg['id']}_*.jpg"):
            old.unlink()
        vf = (f"fps=1/{args.every},scale=480:270,"
              f"drawtext=fontfile={FONT}:text='%{{pts\\:hms}}':x=6:y=6:fontsize=18:fontcolor=white:box=1:boxcolor=black@0.6:boxborderw=4,"
              f"tile=4x3:padding=4:color=white")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(src), "-vf", vf, "-q:v", "4", str(out / f"{seg['id']}_%02d.jpg")], check=True)
        lines = [f"{seg['id']}  duration {seg['dur']:.1f}s  (sheets every {args.every}s, 12 frames per sheet, read left to right)"]
        for i, b in enumerate(seg["beats"]):
            lines.append(f"  beat {i + 1} starts {b['t']:.1f}s, ends {b['end']:.1f}s: {b['say']}")
            if b.get("onscreen"):
                lines.append(f"      on-screen text: {b['onscreen']}")
        (out / f"{seg['id']}.txt").write_text("\n".join(lines) + "\n")
        print(seg["id"], len(list(out.glob(f"{seg['id']}_*.jpg"))), "sheets")


if __name__ == "__main__":
    main()
