// Your Training Mechanics: welcome and the start of Part 1.
//   tm00intro  title slide (shared kit)
//   tm00plan   plan slide: why it matters / what you'll gain / how we'll get there (the deck's five agenda items)
//   tm00idea   the big idea: a clock (when) and a pin (where) point at the treat
//   tm01card   Part 1 card; a "Yip!" bubble sends out sound rings
(() => {
  const { at, put, clamp } = TM;

  registerScene('tm00intro', ctx => SKIT.titleSlide(ctx));

  registerScene('tm00plan', ctx => SKIT.planSlide(ctx, [
    { ...SKIT.PLAN.why, rows: ['Every lesson uses them', 'Sloppy means guessing', 'Clean means easier'], rowIcons: ['layers', 'circle-help', 'sparkles'] },
    { ...SKIT.PLAN.gain, text: 'A *clear marker*, *clean timing*, and knowing *where each treat goes*.' },
    { ...SKIT.PLAN.how, rows: ['What a marker is', 'Charging your marker', 'Clean timing', 'Where to look for the treat', 'Toss and scatter'] },
  ], [
    [['every lesson', 0.1], ['sloppy', 0.45], ['clean', 0.75]],
    [],
    [['what a marker is', 0.1], ['charge it', 0.25], ['clean timing', 0.45], ['where to look', 0.65], ['toss and scatter', 0.85]],
  ]));

  registerScene('tm00idea', ctx => {
    const { stage, tl, cue, end } = ctx;
    TM.style(stage);
    const k = K.kicker(stage, 'The big idea', { x: 0, y: 150 });
    Object.assign(k.style, { width: '1920px', textAlign: 'center' });
    A.in(tl, k, cue(0), 'fadeUp', { dur: 0.6 });

    // the treat on a soft spot
    const sv = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const spot = K.svgEl('ellipse', { cx: 960, cy: 478, rx: 120, ry: 26, fill: '#e8f1dc' }, sv);
    const tr = TM.treat(stage, 960, 440, 2.6);
    tl.fromTo(spot, { opacity: 0, scale: 0.4, svgOrigin: '960 478' }, { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' }, cue(0) + 0.2);
    tl.fromTo(tr, { opacity: 0, y: -160 }, { opacity: 1, y: 0, duration: 0.7, ease: 'bounce.out' }, cue(0) + 0.3);

    // when (clock) and where (pin) point at the treat
    const badge = (cx, icon, label) => {
      const b = K.iconBadge(stage, icon, { x: cx - 70, y: 330, size: 140, variant: 'solid' });
      const l = put(stage, K.el('div', 'tm-lab', label), 0, 496, { width: '300px', textAlign: 'center', fontSize: '44px', color: 'var(--green-dark)', fontFamily: 'var(--font-head)' });
      l.style.left = cx - 150 + 'px';
      return { b, l };
    };
    const W = badge(520, 'clock', 'When'), P = badge(1400, 'map-pin', 'Where');
    const lnW = K.path(sv, 'M 610 400 L 880 432', { stroke: '#b8d99a', 'stroke-width': 6, 'stroke-dasharray': '4 14', 'stroke-linecap': 'round', fill: 'none' });
    const lnP = K.path(sv, 'M 1310 400 L 1040 432', { stroke: '#b8d99a', 'stroke-width': 6, 'stroke-dasharray': '4 14', 'stroke-linecap': 'round', fill: 'none' });
    const tW = at(ctx, 1, 'when', 0.05), tP = clamp(at(ctx, 1, 'where', 0.12), tW + 0.4, end(1));
    A.in(tl, [W.b, W.l], tW, 'pop', { dur: 0.5, stagger: 0.1 });
    tl.fromTo(lnW, { opacity: 0 }, { opacity: 1, duration: 0.4 }, tW + 0.3);
    A.in(tl, [P.b, P.l], tP, 'pop', { dur: 0.5, stagger: 0.1 });
    tl.fromTo(lnP, { opacity: 0 }, { opacity: 1, duration: 0.4 }, tP + 0.3);
    tl.to(tr, { scale: 1.15, duration: 0.25, yoyo: true, repeat: 1, ease: 'power2.out' }, tP + 0.5);

    const st = put(stage, K.el('div', 'tm-quote', 'When and where the food lands teaches as much as <b>what the food is</b>.'), 210, 610, { width: '1500px', fontSize: '60px' });
    A.in(tl, st, at(ctx, 1, 'food lands', 0.3), 'fadeUp', { dur: 0.8 });
    const bn = put(stage, K.el('div', 'tm-banner'), 0, 830);
    bn.appendChild(K.icon('repeat'));
    bn.appendChild(K.el('span', null, 'Learn them once. <b>Use them in everything.</b>'));
    TM.centerX(bn, 960);
    A.in(tl, bn, at(ctx, 2, 'learn', 0.05), 'fadeUp', { dur: 0.7 });
  });

  registerScene('tm01card', ctx => {
    const { stage, tl, cue, end, dur } = ctx;
    TM.partCard(ctx, 1, 'The marker');
    const sub = put(stage, K.el('div', 'tm-sub', 'One sound. The exact instant. <b>A treat is coming.</b>'), 160, 790, { width: '1500px' });
    A.in(tl, sub, at(ctx, 1, 'one sound', 0.3), 'fadeUp', { dur: 0.7 });
    // a "Yip!" bubble sends out sound rings
    const sv = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const rings = [0, 1, 2].map(() => K.circle(sv, 1390, 380, 90, { fill: 'none', stroke: '#b8d99a', 'stroke-width': 6 }));
    const b = TM.bubble(stage, 'Yip!', { x: 1300, y: 340, size: 60 });
    const tB = at(ctx, 1, 'marker', 0.05);
    A.in(tl, b, tB, 'pop', { dur: 0.55 });
    const tR = at(ctx, 1, 'one sound', 0.3);
    rings.forEach((r, i) => {
      for (let k = 0; k < 3; k++) {
        const t = tR + i * 0.35 + k * 1.4;
        if (t > dur - 0.8) continue;
        tl.fromTo(r, { attr: { r: 90 }, opacity: 0.9 }, { attr: { r: 260 }, opacity: 0, duration: 1.3, ease: 'power1.out', immediateRender: false }, t);
      }
    });
    rings.forEach(r => tl.set(r, { opacity: 0 }, 0));
    const tT = at(ctx, 1, 'treat', 0.85);
    const tr = TM.treat(stage, 1560, 470, 1.8);
    tl.fromTo(tr, { opacity: 0, x: 120, y: -40 }, { opacity: 1, x: 0, y: 0, duration: 0.7, ease: 'power3.out' }, tT);
  });
})();
