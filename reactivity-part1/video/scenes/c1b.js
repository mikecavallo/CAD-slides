// Chapter 1 (v5): scenes built by group b. Bowl parts come from window.C1 (c1_bowl.js).
//   ch01s03  Why this response?            photo + heading, eight blank chips in an arc, then the bowl arrives under them
//   ch01s04  Nature and genetics           genetics + smoke alarm, prenatal hub, breed tags with dog silhouettes, three chips glow
//   ch01s05  Early life and socialization  timeline window, gaps, overfilled window, pass the puppy, crowd, party and leash
(() => {
  const CSS = `
  .c1b-sub { position: absolute; font: 600 54px/1.16 var(--font-head); color: var(--ink); white-space: nowrap; }
  .c1b-mix { position: absolute; font: 700 76px/1.1 var(--font-head); color: var(--ink); white-space: nowrap; }
  .c1b-note { position: absolute; display: inline-flex; align-items: center; gap: 22px; font: 500 42px/1.2 var(--font-body); color: var(--ink); white-space: nowrap; }
  .c1b-note .ic { width: 76px; height: 76px; border-radius: 50%; display: grid; place-items: center; background: var(--green-pale); color: var(--green-dark); flex: 0 0 auto; }
  .c1b-note .ic svg { width: 42px; height: 42px; stroke-width: 2.1; }
  .c1b-note b { font-weight: 700; color: var(--green); }
  .c1b-btag { position: absolute; display: flex; align-items: center; gap: 20px; height: 92px; padding: 0 30px 0 18px; background: #fff;
    border-radius: 24px; border: 1px solid #e6e9e1; box-shadow: var(--shadow-soft); }
  .c1b-btag .ic { width: 64px; height: 64px; border-radius: 50%; display: grid; place-items: center; background: var(--green-pale); color: var(--green-dark); flex: 0 0 auto; }
  .c1b-btag .ic svg { width: 36px; height: 36px; stroke-width: 2.2; }
  .c1b-btag .nm { font: 700 34px/1 var(--font-head); color: var(--green-dark); white-space: nowrap; }
  .c1b-btag .ds { font: 500 29px/1 var(--font-body); color: var(--ink); margin-top: 8px; white-space: nowrap; }
  .c1b-lab { position: absolute; font: 700 32px/1 var(--font-body); color: var(--ink); text-align: center; white-space: nowrap; }
  .c1b-tick { position: absolute; font: 600 30px/1 var(--font-body); color: var(--ink-soft); white-space: nowrap; }
  .c1b-win { position: absolute; font: 700 42px/1 var(--font-head); color: var(--green-dark); white-space: nowrap; }
  .c1b-miss { position: absolute; display: inline-flex; align-items: center; gap: 14px; padding: 9px 28px 9px 9px; border-radius: 999px;
    background: #fff; border: 3px dashed #b3bda6; font: 600 32px/1 var(--font-body); color: var(--ink-soft); white-space: nowrap; }
  .c1b-miss .ic { width: 50px; height: 50px; border-radius: 50%; background: #eceee8; color: var(--muted); display: grid; place-items: center; }
  .c1b-miss .ic svg { width: 30px; height: 30px; stroke-width: 2.2; }
  .c1b-pin { position: absolute; display: inline-flex; align-items: center; gap: 12px; font: 700 30px/1 var(--font-body); color: var(--green-dark); white-space: nowrap; }
  .c1b-meter { position: absolute; width: 300px; }
  .c1b-meter .t { font: 700 34px/1 var(--font-head); color: var(--ink); display: flex; justify-content: space-between; align-items: baseline; }
  .c1b-meter .t span { font: 600 28px/1 var(--font-body); color: var(--muted); }
  .c1b-meter .bar { margin-top: 16px; height: 30px; border-radius: 15px; background: #e1e7d9; overflow: hidden; }
  .c1b-meter .fill { height: 100%; width: 100%; border-radius: 15px; background: var(--amber); transform-origin: 0 50%; }
  .c1b-meter .ends { margin-top: 10px; display: flex; justify-content: space-between; font: 600 26px/1 var(--font-body); color: var(--muted); }
  .c1b-red { position: absolute; display: inline-flex; align-items: center; gap: 12px; padding: 14px 30px 14px 20px; border-radius: 999px;
    border: 3px solid var(--red); background: #fff; color: var(--red); font: 700 36px/1 var(--font-body); white-space: nowrap; box-shadow: var(--shadow-soft); }
  .c1b-red svg { width: 34px; height: 34px; stroke-width: 2.4; }
  .c1b-list { position: absolute; display: flex; flex-direction: column; gap: 26px; align-items: flex-start; }
  .c1b-list .c1-cap { font-size: 34px; padding: 12px 36px 12px 12px; }
  .c1b-list .c1-dot { width: 60px; height: 60px; }
  .c1b-list .c1-dot svg { width: 34px; height: 34px; }
  `;
  function css(stage) {
    C1.style(stage);
    stage.appendChild(K.el('style', null, CSS));
  }
  const col = () => C1.C;

  // custom icon markup (Lucide has no skateboard)
  const XICON = {
    skateboard: '<path d="M2 10.5c.7 1.5 1.8 2.3 3.4 2.3h13.2c1.6 0 2.7-.8 3.4-2.3"/><path d="M7 12.8v2.2"/><path d="M17 12.8v2.2"/><circle cx="7" cy="17.5" r="2"/><circle cx="17" cy="17.5" r="2"/>',
  };
  /** HTML <svg> icon that also knows the custom names. */
  function hIcon(name) {
    if (!XICON[name]) return K.icon(name);
    const s = K.svgEl('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
    s.innerHTML = XICON[name];
    return s;
  }
  /** Icon inside an svg, centred on (x, y); returns an untransformed wrapper group that is safe to animate. */
  function sIcon(parent, name, x, y, size, attrs = {}) {
    if (!XICON[name]) return C1.svgIcon(parent, name, x, y, size, attrs);
    const k = size / 24;
    const outer = K.group(parent);
    const g = K.group(outer, Object.assign({ transform: `translate(${x - size / 2} ${y - size / 2}) scale(${k})`, fill: 'none', stroke: '#212121', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, attrs));
    g.innerHTML = XICON[name];
    return outer;
  }
  /** Round badge inside an svg: circle + icon, centred on (x, y). Returns {g, inner}: g for position, inner for scale/pop. */
  function sBadge(parent, name, x, y, r, fill, fg, o = {}) {
    const g = K.group(parent);
    gsap.set(g, { x, y });
    const inner = K.group(g);
    K.circle(inner, 0, 0, r, { fill, stroke: o.stroke || '#fff', 'stroke-width': o.sw ?? 5 });
    sIcon(inner, name, 0, 0, r * (o.k ?? 1.1), { stroke: fg, 'stroke-width': o.iw ?? 2.1 });
    return { g, inner };
  }
  /** Subheading swap: a fades up and out, b fades up in. */
  function swap(tl, a, b, t) {
    if (a) A.out(tl, a, t - 0.35, 'fadeUp', { dur: 0.4 });
    A.in(tl, b, t + 0.05, 'fadeUp', { dur: 0.7 });
  }
  /** Icon pill in a positioned div (class cls). */
  function pill(parent, cls, icon, html, x, y) {
    const n = K.el('div', cls);
    Object.assign(n.style, { left: x + 'px', top: y + 'px' });
    const ic = K.el('div', 'ic');
    ic.appendChild(hIcon(icon));
    n.appendChild(ic);
    n.appendChild(K.el('span', null, K.md(html)));
    parent.appendChild(n);
    return n;
  }

  // simple dog silhouettes, side view facing right, drawn in a 100 x 70 box with the feet on y = 68
  const POSE = {
    stand: {
      parts: [['e', 47, 36, 26, 12], ['l', 64, 33, 74, 20, 13], ['c', 77, 16, 9.5], ['l', 81, 19, 93, 22, 8],
        ['l', 29, 40, 27, 66, 7], ['l', 37, 42, 39, 66, 7], ['l', 58, 42, 57, 66, 7], ['l', 66, 40, 68, 66, 7], ['p', 'M 24 32 Q 12 28 11 14', 6]],
      prick: '70,12 73,0 79,9', flop: [71, 19],
    },
    sit: {
      parts: [['l', 42, 50, 59, 29, 22], ['c', 40, 54, 13], ['l', 34, 66, 52, 66, 7], ['l', 57, 36, 58, 66, 7], ['l', 64, 34, 66, 66, 7],
        ['l', 61, 27, 69, 17, 13], ['c', 72, 13, 9.5], ['l', 76, 16, 87, 19, 8], ['p', 'M 29 62 Q 18 67 9 61', 6]],
      prick: '65,9 68,-3 74,6', flop: [66, 16],
    },
    down: {
      parts: [['e', 45, 56, 28, 10], ['c', 29, 57, 10], ['l', 62, 51, 73, 38, 12], ['c', 76, 34, 9.5], ['l', 80, 37, 91, 40, 8],
        ['l', 60, 64, 93, 64, 7], ['p', 'M 19 60 Q 9 64 2 61', 6]],
      prick: '69,30 72,18 78,27', flop: [70, 37],
    },
  };
  /** Dog silhouette standing on (x, y) (bottom centre), scale s. o: {flip, ear:'prick'|'flop'} */
  function dogSil(parent, pose, x, y, s, fill, o = {}) {
    const P = POSE[pose];
    const outer = K.group(parent);
    const g = K.group(outer, { transform: `translate(${x} ${y}) scale(${o.flip ? -s : s} ${s}) translate(-50 -68)`, fill, stroke: fill, 'stroke-linecap': 'round' });
    P.parts.forEach(p => {
      if (p[0] === 'e') K.svgEl('ellipse', { cx: p[1], cy: p[2], rx: p[3], ry: p[4], stroke: 'none' }, g);
      else if (p[0] === 'c') K.svgEl('circle', { cx: p[1], cy: p[2], r: p[3], stroke: 'none' }, g);
      else if (p[0] === 'l') K.svgEl('line', { x1: p[1], y1: p[2], x2: p[3], y2: p[4], 'stroke-width': p[5] }, g);
      else K.svgEl('path', { d: p[1], fill: 'none', 'stroke-width': p[2] }, g);
    });
    if (o.ear === 'flop') K.svgEl('ellipse', { cx: P.flop[0], cy: P.flop[1], rx: 4.5, ry: 8.5, transform: `rotate(18 ${P.flop[0]} ${P.flop[1]})`, stroke: 'none' }, g);
    else K.svgEl('polygon', { points: P.prick, stroke: 'none' }, g);
    return outer;
  }

  // ================================================================== ch01s03 Why this response?
  registerScene('ch01s03', ctx => {
    const { stage, tl, cue, dur } = ctx;
    const { sayAt, clamp } = C1;
    css(stage);

    // beat 0: photo card at left, the heading writes on beside it
    const ph = K.photo(stage, 'photo_why.jpg', { x: 100, y: 150, w: 580, h: 790, pos: '35% 50%' });
    A.in(tl, ph.root, Math.max(0, cue(0) - 0.4), 'fadeRight', { dur: 1.0 });
    A.kenburns(tl, ph.img, { from: 1.03, to: 1.1, t0: 0, t1: cue(1) + 1 });
    const h = K.heading(stage, 'Why this response?', { x: 100, y: 120, w: 1100, size: 92 });
    gsap.set(h.root, { x: 680, y: 290, transformOrigin: '0% 0%' });
    A.in(tl, h.title, cue(0) + 0.2, 'wipe', { dur: 1.1 });
    A.in(tl, h.bar, cue(0) + 1.0, 'grow', { dur: 0.6 });

    // beat 1: the photo slides away, the heading rises, "usually a mix", eight blank chips pop up in an arc
    const t1 = cue(1) - 0.2;
    tl.to(ph.root, { x: -260, opacity: 0, duration: 0.8, ease: 'power2.in' }, t1);
    tl.fromTo(h.root, { x: 680, y: 290, scale: 1 }, { x: 0, y: 0, scale: 0.87, duration: 1.0, ease: 'power3.inOut', immediateRender: false }, t1 + 0.3);
    const mix = C1.put(stage, 'c1b-mix', 'Usually a *mix*', { x: 100, y: 450 });
    const tMix = clamp(sayAt(ctx, 1, 'usually not one thing', 0.2), t1 + 1.2, cue(2) - 3);
    A.in(tl, mix, tMix, 'fadeUp', { dur: 0.8 });

    const B = C1.makeBowl(stage, { cx: 1370, y: 660, s: 0.9, filled: 0 });
    const shadow = B.bodyAll.previousElementSibling;
    const tChips = clamp(sayAt(ctx, 1, 'many underlying factors', 0.55), tMix + 0.8, cue(2) - 1.5);
    tl.fromTo(B.slots.map(sl => sl.g), { opacity: 0, scale: 0.3, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.55, stagger: 0.12, ease: 'back.out(2.2)' }, tChips);
    C1.bob(tl, B, tChips + 1.3, dur);

    // beat 2: the bowl rises in under the hovering chips
    const tB = cue(2) - 0.1;
    tl.fromTo(B.bodyAll, { opacity: 0, y: 90 }, { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' }, tB);
    tl.fromTo(shadow, { opacity: 0 }, { opacity: 0.2, duration: 0.9, ease: 'power2.out' }, tB + 0.3);
    tl.fromTo(B.glow, { opacity: 0 }, { opacity: 0.85, duration: 1.2, ease: 'sine.inOut' }, tB + 0.6);
    const sev = pill(stage, 'c1b-note', 'list-checks', 'Several factors <b>contribute</b>', 100, 592);
    const tSev = clamp(sayAt(ctx, 2, 'several ingredients', 0.5), tB + 0.8, dur - 1.5);
    A.in(tl, sev, tSev, 'fadeUp', { dur: 0.8 });
  });

  // ================================================================== ch01s04 Nature and genetics
  registerScene('ch01s04', ctx => {
    const { stage, tl, cue, dur } = ctx;
    const { sayAt, phraseAt, clamp, STD, CAP_Y, ING } = C1;
    const C = col();
    css(stage);
    const { B } = C1.sceneBase(ctx, 'Nature and genetics', 0);
    const SUB_Y = 296;

    // ---------- beat 0: genetics drops in; some dogs are born more sensitive; a tiny smoke alarm blinks
    const cap0 = C1.caption(stage, 0, STD.cx, CAP_Y);
    const land0 = C1.dropIn(tl, B, 0, clamp(sayAt(ctx, 0, 'genetics', 0.1), cue(0) + 0.1, cue(0) + 2));
    A.in(tl, cap0, land0 - 0.2, 'fadeUp', { dur: 0.6 });

    const LA = C1.layer(stage);
    const card = K.el('div', 'c1-card');
    Object.assign(card.style, { left: '100px', top: '330px', width: '1000px', height: '250px' });
    LA.appendChild(card);
    const dna = C1.badge(LA, 'dna', 206, 455, 130, ING[0].col, '#fff');
    const sens = C1.put(LA, 'c1-big', 'Some dogs are born<br>*more sensitive*', { x: 310, y: 388 });
    A.in(tl, card, land0 - 0.3, 'fadeUp', { dur: 0.7 });
    A.in(tl, dna, land0 - 0.1, 'pop', { dur: 0.6 });
    A.in(tl, sens, land0, 'fadeUp', { dur: 0.7 });

    const asvg = K.svg(LA, { x: 860, y: 365, w: 240, h: 180 });
    const aBody = K.group(asvg);
    K.circle(aBody, 70, 90, 54, { fill: C.redPale, stroke: '#fff', 'stroke-width': 5 });
    C1.svgIcon(aBody, 'alarm-smoke', 70, 92, 64, { stroke: C.red, 'stroke-width': 1.9 });
    const arcD = r => {
      const a = (30 * Math.PI) / 180;
      return `M${70 + r * Math.cos(-a)} ${90 + r * Math.sin(-a)} A${r} ${r} 0 0 1 ${70 + r * Math.cos(a)} ${90 + r * Math.sin(a)}`;
    };
    const arcs = [86, 114, 142].map((r, i) => K.path(asvg, arcD(r), { stroke: C.red, 'stroke-width': 8 - i * 1.5, opacity: 0 }));
    const tAl = Math.max(land0 + 0.7, phraseAt(ctx, 0, 'smoke alarm', 0.6) - 0.3);
    tl.fromTo(aBody, { opacity: 0, scale: 0.5, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2)' }, tAl);
    const blinkEnd = cue(1) - 0.5;
    const nBl = Math.max(2, Math.floor((blinkEnd - tAl - 0.5) / 0.9));
    tl.fromTo(arcs, { opacity: 0 }, { opacity: 1, duration: 0.18, stagger: 0.09, yoyo: true, repeat: nBl * 2 - 1, repeatDelay: 0.27, ease: 'power1.out' }, tAl + 0.5);
    tl.to(aBody, { rotation: 8, transformOrigin: '50% 50%', duration: 0.07, yoyo: true, repeat: 7, ease: 'sine.inOut' }, tAl + 0.5);

    // ---------- beat 1: prenatal environment drops in; health, nutrition and stress gather around it
    A.out(tl, LA, cue(1) - 0.35, 'fadeUp', { dur: 0.45 });
    A.out(tl, cap0, cue(1) - 0.3, 'fade', { dur: 0.35 });
    const cap1 = C1.caption(stage, 1, STD.cx, CAP_Y);
    const land1 = C1.dropIn(tl, B, 1, cue(1) + 0.1);
    A.in(tl, cap1, land1 - 0.2, 'fadeUp', { dur: 0.6 });

    const LB = C1.layer(stage);
    const sub1 = C1.put(LB, 'c1b-sub', 'Before birth *matters too*', { x: 100, y: SUB_Y });
    A.in(tl, sub1, cue(1) + 0.3, 'fadeUp', { dur: 0.8 });
    const HX = 600, HY = 570;
    const hsvg = K.svg(LB, { x: 0, y: 0, w: 1920, h: 1080 });
    const SAT = [
      { x: 300, y: 550, ic: 'dog', lab: 'Health', say: 'health', bg: '#fff', fg: C.greenDark, ring: C.green },
      { x: 600, y: 800, ic: 'soup', lab: 'Nutrition', say: 'nutrition', bg: '#fff', fg: C.greenDark, ring: C.green },
      { x: 900, y: 550, ic: 'zap', lab: 'Stress', say: 'significant stress', bg: C.amberPale, fg: C.amber, ring: C.amber },
    ];
    const links = SAT.map(s => {
      const dx = s.x - HX, dy = s.y - HY, d = Math.hypot(dx, dy);
      const a = [HX + (dx / d) * 96, HY + (dy / d) * 96], b = [s.x - (dx / d) * 76, s.y - (dy / d) * 76];
      return K.path(hsvg, `M ${a[0]} ${a[1]} L ${b[0]} ${b[1]}`, { stroke: '#c3cfb5', 'stroke-width': 5 });
    });
    const hub = sBadge(hsvg, ING[1].icon, HX, HY, 86, ING[1].col, '#fff', { sw: 7, k: 1.05, iw: 2 });
    tl.fromTo(hub.inner, { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.8)' }, land1 + 0.1);
    let tPrev = land1 + 0.5;
    SAT.forEach((s, i) => {
      const b = sBadge(hsvg, s.ic, s.x, s.y, 64, s.bg, s.fg, { stroke: s.ring, sw: 4, k: 1.0, iw: 2 });
      let extra = null;
      if (i === 0) { // pregnant mum: dog with a small heart badge
        extra = K.group(b.inner);
        K.circle(extra, 44, -44, 22, { fill: C.red, stroke: '#fff', 'stroke-width': 4 });
        C1.svgIcon(extra, 'heart', 44, -43, 24, { stroke: '#fff', fill: '#fff', 'stroke-width': 2 });
      }
      const lab = C1.label(LB, s.lab, s.x, s.y + 82, { cls: 'c1b-lab', w: 300 });
      const t = Math.max(tPrev + 0.5, sayAt(ctx, 1, s.say, 0.3 + i * 0.2, 0.2));
      tPrev = t;
      A.draw(tl, links[i], t - 0.1, 0.5);
      tl.fromTo(b.inner, { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2)' }, t + 0.15);
      A.in(tl, lab, t + 0.35, 'fadeUp', { dur: 0.5 });
      if (i === 2) tl.to(b.inner, { rotation: 7, transformOrigin: '50% 50%', duration: 0.07, yoyo: true, repeat: 7, ease: 'sine.inOut' }, t + 0.8);
    });

    // ---------- beat 2: the Lab and Pyrenees photo with the three breed tags, one per phrase
    A.out(tl, LB, cue(2) - 0.35, 'fadeUp', { dur: 0.45 });
    A.out(tl, cap1, cue(2) - 0.3, 'fade', { dur: 0.35 });
    const LC = C1.layer(stage);
    const sub2 = C1.put(LC, 'c1b-sub', 'What was this dog *bred to do?*', { x: 100, y: SUB_Y });
    A.in(tl, sub2, cue(2) + 0.3, 'fadeUp', { dur: 0.8 });
    const ph = K.photo(LC, 'photo_why.jpg', { x: 100, y: 392, w: 340, h: 556, pos: '38% 60%' });
    A.in(tl, ph.root, cue(2) - 0.05, 'fadeRight', { dur: 0.9 });
    A.kenburns(tl, ph.img, { from: 1.02, to: 1.08, t0: cue(2) - 0.05, t1: cue(4) });
    const TAGS = [
      { nm: 'Herders', ds: 'control movement', ic: 'move', say: 'Herders', ear: 'prick' },
      { nm: 'Terriers', ds: 'hunt and pursue', ic: 'rabbit', say: 'terriers', ear: 'prick' },
      { nm: 'Guardians', ds: 'monitor and respond to threats', ic: 'shield', say: 'guardian breeds', ear: 'flop' },
    ];
    const TY0 = 392, TSTEP = 198, TX = 480;
    const dsvg = K.svg(LC, { x: 0, y: 0, w: 1920, h: 1080 });
    const tagEls = [];
    let tT = cue(2) + 1.0;
    TAGS.forEach((g, i) => {
      const y = TY0 + i * TSTEP;
      const n = K.el('div', 'c1b-btag');
      Object.assign(n.style, { left: TX + 'px', top: y + 'px' });
      const ic = K.el('div', 'ic');
      ic.appendChild(K.icon(g.ic));
      n.appendChild(ic);
      const tx = K.el('div');
      tx.appendChild(K.el('div', 'nm', g.nm));
      tx.appendChild(K.el('div', 'ds', g.ds));
      n.appendChild(tx);
      LC.appendChild(n);
      tagEls.push(n);
      tT = Math.max(tT + 0.7, sayAt(ctx, 2, g.say, 0.25 + i * 0.2, 0.25));
      A.in(tl, n, tT, 'fadeLeft', { dur: 0.6 });
    });

    // ---------- beat 3: several dogs of different sizes and poses under each tag
    const sub3 = C1.put(LC, 'c1b-sub', 'Breed gives us *clues*', { x: 100, y: SUB_Y });
    swap(tl, sub2, sub3, cue(3));
    const ROWS = [
      [['stand', 0.74], ['sit', 0.66], ['down', 0.72], ['stand', 0.56, 1], ['sit', 0.8, 1]],
      [['sit', 0.52], ['stand', 0.62, 1], ['down', 0.66], ['stand', 0.8], ['sit', 0.64, 1]],
      [['stand', 0.82], ['down', 0.8, 1], ['sit', 0.82], ['stand', 0.64, 1], ['down', 0.7]],
    ];
    const DC = [C.greenDark, C.green, C.olive, '#7a8f2e', C.greenDeep];
    const dogs = [], grounds = [];
    ROWS.forEach((row, r) => {
      const base = TY0 + r * TSTEP + 92 + 66;
      grounds.push(K.line(dsvg, TX + 12, base + 1, TX + 560, base + 1, { stroke: '#dfe8d3', 'stroke-width': 4 }));
      let x = TX + 20;
      row.forEach(([pose, s, flip], j) => {
        const w = 100 * s;
        const d = dogSil(dsvg, pose, x + w / 2, base, s, DC[(r * 2 + j) % DC.length], { flip, ear: TAGS[r].ear });
        x += w + 30;
        dogs.push(d);
      });
    });
    const tDogs = clamp(sayAt(ctx, 3, 'Individual dogs', 0.45, 0.6), cue(3) + 0.3, cue(4) - 2.5);
    A.draw(tl, grounds, tDogs - 0.3, 0.6, { stagger: 0.1 });
    tl.fromTo(dogs, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.07, ease: 'back.out(2)' }, tDogs);

    // ---------- beat 4: the breed traits chip drops in; the three chips glow together
    tl.to(ph.root, { x: -140, opacity: 0, duration: 0.6, ease: 'power2.in' }, cue(4) - 0.4);
    A.out(tl, [sub3, ...tagEls, dsvg], cue(4) - 0.35, 'fadeUp', { dur: 0.45 });
    const land2 = C1.dropIn(tl, B, 2, cue(4) + 0.2);
    const LD = C1.layer(stage);
    const sub4 = C1.put(LD, 'c1b-sub', 'Every dog *starts somewhere*', { x: 100, y: SUB_Y });
    A.in(tl, sub4, cue(4) + 0.3, 'fadeUp', { dur: 0.8 });
    const list = K.el('div', 'c1b-list');
    Object.assign(list.style, { left: '100px', top: '440px' });
    LD.appendChild(list);
    const items = [0, 1, 2].map(k => {
      const p = K.el('div', 'c1-cap');
      const dot = K.el('div', 'c1-dot');
      dot.style.background = ING[k].col;
      dot.appendChild(K.icon(ING[k].icon));
      p.appendChild(dot);
      p.appendChild(K.el('span', null, ING[k].name));
      list.appendChild(p);
      return p;
    });
    A.in(tl, items.slice(0, 2), cue(4) + 0.6, 'fadeRight', { dur: 0.6, stagger: 0.15 });
    A.in(tl, items[2], land2 - 0.1, 'fadeRight', { dur: 0.6 });
    const tGlow = land2 + 0.5;
    const halos = [0, 1, 2].map(k => {
      const o = B.tokens[k].outer;
      const c = K.circle(o, 0, 0, 58, { fill: '#e6f3d6', stroke: C.greenLight, 'stroke-width': 4, opacity: 0 });
      o.insertBefore(c, o.firstChild);
      return c;
    });
    tl.fromTo(halos, { opacity: 0, scale: 0.7, transformOrigin: '50% 50%' }, { opacity: 0.95, scale: 1, duration: 0.8, stagger: 0.12, ease: 'power2.out' }, tGlow);
    tl.to(B.glow, { opacity: 0.9, duration: 1.2, ease: 'sine.inOut' }, tGlow);
    tl.to([0, 1, 2].map(k => B.tokens[k].inner), { scale: 1.12, transformOrigin: '50% 50%', duration: 0.35, yoyo: true, repeat: 1, stagger: 0.12, ease: 'sine.inOut' }, tGlow + 0.1);
    tl.to(items, { boxShadow: '0 0 0 4px rgba(184,217,154,0.9), 0 12px 30px rgba(97,149,55,0.25)', duration: 0.6, stagger: 0.12 }, tGlow);
    void dur;
  });

  // ================================================================== ch01s05 Early life and socialization
  registerScene('ch01s07', ctx => {
    const { stage, tl, cue, dur } = ctx;
    const { sayAt, clamp, STD, CAP_Y, ING } = C1;
    const C = col();
    css(stage);
    const { B } = C1.sceneBase(ctx, 'Early life and socialization', 3);
    const SUB_Y = 296;
    const at = (i, ph, fb, lead = 0.3) => sayAt(ctx, i, ph, fb, lead);

    // ---------- beat 0: the socialization chip lights up above the bowl
    const sg = B.slots[3].g;
    const lit = K.group(sg);
    K.circle(lit, 0, 0, 44, { fill: ING[3].col, stroke: '#fff', 'stroke-width': 5 });
    C1.svgIcon(lit, ING[3].icon, 0, 0, 46, { stroke: '#fff', 'stroke-width': 2.3 });
    const ring = K.circle(sg, 0, 0, 44, { fill: 'none', stroke: ING[3].col, 'stroke-width': 5 });
    const tLit = clamp(at(0, 'socialization', 0.12), cue(0) + 0.5, cue(0) + 3);
    tl.fromTo(lit, { opacity: 0, scale: 0.5, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2.2)' }, tLit);
    tl.fromTo(ring, { opacity: 0.9, scale: 1, transformOrigin: '50% 50%' }, { opacity: 0, scale: 1.9, duration: 1.0, ease: 'power2.out', repeat: 2, repeatDelay: 0.25 }, tLit + 0.2);
    const cap = C1.caption(stage, 3, STD.cx, CAP_Y);
    A.in(tl, cap, tLit + 0.3, 'fadeUp', { dur: 0.6 });

    // the bowl steps aside (smaller, lower right) for the busy middle of the scene
    const tSide = clamp(at(0, 'help puppies learn', 0.3, 0.1), tLit + 1.6, cue(1) - 4);
    A.out(tl, cap, tSide - 0.2, 'fade', { dur: 0.35 });
    tl.to(B.wrap, { scale: 0.62, x: 130, y: 170, duration: 0.9, ease: 'power3.inOut' }, tSide);

    const sub0 = C1.put(stage, 'c1b-sub', 'Early experiences *matter*', { x: 100, y: SUB_Y });
    A.in(tl, sub0, clamp(at(0, 'Early experiences', 0.2), tLit + 0.6, tSide), 'fadeUp', { dur: 0.8 });

    // timeline: birth to adult, the early window highlighted
    const LT = C1.layer(stage);
    const TX0 = 140, TX1 = 1300, TY = 570, TH = 72, WIN = 700;
    const tsvg = K.svg(LT, { x: 0, y: 0, w: 1920, h: 1080 });
    const track = K.rect(tsvg, TX0, TY, TX1 - TX0, TH, { rx: 36, fill: '#e1e7d9' });
    const win = K.rect(tsvg, TX0, TY, WIN - TX0, TH, { rx: 36, fill: C.green });
    const brk = K.path(tsvg, `M ${TX0 + 2} ${TY - 12} V ${TY - 25} H ${WIN - 2} V ${TY - 12}`, { stroke: C.green, 'stroke-width': 4 });
    const wlab = C1.put(LT, 'c1b-win', 'First few months', { x: TX0, y: TY - 96 });
    const ticks = [C1.put(LT, 'c1b-tick', 'Birth', { x: TX0, y: TY + TH + 22 }), C1.put(LT, 'c1b-tick', 'Adult', { x: TX1 - 200, y: TY + TH + 22, w: 200, align: 'right' })];
    const tTrack = tSide + 0.5;
    A.in(tl, track, tTrack, 'grow', { dur: 0.9 });
    A.in(tl, ticks, tTrack + 0.5, 'fade', { dur: 0.5, stagger: 0.12 });
    const tWin = Math.max(tTrack + 1.2, at(0, 'developmental period', 0.6));
    A.in(tl, win, tWin, 'grow', { dur: 0.8 });
    const tFew = Math.max(tWin + 0.7, at(0, 'first few months', 0.75));
    A.draw(tl, brk, tFew - 0.1, 0.6);
    A.in(tl, wlab, tFew, 'fadeUp', { dur: 0.7 });
    // everyday things the puppy meets in the window
    const CELLS = ['dog', 'user', 'bus', 'skateboard', 'map-pin', 'house'];
    const cw = (WIN - TX0) / CELLS.length, cx = k => TX0 + cw * (k + 0.5);
    const cells = CELLS.map((n, k) => sIcon(tsvg, n, cx(k), TY + TH / 2, 40, { stroke: '#fff', 'stroke-width': 2.2 }));
    const tCells = Math.max(tFew + 0.9, at(0, 'especially influenced', 0.85));
    tl.fromTo(cells, { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.14, ease: 'back.out(2)' }, tCells);

    // ---------- beat 1: too little. Gaps open in the window; the missing experiences are named
    const sub1 = C1.put(stage, 'c1b-sub', 'Too little *exposure*', { x: 100, y: SUB_Y });
    swap(tl, sub0, sub1, cue(1));
    const GAP = [1, 2, 3, 4];
    const gaps = GAP.map(k => K.rect(tsvg, cx(k) - 36, TY, 72, TH, { fill: '#e1e7d9' }));
    const tGap = Math.max(cue(1) + 0.3, at(1, 'Too little', 0.05));
    tl.to(GAP.map(k => cells[k]), { opacity: 0, y: 30, duration: 0.4, stagger: 0.12, ease: 'power2.in' }, tGap);
    tl.fromTo(gaps, { scaleY: 0, transformOrigin: '50% 50%' }, { scaleY: 1, duration: 0.45, stagger: 0.12, ease: 'power2.out' }, tGap + 0.2);
    const TAGS = [['user', 'Strangers', 'people'], ['bus', 'Buses', 'experiences'], ['skateboard', 'Skateboards', 'experiences'], ['map-pin', 'New places', 'places']];
    const trow = K.el('div', null);
    Object.assign(trow.style, { position: 'absolute', left: TX0 + 'px', top: TY + TH + 110 + 'px', display: 'flex', gap: '22px' });
    LT.appendChild(trow);
    const tags = TAGS.map(([ic, t]) => {
      const n = pill(trow, 'c1b-miss', ic, t, 0, 0);
      n.style.position = 'relative';
      n.style.left = n.style.top = '';
      return n;
    });
    TAGS.forEach(([, , ph], i) => {
      const t = Math.max(tGap + 1.0, at(1, ph, 0.3 + i * 0.08, 0.2)) + (i === 2 ? 0.45 : 0);
      A.in(tl, tags[i], t, 'fadeUp', { dur: 0.55 });
    });
    // an adopted dog: you meet them after the window has closed
    const MX = 1030;
    const mk = K.group(tsvg);
    K.line(mk, MX, TY - 42, MX, TY - 4, { stroke: C.greenDark, 'stroke-width': 4 });
    K.circle(mk, MX, TY + TH / 2, 30, { fill: '#fff', stroke: C.greenDark, 'stroke-width': 5 });
    C1.svgIcon(mk, 'heart-handshake', MX, TY + TH / 2, 34, { stroke: C.greenDark, 'stroke-width': 2.2 });
    const mlab = C1.label(LT, 'You meet them', MX, TY - 88, { cls: 'c1b-pin', w: 300 });
    mlab.style.justifyContent = 'center';
    const tMeet = Math.max(tGap + 3, at(1, 'adopt an older dog', 0.5));
    tl.fromTo(mk, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(2)' }, tMeet);
    A.in(tl, mlab, tMeet + 0.2, 'fadeUp', { dur: 0.6 });

    // ---------- beat 2: more is not always better. The window swells and overfills
    const sub2 = C1.put(stage, 'c1b-sub', 'More is not *always better*', { x: 100, y: SUB_Y });
    swap(tl, sub1, sub2, cue(2));
    A.out(tl, [...tags, mlab, mk, ticks[1]], cue(2) - 0.3, 'fade', { dur: 0.4 });
    tl.to(gaps, { opacity: 0, duration: 0.4 }, cue(2) - 0.2);
    tl.to(GAP.map(k => cells[k]), { opacity: 1, y: 0, duration: 0.4 }, cue(2));
    const WX1 = 960, WY1 = 900;
    const tSwell = Math.max(cue(2) + 0.3, at(2, 'go too far', 0.3));
    tl.to(win, { attr: { width: WX1 - TX0, height: WY1 - TY, rx: 40 }, duration: 1.0, ease: 'power3.inOut' }, tSwell);
    tl.to(brk, { attr: { d: `M ${TX0 + 2} ${TY - 12} V ${TY - 25} H ${WX1 - 2} V ${TY - 12}` }, duration: 1.0, ease: 'power3.inOut' }, tSwell);
    tl.to(ticks[0], { opacity: 0, duration: 0.3 }, tSwell);
    // a fixed scatter of people, dogs, hands and places that piles up and spills over the edges
    const PILE = ['user', 'dog', 'hand', 'map-pin', 'users', 'dog', 'house', 'hand', 'store', 'user', 'bus', 'dog', 'hand', 'trees',
      'user', 'car', 'dog', 'hand', 'user', 'map-pin', 'dog', 'users', 'hand', 'house', 'user', 'dog', 'store', 'hand'];
    let seed = 11;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const spots = [];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 8; c++) spots.push([200 + c * 104 + (r % 2) * 40 + (rnd() - 0.5) * 44, TY + TH + 58 + r * 88 + (rnd() - 0.5) * 36]);
    spots.push([1000, TY + 150], [1016, TY + 262], [930, WY1 + 12], [560, WY1 + 16], [250, WY1 + 10], [700, TY + TH + 20]);
    const order = spots.map((_, i) => [rnd(), i]).sort((a, b) => a[0] - b[0]).map(v => v[1]);
    const pile = order.map((si, i) => {
      const [x, y] = spots[si];
      const r = 32 + rnd() * 12;
      const solid = i % 3 !== 1;
      return sBadge(tsvg, PILE[i % PILE.length], x, y, r, solid ? '#fff' : C.greenDark, solid ? C.greenDark : '#fff', { stroke: solid ? C.greenLight : '#fff', sw: 3, k: 1.15, iw: 2.1 });
    });
    const tPile = Math.max(tSwell + 0.8, at(2, 'More exposure', 0.6, 0.6));
    const pileEnd = Math.max(tPile + 1.5, cue(3) - 1.0);
    pile.forEach((p, i) => {
      const f = Math.pow(i / (pile.length - 1), 0.75);
      tl.fromTo(p.inner, { opacity: 0, scale: 0.3, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(2.4)' }, tPile + f * (pileEnd - tPile));
    });
    tl.to(win, { attr: { fill: '#7fa84f' }, duration: 1.2 }, pileEnd - 0.8);

    // ---------- beat 3: pass the puppy
    A.out(tl, LT, cue(3) - 0.35, 'fadeUp', { dur: 0.45 });
    const sub3 = C1.put(stage, 'c1b-sub', 'Pass the *puppy*', { x: 100, y: SUB_Y });
    swap(tl, sub2, sub3, cue(3));
    const LP = C1.layer(stage);
    const psvg = K.svg(LP, { x: 0, y: 0, w: 1920, h: 1080 });
    const CX = 640, CY = 668, R = 236, PR = 84;
    const crowd = K.group(psvg);
    const ang = i => -90 + 60 * i;
    const pos = (a, r) => [CX + r * Math.cos((a * Math.PI) / 180), CY + r * Math.sin((a * Math.PI) / 180)];
    const people = [0, 1, 2, 3, 4, 5].map(i => {
      const [x, y] = pos(ang(i), R);
      return sBadge(crowd, 'user', x, y, 50, '#fff', C.inkSoft, { stroke: '#cfd8c4', sw: 3, k: 1.1, iw: 2 });
    });
    tl.fromTo(people.map(p => p.inner), { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(2)' }, Math.max(cue(3) + 0.6, at(3, 'pass the puppy', 0.1) + 0.3));
    // one reaching hand per person, pointing at the middle
    const HR0 = 204, HR1 = 156;
    const hands = [0, 1, 2, 3, 4, 5].map(i => {
      const g = K.group(crowd);
      const [x, y] = pos(ang(i), HR0);
      gsap.set(g, { x, y, opacity: 0 });
      const rot = K.group(g, { transform: `rotate(${ang(i) - 90})` });
      C1.svgIcon(rot, 'hand', 0, 0, 52, { stroke: '#8a6a4a', 'stroke-width': 2, fill: '#f6e7d6' });
      return g;
    });
    const reach = (i, t) => {
      const [x, y] = pos(ang(i), HR1);
      tl.to(hands[i], { x, y, opacity: 1, duration: 0.4, ease: 'power2.out' }, t);
    };
    const pull = (i, t) => {
      const [x, y] = pos(ang(i), HR0);
      tl.to(hands[i], { x, y, opacity: 0, duration: 0.35, ease: 'power2.in' }, t);
    };
    // the puppy: rotates around the middle, counter-rotating so it stays upright
    const pupRot = K.group(psvg);
    const pupPos = K.group(pupRot);
    const pupIn = K.group(pupPos);
    K.circle(pupIn, 0, 0, 44, { fill: C.amber, stroke: '#fff', 'stroke-width': 5 });
    C1.svgIcon(pupIn, 'dog', 0, 1, 50, { stroke: '#fff', 'stroke-width': 2.1 });
    gsap.set(pupRot, { rotation: ang(0), svgOrigin: `${CX} ${CY}` });
    gsap.set(pupPos, { x: CX, y: CY });
    gsap.set(pupIn, { rotation: -ang(0), transformOrigin: '50% 50%' });
    const tPup = Math.max(cue(3) + 0.4, at(3, 'pass the puppy', 0.1));
    tl.fromTo(pupIn, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2)' }, tPup);
    const stops = [at(3, 'picking up', 0.3, 0.2)];
    const tPass = Math.max(stops[0] + 1.6, at(3, 'passing them', 0.45, 0.1));
    const tLast = Math.max(tPass + 4, cue(4) - 1.4);
    for (let i = 1; i < 6; i++) stops.push(tPass + ((tLast - tPass) * (i - 1)) / 4);
    reach(0, stops[0] - 0.35);
    tl.to(pupPos, { x: CX + PR, duration: 0.6, ease: 'power2.inOut' }, stops[0]);
    for (let i = 1; i < 6; i++) {
      const t = stops[i];
      reach(i, Math.max(stops[i - 1] + 0.5, t - 0.8));
      tl.to(pupRot, { rotation: ang(i), svgOrigin: `${CX} ${CY}`, duration: 0.7, ease: 'power2.inOut' }, t - 0.35);
      tl.to(pupIn, { rotation: -ang(i), transformOrigin: '50% 50%', duration: 0.7, ease: 'power2.inOut' }, t - 0.35);
      pull(i - 1, t + 0.2);
    }
    // a small choice meter that stays close to empty
    const meter = K.el('div', 'c1b-meter');
    Object.assign(meter.style, { left: '1060px', top: '612px' });
    meter.innerHTML = '<div class="t">Choice</div><div class="bar"><div class="fill"></div></div><div class="ends"><span>Low</span><span>High</span></div>';
    LP.appendChild(meter);
    const mfill = meter.querySelector('.fill');
    gsap.set(mfill, { scaleX: 0.1 });
    const tMeter = Math.max(stops[2], at(3, 'very little choice', 0.75));
    A.in(tl, meter, tMeter, 'fadeLeft', { dur: 0.6 });
    tl.fromTo(mfill, { scaleX: 0.02 }, { scaleX: 0.1, duration: 0.8, ease: 'power2.out' }, tMeter + 0.4);
    tl.to(mfill, { scaleX: 0.06, duration: 0.25, yoyo: true, repeat: 3, ease: 'sine.inOut' }, tMeter + 1.4);

    // ---------- beat 4: too much, too fast. The crowd closes in and the puppy shrinks
    const sub4 = C1.put(stage, 'c1b-sub', 'Too much, *too fast*', { x: 100, y: SUB_Y });
    swap(tl, sub3, sub4, cue(4));
    tl.to(pupPos, { x: CX, duration: 0.8, ease: 'power2.inOut' }, cue(4));
    [0, 1, 2, 3, 4, 5].forEach(i => { if (i !== 5) reach(i, cue(4) + 0.2 + i * 0.08); });
    const MORE = {
      people: [['user', -60, 236], ['user', 120, 236], ['users', 35, 345], ['user', 215, 345]],
      dogs: [['dog', 0, 236], ['dog', 180, 236], ['dog', -35, 345], ['dog', 145, 345]],
      hands: [['hand', -60, 150], ['hand', 0, 150], ['hand', 120, 150], ['hand', 180, 150]],
      places: [['house', 60, 236], ['store', 240, 236], ['map-pin', 0, 345], ['trees', 180, 345]],
    };
    const PH = { people: 'new people', dogs: 'dogs', hands: 'handling', places: 'environments' };
    let tPrevM = cue(4) + 0.6;
    Object.keys(MORE).forEach((key, gi) => {
      const els = MORE[key].map(([n, a, r]) => {
        const [x, y] = pos(a, r);
        if (n === 'hand') {
          const g = K.group(crowd);
          gsap.set(g, { x, y });
          const inner = K.group(g);
          const rot = K.group(inner, { transform: `rotate(${a - 90})` });
          C1.svgIcon(rot, 'hand', 0, 0, 50, { stroke: '#8a6a4a', 'stroke-width': 2.1, fill: '#f6e7d6' });
          return inner;
        }
        const fill = key === 'dogs' ? C.green : key === 'places' ? C.pale : '#fff';
        const fg = key === 'dogs' ? '#fff' : key === 'places' ? C.olive : C.inkSoft;
        return sBadge(crowd, n, x, y, 42, fill, fg, { stroke: key === 'people' ? '#cfd8c4' : '#fff', sw: key === 'people' ? 3 : 4, k: 1.1, iw: 2 }).inner;
      });
      const t = Math.max(tPrevM + 0.6, at(4, PH[key], 0.3 + gi * 0.1, 0.2));
      tPrevM = t;
      tl.fromTo(els, { opacity: 0, scale: 0.3, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.45, stagger: 0.1, ease: 'back.out(2.2)' }, t);
    });
    const tSqueeze = tPrevM + 0.6;
    const tOver = Math.max(tSqueeze + 1, at(4, 'overwhelming', 0.9));
    tl.to(crowd, { scale: 0.8, svgOrigin: `${CX} ${CY}`, duration: tOver + 0.5 - tSqueeze, ease: 'power1.inOut' }, tSqueeze);
    tl.to(pupIn, { scale: 0.42, duration: tOver + 0.6 - cue(4), ease: 'power1.in' }, cue(4) + 0.4);
    tl.to(mfill, { scaleX: 0.025, backgroundColor: C.red, duration: 0.8, ease: 'power2.out' }, Math.max(tPrevM, at(4, 'without enough opportunity', 0.55)));
    tl.to(pupIn, { x: 3, duration: 0.07, yoyo: true, repeat: 11, ease: 'sine.inOut' }, tOver);

    // ---------- beat 5: every dog means a party, until the leash says no
    A.out(tl, LP, cue(5) - 0.35, 'fade', { dur: 0.45 });
    const sub5 = C1.put(stage, 'c1b-sub', 'Every dog means a *party*', { x: 100, y: SUB_Y });
    swap(tl, sub4, sub5, cue(5));
    const LQ = C1.layer(stage);
    const qsvg = K.svg(LQ, { x: 0, y: 0, w: 1920, h: 1080 });
    const RY = 540, ROW = [['dog', 400], ['dog', 650], ['user', 900], ['dog', 1150]];
    const rowG = K.group(qsvg);
    const party = ROW.map(([n, x]) => {
      const it = sBadge(rowG, n, x, RY, 56, n === 'dog' ? C.green : '#fff', n === 'dog' ? '#fff' : C.inkSoft, { stroke: n === 'dog' ? '#fff' : '#cfd8c4', sw: n === 'dog' ? 5 : 3, k: 1.1, iw: 2 });
      const pop = sIcon(it.inner, 'party-popper', 52, -52, 46, { stroke: C.amber, 'stroke-width': 2.2 });
      return { it, pop, x };
    });
    const tRow = Math.max(cue(5) + 0.3, at(5, 'every dog or person', 0.15));
    tl.fromTo(party.map(p => p.it.inner), { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.5, stagger: 0.12, ease: 'back.out(2)' }, tRow);
    // the party puppy
    const pup = K.group(qsvg);
    const pin = K.group(pup);
    K.circle(pin, 0, 0, 44, { fill: C.amber, stroke: '#fff', 'stroke-width': 5 });
    C1.svgIcon(pin, 'dog', 0, 1, 50, { stroke: '#fff', 'stroke-width': 2.1 });
    gsap.set(pup, { x: 170, y: RY });
    const tPupP = Math.max(cue(5) + 0.3, at(5, 'the puppy who learned', 0.1));
    tl.fromTo(pin, { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }, tPupP);
    const confetti = (x, y, t) => {
      const cols = [C.amber, C.green, C.red, C.greenLight, C.amber, C.green];
      cols.forEach((c, i) => {
        const a = ((-160 + i * 28) * Math.PI) / 180, d = 58 + (i % 2) * 20;
        const dot = K.circle(qsvg, x, y, 7 - (i % 2) * 2, { fill: c, opacity: 0 });
        tl.fromTo(dot, { x: 0, y: 0, opacity: 1 }, { x: Math.cos(a) * d, y: Math.sin(a) * d, opacity: 0, duration: 0.7, ease: 'power2.out', immediateRender: false }, t);
      });
    };
    const hopT = [at(5, 'Running up to meet', 0.3, 0.1), at(5, 'after dog', 0.38, 0.2), at(5, 'person after person', 0.45, 0.2), at(5, 'another dog', 0.55, 0.3)];
    let px = 170;
    hopT.forEach((t0, i) => {
      const t = Math.max(t0, i ? hopT[i - 1] + 0.9 : tRow + 1.0);
      hopT[i] = t;
      const nx = party[i].x - 128, H = i ? 118 : 40;
      tl.to(pup, { x: nx, duration: 0.6, ease: 'power1.inOut' }, t);
      tl.to(pup, { y: RY - H, duration: 0.3, ease: 'power2.out' }, t);
      tl.to(pup, { y: RY, duration: 0.3, ease: 'power2.in' }, t + 0.3);
      confetti(party[i].x - 20, RY - 64, t + 0.55);
      tl.to(party[i].it.inner, { scale: 1.12, transformOrigin: '50% 50%', duration: 0.18, yoyo: true, repeat: 1, ease: 'sine.inOut' }, t + 0.55);
      tl.to(party[i].pop, { rotation: -14, transformOrigin: '50% 50%', duration: 0.12, yoyo: true, repeat: 3, ease: 'sine.inOut' }, t + 0.55);
      px = nx;
    });
    // the leash: the puppy is held back from the next dog
    const LY = 836, HX = 240, PX2 = 700, DX = 1150;
    const tLeash = Math.max(hopT[3] + 1.0, at(5, 'until the leash', 0.7, 0.2));
    tl.to(rowG, { opacity: 0.3, duration: 0.6 }, tLeash);
    tl.to(pup, { x: px, y: RY + 150, duration: 0.4, ease: 'power2.in' }, tLeash);
    tl.to(pup, { x: PX2, y: LY, duration: 0.7, ease: 'power2.inOut' }, tLeash + 0.4);
    const handler = sBadge(qsvg, 'user', HX, LY, 56, '#fff', C.ink, { stroke: '#cfd8c4', sw: 3, k: 1.1, iw: 2 });
    const next = sBadge(qsvg, 'dog', DX, LY, 56, C.green, '#fff', { sw: 5, k: 1.1, iw: 2 });
    const nextPop = sIcon(next.inner, 'party-popper', 52, -52, 46, { stroke: C.amber, 'stroke-width': 2.2 });
    tl.fromTo([handler.inner, next.inner], { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.5, stagger: 0.15, ease: 'back.out(2)' }, tLeash + 0.3);
    const SLACK = `M ${HX + 50} ${LY + 10} Q ${(HX + PX2) / 2} ${LY + 100} ${PX2 - 44} ${LY + 8}`;
    const TAUT = `M ${HX + 50} ${LY + 10} Q ${(HX + PX2) / 2 + 22} ${LY + 10} ${PX2 - 20} ${LY + 8}`;
    const leash = K.path(qsvg, SLACK, { stroke: '#8a6d3b', 'stroke-width': 8 });
    qsvg.insertBefore(leash, pup);
    A.draw(tl, leash, tLeash + 1.0, 0.6);
    const tTaut = Math.max(tLeash + 1.7, at(5, 'prevents', 0.75, 0.1));
    tl.to(leash, { attr: { d: TAUT, stroke: C.red }, duration: 0.35, ease: 'power3.in' }, tTaut);
    tl.to(pup, { x: PX2 + 22, duration: 0.35, ease: 'power3.in' }, tTaut);
    const chev = [0, 1].map(k => K.path(qsvg, `M ${PX2 + 90 + k * 28} ${LY - 20} L ${PX2 + 110 + k * 28} ${LY} L ${PX2 + 90 + k * 28} ${LY + 20}`, { stroke: C.red, 'stroke-width': 7 }));
    tl.fromTo(chev, { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.4, stagger: 0.12 }, tTaut + 0.3);
    const strainEnd = cue(6) - 0.6;
    const nSt = Math.max(3, Math.floor((strainEnd - tTaut - 0.5) / 0.18));
    tl.to(pin, { x: 5, duration: 0.09, yoyo: true, repeat: nSt, ease: 'sine.inOut' }, tTaut + 0.4);
    tl.to(nextPop, { rotation: -14, transformOrigin: '50% 50%', duration: 0.14, yoyo: true, repeat: 5, ease: 'sine.inOut' }, tTaut + 0.2);
    const fr = K.el('div', 'c1b-red');
    fr.appendChild(K.icon('frown'));
    fr.appendChild(K.el('span', null, 'Frustration'));
    Object.assign(fr.style, { left: '0px', top: '0px' });
    LQ.appendChild(fr);
    Object.assign(fr.style, { left: (PX2 + 22 + DX) / 2 - 150 + 'px', top: LY - 150 + 'px', width: '300px', justifyContent: 'center' });
    const tFr = Math.max(tTaut + 0.8, at(5, 'frustration', 0.85, 0.2));
    A.in(tl, fr, tFr, 'pop', { dur: 0.6 });

    // ---------- beat 6: the chip drops into the bowl beside the others
    A.out(tl, LQ, cue(6) - 0.35, 'fade', { dur: 0.45 });
    A.out(tl, sub5, cue(6) - 0.35, 'fadeUp', { dur: 0.4 });
    tl.to(B.wrap, { scale: 1, x: 0, y: 0, duration: 0.9, ease: 'power3.inOut' }, cue(6) + 0.1);
    const land = C1.dropIn(tl, B, 3, cue(6) + 1.0);
    const cap2 = C1.caption(stage, 3, STD.cx, CAP_Y);
    A.in(tl, cap2, land - 0.2, 'fadeUp', { dur: 0.6 });
    const LZ = C1.layer(stage);
    const card = K.el('div', 'c1-card');
    Object.assign(card.style, { left: '100px', top: '400px', width: '1000px', height: '250px' });
    LZ.appendChild(card);
    const hb = C1.badge(LZ, 'history', 206, 525, 130, ING[3].col, '#fff');
    const htxt = C1.put(LZ, 'c1-big', 'Early experiences become<br>part of the *history*', { x: 310, y: 458 });
    A.in(tl, card, cue(6) + 0.1, 'fadeUp', { dur: 0.7 });
    A.in(tl, hb, cue(6) + 0.3, 'pop', { dur: 0.6 });
    A.in(tl, htxt, cue(6) + 0.4, 'fadeUp', { dur: 0.7 });
    void dur;
  });
})();
