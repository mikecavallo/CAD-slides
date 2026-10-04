// Shared parts for the "Your Training Mechanics" course video (script/lesson-mechanics.json). Scenes use them through window.TM.
// CSS classes are prefixed .tm- and injected with TM.style(stage).
//
//   TM.say(ctx, i, phrase, fb, lead)   scene time just before `phrase` is spoken in beat i (never before the beat)
//   TM.at(ctx, i, phrase, fb, lo, hi)  the same, clamped to [lo, hi] (defaults: the beat's cue + 0.1 .. its end - 0.3)
//   TM.partCard(ctx, num, title)       the chapter-card look, kicker "Part N"; returns its pieces
//   TM.head(ctx, kicker, title, o)     kicker + green heading at the top left, revealed at 0.05 s
//   TM.videoFrame(ctx)                 the frame for the trainer's clip (lesson "clip" block, box in stage px): poster and play
//                                      badge until the clip is added; tools/assemble.py plays the clip inside the same box
//   TM.videoSlide(ctx, o)              kicker, heading, the video frame at right and rows at left landing on their phrases
//   TM.row(parent, icon, html, o)      one icon row (green round icon, body text)
//   TM.treat(parent, x, y, s)          a drawn treat (stage px, centre)
//   TM.bubble(parent, text, o)         a speech bubble ("Yip!")
//   TM.word(parent, text, o)           a cue-word chip (variant green, red, pale, amber; o.cross strikes it out)
(() => {
  const CSS = `
  .tm-frame { position: absolute; border-radius: 26px; background: #fff; box-shadow: 0 22px 54px rgba(40,60,20,0.20); }
  .tm-frame .scr { position: absolute; overflow: hidden; background: #1c1f1a; }
  .tm-frame .scr img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
  .tm-frame .shade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45)); }
  .tm-frame .play { position: absolute; left: 50%; top: 50%; width: 132px; height: 132px; margin: -66px 0 0 -66px; border-radius: 50%;
    background: rgba(97,149,55,0.92); display: grid; place-items: center; box-shadow: 0 12px 30px rgba(0,0,0,0.3); }
  .tm-frame .play svg { width: 62px; height: 62px; color: #fff; fill: #fff; margin-left: 8px; }
  .tm-cap { position: absolute; display: flex; align-items: center; gap: 14px; font: 700 28px/1 var(--font-body); color: var(--green-dark); white-space: nowrap; }
  .tm-cap .dot { width: 40px; height: 40px; border-radius: 50%; background: var(--green); display: grid; place-items: center; }
  .tm-cap .dot svg { width: 20px; height: 20px; color: #fff; fill: #fff; margin-left: 3px; }
  .tm-row { display: flex; align-items: center; gap: 22px; font: 600 33px/1.25 var(--font-body); color: var(--ink); }
  .tm-row .ic { width: 64px; height: 64px; border-radius: 50%; background: var(--green-pale); color: var(--green-dark); display: grid; place-items: center; flex: 0 0 auto; }
  .tm-row .ic svg { width: 34px; height: 34px; stroke-width: 2.3; }
  .tm-row .ic.num { background: var(--green); color: #fff; font: 700 32px/1 var(--font-head); }
  .tm-row b { color: var(--green); }
  .tm-col { position: absolute; display: flex; flex-direction: column; gap: 34px; }
  .tm-treat { position: absolute; border-radius: 46% 54% 50% 50%; background: radial-gradient(circle at 35% 30%, #e7b878, #b9773a 60%, #8d5424);
    box-shadow: 0 4px 10px rgba(90,50,10,0.28); }
  .tm-bub { position: absolute; padding: 18px 34px; border-radius: 40px; background: #fff; border: 4px solid var(--green); font: 800 44px/1 var(--font-head);
    color: var(--green); white-space: nowrap; box-shadow: 0 12px 28px rgba(40,60,20,0.16); }
  .tm-bub::after { content: ''; position: absolute; left: 34px; bottom: -22px; border: 12px solid transparent; border-top: 14px solid var(--green); }
  .tm-bub.right::after { left: auto; right: 34px; }
  .tm-word { position: absolute; display: inline-flex; align-items: center; gap: 12px; padding: 16px 30px; border-radius: 999px; background: #fff; border: 3px solid var(--green);
    font: 700 34px/1 var(--font-body); color: var(--green-dark); white-space: nowrap; box-shadow: var(--shadow-soft); }
  .tm-word svg { width: 32px; height: 32px; stroke-width: 2.4; }
  .tm-word.green { background: var(--green); color: #fff; }
  .tm-word.pale { background: var(--green-pale); border-color: var(--green-pale); box-shadow: none; }
  .tm-word.red { border-color: var(--red); color: var(--red); }
  .tm-word.amber { border-color: var(--amber); color: #8a5410; background: var(--amber-pale); }
  .tm-word .strike { position: absolute; left: 14px; right: 14px; top: 50%; height: 5px; margin-top: -2px; background: var(--red); border-radius: 3px; transform-origin: left center; }
  .tm-sub { position: absolute; font: 600 44px/1.3 var(--font-head); color: var(--ink-soft); }
  .tm-sub b { color: var(--green); }
  .tm-panel { position: absolute; border-radius: 30px; background: var(--green-mist); border: 2px solid #e3ecd6; }
  .tm-banner { position: absolute; display: flex; align-items: center; gap: 22px; padding: 24px 40px; border-radius: 24px; background: var(--green); color: #fff;
    font: 700 38px/1.2 var(--font-head); box-shadow: 0 16px 36px rgba(63,107,34,0.28); }
  .tm-banner svg { width: 46px; height: 46px; stroke-width: 2.3; flex: 0 0 auto; }
  .tm-banner b { color: var(--green-pale); }
  .tm-xcard { position: absolute; background: #fff; border-radius: 26px; border: 1px solid #e6e9e1; box-shadow: var(--shadow-soft); padding: 30px 32px; box-sizing: border-box; }
  .tm-xcard .t { font: 700 38px/1.1 var(--font-head); color: var(--ink); }
  .tm-xcard .b { margin-top: 14px; font: 500 28px/1.35 var(--font-body); color: var(--ink-soft); }
  .tm-xcard .x { position: absolute; right: 26px; top: 24px; width: 62px; height: 62px; border-radius: 50%; background: var(--red); color: #fff; display: grid; place-items: center; }
  .tm-xcard .x svg { width: 36px; height: 36px; stroke-width: 3; }
  .tm-node { position: absolute; width: 250px; height: 250px; border-radius: 50%; background: #fff; border: 5px solid var(--line); box-sizing: border-box;
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; box-shadow: var(--shadow-soft); }
  .tm-node .ic { width: 78px; height: 78px; border-radius: 50%; background: var(--green-pale); color: var(--green-dark); display: grid; place-items: center; }
  .tm-node .ic svg { width: 42px; height: 42px; stroke-width: 2.2; }
  .tm-node .t { font: 700 32px/1.1 var(--font-head); color: var(--ink); text-align: center; }
  .tm-node .n { position: absolute; top: -18px; left: 50%; margin-left: -24px; width: 48px; height: 48px; border-radius: 50%; background: var(--green); color: #fff;
    font: 700 26px/48px var(--font-head); text-align: center; }
  .tm-lab { position: absolute; font: 700 30px/1.15 var(--font-body); color: var(--ink); white-space: nowrap; }
  .tm-quote { position: absolute; font: 700 84px/1.12 var(--font-head); color: var(--ink); text-align: center; }
  .tm-quote b { color: var(--green); }
  `;
  const style = stage => { if (!stage.querySelector('style[data-tm]')) { const s = K.el('style', null, CSS); s.dataset.tm = '1'; stage.appendChild(s); } };
  const clamp = (t, lo, hi) => Math.max(lo, Math.min(t, hi));
  const say = (ctx, i, phrase, fb = 0.5, lead = 0.3) => Math.max(ctx.cue(i), ctx.phrase(i, phrase, fb) - lead);
  const at = (ctx, i, phrase, fb = 0.5, lo, hi) => {
    const a = lo ?? ctx.cue(i) + 0.1, b = hi ?? Math.max(a, ctx.end(i) - 0.3);
    return clamp(say(ctx, i, phrase, fb), a, b);
  };
  const put = (parent, n, x, y, extra) => { Object.assign(n.style, { left: x + 'px', top: y + 'px' }, extra || {}); parent.appendChild(n); return n; };

  const PLAY = '<svg viewBox="0 0 24 24"><path d="M7 4.5v15l12.5-7.5z" stroke="none"/></svg>';

  /** Chapter-card look with "Part N" (base.css .bumper-*), narrated. */
  function partCard(ctx, num, title) {
    const { stage, tl } = ctx;
    style(stage);
    const n = K.el('div', 'bumper-num', String(num).padStart(2, '0'));
    const bar = K.el('div', 'bumper-bar');
    const kick = K.el('div', 'bumper-kicker', 'Part ' + num);
    const tt = K.el('div', 'bumper-title', K.md(title));
    [n, bar, kick, tt].forEach(x => stage.appendChild(x));
    A.in(tl, n, 0.05, 'fadeRight', { dur: 0.9 });
    A.in(tl, bar, 0.25, 'grow', { dur: 0.6 });
    A.in(tl, kick, 0.35, 'fadeUp', { dur: 0.6 });
    A.in(tl, tt, 0.5, 'fadeUp', { dur: 0.8 });
    return { n, bar, kick, tt };
  }

  /** Kicker and heading at the top left. */
  function head(ctx, kicker, title, o = {}) {
    const { stage, tl } = ctx;
    style(stage);
    const x = o.x ?? 100;
    let k = null;
    if (kicker) { k = K.kicker(stage, (window.SERIES && SERIES.title) || kicker, { x, y: o.ky ?? 112 }); A.in(tl, k, 0.05, 'fadeUp', { dur: 0.6 }); }
    const h = K.heading(stage, title, { x, y: o.y ?? (kicker ? 150 : 110), w: o.w ?? 1440, size: o.size ?? 66, barGap: 16 });
    A.in(tl, h.all, 0.12, 'fadeUp', { dur: 0.7, stagger: 0.1 });
    return { k, h, all: [k, h.root].filter(Boolean) };
  }

  /** The frame the trainer's clip plays in. Box from the lesson's clip block (via build/timing.js). */
  function videoFrame(ctx, t0 = 0.25) {
    const { stage, tl, info, dur } = ctx;
    style(stage);
    const c = info.clip || { box: [900, 290, 920, 518], poster: '', label: 'Video' };
    const [x, y, w, h] = c.box, B = 12;
    const fr = put(stage, K.el('div', 'tm-frame'), x - B, y - B, { width: w + 2 * B + 'px', height: h + 2 * B + 'px' });
    const scr = put(fr, K.el('div', 'scr'), B, B, { width: w + 'px', height: h + 'px' });
    const img = K.el('img');
    if (c.poster) img.src = '../assets/img/' + c.poster;
    else {
      // no thumbnail yet: a calm placeholder until the trainer's clip is added
      scr.style.background = 'linear-gradient(160deg, #3f6b22, #2c4a17)';
      img.style.display = 'none';
      const ph = K.el('div', 'ph', 'Your video plays here');
      Object.assign(ph.style, { position: 'absolute', left: 0, right: 0, bottom: '120px', textAlign: 'center', font: '600 32px/1 var(--font-body)', color: '#e8f1dc' });
      scr.appendChild(ph);
    }
    if (c.poster) scr.appendChild(img);
    const pic = c.fit === 'contain';  // the trainer's picture: shown whole on white, no play badge, until the clip starts
    if (pic) { img.style.objectFit = 'contain'; scr.style.background = '#fff'; }
    else scr.appendChild(K.el('div', 'shade'));
    const play = K.el('div', 'play', PLAY);
    if (!pic) scr.appendChild(play);
    const cap = put(stage, K.el('div', 'tm-cap', `<span class="dot">${PLAY}</span><span>${K.md(c.label || '')}</span>`), x, y + h + B + 26);
    tl.fromTo(fr, { opacity: 0, y: 40, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' }, t0);
    A.in(tl, cap, t0 + 0.4, 'fadeUp', { dur: 0.6 });
    // the poster: a slow drift; the play badge eases off when the clip would start (the real clip covers the screen from then on)
    if (!pic) tl.fromTo(img, { scale: 1.02 }, { scale: 1.1, duration: Math.max(1, dur - t0), ease: 'none' }, t0);
    tl.to(play, { opacity: 0.0, scale: 0.8, duration: 0.5, ease: 'power2.in' }, c.at ?? 1.2);
    return { fr, scr, img, play, cap, box: c.box };
  }

  /** One icon row. o.num shows a number instead of an icon. */
  function row(parent, icon, html, o = {}) {
    const r = K.el('div', 'tm-row');
    const ic = K.el('div', 'ic' + (o.num ? ' num' : ''));
    if (o.num) ic.textContent = String(o.num); else ic.appendChild(K.icon(icon));
    r.appendChild(ic);
    r.appendChild(K.el('span', null, K.md(html)));
    if (o.size) r.style.fontSize = o.size + 'px';
    parent.appendChild(r);
    return r;
  }

  /**
   * Video slide: kicker + heading, the clip frame at right, rows at left. o.rows: [{icon, html, beat, phrase, fb}] land on their phrases.
   * Returns { hd, vf, col, rows }.
   */
  function videoSlide(ctx, o) {
    const { stage, tl } = ctx;
    const hd = head(ctx, o.kicker, o.heading, { size: o.size ?? 64 });
    const vf = videoFrame(ctx);
    const col = put(stage, K.el('div', 'tm-col'), 100, o.top ?? 300, { width: '740px', gap: (o.gap ?? 34) + 'px' });
    const rows = (o.rows || []).map((r, i) => {
      const n = row(col, r.icon, r.html, { num: r.num, size: r.size });
      const t = at(ctx, r.beat, r.phrase || '', r.fb ?? 0.15);
      A.in(tl, n, t, 'fadeRight', { dur: 0.6 });
      return n;
    });
    return { hd, vf, col, rows };
  }

  function treat(parent, x, y, s = 1) {
    const w = 38 * s, h = 30 * s;
    return put(parent, K.el('div', 'tm-treat'), x - w / 2, y - h / 2, { width: w + 'px', height: h + 'px' });
  }
  function bubble(parent, text, o = {}) {
    const b = K.el('div', 'tm-bub' + (o.right ? ' right' : ''), K.md(text));
    if (o.size) b.style.fontSize = o.size + 'px';
    return put(parent, b, o.x || 0, o.y || 0);
  }
  function word(parent, text, o = {}) {
    const n = K.el('div', 'tm-word' + (o.variant ? ' ' + o.variant : ''));
    if (o.icon) n.appendChild(K.icon(o.icon));
    n.appendChild(K.el('span', null, K.md(text)));
    if (o.size) n.style.fontSize = o.size + 'px';
    if (o.cross) { n.appendChild(K.el('div', 'strike')); }
    put(parent, n, o.x || 0, o.y || 0);
    return n;
  }
  /** Strike a crossed word chip through at t. */
  function strike(tl, n, t) {
    const s = n.querySelector('.strike');
    if (s) tl.fromTo(s, { scaleX: 0 }, { scaleX: 1, duration: 0.4, ease: 'power2.out' }, t);
  }
  /** Centre a positioned element on x after layout (call before animating). */
  function centerX(n, cx) { n.style.left = cx - n.offsetWidth / 2 + 'px'; return n; }

  /** A left-to-right order strip: chips with arrows between (Word → Pause → Move). Returns { row, items }. */
  function order(parent, words, o = {}) {
    const row = put(parent, K.el('div'), o.x ?? 100, o.y ?? 840, { position: 'absolute', display: 'flex', alignItems: 'center', gap: '18px' });
    if (o.center) Object.assign(row.style, { left: '0px', width: '1920px', justifyContent: 'center' });
    const items = [];
    words.forEach((w, i) => {
      if (i) { const a = K.iconBadge(row, 'arrow-right', { size: 52 }); a.style.position = 'relative'; a.style.left = a.style.top = ''; items.push(a); }
      const n = word(row, w, { variant: o.variant || (i === words.length - 1 ? 'green' : 'pale'), size: o.size ?? 32, icon: (o.icons || [])[i] });
      n.style.position = 'relative'; n.style.left = n.style.top = '';
      items.push(n);
    });
    return { row, items };
  }

  /**
   * The drawn green dog (C2.dog) sitting down: returns { stand, sit, sitAt(tl, t) }. Same look and local box as C2.dog
   * (facing right, paws on y 297), centred on (cx, cy) at scale s. sitAt crossfades to the sitting pose as the hind end drops.
   */
  function sitDog(svg, cx, cy, s) {
    const stand = C2.dog(svg, cx, cy, s);
    const x = cx - 222 * s, y = cy - 168 * s;
    const DOG = '#3f6b22', FAR = '#2c4a17';
    const sit = K.group(svg);
    const g = K.group(sit, { transform: `translate(${x} ${y}) scale(${s})` });
    K.svgEl('ellipse', { cx: 220, cy: 298, rx: 140, ry: 9, fill: DOG, opacity: 0.13 }, g);
    K.path(g, 'M 130 280 C 100 290 78 294 58 292', { stroke: DOG, 'stroke-width': 15, fill: 'none', 'stroke-linecap': 'round' });
    K.path(g, 'M 262 186 L 284 188 L 282 288 L 296 291 C 300 293 300 297 294 297 L 266 297 C 262 297 262 292 264 288 Z', { fill: FAR, stroke: 'none' });
    K.svgEl('ellipse', { cx: 182, cy: 248, rx: 64, ry: 50, fill: DOG }, g);
    K.path(g, 'M 140 236 C 168 190 226 140 268 116 C 300 100 332 126 328 160 C 322 204 282 240 240 262 C 200 280 146 270 140 236 Z', { fill: DOG, stroke: 'none' });
    K.path(g, 'M 150 288 C 160 280 200 280 236 286 C 244 290 244 297 236 297 L 156 297 C 146 297 144 292 150 288 Z', { fill: DOG, stroke: 'none' });
    K.path(g, 'M 290 176 L 316 180 L 312 286 L 330 290 C 334 292 334 297 328 297 L 294 297 C 290 297 290 292 292 288 Z', { fill: DOG, stroke: 'none' });
    const head = K.group(g, { transform: 'translate(-4 -10)' });
    K.path(head, 'M 262 126 C 270 100 290 78 310 66 L 342 92 C 338 120 330 150 322 176 Z', { fill: DOG, stroke: 'none' });
    K.circle(head, 322, 74, 38, { fill: DOG });
    K.path(head, 'M 330 56 C 354 56 378 64 390 74 C 398 82 396 100 382 104 L 330 108 Z', { fill: DOG, stroke: 'none' });
    K.circle(head, 390, 80, 9, { fill: '#142309' });
    K.path(head, 'M 273 116 C 290 129 318 131 338 117', { stroke: '#b8d99a', 'stroke-width': 12, fill: 'none' });
    K.circle(head, 306, 136, 7, { fill: '#b8d99a' });
    K.path(head, 'M 306 48 C 290 54 282 84 288 112 C 294 120 306 116 308 106 C 314 86 316 66 316 52 Z', { fill: FAR, stroke: 'none' });
    K.circle(head, 340, 66, 5, { fill: '#fff' });
    return {
      stand, sit, head,
      mouth: [x + 392 * s, y + 92 * s],
      sitAt(tl, t) {
        tl.set(sit, { opacity: 0 }, 0);
        tl.to(stand.outer, { opacity: 0, y: 6, duration: 0.3, ease: 'power2.in' }, t);
        tl.fromTo(sit, { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', immediateRender: false }, t + 0.05);
      },
    };
  }

  /** A low toss: the treat skims along the ground from (x0, y) to (x1, y) with small hops, like a bowled ball. Returns the end time. */
  function lowToss(tl, treatEl, dx, t, dur = 0.9) {
    tl.fromTo(treatEl, { opacity: 0 }, { opacity: 1, duration: 0.15 }, t);
    tl.to(treatEl, { x: dx, duration: dur, ease: 'power2.out' }, t);
    tl.to(treatEl, { y: -10, duration: dur / 6, ease: 'sine.out', yoyo: true, repeat: 3 }, t);
    tl.to(treatEl, { rotation: 540, duration: dur, ease: 'power2.out' }, t);
    return t + dur;
  }

  window.TM = { sitDog, lowToss, order, style, clamp, say, at, put, partCard, head, videoFrame, videoSlide, row, treat, bubble, word, strike, centerX, PLAY };
})();
