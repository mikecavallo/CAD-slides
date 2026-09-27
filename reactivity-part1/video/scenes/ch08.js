/*
 * Chapter 08: Stress and recovery over time
 *   ch08s01  Threshold             title card, then the threshold zones: thinking brain under the line, survival brain over it
 *   ch08s02  Getting close         vertical stress gauge + warning-sign checklist, "your cue" flag, distance ruler
 *   ch08s03  Stress stacks up      the stress cup fills trigger by trigger and overflows, then one day of stress as a chart
 *   ch08s04  Up fast, down slow    one recovery curve, the "boo" startle, then yesterday's leftover stress raising today
 *   ch08s05  Empty the cup         decompression drains the cup, hard days spaced out on a week strip, closing question
 *
 * Shared look: the threshold is always a red dashed line with a red "Threshold" label; stress colours follow the
 * same green to amber to red ramp as the warning ladder; the stress cup is one builder used in s03 and s05.
 */
(function () {
  const C = {
    green: '#619537', greenDark: '#3f6b22', greenDeep: '#2c4a17', greenLight: '#b8d99a', pale: '#e8f1dc', mist: '#f3f8ec',
    ink: '#212121', inkSoft: '#4a4a4a', muted: '#7a7a7a', line: '#d9ddd3', red: '#b8452d', redPale: '#f8e3dd',
    amber: '#d9912b', amberPale: '#fbefd9', amberText: '#a8650f', cup: '#454a40', axis: '#8d9386',
  };
  // one colour per trigger, stepping up the calm-to-hot ramp
  const TRIG = { doorbell: '#9dbb3f', truck: '#c9b03a', skate: '#d9912b', jogger: '#c4512d' };
  const NS = 'http://www.w3.org/2000/svg';
  let uid = 0;

  // Lucide has no skateboard, so draw one in the same line style
  const CUSTOM = {
    skateboard: '<path d="M2 9.5c0 1.7 1.3 3 3 3h14c1.7 0 3-1.3 3-3"/><path d="M8 12.5v2M16 12.5v2"/><circle cx="8" cy="17" r="2.2"/><circle cx="16" cy="17" r="2.2"/>',
  };
  const iconInner = name => {
    const s = CUSTOM[name] || (window.ICONS || {})[name];
    if (!s) console.warn('missing icon', name);
    return s || '';
  };

  const CSS = `
  .c8-layer { position:absolute; left:0; top:0; width:1920px; height:1080px; }
  .c8-crow { position:absolute; display:flex; justify-content:center; }
  .c8-ideas { position:absolute; display:flex; justify-content:center; gap:44px; }
  .c8-idea { display:inline-flex; align-items:center; gap:24px; padding:18px 44px 18px 18px; border-radius:999px; background:#fff;
    box-shadow: var(--shadow-soft); border:1px solid #e6e9e1; font:700 46px/1 var(--font-head); color: var(--ink); white-space:nowrap; }
  .c8-idea .n { width:68px; height:68px; border-radius:50%; background: var(--green); color:#fff; display:grid; place-items:center; font:800 36px/1 var(--font-head); }
  .c8-zone { position:absolute; }
  .c8-zone.red { background: linear-gradient(180deg, #f5d5cb 0%, #fbebe6 100%); border-radius:26px 26px 0 0; }
  .c8-zone.green { background: linear-gradient(180deg, #edf5e3 0%, #dcebca 100%); border-radius:0 0 26px 26px; }
  .c8-ring { position:absolute; border:5px solid var(--green); border-top:0; border-radius:0 0 26px 26px; box-shadow: 0 0 30px rgba(97,149,55,0.35); }
  .c8-badge { position:absolute; border-radius:50%; display:grid; place-items:center; border:6px solid #fff;
    box-shadow: 0 12px 30px rgba(40,60,20,0.16), 0 3px 8px rgba(40,60,20,0.08); }
  .c8-badge svg { width:52%; height:52%; }
  .c8-lab { position:absolute; font:700 56px/1.06 var(--font-head); white-space:nowrap; }
  .c8-tags { position:absolute; display:flex; gap:16px; }
  .c8-tag { display:inline-flex; align-items:center; gap:10px; padding:14px 28px; border-radius:999px; font:700 30px/1 var(--font-body);
    white-space:nowrap; background:#fff; box-shadow: 0 6px 16px rgba(40,60,20,0.10); }
  .c8-tag.red { color: var(--red); }
  .c8-tag.green { color: var(--green-dark); }
  .c8-thr { display:inline-flex; align-items:center; padding:10px 30px; border-radius:999px; background:#fff; border:4px solid var(--red);
    color: var(--red); font:700 34px/1 var(--font-head); letter-spacing:0.5px; white-space:nowrap; box-shadow: var(--shadow-soft); }
  .c8-card { position:absolute; background:#fff; border-radius:26px; box-shadow: var(--shadow-soft); border:1px solid #e6e9e1; }
  .c8-calc { display:flex; align-items:center; gap:28px; padding:34px 44px; filter: grayscale(0); color: var(--ink); }
  .c8-calc .t { font:700 62px/1 var(--font-head); color: var(--ink); white-space:nowrap; }
  .c8-pill { display:inline-flex; align-items:center; gap:12px; padding:15px 34px; border-radius:999px; background: var(--green); color:#fff;
    font:700 38px/1 var(--font-head); white-space:nowrap; box-shadow: 0 10px 24px rgba(63,107,34,0.28); }
  .c8-row { position:absolute; display:flex; align-items:center; gap:26px; font:600 38px/1.1 var(--font-body); color: var(--ink); white-space:nowrap; }
  .c8-row .b { width:68px; height:68px; border-radius:50%; display:grid; place-items:center; flex:0 0 auto; }
  .c8-row .b svg { width:38px; height:38px; }
  .c8-gbar { position:absolute; border-radius:4px; }
  .c8-flag { position:absolute; display:flex; align-items:center; gap:14px; padding:12px 26px 12px 20px; background: var(--green); color:#fff;
    border-radius:16px; font:700 28px/1.2 var(--font-body); white-space:nowrap; box-shadow: 0 10px 24px rgba(63,107,34,0.28); }
  .c8-flag::before { content:''; position:absolute; left:-17px; top:50%; margin-top:-17px; width:0; height:0;
    border-top:17px solid transparent; border-bottom:17px solid transparent; border-right:18px solid var(--green); }
  .c8-rule { display:flex; align-items:center; gap:24px; padding:0 30px; }
  .c8-rule .b { width:78px; height:78px; border-radius:22px; background: var(--green-pale); color: var(--green-dark); display:grid; place-items:center; flex:0 0 auto; }
  .c8-rule .b svg { width:46px; height:46px; }
  .c8-rule .t { font:700 36px/1.1 var(--font-head); color: var(--ink); white-space:nowrap; }
  .c8-chip { display:inline-flex; align-items:center; gap:12px; padding:9px 24px 9px 16px; border-radius:999px; background:#fff;
    box-shadow: 0 6px 16px rgba(40,60,20,0.18); font:700 28px/1 var(--font-body); color: var(--ink); white-space:nowrap; }
  .c8-chip svg { width:32px; height:32px; }
  .c8-note { position:absolute; font:700 42px/1.15 var(--font-head); color: var(--red); white-space:nowrap; }
  .c8-big { position:absolute; font:700 54px/1.08 var(--font-head); color: var(--ink); white-space:nowrap; }
  .c8-lbl { position:absolute; display:inline-flex; align-items:center; gap:12px; padding:12px 26px; border-radius:999px;
    font:700 32px/1 var(--font-body); white-space:nowrap; box-shadow: var(--shadow-soft); }
  .c8-lbl svg { width:34px; height:34px; }
  .c8-lbl.red { background:#fff; color: var(--red); border:3px solid #efc3b7; }
  .c8-lbl.green { background:#fff; color: var(--green-deep); border:3px solid var(--green-light); }
  .c8-lbl b { font-weight:800; }
  .c8-inset { position:absolute; background:#fff; border-radius:26px; box-shadow: var(--shadow); border:1px solid #e6e9e1; }
  .c8-inset .ttl { position:absolute; left:34px; top:30px; font:700 40px/1 var(--font-head); color: var(--ink); white-space:nowrap; }
  .c8-item { position:absolute; display:flex; align-items:center; gap:24px; padding:0 30px; background:#fff; border-radius:24px;
    box-shadow: var(--shadow-soft); border:1px solid #e6e9e1; font:700 40px/1 var(--font-head); color: var(--ink); white-space:nowrap; }
  .c8-item .b { width:74px; height:74px; border-radius:50%; background: var(--green-pale); color: var(--green-dark); display:grid; place-items:center; flex:0 0 auto; }
  .c8-item .b svg { width:42px; height:42px; }
  .c8-day { position:absolute; background:rgba(255,255,255,0.92); border-radius:20px; border:1px solid #e3e7dd; box-shadow: 0 6px 18px rgba(40,60,20,0.08);
    text-align:center; padding-top:14px; font:700 28px/1 var(--font-body); color: var(--muted); }
  .c8-blk { position:absolute; border-radius:16px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px;
    font:700 28px/1.12 var(--font-body); text-align:center; }
  .c8-blk svg { width:40px; height:40px; }
  .c8-blk.hard { background: var(--red-pale); color: var(--red); border:3px solid #eab9ab; }
  .c8-blk.rest { background: var(--green-pale); color: var(--green-deep); border:3px solid var(--green-light); }
  .c8-q { position:absolute; font:800 170px/1 var(--font-head); color: var(--green); text-align:center; }
  .c8-final { position:absolute; font:700 76px/1.1 var(--font-head); color: var(--ink); text-align:center; white-space:nowrap; }
  `;
  const style = stage => stage.appendChild(K.el('style', null, CSS));

  // ------------------------------------------------------------------ small builders
  function ico(name, size, o = {}) {
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('fill', 'none');
    s.setAttribute('stroke', o.color || 'currentColor');
    s.setAttribute('stroke-width', o.stroke || 2.2);
    s.setAttribute('stroke-linecap', 'round');
    s.setAttribute('stroke-linejoin', 'round');
    s.innerHTML = iconInner(name);
    if (size) { s.style.width = size + 'px'; s.style.height = size + 'px'; }
    return s;
  }
  /** Lucide icon drawn inside an svg, centred on (cx, cy) at pixel size `size`. */
  function svgIcon(parent, name, cx, cy, size, attrs = {}) {
    const k = size / 24;
    const g = K.group(parent, Object.assign({ transform: `translate(${cx - size / 2} ${cy - size / 2}) scale(${k})`, fill: 'none', stroke: C.ink, 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, attrs));
    g.innerHTML = iconInner(name);
    return g;
  }
  function box(parent, cls, html, x, y, w, h, extra) {
    const n = K.el('div', cls, html);
    Object.assign(n.style, { position: 'absolute', left: x + 'px', top: y + 'px' });
    if (w != null) n.style.width = w + 'px';
    if (h != null) n.style.height = h + 'px';
    if (extra) Object.assign(n.style, extra);
    parent.appendChild(n);
    return n;
  }
  /** Put `child` in a full-width row so it is horizontally centred on cx. Returns the child. */
  function centred(parent, child, cx, top, w = 900) {
    const row = box(parent, 'c8-crow', null, cx - w / 2, top, w);
    row.appendChild(child);
    return child;
  }
  function badge(parent, name, cx, cy, size, bg, color, stroke = 2.2) {
    const b = box(parent, 'c8-badge', null, cx - size / 2, cy - size / 2, size, size, { background: bg, color });
    b.appendChild(ico(name, null, { stroke }));
    return b;
  }
  function tag(text, cls) { return K.el('div', 'c8-tag ' + (cls || ''), text); }
  function chip(name, text, color) {
    const c = K.el('div', 'c8-chip');
    c.appendChild(ico(name, 32, { stroke: 2.4, color }));
    c.appendChild(K.el('span', null, text));
    return c;
  }

  // ------------------------------------------------------------------ motion helpers
  /** Left-to-right write-on for a heading (clip padded so descenders never get cut). */
  function wipeIn(tl, el, t, dur = 0.9) {
    tl.fromTo(el, { clipPath: 'inset(-25% 102% -35% -2%)' }, { clipPath: 'inset(-25% -2% -35% -2%)', duration: dur, ease: 'power2.inOut' }, t);
  }
  function barIn(tl, bar, t) {
    tl.fromTo(bar, { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: 0.6, ease: 'power2.inOut' }, t);
  }
  /** Several headline texts sharing one spot and one accent bar; only one is on screen at a time. */
  function headline(stage, texts, o = {}) {
    const x = o.x ?? 100, y = o.y ?? 120, size = o.size ?? 80;
    const titles = texts.map(s => {
      const h = K.heading(stage, s, { x, y, w: 1460, size, bar: false });
      h.title.style.whiteSpace = 'nowrap';
      return h.title;
    });
    const bar = K.el('div', 'accent-bar');
    Object.assign(bar.style, { left: x + 'px', top: y + Math.round(size * 1.06) + 30 + 'px' });
    stage.appendChild(bar);
    return { titles, bar };
  }
  function swapTitle(tl, H, from, to, t) {
    tl.to(H.titles[from], { opacity: 0, y: -26, duration: 0.35, ease: 'power2.in' }, t - 0.15);
    wipeIn(tl, H.titles[to], t + 0.2, 0.8);
  }
  /** Pop an svg node in around a fixed point. */
  function svgPop(tl, node, t, cx, cy, dur = 0.55) {
    tl.fromTo(node, { opacity: 0, scale: 0.4, svgOrigin: `${cx} ${cy}` }, { opacity: 1, scale: 1, svgOrigin: `${cx} ${cy}`, duration: dur, ease: 'back.out(2)' }, t);
  }

  // ------------------------------------------------------------------ threshold line
  function thrLine(svg, x1, x2, y, attrs = {}, halo = false) {
    const a = Object.assign({ stroke: C.red, 'stroke-width': 5, 'stroke-dasharray': '12 16', 'stroke-linecap': 'round' }, attrs);
    // a white halo under the dashes keeps the line readable when it crosses coloured liquid
    const h = halo ? K.line(svg, x1, y, x2, y, { stroke: '#ffffff', 'stroke-width': (+a['stroke-width']) + 7, 'stroke-linecap': 'round', opacity: 0.8 }) : null;
    const l = K.line(svg, x1, y, x2, y, a);
    l._halo = h;
    return l;
  }
  /** Grow a dashed line from its start point (DrawSVG would eat the dash pattern). */
  function drawThr(tl, line, t, dur = 0.9) {
    const x1 = +line.getAttribute('x1'), x2 = +line.getAttribute('x2');
    const ls = line._halo ? [line._halo, line] : [line];
    tl.fromTo(ls, { attr: { x2: x1 + 0.5 } }, { attr: { x2 }, duration: dur, ease: 'power2.inOut' }, t);
    tl.fromTo(line, { opacity: 0 }, { opacity: 1, duration: 0.15 }, t);
    if (line._halo) tl.fromTo(line._halo, { opacity: 0 }, { opacity: 0.8, duration: 0.15 }, t);
  }

  // ------------------------------------------------------------------ stress curves
  /** One stress spike: smooth rise over rw, then settles to a residual share R of its height with time constant tau. */
  function spike(t, t0, amp, R, tau, rw = 0.025) {
    if (t <= t0) return 0;
    const d = t - t0;
    if (d < rw) { const s = d / rw; return amp * s * s * (3 - 2 * s); }
    return amp * (R + (1 - R) * Math.exp(-(d - rw) / tau));
  }
  function fnPath(fn, a, b, X, Y) {
    if (b - a < 1e-4) return '';
    const n = Math.max(2, Math.ceil((b - a) * 420));
    let d = '';
    for (let i = 0; i <= n; i++) {
      const t = a + ((b - a) * i) / n;
      d += (i ? 'L' : 'M') + X(t).toFixed(1) + ' ' + Y(fn(t)).toFixed(1);
    }
    return d;
  }
  /** Area between the curve and the threshold wherever the curve is above it. */
  function overArea(fn, a, b, thr, X, Y) {
    const n = Math.ceil((b - a) * 600);
    let d = '', on = false, last = a;
    for (let i = 0; i <= n; i++) {
      const t = a + ((b - a) * i) / n, v = fn(t);
      if (v > thr && !on) { d += `M${X(t).toFixed(1)} ${Y(thr).toFixed(1)}`; on = true; }
      if (on) d += `L${X(t).toFixed(1)} ${Y(Math.max(v, thr)).toFixed(1)}`;
      if (on && (v <= thr || i === n)) { d += `L${X(t).toFixed(1)} ${Y(thr).toFixed(1)}Z`; on = false; }
      last = t;
    }
    return d;
  }
  /**
   * A chart line that draws itself left to right from a to b (linear in time, so events line up with the x axis).
   * Returns the paths [main, redOverlay?]. The overlay is the same line in red, clipped to above the threshold.
   */
  function liveLine(tl, parent, fn, X, Y, a, b, t, dur, attrs = {}, overlay) {
    const base = Object.assign({ stroke: C.greenDark, 'stroke-width': 7, 'vector-effect': 'non-scaling-stroke' }, attrs);
    const paths = [K.path(parent, '', base)];
    if (overlay) paths.push(K.path(parent, '', Object.assign({}, base, { stroke: C.red, 'clip-path': `url(#${overlay})` })));
    const st = { p: a };
    const upd = () => { const d = fnPath(fn, a, st.p, X, Y); paths.forEach(q => q.setAttribute('d', d)); };
    tl.fromTo(st, { p: a }, { p: b, duration: dur, ease: 'none', onUpdate: upd }, t);
    return paths;
  }
  /** Axes for a stress-over-time chart. Everything that stretches with time lives in dataG. */
  function chart(parent, o = {}) {
    const x0 = o.x0 ?? 230, W = o.W ?? 1480, yb = o.yb ?? 810, yt = o.yt ?? 320;
    const X = t => x0 + t * W, Y = v => yb - v * (yb - yt);
    const wrap = box(parent, 'c8-layer', null, 0, 0, 1920, 1080);
    const svg = K.svg(wrap, {});
    const defs = K.svgEl('defs', {}, svg);
    const dataG = K.group(svg);
    const axX = K.line(dataG, x0, yb, x0 + W, yb, { stroke: C.axis, 'stroke-width': 4, 'vector-effect': 'non-scaling-stroke' });
    const axY = K.line(svg, x0, yb, x0, yt - 20, { stroke: C.axis, 'stroke-width': 4 });
    const arrowY = K.path(svg, `M${x0 - 12} ${yt - 6} L${x0} ${yt - 22} L${x0 + 12} ${yt - 6}`, { stroke: C.axis, 'stroke-width': 4, fill: 'none' });
    const yLab = K.svgText(svg, x0 - 24, yt + 4, o.yLabel || 'Stress', { 'text-anchor': 'end', 'font-size': 30, 'font-weight': 700, fill: C.inkSoft });
    return { wrap, svg, defs, dataG, X, Y, x0, W, yb, yt, axX, axY, arrowY, yLab };
  }
  function drawAxes(tl, ch, t) {
    A.draw(tl, [ch.axY, ch.axX], t, 0.8);
    tl.fromTo([ch.arrowY, ch.yLab], { opacity: 0 }, { opacity: 1, duration: 0.5 }, t + 0.5);
  }
  function clipAbove(ch, id, thrY) {
    const cp = K.svgEl('clipPath', { id }, ch.defs);
    K.svgEl('rect', { x: ch.x0 - 60, y: 0, width: ch.W + 120, height: thrY }, cp);
    return id;
  }

  // ------------------------------------------------------------------ the stress cup
  /**
   * Tumbler-shaped stress cup in stage coordinates. o: {cx, top, h, wTop, wBot, thr (y of threshold), bands:[{y0,y1,color}], level}
   * Liquid is a stack of coloured bands revealed from the bottom by a level clip, so pouring and draining are one tween.
   */
  function makeCup(parent, o) {
    const id = 'c8cup' + ++uid;
    const { cx, top, h } = o;
    const bottom = top + h, xl = cx - o.wTop / 2, xr = cx + o.wTop / 2, bl = cx - o.wBot / 2, br = cx + o.wBot / 2;
    const len = Math.hypot(bl - xl, h), ux = (bl - xl) / len, uy = h / len, r = 38;
    const d = `M${xl} ${top} L${bl - ux * r} ${bottom - uy * r} Q${bl} ${bottom} ${bl + r} ${bottom} L${br - r} ${bottom} Q${br} ${bottom} ${br + ux * r} ${bottom - uy * r} L${xr} ${top}`;
    const wallL = y => xl + ((bl - xl) * (y - top)) / h, wallR = y => xr - ((xr - br) * (y - top)) / h;

    const wrap = box(parent, 'c8-layer', null, 0, 0, 1920, 1080);
    const svg = K.svg(wrap, {});
    const defs = K.svgEl('defs', {}, svg);
    const cpI = K.svgEl('clipPath', { id: id + 'i' }, defs);
    K.svgEl('path', { d: d + 'Z' }, cpI);
    const cpL = K.svgEl('clipPath', { id: id + 'l' }, defs);
    const lvl0 = o.level ?? bottom;
    const lvRect = K.svgEl('rect', { x: xl - 40, y: lvl0, width: o.wTop + 80, height: bottom + 40 - lvl0 }, cpL);

    const body = K.group(svg);
    const glass = K.path(body, d + 'Z', { fill: 'rgba(255,255,255,0.72)', stroke: 'none' });
    const streamG = K.group(body);
    const inner = K.group(body, { 'clip-path': `url(#${id}i)` });
    const liquid = K.group(inner, { 'clip-path': `url(#${id}l)` });
    const bands = (o.bands || []).map(b => K.rect(liquid, xl - 30, b.y0, o.wTop + 60, b.y1 - b.y0 + 1.5, { fill: b.color }));
    const extra = K.group(inner); // things drawn inside the glass above the liquid (e.g. a "room to learn" band)
    const outline = K.path(body, d, { stroke: C.cup, 'stroke-width': 12, fill: 'none' });
    const shine = K.path(body, `M${wallL(top + 60) + 26} ${top + 60} L${wallL(bottom - 120) + 26} ${bottom - 120}`, { stroke: '#ffffff', 'stroke-width': 8, opacity: 0.4 });
    const thr = o.thr != null ? thrLine(svg, xl - 40, xr + 40, o.thr, {}, true) : null;

    const setLevel = (tl, y, t, dur = 0.9, ease = 'power2.inOut') =>
      tl.to(lvRect, { attr: { y, height: bottom + 40 - y }, duration: dur, ease }, t);
    return { wrap, svg, body, glass, streamG, inner, liquid, bands, extra, outline, shine, thr, setLevel, xl, xr, bl, br, top, bottom, cx, wallL, wallR, d };
  }
  /** Pour a stream from above into the cup while the level rises to y. */
  function pour(tl, cup, color, y, t) {
    const top = cup.top - 78;
    const s = K.rect(cup.streamG, cup.cx - 13, top, 26, 0, { rx: 13, fill: color });
    tl.fromTo(s, { attr: { y: top, height: 0 } }, { attr: { height: cup.bottom - top }, duration: 0.35, ease: 'power1.in' }, t);
    cup.setLevel(tl, y, t + 0.25, 0.9);
    tl.to(s, { attr: { y: cup.bottom, height: 0 }, duration: 0.45, ease: 'power1.in' }, t + 1.0);
  }

  // =================================================================== ch08s01  Threshold
  registerScene('ch08s01', ({ stage, tl, cue, end }) => {
    style(stage);
    const T = [0, 1, 2, 3, 4].map(i => cue(i));
    const L = i => Math.max(1, end(i) - cue(i));

    // ---- beat 0: title card with the two ideas
    const tc = K.heading(stage, 'Stress and recovery over time', { x: 100, y: 330, w: 1720, size: 100, align: 'center', barGap: 36 });
    tc.title.style.whiteSpace = 'nowrap';
    const ideas = box(stage, 'c8-ideas', null, 100, 590, 1720);
    const mkIdea = (n, s) => { const c = K.el('div', 'c8-idea', `<span class="n">${n}</span><span>${s}</span>`); ideas.appendChild(c); return c; };
    const idea1 = mkIdea(1, 'Threshold'), idea2 = mkIdea(2, 'Stress stacks up');
    wipeIn(tl, tc.title, T[0], 1.0);
    tl.fromTo(tc.bar, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'power2.inOut' }, T[0] + 0.75);
    A.in(tl, idea1, T[0] + 0.64 * L(0), 'fadeUp');
    A.in(tl, idea2, T[0] + 0.8 * L(0), 'fadeUp');
    A.out(tl, [tc.root, ideas], T[1] - 0.4, 'fadeUp', { dur: 0.45 });

    // ---- the threshold diagram
    const H = headline(stage, ['Under the line: thinking', 'Over the line: survival mode', 'Not stubborn. Unavailable.', 'Training happens under the line']);
    const PT = 280, LY = 610, PB = 940;
    const zR = box(stage, 'c8-zone red', null, 100, PT, 1720, LY - PT);
    const zG = box(stage, 'c8-zone green', null, 100, LY, 1720, PB - LY);
    const ring = box(stage, 'c8-ring', null, 100, LY, 1720, PB - LY);
    const svg = K.svg(stage, {});
    const line = thrLine(svg, 104, 1816, LY, { 'stroke-width': 6, 'stroke-dasharray': '14 18' });

    // under the line: thinking brain
    const brain = badge(stage, 'brain', 240, 775, 140, C.green, '#fff', 2);
    const gLab = box(stage, 'c8-lab', 'Thinking brain', 352, 700, null, null, { color: C.greenDark });
    const gTags = box(stage, 'c8-tags', null, 352, 790);
    const gt = ['Hears you', 'Takes treats', 'Makes choices'].map(s => gTags.appendChild(tag(s, 'green')));

    // over the line: survival brain
    const zap = badge(stage, 'zap', 240, 445, 140, C.red, '#fff', 2);
    const rLab = box(stage, 'c8-lab', 'Survival brain', 352, 370, null, null, { color: C.red });
    const rTags = box(stage, 'c8-tags', null, 352, 460);
    const rt = ['Fight', 'Flight', 'Freeze'].map(s => rTags.appendChild(tag(s, 'red')));

    // long division while being chased
    const calc = box(stage, 'c8-card c8-calc', null, 1090, 356);
    calc.appendChild(ico('calculator', 96, { stroke: 1.8 }));
    calc.appendChild(K.el('div', 't', '38 × 17 = ?'));
    const alert = badge(stage, 'triangle-alert', 1738, 440, 112, C.redPale, C.red, 2.2);

    // train here
    const AX = 1367;
    const arrG = K.group(svg);
    const shaft = K.line(arrG, AX, 572, AX, 782, { stroke: C.green, 'stroke-width': 16 });
    const head = K.path(arrG, `M${AX - 30} 758 L${AX} 790 L${AX + 30} 758`, { stroke: C.green, 'stroke-width': 16 });
    const train = centred(stage, K.el('div', 'c8-pill', 'Train here'), AX, 808, 500);

    const pill = centred(stage, K.el('div', 'c8-thr', 'Threshold'), 960, LY - 32, 600);

    // beat 1: the line, the green zone and the thinking brain
    wipeIn(tl, H.titles[0], T[1] + 0.15);
    barIn(tl, H.bar, T[1] + 0.3);
    drawThr(tl, line, T[1] + 0.05, 0.9);
    A.in(tl, pill, T[1] + 0.55, 'pop', { dur: 0.6 });
    A.in(tl, zG, T[1] + 0.35, 'fade', { dur: 0.7 });
    A.in(tl, brain, T[1] + 0.6, 'pop', { dur: 0.6 });
    A.in(tl, gLab, T[1] + 0.75, 'fadeRight', { dur: 0.7 });
    A.in(tl, gt, T[1] + 0.55 * L(1), 'fadeUp', { stagger: 0.35, dur: 0.6 });

    // beat 2: the red zone and the survival brain
    swapTitle(tl, H, 0, 1, T[2]);
    A.in(tl, zR, T[2] + 0.05, 'fade', { dur: 0.7 });
    A.in(tl, zap, T[2] + 0.3, 'pop', { dur: 0.6 });
    A.in(tl, rLab, T[2] + 0.45, 'fadeRight', { dur: 0.7 });
    A.in(tl, rt, T[2] + 0.72 * L(2), 'fadeUp', { stagger: 0.3, dur: 0.55 });

    // beat 3: the calculator greys out while the alarm flashes
    swapTitle(tl, H, 1, 2, T[3]);
    A.in(tl, calc, T[3] + 0.1, 'pop', { dur: 0.6 });
    const tg = T[3] + 0.4 * L(3);
    tl.to(calc, { filter: 'grayscale(1)', opacity: 0.42, duration: 0.7, ease: 'power2.out' }, tg);
    A.in(tl, alert, tg - 0.1, 'pop', { dur: 0.5 });
    tl.to(alert, { opacity: 0.3, duration: 0.18, yoyo: true, repeat: 5, ease: 'sine.inOut' }, tg + 0.5);

    // beat 4: train here
    swapTitle(tl, H, 2, 3, T[4]);
    A.draw(tl, shaft, T[4] + 0.1, 0.6);
    A.draw(tl, head, T[4] + 0.6, 0.3);
    A.in(tl, train, T[4] + 0.75, 'pop', { dur: 0.6 });
    A.in(tl, ring, T[4] + 0.5, 'fade', { dur: 0.8 });
  });

  // =================================================================== ch08s02  Getting close to threshold
  registerScene('ch08s02', ({ stage, tl, cue, end }) => {
    style(stage);
    const T = [0, 1, 2, 3, 4].map(i => cue(i));
    const L = i => Math.max(1, end(i) - cue(i));

    const h = K.heading(stage, 'Signs they’re getting close', { x: 100, y: 120, size: 80 });
    h.title.style.whiteSpace = 'nowrap';
    wipeIn(tl, h.title, T[0]);
    barIn(tl, h.bar, T[0] + 0.5);

    // ---- gauge
    const card = box(stage, 'c8-card', null, 100, 280, 660, 510);
    const svg = K.svg(stage, {});
    const defs = K.svgEl('defs', {}, svg);
    defs.innerHTML = `<linearGradient id="c8gg" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#7fb24a"/><stop offset="0.45" stop-color="#c2b235"/><stop offset="0.72" stop-color="#d9912b"/><stop offset="1" stop-color="#b8452d"/></linearGradient>`;
    const cp = K.svgEl('clipPath', { id: 'c8lv' }, defs);
    const TX = 196, TW = 96, TT = 330, TB = 750;
    const LV = p => TB - p * (TB - TT);
    const lv = K.svgEl('rect', { x: TX - 10, y: TB, width: TW + 20, height: 0 }, cp);
    const trackG = K.group(svg);
    K.rect(trackG, TX, TT, TW, TB - TT, { rx: 48, fill: '#eef1ea', stroke: '#d9ddd3', 'stroke-width': 3 });
    K.rect(trackG, TX + 1.5, TT + 1.5, TW - 3, TB - TT - 3, { rx: 46, fill: 'url(#c8gg)', opacity: 0.16 });
    K.rect(trackG, TX + 1.5, TT + 1.5, TW - 3, TB - TT - 3, { rx: 46, fill: 'url(#c8gg)', 'clip-path': 'url(#c8lv)' });
    const ptr = K.group(svg);
    K.path(ptr, 'M146 -16 L180 0 L146 16 Z', { fill: C.inkSoft, stroke: C.inkSoft, 'stroke-width': 4 });
    const thrY = LV(0.9);
    const tLine = thrLine(svg, 150, 730, thrY);
    const tLab = K.svgText(svg, 324, thrY - 18, 'Threshold', { 'font-size': 30, 'font-weight': 700, fill: C.red });
    const cLab = K.svgText(svg, 324, TB - 8, 'Calm', { 'font-size': 30, 'font-weight': 700, fill: C.greenDark });

    const level = (p, t, dur = 0.9, ease = 'power2.inOut') => {
      tl.to(lv, { attr: { y: LV(p), height: TB - LV(p) + 10 }, duration: dur, ease }, t);
      tl.to(ptr, { y: LV(p), duration: dur, ease }, t);
    };

    A.in(tl, card, T[0] + 0.1, 'fadeUp', { dur: 0.7 });
    tl.fromTo(trackG, { opacity: 0, scaleY: 0.15, svgOrigin: `${TX + TW / 2} ${TB}` }, { opacity: 1, scaleY: 1, svgOrigin: `${TX + TW / 2} ${TB}`, duration: 0.8 }, T[0] + 0.35);
    tl.fromTo(ptr, { opacity: 0, y: LV(0.02) }, { opacity: 1, y: LV(0.12), duration: 0.7 }, T[0] + 1.0);
    tl.to(lv, { attr: { y: LV(0.12), height: TB - LV(0.12) + 10 }, duration: 0.7 }, T[0] + 1.0);
    drawThr(tl, tLine, T[0] + 0.9, 0.8);
    tl.fromTo([tLab, cLab], { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.15 }, T[0] + 1.2);

    // ---- warning signs, in three groups that match the gauge colours
    const GC = [
      { bg: '#f3f0d2', fg: '#8a7c12', bar: '#c2b235' },
      { bg: C.amberPale, fg: C.amberText, bar: C.amber },
      { bg: C.redPale, fg: C.red, bar: '#c4512d' },
    ];
    const ROWS = [
      [0, 'cookie', 'Stops taking food'], [0, 'ear-off', 'Stops hearing you'],
      [1, 'eye', 'Fixed stare'], [1, 'meh', 'Tense body, closed mouth'], [1, 'arrow-big-right', 'Weight forward'],
      [2, 'chevrons-right', 'Pulling'], [2, 'scan-eye', 'Scanning'],
    ];
    const ys = [292, 376, 484, 568, 652, 760, 844];
    const rows = ROWS.map(([g, icn, s], i) => {
      const r = box(stage, 'c8-row', null, 880, ys[i]);
      const b = K.el('div', 'b');
      Object.assign(b.style, { background: GC[g].bg, color: GC[g].fg });
      b.appendChild(ico(icn, null, { stroke: 2.2 }));
      r.appendChild(b);
      r.appendChild(K.el('span', null, s));
      return r;
    });
    const GROUPS = [[0, 1], [2, 4], [5, 6]];
    const gbars = GROUPS.map(([a, b], g) => box(stage, 'c8-gbar', null, 848, ys[a], 8, ys[b] + 68 - ys[a], { background: GC[g].bar }));
    // each sign ticks in with its group's colour bar growing down beside it
    const clipB = f => `inset(0% 0% ${(100 - f * 100).toFixed(2)}% 0%)`;
    const sign = (i, t) => {
      const g = GROUPS.findIndex(([a, b]) => i >= a && i <= b), [a, b] = GROUPS[g];
      const f = (ys[i] + 68 - ys[a]) / (ys[b] + 68 - ys[a]);
      if (i === a) tl.fromTo(gbars[g], { clipPath: clipB(0) }, { clipPath: clipB(f), duration: 0.5, ease: 'power2.out' }, t);
      else tl.to(gbars[g], { clipPath: clipB(f), duration: 0.5, ease: 'power2.out' }, t);
      A.in(tl, rows[i], t, 'fadeRight', { dur: 0.7 });
    };

    // beat 0: two signs, gauge steps up
    sign(0, T[0] + 0.4 * L(0));
    sign(1, T[0] + 0.7 * L(0));
    level(0.36, T[0] + 0.84 * L(0));
    // beat 1: three more
    sign(2, T[1] + 0.05);
    sign(3, T[1] + 0.34 * L(1));
    sign(4, T[1] + 0.74 * L(1));
    level(0.6, T[1] + 0.86 * L(1));
    // beat 2: two more, gauge just under the mark
    sign(5, T[2] + 0.05);
    sign(6, T[2] + 0.36 * L(2));
    level(0.84, T[2] + 0.6 * L(2), 1.0);
    tl.to(ptr, { scale: 1.25, transformOrigin: '50% 50%', duration: 0.25, yoyo: true, repeat: 3, ease: 'power2.out' }, T[2] + 0.6 * L(2) + 1.1);

    // beat 3: your cue, add distance, back into the green
    const flagY = LV(0.74);
    const flag = box(stage, 'c8-flag', null, 326, flagY - 46);
    flag.appendChild(ico('flag', 32, { stroke: 2.4 }));
    flag.appendChild(K.el('span', null, 'Your cue to<br>add distance'));
    const undo = badge(stage, 'undo-2', 374, 566, 96, C.pale, C.greenDark, 2.4);
    A.in(tl, flag, T[3] + 0.1, 'fadeRight', { dur: 0.7 });
    const tDrop = T[3] + 0.36 * L(3);
    A.in(tl, undo, tDrop, 'pop', { dur: 0.55 });
    level(0.24, tDrop + 0.3, 1.4, 'power3.inOut');

    // beat 4: measure the distance
    const rule = box(stage, 'c8-card c8-rule', null, 100, 815, 660, 120);
    const rb = K.el('div', 'b');
    rb.appendChild(ico('ruler', null, { stroke: 2.2 }));
    rule.appendChild(rb);
    rule.appendChild(K.el('div', 't', 'Note your dog’s distance'));
    A.in(tl, rule, T[4] + 0.05, 'fadeRight', { dur: 0.8 });
  });

  // =================================================================== ch08s03  Stress stacks up
  registerScene('ch08s03', ({ stage, tl, cue, end }) => {
    style(stage);
    const T = [0, 1, 2, 3, 4, 5, 6].map(i => cue(i));
    const L = i => Math.max(1, end(i) - cue(i));
    const H = headline(stage, ['Stress stacks up', 'One day of stress', 'Small things add up', 'Over time, or all at once']);
    wipeIn(tl, H.titles[0], T[0]);
    barIn(tl, H.bar, T[0] + 0.5);

    // ---- the cup
    const CX = 960, TOP = 330, HGT = 560, THR = 400;
    const BANDS = [
      { key: 'doorbell', y0: 740, y1: 900, icon: 'bell', text: 'Doorbell' },
      { key: 'truck', y0: 590, y1: 740, icon: 'truck', text: 'Garbage truck' },
      { key: 'skate', y0: 430, y1: 590, icon: 'skateboard', text: 'Skateboard' },
      { key: 'jogger', y0: 300, y1: 430, icon: 'footprints', text: 'Jogger' },
    ];
    const cup = makeCup(stage, { cx: CX, top: TOP, h: HGT, wTop: 520, wBot: 400, thr: THR, bands: BANDS.map(b => ({ y0: b.y0, y1: b.y1, color: TRIG[b.key] })) });
    const W = cup.wrap;
    const tLab = K.svgText(cup.svg, cup.xr + 56, THR + 11, 'Threshold', { 'font-size': 30, 'font-weight': 700, fill: C.red });

    // chips sit inside their band (the jogger chip rides in above the threshold line)
    const chipY = [820, 665, 510, 341];
    const chips = BANDS.map((b, i) => centred(W, chip(b.icon, b.text, TRIG[b.key]), CX, i === 3 ? chipY[i] : chipY[i] - 25, 600));

    // beat 0: cup and threshold
    tl.fromTo(cup.glass, { opacity: 0 }, { opacity: 1, duration: 0.6 }, T[0] + 0.2);
    A.draw(tl, cup.outline, T[0] + 0.2, 1.2);
    tl.fromTo(cup.shine, { opacity: 0 }, { opacity: 0.4, duration: 0.6 }, T[0] + 1.1);
    drawThr(tl, cup.thr, T[0] + 1.0, 0.8);
    tl.fromTo(tLab, { opacity: 0 }, { opacity: 1, duration: 0.4 }, T[0] + 1.1);

    // beat 1: three pours
    const P = [T[1] + 0.15, T[1] + 0.31 * L(1), T[1] + 0.58 * L(1)];
    [0, 1, 2].forEach(i => {
      pour(tl, cup, TRIG[BANDS[i].key], BANDS[i].y0, P[i]);
      A.in(tl, chips[i], P[i] + 0.85, 'pop', { dur: 0.5 });
    });

    // beat 2: the jogger is the last drop, and the cup overflows
    const drop = K.group(cup.svg);
    K.path(drop, `M${CX} 256 C${CX + 9} 272 ${CX + 17} 283 ${CX + 17} 294 A17 17 0 0 1 ${CX - 17} 294 C${CX - 17} 283 ${CX - 9} 272 ${CX} 256 Z`, { fill: TRIG.jogger, stroke: 'none' });
    svgPop(tl, drop, T[2] + 0.1, CX, 290);
    tl.fromTo(chips[3], { opacity: 0, x: 150, y: -96, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.55, ease: 'back.out(2)' }, T[2] + 0.2);
    const tD = T[2] + 0.64 * L(2);
    tl.to(drop, { y: 138, duration: 0.45, ease: 'power2.in' }, tD);
    tl.to(drop, { opacity: 0, duration: 0.12 }, tD + 0.4);
    cup.setLevel(tl, TOP - 2, tD + 0.38, 0.45, 'power2.out');
    tl.to(chips[3], { x: 0, y: 0, duration: 0.6, ease: 'power2.inOut' }, tD + 0.45);
    // overflow: a red dome over the rim and drips down both outer walls
    const ov = K.group(cup.svg);
    const dome = K.path(ov, `M${cup.xl - 4} ${TOP} C${cup.xl + 70} ${TOP - 40} ${cup.xr - 70} ${TOP - 40} ${cup.xr + 4} ${TOP} Z`, { fill: TRIG.jogger, stroke: 'none' });
    const dripL = K.path(ov, `M${cup.xl + 6} ${TOP - 8} Q${cup.xl - 14} ${TOP - 4} ${cup.xl - 13} ${TOP + 22} L${cup.wallL(TOP + 250) - 13} ${TOP + 250}`, { stroke: TRIG.jogger, 'stroke-width': 14 });
    const dripR = K.path(ov, `M${cup.xr - 6} ${TOP - 8} Q${cup.xr + 14} ${TOP - 4} ${cup.xr + 13} ${TOP + 22} L${cup.wallR(TOP + 190) + 13} ${TOP + 190}`, { stroke: TRIG.jogger, 'stroke-width': 14 });
    const dL = K.circle(ov, cup.wallL(TOP + 250) - 13, TOP + 262, 11, { fill: TRIG.jogger });
    const dR = K.circle(ov, cup.wallR(TOP + 190) + 13, TOP + 202, 11, { fill: TRIG.jogger });
    tl.fromTo(dome, { scaleY: 0, svgOrigin: `${CX} ${TOP}` }, { scaleY: 1, svgOrigin: `${CX} ${TOP}`, duration: 0.4, ease: 'back.out(2)' }, tD + 0.8);
    A.draw(tl, [dripL, dripR], tD + 0.95, 0.9, { stagger: 0.12 });
    tl.fromTo([dL, dR], { opacity: 0 }, { opacity: 1, duration: 0.2, stagger: 0.12 }, tD + 1.75);
    const note = box(W, 'c8-note', 'The last drop overflows', 1290, 470);
    A.in(tl, note, tD + 0.95, 'fadeLeft', { dur: 0.7 });

    // beat 3: it was everything before: trigger stacking
    const bx = 650;
    const brace = K.path(cup.svg, `M${bx + 26} ${TOP} Q${bx} ${TOP} ${bx} ${TOP + 30} L${bx} ${588} Q${bx} ${615} ${bx - 26} ${615} Q${bx} ${615} ${bx} ${642} L${bx} ${870} Q${bx} ${900} ${bx + 26} ${900}`, { stroke: C.greenDark, 'stroke-width': 7 });
    const stack = box(W, 'c8-big', 'Trigger<br>stacking', 360, 556, 240, null, { textAlign: 'right' });
    A.draw(tl, brace, T[3] + 0.1, 0.9);
    A.in(tl, stack, T[3] + 0.5, 'fadeRight', { dur: 0.7 });
    A.pulse(tl, chips, T[3] + 1.2, { scale: 1.08 });

    // ---- beat 4: the cup slides away, one day as a chart
    tl.to(W, { x: -320, opacity: 0, duration: 0.6, ease: 'power2.in' }, T[4] - 0.2);
    swapTitle(tl, H, 0, 1, T[4]);

    const TH = 0.78;
    const DAY = [[0.18, 0.28], [0.40, 0.30], [0.61, 0.30], [0.82, 0.32]];
    const fDay = t => 0.1 + DAY.reduce((s, [t0, a]) => s + spike(t, t0, a, 0.5, 0.05), 0);
    const fCalm = t => 0.1 + spike(t, 0.82, 0.32, 0.5, 0.05);
    const ch = chart(stage, { x0: 230, W: 1480, yb: 810, yt: 320 });
    const { X, Y, svg, dataG } = ch;
    const over = clipAbove(ch, 'c8over3', Y(TH));
    const area = K.path(dataG, overArea(fDay, 0.78, 1, TH, X, Y), { fill: C.red, opacity: 0, stroke: 'none' });
    const thr = thrLine(dataG, ch.x0, ch.x0 + ch.W, Y(TH), { 'vector-effect': 'non-scaling-stroke' });
    const thrLab = K.svgText(svg, ch.x0 + 18, Y(TH) - 16, 'Threshold', { 'font-size': 30, 'font-weight': 700, fill: C.red });
    const labStyle = { 'font-size': 28, 'font-weight': 700, fill: C.inkSoft };
    const morning = K.svgText(svg, ch.x0, ch.yb + 58, 'Morning', labStyle);
    const evening = K.svgText(svg, ch.x0 + ch.W, ch.yb + 58, 'Evening', Object.assign({ 'text-anchor': 'end' }, labStyle));
    const ICOL = ['#6f8f2a', '#8f7d16', C.amberText, C.red];
    const evIcons = [['bell', 0], ['truck', 1], ['skateboard', 2], ['footprints', 3]].map(([n, i]) => {
      const g = K.group(svg), inner = K.group(g), x = X(DAY[i][0]), y = ch.yb + 48;
      K.circle(inner, x, y, 30, { fill: '#fff', stroke: '#e0e4da', 'stroke-width': 2 });
      svgIcon(inner, n, x, y, 34, { stroke: ICOL[i] });
      return { g, inner, x, y, t: DAY[i][0] };
    });

    drawAxes(tl, ch, T[4] + 0.3);
    tl.fromTo([morning, evening], { opacity: 0 }, { opacity: 1, duration: 0.5 }, T[4] + 0.7);
    const D1 = 3.2, S1 = T[4] + 0.9, CUT = 0.78;
    liveLine(tl, dataG, fDay, X, Y, 0, CUT, S1, D1, {}, over);
    evIcons.slice(0, 3).forEach(e => svgPop(tl, e.inner, S1 + (e.t / CUT) * D1 - 0.1, e.x, e.y, 0.5));

    // beat 5: the threshold, the jogger tips it over, and a calm day for comparison
    swapTitle(tl, H, 1, 2, T[5]);
    drawThr(tl, thr, T[5] + 0.1, 0.9);
    tl.fromTo(thrLab, { opacity: 0 }, { opacity: 1, duration: 0.5 }, T[5] + 0.5);
    const S2 = T[5] + 1.0, D2 = 1.1;
    liveLine(tl, dataG, fDay, X, Y, CUT, 1, S2, D2, {}, over);
    svgPop(tl, evIcons[3].inner, S2 + ((0.82 - CUT) / (1 - CUT)) * D2 - 0.1, evIcons[3].x, evIcons[3].y, 0.5);
    tl.to(area, { opacity: 0.22, duration: 0.6 }, S2 + D2);
    const tG = T[5] + 0.5 * L(5);
    const ghost = liveLine(tl, dataG, fCalm, X, Y, 0.72, 1, tG, 1.2, { stroke: '#a3a79e', 'stroke-width': 6, opacity: 0.8 });
    dataG.insertBefore(ghost[0], dataG.firstChild);
    const calm = K.svgText(svg, X(0.875), 728, 'Calm day', { 'font-size': 28, 'font-weight': 700, fill: '#8d9188' });
    tl.fromTo(calm, { opacity: 0 }, { opacity: 1, duration: 0.5 }, tG + 0.9);

    // beat 6: make room, then the "all at once" inset
    const NW = 1000, k = NW / ch.W;
    swapTitle(tl, H, 2, 3, T[6]);
    const t6 = T[6] - 0.1;
    tl.to(dataG, { scaleX: k, svgOrigin: `${ch.x0} 0`, duration: 0.9, ease: 'power3.inOut' }, t6);
    tl.to(evening, { x: -(ch.W - NW), duration: 0.9, ease: 'power3.inOut' }, t6);
    tl.to(calm, { x: -(X(0.875) - ch.x0) * (1 - k), duration: 0.9, ease: 'power3.inOut' }, t6);
    evIcons.forEach(e => tl.to(e.g, { x: -(e.x - ch.x0) * (1 - k), duration: 0.9, ease: 'power3.inOut' }, t6));

    const IX = 1310, IY = 300, IW = 500, IH = 500;
    const inset = box(stage, 'c8-inset', null, IX, IY, IW, IH);
    inset.appendChild(K.el('div', 'ttl', 'All at once'));
    const isvg = K.svg(inset, { x: 0, y: 0, w: IW, h: IH });
    const idefs = K.svgEl('defs', {}, isvg);
    const ix0 = 50, iW = 410, iyb = 440, iyt = 190, ITH = 0.58;
    const iX = t => ix0 + t * iW, iY = v => iyb - v * (iyb - iyt);
    const icp = K.svgEl('clipPath', { id: 'c8over3i' }, idefs);
    K.svgEl('rect', { x: 0, y: 0, width: IW, height: iY(ITH) }, icp);
    ['dog', 'skateboard', 'megaphone'].forEach((n, i) => {
      const cx = 64 + i * 78;
      K.circle(isvg, cx, 124, 30, { fill: C.redPale, stroke: 'none' });
      svgIcon(isvg, n, cx, 124, 34, { stroke: C.red });
    });
    K.line(isvg, ix0, iyb, ix0 + iW, iyb, { stroke: C.axis, 'stroke-width': 4 });
    K.line(isvg, ix0, iyb, ix0, iyt - 10, { stroke: C.axis, 'stroke-width': 4 });
    thrLine(isvg, ix0, ix0 + iW, iY(ITH), { 'stroke-width': 4, 'stroke-dasharray': '9 12' });
    const fBurst = t => 0.1 + [0.32, 0.38, 0.44].reduce((s, t0) => s + spike(t, t0, 0.24, 0.4, 0.15, 0.02), 0);
    tl.fromTo(inset, { opacity: 0, scale: 0.85, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.6)' }, T[6] + 0.45);
    liveLine(tl, isvg, fBurst, iX, iY, 0, 1, T[6] + 1.1, 1.3, { 'stroke-width': 6 }, 'c8over3i');
  });

  // =================================================================== ch08s04  Up fast, down slow
  registerScene('ch08s04', ({ stage, tl, cue, end }) => {
    style(stage);
    const T = [0, 1, 2, 3].map(i => cue(i));
    const L = i => Math.max(1, end(i) - cue(i));
    const H = headline(stage, ['Up fast, down slow', 'Yesterday is still in the cup']);
    wipeIn(tl, H.titles[0], T[0]);
    barIn(tl, H.bar, T[0] + 0.5);

    // ---- beat 0: one spike, steep climb and a long tail
    const f1 = t => 0.12 + spike(t, 0.18, 0.78, 0, 0.22, 0.04);
    const ch = chart(stage, { x0: 230, W: 1480, yb: 810, yt: 320 });
    const { X, Y, svg, dataG } = ch;
    const time = K.svgText(svg, ch.x0 + ch.W, ch.yb + 58, 'Time', { 'text-anchor': 'end', 'font-size': 28, 'font-weight': 700, fill: C.inkSoft });
    const hiRise = K.path(dataG, fnPath(f1, 0.17, 0.235, X, Y), { stroke: '#f1b9a8', 'stroke-width': 24, opacity: 0.9 });
    const hiTail = K.path(dataG, fnPath(f1, 0.3, 1, X, Y), { stroke: C.greenLight, 'stroke-width': 24, opacity: 0.9 });
    drawAxes(tl, ch, T[0] + 0.2);
    tl.fromTo(time, { opacity: 0 }, { opacity: 1, duration: 0.5 }, T[0] + 0.6);
    liveLine(tl, dataG, f1, X, Y, 0, 1, T[0] + 0.7, 2.8, { stroke: C.greenDark });

    // ---- beat 1: the friend who yelled boo
    const card = box(stage, 'c8-card', null, 1060, 300, 640, 230);
    const csvg = K.svg(stage, {});
    const CY = 415;
    const alertG = K.group(csvg);
    K.circle(alertG, 1152, CY, 64, { fill: C.redPale, stroke: '#fff', 'stroke-width': 6 });
    svgIcon(alertG, 'triangle-alert', 1152, CY - 2, 72, { stroke: C.red, 'stroke-width': 2.1 });
    const chev = K.path(csvg, `M1262 ${CY - 18} L1280 ${CY} L1262 ${CY + 18}`, { stroke: '#b9bfb2', 'stroke-width': 6 });
    const heartG = K.group(csvg);
    K.circle(heartG, 1392, CY, 64, { fill: C.redPale, stroke: '#fff', 'stroke-width': 6 });
    svgIcon(heartG, 'heart', 1392, CY + 2, 70, { stroke: C.red, fill: '#f1b9a8', 'stroke-width': 2.1 });
    const clockG = K.group(csvg);
    K.circle(clockG, 1592, CY, 64, { fill: C.pale, stroke: '#fff', 'stroke-width': 6 });
    K.circle(clockG, 1592, CY, 36, { fill: '#fff', stroke: C.greenDark, 'stroke-width': 5 });
    [0, 90, 180, 270].forEach(a => {
      const r = (a * Math.PI) / 180;
      K.line(clockG, 1592 + 27 * Math.sin(r), CY - 27 * Math.cos(r), 1592 + 32 * Math.sin(r), CY - 32 * Math.cos(r), { stroke: C.greenDark, 'stroke-width': 4 });
    });
    const hand = K.line(clockG, 1592, CY, 1592, CY - 24, { stroke: C.greenDark, 'stroke-width': 5 });
    K.circle(clockG, 1592, CY, 5, { fill: C.greenDark });

    A.in(tl, card, T[1] + 0.05, 'fadeUp', { dur: 0.6 });
    tl.fromTo(card, { width: 200 }, { width: 640, duration: 0.7, ease: 'power3.inOut' }, T[1] + 0.5 * L(1) - 0.6);
    svgPop(tl, alertG, T[1] + 0.3, 1152, CY);
    tl.to(alertG, { opacity: 0.35, duration: 0.16, yoyo: true, repeat: 5, ease: 'sine.inOut' }, T[1] + 0.9);
    const tH = T[1] + 0.5 * L(1);
    tl.fromTo(chev, { opacity: 0 }, { opacity: 1, duration: 0.4 }, tH - 0.2);
    svgPop(tl, heartG, tH, 1392, CY);
    svgPop(tl, clockG, tH + 0.2, 1592, CY);
    const tStop = T[3] - 0.2;
    const beats = Math.max(1, Math.floor((tStop - (tH + 0.7)) / 0.8));
    tl.to(heartG, { scale: 1.12, svgOrigin: `1392 ${CY}`, duration: 0.2, ease: 'power2.out', yoyo: true, repeat: beats * 2 - 1, repeatDelay: 0.2 }, tH + 0.7);
    tl.fromTo(hand, { rotation: 0, svgOrigin: `1592 ${CY}` }, { rotation: 360 * Math.max(1, Math.round((tStop - tH) / 2.2)), svgOrigin: `1592 ${CY}`, duration: tStop - tH - 0.4, ease: 'none' }, tH + 0.4);

    // ---- beat 2: adrenaline fast, full recovery slow
    const fast = box(stage, 'c8-lbl red', null, 0, 0);
    fast.appendChild(ico('zap', null, { stroke: 2.4 }));
    fast.appendChild(K.el('span', null, '<b>Adrenaline:</b> fast'));
    const fastRow = box(stage, 'c8-crow', null, 596, 300, 420, null, { justifyContent: 'flex-start' });
    fastRow.appendChild(fast);
    fast.style.position = 'relative';
    const slow = box(stage, 'c8-lbl green', null, 1040, 566);
    slow.appendChild(ico('clock', null, { stroke: 2.4 }));
    slow.appendChild(K.el('span', null, '<b>Full recovery:</b> hours, sometimes days'));
    A.draw(tl, hiRise, T[2] + 0.1, 0.5);
    A.in(tl, fast, T[2] + 0.3, 'pop', { dur: 0.6 });
    const tS = T[2] + 0.34 * L(2);
    A.draw(tl, hiTail, tS, 1.6, { ease: 'power1.inOut' });
    A.in(tl, slow, tS + 0.5, 'fadeLeft', { dur: 0.7 });

    // ---- beat 3: two days, yesterday's leftovers raise today
    const oneDay = [ch.wrap, card, csvg, fastRow, slow];
    tl.to(oneDay, { opacity: 0, duration: 0.45, ease: 'power2.in' }, T[3] - 0.25);
    swapTitle(tl, H, 0, 1, T[3]);

    const TH = 0.75;
    const f2 = t => 0.12 + spike(t, 0.14, 0.78, 0, 0.28, 0.03) + spike(t, 0.64, 0.56, 0.35, 0.07, 0.025);
    const c2 = chart(stage, { x0: 230, W: 1480, yb: 810, yt: 320 });
    const over = clipAbove(c2, 'c8over4', c2.Y(TH));
    const base = K.line(c2.dataG, c2.x0, c2.Y(0.12), c2.x0 + c2.W, c2.Y(0.12), { stroke: '#b3b8ac', 'stroke-width': 3, 'stroke-dasharray': '2 10', 'stroke-linecap': 'round' });
    const div = K.line(c2.svg, c2.X(0.5), c2.yt + 40, c2.X(0.5), c2.yb, { stroke: '#b3b8ac', 'stroke-width': 3, 'stroke-dasharray': '2 10', 'stroke-linecap': 'round' });
    const moon = K.group(c2.svg);
    K.circle(moon, c2.X(0.5), c2.yt + 6, 30, { fill: '#fff', stroke: '#e0e4da', 'stroke-width': 2 });
    svgIcon(moon, 'moon', c2.X(0.5), c2.yt + 6, 32, { stroke: C.inkSoft });
    const thr = thrLine(c2.dataG, c2.x0, c2.x0 + c2.W, c2.Y(TH));
    const thrLab = K.svgText(c2.svg, c2.x0 + c2.W, c2.Y(TH) - 16, 'Threshold', { 'text-anchor': 'end', 'font-size': 30, 'font-weight': 700, fill: C.red });
    const ls = { 'text-anchor': 'middle', 'font-size': 30, 'font-weight': 700, fill: C.inkSoft };
    const yest = K.svgText(c2.svg, c2.X(0.25), c2.yb + 60, 'Yesterday', ls);
    const today = K.svgText(c2.svg, c2.X(0.75), c2.yb + 60, 'Today', ls);
    const area = K.path(c2.dataG, overArea(f2, 0, 1, TH, c2.X, c2.Y), { fill: C.red, opacity: 0, stroke: 'none' });

    const t3 = T[3];
    drawAxes(tl, c2, t3 + 0.15);
    tl.fromTo([yest, today, div, moon, base], { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.06 }, t3 + 0.35);
    drawThr(tl, thr, t3 + 0.3, 0.8);
    tl.fromTo(thrLab, { opacity: 0 }, { opacity: 1, duration: 0.4 }, t3 + 0.8);
    const LS = t3 + 0.45, LD = 2.0;
    liveLine(tl, c2.dataG, f2, c2.X, c2.Y, 0, 1, LS, LD, {}, over);
    tl.to(area, { opacity: 0.22, duration: 0.5 }, LS + LD);

    // a little cup rides the line from yesterday into today
    const rider = K.group(c2.svg);
    const rIn = K.group(rider);
    K.circle(rIn, 0, 0, 36, { fill: '#fff', stroke: '#dfe3d8', 'stroke-width': 3 });
    const mc = 'M-15 -17 L-11 14 Q-10.5 17 -7 17 L7 17 Q10.5 17 11 14 L15 -17';
    const mcp = K.svgEl('clipPath', { id: 'c8mini' }, c2.defs);
    K.svgEl('path', { d: mc + 'Z' }, mcp);
    K.rect(rIn, -18, -2, 36, 22, { fill: C.amber, 'clip-path': 'url(#c8mini)' });
    K.path(rIn, mc, { stroke: C.cup, 'stroke-width': 3.5, fill: 'none' });
    const st = { t: 0.34 };
    const place = () => rider.setAttribute('transform', `translate(${c2.X(st.t).toFixed(1)} ${c2.Y(f2(st.t)).toFixed(1)})`);
    place();
    const RS = LS + LD * 0.4;
    tl.fromTo(rIn, { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, transformOrigin: '50% 50%', duration: 0.45, ease: 'back.out(2)' }, RS);
    tl.fromTo(st, { t: 0.34 }, { t: 0.62, duration: 2.3, ease: 'power1.inOut', onUpdate: place }, RS + 0.3);
  });

  // =================================================================== ch08s05  Empty the cup
  registerScene('ch08s05', ({ stage, tl, cue, end }) => {
    style(stage);
    const T = [0, 1, 2, 3].map(i => cue(i));
    const L = i => Math.max(1, end(i) - cue(i));
    const h = K.heading(stage, 'Plan decompression days', { x: 100, y: 120, size: 80 });
    h.title.style.whiteSpace = 'nowrap';
    wipeIn(tl, h.title, T[0]);
    barIn(tl, h.bar, T[0] + 0.5);

    // ---- the cup comes back nearly full
    const CX = 360, TOP = 330, HGT = 540, THR = 390, SHIFT = 600;
    const cup = makeCup(stage, {
      cx: CX, top: TOP, h: HGT, wTop: 420, wBot: 320, thr: THR, level: 402,
      bands: [
        { y0: 740, y1: 900, color: TRIG.doorbell }, { y0: 610, y1: 740, color: TRIG.truck },
        { y0: 480, y1: 610, color: TRIG.skate }, { y0: 300, y1: 480, color: TRIG.jogger },
      ],
    });
    const W = cup.wrap;
    const tLab = K.svgText(cup.svg, cup.xr + 48, THR + 11, 'Threshold', { 'font-size': 30, 'font-weight': 700, fill: C.red });
    gsap.set(W, { x: SHIFT });
    tl.fromTo(cup.body, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, T[0] + 0.2);
    drawThr(tl, cup.thr, T[0] + 0.7, 0.7);
    tl.fromTo(tLab, { opacity: 0 }, { opacity: 1, duration: 0.5 }, T[0] + 1.1);

    // ---- beat 0: decompression drains it
    const ITEMS = [['footprints', 'Sniffing'], ['bone', 'Chewing'], ['house', 'Quiet time'], ['moon', 'Rest']];
    const items = ITEMS.map(([n, s], i) => {
      const it = box(stage, 'c8-item', null, 836 + (i % 2) * 500, 282 + Math.floor(i / 2) * 132, 480, 112);
      const b = K.el('div', 'b');
      b.appendChild(ico(n, null, { stroke: 2.2 }));
      it.appendChild(b);
      it.appendChild(K.el('span', null, s));
      return it;
    });
    const tI = [0.5, 0.7, 0.8, 0.9].map(f => T[0] + f * L(0));
    tl.to(W, { x: 0, duration: 0.9, ease: 'power3.inOut' }, tI[0] - 0.9);
    const LEV = [470, 530, 580, 625];
    items.forEach((it, i) => {
      A.in(tl, it, tI[i], 'fadeLeft', { dur: 0.6 });
      cup.setLevel(tl, LEV[i], tI[i] + 0.15, 0.8);
    });

    // ---- beat 1: a week strip, hard days spaced apart
    const X0 = 836, CG = 12, CWD = (980 - 6 * CG) / 7, CY = 668, CH = 206;
    const cx = i => X0 + i * (CWD + CG);
    const calLab = box(stage, 'c8-big', 'Space out the hard days', 836, 578, null, null, { fontSize: '44px' });
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => box(stage, 'c8-day', d, cx(i), CY, CWD, CH));
    const blk = (i, cls, icon, text) => {
      const b = box(stage, 'c8-blk ' + cls, null, cx(i) + 8, CY + 56, CWD - 16, CH - 66);
      b.appendChild(ico(icon, null, { stroke: 2.2 }));
      b.appendChild(K.el('span', null, text));
      return b;
    };
    const hard1 = blk(1, 'hard', 'stethoscope', 'Hard<br>day');
    const hard2 = blk(2, 'hard', 'ferris-wheel', 'Hard<br>day');
    const rest = blk(2, 'rest', 'bed', 'Rest<br>day');
    A.in(tl, calLab, T[1] + 0.05, 'fadeUp', { dur: 0.6 });
    A.in(tl, days, T[1] + 0.2, 'fadeUp', { dur: 0.6, stagger: 0.06 });
    A.in(tl, [hard1, hard2], T[1] + 0.8, 'pop', { dur: 0.55, stagger: 0.15 });
    const tSep = T[1] + 0.52 * L(1);
    tl.to(hard2, { x: CWD + CG, duration: 0.8, ease: 'power3.inOut' }, tSep);
    A.in(tl, rest, tSep + 0.45, 'fadeDown', { dur: 0.6 });

    // ---- beat 2: room to learn
    const LOW = 760;
    const room = K.rect(cup.extra, cup.xl - 30, THR, 480, LOW - THR, { fill: C.green, opacity: 0 });
    const roomLab = box(W, 'c8-big', 'Room<br>to learn', CX - 200, (THR + LOW) / 2 - 58, 400, null, { textAlign: 'center', color: C.greenDeep, fontSize: '48px' });
    cup.setLevel(tl, LOW, T[2] + 0.05, 1.0);
    tl.to(room, { opacity: 0.18, duration: 0.7 }, T[2] + 0.7);
    A.in(tl, roomLab, T[2] + 0.9, 'fadeUp', { dur: 0.6 });

    // ---- beat 3: everything clears but the cup and one question
    const t3 = T[3];
    const clear = [h.title, h.bar, ...items, calLab, ...days, hard1, hard2, rest, cup.thr, cup.thr._halo, tLab, roomLab, room, cup.liquid];
    tl.to(clear, { opacity: 0, duration: 0.45, ease: 'power2.in' }, t3 - 0.1);
    tl.to(W, { x: 960 - CX, y: -40, scale: 0.62, transformOrigin: `${CX}px 600px`, duration: 1.0, ease: 'power3.inOut' }, t3 + 0.2);
    const q = box(stage, 'c8-q', '?', 760, 196, 400);
    const fin = box(stage, 'c8-final', 'What’s in the cup today?', 160, 772, 1600);
    A.in(tl, q, t3 + 0.9, 'pop', { dur: 0.6 });
    A.in(tl, fin, t3 + 1.1, 'fadeUp', { dur: 0.7 });
  });
})();
