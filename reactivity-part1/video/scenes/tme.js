// Your Training Mechanics, Part 2 (continued) and the close.
//   tm02s03  toss the treat away (clip): a treat arcs out, the dog's path loops back to you
//   tm02s04  scatter on the ground (clip): treats sprinkle onto the ground
//   tm02s05  pick your words: three columns with small animated headers (to the mouth, scattered, tossed)
//   tm02s06  your key takeaways: training photo, four numbered points
//   tm02s07  remember: the quote, a target whose label changes while Mark / Feed / Place stay; logo close
(() => {
  const { at, put, clamp } = TM;
  const CSS = `
  .tme-col { position: absolute; background: #fff; border-radius: 26px; border: 1px solid #e6e9e1; box-shadow: var(--shadow-soft); box-sizing: border-box; padding: 26px 28px; }
  .tme-col .stage { position: relative; height: 150px; border-radius: 18px; background: var(--green-mist); overflow: hidden; }
  .tme-col .tt { margin-top: 22px; font: 700 40px/1 var(--font-head); color: var(--ink); }
  .tme-col .chips { margin-top: 22px; display: flex; flex-wrap: wrap; gap: 14px; }
  .tme-col .chips .tm-word { position: relative; font-size: 30px; padding: 12px 24px; }
  .tme-target { position: absolute; }
  .tme-big { position: absolute; font: 700 64px/1 var(--font-head); color: var(--green); white-space: nowrap; }
  `;
  const css = stage => { TM.style(stage); if (!stage.querySelector('style[data-tme]')) { const s = K.el('style', null, CSS); s.dataset.tme = '1'; stage.appendChild(s); } };

  // ---------------------------------------------------------------- toss
  registerScene('tm02s03', ctx => {
    const { stage, tl, cue, end } = ctx;
    css(stage);
    const v = TM.videoSlide(ctx, {
      kicker: 'Resets and re-engages', heading: 'Toss the treat away', top: 470, gap: 30,
      rows: [
        { icon: 'refresh-cw', html: 'Resets *position and posture*', beat: 1, phrase: 'resets', fb: 0.3 },
        { icon: 'move-horizontal', html: 'Adds *space* and a beat', beat: 2, phrase: 'space', fb: 0.5 },
        { icon: 'flag', html: 'Back to start, or *a little distance*', beat: 3, phrase: 'start position', fb: 0.3 },
      ],
    });
    // out and back: you, the treat flies out, the dog's path loops back
    const sv = K.svg(stage, { x: 100, y: 290, w: 740, h: 160 });
    const you = K.iconBadge(stage, 'user', { x: 100, y: 330, size: 80, variant: 'solid' });
    const out = K.path(sv, 'M 90 70 C 240 -30, 480 -30, 640 70', { stroke: '#d9912b', 'stroke-width': 5, fill: 'none', 'stroke-dasharray': '3 12', 'stroke-linecap': 'round' });
    const back = K.path(sv, 'M 640 100 C 480 170, 240 170, 100 112', { stroke: '#619537', 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' });
    const bh = K.path(sv, 'M 122 98 L 98 112 L 122 128', { stroke: '#619537', 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
    const tr = TM.treat(stage, 190, 360, 1.3);
    const lab = put(stage, K.el('div', 'tm-lab', 'Out and back'), 330, 352, { fontSize: '30px', color: 'var(--green-dark)' });
    A.in(tl, you, cue(0) + 0.5, 'pop', { dur: 0.45 });
    const tT = at(ctx, 0, 'toss a piece', 0.2);
    A.draw(tl, out, tT, 0.8);
    tl.fromTo(tr, { opacity: 0 }, { opacity: 1, duration: 0.2 }, tT);
    tl.to(tr, { motionPath: { path: 'M 0 0 C 150 -100, 390 -100, 550 0' }, duration: 0.8, ease: 'power1.inOut' }, tT);
    const tB = at(ctx, 0, 'comes back', 0.8);
    A.draw(tl, back, tB, 0.9);
    A.in(tl, bh, tB + 0.8, 'fade', { dur: 0.2 });
    A.in(tl, lab, tB + 0.4, 'fadeUp', { dur: 0.5 });
  });

  // ---------------------------------------------------------------- scatter
  registerScene('tm02s04', ctx => {
    const { stage, tl, cue, end } = ctx;
    css(stage);
    TM.videoSlide(ctx, {
      kicker: 'Calms and decompresses', heading: 'Scatter on the ground', top: 470, gap: 30,
      rows: [
        { icon: 'leaf', html: 'Sniffing helps them *settle*', beat: 1, phrase: 'sniffing', fb: 0.1 },
        { icon: 'arrow-down', html: 'Brings the *head down*', beat: 2, phrase: 'head down', fb: 0.5 },
        { icon: 'heart', html: 'A distraction, or *a calm-down*', beat: 3, phrase: 'distraction', fb: 0.3 },
      ],
    });
    const sv = K.svg(stage, { x: 100, y: 290, w: 740, h: 160 });
    const ground = K.path(sv, 'M 10 130 L 730 130', { stroke: '#b8d99a', 'stroke-width': 8, 'stroke-linecap': 'round', fill: 'none' });
    A.draw(tl, ground, cue(0) + 0.5, 0.6);
    const tS = at(ctx, 0, 'sprinkle', 0.3);
    [[150, 0], [260, 0.12], [330, 0.05], [430, 0.2], [520, 0.09], [610, 0.16], [210, 0.24]].forEach(([x, d], i) => {
      const t = TM.treat(stage, 100 + x, 290 + 112 - (i % 2) * 6, 1.0);
      tl.fromTo(t, { opacity: 0, y: -110 }, { opacity: 1, y: 0, duration: 0.55, ease: 'bounce.out' }, tS + d * 3);
    });
    const nose = K.iconBadge(stage, 'search', { x: 100, y: 300, size: 70, variant: 'solid' });
    A.in(tl, nose, at(ctx, 1, 'search', 0.8), 'pop', { dur: 0.4 });
    tl.to(nose, { x: 520, duration: Math.max(1, end(1) - at(ctx, 1, 'search', 0.8)), ease: 'sine.inOut' }, at(ctx, 1, 'search', 0.8) + 0.3);
  });

  // ---------------------------------------------------------------- pick your words
  registerScene('tm02s05', ctx => {
    const { stage, tl, cue, end } = ctx;
    css(stage);
    TM.head(ctx, 'Pick yours', 'Pick your words');
    const COLS = [
      ['To the mouth', ['Clicker', 'Yip', 'Yep', 'Mark', 'Nice', 'Treat'], ['clicker', 'yip', 'yep', 'mark', 'nice', 'or treat'], 1],
      ['Scattered', ['Scatter', 'Get it', 'Find it', 'Search', 'Ground'], ['scatter,', 'get it', 'find it', 'search', 'or ground'], 2],
      ['Tossed', ['Toss', 'Go', 'Chase', 'Free'], ['toss,', 'go', 'chase', 'free'], 3],
    ];
    const cols = COLS.map(([t, ws, ps, beat], i) => {
      const c = put(stage, K.el('div', 'tme-col'), 100 + i * 590, 280, { width: '540px', height: '520px' });
      const st = K.el('div', 'stage');
      c.appendChild(st);
      c.appendChild(K.el('div', 'tt', t));
      const chips = K.el('div', 'chips');
      c.appendChild(chips);
      tl.fromTo(c, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, cue(0) + 0.2 + i * 0.12);
      const ns = ws.map((w, k) => {
        const n = TM.word(chips, w, { variant: k === 0 && i === 0 ? 'green' : 'pale', icon: w === 'Clicker' ? 'mouse-pointer-click' : null });
        n.style.left = n.style.top = '';
        n.style.position = 'relative';
        A.in(tl, n, at(ctx, beat, ps[k], 0.15 + 0.13 * k), 'pop', { dur: 0.4 });
        return n;
      });
      tl.to(c, { boxShadow: '0 18px 44px rgba(40,60,20,0.16), 0 0 0 4px rgba(97,149,55,1)', duration: 0.5 }, cue(beat));
      if (beat < 3) tl.to(c, { boxShadow: '0 10px 30px rgba(40,60,20,0.10), 0 0 0 0px rgba(97,149,55,0)', duration: 0.5 }, cue(beat + 1));
      else tl.to(c, { boxShadow: '0 10px 30px rgba(40,60,20,0.10), 0 0 0 0px rgba(97,149,55,0)', duration: 0.5 }, cue(4));
      return { c, st, ns };
    });
    // header animations, each on its beat
    // 1: the treat goes from the hand to the mouth
    {
      const st = cols[0].st, t0 = cue(1) + 0.2;
      const h = K.iconBadge(st, 'hand', { x: 60, y: 35, size: 80, variant: 'amber' });
      const m = K.iconBadge(st, 'smile', { x: 340, y: 35, size: 80, variant: 'solid' });
      const tr = TM.treat(st, 140, 75, 1.2);
      A.in(tl, [h, m], t0, 'pop', { dur: 0.4, stagger: 0.1 });
      tl.fromTo(tr, { opacity: 0 }, { opacity: 1, duration: 0.2 }, t0 + 0.4);
      tl.to(tr, { x: 190, duration: 0.8, ease: 'power2.inOut' }, t0 + 0.6);
    }
    // 2: treats scatter on the ground
    {
      const st = cols[1].st, t0 = cue(2) + 0.2;
      [[90, 0], [170, 0.1], [240, 0.05], [310, 0.18], [390, 0.12]].forEach(([x, d], k) => {
        const tr = TM.treat(st, x, 112 - (k % 2) * 8, 1.0);
        tl.fromTo(tr, { opacity: 0, y: -90 }, { opacity: 1, y: 0, duration: 0.5, ease: 'bounce.out' }, t0 + d * 3);
      });
    }
    // 3: a treat arcs away
    {
      const st = cols[2].st, t0 = cue(3) + 0.2;
      const sv = K.svg(st, { x: 0, y: 0, w: 484, h: 150 });
      const arc = K.path(sv, 'M 60 120 C 160 0, 320 0, 420 120', { stroke: '#d9912b', 'stroke-width': 5, fill: 'none', 'stroke-dasharray': '3 12', 'stroke-linecap': 'round' });
      const tr = TM.treat(st, 60, 116, 1.2);
      A.draw(tl, arc, t0, 0.8);
      tl.fromTo(tr, { opacity: 0 }, { opacity: 1, duration: 0.2 }, t0);
      tl.to(tr, { motionPath: { path: 'M 0 0 C 100 -120, 260 -120, 360 4' }, duration: 0.9, ease: 'power1.inOut' }, t0);
    }
    const bn = put(stage, K.el('div', 'tm-banner'), 0, 840);
    bn.appendChild(K.icon('map-pin'));
    bn.appendChild(K.el('span', null, 'One spot, one word. <b>Every time.</b>'));
    TM.centerX(bn, 960);
    A.in(tl, bn, at(ctx, 4, 'its own word', 0.4), 'fadeUp', { dur: 0.6 });
  });

  // ---------------------------------------------------------------- key takeaways
  registerScene('tm02s06', ctx => {
    const { stage, tl, cue } = ctx;
    css(stage);
    const p = K.photo(stage, 'trainer_with_dog.jpg', { x: 100, y: 290, w: 620, h: 640, pos: '50% 40%' });
    A.in(tl, p.root, cue(0) + 0.1, 'fadeUp', { dur: 0.8 });
    A.kenburns(tl, p.img, { from: 1.02, to: 1.1 });
    TM.head(ctx, 'Pulling it together', 'Your key takeaways');
    const col = put(stage, K.el('div', 'tm-col'), 800, 300, { width: '1020px', gap: '36px' });
    [
      ['A marker is a promise: *the exact moment*, always followed by food.', 1, 'promise'],
      ['Mark the instant, then *feed within a second or two*.', 2, 'mark the instant'],
      ['Where the treat lands is a tool: *toss to reset, scatter to calm, hand-feed to keep them close*.', 3, 'where the treat lands'],
      ['LSMs take the guesswork out: *one word, they know where to look*.', 4, 'guesswork'],
    ].forEach(([t, b, ph], i) => {
      const r = TM.row(col, null, t, { num: i + 1, size: 33 });
      A.in(tl, r, at(ctx, b, ph, 0.05), 'fadeRight', { dur: 0.6 });
    });
  });

  // ---------------------------------------------------------------- remember + close
  registerScene('tm02s07', ctx => {
    const { stage, tl, cue, end, dur } = ctx;
    css(stage);
    const k = K.kicker(stage, 'Remember', { x: 0, y: 200 });
    Object.assign(k.style, { width: '1920px', textAlign: 'center' });
    A.in(tl, k, cue(0), 'fadeUp', { dur: 0.6 });
    const q = put(stage, K.el('div', 'tm-quote', 'These skills never change.<br><b>Only the target does.</b>'), 160, 260, { width: '1600px' });
    A.in(tl, q, at(ctx, 0, 'these skills', 0.1), 'fadeUp', { dur: 0.8 });
    const by = put(stage, K.el('div', 'tm-lab', 'Tori Ganino, Calling All Dogs'), 0, 480, { width: '1920px', textAlign: 'center', fontSize: '30px', color: 'var(--ink-soft)' });
    A.in(tl, by, at(ctx, 0, 'target', 0.8), 'fade', { dur: 0.6 });

    // the target, whose label changes; the skills stay
    const sv = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const TX = 700, TY = 680;
    const rings = [100, 70, 40, 14].map((r, i) => K.circle(sv, TX, TY, r, { fill: i % 2 ? '#fff' : (i === 3 ? '#619537' : '#b8d99a'), stroke: 'none' }));
    const tg = K.group(sv);
    rings.forEach(r => tg.appendChild(r));
    const t1 = cue(1);
    tl.fromTo(tg, { opacity: 0, scale: 0.6, svgOrigin: `${TX} ${TY}` }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.6)' }, t1 + 0.05);
    const labs = [['A sit', 'a sit'], ['A look', 'a look'], ['A calm choice', 'calm choice']].map(([w, p], i) => {
      const n = put(stage, K.el('div', 'tme-big', w), 850, TY - 34);
      return [n, at(ctx, 1, p, 0.1 + 0.15 * i)];
    });
    labs.forEach(([n, t], i) => {
      tl.fromTo(n, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, t);
      if (i < labs.length - 1) tl.to(n, { opacity: 0, y: -30, duration: 0.3, ease: 'power2.in' }, labs[i + 1][1] - 0.3);
    });
    const row = put(stage, K.el('div'), 0, 820, { position: 'absolute', width: '1920px', display: 'flex', justifyContent: 'center', gap: '24px' });
    const chips = [['Mark', 'volume-2', 'mark it'], ['Feed', 'cookie', 'feed it'], ['Place', 'map-pin', 'place it']].map(([w, ic, p]) => {
      const n = TM.word(row, w, { variant: 'green', icon: ic, size: 36 });
      n.style.position = 'relative'; n.style.left = n.style.top = '';
      A.in(tl, n, at(ctx, 1, p, 0.6), 'pop', { dur: 0.45 });
      return n;
    });
    SKIT.logoClose(ctx, cue(2) + 0.1, [k, q, by, sv, ...labs.map(l => l[0]), row]);
  });
})();
