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
  .c2f-da .a { font: 700 72px/1.05 var(--font-head); color: var(--green); white-space: nowrap; }
  .c2f-da .b { font: 600 38px/1.2 var(--font-body); color: var(--ink); white-space: nowrap; margin-top: 16px; }
  .c2f-da { position: absolute; }
  .c2f-hot { position: absolute; font: 700 84px/1.1 var(--font-head); color: var(--ink); white-space: nowrap; }
  .c2f-hot b { color: var(--red); font-weight: 700; }
  .c2f-nk { font: 700 28px/1 var(--font-body); letter-spacing: 6px; text-transform: uppercase; color: var(--muted); }
  .c2f-nt { font: 700 64px/1.05 var(--font-head); color: var(--green); white-space: nowrap; }
  .c2f-abc { width: 96px; height: 96px; border-radius: 50%; background: var(--green); color: #fff; display: grid; place-items: center; font: 700 52px/1 var(--font-head); }
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

    // ---------- beat 0: the full pot (ingredients floating) and the factors that filled it; a magnifier finds them
    const PX = 1170, PY = 430, S = 0.95;
    const P = C2.makePot(stage, { cx: PX, y: PY, s: S, level: 0.88 });
    A.in(tl, P.wrap, 0.1, 'fade', { dur: 0.6 });
    P.waves(tl, 0, dur);
    const FAC = [['stethoscope', 'Pain or illness', C.red], ['moon', 'Poor sleep or nutrition', C.red], ['volleyball', 'Activity out of balance', C.amber],
      ['paw-print', 'Unmet natural needs', C.amber], ['shuffle', 'Little predictability or choice', C.amber], ['hourglass', 'Not enough recovery', C.red]];
    const ACT = [['stethoscope', 'Address pain or illness', 'address pain'], ['moon', 'Improve sleep or nutrition', 'improve sleep'],
      ['volleyball', 'Adjust physical or mental activity', 'adjust physical'], ['paw-print', 'Better meet natural needs', 'better meet natural'],
      ['calendar-check', 'More predictability and choice', 'more predictability'], ['hourglass', 'More time to recover', 'opportunity for recovery']];
    const YS = FAC.map((_, k) => 280 + k * 100);
    const facs = FAC.map(([ic, t, col], k) => {
      const c = C2.pill(stage, ic, t, { x: 160, y: YS[k], size: 30, col });
      A.in(tl, c, 0.4 + k * 0.12, 'fadeRight', { dur: 0.5 });
      return c;
    });
    const lens = K.el('div');
    Object.assign(lens.style, { position: 'absolute', left: '0px', top: '0px', width: '150px', height: '150px', borderRadius: '50%', border: '11px solid var(--green-dark)',
      background: 'rgba(255,255,255,0.22)', boxShadow: '0 14px 30px rgba(40,60,20,0.25)' });
    const hnd = K.el('div');
    Object.assign(hnd.style, { position: 'absolute', left: '118px', top: '118px', width: '20px', height: '90px', borderRadius: '10px', background: 'var(--green-dark)', transform: 'rotate(-45deg)', transformOrigin: '50% 0%' });
    lens.appendChild(hnd);
    stage.appendChild(lens);
    const t0 = cue(0) + 1.0;
    tl.fromTo(lens, { opacity: 0, x: 250, y: YS[0] - 40 }, { opacity: 1, duration: 0.4 }, t0);
    tl.to(lens, { y: YS[5] - 40, duration: 2.2, ease: 'power1.inOut' }, t0 + 0.3);
    tl.to(lens, { opacity: 0, duration: 0.4 }, Math.min(t0 + 2.6, cue(1) + 0.3));
    const idn = C2.pill(stage, 'search', 'Identify what *can be improved*', { x: PX, y: 852, center: true, size: 32 });
    A.in(tl, idn, t0 + 0.6, 'fadeUp', { dur: 0.6 });

    // ---------- beat 1: many of them are things we can do something about: a green check on each
    const t1 = cue(1);
    const cks = YS.map((y, k) => {
      const b = C2.badge(stage, 'check', 118, y + 37, 50, C.green, '#fff');
      b.style.border = '4px solid #fff';
      A.in(tl, b, t1 + 0.3 + k * 0.15, 'pop', { dur: 0.4 });
      return b;
    });

    // ---------- beats 1 and 2: no list read aloud (Tori cut it); one after another each factor turns green, a drop leaves the
    // pot and the water drops a step, running from "do something about" into "lower the water level"
    let lo = Math.max(t1 + 1.5, cue(1) + 1.5), L = 0.88;
    const step = clamp((end(2) - 1.4 - lo) / ACT.length, 0.45, 0.8);
    ACT.forEach(([ic, t, p], k) => {
      const tt = lo + k * step;
      const f = facs[k];
      tl.to(f, { background: C.pale, borderColor: C.greenLight, duration: 0.4 }, tt);
      tl.to(f.querySelector('.ic'), { background: C.green, duration: 0.4 }, tt);
      tl.to(f, { scale: 1.06, transformOrigin: '0% 50%', duration: 0.2, yoyo: true, repeat: 1 }, tt);
      tl.to(cks[k], { scale: 1.25, duration: 0.2, yoyo: true, repeat: 1 }, tt);
      P.lift(tl, 160 + 30, YS[k] + 37, tt + 0.2, C.water, 0.8);
      L -= 0.095;
      P.setLevel(tl, L, tt + 0.3, 0.8);
    });
    const tLast = lo + (ACT.length - 1) * step;

    // ---------- the water settles low; more room
    const t3 = Math.max(tLast + 1.0, clamp(sayAt(ctx, 2, 'lower the water level', 0.6, 0.3), cue(2), end(2)));
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

    // ---------- beat 0: the pot (ingredients floating) and three checks
    const LA = C2.layer(stage);
    const PX = 560, PY = 450, S = 0.9;
    const P = C2.makePot(LA, { cx: PX, y: PY, s: S, level: 0.5 });
    A.in(tl, P.wrap, 0.1, 'fadeUp', { dur: 0.7 });
    P.waves(tl, 0, dur);
    const CK = [['What the water level represents', 'represents', 0.6]];
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

    // ---------- beat 1: the water (not the ingredients) is the overall baseline, including cumulative mood
    const t1 = cue(1);
    tl.to(cks, { opacity: 0, x: 40, duration: 0.4, stagger: 0.05, ease: 'power2.in' }, t1 - 0.1);
    // a dashed outline hugs the water only, from the waterline down to the bottom of the pot
    const sy = C2.surfY(0.5), OX = C2.R + 30, OB = C2.H + 78;
    const ring = K.path(P.svg, `M ${-OX} ${sy - 34} L ${-OX} ${OB - 70} Q ${-OX} ${OB} 0 ${OB} Q ${OX} ${OB} ${OX} ${OB - 70} L ${OX} ${sy - 34} Z`,
      { stroke: '#2f7fae', 'stroke-width': 7, 'stroke-dasharray': '18 12', fill: 'rgba(95,168,207,0.10)' });
    const tDA = clamp(at(1, 'overall baseline', 0.4, 0.4), t1 + 0.3, end(1) - 0.8);
    tl.fromTo(ring, { opacity: 0 }, { opacity: 1, duration: 0.6, immediateRender: true }, t1 + 0.3);
    tl.to(P.wTop, { attr: { fill: '#cfeaf7' }, duration: 0.4, yoyo: true, repeat: 3, ease: 'sine.inOut' }, t1 + 0.8);
    // the ingredients step back while the water is named, then return
    tl.to(P.ing.map(g => g.mid), { opacity: 0.25, duration: 0.4 }, t1 + 0.3);
    tl.to(P.ing.map(g => g.mid), { opacity: 1, duration: 0.4 }, cue(2));
    const da = K.el('div', 'c2f-da');
    da.appendChild(K.el('div', 'a', 'Overall baseline'));
    const daB = K.el('div', 'b', 'Including cumulative mood');
    da.appendChild(daB);
    Object.assign(da.style, { left: '1000px', top: '470px' });
    stage.appendChild(da);
    A.in(tl, da, tDA, 'fadeLeft', { dur: 0.7 });
    tl.fromTo(daB, { opacity: 0 }, { opacity: 1, duration: 0.5, immediateRender: false }, clamp(at(1, 'cumulative mood', 0.8, 0.3), tDA + 0.6, end(1) - 0.2));

    // ---------- beat 2: that's only part of the picture: Part 1 frame, empty Part 2 frame
    const t2 = cue(2);
    tl.to([ring, da], { opacity: 0, duration: 0.4, ease: 'power2.in' }, t2 - 0.1);
    const fl = K.el('div', 'c2f-frame');
    Object.assign(fl.style, { left: '120px', top: '262px', width: '880px', height: '690px', background: 'rgba(232,241,220,0.5)', border: '5px solid ' + C.greenLight });
    const fr = K.el('div', 'c2f-frame');
    Object.assign(fr.style, { left: '1020px', top: '262px', width: '780px', height: '690px', border: '5px dashed #c9d2bf' });
    stage.insertBefore(fl, LA);
    stage.insertBefore(fr, LA);
    // Part 1 is the ingredients (Chapter 1), Part 2 is the water (this chapter); together they are the distant antecedents.
    // what comes next is still unknown here; temperature is Chapter 4 (Chapter 3 steps away from the pot for the ABCs)
    const p1 = C2.pill(stage, 'book-open', 'Part 1: *Ingredients*', { x: 146, y: 284, size: 28, col: C1.ING[0].col });
    const p1b = C2.pill(stage, 'droplets', 'Part 2: *The water*', { x: 536, y: 284, size: 28, col: C.water });
    const p2 = C2.pill(stage, 'circle-help', 'Still to come: ?', { x: 1046, y: 284, size: 28, col: C.muted });
    const p2b = C2.pill(stage, 'thermometer', 'Chapter 4: *Temperature*', { x: 1046, y: 284, size: 28, col: C.red });
    gsap.set(p2b, { opacity: 0 });
    A.in(tl, fl, t2 + 0.2, 'fade', { dur: 0.5 });
    const lead = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const g0 = P.ing[1], [ix, iy] = P.toStage(g0.x, C2.surfY(0.5) + g0.depth);
    const [wx, wy] = P.toStage(10, C2.surfY(0.5) + 150);
    const l1 = K.path(lead, `M 290 350 L ${ix} ${iy - 34}`, { stroke: C1.ING[0].col, 'stroke-width': 4, 'stroke-dasharray': '10 8', fill: 'none' });
    const l2 = K.path(lead, `M 680 350 L ${wx} ${wy}`, { stroke: '#2f7fae', 'stroke-width': 4, 'stroke-dasharray': '10 8', fill: 'none' });
    const d1 = K.circle(lead, ix, iy - 34, 7, { fill: C1.ING[0].col, opacity: 0 });
    const d2 = K.circle(lead, wx, wy, 7, { fill: '#2f7fae', opacity: 0 });
    const tP1 = clamp(at(2, 'the water level', 0.1, 0.3), t2 + 0.3, end(2) - 2.4);
    A.in(tl, p1, tP1, 'fadeRight', { dur: 0.5 });
    A.draw(tl, l1, tP1 + 0.4, 0.5);
    A.in(tl, d1, tP1 + 0.85, 'pop', { dur: 0.3 });
    A.in(tl, p1b, tP1 + 0.7, 'fadeRight', { dur: 0.5 });
    A.draw(tl, l2, tP1 + 1.1, 0.5);
    A.in(tl, d2, tP1 + 1.55, 'pop', { dur: 0.3 });
    const know = C2.put(stage, 'c2f-know', 'The water = *distant antecedents*', { x: 160, y: 862 });
    know.style.fontSize = '38px';
    know.querySelector('b').style.color = 'var(--green)';
    A.in(tl, know, tP1 + 1.6, 'fadeUp', { dur: 0.6 });
    const tPart = clamp(at(2, "doesn't tell us", 0.3, 0.3), tP1 + 1.8, end(2) - 2);
    A.in(tl, fr, tPart, 'fade', { dur: 0.5 });
    A.in(tl, p2, tPart + 0.2, 'fadeRight', { dur: 0.5 });
    const qbig = C2.put(stage, 'c2-q', '?', { x: 1350, y: 545 });
    A.in(tl, qbig, tPart + 0.3, 'pop', { dur: 0.5 });

    // ---------- still beat 2: what the water can't tell us, in the empty half
    const t3 = clamp(at(2, 'aroused or stressed', 0.6, 0.4), tPart + 0.8, end(2) - 0.6);
    A.out(tl, qbig, t3, 'shrink', { dur: 0.35 });
    const QS = [['activity', 'Arousal and stress<br>in the moment?', 'aroused or stressed', 0.6]];
    lo = t3 + 0.2;
    const qcs = QS.map(([ic, t, p, fb], k) => {
      const c = K.el('div', 'c2f-qc');
      const icn = K.el('div', 'ic');
      icn.appendChild(K.icon(ic));
      c.appendChild(icn);
      c.appendChild(K.el('div', null, t));
      Object.assign(c.style, { left: '1060px', top: 400 + k * 170 + 'px' });
      stage.appendChild(c);
      const tt = clamp(at(2, p, fb, 0.3), lo, end(2) - 0.3);
      A.in(tl, c, tt, 'fadeLeft', { dur: 0.6 });
      lo = tt + 0.5;
      return c;
    });

    // ---------- beat 3: a dashed slot on the pot for another part
    const t4 = cue(3);
    const TX = 120; // thermometer x in pot coordinates
    const slot = K.path(P.svg, `M ${TX - 30} 250 L ${TX - 30} -110 A 30 30 0 0 1 ${TX + 30} -110 L ${TX + 30} 250`, { stroke: C.red, 'stroke-width': 5, 'stroke-dasharray': '12 10', fill: 'rgba(255,255,255,0.4)' });
    P.svg.insertBefore(slot, P.front);
    const slotC = K.circle(P.svg, TX, 286, 50, { fill: 'rgba(255,255,255,0.4)', stroke: C.red, 'stroke-width': 5, 'stroke-dasharray': '12 10' });
    P.svg.insertBefore(slotC, P.front);
    const tSlot = clamp(at(3, 'another part', 0.6, 0.3), t4 + 0.2, end(3) - 0.4);
    A.in(tl, [slot, slotC], tSlot, 'fade', { dur: 0.5 });
    tl.to([slot, slotC], { opacity: 0.35, duration: 0.4, yoyo: true, repeat: 3, ease: 'sine.inOut' }, tSlot + 0.5);
    A.dim(tl, qcs, t4 + 0.2, 0.45);
    tl.to(lead, { opacity: 0, duration: 0.4 }, t4 + 0.1);

    // ---------- beat 4: temperature: the thermometer drops in, its line rises; Part 2 is temperature
    const t5 = cue(4);
    const th = K.group(P.svg);
    P.svg.insertBefore(th, P.front);
    K.rect(th, TX - 28, -140, 56, 420, { rx: 28, fill: '#ffffff', stroke: C.greenDeep, 'stroke-width': 7 });
    K.circle(th, TX, 286, 48, { fill: '#ffffff', stroke: C.greenDeep, 'stroke-width': 7 });
    K.circle(th, TX, 286, 34, { fill: C.red });
    const merc = K.rect(th, TX - 12, 240, 24, 50, { rx: 12, fill: C.red });
    [-90, -30, 30, 90, 150].forEach(y => K.line(th, TX + 6, y, TX + 22, y, { stroke: C.greenDeep, 'stroke-width': 4 }));
    gsap.set(th, { y: -170, opacity: 0 });
    tl.to([slot, slotC], { opacity: 0, duration: 0.3 }, t5);
    tl.fromTo(th, { y: -170 }, { y: 0, duration: 0.6, ease: 'power2.in', immediateRender: false }, t5 + 0.1);
    tl.fromTo(th, { opacity: 0 }, { opacity: 1, duration: 0.3, immediateRender: false }, t5 + 0.1);
    P.ripple(tl, t5 + 0.7);
    tl.to(th, { y: 10, duration: 0.15, yoyo: true, repeat: 1, ease: 'power1.out' }, t5 + 0.75);
    tl.fromTo(merc, { attr: { y: 240, height: 50 } }, { attr: { y: -70, height: 360 }, duration: 1.6, ease: 'power2.inOut', immediateRender: false }, t5 + 1.0);
    tl.to(qcs, { opacity: 0, x: 40, duration: 0.4, stagger: 0.05, ease: 'power2.in' }, t5 + 0.2);
    tl.to(p2, { opacity: 0, duration: 0.3 }, t5 + 0.5);
    tl.fromTo(p2b, { opacity: 0 }, { opacity: 1, duration: 0.4, immediateRender: false }, t5 + 0.7);
    const hot = C2.put(stage, 'c2f-hot', 'Now, how<br><b>hot</b> is it?', { x: 1020, y: 580, w: 780, align: 'center' });
    A.in(tl, hot, t5 + 0.9, 'fadeUp', { dur: 0.7 });
    const th2 = C2.badge(stage, 'thermometer', 1410, 470, 130, C.redPale, C.red);
    A.in(tl, th2, t5 + 0.7, 'pop', { dur: 0.5 });

    // ---------- close: the Calling All Dogs logo
    // ---------- beat 5: the bridge: temperature later; the next chapter steps away from the pot for the ABCs
    const t6 = cue(5);
    tl.to([hot, th2], { opacity: 0, duration: 0.4 }, t6);
    const nx = K.el('div');
    Object.assign(nx.style, { position: 'absolute', left: '1060px', top: '560px', width: '700px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '22px' });
    nx.appendChild(K.el('div', 'c2f-nk', 'Next chapter'));
    nx.appendChild(K.el('div', 'c2f-nt', 'The ABCs of Behavior'));
    const abc = K.el('div');
    Object.assign(abc.style, { display: 'flex', gap: '22px' });
    const lets = ['A', 'B', 'C'].map(l => { const d = K.el('div', 'c2f-abc', l); abc.appendChild(d); return d; });
    nx.appendChild(abc);
    stage.appendChild(nx);
    const tNx = clamp(sayAt(ctx, 5, 'next chapter', 0.45, 0.3), t6 + 0.3, end(5) - 1.5);
    A.in(tl, nx, tNx, 'fadeUp', { dur: 0.6 });
    A.in(tl, lets, clamp(sayAt(ctx, 5, 'ABCs', 0.85, 0.3), tNx + 0.4, end(5)), 'pop', { dur: 0.45, stagger: 0.15 });
    const tL = Math.max(end(5) + 0.6, Math.min(end(5) + 1.6, dur - 2.4));
    C2.logoClose(ctx, tL, [h.root, LA, fl, fr, know, hot, th2, p1, p1b, p2b, lead, nx]);
  });
})();
