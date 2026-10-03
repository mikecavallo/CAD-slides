# Calling All Dogs course videos: handoff notes

Read this first in any new session. The project lives in `reactivity-part1/` (see its README for the build
pipeline). This file records the state, decisions and working agreements from earlier sessions.

## The project

- Trainer and narrator: **Tori Ganino, BS, CDBC, CPDT-KA**, Calling All Dogs (callingalldogsny.com).
  Refer to Tori by name; pronouns were never stated, so do not assume any.
- Presentation: **"Understanding Dog Behavior"** (renamed by Tori in Chapter 2 round 4; it was "Getting Started with
  Dog Behavior: Understanding Reactivity and Aggression"), a narrated, animated slide video (HTML + GSAP scenes rendered to MP4, synced to Tori's recorded voice).
- Script source of truth: Tori's Google Doc "Reactivity & Aggression Part 1: Script v4 (one chapter)",
  id `13FHWVCWAWskM90w2_UFwAlC1o68YjxhpX_XuGuxaYDE` (read it with the Google Drive connector; Claude cannot
  edit it, so give Tori paste-ready text). Everything above "END OF FIRST CHAPTER MATERIAL" is Chapter 1. Between
  that line and "END CHAPTER 2 MATERIAL" is **Chapter 2: Your Dog's Baseline** (renamed from "Understanding Your Dog's Baseline") (CH02,S01 to S12, the
  water-in-a-pot chapter). Below that is older draft material (ABCs, function, four directions, leash walks,
  warning signals) for later chapters; Chapter 3 will add heat and the thermometer to the pot. Sync the lesson
  file to the doc before every build; the doc wins.

## Current structure (Chapter 1 is finished, pending Tori's later edits)

- `ch00` Welcome: `ch00s01` title slide (headshot, training photo, name and credentials).
- `ch01` "Starting with the Basics": the chapter card plays first, then `ch00s02` the plan slide (id kept so
  its recording still matches; cards: Why you're here / What you'll gain / How we'll get there; steps:
  "The difference between reactivity and aggression", "The ingredients that shape behavior"), then
  `ch01s01` to `ch01s12` (definitions, look beyond the label, why, the eight bowl ingredients, putting it
  together). Last slide (ch01s12) now matches Chapter 2: after the eight chips drop in, the bowl steps aside, a glass
  pot of water slides in ("Next: the water they go into"), then "Next chapter: Your Dog's Baseline"; new closing line
  "Next, we'll look at that water: your dog's baseline." (needs Tori's re-record, with the rest of ch01s12).
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
  drips, floating chips, the "room left" bracket, the drawn dog, logo close). Area colours: physical teal,
  activity blue, emotions olive, environment deep green (no red or orange for areas; red/amber only for bad things).
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
- Round 3 feedback (applied and rendered): never call it a "fuel chip", it is just a water drop ("One more
  piece: the water", Chapter 1 line rewritten in lesson.json, needs Tori's re-record of ch01s12); intro narration ends
  at the presentation title, the narrated chapter card `ch02card` ("This is Chapter 2...") replaces the auto bumper
  (chapter `"bumper": false`); welcome chapter num 2 so the footer tab shows 2; s01: "These can be changed, managed, or
  improved" / "The rest can't be changed", ingredients go into an empty pot first, then the water ("The water = your
  dog's baseline"); activity area colour blue; s07 Goldilocks line and beat; mental activity light blue; s11 factor
  pills turn green instead of new text; s12 "What triggered the reaction?"; logo close shows Tori's name and credentials.
- Round 4 feedback (applied): presentation title is now "Understanding Dog Behavior" (both title slides, both lessons;
  ch00s01 needs a re-record); no "one more piece" anywhere (Chapter 1 line: "something else ... the water they go into",
  on-screen "Next: the water they go into"); s01 combines the changed/managed/improved message into one header over the
  four returning ingredients plus a dashed "More factors in this chapter" pill; s01 ends with the ingredients in an
  EMPTY pot ("First: your dog's baseline"), the water first pours in on s03; puppies icon is a paw print; s06 stoic chart
  has only pain and time on its axes, "Looks fine on the outside" and the limp as notes on the line.
- Round 5 feedback (applied): chapter title "Your Dog's Baseline" (card, s01 heading, narration "This is Chapter 2: Your
  Dog's Baseline."); s01 beat 2 shows only the header words lighting up; physical health teal; drawn dog's collar runs
  across the whole neck under the ear; s07 line "less activity doesn't always mean a calmer dog" (on screen "Less doesn't
  always mean calmer").
- Round 6 feedback (applied): s01 no longer labels four ingredients "can be changed" (wrong: breed history and past
  experiences can't change). It pairs the four Chapter 1 ingredients that return in Chapter 2 with what they mean for
  the water: Breed history -> Breed needs met today, Past experiences -> Recent stress, Training methods -> How the dog
  is handled now, Pain -> Pain right now ("Chapter 1: what shaped the dog" / "Now: can be changed, managed, or improved").
  Rule: an ingredient is what shaped the dog before; the water is what is happening now.
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
- The iceberg is retired: the pot (ingredients + water + temperature) replaces it for "what is under the behavior".
  Plan for later chapters: water = distant antecedents, burner = immediate antecedent (A), thermometer = arousal and
  emotion, boiling over = the reaction (B), heat turned down = the consequence (C). After training the thermometer still
  rises a little but stays below boiling ("a dog with a better plan"), never room temperature.
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
