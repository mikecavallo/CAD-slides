// Chapter 2: lowering the water, and the next part of the picture. Pot and helpers come from window.C2 (c2_pot.js).
//   ch02s11  The baseline can change          the full pot with six floating factors; a magnifier finds them; green checks;
//                                              one change per phrase lifts a factor out and the water drops a step; more room
//   ch02s12  The water level is only part ...  three checks; the pot fills only half of the picture; three questions in the other
//                                              half; a dashed slot on the pot; a thermometer drops in: "Now, how hot is it?"; logo close
(() => {
  const CSS = `
  .c2f-act { position: absolute; display: flex; align-items: center; gap: 18px; height: 80px; padding: 0 28px 0 10px; border-radius: 999px;
    background: var(--green-pale); color: var(--green-deep); font: 700 30px/1 var(--font-body); white-space: nowrap; }
  .c2f-act .ic { width: 60px; height: 60px; border-radius: 50%; background: var(--green); color: #fff; display: grid; place-items: center; flex: 0 0 auto; }
  .c2f-act .ic svg { width: 34px; height: 34px; stroke-width: 2.3; }
  .c2f-ck { position: absolute; display: flex; align-items: center; gap: 22px; font: 700 40px/1 var(--font-head); color: var(--ink); white-space: nowrap; }
  .c2f-ck .ic { width: 64px; height: 64px; border-radius: 50%; background: var(--green); color: #fff; display: grid; place-items: center; }
  .c2f-ck .ic svg { width: 38px; height: 38px; stroke-width: 3; }
  .c2f-know { position: absolute; font: 600 46px/1.2 var(--font-head); color: var(--ink); }
  .c2f-know b { color: #2f7fae; font-weight: 700; }
  .c2f-frame { position: absolute; border-radius: 34px; }
  .c2f-qc { position: absolute; width: 700px; height: 124px; display: flex; align-items: center; gap: 24px; padding: 0 30px 0 18px; background: #fff;
    border-radius: 26px; border: 1px solid #e6e9e1; box-shadow: var(--shadow-soft); font: 700 36px/1.15 var(--font-head); color: var(--ink); }
  .c2f-qc .ic { width: 84px; height: 84px; border-radius: 50%; display: grid; place-items: center; flex: 0 0 auto; background: var(--amber-pale); color: var(--amber); }
  .c2f-qc .ic svg { width: 46px; height: 46px; stroke-width: 2.2; }
  .c2f-hot { position: absolute; font: 700 84px/1.1 var(--font-head); color: var(--ink); white-space: nowrap; }
  .c2f-hot b { color: var(--red); font-weight: 700; }
  `;
  const css = stage => stage.appendChild(K.el('style', null, CSS));
  const { sayAt, clamp } = C1;
  const { C } = C2;

  // ================================================================== ch02s11 The baseline can change
  registerScene('ch02s11', ctx => {
    const { stage, tl, cue, end, dur } = ctx;
    C2.style(stage);
    css(stage);
    const at = (i, p, fb, lead) => sayAt(ctx, i, p, fb, lead);
    const h = K.heading(stage, 'The Baseline Can Change', { x: 100, y: 120, size: 80 });
    A.in(tl, h.all, 0.05, 'fadeUp', { dur: 0.7, stagger: 0.1 });

    // ---------- beat 0: the full pot with its factors floating; a magnifier finds them
    const PX = 1250, PY = 430, S = 0.95;
    const P = C2.makePot(stage, { cx: PX, y: PY, s: S, level: 0.88 });
    A.in(tl, P.wrap, 0.1, 'fade', { dur: 0.6 });
    P.waves(tl, 0, dur);
    const FACT = [['stethoscope', C2.AREAS[0].col, -150, 70], ['moon', C2.AREAS[0].col, -60, 100], ['activity', C2.AREAS[1].col, 30, 66],
      ['paw-print', C2.AREAS[1].col, 130, 96], ['shuffle', C2.AREAS[3].col, -110, 160], ['hourglass', C2.AREAS[2].col, 70, 150]];
    const toks = FACT.map(([ic, col, x, y]) => { const t = P.addToken(ic, col, x, y, 38); P.showToken(t); return t; });
    gsap.set(toks.map(t => t.outer), { opacity: 0 });
    A.in(tl, toks.map(t => t.outer), 0.4, 'fade', { dur: 0.5, stagger: 0.06 });
    P.bob(tl, 0.5, dur);
    const lens = K.el('div');
    Object.assign(lens.style, { position: 'absolute', left: '0px', top: '0px', width: '170px', height: '170px', borderRadius: '50%', border: '12px solid var(--green-dark)',
      background: 'rgba(255,255,255,0.22)', boxShadow: '0 14px 30px rgba(40,60,20,0.25)' });
    const hnd = K.el('div');
    Object.assign(hnd.style, { position: 'absolute', left: '134px', top: '134px', width: '22px', height: '100px', borderRadius: '11px', background: 'var(--green-dark)', transform: 'rotate(-45deg)', transformOrigin: '50% 0%' });
    lens.appendChild(hnd);
    stage.appendChild(lens);
    const pts = toks.map(t => P.toStage(t.x, C2.surfY(0.88) + t.y));
    const t0 = cue(0) + 0.6;
    tl.fromTo(lens, { opacity: 0, x: pts[0][0] - 85 - 120, y: pts[0][1] - 85 }, { opacity: 1, x: pts[0][0] - 85, duration: 0.5, ease: 'power2.out' }, t0);
    [1, 2, 3].forEach((k, j) => tl.to(lens, { x: pts[k][0] - 85, y: pts[k][1] - 85, duration: 0.55, ease: 'power2.inOut' }, t0 + 0.6 + j * 0.65));
    tl.to(lens, { opacity: 0, duration: 0.4 }, Math.min(t0 + 2.8, cue(1) + 0.2));
    const idn = C2.pill(stage, 'search', 'Identify what *can be improved*', { x: PX, y: 852, center: true, size: 32 });
    A.in(tl, idn, t0 + 0.8, 'fadeUp', { dur: 0.6 });

    // ---------- beat 1: many of them we can do something about: green rings
    const t1 = cue(1);
    toks.forEach((t, k) => tl.fromTo(t.ring, { opacity: 0, scale: 0.6, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, t1 + 0.3 + k * 0.15));

    // ---------- beat 2: one change per phrase lifts a factor out; the water drops a step
    const t2 = cue(2);
    const ACT = [['stethoscope', 'Address pain or illness', 'address pain'], ['moon', 'Improve sleep or nutrition', 'improve sleep'],
      ['activity', 'Adjust physical or mental activity', 'adjust physical'], ['paw-print', 'Better meet natural needs', 'better meet natural'],
      ['calendar-check', 'More predictability and choice', 'more predictability'], ['hourglass', 'More time to recover', 'opportunity for recovery']];
    let lo = t2 + 0.2, L = 0.88;
    ACT.forEach(([ic, t, p], k) => {
      const r = K.el('div', 'c2f-act');
      const icn = K.el('div', 'ic');
      icn.appendChild(K.icon(ic));
      r.appendChild(icn);
      r.appendChild(K.el('span', null, K.md(t)));
      Object.assign(r.style, { left: '100px', top: 278 + k * 100 + 'px' });
      stage.appendChild(r);
      const tt = clamp(at(2, p, 0.08 + k * 0.15, 0.3), lo, end(2) - 1);
      A.in(tl, r, tt, 'fadeRight', { dur: 0.5 });
      P.liftToken(tl, toks[k], tt + 0.3);
      L -= 0.095;
      P.setLevel(tl, L, tt + 0.5, 0.8);
      lo = tt + 0.6;
    });

    // ---------- beat 3: the water settles low; more room
    const t3 = cue(3);
    P.setLevel(tl, 0.26, t3 + 0.1, 1.0);
    const sv = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const ax = PX - (C2.R + 70) * S - 40;
    const arr = K.path(sv, `M ${ax} 420 L ${ax} 600 M ${ax - 34} 566 L ${ax} 600 L ${ax + 34} 566`, { stroke: C.green, 'stroke-width': 14, fill: 'none' });
    A.in(tl, arr, t3 + 0.2, 'fadeDown', { dur: 0.6 });
    tl.to(arr, { y: 16, duration: 0.45, yoyo: true, repeat: 3, ease: 'sine.inOut' }, t3 + 0.8);
    tl.fromTo(P.br, { opacity: 0 }, { opacity: 1, duration: 0.4, immediateRender: false }, t3 + 0.6);
    tl.set(P.br, { opacity: 0 }, 0);
    const more = C2.pill(stage, 'maximize-2', 'More room', { x: P.bracketX(), y: 0, variant: 'green', size: 30 });
    P.follow(more, 'mid', -36);
    A.in(tl, more, t3 + 1.0, 'fadeRight', { dur: 0.5 });
  });

  // ================================================================== ch02s12 The water level is only part of the picture
  registerScene('ch02s12', ctx => {
    const { stage, tl, cue, end, dur, chrome } = ctx;
    C2.style(stage);
    css(stage);
    const at = (i, p, fb, lead) => sayAt(ctx, i, p, fb, lead);
    const h = K.heading(stage, 'The Water Level Is Only Part of the Picture', { x: 100, y: 120, w: 1480, size: 58 });
    A.in(tl, h.all, 0.05, 'fadeUp', { dur: 0.7, stagger: 0.1 });

    // ---------- beat 0: the pot and three checks
    const LA = C2.layer(stage);
    const PX = 560, PY = 440, S = 0.92;
    const P = C2.makePot(LA, { cx: PX, y: PY, s: S, level: 0.5 });
    A.in(tl, P.wrap, 0.1, 'fadeUp', { dur: 0.7 });
    P.waves(tl, 0, dur);
    const CK = [['What the water level represents', 'represents', 0.35], ['Why it matters', 'why it matters', 0.55], ['What can change it', 'change it', 0.9]];
    let lo = cue(0) + 0.6;
    const cks = CK.map(([t, p, fb], k) => {
      const n = K.el('div', 'c2f-ck');
      const ic = K.el('div', 'ic');
      ic.appendChild(K.icon('check'));
      n.appendChild(ic);
      n.appendChild(K.el('span', null, t));
      Object.assign(n.style, { left: '1060px', top: 360 + k * 130 + 'px' });
      stage.appendChild(n);
      const tt = clamp(at(0, p, fb, 0.3), lo, end(0) - 0.4);
      A.in(tl, n, tt, 'fadeLeft', { dur: 0.55 });
      lo = tt + 0.4;
      return n;
    });

    // ---------- beat 1: we know how much water is in the pot; that's only half the picture
    const t1 = cue(1);
    tl.to(cks, { opacity: 0, x: 40, duration: 0.4, stagger: 0.05, ease: 'power2.in' }, t1 - 0.1);
    const fl = K.el('div', 'c2f-frame');
    Object.assign(fl.style, { left: '120px', top: '262px', width: '880px', height: '690px', background: 'rgba(232,241,220,0.5)', border: '5px solid ' + C.greenLight });
    const fr = K.el('div', 'c2f-frame');
    Object.assign(fr.style, { left: '1020px', top: '262px', width: '780px', height: '690px', border: '5px dashed #c9d2bf' });
    stage.insertBefore(fl, LA);
    stage.insertBefore(fr, LA);
    A.in(tl, fl, t1 + 0.2, 'fade', { dur: 0.5 });
    const know = C2.put(stage, 'c2f-know', 'We know how much<br>*water* is in the pot.', { x: 160, y: 820 });
    know.style.fontSize = '40px';
    A.in(tl, know, t1 + 0.3, 'fadeUp', { dur: 0.6 });
    tl.to(P.wrap, { y: -40, duration: 0.6, ease: 'power2.inOut' }, t1 + 0.2);
    const tPart = clamp(at(1, 'only part of the picture', 0.7, 0.3), t1 + 0.8, end(1) - 0.6);
    A.in(tl, fr, tPart, 'fade', { dur: 0.5 });
    const qbig = C2.put(stage, 'c2-q', '?', { x: 1350, y: 545 });
    A.in(tl, qbig, tPart + 0.2, 'pop', { dur: 0.5 });

    // ---------- beat 2: three questions in the empty half
    const t2 = cue(2);
    A.out(tl, qbig, t2, 'shrink', { dur: 0.35 });
    const QS = [['bell-ring', 'What happens around<br>the dog?', 'What happens', 0.05], ['heart', 'How does the dog feel?', 'How does the dog feel', 0.4], ['activity', 'Arousal and stress?', 'arousal and stress', 0.8]];
    lo = t2 + 0.2;
    const qcs = QS.map(([ic, t, p, fb], k) => {
      const c = K.el('div', 'c2f-qc');
      const icn = K.el('div', 'ic');
      icn.appendChild(K.icon(ic));
      c.appendChild(icn);
      c.appendChild(K.el('div', null, t));
      Object.assign(c.style, { left: '1060px', top: 330 + k * 180 + 'px' });
      stage.appendChild(c);
      const tt = clamp(at(2, p, fb, 0.3), lo, end(2) - 0.5);
      A.in(tl, c, tt, 'fadeLeft', { dur: 0.6 });
      lo = tt + 0.5;
      return c;
    });

    // ---------- beat 3: a dashed slot on the pot for another part
    const t3 = cue(3);
    const TX = 120; // thermometer x in pot coordinates
    const slot = K.path(P.svg, `M ${TX - 30} 250 L ${TX - 30} -110 A 30 30 0 0 1 ${TX + 30} -110 L ${TX + 30} 250`, { stroke: C.red, 'stroke-width': 5, 'stroke-dasharray': '12 10', fill: 'rgba(255,255,255,0.4)' });
    P.svg.insertBefore(slot, P.front);
    const slotC = K.circle(P.svg, TX, 286, 50, { fill: 'rgba(255,255,255,0.4)', stroke: C.red, 'stroke-width': 5, 'stroke-dasharray': '12 10' });
    P.svg.insertBefore(slotC, P.front);
    const tSlot = clamp(at(3, 'another part', 0.6, 0.3), t3 + 0.2, end(3) - 0.4);
    A.in(tl, [slot, slotC], tSlot, 'fade', { dur: 0.5 });
    tl.to([slot, slotC], { opacity: 0.35, duration: 0.4, yoyo: true, repeat: 3, ease: 'sine.inOut' }, tSlot + 0.5);
    A.dim(tl, qcs, t3 + 0.2, 0.45);

    // ---------- beat 4: temperature: the thermometer drops in, its line rises
    const t4 = cue(4);
    const th = K.group(P.svg);
    P.svg.insertBefore(th, P.front);
    K.rect(th, TX - 28, -140, 56, 420, { rx: 28, fill: '#ffffff', stroke: C.greenDeep, 'stroke-width': 7 });
    K.circle(th, TX, 286, 48, { fill: '#ffffff', stroke: C.greenDeep, 'stroke-width': 7 });
    K.circle(th, TX, 286, 34, { fill: C.red });
    const merc = K.rect(th, TX - 12, 240, 24, 50, { rx: 12, fill: C.red });
    [-90, -30, 30, 90, 150].forEach(y => K.line(th, TX + 6, y, TX + 22, y, { stroke: C.greenDeep, 'stroke-width': 4 }));
    gsap.set(th, { y: -170, opacity: 0 });
    tl.to([slot, slotC], { opacity: 0, duration: 0.3 }, t4);
    tl.fromTo(th, { y: -170 }, { y: 0, duration: 0.6, ease: 'power2.in', immediateRender: false }, t4 + 0.1);
    tl.fromTo(th, { opacity: 0 }, { opacity: 1, duration: 0.3, immediateRender: false }, t4 + 0.1);
    P.ripple(tl, t4 + 0.7);
    tl.to(th, { y: 10, duration: 0.15, yoyo: true, repeat: 1, ease: 'power1.out' }, t4 + 0.75);
    tl.fromTo(merc, { attr: { y: 240, height: 50 } }, { attr: { y: -70, height: 360 }, duration: 1.6, ease: 'power2.inOut', immediateRender: false }, t4 + 1.0);
    tl.to(qcs, { opacity: 0, x: 40, duration: 0.4, stagger: 0.05, ease: 'power2.in' }, t4 + 0.2);
    const hot = C2.put(stage, 'c2f-hot', 'Now, how<br><b>hot</b> is it?', { x: 1020, y: 560, w: 780, align: 'center' });
    A.in(tl, hot, t4 + 0.9, 'fadeUp', { dur: 0.7 });
    const th2 = C2.badge(stage, 'thermometer', 1410, 450, 130, C.redPale, C.red);
    A.in(tl, th2, t4 + 0.7, 'pop', { dur: 0.5 });

    // ---------- close: the Calling All Dogs logo
    const tL = Math.max(t4 + 3.2, Math.min(end(4) + 2.4, dur - 2.4));
    C2.logoClose(ctx, tL, [h.root, LA, fl, fr, know, hot, th2]);
  });
})();
