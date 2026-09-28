# Script editing

The trainer edits the narration in Google Docs; changes are pulled back into `lesson.json`.

- Current doc (five chapters, overlap + function framing): "Reactivity & Aggression Part 1: Script v3 (overlap + function)",
  Drive id `1pYe1s5TcDdVhCRpx9EziigLo7BqZONmBHzxN-u-stRM`
- Baseline sent to the doc: `script/.doc-baseline-v3.html` (diff the doc against this to find the trainer's edits).
  Regenerate with `python3 tools/doc_html.py build/script_vN.html`.
- Previous doc v2 (superseded; its edits are already in lesson.json): Drive id `1w9AcQbIxzb4Z0YljkMC313OaPI9bEdUmlU_MOyjycJI`
- Older chapters 1-4 doc (superseded): Drive id `1puGFVH18vJiBOOBjDd1_f3vLpNz1pQKoHSx1PdSNcDU`
- Chapters moved out of Part 1 (welcome, stress and recovery, takeaways, next steps): `script/parked-later-video.json`,
  scene code in `video/scenes/parked/`
