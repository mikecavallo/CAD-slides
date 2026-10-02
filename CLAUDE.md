# Calling All Dogs course videos: handoff notes

Read this first in any new session. The project lives in `reactivity-part1/` (see its README for the build
pipeline). This file records the state, decisions and working agreements from earlier sessions.

## The project

- Trainer and narrator: **Tori Ganino, BS, CDBC, CPDT-KA**, Calling All Dogs (callingalldogsny.com).
  Refer to Tori by name; pronouns were never stated, so do not assume any.
- Presentation: **"Getting Started with Dog Behavior: Understanding Reactivity and Aggression"**, a narrated,
  animated slide video (HTML + GSAP scenes rendered to MP4, synced to Tori's recorded voice).
- Script source of truth: Tori's Google Doc "Reactivity & Aggression Part 1: Script v4 (one chapter)",
  id `13FHWVCWAWskM90w2_UFwAlC1o68YjxhpX_XuGuxaYDE` (read it with the Google Drive connector; Claude cannot
  edit it, so give Tori paste-ready text). Everything above "END OF FIRST CHAPTER MATERIAL" is Chapter 1. Between
  that line and "END CHAPTER 2 MATERIAL" is **Chapter 2: Understanding Your Dog's Baseline** (CH02,S01 to S12, the
  water-in-a-pot chapter). Below that is older draft material (ABCs, function, four directions, leash walks,
  warning signals) for later chapters; Chapter 3 will add heat and the thermometer to the pot. Sync the lesson
  file to the doc before every build; the doc wins.

## Current structure (Chapter 1 is finished, pending Tori's later edits)

- `ch00` Welcome: `ch00s01` title slide (headshot, training photo, name and credentials).
- `ch01` "Starting with the Basics": the chapter card plays first, then `ch00s02` the plan slide (id kept so
  its recording still matches; cards: Why you're here / What you'll gain / How we'll get there; steps:
  "The difference between reactivity and aggression", "The ingredients that shape behavior"), then
  `ch01s01` to `ch01s12` (definitions, look beyond the label, why, the eight bowl ingredients, putting it
  together). Last slide ends on a barking dog circled by three "?" badges in a cycle (teases the ABCs).
- Scene code: `video/scenes/c0.js` (ch00s01, ch00s02), `c1a.js` to `c1e.js` (chapter 1), shared bowl module
  `c1_bowl.js`. Older versions are in `video/scenes/archive/` and `script/archive/`.

## Chapter 2 video (built, preview voice only)

- Its own video and lesson file: `script/lesson-ch2.json`. Every tool takes it through the `LESSON` env var:
  `LESSON=lesson-ch2.json python3 tools/timing.py ...` (no variable = the Chapter 1 video). Only one lesson's
  timing lives in `build/` at a time, so re-run timing when switching.
- Order: `ch02intro` (title slide, like ch00s01, with "Chapter 2: Understanding Your Dog's Baseline"), the chapter
  card, `ch02plan` (Why it matters / What you'll gain / How we'll get there, three steps), then `ch02s01` to `ch02s12`.
  The intro and plan narration were written by Claude (not in the doc yet); Tori was sent paste-ready text.
- Scene code: `video/scenes/c2a.js` to `c2f.js`, shared pot module `c2_pot.js` (glass pot, water level tweens,
  drips, floating chips, the "room left" bracket, the drawn dog, logo close). Area colours: physical red,
  activity amber, emotions olive, environment deep green.
- Tori's round 1 feedback (applied): the title slide keeps the presentation title unchanged, chapter is a tag with
  Chapter 1's amber fuel chip; s01 pours the bowl's ingredients into the pot and the fuel chip melts in as water;
  the eight ingredients float in every pot and ride the water level; factors that raise the water are red/amber
  pills that drip in (never chip tokens); fixes lift drops out; s07 "different for each dog" sentence and slides
  removed, "more on this later" sits on the beam slide; s08 is a three-step strip, not a graph; s12 has a new line
  naming the water (only the water, NOT the ingredients) "distant antecedents". Last slide frames: Part 1 = the ingredients
  (Chapter 1), Part 2 = the water (this chapter) = distant antecedents; Part 3 = temperature (next).
- Round 2 feedback (applied): title slide has only "Chapter 2" in the kicker (chapter title lives on the chapter card);
  the fuel chip is a blue water drop in both chapters (the fuel IS the water, the baseline; c1d.js ch01s12 changed but
  Chapter 1's narrated video still needs a re-render once Tori re-uploads the Ch01 takes); s01 says "Additional factors
  that can be" and has a new line about adding the ingredients to the pot; s06 has a new stoic-dog line and time line;
  activity area and physical activity use the two-paw icon ("paws", defined in c2_pot.js); s08 is a clean graph again
  (legend, events under the axis); "What you can handle".
- Decisions: the pot is glass so the level shows; no heat or thermometer until ch02s12's last beat (doc says so);
  s01 reuses the Chapter 1 bowl (Breed history, Past experiences, Training tools, Pain return); s07 shows the
  doc's eight examples split Too little / Too much under a balance beam. Two lines Claude wrote are not in the doc
  yet: the intro/plan narration, s01's "add those ingredients to a pot of water" line, s06's stoic line and s12's
  distant antecedents line.
- Recordings: `Ch02intro.m4a`, `Ch02plan.m4a`, `Ch02s01.m4a` ... `Ch02s12.m4a` (rename Tori's files to match).
- The lesson has `"tail": 5.0` (applies to its very last slide only) so the thermometer reveal holds before the logo close.
- Online preview (temporary AI voice): https://claude.ai/artifact/Nzf2aTAYk5iAVNdqKmb1Js (`out/web/chapter2/`).

## Recordings (Tori's voice)

- One file per slide, named by scene id: `Ch01s05.m4a` (case does not matter). A slide in pieces:
  `Ch01s07_part_1`, `Ch01s07_part_2`. Files go in `reactivity-part1/narration/`.
- `narration/` is gitignored (the repo is public), so **recordings are not in GitHub**. In a new session, ask
  Tori to re-upload the takes for any slide being rebuilt with voice.
- Build with voice: `python3 tools/align.py && python3 tools/timing.py --mode narration && node tools/render.mjs
  --workers 3 && python3 tools/assemble.py --name Getting-Started-with-Dog-Behavior`.
  align.py levels each take, trims lead-in/tail noise and slates (voiced-sound based), and cuts slides exactly
  between takes. Partly recorded chapters build a video of just the recorded slides.
- Preview without voice: `tools/tts_scratch.py`, `tools/scratch_narration.py`, then `align.py --dir
  build/scratch_narration`, `timing.py --mode narration`, render, `assemble.py --silent`.
- When the recording differs from the script, check the doc; usually Tori changed the wording on purpose.
  Update lesson.json and any cue phrases (`sayAt(ctx, beat, 'phrase')`) that no longer match.

## Delivery

- Send a compressed copy through chat (CRF 26, about 28 MB; the chat upload limit is under 88 MB).
- Online pages (republish the same file path to keep the URL): narrated video
  https://claude.ai/artifact/Q4WnoBBniuysUrV4ssy7hT (`out/web/chapter1-narrated/`), visuals-only preview
  https://claude.ai/artifact/GCofjK4PiTMr3arKJFSUKz (`out/web/chapter1/`). Built with `tools/web_parts.py` and
  `tools/web_page.py` (see README).
- YouTube: Tori uploads there. For crisp text, upload a true 4K render: `node tools/render.mjs --scale 2`
  then `python3 tools/assemble.py --segments segments@2x --no-chapters`. Too big for chat; agree a delivery
  route first. Tori said not to make it until Chapter 1 edits are final.

## Decisions already made (do not undo without asking)

- Ingredient bowl metaphor and the eight chips; photo portraits for genetics (barking Sheltie = more
  sensitive, scruffy white dog = more easygoing); "Before birth" uses a sprout icon.
- Breed slide: six job cards (Herding: Aussie, Guarding: Great Pyrenees, Hunting: Beagle, Terrier: Jack
  Russell, Sporting: Golden Retriever, Working and assistance: black Lab), each enlarges with a small vignette;
  silhouettes row is cut from real photos and the logo (`assets/img/sil_*.png`).
- "Same behavior, different reasons" on the barking slide.
- On-screen text never uses em or en dashes.

## Working with Tori

- Direct and short. No filler, no em dashes, no step-by-step narration of what you are doing. Give a
  recommendation, not a menu. Do anything you can do yourself instead of asking Tori to.
- After each build: send the video file, update the online page, say what changed in a few lines, and give
  timestamps.
- Images attached in a message sent while you are mid-task are not saved to disk; ask Tori to resend them in a
  new message.

## Gotchas

- Image changes do not invalidate the render cache: re-render the affected scenes with `--only ID --force`.
- After changing the hash rules in render.mjs, run `node tools/render.mjs --rehash` before re-timing.
- Never stop processes with `pkill -f` on a pattern that matches your own shell; loop over /proc instead.
- Photo sites (pexels, unsplash, wikimedia) are blocked by the network policy; npm, pip and GitHub release
  downloads work.
