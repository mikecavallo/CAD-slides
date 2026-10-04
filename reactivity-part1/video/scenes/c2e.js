// Chapter 2: environment, and how the factors add up. Pot and helpers come from window.C2 (c2_pot.js).
//   ch02s09  Environment, predictability and choice   the dog's home; three amber cards for the human example that turn green
//                                                       (predictability, control); the dog joins; six stressors drip into the pot
//   ch02s10  These factors can add up                  the four areas cluster; a person's day stacks up and wobbles beside a normal
//                                                       day; five factors drop into one pot, step by step; same dog, different baseline
(() => {
  const CSS = `
  .c2e-card { position: absolute; width: 500px; height: 220px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 18px;
    background: var(--amber-pale); border: 3px solid #f1dcb4; border-radius: 28px; box-shadow: var(--shadow-soft); }
  .c2e-card .bd { width: 96px; height: 96px; border-radius: 50%; background: var(--amber); color: #fff; display: grid; place-items: center; }
  .c2e-card .bd svg { width: 52px; height: 52px; stroke-width: 2.2; }
  .c2e-card .nm { font: 700 40px/1 var(--font-head); color: #8a5410; white-space: nowrap; }
  .c2e-card.ok { background: var(--green-pale); border-color: var(--green-light); }
  .c2e-card.ok .bd { background: var(--green); }
  .c2e-card.ok .nm { color: var(--green-deep); }
  .c2e-blk { position: absolute; height: 92px; display: flex; align-items: center; gap: 18px; padding: 0 26px 0 14px; border-radius: 20px;
    background: #fff; border: 3px solid #f1dcb4; box-shadow: 0 8px 18px rgba(40,60,20,0.10); font: 700 32px/1 var(--font-body); color: var(--ink); white-space: nowrap; }
  .c2e-blk .ic { width: 62px; height: 62px; border-radius: 16px; background: var(--amber); color: #fff; display: grid; place-items: center; flex: 0 0 auto; }
  .c2e-blk .ic svg { width: 36px; height: 36px; stroke-width: 2.2; }
  .c2e-blk.red { border-color: #efc9bf; }
  .c2e-blk.red .ic { background: var(--red); }
  .c2e-plus { position: absolute; width: 44px; height: 44px; border-radius: 50%; background: var(--green); color: #fff; display: grid; place-items: center;
    font: 800 34px/1 var(--font-head); border: 4px solid #fff; box-shadow: 0 6px 14px rgba(44,74,23,0.25); }
  .c2e-same { position: absolute; left: 0; width: 1920px; text-align: center; font: 700 72px/1.1 var(--font-head); color: var(--ink); white-space: nowrap; }
  .c2e-same b { color: var(--green); font-weight: 700; }
  .c2e-pl { position: absolute; font: 700 32px/1 var(--font-body); color: var(--ink-soft); white-space: nowrap; text-align: center; width: 400px; }
  `;
  const css = stage => stage.appendChild(K.el('style', null, CSS));
  const { sayAt, clamp } = C1;
  const { C } = C2;

  function scard(parent, icon, name, x, y, ok) {
    const c = K.el('div', 'c2e-card' + (ok ? ' ok' : ''));
    Object.assign(c.style, { left: x + 'px', top: y + 'px' });
    const bd = K.el('div', 'bd');
    bd.appendChild(K.icon(icon));
    c.appendChild(bd);
    c.appendChild(K.el('div', 'nm', K.md(name)));
    parent.appendChild(c);
    return c;
  }
  function block(parent, icon, text, x, y, red) {
    const b = K.el('div', 'c2e-blk' + (red ? ' red' : ''));
    const ic = K.el('div', 'ic');
    ic.appendChild(K.icon(icon));
    b.appendChild(ic);
    b.appendChild(K.el('span', null, K.md(text)));
    Object.assign(b.style, { left: x + 'px', top: y + 'px' });
    parent.appendChild(b);
    return b;
  }

  // ================================================================== ch02s09 Environment, predictability and choice
  registerScene('ch02s09', ctx => {
    const { stage, tl, cue, end, dur } = ctx;
    C2.style(stage);
    css(stage);
    const at = (i, p, fb, lead) => sayAt(ctx, i, p, fb, lead);
    C2.areaHead(ctx, 3, 'Environment, Predictability & Choice', 64);

    // ---------- beat 0: the dog's home
    const LA = C2.layer(stage);
    const home = C2.badge(LA, 'house', 960, 600, 300, C.pale, C.greenDark);
    const hd = C2.badge(LA, 'dog', 1080, 700, 120, C.green, '#fff');
    hd.style.border = '6px solid #fff';
    A.in(tl, home, cue(0) + 0.2, 'pop', { dur: 0.7 });
    A.in(tl, hd, cue(0) + 0.6, 'pop', { dur: 0.5 });

    // ---------- beat 1: three amber cards
    const t1 = cue(1);
    tl.to([home, hd], { opacity: 0, scale: 0.8, duration: 0.45, ease: 'power2.in' }, t1 - 0.1);
    const XS = [140, 710, 1280], CY = 330;
    const HUM = [['calendar', 'What’s next?', 'going to happen next', 0.3], ['shuffle', 'Plans keep changing', 'plans keep changing', 0.55], ['ban', 'No say', 'very little say', 0.8]];
    let lo = t1 + 0.3;
    const cards = HUM.map(([ic, t, p, fb], k) => {
      const c = scard(LA, ic, t, XS[k], CY);
      const tt = clamp(at(1, p, fb, 0.3), lo, end(1) - 0.6);
      A.in(tl, c, tt, 'fadeUp', { dur: 0.6 });
      lo = tt + 0.5;
      return c;
    });
    const you = C2.badge(LA, 'user', 960, 720, 150, '#fff', C.amber);
    you.style.border = '6px solid var(--amber)';
    A.in(tl, you, t1 + 0.3, 'pop', { dur: 0.5 });
    tl.to(you, { x: -8, duration: 0.08, yoyo: true, repeat: 7, ease: 'sine.inOut' }, lo + 0.3);

    // ---------- beat 2: predictability and control
    const t2 = cue(2);
    const ok1 = scard(LA, 'calendar-check', 'Predictability', XS[0], CY, true);
    const ok3 = scard(LA, 'sliders-horizontal', 'Control', XS[2], CY, true);
    [[cards[0], ok1, 'predictability', 0.3], [cards[2], ok3, 'control', 0.5]].forEach(([a, b, p, fb], k) => {
      const tt = clamp(at(2, p, fb, 0.3), t2 + 0.1 + k * 0.5, end(2) - 1.5);
      tl.to(a, { rotationY: 90, duration: 0.3, ease: 'power2.in' }, tt);
      tl.fromTo(b, { rotationY: -90, opacity: 0 }, { rotationY: 0, opacity: 1, duration: 0.35, ease: 'power2.out' }, tt + 0.3);
    });
    tl.to(cards[1], { opacity: 0, scale: 0.85, duration: 0.4, ease: 'power2.in' }, t2 + 0.3);
    const easier = C2.pill(LA, 'smile', 'Easier to handle', { x: 960, y: 405, center: true, variant: 'green', size: 36 });
    A.in(tl, easier, clamp(at(2, 'easier to handle', 0.85, 0.3), t2 + 1.2, end(2)), 'pop', { dur: 0.55 });
    tl.to(you, { borderColor: C.green, color: C.greenDark, duration: 0.4 }, clamp(at(2, 'easier to handle', 0.85, 0.3), t2 + 1.2, end(2)));

    // ---------- beat 3: dogs benefit too
    const t3 = cue(3);
    tl.to(you, { x: -110, duration: 0.6, ease: 'power2.inOut' }, t3);
    const dg = C2.badge(LA, 'dog', 1070, 720, 150, '#fff', C.greenDark);
    dg.style.border = '6px solid var(--green)';
    A.in(tl, dg, t3 + 0.3, 'pop', { dur: 0.55 });
    const ck = C2.badge(LA, 'check', 1130, 655, 54, C.green, '#fff');
    ck.style.border = '4px solid #fff';
    A.in(tl, ck, t3 + 0.7, 'pop', { dur: 0.45 });

    // ---------- beat 4: six stressors drip into the pot
    const t4 = cue(4);
    tl.to(LA, { opacity: 0, duration: 0.45, ease: 'power2.in' }, t4 - 0.2);
    const LB = C2.layer(stage, tl, t4);
    const P = C2.makePot(LB, { cx: 1450, y: 430, s: 0.85, level: 0.3 });
    A.in(tl, P.wrap, t4 + 0.1, 'fadeLeft', { dur: 0.7 });
    P.waves(tl, t4, dur);
    const ST = [['calendar-x', 'Changes in routine', 'Changes in routine', 0.02, C.amber], ['shuffle', 'Unpredictability', 'unpredictable household', 0.15, C.amber],
      ['swords', 'Social conflict', 'social conflict', 0.27, C.red], ['door-closed', 'Can’t move away or opt out', 'move away or opt out', 0.42, C.red],
      ['circle-alert', 'Punishment or confrontational handling', 'punishment', 0.6, C.red], ['lock', 'Little control', 'little control', 0.75, C.amber]];
    lo = t4 + 0.5;
    let L = 0.3, tLast = 0;
    ST.forEach(([ic, t, p, fb, col], k) => {
      const y = 286 + k * 106;
      const c = C2.pill(LB, ic, t, { x: 100, y, size: 31, col });
      const tt = clamp(at(4, p, fb, 0.3), lo, end(4) - 1.8);
      A.in(tl, c, tt, 'fadeRight', { dur: 0.5 });
      const land = P.drip(tl, 1060, y + 37, tt + 0.35, col, 0.8);
      L += 0.09;
      P.setLevel(tl, L, land - 0.05, 0.6);
      lo = tt + 0.55;
      tLast = land;
    });
    const raise = C2.pill(LB, 'trending-up', 'These can *raise* the water level', { x: 1450, y: 840, center: true, variant: 'amber', size: 32 });
    A.in(tl, raise, clamp(at(4, 'raise the water level', 0.92, 0.3), tLast, end(4) + 0.3), 'fadeUp', { dur: 0.6 });
  });

  // ================================================================== ch02s10 These factors can add up
  registerScene('ch02s10', ctx => {
    const { stage, tl, cue, end, dur } = ctx;
    C2.style(stage);
    css(stage);
    const at = (i, p, fb, lead) => sayAt(ctx, i, p, fb, lead);
    const h = K.heading(stage, 'These Factors Can Add Up', { x: 100, y: 120, size: 80 });
    A.in(tl, h.all, 0.05, 'fadeUp', { dur: 0.7, stagger: 0.1 });

    // ---------- beat 0: the four areas, spread out, gather into one cluster
    const LA = C2.layer(stage);
    const START = [[360, 420], [1560, 440], [520, 800], [1400, 800]];
    const END = [[880, 520], [1040, 520], [880, 680], [1040, 680]];
    const bs = C2.AREAS.map((a, k) => {
      const b = C2.badge(LA, a.icon, START[k][0], START[k][1], 130, a.col, '#fff');
      b.style.border = '6px solid #fff';
      b.style.boxShadow = 'var(--shadow-soft)';
      A.in(tl, b, cue(0) + 0.1 + k * 0.12, 'pop', { dur: 0.5 });
      tl.to(b, { x: END[k][0] - START[k][0], y: END[k][1] - START[k][1], duration: 0.9, ease: 'power3.inOut' }, cue(0) + 1.1 + k * 0.06);
      return b;
    });
    const ring = K.svg(LA, { x: 0, y: 0, w: 1920, h: 1080 });
    const rc = K.circle(ring, 960, 600, 190, { fill: 'none', stroke: C.greenLight, 'stroke-width': 8, 'stroke-dasharray': '14 12' });
    A.draw(tl, rc, cue(0) + 2.0, 0.8);

    // ---------- beat 1: one person's day stacks up
    const t1 = cue(1);
    tl.to(LA, { opacity: 0, duration: 0.45, ease: 'power2.in' }, t1 - 0.2);
    const LB = C2.layer(stage, tl, t1);
    const person = C2.badge(LB, 'user', 260, 740, 200, '#fff', C.greenDark);
    person.style.border = '6px solid var(--green)';
    A.in(tl, person, t1 + 0.1, 'pop', { dur: 0.5 });
    const DAY = [['bed', 'Slept poorly', 'slept poorly', 0.1], ['zap', 'Headache', 'headache', 0.25], ['utensils-crossed', 'Skipped lunch', 'skipped lunch', 0.38],
      ['briefcase', 'Stress at work', 'stressful interaction', 0.58], ['triangle-alert', 'Unexpected problem', 'unexpected problem', 0.9]];
    const stack = K.el('div');
    Object.assign(stack.style, { position: 'absolute', left: '440px', top: '0px', width: '520px', height: '1080px', transformOrigin: '50% 880px' });
    LB.appendChild(stack);
    let lo = t1 + 0.3;
    const blocks = DAY.map(([ic, t, p, fb], k) => {
      const b = block(stack, ic, t, 0, 880 - 92 - k * 100, k === 4);
      b.style.width = '470px';
      const tt = clamp(at(1, p, fb, 0.3), lo, end(1) - 0.6);
      tl.fromTo(b, { opacity: 0, y: -160 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.in' }, tt);
      tl.to(stack, { scaleY: 0.97, duration: 0.08, yoyo: true, repeat: 1, ease: 'power1.out' }, tt + 0.5);
      lo = tt + 0.4;
      return b;
    });

    // ---------- beat 2: a normal day: just the problem, manageable. That day: the stack wobbles
    const t2 = cue(2);
    const nd = block(LB, 'triangle-alert', 'Unexpected problem', 1240, 788, true);
    nd.style.width = '470px';
    const ndl = C2.pill(LB, 'smile', 'Normal day: *manageable*', { x: 1475, y: 680, center: true, variant: 'pale', size: 32 });
    const tN = clamp(at(2, 'normally be manageable', 0.25, 0.3), t2 + 0.1, end(2) - 3);
    A.in(tl, nd, tN, 'fadeLeft', { dur: 0.6 });
    A.in(tl, ndl, tN + 0.4, 'fadeUp', { dur: 0.5 });
    const tW = clamp(at(2, 'that particular day', 0.6, 0.3), tN + 1.4, end(2) - 1);
    tl.to(stack, { rotation: 3, duration: 0.16, yoyo: true, repeat: 7, ease: 'sine.inOut' }, tW);
    const td = C2.pill(LB, 'triangle-alert', 'That day: *harder to handle*', { x: 675, y: 300, center: true, variant: 'red', size: 34 });
    td.querySelectorAll('b').forEach(b => { b.style.color = 'var(--red)'; });
    A.in(tl, td, tW + 0.2, 'fadeDown', { dur: 0.5 });
    tl.to(person, { borderColor: C.red, color: C.red, duration: 0.4 }, tW + 0.2);

    // ---------- beat 3: for a dog: five factors drop into one pot, step by step
    const t3 = cue(3);
    tl.to(LB, { opacity: 0, duration: 0.45, ease: 'power2.in' }, t3 - 0.2);
    const LC = C2.layer(stage, tl, t3);
    const P = C2.makePot(LC, { cx: 1080, y: 440, s: 0.95, level: 0.22 });
    A.in(tl, P.wrap, t3 + 0.1, 'fadeUp', { dur: 0.6 });
    P.waves(tl, t3, dur);
    const fd = C2.pill(LC, 'dog', 'For a dog', { x: 100, y: 278, variant: 'green', size: 32 });
    A.in(tl, fd, t3 + 0.2, 'fadeRight', { dur: 0.5 });
    const FAC = [['moon', 'Poor sleep', 'poor sleep', 0.15, C.red], ['stethoscope', 'Pain', 'pain', 0.25, C.red],
      ['volleyball', 'Too much or too little stimulation', 'too much or too little', 0.42, C.amber], ['house', 'Change at home', 'changes at home', 0.68, C.amber],
      ['zap', 'Unpleasant experiences', 'unpleasant', 0.92, C.red]];
    lo = t3 + 0.5;
    let L = 0.22;
    const pills = FAC.map(([ic, t, p, fb, col], k) => {
      const y = 380 + k * 104;
      const c = C2.pill(LC, ic, t, { x: 140, y, size: 30, col });
      const tt = clamp(at(3, p, fb, 0.3), lo, end(3) - 1.0);
      A.in(tl, c, tt, 'fadeRight', { dur: 0.5 });
      const land = P.drip(tl, 140 + 37, y + 37, tt + 0.25, col, 0.8);
      L += 0.13;
      P.setLevel(tl, L, land - 0.05, 0.5, 'power2.out');
      lo = tt + 0.55;
      return c;
    });

    // ---------- beat 4: together they add up; little room left
    const t4 = cue(4);
    const plus = [0, 1, 2, 3, 4].map(k => {
      const n = C2.put(LC, 'c2e-plus', '+', { x: 92, y: 380 + k * 104 + 15 });
      A.in(tl, n, t4 + 0.1 + k * 0.12, 'pop', { dur: 0.4 });
      return n;
    });
    const tUp = clamp(at(4, 'raise the water level', 0.75, 0.4), t4 + 0.8, end(4) - 1.6);
    P.setLevel(tl, 0.9, tUp, 0.8);
    tl.fromTo(P.br, { opacity: 0 }, { opacity: 1, duration: 0.4, immediateRender: false }, tUp + 0.3);
    tl.set(P.br, { opacity: 0 }, 0);
    const lit = C2.pill(LC, 'minimize-2', 'Little room left', { x: P.bracketX(), y: 0, variant: 'amber', size: 30 });
    P.follow(lit, 'mid', -36);
    A.in(tl, lit, tUp + 0.5, 'fadeRight', { dur: 0.5 });

    // ---------- beat 5: same dog, different baseline
    const t5 = cue(5);
    tl.to(LC, { opacity: 0, duration: 0.4, ease: 'power2.in' }, t5 - 0.15);
    const LD = C2.layer(stage, tl, t5);
    const PL = C2.makePot(LD, { cx: 520, y: 420, s: 0.72, level: 0.3 });
    const PR = C2.makePot(LD, { cx: 1400, y: 420, s: 0.72, level: 0.88 });
    PL.waves(tl, t5, dur);
    PR.waves(tl, t5, dur);
    const dg = C2.badge(LD, 'dog', 960, 560, 170, '#fff', C.greenDark);
    dg.style.border = '7px solid var(--green)';
    A.in(tl, dg, t5 + 0.05, 'pop', { dur: 0.5 });
    A.in(tl, PL.wrap, t5 + 0.2, 'fadeRight', { dur: 0.6 });
    A.in(tl, PR.wrap, t5 + 0.35, 'fadeLeft', { dur: 0.6 });
    const sv = K.svg(LD, { x: 0, y: 0, w: 1920, h: 1080 });
    const arL = K.path(sv, 'M 860 560 L 790 560', { stroke: C.greenLight, 'stroke-width': 10, fill: 'none' });
    const arR = K.path(sv, 'M 1060 560 L 1130 560', { stroke: C.greenLight, 'stroke-width': 10, fill: 'none' });
    A.draw(tl, [arL, arR], t5 + 0.5, 0.4);
    const same = C2.put(LD, 'c2e-same', 'Same dog. *Different baseline.*', { x: 0, y: 790 });
    A.words(tl, same, clamp(at(5, 'Same dog', 0.05, 0.1), t5 + 0.2, end(5) - 1), { stagger: 0.12 });
  });
})();
