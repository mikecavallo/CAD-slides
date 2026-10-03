---
name: build-branded-video
description: Makes a standalone Calling All Dogs video, outside the course chapters, with exactly the same look and format as the chapter videos (frame, colours, fonts, title slide, logo close, narration-synced animation). Use this whenever Tori wants a one-off video, such as a training tip, promo, class or workshop announcement, client FAQ, welcome or onboarding video, testimonial-style explainer, or social clip, or says things like "make a video about...", "a quick tip video", "a promo for my class", "a short branded video", even if they don't say "branded". For a chapter of a course, use build-chapter-video instead.
---

# Build a standalone branded video

A branded video is a chapter video without the course around it: same frame, same title slide, same animation
style and logo close, but no chapter number, no chapter card, and its own title. Everything else works exactly like
`build-chapter-video`, so read that skill first and follow its sections 1 (gather input), 2 (gap check, ask once),
3 (build) and 4 (deliver). This file only covers what is different.

Read `CLAUDE.md` too: the brand rules apply. The course metaphors (the bowl, the pot) belong to Understanding Dog
Behavior; use them in a standalone video only when the topic is the same idea and Tori would recognise it.

## What to ask (on top of the chapter skill's gap check)

Only ask what the copy doesn't answer, in the same single numbered message, each with your recommendation:
- **Title** for the title slide, and where it breaks into lines. Recommend one from the copy.
- **Call to action** at the end, if any (book a session, sign up for a class, visit the site). Recommend the most
  likely one from the copy; if the copy has none, use no extra line.
- **Voice**: Tori's recording or the temporary AI voice. Default: the temporary voice as a preview.

Decide yourself: length (follow the copy), whether a plan slide is needed (only for videos over about three minutes
or with four or more sections), layout and animation.

Format: 16:9 landscape (1920 by 1080) only. If Tori asks for vertical or square (Reels, TikTok, Stories), say plainly
that the frame and every layout are built for landscape and that a vertical version is a separate layout job, then
recommend doing that as its own project rather than squeezing the landscape design.

## Files

A short lowercase slug names everything (`spot-it-first` becomes `spotitfirst` in ids):
- `reactivity-part1/script/video-<slug>.json`: one chapter, `"num": 0` (the footer tab stays empty),
  `"bumper": false`, and a `"series"` block holding the video's own title:
  `"series": { "title": "Spot It First", "titleLines": ["Spot It First"] }`.
  Scene ids `v<slug>01`, `v<slug>02`, ... Add `"tail": 2.5` so the logo close holds.
- `reactivity-part1/video/scenes/v_<slug>.js`, registered in `video/index.html`. Registering a file there no longer
  re-renders other videos (the render cache ignores the scene script lines).

The working template is `script/video-example.json` with `video/scenes/v_example.js`: a title slide, one content
slide, and the logo close with a call to action. Copy it and change the content.

Shared pieces (from `video/series.js`):
- `SKIT.titleSlide(ctx)`: the first scene, always. Narration like "Hi, I'm Tori Ganino with Calling All Dogs.
  Here's ..." ending on the title, so the title animation lands on it.
- `SKIT.planSlide(ctx, cards, cues)`: only for longer videos.
- `SKIT.logoClose(ctx, t, hide, { cta: 'Help with walks? *Book a session*' })`: the last scene ends with it; `cta`
  is optional.
- `C1` and `C2` modules (bowl, pot, dog, pills, labels) work in `v_` files; the render cache already counts them.

## Build and deliver

Same commands as the chapter skill (`build-chapter-video/references/pipeline.md`) with `LESSON=video-<slug>.json`.
Name the output after the video, e.g. `assemble.py --name Spot-It-First-PREVIEW-temp-voice --no-chapters`. Deliver
the same way: compressed video through chat, an online page, a few lines with timestamps, your design choices, and
paste-ready text for any narration you wrote. Record the video in CLAUDE.md under "Standalone videos", commit, push.
