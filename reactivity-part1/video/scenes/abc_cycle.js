// The ABCs as a cycle: two loops side by side, Before training (red) and During training (green).
// Same A, B, C as the deck's straight strip (K.abc), bent into a ring so C feeds back into the next A.
// The consequence is the same in both loops (space is given); what changes is the A and the B.
//
//   abc_cycle   not in script/lesson.json yet. Intended beats when it gets narration:
//               0 heading   1 before loop builds A, B, C   2 its note   3 during loop builds   4 its note
//               (any beats past the last one present are skipped; with fewer beats everything still builds)
//
// K.abcCycle is defined here so later scenes can reuse the same loop.
(() => {
  const CSS = `
  .abcc-card { position: absolute; width: 330px; height: 130px; box-sizing: border-box; background: #fff; border-radius: 24px;
    border: 4px solid var(--abcc); box-shadow: var(--shadow-soft); display: flex; align-items: center; gap: 16px; padding: 0 18px; }
  .abcc-card .lt { flex: 0 0 auto; width: 72px; height: 72px; border-radius: 50%; background: var(--abcc); color: #fff;
    display: grid; place-items: center; font: 800 44px/1 var(--font-head); }
  .abcc-card .wd { font: 600 26px/1 var(--font-body); color: var(--abcc); margin-bottom: 8px; }
  .abcc-card .cp { font: 700 29px/1.12 var(--font-body); color: var(--ink); }
  .abcc-mid { position: absolute; width: 420px; display: flex; flex-direction: column; align-items: center; gap: 18px; text-align: center; }
  .abcc-mid .pill { padding: 14px 30px; border-radius: 16px; background: var(--abcc); color: #fff; font: 700 36px/1 var(--font-head);
    white-space: nowrap; box-shadow: 0 4px 0 rgba(0,0,0,0.12); }
  .abcc-mid .nt { font: 600 28px/1.3 var(--font-body); color: var(--ink-soft); }
  .abcc-mid .nt b { color: var(--abcc); }
  `;

  const { el, md } = K;
  const COLORS = { red: '#b8452d', green: '#619537', olive: '#4b5a1e' };
  const LETTERS = ['A', 'B', 'C'];
  const WORDS = ['Antecedent', 'Behavior', 'Consequence'];

  /**
   * One ABC loop. Nodes sit on a ring at 12, 4 and 8 o'clock, arrows run clockwise between them.
   * o: {cx, cy, r, variant:'red'|'green'|'olive', captions:[a,b,c], label, note, cardW, cardH}
   * Returns {cards, arcs, heads, mid, pill, note, dot, track}.
   */
  K.abcCycle = (parent, o) => {
    const color = COLORS[o.variant] || o.variant || COLORS.olive;
    const cx = o.cx, cy = o.cy, r = o.r ?? 280;
    const cw = o.cardW ?? 330, ch = o.cardH ?? 130;
    const rad = d => (d * Math.PI) / 180;
    const pt = d => [cx + r * Math.sin(rad(d)), cy - r * Math.cos(rad(d))];
    const ANG = [0, 120, 240];

    // ring + arrows live in one svg under the cards
    const pad = 40;
    const svg = K.svg(parent, { x: cx - r - pad, y: cy - r - pad, w: 2 * (r + pad), h: 2 * (r + pad), viewBox: `${cx - r - pad} ${cy - r - pad} ${2 * (r + pad)} ${2 * (r + pad)}` });
    svg.style.overflow = 'visible';
    const track = K.circle(svg, cx, cy, r, { fill: 'none', stroke: color, 'stroke-width': 3, opacity: 0.18, 'stroke-dasharray': '2 14', 'stroke-linecap': 'round' });

    // visible part of each arc: outside both cards plus a margin, found by sampling
    const m = 16;
    const hidden = d => {
      const [x, y] = pt(d);
      return ANG.some(a => { const [nx, ny] = pt(a); return Math.abs(x - nx) < cw / 2 + m && Math.abs(y - ny) < ch / 2 + m; });
    };
    const arcs = [], heads = [];
    ANG.forEach((a0, i) => {
      const a1 = a0 + 120;
      let s = a0; while (s < a1 && hidden(s)) s += 0.5;
      let e = a1; while (e > s && hidden(e)) e -= 0.5;
      e -= 7; // room for the arrowhead
      const [x0, y0] = pt(s), [x1, y1] = pt(e);
      arcs.push(K.path(svg, `M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`,
        { fill: 'none', stroke: color, 'stroke-width': 10, 'stroke-linecap': 'round' }));
      // arrowhead pointing along the clockwise tangent at the arc's end
      const g = K.group(svg, { transform: `translate(${x1.toFixed(1)} ${y1.toFixed(1)}) rotate(${e.toFixed(1)})` });
      K.path(g, 'M-4 -17 L26 0 L-4 17 Z', { fill: color, stroke: color, 'stroke-width': 4, 'stroke-linejoin': 'round' });
      heads.push(g);
    });

    // a dot that travels the loop once it is built: the cycle keeps running
    const dot = K.circle(svg, 0, 0, 11, { fill: color, stroke: '#fff', 'stroke-width': 4 });
    dot.style.opacity = 0;

    const cards = ANG.map((a, i) => {
      const [x, y] = pt(a);
      const c = el('div', 'abcc-card');
      c.style.setProperty('--abcc', color);
      c.innerHTML = `<div class="lt">${LETTERS[i]}</div><div><div class="wd">${WORDS[i]}</div><div class="cp">${md(o.captions[i])}</div></div>`;
      Object.assign(c.style, { left: `${x - cw / 2}px`, top: `${y - ch / 2}px`, width: `${cw}px`, height: `${ch}px` });
      parent.appendChild(c);
      return c;
    });

    const mid = el('div', 'abcc-mid');
    mid.style.setProperty('--abcc', color);
    const pill = el('div', 'pill', md(o.label || ''));
    const note = el('div', 'nt', md(o.note || ''));
    mid.appendChild(pill);
    mid.appendChild(note);
    Object.assign(mid.style, { left: `${cx - 210}px`, top: `${cy - 92}px` });
    parent.appendChild(mid);

    return { cards, arcs, heads, mid, pill, note, dot, track, color, cx, cy, r };
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

    const CY = 630, R = 280;
    const before = K.abcCycle(stage, {
      cx: 520, cy: CY, r: R, variant: 'red',
      captions: ['Other dog too close', 'Bark and lunge', 'Space is given'],
      label: 'Before training',
      note: 'Barking works,<br>so it comes back.',
    });
    const during = K.abcCycle(stage, {
      cx: 1400, cy: CY, r: R, variant: 'green',
      captions: ['More distance', 'Looks at you', 'Space is given'],
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
