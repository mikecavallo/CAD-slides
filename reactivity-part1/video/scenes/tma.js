// Markers and Mechanics: welcome and Part 1 (understanding markers and food games), first half.
//   tm00intro  title slide (shared kit)
//   tm00plan   plan slide: four cards (what markers mean, food games, how to teach them, your mechanics)
//   tm01s01    what is a marker? "Yip!", the promise line, a filmstrip of a sit, the flash on the right frame, the treat
//   tm01s02    introducing food games: three game cards with animated headers, a word for each, no guessing
//   tm01s03    why food delivery matters: three cards, each a small live scene of its game (hand to the mouth, a toss the dog chases, a scatter it sniffs out)
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
  .tma-game { position: absolute; height: 562px; background: #fff; border-radius: 28px; border: 1px solid #e6e9e1; box-shadow: var(--shadow); box-sizing: border-box; padding: 22px; transform-origin: 50% 60%; }
  .tma-game .stg { position: relative; height: 250px; border-radius: 18px; background: linear-gradient(180deg, #f6faf0, #e9f2dd); overflow: hidden; }
  .tma-game .stg .svgfill { position: absolute; left: 0; top: 0; }
  .tma-game .tt { margin-top: 22px; font: 700 40px/1 var(--font-head); color: var(--ink); }
  .tma-game .wd { margin-top: 18px; display: flex; flex-wrap: wrap; gap: 10px 12px; }
  .tma-game .wd .tm-word { position: relative; left: auto; top: auto; }
  .tma-game .alert { position: absolute; width: 68px; height: 68px; border-radius: 50%; background: var(--amber-pale); color: #b06d12; display: grid; place-items: center; }
  .tma-game .alert svg { width: 38px; height: 38px; stroke-width: 2.3; }
  .tma-game .gaplab { position: absolute; font: 700 22px/1 var(--font-body); color: #b06d12; white-space: nowrap; }
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
    G.forEach(([t, p, src], i) => {
      const ph = K.photo(stage, src, { x, y: 300, w: ws[i], h: H, radius: 20 });
      ph.root.style.border = '8px solid #fff';
      const lab = put(stage, K.el('div', 'tm-lab', t), x, 726, { fontSize: '38px', fontFamily: 'var(--font-head)', width: ws[i] + 'px', textAlign: 'center' });
      const tc = at(ctx, 1, p, 0.2 + 0.3 * i);
      A.in(tl, ph.root, tc, 'fadeUp', { dur: 0.7 });
      A.in(tl, lab, tc + 0.25, 'fadeUp', { dur: 0.5 });
      x += ws[i] + GAP;
    });
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
    const { stage, tl, cue, end, dur } = ctx;
    css(stage);
    TM.head(ctx, 'Each game has a purpose', 'Why food delivery matters');
    // three cards, each a small live scene of its game; the card being talked about is lit, the others rest dimmed
    const GAMES = [
      ['To the mouth', 1, [['Stay near you', 'stay near you'], ['Hold a position', 'maintain a position']]],
      ['Toss', 2, [['Movement', 'movement'], ['Reset for another rep', 'reset'], ['Distance from something hard', 'distance']]],
      ['Scatter', 3, [['Sniffing and searching', 'sniffing']]],
    ];
    const CW = 553, SW = 509, SH = 250, GROUND = 222, S = 0.5;
    const JACKET = '#6b7078', SKIN = '#e2b48f';
    const cards = GAMES.map(([t, b, chips], i) => {
      const c = put(stage, K.el('div', 'tma-game'), 100 + i * (CW + 30), 282, { width: CW + 'px' });
      const sc = K.el('div', 'stg'); c.appendChild(sc);
      const sv = K.svg(sc, { x: 0, y: 0, w: SW, h: SH });
      K.line(sv, 18, GROUND + 4, SW - 18, GROUND + 4, { stroke: '#d6e5c4', 'stroke-width': 3 });
      c.appendChild(K.el('div', 'tt', t));
      const wd = K.el('div', 'wd'); c.appendChild(wd);
      const ws = chips.map(([w, ph], k) => {
        const n = flow(TM.word(wd, w, { variant: 'pale', size: 26 }));
        A.in(tl, n, at(ctx, b, ph, 0.35 + 0.2 * k), 'pop', { dur: 0.45 });
        return n;
      });
      tl.fromTo(c, { opacity: 0, y: 46 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, cue(b) - 0.05);
      return { c, sc, sv, b };
    });
    // focus: the current card is lit, the earlier ones dim; all come back for the closing line
    cards.forEach((k, i) => {
      cards.slice(0, i).forEach(p => tl.to(p.c, { opacity: 0.42, scale: 0.97, duration: 0.5, ease: 'power2.out' }, cue(k.b) - 0.05));
      tl.to(k.c, { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }, cue(4));
    });
    tl.fromTo(cards[0].c, { scale: 1 }, { scale: 1, duration: 0.01 }, 0);

    const legs = D => { const [, fh, ff, , nh, nf] = D.fig.children; return [fh, ff, nh, nf]; };
    const trot = (D, t, d, a = 18, per = 0.2) => {
      const n = Math.max(1, Math.round(d / per));
      legs(D).forEach((el, k) => tl.fromTo(el, { rotation: (k === 0 || k === 3) ? -a : a, transformOrigin: '50% 4%' },
        { rotation: (k === 0 || k === 3) ? a : -a, transformOrigin: '50% 4%', duration: per / 2, ease: 'sine.inOut', yoyo: true, repeat: 2 * n - 1, immediateRender: false }, t));
    };
    // a hand with a treat, its fingertips at (0, 0), reaching in from the right
    const hand = sv => {
      const g = K.group(sv);
      const r = K.group(g, { transform: 'rotate(-14)' });
      K.path(r, 'M 92 -4 L 420 -10', { stroke: JACKET, 'stroke-width': 40, fill: 'none', 'stroke-linecap': 'round' });
      K.path(r, 'M 84 -4 L 98 -4', { stroke: '#555a61', 'stroke-width': 44, fill: 'none', 'stroke-linecap': 'butt' });
      K.path(r, 'M 30 -2 L 84 -4', { stroke: SKIN, 'stroke-width': 30, fill: 'none', 'stroke-linecap': 'round' });
      K.svgEl('ellipse', { cx: 26, cy: -1, rx: 22, ry: 18, fill: SKIN }, r);
      K.svgEl('ellipse', { cx: 9, cy: 7, rx: 15, ry: 8, fill: '#d6a47d' }, r);
      K.svgEl('ellipse', { cx: 12, cy: -11, rx: 14, ry: 7, fill: SKIN, transform: 'rotate(-18 12 -11)' }, r);
      const tr = K.svgEl('ellipse', { cx: -4, cy: -2, rx: 11, ry: 8, fill: '#b9773a' }, r);
      return { g, tr };
    };
    const deliver = (H, mx, my, t) => {
      tl.set(H.tr, { opacity: 1 }, t - 0.01);
      tl.fromTo(H.g, { x: mx + 300, y: my - 70 }, { x: mx + 4, y: my, duration: 0.5, ease: 'power2.out', immediateRender: false }, t);
      tl.to(H.tr, { opacity: 0, duration: 0.12 }, t + 0.62);
      tl.to(H.g, { x: mx + 300, y: my - 70, duration: 0.5, ease: 'power2.in' }, t + 0.8);
    };

    // 1. to the mouth: the hand brings the treat right to the dog's mouth; on "position" the dog sits and gets another
    {
      const { sv } = cards[0], cx = 190, cy = GROUND - 129 * S;
      const D = TM.sitDog(sv, cx, cy, S);
      const mS = [cx - 222 * S + 396 * S, cy - 168 * S + 94 * S];
      const H = hand(sv); tl.set(H.g, { x: 900, y: 0 }, 0);
      const tStay = at(ctx, 1, 'stay near', 0.3), tPos = at(ctx, 1, 'maintain', 0.6);
      deliver(H, mS[0], mS[1], tStay);
      C2.wag(tl, D.stand, tStay + 0.6, tPos);
      D.sitAt(tl, tPos);
      deliver(H, D.mouth[0], D.mouth[1] - 6, tPos + 0.5);
    }

    // 2. toss: a low toss skims away, the dog runs after it, trots back to reset; then a toss away from something hard
    {
      const { sv, sc } = cards[1], cx = 150, cy = GROUND - 129 * S;
      const wrap = K.group(sv);
      const D = C2.dog(wrap, cx, cy, S);
      const frontX = cx - 222 * S + 400 * S;
      const tMove = at(ctx, 2, 'movement', 0.2), tReset = at(ctx, 2, 'reset', 0.45), tDist = at(ctx, 2, 'distance', 0.8);
      const toss = (t, dx) => {
        const tr = TM.treat(sc, frontX + 18, GROUND - 6, 0.7);
        tl.set(tr, { opacity: 0 }, 0);
        const tE = TM.lowToss(tl, tr, dx, t, 0.8);
        tl.to(tr, { opacity: 0, duration: 0.15 }, tE + 0.5);
        return tE;
      };
      toss(tMove, 200);
      tl.to(wrap, { x: 190, duration: 0.95, ease: 'power1.inOut' }, tMove + 0.2);
      trot(D, tMove + 0.2, 0.95, 22, 0.19);
      // turn, trot back to the start, turn again: ready for another rep
      tl.to(wrap, { scaleX: -1, transformOrigin: '50% 50%', duration: 0.25, ease: 'power2.inOut' }, tReset);
      tl.to(wrap, { x: 0, duration: 1.1, ease: 'power1.inOut' }, tReset + 0.2);
      trot(D, tReset + 0.2, 1.1, 16, 0.24);
      tl.to(wrap, { scaleX: 1, transformOrigin: '50% 50%', duration: 0.25, ease: 'power2.inOut' }, tReset + 1.35);
      // something hard appears at the left; the next toss takes the dog away from it
      const al = put(sc, K.el('div', 'alert'), 14, 26);
      al.appendChild(K.icon('triangle-alert'));
      A.in(tl, al, tDist - 0.2, 'pop', { dur: 0.45 });
      toss(tDist + 0.3, 200);
      tl.to(wrap, { x: 230, duration: 1.05, ease: 'power1.inOut' }, tDist + 0.5);
      trot(D, tDist + 0.5, 1.05, 22, 0.19);
      const gap = K.line(sv, 92, 60, 300, 60, { stroke: '#d9912b', 'stroke-width': 4, 'stroke-dasharray': '10 9' });
      tl.fromTo(gap, { attr: { x2: 92 } }, { attr: { x2: 300 }, duration: 1.05, ease: 'power1.inOut' }, tDist + 0.5);
      const gl = put(sc, K.el('div', 'gaplab', 'More distance'), 104, 76);
      A.in(tl, gl, tDist + 1.3, 'fadeUp', { dur: 0.4 });
      C2.wag(tl, D, tDist + 1.6, dur);
    }

    // 3. scatter: treats rain down across the ground; the dog drops its nose and sniffs its way along them
    {
      const { sv, sc } = cards[2], cx = 120, cy = GROUND - 129 * S;
      const wrap = K.group(sv);
      const D = C2.dog(wrap, cx, cy, S);
      const t3 = cue(3) + 0.1;
      const XS = [236, 268, 300, 334, 366, 398, 432];
      const walkT = t3 + 0.9, walkD = Math.max(2, dur - 0.7 - walkT), walkX = 230;
      const nose0 = cx - 222 * S + 398 * S;
      XS.forEach((x, k) => {
        const tr = TM.treat(sc, x, GROUND - 5 - (k % 2) * 4, 0.55);
        tl.fromTo(tr, { opacity: 0, y: -200 - (k % 3) * 30, rotation: -90 }, { opacity: 1, y: 0, rotation: 0, duration: 0.6, ease: 'bounce.out' }, t3 + k * 0.06);
        const tGone = walkT + Math.max(0, (x - nose0 - 6) / walkX) * walkD;
        if (tGone < dur - 0.6) tl.to(tr, { opacity: 0, scale: 0.4, duration: 0.15 }, tGone);
      });
      tl.to(D.head, { rotation: 78, svgOrigin: '300 172', duration: 0.6, ease: 'power2.inOut' }, t3 + 0.45);
      tl.to(D.head, { rotation: 70, svgOrigin: '300 172', duration: 0.35, ease: 'sine.inOut', yoyo: true, repeat: Math.max(1, Math.floor(walkD / 0.35)) }, walkT);
      tl.to(wrap, { x: walkX, duration: walkD, ease: 'none' }, walkT);
      trot(D, walkT, walkD, 9, 0.5);
      C2.wag(tl, D, walkT, dur, 0.3);
    }

    const row = put(stage, K.el('div'), 0, 874, { position: 'absolute', width: '1920px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '18px' });
    const lab = flow(put(row, K.el('div', 'tm-lab', 'The best choice depends on:'), 0, 0, { fontSize: '34px', color: 'var(--green-dark)' }));
    A.in(tl, lab, cue(4) + 0.05, 'fadeUp', { dur: 0.5 });
    [['What we’re teaching', 'graduation-cap', 'teaching'], ['The situation', 'map-pin', 'situation'], ['Your dog’s needs', 'dog', 'needs']].forEach(([w, ic, p]) => {
      const n = flow(TM.word(row, w, { variant: 'green', icon: ic, size: 30 }));
      A.in(tl, n, at(ctx, 4, p, 0.6), 'pop', { dur: 0.45 });
    });
  });
})();
