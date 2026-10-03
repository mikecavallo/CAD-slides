// Chapter 3: why behavior repeats.
//   ch03s12  When behavior works   A, B, C ring; a dot runs the loop each time C works (distance, closer, keeps it); more likely again
//   ch03s13  The ABC cycle         before / during / after training photo strips with the emotional response on the A to B arrow,
//                                  an arousal and stress meter under each panel and a loop arrow; then the two paths on a lawn
//                                  (new one wears in, old one fades but stays, comes back with practice, management fences it);
//                                  then three cards: what the dog needs from C and their arousal, before / during / after
(() => {
  const { sayAt, clamp } = C1;
  const { COL } = C3;
  const C = C1.C;

  // ================================================================== ch03s12 When behavior works
  registerScene('ch03s12', ctx => {
    const { stage, tl, cue, end, dur } = ctx;
    C2.style(stage);
    C3.css(stage);
    const at = (i, p, fb, lead) => sayAt(ctx, i, p, fb, lead);
    C3.head(ctx, 'When Behavior Works', { size: 72 });

    const CX = 500, CY = 600, R = 230;
    const RG = C3.cycle(stage, CX, CY, R, { d: 140 });
    const nodes = RG.nodes.map(n => n.el);
    // ---------- beat 0: the ring
    tl.fromTo(nodes, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.6, stagger: 0.15, ease: 'back.out(1.6)' }, cue(0) + 0.1);
    A.draw(tl, RG.arcs, cue(0) + 0.4, 0.7, { stagger: 0.2 });
    tl.fromTo(RG.heads, { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.2 }, cue(0) + 1.0);
    const sub = C3.put(stage, 'c3-mid', 'When behavior <b>works</b>, it is more likely to be <b>used again</b>.', { x: 920, y: 250, w: 880 });
    sub.style.fontSize = '42px';
    A.in(tl, sub, clamp(at(0, 'when a behavior works', 0.5), cue(0) + 0.5, end(0) - 0.3), 'fadeUp', { dur: 0.6 });

    // a dot that runs the loop from A back to A
    const ringD = `M ${CX} ${CY - R} A ${R} ${R} 0 1 1 ${CX - 0.01} ${CY - R}`;
    const guide = K.path(RG.svg, ringD, { stroke: 'none', opacity: 0 });
    const dot = K.circle(RG.svg, 0, 0, 18, { fill: C.greenDark, opacity: 0 });
    const glow = K.circle(RG.svg, 0, 0, 34, { fill: C.green, opacity: 0 });
    const lap = (t, d = 2.2) => {
      tl.fromTo([dot, glow], { opacity: 0 }, { opacity: (i) => (i ? 0.25 : 1), duration: 0.2, immediateRender: false }, t);
      tl.fromTo([dot, glow], { motionPath: { path: guide, align: guide, alignOrigin: [0.5, 0.5], start: 0, end: 0 } },
        { motionPath: { path: guide, align: guide, alignOrigin: [0.5, 0.5], start: 0, end: 1 }, duration: d, ease: 'power1.inOut', immediateRender: false }, t);
      tl.to([dot, glow], { opacity: 0, duration: 0.3 }, t + d);
      tl.to(RG.arcs[2], { attr: { 'stroke-width': 18 }, stroke: C.green, duration: 0.3, yoyo: true, repeat: 1 }, t + d * 0.72);
      A.pulse(tl, nodes[0], t + d - 0.1);
    };

    // ---------- beats 1 to 3: what C did, a row each, the loop runs
    const EX = [
      { b: 1, kind: 'out', beh: 'Barking', res: 'distance', p: 'creates the distance', pl: 'more likely' },
      { b: 2, kind: 'in', beh: 'Barking', res: 'closer, attention', p: 'brings someone closer', pl: 'repeated' },
      { b: 3, kind: 'shield', beh: 'Bark, growl, snap', res: 'keeps it', p: 'keep something valuable', pl: 'used again' },
    ];
    let prevTag = null;
    EX.forEach((e, k) => {
      const t = cue(e.b);
      const tRes = clamp(at(e.b, e.p, 0.3), t + 0.1, end(e.b) - 2.4);
      // the C node shows what happened
      const [nx, ny] = [RG.nodes[2].x, RG.nodes[2].y];
      const tag = K.el('div', 'c3-chip');
      const ib = K.el('div', 'ic');
      if (e.kind === 'shield') ib.appendChild(K.icon('shield'));
      else C3.arrows(ib, e.kind === 'in', '#fff', 30, 8);
      tag.appendChild(ib);
      tag.appendChild(K.el('span', null, e.res[0].toUpperCase() + e.res.slice(1)));
      Object.assign(tag.style, { left: nx + 'px', top: ny + 92 + 'px', borderColor: C.green });
      stage.appendChild(tag);
      gsap.set(tag, { xPercent: -50 });
      if (prevTag) tl.to(prevTag, { opacity: 0, y: 10, duration: 0.3 }, tRes - 0.3);
      tl.fromTo(tag, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, tRes);
      prevTag = tag;
      // the row at right
      const row = C3.row(stage, 'check', `${e.beh} → <b>${e.res}</b>`, 920, 420 + k * 112, { size: 34 });
      A.in(tl, row, tRes + 0.1, 'fadeLeft', { dur: 0.5 });
      const ag = C3.chip(stage, 'repeat', 'Again', 0, 0, { size: 28, col: C.greenDark });
      ag.style.position = 'relative';
      ag.style.left = '0';
      ag.style.top = '0';
      ag.style.marginLeft = '10px';
      row.appendChild(ag);
      const tAg = clamp(at(e.b, e.pl, 0.8), tRes + 1.2, end(e.b) - 0.2);
      tl.fromTo(ag, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(2)', immediateRender: false }, tAg);
      gsap.set(ag, { opacity: 0 });
      lap(tRes + 0.3, Math.min(2.2, Math.max(1.2, tAg - tRes - 0.1)));
    });

    // ---------- beat 4: the dog doesn't have to understand why
    const t4 = cue(4);
    const nb = C3.put(stage, 'c3-card', null, { x: 920, y: 770, w: 860, h: 120 });
    Object.assign(nb.style, { display: 'flex', alignItems: 'center', gap: '26px', padding: '0 30px' });
    const bi = K.el('div', null);
    Object.assign(bi.style, { width: '80px', height: '80px', borderRadius: '50%', background: C.inkSoft, display: 'grid', placeItems: 'center', flex: '0 0 auto' });
    bi.appendChild(K.icon('brain', { size: 46, stroke: 2.2, color: '#fff' }));
    nb.appendChild(bi);
    nb.appendChild(K.el('div', null, `<span style="font:700 38px/1.1 var(--font-head);color:${C.ink}">No need to <span style="color:${C.green}">understand why</span></span>`));
    A.in(tl, nb, t4 + 0.15, 'fadeUp', { dur: 0.6 });

    // ---------- beat 5: the outcome shapes next time
    const t5 = cue(5);
    lap(t5 + 0.1, 2.0);
    const nt = C3.chip(stage, 'redo-2', 'Next time', RG.nodes[0].x - 330, RG.nodes[0].y - 30, { col: C.green, size: 30 });
    nt.style.borderColor = C.green;
    A.in(tl, nt, clamp(at(5, 'next time', 0.8), t5 + 0.8, end(5) - 0.3), 'fadeRight', { dur: 0.5 });
  });

  // ================================================================== ch03s13 The ABC cycle
  registerScene('ch03s13', ctx => {
    const { stage, tl, cue, end, dur } = ctx;
    C2.style(stage);
    C3.css(stage);
    const at = (i, p, fb, lead) => sayAt(ctx, i, p, fb, lead);
    const STAGES = [
      { label: 'Before training', v: 'red', imgs: ['abc_before_a.jpg', 'abc_before_b.jpg', 'abc_before_c.jpg'],
        caps: ['Another dog appears', 'Barking and lunging', 'Space is given.<br>The situation ends.'], ar: [0.6, 0.95, 0.7] },
      { label: 'During training', v: '', imgs: ['abc_during_a.jpg', 'abc_during_b.jpg', 'abc_during_c.jpg'],
        caps: ['Management', 'Looks back at you', 'Space is still given'], ar: [0.4, 0.5, 0.35] },
      { label: 'After training', v: 'green', imgs: ['abc_after_a.jpg', 'abc_after_b.jpg', 'abc_after_c.jpg'],
        caps: ['Less management<br>as skills improve', 'Readily uses the<br>new behavior', 'Space is given.<br>The situation ends.'], ar: [0.22, 0.28, 0.18] },
    ];
    const SX = 140, SW = 1640, SG = 70, colW = (SW - 2 * SG) / 3;
    const strips = STAGES.map(s => C3.strip(stage, { x: SX, y: 110, w: SW, gap: SG, panels: s.imgs, captions: s.caps, label: s.label, labelVariant: s.v }));
    const V1 = [];

    // emotional response heart on the A to B arrow (one, shared by the strips)
    const [hx] = strips[0].arrowPt(0);
    const heart = C2.badge(stage, 'heart', hx, 262, 74, COL.emo, '#fff');
    heart.style.border = '5px solid #fff';
    heart.style.boxShadow = '0 8px 20px rgba(80,40,90,0.3)';
    V1.push(heart);

    // arousal and stress meter under each panel
    const MY = 752;
    const mLab = C3.put(stage, 'c3-lab', '<b>Arousal and stress</b>', { x: SX, y: MY - 6 });
    mLab.style.fontSize = '26px';
    const meters = [0, 1, 2].map(k => {
      const x = SX + k * (colW + SG) + (k === 0 ? 270 : 0), w = colW - (k === 0 ? 270 : 0);
      const tr = C3.put(stage, 'c3-card', null, { x, y: MY, w, h: 26 });
      Object.assign(tr.style, { borderRadius: '13px', background: '#eceee8', boxShadow: 'none', border: 'none', overflow: 'hidden' });
      const f = K.el('div', null);
      Object.assign(f.style, { position: 'absolute', left: 0, top: 0, bottom: 0, width: '100%', borderRadius: '13px', background: C.green, transformOrigin: '0 50%' });
      tr.appendChild(f);
      gsap.set(f, { scaleX: 0 });
      return { tr, f };
    });
    V1.push(mLab, ...meters.map(m => m.tr));
    const arCol = v => (v > 0.75 ? C.red : v > 0.45 ? C.amber : C.green);
    const setMeter = (k, v, t) => tl.to(meters[k].f, { scaleX: v, backgroundColor: arCol(v), duration: 0.9, ease: 'power2.inOut' }, t);

    // loop arrow from C back to A, with a label pill
    const lsv = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const ax = SX + colW / 2, cxx = SX + 2 * (colW + SG) + colW / 2, LY0 = 800, LY1 = 868;
    const loopD = `M ${cxx} ${LY0} C ${cxx} ${LY1} ${cxx - 40} ${LY1} ${cxx - 120} ${LY1} L ${ax + 120} ${LY1} C ${ax + 40} ${LY1} ${ax} ${LY1} ${ax} ${LY0 + 6}`;
    const loop = K.path(lsv, loopD, { stroke: C.red, 'stroke-width': 9 });
    const loopH = K.path(lsv, `M ${ax - 18} ${LY0 + 22} L ${ax} ${LY0 + 2} L ${ax + 18} ${LY0 + 22}`, { stroke: C.red, 'stroke-width': 9, opacity: 0 });
    gsap.set(loop, { drawSVG: '0%' });
    V1.push(lsv);
    const lp = (txt, col) => {
      const n = C3.chip(stage, 'repeat', txt, 960, LY1 - 30, { center: true, size: 30, col });
      n.style.borderColor = col;
      gsap.set(n, { opacity: 0 });
      V1.push(n);
      return n;
    };
    const lpB = lp('Practiced: *more likely next time*', C.red);
    const lpD = lp('New pattern *practiced*', C.green);
    const lpA = lp('New path *gets stronger*', C.green);
    lpB.querySelector('b').style.color = C.red;
    const showLoop = (t, col, pill, prev) => {
      tl.set(loop, { attr: { stroke: col } }, t - 0.01);
      tl.set(loopH, { attr: { stroke: col } }, t - 0.01);
      tl.fromTo(loop, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.9, ease: 'power2.inOut', immediateRender: false }, t);
      tl.fromTo(loopH, { opacity: 0 }, { opacity: 1, duration: 0.2, immediateRender: false }, t + 0.85);
      if (prev) tl.to(prev, { opacity: 0, duration: 0.3 }, t - 0.2);
      tl.fromTo(pill, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, immediateRender: false }, t + 0.5);
    };
    const hideLoop = t => { tl.to(loop, { drawSVG: '0%', duration: 0.4 }, t); tl.to(loopH, { opacity: 0, duration: 0.2 }, t); };
    const heartBeat = (t0, t1, per) => {
      const n = Math.max(1, Math.floor((t1 - t0) / per));
      tl.fromTo(heart, { scale: 1 }, { scale: 1.18, duration: 0.14, yoyo: true, repeat: 1, ease: 'power2.out', immediateRender: false }, t0);
      for (let k = 1; k < n; k++) tl.to(heart, { scale: 1.18, duration: 0.14, yoyo: true, repeat: 1, ease: 'power2.out' }, t0 + k * per);
    };

    // ---------- beats 0 to 3: before training
    const S0 = strips[0];
    S0.frames(tl, 0.1);
    A.in(tl, mLab, 0.5, 'fade', { dur: 0.5 });
    A.in(tl, meters.map(m => m.tr), 0.5, 'fade', { dur: 0.5 });
    S0.show(tl, 0, clamp(at(0, 'Another dog', 0.05), cue(0), end(0) - 0.6));
    setMeter(0, STAGES[0].ar[0], cue(0) + 0.6);
    const tEmo = clamp(at(1, 'emotional response', 0.3), cue(1) + 0.1, end(1) - 2.2);
    tl.fromTo(heart, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }, tEmo);
    heartBeat(tEmo + 0.6, cue(4), 0.55);
    S0.show(tl, 1, clamp(at(1, 'we see the B', 0.6), tEmo + 0.7, end(1) - 0.4));
    setMeter(1, STAGES[0].ar[1], tEmo + 0.4);
    S0.show(tl, 2, cue(2) + 0.05);
    setMeter(2, STAGES[0].ar[2], cue(2) + 0.6);
    showLoop(clamp(at(3, 'gets practiced', 0.4), cue(3) + 0.2, end(3) - 1.4), C.red, lpB);

    // ---------- beats 4 to 8: during training
    const S1 = strips[1];
    const t4 = cue(4);
    tl.to(S0.wrap, { opacity: 0, duration: 0.5 }, t4 - 0.1);
    hideLoop(t4 - 0.1);
    tl.to(lpB, { opacity: 0, duration: 0.3 }, t4 - 0.1);
    tl.to(heart, { opacity: 0, duration: 0.3 }, t4 - 0.1);
    [0, 1, 2].forEach(k => tl.to(meters[k].f, { scaleX: 0, duration: 0.4 }, t4 - 0.1));
    S1.frames(tl, t4 + 0.1);
    S1.show(tl, 0, t4 + 0.4);
    setMeter(0, STAGES[1].ar[0], t4 + 1.0);
    const t5 = cue(5);
    const tEmo2 = clamp(at(5, "changing the dog's emotional response", 0.3), t5 + 0.1, end(5) - 3);
    tl.to(heart, { opacity: 1, duration: 0.4 }, tEmo2);
    heartBeat(tEmo2 + 0.5, cue(10), 1.0);
    S1.show(tl, 1, clamp(at(5, 'teaching a new behavior', 0.6), tEmo2 + 0.8, end(5) - 0.6));
    setMeter(1, STAGES[1].ar[1], tEmo2 + 0.6);
    // beat 6: the new behavior still needs to work: C frame glows, waiting
    const t6 = cue(6);
    tl.to(S1.cols[2].panel, { boxShadow: '0 0 0 8px rgba(217,145,43,0.55)', duration: 0.4, yoyo: true, repeat: 3 }, t6 + 0.2);
    // beat 7: space is still given
    S1.show(tl, 2, clamp(at(7, 'give them space', 0.5), cue(7) + 0.1, end(7) - 0.5));
    setMeter(2, STAGES[1].ar[2], cue(7) + 0.6);
    // beat 8: the new pattern gets practiced
    showLoop(clamp(at(8, 'gets practiced', 0.6), cue(8) + 0.3, end(8) - 1.2), C.green, lpD);

    // ---------- beat 9: after training: the whole strip
    const S2 = strips[2];
    const t9 = cue(9);
    tl.to(S1.wrap, { opacity: 0, duration: 0.5 }, t9 - 0.1);
    hideLoop(t9 - 0.1);
    tl.to(lpD, { opacity: 0, duration: 0.3 }, t9 - 0.1);
    S2.frames(tl, t9 + 0.1);
    [0, 1, 2].forEach(k => { S2.show(tl, k, t9 + 0.3 + k * 0.45); setMeter(k, STAGES[2].ar[k], t9 + 0.6 + k * 0.45); });
    tl.to(heart, { backgroundColor: '#b79bbb', duration: 0.6 }, t9 + 0.4);
    showLoop(t9 + 1.8, C.green, lpA);

    // ---------- beats 10 to 14: the two paths on a lawn
    const t10 = cue(10);
    tl.to([S2.wrap, ...V1], { opacity: 0, duration: 0.5 }, t10 - 0.1);
    const LV = C3.layer(stage);
    const LW = C3.lawn(LV, { x: 160, y: 200, w: 1600, h: 600, old: 0.9, neu: 0.85 });
    tl.fromTo(LV, { opacity: 0 }, { opacity: 1, duration: 0.6, immediateRender: true }, t10 + 0.2);
    const [ox, oy] = LW.toStage(...LW.at('old', 0.6)), [nx, ny] = LW.toStage(...LW.at('neu', 0.5));
    const endB = C2.badge(LV, 'move-horizontal', LW.x + LW.ex, LW.y + LW.ey, 110, C.greenDeep, '#fff');
    endB.style.border = '6px solid #fff';
    const eL = C3.put(LV, 'c3-lab', '<b>Space</b>', { x: LW.x + LW.ex - 50, y: LW.y + LW.ey + 66 });
    const oL = C3.chip(LV, 'volume-2', 'Old path: *barking and lunging*', ox, oy + 40, { center: true, col: C.red, size: 30 });
    oL.querySelector('b').style.color = C.red;
    const nL = C3.chip(LV, 'eye', 'New path: *looks back at you*', nx, ny - 104, { center: true, col: C.green, size: 30 });
    LW.walk(tl, 'neu', t10 + 0.6, 2.2, 10);
    const tFade = clamp(at(10, 'begins to fade', 0.6), t10 + 1.2, end(10) - 1.4);
    LW.set(tl, 'old', 0.22, tFade, 1.4);
    tl.to(oL, { opacity: 0.55, duration: 0.6 }, tFade);
    // beat 11: still there
    const t11 = cue(11);
    const ed = LW.P.old.edge;
    tl.to(ed, { opacity: 0.9, attr: { 'stroke-width': 5 }, duration: 0.5 }, t11 + 0.2);
    const sl = C3.chip(LV, 'eye', 'Still there', ox + 300, oy - 30, { col: C.muted, size: 30 });
    A.in(tl, sl, t11 + 0.5, 'pop', { dur: 0.5 });
    // beat 12: practiced again, it works: the old path darkens
    const t12 = cue(12);
    const tAgain = clamp(at(12, 'practicing the old behavior', 0.3), t12 + 0.1, end(12) - 3);
    LW.walk(tl, 'old', tAgain, 2.4, 10, '#7a2a1a');
    LW.set(tl, 'old', 0.8, tAgain + 0.8, 2.0);
    tl.to(oL, { opacity: 1, duration: 0.4 }, tAgain + 0.8);
    tl.to(sl, { opacity: 0, duration: 0.3 }, tAgain);
    const cb = C3.chip(LV, 'triangle-alert', 'It can come back', ox + 300, oy - 30, { col: C.amber, size: 30 });
    A.in(tl, cb, clamp(at(12, 'stronger again', 0.85), tAgain + 1.4, end(12) - 0.3), 'pop', { dur: 0.5 });
    // beat 13: management: a fence across the old path
    const t13 = cue(13);
    tl.to(cb, { opacity: 0, duration: 0.3 }, t13);
    LW.set(tl, 'old', 0.3, t13 + 0.1, 1.0);
    const [fx, fy] = LW.at('old', 0.2);
    const fence = K.group(LW.svg);
    for (let k = -2; k <= 2; k++) K.rect(fence, fx - 8 + k * 30, fy - 70, 16, 140, { rx: 6, fill: '#ffffff', stroke: C.greenDeep, 'stroke-width': 4 });
    K.rect(fence, fx - 80, fy - 40, 160, 16, { rx: 6, fill: '#ffffff', stroke: C.greenDeep, 'stroke-width': 4 });
    K.rect(fence, fx - 80, fy + 20, 160, 16, { rx: 6, fill: '#ffffff', stroke: C.greenDeep, 'stroke-width': 4 });
    tl.fromTo(fence, { opacity: 0, y: -80 }, { opacity: 1, y: 0, duration: 0.6, ease: 'bounce.out' }, t13 + 0.3);
    const mg = C3.chip(LV, 'shield-check', '*Management*', LW.x + fx + 100, LW.y + fy - 150, { col: C.greenDeep, size: 32 });
    A.in(tl, mg, t13 + 0.7, 'fadeUp', { dur: 0.5 });
    // beat 14: less practice of the old pattern, successful practice of the new one
    const t14 = cue(14);
    const tNew = clamp(at(14, 'practice the new one', 0.6), t14 + 0.6, end(14) - 2.2);
    tl.to(fence, { scale: 1.08, svgOrigin: `${fx} ${fy}`, duration: 0.25, yoyo: true, repeat: 1 }, clamp(at(14, 'reduce unnecessary practice', 0.2), t14, tNew - 0.6));
    LW.walk(tl, 'neu', tNew, 2.0, 10);
    LW.set(tl, 'neu', 1, tNew + 0.4, 1.4);

    // ---------- beats 15, 16: what the dog needs from C can change; arousal and stress across the stages
    const t15 = cue(15);
    tl.to(LV, { opacity: 0, duration: 0.5 }, t15 - 0.1);
    const V3 = C3.layer(stage);
    const NEED = ['Needs a lot of space', 'Needs some space', 'Needs less space'];
    const cards = STAGES.map((s, k) => {
      const x = 150 + k * 560, w = 500;
      const c = C3.put(V3, 'c3-card', null, { x, y: 140, w, h: 660 });
      const lb = K.el('div', 'abc-label' + (s.v ? ' ' + s.v : ''), s.label);
      Object.assign(lb.style, { left: '24px', top: '24px', fontSize: '32px', padding: '10px 24px' });
      c.appendChild(lb);
      const p = K.photo(c, s.imgs[2], { x: 24, y: 106, w: w - 48, h: 250, radius: 18 });
      p.root.style.border = '5px solid ' + C.olive;
      const hb = C2.badge(c, 'heart', w / 2, 440, 100 - k * 22, COL.emo, '#fff');
      hb.style.border = '5px solid #fff';
      const nd = C3.put(c, 'c3-mid', `C: <b>${NEED[k]}</b>`, { x: 0, y: 512, w, align: 'center' });
      nd.style.fontSize = '32px';
      const tr = K.el('div', null);
      Object.assign(tr.style, { position: 'absolute', left: '40px', right: '40px', top: '606px', height: '24px', borderRadius: '12px', background: '#eceee8', overflow: 'hidden' });
      const f = K.el('div', null);
      Object.assign(f.style, { position: 'absolute', inset: 0, borderRadius: '12px', background: arCol(s.ar[1]), transformOrigin: '0 50%' });
      tr.appendChild(f);
      c.appendChild(tr);
      gsap.set(f, { scaleX: 0 });
      return { c, hb, nd, tr, f, v: s.ar[1] };
    });
    cards.forEach((k, i) => {
      tl.fromTo(k.c, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, t15 + 0.2 + i * 0.25);
      gsap.set([k.hb, k.nd, k.tr], { opacity: 0 });
    });
    const tNeed = clamp(at(15, 'what they need', 0.55), t15 + 1.0, end(15) - 1.4);
    cards.forEach((k, i) => {
      tl.to(k.hb, { opacity: 1, duration: 0.4 }, t15 + 0.6 + i * 0.25);
      tl.to(k.nd, { opacity: 1, duration: 0.4 }, tNeed + i * 0.35);
    });
    // beat 16: arousal and stress meters, then "coming up: temperature"
    const t16 = cue(16);
    const ml = C3.put(V3, 'c3-lab', '<b>Arousal and stress</b>', { x: 0, y: 822, w: 1920, align: 'center' });
    const tAr = clamp(at(16, 'arousal and stress', 0.4), t16 + 0.1, end(16) - 3);
    A.in(tl, ml, tAr, 'fadeUp', { dur: 0.5 });
    cards.forEach((k, i) => {
      tl.to(k.tr, { opacity: 1, duration: 0.3 }, tAr + 0.1);
      tl.to(k.f, { scaleX: k.v, duration: 0.9, ease: 'power2.inOut' }, tAr + 0.2 + i * 0.3);
    });
    tl.to(ml, { opacity: 0, duration: 0.3 }, clamp(at(16, 'add temperature', 0.8), tAr + 2.2, end(16) - 1.0) - 0.2);
    const up = C2.bookmark(V3, 'Coming up: *temperature*', 780, 836, 'thermometer');
    up.querySelectorAll('b').forEach(b => { b.style.color = '#b8d99a'; });
    A.in(tl, up, clamp(at(16, 'add temperature', 0.8), tAr + 2.2, end(16) - 1.0), 'fadeUp', { dur: 0.5 });
  });
})();
