// Shared parts for chapter 2 (the baseline): the pot of water and small builders used by the chapter 2 scenes.
// Scene files use them through window.C2. CSS classes are prefixed .c2- and injected with C2.style(stage).
//
//   C2.AREAS                          the four areas {name, short, icon, col}, in chapter order
//   C2.makePot(stage, {cx, y, s, level, bracket})   glass pot; (cx, y) is the centre of its rim on the stage
//     P.setLevel(tl, level, t, dur)   water rises or falls (0 = empty, 1 = brim); returns the end time
//     P.drip(tl, sx, sy, t, col)      a drop falls from stage point (sx, sy) into the water, with a ripple; returns landing time
//     P.addToken(icon, col, x, y)     a chip that floats in the water (local x; y below the surface)
//     P.dropToken(tl, tok, t)         that chip falls in from above and bobs; returns landing time
//     P.liftToken(tl, tok, t)         the chip lifts out of the water and fades
//     P.follow(el, mode, dx, dy)      keep an html element beside the waterline ('surface') or the room bracket ('mid')
//     P.waves(tl, t0, t1)             gentle surface motion
//   C2.areaHead(ctx, k, title, size)  heading with the area's round badge in front of it
//   C2.dog(parent, cx, cy, s)         side-view dog (svg), from chapter 1's ABC close
//   plus pill, badge, put, bookmark, C (colours); C1.sayAt / C1.clamp are used for timing
(() => {
  const C = Object.assign({}, window.C1 ? C1.C : {}, {
    water: '#5fa8cf', waterDeep: '#2f7fae', waterTop: '#a9d6ec', glass: '#f4f9f1', rim: '#3f6b22',
  });

  // two dog paw prints (Lucide line style), for activity and natural needs
  if (window.ICONS && window.ICONS['paw-print'] && !window.ICONS.paws) {
    const pp = window.ICONS['paw-print'];
    window.ICONS.paws = `<g transform="translate(-0.5 9.5) scale(0.6)" stroke-width="3.4">${pp}</g><g transform="translate(10 -0.5) scale(0.6)" stroke-width="3.4">${pp}</g>`;
  }

  const AREAS = [
    { name: 'Physical Health', short: 'Physical health', icon: 'heart-pulse', col: '#b8452d' },
    { name: 'Activity, Stimulation & Natural Needs', short: 'Activity and needs', icon: 'paws', col: '#4a6fa5' },
    { name: 'Emotions & Recovery', short: 'Emotions and recovery', icon: 'brain', col: '#7a8f2e' },
    { name: 'Environment, Predictability & Choice', short: 'Environment and choice', icon: 'house', col: '#3f6b22' },
  ];

  const R = 230, RY = 42, H = 330, IN = 14; // outer radius, rim ellipse ry, body height, glass thickness
  const RI = R - IN;
  let uid = 0;

  const CSS = `
  .c2-layer { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
  .c2-pot { position: absolute; overflow: visible; }
  .c2-pot svg { overflow: visible; position: absolute; left: 0; top: 0; }
  .c2-ah { position: absolute; display: flex; align-items: center; gap: 28px; }
  .c2-ah .bd { width: 96px; height: 96px; border-radius: 50%; display: grid; place-items: center; color: #fff; flex: 0 0 auto; box-shadow: 0 10px 24px rgba(40,60,20,0.18); }
  .c2-ah .bd svg { width: 54px; height: 54px; stroke-width: 2.2; }
  .c2-ah .tt { font: 700 76px/1.05 var(--font-head); color: var(--green); white-space: nowrap; letter-spacing: -0.5px; }
  .c2-ah .bar { position: absolute; left: 124px; bottom: -30px; width: 118px; height: 9px; border-radius: 2px; background: var(--green-light); }
  .c2-pill { position: absolute; display: inline-flex; align-items: center; gap: 16px; padding: 10px 30px 10px 10px; border-radius: 999px; background: #fff;
    box-shadow: var(--shadow-soft); border: 1px solid #e6e9e1; font: 700 32px/1 var(--font-body); color: var(--ink); white-space: nowrap; }
  .c2-pill.noic { padding: 16px 30px; }
  .c2-pill .ic { width: 54px; height: 54px; border-radius: 50%; display: grid; place-items: center; color: #fff; background: var(--green); flex: 0 0 auto; }
  .c2-pill .ic svg { width: 30px; height: 30px; stroke-width: 2.3; }
  .c2-pill.green { background: var(--green); color: #fff; border-color: var(--green); }
  .c2-pill.green .ic { background: rgba(255,255,255,0.22); }
  .c2-pill.amber { background: var(--amber-pale); color: #8a5410; border-color: #f1dcb4; }
  .c2-pill.amber .ic { background: var(--amber); }
  .c2-pill.red { background: #fff; color: var(--red); border: 3px solid var(--red); }
  .c2-pill.red .ic { background: var(--red); }
  .c2-pill.pale { background: var(--green-pale); color: var(--green-deep); border-color: var(--green-pale); box-shadow: none; }
  .c2-badge { position: absolute; border-radius: 50%; display: grid; place-items: center; }
  .c2-badge svg { width: 54%; height: 54%; stroke-width: 2.1; }
  .c2-big { position: absolute; font: 600 54px/1.16 var(--font-head); color: var(--ink); white-space: nowrap; }
  .c2-big b { color: var(--green); font-weight: 700; }
  .c2-lab { position: absolute; font: 600 30px/1.2 var(--font-body); color: var(--ink-soft); white-space: nowrap; }
  .c2-card { position: absolute; background: #fff; border-radius: 26px; box-shadow: var(--shadow-soft); border: 1px solid #e6e9e1; }
  .c2-mark { position: absolute; display: inline-flex; align-items: center; gap: 14px; padding: 12px 26px 12px 16px; border-radius: 16px;
    background: var(--green-deep); color: #fff; font: 700 28px/1 var(--font-body); white-space: nowrap; box-shadow: 0 10px 24px rgba(44,74,23,0.24); }
  .c2-mark svg { width: 30px; height: 30px; stroke-width: 2.4; }
  .c2-q { position: absolute; width: 120px; height: 120px; border-radius: 50%; background: var(--amber); color: #fff; border: 7px solid #fff;
    display: grid; place-items: center; font: 700 70px/1 var(--font-head); box-shadow: 0 14px 30px rgba(140,90,20,0.28); }
  .c2-close { position: absolute; left: 0; width: 1920px; text-align: center; white-space: nowrap; font: 600 42px/1.2 var(--font-body); color: var(--green-dark); letter-spacing: 0.5px; }
  .c2-halo { position: absolute; border-radius: 50%; background: radial-gradient(closest-side, rgba(232,241,220,0.95), rgba(232,241,220,0.55) 55%, rgba(232,241,220,0) 100%); }
  `;
  const style = stage => stage.appendChild(K.el('style', null, CSS));

  // ------------------------------------------------------------------ small builders
  /** Full-canvas group so a whole view can be faded at once. With (tl, t) it stays hidden until t. */
  function layer(stage, tl, t) {
    const d = K.el('div', 'c2-layer');
    stage.appendChild(d);
    if (tl) tl.fromTo(d, { opacity: 0 }, { opacity: 1, duration: 0.05 }, Math.max(0, t - 0.05));
    return d;
  }
  function put(parent, cls, html, o) {
    const n = K.el('div', cls, html == null ? null : K.md(html));
    n.style.left = o.x + 'px';
    n.style.top = o.y + 'px';
    if (o.w) n.style.width = o.w + 'px';
    if (o.h) n.style.height = o.h + 'px';
    if (o.size) n.style.fontSize = o.size + 'px';
    if (o.color) n.style.color = o.color;
    if (o.align) n.style.textAlign = o.align;
    parent.appendChild(n);
    return n;
  }
  /** Pill with an optional round icon. o: {x, y, variant, col (icon circle colour), center (x is the centre)} */
  function pill(parent, icon, html, o = {}) {
    const n = K.el('div', 'c2-pill' + (icon ? '' : ' noic') + (o.variant ? ' ' + o.variant : ''));
    if (icon) {
      const ic = K.el('div', 'ic');
      if (o.col) ic.style.background = o.col;
      ic.appendChild(K.icon(icon));
      n.appendChild(ic);
    }
    n.appendChild(K.el('span', null, K.md(html)));
    if (o.size) n.style.fontSize = o.size + 'px';
    if (o.x != null) Object.assign(n.style, { left: o.x + 'px', top: o.y + 'px' });
    parent.appendChild(n);
    if (o.center) gsap.set(n, { xPercent: -50 });
    return n;
  }
  /** Round icon badge centred on (cx, cy). */
  function badge(parent, name, cx, cy, size, bg, fg) {
    const b = K.el('div', 'c2-badge');
    Object.assign(b.style, { left: cx - size / 2 + 'px', top: cy - size / 2 + 'px', width: size + 'px', height: size + 'px', background: bg, color: fg });
    b.appendChild(K.icon(name));
    parent.appendChild(b);
    return b;
  }
  /** Small dark tag with a bookmark icon ("We'll come back to this"). */
  function bookmark(parent, text, x, y, icon = 'bookmark') {
    const n = K.el('div', 'c2-mark');
    n.appendChild(K.icon(icon));
    n.appendChild(K.el('span', null, K.md(text)));
    Object.assign(n.style, { left: x + 'px', top: y + 'px' });
    parent.appendChild(n);
    return n;
  }
  /** Lucide icon inside an svg, centred on (x, y). */
  function svgIcon(parent, name, x, y, size, attrs = {}) {
    const k = size / 24;
    const outer = K.group(parent);
    const g = K.group(outer, Object.assign({ transform: `translate(${x - size / 2} ${y - size / 2}) scale(${k})`, fill: 'none', stroke: C.ink, 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, attrs));
    g.innerHTML = (window.ICONS || {})[name] || '';
    return outer;
  }

  /** Area heading: round badge in the area colour, then the title, with the accent bar under the title. */
  function areaHead(ctx, k, title, size = 76) {
    const { stage, tl } = ctx;
    const a = AREAS[k];
    const n = K.el('div', 'c2-ah');
    Object.assign(n.style, { left: '100px', top: '112px' });
    const bd = K.el('div', 'bd');
    bd.style.background = a.col;
    bd.appendChild(K.icon(a.icon));
    const tt = K.el('div', 'tt', K.md(title || a.name));
    tt.style.fontSize = size + 'px';
    const bar = K.el('div', 'bar');
    [bd, tt, bar].forEach(x => n.appendChild(x));
    stage.appendChild(n);
    A.in(tl, bd, 0.05, 'pop', { dur: 0.6 });
    A.in(tl, tt, 0.15, 'fadeUp', { dur: 0.7 });
    A.in(tl, bar, 0.4, 'grow', { dur: 0.6 });
    return { root: n, bd, tt, bar };
  }

  // ------------------------------------------------------------------ the pot
  // pot-local coordinates: origin at the centre of the rim; y grows downward; the inside bottom is at y = H
  const surfY = L => H - L * H; // waterline for level L (0..1)
  const BODY = `M ${-R} 0 L ${-R} ${H - 30} C ${-R} ${H + 20} ${-R + 60} ${H + RY} 0 ${H + RY} C ${R - 60} ${H + RY} ${R} ${H + 20} ${R} ${H - 30} L ${R} 0 Z`;
  const INNER = `M ${-RI} -2000 L ${-RI} ${H - 32} C ${-RI} ${H + 10} ${-RI + 56} ${H + RY - 12} 0 ${H + RY - 12} C ${RI - 56} ${H + RY - 12} ${RI} ${H + 10} ${RI} ${H - 32} L ${RI} -2000 Z`;

  /**
   * Glass cooking pot with water. o: {cx, y (rim centre on stage), s (scale), level (0..1), bracket (show the room bracket)}
   */
  function makePot(stage, o) {
    const s = o.s ?? 1, id = 'c2p' + ++uid;
    const VX = 420, VT = 300, VW = 840, VH = 760;
    const wrap = K.el('div', 'c2-pot');
    Object.assign(wrap.style, { left: o.cx - VX * s + 'px', top: o.y - VT * s + 'px', width: VW * s + 'px', height: VH * s + 'px', transformOrigin: `${VX * s}px ${VT * s + H * s / 2}px` });
    stage.appendChild(wrap);
    const svg = K.svgEl('svg', { viewBox: `${-VX} ${-VT} ${VW} ${VH}`, width: VW * s, height: VH * s }, wrap);
    const defs = K.svgEl('defs', {}, svg);
    defs.innerHTML = `
      <linearGradient id="${id}w" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${C.water}"/><stop offset="1" stop-color="${C.waterDeep}"/>
      </linearGradient>
      <linearGradient id="${id}g" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0.55"/><stop offset="0.18" stop-color="#ffffff" stop-opacity="0.12"/>
        <stop offset="0.8" stop-color="#ffffff" stop-opacity="0.05"/><stop offset="1" stop-color="#ffffff" stop-opacity="0.4"/>
      </linearGradient>
      <clipPath id="${id}c"><path d="${INNER}"/></clipPath>
      <filter id="${id}f" x="-50%" y="-300%" width="200%" height="700%"><feGaussianBlur stdDeviation="10"/></filter>
      <filter id="${id}t" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#10304a" flood-opacity="0.28"/></filter>`;
    // floor shadow, then handles, the back of the glass, the water, the front of the glass
    K.svgEl('ellipse', { cx: 0, cy: H + RY + 18, rx: R - 10, ry: 22, fill: C.greenDeep, opacity: 0.18, filter: `url(#${id}f)` }, svg);
    const body = K.group(svg);
    [-1, 1].forEach(k => K.path(body, `M ${k * (R - 4)} 46 C ${k * (R + 64)} 40 ${k * (R + 70)} 108 ${k * (R - 4)} 112`, { stroke: C.rim, 'stroke-width': 18, fill: 'none' }));
    K.path(body, BODY, { fill: C.glass, stroke: 'none', opacity: 0.9 });
    K.svgEl('ellipse', { cx: 0, cy: 0, rx: R, ry: RY, fill: '#e9f1e2', stroke: 'none' }, body);
    // ruler ticks on the back wall (seen through the water)
    const ticks = K.group(body);
    for (let k = 1; k < 10; k++) {
      const y = surfY(k / 10);
      K.line(ticks, -RI + 18, y, -RI + (k % 5 === 0 ? 64 : 42), y, { stroke: '#b9c6ad', 'stroke-width': 4 });
    }
    const clip = K.group(svg, { 'clip-path': `url(#${id}c)` });
    const water = K.group(clip);
    const wBody = K.rect(water, -R, 0, 2 * R, H + 120, { fill: `url(#${id}w)`, opacity: 0.92 });
    const wTop = K.svgEl('ellipse', { cx: 0, cy: 0, rx: RI, ry: RY - 8, fill: C.waterTop, stroke: '#d4ecf6', 'stroke-width': 4 }, water);
    const wave = K.path(water, 'M -520 4 q 40 -12 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0', { stroke: '#ffffff', 'stroke-width': 5, opacity: 0.55, fill: 'none' });
    const tokG = K.group(water);
    const rip = K.group(water);
    const ingG = K.group(clip);
    // front of the glass: sheen, outline, rim
    const front = K.group(svg);
    K.path(front, BODY, { fill: `url(#${id}g)`, stroke: C.rim, 'stroke-width': 8 });
    K.path(front, `M ${-R + 34} 70 L ${-R + 34} ${H - 40}`, { stroke: '#ffffff', 'stroke-width': 14, opacity: 0.55 });
    K.path(front, `M ${-R + 62} 90 L ${-R + 62} ${H * 0.5}`, { stroke: '#ffffff', 'stroke-width': 6, opacity: 0.4 });
    K.svgEl('ellipse', { cx: 0, cy: 0, rx: R, ry: RY, fill: 'none', stroke: C.rim, 'stroke-width': 16 }, front);
    K.path(front, `M ${-R + 20} 8 A ${R - 20} ${RY - 8} 0 0 0 ${R - 20} 8`, { stroke: '#8fbf62', 'stroke-width': 5, fill: 'none', opacity: 0.8 });

    // room bracket: from the rim down to the waterline, outside the right handle
    const BX = R + 96;
    const br = K.group(svg, { opacity: o.bracket ? 1 : 0 });
    const brLine = K.path(br, '', { stroke: C.greenDark, 'stroke-width': 7, fill: 'none' });
    const brDash = K.path(br, '', { stroke: C.greenDark, 'stroke-width': 3, fill: 'none', 'stroke-dasharray': '10 10', opacity: 0.6 });

    const P = { wrap, svg, body, water, wBody, wTop, wave, tokG, rip, front, br, s, cx: o.cx, y: o.y, R, H, L: o.level ?? 0.5, followers: [], tokens: [], ing: [] };
    // Chapter 1's eight ingredients are already in the pot: they float just under the surface and ride the waterline
    // up and down; when the water is low they rest on the bottom
    if (o.ingredients !== false && window.C1) {
      const SPOT = [[-150, 40, 286], [-50, 30, 292], [50, 42, 288], [150, 32, 284], [-100, 92, 322], [0, 100, 326], [100, 90, 322], [-178, 96, 312]];
      C1.ING.forEach((g, k) => {
        const outer = K.group(ingG);
        const mid = K.group(outer);
        const inner = K.group(mid);
        K.circle(inner, 0, 0, 30, { fill: g.col, stroke: '#fff', 'stroke-width': 4, filter: `url(#${id}t)` });
        svgIcon(inner, g.icon, 0, 0, 32, { stroke: '#fff', 'stroke-width': 2.3 });
        const [x, depth, rest] = SPOT[k];
        P.ing.push({ outer, mid, inner, x, depth, rest });
      });
    }
    const proxy = { L: P.L };
    P.toStage = (lx, ly) => [o.cx + lx * s, o.y + ly * s];
    P.surfaceStageY = (L = P.L) => o.y + surfY(L) * s;
    function render() {
      const y = surfY(proxy.L);
      water.setAttribute('transform', `translate(0 ${y})`);
      water.setAttribute('opacity', Math.min(1, proxy.L / 0.04));
      P.ing.forEach(t => t.outer.setAttribute('transform', `translate(${t.x} ${Math.min(y + t.depth, t.rest)})`));
      brLine.setAttribute('d', `M ${BX - 18} 0 L ${BX + 18} 0 M ${BX} 0 L ${BX} ${y} M ${BX - 18} ${y} L ${BX + 18} ${y}`);
      brDash.setAttribute('d', `M ${R + 8} ${y} L ${BX - 24} ${y}`);
      P.followers.forEach(f => {
        const sy = f.mode === 'mid' ? o.y + (y / 2) * s : o.y + y * s;
        f.el.style.top = sy + f.dy + 'px';
      });
    }
    P.render = render;
    render();
    /** Keep el beside the waterline (mode 'surface') or the middle of the room bracket (mode 'mid'); el's left is fixed. */
    P.follow = (el, mode = 'mid', dy = 0) => { P.followers.push({ el, mode, dy }); render(); return el; };
    /** Stage x just right of the bracket (for labels). */
    P.bracketX = () => o.cx + (BX + 34) * s;
    P.setLevel = (tl, L, t, dur = 1.1, ease = 'power2.inOut') => {
      const from = P.L;
      tl.fromTo(proxy, { L: from }, { L, duration: dur, ease, immediateRender: false, onUpdate: render }, t);
      P.L = L;
      return t + dur;
    };
    P.waves = (tl, t0, t1) => {
      const per = 1.6, n = Math.max(1, Math.floor((t1 - t0) / per));
      tl.fromTo(wave, { x: 0 }, { x: -160, duration: per, ease: 'none', repeat: n - 1 }, t0);
      tl.fromTo(wTop, { attr: { ry: RY - 8 } }, { attr: { ry: RY - 12 }, duration: per / 2, ease: 'sine.inOut', yoyo: true, repeat: 2 * n - 1 }, t0);
      P.ing.forEach((t, k) => {
        const pk = 1.3 + (k % 3) * 0.14, st = t0 + k * 0.16, m = Math.max(1, Math.floor((t1 - st) / pk));
        tl.fromTo(t.inner, { y: -4, rotation: -5, svgOrigin: '0 0' }, { y: 4, rotation: 5, svgOrigin: '0 0', duration: pk, ease: 'sine.inOut', yoyo: true, repeat: m - 1 }, st);
      });
    };
    /** The ingredients drop into the pot from above (staggered), starting at t. Returns when the last one lands. */
    P.dropIng = (tl, t, from = -420) => {
      P.ing.forEach((g, k) => {
        tl.fromTo(g.mid, { y: from, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.in', immediateRender: true }, t + k * 0.1);
      });
      return t + (P.ing.length - 1) * 0.1 + 0.6;
    };
    /** Hide or show the ingredients (no animation). */
    P.ingOpacity = v => P.ing.forEach(g => gsap.set(g.mid, { opacity: v }));
    /** Ripple rings on the surface at t. */
    P.ripple = (tl, t, col = '#ffffff') => {
      [0, 0.18].forEach((d, i) => {
        const e = K.svgEl('ellipse', { cx: 0, cy: 0, rx: 30, ry: 7, fill: 'none', stroke: col, 'stroke-width': 5 - i, opacity: 0 }, rip);
        tl.fromTo(e, { attr: { rx: 30, ry: 7 }, opacity: 0.95 }, { attr: { rx: 170, ry: 30 }, opacity: 0, duration: 0.9, ease: 'power2.out', immediateRender: false }, t + d);
      });
    };
    /** A drop in colour col falls from stage point (sx, sy) into the water. Returns the landing time. */
    P.drip = (tl, sx, sy, t, col = C.water, dur = 0.85) => {
      const lx = (sx - o.cx) / s, ly = (sy - o.y) / s, ty = surfY(P.L) - 10;
      const top = Math.min(ly, 0) - 150; // arcs up over the rim, then drops in
      const d = K.group(svg);
      svg.insertBefore(d, front);
      K.path(d, 'M 0 -30 C 12 -12 20 -2 20 10 A 20 20 0 0 1 -20 10 C -20 -2 -12 -12 0 -30 Z', { fill: col, stroke: '#fff', 'stroke-width': 4 });
      gsap.set(d, { x: lx, y: ly, opacity: 0 });
      const t0 = t + 0.1;
      tl.fromTo(d, { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.25, immediateRender: false }, t);
      tl.fromTo(d, { x: lx }, { x: lx * 0.08, duration: dur, ease: 'power1.inOut', immediateRender: false }, t0);
      tl.fromTo(d, { y: ly }, { y: top, duration: dur * 0.4, ease: 'power2.out', immediateRender: false }, t0);
      tl.fromTo(d, { y: top }, { y: ty, duration: dur * 0.6, ease: 'power2.in', immediateRender: false }, t0 + dur * 0.4);
      tl.to(d, { opacity: 0, duration: 0.12 }, t0 + dur);
      P.ripple(tl, t0 + dur, col);
      return t0 + dur;
    };
    /** The reverse of a drip: a drop lifts off the surface and flies out to stage point (sx, sy), fading as it arrives. */
    P.lift = (tl, sx, sy, t, col = C.water, dur = 0.85) => {
      const lx = (sx - o.cx) / s, ly = (sy - o.y) / s, fy = surfY(P.L) - 10;
      const top = Math.min(ly, 0) - 150;
      const d = K.group(svg);
      svg.insertBefore(d, front);
      K.path(d, 'M 0 -30 C 12 -12 20 -2 20 10 A 20 20 0 0 1 -20 10 C -20 -2 -12 -12 0 -30 Z', { fill: col, stroke: '#fff', 'stroke-width': 4 });
      gsap.set(d, { x: 0, y: fy, opacity: 0 });
      P.ripple(tl, t, '#ffffff');
      tl.fromTo(d, { opacity: 0, scale: 0.5, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.2, immediateRender: false }, t);
      tl.fromTo(d, { x: 0 }, { x: lx, duration: dur, ease: 'power1.inOut', immediateRender: false }, t);
      tl.fromTo(d, { y: fy }, { y: top, duration: dur * 0.55, ease: 'power2.out', immediateRender: false }, t);
      tl.fromTo(d, { y: top }, { y: ly, duration: dur * 0.45, ease: 'power2.in', immediateRender: false }, t + dur * 0.55);
      tl.to(d, { opacity: 0, scale: 0.5, duration: 0.15 }, t + dur - 0.05);
      return t + dur;
    };
    /** A chip (icon in a coloured circle) that floats in the water at local x, `y` px under the surface. Hidden until dropped. */
    P.addToken = (icon, col, x, y = 70, r = 40) => {
      const outer = K.group(tokG);
      const inner = K.group(outer);
      K.circle(inner, 0, 0, r, { fill: col, stroke: '#fff', 'stroke-width': 5, filter: `url(#${id}t)` });
      svgIcon(inner, icon, 0, 0, r * 1.05, { stroke: '#fff', 'stroke-width': 2.3 });
      const ring = K.circle(outer, 0, 0, r + 12, { fill: 'none', stroke: C.green, 'stroke-width': 7, opacity: 0 });
      gsap.set(outer, { x, y, opacity: 0 });
      const tok = { outer, inner, ring, x, y, r, icon, col };
      P.tokens.push(tok);
      return tok;
    };
    /** Show a token already floating (no animation). */
    P.showToken = tok => gsap.set(tok.outer, { opacity: 1 });
    P.dropToken = (tl, tok, t, from = -560) => {
      tl.fromTo(tok.outer, { y: from, opacity: 0 }, { opacity: 1, duration: 0.2, immediateRender: false }, t);
      tl.fromTo(tok.outer, { y: from }, { y: tok.y, duration: 0.7, ease: 'power2.in', immediateRender: false }, t);
      P.ripple(tl, t + 0.55);
      tl.to(tok.inner, { y: 8, duration: 0.18, yoyo: true, repeat: 1, ease: 'power1.out' }, t + 0.7);
      return t + 0.7;
    };
    P.liftToken = (tl, tok, t) => {
      tl.to(tok.outer, { y: -520, duration: 0.9, ease: 'power2.in' }, t);
      tl.to(tok.outer, { opacity: 0, duration: 0.3 }, t + 0.6);
      P.ripple(tl, t + 0.05);
    };
    /** Floating chips bob gently from t0 to t1. */
    P.bob = (tl, t0, t1) => {
      P.tokens.forEach((tok, k) => {
        const per = 1.25 + (k % 3) * 0.12, st = t0 + k * 0.17;
        const n = Math.max(1, Math.floor((t1 - st) / per));
        tl.fromTo(tok.inner, { rotation: -4, transformOrigin: '50% 50%' }, { rotation: 4, duration: per, ease: 'sine.inOut', yoyo: true, repeat: n - 1 }, st);
      });
    };
    return P;
  }

  // ------------------------------------------------------------------ the dog (side view, facing right), as in chapter 1
  const DOG = '#3f6b22', DOG_FAR = '#2c4a17', DOG_EAR = '#2c4a17';
  /** Side-view dog. Local box x 46..399, y 36..300 (paws on y 297), centred on (cx, cy) at scale s. */
  function dog(parent, cx, cy, s) {
    const x = cx - 222 * s, y = cy - 168 * s;
    const outer = K.group(parent);
    const g = K.group(outer, { transform: `translate(${x} ${y}) scale(${s})` });
    K.svgEl('ellipse', { cx: 210, cy: 298, rx: 168, ry: 9, fill: DOG, opacity: 0.13 }, g);
    const fig = K.group(g);
    const tail = K.group(fig);
    K.path(tail, 'M 108 134 C 86 124 68 106 56 80', { stroke: DOG, 'stroke-width': 15, fill: 'none' });
    K.path(fig, 'M 140 160 C 132 194 142 216 154 234 L 148 286 C 147 294 152 297 160 297 L 178 297 C 183 297 183 291 176 289 L 168 287 L 174 238 C 182 216 192 194 190 166 Z', { fill: DOG_FAR, stroke: 'none' });
    K.path(fig, 'M 262 186 L 284 188 L 282 288 L 296 291 C 300 293 300 297 294 297 L 266 297 C 262 297 262 292 264 288 Z', { fill: DOG_FAR, stroke: 'none' });
    K.path(fig, 'M 100 146 C 100 120 128 112 168 114 L 268 110 C 300 108 322 122 328 146 C 334 178 320 208 288 212 C 244 216 206 198 172 196 C 140 196 104 190 100 146 Z', { fill: DOG, stroke: 'none' });
    K.path(fig, 'M 106 126 C 86 148 88 200 114 232 L 108 286 C 107 294 112 297 120 297 L 140 297 C 146 297 146 290 138 288 L 130 286 L 138 238 C 150 216 162 192 160 164 C 150 140 124 124 106 126 Z', { fill: DOG, stroke: 'none' });
    K.path(fig, 'M 290 176 L 316 180 L 312 286 L 330 290 C 334 292 334 297 328 297 L 294 297 C 290 297 290 292 292 288 Z', { fill: DOG, stroke: 'none' });
    const head = K.group(fig);
    K.path(head, 'M 262 126 C 270 100 290 78 310 66 L 342 92 C 338 120 330 150 322 176 Z', { fill: DOG, stroke: 'none' });
    K.circle(head, 322, 74, 38, { fill: DOG });
    K.path(head, 'M 330 56 C 354 56 378 64 390 74 C 398 82 396 100 382 104 L 330 108 Z', { fill: DOG, stroke: 'none' });
    K.circle(head, 390, 80, 9, { fill: '#142309' });
    K.path(head, 'M 306 48 C 290 54 282 84 288 112 C 294 120 306 116 308 106 C 314 86 316 66 316 52 Z', { fill: DOG_EAR, stroke: 'none' });
    K.circle(head, 340, 66, 5, { fill: '#fff' });
    K.path(head, 'M 290 102 C 302 114 318 122 334 124', { stroke: C.greenLight, 'stroke-width': 10, fill: 'none' });
    const fx = K.group(g);
    return { outer, g, fig, head, tail, fx, x, y, s, pt: (lx, ly) => [x + lx * s, y + ly * s] };
  }
  /** Tail wag from t0 to t1. */
  function wag(tl, D, t0, t1, per = 0.4) {
    const n = Math.max(1, Math.floor((t1 - t0) / per));
    tl.fromTo(D.tail, { rotation: -6, svgOrigin: '108 134' }, { rotation: 10, svgOrigin: '108 134', duration: per / 2, ease: 'sine.inOut', yoyo: true, repeat: 2 * n - 1 }, t0);
  }

  /** The closing logo: the corner logo steps aside, the Calling All Dogs logo and url settle at centre. */
  function logoClose(ctx, tL, hide) {
    const { stage, tl, chrome } = ctx;
    tl.to(hide, { opacity: 0, duration: 0.5, ease: 'power2.in' }, tL - 0.1);
    tl.to(chrome.logo, { opacity: 0, duration: 0.4 }, tL);
    const halo = K.el('div', 'c2-halo');
    Object.assign(halo.style, { left: '360px', top: '190px', width: '1200px', height: '560px' });
    stage.appendChild(halo);
    A.in(tl, halo, tL + 0.1, 'fade', { dur: 1.0 });
    const logo = K.el('img', null, null, { position: 'absolute', left: '610px', top: '268px', width: '700px' });
    logo.src = '../assets/img/logo.png';
    stage.appendChild(logo);
    tl.fromTo(logo, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out' }, tL + 0.15);
    const url = put(stage, 'c2-close', 'callingalldogsny.com', { x: 0, y: 610 });
    A.in(tl, url, tL + 0.45, 'fadeUp', { dur: 0.6 });
    const nm = put(stage, 'c2-close', '<b>Tori Ganino</b>, BS, CDBC, CPDT-KA', { x: 0, y: 700 });
    Object.assign(nm.style, { color: 'var(--ink)', fontSize: '40px' });
    A.in(tl, nm, tL + 0.7, 'fadeUp', { dur: 0.6 });
  }

  window.C2 = { C, AREAS, R, H, CSS, style, layer, put, pill, badge, bookmark, svgIcon, areaHead, makePot, surfY, dog, wag, logoClose };
})();
