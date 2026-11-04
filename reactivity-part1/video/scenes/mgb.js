// Management: The Basics, Part 3 (the golden rule), first half.
//   mg03s01  100% consistency: a ring fills and counts to 100%; "Good enough" struck out
//   mg03s02  everyone has to follow the plan: every time, every person; four people cards; red callout
//   mg03s03  practice makes perfectly unwanted behaviors: Tori's dog picture; a path in the woods wears in with each walk; rehearsals
//   mg03s04  one pathway fades as another forms: Tori's brain picture; the old route fades, the new one lights up
(() => {
  const { at, put, clamp } = TM;
  const CSS = `
  .mgb-pct { position: absolute; width: 520px; text-align: center; font: 800 150px/1 var(--font-head); color: var(--green); letter-spacing: -2px; }
  .mgb-pct small { font-size: 0.5em; }
  .mgb-rule { position: absolute; font: 700 46px/1.2 var(--font-head); color: var(--ink); }
  .mgb-rule b { color: var(--green); }
  .mgb-sm { position: absolute; font: 600 36px/1.3 var(--font-body); color: var(--ink-soft); }
  .mgb-pc { position: absolute; box-sizing: border-box; display: flex; align-items: center; gap: 24px; padding: 18px 28px; border-radius: 22px; background: #fff;
    border: 1px solid #e6e9e1; box-shadow: var(--shadow-soft); }
  .mgb-pc .ic { width: 76px; height: 76px; border-radius: 50%; background: var(--green-pale); color: var(--green-dark); display: grid; place-items: center; flex: 0 0 auto; }
  .mgb-pc .ic svg { width: 40px; height: 40px; stroke-width: 2.2; }
  .mgb-pc .t { font: 700 34px/1.1 var(--font-head); color: var(--ink); }
  .mgb-pc .s { margin-top: 6px; font: 500 27px/1.3 var(--font-body); color: var(--ink-soft); }
  .mgb-woods { position: absolute; border-radius: 26px; background: var(--green-mist); border: 2px solid #e3ecd6; overflow: hidden; }
  .mgb-tree { position: absolute; color: #8fb86a; }
  .mgb-tree svg { width: 64px; height: 64px; stroke-width: 2; }
  .mgb-pass { position: absolute; font: 700 27px/1 var(--font-body); color: var(--green-dark); background: #fff; padding: 10px 18px; border-radius: 999px; box-shadow: var(--shadow-soft); white-space: nowrap; }
  `;
  const css = stage => { MG.css(stage); if (!stage.querySelector('style[data-mgb]')) { const s = K.el('style', null, CSS); s.dataset.mgb = '1'; stage.appendChild(s); } };
  const flow = n => { n.style.position = 'relative'; n.style.left = n.style.top = ''; return n; };

  // ---------------------------------------------------------------- 100% consistency
  registerScene('mg03s01', ctx => {
    const { stage, tl, cue, end } = ctx;
    css(stage);
    TM.head(ctx, 'The golden rule', 'The golden rule: 100% consistency');
    // the ring fills as the number counts up to 100
    const CX = 560, CY = 610, R = 250;
    const sv = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    K.circle(sv, CX, CY, R, { fill: '#fff', stroke: '#e8f1dc', 'stroke-width': 34 });
    const arc = K.circle(sv, CX, CY, R, { fill: 'none', stroke: 'var(--green)', 'stroke-width': 34, 'stroke-linecap': 'round', transform: `rotate(-90 ${CX} ${CY})` });
    const pct = put(stage, K.el('div', 'mgb-pct', '<span>0</span><small>%</small>'), CX - 260, CY - 80);
    const num = pct.querySelector('span');
    const t0 = at(ctx, 0, 'one hundred percent', 0.75) - 1.2;
    tl.fromTo([sv, pct], { opacity: 0, scale: 0.92, transformOrigin: `${CX}px ${CY}px` }, { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' }, 0.3);
    A.draw(tl, arc, Math.max(0.6, t0), 1.6);
    A.count(tl, num, Math.max(0.6, t0), 0, 100, 1.6, v => Math.round(v));
    // the rule at right
    const r1 = put(stage, K.el('div', 'mgb-sm', 'There is one rule, and only one:'), 940, 400, { width: '880px' });
    A.in(tl, r1, at(ctx, 0, 'one rule', 0.1), 'fadeUp', { dur: 0.6 });
    const r2 = put(stage, K.el('div', 'mgb-rule', 'Management must be followed <b>100% of the time</b>.'), 940, 470, { width: '860px', fontSize: '58px' });
    A.in(tl, r2, at(ctx, 0, 'management must', 0.4), 'fadeUp', { dur: 0.7 });
    // not good enough
    const row = put(stage, K.el('div'), 940, 720, { position: 'absolute', display: 'flex', alignItems: 'center', gap: '22px' });
    const ge = flow(TM.word(row, '“Good enough”', { variant: 'red', cross: true, size: 38 }));
    const ge2 = flow(put(row, K.el('div', 'tm-lab', 'isn’t good enough here.'), 0, 0, { fontSize: '38px', color: 'var(--ink-soft)' }));
    const tG = at(ctx, 1, 'good enough', 0.6);
    A.in(tl, ge, tG, 'pop', { dur: 0.45 });
    TM.strike(tl, ge, tG + 0.45);
    A.in(tl, ge2, tG + 0.6, 'fadeRight', { dur: 0.5 });
    A.pulse(tl, pct, tG + 0.9, { scale: 1.06 });
  });

  // ---------------------------------------------------------------- everyone has to follow the plan
  registerScene('mg03s02', ctx => {
    const { stage, tl, cue, end } = ctx;
    css(stage);
    TM.head(ctx, 'Consistency across everyone', 'Everyone has to follow the plan');
    // every time, every person
    const row = put(stage, K.el('div'), 100, 300, { position: 'absolute', display: 'flex', alignItems: 'center', gap: '18px' });
    const et = flow(TM.word(row, 'Every time', { variant: 'pale', icon: 'clock', size: 36 }));
    const plus = flow(put(row, K.el('div', 'tm-lab', '+'), 0, 0, { fontSize: '44px', color: 'var(--green)' }));
    const ep = flow(TM.word(row, 'Every person', { variant: 'green', icon: 'users', size: 36 }));
    A.in(tl, et, at(ctx, 0, 'every time', 0.3), 'pop', { dur: 0.45 });
    A.in(tl, [plus, ep], at(ctx, 0, 'every person', 0.75), 'pop', { dur: 0.45, stagger: 0.1 });
    const why = put(stage, K.el('div', 'mgb-sm', 'Your dog can’t tell the difference between <b style="color:var(--ink)">a rule that bends</b> for one person and <b style="color:var(--ink)">a rule that doesn’t exist</b>.'),
      100, 410, { width: '800px', fontSize: '34px' });
    A.in(tl, why, cue(1) + 0.1, 'fadeUp', { dur: 0.7 });
    const call = MG.callout(stage, 'One person who lets it slide teaches your dog <b>the rule is optional</b>. That’s all it takes to bring the reaction back.', { x: 100, y: 660, w: 800, variant: 'red', size: 33 });
    tl.fromTo(call, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, cue(6) + 0.05);
    tl.to(why, { opacity: 0.55, duration: 0.5 }, cue(6));
    // the four people cards at right
    const P = [['users', 'Family and kids', 'The same gates, cues, and routines.'], ['house', 'House guests', 'Brief them before they arrive, every time.'],
      ['clipboard-list', 'Walkers and sitters', 'Written instructions, no exceptions.'], ['door-closed', 'Whoever answers the door', 'The plan runs, even when you’re busy or out.']];
    P.forEach(([ic, t, s], i) => {
      const c = put(stage, K.el('div', 'mgb-pc'), 980, 292 + i * 160, { width: '840px', height: '140px' });
      c.innerHTML = `<div class="ic">${K.icon(ic).outerHTML}</div><div><div class="t">${t}</div><div class="s">${s}</div></div>`;
      tl.fromTo(c, { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' }, cue(2 + i) + 0.05);
    });
  });

  // ---------------------------------------------------------------- practice makes perfectly unwanted behaviors
  registerScene('mg03s03', ctx => {
    const { stage, tl, cue, end } = ctx;
    css(stage);
    TM.head(ctx, 'Why prevention matters', 'Practice makes perfectly unwanted behaviors', { w: 1480, size: 60 });
    const { w, h } = MG.fit([1050, 1400], 480, 640);
    const ph = TM.pic(stage, 'mg_practice.jpg', { x: 100, y: 300, w, h, nat: [1050, 1400], radius: 22 });
    tl.fromTo(ph.wrap, { opacity: 0, y: 40, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out' }, 0.35);
    const X = 100 + w + 70, W = 1820 - X;
    const lead = put(stage, K.el('div', 'mg-lead', 'Every time your dog performs an action, <b>that pathway gets stronger</b>.'), X, 300, { width: W + 'px', fontSize: '38px' });
    A.in(tl, lead, at(ctx, 0, 'every time', 0.45), 'fadeUp', { dur: 0.7 });

    // a path in the woods: faint the first time, worn in after many walks; a paw walks it each time
    const PY = 420, PH = 280;
    const woods = put(stage, K.el('div', 'mgb-woods'), X, PY, { width: W + 'px', height: PH + 'px' });
    // trees along the edges, clear of the trail
    [[0.5, 12], [0.64, 10], [0.78, 14], [0.38, 196], [0.52, 200], [0.88, 186]].forEach(([fx, ty]) => put(woods, K.el('div', 'mgb-tree', K.icon('trees').outerHTML), Math.round(fx * W), ty));
    const sv = K.svg(woods, { x: 0, y: 0, w: W, h: PH });
    const d = `M -20 ${PH - 70} C ${W * 0.2} ${PH - 40}, ${W * 0.3} 80, ${W * 0.5} 130 S ${W * 0.8} ${PH - 30}, ${W + 20} 70`;
    const trail = K.path(sv, d, { fill: 'none', stroke: '#b9926a', 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-dasharray': '4 18', opacity: 0.45 });
    const t1 = at(ctx, 1, 'path in the woods', 0.15);
    A.in(tl, woods, t1, 'fadeUp', { dur: 0.7 });
    const paw = K.el('div', 'mga-paw');
    Object.assign(paw.style, { position: 'absolute', width: '54px', height: '54px', borderRadius: '50%', background: '#fff', border: '4px solid var(--green)', display: 'grid', placeItems: 'center', left: '-27px', top: '-27px', boxShadow: '0 8px 18px rgba(40,60,20,0.2)' });
    paw.appendChild(K.icon('paw-print'));
    paw.firstChild.style.cssText = 'width:28px;height:28px;color:var(--green-dark)';
    woods.appendChild(paw);
    tl.set(paw, { opacity: 0 }, 0);
    const walk = (t, dur) => {
      tl.set(paw, { opacity: 1 }, t);
      tl.fromTo(paw, { motionPath: { path: trail, align: trail, alignOrigin: [0.5, 0.5], start: 0, end: 0 } },
        { motionPath: { path: trail, align: trail, alignOrigin: [0.5, 0.5], start: 0, end: 1 }, duration: dur, ease: 'none', immediateRender: false }, t);
      tl.set(paw, { opacity: 0 }, t + dur);
    };
    const pass = (txt, t) => { const n = put(woods, K.el('div', 'mgb-pass', txt), 22, 18); A.in(tl, n, t, 'fadeUp', { dur: 0.4 }); return n; };
    const tA = at(ctx, 1, 'first time', 0.3);
    walk(tA - 0.3, 1.8);
    const p1 = pass('The first time: barely visible', tA + 0.2);
    const tB = at(ctx, 1, 'the more it', 0.6);
    tl.to(p1, { opacity: 0, duration: 0.3 }, tB - 0.2);
    walk(tB, 1.1);
    tl.to(trail, { attr: { 'stroke-width': 14, 'stroke-dasharray': '1 0' }, opacity: 0.7, duration: 1.1, ease: 'power1.inOut' }, tB);
    walk(tB + 1.15, 0.9);
    tl.to(trail, { attr: { 'stroke-width': 26 }, opacity: 0.95, duration: 0.9, ease: 'power1.inOut' }, tB + 1.15);
    pass('Walked often: easy to follow', tB + 1.4);

    // the rehearsals
    const rr = put(stage, K.el('div'), X, PY + PH + 40, { position: 'absolute', display: 'flex', flexWrap: 'wrap', gap: '16px', width: W + 'px' });
    [['Jumping on guests', 'jumping'], ['Barking at the mail carrier', 'barking']].forEach(([t, p], k) => {
      const n = flow(TM.word(rr, t, { variant: 'red', icon: 'repeat', size: 30 }));
      A.in(tl, n, at(ctx, 2, p, 0.2 + 0.3 * k), 'pop', { dur: 0.45 });
    });
    const call = MG.callout(stage, 'Every rehearsal makes the behavior <b>more automatic</b>, and <b>much harder to change</b> later.', { x: X, y: 0, w: W, variant: 'red', size: 32 });
    call.style.top = (300 + h - call.offsetHeight) + 'px';
    tl.fromTo(call, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, cue(3) + 0.05);
  });

  // ---------------------------------------------------------------- one pathway fades as another forms
  registerScene('mg03s04', ctx => {
    const { stage, tl, cue, end } = ctx;
    css(stage);
    TM.head(ctx, 'Rewiring the brain', 'One pathway fades as another forms');
    const NAT = [682, 788];
    const { w, h } = MG.fit(NAT, 560, 640);
    const ph = TM.pic(stage, 'mg_brain.png', { x: 160, y: 300, w, h, nat: NAT, radius: 0, border: 0 });
    ph.root.style.background = 'transparent';
    ph.root.style.boxShadow = 'none';
    tl.fromTo(ph.wrap, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out' }, 0.35);
    const F = (x, y) => ph.P(x / NAT[0], y / NAT[1]);
    const OLD = [[318, 295], [218, 352], [160, 460], [145, 570]].map(p => F(...p));
    const NEW = [[330, 283], [440, 352], [500, 460], [533, 568]].map(p => F(...p));
    const TOP = F(330, 140);
    // beat 0: both ways: a ring at the start of both routes
    TM.fx.ring(tl, ph.sv, TOP, at(ctx, 0, 'both ways', 0.5), { r: 26, n: 2 });

    // beat 1: the old route pulses red, then fades under a soft wash of the brain's own colour
    const t1 = at(ctx, 1, 'no rehearsals', 0.1);
    TM.fx.dots(tl, ph.sv, OLD, t1, { color: '#b8452d', r: 5, gap: 14, dur: 0.9, hold: 0.8 });
    const fog = K.group(ph.sv);
    OLD.forEach((p, i) => K.circle(fog, p[0], p[1], 34, { fill: '#e3ecd6', stroke: 'none' }));
    K.path(fog, 'M ' + OLD.map(p => p.join(' ')).join(' L '), { fill: 'none', stroke: '#e3ecd6', 'stroke-width': 30, 'stroke-linecap': 'round' });
    tl.set(fog, { opacity: 0 }, 0);
    tl.to(fog, { opacity: 0.82, duration: 1.4, ease: 'power1.inOut' }, at(ctx, 1, 'old reaction fades', 0.8) - 0.2);
    const r1 = TM.row(stage, 'arrow-down', 'The old reaction <b style="color:var(--red)">fades</b>', { size: 38 });
    put(stage, r1, 900, 360, { position: 'absolute' });
    r1.querySelector('.ic').style.cssText += ';background:var(--red-pale);color:var(--red)';
    const s1 = put(stage, K.el('div', 'mgb-sm', 'With no rehearsals to keep it worn in, the brain stops maintaining the route.'), 986, 440, { width: '830px', fontSize: '30px' });
    A.in(tl, [r1, s1], t1, 'fadeRight', { dur: 0.6, stagger: 0.12 });

    // beat 2: the new route lights up node by node to the check
    const t2 = at(ctx, 2, 'each training rep', 0.1);
    const nl = K.path(ph.sv, 'M ' + NEW.map(p => p.join(' ')).join(' L '), { fill: 'none', stroke: '#619537', 'stroke-width': 12, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
    A.draw(tl, nl, t2 + 0.3, 1.6);
    NEW.slice(1).forEach((p, i) => TM.fx.ring(tl, ph.sv, p, t2 + 0.6 + i * 0.5, { r: 22 }));
    TM.fx.ring(tl, ph.sv, NEW[3], at(ctx, 2, 'replacement behaviors', 0.8), { r: 40, n: 2 });
    const r2 = TM.row(stage, 'arrow-up', 'A new calm response <b>forms</b>', { size: 38 });
    put(stage, r2, 900, 590, { position: 'absolute' });
    const s2 = put(stage, K.el('div', 'mgb-sm', 'Each training rep strengthens a new pathway: calm emotions and replacement behaviors.'), 986, 670, { width: '830px', fontSize: '30px' });
    A.in(tl, [r2, s2], t2, 'fadeRight', { dur: 0.6, stagger: 0.12 });

    // beat 3: the banner
    const bn = put(stage, K.el('div', 'tm-banner'), 900, 830, { width: '920px', boxSizing: 'border-box', fontSize: '33px' });
    bn.appendChild(K.icon('brain'));
    bn.appendChild(K.el('span', null, 'Management weakens the old pathway. <b>Training builds the new one.</b>'));
    tl.fromTo(bn, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, cue(3) + 0.05);
  });
})();
