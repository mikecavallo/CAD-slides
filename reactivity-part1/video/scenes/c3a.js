// Chapter 3 (the ABCs of behavior): welcome, plan, the ABCs, function. Shared parts: window.C3 (c3_abc.js), C2, C1.
//   ch03intro  Welcome              shared title slide
//   ch03card   Chapter card         shared narrated chapter card
//   ch03plan   Where we're headed   shared plan slide
//   ch03s01    The ABCs of Behavior chapter 2's pot and thermometer wait ("Coming up"); a dog in a dashed circle; A, B, C tiles land
//   ch03s02    The ABCs             A, B, C on a ring; definitions and the A example (the thing, the context, the place predicts)
//   ch03s03    What did it accomplish?  A, B, C row, the question, function defined, looks like vs does, three examples
(() => {
  const { sayAt, clamp } = C1;
  const { COL } = C3;
  const C = C1.C;

  registerScene('ch03intro', ctx => SKIT.titleSlide(ctx));
  registerScene('ch03card', ctx => SKIT.chapterCard(ctx, 3, 'The ABCs of Behavior'));
  registerScene('ch03plan', ctx => SKIT.planSlide(ctx, [
    { ...SKIT.PLAN.why, rows: ['Same bark', 'Different situations', 'Not always the same job'], rowIcons: ['volume-2', 'map-pin', 'shuffle'] },
    { ...SKIT.PLAN.gain, text: 'Find *the thing*, notice *the context*, and ask what the behavior *accomplished*' },
    { ...SKIT.PLAN.how, rows: ['The ABCs', 'What a behavior accomplishes', 'Why it repeats, and a new path'] },
  ], [
    [['barks at the window', 0.1], ['another dog', 0.4], ['same job', 0.85]],
    [['find the thing', 0.4]],
    [['First', 0.2], ['Second', 0.45], ['third', 0.72]],
  ]));

  /** Chapter 2's pot with the thermometer standing in it (pot svg coordinates). Returns {P, th, merc}. */
  function potWithThermo(parent, cx, y, s, level = 0.5) {
    const P = C2.makePot(parent, { cx, y, s, level });
    const TX = 120;
    const th = K.group(P.svg);
    P.svg.insertBefore(th, P.front);
    K.rect(th, TX - 28, -140, 56, 420, { rx: 28, fill: '#ffffff', stroke: C.greenDeep, 'stroke-width': 7 });
    K.circle(th, TX, 286, 48, { fill: '#ffffff', stroke: C.greenDeep, 'stroke-width': 7 });
    K.circle(th, TX, 286, 34, { fill: C.red });
    const merc = K.rect(th, TX - 12, 240, 24, 50, { rx: 12, fill: C.red });
    [-90, -30, 30, 90, 150].forEach(yy => K.line(th, TX + 6, yy, TX + 22, yy, { stroke: C.greenDeep, 'stroke-width': 4 }));
    return { P, th, merc };
  }
  window.C3.potWithThermo = potWithThermo;

  // ================================================================== ch03s01 The ABCs of Behavior
  registerScene('ch03s01', ctx => {
    const { stage, tl, cue, end, dur } = ctx;
    C2.style(stage);
    C3.css(stage);
    const at = (i, p, fb, lead) => sayAt(ctx, i, p, fb, lead);
    C3.head(ctx, 'The ABCs of Behavior', { size: 76 });

    // ---------- beat 0: the pot with its thermometer; temperature = arousal and stress in the moment
    const LP = C3.layer(stage);
    const { P, merc } = potWithThermo(LP, 600, 470, 0.85);
    A.in(tl, P.wrap, cue(0) + 0.1, 'fadeUp', { dur: 0.8 });
    P.waves(tl, 0, dur);
    const tT = clamp(at(0, 'add temperature', 0.35), cue(0) + 0.8, end(0) - 2.5);
    tl.fromTo(merc, { attr: { y: 240, height: 50 } }, { attr: { y: 40, height: 250 }, duration: 1.6, ease: 'power2.inOut', immediateRender: false }, tT);
    const lab = C3.def(stage, '', C.red, 'Temperature', '= *arousal and stress* in the moment', 1060, 420, 700);
    lab.querySelector('.lt').appendChild(K.icon('thermometer', { size: 60, stroke: 2.4 }));
    A.in(tl, lab, clamp(at(0, 'arousal and stress', 0.7), tT + 0.4, end(0) - 0.5), 'fadeLeft', { dur: 0.7 });

    // ---------- beat 1: the pot steps aside and waits: "Coming up"
    const t1 = cue(1);
    A.out(tl, lab, t1, 'fade', { dur: 0.4 });
    tl.to(P.wrap, { x: -260, scale: 0.72, opacity: 0.55, duration: 1.0, ease: 'power3.inOut' }, t1 + 0.1);
    const up = C2.bookmark(stage, 'Coming up', 160, 820, 'clock');
    A.in(tl, up, t1 + 0.9, 'fadeUp', { dur: 0.6 });

    // ---------- beat 2: a dog in a dashed circle: what is happening around the behavior
    const t2 = cue(2);
    const DX = 1240, DY = 500, RR = 210;
    const sv = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const ring = K.circle(sv, DX, DY, RR, { fill: 'rgba(232,241,220,0.6)', stroke: C.green, 'stroke-width': 6, 'stroke-dasharray': '18 14' });
    const D = C2.dog(sv, DX, DY + 10, 0.82);
    tl.fromTo(D.outer, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, t2 + 0.1);
    C2.wag(tl, D, t2 + 0.9, Math.min(cue(3), t2 + 4));
    const tRing = clamp(at(2, 'around the behavior', 0.6), t2 + 0.5, end(2) - 0.6);
    tl.fromTo(ring, { drawSVG: '0%', opacity: 0 }, { drawSVG: '100%', opacity: 1, duration: 1.0, ease: 'power2.inOut' }, tRing);
    tl.fromTo(ring, { rotation: 0, svgOrigin: `${DX} ${DY}` }, { rotation: 40, svgOrigin: `${DX} ${DY}`, duration: Math.max(1, dur - tRing), ease: 'none', immediateRender: false }, tRing);
    const bef = C3.chip(stage, 'arrow-left', 'Before', DX - RR - 250, DY - 30, { col: C.olive });
    const aft = C3.chip(stage, 'arrow-right', 'After', DX + RR + 40, DY - 30, { col: C.greenDeep });
    A.in(tl, bef, tRing + 0.5, 'fadeRight', { dur: 0.5 });
    A.in(tl, aft, tRing + 0.8, 'fadeLeft', { dur: 0.5 });
    const q = C3.put(stage, 'c3-mid', 'What is happening <b>around</b> the behavior?', { x: DX - 420, y: 228, w: 840, align: 'center' });
    A.in(tl, q, t2 + 0.3, 'fadeUp', { dur: 0.6 });

    // ---------- beat 3: A, B, C land
    const t3 = cue(3);
    const TS = 130, TG = 70, TX0 = DX - (3 * TS + 2 * TG) / 2, TY = 752;
    const tiles = ['A', 'B', 'C'].map((L, k) => C3.tile(stage, L, TX0 + k * (TS + TG), TY, TS, [COL.A, COL.B, COL.C][k]));
    tiles.forEach((n, k) => tl.fromTo(n, { opacity: 0, y: -90, rotation: k === 1 ? 0 : (k ? 8 : -8) }, { opacity: 1, y: 0, rotation: 0, duration: 0.7, ease: 'bounce.out' }, t3 + 0.15 + k * 0.18));
    tl.to([bef, aft], { opacity: 0.4, duration: 0.5 }, t3);
  });

  // ================================================================== ch03s02 The ABCs
  registerScene('ch03s02', ctx => {
    const { stage, tl, cue, end, dur } = ctx;
    C2.style(stage);
    C3.css(stage);
    const at = (i, p, fb, lead) => sayAt(ctx, i, p, fb, lead);
    C3.head(ctx, 'The ABCs', { size: 76 });

    const R = C3.cycle(stage, 500, 610, 240, { d: 150 });
    const nodes = R.nodes.map(n => n.el);
    tl.fromTo(nodes, { opacity: 0, scale: 0.6 }, { opacity: 0.3, scale: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(1.6)' }, 0.2);
    A.draw(tl, R.arcs, 0.4, 0.8, { stagger: 0.1 });
    tl.fromTo(R.heads, { opacity: 0 }, { opacity: 1, duration: 0.3 }, 1.2);
    const light = (k, t) => {
      tl.to(nodes[k], { opacity: 1, scale: 1.12, duration: 0.4, ease: 'back.out(2)' }, t);
      tl.to(nodes[k], { scale: 1, duration: 0.4 }, t + 0.45);
    };
    const RX = 930, RW = 890;

    // ---------- beat 0: A = Antecedent
    light(0, cue(0) + 0.05);
    const dA = C3.def(stage, 'A', COL.A, 'Antecedent', 'The thing that happens and the *context* around it', RX, 250, RW);
    A.in(tl, dA, cue(0) + 0.3, 'fadeLeft', { dur: 0.6 });

    // ---------- beat 1: the thing + the context (two cards to fill)
    const mkCard = (x, icon, title) => {
      const c = C3.put(stage, 'c3-card', null, { x, y: 450, w: 430, h: 300 });
      const hd = C3.chip(c, icon, title, 24, 22, { col: COL.A });
      hd.style.boxShadow = 'none';
      return c;
    };
    const cThing = mkCard(RX, 'zap', '*The thing*');
    const cCtx = mkCard(RX + 460, 'map-pin', '*The context*');
    A.in(tl, cThing, clamp(at(1, 'immediate thing', 0.15), cue(1), end(1) - 1.5), 'fadeUp', { dur: 0.6 });
    A.in(tl, cCtx, clamp(at(1, 'where it happens', 0.5), cue(1) + 0.6, end(1) - 0.6), 'fadeUp', { dur: 0.6 });

    // ---------- beat 2: the thing: another dog appearing
    const big = (parent, icon, col, x, y) => { const b = C2.badge(parent, icon, x, y, 100, col, '#fff'); return b; };
    const b1 = big(cThing, 'dog', C.amber, 90, 150);
    const t1 = C3.put(cThing, 'c3-lab', '<b>Another dog</b><br><b>appears</b>', { x: 160, y: 112 });
    t1.style.fontSize = '32px';
    const tThing = clamp(at(2, 'another dog appearing', 0.5), cue(2) + 0.2, end(2) - 0.4);
    A.in(tl, b1, tThing, 'pop', { dur: 0.5 });
    A.in(tl, t1, tThing + 0.2, 'fadeRight', { dur: 0.5 });

    // ---------- beat 3: the context: a particular place, dogs too close, again and again
    const b2 = big(cCtx, 'map-pin', COL.A, 90, 150);
    const t2 = C3.put(cCtx, 'c3-lab', '<b>Same place,</b><br><b>dogs too close</b>', { x: 160, y: 112 });
    t2.style.fontSize = '32px';
    const tCtx = clamp(at(3, 'particular location', 0.3), cue(3) + 0.2, end(3) - 1.6);
    A.in(tl, b2, tCtx, 'pop', { dur: 0.5 });
    A.in(tl, t2, tCtx + 0.2, 'fadeRight', { dur: 0.5 });
    const reps = [0, 1, 2].map(k => {
      const r = C3.chip(cCtx, 'repeat', 'Again', 40 + k * 0, 220, { col: C.amber, size: 26 });
      return r;
    });
    reps.forEach((r, k) => { r.style.left = 30 + k * 128 + 'px'; r.innerHTML = ''; const ic = K.el('div', 'ic'); ic.style.background = C.amber; ic.appendChild(K.icon('dog')); r.appendChild(ic); r.style.padding = '6px'; });
    const tRep = clamp(at(3, 'repeatedly', 0.6), tCtx + 0.6, end(3) - 0.5);
    reps.forEach((r, k) => A.in(tl, r, tRep + k * 0.3, 'pop', { dur: 0.4 }));

    // ---------- beat 4: the place itself starts to predict trouble
    const t4 = cue(4);
    const pr = K.el('div', 'c3-row');
    const pin = K.el('div', 'ic'); pin.style.background = COL.A; pin.appendChild(K.icon('map-pin')); pr.appendChild(pin);
    pr.appendChild(K.el('span', null, K.md('The place itself *starts to predict* trouble')));
    const warn = K.el('div', 'ic'); warn.style.background = C.amber; warn.appendChild(K.icon('triangle-alert'));
    Object.assign(pr.style, { left: RX + 'px', top: '790px' });
    stage.appendChild(pr);
    const arw = K.el('div', 'ic'); arw.style.background = 'transparent'; arw.style.color = C.muted; arw.appendChild(K.icon('arrow-right'));
    pr.insertBefore(arw, pr.children[1]);
    pr.insertBefore(warn, pr.children[2]);
    A.in(tl, pr, clamp(at(4, 'start to predict', 0.5), t4 + 0.3, end(4) - 0.6), 'fadeUp', { dur: 0.6 });
    tl.to(b2, { scale: 1.15, duration: 0.3, yoyo: true, repeat: 1 }, t4 + 0.3);

    // ---------- beat 5: B = Behavior (the A details clear)
    const t5 = cue(5);
    tl.to([dA, cThing, cCtx, pr], { opacity: 0, y: -20, duration: 0.45, stagger: 0.05, ease: 'power2.in' }, t5 - 0.1);
    tl.to(nodes[0], { opacity: 0.55, duration: 0.4 }, t5);
    light(1, t5 + 0.1);
    const dB = C3.def(stage, 'B', COL.B, 'Behavior', 'What the dog *does*', RX, 300, RW);
    A.in(tl, dB, t5 + 0.4, 'fadeLeft', { dur: 0.6 });

    // ---------- beat 6: C = Consequence
    const t6 = cue(6);
    tl.to(nodes[1], { opacity: 0.55, duration: 0.4 }, t6);
    light(2, t6 + 0.1);
    const dC = C3.def(stage, 'C', COL.C, 'Consequence', 'What happens as a *direct result* of the behavior', RX, 500, RW);
    A.in(tl, dC, t6 + 0.4, 'fadeLeft', { dur: 0.6 });

    // ---------- beat 7: an easy way to remember it: the ring lights up
    const t7 = cue(7);
    tl.to([dB, dC], { opacity: 0, x: 40, duration: 0.45, stagger: 0.05, ease: 'power2.in' }, t7);
    tl.to(nodes, { opacity: 1, duration: 0.4 }, t7);
    tl.to([...R.arcs, ...R.heads], { stroke: C.green, duration: 0.5, stagger: 0.12 }, t7 + 0.2);
    const ez = C3.put(stage, 'c3-big', 'An easy way to <b>remember it</b>', { x: RX, y: 300 });
    A.in(tl, ez, t7 + 0.4, 'fadeUp', { dur: 0.6 });

    // ---------- beat 8: three summary rows, one per letter
    const t8 = cue(8);
    const SUM = [['A', COL.A, 'The thing and the *context*', 'A is the thing'], ['B', COL.B, 'What the dog *does*', 'B is what'], ['C', COL.C, 'What happens *as a result*', 'C is what']];
    let lo = t8;
    SUM.forEach(([L, col, txt, p], k) => {
      const r = C3.row(stage, null, txt, RX, 450 + k * 130, { letter: L, col, size: 40 });
      r.querySelector('.ic').style.cssText += 'width:86px;height:86px;font-size:48px;';
      const tt = clamp(at(8, p, 0.05 + k * 0.33), lo, end(8) - 0.4);
      A.in(tl, r, tt, 'fadeLeft', { dur: 0.5 });
      A.pulse(tl, nodes[k], tt);
      lo = tt + 0.5;
    });
  });

  // ================================================================== ch03s03 What did the behavior accomplish?
  registerScene('ch03s03', ctx => {
    const { stage, tl, cue, end } = ctx;
    C2.style(stage);
    C3.css(stage);
    const at = (i, p, fb, lead) => sayAt(ctx, i, p, fb, lead);
    C3.head(ctx, 'What Did the Behavior Accomplish?', { size: 72 });

    // ---------- beat 0: a small A, B, C row
    const TS = 120, TG = 120, X0 = 960 - (3 * TS + 2 * TG) / 2, TY = 290;
    const tiles = ['A', 'B', 'C'].map((L, k) => C3.tile(stage, L, X0 + k * (TS + TG), TY, TS, [COL.A, COL.B, COL.C][k]));
    const sv = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const ars = [0, 1].map(k => {
      const x0 = X0 + (k + 1) * TS + k * TG + 18, x1 = x0 + TG - 36, y = TY + TS / 2;
      return K.path(sv, `M ${x0} ${y} L ${x1} ${y} M ${x1 - 16} ${y - 16} L ${x1} ${y} L ${x1 - 16} ${y + 16}`, { stroke: C.olive, 'stroke-width': 8 });
    });
    tiles.forEach((n, k) => A.in(tl, n, cue(0) + 0.2 + k * 0.35, 'pop', { dur: 0.5 }));
    A.draw(tl, ars, cue(0) + 0.5, 0.5, { stagger: 0.35 });

    // ---------- beat 1: the question
    const qq = C3.ask(stage, 'What did the behavior accomplish?', 960, 470);
    A.in(tl, qq, cue(1) + 0.05, 'fadeUp', { dur: 0.6 });
    tl.to(tiles[2], { scale: 1.12, duration: 0.35, yoyo: true, repeat: 1 }, cue(1) + 0.4);

    // ---------- beat 2: function defined
    const fd = C3.def(stage, '', COL.fn, 'Function', '= what the behavior *accomplished* in that situation', 330, 620, 1260);
    fd.querySelector('.lt').appendChild(K.icon('target', { size: 62, stroke: 2.3 }));
    A.in(tl, fd, clamp(at(2, 'function', 0.6), cue(2) + 0.1, end(2) - 0.3), 'fadeUp', { dur: 0.6 });

    // ---------- beat 3: not what it looks like, what it does
    const t3 = cue(3);
    tl.to([...tiles, sv, qq], { opacity: 0, duration: 0.4 }, t3);
    tl.to(fd, { y: -360, duration: 0.8, ease: 'power3.inOut' }, t3 + 0.1);
    const mk = (x, icon, title, sub, good) => {
      const c = C3.put(stage, 'c3-card', null, { x, y: 470, w: 620, h: 330 });
      c.style.display = 'flex';
      c.style.flexDirection = 'column';
      c.style.alignItems = 'center';
      c.style.justifyContent = 'center';
      c.style.gap = '20px';
      const b = K.el('div', null);
      Object.assign(b.style, { width: '120px', height: '120px', borderRadius: '50%', display: 'grid', placeItems: 'center', background: good ? C.green : '#c9cdc3', color: '#fff' });
      b.appendChild(K.icon(icon, { size: 66, stroke: 2.2 }));
      c.appendChild(b);
      c.appendChild(K.el('div', null, `<span style="font:700 46px/1 var(--font-head);color:${good ? C.greenDark : C.muted}">${title}</span>`));
      c.appendChild(K.el('div', null, `<span style="font:600 30px/1 var(--font-body);color:${C.inkSoft}">${sub}</span>`));
      return c;
    };
    const cl = mk(300, 'eye', 'What it looks like', 'Barking, lunging, growling', false);
    const cd = mk(1000, 'target', 'What it does', 'In that situation', true);
    const tL = clamp(at(3, 'looks like', 0.3), t3 + 0.5, end(3) - 2);
    A.in(tl, cl, tL, 'fadeUp', { dur: 0.6 });
    const xMark = C2.badge(cl, 'x', 560, 40, 80, C.red, '#fff');
    const tD = clamp(at(3, 'what the behavior does', 0.6), tL + 1.0, end(3) - 0.6);
    tl.to(cl, { opacity: 0.55, duration: 0.5 }, tD);
    A.in(tl, xMark, tD, 'pop', { dur: 0.45 });
    A.in(tl, cd, tD + 0.1, 'fadeUp', { dur: 0.6 });
    tl.to(cd, { boxShadow: '0 18px 44px rgba(40,60,20,0.16), 0 0 0 5px rgba(97,149,55,1)', duration: 0.5 }, tD + 0.6);

    // ---------- beat 4: three examples slide in
    const t4 = cue(4);
    tl.to([cl, cd], { opacity: 0, y: 30, duration: 0.4, stagger: 0.05, ease: 'power2.in' }, t4 - 0.1);
    const TH = ['abc_greet_b.jpg', 'abc_approach_b.jpg', 'abc_guard_b.jpg'];
    TH.forEach((src, k) => {
      const p = K.photo(stage, src, { x: 150 + k * 560, y: 470, w: 500, h: 290, radius: 24 });
      p.root.style.border = '6px solid ' + C.olive;
      const num = K.el('div', 'c3-node', String(k + 1));
      Object.assign(num.style, { left: 150 + k * 560 - 26 + 'px', top: '444px', width: '76px', height: '76px', background: C.olive, fontSize: '40px' });
      stage.appendChild(num);
      tl.fromTo(p.root, { opacity: 0, x: 120 }, { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' }, t4 + 0.2 + k * 0.2);
      A.in(tl, num, t4 + 0.6 + k * 0.2, 'pop', { dur: 0.4 });
    });
  });
})();
