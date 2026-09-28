// Part 1, one-chapter version: scenes built by group c.
//   ch01s08  What's the function?           'Function' + target, looks-like vs does cards, four chips
//   ch01s09  Four directions                dog badge hub, four arrows fan out, dotted ring joins them
//   ch01s10  Increase or decrease distance  small hub at left, dog / trigger distance bar, road rage car + leash
//   ch01s11  Access and release             small hub, get it / keep it + guard photo, release chips into a strip
//   ch01s12  Movement isn't function        two dogs on a path, lunge arrow, distance bar, B / C / function strip
// The four-direction hub (hub4) is shared by s09, s10 and s11 so colours, arrows and labels always match.
(() => {
  const C = {
    green: '#619537', greenDark: '#3f6b22', greenDeep: '#2c4a17', greenLight: '#b8d99a', pale: '#e8f1dc',
    mist: '#f3f8ec', ink: '#212121', inkSoft: '#4a4a4a', muted: '#7a7a7a', line: '#d9ddd3', olive: '#4b5a1e',
    red: '#b8452d', redPale: '#f8e3dd', amber: '#d9912b', amberPale: '#fbefd9', amberText: '#a8650f',
    brown: '#a86f43', grey: '#eceee9',
  };
  // one colour per direction, used by the hub in s09, s10 and s11 (and the distance bars in s10 and s12)
  const DIRS = {
    inc: { text: 'Increase distance', stack: 'Increase<br>distance', icon: 'move-horizontal', col: C.amber, pale: C.amberPale, ink: C.amberText, v: [-1, 0] },
    dec: { text: 'Decrease distance', stack: 'Decrease<br>distance', icon: 'magnet', col: C.red, pale: C.redPale, ink: C.red, v: [1, 0] },
    acc: { text: 'Gain or keep access', stack: 'Gain or keep<br>access', icon: 'bone', col: '#8e6a3c', pale: '#f2e9dc', ink: '#76542b', v: [0, 1] },
    rel: { text: 'Release', stack: 'Release', icon: 'zap', col: C.green, pale: C.pale, ink: C.greenDark, v: [0, -1] },
  };
  const KEYS = ['inc', 'dec', 'acc', 'rel'];
  let uid = 0;

  const CSS = `
  .v4c-layer { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
  .v4c-badge { position: absolute; border-radius: 50%; display: grid; place-items: center; border: 5px solid #fff;
    box-shadow: 0 12px 30px rgba(40,60,20,0.16), 0 3px 8px rgba(40,60,20,0.08); }
  .v4c-badge svg { width: 52%; height: 52%; stroke-width: 2.2; }
  .v4c-badge.thin { border-width: 4px; }
  .v4c-hubc { position: absolute; border-radius: 50%; background: #fff; display: grid; place-items: center;
    box-shadow: 0 18px 44px rgba(40,60,20,0.18), 0 4px 10px rgba(40,60,20,0.08); }
  .v4c-hubc .in { width: 80%; height: 80%; border-radius: 50%; background: var(--green-pale); display: grid; place-items: center;
    color: var(--green-dark); border: 3px solid #d3e4c0; }
  .v4c-hubc .in svg { width: 62%; height: 62%; stroke-width: 1.9; }
  .v4c-lab { position: absolute; font: 700 36px/1.15 var(--font-head); white-space: nowrap; }
  .v4c-row { position: absolute; display: flex; justify-content: center; }
  .v4c-title { position: absolute; display: flex; align-items: center; gap: 22px; font: 700 52px/1.1 var(--font-head); white-space: nowrap; }
  .v4c-title .b { flex: 0 0 auto; width: 80px; height: 80px; border-radius: 50%; display: grid; place-items: center; border: 4px solid #fff;
    box-shadow: 0 8px 20px rgba(40,60,20,0.14); }
  .v4c-title .b svg { width: 44px; height: 44px; stroke-width: 2.3; }
  .v4c-pill { display: inline-flex; align-items: center; gap: 14px; padding: 16px 32px; border-radius: 999px; font: 700 34px/1 var(--font-body);
    white-space: nowrap; box-shadow: var(--shadow-soft); background: #fff; color: var(--ink); }
  .v4c-pill svg { width: 36px; height: 36px; stroke-width: 2.4; flex: 0 0 auto; }
  .v4c-card { position: absolute; background: #fff; border-radius: 26px; box-shadow: var(--shadow-soft); border: 1px solid #e6e9e1;
    display: flex; align-items: center; gap: 28px; padding: 0 34px; }
  .v4c-card .ci { flex: 0 0 auto; width: 92px; height: 92px; border-radius: 50%; display: grid; place-items: center; }
  .v4c-card .ci svg { width: 50px; height: 50px; stroke-width: 2.2; }
  .v4c-card .ct { position: relative; font: 700 44px/1.1 var(--font-head); color: var(--ink); white-space: nowrap; }
  .v4c-card.green { background: var(--green); border-color: var(--green); box-shadow: 0 16px 40px rgba(60,100,30,0.28); }
  .v4c-card.green .ct { color: #fff; }
  .v4c-strike { position: absolute; left: -8px; right: -8px; top: 52%; height: 6px; border-radius: 3px; background: var(--muted); transform-origin: 0 50%; }
  .v4c-chip { position: absolute; display: inline-flex; align-items: center; gap: 20px; padding: 12px 34px 12px 12px; border-radius: 999px; background: #fff;
    box-shadow: var(--shadow-soft); border: 1px solid #e6e9e1; font: 600 34px/1 var(--font-body); color: var(--ink); white-space: nowrap; }
  .v4c-chip .i { flex: 0 0 auto; width: 62px; height: 62px; border-radius: 50%; display: grid; place-items: center; background: var(--green-pale); color: var(--green-dark); }
  .v4c-chip .i svg { width: 34px; height: 34px; stroke-width: 2.3; }
  .v4c-q { position: absolute; font: 500 46px/1.25 var(--font-body); color: var(--ink); white-space: nowrap; }
  .v4c-hl { color: var(--green); font-weight: 700; background: linear-gradient(var(--green-light), var(--green-light)) no-repeat 0 92% / 0% 30%; }
  .v4c-cap { position: absolute; font: 600 30px/1.15 var(--font-body); color: var(--ink-soft); white-space: nowrap; text-align: center; }
  .v4c-step { position: absolute; background: #fff; border-radius: 26px; box-shadow: var(--shadow-soft); border: 1px solid #e6e9e1;
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 18px; text-align: center; }
  .v4c-step .si { width: 88px; height: 88px; border-radius: 50%; display: grid; place-items: center; }
  .v4c-step .si svg { width: 48px; height: 48px; stroke-width: 2.2; }
  .v4c-step .st { font: 700 34px/1.12 var(--font-head); color: var(--ink); }
  .v4c-arrowdiv { position: absolute; width: 50px; height: 50px; color: var(--olive); }
  .v4c-arrowdiv svg { width: 100%; height: 100%; }
  .v4c-abc { position: absolute; background: #fff; border-radius: 24px; box-shadow: var(--shadow-soft); border: 1px solid #e6e9e1;
    display: flex; align-items: center; gap: 24px; padding: 0 28px; }
  .v4c-abc .lt { flex: 0 0 auto; width: 76px; height: 76px; border-radius: 50%; display: grid; place-items: center; background: var(--olive); color: #fff;
    font: 800 42px/1 var(--font-head); }
  .v4c-abc .lt svg { width: 44px; height: 44px; stroke-width: 2.4; }
  .v4c-abc .kk { font: 700 26px/1 var(--font-body); letter-spacing: 3px; text-transform: uppercase; color: var(--olive); margin-bottom: 10px; }
  .v4c-abc .tx { font: 700 32px/1.15 var(--font-body); color: var(--ink); }
  .v4c-abc.fn { background: var(--green); border-color: var(--green); box-shadow: 0 16px 40px rgba(60,100,30,0.28); }
  .v4c-abc.fn .lt { background: #fff; color: var(--green); }
  .v4c-abc.fn .kk { color: var(--green-pale); }
  .v4c-abc.fn .tx { color: #fff; }
  .v4c-note { position: absolute; display: flex; align-items: center; gap: 20px; font: 600 42px/1.2 var(--font-body); color: var(--ink); white-space: nowrap; }
  .v4c-note .ni { flex: 0 0 auto; width: 64px; height: 64px; border-radius: 50%; display: grid; place-items: center; background: var(--green-pale); color: var(--green-dark); }
  .v4c-note .ni svg { width: 36px; height: 36px; stroke-width: 2.4; }
  `;
  const style = stage => stage.appendChild(K.el('style', null, CSS));
  const P = (ctx, i, text, fb) => window.phraseTime(ctx, i, text, fb);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  // ------------------------------------------------------------------ small builders
  function abs(n, o) {
    Object.assign(n.style, { left: o.x + 'px', top: o.y + 'px' });
    if (o.w != null) n.style.width = o.w + 'px';
    if (o.h != null) n.style.height = o.h + 'px';
    return n;
  }
  /** Round icon badge centred on (cx, cy). */
  function badge(parent, name, o) {
    const s = o.size ?? 120;
    const b = K.el('div', 'v4c-badge' + (o.cls ? ' ' + o.cls : ''));
    Object.assign(b.style, { left: (o.cx - s / 2) + 'px', top: (o.cy - s / 2) + 'px', width: s + 'px', height: s + 'px', background: o.bg || '#fff', color: o.color || C.green });
    if (o.border != null) b.style.borderWidth = o.border + 'px';
    b.appendChild(K.icon(name));
    parent.appendChild(b);
    return b;
  }
  /** A row of width w centred on cx at y, holding one inline element (pill). Returns the inner element. */
  function centred(parent, inner, cx, y, w = 900) {
    const row = K.el('div', 'v4c-row');
    Object.assign(row.style, { left: (cx - w / 2) + 'px', top: y + 'px', width: w + 'px' });
    row.appendChild(inner);
    parent.appendChild(row);
    return inner;
  }
  function pill(html, o = {}) {
    const p = K.el('div', 'v4c-pill');
    if (o.icon) p.appendChild(K.icon(o.icon));
    p.appendChild(K.el('span', null, K.md(html)));
    if (o.bg) p.style.background = o.bg;
    if (o.color) p.style.color = o.color;
    if (o.size) p.style.fontSize = o.size + 'px';
    return p;
  }
  /** Straight arrow with an open chevron head. Returns {g, shaft, head}. */
  function arrow(svg, x1, y1, x2, y2, o = {}) {
    const g = K.group(svg);
    const len = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / len, uy = (y2 - y1) / len;
    const sw = o.width ?? 14, hl = o.head ?? 36, a = (40 * Math.PI) / 180, ang = Math.atan2(uy, ux);
    const shaft = K.line(g, x1, y1, x2 - ux * 3, y2 - uy * 3, { stroke: o.color, 'stroke-width': sw });
    const ax = x2 - hl * Math.cos(ang - a), ay = y2 - hl * Math.sin(ang - a);
    const bx = x2 - hl * Math.cos(ang + a), by = y2 - hl * Math.sin(ang + a);
    const head = K.path(g, `M${ax} ${ay} L${x2} ${y2} L${bx} ${by}`, { stroke: o.color, 'stroke-width': sw, fill: 'none' });
    return { g, shaft, head };
  }
  /** Short radial strokes around (x, y), for bursts. angles in degrees (0 = right, -90 = up). */
  function rays(svg, x, y, r1, r2, angles, attrs) {
    return angles.map(d => {
      const t = (d * Math.PI) / 180;
      return K.line(svg, x + r1 * Math.cos(t), y + r1 * Math.sin(t), x + r2 * Math.cos(t), y + r2 * Math.sin(t), attrs);
    });
  }
  /** Burst the rays outward from nothing, then fade (never retract to a dot). */
  function burst(tl, strokes, t, stay) {
    tl.fromTo(strokes, { opacity: 1, drawSVG: '0% 0%' }, { opacity: 1, drawSVG: '0% 100%', duration: 0.22, ease: 'power2.out', immediateRender: false }, t);
    if (!stay) tl.to(strokes, { opacity: 0, duration: 0.3, ease: 'power2.in' }, t + 0.34);
  }
  /** Colour-coded section title (badge + words) at (x, y). */
  function sectionTitle(parent, k, o) {
    const D = DIRS[k];
    const n = K.el('div', 'v4c-title');
    const b = K.el('div', 'b');
    Object.assign(b.style, { background: D.pale, color: D.col });
    b.appendChild(K.icon(D.icon));
    n.appendChild(b);
    n.appendChild(K.el('span', null, o.text || D.text));
    n.style.color = D.ink;
    abs(n, o);
    parent.appendChild(n);
    return n;
  }

  // ------------------------------------------------------------------ the four-direction hub
  /**
   * Round dog badge with four arrows: left increase distance, right decrease distance, down gain or keep
   * access, up release. o: {cx, cy, s (geometry scale), lab (label px), stack (two-line labels)}.
   * Returns {root, svg, center, d: {inc|dec|acc|rel: {arrow, glow, badge, label, parts, bx, by}}, ringR}.
   */
  function hub4(parent, o) {
    const s = o.s ?? 1, cx = o.cx, cy = o.cy;
    const R = 90 * s, gap = 18 * s, Lh = 240 * s, Lv = (o.lv ?? 120) * s, br = 56 * s;
    const root = K.el('div', 'v4c-layer');
    parent.appendChild(root);
    const svg = K.svg(root, { x: 0, y: 0, w: 1920, h: 1080 });
    const gid = 'v4cglow' + ++uid;
    K.svgEl('defs', {}, svg).innerHTML = `<filter id="${gid}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${Math.round(10 * s)}"/></filter>`;
    const glowG = K.group(svg, { filter: `url(#${gid})` });
    const ringG = K.group(svg);
    const arrG = K.group(svg);
    const lab = o.lab ?? 36;
    const d = {};
    KEYS.forEach(k => {
      const D = DIRS[k], [vx, vy] = D.v, L = vx ? Lh : Lv;
      const x1 = cx + vx * (R + gap), y1 = cy + vy * (R + gap), x2 = cx + vx * (R + gap + L), y2 = cy + vy * (R + gap + L);
      const glow = K.line(glowG, x1, y1, x2, y2, { stroke: D.col, 'stroke-width': 44 * s, opacity: 0 });
      const ar = arrow(arrG, x1, y1, x2, y2, { color: D.col, width: Math.max(8, 14 * s), head: 34 * s });
      const off = R + gap + L + br + 10 * s;
      const bx = cx + vx * off, by = cy + vy * off;
      const b = badge(root, D.icon, { cx: bx, cy: by, size: 2 * br, bg: D.pale, color: D.col, cls: s < 0.8 ? 'thin' : '' });
      const html = o.stack ? D.stack : D.text;
      const lines = (html.match(/<br>/g) || []).length + 1;
      const l = K.el('div', 'v4c-lab', html);
      l.style.fontSize = lab + 'px';
      l.style.color = D.ink;
      if (vx) {
        const w = 420;
        Object.assign(l.style, { left: (bx - w / 2) + 'px', width: w + 'px', textAlign: 'center', top: (by + br + 12 * s) + 'px' });
      } else {
        Object.assign(l.style, { left: (bx + br + 18 * s) + 'px', top: (by - (lines * lab * 1.15) / 2) + 'px' });
      }
      root.appendChild(l);
      d[k] = { arrow: ar, glow, badge: b, label: l, parts: [ar.g, b, l], bx, by, x1, y1, x2, y2 };
    });
    const center = K.el('div', 'v4c-hubc');
    Object.assign(center.style, { left: (cx - R) + 'px', top: (cy - R) + 'px', width: 2 * R + 'px', height: 2 * R + 'px' });
    const inner = K.el('div', 'in');
    inner.appendChild(K.icon('dog'));
    center.appendChild(inner);
    root.appendChild(center);
    return { root, svg, center, d, ringG, cx, cy, R, gap, Lh, Lv, br, s };
  }
  /** Fan one direction out: shaft draws, head snaps on, badge pops, label rises. */
  function fanOut(tl, H, k, t) {
    const x = H.d[k];
    A.draw(tl, x.arrow.shaft, t, 0.45, { ease: 'power2.out' });
    tl.fromTo(x.arrow.head, { opacity: 0 }, { opacity: 1, duration: 0.05, ease: 'none' }, t + 0.35);
    A.draw(tl, x.arrow.head, t + 0.35, 0.25);
    A.in(tl, x.badge, t + 0.35, 'pop', { dur: 0.6 });
    A.in(tl, x.label, t + 0.55, DIRS[k].v[0] ? 'fadeUp' : 'fadeRight', { dur: 0.6 });
  }
  const DIM = 0.26;
  /** Small hub for s10 / s11: every direction dimmed, then lit one at a time. */
  function smallHub(parent) {
    const H = hub4(parent, { cx: 440, cy: 622, s: 0.62, lv: 130, lab: 28, stack: true });
    KEYS.forEach(k => gsap.set(H.d[k].parts, { opacity: DIM }));
    return H;
  }
  /** The hub arrives already small at the left (it shrinks in from the size it had in the previous scene). */
  function smallHubIn(tl, H, t) {
    tl.fromTo(H.root, { opacity: 0, scale: 1.45, x: 460, y: -30, transformOrigin: `${H.cx}px ${H.cy}px` },
      { opacity: 1, scale: 1, x: 0, y: 0, transformOrigin: `${H.cx}px ${H.cy}px`, duration: 1.0, ease: 'power3.inOut' }, t);
  }
  function light(tl, H, k, t) {
    const x = H.d[k];
    tl.to(x.parts, { opacity: 1, duration: 0.45, ease: 'power2.out' }, t);
    tl.fromTo(x.glow, { opacity: 0 }, { opacity: 0.42, duration: 0.6, ease: 'power2.out', immediateRender: false }, t);
    A.pulse(tl, x.badge, t + 0.2, { scale: 1.18 });
  }
  function unlight(tl, H, k, t) {
    const x = H.d[k];
    tl.to(x.parts, { opacity: DIM, duration: 0.45, ease: 'power2.out' }, t);
    tl.to(x.glow, { opacity: 0, duration: 0.45, ease: 'power2.out' }, t);
  }

  // ================================================================== ch01s08  What's the function?
  registerScene('ch01s08', ctx => {
    const { stage, tl, cue } = ctx;
    style(stage);

    // heading row: solid target badge + big 'Function', question beneath
    const tb = badge(stage, 'target', { cx: 164, cy: 190, size: 124, bg: C.green, color: '#fff' });
    const h = K.heading(stage, 'Function', { x: 256, y: 136, size: 96, bar: true });
    const q = K.el('div', 'v4c-q', 'What did the behavior <span class="v4c-hl">accomplish</span>?');
    abs(q, { x: 100, y: 310 });
    stage.appendChild(q);
    const hl = q.querySelector('.v4c-hl');

    // two contrast cards, left column
    const mkCard = (o) => {
      const c = K.el('div', 'v4c-card' + (o.cls ? ' ' + o.cls : ''));
      abs(c, o);
      const ci = K.el('div', 'ci');
      Object.assign(ci.style, { background: o.ibg, color: o.icol });
      ci.appendChild(K.icon(o.icon));
      c.appendChild(ci);
      const ct = K.el('div', 'ct', o.text);
      c.appendChild(ct);
      stage.appendChild(c);
      return { c, ci, ct };
    };
    const cardA = mkCard({ x: 100, y: 432, w: 700, h: 150, icon: 'eye', text: 'What it looks like', ibg: C.amberPale, icol: C.amberText });
    const strike = K.el('div', 'v4c-strike');
    cardA.ct.appendChild(strike);
    const cardB = mkCard({ x: 100, y: 620, w: 700, h: 150, cls: 'green', icon: 'target', text: 'What it does', ibg: '#fff', icol: C.green });

    // four chips on the right, wired to the 'What it does' card
    const chipData = [
      { t: 'Changes the environment', icon: 'trees', p: 'change the environment' },
      { t: 'Changes what others do', icon: 'users', p: 'change what someone else does' },
      { t: 'Gets access', icon: 'door-open', p: 'get the dog access' },
      { t: 'Changes how the dog feels', icon: 'heart', p: 'change how the dog feels' },
    ];
    const CX = 1010, ys = [420, 544, 668, 792], chipH = 88;
    const wires = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const fromX = 800, fromY = 695;
    const chips = chipData.map((d, i) => {
      const yc = ys[i] + chipH / 2;
      const wire = K.path(wires, `M${fromX} ${fromY} C${fromX + 110} ${fromY} ${CX - 110} ${yc} ${CX - 8} ${yc}`, { stroke: C.greenLight, 'stroke-width': 5 });
      const c = K.el('div', 'v4c-chip');
      abs(c, { x: CX, y: ys[i] });
      const ic = K.el('div', 'i');
      ic.appendChild(K.icon(d.icon));
      c.appendChild(ic);
      c.appendChild(K.el('span', null, d.t));
      stage.appendChild(c);
      return { c, wire };
    });

    // ---- beat 1: 'Function' writes on with its target, the question fades in beneath
    A.in(tl, tb, cue(0) - 0.2, 'pop', { dur: 0.7 });
    A.in(tl, h.title, cue(0), 'wipe', { dur: 0.9 });
    A.in(tl, h.bar, cue(0) + 0.6, 'grow', { dur: 0.5 });
    const tQ = clamp(P(ctx, 0, 'what did the behavior', 0.4) - 0.2, cue(0) + 0.9, ctx.end(0) - 1.5);
    A.in(tl, q, tQ, 'fadeUp', { dur: 0.8 });
    tl.to(hl, { backgroundSize: '100% 30%', duration: 0.8, ease: 'power2.inOut' }, P(ctx, 0, 'accomplish', 0.55));

    // ---- beat 2: 'What it looks like' slides up and greys out, 'What it does' slides up green
    A.in(tl, cardA.c, cue(1) - 0.1, 'fadeUp', { dur: 0.8 });
    const tDoes = clamp(P(ctx, 1, "it's what the behavior does", 0.5) - 0.2, cue(1) + 1.2, ctx.end(1) - 1.2);
    A.in(tl, cardB.c, tDoes, 'fadeUp', { dur: 0.8 });
    tl.to(cardA.c, { opacity: 0.55, filter: 'grayscale(1)', duration: 0.6, ease: 'power2.out' }, tDoes + 0.1);
    tl.fromTo(strike, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power2.inOut' }, tDoes + 0.3);

    // ---- beat 3: four chips pop in, one per phrase, each wired back to 'What it does'
    chipData.forEach((d, i) => {
      const t = Math.max(cue(2) + i * 0.3, P(ctx, 2, d.p, 0.1 + i * 0.22) - 0.15);
      A.draw(tl, chips[i].wire, t, 0.45, { ease: 'power2.out' });
      A.in(tl, chips[i].c, t + 0.25, 'pop', { dur: 0.6 });
    });
  });

  // ================================================================== ch01s09  Four directions
  registerScene('ch01s09', ctx => {
    const { stage, tl, cue, end } = ctx;
    style(stage);

    const h = K.heading(stage, 'Four functional directions', { x: 100, y: 140, w: 720, size: 80 });
    const H = hub4(stage, { cx: 1010, cy: 600, s: 1 });
    // dotted ring through the four arrow shafts (a wheel joining the spokes)
    const ringR = H.R + H.gap + 0.55 * H.Lv;
    const N = 48;
    const dots = [];
    for (let i = 0; i < N; i++) {
      const deg = -90 + (i * 360) / N, off = ((deg % 90) + 90) % 90;
      if (off < 4 || off > 86) continue; // leave a gap where each arrow passes through
      const a = (deg * Math.PI) / 180;
      dots.push(K.circle(H.ringG, H.cx + ringR * Math.cos(a), H.cy + ringR * Math.sin(a), 5.5, { fill: C.green }));
    }
    const cap = pill('Not rigid boxes', { icon: 'shuffle', bg: C.pale, color: C.greenDeep });
    Object.assign(cap.style, { position: 'absolute', left: '100px', top: '420px', boxShadow: 'none' });
    stage.appendChild(cap);
    cap.querySelector('svg').style.color = C.green;

    // ---- beat 1: title, the dog badge, then each arrow fans out on its phrase
    A.in(tl, h.title, cue(0) - 0.3, 'wipe', { dur: 0.9 });
    A.in(tl, h.bar, cue(0) + 0.3, 'grow', { dur: 0.5 });
    A.in(tl, H.center, cue(0) - 0.1, 'pop', { dur: 0.8 });
    const phr = { inc: 'Increase distance', dec: 'Decrease distance', acc: 'Gain or keep access', rel: 'release built-up' };
    let prev = cue(0) + 0.6;
    ['inc', 'dec', 'acc', 'rel'].forEach((k, i) => {
      const t = Math.max(prev, P(ctx, 0, phr[k], 0.3 + i * 0.18) - 0.15);
      fanOut(tl, H, k, t);
      prev = t + 0.5;
    });

    // ---- beat 2: all four glow together and a dotted ring draws round, joining them
    const glows = KEYS.map(k => H.d[k].glow);
    tl.to(glows, { opacity: 0.4, duration: 0.7, ease: 'power2.out' }, cue(1));
    tl.to(glows, { opacity: 0.16, duration: 0.9, yoyo: true, repeat: 3, ease: 'sine.inOut' }, cue(1) + 0.8);
    A.pulse(tl, KEYS.map(k => H.d[k].badge), cue(1) + 0.1, { scale: 1.1 });
    tl.fromTo(dots, { opacity: 0, scale: 0, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, transformOrigin: '50% 50%', duration: 0.3, stagger: 0.03, ease: 'back.out(2)' }, cue(1) + 0.3);
    A.in(tl, cap, cue(1) + 0.4, 'fadeUp', { dur: 0.8 });
    A.pulse(tl, H.center, clamp(P(ctx, 1, 'more than one job', 0.45), cue(1) + 1.5, end(1) - 1), { scale: 1.08 });
  });

  // ================================================================== ch01s10  Increase or decrease distance
  registerScene('ch01s10', ctx => {
    const { stage, tl, cue, end } = ctx;
    style(stage);

    const h = K.heading(stage, 'Increase or decrease distance', { x: 100, y: 140, size: 72 });
    const H = smallHub(stage);

    // right panel: direction title, dog and trigger with a distance bar between them
    const tInc = sectionTitle(stage, 'inc', { x: 900, y: 350 });
    const tDec = sectionTitle(stage, 'dec', { x: 900, y: 350 });
    const Y = 640, BS = 140, BR = BS / 2;
    const DOG0 = 1070, DOG1 = 1230, TR0 = 1370, TR1 = 1690;
    const svg = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    // leash (beat 3) sits behind the dog
    const HAND = 930;
    const lx1 = HAND + 44, lx2 = DOG1 - BR + 6, ly = Y + 22;
    const slackD = `M${lx1} ${ly} Q${(lx1 + lx2) / 2} ${ly + 64} ${lx2} ${ly}`;
    const tautD = `M${lx1} ${ly} Q${(lx1 + lx2) / 2} ${ly} ${lx2} ${ly}`;
    const leash = K.path(svg, slackD, { stroke: C.brown, 'stroke-width': 8 });
    const strainX = (lx1 + lx2) / 2;
    const strain = [-50, 0, 50].map(dx => K.line(svg, strainX + dx - 8, ly + 34, strainX + dx + 8, ly + 18, { stroke: C.amber, 'stroke-width': 5, opacity: 0 }));
    // distance bar: shaft + end ticks, drawn between the badge edges
    const barG = K.group(svg);
    const bx1 = x => x + BR + 14, bx2 = x => x - BR - 14;
    const bar = K.line(barG, bx1(DOG0), Y, bx2(TR0), Y, { stroke: C.amber, 'stroke-width': 10 });
    const tick1 = K.line(barG, bx1(DOG0), Y - 22, bx1(DOG0), Y + 22, { stroke: C.amber, 'stroke-width': 8 });
    const tick2 = K.line(barG, bx2(TR0), Y - 22, bx2(TR0), Y + 22, { stroke: C.amber, 'stroke-width': 8 });
    const barParts = [bar, tick1, tick2];

    const hand = badge(stage, 'hand', { cx: HAND, cy: Y + 22, size: 88, bg: '#fff', color: C.inkSoft });
    const dog = badge(stage, 'dog', { cx: DOG0, cy: Y, size: BS, bg: C.pale, color: C.greenDark });
    const trig = badge(stage, 'user', { cx: TR1, cy: Y, size: BS, bg: C.grey, color: C.inkSoft });
    const heart = badge(stage, 'heart', { cx: TR1, cy: Y, size: BS, bg: C.redPale, color: C.red });
    gsap.set(heart, { opacity: 0 });
    // bark lines from the dog toward the trigger
    const fx = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const bark = rays(fx, DOG0, Y, BR + 16, BR + 44, [-38, -14, 10], { stroke: C.amber, 'stroke-width': 6 });
    gsap.set(bark, { opacity: 0 });

    const PILL_Y = Y + BR + 34;
    const more = centred(stage, pill('More space', { bg: C.amberPale, color: C.amberText }), (bx1(DOG0) + bx2(TR1)) / 2, PILL_Y, 600);
    const less = centred(stage, pill('Less space', { bg: C.redPale, color: C.red }), (bx1(DOG1) + bx2(TR1)) / 2, PILL_Y, 600);
    const rage = centred(stage, pill('Leash road rage', { icon: 'car', bg: C.red, color: '#fff' }), (bx1(DOG1) + bx2(TR1)) / 2, PILL_Y, 600);

    // road rage car on the bar, honking at the heart
    const carX = (bx1(DOG1) + bx2(TR1)) / 2, carS = 100;
    const car = badge(stage, 'car', { cx: carX, cy: Y, size: carS, bg: '#fff', color: C.red });
    const horn = rays(fx, carX, Y, carS / 2 + 12, carS / 2 + 40, [-62, -38, -14], { stroke: C.red, 'stroke-width': 6 });
    gsap.set(horn, { opacity: 0 });

    // ---- beat 1: the hub shrinks in at the left with Increase lit; the trigger backs off and the bar stretches
    A.in(tl, h.title, 0.1, 'wipe', { dur: 0.8 });
    A.in(tl, h.bar, 0.6, 'grow', { dur: 0.5 });
    smallHubIn(tl, H, 0.05);
    light(tl, H, 'inc', cue(0) + 0.4);
    A.in(tl, tInc, cue(0) + 0.5, 'fadeUp', { dur: 0.7 });
    tl.set(trig, { x: TR0 - TR1 }, 0);
    A.in(tl, [dog, trig], cue(0) + 1.1, 'pop', { dur: 0.6, stagger: 0.12 });
    tl.fromTo(barParts, { opacity: 0 }, { opacity: 1, duration: 0.4 }, cue(0) + 1.5);
    const tBark = clamp(P(ctx, 0, 'the dog barks', 0.28) - 0.1, cue(0) + 2.2, end(0) - 6);
    burst(tl, bark, tBark);
    burst(tl, bark, tBark + 0.7);
    A.pulse(tl, dog, tBark, { scale: 1.1 });
    const tBack = clamp(P(ctx, 0, 'backs off', 0.55) - 0.3, tBark + 1.4, end(0) - 3);
    const SD = 1.3;
    tl.to(trig, { x: 0, duration: SD, ease: 'power2.inOut' }, tBack);
    tl.to(bar, { attr: { x2: bx2(TR1) }, duration: SD, ease: 'power2.inOut' }, tBack);
    tl.to(tick2, { attr: { x1: bx2(TR1), x2: bx2(TR1) }, duration: SD, ease: 'power2.inOut' }, tBack);
    A.in(tl, more, tBack + SD - 0.2, 'pop', { dur: 0.6 });
    A.pulse(tl, more, clamp(P(ctx, 0, 'that space is everything', 0.85), tBack + SD + 0.8, end(0) - 0.4), { scale: 1.1 });

    // ---- beat 2: Decrease lights; the trigger becomes a heart and the dog closes the gap
    unlight(tl, H, 'inc', cue(1) - 0.1);
    light(tl, H, 'dec', cue(1));
    A.out(tl, tInc, cue(1) - 0.1, 'fadeUp', { dur: 0.4 });
    A.in(tl, tDec, cue(1) + 0.3, 'fadeUp', { dur: 0.7 });
    A.out(tl, more, cue(1) - 0.1, 'fade', { dur: 0.4 });
    tl.to(trig, { opacity: 0, scale: 0.7, duration: 0.4, ease: 'power2.in' }, cue(1) + 0.2);
    tl.fromTo(heart, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.8)' }, cue(1) + 0.45);
    tl.to(barParts, { attr: { stroke: C.red }, duration: 0.5 }, cue(1) + 0.3);
    const tClose = clamp(P(ctx, 1, 'brings the dog closer', 0.4) - 0.2, cue(1) + 1.2, end(1) - 3);
    tl.to(dog, { x: DOG1 - DOG0, duration: SD, ease: 'power2.inOut' }, tClose);
    tl.to(bar, { attr: { x1: bx1(DOG1) }, duration: SD, ease: 'power2.inOut' }, tClose);
    tl.to(tick1, { attr: { x1: bx1(DOG1), x2: bx1(DOG1) }, duration: SD, ease: 'power2.inOut' }, tClose);
    A.in(tl, less, tClose + SD - 0.2, 'pop', { dur: 0.6 });

    // ---- beat 3: a leash holds the dog back and pulls taut; the road rage car honks on the bar
    A.in(tl, hand, cue(2) + 0.1, 'pop', { dur: 0.6 });
    tl.fromTo(leash, { opacity: 0 }, { opacity: 1, duration: 0.05 }, cue(2) + 0.35);
    A.draw(tl, leash, cue(2) + 0.35, 0.8);
    const tTaut = clamp(P(ctx, 2, 'stops them', 0.2), cue(2) + 1.3, end(2) - 8);
    tl.to(dog, { x: DOG1 - DOG0 + 18, duration: 0.25, ease: 'power2.out' }, tTaut - 0.2);
    tl.to(leash, { attr: { d: tautD }, duration: 0.3, ease: 'power3.in' }, tTaut - 0.2);
    tl.to(dog, { x: DOG1 - DOG0, duration: 0.35, ease: 'back.out(3)' }, tTaut + 0.12);
    tl.fromTo(strain, { opacity: 0 }, { opacity: 1, duration: 0.2, stagger: 0.06, immediateRender: false }, tTaut + 0.1);
    tl.to(strain, { opacity: 0, duration: 0.5 }, tTaut + 1.6);
    const tCar = clamp(P(ctx, 2, 'road rage', 0.3) - 0.3, tTaut + 0.8, end(2) - 5);
    A.out(tl, less, tCar, 'fade', { dur: 0.35 });
    tl.fromTo(car, { opacity: 0, x: 90 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, tCar);
    A.in(tl, rage, tCar + 0.4, 'fadeUp', { dur: 0.7 });
    burst(tl, horn, tCar + 0.9);
    const tHorn = clamp(P(ctx, 2, 'lean on the horn', 0.85) - 0.1, tCar + 2.5, end(2) - 1.2);
    burst(tl, horn, tHorn);
    burst(tl, horn, tHorn + 0.6, true);
    A.pulse(tl, car, tHorn, { scale: 1.12 });
    A.pulse(tl, car, tHorn + 0.6, { scale: 1.12 });
  });

  // ================================================================== ch01s11  Access and release
  registerScene('ch01s11', ctx => {
    const { stage, tl, cue, end } = ctx;
    style(stage);

    const h = K.heading(stage, 'Access and release', { x: 100, y: 140, size: 84 });
    const H = smallHub(stage);
    const tAcc = sectionTitle(stage, 'acc', { x: 900, y: 330 });
    const tRel = sectionTitle(stage, 'rel', { x: 900, y: 330, text: 'Release built-up tension' });

    // 2 x 2 grid: [Get it.][item icons] / [Keep it.][guard photo]
    const D = DIRS.acc;
    const mkCard = (o) => {
      const c = K.el('div', 'v4c-card');
      abs(c, o);
      const ci = K.el('div', 'ci');
      Object.assign(ci.style, { background: D.pale, color: D.col });
      ci.appendChild(K.icon(o.icon));
      c.appendChild(ci);
      const ct = K.el('div', 'ct', o.text);
      ct.style.fontSize = '50px';
      c.appendChild(ct);
      stage.appendChild(c);
      return c;
    };
    const getC = mkCard({ x: 900, y: 446, w: 380, h: 164, icon: 'hand', text: 'Get it.' });
    const keepC = mkCard({ x: 900, y: 688, w: 380, h: 164, icon: 'shield', text: 'Keep it.' });
    const items = [
      { icon: 'bone', t: 'Food', p: 'food' }, { icon: 'volleyball', t: 'Toy', p: 'a toy' },
      { icon: 'user', t: 'Person', p: 'a person' }, { icon: 'bed', t: 'Rest spot', p: 'a resting spot' },
    ].map((it, i) => {
      const cx = 1382 + i * 122;
      const b = badge(stage, it.icon, { cx, cy: 496, size: 88, bg: '#fff', color: D.col, cls: 'thin' });
      const c = K.el('div', 'v4c-cap', it.t);
      Object.assign(c.style, { left: (cx - 90) + 'px', top: '552px', width: '180px', fontSize: '26px' });
      stage.appendChild(c);
      return { b, c, p: it.p };
    });
    const photo = K.photo(stage, 'abc_guard_c.jpg', { x: 1330, y: 650, w: 420, h: 244, radius: 22 });
    const check = badge(stage, 'check', { cx: 1742, cy: 662, size: 70, bg: C.green, color: '#fff', border: 4 });
    check.querySelector('svg').style.strokeWidth = 3.2;

    // release: burst at the hub's up badge, six chips, then the strip
    const fx = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const up = H.d.rel;
    const spark = rays(fx, up.bx, up.by, H.br + 12, H.br + 34, [-160, -125, -90, -55, -20], { stroke: C.green, 'stroke-width': 6 });
    gsap.set(spark, { opacity: 0 });
    const chipDefs = [
      { t: 'Bark', icon: 'megaphone' }, { t: 'Jump', icon: 'arrow-big-up' }, { t: 'Grab', icon: 'grab' },
      { t: 'Spin', icon: 'rotate-cw' }, { t: 'Mouth', icon: 'laugh' }, { t: 'Redirect', icon: 'corner-up-right' },
    ];
    const cellX = [1030, 1330, 1630];
    const chips = chipDefs.map((d, i) => {
      const c = K.el('div', 'v4c-chip');
      const ic = K.el('div', 'i');
      ic.appendChild(K.icon(d.icon));
      c.appendChild(ic);
      c.appendChild(K.el('span', null, d.t));
      c.style.position = 'relative';
      centred(stage, c, cellX[i % 3], i < 3 ? 470 : 600, 300);
      return c;
    });
    // strip: High arousal > Behavior > Change in state
    const SW = 236, SH = 224, SY = 452;
    const stepDefs = [
      { t: 'High<br>arousal', icon: 'flame', bg: C.redPale, col: C.red, x: 1330 - SW / 2 - 330 },
      { t: 'Behavior', icon: 'paw-print', bg: C.pale, col: C.greenDark, x: 1330 - SW / 2 },
      { t: 'Change<br>in state', icon: 'wind', bg: C.pale, col: C.green, x: 1330 - SW / 2 + 330 },
    ];
    const steps = stepDefs.map(d => {
      const s = K.el('div', 'v4c-step');
      abs(s, { x: d.x, y: SY, w: SW, h: SH });
      const si = K.el('div', 'si');
      Object.assign(si.style, { background: d.bg, color: d.col });
      si.appendChild(K.icon(d.icon));
      s.appendChild(si);
      s.appendChild(K.el('div', 'st', d.t));
      stage.appendChild(s);
      return s;
    });
    const stepArrows = [0, 1].map(i => {
      const a = K.el('div', 'v4c-arrowdiv');
      abs(a, { x: stepDefs[i].x + SW + (330 - SW) / 2 - 25, y: SY + SH / 2 - 25 });
      a.innerHTML = '<svg viewBox="0 0 24 24"><path d="M3 8h9V3l9 9-9 9v-5H3z" fill="currentColor"/></svg>';
      a.style.color = C.olive;
      stage.appendChild(a);
      return a;
    });

    // ---- beat 1: the hub shrinks in at the left with the down arrow lit; Get it / Keep it with their items
    A.in(tl, h.title, 0.1, 'wipe', { dur: 0.8 });
    A.in(tl, h.bar, 0.6, 'grow', { dur: 0.5 });
    smallHubIn(tl, H, 0.05);
    light(tl, H, 'acc', cue(0) + 0.4);
    A.in(tl, tAcc, cue(0) + 0.5, 'fadeUp', { dur: 0.7 });
    const tGet = clamp(P(ctx, 0, 'get something', 0.45) - 0.2, cue(0) + 1.2, end(0) - 4);
    A.in(tl, getC, tGet, 'fadeUp', { dur: 0.7 });
    const tKeep = clamp(P(ctx, 0, 'or keep something', 0.55) - 0.2, tGet + 0.6, end(0) - 3);
    A.in(tl, keepC, tKeep, 'fadeUp', { dur: 0.7 });
    let prev = tKeep + 0.4;
    items.forEach((it, i) => {
      const t = Math.max(prev, P(ctx, 0, it.p, 0.7 + i * 0.07) - 0.15);
      A.in(tl, it.b, t, 'pop', { dur: 0.55 });
      A.in(tl, it.c, t + 0.15, 'fadeUp', { dur: 0.5 });
      prev = t + 0.3;
    });

    // ---- beat 2: the guard photo slides in beside Keep it, with a green check
    A.dim(tl, getC, cue(1), 0.45);
    A.dim(tl, items.flatMap(it => [it.b, it.c]), cue(1), 0.3);
    A.in(tl, photo.root, cue(1) + 0.1, 'fadeLeft', { dur: 0.9 });
    A.kenburns(tl, photo.img, { from: 1.02, to: 1.1, t0: cue(1), t1: cue(2) + 0.5 });
    const tStay = clamp(P(ctx, 1, 'the toy stays put', 0.8) - 0.2, cue(1) + 1.4, end(1) - 0.6);
    A.in(tl, check, tStay, 'pop', { dur: 0.6 });
    A.pulse(tl, keepC, tStay + 0.1, { scale: 1.05 });

    // ---- beat 3: the cards clear, the up arrow bursts with its zap and six chips pop in
    const beat1 = [getC, keepC, photo.root, check, ...items.flatMap(it => [it.b, it.c])];
    A.out(tl, beat1, cue(2) - 0.2, 'fadeDown', { dur: 0.45 });
    A.out(tl, tAcc, cue(2) - 0.2, 'fadeUp', { dur: 0.4 });
    unlight(tl, H, 'acc', cue(2) - 0.1);
    light(tl, H, 'rel', cue(2) + 0.1);
    burst(tl, spark, cue(2) + 0.35);
    A.in(tl, tRel, cue(2) + 0.4, 'fadeUp', { dur: 0.7 });
    const words = ['bark', 'jump', 'grab', 'spin', 'mouth', 'redirect'];
    prev = cue(2) + 1.0;
    const chipT = words.map((w, i) => {
      const t = Math.max(prev, P(ctx, 2, w, 0.3 + i * 0.05) - 0.1);
      A.in(tl, chips[i], t, 'pop', { dur: 0.55 });
      prev = t + 0.25;
      return t;
    });
    const tSpin = clamp(P(ctx, 2, 'spins and screams', 0.85) - 0.1, chipT[5] + 1.0, end(2) - 0.8);
    A.pulse(tl, chips[3], tSpin, { scale: 1.16 });
    burst(tl, spark, tSpin);
    A.pulse(tl, up.badge, tSpin, { scale: 1.16 });

    // ---- beat 4: the chips gather into the middle card; the strip lands around it
    chips.forEach((c, i) => {
      const dx = 1330 - cellX[i % 3], dy = SY + SH / 2 - ((i < 3 ? 470 : 600) + 43);
      tl.to(c, { x: dx, y: dy, scale: 0.35, opacity: 0, duration: 0.7, ease: 'power2.in' }, cue(3) - 0.1 + i * 0.05);
    });
    A.in(tl, steps[1], cue(3) + 0.55, 'pop', { dur: 0.7 });
    A.in(tl, steps[0], cue(3) + 1.05, 'fadeRight', { dur: 0.7 });
    A.in(tl, stepArrows[0], cue(3) + 1.3, 'fadeRight', { dur: 0.5 });
    const tState = clamp(P(ctx, 3, 'discharge', 0.7) - 0.4, cue(3) + 1.7, end(3) - 1.5);
    A.in(tl, stepArrows[1], tState - 0.2, 'fadeRight', { dur: 0.5 });
    A.in(tl, steps[2], tState, 'fadeRight', { dur: 0.7 });
  });

  // ================================================================== ch01s12  Movement isn't function
  registerScene('ch01s12', ctx => {
    const { stage, tl, cue, end } = ctx;
    style(stage);

    const h = K.heading(stage, "Movement isn't function", { x: 100, y: 140, size: 84 });
    const cap1 = K.el('div', 'v4c-q', 'Toward, but the result is <span class="v4c-hl">space</span>');
    abs(cap1, { x: 100, y: 292 });
    cap1.style.fontSize = '42px';
    stage.appendChild(cap1);
    const cap2 = K.el('div', 'v4c-note');
    const ni = K.el('div', 'ni');
    ni.appendChild(K.icon('eye'));
    cap2.appendChild(ni);
    cap2.appendChild(K.el('span', null, K.md('Watch the *outcome*, not the pull')));
    abs(cap2, { x: 100, y: 284 });
    stage.appendChild(cap2);

    // the path and the two dogs
    const Y = 530, BS = 128, BR = BS / 2;
    const L0 = 400, L1 = 560, R0 = 1010, R1 = 1560;
    const svg = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const path = K.group(svg);
    K.rect(path, 150, Y + BR + 4, 1620, 34, { rx: 17, fill: '#e3e9da' });
    K.line(path, 190, Y + BR + 21, 1730, Y + BR + 21, { stroke: '#f7f9f3', 'stroke-width': 5, 'stroke-dasharray': '26 22' });
    const lunge = arrow(svg, L0 + 40, Y, R0 - BR - 18, Y, { color: C.green, width: 12, head: 32 });
    const speed = [-26, 0, 26].map(dy => K.line(svg, L1 - BR - 70, Y + dy, L1 - BR - 22, Y + dy, { stroke: C.amber, 'stroke-width': 6, opacity: 0 }));
    // distance bar under the path
    const DY = Y + BR + 104;
    const barG = K.group(svg);
    const bar = K.line(barG, L1, DY, R0, DY, { stroke: C.amber, 'stroke-width': 10 });
    const tk1 = K.line(barG, L1, DY - 22, L1, DY + 22, { stroke: C.amber, 'stroke-width': 8 });
    const tk2 = K.line(barG, R0, DY - 22, R0, DY + 22, { stroke: C.amber, 'stroke-width': 8 });
    const dogL = badge(stage, 'dog', { cx: L0, cy: Y, size: BS, bg: C.amberPale, color: C.amberText });
    const dogR = badge(stage, 'dog', { cx: R0, cy: Y, size: BS, bg: C.pale, color: C.greenDark });
    const lungeLab = centred(stage, K.el('div', 'v4c-lab', 'Lunges toward'), (L1 + BR + R0 - BR) / 2, Y - 118, 600);
    lungeLab.style.position = 'relative';
    lungeLab.style.color = C.greenDark;
    const moreLab = centred(stage, pill('More distance', { bg: C.amberPale, color: C.amberText }), (L1 + R1) / 2, DY - 33, 600);

    // strip: B / C / function
    const boxes = [
      { lt: 'B', kk: 'Behavior', tx: 'Dog lunges toward' },
      { lt: 'C', kk: 'Consequence', tx: 'Other dog moves away' },
      { icon: 'target', kk: 'Function', tx: 'More distance', fn: true },
    ];
    const BW = 500, BH = 146, BY = 802, GAPX = (1720 - 3 * BW) / 2;
    const boxEls = boxes.map((b, i) => {
      const n = K.el('div', 'v4c-abc' + (b.fn ? ' fn' : ''));
      abs(n, { x: 100 + i * (BW + GAPX), y: BY, w: BW, h: BH });
      const lt = K.el('div', 'lt', b.lt || '');
      if (b.icon) lt.appendChild(K.icon(b.icon));
      n.appendChild(lt);
      const col = K.el('div');
      col.appendChild(K.el('div', 'kk', b.kk));
      col.appendChild(K.el('div', 'tx', b.tx));
      n.appendChild(col);
      stage.appendChild(n);
      return n;
    });
    const boxArrows = [0, 1].map(i => {
      const a = K.el('div', 'v4c-arrowdiv');
      abs(a, { x: 100 + (i + 1) * BW + i * GAPX + GAPX / 2 - 25, y: BY + BH / 2 - 25 });
      a.innerHTML = '<svg viewBox="0 0 24 24"><path d="M3 8h9V3l9 9-9 9v-5H3z" fill="currentColor"/></svg>';
      stage.appendChild(a);
      return a;
    });

    // ---- beat 1: two dogs on a path; the left dog lunges toward the right one along a green arrow
    A.in(tl, h.title, cue(0) - 0.4, 'wipe', { dur: 0.9 });
    A.in(tl, h.bar, cue(0) + 0.2, 'grow', { dur: 0.5 });
    tl.fromTo(path, { opacity: 0 }, { opacity: 1, duration: 0.7 }, cue(0));
    A.in(tl, [dogL, dogR], cue(0) + 0.3, 'pop', { dur: 0.7, stagger: 0.15 });
    const tLunge = clamp(P(ctx, 0, 'may lunge toward', 0.45) - 0.1, cue(0) + 1.5, end(0) - 3);
    tl.to(dogL, { x: L1 - L0, rotation: 8, duration: 0.32, ease: 'power3.in' }, tLunge);
    tl.to(dogL, { rotation: 0, duration: 0.4, ease: 'back.out(2.5)' }, tLunge + 0.32);
    tl.fromTo(speed, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.2, stagger: 0.04, immediateRender: false }, tLunge + 0.2);
    tl.to(speed, { opacity: 0, duration: 0.4 }, tLunge + 0.8);
    tl.fromTo(lunge.shaft, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.45, ease: 'power2.out' }, tLunge + 0.05);
    tl.fromTo(lunge.head, { opacity: 0 }, { opacity: 1, duration: 0.2 }, tLunge + 0.4);
    A.in(tl, lungeLab, tLunge + 0.45, 'fadeUp', { dur: 0.6 });

    // ---- beat 2: the right dog slides away; a distance bar stretches between them
    const tAway = clamp(P(ctx, 1, 'moves away', 0.2) - 0.3, cue(1) + 0.2, end(1) - 3);
    const SD = 1.4;
    tl.to(dogR, { x: R1 - R0, duration: SD, ease: 'power2.inOut' }, tAway);
    tl.fromTo([bar, tk1, tk2], { opacity: 0 }, { opacity: 1, duration: 0.3 }, tAway);
    tl.to(bar, { attr: { x2: R1 }, duration: SD, ease: 'power2.inOut' }, tAway);
    tl.to(tk2, { attr: { x1: R1, x2: R1 }, duration: SD, ease: 'power2.inOut' }, tAway);
    A.dim(tl, [lunge.g, lungeLab], tAway + SD, 0.45);
    A.in(tl, moreLab, tAway + SD - 0.2, 'pop', { dur: 0.6 });
    const tSpace = clamp(P(ctx, 1, 'the dog moved toward', 0.55) - 0.2, tAway + SD + 0.4, end(1) - 1.2);
    A.in(tl, cap1, tSpace, 'fadeUp', { dur: 0.7 });
    tl.to(cap1.querySelector('.v4c-hl'), { backgroundSize: '100% 30%', duration: 0.7, ease: 'power2.inOut' }, clamp(P(ctx, 1, 'more space', 0.9), tSpace + 0.6, end(1)));

    // ---- beat 3: the B / C / function strip slides in beneath; the caption turns into the takeaway
    A.out(tl, cap1, cue(2) - 0.2, 'fadeUp', { dur: 0.4 });
    A.in(tl, cap2, cue(2) + 0.3, 'fadeUp', { dur: 0.7 });
    A.in(tl, boxEls, cue(2), 'fadeUp', { dur: 0.7, stagger: 0.35 });
    A.in(tl, boxArrows, cue(2) + 0.3, 'fadeRight', { dur: 0.5, stagger: 0.35 });
    A.pulse(tl, boxEls[2], cue(2) + 1.6, { scale: 1.05 });
  });
})();
