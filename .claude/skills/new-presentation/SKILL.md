---
name: new-presentation
description: Starts a brand-new Calling All Dogs presentation (a new course video or a new course) that matches the look and workflow of the videos already made, especially Markers and Mechanics. Use when Tori types /new-presentation, or says "start a new presentation", "new course video", "new course", or "make another one like Markers and Mechanics". Tori adds the title, the course name and where the script is (Google Doc link or pasted text). For a new chapter of an existing course use build-chapter-video; for a one-off tip or promo use build-branded-video.
---

# Start a new presentation that matches the others

Tori's request: $ARGUMENTS

Tori should give a title, the course name (for example "Core Skills course") and the script (a Google Doc link or
pasted text). If any of those are missing, ask for them in your one round of questions (step 3), not before.

## 1. Branch and tools

- The newest toolkit (cinematic motion, the picture animation kit, in-frame video clips, the changes reel,
  `web_page.py --kicker`) lives on `claude/fervent-dijkstra-pee98t` (Markers and Mechanics, pull request 8) until that
  is merged. If `reactivity-part1/video/scenes/tm_kit.js` is missing from your checkout, base your work on that branch:
  `git fetch origin claude/fervent-dijkstra-pee98t` and create your branch from it (the branch this session was told
  to develop on, if any; otherwise `claude/<short-name>`). Once it is merged, the default branch is the base.
- Never push to another presentation's branch. Open a draft pull request when you push.
- Read `CLAUDE.md` at the repo root (including the Markers and Mechanics notes) and follow the
  `build-chapter-video` skill for the gap check, build, QA and delivery. For a one-off video use `build-branded-video`
  instead and leave out the plan slide and part cards.

## 2. Match Markers and Mechanics

The reference is `script/lesson-mechanics.json`, `video/scenes/tm_kit.js` and `tma.js` to `tmd.js`.

- Its own lesson file `script/lesson-<short-name>.json` with its own `"series"` block (title, title-slide line breaks,
  `"motion": "cinematic"`) and its own scene id prefix. Run every tool with `LESSON=lesson-<short-name>.json`.
- Opening: the title slide with Tori's headshot, name and credentials (Tori Ganino, BS, CDBC, CPDT-KA), then a
  "Where we're headed" plan slide. Never label its cards problem, promise or plan. Part cards between sections, the
  logo close at the end.
- Tori's pictures are shown whole, never cropped, and animated with `TM.pic` / `TM.fx` (rings, dotted paths, low
  tosses, tags). No code-drawn dogs or people: Tori rejected them.
- Tori's video clips play inside the slide frame with their own sound, after a short intro line. No captions that
  repeat the rows beside the frame.
- On screen: no em or en dashes; paw prints for dogs, never human feet; brand greens for good things, red and amber
  only for bad things.

## 3. Script and questions

- The script doc is the source of truth. Claude cannot edit Tori's doc: give paste-ready text for every line you
  change or write, and keep the full current narration in a separate Google Doc in Tori's Drive, updated each round.
- Read everything first. Then ask all real questions once, in one numbered message, each with your recommended
  answer. Then build without stopping.
- Use the temporary AI voice until Tori's recordings arrive. Recordings are named by scene id and are gitignored, so
  in a new session ask Tori to upload them again. Images attached while you are mid-task are not saved: ask Tori to
  resend them in a new message. Photo sites are blocked, so Tori supplies pictures (Claude can composite or clean them).

## 4. Each round

- Send the video in chat (under 88 MB; use the compressed copy), update the online preview page (republish the same
  file path to keep its link), and say what changed in a few lines with timestamps.
- For review rounds send only a changes reel of the slides that changed (`tools/changes_reel.py`).
- Add the presentation's decisions and links to `CLAUDE.md` so the next session can pick it up.

Talk to Tori directly and briefly: no filler, no em dashes, no step-by-step narration of what you are doing. Give a
recommendation, not a menu. Do anything you can do yourself instead of asking Tori to.
