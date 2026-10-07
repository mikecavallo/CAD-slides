// Markers and Mechanics, Part 1 (second half).
//   tm01s04  match the game to your dog's needs: a distance strip (worry, too close, enough space); tosses carry the dog away, then a scatter; Tori's game pictures underneath
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
    // a distance strip: something worrying at the left, "too close" fading into "enough space" to the right.
    // The dog is a marker on the strip; treats skim along it, the dog follows them out to where there is room.
    const X0 = 100, W = 1720, Y = 285, H = 270, GY = Y + 190;
    const panel = put(stage, K.el('div'), X0, Y, { position: 'absolute', width: W + 'px', height: H + 'px', borderRadius: '26px', overflow: 'hidden',
      background: 'linear-gradient(90deg, #f8e3dd 0%, #fbefd9 28%, #f3f8ec 52%, #e8f1dc 100%)', border: '2px solid #e6e9e1' });
    A.in(tl, panel, cue(0) + 0.1, 'fadeUp', { dur: 0.6 });
    const sv = K.svg(stage, { x: X0, y: Y, w: W, h: H });
    sv.style.overflow = 'visible';
    const ground = K.path(sv, `M 40 ${GY - Y} L ${W - 40} ${GY - Y}`, { stroke: '#d7dccf', 'stroke-width': 5 });
    A.draw(tl, ground, cue(0) + 0.3, 0.7);
    const zl = (t, x, col) => put(stage, K.el('div', 'tm-lab', t), x, Y + 210, { fontSize: '26px', color: col });
    const zTC = zl('Too close', X0 + 180, 'var(--red)'), zES = zl('Enough space', X0 + W - 250, 'var(--green-dark)');
    // the worry
    const wb = K.iconBadge(stage, 'triangle-alert', { x: X0 + 40, y: GY - 120, size: 96, variant: 'amber' });
    const wl = put(stage, K.el('div', 'tm-lab', 'Something<br>worrying'), X0 + 26, GY - 12, { fontSize: '24px', color: '#8a5410', width: '130px', textAlign: 'center', whiteSpace: 'normal' });
    const tW = at(ctx, 0, 'stressed', 0.3);
    A.in(tl, [wb, wl], tW, 'pop', { dur: 0.5, stagger: 0.1 });
    TM.fx.ring(tl, sv, [88, GY - Y - 72], tW + 0.3, { n: 2, r: 46, color: 'var(--amber)' });
    A.in(tl, [zTC, zES], tW + 0.4, 'fade', { dur: 0.5 });
    // the dog: a marker on the strip, close to the worry
    const dog = put(stage, K.el('div'), 0, 0, { position: 'absolute', width: '96px', height: '96px', borderRadius: '50%', background: 'var(--green)', color: '#fff',
      display: 'grid', placeItems: 'center', boxShadow: '0 10px 24px rgba(40,70,20,0.3)', border: '5px solid #fff', zIndex: 4 });
    dog.appendChild(K.icon('dog', { size: 52 }));
    const DX0 = X0 + 330, DY = GY - 100;
    Object.assign(dog.style, { left: DX0 + 'px', top: DY + 'px' });
    A.in(tl, dog, tW + 0.5, 'pop', { dur: 0.5 });
    const dogLab = put(stage, K.el('div', 'tm-lab', 'Your dog'), DX0 - 6, DY - 46, { fontSize: '24px', color: 'var(--green-dark)' });
    A.in(tl, dogLab, tW + 0.7, 'fadeUp', { dur: 0.4 });
    // standing still for a treat this close: harder
    const hard = TM.word(stage, 'Standing still for a treat this close: harder', { x: DX0 + 130, y: DY + 14, variant: 'red', size: 28, icon: 'x' });
    A.in(tl, hard, at(ctx, 0, 'harder', 0.85), 'pop', { dur: 0.45 });

    // treat chases away from it: two low tosses along the ground, the dog follows each one
    const t1 = at(ctx, 1, 'treat chases', 0.15);
    tl.to([hard, dogLab], { opacity: 0, duration: 0.35 }, t1 - 0.25);
    const gy = GY - Y - 8;
    const hops = [[DX0 - X0 + 100, 820], [820, 1260]];
    hops.forEach(([a, b], k) => {
      const t = t1 + 0.2 + k * 1.5;
      TM.fx.toss(tl, sv, [a, gy], [b, gy], t, { dur: 0.8, hold: 1.0 });
      tl.to(dog, { left: X0 + b - 48 + 'px', duration: 0.75, ease: 'power2.inOut' }, t + 0.55);
    });
    const tChase = TM.word(stage, 'Treat chases, moving away', { x: X0 + 700, y: Y + 26, variant: 'green', size: 28, icon: 'move-right' });
    A.in(tl, tChase, t1 + 0.4, 'pop', { dur: 0.45 });
    // with enough space: a scatter around the dog
    const tS = at(ctx, 1, 'scatter', 0.7);
    const cx = 1260;
    TM.fx.drops(tl, sv, [cx, gy - 120], [[cx - 70, gy + 2], [cx - 30, gy - 8], [cx + 20, gy + 4], [cx + 60, gy - 6], [cx + 100, gy + 3]], tS);
    const tScat = TM.word(stage, 'Enough space: scatter', { x: X0 + 1130, y: Y + 26, variant: 'green', size: 28, icon: 'sparkles' });
    tl.to(tChase, { opacity: 0, duration: 0.3 }, tS - 0.3);
    A.in(tl, tScat, tS, 'pop', { dur: 0.45 });

    // underneath: Tori's pictures of the games, each lit as it is mentioned
    const PH = 250, G = [['tm_toss.jpg', [1468, 968], 'Toss to chase'], ['tm_scatter.jpg', [1466, 962], 'Scatter'], ['tm_mouth_3.jpg', [524, 828], 'Another dog: food to the mouth']];
    const ws = G.map(([, [nw, nh]]) => Math.round(PH * nw / nh)), GAP = 40;
    let x = (1920 - ws.reduce((a, b) => a + b, 0) - 2 * GAP) / 2;
    const pics = G.map(([src, nat, lab], i) => {
      const ph = TM.pic(stage, src, { x, y: 590, w: ws[i], h: PH, nat, radius: 18, border: 6 });
      tl.set(ph.wrap, { opacity: 0 }, 0);
      ph.lab = put(stage, K.el('div', 'tm-lab', lab), x - 40, 850, { fontSize: '28px', fontFamily: 'var(--font-head)', width: ws[i] + 80 + 'px', textAlign: 'center' });
      tl.set(ph.lab, { opacity: 0 }, 0);
      x += ws[i] + GAP;
      return ph;
    });
    const show = (ph, t) => {
      tl.fromTo(ph.wrap, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', immediateRender: false }, t);
      tl.to(ph.lab, { opacity: 1, duration: 0.4 }, t + 0.25);
    };
    show(pics[0], t1 + 0.3);
    show(pics[1], tS - 0.1);
    // another dog may find food to the mouth easier: its picture lifts, the strip steps back
    const tM = at(ctx, 2, 'mouth', 0.4);
    show(pics[2], tM - 0.3);
    tl.to([panel, sv, dog, wb, wl, zTC, zES, tScat, pics[0].wrap, pics[1].wrap, pics[0].lab, pics[1].lab], { opacity: 0.45, duration: 0.5 }, tM);
    tl.to(pics[2].wrap, { scale: 1.06, duration: 0.5, ease: 'power2.out' }, tM);
    TM.fx.ring(tl, pics[2].sv, pics[2].P(0.454, 0.457), tM + 0.4, { n: 2, r: 20 });
    // watch your dog; pattern games later
    tl.to([panel, sv, dog, wb, wl, zTC, zES, tScat, pics[0].wrap, pics[1].wrap, pics[0].lab, pics[1].lab], { opacity: 1, duration: 0.5 }, cue(3));
    tl.to(pics[2].wrap, { scale: 1, duration: 0.5 }, cue(3));
    const row = put(stage, K.el('div'), 0, 912, { position: 'absolute', width: '1920px', display: 'flex', justifyContent: 'center', gap: '24px' });
    const w = flow(TM.word(row, 'Watch how your dog responds', { variant: 'green', size: 28, icon: 'eye' }));
    A.in(tl, w, at(ctx, 3, 'watch how', 0.05), 'fadeUp', { dur: 0.5 });
    const pg = flow(TM.word(row, 'Coming later: pattern games', { variant: 'pale', size: 28, icon: 'sparkles' }));
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
