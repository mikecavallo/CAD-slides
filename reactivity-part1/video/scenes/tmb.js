// Your Training Mechanics, Part 1: the marker.
//   tm01s01  what a marker is: a filmstrip of a sit, the flash on the right frame, the 2 second window, word picks, the rule
//   tm01s02  what a marker is not: three crossed cards with small vignettes, "One sound. One meaning."
//   tm01s03  mark the moment, then feed fast: the four-step rep loop, then the sit timeline and the 1 to 2 second window
(() => {
  const { at, put, clamp } = TM;
  const CSS = `
  .tmb-film { position: absolute; height: 236px; border-radius: 18px; background: #2b2f28; box-shadow: 0 16px 36px rgba(20,30,10,0.25);
    background-image: radial-gradient(circle, #f3f8ec 5px, transparent 6px), radial-gradient(circle, #f3f8ec 5px, transparent 6px);
    background-size: 34px 20px; background-position: 6px 0, 6px 216px; background-repeat: repeat-x; }
  .tmb-fr { position: absolute; top: 24px; width: 176px; height: 188px; border-radius: 10px; background: #fff; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 12px; box-sizing: border-box; border: 5px solid #fff; }
  .tmb-fr svg { width: 74px; height: 74px; color: var(--ink-soft); stroke-width: 1.9; }
  .tmb-fr span { font: 700 26px/1 var(--font-body); color: var(--ink-soft); white-space: nowrap; }
  .tmb-fr.hit svg, .tmb-fr.hit span { color: var(--green-dark); }
  .tmb-flash { position: absolute; inset: 0; border-radius: 6px; background: #fff; }
  .tmb-bar { position: absolute; height: 26px; border-radius: 13px; background: #eef1ea; overflow: hidden; }
  .tmb-bar i { position: absolute; left: 0; top: 0; bottom: 0; width: 100%; background: var(--green); border-radius: 13px; transform-origin: left center; }
  .tmb-tick { position: absolute; font: 600 28px/1 var(--font-body); color: var(--muted); }
  .tmb-ax { position: absolute; height: 6px; background: var(--ink-soft); border-radius: 3px; }
  .tmb-win { position: absolute; border-radius: 16px; background: rgba(97,149,55,0.16); border: 3px dashed var(--green); box-sizing: border-box; }
  .tmb-ev { position: absolute; display: flex; flex-direction: column; align-items: center; gap: 8px; font: 700 28px/1.1 var(--font-body); color: var(--ink); white-space: nowrap; }
  .tmb-ev .b { width: 76px; height: 76px; border-radius: 50%; background: var(--green-pale); color: var(--green-dark); display: grid; place-items: center; }
  .tmb-ev .b svg { width: 42px; height: 42px; stroke-width: 2.2; }
  .tmb-ev.red { color: var(--red); }
  .tmb-ev.red .b { background: var(--red-pale); color: var(--red); }
  .tmb-pin { position: absolute; width: 6px; border-radius: 3px; background: var(--ink-soft); }
  `;
  const css = stage => { TM.style(stage); if (!stage.querySelector('style[data-tmb]')) { const s = K.el('style', null, CSS); s.dataset.tmb = '1'; stage.appendChild(s); } };

  // ---------------------------------------------------------------- what a marker is
  registerScene('tm01s01', ctx => {
    const { stage, tl, cue, end } = ctx;
    css(stage);
    TM.head(ctx, 'The promise', 'What a marker is');

    // filmstrip of a sit; the flash lands on the frame where the bottom touches down
    const FR = [['dog', 'Standing'], ['arrow-down', 'Lowering'], ['circle-check', 'Sit!'], ['arrow-up', 'Getting up'], ['footprints', 'Wandering']];
    const film = put(stage, K.el('div', 'tmb-film'), 100, 300, { width: '1000px' });
    const frs = FR.map(([ic, lab], i) => {
      const f = put(film, K.el('div', 'tmb-fr'), 18 + i * 196, 24);
      f.appendChild(K.icon(ic));
      f.appendChild(K.el('span', null, lab));
      return f;
    });
    tl.fromTo(film, { opacity: 0, x: 260 }, { opacity: 1, x: 0, duration: 1.6, ease: 'power2.out' }, cue(0) + 0.1);
    const tSnap = at(ctx, 0, 'exact moment', 0.35);
    const hit = frs[2];
    const fl = K.el('div', 'tmb-flash');
    hit.appendChild(fl);
    tl.set(fl, { opacity: 0 }, 0);
    tl.to(fl, { opacity: 1, duration: 0.08 }, tSnap);
    tl.to(fl, { opacity: 0, duration: 0.5 }, tSnap + 0.1);
    tl.add(() => {}, tSnap);
    tl.to(hit, { borderColor: '#619537', scale: 1.12, y: -8, duration: 0.5, ease: 'back.out(2)', zIndex: 2 }, tSnap + 0.05);
    tl.call(() => hit.classList.add('hit'), null, tSnap + 0.05);
    tl.to(frs.filter(f => f !== hit), { opacity: 0.45, duration: 0.5 }, tSnap + 0.2);
    const yip = TM.bubble(stage, 'Yip!', { x: 470, y: 222, size: 40 });
    yip.style.zIndex = 3;
    A.in(tl, yip, tSnap - 0.05, 'pop', { dur: 0.45 });
    const lab = put(stage, K.el('div', 'tm-lab', 'That moment <b style="color:var(--green)">earned a treat</b>'), 100, 560, { fontSize: '34px' });
    A.in(tl, lab, at(ctx, 0, 'earned a treat', 0.8), 'fadeUp', { dur: 0.6 });

    // it buys you time: 0 to 2 s, the treat rides the fill
    const bar = put(stage, K.el('div', 'tmb-bar'), 100, 690, { width: '760px' });
    const fill = K.el('i');
    bar.appendChild(fill);
    const t0 = put(stage, K.el('div', 'tmb-tick', '0 s'), 100, 730), t2 = put(stage, K.el('div', 'tmb-tick', '2 s'), 820, 730);
    const lab2 = put(stage, K.el('div', 'tm-lab', 'It buys you time'), 100, 636, { fontSize: '34px', color: 'var(--green-dark)' });
    const tr = TM.treat(stage, 118, 703, 1.4);
    const tB = at(ctx, 1, 'buys you time', 0.2);
    A.in(tl, [lab2, bar, t0, t2], tB, 'fadeUp', { dur: 0.5, stagger: 0.06 });
    tl.fromTo(fill, { scaleX: 0 }, { scaleX: 1, duration: 2.0, ease: 'none' }, tB + 0.6);
    tl.fromTo(tr, { opacity: 0 }, { opacity: 1, duration: 0.3 }, tB + 0.5);
    tl.to(tr, { x: 740, duration: 2.0, ease: 'none' }, tB + 0.6);
    const ck = K.iconBadge(stage, 'check', { x: 880, y: 668, size: 70, variant: 'solid' });
    A.in(tl, ck, tB + 2.6, 'pop', { dur: 0.4 });

    // pick a distinct word
    const lab3 = put(stage, K.el('div', 'tm-lab', 'Pick a distinct word'), 1180, 300, { fontSize: '36px', color: 'var(--green-dark)' });
    A.in(tl, lab3, cue(2) + 0.05, 'fadeUp', { dur: 0.5 });
    const good = [['Yip', 1180, 'yip'], ['Mark', 1340, 'mark'], ['Clicker', 1530, 'clicker']].map(([w, x, p]) => {
      const n = TM.word(stage, w, { x, y: 370, variant: 'green', icon: p === 'clicker' ? 'mouse-pointer-click' : null });
      A.in(tl, n, at(ctx, 2, p, 0.2), 'pop', { dur: 0.45 });
      return n;
    });
    const bad = [['Yes', 1180, 'yes'], ['Good', 1350, 'good']].map(([w, x, p]) => {
      const n = TM.word(stage, w, { x, y: 470, variant: 'red', cross: true });
      const t = at(ctx, 2, p, 0.65);
      A.in(tl, n, t, 'fadeUp', { dur: 0.4 });
      TM.strike(tl, n, t + 0.35);
      return n;
    });
    const note = put(stage, K.el('div', 'tm-lab', 'Heard all day'), 1560, 486, { fontSize: '28px', color: 'var(--red)' });
    A.in(tl, note, at(ctx, 2, 'all day', 0.85), 'fadeUp', { dur: 0.4 });

    // the one rule
    const rule = put(stage, K.el('div', 'tm-banner'), 1180, 640, { width: '640px', boxSizing: 'border-box', flexWrap: 'wrap' });
    rule.appendChild(K.icon('link'));
    rule.appendChild(K.el('span', null, 'Marker, then food.<br><b>Every time.</b>'));
    A.in(tl, rule, at(ctx, 3, 'one rule', 0.1), 'fadeUp', { dur: 0.6 });
    const nx = put(stage, K.el('div', 'tm-lab', 'No exceptions'), 1180, 830, { fontSize: '30px', color: 'var(--red)' });
    A.in(tl, nx, at(ctx, 3, 'no exceptions', 0.6), 'fadeUp', { dur: 0.4 });
  });

  // ---------------------------------------------------------------- what a marker is not
  registerScene('tm01s02', ctx => {
    const { stage, tl, cue, end } = ctx;
    css(stage);
    TM.head(ctx, 'Just as important', 'What a marker is not');
    const lead = K.text(stage, 'One job: mark the instant your dog <b style="color:var(--green)">got it right</b>.', { x: 100, y: 268, cls: 'lead', w: 1400 });
    A.in(tl, lead, at(ctx, 0, 'one job', 0.3), 'fadeUp', { dur: 0.6 });

    const CARDS = [
      ['Not an attention-getter', 'No behavior to pay? The word goes hollow.'],
      ['Not a correction', 'It only points at something you liked.'],
      ['Not a bribe', 'The treat comes after the mark, never before.'],
    ];
    const W = 540, Y = 350, H = 450;
    const cards = CARDS.map(([t, b], i) => {
      const c = put(stage, K.el('div', 'tm-xcard'), 100 + i * (W + 50), Y, { width: W + 'px', height: H + 'px' });
      const vg = put(c, K.el('div', 'tm-panel'), 24, 24, { width: W - 48 + 'px', height: '200px' });
      const tt = put(c, K.el('div', 't', t), 32, 250, { position: 'absolute', width: W - 64 + 'px' });
      const bb = put(c, K.el('div', 'b', b), 32, 300, { position: 'absolute', width: W - 64 + 'px' });
      const x = K.el('div', 'x');
      x.appendChild(K.icon('x'));
      c.appendChild(x);
      Object.assign(x.style, { top: '40px', right: '40px' });
      return { c, vg, tt, bb, x };
    });
    const dogB = (parent, x, y, flip) => {
      const d = K.iconBadge(parent, 'dog', { x, y, size: 120 });
      if (flip) d.querySelector('svg').style.transform = 'scaleX(-1)';
      return d;
    };
    // 1: "Yip?" at a dog looking away, the word fades grey
    const v1 = cards[0].vg;
    const d1 = dogB(v1, 300, 40, false);
    const b1 = TM.bubble(v1, 'Yip?', { x: 50, y: 50, size: 40 });
    // 2: Yip is not No
    const v2 = cards[1].vg;
    const y2 = TM.word(v2, 'Yip', { x: 40, y: 66, variant: 'green' });
    const ne = put(v2, K.el('div', 'tm-lab', '≠'), 190, 50, { fontSize: '80px', color: 'var(--red)', fontFamily: 'var(--font-head)' });
    const n2 = TM.word(v2, 'No!', { x: 270, y: 66, variant: 'red' });
    // 3: a treat dangled on a string in front of the dog
    const v3 = cards[2].vg;
    const d3 = dogB(v3, 60, 50, true);
    const sv3 = K.svg(v3, { x: 0, y: 0, w: W - 48, h: 200 });
    const str = K.path(sv3, 'M 330 0 L 330 96', { stroke: '#7a7a7a', 'stroke-width': 3, fill: 'none' });
    const tr3 = TM.treat(v3, 330, 112, 1.5);
    const hand3 = K.iconBadge(v3, 'hand', { x: 380, y: 20, size: 70, variant: 'amber' });

    const tC = [at(ctx, 1, 'attention', 0.1), at(ctx, 2, 'correction', 0.1), at(ctx, 3, 'bribe', 0.1)];
    cards.forEach((k, i) => {
      tl.fromTo(k.c, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, tC[i]);
    });
    // vignette motion, then the red cross
    tl.to(b1, { borderColor: '#b9bdb3', color: '#b9bdb3', duration: 0.6 }, at(ctx, 1, 'hollow', 0.8));
    tl.to(b1, { scale: 0.85, opacity: 0.6, duration: 0.6 }, at(ctx, 1, 'hollow', 0.8));
    A.in(tl, cards[0].x, at(ctx, 1, 'hollow', 0.85), 'pop', { dur: 0.4 });
    A.in(tl, ne, at(ctx, 2, 'never means no', 0.3), 'pop', { dur: 0.4 });
    A.in(tl, cards[1].x, at(ctx, 2, 'only points', 0.7), 'pop', { dur: 0.4 });
    const tw = at(ctx, 3, 'wave food', 0.35);
    tl.fromTo([str, tr3], { rotation: -14, svgOrigin: '330 0', transformOrigin: '50% -400%' }, { rotation: 14, duration: 0.6, ease: 'sine.inOut', yoyo: true, repeat: 3 }, tw);
    A.in(tl, cards[2].x, at(ctx, 3, 'never before', 0.85), 'pop', { dur: 0.4 });

    const bn = put(stage, K.el('div', 'tm-banner'), 0, 840);
    bn.appendChild(K.icon('circle-check'));
    bn.appendChild(K.el('span', null, 'One sound. <b>One meaning.</b>'));
    TM.centerX(bn, 960);
    A.in(tl, bn, at(ctx, 4, 'one sound', 0.3), 'fadeUp', { dur: 0.6 });
  });

  // ---------------------------------------------------------------- mark the moment, then feed fast
  registerScene('tm01s03', ctx => {
    const { stage, tl, cue, end, dur } = ctx;
    css(stage);
    TM.head(ctx, 'The mechanics', 'Mark the moment, then feed fast');

    // the rep loop: four nodes in a row, a return arc under them, a dot that keeps going round
    const NODES = [['The moment', 'eye'], ['Mark it', 'volume-2'], ['Feed fast', 'cookie'], ['Reset', 'refresh-cw']];
    const X = [230, 640, 1050, 1460], Y = 300;
    const grp = put(stage, K.el('div'), 0, 0, { position: 'absolute', width: '1920px', height: '1080px', transformOrigin: '960px 300px' });
    const sv = K.svg(grp, { x: 0, y: 0, w: 1920, h: 1080 });
    const arrows = [0, 1, 2].map(i => K.path(sv, `M ${X[i] + 262} ${Y + 125} L ${X[i + 1] - 14} ${Y + 125}`, { stroke: '#b8d99a', 'stroke-width': 8, fill: 'none', 'stroke-linecap': 'round' }));
    const loopD = `M ${X[3] + 125} ${Y + 262} C ${X[3] + 125} ${Y + 380}, ${X[0] + 125} ${Y + 380}, ${X[0] + 125} ${Y + 262}`;
    const loop = K.path(sv, loopD, { stroke: '#b8d99a', 'stroke-width': 8, fill: 'none', 'stroke-dasharray': '2 18', 'stroke-linecap': 'round' });
    const nodes = NODES.map(([t, ic], i) => {
      const n = put(grp, K.el('div', 'tm-node'), X[i], Y);
      const b = K.el('div', 'ic');
      b.appendChild(K.icon(ic));
      n.appendChild(b);
      n.appendChild(K.el('div', 't', t));
      n.appendChild(K.el('div', 'n', String(i + 1)));
      return n;
    });
    A.in(tl, nodes, cue(0) + 0.2, 'pop', { dur: 0.5, stagger: 0.12 });
    A.draw(tl, arrows, cue(0) + 0.6, 0.5, { stagger: 0.12 });
    tl.fromTo(loop, { opacity: 0 }, { opacity: 1, duration: 0.5 }, cue(0) + 1.0);
    // "the moment changes": example chips under the loop
    const exRow = put(stage, K.el('div'), 0, 704, { position: 'absolute', width: '1920px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '22px' });
    const ex = K.el('div', 'tm-lab', 'The moment changes:');
    Object.assign(ex.style, { position: 'relative', fontSize: '32px', color: 'var(--ink-soft)' });
    exRow.appendChild(ex);
    const exW = [['A sit', 'a sit'], ['A glance at you', 'a glance'], ['Their name', 'their name']].map(([w, p]) => {
      const n = TM.word(exRow, w, { variant: 'pale', size: 30 });
      n.style.position = 'relative'; n.style.left = n.style.top = '';
      A.in(tl, n, at(ctx, 0, p, 0.3), 'pop', { dur: 0.4 });
      return n;
    });
    A.in(tl, ex, at(ctx, 0, 'the moment changes', 0.25), 'fadeUp', { dur: 0.5 });
    const job = put(stage, K.el('div', 'tm-banner'), 0, 820);
    job.appendChild(K.icon('target'));
    job.appendChild(K.el('span', null, 'Catch it. Mark it. <b>Pay it.</b>'));
    TM.centerX(job, 960);
    A.in(tl, job, at(ctx, 0, 'catch it', 0.8), 'fadeUp', { dur: 0.6 });
    tl.to([ex, ...exW, job], { opacity: 0, duration: 0.4 }, cue(1) - 0.1);

    // light each node on its beat
    const ON = { borderColor: '#619537', boxShadow: '0 18px 40px rgba(63,107,34,0.25)', scale: 1.06, duration: 0.45, ease: 'power2.out' };
    const OFF = { borderColor: '#d9ddd3', boxShadow: '0 10px 30px rgba(40,60,20,0.10)', scale: 1, duration: 0.45, ease: 'power2.out' };
    nodes.forEach((n, i) => {
      tl.to(n, ON, cue(i + 1) + 0.05);
      if (i < 3) tl.to(n, OFF, cue(i + 2));
    });
    // the dot circles the loop: reps stack up
    const dot = K.circle(sv, 0, 0, 16, { fill: '#619537' });
    tl.set(dot, { opacity: 0 }, 0);
    const path = [`M ${X[0] + 125} ${Y + 125} L ${X[3] + 125} ${Y + 125}`, loopD].join(' ');
    const t4 = cue(4) + 0.3;
    const reps = Math.max(1, Math.floor((cue(5) - t4) / 1.6));
    tl.set(dot, { opacity: 1 }, t4);
    tl.to(dot, { motionPath: { path: `M ${X[0] + 125} ${Y + 125} L ${X[3] + 125} ${Y + 125} L ${X[3] + 125} ${Y + 262} C ${X[3] + 125} ${Y + 380}, ${X[0] + 125} ${Y + 380}, ${X[0] + 125} ${Y + 262} Z` }, duration: 1.6, ease: 'none', repeat: reps - 1 }, t4);
    tl.set(dot, { opacity: 0 }, cue(5));
    const repN = put(stage, K.el('div', 'tm-lab', 'Clean reps, stacked up'), 0, 720, { fontSize: '34px', color: 'var(--green-dark)', width: '1920px', textAlign: 'center' });
    A.in(tl, repN, at(ctx, 4, 'clean reps', 0.5), 'fadeUp', { dur: 0.5 });
    tl.to(repN, { opacity: 0, duration: 0.3 }, cue(5) - 0.1);

    // the sit timeline: loop shrinks up, the axis appears
    tl.to(nodes[3], OFF, cue(5));
    tl.to(grp, { scale: 0.6, y: -20, duration: 0.8, ease: 'power3.inOut' }, cue(5));
    const AX = 260, AY = 820, PX = 300; // axis x0, y, px per second
    const ax = put(stage, K.el('div', 'tmb-ax'), AX, AY, { width: 1400 + 'px' });
    const ticks = [0, 1, 2, 3, 4].map(s => put(stage, K.el('div', 'tmb-tick', s + ' s'), AX + 140 + s * PX - 16, AY + 34));
    const tA = cue(5) + 0.4;
    A.in(tl, ax, tA, 'grow', { dur: 0.6 });
    A.in(tl, ticks, tA + 0.2, 'fade', { dur: 0.4, stagger: 0.05 });
    const ev = (x, icon, label, cls) => {
      const e = put(stage, K.el('div', 'tmb-ev' + (cls ? ' ' + cls : '')), 0, 0);
      const b = K.el('div', 'b');
      b.appendChild(K.icon(icon));
      e.appendChild(b);
      e.appendChild(K.el('span', null, label));
      e.style.top = AY - 150 + 'px';
      e.style.left = x + 'px';
      return e;
    };
    const S0 = AX + 140; // the instant the bottom touches
    const eSit = ev(S0, 'circle-check', 'Bottom touches');
    TM.centerX(eSit, S0);
    const pin = put(stage, K.el('div', 'tmb-pin'), S0 - 3, AY - 38, { height: '38px' });
    const yip = TM.bubble(stage, 'Yip!', { x: S0 + 60, y: AY - 250, size: 34 });
    const win = put(stage, K.el('div', 'tmb-win'), S0, AY - 20, { width: 2 * PX + 'px', height: '46px' });
    const tS = at(ctx, 5, 'bottom touches', 0.45);
    A.in(tl, [eSit, pin], tS, 'fadeUp', { dur: 0.5 });
    A.in(tl, yip, at(ctx, 5, 'mark it', 0.75), 'pop', { dur: 0.4 });
    const trG = TM.treat(stage, S0 + 1.1 * PX, AY + 2, 1.6);
    const tG = at(ctx, 5, 'treat follow', 0.9);
    tl.fromTo(trG, { opacity: 0, y: -120 }, { opacity: 1, y: 0, duration: 0.5, ease: 'bounce.out' }, tG);
    // the window, and a late treat that pays standing up
    const wl = put(stage, K.el('div', 'tm-lab', '1 to 2 sec'), S0 + PX - 80, AY + 84, { fontSize: '32px', color: 'var(--green-dark)' });
    const tW = at(ctx, 6, 'window', 0.1);
    tl.fromTo(win, { opacity: 0, scaleX: 0, transformOrigin: 'left center' }, { opacity: 1, scaleX: 1, duration: 0.7, ease: 'power2.out' }, tW);
    A.in(tl, wl, tW + 0.3, 'fadeUp', { dur: 0.5 });
    const L0 = S0 + 3.3 * PX;
    const eUp = ev(L0, 'arrow-up', 'Standing up', 'red');
    TM.centerX(eUp, L0);
    const tL = at(ctx, 6, 'late food', 0.35);
    A.in(tl, eUp, tL, 'fadeUp', { dur: 0.5 });
    const trL = TM.treat(stage, L0, AY + 2, 1.6);
    tl.fromTo(trL, { opacity: 0, y: -120 }, { opacity: 1, y: 0, duration: 0.5, ease: 'bounce.out' }, tL + 0.4);
    const pays = put(stage, K.el('div', 'tm-lab', 'Late: pays the wrong moment'), L0 - 230, AY + 84, { fontSize: '30px', color: 'var(--red)' });
    A.in(tl, pays, tL + 0.8, 'fadeUp', { dur: 0.5 });
  });
})();
