// Markers and Mechanics, Part 4: teaching your dog.
//   tm04s01  introduce one marker at a time: setup, no behavior needed, separate sessions of 10 to 15 reps, the order strip
//   tm04s02  teach the mouth-delivery marker (clip)
//   tm04s03  teach the treat-toss marker (clip; a small toss arc)
//   tm04s04  teach the scatter marker (clip; treats sprinkle on a ground line)
//   tm04s05  does your dog understand? the drawn dog anticipates each game before the hand moves
//   tm04s06  a marker your dog understands (clip)
(() => {
  const { at, put, clamp } = TM;
  const CSS = `
  .tmd-ses { position: absolute; width: 400px; height: 200px; box-sizing: border-box; border-radius: 24px; background: #fff; border: 1px solid #e6e9e1;
    box-shadow: var(--shadow-soft); padding: 22px 26px; display: flex; flex-direction: column; gap: 14px; }
  .tmd-ses .t { font: 700 30px/1 var(--font-head); color: var(--ink-soft); }
  .tmd-ses .tm-word { position: relative; left: auto; top: auto; align-self: flex-start; }
  .tmd-ses .n { font: 600 28px/1 var(--font-body); color: var(--green-dark); }
  .tmd-ses.later { background: var(--green-mist); border: 3px dashed var(--green-light); box-shadow: none; }
  `;
  const css = stage => { TM.style(stage); if (!stage.querySelector('style[data-tmd]')) { const s = K.el('style', null, CSS); s.dataset.tmd = '1'; stage.appendChild(s); } };
  const flow = n => { n.style.position = 'relative'; n.style.left = n.style.top = ''; return n; };

  // ---------------------------------------------------------------- introduce one marker at a time
  registerScene('tm04s01', ctx => {
    const { stage, tl, cue, end } = ctx;
    css(stage);
    TM.head(ctx, 'Teaching your dog', 'Introduce one marker at a time');
    const r1 = put(stage, K.el('div'), 100, 285, { position: 'absolute', display: 'flex', gap: '18px' });
    [['Quiet, comfortable place', 'house', 'quiet'], ['Small treats ready', 'cookie', 'small treats']].forEach(([w, ic, p]) => {
      const n = flow(TM.word(r1, w, { variant: 'pale', icon: ic, size: 32 }));
      A.in(tl, n, at(ctx, 0, p, 0.3), 'pop', { dur: 0.45 });
    });
    const r2 = put(stage, K.el('div'), 100, 380, { position: 'absolute', display: 'flex', alignItems: 'center', gap: '18px' });
    const nl = flow(put(r2, K.el('div', 'tm-lab', 'Not needed yet:'), 0, 0, { fontSize: '32px' }));
    A.in(tl, nl, cue(1) + 0.1, 'fadeUp', { dur: 0.4 });
    [['Sit', 'sit'], ['Look at you', 'look at you'], ['Other behaviors', 'another behavior']].forEach(([w, p]) => {
      const n = flow(TM.word(r2, w, { variant: 'red', cross: true, size: 30 }));
      const t = at(ctx, 1, p, 0.35);
      A.in(tl, n, t, 'pop', { dur: 0.4 });
      TM.strike(tl, n, t + 0.3);
    });
    const lead = K.text(stage, 'You’re teaching <b style="color:var(--green)">what each marker predicts</b>.', { x: 100, y: 470, cls: 'lead', size: 36 });
    A.in(tl, lead, at(ctx, 1, 'what each marker predicts', 0.8), 'fadeUp', { dur: 0.5 });
    // sessions: one marker each, then mixed later
    const S = [['Session 1', '“Yip”'], ['Session 2', '“Chase”'], ['Session 3', '“Scatter”']];
    const tS = at(ctx, 2, 'one marker per session', 0.1);
    S.forEach(([t, w], i) => {
      const c = put(stage, K.el('div', 'tmd-ses'), 100 + i * 430, 560);
      c.appendChild(K.el('div', 't', t));
      c.appendChild(TM.word(c, w, { variant: 'green', size: 30 }));
      c.appendChild(K.el('div', 'n', '10 to 15 reps'));
      tl.fromTo(c, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, tS + 0.35 * i);
    });
    const lt = put(stage, K.el('div', 'tmd-ses later'), 1390, 560);
    lt.appendChild(K.el('div', 't', 'Later'));
    lt.appendChild(K.el('div', 'n', 'Mix markers in one session, once each is familiar'));
    A.in(tl, lt, at(ctx, 2, 'before using multiple', 0.75), 'fadeUp', { dur: 0.6 });
    const o = TM.order(stage, ['Mark or click', 'Pause', 'Move your hand'], { y: 830, size: 32, center: true, icons: ['volume-2', 'pause', 'hand'] });
    A.in(tl, o.items, at(ctx, 3, 'same order', 0.2), 'fadeRight', { dur: 0.4, stagger: 0.15 });
  });

  // ---------------------------------------------------------------- the three introductions (clips)
  registerScene('tm04s02', ctx => {
    TM.videoSlide(ctx, {
      kicker: 'Teaching your dog', heading: 'Teach the mouth-delivery marker',
      rows: [
        { icon: 'dog', html: 'Mark, pause, *treat to the mouth*', beat: 0, phrase: 'say your chosen', fb: 0.05 },
        { icon: 'timer', html: 'A short break *between reps*', beat: 1, phrase: 'short break', fb: 0.2 },
        { icon: 'mouse-pointer-click', html: 'Clicker: *click, pause, treat*', beat: 2, phrase: 'clicker', fb: 0.2 },
      ],
    });
  });

  registerScene('tm04s03', ctx => {
    const { stage, tl, cue } = ctx;
    TM.videoSlide(ctx, {
      kicker: 'Teaching your dog', heading: 'Teach the treat-toss marker', top: 470, gap: 26,
      rows: [
        { icon: 'move-right', html: 'Mark, pause, *a short, easy toss*', beat: 0, phrase: 'toss one treat', fb: 0.4 },
        { icon: 'hand', html: 'Low and across your body, *like bowling*', beat: 1, phrase: 'low, sweeping', fb: 0.1 },
        { icon: 'shuffle', html: 'Then vary *direction and distance*', beat: 2, phrase: 'gradually vary', fb: 0.6 },
        { icon: 'shield-check', html: 'A safe area *with room*', beat: 3, phrase: 'safe area', fb: 0.4 },
      ],
    });
    // the bowling motion: the hand sweeps down low and across, the treat skims along the ground
    const sv = K.svg(stage, { x: 100, y: 290, w: 740, h: 160 });
    const ground = K.path(sv, 'M 10 140 L 730 140', { stroke: '#cfe3b8', 'stroke-width': 6, 'stroke-linecap': 'round', fill: 'none' });
    const sweep = K.path(sv, 'M 40 20 C 40 110, 120 140, 230 130', { stroke: '#d9912b', 'stroke-width': 5, fill: 'none', 'stroke-dasharray': '3 12', 'stroke-linecap': 'round' });
    const hand = K.iconBadge(stage, 'hand', { x: 105, y: 290, size: 70, variant: 'amber' });
    const tr = TM.treat(stage, 330, 418, 1.2);
    A.draw(tl, ground, cue(0) + 0.3, 0.6);
    A.in(tl, hand, cue(0) + 0.4, 'pop', { dur: 0.4 });
    const run = t => {
      tl.to(hand, { motionPath: { path: 'M 0 0 C 0 90, 80 120, 190 110' }, duration: 0.7, ease: 'power2.inOut' }, t);
      A.draw(tl, sweep, t, 0.7);
      TM.lowToss(tl, tr, 420, t + 0.6, 1.0);
    };
    run(at(ctx, 0, 'toss one treat', 0.4));
    const lab = put(stage, K.el('div', 'tm-lab', 'Low and across, like bowling'), 380, 300, { fontSize: '28px', color: 'var(--green-dark)' });
    A.in(tl, lab, at(ctx, 1, 'bowling', 0.3), 'fadeUp', { dur: 0.5 });
  });

  registerScene('tm04s04', ctx => {
    const { stage, tl, cue, end } = ctx;
    TM.videoSlide(ctx, {
      kicker: 'Teaching your dog', heading: 'Teach the scatter marker', top: 470, gap: 30,
      rows: [
        { icon: 'circle-dot', html: 'Mark, pause, *scatter a few*', beat: 0, phrase: 'scatter a few', fb: 0.5 },
        { icon: 'square', html: 'Clear surface: *one scatter = one rep*', beat: 1, phrase: 'each scatter', fb: 0.8 },
        { icon: 'leaf', html: 'Then other surfaces, *like short grass*', beat: 2, phrase: 'short grass', fb: 0.7 },
      ],
    });
    const sv = K.svg(stage, { x: 100, y: 290, w: 740, h: 160 });
    const ground = K.path(sv, 'M 10 130 L 730 130', { stroke: '#b8d99a', 'stroke-width': 8, 'stroke-linecap': 'round', fill: 'none' });
    A.draw(tl, ground, cue(0) + 0.4, 0.6);
    const tS = at(ctx, 0, 'scatter a few', 0.5);
    [[150, 0], [260, 0.12], [330, 0.05], [430, 0.2], [520, 0.09], [610, 0.16]].forEach(([x, d], i) => {
      const t = TM.treat(stage, 100 + x, 290 + 112 - (i % 2) * 6, 1.0);
      tl.fromTo(t, { opacity: 0, y: -110 }, { opacity: 1, y: 0, duration: 0.55, ease: 'bounce.out' }, tS + d * 3);
    });
  });

  // ---------------------------------------------------------------- does your dog understand?
  registerScene('tm04s05', ctx => {
    const { stage, tl, cue, end } = ctx;
    TM.style(stage);
    C2.style(stage);
    TM.head(ctx, 'Check for understanding', 'Does your dog understand?');
    const PX = 100, PY = 290, PW = 820, PH = 440;
    const panel = put(stage, K.el('div', 'tm-panel'), PX, PY, { width: PW + 'px', height: PH + 'px' });
    A.in(tl, panel, cue(0) + 0.2, 'fadeUp', { dur: 0.6 });
    const sv = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const DX = 700, DY = 500;
    const D = C2.dog(sv, DX, DY, 0.72);
    A.in(tl, D.outer, cue(0) + 0.4, 'fade', { dur: 0.6 });
    const yip = TM.bubble(stage, 'Yip!', { x: PX + 40, y: PY + 36, size: 44 });
    const tY = at(ctx, 0, 'hearing the marker', 0.5);
    A.in(tl, yip, tY, 'pop', { dur: 0.45 });
    const still = TM.word(stage, 'Before your hand moves', { x: PX + 30, y: PY + PH - 86, variant: 'amber', size: 28, icon: 'hand' });
    A.in(tl, still, at(ctx, 0, 'before your hand moves', 0.85), 'fadeUp', { dur: 0.45 });
    // three responses: the dog acts each one out
    const col = put(stage, K.el('div', 'tm-col'), 980, 300, { width: '840px', gap: '30px' });
    const R = [['arrow-left', 'Turns toward you: *to the mouth*', 'turn toward you'], ['move-up-right', 'Gets ready to follow: *a toss*', 'follow a toss'], ['arrow-down', 'Looks at the ground: *a scatter*', 'toward the ground']];
    const tr = R.map(([ic, h, p]) => {
      const r = TM.row(col, ic, h, { size: 33 });
      const t = at(ctx, 1, p, 0.3);
      A.in(tl, r, t, 'fadeRight', { dur: 0.5 });
      return t;
    });
    tl.to(D.outer, { scaleX: -1, svgOrigin: `${DX} ${DY}`, duration: 0.3, ease: 'power2.out' }, tr[0]);
    tl.to(D.outer, { scaleX: 1, svgOrigin: `${DX} ${DY}`, duration: 0.3, ease: 'power2.out' }, tr[1]);
    tl.to(D.fig, { x: 18, duration: 0.25, yoyo: true, repeat: 1, ease: 'power2.out' }, tr[1] + 0.3);
    tl.to(D.head, { rotation: 28, svgOrigin: '300 120', duration: 0.5, ease: 'power2.out' }, tr[2]);
    tl.to(D.head, { rotation: 0, svgOrigin: '300 120', duration: 0.5, ease: 'power2.inOut' }, Math.min(tr[2] + 1.6, end(1)));
    // consistent, not dramatic; always follow through
    const c1 = TM.word(stage, 'A consistent response', { x: 980, y: 640, variant: 'green', size: 30, icon: 'check' });
    A.in(tl, c1, at(ctx, 2, 'consistent response', 0.4), 'pop', { dur: 0.45 });
    const c2 = TM.word(stage, 'Always follow through', { x: 980, y: 722, variant: 'pale', size: 30, icon: 'cookie' });
    A.in(tl, c2, at(ctx, 2, 'always follow', 0.7), 'pop', { dur: 0.45 });
    // separate sessions, then mixed
    const o = TM.order(stage, ['Separate sessions', 'Familiar and consistent', 'Mix markers in one session'], { y: 820, size: 30, center: true, icons: ['calendar', 'circle-check', 'shuffle'] });
    A.in(tl, o.items, at(ctx, 3, 'separate sessions', 0.2), 'fadeRight', { dur: 0.45, stagger: 0.35 });
  });

  registerScene('tm04s06', ctx => {
    TM.videoSlide(ctx, {
      kicker: 'See it at work', heading: 'A marker your dog understands',
      rows: [
        { icon: 'mouse-pointer-click', html: 'Click = *a treat to the mouth*', beat: 0, phrase: 'click predicts', fb: 0.5 },
        { icon: 'eye', html: 'Watch the response, *before the hand moves*', beat: 1, phrase: 'respond', fb: 0.3 },
      ],
    });
  });
})();
