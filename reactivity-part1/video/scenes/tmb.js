// Markers and Mechanics, Part 1 (second half).
//   tm01s04  match the game to your dog's needs: on Tori's pictures, something worrying too close, a toss away, then a scatter; mouth for another dog
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
    const { stage, tl, cue, end, dur } = ctx;
    css(stage);
    TM.head(ctx, 'Your dog’s needs', 'Match the game to your dog’s needs', { size: 62 });
    // Tori's three pictures in the order they are talked about: chase away, then scatter, then food to the mouth
    const H = 440, GAP = 50;
    const G = [['tm_toss.jpg', [1468, 968], 'Chase away from it'], ['tm_scatter.jpg', [1466, 962], 'Then a scatter'], ['tm_mouth_3.jpg', [524, 828], 'Food to the mouth']];
    const ws = G.map(([, [nw, nh]]) => Math.round(H * nw / nh));
    let x = (1920 - ws.reduce((a, b) => a + b, 0) - 2 * GAP) / 2;
    const cards = G.map(([src, nat, lab], i) => {
      const ph = TM.pic(stage, src, { x, y: 290, w: ws[i], h: H, nat, radius: 20 });
      const l = put(stage, K.el('div', 'tm-lab', lab), x, 752, { fontSize: '34px', fontFamily: 'var(--font-head)', width: ws[i] + 'px', textAlign: 'center' });
      const c = { ...ph, lab: l, x, w: ws[i] };
      x += ws[i] + GAP;
      return c;
    });
    const [T, S, M] = cards;
    const shown = new Set();
    const enter = (c, t) => { shown.add(c); A.in(tl, c.wrap, t, 'fadeUp', { dur: 0.7 }); A.in(tl, c.lab, t + 0.25, 'fadeUp', { dur: 0.5 }); };
    // the picture being talked about lifts; the ones already on screen soften
    const focus = (c, t) => {
      tl.to(c.wrap, { scale: 1.035, opacity: 1, duration: 0.5, ease: 'power2.out' }, t);
      [...shown].filter(o => o !== c).forEach(o => tl.to(o.wrap, { scale: 1, opacity: 0.5, duration: 0.4 }, t));
    };

    // 1. something worrying shows up too close: an amber warning pulses at the left of the toss picture
    enter(T, cue(0) + 0.2);
    const W = T.P(0.40, 0.66);
    const wb = put(T.wrap, K.el('div'), W[0] - 34, W[1] - 34, { position: 'absolute', width: '68px', height: '68px', borderRadius: '50%', background: 'var(--amber-pale)',
      border: '4px solid #fff', boxShadow: '0 6px 16px rgba(0,0,0,0.25)', display: 'grid', placeItems: 'center', color: '#b06d12', zIndex: 3 });
    wb.appendChild(K.icon('triangle-alert', { size: 36 }));
    const tW = at(ctx, 0, 'stressed', 0.3);
    A.in(tl, wb, tW, 'pop', { dur: 0.5 });
    TM.fx.ring(tl, T.sv, W, tW + 0.3, { n: 3, r: 40, color: 'var(--amber)' });
    TM.fx.tag(tl, T.wrap, 'Something worrying, too close', 16, 16, tW + 0.4, 'amber');
    const hard = TM.fx.tag(tl, T.wrap, 'Standing still for a treat here: harder', 16, T.h - 66, at(ctx, 0, 'harder', 0.85), 'red');
    hard.prepend(K.icon('x'));

    // 2. a treat chase away from it: she bowls a treat low across the floor and the dog follows it, away from the worry
    const t1 = at(ctx, 1, 'treat chases', 0.15);
    tl.to(hard, { opacity: 0, duration: 0.4 }, t1 - 0.2);
    focus(T, t1 - 0.2);
    const H0 = T.P(0.235, 0.5), F0 = T.P(0.29, 0.81), E = T.P(0.945, 0.84);
    TM.fx.dots(tl, T.sv, [H0, T.P(0.24, 0.68), T.P(0.26, 0.77), F0], t1 + 0.1, { dur: 0.45, hold: 2.4, r: 3.6, color: '#fff', stroke: 'var(--amber)' });
    TM.fx.toss(tl, T.sv, F0, E, t1 + 0.55, { hold: 2.0 });
    // the space it opens up: a green line from the worry out to where the dog is now
    const sp = TM.fx.dots(tl, T.sv, [T.P(0.40, 0.92), T.P(0.94, 0.92)], t1 + 1.5, { dur: 0.7, hold: 0, r: 3.4, color: 'var(--green)' });
    TM.fx.tag(tl, T.wrap, 'More space', T.w - 170, T.h - 70, t1 + 2.1);

    // 3. once there is enough space, a scatter
    const tS = at(ctx, 1, 'scatter', 0.7);
    enter(S, tS - 0.3);
    focus(S, tS + 0.3);
    const PTS = [[0.405, 0.875], [0.44, 0.865], [0.47, 0.885], [0.50, 0.87], [0.525, 0.88]].map(([a, b]) => S.P(a, b));
    TM.fx.drops(tl, S.sv, S.P(0.33, 0.6), PTS, tS + 0.6);
    TM.fx.tag(tl, S.wrap, 'Enough space: scatter', 16, 16, tS + 0.9);

    // 4. another dog: food to the mouth is easier to follow
    const tM = at(ctx, 2, 'mouth', 0.4);
    enter(M, tM - 0.4);
    focus(M, tM + 0.2);
    TM.fx.ring(tl, M.sv, M.P(0.454, 0.457), tM + 0.6, { n: 2, r: 24 });
    TM.fx.tag(tl, M.wrap, 'Another dog', 12, 12, tM + 0.7);

    // watch your dog; pattern games later
    tl.to(cards.map(c => c.wrap), { scale: 1, opacity: 1, duration: 0.5 }, cue(3));
    const row = put(stage, K.el('div'), 0, 836, { position: 'absolute', width: '1920px', display: 'flex', justifyContent: 'center', gap: '24px' });
    const w = flow(TM.word(row, 'Watch how your dog responds', { variant: 'green', size: 30, icon: 'eye' }));
    A.in(tl, w, at(ctx, 3, 'watch how', 0.05), 'fadeUp', { dur: 0.5 });
    const pg = flow(TM.word(row, 'Coming later: pattern games', { variant: 'pale', size: 30, icon: 'sparkles' }));
    A.in(tl, pg, at(ctx, 4, 'pattern games', 0.5), 'pop', { dur: 0.45 });
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
      TM.fx.dots(tl, sv, [P(0.44, 0.42), P(0.29, 0.14)], t, { dur: 0.6, hold: 2.4, r: 5.5, gap: 18, stroke: 'var(--green)' });
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
    const { stage, tl } = ctx;
    const o = TM.order(stage, ['Mark', 'Pause', 'Treat'], { x: 100, y: 700, size: 30 });
    A.in(tl, o.items, at(ctx, 1, 'watch the order', 0.1), 'fadeRight', { dur: 0.4, stagger: 0.12 });
  });
})();
