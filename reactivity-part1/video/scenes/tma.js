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
  .tma-fr span { font: 700 26px/1.1 var(--font-body); color: var(--ink-soft); white-space: nowrap; text-align: center; }
  .tma-fr.hit svg, .tma-fr.hit span { color: var(--green-dark); }
  .tma-flash { position: absolute; inset: 0; border-radius: 6px; background: #fff; }
  .tma-col { position: absolute; background: #fff; border-radius: 26px; border: 1px solid #e6e9e1; box-shadow: var(--shadow-soft); box-sizing: border-box; padding: 26px 28px; }
  .tma-col .stage { position: relative; height: 240px; border-radius: 18px; background: var(--green-mist); overflow: hidden; }
  .tma-col .stage img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
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
    { ...SKIT.PLAN.gain, lab: 'What you’ll learn', rows: ['What markers are', 'Why we use food games', 'How to teach them'], rowIcons: ['volume-2', 'cookie', 'graduation-cap'], rowBg: 'var(--green-pale)', rowFg: 'var(--green-dark)' },
    { ...SKIT.PLAN.why, text: 'Your dog gets *clear, consistent information*.' },
  ], [
    [['what markers mean', 0.2], ['food games', 0.6], ['how to teach', 0.85]],
    [],
  ]));

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
    const FR = [['dog', 'Standing'], ['eye-off', 'Looking away'], ['circle-check', 'Sit!'], ['arrow-up', 'Getting up'], ['move-right', 'Pulling on<br>the leash']];
    const film = put(stage, K.el('div', 'tma-film'), 100, 500, { width: '1000px' });
    const frs = FR.map(([ic, lab], i) => {
      const f = put(film, K.el('div', 'tma-fr'), 18 + i * 196, 24);
      f.appendChild(K.icon(ic));
      f.appendChild(K.el('span', null, lab));
      return f;
    });
    const tF = at(ctx, 1, 'snapshot', 0.4);
    tl.fromTo(film, { opacity: 0, x: 260 }, { opacity: 1, x: 0, duration: 1.4, ease: 'power2.out' }, tF);
    const sl = put(stage, K.el('div', 'tm-lab', 'A snapshot of the behavior'), 100, 760, { fontSize: '34px', color: 'var(--green-dark)' });
    A.in(tl, sl, tF + 0.6, 'fadeUp', { dur: 0.6 });
    // the green dog stands, sits, and the mark lands as the bottom touches the ground
    const sv = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const D = TM.sitDog(sv, 1440, 620, 0.78);
    A.in(tl, D.stand.outer, tF + 0.3, 'fade', { dur: 0.6 });
    const hit = frs[2];
    const fl = K.el('div', 'tma-flash');
    hit.appendChild(fl);
    tl.set(fl, { opacity: 0 }, 0);
    const tS = at(ctx, 2, 'bottom touches', 0.5);
    D.sitAt(tl, tS - 0.15);
    tl.to(fl, { opacity: 1, duration: 0.08 }, tS + 0.25);
    tl.to(fl, { opacity: 0, duration: 0.5 }, tS + 0.35);
    tl.to(hit, { borderColor: '#619537', scale: 1.12, y: -8, duration: 0.5, ease: 'back.out(2)', zIndex: 2 }, tS + 0.3);
    tl.call(() => hit.classList.add('hit'), null, tS + 0.3);
    tl.to(frs.filter(f => f !== hit), { opacity: 0.45, duration: 0.5 }, tS + 0.45);
    const mk = TM.bubble(stage, 'Yip!', { x: 1500, y: 400, size: 44 });
    A.in(tl, mk, tS + 0.25, 'pop', { dur: 0.4 });
    const cap = put(stage, K.el('div', 'tm-lab', 'Bottom touches: <b style="color:var(--green)">mark</b>, then the treat'), 1170, 800, { fontSize: '32px' });
    A.in(tl, cap, tS + 0.6, 'fadeUp', { dur: 0.5 });
    const tT = at(ctx, 2, 'deliver the treat', 0.85);
    const tr = TM.treat(stage, D.mouth[0] + 30, D.mouth[1] + 60, 1.3);
    tl.fromTo(tr, { opacity: 0, x: 90, y: 20 }, { opacity: 1, x: 0, y: 0, duration: 0.5, ease: 'power2.out' }, tT);
  });

  // ---------------------------------------------------------------- introducing food games
  registerScene('tm01s02', ctx => {
    const { stage, tl, cue, end } = ctx;
    css(stage);
    TM.head(ctx, 'Food games', 'Introducing food games');
    const sub = K.text(stage, 'Different ways to deliver <b style="color:var(--green)">the treat</b>', { x: 1000, y: 175, cls: 'lead', size: 34 });
    A.in(tl, sub, at(ctx, 0, 'food games', 0.7), 'fadeUp', { dur: 0.6 });
    // Tori's pictures, shown whole at one height, labelled underneath
    const H = 400;
    const G = [['To the mouth', 'mouth', 'tm_mouth_3.jpg', 524 / 828], ['A toss to chase', 'tossing', 'tm_toss.jpg', 1468 / 968], ['A scatter', 'scattering', 'tm_scatter.jpg', 1466 / 962]];
    const ws = G.map(g => Math.round(H * g[3])), GAP = 60;
    let x = (1920 - ws.reduce((a, b) => a + b, 0) - GAP * 2) / 2;
    // as each game is named its picture lifts into focus and a quick overlay shows where the treat goes:
    // a ring at the hand and mouth, a low path skimming along the floor, treats dropping to the ground
    const B = 8, cards = [];
    G.forEach(([t, p, src], i) => {
      const w = ws[i];
      const wrap = put(stage, K.el('div'), x, 300, { position: 'absolute', width: w + 'px', height: H + 'px', transformOrigin: '50% 60%' });
      const ph = K.photo(wrap, src, { x: 0, y: 0, w, h: H, radius: 20 });
      ph.root.style.border = B + 'px solid #fff';
      const sv = K.svg(wrap, { x: 0, y: 0, w, h: H });
      sv.style.overflow = 'visible';
      const P = (nx, ny) => [B + nx * (w - 2 * B), B + ny * (H - 2 * B)];
      const lab = put(stage, K.el('div', 'tm-lab', t), x, 726, { fontSize: '38px', fontFamily: 'var(--font-head)', width: w + 'px', textAlign: 'center' });
      const tc = at(ctx, 1, p, 0.2 + 0.3 * i);
      A.in(tl, wrap, tc, 'fadeUp', { dur: 0.7 });
      A.in(tl, lab, tc + 0.25, 'fadeUp', { dur: 0.5 });
      cards.push({ wrap, lab, sv, P, tc, w, x });
      x += w + GAP;
    });
    const ring = (sv, [cx, cy], t, n = 2, r = 20) => {
      const g = K.group(sv);
      K.circle(g, cx, cy, r, { fill: 'none', stroke: '#fff', 'stroke-width': 8 });
      K.circle(g, cx, cy, r, { fill: 'none', stroke: 'var(--green)', 'stroke-width': 4 });
      tl.set(g, { opacity: 0 }, 0);
      tl.fromTo(g, { opacity: 1, scale: 0.5, svgOrigin: `${cx} ${cy}` }, { keyframes: [{ opacity: 1, scale: 1.1, duration: 0.45, ease: 'power2.out' }, { opacity: 0, scale: 1.5, duration: 0.45, ease: 'power1.in' }], svgOrigin: `${cx} ${cy}`, repeat: n - 1, immediateRender: false }, t);
    };
    const dot = (sv, [cx, cy], r = 6) => K.circle(sv, cx, cy, r, { fill: '#c98a45', stroke: '#fff', 'stroke-width': 2.5 });
    const fx = cards.map(c => c.tc + 0.75);
    // to the mouth: the treat goes from the hand straight to the mouth
    ring(cards[0].sv, cards[0].P(0.454, 0.457), fx[0]);
    // a toss: the treat skims low along the floor from her feet to where it lands, leaving a dotted trail
    {
      const c = cards[1], a = c.P(0.27, 0.80), e = c.P(0.945, 0.84), N = 16;
      const tr = dot(c.sv, a, 7);
      tl.set(tr, { opacity: 0 }, 0);
      for (let k = 1; k < N; k++) {
        const u = k / N, px = a[0] + (e[0] - a[0]) * u, py = a[1] + (e[1] - a[1]) * u;
        const d = K.circle(c.sv, px, py, 3.2, { fill: '#fff', opacity: 0.95 });
        tl.set(d, { opacity: 0 }, 0);
                tl.to(d, { opacity: 0.95, duration: 0.08 }, fx[1] + 0.9 * (1 - Math.sqrt(1 - u)));
        tl.to(d, { opacity: 0, duration: 0.5 }, fx[1] + 2.2 + u * 0.3);
      }
      tl.set(tr, { opacity: 1 }, fx[1]);
      tl.to(tr, { x: e[0] - a[0], y: e[1] - a[1], duration: 0.9, ease: 'power2.out' }, fx[1]);
      tl.to(tr, { y: '-=6', duration: 0.11, ease: 'sine.out', yoyo: true, repeat: 3 }, fx[1]);
      tl.to(tr, { opacity: 0, duration: 0.2 }, fx[1] + 0.95);
      ring(c.sv, e, fx[1] + 0.85, 1);
    }
    // a scatter: a few treats drop from the hand to the ground, each lands with a small ring
    {
      const c = cards[2], h = c.P(0.33, 0.6);
      [[0.405, 0.875], [0.44, 0.865], [0.47, 0.885], [0.50, 0.87], [0.525, 0.88]].forEach(([nx, ny], k) => {
        const e = c.P(nx, ny), t = fx[2] + k * 0.09;
        const tr = dot(c.sv, [0, 0], 6);
        tl.set(tr, { opacity: 0 }, 0);
        tl.set(tr, { opacity: 1 }, t);
        tl.fromTo(tr, { x: h[0], y: h[1] }, { x: e[0], y: e[1], duration: 0.5, ease: 'power2.in', immediateRender: false }, t);
        tl.to(tr, { opacity: 0, duration: 0.25 }, t + 0.8);
        ring(c.sv, e, t + 0.45, 1, 13);
      });
    }
    // focus: the picture being named lifts, the others soften; all come back once the three are named
    cards.forEach((c, i) => {
      tl.fromTo(c.wrap, { scale: 1 }, { scale: 1.045, duration: 0.5, ease: 'power2.out', immediateRender: false }, fx[i] - 0.2);
      cards.filter((_, k) => k !== i && cards[k].tc < c.tc).forEach(o => tl.to(o.wrap, { opacity: 0.55, scale: 1, duration: 0.4 }, fx[i] - 0.2));
    });
    const tAll = Math.max(fx[2] + 1.6, end(1) - 0.4);
    tl.to(cards.map(c => c.wrap), { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }, tAll);
    // "your hand, or the ground?": tags on the pictures as they are said
    const tag = (c, text, t) => {
      const n = put(stage, K.el('div', 'tm-word green', K.md(text)), 0, 240, { fontSize: '26px', padding: '10px 22px' });
      TM.centerX(n, c.x + c.w / 2);
      A.in(tl, n, t, 'pop', { dur: 0.45 });
    };
    const tH = at(ctx, 3, 'your hand', 0.75), tG = at(ctx, 3, 'on the ground', 0.92);
    tag(cards[0], 'Your hand', tH);
    tag(cards[1], 'The ground', tG);
    tag(cards[2], 'The ground', tG + 0.12);
    const pill = put(stage, K.el('div', 'tm-banner'), 0, 815);
    pill.appendChild(K.icon('volume-2'));
    pill.appendChild(K.el('span', null, 'Each game has its own marker: <b>which moment</b> + <b>which game</b>'));
    TM.centerX(pill, 960);
    A.in(tl, pill, at(ctx, 2, 'different marker word', 0.15), 'fadeUp', { dur: 0.6 });
    const tN = at(ctx, 3, 'won’t have to guess', 0.45);
    tl.to(pill, { opacity: 0, duration: 0.35 }, tN - 0.3);
    const bn = put(stage, K.el('div', 'tm-banner'), 0, 815);
    bn.appendChild(K.icon('circle-check'));
    bn.appendChild(K.el('span', null, 'No guessing: <b>your hand, or the ground?</b>'));
    TM.centerX(bn, 960);
    A.in(tl, bn, tN, 'fadeUp', { dur: 0.6 });
  });

  // ---------------------------------------------------------------- why food delivery matters
  registerScene('tm01s03', ctx => {
    const { stage, tl, cue, end } = ctx;
    css(stage);
    TM.head(ctx, 'Each game has a purpose', 'Why food delivery matters');
    const ROWS = [
      ['To the mouth', 'dog', 1, [['Stay near you', 'stay near you'], ['Hold a position', 'maintain a position']]],
      ['Toss', 'move-right', 2, [['Movement', 'movement'], ['Reset for another rep', 'reset'], ['Distance from something hard', 'distance']]],
      ['Scatter', 'search', 3, [['Sniffing and searching', 'sniffing']]],
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
