// Markers and Mechanics, Part 1 (second half).
//   tm01s04  match the game to your dog's needs: Tori's park toss picture (another dog appears, a low toss away gives the dog more distance); points at right
//   tm01s05  what a marker is not: crossed meanings; check-in marked (green) vs pulling and staring marked (red); say it once
//   tm01s06  a marker in action (Tori's position-changes clip)
(() => {
  const { at, put, clamp } = TM;
  const CSS = `
  .tmb-vg { position: absolute; border-radius: 26px; box-sizing: border-box; padding: 26px 30px; display: flex; flex-direction: column; gap: 22px; }
  .tmb-vg.good { background: var(--green-mist); border: 3px solid #cfe3b8; }
  .tmb-vg.bad { background: var(--red-pale); border: 3px solid #efc5b9; }
  .tmb-vg .t { font: 700 36px/1.1 var(--font-head); color: var(--ink); }
  .tmb-vg .seq { display: flex; align-items: center; gap: 16px; }
  .tmb-vg .seq > * { position: relative !important; left: auto !important; top: auto !important; }
  .tmb-vg .res { font: 700 30px/1.25 var(--font-body); }
  .tmb-vg.good .res { color: var(--green-dark); }
  .tmb-vg.bad .res { color: var(--red); }
  `;
  const css = stage => { TM.style(stage); if (!stage.querySelector('style[data-tmb]')) { const s = K.el('style', null, CSS); s.dataset.tmb = '1'; stage.appendChild(s); } };
  const flow = n => { n.style.position = 'relative'; n.style.left = n.style.top = ''; return n; };
  const badge = (parent, icon, variant, size = 84) => flow(K.iconBadge(parent, icon, { size, variant }));

  // ---------------------------------------------------------------- match the game to your dog's needs
  registerScene('tm01s04', ctx => {
    const { stage, tl, cue } = ctx;
    css(stage);
    TM.head(ctx, 'Your dog’s needs', 'Match the game to your dog’s needs', { size: 62 });
    // Tori's park picture, whole: another dog appears, a treat is tossed low away from it and the brindle dog follows.
    // The example is drawn on the picture; the column at right carries the slide's points as they are said.
    const ph = TM.pic(stage, 'tm_toss_park.jpg', { x: 100, y: 285, w: 1000, h: 672, nat: [1536, 1024], radius: 22, border: 8 });
    const { wrap, sv, P } = ph;
    tl.fromTo(wrap, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, cue(0) + 0.1);

    // something worrying: the other dog, ringed in amber
    const GOLD = P(0.835, 0.47);
    TM.fx.ring(tl, sv, GOLD, at(ctx, 0, 'something worrying', 0.75), { n: 2, r: 52, color: 'var(--amber)' });

    // the example: something unexpected, too close; the treat skims low away from it, the dog follows, more distance
    const tU = at(ctx, 1, 'something unexpected', 0.15);
    TM.fx.ring(tl, sv, GOLD, tU, { n: 2, r: 52, color: 'var(--amber)' });
    TM.fx.tag(tl, wrap, 'Something unexpected', 610, 110, tU + 0.2, 'amber');
    const tT = at(ctx, 1, 'toss a treat', 0.35);
    TM.fx.toss(tl, sv, P(0.175, 0.52), P(0.05, 0.785), tT, { dur: 0.9, hold: 3.0 });
    const tF = at(ctx, 1, 'follows the treat', 0.55);
    TM.fx.dots(tl, sv, [P(0.405, 0.665), P(0.24, 0.735), P(0.075, 0.775)], tF, { dur: 0.8, hold: 2.6, r: 5, gap: 18, stroke: 'var(--green)' });
    // more distance: a measure along the grass from where the dog ends up to the other dog
    const tD = at(ctx, 1, 'more distance', 0.75);
    const [ax, my] = P(0.05, 0.93), [bx] = P(0.835, 0.93);
    const lineD = `M ${bx} ${my} L ${ax} ${my}`;
    const under = K.path(sv, lineD, { stroke: '#fff', 'stroke-width': 11, 'stroke-linecap': 'round' });
    const ln = K.path(sv, lineD, { stroke: 'var(--green)', 'stroke-width': 5, 'stroke-linecap': 'round' });
    A.draw(tl, [under, ln], tD, 0.9);
    const ends = [bx, ax].map(x => K.path(sv, `M ${x} ${my - 18} L ${x} ${my + 18}`, { stroke: 'var(--green)', 'stroke-width': 6, 'stroke-linecap': 'round' }));
    tl.set(ends, { opacity: 0 }, 0);
    tl.to(ends, { opacity: 1, duration: 0.25, stagger: 0.75 }, tD);
    const md = TM.fx.tag(tl, wrap, 'More distance', 0, 0, tD + 0.5, 'green');
    md.style.fontSize = '28px';
    Object.assign(md.style, { left: Math.round((ax + bx) / 2 - md.offsetWidth / 2) + 'px', top: Math.round(my - md.offsetHeight - 22) + 'px' });

    // the points, one by one at the right
    const col = put(stage, K.el('div', 'tm-col'), 1160, 300, { width: '670px', gap: '26px' });
    const items = [
      [() => TM.row(col, 'paw-print', 'Some dogs need **movement**', { size: 31 }), 0, 'need movement', 0.15],
      [() => flow(TM.word(col, 'Standing still for a treat up close: harder', { variant: 'red', size: 26, icon: 'x' })), 0, 'harder', 0.85],
      [() => TM.row(col, 'move-left', 'Toss **away**: more distance', { size: 31 }), 1, 'toss a treat', 0.35],
      [() => TM.row(col, 'sparkles', 'Enough space: **scatter**', { size: 31 }), 1, 'scatter', 0.9],
      [() => TM.row(col, 'dog', 'Another dog: **food to the mouth**', { size: 31 }), 2, 'mouth', 0.5],
      [() => flow(TM.word(col, 'Watch how your dog responds', { variant: 'green', size: 26, icon: 'eye' })), 3, 'watch how', 0.05],
      [() => flow(TM.word(col, 'Coming later: pattern games', { variant: 'pale', size: 26, icon: 'repeat' })), 4, 'pattern games', 0.5],
    ].map(([mk, b, p, fb]) => {
      const n = mk();
      n.style.alignSelf = 'flex-start';
      A.in(tl, n, at(ctx, b, p, fb), 'fadeRight', { dur: 0.55 });
      return n;
    });
    // the column sits centred on the picture
    col.style.top = Math.round(285 + 672 / 2 - col.offsetHeight / 2) + 'px';
    // another dog: the picture steps back while the mouth line is said, then returns
    const tM = at(ctx, 2, 'another dog', 0.1);
    tl.to(wrap, { opacity: 0.45, duration: 0.5 }, tM);
    tl.to(wrap, { opacity: 1, duration: 0.5 }, cue(3));
    tl.to(items[4], { scale: 1.04, transformOrigin: '0% 50%', duration: 0.4, yoyo: true, repeat: 1 }, at(ctx, 2, 'mouth', 0.5) + 0.4);
  });

  // ---------------------------------------------------------------- what a marker is not
  registerScene('tm01s05', ctx => {
    const { stage, tl, cue, end } = ctx;
    css(stage);
    TM.head(ctx, 'Just as important', 'What a marker is not');
    const row = put(stage, K.el('div'), 100, 272, { position: 'absolute', display: 'flex', alignItems: 'center', gap: '18px' });
    const nl = flow(put(row, K.el('div', 'tm-lab', 'It never means:'), 0, 0, { fontSize: '34px' }));
    A.in(tl, nl, at(ctx, 0, 'does not mean', 0.5), 'fadeUp', { dur: 0.5 });
    [['“No”', 'no'], ['“Stop”', 'stop'], ['“Look at me”', 'look at me']].forEach(([w, p]) => {
      const n = flow(TM.word(row, w, { variant: 'red', cross: true, size: 32 }));
      const t = at(ctx, 0, p, 0.7);
      A.in(tl, n, t, 'pop', { dur: 0.4 });
      TM.strike(tl, n, t + 0.35);
    });
    const card = (x, src, title, cap, good) => {
      const t = put(stage, K.el('div', 'tm-lab', title), x, 370, { fontSize: '34px', color: good ? 'var(--green-dark)' : 'var(--red)', display: 'flex', alignItems: 'center', gap: '12px' });
      t.prepend(K.icon(good ? 'circle-check' : 'circle-x', { size: 36 }));
      const ph = TM.pic(stage, src, { x, y: 425, w: 560, h: 467, nat: good ? [744, 620] : [754, 620], border: 6, radius: 0, borderColor: good ? '#619537' : '#b8452d' });
      ph.root = ph.wrap;
      const c = put(stage, K.el('div', 'tm-lab', cap), x, 905, { fontSize: '28px', color: 'var(--ink-soft)', width: '560px', whiteSpace: 'normal' });
      return { t, ph, c };
    };
    const G = card(100, 'tm_ck_good.jpg', 'Mark the check-in', 'Looking at you earns the treat.', true);
    const Bd = card(700, 'tm_ck_bad.jpg', 'Avoid marking the pulling', 'You will reinforce pulling and staring.', false);
    const tG = at(ctx, 2, 'check in', 0.1);
    A.in(tl, [G.t, G.ph.root], tG, 'fadeUp', { dur: 0.7, stagger: 0.12 });
    
    A.in(tl, G.c, at(ctx, 2, 'look at you', 0.9), 'fadeUp', { dur: 0.5 });
    const tB = at(ctx, 3, 'get their attention', 0.15);
    A.in(tl, [Bd.t, Bd.ph.root], tB, 'fadeUp', { dur: 0.7, stagger: 0.12 });
    
    A.in(tl, Bd.c, at(ctx, 3, 'accidentally reinforce', 0.55), 'fadeUp', { dur: 0.5 });
    // the check-in: a dotted line from the dog's eyes up to her face, a ring where their eyes meet
    {
      const { sv, P } = G.ph, t = tG + 1.0;
      TM.fx.dots(tl, sv, [P(0.435, 0.40), P(0.30, 0.10)], t, { dur: 0.6, hold: 2.4, r: 5.5, gap: 18, stroke: 'var(--green)' });
      TM.fx.ring(tl, sv, P(0.43, 0.42), t + 0.6, { n: 2, r: 24 });
    }
    // the pull: the dog's stare runs to the squirrel, the leash pulls tight, both in red
    {
      const { sv, P } = Bd.ph, t = tB + 1.0, RED = 'var(--red)';
      TM.fx.dots(tl, sv, [P(0.80, 0.53), P(0.93, 0.35)], t, { dur: 0.5, hold: 2.6, r: 4, color: '#fff', stroke: RED });
      TM.fx.ring(tl, sv, P(0.935, 0.33), t + 0.5, { n: 2, r: 26, color: RED });
      const ls = K.path(sv, `M ${P(0.215, 0.355).join(' ')} L ${P(0.56, 0.545).join(' ')}`, { stroke: RED, 'stroke-width': 7, opacity: 0.85 });
      tl.fromTo(ls, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.5, ease: 'power2.out' }, t + 1.0);
      tl.to(ls, { opacity: 0.35, duration: 0.25, yoyo: true, repeat: 3 }, t + 1.5);
      tl.to(ls, { opacity: 0, duration: 0.5 }, t + 4.2);
    }
    const lead = put(stage, K.el('div', null, 'Mark behavior you want <b style="color:var(--green)">repeated</b>.'), 1310, 425, { position: 'absolute', width: '510px', font: '500 40px/1.3 var(--font-body)', color: 'var(--ink)' });
    A.in(tl, lead, at(ctx, 1, 'mark behavior', 0.3), 'fadeUp', { dur: 0.6 });
    const bn = put(stage, K.el('div', 'tm-banner'), 1310, 600, { width: '510px', boxSizing: 'border-box' });
    bn.appendChild(K.icon('circle-check'));
    bn.appendChild(K.el('span', null, 'Say it once. <b>Always follow through.</b>'));
    A.in(tl, bn, at(ctx, 4, 'say the marker once', 0.1), 'fadeUp', { dur: 0.6 });
    const tN = at(ctx, 5, 'marker in action', 0.7);
    const nx = put(stage, K.el('div', 'tm-banner'), 1310, 820, { width: '510px', boxSizing: 'border-box' });
    nx.appendChild(K.icon('circle-play'));
    nx.appendChild(K.el('span', null, 'Next: <b>a marker in action</b>'));
    A.in(tl, nx, tN, 'fadeUp', { dur: 0.6 });
  });

  // ---------------------------------------------------------------- a marker in action (clip)
  registerScene('tm01s06', ctx => {
    TM.videoSlide(ctx, {
      kicker: 'See it at work', heading: 'A marker in action',
      rows: [
        { icon: 'repeat', html: 'Sit and stand, *front feet still*', beat: 0, phrase: 'sitting and standing', fb: 0.5 },
        { icon: 'volume-2', html: 'Mark the *correct position*', beat: 1, phrase: 'correct position', fb: 0.5 },
        { icon: 'dog', html: 'Then the treat, *to his mouth*', beat: 2, phrase: 'his mouth', fb: 0.3 },
      ],
    });
  });
})();
