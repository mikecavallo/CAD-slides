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
  .tmc-step { position: absolute; width: 280px; height: 340px; box-sizing: border-box; border-radius: 26px; background: #fff; border: 1px solid #e6e9e1;
    box-shadow: var(--shadow-soft); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; color: var(--ink); overflow: hidden; }
  .tmc-step .n { position: absolute; top: 18px; left: 22px; font: 800 30px/1 var(--font-head); color: var(--green-light); }
  .tmc-step .ic { width: 96px; height: 96px; border-radius: 50%; background: var(--green-pale); color: var(--green-dark); display: grid; place-items: center; }
  .tmc-step .ic svg { width: 50px; height: 50px; stroke-width: 2.2; }
  .tmc-step .t { font: 800 44px/1 var(--font-head); }
  .tmc-step .s { font: 600 26px/1.2 var(--font-body); opacity: 0.8; text-align: center; padding: 0 16px; }
  .tmc-step .bar { position: absolute; left: 0; bottom: 0; height: 10px; width: 100%; background: var(--amber); transform-origin: left center; transform: scaleX(0); }
  .tmc-ph { position: absolute; width: 4px; border-radius: 2px; background: var(--amber); }
  `;
  const css = stage => { TM.style(stage); if (!stage.querySelector('style[data-tmc]')) { const s = K.el('style', null, CSS); s.dataset.tmc = '1'; stage.appendChild(s); } };
  const flow = n => { n.style.position = 'relative'; n.style.left = n.style.top = ''; return n; };

  const SCATTER = [[0.405, 0.875], [0.44, 0.865], [0.47, 0.885], [0.50, 0.87], [0.525, 0.88]];  // where the treats lie in tm_scatter.jpg
  // ---------------------------------------------------------------- give each game its own word: one slide per game
  // Tori's picture shown whole at the left; the game's name and its example words at the right
  const gameSlide = (ctx, o) => {
    const { stage, tl, cue } = ctx;
    css(stage);
    TM.head(ctx, 'Choosing your markers', 'Give each game its own word');
    const MAXW = o.ar < 1 ? 420 : 860, MAXH = 620;
    const w = Math.round(Math.min(MAXW, MAXH * o.ar)), h = Math.round(w / o.ar);
    const ph = TM.pic(stage, o.src, { x: 100, y: 300, w, h, nat: o.nat, radius: 22 });
    A.in(tl, ph.wrap, o.tPic, 'fadeUp', { dur: 0.7 });
    if (o.fx) o.fx(ph, o.tPic + 0.9);
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
    const g = gameSlide(ctx, { src: 'tm_mouth_3.jpg', ar: 524 / 828, nat: [524, 828], fx: (ph, t) => TM.fx.ring(tl, ph.sv, ph.P(0.454, 0.457), t, { n: 2, r: 26 }), name: 'Food to the mouth', beat: 1, tPic: cue(1),
      words: [['Yip', 'yip'], ['Yep', 'yep'], ['Mark', 'mark'], ['Nice', 'nice'], ['Treat', 'treat'], ['X', 'x']] });
    const lead = put(stage, K.el('div', 'tm-lab', 'Choose a <b style="color:var(--green)">short, distinct word</b> for each food game.'), 100, 300, { fontSize: '40px', whiteSpace: 'normal', width: '1400px' });
    A.in(tl, lead, cue(0) + 0.2, 'fadeUp', { dur: 0.6 });
    tl.to(lead, { opacity: 0, duration: 0.4 }, cue(1) - 0.2);
  });

  registerScene('tm02s02', ctx => {
    gameSlide(ctx, { src: 'tm_toss.jpg', ar: 1468 / 968, nat: [1468, 968], fx: (ph, t) => TM.fx.toss(ctx.tl, ph.sv, ph.P(0.27, 0.80), ph.P(0.945, 0.84), t), name: 'A tossed treat', beat: 0, tPic: ctx.cue(0) + 0.1,
      words: [['Chase', 'chase'], ['Toss', 'toss'], ['Get it', 'get it'], ['Free', 'free']] });
  });

  registerScene('tm02s03', ctx => {
    gameSlide(ctx, { src: 'tm_scatter.jpg', ar: 1466 / 962, nat: [1466, 962], fx: (ph, t) => TM.fx.drops(ctx.tl, ph.sv, ph.P(0.33, 0.6), SCATTER.map(([x, y]) => ph.P(x, y)), t), name: 'Treats scattered', beat: 0, tPic: ctx.cue(0) + 0.1,
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
    const { stage, tl, cue } = ctx;
    css(stage);
    TM.head(ctx, 'Practicing your mechanics', 'Practice without your dog first');
    const col = put(stage, K.el('div', 'tm-col'), 100, 300, { width: '760px', gap: '28px' });
    [['hand', 'Treats in your hand', 1, 'hold treats', 0.05], ['volume-2', 'Mark, pause, *then into a bowl*', 1, 'pause briefly', 0.3],
     ['pause', 'Hand still *until the mark ends*', 1, 'keep your hand still', 0.7], ['repeat', 'Until it’s *consistent*', 2, 'practice until', 0.05]]
      .forEach(([ic, h, b, p, fb]) => A.in(tl, TM.row(col, ic, h), at(ctx, b, p, fb), 'fadeRight', { dur: 0.6 }));
    // three step cards at the right: each appears as it is said, then the order banner
    const STEPS = [['volume-2', 'Mark', 'Say your word', 'say your marker'], ['pause', 'Pause', 'Hand still', 'pause briefly'], ['arrow-down', 'Move', 'Treat into a bowl', 'place a treat']];
    const cards = STEPS.map(([ic, t, sub, p], i) => {
      const c = put(stage, K.el('div', 'tmc-step'), 920 + i * 310, 300);
      c.innerHTML = `<div class="n">${i + 1}</div><div class="ic"></div><div class="t">${t}</div><div class="s">${sub}</div>`;
      c.querySelector('.ic').appendChild(K.icon(ic));
      A.in(tl, c, at(ctx, 1, p, 0.2 + 0.3 * i), 'fadeUp', { dur: 0.6 });
      return c;
    });
    const tW = at(ctx, 3, 'word', 0.3);
    const bn = put(stage, K.el('div', 'tm-banner'), 920, 690, { width: '900px', boxSizing: 'border-box' });
    bn.appendChild(K.icon('circle-check')); bn.appendChild(K.el('span', null, 'Word, pause, <b>then movement</b>'));
    A.in(tl, bn, tW, 'fadeUp', { dur: 0.5 });
  });
})();
