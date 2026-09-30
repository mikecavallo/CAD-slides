// Chapter 1 (v6): scenes built by group b. Bowl parts come from window.C1 (c1_bowl.js).
//   ch01s03  Why?                          photo + 'Why?', the bowl with eight blank chips, the chips start drifting down
//   ch01s04  Genetics and temperament      genetics chip drops in, a sensitive and an easygoing dog, a tiny smoke alarm
//   ch01s05  Before birth                  prenatal chip drops in; health, nutrition and experiences gather around it
//   ch01s07  Early life and socialization  timeline window, gaps, how we expose, pass the puppy, no break, party and leash
(() => {
  const CSS = `
  .c1b-sub { position: absolute; font: 600 54px/1.16 var(--font-head); color: var(--ink); white-space: nowrap; }
  .c1b-mix { position: absolute; font: 700 76px/1.1 var(--font-head); color: var(--ink); white-space: nowrap; }
  .c1b-note { position: absolute; display: inline-flex; align-items: center; gap: 22px; font: 500 42px/1.2 var(--font-body); color: var(--ink); white-space: nowrap; }
  .c1b-note .ic { width: 76px; height: 76px; border-radius: 50%; display: grid; place-items: center; background: var(--green-pale); color: var(--green-dark); flex: 0 0 auto; }
  .c1b-note .ic svg { width: 42px; height: 42px; stroke-width: 2.1; }
  .c1b-note b { font-weight: 700; color: var(--green); }
  .c1b-lab { position: absolute; font: 700 34px/1 var(--font-body); color: var(--ink); text-align: center; white-space: nowrap; }
  .c1b-tick { position: absolute; font: 600 30px/1 var(--font-body); color: var(--ink-soft); white-space: nowrap; }
  .c1b-win { position: absolute; font: 700 42px/1 var(--font-head); color: var(--green-dark); white-space: nowrap; }
  .c1b-miss { position: absolute; display: inline-flex; align-items: center; gap: 14px; padding: 9px 28px 9px 9px; border-radius: 999px;
    background: #fff; border: 3px dashed #b3bda6; font: 600 32px/1 var(--font-body); color: var(--ink-soft); white-space: nowrap; }
  .c1b-miss .ic { width: 50px; height: 50px; border-radius: 50%; background: #eceee8; color: var(--muted); display: grid; place-items: center; }
  .c1b-miss .ic svg { width: 30px; height: 30px; stroke-width: 2.2; }
  .c1b-pin { position: absolute; display: inline-flex; align-items: center; gap: 12px; font: 700 30px/1 var(--font-body); color: var(--green-dark); white-space: nowrap; }
  .c1b-opt { position: absolute; display: inline-flex; align-items: center; gap: 14px; height: 62px; padding: 0 28px 0 8px; border-radius: 999px;
    background: #fff; border: 2px solid var(--green-light); box-shadow: var(--shadow-soft); font: 700 32px/1 var(--font-body); color: var(--green-deep); white-space: nowrap; }
  .c1b-opt .ic { width: 46px; height: 46px; border-radius: 50%; background: var(--green); color: #fff; display: grid; place-items: center; flex: 0 0 auto; }
  .c1b-opt .ic svg { width: 26px; height: 26px; stroke-width: 2.4; }
  .c1b-meter { position: absolute; width: 300px; }
  .c1b-meter .t { font: 700 34px/1 var(--font-head); color: var(--ink); display: flex; justify-content: space-between; align-items: baseline; }
  .c1b-meter .t span { font: 600 28px/1 var(--font-body); color: var(--muted); }
  .c1b-meter .bar { margin-top: 16px; height: 30px; border-radius: 15px; background: #e1e7d9; overflow: hidden; }
  .c1b-meter .fill { height: 100%; width: 100%; border-radius: 15px; background: var(--amber); transform-origin: 0 50%; }
  .c1b-meter .ends { margin-top: 10px; display: flex; justify-content: space-between; font: 600 26px/1 var(--font-body); color: var(--muted); }
  .c1b-red { position: absolute; display: inline-flex; align-items: center; gap: 12px; padding: 14px 30px 14px 20px; border-radius: 999px;
    border: 3px solid var(--red); background: #fff; color: var(--red); font: 700 36px/1 var(--font-body); white-space: nowrap; box-shadow: var(--shadow-soft); }
  .c1b-red svg { width: 34px; height: 34px; stroke-width: 2.4; }
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
    const ring = K.circle(inner, 0, 0, r, { fill, stroke: o.stroke || '#fff', 'stroke-width': o.sw ?? 5 });
    if (o.dash) ring.setAttribute('stroke-dasharray', o.dash);
    sIcon(inner, name, 0, 0, r * (o.k ?? 1.1), { stroke: fg, 'stroke-width': o.iw ?? 2.1 });
    return { g, inner, ring };
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
  /** Soft halo behind the first n tokens in the bowl, glowing together at t. */
  function glowTokens(tl, B, n, t) {
    const C = col();
    const halos = [];
    for (let k = 0; k < n; k++) {
      const o = B.tokens[k].outer;
      const c = K.circle(o, 0, 0, 58, { fill: '#e6f3d6', stroke: C.greenLight, 'stroke-width': 4, opacity: 0 });
      o.insertBefore(c, o.firstChild);
      halos.push(c);
    }
    tl.fromTo(halos, { opacity: 0, scale: 0.7, transformOrigin: '50% 50%' }, { opacity: 0.95, scale: 1, duration: 0.8, stagger: 0.12, ease: 'power2.out' }, t);
    tl.to(B.glow, { opacity: 0.9, duration: 1.2, ease: 'sine.inOut' }, t);
    tl.to(B.tokens.slice(0, n).map(tk => tk.inner), { scale: 1.12, transformOrigin: '50% 50%', duration: 0.35, yoyo: true, repeat: 1, stagger: 0.12, ease: 'sine.inOut' }, t + 0.1);
  }

  // simple dog silhouettes, side view facing right, drawn in a 100 x 70 box with the feet on y = 68
  const POSE = {
    stand: {
      parts: [['e', 46, 37, 24, 10.5], ['c', 63, 36, 11], ['l', 63, 32, 73, 17, 12], ['c', 76, 14, 9], ['l', 79, 17, 90, 20, 9],
        ['l', 29, 40, 27, 66, 6], ['l', 36, 42, 38, 66, 6], ['l', 59, 42, 58, 66, 6], ['l', 66, 41, 67, 66, 6], ['p', 'M 24 33 Q 13 27 14 12', 5]],
      prick: '69,10 72,-2 78,7', flop: [71, 17], mid: 33,
    },
    down: {
      parts: [['e', 45, 56, 28, 10], ['c', 29, 57, 10], ['l', 62, 51, 73, 38, 12], ['c', 76, 34, 9.5], ['l', 80, 37, 91, 40, 8],
        ['l', 60, 64, 93, 64, 7], ['p', 'M 19 60 Q 9 64 2 61', 6]],
      prick: '69,30 72,18 78,27', flop: [70, 37], mid: 45,
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

  // ================================================================== ch01s03 Why?
  registerScene('ch01s03', ctx => {
    const { stage, tl, cue, dur } = ctx;
    const { sayAt, clamp } = C1;
    const C = col();
    css(stage);

    // beat 0: photo card at left; the owner's question bubble and the heading 'Why?' write on beside it
    const ph = K.photo(stage, 'photo_why.jpg', { x: 100, y: 150, w: 580, h: 790, pos: '35% 50%' });
    A.in(tl, ph.root, Math.max(0, cue(0) - 0.4), 'fadeRight', { dur: 1.0 });
    A.kenburns(tl, ph.img, { from: 1.03, to: 1.1, t0: 0, t1: cue(1) + 1 });
    const QX = 1250, QY = 430;
    const q = C1.badge(stage, 'message-circle-question', QX, QY, 250, C.pale, C.green);
    A.in(tl, q, cue(0) + 0.1, 'pop', { dur: 0.8 });
    tl.to(q, { rotation: -8, duration: 0.18, yoyo: true, repeat: 3, ease: 'sine.inOut' }, clamp(sayAt(ctx, 0, 'Why is my dog', 0.75), cue(0) + 2, cue(1) - 1.2));
    const h = K.heading(stage, 'Why?', { x: 100, y: 120, w: 800, size: 96 });
    const HX0 = QX - 100 - 116, HY0 = 590 - 120;
    gsap.set(h.root, { x: HX0, y: HY0, transformOrigin: '0% 0%' });
    A.in(tl, h.title, cue(0) + 0.3, 'wipe', { dur: 1.0 });
    A.in(tl, h.bar, cue(0) + 1.0, 'grow', { dur: 0.6 });

    // beat 1: the photo slides away, the heading rises; the bowl arrives and eight blank chips hover above it
    const t1 = cue(1) - 0.2;
    tl.to(ph.root, { x: -260, opacity: 0, duration: 0.8, ease: 'power2.in' }, t1);
    tl.to(q, { scale: 0.6, opacity: 0, duration: 0.5, ease: 'power2.in' }, t1);
    tl.fromTo(h.root, { x: HX0, y: HY0, scale: 1 }, { x: 0, y: 0, scale: 0.84, duration: 1.0, ease: 'power3.inOut', immediateRender: false }, t1 + 0.3);

    const B = C1.makeBowl(stage, { cx: 1370, y: 650, s: 0.9, filled: 0 });
    const shadow = B.bodyAll.previousElementSibling;
    const tB = t1 + 0.8;
    tl.fromTo(B.bodyAll, { opacity: 0, y: 90 }, { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' }, tB);
    tl.fromTo(shadow, { opacity: 0 }, { opacity: 0.2, duration: 0.9, ease: 'power2.out' }, tB + 0.3);
    tl.fromTo(B.glow, { opacity: 0 }, { opacity: 0.85, duration: 1.2, ease: 'sine.inOut' }, tB + 0.5);

    const mix = C1.put(stage, 'c1b-mix', "It's not just<br>*one reason*", { x: 100, y: 400 });
    const tMix = clamp(sayAt(ctx, 1, 'not just one reason', 0.1), tB + 0.4, cue(2) - 3);
    A.in(tl, mix, tMix, 'fadeUp', { dur: 0.8 });

    const tChips = clamp(sayAt(ctx, 1, 'many factors', 0.4), tMix + 0.8, cue(2) - 1.5);
    tl.fromTo(B.slots.map(sl => sl.g), { opacity: 0, scale: 0.3, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.55, stagger: 0.12, ease: 'back.out(2.2)' }, tChips);
    const tDrift = cue(2) + 0.1;
    C1.bob(tl, B, tChips + 1.3, tDrift);

    // beat 2: the blank chips begin drifting down toward the bowl (they do not land here)
    // the arc closes in around its centre (just above the rim), so every chip sinks and funnels toward the bowl
    B.slots.forEach((sl, k) => {
      const f = 0.7, ord = Math.abs(k - 3.5);
      tl.to(sl.g, { x: sl.x * f, y: 30 + (sl.y - 60) * f, scale: 0.94, transformOrigin: '50% 50%', duration: Math.max(3, dur - tDrift - 0.4 - ord * 0.12), ease: 'sine.inOut' }, tDrift + ord * 0.12);
    });
    tl.to(B.glow, { opacity: 1, duration: 1.5, ease: 'sine.inOut' }, tDrift);
    const sev = pill(stage, 'c1b-note', 'chef-hat', 'Several things <b>come together</b>', 100, 640);
    const tSev = clamp(sayAt(ctx, 2, 'several ingredients', 0.4), tDrift + 0.6, dur - 1.8);
    A.in(tl, sev, tSev, 'fadeUp', { dur: 0.8 });
  });

  // ================================================================== ch01s04 Genetics and temperament
  registerScene('ch01s04', ctx => {
    const { stage, tl, cue, dur } = ctx;
    const { sayAt, clamp, STD, CAP_Y } = C1;
    const C = col();
    css(stage);
    const { B } = C1.sceneBase(ctx, 'Genetics and temperament', 0);
    const SUB_Y = 296;

    // ---------- beat 0: the genetics chip drops in; a more sensitive and a more easygoing dog
    const cap0 = C1.caption(stage, 0, STD.cx, CAP_Y);
    const land0 = C1.dropIn(tl, B, 0, clamp(sayAt(ctx, 0, 'genetics', 0.1), cue(0) + 0.1, cue(0) + 2));
    A.in(tl, cap0, land0 - 0.2, 'fadeUp', { dur: 0.6 });

    const sub0 = C1.put(stage, 'c1b-sub', 'Some dogs are born *more sensitive*', { x: 100, y: SUB_Y });
    const dsvg = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const DY = 610, DR = 118, DS = 1.65;
    const DOGS = [
      { x: 330, pose: 'stand', ear: 'prick', ring: C.amber, bg: C.amberPale, fill: '#9a5f12', lab: 'More sensitive', say: 'more sensitive' },
      { x: 810, pose: 'down', ear: 'flop', ring: C.green, bg: C.pale, fill: C.greenDark, lab: 'More easygoing', say: 'more easygoing' },
    ];
    const dogs = DOGS.map(d => {
      const g = K.group(dsvg);
      gsap.set(g, { x: d.x, y: DY });
      const inner = K.group(g);
      const disc = K.circle(inner, 0, 0, DR, { fill: '#fff', stroke: '#d6ddcc', 'stroke-width': 6 });
      dogSil(inner, d.pose, 0, (68 - POSE[d.pose].mid) * DS, DS, '#8f978a', { ear: d.ear });
      const lab = C1.label(stage, d.lab, d.x, DY + DR + 30, { cls: 'c1b-lab', w: 400 });
      return { g, inner, disc, lab, d };
    });
    // both dogs arrive with "different temperaments", then each is named in turn
    const tDogs = clamp(sayAt(ctx, 0, 'different temperaments', 0.25), land0 + 0.2, cue(1) - 6);
    tl.fromTo(dogs.map(o => o.inner), { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.6, stagger: 0.15, ease: 'back.out(1.8)' }, tDogs);
    const tSub = clamp(sayAt(ctx, 0, 'Some are naturally', 0.45), tDogs + 0.8, cue(1) - 4);
    A.in(tl, sub0, tSub, 'fadeUp', { dur: 0.8 });
    let tPrev = tSub;
    dogs.forEach((o, i) => {
      const t = Math.max(tPrev + 0.6, sayAt(ctx, 0, o.d.say, 0.55 + i * 0.2, 0.2));
      tPrev = t;
      tl.to(o.disc, { attr: { fill: o.d.bg, stroke: o.d.ring }, duration: 0.5, ease: 'power2.out' }, t);
      tl.to(o.inner.querySelectorAll('g[fill]'), { attr: { fill: o.d.fill, stroke: o.d.fill }, duration: 0.5, ease: 'power2.out' }, t);
      tl.to(o.inner, { scale: 1.08, transformOrigin: '50% 50%', duration: 0.25, yoyo: true, repeat: 1, ease: 'sine.inOut' }, t);
      A.in(tl, o.lab, t + 0.1, 'fadeUp', { dur: 0.6 });
    });

    // ---------- beat 1: a tiny smoke alarm blinks beside the sensitive dog
    const sub1 = C1.put(stage, 'c1b-sub', 'A more sensitive *smoke alarm*', { x: 100, y: SUB_Y });
    swap(tl, sub0, sub1, cue(1));
    tl.to([dogs[1].inner, dogs[1].lab], { opacity: 0.4, duration: 0.6 }, cue(1) + 0.2);
    const AX = DOGS[0].x + 128, AY = DY - 118;
    const aBody = K.group(dsvg);
    K.circle(aBody, AX, AY, 46, { fill: C.redPale, stroke: '#fff', 'stroke-width': 5 });
    C1.svgIcon(aBody, 'alarm-smoke', AX, AY + 2, 54, { stroke: C.red, 'stroke-width': 2 });
    const arcD = r => {
      const a = (38 * Math.PI) / 180;
      return `M${AX + r * Math.cos(-a)} ${AY + r * Math.sin(-a)} A${r} ${r} 0 0 1 ${AX + r * Math.cos(a)} ${AY + r * Math.sin(a)}`;
    };
    const arcs = [64, 86, 108].map((r, i) => K.path(dsvg, arcD(r), { stroke: C.red, 'stroke-width': 7 - i * 1.5, opacity: 0 }));
    const tAl = clamp(sayAt(ctx, 1, 'smoke alarm', 0.4), cue(1) + 0.4, dur - 3);
    tl.fromTo(aBody, { opacity: 0, scale: 0.4, transformOrigin: `${AX}px ${AY}px` }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2)' }, tAl);
    const blinkEnd = dur - 0.6;
    const nBl = Math.max(2, Math.floor((blinkEnd - tAl - 0.5) / 0.9));
    tl.fromTo(arcs, { opacity: 0 }, { opacity: 1, duration: 0.18, stagger: 0.09, yoyo: true, repeat: nBl * 2 - 1, repeatDelay: 0.27, ease: 'power1.out' }, tAl + 0.5);
    tl.to(aBody, { rotation: 8, svgOrigin: `${AX} ${AY}`, duration: 0.07, yoyo: true, repeat: 7, ease: 'sine.inOut' }, tAl + 0.5);
    // the sensitive dog startles when the alarm goes off: "easily triggered"
    const tTrig = clamp(sayAt(ctx, 1, 'easily triggered', 0.7), tAl + 1.0, dur - 1.5);
    tl.to(dogs[0].inner, { x: 5, duration: 0.07, yoyo: true, repeat: 9, ease: 'sine.inOut' }, tTrig);
    tl.to(dogs[0].disc, { attr: { stroke: C.red }, duration: 0.4 }, tTrig);
  });

  // ================================================================== ch01s05 Before birth
  registerScene('ch01s05', ctx => {
    const { stage, tl, cue, dur } = ctx;
    const { sayAt, clamp, STD, CAP_Y, ING } = C1;
    const C = col();
    css(stage);
    const { B } = C1.sceneBase(ctx, 'Before birth', 1);
    const SUB_Y = 296;

    // the prenatal chip drops in beside the DNA chip
    const cap1 = C1.caption(stage, 1, STD.cx, CAP_Y);
    const land1 = C1.dropIn(tl, B, 1, clamp(sayAt(ctx, 0, 'prenatal environment', 0.08), cue(0) + 0.1, cue(0) + 2));
    A.in(tl, cap1, land1 - 0.2, 'fadeUp', { dur: 0.6 });

    const sub = C1.put(stage, 'c1b-sub', 'Before birth *matters too*', { x: 100, y: SUB_Y });
    A.in(tl, sub, clamp(sayAt(ctx, 0, 'before it is even born', 0.3), land1 + 0.3, dur - 6), 'fadeUp', { dur: 0.8 });

    // a hub for the prenatal environment with health, nutrition and experiences around it, one per word
    const HX = 600, HY = 580;
    const hsvg = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const SAT = [
      { x: 300, y: 560, ic: 'dog', lab: 'Health', say: 'health', bg: '#fff', fg: C.greenDark, ring: C.green },
      { x: 600, y: 810, ic: 'soup', lab: 'Nutrition', say: 'nutrition', bg: '#fff', fg: C.greenDark, ring: C.green },
      { x: 900, y: 560, ic: 'zap', lab: 'Experiences', say: 'experiences', bg: C.amberPale, fg: C.amber, ring: C.amber },
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
      if (i === 0) { // the mother: a dog with a small heart badge
        const extra = K.group(b.inner);
        K.circle(extra, 44, -44, 22, { fill: C.red, stroke: '#fff', 'stroke-width': 4 });
        C1.svgIcon(extra, 'heart', 44, -43, 24, { stroke: '#fff', fill: '#fff', 'stroke-width': 2 });
      }
      const lab = C1.label(stage, s.lab, s.x, s.y + 84, { cls: 'c1b-lab', w: 320 });
      const t = Math.max(tPrev + 0.5, sayAt(ctx, 0, s.say, 0.42 + i * 0.05, 0.2));
      tPrev = t;
      A.draw(tl, links[i], t - 0.1, 0.5);
      tl.fromTo(b.inner, { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2)' }, t + 0.15);
      A.in(tl, lab, t + 0.35, 'fadeUp', { dur: 0.5 });
      if (i === 2) tl.to(b.inner, { rotation: 7, transformOrigin: '50% 50%', duration: 0.07, yoyo: true, repeat: 7, ease: 'sine.inOut' }, t + 0.8);
    });

    // "part of the foundation": both chips in the bowl glow together
    glowTokens(tl, B, 2, clamp(sayAt(ctx, 0, 'foundation', 0.85), tPrev + 1.2, dur - 1.8));
  });

  // ================================================================== ch01s07 Early life and socialization
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

    // ---------- beat 1: too little exposure. Gaps open in the window; the missing experiences are named
    const sub1 = C1.put(stage, 'c1b-sub', 'Too little *exposure*', { x: 100, y: SUB_Y });
    swap(tl, sub0, sub1, cue(1));
    const GAP = [1, 2, 3, 4];
    const gaps = GAP.map(k => K.rect(tsvg, cx(k) - 36, TY, 72, TH, { fill: '#e1e7d9' }));
    const tGap = Math.max(cue(1) + 0.3, at(1, "don't have enough", 0.05));
    tl.to(GAP.map(k => cells[k]), { opacity: 0, y: 30, duration: 0.4, stagger: 0.12, ease: 'power2.in' }, tGap);
    tl.fromTo(gaps, { scaleY: 0, transformOrigin: '50% 50%' }, { scaleY: 1, duration: 0.45, stagger: 0.12, ease: 'power2.out' }, tGap + 0.2);
    // tags in the order the narration names them: people, places, experiences
    const TAGS = [['user', 'Strangers', 'people'], ['map-pin', 'New places', 'places'], ['bus', 'Buses', 'experiences'], ['skateboard', 'Skateboards', 'experiences']];
    const trow = K.el('div', null);
    Object.assign(trow.style, { position: 'absolute', left: TX0 + 'px', top: TY + TH + 110 + 'px', display: 'flex', gap: '22px' });
    LT.appendChild(trow);
    const tags = TAGS.map(([ic, t]) => {
      const n = pill(trow, 'c1b-miss', ic, t, 0, 0);
      n.style.position = 'relative';
      n.style.left = n.style.top = '';
      return n;
    });
    let tTag = tGap + 0.4;
    TAGS.forEach(([, , ph], i) => {
      tTag = Math.max(tTag + 0.45, at(1, ph, 0.3 + i * 0.08, 0.2));
      A.in(tl, tags[i], tTag, 'fadeUp', { dur: 0.55 });
    });
    // an adopted dog: you meet them after the window has closed
    const MX = 1030;
    const mk = K.group(tsvg);
    K.line(mk, MX, TY - 42, MX, TY - 4, { stroke: C.greenDark, 'stroke-width': 4 });
    K.circle(mk, MX, TY + TH / 2, 30, { fill: '#fff', stroke: C.greenDark, 'stroke-width': 5 });
    C1.svgIcon(mk, 'heart-handshake', MX, TY + TH / 2, 34, { stroke: C.greenDark, 'stroke-width': 2.2 });
    const mlab = C1.label(LT, 'You meet them', MX, TY - 88, { cls: 'c1b-pin', w: 300 });
    mlab.style.justifyContent = 'center';
    const tMeet = Math.max(tTag + 1.2, at(1, 'adopt an older dog', 0.5));
    tl.fromTo(mk, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(2)' }, tMeet);
    A.in(tl, mlab, tMeet + 0.2, 'fadeUp', { dur: 0.6 });

    // ---------- beat 2: how we expose matters. The puppy watches from different distances and has options
    A.out(tl, LT, cue(2) - 0.35, 'fadeUp', { dur: 0.45 });
    const sub2 = C1.put(stage, 'c1b-sub', 'How we expose *matters*', { x: 100, y: SUB_Y });
    swap(tl, sub1, sub2, cue(2));
    const LX = C1.layer(stage);
    const xsvg = K.svg(LX, { x: 0, y: 0, w: 1920, h: 1080 });
    const PX = 576, PY = 640;
    const pupX = sBadge(xsvg, 'dog', PX, PY, 54, C.amber, '#fff', { sw: 5, k: 1.1, iw: 2.1 });
    tl.fromTo(pupX.inner, { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2)' }, cue(2) + 0.3);
    // a person, a dog and a new place, each a little farther away (and smaller) than the last
    const WORLD = [
      { ic: 'user', x: 1060, y: 470, r: 52, lab: 'Person', fill: '#fff', fg: C.inkSoft, st: '#cfd8c4', sw: 3 },
      { ic: 'dog', x: 1190, y: 720, r: 46, lab: 'Dog', fill: C.green, fg: '#fff', st: '#fff', sw: 5 },
      { ic: 'map-pin', x: 1300, y: 460, r: 40, lab: 'New place', fill: C.pale, fg: C.olive, st: '#fff', sw: 4 },
    ];
    const world = WORLD.map(w => {
      const b = sBadge(xsvg, w.ic, w.x, w.y, w.r, w.fill, w.fg, { stroke: w.st, sw: w.sw, k: 1.1, iw: 2 });
      const lab = C1.label(LX, w.lab, w.x, w.y + w.r + 14, { cls: 'c1b-tick', w: 240 });
      return { b, lab };
    });
    const tWorld = clamp(at(2, 'exposing a puppy', 0.18), cue(2) + 0.9, cue(3) - 10);
    tl.fromTo(world.map(o => o.b.inner), { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.55, stagger: 0.25, ease: 'back.out(2)' }, tWorld);
    A.in(tl, world.map(o => o.lab), tWorld + 0.3, 'fadeUp', { dur: 0.5, stagger: 0.25 });
    // the puppy looks from one to the next
    tl.to(pupX.inner, { rotation: -8, transformOrigin: '50% 50%', duration: 0.5, yoyo: true, repeat: 3, ease: 'sine.inOut' }, clamp(at(2, 'The way those experiences', 0.35), tWorld + 1.2, cue(3) - 8));
    // four small option arrows around the puppy, one per word
    const OPTS = [
      { lab: 'Observe', ic: 'eye', ang: -40, dash: true, say: 'observe' },
      { lab: 'Approach', ic: 'footprints', ang: 0, say: 'approach' },
      { lab: 'Move away', ic: 'undo-2', ang: 180, say: 'move away' },
      { lab: 'Take a break', ic: 'pause', ang: 90, say: 'take a break' },
    ];
    const R0 = 72, R1 = 160;
    const opts = [];
    let tOpt = tWorld + 1.0;
    OPTS.forEach((o, i) => {
      const a = (o.ang * Math.PI) / 180, ux = Math.cos(a), uy = Math.sin(a);
      const x0 = PX + ux * R0, y0 = PY + uy * R0, x1 = PX + ux * R1, y1 = PY + uy * R1;
      const g = K.group(xsvg);
      const shaft = K.line(g, x0, y0, x1 - ux * 6, y1 - uy * 6, { stroke: C.greenDark, 'stroke-width': 6, 'stroke-linecap': 'round' });
      if (o.dash) shaft.setAttribute('stroke-dasharray', '4 14');
      const hx = -uy, hy = ux, L = 22, W = 15;
      K.path(g, `M ${x1 - ux * L + hx * W} ${y1 - uy * L + hy * W} L ${x1} ${y1} L ${x1 - ux * L - hx * W} ${y1 - uy * L - hy * W}`, { stroke: C.greenDark, 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
      const p = pill(LX, 'c1b-opt', o.ic, o.lab, 0, 0);
      // pills sit just past the arrow tip
      if (o.ang === 180) Object.assign(p.style, { left: 'auto', right: 1920 - (x1 - 16) + 'px', top: y1 - 31 + 'px' });
      else if (o.ang === 90) Object.assign(p.style, { left: x1 + 'px', top: y1 + 16 + 'px', transform: 'translateX(-50%)' });
      else Object.assign(p.style, { left: x1 + 16 + 'px', top: y1 - 31 - (o.ang < 0 ? 12 : 0) + 'px' });
      tOpt = Math.max(tOpt + 0.45, at(2, o.say, 0.55 + i * 0.04, 0.2));
      tl.fromTo(g, { opacity: 0, scale: 0.3, svgOrigin: `${x0} ${y0}` }, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(2)' }, tOpt);
      tl.fromTo(p, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, tOpt + 0.12);
      opts.push(p);
    });
    // "some choice": the options pulse together
    const tChoice = clamp(at(2, 'some choice', 0.8), tOpt + 0.8, cue(3) - 1.2);
    tl.to(opts, { scale: 1.08, duration: 0.25, yoyo: true, repeat: 1, stagger: 0.1, ease: 'sine.inOut' }, tChoice);

    // ---------- beat 3: pass the puppy
    A.out(tl, LX, cue(3) - 0.35, 'fadeUp', { dur: 0.45 });
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
    const stops = [Math.max(tPup + 1.2, at(3, 'picking up', 0.3, 0.2))];
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

    // ---------- beat 4: no choice, no break. Hands all around; a pause and an exit sit just out of reach
    const sub4 = C1.put(stage, 'c1b-sub', 'No choice, *no break*', { x: 100, y: SUB_Y });
    swap(tl, sub3, sub4, cue(4));
    tl.to(pupPos, { x: CX, duration: 0.8, ease: 'power2.inOut' }, cue(4));
    const tHands = clamp(at(4, 'repeated handling', 0.3, 0.2), cue(4) + 0.3, cue(5) - 6);
    [0, 1, 2, 3, 4].forEach(i => reach(i, tHands + i * 0.1));
    // just outside the ring, on the left: a pause sign and an exit arrow
    const OUT = [
      { ic: 'pause', a: 202, lab: 'Pause', say: 'pause' },
      { ic: 'log-out', a: 158, lab: 'Exit', say: 'move away', flip: true },
    ];
    const outs = OUT.map(o => {
      const [x, y] = pos(o.a, 392);
      const b = sBadge(psvg, o.ic, x, y, 48, C.mist, C.greenDark, { stroke: C.green, sw: 4, dash: '10 8', k: 1.05, iw: 2.3 });
      if (o.flip) gsap.set(b.inner.lastChild, { scaleX: -1, transformOrigin: '50% 50%' });
      const lab = C1.label(LP, o.lab, x, y + 62, { cls: 'c1b-tick', w: 200 });
      return { b, lab, x, y, o };
    });
    let tOut = tHands + 0.6;
    outs.forEach((u, i) => {
      tOut = Math.max(tOut + 0.5, at(4, u.o.say, 0.45 + i * 0.08, 0.2));
      tl.fromTo(u.b.inner, { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }, tOut);
      A.in(tl, u.lab, tOut + 0.15, 'fadeUp', { dur: 0.5 });
    });
    // the puppy leans toward them, a hand closes the gap, and it is back in the middle
    const tLean = clamp(at(4, 'choose whether', 0.6), tOut + 0.8, cue(5) - 3);
    const la = ((180 - ang(5)) * Math.PI) / 180;
    tl.to(pupPos, { x: CX + Math.cos(la) * 70, y: CY + Math.sin(la) * 70, duration: 0.45, ease: 'power2.out' }, tLean);
    tl.to(pupPos, { x: CX, y: CY, duration: 0.45, ease: 'power2.in' }, tLean + 0.75);
    reach(5, tLean + 0.35);
    tl.to(outs.map(u => u.b.inner), { x: -14, duration: 0.3, yoyo: true, repeat: 1, ease: 'sine.inOut' }, tLean + 0.35);
    tl.to(mfill, { scaleX: 0.025, backgroundColor: C.red, duration: 0.8, ease: 'power2.out' }, tLean + 0.6);
    const tOver = clamp(at(4, 'overwhelming', 0.8), tLean + 1.4, cue(5) - 1.2);
    tl.to(pupIn, { scale: 0.72, duration: 0.8, ease: 'power2.inOut' }, tOver - 0.4);
    tl.to(crowd, { scale: 0.92, svgOrigin: `${CX} ${CY}`, duration: 1.0, ease: 'power2.inOut' }, tOver - 0.4);
    tl.to(pupIn, { x: 3, duration: 0.07, yoyo: true, repeat: 11, ease: 'sine.inOut' }, tOver + 0.4);

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
    LQ.appendChild(fr);
    Object.assign(fr.style, { left: (PX2 + 22 + DX) / 2 - 150 + 'px', top: LY - 150 + 'px', width: '300px', justifyContent: 'center' });
    const tFr = Math.max(tTaut + 0.8, at(5, 'frustration', 0.85, 0.2));
    A.in(tl, fr, tFr, 'pop', { dur: 0.6 });

    // ---------- beat 6: the party row clears; the socialization chip drops into the bowl beside the others
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
    const hb = C1.badge(LZ, ING[3].icon, 206, 525, 130, ING[3].col, '#fff');
    const htxt = C1.put(LZ, 'c1-big', 'Socialization is<br>*one ingredient*', { x: 310, y: 458 });
    A.in(tl, card, land - 0.3, 'fadeUp', { dur: 0.7 });
    A.in(tl, hb, land - 0.1, 'pop', { dur: 0.6 });
    A.in(tl, htxt, land, 'fadeUp', { dur: 0.7 });
    // "in the larger picture": every ingredient so far glows together
    glowTokens(tl, B, 4, clamp(at(6, 'one ingredient', 0.72), land + 1.5, dur - 1.8));
  });
})();
