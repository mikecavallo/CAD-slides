// Markers and Mechanics, Parts 2 and 3.
//   tm02s01  give each game its own word: three columns of options; one picked per game; a clicker for the mouth; avoid good / yes
//   tm03s01  your mechanics matter: Word and Hand lanes; the right order (word, pause, hand) and the wrong one (hand during the word)
//   tm03s02  practice without your dog first (Tori's clip); Word, Pause, Move strip
(() => {
  const { at, put, clamp } = TM;
  const CSS = `
  .tmc-col { position: absolute; background: #fff; border-radius: 26px; border: 1px solid #e6e9e1; box-shadow: var(--shadow-soft); box-sizing: border-box; padding: 26px 28px; }
  .tmc-col .stage { position: relative; height: 190px; border-radius: 18px; background: var(--green-mist); overflow: hidden; }
  .tmc-col .stage img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
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

  // ---------------------------------------------------------------- give each game its own word: one slide per game
  // Tori's picture shown whole at the left; the game's name and its example words at the right
  const gameSlide = (ctx, o) => {
    const { stage, tl, cue } = ctx;
    css(stage);
    TM.head(ctx, 'Choosing your markers', 'Give each game its own word');
    const MAXW = o.ar < 1 ? 420 : 860, MAXH = 620;
    const w = Math.round(Math.min(MAXW, MAXH * o.ar)), h = Math.round(w / o.ar);
    const ph = K.photo(stage, o.src, { x: 100, y: 300, w, h, radius: 22 });
    ph.root.style.border = '8px solid #fff';
    A.in(tl, ph.root, o.tPic, 'fadeUp', { dur: 0.7 });
    const X = 100 + w + 80, W = 1820 - X;
    // the name and the words stack in one column, so a long name can never run into the words
    const colm = put(stage, K.el('div'), X, 320, { position: 'absolute', width: W + 'px', display: 'flex', flexDirection: 'column', gap: '34px' });
    const name = flow(put(colm, K.el('div', 'tm-lab', o.name), 0, 0, { fontSize: '56px', fontFamily: 'var(--font-head)', color: 'var(--ink)', whiteSpace: 'normal', width: W + 'px' }));
    A.in(tl, name, o.tPic + 0.2, 'fadeUp', { dur: 0.6 });
    const chips = flow(put(colm, K.el('div'), 0, 0, { width: W + 'px', display: 'flex', flexWrap: 'wrap', gap: '18px' }));
    o.words.forEach(([wd, p], k) => {
      const n = flow(TM.word(chips, '“' + wd + '”', { variant: 'pale', size: 40 }));
      A.in(tl, n, at(ctx, o.beat, p, 0.25 + 0.13 * k), 'pop', { dur: 0.4 });
    });
    return { X, W, ph };
  };

  registerScene('tm02s01', ctx => {
    const { stage, tl, cue } = ctx;
    const g = gameSlide(ctx, { src: 'tm_mouth_3.jpg', ar: 524 / 828, name: 'Food to the mouth', beat: 1, tPic: cue(1),
      words: [['Yip', 'yip'], ['Yep', 'yep'], ['Mark', 'mark'], ['Nice', 'nice'], ['Treat', 'treat'], ['X', 'x']] });
    const lead = put(stage, K.el('div', 'tm-lab', 'Choose a <b style="color:var(--green)">short, distinct word</b> for each food game.'), 100, 300, { fontSize: '40px', whiteSpace: 'normal', width: '1400px' });
    A.in(tl, lead, cue(0) + 0.2, 'fadeUp', { dur: 0.6 });
    tl.to(lead, { opacity: 0, duration: 0.4 }, cue(1) - 0.2);
  });

  registerScene('tm02s02', ctx => {
    gameSlide(ctx, { src: 'tm_toss.jpg', ar: 1468 / 968, name: 'A tossed treat', beat: 0, tPic: ctx.cue(0) + 0.1,
      words: [['Chase', 'chase'], ['Toss', 'toss'], ['Get it', 'get it'], ['Free', 'free']] });
  });

  registerScene('tm02s03', ctx => {
    gameSlide(ctx, { src: 'tm_scatter.jpg', ar: 1466 / 962, name: 'Treats scattered', beat: 0, tPic: ctx.cue(0) + 0.1,
      words: [['Scatter', 'scatter'], ['Find it', 'find it'], ['Search', 'search'], ['Get it', 'get it']] });
  });

  registerScene('tm02s04', ctx => {
    const { stage, tl, cue, end } = ctx;
    css(stage);
    TM.head(ctx, 'Choosing your markers', 'One word for each game');
    const H = 300;
    const T = [['tm_mouth_3.jpg', 524 / 828, 'Yip'], ['tm_toss.jpg', 1468 / 968, 'Chase'], ['tm_scatter.jpg', 1466 / 962, 'Scatter']];
    const ws = T.map(t => Math.round(H * t[1])), GAP = 70;
    let x = (1920 - ws.reduce((a, b) => a + b, 0) - 2 * GAP) / 2;
    const tP = at(ctx, 0, 'one word for each', 0.1);
    const tiles = T.map(([src, , wd], i) => {
      const ph = K.photo(stage, src, { x, y: 290, w: ws[i], h: H, radius: 18 });
      ph.root.style.border = '6px solid #fff';
      const chip = TM.word(stage, '“' + wd + '”', { x, y: 610, variant: 'green', size: 34 });
      A.in(tl, ph.root, tP + 0.2 * i, 'fadeUp', { dur: 0.6 });
      A.in(tl, chip, tP + 0.2 * i + 0.4, 'pop', { dur: 0.4 });
      const r = { x, w: ws[i], chip };
      x += ws[i] + GAP;
      return r;
    });
    tl.call(() => {}, null, 0);
    const ck = TM.word(stage, 'or a Clicker', { x: tiles[0].x, y: 690, variant: 'pale', size: 30, icon: 'mouse-pointer-click' });
    A.in(tl, ck, at(ctx, 0, 'clicker', 0.7), 'pop', { dur: 0.45 });
    const row = put(stage, K.el('div'), 0, 800, { position: 'absolute', width: '1920px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '18px' });
    const al = flow(put(row, K.el('div', 'tm-lab', 'Avoid:'), 0, 0, { fontSize: '34px', color: 'var(--red)' }));
    A.in(tl, al, at(ctx, 1, 'avoiding', 0.15) - 0.2, 'fadeUp', { dur: 0.4 });
    [['“Good”', 'good'], ['“Yes”', 'yes']].forEach(([w, p]) => {
      const n = flow(TM.word(row, w, { variant: 'red', cross: true, size: 32 }));
      const t = at(ctx, 1, p, 0.2);
      A.in(tl, n, t, 'pop', { dur: 0.4 });
      TM.strike(tl, n, t + 0.35);
    });
    const why = flow(put(row, K.el('div', 'tm-lab', 'Everyday words, often no food'), 0, 0, { fontSize: '30px', color: 'var(--ink-soft)' }));
    A.in(tl, why, at(ctx, 1, 'everyday', 0.5), 'fadeUp', { dur: 0.5 });
    tl.to(row, { opacity: 0, duration: 0.35 }, cue(2));
    const bn = put(stage, K.el('div', 'tm-banner'), 0, 795);
    bn.appendChild(K.icon('lock'));
    bn.appendChild(K.el('span', null, 'Reserve your words <b>for these games</b>'));
    TM.centerX(bn, 960);
    A.in(tl, bn, at(ctx, 2, 'reserve', 0.4), 'fadeUp', { dur: 0.6 });
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
