// Markers and Mechanics, Part 4: teaching your dog.
//   tm04s01  introduce one marker at a time: setup, no behavior needed, separate sessions of 10 to 15 reps, the order strip
//   tm04s02  teach the mouth-delivery marker (clip)
//   tm04s03e Eskara learning the toss marker (clip, full screen after the line); tm04s05 now waits with Tori's clicker clip
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
    const { stage, tl, cue, end } = ctx;
    const v = TM.videoSlide(ctx, {
      kicker: 'Teaching your dog', heading: 'Teach the mouth-delivery marker',
      rows: [
        { icon: 'dog', html: 'Mark, pause, move: *treat to the mouth*', beat: 0, phrase: 'say your chosen', fb: 0.05 },
        { icon: 'timer', html: 'A short break *between reps*', beat: 1, phrase: 'short break', fb: 0.2 },
        { icon: 'mouse-pointer-click', html: 'Clicker: *click, pause, treat*', beat: 2, phrase: 'clicker', fb: 0.2 },
      ],
    });
    // Tori's three-step picture, one panel at a time inside the frame (her video plays in the same frame afterwards)
    const [bx, by, bw, bh] = v.vf.box;
    const bg = put(stage, K.el('div'), bx, by, { position: 'absolute', width: bw + 'px', height: bh + 'px', background: 'var(--green-mist)' });
    A.in(tl, bg, 0.25, 'fade', { dur: 0.6 });
    const PW = 268, PH = 440, GAP = (bw - 3 * PW) / 4, PY = by + (bh - PH) / 2;
    const NAT = [[526, 828], [516, 828], [524, 828]];
    const STEP = [['tm_mouth_1.jpg', 'Mark', 'say your chosen marker'], ['tm_mouth_2.jpg', 'Pause', 'pause briefly'], ['tm_mouth_3.jpg', 'Move', 'bring a treat']];
    const ts = [];
    const panels = STEP.map(([src, lab, p], i) => {
      const x = bx + GAP + i * (PW + GAP);
      const ph = TM.pic(stage, src, { x, y: PY, w: PW, h: PH, nat: NAT[i], border: 0, radius: 16, pos: [0.5, 0.4] });
      ph.root = ph.wrap;
      const tag = put(stage, K.el('div', 'tm-word green'), x + 12, PY + PH - 58, { fontSize: '24px', padding: '8px 16px' });
      tag.textContent = lab;
      const t = Math.max(at(ctx, 0, p, 0.15 + 0.3 * i), (ts[i - 1] || 0) + 0.6);
      ts.push(t);
      A.in(tl, ph.root, t, 'fadeUp', { dur: 0.6 });
      A.in(tl, tag, t + 0.3, 'pop', { dur: 0.35 });
      // Mark: the word lands as the dog looks up; Pause: her hand stays still; Move: the treat goes to the mouth
      const MARKS = [[0.46, 0.17, 'var(--green)'], [0.14, 0.53, 'var(--amber)'], [0.454, 0.457, 'var(--green)']];
      const [mx, my, mc] = MARKS[i];
      TM.fx.ring(tl, ph.sv, ph.P(mx, my), t + 0.55, { n: 2, r: 22, color: mc });
      if (i) {
        const ar = K.iconBadge(stage, 'arrow-right', { x: x - GAP / 2 - 18, y: PY + PH / 2 - 18, size: 36, variant: 'solid' });
        A.in(tl, ar, t - 0.15, 'fade', { dur: 0.3 });
      }
      return ph;
    });
  });

  // picture slide: rows at left, Tori's picture shown whole at right
  const picSlide = (ctx, o) => {
    const { stage, tl } = ctx;
    TM.head(ctx, 'Teaching your dog', o.heading);
    const w = 900, h = Math.round(w / o.ar);
    const ph = TM.pic(stage, o.src, { x: 920, y: 300, w, h, nat: o.nat, radius: 22 });
    A.in(tl, ph.wrap, 0.3, 'fadeUp', { dur: 0.8 });
    const col = put(stage, K.el('div', 'tm-col'), 100, o.top, { width: '760px', gap: '26px' });
    o.rows.forEach(r => {
      const n = TM.row(col, r.icon, r.html, { size: 32 });
      A.in(tl, n, at(ctx, r.beat, r.phrase, r.fb ?? 0.15), 'fadeRight', { dur: 0.6 });
    });
    return ph;
  };

  registerScene('tm04s03', ctx => {
    const { stage, tl, cue } = ctx;
    TM.style(stage);
    const ph = picSlide(ctx, { heading: 'Teach the treat-toss marker', src: 'tm_toss.jpg', ar: 1468 / 968, nat: [1468, 968], top: 470, rows: [
      { icon: 'move-right', html: 'Mark, pause, move: *toss a treat*', beat: 0, phrase: 'toss one treat', fb: 0.4 },
      { icon: 'hand', html: 'Low and across your body, *like bowling*', beat: 1, phrase: 'low, sweeping', fb: 0.1 },
      { icon: 'move-horizontal', html: 'Then vary *the distance*', beat: 2, phrase: 'gradually vary', fb: 0.6 },
      { icon: 'shield-check', html: 'A safe area *with room*', beat: 3, phrase: 'safe area', fb: 0.4 },
    ] });
    // on her picture: the hand sweeps down low and across, then the treat skims along the floor to where it lands
    const { sv, P } = ph, H0 = P(0.235, 0.5), F0 = P(0.29, 0.81);
    const bowl = (t, endX, hold = 1.4) => {
      TM.fx.dots(tl, sv, [H0, P(0.24, 0.68), P(0.26, 0.77), F0], t, { dur: 0.45, hold, r: 3.6, color: '#fff', stroke: 'var(--amber)' });
      return TM.fx.toss(tl, sv, F0, P(endX, 0.84), t + 0.45, { hold });
    };
    bowl(at(ctx, 0, 'toss one treat', 0.4), 0.945);
    bowl(at(ctx, 1, 'low, sweeping', 0.4), 0.945);
    const lab = put(stage, K.el('div', 'tm-lab', 'Low and across, like bowling'), 100, 360, { fontSize: '34px', color: 'var(--green-dark)' });
    A.in(tl, lab, at(ctx, 1, 'bowling', 0.3), 'fadeUp', { dur: 0.5 });
    // vary the distance: a short toss, then a long one
    const tV = at(ctx, 2, 'gradually vary', 0.6);
    bowl(tV, 0.55, 2.6);
    bowl(tV + 1.5, 0.945, 1.2);
  });

  registerScene('tm04s03e', ctx => {
    TM.videoSlide(ctx, { kicker: 'Teaching your dog', heading: 'Teaching the toss marker', rows: [
      { icon: 'volume-2', html: 'Listen for *“Free”*', beat: 0, phrase: 'listen for', fb: 0.4 },
      { icon: 'move-right', html: 'Then the treat rolls *low along the floor*', beat: 0, phrase: 'roll low', fb: 0.75 },
    ] });
  });

  registerScene('tm04s03v', ctx => {
    TM.videoSlide(ctx, { kicker: 'Teaching your dog', heading: 'Treat tosses in action', rows: [
      { icon: 'graduation-cap', html: 'A dog who *already knows the game*', beat: 0, phrase: 'already knows', fb: 0.2 },
      { icon: 'eye', html: 'He anticipates it: *knows where to move*', beat: 0, phrase: 'where to move', fb: 0.7 },
    ] });
  });

  registerScene('tm04s04', ctx => {
    const { stage, tl, cue, end } = ctx;
    TM.style(stage);
    const ph = picSlide(ctx, { heading: 'Teach the scatter marker', src: 'tm_scatter.jpg', ar: 1466 / 962, nat: [1466, 962], top: 470, rows: [
      { icon: 'circle-dot', html: 'Mark, pause, move: *scatter a few treats*', beat: 0, phrase: 'scatter a few', fb: 0.5 },
      { icon: 'square', html: 'Clear surface: *one scatter = one rep*', beat: 1, phrase: 'each scatter', fb: 0.8 },
      { icon: 'leaf', html: 'Then other surfaces, *like short grass*', beat: 2, phrase: 'short grass', fb: 0.7 },
    ] });
    // on her picture: a few treats drop from her hand to the floor; on "one rep" a ring takes in the whole scatter
    const PTS = [[0.405, 0.875], [0.44, 0.865], [0.47, 0.885], [0.50, 0.87], [0.525, 0.88]].map(([x, y]) => ph.P(x, y));
    TM.fx.drops(tl, ph.sv, ph.P(0.33, 0.6), PTS, at(ctx, 0, 'scatter a few', 0.5));
    TM.fx.ring(tl, ph.sv, ph.P(0.465, 0.875), at(ctx, 1, 'each scatter', 0.8), { n: 2, r: 70 });
  });

  registerScene('tm04s04v', ctx => {
    TM.videoSlide(ctx, { kicker: 'Teaching your dog', heading: 'Scatters in action', gap: 28, rows: [
      { icon: 'footprints', html: 'Mark the calm walking, *before any jump*', beat: 0, phrase: 'calm', fb: 0.5 },
      { icon: 'x', html: 'Not after the dog *has already jumped*', beat: 0, phrase: 'before any jump', fb: 0.7 },
      { icon: 'circle-dot', html: 'Then scatter: *nose to the ground*', beat: 0, phrase: 'scatter treats', fb: 0.85 },
    ] });
  });

  // ---------------------------------------------------------------- does your dog understand?
  registerScene('tm04s05', ctx => {
    const { stage, tl, cue, end } = ctx;
    TM.style(stage);
    TM.head(ctx, 'Check for understanding', 'Does your dog understand?');
    // Tori's clicker clip waits in the frame at left; it plays full screen once the narration is done
    TM.videoFrame(ctx);
    const col = put(stage, K.el('div', 'tm-col'), 980, 300, { width: '840px', gap: '30px' });
    const R = [['arrow-left', 'Turns toward you: *to the mouth*', 'turn toward you'], ['move-up-right', 'Gets ready to follow: *a toss*', 'follow a toss'], ['arrow-down', 'Looks at the ground: *a scatter*', 'toward the ground']];
    R.forEach(([ic, h, p]) => A.in(tl, TM.row(col, ic, h, { size: 33 }), at(ctx, 1, p, 0.3), 'fadeRight', { dur: 0.5 }));
    // consistent, not dramatic; always follow through
    const c1 = TM.word(stage, 'A consistent response', { x: 980, y: 640, variant: 'green', size: 30, icon: 'check' });
    A.in(tl, c1, at(ctx, 2, 'consistent response', 0.4), 'pop', { dur: 0.45 });
    const c2 = TM.word(stage, 'Always follow through', { x: 980, y: 722, variant: 'pale', size: 30, icon: 'cookie' });
    A.in(tl, c2, at(ctx, 2, 'always follow', 0.7), 'pop', { dur: 0.45 });
    // separate sessions, then mixed
    const o = TM.order(stage, ['Separate sessions', 'Familiar and consistent', 'Mix markers in one session'], { y: 830, size: 30, center: true, icons: ['calendar', 'circle-check', 'shuffle'] });
    A.in(tl, o.items, at(ctx, 3, 'separate sessions', 0.2), 'fadeRight', { dur: 0.45, stagger: 0.35 });
  });

  registerScene('tm04s06', ctx => {
    TM.videoSlide(ctx, {
      kicker: 'See it at work', heading: 'Responding to his markers', gap: 30,
      rows: [
        { icon: 'ear', html: 'A blind dog: *he relies on the sound*', beat: 0, phrase: 'blind', fb: 0.4 },
        { icon: 'dog', html: '“Treat”: *coming to his mouth*', beat: 1, phrase: 'treat', fb: 0.2 },
        { icon: 'arrow-down', html: '“Get it”: *head to the floor, a scatter*', beat: 1, phrase: 'get it', fb: 0.6 },
        { icon: 'eye', html: 'He responds *before the hand moves*', beat: 2, phrase: 'responds', fb: 0.3 },
      ],
    });
  });
})();
