/*
 * Chapter 02: What is reactivity?
 *   ch02s01  What is reactivity?      photo + definition + the smoke alarm for toast
 *   ch02s02  Magnitude, not intent     the alarm's volume knob, two dogs at one mail carrier, three directions
 *   ch02s03  Three directions          hub: away (fear), toward (frustration), release (built-up tension),
 *                                      the fearful-lunge caution, then the 'Try this' question card
 *
 * Reusable parts built here (also exposed on window.CAD_PARTS for callbacks in later chapters):
 *   smokeAlarm(svg, {x, y, r})         alarm badge + red sound arcs + ripple
 *   volumeKnob(parent, {cx, cy, scale, maxed, labels, dog})   dog: true/false adds a dog cap (false = hidden)
 */
(function () {
  const C = {
    green: '#619537', greenDark: '#3f6b22', greenDeep: '#2c4a17', greenLight: '#b8d99a', pale: '#e8f1dc',
    mist: '#f3f8ec', ink: '#212121', inkSoft: '#4a4a4a', muted: '#7a7a7a', line: '#d9ddd3',
    red: '#b8452d', redPale: '#f8e3dd', amber: '#d9912b', amberPale: '#fbefd9', amberText: '#a8650f',
  };
  // one colour per direction, used consistently in s02 and s03
  const DIR = {
    away: { col: C.amber, text: C.amberText, pale: C.amberPale, icon: 'triangle-alert' },
    toward: { col: C.red, text: C.red, pale: C.redPale, icon: 'magnet' }, // heart stays reserved for feelings
    release: { col: C.green, text: C.greenDark, pale: C.pale, icon: 'zap' },
  };
  // same calm-green to amber to red ramp as the ladder in lib.js
  const RAMP = ['#7fb24a', '#9dbb3f', '#c2b235', '#d9912b', '#cf6a2c', '#c4512d', '#b8452d', '#a33a26'];
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, b, t) => {
    const A1 = hex(a), B1 = hex(b);
    return '#' + A1.map((v, i) => Math.round(v + (B1[i] - v) * t).toString(16).padStart(2, '0')).join('');
  };
  const rampAt = p => {
    const n = RAMP.length - 1, f = Math.max(0, Math.min(1, p)) * n, i = Math.min(n - 1, Math.floor(f));
    return mix(RAMP[i], RAMP[i + 1], f - i);
  };
  let uid = 0;

  const CSS = `
  .c2-card { position: relative; background: #fff; border-radius: 26px; box-shadow: var(--shadow-soft); border: 1px solid #e6e9e1; flex: 0 0 auto; }
  .c2-cap { position: absolute; font: 700 38px/1.15 var(--font-head); color: var(--ink); white-space: nowrap; }
  .c2-hl { color: var(--green); font-weight: 700; background: linear-gradient(var(--green-light), var(--green-light)) no-repeat 0 92% / 0% 34%; }
  .c2-sub { position: absolute; font: 500 40px/1.3 var(--font-body); color: var(--ink); white-space: nowrap; }
  .c2-lab { position: absolute; font: 700 38px/1.2 var(--font-head); color: var(--ink); white-space: nowrap; }
  .c2-small { position: absolute; font: 600 28px/1.2 var(--font-body); color: var(--ink-soft); white-space: nowrap; text-align: center; }
  .c2-row { position: absolute; display: flex; justify-content: center; }
  .c2-tag { display: inline-flex; align-items: center; gap: 14px; padding: 14px 28px 14px 22px; border-radius: 999px; background: #fff;
    box-shadow: var(--shadow-soft); font: 700 32px/1 var(--font-body); color: var(--ink); white-space: nowrap; }
  .c2-tag svg { width: 36px; height: 36px; stroke-width: 2.4; flex: 0 0 auto; }
  .c2-tag.amber { background: var(--amber-pale); color: ${C.amberText}; }
  .c2-tag.red { background: var(--red-pale); color: var(--red); }
  .c2-tag.green { background: var(--green-pale); color: var(--green-deep); }
  .c2-tag.plain svg { color: var(--green); }
  .c2-badge { position: absolute; border-radius: 50%; display: grid; place-items: center; border: 5px solid #fff;
    box-shadow: 0 12px 30px rgba(40,60,20,0.16), 0 3px 8px rgba(40,60,20,0.08); }
  .c2-badge svg { width: 52%; height: 52%; stroke-width: 2.2; }
  .c2-knob { position: absolute; }
  .c2-knob svg { position: absolute; left: 0; top: 0; overflow: visible; }
  .c2-q { position: relative; display: inline-flex; align-items: center; gap: 24px; padding: 22px 48px; border-radius: 26px; background: #fff;
    box-shadow: var(--shadow); border: 1px solid #e6e9e1; }
  .c2-q.note { padding: 18px 44px 18px 18px; }
  .c2-eye { flex: 0 0 auto; width: 64px; height: 64px; border-radius: 50%; display: grid; place-items: center; background: var(--amber-pale); color: ${C.amberText}; }
  .c2-eye svg { width: 36px; height: 36px; stroke-width: 2.4; }
  .c2-try { display: inline-flex; align-items: center; gap: 12px; padding: 14px 24px 14px 18px; border-radius: 999px; background: var(--green);
    color: #fff; font: 700 26px/1 var(--font-body); letter-spacing: 3px; text-transform: uppercase; white-space: nowrap;
    box-shadow: 0 10px 24px rgba(40,70,20,0.26); }
  .c2-try svg { width: 32px; height: 32px; stroke-width: 2.4; }
  .c2-pin { position: absolute; left: -30px; top: -38px; }
  .c2-qt { font: 700 42px/1.1 var(--font-head); color: var(--ink); white-space: nowrap; }
  `;
  const style = stage => stage.appendChild(K.el('style', null, CSS));

  // ------------------------------------------------------------------ small builders
  /** Text label centred on cx (or left-aligned at x). */
  function label(parent, html, o) {
    const w = o.w ?? 800;
    const n = K.el('div', o.cls || 'c2-lab', K.md(html));
    const left = o.align === 'left' ? o.x : o.cx - w / 2;
    Object.assign(n.style, { left: left + 'px', top: o.y + 'px', width: w + 'px', textAlign: o.align === 'left' ? 'left' : 'center' });
    if (o.size) n.style.fontSize = o.size + 'px';
    parent.appendChild(n);
    return n;
  }
  /** Pill tag centred on cx. Returns the pill (animate it). */
  function tag(parent, html, o) {
    const row = K.el('div', 'c2-row');
    Object.assign(row.style, { left: (o.cx - 400) + 'px', top: o.y + 'px', width: '800px' });
    const c = K.el('div', 'c2-tag ' + (o.tone || 'plain'));
    if (o.icon) c.appendChild(K.icon(o.icon));
    c.appendChild(K.el('span', null, K.md(html)));
    row.appendChild(c);
    parent.appendChild(row);
    return c;
  }
  /** Round icon badge centred on (cx, cy). */
  function badge(parent, name, o) {
    const s = o.size ?? 120;
    const b = K.el('div', 'c2-badge');
    Object.assign(b.style, { left: (o.cx - s / 2) + 'px', top: (o.cy - s / 2) + 'px', width: s + 'px', height: s + 'px', background: o.bg || '#fff', color: o.color || C.green });
    b.appendChild(K.icon(name));
    parent.appendChild(b);
    return b;
  }
  /** Lucide icon drawn inside an existing svg, centred on (x, y) at pixel size `size`. */
  function svgIcon(svg, name, x, y, size, attrs = {}) {
    const k = size / 24;
    const g = K.group(svg, Object.assign({ transform: `translate(${x - size / 2} ${y - size / 2}) scale(${k})`, fill: 'none', stroke: C.ink, 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, attrs));
    g.innerHTML = (window.ICONS || {})[name] || '';
    return g;
  }
  /** Straight arrow with an open chevron head. Returns {g, shaft, head}. */
  function arrow(svg, x1, y1, x2, y2, o = {}) {
    const g = K.group(svg);
    const len = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / len, uy = (y2 - y1) / len;
    const sw = o.width ?? 14, hl = o.head ?? 36, a = (40 * Math.PI) / 180, ang = Math.atan2(uy, ux);
    const shaft = K.line(g, x1, y1, x2 - ux * 3, y2 - uy * 3, { stroke: o.color, 'stroke-width': sw });
    const ax = x2 - hl * Math.cos(ang - a), ay = y2 - hl * Math.sin(ang - a);
    const bx = x2 - hl * Math.cos(ang + a), by = y2 - hl * Math.sin(ang + a);
    const head = K.path(g, `M${ax} ${ay} L${x2} ${y2} L${bx} ${by}`, { stroke: o.color, 'stroke-width': sw, fill: 'none' });
    return { g, shaft, head };
  }
  /** Short radial strokes around (x, y), for bursts. angles in degrees (0 = right, -90 = up). */
  function rays(svg, x, y, r1, r2, angles, attrs) {
    return angles.map(d => {
      const t = (d * Math.PI) / 180;
      return K.line(svg, x + r1 * Math.cos(t), y + r1 * Math.sin(t), x + r2 * Math.cos(t), y + r2 * Math.sin(t), attrs);
    });
  }

  // ------------------------------------------------------------------ smoke alarm (shared part)
  /**
   * Smoke alarm badge with red sound arcs blasting to the right.
   * Returns {g, body, shake, arcG, arcs, ripple, x, y}. Animate with alarmRing().
   */
  function smokeAlarm(svg, o = {}) {
    const x = o.x ?? 0, y = o.y ?? 0, r = o.r ?? 78;
    const g = K.group(svg);
    const arcG = K.group(g);
    const radii = o.radii || [r + 40, r + 90, r + 140, r + 190];
    const span = ((o.span ?? 28) * Math.PI) / 180;
    const arcD = rr => `M${x + rr * Math.cos(-span)} ${y + rr * Math.sin(-span)} A${rr} ${rr} 0 0 1 ${x + rr * Math.cos(span)} ${y + rr * Math.sin(span)}`;
    const arcs = radii.map((rr, i) => K.path(arcG, arcD(rr), { stroke: C.red, 'stroke-width': 10 - i, opacity: 0 }));
    // the clip sits on a wrapper so it does not scale with the ripple
    const rippleG = K.group(g, o.clip ? { 'clip-path': `url(#${o.clip})` } : {});
    const ripple = K.path(rippleG, arcD(radii[radii.length - 1]), { stroke: C.red, 'stroke-width': 6, opacity: 0 });
    const body = K.group(g);
    K.circle(body, x, y, r, { fill: C.redPale, stroke: '#fff', 'stroke-width': 6 });
    const shake = K.group(body);
    svgIcon(shake, 'alarm-smoke', x, y + 2, r * 1.3, { stroke: C.red, 'stroke-width': 1.9 });
    return { g, body, shake, arcG, arcs, ripple, x, y, radii };
  }
  /** Pop the alarm in, blast its arcs, swell them and ring until tEnd. */
  function alarmRing(tl, al, t, tEnd) {
    const org = `${al.x} ${al.y}`;
    tl.fromTo(al.body, { opacity: 0, scale: 0.5, svgOrigin: org }, { opacity: 1, scale: 1, svgOrigin: org, duration: 0.7, ease: 'back.out(1.8)' }, t);
    tl.fromTo(al.arcs, { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.12, ease: 'power2.out' }, t + 0.6);
    tl.fromTo(al.arcG, { scale: 0.62, svgOrigin: org }, { scale: 1.1, svgOrigin: org, duration: 2.6, ease: 'power2.out' }, t + 0.6);
    const shakes = Math.max(2, Math.floor(((tEnd - t - 0.6) * 0.5) / 0.07 / 2) * 2);
    tl.to(al.shake, { rotation: 7, svgOrigin: org, duration: 0.07, repeat: Math.min(shakes, 40) - 1, yoyo: true, ease: 'sine.inOut' }, t + 0.6);
    const period = 0.9, n = Math.max(1, Math.floor((tEnd - t - 1.2) / period));
    tl.fromTo(al.ripple, { opacity: 0.6, scale: 1.1, svgOrigin: org }, { opacity: 0, scale: 1.75, svgOrigin: org, duration: period, ease: 'power1.out', repeat: n - 1, immediateRender: false }, t + 1.6);
  }

  // ------------------------------------------------------------------ volume knob (shared part)
  const KNOB_BOX = 600;
  /**
   * Volume knob: tick scale from Low (-135 deg) to Max (+135 deg) with a red zone at the top of the range,
   * a soft dial and a pointer. o: {cx, cy, scale, maxed, labels}. Returns parts for animation.
   */
  function volumeKnob(parent, o = {}) {
    const S = KNOB_BOX, h = S / 2, id = 'c2k' + ++uid;
    const wrap = K.el('div', 'c2-knob');
    Object.assign(wrap.style, { left: o.cx - h + 'px', top: o.cy - h + 'px', width: S + 'px', height: S + 'px' });
    parent.appendChild(wrap);
    const svg = K.svgEl('svg', { viewBox: `${-h} ${-h} ${S} ${S}`, width: S, height: S }, wrap);
    const defs = K.svgEl('defs', {}, svg);
    defs.innerHTML = `<radialGradient id="${id}g" cx="42%" cy="34%" r="72%"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e6ebdf"/></radialGradient>
      <filter id="${id}s" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#28401a" flood-opacity="0.20"/></filter>`;
    const rad = d => (d * Math.PI) / 180;
    const pt = (th, r) => [r * Math.sin(rad(th)), -r * Math.cos(rad(th))];
    const arcD = (a1, a2, r) => {
      const [x1, y1] = pt(a1, r), [x2, y2] = pt(a2, r);
      return `M${x1} ${y1} A${r} ${r} 0 ${a2 - a1 > 180 ? 1 : 0} 1 ${x2} ${y2}`;
    };
    const track = K.path(svg, arcD(-135, 135, 226), { stroke: '#e3e7dd', 'stroke-width': 6 });
    const band = K.path(svg, arcD(80, 135, 226), { stroke: C.red, 'stroke-width': 12 });
    const N = 28, R1 = 178, R2 = 206;
    const ticks = [], lit = [];
    const tg = K.group(svg), lg = K.group(svg);
    for (let i = 0; i < N; i++) {
      const th = -135 + (i * 270) / (N - 1), major = i % 3 === 0;
      const [x1, y1] = pt(th, major ? R1 - 8 : R1), [x2, y2] = pt(th, R2);
      ticks.push(K.line(tg, x1, y1, x2, y2, { stroke: '#dde2d6', 'stroke-width': major ? 10 : 7 }));
      lit.push(K.line(lg, x1, y1, x2, y2, { stroke: rampAt(i / (N - 1)), 'stroke-width': major ? 10 : 7, opacity: o.maxed ? 1 : 0 }));
    }
    const dial = K.group(svg);
    K.circle(dial, 0, 0, 152, { fill: `url(#${id}g)`, stroke: '#d3d9ca', 'stroke-width': 3, filter: `url(#${id}s)` });
    for (let i = 0; i < 40; i++) {
      const [x1, y1] = pt(i * 9, 138), [x2, y2] = pt(i * 9, 148);
      K.line(dial, x1, y1, x2, y2, { stroke: '#dfe4d8', 'stroke-width': 4 });
    }
    K.circle(dial, 0, 0, 126, { fill: 'none', stroke: '#e3e8dc', 'stroke-width': 3 });
    const ptr = K.group(dial);
    const ptrLine = K.line(ptr, 0, -44, 0, -112, { stroke: o.maxed ? C.red : C.greenDeep, 'stroke-width': 16 });
    K.circle(dial, 0, 0, 24, { fill: C.mist, stroke: '#d3d9ca', 'stroke-width': 3 });
    // optional dog cap: the knob is one dog's volume (o.dog false = built hidden, fade it in later)
    let dog = null;
    if (o.dog !== undefined) {
      dog = K.group(dial);
      K.circle(dog, 0, 0, 46, { fill: C.pale, stroke: '#fff', 'stroke-width': 4 });
      svgIcon(dog, 'dog', 0, 1, 58, { stroke: C.greenDark, 'stroke-width': 2.1 });
      if (!o.dog) dog.style.opacity = 0;
    }
    const lowP = pt(-135, 262), maxP = pt(135, 262);
    const low = K.svgText(svg, lowP[0] - 6, lowP[1] + 16, 'Low', { 'font-size': 32, 'font-weight': 700, fill: C.muted, 'text-anchor': 'middle' });
    const max = K.svgText(svg, maxP[0] + 6, maxP[1] + 16, 'Max', { 'font-size': 32, 'font-weight': 700, fill: C.red, 'text-anchor': 'middle' });
    const labels = [low, max];
    if (o.labels === false) labels.forEach(l => l.setAttribute('opacity', 0));
    gsap.set(ptr, { rotation: o.maxed ? 135 : -135, svgOrigin: '0 0' });
    gsap.set(wrap, { scale: o.scale ?? 1, transformOrigin: '50% 50%' });
    return { wrap, svg, track, band, ticks, lit, dial, ptr, ptrLine, labels, dog, N };
  }
  /** Draw the knob in at t (dial pops, scale ticks fan in). */
  function knobIn(tl, k, t) {
    tl.fromTo(k.dial, { opacity: 0, scale: 0.7, svgOrigin: '0 0' }, { opacity: 1, scale: 1, svgOrigin: '0 0', duration: 0.8, ease: 'back.out(1.5)' }, t);
    A.draw(tl, [k.track, k.band], t + 0.2, 0.9);
    tl.fromTo(k.ticks, { opacity: 0 }, { opacity: 1, duration: 0.25, stagger: 0.025 }, t + 0.25);
    A.in(tl, k.labels, t + 0.8, 'fade', { dur: 0.6 });
  }
  /** Sweep the pointer from Low to Max; ticks light up as the pointer passes them. */
  function knobSweep(tl, k, t, dur) {
    tl.fromTo(k.ptr, { rotation: -135, svgOrigin: '0 0' }, { rotation: 135, svgOrigin: '0 0', duration: dur, ease: 'sine.inOut' }, t);
    const inv = p => Math.acos(1 - 2 * p) / Math.PI; // inverse of sine.inOut
    k.lit.forEach((n, i) => tl.to(n, { opacity: 1, duration: 0.14, ease: 'none' }, t + inv(i / (k.N - 1)) * dur - 0.02));
    tl.to(k.ptrLine, { attr: { stroke: C.red }, duration: 0.3 }, t + inv(0.8) * dur);
  }

  window.CAD_PARTS = Object.assign(window.CAD_PARTS || {}, { smokeAlarm, alarmRing, volumeKnob, knobIn, knobSweep });

  // hub geometry shared by the end of ch02s02 and all of ch02s03. The hub sits a little right of centre so
  // the top badge clears the end of the left-aligned heading; the heading and subtitle balance it on the left.
  const HUB = { cx: 1000, cy: 650, s: 0.8 };
  const KR = 196; // knob outer radius at hub scale, where arrows start
  const ARW = {
    away: [HUB.cx - KR, HUB.cy, HUB.cx - 400, HUB.cy],
    toward: [HUB.cx + KR, HUB.cy, HUB.cx + 400, HUB.cy],
    release: [HUB.cx, HUB.cy - KR, HUB.cx, 340],
  };
  const BADGE = { away: [HUB.cx - 476, HUB.cy], toward: [HUB.cx + 476, HUB.cy], release: [HUB.cx, 272] };
  const SLOT_Y = 866; // bottom takeaway slot under the knob (note card, then the question card)
  /** A card centred under the hub in the bottom slot. Returns {row, card}. */
  function slotCard(parent, cls) {
    const row = K.el('div', 'c2-row');
    Object.assign(row.style, { left: (HUB.cx - 700) + 'px', top: SLOT_Y + 'px', width: '1400px' });
    const card = K.el('div', cls);
    row.appendChild(card);
    parent.appendChild(row);
    return { row, card };
  }
  /** Dashed "?" placeholders at the three arrow tips (filled by the badges in ch02s03). */
  function placeholders(svg) {
    return ['away', 'toward', 'release'].map(k => {
      const [x, y] = BADGE[k], r = k === 'release' ? 52 : 58;
      const g = K.group(svg);
      K.circle(g, x, y, r, { fill: 'rgba(255,255,255,0.55)', stroke: '#c3ccb8', 'stroke-width': 4, 'stroke-dasharray': '10 9' });
      K.svgText(g, x, y + 17, '?', { 'font-family': 'Rubik', 'font-size': 50, 'font-weight': 700, fill: '#aab59e', 'text-anchor': 'middle' });
      return g;
    });
  }
  /**
   * Scene time when `phrase` is spoken in beat i, estimated from its character position in the beat's
   * narration (works for any voice speed). Falls back to fraction `fb` of the beat.
   */
  const phraseAt = (ctx, i, phrase, fb = 0.5) => {
    const say = ((ctx.beats[i] || {}).say || '').toLowerCase();
    const k = say.indexOf(phrase.toLowerCase());
    const f = k >= 0 && say.length ? k / say.length : fb;
    return ctx.cue(i) + (ctx.end(i) - ctx.cue(i)) * f;
  };
  function greyArrows(svg) {
    return ['away', 'toward', 'release'].map(k => arrow(svg, ...ARW[k], { color: '#cdd5c3', width: 14 }));
  }

  // ================================================================== ch02s01
  registerScene('ch02s01', ctx => {
    const { stage, tl, cue, end, dur } = ctx;
    style(stage);
    const L = i => end(i) - cue(i);

    // photo, framed on the right (deck slide 2 mirrored)
    const ph = K.photo(stage, 'photo_reactivity.jpg', { x: 1060, y: 190, w: 760, h: 740, pos: '64% 45%' });
    A.in(tl, ph.root, cue(0) - 0.25, 'fadeLeft', { dur: 1.0 });
    A.kenburns(tl, ph.img, { from: 1.03, to: 1.13, t0: 0, t1: dur });

    // left column: heading, definition, analogy card
    const f = K.flow(stage, { x: 100, y: 150, w: 860, gap: 36 });
    const h = K.heading(f, 'What is reactivity?', { size: 84 });
    const def = K.text(f, 'An <span class="c2-hl">over-the-top</span> emotional reaction to something in your dog\'s world. Way bigger than the moment calls for.', { cls: 'lead', w: 860 });
    const hl = def.querySelector('.c2-hl');
    const card = K.el('div', 'c2-card');
    Object.assign(card.style, { width: '860px', height: '400px', marginTop: '10px' });
    f.appendChild(card);
    const cap = K.el('div', 'c2-cap', 'A smoke alarm for toast');
    Object.assign(cap.style, { left: '44px', top: '34px' });
    card.appendChild(cap);
    const svg = K.svgEl('svg', { viewBox: '0 0 860 400', width: 860, height: 400 }, card);
    Object.assign(svg.style, { position: 'absolute', left: 0, top: 0, overflow: 'visible' });
    const clipId = 'c2clip' + ++uid;
    K.svgEl('defs', {}, svg).innerHTML = `<clipPath id="${clipId}"><rect x="4" y="100" width="852" height="292" rx="22"/></clipPath>`;

    const al = smokeAlarm(svg, { x: 150, y: 246, r: 76, radii: [118, 164, 210, 256], span: 28, clip: clipId });

    // the tiny slice of toast (the actual trigger) with one wisp of smoke
    const tx = 690, ty = 318;
    const toastG = K.group(svg);
    K.svgEl('ellipse', { cx: tx, cy: ty + 6, rx: 66, ry: 11, fill: '#e9ede4' }, toastG);
    const tb = K.group(toastG, { transform: `translate(${tx - 40} ${ty - 88})` });
    const shape = 'M9 36 C-1 33 -1 7 20 5 C28 -1 52 -1 60 5 C81 7 81 33 71 36 L71 82 Q71 88 65 88 L15 88 Q9 88 9 82 Z';
    K.path(tb, shape, { fill: '#c98a45', stroke: '#9c6128', 'stroke-width': 3 });
    K.path(tb, shape, { fill: '#efc47e', stroke: 'none', transform: 'translate(40 50) scale(0.74) translate(-40 -50)' });
    K.path(tb, 'M24 50 L40 66 M36 42 L56 62', { stroke: '#d59b55', 'stroke-width': 4 });
    const wisp = K.path(toastG, `M${tx - 6} ${ty - 100} c -10 -10 10 -18 0 -30 M${tx + 12} ${ty - 98} c -8 -8 8 -14 0 -24`, { stroke: '#b9beb2', 'stroke-width': 4 });

    // ---- beat 1: photo, heading writes on, definition with 'over-the-top' highlighted
    A.in(tl, h.title, cue(0), 'wipe', { dur: 1.0 });
    A.in(tl, h.bar, cue(0) + 0.6, 'grow', { dur: 0.6 });
    A.in(tl, def, phraseAt(ctx, 0, "it's an", 0.36) - 0.3, 'fadeUp', { dur: 0.9 });
    tl.to(hl, { backgroundSize: '100% 34%', duration: 0.8, ease: 'power2.inOut' }, phraseAt(ctx, 0, 'over-the-top', 0.4));

    // ---- beat 2: smoke alarm for toast; red arcs blast and swell, toast stays tiny
    A.in(tl, card, cue(1) - 0.1, 'fadeUp', { dur: 0.8 });
    A.in(tl, cap, cue(1) + 0.25, 'fadeUp', { dur: 0.7 });
    tl.fromTo(toastG, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, cue(1) + 0.45);
    alarmRing(tl, al, cue(1) + 0.7, end(1));
    tl.fromTo(wisp, { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.2, ease: 'power1.inOut' }, cue(1) + 0.8);

    // ---- beat 3: behaviour tags pop in around the photo
    const tags = [
      { t: 'Barking', icon: 'megaphone', x: 1006, y: 262 },
      { t: 'Lunging', icon: 'chevrons-right', x: 1568, y: 598 },
      { t: 'Whining', icon: 'audio-lines', x: 1006, y: 704 },
      { t: 'Pacing', icon: 'footprints', x: 1520, y: 872 },
    ].map(o => {
      const c = K.chip(stage, o.t, { x: o.x, y: o.y, icon: o.icon, size: 32 });
      c.style.boxShadow = '0 14px 34px rgba(40,60,20,0.22), 0 3px 8px rgba(40,60,20,0.10)';
      return c;
    });
    ['barking', 'lunging', 'whining', 'pacing'].forEach((w, i) => A.in(tl, tags[i], phraseAt(ctx, 2, w, 0.15 + i * 0.08) - 0.1, 'pop', { dur: 0.6 }));
  });

  // ================================================================== ch02s02
  registerScene('ch02s02', ctx => {
    const { stage, tl, cue, end, dur } = ctx;
    style(stage);
    const L = i => end(i) - cue(i);

    const h = K.heading(stage, 'Magnitude, not intent', { x: 100, y: 140, size: 76 }); // 76 keeps clear of the top arrow tip
    const subs = ['How loud, *not why*', 'Same volume, *different reasons*', 'Which *direction*?'].map(s => K.text(stage, s, { x: 100, y: 300, cls: 'c2-sub' }));

    // arrows layer sits under the knobs
    const svg = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const arrows = greyArrows(svg);
    const ph = placeholders(svg);

    const K0 = { cx: 960, cy: 640 };
    const k2 = volumeKnob(stage, { cx: K0.cx, cy: K0.cy, scale: 1.12, maxed: true });
    gsap.set(k2.wrap, { opacity: 0 });
    const k1 = volumeKnob(stage, { cx: K0.cx, cy: K0.cy, scale: 1.12 });

    const mail = badge(stage, 'mail', { cx: 960, cy: 640, size: 140, color: C.greenDark, bg: '#fff' });
    const mailLab = label(stage, 'Mail carrier', { cx: 960, y: 732, w: 400, cls: 'c2-small' });
    const goAway = tag(stage, 'Go away', { cx: 520, y: 868, icon: DIR.away.icon, tone: 'amber' });
    const sayHi = tag(stage, 'Come say hi', { cx: 1400, y: 868, icon: DIR.toward.icon, tone: 'red' });

    // ---- beat 1: knob draws in, needle sweeps from low into the red zone
    A.in(tl, h.title, cue(0) - 0.2, 'wipe', { dur: 0.9 });
    A.in(tl, h.bar, cue(0) + 0.4, 'grow', { dur: 0.6 });
    knobIn(tl, k1, cue(0) + 0.2);
    knobSweep(tl, k1, cue(0) + Math.min(2.4, 0.24 * L(0)), 2.6);
    tl.to(k1.band, { opacity: 0.55, duration: 0.25, yoyo: true, repeat: 3 }, cue(0) + Math.min(2.4, 0.24 * L(0)) + 2.6);
    A.in(tl, subs[0], phraseAt(ctx, 0, 'it tells you', 0.58), 'fadeUp', { dur: 0.8 });

    // ---- beat 2: the knob splits into two maxed knobs around one mail carrier
    A.out(tl, subs[0], cue(1) - 0.2, 'fadeUp', { dur: 0.4 });
    A.in(tl, subs[1], cue(1) + 0.3, 'fadeUp', { dur: 0.8 });
    tl.set(k2.wrap, { opacity: 1 }, cue(1));
    tl.to(k1.wrap, { x: 520 - K0.cx, scale: 0.95, duration: 1.1, ease: 'power3.inOut' }, cue(1));
    tl.to(k2.wrap, { x: 1400 - K0.cx, scale: 0.95, duration: 1.1, ease: 'power3.inOut' }, cue(1));
    A.in(tl, mail, cue(1) + 0.8, 'pop', { dur: 0.7 });
    A.in(tl, mailLab, cue(1) + 1.1, 'fadeUp', { dur: 0.6 });
    A.in(tl, goAway, phraseAt(ctx, 1, 'one wants', 0.55) + 0.2, 'pop', { dur: 0.6 });
    A.in(tl, sayHi, phraseAt(ctx, 1, 'the other', 0.77) + 0.2, 'pop', { dur: 0.6 });

    // ---- beat 3: they merge back into one knob and three unlabeled arrows fan out
    A.out(tl, subs[1], cue(2) - 0.2, 'fadeUp', { dur: 0.4 });
    A.in(tl, subs[2], cue(2) + 0.3, 'fadeUp', { dur: 0.8 });
    A.out(tl, [goAway, sayHi, mail, mailLab], cue(2) - 0.1, 'fade', { dur: 0.45 });
    A.out(tl, [...k1.labels, ...k2.labels], cue(2) - 0.1, 'fade', { dur: 0.4 });
    tl.to([k1.wrap, k2.wrap], { x: HUB.cx - K0.cx, y: HUB.cy - K0.cy, scale: HUB.s, duration: 1.0, ease: 'power3.inOut' }, cue(2) + 0.1);
    tl.set(k2.wrap, { opacity: 0 }, cue(2) + 1.15);
    arrows.forEach((a, i) => {
      A.draw(tl, a.shaft, cue(2) + 1.0 + i * 0.2, 0.6);
      A.draw(tl, a.head, cue(2) + 1.45 + i * 0.2, 0.35);
    });
    A.in(tl, ph, cue(2) + 1.8, 'fade', { dur: 0.6, stagger: 0.2 });
  });

  // ================================================================== ch02s03
  registerScene('ch02s03', ctx => {
    const { stage, tl, cue, end, dur } = ctx;
    style(stage);
    const L = i => end(i) - cue(i);

    const h = K.heading(stage, 'Three directions', { x: 100, y: 140 });

    // layers: glow + arrows (svg), knob, badges/labels, fx svg on top
    const svg = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    K.svgEl('defs', {}, svg).innerHTML = '<filter id="c2glow" x="-50%" y="-200%" width="200%" height="500%"><feGaussianBlur stdDeviation="9"/></filter>';
    const grey = K.group(svg);
    const greyA = greyArrows(grey);
    const ph = placeholders(grey);
    const glowG = K.group(svg, { filter: 'url(#c2glow)' });
    const glow = {}, lit = {};
    ['away', 'toward', 'release'].forEach(k => {
      glow[k] = K.line(glowG, ...ARW[k], { stroke: DIR[k].col, 'stroke-width': 46, opacity: 0 });
    });
    // leash sits just under the toward arrow: slack first, then pulled taut
    const lx1 = ARW.toward[0] + 12, lx2 = ARW.toward[2] - 20, ly = HUB.cy + 28;
    const slackD = `M${lx1} ${ly} Q${(lx1 + lx2) / 2} ${ly + 86} ${lx2} ${ly}`;
    const tautD = `M${lx1} ${ly} Q${(lx1 + lx2) / 2} ${ly} ${lx2} ${ly}`;
    const leashG = K.group(svg);
    const leash = K.path(leashG, slackD, { stroke: '#a86f43', 'stroke-width': 8 });
    const clip = K.circle(leashG, lx2, ly, 9, { fill: '#fff', stroke: '#a86f43', 'stroke-width': 5 });
    // strain marks that flash when the leash snaps taut
    const lm = (lx1 + lx2) / 2;
    const strain = [-40, 0, 40].map(dx => K.line(svg, lm + dx - 7, ly + 30, lm + dx + 7, ly + 16, { stroke: C.amber, 'stroke-width': 5, opacity: 0 }));
    ['away', 'toward', 'release'].forEach(k => { lit[k] = arrow(svg, ...ARW[k], { color: DIR[k].col, width: 16 }); });

    const knob = volumeKnob(stage, { cx: HUB.cx, cy: HUB.cy, scale: HUB.s, maxed: true, labels: false });

    const bAway = badge(stage, DIR.away.icon, { cx: BADGE.away[0], cy: BADGE.away[1], size: 128, bg: DIR.away.pale, color: DIR.away.col });
    const bToward = badge(stage, DIR.toward.icon, { cx: BADGE.toward[0], cy: BADGE.toward[1], size: 128, bg: DIR.toward.pale, color: DIR.toward.col });
    const bRelease = badge(stage, DIR.release.icon, { cx: BADGE.release[0], cy: BADGE.release[1], size: 116, bg: C.green, color: '#fff' });
    const lab = (k, word, rest, o) => label(stage, `<span style="color:${DIR[k].text}">${word}</span> ${rest}`, o);
    const lAway = lab('away', 'Away:', 'fear', { cx: BADGE.away[0], y: 740, w: 440 });
    const lToward = lab('toward', 'Toward:', 'frustration', { cx: BADGE.toward[0], y: 740, w: 500 });
    const lRelease = lab('release', 'Release:', 'letting off steam', { x: BADGE.release[0] + 84, y: BADGE.release[1] - 24, w: 560, align: 'left' });

    // road rage: a car on the toward arrow, honking
    const carX = (ARW.toward[0] + ARW.toward[2]) / 2 + 2, carY = HUB.cy;
    const car = badge(stage, 'car', { cx: carX, cy: carY, size: 100, bg: '#fff', color: C.red });
    const rage = tag(stage, 'Leash road rage', { cx: carX + 60, y: 470, tone: 'red' });

    const fx = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const horn = rays(fx, carX, carY, 62, 88, [-72, -48, -24], { stroke: C.amber, 'stroke-width': 6 });
    const spark = rays(fx, BADGE.release[0], BADGE.release[1], 72, 100, [-162, -130, -90, -50, -18], { stroke: C.green, 'stroke-width': 6 });

    // question card with the coach badge
    const qRow = K.el('div', 'c2-row');
    Object.assign(qRow.style, { left: '360px', top: '856px', width: '1200px' });
    const q = K.el('div', 'c2-q');
    const tr = K.el('div', 'c2-try');
    tr.appendChild(K.icon('notebook-pen'));
    tr.appendChild(K.el('span', null, 'Try this'));
    q.appendChild(tr);
    q.appendChild(K.el('div', 'c2-qt', `<span style="color:${DIR.away.text}">Away</span>, <span style="color:${DIR.toward.text}">toward</span>, or <span style="color:${DIR.release.text}">release</span>?`));
    qRow.appendChild(q);
    stage.appendChild(qRow);

    // ---- scene open: the hub from the previous scene is already there
    A.in(tl, h.title, 0.05, 'wipe', { dur: 0.8 });
    A.in(tl, h.bar, 0.4, 'grow', { dur: 0.5 });
    A.in(tl, [grey, knob.wrap], 0, 'fade', { dur: 0.45 });

    const lightUp = (k, badgeEl, labelEl, t) => {
      A.draw(tl, lit[k].shaft, t, 0.6);
      A.draw(tl, lit[k].head, t + 0.45, 0.3);
      A.out(tl, ph[['away', 'toward', 'release'].indexOf(k)], t + 0.5, 'fade', { dur: 0.3 });
      A.in(tl, badgeEl, t + 0.5, 'pop', { dur: 0.7 });
      A.in(tl, labelEl, t + 0.85, k === 'release' ? 'fadeRight' : 'fadeUp', { dur: 0.7 });
    };
    const awayGroup = [lit.away.g, bAway, lAway];
    const towardGroup = [lit.toward.g, bToward, lToward, leashG, car, rage, ...horn];

    // ---- beat 1: away (fear)
    lightUp('away', bAway, lAway, cue(0));

    // ---- beat 2: toward (frustration), the leash pulls taut
    A.dim(tl, awayGroup, cue(1) - 0.1, 0.35);
    lightUp('toward', bToward, lToward, cue(1));
    tl.fromTo(leash, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.8, ease: 'power2.inOut' }, cue(1) + 1.1);
    A.in(tl, clip, cue(1) + 1.6, 'fade', { dur: 0.3 });
    const tautT = Math.max(cue(1) + 2.4, Math.min(end(1) - 1.2, phraseAt(ctx, 1, 'and the leash', 0.8)));
    tl.to(leash, { attr: { d: tautD }, duration: 0.35, ease: 'power3.in' }, tautT);
    tl.to(leashG, { y: 2.5, duration: 0.05, yoyo: true, repeat: 9, ease: 'sine.inOut' }, tautT + 0.35);
    tl.to(knob.wrap, { x: 10, duration: 0.14, yoyo: true, repeat: 3, ease: 'sine.inOut' }, tautT + 0.1);
    tl.fromTo(strain, { opacity: 0 }, { opacity: 1, duration: 0.2, stagger: 0.06 }, tautT + 0.35);
    tl.to(strain, { opacity: 0, duration: 0.5 }, tautT + 1.6);

    // ---- beat 3: road rage car slides onto the arrow and honks
    tl.fromTo(car, { opacity: 0, x: -150 }, { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out' }, cue(2) + 0.1);
    A.in(tl, rage, cue(2) + 0.7, 'fadeUp', { dur: 0.7 });
    // horn lines: grow outward, then fade (never retract to a zero-length dot)
    const honk = (t, stay) => {
      tl.fromTo(horn, { opacity: 1, drawSVG: '0% 0%' }, { opacity: 1, drawSVG: '0% 100%', duration: 0.2, ease: 'power2.out', immediateRender: false }, t);
      if (!stay) tl.to(horn, { opacity: 0, duration: 0.25, ease: 'power2.in' }, t + 0.32);
    };
    gsap.set(horn, { opacity: 0 });
    honk(cue(2) + 1.0);
    const hornT = Math.max(cue(2) + 2.5, Math.min(end(2) - 1.2, phraseAt(ctx, 2, 'the horn', 0.85)));
    honk(hornT);
    honk(hornT + 0.65, true);
    A.pulse(tl, car, hornT, { scale: 1.12 });
    A.pulse(tl, car, hornT + 0.6, { scale: 1.12 });

    // ---- beat 4: release bursts upward
    A.dim(tl, [...awayGroup, ...towardGroup], cue(3) - 0.1, 0.3);
    lightUp('release', bRelease, lRelease, cue(3));
    gsap.set(spark, { opacity: 0 });
    tl.fromTo(spark, { opacity: 1, drawSVG: '0% 0%' }, { opacity: 1, drawSVG: '0% 100%', duration: 0.3, ease: 'power2.out', immediateRender: false }, cue(3) + 0.8);
    tl.to(spark, { drawSVG: '100% 100%', opacity: 0, duration: 0.4, ease: 'power2.in' }, cue(3) + 1.15);

    // ---- beat 5: all three glow together, question card slides up
    A.undim(tl, [...awayGroup, ...towardGroup], cue(4), { dur: 0.6 });
    tl.to([glow.away, glow.toward, glow.release], { opacity: 0.32, duration: 0.8, ease: 'power2.out' }, cue(4) + 0.1);
    tl.to([glow.away, glow.toward, glow.release], { opacity: 0.14, duration: 0.9, yoyo: true, repeat: 3, ease: 'sine.inOut' }, cue(4) + 0.9);
    A.pulse(tl, [bAway, bToward, bRelease], cue(4) + 0.2, { scale: 1.1 });
    A.in(tl, q, Math.max(cue(4) + 1.0, phraseAt(ctx, 4, 'ask yourself', 0.3) - 0.2), 'fadeUp', { dur: 0.9 });
  });
})();
