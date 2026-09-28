// Part 1, one-chapter version: scenes built by group d.
//   ch01s13  Function and emotion           emotion and function cards, three emotion to function rows, the iceberg,
//                                           the two "same" lines, a green frame around the whole picture
//   ch01s14  Why this response?             photo + heading, then the mixing bowl with seven blank chips and a "+" chip
//   ch01s15  Nature and early life          genetics, breed traits, outlets for the drive, the socialization window
//   ch01s16  Age                            bowl shifts left, life-stage ruler, teen vs adult, the dog park, senior
//   ch01s17  Past experiences and tools     one bad moment, harsh tools, other dogs predict pain, not dominance, be kind
//   ch01s18  Frustration, pain and the mix  barrier photo, patience battery, vet check, the full bowl, not your fault
//
// The mixing bowl is one shared part (from the v3 archive). Every bowl scene rebuilds it with the ingredients
// already added, so the recipe fills up across the chapter: a blank "?" chip lights up, hops into the bowl and
// lands with a splash.
(() => {
  const C = {
    green: '#619537', greenDark: '#3f6b22', greenDeep: '#2c4a17', greenLight: '#b8d99a', pale: '#e8f1dc',
    mist: '#f3f8ec', olive: '#4b5a1e', ink: '#212121', inkSoft: '#4a4a4a', muted: '#7a7a7a', line: '#d9ddd3',
    red: '#b8452d', redPale: '#f8e3dd', amber: '#d9912b', amberPale: '#fbefd9', amberText: '#a8650f',
  };

  // the recipe: seven ingredients plus the dotted "+" chip (learning, environment, arousal)
  const ING = [
    { name: 'Genetics and temperament', icon: 'dna', col: '#619537' },
    { name: 'Socialization', icon: 'users', col: '#3f6b22' },
    { name: 'Age', icon: 'hourglass', col: '#4b5a1e' },
    { name: 'Past experiences', icon: 'zap', col: '#d9912b' },
    { name: 'Training tools', icon: 'link', col: '#b8452d' },
    { name: 'Leash and barrier frustration', icon: 'fence', col: '#cf6a2c' },
    { name: 'Pain or medical issues', icon: 'stethoscope', col: '#2c4a17' },
    { name: 'Learning, environment, arousal', icon: 'plus', col: '#8fb03a' },
  ];
  // bowl-local coordinates: origin at the centre of the rim ellipse (rx 260, ry 50)
  const SLOT = [-150, -130, -110, -90, -70, -50, -30].map(d => {
    const r = (d * Math.PI) / 180;
    return [Math.round(420 * Math.cos(r)), Math.round(60 + 420 * Math.sin(r))];
  });
  SLOT.push([0, -250]); // the smaller dotted "+" chip hovers inside the arc
  const SPOT = [[-172, 2], [-60, -4], [60, -4], [172, 2], [-118, -72], [118, -72], [0, -78], [0, -162]];
  const BODY = 'M -260 0 C -260 150 -150 232 0 232 C 150 232 260 150 260 0 A 260 50 0 0 1 -260 0 Z';
  const STD = { cx: 1480, y: 600, s: 0.78 }; // bowl placement in the ingredient scenes
  const CAP_Y = 830;
  let uid = 0;

  const CSS = `
  .v4d-layer { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
  .v4d-bowl { position: absolute; }
  .v4d-caprow { position: absolute; display: flex; justify-content: center; }
  .v4d-cap { display: inline-flex; align-items: center; gap: 16px; padding: 10px 32px 10px 10px; border-radius: 999px; background: #fff;
    box-shadow: var(--shadow-soft); border: 1px solid #e6e9e1; font: 700 30px/1 var(--font-body); color: var(--ink); white-space: nowrap; }
  .v4d-dot { width: 50px; height: 50px; border-radius: 50%; display: grid; place-items: center; color: #fff; flex: 0 0 auto; }
  .v4d-dot svg { width: 28px; height: 28px; stroke-width: 2.3; }
  .v4d-big { position: absolute; font: 600 54px/1.16 var(--font-head); color: var(--ink); white-space: nowrap; }
  .v4d-mix { position: absolute; font: 600 56px/1.1 var(--font-head); color: var(--ink); white-space: nowrap; }
  .v4d-card { position: absolute; background: #fff; border-radius: 26px; box-shadow: var(--shadow-soft); border: 1px solid #e6e9e1; }
  .v4d-badge { position: absolute; border-radius: 50%; display: grid; place-items: center; }
  .v4d-badge svg { width: 54%; height: 54%; stroke-width: 2.1; }
  .v4d-tag { position: absolute; display: inline-flex; align-items: center; gap: 18px; padding: 14px 34px 14px 16px; border-radius: 999px;
    background: #fff; box-shadow: var(--shadow-soft); border: 1px solid #e6e9e1; font: 500 36px/1 var(--font-body); color: var(--ink); white-space: nowrap; }
  .v4d-tag .ic { width: 56px; height: 56px; border-radius: 50%; display: grid; place-items: center; background: var(--green-pale); color: var(--green-dark); }
  .v4d-tag .ic svg { width: 32px; height: 32px; stroke-width: 2.2; }
  .v4d-tag b { font-weight: 700; }
  .v4d-ttag { position: absolute; display: inline-flex; align-items: center; padding: 18px 34px; border-radius: 999px; background: #fff;
    box-shadow: var(--shadow-soft); border: 1px solid #e6e9e1; font: 500 36px/1 var(--font-body); color: var(--ink); white-space: nowrap; }
  .v4d-ttag b { font-weight: 700; color: var(--green-dark); }
  .v4d-ttag.hi { border: 3px solid var(--green); }
  .v4d-sub { position: absolute; font: 700 40px/1.1 var(--font-head); color: var(--green-dark); white-space: nowrap; }
  .v4d-row { position: absolute; display: flex; align-items: center; gap: 24px; padding: 0 28px 0 16px; height: 96px; border-radius: 24px;
    background: #fff; box-shadow: var(--shadow-soft); border: 1px solid #e6e9e1; font: 700 36px/1 var(--font-body); color: var(--ink); white-space: nowrap; }
  .v4d-row .ic { width: 64px; height: 64px; border-radius: 50%; display: grid; place-items: center; flex: 0 0 auto; }
  .v4d-row .ic svg { width: 36px; height: 36px; stroke-width: 2.2; }
  .v4d-lab { position: absolute; font: 600 28px/1.2 var(--font-body); color: var(--ink-soft); white-space: nowrap; text-align: center; }
  .v4d-red { display: inline-flex; align-items: center; padding: 16px 32px; border-radius: 999px; border: 3px solid var(--red); background: #fff;
    color: var(--red); font: 700 38px/1 var(--font-body); white-space: nowrap; }
  .v4d-wrap { position: absolute; display: flex; flex-wrap: wrap; gap: 20px 22px; }
  .v4d-out { display: inline-flex; align-items: center; gap: 14px; padding: 14px 30px 14px 14px; border-radius: 999px; background: var(--green-pale);
    color: var(--green-deep); font: 700 34px/1 var(--font-body); white-space: nowrap; }
  .v4d-out .ic { width: 54px; height: 54px; border-radius: 50%; background: var(--green); color: #fff; display: grid; place-items: center; }
  .v4d-out .ic svg { width: 30px; height: 30px; stroke-width: 2.3; }
  .v4d-call { position: absolute; padding-left: 30px; border-left: 10px solid var(--green); }
  .v4d-call .t1 { font: 700 58px/1.1 var(--font-head); white-space: nowrap; }
  .v4d-call .t2 { font: 500 40px/1.3 var(--font-body); color: var(--ink); white-space: nowrap; margin-top: 8px; }
  .v4d-band { position: absolute; height: 80px; border-radius: 22px; display: flex; align-items: center; padding-left: 26px;
    font: 700 32px/1 var(--font-body); white-space: nowrap; border: 3px solid; }
  .v4d-sign { position: absolute; font: 700 72px/1 var(--font-head); color: var(--muted); text-align: center; width: 80px; }
  .v4d-eqlab { position: absolute; font: 700 30px/1.2 var(--font-body); color: var(--ink); white-space: nowrap; text-align: center; width: 240px; }
  .v4d-best { position: absolute; font: 700 92px/1.1 var(--font-head); color: var(--green); white-space: nowrap; }
  .v4d-vet { position: absolute; display: flex; align-items: center; gap: 20px; padding: 0 36px 0 22px; height: 110px; border-radius: 30px;
    background: var(--green); color: #fff; font: 700 42px/1 var(--font-head); white-space: nowrap; box-shadow: var(--shadow); }
  .v4d-vet .vi { width: 72px; height: 72px; border-radius: 50%; background: rgba(255,255,255,0.18); display: grid; place-items: center; }
  .v4d-vet .vi svg { width: 42px; height: 42px; stroke-width: 2.2; }
  .v4d-q { display: inline-flex; align-items: center; gap: 12px; padding: 14px 28px 14px 16px; border-radius: 999px; background: var(--amber-pale);
    color: #8a5410; font: 700 34px/1 var(--font-body); white-space: nowrap; }
  .v4d-q svg { width: 36px; height: 36px; stroke-width: 2.4; }
  .v4d-first { font: 700 36px/1 var(--font-head); color: var(--green-dark); white-space: nowrap; }
  .v4d-final { position: absolute; display: flex; justify-content: center; align-items: center; gap: 30px; }
  .v4d-final .ft { font: 700 88px/1.1 var(--font-head); color: var(--ink); white-space: nowrap; }
  .v4d-final .ft b { color: var(--green); font-weight: 700; }
  .v4d-heart { position: absolute; display: grid; place-items: center; }
  .v4d-kick { position: absolute; font: 700 28px/1 var(--font-body); letter-spacing: 7px; text-transform: uppercase; color: var(--green); white-space: nowrap; text-align: center; }

  /* ch01s13 */
  .v4d-fe { position: absolute; display: flex; align-items: center; gap: 32px; padding: 0 40px; background: #fff; border-radius: 26px;
    border: 1px solid #e6e9e1; box-shadow: var(--shadow-soft); }
  .v4d-fe .ib { flex: 0 0 auto; width: 116px; height: 116px; border-radius: 50%; display: grid; place-items: center; }
  .v4d-fe .ib svg { width: 62px; height: 62px; stroke-width: 2; }
  .v4d-fe .ttl { font: 700 58px/1 var(--font-head); color: var(--ink); white-space: nowrap; }
  .v4d-fe .q { margin-top: 16px; font: 500 36px/1.2 var(--font-body); color: var(--ink-soft); white-space: nowrap; }
  .v4d-rel { position: absolute; text-align: center; font: 500 42px/1.2 var(--font-body); color: var(--ink); white-space: nowrap; }
  .v4d-map { position: absolute; display: flex; align-items: center; gap: 20px; height: 82px; padding: 0 34px 0 12px; border-radius: 999px;
    font: 700 36px/1 var(--font-body); white-space: nowrap; box-shadow: var(--shadow-soft); }
  .v4d-map .ic { width: 60px; height: 60px; border-radius: 50%; display: grid; place-items: center; flex: 0 0 auto; }
  .v4d-map .ic svg { width: 34px; height: 34px; stroke-width: 2.3; }
  .v4d-map.emo { background: #fff; color: var(--ink); border: 1px solid #e6e9e1; }
  .v4d-map.emo .ic { background: var(--amber-pale); color: var(--amber); }
  .v4d-map.fn { background: var(--green); color: #fff; }
  .v4d-map.fn .ic { background: rgba(255,255,255,0.22); color: #fff; }
  .v4d-tip { position: absolute; display: flex; flex-direction: column; align-items: center; gap: 16px; }
  .v4d-tip .row { display: flex; gap: 14px; }
  .v4d-itag { padding: 12px 26px; border-radius: 999px; background: var(--green); color: #fff; font: 700 34px/1.1 var(--font-body);
    white-space: nowrap; box-shadow: 0 8px 20px rgba(44,74,23,0.20); }
  .v4d-emo { position: absolute; text-align: center; font: 700 48px/1 var(--font-head); color: var(--green-deep); white-space: nowrap; }
  .v4d-drive { position: absolute; font: 700 42px/1.18 var(--font-head); color: var(--green-dark); }
  .v4d-same { position: absolute; padding-left: 34px; border-left: 10px solid var(--green-light); }
  .v4d-same .a { font: 700 62px/1.1 var(--font-head); color: var(--green); white-space: nowrap; }
  .v4d-same .b { font: 600 52px/1.15 var(--font-head); color: var(--ink); white-space: nowrap; margin-top: 8px; }
  .v4d-legend { position: absolute; display: inline-flex; align-items: center; gap: 16px; height: 72px; padding: 0 36px 0 14px; border-radius: 999px;
    background: var(--green); color: #fff; font: 700 36px/1 var(--font-body); white-space: nowrap; box-shadow: 0 10px 24px rgba(44,74,23,0.24); }
  .v4d-legend .ic { width: 50px; height: 50px; border-radius: 50%; background: rgba(255,255,255,0.22); display: grid; place-items: center; }
  .v4d-legend .ic svg { width: 30px; height: 30px; stroke-width: 2.4; }

  /* ch01s16 */
  .v4d-life { position: absolute; display: flex; align-items: center; gap: 22px; padding: 0 26px; background: #fff; border-radius: 26px;
    border: 1px solid #e6e9e1; box-shadow: var(--shadow-soft); }
  .v4d-life .ib { flex: 0 0 auto; width: 84px; height: 84px; border-radius: 50%; display: grid; place-items: center; }
  .v4d-life .ib svg { width: 46px; height: 46px; stroke-width: 2.1; }
  .v4d-life .nm { font: 700 44px/1 var(--font-head); color: var(--ink); white-space: nowrap; }
  .v4d-park { position: absolute; display: flex; align-items: center; gap: 30px; padding: 0 34px; background: #fff; border-radius: 26px;
    border: 1px solid #e6e9e1; box-shadow: var(--shadow-soft); }
  .v4d-park .ib { flex: 0 0 auto; width: 96px; height: 96px; border-radius: 50%; background: var(--green-pale); color: var(--green-dark); display: grid; place-items: center; }
  .v4d-park .ib svg { width: 54px; height: 54px; stroke-width: 2; }
  .v4d-park .col { display: flex; flex-direction: column; gap: 16px; }
  .v4d-park .ln { display: flex; align-items: center; gap: 16px; font: 600 34px/1 var(--font-body); color: var(--ink); white-space: nowrap; }
  .v4d-park .ln b { font-weight: 700; }
  .v4d-park .mk { width: 46px; height: 46px; border-radius: 50%; display: grid; place-items: center; flex: 0 0 auto; }
  .v4d-park .mk svg { width: 28px; height: 28px; stroke-width: 3; }
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
    const d = K.el('div', 'v4d-layer');
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
    const b = K.el('div', 'v4d-badge');
    Object.assign(b.style, { left: cx - size / 2 + 'px', top: cy - size / 2 + 'px', width: size + 'px', height: size + 'px', background: bg, color: fg });
    b.appendChild(K.icon(name));
    parent.appendChild(b);
    return b;
  }
  /** Centred text label at (cx, y). */
  function label(parent, html, cx, y, o = {}) {
    const w = o.w ?? 400;
    const n = put(parent, o.cls || 'v4d-lab', html, { x: cx - w / 2, y, w, size: o.size, color: o.color, align: 'center' });
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
    const s = o.s, id = 'v4db' + ++uid;
    const VX = 470, VT = 460, VW = 940, VH = 760;
    const wrap = K.el('div', 'v4d-bowl');
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
      if (k < 7) {
        K.circle(g, 0, 0, 40, { fill: 'rgba(255,255,255,0.8)', stroke: '#aebb9f', 'stroke-width': 3.5, 'stroke-dasharray': '9 8' });
        K.svgText(g, 0, 18, '?', { 'font-family': 'Rubik', 'font-size': 52, 'font-weight': 700, fill: '#9eab90', 'text-anchor': 'middle' });
      } else {
        K.circle(g, 0, 0, 31, { fill: 'rgba(255,255,255,0.8)', stroke: '#aebb9f', 'stroke-width': 3, 'stroke-dasharray': '7 6' });
        K.path(g, 'M -13 0 H 13 M 0 -13 V 13', { stroke: '#9eab90', 'stroke-width': 5.5, 'stroke-linecap': 'round', fill: 'none' });
      }
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
   * k = 7 fills the small dotted "+" chip. Returns the landing time.
   */
  function dropIn(tl, B, k, t) {
    const tk = B.tokens[k];
    const [sx, sy] = SLOT[k];
    tl.to(B.slots[k].g, { opacity: 0, scale: 1.35, transformOrigin: '50% 50%', duration: 0.35, ease: 'power2.out' }, t);
    tl.fromTo(tk.outer, { x: sx, y: sy, opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power1.out' }, t);
    tl.fromTo(tk.inner, { scale: 0.3, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.5, ease: 'back.out(2.2)' }, t);
    const t1 = t + 0.55, D = 0.62;
    tl.to(tk.outer, { x: tk.x, duration: D, ease: 'power1.inOut' }, t1);
    tl.to(tk.outer, { y: sy - (k === 7 ? 16 : 46), duration: D * 0.36, ease: 'power2.out' }, t1);
    tl.to(tk.outer, { y: tk.y, duration: D * 0.64, ease: 'power2.in' }, t1 + D * 0.36);
    const land = t1 + D;
    tl.to(tk.inner, { scaleX: 1.14, scaleY: 0.86, transformOrigin: '50% 50%', duration: 0.1, yoyo: true, repeat: 1, ease: 'power1.out' }, land);
    tl.to(B.bodyAll, { y: 5, duration: 0.1, yoyo: true, repeat: 1, ease: 'power1.out' }, land);
    splash(tl, B, tk.x, tk.y - 34, land, ING[k].col);
    return land;
  }

  /** Caption pill naming ingredient k, centred on cx (or left-aligned at cx when o.left). */
  function caption(parent, k, cx, y, o = {}) {
    const row = K.el('div', 'v4d-caprow');
    Object.assign(row.style, { left: (o.left ? cx : cx - 480) + 'px', top: y + 'px', width: '960px' });
    if (o.left) row.style.justifyContent = 'flex-start';
    const p = K.el('div', 'v4d-cap');
    const dot = K.el('div', 'v4d-dot');
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
    const c = K.el('div', 'v4d-call');
    Object.assign(c.style, { left: x + 'px', top: y + 'px', borderLeftColor: col });
    const a = K.el('div', 't1', K.md(t1));
    a.style.color = col;
    c.appendChild(a);
    if (t2) c.appendChild(K.el('div', 't2', K.md(t2)));
    parent.appendChild(c);
    return c;
  }

  // ================================================================== ch01s13 Function and emotion
  registerScene('ch01s13', ctx => {
    const { stage, tl, cue, dur } = ctx;
    style(stage);
    const h = K.heading(stage, 'Function and emotion', { x: 100, y: 120, w: 1400, size: 84 });
    A.in(tl, h.title, Math.max(0, cue(0) - 0.2), 'fadeUp', { dur: 0.8 });
    A.in(tl, h.bar, cue(0) + 0.3, 'grow', { dur: 0.6 });

    // ---------- beat 0: two cards, related but not the same
    const LA = layer(stage);
    const mkCard = (x, icon, bg, fg, title, q) => {
      const c = K.el('div', 'v4d-fe');
      Object.assign(c.style, { left: x + 'px', top: '290px', width: '820px', height: '210px' });
      const ib = K.el('div', 'ib');
      Object.assign(ib.style, { background: bg, color: fg });
      ib.appendChild(K.icon(icon));
      c.appendChild(ib);
      const col = K.el('div');
      col.appendChild(K.el('div', 'ttl', title));
      const qq = K.el('div', 'q', q);
      col.appendChild(qq);
      c.appendChild(col);
      LA.appendChild(c);
      return { c, ib, q: qq };
    };
    // emotion on the left, function on the right, so each row below reads "feeling -> what it gets"
    const emo = mkCard(100, 'heart', C.amberPale, C.amber, 'Emotion', 'What might the dog feel?');
    const fn = mkCard(1000, 'target', C.green, '#fff', 'Function', 'What did it accomplish?');
    const rel = put(LA, 'v4d-rel', 'Related, but *not the same*', { x: 460, y: 540, w: 1000 });
    A.in(tl, emo.c, cue(0) + 0.1, 'fadeRight', { dur: 0.8 });
    A.in(tl, fn.c, cue(0) + 0.25, 'fadeLeft', { dur: 0.8 });
    A.in(tl, [emo.ib, fn.ib], cue(0) + 0.45, 'pop', { dur: 0.6, stagger: 0.15 });
    A.in(tl, rel, Math.max(cue(0) + 1.0, sayAt(ctx, 0, 'related', 0.2)), 'fadeUp', { dur: 0.7 });
    const tFq = Math.max(cue(0) + 2.0, sayAt(ctx, 0, 'function is what', 0.45));
    const tEq = Math.max(tFq + 1.0, sayAt(ctx, 0, 'emotion is what', 0.75));
    A.in(tl, fn.q, tFq, 'fadeUp', { dur: 0.6 });
    A.pulse(tl, fn.c, tFq, { scale: 1.02 });
    A.in(tl, emo.q, tEq, 'fadeUp', { dur: 0.6 });
    A.pulse(tl, emo.c, tEq, { scale: 1.02 });

    // ---------- beat 1: three emotion -> function rows, one per phrase
    const rsvg = K.svg(LA, { x: 0, y: 0, w: 1920, h: 1080 });
    const ROWS = [
      ['Fear', 'Distance', 'a fearful dog', 'distance', 'frown'],
      ['Frustration', 'Access', 'a frustrated dog', 'access', 'annoyed'],
      ['Excitement', 'Closer', 'an excited dog', 'closer', 'party-popper'],
    ];
    let tPrev = cue(1) - 0.2;
    ROWS.forEach(([e, f, pe, pf, ic], i) => {
      const y = 630 + i * 104, cy = y + 41;
      const a = iconPill(LA, 'v4d-map emo', ic, e, { x: 320, y });
      a.style.width = '380px';
      const b = iconPill(LA, 'v4d-map fn', 'target', f, { x: 1220, y });
      b.style.width = '380px';
      const ln = K.path(rsvg, `M 724 ${cy} H 1192`, { stroke: C.greenLight, 'stroke-width': 6 });
      const hd = K.path(rsvg, `M 1176 ${cy - 14} L 1194 ${cy} L 1176 ${cy + 14}`, { stroke: C.greenLight, 'stroke-width': 6 });
      const tA = Math.max(tPrev + 0.3, sayAt(ctx, 1, pe, 0.1 + i * 0.3, 0.25));
      const tB = Math.max(tA + 0.6, sayAt(ctx, 1, pf, 0.25 + i * 0.3, 0.35));
      A.in(tl, a, tA, 'fadeRight', { dur: 0.6 });
      A.draw(tl, ln, tA + 0.35, Math.max(0.3, tB - tA - 0.2));
      A.in(tl, hd, tB - 0.05, 'fade', { dur: 0.2 });
      A.in(tl, b, tB, 'pop', { dur: 0.55 });
      tPrev = tB;
    });

    // ---------- beat 2: the cards clear and the iceberg rises
    A.out(tl, LA, cue(2) - 0.3, 'fadeUp', { dur: 0.45 });
    const LB = layer(stage);
    LB.style.transformOrigin = '0px 0px';
    const WL = 562; // waterline y
    const isvg = K.svg(LB, { x: 0, y: 0, w: 1920, h: 1080 });
    const defs = K.svgEl('defs', {}, isvg);
    const grad = K.svgEl('linearGradient', { id: 'v4d-water', x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    K.svgEl('stop', { offset: '0', 'stop-color': '#b8d99a', 'stop-opacity': 0.55 }, grad);
    K.svgEl('stop', { offset: '1', 'stop-color': '#e8f1dc', 'stop-opacity': 0 }, grad);
    const W0 = 400, W1 = 1520;
    const fg = K.svgEl('linearGradient', { id: 'v4d-wfade', gradientUnits: 'userSpaceOnUse', x1: W0, y1: 0, x2: W1, y2: 0 }, defs);
    [[0, 0], [0.12, 1], [0.88, 1], [1, 0]].forEach(([o, v]) => K.svgEl('stop', { offset: o, 'stop-color': '#fff', 'stop-opacity': v }, fg));
    const mask = K.svgEl('mask', { id: 'v4d-wmask', maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: 1920, height: 1080 }, defs);
    K.rect(mask, W0, 0, W1 - W0, 1080, { fill: 'url(#v4d-wfade)' });
    let wave = `M ${W0} ${WL}`;
    for (let x = W0; x < W1; x += 40) wave += ` Q ${x + 10} ${WL - 8} ${x + 20} ${WL} Q ${x + 30} ${WL + 8} ${x + 40} ${WL}`;
    const water = K.group(isvg, { mask: 'url(#v4d-wmask)' });
    K.path(water, `${wave} L ${W1} 950 L ${W0} 950 Z`, { fill: 'url(#v4d-water)', stroke: 'none' });
    const mass = K.group(isvg);
    K.path(mass, `M560 ${WL} L466 690 L512 836 L700 934 L1220 934 L1418 826 L1452 684 L1360 ${WL} Z`, { fill: '#d3e5bf', stroke: 'none' });
    K.path(mass, `M1110 ${WL} L1360 ${WL} L1452 684 L1418 826 L1220 934 L1180 934 L1330 760 Z`, { fill: '#c6dcaf', stroke: 'none' });
    const tip = K.group(isvg);
    K.path(tip, `M560 ${WL} L700 452 L790 430 L880 318 L960 288 L1040 330 L1150 420 L1250 470 L1360 ${WL} Z`, { fill: '#fbfdf8', stroke: '#a9cf86', 'stroke-width': 4 });
    K.path(tip, `M960 288 L1040 330 L1150 420 L1250 470 L1360 ${WL} L1080 ${WL} L1010 420 Z`, { fill: '#e4efd8', stroke: 'none' });
    const wlineG = K.group(isvg, { mask: 'url(#v4d-wmask)' });
    const wline = K.path(wlineG, wave, { stroke: C.green, 'stroke-width': 5, fill: 'none' });

    const t2 = cue(2);
    A.draw(tl, wline, t2 + 0.1, 1.0);
    A.in(tl, water, t2 + 0.4, 'fade', { dur: 0.8 });
    // the berg rises out of the water
    tl.fromTo([tip, mass], { opacity: 0, y: 70 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.12, ease: 'power3.out' }, t2 + 0.25);

    // four behaviors on the tip
    const tipBox = put(LB, 'v4d-tip', null, { x: 960, y: 376 });
    gsap.set(tipBox, { xPercent: -50 });
    const rowA = K.el('div', 'row'), rowB = K.el('div', 'row');
    tipBox.appendChild(rowA);
    tipBox.appendChild(rowB);
    const tags = ['Stare', 'Growl', 'Lunge', 'Bite'].map((s, k) => {
      const n = K.el('div', 'v4d-itag', s);
      (k === 0 ? rowA : rowB).appendChild(n);
      return n;
    });
    const tTip = Math.max(t2 + 1.1, sayAt(ctx, 2, 'the tip we see', 0.3));
    A.in(tl, tags, tTip, 'pop', { dur: 0.55, stagger: 0.14 });

    // four feelings below the waterline, each as it is named
    const emos = [
      ['Fear', 760, 626, 'fear'], ['Frustration', 1160, 626, 'frustration'],
      ['Excitement', 760, 770, 'excitement'], ['Conflict', 1160, 770, 'conflict'],
    ].map(([t, cx, y, w]) => ({ n: label(LB, t, cx, y, { cls: 'v4d-emo', w: 400 }), w }));
    let tE = tTip + 0.6;
    emos.forEach((e, i) => {
      tE = Math.max(tE + 0.3, sayAt(ctx, 2, e.w, 0.55 + i * 0.08, 0.25));
      A.in(tl, e.n, tE, 'fadeUp', { dur: 0.6 });
    });
    // arrow from the feelings up to the behaviors, with the takeaway beside it
    const RL = layer(stage);
    const asvg = K.svg(RL, { x: 0, y: 0, w: 1920, h: 1080 });
    const shaft = K.path(asvg, 'M1500 880 L1500 440', { stroke: C.greenDark, 'stroke-width': 6 });
    const head = K.path(asvg, 'M1478 464 L1500 440 L1522 464', { stroke: C.greenDark, 'stroke-width': 6 });
    const drive = put(RL, 'v4d-drive', 'Emotion<br>sits under<br>the behavior', { x: 1540, y: 580, w: 290 });
    const tDrv = clamp(sayAt(ctx, 2, 'below the waterline', 0.85), tE + 0.5, cue(3) - 1.6);
    A.draw(tl, shaft, tDrv, 0.7);
    A.in(tl, head, tDrv + 0.6, 'fade', { dur: 0.3 });
    A.in(tl, drive, tDrv + 0.2, 'fadeLeft', { dur: 0.6 });

    // ---------- beat 3: the iceberg shrinks aside; two "same" lines type on
    const t3 = cue(3);
    const S1 = 0.78, TX = 170 - 466 * S1, TY = 372 - 288 * S1;
    A.out(tl, RL, t3 - 0.25, 'fade', { dur: 0.4 });
    tl.to(LB, { x: TX, y: TY, scale: S1, duration: 1.0, ease: 'power3.inOut' }, t3 - 0.1);
    const mkSame = (y, a, b) => {
      const n = K.el('div', 'v4d-same');
      Object.assign(n.style, { left: '1050px', top: y + 'px' });
      const na = K.el('div', 'a', a), nb = K.el('div', 'b', b);
      n.appendChild(na);
      n.appendChild(nb);
      stage.appendChild(n);
      return { n, na, nb };
    };
    const s1 = mkSame(440, 'Same emotion,', 'different behaviors');
    const s2 = mkSame(660, 'Same behavior,', 'different emotions');
    const typeOn = (s, t) => {
      const chars = [...new SplitText(s.na, { type: 'chars' }).chars, ...new SplitText(s.nb, { type: 'chars' }).chars];
      tl.fromTo(s.n, { borderLeftColor: 'rgba(184,217,154,0)' }, { borderLeftColor: C.greenLight, duration: 0.4 }, t);
      tl.fromTo(chars, { opacity: 0 }, { opacity: 1, duration: 0.05, stagger: 0.035, ease: 'none' }, t + 0.1);
    };
    typeOn(s1, t3 + 0.7);
    typeOn(s2, clamp(sayAt(ctx, 3, 'the same behavior can', 0.8), t3 + 2.8, cue(4) - 1.4));

    // ---------- beat 4: a green frame draws around everything
    const t4 = cue(4);
    const fsvg = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const frame = K.rect(fsvg, 100, 300, 1720, 650, { rx: 30, fill: 'none', stroke: C.green, 'stroke-width': 6 });
    const legend = iconPill(stage, 'v4d-legend', 'eye', 'Look at the whole picture', { x: 960, y: 264 });
    gsap.set(legend, { xPercent: -50 });
    A.draw(tl, frame, t4 + 0.05, 1.5, { ease: 'power2.inOut' });
    tl.fromTo(legend, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.8)' }, clamp(sayAt(ctx, 4, 'we look at the whole', 0.7), t4 + 1.4, dur - 1.6));
    void dur;
  });

  // ================================================================== ch01s14 Why this response?
  registerScene('ch01s14', ctx => {
    const { stage, tl, cue, dur } = ctx;
    style(stage);

    // beat 0: photo card left, heading writes on beside it (centred), then rises for the bowl
    const ph = K.photo(stage, 'photo_why.jpg', { x: 100, y: 150, w: 580, h: 790, pos: '35% 50%' });
    A.in(tl, ph.root, Math.max(0, cue(0) - 0.4), 'fadeRight', { dur: 1.0 });
    A.kenburns(tl, ph.img, { from: 1.03, to: 1.12, t0: 0, t1: dur });
    const h = K.heading(stage, 'Why this response?', { x: 780, y: 170, w: 1040, size: 92 });
    gsap.set(h.root, { y: 270 });
    A.in(tl, h.title, cue(0) + 0.2, 'wipe', { dur: 1.1 });
    A.in(tl, h.bar, cue(0) + 1.0, 'grow', { dur: 0.6 });
    tl.fromTo(h.root, { y: 270 }, { y: 0, duration: 0.9, ease: 'power3.inOut', immediateRender: false }, cue(1) - 0.1);

    // beat 1: usually a mix. On "a recipe" the bowl appears; on "several ingredients" the blank chips pop up over it
    const mix = put(stage, 'v4d-mix', 'Usually a *mix*', { x: 780, y: 330 });
    A.in(tl, mix, Math.max(cue(1) + 0.9, sayAt(ctx, 1, 'almost never', 0.2)), 'fadeUp', { dur: 0.8 });
    const tBowl = clamp(sayAt(ctx, 1, 'like a recipe', 0.45, 0.4), cue(1) + 1.8, dur - 3.5);
    const tSeven = clamp(sayAt(ctx, 1, 'several ingredients', 0.6, 0.3), tBowl + 0.6, dur - 1.8);
    const B = makeBowl(stage, { cx: 1300, y: 745, s: 0.8, filled: 0 });
    A.in(tl, B.wrap, tBowl, 'fadeUp', { dur: 0.9 });
    tl.fromTo(B.slots.map(sl => sl.g), { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.5, stagger: 0.08, ease: 'back.out(2)' }, tSeven);
    bob(tl, B, tSeven + 0.8, dur);
  });

  // ================================================================== ch01s15 Nature and early life
  registerScene('ch01s15', ctx => {
    const { stage, tl, cue } = ctx;
    const { B } = sceneBase(ctx, 'Nature and early life', 0);

    // ---------- beat 0: genetics and temperament
    const cap0 = caption(stage, 0, STD.cx, CAP_Y);
    const land0 = dropIn(tl, B, 0, cue(0) - 0.1);
    A.in(tl, cap0, cue(0) + 0.35, 'fadeUp', { dur: 0.6 });

    const LA = layer(stage);
    const card = K.el('div', 'v4d-card');
    Object.assign(card.style, { left: '100px', top: '300px', width: '1000px', height: '240px' });
    LA.appendChild(card);
    const dna = badge(LA, 'dna', 204, 420, 128, ING[0].col, '#fff');
    const sens = put(LA, 'v4d-big', 'Some dogs are<br>born *sensitive*', { x: 310, y: 350 });
    A.in(tl, card, land0 - 0.3, 'fadeUp', { dur: 0.7 });
    A.in(tl, dna, land0 - 0.1, 'pop', { dur: 0.6 });
    A.in(tl, sens, land0, 'fadeUp', { dur: 0.7 });

    // tiny smoke alarm, blinking
    const asvg = K.svg(LA, { x: 830, y: 330, w: 250, h: 180 });
    const aBody = K.group(asvg);
    K.circle(aBody, 70, 90, 54, { fill: C.redPale, stroke: '#fff', 'stroke-width': 5 });
    svgIcon(aBody, 'alarm-smoke', 70, 92, 64, { stroke: C.red, 'stroke-width': 1.9 });
    const arcD = (r, span = 30) => {
      const a = (span * Math.PI) / 180;
      return `M${70 + r * Math.cos(-a)} ${90 + r * Math.sin(-a)} A${r} ${r} 0 0 1 ${70 + r * Math.cos(a)} ${90 + r * Math.sin(a)}`;
    };
    const arcs = [86, 116, 146].map((r, i) => K.path(asvg, arcD(r), { stroke: C.red, 'stroke-width': 8 - i * 1.5, opacity: 0 }));
    const tAl = Math.max(land0 + 0.6, phraseAt(ctx, 0, 'smoke alarm', 0.6) - 0.3);
    tl.fromTo(aBody, { opacity: 0, scale: 0.5, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2)' }, tAl);
    const blinkEnd = cue(1) - 0.4;
    const nBl = Math.max(2, Math.floor((blinkEnd - tAl - 0.5) / 0.9));
    tl.fromTo(arcs, { opacity: 0 }, { opacity: 1, duration: 0.18, stagger: 0.09, yoyo: true, repeat: nBl * 2 - 1, repeatDelay: 0.27, ease: 'power1.out' }, tAl + 0.5);
    tl.to(aBody, { rotation: 8, transformOrigin: '50% 50%', duration: 0.07, yoyo: true, repeat: 7, ease: 'sine.inOut' }, tAl + 0.5);

    // ---------- beat 1: breed traits. The photo returns; the guardian tag points at the Pyrenees
    A.out(tl, LA, cue(1) - 0.35, 'fadeUp', { dur: 0.45 });
    const LB = layer(stage);
    const ph = K.photo(LB, 'photo_why.jpg', { x: 100, y: 300, w: 420, h: 560, pos: '50% 50%' });
    A.in(tl, ph.root, cue(1) - 0.1, 'fadeRight', { dur: 0.9 });
    A.kenburns(tl, ph.img, { from: 1.02, to: 1.08, t0: cue(1) - 0.1, t1: cue(2) });
    const dice = put(LB, 'v4d-big', 'Breed loads the *dice*', { x: 580, y: 318 });
    A.in(tl, dice, cue(1) + 0.4, 'fadeUp', { dur: 0.8 });
    const mkT = (html, y, hi) => {
      const t = put(LB, 'v4d-ttag' + (hi ? ' hi' : ''), null, { x: 580, y });
      t.appendChild(K.el('span', null, K.md(html)));
      return t;
    };
    const tagH = mkT('**Herders:** chase', 452);
    const tagT = mkT('**Terriers:** hunt', 568);
    const tagG = mkT('**Guardians:** wary of strangers', 684, true);
    const psvg = K.svg(LB, { x: 0, y: 0, w: 1920, h: 1080 });
    const lead = K.path(psvg, 'M 578 721 C 530 721 510 640 466 632', { stroke: C.green, 'stroke-width': 5 });
    const pdot = K.circle(psvg, 460, 630, 13, { fill: C.green, stroke: '#fff', 'stroke-width': 5 });
    const tH = Math.max(cue(1) + 1.0, sayAt(ctx, 1, 'herders', 0.25));
    const tT = Math.max(tH + 0.7, sayAt(ctx, 1, 'terriers', 0.45));
    const tG = Math.max(tT + 0.7, sayAt(ctx, 1, 'guardians', 0.55));
    A.in(tl, tagH, tH, 'pop', { dur: 0.55 });
    A.in(tl, tagT, tT, 'pop', { dur: 0.55 });
    A.in(tl, tagG, tG, 'pop', { dur: 0.55 });
    A.draw(tl, lead, tG + 0.3, 0.5);
    A.in(tl, pdot, tG + 0.7, 'pop', { dur: 0.45 });
    tl.to(pdot, { scale: 1.35, transformOrigin: '50% 50%', duration: 0.3, yoyo: true, repeat: 1, ease: 'sine.inOut' }, tG + 1.2);

    // ---------- beat 2: the drive needs an outlet. Pressure fills toward red, outlets drain it to green
    tl.to(ph.root, { x: -140, opacity: 0, duration: 0.6, ease: 'power2.in' }, cue(2) - 0.35);
    A.out(tl, [dice, tagH, tagT, tagG, psvg], cue(2) - 0.35, 'fadeUp', { dur: 0.45 });
    const LC = layer(stage);
    const outl = put(LC, 'v4d-big', 'Give the drive an *outlet*', { x: 100, y: 318 });
    // a dial gauge: the coloured arc fills toward red, the needle follows
    const GX = 330, GY = 730, GR = 200;
    const gsvg = K.svg(LC, { x: 0, y: 0, w: 1920, h: 1080 });
    const gdefs = K.svgEl('defs', {}, gsvg);
    gdefs.innerHTML = `<linearGradient id="v4dgauge" gradientUnits="userSpaceOnUse" x1="${GX - GR}" y1="0" x2="${GX + GR}" y2="0"><stop offset="0" stop-color="#7fb24a"/><stop offset="0.45" stop-color="#c2b235"/><stop offset="0.72" stop-color="#d9912b"/><stop offset="1" stop-color="#b8452d"/></linearGradient>`;
    const gArc = `M ${GX - GR} ${GY} A ${GR} ${GR} 0 0 1 ${GX + GR} ${GY}`;
    const gTrack = K.path(gsvg, gArc, { stroke: '#e1e7d9', 'stroke-width': 46 });
    const gFill = K.path(gsvg, gArc, { stroke: 'url(#v4dgauge)', 'stroke-width': 46 });
    const needle = K.group(gsvg);
    K.path(needle, `M ${GX} ${GY} L ${GX - GR + 58} ${GY}`, { stroke: C.ink, 'stroke-width': 9 });
    K.circle(needle, GX, GY, 18, { fill: C.ink, stroke: '#fff', 'stroke-width': 5 });
    const plab = label(LC, 'Pressure', GX, GY + 36, { cls: 'v4d-sub', w: 360, size: 40, color: C.inkSoft });
    const owrap = K.el('div', null);
    Object.assign(owrap.style, { position: 'absolute', left: '660px', top: '484px', display: 'flex', flexDirection: 'column', gap: '22px', alignItems: 'flex-start' });
    LC.appendChild(owrap);
    const outs = [['feather', 'Flirt pole'], ['search', 'Sniff games'], ['move-horizontal', 'Tug']].map(([ic, t]) => iconPill(owrap, 'v4d-out', ic, t));
    const tO1 = Math.max(cue(2) + 2.2, sayAt(ctx, 2, 'flirt poles', 0.4));
    const tO2 = Math.max(tO1 + 0.6, sayAt(ctx, 2, 'sniffing games', 0.5));
    const tO3 = Math.max(tO2 + 0.6, sayAt(ctx, 2, 'or tug', 0.58));
    A.in(tl, outl, Math.max(cue(2) + 0.2, sayAt(ctx, 2, 'healthy outlet', 0.25) - 0.4), 'fadeUp', { dur: 0.8 });
    A.in(tl, [gTrack, gFill, needle, plab], cue(2) + 0.3, 'fadeUp', { dur: 0.6, stagger: 0.06 });
    const tFill = cue(2) + 0.6, dFill = Math.max(1.2, tO1 - 0.2 - tFill);
    tl.fromTo(gFill, { drawSVG: '0% 0.5%' }, { drawSVG: '0% 95%', duration: dFill, ease: 'power1.in' }, tFill);
    tl.fromTo(needle, { rotation: 1, svgOrigin: `${GX} ${GY}` }, { rotation: 171, duration: dFill, ease: 'power1.in' }, tFill);
    tl.to(plab, { color: C.red, duration: 0.4 }, tO1 - 0.6);
    tl.to(needle, { rotation: 165, svgOrigin: `${GX} ${GY}`, duration: 0.07, yoyo: true, repeat: 5, ease: 'none' }, tO1 - 0.3);
    A.in(tl, outs[0], tO1, 'fadeRight', { dur: 0.55 });
    A.in(tl, outs[1], tO2, 'fadeRight', { dur: 0.55 });
    A.in(tl, outs[2], tO3, 'fadeRight', { dur: 0.55 });
    const tDrain = tO3 + 0.5;
    tl.to(gFill, { drawSVG: '0% 16%', duration: 1.8, ease: 'power2.inOut' }, tDrain);
    tl.to(needle, { rotation: 29, svgOrigin: `${GX} ${GY}`, duration: 1.8, ease: 'power2.inOut' }, tDrain);
    tl.to(plab, { color: C.green, duration: 0.6 }, tDrain + 0.8);

    // ---------- beat 3: socialization, the early window
    A.out(tl, LC, cue(3) - 0.35, 'fadeUp', { dur: 0.45 });
    A.out(tl, cap0, cue(3) - 0.2, 'fade', { dur: 0.35 });
    const cap1 = caption(stage, 1, STD.cx, CAP_Y);
    dropIn(tl, B, 1, cue(3) - 0.1);
    A.in(tl, cap1, cue(3) + 0.35, 'fadeUp', { dur: 0.6 });

    const LD = layer(stage);
    const TX0 = 130, TX1 = 1060, TW = TX1 - TX0, WIN = TX0 + TW / 2; // track shows birth to six months
    const tsvg = K.svg(LD, { x: 0, y: 0, w: 1920, h: 1080 });
    const TY = 376, TH = 64;
    const ttrack = K.rect(tsvg, TX0, TY, TW, TH, { rx: 32, fill: '#e1e7d9' });
    const win = K.rect(tsvg, TX0, TY, WIN - TX0, TH, { rx: 32, fill: C.green });
    const shine = K.rect(tsvg, TX0, TY, WIN - TX0, TH, { rx: 32, fill: '#ffffff', opacity: 0 });
    // everyday things the puppy meets and files under "normal"
    const WI = ['dog', 'bus', 'person-standing', 'umbrella', 'bike'];
    const wx = i => TX0 + ((WIN - TX0) * (i + 0.5)) / WI.length;
    const wIcons = WI.map((n, i) => svgIcon(tsvg, n, wx(i), TY + TH / 2, 38, { stroke: '#fff', 'stroke-width': 2.2 }));
    const brk = K.path(tsvg, `M ${TX0 + 2} 364 V 352 H ${WIN - 2} V 364`, { stroke: C.green, 'stroke-width': 4 });
    const wlab = put(LD, 'v4d-sub', 'Roughly the first three months', { x: TX0, y: 290, size: 42 });
    const ticks = [
      put(LD, 'v4d-lab', 'Birth', { x: TX0, y: 454 }),
      label(LD, '3 months', WIN, 454, { w: 240 }),
      put(LD, 'v4d-lab', '6 months', { x: TX1 - 300, y: 454, w: 300, align: 'right' }),
    ];
    A.in(tl, ttrack, cue(3) + 0.3, 'grow', { dur: 0.8 });
    A.in(tl, ticks, cue(3) + 0.7, 'fade', { dur: 0.5, stagger: 0.1 });
    const tWin = Math.max(cue(3) + 1.1, sayAt(ctx, 3, 'roughly the first', 0.2));
    A.in(tl, win, tWin - 0.2, 'grow', { dur: 0.8 });
    A.draw(tl, brk, tWin + 0.2, 0.6);
    A.in(tl, wlab, tWin + 0.2, 'fadeUp', { dur: 0.7 });
    const tSort = Math.max(tWin + 1.0, sayAt(ctx, 3, 'sorts the world', 0.35));
    tl.fromTo(wIcons, { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.28, ease: 'back.out(2)' }, tSort);
    const tLight = Math.max(tSort + 1.8, sayAt(ctx, 3, 'feel normal', 0.8));
    tl.fromTo(shine, { opacity: 0 }, { opacity: 0.4, duration: 0.35, yoyo: true, repeat: 3, ease: 'sine.inOut' }, tLight);

    // ---------- beat 4: gaps in the window; too little
    const GAP = [1, 2, 4];
    const gaps = GAP.map(i => K.rect(tsvg, wx(i) - 24, TY, 48, TH, { fill: '#e1e7d9' }));
    tl.to(GAP.map(i => wIcons[i]), { opacity: 0, y: 26, duration: 0.4, stagger: 0.12, ease: 'power2.in' }, cue(4) - 0.2);
    const mkRow = (icon, html, y, bg, fg) => {
      const r = K.el('div', 'v4d-row');
      Object.assign(r.style, { left: '100px', top: y + 'px', width: '1000px' });
      const ic = K.el('div', 'ic');
      Object.assign(ic.style, { background: bg, color: fg });
      ic.appendChild(K.icon(icon));
      r.appendChild(ic);
      r.appendChild(K.el('span', null, K.md(html)));
      LD.appendChild(r);
      return r;
    };
    const row1 = mkRow('door-closed', 'Too little', 520, '#eceee8', C.inkSoft);
    const row2 = mkRow('triangle-alert', 'Too much, too fast', 636, C.amberPale, C.amber);
    const row3 = mkRow('party-popper', 'Everyone is a party', 752, C.pale, C.green);
    tl.fromTo(gaps, { scaleY: 0, transformOrigin: '50% 50%' }, { scaleY: 1, duration: 0.45, stagger: 0.12, ease: 'power2.out' }, cue(4));
    A.in(tl, row1, cue(4) + 0.2, 'fadeDown', { dur: 0.7 });
    // ---------- beats 5 and 6
    A.in(tl, row2, cue(5) - 0.1, 'fadeDown', { dur: 0.7 });
    A.in(tl, row3, cue(6) - 0.1, 'fadeDown', { dur: 0.7 });

    // leash mini-diagram inside row 3: person, leash, dog. The leash pulls tight.
    const lsvg = K.svgEl('svg', { viewBox: '0 0 400 96', width: 400, height: 96 });
    Object.assign(lsvg.style, { position: 'absolute', left: '580px', top: '0px', overflow: 'visible' });
    row3.appendChild(lsvg);
    svgIcon(lsvg, 'user', 34, 48, 50, { stroke: C.inkSoft, 'stroke-width': 2.2 });
    const SLACK = 'M 62 54 Q 170 100 272 50', TAUT = 'M 62 54 Q 170 52 272 50';
    const leash = K.path(lsvg, SLACK, { stroke: '#8a6d3b', 'stroke-width': 6 });
    const dogG = K.group(lsvg);
    svgIcon(dogG, 'dog', 304, 48, 54, { stroke: C.ink, 'stroke-width': 2.2 });
    const chev = [K.path(lsvg, 'M 342 34 L 356 48 L 342 62', { stroke: C.red, 'stroke-width': 5 }), K.path(lsvg, 'M 362 34 L 376 48 L 362 62', { stroke: C.red, 'stroke-width': 5 })];
    const tTaut = Math.max(cue(6) + 1.2, sayAt(ctx, 6, 'leash says no', 0.45, 0.2));
    tl.to(leash, { attr: { d: TAUT, stroke: C.red }, duration: 0.35, ease: 'power3.in' }, tTaut);
    tl.fromTo(dogG, { x: 0 }, { x: 8, duration: 0.35, ease: 'power3.in' }, tTaut);
    tl.to(dogG, { x: 4, duration: 0.08, yoyo: true, repeat: 9, ease: 'sine.inOut' }, tTaut + 0.4);
    tl.fromTo(chev, { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: 0.4, stagger: 0.12 }, tTaut + 0.3);
  });

  // ================================================================== ch01s16 Age
  registerScene('ch01s16', ctx => {
    const { stage, tl, cue } = ctx;
    const { B } = sceneBase(ctx, 'Age', 2, 84);

    // ---------- beat 0: age drops in, the bowl shifts left, then the life-stage ruler draws beneath it
    dropIn(tl, B, 2, cue(0) - 0.1);
    const NB = { cx: 340, y: 398, s: 0.5 };
    const tShift = cue(0) + 0.6;
    tl.to(B.wrap, { x: NB.cx - STD.cx, y: NB.y - STD.y, scale: NB.s / STD.s, duration: 1.0, ease: 'power3.inOut' }, tShift);
    const cap = caption(stage, 2, 600, 262, { left: true });
    A.in(tl, cap, tShift + 0.8, 'fadeUp', { dur: 0.6 });

    const X = m => 200 + m * 31; // months to x (birth to three years), then a break, then senior years
    const AX = 740;
    const rsvg = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const axis1 = K.line(rsvg, 180, AX, X(36) + 26, AX, { stroke: '#b9c4ab', 'stroke-width': 6 });
    const axis2 = K.path(rsvg, `M ${X(36) + 66} ${AX} H 1770`, { stroke: '#b9c4ab', 'stroke-width': 6 });
    const brk = [K.line(rsvg, X(36) + 30, AX + 16, X(36) + 42, AX - 16, { stroke: '#b9c4ab', 'stroke-width': 5 }), K.line(rsvg, X(36) + 50, AX + 16, X(36) + 62, AX - 16, { stroke: '#b9c4ab', 'stroke-width': 5 })];
    const arrowHead = K.path(rsvg, `M 1756 ${AX - 14} L 1776 ${AX} L 1756 ${AX + 14}`, { stroke: '#b9c4ab', 'stroke-width': 5 });
    const tickMarks = [0, 6, 12, 18, 24, 36].map(m => K.line(rsvg, X(m), AX - 12, X(m), AX + 12, { stroke: '#9aa98a', 'stroke-width': 4 }));
    const tickLabs = [['Birth', 0], ['6 months', 6], ['1 year', 12], ['18 months', 18], ['2 years', 24], ['3 years', 36]].map(([t, m]) => label(stage, t, X(m), AX + 20, { w: 200 }));
    const tAx = Math.max(tShift + 0.8, sayAt(ctx, 0, 'adolescence runs', 0.18, 0.2));
    A.draw(tl, [axis1], tAx, 0.9);
    A.draw(tl, [...brk, axis2, arrowHead], tAx + 0.7, 0.5, { stagger: 0.08 });
    A.in(tl, [...tickMarks], tAx + 0.3, 'fade', { dur: 0.3, stagger: 0.07 });
    A.in(tl, tickLabs, tAx + 0.4, 'fadeUp', { dur: 0.5, stagger: 0.07 });

    const mkBand = (html, m0, m1, y, bg, bd, fg) => {
      const b = K.el('div', 'v4d-band', K.md(html));
      Object.assign(b.style, { left: X(m0) + 'px', top: y + 'px', width: X(m1) - X(m0) + 'px', background: bg, borderColor: bd, color: fg });
      stage.appendChild(b);
      return b;
    };
    const adol = mkBand('Adolescence', 6, 18, 534, C.pale, C.green, C.greenDeep);
    const ext = K.el('div', 'v4d-band', 'Big breeds');
    Object.assign(ext.style, { left: X(18) - 24 + 'px', top: '534px', width: X(24) - X(18) + 24 + 'px', background: 'transparent', borderColor: C.green, borderStyle: 'dashed', borderLeft: 'none', borderRadius: '0 22px 22px 0', zIndex: 0,
      justifyContent: 'center', padding: '0 0 0 24px', font: '600 28px/1 var(--font-body)', color: C.greenDark });
    stage.insertBefore(ext, adol);
    const social = mkBand('Social maturity', 12, 36, 628, C.amberPale, C.amber, '#8a5410');

    const CX = 600, CY = 348;
    const call1 = callout(stage, CX, CY, 'Adolescence:', 'about 6 to 18 months', C.green);
    const tAd = tAx + 0.9;
    A.in(tl, adol, tAd, 'wipe', { dur: 0.8 });
    A.in(tl, call1, tAd + 0.15, 'fadeUp', { dur: 0.8 });
    A.in(tl, ext, Math.max(tAd + 1.2, sayAt(ctx, 0, 'up to two years', 0.6, 0.2)), 'wipe', { dur: 0.7 });

    // ---------- beat 1: social maturity, and the volume turns up
    const call2 = callout(stage, CX, CY, 'Social maturity:', 'about 1 to 3 years', C.amberText);
    A.out(tl, call1, cue(1) - 0.3, 'fadeUp', { dur: 0.4 });
    A.in(tl, social, cue(1) - 0.1, 'wipe', { dur: 0.9 });
    A.in(tl, call2, cue(1) + 0.2, 'fadeUp', { dur: 0.8 });
    const vol = K.el('div', 'v4d-badge');
    Object.assign(vol.style, { left: '1080px', top: '532px', width: '84px', height: '84px', background: C.amberPale, color: C.amber, border: '4px solid #fff', boxShadow: 'var(--shadow-soft)' });
    const vIcons = ['volume', 'volume-1', 'volume-2'].map((n, i) => {
      const ic = K.icon(n);
      Object.assign(ic.style, { position: 'absolute', left: '50%', top: '50%', width: '48px', height: '48px', marginLeft: '-24px', marginTop: '-24px', opacity: i ? 0 : 1 });
      vol.appendChild(ic);
      return ic;
    });
    stage.appendChild(vol);
    const tVol = Math.max(cue(1) + 1.6, sayAt(ctx, 1, 'gets louder', 0.9, 0.4));
    A.in(tl, vol, Math.max(cue(1) + 0.8, Math.min(tVol - 0.8, sayAt(ctx, 1, 'reactivity or aggression', 0.6))), 'pop', { dur: 0.6 });
    tl.to(vIcons[0], { opacity: 0, duration: 0.2 }, tVol);
    tl.to(vIcons[1], { opacity: 1, duration: 0.2 }, tVol);
    tl.to(vIcons[1], { opacity: 0, duration: 0.2 }, tVol + 0.45);
    tl.to(vIcons[2], { opacity: 1, duration: 0.2 }, tVol + 0.45);
    tl.to(vol, { background: C.amber, color: '#fff', duration: 0.4 }, tVol + 0.45);
    A.pulse(tl, social, tVol + 0.5, { scale: 1.04 });
    A.pulse(tl, vol, tVol + 0.5, { scale: 1.15 });

    // ---------- beat 2: more selective with age. Teen at the club, adult with a few close friends
    const call3 = callout(stage, CX, CY, 'More selective', 'with age', C.greenDark);
    A.out(tl, call2, cue(2) - 0.3, 'fadeUp', { dur: 0.4 });
    A.in(tl, call3, cue(2) + 0.1, 'fadeUp', { dur: 0.8 });
    const CARD_Y = 812, CARD_H = 146;
    const mkLife = (x, w, icon, bg, fg, name, dots) => {
      const c = K.el('div', 'v4d-life');
      Object.assign(c.style, { left: x + 'px', top: CARD_Y + 'px', width: w + 'px', height: CARD_H + 'px' });
      const ib = K.el('div', 'ib');
      Object.assign(ib.style, { background: bg, color: fg });
      ib.appendChild(K.icon(icon));
      c.appendChild(ib);
      c.appendChild(K.el('div', 'nm', name));
      const ds = K.svgEl('svg', { viewBox: '0 0 150 100', width: 150, height: 100 }, c);
      ds.style.marginLeft = 'auto';
      const pts = dots.map(([dx, dy, col]) => K.circle(ds, dx, dy, 11, { fill: col }));
      stage.appendChild(c);
      return { c, pts };
    };
    const CROWD = [[20, 28, '#9dbb3f'], [48, 18, '#d9912b'], [78, 30, '#619537'], [108, 16, '#c2b235'], [132, 36, '#8fb03a'],
      [30, 58, '#619537'], [60, 50, '#cf6a2c'], [92, 62, '#9dbb3f'], [120, 66, '#d9912b'], [16, 84, '#c2b235'],
      [46, 84, '#8fb03a'], [76, 88, '#619537'], [106, 90, '#9dbb3f'], [136, 84, '#cf6a2c']];
    const teen = mkLife(100, 390, 'party-popper', C.amberPale, C.amber, 'Teen', CROWD);
    const adult = mkLife(520, 390, 'coffee', C.pale, C.greenDark, 'Adult', [[40, 50, '#619537'], [75, 50, '#9dbb3f'], [110, 50, '#8fb03a']]);
    const tTeen = Math.max(cue(2) + 1.2, sayAt(ctx, 2, 'like a teenager', 0.3));
    const tAdult = Math.max(tTeen + 1.5, sayAt(ctx, 2, 'as an adult', 0.65));
    A.in(tl, teen.c, tTeen, 'fadeUp', { dur: 0.7 });
    tl.fromTo(teen.pts, { opacity: 0, scale: 0, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.3, stagger: 0.05, ease: 'back.out(2.5)' }, tTeen + 0.5);
    A.in(tl, adult.c, tAdult, 'fadeUp', { dur: 0.7 });
    tl.fromTo(adult.pts, { opacity: 0, scale: 0, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.35, stagger: 0.15, ease: 'back.out(2.5)' }, tAdult + 0.5);

    // ---------- beat 3: normal, not a problem. The dog park card
    const call4 = callout(stage, CX, CY, 'Normal,', 'not a problem', C.green);
    A.out(tl, call3, cue(3) - 0.3, 'fadeUp', { dur: 0.4 });
    A.in(tl, call4, cue(3) + 0.1, 'fadeUp', { dur: 0.8 });
    const park = K.el('div', 'v4d-park');
    Object.assign(park.style, { left: '940px', top: CARD_Y + 'px', width: '880px', height: CARD_H + 'px', justifyContent: 'center', gap: '40px' });
    const pib = K.el('div', 'ib');
    pib.appendChild(K.icon('trees'));
    park.appendChild(pib);
    const pcol = K.el('div', 'col');
    const mkLn = (html, icon, bg, fg) => {
      const l = K.el('div', 'ln');
      l.appendChild(K.el('span', null, K.md(html)));
      const mk = K.el('div', 'mk');
      Object.assign(mk.style, { background: bg, color: fg });
      mk.appendChild(K.icon(icon));
      l.appendChild(mk);
      pcol.appendChild(l);
      return { l, mk };
    };
    const ln1 = mkLn('**Age 1:** loved it', 'check', C.green, '#fff');
    const ln2 = mkLn('**Age 3:** not anymore', 'triangle-alert', C.amber, '#fff');
    park.appendChild(pcol);
    stage.appendChild(park);
    const tPark = Math.max(cue(3) + 1.2, sayAt(ctx, 3, 'loved the dog park', 0.45, 0.6));
    const tNo = Math.max(tPark + 1.2, sayAt(ctx, 3, 'at three', 0.72));
    A.in(tl, park, tPark, 'fadeUp', { dur: 0.7 });
    A.in(tl, ln1.l, tPark + 0.3, 'fadeRight', { dur: 0.6 });
    A.in(tl, ln1.mk, tPark + 0.7, 'pop', { dur: 0.5 });
    A.in(tl, ln2.l, tNo, 'fadeRight', { dur: 0.6 });
    A.in(tl, ln2.mk, tNo + 0.4, 'pop', { dur: 0.5 });

    // ---------- beat 4: senior years
    const pin = K.line(rsvg, 1600, AX, 1600, 670, { stroke: C.olive, 'stroke-width': 5 });
    const pinDot = K.circle(rsvg, 1600, AX, 13, { fill: C.olive, stroke: '#fff', 'stroke-width': 4 });
    const clock = badge(stage, 'clock', 1600, 624, 88, C.olive, '#fff');
    const sen = label(stage, 'Senior', 1600, 520, { cls: 'v4d-sub', w: 300, color: C.olive });
    const call5 = callout(stage, CX, CY, 'Senior changes', 'Sore joints, fading senses', C.olive);
    A.out(tl, call4, cue(4) - 0.3, 'fadeUp', { dur: 0.4 });
    A.in(tl, pinDot, cue(4) - 0.1, 'pop', { dur: 0.5 });
    A.draw(tl, pin, cue(4) + 0.1, 0.5);
    A.in(tl, clock, cue(4) + 0.4, 'pop', { dur: 0.6 });
    A.in(tl, sen, cue(4) + 0.6, 'fadeUp', { dur: 0.6 });
    A.in(tl, call5, cue(4) + 0.3, 'fadeUp', { dur: 0.8 });
    tl.fromTo(clock, { boxShadow: '0 0 0 0px rgba(75,90,30,0.35)' }, { boxShadow: '0 0 0 18px rgba(75,90,30,0)', duration: 1.0, ease: 'power2.out', immediateRender: false }, cue(4) + 1.0);
    A.pulse(tl, clock, cue(4) + 1.4, { scale: 1.12 });
  });

  // ================================================================== ch01s17 Past experiences and tools
  registerScene('ch01s17', ctx => {
    const { stage, tl, cue } = ctx;
    const { B } = sceneBase(ctx, 'Past experiences and tools', 3, 76);

    // ---------- beat 0: one bad moment
    const cap3 = caption(stage, 3, STD.cx, CAP_Y);
    dropIn(tl, B, 3, cue(0) - 0.1);
    A.in(tl, cap3, cue(0) + 0.35, 'fadeUp', { dur: 0.6 });

    const LA = layer(stage);
    const title = put(LA, 'v4d-big', 'One bad moment can be *enough*', { x: 100, y: 320 });
    A.in(tl, title, cue(0) + 0.5, 'fadeUp', { dur: 0.8 });
    const SY = 420;
    const tsvg = K.svg(LA, { x: 100, y: SY, w: 1000, h: 380 });
    const LY = 250, SX = 420;
    const base = K.line(tsvg, 40, LY, 960, LY, { stroke: '#d3dbc9', 'stroke-width': 8 });
    const after = K.line(tsvg, SX, LY, 960, LY, { stroke: C.amber, 'stroke-width': 8, opacity: 0.85 });
    const dots = [];
    for (let x = 70; x <= 930; x += 70) dots.push({ x, c: K.circle(tsvg, x, LY, 11, { fill: '#9dbb3f', stroke: '#fff', 'stroke-width': 3 }) });
    const hit = K.circle(tsvg, SX, LY, 22, { fill: C.red, stroke: '#fff', 'stroke-width': 5 });
    const rays = [-180, -150, -120, -90, -60, -30, 0].map(a => {
      const r = (a * Math.PI) / 180;
      return K.line(tsvg, SX + 34 * Math.cos(r), LY + 34 * Math.sin(r), SX + 62 * Math.cos(r), LY + 62 * Math.sin(r), { stroke: C.amber, 'stroke-width': 6 });
    });
    const bolt = K.group(tsvg);
    svgIcon(bolt, 'zap', SX, 128, 132, { fill: C.amber, stroke: '#b36b12', 'stroke-width': 1.2 });
    const bad = label(LA, 'One bad moment', 100 + SX, SY + LY + 44, { cls: 'v4d-sub', w: 460, color: C.red, size: 38 });
    A.draw(tl, base, cue(0) + 0.8, 0.9);
    tl.fromTo(dots.map(d => d.c), { opacity: 0, scale: 0.3, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.35, stagger: 0.05, ease: 'back.out(2)' }, cue(0) + 1.0);
    const tStrike = Math.max(cue(0) + 2.0, sayAt(ctx, 0, 'one scary moment', 0.3, 0.2));
    tl.fromTo(bolt, { opacity: 0, y: -110 }, { opacity: 1, y: 0, duration: 0.28, ease: 'power4.in' }, tStrike);
    tl.fromTo(hit, { opacity: 0, scale: 0.2, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(3)' }, tStrike + 0.26);
    tl.fromTo(rays, { opacity: 0, drawSVG: '0% 0%' }, { opacity: 1, drawSVG: '0% 100%', duration: 0.3, ease: 'power2.out' }, tStrike + 0.26);
    tl.to(rays, { opacity: 0, duration: 0.5 }, tStrike + 0.9);
    A.in(tl, bad, tStrike + 0.5, 'fadeUp', { dur: 0.6 });
    // "may never forget it": everything after that moment stays tinted
    const tMem = Math.max(tStrike + 1.2, sayAt(ctx, 0, 'never forget', 0.7));
    A.draw(tl, after, tMem, 1.2);
    dots.filter(d => d.x > SX).forEach((d, i) => tl.to(d.c, { attr: { fill: C.amber }, duration: 0.3 }, tMem + 0.15 + i * 0.13));

    // ---------- beat 1: the tools
    A.out(tl, LA, cue(1) - 0.35, 'fadeUp', { dur: 0.45 });
    A.out(tl, cap3, cue(1) - 0.2, 'fade', { dur: 0.35 });
    const cap4 = caption(stage, 4, STD.cx, CAP_Y);
    dropIn(tl, B, 4, cue(1) - 0.1);
    A.in(tl, cap4, cue(1) + 0.35, 'fadeUp', { dur: 0.6 });

    const LB = layer(stage);
    const t2 = put(LB, 'v4d-big', 'Harsh tools, !!more fear!!', { x: 100, y: 320 });
    const wrapT = K.el('div', 'v4d-wrap');
    Object.assign(wrapT.style, { left: '100px', top: '450px', width: '980px', gap: '26px 24px' });
    LB.appendChild(wrapT);
    const tags = ['Leash pops', 'Prong and choke collars', 'Shock collars', 'Alpha rolls'].map(t => {
      const n = K.el('div', 'v4d-red', t);
      wrapT.appendChild(n);
      return n;
    });
    A.in(tl, t2, cue(1) + 0.4, 'fadeUp', { dur: 0.8 });
    let tPrev = cue(1) + 1.2;
    ['leash jerks', 'prong', 'shock', 'pinning'].forEach((w, i) => {
      tPrev = Math.max(tPrev + 0.35, sayAt(ctx, 1, w, 0.65 + i * 0.08, 0.25));
      A.in(tl, tags[i], tPrev, 'pop', { dur: 0.55 });
    });

    // ---------- beat 2: the equation. Other dog + pain = fear
    A.out(tl, LB, cue(2) - 0.3, 'fadeUp', { dur: 0.45 });
    const LC = layer(stage);
    const t3 = put(LC, 'v4d-big', 'Other dogs predict *pain*', { x: 100, y: 320 });
    const EY = 540, xs = [230, 600, 970];
    const eq = [
      badge(LC, 'dog', xs[0], EY, 160, C.pale, C.greenDark),
      badge(LC, 'zap', xs[1], EY, 160, C.amberPale, C.amber),
      badge(LC, 'triangle-alert', xs[2], EY, 160, C.redPale, C.red),
    ];
    const signs = [put(LC, 'v4d-sign', '+', { x: (xs[0] + xs[1]) / 2 - 40, y: EY - 38 }), put(LC, 'v4d-sign', '=', { x: (xs[1] + xs[2]) / 2 - 40, y: EY - 38 })];
    const eqLabs = ['Another dog', 'Pain', 'Fear'].map((t, i) => label(LC, t, xs[i], EY + 102, { cls: 'v4d-eqlab', w: 260 }));
    A.in(tl, t3, cue(2) + 0.2, 'fadeUp', { dur: 0.8 });
    const tDog = Math.max(cue(2) + 0.6, sayAt(ctx, 2, 'feels pain', 0.2, 0.4));
    const tPain = tDog + 0.45;
    const tFear = Math.max(tPain + 0.8, sayAt(ctx, 2, 'predict pain', 0.45, 0.2));
    A.in(tl, [eq[0], eqLabs[0]], tDog, 'pop', { dur: 0.6, stagger: 0.1 });
    A.in(tl, [signs[0], eq[1], eqLabs[1]], tPain, 'pop', { dur: 0.6, stagger: 0.12 });
    A.in(tl, [signs[1], eq[2], eqLabs[2]], tFear, 'pop', { dur: 0.6, stagger: 0.12 });
    A.pulse(tl, eq[2], Math.max(tFear + 1, phraseAt(ctx, 2, 'fear grows', 0.7)), { scale: 1.14 });

    // ---------- beat 3: not dominance, big feelings. The crown over the bowl is crossed out
    tl.to(LC, { opacity: 0, filter: 'blur(8px)', duration: 0.9, ease: 'power2.inOut' }, cue(3) - 0.2);
    const LD = layer(stage);
    const t4 = put(LD, 'v4d-big', 'Not dominance. *Big feelings.*', { x: 100, y: 320 });
    const HX = STD.cx, HY = STD.y - 400 * STD.s; // just above the bowl, inside the ring of chips
    const CR = layer(stage);
    const crown = badge(CR, 'crown', HX, HY, 130, '#eceee8', C.inkSoft);
    crown.style.border = '4px solid #fff';
    crown.style.boxShadow = 'var(--shadow-soft)';
    const boss = put(CR, 'v4d-eqlab', 'Boss?', { x: HX + 80, y: HY - 20, w: 140 });
    boss.style.textAlign = 'left';
    boss.style.fontSize = '36px';
    const xsvg = K.svg(stage, { x: HX - 65, y: HY - 65, w: 130, h: 130 });
    const xl = [K.line(xsvg, 26, 26, 104, 104, { stroke: C.red, 'stroke-width': 12 }), K.line(xsvg, 104, 26, 26, 104, { stroke: C.red, 'stroke-width': 12 })];
    const feel = [['Scared', 'frown'], ['Frustrated', 'annoyed'], ['Overwhelmed', 'tornado'], ['Protecting', 'shield']].map(([t, ic], i) => {
      const n = iconPill(LD, 'v4d-tag', ic, t, { x: 100 + (i % 2) * 470, y: 440 + Math.floor(i / 2) * 110 });
      return n;
    });
    A.in(tl, t4, cue(3) + 0.4, 'fadeUp', { dur: 0.8 });
    const tCrown = Math.max(cue(3) + 0.9, sayAt(ctx, 3, 'outdated idea', 0.2, 0.2));
    A.in(tl, crown, tCrown, 'pop', { dur: 0.6 });
    A.in(tl, boss, Math.max(tCrown + 0.4, sayAt(ctx, 3, 'be the boss', 0.35)), 'fadeRight', { dur: 0.5 });
    const tX = Math.max(tCrown + 1.2, sayAt(ctx, 3, 'after rank', 0.6, 0.4));
    A.draw(tl, xl, tX, 0.35, { stagger: 0.18 });
    let tF = tX + 0.4;
    ['scared', 'frustrated', 'overwhelmed', 'protecting'].forEach((w, i) => {
      tF = Math.max(tF + 0.35, sayAt(ctx, 3, w, 0.75 + i * 0.06, 0.35));
      A.in(tl, feel[i], tF, 'fadeRight', { dur: 0.6 });
      if (i === 0) tl.to(CR, { opacity: 0.45, duration: 0.5 }, tF);
    });

    // ---------- beat 4: be kind to yourself. Crown and tags fade, a green heart pulses over the bowl
    A.out(tl, [LD, CR, xsvg], cue(4) - 0.1, 'fade', { dur: 0.5 });
    const LE = layer(stage);
    const kind = put(LE, 'v4d-best', 'Be kind to yourself', { x: 100, y: 420 });
    const ul = K.el('div', 'accent-bar');
    Object.assign(ul.style, { left: '104px', top: '548px', width: '160px' });
    LE.appendChild(ul);
    const tKind = Math.max(cue(4) + 0.5, sayAt(ctx, 4, 'be kind to yourself', 0.2, 0.4));
    A.in(tl, kind, tKind, 'fadeUp', { dur: 0.9 });
    A.in(tl, ul, tKind + 0.5, 'grow', { dur: 0.6 });
    const ring = K.el('div', 'v4d-heart');
    Object.assign(ring.style, { left: HX - 70 + 'px', top: HY - 70 + 'px', width: '140px', height: '140px', borderRadius: '50%', border: '5px solid ' + C.greenLight, opacity: 0 });
    stage.appendChild(ring);
    const heart = K.el('div', 'v4d-heart');
    Object.assign(heart.style, { left: HX - 56 + 'px', top: HY - 56 + 'px', width: '112px', height: '112px' });
    heart.appendChild(K.icon('heart', { size: 112, stroke: 1.6, color: C.green }));
    heart.firstChild.setAttribute('fill', C.green);
    stage.appendChild(heart);
    const tH = cue(4) + 0.3;
    A.in(tl, heart, tH, 'pop', { dur: 0.6 });
    tl.to(heart, { scale: 1.25, duration: 0.28, ease: 'power2.out', yoyo: true, repeat: 1 }, tH + 0.75);
    tl.fromTo(ring, { opacity: 0.9, scale: 0.7 }, { opacity: 0, scale: 1.6, duration: 1.0, ease: 'power2.out', immediateRender: false }, tH + 0.8);
    tl.to(B.glow, { opacity: 0.55, duration: 1.0 }, tH + 0.8);
  });

  // ================================================================== ch01s18 Frustration, pain and the mix
  registerScene('ch01s18', ctx => {
    const { stage, tl, cue, dur } = ctx;
    const { h, B } = sceneBase(ctx, 'Frustration, pain and the mix', 5, 76);
    h.root.style.zIndex = 3; // stays crisp above the bowl's glow

    // ---------- beat 0: leash and barrier frustration
    const cap5 = caption(stage, 5, STD.cx, CAP_Y);
    dropIn(tl, B, 5, cue(0) - 0.1);
    A.in(tl, cap5, cue(0) + 0.35, 'fadeUp', { dur: 0.6 });

    const ph = K.photo(stage, 'photo_reactive_to_aggressive.jpg', { x: 100, y: 290, w: 440, h: 650, pos: '45% 40%' });
    A.in(tl, ph.root, cue(0) + 0.1, 'fadeRight', { dur: 1.0 });
    A.kenburns(tl, ph.img, { from: 1.04, to: 1.12, t0: 0, t1: cue(1) + 1 });
    const LA = layer(stage);
    const held = put(LA, 'v4d-big', 'Held back by a<br>*leash* or *barrier*', { x: 600, y: 330, w: 540 });
    A.in(tl, held, cue(0) + 0.6, 'fadeUp', { dur: 0.8 });
    // the pressure climbs while the dog can see but not reach
    const plab = put(LA, 'v4d-sub', 'Pressure', { x: 600, y: 520, size: 38, color: C.inkSoft });
    const msvg = K.svg(LA, { x: 600, y: 590, w: 500, h: 60 });
    const mdefs = K.svgEl('defs', {}, msvg);
    mdefs.innerHTML = `<linearGradient id="v4dpress2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7fb24a"/><stop offset="0.45" stop-color="#c2b235"/><stop offset="0.72" stop-color="#d9912b"/><stop offset="1" stop-color="#b8452d"/></linearGradient>`;
    K.rect(msvg, 0, 8, 480, 44, { rx: 22, fill: '#e1e7d9' });
    const fill = K.rect(msvg, 0, 8, 480, 44, { rx: 22, fill: 'url(#v4dpress2)' });
    const tP = Math.max(cue(0) + 1.8, sayAt(ctx, 0, 'the pressure climbs', 0.6, 0.6));
    A.in(tl, [plab, msvg], Math.min(tP - 0.6, Math.max(cue(0) + 1.1, sayAt(ctx, 0, 'traffic jam', 0.4))), 'fadeUp', { dur: 0.7, stagger: 0.12 });
    const dP = Math.max(1.2, Math.min(3.2, cue(1) - 0.7 - tP));
    tl.fromTo(fill, { clipPath: 'inset(0% 100% 0% 0% round 22px)' }, { clipPath: 'inset(0% 6% 0% 0% round 22px)', duration: dP, ease: 'power1.in' }, tP);

    // ---------- beat 1: pain shortens the fuse
    tl.to(ph.root, { x: -140, opacity: 0, duration: 0.6, ease: 'power2.in' }, cue(1) - 0.35);
    A.out(tl, LA, cue(1) - 0.35, 'fadeUp', { dur: 0.45 });
    A.out(tl, cap5, cue(1) - 0.2, 'fade', { dur: 0.35 });
    const cap6 = caption(stage, 6, STD.cx, CAP_Y);
    dropIn(tl, B, 6, cue(1) - 0.1);
    A.in(tl, cap6, cue(1) + 0.35, 'fadeUp', { dur: 0.6 });

    const LB = layer(stage);
    const fuse = put(LB, 'v4d-big', 'Pain shortens the *fuse*', { x: 100, y: 300 });
    const bsvg = K.svg(LB, { x: 100, y: 390, w: 520, h: 180 });
    K.rect(bsvg, 6, 6, 440, 168, { rx: 30, fill: '#fff', stroke: C.inkSoft, 'stroke-width': 8 });
    K.rect(bsvg, 450, 58, 34, 64, { rx: 10, fill: C.inkSoft });
    const cells = [0, 1, 2, 3, 4].map(i => K.rect(bsvg, 26 + i * 82, 26, 70, 128, { rx: 12, fill: C.green }));
    const pat = put(LB, 'v4d-sub', 'Patience', { x: 650, y: 452, size: 46, color: C.ink });
    const tFuse = Math.max(cue(1) + 1.2, sayAt(ctx, 1, 'think how short', 0.35, 0.4));
    A.in(tl, fuse, tFuse - 0.4, 'fadeUp', { dur: 0.8 });
    A.in(tl, [bsvg, pat], tFuse, 'fadeUp', { dur: 0.8, stagger: 0.15 });
    const tDrain = Math.max(tFuse + 0.9, sayAt(ctx, 1, 'your fuse gets', 0.5, 0.1));
    [4, 3, 2, 1].forEach((c, i) => tl.to(cells[c], { opacity: 0, duration: 0.3, ease: 'power1.out' }, tDrain + i * 0.45));
    tl.to(cells.slice(0, 4), { attr: { fill: C.amber }, duration: 0.3 }, tDrain + 0.5);
    tl.to(cells[0], { attr: { fill: C.red }, duration: 0.3 }, tDrain + 1.4);
    tl.to(pat, { color: C.red, duration: 0.4 }, tDrain + 1.4);
    A.pulse(tl, bsvg, tDrain + 1.8, { scale: 1.05 });

    // ---------- beat 2: rule out pain first. A vet check for every dog; a sudden change means the vet first
    const rule = put(LB, 'v4d-sub', 'Rule out pain first', { x: 100, y: 606, size: 44 });
    const vet = K.el('div', 'v4d-vet');
    Object.assign(vet.style, { left: '100px', top: '682px' });
    const vi = K.el('div', 'vi');
    vi.appendChild(K.icon('stethoscope'));
    vet.appendChild(vi);
    vet.appendChild(K.el('span', null, 'Vet check for every dog'));
    LB.appendChild(vet);
    const qrow = K.el('div', null);
    Object.assign(qrow.style, { position: 'absolute', left: '100px', top: '820px', display: 'flex', alignItems: 'center', gap: '20px' });
    const sud = K.el('div', 'v4d-q');
    sud.appendChild(K.icon('zap'));
    sud.appendChild(K.el('span', null, 'Sudden change?'));
    qrow.appendChild(sud);
    const arr = K.svgEl('svg', { viewBox: '0 0 96 40', width: 96, height: 40 }, qrow);
    const arrP = [K.path(arr, 'M 6 20 H 84', { stroke: C.green, 'stroke-width': 6 }), K.path(arr, 'M 68 6 L 86 20 L 68 34', { stroke: C.green, 'stroke-width': 6 })];
    const first = K.el('div', 'v4d-first', 'See the vet first');
    qrow.appendChild(first);
    LB.appendChild(qrow);
    A.in(tl, rule, cue(2) + 0.1, 'fadeUp', { dur: 0.7 });
    const tVet = Math.max(cue(2) + 1.2, sayAt(ctx, 2, 'needs a vet check', 0.72, 1.4));
    A.in(tl, vet, tVet, 'pop', { dur: 0.7 });
    const tSud = clamp(sayAt(ctx, 2, 'after a sudden change', 0.9, 0.6), tVet + 1.0, cue(3) - 1.8);
    A.in(tl, sud, tSud, 'fadeRight', { dur: 0.6 });
    A.draw(tl, arrP, tSud + 0.45, 0.35, { stagger: 0.15 });
    A.in(tl, first, tSud + 0.75, 'fadeRight', { dur: 0.5 });

    // ---------- beat 3: and more. The "+" chip fills and drops in; the bowl moves centre stage and glows
    A.out(tl, LB, cue(3) - 0.15, 'fade', { dur: 0.45 });
    A.out(tl, cap6, cue(3) - 0.15, 'fade', { dur: 0.35 });
    const FB = { cx: 960, y: 490, s: 0.9 };
    tl.to(B.wrap, { x: FB.cx - STD.cx, y: FB.y - STD.y, scale: FB.s / STD.s, duration: 1.0, ease: 'power3.inOut' }, cue(3) - 0.1);
    const land = dropIn(tl, B, 7, cue(3) + 0.8);
    const more = label(stage, 'And more', FB.cx, 752, { cls: 'v4d-kick', w: 600 });
    const cap7 = caption(stage, 7, FB.cx, 796);
    A.in(tl, more, cue(3) + 0.9, 'fadeUp', { dur: 0.6 });
    A.in(tl, cap7, cue(3) + 1.1, 'fadeUp', { dur: 0.6 });
    tl.fromTo(B.glow, { opacity: 0, scale: 0.7, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 1.1, ease: 'power2.out' }, land + 0.05);
    tl.to(B.tokens.map(t => t.inner), { scale: 1.12, transformOrigin: '50% 50%', duration: 0.22, yoyo: true, repeat: 1, stagger: 0.06, ease: 'power1.out' }, land + 0.3);
    const nG = Math.max(1, Math.floor((dur - land - 1.3) / 1.6));
    tl.to(B.glow, { scale: 1.06, transformOrigin: '50% 50%', duration: 1.6, yoyo: true, repeat: nG - 1, ease: 'sine.inOut' }, land + 1.2);

    // ---------- beat 4: it's not your fault
    A.out(tl, [more, cap7], cue(4) - 0.3, 'fade', { dur: 0.35 });
    const fin = K.el('div', 'v4d-final');
    Object.assign(fin.style, { left: '160px', top: '780px', width: '1600px' });
    const fh = K.icon('heart', { size: 76, stroke: 1.6, color: C.green });
    fh.setAttribute('fill', C.green);
    fin.appendChild(fh);
    fin.appendChild(K.el('div', 'ft', 'It’s <b>not your fault.</b>'));
    stage.appendChild(fin);
    A.in(tl, fin, cue(4) + 0.1, 'fadeUp', { dur: 1.0 });
    A.pulse(tl, fh, cue(4) + 1.2, { scale: 1.18 });
  });
})();
