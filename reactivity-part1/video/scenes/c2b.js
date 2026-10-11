// Chapter 2: the pot. Pot and helpers come from window.C2 (c2_pot.js).
//   ch02s03  Picture the baseline as water   the pot fills; not shown: stress or arousal in the moment; the rim and the overflow;
//                                             low water takes a lot before it spills, high water a little; the goal; heat later
//   ch02s04  What can affect the water level  pot at left with up and down arrows; four area cards at right; each drips into the pot
(() => {
  const CSS = `
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
    const tPour = clamp(at(0, 'starting water level', 0.4, 0.4), cue(0) + 0.8, end(0) - 3.2);
    tl.fromTo(stream, { opacity: 0, scaleY: 0, transformOrigin: '50% 0%' }, { opacity: 0.85, scaleY: 1, duration: 0.45, ease: 'power2.in' }, tPour);
    P.setLevel(tl, 0.5, tPour + 0.3, 1.6, 'power1.inOut');
    tl.to(stream, { scaleY: 0, transformOrigin: '50% 100%', opacity: 0, duration: 0.4, ease: 'power2.in' }, tPour + 1.8);
    P.ripple(tl, tPour + 0.4, '#ffffff');
    P.waves(tl, tPour + 0.5, dur);
    // "Water level = your dog's baseline" follows the waterline at right
    const def = K.el('div', 'c2b-def');
    def.appendChild(K.el('div', 'ln'));
    def.appendChild(K.el('div', 'p', K.md('*Water level* = your dog’s baseline')));
    const moodL = K.el('div', null, K.md('including their *cumulative mood*'));
    Object.assign(moodL.style, { fontSize: '30px', marginTop: '8px' });
    def.querySelector('.p').appendChild(moodL);
    def.style.left = PX + C2.R + 20 + 'px';
    stage.appendChild(def);
    P.follow(def, 'surface', -54);
    const tDef = clamp(at(0, 'represents their overall', 0.2, 0.3), tPour + 1.2, end(0) - 1.5);
    A.in(tl, def, tDef, 'fadeRight', { dur: 0.6 });
    A.in(tl, moodL, clamp(at(0, 'cumulative mood', 0.85, 0.3), tDef + 0.8, end(0) - 0.3), 'fadeUp', { dur: 0.5 });

    // ---------- beat 1: the starting level doesn't show stress or arousal in the moment; that comes in a later chapter
    const t1 = cue(1);
    const notP = C2.pill(stage, 'zap', 'Not shown:<br>*stress or arousal in the moment*', { x: 1130, y: 300, size: 30, col: C.muted, variant: 'pale' });
    const notL = C2.bookmark(stage, 'In a later chapter', 1150, 440);
    A.in(tl, notP, clamp(at(1, 'stress or arousal', 0.3, 0.4), t1 + 0.1, end(1) - 1.5), 'fadeLeft', { dur: 0.5 });
    A.in(tl, notL, clamp(at(1, 'later chapter', 0.85, 0.3), t1 + 1.0, end(1) - 0.2), 'fadeUp', { dur: 0.5 });
    tl.to([notP, notL, def], { opacity: 0, duration: 0.4 }, cue(2) - 0.2);

    // ---------- beat 2: the rim is the limit of what the dog can manage; overflow is an intense response
    const t5 = cue(2);
    const rimG = K.svgEl('ellipse', { cx: 0, cy: 0, rx: C2.R, ry: 42, fill: 'none', stroke: C.waterDeep, 'stroke-width': 14, opacity: 0 }, P.svg);
    const tRim = clamp(at(2, 'rim represents', 0.1, 0.3), t5 + 0.2, end(2) - 4);
    tl.fromTo(rimG, { opacity: 0 }, { opacity: 1, duration: 0.4, immediateRender: false }, tRim);
    tl.to(rimG, { attr: { 'stroke-width': 24 }, duration: 0.3, yoyo: true, repeat: 3, ease: 'sine.inOut' }, tRim + 0.4);
    const rimP = C2.pill(stage, 'arrow-up-to-line', '*Rim* = what your dog can manage', { x: 1150, y: 380, size: 30, col: C.waterDeep });
    A.in(tl, rimP, tRim + 0.3, 'fadeLeft', { dur: 0.5 });
    const SP = spill(P);
    const tOver = clamp(at(2, 'Overflow represents', 0.6, 0.3), tRim + 1.6, end(2) - 2.0);
    P.setLevel(tl, 1.0, tOver - 0.4, 0.9, 'power2.in');
    SP.on(tl, tOver + 0.4);
    const overP = C2.pill(stage, 'waves', 'Overflow = *an intense response*', { x: 1150, y: 560, variant: 'red' });
    A.in(tl, overP, tOver + 0.6, 'fadeLeft', { dur: 0.5 });
    tl.to([rimP, overP, rimG], { opacity: 0, duration: 0.4, ease: 'power2.in' }, cue(3) - 0.2);

    // ---------- beat 3: lower level, more room (a big amount stays under the rim); higher level, less room (a small amount spills)
    const t6 = cue(3);
    SP.off(tl, t6);
    const tLow6 = clamp(at(3, 'lower starting level', 0.1, 0.3), t6 + 0.2, end(3) - 9);
    P.setLevel(tl, 0.3, tLow6, 1.0);
    tl.fromTo(P.br, { opacity: 0 }, { opacity: 1, duration: 0.5, immediateRender: false }, tLow6 + 0.6);
    tl.set(P.br, { opacity: 0 }, 0);
    const bx = P.bracketX();
    const more = C2.pill(stage, 'maximize-2', 'Lower baseline = more room', { x: bx, y: 0, variant: 'green' });
    P.follow(more, 'mid', -37);
    A.in(tl, more, tLow6 + 0.8, 'fadeRight', { dur: 0.5 });
    const tAdd6 = clamp(at(3, 'more added stress', 0.6, 0.3), tLow6 + 1.8, end(3) - 6.5);
    A.out(tl, more, tAdd6, 'fade', { dur: 0.3 });
    const add6 = added(0.3, 0.75, 'Added stress<br>or arousal', tAdd6);
    P.setLevel(tl, 0.75, tAdd6 + 0.3, 1.4);
    const ok = C2.pill(stage, 'check', 'Still under the rim', { x: bx, y: 0, variant: 'green' });
    P.follow(ok, 'mid', -37);
    A.in(tl, ok, tAdd6 + 1.7, 'fadeRight', { dur: 0.5 });
    const tHigh7 = clamp(at(3, 'higher level', 0.1, 0.3), tAdd6 + 2.6, end(3) - 3.2);
    tl.to([ok, add6], { opacity: 0, duration: 0.35, ease: 'power2.in' }, tHigh7 - 0.3);
    P.setLevel(tl, 0.87, tHigh7, 0.8);
    const less = C2.pill(stage, 'minimize-2', 'Higher baseline = *less room*', { x: bx, y: 0, variant: 'amber' });
    P.follow(less, 'mid', -37);
    A.in(tl, less, tHigh7 + 0.6, 'fadeRight', { dur: 0.5 });
    const tAdd7 = clamp(at(3, 'smaller amount', 0.4, 0.3), tHigh7 + 1.4, end(3) - 1.8);
    const add7 = added(0.87, 1.0, 'A smaller<br>amount', tAdd7);
    A.out(tl, less, tAdd7 + 0.2, 'fade', { dur: 0.3 });
    tl.to(P.br, { opacity: 0, duration: 0.3 }, tAdd7 + 0.5);
    P.setLevel(tl, 1.0, tAdd7 + 0.3, 0.7, 'power2.in');
    SP.on(tl, tAdd7 + 0.9);
    const over2 = C2.pill(stage, 'waves', 'Overflow = *an intense response*', { x: 1150, y: 560, variant: 'red' });
    A.in(tl, over2, tAdd7 + 1.1, 'fadeLeft', { dur: 0.5 });
    tl.to([over2, add7], { opacity: 0, duration: 0.4, ease: 'power2.in' }, cue(4) - 0.2);

    // ---------- beat 4: the goal: a lower baseline, more room to handle stress or arousal
    const t8 = cue(4);
    SP.off(tl, t8);
    const tGoal = clamp(at(4, 'lower baseline', 0.3, 0.3), t8 + 0.2, end(4) - 3);
    P.setLevel(tl, 0.3, tGoal - 0.4, 1.4);
    const goal = C2.pill(stage, 'arrow-down', 'Goal: *a lower baseline*', { x: PX, y: 900, center: true, size: 34, variant: 'pale' });
    A.in(tl, goal, tGoal, 'pop', { dur: 0.5 });
    tl.to(P.br, { opacity: 1, duration: 0.5 }, tGoal + 0.8);
    const more2 = K.el('div');
    Object.assign(more2.style, { position: 'absolute', left: bx + 'px', display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'flex-start' });
    const m2p = C2.pill(more2, 'maximize-2', 'More room', { variant: 'green' });
    m2p.style.position = 'relative';
    const m2l = C2.put(more2, 'c2-lab', '**to handle stress<br>or arousal**', {});
    Object.assign(m2l.style, { position: 'relative', left: '', top: '', fontSize: '34px', lineHeight: '1.25', color: 'var(--ink)' });
    stage.appendChild(more2);
    P.follow(more2, 'mid', -70);
    A.in(tl, more2, clamp(at(4, 'more room', 0.5, 0.3), tGoal + 1.0, end(4) - 0.6), 'fadeRight', { dur: 0.6 });

    // ---------- beat 5: we'll add heat in a later chapter
    const mk = C2.bookmark(stage, 'We’ll add heat in a later chapter', bx, 0, 'flame');
    P.follow(mk, 'mid', 140);
    A.in(tl, mk, clamp(at(5, 'adding heat', 0.7, 0.3), cue(5) + 0.3, end(5) - 0.4), 'fadeUp', { dur: 0.6 });

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
