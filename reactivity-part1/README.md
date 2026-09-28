# Understanding Reactivity and Aggression, Part 1: explainer video

An animated, on-brand explainer video for the Calling All Dogs reactivity course, built from the
"Understanding Reactivity and Aggression Pt 1" slide deck. You narrate it; the visuals sync to your voice.

## What's here

| path | what it is |
|---|---|
| `script/lesson.json` | the script: chapters, scenes, every line of narration and what appears on screen. Source of truth. |
| `script/Narration-Script.md` | the narration as plain text (paste into Google Docs or a teleprompter app) |
| `video/` | the animation: scene files `video/scenes/v4a.js` to `v4f.js` (older versions in `video/scenes/archive/`), shared brand kit in `lib.js` + `base.css` |
| `assets/` | photos and ABC illustrations from the deck, logo, fonts |
| `tools/` | build scripts (below) |

Generated (not committed): `out/` holds the finished MP4, captions, chapter clips and the printable
script PDF. `build/` is scratch space.

## How the narration works

1. Read `out/Narration-Script.pdf` (or the `.md`). The lesson is one chapter, so record one audio file
   named `ch01` (any format: .m4a from a phone is fine). A take named `full` works too.
2. Put the files in `narration/` and rebuild (below). Speech recognition finds when you said each line,
   so every animation fires as you say it. Ad-libs and small wording changes are fine.

Until your recordings exist, the preview uses a temporary AI voice purely for timing.

## Build

Needs Node 20+, Python 3.10+, ffmpeg, and (for voice sync) `pip install sherpa-onnx soundfile numpy`
with the Zipformer English model in `/opt/tts` (see `tools/align.py`).

```bash
npm install
python3 tools/align.py                  # match your recordings to the script
python3 tools/timing.py --mode narration
node tools/render.mjs                   # renders only scenes that changed
python3 tools/assemble.py               # final MP4, captions, chapter files -> out/
python3 tools/export_script.py          # printable script -> out/Narration-Script.pdf
```

Preview without recordings (temporary AI voice, run through the same sync path as real recordings):

```bash
python3 tools/tts_scratch.py
python3 tools/scratch_narration.py
python3 tools/align.py --dir build/scratch_narration
python3 tools/timing.py --mode narration
node tools/render.mjs && python3 tools/assemble.py --name Reactivity-Part-1-PREVIEW-temp-voice
```

Optional background music: `python3 tools/assemble.py --music path/to/track.mp3` loops it, fades it
and ducks it under the voice. Chapter files over 29 MB are automatically re-encoded to fit.

Quality checks: `node tools/snap.mjs <scene>` makes stills at each beat; `python3 tools/qa_sheets.py`
makes contact sheets from the rendered video, one frame every 1.5 s.

Scene authoring rules and the component kit are documented in `video/SCENE_GUIDE.md`.
