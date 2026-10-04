// Chapter 3 (the ABCs of behavior): welcome, plan, the ABCs, function. Shared parts: window.C3 (c3_abc.js), C2, C1.
//   ch03intro  Welcome              shared title slide
//   ch03card   Chapter card         shared narrated chapter card
//   ch03plan   Where we're headed   shared plan slide
//   ch03s01    The ABCs of Behavior chapter 2's pot and thermometer wait ("Coming up"); a dog in a dashed circle; A, B, C tiles land
//   ch03s02    The ABCs             the greeting strip as the explainer: definitions in the frames, the heart for the emotional
//                                   response between A and B, then the definitions fade into the greeting photos
//   ch03s03    What did it accomplish?  A, B, C row, the question, function defined, looks like vs does, the greeting's
//                                       possible function, two more examples
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

  /** Chapter 2's pot with the thermometer standing up through the middle of the opening (pot svg coordinates): the
   *  thermometer is drawn over the glass, then the front half of the rim is drawn again over the thermometer, so the tube
   *  comes up out of the water through the centre of the rim. Returns {P, th, merc}. */
  function potWithThermo(parent, cx, y, s, level = 0.5) {
    const P = C2.makePot(parent, { cx, y, s, level });
    const TX = 0;
    const th = K.group(P.svg);
    K.rect(th, TX - 28, -150, 56, 420, { rx: 28, fill: '#ffffff', stroke: C.greenDeep, 'stroke-width': 7 });
    K.circle(th, TX, 276, 48, { fill: '#ffffff', stroke: C.greenDeep, 'stroke-width': 7 });
    K.circle(th, TX, 276, 34, { fill: C.red });
    const merc = K.rect(th, TX - 12, 240, 24, 50, { rx: 12, fill: C.red });
    [-100, -40, 20, 80, 140].forEach(yy => K.line(th, TX + 6, yy, TX + 22, yy, { stroke: C.greenDeep, 'stroke-width': 4 }));
    K.path(P.svg, `M ${-C2.R} 0 A ${C2.R} 42 0 0 0 ${C2.R} 0`, { stroke: C.greenDark, 'stroke-width': 16, fill: 'none' });
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
    const lab = C3.def(stage, '', C.red, 'Temperature', '', 1060, 440, 420);
    lab.querySelector('.lt').appendChild(K.icon('thermometer', { size: 60, stroke: 2.4 }));
    A.in(tl, lab, clamp(at(0, 'temperature', 0.6), tT + 0.4, end(0) - 0.5), 'fadeLeft', { dur: 0.7 });

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

  // ================================================================== ch03s02 The ABCs (explained on the excited greeting)
  // The ABC strip with the greeting panels: first each frame holds its definition and a heart for the emotional response pops
  // between A and B; then each definition fades into the greeting photo with its caption.
  registerScene('ch03s02', ctx => {
    const { stage, tl, cue, end } = ctx;
    C2.style(stage);
    C3.css(stage);
    const at = (i, p, fb, lead) => sayAt(ctx, i, p, fb, lead);
    stage.appendChild(K.el('style', null, `
      .c3d-def { position: absolute; inset: 0; background: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center;
        gap: 12px; padding: 18px 22px; text-align: center; box-sizing: border-box; }
      .c3d-def .w { font: 700 42px/1 var(--font-head); }
      .c3d-def .d { font: 600 34px/1.25 var(--font-body); color: var(--ink); }
      .c3d-def .d b { color: var(--green-dark); }
      .c3d-def .d i { font-style: normal; color: var(--ink-soft); font-weight: 500; }
      .c3d-emo { position: absolute; text-align: center; font: 700 26px/1.1 var(--font-body); color: ${COL.emo}; }`));
    const h1 = C3.head(ctx, 'The ABCs', { size: 72 });
    const h2 = K.heading(stage, 'An Excited Greeting', { x: 100, y: 110, w: 1440, size: 72, barGap: 18 });
    gsap.set(h2.all, { opacity: 0 });

    const S = C3.strip(stage, { x: 140, y: 236, w: 1640, gap: 190, panels: ['abc_greet_a.jpg', 'abc_greet_b.jpg', 'abc_greet_c.jpg'],
      captions: ['A person appears<br>outside the window', 'The dog jumps at the<br>window and barks', 'The person comes inside<br>and gives attention'] });
    S.frames(tl, 0.2);
    const DEF = [
      ['Antecedent', COL.A, 'The thing that happens + <b>the context</b> around it'],
      ['Behavior', COL.B, 'What the dog does<br><i>e.g. barking, lunging</i>'],
      ['Consequence', COL.C, 'What happens <b>as a result</b>'],
    ];
    const defs = DEF.map(([w, col, d], k) => {
      const n = K.el('div', 'c3d-def');
      n.appendChild(K.el('div', 'd', d));
      S.cols[k].panel.appendChild(n);
      gsap.set(n, { opacity: 0 });
      return n;
    });
    const head = (k, t) => tl.fromTo(S.cols[k].head, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', immediateRender: false }, t);
    const showDef = (k, t) => {
      head(k, t);
      tl.fromTo(defs[k], { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out', immediateRender: false }, t + 0.1);
      if (k > 0) tl.fromTo(S.arrows[k - 1], { opacity: 0 }, { opacity: 1, duration: 0.4, immediateRender: false }, t);
    };
    // the photo replaces the definition
    const toPhoto = (k, t) => {
      tl.fromTo(S.cols[k].img, { opacity: 0, scale: 1.1 }, { opacity: 1, scale: 1, duration: 1.0, ease: 'power2.out', immediateRender: false }, t);
      tl.to(defs[k], { opacity: 0, duration: 0.6 }, t + 0.1);
      tl.fromTo(S.cols[k].cap, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, immediateRender: false }, t + 0.4);
    };
    // the emotional response: a heart between A and B
    const [hx, hy] = S.arrowPt(0);
    const heart = C2.badge(S.wrap, 'heart', hx, hy - 66, 80, COL.emo, '#fff');
    heart.style.border = '5px solid #fff';
    heart.style.boxShadow = '0 8px 20px rgba(80,40,90,0.3)';
    const emo = C2.put(S.wrap, 'c3d-emo', 'Emotional<br>response', { x: hx - 90, y: hy + 34, w: 180 });
    gsap.set([heart, emo], { opacity: 0 });

    // ---------- beats 0, 1: A and the context
    showDef(0, cue(0) + 0.1);
    const tCx = clamp(at(1, 'where it happens', 0.3), cue(1) + 0.2, end(1) - 0.8);
    tl.to(defs[0].querySelector('b'), { backgroundColor: 'rgba(184,217,154,0.8)', duration: 0.3 }, tCx);
    tl.to(defs[0], { scale: 1.05, duration: 0.3, yoyo: true, repeat: 1 }, tCx);
    // ---------- beat 2: the emotional response between A and B
    const tE = clamp(at(2, 'emotional response', 0.3), cue(2) + 0.1, end(2) - 1);
    tl.fromTo(heart, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)', immediateRender: false }, tE);
    tl.fromTo(emo, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, immediateRender: false }, tE + 0.2);
    for (let k = 0; k < 4; k++) tl.to(heart, { scale: 1.15, duration: 0.14, yoyo: true, repeat: 1 }, tE + 0.8 + k * 0.9);
    // ---------- beats 3, 4: B and C
    showDef(1, cue(3) + 0.1);
    showDef(2, cue(4) + 0.1);
    // ---------- beat 5: the example: the heading becomes An Excited Greeting
    const t5 = cue(5);
    tl.to(h1.all, { opacity: 0, duration: 0.4 }, t5);
    tl.fromTo(h2.all, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, immediateRender: false }, t5 + 0.3);
    // ---------- beats 6, 7, 8: each definition becomes the photo
    toPhoto(0, cue(6) + 0.1);
    tl.to(heart, { scale: 1.25, duration: 0.2, yoyo: true, repeat: 3 }, clamp(at(7, 'emotional response', 0.2), cue(7), end(7) - 1));
    toPhoto(1, clamp(at(7, 'jumps', 0.5), cue(7) + 0.6, end(7) - 0.6));
    toPhoto(2, cue(8) + 0.1);
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

    // ---------- beat 4: the greeting's answer: its B and C photos and the possible function
    const t4 = cue(4);
    tl.to([cl, cd], { opacity: 0, y: 30, duration: 0.4, stagger: 0.05, ease: 'power2.in' }, t4 - 0.1);
    const GR = [['abc_greet_b.jpg', 'B'], ['abc_greet_c.jpg', 'C']].map(([src, L], k) => {
      const p = K.photo(stage, src, { x: 330 + k * 660, y: 450, w: 600, h: 320, radius: 24 });
      p.root.style.border = '6px solid ' + C.olive;
      const num = K.el('div', 'c3-node', L);
      Object.assign(num.style, { left: 330 + k * 660 - 26 + 'px', top: '424px', width: '76px', height: '76px', background: k ? COL.C : COL.B, fontSize: '40px' });
      stage.appendChild(num);
      tl.fromTo(p.root, { opacity: 0, x: 80 }, { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' }, t4 + 0.2 + k * 0.25);
      A.in(tl, num, t4 + 0.6 + k * 0.25, 'pop', { dur: 0.4 });
      return [p.root, num];
    }).flat();
    const tag = C3.fnTag(stage, 'in', 'Decrease distance / gain attention', 960, 820);
    tag.show(tl, clamp(at(4, 'get closer', 0.5), t4 + 1.0, end(4) - 0.8));

    // ---------- beat 5: two more examples
    const t5 = cue(5);
    tl.to([...GR, tag.t], { opacity: 0, duration: 0.4 }, t5 - 0.1);
    [['abc_approach_b.jpg', 'A Person Approaches'], ['abc_guard_b.jpg', 'Guarding a Toy']].forEach(([src, lab], k) => {
      const p = K.photo(stage, src, { x: 330 + k * 660, y: 470, w: 600, h: 320, radius: 24 });
      p.root.style.border = '6px solid ' + C.olive;
      const l = C2.put(stage, 'c3-mid', `<b>${lab}</b>`, { x: 330 + k * 660, y: 810, w: 600, align: 'center' });
      tl.fromTo(p.root, { opacity: 0, x: 100 }, { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' }, t5 + 0.2 + k * 0.25);
      A.in(tl, l, t5 + 0.6 + k * 0.25, 'fadeUp', { dur: 0.5 });
    });
  });
})();
