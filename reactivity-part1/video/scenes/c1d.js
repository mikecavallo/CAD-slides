// Chapter 1 (v5): scenes built by group d. Bowl parts come from window.C1 (c1_bowl.js).
//   ch01s08  Training tools and methods   chip + red tool tags; the dog's day, all decided by humans; the 'Boss?' crown;
//                                         Suppress gives way to Understand and Help; a green heart over the bowl
//   ch01s09  Pain and discomfort          chip; sore spots on a dog + six sensitivities; two panels (looks fine / leans away);
//                                         a sudden change forks into Behavior and Physical health, then 'Vet visit first'
//   ch01s10  Putting it together          all eight ingredients drop into the bowl; the behavior, not the dog;
//                                         situation, behavior, outcome resolve into Understand it, then change it; logo close
(() => {
  const C = C1.C;
  const DOG = '#2c4a17', DOG_FAR = '#56822f', DOG_EAR = '#1d3310';

  const CSS = `
  .c1d-kick { position:absolute; font:700 28px/1 var(--font-body); letter-spacing:5px; text-transform:uppercase; white-space:nowrap; }
  .c1d-life { position:absolute; display:flex; flex-direction:column; gap:10px; padding:14px 22px 16px 14px; background:#fff; border-radius:22px;
    border:1px solid #e6e9e1; box-shadow:var(--shadow-soft); white-space:nowrap; }
  .c1d-life .top { display:flex; align-items:center; gap:14px; }
  .c1d-life .ib { width:54px; height:54px; border-radius:50%; background:var(--green-pale); color:var(--green-dark); display:grid; place-items:center; flex:0 0 auto; }
  .c1d-life .ib svg { width:30px; height:30px; stroke-width:2.2; }
  .c1d-life .nm { font:700 34px/1 var(--font-head); color:var(--ink); }
  .c1d-life .hd { display:flex; align-items:center; gap:8px; padding-left:6px; font:700 26px/1 var(--font-body); color:var(--green-dark); }
  .c1d-life .hd svg { width:26px; height:26px; stroke-width:2.5; color:var(--green); }
  .c1d-pill { position:absolute; display:inline-flex; align-items:center; gap:16px; height:84px; padding:0 34px 0 12px; border-radius:999px;
    font:700 40px/1 var(--font-head); white-space:nowrap; box-shadow:var(--shadow-soft); box-sizing:border-box; }
  .c1d-pill.noic { padding:0 36px; }
  .c1d-pill .ic { width:62px; height:62px; border-radius:50%; display:grid; place-items:center; flex:0 0 auto; }
  .c1d-pill .ic svg { width:36px; height:36px; stroke-width:2.3; }
  .c1d-pill.red { background:#fff; border:4px solid var(--red); color:var(--red); }
  .c1d-pill.red .ic { background:var(--red-pale); color:var(--red); }
  .c1d-pill.green { background:var(--green); color:#fff; box-shadow:0 12px 26px rgba(44,74,23,0.24); }
  .c1d-pill.green .ic { background:rgba(255,255,255,0.22); color:#fff; }
  .c1d-pill.white { background:#fff; border:1px solid #e6e9e1; color:var(--ink); }
  .c1d-pill.white .ic { background:var(--green-pale); color:var(--green-dark); }
  .c1d-pill.grey { background:#fff; border:3px solid #cfd4c8; color:var(--muted); }
  .c1d-pill.grey .ic { background:#eef0ea; color:var(--muted); }
  .c1d-pill.amber { background:#fff; border:3px solid var(--amber); color:#8a5410; }
  .c1d-pill.amber .ic { background:var(--amber-pale); color:#a8650f; }
  .c1d-row { position:absolute; display:flex; justify-content:center; align-items:center; gap:22px; }
  .c1d-row .c1d-pill { position:relative; }
  .c1d-boss { position:absolute; font:700 40px/1 var(--font-head); color:var(--ink-soft); white-space:nowrap; }
  .c1d-tlab { position:absolute; text-align:center; font:700 30px/1.1 var(--font-body); white-space:nowrap; }
  .c1d-sens { position:absolute; width:170px; display:flex; flex-direction:column; align-items:center; gap:14px; }
  .c1d-sens .ib { width:92px; height:92px; border-radius:50%; background:var(--amber-pale); color:#a8650f; display:grid; place-items:center;
    border:4px solid #fff; box-shadow:0 8px 20px rgba(120,70,10,0.14); }
  .c1d-sens .ib svg { width:48px; height:48px; stroke-width:2.1; }
  .c1d-sens .t { font:600 28px/1 var(--font-body); color:var(--ink); white-space:nowrap; }
  .c1d-panel { position:absolute; background:#fff; border-radius:26px; border:1px solid #e6e9e1; box-shadow:var(--shadow-soft); overflow:hidden; }
  .c1d-panel .svgfill { left:0; top:0; }
  .c1d-plab { position:absolute; left:0; right:0; display:flex; justify-content:center; align-items:center; gap:12px; font:700 36px/1 var(--font-head); white-space:nowrap; }
  .c1d-plab svg { width:36px; height:36px; stroke-width:2.4; }
  .c1d-qm { position:absolute; font:700 70px/1 var(--font-head); color:#a3b394; }
  .c1d-vet { position:absolute; display:flex; align-items:center; gap:18px; height:96px; padding:0 34px 0 16px; border-radius:28px; background:var(--green);
    color:#fff; font:700 40px/1 var(--font-head); white-space:nowrap; box-shadow:0 14px 30px rgba(44,74,23,0.28); }
  .c1d-vet .vi { width:66px; height:66px; border-radius:50%; background:rgba(255,255,255,0.2); display:grid; place-items:center; }
  .c1d-vet .vi svg { width:40px; height:40px; stroke-width:2.2; }
  .c1d-leg { position:absolute; display:flex; align-items:center; gap:16px; width:410px; height:84px; }
  .c1d-leg .dt { width:62px; height:62px; border-radius:50%; color:#fff; display:grid; place-items:center; flex:0 0 auto; border:4px solid #fff;
    box-shadow:0 6px 16px rgba(40,60,20,0.18); }
  .c1d-leg .dt svg { width:30px; height:30px; stroke-width:2.3; }
  .c1d-leg .t { font:700 30px/1.15 var(--font-body); color:var(--ink); }
  .c1d-el { position:absolute; display:flex; flex-direction:column; align-items:center; gap:16px; width:300px; }
  .c1d-el .ib { width:118px; height:118px; border-radius:50%; background:#fff; color:var(--green-dark); display:grid; place-items:center;
    border:5px solid var(--green-light); box-shadow:var(--shadow-soft); }
  .c1d-el .ib svg { width:58px; height:58px; stroke-width:2; }
  .c1d-el .t { font:700 38px/1 var(--font-head); color:var(--ink); white-space:nowrap; }
  .c1d-big { font:700 50px/1 var(--font-head); height:100px; padding:0 40px 0 16px; gap:20px; }
  .c1d-big .ic { width:72px; height:72px; }
  .c1d-big .ic svg { width:42px; height:42px; }
  .c1d-halo { position:absolute; border-radius:50%; background:radial-gradient(closest-side, rgba(232,241,220,0.95), rgba(232,241,220,0.55) 55%, rgba(232,241,220,0) 100%); }
  .c1d-close { position:absolute; left:0; width:1920px; text-align:center; white-space:nowrap; font:600 42px/1.2 var(--font-body); color:var(--green-dark); letter-spacing:0.5px; }
  `;
  const css = stage => stage.appendChild(K.el('style', null, CSS));
  const clamp = C1.clamp;

  // ------------------------------------------------------------------ helpers
  /** Pill with an optional round icon. o: {x, y, center} (center: x is the pill's centre). */
  function pill(parent, cls, icon, html, o = {}) {
    const n = K.el('div', 'c1d-pill ' + cls + (icon ? '' : ' noic'));
    if (icon) {
      const ic = K.el('div', 'ic');
      ic.appendChild(K.icon(icon));
      n.appendChild(ic);
    }
    n.appendChild(K.el('span', null, K.md(html)));
    if (o.x != null) Object.assign(n.style, { left: o.x + 'px', top: o.y + 'px' });
    parent.appendChild(n);
    if (o.center) gsap.set(n, { xPercent: -50 });
    return n;
  }

  /** Side-view dog silhouette facing right. Local box x 46..399, y 36..300 (paws on y 297). */
  function dog(parent, x, y, s) {
    const outer = K.group(parent);
    const g = K.group(outer, { transform: `translate(${x} ${y}) scale(${s})` });
    const shadow = K.svgEl('ellipse', { cx: 210, cy: 298, rx: 168, ry: 9, fill: DOG, opacity: 0.13 }, g);
    const fig = K.group(g);
    const tail = K.group(fig);
    K.path(tail, 'M 108 134 C 86 124 68 106 56 80', { stroke: DOG, 'stroke-width': 15, fill: 'none' });
    const legsFar = K.group(fig);
    K.path(legsFar, 'M 140 160 C 132 194 142 216 154 234 L 148 286 C 147 294 152 297 160 297 L 178 297 C 183 297 183 291 176 289 L 168 287 L 174 238 C 182 216 192 194 190 166 Z', { fill: DOG_FAR, stroke: 'none' });
    K.path(legsFar, 'M 262 186 L 284 188 L 282 288 L 296 291 C 300 293 300 297 294 297 L 266 297 C 262 297 262 292 264 288 Z', { fill: DOG_FAR, stroke: 'none' });
    K.path(fig, 'M 100 146 C 100 120 128 112 168 114 L 268 110 C 300 108 322 122 328 146 C 334 178 320 208 288 212 C 244 216 206 198 172 196 C 140 196 104 190 100 146 Z', { fill: DOG, stroke: 'none' });
    K.path(fig, 'M 106 126 C 86 148 88 200 114 232 L 108 286 C 107 294 112 297 120 297 L 140 297 C 146 297 146 290 138 288 L 130 286 L 138 238 C 150 216 162 192 160 164 C 150 140 124 124 106 126 Z', { fill: DOG, stroke: 'none' });
    K.path(fig, 'M 290 176 L 316 180 L 312 286 L 330 290 C 334 292 334 297 328 297 L 294 297 C 290 297 290 292 292 288 Z', { fill: DOG, stroke: 'none' });
    const head = K.group(fig);
    K.path(head, 'M 262 126 C 270 100 290 78 310 66 L 342 92 C 338 120 330 150 322 176 Z', { fill: DOG, stroke: 'none' });
    K.circle(head, 322, 74, 38, { fill: DOG });
    K.path(head, 'M 330 56 C 354 56 378 64 390 74 C 398 82 396 100 382 104 L 330 108 Z', { fill: DOG, stroke: 'none' });
    K.circle(head, 390, 80, 9, { fill: '#142309' });
    K.path(head, 'M 306 48 C 290 54 282 84 288 112 C 294 120 306 116 308 106 C 314 86 316 66 316 52 Z', { fill: DOG_EAR, stroke: 'none' });
    K.circle(head, 340, 66, 5, { fill: '#fff' });
    K.path(head, 'M 290 102 C 302 114 318 122 334 124', { stroke: C.greenLight, 'stroke-width': 10, fill: 'none' });
    const fx = K.group(g);
    return { outer, g, fig, head, tail, fx, x, y, s, pt: (lx, ly) => [x + lx * s, y + ly * s] };
  }
  /** Dog centred on (cx, cy). */
  const dogAt = (parent, cx, cy, s) => dog(parent, cx - 222 * s, cy - 168 * s, s);

  /** Lean away (weight back, head low, tail tucked). */
  function lean(tl, D, t, d = 0.7) {
    tl.to(D.fig, { skewX: 15, x: -22, transformOrigin: '50% 100%', duration: d, ease: 'power2.out' }, t);
    tl.to(D.head, { rotation: 12, transformOrigin: '0% 100%', duration: d, ease: 'power2.out' }, t);
    tl.to(D.tail, { rotation: -104, transformOrigin: '92% 92%', duration: d, ease: 'power2.out' }, t);
  }

  /** A hand and sleeve reaching left (fingertips toward -x), wrist at (x, y), rotated by rot degrees. */
  function reachHand(parent, x, y, s, rot) {
    const outer = K.group(parent);
    const g = K.group(outer, { transform: `translate(${x} ${y}) rotate(${rot}) scale(${s})` });
    const SKIN = '#f1d2b3', EDGE = '#cf9f78';
    K.rect(g, 6, -34, 260, 68, { rx: 14, fill: '#a8b98e' });
    K.rect(g, 0, -36, 20, 72, { rx: 8, fill: '#8a9d6c' });
    [[-58, -13, -104, -16], [-58, 0, -112, -1], [-58, 12, -106, 13], [-56, 23, -92, 27]].forEach(([x1, y1, x2, y2]) => {
      K.line(g, x1, y1, x2, y2, { stroke: EDGE, 'stroke-width': 14 });
      K.line(g, x1, y1, x2, y2, { stroke: SKIN, 'stroke-width': 10 });
    });
    K.line(g, -26, -20, -54, -40, { stroke: EDGE, 'stroke-width': 15 });
    K.line(g, -26, -20, -54, -40, { stroke: SKIN, 'stroke-width': 11 });
    K.path(g, 'M 2 -26 C -24 -28 -50 -24 -64 -16 L -64 26 C -48 32 -22 30 2 26 Z', { fill: SKIN, stroke: EDGE, 'stroke-width': 2.5 });
    return outer;
  }

  /** Pulsing ring around a small dot (inside a dog's fx group), looping from t0 to t1. */
  function soreSpot(tl, D, lx, ly, t0, t1, col = C.red) {
    const ring = K.circle(D.fx, lx, ly, 13, { fill: 'none', stroke: col, 'stroke-width': 5, opacity: 0 });
    const dot = K.circle(D.fx, lx, ly, 13, { fill: col, stroke: '#fff', 'stroke-width': 5 });
    tl.fromTo(dot, { opacity: 0, scale: 0.2, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(3)' }, t0);
    const per = 1.4, n = Math.max(1, Math.floor((t1 - t0 - 0.3) / per));
    tl.fromTo(ring, { attr: { r: 13 }, opacity: 0.85 }, { attr: { r: 40 }, opacity: 0, duration: per, ease: 'power1.out', repeat: n - 1, immediateRender: false }, t0 + 0.3);
    return [dot, ring];
  }

  /** Straight arrow with an open chevron head. Returns [shaft, head]. */
  function arrow(svg, x1, y1, x2, y2, o = {}) {
    const col = o.color || C.green, sw = o.width ?? 8, hl = o.head ?? 22;
    const ang = Math.atan2(y2 - y1, x2 - x1), a = (40 * Math.PI) / 180;
    const shaft = K.line(svg, x1, y1, x2, y2, { stroke: col, 'stroke-width': sw });
    const head = K.path(svg, `M ${x2 - hl * Math.cos(ang - a)} ${y2 - hl * Math.sin(ang - a)} L ${x2} ${y2} L ${x2 - hl * Math.cos(ang + a)} ${y2 - hl * Math.sin(ang + a)}`, { stroke: col, 'stroke-width': sw, fill: 'none' });
    return [shaft, head];
  }

  // ================================================================== ch01s08 Training tools and methods
  registerScene('ch01s10', ctx => {
    const { stage, tl, cue, end, dur } = ctx;
    const { B } = C1.sceneBase(ctx, 'Training tools and methods', 6);
    css(stage);
    const at = (i, p, fb, lead) => C1.sayAt(ctx, i, p, fb, lead);

    // ---------- beat 0: the chip drops in; red tags name the harsh tools
    const cap = C1.caption(stage, 6, C1.STD.cx, C1.CAP_Y);
    C1.dropIn(tl, B, 6, cue(0) - 0.1);
    A.in(tl, cap, cue(0) + 0.35, 'fadeUp', { dur: 0.6 });
    const LA = C1.layer(stage);
    const l0 = C1.put(LA, 'c1-big', 'Training can affect *behavior* too', { x: 100, y: 330 });
    A.in(tl, l0, cue(0) + 0.5, 'fadeUp', { dur: 0.8 });
    const kick = C1.put(LA, 'c1d-kick', 'Harsh methods', { x: 102, y: 478, color: C.red });
    const tKick = clamp(at(0, 'harsh methods', 0.4, 0.3), cue(0) + 1.4, end(0) - 4);
    A.in(tl, kick, tKick, 'fadeUp', { dur: 0.6 });
    const wrapT = K.el('div', 'c1-wrap');
    Object.assign(wrapT.style, { left: '100px', top: '534px', width: '1000px', gap: '26px 24px' });
    LA.appendChild(wrapT);
    const tags = ['Leash pops', 'Prong and choke collars', 'Shock collars', 'Alpha rolls'].map(t => {
      const n = K.el('div', 'c1-red', t);
      wrapT.appendChild(n);
      return n;
    });
    let tPrev = tKick;
    ['leash jerks', 'prong', 'shock', 'pinning'].forEach((w, i) => {
      tPrev = Math.max(tPrev + 0.4, at(0, w, 0.66 + i * 0.08, 0.25));
      A.in(tl, tags[i], tPrev, 'pop', { dur: 0.55 });
    });

    // ---------- beat 1: a dog at the centre; seven parts of their day, each one decided by a human
    const tOutA = Math.max(cue(1) - 0.35, tPrev + 1.3);
    A.out(tl, LA, tOutA, 'fadeUp', { dur: 0.45 });
    const LB = C1.layer(stage);
    const l1 = C1.put(LB, 'c1-big', 'You already control *most of their world*', { x: 100, y: 300 });
    const sv = K.svg(LB, { x: 0, y: 0, w: 1920, h: 1080 });
    const spokeG = K.group(sv);
    const DX = 620, DY = 650, DS = 0.66;
    const D = dogAt(sv, DX, DY, DS);
    A.in(tl, D.outer, Math.max(cue(1) + 0.2, tOutA + 0.45), 'fadeUp', { dur: 0.8 });
    A.in(tl, l1, at(1, 'Think about how much', 0.25, 0.3), 'fadeUp', { dur: 0.8 });
    const LIFE = [
      ['Bed', 'bed', 'where they sleep'], ['Door', 'door-open', 'when they go outside'], ['Walk', 'footprints', 'where they go,'],
      ['Time', 'clock', 'how long they stay'], ['Food', 'bone', 'when they eat'], ['Toys', 'toy-brick', 'access to the things'], ['Outside', 'trees', 'need and enjoy'],
    ];
    const ANG = [-115.7, -64.3, -12.9, 38.6, 90, 141.4, 192.9];
    const RX = 620, RY = 665, ERX = 390, ERY = 215, HW = 132, HH = 58;
    tPrev = cue(1) + 1.2;
    const cards = [], spokes = [];
    LIFE.forEach(([nm, ic, ph], i) => {
      const a = (ANG[i] * Math.PI) / 180;
      const cx = RX + ERX * Math.cos(a), cy = RY + ERY * Math.sin(a);
      const card = K.el('div', 'c1d-life');
      const top = K.el('div', 'top');
      const ib = K.el('div', 'ib');
      ib.appendChild(K.icon(ic));
      top.appendChild(ib);
      top.appendChild(K.el('div', 'nm', nm));
      card.appendChild(top);
      const hd = K.el('div', 'hd');
      hd.appendChild(K.icon('user'));
      hd.appendChild(K.el('span', null, 'Human decides'));
      card.appendChild(hd);
      Object.assign(card.style, { left: cx + 'px', top: cy + 'px' });
      LB.appendChild(card);
      gsap.set(card, { xPercent: -50, yPercent: -50 });
      // spoke from the dog to the card's edge
      const ux = cx - DX, uy = cy - DY, len = Math.hypot(ux, uy);
      const nx = ux / len, ny = uy / len;
      const tEdge = Math.min(HW / Math.abs(nx || 1e-6), HH / Math.abs(ny || 1e-6)) + 10;
      const s0 = Math.hypot(150 * nx, 112 * ny);
      const sp = K.line(spokeG, DX + nx * s0, DY + ny * s0, cx - nx * tEdge, cy - ny * tEdge, { stroke: C.greenLight, 'stroke-width': 5, 'stroke-dasharray': '2 12' });
      spokes.push(sp);
      cards.push(card);
      const t = Math.max(tPrev + 0.45, at(1, ph, 0.46 + i * 0.075, 0.25));
      tl.fromTo(sp, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power1.out' }, t);
      A.in(tl, card, t + 0.05, 'pop', { dur: 0.55 });
      tPrev = t;
    });

    // ---------- beat 2: the life icons fade; a 'Boss?' crown hovers over the dog and fades; the dog faces a trigger
    const t2 = cue(2);
    A.out(tl, [l1, ...cards, ...spokes], t2 - 0.35, 'fade', { dur: 0.45 });
    const DX2 = 400, DY2 = 690, DS2 = 0.84;
    tl.to(D.outer, { x: DX2 - DX, y: DY2 - DY, scale: DS2 / DS, svgOrigin: `${DX} ${DY}`, duration: 1.0, ease: 'power3.inOut' }, t2 - 0.1);
    const P = (lx, ly) => [DX2 + (lx - 222) * DS2, DY2 + (ly - 168) * DS2]; // dog-local point after the move
    const LC = C1.layer(stage);
    const l2 = C1.put(LC, 'c1-big', 'A reaction isn’t a *power struggle*', { x: 100, y: 300 });
    A.in(tl, l2, t2 + 0.2, 'fadeUp', { dur: 0.8 });
    const [hx, hy] = P(322, 36);
    const HX = hx - 10, HY = hy - 92;
    const crown = C1.badge(LC, 'crown', HX, HY, 112, '#eceee8', C.inkSoft);
    Object.assign(crown.style, { border: '5px solid #fff', boxShadow: 'var(--shadow-soft)' });
    const boss = C1.put(LC, 'c1d-boss', 'Boss?', { x: HX + 76, y: HY - 20 });
    const tCrown = clamp(at(2, 'take over the household', 0.2, 0.2), t2 + 1.0, end(2) - 7);
    A.in(tl, crown, tCrown, 'pop', { dur: 0.6 });
    A.in(tl, boss, tCrown + 0.35, 'fadeRight', { dur: 0.5 });
    const tGone = clamp(at(2, 'responding to something', 0.55, 0.2), tCrown + 2.0, end(2) - 3.5);
    tl.to([crown, boss], { opacity: 0, y: -26, duration: 0.7, ease: 'power2.in' }, tGone);
    // the trigger, in front of the dog
    const [nx, ny] = P(399, 80);
    const TX = 900, TY = ny + 6;
    const trig = C1.badge(LC, 'dog', TX, TY, 136, C.amberPale, C.amberText);
    Object.assign(trig.style, { border: '5px solid #fff', boxShadow: '0 10px 24px rgba(120,70,10,0.16)' });
    const tlab = C1.put(LC, 'c1d-tlab', 'In the moment', { x: TX - 150, y: TY + 88, w: 300, color: C.amberText });
    const sl = K.svg(LC, { x: 0, y: 0, w: 1920, h: 1080 });
    const sight = K.line(sl, nx + 22, ny + 2, nx + 22, ny + 2, { stroke: C.amber, 'stroke-width': 6, 'stroke-dasharray': '3 14' });
    const tTrig = Math.max(tGone + 0.3, at(2, 'something happening', 0.7, 0.3));
    A.in(tl, trig, tTrig, 'pop', { dur: 0.6 });
    A.in(tl, tlab, tTrig + 0.25, 'fadeUp', { dur: 0.5 });
    tl.fromTo(sight, { opacity: 0 }, { opacity: 1, duration: 0.2 }, tTrig + 0.2);
    tl.to(sight, { attr: { x2: TX - 90, y2: TY }, duration: 0.6, ease: 'power2.out' }, tTrig + 0.2);

    // ---------- beat 3: 'Suppress' in red over the dog fades; 'Understand' and 'Help' replace it in green
    const t3 = cue(3);
    A.out(tl, l2, t3 - 0.3, 'fade', { dur: 0.4 });
    const LD = C1.layer(stage);
    const l3 = C1.put(LD, 'c1-big', 'Suppressing behavior ≠ *changing behavior*', { x: 100, y: 300 });
    A.in(tl, l3, t3 + 0.1, 'fadeUp', { dur: 0.8 });
    const PX = HX + 10, PY = HY - 42;
    const sup = pill(LD, 'red', 'ban', 'Suppress', { x: PX, y: PY, center: true });
    const tSup = clamp(at(3, 'suppress behavior through', 0.3, 0.3), t3 + 0.8, end(3) - 8);
    A.in(tl, sup, tSup, 'pop', { dur: 0.6 });
    const tOff = clamp(at(3, 'But suppressing', 0.55, 0.1), tSup + 1.6, end(3) - 4.5);
    tl.to(sup, { opacity: 0, scale: 0.85, duration: 0.5, ease: 'power2.in' }, tOff);
    const row = K.el('div', 'c1d-row');
    Object.assign(row.style, { left: PX - 400 + 'px', top: PY + 'px', width: '800px' });
    LD.appendChild(row);
    const und = pill(row, 'green', 'lightbulb', 'Understand');
    const help = pill(row, 'green', 'hand-heart', 'Help');
    const tU = Math.max(tOff + 0.5, at(3, 'understanding why', 0.72, 0.3));
    A.in(tl, und, tU, 'pop', { dur: 0.6 });
    A.in(tl, help, Math.max(tU + 0.6, at(3, 'helping them', 0.88, 0.3)), 'pop', { dur: 0.6 });

    // ---------- beat 4: everything fades; a green heart pulses once over the bowl
    const t4 = cue(4);
    A.out(tl, [LB, LC, LD], t4 - 0.15, 'fade', { dur: 0.6 });
    const LE = C1.layer(stage);
    const kind = C1.put(LE, 'c1-best', 'Be kind to yourself', { x: 100, y: 440 });
    const ul = K.el('div', 'accent-bar');
    Object.assign(ul.style, { left: '104px', top: '568px', width: '160px' });
    LE.appendChild(ul);
    const tKind = clamp(at(4, 'be kind to yourself', 0.1, 0.3), t4 + 0.4, end(4) - 4);
    A.in(tl, kind, tKind, 'fadeUp', { dur: 0.9 });
    A.in(tl, ul, tKind + 0.5, 'grow', { dur: 0.6 });
    const HBX = C1.STD.cx, HBY = C1.STD.y - 400 * C1.STD.s;
    const ring = K.el('div', 'c1-heart');
    Object.assign(ring.style, { left: HBX - 70 + 'px', top: HBY - 70 + 'px', width: '140px', height: '140px', borderRadius: '50%', border: '5px solid ' + C.greenLight, opacity: 0 });
    stage.appendChild(ring);
    const heart = K.el('div', 'c1-heart');
    Object.assign(heart.style, { left: HBX - 56 + 'px', top: HBY - 56 + 'px', width: '112px', height: '112px' });
    const hs = K.icon('heart', { size: 112, stroke: 1.6, color: C.green });
    hs.setAttribute('fill', C.green);
    heart.appendChild(hs);
    stage.appendChild(heart);
    const tH = t4 + 0.35;
    A.in(tl, heart, tH, 'pop', { dur: 0.6 });
    tl.to(heart, { scale: 1.25, duration: 0.28, ease: 'power2.out', yoyo: true, repeat: 1 }, tH + 0.8);
    tl.fromTo(ring, { opacity: 0.9, scale: 0.7 }, { opacity: 0, scale: 1.6, duration: 1.0, ease: 'power2.out', immediateRender: false }, tH + 0.85);
    tl.fromTo(B.glow, { opacity: 0 }, { opacity: 0.6, duration: 1.2, ease: 'power2.out', immediateRender: false }, tH + 0.85);
  });

  // ================================================================== ch01s09 Pain and discomfort
  registerScene('ch01s11', ctx => {
    const { stage, tl, cue, end } = ctx;
    const { B } = C1.sceneBase(ctx, 'Pain and discomfort', 7);
    css(stage);
    const at = (i, p, fb, lead) => C1.sayAt(ctx, i, p, fb, lead);

    // ---------- beat 0: the chip drops in; a dog with sore spots; six things that can hurt, one per word
    const cap = C1.caption(stage, 7, C1.STD.cx, C1.CAP_Y);
    C1.dropIn(tl, B, 7, cue(0) - 0.1);
    A.in(tl, cap, cue(0) + 0.35, 'fadeUp', { dur: 0.6 });
    tl.fromTo(B.glow, { opacity: 0 }, { opacity: 0.4, duration: 1.0, ease: 'power2.out', immediateRender: false }, cue(0) + 1.4);
    const LA = C1.layer(stage);
    const l0 = C1.put(LA, 'c1-big', 'Pain can *change behavior*', { x: 100, y: 300 });
    A.in(tl, l0, cue(0) + 0.5, 'fadeUp', { dur: 0.8 });
    const sa = K.svg(LA, { x: 0, y: 0, w: 1920, h: 1080 });
    const D = dogAt(sa, 610, 572, 0.95);
    const tDog = clamp(at(0, 'A dog who is hurting', 0.2, 0.3), cue(0) + 1.0, end(0) - 9);
    A.in(tl, D.outer, tDog, 'fadeUp', { dur: 0.8 });
    const SPOTS = [[290, 150], [204, 124], [128, 160], [302, 250], [124, 254]];
    SPOTS.forEach(([x, y], i) => soreSpot(tl, D, x, y, tDog + 0.8 + i * 0.18, cue(1) - 0.4));
    const SENS = [['Touch', 'hand', 'touched'], ['Bumping', 'chevrons-right-left', 'bumped'], ['Approach', 'footprints', 'approached'],
      ['Handling', 'grab', 'handled'], ['Noise', 'volume-2', 'things happening'], ['Movement', 'move', 'their environment']];
    let tPrev = tDog + 0.8;
    SENS.forEach(([nm, ic, w], i) => {
      const n = K.el('div', 'c1d-sens');
      const ib = K.el('div', 'ib');
      ib.appendChild(K.icon(ic));
      n.appendChild(ib);
      n.appendChild(K.el('div', 't', nm));
      Object.assign(n.style, { left: 610 + (i - 2.5) * 172 - 85 + 'px', top: '768px' });
      LA.appendChild(n);
      const t = Math.max(tPrev + 0.4, at(0, w, 0.62 + i * 0.06, 0.2));
      A.in(tl, n, t, 'pop', { dur: 0.55 });
      tPrev = t;
    });

    // ---------- beat 1: the icons clear; a dog who looks fine, question marks around them; then the same dog leans away from a hand
    const t1 = cue(1);
    A.out(tl, LA, t1 - 0.35, 'fade', { dur: 0.45 });
    const LB = C1.layer(stage);
    const l1 = C1.put(LB, 'c1-big', 'Pain isn’t *always obvious*', { x: 100, y: 300 });
    A.in(tl, l1, t1 + 0.1, 'fadeUp', { dur: 0.8 });
    const PW = 490, PH = 500, PY = 404;
    const mkPanel = x => {
      const p = K.el('div', 'c1d-panel');
      Object.assign(p.style, { left: x + 'px', top: PY + 'px', width: PW + 'px', height: PH + 'px' });
      LB.appendChild(p);
      const s = K.svg(p, { x: 0, y: 0, w: PW, h: PH });
      return { p, s };
    };
    const P1 = mkPanel(100), P2 = mkPanel(630);
    const d1 = dogAt(P1.s, 245, 236, 0.8);
    const lab1 = K.el('div', 'c1d-plab', 'Looks fine');
    Object.assign(lab1.style, { top: '420px', color: C.muted });
    P1.p.appendChild(lab1);
    A.in(tl, P1.p, t1 + 0.2, 'fadeUp', { dur: 0.8 });
    const QM = [[46, 60, -12], [392, 46, 10], [420, 244, 8], [30, 250, -8]];
    const qms = QM.map(([x, y, r]) => {
      const q = K.el('div', 'c1d-qm', '?');
      Object.assign(q.style, { left: x + 'px', top: y + 'px' });
      P1.p.appendChild(q);
      gsap.set(q, { rotation: r });
      return q;
    });
    const tQ = clamp(at(1, 'always limp', 0.3, 0.5), t1 + 1.0, end(1) - 7);
    qms.forEach((q, i) => {
      tl.fromTo(q, { opacity: 0, scale: 0.5 }, { opacity: 0.75, scale: 1, duration: 0.5, ease: 'back.out(2)' }, tQ + i * 0.3);
      tl.to(q, { y: -10, duration: 1.3, ease: 'sine.inOut', yoyo: true, repeat: 3 }, tQ + 0.6 + i * 0.3);
    });
    // panel two: the same dog, a hand reaching in, the dog leans away
    const d2 = dogAt(P2.s, 178, 236, 0.8);
    const handG = reachHand(P2.s, 474, 150, 1.08, -16);
    const lab2 = K.el('div', 'c1d-plab');
    lab2.appendChild(K.icon('search', { color: C.green }));
    lab2.appendChild(K.el('span', null, 'A first clue'));
    Object.assign(lab2.style, { top: '420px', color: C.greenDark });
    P2.p.appendChild(lab2);
    const tP2 = clamp(at(1, 'A change in behavior', 0.62, 0.3), tQ + 1.6, end(1) - 3.2);
    A.in(tl, P2.p, tP2, 'fadeUp', { dur: 0.8 });
    tl.fromTo(handG, { x: 150 }, { x: 0, duration: 0.8, ease: 'power2.out' }, tP2 + 0.5);
    lean(tl, d2, tP2 + 1.0, 0.7);
    A.in(tl, lab2, Math.max(tP2 + 1.3, at(1, 'first clues', 0.85, 0.3)), 'fadeUp', { dur: 0.6 });

    // ---------- beat 2: the panels clear; a sudden change forks into Behavior and Physical health; then 'Vet visit first'
    const t2 = cue(2);
    A.out(tl, LB, t2 - 0.35, 'fade', { dur: 0.45 });
    const LC = C1.layer(stage);
    const l2 = C1.put(LC, 'c1-big', 'Behavior change can be *a clue*', { x: 100, y: 300 });
    A.in(tl, l2, t2 + 0.1, 'fadeUp', { dur: 0.8 });
    const sc = K.svg(LC, { x: 0, y: 0, w: 1920, h: 1080 });
    const FY = 630, ZX0 = 404, FX = 640, PXL = 740, BYu = 480, BYd = 780;
    const D3 = dogAt(sc, 250, FY, 0.72);
    A.in(tl, D3.outer, t2 + 0.2, 'fadeUp', { dur: 0.7 });
    const zig = K.path(sc, `M ${ZX0} ${FY} H 450 L 472 ${FY - 34} L 500 ${FY + 34} L 528 ${FY - 34} L 556 ${FY + 34} L 578 ${FY} H ${FX}`, { stroke: C.amber, 'stroke-width': 9, fill: 'none' });
    const sLab = C1.put(LC, 'c1d-tlab', 'Sudden change', { x: 512 - 150, y: FY + 52, w: 300, color: C.amberText });
    const tSud = clamp(at(2, 'especially a sudden change', 0.2, 0.2), t2 + 0.9, end(2) - 9);
    A.draw(tl, zig, tSud, 0.6, { ease: 'power1.inOut' });
    A.in(tl, sLab, tSud + 0.2, 'fadeUp', { dur: 0.5 });
    const branch = by => [
      K.path(sc, `M ${FX} ${FY} C ${FX + 56} ${FY} ${FX + 44} ${by} ${PXL - 22} ${by}`, { stroke: C.green, 'stroke-width': 8, fill: 'none' }),
      K.path(sc, `M ${PXL - 38} ${by - 15} L ${PXL - 22} ${by} L ${PXL - 38} ${by + 15}`, { stroke: C.green, 'stroke-width': 8, fill: 'none' }),
    ];
    const [up, upH] = branch(BYu), [dn, dnH] = branch(BYd);
    const pB = pill(LC, 'white', 'activity', 'Behavior', { x: PXL, y: BYu - 42 });
    const pH = pill(LC, 'white', 'heart-pulse', 'Physical health', { x: PXL, y: BYd - 42 });
    const tB = clamp(at(2, 'purely behavioral', 0.5, 0.5), tSud + 1.0, end(2) - 5);
    A.draw(tl, up, tB, 0.5);
    tl.fromTo(upH, { opacity: 0 }, { opacity: 1, duration: 0.2 }, tB + 0.4);
    A.in(tl, pB, tB + 0.4, 'fadeRight', { dur: 0.6 });
    const tPH = clamp(at(2, 'pain or another physical', 0.72, 0.5), tB + 1.2, end(2) - 2.5);
    A.draw(tl, dn, tPH, 0.5);
    tl.fromTo(dnH, { opacity: 0 }, { opacity: 1, duration: 0.2 }, tPH + 0.4);
    A.in(tl, pH, tPH + 0.4, 'fadeRight', { dur: 0.6 });
    // 'Vet visit first' lands on the Physical health path
    const link = K.line(sc, PXL + 43, BYd + 46, PXL + 43, BYd + 66, { stroke: C.green, 'stroke-width': 6, 'stroke-dasharray': '2 10' });
    const vet = K.el('div', 'c1d-vet');
    const vi = K.el('div', 'vi');
    vi.appendChild(K.icon('stethoscope'));
    vet.appendChild(vi);
    vet.appendChild(K.el('span', null, 'Vet visit first'));
    Object.assign(vet.style, { left: PXL + 'px', top: BYd + 70 + 'px', height: '88px' });
    LC.appendChild(vet);
    const tVet = Math.max(tPH + 1.0, ctx.phrase(2, 'vet visit', 0.9) - 0.3);
    tl.fromTo(vet, { opacity: 0, y: -70 }, { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.6)' }, tVet);
    tl.fromTo(link, { opacity: 0 }, { opacity: 1, duration: 0.3 }, tVet + 0.3);
    A.pulse(tl, vet, tVet + 0.9, { scale: 1.06 });
  });

  // ================================================================== ch01s10 Putting it together
  registerScene('ch01s12', ctx => {
    const { stage, tl, cue, end, dur, chrome } = ctx;
    C1.style(stage);
    css(stage);
    const at = (i, p, fb, lead) => C1.sayAt(ctx, i, p, fb, lead);
    const h = K.heading(stage, 'Putting it together', { x: 100, y: 120, w: 1400, size: 80 });
    A.in(tl, h.all, 0.05, 'fadeUp', { dur: 0.7, stagger: 0.1 });

    // ---------- beat 0: the bowl at centre with eight blank chips; each ingredient drops in as it is named
    const BC = { cx: 960, y: 590, s: 0.84 };
    const B = C1.makeBowl(stage, { cx: BC.cx, y: BC.y, s: BC.s, filled: 0 });
    tl.fromTo(B.wrap, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' }, 0);
    C1.bob(tl, B, 0, cue(1));
    const LA = C1.layer(stage);
    const legs = C1.ING.map((g, k) => {
      const n = K.el('div', 'c1d-leg');
      const dt = K.el('div', 'dt');
      dt.style.background = g.col;
      dt.appendChild(K.icon(g.icon));
      n.appendChild(dt);
      n.appendChild(K.el('div', 't', g.name));
      Object.assign(n.style, { left: (k < 4 ? 108 : 1412) + 'px', top: 318 + (k % 4) * 120 + 'px' });
      LA.appendChild(n);
      return n;
    });
    const l0 = C1.label(LA, 'Behavior is shaped by *many factors*', 960, 850, { cls: 'c1-big', w: 1400 });
    A.in(tl, l0, clamp(at(0, "isn't explained", 0.2, 0.3), cue(0) + 0.3, end(0) - 8), 'fadeUp', { dur: 0.8 });
    const tG = clamp(at(0, 'Genetics', 0.42, 0.15), cue(0) + 2, end(0) - 6);
    const ORDER = [[0, tG], [1, tG + 0.35], [2, tG + 0.7]];
    let tPrev = tG + 0.7;
    [[3, 'early life'], [4, 'age,'], [7, 'pain and discomfort'], [5, 'past experiences'], [6, 'the methods']].forEach(([k, p], i) => {
      tPrev = Math.max(tPrev + 0.45, at(0, p, 0.5 + i * 0.08, 0.25));
      ORDER.push([k, tPrev]);
    });
    let tLast = 0;
    ORDER.forEach(([k, t]) => {
      tLast = C1.dropIn(tl, B, k, t);
      A.in(tl, legs[k], t + 0.3, 'fadeUp', { dur: 0.6 });
    });
    tl.fromTo(B.glow, { opacity: 0, scale: 0.7, transformOrigin: '50% 50%' }, { opacity: 0.9, scale: 1, duration: 1.1, ease: 'power2.out' }, tLast + 0.2);
    tl.to(B.tokens.map(t => t.inner), { scale: 1.12, transformOrigin: '50% 50%', duration: 0.22, yoyo: true, repeat: 1, stagger: 0.06, ease: 'power1.out' }, tLast + 0.4);

    // ---------- beat 1: the bowl shrinks aside; 'Aggressive behavior' beside a barking dog; 'Aggressive dog' is crossed out
    const t1 = cue(1);
    A.out(tl, LA, t1 - 0.35, 'fade', { dur: 0.45 });
    const SB = { cx: 1560, y: 640, s: 0.5 };
    tl.to(B.wrap, { x: SB.cx - BC.cx, y: SB.y - BC.y, scale: SB.s / BC.s, duration: 1.0, ease: 'power3.inOut' }, t1 - 0.2);
    tl.to(B.glow, { opacity: 0.45, duration: 1.0 }, t1 - 0.2);
    const LB = C1.layer(stage);
    const l1 = C1.put(LB, 'c1-big', 'Describe the *behavior*, not the dog', { x: 100, y: 300 });
    A.in(tl, l1, t1 + 0.3, 'fadeUp', { dur: 0.8 });
    const sb = K.svg(LB, { x: 0, y: 0, w: 1920, h: 1080 });
    const D = dogAt(sb, 330, 624, 0.82);
    const barks = [[412, 58, 102], [436, 42, 118], [460, 26, 134]].map(([x, y0, y1], i) =>
      K.path(D.fx, `M ${x} ${y0} Q ${x + 18 + i * 8} ${(y0 + y1) / 2} ${x} ${y1}`, { stroke: C.red, 'stroke-width': 10, fill: 'none', opacity: 0 }));
    const tDog = t1 + 0.5;
    A.in(tl, D.outer, tDog, 'fadeUp', { dur: 0.8 });
    tl.to(D.fig, { rotation: 3, transformOrigin: '50% 100%', duration: 0.4, ease: 'power2.out' }, tDog + 0.6);
    tl.to(D.tail, { rotation: 22, transformOrigin: '92% 92%', duration: 0.4, ease: 'power2.out' }, tDog + 0.6);
    const nb = Math.max(1, Math.floor((cue(2) - tDog - 1.4) / 0.9));
    barks.forEach((b, i) => tl.fromTo(b, { opacity: 0 }, { opacity: 1, duration: 0.3, yoyo: true, repeat: nb * 2 - 1, repeatDelay: 0.15, ease: 'power1.inOut' }, tDog + 0.8 + i * 0.12));
    const ab = pill(LB, 'white', 'eye', 'Aggressive behavior', { x: 610, y: 488 });
    const tAB = clamp(at(1, 'describe what we see', 0.1, 0.1), tDog + 0.6, end(1) - 6);
    A.in(tl, ab, tAB, 'fadeRight', { dur: 0.7 });
    const ad = pill(LB, 'grey', 'tag', 'Aggressive dog', { x: 610, y: 660 });
    const strike = K.el('div', null, null, { position: 'absolute', left: '-16px', right: '-16px', top: '35px', height: '8px', borderRadius: '4px', background: C.red });
    ad.appendChild(strike);
    const tAD = clamp(at(1, 'an aggressive dog', 0.93, 0.35), tAB + 2, end(1) - 0.6);
    A.pulse(tl, ab, clamp(at(1, 'display aggressive behavior', 0.75, 0.1), tAB + 1, tAD - 0.4), { scale: 1.05 });
    A.in(tl, ad, tAD, 'fadeRight', { dur: 0.5 });
    tl.fromTo(strike, { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: 0.4, ease: 'power2.out' }, tAD + 0.55);
    tl.to(ad, { opacity: 0, duration: 0.5, ease: 'power2.in' }, tAD + 1.35);

    // ---------- beat 2: a dog with the situation, the behavior and what happens around it; they resolve into Understand, then Change
    const t2 = cue(2);
    tl.to([LB, B.wrap], { opacity: 0, duration: 0.5, ease: 'power2.in' }, Math.max(t2 - 0.3, tAD + 1.35));
    const LC = C1.layer(stage);
    const sc = K.svg(LC, { x: 0, y: 0, w: 1920, h: 1080 });
    const linkG = K.group(sc);
    const CX = 960, CY = 690, CS = 0.85;
    const D2 = dogAt(sc, CX, CY, CS);
    A.in(tl, D2.outer, t2 + 0.2, 'fadeUp', { dur: 0.8 });
    const ELS = [['Situation', 'map-pin', 540, 650], ['Behavior', 'activity', 960, 380], ['What happens', 'orbit', 1380, 650]];
    const els = ELS.map(([t, ic, x, y]) => {
      const n = K.el('div', 'c1d-el');
      const ib = K.el('div', 'ib');
      ib.appendChild(K.icon(ic));
      n.appendChild(ib);
      n.appendChild(K.el('div', 't', t));
      Object.assign(n.style, { left: x - 150 + 'px', top: y - 59 + 'px' });
      LC.appendChild(n);
      return n;
    });
    const dash = { stroke: C.greenLight, 'stroke-width': 5, 'stroke-dasharray': '2 12' };
    const links = [K.line(linkG, 616, 652, 792, 684, dash), K.line(linkG, 960, 508, 972, 568, dash), K.line(linkG, 1304, 652, 1128, 684, dash)];
    const tE = clamp(at(2, 'than what we see', 0.15, 0.3), t2 + 0.9, end(2) - 12);
    [0, 1, 2].forEach(i => {
      const t = tE + i * 0.55;
      A.in(tl, els[i], t, 'pop', { dur: 0.6 });
      tl.fromTo(links[i], { opacity: 0 }, { opacity: 1, duration: 0.4 }, t + 0.1);
    });
    // resolve: the three elements gather into the dog, which gives way to 'Understand it.'; then an arrow on to 'Then change it.'
    const RW1 = 500, RW2 = 520, AW = 170, GAP = 34;
    const RX0 = 960 - (RW1 + GAP + AW + GAP + RW2) / 2, RY = 640;
    const uCx = RX0 + RW1 / 2;
    const rowG = C1.layer(stage);
    const uP = pill(rowG, 'green c1d-big', 'lightbulb', 'Understand it.', { x: RX0, y: RY - 50 });
    uP.style.width = RW1 + 'px';
    gsap.set(uP, { x: 960 - uCx });
    const cP = pill(rowG, 'white c1d-big', 'arrow-right', 'Then change it.', { x: RX0 + RW1 + GAP + AW + GAP, y: RY - 50 });
    cP.style.width = RW2 + 'px';
    const ra = K.svg(rowG, { x: 0, y: 0, w: 1920, h: 1080 });
    const [aS, aH] = arrow(ra, RX0 + RW1 + GAP, RY, RX0 + RW1 + GAP + AW, RY, { width: 10, head: 28 });
    const tU = clamp(at(2, "understand what's happening", 0.53, 0.5), tE + 2.2, end(2) - 5);
    els.forEach((n, i) => {
      const [, , x, y] = ELS[i];
      tl.to(n, { x: CX - x, y: RY - y, scale: 0.3, opacity: 0, duration: 0.7, ease: 'power2.in' }, tU);
    });
    tl.to(links, { opacity: 0, duration: 0.3 }, tU);
    tl.to(D2.outer, { opacity: 0, scale: 0.8, svgOrigin: `${CX} ${CY}`, duration: 0.6, ease: 'power2.in' }, tU + 0.2);
    A.in(tl, uP, tU + 0.6, 'pop', { dur: 0.7 });
    const tA = clamp(at(2, 'use that information', 0.85, 0.2), tU + 1.6, end(2) - 1.6);
    tl.to(uP, { x: 0, duration: 0.7, ease: 'power3.inOut' }, tA - 0.5);
    A.draw(tl, [aS, aH], tA + 0.1, 0.45, { stagger: 0.3 });
    const tC = Math.max(tA + 0.7, at(2, 'change the behavior', 0.94, 0.3));
    A.in(tl, cP, tC, 'pop', { dur: 0.7 });
    tl.to(cP, { backgroundColor: C.green, color: '#fff', borderColor: C.green, duration: 0.4 }, tC + 0.5);
    tl.to(cP.querySelector('.ic'), { backgroundColor: 'rgba(255,255,255,0.22)', color: '#fff', duration: 0.4 }, tC + 0.5);

    // ---------- close: the corner logo steps aside; the Calling All Dogs logo and url settle at centre
    const tL = Math.max(tC + 1.0, Math.min(end(2) + 0.15, dur - 1.9));
    tl.to([h.root, LC], { opacity: 0, duration: 0.5, ease: 'power2.in' }, tL - 0.1);
    tl.to(chrome.logo, { opacity: 0, duration: 0.4 }, tL);
    tl.to(rowG, { y: 104, scale: 0.8, transformOrigin: '960px 640px', duration: 0.9, ease: 'power3.inOut' }, tL - 0.1);
    const halo = K.el('div', 'c1d-halo');
    Object.assign(halo.style, { left: '360px', top: '190px', width: '1200px', height: '560px' });
    stage.appendChild(halo);
    A.in(tl, halo, tL + 0.1, 'fade', { dur: 1.0 });
    const logo = K.el('img', null, null, { position: 'absolute', left: '610px', top: '248px', width: '700px' });
    logo.src = '../assets/img/logo.png';
    stage.appendChild(logo);
    tl.fromTo(logo, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out' }, tL + 0.15);
    const url = C1.put(stage, 'c1d-close', 'callingalldogsny.com', { x: 0, y: 580 });
    A.in(tl, url, tL + 0.45, 'fadeUp', { dur: 0.6 });
  });
})();
