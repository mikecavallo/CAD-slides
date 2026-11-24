// Management: Everyday Manners: welcome and Part 1 (why management matters).
//   em00intro  title slide (shared kit)
//   em00plan   plan slide: What you'll learn, Why it matters
//   em01s01    practice makes perfect: Tori's boxer picture; habits we love (green) and don't want (red); what works gets repeated
//   em01s02    building pathways: Tori's brain picture, the old pathway in red; a path in the woods wears in; the new pathway in green
//   em01s03    management and training: two cards, management's everyday tools, You need both
//   em01s04    the foundation: Tori's house, levelled; floors = new behaviors; a crack opens and the house shifts
//   em01s05    everyone follows the plan: every time + every person; red callout; four people cards
(() => {
  const { at, put } = TM;
  const CSS = `
  .ema-woods { position: absolute; border-radius: 26px; background: var(--green-mist); border: 2px solid #e3ecd6; overflow: hidden; }
  .ema-tree { position: absolute; color: #8fb86a; }
  .ema-tree svg { width: 60px; height: 60px; stroke-width: 2; }
  .ema-pass { position: absolute; font: 700 26px/1 var(--font-body); color: var(--green-dark); background: #fff; padding: 10px 18px; border-radius: 999px; box-shadow: var(--shadow-soft); white-space: nowrap; }
  .ema-paw { position: absolute; width: 54px; height: 54px; left: -27px; top: -27px; border-radius: 50%; background: #fff; border: 4px solid var(--green); display: grid; place-items: center;
    box-shadow: 0 8px 18px rgba(40,60,20,0.2); box-sizing: border-box; }
  .ema-paw svg { width: 28px; height: 28px; color: var(--green-dark); stroke-width: 2.4; }
  .ema-blk { position: absolute; box-sizing: border-box; border-radius: 26px; padding: 30px 36px; display: flex; flex-direction: column; gap: 18px; }
  .ema-blk .top { display: flex; align-items: center; gap: 20px; }
  .ema-blk .ic { width: 80px; height: 80px; border-radius: 50%; display: grid; place-items: center; flex: 0 0 auto; }
  .ema-blk .ic svg { width: 42px; height: 42px; stroke-width: 2.2; }
  .ema-blk .t { font: 700 46px/1 var(--font-head); }
  .ema-blk .s { font: 600 31px/1.35 var(--font-body); }
  .ema-blk.mgmt { background: var(--green); color: #fff; box-shadow: 0 20px 44px rgba(63,107,34,0.3); }
  .ema-blk.mgmt .ic { background: #fff; color: var(--green-dark); }
  .ema-blk.mgmt .s { color: #f3f8ec; }
  .ema-blk.trn { background: #fff; border: 1px solid #e6e9e1; box-shadow: var(--shadow-soft); color: var(--ink); }
  .ema-blk.trn .ic { background: var(--green-pale); color: var(--green-dark); }
  .ema-blk.trn .s { color: var(--ink-soft); }
  .ema-tools { display: flex; flex-wrap: wrap; gap: 12px; }
  .ema-tools .tm-word { position: relative; left: auto; top: auto; background: rgba(255,255,255,0.16); border-color: rgba(255,255,255,0.55); color: #fff; box-shadow: none; }
  .ema-pc { position: absolute; box-sizing: border-box; display: flex; align-items: center; gap: 24px; padding: 18px 28px; border-radius: 22px; background: #fff;
    border: 1px solid #e6e9e1; box-shadow: var(--shadow-soft); }
  .ema-pc .ic { width: 76px; height: 76px; border-radius: 50%; background: var(--green-pale); color: var(--green-dark); display: grid; place-items: center; flex: 0 0 auto; }
  .ema-pc .ic svg { width: 40px; height: 40px; stroke-width: 2.2; }
  .ema-pc .t { font: 700 34px/1.1 var(--font-head); color: var(--ink); }
  .ema-pc .s { margin-top: 6px; font: 500 27px/1.3 var(--font-body); color: var(--ink-soft); }
  .ema-sm { position: absolute; font: 600 34px/1.3 var(--font-body); color: var(--ink-soft); }
  .ema-grp { position: absolute; display: flex; flex-direction: column; gap: 16px; }
  .ema-grp .k { font: 700 25px/1 var(--font-body); letter-spacing: 3px; text-transform: uppercase; }
  .ema-grp .chips { display: flex; flex-wrap: wrap; gap: 14px; }
  .ema-grp .tm-word { position: relative; left: auto; top: auto; }
  `;
  const css = stage => { EM.css(stage); if (!stage.querySelector('style[data-ema]')) { const s = K.el('style', null, CSS); s.dataset.ema = '1'; stage.appendChild(s); } };
  const flow = n => { n.style.position = 'relative'; n.style.left = n.style.top = ''; return n; };

  registerScene('em00intro', ctx => SKIT.titleSlide(ctx));

  registerScene('em00plan', ctx => SKIT.planSlide(ctx, [
    { ...SKIT.PLAN.gain, lab: 'What you’ll learn', rows: ['Why management matters', 'How practice shapes the brain', 'Five everyday situations'],
      rowIcons: ['shield-check', 'brain', 'house'], rowBg: 'var(--green-pale)', rowFg: 'var(--green-dark)' },
    { ...SKIT.PLAN.why, text: 'Get this right, and the manners you teach *actually stick*.' },
  ], [
    [['why management matters', 0.15], ['how practice shapes', 0.35], ['five everyday situations', 0.4]],
    [],
  ]));

  // ---------------------------------------------------------------- practice makes perfect
  registerScene('em01s01', ctx => {
    const { stage, tl, cue } = ctx;
    css(stage);
    TM.head(ctx, 'Why management matters', 'Practice makes perfect');
    const { w, h } = MG.fit([1050, 1400], 460, 620);
    const ph = TM.pic(stage, 'mg_practice.jpg', { x: 100, y: 300, w, h, nat: [1050, 1400], radius: 22 });
    tl.fromTo(ph.wrap, { opacity: 0, y: 40, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out' }, 0.35);
    const X = 100 + w + 80, W = 1820 - X;
    const lead = put(stage, K.el('div', 'mg-lead', 'What gets practiced <b>gets better</b>.'), X, 300, { width: W + 'px', fontSize: '46px' });
    A.in(tl, lead, at(ctx, 0, 'what gets practiced', 0.1), 'fadeUp', { dur: 0.7 });

    const grp = (y, cls, k, items, beat) => {
      const g = put(stage, K.el('div', 'ema-grp'), X, y, { width: W + 'px' });
      const kk = K.el('div', 'k', k); kk.style.color = cls === 'red' ? 'var(--red)' : 'var(--green-dark)'; g.appendChild(kk);
      const row = K.el('div', 'chips'); g.appendChild(row);
      A.in(tl, kk, cue(beat) + 0.05, 'fadeUp', { dur: 0.5 });
      items.forEach(([t, ic, p], i) => { const n = flow(TM.word(row, t, { variant: cls === 'red' ? 'red' : 'green', icon: ic, size: 30 })); A.in(tl, n, at(ctx, beat, p, 0.2), 'pop', { dur: 0.45 }); });
      return g;
    };
    const g1 = grp(410, 'green', 'The things we love', [['Sitting politely', 'paw-print', 'sitting'], ['Coming when called', 'arrow-left', 'coming']], 1);
    const g2 = grp(g1.offsetTop + g1.offsetHeight + 40, 'red', 'The things we don’t want', [['Jumping on guests', 'repeat', 'jumping'], ['Counter surfing', 'cookie', 'counter'], ['Pulling on the leash', 'move-right', 'pulling']], 2);
    const call = MG.callout(stage, 'Your dog isn’t being bad. <b>What works gets repeated.</b>', { x: X, y: g2.offsetTop + g2.offsetHeight + 50, w: W, size: 36 });
    tl.fromTo(call, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, cue(3) + 0.05);
    A.pulse(tl, g2, at(ctx, 3, 'every time it works', 0.3), { scale: 1.03 });
  });

  // ---------------------------------------------------------------- building pathways (the brain, and a path in the woods)
  registerScene('em01s02', ctx => {
    const { stage, tl, cue } = ctx;
    css(stage);
    TM.head(ctx, 'Why management matters', 'Building pathways');
    const NAT = [682, 788];
    const { w, h } = MG.fit(NAT, 520, 600);
    const ph = TM.pic(stage, 'mg_brain.png', { x: 130, y: 310, w, h, nat: NAT, radius: 0, border: 0 });
    ph.root.style.background = 'transparent';
    ph.root.style.boxShadow = 'none';
    tl.fromTo(ph.wrap, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out' }, 0.35);
    const F = (x, y) => ph.P(x / NAT[0], y / NAT[1]);
    const OLD = [[318, 295], [218, 352], [160, 460], [145, 570]].map(p => F(...p));
    const NEW = [[330, 283], [440, 352], [500, 460], [533, 568]].map(p => F(...p));

    // beat 0: the pathway for the behavior gets stronger (the old route, red)
    const t0 = at(ctx, 0, 'neural pathway', 0.2);
    const old = K.path(ph.sv, 'M ' + OLD.map(p => p.join(' ')).join(' L '), { fill: 'none', stroke: '#b8452d', 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
    A.draw(tl, old, t0, 0.9);
    tl.to(old, { attr: { 'stroke-width': 12 }, duration: 0.8 }, at(ctx, 0, 'gets stronger', 0.3));
    const lead = put(stage, K.el('div', 'mg-lead', 'Every time your dog does a behavior, <b>its pathway in the brain gets stronger</b>.'), 760, 300, { width: '1060px', fontSize: '38px' });
    A.in(tl, lead, cue(0) + 0.3, 'fadeUp', { dur: 0.7 });

    // beat 1: a path in the woods wears in
    const X = 760, W = 1060, PY = lead.offsetTop + lead.offsetHeight + 34, PH = 250;
    const woods = put(stage, K.el('div', 'ema-woods'), X, PY, { width: W + 'px', height: PH + 'px' });
    [[0.5, 10], [0.64, 8], [0.78, 12], [0.36, 184], [0.5, 184], [0.88, 180]].forEach(([fx, ty]) => put(woods, K.el('div', 'ema-tree', K.icon('trees').outerHTML), Math.round(fx * W), ty));
    const sv = K.svg(woods, { x: 0, y: 0, w: W, h: PH });
    const d = `M -20 ${PH - 70} C ${W * 0.2} ${PH - 40}, ${W * 0.3} 80, ${W * 0.5} 130 S ${W * 0.8} ${PH - 30}, ${W + 20} 70`;
    const trail = K.path(sv, d, { fill: 'none', stroke: '#b9926a', 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-dasharray': '4 18', opacity: 0.45 });
    const t1 = at(ctx, 1, 'path in the woods', 0.1);
    A.in(tl, woods, t1, 'fadeUp', { dur: 0.7 });
    const paw = K.el('div', 'ema-paw', K.icon('paw-print').outerHTML);
    woods.appendChild(paw);
    tl.set(paw, { opacity: 0 }, 0);
    const walk = (t, dur) => {
      tl.set(paw, { opacity: 1 }, t);
      tl.fromTo(paw, { motionPath: { path: trail, align: trail, alignOrigin: [0.5, 0.5], start: 0, end: 0 } },
        { motionPath: { path: trail, align: trail, alignOrigin: [0.5, 0.5], start: 0, end: 1 }, duration: dur, ease: 'none', immediateRender: false }, t);
      tl.set(paw, { opacity: 0 }, t + dur);
    };
    const pass = (txt, t) => { const n = put(woods, K.el('div', 'ema-pass', txt), 22, 18); A.in(tl, n, t, 'fadeUp', { dur: 0.4 }); return n; };
    const tA = at(ctx, 1, 'first time', 0.2);
    walk(tA - 0.3, 1.8);
    const p1 = pass('The first time: barely visible', tA + 0.2);
    const tB = at(ctx, 1, 'the more it', 0.5);
    tl.to(p1, { opacity: 0, duration: 0.3 }, tB - 0.2);
    walk(tB, 1.1);
    tl.to(trail, { attr: { 'stroke-width': 14, 'stroke-dasharray': '1 0' }, opacity: 0.7, duration: 1.1, ease: 'power1.inOut' }, tB);
    walk(tB + 1.15, 0.9);
    tl.to(trail, { attr: { 'stroke-width': 26 }, opacity: 0.95, duration: 0.9, ease: 'power1.inOut' }, tB + 1.15);
    pass('Walked often: easy to follow', tB + 1.4);

    // beat 2: the most walked paths become habits
    const r = TM.row(stage, 'paw-print', 'The paths they walk most <b>become their habits</b>.', { size: 34 });
    put(stage, r, X, PY + PH + 40, { position: 'absolute', width: W + 'px' });
    A.in(tl, r, cue(2) + 0.1, 'fadeRight', { dur: 0.6 });

    // beat 3: off the old path (fades), onto a new one (green)
    const t3 = cue(3) + 0.1;
    const fog = K.group(ph.sv);
    OLD.forEach(p => K.circle(fog, p[0], p[1], 30, { fill: '#e3ecd6', stroke: 'none' }));
    K.path(fog, 'M ' + OLD.map(p => p.join(' ')).join(' L '), { fill: 'none', stroke: '#e3ecd6', 'stroke-width': 28, 'stroke-linecap': 'round' });
    tl.set(fog, { opacity: 0 }, 0);
    tl.to(fog, { opacity: 0.85, duration: 1.2, ease: 'power1.inOut' }, at(ctx, 3, 'off the old path', 0.3));
    tl.to(old, { opacity: 0.25, duration: 1.2 }, at(ctx, 3, 'off the old path', 0.3));
    const nl = K.path(ph.sv, 'M ' + NEW.map(p => p.join(' ')).join(' L '), { fill: 'none', stroke: '#619537', 'stroke-width': 12, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
    const tN = at(ctx, 3, 'walk a new one', 0.1);
    A.draw(tl, nl, tN, 1.3);
    NEW.slice(1).forEach((p, i) => TM.fx.ring(tl, ph.sv, p, tN + 0.3 + i * 0.4, { r: 22 }));
    TM.fx.tag(tl, ph.wrap, 'Old path', Math.round(w * 0.0), Math.round(h * 0.86), t0 + 0.5, 'red').style.fontSize = '26px';
    TM.fx.tag(tl, ph.wrap, 'New path', Math.round(w * 0.62), Math.round(h * 0.86), tN + 0.4, 'green').style.fontSize = '26px';
    const bn = put(stage, K.el('div', 'tm-banner'), X, 0, { width: W + 'px', boxSizing: 'border-box', fontSize: '33px' });
    bn.appendChild(K.icon('route'));
    bn.appendChild(K.el('span', null, 'Off the old path. <b>Onto a new one.</b>'));
    bn.style.top = (r.offsetTop + r.offsetHeight + 40) + 'px';
    tl.fromTo(bn, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, t3);
  });

  // ---------------------------------------------------------------- management and training
  registerScene('em01s03', ctx => {
    const { stage, tl, cue } = ctx;
    css(stage);
    TM.head(ctx, 'Why management matters', 'Management and training');
    const blk = (cls, ic, t, s, x, y, w, h) => {
      const b = put(stage, K.el('div', 'ema-blk ' + cls), x, y, { width: w + 'px', height: h + 'px' });
      b.innerHTML = `<div class="top"><div class="ic">${K.icon(ic).outerHTML}</div><div class="t">${t}</div></div><div class="s">${K.md(s)}</div>`;
      return b;
    };
    const mg = blk('mgmt', 'shield-check', 'Management', 'Set up your dog’s world so they <b style="color:#fff">can’t practice</b> the behavior you don’t want.', 100, 300, 840, 480);
    const tools = K.el('div', 'ema-tools'); mg.appendChild(tools);
    tl.fromTo(mg, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, cue(0) + 0.3);
    [['A gate', 'fence', 'gate'], ['A leash', 'link', 'leash'], ['A crate', 'box', 'crate'], ['A closed door', 'door-closed', 'closed door'], ['Food put away', 'cookie', 'food put away']].forEach(([t, ic, p]) => {
      const n = flow(TM.word(tools, t, { icon: ic, size: 28 }));
      A.in(tl, n, at(ctx, 1, p, 0.3), 'pop', { dur: 0.4 });
    });
    const tr = blk('trn', 'graduation-cap', 'Training', 'Teaches your dog *what to do instead*, and makes that choice *worth it*.', 980, 300, 840, 480);
    tl.fromTo(tr, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, cue(2) + 0.05);
    const sub = (b, html, t) => { const n = K.el('div', 's', html); n.style.marginTop = 'auto'; n.style.fontWeight = 700; b.appendChild(n); A.in(tl, n, t, 'fadeUp', { dur: 0.6 }); };
    sub(mg, '<span style="display:inline-flex;align-items:center;gap:12px">Stops the old habit from <b style="color:#fff">getting stronger</b></span>', at(ctx, 3, 'stops the old habit', 0.3));
    sub(tr, 'Builds <b style="color:var(--green-dark)">the new one</b>', at(ctx, 3, 'builds the new one', 0.3));
    const bn = put(stage, K.el('div', 'tm-banner'), 100, 830, { width: '1720px', boxSizing: 'border-box', justifyContent: 'center', fontSize: '38px', background: 'var(--green-deep)' });
    bn.appendChild(K.icon('handshake'));
    bn.appendChild(K.el('span', null, 'You need <b>both</b>.'));
    tl.fromTo(bn, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, at(ctx, 3, 'you need both', 0.2));
  });

  // ---------------------------------------------------------------- the foundation: Tori's house (levelled layers from Management: The Basics)
  const NAT = [1268, 1052], SLAB = 885, TH = 3, PIV = [630, 878];
  const lev = ([x, y]) => {
    if (y >= SLAB) return [x, y];
    const t = TH * Math.PI / 180, dx = x - PIV[0], dy = y - PIV[1];
    return [PIV[0] + dx * Math.cos(t) - dy * Math.sin(t), PIV[1] + dx * Math.sin(t) + dy * Math.cos(t)];
  };
  const CRACK_SLAB = [[656, 1020], [622, 988], [668, 958], [610, 935], [636, 887]];
  const CRACK_BODY = [[636, 884], [598, 840], [648, 790], [596, 720], [640, 652], [598, 585], [645, 510], [600, 445]].map(lev);
  const BRANCH = [[[598, 585], [528, 574]], [[640, 652], [720, 622]], [[596, 720], [531, 712]], [[648, 790], [718, 756]]].map(p => p.map(lev));

  registerScene('em01s04', ctx => {
    const { stage, tl, cue } = ctx;
    css(stage);
    TM.head(ctx, 'Why management matters', 'The foundation');
    const { w, h } = MG.fit(NAT, 760, 620);
    const X0 = 100, Y0 = 320, sx = w / NAT[0], sy = h / NAT[1];
    const F = ([x, y]) => [x * sx, y * sy];
    const box = put(stage, K.el('div'), X0, Y0, { position: 'absolute', width: w + 'px', height: h + 'px' });
    const layer = src => {
      const d = put(box, K.el('div'), 0, 0, { position: 'absolute', width: w + 'px', height: h + 'px' });
      const img = put(d, K.el('img'), 0, 0, { position: 'absolute', width: w + 'px', height: h + 'px' });
      img.src = '../assets/img/' + src;
      const sv = K.svg(d, { x: 0, y: 0, w, h });
      sv.style.overflow = 'visible';
      return { d, img, sv };
    };
    const body = layer('mg_house_body.png');
    body.d.style.transformOrigin = `${(197 / NAT[0]) * 100}% ${(SLAB / NAT[1]) * 100}%`;
    const slab = layer('mg_house_slab.png');
    const pathOf = pts => 'M ' + pts.map(p => F(p).join(' ')).join(' L ');
    const CW = Math.max(5, w * 0.009);
    const X = X0 + w + 80, W = 1820 - X;

    // beat 0: the foundation (management), then the floors start going up (training)
    tl.fromTo(slab.d, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, at(ctx, 0, 'management is the foundation', 0.1));
    const tagM = TM.fx.tag(tl, box, 'Management', Math.round(w * 0.05), Math.round(h * 0.865), at(ctx, 0, 'foundation', 0.5), 'green');
    tagM.style.fontSize = '28px';
    const l1 = put(stage, K.el('div', 'mg-lead', '<b>Management</b> is the foundation. <b>Training</b> builds the floors on top.'), X, 320, { width: W + 'px', fontSize: '38px' });
    A.in(tl, l1, cue(0) + 0.3, 'fadeUp', { dur: 0.6 });
    tl.set(body.img, { clipPath: 'inset(84.2% 0% 0% 0%)' }, 0);
    const tF = at(ctx, 0, 'training builds', 0.2);
    tl.to(body.img, { clipPath: 'inset(62% 0% 0% 0%)', duration: 0.5, ease: 'power2.out' }, tF);

    // beat 1: every new behavior is another floor
    const floors = [['Sit at the door', 'sitting at the door', 39.4], ['Wait for the bowl', 'waiting for the bowl', 17.6], ['Loose leash walking', 'loose leash', 0]];
    const fcol = put(stage, K.el('div'), X, 0, { position: 'absolute', width: W + 'px', display: 'flex', flexWrap: 'wrap', gap: '14px' });
    fcol.style.top = (l1.offsetTop + l1.offsetHeight + 30) + 'px';
    floors.forEach(([t, p, clip]) => {
      const tt = at(ctx, 1, p, 0.2);
      tl.to(body.img, { clipPath: `inset(${clip}% 0% 0% 0%)`, duration: 0.5, ease: 'power2.out' }, tt);
      const n = flow(TM.word(fcol, t, { variant: 'pale', icon: 'arrow-up', size: 28 }));
      n.style.alignSelf = 'flex-start';
      A.in(tl, n, tt, 'fadeRight', { dur: 0.45 });
    });

    // beat 2: a crack in the foundation; the whole house shifts. Every rehearsal is a crack.
    const tC = at(ctx, 2, 'has a crack', 0.3);
    tl.to([l1, fcol], { opacity: 0.45, duration: 0.5 }, cue(2));
    const c1 = K.path(slab.sv, pathOf(CRACK_SLAB), { fill: 'none', stroke: '#c4491f', 'stroke-width': CW, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' });
    A.draw(tl, c1, tC, 0.7);
    const c2 = K.path(body.sv, pathOf(CRACK_BODY), { fill: 'none', stroke: '#c4491f', 'stroke-width': CW, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' });
    const tS = at(ctx, 2, 'starts to shift', 0.1);
    A.draw(tl, c2, tS, 1.2);
    BRANCH.forEach(([p, q], k) => {
      const br = K.path(body.sv, `M ${F(p).join(' ')} L ${F(q).join(' ')}`, { fill: 'none', stroke: '#c4491f', 'stroke-width': Math.max(3, w * 0.006), 'stroke-linecap': 'round' });
      A.draw(tl, br, tS + 0.8 - 0.15 * k, 0.4);
    });
    tl.to(body.d, { rotation: 2.5, duration: 1.3, ease: 'power2.inOut' }, tS + 0.3);
    const tag2 = TM.fx.tag(tl, box, 'Rehearsal', Math.round(w * 0.6), Math.round(h * 0.865), at(ctx, 2, 'practices what', 0.2), 'red');
    Object.assign(tag2.style, { fontSize: '28px', background: '#fff' });
    const call = MG.callout(stage, 'Every time your dog practices what you don’t want, <b>that’s a crack</b>.', { x: X, y: 0, w: W, variant: 'red', size: 34 });
    call.style.top = (fcol.offsetTop + fcol.offsetHeight + 44) + 'px';
    tl.fromTo(call, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, at(ctx, 2, 'every time', 0.1));

    // beat 3: keep it solid and it holds
    const call2 = MG.callout(stage, 'Keep it solid, and <b>new behaviors hold</b>.', { x: X, y: 0, w: W, size: 34 });
    call2.style.top = (call.offsetTop + call.offsetHeight + 24) + 'px';
    tl.fromTo(call2, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, cue(3) + 0.05);
    A.pulse(tl, tagM, cue(3) + 0.4, { scale: 1.12 });
  });

  // ---------------------------------------------------------------- everyone follows the plan
  registerScene('em01s05', ctx => {
    const { stage, tl, cue } = ctx;
    css(stage);
    TM.head(ctx, 'Why management matters', 'Everyone follows the plan');
    const row = put(stage, K.el('div'), 100, 310, { position: 'absolute', display: 'flex', alignItems: 'center', gap: '18px' });
    const et = flow(TM.word(row, 'Every time', { variant: 'pale', icon: 'clock', size: 36 }));
    const plus = flow(put(row, K.el('div', 'tm-lab', '+'), 0, 0, { fontSize: '44px', color: 'var(--green)' }));
    const ep = flow(TM.word(row, 'Every person', { variant: 'green', icon: 'users', size: 36 }));
    A.in(tl, ep, at(ctx, 0, 'everyone', 0.2), 'pop', { dur: 0.45 });
    A.in(tl, [plus, et], at(ctx, 0, 'every time', 0.3), 'pop', { dur: 0.45, stagger: 0.1 });
    const call = MG.callout(stage, 'One person who lets the puppy jump up, or slips food from the table, teaches your dog <b>the rule is optional</b>.', { x: 100, y: 450, w: 800, variant: 'red', size: 34 });
    tl.fromTo(call, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, cue(1) + 0.05);
    const P = [['house', 'Family', 'The same gates, rules, and routines.', 'family'], ['baby', 'Kids', 'Simple jobs they can follow.', 'kids'],
      ['door-open', 'Guests', 'A quick heads up before they come in.', 'guests'], ['clipboard-list', 'Walkers and sitters', 'Written instructions, no exceptions.', 'dog walkers']];
    P.forEach(([ic, t, s, p], i) => {
      const c = put(stage, K.el('div', 'ema-pc'), 980, 300 + i * 160, { width: '840px', height: '140px' });
      c.innerHTML = `<div class="ic">${K.icon(ic).outerHTML}</div><div><div class="t">${t}</div><div class="s">${s}</div></div>`;
      tl.fromTo(c, { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' }, at(ctx, 2, p, 0.1));
    });
  });
})();
