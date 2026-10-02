// The ABCs as a cycle: two loops side by side, Before training (red) and During training (green).
// Same A, B, C as the deck's straight strip (K.abc), bent into a ring so C feeds back into the next A.
// The consequence is the same in both loops (space is given); what changes is the A and the B.
// Arrow labels: A to B 'Emotions' / 'Changing emotions'; B to C 'Increased' / 'Lowered arousal/stress'.
//
// Then the paths change strength: practice thickens the new (green) path while the old (red) one fades,
// and practicing the old behavior brings the red path back while the green one fades.
//
//   abc_cycle   not in script/lesson.json yet. Intended beats when it gets narration:
//               0 heading   1 before loop builds A, B, C   2 its note   3 during loop builds   4 its note
//               5 practice: green path strengthens, red path fades   6 old behavior practiced: red path comes back, green fades
//               7 management: green path strengthens again, red fades (scene ends on the new path)
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
  .abcc-say { position: absolute; left: 100px; width: 1720px; top: 916px; text-align: center; font: 600 32px/1.2 var(--font-body); color: var(--ink); }
  .abcc-say b.em-red { color: var(--red); }
  .abcc-lab { position: absolute; font: italic 700 27px/1.18 var(--font-body); color: var(--abcc); white-space: nowrap; }
  `;

  const { el, md } = K;
  const HEAD = k => `M${-4 * k} ${-17 * k} L${26 * k} 0 L${-4 * k} ${17 * k} Z`;
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
    const arcs = [], heads = [], labels = [], worn = [];
    ANG.forEach((a0, i) => {
      const a1 = i < 2 ? ANG[i + 1] : ANG[0] + 360;
      let s = a0; while (s < a1 && hidden(s)) s += 0.5;
      let e = a1; while (e > s && hidden(e)) e -= 0.5;
      const mida = (s + e) / 2;
      e -= 7; // room for the arrowhead
      const [x0, y0] = pt(s), [x1, y1] = pt(e);
      const d = `M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
      // worn path under the arrow: shows up when this loop gets practiced
      worn.push(K.path(svg, d, { fill: 'none', stroke: color, 'stroke-width': 40, 'stroke-linecap': 'round', opacity: 0 }));
      arcs.push(K.path(svg, `M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`,
        { fill: 'none', stroke: color, 'stroke-width': 10, 'stroke-linecap': 'round' }));
      // arrowhead pointing along the clockwise tangent at the arc's end
      const g = K.group(svg, { transform: `translate(${x1.toFixed(1)} ${y1.toFixed(1)}) rotate(${e.toFixed(1)})` });
      K.path(g, HEAD(1), { fill: color, stroke: color, 'stroke-width': 4, 'stroke-linejoin': 'round' });
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

    const pale = { [COLORS.red]: '#ecd3cc', [COLORS.green]: '#d6e6c6' }[color] || '#e2e4dc';
    return { cards, arcs, heads, labels, worn, mid, pill, note, dot, track, color, pale, cx, cy, r };
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

  // path strength: k = 1 normal, > 1 practiced (thicker arrows, worn path under them), < 1 fading
  function strength(tl, L, t, k, o = {}) {
    const dur = o.dur ?? 1.4, ease = 'power2.inOut';
    tl.to(L.arcs, { attr: { 'stroke-width': 10 * k }, duration: dur, ease }, t);
    tl.to(L.heads.map(g => g.firstChild), { attr: { d: HEAD(Math.max(0.75, Math.min(k, 1.5))) }, duration: dur, ease }, t);
    tl.to(L.worn, { opacity: k > 1 ? 0.16 : 0, duration: dur, ease }, t);
    const fade = k < 1 ? 0.3 : 1;
    tl.to([...L.arcs, ...L.heads, L.dot], { opacity: k < 1 ? 0.35 : 1, duration: dur, ease }, t);
    // cards keep a solid white face so the ring behind them never shows through; their content and border fade
    tl.to(L.cards.flatMap(c => [...c.children]), { opacity: fade, duration: dur, ease }, t);
    tl.to(L.cards, { borderColor: k < 1 ? L.pale : L.color, boxShadow: k < 1 ? 'none' : 'var(--shadow-soft)', duration: dur, ease }, t);
    tl.to([L.mid, ...L.labels.filter(Boolean)], { opacity: fade, duration: dur, ease }, t);
    tl.to(L.track, { opacity: k < 1 ? 0.06 : 0.18, duration: dur, ease }, t);
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
      captions: ['Another dog appears', 'Bark and lunge', 'Space is given'],
      labels: [{ t: 'Emotions' }, Object.assign({ t: 'Increased<br>arousal/stress' }, BC), null],
      label: 'Before training',
      note: 'Barking works,<br>so it repeats.',
    });
    const during = K.abcCycle(stage, {
      cx: 1384, cy: CY, r: R, angles: ANG, variant: 'green',
      captions: ['Another dog appears', { t: 'Replacement behavior', sub: 'e.g. looks to you' }, 'Space is given'],
      sizes: [null, { w: 360, h: 160 }, null],
      labels: [{ t: 'Changing<br>emotions' }, Object.assign({ t: 'Lowered<br>arousal/stress' }, BC), null],
      label: 'During training',
      note: 'The new behavior works,<br>so it repeats.',
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
    const built = Math.max(b3, at(4) ?? b3);
    A.pulse(tl, [before.cards[2], during.cards[2]], built + 0.8, { scale: 1.06 });

    // practice: the new path gets stronger, the old one fades
    const say1 = K.el('div', 'abcc-say', md('Practice builds a *stronger new path*. The old path fades.'));
    const say2 = K.el('div', 'abcc-say', md('Practice the old behavior and !!the old path comes back!!.'));
    stage.appendChild(say1); stage.appendChild(say2);
    const t5 = at(5) ?? built + 2;
    A.in(tl, say1, t5, 'fadeUp', { dur: 0.7 });
    strength(tl, during, t5 + 0.3, 1.9, { dur: 2.2 });
    strength(tl, before, t5 + 0.3, 0.45, { dur: 2.2 });

    // relapse: the old behavior gets practiced; its path is back at full strength while the new one fades
    const t6 = at(6) ?? t5 + 5;
    A.out(tl, say1, t6, 'fadeUp', { dur: 0.4 });
    A.in(tl, say2, t6 + 0.3, 'fadeUp', { dur: 0.7 });
    strength(tl, before, t6 + 0.4, 1.6, { dur: 1.6 });
    strength(tl, during, t6 + 0.4, 0.45, { dur: 1.6 });
    A.pulse(tl, before.cards[1], t6 + 1.4, { scale: 1.07 });

    // management: keep the old behavior from being practiced so the new path can take over again
    const say3 = K.el('div', 'abcc-say', md('That’s why *management* is so important: so we can create a *stronger new path*.'));
    stage.appendChild(say3);
    const t7 = at(7) ?? t6 + 4.5;
    A.out(tl, say2, t7, 'fadeUp', { dur: 0.4 });
    A.in(tl, say3, t7 + 0.3, 'fadeUp', { dur: 0.7 });
    strength(tl, before, t7 + 0.4, 0.45, { dur: 1.8 });
    strength(tl, during, t7 + 0.4, 1.9, { dur: 1.8 });
    A.pulse(tl, during.cards[1], t7 + 1.8, { scale: 1.06 });
  });
})();
