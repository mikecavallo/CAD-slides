// Chapter 2: the pot. Pot and helpers come from window.C2 (c2_pot.js).
//   ch02s03  Picture the baseline as water   the pot fills; lower and higher levels; "Why does that matter?"; the room bracket
//                                             shrinks and stretches with the water; "We'll come back to this"
//   ch02s04  What can affect the water level  pot at left with up and down arrows; four area cards at right; each drips into the pot
(() => {
  const CSS = `
  .c2b-lvl { position: absolute; display: flex; align-items: center; gap: 0; }
  .c2b-lvl .p { padding: 14px 28px; border-radius: 999px; font: 700 32px/1 var(--font-body); white-space: nowrap; background: #fff;
    border: 1px solid #e6e9e1; box-shadow: var(--shadow-soft); color: var(--ink); }
  .c2b-lvl .ln { width: 70px; height: 0; border-top: 4px dashed #9fb38d; }
  .c2b-def { position: absolute; display: flex; align-items: center; gap: 18px; }
  .c2b-def .ln { width: 60px; height: 0; border-top: 4px dashed var(--water-deep, #2f7fae); }
  .c2b-def .p { padding: 16px 30px; border-radius: 20px; background: #fff; border: 3px solid #5fa8cf; box-shadow: var(--shadow-soft);
    font: 600 34px/1.25 var(--font-body); color: var(--ink); }
  .c2b-def .p b { color: #2f7fae; font-weight: 700; }
  .c2b-area { position: absolute; width: 860px; height: 124px; display: flex; align-items: center; gap: 26px; padding: 0 30px 0 18px;
    background: #fff; border-radius: 26px; border: 1px solid #e6e9e1; box-shadow: var(--shadow-soft); }
  .c2b-area .bd { width: 88px; height: 88px; border-radius: 50%; display: grid; place-items: center; color: #fff; flex: 0 0 auto; }
  .c2b-area .bd svg { width: 48px; height: 48px; stroke-width: 2.2; }
  .c2b-area .nm { font: 700 36px/1.1 var(--font-head); color: var(--ink); white-space: nowrap; }
  `;
  const css = stage => stage.appendChild(K.el('style', null, CSS));
  const { sayAt, clamp } = C1;
  const { C } = C2;

  /** A level tag on the left of the pot: pill + dashed lead to the glass, its right end at x. */
  function levelTag(parent, text, xRight, y) {
    const n = K.el('div', 'c2b-lvl');
    const p = K.el('div', 'p', K.md(text));
    n.appendChild(p);
    n.appendChild(K.el('div', 'ln'));
    parent.appendChild(n);
    Object.assign(n.style, { right: 1920 - xRight + 'px', top: y - 30 + 'px' });
    return n;
  }

  // ================================================================== ch02s03 Picture the baseline as water
  registerScene('ch02s03', ctx => {
    const { stage, tl, cue, end, dur } = ctx;
    C2.style(stage);
    css(stage);
    const at = (i, p, fb, lead) => sayAt(ctx, i, p, fb, lead);
    const h = K.heading(stage, 'Picture the Baseline as Water', { x: 100, y: 120, size: 80 });
    A.in(tl, h.all, 0.05, 'fadeUp', { dur: 0.7, stagger: 0.1 });

    // ---------- beat 0: the pot appears and water pours in to a middle level
    const PX = 820, PY = 500;
    const P = C2.makePot(stage, { cx: PX, y: PY, s: 1.0, level: 0 });
    tl.fromTo(P.wrap, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, cue(0) + 0.1);
    const stream = K.rect(P.svg, -16, -250, 32, 250 + C2.H, { rx: 16, fill: C.water, opacity: 0 });
    P.svg.insertBefore(stream, P.front);
    const tPour = clamp(at(0, 'water in a pot', 0.6, 0.6), cue(0) + 0.8, end(0) - 1.6);
    tl.fromTo(stream, { opacity: 0, scaleY: 0, transformOrigin: '50% 0%' }, { opacity: 0.85, scaleY: 1, duration: 0.45, ease: 'power2.in' }, tPour);
    P.setLevel(tl, 0.5, tPour + 0.3, 1.6, 'power1.inOut');
    tl.to(stream, { scaleY: 0, transformOrigin: '50% 100%', opacity: 0, duration: 0.4, ease: 'power2.in' }, tPour + 1.8);
    P.ripple(tl, tPour + 0.4, '#ffffff');
    P.waves(tl, tPour + 0.5, dur);
    // "Water level = the dog's current baseline" follows the waterline at right
    const def = K.el('div', 'c2b-def');
    def.appendChild(K.el('div', 'ln'));
    def.appendChild(K.el('div', 'p', K.md('*Water level* = the dog’s<br>overall starting state')));
    const moodL = K.el('div', null, K.md('including their *cumulative mood*'));
    Object.assign(moodL.style, { fontSize: '30px', marginTop: '8px' });
    def.querySelector('.p').appendChild(moodL);
    def.style.left = PX + C2.R + 20 + 'px';
    stage.appendChild(def);
    P.follow(def, 'surface', -54);

    // ---------- beat 1: the water level reflects the overall starting state, including cumulative mood
    const tDef = clamp(at(1, 'water level reflects', 0.2, 0.3), Math.max(cue(1), tPour + 1.2), end(1) - 1.5);
    A.in(tl, def, tDef, 'fadeRight', { dur: 0.6 });
    A.in(tl, moodL, clamp(at(1, 'cumulative mood', 0.8, 0.3), tDef + 0.8, end(1) - 0.3), 'fadeUp', { dur: 0.5 });

    // ---------- beat 2: lower, then higher
    const XR = PX - C2.R - 6;
    const tLow = at(2, 'lower water level', 0.1, 0.2);
    tl.to(def, { opacity: 0, duration: 0.4, ease: 'power2.in', immediateRender: false }, Math.max(tLow - 0.1, tDef + 0.7));
    P.setLevel(tl, 0.25, tLow, 1.0);
    const lowT = levelTag(stage, 'Lower baseline', XR, P.surfaceStageY(0.25));
    A.in(tl, lowT, tLow + 0.7, 'fadeRight', { dur: 0.6 });
    const tHigh = clamp(at(2, 'higher water level', 0.6, 0.2), tLow + 1.8, end(2) - 1);
    P.setLevel(tl, 0.8, tHigh, 1.2);
    const highT = levelTag(stage, 'Higher baseline', XR, P.surfaceStageY(0.8));
    A.in(tl, highT, tHigh + 0.9, 'fadeRight', { dur: 0.6 });
    A.dim(tl, lowT, tHigh + 0.9, 0.4);

    // ---------- beat 3: the water level doesn't show arousal or stress in the moment; that comes later
    const t3n = cue(3);
    const notP = C2.pill(stage, 'zap', 'Not shown:<br>*arousal or stress in the moment*', { x: 1130, y: 330, size: 30, col: C.muted, variant: 'pale' });
    const notL = C2.bookmark(stage, 'We’ll add that later', 1150, 470);
    A.in(tl, notP, clamp(at(3, 'aroused or stressed', 0.4, 0.4), t3n + 0.1, end(3) - 1.5), 'fadeLeft', { dur: 0.5 });
    A.in(tl, notL, clamp(at(3, 'add that part later', 0.85, 0.3), t3n + 1.0, end(3) - 0.2), 'fadeUp', { dur: 0.5 });
    tl.to([notP, notL], { opacity: 0, duration: 0.4 }, cue(4) - 0.2);

    // ---------- beat 4: why does that matter?
    const q = C2.put(stage, 'c2-q', '?', { x: 1260, y: 330 });
    tl.fromTo(q, { opacity: 0, scale: 0.4, rotation: -20 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.6, ease: 'back.out(2)' }, cue(4) + 0.05);
    tl.to(q, { rotation: 8, duration: 0.25, yoyo: true, repeat: 3, ease: 'sine.inOut' }, cue(4) + 0.7);

    // ---------- beat 5: the rim is the limit of what the dog can manage; past it the pot overflows (an intense response)
    const t5 = cue(5);
    A.out(tl, q, t5 - 0.1, 'shrink', { dur: 0.4 });
    A.dim(tl, [lowT, highT], t5, 0.0);
    const rimG = K.svgEl('ellipse', { cx: 0, cy: 0, rx: C2.R, ry: 42, fill: 'none', stroke: C.waterDeep, 'stroke-width': 14, opacity: 0 }, P.svg);
    const tRim = clamp(at(5, 'rim represents', 0.1, 0.3), t5 + 0.2, end(5) - 4);
    tl.fromTo(rimG, { opacity: 0 }, { opacity: 1, duration: 0.4, immediateRender: false }, tRim);
    tl.to(rimG, { attr: { 'stroke-width': 24 }, duration: 0.3, yoyo: true, repeat: 3, ease: 'sine.inOut' }, tRim + 0.4);
    const rimP = C2.pill(stage, 'arrow-up-to-line', 'The rim = *the limit*<br>of what your dog can manage', { x: 1150, y: 360, size: 30, col: C.waterDeep });
    rimP.style.whiteSpace = 'normal';
    rimP.style.lineHeight = '1.2';
    A.in(tl, rimP, tRim + 0.3, 'fadeLeft', { dur: 0.5 });
    const SP = spill(P);
    const tOver = clamp(at(5, 'rises beyond it', 0.55, 0.2), tRim + 1.6, end(5) - 2.6);
    P.setLevel(tl, 1.0, tOver, 1.0, 'power2.in');
    SP.on(tl, tOver + 0.85);
    const overP = C2.pill(stage, 'waves', 'Overflow = *an intense response*', { x: 1150, y: 560, variant: 'red' });
    A.in(tl, overP, clamp(at(5, 'intense response', 0.85, 0.3), tOver + 1.0, end(5) - 0.4), 'fadeLeft', { dur: 0.5 });
    tl.to([rimP, overP, rimG], { opacity: 0, duration: 0.4, ease: 'power2.in' }, cue(6) - 0.2);

    // ---------- beat 6: low water, more room: a big amount of added stress or arousal still stays under the rim
    const t6 = cue(6);
    SP.off(tl, t6);
    const tLow6 = clamp(at(6, 'water level is low', 0.1, 0.3), t6 + 0.2, end(6) - 5);
    P.setLevel(tl, 0.3, tLow6, 1.2);
    tl.fromTo(P.br, { opacity: 0 }, { opacity: 1, duration: 0.5, immediateRender: false }, tLow6 + 0.8);
    tl.set(P.br, { opacity: 0 }, 0);
    const bx = P.bracketX();
    const more = C2.pill(stage, 'maximize-2', 'More room', { x: bx, y: 0, variant: 'green' });
    P.follow(more, 'mid', -37);
    A.in(tl, more, tLow6 + 1.0, 'fadeRight', { dur: 0.6 });
    const tAdd6 = clamp(at(6, 'more added stress', 0.6, 0.3), tLow6 + 2.2, end(6) - 2.8);
    A.out(tl, more, tAdd6, 'fade', { dur: 0.3 });
    const add6 = added(0.3, 0.75, 'Added stress<br>or arousal', tAdd6);
    P.setLevel(tl, 0.75, tAdd6 + 0.3, 1.6);
    const ok = C2.pill(stage, 'check', 'Still under the rim', { x: bx, y: 0, variant: 'green' });
    P.follow(ok, 'mid', -37);
    A.in(tl, ok, clamp(at(6, 'intense response occurs', 0.8, 0.3), tAdd6 + 2.0, end(6) - 0.4), 'fadeRight', { dur: 0.5 });
    tl.to([ok, add6], { opacity: 0, duration: 0.4, ease: 'power2.in' }, cue(7) - 0.2);

    // ---------- beat 7: high water, less room: a smaller amount tips it over
    const t7 = cue(7);
    const tHigh7 = clamp(at(7, 'water level is high', 0.1, 0.3), t7 + 0.2, end(7) - 5);
    P.setLevel(tl, 0.87, tHigh7, 1.0);
    const less = C2.pill(stage, 'minimize-2', 'Less room', { x: bx, y: 0, variant: 'amber' });
    P.follow(less, 'mid', -37);
    A.in(tl, less, tHigh7 + 0.8, 'fadeRight', { dur: 0.6 });
    const tAdd7 = clamp(at(7, 'smaller amount', 0.6, 0.3), tHigh7 + 2.2, end(7) - 2.6);
    const add7 = added(0.87, 1.0, 'A smaller<br>amount', tAdd7);
    A.out(tl, less, tAdd7 + 0.2, 'fade', { dur: 0.3 });
    tl.to(P.br, { opacity: 0, duration: 0.3 }, tAdd7 + 0.6);
    P.setLevel(tl, 1.0, tAdd7 + 0.3, 0.8, 'power2.in');
    SP.on(tl, tAdd7 + 1.0);
    const over2 = C2.pill(stage, 'waves', 'Overflow = *an intense response*', { x: 1150, y: 560, variant: 'red' });
    A.in(tl, over2, clamp(at(7, 'intense response', 0.85, 0.3), tAdd7 + 1.2, end(7) - 0.4), 'fadeLeft', { dur: 0.5 });
    tl.to([over2, add7], { opacity: 0, duration: 0.4, ease: 'power2.in' }, cue(8) - 0.2);

    // ---------- beat 8: the goal: the lower the baseline, the better
    const t8 = cue(8);
    SP.off(tl, t8);
    P.setLevel(tl, 0.3, t8 + 0.1, 1.4);
    tl.to(P.br, { opacity: 1, duration: 0.5 }, t8 + 0.9);
    const more2 = C2.pill(stage, 'maximize-2', 'More room', { x: bx, y: 0, variant: 'green' });
    P.follow(more2, 'mid', -37);
    A.in(tl, more2, t8 + 1.1, 'fadeRight', { dur: 0.6 });
    const goal = C2.pill(stage, 'arrow-down', 'The goal: *a lower baseline*', { x: PX, y: 900, center: true, size: 34, variant: 'pale' });
    A.in(tl, goal, clamp(at(8, 'lower the baseline', 0.5, 0.3), t8 + 0.2, end(8) - 0.6), 'pop', { dur: 0.5 });
    tl.to(goal, { scale: 1.06, duration: 0.25, yoyo: true, repeat: 1 }, clamp(at(8, 'the better', 0.9, 0.2), t8 + 1, end(8)));

    // ---------- beat 9: we'll come back to this
    const mk = C2.bookmark(stage, 'We’ll come back to this', bx, 0);
    P.follow(mk, 'mid', 62);
    A.in(tl, mk, cue(9) + 0.3, 'fadeUp', { dur: 0.6 });

    /** An amber arrow left of the pot from level L0 up to L1, with a label; it grows at t. Returns the group (svg + label). */
    function added(L0, L1, text, t) {
      const ax = -C2.R - 120, y0 = C2.surfY(L0), y1 = C2.surfY(L1) - 6;
      const g = K.group(P.svg, { opacity: 0 });
      K.line(g, ax, y0, ax, y1 + 22, { stroke: C.amber, 'stroke-width': 14, 'stroke-linecap': 'round' });
      K.path(g, `M ${ax - 26} ${y1 + 26} L ${ax} ${y1 - 6} L ${ax + 26} ${y1 + 26} Z`, { fill: C.amber, stroke: C.amber, 'stroke-width': 6, 'stroke-linejoin': 'round' });
      K.line(g, ax + 24, y0, -C2.R + 6, y0, { stroke: C.amber, 'stroke-width': 4, 'stroke-dasharray': '8 8' });
      const lab = C2.pill(stage, 'plus', text, { variant: 'amber', size: 30 });
      Object.assign(lab.style, { right: 1920 - (PX + ax - 40) + 'px', top: PY + (y0 + y1) / 2 - 50 + 'px', lineHeight: '1.15', whiteSpace: 'normal', textAlign: 'right' });
      tl.fromTo(g, { opacity: 0 }, { opacity: 1, duration: 0.2, immediateRender: false }, t);
      tl.fromTo(g, { scaleY: 0, svgOrigin: `${ax} ${y0}` }, { scaleY: 1, svgOrigin: `${ax} ${y0}`, duration: 1.2, ease: 'power2.out', immediateRender: false }, t);
      A.in(tl, lab, t + 0.2, 'fadeRight', { dur: 0.5 });
      return [g, lab];
    }
  });

  /** Water spilling over the rim and running down the outside of the glass. on(tl, t) pours, off(tl, t) dries up. */
  function spill(P) {
    const R = C2.R, sp = K.group(P.svg, { opacity: 0 });
    const streams = [-1, 1].map(k => {
      const d = `M ${k * (R - 50)} -14 C ${k * (R + 4)} -40 ${k * (R + 34)} -6 ${k * (R + 30)} 40 L ${k * (R + 26)} 300`;
      return [K.path(sp, d, { stroke: C.water, 'stroke-width': 28, fill: 'none', 'stroke-linecap': 'round' }),
        K.path(sp, d, { stroke: '#dff1f9', 'stroke-width': 9, fill: 'none', 'stroke-linecap': 'round' })];
    });
    const lip = K.svgEl('ellipse', { cx: 0, cy: -8, rx: R - 6, ry: 36, fill: C.waterTop, stroke: '#ffffff', 'stroke-width': 5 }, sp);
    sp.insertBefore(lip, sp.firstChild);
    const pool = K.svgEl('ellipse', { cx: 0, cy: C2.H + 60, rx: R + 60, ry: 26, fill: C.water, opacity: 0 }, P.svg);
    P.svg.insertBefore(pool, P.svg.firstChild.nextSibling);
    const all = streams.flat();
    return {
      on(tl, t) {
        tl.fromTo(sp, { opacity: 0 }, { opacity: 1, duration: 0.25, immediateRender: false }, t);
        tl.fromTo(all, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.9, ease: 'power1.in', immediateRender: false }, t);
        tl.fromTo(pool, { opacity: 0, attr: { rx: R } }, { opacity: 0.35, attr: { rx: R + 90 }, duration: 1.2, immediateRender: false }, t + 0.7);
      },
      off(tl, t) {
        tl.to(sp, { opacity: 0, duration: 0.5 }, t);
        tl.to(pool, { opacity: 0, duration: 0.8 }, t + 0.2);
      },
    };
  }

  // ================================================================== ch02s04 What can affect the water level?
  registerScene('ch02s04', ctx => {
    const { stage, tl, cue, end, dur } = ctx;
    C2.style(stage);
    css(stage);
    const at = (i, p, fb, lead) => sayAt(ctx, i, p, fb, lead);
    const h = K.heading(stage, 'What Can Affect the Water Level?', { x: 100, y: 120, size: 80 });
    A.in(tl, h.all, 0.05, 'fadeUp', { dur: 0.7, stagger: 0.1 });

    // ---------- beat 0: pot at left; up and down arrows by the waterline
    const PX = 470, PY = 470, S = 0.95;
    const P = C2.makePot(stage, { cx: PX, y: PY, s: S, level: 0.4 });
    tl.fromTo(P.wrap, { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, cue(0) + 0.05);
    P.waves(tl, 0, dur);
    const sv = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const ax = PX - C2.R * S - 70;
    const up = K.group(sv), dn = K.group(sv);
    K.path(up, `M ${ax} 0 L ${ax} -70 M ${ax - 20} -48 L ${ax} -70 L ${ax + 20} -48`, { stroke: C.green, 'stroke-width': 9, fill: 'none' });
    K.path(dn, `M ${ax} 0 L ${ax} 70 M ${ax - 20} 48 L ${ax} 70 L ${ax + 20} 48`, { stroke: C.red, 'stroke-width': 9, fill: 'none' });
    const ys = P.surfaceStageY();
    gsap.set(up, { y: ys - 20 });
    gsap.set(dn, { y: ys + 20 });
    A.in(tl, [up, dn], cue(0) + 0.6, 'fade', { dur: 0.5, stagger: 0.15 });
    tl.to(up, { y: ys - 40, duration: 0.5, yoyo: true, repeat: 3, ease: 'sine.inOut' }, cue(0) + 1.0);
    tl.to(dn, { y: ys + 40, duration: 0.5, yoyo: true, repeat: 3, ease: 'sine.inOut' }, cue(0) + 1.0);
    const q = C2.put(stage, 'c2-q', '?', { x: 1180, y: 450 });
    A.in(tl, q, cue(0) + 0.5, 'pop', { dur: 0.55 });

    // ---------- beat 1: four area cards, one per area as it is named
    const t1 = cue(1);
    A.out(tl, q, t1 + 0.1, 'shrink', { dur: 0.4 });
    A.out(tl, [up, dn], t1 + 0.1, 'fade', { dur: 0.4 });
    const SAY = [['Physical health', 0.3], ['Activity, stimulation', 0.48], ['Emotions and recovery', 0.72], ['environment, predictability', 0.88]];
    let lo = t1 + 0.5;
    const cards = C2.AREAS.map((a, k) => {
      const c = K.el('div', 'c2b-area');
      Object.assign(c.style, { left: '960px', top: 282 + k * 152 + 'px' });
      const bd = K.el('div', 'bd');
      bd.style.background = a.col;
      bd.appendChild(K.icon(a.icon));
      c.appendChild(bd);
      c.appendChild(K.el('div', 'nm', a.name));
      stage.appendChild(c);
      const t = clamp(at(1, SAY[k][0], SAY[k][1], 0.3), lo, end(1) - 0.6);
      A.in(tl, c, t, 'fadeLeft', { dur: 0.6 });
      A.in(tl, bd, t + 0.15, 'pop', { dur: 0.5 });
      lo = t + 0.5;
      return { c, bd };
    });

    // ---------- beat 2: all four at once: each drips into the pot and the water rises
    const t2 = cue(2);
    cards.forEach(({ c }, k) => tl.to(c, { boxShadow: '0 16px 40px rgba(40,60,20,0.16), 0 0 0 4px ' + C2.AREAS[k].col, duration: 0.5, ease: 'power2.out' }, t2 + 0.1));
    let tLand = 0;
    cards.forEach(({ bd }, k) => {
      const sx = 960 + 18 + 44, sy = 282 + k * 152 + 62;
      tLand = P.drip(tl, sx, sy, t2 + 0.35 + k * 0.28, C2.AREAS[k].col, 0.85);
    });
    P.setLevel(tl, 0.72, t2 + 1.2, 1.8, 'power1.inOut');
    const same = C2.pill(stage, 'layers', 'At the same time', { x: PX, y: 884, center: true, variant: 'green', size: 34 });
    A.in(tl, same, clamp(at(2, 'at the same time', 0.75, 0.3), tLand, end(2)), 'fadeUp', { dur: 0.6 });
  });
})();
