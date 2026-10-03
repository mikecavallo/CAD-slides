# Pipeline: files and commands

All paths are inside `reactivity-part1/`. Every tool reads the lesson named by the `LESSON` env var
(`LESSON=lesson-ch3.json`); no variable means the Chapter 1 video.

## Session setup (a fresh container needs this once)

```bash
cd reactivity-part1 && npm install
pip install kokoro-onnx sherpa-onnx soundfile numpy
mkdir -p /opt/tts && cd /opt/tts
# preview voice (Kokoro) and speech recognition (sherpa-onnx Zipformer); if a URL moved, find it on the project's releases page
curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
curl -LO https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-zipformer-en-2023-06-26.tar.bz2
tar xjf sherpa-onnx-zipformer-en-2023-06-26.tar.bz2
```

Check first: `ls /opt/tts` may already list them.

## Files for a new chapter N

- `script/lesson-chN.json`: copy `lesson-ch2.json`'s shape. Chapter ids `ch0Nw` (welcome, `"num": N`) and `ch0N`
  (`"bumper": false` when the chapter has its own narrated card). Scene ids `ch0Nintro`, `ch0Ncard`, `ch0Nplan`,
  `ch0Ns01`... Optional `"tail"` holds the very last slide longer.
- `video/scenes/cNa.js`, `cNb.js`, ... (about two or three scenes per file); a shared helper with no scenes goes in
  `cN_name.js`. Register each file in `video/index.html` after the existing ones.
- Render-cache note: `video/index.html`, `lib.js` and `base.css` are hashed into every segment, so editing them
  re-renders every scene of whichever lesson you build next. Chapter files are hashed with their own prefix's
  helpers, plus `c1` helpers for `c0` and `c2` (see `usesC1` in `tools/render.mjs`; add the new prefix there if its
  scenes use `C1`/`C2`).

## Only one lesson's timing lives in build/

Before switching lessons, copy `build/timing.json`, `build/timing.js` and `build/align.json` to the scratchpad if
you will need the other lesson again soon; otherwise just re-run its timing later.

## Preview build (temporary AI voice)

```bash
export LESSON=lesson-chN.json
python3 tools/tts_scratch.py && python3 tools/scratch_narration.py
python3 tools/align.py --dir build/scratch_narration
python3 tools/timing.py --mode narration
node tools/snap.mjs ch0Ns04 2 6 11        # stills at given seconds -> build/snaps/<scene>_sheet.jpg; look at them
node tools/render.mjs --workers 4         # only changed scenes; --only ID[,ID] --force after image changes
python3 tools/assemble.py --name Chapter-N-Title-PREVIEW-temp-voice --no-chapters
python3 tools/qa_sheets.py                # contact sheets from the rendered video, for a last look
```

## Build with Tori's voice

Recordings go in `narration/`, one file per slide named by scene id (`Ch03s05.m4a`, case does not matter; a slide in
pieces: `Ch03s07_part_1`). `narration/` is gitignored because the repo is public, so a new session has to ask Tori
to upload the takes again.

```bash
export LESSON=lesson-chN.json
python3 tools/align.py && python3 tools/timing.py --mode narration
node tools/render.mjs --workers 3
python3 tools/assemble.py --name Understanding-Dog-Behavior-Chapter-N
```

When a recording's wording differs from the script, check the doc: Tori usually changed it on purpose. Update the
lesson and any `sayAt` cue phrases that no longer match.

## Deliver

```bash
ffmpeg -i out/NAME.mp4 -c:v libx264 -crf 26 -preset medium -c:a aac -b:a 128k -movflags +faststart out/NAME-small.mp4
rm -rf out/web/chapterN && python3 tools/web_parts.py --video out/NAME.mp4 --timing build/timing.json --srt out/NAME.srt --out out/web/chapterN
python3 tools/web_page.py --dir out/web/chapterN --title "..." --heading "Chapter N: ..." --sub "Understanding Dog Behavior · Calling All Dogs" --chips "Preview,Temporary AI voice,X min" --note "..." --poster-video out/NAME.mp4 --poster-at 100
```

Publish `out/web/chapterN/index.html` with the Artifact tool, passing the part files and `poster.jpg` in `files`.
Republishing the same file path keeps the same URL. Chat uploads must stay under about 88 MB; the CRF 26 copy is
usually 25 to 30 MB.

Timestamps for the delivery note: each segment in `build/timing.json` has `id` and `start` in seconds.
