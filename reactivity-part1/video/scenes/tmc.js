// Markers and Mechanics, Parts 2 and 3.
//   tm02s01  give each game its own word: three columns of options; one picked per game; a clicker for the mouth; avoid good / yes
//   tm03s01  your mechanics matter: Word and Hand lanes; the right order (word, pause, hand) and the wrong one (hand during the word)
//   tm03s02  practice without your dog first (Tori's clip); Word, Pause, Move strip
(() => {
  const { at, put, clamp } = TM;
  const CSS = `
  .tmc-col { position: absolute; background: #fff; border-radius: 26px; border: 1px solid #e6e9e1; box-shadow: var(--shadow-soft); box-sizing: border-box; padding: 26px 28px; }
  .tmc-col .stage { position: relative; height: 130px; border-radius: 18px; background: var(--green-mist); overflow: hidden; }
  .tmc-col .tt { margin-top: 20px; font: 700 38px/1 var(--font-head); color: var(--ink); }
  .tmc-col .chips { margin-top: 20px; display: flex; flex-wrap: wrap; gap: 14px; }
  .tmc-col .chips .tm-word { position: relative; font-size: 30px; padding: 12px 24px; }
  .tmc-lane { position: absolute; height: 6px; border-radius: 3px; background: #e3e7dd; }
  .tmc-ll { position: absolute; font: 700 32px/1 var(--font-head); color: var(--ink-soft); }
  .tmc-blk { position: absolute; height: 64px; border-radius: 16px; display: flex; align-items: center; justify-content: center; gap: 10px;
    font: 700 30px/1 var(--font-body); color: #fff; box-sizing: border-box; }
  .tmc-blk svg { width: 30px; height: 30px; stroke-width: 2.4; }
  .tmc-blk.word { background: var(--green-dark); }
  .tmc-blk.hand { background: var(--green); }
  .tmc-blk.bad { background: var(--red); }
  .tmc-gap { position: absolute; font: 600 28px/1 var(--font-body); color: var(--muted); text-align: center; }
  .tmc-ph { position: absolute; width: 4px; border-radius: 2px; background: var(--amber); }
  `;
  const css = stage => { TM.style(stage); if (!stage.querySelector('style[data-tmc]')) { const s = K.el('style', null, CSS); s.dataset.tmc = '1'; stage.appendChild(s); } };
  const flow = n => { n.style.position = 'relative'; n.style.left = n.style.top = ''; return n; };

  // ---------------------------------------------------------------- give each game its own word
  registerScene('tm02s01', ctx => {
    const { stage, tl, cue, end } = ctx;
    css(stage);
    TM.head(ctx, 'Choosing your markers', 'Give each game its own word');
    const COLS = [
      ['To the mouth', ['Yip', 'Yep', 'Mark', 'Nice', 'Treat'], ['yip', 'yep', 'mark', 'nice', 'treat'], 1],
      ['A tossed treat', ['Chase', 'Toss', 'Get it'], ['chase', 'toss', 'get it'], 2],
      ['Scattered', ['Scatter', 'Find it', 'Search'], ['scatter', 'find it', 'search'], 3],
    ];
    const cols = COLS.map(([t, ws, ps, beat], i) => {
      const c = put(stage, K.el('div', 'tmc-col'), 100 + i * 590, 280, { width: '540px', height: '500px' });
      const st = K.el('div', 'stage');
      c.appendChild(st);
      c.appendChild(K.el('div', 'tt', t));
      const chips = K.el('div', 'chips');
      c.appendChild(chips);
      tl.fromTo(c, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, cue(0) + 0.2 + i * 0.12);
      const ns = ws.map((w, k) => {
        const n = flow(TM.word(chips, w, { variant: 'pale' }));
        A.in(tl, n, at(ctx, beat, ps[k], 0.25 + 0.13 * k), 'pop', { dur: 0.4 });
        return n;
      });
      return { c, st, chips, ns };
    });
    // header animations, each on its beat
    {
      const st = cols[0].st, t0 = cue(1) + 0.2;
      const h = K.iconBadge(st, 'hand', { x: 60, y: 25, size: 80, variant: 'amber' });
      const m = K.iconBadge(st, 'dog', { x: 340, y: 25, size: 80, variant: 'solid' });
      const tr = TM.treat(st, 140, 65, 1.2);
      A.in(tl, [h, m], t0, 'pop', { dur: 0.4, stagger: 0.1 });
      tl.fromTo(tr, { opacity: 0 }, { opacity: 1, duration: 0.2 }, t0 + 0.4);
      tl.to(tr, { x: 190, duration: 0.8, ease: 'power2.inOut' }, t0 + 0.6);
    }
    {
      const st = cols[1].st, t0 = cue(2) + 0.2;
      const hd = K.iconBadge(st, 'hand', { x: 30, y: 45, size: 64, variant: 'amber' });
      const sv = K.svg(st, { x: 0, y: 0, w: 484, h: 130 });
      const trail = K.path(sv, 'M 100 100 C 200 110, 320 108, 430 100', { stroke: '#d9912b', 'stroke-width': 4, fill: 'none', 'stroke-dasharray': '3 12', 'stroke-linecap': 'round' });
      const tr = TM.treat(st, 110, 98, 1.2);
      A.in(tl, hd, t0, 'pop', { dur: 0.4 });
      A.draw(tl, trail, t0 + 0.3, 0.9);
      TM.lowToss(tl, tr, 310, t0 + 0.3);
    }
    {
      const st = cols[2].st, t0 = cue(3) + 0.2;
      [[90, 0], [170, 0.1], [240, 0.05], [310, 0.18], [390, 0.12]].forEach(([x, d], k) => {
        const tr = TM.treat(st, x, 98 - (k % 2) * 8, 1.0);
        tl.fromTo(tr, { opacity: 0, y: -80 }, { opacity: 1, y: 0, duration: 0.5, ease: 'bounce.out' }, t0 + d * 3);
      });
    }
    // pick one per game; a clicker can be the mouth marker
    const tP = at(ctx, 4, 'one word for each', 0.1);
    cols.forEach((k, i) => tl.to(k.ns[0], { backgroundColor: '#619537', color: '#fff', borderColor: '#619537', scale: 1.08, duration: 0.4 }, tP + 0.25 * i));
    cols.forEach((k, i) => tl.to(k.ns.slice(1), { opacity: 0.45, duration: 0.4 }, tP + 0.25 * i));
    const ck = flow(TM.word(cols[0].chips, 'Clicker', { variant: 'pale', icon: 'mouse-pointer-click' }));
    A.in(tl, ck, at(ctx, 4, 'clicker', 0.7), 'pop', { dur: 0.45 });
    tl.to(ck, { backgroundColor: '#619537', color: '#fff', borderColor: '#619537', duration: 0.4 }, at(ctx, 4, 'clicker', 0.7) + 0.5);
    // avoid good and yes
    const row = put(stage, K.el('div'), 0, 820, { position: 'absolute', width: '1920px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '18px' });
    const al = flow(put(row, K.el('div', 'tm-lab', 'Avoid:'), 0, 0, { fontSize: '34px', color: 'var(--red)' }));
    const bad = [['“Good”', 'good'], ['“Yes”', 'yes']].map(([w, p]) => {
      const n = flow(TM.word(row, w, { variant: 'red', cross: true, size: 32 }));
      const t = at(ctx, 5, p, 0.2);
      A.in(tl, n, t, 'pop', { dur: 0.4 });
      TM.strike(tl, n, t + 0.35);
      return n;
    });
    const why = flow(put(row, K.el('div', 'tm-lab', 'Everyday words, often no food'), 0, 0, { fontSize: '30px', color: 'var(--ink-soft)' }));
    A.in(tl, al, at(ctx, 5, 'avoiding', 0.15) - 0.2, 'fadeUp', { dur: 0.4 });
    A.in(tl, why, at(ctx, 5, 'everyday', 0.5), 'fadeUp', { dur: 0.5 });
    const tR = at(ctx, 6, 'reserve', 0.4);
    tl.to(row, { opacity: 0, duration: 0.35 }, cue(6));
    const bn = put(stage, K.el('div', 'tm-banner'), 0, 815);
    bn.appendChild(K.icon('lock'));
    bn.appendChild(K.el('span', null, 'Reserve your words <b>for these games</b>'));
    TM.centerX(bn, 960);
    A.in(tl, bn, tR, 'fadeUp', { dur: 0.6 });
  });

  // ---------------------------------------------------------------- your mechanics matter
  registerScene('tm03s01', ctx => {
    const { stage, tl, cue, end } = ctx;
    css(stage);
    TM.head(ctx, 'Practicing your mechanics', 'Your mechanics matter');
    const lead = K.text(stage, 'Two separate actions. <b style="color:var(--green)">Never at the same time.</b>', { x: 100, y: 270, cls: 'lead', size: 38 });
    A.in(tl, lead, at(ctx, 0, 'two separate actions', 0.4), 'fadeUp', { dur: 0.6 });
    const X0 = 380, X1 = 1500;
    const lanes = (y, label, cls) => {
      const tag = put(stage, K.el('div', 'tm-lab', label), 100, y - 6, { fontSize: '34px', color: cls === 'bad' ? 'var(--red)' : 'var(--green-dark)' });
      const lw = put(stage, K.el('div', 'tmc-ll', 'Mark'), 240, y + 28);
      const lh = put(stage, K.el('div', 'tmc-ll', 'Hand'), 240, y + 108);
      const a = put(stage, K.el('div', 'tmc-lane'), X0, y + 42, { width: X1 - X0 + 'px' });
      const b = put(stage, K.el('div', 'tmc-lane'), X0, y + 122, { width: X1 - X0 + 'px' });
      return { tag, all: [lw, lh, a, b] };
    };
    const blk = (x, y, w, cls, icon, txt) => {
      const n = put(stage, K.el('div', 'tmc-blk ' + cls), x, y, { width: w + 'px' });
      if (icon) n.appendChild(K.icon(icon));
      n.appendChild(K.el('span', null, txt));
      return n;
    };
    // the right way
    const R = lanes(370, 'Right', 'good');
    A.in(tl, [R.tag, ...R.all], cue(0) + 0.6, 'fade', { dur: 0.5, stagger: 0.05 });
    const w1 = blk(X0, 380, 220, 'word', 'volume-2', 'Yip');
    const gp = put(stage, K.el('div', 'tmc-gap', 'pause'), X0 + 240, 400, { width: '200px' });
    const h1 = blk(X0 + 460, 460, 320, 'hand', 'hand', 'Treat');
    const ph = put(stage, K.el('div', 'tmc-ph'), X0, 360, { height: '180px' });
    const tR = at(ctx, 1, 'say the word', 0.05);
    A.in(tl, w1, tR, 'grow', { dur: 0.5 });
    A.in(tl, gp, at(ctx, 1, 'pause', 0.4), 'fade', { dur: 0.4 });
    A.in(tl, h1, at(ctx, 1, 'reach for', 0.7), 'grow', { dur: 0.5 });
    tl.fromTo(ph, { opacity: 0 }, { opacity: 1, duration: 0.2 }, tR);
    tl.to(ph, { x: 800, duration: Math.max(1.5, end(1) - tR), ease: 'none' }, tR);
    tl.to(ph, { opacity: 0, duration: 0.3 }, end(1));
    // the wrong way: the hand moves during the word
    const W = lanes(600, 'Wrong', 'bad');
    const tW = at(ctx, 2, 'before or during', 0.2);
    A.in(tl, [W.tag, ...W.all], tW - 0.4, 'fade', { dur: 0.4, stagger: 0.05 });
    const w2 = blk(X0, 610, 220, 'word', 'volume-2', 'Yip');
    const h2 = blk(X0 + 60, 690, 320, 'bad', 'hand', 'Treat');
    A.in(tl, w2, tW, 'grow', { dur: 0.4 });
    A.in(tl, h2, tW + 0.2, 'grow', { dur: 0.4 });
    const eye = K.iconBadge(stage, 'eye', { x: 980, y: 640, size: 90, variant: 'red' });
    const el = put(stage, K.el('div', 'tm-lab', 'Your dog watches your hand,<br>not the mark'), 1090, 648, { fontSize: '30px', color: 'var(--red)' });
    A.in(tl, [eye, el], at(ctx, 2, 'movement predicts', 0.5), 'fadeUp', { dur: 0.5, stagger: 0.1 });
    const bn = put(stage, K.el('div', 'tm-banner'), 0, 850);
    bn.appendChild(K.icon('volume-2'));
    bn.appendChild(K.el('span', null, 'Kept separate, the mark becomes <b>a clear, reliable signal</b>'));
    TM.centerX(bn, 960);
    A.in(tl, bn, at(ctx, 3, 'keeping', 0.1), 'fadeUp', { dur: 0.6 });
  });

  // ---------------------------------------------------------------- practice without your dog first (clip)
  registerScene('tm03s02', ctx => {
    const { stage, tl } = ctx;
    TM.videoSlide(ctx, {
      kicker: 'Practicing your mechanics', heading: 'Practice without your dog first', gap: 28,
      rows: [
        { icon: 'hand', html: 'Treats in your hand', beat: 1, phrase: 'hold treats', fb: 0.05 },
        { icon: 'volume-2', html: 'Mark, pause, *then into a bowl*', beat: 1, phrase: 'pause briefly', fb: 0.3 },
        { icon: 'pause', html: 'Hand still *until the mark ends*', beat: 1, phrase: 'keep your hand still', fb: 0.7 },
        { icon: 'repeat', html: 'Until it’s *consistent*', beat: 2, phrase: 'practice until', fb: 0.05 },
      ],
    });
    const o = TM.order(stage, ['Mark', 'Pause', 'Move'], { x: 100, y: 700, size: 28, icons: ['volume-2', 'pause', 'hand'] });
    A.in(tl, o.items, at(ctx, 3, 'word', 0.3), 'fadeRight', { dur: 0.4, stagger: 0.15 });
  });
})();
