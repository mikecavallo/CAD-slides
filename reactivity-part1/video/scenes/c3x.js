// Chapter 3 concept test (script/lesson-concept.json): checks the pot analogy before Chapter 3 is written.
//   c3x01  Emotions fluctuate and add up   the surface bubbles and settles; each event leaves a drop and the water notches up;
//                                          recovery lifts drops out
//   c3x02  Under, at, over threshold       the rim is the threshold; a trigger comes closer, the flame grows, the foam rises;
//                                          a dog beside the pot is loose, then stiff, then reacting when the pot spills over
//   c3x03  Same heat, two pots             low pot: foam stays in; full pot, same flame: spills over
//   c3x04  Trigger stacking                temperature over time: three triggers close together cross the threshold on the
//                                          smallest; the same three spread out cool down in between
//   c3x05  Before, during, after training  three pots: full and spilling; water lowered, you turn the dial down, skills while
//                                          the foam is low; the dog turns the dial down on their own, foam rises a little, settles
// Pot, dog and pills come from window.C2 (c2_pot.js).
(() => {
  const CSS = `
  .c3x-zone { position: absolute; font: 700 40px/1 var(--font-head); white-space: nowrap; opacity: 0.3; }
  .c3x-zone small { display: block; font: 600 24px/1.2 var(--font-body); color: var(--ink-soft); margin-top: 8px; }
  .c3x-cap { position: absolute; font: 700 44px/1.15 var(--font-head); color: var(--ink); white-space: nowrap; text-align: center; }
  .c3x-cap b { color: var(--green); font-weight: 700; }
  .c3x-cap i { color: var(--red); font-style: normal; }
  .c3x-col { position: absolute; font: 700 40px/1 var(--font-head); color: #fff; padding: 14px 30px; border-radius: 16px; }
  .c3x-note { position: absolute; font: 600 26px/1.25 var(--font-body); color: var(--ink); text-align: center; }
  .c3x-note b { color: var(--green-dark); }
  .c3x-axis { position: absolute; font: 700 26px/1 var(--font-body); color: var(--muted); white-space: nowrap; }
  `;
  const css = stage => stage.appendChild(K.el('style', null, CSS));
  const { sayAt, clamp } = C1;
  const { C } = C2;
  const RED = C.red || '#b8452d', AMBER = C.amber || '#d9912b';
  let uid = 0;

  // ------------------------------------------------------------------ boil kit: foam on the water, spill over the rim
  // b = arousal (0 calm .. 1+ hard boil). Foam rises b * FOAM above the waterline; when it passes the rim it spills over.
  const FOAM = 200;
  function boil(P, b0 = 0) {
    const R = C2.R, H = C2.H, RI = R - 14, svg = P.svg, id = 'c3x' + ++uid;
    let seed = 7 + uid * 131;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const defs = K.svgEl('defs', {}, svg);
    defs.innerHTML = `<clipPath id="${id}"><path d="M ${-RI} -40 L ${-RI} ${H} L ${RI} ${H} L ${RI} -40 Z"/></clipPath>`;
    const fg = K.group(svg, { 'clip-path': `url(#${id})` });
    svg.insertBefore(fg, P.front);
    const band = K.rect(fg, -RI, 0, 2 * RI, 0, { fill: '#dff1f9', opacity: 0 });
    const N = 64, dots = [];
    for (let k = 0; k < N; k++) {
      const x = -RI + 14 + (2 * RI - 28) * ((k * 37) % N + 0.5) / N + (rnd() - 0.5) * 10;
      const u = Math.pow(rnd(), 0.8), r = 11 + rnd() * 13;
      dots.push({ c: K.circle(fg, x, 0, r, { fill: '#f1f9fd', stroke: '#ffffff', 'stroke-width': 3, opacity: 0 }), u, r });
    }
    // rising bubbles inside the water (they ride the waterline)
    const bub = K.group(P.water, { opacity: 0 });
    const rise = [];
    for (let k = 0; k < 16; k++) {
      const x = -RI + 30 + rnd() * (2 * RI - 60), d = 70 + rnd() * 170, r = 4 + rnd() * 6, per = 0.8 + rnd() * 0.8;
      rise.push({ c: K.circle(bub, x, d, r, { fill: 'none', stroke: '#ffffff', 'stroke-width': 3, opacity: 0.85 }), d, per, off: rnd() });
    }
    // spill: streams down the outside of the glass and a foam lip on the rim
    const sp = K.group(svg);
    const streams = [-1, 1].map(k => {
      const d = `M ${k * (R - 40)} -18 C ${k * (R + 6)} -44 ${k * (R + 36)} -8 ${k * (R + 32)} 40 L ${k * (R + 28)} 270`;
      const a = K.path(sp, d, { stroke: '#8cc8e4', 'stroke-width': 30, fill: 'none' });
      const b = K.path(sp, d, { stroke: '#e4f4fb', 'stroke-width': 11, fill: 'none' });
      return [a, b];
    });
    const lip = K.group(sp, { opacity: 0 });
    for (let k = 0; k < 13; k++) K.circle(lip, -R + 26 + k * ((2 * R - 52) / 12), -22 - (k % 2) * 8, 18 + (k % 3) * 4, { fill: '#f1f9fd', stroke: '#ffffff', 'stroke-width': 3 });
    const lens = streams.map(([a]) => a.getTotalLength());
    const st = { b: b0 }, hooks = [];
    const surfNow = () => {
      const m = /translate\(0 ([-\d.e]+)\)/.exec(P.water.getAttribute('transform') || '');
      return m ? +m[1] : C2.surfY(P.L);
    };
    function render() {
      const sy = surfNow(), bh = st.b * FOAM, top = sy - bh, vis = Math.min(1, st.b * 5);
      band.setAttribute('y', top + 16);
      band.setAttribute('height', Math.max(0, bh - 10));
      band.setAttribute('opacity', vis * 0.9);
      dots.forEach(d => {
        d.c.setAttribute('cy', sy - d.u * bh + 4);
        d.c.setAttribute('r', d.r * (0.45 + 0.55 * Math.min(1, st.b * 2.5)));
        d.c.setAttribute('opacity', vis);
      });
      bub.setAttribute('opacity', Math.min(1, st.b * 3));
      const amt = clamp((-top - 4) / 70, 0, 1);
      streams.forEach(([a, b], i) => [a, b].forEach(p => {
        p.style.strokeDasharray = `${lens[i] * amt} ${lens[i] + 10}`;
        p.style.opacity = amt > 0.001 ? 1 : 0;
      }));
      lip.setAttribute('opacity', Math.min(1, amt * 3));
      hooks.forEach(f => f(st.b, top));
    }
    P.follow({ style: { set top(v) { render(); } } }, 'surface');
    render();
    let cur = b0;
    const K3 = {
      st, hooks, render,
      /** Arousal to b at t over dur. */
      set(tl, b, t, dur = 1.2, ease = 'power2.inOut') {
        tl.fromTo(st, { b: cur }, { b, duration: dur, ease, immediateRender: false, onUpdate: render }, t);
        cur = b;
        return t + dur;
      },
      /** Bubbles keep rising from t0 to t1 (visible only while b > 0). */
      run(tl, t0, t1) {
        rise.forEach(q => {
          const n = Math.max(1, Math.floor((t1 - t0) / q.per));
          tl.fromTo(q.c, { attr: { cy: q.d } }, { attr: { cy: -2 }, duration: q.per, ease: 'power1.in', repeat: n - 1, immediateRender: false }, t0 + q.off * q.per);
        });
      },
    };
    return K3;
  }

  // ------------------------------------------------------------------ burner: plate and flames under a pot (stage svg)
  function burner(sv, cx, y, w = 360) {
    const g = K.group(sv);
    const fl = K.group(g);
    const flames = [];
    const n = 5;
    for (let k = 0; k < n; k++) {
      const x = cx - w / 2 + 40 + k * ((w - 80) / (n - 1));
      const o = K.group(fl);
      const inner = K.group(o);
      K.path(inner, `M ${x} ${y} C ${x - 26} ${y - 18} ${x - 22} ${y - 56} ${x} ${y - 92} C ${x + 22} ${y - 56} ${x + 26} ${y - 18} ${x} ${y} Z`, { fill: '#e8962e', stroke: 'none' });
      K.path(inner, `M ${x} ${y} C ${x - 13} ${y - 10} ${x - 11} ${y - 30} ${x} ${y - 52} C ${x + 11} ${y - 30} ${x + 13} ${y - 10} ${x} ${y} Z`, { fill: '#f6c14a', stroke: 'none' });
      gsap.set(o, { scale: 0, svgOrigin: `${x} ${y}` });
      flames.push({ o, inner, x });
    }
    K.rect(g, cx - w / 2, y, w, 22, { rx: 11, fill: '#5d6358' });
    let cur = 0;
    return {
      g,
      set(tl, h, t, dur = 0.8) {
        flames.forEach((f, k) => tl.fromTo(f.o, { scale: cur * (0.85 + (k % 2) * 0.2) }, { scale: h * (0.85 + (k % 2) * 0.2), svgOrigin: `${f.x} ${y}`, duration: dur, ease: 'power2.inOut', immediateRender: false }, t));
        cur = h;
        return t + dur;
      },
      flicker(tl, t0, t1) {
        flames.forEach((f, k) => {
          const per = 0.22 + (k % 3) * 0.05, m = Math.max(1, Math.floor((t1 - t0) / per));
          tl.fromTo(f.inner, { scaleY: 0.9, svgOrigin: `${f.x} ${y}` }, { scaleY: 1.08, svgOrigin: `${f.x} ${y}`, duration: per, ease: 'sine.inOut', yoyo: true, repeat: m - 1, immediateRender: false }, t0 + k * 0.05);
        });
      },
    };
  }

  // ------------------------------------------------------------------ dial: a stove knob (stage svg)
  function dial(sv, cx, cy, r = 46) {
    const g = K.group(sv);
    K.circle(g, cx, cy, r + 10, { fill: '#e7eadf' });
    const k = K.group(g);
    K.circle(k, cx, cy, r, { fill: '#ffffff', stroke: '#5d6358', 'stroke-width': 6 });
    K.rect(k, cx - 6, cy - r + 8, 12, r - 4, { rx: 6, fill: '#5d6358' });
    [-120, 0, 120].forEach((a, i) => {
      const ra = (a - 90) * Math.PI / 180;
      K.circle(g, cx + (r + 24) * Math.cos(ra), cy + (r + 24) * Math.sin(ra), 6, { fill: ['#7fb2d6', AMBER, RED][i] });
    });
    let cur = 0;
    return {
      g, k,
      set(tl, deg, t, dur = 0.8) {
        tl.fromTo(k, { rotation: cur, svgOrigin: `${cx} ${cy}` }, { rotation: deg, svgOrigin: `${cx} ${cy}`, duration: dur, ease: 'power2.inOut', immediateRender: false }, t);
        cur = deg;
        return t + dur;
      },
    };
  }

  // ------------------------------------------------------------------ thermometer (stage svg); follows a boil kit
  function thermo(sv, x, y0, h, kit, max = 1.2) {
    const g = K.group(sv);
    K.rect(g, x - 26, y0, 52, h, { rx: 26, fill: '#ffffff', stroke: C.greenDeep, 'stroke-width': 6 });
    K.circle(g, x, y0 + h + 22, 44, { fill: '#ffffff', stroke: C.greenDeep, 'stroke-width': 6 });
    K.circle(g, x, y0 + h + 22, 31, { fill: RED });
    const m = K.rect(g, x - 11, y0 + h, 22, 30, { rx: 11, fill: RED });
    [0.2, 0.4, 0.6, 0.8].forEach(f => K.line(g, x + 8, y0 + h * (1 - f), x + 22, y0 + h * (1 - f), { stroke: C.greenDeep, 'stroke-width': 4 }));
    const top0 = y0 + h + 10, span = h - 30;
    kit.hooks.push(b => {
      const yy = top0 - span * Math.min(1, b / max);
      m.setAttribute('y', yy);
      m.setAttribute('height', y0 + h + 26 - yy);
    });
    kit.render();
    return g;
  }

  // ------------------------------------------------------------------ dog body language
  function dogKit(tl, D) {
    const stare = K.path(D.fx, 'M 404 78 L 476 72', { stroke: AMBER, 'stroke-width': 6, 'stroke-dasharray': '10 10', fill: 'none', opacity: 0 });
    const stare2 = K.path(D.fx, 'M 404 88 L 476 94', { stroke: AMBER, 'stroke-width': 6, 'stroke-dasharray': '10 10', fill: 'none', opacity: 0 });
    const barks = [[412, 58, 102], [436, 42, 118], [460, 26, 134]].map(([x, y0, y1], i) =>
      K.path(D.fx, `M ${x} ${y0} Q ${x + 18 + i * 8} ${(y0 + y1) / 2} ${x} ${y1}`, { stroke: RED, 'stroke-width': 10, fill: 'none', opacity: 0 }));
    let tail = 0, lean = 0;
    const setTail = (deg, t, d = 0.3) => { tl.fromTo(D.tail, { rotation: tail, svgOrigin: '108 134' }, { rotation: deg, svgOrigin: '108 134', duration: d, immediateRender: false }, t); tail = deg; };
    const setLean = (deg, t, d = 0.4) => { tl.fromTo(D.fig, { rotation: lean, svgOrigin: '220 297' }, { rotation: deg, svgOrigin: '220 297', duration: d, immediateRender: false }, t); lean = deg; };
    return {
      loose(t0, t1) { if (t1 - t0 > 0.5) { C2.wag(tl, D, t0, t1 - 0.05); tail = 10; } },
      stiff(t) {
        setTail(30, t); setLean(4, t);
        tl.fromTo([stare, stare2], { opacity: 0 }, { opacity: 1, duration: 0.3, immediateRender: false }, t + 0.2);
      },
      react(t0, t1) {
        setTail(34, t0, 0.2); setLean(6, t0, 0.25);
        tl.to([stare, stare2], { opacity: 0, duration: 0.2 }, t0);
        const n = Math.max(1, Math.floor((t1 - t0) / 0.6));
        barks.forEach((b, i) => tl.fromTo(b, { opacity: 0 }, { opacity: 1, duration: 0.15, yoyo: true, repeat: n * 2 - 1, repeatDelay: 0.15, ease: 'power1.inOut', immediateRender: false }, t0 + 0.1 + i * 0.08));
        const m = Math.max(1, Math.floor((t1 - t0) / 0.36));
        tl.fromTo(D.outer, { x: 0 }, { x: 14, duration: 0.18, yoyo: true, repeat: m * 2 - 1, ease: 'sine.inOut', immediateRender: false }, t0);
      },
      relax(t) {
        setTail(0, t, 0.4); setLean(0, t, 0.4);
        tl.to([stare, stare2], { opacity: 0, duration: 0.3 }, t);
      },
    };
  }

  const heading = (ctx, text) => {
    const h = K.heading(ctx.stage, text, { x: 100, y: 110, w: 1400, size: 58 });
    A.in(ctx.tl, h.all, 0.05, 'fadeUp', { dur: 0.7, stagger: 0.1 });
    return h;
  };
  const cap = (stage, html, x, y, w = 1200) => C2.put(stage, 'c3x-cap', html, { x: x - w / 2, y, w, align: 'center' });

  // ================================================================== c3x01 Emotions fluctuate and add up
  registerScene('c3x01', ctx => {
    const { stage, tl, cue, end, dur } = ctx;
    C2.style(stage); css(stage);
    const at = (i, p, fb, lead) => sayAt(ctx, i, p, fb, lead);
    heading(ctx, 'Emotions *fluctuate*. And they *add up*.');
    const PX = 640, PY = 470, S = 0.95;
    const P = C2.makePot(stage, { cx: PX, y: PY, s: S, level: 0.3 });
    const B = boil(P, 0);
    A.in(tl, P.wrap, 0.1, 'fadeUp', { dur: 0.7 });
    P.waves(tl, 0, dur);
    B.run(tl, 0, dur);

    // beat 0: the surface bubbles up and settles, twice: emotions rise and fall
    const f1 = cap(stage, 'Emotions <b>rise and fall</b>', 1380, 330, 760);
    A.in(tl, f1, cue(0) + 0.5, 'fadeUp', { dur: 0.6 });
    let t = cue(0) + 0.6;
    [0.42, 0.3].forEach(b => { B.set(tl, b, t, 0.7, 'power2.out'); B.set(tl, 0.04, t + 0.9, 0.9, 'power2.inOut'); t += 1.9; });

    // beat 1: three events; each bubbles, settles, and leaves a drop behind: the water notches up
    A.out(tl, f1, cue(1) - 0.2);
    const EV = [['zap', 'Startled by a noise'], ['door-open', 'Stranger at the door'], ['frown', 'Frustrated on the leash']];
    const t1 = clamp(at(1, 'Each experience', 0.35, 0.2), cue(1) + 0.4, end(1) - 4.5);
    const step = Math.min(1.9, (end(1) + 1.2 - t1) / 3);
    const notches = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    let L = 0.3;
    const ev = EV.map(([ic, txt], k) => {
      const tt = t1 + k * step, y = 300 + k * 120;
      const p = C2.pill(stage, ic, txt, { x: 1130, y, col: AMBER, size: 30 });
      A.in(tl, p, tt - 0.4, 'fadeLeft', { dur: 0.5 });
      B.set(tl, 0.4, tt, 0.5, 'power2.out');
      B.set(tl, 0.03, tt + 0.6, 0.7);
      const land = P.drip(tl, 1150, y + 30, tt + 0.5, AMBER, 0.7);
      L += 0.09;
      P.setLevel(tl, L, land, 0.5, 'power2.out');
      const sy = PY + C2.surfY(L) * S;
      const n = K.line(notches, PX - 300, sy, PX - 250, sy, { stroke: AMBER, 'stroke-width': 7, opacity: 0 });
      tl.fromTo(n, { opacity: 0 }, { opacity: 1, duration: 0.3, immediateRender: false }, land + 0.3);
      return p;
    });
    const f2 = cap(stage, 'Each one can <b>leave the water higher</b>', 1380, 690, 760);
    A.in(tl, f2, t1 + 3 * step - 0.6, 'fadeUp', { dur: 0.6 });

    // beat 2: recovery: drops lift out and the level comes back down
    const t2 = cue(2);
    tl.to([...ev, f2], { opacity: 0, duration: 0.4, stagger: 0.04 }, t2 - 0.2);
    const rec = C2.pill(stage, 'bed', 'Time to recover', { x: 1150, y: 420, size: 34, variant: 'green' });
    A.in(tl, rec, t2 + 0.2, 'fadeLeft', { dur: 0.5 });
    const tr = clamp(at(2, 'comes back down', 0.6, 0.3), t2 + 0.8, end(2) - 1.6);
    [0, 1].forEach(k => P.lift(tl, 1250, 420, tr + k * 0.5, C.water, 0.7));
    P.setLevel(tl, 0.36, tr + 0.3, 1.4);
    tl.to(notches, { opacity: 0.35, duration: 0.5 }, tr + 0.4);
  });

  // ================================================================== c3x02 Under, at, over threshold
  registerScene('c3x02', ctx => {
    const { stage, tl, cue, end, dur } = ctx;
    C2.style(stage); css(stage);
    const at = (i, p, fb, lead) => sayAt(ctx, i, p, fb, lead);
    heading(ctx, 'Under, at, and over *threshold*');
    const PX = 790, PY = 420, S = 0.92;
    const back = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const bn = burner(back, PX, PY + 360, 380);
    const P = C2.makePot(stage, { cx: PX, y: PY, s: S, level: 0.5 });
    const B = boil(P, 0.03);
    const sv = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    A.in(tl, [P.wrap, back], 0.1, 'fadeUp', { dur: 0.7 });
    P.waves(tl, 0, dur);
    B.run(tl, 0, dur);
    bn.flicker(tl, 0, dur);
    const th = thermo(sv, 1170, 360, 300, B);
    A.in(tl, th, 0.4, 'fade', { dur: 0.6 });
    const D = C2.dog(sv, 1450, 600, 0.95);
    A.in(tl, D.outer, 0.5, 'fadeUp', { dur: 0.7 });
    const dk = dogKit(tl, D);
    const trig = C2.badge(stage, 'dog', 1830, 520, 110, C.redPale || '#f8e3dd', RED);
    gsap.set(trig, { opacity: 0 });

    // beat 0: the rim is the threshold
    const line = K.path(sv, `M 110 ${PY} L ${PX - 230 * S} ${PY}`, { stroke: RED, 'stroke-width': 5, 'stroke-dasharray': '14 12', fill: 'none' });
    A.draw(tl, line, cue(0) + 0.5, 0.8);
    const thr = C2.put(stage, 'c3x-axis', 'Threshold = the rim', { x: 110, y: PY - 48 });
    thr.style.color = RED;
    A.in(tl, thr, cue(0) + 0.8, 'fade', { dur: 0.5 });
    const Z = [['Under', C.green, 'Can think, eat, learn', PY + 190], ['At', AMBER, 'Stiff, staring, slower', PY + 40], ['Over', RED, 'Reacting', PY - 150]];
    const zones = Z.map(([n, col, sub, y]) => {
      const z = C2.put(stage, 'c3x-zone', `${n}<small>${sub}</small>`, { x: 110, y });
      z.style.color = col;
      return z;
    });
    A.in(tl, zones, cue(0) + 1.2, 'fadeRight', { dur: 0.5, stagger: 0.15 });
    tl.to(zones, { opacity: 0.3, duration: 0.3 }, cue(0) + 1.9);
    dk.loose(cue(0) + 1, cue(2) + 0.3);

    // beat 1: under: the trigger appears far off, a small flame, the foam stays low
    const t1 = cue(1);
    tl.fromTo(trig, { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 0.6, immediateRender: false }, t1 + 0.1);
    bn.set(tl, 0.45, t1 + 0.3);
    B.set(tl, 0.3, t1 + 0.6, 1.6);
    tl.to(zones[0], { opacity: 1, duration: 0.4 }, clamp(at(1, 'Under threshold', 0.1, 0.1), t1, end(1) - 1));

    // beat 2: at: the trigger comes closer, more heat, foam rises to the rim, the dog stiffens
    const t2 = cue(2);
    tl.to(zones[0], { opacity: 0.3, duration: 0.3 }, t2);
    tl.to(trig, { x: -80, duration: 1.0, ease: 'power2.inOut' }, t2 + 0.1);
    bn.set(tl, 0.8, t2 + 0.3);
    B.set(tl, 0.78, t2 + 0.5, 1.8);
    tl.to(zones[1], { opacity: 1, duration: 0.4 }, t2 + 0.2);
    dk.stiff(clamp(at(2, 'stiffens', 0.6, 0.2), t2 + 0.6, end(2) - 0.6));

    // beat 3: over: the trigger is close, a big flame, the pot spills over, the dog reacts
    const t3 = cue(3);
    tl.to(zones[1], { opacity: 0.3, duration: 0.3 }, t3);
    tl.to(trig, { x: -130, duration: 0.6, ease: 'power2.out' }, t3 + 0.1);
    bn.set(tl, 1.15, t3 + 0.2, 0.6);
    B.set(tl, 1.15, t3 + 0.4, 1.0, 'power2.in');
    tl.to(zones[2], { opacity: 1, duration: 0.4 }, t3 + 0.3);
    dk.react(t3 + 1.0, dur - 0.4);
  });

  // ================================================================== c3x03 Same heat, two pots
  registerScene('c3x03', ctx => {
    const { stage, tl, cue, end, dur } = ctx;
    C2.style(stage); css(stage);
    const at = (i, p, fb, lead) => sayAt(ctx, i, p, fb, lead);
    heading(ctx, 'Same heat, *two pots*');
    const S = 0.74, PY = 420, X1 = 470, X2 = 1290;
    const back = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const b1 = burner(back, X1, PY + 290, 300), b2 = burner(back, X2, PY + 290, 300);
    const P1 = C2.makePot(stage, { cx: X1, y: PY, s: S, level: 0.28 });
    const P2 = C2.makePot(stage, { cx: X2, y: PY, s: S, level: 0.82 });
    const B1 = boil(P1, 0.02), B2 = boil(P2, 0.02);
    const sv = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const D1 = C2.dog(sv, 800, 600, 0.55), D2 = C2.dog(sv, 1630, 600, 0.55);
    const k1 = dogKit(tl, D1), k2 = dogKit(tl, D2);
    [P1, P2].forEach(P => P.waves(tl, 0, dur));
    [B1, B2].forEach(B => B.run(tl, 0, dur));
    [b1, b2].forEach(b => b.flicker(tl, 0, dur));
    const L1 = C2.put(stage, 'c3x-note', 'Low water: <b>more room</b>', { x: X1 - 260, y: 820, w: 520 });
    const L2 = C2.put(stage, 'c3x-note', 'Full pot: <b>less room</b>', { x: X2 - 260, y: 820, w: 520 });

    // beat 0: the low pot heats up; the foam rises but stays in
    A.in(tl, [P1.wrap, D1.outer, L1], 0.15, 'fadeUp', { dur: 0.7, stagger: 0.1 });
    gsap.set(b2.g, { opacity: 0 });
    tl.fromTo(back, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0.15);
    k1.loose(0.8, dur);
    const tH = clamp(at(0, 'heat comes on', 0.35, 0.2), cue(0) + 1.0, end(0) - 3);
    b1.set(tl, 0.85, tH);
    B1.set(tl, 0.85, tH + 0.3, 2.0);
    const ok = C2.pill(stage, 'check', 'Stays in', { x: X1, y: 230, center: true, size: 30, variant: 'green' });
    A.in(tl, ok, clamp(at(0, 'Nothing spills', 0.85, 0.2), tH + 1.6, end(0) - 0.4), 'pop', { dur: 0.5 });

    // beat 1: the same heat under the fuller pot: it boils over
    const t1 = cue(1);
    A.in(tl, [P2.wrap, D2.outer, L2, b2.g], t1 + 0.1, 'fadeUp', { dur: 0.7, stagger: 0.1 });
    k2.loose(t1 + 0.6, t1 + 1.6);
    const tH2 = clamp(at(1, 'same heat', 0.25, 0.1), t1 + 0.6, end(1) - 2.5);
    b2.set(tl, 0.85, tH2);
    B2.set(tl, 0.85, tH2 + 0.3, 2.0);
    k2.react(tH2 + 1.0, dur - 0.3);
    const bad = C2.pill(stage, 'x', 'Boils over', { x: X2, y: 230, center: true, size: 30, variant: 'red' });
    A.in(tl, bad, tH2 + 1.1, 'pop', { dur: 0.5 });

    // beat 2: same trigger, different baseline
    const c = cap(stage, 'Same trigger. <b>Different baseline.</b>', 960, 900, 1200);
    A.in(tl, c, cue(2) + 0.1, 'fadeUp', { dur: 0.6 });
    tl.to([L1, L2], { opacity: 0, duration: 0.3 }, cue(2));
  });

  // ================================================================== c3x04 Trigger stacking
  registerScene('c3x04', ctx => {
    const { stage, tl, cue, end, dur } = ctx;
    C2.style(stage); css(stage);
    const at = (i, p, fb, lead) => sayAt(ctx, i, p, fb, lead);
    heading(ctx, 'Trigger *stacking*');
    const sv = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const X0 = 330, X1 = 1700, TH = 0.78;
    const AMP = [0.45, 0.4, 0.3], ICN = [['dog', 'Dog'], ['bike', 'Bike'], ['door-closed', 'Door slams']], TAU = 0.25;
    // temperature over normalised time u (0..1): each trigger adds a quick rise, then cools exponentially
    const curve = (times, u) => times.reduce((s, ti, k) => {
      if (u < ti) return s;
      const d = u - ti, rise = Math.min(1, d / 0.025);
      return s + AMP[k] * rise * Math.exp(-Math.max(0, d - 0.025) / TAU);
    }, 0.05);
    function graph(y0, h, times, label, idx) {
      const g = K.group(sv);
      const L = C2.put(stage, 'c3x-axis', label, { x: X0, y: y0 - 44 });
      K.line(g, X0, y0, X0, y0 + h, { stroke: C.greenDeep, 'stroke-width': 4 });
      K.line(g, X0, y0 + h, X1, y0 + h, { stroke: C.greenDeep, 'stroke-width': 4 });
      const ty = y0 + h - TH * h;
      K.line(g, X0, ty, X1, ty, { stroke: RED, 'stroke-width': 4, 'stroke-dasharray': '14 12' });
      const tl2 = C2.put(stage, 'c3x-axis', 'Threshold', { x: X1 - 160, y: ty - 36 });
      tl2.style.color = RED;
      const pts = [];
      for (let k = 0; k <= 400; k++) { const u = k / 400; pts.push(`${(X0 + u * (X1 - X0)).toFixed(1)},${(y0 + h - Math.min(1.1, curve(times, u)) * h).toFixed(1)}`); }
      const cid = 'c3xg' + idx;
      const defs = K.svgEl('defs', {}, sv);
      defs.innerHTML = `<clipPath id="${cid}"><rect x="${X0}" y="${y0 - 40}" width="0" height="${h + 80}"/></clipPath>`;
      const clipRect = defs.querySelector('rect');
      const line = K.svgEl('polyline', { points: pts.join(' '), fill: 'none', stroke: C.water, 'stroke-width': 8, 'stroke-linejoin': 'round', 'clip-path': `url(#${cid})` }, g);
      const marks = times.map((ti, k) => {
        const x = X0 + ti * (X1 - X0);
        const m = K.el('div');
        const p = C2.pill(m, ICN[k][0], ICN[k][1], { x: x - 20, y: y0 + h + 14, size: 24, col: AMBER });
        stage.appendChild(m);
        return { m: p, x, ti };
      });
      return { g, L, tl2, clipRect, line, marks, ty, y0, h };
    }
    const top = graph(270, 230, [0.18, 0.3, 0.42], 'Close together', 0);
    const bot = graph(650, 230, [0.1, 0.45, 0.8], 'Spread out', 1);
    [top, bot].forEach(G => { gsap.set([G.g, G.L, G.tl2, ...G.marks.map(m => m.m)], { opacity: 0 }); });
    const reveal = (G, u0, u1, t0, t1) => {
      tl.fromTo(G.clipRect, { attr: { width: u0 * (X1 - X0) } }, { attr: { width: u1 * (X1 - X0) }, duration: t1 - t0, ease: 'none', immediateRender: false }, t0);
      G.marks.forEach(m => { if (m.ti >= u0 && m.ti < u1) A.in(tl, m.m, t0 + (m.ti - u0) / (u1 - u0) * (t1 - t0) - 0.15, 'pop', { dur: 0.35 }); });
    };

    // beat 0: close together: the first two triggers, the water barely cools in between
    const t0 = cue(0);
    A.in(tl, [top.g, top.L, top.tl2], t0 + 0.2, 'fade', { dur: 0.5 });
    reveal(top, 0, 0.36, t0 + 0.6, end(0) + 0.2);
    // beat 1: the third, smallest trigger tips it over
    const t1 = cue(1);
    const tCross = clamp(at(1, 'tips it over', 0.45, 0.4), t1 + 0.8, end(1) - 3);
    reveal(top, 0.36, 0.46, t1, tCross);
    reveal(top, 0.46, 1.0, tCross, tCross + 2.4);
    const burst = C2.pill(stage, 'zap', 'Boils over', { x: X0 + 0.44 * (X1 - X0) + 30, y: top.ty - 110, size: 28, variant: 'red' });
    A.in(tl, burst, tCross - 0.1, 'pop', { dur: 0.45 });
    const blame = C2.pill(stage, null, 'The smallest one <b>gets the blame</b>', { x: 1060, y: 360, size: 28, variant: 'pale' });
    A.in(tl, blame, clamp(at(1, 'gets the blame', 0.7, 0.3), tCross + 0.6, end(1) - 0.5), 'fadeUp', { dur: 0.5 });

    // beat 2: spread out: the same three triggers cool down in between, nothing spills
    const t2 = cue(2);
    tl.to([top.g, top.L, top.tl2, burst, blame, ...top.marks.map(m => m.m)], { opacity: 0.35, duration: 0.4 }, t2);
    A.in(tl, [bot.g, bot.L, bot.tl2], t2 + 0.1, 'fade', { dur: 0.5 });
    reveal(bot, 0, 1, t2 + 0.4, Math.min(end(2) + 0.6, dur - 1.2));
    const ok = C2.pill(stage, 'check', 'Cools down in between', { x: 1180, y: 600, size: 28, variant: 'green' });
    A.in(tl, ok, Math.min(end(2) + 0.2, dur - 1.0), 'pop', { dur: 0.45 });
  });

  // ================================================================== c3x05 Before, during, after training
  registerScene('c3x05', ctx => {
    const { stage, tl, cue, end, dur } = ctx;
    C2.style(stage); css(stage);
    const at = (i, p, fb, lead) => sayAt(ctx, i, p, fb, lead);
    heading(ctx, 'Before, during, and after *training*');
    const S = 0.6, PY = 400, XS = [330, 920, 1510];
    const back = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const sv = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const cols = [['Before', RED], ['During', AMBER], ['After', C.green]];
    const make = (k, level) => {
      const x = XS[k];
      const bn = burner(back, x, PY + 236, 250);
      const P = C2.makePot(stage, { cx: x, y: PY, s: S, level });
      const B = boil(P, 0.02);
      const D = C2.dog(sv, x + 250, PY + 200, 0.42);
      const dk = dogKit(tl, D);
      const dl = dial(sv, x - 150, PY + 290, 30);
      const head = C2.put(stage, 'c3x-col', cols[k][0], { x: x - 100, y: 225, w: 200, align: 'center' });
      head.style.background = cols[k][1];
      P.waves(tl, 0, dur);
      B.run(tl, 0, dur);
      bn.flicker(tl, 0, dur);
      const parts = [P.wrap, D.outer, head, dl.g, bn.g];
      gsap.set(parts, { opacity: 0 });
      return { x, bn, P, B, D, dk, dl, head, parts };
    };
    const c0 = make(0, 0.8), c1 = make(1, 0.8), c2 = make(2, 0.42);
    tl.fromTo(back, { opacity: 0 }, { opacity: 1, duration: 0.01 }, 0);
    const note = (x, html, y = 830) => C2.put(stage, 'c3x-note', html, { x: x - 260, y, w: 520 });

    // beat 0: before: full pot, the trigger turns the heat up high, it boils over
    const t0 = cue(0);
    A.in(tl, c0.parts, t0 + 0.1, 'fadeUp', { dur: 0.6, stagger: 0.08 });
    c0.dk.loose(t0 + 0.6, t0 + 2.0);
    const tUp = clamp(at(0, 'heat up high', 0.6, 0.3), t0 + 1.2, end(0) - 2);
    c0.dl.set(tl, 120, tUp);
    c0.bn.set(tl, 1.1, tUp + 0.1);
    c0.B.set(tl, 1.0, tUp + 0.4, 1.2, 'power2.in');
    c0.dk.react(tUp + 1.2, dur - 0.4);
    const n0 = note(c0.x, 'Full pot, high heat: <b style="color:var(--red)">boils over</b>');
    A.in(tl, n0, tUp + 1.0, 'fadeUp', { dur: 0.5 });

    // beat 1: during: lower the water; you turn the heat down; skills while the foam stays low
    const t1 = cue(1);
    A.in(tl, c1.parts, t1 + 0.1, 'fadeUp', { dur: 0.6, stagger: 0.08 });
    c1.dl.set(tl, 120, t1 + 0.05, 0.01);
    c1.bn.set(tl, 1.0, t1 + 0.05, 0.01);
    c1.B.set(tl, 0.5, t1 + 0.05, 0.01);
    const tLow = clamp(at(1, 'lower the water', 0.2, 0.2), t1 + 0.6, end(1) - 6);
    [0, 1, 2].forEach(k => c1.P.lift(tl, c1.x - 60 + k * 60, 300, tLow + k * 0.3, C.water, 0.7));
    c1.P.setLevel(tl, 0.45, tLow + 0.3, 1.4);
    const tDial = clamp(at(1, 'turn the heat down', 0.5, 0.2), tLow + 1.6, end(1) - 3.5);
    c1.dl.set(tl, -60, tDial, 1.0);
    c1.bn.set(tl, 0.4, tDial + 0.1, 1.0);
    c1.B.set(tl, 0.22, tDial + 0.2, 1.4);
    const hand = C2.badge(stage, 'hand', c1.x - 150, PY + 200, 64, '#fff', C.greenDeep);
    A.in(tl, hand, tDial - 0.3, 'pop', { dur: 0.4 });
    tl.to(hand, { opacity: 0, duration: 0.3 }, tDial + 1.4);
    const tSk = clamp(at(1, 'new skills', 0.8, 0.3), tDial + 1.2, end(1) - 0.8);
    c1.dk.loose(tDial + 1.0, dur - 0.2);
    const n1 = note(c1.x, 'Lower water. <b>You turn the heat down.</b><br>Skills while the bubbles stay low.', 800);
    A.in(tl, n1, tSk, 'fadeUp', { dur: 0.5 });

    // beat 2: after: the same trigger, the dog turns the dial down on their own; a little foam, settles fast
    const t2 = cue(2);
    A.in(tl, c2.parts, t2 + 0.1, 'fadeUp', { dur: 0.6, stagger: 0.08 });
    c2.dl.set(tl, 120, t2 + 0.6, 0.6);
    c2.bn.set(tl, 0.9, t2 + 0.7, 0.6);
    c2.B.set(tl, 0.35, t2 + 0.9, 0.8);
    const tOwn = clamp(at(2, 'on their own', 0.4, 0.2), t2 + 1.8, end(2) - 4);
    c2.dl.set(tl, -60, tOwn, 1.0);
    c2.bn.set(tl, 0.35, tOwn + 0.1, 1.0);
    c2.B.set(tl, 0.06, tOwn + 0.4, 1.2);
    c2.dk.stiff(t2 + 1.0);
    c2.dk.relax(tOwn + 0.6);
    c2.dk.loose(tOwn + 1.0, dur - 0.2);
    const pw = C2.badge(stage, 'paw-print', c2.x - 150, PY + 200, 64, '#fff', C.greenDeep);
    A.in(tl, pw, tOwn - 0.3, 'pop', { dur: 0.4 });
    tl.to(pw, { opacity: 0, duration: 0.3 }, tOwn + 1.4);
    const n2 = note(c2.x, '<b>Your dog turns it down.</b><br>Rises a little, settles fast.', 800);
    A.in(tl, n2, tOwn + 0.6, 'fadeUp', { dur: 0.5 });
    const fin = cap(stage, 'A dog with a <b>better plan</b>', 960, 920, 1100);
    A.in(tl, fin, clamp(at(2, 'better plan', 0.9, 0.3), tOwn + 1.5, dur - 1.4), 'fadeUp', { dur: 0.6 });
  });
})();
