"""Cut a finished lesson into one video per section (for YouTube), with captions and thumbnails.

    python3 tools/sections.py --name Understanding-Dog-Behavior-Ch1 [--no-thumbs | --thumbs-only] [--only 3 4]

Sections come from the lesson's "sections" list: [[first slide id, title, one-sentence description], ...]; each
runs until the next one starts. Without it, every slide with a heading starts a section and chapter cards and the plan slide join the one
before. Thumbnails come from the lesson's "thumbs" list (one options object per section, passed to
tools/thumbnail.mjs) when present.

The cuts are exact: each section's picture is the rendered slide files themselves joined end to end (no seeking, so
a section can never show a frame of the next or the previous one), and its sound is the finished video's mix cut at
the same sample. Every file is then checked frame by frame at both ends and for sound from the next slide.

Outputs in out/sections<tag>/: NN-Title.mp4, NN-Title.srt, NN-Title.jpg, sections.txt (titles, times, descriptions).
"""
import argparse
import json
import re
import subprocess
from pathlib import Path

import numpy as np

from assemble import SR, captions, fmt_ts, two_lines
from common import BUILD, LESSON_TAG, ROOT, load_script

FPS = 30


def run(*a):
    subprocess.run([str(x) for x in a], check=True)


def decode_audio(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-vn", "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, 2)


def frame(path, index, w=480, h=270):
    """One frame (by index, counted from 0) as a small grey array; negative indexes count from the end."""
    n = count_frames(path) if index < 0 else None
    i = index if index >= 0 else n + index
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-vf", f"select=eq(n\\,{i}),scale={w}:{h},format=gray",
                          "-vsync", "0", "-frames:v", "1", "-f", "rawvideo", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.uint8).reshape(h, w).astype(np.float32)


def count_frames(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-count_frames", "-select_streams", "v:0", "-show_entries",
                          "stream=nb_read_frames", "-of", "csv=p=0", str(path)], capture_output=True, text=True, check=True).stdout
    return int(out.strip())


def slug(s):
    return re.sub(r"[^A-Za-z0-9]+", "-", s.replace("'", "").replace("’", "")).strip("-")


def plan_sections(lesson, segs):
    spec = lesson.get("sections")
    if spec:
        ids = [s["id"] for s in segs]
        starts = [(ids.index(row[0]), row[1], row[2] if len(row) > 2 else "") for row in spec]
        if [r[0] for r in starts] != sorted(r[0] for r in starts) or starts[0][0] != 0:
            raise SystemExit("sections: start ids must be in slide order and the first must be the first slide")
    else:
        starts = []
        for i, s in enumerate(segs):
            joins = s["kind"] == "bumper" or (s.get("heading") or "").lower().startswith("where we") or (i and segs[i - 1]["kind"] == "bumper")
            if i == 0 or not joins:
                starts.append((i, s.get("heading") or s["id"], ""))
    out = []
    for k, (i, title, desc) in enumerate(starts):
        j = starts[k + 1][0] if k + 1 < len(starts) else len(segs)
        out.append({"title": title, "desc": desc, "segs": segs[i:j]})
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--name", required=True, help="the finished video's name in out/ (as given to assemble.py)")
    ap.add_argument("--segments", default="segments")
    ap.add_argument("--no-thumbs", action="store_true")
    ap.add_argument("--only", type=int, nargs="*", help="section numbers to (re)build")
    ap.add_argument("--thumbs-only", action="store_true", help="render the thumbnails only (no video cutting)")
    args = ap.parse_args()

    lesson = load_script()
    timing = json.loads((BUILD / "timing.json").read_text())
    segs = timing["segments"]
    final = ROOT / "out" / f"{args.name}.mp4"
    dest = ROOT / "out" / f"sections{LESSON_TAG}"
    dest.mkdir(parents=True, exist_ok=True)
    sections = plan_sections(lesson, segs)
    mix = None if args.thumbs_only else decode_audio(final)
    cues = captions(timing)
    thumbs = lesson.get("thumbs") or []
    listing = []

    for n, sec in enumerate(sections, 1):
        first, last = sec["segs"][0], sec["segs"][-1]
        t0, t1 = first["start"], last["start"] + last["dur"]
        base = dest / f"{n:02d}-{slug(sec['title'])}"
        listing.append(f"{n:02d}  {int(t0 // 60)}:{int(t0 % 60):02d}  {t1 - t0:5.1f} s  {sec['title']}" + (f"\n    {sec['desc']}" if sec['desc'] else ""))
        if args.only and n not in args.only:
            continue
        if args.thumbs_only:
            if n <= len(thumbs) and thumbs[n - 1]:
                opts = [x for k, v in thumbs[n - 1].items() for x in (f"--{k}", str(v))]
                run("node", ROOT / "tools" / "thumbnail.mjs", "--out", base.with_suffix(".jpg"), *opts)
            continue
        files = [BUILD / args.segments / f"{s['id']}.mp4" for s in sec["segs"]]

        # picture: the slide renders joined as they are (each starts on a keyframe), nothing re-encoded
        lst = BUILD / "section_concat.txt"
        lst.write_text("".join(f"file '{f.resolve()}'\n" for f in files))
        vid = BUILD / "section_video.mp4"
        run("ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst, "-c", "copy", vid)
        nframes = sum(count_frames(f) for f in files)

        # sound: the finished mix, cut on the same sample as the picture, with a 20 ms fade at each cut against clicks
        a, b = int(round(t0 * SR)), int(round(t0 * SR)) + int(round(nframes / FPS * SR))
        clip = mix[a:b].copy()
        if len(clip) < b - a:
            clip = np.vstack([clip, np.zeros((b - a - len(clip), 2), np.float32)])
        f = int(SR * 0.02)
        ramp = np.linspace(0, 1, f, dtype=np.float32)[:, None]
        clip[:f] *= ramp
        clip[-f:] *= ramp[::-1]
        raw = BUILD / "section_audio.f32"
        clip.astype(np.float32).tofile(raw)
        out = base.with_suffix(".mp4")
        run("ffmpeg", "-v", "error", "-y", "-i", vid, "-f", "f32le", "-ar", SR, "-ac", 2, "-i", raw,
            "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
            "-metadata", f"title={sec['title']}", "-metadata", "artist=Calling All Dogs", "-movflags", "+faststart", out)

        # captions for this section, timed from its own start
        sub = [(max(0.0, c0 - t0), min(c1, t1) - t0, txt) for c0, c1, txt in cues if t0 - 0.01 <= c0 < t1]
        base.with_suffix(".srt").write_text("".join(f"{i + 1}\n{fmt_ts(x)} --> {fmt_ts(y)}\n{two_lines(s)}\n\n" for i, (x, y, s) in enumerate(sub)))

        # checks: same frame count, ends on its own last frame, starts on its own first frame, no sound from the next slide
        got = count_frames(out)
        assert got == nframes, f"{out.name}: {got} frames, expected {nframes}"
        assert np.abs(frame(out, 0) - frame(files[0], 0)).mean() < 1.0, f"{out.name}: first frame is not its own"
        end = frame(out, -1)
        assert np.abs(end - frame(files[-1], -1)).mean() < 1.0, f"{out.name}: last frame is not its own"
        if n < len(sections):
            nxt = BUILD / args.segments / f"{sections[n]['segs'][0]['id']}.mp4"
            for k in range(1, 4):
                assert np.abs(frame(out, -k) - frame(nxt, 0)).mean() > 1.0 or np.abs(frame(files[-1], -k) - frame(nxt, 0)).mean() <= 1.0, \
                    f"{out.name}: frame -{k} looks like the next section"
            tail = decode_audio(out)[-int(SR * 0.5):]
            assert np.sqrt((tail ** 2).mean()) < 0.003, f"{out.name}: sound in the last half second (next slide bleeding in?)"
        dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(out)],
                                   capture_output=True, text=True, check=True).stdout)
        print(f"{out.relative_to(ROOT)}  {dur:6.2f} s  {nframes} frames  {out.stat().st_size / 1e6:5.1f} MB  ok")

        if not args.no_thumbs and n <= len(thumbs) and thumbs[n - 1]:
            opts = [x for k, v in thumbs[n - 1].items() for x in (f"--{k}", str(v))]
            run("node", ROOT / "tools" / "thumbnail.mjs", "--out", base.with_suffix(".jpg"), *opts)

    (dest / "sections.txt").write_text("\n".join(listing) + "\n")
    print("\n".join(listing))


if __name__ == "__main__":
    main()
