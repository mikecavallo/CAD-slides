// Chapter 1 (v5): scenes built by group a. Bowl parts come from window.C1 (c1_bowl.js).
//   ch01s01  Aggression and reactivity   two photo circles, aggression chips + 'Behavior with intent.', the smoke alarm for toast,
//                                        Venn (chips and alarm stay), 'Label' tag to the starting-point card
//   ch01s02  Look beyond the label        seven behavior chips, one big BARK with four situations around it, the situations glow,
//                                        then question marks gather around a dog
(() => {
  const C = {
    green: '#619537', greenDark: '#3f6b22', greenDeep: '#2c4a17', greenLight: '#b8d99a', pale: '#e8f1dc', mist: '#f3f8ec',
    ink: '#212121', inkSoft: '#4a4a4a', muted: '#7a7a7a', red: '#b8452d', redPale: '#f8e3dd', amber: '#d9912b', amberText: '#a8650f',
    olive: '#4b5a1e',
  };

  const CSS = `
  .c1a-abs { position:absolute; }
  .c1a-rowc { position:absolute; display:flex; justify-content:center; align-items:center; gap:16px; }
  .c1a-chip { position:relative; font-size:30px; padding:14px 26px 14px 20px; }
  .c1a-chip.red svg { color:var(--red); }
  .c1a-fchip { justify-content:center; padding:0 18px; gap:12px; font-size:32px; box-shadow:0 10px 26px rgba(40,60,20,0.14); }
  .c1a-fchip svg { width:32px; height:32px; }

  /* photo circles */
  .c1a-cw { position:absolute; }
  .c1a-ring { position:absolute; left:-6px; top:-6px; right:-6px; bottom:-6px; border-radius:50%; border:6px solid; }
  .c1a-circ { position:absolute; left:0; top:0; right:0; bottom:0; border-radius:50%; overflow:hidden; border:8px solid #fff;
    background:#e9ece4; box-shadow:var(--shadow); }
  .c1a-clip { position:absolute; left:0; top:0; right:0; bottom:0; border-radius:50%; overflow:hidden; clip-path:circle(50% at 50% 50%); }
  .c1a-clip img { position:absolute; display:block; height:auto; max-width:none; }
  .c1a-name { position:absolute; display:grid; place-items:center; border-radius:999px; background:#fff; border:4px solid;
    font:700 40px/1 var(--font-head); box-shadow:var(--shadow-soft); white-space:nowrap; }
  .c1a-name.red { color:var(--red); border-color:var(--red); }
  .c1a-name.amber { color:${C.amberText}; border-color:var(--amber); }

  /* captions, intent line, label tag, starting-point card */
  .c1a-cap { position:absolute; text-align:center; font:700 44px/1.15 var(--font-head); color:var(--ink); white-space:nowrap; }
  .c1a-intent { position:absolute; text-align:center; font:700 40px/1.15 var(--font-head); color:var(--ink); white-space:nowrap; }
  .c1a-intent .r { color:var(--red); }
  .c1a-label { position:absolute; display:inline-flex; align-items:center; gap:12px; padding:14px 28px 14px 20px; border-radius:16px;
    background:var(--green-deep); color:#fff; font:700 36px/1 var(--font-head); white-space:nowrap; border:3px solid #fff;
    box-shadow:0 14px 30px rgba(20,40,10,0.34); }
  .c1a-label svg { width:36px; height:36px; }
  .c1a-start { display:inline-flex; align-items:center; gap:28px; padding:20px 50px 20px 20px; border-radius:26px; background:var(--green);
    color:#fff; font:700 44px/1.1 var(--font-head); white-space:nowrap; box-shadow:var(--shadow); }
  .c1a-start .ib { flex:0 0 auto; width:80px; height:80px; border-radius:50%; background:#fff; color:var(--green); display:grid; place-items:center; }
  .c1a-start .ib svg { width:44px; height:44px; }
  .c1a-start .soft { color:#e3f1d3; }

  /* ch01s02: the big BARK chip, situation cards, the dog */
  .c1a-bark { position:absolute; display:flex; align-items:center; justify-content:center; gap:20px; border-radius:999px;
    background:var(--green); color:#fff; font:800 64px/1 var(--font-head); letter-spacing:4px; border:6px solid #fff;
    box-shadow:0 18px 40px rgba(44,74,23,0.28); }
  .c1a-bark svg { width:62px; height:62px; stroke-width:2.4; }
  .c1a-vcard { position:absolute; background:#fff; border-radius:26px; border:3px solid #e6e9e1; box-shadow:var(--shadow-soft); }
  .c1a-vcard svg { position:absolute; left:0; top:0; overflow:visible; }
  .c1a-mean { position:absolute; left:0; right:0; display:flex; justify-content:center; }
  .c1a-mean span { padding:10px 30px 11px; border-radius:999px; background:var(--green); color:#fff; font:700 34px/1.1 var(--font-head);
    white-space:nowrap; box-shadow:0 8px 18px rgba(44,74,23,0.2); }
  .c1a-fig { position:absolute; border-radius:50%; display:grid; place-items:center; background:var(--green); color:#fff;
    border:8px solid #fff; box-shadow:var(--shadow); }
  .c1a-fig svg { width:56%; height:56%; }
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
    const c = K.el('div', 'chip c1a-chip' + (tone ? ' ' + tone : ''));
    c.appendChild(K.icon(icon, { stroke: 2.4 }));
    c.appendChild(K.el('span', null, K.md(text)));
    parent.appendChild(c);
    return c;
  }
  // fixed-size chip (known geometry, so it can fly between layouts)
  function fixedChip(parent, text, icon, o) {
    const c = K.el('div', 'chip c1a-fchip');
    K.place(c, { x: o.x, y: o.y, w: o.w, h: o.h });
    c.appendChild(K.icon(icon, { stroke: 2.4 }));
    c.appendChild(K.el('span', null, text));
    parent.appendChild(c);
    return c;
  }
  // centered caption line
  const caption = (stage, html, y) => box(stage, 'c1a-cap', html, { x: 160, y, w: 1600 });
  // Lucide icon drawn inside an svg, centred on (x, y); the returned outer group is safe to animate
  function svgIcon(svg, name, x, y, size, attrs = {}) {
    const outer = K.group(svg);
    const g = K.group(outer, Object.assign({ transform: `translate(${x - size / 2} ${y - size / 2}) scale(${size / 24})`, fill: 'none', stroke: C.ink, 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, attrs));
    g.innerHTML = (window.ICONS || {})[name] || '';
    if (!(window.ICONS || {})[name]) console.warn('missing icon', name);
    return outer;
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

  // smoke alarm badge with red sound arcs blasting to the right
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

    // two photo circles side by side; later they slide together (a little smaller, a little higher) into a Venn
    const R = 180, CY = 450, CXS = [540, 1380];
    const S = 0.88, VCY = 425, HALF = Math.round(R * S * 0.65), VX = [960 - HALF, 960 + HALF];
    const defs = [
      { src: 'photo_aggression.jpg', name: 'Aggression', tone: 'red', col: C.red, img: { width: '178.6%', left: '-1.8%', top: '-50%' }, origin: '29% 36%' },
      { src: 'photo_reactivity.jpg', name: 'Reactivity', tone: 'amber', col: C.amber, img: { width: '150%', left: '-34%', top: '0%' }, origin: '59% 30%' },
    ];
    const circ = defs.map((d, i) => {
      const wrap = box(stage, 'c1a-cw', null, { x: CXS[i] - R, y: CY - R, w: 2 * R, h: 2 * R });
      const ring = box(wrap, 'c1a-ring');
      ring.style.borderColor = d.col;
      const ph = box(wrap, 'c1a-circ');
      const clip = box(ph, 'c1a-clip');
      const img = K.el('img');
      img.src = '../assets/img/' + d.src;
      Object.assign(img.style, d.img);
      clip.appendChild(img);
      gsap.set(img, { transformOrigin: d.origin });
      A.kenburns(tl, img, { from: 1.0, to: 1.08 });
      return { wrap, ring, ph, img };
    });
    const PW = 300, PH = 72, PY = CY + R - 32;
    const pills = defs.map((d, i) => box(stage, 'c1a-name ' + d.tone, d.name, { x: CXS[i] - PW / 2, y: PY, w: PW, h: PH }));

    // ---- beat 1: circles slide in on "two words", each label lands on its word
    const tIn = at(0, 'two words', 0.3, 0.12);
    A.in(tl, circ[0].wrap, tIn, 'fadeRight', { dur: 0.9 });
    A.in(tl, circ[1].wrap, tIn + 0.2, 'fadeLeft', { dur: 0.9 });
    const tNa = Math.max(tIn + 0.8, at(0, 'aggression and reactivity', 0.2, 0.42));
    const tNr = Math.max(tNa + 0.5, at(0, 'reactivity', 0.2, 0.54));
    A.in(tl, pills[0], tNa, 'pop', { dur: 0.6 });
    A.in(tl, pills[1], tNr, 'pop', { dur: 0.6 });

    // ---- beat 2: five chips, one per word, then 'Behavior with intent.' beneath them
    const ROWA = 706, ROWB = 780, INTY = 866;
    const intent = box(stage, 'c1a-intent', 'Behavior with <span class="r">intent</span>.', { x: CXS[0] - 450, y: INTY, w: 900 });
    const CHIPS = [
      ['Threaten', 'triangle-alert', 'threaten'], ['Push away', 'hand', 'push away'], ['Control', 'lock', 'control'],
      ['Protect', 'shield', 'protect'], ['Harm', 'octagon-alert', 'cause harm'],
    ];
    const rowA = box(stage, 'c1a-rowc', null, { x: CXS[0] - 450, y: ROWA, w: 900 });
    const rowB = box(stage, 'c1a-rowc', null, { x: CXS[0] - 450, y: ROWB, w: 900 });
    const chips = CHIPS.map((d, k) => chip(k < 3 ? rowA : rowB, d[0], d[1], 'red'));
    let prev = cue(1) + 0.6;
    chips.forEach((c, k) => {
      const t = Math.max(prev, at(1, CHIPS[k][2], 0.15, 0.4 + k * 0.08));
      A.in(tl, c, t, 'pop', { dur: 0.55 });
      prev = t + 0.3;
    });
    // the sixth line lands after the chips, as the summary: "Behavior with intent."
    A.in(tl, intent, Math.max(prev + 0.2, at(1, 'It can show up', 0.6, 0.3)), 'fadeUp', { dur: 0.7 });

    // ---- beat 3: reactivity circle flares, then the smoke alarm screams at a tiny slice of toast
    const t2 = cue(2);
    tl.to(circ[1].ring, { boxShadow: '0 0 0 16px rgba(217,145,43,0.28)', duration: 0.45, yoyo: true, repeat: 1, ease: 'sine.inOut' }, t2 + 0.1);
    A.pulse(tl, circ[1].ph, t2 + 0.1, { scale: 1.04 });
    const AS = { x: 1000, y: 686, w: 760, h: 264 };
    const asv = K.svg(stage, AS);
    asv.style.overflow = 'hidden';
    const al = smokeAlarm(asv, { x: 170, y: 128, r: 60, radii: [92, 132, 172, 212], span: 29 });
    const ts = toast(asv, 640, 142, 0.72);
    const tAl = at(2, 'smoke alarm', 0.3, 0.6);
    const tBl = Math.max(tAl + 0.6, at(2, 'screams', 0.2, 0.7));
    alarmRing(tl, al, tAl, tBl, cue(3) + 0.4);
    const tT = Math.max(tBl + 0.6, ctx.phrase(2, 'every time', 0.8), ctx.phrase(2, 'make toast', 0.93) - 0.6);
    tl.fromTo(ts.g, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5 }, tT);
    tl.fromTo(ts.wisp, { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.0, ease: 'power1.inOut' }, tT + 0.2);

    // ---- beat 4: only the circles and their labels move: they slide together into a Venn, the overlap tints green.
    //      The chips, the intent line and the alarm stay where they are.
    const t3 = cue(3);
    const tm = t3 + 0.2, md = 1.1;
    circ.forEach((c, i) => tl.to(c.wrap, { x: VX[i] - CXS[i], y: VCY - CY, scale: S, duration: md, ease: 'power3.inOut' }, tm));
    // labels move out to the sides, level with the circles' centres
    const side = (R + 6) * S + 36 + PW / 2;
    tl.to(pills[0], { x: VX[0] - side - CXS[0], y: VCY - (PY + PH / 2), duration: md, ease: 'power3.inOut' }, tm);
    tl.to(pills[1], { x: VX[1] + side - CXS[1], y: VCY - (PY + PH / 2), duration: md, ease: 'power3.inOut' }, tm);
    // full rings on top so both circles read whole, and the tinted lens
    const vs = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const RR = (R + 3) * S, hh = Math.sqrt(RR * RR - HALF * HALF);
    const lens = K.path(vs, `M 960 ${VCY - hh} A ${RR} ${RR} 0 0 1 960 ${VCY + hh} A ${RR} ${RR} 0 0 1 960 ${VCY - hh} Z`,
      { fill: C.greenLight, 'fill-opacity': 0.72, stroke: C.green, 'stroke-width': 4 });
    const rings = VX.map((x, i) => K.circle(vs, x, VCY, RR, { fill: 'none', stroke: defs[i].col, 'stroke-width': 6 * S }));
    const tv = tm + md - 0.05;
    A.in(tl, rings, tv, 'fade', { dur: 0.35 });
    tl.to(circ.map(c => c.ring), { opacity: 0, duration: 0.35 }, tv);
    A.in(tl, lens, tv + 0.25, 'fade', { dur: 0.6 });
    tl.to(lens, { attr: { 'fill-opacity': 0.9 }, duration: 0.45, yoyo: true, repeat: 1, ease: 'sine.inOut' }, tv + 0.9);
    const CAPY = VCY + RR + 3 + 26;
    const cap = caption(stage, 'They overlap, but they’re *not the same*', CAPY);
    A.in(tl, cap, Math.max(tv + 0.7, at(3, "but it doesn't", 0.2, 0.3)), 'fadeUp', { dur: 0.7 });

    // ---- beat 5: the definitions clear, a 'Label' tag lands on the overlap, an arrow runs down to the starting-point card
    const t4 = cue(4);
    A.out(tl, [cap, intent, ...chips, asv], t4 - 0.1, 'fade', { dur: 0.4 });
    const tTag = Math.max(t4 + 0.2, at(4, 'the label', 0.4, 0.2));
    const tag = box(stage, 'c1a-label', null, { x: 960, y: VCY - 36 });
    tag.appendChild(K.icon('tag', { stroke: 2.4 }));
    tag.appendChild(K.el('span', null, 'Label'));
    gsap.set(tag, { xPercent: -50 });
    tl.fromTo(tag, { opacity: 0, y: -80, scale: 1.35, rotation: -16 }, { opacity: 1, y: 0, scale: 1, rotation: -5, duration: 0.55, ease: 'back.out(1.7)' }, tTag);
    const CARDY = 734;
    const asvg = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const arr = arrow(asvg, 960, VCY + 50, 960, CARDY - 14, { width: 9, head: 28 });
    const tArr = tTag + 0.35;
    arrowIn(tl, arr, tArr, 0.4);
    const row = box(stage, 'c1a-rowc', null, { x: 160, y: CARDY, w: 1600 });
    const card = K.el('div', 'c1a-start');
    const ib = K.el('div', 'ib');
    ib.appendChild(K.icon('flag', { stroke: 2.4 }));
    card.appendChild(ib);
    card.appendChild(K.el('span', null, 'The starting point, <span class="soft">not the whole story</span>'));
    row.appendChild(card);
    const tCard = Math.min(Math.max(tArr + 0.4, at(4, 'starting point', 0.5, 0.8)), dur - 1.4);
    A.in(tl, card, tCard, 'fadeUp', { dur: 0.6 });
  });

  // ================================================================== ch01s02: Look beyond the label
  // a dog badge (green disc, white dog) inside a card svg, with bark arcs to its right
  function vDog(svg, x, y, r) {
    const g = K.group(svg);
    K.circle(g, x, y, r, { fill: C.green, stroke: '#fff', 'stroke-width': 5 });
    svgIcon(g, 'dog', x, y, r * 1.18, { stroke: '#fff', 'stroke-width': 2 });
    return g;
  }
  function vArcs(svg, x, y, radii, dir = 1) {
    const g = K.group(svg);
    const sp = (32 * Math.PI) / 180;
    const arcs = radii.map((rr, i) => K.path(g, `M${x + dir * rr * Math.cos(sp)} ${y - rr * Math.sin(sp)} A${rr} ${rr} 0 0 ${dir > 0 ? 1 : 0} ${x + dir * rr * Math.cos(sp)} ${y + rr * Math.sin(sp)}`,
      { stroke: C.green, 'stroke-width': 6 - i, opacity: 0 }));
    return { g, arcs };
  }
  // three quick bark pulses on the arcs from t
  function barkPulse(tl, arcs, t) {
    tl.fromTo(arcs.arcs, { opacity: 0 }, { opacity: 1, duration: 0.14, stagger: 0.08, ease: 'power1.out', immediateRender: false }, t);
    tl.to(arcs.arcs, { opacity: 0.25, duration: 0.3, stagger: 0.08, ease: 'power1.in' }, t + 0.45);
    tl.to(arcs.arcs, { opacity: 1, duration: 0.14, stagger: 0.08, ease: 'power1.out' }, t + 0.9);
    tl.to(arcs.arcs, { opacity: 0.55, duration: 0.4, stagger: 0.08, ease: 'power1.in' }, t + 1.35);
  }
  // a person seen through a window: frame, pane cross, silhouette behind the glass, sill
  function vWindow(svg, cx, cy) {
    const g = K.group(svg);
    const w = 150, hgt = 134, x0 = cx - w / 2, y0 = cy - hgt / 2;
    K.rect(g, x0, y0, w, hgt, { rx: 12, fill: '#eef5f7', stroke: C.olive, 'stroke-width': 6 });
    const clip = 'c1aw' + Math.round(cx) + Math.round(cy);
    const cp = K.svgEl('clipPath', { id: clip }, g);
    K.rect(cp, x0 + 3, y0 + 3, w - 6, hgt - 6, { rx: 10 });
    const who = K.group(g, { 'clip-path': `url(#${clip})` });
    K.circle(who, cx, cy - 12, 22, { fill: '#8c9a80' });
    K.path(who, `M${cx - 46} ${y0 + hgt + 4} C${cx - 44} ${cy + 22} ${cx + 44} ${cy + 22} ${cx + 46} ${y0 + hgt + 4} Z`, { fill: '#8c9a80', stroke: 'none' });
    K.line(g, cx, y0, cx, y0 + hgt, { stroke: C.olive, 'stroke-width': 4, opacity: 0.55 });
    K.line(g, x0, cy - 6, x0 + w, cy - 6, { stroke: C.olive, 'stroke-width': 4, opacity: 0.55 });
    K.rect(g, x0 - 14, y0 + hgt - 2, w + 28, 12, { rx: 6, fill: C.olive });
    return g;
  }
  // grey person badge
  function vPerson(svg, x, y, r) {
    const g = K.group(svg);
    K.circle(g, x, y, r, { fill: '#e6e9e1', stroke: '#fff', 'stroke-width': 5 });
    svgIcon(g, 'user', x, y, r * 1.16, { stroke: C.inkSoft, 'stroke-width': 2 });
    return g;
  }
  // tennis ball
  function vBall(svg, x, y, r) {
    const g = K.group(svg);
    K.circle(g, x, y, r, { fill: '#cfdc3f', stroke: '#9aab22', 'stroke-width': 3 });
    K.path(g, `M${x - r * 0.72} ${y - r * 0.68} C${x - r * 0.1} ${y - r * 0.3} ${x - r * 0.1} ${y + r * 0.3} ${x - r * 0.72} ${y + r * 0.68}`, { stroke: '#fff', 'stroke-width': 3 });
    K.path(g, `M${x + r * 0.72} ${y - r * 0.68} C${x + r * 0.1} ${y - r * 0.3} ${x + r * 0.1} ${y + r * 0.3} ${x + r * 0.72} ${y + r * 0.68}`, { stroke: '#fff', 'stroke-width': 3 });
    return g;
  }

  registerScene('ch01s02', (ctx) => {
    const { stage, tl, cue, dur } = ctx;
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
    const GAP = 20, CHH = 68, ROWY = 530, RS = 1.04;
    const total = BEH.reduce((s, b) => s + b[2], 0) + GAP * (BEH.length - 1);
    const rowX = 960 - total / 2;
    const row = box(stage, 'c1a-abs', null, { x: rowX, y: ROWY, w: total, h: CHH });
    gsap.set(row, { scale: RS, transformOrigin: '50% 0%' });
    let x = 0;
    const bch = BEH.map(([t, ic, w]) => { const c = fixedChip(row, t, ic, { x, y: 0, w, h: CHH }); x += w + GAP; return c; });
    let prev = cue(0) + 0.8;
    bch.forEach((c, k) => {
      const t = Math.max(prev, at(0, BEH[k][3], 0.15));
      A.in(tl, c, t, 'pop', { dur: 0.55 });
      prev = t + 0.22;
    });

    // ---- beat 2: the Bark chip grows into one big BARK at centre; four situations appear around it, one per sentence
    const t1 = cue(1);
    const tFly = at(1, 'take barking', 0.1, 0.02);
    A.out(tl, bch.slice(1), tFly, 'fade', { dur: 0.4 });
    const BCX = 960, BCY = 566, BW = 380, BH = 124;
    const bark = box(stage, 'c1a-bark', null, { x: BCX - BW / 2, y: BCY - BH / 2, w: BW, h: BH });
    bark.appendChild(K.icon('volume-2', { stroke: 2.4 }));
    bark.appendChild(K.el('span', null, 'BARK'));
    const fromX = 960 + (rowX + BEH[0][2] / 2 - 960) * RS, fromY = ROWY + (CHH / 2) * RS;
    const s0 = (CHH * RS) / BH;
    tl.to(bch[0], { opacity: 0, duration: 0.3, ease: 'power1.in' }, tFly + 0.05);
    tl.fromTo(bark, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power1.out' }, tFly);
    tl.fromTo(bark, { x: fromX - BCX, y: fromY - BCY, scale: s0 }, { x: 0, y: 0, scale: 1, duration: 1.0, ease: 'power3.inOut' }, tFly);

    // situation cards: two left, two right of the BARK chip
    const CW = 500, CH = 270, SVH = 196;
    const CPOS = [[130, 282], [1290, 282], [130, 590], [1290, 590]];
    const SIT = [
      { mean: '“Come closer”', start: 'one dog may bark', say: 'come closer', fb: [0.08, 0.3] },
      { mean: '“Go away”', start: 'another dog may bark', say: 'go away', fb: [0.33, 0.5] },
      { mean: '“Give me that”', start: 'another may bark because it wants access', say: 'access to something', fb: [0.55, 0.66] },
      { mean: '“Too much”', start: 'and another may bark', say: 'too overwhelming', fb: [0.76, 0.95] },
    ];
    // dashed connectors from the BARK chip to each card
    const csv = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const CONN = [[BCX - BW / 2 + 20, BCY - 40, 130 + CW + 16, 282 + CH - 60], [BCX + BW / 2 - 20, BCY - 40, 1290 - 16, 282 + CH - 60],
      [BCX - BW / 2 + 20, BCY + 40, 130 + CW + 16, 590 + 60], [BCX + BW / 2 - 20, BCY + 40, 1290 - 16, 590 + 60]];
    const conns = CONN.map(([x1, y1, x2, y2]) => K.line(csv, x1, y1, x2, y2, { stroke: C.greenLight, 'stroke-width': 5, 'stroke-dasharray': '2 12' }));

    const cards = SIT.map((s, k) => {
      const card = box(stage, 'c1a-vcard', null, { x: CPOS[k][0], y: CPOS[k][1], w: CW, h: CH });
      const svg = K.svgEl('svg', { viewBox: `0 0 ${CW} ${SVH}`, width: CW, height: SVH }, card);
      const mean = box(card, 'c1a-mean', null, { y: SVH + 2 });
      mean.appendChild(K.el('span', null, s.mean));
      return { card, svg, mean };
    });
    const DY = 104;
    // 1: a person at a window, the dog barks at them
    const d1 = vDog(cards[0].svg, 116, DY, 56);
    const a1 = vArcs(cards[0].svg, 116, DY, [76, 96, 116]);
    const win = vWindow(cards[0].svg, 372, DY - 6);
    // 2: a person walking toward the dog
    const d2 = vDog(cards[1].svg, 116, DY, 56);
    const a2 = vArcs(cards[1].svg, 116, DY, [76, 96, 116]);
    const steps = svgIcon(cards[1].svg, 'footprints', 458, DY + 44, 48, { stroke: C.muted, 'stroke-width': 2.2 });
    gsap.set(steps, { rotation: -90, svgOrigin: `458 ${DY + 44}` });
    const p2 = vPerson(cards[1].svg, 372, DY, 54);
    // 3: a person holding a ball
    const d3 = vDog(cards[2].svg, 116, DY, 56);
    const a3 = vArcs(cards[2].svg, 116, DY, [76, 96, 116]);
    const p3 = vPerson(cards[2].svg, 382, DY, 54);
    const ball = vBall(cards[2].svg, 330, DY + 42, 22);
    // 4: a busy scene, the dog in the middle of it all
    const d4 = vDog(cards[3].svg, 250, DY, 56);
    const BUSY = [['car', 64, 50], ['bell-ring', 148, 34], ['bike', 64, 150], ['volume-2', 150, 168], ['bird', 352, 34], ['users', 438, 52],
      ['music', 350, 170], ['siren', 438, 150]];
    const busy = BUSY.map(([n, bx, by]) => svgIcon(cards[3].svg, n, bx, by, 46, { stroke: C.amberText, 'stroke-width': 2.1 }));
    const arcsAll = [a1, a2, a3];

    const tCap = Math.max(tFly + 1.2, at(1, 'one dog may bark', 0.2, 0.08));
    const cap1 = caption(stage, 'The same behavior can have *different reasons*', 882);
    let tp = tFly + 1.0;
    SIT.forEach((s, k) => {
      const c = cards[k];
      const tc = Math.max(tp, at(1, s.start, 0.2, s.fb[0]));
      A.in(tl, c.card, tc, 'pop', { dur: 0.6 });
      A.draw(tl, conns[k], tc - 0.1, 0.5);
      if (k < 3) {
        // the bark: arcs flash on "bark" in this sentence
        const bw = Math.max(tc + 0.35, sayWordAfter(ctx, 1, 'bark', tc) - 0.05);
        barkPulse(tl, arcsAll[k], bw);
      }
      if (k === 1) {
        tl.fromTo(p2, { x: 70 }, { x: 0, duration: 1.3, ease: 'power2.out', immediateRender: false }, tc + 0.2);
        tl.fromTo(steps, { opacity: 0 }, { opacity: 1, duration: 0.5, immediateRender: false }, tc + 1.0);
        gsap.set(steps, { opacity: 0 });
        gsap.set(p2, { x: 70 });
      }
      if (k === 2) tl.fromTo(ball, { y: 0 }, { y: -12, duration: 0.45, yoyo: true, repeat: 3, ease: 'sine.inOut', immediateRender: false }, tc + 0.7);
      if (k === 3) {
        tl.fromTo(busy, { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.4, stagger: 0.12, ease: 'back.out(2)', immediateRender: false }, tc + 0.4);
        gsap.set(busy, { opacity: 0 });
        const tj = tc + 0.4 + 0.12 * busy.length + 0.3;
        const tEnd = Math.min(cue(2) - 0.2, tj + 4);
        const n = Math.max(2, Math.floor((tEnd - tj) / 0.16 / 2) * 2);
        busy.forEach((b, i) => tl.to(b, { rotation: i % 2 ? 8 : -8, transformOrigin: '50% 50%', duration: 0.16, yoyo: true, repeat: n - 1, ease: 'sine.inOut' }, tj + i * 0.04));
      }
      const tm = Math.max(tc + 0.8, at(1, s.say, 0.2, s.fb[1]));
      tl.fromTo(c.mean, { opacity: 0, y: 16, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.8)' }, tm);
      tp = tc + 1.0;
      if (k === 0) A.in(tl, cap1, Math.max(tCap, tm + 0.8), 'fadeUp', { dur: 0.7 });
    });

    // ---- beat 3: everything stays; 'Same behavior. Different context.'; the four situations glow in turn
    const t2 = cue(2);
    A.out(tl, cap1, t2 - 0.1, 'fade', { dur: 0.35 });
    const cap2 = box(stage, 'c1a-cap', null, { x: 160, y: 882, w: 1600 });
    const cA = K.el('span', null, 'Same behavior. ');
    const cB = K.el('span', null, K.md('*Different context.*'));
    cap2.appendChild(cA); cap2.appendChild(cB);
    A.in(tl, cA, Math.max(t2 + 0.3, at(2, 'the behavior is the same', 0.2, 0.1)), 'fadeUp', { dur: 0.6 });
    const g0 = at(2, 'what is happening', 0.2, 0.3), g1 = Math.max(g0 + 1.6, at(2, 'different', 0.3, 0.55));
    const step = (g1 - g0) / 4;
    cards.forEach((c, k) => {
      const t = g0 + k * step;
      tl.to(c.card, { borderColor: C.green, boxShadow: '0 0 0 8px rgba(184,217,154,0.85), 0 16px 44px rgba(97,149,55,0.35)', scale: 1.03, duration: 0.3, ease: 'power2.out' }, t);
      tl.to(c.card, { borderColor: '#e6e9e1', boxShadow: '0 10px 30px rgba(40,60,20,0.10)', scale: 1, duration: 0.5, ease: 'power2.inOut' }, t + Math.max(0.45, step));
    });
    A.in(tl, cB, Math.max(g1 + 0.2, at(2, 'different', 0.1, 0.55)), 'fadeUp', { dur: 0.6 });

    // ---- beat 4: the situations fade; question marks gather around a dog
    const t3 = cue(3);
    A.out(tl, [...cards.map(c => c.card), csv, bark, cap2], t3 - 0.1, 'fade', { dur: 0.45 });
    const DOGX = 960, DOGY = 536, DR = 116;
    const dog = box(stage, 'c1a-fig', null, { x: DOGX - DR, y: DOGY - DR, w: 2 * DR, h: 2 * DR });
    dog.appendChild(K.icon('dog', { stroke: 1.7 }));
    const tDog = t3 + 0.35;
    A.in(tl, dog, tDog, 'pop', { dur: 0.7 });
    const qsv = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    // question marks: an irregular cloud around the dog (x, y, radius), in the order they arrive
    const QS = [[700, 392, 50], [1196, 368, 46], [592, 548, 40], [1326, 520, 56], [846, 290, 38], [1222, 690, 42],
      [690, 696, 56], [1040, 286, 52], [870, 752, 34], [1070, 758, 44]];
    const qs = QS.map(([x, y, r], k) => {
      const outer = K.group(qsv);
      const g = K.group(outer);
      const solid = k === 1 || k === 2 || k === 9;
      K.circle(g, 0, 0, r, solid ? { fill: C.pale, stroke: '#fff', 'stroke-width': 4 } : { fill: 'rgba(255,255,255,0.92)', stroke: '#9fbf7f', 'stroke-width': 4, 'stroke-dasharray': '9 8' });
      K.svgText(g, 0, r * 0.44, '?', { 'font-family': 'Rubik', 'font-size': r * 1.3, 'font-weight': 700, fill: solid ? C.greenDark : C.green, 'text-anchor': 'middle' });
      const fx = DOGX + (x - DOGX) * 1.8, fy = DOGY + (y - DOGY) * 1.8;
      gsap.set(outer, { x, y });
      return { outer, g, x, y, fx, fy };
    });
    const tQ0 = Math.max(tDog + 0.4, at(3, 'what influences', 0.1, 0.1));
    qs.forEach((q, k) => {
      const t = tQ0 + k * 0.14;
      tl.fromTo(q.outer, { x: q.fx, y: q.fy, opacity: 0 }, { x: q.x, y: q.y, opacity: 1, duration: 0.9, ease: 'power3.out' }, t);
      const per = 1.25, st = t + 0.95, n = Math.max(1, Math.floor((dur - st) / per));
      tl.fromTo(q.g, { y: 0 }, { y: -10, duration: per, ease: 'sine.inOut', yoyo: true, repeat: n - 1, immediateRender: false }, st);
    });
    const cap3 = caption(stage, 'What *contributes* to behavior?', 842);
    cap3.style.fontSize = '54px';
    A.in(tl, cap3, Math.max(tQ0 + 1.3, at(3, 'how a dog responds', 0.2, 0.3)), 'fadeUp', { dur: 0.7 });
  });

  // time of the first occurrence of `word` in beat i spoken at or after scene time t (falls back to t + 0.5)
  function sayWordAfter(ctx, i, word, t) {
    const b = ctx.beats[i] || {};
    const w = String(word).toLowerCase();
    if (b.words && b.words.length) {
      const hit = b.words.find(x => x.t >= t - 0.05 && x.w.toLowerCase().replace(/[^a-z']/g, '') === w);
      if (hit) return hit.t;
    }
    return t + 0.5;
  }
})();
