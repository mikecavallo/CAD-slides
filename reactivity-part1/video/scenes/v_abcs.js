// The ABCs of Everyday Behavior (script/video-abcs.json): a standalone video in Chapter 3's look (C3 kit), for everyday
// behaviors only (pulling, counter surfing, recall, attention barking), no reactivity, no pot.
//   vabcs01  title slide
//   vabcs02  everyday behaviors     three drawn cards (pulling, jumping on guests, the sock); why / continues / change
//   vabcs03  the ABCs               empty ABC frames, each definition lands as it is said, the heart between A and B
//   vabcs04  pulling on the leash   drawn ABC strip: the tree, the pull, the tree reached
//   vabcs05  counter surfing        drawn ABC strip: the sandwich, the jump, the sandwich; likely to check again
//   vabcs06  coming when called     drawn ABC strip: sniffing + call, runs back, leash on; ended the fun, less likely
//   vabcs07  WTF                    A B C become W T F; the question; the pulling strip small + possible function
//   vabcs08  same behavior          two barking rows: food, attention; same / different / different; whole picture
//   vabcs09  why it keeps happening A B C, it works, more likely; a run of tries that pays off only sometimes
//   vabcs10  what changing includes three cards: management, changing emotions, new behaviors
//   vabcs11  the consequence        before / now rows (pulling vs loose leash, same C); recall row
//   vabcs12  building a new path    chapter 3's lawn; a neural pathway that thickens with use; grass grows back
//   vabcs13  your homework          worksheet with e.g. answers, WTF
//   vabcs14  whole picture          three rows, logo close
(() => {
  const { sayAt, clamp } = C1;
  const { COL } = C3;
  const C = C1.C;

  const CSS = `
  .va-ic { position: absolute; display: grid; place-items: center; }
  .va-emo { position: absolute; text-align: center; font: 700 26px/1.1 var(--font-body); color: ${COL.emo}; white-space: nowrap; }
  .va-card { position: absolute; background: #fff; border-radius: 26px; box-shadow: var(--shadow-soft); border: 1px solid #e6e9e1; overflow: hidden; box-sizing: border-box; }
  .va-card .pic { position: absolute; left: 0; top: 0; right: 0; }
  .va-card .lab { position: absolute; left: 0; right: 0; text-align: center; font: 700 34px/1.15 var(--font-head); color: var(--green-dark); }
  .va-flow { position: absolute; display: flex; align-items: center; gap: 18px; background: #fff; border-radius: 22px; padding: 18px 28px 18px 18px;
    box-shadow: var(--shadow-soft); border: 4px solid #e6e9e1; font: 700 32px/1.15 var(--font-head); color: var(--ink); white-space: nowrap; box-sizing: border-box; }
  .va-flow .ib { width: 66px; height: 66px; border-radius: 16px; display: grid; place-items: center; color: #fff; flex: 0 0 auto; }
  .va-flow .ib svg { width: 40px; height: 40px; stroke-width: 2.4; }
  .va-flow i { font-style: normal; color: var(--ink-soft); font-weight: 500; font-size: 26px; display: block; }
  .va-tag { position: absolute; padding: 12px 26px; border-radius: 14px; color: #fff; font: 700 30px/1 var(--font-head); }
  .va-try { position: absolute; width: 92px; height: 92px; border-radius: 50%; display: grid; place-items: center; color: #fff; border: 6px solid #fff; box-shadow: var(--shadow-soft); }
  .va-try svg { width: 50px; height: 50px; stroke-width: 3; }
  .c3p-pill { position: absolute; display: inline-flex; align-items: center; gap: 12px; padding: 14px 28px 14px 20px; border-radius: 999px; background: #fff;
    font: 700 32px/1 var(--font-body); white-space: nowrap; box-shadow: 0 10px 24px rgba(40,60,20,0.18); }
  .c3p-pill svg { width: 36px; height: 36px; stroke-width: 2.4; }
  `;
  const setup = ctx => { C2.style(ctx.stage); C3.css(ctx.stage); ctx.stage.appendChild(K.el('style', null, CSS)); };

  // ------------------------------------------------------------------ drawn scenes for panels and cards (no photos)
  // A 400 x 230 picture: an outdoor or indoor backdrop, the drawn dog (C2.dog), Lucide icons and a few marks.
  const VB = [400, 230];
  function pic(host, w, h, o) {
    const box = K.el('div', 'pic');
    Object.assign(box.style, { position: 'absolute', left: '0', top: '0', width: w + 'px', height: h + 'px', overflow: 'hidden' });
    host.appendChild(box);
    const sv = K.svg(box, { x: 0, y: 0, w, h, viewBox: `0 0 ${VB[0]} ${VB[1]}` });
    sv.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    const id = 'va' + Math.random().toString(36).slice(2, 8);
    const defs = K.svgEl('defs', {}, sv);
    const gr = K.svgEl('linearGradient', { id, x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    const out = o.bg !== 'in';
    K.svgEl('stop', { offset: '0', 'stop-color': out ? '#e9f4fb' : '#f7f0e4' }, gr);
    K.svgEl('stop', { offset: '1', 'stop-color': out ? '#f6faf0' : '#f3e9d8' }, gr);
    K.rect(sv, 0, 0, VB[0], VB[1], { fill: `url(#${id})` });
    K.rect(sv, 0, 178, VB[0], 52, { fill: out ? '#bcd99b' : '#dcc39a' });
    K.path(sv, `M 0 178 L ${VB[0]} 178`, { stroke: out ? '#9cc472' : '#c7a873', 'stroke-width': 3 });
    if (o.counter) { K.rect(sv, o.counter[0], o.counter[1], o.counter[2], 178 - o.counter[1], { fill: '#e9e2d6', stroke: '#b9a98c', 'stroke-width': 3 });
      K.rect(sv, o.counter[0] - 8, o.counter[1] - 10, o.counter[2] + 16, 12, { rx: 4, fill: '#8c7a5c' }); }
    (o.marks || []).forEach(d => K.path(sv, d, { stroke: o.markCol || C.amber, 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }));
    let D = null;
    if (o.dog) {
      const [x, y, s] = o.dog;
      D = C2.dog(sv, x, y, s);
      const tr = [];
      if (o.flip) tr.push(`translate(${2 * x} 0) scale(-1 1)`);
      if (o.rot) tr.push(`rotate(${o.rot} ${x} ${y + 40 * s})`);
      if (tr.length) D.outer.setAttribute('transform', tr.join(' '));
    }
    (o.icons || []).forEach(([name, x, y, size, col]) => {
      const d = K.el('div', 'va-ic');
      Object.assign(d.style, { left: (x / VB[0]) * 100 + '%', top: (y / VB[1]) * 100 + '%', width: '0', height: '0' });
      const ic = K.icon(name, { size: size * w / VB[0], stroke: 2.2, color: col || C.greenDark });
      ic.style.position = 'absolute';
      ic.style.left = -size * w / VB[0] / 2 + 'px';
      ic.style.top = -size * w / VB[0] / 2 + 'px';
      d.appendChild(ic);
      box.appendChild(d);
    });
    return { box, sv, D };
  }
  // the pictures for each example (A, B, C)
  const P = {
    pull: [
      { dog: [110, 150, 0.36], icons: [['tree-deciduous', 310, 112, 120, '#4f7f2a']], marks: ['M 170 70 l 14 -10', 'M 176 84 l 18 -4'] },
      { dog: [180, 150, 0.36], rot: 10, icons: [['tree-deciduous', 330, 112, 120, '#4f7f2a'], ['arrow-right', 270, 60, 46, C.amber]],
        marks: ['M 20 120 C 60 120, 90 128, 128 136'], markCol: '#8c7a5c' },
      { dog: [250, 150, 0.36], icons: [['tree-deciduous', 340, 112, 120, '#4f7f2a'], ['check', 80, 70, 56, C.green]] },
    ],
    counter: [
      { bg: 'in', counter: [210, 120, 170], icons: [['sandwich', 290, 100, 56, '#b5772f'], ['door-open', 70, 105, 92, '#8c7a5c']] },
      { bg: 'in', counter: [230, 120, 150], dog: [190, 140, 0.36], rot: -28, icons: [['sandwich', 300, 100, 56, '#b5772f']] },
      { bg: 'in', counter: [260, 120, 130], dog: [150, 152, 0.36], icons: [['sandwich', 245, 120, 48, '#b5772f'], ['check', 70, 60, 56, C.green]] },
    ],
    recall: [
      { dog: [230, 160, 0.36], rot: 14, icons: [['flower-2', 330, 160, 44, '#c46a8a'], ['flower', 120, 166, 36, '#d39b2a'], ['volume-2', 60, 60, 58, C.amber]] },
      { dog: [230, 150, 0.36], flip: true, icons: [['user', 50, 120, 96, '#4a4a4a']], marks: ['M 330 100 l 30 0', 'M 324 120 l 40 0', 'M 330 140 l 30 0'], markCol: '#9bb7c9' },
      { dog: [190, 150, 0.36], flip: true, icons: [['user', 50, 120, 96, '#4a4a4a'], ['tree-deciduous', 335, 112, 110, '#b6c7a4'], ['circle-x', 335, 112, 60, C.red]],
        marks: ['M 70 128 C 100 150, 120 140, 150 130'], markCol: '#8c7a5c' },
    ],
    bark: { bg: 'in', dog: [150, 150, 0.36], marks: ['M 262 70 q 12 16 0 32', 'M 280 60 q 18 26 0 52', 'M 298 50 q 24 36 0 72'], markCol: C.red },
  };

  // ABC strip with drawn panels and the heart between A and B
  function strip(stage, o) {
    const S = C3.strip(stage, { x: 140, y: o.y ?? 236, w: 1640, gap: 190, panels: [], captions: o.caps, label: o.label, labelVariant: o.v });
    S.cols.forEach((c, k) => {
      c.img.style.display = 'none';
      const p = pic(c.panel, S.colW - 12, S.panelH - 12, o.pics[k]);
      gsap.set(p.box, { opacity: 0 });
      c.img = p.box;
    });
    const [hx, hy] = S.arrowPt(0);
    const heart = C2.badge(S.wrap, 'heart', hx, hy - 66, 76, COL.emo, '#fff');
    heart.style.border = '5px solid #fff';
    heart.style.boxShadow = '0 8px 20px rgba(80,40,90,0.3)';
    const lab = C2.put(S.wrap, 'va-emo', o.emo || 'Emotions', { x: hx - 90, y: hy + 34, w: 180 });
    gsap.set([heart, lab], { opacity: 0 });
    S.emo = (tl, t) => {
      tl.fromTo(heart, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)', immediateRender: false }, t);
      tl.fromTo(lab, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, immediateRender: false }, t + 0.2);
      for (let k = 0; k < 3; k++) tl.to(heart, { scale: 1.15, duration: 0.14, yoyo: true, repeat: 1 }, t + 0.8 + k * 0.8);
    };
    S.showAll = (tl, i, t) => {
      S.show(tl, i, t);
      tl.fromTo(S.cols[i].head, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, immediateRender: false }, t);
      if (i > 0) tl.fromTo(S.arrows[i - 1], { opacity: 0 }, { opacity: 1, duration: 0.4, immediateRender: false }, t - 0.2);
    };
    return S;
  }

  // a small flow card: icon square + text
  function flow(stage, icon, html, x, y, col, w) {
    const n = K.el('div', 'va-flow');
    const ib = K.el('div', 'ib');
    ib.style.background = col;
    ib.appendChild(K.icon(icon));
    n.appendChild(ib);
    n.appendChild(K.el('div', null, K.md(html)));
    Object.assign(n.style, { left: x + 'px', top: y + 'px' });
    if (w) n.style.width = w + 'px';
    stage.appendChild(n);
    return n;
  }
  const arrowSvg = (stage, x0, x1, y, col = C.muted) => {
    const sv = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    return K.path(sv, `M ${x0} ${y} L ${x1} ${y} M ${x1 - 20} ${y - 18} L ${x1} ${y} L ${x1 - 20} ${y + 18}`, { stroke: col, 'stroke-width': 8 });
  };

  // ================================================================== vabcs01 title
  registerScene('vabcs01', ctx => SKIT.titleSlide(ctx));

  // ================================================================== vabcs02 everyday behaviors
  registerScene('vabcs02', ctx => {
    const { stage, tl, cue, end } = ctx;
    setup(ctx);
    const at = (i, p, fb, lead) => sayAt(ctx, i, p, fb, lead);
    C3.head(ctx, 'Everyday Behavior', { size: 72 });
    const CARDS = [
      ['Pulling on the leash', { dog: [180, 150, 0.4], rot: 10, icons: [['tree-deciduous', 340, 110, 110, '#4f7f2a']], marks: ['M 10 120 C 60 120, 100 130, 140 138'], markCol: '#8c7a5c' }, 'pulling'],
      ['Jumping on guests', { bg: 'in', dog: [170, 140, 0.4], rot: -30, icons: [['user', 320, 110, 130, '#4a4a4a']] }, 'jumping'],
      ['Running off with a sock', { bg: 'in', dog: [220, 150, 0.4], flip: true, icons: [['shirt', 60, 140, 50, '#5d86b5']], marks: ['M 330 110 l 34 0', 'M 324 132 l 44 0'], markCol: '#9bb7c9' }, 'sock'],
    ];
    const W = 500, H = 380, G = 60, X0 = (1920 - 3 * W - 2 * G) / 2, Y = 300;
    const cards = CARDS.map(([lab, o, p], k) => {
      const c = C3.put(stage, 'va-card', null, { x: X0 + k * (W + G), y: Y, w: W, h: H });
      pic(c, W, 290, o);
      const l = K.el('div', 'lab', lab);
      l.style.top = '312px';
      c.appendChild(l);
      A.in(tl, c, clamp(at(0, p, 0.1 + 0.3 * k), cue(0) + 0.2 + k * 0.4, end(0) - 0.3), 'fadeUp', { dur: 0.6 });
      return c;
    });
    const t1 = cue(1);
    const why = C3.chip(stage, 'message-circle', 'Some of the *most common reasons* people reach out for help', 960, 740, { center: true, size: 34, col: C.green });
    why.style.borderColor = C.green;
    A.in(tl, why, clamp(at(1, 'most common', 0.3), t1 + 0.2, end(1) - 0.5), 'fadeUp', { dur: 0.5 });
    const t2 = cue(2);
    tl.to([...cards, why], { opacity: 0, y: 20, duration: 0.45, stagger: 0.05 }, t2);
    const R = [['search', 'Why it *happens*', 'why these behaviors happen'], ['repeat', 'Why it *continues*', 'why they continue'], ['route', 'How to *change it*', 'how to change them']];
    let lo = t2 + 0.5;
    R.forEach(([ic, tx, p], k) => {
      const r = C3.row(stage, ic, tx, 700, 340 + k * 150, { col: [COL.A, COL.B, COL.C][k], size: 54 });
      const tt = clamp(at(2, p, 0.3 + 0.25 * k), lo, end(2) - 0.3);
      A.in(tl, r, tt, 'fadeLeft', { dur: 0.5 });
      lo = tt + 0.4;
    });
  });

  // ================================================================== vabcs03 the ABCs
  registerScene('vabcs03', ctx => {
    const { stage, tl, cue, end } = ctx;
    setup(ctx);
    const at = (i, p, fb, lead) => sayAt(ctx, i, p, fb, lead);
    C3.head(ctx, 'The ABCs', { size: 72 });
    const S = C3.strip(stage, { x: 140, y: 236, w: 1640, gap: 190, panels: [], defs: true });
    const DEF = ['What happens right before + <b>the context</b> around it', 'What the dog does<br><i>e.g. pulling, jumping, barking</i>', 'What happens <b>as a result</b>'];
    S.defs.forEach((d, k) => { d.innerHTML = `<div>${DEF[k]}</div>`; });
    gsap.set(S.defs, { opacity: 0 });
    S.frames(tl, cue(0) + 0.3);
    const pop = (k, t) => tl.fromTo(S.defs[k], { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out', immediateRender: false }, t);
    pop(0, cue(1) + 0.2);
    const tCx = clamp(at(1, 'context', 0.3), cue(1) + 1.0, end(1) - 0.8);
    tl.to(S.defs[0].querySelector('b'), { backgroundColor: 'rgba(184,217,154,0.8)', duration: 0.3 }, tCx);
    const ctxQ = ['Where you are', 'Who’s present', 'What’s going on'].map((t, k) => {
      const c = C3.chip(stage, ['map-pin', 'users', 'eye'][k], t, [520, 960, 1400][k], 660, { col: COL.A, size: 30, center: true });
      A.in(tl, c, clamp(at(1, ['where you are', 'who', 'going on'][k], 0.3), tCx + 0.3 + k * 0.3, end(1) - 0.2), 'fadeUp', { dur: 0.4 });
      return c;
    });
    tl.to(ctxQ, { opacity: 0, duration: 0.4 }, cue(2));
    pop(1, cue(2) + 0.2);
    // the emotional response
    const [hx, hy] = S.arrowPt(0);
    const heart = C2.badge(S.wrap, 'heart', hx, hy - 66, 80, COL.emo, '#fff');
    heart.style.border = '5px solid #fff';
    heart.style.boxShadow = '0 8px 20px rgba(80,40,90,0.3)';
    const emo = C2.put(S.wrap, 'va-emo', 'Emotional<br>response', { x: hx - 90, y: hy + 34, w: 180 });
    gsap.set([heart, emo], { opacity: 0 });
    const tE = clamp(at(3, 'emotional response', 0.3), cue(3) + 0.1, end(3) - 2);
    tl.fromTo(heart, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }, tE);
    tl.fromTo(emo, { opacity: 0 }, { opacity: 1, duration: 0.4 }, tE + 0.2);
    for (let k = 0; k < 4; k++) tl.to(heart, { scale: 1.15, duration: 0.14, yoyo: true, repeat: 1 }, tE + 0.8 + k * 0.9);
    const eg = C3.chip(stage, 'heart', 'e.g. *excitement*, *frustration*, *anticipation*', 960, 690, { center: true, size: 32, col: COL.emo });
    eg.style.borderColor = COL.emo;
    A.in(tl, eg, clamp(at(3, 'excitement', 0.3), tE + 1.0, end(3) - 0.4), 'fadeUp', { dur: 0.5 });
    tl.to(eg, { opacity: 0, duration: 0.4 }, cue(4));
    pop(2, cue(4) + 0.2);
  });

  // ================================================================== vabcs04 to 06 the three examples
  function example(ctx, o) {
    const { stage, tl, cue, end } = ctx;
    setup(ctx);
    C3.head(ctx, o.title, { size: 72 });
    const S = strip(stage, { pics: o.pics, caps: o.caps, emo: o.emo });
    S.frames(tl, cue(0) + 0.2);
    return S;
  }
  registerScene('vabcs04', ctx => {
    const { tl, cue, end } = ctx;
    const at = (i, p, fb, lead) => sayAt(ctx, i, p, fb, lead);
    const S = example(ctx, { title: 'Pulling on the Leash', pics: P.pull, emo: 'Excitement',
      caps: ['Your dog notices<br>a tree', 'e.g. pulling toward<br>the tree', 'Your dog reaches<br>the tree'] });
    S.showAll(tl, 0, cue(1) + 0.1);
    S.emo(tl, clamp(at(2, 'excited', 0.3), cue(2) + 0.1, end(2) - 2));
    S.showAll(tl, 1, clamp(at(2, 'pulls', 0.4), cue(2) + 0.8, end(2) - 0.6));
    S.showAll(tl, 2, cue(3) + 0.1);
  });
  registerScene('vabcs05', ctx => {
    const { stage, tl, cue, end } = ctx;
    const at = (i, p, fb, lead) => sayAt(ctx, i, p, fb, lead);
    const S = example(ctx, { title: 'Counter Surfing', pics: P.counter, emo: 'Excitement',
      caps: ['A sandwich on the counter;<br>you leave the room', 'e.g. jumps up<br>to the counter', 'Gets the<br>sandwich'] });
    S.showAll(tl, 0, cue(1) + 0.1);
    S.emo(tl, clamp(at(2, 'excited', 0.3), cue(2) + 0.1, end(2) - 1.5));
    S.showAll(tl, 1, clamp(at(2, 'jumps up', 0.3), cue(2) + 0.6, end(2) - 0.5));
    S.showAll(tl, 2, cue(3) + 0.05);
    const ch = C3.chip(stage, 'repeat', 'Likely to *check the counter again*', 960, 866, { center: true, size: 34, col: C.green });
    ch.style.borderColor = C.green;
    A.in(tl, ch, clamp(at(4, 'check the counter', 0.4), cue(4) + 0.3, end(4) - 0.3), 'fadeUp', { dur: 0.5 });
  });
  registerScene('vabcs06', ctx => {
    const { stage, tl, cue, end } = ctx;
    const at = (i, p, fb, lead) => sayAt(ctx, i, p, fb, lead);
    const S = example(ctx, { title: 'Coming When Called', pics: P.recall, emo: 'Emotions',
      caps: ['Sniffing at the park;<br>you call', 'e.g. runs back<br>to you', 'Leash goes on;<br>park time is over'] });
    S.showAll(tl, 0, clamp(at(1, 'sniffing', 0.2), cue(1) + 0.1, end(1) - 1));
    S.emo(tl, cue(2) + 0.05);
    S.showAll(tl, 1, cue(2) + 0.5);
    S.showAll(tl, 2, clamp(at(3, 'clip on', 0.2), cue(3) + 0.1, end(3) - 1));
    tl.to(S.cols[2].panel, { borderColor: C.amber, duration: 0.4 }, cue(4));
    const fun = C3.chip(stage, 'circle-x', 'Coming when called *ended the fun*', 960, 866, { center: true, size: 34, col: C.amber });
    fun.style.borderColor = C.amber;
    A.in(tl, fun, clamp(at(4, 'ended the fun', 0.4), cue(4) + 0.3, end(4) - 0.3), 'fadeUp', { dur: 0.5 });
    const t5 = cue(5);
    tl.to(fun, { opacity: 0, duration: 0.3 }, t5);
    const less = C3.chip(stage, 'trending-down', 'Coming when called: *less likely over time*', 960, 866, { center: true, size: 34, col: C.red });
    less.style.borderColor = C.red;
    A.in(tl, less, clamp(at(5, 'less likely', 0.4), t5 + 0.3, end(5) - 0.5), 'pop', { dur: 0.5 });
    tl.to(S.cols[1].panel, { opacity: 0.55, duration: 0.6 }, clamp(at(5, 'slower', 0.3), t5 + 1.0, end(5) - 0.3));
  });

  // ================================================================== vabcs07 WTF
  registerScene('vabcs07', ctx => {
    const { stage, tl, cue, end } = ctx;
    setup(ctx);
    const at = (i, p, fb, lead) => sayAt(ctx, i, p, fb, lead);
    C3.head(ctx, 'WTF? What’s the Function?', { size: 72 });
    const TS = 130, TG = 70, X0 = 960 - (3 * TS + 2 * TG) / 2, TY = 260;
    const tiles = ['A', 'B', 'C'].map((L, k) => C3.tile(stage, L, X0 + k * (TS + TG), TY, TS, [COL.A, COL.B, COL.C][k]));
    tiles.forEach((n, k) => A.in(tl, n, cue(0) + 0.2 + k * 0.3, 'pop', { dur: 0.5 }));
    const tW = clamp(at(0, 'WTF', 0.25), cue(0) + 1.4, end(0) - 1.6);
    tiles.forEach((n, k) => tl.to(n, { opacity: 0, y: 40, scale: 0.8, duration: 0.35, ease: 'power2.in' }, tW - 0.3 + k * 0.08));
    const wtf = ['W', 'T', 'F'].map((L, k) => C3.tile(stage, L, X0 + k * (TS + TG), TY, TS, k === 2 ? C.green : COL.A));
    wtf.forEach((n, k) => tl.fromTo(n, { opacity: 0, y: -80, rotation: [-8, 4, -4][k] }, { opacity: 1, y: 0, rotation: 0, duration: 0.6, ease: 'bounce.out' }, tW + k * 0.15));
    const words = C2.put(stage, 'c3-big', '<b>W</b>hat’s <b>T</b>he <b>F</b>unction?', { x: 0, y: TY + TS + 30, w: 1920, align: 'center' });
    words.style.fontSize = '58px';
    A.in(tl, words, clamp(at(0, "What's the function", 0.4), tW + 0.7, end(0) - 0.3), 'fadeUp', { dur: 0.6 });
    const qq = C3.ask(stage, 'What did the behavior accomplish?', 960, 560);
    A.in(tl, qq, cue(1) + 0.05, 'fadeUp', { dur: 0.6 });
    // beat 2: the pulling example, small, and its possible function
    const t2 = cue(2);
    tl.to([...wtf, words, qq], { opacity: 0, duration: 0.4 }, t2 - 0.1);
    const W = 420, H = 242, G = 70, CX0 = (1920 - 3 * W - 2 * G) / 2, CY = 280;
    const mini = P.pull.map((o, k) => {
      const c = C3.put(stage, 'va-card', null, { x: CX0 + k * (W + G), y: CY, w: W, h: H });
      c.style.border = '6px solid ' + C.olive;
      pic(c, W - 12, H - 12, o);
      const n = C3.tile(stage, ['A', 'B', 'C'][k], CX0 + k * (W + G) - 24, CY - 24, 70, [COL.A, COL.B, COL.C][k]);
      tl.fromTo([c, n], { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, t2 + 0.2 + k * 0.2);
      return c;
    });
    const tag = C3.fnTag(stage, 'in', 'Reach the tree and *take in the smells*', 960, 590);
    tag.show(tl, clamp(at(2, 'interesting smells', 0.4), t2 + 1.2, end(2) - 0.5));
    // beat 3: not stubborn, not in charge: it works
    const t3 = cue(3);
    const no1 = C3.chip(stage, 'x', 'Stubborn', 560, 800, { col: C.red, size: 34 });
    const no2 = C3.chip(stage, 'x', 'In charge', 840, 800, { col: C.red, size: 34 });
    const yes = C3.chip(stage, 'check', 'Pulling simply *works*', 1150, 800, { col: C.green, size: 34 });
    yes.style.borderColor = C.green;
    A.in(tl, no1, clamp(at(3, 'stubborn', 0.3), t3 + 0.2, end(3) - 1.5), 'pop', { dur: 0.4 });
    A.in(tl, no2, clamp(at(3, 'in charge', 0.3), t3 + 0.6, end(3) - 1.2), 'pop', { dur: 0.4 });
    tl.to([no1, no2], { opacity: 0.45, duration: 0.4 }, clamp(at(3, 'simply works', 0.2), t3 + 1.2, end(3) - 0.6));
    A.in(tl, yes, clamp(at(3, 'simply works', 0.3), t3 + 1.3, end(3) - 0.4), 'pop', { dur: 0.5 });
  });

  // ================================================================== vabcs08 same behavior, different job
  registerScene('vabcs08', ctx => {
    const { stage, tl, cue, end } = ctx;
    setup(ctx);
    const at = (i, p, fb, lead) => sayAt(ctx, i, p, fb, lead);
    C3.head(ctx, 'Same Behavior. Different Job.', { size: 72 });
    const ROWS = [
      { y: 260, ctx: 'While you’re making dinner', icon: 'cookie', res: 'Barking got them *food*', p: 'making dinner', pr: 'got them food' },
      { y: 560, ctx: 'While you’re on a video call', icon: 'eye', res: 'Barking got them *attention*', p: 'video call', pr: 'got them attention' },
    ];
    const W = 400, H = 230, CX = 380;
    const all = [];
    // beat 0: one behavior, barking, before the two situations
    const intro = C3.chip(stage, 'volume-2', 'Same behavior: *barking*', 960, 470, { center: true, size: 48, col: COL.B });
    A.in(tl, intro, clamp(at(0, 'barking', 0.3), cue(0) + 0.6, end(0) - 0.4), 'pop', { dur: 0.5 });
    tl.to(intro, { opacity: 0, y: -20, duration: 0.35 }, cue(1) - 0.1);
    ROWS.forEach((r, k) => {
      const t = cue(1 + k);
      const c = C3.put(stage, 'va-card', null, { x: CX, y: r.y, w: W, h: H });
      c.style.border = '6px solid ' + C.olive;
      pic(c, W - 12, H - 12, k ? { ...P.bark, icons: [['laptop', 355, 140, 70, '#4a4a4a']] } : { ...P.bark, icons: [['chef-hat', 355, 120, 60, '#8c7a5c']] });
      const cl = C2.put(stage, 'c3-lab', r.ctx, { x: CX, y: r.y + H + 10, w: W, align: 'center' });
      cl.style.fontSize = '26px';
      const bk = C3.chip(stage, 'volume-2', 'Bark', CX + W - 20, r.y - 26, { col: COL.B, center: true, size: 30 });
      const ar = arrowSvg(stage, CX + W + 40, CX + W + 200, r.y + H / 2);
      const res = flow(stage, r.icon, r.res, CX + W + 240, r.y + H / 2 - 52, C.green);
      tl.fromTo(c, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' }, t + 0.1);
      A.in(tl, [cl, bk], t + 0.5, 'fadeUp', { dur: 0.5 });
      A.draw(tl, ar, clamp(at(1 + k, r.pr, 0.4), t + 1.2, end(1 + k) - 1.2), 0.5);
      A.in(tl, res, clamp(at(1 + k, r.pr, 0.5), t + 1.5, end(1 + k) - 0.6), 'fadeLeft', { dur: 0.5 });
      all.push(c, cl, bk, ar.ownerSVGElement, res);
    });
    // beat 3: same, different, different
    const t3 = cue(3);
    tl.to(all, { opacity: 0.16, duration: 0.6 }, t3);
    const box = C3.put(stage, 'c3-card', null, { x: 460, y: 300, w: 1000, h: 470 });
    Object.assign(box.style, { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '34px' });
    A.in(tl, box, t3 + 0.1, 'fadeUp', { dur: 0.6 });
    let lo = t3 + 0.3;
    [['Same behavior.', C.ink, 'looks the same'], ['Different outcome.', C.green, 'outcome'], ['Different function.', C.greenDark, 'function are different']].forEach(([tx, col, p], k) => {
      const n = K.el('div', null, tx);
      Object.assign(n.style, { font: '700 62px/1.05 var(--font-head)', color: col, whiteSpace: 'nowrap' });
      box.appendChild(n);
      const tt = clamp(at(3, p, 0.1 + 0.33 * k), lo, end(3) - 0.3);
      A.in(tl, n, tt, 'fadeUp', { dur: 0.5 });
      lo = tt + 0.4;
    });
    // beat 4: the whole picture
    const t4 = cue(4);
    tl.to(box, { opacity: 0, scale: 0.96, duration: 0.4 }, t4);
    tl.to(all, { opacity: 0.3, duration: 0.5 }, t4 + 0.1);
    const pl = C3.chip(stage, 'search', 'Look at the *whole picture* with the ABCs', 960, 470, { center: true, size: 42, col: C.green });
    pl.style.borderColor = C.green;
    A.in(tl, pl, clamp(at(4, 'whole picture', 0.4), t4 + 0.4, end(4) - 0.4), 'pop', { dur: 0.6 });
  });

  // ================================================================== vabcs09 why it keeps happening
  registerScene('vabcs09', ctx => {
    const { stage, tl, cue, end } = ctx;
    setup(ctx);
    const at = (i, p, fb, lead) => sayAt(ctx, i, p, fb, lead);
    C3.head(ctx, 'Why It Keeps Happening', { size: 72 });
    const TS = 140, G = 150, X0 = (1920 - 3 * TS - 2 * G) / 2, Y1 = 270;
    const xs = [0, 1, 2].map(k => X0 + k * (TS + G));
    const sv = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const tiles = ['A', 'B', 'C'].map((L, k) => C3.tile(stage, L, xs[k], Y1, TS, [COL.A, COL.B, COL.C][k]));
    const arr = [0, 1].map(k => { const x0 = xs[k] + TS + 26, x1 = xs[k + 1] - 26, yy = Y1 + TS / 2;
      return K.path(sv, `M ${x0} ${yy} L ${x1} ${yy} M ${x1 - 22} ${yy - 20} L ${x1} ${yy} L ${x1 - 22} ${yy + 20}`, { stroke: C.muted, 'stroke-width': 8 }); });
    tiles.forEach((n, k) => A.in(tl, n, cue(0) + 0.2 + k * 0.3, 'pop', { dur: 0.45 }));
    A.draw(tl, arr, cue(0) + 0.45, 0.35, { stagger: 0.3 });
    const tW = clamp(at(0, 'Because it works', 0.3), cue(0) + 1.2, end(0) - 0.4);
    const ck = C2.badge(stage, 'check', xs[2] + TS - 6, Y1 + 6, 70, C.green, '#fff');
    ck.style.border = '5px solid #fff';
    A.in(tl, ck, tW, 'pop', { dur: 0.45 });
    tl.to(tiles[2], { boxShadow: '0 0 0 10px rgba(97,149,55,0.45), 0 16px 34px rgba(40,60,20,0.22)', scale: 1.08, duration: 0.5 }, tW);
    const w1 = C3.chip(stage, 'check', '*It works*', xs[2] + TS + 50, Y1 + TS / 2 - 34, { col: C.green, size: 36 });
    w1.style.borderColor = C.green;
    A.in(tl, w1, tW + 0.2, 'fadeLeft', { dur: 0.5 });
    const g1 = C2.put(stage, 'c3-mid', 'Gets your dog something they want: <b>more likely to repeat</b>.', { x: 0, y: Y1 + TS + 50, w: 1920, align: 'center' });
    A.in(tl, g1, clamp(at(1, 'more likely', 0.4), cue(1) + 0.2, end(1) - 0.5), 'fadeUp', { dur: 0.5 });
    // beat 2: it pays off only sometimes, so the dog keeps trying
    const t2 = cue(2);
    const PAT = [0, 0, 1, 0, 0, 0, 1, 0];
    const TW = 92, TG = 40, TX0 = (1920 - PAT.length * TW - (PAT.length - 1) * TG) / 2, TY = 640;
    const tries = PAT.map((ok, k) => {
      const n = K.el('div', 'va-try');
      Object.assign(n.style, { left: TX0 + k * (TW + TG) + 'px', top: TY + 'px', background: ok ? C.green : '#c9cdc3' });
      n.appendChild(K.icon(ok ? 'check' : 'x'));
      stage.appendChild(n);
      return n;
    });
    const tP = clamp(at(2, 'pays off only occasionally', 0.2), t2 + 1.0, end(2) - 4);
    tries.forEach((n, k) => A.in(tl, n, tP + k * 0.3, 'pop', { dur: 0.35 }));
    const sl = C2.put(stage, 'c3-lab', 'Pays off only <b>sometimes</b>', { x: 0, y: TY - 60, w: 1920, align: 'center' });
    A.in(tl, sl, tP, 'fade', { dur: 0.4 });
    const kt = C3.chip(stage, 'repeat', 'Your dog *keeps trying*: the hardest to change', 960, 800, { center: true, size: 34, col: C.amber });
    kt.style.borderColor = C.amber;
    A.in(tl, kt, clamp(at(2, 'keeps trying', 0.4), tP + 2.6, end(2) - 0.4), 'pop', { dur: 0.5 });
  });

  // ================================================================== vabcs10 what changing it includes
  registerScene('vabcs10', ctx => {
    const { stage, tl, cue, end } = ctx;
    setup(ctx);
    const at = (i, p, fb, lead) => sayAt(ctx, i, p, fb, lead);
    C3.head(ctx, 'What Changing It Includes', { size: 72 });
    const CARDS = [
      { icon: 'shield-check', col: C.greenDeep, t: 'Management', s: 'Set things up so the old behavior can’t keep working', e: 'e.g. a clear counter, a gate, a long line' },
      { icon: 'heart', col: COL.emo, t: 'Changing emotions', s: 'Help your dog stay calmer, so they’re able to learn', e: '' },
      { icon: 'route', col: C.green, t: 'New behaviors', s: 'Another way to get what they want', e: 'e.g. a loose leash, four paws on the floor, a mat' },
    ];
    const W = 540, G = 50, X0 = (1920 - 3 * W - 2 * G) / 2, Y = 290, H = 600;
    const cards = CARDS.map((c, k) => {
      const n = C3.put(stage, 'c3-card', null, { x: X0 + k * (W + G), y: Y, w: W, h: H });
      Object.assign(n.style, { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '50px 40px', border: '4px dashed #c9d2bf', boxShadow: 'none', background: 'rgba(255,255,255,0.45)' });
      const num = K.el('div', null, String(k + 1));
      Object.assign(num.style, { position: 'absolute', left: '22px', top: '18px', font: '800 40px/1 var(--font-head)', color: '#c9d2bf' });
      n.appendChild(num);
      const inner = K.el('div', null);
      Object.assign(inner.style, { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '26px', textAlign: 'center' });
      const b = K.el('div', null);
      Object.assign(b.style, { width: '150px', height: '150px', borderRadius: '50%', background: c.col, display: 'grid', placeItems: 'center' });
      b.appendChild(K.icon(c.icon, { size: 84, stroke: 2.1, color: '#fff' }));
      inner.appendChild(b);
      inner.appendChild(K.el('div', null, `<span style="font:700 50px/1.1 var(--font-head);color:${c.col}">${c.t}</span>`));
      inner.appendChild(K.el('div', null, `<span style="font:500 32px/1.3 var(--font-body);color:${C.inkSoft}">${c.s}</span>`));
      if (c.e) inner.appendChild(K.el('div', null, `<span style="font:italic 500 28px/1.3 var(--font-body);color:#2f5f8f">${c.e}</span>`));
      n.appendChild(inner);
      gsap.set(inner, { opacity: 0 });
      return { n, inner, b, num, col: c.col };
    });
    A.in(tl, cards.map(c => c.n), clamp(at(0, 'three things', 0.8), cue(0) + 0.5, end(0) - 0.4), 'fade', { dur: 0.5, stagger: 0.12 });
    cards.forEach((c, k) => {
      const t = cue(k + 1) + 0.05;
      tl.to(c.n, { borderColor: c.col, borderStyle: 'solid', backgroundColor: '#ffffff', boxShadow: '0 14px 36px rgba(40,60,20,0.14)', duration: 0.4 }, t);
      tl.to(c.num, { color: c.col, duration: 0.4 }, t);
      tl.fromTo(c.inner, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', immediateRender: false }, t + 0.1);
      tl.fromTo(c.b, { scale: 0.5 }, { scale: 1, duration: 0.6, ease: 'back.out(2)', immediateRender: false }, t + 0.15);
    });
  });

  // ================================================================== vabcs11 the consequence still needs to work
  registerScene('vabcs11', ctx => {
    const { stage, tl, cue, end } = ctx;
    setup(ctx);
    const at = (i, p, fb, lead) => sayAt(ctx, i, p, fb, lead);
    C3.head(ctx, 'The Consequence Still Needs to Work', { size: 68 });
    const top = C3.chip(stage, 'check', 'The consequence *still needs to work* for your dog', 960, 250, { center: true, size: 36, col: C.green });
    top.style.borderColor = C.green;
    A.in(tl, top, cue(0) + 0.3, 'fadeUp', { dur: 0.5 });
    // beat 1: what the dog still wants
    const WANT = [['tree-deciduous', 'Explore', 'explore'], ['eye', 'Attention', 'attention'], ['cookie', 'Something good to eat', 'good to eat']];
    const wants = WANT.map(([ic, tx, p], k) => {
      const f = flow(stage, ic, tx, [360, 760, 1160][k] - (k === 2 ? 30 : 0), 420, [C.green, C.green, C.green][k]);
      A.in(tl, f, clamp(at(1, p, 0.3 + 0.2 * k), cue(1) + 0.3 + k * 0.3, end(1) - 0.5), 'fadeUp', { dur: 0.45 });
      return f;
    });
    const keep = C2.put(stage, 'c3-mid', 'We’re changing <b>which behavior earns it</b>.', { x: 0, y: 600, w: 1920, align: 'center' });
    A.in(tl, keep, clamp(at(1, 'which behavior', 0.4), cue(1) + 1.5, end(1) - 0.3), 'fadeUp', { dur: 0.5 });
    // beat 2: before / now
    const t2 = cue(2);
    tl.to([...wants, keep], { opacity: 0, duration: 0.4 }, t2);
    const row = (tag, tagCol, bIcon, bTx, cIcon, cTx, y, t) => {
      const tg = C2.put(stage, 'va-tag', tag, { x: 250, y: y + 22 });
      tg.style.background = tagCol;
      const b = flow(stage, bIcon, bTx, 470, y, COL.B, 470);
      const ar = arrowSvg(stage, 970, 1110, y + 51);
      const c = flow(stage, cIcon, cTx, 1140, y, COL.C, 470);
      A.in(tl, tg, t, 'fadeRight', { dur: 0.4 });
      A.in(tl, b, t + 0.2, 'fadeUp', { dur: 0.5 });
      A.draw(tl, ar, t + 0.6, 0.4);
      A.in(tl, c, t + 0.9, 'fadeLeft', { dur: 0.5 });
      return { tg, b, ar: ar.ownerSVGElement, c };
    };
    const r1 = row('Before', C.red, 'dog', 'Pulling<i>the old behavior</i>', 'tree-deciduous', 'Reaches the tree', 400, clamp(at(2, 'Before', 0.1), t2 + 0.2, end(2) - 3));
    const r2 = row('Now', C.green, 'footprints', 'Loose leash walking<i>the new behavior</i>', 'tree-deciduous', 'Reaches the tree', 600, clamp(at(2, 'Now', 0.1), t2 + 2.0, end(2) - 1.2));
    // beat 3: same consequence
    const t3 = cue(3);
    [r1.c, r2.c].forEach(c => tl.to(c, { borderColor: C.green, duration: 0.4 }, t3 + 0.2));
    tl.to(r1.b, { opacity: 0.45, duration: 0.4 }, t3 + 0.2);
    const same = C3.chip(stage, 'repeat', 'Same consequence. *A better behavior* in its place.', 960, 820, { center: true, size: 34, col: C.green });
    same.style.borderColor = C.green;
    A.in(tl, same, clamp(at(3, 'better behavior', 0.4), t3 + 0.6, end(3) - 0.3), 'pop', { dur: 0.5 });
    // beat 4: recall
    const t4 = cue(4);
    tl.to([...Object.values(r1), ...Object.values(r2), same], { opacity: 0, duration: 0.4 }, t4);
    const r3 = row('Recall', C.greenDark, 'undo-2', 'Comes when called', 'gift', 'A reward, and often<br>back to sniffing', 470, t4 + 0.5);
    const worth = C3.chip(stage, 'check', 'Coming when called is *worth it*', 960, 720, { center: true, size: 36, col: C.green });
    worth.style.borderColor = C.green;
    A.in(tl, worth, clamp(at(4, 'worth it', 0.4), t4 + 2.0, end(4) - 0.3), 'pop', { dur: 0.5 });
  });

  // ================================================================== vabcs12 building a new path (chapter 3's lawn + a neural pathway)
  registerScene('vabcs12', ctx => {
    const { stage, tl, cue, end } = ctx;
    setup(ctx);
    const at = (i, p, fb, lead) => sayAt(ctx, i, p, fb, lead);
    C3.head(ctx, 'Building a New Path', { size: 72 });
    const VW = 980, VH = 530, S = 1.32, LW = VW * S, LH = VH * S, LX = (1920 - LW) / 2, LY = 248;
    const lawn = K.svg(stage, { x: LX, y: LY, w: LW, h: LH, viewBox: `0 0 ${VW} ${VH}` });
    const defs = K.svgEl('defs', {}, lawn);
    const g = K.svgEl('linearGradient', { id: 'va-lawn', x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    K.svgEl('stop', { offset: '0', 'stop-color': '#d6e9bf' }, g);
    K.svgEl('stop', { offset: '1', 'stop-color': '#a7cb80' }, g);
    const clip = K.svgEl('clipPath', { id: 'va-lawnclip' }, defs);
    K.rect(clip, 0, 0, VW, VH, { rx: 26 });
    const reveal = K.svgEl('clipPath', { id: 'va-newclip', clipPathUnits: 'userSpaceOnUse' }, defs);
    const revealR = K.rect(reveal, -40, 0, 0, VH, { fill: '#fff' });
    const body = K.group(lawn, { 'clip-path': 'url(#va-lawnclip)' });
    K.rect(body, 0, 0, VW, VH, { fill: 'url(#va-lawn)' });
    let seed = 7;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    for (let i = 0; i < 52; i++) {
      const x = 30 + rnd() * (VW - 60), y = 40 + rnd() * (VH - 60), s = 0.8 + rnd() * 0.6;
      K.path(body, `M ${x} ${y} l ${-7 * s} ${-20 * s} M ${x} ${y} l 0 ${-26 * s} M ${x} ${y} l ${7 * s} ${-20 * s}`,
        { stroke: rnd() > 0.5 ? '#86b556' : '#79a94b', 'stroke-width': 4, opacity: 0.55 + rnd() * 0.35 });
    }
    const pathD = 'M -30 380 C 190 385, 305 275, 500 242 S 815 132, 1010 56';
    const newD = 'M -30 482 C 220 482, 362 405, 552 377 S 858 316, 1010 288';
    const worn = K.path(body, pathD, { stroke: '#cdb285', 'stroke-width': 0 });
    const wornIn = K.path(body, pathD, { stroke: '#b8966a', 'stroke-width': 0, opacity: 0.75 });
    const trace = K.path(body, pathD, { stroke: '#8d7a55', 'stroke-width': 4, 'stroke-dasharray': '14 12', opacity: 0 });
    const dotted = K.path(body, pathD, { stroke: '#6f6446', 'stroke-width': 7, 'stroke-dasharray': '0.1 24', opacity: 0.6 });
    const newWorn = K.path(body, newD, { stroke: '#cdb285', 'stroke-width': 0 });
    const freshG = K.group(body, { 'clip-path': 'url(#va-newclip)' });
    K.path(freshG, newD, { stroke: '#ffffff', 'stroke-width': 20, 'stroke-dasharray': '0.1 26', opacity: 0.75 });
    K.path(freshG, newD, { stroke: C.greenDark, 'stroke-width': 12, 'stroke-dasharray': '0.1 26' });
    const grassG = K.group(body);
    const tufts = [];
    const len = worn.getTotalLength();
    for (let j = 0; j < 30; j++) {
      const p = worn.getPointAtLength(len * (0.2 + 0.78 * j / 29));
      const x = p.x + ((j * 37) % 34) - 17, y = p.y + ((j * 53) % 30) - 15, s = 0.9 + (j % 3) * 0.2;
      const tf = K.group(grassG, { transform: `translate(${x} ${y})` });
      const inner = K.group(tf);
      K.path(inner, `M 0 0 l ${-7 * s} ${-20 * s} M 0 0 l 0 ${-26 * s} M 0 0 l ${7 * s} ${-20 * s}`, { stroke: j % 2 ? '#86b556' : '#79a94b', 'stroke-width': 4.5 });
      gsap.set(inner, { scale: 0, svgOrigin: '0 0' });
      tufts.push(inner);
    }
    const gp = worn.getPointAtLength(len * 0.14);
    const gate = K.group(body, { transform: `translate(${gp.x} ${gp.y})` });
    const gIn = K.group(gate);
    for (let k = -2; k <= 2; k++) K.rect(gIn, -8 + k * 24, -62, 13, 124, { rx: 5, fill: '#ffffff', stroke: C.greenDeep, 'stroke-width': 3.5 });
    K.rect(gIn, -66, -36, 132, 13, { rx: 5, fill: '#ffffff', stroke: C.greenDeep, 'stroke-width': 3.5 });
    K.rect(gIn, -66, 22, 132, 13, { rx: 5, fill: '#ffffff', stroke: C.greenDeep, 'stroke-width': 3.5 });
    gsap.set(gIn, { opacity: 0 });
    K.rect(lawn, 2, 2, VW - 4, VH - 4, { rx: 25, fill: 'none', stroke: '#ffffff', 'stroke-width': 4, opacity: 0.7 });
    lawn.style.filter = 'drop-shadow(0 18px 40px rgba(40,60,20,0.16))';
    const st = (x, y) => [LX + x * S, LY + y * S];
    const pill = (icon, text, col, x, y) => {
      const n = K.el('div', 'c3p-pill');
      n.style.color = col;
      n.appendChild(K.icon(icon));
      n.appendChild(K.el('span', null, text));
      const [sx, sy] = st(x, y);
      Object.assign(n.style, { left: sx + 'px', top: sy + 'px' });
      stage.appendChild(n);
      return n;
    };
    const oldP = pill('dog', 'Old path: e.g. pulling', C.red, 640, 110);
    const newP = pill('sprout', 'New path: e.g. loose leash walking', C.greenDark, 430, 405);
    const gateP = pill('shield-check', 'Management', C.greenDeep, 40, 220);

    // beat 0: the old path wears in
    tl.fromTo(lawn, { opacity: 0, scale: 0.96, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' }, cue(0) + 0.1);
    const w1 = clamp(at(0, 'path worn', 0.3), cue(0) + 0.9, end(0) - 3);
    tl.set(worn, { attr: { 'stroke-width': 12 } }, w1);
    A.draw(tl, worn, w1, 0.9, { ease: 'power1.inOut' });
    tl.to(worn, { attr: { 'stroke-width': 40 }, duration: 0.7, ease: 'power2.out' }, w1 + 1.0);
    const w3 = clamp(at(0, 'more defined', 0.5), w1 + 1.8, end(0) - 0.6);
    tl.to(worn, { attr: { 'stroke-width': 78 }, duration: 0.8, ease: 'power2.out' }, w3);
    tl.to(wornIn, { attr: { 'stroke-width': 34 }, duration: 0.8, ease: 'power2.out' }, w3 + 0.1);
    tl.to(dotted, { opacity: 0.25, duration: 0.6 }, w3);
    A.in(tl, oldP, w1 + 0.5, 'fadeUp', { dur: 0.5 });

    // beat 1: the brain: a neural pathway that strengthens with every repeat
    const t1 = cue(1);
    // Tori's brain picture (mg_brain.png, from the Management videos): the pathway lights up and thickens with each repeat
    const card = C3.put(stage, 'c3-card', null, { x: 260, y: 270, w: 1400, h: 640 });
    const NAT = [682, 788], BH = 580, BW = Math.round(BH * NAT[0] / NAT[1]);
    const bimg = K.el('img');
    bimg.src = '../assets/img/mg_brain.png';
    Object.assign(bimg.style, { position: 'absolute', left: '40px', top: '30px', width: BW + 'px', height: BH + 'px' });
    card.appendChild(bimg);
    const nv = K.svg(card, { x: 40, y: 30, w: BW, h: BH, viewBox: `0 0 ${NAT[0]} ${NAT[1]}` });
    const ROUTE = [[330, 140], [318, 295], [218, 352], [160, 460], [145, 570]];
    const routeD = 'M ' + ROUTE.map(p => p.join(' ')).join(' L ');
    const link = K.path(nv, routeD, { fill: 'none', stroke: '#d9963a', 'stroke-width': 0, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0.9 });
    const pulses = [0, 1, 2].map(() => K.circle(nv, ROUTE[0][0], ROUTE[0][1], 16, { fill: C.amber, stroke: '#fff', 'stroke-width': 5, opacity: 0 }));
    const nt = K.el('div', null, '<span style="font:700 52px/1.1 var(--font-head);color:#3f6b22">The neural pathway<br>in the brain</span>');
    Object.assign(nt.style, { position: 'absolute', left: (BW + 110) + 'px', top: '120px' });
    card.appendChild(nt);
    const ns = K.el('div', null, `<span style="font:600 36px/1.35 var(--font-body);color:${C.inkSoft}">Each repeat makes it<br><b style="color:${C.greenDark}">stronger, faster,<br>more automatic</b></span>`);
    Object.assign(ns.style, { position: 'absolute', left: (BW + 110) + 'px', top: '300px' });
    card.appendChild(ns);
    const rep = K.el('div', null, '');
    Object.assign(rep.style, { position: 'absolute', left: (BW + 110) + 'px', top: '500px', display: 'flex', gap: '18px' });
    card.appendChild(rep);
    const reps = [0, 1, 2].map(k => { const d = K.el('div', 'va-try'); Object.assign(d.style, { position: 'relative', width: '70px', height: '70px', background: C.amber });
      d.appendChild(K.icon('repeat')); rep.appendChild(d); return d; });
    gsap.set(ns, { opacity: 0 });
    tl.to([lawn, oldP], { opacity: 0.15, duration: 0.5 }, t1 + 0.1);
    A.in(tl, card, t1 + 0.4, 'fadeUp', { dur: 0.6 });
    const tN = clamp(at(1, 'neural pathway', 0.2), t1 + 1.0, end(1) - 6);
    pulses.forEach((p, r) => {
      const t0 = tN + r * 1.6, step = 0.28 - r * 0.06;
      tl.set(p, { attr: { cx: ROUTE[0][0], cy: ROUTE[0][1] }, opacity: 1 }, t0);
      ROUTE.slice(1).forEach((pt, k) => tl.to(p, { attr: { cx: pt[0], cy: pt[1] }, duration: step, ease: 'none' }, t0 + k * step));
      tl.to(p, { opacity: 0, duration: 0.2 }, t0 + 4 * step);
      tl.to(link, { attr: { 'stroke-width': 8 + r * 9 }, duration: 0.5 }, t0 + 0.4);
      A.in(tl, reps[r], t0, 'pop', { dur: 0.35 });
    });
    A.in(tl, ns, clamp(at(1, 'more automatic', 0.4), tN + 3.5, end(1) - 0.5), 'fadeUp', { dur: 0.5 });
    tl.to(card, { opacity: 0, y: 20, duration: 0.5 }, end(1) - 0.2);
    tl.to([lawn, oldP], { opacity: 1, duration: 0.5 }, end(1));

    // beat 2: the new path appears, then wears in with practice
    const t2 = cue(2);
    tl.fromTo(revealR, { attr: { width: 0 } }, { attr: { width: VW + 80 }, duration: 1.6, ease: 'power1.inOut' }, t2 + 0.3);
    A.in(tl, newP, t2 + 1.2, 'pop', { dur: 0.55 });
    const tS = clamp(at(2, 'With practice', 0.3), t2 + 2.2, end(2) - 1);
    tl.set(newWorn, { attr: { 'stroke-width': 10 } }, tS - 0.6);
    A.draw(tl, newWorn, tS - 0.6, 0.6);
    tl.to(newWorn, { attr: { 'stroke-width': 60 }, duration: 1.0, ease: 'power2.out' }, tS);

    // beat 3: management gates the old path; the grass grows back
    const t3 = cue(3);
    const tG = clamp(at(3, 'management', 0.2), t3 + 0.2, end(3) - 3);
    tl.fromTo(gIn, { opacity: 0, y: -60 }, { opacity: 1, y: 0, duration: 0.6, ease: 'bounce.out' }, tG);
    A.in(tl, gateP, tG + 0.4, 'fadeUp', { dur: 0.5 });
    const tGr = clamp(at(3, 'grass', 0.7), tG + 1.0, end(3) - 1.5);
    tufts.forEach((tf, j) => tl.to(tf, { scale: 1, svgOrigin: '0 0', duration: 0.5, ease: 'back.out(2)' }, tGr + j * 0.04));
    tl.to(worn, { attr: { 'stroke-width': 16 }, opacity: 0.45, duration: 1.4, ease: 'power2.inOut' }, tGr);
    tl.to(wornIn, { attr: { 'stroke-width': 0 }, duration: 1.2 }, tGr);
    tl.to(dotted, { opacity: 0, duration: 0.8 }, tGr);
    tl.to(oldP, { opacity: 0.5, duration: 0.6 }, tGr);

    // beat 4: a faint trace; one success wears it back in
    const t4 = cue(4);
    tl.to(trace, { opacity: 0.85, duration: 0.5 }, t4 + 0.2);
    tl.to(trace, { opacity: 0.4, duration: 0.4, yoyo: true, repeat: 3 }, t4 + 0.8);
    const tA = clamp(at(4, 'occasional success', 0.2), t4 + 1.6, end(4) - 3);
    tl.to(gIn, { opacity: 0.3, duration: 0.4 }, tA);
    tl.to(trace, { opacity: 0, duration: 0.3 }, tA);
    tufts.forEach((tf, j) => tl.to(tf, { scale: 0, svgOrigin: '0 0', duration: 0.3 }, tA + 0.3 + j * 0.05));
    tl.to(dotted, { opacity: 0.6, duration: 0.5 }, tA + 0.3);
    tl.to(worn, { attr: { 'stroke-width': 78 }, opacity: 1, duration: 1.8, ease: 'power2.out' }, tA + 0.6);
    tl.to(wornIn, { attr: { 'stroke-width': 34 }, duration: 1.6 }, tA + 0.9);
    tl.to(oldP, { opacity: 1, duration: 0.4 }, tA + 0.6);
    const cb = C3.chip(stage, 'triangle-alert', 'Consistency matters', 0, 0, { col: C.amber, size: 30 });
    const [cx, cy] = st(40, 30);
    Object.assign(cb.style, { left: cx + 'px', top: cy + 'px' });
    A.in(tl, cb, clamp(at(4, 'consistency', 0.4), tA + 1.4, end(4) - 0.3), 'pop', { dur: 0.45 });
  });

  // ================================================================== vabcs13 your homework
  registerScene('vabcs13', ctx => {
    const { stage, tl, cue, end } = ctx;
    setup(ctx);
    const at = (i, p, fb, lead) => sayAt(ctx, i, p, fb, lead);
    C3.head(ctx, 'Your Homework', { size: 72 });
    const WX = 110, WY = 240, WW = 1020, RH = 128;
    const sheet = C3.put(stage, 'c3-card', null, { x: WX, y: WY, w: WW, h: 5 * RH + 40 });
    A.in(tl, sheet, cue(0) + 0.2, 'fadeUp', { dur: 0.7 });
    const ROWS = [
      { L: 'A', col: COL.A, q: 'What happened <b>just before</b>?', ex: 'e.g. Stepped outside', p: 'just before' },
      { L: 'A', col: COL.A, q: 'Where were you? <b>What was going on</b>?', ex: 'e.g. Front walk, a tree up ahead', p: 'where you were' },
      { L: 'B', col: COL.B, q: 'What did your dog <b>do</b>?', ex: 'e.g. Pulled toward the tree', p: 'what your dog did' },
      { L: 'C', col: COL.C, q: 'What happened <b>as a result</b>?', ex: 'e.g. Reached the tree', p: 'as a result' },
      { L: 'fn', col: C.green, q: 'What did the behavior <b>accomplish</b>?', ex: 'e.g. Get to the tree?', p: '' },
    ];
    const rows = ROWS.map((r, k) => {
      const y = 20 + k * RH;
      const hl = C3.put(sheet, 'c3-card', null, { x: 12, y: y + 4, w: WW - 24, h: RH - 8 });
      Object.assign(hl.style, { background: r.L === 'fn' ? C.pale : '#f6f8f2', boxShadow: 'none', border: 'none', opacity: 0 });
      const lt = K.el('div', 'c3-tile', r.L === 'fn' ? '' : r.L);
      Object.assign(lt.style, { left: '30px', top: y + 18 + 'px', width: '88px', height: '88px', background: r.col, fontSize: '52px', borderWidth: '4px', borderRadius: '20px' });
      if (r.L === 'fn') lt.appendChild(K.icon('target', { size: 50, stroke: 2.4 }));
      sheet.appendChild(lt);
      const q = C3.put(sheet, 'c3-lab', r.q, { x: 146, y: y + 16 });
      q.style.fontSize = '32px';
      const ln = K.el('div', null);
      Object.assign(ln.style, { position: 'absolute', left: '146px', right: '40px', top: y + 104 + 'px', height: '0', borderTop: '3px dashed #c9d2bf' });
      sheet.appendChild(ln);
      const ex = C3.put(sheet, 'c3-lab', r.ex, { x: 160, y: y + 60 });
      Object.assign(ex.style, { font: 'italic 600 34px/1.1 var(--font-body)', color: '#2f5f8f' });
      gsap.set(ex, { clipPath: 'inset(0 100% 0 0)' });
      return { hl, ex };
    });
    const write = (k, t) => tl.to(rows[k].ex, { clipPath: 'inset(0 0% 0 0)', duration: 0.9, ease: 'none' }, t);
    let cur = -1;
    const focus = (k, t) => { if (cur >= 0) tl.to(rows[cur].hl, { opacity: 0, duration: 0.3 }, t); tl.to(rows[k].hl, { opacity: 1, duration: 0.3 }, t); cur = k; };
    // beat 0: one behavior
    const one = C3.row(stage, 'target', 'Choose <b>one</b> everyday<br>behavior', 1180, 320, { col: C.green, size: 40 });
    A.in(tl, one, cue(0) + 0.6, 'fadeLeft', { dur: 0.5 });
    const eg = C2.put(stage, 'c3-lab', '<i style="color:#2f5f8f">e.g. pulling on the leash</i>', { x: 1264, y: 440 });
    A.in(tl, eg, cue(0) + 1.1, 'fade', { dur: 0.5 });
    // beat 1: the four rows fill as they are said
    const t1 = cue(1);
    tl.to([one, eg], { opacity: 0, duration: 0.4 }, t1);
    let lo = t1 + 0.2;
    ROWS.slice(0, 4).forEach((r, k) => {
      const tt = clamp(at(1, r.p, 0.2 + 0.2 * k), lo, end(1) - 0.8);
      focus(k, tt);
      write(k, tt + 0.3);
      lo = tt + 1.0;
    });
    // beat 2: WTF
    const t2 = cue(2);
    focus(4, t2 + 0.1);
    const tW = clamp(at(2, 'WTF', 0.25), t2 + 0.3, end(2) - 3);
    const TS = 150, TX0 = 1210;
    const tiles = ['W', 'T', 'F'].map((L, k) => C3.tile(stage, L, TX0 + k * (TS + 40), 300, TS, k === 2 ? C.green : COL.A));
    tiles.forEach((n, k) => tl.fromTo(n, { opacity: 0, y: -80, rotation: [-8, 4, -4][k] }, { opacity: 1, y: 0, rotation: 0, duration: 0.6, ease: 'bounce.out' }, tW + k * 0.15));
    const words = C2.put(stage, 'c3-big', '<b>W</b>hat’s <b>T</b>he <b>F</b>unction?', { x: 1180, y: 510, w: 640, align: 'center' });
    words.style.fontSize = '56px';
    A.in(tl, words, clamp(at(2, "What's the function", 0.5), tW + 0.8, end(2) - 1.5), 'fadeUp', { dur: 0.6 });
    write(4, clamp(at(2, 'accomplish', 0.8), tW + 1.5, end(2) - 0.6));
    // beat 3: look for the pattern
    const t3 = cue(3);
    tl.to([...tiles, words], { opacity: 0, duration: 0.4 }, t3);
    tl.to(rows[4].hl, { opacity: 0, duration: 0.3 }, t3);
    const pat = C3.row(stage, 'repeat', 'After a few days:<br><b>look for the pattern</b>', 1180, 380, { col: C.green, size: 40 });
    A.in(tl, pat, clamp(at(3, 'pattern', 0.4), t3 + 0.4, end(3) - 0.3), 'fadeLeft', { dur: 0.5 });
  });

  // ================================================================== vabcs14 see the whole picture, logo close
  registerScene('vabcs14', ctx => {
    const { stage, tl, cue, end, dur } = ctx;
    setup(ctx);
    const at = (i, p, fb, lead) => sayAt(ctx, i, p, fb, lead);
    const h = C3.head(ctx, 'See the Whole Picture', { size: 72 });
    const big = C2.put(stage, 'c3-mid', 'Every behavior makes sense once you see <b>the whole picture</b>.', { x: 0, y: 290, w: 1920, align: 'center' });
    big.style.fontSize = '44px';
    A.in(tl, big, cue(0) + 0.3, 'fadeUp', { dur: 0.6 });
    const R = [['search', 'Identify the <b>antecedent</b>', 'antecedent', COL.A], ['map-pin', 'Understand the <b>context</b>', 'context', COL.B], ['repeat', 'Recognize the <b>pattern</b>', 'pattern', COL.C]];
    let lo = cue(1) + 0.2;
    const rows = R.map(([ic, tx, p, col], k) => {
      const r = C3.row(stage, ic, tx, 700, 430 + k * 130, { col, size: 48 });
      const tt = clamp(at(1, p, 0.3), lo, end(1) - 1);
      A.in(tl, r, tt, 'fadeLeft', { dur: 0.5 });
      lo = tt + 0.4;
      return r;
    });
    const ch = C3.chip(stage, 'route', 'Then you can *change it*', 960, 850, { center: true, size: 38, col: C.green });
    ch.style.borderColor = C.green;
    A.in(tl, ch, clamp(at(1, 'change it', 0.4), lo, end(1) - 0.2), 'pop', { dur: 0.5 });
    SKIT.logoClose(ctx, Math.min(end(1) + 1.6, dur - 2.6), [h.root, big, ch, ...rows]);
  });
})();
