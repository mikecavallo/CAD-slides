/*
 * Chapter 04: Why it happens
 *   ch04s01  Why it happens                 photo + the owner's question, then the mixing bowl with seven empty chips
 *   ch04s02  Nature and early life          genetics (born sensitive, built for a job), the socialization window
 *   ch04s03  Age                            bowl shifts up, life-stage ruler: adolescence, social maturity, senior
 *   ch04s04  Past experiences and tools     one bad moment, harsh tools, other dogs predict pain, be kind to yourself
 *   ch04s05  Frustration, pain and the mix  barrier photo, patience battery, vet first, the full bowl, not your fault
 *
 * The mixing bowl is one shared part. Every scene rebuilds it with the ingredients already added, so the
 * recipe fills up across the chapter: an empty "?" chip lights up, hops into the bowl and lands with a splash.
 */
(function () {
  const C = {
    green: '#619537', greenDark: '#3f6b22', greenDeep: '#2c4a17', greenLight: '#b8d99a', pale: '#e8f1dc',
    mist: '#f3f8ec', olive: '#4b5a1e', ink: '#212121', inkSoft: '#4a4a4a', muted: '#7a7a7a', line: '#d9ddd3',
    red: '#b8452d', redPale: '#f8e3dd', amber: '#d9912b', amberPale: '#fbefd9', amberText: '#a8650f',
  };

  // the recipe: seven ingredients from the deck plus "many other factors"
  const ING = [
    { name: 'Genetics and temperament', icon: 'dna', col: '#619537' },
    { name: 'Socialization', icon: 'users', col: '#3f6b22' },
    { name: 'Age', icon: 'hourglass', col: '#4b5a1e' },
    { name: 'Past experiences', icon: 'zap', col: '#d9912b' },
    { name: 'Tools used', icon: 'link', col: '#b8452d' },
    { name: 'Leash and barrier frustration', icon: 'fence', col: '#cf6a2c' },
    { name: 'Pain or medical issues', icon: 'stethoscope', col: '#2c4a17' },
    { name: 'Many other factors', icon: 'ellipsis', col: '#8fb03a' },
  ];
  // bowl-local coordinates: origin at the centre of the rim ellipse (rx 260, ry 50)
  const SLOT = [-150, -130, -110, -90, -70, -50, -30].map(d => {
    const r = (d * Math.PI) / 180;
    return [Math.round(420 * Math.cos(r)), Math.round(60 + 420 * Math.sin(r))];
  });
  const SPOT = [[-172, 2], [-60, -4], [60, -4], [172, 2], [-118, -72], [118, -72], [0, -78], [0, -162]];
  const BODY = 'M -260 0 C -260 150 -150 232 0 232 C 150 232 260 150 260 0 A 260 50 0 0 1 -260 0 Z';
  const STD = { cx: 1480, y: 600, s: 0.78 }; // bowl placement in scenes 2 to 5
  const CAP_Y = 830;
  let uid = 0;

  const CSS = `
  .c4-layer { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
  .c4-bowl { position: absolute; }
  .c4-caprow { position: absolute; display: flex; justify-content: center; }
  .c4-cap { display: inline-flex; align-items: center; gap: 16px; padding: 10px 32px 10px 10px; border-radius: 999px; background: #fff;
    box-shadow: var(--shadow-soft); border: 1px solid #e6e9e1; font: 700 30px/1 var(--font-body); color: var(--ink); white-space: nowrap; }
  .c4-dot { width: 50px; height: 50px; border-radius: 50%; display: grid; place-items: center; color: #fff; flex: 0 0 auto; }
  .c4-dot svg { width: 28px; height: 28px; stroke-width: 2.3; }
  .c4-q { position: absolute; display: inline-flex; align-items: center; gap: 28px; padding: 28px 48px 28px 28px; border-radius: 30px;
    background: #fff; box-shadow: var(--shadow); border: 1px solid #e6e9e1; }
  .c4-q::after { content: ''; position: absolute; left: 76px; bottom: -28px; width: 0; height: 0;
    border-right: 36px solid transparent; border-top: 30px solid #fff; }
  .c4-qico { width: 96px; height: 96px; border-radius: 50%; background: var(--green-pale); color: var(--green); display: grid; place-items: center; flex: 0 0 auto; }
  .c4-qico svg { width: 54px; height: 54px; stroke-width: 2; }
  .c4-qt { font: 600 58px/1.1 var(--font-head); color: var(--ink); white-space: nowrap; }
  .c4-q.alt { padding: 20px 40px 20px 20px; gap: 22px; }
  .c4-q.alt::after { left: auto; right: 76px; border-right: none; border-left: 36px solid transparent; }
  .c4-q.alt .c4-qico { width: 76px; height: 76px; background: var(--amber-pale); color: var(--amber); }
  .c4-q.alt .c4-qico svg { width: 44px; height: 44px; }
  .c4-q.alt .c4-qt { font-size: 46px; color: var(--ink-soft); }
  .c4-big { position: absolute; font: 600 54px/1.16 var(--font-head); color: var(--ink); }
  .c4-mix { position: absolute; font: 600 56px/1.1 var(--font-head); color: var(--ink); white-space: nowrap; }
  .c4-card { position: absolute; background: #fff; border-radius: 26px; box-shadow: var(--shadow-soft); border: 1px solid #e6e9e1; }
  .c4-badge { position: absolute; border-radius: 50%; display: grid; place-items: center; }
  .c4-badge svg { width: 54%; height: 54%; stroke-width: 2.1; }
  .c4-tag { position: absolute; display: inline-flex; align-items: center; gap: 18px; padding: 14px 34px 14px 16px; border-radius: 999px;
    background: #fff; box-shadow: var(--shadow-soft); border: 1px solid #e6e9e1; font: 500 36px/1 var(--font-body); color: var(--ink); white-space: nowrap; }
  .c4-tag .ic { width: 56px; height: 56px; border-radius: 50%; display: grid; place-items: center; background: var(--green-pale); color: var(--green-dark); }
  .c4-tag .ic svg { width: 32px; height: 32px; stroke-width: 2.2; }
  .c4-tag b { font-weight: 700; }
  .c4-sub { position: absolute; font: 700 40px/1.1 var(--font-head); color: var(--green-dark); white-space: nowrap; }
  .c4-row { position: absolute; display: flex; align-items: center; gap: 24px; padding: 0 28px 0 16px; height: 96px; border-radius: 24px;
    background: #fff; box-shadow: var(--shadow-soft); border: 1px solid #e6e9e1; font: 700 36px/1 var(--font-body); color: var(--ink); white-space: nowrap; }
  .c4-row .ic { width: 64px; height: 64px; border-radius: 50%; display: grid; place-items: center; flex: 0 0 auto; }
  .c4-row .ic svg { width: 36px; height: 36px; stroke-width: 2.2; }
  .c4-lab { position: absolute; font: 600 28px/1.2 var(--font-body); color: var(--ink-soft); white-space: nowrap; text-align: center; }
  .c4-red { display: inline-flex; align-items: center; padding: 16px 32px; border-radius: 999px; border: 3px solid var(--red); background: #fff;
    color: var(--red); font: 700 34px/1 var(--font-body); white-space: nowrap; }
  .c4-wrap { position: absolute; display: flex; flex-wrap: wrap; gap: 20px 22px; }
  .c4-up { display: inline-flex; align-items: center; gap: 12px; padding: 12px 26px 12px 14px; border-radius: 999px; background: var(--red-pale);
    color: var(--red); font: 700 30px/1 var(--font-body); white-space: nowrap; }
  .c4-up svg { width: 34px; height: 34px; stroke-width: 2.6; }
  .c4-call { position: absolute; padding-left: 30px; border-left: 10px solid var(--green); }
  .c4-call .t1 { font: 700 58px/1.1 var(--font-head); white-space: nowrap; }
  .c4-call .t2 { font: 500 40px/1.3 var(--font-body); color: var(--ink); white-space: nowrap; margin-top: 8px; }
  .c4-band { position: absolute; height: 90px; border-radius: 22px; display: flex; align-items: center; padding-left: 26px;
    font: 700 32px/1 var(--font-body); white-space: nowrap; border: 3px solid; }
  .c4-sign { position: absolute; font: 700 72px/1 var(--font-head); color: var(--muted); text-align: center; width: 80px; }
  .c4-eqlab { position: absolute; font: 700 30px/1.2 var(--font-body); color: var(--ink); white-space: nowrap; text-align: center; width: 240px; }
  .c4-best { position: absolute; font: 700 92px/1.1 var(--font-head); color: var(--green); white-space: nowrap; }
  .c4-qpill { position: absolute; display: flex; align-items: center; gap: 18px; height: 80px; padding: 0 28px 0 16px; border-radius: 999px;
    background: #fff; box-shadow: var(--shadow-soft); border: 1px solid #e6e9e1; font: 600 34px/1 var(--font-body); color: var(--ink); white-space: nowrap; }
  .c4-qpill .ck { width: 50px; height: 50px; border-radius: 50%; background: var(--green); color: #fff; display: grid; place-items: center; flex: 0 0 auto; }
  .c4-qpill .ck svg { width: 30px; height: 30px; stroke-width: 3; }
  .c4-vet { position: absolute; display: flex; align-items: center; gap: 20px; padding: 0 36px 0 22px; height: 116px; border-radius: 30px;
    background: var(--green); color: #fff; font: 700 44px/1 var(--font-head); white-space: nowrap; box-shadow: var(--shadow); }
  .c4-vet .vi { width: 76px; height: 76px; border-radius: 50%; background: rgba(255,255,255,0.18); display: grid; place-items: center; }
  .c4-vet .vi svg { width: 44px; height: 44px; stroke-width: 2.2; }
  .c4-final { position: absolute; display: flex; justify-content: center; align-items: center; gap: 30px; }
  .c4-final .ft { font: 700 88px/1.1 var(--font-head); color: var(--ink); white-space: nowrap; }
  .c4-final .ft b { color: var(--green); font-weight: 700; }
  .c4-heart { position: absolute; display: grid; place-items: center; }
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
  /** Scene time at which `phrase` is spoken in beat i (estimated from its position in the narration). */
  const phraseAt = (ctx, i, phrase, fb = 0.5) => {
    const say = ((ctx.beats[i] || {}).say || '').toLowerCase();
    const k = say.indexOf(phrase.toLowerCase());
    const f = k >= 0 && say.length ? k / say.length : fb;
    return ctx.cue(i) + (ctx.end(i) - ctx.cue(i)) * f;
  };
  /** Full-canvas group so a whole view can be faded out at once. */
  function layer(stage) {
    const d = K.el('div', 'c4-layer');
    stage.appendChild(d);
    return d;
  }
  /** Absolutely positioned div with markup text. */
  function put(parent, cls, html, o) {
    const n = K.el('div', cls, html == null ? null : K.md(html));
    n.style.left = o.x + 'px';
    n.style.top = o.y + 'px';
    if (o.w) n.style.width = o.w + 'px';
    if (o.size) n.style.fontSize = o.size + 'px';
    if (o.color) n.style.color = o.color;
    if (o.align) n.style.textAlign = o.align;
    parent.appendChild(n);
    return n;
  }
  /** Round icon badge centred on (cx, cy). */
  function badge(parent, name, cx, cy, size, bg, fg) {
    const b = K.el('div', 'c4-badge');
    Object.assign(b.style, { left: cx - size / 2 + 'px', top: cy - size / 2 + 'px', width: size + 'px', height: size + 'px', background: bg, color: fg });
    b.appendChild(K.icon(name));
    parent.appendChild(b);
    return b;
  }
  /** Centred text label at (cx, y). */
  function label(parent, html, cx, y, o = {}) {
    const w = o.w ?? 400;
    const n = put(parent, o.cls || 'c4-lab', html, { x: cx - w / 2, y, w, size: o.size, color: o.color, align: 'center' });
    if (o.weight) n.style.fontWeight = o.weight;
    return n;
  }

  // ------------------------------------------------------------------ the mixing bowl
  /**
   * Mixing bowl with ingredient tokens and the ring of hovering "?" chips.
   * o: {cx, y (rim centre), s (scale), filled (ingredients already in the bowl)}
   */
  function makeBowl(stage, o) {
    const s = o.s, id = 'c4b' + ++uid;
    const VX = 470, VT = 460, VW = 940, VH = 760;
    const wrap = K.el('div', 'c4-bowl');
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
   * k = 7 (many other factors) has no chip: it drops in from above. Returns the landing time.
   */
  function dropIn(tl, B, k, t) {
    const tk = B.tokens[k];
    let land;
    if (k < 7) {
      const [sx, sy] = SLOT[k];
      tl.to(B.slots[k].g, { opacity: 0, scale: 1.35, transformOrigin: '50% 50%', duration: 0.35, ease: 'power2.out' }, t);
      tl.fromTo(tk.outer, { x: sx, y: sy, opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power1.out' }, t);
      tl.fromTo(tk.inner, { scale: 0.3, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.5, ease: 'back.out(2.2)' }, t);
      const t1 = t + 0.55, D = 0.62;
      tl.to(tk.outer, { x: tk.x, duration: D, ease: 'power1.inOut' }, t1);
      tl.to(tk.outer, { y: sy - 46, duration: D * 0.36, ease: 'power2.out' }, t1);
      tl.to(tk.outer, { y: tk.y, duration: D * 0.64, ease: 'power2.in' }, t1 + D * 0.36);
      land = t1 + D;
    } else {
      tl.fromTo(tk.outer, { x: tk.x, y: -620, opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power1.out' }, t);
      tl.to(tk.outer, { y: tk.y, duration: 0.72, ease: 'power2.in' }, t);
      land = t + 0.72;
    }
    tl.to(tk.inner, { scaleX: 1.14, scaleY: 0.86, transformOrigin: '50% 50%', duration: 0.1, yoyo: true, repeat: 1, ease: 'power1.out' }, land);
    tl.to(B.bodyAll, { y: 5, duration: 0.1, yoyo: true, repeat: 1, ease: 'power1.out' }, land);
    splash(tl, B, tk.x, tk.y - 34, land, ING[k].col);
    return land;
  }

  /** Caption pill under the bowl naming ingredient k. */
  function caption(parent, k, cx, y) {
    const row = K.el('div', 'c4-caprow');
    Object.assign(row.style, { left: cx - 480 + 'px', top: y + 'px', width: '960px' });
    const p = K.el('div', 'c4-cap');
    const dot = K.el('div', 'c4-dot');
    dot.style.background = ING[k].col;
    dot.appendChild(K.icon(ING[k].icon));
    p.appendChild(dot);
    p.appendChild(K.el('span', null, ING[k].name));
    row.appendChild(p);
    parent.appendChild(row);
    return row;
  }

  /** Heading + standard bowl shared by scenes 2 to 5 (both fade in at the start of the scene). */
  function sceneBase(ctx, title, filled, size = 80) {
    const { stage, tl, dur } = ctx;
    style(stage);
    const h = K.heading(stage, title, { x: 100, y: 120, w: 1450, size });
    A.in(tl, h.all, 0.05, 'fadeUp', { dur: 0.7, stagger: 0.1 });
    const B = makeBowl(stage, { cx: STD.cx, y: STD.y, s: STD.s, filled });
    A.in(tl, B.wrap, 0, 'fade', { dur: 0.6 });
    bob(tl, B, 0, dur);
    return { h, B };
  }

  // ================================================================== ch04s01
  registerScene('ch04s01', ctx => {
    const { stage, tl, cue, dur } = ctx;
    style(stage);

    // photo card left (deck slide 3), heading right
    const ph = K.photo(stage, 'photo_why.jpg', { x: 100, y: 150, w: 580, h: 790, pos: '35% 50%' });
    A.in(tl, ph.root, Math.max(0, cue(0) - 0.4), 'fadeRight', { dur: 1.0 });
    A.kenburns(tl, ph.img, { from: 1.03, to: 1.12, t0: 0, t1: dur });
    const h = K.heading(stage, 'Why it happens', { x: 780, y: 170, w: 1000, size: 92 });
    A.in(tl, h.title, cue(0) + 0.1, 'wipe', { dur: 1.1 });
    A.in(tl, h.bar, cue(0) + 0.9, 'grow', { dur: 0.6 });

    // beat 0: the question every owner asks
    const q = K.el('div', 'c4-q');
    Object.assign(q.style, { left: '780px', top: '480px' });
    const qi = K.el('div', 'c4-qico');
    qi.appendChild(K.icon('message-circle-question'));
    q.appendChild(qi);
    q.appendChild(K.el('div', 'c4-qt', 'Why is my dog like this?'));
    stage.appendChild(q);
    A.in(tl, q, cue(0) + 0.9, 'fadeUp', { dur: 0.8 });
    const q2 = K.el('div', 'c4-q alt');
    Object.assign(q2.style, { left: '1040px', top: '712px' });
    const qi2 = K.el('div', 'c4-qico');
    qi2.appendChild(K.icon('frown'));
    q2.appendChild(qi2);
    q2.appendChild(K.el('div', 'c4-qt', 'What did I do wrong?'));
    stage.appendChild(q2);
    A.in(tl, q2, Math.max(cue(0) + 2.2, phraseAt(ctx, 0, 'what did i do wrong', 0.75) - 0.3), 'fadeUp', { dur: 0.8 });

    // beat 1: it's a recipe. The bowl rises with seven empty chips hovering over it
    A.out(tl, [q, q2], cue(1) - 0.25, 'fadeUp', { dur: 0.45, stagger: 0.08 });
    const B = makeBowl(stage, { cx: 1300, y: 745, s: 0.8, filled: 0 });
    A.in(tl, B.wrap, cue(1) + 0.1, 'fadeUp', { dur: 0.9 });
    tl.fromTo(B.slots.map(sl => sl.g), { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.5, stagger: 0.08, ease: 'back.out(2)' }, cue(1) + 0.5);
    bob(tl, B, cue(1) + 1.2, dur);
    const mix = put(stage, 'c4-mix', 'Usually a *mix*', { x: 780, y: 330 });
    A.in(tl, mix, cue(1) + 0.8, 'fadeUp', { dur: 0.8 });
  });

  // ================================================================== ch04s02
  registerScene('ch04s02', ctx => {
    const { stage, tl, cue, end } = ctx;
    const { B } = sceneBase(ctx, 'Nature and early life', 0);

    // ---------- beat 0: genetics and temperament
    const cap0 = caption(stage, 0, STD.cx, CAP_Y);
    const land0 = dropIn(tl, B, 0, cue(0) - 0.1);
    A.in(tl, cap0, cue(0) + 0.35, 'fadeUp', { dur: 0.6 });

    const LA = layer(stage);
    const card = K.el('div', 'c4-card');
    Object.assign(card.style, { left: '100px', top: '300px', width: '1000px', height: '240px' });
    LA.appendChild(card);
    const dna = badge(LA, 'dna', 204, 420, 128, ING[0].col, '#fff');
    const sens = put(LA, 'c4-big', 'Some dogs are<br>born *sensitive*', { x: 310, y: 350 });
    A.in(tl, card, land0 - 0.3, 'fadeUp', { dur: 0.7 });
    A.in(tl, dna, land0 - 0.1, 'pop', { dur: 0.6 });
    A.in(tl, sens, land0, 'fadeUp', { dur: 0.7 });

    // tiny smoke alarm (callback to chapter 2), blinking
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
    const blinkEnd = cue(2) - 0.4;
    const nBl = Math.max(2, Math.floor((blinkEnd - tAl - 0.5) / 0.9));
    tl.fromTo(arcs, { opacity: 0 }, { opacity: 1, duration: 0.18, stagger: 0.09, yoyo: true, repeat: nBl * 2 - 1, repeatDelay: 0.27, ease: 'power1.out' }, tAl + 0.5);
    tl.to(aBody, { rotation: 8, transformOrigin: '50% 50%', duration: 0.07, yoyo: true, repeat: 7, ease: 'sine.inOut' }, tAl + 0.5);

    // ---------- beat 1: built for a job (tags sprout from the DNA chip)
    const csvg = K.svg(LA, { x: 0, y: 0, w: 1920, h: 1080 });
    const conn = [
      K.path(csvg, 'M 204 548 V 666 Q 204 694 232 694 H 252', { stroke: C.greenLight, 'stroke-width': 6 }),
      K.path(csvg, 'M 204 666 V 772 Q 204 800 232 800 H 252', { stroke: C.greenLight, 'stroke-width': 6 }),
    ];
    const job = put(LA, 'c4-sub', 'Built for a job', { x: 264, y: 580 });
    const mkTag = (icon, html, y) => {
      const t = K.el('div', 'c4-tag');
      Object.assign(t.style, { left: '264px', top: y + 'px' });
      const ic = K.el('div', 'ic');
      ic.appendChild(K.icon(icon));
      t.appendChild(ic);
      t.appendChild(K.el('span', null, K.md(html)));
      LA.appendChild(t);
      return t;
    };
    const tag1 = mkTag('eye', '**Herders:** movement', 652);
    const tag2 = mkTag('shield', '**Guardians:** strangers', 758);
    const tT1 = Math.max(cue(1) + 0.4, phraseAt(ctx, 1, 'herding', 0.15) - 0.2);
    const tT2 = Math.max(tT1 + 0.8, phraseAt(ctx, 1, 'guardian', 0.45) - 0.2);
    A.draw(tl, conn[0], cue(1) - 0.2, 0.7);
    A.in(tl, job, cue(1), 'fadeRight', { dur: 0.7 });
    A.in(tl, tag1, tT1, 'pop', { dur: 0.6 });
    A.draw(tl, conn[1], tT2 - 0.45, 0.5);
    A.in(tl, tag2, tT2, 'pop', { dur: 0.6 });

    // ---------- beat 2: socialization, the early window
    A.out(tl, LA, cue(2) - 0.35, 'fadeUp', { dur: 0.45 });
    A.out(tl, cap0, cue(2) - 0.2, 'fade', { dur: 0.35 });
    const cap1 = caption(stage, 1, STD.cx, CAP_Y);
    const land1 = dropIn(tl, B, 1, cue(2) - 0.1);
    A.in(tl, cap1, cue(2) + 0.35, 'fadeUp', { dur: 0.6 });

    const LB = layer(stage);
    const TX0 = 130, TX1 = 1060, TW = TX1 - TX0, WIN = TX0 + TW / 2; // track shows birth to six months
    const tsvg = K.svg(LB, { x: 0, y: 0, w: 1920, h: 1080 });
    const TY = 376, TH = 64;
    const track = K.rect(tsvg, TX0, TY, TW, TH, { rx: 32, fill: '#e1e7d9' });
    const win = K.rect(tsvg, TX0, TY, WIN - TX0, TH, { rx: 32, fill: C.green });
    const shine = K.rect(tsvg, TX0, TY, WIN - TX0, TH, { rx: 32, fill: '#ffffff', opacity: 0 });
    // everyday things the puppy meets and files under "normal"
    const WI = ['dog', 'bus', 'person-standing', 'umbrella', 'bike'];
    const wx = i => TX0 + ((WIN - TX0) * (i + 0.5)) / WI.length;
    const wIcons = WI.map((n, i) => svgIcon(tsvg, n, wx(i), TY + TH / 2, 38, { stroke: '#fff', 'stroke-width': 2.2 }));
    const brk = K.path(tsvg, `M ${TX0 + 2} 364 V 352 H ${WIN - 2} V 364`, { stroke: C.green, 'stroke-width': 4 });
    const wlab = put(LB, 'c4-sub', 'Roughly the first three months', { x: TX0, y: 290, size: 42 });
    const ticks = [
      put(LB, 'c4-lab', 'Birth', { x: TX0, y: 454 }),
      label(LB, '3 months', WIN, 454, { w: 240 }),
      put(LB, 'c4-lab', '6 months', { x: TX1 - 300, y: 454, w: 300, align: 'right' }),
    ];
    A.in(tl, track, cue(2) + 0.3, 'grow', { dur: 0.8 });
    A.in(tl, win, cue(2) + 0.75, 'grow', { dur: 0.8 });
    A.in(tl, ticks, cue(2) + 0.7, 'fade', { dur: 0.5, stagger: 0.1 });
    A.draw(tl, brk, cue(2) + 1.1, 0.6);
    A.in(tl, wlab, cue(2) + 1.1, 'fadeUp', { dur: 0.7 });
    const tSort = Math.max(cue(2) + 1.6, phraseAt(ctx, 2, 'sorting', 0.35) - 0.3);
    tl.fromTo(wIcons, { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.28, ease: 'back.out(2)' }, tSort);
    const tLight = Math.max(tSort + 1.8, phraseAt(ctx, 2, 'feel normal', 0.8) - 0.3);
    tl.fromTo(shine, { opacity: 0 }, { opacity: 0.4, duration: 0.35, yoyo: true, repeat: 3, ease: 'sine.inOut' }, tLight);

    // gaps in the window (beat 3): buses, strangers and wheels never get filed under normal
    const GAP = [1, 2, 4];
    const gaps = GAP.map(i => K.rect(tsvg, wx(i) - 24, TY - 4, 48, TH + 8, { fill: '#e1e7d9' }));
    tl.to(GAP.map(i => wIcons[i]), { opacity: 0, y: 26, duration: 0.4, stagger: 0.12, ease: 'power2.in' }, cue(3) - 0.2);

    const mkRow = (icon, html, y, bg, fg) => {
      const r = K.el('div', 'c4-row');
      Object.assign(r.style, { left: '100px', top: y + 'px', width: '1000px' });
      const ic = K.el('div', 'ic');
      Object.assign(ic.style, { background: bg, color: fg });
      ic.appendChild(K.icon(icon));
      r.appendChild(ic);
      r.appendChild(K.el('span', null, K.md(html)));
      LB.appendChild(r);
      return r;
    };
    const row1 = mkRow('door-closed', 'Too little', 520, '#eceee8', C.inkSoft);
    const row2 = mkRow('triangle-alert', 'Too much, too fast', 636, C.amberPale, C.amber);
    const row3 = mkRow('party-popper', 'Everyone is a party', 752, C.pale, C.green);
    tl.fromTo(gaps, { scaleY: 0, transformOrigin: '50% 50%' }, { scaleY: 1, duration: 0.45, stagger: 0.12, ease: 'power2.out' }, cue(3));
    A.in(tl, row1, cue(3) + 0.2, 'fadeDown', { dur: 0.7 });
    A.in(tl, row2, cue(4) - 0.1, 'fadeDown', { dur: 0.7 });
    A.in(tl, row3, cue(5) - 0.1, 'fadeDown', { dur: 0.7 });

    // leash mini-diagram inside row 3: person, leash, dog. The leash snaps tight.
    const lsvg = K.svgEl('svg', { viewBox: '0 0 400 96', width: 400, height: 96 });
    Object.assign(lsvg.style, { position: 'absolute', left: '580px', top: '0px', overflow: 'visible' });
    row3.appendChild(lsvg);
    svgIcon(lsvg, 'user', 34, 48, 50, { stroke: C.inkSoft, 'stroke-width': 2.2 });
    const SLACK = 'M 62 54 Q 170 100 272 50', TAUT = 'M 62 54 Q 170 52 272 50';
    const leash = K.path(lsvg, SLACK, { stroke: '#8a6d3b', 'stroke-width': 6 });
    const dogG = K.group(lsvg);
    svgIcon(dogG, 'dog', 304, 48, 54, { stroke: C.ink, 'stroke-width': 2.2 });
    const chev = [K.path(lsvg, 'M 342 34 L 356 48 L 342 62', { stroke: C.red, 'stroke-width': 5 }), K.path(lsvg, 'M 362 34 L 376 48 L 362 62', { stroke: C.red, 'stroke-width': 5 })];
    const tTaut = Math.max(cue(5) + 1.2, phraseAt(ctx, 5, 'on leash', 0.45));
    tl.to(leash, { attr: { d: TAUT, stroke: C.red }, duration: 0.35, ease: 'power3.in' }, tTaut);
    tl.fromTo(dogG, { x: 0 }, { x: 8, duration: 0.35, ease: 'power3.in' }, tTaut);
    tl.to(dogG, { x: 4, duration: 0.08, yoyo: true, repeat: 9, ease: 'sine.inOut' }, tTaut + 0.4);
    tl.fromTo(chev, { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: 0.4, stagger: 0.12 }, tTaut + 0.3);
    void land1; void end;
  });

  // ================================================================== ch04s03
  registerScene('ch04s03', ctx => {
    const { stage, tl, cue } = ctx;
    const { B } = sceneBase(ctx, 'Age', 2, 84);

    // ---------- beat 0: age drops in, the bowl shifts up and a life-stage ruler draws
    dropIn(tl, B, 2, cue(0) - 0.1);
    const NB = { cx: 1270, y: 400, s: 0.52 };
    const tShift = cue(0) + 0.55;
    tl.to(B.wrap, { x: NB.cx - STD.cx, y: NB.y - STD.y, scale: NB.s / STD.s, duration: 0.9, ease: 'power3.inOut' }, tShift);
    const cap = caption(stage, 2, NB.cx, 552);
    A.in(tl, cap, tShift + 0.8, 'fadeUp', { dur: 0.6 });

    const X = m => 170 + m * 31.5; // months to x (birth to three years), then a break, then senior years
    const AX = 880;
    const rsvg = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const axis1 = K.line(rsvg, 150, AX, X(36) + 26, AX, { stroke: '#b9c4ab', 'stroke-width': 6 });
    const axis2 = K.path(rsvg, `M ${X(36) + 66} ${AX} H 1770`, { stroke: '#b9c4ab', 'stroke-width': 6 });
    const brk = [K.line(rsvg, X(36) + 30, AX + 16, X(36) + 42, AX - 16, { stroke: '#b9c4ab', 'stroke-width': 5 }), K.line(rsvg, X(36) + 50, AX + 16, X(36) + 62, AX - 16, { stroke: '#b9c4ab', 'stroke-width': 5 })];
    const arrowHead = K.path(rsvg, `M 1756 ${AX - 14} L 1776 ${AX} L 1756 ${AX + 14}`, { stroke: '#b9c4ab', 'stroke-width': 5 });
    const tickMarks = [0, 6, 12, 18, 24, 36].map(m => K.line(rsvg, X(m), AX - 12, X(m), AX + 12, { stroke: '#9aa98a', 'stroke-width': 4 }));
    const tickLabs = [['Birth', 0], ['6 months', 6], ['1 year', 12], ['18 months', 18], ['2 years', 24], ['3 years', 36]].map(([t, m]) => label(stage, t, X(m), AX + 22, { w: 200 }));
    const tAx = cue(0) + 0.7;
    A.draw(tl, [axis1], tAx, 0.9);
    A.draw(tl, [...brk, axis2, arrowHead], tAx + 0.7, 0.5, { stagger: 0.08 });
    A.in(tl, [...tickMarks], tAx + 0.3, 'fade', { dur: 0.3, stagger: 0.07 });
    A.in(tl, tickLabs, tAx + 0.4, 'fadeUp', { dur: 0.5, stagger: 0.07 });

    const mkBand = (html, m0, m1, y, bg, bd, fg) => {
      const b = K.el('div', 'c4-band', K.md(html));
      Object.assign(b.style, { left: X(m0) + 'px', top: y + 'px', width: X(m1) - X(m0) + 'px', background: bg, borderColor: bd, color: fg });
      stage.appendChild(b);
      return b;
    };
    const adol = mkBand('Adolescence', 6, 18, 650, C.pale, C.green, C.greenDeep);
    const ext = K.el('div', 'c4-band');
    Object.assign(ext.style, { left: X(18) - 24 + 'px', top: '650px', width: X(24) - X(18) + 24 + 'px', background: 'transparent', borderColor: C.green, borderStyle: 'dashed', borderLeft: 'none', borderRadius: '0 22px 22px 0', zIndex: 0 });
    stage.insertBefore(ext, adol);
    const social = mkBand('Social maturity', 12, 36, 766, C.amberPale, C.amber, '#8a5410');

    const mkCall = (t1, t2, col) => {
      const c = K.el('div', 'c4-call');
      Object.assign(c.style, { left: '100px', top: '330px', borderLeftColor: col });
      const a = K.el('div', 't1', K.md(t1));
      a.style.color = col;
      c.appendChild(a);
      if (t2) c.appendChild(K.el('div', 't2', K.md(t2)));
      stage.appendChild(c);
      return c;
    };
    const call1 = mkCall('Adolescence:', 'about 6 to 18 months', C.green);
    const tAd = Math.max(tAx + 1.0, phraseAt(ctx, 0, 'adolescence', 0.15));
    A.in(tl, adol, tAd, 'wipe', { dur: 0.8 });
    A.in(tl, call1, tAd + 0.15, 'fadeUp', { dur: 0.8 });
    A.in(tl, ext, Math.max(tAd + 1.2, phraseAt(ctx, 0, 'up to two years', 0.6) - 0.2), 'wipe', { dur: 0.7 });

    // ---------- beat 1: social maturity, and the volume turns up
    const call2 = mkCall('Social maturity:', 'about 1 to 3 years', C.amberText);
    A.out(tl, call1, cue(1) - 0.3, 'fadeUp', { dur: 0.4 });
    A.in(tl, social, cue(1) - 0.1, 'wipe', { dur: 0.9 });
    A.in(tl, call2, cue(1) + 0.2, 'fadeUp', { dur: 0.8 });
    const vol = K.el('div', 'c4-badge');
    Object.assign(vol.style, { left: '1110px', top: '664px', width: '84px', height: '84px', background: C.amberPale, color: C.amber, border: '4px solid #fff', boxShadow: 'var(--shadow-soft)' });
    const vIcons = ['volume', 'volume-1', 'volume-2'].map((n, i) => {
      const ic = K.icon(n);
      Object.assign(ic.style, { position: 'absolute', left: '50%', top: '50%', width: '48px', height: '48px', marginLeft: '-24px', marginTop: '-24px', opacity: i ? 0 : 1 });
      vol.appendChild(ic);
      return ic;
    });
    stage.appendChild(vol);
    const tVol = Math.max(cue(1) + 0.9, phraseAt(ctx, 1, 'gets louder', 0.4) - 0.4);
    A.in(tl, vol, cue(1) + 0.7, 'pop', { dur: 0.6 });
    tl.to(vIcons[0], { opacity: 0, duration: 0.2 }, tVol);
    tl.to(vIcons[1], { opacity: 1, duration: 0.2 }, tVol);
    tl.to(vIcons[1], { opacity: 0, duration: 0.2 }, tVol + 0.45);
    tl.to(vIcons[2], { opacity: 1, duration: 0.2 }, tVol + 0.45);
    tl.to(vol, { background: C.amber, color: '#fff', duration: 0.4 }, tVol + 0.45);
    A.pulse(tl, social, tVol + 0.5, { scale: 1.04 });
    A.pulse(tl, vol, tVol + 0.5, { scale: 1.15 });

    // ---------- beat 2: senior years
    const pin = K.line(rsvg, 1600, AX, 1600, 796, { stroke: C.olive, 'stroke-width': 5 });
    const pinDot = K.circle(rsvg, 1600, AX, 13, { fill: C.olive, stroke: '#fff', 'stroke-width': 4 });
    const clock = badge(stage, 'clock', 1600, 750, 88, C.olive, '#fff');
    const sen = label(stage, 'Senior', 1600, 648, { cls: 'c4-sub', w: 300, color: C.olive });
    const call3 = mkCall('Senior changes', null, C.olive);
    A.out(tl, call2, cue(2) - 0.3, 'fadeUp', { dur: 0.4 });
    A.in(tl, pinDot, cue(2) - 0.1, 'pop', { dur: 0.5 });
    A.draw(tl, pin, cue(2) + 0.1, 0.5);
    A.in(tl, clock, cue(2) + 0.4, 'pop', { dur: 0.6 });
    A.in(tl, sen, cue(2) + 0.6, 'fadeUp', { dur: 0.6 });
    A.in(tl, call3, cue(2) + 0.3, 'fadeUp', { dur: 0.8 });
    A.pulse(tl, clock, cue(2) + 1.4, { scale: 1.12 });
  });

  // ================================================================== ch04s04
  registerScene('ch04s04', ctx => {
    const { stage, tl, cue, dur } = ctx;
    const { B } = sceneBase(ctx, 'Past experiences and tools', 3, 76);

    // ---------- beat 0: one bad moment
    const cap3 = caption(stage, 3, STD.cx, CAP_Y);
    dropIn(tl, B, 3, cue(0) - 0.1);
    A.in(tl, cap3, cue(0) + 0.35, 'fadeUp', { dur: 0.6 });

    const LA = layer(stage);
    const title = put(LA, 'c4-big', 'One bad moment can be *enough*', { x: 100, y: 320 });
    A.in(tl, title, cue(0) + 0.5, 'fadeUp', { dur: 0.8 });
    const SY = 420; // svg top
    const tsvg = K.svg(LA, { x: 100, y: SY, w: 1000, h: 380 });
    const LY = 250, SX = 420; // line y and strike x (svg-local)
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
    const bad = label(LA, 'One bad moment', 100 + SX, SY + LY + 44, { cls: 'c4-sub', w: 460, color: C.red, size: 38 });
    A.draw(tl, base, cue(0) + 0.8, 0.9);
    tl.fromTo(dots.map(d => d.c), { opacity: 0, scale: 0.3, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.35, stagger: 0.05, ease: 'back.out(2)' }, cue(0) + 1.0);
    const tStrike = Math.max(cue(0) + 2.0, phraseAt(ctx, 0, 'one scary moment', 0.3) - 0.2);
    tl.fromTo(bolt, { opacity: 0, y: -110 }, { opacity: 1, y: 0, duration: 0.28, ease: 'power4.in' }, tStrike);
    tl.fromTo(hit, { opacity: 0, scale: 0.2, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(3)' }, tStrike + 0.26);
    tl.fromTo(rays, { opacity: 0, drawSVG: '0% 0%' }, { opacity: 1, drawSVG: '0% 100%', duration: 0.3, ease: 'power2.out' }, tStrike + 0.26);
    tl.to(rays, { opacity: 0, duration: 0.5 }, tStrike + 0.9);
    A.in(tl, bad, tStrike + 0.5, 'fadeUp', { dur: 0.6 });
    // "may never forget it": everything after that moment stays tinted
    const tMem = Math.max(tStrike + 1.2, phraseAt(ctx, 0, 'never forget', 0.7) - 0.3);
    A.draw(tl, after, tMem, 1.2);
    dots.filter(d => d.x > SX).forEach((d, i) => tl.to(d.c, { attr: { fill: C.amber }, duration: 0.3 }, tMem + 0.15 + i * 0.13));

    // ---------- beat 1: the tools used
    A.out(tl, LA, cue(1) - 0.35, 'fadeUp', { dur: 0.45 });
    A.out(tl, cap3, cue(1) - 0.2, 'fade', { dur: 0.35 });
    const cap4 = caption(stage, 4, STD.cx, CAP_Y);
    dropIn(tl, B, 4, cue(1) - 0.1);
    A.in(tl, cap4, cue(1) + 0.35, 'fadeUp', { dur: 0.6 });

    const LB = layer(stage);
    const t2 = put(LB, 'c4-big', 'Harsh tools, !!more fear!!', { x: 100, y: 320 });
    const wrapT = K.el('div', 'c4-wrap');
    Object.assign(wrapT.style, { left: '100px', top: '440px', width: '1000px' });
    LB.appendChild(wrapT);
    const tags = ['Leash pops', 'Prong and choke collars', 'Shock collars', 'Alpha rolls'].map(t => {
      const n = K.el('div', 'c4-red', t);
      wrapT.appendChild(n);
      return n;
    });
    const ups = K.el('div', 'c4-wrap');
    Object.assign(ups.style, { left: '100px', top: '660px', width: '1000px' });
    LB.appendChild(ups);
    const upChips = ['Fear', 'Stress', 'Aggression'].map(t => {
      const n = K.el('div', 'c4-up');
      n.appendChild(K.icon('trending-up'));
      n.appendChild(K.el('span', null, t));
      ups.appendChild(n);
      return n;
    });
    A.in(tl, t2, cue(1) + 0.4, 'fadeUp', { dur: 0.8 });
    const tagWords = ['leash pops', 'prong', 'shock', 'alpha'];
    tags.forEach((n, i) => A.in(tl, n, Math.max(cue(1) + 0.8 + i * 0.25, phraseAt(ctx, 1, tagWords[i], 0.3 + i * 0.1) - 0.25), 'pop', { dur: 0.55 }));
    const upWords = ['more fear', 'more stress', 'more aggression'];
    upChips.forEach((n, i) => A.in(tl, n, Math.max(cue(1) + 2 + i * 0.3, phraseAt(ctx, 1, upWords[i], 0.75 + i * 0.07) - 0.2), 'fadeUp', { dur: 0.6 }));

    // ---------- beat 2: the equation. Other dog + pain = fear
    A.out(tl, LB, cue(2) - 0.3, 'fadeUp', { dur: 0.45 });
    const LC = layer(stage);
    const t3 = put(LC, 'c4-big', 'Other dogs predict *pain*', { x: 100, y: 320 });
    const EY = 540, xs = [230, 600, 970];
    const eq = [
      badge(LC, 'dog', xs[0], EY, 160, C.pale, C.greenDark),
      badge(LC, 'zap', xs[1], EY, 160, C.amberPale, C.amber),
      badge(LC, 'triangle-alert', xs[2], EY, 160, C.redPale, C.red),
    ];
    const signs = [put(LC, 'c4-sign', '+', { x: (xs[0] + xs[1]) / 2 - 40, y: EY - 38 }), put(LC, 'c4-sign', '=', { x: (xs[1] + xs[2]) / 2 - 40, y: EY - 38 })];
    const eqLabs = ['Another dog', 'Pain', 'Fear'].map((t, i) => label(LC, t, xs[i], EY + 102, { cls: 'c4-eqlab', w: 260 }));
    A.in(tl, t3, cue(2) + 0.2, 'fadeUp', { dur: 0.8 });
    const tDog = Math.max(cue(2) + 0.6, phraseAt(ctx, 2, 'feels pain', 0.2) - 0.4);
    const tPain = tDog + 0.45;
    const tFear = Math.max(tPain + 0.8, phraseAt(ctx, 2, 'predict pain', 0.45) - 0.2);
    A.in(tl, [eq[0], eqLabs[0]], tDog, 'pop', { dur: 0.6, stagger: 0.1 });
    A.in(tl, [signs[0], eq[1], eqLabs[1]], tPain, 'pop', { dur: 0.6, stagger: 0.12 });
    A.in(tl, [signs[1], eq[2], eqLabs[2]], tFear, 'pop', { dur: 0.6, stagger: 0.12 });
    A.pulse(tl, eq[2], Math.max(tFear + 1, phraseAt(ctx, 2, 'fear grows', 0.7)), { scale: 1.14 });

    // ---------- beat 3: be kind to yourself
    tl.to(LC, { opacity: 0, filter: 'blur(8px)', duration: 0.9, ease: 'power2.inOut' }, cue(3) - 0.2);
    const best = put(stage, 'c4-best', 'You did your best', { x: 100, y: 470 });
    const ul = K.el('div', 'accent-bar');
    Object.assign(ul.style, { left: '104px', top: '600px', width: '160px' });
    stage.appendChild(ul);
    A.in(tl, best, cue(3) + 0.5, 'fadeUp', { dur: 0.9 });
    A.in(tl, ul, cue(3) + 1.0, 'grow', { dur: 0.6 });
    const more = put(stage, 'lead', 'And now you know more.', { x: 100, y: 648 });
    more.style.color = C.inkSoft;
    A.in(tl, more, Math.max(cue(3) + 1.6, phraseAt(ctx, 3, 'now you know more', 0.8) - 0.3), 'fadeUp', { dur: 0.8 });
    // green heart pulses once over the bowl, then stays
    const HX = STD.cx, HY = STD.y - 290 * STD.s;
    const ring = K.el('div', 'c4-heart');
    Object.assign(ring.style, { left: HX - 70 + 'px', top: HY - 70 + 'px', width: '140px', height: '140px', borderRadius: '50%', border: '5px solid ' + C.greenLight, opacity: 0 });
    stage.appendChild(ring);
    const heart = K.el('div', 'c4-heart');
    Object.assign(heart.style, { left: HX - 56 + 'px', top: HY - 56 + 'px', width: '112px', height: '112px' });
    heart.appendChild(K.icon('heart', { size: 112, stroke: 1.6, color: C.green }));
    heart.firstChild.setAttribute('fill', C.green);
    stage.appendChild(heart);
    const tH = cue(3) + 0.3;
    A.in(tl, heart, tH, 'pop', { dur: 0.6 });
    tl.to(heart, { scale: 1.25, duration: 0.28, ease: 'power2.out', yoyo: true, repeat: 1 }, tH + 0.75);
    tl.fromTo(ring, { opacity: 0.9, scale: 0.7 }, { opacity: 0, scale: 1.6, duration: 1.0, ease: 'power2.out', immediateRender: false }, tH + 0.8);
    tl.to(B.glow, { opacity: 0.55, duration: 1.0 }, tH + 0.8);
    void dur;
  });

  // ================================================================== ch04s05
  registerScene('ch04s05', ctx => {
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
    const held = put(LA, 'c4-big', 'Held back by a<br>*leash* or *barrier*', { x: 600, y: 330, w: 540 });
    A.in(tl, held, cue(0) + 0.6, 'fadeUp', { dur: 0.8 });
    // pressure meter climbing
    const plab = put(LA, 'c4-sub', 'Pressure', { x: 600, y: 520, size: 38, color: C.inkSoft });
    const msvg = K.svg(LA, { x: 600, y: 590, w: 500, h: 60 });
    const mdefs = K.svgEl('defs', {}, msvg);
    mdefs.innerHTML = `<linearGradient id="c4press" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7fb24a"/><stop offset="0.45" stop-color="#c2b235"/><stop offset="0.72" stop-color="#d9912b"/><stop offset="1" stop-color="#b8452d"/></linearGradient>`;
    K.rect(msvg, 0, 8, 480, 44, { rx: 22, fill: '#e1e7d9' });
    const fill = K.rect(msvg, 0, 8, 480, 44, { rx: 22, fill: 'url(#c4press)' });
    A.in(tl, [plab, msvg], cue(0) + 1.1, 'fadeUp', { dur: 0.7, stagger: 0.12 });
    const tP = Math.max(cue(0) + 1.8, phraseAt(ctx, 0, 'can see it', 0.55) - 0.2);
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
    const fuse = put(LB, 'c4-big', 'Pain shortens the *fuse*', { x: 100, y: 300 });
    const bsvg = K.svg(LB, { x: 100, y: 390, w: 520, h: 180 });
    K.rect(bsvg, 6, 6, 440, 168, { rx: 30, fill: '#fff', stroke: C.inkSoft, 'stroke-width': 8 });
    K.rect(bsvg, 450, 58, 34, 64, { rx: 10, fill: C.inkSoft });
    const cells = [0, 1, 2, 3, 4].map(i => K.rect(bsvg, 26 + i * 82, 26, 70, 128, { rx: 12, fill: C.green }));
    const pat = put(LB, 'c4-sub', 'Patience', { x: 650, y: 452, size: 46, color: C.ink });
    A.in(tl, fuse, cue(1) + 0.4, 'fadeUp', { dur: 0.8 });
    A.in(tl, [bsvg, pat], cue(1) + 0.7, 'fadeUp', { dur: 0.8, stagger: 0.15 });
    const tDrain = Math.max(cue(1) + 1.8, phraseAt(ctx, 1, 'short your fuse', 0.5) - 0.2);
    [4, 3, 2, 1].forEach((c, i) => tl.to(cells[c], { opacity: 0, duration: 0.3, ease: 'power1.out' }, tDrain + i * 0.45));
    tl.to(cells.slice(0, 4), { attr: { fill: C.amber }, duration: 0.3 }, tDrain + 0.5);
    tl.to(cells[0], { attr: { fill: C.red }, duration: 0.3 }, tDrain + 1.4);
    tl.to(pat, { color: C.red, duration: 0.4 }, tDrain + 1.4);
    A.pulse(tl, bsvg, tDrain + 1.8, { scale: 1.05 });

    // ---------- beat 2: rule out pain first
    const rule = put(LB, 'c4-sub', 'Rule out pain first', { x: 100, y: 612, size: 44 });
    const mkQ = (t, y) => {
      const p = K.el('div', 'c4-qpill');
      Object.assign(p.style, { left: '100px', top: y + 'px', width: '560px' });
      const ck = K.el('div', 'ck');
      ck.appendChild(K.icon('check'));
      p.appendChild(ck);
      p.appendChild(K.el('span', null, t));
      LB.appendChild(p);
      return { p, ck };
    };
    const q1 = mkQ('Sudden change?', 694);
    const q2 = mkQ('Touchy when handled?', 796);
    const vet = K.el('div', 'c4-vet');
    Object.assign(vet.style, { left: '760px', top: '727px' });
    const vi = K.el('div', 'vi');
    vi.appendChild(K.icon('stethoscope'));
    vet.appendChild(vi);
    vet.appendChild(K.el('span', null, 'Vet first'));
    LB.appendChild(vet);
    const asv = K.svg(LB, { x: 0, y: 0, w: 1920, h: 1080 });
    const ar = [
      K.path(asv, 'M 672 734 C 710 734 712 770 744 772', { stroke: C.green, 'stroke-width': 5 }),
      K.path(asv, 'M 672 836 C 710 836 712 800 744 798', { stroke: C.green, 'stroke-width': 5 }),
    ];
    const heads = [K.path(asv, 'M 732 762 L 746 772 L 732 783', { stroke: C.green, 'stroke-width': 5 }), K.path(asv, 'M 732 788 L 746 798 L 732 809', { stroke: C.green, 'stroke-width': 5 })];
    A.in(tl, rule, cue(2) + 0.1, 'fadeUp', { dur: 0.7 });
    const tQ1 = Math.max(cue(2) + 0.6, phraseAt(ctx, 2, 'sudden', 0.4) - 0.3);
    const tQ2 = Math.max(tQ1 + 0.8, phraseAt(ctx, 2, 'touchy', 0.6) - 0.3);
    [[q1, tQ1], [q2, tQ2]].forEach(([q, t]) => {
      A.in(tl, q.p, t, 'fadeRight', { dur: 0.6 });
      A.in(tl, q.ck, t + 0.35, 'pop', { dur: 0.5 });
    });
    const tVet = Math.max(tQ2 + 0.7, phraseAt(ctx, 2, 'your vet', 0.75) - 0.3);
    A.draw(tl, ar, tVet - 0.2, 0.5, { stagger: 0.1 });
    A.in(tl, heads, tVet + 0.2, 'fade', { dur: 0.3 });
    A.in(tl, vet, tVet + 0.1, 'pop', { dur: 0.7 });

    // ---------- beat 3: many other factors. The bowl moves centre stage and glows
    A.out(tl, LB, cue(3) - 0.35, 'fade', { dur: 0.45 });
    A.out(tl, cap6, cue(3) - 0.35, 'fade', { dur: 0.35 });
    const FB = { cx: 960, y: 510, s: 0.92 };
    tl.to(B.wrap, { x: FB.cx - STD.cx, y: FB.y - STD.y, scale: FB.s / STD.s, duration: 1.0, ease: 'power3.inOut' }, cue(3) - 0.2);
    const land = dropIn(tl, B, 7, cue(3) + 0.55);
    const cap7 = caption(stage, 7, FB.cx, 792);
    A.in(tl, cap7, cue(3) + 0.8, 'fadeUp', { dur: 0.6 });
    tl.fromTo(B.glow, { opacity: 0, scale: 0.7, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 1.1, ease: 'power2.out' }, land + 0.05);
    tl.to(B.tokens.map(t => t.inner), { scale: 1.12, transformOrigin: '50% 50%', duration: 0.22, yoyo: true, repeat: 1, stagger: 0.06, ease: 'power1.out' }, land + 0.3);
    const nG = Math.max(1, Math.floor((dur - land - 1.3) / 1.6));
    tl.to(B.glow, { scale: 1.06, transformOrigin: '50% 50%', duration: 1.6, yoyo: true, repeat: nG - 1, ease: 'sine.inOut' }, land + 1.2);

    // ---------- beat 4: it's not your fault
    A.out(tl, cap7, cue(4) - 0.3, 'fade', { dur: 0.35 });
    const fin = K.el('div', 'c4-final');
    Object.assign(fin.style, { left: '160px', top: '790px', width: '1600px' });
    const fh = K.icon('heart', { size: 76, stroke: 1.6, color: C.green });
    fh.setAttribute('fill', C.green);
    fin.appendChild(fh);
    fin.appendChild(K.el('div', 'ft', 'It\u2019s <b>not your fault.</b>'));
    stage.appendChild(fin);
    A.in(tl, fin, cue(4) + 0.1, 'fadeUp', { dur: 1.0 });
    A.pulse(tl, fh, cue(4) + 1.2, { scale: 1.18 });
  });
})();
