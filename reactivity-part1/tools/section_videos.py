"""Cut a finished lesson video into one video per section (chapter), with matching captions.

    LESSON=lesson-management2.json python3 tools/section_videos.py --video out/NAME.mp4 --prefix Management-Solutions-and-Setups

Each section starts at its first segment (the Part card for every section after the welcome, so the chime opens it) and
ends where the next section's card starts; the last one runs to the end (logo close). Cuts are frame-accurate (the video
is re-encoded at the master's quality, CRF 18), the audio eases out over its last 0.3 s, and the master's .srt is
shifted into one .srt per section. Writes out/sections/<prefix>-NN-<Title>.mp4 and .srt. Uses build/timing.json, so
run it right after the build of the same lesson.

Thumbnails (lesson cards): Tori wants each to look exactly like the video, not a designed card, so each section's
thumbnail is the frame of its opening slide (the Part card, or the title slide for the welcome) at 2.4 s, taken from the
rendered segment in build/segments, 1280x720 JPEG quality 94: <prefix>-NN-<Title>.jpg. --cards-only skips the videos.
"""
import argparse
import io
import json
import re
import subprocess
from pathlib import Path

from PIL import Image

from common import BUILD, ROOT


def ts(sec):
    ms = max(0, int(round(sec * 1000)))
    h, ms = divmod(ms, 3600000)
    m, ms = divmod(ms, 60000)
    s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def parse_srt(path):
    out = []
    for block in re.split(r"\n\s*\n", path.read_text(encoding="utf-8").strip()):
        lines = block.strip().splitlines()
        if len(lines) < 2 or "-->" not in lines[1]:
            continue
        a, b = (sum(float(x) * f for x, f in zip(t.strip().replace(",", ".").split(":"), (3600, 60, 1))) for t in lines[1].split("-->"))
        out.append((a, b, "\n".join(lines[2:])))
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--video", required=True)
    ap.add_argument("--prefix", required=True, help="file name prefix, e.g. the course title with dashes")
    ap.add_argument("--out", default=str(ROOT / "out" / "sections"))
    ap.add_argument("--only", help="comma-separated section numbers")
    ap.add_argument("--cards-only", action="store_true", help="only the thumbnails")
    ap.add_argument("--card-at", type=float, default=2.4, help="seconds into the opening slide (default 2.4)")
    args = ap.parse_args()

    timing = json.loads((BUILD / "timing.json").read_text())
    segs, total = timing["segments"], timing["total"]
    sections = []
    for s in segs:
        if not sections or sections[-1]["chapter"] != s["chapter"]:
            sections.append({"chapter": s["chapter"], "num": s["chapterNum"], "title": s["chapterTitle"], "start": s["start"], "first": s["id"]})
    for i, c in enumerate(sections):
        c["end"] = sections[i + 1]["start"] if i + 1 < len(sections) else total

    video = Path(args.video)
    srt = video.with_suffix(".srt")
    cues = parse_srt(srt) if srt.exists() else []
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    only = {int(x) for x in args.only.split(",")} if args.only else None
    for c in sections:
        if only is not None and c["num"] not in only:
            continue
        slug = re.sub(r"[^A-Za-z0-9]+", "-", c["title"].replace("&", "and")).strip("-")
        dest = out / f"{args.prefix}-{c['num']:02d}-{slug}.mp4"
        dur = c["end"] - c["start"]
        card = dest.with_suffix(".jpg")
        raw = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{args.card_at:.2f}", "-i", str(BUILD / "segments" / f"{c['first']}.mp4"),
                              "-frames:v", "1", "-vf", "scale=1280:720:flags=lanczos", "-f", "image2pipe", "-vcodec", "png", "-"],
                             capture_output=True, check=True).stdout
        Image.open(io.BytesIO(raw)).convert("RGB").save(card, quality=94)
        if args.cards_only:
            print(f"{card.name}", flush=True)
            continue
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{c['start']:.3f}", "-i", str(video), "-t", f"{dur:.3f}",
                        "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-tune", "animation", "-pix_fmt", "yuv420p", "-r", "30",
                        "-af", f"afade=t=out:st={max(0, dur - 0.3):.3f}:d=0.3", "-c:a", "aac", "-b:a", "192k",
                        "-movflags", "+faststart", str(dest)], check=True)
        mine = [(max(a, c["start"]) - c["start"], min(b, c["end"]) - c["start"], t) for a, b, t in cues if b > c["start"] + 0.05 and a < c["end"] - 0.05]
        if mine:
            dest.with_suffix(".srt").write_text("".join(f"{k}\n{ts(a)} --> {ts(b)}\n{t}\n\n" for k, (a, b, t) in enumerate(mine, 1)), encoding="utf-8")
        print(f"{dest.name}: {dur / 60:.1f} min, {dest.stat().st_size / 1e6:.0f} MB, {len(mine)} captions", flush=True)


if __name__ == "__main__":
    main()
