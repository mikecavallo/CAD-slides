---
name: build-chapter-video
description: Turns Tori's chapter or section copy plus animation and image directions into a finished narrated, animated Calling All Dogs slide video (HTML + GSAP scenes rendered to MP4), and asks Tori for anything missing before building. Use this whenever Tori sends script copy, a doc section, slide-by-slide narration, "On screen" or "Visual" directions, images for a slide, or says things like "build chapter 3", "make the video for this section", "turn this into slides", "animate this part", or "here's the next chapter", even if they don't say "video". Also use it for a new section or single slide added to an existing chapter.
---

# Build a chapter video from Tori's copy

Tori writes the words and says what they want to see. You turn that into a finished video in the house style,
using the pipeline already in `reactivity-part1/`. Read `CLAUDE.md` at the repo root first: it holds the decisions
Tori has already made (the bowl and pot metaphors, colours, what is retired). Those decisions outrank anything you
would invent.

The goal is a video Tori can review in one pass, not a conversation. So ask once, up front, only about what you
truly cannot decide, then build without stopping.

## 1. Gather the input

The copy arrives one of three ways:
- **In the Google Doc** (id in CLAUDE.md). Read it with the Google Drive connector. A chapter sits between marker
  lines like `END CHAPTER 2 MATERIAL`; take only the section Tori named. The doc wins over anything in the repo.
- **Pasted in chat.**
- **Attached** (doc, PDF, text). Read the whole thing.

Per slide you want: a heading, the narration, and what should be on screen. Tori's doc uses this shape (see
`references/intake-template.md`, which you can hand Tori as a template):

```
## CH03,S04: Same heat, two pots
On-screen text: Same trigger. Different baseline.
Visual: two pots, same flame; the full one boils over
Image: none
Narration: ...
```

Images: an image attached to a message Tori sent while you were mid-task is NOT saved to disk. If a direction
names an image you cannot find in `reactivity-part1/assets/img/` or in this conversation's uploads, that is a gap.

## 2. Gap check: ask once, in one message

Build a slide list for yourself (id, heading, narration, visual). Then sort every open point into two piles.

**Decide yourself, don't ask** (Tori hired you for this): layout, icons, colours within the brand rules, animation
style, timing, which existing module to reuse, how to show a direction that is clear but loose ("show the dog
getting tense"), and the visual for a slide with no direction at all (design one that fits the narration and the
chapter's metaphor, and list it under "My choices" in the delivery note).

**Ask Tori** only when the answer changes what gets built and you cannot get it from the doc, the repo or CLAUDE.md:
- Chapter number or title is missing, or it is unclear where the section starts or ends.
- A named image or photo is not available (photo sites are blocked by the network policy, so you cannot fetch one).
- A direction contradicts a decision in CLAUDE.md (for example it brings back the iceberg, adds a new pot part,
  uses red or orange for something good) or contradicts another slide.
- The copy states a fact that looks wrong or shaky (a number, a "studies show", a medical claim). Say what and why.
- The narration and the on-screen direction disagree.
- A metaphor would break if shown literally (Tori has caught physics errors before: a fuller pot does not boil faster).

Defaults you apply without asking, unless Tori says otherwise: a title slide and a plan (agenda) slide at the
start, like Chapters 1 and 2, with narration you draft; a narrated chapter card; the temporary AI voice until
Tori's recordings exist; on-screen text taken from the copy.

Write the questions as one numbered message, each with your recommended answer, so Tori can reply "go with your
picks" or answer only the ones they care about. No preamble. Example:

> Before I build Chapter 3, four things:
> 1. The doc has no chapter title. I'd use "Temperature and Threshold". OK?
> 2. S06 asks for "the photo of Bella at the fence". It isn't in the assets. Can you send it in a new message? Until then I'll use a drawn dog.
> 3. S09 says stress hormones take 72 hours to clear. The evidence for that number is thin; I'd say "longer than you think". OK?
> 4. S04's visual says the full pot "boils sooner". It actually has less room before it spills; I'd show that. OK?

If nothing is open, skip the questions entirely and start building. Never ask "should I proceed?".

## New course (first chapter of a new series)

The brand stays Calling All Dogs, so a new course needs very little: everything shared lives in
`reactivity-part1/video/series.js` (`BRAND`: presenter, credentials, logo, headshot, photo, url; `SKIT`: the title
slide, narrated chapter card, plan slide and logo close) and in the page frame (`lib.js` chrome: corner logo, footer
url, chapter tab). Scenes never hard-code any of that.

What a new course does need, and the only things to ask Tori about if the copy doesn't say:
- **Course title**, plus where the title slide should break the line (e.g. "Understanding" / "Dog Behavior").
- **File prefix** for its lessons, short and lowercase (e.g. `leash` gives `lesson-leash-ch1.json`). Decide it yourself.

Every lesson file of the course carries the same block, which the title slide and plan read through `build/timing.js`:

```json
"series": { "title": "Leash Skills", "titleLines": ["Leash", "Skills"] }
```

Then build chapter 1 like any other: `SKIT.titleSlide(ctx)` for the intro, `SKIT.chapterCard(ctx, 1, 'Title')`,
`SKIT.planSlide(ctx, [...], cues)` with the `SKIT.PLAN.why / gain / how` presets, and `SKIT.logoClose` at the end.
The course's metaphors and decisions get their own section in CLAUDE.md as they are made; the Understanding Dog
Behavior pot and bowl belong to that course only, unless Tori brings them over.

A brand change (new logo, credentials, url) is one edit in `series.js` and re-renders everything, because the file
is hashed into every segment.

## 3. Build

Follow `references/pipeline.md` for files and commands, and `reactivity-part1/video/SCENE_GUIDE.md` for scene
code (its hard rules and "check your work" section are required reading before writing a scene).

1. **Lesson file.** A new chapter gets its own `reactivity-part1/script/lesson-chN.json`, shaped like
   `lesson-ch2.json`. Narration goes in verbatim from the copy; split it into beats at the points where the
   picture should change (roughly one idea per beat). Put lines you wrote yourself (intro, plan, card, any bridge
   line) in the lesson and keep a list of them for the delivery note, because Tori has to paste them into the doc.
2. **Scenes.** One scene per slide, in new files `video/scenes/cN*.js`, registered in `video/index.html`. Reuse
   what exists before drawing anything new: `SKIT` (title, card, plan, close), `C1` (bowl, ingredients, labels), `C2` (pot, water level, drips,
   dog, pills, logo close), and the concept kit in `c3x.js` (foam and spill, burner, dial, thermometer, dog body
   language). Fire each animation on the word it illustrates with `C1.sayAt(ctx, beat, 'phrase')`, so the picture
   follows Tori's voice. Keep on-screen text short and free of em or en dashes.
3. **Check stills before rendering.** `node tools/snap.mjs <scene> <times...>` and look at every sheet. Fix text
   that overlaps or runs off the frame, things visible before their beat, and anything that misreads the metaphor.
   This is the cheapest place to catch mistakes; a full render takes minutes.
4. **Render, assemble, compress, publish** with the commands in `references/pipeline.md`.

## 4. Deliver

Send the compressed video with SendUserFile, update or create the online page, then reply in a few short lines:
- what the video covers, with a timestamp per slide (take them from `build/timing.json`);
- **My choices**: visuals you designed where the copy gave no direction, in one line each;
- **Paste into the doc**: every narration line you wrote, ready to paste;
- anything still open (a missing photo, a re-record needed).

Then record the chapter in CLAUDE.md (structure, decisions, Tori's feedback rounds as they come), commit, and push.

## 5. Feedback rounds

Tori reviews by timestamp ("at 2:41 the icon should..."). Map each timestamp to a scene and beat with
`build/timing.json`, apply every point, re-render only the changed scenes (`--only ID --force` after image
changes), and deliver again the same way. If a point would undo a decision in CLAUDE.md, say so in one line and
recommend; don't silently comply or silently refuse.

## How to talk to Tori

Direct and short. No filler, no em dashes, no narrating your steps. Give a recommendation, not a menu. Do anything
you can do yourself instead of asking Tori to. Refer to Tori by name; pronouns were never stated, so use none or
they/them.
