# Scene building guide

The video is a sequence of scenes rendered from HTML with GSAP. Each chapter has one file,
`video/scenes/chNN.js`, that registers every scene of that chapter:

```js
registerScene('ch03s02', ({ stage, tl, cue, end, dur, beats, chrome }) => {
  // build DOM into `stage`, add tweens to `tl` at narration cue times
});
```

Scene ids, narration (`say`), visual intent (`show`), on-screen text (`onscreen`) and assets come from
`script/lesson.json`. Beat `i` starts at `cue(i)` seconds (scene-relative). `end(i)` is when its narration
ends, `dur` is the scene length. The framework fades the whole scene out during its last 0.5 s.

## Hard rules

1. **Only GSAP tweens on `tl` may animate.** No CSS transitions/animations, timers, `Date`, randomness
   (use a seeded/fixed pattern instead of `Math.random`). The renderer seeks `tl` frame by frame.
2. **Time everything from cues.** Beat `i`'s visual change starts at `cue(i)` (you may lead by up to 0.3 s).
   Narration speed changes when the trainer records their own voice, so never hard-code absolute times.
   Small offsets after a cue (0.1 to 1.5 s) are fine. Long ambient motion should use `dur`.
3. **One visual change per beat**, exactly what the beat's `show` describes (adapt if something is
   unbuildable, but keep the intent). Nothing should reveal before the narration mentions it.
4. **Layout safe area**: canvas 1920x1080. Logo occupies the top-right box x 1590 to 1860, y 30 to 165:
   keep it clear. Footer occupies y > 975 (url bottom-left, green tab bottom-right): keep text out of it.
   Content lives in x 100 to 1820, y 110 to 960. Full-bleed photos may cover the footer; then call
   `chrome.hideUrl()` if the photo sits under the url at bottom-left.
5. **Readable**: no text smaller than 26 px. Headings 64 to 96 px (Rubik, green). Body 30 to 40 px.
   At most about 30 words of text visible at once. On-screen text supports the narration; it never
   transcribes it. Use the beat's `onscreen` text when given. Never use em or en dashes in any text.
6. **Never let things collide.** Text must not overlap other text, images, the logo or footer. When a
   heading may wrap, stack content with `K.flow()` instead of guessing y positions.
7. Only edit your own chapter file. Do not edit `lib.js`, `base.css`, `index.html`, tools, timing or the
   script. If you need a helper, define it inside your chapter file (wrap the file in an IIFE or use
   unique names so chapters don't clash; files share one global scope). Scene-specific CSS can be
   added with `K.el('style', null, css)` appended to `stage`, scoped with a unique class prefix.

## Brand look (match the trainer's slide deck)

- Soft white swirl background, logo top-right, green rule + url in the footer (all automatic).
- Titles: Rubik 700, green `#619537`, with the short light-green accent bar under them (`K.heading`).
- Body: Montserrat, ink `#212121`. Emphasis green bold. Warnings/negatives use red `#b8452d` sparingly.
- Palette (CSS vars): `--green #619537`, `--green-dark #3f6b22`, `--green-deep #2c4a17`,
  `--green-light #b8d99a`, `--green-pale #e8f1dc`, `--green-mist #f3f8ec`, `--olive #4b5a1e`,
  `--ink #212121`, `--ink-soft #4a4a4a`, `--muted #7a7a7a`, `--line #d9ddd3`, `--cream #f7f2e8`,
  `--red #b8452d`, `--red-pale #f8e3dd`, `--amber #d9912b`, `--amber-pale #fbefd9`.
- Rounded cards (26 px radius), soft shadows, green check-circle bullets, generous whitespace.
- Motion: calm and confident. Ease `power3.out`, 0.6 to 0.9 s reveals, small staggers (0.08 to 0.15 s).
  Gentle Ken Burns on photos. No bouncing everything; save `pop` for emphasis.

## Assets (`assets/img/`)

`photo_aggression.jpg` (portrait, snarling tan dog), `photo_reactivity.jpg` (landscape, fluffy white dog
barking), `photo_why.jpg` (portrait, Lab and Great Pyrenees on grass), `photo_reactive_to_aggressive.jpg`
(portrait, golden dog behind iron fence), `trigger_wordcloud.jpg` (portrait word cloud), `logo.png`,
ABC panels (landscape ~1.7:1): `abc_greet_{a,b,c}.jpg`, `abc_approach_{a,b,c}.jpg`,
`abc_before_{a,b,c}.jpg`, `abc_during_{a,b,c}.jpg`, `abc_after_{a,b,c}.jpg`. Source slides for reference:
`/tmp/claude-0/-home-user-CAD-slides/2fb12956-cdb7-57f8-a90e-23ee1987d1f2/scratchpad/pages/p-NN.png`.

Icons: any Lucide icon name (1,500+), e.g. `heart`, `brain`, `triangle-alert`, `shield`, `shield-check`,
`clock`, `footprints`, `bone`, `house`, `users`, `user`, `dog`, `cat`, `bird`, `squirrel`, `volume-2`,
`zap`, `thermometer`, `cup-soda`, `glass-water`, `droplet`, `dna`, `baby`, `calendar`, `hourglass`,
`stethoscope`, `pill`, `hand`, `hand-heart`, `ear`, `eye`, `eye-off`, `bell`, `bell-ring`, `door-open`,
`car`, `bike`, `truck`, `baby`, `umbrella`, `cloud-lightning`, `sparkles`, `party-popper`, `frown`,
`smile`, `meh`, `angry`, `megaphone`, `message-circle`, `message-circle-warning`, `ban`, `circle-x`,
`circle-check`, `check`, `x`, `arrow-right`, `arrow-left`, `arrow-up`, `arrow-down`, `move-horizontal`,
`repeat`, `refresh-cw`, `trending-up`, `trending-down`, `activity`, `gauge`, `list-checks`,
`clipboard-list`, `notebook-pen`, `pencil`, `search`, `lightbulb`, `target`, `map`, `route`, `signpost`,
`leaf`, `trees`, `moon`, `bed`, `coffee`, `cookie`, `gift`, `lock`, `lock-open`, `link`, `paw-print`, `heart-pulse`, `heart-crack`, `shield-alert`, `octagon-alert`, `circle-alert`, `skull`, `layers`,
`flame`, `siren`, `alarm-smoke`, `graduation-cap`, `book-open`, `heart-handshake`, `handshake`, `scale`.
Check a name exists: `grep -o '"NAME":' video/icons.js`.

## Kit (`window.K`) — components

All take `(parent, ..., options)` and position absolutely with `x, y, w, h` (px) unless added into a
`K.flow()` container, where they stack in normal flow. Text arguments accept tiny markup:
`*green bold*`, `**dark bold**`, `!!red bold!!`, `_highlight underline_`, and `<br>`.

| call | returns | notes |
|---|---|---|
| `K.flow(parent, {x,y,w,gap,align})` | div | vertical stack container; put heading/text/bullets inside |
| `K.heading(parent, text, {x,y,w,size,color,cls,align,bar,barGap})` | `{root,title,bar,all}` | deck-style green title + accent bar. Animate `h.all` |
| `K.kicker(parent, text, {x,y})` | div | small letter-spaced green label ("WHERE IT COMES FROM") |
| `K.text(parent, html, {x,y,w,cls,size,weight,color,align,lh,style})` | div | `cls`: `lead` 38px, `body` 32px, `label`, `quote`, `note` (red bold centered) |
| `K.bullets(parent, items, {x,y,w,icon,size,gap})` | rows[] | `icon`: `check` (deck style), `x`, `dot`, `num`, or a Lucide name. item may be `{html, icon, strong}` |
| `K.photo(parent, src, {x,y,w,h,radius,pos,bleed,tag})` | `{root,img}` | framed photo; `bleed:true` for edge-to-edge; `pos` = object-position |
| `K.card(parent, {x,y,w,h,icon,num,title,body,pill,variant,pad})` | div | white card; `variant`: `green`, `red` |
| `K.chip(parent, text, {x,y,icon,variant,size})` | div | pill; `variant`: `green`, `red`, `pale` |
| `K.iconBadge(parent, name, {x,y,size,variant})` | div | round icon badge; `variant`: `solid`, `red`, `amber` |
| `K.statement(parent, lines, {x,y,w,size,align,gap})` | `{root,lines}` | big uppercase statement (deck slide 4). `*green*`, `_underlined_` |
| `K.abc(parent, {x,y,w,panels,captions,label,labelVariant,words,panelH,capH,gap})` | `{label,cols,arrows,colW,panelH,top}` | the deck's ABC strip. `cols[i] = {root, head, panel, img, cap}`. labelVariant `red`/`green` |
| `K.ladder(parent, items, {x,y,w,rungH,gap,size})` | `{root,rungs,rails,color}` | escalation ladder, items listed BOTTOM to TOP (`'Growl'` or `{t, icon}`), green to amber to red ramp. Shared by ch01 and ch03 so they match |
| `K.cx(parent, [{t, yes}], {x,y,cols,size})` | `{root, items}` | check / cross list like the deck's "Surprised / Calm" |
| `K.icon(name, {size,stroke,color})` | svg | inline Lucide icon |
| `K.svg(parent, {x,y,w,h,viewBox})` | svg | canvas for diagrams/charts |
| `K.path(svg, d, attrs)`, `K.line(svg,x1,y1,x2,y2,attrs)`, `K.rect(svg,x,y,w,h,attrs)`, `K.circle(svg,cx,cy,r,attrs)`, `K.svgText(svg,x,y,text,attrs)`, `K.group(svg,attrs)` | svg nodes | defaults: green stroke/fill; override with attrs (`fill`, `stroke`, `stroke-width`, `rx`, `opacity`, `font-size`, `text-anchor`...) |
| `K.el(tag, cls, html, style)` | element | raw element (then `stage.appendChild`) |

## Animation (`window.A`)

| call | effect |
|---|---|
| `A.in(tl, targets, t, type, {dur, stagger, ease, delay})` | reveal. types: `fadeUp` (default), `fadeDown`, `fadeLeft` (from right), `fadeRight` (from left), `fade`, `pop`, `scale`, `blur`, `wipe` (left to right clip), `wipeDown`, `grow` (scaleX from left) |
| `A.out(tl, targets, t, type, {dur, stagger})` | hide. types: `fade`, `fadeUp`, `fadeDown`, `shrink` |
| `A.draw(tl, svgStrokes, t, dur, {from,to,stagger})` | draw SVG strokes (DrawSVG) |
| `A.pulse(tl, targets, t, {scale})` | quick attention pulse |
| `A.dim(tl, targets, t, opacity)` / `A.undim(tl, targets, t)` | de-emphasize / restore |
| `A.kenburns(tl, img, {from,to,x0,x1,y0,y1,t0,t1})` | slow zoom/pan over the scene |
| `A.count(tl, node, t, from, to, dur, fmt)` | count a number |
| `A.words(tl, node, t, {stagger})` | word-by-word reveal (SplitText) |
| `A.set(tl, targets, t, vars, dur)` | tween any CSS/SVG property (color, background, width, attr:{...}) |

Raw GSAP is fine too: `tl.fromTo(el, {...}, {..., duration}, time)`; `tl.to(...)`. GSAP plugins
loaded: DrawSVG, SplitText, MotionPath, MorphSVG, CustomEase. Always pass the time as the last argument.
Elements you reveal with `A.in` are hidden from frame 0 automatically (fromTo renders immediately).

## Example

```js
registerScene('ch01s01', ({ stage, tl, cue, chrome }) => {
  const p = K.photo(stage, 'photo_aggression.jpg', { x: 0, y: 0, w: 830, h: 1080, bleed: true, pos: '50% 30%' });
  chrome.hideUrl();
  A.in(tl, p.root, 0, 'fade', { dur: 0.6 });
  A.kenburns(tl, p.img, { from: 1.02, to: 1.1 });
  const f = K.flow(stage, { x: 930, y: 230, w: 820, gap: 36 });
  const h = K.heading(f, 'What is aggression?', { size: 84 });
  const lead = K.text(f, 'Behavior aimed at *creating distance*.', { cls: 'lead' });
  const rows = K.bullets(f, ['A growl', 'A snap', { html: 'Behavior with intent.', strong: true }]);
  A.in(tl, h.all, cue(0), 'fadeUp', { stagger: 0.12 });
  A.in(tl, lead, cue(0) + 0.3);
  rows.forEach((r, i) => A.in(tl, r, cue(i + 1), 'fadeRight'));
});
```

## Check your work (required)

Timing is already built (`build/timing.json`). After editing your chapter file:

```bash
node tools/snap.mjs --chapter ch03          # stills for every scene in the chapter
node tools/snap.mjs ch03s02                 # one scene: a still after each beat + the final frame
node tools/snap.mjs ch03s02 0.3 4.2 9.9     # specific times
```

Stills land in `build/snaps/<scene>_b<N>.jpg` (after beat N's reveal) and `<scene>_end.jpg`, plus a
contact sheet `<scene>_sheet.jpg`. Read them and check: nothing overlaps or overflows or touches the
logo/footer; text is large and readable; every beat's frame shows its new visual; the final frame is a
complete, balanced composition; it looks like a polished explainer, on brand. Fix and re-snap until clean.
The snap command also prints JS errors and missing images/icons. It must print none.
