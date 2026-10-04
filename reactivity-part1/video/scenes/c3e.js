// Chapter 3: homework and the hand-off to temperature.
//   ch03s16  Your homework              a worksheet fills row by row (the thing, the context, B, C, function) with question chips;
//                                       ends on WTF: What's The Function?
//   ch03s17  Now we can add temperature four checks recap the chapter; the pot and thermometer return; three things temperature
//                                       will show; logo close
(() => {
  const { sayAt, clamp } = C1;
  const { COL } = C3;
  const C = C1.C;

  // ================================================================== ch03s16 Your homework: find the thing
  registerScene('ch03s16', ctx => {
    const { stage, tl, cue, end } = ctx;
    C2.style(stage);
    C3.css(stage);
    const at = (i, p, fb, lead) => sayAt(ctx, i, p, fb, lead);
    C3.head(ctx, 'Your Homework: Find the Thing', { size: 72 });

    const WX = 110, WY = 240, WW = 1020, RH = 128;
    const sheet = C3.put(stage, 'c3-card', null, { x: WX, y: WY, w: WW, h: 5 * RH + 40 });
    A.in(tl, sheet, cue(0) + 0.2, 'fadeUp', { dur: 0.7 });
    const ROWS = [
      { L: 'A', col: COL.A, q: 'What was <b>the thing</b>?', ex: 'Another dog appears' },
      { L: 'A', col: COL.A, q: 'What was <b>the context</b>?', ex: 'Same corner, dogs too close' },
      { L: 'B', col: COL.B, q: 'What did your dog <b>do</b>?', ex: 'Barked and lunged' },
      { L: 'C', col: COL.C, q: 'What happened <b>as a result</b>?', ex: 'The other dog moved away' },
      { L: 'fn', col: C.green, q: 'What did the behavior <b>accomplish</b>?', ex: 'More distance?' },
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
      return { hl, lt, q, ex };
    });
    rows.forEach(r => gsap.set(r.ex, { clipPath: 'inset(0 100% 0 0)' }));
    const write = (k, t) => tl.to(rows[k].ex, { clipPath: 'inset(0 0% 0 0)', duration: 0.9, ease: 'none' }, t);
    const pencil = C2.badge(stage, 'pencil', 0, 0, 74, C.amber, '#fff');
    pencil.style.border = '5px solid #fff';
    gsap.set(pencil, { opacity: 0, x: WX + WW - 20, y: WY + 80 });
    let cur = -1;
    const focus = (k, t) => {
      if (cur >= 0) tl.to(rows[cur].hl, { opacity: 0, duration: 0.3 }, t);
      tl.to(rows[k].hl, { opacity: 1, duration: 0.3 }, t);
      tl.to(pencil, { opacity: 1, y: WY + 20 + k * RH + 64, duration: 0.6, ease: 'power3.inOut' }, t);
      cur = k;
    };
    // the question chips at right
    const RX = 1180;
    const qChips = (list, beat, cueList) => {
      let lo = cue(beat) + 0.3;
      return list.map(([ic, txt], k) => {
        const c = C3.chip(stage, ic, txt, RX, 300 + k * 104, { size: 30, col: C.olive });
        const tt = clamp(at(beat, cueList[k], 0.2 + 0.2 * k), lo, end(beat) - 0.3);
        A.in(tl, c, tt, 'fadeLeft', { dur: 0.45 });
        lo = tt + 0.35;
        return c;
      });
    };

    // beat 1: the thing (the doc's example writes in)
    focus(0, cue(1) + 0.1);
    write(0, cue(1) + 0.8);
    // beat 2: the context, with its four questions; the example writes in
    focus(1, cue(2) + 0.1);
    const ctxQ = qChips([['map-pin', 'Where were you?'], ['ruler', 'How close was the thing?'], ['eye', 'What was happening around?'], ['repeat', 'Does this happen here often?']], 2,
      ['Where were you', 'How close', 'What was happening', 'similar things happen']);
    write(1, cue(2) + 0.8);
    // beat 3: B
    const t5 = cue(3);
    tl.to(ctxQ, { opacity: 0, x: 30, duration: 0.35, stagger: 0.05 }, t5);
    focus(2, t5 + 0.1);
    write(2, t5 + 0.6);
    // beat 4: C, with its four questions
    const t6 = cue(4);
    focus(3, t6 + 0.1);
    const cQ = qChips([['move-horizontal', 'Did someone move away?'], ['arrow-right', 'Did your dog get closer?'], ['shield', 'Did they keep something?'], ['eye', 'Did they get attention?']], 4,
      ['move away', 'get closer', 'keep something', 'get attention']);
    write(3, end(4) - 1.0);
    // beat 5: function
    const t7 = cue(5);
    tl.to(cQ, { opacity: 0, x: 30, duration: 0.35, stagger: 0.05 }, t7);
    focus(4, t7 + 0.1);
    write(4, clamp(at(5, 'accomplish', 0.7), t7 + 0.5, end(5) - 0.6));
    // beat 6: not perfect
    const t8 = cue(6);
    const np = C3.row(stage, 'check', 'It doesn\u2019t have to be <b>perfect</b>', RX, 380, { col: C.green, size: 36 });
    A.in(tl, np, t8 + 0.2, 'fadeLeft', { dur: 0.5 });
    // beat 7: three goals
    const t9 = cue(7);
    tl.to(np, { opacity: 0, duration: 0.3 }, t9);
    tl.to(pencil, { opacity: 0, duration: 0.3 }, t9);
    tl.to(rows[4].hl, { opacity: 0, duration: 0.3 }, t9);
    const G = [['search', 'Find the <b>thing</b>', 'finding the thing'], ['map-pin', 'Notice the <b>context</b>', 'noticing the context'], ['repeat', 'See the <b>pattern</b>', 'seeing the pattern']];
    let lo = t9 + 0.2;
    const goals = G.map(([ic, tx, p], k) => {
      const r = C3.row(stage, ic, tx, RX + 20, 340 + k * 130, { col: C.green, size: 42 });
      const tt = clamp(at(7, p, 0.3 + 0.25 * k), lo, end(7) - 0.3);
      A.in(tl, r, tt, 'fadeLeft', { dur: 0.5 });
      lo = tt + 0.4;
      return r;
    });

    // beat 8: WTF = What's The Function? (big W, T, F tiles, then the words; the function row lights up)
    const t10 = cue(8);
    tl.to(goals, { opacity: 0, x: 30, duration: 0.35, stagger: 0.05 }, t10);
    const tW = clamp(at(8, 'WTF', 0.6), t10 + 0.4, end(8) - 2.2);
    const TS = 150, TX0 = 1210;
    const tiles = ['W', 'T', 'F'].map((L, k) => C3.tile(stage, L, TX0 + k * (TS + 40), 300, TS, k === 2 ? C.green : COL.A));
    tiles.forEach((n, k) => tl.fromTo(n, { opacity: 0, y: -80, rotation: [-8, 4, -4][k] }, { opacity: 1, y: 0, rotation: 0, duration: 0.6, ease: 'bounce.out' }, tW + k * 0.15));
    const q = C3.tile(stage, '?', TX0 + 3 * (TS + 40) - 20, 330, 90, C.amber);
    A.in(tl, q, tW + 0.6, 'pop', { dur: 0.4 });
    const words = C2.put(stage, 'c3-big', '<b>W</b>hat\u2019s <b>T</b>he <b>F</b>unction?', { x: 1180, y: 510, w: 640, align: 'center' });
    words.style.fontSize = '56px';
    const tWd = clamp(at(8, "What's the function", 0.85), tW + 0.9, end(8) - 0.4);
    A.in(tl, words, tWd, 'fadeUp', { dur: 0.6 });
    tl.to(rows[4].hl, { opacity: 1, duration: 0.4 }, tWd);
    tl.to(rows[4].lt, { scale: 1.15, duration: 0.3, yoyo: true, repeat: 1 }, tWd + 0.2);
  });

  // ================================================================== ch03s17 Now we can add temperature
  registerScene('ch03s17', ctx => {
    const { stage, tl, cue, end, dur } = ctx;
    C2.style(stage);
    C3.css(stage);
    const at = (i, p, fb, lead) => sayAt(ctx, i, p, fb, lead);
    const h = C3.head(ctx, 'Now We Can Add Temperature', { size: 72 });

    // ---------- beats 0 to 4: four checks
    const R = [
      ['zap', 'The thing and the *context*', COL.A],
      ['heart', 'An *emotional response* comes first', COL.emo],
      ['target', 'What the dog did, what happened, and *what it accomplished*', C.green],
      ['footprints', 'Practiced patterns get *stronger*', COL.dirtDeep],
    ];
    const rows = R.map(([ic, tx, col], k) => {
      const r = C3.row(stage, ic, tx, 160, 290 + k * 140, { col, size: 38 });
      r.style.whiteSpace = 'normal';
      r.style.width = '1400px';
      const ck = C2.badge(r, 'check', 0, 0, 44, C.green, '#fff');
      ck.style.position = 'relative';
      ck.style.left = ck.style.top = '0';
      r.insertBefore(ck, r.firstChild);
      return r;
    });
    // a quick visual recap while "Now we have the missing piece" is said (the recap lines were cut from the narration)
    rows.forEach((r, k) => A.in(tl, r, cue(0) + 0.15 + k * 0.3, 'fadeRight', { dur: 0.5 }));

    // ---------- beat 1: back to the pot; the thermometer warms
    const t5 = Math.max(cue(1), cue(0) + 1.8);
    tl.to(rows, { scale: 0.66, transformOrigin: '0% 50%', x: -40, y: (k) => -50 - k * 38, opacity: 0.5, duration: 0.8, ease: 'power3.inOut' }, t5);
    const LP = C3.layer(stage);
    const { P, merc } = C3.potWithThermo(LP, 1380, 420, 0.85);
    tl.fromTo(P.wrap, { opacity: 0, x: 120 }, { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out' }, t5 + 0.3);
    P.waves(tl, t5, dur);
    const tP = clamp(at(1, 'add temperature', 0.7), t5 + 1.0, end(1) - 0.8);
    tl.fromTo(merc, { attr: { y: 240, height: 50 } }, { attr: { y: 120, height: 170 }, duration: 1.4, ease: 'power2.inOut', immediateRender: false }, tP);
    const tp = C2.pill(stage, 'thermometer', '*Temperature*', { x: 1380, y: 820, center: true, col: C.red, size: 34 });
    A.in(tl, tp, tP + 0.2, 'fadeUp', { dur: 0.5 });

    // ---------- beat 2: what temperature will show
    const t6 = cue(2);
    tl.to(rows, { opacity: 0, duration: 0.4 }, t6);
    const Q = [['trending-up', 'As a response *builds*', 'as a response builds'], ['brain', 'The dog’s *ability to think*', 'ability to think'], ['triangle-alert', 'Getting closer to *threshold*', 'closer to threshold']];
    let lo = t6 + 0.3;
    const qs = Q.map(([ic, tx, p], k) => {
      const r = C3.row(stage, ic, tx, 160, 330 + k * 140, { col: k === 2 ? C.amber : C.green, size: 42 });
      const tt = clamp(at(2, p, 0.15 + 0.33 * k), lo, end(2) - 0.5);
      A.in(tl, r, tt, 'fadeRight', { dur: 0.5 });
      lo = tt + 0.5;
      if (k === 0) tl.to(merc, { attr: { y: 40, height: 250 }, duration: 1.2, ease: 'power2.inOut' }, tt + 0.2);
      return { r, tt };
    });
    // the rim is the threshold (label only; Tori asked for no line on the rim)
    const thr = C3.chip(stage, null, 'Threshold', 1380 + C2.R * 0.85 + 30, 420 - 30, { size: 28 });
    thr.style.borderColor = C.amber;
    thr.style.color = C.amberText;
    A.in(tl, thr, qs[2].tt + 0.3, 'fadeLeft', { dur: 0.4 });
    const nx = C2.bookmark(stage, 'Next chapter: *Temperature*', 160, 780, 'thermometer');
    nx.querySelectorAll('b').forEach(b => { b.style.color = '#b8d99a'; });
    A.in(tl, nx, Math.min(end(2) + 0.2, dur - 4.4), 'fadeUp', { dur: 0.6 });

    // ---------- logo close
    const tL = Math.min(end(2) + 2.0, dur - 2.6);
    SKIT.logoClose(ctx, tL, [h.root, LP, tp, thr, nx, ...qs.map(q => q.r)]);
  });
})();
