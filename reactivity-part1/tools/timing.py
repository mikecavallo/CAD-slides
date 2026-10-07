"""Build the master timeline (build/timing.json + build/timing.js) from the script.

Modes
  --mode estimate    durations from word count (150 wpm). No audio needed. For layout work.
  --mode scratch     durations from the scratch AI voice clips (tools/tts_scratch.py).
  --mode narration   the trainer's recordings, aligned by tools/align.py (build/align.json).

    python3 tools/timing.py --mode scratch
"""
import argparse
import json

from common import (AUDIO, BUILD, BUMPER, FPS, GAP, HOLD, LEAD, ROOT, SCENE_GAP, TAIL, chapter_num, find_clip, load_script, media_dur, spoken, words)


def frames(sec):
    """Snap to whole frames so segment boundaries line up exactly when concatenated."""
    return round(sec * FPS) / FPS


def bumper(ch, start):
    b = {
        "id": f"bumper_{ch['id']}", "kind": "bumper", "chapter": ch["id"], "chapterNum": ch.get("num", chapter_num(ch["id"])),
        "chapterTitle": ch["title"], "start": start, "dur": frames(BUMPER), "beats": [], "audio": [],
    }
    if ch.get("kicker"):  # the card's small label word, e.g. "Part" (default "Chapter")
        b["kicker"] = ch["kicker"]
    return b


CLIP_END = 0.6  # a video slide holds this long after the trainer's clip ends (the scene fades out over its last 0.5 s)


def clip_info(sc, beats=()):
    """A video slide ("clip" in the lesson): where the frame sits, when the clip starts, and the trainer's file if it is in clips/.
    The clip plays muted by default (the trainer narrates over it); "from" / "to" trim it, "volume" mixes in its own sound."""
    c = sc.get("clip")
    if not c:
        return None
    info = {k: c[k] for k in ("box", "poster", "label", "fit", "full", "steps", "marks", "stepOffsets") if k in c}
    info["at"] = c.get("at", 1.2)
    if "atBeat" in c and c["atBeat"] < len(beats):  # start the clip when that beat starts (a picture shows in the frame until then)
        info["at"] = round(beats[c["atBeat"]]["t"], 3)
    if c.get("afterNarration") and beats:  # the clip starts once the slide's narration is done (its own sound plays clean)
        info["at"] = round(beats[-1]["end"] + 0.3, 3)
    f = find_clip(sc["id"])
    if f:
        a = c.get("from", 0.0)
        b = c.get("to") or media_dur(f)
        info.update({"file": str(f.relative_to(ROOT)), "from": a, "len": round(max(0.1, b - a), 3), "volume": c.get("volume", 1.0 if c.get("full") else 0)})
    return info


def scene_seg(ch, sc, start, dur, beats, audio):
    seg = {
        "id": sc["id"], "kind": "scene", "chapter": ch["id"], "chapterNum": ch.get("num", chapter_num(ch["id"])),
        "chapterTitle": ch["title"], "heading": sc.get("heading", ""), "start": start, "dur": frames(dur),
        "beats": beats, "audio": audio,
    }
    clip = clip_info(sc, beats)
    if clip:
        seg["clip"] = clip
        if "len" in clip:  # the slide lasts at least as long as the trainer's clip
            # a full-screen clip fades back to the slide, which holds a moment before it exits
            seg["dur"] = frames(max(dur, clip["at"] + clip["len"] + (1.3 if clip.get("full") else CLIP_END)))
    return seg


def build_sequential(script, beat_dur, beat_audio):
    tail = script.get("tail", TAIL)  # a lesson may hold its very last slide longer (room for its closing beat)
    """estimate / scratch: every beat has a known length; lay them out back to back."""
    segs, t = [], 0.0
    for ci, ch in enumerate(script["chapters"]):
        if ci > 0 and ch.get("bumper", True):  # a chapter may draw its own (narrated) card instead
            b = bumper(ch, t)
            segs.append(b)
            t += b["dur"]
        for si, sc in enumerate(ch["scenes"]):
            last_in_ch = si == len(ch["scenes"]) - 1
            local, beats, audio = LEAD, [], []
            for i, b in enumerate(sc["beats"]):
                d = beat_dur(sc, i)
                beats.append({"t": round(local, 3), "end": round(local + d, 3), "say": spoken(b["say"]), "onscreen": b.get("onscreen", "")})
                a = beat_audio(sc, i)
                if a:
                    audio.append({"file": a, "at": round(t + local, 4), "dur": d})
                local += d + GAP
            local += ((tail if ci == len(script["chapters"]) - 1 else TAIL) if last_in_ch else SCENE_GAP) - GAP
            seg = scene_seg(ch, sc, t, frames(local), beats, audio)
            segs.append(seg)
            t += seg["dur"]
    return segs


def build_narration(script, align):
    segs, t = [], 0.0
    tail = script.get("tail", TAIL)
    for ci, ch in enumerate(script["chapters"]):
        rec = align["chapters"].get(ch["id"])
        if not rec:
            print(f"  {ch['id']}: not recorded yet, left out")
            continue
        if segs and ch.get("bumper", True):
            b = bumper(ch, t)
            segs.append(b)
            t += b["dur"]
        # scene boundaries in chapter-audio time (a chapter recorded scene by scene may be partly recorded)
        scenes = [sc for sc in ch["scenes"] if sc["id"] in rec.get("scenes", [sc["id"]])]
        firsts = [rec["beats"][f"{sc['id']}:0"]["start"] for sc in scenes]
        lasts = [rec["beats"][f"{sc['id']}:{len(sc['beats']) - 1}"]["end"] for sc in scenes]
        if rec.get("spans"):
            # recorded one take per scene: cut exactly where one take ends and the next begins
            bounds = [rec["spans"][sc["id"]][0] for sc in scenes]
        else:
            bounds = [0.0]
        for k in range(1, len(scenes) if not rec.get("spans") else 1):
            prev_end, nxt = lasts[k - 1], firsts[k]
            b = max(prev_end + 0.1, nxt - LEAD)
            if b > nxt - 0.15:
                b = (prev_end + nxt) / 2
            bounds.append(b)
        bounds.append(max(rec["dur"], lasts[-1]) + (tail if ci == len(script["chapters"]) - 1 else TAIL))
        bounds = [frames(x) for x in bounds]
        # each scene plays its own slice of the recording, followed by a short silent hold
        for k, sc in enumerate(scenes):
            s0, s1 = bounds[k], bounds[k + 1]
            beats = []
            for i, b in enumerate(sc["beats"]):
                r = rec["beats"][f"{sc['id']}:{i}"]
                beats.append({"t": round(max(0.05, r["start"] - s0 - 0.12), 3), "end": round(r["end"] - s0, 3), "say": spoken(b["say"]), "onscreen": b.get("onscreen", ""),
                              "words": [{"w": w["w"], "t": round(w["t"] - s0, 3), "e": round(w["e"] - s0, 3)} for w in r.get("words", [])]})
            audio = [{"file": rec["file"], "at": round(t, 4), "from": round(s0, 4), "dur": round(s1 - s0, 4)}]
            hold = max(0.0, HOLD - (s1 - lasts[k]))  # top up only when her own pause is shorter than HOLD
            seg = scene_seg(ch, sc, t, frames(s1 - s0 + hold), beats, audio)
            segs.append(seg)
            t += seg["dur"]
    return segs


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--mode", choices=["estimate", "scratch", "narration"], default="estimate")
    ap.add_argument("--wpm", type=float, default=150)
    args = ap.parse_args()
    script = load_script()

    if args.mode == "estimate":
        segs = build_sequential(script, lambda sc, i: max(1.5, len(words(sc["beats"][i]["say"])) / args.wpm * 60), lambda sc, i: None)
    elif args.mode == "scratch":
        man = json.loads((AUDIO / "scratch_manifest.json").read_text())
        segs = build_sequential(script, lambda sc, i: man[f"{sc['id']}:{i}"]["dur"], lambda sc, i: man[f"{sc['id']}:{i}"]["file"])
    else:
        segs = build_narration(script, json.loads((BUILD / "align.json").read_text()))

    total = sum(s["dur"] for s in segs)
    data = {"fps": FPS, "mode": args.mode, "total": round(total, 3), "segments": segs}
    BUILD.mkdir(exist_ok=True)
    (BUILD / "timing.json").write_text(json.dumps(data, indent=1))
    js = {"fps": FPS, "mode": args.mode, "order": [s["id"] for s in segs], "scenes": {s["id"]: s for s in segs}, "series": script.get("series", {})}
    (BUILD / "timing.js").write_text("window.TIMING = " + json.dumps(js) + ";\n")
    print(f"timing ({args.mode}): {len(segs)} segments, {total / 60:.1f} min")


if __name__ == "__main__":
    main()
