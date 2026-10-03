// Chapter 3: practice, management, homework, and the hand-off to temperature.
//   ch03s14  Practice builds the path   the lawn: the old path deepens with use; a new path wears in; the old fades; it can return
//   ch03s15  Why management matters     months or years on the old path; a fence across it; successful steps on the new one
//   ch03s16  Your homework              a worksheet fills row by row (the thing, the context, B, C, function) with question chips
//   ch03s17  Now we can add temperature four checks recap the chapter; the pot and thermometer return; three things temperature
//                                       will show; logo close
(() => {
  const { sayAt, clamp } = C1;
  const { COL } = C3;
  const C = C1.C;

  function lawnLabels(LV, LW, oldTxt, newTxt) {
    const [ox, oy] = LW.toStage(...LW.at('old', 0.6)), [nx, ny] = LW.toStage(...LW.at('neu', 0.5));
    const endB = C2.badge(LV, 'move-horizontal', LW.x + LW.ex, LW.y + LW.ey, 110, C.greenDeep, '#fff');
    endB.style.border = '6px solid #fff';
    const oL = C3.chip(LV, 'volume-2', oldTxt, ox, oy + 40, { center: true, col: C.red, size: 30 });
    const nL = C3.chip(LV, 'eye', newTxt, nx, ny - 104, { center: true, col: C.green, size: 30 });
    return { oL, nL, ox, oy, nx, ny, endB };
  }

  // ================================================================== ch03s14 Practice builds the path
  registerScene('ch03s14', ctx => {
    const { stage, tl, cue, end } = ctx;
    C2.style(stage);
    C3.css(stage);
    const at = (i, p, fb, lead) => sayAt(ctx, i, p, fb, lead);
    C3.head(ctx, 'Practice Builds the Path', { size: 72 });

    const LV = C3.layer(stage);
    const LW = C3.lawn(LV, { x: 160, y: 250, w: 1600, h: 420, old: 0.75, neu: 0, bow: 130 });
    const lb = lawnLabels(LV, LW, 'Old path', 'New path');
    gsap.set(lb.nL, { opacity: 0 });
    tl.fromTo(LV, { opacity: 0 }, { opacity: 1, duration: 0.6, immediateRender: true }, cue(0) + 0.1);

    const CARDS = [
      { t: 'Practice the new path', s: 'New path gets *stronger*', icon: 'trending-up', col: C.green },
      { t: 'Less practice of the old path', s: 'Old path *begins to fade*', icon: 'trending-down', col: C.greenDeep },
      { t: 'Practice the old path again', s: 'Old path can *strengthen again*', icon: 'repeat', col: C.amber },
    ];
    const cards = CARDS.map((c, k) => {
      const n = C3.put(stage, 'c3-card', null, { x: 160 + k * 540, y: 720, w: 520, h: 200 });
      Object.assign(n.style, { padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '14px' });
      const top = K.el('div', null);
      Object.assign(top.style, { display: 'flex', alignItems: 'center', gap: '16px' });
      const ic = K.el('div', null);
      Object.assign(ic.style, { width: '58px', height: '58px', borderRadius: '50%', background: c.col, display: 'grid', placeItems: 'center', flex: '0 0 auto' });
      ic.appendChild(K.icon(c.icon, { size: 32, stroke: 2.5, color: '#fff' }));
      top.appendChild(ic);
      top.appendChild(K.el('div', null, `<span style="font:700 32px/1.1 var(--font-head);color:${C.ink}">${c.t}</span>`));
      n.appendChild(top);
      n.appendChild(K.el('div', null, `<span style="font:600 30px/1.2 var(--font-body);color:${C.inkSoft}">${K.md(c.s)}</span>`));
      n.querySelectorAll('b').forEach(b => { b.style.color = c.col; });
      return n;
    });

    // beat 1: the path in use gets easier: footprints, it deepens
    const t1 = cue(1);
    LW.walk(tl, 'old', t1 + 0.2, 2.0, 10);
    LW.set(tl, 'old', 1, t1 + 0.6, 1.4);
    // beat 2: another path: draws in with practice
    const t2 = cue(2);
    const tNew = clamp(at(2, 'another path', 0.3), t2 + 0.1, end(2) - 3);
    A.in(tl, lb.nL, tNew, 'fadeUp', { dur: 0.5 });
    LW.set(tl, 'neu', 0.3, tNew, 0.6);
    const tPr = clamp(at(2, 'practice it successfully', 0.7), tNew + 1.0, end(2) - 1.5);
    LW.walk(tl, 'neu', tPr, 2.0, 10);
    LW.set(tl, 'neu', 0.85, tPr + 0.3, 1.6);
    A.in(tl, cards[0], tPr, 'fadeUp', { dur: 0.6 });
    // beat 3: less rehearsal, the old path fades
    const t3 = cue(3);
    LW.set(tl, 'old', 0.22, t3 + 0.3, 1.6);
    tl.to(lb.oL, { opacity: 0.55, duration: 0.6 }, t3 + 0.3);
    A.in(tl, cards[1], t3 + 0.3, 'fadeUp', { dur: 0.6 });
    // beat 4: practiced again, it strengthens again
    const t4 = cue(4);
    const tAg = clamp(at(4, 'practiced repeatedly', 0.4), t4 + 0.1, end(4) - 2.6);
    LW.walk(tl, 'old', tAg, 2.2, 10, '#7a2a1a');
    LW.set(tl, 'old', 0.85, tAg + 0.6, 1.8);
    tl.to(lb.oL, { opacity: 1, duration: 0.4 }, tAg + 0.6);
    A.in(tl, cards[2], clamp(at(4, 'stronger again', 0.85), tAg + 0.8, end(4) - 0.4), 'fadeUp', { dur: 0.6 });
  });

  // ================================================================== ch03s15 Why management matters
  registerScene('ch03s15', ctx => {
    const { stage, tl, cue, end } = ctx;
    C2.style(stage);
    C3.css(stage);
    const at = (i, p, fb, lead) => sayAt(ctx, i, p, fb, lead);
    C3.head(ctx, 'Management Protects the New Path', { size: 72 });

    const LV = C3.layer(stage);
    const LW = C3.lawn(LV, { x: 160, y: 250, w: 1600, h: 440, old: 0.95, neu: 0.35, bow: 140 });
    const lb = lawnLabels(LV, LW, 'Old path', 'New path');
    tl.fromTo(LV, { opacity: 0 }, { opacity: 1, duration: 0.6, immediateRender: true }, cue(0) + 0.1);

    // beat 1: months or years of learning on the old path
    const t1 = cue(1);
    const [mx, my] = LW.toStage(...LW.at('old', 0.38));
    const mo = C3.chip(stage, 'calendar', '*Months or years* of learning', mx, my - 92, { center: true, col: COL.dirtDeep, size: 30 });
    mo.querySelector('.ic').style.background = COL.dirtDeep;
    A.in(tl, mo, clamp(at(1, 'years or months', 0.6), t1 + 0.4, end(1) - 0.5), 'pop', { dur: 0.5 });
    LW.walk(tl, 'old', t1 + 0.4, 2.0, 10);

    // beat 2: reduce practice of the old one: a fence
    const t2 = cue(2);
    tl.to(mo, { opacity: 0, duration: 0.3 }, t2);
    const [fx, fy] = LW.at('old', 0.2);
    const fence = K.group(LW.svg);
    for (let k = -2; k <= 2; k++) K.rect(fence, fx - 8 + k * 30, fy - 70, 16, 140, { rx: 6, fill: '#ffffff', stroke: C.greenDeep, 'stroke-width': 4 });
    K.rect(fence, fx - 80, fy - 40, 160, 16, { rx: 6, fill: '#ffffff', stroke: C.greenDeep, 'stroke-width': 4 });
    K.rect(fence, fx - 80, fy + 20, 160, 16, { rx: 6, fill: '#ffffff', stroke: C.greenDeep, 'stroke-width': 4 });
    const tF = clamp(at(2, 'reduce unnecessary opportunities', 0.5), t2 + 0.3, end(2) - 1.2);
    tl.fromTo(fence, { opacity: 0, y: -80 }, { opacity: 1, y: 0, duration: 0.6, ease: 'bounce.out' }, tF);
    const r1 = C3.row(stage, 'shield-check', '*Reduce* practice of the old pattern', 160, 730, { col: C.greenDeep, size: 36 });
    A.in(tl, r1, tF + 0.4, 'fadeRight', { dur: 0.5 });
    LW.set(tl, 'old', 0.6, tF + 0.6, 1.4);

    // beat 3: successful practice of the new one
    const t3 = cue(3);
    const tS = clamp(at(3, 'successfully use', 0.5), t3 + 0.2, end(3) - 2);
    LW.walk(tl, 'neu', tS, 2.0, 10);
    LW.set(tl, 'neu', 0.75, tS + 0.4, 1.4);
    [0.2, 0.36, 0.82].forEach((f, k) => {
      const [cx, cy] = LW.toStage(...LW.at('neu', f));
      const b = C2.badge(stage, 'check', cx, cy - 56, 50, C.green, '#fff');
      A.in(tl, b, tS + 0.5 + k * 0.6, 'pop', { dur: 0.4 });
    });
    const r2 = C3.row(stage, 'check', '*Create* successful practice of the new pattern', 160, 840, { col: C.green, size: 36 });
    A.in(tl, r2, tS + 0.4, 'fadeRight', { dur: 0.5 });

    // beat 4: less rehearsal of the old path, more successful practice of the new one
    const t4 = cue(4);
    LW.set(tl, 'old', 0.3, t4 + 0.2, 1.2);
    LW.set(tl, 'neu', 1, t4 + 0.2, 1.2);
    const less = C3.put(stage, 'c3-big', '<i>Less</i>', { x: lb.ox + 220, y: lb.oy - 40 });
    const more = C3.put(stage, 'c3-big', '<b>More</b>', { x: lb.nx + 170, y: lb.ny - 128 });
    A.in(tl, less, clamp(at(4, 'Less rehearsal', 0.1), t4 + 0.1, end(4) - 1.5), 'pop', { dur: 0.5 });
    A.in(tl, more, clamp(at(4, 'More successful', 0.55), t4 + 0.8, end(4) - 0.4), 'pop', { dur: 0.5 });
  });

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

    // beat 1: the thing
    focus(0, cue(1) + 0.1);
    // beat 2: the context, with its four questions
    focus(1, cue(2) + 0.1);
    const ctxQ = qChips([['map-pin', 'Where were you?'], ['ruler', 'How close was the thing?'], ['eye', 'What was happening around?'], ['repeat', 'Does this happen here often?']], 2,
      ['Where were you', 'How close', 'What was happening', 'similar things happen']);
    // beat 3: the example fills in
    const t3 = cue(3);
    tl.to(ctxQ, { opacity: 0, x: 30, duration: 0.35, stagger: 0.05 }, t3);
    focus(0, t3 + 0.1);
    write(0, clamp(at(3, 'another dog appearing', 0.2), t3 + 0.3, end(3) - 3));
    const tC = clamp(at(3, 'The context might be', 0.45), t3 + 1.5, end(3) - 1.2);
    focus(1, tC);
    write(1, tC + 0.3);
    // beat 4: the place predicts
    const t4 = cue(4);
    const pr = C3.row(stage, 'map-pin', 'The place can <b>predict</b><br>the encounter', RX, 400, { col: COL.A, size: 36 });
    A.in(tl, pr, t4 + 0.3, 'fadeLeft', { dur: 0.5 });
    // beat 5: B
    const t5 = cue(5);
    tl.to(pr, { opacity: 0, duration: 0.3 }, t5);
    focus(2, t5 + 0.1);
    write(2, t5 + 0.6);
    // beat 6: C, with its four questions
    const t6 = cue(6);
    focus(3, t6 + 0.1);
    const cQ = qChips([['move-horizontal', 'Did someone move away?'], ['arrow-right', 'Did your dog get closer?'], ['shield', 'Did they keep something?'], ['eye', 'Did they get attention?']], 6,
      ['move away', 'get closer', 'keep something', 'get attention']);
    write(3, end(6) - 1.0);
    // beat 7: function
    const t7 = cue(7);
    tl.to(cQ, { opacity: 0, x: 30, duration: 0.35, stagger: 0.05 }, t7);
    focus(4, t7 + 0.1);
    write(4, clamp(at(7, 'accomplish', 0.7), t7 + 0.5, end(7) - 0.6));
    // beat 8: not perfect
    const t8 = cue(8);
    const np = C3.row(stage, 'check', 'It doesn’t have to be <b>perfect</b>', RX, 380, { col: C.green, size: 36 });
    A.in(tl, np, t8 + 0.2, 'fadeLeft', { dur: 0.5 });
    // beat 9: three goals
    const t9 = cue(9);
    tl.to(np, { opacity: 0, duration: 0.3 }, t9);
    tl.to(pencil, { opacity: 0, duration: 0.3 }, t9);
    tl.to(rows[4].hl, { opacity: 0, duration: 0.3 }, t9);
    const G = [['search', 'Find the <b>thing</b>', 'finding the thing'], ['map-pin', 'Notice the <b>context</b>', 'noticing the context'], ['repeat', 'See the <b>pattern</b>', 'seeing the pattern']];
    let lo = t9 + 0.2;
    G.forEach(([ic, tx, p], k) => {
      const r = C3.row(stage, ic, tx, RX + 20, 340 + k * 130, { col: C.green, size: 42 });
      const tt = clamp(at(9, p, 0.3 + 0.25 * k), lo, end(9) - 0.3);
      A.in(tl, r, tt, 'fadeLeft', { dur: 0.5 });
      lo = tt + 0.4;
    });
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
    rows.forEach((r, k) => A.in(tl, r, cue(k + 1) + 0.15, 'fadeRight', { dur: 0.55 }));
    const mp = C3.chip(stage, 'puzzle', 'We have *the missing piece*', 160, 290, { col: C.green, size: 34 });
    A.in(tl, mp, cue(0) + 0.2, 'pop', { dur: 0.5 });
    tl.to(mp, { opacity: 0, duration: 0.3 }, cue(1));

    // ---------- beat 5: back to the pot; the thermometer warms
    const t5 = cue(5);
    tl.to(rows, { scale: 0.66, transformOrigin: '0% 50%', x: -40, y: (k) => -50 - k * 38, opacity: 0.5, duration: 0.8, ease: 'power3.inOut' }, t5);
    const LP = C3.layer(stage);
    const { P, merc } = C3.potWithThermo(LP, 1380, 420, 0.85);
    tl.fromTo(P.wrap, { opacity: 0, x: 120 }, { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out' }, t5 + 0.3);
    P.waves(tl, t5, dur);
    const tP = clamp(at(5, 'add temperature', 0.7), t5 + 1.0, end(5) - 0.8);
    tl.fromTo(merc, { attr: { y: 240, height: 50 } }, { attr: { y: 120, height: 170 }, duration: 1.4, ease: 'power2.inOut', immediateRender: false }, tP);
    const tp = C2.pill(stage, 'thermometer', '*Temperature*', { x: 1380, y: 820, center: true, col: C.red, size: 34 });
    A.in(tl, tp, tP + 0.2, 'fadeUp', { dur: 0.5 });

    // ---------- beat 6: what temperature will show
    const t6 = cue(6);
    tl.to(rows, { opacity: 0, duration: 0.4 }, t6);
    const Q = [['trending-up', 'As a response *builds*', 'as a response builds'], ['brain', 'The dog’s *ability to think*', 'ability to think'], ['triangle-alert', 'Getting closer to *threshold*', 'closer to threshold']];
    let lo = t6 + 0.3;
    const qs = Q.map(([ic, tx, p], k) => {
      const r = C3.row(stage, ic, tx, 160, 330 + k * 140, { col: k === 2 ? C.amber : C.green, size: 42 });
      const tt = clamp(at(6, p, 0.15 + 0.33 * k), lo, end(6) - 0.5);
      A.in(tl, r, tt, 'fadeRight', { dur: 0.5 });
      lo = tt + 0.5;
      if (k === 0) tl.to(merc, { attr: { y: 40, height: 250 }, duration: 1.2, ease: 'power2.inOut' }, tt + 0.2);
      return { r, tt };
    });
    // the rim is the threshold
    const rim = K.svgEl('ellipse', { cx: 0, cy: 0, rx: C2.R + 6, ry: 48, fill: 'none', stroke: C.amber, 'stroke-width': 8, 'stroke-dasharray': '16 12', opacity: 0 }, P.svg);
    tl.to(rim, { opacity: 1, duration: 0.4, yoyo: true, repeat: 3 }, qs[2].tt + 0.2);
    tl.to(rim, { opacity: 1, duration: 0.3 }, qs[2].tt + 1.8);
    const thr = C3.chip(stage, null, 'Threshold', 1380 + C2.R * 0.85 + 30, 420 - 30, { size: 28 });
    thr.style.borderColor = C.amber;
    thr.style.color = C.amberText;
    A.in(tl, thr, qs[2].tt + 0.3, 'fadeLeft', { dur: 0.4 });
    const nx = C2.bookmark(stage, 'Next chapter: *Temperature*', 160, 780, 'thermometer');
    nx.querySelectorAll('b').forEach(b => { b.style.color = '#b8d99a'; });
    A.in(tl, nx, Math.min(end(6) + 0.2, dur - 4.4), 'fadeUp', { dur: 0.6 });

    // ---------- logo close
    const tL = Math.min(end(6) + 2.0, dur - 2.6);
    SKIT.logoClose(ctx, tL, [h.root, LP, tp, thr, nx, ...qs.map(q => q.r)]);
  });
})();
