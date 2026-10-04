// Your Training Mechanics, Part 2: where the treats go.
//   tm02card  Part 2 card; a treat hops between three landing spots; what placement can do (Reset, Calm, Move, Keep them with you)
//   tm02s01   tell your dog where to look (Tori's LSM clip): "where's my treat?", each word gets its own spot
//   tm02s02   why we use LSMs: guessing builds frustration, the word sends the dog straight there; three cards; the hard-moment banner
(() => {
  const { at, put, clamp } = TM;
  const CSS = `
  .tmd-meter { position: absolute; width: 56px; border-radius: 28px; background: #eef1ea; overflow: hidden; border: 3px solid #e3e7dd; box-sizing: border-box; }
  .tmd-meter i { position: absolute; left: 0; right: 0; bottom: 0; height: 100%; transform-origin: bottom center; background: var(--amber); }
  .tmd-spot { position: absolute; display: flex; flex-direction: column; align-items: center; gap: 12px; font: 700 28px/1 var(--font-body); color: var(--ink-soft); white-space: nowrap; }
  .tmd-spot .b { width: 110px; height: 110px; border-radius: 50%; background: #fff; border: 4px solid var(--line); display: grid; place-items: center; color: var(--ink-soft); }
  .tmd-spot .b svg { width: 56px; height: 56px; stroke-width: 2; }
  .tmd-q { position: absolute; font: 800 70px/1 var(--font-head); color: var(--amber); }
  .tmd-card { position: absolute; background: #fff; border-radius: 26px; border: 1px solid #e6e9e1; box-shadow: var(--shadow-soft); padding: 28px 30px; box-sizing: border-box; }
  .tmd-card .hd { display: flex; align-items: center; gap: 18px; font: 700 38px/1 var(--font-head); color: var(--ink); }
  .tmd-card .hd .n { width: 56px; height: 56px; border-radius: 50%; background: var(--green); color: #fff; display: grid; place-items: center; font-size: 30px; flex: 0 0 auto; }
  .tmd-card .bd { margin-top: 16px; font: 500 29px/1.35 var(--font-body); color: var(--ink-soft); }
  .tmd-card .bd b { color: var(--green-dark); }
  `;
  const css = stage => { TM.style(stage); if (!stage.querySelector('style[data-tmd]')) { const s = K.el('style', null, CSS); s.dataset.tmd = '1'; stage.appendChild(s); } };

  const spot = (parent, x, y, icon, label) => {
    const s = put(parent, K.el('div', 'tmd-spot'), x, y);
    const b = K.el('div', 'b');
    b.appendChild(K.icon(icon));
    s.appendChild(b);
    if (label) s.appendChild(K.el('span', null, label));
    TM.centerX(s, x);
    return s;
  };

  // ---------------------------------------------------------------- Part 2 card
  registerScene('tm02card', ctx => {
    const { stage, tl, cue, end } = ctx;
    css(stage);
    TM.partCard(ctx, 2, 'Where the treats go');
    // three landing spots at right; the treat hops between them
    const S = [[1250, 'hand', 'To your hand'], [1470, 'circle-dot', 'Ground'], [1690, 'move-up-right', 'Tossed']];
    const sp = S.map(([x, ic, l]) => spot(stage, x, 300, ic, l));
    A.in(tl, sp, cue(0) + 0.6, 'pop', { dur: 0.5, stagger: 0.12 });
    const tr = TM.treat(stage, S[0][0], 270, 1.6);
    const t0 = cue(0) + 1.2;
    tl.fromTo(tr, { opacity: 0, y: -60 }, { opacity: 1, y: 0, duration: 0.5, ease: 'bounce.out' }, t0);
    let t = t0 + 0.9;
    for (let k = 1; k < 6 && t < end(1) - 1; k++) {
      const x = S[k % 3][0] - S[0][0];
      tl.to(tr, { x, duration: 0.7, ease: 'power1.inOut' }, t);
      tl.to(tr, { y: -70, duration: 0.35, ease: 'power2.out', yoyo: true, repeat: 1 }, t);
      t += 1.6;
    }
    // what placement can do
    const row = put(stage, K.el('div'), 160, 800, { position: 'absolute', display: 'flex', gap: '22px' });
    [['Reset', 'refresh-cw', 'reset them'], ['Calm', 'leaf', 'calm them'], ['Move', 'footprints', 'move them'], ['Keep them with you', 'hand-heart', 'right with you']].forEach(([w, ic, p]) => {
      const n = TM.word(row, w, { variant: 'pale', icon: ic, size: 32 });
      n.style.position = 'relative'; n.style.left = n.style.top = '';
      A.in(tl, n, at(ctx, 1, p, 0.5), 'pop', { dur: 0.45 });
    });
    const on = put(stage, K.el('div', 'tm-lab', 'Pick the placement <b style="color:var(--green)">on purpose</b>'), 1250, 520, { fontSize: '36px' });
    A.in(tl, on, at(ctx, 1, 'on purpose', 0.9), 'fadeUp', { dur: 0.6 });
  });

  // ---------------------------------------------------------------- tell your dog where to look
  registerScene('tm02s01', ctx => {
    const { stage, tl, cue, end } = ctx;
    css(stage);
    TM.head(ctx, 'A second kind of marker', 'Tell your dog where to look', { size: 64 });
    TM.videoFrame(ctx);
    // where's my treat?
    const dg = K.iconBadge(stage, 'dog', { x: 100, y: 300, size: 110 });
    const dsv = dg.querySelector('svg');
    const ask = TM.bubble(stage, 'Where’s my treat?', { x: 240, y: 300, size: 34 });
    ask.classList.add('right');
    ask.style.color = 'var(--ink)';
    A.in(tl, dg, cue(0) + 0.5, 'pop', { dur: 0.5 });
    A.in(tl, ask, at(ctx, 0, 'where', 0.6), 'pop', { dur: 0.45 });
    const tLook = at(ctx, 0, 'wondering', 0.4);
    tl.to(dsv, { scaleX: -1, duration: 0.15, yoyo: true, repeat: 3, repeatDelay: 0.35 }, tLook);
    // the word tells them
    const lead = K.text(stage, 'Each word tells your dog <b style="color:var(--green)">where to look</b>.', { x: 100, y: 470, w: 740, cls: 'lead', size: 36 });
    A.in(tl, lead, at(ctx, 1, 'the word tells', 0.3), 'fadeUp', { dur: 0.6 });
    tl.to([dg, ask], { opacity: 0.4, duration: 0.5 }, cue(1));
    const lsm = TM.word(stage, 'LSM', { x: 100, y: 540, variant: 'green', size: 28, icon: 'map-pin' });
    lsm.style.top = '';
    const lsmT = at(ctx, 1, 'we call these', 0.9);
    tl.call(() => {}, null, 0);
    // two cue rows
    const cueRow = (y, w, icon, dest, beat, p1, p2) => {
      const ch = TM.word(stage, '“' + w + '”', { x: 100, y, variant: 'green', size: 34 });
      const ar = K.iconBadge(stage, 'arrow-right', { x: 330, y: y + 4, size: 60 });
      const ds = TM.word(stage, dest, { x: 420, y, variant: 'pale', size: 32, icon });
      A.in(tl, ch, at(ctx, beat, p1, 0.2), 'pop', { dur: 0.45 });
      A.in(tl, ar, at(ctx, beat, p2, 0.6) - 0.15, 'fadeRight', { dur: 0.4 });
      A.in(tl, ds, at(ctx, beat, p2, 0.6), 'fadeRight', { dur: 0.5 });
      return [ch, ar, ds];
    };
    cueRow(690, 'Treat', 'smile', 'To his mouth', 2, 'treat', 'mouth');
    cueRow(810, 'Get it', 'arrow-down-to-line', 'On the ground', 3, 'get it', 'ground');
    // LSM tag beside the lead
    lsm.style.top = '556px';
    A.in(tl, lsm, lsmT, 'pop', { dur: 0.45 });
  });

  // ---------------------------------------------------------------- why we use LSMs
  registerScene('tm02s02', ctx => {
    const { stage, tl, cue, end } = ctx;
    css(stage);
    TM.head(ctx, 'The payoff', 'Why we use LSMs');

    // guessing vignette
    const panel = put(stage, K.el('div', 'tm-panel'), 100, 290, { width: '1720px', height: '300px' });
    A.in(tl, panel, cue(0) + 0.2, 'fadeUp', { dur: 0.6 });
    const dg = K.iconBadge(stage, 'dog', { x: 180, y: 360, size: 140 });
    A.in(tl, dg, cue(0) + 0.4, 'pop', { dur: 0.5 });
    const SP = [[720, 'hand', 'Your hand?'], [1010, 'arrow-down-to-line', 'The floor?'], [1300, 'briefcase', 'Your pocket?']];
    const sps = SP.map(([x, ic, l]) => spot(stage, x, 330, ic, l));
    A.in(tl, sps, cue(0) + 0.6, 'fadeUp', { dur: 0.5, stagger: 0.1 });
    const q = put(stage, K.el('div', 'tmd-q', '?'), SP[0][0] - 18, 300);
    tl.set(q, { opacity: 0 }, 0);
    const tg = at(ctx, 0, 'guess', 0.2);
    tl.set(q, { opacity: 1 }, tg);
    let t = tg;
    for (let k = 1; k < 7 && t < end(0) - 0.4; k++) {
      tl.to(q, { x: SP[k % 3][0] - SP[0][0], duration: 0.3, ease: 'power2.inOut' }, t + 0.5);
      tl.to(q, { y: -24, duration: 0.15, yoyo: true, repeat: 1 }, t + 0.5);
      t += 0.6;
    }
    // frustration meter
    const mt = put(stage, K.el('div', 'tmd-meter'), 1640, 320, { height: '230px' });
    const mf = K.el('i');
    mt.appendChild(mf);
    const ml = put(stage, K.el('div', 'tm-lab', 'Frustration'), 1520, 556, { fontSize: '26px', color: 'var(--amber)', width: '300px', textAlign: 'center' });
    A.in(tl, [mt, ml], cue(0) + 0.8, 'fadeUp', { dur: 0.5 });
    tl.fromTo(mf, { scaleY: 0.05 }, { scaleY: 0.9, duration: Math.max(1, end(0) - tg), ease: 'power1.in' }, tg);
    tl.to(mf, { backgroundColor: '#b8452d', duration: 0.8 }, at(ctx, 0, 'frustrated', 0.6));
    // the word: straight to the floor
    const wd = TM.word(stage, '“Get it”', { x: 360, y: 300, variant: 'green', size: 32 });
    const tW = at(ctx, 1, 'guesswork', 0.2);
    tl.to(q, { opacity: 0, duration: 0.3 }, tW - 0.1);
    A.in(tl, wd, tW, 'pop', { dur: 0.45 });
    const sv = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const path = K.path(sv, 'M 330 470 C 520 570, 800 560, 950 445', { stroke: '#619537', 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round' });
    const head = K.path(sv, 'M 924 438 L 952 444 L 940 470', { stroke: '#619537', 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
    const tA = at(ctx, 1, 'where to go', 0.4);
    A.draw(tl, path, tA, 0.7);
    A.in(tl, head, tA + 0.6, 'fade', { dur: 0.2 });
    tl.to(sps[1].querySelector('.b'), { borderColor: '#619537', color: '#619537', duration: 0.4 }, tA + 0.6);
    tl.to([sps[0], sps[2]], { opacity: 0.0, duration: 0.4 }, tA + 0.6);
    tl.to(sps[1].querySelector('span'), { opacity: 0, duration: 0.3 }, tA + 0.6);
    const tr = TM.treat(stage, 1010, 462, 1.5);
    tl.fromTo(tr, { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: 0.45, ease: 'bounce.out' }, tA + 0.8);
    tl.to(mf, { scaleY: 0.15, backgroundColor: '#619537', duration: 1.0, ease: 'power2.out' }, at(ctx, 1, 'relaxed', 0.6));
    tl.to(ml, { color: '#3f6b22', duration: 0.5 }, at(ctx, 1, 'relaxed', 0.6));
    const rl = put(stage, K.el('div', 'tm-lab', 'Relaxed, still thinking'), 1110, 500, { fontSize: '30px', color: 'var(--green-dark)' });
    A.in(tl, rl, at(ctx, 1, 'relaxed', 0.65), 'fadeUp', { dur: 0.5 });

    // three cards
    const CARDS = [
      ['Clarity', 'One word, *one place*. No searching hands or floor.', 2, 'clarity'],
      ['Less frustration', 'No guessing, no stress build-up. *A calm dog keeps working.*', 3, 'less frustration'],
      ['Each does a job', '*Hand:* stays with you. *Ground:* calms. *Toss:* resets.', 4, 'each placement'],
    ];
    const cards = CARDS.map(([t, b, beat, p], i) => {
      const c = put(stage, K.el('div', 'tmd-card'), 100 + i * 590, 625, { width: '540px', height: '300px' });
      const hd = K.el('div', 'hd', `<span class="n">${i + 1}</span><span>${t}</span>`);
      c.appendChild(hd);
      c.appendChild(K.el('div', 'bd', K.md(b)));
      tl.fromTo(c, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, at(ctx, beat, p, 0.05));
      return c;
    });
    // in a hard moment: the banner takes the vignette's place
    const tB = at(ctx, 5, 'hard moment', 0.1);
    tl.to([panel, dg, ...sps, mt, ml, wd, path, head, tr, rl], { opacity: 0, duration: 0.5 }, tB - 0.2);
    const bn = put(stage, K.el('div', 'tm-banner'), 0, 390, { fontSize: '42px', padding: '30px 46px' });
    bn.appendChild(K.icon('heart-handshake'));
    bn.appendChild(K.el('span', null, 'In a hard moment, one word sends them <b>straight to the food</b>.'));
    TM.centerX(bn, 960);
    A.in(tl, bn, tB + 0.2, 'fadeUp', { dur: 0.7 });
  });
})();
