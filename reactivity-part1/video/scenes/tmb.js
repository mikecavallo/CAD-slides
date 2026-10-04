// Markers and Mechanics, Part 1 (second half).
//   tm01s04  match the game to your dog's needs: a distance track; a scatter up close is harder; chase away, then scatter
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
    const { stage, tl, cue, end } = ctx;
    css(stage);
    C2.style(stage);
    TM.head(ctx, 'Your dog’s needs', 'Match the game to your dog’s needs', { size: 62 });
    const panel = put(stage, K.el('div', 'tm-panel'), 100, 290, { width: '1720px', height: '410px' });
    A.in(tl, panel, cue(0) + 0.2, 'fadeUp', { dur: 0.6 });
    // something worrying at the left
    const wr = K.iconBadge(stage, 'triangle-alert', { x: 150, y: 400, size: 110, variant: 'amber' });
    const wl = put(stage, K.el('div', 'tm-lab', 'Something worrying'), 110, 530, { fontSize: '28px', color: '#8a5410' });
    A.in(tl, [wr, wl], at(ctx, 0, 'stressed', 0.3), 'pop', { dur: 0.5, stagger: 0.1 });
    // the dog, close to it and facing it
    const sv = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const DX = 560, DY = 560;
    const D = C2.dog(sv, DX, DY, 0.62);
    tl.set(D.outer, { scaleX: -1, svgOrigin: `${DX} ${DY}` }, 0);
    A.in(tl, D.outer, cue(0) + 0.6, 'fade', { dur: 0.6 });
    const ground = K.path(sv, 'M 140 666 L 1780 666', { stroke: '#cfe3b8', 'stroke-width': 6, 'stroke-linecap': 'round', fill: 'none' });
    A.draw(tl, ground, cue(0) + 0.5, 0.8);
    // food to the mouth up close: harder for this dog
    const tSc = at(ctx, 0, 'standing still', 0.6);
    const hand = K.iconBadge(stage, 'hand', { x: 330, y: 470, size: 76, variant: 'amber' });
    const tr0 = TM.treat(stage, 420, 520, 1.1);
    A.in(tl, hand, tSc, 'pop', { dur: 0.4 });
    tl.fromTo(tr0, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }, tSc + 0.3);
    const close = [hand, tr0];
    const hard = TM.word(stage, 'Standing still for a treat up close: harder', { x: 330, y: 316, variant: 'red', size: 30, icon: 'x' });
    A.in(tl, hard, at(ctx, 0, 'harder', 0.85), 'pop', { dur: 0.45 });
    // chase while moving away (low, along the ground), then a scatter with enough space
    const t1 = at(ctx, 1, 'treat chases', 0.15);
    tl.to([hard, ...close], { opacity: 0, duration: 0.4 }, t1 - 0.2);
    tl.to(D.outer, { scaleX: 1, svgOrigin: `${DX} ${DY}`, duration: 0.3 }, t1);
    [[680, 960], [980, 1260]].forEach(([a, b], i) => {
      const p = K.path(sv, `M ${a} 652 C ${a + 90} 662, ${b - 90} 662, ${b} 652`, { stroke: '#d9912b', 'stroke-width': 4, fill: 'none', 'stroke-dasharray': '3 12', 'stroke-linecap': 'round' });
      A.draw(tl, p, t1 + 0.3 + i * 1.1, 0.7);
      const t = TM.treat(stage, a, 650, 1.0);
      TM.lowToss(tl, t, b - a, t1 + 0.3 + i * 1.1, 0.7);
      tl.to(t, { opacity: 0, duration: 0.3 }, t1 + 1.2 + i * 1.1);
    });
    tl.to(D.outer, { x: 760, duration: 2.2, ease: 'power1.inOut' }, t1 + 0.5);
    const away = TM.word(stage, 'Chase, moving away', { x: 900, y: 316, variant: 'amber', size: 30, icon: 'move-right' });
    A.in(tl, away, t1 + 0.4, 'pop', { dur: 0.45 });
    const tSp = at(ctx, 1, 'enough space', 0.85);
    [[1460, 0], [1520, 0.08], [1580, 0.04], [1640, 0.12], [1700, 0.06]].forEach(([x, d]) => {
      const t = TM.treat(stage, x, 652, 1.0);
      tl.fromTo(t, { opacity: 0, y: -60 }, { opacity: 1, y: 0, duration: 0.45, ease: 'bounce.out' }, tSp + d * 3);
    });
    const ok = TM.word(stage, 'Enough space: scatter', { x: 1360, y: 316, variant: 'green', size: 30, icon: 'check' });
    A.in(tl, ok, tSp, 'pop', { dur: 0.45 });
    // every dog is different
    const m = TM.word(stage, 'Every dog is different', { x: 100, y: 735, variant: 'pale', size: 30, icon: 'dog' });
    A.in(tl, m, at(ctx, 2, 'another dog', 0.1), 'fadeUp', { dur: 0.5 });
    const w = TM.word(stage, 'Watch how your dog responds', { x: 100, y: 820, variant: 'green', size: 30, icon: 'eye' });
    A.in(tl, w, at(ctx, 2, 'watch how', 0.6), 'fadeUp', { dur: 0.5 });
    const pg = TM.word(stage, 'Coming later: pattern games', { x: 1260, y: 820, variant: 'pale', size: 30, icon: 'sparkles' });
    A.in(tl, pg, at(ctx, 3, 'pattern games', 0.5), 'pop', { dur: 0.45 });
  });

  // ---------------------------------------------------------------- what a marker is not
  registerScene('tm01s05', ctx => {
    const { stage, tl, cue, end } = ctx;
    css(stage);
    TM.head(ctx, 'Just as important', 'What a marker is not');
    const row = put(stage, K.el('div'), 100, 280, { position: 'absolute', display: 'flex', alignItems: 'center', gap: '18px' });
    const nl = flow(put(row, K.el('div', 'tm-lab', 'It never means:'), 0, 0, { fontSize: '34px' }));
    A.in(tl, nl, at(ctx, 0, 'does not mean', 0.5), 'fadeUp', { dur: 0.5 });
    [['“No”', 'no'], ['“Stop”', 'stop'], ['“Look at me”', 'look at me']].forEach(([w, p]) => {
      const n = flow(TM.word(row, w, { variant: 'red', cross: true, size: 32 }));
      const t = at(ctx, 0, p, 0.7);
      A.in(tl, n, t, 'pop', { dur: 0.4 });
      TM.strike(tl, n, t + 0.35);
    });
    const pic = K.photo(stage, 'tm_img_checkin.jpg', { x: 100, y: 370, w: 960, h: 576, radius: 22 });
    pic.img.style.objectFit = 'contain';
    pic.root.style.background = '#fff';
    const tG = at(ctx, 2, 'check in', 0.1);
    tl.fromTo(pic.root, { opacity: 0, clipPath: 'inset(0% 100% 0% 0%)' }, { opacity: 1, clipPath: 'inset(0% 50% 0% 0%)', duration: 0.9, ease: 'power2.out' }, tG);
    tl.to(pic.root, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'power2.out' }, at(ctx, 3, 'get their attention', 0.15));
    const col = put(stage, K.el('div', 'tm-col'), 1120, 380, { width: '700px', gap: '40px' });
    const lead = K.el('div', null, 'Mark behavior you want <b style="color:var(--green)">repeated</b>.');
    Object.assign(lead.style, { font: '500 40px/1.3 var(--font-body)', color: 'var(--ink)' });
    col.appendChild(lead);
    A.in(tl, lead, at(ctx, 1, 'mark behavior', 0.3), 'fadeUp', { dur: 0.6 });
    const r1 = TM.row(col, 'circle-check', 'Check-in: *mark the look*', { size: 34 });
    A.in(tl, r1, at(ctx, 2, 'mark the moment', 0.7), 'fadeRight', { dur: 0.5 });
    const r2 = TM.row(col, 'x', 'Pulling: <b style="color:var(--red)">don’t mark it</b>', { size: 34 });
    r2.querySelector('.ic').style.background = 'var(--red-pale)';
    r2.querySelector('.ic').style.color = 'var(--red)';
    A.in(tl, r2, at(ctx, 3, 'accidentally reinforce', 0.55), 'fadeRight', { dur: 0.5 });
    const bn = put(stage, K.el('div', 'tm-banner'), 1120, 760, { width: '700px', boxSizing: 'border-box' });
    bn.appendChild(K.icon('circle-check'));
    bn.appendChild(K.el('span', null, 'Say it once. <b>Always follow through with the food.</b>'));
    A.in(tl, bn, at(ctx, 4, 'say the marker once', 0.1), 'fadeUp', { dur: 0.6 });
    const tN = at(ctx, 5, 'marker in action', 0.7);
    tl.to(bn, { opacity: 0, duration: 0.35 }, tN - 0.35);
    const nx = put(stage, K.el('div', 'tm-banner'), 1120, 760, { width: '700px', boxSizing: 'border-box' });
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
