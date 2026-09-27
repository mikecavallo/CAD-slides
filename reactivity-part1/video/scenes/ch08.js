/*
 * Chapter 08: Stress and recovery over time
 *   ch08s01  Threshold             Monday / Thursday calendars return, title card with three ideas, then the threshold zones
 *   ch08s02  Getting close         the zones stood on end as a bar with a climbing dog marker + warning-sign checklist
 *   ch08s03  Stress stacks up      the stress cup fills trigger by trigger and tips over the line, then shrinks into a
 *                                  gauge beside one day of stress as a chart
 *   ch08s04  Up fast, down slow    one recovery curve, the "boo" startle, then Wednesday's vet visit raising Thursday
 *   ch08s05  Empty the cup         decompression drains the cup, hard days spaced out on a week strip, closing question
 *
 * Shared look: the threshold is always the same red dashed stroke with the same white "Threshold" pill; stress
 * colours follow the green to amber to red ramp of the warning ladder; the stress cup is one builder (s03, s05)
 * with the threshold well below the rim and a grey base layer for the stress you can't see.
 */
(function () {
  const C = {
    green: '#619537', greenDark: '#3f6b22', greenDeep: '#2c4a17', greenLight: '#b8d99a', pale: '#e8f1dc', mist: '#f3f8ec',
    ink: '#212121', inkSoft: '#4a4a4a', muted: '#7a7a7a', line: '#d9ddd3', red: '#b8452d', redPale: '#f8e3dd',
    amber: '#d9912b', amberPale: '#fbefd9', amberText: '#a8650f', cup: '#454a40', axis: '#8d9386',
  };
  // one colour per trigger, stepping up the calm-to-hot ramp; BASE is the stress you can't see (poor sleep, sore hip)
  const TRIG = { doorbell: '#9dbb3f', truck: '#c9b03a', skate: '#d9912b', jogger: '#c4512d' };
  const BASE = '#a7ab9f';
  const NS = 'http://www.w3.org/2000/svg';
  let uid = 0;

  // Lucide has no skateboard, dashed line or tumbler, so draw them in the same line style
  const CUSTOM = {
    skateboard: '<path d="M2 9.5c0 1.7 1.3 3 3 3h14c1.7 0 3-1.3 3-3"/><path d="M8 12.5v2M16 12.5v2"/><circle cx="8" cy="17" r="2.2"/><circle cx="16" cy="17" r="2.2"/>',
    thrline: '<path d="M2 12h4.6M9.7 12h4.6M17.4 12h4.6"/>',
    cup: '<path d="M7.2 12.5h9.6l-.72 6.6a1.7 1.7 0 0 1-1.7 1.5H9.62a1.7 1.7 0 0 1-1.7-1.5Z" fill="currentColor" stroke="none" opacity="0.5"/>' +
      '<path d="M5.6 3.5l1.95 15.9a1.9 1.9 0 0 0 1.9 1.7h5.1a1.9 1.9 0 0 0 1.9-1.7l1.95-15.9"/>',
  };
  const iconInner = name => {
    const s = CUSTOM[name] || (window.ICONS || {})[name];
    if (!s) console.warn('missing icon', name);
    return s || '';
  };

  const CSS = `
  .c8-layer { position:absolute; left:0; top:0; width:1920px; height:1080px; }
  .c8-crow { position:absolute; display:flex; justify-content:center; }
  .c8-cal { position:absolute; background:#fff; border-radius:26px; box-shadow: var(--shadow); border:1px solid #e6e9e1; }
  .c8-cal .top { position:relative; height:122px; background: var(--green-dark); color:#fff; display:grid; place-items:center;
    font:700 50px/1 var(--font-head); border-radius:26px 26px 0 0; }
  .c8-cal .ring { position:absolute; top:16px; width:20px; height:20px; border-radius:50%; background:rgba(255,255,255,0.85); }
  .c8-cal .cbody { display:flex; flex-direction:column; align-items:center; padding-top:44px; }
  .c8-cal .ico { width:150px; height:150px; border-radius:50%; background: var(--green-pale); color: var(--green-dark); display:grid; place-items:center; }
  .c8-cal .ico svg { width:82px; height:82px; }
  .c8-cal .nm { margin-top:20px; font:700 44px/1.1 var(--font-head); color: var(--ink); }
  .c8-stat { position:absolute; width:124px; height:124px; border-radius:50%; display:grid; place-items:center; color:#fff; border:6px solid #fff;
    box-shadow: 0 12px 28px rgba(40,60,20,0.22); }
  .c8-stat.ok { background: var(--green); }
  .c8-stat.bad { background: var(--red); box-shadow: 0 12px 28px rgba(120,30,10,0.3); }
  .c8-stat svg { width:64px; height:64px; }
  .c8-ideas { position:absolute; display:flex; justify-content:center; gap:40px; }
  .c8-idea { display:inline-flex; align-items:center; gap:22px; padding:16px 40px 16px 16px; border-radius:999px; background:#fff;
    box-shadow: var(--shadow-soft); border:1px solid #e6e9e1; font:700 42px/1 var(--font-head); color: var(--ink); white-space:nowrap; }
  .c8-idea .ic { width:72px; height:72px; border-radius:50%; display:grid; place-items:center; flex:0 0 auto; }
  .c8-idea .ic svg { width:44px; height:44px; }
  .c8-zone { position:absolute; }
  .c8-zone.red { background: linear-gradient(180deg, #f5d5cb 0%, #fbebe6 100%); border-radius:26px 26px 0 0; }
  .c8-zone.green { background: linear-gradient(180deg, #edf5e3 0%, #dcebca 100%); border-radius:0 0 26px 26px; }
  .c8-zone.bar.red { background: linear-gradient(180deg, #eaa996 0%, #f3cabd 100%); }
  .c8-zone.bar.green { background: linear-gradient(180deg, #e1eed2 0%, #b9d893 100%); }
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
  .c8-thr { display:inline-flex; align-items:center; padding:10px 28px; border-radius:999px; background:#fff; border:4px solid var(--red);
    color: var(--red); font:700 30px/1 var(--font-head); letter-spacing:0.5px; white-space:nowrap; box-shadow: var(--shadow-soft); }
  .c8-card { position:absolute; background:#fff; border-radius:26px; box-shadow: var(--shadow-soft); border:1px solid #e6e9e1; }
  .c8-calc { display:flex; align-items:center; justify-content:center; gap:26px; filter: grayscale(0); color: var(--ink); }
  .c8-calc .t { font:700 58px/1 var(--font-head); color: var(--ink); white-space:nowrap; }
  .c8-pill { display:inline-flex; align-items:center; gap:12px; padding:15px 34px; border-radius:999px; background: var(--green); color:#fff;
    font:700 38px/1 var(--font-head); white-space:nowrap; box-shadow: 0 10px 24px rgba(63,107,34,0.28); }
  .c8-row { position:absolute; display:flex; align-items:center; gap:26px; font:600 38px/1.1 var(--font-body); color: var(--ink); white-space:nowrap; }
  .c8-row .b { width:68px; height:68px; border-radius:50%; display:grid; place-items:center; flex:0 0 auto; }
  .c8-row .b svg { width:38px; height:38px; }
  .c8-gbar { position:absolute; border-radius:4px; }
  .c8-mark { position:absolute; width:84px; height:84px; border-radius:50%; background:#fff; border:6px solid var(--green); color: var(--green-dark);
    display:grid; place-items:center; box-shadow: 0 10px 24px rgba(40,60,20,0.22); }
  .c8-mark svg { width:46px; height:46px; }
  .c8-flag { position:absolute; display:flex; align-items:center; gap:14px; padding:12px 26px 12px 20px; background: var(--green); color:#fff;
    border-radius:16px; font:700 28px/1.2 var(--font-body); white-space:nowrap; box-shadow: 0 10px 24px rgba(63,107,34,0.28); }
  .c8-flag::before { content:''; position:absolute; left:-17px; top:50%; margin-top:-17px; width:0; height:0;
    border-top:17px solid transparent; border-bottom:17px solid transparent; border-right:18px solid var(--green); }
  .c8-rule { display:flex; align-items:center; gap:24px; padding:0 30px; }
  .c8-rule .b { width:78px; height:78px; border-radius:22px; background: var(--green-pale); color: var(--green-dark); display:grid; place-items:center; flex:0 0 auto; }
  .c8-rule .b svg { width:46px; height:46px; }
  .c8-rule .t { font:700 36px/1.1 var(--font-head); color: var(--ink); white-space:nowrap; }
  .c8-try { position:absolute; display:inline-flex; align-items:center; gap:12px; padding:14px 26px 14px 18px; border-radius:999px; background: var(--green);
    color:#fff; font:700 26px/1 var(--font-body); letter-spacing:3px; text-transform:uppercase; white-space:nowrap; box-shadow: 0 10px 22px rgba(44,74,23,0.26); z-index:5; }
  .c8-try svg { width:32px; height:32px; }
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
  .c8-item { position:absolute; display:flex; align-items:center; gap:24px; padding:0 28px; background:#fff; border-radius:24px;
    box-shadow: var(--shadow-soft); border:1px solid #e6e9e1; font:700 40px/1 var(--font-head); color: var(--ink); white-space:nowrap; }
  .c8-item .b { width:72px; height:72px; border-radius:50%; background: var(--green-pale); color: var(--green-dark); display:grid; place-items:center; flex:0 0 auto; }
  .c8-item .b svg { width:40px; height:40px; }
  .c8-day { position:absolute; background:rgba(255,255,255,0.92); border-radius:20px; border:1px solid #e3e7dd; box-shadow: 0 6px 18px rgba(40,60,20,0.08);
    text-align:center; padding-top:14px; font:700 28px/1 var(--font-body); color: var(--muted); }
  .c8-day.wknd { color: var(--green-dark); background: #f6faf1; }
  .c8-blk { position:absolute; border-radius:16px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px;
    font:700 28px/1.12 var(--font-body); text-align:center; }
  .c8-blk svg { width:40px; height:40px; }
  .c8-blk.hard { background: var(--red-pale); color: var(--red); border:3px solid #eab9ab; }
  .c8-blk.rest { background: var(--green-pale); color: var(--green-deep); border:3px solid var(--green-light); }
  .c8-q { position:absolute; font:800 170px/1 var(--font-head); color: var(--green); text-align:center; }
  .c8-ask { position:relative; display:inline-flex; align-items:center; padding:34px 56px 30px; border-radius:26px; background:#fff;
    box-shadow: var(--shadow); border:1px solid #e6e9e1; font:700 64px/1.1 var(--font-head); color: var(--ink); white-space:nowrap; }
  .c8-ask .c8-try { left:-34px; top:-46px; }
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
  /** The one "Threshold" label, a white pill with a red border, centred on (cx, cy). 58 px tall. */
  function thrTag(parent, cx, cy) { return centred(parent, K.el('div', 'c8-thr', 'Threshold'), cx, cy - 29, 400); }
  /** The chapter-wide green "Try this" badge. */
  function tryBadge(parent, x, y) {
    const b = x == null ? K.el('div', 'c8-try') : box(parent, 'c8-try', null, x, y);
    b.appendChild(ico('notebook-pen', null, { stroke: 2.4 }));
    b.appendChild(K.el('span', null, 'Try this'));
    if (x == null) parent.appendChild(b);
    return b;
  }
  function tryIn(tl, b, t) {
    tl.fromTo(b, { opacity: 0, scale: 0.4, rotation: -14 }, { opacity: 1, scale: 1, rotation: -4, duration: 0.7, ease: 'back.out(1.8)' }, t);
  }

  // ------------------------------------------------------------------ motion helpers
  /**
   * Time a phrase starts in beat i's narration, minus a small lead. Uses the word-level alignment through the
   * framework's ctx.phrase when present (falls back to the phrase's share of the text), so it follows the real voice.
   */
  const sayAt = ctx => (i, phrase, lead = 0.3, fb = 0.4) => {
    const t0 = ctx.cue(i), t1 = ctx.end(i);
    let t;
    if (ctx.phrase) t = ctx.phrase(i, phrase, fb);
    else {
      const s = String((ctx.beats[i] || {}).say || '').toLowerCase(), k = s.indexOf(phrase.toLowerCase());
      t = t0 + (t1 - t0) * (k < 0 ? fb : k / Math.max(1, s.length));
    }
    return Math.max(t0, t - lead);
  };
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

  // ------------------------------------------------------------------ threshold line (one stroke style everywhere)
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
    let d = '', on = false;
    for (let i = 0; i <= n; i++) {
      const t = a + ((b - a) * i) / n, v = fn(t);
      if (v > thr && !on) { d += `M${X(t).toFixed(1)} ${Y(thr).toFixed(1)}`; on = true; }
      if (on) d += `L${X(t).toFixed(1)} ${Y(Math.max(v, thr)).toFixed(1)}`;
      if (on && (v <= thr || i === n)) { d += `L${X(t).toFixed(1)} ${Y(thr).toFixed(1)}Z`; on = false; }
    }
    return d;
  }
  /**
   * A chart line that draws itself left to right from a to b (linear in time, so events line up with the x axis).
   * Returns the paths [main, redOverlay?]. The overlay is the same line in red, clipped to above the threshold.
   * onV(v) is called with the value at the moving tip (used by the cup gauge in s03).
   */
  function liveLine(tl, parent, fn, X, Y, a, b, t, dur, attrs = {}, overlay, onV) {
    const base = Object.assign({ stroke: C.greenDark, 'stroke-width': 7, 'vector-effect': 'non-scaling-stroke' }, attrs);
    const paths = [K.path(parent, '', base)];
    if (overlay) paths.push(K.path(parent, '', Object.assign({}, base, { stroke: C.red, 'clip-path': `url(#${overlay})` })));
    const st = { p: a };
    const upd = () => {
      const d = fnPath(fn, a, st.p, X, Y);
      paths.forEach(q => q.setAttribute('d', d));
      if (onV && st.p > a + 1e-6) onV(fn(st.p)); // never at build time (immediate render)
    };
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
    const yLab = K.svgText(svg, x0 + 26, yt - 2, o.yLabel || 'Stress', { 'font-size': 30, 'font-weight': 700, fill: C.inkSoft });
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
  /** A white icon disc under the time axis marking an event. */
  function evIcon(svg, name, x, y, color) {
    const g = K.group(svg), inner = K.group(g);
    K.circle(inner, x, y, 30, { fill: '#fff', stroke: '#e0e4da', 'stroke-width': 2 });
    svgIcon(inner, name, x, y, 34, { stroke: color });
    return { g, inner, x, y };
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
    const levelNow = y => { lvRect.setAttribute('y', y.toFixed(1)); lvRect.setAttribute('height', (bottom + 40 - y).toFixed(1)); };
    return { wrap, svg, body, glass, streamG, inner, liquid, bands, extra, outline, shine, thr, setLevel, levelNow, xl, xr, bl, br, top, bottom, cx, wallL, wallR, d };
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
  registerScene('ch08s01', ctx => {
    const { stage, tl, cue, end } = ctx;
    style(stage);
    const T = [0, 1, 2, 3, 4].map(i => cue(i));
    const L = i => Math.max(1, end(i) - cue(i));
    const at = sayAt(ctx);

    // ---- beat 0: the Monday / Thursday calendars from ch07s05 return, then shrink up to make room for the title
    const CAL = { w: 480, h: 560, y: 300, xs: [400, 1040] }, CS = 0.6, CY2 = 196;
    const fx = [960 - CAL.w * CS - 20, 960 + 20];
    const cals = ['Monday', 'Thursday'].map((day, i) => {
      const card = box(stage, 'c8-cal', null, CAL.xs[i], CAL.y, CAL.w, CAL.h);
      const top = K.el('div', 'top', day);
      card.appendChild(top);
      [150, 310].forEach(x => { const r = K.el('div', 'ring'); r.style.left = x + 'px'; top.appendChild(r); });
      const body = K.el('div', 'cbody');
      card.appendChild(body);
      const ic = K.el('div', 'ico');
      ic.appendChild(ico('footprints', null, { stroke: 2 }));
      body.appendChild(ic);
      body.appendChild(K.el('div', 'nm', 'Jogger'));
      const st = box(card, 'c8-stat ' + (i ? 'bad' : 'ok'), null, CAL.w / 2 - 62, CAL.h - 164);
      st.appendChild(ico(i ? 'triangle-alert' : 'check', null, { stroke: 2.6 }));
      return { card, st };
    });

    const tc = K.heading(stage, 'Stress and recovery over time', { x: 100, y: 590, w: 1720, size: 84, align: 'center', barGap: 28 });
    tc.title.style.whiteSpace = 'nowrap';
    const ideas = box(stage, 'c8-ideas', null, 100, 762, 1720);
    const mkIdea = (icon, bg, fg, s) => {
      const c = K.el('div', 'c8-idea');
      const n = K.el('span', 'ic');
      Object.assign(n.style, { background: bg, color: fg });
      n.appendChild(ico(icon, null, { stroke: icon === 'thrline' ? 2.8 : 2.2 }));
      c.appendChild(n);
      c.appendChild(K.el('span', null, s));
      ideas.appendChild(c);
      return c;
    };
    const idea = [
      mkIdea('thrline', C.redPale, C.red, 'Threshold'),
      mkIdea('cup', C.amberPale, C.amberText, 'Stress stacks up'),
      mkIdea('clock', C.pale, C.greenDark, 'Slow recovery'),
    ];

    A.in(tl, cals[0].card, T[0] + 0.05, 'fadeRight', { dur: 0.8 });
    A.in(tl, cals[1].card, T[0] + 0.25, 'fadeLeft', { dur: 0.8 });
    // Monday's check lands on "fine", Thursday's alert on "a disaster"
    A.in(tl, cals[0].st, Math.max(T[0] + 0.75, at(0, 'fine', 0.2)), 'pop', { dur: 0.5 });
    const tBad = Math.max(T[0] + 1.0, at(0, 'a disaster', 0.2));
    A.in(tl, cals[1].st, tBad, 'pop', { dur: 0.5 });
    tl.fromTo(cals[1].card, { rotation: 0 }, { rotation: 1.2, duration: 0.06, yoyo: true, repeat: 5, ease: 'none' }, tBad + 0.15);
    const tMove = Math.max(T[0] + 1.9, tBad + 0.8, at(0, 'three ideas', 0.5));
    cals.forEach((c, i) => tl.to(c.card, { x: fx[i] - CAL.xs[i], y: CY2 - CAL.y, scale: CS, transformOrigin: '0% 0%', duration: 0.9, ease: 'power3.inOut' }, tMove));
    wipeIn(tl, tc.title, tMove + 0.35, 1.0);
    tl.fromTo(tc.bar, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'power2.inOut' }, tMove + 1.0);
    const tI = [Math.max(tMove + 1.2, at(0, 'threshold,')), at(0, 'stress stacking'), at(0, 'how slowly')];
    idea.forEach((c, i) => A.in(tl, c, Math.max(tI[i], tMove + 1.2 + i * 0.5), 'fadeUp', { dur: 0.7 }));
    tl.to([cals[0].card, cals[1].card, tc.root, ideas], { opacity: 0, y: '-=30', duration: 0.45, ease: 'power2.in' }, T[1] - 0.4);

    // ---- the threshold diagram
    const H = headline(stage, ['Under the line: thinking', 'Over the line: feelings take over', 'Not stubborn. Unavailable.', 'Training happens under the line']);
    const PT = 280, LY = 610, PB = 940;
    const zR = box(stage, 'c8-zone red', null, 100, PT, 1720, LY - PT);
    const zG = box(stage, 'c8-zone green', null, 100, LY, 1720, PB - LY);
    const ring = box(stage, 'c8-ring', null, 100, LY, 1720, PB - LY);
    const svg = K.svg(stage, {});
    const line = thrLine(svg, 104, 1816, LY);

    // under the line: thinking brain
    const brain = badge(stage, 'brain', 240, 775, 140, C.green, '#fff', 2);
    const gLab = box(stage, 'c8-lab', 'Thinking brain', 352, 700, null, null, { color: C.greenDark });
    const gTags = box(stage, 'c8-tags', null, 352, 790);
    const gt = ['Hears you', 'Takes treats', 'Makes choices'].map(s => gTags.appendChild(tag(s, 'green')));

    // over the line: big feelings take the wheel
    const zap = badge(stage, 'zap', 240, 445, 140, C.red, '#fff', 2);
    const rLab = box(stage, 'c8-lab', 'Feelings in charge', 352, 370, null, null, { color: C.red });
    const rTags = box(stage, 'c8-tags', null, 352, 460);
    const rt = ['Fight', 'Flight', 'Freeze', 'Road rage'].map(s => rTags.appendChild(tag(s, 'red')));

    // long division while a bear chases you
    const CW = 560, CXL = 1170, CYT = 350, CH = 170;
    const calc = box(stage, 'c8-card c8-calc', null, CXL, CYT, CW, CH);
    calc.appendChild(ico('calculator', 92, { stroke: 1.8 }));
    calc.appendChild(K.el('div', 't', '952 ÷ 17 = ?'));
    const alert = badge(stage, 'triangle-alert', CXL + CW - 8, CYT + 4, 100, C.redPale, C.red, 2.2);

    // train here
    const AX = 1450;
    const arrG = K.group(svg);
    const shaft = K.line(arrG, AX, 548, AX, 782, { stroke: C.green, 'stroke-width': 16 });
    const head = K.path(arrG, `M${AX - 30} 758 L${AX} 790 L${AX + 30} 758`, { stroke: C.green, 'stroke-width': 16 });
    const train = centred(stage, K.el('div', 'c8-pill', 'Train here'), AX, 808, 500);

    const pill = thrTag(stage, 960, LY);

    // beat 1: the line draws on "threshold", its two sides tint on "coping and not coping" (the side above stays
    // faint until beat 2), and the thinking brain lands on "Under it"
    wipeIn(tl, H.titles[0], T[1] + 0.15);
    barIn(tl, H.bar, T[1] + 0.3);
    const tLine = Math.max(T[1] + 0.05, at(1, 'threshold'));
    drawThr(tl, line, tLine, 0.9);
    A.in(tl, pill, tLine + 0.5, 'pop', { dur: 0.6 });
    const tCope = Math.max(tLine + 1.0, at(1, 'coping'));
    A.in(tl, zG, tCope, 'fade', { dur: 0.7 });
    const tNot = Math.max(tCope + 0.5, at(1, 'not coping'));
    tl.fromTo(zR, { opacity: 0 }, { opacity: 0.4, duration: 0.7, ease: 'power2.out' }, tNot);
    const tUnder = Math.max(tNot + 0.8, at(1, 'under it'));
    A.in(tl, brain, tUnder, 'pop', { dur: 0.6 });
    A.in(tl, gLab, tUnder + 0.15, 'fadeRight', { dur: 0.7 });
    A.in(tl, gt, Math.max(tUnder + 1.0, at(1, 'hear you')), 'fadeUp', { stagger: 0.35, dur: 0.6 });

    // beat 2: the red zone fills in; the thinking brain dims on "goes offline", feelings take the wheel
    const gGroup = [brain, gLab, gTags];
    swapTitle(tl, H, 0, 1, T[2]);
    tl.to(zR, { opacity: 1, duration: 0.7, ease: 'power2.out' }, T[2] + 0.05);
    const tOff = Math.max(T[2] + 0.6, at(2, 'goes offline'));
    A.dim(tl, gGroup, tOff, 0.35, { dur: 0.7 });
    const tFeel = Math.max(tOff + 0.5, at(2, 'big feelings'));
    A.in(tl, zap, tFeel, 'pop', { dur: 0.6 });
    A.in(tl, rLab, tFeel + 0.15, 'fadeRight', { dur: 0.7 });
    A.in(tl, rt.slice(0, 3), Math.max(tFeel + 1.0, at(2, 'fight')), 'fadeUp', { stagger: 0.25, dur: 0.55 });
    A.in(tl, rt[3], Math.max(tFeel + 2.0, at(2, 'road rage')), 'fadeUp', { dur: 0.55 });

    // beat 3: long division pops up; on "You're not being stubborn" it greys out, the alarm flashes and the title changes
    A.in(tl, calc, T[3] + 0.1, 'pop', { dur: 0.6 });
    const tg = Math.max(T[3] + 1.4, at(3, "you're not"));
    swapTitle(tl, H, 1, 2, tg);
    tl.to(calc, { filter: 'grayscale(1)', opacity: 0.42, duration: 0.7, ease: 'power2.out' }, tg);
    A.in(tl, alert, tg - 0.1, 'pop', { dur: 0.5 });
    tl.to(alert, { opacity: 0.3, duration: 0.18, yoyo: true, repeat: 5, ease: 'sine.inOut' }, tg + 0.5);

    // beat 4: on "Training happens under the line" the thinking brain comes back and the arrow points into the green
    const tTrain = Math.max(T[4] + 0.1, at(4, 'training happens', 0.5));
    swapTitle(tl, H, 2, 3, tTrain);
    A.undim(tl, gGroup, tTrain - 0.1, { dur: 0.6 });
    A.draw(tl, shaft, tTrain + 0.1, 0.6);
    A.draw(tl, head, tTrain + 0.6, 0.3);
    A.in(tl, train, tTrain + 0.75, 'pop', { dur: 0.6 });
    A.in(tl, ring, tTrain + 0.5, 'fade', { dur: 0.8 });
  });

  // =================================================================== ch08s02  Getting close to threshold
  registerScene('ch08s02', ctx => {
    const { stage, tl, cue, end } = ctx;
    style(stage);
    const T = [0, 1, 2, 3, 4].map(i => cue(i));
    const at = sayAt(ctx);

    const h = K.heading(stage, 'Signs they’re getting close', { x: 100, y: 120, size: 80 });
    h.title.style.whiteSpace = 'nowrap';
    wipeIn(tl, h.title, T[0]);
    barIn(tl, h.bar, T[0] + 0.5);

    // ---- the threshold zones from s01, stood on end as a bar, with a dog marker that climbs
    const card = box(stage, 'c8-card', null, 100, 280, 660, 460);
    const BX = 180, BW = 124, BT = 318, BB = 702, LY = 420, MX = BX + BW / 2;
    const zR = box(stage, 'c8-zone bar red', null, BX, BT, BW, LY - BT);
    const zG = box(stage, 'c8-zone bar green', null, BX, LY, BW, BB - LY);
    const svg = K.svg(stage, {});
    const line = thrLine(svg, 140, 722, LY);
    const pill = thrTag(stage, 560, LY);
    const LV = [652, 590, 526, 470];                       // marker centre per step (last one sits just under the line)
    const MC = [C.green, '#b3a22c', C.amber, '#c4512d'];   // marker ring warms up as it climbs
    const MT = [C.greenDark, '#8a7c12', C.amberText, C.red];
    const mark = box(stage, 'c8-mark', null, MX - 42, LV[0] - 42);
    mark.appendChild(ico('dog', null, { stroke: 2.2 }));
    const step = (k, t, dur = 0.9, ease = 'power2.inOut') =>
      tl.to(mark, { y: LV[k] - LV[0], borderColor: MC[k], color: MT[k], duration: dur, ease }, t);

    A.in(tl, card, T[0] + 0.1, 'fadeUp', { dur: 0.7 });
    tl.fromTo([zR, zG], { opacity: 0 }, { opacity: 1, duration: 0.6, stagger: 0.12 }, T[0] + 0.4);
    drawThr(tl, line, T[0] + 0.8, 0.8);
    A.in(tl, pill, T[0] + 1.1, 'pop', { dur: 0.6 });
    A.in(tl, mark, T[0] + 1.3, 'pop', { dur: 0.6 });

    // ---- warning signs, in three groups that match the marker colours
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

    // beat 0: two signs, the marker climbs a step
    sign(0, Math.max(T[0] + 1.6, at(0, 'they stop taking')));
    const s1 = Math.max(T[0] + 2.6, at(0, 'they stop hearing'));
    sign(1, s1);
    step(1, s1 + 0.6);
    // beat 1: three more
    sign(2, T[1] + 0.05);
    sign(3, Math.max(T[1] + 1.0, at(1, 'the body goes')));
    const s4 = Math.max(T[1] + 2.0, at(1, 'their weight'));
    sign(4, s4);
    step(2, s4 + 0.6);
    // beat 2: two more, the marker sits just under the line
    sign(5, T[2] + 0.05);
    const s6 = Math.max(T[2] + 1.0, at(2, 'or their'));
    sign(6, s6);
    step(3, s6 + 0.5, 1.0);
    tl.to(mark, { scale: 1.14, duration: 0.25, yoyo: true, repeat: 3, ease: 'power2.out' }, s6 + 1.6);

    // beat 3: your cue: add distance, and the marker drops back into the green
    const flag = box(stage, 'c8-flag', null, 330, 468);
    flag.appendChild(ico('flag', 32, { stroke: 2.4 }));
    flag.appendChild(K.el('span', null, 'Your cue to<br>add distance'));
    const undo = badge(stage, 'undo-2', 420, 640, 88, C.pale, C.greenDark, 2.4);
    A.in(tl, flag, T[3] + 0.1, 'fadeRight', { dur: 0.7 });
    const tDrop = Math.max(T[3] + 1.4, at(3, 'add distance'));
    A.in(tl, undo, tDrop, 'pop', { dur: 0.55 });
    tl.to(mark, { y: 0, borderColor: MC[0], color: MT[0], duration: 1.4, ease: 'power3.inOut' }, tDrop + 0.3);

    // beat 4: note the distance (a Try this task)
    const rule = box(stage, 'c8-card c8-rule', null, 100, 810, 660, 120);
    const rb = K.el('div', 'b');
    rb.appendChild(ico('ruler', null, { stroke: 2.2 }));
    rule.appendChild(rb);
    rule.appendChild(K.el('div', 't', 'Note your dog’s distance'));
    const tryB = tryBadge(stage, 78, 766);
    A.in(tl, rule, T[4] + 0.05, 'fadeRight', { dur: 0.8 });
    tryIn(tl, tryB, T[4] + 0.55);
  });

  // =================================================================== ch08s03  Stress stacks up
  registerScene('ch08s03', ctx => {
    const { stage, tl, cue, end } = ctx;
    style(stage);
    const T = [0, 1, 2, 3, 4, 5, 6].map(i => cue(i));
    const L = i => Math.max(1, end(i) - cue(i));
    const at = sayAt(ctx);
    const H = headline(stage, ['Stress stacks up', 'One day of stress', 'Small things add up', 'Over time, or all at once']);
    wipeIn(tl, H.titles[0], T[0]);
    barIn(tl, H.bar, T[0] + 0.5);

    // ---- the cup: threshold well below the rim, a grey base layer already in the bottom
    const CX = 960, TOP = 300, HGT = 600, BOT = TOP + HGT, THR = 470, TOPLV = 420;
    const LAY = [
      { y0: 850, y1: 900, color: BASE },
      { y0: 750, y1: 850, color: TRIG.doorbell, icon: 'bell', text: 'Doorbell', cy: 800 },
      { y0: 650, y1: 750, color: TRIG.truck, icon: 'truck', text: 'Garbage truck', cy: 700 },
      { y0: 545, y1: 650, color: TRIG.skate, icon: 'skateboard', text: 'Skateboard', cy: 597 },
      { y0: 380, y1: 545, color: TRIG.jogger, icon: 'footprints', text: 'Jogger', cy: 508 },
    ];
    const cup = makeCup(stage, { cx: CX, top: TOP, h: HGT, wTop: 520, wBot: 400, thr: THR, level: 850, bands: LAY });
    const W = cup.wrap;
    const flush = K.rect(cup.liquid, cup.xl - 30, TOP - 60, 580, HGT + 80, { fill: TRIG.jogger, opacity: 0 });
    const flush2 = K.rect(cup.liquid, cup.xl - 30, TOP - 60, 580, HGT + 80, { fill: TRIG.jogger, opacity: 0 });
    const glow = K.rect(cup.extra, cup.xl - 30, 850, 580, 52, { fill: '#ffffff', opacity: 0 });
    const cupTag = thrTag(W, cup.xr + 120, THR);
    const chips = LAY.slice(1).map(b => centred(W, chip(b.icon, b.text, b.color), CX, b.cy - 25, 600));

    // beat 0: cup (on "Think of a cup"), base layer and threshold
    const tCup = Math.min(T[1] - 1.8, Math.max(T[0] + 0.2, at(0, 'think of a cup')));
    tl.fromTo([cup.glass, cup.inner], { opacity: 0 }, { opacity: 1, duration: 0.6 }, tCup);
    A.draw(tl, cup.outline, tCup, 1.2);
    tl.fromTo(cup.shine, { opacity: 0 }, { opacity: 0.4, duration: 0.6 }, tCup + 0.9);
    drawThr(tl, cup.thr, tCup + 0.8, 0.8);
    A.in(tl, cupTag, tCup + 1.1, 'pop', { dur: 0.6 });

    // beat 1: three pours
    const P = [T[1] + 0.15];
    P.push(Math.max(P[0] + 1.5, at(1, 'the garbage truck')));
    P.push(Math.max(P[1] + 1.5, at(1, 'a skateboard')));
    [1, 2, 3].forEach((k, i) => {
      pour(tl, cup, LAY[k].color, LAY[k].y0, P[i]);
      A.in(tl, chips[k - 1], P[i] + 0.85, 'pop', { dur: 0.5 });
    });

    // beat 2: the jogger tips it over the line; the liquid flushes red with a small splash
    const DY = 222;
    const drop = K.group(cup.svg);
    K.path(drop, `M${CX} ${DY - 40} C${CX + 9} ${DY - 24} ${CX + 17} ${DY - 13} ${CX + 17} ${DY - 2} A17 17 0 0 1 ${CX - 17} ${DY - 2} C${CX - 17} ${DY - 13} ${CX - 9} ${DY - 24} ${CX} ${DY - 40} Z`, { fill: TRIG.jogger, stroke: 'none' });
    svgPop(tl, drop, T[2] + 0.1, CX, DY);
    tl.fromTo(chips[3], { opacity: 0, x: 170, y: DY - LAY[4].cy, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.55, ease: 'back.out(2)' }, T[2] + 0.25);
    const tD = Math.max(T[2] + 2.4, at(2, 'so it tips', 0.6));
    // while the story waits for "so it tips over", the drop hovers gently instead of hanging frozen in mid-air
    const bob0 = T[2] + 0.8, bobH = 0.7, bobN = Math.floor((tD - 0.05 - bob0) / bobH);
    if (bobN >= 2) {
      tl.fromTo(drop, { y: 0 }, { y: -9, duration: bobH, ease: 'sine.inOut', yoyo: true, repeat: (bobN % 2 ? bobN - 2 : bobN - 1), immediateRender: false }, bob0);
    }
    tl.to(drop, { y: LAY[3].y0 - DY - 16, duration: 0.45, ease: 'power2.in' }, tD);
    tl.to(drop, { opacity: 0, duration: 0.12 }, tD + 0.4);
    cup.setLevel(tl, TOPLV, tD + 0.38, 0.5, 'power2.out');
    tl.to(chips[3], { x: 0, y: 0, duration: 0.6, ease: 'power2.inOut' }, tD + 0.45);
    tl.to(flush, { opacity: 0.92, duration: 0.5, ease: 'power2.out' }, tD + 0.75);
    const SPL = [[-74, -44, 9], [-30, -68, 7], [26, -62, 8], [72, -40, 7]];
    SPL.forEach(([dx, dy, r], i) => {
      const c = K.circle(cup.svg, CX + dx * 0.4, TOPLV + 4, r, { fill: TRIG.jogger, opacity: 0 });
      const ts = tD + 0.8 + i * 0.03;
      tl.fromTo(c, { opacity: 0, x: 0, y: 0 }, { opacity: 1, x: dx * 0.6, y: dy, duration: 0.32, ease: 'power2.out' }, ts);
      tl.to(c, { opacity: 0, x: dx, y: dy + 34, duration: 0.34, ease: 'power2.in' }, ts + 0.32);
    });
    const note = box(W, 'c8-note', 'One drop too many', 1250, 354);
    A.in(tl, note, tD + 0.9, 'fadeLeft', { dur: 0.7 });

    // beat 3: it was the whole cup, including what you can't see: trigger stacking
    tl.to(note, { opacity: 0, duration: 0.4 }, T[3] + 0.1);
    tl.to(flush, { opacity: 0, duration: 0.8, ease: 'power2.inOut' }, T[3] + 0.2);
    const tB = Math.max(T[3] + 1.4, at(3, 'poor sleep', 0.8));
    const LYB = 875, wx = cup.wallR(LYB) + 16;
    const leader = K.line(cup.svg, wx, LYB, 1236, LYB, { stroke: '#9a9e94', 'stroke-width': 4, 'stroke-dasharray': '2 9', 'stroke-linecap': 'round' });
    const baseChip = box(W, 'c8-chip', null, 1250, LYB - 25);
    baseChip.appendChild(ico('eye-off', 32, { stroke: 2.4, color: C.muted }));
    baseChip.appendChild(K.el('span', null, 'Poor sleep, sore hip'));
    tl.to(glow, { opacity: 0.6, duration: 0.35, ease: 'sine.out' }, tB);
    tl.to(glow, { opacity: 0.15, duration: 0.35, ease: 'sine.inOut' }, tB + 0.35);
    tl.to(glow, { opacity: 0.6, duration: 0.35, ease: 'sine.inOut' }, tB + 0.7);
    tl.to(glow, { opacity: 0.3, duration: 0.5, ease: 'sine.inOut' }, tB + 1.05);
    A.draw(tl, leader, tB + 0.2, 0.5);
    A.in(tl, baseChip, tB + 0.45, 'fadeLeft', { dur: 0.6 });
    const bx = 650, bm = (TOPLV + BOT) / 2;
    const brace = K.path(cup.svg, `M${bx + 26} ${TOPLV} Q${bx} ${TOPLV} ${bx} ${TOPLV + 30} L${bx} ${bm - 27} Q${bx} ${bm} ${bx - 26} ${bm} Q${bx} ${bm} ${bx} ${bm + 27} L${bx} ${BOT - 30} Q${bx} ${BOT} ${bx + 26} ${BOT}`, { stroke: C.greenDark, 'stroke-width': 7 });
    const stack = box(W, 'c8-big', 'Trigger<br>stacking', 360, bm - 58, 240, null, { textAlign: 'right' });
    const tS = Math.max(tB + 1.6, at(3, "that's trigger"));
    A.draw(tl, brace, tS, 0.9);
    A.in(tl, stack, tS + 0.4, 'fadeRight', { dur: 0.7 });
    A.pulse(tl, chips, tS + 1.1, { scale: 1.08 });

    // ---- beat 4: the cup slides left and shrinks into a gauge; one day of stress draws beside it
    const TH = 0.78;
    const DAY = [[0.2, 0.28, 'bell', '#6f8f2a'], [0.4, 0.30, 'truck', '#8f7d16'], [0.6, 0.30, 'skateboard', C.amberText], [0.8, 0.32, 'footprints', C.red]];
    const fDay = t => 0.1 + DAY.reduce((s, [t0, a]) => s + spike(t, t0, a, 0.5, 0.05), 0);
    const fCalm = t => 0.1 + spike(t, 0.8, 0.32, 0.5, 0.05);
    const ch = chart(stage, { x0: 380, W: 1400, yb: 820, yt: 330 });
    const { X, Y, svg, dataG } = ch;
    const KS = 0.4, CXM = 222, thrY = Y(TH);
    const lvY = v => BOT - Math.min(v / TH, 1.25) * (BOT - THR);   // chart value -> cup level, threshold to threshold
    const gauge = v => {
      cup.levelNow(lvY(v));
      flush2.style.opacity = String(Math.max(0, Math.min(1, (v - TH) / 0.03)) * 0.92);
    };

    const t4 = T[4] - 0.25;
    tl.to([...chips, cupTag, baseChip, leader, brace, stack], { opacity: 0, duration: 0.4, ease: 'power2.in' }, t4);
    tl.to(glow, { opacity: 0, duration: 0.4 }, t4);
    tl.to(W, { x: CXM - CX, y: thrY - THR, scale: KS, transformOrigin: `${CX}px ${THR}px`, duration: 1.0, ease: 'power3.inOut' }, t4 + 0.1);
    // keep the mini cup's line the same stroke and dash as every other threshold line once it is scaled down
    tl.to(cup.thr, { attr: { 'stroke-width': 5 / KS, 'stroke-dasharray': `${12 / KS} ${16 / KS}` }, duration: 1.0, ease: 'power3.inOut' }, t4 + 0.1);
    tl.to(cup.thr._halo, { attr: { 'stroke-width': 10 / KS }, duration: 1.0, ease: 'power3.inOut' }, t4 + 0.1);
    cup.setLevel(tl, lvY(fDay(0)), t4 + 0.15, 0.9);
    swapTitle(tl, H, 0, 1, T[4]);

    const over = clipAbove(ch, 'c8over3', thrY);
    const area = K.path(dataG, overArea(fDay, 0.78, 1, TH, X, Y), { fill: C.red, opacity: 0, stroke: 'none' });
    const cupEdge = CXM + (cup.xr + 40 - CX) * KS;          // right end of the mini cup's own threshold line
    const thr = thrLine(svg, cupEdge, ch.x0 + ch.W, thrY);
    const thrPill = thrTag(ch.wrap, ch.x0 + 140, thrY);
    const labStyle = { 'font-size': 28, 'font-weight': 700, fill: C.inkSoft };
    const morning = K.svgText(svg, ch.x0, ch.yb + 58, 'Morning', labStyle);
    const evening = K.svgText(svg, ch.x0 + ch.W, ch.yb + 58, 'Evening', Object.assign({ 'text-anchor': 'end' }, labStyle));
    const evIcons = DAY.map(([t0, , n, col]) => Object.assign(evIcon(svg, n, X(t0), ch.yb + 48, col), { t: t0 }));

    drawAxes(tl, ch, T[4] + 0.3);
    tl.fromTo([morning, evening], { opacity: 0 }, { opacity: 1, duration: 0.5 }, T[4] + 0.7);
    const D1 = 3.2, S1 = T[4] + 0.9, CUT = 0.76;
    liveLine(tl, dataG, fDay, X, Y, 0, CUT, S1, D1, {}, over, gauge);
    evIcons.slice(0, 3).forEach(e => svgPop(tl, e.inner, S1 + (e.t / CUT) * D1 - 0.1, e.x, e.y, 0.5));

    // beat 5: the cup's threshold runs on across the chart, the jogger tips it over, and a calm day for comparison
    swapTitle(tl, H, 1, 2, T[5]);
    drawThr(tl, thr, T[5] + 0.1, 0.9);
    A.in(tl, thrPill, T[5] + 0.6, 'pop', { dur: 0.6 });
    // the last stretch draws so the jogger's spike crosses the line on "until the jogger tips it over"
    const D2 = 1.2, S2 = Math.min(T[5] + 2.6, Math.max(T[5] + 1.1, at(5, 'the jogger tips', 0.1) - ((0.8 - CUT) / (1 - CUT)) * D2));
    liveLine(tl, dataG, fDay, X, Y, CUT, 1, S2, D2, {}, over, gauge);
    svgPop(tl, evIcons[3].inner, S2 + ((0.8 - CUT) / (1 - CUT)) * D2 - 0.1, evIcons[3].x, evIcons[3].y, 0.5);
    tl.to(area, { opacity: 0.22, duration: 0.6 }, S2 + D2);
    const tG = Math.max(S2 + D2 + 0.4, at(5, 'from outside'));
    const ghost = liveLine(tl, dataG, fCalm, X, Y, 0.72, 1, tG, 1.2, { stroke: '#a3a79e', 'stroke-width': 6, opacity: 0.8 });
    dataG.insertBefore(ghost[0], dataG.firstChild);
    const calmX = X(0.845);
    const calm = K.svgText(svg, calmX, 738, 'Calm day', { 'font-size': 28, 'font-weight': 700, fill: '#8d9188' });
    tl.fromTo(calm, { opacity: 0 }, { opacity: 1, duration: 0.5 }, tG + 0.9);

    // beat 6: make room, then the "all at once" inset
    const NW = 880, k = NW / ch.W;
    swapTitle(tl, H, 2, 3, T[6]);
    const t6 = T[6] - 0.1;
    tl.to(dataG, { scaleX: k, svgOrigin: `${ch.x0} 0`, duration: 0.9, ease: 'power3.inOut' }, t6);
    tl.to(thr, { attr: { x2: ch.x0 + NW }, duration: 0.9, ease: 'power3.inOut' }, t6);
    tl.to(evening, { x: -(ch.W - NW), duration: 0.9, ease: 'power3.inOut' }, t6);
    tl.to(calm, { x: -(calmX - ch.x0) * (1 - k), duration: 0.9, ease: 'power3.inOut' }, t6);
    evIcons.forEach(e => tl.to(e.g, { x: -(e.x - ch.x0) * (1 - k), duration: 0.9, ease: 'power3.inOut' }, t6));

    const IX = 1310, IY = 300, IW = 500, IH = 520;
    const inset = box(stage, 'c8-inset', null, IX, IY, IW, IH);
    inset.appendChild(K.el('div', 'ttl', 'All at once'));
    const isvg = K.svg(inset, { x: 0, y: 0, w: IW, h: IH });
    const idefs = K.svgEl('defs', {}, isvg);
    const ix0 = 50, iW = 410, iyb = 460, iyt = 200, ITH = 0.58;
    const iX = t => ix0 + t * iW, iY = v => iyb - v * (iyb - iyt);
    const icp = K.svgEl('clipPath', { id: 'c8over3i' }, idefs);
    K.svgEl('rect', { x: 0, y: 0, width: IW, height: iY(ITH) }, icp);
    // the three triggers pop in as they are named: "a dog, a skateboard and a shouting kid"
    const ISAY = ['a dog', 'a skateboard', 'a shouting kid'];
    let tIc = T[6] + 1.0;
    ['dog', 'skateboard', 'megaphone'].forEach((n, i) => {
      const cx = 66 + i * 80;
      const g = K.group(isvg);
      K.circle(g, cx, 128, 31, { fill: C.redPale, stroke: 'none' });
      svgIcon(g, n, cx, 128, 36, { stroke: C.red });
      tIc = Math.max(tIc + 0.35, at(6, ISAY[i], 0.2));
      svgPop(tl, g, tIc, cx, 128, 0.5);
    });
    K.line(isvg, ix0, iyb, ix0 + iW, iyb, { stroke: C.axis, 'stroke-width': 4 });
    K.line(isvg, ix0, iyb, ix0, iyt - 10, { stroke: C.axis, 'stroke-width': 4 });
    thrLine(isvg, ix0, ix0 + iW, iY(ITH));
    const fBurst = t => 0.1 + [0.32, 0.38, 0.44].reduce((s, t0) => s + spike(t, t0, 0.24, 0.4, 0.15, 0.02), 0);
    tl.fromTo(inset, { opacity: 0, scale: 0.85, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.6)' }, T[6] + 0.45);
    liveLine(tl, isvg, fBurst, iX, iY, 0, 1, T[6] + 1.1, 1.3, { 'stroke-width': 6 }, 'c8over3i');
  });

  // =================================================================== ch08s04  Up fast, down slow
  registerScene('ch08s04', ctx => {
    const { stage, tl, cue, end } = ctx;
    style(stage);
    const T = [0, 1, 2, 3].map(i => cue(i));
    const L = i => Math.max(1, end(i) - cue(i));
    const at = sayAt(ctx);
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
    // the line runs so the spike climbs on "stress goes up fast" and the tail draws through "comes down slowly"
    const D0 = 3.2, S0 = Math.min(T[1] - D0 + 0.2, Math.max(T[0] + 0.7, at(0, 'goes up', 0.1) - 0.18 * D0));
    liveLine(tl, dataG, f1, X, Y, 0, 1, S0, D0, { stroke: C.greenDark });

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

    // the card and its alarm arrive with the "boo"; heart and clock follow on "But your heart kept pounding"
    const tBoo = Math.max(T[1] + 0.3, at(1, 'boo', 0.25));
    A.in(tl, card, tBoo - 0.25, 'fadeUp', { dur: 0.6 });
    const tH = Math.max(T[1] + 2.0, tBoo + 1.4, at(1, 'but your heart'));
    tl.fromTo(card, { width: 200 }, { width: 640, duration: 0.7, ease: 'power3.inOut' }, tH - 0.6);
    svgPop(tl, alertG, tBoo, 1152, CY);
    tl.to(alertG, { opacity: 0.35, duration: 0.16, yoyo: true, repeat: 5, ease: 'sine.inOut' }, tBoo + 0.6);
    tl.fromTo(chev, { opacity: 0 }, { opacity: 1, duration: 0.4 }, tH - 0.2);
    svgPop(tl, heartG, tH, 1392, CY);
    svgPop(tl, clockG, tH + 0.2, 1592, CY);
    const tStop = T[3] - 0.2;
    const nBeats = Math.max(1, Math.floor((tStop - (tH + 0.7)) / 0.8));
    tl.to(heartG, { scale: 1.12, svgOrigin: `1392 ${CY}`, duration: 0.2, ease: 'power2.out', yoyo: true, repeat: nBeats * 2 - 1, repeatDelay: 0.2 }, tH + 0.7);
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
    // the rise lights up on "adrenaline hits in seconds", not on "same for your dog"
    const tA = Math.min(T[2] + 2.5, Math.max(T[2] + 0.1, at(2, 'adrenaline')));
    A.draw(tl, hiRise, tA, 0.5);
    A.in(tl, fast, tA + 0.2, 'pop', { dur: 0.6 });
    const tS = Math.max(T[2] + 1.6, at(2, 'but cortisol'));
    A.draw(tl, hiTail, tS, 1.6, { ease: 'power1.inOut' });
    A.in(tl, slow, Math.max(tS + 0.5, at(2, 'a big scare')), 'fadeLeft', { dur: 0.7 });

    // ---- beat 3: Wednesday's vet visit is still in the cup on Thursday
    const oneDay = [ch.wrap, card, csvg, fastRow, slow];
    tl.to(oneDay, { opacity: 0, duration: 0.45, ease: 'power2.in' }, T[3] - 0.25);
    swapTitle(tl, H, 0, 1, T[3]);

    const TH = 0.72, MID = 0.5, TJ = 0.66;
    const f2 = t => 0.12 + spike(t, 0.1, 0.56, 0.3, 0.2, 0.03) + spike(t, TJ, 0.5, 0.35, 0.07, 0.025);
    const c2 = chart(stage, { x0: 230, W: 1480, yb: 810, yt: 320 });
    const over = clipAbove(c2, 'c8over4', c2.Y(TH));
    const base = K.line(c2.dataG, c2.x0, c2.Y(0.12), c2.x0 + c2.W, c2.Y(0.12), { stroke: '#b3b8ac', 'stroke-width': 3, 'stroke-dasharray': '2 10', 'stroke-linecap': 'round' });
    const div = K.line(c2.svg, c2.X(MID), c2.yt + 40, c2.X(MID), c2.yb, { stroke: '#b3b8ac', 'stroke-width': 3, 'stroke-dasharray': '2 10', 'stroke-linecap': 'round' });
    const moon = K.group(c2.svg);
    K.circle(moon, c2.X(MID), c2.yt + 6, 30, { fill: '#fff', stroke: '#e0e4da', 'stroke-width': 2 });
    svgIcon(moon, 'moon', c2.X(MID), c2.yt + 6, 32, { stroke: C.inkSoft });
    const thr = thrLine(c2.dataG, c2.x0, c2.x0 + c2.W, c2.Y(TH));
    const thrPill = thrTag(c2.wrap, c2.x0 + c2.W - 110, c2.Y(TH));
    const area = K.path(c2.dataG, overArea(f2, MID, 1, TH, c2.X, c2.Y), { fill: C.red, opacity: 0, stroke: 'none' });
    const vetChip = centred(c2.wrap, chip('stethoscope', 'Wednesday: vet', C.amberText), c2.X(0.1) + 30, c2.yb + 26, 500);
    const jogChip = centred(c2.wrap, chip('footprints', 'Thursday: jogger', C.red), c2.X(TJ) + 30, c2.yb + 26, 500);

    // step 1 (first sentence): Wednesday's spike leaves a tail that stays raised overnight
    const t3 = T[3];
    drawAxes(tl, c2, t3 + 0.15);
    tl.fromTo([div, moon, base], { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.06 }, t3 + 0.35);
    drawThr(tl, thr, t3 + 0.3, 0.8);
    A.in(tl, thrPill, t3 + 0.7, 'pop', { dur: 0.5 });
    const LS = t3 + 0.55, LD = 2.4;
    liveLine(tl, c2.dataG, f2, c2.X, c2.Y, 0, MID, LS, LD, {}, over);
    // the spike reads as "yesterday's scare" first; its label lands on "if Wednesday was a vet visit"
    A.in(tl, vetChip, Math.max(LS + (0.1 / MID) * LD - 0.2, at(3, 'if wednesday')), 'fadeUp', { dur: 0.6 });

    // a little cup rides the line: half full at the end of Wednesday, carried into Thursday morning
    const rider = K.group(c2.svg);
    const rIn = K.group(rider);
    K.circle(rIn, 0, 0, 36, { fill: '#fff', stroke: '#dfe3d8', 'stroke-width': 3 });
    const mc = 'M-15 -17 L-11 14 Q-10.5 17 -7 17 L7 17 Q10.5 17 11 14 L15 -17';
    const mcp = K.svgEl('clipPath', { id: 'c8mini' }, c2.defs);
    K.svgEl('path', { d: mc + 'Z' }, mcp);
    K.rect(rIn, -18, 0, 36, 22, { fill: C.amber, 'clip-path': 'url(#c8mini)' });
    K.path(rIn, mc, { stroke: C.cup, 'stroke-width': 3.5, fill: 'none' });
    const R0 = 0.46, R1 = 0.63;
    const st = { t: R0 };
    const place = () => rider.setAttribute('transform', `translate(${c2.X(st.t).toFixed(1)} ${(c2.Y(f2(st.t)) - 44).toFixed(1)})`);
    place();
    tl.fromTo(rIn, { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, transformOrigin: '50% 50%', duration: 0.45, ease: 'back.out(2)' }, LS + LD + 0.1);

    // step 2 (second sentence): Thursday starts half full and the jogger tips it over
    const tB = Math.max(LS + LD + 0.8, at(3, 'thursday starts', 0.5));
    const LD2 = 2.2;
    liveLine(tl, c2.dataG, f2, c2.X, c2.Y, MID, 1, tB, LD2, {}, over);
    tl.fromTo(st, { t: R0 }, { t: R1, duration: 1.0, ease: 'power1.inOut', onUpdate: place }, tB + 0.15);
    A.in(tl, jogChip, tB + ((TJ - MID) / (1 - MID)) * LD2 - 0.2, 'fadeUp', { dur: 0.6 });
    tl.to(area, { opacity: 0.22, duration: 0.5 }, tB + LD2 - 0.3);
  });

  // =================================================================== ch08s05  Empty the cup
  registerScene('ch08s05', ctx => {
    const { stage, tl, cue, end } = ctx;
    style(stage);
    const T = [0, 1, 2, 3].map(i => cue(i));
    const at = sayAt(ctx);
    const h = K.heading(stage, 'Plan decompression days', { x: 100, y: 120, size: 80 });
    h.title.style.whiteSpace = 'nowrap';
    wipeIn(tl, h.title, T[0]);
    barIn(tl, h.bar, T[0] + 0.5);

    // ---- the cup comes back nearly full (same build as s03: base layer, threshold well below the rim)
    const CX = 360, TOP = 320, HGT = 570, THR = 480, SHIFT = 600;
    const cup = makeCup(stage, {
      cx: CX, top: TOP, h: HGT, wTop: 420, wBot: 320, thr: THR, level: 500,
      bands: [
        { y0: 840, y1: 890, color: BASE }, { y0: 740, y1: 840, color: TRIG.doorbell }, { y0: 640, y1: 740, color: TRIG.truck },
        { y0: 560, y1: 640, color: TRIG.skate }, { y0: 400, y1: 560, color: TRIG.jogger },
      ],
    });
    const W = cup.wrap;
    const tLab = thrTag(W, cup.xr + 124, THR);
    gsap.set(W, { x: SHIFT });
    tl.fromTo(cup.body, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, T[0] + 0.2);
    drawThr(tl, cup.thr, T[0] + 0.7, 0.7);
    A.in(tl, tLab, T[0] + 1.1, 'pop', { dur: 0.5 });

    // ---- beat 0: decompression drains it, hottest stress first
    const ITEMS = [['footprints', 'Sniffing games'], ['bone', 'Chewing'], ['puzzle', 'Food puzzle'], ['moon', 'Rest']];
    const items = ITEMS.map(([n, s], i) => {
      const it = box(stage, 'c8-item', null, 836 + (i % 2) * 500, 280 + Math.floor(i / 2) * 124, 480, 106);
      const b = K.el('div', 'b');
      b.appendChild(ico(n, null, { stroke: 2.2 }));
      it.appendChild(b);
      it.appendChild(K.el('span', null, s));
      return it;
    });
    const skip = box(stage, 'c8-lbl green', null, 836, 530);
    skip.appendChild(ico('circle-check', null, { stroke: 2.4 }));
    skip.appendChild(K.el('span', null, 'Skipping a walk is okay'));
    const tI = [at(0, 'sniffing games'), at(0, 'chews'), at(0, 'food puzzles'), at(0, 'naps')];
    for (let i = 1; i < 4; i++) tI[i] = Math.max(tI[i], tI[i - 1] + 0.5);
    tl.to(W, { x: 0, duration: 0.9, ease: 'power3.inOut' }, tI[0] - 0.9);
    const LEV = [580, 650, 710, 752];
    items.forEach((it, i) => {
      A.in(tl, it, tI[i], 'fadeLeft', { dur: 0.6 });
      cup.setLevel(tl, LEV[i], tI[i] + 0.15, 0.8);
    });
    A.in(tl, skip, Math.max(tI[3] + 0.8, at(0, 'and yes')), 'fadeUp', { dur: 0.6 });

    // ---- beat 1: a week strip; grooming Saturday, the street fair moves off Sunday
    const X0 = 836, CG = 12, CWD = (980 - 6 * CG) / 7, CY = 690, CH = 196;
    const cx = i => X0 + i * (CWD + CG);
    const calLab = box(stage, 'c8-big', 'Space out the hard days', 836, 620, null, null, { fontSize: '44px' });
    const days = ['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed'].map((d, i) => box(stage, 'c8-day' + (i === 2 || i === 3 ? ' wknd' : ''), d, cx(i), CY, CWD, CH));
    const blk = (i, cls, icon, text) => {
      const b = box(stage, 'c8-blk ' + cls, null, cx(i) + 8, CY + 54, CWD - 16, CH - 64);
      b.appendChild(ico(icon, null, { stroke: 2.2 }));
      b.appendChild(K.el('span', null, text));
      return b;
    };
    const groom = blk(2, 'hard', 'scissors', 'Hard<br>day');
    const fair = blk(3, 'hard', 'ferris-wheel', 'Hard<br>day');
    const rest = blk(3, 'rest', 'bed', 'Rest<br>day');
    A.in(tl, calLab, T[1] + 0.05, 'fadeUp', { dur: 0.6 });
    A.in(tl, days, T[1] + 0.2, 'fadeUp', { dur: 0.6, stagger: 0.06 });
    // "don't stack hard days back to back": two hard days side by side; "if Saturday is grooming": that one nudges
    const tHard = Math.max(T[1] + 0.9, at(1, 'hard days'));
    A.in(tl, [groom, fair], tHard, 'pop', { dur: 0.55, stagger: 0.15 });
    A.pulse(tl, groom, Math.max(tHard + 0.9, at(1, 'grooming', 0.1)), { scale: 1.08 });
    const tSep = Math.max(tHard + 1.8, at(1, "sunday isn't"));
    tl.to(fair, { x: CWD + CG, duration: 0.8, ease: 'power3.inOut' }, tSep);
    A.in(tl, rest, tSep + 0.45, 'fadeDown', { dur: 0.6 });

    // ---- beat 2: room to learn
    const LOW = 790;
    const room = K.rect(cup.extra, cup.xl - 30, THR, 480, LOW - THR, { fill: C.green, opacity: 0 });
    const roomLab = box(W, 'c8-big', 'Room<br>to learn', CX - 200, (THR + LOW) / 2 - 58, 400, null, { textAlign: 'center', color: C.greenDeep, fontSize: '48px' });
    cup.setLevel(tl, LOW, T[2] + 0.05, 1.0);
    tl.to(room, { opacity: 0.18, duration: 0.7 }, T[2] + 0.7);
    A.in(tl, roomLab, T[2] + 0.9, 'fadeUp', { dur: 0.6 });

    // ---- beat 3: everything clears but the cup, one question and the Try this badge
    const t3 = T[3];
    const clear = [h.title, h.bar, ...items, skip, calLab, ...days, groom, fair, rest, tLab, roomLab, room, cup.liquid];
    tl.to(clear, { opacity: 0, duration: 0.45, ease: 'power2.in' }, t3 - 0.1);
    tl.to(W, { x: 960 - CX, y: -60, scale: 0.55, transformOrigin: `${CX}px 605px`, duration: 1.0, ease: 'power3.inOut' }, t3 + 0.2);
    tl.to(cup.thr, { attr: { 'stroke-width': 9, 'stroke-dasharray': '21.8 29.1' }, duration: 1.0, ease: 'power3.inOut' }, t3 + 0.2);
    const q = box(stage, 'c8-q', '?', 760, 214, 400);
    const ask = centred(stage, K.el('div', 'c8-ask', 'What’s in the cup today?'), 960, 740, 1400);
    const tryB = tryBadge(ask);
    // the question mark lands on "one question", the question itself when it is asked
    const tQ = Math.max(t3 + 0.9, at(3, 'one question'));
    const tAsk = Math.min(end(3) - 1.0, Math.max(tQ + 0.6, at(3, "what's already")));
    A.in(tl, q, tQ, 'pop', { dur: 0.6 });
    A.in(tl, ask, tAsk, 'fadeUp', { dur: 0.7 });
    tryIn(tl, tryB, tAsk + 0.5);
  });
})();
