// Chapter 3: four directions, movement, the emotional response, emotion vs function.
//   ch03s08  Four broad directions          a dog at centre, four direction cards; then not rigid boxes: linked, shifting
//   ch03s09  Movement isn't function        a drawn dog lunges toward another dog, the other dog moves away: more space
//   ch03s10  What happens between A and B?  A and B slide apart and the emotional response opens between them
//   ch03s11  Emotion and function are different   two cards: inside the dog / what the behavior accomplished
(() => {
  const { sayAt, clamp } = C1;
  const { COL } = C3;
  const C = C1.C;

  // ================================================================== ch03s08 Four broad directions
  registerScene('ch03s08', ctx => {
    const { stage, tl, cue, end, dur } = ctx;
    C2.style(stage);
    C3.css(stage);
    const at = (i, p, fb, lead) => sayAt(ctx, i, p, fb, lead);
    C3.head(ctx, 'Four Broad Directions', { size: 72 });

    const DX = 960, DY = 600;
    const sv = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const POS = [[100, 270], [1180, 270], [100, 700], [1180, 700]];
    const CW = 640, CH = 220;
    const links = POS.map(([x, y]) => {
      const cx = x < 960 ? x + CW : x, cy = y + CH / 2;
      return K.path(sv, `M ${DX} ${DY} L ${cx} ${cy}`, { stroke: C.greenLight, 'stroke-width': 6, 'stroke-dasharray': '4 14' });
    });
    const dog = C2.badge(stage, 'dog', DX, DY, 190, COL.B, '#fff');
    dog.style.border = '8px solid #fff';
    dog.style.boxShadow = '0 16px 36px rgba(40,60,20,0.25)';

    // ---------- beat 0: dog and four empty outlines
    A.in(tl, dog, cue(0) + 0.1, 'pop', { dur: 0.6 });
    const boxes = POS.map(([x, y]) => {
      const b = C3.put(stage, 'c3-card', null, { x, y, w: CW, h: CH });
      b.style.border = '4px dashed #c9d2bf';
      b.style.background = 'rgba(255,255,255,0.45)';
      b.style.boxShadow = 'none';
      return b;
    });
    A.in(tl, boxes, cue(0) + 0.6, 'fade', { dur: 0.5, stagger: 0.1 });
    A.draw(tl, links, cue(0) + 0.6, 0.6, { stagger: 0.1 });

    // ---------- beats 1 to 4: fill each card
    const D = [
      { kind: 'out', t: 'Increase distance' },
      { kind: 'in', t: 'Decrease distance' },
      { icon: 'key-round', t: 'Gain or keep access' },
      { kind: 'pulse', t: 'Change or release an intense internal state' },
    ];
    const fills = D.map((d, k) => {
      const b = boxes[k];
      const inner = K.el('div', null);
      Object.assign(inner.style, { position: 'absolute', left: '28px', top: '0', height: '100%', right: '24px', display: 'flex', alignItems: 'center', gap: '28px' });
      const ib = K.el('div', null);
      Object.assign(ib.style, { width: '120px', height: '120px', borderRadius: '28px', background: C.green, display: 'grid', placeItems: 'center', flex: '0 0 auto' });
      let ar = null, pulse = null;
      if (d.kind === 'out' || d.kind === 'in') ar = C3.arrows(ib, d.kind === 'in', '#fff', 84, 11);
      else if (d.kind === 'pulse') {
        const s = K.svgEl('svg', { viewBox: '0 0 80 60', width: 84, height: 64 }, ib);
        pulse = K.path(s, 'M 4 30 L 18 30 L 26 8 L 36 52 L 46 12 L 54 44 L 62 30 L 76 30', { stroke: '#fff', 'stroke-width': 6 });
      } else ib.appendChild(K.icon(d.icon, { size: 66, stroke: 2.3, color: '#fff' }));
      inner.appendChild(ib);
      inner.appendChild(K.el('div', null, `<span style="font:700 ${k === 3 ? 36 : 46}px/1.15 var(--font-head);color:${C.ink}">${d.t}</span>`));
      inner.lastChild.style.flex = '1';
      b.appendChild(inner);
      const t = cue(k + 1) + 0.05;
      tl.to(b, { borderColor: C.green, borderStyle: 'solid', backgroundColor: '#ffffff', boxShadow: '0 10px 30px rgba(40,60,20,0.10)', duration: 0.4 }, t);
      A.in(tl, inner, t + 0.1, 'fadeUp', { dur: 0.5 });
      tl.to(links[k], { stroke: C.green, duration: 0.4 }, t);
      A.pulse(tl, dog, t + 0.2);
      if (ar) C3.nudge(tl, ar, t + 0.6, 2);
      if (pulse) tl.to(pulse, { attr: { d: 'M 4 30 L 18 30 L 26 26 L 36 34 L 46 27 L 54 32 L 62 30 L 76 30' }, duration: 1.4, ease: 'power2.inOut' }, t + 1.0);
      return { b, inner, ib };
    });

    // ---------- beat 5: not rigid boxes: borders go dashed and soft
    const t5 = cue(5);
    tl.to(boxes, { borderStyle: 'dashed', borderColor: C.greenLight, borderRadius: '60px', rotation: (k) => [-1.5, 1.5, 1.5, -1.5][k], duration: 0.6, ease: 'power2.inOut' }, t5 + 0.1);
    const nr = C3.chip(stage, null, 'Not rigid boxes', DX, 380, { center: true, size: 32 });
    A.in(tl, nr, t5 + 0.3, 'pop', { dur: 0.5 });

    // ---------- beat 6: more than one thing (a link), then it depends on the situation (the highlight moves)
    const t6 = cue(6);
    const tMore = clamp(at(6, 'more than one thing', 0.25), t6 + 0.1, end(6) - 2.5);
    const arc = K.path(sv, `M ${100 + CW - 60} ${270 + CH} C ${860} ${560} ${860} ${640} ${100 + CW - 60} ${700}`, { stroke: C.greenDark, 'stroke-width': 8 });
    A.draw(tl, arc, tMore, 0.7);
    A.out(tl, nr, tMore, 'fade', { dur: 0.3 });
    const glow = '0 0 0 8px rgba(97,149,55,0.9), 0 16px 40px rgba(40,60,20,0.2)';
    tl.to([boxes[0], boxes[2]], { boxShadow: glow, borderColor: 'rgba(0,0,0,0)', duration: 0.4 }, tMore + 0.4);
    const mo = C3.chip(stage, 'link', 'More than one', 300, 560, { col: C.greenDark, size: 30 });
    A.in(tl, mo, tMore + 0.5, 'fadeLeft', { dur: 0.5 });
    const tDep = clamp(at(6, 'depending on the situation', 0.75), tMore + 1.6, end(6) - 0.4);
    tl.to([boxes[0], boxes[2]], { boxShadow: '0 10px 30px rgba(40,60,20,0.10)', duration: 0.4 }, tDep);
    tl.to(arc, { opacity: 0.25, duration: 0.4 }, tDep);
    tl.to(boxes[1], { boxShadow: glow, duration: 0.4 }, tDep + 0.2);
    tl.to(mo, { opacity: 0, duration: 0.3 }, tDep);
    const dp = C3.chip(stage, 'shuffle', 'Depends on the situation', 1270, 560, { col: C.greenDark, size: 30 });
    A.in(tl, dp, tDep + 0.3, 'fadeLeft', { dur: 0.5 });
    tl.to(boxes[1], { boxShadow: '0 10px 30px rgba(40,60,20,0.10)', duration: 0.4 }, tDep + 1.6);
    tl.to(boxes[3], { boxShadow: glow, duration: 0.4 }, tDep + 1.6);
  });

  // ------------------------------------------------------------------ a second, grey dog facing left (stage svg of its own)
  function dogSvg(stage, cx, cy, s, o = {}) {
    const sv = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const D = C2.dog(sv, cx, cy, s);
    if (o.flip) gsap.set(D.outer, { scaleX: -1, svgOrigin: `${cx} ${cy}` });
    if (o.filter) sv.style.filter = o.filter;
    return { sv, D };
  }

  // ================================================================== ch03s09 Movement isn't function
  registerScene('ch03s09', ctx => {
    const { stage, tl, cue, end } = ctx;
    C2.style(stage);
    C3.css(stage);
    const at = (i, p, fb, lead) => sayAt(ctx, i, p, fb, lead);
    C3.head(ctx, 'Movement Isn’t Function', { size: 72 });

    const GY = 650;
    const g = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const ground = K.path(g, `M 160 ${GY} L 1760 ${GY}`, { stroke: '#cfd8c4', 'stroke-width': 8 });
    const X1 = 560, X2 = 1300, DYc = 540, S = 0.78;
    const a = dogSvg(stage, X1, DYc, S);
    const b = dogSvg(stage, X2, DYc, S, { flip: true, filter: 'grayscale(1) brightness(1.55) sepia(0.5)' });

    // ---------- beat 0: two dogs on a path
    A.draw(tl, ground, cue(0) + 0.05, 0.6);
    tl.fromTo(a.D.outer, { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, cue(0) + 0.2);
    tl.fromTo(b.sv, { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, cue(0) + 0.35);

    // ---------- beat 1: the direction a dog moves: arrow and a question
    const t1 = cue(1);
    const arr = K.path(g, `M ${X1 - 40} 330 L ${X1 + 260} 330 M ${X1 + 230} 304 L ${X1 + 262} 330 L ${X1 + 230} 356`, { stroke: C.amber, 'stroke-width': 14 });
    A.draw(tl, arr, t1 + 0.2, 0.6);
    const dq = C3.chip(stage, 'circle-help', 'Direction is not function', 960, 760, { center: true, size: 36, col: C.amber });
    A.in(tl, dq, clamp(at(1, 'function', 0.8), t1 + 0.6, end(1) - 0.4), 'fadeUp', { dur: 0.5 });

    // ---------- beat 2: the dog lunges toward the other dog
    const t2 = cue(2);
    const tL = clamp(at(2, 'lunge toward', 0.15), t2 + 0.1, end(2) - 2);
    const barks = [[412, 58, 102], [436, 42, 118], [460, 26, 134]].map(([x, y0, y1], i) =>
      K.path(a.D.fx, `M ${x} ${y0} Q ${x + 18 + i * 8} ${(y0 + y1) / 2} ${x} ${y1}`, { stroke: C.red, 'stroke-width': 10, fill: 'none', opacity: 0 }));
    tl.to(a.D.outer, { x: 170, duration: 0.45, ease: 'power3.out' }, tL);
    tl.fromTo(a.D.fig, { rotation: 0, svgOrigin: '220 297' }, { rotation: 6, svgOrigin: '220 297', duration: 0.3, immediateRender: false }, tL);
    tl.fromTo(a.D.tail, { rotation: 0, svgOrigin: '108 134' }, { rotation: 30, svgOrigin: '108 134', duration: 0.3, immediateRender: false }, tL);
    barks.forEach((bk, i) => tl.fromTo(bk, { opacity: 0 }, { opacity: 1, duration: 0.15, yoyo: true, repeat: 5, repeatDelay: 0.12, immediateRender: false }, tL + 0.2 + i * 0.08));
    const mv = C3.chip(stage, 'arrow-right', 'Moved *toward*', X1 - 60, 238, { col: C.amber, size: 32 });
    A.in(tl, mv, tL + 0.3, 'fadeUp', { dur: 0.5 });
    tl.to(dq, { opacity: 0, duration: 0.3 }, tL);
    const lk = C3.chip(stage, 'circle-help', 'Wants to get closer?', 960, 760, { center: true, size: 34, col: C.muted });
    A.in(tl, lk, clamp(at(2, 'look like', 0.6), tL + 0.8, end(2) - 0.4), 'fadeUp', { dur: 0.5 });

    // ---------- beat 3: the other dog moves away: more distance
    const t3 = cue(3);
    const tA = clamp(at(3, 'moves away', 0.4), t3 + 0.1, end(3) - 1.6);
    tl.to(b.D.outer, { scaleX: 1, svgOrigin: `${X2} ${DYc}`, duration: 0.3 }, tA);
    tl.to(b.sv, { x: 300, duration: 1.2, ease: 'power2.inOut' }, tA + 0.25);
    const br = K.group(g, { opacity: 0 });
    const BY = GY + 50, bx0 = X1 + 170 + 190, bx1 = X2 + 300 - 150;
    const brL = K.path(br, `M ${bx0} ${BY - 22} L ${bx0} ${BY + 22}`, { stroke: C.green, 'stroke-width': 8 });
    const brR = K.path(br, `M ${bx0} ${BY - 22} L ${bx0} ${BY + 22}`, { stroke: C.green, 'stroke-width': 8 });
    const brM = K.path(br, `M ${bx0} ${BY} L ${bx0 + 1} ${BY}`, { stroke: C.green, 'stroke-width': 8 });
    tl.to(br, { opacity: 1, duration: 0.3 }, tA + 0.25);
    tl.to(brR, { attr: { d: `M ${bx1} ${BY - 22} L ${bx1} ${BY + 22}` }, duration: 1.2, ease: 'power2.inOut' }, tA + 0.25);
    tl.to(brM, { attr: { d: `M ${bx0} ${BY} L ${bx1} ${BY}` }, duration: 1.2, ease: 'power2.inOut' }, tA + 0.25);
    tl.to(lk, { opacity: 0, duration: 0.3 }, tA);
    const res = C3.chip(stage, 'move-horizontal', 'Result: *more distance*', (bx0 + bx1) / 2, 760, { center: true, size: 36, col: C.green });
    res.style.borderColor = C.green;
    A.in(tl, res, tA + 1.0, 'fadeUp', { dur: 0.5 });

    // ---------- beat 4: moved toward / accomplished more space
    const t4 = cue(4);
    tl.to(res, { opacity: 0, duration: 0.3 }, t4);
    tl.to(br, { opacity: 0.4, duration: 0.3 }, t4);
    const m1 = C3.chip(stage, 'arrow-right', 'Moved: *toward*', 420, 760, { col: C.amber, size: 38 });
    const m2 = C3.chip(stage, 'move-horizontal', 'Accomplished: *more space*', 900, 760, { col: C.green, size: 38 });
    m2.style.borderColor = C.green;
    A.in(tl, m1, t4 + 0.1, 'fadeRight', { dur: 0.5 });
    A.in(tl, m2, clamp(at(4, 'accomplished', 0.5), t4 + 0.6, end(4) - 0.4), 'fadeRight', { dur: 0.5 });

    // ---------- beat 5: look at the whole ABC and the outcome
    const t5 = cue(5);
    tl.to([m1, m2], { opacity: 0, y: 20, duration: 0.35 }, t5);
    const TS = 92, X0 = 470, TY = 735;
    const tiles = ['A', 'B', 'C'].map((L, k) => C3.tile(stage, L, X0 + k * (TS + 30), TY, TS, [COL.A, COL.B, COL.C][k]));
    tiles.forEach((n, k) => A.in(tl, n, t5 + 0.2 + k * 0.15, 'pop', { dur: 0.45 }));
    const wt = C3.put(stage, 'c3-big', 'Look at the <b>whole ABC</b> and the <b>outcome</b>', { x: X0 + 3 * TS + 2 * 30 + 50, y: TY + 14 });
    wt.style.fontSize = '46px';
    A.in(tl, wt, t5 + 0.5, 'fadeLeft', { dur: 0.6 });
    tl.to(tiles[2], { boxShadow: '0 0 0 10px rgba(97,149,55,0.45), 0 16px 34px rgba(40,60,20,0.22)', scale: 1.08, duration: 0.5 }, clamp(at(5, 'the outcome', 0.5), t5 + 0.8, end(5) - 0.3));
  });

  // ================================================================== ch03s10 What happens between A and B?
  registerScene('ch03s10', ctx => {
    const { stage, tl, cue, end, dur } = ctx;
    C2.style(stage);
    C3.css(stage);
    const at = (i, p, fb, lead) => sayAt(ctx, i, p, fb, lead);
    C3.head(ctx, 'What Happens Between A and B?', { size: 72 });

    const Y = 430, BW = 440, BH = 260;
    const mk = (L, col, title, sub) => {
      const c = C3.put(stage, 'c3-card', null, { x: 0, y: Y, w: BW, h: BH });
      Object.assign(c.style, { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' });
      const tl_ = K.el('div', 'c3-tile', L);
      Object.assign(tl_.style, { position: 'relative', width: '110px', height: '110px', background: col, fontSize: '68px' });
      c.appendChild(tl_);
      c.appendChild(K.el('div', null, `<span style="font:700 40px/1.1 var(--font-head);color:${C.ink};white-space:nowrap">${title}</span>`));
      if (sub) c.appendChild(K.el('div', null, `<span style="font:600 28px/1 var(--font-body);color:${C.inkSoft}">${sub}</span>`));
      return c;
    };
    const cA = mk('A', COL.A, 'The thing + context');
    const cB = mk('B', COL.B, 'Behavior');
    const AX0 = 340, BX0 = 1140, AX1 = 110, BX1 = 1370;
    gsap.set(cA, { x: AX0 });
    gsap.set(cB, { x: BX0 });
    const sv = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const MY = Y + BH / 2;
    const straight = K.path(sv, `M ${AX0 + BW + 30} ${MY} L ${BX0 - 30} ${MY} M ${BX0 - 56} ${MY - 24} L ${BX0 - 30} ${MY} L ${BX0 - 56} ${MY + 24}`, { stroke: C.olive, 'stroke-width': 10 });

    // ---------- beat 0: A and B with a single arrow
    A.in(tl, cA, cue(0) + 0.1, 'fadeUp', { dur: 0.6 });
    A.in(tl, cB, cue(0) + 0.35, 'fadeUp', { dur: 0.6 });
    A.draw(tl, straight, cue(0) + 0.8, 0.5);
    const qm = C3.qBadge(stage, 960, MY - 100, 90);
    A.in(tl, qm, clamp(at(0, 'between A and B', 0.7), cue(0) + 1.2, end(0) - 0.3), 'pop', { dur: 0.5 });

    // ---------- beat 1: A and B slide apart; the emotional response opens between them
    const t1 = cue(1);
    const tOpen = clamp(at(1, 'emotional response', 0.6), t1 + 0.4, end(1) - 1.2);
    tl.to(straight, { opacity: 0, duration: 0.3 }, tOpen - 0.4);
    tl.to(qm, { opacity: 0, scale: 0.5, duration: 0.3 }, tOpen - 0.4);
    tl.to(cA, { x: AX1, duration: 0.9, ease: 'power3.inOut' }, tOpen - 0.3);
    tl.to(cB, { x: BX1, duration: 0.9, ease: 'power3.inOut' }, tOpen - 0.3);
    const EW = 560, EX = 960 - EW / 2;
    const cE = C3.put(stage, 'c3-card', null, { x: EX, y: Y - 30, w: EW, h: BH + 60 });
    Object.assign(cE.style, { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '18px', background: COL.emoPale, border: '4px solid ' + COL.emo });
    const heart = K.el('div', null);
    Object.assign(heart.style, { width: '130px', height: '130px', borderRadius: '50%', background: COL.emo, display: 'grid', placeItems: 'center', position: 'relative' });
    heart.appendChild(K.icon('heart', { size: 72, stroke: 2.3, color: '#fff' }));
    cE.appendChild(heart);
    const eT = K.el('div', null, `<span style="font:700 46px/1 var(--font-head);color:${COL.emo};white-space:nowrap">Emotional response</span>`);
    cE.appendChild(eT);
    tl.fromTo(cE, { opacity: 0, scaleX: 0.2 }, { opacity: 1, scaleX: 1, duration: 0.8, ease: 'power3.out' }, tOpen + 0.3);
    const beat = (t0, t1_) => { const n = Math.max(1, Math.floor((t1_ - t0) / 1.1)); tl.fromTo(heart, { scale: 1 }, { scale: 1.12, duration: 0.18, yoyo: true, repeat: 1, repeatDelay: 0.05, ease: 'power2.out', immediateRender: false }, t0); for (let k = 1; k < n; k++) tl.to(heart, { scale: 1.12, duration: 0.18, yoyo: true, repeat: 1, ease: 'power2.out' }, t0 + k * 1.1); };
    beat(tOpen + 1.1, cue(4));
    const aAE = K.path(sv, `M ${AX1 + BW + 22} ${MY} L ${EX - 22} ${MY} M ${EX - 46} ${MY - 22} L ${EX - 22} ${MY} L ${EX - 46} ${MY + 22}`, { stroke: C.olive, 'stroke-width': 9 });
    A.draw(tl, aAE, tOpen + 0.9, 0.4);

    // ---------- beat 2: then we see the behavior
    const t2 = cue(2);
    const aEB = K.path(sv, `M ${EX + EW + 22} ${MY} L ${BX1 - 22} ${MY} M ${BX1 - 46} ${MY - 22} L ${BX1 - 22} ${MY} L ${BX1 - 46} ${MY + 22}`, { stroke: C.olive, 'stroke-width': 9 });
    A.draw(tl, aEB, t2 + 0.1, 0.4);
    tl.to(cB, { boxShadow: '0 0 0 6px rgba(97,149,55,1), 0 16px 40px rgba(40,60,20,0.18)', duration: 0.4 }, t2 + 0.5);

    // ---------- beat 3: not straight from A to B
    const t3 = cue(3);
    const over = K.path(sv, `M ${AX1 + BW / 2} ${Y - 20} C ${AX1 + BW / 2} ${Y - 170} ${BX1 + BW / 2} ${Y - 170} ${BX1 + BW / 2} ${Y - 20}`, { stroke: C.muted, 'stroke-width': 7, 'stroke-dasharray': '14 12' });
    A.in(tl, over, t3 + 0.1, 'fade', { dur: 0.5 });
    const xb = C2.badge(stage, 'x', 960, Y - 128, 84, C.red, '#fff');
    A.in(tl, xb, t3 + 0.8, 'pop', { dur: 0.45 });
    const tIn = clamp(at(3, 'in between', 0.85), t3 + 1.4, end(3) - 0.5);
    tl.to(cE, { boxShadow: '0 0 0 10px rgba(139,93,143,0.35), 0 16px 40px rgba(40,60,20,0.18)', duration: 0.5 }, tIn);
    tl.to([aAE, aEB], { stroke: COL.emo, duration: 0.4 }, tIn);

  });

  // ================================================================== ch03s11 Emotion and function are different
  registerScene('ch03s11', ctx => {
    const { stage, tl, cue, end } = ctx;
    C2.style(stage);
    C3.css(stage);
    const at = (i, p, fb, lead) => sayAt(ctx, i, p, fb, lead);
    C3.head(ctx, 'Emotion and Function Are Different', { size: 72 });

    const Y = 270, W = 760, H = 600;
    const card = (x, col, pale) => {
      const c = C3.put(stage, 'c3-card', null, { x, y: Y, w: W, h: H });
      c.style.border = `5px solid ${col}`;
      return c;
    };
    const cE = card(120, COL.emo);
    const cF = card(1040, C.green);
    const ne = K.el('div', 'c3-node', '≠');
    Object.assign(ne.style, { left: '910px', top: Y + H / 2 - 50 + 'px', width: '100px', height: '100px', background: C.inkSoft, fontSize: '64px' });
    stage.appendChild(ne);

    // ---------- beat 0: two cards and the not-equal sign
    A.in(tl, cE, cue(0) + 0.1, 'fadeRight', { dur: 0.6 });
    A.in(tl, cF, cue(0) + 0.3, 'fadeLeft', { dur: 0.6 });
    A.in(tl, ne, cue(0) + 0.8, 'pop', { dur: 0.5 });
    const title = (c, text, col) => { const n = C3.put(c, 'c3-big', text, { x: 0, y: 36, w: W, align: 'center' }); n.style.color = col; n.style.fontSize = '60px'; return n; };
    const tE = title(cE, 'Emotion', COL.emo);
    const tF = title(cF, 'Function', C.greenDark);
    A.in(tl, [tE, tF], cue(0) + 0.6, 'fadeUp', { dur: 0.5, stagger: 0.2 });

    // ---------- beat 1: inside the dog
    const t1 = cue(1);
    const esv = K.svg(cE, { x: 0, y: 0, w: W, h: H });
    const D = C2.dog(esv, W / 2, 290, 0.95);
    D.outer.setAttribute('opacity', '0.9');
    const hg = K.group(esv);
    const hc = K.circle(hg, W / 2 + 30, 268, 56, { fill: COL.emo, opacity: 0.35 });
    const hh = C2.svgIcon(hg, 'heart', W / 2 + 30, 268, 64, { stroke: '#fff', fill: COL.emo, 'stroke-width': 2 });
    tl.fromTo(D.outer, { opacity: 0 }, { opacity: 0.9, duration: 0.6 }, t1 + 0.1);
    tl.fromTo(hg, { opacity: 0, scale: 0.4, svgOrigin: `${W / 2 + 30} 268` }, { opacity: 1, scale: 1, svgOrigin: `${W / 2 + 30} 268`, duration: 0.6, ease: 'back.out(2)' }, clamp(at(1, 'inside the dog', 0.7), t1 + 0.5, end(1) - 0.4));
    tl.fromTo(hc, { attr: { r: 56 } }, { attr: { r: 80 }, opacity: 0, duration: 1.2, repeat: 2, ease: 'power1.out', immediateRender: false }, clamp(at(1, 'inside the dog', 0.7), t1 + 0.5, end(1) - 0.4) + 0.5);
    const qE = C3.put(cE, 'c3-mid', 'What is happening <b>inside</b> the dog?', { x: 40, y: 480, w: W - 80, align: 'center' });
    qE.querySelector('b').style.color = COL.emo;
    A.in(tl, qE, t1 + 0.8, 'fadeUp', { dur: 0.5 });

    // ---------- beat 2: what the behavior accomplished
    const t2 = cue(2);
    const TS = 110, G = 60, X0 = (W - 3 * TS - 2 * G) / 2, TY = 210;
    const tiles = ['A', 'B', 'C'].map((L, k) => C3.tile(cF, L, X0 + k * (TS + G), TY, TS, [COL.A, COL.B, COL.C][k]));
    tiles.forEach((n, k) => A.in(tl, n, t2 + 0.1 + k * 0.15, 'pop', { dur: 0.45 }));
    const tgt = C2.badge(cF, 'target', X0 + 2 * (TS + G) + TS / 2, TY + TS + 90, 100, C.green, '#fff');
    A.in(tl, tgt, t2 + 0.8, 'pop', { dur: 0.5 });
    tl.to(tiles[2], { boxShadow: '0 0 0 10px rgba(97,149,55,0.45), 0 16px 34px rgba(40,60,20,0.22)', duration: 0.5 }, t2 + 0.8);
    const qF = C3.put(cF, 'c3-mid', 'What did the behavior <b>accomplish</b>?', { x: 40, y: 480, w: W - 80, align: 'center' });
    A.in(tl, qF, t2 + 0.5, 'fadeUp', { dur: 0.5 });

    // ---------- beat 3: the emotion can stay a question; the function question still works
    const t3 = cue(3);
    const qq = C3.qBadge(cE, W - 120, 130, 96);
    A.in(tl, qq, t3 + 0.2, 'pop', { dur: 0.5 });
    tl.to(cE, { opacity: 0.6, duration: 0.5 }, clamp(at(3, 'look at the ABC', 0.5), t3 + 0.8, end(3) - 1.2));
    const ck = C2.badge(cF, 'check', W - 120, 130, 96, C.green, '#fff');
    ck.style.border = '6px solid #fff';
    const tC = clamp(at(3, 'what changed', 0.8), t3 + 1.2, end(3) - 0.5);
    A.in(tl, ck, tC, 'pop', { dur: 0.5 });
    tl.to(cF, { boxShadow: '0 0 0 8px rgba(97,149,55,0.35), 0 16px 40px rgba(40,60,20,0.18)', duration: 0.5 }, tC);
  });
})();
