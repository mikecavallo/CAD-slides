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
    const wr = K.iconBadge(stage, 'triangle-alert', { x: 200, y: 370, size: 100, variant: 'amber' });
    const wl = put(stage, K.el('div', 'tm-lab', 'Something<br>worrying'), 160, 486, { fontSize: '28px', color: '#8a5410', width: '180px', textAlign: 'center', whiteSpace: 'normal' });
    A.in(tl, [wr, wl], at(ctx, 0, 'stressed', 0.3), 'pop', { dur: 0.5, stagger: 0.1 });
    // the dog, close to it and facing it
    const sv = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const DX = 640, DY = 560;
    const D = C2.dog(sv, DX, DY, 0.62);
    tl.set(D.outer, { scaleX: -1, svgOrigin: `${DX} ${DY}` }, 0);
    A.in(tl, D.outer, cue(0) + 0.6, 'fade', { dur: 0.6 });
    const ground = K.path(sv, 'M 140 666 L 1780 666', { stroke: '#cfe3b8', 'stroke-width': 6, 'stroke-linecap': 'round', fill: 'none' });
    A.draw(tl, ground, cue(0) + 0.5, 0.8);
    // food to the mouth up close: harder for this dog
    const tSc = at(ctx, 0, 'standing still', 0.6);
    const hand = K.iconBadge(stage, 'hand', { x: 400, y: 440, size: 70, variant: 'amber' });
    const tr0 = TM.treat(stage, 488, 482, 1.1);
    A.in(tl, hand, tSc, 'pop', { dur: 0.4 });
    tl.fromTo(tr0, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }, tSc + 0.3);
    const close = [hand, tr0];
    const hard = TM.word(stage, 'Standing still for a treat up close: harder', { x: 400, y: 316, variant: 'red', size: 30, icon: 'x' });
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
    // another dog: the magnet hand, walking away with a treat held at the dog's nose
    const tM = at(ctx, 2, 'another dog', 0.05);
    const sceneOut = [...stage.querySelectorAll('.tm-treat'), away, ok, D.outer];
    tl.to(sceneOut, { opacity: 0, duration: 0.4 }, tM - 0.1);
    tl.to(sv.querySelectorAll('path[stroke="#d9912b"]'), { opacity: 0, duration: 0.4 }, tM - 0.1);
    const MX = 470, MY = 560, S2 = 0.62;
    const nose = [MX + 173 * S2, MY - 55];
    const PAW = MY + 129 * S2;  // the dog's paws touch the ground here; the handler stands on the same line
    const SC = 0.86, PX = nose[0] - 30;
    // the handler (drawn behind the dog): ponytail, grey jacket (never green, so the dog stands out), jeans, grey shoes
    const P = K.group(sv, { transform: `translate(${PX} ${PAW})` });
    const Pi = K.group(P, { transform: `scale(${SC})` });
    const JACKET = '#6b7078';
    const leg = (dx, col) => {
      const g = K.group(Pi);
      K.path(g, `M ${dx} -138 L ${dx - 3} -74 L ${dx - 6} -12`, { stroke: col, 'stroke-width': 21, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', fill: 'none' });
      K.path(g, `M ${dx - 18} -6 C ${dx - 18} -16 ${dx + 4} -18 ${dx + 14} -9 C ${dx + 20} -4 ${dx + 16} 0 ${dx + 8} 0 L ${dx - 16} 0 C ${dx - 20} 0 ${dx - 20} -3 ${dx - 18} -6 Z`, { fill: '#5d5f59', stroke: 'none' });
      return g;
    };
    const legB = leg(-4, '#3d5a85'), legF = leg(4, '#4a6fa5');
    K.path(Pi, 'M -32 -256 C -38 -218 -36 -170 -32 -132 C -14 -124 14 -124 32 -132 C 36 -170 36 -218 30 -256 C 16 -266 -18 -266 -32 -256 Z', { fill: JACKET, stroke: 'none' });
    K.path(Pi, 'M -8 -260 L 10 -260 L 1 -236 Z', { fill: '#efe6d2', stroke: 'none' });
    K.rect(Pi, -7, -274, 16, 18, { fill: '#e2b48f', stroke: 'none', rx: 4 });
    K.path(Pi, 'M -18 -302 C -40 -294 -46 -270 -36 -248 C -30 -266 -26 -282 -12 -292 Z', { fill: '#6b3f22', stroke: 'none' });
    K.svgEl('ellipse', { cx: 6, cy: -292, rx: 22, ry: 26, fill: '#e2b48f' }, Pi);
    K.path(Pi, 'M -16 -294 C -18 -324 24 -330 30 -300 C 22 -310 2 -312 -6 -298 C -10 -292 -14 -290 -16 -294 Z', { fill: '#6b3f22', stroke: 'none' });
    K.circle(Pi, 19, -294, 2.5, { fill: '#3a2a1e' });
    const hx = (nose[0] - PX + 4) / SC, hy = (nose[1] - PAW - 6) / SC;
    K.path(Pi, `M 8 -246 C 22 -220 30 -196 28 -186 C 26 -174 ${hx - 6} ${hy - 22} ${hx} ${hy}`, { stroke: JACKET, 'stroke-width': 17, 'stroke-linecap': 'round', fill: 'none' });
    K.circle(Pi, hx, hy, 9, { fill: '#e2b48f' });
    const M = C2.dog(sv, MX, MY, S2);
    const tH = TM.treat(stage, nose[0] + 2, nose[1] - 4, 0.9);
    A.in(tl, [P, M.outer], tM + 0.2, 'fade', { dur: 0.5 });
    A.in(tl, tH, tM + 0.5, 'pop', { dur: 0.35 });
    const walk = Math.max(2, end(3) - tM - 0.8);
    tl.to([M.outer, P], { x: '+=620', duration: walk, ease: 'none' }, tM + 0.7);
    tl.to(tH, { x: 620, duration: walk, ease: 'none' }, tM + 0.7);
    // both walk: the handler's legs and the dog's four legs swing in step
    const steps = Math.max(1, Math.floor(walk / 0.5));
    const swing = (el, a) => tl.fromTo(el, { rotation: -a, transformOrigin: '50% 4%' }, { rotation: a, transformOrigin: '50% 4%', duration: 0.25, ease: 'sine.inOut', yoyo: true, repeat: 2 * steps - 1 }, tM + 0.7);
    swing(legB, 16); swing(legF, -16);
    const [, farHind, farFront, , nearHind, nearFront] = M.fig.children;
    swing(farHind, -14); swing(nearFront, -14); swing(nearHind, 14); swing(farFront, 14);
    C2.wag(tl, M, tM + 0.7, tM + 0.7 + walk);
    const m = TM.word(stage, 'Magnet hand: walk away before your dog looks and reacts', { x: 100, y: 735, variant: 'pale', size: 30, icon: 'magnet' });
    A.in(tl, m, at(ctx, 3, 'magnet hand', 0.1), 'fadeUp', { dur: 0.5 });
    const w = TM.word(stage, 'Watch how your dog responds', { x: 100, y: 820, variant: 'green', size: 30, icon: 'eye' });
    A.in(tl, w, at(ctx, 4, 'watch how', 0.05), 'fadeUp', { dur: 0.5 });
    const pg = TM.word(stage, 'Coming later: pattern games', { x: 1260, y: 820, variant: 'pale', size: 30, icon: 'sparkles' });
    A.in(tl, pg, at(ctx, 5, 'pattern games', 0.5), 'pop', { dur: 0.45 });
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
      const ph = K.photo(stage, src, { x, y: 425, w: 560, h: 467, pos: '50% 50%' });
      ph.root.style.border = '6px solid ' + (good ? '#619537' : '#b8452d');
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
