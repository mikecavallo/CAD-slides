// Part 1, one-chapter version: scenes built by group a.
//   ch01s01  Aggression and reactivity   two photo circles, aggression chips, the smoke alarm for toast, Venn, 'Label' to 'starting point'
//   ch01s02  Look beyond the label        behavior chips, the 'excuse me' line analogy, one bark four meanings, context, Before / Behavior / After
//   ch01s03  The ABCs                     big A, B, C letters with arrows, question labels, the C to B loop
(() => {
  const C = {
    green: '#619537', greenDark: '#3f6b22', greenDeep: '#2c4a17', greenLight: '#b8d99a', pale: '#e8f1dc', mist: '#f3f8ec',
    ink: '#212121', muted: '#7a7a7a', red: '#b8452d', redPale: '#f8e3dd', amber: '#d9912b', amberText: '#a8650f', olive: '#4b5a1e',
  };

  const CSS = `
  .v4a-abs { position:absolute; }
  .v4a-rowc { position:absolute; display:flex; justify-content:center; align-items:center; gap:16px; }
  .v4a-chip { position:relative; font-size:30px; padding:14px 26px 14px 20px; }
  .v4a-chip.red svg { color:var(--red); }
  .v4a-fchip { justify-content:center; padding:0 18px; gap:12px; font-size:32px; box-shadow:0 10px 26px rgba(40,60,20,0.14); }
  .v4a-fchip svg { width:32px; height:32px; }

  /* photo circles */
  .v4a-cw { position:absolute; }
  .v4a-ring { position:absolute; left:-6px; top:-6px; right:-6px; bottom:-6px; border-radius:50%; border:6px solid; }
  .v4a-circ { position:absolute; left:0; top:0; right:0; bottom:0; border-radius:50%; overflow:hidden; border:8px solid #fff;
    background:#e9ece4; box-shadow:var(--shadow); }
  .v4a-circ img { position:absolute; display:block; height:auto; max-width:none; }
  .v4a-name { position:absolute; display:grid; place-items:center; border-radius:999px; background:#fff; border:4px solid;
    font:700 40px/1 var(--font-head); box-shadow:var(--shadow-soft); white-space:nowrap; }
  .v4a-name.red { color:var(--red); border-color:var(--red); }
  .v4a-name.amber { color:${C.amberText}; border-color:var(--amber); }

  /* captions and cards */
  .v4a-cap { position:absolute; text-align:center; font:700 46px/1.15 var(--font-head); color:var(--ink); white-space:nowrap; }
  .v4a-label { position:absolute; display:inline-flex; align-items:center; gap:12px; padding:14px 28px 14px 20px; border-radius:16px;
    background:var(--green-deep); color:#fff; font:700 36px/1 var(--font-head); white-space:nowrap; border:3px solid #fff;
    box-shadow:0 14px 30px rgba(20,40,10,0.34); }
  .v4a-label svg { width:36px; height:36px; }
  .v4a-start { display:inline-flex; align-items:center; gap:28px; padding:20px 50px 20px 20px; border-radius:26px; background:var(--green);
    color:#fff; font:700 44px/1.1 var(--font-head); white-space:nowrap; box-shadow:var(--shadow); }
  .v4a-start .ib { flex:0 0 auto; width:80px; height:80px; border-radius:50%; background:#fff; color:var(--green); display:grid; place-items:center; }
  .v4a-start .ib svg { width:44px; height:44px; }
  .v4a-start .soft { color:#e3f1d3; }

  /* people, dogs, bubbles, tags */
  .v4a-fig { position:absolute; border-radius:50%; display:grid; place-items:center; background:var(--green-pale); color:var(--green-dark);
    border:6px solid #fff; box-shadow:var(--shadow-soft); }
  .v4a-fig svg { width:56%; height:56%; }
  .v4a-fig.other { background:#eceee8; color:var(--ink-soft); }
  .v4a-fig.dog { background:var(--green); color:#fff; }
  .v4a-space { position:absolute; border-radius:50%; border:4px dashed #b8d99a; }
  .v4a-bub { position:absolute; padding:20px 34px; border-radius:30px; background:var(--green); color:#fff; font:700 38px/1.1 var(--font-body);
    white-space:nowrap; box-shadow:0 12px 28px rgba(44,74,23,0.20); }
  .v4a-bub .tail { position:absolute; width:32px; height:32px; background:inherit; transform:rotate(45deg); }
  .v4a-bub .tail.b { bottom:-14px; border-radius:0 0 7px 0; }
  .v4a-bub .tail.t { top:-14px; border-radius:7px 0 0 0; }
  .v4a-bub.white { background:#fff; color:var(--green-dark); }
  .v4a-tag { position:absolute; padding:12px 26px; border-radius:999px; background:var(--green); color:#fff; font:700 30px/1.1 var(--font-body);
    white-space:nowrap; box-shadow:0 8px 20px rgba(44,74,23,0.20); }
  .v4a-emo { position:absolute; border-radius:50%; display:grid; place-items:center; border:5px solid #fff; box-shadow:0 10px 24px rgba(40,60,20,0.18); }
  .v4a-emo svg { width:54%; height:54%; stroke-width:2.4; }
  .v4a-emo.amber { background:var(--amber-pale); color:${C.amberText}; }
  .v4a-emo.green { background:var(--green-pale); color:var(--green-dark); }

  /* Before / Behavior / After boxes */
  .v4a-bhead { position:absolute; text-align:center; font:700 50px/1 var(--font-head); color:var(--green-dark); white-space:nowrap; }
  .v4a-frame { position:absolute; border-radius:24px; border:6px solid var(--olive); background:rgba(255,255,255,0.8); box-shadow:var(--shadow-soft); }

  /* ABC letters */
  .v4a-col { position:absolute; display:flex; flex-direction:column; align-items:center; text-align:center; }
  .v4a-disc { width:200px; height:200px; border-radius:50%; background:#fff; border:6px solid var(--green-light); display:grid; place-items:center;
    font:800 124px/1 var(--font-head); color:var(--green); padding-top:4px;
    box-shadow:0 0 0 0px rgba(97,149,55,0), 0 14px 34px rgba(40,60,20,0.14); }
  .v4a-word { font:700 50px/1.1 var(--font-head); color:var(--ink); margin-top:28px; white-space:nowrap; }
  .v4a-desc { font:500 36px/1.25 var(--font-body); color:var(--ink-soft); margin-top:10px; white-space:nowrap; }
  .v4a-halo { position:absolute; width:200px; height:200px; border-radius:50%; border:6px solid var(--green); opacity:0; }
  `;

  // ------------------------------------------------------------------ helpers
  const addCss = stage => stage.appendChild(K.el('style', null, CSS));
  const box = (parent, cls, html, o) => {
    const n = K.el('div', cls, html == null ? null : K.md(html));
    K.place(n, o || {});
    parent.appendChild(n);
    return n;
  };
  // time of a phrase inside beat i, leading it slightly, never before the beat's cue
  const sayAt = ctx => (i, phrase, lead = 0.25, fb = 0.5) => Math.max(ctx.cue(i), ctx.phrase(i, phrase, fb) - lead);
  // chip with icon for flex rows
  function chip(parent, text, icon, tone) {
    const c = K.el('div', 'chip v4a-chip' + (tone ? ' ' + tone : ''));
    c.appendChild(K.icon(icon, { stroke: 2.4 }));
    c.appendChild(K.el('span', null, K.md(text)));
    parent.appendChild(c);
    return c;
  }
  // fixed-size chip (known geometry, so it can fly between layouts)
  function fixedChip(parent, text, icon, o) {
    const c = K.el('div', 'chip v4a-fchip');
    K.place(c, { x: o.x, y: o.y, w: o.w, h: o.h });
    c.appendChild(K.icon(icon, { stroke: 2.4 }));
    c.appendChild(K.el('span', null, text));
    parent.appendChild(c);
    return c;
  }
  // centered caption line
  const caption = (stage, html, y) => box(stage, 'v4a-cap', html, { x: 160, y, w: 1600 });
  // speech bubble centred on cx with its top at y. tail: 'bl' | 'br' | 'tl' | 'tr' (bottom/top, left/right)
  function bubble(parent, html, o) {
    const b = box(parent, 'v4a-bub' + (o.white ? ' white' : ''), html, { x: o.cx, y: o.y });
    gsap.set(b, { xPercent: -50 });
    const tail = K.el('div', 'tail ' + o.tail[0]);
    if (o.tail[1] === 'l') tail.style.left = '40px'; else tail.style.right = '40px';
    b.appendChild(tail);
    b.__origin = (o.tail[1] === 'l' ? '12% ' : '88% ') + (o.tail[0] === 'b' ? '100%' : '0%');
    return b;
  }
  const bubbleIn = (tl, b, t) =>
    tl.fromTo(b, { opacity: 0, scale: 0.4, transformOrigin: b.__origin }, { opacity: 1, scale: 1, duration: 0.55, ease: 'back.out(1.8)' }, t);
  // Lucide icon drawn inside an svg, centred on (x, y)
  function svgIcon(svg, name, x, y, size, attrs = {}) {
    const k = size / 24;
    const g = K.group(svg, Object.assign({ transform: `translate(${x - size / 2} ${y - size / 2}) scale(${k})`, fill: 'none', stroke: C.ink, 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, attrs));
    g.innerHTML = (window.ICONS || {})[name] || '';
    return g;
  }
  // straight arrow with an open chevron head: {g, shaft, head}
  function arrow(svg, x1, y1, x2, y2, o = {}) {
    const g = K.group(svg);
    const len = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / len, uy = (y2 - y1) / len;
    const sw = o.width ?? 8, hl = o.head ?? 26, a = (40 * Math.PI) / 180, ang = Math.atan2(uy, ux);
    const shaft = K.line(g, x1, y1, x2 - ux * 3, y2 - uy * 3, { stroke: o.color || C.green, 'stroke-width': sw });
    const ax = x2 - hl * Math.cos(ang - a), ay = y2 - hl * Math.sin(ang - a);
    const bx = x2 - hl * Math.cos(ang + a), by = y2 - hl * Math.sin(ang + a);
    const head = K.path(g, `M${ax} ${ay} L${x2} ${y2} L${bx} ${by}`, { stroke: o.color || C.green, 'stroke-width': sw, fill: 'none' });
    return { g, shaft, head };
  }
  const arrowIn = (tl, a, t, d = 0.45) => {
    tl.fromTo(a.g, { opacity: 0 }, { opacity: 1, duration: 0.05, ease: 'none' }, t);
    A.draw(tl, a.shaft, t, d);
    A.draw(tl, a.head, t + d - 0.05, 0.2);
  };

  // smoke alarm badge with red sound arcs blasting to the right (from the ch02 archive)
  function smokeAlarm(svg, o) {
    const x = o.x, y = o.y, r = o.r;
    const g = K.group(svg);
    const arcG = K.group(g);
    const span = ((o.span ?? 28) * Math.PI) / 180;
    const arcD = rr => `M${x + rr * Math.cos(-span)} ${y + rr * Math.sin(-span)} A${rr} ${rr} 0 0 1 ${x + rr * Math.cos(span)} ${y + rr * Math.sin(span)}`;
    const arcs = o.radii.map((rr, i) => K.path(arcG, arcD(rr), { stroke: C.red, 'stroke-width': 10 - i, opacity: 0 }));
    const ripple = K.path(g, arcD(o.radii[o.radii.length - 1]), { stroke: C.red, 'stroke-width': 6, opacity: 0 });
    const body = K.group(g);
    K.circle(body, x, y, r, { fill: C.redPale, stroke: '#fff', 'stroke-width': 6 });
    const shake = K.group(body);
    svgIcon(shake, 'alarm-smoke', x, y + 2, r * 1.3, { stroke: C.red, 'stroke-width': 1.9 });
    return { g, body, shake, arcG, arcs, ripple, x, y };
  }
  // pop the alarm in at t; arcs blast at tBlast and swell until tEnd
  function alarmRing(tl, al, t, tBlast, tEnd) {
    const org = `${al.x} ${al.y}`;
    tl.fromTo(al.body, { opacity: 0, scale: 0.5, svgOrigin: org }, { opacity: 1, scale: 1, svgOrigin: org, duration: 0.7, ease: 'back.out(1.8)' }, t);
    tl.fromTo(al.arcs, { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.12, ease: 'power2.out' }, tBlast);
    const swell = Math.max(1.2, tEnd - tBlast);
    tl.fromTo(al.arcG, { scale: 0.55, svgOrigin: org }, { scale: 1.1, svgOrigin: org, duration: swell, ease: 'power2.out' }, tBlast);
    const shakes = Math.max(2, Math.min(40, Math.floor((swell * 0.6) / 0.07 / 2) * 2));
    tl.to(al.shake, { rotation: 7, svgOrigin: org, duration: 0.07, repeat: shakes - 1, yoyo: true, ease: 'sine.inOut' }, tBlast);
    const period = 0.9, n = Math.max(1, Math.floor((swell - 0.6) / period));
    tl.fromTo(al.ripple, { opacity: 0.6, scale: 1.1, svgOrigin: org }, { opacity: 0, scale: 1.22, svgOrigin: org, duration: period, ease: 'power1.out', repeat: n - 1, immediateRender: false }, tBlast + 0.8);
  }
  // a small slice of toast with one wisp of smoke, centred on (tx, ty) at scale s
  function toast(svg, tx, ty, s) {
    const g = K.group(svg);
    K.svgEl('ellipse', { cx: tx, cy: ty + 44 * s, rx: 54 * s, ry: 9 * s, fill: '#e3e7dd' }, g);
    const tb = K.group(g, { transform: `translate(${tx - 40 * s} ${ty - 44 * s}) scale(${s})` });
    const shape = 'M9 36 C-1 33 -1 7 20 5 C28 -1 52 -1 60 5 C81 7 81 33 71 36 L71 82 Q71 88 65 88 L15 88 Q9 88 9 82 Z';
    K.path(tb, shape, { fill: '#c98a45', stroke: '#9c6128', 'stroke-width': 3 });
    K.path(tb, shape, { fill: '#efc47e', stroke: 'none', transform: 'translate(40 50) scale(0.74) translate(-40 -50)' });
    K.path(tb, 'M24 50 L40 66 M36 42 L56 62', { stroke: '#d59b55', 'stroke-width': 4 });
    const top = ty - 44 * s;
    const wisp = K.path(g, `M${tx - 6} ${top - 10} c -9 -9 9 -16 0 -26 M${tx + 10} ${top - 8} c -7 -7 7 -12 0 -20`, { stroke: '#b9beb2', 'stroke-width': 4 });
    return { g, wisp };
  }

  // ================================================================== ch01s01: Aggression and reactivity
  registerScene('ch01s01', (ctx) => {
    const { stage, tl, cue, dur } = ctx;
    const at = sayAt(ctx);
    addCss(stage);

    const h = K.heading(stage, 'Aggression and reactivity', { x: 100, y: 120, w: 1400, size: 84 });
    A.in(tl, h.title, Math.max(0.05, cue(0) - 0.2), 'wipe', { dur: 1.1 });
    A.in(tl, h.bar, cue(0) + 0.6, 'grow', { dur: 0.6 });

    // two photo circles side by side; later they slide together into a Venn
    const R = 200, CY = 480, CXS = [540, 1380], VX = [830, 1090];
    const defs = [
      { src: 'photo_aggression.jpg', name: 'Aggression', tone: 'red', col: C.red, img: { width: '178.6%', left: '-1.8%', top: '-50%' }, origin: '29% 36%' },
      { src: 'photo_reactivity.jpg', name: 'Reactivity', tone: 'amber', col: C.amber, img: { width: '150%', left: '-34%', top: '0%' }, origin: '59% 30%' },
    ];
    const circ = defs.map((d, i) => {
      const wrap = box(stage, 'v4a-cw', null, { x: CXS[i] - R, y: CY - R, w: 2 * R, h: 2 * R });
      const ring = box(wrap, 'v4a-ring');
      ring.style.borderColor = d.col;
      const ph = box(wrap, 'v4a-circ');
      const img = K.el('img');
      img.src = '../assets/img/' + d.src;
      Object.assign(img.style, d.img);
      ph.appendChild(img);
      gsap.set(img, { transformOrigin: d.origin });
      A.kenburns(tl, img, { from: 1.0, to: 1.08 });
      return { wrap, ring, ph, img };
    });
    const PW = 300, PH = 72;
    const pills = defs.map((d, i) => box(stage, 'v4a-name ' + d.tone, d.name, { x: CXS[i] - PW / 2, y: CY + R - 32, w: PW, h: PH }));

    // ---- beat 1: circles slide in on "two words", each label lands on its word
    const tIn = at(0, 'two words', 0.3, 0.12);
    A.in(tl, circ[0].wrap, tIn, 'fadeRight', { dur: 0.9 });
    A.in(tl, circ[1].wrap, tIn + 0.2, 'fadeLeft', { dur: 0.9 });
    const tNa = Math.max(tIn + 0.8, at(0, 'aggression and reactivity', 0.2, 0.42));
    const tNr = Math.max(tNa + 0.5, at(0, 'reactivity', 0.2, 0.54));
    A.in(tl, pills[0], tNa, 'pop', { dur: 0.6 });
    A.in(tl, pills[1], tNr, 'pop', { dur: 0.6 });

    // ---- beat 2: five chips under the aggression circle, one per word
    const CHIPS = [
      ['Threaten', 'triangle-alert', 'threatens'], ['Push away', 'hand', 'pushes away'], ['Control', 'lock', 'controls'],
      ['Protect', 'shield', 'protects'], ['Harm', 'octagon-alert', 'causes harm'],
    ];
    const rowA = box(stage, 'v4a-rowc', null, { x: CXS[0] - 450, y: 776, w: 900 });
    const rowB = box(stage, 'v4a-rowc', null, { x: CXS[0] - 450, y: 856, w: 900 });
    const chips = CHIPS.map((d, k) => chip(k < 3 ? rowA : rowB, d[0], d[1], 'red'));
    let prev = cue(1);
    chips.forEach((c, k) => {
      const t = Math.max(prev, at(1, CHIPS[k][2], 0.15));
      A.in(tl, c, t, 'pop', { dur: 0.55 });
      prev = t + 0.3;
    });

    // ---- beat 3: reactivity circle flares, then the smoke alarm screams at a tiny slice of toast
    const t2 = cue(2);
    tl.to(circ[1].ring, { boxShadow: '0 0 0 16px rgba(217,145,43,0.28)', duration: 0.45, yoyo: true, repeat: 1, ease: 'sine.inOut' }, t2 + 0.1);
    A.pulse(tl, circ[1].ph, t2 + 0.1, { scale: 1.04 });
    const AS = { x: 1000, y: 728, w: 760, h: 250 };
    const asv = K.svg(stage, AS);
    asv.style.overflow = 'hidden';
    const al = smokeAlarm(asv, { x: 170, y: 124, r: 60, radii: [92, 132, 172, 212], span: 29 });
    const ts = toast(asv, 640, 138, 0.72);
    const tAl = at(2, 'smoke alarm', 0.3, 0.6);
    const tBl = Math.max(tAl + 0.6, at(2, 'screams', 0.2, 0.7));
    alarmRing(tl, al, tAl, tBl, cue(3) + 0.4);
    const tT = Math.max(tBl + 0.6, ctx.phrase(2, 'every time', 0.8), ctx.phrase(2, 'make toast', 0.93) - 0.6);
    tl.fromTo(ts.g, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5 }, tT);
    tl.fromTo(ts.wisp, { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.0, ease: 'power1.inOut' }, tT + 0.2);

    // ---- beat 4: chips and alarm clear, circles slide together into a Venn, overlap tints green
    const t3 = cue(3);
    A.out(tl, [...chips, asv], t3 + 0.3, 'fade', { dur: 0.45 });
    const tm = t3 + 0.55, md = 1.1;
    circ.forEach((c, i) => tl.to(c.wrap, { x: VX[i] - CXS[i], duration: md, ease: 'power3.inOut' }, tm));
    // labels move out to the sides, level with the circles' centres
    const side = R + 6 + 34 + PW / 2;
    tl.to(pills[0], { x: VX[0] - side - CXS[0], y: CY - (CY + R - 32 + PH / 2), duration: md, ease: 'power3.inOut' }, tm);
    tl.to(pills[1], { x: VX[1] + side - CXS[1], y: CY - (CY + R - 32 + PH / 2), duration: md, ease: 'power3.inOut' }, tm);
    // full rings on top so both circles read whole, and the tinted lens
    const vs = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const RR = R + 3, half = (VX[1] - VX[0]) / 2, hh = Math.sqrt(RR * RR - half * half);
    const lens = K.path(vs, `M 960 ${CY - hh} A ${RR} ${RR} 0 0 1 960 ${CY + hh} A ${RR} ${RR} 0 0 1 960 ${CY - hh} Z`,
      { fill: C.greenLight, 'fill-opacity': 0.72, stroke: C.green, 'stroke-width': 4 });
    const rings = VX.map((x, i) => K.circle(vs, x, CY, RR, { fill: 'none', stroke: defs[i].col, 'stroke-width': 6 }));
    const tv = tm + md - 0.05;
    A.in(tl, rings, tv, 'fade', { dur: 0.35 });
    tl.to(circ.map(c => c.ring), { opacity: 0, duration: 0.35 }, tv);
    A.in(tl, lens, tv + 0.25, 'fade', { dur: 0.6 });
    tl.to(lens, { attr: { 'fill-opacity': 0.9 }, duration: 0.45, yoyo: true, repeat: 1, ease: 'sine.inOut' }, tv + 0.9);
    const cap = caption(stage, 'They overlap, but they’re *not the same*', 738);
    A.in(tl, cap, Math.max(tv + 0.7, at(3, "but it doesn't", 0.2, 0.3)), 'fadeUp', { dur: 0.7 });

    // ---- beat 5: 'Label' tag lands on the overlap, an arrow runs down to the starting-point card
    const t4 = cue(4);
    A.out(tl, cap, t4 - 0.1, 'fade', { dur: 0.35 });
    // the beat is short: tag, arrow and card land in quick succession while 'the label is only the starting point' is said
    const tTag = Math.max(t4 + 0.1, at(4, 'the label', 0.4, 0.2));
    const tag = box(stage, 'v4a-label', null, { x: 960, y: CY - 36 });
    tag.appendChild(K.icon('tag', { stroke: 2.4 }));
    tag.appendChild(K.el('span', null, 'Label'));
    gsap.set(tag, { xPercent: -50 });
    tl.fromTo(tag, { opacity: 0, y: -80, scale: 1.35, rotation: -16 }, { opacity: 1, y: 0, scale: 1, rotation: -5, duration: 0.55, ease: 'back.out(1.7)' }, tTag);
    const asvg = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const arr = arrow(asvg, 960, CY + 48, 960, 786, { width: 9, head: 28 });
    const tArr = tTag + 0.35;
    arrowIn(tl, arr, tArr, 0.4);
    const row = box(stage, 'v4a-rowc', null, { x: 160, y: 800, w: 1600 });
    const card = K.el('div', 'v4a-start');
    const ib = K.el('div', 'ib');
    ib.appendChild(K.icon('flag', { stroke: 2.4 }));
    card.appendChild(ib);
    card.appendChild(K.el('span', null, 'The starting point, <span class="soft">not the whole story</span>'));
    row.appendChild(card);
    const tCard = Math.min(tArr + 0.4, dur - 1.7);
    A.in(tl, card, tCard, 'fadeUp', { dur: 0.6 });
  });

  // ================================================================== ch01s02: Look beyond the label
  registerScene('ch01s02', (ctx) => {
    const { stage, tl, cue } = ctx;
    const at = sayAt(ctx);
    addCss(stage);

    const h = K.heading(stage, 'Look beyond the label', { x: 100, y: 120, w: 1400, size: 84 });
    A.in(tl, h.title, Math.max(0.05, cue(0) - 0.2), 'wipe', { dur: 1.1 });
    A.in(tl, h.bar, cue(0) + 0.6, 'grow', { dur: 0.6 });

    // ---- beat 1: seven behavior chips in one row, one per word
    const BEH = [
      ['Bark', 'volume-2', 176, 'bark'], ['Growl', 'audio-lines', 200, 'growl'], ['Lunge', 'chevrons-right', 196, 'lunge'],
      ['Snap', 'zap', 176, 'snap'], ['Freeze', 'snowflake', 208, 'freeze'], ['Move away', 'footprints', 262, 'move away'], ['Bite', 'octagon-alert', 162, 'bite'],
    ];
    const GAP = 20, CHH = 68, ROWY = 530, SHY = 272, SH = 0.82;
    const total = BEH.reduce((s, b) => s + b[2], 0) + GAP * (BEH.length - 1);
    const rowX = 960 - total / 2;
    const row = box(stage, 'v4a-abs', null, { x: rowX, y: ROWY, w: total, h: CHH });
    gsap.set(row, { scale: 1.04, transformOrigin: '50% 0%' }); // a little larger while the row is the only content
    let x = 0;
    const bch = BEH.map(([t, ic, w]) => { const c = fixedChip(row, t, ic, { x, y: 0, w, h: CHH }); x += w + GAP; return c; });
    let prev = cue(0) + 0.8;
    bch.forEach((c, k) => {
      const t = Math.max(prev, at(0, BEH[k][3], 0.15));
      A.in(tl, c, t, 'pop', { dur: 0.55 });
      prev = t + 0.22;
    });

    // ---- beat 2: chips shrink up; the 'excuse me' line, then the person becomes a dog
    const t1 = cue(1);
    tl.to(row, { y: SHY - ROWY, scale: SH, transformOrigin: '50% 0%', duration: 0.8, ease: 'power3.inOut' }, t1 - 0.1);
    const CAPY = 868;
    const cap1 = caption(stage, 'Behavior is *information*', CAPY);
    A.in(tl, cap1, t1 + 0.5, 'fadeUp', { dur: 0.7 });

    const MX = 960, MY = 600, FR = 100, SPACE = 176, OX = 1400, OX2 = 1172, SHIFT = 36;
    const space = box(stage, 'v4a-space', null, { x: MX - SPACE, y: MY - SPACE, w: 2 * SPACE, h: 2 * SPACE });
    const me = box(stage, 'v4a-fig', null, { x: MX - FR, y: MY - FR, w: 2 * FR, h: 2 * FR });
    me.appendChild(K.icon('user', { stroke: 1.8 }));
    const other = box(stage, 'v4a-fig other', null, { x: OX - FR, y: MY - FR, w: 2 * FR, h: 2 * FR });
    other.appendChild(K.icon('user', { stroke: 1.8 }));
    const excuse = bubble(stage, 'Excuse me.', { cx: MX - SHIFT - 150, y: 382, tail: 'br', white: true });
    const tF = t1 + 0.7;
    A.in(tl, [me, other], tF, 'pop', { dur: 0.7, stagger: 0.12 });
    A.in(tl, space, tF + 0.25, 'scale', { dur: 0.6 });
    const creep = Math.max(tF + 1.0, at(1, 'stands too close', 0.1, 0.2));
    tl.to(other, { x: -(OX - OX2) * 0.5, duration: 0.45, ease: 'power2.inOut' }, creep);
    tl.to(other, { x: -(OX - OX2), duration: 0.45, ease: 'power2.inOut' }, creep + 0.55);
    tl.to(space, { borderColor: C.amber, duration: 0.4 }, creep + 0.7);
    // you shift: the crowded person eases away, taking their space with them
    const tShift = Math.max(creep + 1.1, at(1, 'you shift', 0.1, 0.4));
    tl.to([me, space], { x: -SHIFT, duration: 0.55, ease: 'power2.inOut' }, tShift);
    const tEx = Math.max(tShift + 0.8, at(1, 'excuse me', 0.2, 0.55));
    bubbleIn(tl, excuse, tEx);

    const dog = box(stage, 'v4a-fig dog', null, { x: MX - SHIFT - FR, y: MY - FR, w: 2 * FR, h: 2 * FR });
    dog.appendChild(K.icon('dog', { stroke: 1.7 }));
    const tSw = Math.max(tEx + 1.0, at(1, 'dogs do the same', 0.2, 0.7));
    A.out(tl, excuse, tSw - 0.1, 'fade', { dur: 0.35 });
    tl.to(me, { opacity: 0, scale: 0.6, duration: 0.35, ease: 'power2.in' }, tSw);
    tl.fromTo(dog, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }, tSw + 0.25);
    const TAGS = [['Hard stare', 'hard stare'], ['Stiff body', 'stiff body'], ['Growl', 'or a growl']];
    let tp = tSw + 0.7;
    TAGS.forEach(([t, say], k) => {
      const g = box(stage, 'v4a-tag', t, { x: MX - SHIFT - SPACE - 26, y: MY - 128 + k * 92 });
      gsap.set(g, { xPercent: -100 });
      const tt = Math.max(tp, at(1, say, 0.2, 0.8 + k * 0.06));
      tl.fromTo(g, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.55, ease: 'power3.out' }, tt);
      tp = tt + 0.35;
      TAGS[k].el = g;
    });

    // ---- beat 3: one Bark chip at centre, four meanings around it
    const t2 = cue(2);
    A.out(tl, [space, dog, other, cap1, ...TAGS.map(t => t.el)], t2 - 0.15, 'fade', { dur: 0.45 });
    A.out(tl, bch.slice(1), t2 - 0.05, 'fade', { dur: 0.4 });
    // the row's Bark chip hands off to a free copy that flies to the centre and grows
    const BW = BEH[0][2], BCX = 960, BCY = 590, BIG = 1.5;
    const fromX = 960 + (rowX + BW / 2 - 960) * SH, fromY = SHY + (CHH / 2) * SH;
    const bark = fixedChip(stage, 'Bark', 'volume-2', { x: BCX - BW / 2, y: BCY - CHH / 2, w: BW, h: CHH });
    const tFly = t2 + 0.25;
    tl.set(bch[0], { opacity: 0 }, tFly);
    tl.fromTo(bark, { opacity: 1, x: fromX - BCX, y: fromY - BCY, scale: SH }, { x: 0, y: 0, scale: BIG, duration: 0.9, ease: 'power3.inOut', immediateRender: false }, tFly);
    tl.set(bark, { opacity: 0 }, 0);
    const MEAN = [
      ['Go away', 640, 378, 'br', 'go away'], ['Come closer', 1280, 378, 'bl', 'come closer'],
      ['Give me that', 640, 718, 'tr', 'give me that'], ['Too much energy', 1280, 718, 'tl', 'arousal boiling'],
    ];
    const bubs = MEAN.map(m => bubble(stage, m[0], { cx: m[1], y: m[2], tail: m[3] }));
    const cap2 = caption(stage, 'Same bark, *different meanings*', CAPY);
    A.in(tl, cap2, Math.max(tFly + 0.8, at(2, 'the same bark', 0.2, 0.35)), 'fadeUp', { dur: 0.7 });
    prev = tFly + 1.0;
    bubs.forEach((b, k) => {
      const t = Math.max(prev, at(2, MEAN[k][4], 0.2, 0.45 + k * 0.15));
      bubbleIn(tl, b, t);
      prev = t + 0.4;
    });

    // ---- beat 4: two dogs, the same Bark chip, different feelings above
    const t3 = cue(3);
    A.out(tl, [...bubs, cap2], t3 - 0.15, 'fade', { dur: 0.4 });
    const DX = [640, 1280], DY = 540, DR = 110, CHY = 700;
    const dogs = DX.map(dx => {
      const d = box(stage, 'v4a-fig dog', null, { x: dx - DR, y: DY - DR, w: 2 * DR, h: 2 * DR });
      d.appendChild(K.icon('dog', { stroke: 1.7 }));
      return d;
    });
    A.in(tl, dogs, t3 + 0.15, 'pop', { dur: 0.7, stagger: 0.15 });
    const bark2 = fixedChip(stage, 'Bark', 'volume-2', { x: BCX - BW / 2, y: BCY - CHH / 2, w: BW, h: CHH });
    tl.to(bark, { x: DX[0] - BCX, y: CHY + CHH / 2 - BCY, scale: 1, duration: 0.9, ease: 'power3.inOut' }, t3 + 0.3);
    tl.fromTo(bark2, { opacity: 0, x: 0, y: 0, scale: BIG }, { opacity: 1, duration: 0.2, ease: 'none' }, t3 + 0.3);
    tl.to(bark2, { x: DX[1] - BCX, y: CHY + CHH / 2 - BCY, scale: 1, duration: 0.9, ease: 'power3.inOut' }, t3 + 0.3);
    const EMO = [['triangle-alert', 'amber'], ['heart', 'green']];
    const ES = 104;
    const emos = DX.map((dx, i) => {
      const e = box(stage, 'v4a-emo ' + EMO[i][1], null, { x: dx + 70 - ES / 2, y: DY - 92 - ES / 2, w: ES, h: ES });
      e.appendChild(K.icon(EMO[i][0]));
      return e;
    });
    const tE = Math.max(t3 + 1.3, at(3, 'for different reasons', 0.2, 0.3));
    A.in(tl, emos[0], tE, 'pop', { dur: 0.6 });
    A.in(tl, emos[1], tE + 0.45, 'pop', { dur: 0.6 });
    const cap3 = caption(stage, '*Context* matters', CAPY);
    A.in(tl, cap3, Math.max(tE + 1.0, at(3, 'context matters', 0.2, 0.88)), 'fadeUp', { dur: 0.7 });

    // ---- beat 5: three empty boxes, left to right, with arrows between
    const t4 = cue(4);
    A.out(tl, [...dogs, ...emos, bark, bark2, cap3], t4 - 0.15, 'fade', { dur: 0.45 });
    const BXW = 440, BXH = 280, BXG = 120, BXY = 480;
    const bx0 = 960 - (3 * BXW + 2 * BXG) / 2;
    const WORDS = [['Before', 'happened before', 0.2], ['Behavior', 'what the dog did', 0.55], ['After', 'and what happened after', 0.8]];
    const bsv = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const cols = WORDS.map(([w], i) => {
      const x0 = bx0 + i * (BXW + BXG);
      const head = box(stage, 'v4a-bhead', w, { x: x0, y: BXY - 78, w: BXW });
      const fr = box(stage, 'v4a-frame', null, { x: x0, y: BXY, w: BXW, h: BXH });
      return { head, fr, x0 };
    });
    const arrs = [0, 1].map(i => {
      const xa = cols[i].x0 + BXW + 24, xb = cols[i + 1].x0 - 24;
      return arrow(bsv, xa, BXY + BXH / 2, xb, BXY + BXH / 2, { color: C.olive, width: 9, head: 24 });
    });
    prev = t4 + 0.1;
    WORDS.forEach(([, say, fb], i) => {
      const t = Math.max(prev, at(4, say, 0.1, fb));
      if (i > 0) arrowIn(tl, arrs[i - 1], t - 0.2, 0.35);
      A.in(tl, [cols[i].head, cols[i].fr], t, 'fadeRight', { dur: 0.6, stagger: 0.06 });
      prev = t + 0.6;
    });
  });

  // ================================================================== ch01s03: The ABCs
  registerScene('ch01s03', (ctx) => {
    const { stage, tl, cue } = ctx;
    const at = sayAt(ctx);
    addCss(stage);

    const h = K.heading(stage, 'The ABCs', { x: 100, y: 120, w: 1000, size: 84 });
    A.in(tl, h.title, Math.max(0.05, cue(0) - 0.2), 'wipe', { dur: 1.0 });
    A.in(tl, h.bar, cue(0) + 0.5, 'grow', { dur: 0.6 });

    // ---- beat 1: big A, B, C drop in with arrows between them
    const CX = [390, 960, 1530], TOP = 356, DS = 200;
    const LET = ['A', 'B', 'C'];
    const WORD = ['Antecedent', 'Behavior', 'Consequence'];
    const DESC = ['What happens before?', 'What does the dog do?', 'What happens after?'];
    const cols = CX.map((cx, i) => {
      const col = box(stage, 'v4a-col', null, { x: cx - 270, y: TOP, w: 540 });
      const d = box(col, 'v4a-disc', LET[i]);
      const w = box(col, 'v4a-word', WORD[i]);
      const s = box(col, 'v4a-desc', DESC[i]);
      return { d, w, s };
    });
    const tD = Math.max(cue(0) + 1.0, at(0, 'with the ABCs', 0.5, 0.75));
    cols.forEach((c, i) => tl.fromTo(c.d, { opacity: 0, y: -90 }, { opacity: 1, y: 0, duration: 0.65, ease: 'back.out(1.5)' }, tD + i * 0.15));
    const sv = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const AY = TOP + DS / 2;
    const arrs = [[CX[0] + DS / 2 + 36, CX[1] - DS / 2 - 36], [CX[1] + DS / 2 + 36, CX[2] - DS / 2 - 36]]
      .map(([x1, x2]) => arrow(sv, x1, AY, x2, AY, { width: 8, head: 28 }));
    arrs.forEach((a, i) => arrowIn(tl, a, tD + 0.45 + i * 0.15, 0.4));

    // ---- beat 2: a question label under each letter, one per phrase
    const SAYS = [['the antecedent', 0.1], ['the behavior', 0.42], ['the consequence', 0.74]];
    let prev = cue(1);
    cols.forEach((c, i) => {
      const t = Math.max(prev, at(1, SAYS[i][0], 0.2, SAYS[i][1]));
      A.in(tl, [c.w, c.s], t, 'fadeUp', { dur: 0.7, stagger: 0.12 });
      prev = t + 0.8;
    });

    // ---- beat 3: look at all three; C glows and a curved arrow loops from C back to B
    const t2 = cue(2);
    const cap = caption(stage, 'Look at *all three*', 796);
    A.in(tl, cap, t2 + 0.1, 'fadeUp', { dur: 0.7 });
    cols.forEach((c, i) => A.pulse(tl, c.d, t2 + 0.2 + i * 0.15, { scale: 1.06 }));
    const glowT = Math.max(t2 + 1.4, at(2, "what's happening", 0.3, 0.4));
    const halos = [0, 1].map(() => box(stage, 'v4a-halo', null, { x: CX[2] - DS / 2, y: TOP }));
    halos.forEach((hl, k) => {
      tl.set(hl, { opacity: 0.85, scale: 1 }, glowT + k * 0.45);
      tl.to(hl, { opacity: 0, scale: 1.5, duration: 1.3, ease: 'power2.out' }, glowT + k * 0.45);
    });
    tl.to(cols[2].d, {
      backgroundColor: C.green, borderColor: C.green, color: '#fff',
      boxShadow: '0 0 0 18px rgba(97,149,55,0.22), 0 14px 44px rgba(97,149,55,0.5)', duration: 0.6, ease: 'power2.out',
    }, glowT);
    A.pulse(tl, cols[2].d, glowT, { scale: 1.08 });
    // the loop arcs over the top, from the top of C down into the top of B
    const loopT = glowT + 0.5;
    const loop = K.path(sv, `M${CX[2]} ${TOP - 26} C${CX[2]} ${TOP - 156} ${CX[1]} ${TOP - 150} ${CX[1]} ${TOP - 22}`, { stroke: C.green, 'stroke-width': 8 });
    const loopHead = K.path(sv, `M${CX[1] - 22} ${TOP - 42} L${CX[1]} ${TOP - 18} L${CX[1] + 22} ${TOP - 42}`, { stroke: C.green, 'stroke-width': 8 });
    tl.fromTo([loop, loopHead], { opacity: 0 }, { opacity: 1, duration: 0.05, ease: 'none' }, loopT);
    A.draw(tl, loop, loopT, 1.1, { ease: 'power2.inOut' });
    A.draw(tl, loopHead, loopT + 1.05, 0.25);
  });
})();
