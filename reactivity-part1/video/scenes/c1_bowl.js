// Shared parts for chapter 1 (v5): the recipe bowl and small builders used by every bowl scene.
// Scene files use them through window.C1. CSS classes are prefixed .c1- and injected with C1.style(stage).
//
//   C1.ING                       the eight ingredients {name, icon, col}, in chapter order
//   C1.makeBowl(stage, {cx, y, s, filled})  bowl with the first `filled` ingredients already inside
//   C1.dropIn(tl, B, k, t)       ingredient k lights up in its "?" chip, hops into the bowl, splashes; returns landing time
//   C1.bob(tl, B, t0, t1)        the remaining "?" chips hover gently
//   C1.caption(parent, k, cx, y, {left})    pill naming ingredient k
//   C1.sceneBase(ctx, title, filled, size)  heading + standard bowl (right side), both fading in at the start
//   C1.sayAt(ctx, i, phrase, fb, lead)      scene time just before `phrase` is spoken in beat i
//   plus svgIcon, phraseAt, clamp, layer, put, badge, label, iconPill, callout, C (colours), STD, CAP_Y
(() => {
  const C = {
    green: '#619537', greenDark: '#3f6b22', greenDeep: '#2c4a17', greenLight: '#b8d99a', pale: '#e8f1dc',
    mist: '#f3f8ec', olive: '#4b5a1e', ink: '#212121', inkSoft: '#4a4a4a', muted: '#7a7a7a', line: '#d9ddd3',
    red: '#b8452d', redPale: '#f8e3dd', amber: '#d9912b', amberPale: '#fbefd9', amberText: '#a8650f',
  };

  // the recipe: eight ingredients, in the order the chapter adds them
  const ING = [
    { name: 'Genetics and temperament', icon: 'dna', col: '#619537' },
    { name: 'Prenatal environment', icon: 'baby', col: '#8aae4a' },
    { name: 'Breed traits', icon: 'paw-print', col: '#4b5a1e' },
    { name: 'Socialization', icon: 'users', col: '#3f6b22' },
    { name: 'Age', icon: 'hourglass', col: '#7a8f2e' },
    { name: 'Past experiences', icon: 'zap', col: '#d9912b' },
    { name: 'Training tools and methods', icon: 'link', col: '#b8452d' },
    { name: 'Pain and discomfort', icon: 'stethoscope', col: '#2c4a17' },
  ];
  // bowl-local coordinates: origin at the centre of the rim ellipse (rx 260, ry 50)
  // eight "?" chips hover on an arc above the bowl
  const SLOT = [-156, -137, -118, -99, -81, -62, -43, -24].map(d => {
    const r = (d * Math.PI) / 180;
    return [Math.round(420 * Math.cos(r)), Math.round(60 + 420 * Math.sin(r))];
  });
  // where each ingredient rests in the bowl: a back row of four, a front row of four
  const SPOT = [[-176, -64], [-60, -76], [60, -76], [176, -64], [-172, 4], [-60, -2], [60, -2], [172, 4]];
  const BODY = 'M -260 0 C -260 150 -150 232 0 232 C 150 232 260 150 260 0 A 260 50 0 0 1 -260 0 Z';
  const STD = { cx: 1480, y: 600, s: 0.78 }; // bowl placement in the ingredient scenes
  const CAP_Y = 830;
  let uid = 0;

  const CSS = `
  .c1-layer { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
  .c1-bowl { position: absolute; }
  .c1-caprow { position: absolute; display: flex; justify-content: center; }
  .c1-cap { display: inline-flex; align-items: center; gap: 16px; padding: 10px 32px 10px 10px; border-radius: 999px; background: #fff;
    box-shadow: var(--shadow-soft); border: 1px solid #e6e9e1; font: 700 30px/1 var(--font-body); color: var(--ink); white-space: nowrap; }
  .c1-dot { width: 50px; height: 50px; border-radius: 50%; display: grid; place-items: center; color: #fff; flex: 0 0 auto; }
  .c1-dot svg { width: 28px; height: 28px; stroke-width: 2.3; }
  .c1-big { position: absolute; font: 600 54px/1.16 var(--font-head); color: var(--ink); white-space: nowrap; }
  .c1-mix { position: absolute; font: 600 56px/1.1 var(--font-head); color: var(--ink); white-space: nowrap; }
  .c1-card { position: absolute; background: #fff; border-radius: 26px; box-shadow: var(--shadow-soft); border: 1px solid #e6e9e1; }
  .c1-badge { position: absolute; border-radius: 50%; display: grid; place-items: center; }
  .c1-badge svg { width: 54%; height: 54%; stroke-width: 2.1; }
  .c1-tag { position: absolute; display: inline-flex; align-items: center; gap: 18px; padding: 14px 34px 14px 16px; border-radius: 999px;
    background: #fff; box-shadow: var(--shadow-soft); border: 1px solid #e6e9e1; font: 500 36px/1 var(--font-body); color: var(--ink); white-space: nowrap; }
  .c1-tag .ic { width: 56px; height: 56px; border-radius: 50%; display: grid; place-items: center; background: var(--green-pale); color: var(--green-dark); }
  .c1-tag .ic svg { width: 32px; height: 32px; stroke-width: 2.2; }
  .c1-tag b { font-weight: 700; }
  .c1-ttag { position: absolute; display: inline-flex; align-items: center; padding: 18px 34px; border-radius: 999px; background: #fff;
    box-shadow: var(--shadow-soft); border: 1px solid #e6e9e1; font: 500 36px/1 var(--font-body); color: var(--ink); white-space: nowrap; }
  .c1-ttag b { font-weight: 700; color: var(--green-dark); }
  .c1-ttag.hi { border: 3px solid var(--green); }
  .c1-sub { position: absolute; font: 700 40px/1.1 var(--font-head); color: var(--green-dark); white-space: nowrap; }
  .c1-row { position: absolute; display: flex; align-items: center; gap: 24px; padding: 0 28px 0 16px; height: 96px; border-radius: 24px;
    background: #fff; box-shadow: var(--shadow-soft); border: 1px solid #e6e9e1; font: 700 36px/1 var(--font-body); color: var(--ink); white-space: nowrap; }
  .c1-row .ic { width: 64px; height: 64px; border-radius: 50%; display: grid; place-items: center; flex: 0 0 auto; }
  .c1-row .ic svg { width: 36px; height: 36px; stroke-width: 2.2; }
  .c1-lab { position: absolute; font: 600 28px/1.2 var(--font-body); color: var(--ink-soft); white-space: nowrap; text-align: center; }
  .c1-red { display: inline-flex; align-items: center; padding: 16px 32px; border-radius: 999px; border: 3px solid var(--red); background: #fff;
    color: var(--red); font: 700 38px/1 var(--font-body); white-space: nowrap; }
  .c1-wrap { position: absolute; display: flex; flex-wrap: wrap; gap: 20px 22px; }
  .c1-out { display: inline-flex; align-items: center; gap: 14px; padding: 14px 30px 14px 14px; border-radius: 999px; background: var(--green-pale);
    color: var(--green-deep); font: 700 34px/1 var(--font-body); white-space: nowrap; }
  .c1-out .ic { width: 54px; height: 54px; border-radius: 50%; background: var(--green); color: #fff; display: grid; place-items: center; }
  .c1-out .ic svg { width: 30px; height: 30px; stroke-width: 2.3; }
  .c1-call { position: absolute; padding-left: 30px; border-left: 10px solid var(--green); }
  .c1-call .t1 { font: 700 58px/1.1 var(--font-head); white-space: nowrap; }
  .c1-call .t2 { font: 500 40px/1.3 var(--font-body); color: var(--ink); white-space: nowrap; margin-top: 8px; }
  .c1-band { position: absolute; height: 80px; border-radius: 22px; display: flex; align-items: center; padding-left: 26px;
    font: 700 32px/1 var(--font-body); white-space: nowrap; border: 3px solid; }
  .c1-sign { position: absolute; font: 700 72px/1 var(--font-head); color: var(--muted); text-align: center; width: 80px; }
  .c1-eqlab { position: absolute; font: 700 30px/1.2 var(--font-body); color: var(--ink); white-space: nowrap; text-align: center; width: 240px; }
  .c1-best { position: absolute; font: 700 92px/1.1 var(--font-head); color: var(--green); white-space: nowrap; }
  .c1-vet { position: absolute; display: flex; align-items: center; gap: 20px; padding: 0 36px 0 22px; height: 110px; border-radius: 30px;
    background: var(--green); color: #fff; font: 700 42px/1 var(--font-head); white-space: nowrap; box-shadow: var(--shadow); }
  .c1-vet .vi { width: 72px; height: 72px; border-radius: 50%; background: rgba(255,255,255,0.18); display: grid; place-items: center; }
  .c1-vet .vi svg { width: 42px; height: 42px; stroke-width: 2.2; }
  .c1-q { display: inline-flex; align-items: center; gap: 12px; padding: 14px 28px 14px 16px; border-radius: 999px; background: var(--amber-pale);
    color: #8a5410; font: 700 34px/1 var(--font-body); white-space: nowrap; }
  .c1-q svg { width: 36px; height: 36px; stroke-width: 2.4; }
  .c1-first { font: 700 36px/1 var(--font-head); color: var(--green-dark); white-space: nowrap; }
  .c1-final { position: absolute; display: flex; justify-content: center; align-items: center; gap: 30px; }
  .c1-final .ft { font: 700 88px/1.1 var(--font-head); color: var(--ink); white-space: nowrap; }
  .c1-final .ft b { color: var(--green); font-weight: 700; }
  .c1-heart { position: absolute; display: grid; place-items: center; }
  .c1-kick { position: absolute; font: 700 28px/1 var(--font-body); letter-spacing: 7px; text-transform: uppercase; color: var(--green); white-space: nowrap; text-align: center; }

  /* ch01s13 */
  .c1-fe { position: absolute; display: flex; align-items: center; gap: 32px; padding: 0 40px; background: #fff; border-radius: 26px;
    border: 1px solid #e6e9e1; box-shadow: var(--shadow-soft); }
  .c1-fe .ib { flex: 0 0 auto; width: 116px; height: 116px; border-radius: 50%; display: grid; place-items: center; }
  .c1-fe .ib svg { width: 62px; height: 62px; stroke-width: 2; }
  .c1-fe .ttl { font: 700 58px/1 var(--font-head); color: var(--ink); white-space: nowrap; }
  .c1-fe .q { margin-top: 16px; font: 500 36px/1.2 var(--font-body); color: var(--ink-soft); white-space: nowrap; }
  .c1-rel { position: absolute; text-align: center; font: 500 42px/1.2 var(--font-body); color: var(--ink); white-space: nowrap; }
  .c1-map { position: absolute; display: flex; align-items: center; gap: 20px; height: 82px; padding: 0 34px 0 12px; border-radius: 999px;
    font: 700 36px/1 var(--font-body); white-space: nowrap; box-shadow: var(--shadow-soft); }
  .c1-map .ic { width: 60px; height: 60px; border-radius: 50%; display: grid; place-items: center; flex: 0 0 auto; }
  .c1-map .ic svg { width: 34px; height: 34px; stroke-width: 2.3; }
  .c1-map.emo { background: #fff; color: var(--ink); border: 1px solid #e6e9e1; }
  .c1-map.emo .ic { background: var(--amber-pale); color: var(--amber); }
  .c1-map.fn { background: var(--green); color: #fff; }
  .c1-map.fn .ic { background: rgba(255,255,255,0.22); color: #fff; }
  .c1-tip { position: absolute; display: flex; flex-direction: column; align-items: center; gap: 16px; }
  .c1-tip .row { display: flex; gap: 14px; }
  .c1-itag { padding: 12px 26px; border-radius: 999px; background: var(--green); color: #fff; font: 700 34px/1.1 var(--font-body);
    white-space: nowrap; box-shadow: 0 8px 20px rgba(44,74,23,0.20); }
  .c1-emo { position: absolute; text-align: center; font: 700 48px/1 var(--font-head); color: var(--green-deep); white-space: nowrap; }
  .c1-drive { position: absolute; font: 700 42px/1.18 var(--font-head); color: var(--green-dark); }
  .c1-same { position: absolute; padding-left: 34px; border-left: 10px solid var(--green-light); }
  .c1-same .a { font: 700 62px/1.1 var(--font-head); color: var(--green); white-space: nowrap; }
  .c1-same .b { font: 600 52px/1.15 var(--font-head); color: var(--ink); white-space: nowrap; margin-top: 8px; }
  .c1-legend { position: absolute; display: inline-flex; align-items: center; gap: 16px; height: 72px; padding: 0 36px 0 14px; border-radius: 999px;
    background: var(--green); color: #fff; font: 700 36px/1 var(--font-body); white-space: nowrap; box-shadow: 0 10px 24px rgba(44,74,23,0.24); }
  .c1-legend .ic { width: 50px; height: 50px; border-radius: 50%; background: rgba(255,255,255,0.22); display: grid; place-items: center; }
  .c1-legend .ic svg { width: 30px; height: 30px; stroke-width: 2.4; }

  /* ch01s16 */
  .c1-life { position: absolute; display: flex; align-items: center; gap: 22px; padding: 0 26px; background: #fff; border-radius: 26px;
    border: 1px solid #e6e9e1; box-shadow: var(--shadow-soft); }
  .c1-life .ib { flex: 0 0 auto; width: 84px; height: 84px; border-radius: 50%; display: grid; place-items: center; }
  .c1-life .ib svg { width: 46px; height: 46px; stroke-width: 2.1; }
  .c1-life .nm { font: 700 44px/1 var(--font-head); color: var(--ink); white-space: nowrap; }
  .c1-park { position: absolute; display: flex; align-items: center; gap: 30px; padding: 0 34px; background: #fff; border-radius: 26px;
    border: 1px solid #e6e9e1; box-shadow: var(--shadow-soft); }
  .c1-park .ib { flex: 0 0 auto; width: 96px; height: 96px; border-radius: 50%; background: var(--green-pale); color: var(--green-dark); display: grid; place-items: center; }
  .c1-park .ib svg { width: 54px; height: 54px; stroke-width: 2; }
  .c1-park .col { display: flex; flex-direction: column; gap: 16px; }
  .c1-park .ln { display: flex; align-items: center; gap: 16px; font: 600 34px/1 var(--font-body); color: var(--ink); white-space: nowrap; }
  .c1-park .ln b { font-weight: 700; }
  .c1-park .mk { width: 46px; height: 46px; border-radius: 50%; display: grid; place-items: center; flex: 0 0 auto; }
  .c1-park .mk svg { width: 28px; height: 28px; stroke-width: 3; }
  `;
  const style = stage => stage.appendChild(K.el('style', null, CSS));

  // ------------------------------------------------------------------ small builders
  /** Lucide icon drawn inside an svg, centred on (x, y) at `size` px. */
  function svgIcon(parent, name, x, y, size, attrs = {}) {
    const k = size / 24;
    const outer = K.group(parent); // untransformed wrapper, safe to animate with GSAP
    const g = K.group(outer, Object.assign({ transform: `translate(${x - size / 2} ${y - size / 2}) scale(${k})`, fill: 'none', stroke: C.ink, 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, attrs));
    g.innerHTML = (window.ICONS || {})[name] || '';
    return outer;
  }
  /** Scene time at which `phrase` is spoken in beat i. */
  const phraseAt = (ctx, i, phrase, fb = 0.5) => window.phraseTime(ctx, i, phrase, fb);
  /** Same, leading by `lead` s and never before the beat's cue. */
  const sayAt = (ctx, i, phrase, fb = 0.5, lead = 0.3) => Math.max(ctx.cue(i), phraseAt(ctx, i, phrase, fb) - lead);
  const clamp = (t, lo, hi) => Math.max(lo, Math.min(t, hi));
  /** Full-canvas group so a whole view can be faded out at once. */
  function layer(stage) {
    const d = K.el('div', 'c1-layer');
    stage.appendChild(d);
    return d;
  }
  /** Absolutely positioned div with markup text. */
  function put(parent, cls, html, o) {
    const n = K.el('div', cls, html == null ? null : K.md(html));
    n.style.left = o.x + 'px';
    n.style.top = o.y + 'px';
    if (o.w) n.style.width = o.w + 'px';
    if (o.h) n.style.height = o.h + 'px';
    if (o.size) n.style.fontSize = o.size + 'px';
    if (o.color) n.style.color = o.color;
    if (o.align) n.style.textAlign = o.align;
    parent.appendChild(n);
    return n;
  }
  /** Round icon badge centred on (cx, cy). */
  function badge(parent, name, cx, cy, size, bg, fg) {
    const b = K.el('div', 'c1-badge');
    Object.assign(b.style, { left: cx - size / 2 + 'px', top: cy - size / 2 + 'px', width: size + 'px', height: size + 'px', background: bg, color: fg });
    b.appendChild(K.icon(name));
    parent.appendChild(b);
    return b;
  }
  /** Centred text label at (cx, y). */
  function label(parent, html, cx, y, o = {}) {
    const w = o.w ?? 400;
    const n = put(parent, o.cls || 'c1-lab', html, { x: cx - w / 2, y, w, size: o.size, color: o.color, align: 'center' });
    if (o.weight) n.style.fontWeight = o.weight;
    return n;
  }
  /** Icon circle + text inside a pill-like element. */
  function iconPill(parent, cls, icon, html, o = {}) {
    const n = K.el('div', cls);
    if (o.x != null) Object.assign(n.style, { left: o.x + 'px', top: o.y + 'px' });
    const ic = K.el('div', 'ic');
    if (o.bg) ic.style.background = o.bg;
    if (o.fg) ic.style.color = o.fg;
    ic.appendChild(K.icon(icon));
    n.appendChild(ic);
    n.appendChild(K.el('span', null, K.md(html)));
    parent.appendChild(n);
    return n;
  }

  // ------------------------------------------------------------------ the mixing bowl
  /**
   * Mixing bowl with ingredient tokens and the ring of hovering "?" chips.
   * o: {cx, y (rim centre), s (scale), filled (ingredients already in the bowl)}
   */
  function makeBowl(stage, o) {
    const s = o.s, id = 'c1b' + ++uid;
    const VX = 470, VT = 460, VW = 940, VH = 760;
    const wrap = K.el('div', 'c1-bowl');
    Object.assign(wrap.style, { left: o.cx - VX * s + 'px', top: o.y - VT * s + 'px', width: VW * s + 'px', height: VH * s + 'px', transformOrigin: `${VX * s}px ${VT * s}px` });
    stage.appendChild(wrap);
    const svg = K.svgEl('svg', { viewBox: `${-VX} ${-VT} ${VW} ${VH}`, width: VW * s, height: VH * s }, wrap);
    svg.style.overflow = 'visible';
    const defs = K.svgEl('defs', {}, svg);
    defs.innerHTML = `
      <radialGradient id="${id}g" cx="50%" cy="50%" r="50%">
        <stop offset="0" stop-color="#e2f1cd" stop-opacity="1"/>
        <stop offset="0.5" stop-color="#cfe6b4" stop-opacity="0.6"/>
        <stop offset="1" stop-color="#cfe6b4" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="${id}b" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#74aa48"/><stop offset="1" stop-color="#4a7a29"/>
      </linearGradient>
      <linearGradient id="${id}i" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#cadfb3"/><stop offset="1" stop-color="#ecf4e2"/>
      </linearGradient>
      <clipPath id="${id}c"><path d="${BODY}"/></clipPath>
      <filter id="${id}f" x="-50%" y="-300%" width="200%" height="700%"><feGaussianBlur stdDeviation="9"/></filter>
      <filter id="${id}t" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="5" stdDeviation="4" flood-color="#28401a" flood-opacity="0.25"/></filter>`;
    const glow = K.circle(svg, 0, -40, 440, { fill: `url(#${id}g)`, opacity: 0 });
    K.svgEl('ellipse', { cx: 0, cy: 246, rx: 226, ry: 22, fill: C.greenDeep, opacity: 0.2, filter: `url(#${id}f)` }, svg);
    const bodyAll = K.group(svg);
    K.svgEl('ellipse', { cx: 0, cy: 0, rx: 267, ry: 57, fill: 'none', stroke: '#b3c2a1', 'stroke-width': 2.5 }, bodyAll);
    K.svgEl('ellipse', { cx: 0, cy: 0, rx: 260, ry: 50, fill: `url(#${id}i)`, stroke: '#fff', 'stroke-width': 12 }, bodyAll);
    const tokG = K.group(bodyAll);
    const front = K.group(bodyAll);
    K.path(front, BODY, { fill: `url(#${id}b)`, stroke: 'none' });
    K.path(front, 'M -266 76 A 266 52 0 0 0 266 76', { stroke: C.greenLight, 'stroke-width': 22, fill: 'none', 'clip-path': `url(#${id}c)` });
    K.path(front, 'M -228 84 C -218 136 -184 176 -132 200', { stroke: '#fff', 'stroke-width': 10, opacity: 0.2, fill: 'none' });
    K.path(front, 'M 260 0 A 260 50 0 0 1 -260 0', { stroke: '#fff', 'stroke-width': 12, fill: 'none' });

    const tokens = ING.map((g, k) => {
      const outer = K.group(tokG);
      const inner = K.group(outer);
      K.circle(inner, 0, 0, 44, { fill: g.col, stroke: '#fff', 'stroke-width': 5, filter: `url(#${id}t)` });
      svgIcon(inner, g.icon, 0, 0, 46, { stroke: '#fff', 'stroke-width': 2.3 });
      const [x, y] = SPOT[k];
      gsap.set(outer, { x, y, opacity: k < o.filled ? 1 : 0 });
      return { outer, inner, x, y };
    });
    const slotG = K.group(svg);
    const slots = SLOT.map(([x, y], k) => {
      const g = K.group(slotG);
      K.circle(g, 0, 0, 40, { fill: 'rgba(255,255,255,0.8)', stroke: '#aebb9f', 'stroke-width': 3.5, 'stroke-dasharray': '9 8' });
      K.svgText(g, 0, 18, '?', { 'font-family': 'Rubik', 'font-size': 52, 'font-weight': 700, fill: '#9eab90', 'text-anchor': 'middle' });
      gsap.set(g, { x, y, opacity: k >= o.filled ? 1 : 0 });
      return { g, x, y };
    });
    const fx = K.group(svg);
    return { wrap, svg, glow, bodyAll, tokens, slots, fx, s, cx: o.cx, y: o.y };
  }

  /** Remaining "?" chips hover gently from t0 to t1. */
  function bob(tl, B, t0, t1) {
    B.slots.forEach((sl, k) => {
      const per = 1.3, st = t0 + k * 0.19;
      const n = Math.max(1, Math.floor((t1 - st) / per));
      tl.fromTo(sl.g, { y: sl.y }, { y: sl.y - 9, duration: per, ease: 'sine.inOut', yoyo: true, repeat: n - 1 }, st);
    });
  }

  /** Little droplets that fly up from the landing point. */
  function splash(tl, B, x, y, t, col) {
    [-162, -128, -94, -58, -22].forEach((a, i) => {
      const r = (a * Math.PI) / 180, d = 74 + (i % 2) * 24;
      const c = K.circle(B.fx, x, y, 9 - (i % 2) * 2, { fill: i % 2 ? C.greenLight : col, opacity: 0 });
      tl.fromTo(c, { x: 0, y: 0, opacity: 0.95 }, { x: Math.cos(r) * d, y: Math.sin(r) * d, opacity: 0, duration: 0.6, ease: 'power2.out', immediateRender: false }, t);
    });
  }

  /**
   * Ingredient k lights up in its hovering chip, hops into the bowl and lands with a splash.
   * Returns the landing time.
   */
  function dropIn(tl, B, k, t) {
    const tk = B.tokens[k];
    const [sx, sy] = SLOT[k];
    tl.to(B.slots[k].g, { opacity: 0, scale: 1.35, transformOrigin: '50% 50%', duration: 0.35, ease: 'power2.out' }, t);
    tl.fromTo(tk.outer, { x: sx, y: sy, opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power1.out' }, t);
    tl.fromTo(tk.inner, { scale: 0.3, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.5, ease: 'back.out(2.2)' }, t);
    const t1 = t + 0.55, D = 0.62;
    tl.to(tk.outer, { x: tk.x, duration: D, ease: 'power1.inOut' }, t1);
    tl.to(tk.outer, { y: sy - 46, duration: D * 0.36, ease: 'power2.out' }, t1);
    tl.to(tk.outer, { y: tk.y, duration: D * 0.64, ease: 'power2.in' }, t1 + D * 0.36);
    const land = t1 + D;
    tl.to(tk.inner, { scaleX: 1.14, scaleY: 0.86, transformOrigin: '50% 50%', duration: 0.1, yoyo: true, repeat: 1, ease: 'power1.out' }, land);
    tl.to(B.bodyAll, { y: 5, duration: 0.1, yoyo: true, repeat: 1, ease: 'power1.out' }, land);
    splash(tl, B, tk.x, tk.y - 34, land, ING[k].col);
    return land;
  }

  /** Caption pill naming ingredient k, centred on cx (or left-aligned at cx when o.left). */
  function caption(parent, k, cx, y, o = {}) {
    const row = K.el('div', 'c1-caprow');
    Object.assign(row.style, { left: (o.left ? cx : cx - 480) + 'px', top: y + 'px', width: '960px' });
    if (o.left) row.style.justifyContent = 'flex-start';
    const p = K.el('div', 'c1-cap');
    const dot = K.el('div', 'c1-dot');
    dot.style.background = ING[k].col;
    dot.appendChild(K.icon(ING[k].icon));
    p.appendChild(dot);
    p.appendChild(K.el('span', null, ING[k].name));
    row.appendChild(p);
    parent.appendChild(row);
    return row;
  }

  /** Heading + standard bowl shared by the ingredient scenes (both fade in at the start of the scene). */
  function sceneBase(ctx, title, filled, size = 80) {
    const { stage, tl, dur } = ctx;
    style(stage);
    const h = K.heading(stage, title, { x: 100, y: 120, w: 1400, size });
    A.in(tl, h.all, 0.05, 'fadeUp', { dur: 0.7, stagger: 0.1 });
    const B = makeBowl(stage, { cx: STD.cx, y: STD.y, s: STD.s, filled });
    A.in(tl, B.wrap, 0, 'fade', { dur: 0.6 });
    bob(tl, B, 0, dur);
    return { h, B };
  }

  /** Callout block: coloured title line + optional second line, left border in the same colour. */
  function callout(parent, x, y, t1, t2, col) {
    const c = K.el('div', 'c1-call');
    Object.assign(c.style, { left: x + 'px', top: y + 'px', borderLeftColor: col });
    const a = K.el('div', 't1', K.md(t1));
    a.style.color = col;
    c.appendChild(a);
    if (t2) c.appendChild(K.el('div', 't2', K.md(t2)));
    parent.appendChild(c);
    return c;
  }
  window.C1 = { C, ING, SLOT, SPOT, STD, CAP_Y, CSS, style, svgIcon, phraseAt, sayAt, clamp, layer, put, badge, label, iconPill,
    makeBowl, bob, splash, dropIn, caption, sceneBase, callout };
})();
