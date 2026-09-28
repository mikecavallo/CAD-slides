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
})();
