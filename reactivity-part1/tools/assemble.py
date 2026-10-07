"""Join rendered segments + narration into the finished video, captions and chapter files.

    python3 tools/assemble.py [--name Reactivity-and-Aggression-Part-1]

Outputs in out/:
  <name>.mp4                  full lesson (1080p, chapters embedded)
  <name>.srt / .vtt           captions (upload these to your course platform)
  <name>-chapters.txt         chapter timestamps (YouTube style)
  chapters/NN-Title.mp4       each chapter as its own video (for shorter lessons)
"""
import argparse
import json
import re
import subprocess
from pathlib import Path

import numpy as np

from common import BUILD, ROOT, load_script, spoken

SR = 48000
OUT = ROOT / "out"


def run(*a):
    subprocess.run(list(a), check=True)


def decode(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32)


def chime(length=1.6):
    """Soft two-note marimba-ish chime for chapter cards."""
    t = np.arange(int(SR * length)) / SR
    out = np.zeros_like(t)
    for f, d in ((659.25, 0.0), (987.77, 0.14)):
        tt = np.clip(t - d, 0, None)
        env = (t >= d) * (1 - np.exp(-tt * 90)) * np.exp(-tt * 3.2)
        out += env * (np.sin(2 * np.pi * f * tt) + 0.25 * np.sin(2 * np.pi * 2 * f * tt) + 0.08 * np.sin(2 * np.pi * 3 * f * tt))
    return (out / np.max(np.abs(out)) * 0.16).astype(np.float32)


def fmt_ts(sec, sep=","):
    ms = int(round(sec * 1000))
    h, ms = divmod(ms, 3600000)
    m, ms = divmod(ms, 60000)
    s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d}{sep}{ms:03d}"


def split_caption(text, limit=84):
    """Split text into caption chunks at sentence/clause boundaries, each <= limit chars (2 lines of ~42)."""
    sents = re.split(r"(?<=[.!?])\s+", text.strip())
    chunks = []
    for s in sents:
        while len(s) > limit:
            cut = max((m.end() for m in re.finditer(r"[,;:]\s", s[:limit])), default=0) or s[:limit].rfind(" ")
            chunks.append(s[:cut].strip())
            s = s[cut:].strip()
        if s:
            chunks.append(s)
    return chunks


def two_lines(s, width=42):
    if len(s) <= width:
        return s
    mid = len(s) // 2
    spaces = [m.start() for m in re.finditer(" ", s)]
    cut = min(spaces, key=lambda i: abs(i - mid)) if spaces else mid
    return s[:cut].strip() + "\n" + s[cut:].strip()


def captions(timing):
    cues = []
    for seg in timing["segments"]:
        for b in seg["beats"]:
            parts = split_caption(spoken(b["say"]))
            t0, t1 = seg["start"] + b["t"] + 0.12, seg["start"] + b["end"]
            if b.get("words"):
                # narration mode: use real word times for chunk boundaries
                ws = b["words"]
                n = 0
                for p in parts:
                    k = len(re.findall(r"[A-Za-z0-9'’]+", p))
                    seg_ws = ws[n:n + k] or ws[-1:]
                    cues.append([seg["start"] + seg_ws[0]["t"], seg["start"] + seg_ws[-1]["e"] + 0.25, p])
                    n += k
            else:
                total = sum(len(p) for p in parts)
                t = t0
                for p in parts:
                    d = (t1 - t0) * len(p) / total
                    cues.append([t, t + d + 0.2, p])
                    t += d
    for i in range(len(cues) - 1):  # no overlaps
        cues[i][1] = min(cues[i][1], cues[i + 1][0] - 0.04)
    return cues


def label_png(text, scale, out):
    """The full-screen clip label: a rounded green pill with a play dot and the label in bold white (brand font)."""
    from PIL import Image, ImageDraw, ImageFont
    f = ImageFont.truetype(str(ROOT / "assets/fonts/Montserrat-700.ttf"), 30 * scale)
    pad, dot = 22 * scale, 34 * scale
    tw = int(f.getlength(text)); th = 30 * scale
    w, h = pad + dot + 14 * scale + tw + pad + 6 * scale, th + 2 * 18 * scale
    im = Image.new("RGBA", (w + 16 * scale, h + 16 * scale), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((8 * scale, 12 * scale, w + 8 * scale, h + 12 * scale), radius=h // 2, fill=(0, 0, 0, 60))  # soft shadow
    d.rounded_rectangle((0, 0, w, h), radius=h // 2, fill=(63, 107, 34, 240))
    cx, cy = pad + dot // 2, h // 2
    d.ellipse((cx - dot // 2, cy - dot // 2, cx + dot // 2, cy + dot // 2), fill=(184, 217, 154, 255))
    r = dot * 0.22
    d.polygon([(cx - r * 0.7, cy - r), (cx - r * 0.7, cy + r), (cx + r, cy)], fill=(44, 74, 23, 255))
    d.text((pad + dot + 14 * scale, cy), text, font=f, fill=(255, 255, 255, 255), anchor="lm")
    im.save(out)
    return out


def overlay_clips(video, segs, scale=1):
    """Video slides: play the trainer's own clips inside each slide's frame (box in 1920 x 1080 stage px).
    A clip starts at the slide's clip time, fades in and out, and holds its last frame if the slide outlasts it."""
    items = [s for s in segs if (s.get("clip") or {}).get("file")]
    if not items:
        return video
    inputs, chains, last = [], [], "[0:v]"
    nin = 1  # the next ffmpeg input index (0 is the slides)
    for k, s in enumerate(items):
        c = s["clip"]
        if c.get("full"):
            # full screen: the trainer's clip fills the frame (a soft blurred copy fills any bars), plays with its own
            # sound, a small branded label names what to watch, and it fades in from the slide and back out to it
            W, H = 1920 * scale, 1080 * scale
            t0 = s["start"] + c["at"]
            d = c["len"]
            lab = label_png(c.get("label", "").replace("*", ""), scale, BUILD / f"clip_label_{k}.png")
            m = 48 * scale
            inputs += ["-i", str(ROOT / c["file"]), "-loop", "1", "-t", f"{d:.3f}", "-i", str(lab)]
            chains.append(
                f"[{nin}:v]trim=start={c['from']:.3f}:duration={d:.3f},setpts=PTS-STARTPTS,fps=30,split=2[ca{k}][cb{k}];"
                f"[ca{k}]scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},boxblur=40:2,eq=brightness=-0.10:saturation=0.75[bg{k}];"
                f"[cb{k}]scale={W}:{H}:force_original_aspect_ratio=decrease,setsar=1[fg{k}];"
                f"[{nin + 1}:v]format=rgba,fade=t=in:st=0.7:d=0.5:alpha=1,fade=t=out:st={max(0.8, d - 1.0):.3f}:d=0.5:alpha=1[lb{k}];"
                f"[bg{k}][fg{k}]overlay=(W-w)/2:(H-h)/2,setsar=1[cv{k}];[cv{k}][lb{k}]overlay={m}:{m}:shortest=1,"
                f"format=yuva420p,fade=t=in:st=0:d=0.5:alpha=1,fade=t=out:st={max(0, d - 0.5):.3f}:d=0.5:alpha=1,setpts=PTS+{t0:.3f}/TB[c{k}]")
            chains.append(f"{last}[c{k}]overlay=0:0:eof_action=pass:enable='between(t,{t0:.3f},{t0 + d:.3f})'[v{k}]")
            last = f"[v{k}]"
            nin += 2
            continue
        x, y, w, h = (round(v * scale) for v in c["box"])
        w, h = w - w % 2, h - h % 2
        t0 = s["start"] + c["at"]
        t1 = s["start"] + s["dur"] - 0.5  # the slide itself fades out over its last 0.5 s
        d = max(0.2, t1 - t0)
        inputs += ["-i", str(ROOT / c["file"])]
        chains.append(
            f"[{nin}:v]trim=start={c['from']:.3f}:duration={c['len']:.3f},setpts=PTS-STARTPTS,fps=30,split=2[fa{k}][fb{k}];"
            f"[fa{k}]scale={w}:{h}:force_original_aspect_ratio=increase,crop={w}:{h},boxblur=24:2,eq=brightness=-0.10:saturation=0.75[fbg{k}];"
            f"[fb{k}]scale={w}:{h}:force_original_aspect_ratio=decrease,setsar=1[ffg{k}];"
            f"[fbg{k}][ffg{k}]overlay=(W-w)/2:(H-h)/2,setsar=1,"
            f"tpad=stop_mode=clone:stop_duration={d:.3f},trim=duration={d:.3f},format=yuva420p,"
            f"fade=t=in:st=0:d=0.35:alpha=1,fade=t=out:st={max(0, d - 0.42):.3f}:d=0.42:alpha=1,setpts=PTS+{t0:.3f}/TB[c{k}]")
        nin += 1
        chains.append(f"{last}[c{k}]overlay={x}:{y}:eof_action=pass:enable='between(t,{t0:.3f},{t1:.3f})'[v{k}]")
        last = f"[v{k}]"
    out = BUILD / "video_clips.mp4"
    run("ffmpeg", "-v", "error", "-y", "-i", str(video), *inputs, "-filter_complex", ";".join(chains), "-map", last,
        "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-tune", "animation", "-pix_fmt", "yuv420p", "-r", "30",
        "-force_key_frames", ",".join(f"{s['start']:.3f}" for s in segs),  # keep exact cuts for the chapter files
        "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv", str(out))
    print(f"  video slides: {len(items)} clip(s) played in their frames")
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--name", default="Reactivity-and-Aggression-Part-1")
    ap.add_argument("--no-chapters", action="store_true")
    ap.add_argument("--music", help="optional background music file, looped and ducked under the voice")
    ap.add_argument("--music-db", type=float, default=-24, help="music level in dB (default -24)")
    ap.add_argument("--segments", default="segments", help="segment folder inside build/ (segments@2x for the 4K render)")
    ap.add_argument("--silent", action="store_true", help="leave the narration out (a visuals-only preview; captions are still written)")
    ap.add_argument("--chapter-max-mb", type=float, default=29, help="re-encode any chapter file bigger than this (default 29 MB)")
    args = ap.parse_args()
    timing = json.loads((BUILD / "timing.json").read_text())
    segs = timing["segments"]
    OUT.mkdir(exist_ok=True)
    (OUT / "chapters").mkdir(exist_ok=True)

    # 1) video: concat the segment files (each starts on a keyframe, so chapter cuts are exact)
    lst = BUILD / "concat.txt"
    lst.write_text("".join(f"file '{(BUILD / args.segments / (s['id'] + '.mp4')).resolve()}'\n" for s in segs))
    video = BUILD / "video_only.mp4"
    run("ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(lst), "-c", "copy", str(video))
    video = overlay_clips(video, segs, scale=2 if "@2x" in args.segments else 1)

    # 2) audio: place narration clips on one timeline, chimes on chapter cards
    total = timing["total"]
    mix = np.zeros(int(SR * (total + 1)), dtype=np.float32)
    cache = {}
    ch = chime()
    for s in segs:
        if s["kind"] == "bumper":
            a = int(SR * (s["start"] + 0.05))
            mix[a:a + len(ch)] += ch[: len(mix) - a]
        for item in ([] if args.silent else s["audio"]):
            f = ROOT / item["file"]
            if f not in cache:
                cache[f] = decode(f)
            clip = cache[f]
            if "from" in item:  # a slice of a longer recording
                k0 = int(round(SR * item["from"]))
                clip = clip[k0:k0 + int(round(SR * item["dur"]))]
            a = int(round(SR * item["at"]))
            n = min(len(clip), len(mix) - a)
            mix[a:a + n] += clip[:n]
        c = s.get("clip") or {}
        if c.get("file") and c.get("volume") and not args.silent:  # a video slide that keeps some of the clip's own sound
            try:
                snd = decode(ROOT / c["file"])
            except subprocess.CalledProcessError:
                snd = np.zeros(0, np.float32)  # the clip has no sound track
            snd = snd[int(SR * c["from"]):int(SR * (c["from"] + c["len"]))].copy()
            if len(snd):
                # phone audio: bring the clip's speech up to the narration's level, with short fades at the edges
                act = np.abs(snd) > 0.02
                rms = float(np.sqrt(np.mean(snd[act] ** 2))) if act.any() else 0
                if rms > 0:
                    snd = np.clip(snd * min(8.0, 0.09 / rms), -0.98, 0.98)
                f = min(len(snd) // 2, int(SR * 0.4))
                if f:
                    snd[:f] *= np.linspace(0, 1, f)
                    snd[-f:] *= np.linspace(1, 0, f)
            snd = snd * float(c["volume"])
            a = int(round(SR * (s["start"] + c["at"])))
            n = max(0, min(len(snd), len(mix) - a))
            mix[a:a + n] += snd[:n]
    mix = mix[: int(SR * total)]
    raw = BUILD / "mix.f32"
    mix.tofile(raw)
    audio = BUILD / "narration.m4a"
    if args.music:
        # music bed: looped, faded in/out, ducked whenever the narrator speaks
        fc = (f"[0:a]highpass=f=70,asplit=2[v][sc];[1:a]aloop=loop=-1:size=2e9,atrim=0:{total:.3f},volume={args.music_db}dB,"
              f"afade=t=in:d=2,afade=t=out:st={max(0, total - 4):.3f}:d=4[m];[m][sc]sidechaincompress=threshold=0.02:ratio=6:attack=80:release=600[md];"
              f"[v][md]amix=inputs=2:normalize=0,loudnorm=I=-16:TP=-1.5:LRA=11[out]")
        run("ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", str(raw), "-i", args.music,
            "-filter_complex", fc, "-map", "[out]", "-ar", str(SR), "-ac", "2", "-c:a", "aac", "-b:a", "192k", str(audio))
    elif args.silent:
        run("ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", str(raw),
            "-ar", str(SR), "-ac", "2", "-c:a", "aac", "-b:a", "96k", str(audio))
    else:
        run("ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", str(raw),
            "-af", "highpass=f=70,loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", str(SR), "-ac", "2", "-c:a", "aac", "-b:a", "192k", str(audio))

    # 3) chapters metadata
    chapters, seen = [], set()
    for s in segs:
        if s["chapter"] not in seen:
            seen.add(s["chapter"])
            chapters.append({"id": s["chapter"], "num": s["chapterNum"], "title": s["chapterTitle"], "start": s["start"]})
    for i, c in enumerate(chapters):
        c["end"] = chapters[i + 1]["start"] if i + 1 < len(chapters) else total
    meta = BUILD / "chapters.ffmeta"
    meta.write_text(f";FFMETADATA1\ntitle={load_script()['title']}\nartist=Calling All Dogs\n" + "".join(
        f"[CHAPTER]\nTIMEBASE=1/1000\nSTART={int(c['start'] * 1000)}\nEND={int(c['end'] * 1000)}\ntitle={c['title']}\n" for c in chapters))

    final = OUT / f"{args.name}.mp4"
    run("ffmpeg", "-v", "error", "-y", "-i", str(video), "-i", str(audio), "-i", str(meta), "-map", "0:v", "-map", "1:a", "-map_metadata", "2",
        "-map_chapters", "2", "-c", "copy", "-shortest", "-movflags", "+faststart", str(final))

    # 4) captions + chapter list
    cues = captions(timing)
    (OUT / f"{args.name}.srt").write_text("".join(f"{i + 1}\n{fmt_ts(a)} --> {fmt_ts(b)}\n{two_lines(t)}\n\n" for i, (a, b, t) in enumerate(cues)))
    (OUT / f"{args.name}.vtt").write_text("WEBVTT\n\n" + "".join(f"{fmt_ts(a, '.')} --> {fmt_ts(b, '.')}\n{two_lines(t)}\n\n" for a, b, t in cues))
    (OUT / f"{args.name}-chapters.txt").write_text("".join(f"{int(c['start'] // 60)}:{int(c['start'] % 60):02d} {c['title']}\n" for c in chapters))

    # 5) one file per chapter
    if not args.no_chapters:
        for c in chapters:
            slug = re.sub(r"[^A-Za-z0-9]+", "-", c["title"]).strip("-")
            dest = OUT / "chapters" / f"{c['num']:02d}-{slug}.mp4"
            run("ffmpeg", "-v", "error", "-y", "-ss", f"{c['start']:.3f}", "-i", str(final), "-t", f"{c['end'] - c['start']:.3f}", "-c", "copy",
                "-avoid_negative_ts", "make_zero", "-movflags", "+faststart", str(dest))
            if dest.stat().st_size > args.chapter_max_mb * 1e6:
                # two-pass re-encode to fit the size cap (keeps 1080p, trims bitrate)
                secs = c["end"] - c["start"]
                vk = int((args.chapter_max_mb * 0.97 * 8e6 / secs - 160e3) / 1000)
                tmp = dest.with_suffix(".fit.mp4")
                common = ["-c:v", "libx264", "-preset", "slow", "-b:v", f"{vk}k", "-pix_fmt", "yuv420p", "-tune", "animation"]
                run("ffmpeg", "-v", "error", "-y", "-i", str(dest), *common, "-pass", "1", "-passlogfile", str(BUILD / "x264pass"), "-an", "-f", "mp4", "/dev/null")
                run("ffmpeg", "-v", "error", "-y", "-i", str(dest), *common, "-pass", "2", "-passlogfile", str(BUILD / "x264pass"),
                    "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", str(tmp))
                tmp.replace(dest)

    size = final.stat().st_size / 1e6
    print(f"done: {final.relative_to(ROOT)} ({total / 60:.1f} min, {size:.0f} MB), {len(cues)} captions, {len(chapters)} chapters")


if __name__ == "__main__":
    main()
