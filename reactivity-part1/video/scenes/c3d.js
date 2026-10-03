// Chapter 3: why behavior repeats.
//   ch03s12  When behavior works   A, B, C ring; a dot runs the loop each time C works (distance, closer, keeps it); more likely again
//   ch03s13  The ABC cycle         two cycles, before training (red) and during training (green); paths strengthen and fade;
//                                  management; the consequence progresses (space, less space, building relationships)
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
  // Two cycles side by side (Tori's reference, abc-cycle-preview): before training in red, during training in green.
  // Each is A (top), B (lower right), C (lower left) on a ring, with arrows between them, "Emotions" on A to B and
  // arousal and stress on B to C. A dot runs the loop when a pattern repeats. Path strength = arc thickness; a fading
  // path = the whole cycle fades. The green C box then progresses: space given, less space needed, building relationships.
  const CY_CSS = `
  .cy-box { position: absolute; display: flex; align-items: center; gap: 16px; padding: 12px 22px 12px 14px; background: #fff; border-radius: 22px;
    border: 5px solid; box-shadow: 0 10px 26px rgba(40,60,20,0.10); box-sizing: border-box; }
  .cy-box .lt { width: 62px; height: 62px; border-radius: 50%; display: grid; place-items: center; color: #fff; font: 800 38px/1 var(--font-head); flex: 0 0 auto; }
  .cy-box .tx { display: flex; flex-direction: column; gap: 4px; }
  .cy-box .w { font: 600 26px/1 var(--font-body); }
  .cy-box .v { font: 700 32px/1.08 var(--font-head); color: var(--ink); }
  .cy-box .v small { display: block; font: 500 26px/1.2 var(--font-body); color: var(--ink-soft); margin-top: 4px; }
  .cy-box .vs { position: relative; }
  .cy-box .vs .v { white-space: nowrap; }
  .cy-lab { position: absolute; font: italic 600 30px/1.1 var(--font-body); white-space: nowrap; text-align: center; }
  .cy-pill { position: absolute; padding: 10px 26px; border-radius: 14px; color: #fff; font: 700 34px/1 var(--font-head); white-space: nowrap; }
  .cy-mid { position: absolute; font: 500 30px/1.2 var(--font-body); color: var(--ink-soft); text-align: center; white-space: nowrap; }
  .cy-cap { position: absolute; left: 0; width: 1920px; text-align: center; font: 600 38px/1.2 var(--font-body); color: var(--ink); white-space: nowrap; }
  .cy-cap b { font-weight: 700; }
  `;

  function makeCycle(stage, o) {
    const { cx, cy, r, col, pale } = o;
    const L = C3.layer(stage);
    const sv = K.svg(L, { x: 0, y: 0, w: 1920, h: 1080 });
    const pt = a => [cx + r * Math.cos(a * Math.PI / 180), cy + r * Math.sin(a * Math.PI / 180)];
    const arcD = (a0, a1) => { const [x0, y0] = pt(a0), [x1, y1] = pt(a1); return `M ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1}`; };
    const guide = K.circle(sv, cx, cy, r, { fill: 'none', stroke: col, 'stroke-width': 3, 'stroke-dasharray': '2 12', opacity: 0 });
    const SEG = [[-50, -6], [40, 140], [190, 228]];
    const arcs = SEG.map(([a0, a1]) => {
      const glow = K.path(sv, arcD(a0, a1), { stroke: col, 'stroke-width': 8, opacity: 0, 'stroke-linecap': 'round' });
      const p = K.path(sv, arcD(a0, a1), { stroke: col, 'stroke-width': 8 });
      const [x1, y1] = pt(a1);
      const hd = K.path(sv, 'M -22 -20 L 6 0 L -22 20 Z', { fill: col, stroke: col, 'stroke-width': 4, transform: `translate(${x1} ${y1}) rotate(${a1 + 90})` });
      gsap.set(p, { drawSVG: '0%' });
      gsap.set(hd, { opacity: 0 });
      return { glow, p, hd };
    });
    const box = (L_, word, html, bx, by, w) => {
      const b = K.el('div', 'cy-box');
      Object.assign(b.style, { left: bx + 'px', top: by + 'px', width: w + 'px', borderColor: col });
      const lt = K.el('div', 'lt', L_);
      lt.style.background = col;
      b.appendChild(lt);
      const tx = K.el('div', 'tx');
      const wd = K.el('div', 'w', word);
      wd.style.color = col;
      tx.appendChild(wd);
      const vs = K.el('div', 'vs');
      vs.appendChild(K.el('div', 'v', html));
      tx.appendChild(vs);
      b.appendChild(tx);
      L.appendChild(b);
      gsap.set(b, { xPercent: -50, yPercent: -50, opacity: 0 });
      return { b, vs };
    };
    const [ax, ay] = pt(-90), [bx, by] = pt(15), [ccx, ccy] = pt(165);
    const A_ = box('A', 'Antecedent', o.A, ax, ay, 310);
    const B_ = box('B', 'Behavior', o.B, bx, by + 6, o.bw || 300);
    const C_ = box('C', 'Consequence', o.C, ccx, ccy + 6, o.cw || 300);
    const pill = C2.put(L, 'cy-pill', o.label, { x: cx, y: cy - 150 });
    pill.style.background = col;
    gsap.set(pill, { xPercent: -50, opacity: 0 });
    const mid = C2.put(L, 'cy-mid', o.mid, { x: cx, y: cy - 78 });
    gsap.set(mid, { xPercent: -50, opacity: 0 });
    const [ex, ey] = pt(-32);
    const emo = C2.put(L, 'cy-lab', o.emo, { x: ex + 44, y: ey - 26 });
    emo.style.color = col;
    gsap.set(emo, { opacity: 0 });
    const aro = C2.put(L, 'cy-lab', o.aro, { x: cx, y: cy + r - 124 });
    aro.style.color = col;
    gsap.set(aro, { xPercent: -50, opacity: 0 });
    const dot = K.circle(sv, 0, 0, 13, { fill: '#fff', stroke: col, 'stroke-width': 5, opacity: 0 });
    let width = 8;
    const Y = {
      L, arcs, A: A_, B: B_, C: C_, pill, mid, emo, aro, guide, dot,
      start(tl, t) {
        tl.to(guide, { opacity: 0.6, duration: 0.5 }, t);
        tl.to(pill, { opacity: 1, duration: 0.5 }, t + 0.1);
      },
      showBox(tl, bx_, t) { tl.fromTo(bx_.b, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.55, ease: 'back.out(1.6)', immediateRender: false }, t); },
      draw(tl, k, t, d = 0.8) {
        tl.to(arcs[k].p, { drawSVG: '100%', duration: d, ease: 'power2.inOut' }, t);
        tl.to(arcs[k].hd, { opacity: 1, duration: 0.2 }, t + d - 0.1);
      },
      show(tl, el, t) { tl.to(el, { opacity: 1, duration: 0.5 }, t); },
      // stroke width: 8 normal, 22 strong (with a soft glow), 5 weak
      width(tl, w, t, d = 1.0) {
        const g = w > 12 ? 0.22 : 0;
        arcs.forEach(a => {
          tl.to(a.p, { attr: { 'stroke-width': w }, duration: d, ease: 'power2.inOut' }, t);
          tl.to(a.glow, { attr: { 'stroke-width': w + 26 }, opacity: g, duration: d, ease: 'power2.inOut' }, t);
          tl.to(a.hd, { scale: w > 12 ? 1.5 : w < 7 ? 0.8 : 1, transformOrigin: '30% 50%', duration: d }, t);
        });
        width = w;
      },
      fade(tl, op, t, d = 0.8) { tl.to(L, { opacity: op, duration: d, ease: 'power2.inOut' }, t); },
      run(tl, t, laps = 1, per = 0.55) {
        tl.fromTo(dot, { opacity: 0 }, { opacity: 1, duration: 0.15, immediateRender: false }, t);
        for (let n = 0; n < laps; n++) arcs.forEach((a, k) => {
          tl.fromTo(dot, { motionPath: { path: a.p, align: a.p, alignOrigin: [0.5, 0.5], start: 0, end: 0 } },
            { motionPath: { path: a.p, align: a.p, alignOrigin: [0.5, 0.5], start: 0, end: 1 }, duration: per, ease: 'none', immediateRender: false }, t + (n * 3 + k) * per);
        });
        tl.to(dot, { opacity: 0, duration: 0.2 }, t + laps * 3 * per);
        return t + laps * 3 * per;
      },
      // swap the text in a box
      swap(tl, bx_, html, t) {
        const old = bx_.vs.lastChild;
        const n = K.el('div', 'v', html);
        Object.assign(n.style, { position: 'absolute', left: 0, top: 0 });
        bx_.vs.appendChild(n);
        gsap.set(n, { opacity: 0 });
        tl.to(old, { opacity: 0, y: -10, duration: 0.3 }, t);
        tl.fromTo(n, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, immediateRender: false }, t + 0.25);
      },
    };
    return Y;
  }

  registerScene('ch03s13', ctx => {
    const { stage, tl, cue, end, dur } = ctx;
    C2.style(stage);
    C3.css(stage);
    stage.appendChild(K.el('style', null, CY_CSS));
    const at = (i, p, fb, lead) => sayAt(ctx, i, p, fb, lead);
    C3.head(ctx, 'The ABC Cycle', { size: 72 });
    const RED = C.red, GRN = C.green;
    const L0 = makeCycle(stage, { cx: 505, cy: 590, r: 255, col: RED, label: 'Before training', mid: 'Barking works,<br>so it repeats.',
      A: 'Another dog<br>appears', B: 'Bark and<br>lunge', C: 'Space is<br>given', emo: 'Emotions', aro: 'Increased<br>arousal/stress' });
    const L1 = makeCycle(stage, { cx: 1385, cy: 590, r: 255, col: GRN, label: 'During training', mid: 'The new behavior works,<br>so it repeats.',
      A: 'Another dog<br>appears', B: 'Replacement<br>behavior<small>e.g. looks to you</small>', C: 'Space is<br>given', bw: 330, cw: 330,
      emo: 'Changing<br>emotions', aro: 'Lowered<br>arousal/stress' });
    // bottom caption, swapped beat by beat
    L1.C.vs.style.minHeight = '70px';
    let capPrev = null;
    const cap = (html, t) => {
      const n = C2.put(stage, 'cy-cap', html, { x: 0, y: 912 });
      n.querySelectorAll('b').forEach(b => { b.style.color = b.dataset.c || GRN; });
      if (capPrev) tl.to(capPrev, { opacity: 0, duration: 0.3 }, t - 0.05);
      tl.fromTo(n, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, immediateRender: false }, t + 0.2);
      gsap.set(n, { opacity: 0 });
      capPrev = n;
      return n;
    };
    const redB = html => html.replace(/<b>/g, `<b data-c="${RED}">`);

    // ---------- before training: A, then emotions and B, then C, then the loop closes
    L0.start(tl, cue(0) + 0.05);
    L0.showBox(tl, L0.A, clamp(at(0, 'Another dog', 0.05), cue(0) + 0.3, end(0) - 0.5));
    const tE0 = clamp(at(1, 'emotional response', 0.3), cue(1) + 0.1, end(1) - 2);
    L0.draw(tl, 0, tE0);
    L0.show(tl, L0.emo, tE0 + 0.3);
    L0.showBox(tl, L0.B, clamp(at(1, 'barking and lunging', 0.75), tE0 + 0.9, end(1) - 0.4));
    const tC0 = cue(2) + 0.1;
    L0.draw(tl, 1, tC0);
    L0.show(tl, L0.aro, tC0 + 0.3);
    L0.showBox(tl, L0.C, clamp(at(2, 'space is given', 0.2), tC0 + 0.6, end(2) - 0.4));
    const tL0 = clamp(at(3, 'gets practiced', 0.4), cue(3) + 0.2, end(3) - 1.8);
    L0.draw(tl, 2, cue(3) + 0.1, 0.7);
    L0.show(tl, L0.mid, cue(3) + 0.5);
    L0.run(tl, tL0, 1, 0.5);

    // ---------- during training: A, changing emotions and the new behavior, C waits, space still given, the loop closes
    L1.start(tl, cue(4) + 0.05);
    L1.showBox(tl, L1.A, clamp(at(4, 'another dog may still appear', 0.4), cue(4) + 0.4, end(4) - 0.4));
    const tE1 = clamp(at(5, 'changing', 0.2), cue(5) + 0.1, end(5) - 3);
    L1.draw(tl, 0, tE1);
    L1.show(tl, L1.emo, tE1 + 0.3);
    L1.showBox(tl, L1.B, clamp(at(5, 'teaching a new behavior', 0.6), tE1 + 1.0, end(5) - 0.5));
    // beat 6: the new behavior still needs to work: the arc reaches an empty C
    L1.draw(tl, 1, cue(6) + 0.1);
    L1.show(tl, L1.aro, cue(6) + 0.4);
    const ghost = K.el('div', null);
    const [gx, gy] = [1385 + 255 * Math.cos(165 * Math.PI / 180), 590 + 255 * Math.sin(165 * Math.PI / 180) + 6];
    Object.assign(ghost.style, { position: 'absolute', left: gx + 'px', top: gy + 'px', width: '330px', height: '100px', borderRadius: '22px', border: `5px dashed ${GRN}`, boxSizing: 'border-box' });
    L1.L.appendChild(ghost);
    gsap.set(ghost, { xPercent: -50, yPercent: -50, opacity: 0 });
    tl.to(ghost, { opacity: 1, duration: 0.4 }, cue(6) + 0.8);
    tl.to(ghost, { opacity: 0.35, duration: 0.4, yoyo: true, repeat: 3 }, cue(6) + 1.2);
    // beat 7: space is still given
    const tS = clamp(at(7, 'give them space', 0.5), cue(7) + 0.1, end(7) - 0.4);
    tl.to(ghost, { opacity: 0, duration: 0.3 }, tS);
    L1.showBox(tl, L1.C, tS);
    // beat 8: the new pattern gets practiced
    L1.draw(tl, 2, cue(8) + 0.1, 0.7);
    L1.show(tl, L1.mid, cue(8) + 0.5);
    L1.run(tl, clamp(at(8, 'gets practiced', 0.6), cue(8) + 0.9, end(8) - 1.8), 1, 0.5);

    // ---------- the paths change
    // beat 9: practice: the new path gets thick and strong
    const t9 = cue(9) + 0.1;
    L1.width(tl, 22, t9, 1.4);
    L1.run(tl, t9 + 0.3, 1, 0.45);
    cap('Practice creates <b>a new, strong path</b>.', t9);
    // beat 10: the old path fades
    const t10 = clamp(at(10, 'begins to fade', 0.6), cue(10) + 0.3, end(10) - 1.2);
    L0.width(tl, 5, t10, 1.2);
    L0.fade(tl, 0.28, t10, 1.4);
    cap('Practice creates <b>a new, strong path</b>. The old path fades.', cue(10) + 0.1);
    // beat 11: it hasn't vanished: the faint cycle glimmers
    const t11 = cue(11) + 0.1;
    L0.fade(tl, 0.5, t11 + 0.2, 0.5);
    L0.fade(tl, 0.3, t11 + 1.0, 0.6);
    cap('The old path <b>hasn’t vanished</b>.', t11);
    // beat 12: practiced again and it works: the old path comes back, the new one dims
    const t12 = clamp(at(12, 'practicing the old behavior', 0.3), cue(12) + 0.1, end(12) - 3);
    L0.fade(tl, 1, t12, 0.8);
    L1.fade(tl, 0.28, t12, 0.8);
    L1.width(tl, 8, t12, 0.8);
    L0.width(tl, 22, t12 + 0.6, 1.2);
    L0.run(tl, t12 + 0.6, 2, 0.4);
    cap(redB('Practice the old behavior and <b>the old path comes back</b>.'), cue(12) + 0.1);

    // ---------- management
    const t13 = cue(13) + 0.1;
    L0.fade(tl, 0.28, t13, 0.8);
    L0.width(tl, 5, t13, 0.8);
    L1.fade(tl, 1, t13, 0.8);
    L1.width(tl, 22, t13 + 0.3, 1.0);
    cap('That’s why <b>management</b> matters.', t13);
    const t14 = cue(14) + 0.1;
    cap('Less practice of the old path. <b>Successful practice of the new one.</b>', t14);
    L1.run(tl, clamp(at(14, 'successful opportunities', 0.6), t14 + 0.5, end(14) - 1.8), 1, 0.5);

    // ---------- the consequence can change: less space, then something new; that's a good thing
    const t15 = cue(15) + 0.1;
    cap('As emotions change, <b>the consequence can change too</b>.', t15);
    const tLess = clamp(at(15, 'can change too', 0.75), t15 + 0.8, end(15) - 0.6);
    L1.swap(tl, L1.C, 'Less space<br>needed', tLess);
    tl.to(L1.C.b, { scale: 1.08, duration: 0.25, yoyo: true, repeat: 1 }, tLess);
    const t16 = cue(16) + 0.1;
    const tRel = clamp(at(16, 'build a relationship', 0.5), t16 + 0.3, end(16) - 1.6);
    L1.swap(tl, L1.C, 'Building dog<br>relationships', tRel);
    tl.to(L1.C.b, { scale: 1.08, duration: 0.25, yoyo: true, repeat: 1 }, tRel);
    cap('The dog may start wanting something new. <b>That’s a good thing.</b>', tRel - 0.2);
    const good = C2.badge(stage, 'check', 1385 - 255 * Math.cos(15 * Math.PI / 180) - 150, 590 + 66 - 60, 58, GRN, '#fff');
    good.style.border = '4px solid #fff';
    A.in(tl, good, clamp(at(16, "that's a good thing", 0.85), tRel + 0.8, end(16) - 0.3), 'pop', { dur: 0.5 });

    // ---------- arousal and stress: the two labels light up; temperature is coming
    const t17 = cue(17) + 0.1;
    L0.fade(tl, 0.75, t17, 0.6);
    const tAr = clamp(at(17, 'arousal and stress', 0.35), t17 + 0.2, end(17) - 3);
    [L0.aro, L1.aro].forEach((n, k) => tl.to(n, { scale: 1.2, duration: 0.35, yoyo: true, repeat: 3, ease: 'sine.inOut' }, tAr + k * 0.3));
    tl.to(capPrev, { opacity: 0, duration: 0.3 }, tAr);
    const up = C2.bookmark(stage, 'Coming up: *temperature*', 0, 904, 'thermometer');
    up.querySelectorAll('b').forEach(b => { b.style.color = '#b8d99a'; });
    up.style.left = '960px';
    gsap.set(up, { xPercent: -50 });
    A.in(tl, up, clamp(at(17, 'add temperature', 0.8), tAr + 1.5, end(17) - 0.6), 'fadeUp', { dur: 0.5 });
  });
})();
