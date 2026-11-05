// Shared parts for chapter 3 (the ABCs of behavior). Scene files use them through window.C3.
//   C3.css(stage)                       inject the .c3- styles (once per scene)
//   C3.head(ctx, text, o)               green heading with accent bar, revealed at the start
//   C3.COL                              colours: A, B, C letters, emotion, function
//   C3.strip(stage, o)                  photo ABC strip (K.abc) that fills panel by panel: S.show(tl, i, t)
//   C3.fnTag(parent, icon, value, x, y) "Possible function" tag; icon 'in' / 'out' draws arrow pairs
//   C3.qBadge(parent, cx, cy)           round amber question badge
//   C3.cycle(svgParent, cx, cy, r, o)   A, B, C nodes on a ring with arrows (clockwise A to B to C and back to A)
//   C3.tile(parent, letter, x, y, size, col)   a big rounded letter tile
// Timing helpers come from C1 (sayAt, clamp); pills and the dog from C2.
(() => {
  const C = Object.assign({}, C1.C);
  const COL = { A: '#4b5a1e', B: '#619537', C: '#2c4a17', emo: '#8b5d8f', emoPale: '#f1e7f2', fn: '#3f6b22', dirt: '#b99a68', dirtDeep: '#9c7c4b' };

  const CSS = `
  .c3-layer { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
  .c3-tile { position: absolute; border-radius: 28px; display: grid; place-items: center; color: #fff; font: 800 120px/1 var(--font-head);
    box-shadow: 0 16px 34px rgba(40,60,20,0.22); border: 6px solid #fff; }
  .c3-node { position: absolute; border-radius: 50%; display: grid; place-items: center; color: #fff; font: 800 64px/1 var(--font-head);
    border: 6px solid #fff; box-shadow: 0 12px 28px rgba(40,60,20,0.24); }
  .c3-card { position: absolute; background: #fff; border-radius: 26px; box-shadow: var(--shadow-soft); border: 1px solid #e6e9e1; box-sizing: border-box; }
  .c3-def { position: absolute; display: flex; align-items: center; gap: 28px; padding: 26px 40px 26px 26px; background: #fff; border-radius: 26px;
    border: 1px solid #e6e9e1; box-shadow: var(--shadow-soft); box-sizing: border-box; }
  .c3-def .lt { flex: 0 0 auto; width: 104px; height: 104px; border-radius: 22px; display: grid; place-items: center; color: #fff; font: 800 64px/1 var(--font-head); }
  .c3-def .tx { display: flex; flex-direction: column; gap: 8px; }
  .c3-def .w { font: 700 44px/1.05 var(--font-head); color: var(--ink); white-space: nowrap; }
  .c3-def .d { font: 500 32px/1.25 var(--font-body); color: var(--ink-soft); }
  .c3-def .d b { color: var(--green-dark); font-weight: 700; }
  .c3-big { position: absolute; font: 700 54px/1.15 var(--font-head); color: var(--ink); white-space: nowrap; }
  .c3-big b { color: var(--green); font-weight: 700; }
  .c3-big i { color: var(--red); font-style: normal; }
  .c3-mid { position: absolute; font: 600 36px/1.25 var(--font-head); color: var(--ink); }
  .c3-mid b { color: var(--green); font-weight: 700; }
  .c3-lab { position: absolute; font: 600 30px/1.2 var(--font-body); color: var(--ink-soft); white-space: nowrap; }
  .c3-lab b { color: var(--ink); }
  .c3-tag { position: absolute; display: flex; align-items: center; gap: 24px; background: #fff; border-radius: 24px; padding: 12px 40px 12px 12px;
    box-shadow: var(--shadow-soft); border: 3px solid var(--green-light); white-space: nowrap; }
  .c3-tag .ib { width: 76px; height: 76px; border-radius: 18px; background: var(--green); color: #fff; display: grid; place-items: center; flex: 0 0 auto; }
  .c3-tag .ib svg { overflow: visible; }
  .c3-tag .ib svg.lu { width: 44px; height: 44px; }
  .c3-tag .v { font: 600 38px/1.1 var(--font-head); color: var(--ink); }
  .c3-tag .v b { font-weight: 700; color: var(--green-dark); margin-right: 12px; }
  .c3-q { position: absolute; width: 110px; height: 110px; border-radius: 50%; background: var(--amber); color: #fff; border: 7px solid #fff;
    display: grid; place-items: center; font: 700 64px/1 var(--font-head); box-shadow: 0 14px 30px rgba(140,90,20,0.28); }
  .c3-ask { position: absolute; display: flex; align-items: center; gap: 22px; padding: 14px 40px 14px 14px; border-radius: 999px; background: var(--amber-pale);
    border: 3px solid #f1dcb4; font: 700 40px/1 var(--font-head); color: #8a5410; white-space: nowrap; box-shadow: var(--shadow-soft); }
  .c3-ask .qi { width: 64px; height: 64px; border-radius: 50%; background: var(--amber); color: #fff; display: grid; place-items: center; font: 700 42px/1 var(--font-head); }
  .c3-row { position: absolute; display: flex; align-items: center; gap: 22px; font: 600 34px/1.2 var(--font-body); color: var(--ink); white-space: nowrap; }
  .c3-row .ic { width: 62px; height: 62px; border-radius: 50%; display: grid; place-items: center; flex: 0 0 auto; background: var(--green); color: #fff; }
  .c3-row .ic svg { width: 34px; height: 34px; stroke-width: 2.6; }
  .c3-row .ic.lt { font: 800 34px/1 var(--font-head); }
  .c3-row b { color: var(--green-dark); }
  .c3-strip .abc-col .panel { background: rgba(255,255,255,0.8); }
  .c3-strip .abc-col .cap { font-size: 26px; min-height: 92px; }
  .c3-strip .abc-col .letter { font-size: 70px; }
  .c3-strip .abc-col .word { font-size: 28px; }
  .c3-chip { position: absolute; display: inline-flex; align-items: center; gap: 12px; padding: 10px 24px 10px 12px; border-radius: 999px; background: #fff;
    border: 3px solid var(--line); font: 700 30px/1 var(--font-body); color: var(--ink); white-space: nowrap; box-shadow: var(--shadow-soft); }
  .c3-chip .ic { width: 46px; height: 46px; border-radius: 50%; display: grid; place-items: center; background: var(--green); color: #fff; flex: 0 0 auto; }
  .c3-chip .ic svg { width: 26px; height: 26px; stroke-width: 2.5; }
  .c3-chip.noic { padding: 12px 26px; }
  .c3-abcdef { position: absolute; inset: 0; background: #fff; display: flex; align-items: center; justify-content: center; padding: 16px 20px;
    text-align: center; box-sizing: border-box; font: 600 32px/1.25 var(--font-body); color: var(--ink); }
  .c3-abcdef b { color: var(--green-dark); }
  .c3-abcdef i { font-style: normal; color: var(--ink-soft); font-weight: 500; }
  `;
  const css = stage => { if (!stage.querySelector('style[data-c3]')) { const s = K.el('style', null, CSS); s.dataset.c3 = '1'; stage.appendChild(s); } };

  const put = C2.put;
  function layer(stage) { const d = K.el('div', 'c3-layer'); stage.appendChild(d); return d; }

  function head(ctx, text, o = {}) {
    const h = K.heading(ctx.stage, text, { x: 100, y: o.y ?? 110, w: o.w ?? 1440, size: o.size ?? 68, barGap: 18 });
    A.in(ctx.tl, h.all, o.t ?? 0.05, 'fadeUp', { dur: 0.7, stagger: 0.1 });
    return h;
  }

  function tile(parent, letter, x, y, size, col) {
    const n = K.el('div', 'c3-tile', letter);
    Object.assign(n.style, { left: x + 'px', top: y + 'px', width: size + 'px', height: size + 'px', background: col, fontSize: Math.round(size * 0.62) + 'px' });
    parent.appendChild(n);
    return n;
  }
  function node(parent, letter, cx, cy, d, col) {
    const n = K.el('div', 'c3-node', letter);
    Object.assign(n.style, { left: cx - d / 2 + 'px', top: cy - d / 2 + 'px', width: d + 'px', height: d + 'px', background: col, fontSize: Math.round(d * 0.5) + 'px' });
    parent.appendChild(n);
    return n;
  }

  /** Definition card: a letter square and a word + description. */
  function def(parent, letter, col, word, desc, x, y, w) {
    const n = K.el('div', 'c3-def');
    Object.assign(n.style, { left: x + 'px', top: y + 'px', width: w + 'px' });
    const lt = K.el('div', 'lt', letter);
    lt.style.background = col;
    if (letter.length > 1) lt.style.fontSize = '30px';
    n.appendChild(lt);
    const tx = K.el('div', 'tx');
    tx.appendChild(K.el('div', 'w', K.md(word)));
    tx.appendChild(K.el('div', 'd', K.md(desc)));
    n.appendChild(tx);
    parent.appendChild(n);
    return n;
  }

  function chip(parent, icon, html, x, y, o = {}) {
    const n = K.el('div', 'c3-chip' + (icon ? '' : ' noic'));
    if (icon) {
      const ic = K.el('div', 'ic');
      if (o.col) ic.style.background = o.col;
      ic.appendChild(K.icon(icon));
      n.appendChild(ic);
    }
    n.appendChild(K.el('span', null, K.md(html)));
    Object.assign(n.style, { left: x + 'px', top: y + 'px' });
    if (o.border) n.style.borderColor = o.border;
    if (o.size) n.style.fontSize = o.size + 'px';
    parent.appendChild(n);
    if (o.center) gsap.set(n, { xPercent: -50 });
    return n;
  }

  /** Row with a round icon (or letter) and text. */
  function row(parent, icon, html, x, y, o = {}) {
    const r = K.el('div', 'c3-row');
    const ic = K.el('div', 'ic' + (o.letter ? ' lt' : ''));
    if (o.col) ic.style.background = o.col;
    if (o.letter) ic.textContent = o.letter; else ic.appendChild(K.icon(icon));
    r.appendChild(ic);
    r.appendChild(K.el('span', null, K.md(html)));
    Object.assign(r.style, { left: x + 'px', top: y + 'px' });
    if (o.size) r.style.fontSize = o.size + 'px';
    parent.appendChild(r);
    return r;
  }

  // ------------------------------------------------------------------ photo ABC strip that fills in step by step
  function strip(stage, o) {
    const wrap = layer(stage);
    wrap.classList.add('c3-strip');
    const S = K.abc(wrap, { x: o.x ?? 140, y: o.y ?? 250, w: o.w ?? 1640, panels: o.panels, captions: o.captions, label: o.label, labelVariant: o.labelVariant, gap: o.gap ?? 70, panelH: o.panelH });
    S.wrap = wrap;
    S.cols.forEach(c => { gsap.set([c.head, c.img], { opacity: 0 }); if (c.cap) gsap.set(c.cap, { opacity: 0 }); });
    gsap.set(S.arrows, { opacity: 0 });
    if (S.label) gsap.set(S.label, { opacity: 0 });
    // o.defs: the frames open with the ABC definitions in white, and each photo replaces its definition (Tori, round 6)
    const DEFS = ['The thing that happens + <b>the context</b> around it', 'What the dog does<br><i>e.g. barking, lunging</i>', 'What happens <b>as a result</b>'];
    S.defs = o.defs ? S.cols.map((c, k) => { const n = K.el('div', 'c3-abcdef', `<div>${DEFS[k]}</div>`); c.panel.appendChild(n); return n; }) : null;
    S.frames = (tl, t) => {
      if (S.label) tl.fromTo(S.label, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', immediateRender: false }, t);
      tl.fromTo(S.cols.map(c => c.panel), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' }, t + 0.1);
      if (S.defs) {
        tl.fromTo(S.cols.map(c => c.head), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, immediateRender: false }, t + 0.2);
        tl.fromTo(S.arrows, { opacity: 0 }, { opacity: 1, duration: 0.4, immediateRender: false }, t + 0.5);
      }
    };
    S.show = (tl, i, t) => {
      const c = S.cols[i];
      if (S.defs) tl.to(S.defs[i], { opacity: 0, duration: 0.6 }, t + 0.1);
      else tl.fromTo(c.head, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', immediateRender: false }, t);
      tl.fromTo(c.img, { opacity: 0, scale: 1.12 }, { opacity: 1, scale: 1, duration: 1.0, ease: 'power2.out', immediateRender: false }, t);
      if (c.cap) {
        const inner = c.cap;
        tl.fromTo(inner, { opacity: 0 }, { opacity: 1, duration: 0.5, immediateRender: false }, t + 0.3);
        tl.fromTo(inner, { y: 14 }, { y: 0, duration: 0.5, ease: 'power3.out', immediateRender: false }, t + 0.3);
      }
      if (i > 0 && !S.defs) tl.fromTo(S.arrows[i - 1], { opacity: 0, x: -16 }, { opacity: 1, x: 0, duration: 0.4, ease: 'power3.out', immediateRender: false }, t - 0.2);
    };
    // the arrow centre between panel i and i+1 on the stage
    S.arrowPt = i => { const a = S.arrows[i]; return [parseFloat(a.style.left) + 23, parseFloat(a.style.top) + 23]; };
    S.colX = i => parseFloat(S.cols[i].root.style.left);
    return S;
  }

  // arrow pairs for in (toward each other) / out (away from each other); svg drawn in an icon box
  function arrows(parent, inward, color, size = 64, sw = 10) {
    const s = K.svgEl('svg', { viewBox: '0 0 64 64', width: size, height: size }, parent);
    s.style.overflow = 'visible';
    const g = K.group(s, { fill: 'none', stroke: color, 'stroke-width': sw * 0.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
    const L = K.group(g), R = K.group(g);
    if (inward) {
      K.path(L, 'M 4 32 L 26 32 M 16 22 L 26 32 L 16 42', { stroke: color, 'stroke-width': sw * 0.6 });
      K.path(R, 'M 60 32 L 38 32 M 48 22 L 38 32 L 48 42', { stroke: color, 'stroke-width': sw * 0.6 });
    } else {
      K.path(L, 'M 26 32 L 4 32 M 14 22 L 4 32 L 14 42', { stroke: color, 'stroke-width': sw * 0.6 });
      K.path(R, 'M 38 32 L 60 32 M 50 22 L 60 32 L 50 42', { stroke: color, 'stroke-width': sw * 0.6 });
    }
    return { s, L, R, inward };
  }
  function nudge(tl, ar, t, n = 2) {
    const d = ar.inward ? 6 : -6;
    tl.fromTo(ar.L, { x: 0 }, { x: d, duration: 0.3, yoyo: true, repeat: n * 2 - 1, ease: 'sine.inOut', immediateRender: false }, t);
    tl.fromTo(ar.R, { x: 0 }, { x: -d, duration: 0.3, yoyo: true, repeat: n * 2 - 1, ease: 'sine.inOut', immediateRender: false }, t);
  }

  /** "Possible function" tag, centred on cx. icon: 'in', 'out' or a Lucide name. */
  function fnTag(parent, icon, value, cx, y, label = 'Possible function:') {
    const t = K.el('div', 'c3-tag');
    const ib = K.el('div', 'ib');
    t.appendChild(ib);
    let ar = null;
    if (icon === 'in' || icon === 'out') ar = arrows(ib, icon === 'in', '#fff', 60, 10);
    else ib.appendChild(K.icon(icon, { stroke: 2.6, cls: 'lu' }));
    t.appendChild(K.el('div', 'v', `<b>${label}</b>${K.md(value)}`));
    Object.assign(t.style, { left: cx + 'px', top: y + 'px' });
    parent.appendChild(t);
    gsap.set(t, { xPercent: -50 });
    return {
      t, ar,
      show(tl, at) {
        tl.fromTo(t, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, at);
        tl.fromTo(ib, { scale: 0.5 }, { scale: 1, duration: 0.6, ease: 'back.out(2)', immediateRender: false }, at + 0.2);
        if (ar) nudge(tl, ar, at + 0.7, 3);
      },
    };
  }

  function qBadge(parent, cx, cy, d = 110) {
    const q = K.el('div', 'c3-q', '?');
    Object.assign(q.style, { left: cx - d / 2 + 'px', top: cy - d / 2 + 'px', width: d + 'px', height: d + 'px', fontSize: Math.round(d * 0.58) + 'px' });
    parent.appendChild(q);
    return q;
  }
  function ask(parent, text, cx, y) {
    const n = K.el('div', 'c3-ask');
    const qi = K.el('div', 'qi', '?');
    n.appendChild(qi);
    n.appendChild(K.el('span', null, K.md(text)));
    Object.assign(n.style, { left: cx + 'px', top: y + 'px' });
    parent.appendChild(n);
    gsap.set(n, { xPercent: -50 });
    return n;
  }

  // ------------------------------------------------------------------ the ABC ring: A top, B lower right, C lower left
  function cycle(stage, cx, cy, r, o = {}) {
    const d = o.d ?? 150;
    const svg = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const ANG = [-90, 30, 150];
    const pt = a => [cx + r * Math.cos(a * Math.PI / 180), cy + r * Math.sin(a * Math.PI / 180)];
    const gapDeg = (d / 2 + 22) / r * 180 / Math.PI; // keep arcs clear of the node circles
    const arcs = [], heads = [];
    for (let k = 0; k < 3; k++) {
      const a0 = ANG[k] + gapDeg, a1 = ANG[k] + 120 - gapDeg;
      const [x0, y0] = pt(a0), [x1, y1] = pt(a1);
      const col = o.arcCol ? o.arcCol(k) : C.greenLight;
      const p = K.path(svg, `M ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1}`, { stroke: col, 'stroke-width': o.sw ?? 12 });
      const tang = a1 + 90;
      const hd = K.path(svg, 'M -16 -16 L 4 0 L -16 16', { stroke: col, 'stroke-width': o.sw ?? 12, transform: `translate(${x1} ${y1}) rotate(${tang})` });
      arcs.push(p);
      heads.push(hd);
    }
    const cols = o.cols || [COL.A, COL.B, COL.C];
    const nodes = ['A', 'B', 'C'].map((L, k) => { const [x, y] = pt(ANG[k]); return { el: node(stage, L, x, y, d, cols[k]), x, y }; });
    return { svg, arcs, heads, nodes, pt, ANG };
  }

  window.C3 = { C, COL, CSS, css, put, layer, head, tile, node, def, chip, row, strip, arrows, nudge, fnTag, qBadge, ask, cycle };
})();
