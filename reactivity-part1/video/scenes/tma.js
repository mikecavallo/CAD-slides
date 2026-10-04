// Markers and Mechanics: welcome and Part 1 (understanding markers and food games), first half.
//   tm00intro  title slide (shared kit)
//   tm00plan   plan slide: four cards (what markers mean, food games, how to teach them, your mechanics)
//   tm01s01    what is a marker? "Yip!", the promise line, a filmstrip of a sit, the flash on the right frame, the treat
//   tm01s02    introducing food games: three game cards with animated headers, a word for each, no guessing
//   tm01s03    why food delivery matters: one row per game with its purposes; "it depends on" banner
(() => {
  const { at, put, clamp } = TM;
  const CSS = `
  .tma-film { position: absolute; height: 236px; border-radius: 18px; background: #2b2f28; box-shadow: 0 16px 36px rgba(20,30,10,0.25);
    background-image: radial-gradient(circle, #f3f8ec 5px, transparent 6px), radial-gradient(circle, #f3f8ec 5px, transparent 6px);
    background-size: 34px 20px; background-position: 6px 0, 6px 216px; background-repeat: repeat-x; }
  .tma-fr { position: absolute; top: 24px; width: 176px; height: 188px; border-radius: 10px; background: #fff; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 12px; box-sizing: border-box; border: 5px solid #fff; }
  .tma-fr svg { width: 74px; height: 74px; color: var(--ink-soft); stroke-width: 1.9; }
  .tma-fr span { font: 700 26px/1 var(--font-body); color: var(--ink-soft); white-space: nowrap; }
  .tma-fr.hit svg, .tma-fr.hit span { color: var(--green-dark); }
  .tma-flash { position: absolute; inset: 0; border-radius: 6px; background: #fff; }
  .tma-col { position: absolute; background: #fff; border-radius: 26px; border: 1px solid #e6e9e1; box-shadow: var(--shadow-soft); box-sizing: border-box; padding: 26px 28px; }
  .tma-col .stage { position: relative; height: 150px; border-radius: 18px; background: var(--green-mist); overflow: hidden; }
  .tma-col .tt { margin-top: 22px; font: 700 40px/1 var(--font-head); color: var(--ink); }
  .tma-col .wd { margin-top: 26px; height: 70px; position: relative; }
  .tma-row { position: absolute; left: 100px; width: 1720px; height: 140px; box-sizing: border-box; border-radius: 26px; background: #fff; border: 1px solid #e6e9e1;
    box-shadow: var(--shadow-soft); display: flex; align-items: center; gap: 22px; padding: 0 30px; }
  .tma-row .hd { display: flex; align-items: center; gap: 20px; width: 400px; flex: 0 0 auto; font: 700 40px/1 var(--font-head); color: var(--ink); white-space: nowrap; }
  .tma-row .hd .b { width: 84px; height: 84px; border-radius: 50%; background: var(--green); color: #fff; display: grid; place-items: center; flex: 0 0 auto; }
  .tma-row .hd .b svg { width: 44px; height: 44px; stroke-width: 2.2; }
  .tma-row .tm-word { position: relative; left: auto; top: auto; }
  `;
  const css = stage => { TM.style(stage); if (!stage.querySelector('style[data-tma]')) { const s = K.el('style', null, CSS); s.dataset.tma = '1'; stage.appendChild(s); } };
  const flow = n => { n.style.position = 'relative'; n.style.left = n.style.top = ''; return n; };

  registerScene('tm00intro', ctx => SKIT.titleSlide(ctx));

  registerScene('tm00plan', ctx => SKIT.planSlide(ctx, [
    { icon: 'volume-2', bg: 'var(--green-pale)', fg: 'var(--green-dark)', lab: 'What markers mean', text: 'One word or sound: *that earned a treat*.' },
    { icon: 'cookie', bg: 'var(--amber-pale)', fg: 'var(--amber)', lab: 'Food games', text: 'Mouth, toss, scatter: *why each one*.' },
    { icon: 'graduation-cap', bg: 'var(--green-pale)', fg: 'var(--green-dark)', lab: 'How to teach them', text: '*One marker at a time*, in short sessions.' },
    { icon: 'hand', bg: 'var(--green)', fg: '#fff', lab: 'Your mechanics', text: '*Word, pause,* then movement.' },
  ], [[], [], [], []]));

  // ---------------------------------------------------------------- what is a marker?
  registerScene('tm01s01', ctx => {
    const { stage, tl, cue, end } = ctx;
    css(stage);
    TM.head(ctx, 'Understanding markers', 'What is a marker?');
    const yip = TM.bubble(stage, 'Yip!', { x: 100, y: 296, size: 52 });
    A.in(tl, yip, at(ctx, 0, 'short word', 0.15), 'pop', { dur: 0.5 });
    const q = put(stage, K.el('div', 'tm-quote', '“That’s it! <b>What you just did earned a treat.</b>”'), 330, 300, { width: '1300px', fontSize: '50px', textAlign: 'left' });
    A.in(tl, q, at(ctx, 0, 'that’s it', 0.5), 'fadeUp', { dur: 0.7 });

    // a filmstrip of a sit; the flash lands on the frame where the bottom touches down
    const FR = [['dog', 'Standing'], ['arrow-down', 'Lowering'], ['circle-check', 'Sit!'], ['arrow-up', 'Getting up'], ['footprints', 'Wandering']];
    const film = put(stage, K.el('div', 'tma-film'), 100, 500, { width: '1000px' });
    const frs = FR.map(([ic, lab], i) => {
      const f = put(film, K.el('div', 'tma-fr'), 18 + i * 196, 24);
      f.appendChild(K.icon(ic));
      f.appendChild(K.el('span', null, lab));
      return f;
    });
    const tF = at(ctx, 1, 'snapshot', 0.4);
    tl.fromTo(film, { opacity: 0, x: 260 }, { opacity: 1, x: 0, duration: 1.4, ease: 'power2.out' }, tF);
    const sl = put(stage, K.el('div', 'tm-lab', 'A snapshot of the behavior'), 1160, 540, { fontSize: '36px', color: 'var(--green-dark)' });
    A.in(tl, sl, tF + 0.6, 'fadeUp', { dur: 0.6 });
    const hit = frs[2];
    const fl = K.el('div', 'tma-flash');
    hit.appendChild(fl);
    tl.set(fl, { opacity: 0 }, 0);
    const tS = at(ctx, 2, 'bottom touches', 0.5);
    tl.to(fl, { opacity: 1, duration: 0.08 }, tS);
    tl.to(fl, { opacity: 0, duration: 0.5 }, tS + 0.1);
    tl.to(hit, { borderColor: '#619537', scale: 1.12, y: -8, duration: 0.5, ease: 'back.out(2)', zIndex: 2 }, tS + 0.05);
    tl.call(() => hit.classList.add('hit'), null, tS + 0.05);
    tl.to(frs.filter(f => f !== hit), { opacity: 0.45, duration: 0.5 }, tS + 0.2);
    const m1 = put(stage, K.el('div', 'tm-lab', 'Bottom touches: <b style="color:var(--green)">mark it</b>'), 1160, 610, { fontSize: '36px' });
    A.in(tl, m1, tS + 0.2, 'fadeUp', { dur: 0.5 });
    const tT = at(ctx, 2, 'deliver the treat', 0.85);
    const m2 = put(stage, K.el('div', 'tm-lab', 'Then the treat'), 1220, 680, { fontSize: '36px' });
    const tr = TM.treat(stage, 1180, 700, 1.4);
    A.in(tl, m2, tT, 'fadeUp', { dur: 0.5 });
    tl.fromTo(tr, { opacity: 0, y: -80 }, { opacity: 1, y: 0, duration: 0.5, ease: 'bounce.out' }, tT + 0.1);
  });

  // ---------------------------------------------------------------- introducing food games
  registerScene('tm01s02', ctx => {
    const { stage, tl, cue, end } = ctx;
    css(stage);
    TM.head(ctx, 'Food games', 'Introducing food games');
    const sub = K.text(stage, 'Different ways to deliver <b style="color:var(--green)">the treat</b>', { x: 1000, y: 175, cls: 'lead', size: 34 });
    A.in(tl, sub, at(ctx, 0, 'food games', 0.7), 'fadeUp', { dur: 0.6 });
    const G = [['To the mouth', 'Yip', 'mouth'], ['A toss to chase', 'Chase', 'tossing'], ['A scatter', 'Scatter', 'scattering']];
    const cols = G.map(([t, w, p], i) => {
      const c = put(stage, K.el('div', 'tma-col'), 100 + i * 590, 300, { width: '540px', height: '400px' });
      const st = K.el('div', 'stage');
      c.appendChild(st);
      c.appendChild(K.el('div', 'tt', t));
      const wd = K.el('div', 'wd');
      c.appendChild(wd);
      const tc = at(ctx, 1, p, 0.2 + 0.3 * i);
      tl.fromTo(c, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, tc);
      const chip = TM.word(wd, '“' + w + '”', { variant: 'green', size: 34 });
      return { c, st, chip, tc };
    });
    // header animations
    {
      const st = cols[0].st, t0 = cols[0].tc + 0.4;
      const h = K.iconBadge(st, 'hand', { x: 60, y: 35, size: 80, variant: 'amber' });
      const m = K.iconBadge(st, 'smile', { x: 340, y: 35, size: 80, variant: 'solid' });
      const tr = TM.treat(st, 140, 75, 1.2);
      A.in(tl, [h, m], t0, 'pop', { dur: 0.4, stagger: 0.1 });
      tl.fromTo(tr, { opacity: 0 }, { opacity: 1, duration: 0.2 }, t0 + 0.4);
      tl.to(tr, { x: 190, duration: 0.8, ease: 'power2.inOut' }, t0 + 0.6);
    }
    {
      const st = cols[1].st, t0 = cols[1].tc + 0.4;
      const sv = K.svg(st, { x: 0, y: 0, w: 484, h: 150 });
      const arc = K.path(sv, 'M 60 120 C 160 0, 320 0, 420 120', { stroke: '#d9912b', 'stroke-width': 5, fill: 'none', 'stroke-dasharray': '3 12', 'stroke-linecap': 'round' });
      const tr = TM.treat(st, 60, 116, 1.2);
      A.draw(tl, arc, t0, 0.8);
      tl.fromTo(tr, { opacity: 0 }, { opacity: 1, duration: 0.2 }, t0);
      tl.to(tr, { motionPath: { path: 'M 0 0 C 100 -120, 260 -120, 360 4' }, duration: 0.9, ease: 'power1.inOut' }, t0);
    }
    {
      const st = cols[2].st, t0 = cols[2].tc + 0.4;
      [[90, 0], [170, 0.1], [240, 0.05], [310, 0.18], [390, 0.12]].forEach(([x, d], k) => {
        const tr = TM.treat(st, x, 112 - (k % 2) * 8, 1.0);
        tl.fromTo(tr, { opacity: 0, y: -90 }, { opacity: 1, y: 0, duration: 0.5, ease: 'bounce.out' }, t0 + d * 3);
      });
    }
    // a word for each game
    const tW = at(ctx, 2, 'different marker word', 0.15);
    cols.forEach((k, i) => A.in(tl, k.chip, tW + 0.3 * i, 'pop', { dur: 0.45 }));
    const pill = put(stage, K.el('div', 'tm-banner'), 0, 760);
    pill.appendChild(K.icon('volume-2'));
    pill.appendChild(K.el('span', null, 'The marker says: <b>which moment</b> + <b>which game</b>'));
    TM.centerX(pill, 960);
    A.in(tl, pill, at(ctx, 2, 'both which moment', 0.6), 'fadeUp', { dur: 0.6 });
    // no guessing
    const tN = at(ctx, 3, 'won’t have to guess', 0.45);
    tl.to(pill, { opacity: 0, duration: 0.35 }, tN - 0.3);
    const bn = put(stage, K.el('div', 'tm-banner'), 0, 760);
    bn.appendChild(K.icon('circle-check'));
    bn.appendChild(K.el('span', null, 'No guessing: <b>your hand, or the ground?</b>'));
    TM.centerX(bn, 960);
    A.in(tl, bn, tN, 'fadeUp', { dur: 0.6 });
    const cf = put(stage, K.el('div', 'tm-lab', 'Less confusion and frustration'), 0, 880, { width: '1920px', textAlign: 'center', fontSize: '30px', color: 'var(--green-dark)' });
    A.in(tl, cf, at(ctx, 3, 'confusion and frustration', 0.3), 'fadeUp', { dur: 0.5 });
  });

  // ---------------------------------------------------------------- why food delivery matters
  registerScene('tm01s03', ctx => {
    const { stage, tl, cue, end } = ctx;
    css(stage);
    TM.head(ctx, 'Each game has a purpose', 'Why food delivery matters');
    const ROWS = [
      ['To the mouth', 'smile', 1, [['Stay near you', 'stay near you'], ['Hold a position', 'maintain a position']]],
      ['Toss', 'move-up-right', 2, [['Movement', 'movement'], ['Reset for another rep', 'reset'], ['Distance from something hard', 'distance']]],
      ['Scatter', 'search', 3, [['Sniffing and searching', 'sniffing'], ['Settling, with enough space', 'settle']]],
    ];
    ROWS.forEach(([t, ic, b, chips], i) => {
      const r = put(stage, K.el('div', 'tma-row'), 100, 290 + i * 165);
      const hd = K.el('div', 'hd', `<span class="b">${K.icon(ic).outerHTML}</span><span>${t}</span>`);
      r.appendChild(hd);
      tl.fromTo(r, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' }, cue(b) + 0.05);
      chips.forEach(([w, p], k) => {
        const n = TM.word(r, w, { variant: 'pale', size: 30 });
        flow(n);
        A.in(tl, n, at(ctx, b, p, 0.35 + 0.2 * k), 'pop', { dur: 0.45 });
      });
    });
    const row = put(stage, K.el('div'), 0, 800, { position: 'absolute', width: '1920px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '18px' });
    const lab = flow(put(row, K.el('div', 'tm-lab', 'The best choice depends on:'), 0, 0, { fontSize: '34px', color: 'var(--green-dark)' }));
    A.in(tl, lab, cue(4) + 0.05, 'fadeUp', { dur: 0.5 });
    [['What we’re teaching', 'graduation-cap', 'teaching'], ['The situation', 'map-pin', 'situation'], ['Your dog’s needs', 'dog', 'needs']].forEach(([w, ic, p]) => {
      const n = flow(TM.word(row, w, { variant: 'green', icon: ic, size: 30 }));
      A.in(tl, n, at(ctx, 4, p, 0.6), 'pop', { dur: 0.45 });
    });
  });
})();
