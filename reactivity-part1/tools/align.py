"""Sync the trainer's recorded narration to the script.

Drop recordings in narration/ as either
  - one file per scene: ch01s01.m4a, ch01s02.m4a, ... (any format ffmpeg reads; a chapter may be partly recorded,
    and then only its recorded scenes go into the video; a scene may come in parts: ch01s07_part_1, ch01s07_part_2), or
  - one file per chapter: ch00.wav, ch01.m4a, ..., or
  - one file for everything: full.wav (or full.m4a, full.mp3 ...)
then run
    python3 tools/align.py && python3 tools/timing.py --mode narration

Speech recognition (offline, sherpa-onnx Zipformer) finds when every word was said. Those words are
matched to the script, so each beat's visuals fire exactly when the trainer starts saying it.
Small ad-libs and wording changes are fine. A report flags beats that could not be matched well.
"""
import json
import re
import subprocess
import sys
from pathlib import Path

import numpy as np

from common import BUILD, NARRATION_DIR, iter_scenes, load_script, spoken

MODEL = Path("/opt/tts/sherpa-onnx-zipformer-en-2023-06-26")
SR = 16000
AUDIO_EXT = {".wav", ".m4a", ".mp3", ".aac", ".flac", ".ogg", ".mov", ".mp4", ".aiff", ".aif", ".webm", ".opus"}

NUM = {"0": "zero", "1": "one", "2": "two", "3": "three", "4": "four", "5": "five", "6": "six", "7": "seven", "8": "eight", "9": "nine", "10": "ten"}


def norm(w):
    w = w.lower().replace("’", "'")
    w = re.sub(r"[^a-z0-9']", "", w)
    return NUM.get(w, w).strip("'")


def tokenize(text):
    return [t for t in (norm(x) for x in re.findall(r"[A-Za-z0-9'’]+", text)) if t]


def load_audio(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32)


def recognizer():
    import sherpa_onnx
    return sherpa_onnx.OfflineRecognizer.from_transducer(
        encoder=str(MODEL / "encoder-epoch-99-avg-1.int8.onnx"), decoder=str(MODEL / "decoder-epoch-99-avg-1.onnx"),
        joiner=str(MODEL / "joiner-epoch-99-avg-1.int8.onnx"), tokens=str(MODEL / "tokens.txt"), num_threads=4, decoding_method="greedy_search")


def chunks(audio, max_len=20.0):
    """Split at quiet points so each chunk is <= max_len seconds."""
    win = int(0.02 * SR)
    n = len(audio) // win
    rms = np.sqrt(np.mean(audio[: n * win].reshape(n, win) ** 2, axis=1) + 1e-12)
    thr = max(np.percentile(rms, 20) * 1.8, 1e-4)
    out, start = [], 0
    while start < n:
        end = min(n, start + int(max_len / 0.02))
        if end < n:
            lo = start + int(max_len * 0.5 / 0.02)
            seg = rms[lo:end]
            quiet = np.where(seg < thr)[0]
            cut = lo + (quiet[len(quiet) // 2] if len(quiet) else int(np.argmin(seg)))
            end = max(cut, start + 1)
        out.append((start * win, end * win))
        start = end
    return out


def transcribe(rec, audio):
    words = []
    for a, b in chunks(audio):
        s = rec.create_stream()
        s.accept_waveform(SR, audio[a:b])
        rec.decode_stream(s)
        r = s.result
        off = a / SR
        cur = None
        for tok, ts in zip(r.tokens, r.timestamps):
            if tok.startswith(" ") or cur is None:
                if cur:
                    words.append(cur)
                cur = {"w": tok.strip(), "t": off + ts}
            else:
                cur["w"] += tok
            cur["last"] = off + ts
        if cur:
            words.append(cur)
    for i, w in enumerate(words):
        nxt = words[i + 1]["t"] if i + 1 < len(words) else w["last"] + 0.4
        w["e"] = min(nxt, w["last"] + 0.35)
        w["n"] = norm(w["w"])
    return words


def similar(a, b):
    if a == b:
        return True
    if len(a) > 3 and len(b) > 3 and (a.startswith(b[:4]) or b.startswith(a[:4])):
        return True
    return False


def align(script_words, heard):
    """Needleman-Wunsch alignment of script words to recognized words. Returns index into heard (or -1) per script word."""
    n, m = len(script_words), len(heard)
    H = [h["n"] for h in heard]
    GAP_S, GAP_H = -1.0, -0.6  # skipping a heard word (ad-lib, retake) is cheaper than skipping a script word
    score = np.zeros((n + 1, m + 1), dtype=np.float32)
    back = np.zeros((n + 1, m + 1), dtype=np.int8)
    score[1:, 0] = GAP_S * np.arange(1, n + 1)
    score[0, 1:] = GAP_H * np.arange(1, m + 1)
    back[1:, 0], back[0, 1:] = 1, 2
    for i in range(1, n + 1):
        sw = script_words[i - 1]
        row, prev = score[i], score[i - 1]
        for j in range(1, m + 1):
            d = prev[j - 1] + (2.0 if sw == H[j - 1] else 1.2 if similar(sw, H[j - 1]) else -1.0)
            u = prev[j] + GAP_S
            l = row[j - 1] + GAP_H
            if d >= u and d >= l:
                row[j], back[i, j] = d, 0
            elif u >= l:
                row[j], back[i, j] = u, 1
            else:
                row[j], back[i, j] = l, 2
    idx = [-1] * n
    i, j = n, m
    while i > 0 and j > 0:
        if back[i, j] == 0:
            if script_words[i - 1] == H[j - 1] or similar(script_words[i - 1], H[j - 1]):
                idx[i - 1] = j - 1
            i, j = i - 1, j - 1
        elif back[i, j] == 1:
            i -= 1
        else:
            j -= 1
    return idx


def chapter_items(script):
    """[(chapter_id, [(beat_key, [words...])...])]"""
    out = {}
    for ch, sc in iter_scenes(script):
        out.setdefault(ch["id"], [])
        for i, b in enumerate(sc["beats"]):
            out[ch["id"]].append((f"{sc['id']}:{i}", tokenize(spoken(b["say"]))))
    return out


def time_beats(beats, heard, dur):
    flat = [(k, w) for k, ws in beats for w in ws]
    idx = align([w for _, w in flat], heard)
    times = [heard[j]["t"] if j >= 0 else None for j in idx]
    ends = [heard[j]["e"] if j >= 0 else None for j in idx]
    # interpolate unmatched words
    known = [i for i, t in enumerate(times) if t is not None]
    if not known:
        raise SystemExit("could not match any words; is this the right recording?")
    for i in range(len(times)):
        if times[i] is None:
            prev = max([k for k in known if k < i], default=None)
            nxt = min([k for k in known if k > i], default=None)
            if prev is None:
                times[i] = max(0.0, times[nxt] - 0.3 * (nxt - i))
            elif nxt is None:
                times[i] = min(dur, ends[prev] + 0.3 * (i - prev))
            else:
                times[i] = ends[prev] + (times[nxt] - ends[prev]) * (i - prev) / (nxt - prev)
            ends[i] = times[i] + 0.25
    res, pos = {}, 0
    for k, ws in beats:
        sl = range(pos, pos + len(ws))
        matched = sum(1 for i in sl if idx[i] >= 0)
        res[k] = {"start": times[sl[0]], "end": ends[sl[-1]], "match": matched / max(1, len(ws)),
                  "words": [{"w": flat[i][1], "t": times[i], "e": ends[i]} for i in sl]}
        pos += len(ws)
    # keep starts monotonic
    last = 0.0
    for k, _ in beats:
        res[k]["start"] = max(res[k]["start"], last)
        res[k]["end"] = max(res[k]["end"], res[k]["start"] + 0.3)
        last = res[k]["start"] + 0.05
    return res


def find_recordings(chapters):
    files = {p.stem.lower(): p for p in NARRATION_DIR.glob("*") if p.suffix.lower() in AUDIO_EXT}
    per = {c: files[c] for c in chapters if c in files}
    full = next((files[k] for k in ("full", "all", "narration") if k in files), None)
    return per, full, files


def level(a, f, target=-23.0):
    """Bring one take to a common loudness (separate takes are often recorded at different levels).
    The final mix is normalised again in assemble.py; this only evens out the takes against each other."""
    log = subprocess.run(["ffmpeg", "-nostats", "-i", str(f), "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
    m = re.findall(r"I:\s+(-?[\d.]+) LUFS", log)
    if not m:
        return a
    gain = 10 ** ((target - float(m[-1])) / 20)
    peak = float(np.max(np.abs(a))) or 1.0
    return a * min(gain, 0.95 / peak)


def scene_takes(files, sid):
    """The recording(s) for one scene: ch01s07.m4a, or a slide recorded in pieces (ch01s07_part_1, ch01s07 part 2, ...),
    which are played back to back in part order."""
    sid = sid.lower()
    if sid in files:
        return [files[sid]]
    parts = []
    for stem, f in files.items():
        m = re.fullmatch(re.escape(sid) + r"[ _-]*(?:part|pt)?[ _-]*(\d+)", stem)
        if m:
            parts.append((int(m.group(1)), f))
    return [f for _, f in sorted(parts)]


def trim_bounds(beats, heard, audio):
    """Cut stray speech before the scene's first scripted word and after its last one (a slate like "slide two",
    a false start, the first word of an abandoned retake). Cuts land in the silence that separates the stray part
    from the real take, so a first word the recogniser missed is never clipped. Returns (start, end) in seconds."""
    dur = len(audio) / SR
    idx = [j for j in align([w for _, ws in beats for w in ws], heard) if j >= 0]
    if not idx:
        return 0.0, dur
    j0, j1 = min(idx), max(idx)
    win = int(0.02 * SR)
    n = len(audio) // win
    rms = np.sqrt(np.mean(audio[: n * win].reshape(n, win) ** 2, axis=1) + 1e-12)
    loud = rms > max(np.percentile(rms, 95) * 0.06, 1e-4)
    gap = int(0.35 / 0.02)  # a pause at least this long separates stray speech from the take

    def edge(f, step):
        """From frame f walk outward through the take until a long enough pause; return the last loud frame."""
        last, quiet = f, 0
        while 0 <= f < n:
            if loud[f]:
                last, quiet = f, 0
            else:
                quiet += 1
                if quiet >= gap:
                    break
            f += step
        return last

    a, b = 0.0, dur
    if j0 > 0:
        a = max(0.0, edge(int(heard[j0]["t"] / 0.02), -1) * 0.02 - 0.25)
    if j1 < len(heard) - 1:
        b = min(dur, (edge(int(heard[j1]["e"] / 0.02), 1) + 1) * 0.02 + 0.5)
    if a > 0.3 or b < dur - 0.3:
        print(f"  trimmed {beats[0][0].split(':')[0]}: {a:.2f}s at the start, {dur - b:.2f}s at the end", flush=True)
    else:
        a, b = 0.0, dur
    return a, b


def align_scenes(rec, c, beats, files, work):
    """Chapter recorded one file per scene: align each scene to its own file, then join the files into one chapter
    track (only the recorded scenes, in script order). Returns the chapter's align record, or None if none recorded."""
    groups = {}
    for k, ws in beats:
        groups.setdefault(k.split(":")[0], []).append((k, ws))
    takes = {sid: scene_takes(files, sid) for sid in groups}
    recorded = [sid for sid in groups if takes[sid]]
    if not recorded:
        return None
    timed, parts, off = {}, [], 0.0
    for sid in recorded:
        audio = np.concatenate([load_audio(f) for f in takes[sid]])
        dur = len(audio) / SR
        heard = transcribe(rec, audio)
        a, b = trim_bounds(groups[sid], heard, audio)
        t = time_beats(groups[sid], heard, dur)
        for k, v in t.items():
            v["start"] += off - a
            v["end"] += off - a
            for w in v["words"]:
                w["t"] += off - a
                w["e"] += off - a
            timed[k] = v
        take = []
        for f in takes[sid]:
            raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(f), "-ac", "1", "-ar", "48000", "-f", "f32le", "-"], capture_output=True, check=True).stdout
            take.append(level(np.frombuffer(raw, dtype=np.float32), f))
        take = np.concatenate(take)[int(a * 48000):int(b * 48000)]
        parts.append(take)
        off += len(take) / 48000
    import soundfile as sf
    out = work / f"{c}.wav"
    sf.write(out, np.concatenate(parts), 48000)
    return {"file": str(out.resolve().relative_to(BUILD.parent)), "dur": off, "beats": timed, "scenes": recorded}


def main():
    global NARRATION_DIR
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument("--dir", help="folder with the recordings (default: narration/)")
    args = ap.parse_args()
    if args.dir:
        NARRATION_DIR = Path(args.dir).resolve()
    script = load_script()
    items = chapter_items(script)
    per, full, files = find_recordings(list(items))
    rec = recognizer()
    out = {"chapters": {}}
    work = BUILD / "narration"
    work.mkdir(parents=True, exist_ok=True)

    if full and len(per) < len(items):
        print(f"aligning single recording {full.name} ...", flush=True)
        audio = load_audio(full)
        heard = transcribe(rec, audio)
        allbeats = [b for c in items for b in items[c]]
        timed = time_beats(allbeats, heard, len(audio) / SR)
        # cut into per-chapter files at the silence before each chapter's first word
        cids = list(items)
        starts = [timed[items[c][0][0]]["start"] for c in cids]
        bounds = [0.0] + [max(timed[items[cids[k - 1]][-1][0]]["end"] + 0.05, starts[k] - 0.4) for k in range(1, len(cids))] + [len(audio) / SR]
        for k, c in enumerate(cids):
            a, b = bounds[k], bounds[k + 1]
            f = work / f"{c}.wav"
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(full), "-ss", f"{a:.3f}", "-to", f"{b:.3f}", "-ac", "1", "-ar", "48000", str(f)], check=True)
            per[c] = f
    report = []
    for c, beats in items.items():
        if c not in per:
            r = align_scenes(rec, c, beats, files, work)
            if not r:
                print(f"{c}: no recording, left out", flush=True)
                continue
            out["chapters"][c] = r
            rate = np.mean([v["match"] for v in r["beats"].values()])
            weak = [k for k, v in r["beats"].items() if v["match"] < 0.6]
            report.append(f"{c}: {r['dur'] / 60:.1f} min ({len(r['scenes'])} scenes recorded), {rate * 100:.0f}% of script words matched" + (f", check beats: {', '.join(weak)}" if weak else ""))
            print(report[-1], flush=True)
            continue
        audio = load_audio(per[c])
        dur = len(audio) / SR
        heard = transcribe(rec, audio)
        timed = time_beats(beats, heard, dur)
        out["chapters"][c] = {"file": str(per[c].resolve().relative_to(BUILD.parent)), "dur": dur, "beats": timed}
        rate = np.mean([v["match"] for v in timed.values()])
        weak = [k for k, v in timed.items() if v["match"] < 0.6]
        report.append(f"{c}: {dur / 60:.1f} min, {rate * 100:.0f}% of script words matched" + (f", check beats: {', '.join(weak)}" if weak else ""))
        print(report[-1], flush=True)
    if not out["chapters"]:
        raise SystemExit(f"no recordings found in {NARRATION_DIR}")
    (BUILD / "align.json").write_text(json.dumps(out, indent=1))
    (BUILD / "align_report.txt").write_text("\n".join(report) + "\n")


if __name__ == "__main__":
    sys.exit(main())
