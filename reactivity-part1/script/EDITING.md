# Script editing

The trainer edits the narration in Google Docs; changes are pulled back into `lesson.json`.

- The trainer edits the v4 doc directly. Only the material ABOVE its 'END OF FIRST CHAPTER MATERIAL' line is in
  this video (lesson.json v5, ten scenes). Leave the material below that line alone until she asks for it.
  `script/.doc-snapshot-v5-ch1.html` is what lesson.json holds for that part, for diffing her next edits.
- Current doc (one chapter, v4): "Reactivity & Aggression Part 1: Script v4 (one chapter)",
  Drive id `13FHWVCWAWskM90w2_UFwAlC1o68YjxhpX_XuGuxaYDE`
- Baseline sent to the doc: `script/.doc-baseline-v4.html` (diff the doc against this to find the trainer's edits).
  Regenerate with `python3 tools/doc_html.py build/script_vN.html`.
- Doc v3 (five chapters, superseded): Drive id `1pYe1s5TcDdVhCRpx9EziigLo7BqZONmBHzxN-u-stRM`; that script is in
  `script/archive/lesson-v3-five-chapters.json`
- Previous doc v2 (superseded; its edits are already in lesson.json): Drive id `1w9AcQbIxzb4Z0YljkMC313OaPI9bEdUmlU_MOyjycJI`
- Older chapters 1-4 doc (superseded): Drive id `1puGFVH18vJiBOOBjDd1_f3vLpNz1pQKoHSx1PdSNcDU`
- Chapters moved out of Part 1 (welcome, stress and recovery, takeaways, next steps): `script/parked-later-video.json`,
  scene code in `video/scenes/parked/`
