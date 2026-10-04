// Chapter 3: movement isn't function.
//   ch03s07  Movement isn't function        a drawn dog lunges toward another dog (looks like it wants to get closer; it wants
//                                           the other dog to go away), the other dog moves away: more space
(() => {
  const { sayAt, clamp } = C1;
  const { COL } = C3;
  const C = C1.C;

  // ------------------------------------------------------------------ a second, grey dog facing left (stage svg of its own)
  function dogSvg(stage, cx, cy, s, o = {}) {
    const sv = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const D = C2.dog(sv, cx, cy, s);
    if (o.flip) gsap.set(D.outer, { scaleX: -1, svgOrigin: `${cx} ${cy}` });
    if (o.filter) sv.style.filter = o.filter;
    return { sv, D };
  }

  // ================================================================== ch03s07 Movement isn't function
  registerScene('ch03s07', ctx => {
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
    const mv = C3.chip(stage, 'arrow-right', 'Moved *toward*', X1 + 300, 296, { col: C.amber, size: 32 });
    A.in(tl, mv, tL + 0.3, 'fadeUp', { dur: 0.5 });
    tl.to(dq, { opacity: 0, duration: 0.3 }, tL);
    const lk = C3.chip(stage, 'eye', 'May look like: *wants to get closer*', 960, 760, { center: true, size: 34, col: C.muted });
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
    const tRe = clamp(at(3, 'in reality', 0.2), t3 + 0.1, tA - 0.6);
    tl.to(lk, { opacity: 0, duration: 0.3 }, tRe);
    const re = C3.chip(stage, 'target', 'In reality: *wants the other dog to go away*', 960, 760, { center: true, size: 34, col: C.green });
    re.style.borderColor = C.green;
    A.in(tl, re, tRe + 0.2, 'fadeUp', { dur: 0.5 });
    tl.to(re, { opacity: 0, duration: 0.3 }, tA + 0.7);
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

    // ---------- beat 5: look at the entire picture: the ABCs
    const t5 = cue(5);
    tl.to([m1, m2], { opacity: 0, y: 20, duration: 0.35 }, t5);
    const TS = 92, X0 = 470, TY = 735;
    const tiles = ['A', 'B', 'C'].map((L, k) => C3.tile(stage, L, X0 + k * (TS + 30), TY, TS, [COL.A, COL.B, COL.C][k]));
    tiles.forEach((n, k) => A.in(tl, n, t5 + 0.2 + k * 0.15, 'pop', { dur: 0.45 }));
    const wt = C3.put(stage, 'c3-big', 'Look at the <b>entire picture</b>: the ABCs', { x: X0 + 3 * TS + 2 * 30 + 50, y: TY + 14 });
    wt.style.fontSize = '46px';
    A.in(tl, wt, t5 + 0.5, 'fadeLeft', { dur: 0.6 });
    tl.to(tiles, { scale: 1.1, duration: 0.25, yoyo: true, repeat: 1, stagger: 0.15 }, clamp(at(5, 'ABCs', 0.4), t5 + 1.0, end(5) - 0.6));
  });

})();
