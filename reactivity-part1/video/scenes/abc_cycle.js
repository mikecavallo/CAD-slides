// The ABCs as a cycle: two loops side by side, Before training (red) and During training (green).
// Same A, B, C as the deck's straight strip (K.abc), bent into a ring so C feeds back into the next A.
// The consequence is the same in both loops (space is given); what changes is the A and the B.
// Arrow labels: A to B 'Emotions' / 'Changing emotions'; B to C 'Increased' / 'Lowered arousal/stress'.
//
//   abc_cycle   not in script/lesson.json yet. Intended beats when it gets narration:
//               0 heading   1 before loop builds A, B, C   2 its note   3 during loop builds   4 its note
//               (any beats past the last one present are skipped; with fewer beats everything still builds)
//
// K.abcCycle is defined here so later scenes can reuse the same loop.
(() => {
  const CSS = `
  .abcc-card { position: absolute; box-sizing: border-box; background: #fff; border-radius: 24px;
    border: 4px solid var(--abcc); box-shadow: var(--shadow-soft); display: flex; align-items: center; gap: 14px; padding: 0 16px; }
  .abcc-card .lt { flex: 0 0 auto; width: 60px; height: 60px; border-radius: 50%; background: var(--abcc); color: #fff;
    display: grid; place-items: center; font: 800 38px/1 var(--font-head); }
  .abcc-card .wd { font: 600 26px/1 var(--font-body); color: var(--abcc); margin-bottom: 8px; }
  .abcc-card .cp { font: 700 28px/1.12 var(--font-body); color: var(--ink); }
  .abcc-card .sub { font: 500 26px/1.15 var(--font-body); color: var(--ink-soft); margin-top: 4px; }
  .abcc-mid { position: absolute; width: 420px; display: flex; flex-direction: column; align-items: center; gap: 14px; text-align: center; }
  .abcc-mid .pill { padding: 12px 26px; border-radius: 16px; background: var(--abcc); color: #fff; font: 700 32px/1 var(--font-head);
    white-space: nowrap; box-shadow: 0 4px 0 rgba(0,0,0,0.12); }
  .abcc-mid .nt { font: 600 27px/1.3 var(--font-body); color: var(--ink-soft); }
  .abcc-lab { position: absolute; font: italic 700 27px/1.18 var(--font-body); color: var(--abcc); white-space: nowrap; }
  `;

  const { el, md } = K;
  const COLORS = { red: '#b8452d', green: '#619537', olive: '#4b5a1e' };
  const LETTERS = ['A', 'B', 'C'];
  const WORDS = ['Antecedent', 'Behavior', 'Consequence'];

  /**
   * One ABC loop. Nodes sit on a ring (A at the top), arrows run clockwise A to B to C and back to A.
   * o: {cx, cy, r, variant:'red'|'green'|'olive', angles:[a,b,c] (degrees clockwise from 12 o'clock),
   *     captions:[a,b,c] (string, or {t, sub} for a smaller second line), sizes:[{w,h}, ...],
   *     labels:[{t, side:'out'|'in', gap}|null, ...] one per arrow (A to B, B to C, C to A), label, note, midY}
   * Returns {cards, arcs, heads, labels, mid, pill, note, dot, track}.
   */
  K.abcCycle = (parent, o) => {
    const color = COLORS[o.variant] || o.variant || COLORS.olive;
    const cx = o.cx, cy = o.cy, r = o.r ?? 270;
    const rad = d => (d * Math.PI) / 180;
    const pt = (d, rr = r) => [cx + rr * Math.sin(rad(d)), cy - rr * Math.cos(rad(d))];
    const ANG = o.angles || [0, 120, 240];
    const SZ = [0, 1, 2].map(i => Object.assign({ w: 300, h: 120 }, (o.sizes || [])[i]));

    // ring + arrows live in one svg under the cards
    const pad = 40;
    const svg = K.svg(parent, { x: cx - r - pad, y: cy - r - pad, w: 2 * (r + pad), h: 2 * (r + pad), viewBox: `${cx - r - pad} ${cy - r - pad} ${2 * (r + pad)} ${2 * (r + pad)}` });
    svg.style.overflow = 'visible';
    const track = K.circle(svg, cx, cy, r, { fill: 'none', stroke: color, 'stroke-width': 3, opacity: 0.18, 'stroke-dasharray': '2 14', 'stroke-linecap': 'round' });

    // visible part of each arc: outside every card plus a margin, found by sampling
    const m = 16;
    const hidden = d => {
      const [x, y] = pt(d);
      return ANG.some((a, i) => { const [nx, ny] = pt(a); return Math.abs(x - nx) < SZ[i].w / 2 + m && Math.abs(y - ny) < SZ[i].h / 2 + m; });
    };
    const arcs = [], heads = [], labels = [];
    ANG.forEach((a0, i) => {
      const a1 = i < 2 ? ANG[i + 1] : ANG[0] + 360;
      let s = a0; while (s < a1 && hidden(s)) s += 0.5;
      let e = a1; while (e > s && hidden(e)) e -= 0.5;
      const mida = (s + e) / 2;
      e -= 7; // room for the arrowhead
      const [x0, y0] = pt(s), [x1, y1] = pt(e);
      arcs.push(K.path(svg, `M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`,
        { fill: 'none', stroke: color, 'stroke-width': 10, 'stroke-linecap': 'round' }));
      // arrowhead pointing along the clockwise tangent at the arc's end
      const g = K.group(svg, { transform: `translate(${x1.toFixed(1)} ${y1.toFixed(1)}) rotate(${e.toFixed(1)})` });
      K.path(g, 'M-4 -17 L26 0 L-4 17 Z', { fill: color, stroke: color, 'stroke-width': 4, 'stroke-linejoin': 'round' });
      heads.push(g);

      // label beside the arrow: outside the ring, or inside it (the bottom arrow's label sits just above it)
      const L = (o.labels || [])[i];
      if (!L) { labels.push(null); return; }
      const out = (L.side || 'out') === 'out';
      const ux = Math.sin(rad(mida)), uy = -Math.cos(rad(mida));
      const [lx, ly] = pt(mida, out ? r + (L.gap ?? 22) : r - (L.gap ?? 22));
      const lab = el('div', 'abcc-lab', md(L.t));
      lab.style.setProperty('--abcc', color);
      const sx = out ? ux : -ux, sy = out ? uy : -uy;
      lab.style.textAlign = Math.abs(sx) < 0.3 ? 'center' : sx > 0 ? 'left' : 'right';
      Object.assign(lab.style, { left: `${lx}px`, top: `${ly}px` });
      gsap.set(lab, { xPercent: -50 + sx * 50, yPercent: -50 + sy * 50 });
      parent.appendChild(lab);
      labels.push(lab);
    });

    // a dot that travels the loop once it is built: the cycle keeps running
    const dot = K.circle(svg, 0, 0, 11, { fill: color, stroke: '#fff', 'stroke-width': 4 });
    dot.style.opacity = 0;

    const cards = ANG.map((a, i) => {
      const [x, y] = pt(a);
      const { w, h } = SZ[i];
      const cap = typeof o.captions[i] === 'string' ? { t: o.captions[i] } : o.captions[i];
      const c = el('div', 'abcc-card');
      c.style.setProperty('--abcc', color);
      c.innerHTML = `<div class="lt">${LETTERS[i]}</div><div><div class="wd">${WORDS[i]}</div>` +
        `<div class="cp">${md(cap.t)}</div>${cap.sub ? `<div class="sub">${md(cap.sub)}</div>` : ''}</div>`;
      Object.assign(c.style, { left: `${x - w / 2}px`, top: `${y - h / 2}px`, width: `${w}px`, height: `${h}px` });
      parent.appendChild(c);
      return c;
    });

    const mid = el('div', 'abcc-mid');
    mid.style.setProperty('--abcc', color);
    const pill = el('div', 'pill', md(o.label || ''));
    const note = el('div', 'nt', md(o.note || ''));
    mid.appendChild(pill);
    mid.appendChild(note);
    Object.assign(mid.style, { left: `${cx - 210}px`, top: `${o.midY ?? cy - r + SZ[0].h / 2 + 26}px` });
    parent.appendChild(mid);

    return { cards, arcs, heads, labels, mid, pill, note, dot, track, color, cx, cy, r };
  };

  // build one loop: A, arrow, B, arrow, C, arrow back to A. Returns when it finishes.
  function buildLoop(tl, L, t) {
    const step = 0.55;
    A.in(tl, L.track, t, 'fade', { dur: 0.6 });
    A.in(tl, L.pill, t, 'pop', { dur: 0.6 });
    L.cards.forEach((c, i) => {
      const ti = t + 0.25 + i * 2 * step;
      A.in(tl, c, ti, 'pop', { dur: 0.6 });
      A.draw(tl, L.arcs[i], ti + step * 0.9, step * 1.2, { ease: 'power1.inOut' });
      tl.fromTo(L.heads[i], { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'none' }, ti + step * 0.9 + step * 1.2 - 0.12);
      if (L.labels[i]) A.in(tl, L.labels[i], ti + step * 1.3, 'fade', { dur: 0.5 });
    });
    return t + 0.25 + 6 * step + 0.4;
  }

  // dot laps the full ring from A, clockwise, until the scene ends
  function runDot(tl, L, t, dur) {
    const lap = 4.2;
    const laps = Math.max(1, Math.floor((dur - 0.6 - t) / lap));
    tl.set(L.dot, { opacity: 1 }, t);
    const top = `M${L.cx} ${L.cy - L.r}`;
    const ring = `${top} A${L.r} ${L.r} 0 0 1 ${L.cx} ${L.cy + L.r} A${L.r} ${L.r} 0 0 1 ${L.cx} ${L.cy - L.r}`;
    tl.to(L.dot, { duration: lap, ease: 'none', repeat: laps - 1, motionPath: { path: ring } }, t);
  }

  registerScene('abc_cycle', ({ stage, tl, cue, dur, beats }) => {
    stage.appendChild(K.el('style', null, CSS));
    const at = i => (i < beats.length ? cue(i) : null);

    const h = K.heading(stage, 'The ABC cycle', { x: 100, y: 116, size: 72, barGap: 22 });

    // B and C sit near 3 and 9 o'clock so the long bottom arrow (B to C) has room for its label above it
    const CY = 625, R = 260, ANG = [0, 100, 260];
    const BC = { side: 'in', gap: 40 };
    const before = K.abcCycle(stage, {
      cx: 506, cy: CY, r: R, angles: ANG, variant: 'red',
      captions: ['Other dog too close', 'Bark and lunge', 'Space is given'],
      labels: [{ t: 'Emotions' }, Object.assign({ t: 'Increased<br>arousal/stress' }, BC), null],
      label: 'Before training',
      note: 'Barking works,<br>so it comes back.',
    });
    const during = K.abcCycle(stage, {
      cx: 1384, cy: CY, r: R, angles: ANG, variant: 'green',
      captions: ['More distance', { t: 'Replacement behavior', sub: 'e.g. looks to you' }, 'Space is given'],
      sizes: [null, { w: 360, h: 160 }, null],
      labels: [{ t: 'Changing<br>emotions' }, Object.assign({ t: 'Lowered<br>arousal/stress' }, BC), null],
      label: 'During training',
      note: 'The new behavior works,<br>so it comes back.',
    });

    const t0 = at(0) ?? 0;
    A.in(tl, h.all, t0, 'fadeUp', { stagger: 0.12 });

    const t1 = at(1) ?? t0 + 0.8;
    const b1 = buildLoop(tl, before, t1);
    A.in(tl, before.note, at(2) ?? b1, 'fadeUp', { dur: 0.7 });
    runDot(tl, before, Math.max(b1, at(2) ?? b1), dur);

    const t3 = at(3) ?? b1 + 0.6;
    const b3 = buildLoop(tl, during, t3);
    A.in(tl, during.note, at(4) ?? b3, 'fadeUp', { dur: 0.7 });
    runDot(tl, during, Math.max(b3, at(4) ?? b3), dur);

    // same consequence in both loops: the two C cards pulse together once both are up
    const tc = Math.max(b3, at(4) ?? b3) + 0.8;
    if (tc < dur - 1.2) A.pulse(tl, [before.cards[2], during.cards[2]], tc, { scale: 1.06 });
  });
})();
