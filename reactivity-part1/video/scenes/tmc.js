// Your Training Mechanics, Part 1: video slides and the understanding check.
//   tm01s04  a marker in action (Tori's clip plays in the frame)
//   tm01s05  charging your marker: Yip (clip; rep counter to 15)
//   tm01s06  charging a clicker (clip)
//   tm01s07  does your dog understand the marker? the drawn dog turns to you, or a question mark sends you back to pairing reps
(() => {
  const { at, put, clamp } = TM;

  const nextPill = (ctx, text, t, y = 840) => {
    const b = put(ctx.stage, K.el('div', 'tm-banner'), 100, y, { fontSize: '32px', padding: '18px 32px' });
    b.appendChild(K.icon('arrow-right'));
    b.appendChild(K.el('span', null, K.md(text)));
    A.in(ctx.tl, b, t, 'fadeUp', { dur: 0.6 });
    return b;
  };

  registerScene('tm01s04', ctx => {
    TM.videoSlide(ctx, {
      kicker: 'See it at work', heading: 'A marker in action',
      rows: [
        { icon: 'repeat', html: 'Position changes: *sit* and *stand*', beat: 0, phrase: 'position changes', fb: 0.6 },
        { icon: 'volume-2', html: 'Each one nailed: *Yip*, then a treat', beat: 1, phrase: 'yip', fb: 0.5 },
        { icon: 'target', html: 'One sound, *no guessing*', beat: 2, phrase: 'one sound', fb: 0.05 },
      ],
    });
    nextPill(ctx, 'Next: *charge your marker*', at(ctx, 3, 'next', 0.6));
  });

  registerScene('tm01s05', ctx => {
    const { stage, tl, cue, end } = ctx;
    const v = TM.videoSlide(ctx, {
      kicker: 'Watch it, then try it', heading: 'Charging your marker: “Yip”', gap: 28,
      rows: [
        { num: 1, html: 'Pea-sized treats, *within reach*', beat: 1, phrase: 'pea-sized', fb: 0.1 },
        { num: 2, html: '*Yip*, pause, treat', beat: 2, phrase: 'say your marker', fb: 0.05 },
        { num: 3, html: 'Say it, *then* move', beat: 3, phrase: 'separate', fb: 0.5 },
        { num: 4, html: 'Test: head snaps to you = *charged*', beat: 4, phrase: 'test it', fb: 0.05 },
      ],
    });
    const sub = K.text(stage, 'A sound becomes <b style="color:var(--green)">a promise</b>', { x: 100, y: 300, cls: 'lead', size: 34 });
    v.col.style.top = '380px';
    A.in(tl, sub, at(ctx, 0, 'promise', 0.8), 'fadeUp', { dur: 0.6 });
    // the rep counter while "ten to fifteen reps" is said
    const cnt = put(stage, K.el('div', 'tm-word pale'), 100, 850, { fontSize: '32px' });
    cnt.innerHTML = 'Reps: <b class="n" style="color:var(--green);margin-left:8px">0</b> / 15';
    const tC = at(ctx, 2, 'ten to fifteen', 0.7);
    A.in(tl, cnt, tC, 'pop', { dur: 0.45 });
    A.count(tl, cnt.querySelector('.n'), tC + 0.3, 0, 15, Math.max(1.2, end(2) - tC + 0.6), v => String(Math.round(v)));
    const tick = put(stage, K.el('div', 'tm-word green'), 420, 850, { fontSize: '32px' });
    tick.innerHTML = 'Charged';
    tick.prepend(K.icon('zap'));
    A.in(tl, tick, at(ctx, 4, 'charged', 0.9), 'pop', { dur: 0.45 });
  });

  registerScene('tm01s06', ctx => {
    const { stage, tl } = ctx;
    const v = TM.videoSlide(ctx, {
      kicker: 'Same recipe, different sound', heading: 'Charging a clicker',
      rows: [
        { icon: 'mouse-pointer-click', html: 'Click, treat. *10 to 15 reps*', beat: 1, phrase: 'click once', fb: 0.05 },
        { icon: 'audio-waveform', html: 'The same sound, *every time*', beat: 2, phrase: 'the same', fb: 0.15 },
        { icon: 'zap', html: 'Test it: a quick *head snap*', beat: 3, phrase: 'test it', fb: 0.05 },
      ],
    });
    v.col.style.top = '400px';
    const sub = K.text(stage, 'Just another marker. <b style="color:var(--green)">Charge it the same way.</b>', { x: 100, y: 300, w: 760, cls: 'lead', size: 34 });
    A.in(tl, sub, at(ctx, 0, 'just another marker', 0.1), 'fadeUp', { dur: 0.6 });
  });

  registerScene('tm01s07', ctx => {
    const { stage, tl, cue, end, dur } = ctx;
    TM.style(stage);
    C2.style(stage);
    TM.head(ctx, 'Check for understanding', 'Does your dog understand the marker?', { size: 62 });

    // the vignette: you are off to the left, the dog faces away
    const PX = 100, PY = 300, PW = 820, PH = 470;
    const panel = put(stage, K.el('div', 'tm-panel'), PX, PY, { width: PW + 'px', height: PH + 'px' });
    A.in(tl, panel, cue(0) + 0.3, 'fadeUp', { dur: 0.7 });
    const sv = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const DX = 560, DY = 590;
    const D = C2.dog(sv, DX, DY, 0.9);
    A.in(tl, D.outer, cue(0) + 0.6, 'fade', { dur: 0.6 });
    const you = put(stage, K.el('div', 'tm-lab', 'You'), PX + 30, PY + PH - 60, { fontSize: '30px', color: 'var(--ink-soft)' });
    const arrowYou = K.iconBadge(stage, 'arrow-left', { x: PX + 100, y: PY + PH - 72, size: 56, variant: 'solid' });
    A.in(tl, [you, arrowYou], cue(0) + 0.8, 'fadeUp', { dur: 0.5 });
    // step 1: out of the blue
    const yip = TM.bubble(stage, 'Yip!', { x: PX + 40, y: PY + 40, size: 44 });
    const tY = at(ctx, 1, 'mark once', 0.6);
    A.in(tl, yip, tY, 'pop', { dur: 0.45 });
    const noFood = TM.word(stage, 'No food yet', { x: PX + 40, y: PY + 150, variant: 'amber', size: 28, icon: 'hand' });
    A.in(tl, noFood, at(ctx, 1, 'food yet', 0.85), 'fadeUp', { dur: 0.45 });
    // step 2: the head snaps round to you
    const tTurn = at(ctx, 2, 'head snaps', 0.5);
    tl.to(D.outer, { scaleX: -1, svgOrigin: `${DX} ${DY}`, duration: 0.25, ease: 'power3.out' }, tTurn);
    const spark = K.group(sv);
    [[400, 430, 380, 405], [440, 418, 440, 386], [480, 428, 498, 404]].forEach(([a, b, c, d]) => K.line(spark, a, b, c, d, { stroke: '#619537', 'stroke-width': 7, 'stroke-linecap': 'round' }));
    tl.to(noFood, { opacity: 0, duration: 0.3 }, tTurn - 0.2);
    A.in(tl, spark, tTurn + 0.15, 'pop', { dur: 0.35 });
    const got = TM.word(stage, 'Got it', { x: PX + 560, y: PY + 40, variant: 'green', size: 30, icon: 'circle-check' });
    A.in(tl, got, tTurn + 0.3, 'pop', { dur: 0.4 });
    // step 3: a blank look sends you back to pairing reps
    const t3 = at(ctx, 3, 'blank look', 0.1);
    tl.to([spark, got, yip, noFood], { opacity: 0, duration: 0.35 }, t3 - 0.1);
    tl.to(D.outer, { scaleX: 1, svgOrigin: `${DX} ${DY}`, duration: 0.4, ease: 'power2.inOut' }, t3);
    const q = put(stage, K.el('div', 'tm-lab', '?'), DX + 120, PY + 20, { fontSize: '110px', color: 'var(--amber)', fontFamily: 'var(--font-head)' });
    A.in(tl, q, t3 + 0.3, 'pop', { dur: 0.45 });
    const back = TM.word(stage, 'Back to pairing reps', { x: PX + 40, y: PY + 40, variant: 'amber', size: 30, icon: 'rotate-ccw' });
    A.in(tl, back, at(ctx, 3, 'pairing reps', 0.7), 'fadeUp', { dur: 0.5 });

    // the three steps at right
    const col = put(stage, K.el('div', 'tm-col'), 980, 320, { width: '840px', gap: '40px' });
    const steps = [['Give it out of the blue', 1, 'calm moment'], ['Watch for the answer', 2, 'responds'], ['Blank look? Back up', 3, 'blank look']].map(([t, b, p], i) => {
      const r = TM.row(col, null, t, { num: i + 1, size: 36 });
      A.in(tl, r, at(ctx, b, p, 0.05), 'fadeRight', { dur: 0.6 });
      return r;
    });
    tl.to(steps[0], { opacity: 0.45, duration: 0.4 }, cue(2));
    tl.to(steps[1], { opacity: 0.45, duration: 0.4 }, cue(3));
    tl.to(steps[2], { opacity: 0.45, duration: 0.4 }, cue(4));
    // proof it
    tl.to([q, back], { opacity: 0, duration: 0.4 }, cue(4));
    const pl = put(stage, K.el('div', 'tm-lab', 'Then proof it:'), 980, 640, { fontSize: '36px', color: 'var(--green-dark)' });
    A.in(tl, pl, at(ctx, 4, 'proof it', 0.1), 'fadeUp', { dur: 0.5 });
    [['New rooms', 'house', 'new rooms', 980, 710], ['The yard', 'trees', 'yard', 1290, 710], ['Mild distractions', 'squirrel', 'distractions', 980, 800]].forEach(([w, ic, p, x, y]) => {
      const n = TM.word(stage, w, { x, y, variant: 'pale', icon: ic, size: 32 });
      A.in(tl, n, at(ctx, 4, p, 0.4), 'pop', { dur: 0.45 });
    });
    tl.to(D.outer, { scaleX: -1, svgOrigin: `${DX} ${DY}`, duration: 0.3, ease: 'power3.out' }, at(ctx, 4, 'trust', 0.85));
  });
})();
