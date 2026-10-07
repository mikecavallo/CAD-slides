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
  warning signals) for later chapters; Chapter 3 is the ABCs, and Chapter 4 adds heat and the thermometer to the pot. Sync the lesson
  file to the doc before every build; the doc wins.

## Current structure (Chapter 1 is finished, pending Tori's later edits)

- `ch00` Welcome: `ch00s01` title slide (headshot, training photo, name and credentials).
- `ch01` "Starting with the Basics": the chapter card plays first, then `ch00s02` the plan slide (id kept so
  its recording still matches; cards: Why you're here / What you'll gain / How we'll get there; steps:
  "The difference between reactivity and aggression", "The ingredients that shape behavior"), then
  `ch01s01` to `ch01s12` without `ch01s11` (definitions, look beyond the label, why, the seven bowl ingredients, putting
  it together; the Pain slide ch01s11 was removed in Chapter 2 round 12, its code is still in c1d.js but unused). Last slide (ch01s12) now matches Chapter 2: after the eight chips drop in, the bowl steps aside, a glass
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
- Round 7 feedback (applied): s06 magnifier is blue (#2f7fae) so it doesn't blend into the green dog; s07 slider
  phrases sit on two lines each; s10 "That day: harder to handle" (red emphasis, it is a bad thing); s11 no longer reads
  the list of fixes aloud (Tori cut "We may be able to address pain or illness ... more opportunity for recovery." from the
  narration; it must go from the doc too): the six factors still turn green one after another with drops lifting out
  and the water dropping, during "do something about" and "lower the water level".
- Round 8 (Tori's new copy, mood): mood is part of the baseline. s02 adds "Part of that baseline is the dog's mood" and
  the emotions/broader mood line (fast emotions line over a slowly shifting mood band); s03 adds "The water level reflects
  the dog's overall starting state, including their cumulative mood" and "The water level doesn't tell us how aroused or
  stressed the dog is in that particular moment. We'll add that part later."; s07 "can also interfere with rest and
  recovery" + "Over time, either extreme can influence the dog's overall baseline" (Too much column: "Gets in the way of
  rest and recovery"); s08 is "Emotions, Mood & Recovery" (also the area name everywhere): fast emotions line with Fear /
  Frustration / Excitement / Settling chips over a slow mood line, the coworker graph ("Something else happens",
  "Different response"), repeated experiences and too little recovery drip into the pot, quiet event; no next-chapter
  tag; s10 "several emotional experiences" and "together they can influence the dog's mood and raise the water level";
  s12 narration no longer says "distant antecedents" (the on-screen "The water = distant antecedents" label stays),
  one check, "Overall baseline / Including cumulative mood", one card "Arousal and stress in the moment?".
- Round 9: s02 definition card says "Baseline" (no equal sign); emotions line is irregular, labelled "Emotions: constantly
  changing" (Tori: emotions change continually, not necessarily up and down) and "Mood: shifts over time" (moods don't
  necessarily shift slowly; s08 "Mood: builds over time"); s08 emotions line pieces join; s12 right frame is "Still to
  come: ?" then "Chapter 4: Temperature" (no "Part 3").
- Round 10: the pot outline is open at the top (no line across the mouth; c2_pot.js); s02 cut the sentence "Emotions are
  constantly changing throughout the day ... longer periods of time." (repeated s08) and keeps only "Part of that baseline
  is the dog's mood."; the full emotions and mood explanation lives on s08.
- Round 11: s01 "Now: can be changed, managed, or improved" lights one word at a time as it is said; s08 opening is no
  longer a line graph: a dog in a soft panel, a bubble pops up and fades for each feeling (emotions in the moment) and
  the panel's colour shifts a little each time and stays shifted ("Mood: the overall tone, shaped by all of these");
  s08 beat 7 pill "Mood affects whether the water goes up or down" (mood does not raise the water by itself), the water
  moves up and down; s12 ends with a Claude-written bridge (Tori asked for it): "We'll get to temperature later. First,
  in the next chapter, we'll step away from the pot and look at the ABCs of behavior." with a Next chapter / The ABCs of
  Behavior / A B C card before the logo close.
- Round 12 (Tori decided): Pain and discomfort is no longer a Chapter 1 ingredient; it lives only in Chapter 2 (s06). The
  bowl and every pot hold seven ingredients (C1.ING). Chapter 2 s01 lost "You'll notice that some of those factors appear
  again here. That's intentional." and the then/now pairs; its line is now "In this chapter, we're focusing on factors
  that can be changed, managed, or improved." with Changed / Managed / Improved lighting word by word. s12's thermometer
  goes in through the middle of the pot's opening (front rim redrawn over it).
- Decisions: the pot is glass so the level shows; no heat or thermometer until ch02s12's last beat (doc says so);
  s01 reuses the Chapter 1 bowl (Breed history, Past experiences, Training tools, Pain return); s07 shows the
  doc's eight examples split Too little / Too much under a balance beam. Two lines Claude wrote are not in the doc
  yet: the intro/plan narration, s01's "add those ingredients to a pot of water" line, s06's stoic line and s12's
  distant antecedents line.
- Recordings: `Ch02intro.m4a`, `Ch02plan.m4a`, `Ch02s01.m4a` ... `Ch02s12.m4a` (rename Tori's files to match).
- The lesson has `"tail": 5.0` (applies to its very last slide only) so the thermometer reveal holds before the logo close.
- Online preview (temporary AI voice): https://claude.ai/artifact/Nzf2aTAYk5iAVNdqKmb1Js (`out/web/chapter2/`).

## Markers and Mechanics (Core Skills course video; was "Your Training Mechanics"; preview voice only)

- Script source of truth: Tori's Google Doc "Your Training Mechanics: Narration Script", id
  `1_KZQVrH49fPoTVFp-EzrqNILy9VyYOZVu5xb4SV4v_k` (Claude created it from the first draft; Tori rewrote it on Oct 4 and
  the video was rebuilt from it: "start over with the script"). Sync `script/lesson-mechanics.json` to it before every
  build; the doc wins. The original deck (6- Your Training Mechanics.pptx) is superseded.
- Lesson `script/lesson-mechanics.json` (`LESSON=lesson-mechanics.json`), series title "Markers and Mechanics" (Tori's
  welcome line). Ids prefixed `tm`. Chapters = the doc's sections, each with the automatic silent card labelled "Part N"
  (chapter `"kicker": "Part"`, read by timing.py and lib.js): `tm00` Welcome (title, plan with four cards), `tm01`
  Understanding Markers and Food Games (s01 to s06), `tm02` Choosing Your Markers (s01), `tm03` Practicing Your
  Mechanics (s01, s02), `tm04` Teaching Your Dog (s01 to s06), `tm05` Using Your Markers During Training (s01, s02 with
  the logo close). Food games: to the mouth, toss (chase), scatter; each game has its own marker word.
- Scene code: `video/scenes/tm_kit.js` (`window.TM`: heads, video frame and video slide, rows, treat, bubble, word chips,
  order strip), `tma.js` to `tme.js`.
- Video slides (Tori's own clips, narrated over): tm01s06 position changes, tm03s02 practicing without a dog (no
  thumbnail; green placeholder), tm04s02 introducing Yip, tm04s03 treat tosses, tm04s04 scatters, tm04s06 a dog responding
  to the clicker (assumed the Quill clicker video). `"clip"` block per scene; Tori's file goes in
  `clips/<scene id>.mp4` (gitignored; YouTube is blocked here). timing.py stretches the slide to the clip; assemble.py
  overlays it in the frame, muted by default.
- Open with Tori: the doc's position-changes line still says his marker is "x" (placeholder; on screen shows no word);
  typos fixed in the lesson only ("Hre we are working in him" -> "Here we are working on him").
- Round 1 feedback (applied): every slide's kicker is the course title "Markers and Mechanics" (TM.head ignores the
  per-slide kicker); plan slide is What you'll learn / How we'll get there (five parts) / Why it matters; filmstrip frames
  Standing, Looking away, Sit!, Getting up, Pulling on the leash, and the drawn green dog sits then gets marked
  (`TM.sitDog`); the treat-to-the-mouth icon is the dog, never a person's face; on screen the marker itself is "Mark", not
  "Word" (Mark, Pause, Move); tosses are low and along the ground like bowling (`TM.lowToss`), never arcs through the air;
  sessions use a different marker each (Yip, Chase, Scatter); "A consistent response" (no "not dramatic"); tm05s01 redesigned
  as a clean four-column sequence (Tori found the circle loop childish). Tori's illustrations: `tm_img_checkin.jpg`
  (tm01s05, revealed left half then right), `tm_img_mouth.jpg`, `tm_img_toss.jpg`, `tm_img_scatter.jpg` (tm04s02 to s04:
  the picture shows in the video frame first, then the clip plays: clip `"fit": "contain"` and `"atBeat"`, which timing.py
  turns into the clip start time). Narration changed at Tori's request (paste into the doc): tm01s04 b0 "standing still
  to take a treat from your hand", tm01s05 b0 "a way to get your dog's attention", tm04s03 new bowling beat, tm04s06 b1
  "before moving the hand with the food".
- Round 2 feedback (applied): Tori's pictures are cut into clean panels (no black or white background; `tm_ck_good/bad`,
  `tm_mouth_1..3`, `tm_toss`, `tm_scatter`) and animated like the other courses: food-game cards (tm01s01/tm02s01) use them
  as headers; tm01s05 shows the check-in and pulling scenes as two framed pictures; tm04s02 plays the three mouth panels
  (Mark, Pause, Treat to the mouth) one by one in the frame before the clip. tm01s04: worry sign moved in, hand clear of
  the words; the "another dog" line showed the magnet hand (removed in round 8).
  tm04s03 "vary the distance" only (narration changed too). tm04s06 is now Tori's blind dog hearing his markers ("treat" =
  to his mouth, "get it" = head to the floor for a scatter; narration written by Claude, clip pending; the clicker example
  is out). tm05s01 is three steps: Mark, Pause, Move (your hand to deliver the treat).
- Round 3 feedback (applied): plan has two cards (What you'll learn: What markers are / Why we use food games / How to
  teach them; Why it matters). Tori's pictures are always shown whole, never cropped (natural aspect, no Ken Burns).
  tm01s02 is a row of the three pictures with labels only (no word chips). tm01s03 scatter is only "sniffing and
  searching" (narration changed). tm01s04: magnet hand explained in a new beat ("walk them away ... if your dog looks,
  they'll react"), handler drawn to match her pictures. tm01s05 caption "You will reinforce pulling and staring." Choosing
  markers is now four slides: tm02s01 mouth, tm02s02 toss (Chase, Toss, Get it), tm02s03 scatter, tm02s04 one word each /
  avoid good, yes / reserve. Teaching slides say "Mark, pause, move: <the delivery>". Toss and scatter each have a picture
  slide and a separate video slide (tm04s03v, tm04s04v; one Claude-written line each). tm04s06 "Responding to his markers".
- Round 4 feedback (applied): magnet hand handler wears a grey jacket (no green next to the green dog), stands on the
  dog's paw line, and the dog's legs walk too (both swing in step, tail wags). tm02s03 name "Treats scattered"; the game
  name and its words stack in one column so they never overlap. Words added: mouth "X" (Tori's own marker word), toss
  "Free", scatter "Get it" (narration updated; paste into the doc).
- Clips received: tm04s03v = Tori's "Fisher free bowling at park" (24 s, uploaded Oct 5; clips/tm04s03v.mp4, re-upload in a
  new session). It plays with its own sound (volume 1) after the slide's narration line (clip `"afterNarration": true`).
  YouTube downloads fail from this container (bot check, googlevideo.com blocked): Tori uploads files instead.
- Review videos: Tori asked to see only what changed. Build the full video as usual, then
  `python3 tools/changes_reel.py --video out/NAME.mp4 --ids <changed ids> --out out/NAME-changes-roundN.mp4` (each part is
  labelled with its slide title and its time in the full video) and send that. Full video only when Tori asks.
- Premium pass (Oct 6, Tori asked for "$5,000 course" quality): the lesson's series block has `"motion": "cinematic"`
  (video/lib.js): the background drifts like a slow camera move on every slide and slides exit with a lift and soft blur.
  Other lessons are unchanged. Still needed for the premium feel: Tori's real voice, a licensed music track (`assemble.py
  --music FILE`, ducked under the voice), Tori's real clips, and ideally a short on-camera intro and outro by Tori.
- Round 6 (Oct 7): tm01s02 animates the three food-game pictures as they are named (pictures stay whole): the named one
  lifts and the others soften; a ring pulses at the hand and mouth; a treat skims low along the floor leaving a dotted
  trail to where it lands; treats drop from the hand to the ground with small rings; tags "Your hand" / "The ground"
  pop on the last line. Tori rejected the drawn-dog animation test on tm01s03 ("terrible"; reverted): Claude's code-drawn
  characters are not good enough; animate over Tori's pictures and clips instead. Tori is making AI clips in Kling
  (Motion Control with a reference cut from the Fisher clip: out/kling-motion-reference-toss-tight.mp4, start picture
  out/kling-start-toss-treat-in-hand.jpg).
- Round 7 (Oct 7, Tori: "much better, I want the animations to be quality like this"): the tm01s02 style is now a kit,
  `TM.pic` (Tori's picture whole, with an SVG layer and `P(nx, ny)` mapping picture fractions to px, cover crop aware)
  and `TM.fx` (ring, dots, toss, drops, tag). Applied to tm01s05 (gaze dots and ring on the check-in; red stare line,
  squirrel ring and red taut leash on the pull), tm02s01-03 (each game's mark on its picture), tm04s02 (ring per panel:
  the word, her still hand in amber, the treat at the mouth), tm04s03 (the bowling sweep and low toss drawn on her
  picture, replayed for "vary the distance" short then long; the old clip-art hand and sweep are gone), tm04s04 (treats
  drop from her hand, one ring takes in the scatter). Use this kit for every new picture slide.
- Round 8 (Oct 7): magnet hand is gone (narration beat and visual; Tori must delete "This is called a magnet hand ...
  they'll react." from the doc). tm01s04 is rebuilt on Tori's pictures: toss picture first, an amber warning pops
  behind the dog ("Something worrying, too close", red "Standing still for a treat here: harder"), she bowls a treat
  away and the dog follows (green "More space" line), then the scatter picture ("Enough space: scatter"), then the
  mouth picture ("Another dog"); Watch your dog / pattern games later underneath. The drawn dog and handler are no
  longer used in tm01s04.
- Round 9 (Oct 7): Tori said the indoor pictures don't fit a "something worrying" scene, tried Kling clips for it (moonwalking
  dogs, wrong toss direction, style drift) and found the AI-clip workflow "way too much". tm01s04 is now a distance strip
  (red "Too close" to green "Enough space", amber worry at the left, the dog as a green marker): red "Standing still for a
  treat this close: harder", two low tosses carry the dog away ("Treat chases, moving away"), a scatter around it ("Enough
  space: scatter"); Tori's toss, scatter and mouth pictures appear underneath as each game is named ("Another dog: food to
  the mouth" lifts while the strip dims). Don't push more AI-clip work on Tori unless asked.
- Round 10 (Oct 7): Tori's clips came from Drive (folder "Videos"; Tori set them to anyone-with-link; the Drive connector
  cannot pass big files, so download with curl from drive.usercontent.google.com/download?id=ID&export=download&confirm=t;
  originals in clips/src/, gitignored). Tori will NOT narrate over videos: every clip slide has a short intro line, then
  the clip plays FULL SCREEN with its own sound (clip `"full": true` + `"afterNarration": true`; assemble.py fills bars with
  a blurred copy, adds a branded label from the clip's `label`, fades in from and back out to the slide, levels the
  clip's speech to the narration). Mapping: tm01s06 = Marker Timing X Sit to Stand; tm04s02 = VerbalCuewithFisher (0 to
  21 s); new tm04s03e = Eskara Free Marker Intro (learning the toss marker); tm04s03v = Fisher toss, new line "a dog who
  already knows the game ... knows where to move for the next treat"; tm04s05 = Clicker - Testing Understanding (vertical,
  the drawn dog is gone); tm04s06 = LSM Jeter captions (blind dog Jeter). Pending: Tori's scatter video (reinforcing a dog
  for walking to the house without jumping up to grab an arm) for tm04s04v, with a line on why to use a scatter.
  Part cards (bumpers) open with a branded two-band green wipe when the series motion is cinematic.
- Round 11 (Oct 7): Tori prefers demo clips IN the slide frame so the steps stay visible; only the response videos
  play full screen (tm04s05 clicker testing understanding, tm04s06 Jeter). In-frame clips still play after the
  narration with their own sound (levelled), bars filled with a blurred copy. A step strip under the frame lights each
  step in sync with the clip (lesson clip `steps`, `marks` = seconds into the clip where the marker is said, optional
  `stepOffsets`; default 0 / 0.6 / 1.3 s): tm01s06 Mark "X" / Pause / Treat to his mouth, tm04s02 Yip, tm04s03e Free,
  tm04s04v Calm walking / Mark "Scatter" / Scatter treats. tm04s04v = Tori's "Scatter example" (no sound, her own
  caption): a dog marked for calm walking to the house BEFORE any jump, never after jumping (Tori's point; rows say so).
  New Claude-written lines to add to the doc: tm04s03e Eskara line, tm04s03v Fisher line, tm04s04v scatter line.
- Round 12 (Oct 7): Tori dislikes the lighting step strips: removed (no `steps` in any clip; the kit code stays but is
  unused). ALL clips now play in the slide frame, none full screen (Jeter too). tm04s05's vertical clicker clip sits in a
  tall frame at the right (box [1188,190,632,790], clip `crop` [0,480,1080,1344] keeps the middle so Tori's burned-in
  captions read clearly); rows, the two chips side by side and the Separate sessions / Familiar / Mix markers strip at
  the left (fixes the "Always follow through" overlap).
- Online preview (temporary AI voice): https://claude.ai/artifact/B8pBdUZTzKtNcMKikyfiXf (`out/web/mechanics/`).
- Recordings: `Tm00intro.m4a`, `Tm00plan.m4a`, `Tm01s01.m4a` ... named by scene id.

## Recordings (Tori's voice)

- One file per slide, named by scene id: `Ch01s05.m4a` (case does not matter). A slide in pieces:
  `Ch01s07_part_1`, `Ch01s07_part_2`. Files go in `reactivity-part1/narration/`.
- `narration/` is gitignored (the repo is public), so **recordings are not in GitHub**. In a new session, ask
  Tori to re-upload the takes for any slide being rebuilt with voice.
- Chapter 1 takes still needed (Oct 4): `Ch00s01` (new title) and `Ch01s12` (pain gone, water ending). Until then
  the Chapter 1 build uses the stand-in voice for those two slides (narration/ch00s01.wav, ch01s12.wav, made from the
  scratch clips; delete them when Tori's takes arrive).
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

- Ingredient bowl metaphor and the seven chips (Pain moved to Chapter 2 in round 12); photo portraits for genetics (barking Sheltie = more
  sensitive, scruffy white dog = more easygoing); "Before birth" uses a sprout icon.
- Breed slide: six job cards (Herding: Aussie, Guarding: Great Pyrenees, Hunting: Beagle, Terrier: Jack
  Russell, Sporting: Golden Retriever, Working and assistance: black Lab), each enlarges with a small vignette;
  silhouettes row is cut from real photos and the logo (`assets/img/sil_*.png`).
- "Same behavior, different reasons" on the barking slide.
- The iceberg is retired: the pot replaces it for "what is under the behavior". Keep the pot to four pieces: ingredients
  (what shaped the dog), water level (baseline, distant antecedents), temperature (arousal, stress and emotional state in
  the moment, seen as the water going still, simmering, boiling; the thermometer reads it; the trigger is the heat;
  emotions fluctuate constantly and each emotional event leaves a drop behind: they add up to mood, which is the water), boiling over (the reaction). The rim is
  the threshold. Zones: under = water warm, bubbles stay low (can think, eat, learn); at = bubbling up near the rim
  (stiff, staring, slow to respond); over = spilling over the rim (reacting, can't eat or listen). Learning happens under
  threshold. Never say a fuller pot boils with less heat (physically wrong, Tori caught it): a fuller pot has less room
  before it spills over.
  Triggers too close together (stacking) = temperature: heat comes back before the water cools, so a small trigger tips
  it over. Triggers too close over days or weeks = water level: the baseline itself rises, leaving less room. No new pot parts for either.
  Three ways to boil over: one big trigger (fast spike), trigger stacking (separate, labeled triggers; the thermometer
  starts to cool, then the next one hits before it is back down; the same triggers spaced out cool fully and never
  spill: the spacing is the problem), and the slow one (days or weeks raise the water, so an ordinary trigger spills).
  Chapter order (Tori, round 9): Chapter 3 steps away from the pot for the ABCs of behavior; Chapter 4 is temperature.
  Chapter 4 plan (doc has no text yet): temperature, threshold zones, two pots same heat, stacking, long-term
  stress. A drawn dog (C2.dog) stands beside the pot and its body language follows the zone: loose under, stiff at the
  rim, reacting when it spills. The ABCs come first, in Chapter 3.
  Concept test clip: `script/lesson-concept.json` + `video/scenes/c3x.js` (boil kit: foam, spill, burner, dial,
  thermometer, dog body language). It is registered in video/index.html; back up build/timing.json and run the preview pipeline with
  LESSON=lesson-concept.json. It answers one question: why
  this reaction, this big, right now. Do NOT map steam, lids, kettles or consequences onto it; the ABC panels and plain
  language carry function, consequences and training. After training: temperature still rises a little but stays
  below boiling ("a dog with a better plan").
- On-screen text never uses em or en dashes.

## Building new chapters

- Brand and shared slides live in `reactivity-part1/video/series.js` (`BRAND`; `SKIT` title slide, chapter card, plan
  slide, logo close); each lesson file has a `"series"` block (course title and title-slide line breaks). Chapter 2
  uses the kit (verified pixel-identical); Chapter 1's c0.js still has its own copy, left alone until Tori's re-records.
  A new course under the same brand = new lesson files with their own series block, nothing else.
- The render cache ignores the scene `<script>` lines in index.html, so registering a new chapter or video does not
  re-render the others.
- Use the project skill `.claude/skills/build-chapter-video/` (Tori sends copy plus directions; Claude asks once
  about real gaps, then builds and delivers). Tori-facing template: its `references/intake-template.md`.

## Standalone videos

- One-off branded videos (tips, promos, announcements) use the skill `.claude/skills/build-branded-video/`: same
  frame and shared slides, no chapter number or card, `script/video-<slug>.json` + `video/scenes/v_<slug>.js`.
  Template: `script/video-example.json` / `v_example.js` ("Spot It First", title slide, one tip slide, logo close with
  a call to action). 16:9 only.

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
