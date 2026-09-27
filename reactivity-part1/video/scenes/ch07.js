/*
 * Chapter 07: What is a trigger? (deck slide 14)
 *   ch07s01  What is a trigger?        heading + definition left, word cloud card right, then two thermometers
 *   ch07s02  Feeling first             Trigger > Emotion > Reaction flow, the startle pulse, "this is where we work"
 *   ch07s03  Every dog's list          the cloud's words lift off and scatter, then sort into six category cards
 *   ch07s04  Why exposing backfires    a dog crowded by triggers (flooding), then an exposure chart
 *   ch07s05  Your homework             Monday / Thursday calendars, then the trigger list worksheet
 *
 * Reusable part (window.CAD_PARTS.triggerFlow) so ch08 can call back the startle idea.
 */
(function () {
  const C = {
    green: '#619537', greenDark: '#3f6b22', greenDeep: '#2c4a17', greenLight: '#b8d99a', pale: '#e8f1dc',
    mist: '#f3f8ec', olive: '#4b5a1e', ink: '#212121', inkSoft: '#4a4a4a', muted: '#7a7a7a', line: '#d9ddd3',
    red: '#b8452d', redPale: '#f8e3dd', amber: '#d9912b', amberPale: '#fbefd9', amberText: '#a8650f',
    calm: '#7fb24a',
  };

  const CSS = `
  .c7-sub { position:absolute; font:500 40px/1.3 var(--font-body); color:var(--ink); white-space:nowrap; }
  .c7-pill { display:inline-flex; align-items:center; gap:14px; padding:14px 30px; border-radius:999px; font:700 34px/1 var(--font-head); white-space:nowrap; box-shadow:var(--shadow-soft); }
  .c7-pill svg { width:36px; height:36px; stroke-width:2.4; flex:0 0 auto; }
  .c7-pill.green { background:var(--green); color:#fff; }
  .c7-pill.red { background:var(--red-pale); color:var(--red); box-shadow:none; }
  .c7-pill.pale { background:var(--green-pale); color:var(--green-deep); box-shadow:none; }
  .c7-pill.grey { background:#eceee8; color:var(--ink-soft); box-shadow:none; border:2px solid #d6dacf; padding:12px 26px 12px 20px; font-size:30px; gap:12px; }
  .c7-pill.grey svg { width:32px; height:32px; }
  .c7-crow { position:absolute; display:flex; justify-content:center; align-items:center; }
  .c7-rrow { position:absolute; display:flex; justify-content:flex-end; align-items:center; }

  /* s01 */
  .c7-def { position:relative; padding:30px 48px 32px 40px; border-left:12px solid var(--green-light); border-radius:0 24px 24px 0;
    background:linear-gradient(90deg, var(--green-pale) 0%, rgba(232,241,220,0.25) 100%); }
  .c7-def-t { font:700 62px/1.1 var(--font-head); color:var(--ink); white-space:nowrap; }
  .c7-def-s { margin-top:14px; font:500 34px/1.35 var(--font-body); color:var(--ink-soft); white-space:nowrap; }
  .c7-quiet { position:relative; display:inline-flex; align-items:center; gap:26px; padding:18px 44px 18px 18px; background:#fff; border-radius:999px;
    box-shadow:var(--shadow-soft); border:1px solid #e6e9e1; }
  .c7-qb { width:84px; height:84px; border-radius:50%; background:var(--red-pale); color:var(--red); display:grid; place-items:center; flex:0 0 auto; }
  .c7-qb svg { width:46px; height:46px; stroke-width:2.2; }
  .c7-qt { font:700 42px/1.1 var(--font-head); color:var(--ink); white-space:nowrap; }
  .c7-cloud { position:absolute; overflow:hidden; border-radius:26px; background:#fff; box-shadow:var(--shadow); border:1px solid #e6e9e1; }
  .c7-cloud > img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; transform-origin:50% 50%; }
  .c7-veil { position:absolute; inset:0; background:rgba(250,251,248,0.93); }
  .c7-th { position:absolute; left:0; top:0; overflow:visible; }
  .c7-tbadge { position:absolute; width:104px; height:104px; border-radius:50%; background:#fff; display:grid; place-items:center; color:var(--green-dark);
    box-shadow:0 10px 26px rgba(40,60,20,0.14); border:1px solid #e6e9e1; }
  .c7-tbadge svg { width:54px; height:54px; stroke-width:2.2; }
  .c7-tlab { position:absolute; text-align:center; font:700 34px/1.1 var(--font-head); color:var(--ink); white-space:nowrap; }

  /* s02 */
  .c7-node { position:absolute; border-radius:50%; background:#fff; border:8px solid var(--line); display:flex; flex-direction:column; align-items:center;
    justify-content:center; gap:10px; box-shadow:0 16px 40px rgba(40,60,20,0.14), 0 3px 10px rgba(40,60,20,0.08); }
  .c7-node .ic { width:88px; height:88px; display:grid; place-items:center; }
  .c7-node .ic svg { width:88px; height:88px; stroke-width:2; }
  .c7-node .lb { font:700 38px/1 var(--font-head); color:var(--ink); }
  .c7-zap { position:absolute; width:96px; height:96px; border-radius:50%; background:var(--amber); color:#fff; display:grid; place-items:center;
    border:6px solid #fff; box-shadow:0 10px 24px rgba(120,70,10,0.25); }
  .c7-zap svg { width:50px; height:50px; stroke-width:2.2; fill:#fff; }

  /* s03 */
  .c7-w { position:absolute; transform-origin:0 0; z-index:10; }
  .c7-chip { display:block; white-space:nowrap; padding:8px 18px; border-radius:999px; font:600 28px/1.2 var(--font-head); color:var(--green-deep); }
  .c7-w .c7-chip { background:rgba(232,241,220,0); transform-origin:50% 50%; }
  .c7-cat { position:absolute; z-index:5; background:#fff; border-radius:26px; box-shadow:var(--shadow-soft); border:1px solid #e6e9e1; padding:22px 26px; }
  .c7-cat .hd { display:flex; align-items:center; gap:16px; }
  .c7-cat .bd { width:60px; height:60px; border-radius:18px; background:var(--green); color:#fff; display:grid; place-items:center; flex:0 0 auto; }
  .c7-cat .bd svg { width:34px; height:34px; stroke-width:2.2; }
  .c7-cat .nm { font:700 34px/1.1 var(--font-head); color:var(--ink); white-space:nowrap; }
  .c7-cat .chips { position:relative; display:flex; flex-wrap:wrap; gap:12px; margin-top:20px; }
  .c7-cat .chips .c7-chip { visibility:hidden; background:var(--green-pale); }
  .c7-cloudc { position:absolute; z-index:1; overflow:hidden; border-radius:22px; box-shadow:var(--shadow); background:#fff; }
  .c7-cloudc img { width:100%; height:100%; object-fit:cover; display:block; }

  /* s04 */
  .c7-rows { position:relative; display:flex; flex-direction:column; gap:22px; }
  .c7-row { display:flex; align-items:center; gap:24px; background:#fff; border-radius:24px; padding:16px 32px 16px 16px; box-shadow:var(--shadow-soft);
    border:1px solid #e6e9e1; width:740px; }
  .c7-row .rb { width:68px; height:68px; border-radius:50%; display:grid; place-items:center; flex:0 0 auto; }
  .c7-row .rb svg { width:38px; height:38px; stroke-width:2.4; }
  .c7-row .rt { font:600 34px/1.2 var(--font-body); color:var(--ink); white-space:nowrap; }
  .c7-row.q .rb { background:var(--green-pale); color:var(--green-dark); }
  .c7-row.r .rb { background:var(--red-pale); color:var(--red); }
  .c7-row.g .rb { background:var(--green); color:#fff; }
  .c7-clu { position:absolute; left:0; top:0; width:1920px; height:1080px; }
  .c7-dogb { position:absolute; border-radius:50%; background:#fff; border:8px solid var(--green); color:var(--green-dark); display:grid; place-items:center;
    box-shadow:0 16px 40px rgba(40,60,20,0.16); }
  .c7-dogb svg { width:56%; height:56%; stroke-width:2; }
  .c7-tb { position:absolute; border-radius:50%; background:#fff; color:var(--ink-soft); display:grid; place-items:center;
    box-shadow:0 8px 22px rgba(40,60,20,0.14); border:1px solid #e6e9e1; }
  .c7-tb svg { width:50%; height:50%; stroke-width:2.1; }
  .c7-stamp { display:inline-block; padding:16px 46px 12px; border:8px solid var(--red); border-radius:18px; color:var(--red); font:800 96px/1 var(--font-head);
    letter-spacing:6px; text-transform:uppercase; background:rgba(255,255,255,0.92); box-shadow:0 16px 40px rgba(120,30,10,0.18); }

  /* s05 */
  .c7-cal { position:absolute; background:#fff; border-radius:26px; box-shadow:var(--shadow); border:1px solid #e6e9e1; overflow:hidden; }
  .c7-cal .top { position:relative; height:122px; background:var(--green-dark); color:#fff; display:grid; place-items:center; font:700 50px/1 var(--font-head); }
  .c7-cal .ring { position:absolute; top:16px; width:20px; height:20px; border-radius:50%; background:rgba(255,255,255,0.85); }
  .c7-cal .cbody { display:flex; flex-direction:column; align-items:center; padding-top:44px; }
  .c7-cal .ico { width:150px; height:150px; border-radius:50%; background:var(--green-pale); color:var(--green-dark); display:grid; place-items:center; }
  .c7-cal .ico svg { width:82px; height:82px; stroke-width:2; }
  .c7-cal .nm { margin-top:20px; font:700 44px/1.1 var(--font-head); color:var(--ink); }
  .c7-stat { position:absolute; width:124px; height:124px; border-radius:50%; display:grid; place-items:center; color:#fff; border:6px solid #fff;
    box-shadow:0 12px 28px rgba(40,60,20,0.22); }
  .c7-stat.ok { background:var(--green); }
  .c7-stat.bad { background:var(--red); box-shadow:0 12px 28px rgba(120,30,10,0.3); }
  .c7-stat svg { width:64px; height:64px; stroke-width:2.6; }
  .c7-clip { position:absolute; width:150px; height:150px; border-radius:50%; background:var(--green); color:#fff; display:grid; place-items:center;
    border:6px solid #fff; box-shadow:var(--shadow); z-index:6; }
  .c7-clip svg { width:76px; height:76px; stroke-width:2.2; }
  .c7-ws { position:absolute; background:#fff; border-radius:26px; box-shadow:var(--shadow); border:1px solid #e6e9e1; }
  .c7-ws svg.lines { position:absolute; left:0; top:0; overflow:visible; }
  .c7-ws .ttl { position:absolute; font:700 50px/1 var(--font-head); color:var(--ink); white-space:nowrap; }
  .c7-ws .th { position:absolute; font:700 32px/1 var(--font-head); color:var(--green-dark); white-space:nowrap; }
  .c7-ws .th2 { position:absolute; font:600 26px/1 var(--font-body); color:var(--muted); white-space:nowrap; }
  .c7-ws .cell { position:absolute; }
  .c7-wr { position:relative; display:inline-block; }
  .c7-wr .txt { display:block; overflow:hidden; white-space:nowrap; max-width:0; font:italic 500 36px/1.25 var(--font-body); color:var(--ink); }
  .c7-wr .pen { position:absolute; left:100%; bottom:4px; margin-left:2px; width:56px; height:56px; color:var(--green-dark); }
  .c7-wr .pen svg { width:56px; height:56px; }
  .c7-qrow { position:absolute; display:flex; align-items:center; gap:22px; background:var(--amber-pale); border-radius:18px; padding:0 28px 0 14px; }
  .c7-qrow .eb { width:62px; height:62px; border-radius:50%; background:#fff; color:${C.amberText}; display:grid; place-items:center; flex:0 0 auto;
    box-shadow:0 4px 12px rgba(120,70,10,0.14); }
  .c7-qrow .eb svg { width:36px; height:36px; stroke-width:2.3; }
  .c7-qrow .ql { font:700 34px/1 var(--font-head); color:var(--ink); white-space:nowrap; }
  .c7-try { display:inline-flex; align-items:center; gap:12px; padding:14px 26px 14px 18px; border-radius:999px; background:var(--green); color:#fff;
    font:700 26px/1 var(--font-body); letter-spacing:3px; text-transform:uppercase; white-space:nowrap; box-shadow:0 10px 22px rgba(44,74,23,0.26); }
  .c7-try svg { width:32px; height:32px; stroke-width:2.4; }
  `;

  // ------------------------------------------------------------------ helpers
  const addCss = stage => { if (!stage.querySelector('style.c7-css')) stage.appendChild(K.el('style', 'c7-css', CSS)); };
  const div = (parent, cls, html) => { const n = K.el('div', cls, html == null ? null : html); parent.appendChild(n); return n; };
  const iconIn = (parent, name, o) => { parent.appendChild(K.icon(name, o)); return parent; };
  /** a time a fraction f of the way through beat i's narration */
  const fracOf = (cue, end) => (i, f) => window.fracTime(window.__ctx, i, f);
  /** horizontally centred row at (cx, y) */
  function centerRow(parent, cx, y, w = 1200) {
    const r = div(parent, 'c7-crow');
    K.place(r, { x: cx - w / 2, y, w });
    return r;
  }
  /** pill with optional icon */
  function pill(parent, html, tone, icon) {
    const p = div(parent, 'c7-pill ' + (tone || ''));
    if (icon) p.appendChild(K.icon(icon));
    p.appendChild(K.el('span', null, K.md(html)));
    return p;
  }
  /** Subtitle lines that replace each other in the same spot. show(i, t) fades the previous one out. */
  function subtitles(parent, texts, x, y) {
    const els = texts.map(s => { const n = div(parent, 'c7-sub', K.md(s)); K.place(n, { x, y }); return n; });
    return {
      els,
      show(tl, i, t) {
        if (i > 0) A.out(tl, els[i - 1], t, 'fadeUp', { dur: 0.35 });
        A.in(tl, els[i], i > 0 ? t + 0.25 : t, 'fadeUp', { dur: 0.6 });
      },
    };
  }
  /** Straight arrow with an open chevron head, in an svg. Returns {g, shaft, head}. */
  function arrow(svg, x1, y1, x2, y2, o = {}) {
    const g = K.group(svg);
    const len = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / len, uy = (y2 - y1) / len;
    const sw = o.width ?? 10, hl = o.head ?? 28, a = (40 * Math.PI) / 180, ang = Math.atan2(uy, ux);
    const shaft = K.line(g, x1, y1, x2 - ux * 3, y2 - uy * 3, { stroke: o.color || C.muted, 'stroke-width': sw });
    const ax = x2 - hl * Math.cos(ang - a), ay = y2 - hl * Math.sin(ang - a);
    const bx = x2 - hl * Math.cos(ang + a), by = y2 - hl * Math.sin(ang + a);
    const head = K.path(g, `M${ax} ${ay} L${x2} ${y2} L${bx} ${by}`, { stroke: o.color || C.muted, 'stroke-width': sw, fill: 'none' });
    return { g, shaft, head };
  }
  /** Smooth path through points (Catmull-Rom to cubic Bezier). */
  function smooth(pts) {
    let d = `M${pts[0][0]} ${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0]} ${p2[1]}`;
    }
    return d;
  }
  /** Layout position of el relative to the scene layer (ignores transforms, so safe mid-animation). */
  function layoutXY(el, root) {
    let x = el.offsetLeft, y = el.offsetTop, p = el.offsetParent;
    while (p && p !== root) { x += p.offsetLeft + p.clientLeft; y += p.offsetTop + p.clientTop; p = p.offsetParent; }
    return [x, y];
  }
  /** Number of yoyo repeats (odd count so it ends where it started) that fit between t0 and t1. */
  const yoyoCount = (t0, t1, half) => { const n = Math.floor((t1 - t0) / half); return Math.max(1, n % 2 ? n : n - 1); };

  // ------------------------------------------------------------------ Trigger > Emotion > Reaction (shared part)
  /**
   * Three round nodes with arrows between them. o: {y, xs:[x1,x2,x3], r}
   * Returns {nodes:[{n, ic, cx, cy}], arrows:[{g, shaft, head}], svg, r, y, xs}. Reveal with flowIn().
   */
  function triggerFlow(stage, o = {}) {
    addCss(stage);
    const y = o.y ?? 590, xs = o.xs || [440, 960, 1480], r = o.r ?? 128;
    // gap between each arrow end and its node; a bigger gap around a node leaves room for a ring
    const pads = o.pads || [[26, 26], [26, 26]];
    const svg = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const ends = [0, 1].map(i => [xs[i] + r + pads[i][0], xs[i + 1] - r - pads[i][1]]);
    const arrows = ends.map(([a, b]) => arrow(svg, a, y, b, y, { color: '#a9b39d', width: 10, head: 26 }));
    const defs = [
      ['triangle-alert', 'Trigger', C.amber, C.amberText],
      ['heart', 'Emotion', C.red, C.red],
      ['volume-2', 'Reaction', C.olive, C.olive],
    ];
    const nodes = defs.map(([icon, label, ring, col], i) => {
      const n = div(stage, 'c7-node');
      K.place(n, { x: xs[i] - r, y: y - r, w: 2 * r, h: 2 * r });
      n.style.borderColor = ring;
      const ic = div(n, 'ic');
      ic.style.color = col;
      iconIn(ic, icon);
      div(n, 'lb', label);
      return { n, ic, cx: xs[i], cy: y };
    });
    return { nodes, arrows, ends, svg, r, y, xs };
  }
  /** Draw the three nodes left to right starting at t (about 1.4 s). */
  function flowIn(tl, F, t) {
    A.in(tl, F.nodes[0].n, t, 'pop', { dur: 0.55 });
    A.draw(tl, [F.arrows[0].shaft], t + 0.3, 0.35);
    A.draw(tl, [F.arrows[0].head], t + 0.6, 0.15);
    A.in(tl, F.nodes[1].n, t + 0.5, 'pop', { dur: 0.55 });
    A.draw(tl, [F.arrows[1].shaft], t + 0.8, 0.35);
    A.draw(tl, [F.arrows[1].head], t + 1.1, 0.15);
    A.in(tl, F.nodes[2].n, t + 1.0, 'pop', { dur: 0.55 });
  }
  window.CAD_PARTS = Object.assign(window.CAD_PARTS || {}, { triggerFlow, flowIn });

  // ================================================================== ch07s01  What is a trigger?
  registerScene('ch07s01', ({ stage, tl, cue, dur, phrase }) => {
    addCss(stage);
    const c0 = cue(0), c1 = cue(1);

    // --- left column: heading, definition band, (beat 1) the quiet callout
    const f = K.flow(stage, { x: 100, y: 110, w: 1060, h: 850, valign: 'center', gap: 50 });
    const h = K.heading(f, 'What is a trigger?', { size: 96 });
    const def = div(f, 'c7-def');
    const defT = div(def, 'c7-def-t', K.md('Anything that raises *stress*'));
    const defS = div(def, 'c7-def-s', 'Whether they react out loud or not.');
    const quiet = div(f, 'c7-quiet');
    iconIn(div(quiet, 'c7-qb'), 'volume-x');
    div(quiet, 'c7-qt', K.md('Quiet can still be !!stressed!!'));

    // --- right: the deck's word cloud as a portrait card
    const CW = 513, CH = 770, CX = 1250, CY = 180;
    const card = div(stage, 'c7-cloud');
    K.place(card, { x: CX, y: CY, w: CW, h: CH });
    const img = K.el('img');
    img.src = '../assets/img/trigger_wordcloud.jpg';
    card.appendChild(img);
    const veil = div(card, 'c7-veil');

    // two thermometers drawn over the dimmed cloud (card coordinates)
    const svg = K.svgEl('svg', { viewBox: `0 0 ${CW} ${CH}`, width: CW, height: CH, class: 'c7-th' }, card);
    const TOP = 214, BOT = 612, LEVEL = 258;
    const thermo = cx => {
      const g = K.group(svg);
      const hw = 36, br = 62, jy = Math.sqrt(br * br - hw * hw);
      K.path(g, `M${cx - hw} ${BOT - jy} L${cx - hw} ${TOP + hw} A${hw} ${hw} 0 0 1 ${cx + hw} ${TOP + hw} L${cx + hw} ${BOT - jy} A${br} ${br} 0 1 1 ${cx - hw} ${BOT - jy} Z`,
        { fill: '#fff', stroke: '#cfd6c5', 'stroke-width': 6 });
      const ticks = [0, 1, 2, 3, 4, 5].map(k => {
        const ty = LEVEL + k * 62;
        return K.line(g, cx + hw + 12, ty, cx + hw + (k % 2 ? 26 : 36), ty, { stroke: k < 2 ? C.red : '#c9cfbf', 'stroke-width': 5 });
      });
      const mw = 18, mr = 44, mj = Math.sqrt(mr * mr - mw * mw);
      const clipId = 'c7tc' + Math.round(cx);
      const defs = K.svgEl('defs', {}, g);
      const cp = K.svgEl('clipPath', { id: clipId }, defs);
      const clipRect = K.rect(cp, cx - 90, BOT - mr - 4, 180, 200, { fill: '#fff' });
      const merc = K.path(g, `M${cx - mw} ${BOT - mj} L${cx - mw} ${TOP + 20 + mw} A${mw} ${mw} 0 0 1 ${cx + mw} ${TOP + 20 + mw} L${cx + mw} ${BOT - mj} A${mr} ${mr} 0 1 1 ${cx - mw} ${BOT - mj} Z`,
        { fill: C.calm, stroke: 'none', 'clip-path': `url(#${clipId})` });
      return { g, clipRect, merc, ticks };
    };
    const TX = [140, 373];
    const th = TX.map(thermo);
    const level = K.group(svg);
    K.line(level, TX[0] - 70, LEVEL, TX[1] + 70, LEVEL, { stroke: C.red, 'stroke-width': 4, 'stroke-dasharray': '12 12', 'stroke-linecap': 'butt' });
    const badges = [['volume-2', 'Barking'], ['eye', 'Frozen stare']].map(([icon, lab], i) => {
      const b = div(card, 'c7-tbadge');
      K.place(b, { x: TX[i] - 52, y: 66 });
      iconIn(b, icon);
      const l = div(card, 'c7-tlab', lab);
      K.place(l, { x: TX[i] - 140, y: 700, w: 280 });
      return { b, l };
    });

    // --- beat 0: heading writes on and the cloud card fades in with the examples; the definition lands in the
    // band when it is said ("A trigger is anything..."), its second line on "whether they react"
    A.in(tl, h.title, Math.max(0.1, c0 - 0.3), 'wipe', { dur: 1.0 });
    A.in(tl, h.bar, c0 + 0.2, 'grow', { dur: 0.6 });
    tl.fromTo(card, { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 0.9 }, c0);
    A.kenburns(tl, img, { from: 1.0, to: 1.07, t0: c0, t1: dur });
    const tDef = Math.max(c0 + 0.5, phrase(0, 'a trigger is anything') - 0.3);
    A.in(tl, def, tDef, 'wipe', { dur: 0.7 });
    A.in(tl, defT, tDef + 0.2, 'fadeUp', { dur: 0.6 });
    A.in(tl, defS, Math.max(tDef + 0.4, phrase(0, 'whether they react') - 0.3), 'fadeUp', { dur: 0.6 });

    // --- beat 1: the cloud dims, two thermometers fill to the same red level
    tl.fromTo(veil, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' }, c1);
    tl.fromTo(img, { filter: 'blur(0px)' }, { filter: 'blur(4px)', duration: 0.5, ease: 'power2.out', immediateRender: false }, c1);
    tl.fromTo(svg, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' }, c1 + 0.1);
    badges.forEach((b, i) => {
      A.in(tl, b.b, c1 + 0.15 + i * 0.12, 'pop', { dur: 0.5 });
      A.in(tl, b.l, c1 + 0.25 + i * 0.12, 'fadeUp', { dur: 0.5 });
    });
    th.forEach((m, i) => {
      const t = c1 + 0.35 + i * 0.1;
      tl.to(m.clipRect, { attr: { y: LEVEL, height: BOT + 80 - LEVEL }, duration: 1.0, ease: 'power2.inOut' }, t);
      tl.fromTo(m.merc, { fill: C.calm }, { fill: C.red, duration: 1.0, ease: 'power1.in' }, t);
    });
    tl.fromTo(level, { opacity: 0 }, { opacity: 1, duration: 0.4 }, c1 + 1.3);
    A.in(tl, quiet, c1 + 0.3, 'fadeUp', { dur: 0.7 });
  });

  // ================================================================== ch07s02  Feeling first
  registerScene('ch07s02', ({ stage, tl, cue, end, phrase }) => {
    addCss(stage);
    const at = fracOf(cue, end);
    const c0 = cue(0), c1 = cue(1), c2 = cue(2);
    const h = K.heading(stage, 'Feeling first', { x: 100, y: 120, size: 84 });
    const sub = subtitles(stage, ['Trigger. Emotion. Reaction.', 'Feeling first, then reaction', 'Change the *feeling*'], 100, 270);

    // the arrows stop short of the Emotion node so the beat-3 ring never crosses them
    const RING = 168;
    const F = triggerFlow(stage, { y: 600, xs: [410, 960, 1510], r: 128, pads: [[26, RING - 128 + 28], [RING - 128 + 28, 26]] });
    const [nT, nE, nR] = F.nodes;
    const svg = F.svg;
    const [[a1s, a1e], [a2s, a2e]] = F.ends;

    // beat 1 parts: travelling pulse dots, burst rays, zap badge, sound arcs
    const dot1 = K.circle(svg, a1s, F.y, 11, { fill: C.amber, opacity: 0 });
    const dot2 = K.circle(svg, a2s, F.y, 11, { fill: C.red, opacity: 0 });
    const rays = [-112.5, -67.5, -22.5, 22.5, 157.5, 202.5].map(d => {
      const t = (d * Math.PI) / 180;
      return K.line(svg, nE.cx + 158 * Math.cos(t), F.y + 158 * Math.sin(t), nE.cx + 196 * Math.cos(t), F.y + 196 * Math.sin(t), { stroke: C.amber, 'stroke-width': 9 });
    });
    const zap = div(stage, 'c7-zap');
    K.place(zap, { x: nE.cx + 70, y: F.y - 150 });
    iconIn(zap, 'zap');
    const arcs = [168, 204, 240].map((rr, i) => {
      const s = (32 * Math.PI) / 180;
      return K.path(svg, `M${nR.cx + rr * Math.cos(-s)} ${F.y + rr * Math.sin(-s)} A${rr} ${rr} 0 0 1 ${nR.cx + rr * Math.cos(s)} ${F.y + rr * Math.sin(s)}`,
        { stroke: C.red, 'stroke-width': 9 - i * 1.5 });
    });

    // beat 2 parts: green ring and its label
    const ring = K.circle(svg, nE.cx, F.y, RING, { fill: 'none', stroke: C.green, 'stroke-width': 9, transform: `rotate(-90 ${nE.cx} ${F.y})` });
    const lr = centerRow(stage, nE.cx, F.y + 200, 900);
    const workP = pill(lr, 'This is where we work', 'green', 'target');

    // --- beat 0: heading, then each node lands as it is named ("the trigger causes an emotion ... the reaction")
    A.in(tl, h.all, 0.15, 'fadeUp', { stagger: 0.12 });
    const tN0 = Math.max(c0 + 0.1, phrase(0, 'the trigger') - 0.25);
    const tN1 = Math.max(tN0 + 0.6, phrase(0, 'an emotion') - 0.25);
    const tN2 = Math.max(tN1 + 0.6, phrase(0, 'the reaction') - 0.25);
    sub.show(tl, 0, tN0);
    A.in(tl, nT.n, tN0, 'pop', { dur: 0.55 });
    A.draw(tl, [F.arrows[0].shaft], tN1 - 0.25, 0.3);
    A.draw(tl, [F.arrows[0].head], tN1 + 0.05, 0.15);
    A.in(tl, nE.n, tN1, 'pop', { dur: 0.55 });
    A.draw(tl, [F.arrows[1].shaft], tN2 - 0.25, 0.3);
    A.draw(tl, [F.arrows[1].head], tN2 + 0.05, 0.15);
    A.in(tl, nR.n, tN2, 'pop', { dur: 0.55 });

    // --- beat 1: the startle. Emotion jolts on "boo" (heart leaps), the reaction fires on "scream second"
    sub.show(tl, 1, c1);
    const tJ = Math.max(c1 + 0.3, phrase(1, 'boo') - 0.35);
    A.pulse(tl, nT.n, tJ, { scale: 1.08 });
    tl.fromTo(dot1, { opacity: 1, attr: { cx: a1s } }, { opacity: 1, attr: { cx: a1e }, duration: 0.3, ease: 'power2.in', immediateRender: false }, tJ + 0.05);
    tl.to(dot1, { opacity: 0, duration: 0.1 }, tJ + 0.35);
    tl.to(nE.n, { scale: 1.26, duration: 0.3, ease: 'back.out(2.2)' }, tJ + 0.35);
    tl.to(nE.n, { scale: 1.06, duration: 0.6, ease: 'power2.inOut' }, tJ + 0.95);
    A.in(tl, zap, tJ + 0.4, 'pop', { dur: 0.45 });
    A.draw(tl, rays, tJ + 0.4, 0.3, { stagger: 0.02 });
    tl.to(rays, { opacity: 0, duration: 0.4 }, tJ + 1.0);
    const tR = Math.min(end(1) - 0.3, Math.max(tJ + 1.6, phrase(1, 'scream second') - 0.3));
    tl.fromTo(dot2, { opacity: 1, attr: { cx: a2s } }, { opacity: 1, attr: { cx: a2e }, duration: 0.45, ease: 'power1.inOut', immediateRender: false }, tR - 0.4);
    tl.to(dot2, { opacity: 0, duration: 0.1 }, tR + 0.05);
    tl.to(nR.n, { borderColor: C.red, backgroundColor: C.redPale, duration: 0.3 }, tR);
    tl.to(nR.ic, { color: C.red, duration: 0.3 }, tR);
    A.pulse(tl, nR.n, tR, { scale: 1.08 });
    A.in(tl, arcs, tR + 0.05, 'fade', { dur: 0.25, stagger: 0.1 });
    // the heart keeps pounding while the story plays out
    const hbN = yoyoCount(tJ + 1.0, end(1), 0.32);
    tl.fromTo(nE.ic, { scale: 1 }, { scale: 1.14, duration: 0.32, ease: 'sine.inOut', yoyo: true, repeat: hbN }, tJ + 1.0);

    // --- beat 2: green ring around the Emotion node, then the feeling calms and the reaction follows
    sub.show(tl, 2, c2);
    A.draw(tl, ring, c2 + 0.1, 0.9);
    A.in(tl, workP, c2 + 0.6, 'fadeUp', { dur: 0.6 });
    const tCalm = Math.max(c2 + 2.0, at(2, 0.55));
    tl.to(nE.n, { borderColor: C.green, backgroundColor: C.mist, scale: 1, duration: 0.8, ease: 'power2.inOut' }, tCalm);
    tl.to(nE.ic, { color: C.greenDark, duration: 0.8 }, tCalm);
    tl.to(zap, { opacity: 0, scale: 0.6, duration: 0.5, ease: 'power2.in' }, tCalm);
    tl.to(arcs, { opacity: 0, duration: 0.6, stagger: 0.08 }, tCalm + 0.5);
    tl.to(nR.n, { borderColor: C.green, backgroundColor: '#ffffff', duration: 0.8 }, tCalm + 0.5);
    tl.to(nR.ic, { color: C.greenDark, duration: 0.8 }, tCalm + 0.5);
  });

  // ================================================================== ch07s03  Every dog's list
  const CATS = [
    { name: 'People', icon: 'users', words: ['Strangers', 'Joggers', 'Running children', 'Visitors', 'Hats'] },
    { name: 'Dogs and animals', icon: 'dog', words: ['Other dogs', 'Cats', 'Squirrels', 'Birds'] },
    { name: 'Sounds', icon: 'volume-2', words: ['Doorbell', 'Sirens', 'Fireworks', 'Thunder'] },
    { name: 'Moving things', icon: 'bike', words: ['Bikes', 'Skateboards', 'Strollers', 'Buses'] },
    { name: 'Handling', icon: 'hand', words: ['Nail trims', 'Being touched', 'Grooming', 'Leash restraint'] },
    { name: 'Places and situations', icon: 'map-pin', words: ['Vet visits', 'Crowds', 'Being left alone', 'New places'] },
  ];
  // scatter layout: 7 rows x 3 horizontal segments. Words of a later column only sit in that column's segment or to its right.
  const SCATTER = [
    [[['Strangers', 1.35], ['Horn', 1.25]], [['Motorcycles', 1.2], ['Doorbell', 1.35]], [['Vet visits', 1.3], ['Crowds', 1.35]]],
    [[['Garbage truck', 1.2], ['Cats', 1.45]], [['Joggers', 1.4], ['Skateboards', 1.25]], [['Nail trims', 1.35], ['Loud noises', 1.1]]],
    [[['Other dogs', 1.3], ['Knocking', 1.2]], [['Sirens', 1.4], ['Umbrellas', 1.2]], [['Being touched', 1.25], ['Buses', 1.35]]],
    [[['Delivery driver', 1.15], ['Birds', 1.4]], [['Hats', 1.5], ['Fireworks', 1.3]], [['Grooming', 1.3], ['Wheels', 1.2]]],
    [[['Running children', 1.3], ['Trucks', 1.15]], [['Vacuum cleaner', 1.15], ['Strollers', 1.3]], [['New places', 1.3], ['Fences', 1.2]]],
    [[['Squirrels', 1.35], ['Footsteps', 1.2]], [['Thunder', 1.3], ['Bikes', 1.3]], [['Being left alone', 1.25]]],
    [[['Visitors', 1.35], ['Lawn mower', 1.15]], [['Shouting', 1.2], ['Suitcases', 1.15]], [['Leash restraint', 1.2], ['Car doors', 1.1]]],
  ];
  // where each word sits in trigger_wordcloud.jpg (1024 x 1536), so it can lift off the picture
  const CLOUD_XY = {
    Strangers: [660, 840], Horn: [895, 165], Motorcycles: [525, 260], Doorbell: [210, 335], 'Vet visits': [845, 1165], Crowds: [125, 630],
    'Garbage truck': [170, 250], Cats: [320, 645], Joggers: [610, 160], Skateboards: [490, 70], 'Nail trims': [850, 1340], 'Loud noises': [190, 1150],
    'Other dogs': [160, 745], Knocking: [150, 430], Sirens: [450, 355], Umbrellas: [460, 750], 'Being touched': [850, 1255], Buses: [870, 915],
    'Delivery driver': [860, 255], Birds: [720, 625], Hats: [670, 740], Fireworks: [900, 370], Grooming: [145, 1250], Wheels: [385, 940],
    'Running children': [790, 1090], Trucks: [135, 935], 'Vacuum cleaner': [500, 440], Strollers: [900, 745], 'New places': [540, 1150],
    Fences: [565, 1365], Squirrels: [515, 640], Footsteps: [135, 840], Thunder: [680, 350], Bikes: [150, 60], 'Being left alone': [285, 1355],
    Visitors: [905, 555], 'Lawn mower': [860, 460], Shouting: [400, 850], Suitcases: [910, 830], 'Leash restraint': [835, 1420], 'Car doors': [550, 540],
  };
  const CLOUD_PAL = ['#5f7a2c', '#3e7a78', '#5b6f96', '#b5873a', '#3f3f3f', '#4a6a34'];

  registerScene('ch07s03', ({ stage, tl, cue, end, phrase }) => {
    addCss(stage);
    const c = [0, 1, 2, 3].map(cue);
    const h = K.heading(stage, 'Every dog’s list', { x: 100, y: 110, size: 76 });
    const sub = subtitles(stage, ['Every dog has *their own* list', 'Six kinds of triggers'], 100, 244);

    // the word cloud card the words lift off from
    const IMG = { x: 760, y: 330, w: 400, h: 600 };
    const ks = IMG.h / 1536;
    const cloud = div(stage, 'c7-cloudc');
    K.place(cloud, IMG);
    const cimg = K.el('img');
    cimg.src = '../assets/img/trigger_wordcloud.jpg';
    cloud.appendChild(cimg);

    // category cards: column = beat (1, 2, 3), two cards per column
    const GX = [100, 687, 1274], GW = 546, GY = [322, 646], GH = 296;
    const catOf = {};
    const cards = CATS.map((cat, i) => {
      const card = div(stage, 'c7-cat');
      K.place(card, { x: GX[Math.floor(i / 2)], y: GY[i % 2], w: GW, h: GH });
      const hd = div(card, 'hd');
      iconIn(div(hd, 'bd'), cat.icon);
      div(hd, 'nm', cat.name);
      const chips = div(card, 'chips');
      const ph = {};
      cat.words.forEach(w => { ph[w] = K.el('span', 'c7-chip', w); chips.appendChild(ph[w]); catOf[w] = i; });
      return { card, ph };
    });

    // scattered live words
    const SEG = [[110, 650], [690, 1230], [1270, 1810]];
    const est = t => t.length * 15.6 + 36;     // chip width at scale 1 (Rubik 600 28px + padding)
    const CHIP_H = 49.6;
    const JIT = [-8, 6, -3, 8, -6, 3, -8, 5];
    const ROT = [-4, 3, -2, 4, -3, 2, -5, 3, -1];
    const words = [];
    let n = 0;
    SCATTER.forEach((row, r) => row.forEach((seg, si) => {
      const [x0, x1] = SEG[si];
      const ws = seg.map(([t, s]) => ({ t, s, w: est(t) * s }));
      let tot = ws.reduce((a, b) => a + b.w, 0);
      const minGap = 18;
      if (tot + minGap * (ws.length + 1) > x1 - x0) {
        const k = (x1 - x0 - minGap * (ws.length + 1)) / tot;
        ws.forEach(o => { o.s *= k; o.w *= k; });
        tot *= k;
      }
      const gap = (x1 - x0 - tot) / (ws.length + 1);
      let x = x0 + gap;
      ws.forEach(o => {
        const cy = 370 + r * 85 + JIT[n % JIT.length];
        const left = Math.round(x), top = Math.round(cy - (CHIP_H * o.s) / 2);
        const el = div(stage, 'c7-w');
        K.place(el, { x: left, y: top });
        const chip = K.el('span', 'c7-chip', o.t);
        const color = CLOUD_PAL[(n * 5 + r) % CLOUD_PAL.length];
        chip.style.color = color;
        el.appendChild(chip);
        const [ix, iy] = CLOUD_XY[o.t] || [512, 768];
        const s0 = 0.72;
        const sx = IMG.x + ix * ks - (s0 * est(o.t)) / 2, sy = IMG.y + iy * ks - (s0 * CHIP_H) / 2;
        words.push({ t: o.t, el, chip, color, left, top, s: o.s, rot: ROT[n % ROT.length], seg: si, cat: catOf[o.t] ?? -1, dx0: sx - left, dy0: sy - top, s0, n });
        x += o.w + gap;
        n++;
      });
    }));

    // --- beat 0: heading, the cloud, words lift off and scatter, "Hats" pops
    A.in(tl, h.all, 0.15, 'fadeUp', { stagger: 0.12 });
    sub.show(tl, 0, c[0] + 0.1);
    tl.fromTo(cloud, { opacity: 0, scale: 1.04 }, { opacity: 1, scale: 1, duration: 0.6 }, 0.1);
    tl.to(cloud, { opacity: 0, duration: 0.9, ease: 'power2.inOut' }, c[0] + 0.35);
    const order = words.slice().sort((a, b) => ((a.n * 17) % 41) - ((b.n * 17) % 41));
    order.forEach((w, i) => {
      const t = c[0] + 0.3 + i * 0.012;
      tl.fromTo(w.el, { x: w.dx0, y: w.dy0, scale: w.s0, rotation: 0 }, { x: 0, y: 0, scale: w.s, rotation: w.rot, duration: 0.85, ease: 'power3.inOut' }, t);
      tl.fromTo(w.el, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power1.out' }, t);
    });
    const hats = words.find(w => w.t === 'Hats');
    const tHat = Math.max(c[0] + 2.6, end(0) - 1.4);
    tl.set(hats.el, { zIndex: 30 }, tHat);
    tl.to(hats.chip, { scale: 1.6, color: C.red, duration: 0.35, ease: 'back.out(2.2)' }, tHat);
    tl.to(hats.chip, { scale: 1, color: hats.color, duration: 0.5, ease: 'power2.inOut' }, Math.min(tHat + 1.0, c[1] - 0.6));

    // --- beats 1 to 3: two categories per beat. Unsorted words dim; stray words fade as their column fills.
    // At the beat start ("As I sort them") both categories' words glide into their slots, still in cloud colours,
    // so no word ever sits on a card. Each card then fades in under its words when the narration names it,
    // and its words turn into green chips.
    const extras = words.filter(w => w.cat < 0);
    const later = words.filter(w => w.cat >= 2);
    const CAT_SAY = ['people', 'dogs and other animals', 'sounds', 'moving things', 'handling', 'places and situations'];
    let tLast = 0;
    tl.to(later.concat(extras.filter(w => w.seg > 0)).map(w => w.el), { opacity: 0.26, duration: 0.5, ease: 'power2.out' }, c[1]);
    [1, 2, 3].forEach(b => {
      const gone = extras.filter(w => w.seg === b - 1).map(w => w.el);
      if (gone.length) tl.to(gone, { opacity: 0, duration: 0.45, ease: 'power2.out' }, c[b]);
      const tSort = c[b] + 0.1;
      // each word is picked up as a solid white token (so paths that cross read as tokens passing, never text on text)
      words.filter(w => w.cat === (b - 1) * 2 || w.cat === (b - 1) * 2 + 1).forEach((w, k) => {
        const card = cards[w.cat];
        const t = tSort + k * 0.07;
        const tgt = () => layoutXY(card.ph[w.t], stage);
        tl.set(w.el, { zIndex: 20 + k }, t);
        tl.fromTo(w.chip, { backgroundColor: 'rgba(255,255,255,0)', boxShadow: '0px 6px 16px rgba(40,60,20,0)' },
          { backgroundColor: 'rgba(255,255,255,1)', boxShadow: '0px 6px 16px rgba(40,60,20,0.16)', duration: 0.25, ease: 'power1.out', immediateRender: false }, t);
        tl.to(w.el, { x: () => tgt()[0] - w.left, y: () => tgt()[1] - w.top, scale: 1, rotation: 0, opacity: 1, duration: 0.9, ease: 'power3.inOut' }, t);
      });
      let prev = tSort + 0.3;
      [0, 1].forEach(j => {
        const ci = (b - 1) * 2 + j;
        const card = cards[ci];
        const t0 = Math.min(end(b) - 0.6, Math.max(prev + (j ? 1.0 : 0.3), phrase(b, CAT_SAY[ci]) - 0.3));
        prev = t0;
        tLast = t0;
        A.in(tl, card.card, t0, 'fade', { dur: 0.55 });
        words.filter(w => w.cat === ci).forEach((w, k) => {
          tl.to(w.chip, { backgroundColor: 'rgba(232,241,220,1)', color: C.greenDeep, boxShadow: '0px 6px 16px rgba(40,60,20,0)', duration: 0.45, ease: 'power2.out' }, t0 + 0.25 + k * 0.06);
        });
      });
    });
    // the sixth card completes the set
    sub.show(tl, 1, Math.max(c[3] + 0.9, tLast + 0.6));
  });

  // ================================================================== ch07s04  Why just exposing them backfires
  registerScene('ch07s04', ({ stage, tl, cue, end, phrase }) => {
    addCss(stage);
    const c = [0, 1, 2, 3].map(cue);
    const at = fracOf(cue, end);

    // --- left: heading + the four key lines, one per beat
    const f = K.flow(stage, { x: 100, y: 110, w: 780, h: 850, valign: 'center', gap: 56 });
    const h = K.heading(f, 'Why just exposing them backfires', { size: 76, w: 780 });
    const rowsBox = div(f, 'c7-rows');
    const rowDefs = [
      ['q', 'circle-help', 'Just expose them?'],
      ['r', 'waves', '!!Flooding:!! just surviving it'],
      ['r', 'trending-up', '!!Sensitization:!! fear grows'],
      ['g', 'trending-down', '*Distance and dose*'],
    ];
    const rows = rowDefs.map(([tone, icon, txt]) => {
      const r = div(rowsBox, 'c7-row ' + tone);
      iconIn(div(r, 'rb'), icon);
      div(r, 'rt', K.md(txt));
      return r;
    });

    // --- right: the dog crowded by triggers
    const CXc = 1370, CYc = 575;
    const clu = div(stage, 'c7-clu');
    clu.style.transformOrigin = `${CXc}px ${CYc}px`;
    const ringDefs = [
      { r: 170, a0: -90, icons: ['bike', 'car', 'bell-ring', 'siren', 'users', 'cat', 'umbrella', 'truck'] },
      { r: 285, a0: -67.5, icons: ['baby', 'volume-2', 'party-popper', 'cloud-lightning', 'hand', 'footprints', 'squirrel', 'bus'] },
    ];
    const RJ = [8, -10, 4, -6, 10, -4, 6, -8], AJ = [4, -5, 2, -3, 5, -2, 3, -4], SZ = [100, 94, 106, 96, 102, 92, 104, 98];
    const trig = [];
    ringDefs.forEach((rd, ri) => rd.icons.forEach((name, k) => {
      const a = ((rd.a0 + k * 45 + AJ[(k + ri * 3) % 8]) * Math.PI) / 180;
      const rr = rd.r + RJ[(k + ri * 5) % 8], sz = SZ[(k + ri * 2) % 8];
      const x = CXc + rr * Math.cos(a), y = CYc + rr * Math.sin(a);
      const b = div(clu, 'c7-tb');
      K.place(b, { x: x - sz / 2, y: y - sz / 2, w: sz, h: sz });
      iconIn(b, name);
      trig.push({ b, dx: Math.cos(a) * 380, dy: Math.sin(a) * 380, ri, k });
    }));
    const dogb = div(clu, 'c7-dogb');
    K.place(dogb, { x: CXc - 100, y: CYc - 100, w: 200, h: 200 });
    iconIn(dogb, 'dog');
    const sr = centerRow(clu, CXc, CYc - 80, 900);
    const stamp = div(sr, 'c7-stamp', 'Flooding');
    stamp.style.transform = 'rotate(-8deg)';

    // --- right: exposure chart (local coords, origin bottom-left of the plot)
    const CH = { x: 960, y: 190, w: 860, h: 760 };
    const svg = K.svg(stage, CH);
    const O = [90, 640];
    const axes = [
      K.path(svg, `M${O[0]} ${O[1]} L${O[0]} 44`, { stroke: C.inkSoft, 'stroke-width': 5 }),
      K.path(svg, `M${O[0]} ${O[1]} L830 ${O[1]}`, { stroke: C.inkSoft, 'stroke-width': 5 }),
    ];
    const tips = [
      K.path(svg, `M${O[0] - 14} 60 L${O[0]} 42 L${O[0] + 14} 60`, { stroke: C.inkSoft, 'stroke-width': 5 }),
      K.path(svg, `M814 ${O[1] - 14} L832 ${O[1]} L814 ${O[1] + 14}`, { stroke: C.inkSoft, 'stroke-width': 5 }),
    ];
    const XS = [200, 318, 436, 554, 672, 790];
    const ticks = XS.map(x => K.line(svg, x, O[1] - 9, x, O[1] + 9, { stroke: '#b5bdaa', 'stroke-width': 4 }));
    const yLab = K.svgText(svg, O[0] - 20, 72, 'Fear', { 'font-size': 34, 'font-weight': 700, 'font-family': 'Rubik', 'text-anchor': 'end', fill: C.ink });
    const xLab = K.svgText(svg, 830, O[1] + 60, 'Exposures', { 'font-size': 34, 'font-weight': 700, 'font-family': 'Rubik', 'text-anchor': 'end', fill: C.ink });
    const toY = v => O[1] - v * 540;
    const redPts = [0.40, 0.48, 0.58, 0.69, 0.80, 0.90].map((v, i) => [XS[i], toY(v)]);
    const grnPts = [0.40, 0.355, 0.315, 0.28, 0.25, 0.225].map((v, i) => [XS[i], toY(v)]);
    const grnLine = K.path(svg, smooth(grnPts), { stroke: C.green, 'stroke-width': 9 });
    const redLine = K.path(svg, smooth(redPts), { stroke: C.red, 'stroke-width': 9 });
    const redDots = redPts.map(([x, y]) => K.circle(svg, x, y, 14, { fill: C.red, stroke: '#fff', 'stroke-width': 4 }));
    const grnDots = grnPts.map(([x, y]) => K.circle(svg, x, y, 9, { fill: C.green, stroke: '#fff', 'stroke-width': 3 }));
    // "Sensitization" labels the climbing line from above its middle; the top end carries the shut-down tag
    const redP = pill(stage, 'Sensitization', 'red', 'trending-up');
    redP.style.position = 'absolute';
    K.place(redP, { x: 1090, y: 398 });
    const shutRow = div(stage, 'c7-rrow');
    K.place(shutRow, { x: 1190, y: 240, w: 600 });
    const shutP = pill(shutRow, 'Shut down is not calm', 'grey', 'meh');
    const endPt = redPts[redPts.length - 1];
    const shutPin = K.line(svg, endPt[0], 240 + 60 - CH.y, endPt[0], endPt[1] - 16, { stroke: '#b9bfb0', 'stroke-width': 4 });
    const grnRow = div(stage, 'c7-rrow');
    K.place(grnRow, { x: 1190, y: 740, w: 600 });
    const grnP = pill(grnRow, 'Small doses, feeling safe', 'pale', 'shield-check');

    // --- beat 0: dog appears, triggers crowd in from every side
    A.in(tl, h.all, 0.15, 'fadeUp', { stagger: 0.12 });
    A.in(tl, rows[0], c[0] + 0.15, 'fadeRight', { dur: 0.7 });
    A.in(tl, dogb, c[0] + 0.1, 'pop', { dur: 0.55 });
    trig.forEach((t, i) => {
      const tt = c[0] + 0.25 + t.ri * 0.15 + t.k * 0.03;
      tl.fromTo(t.b, { x: t.dx, y: t.dy, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, tt);
    });
    // the chart takes over on "sensitization" (the cluster, with its FLOODING stamp, stays through "Flooding can cause")
    const tC = Math.min(c[2] + 1.2, Math.max(c[2], phrase(2, 'sensitization') - 0.75));
    tl.to(dogb, { borderColor: C.red, color: C.red, duration: 0.5 }, c[0] + 1.0);
    tl.fromTo(clu, { scale: 1 }, { scale: 0.95, duration: Math.max(1, tC - c[0] - 1.4), ease: 'sine.inOut' }, c[0] + 1.2);
    const shN = yoyoCount(c[0] + 1.3, tC - 0.3, 0.09);
    tl.fromTo(dogb, { rotation: -2.5 }, { rotation: 2.5, duration: 0.09, ease: 'sine.inOut', yoyo: true, repeat: Math.min(shN, 401), immediateRender: false }, c[0] + 1.3);

    // --- beat 1: the spider story plays over the crowded dog; FLOODING stamps on "you're just surviving. That's flooding."
    const tF = Math.min(end(1) - 1.0, Math.max(c[1] + 0.2, phrase(1, "you're just surviving") - 0.3));
    A.in(tl, rows[1], tF - 0.05, 'fadeRight', { dur: 0.7 });
    tl.fromTo(stamp, { opacity: 0, scale: 2.2, rotation: -8 }, { opacity: 1, scale: 1, rotation: -8, duration: 0.35, ease: 'power4.in' }, tF);
    tl.fromTo(sr, { x: 0 }, { x: 8, duration: 0.05, yoyo: true, repeat: 5, ease: 'none' }, tF + 0.35);

    // --- beat 2: the cluster slides away, the chart draws with the red climb
    tl.to(clu, { x: 320, opacity: 0, duration: 0.55, ease: 'power2.in' }, tC - 0.15);
    A.in(tl, rows[2], tC + 0.15, 'fadeRight', { dur: 0.7 });
    A.draw(tl, axes, tC + 0.2, 0.5);
    A.in(tl, tips.concat(ticks), tC + 0.55, 'fade', { dur: 0.3 });
    A.in(tl, [yLab, xLab], tC + 0.45, 'fade', { dur: 0.5 });
    A.draw(tl, redLine, tC + 0.45, 0.9, { ease: 'power1.inOut' });
    redDots.forEach((d, i) => A.in(tl, d, tC + 0.45 + i * 0.17, 'pop', { dur: 0.35 }));
    A.in(tl, redP, tC + 1.0, 'fadeUp', { dur: 0.5 });
    // "Or a dog shuts down and goes quiet": a grey tag pins to the top of the climb
    const tShut = Math.max(tC + 2.5, at(2, 0.68));
    A.draw(tl, shutPin, tShut, 0.3);
    A.in(tl, shutP, tShut + 0.15, 'fadeDown', { dur: 0.6 });

    // --- beat 3: the green line gently falls beneath it; its label lands on "the dose is small enough to feel safe"
    A.in(tl, rows[3], c[3] + 0.15, 'fadeRight', { dur: 0.7 });
    A.draw(tl, grnLine, c[3] + 0.1, 0.9, { ease: 'power1.inOut' });
    grnDots.forEach((d, i) => A.in(tl, d, c[3] + 0.1 + i * 0.17, 'pop', { dur: 0.35 }));
    A.in(tl, grnP, Math.max(c[3] + 0.8, phrase(3, 'the dose') - 0.3), 'fadeUp', { dur: 0.5 });
  });

  // ================================================================== ch07s05  Your homework
  registerScene('ch07s05', ({ stage, tl, cue, end, dur, phrase }) => {
    addCss(stage);
    const c = [0, 1, 2, 3].map(cue);
    const at = fracOf(cue, end);

    // --- beat 0 view: the Monday / Thursday puzzle
    const h0 = K.heading(stage, 'Fine Monday. !!Meltdown Thursday.!!', { x: 100, y: 120, size: 76 });
    const CAL = { w: 480, h: 560, y: 300, xs: [400, 1040] };
    const cals = ['Monday', 'Thursday'].map((day, i) => {
      const card = div(stage, 'c7-cal');
      K.place(card, { x: CAL.xs[i], y: CAL.y, w: CAL.w, h: CAL.h });
      const top = div(card, 'top', day);
      [150, 310].forEach(x => { const rg = div(top, 'ring'); rg.style.left = x + 'px'; });
      const body = div(card, 'cbody');
      iconIn(div(body, 'ico'), 'footprints');
      div(body, 'nm', 'Jogger');
      const st = div(stage, 'c7-stat ' + (i ? 'bad' : 'ok'));
      K.place(st, { x: CAL.xs[i] + CAL.w / 2 - 62, y: CAL.y + CAL.h - 164 });
      iconIn(st, i ? 'triangle-alert' : 'check');
      return { card, st };
    });

    // --- beats 1 to 3 view: the worksheet
    const h1 = K.heading(stage, 'Your homework', { x: 100, y: 120, size: 80 });
    const sub = subtitles(stage, ['Start your trigger list', 'Get *specific*'], 100, 262);
    const WS = { x: 160, y: 345, w: 1600, h: 580 };
    const ws = div(stage, 'c7-ws');
    K.place(ws, WS);
    const lsvg = K.svgEl('svg', { viewBox: `0 0 ${WS.w} ${WS.h}`, width: WS.w, height: WS.h, class: 'lines' }, ws);
    const ttl = div(ws, 'ttl', 'My dog’s trigger list');
    K.place(ttl, { x: 172, y: 50 });
    const COLX = [56, 476, 836, 1086, 1336], TEND = 1544;
    const ruled = [336, 440, 544].map(y => K.line(lsvg, 56, y, TEND, y, { stroke: '#e3e7dd', 'stroke-width': 3 }));
    const hline = K.line(lsvg, 56, 228, TEND, 228, { stroke: C.greenLight, 'stroke-width': 5 });
    const dividers = COLX.slice(1).map(x => K.line(lsvg, x, 140, x, 544, { stroke: '#e8ebe3', 'stroke-width': 3 }));
    const heads = ['What exactly', 'How close', 'Where', 'When', 'How big'].map((t, i) => {
      const n = div(ws, 'th', t);
      K.place(n, { x: COLX[i] + 16, y: 150 });
      return n;
    });
    const scale = div(ws, 'th2', '1 to 10');
    K.place(scale, { x: COLX[4] + 16, y: 192 });
    // the chapter-wide green "Try this" badge, pinned to the worksheet's top right corner
    // (top left holds the clipboard title icon)
    const tryRow = div(stage, 'c7-rrow');
    K.place(tryRow, { x: WS.x + WS.w + 26 - 600, y: WS.y - 32, w: 600 });
    tryRow.style.zIndex = 7;
    const tryB = div(tryRow, 'c7-try');
    tryB.appendChild(K.icon('notebook-pen'));
    tryB.appendChild(K.el('span', null, 'Try this'));
    const clipB = div(stage, 'c7-clip');
    K.place(clipB, { x: 960 - 75, y: 620 - 75 });
    iconIn(clipB, 'clipboard-list');

    // example row (handwritten) and the quiet-reaction row
    const cellTxt = ['Big dogs, head-on', 'Across the street', 'Our block', 'After dark', '7'];
    const cells = cellTxt.map((t, i) => {
      const cell = div(ws, 'cell');
      K.place(cell, { x: COLX[i] + 16, y: 272 });
      const wr = div(cell, 'c7-wr');
      const tx = div(wr, 'txt', t);
      const pen = div(wr, 'pen');
      iconIn(pen, 'pencil', { stroke: 2.2 });
      return { tx, pen };
    });
    const qrow = div(ws, 'c7-qrow');
    K.place(qrow, { x: 44, y: 348, w: TEND - 32, h: 84 });
    iconIn(div(qrow, 'eb'), 'eye');
    div(qrow, 'ql', 'Quiet reactions count too');
    const qw = div(qrow, 'c7-wr');
    qw.style.marginLeft = '48px';
    const qtx = div(qw, 'txt', 'Freezes, stops sniffing');
    const qpen = div(qw, 'pen');
    iconIn(qpen, 'pencil', { stroke: 2.2 });

    // --- beat 0: each calendar slides in on its day, Monday's check on "ignores", Thursday's alert on "meltdown"
    A.in(tl, h0.all, Math.max(0.1, c[0] - 0.3), 'fadeUp', { stagger: 0.12 });
    const tMon = Math.max(c[0] + 0.1, phrase(0, 'on monday') - 0.3);
    const tMonOk = Math.max(tMon + 0.6, phrase(0, 'ignores') - 0.2);
    const tThu = Math.max(tMonOk + 0.4, phrase(0, 'on thursday') - 0.3);
    const tAl = Math.min(c[1] - 1.2, Math.max(tThu + 0.7, phrase(0, 'meltdown') - 0.3));
    A.in(tl, cals[0].card, tMon, 'fadeRight', { dur: 0.8 });
    A.in(tl, cals[0].st, tMonOk, 'pop', { dur: 0.5 });
    A.in(tl, cals[1].card, tThu, 'fadeLeft', { dur: 0.8 });
    A.in(tl, cals[1].st, tAl, 'pop', { dur: 0.5 });
    tl.fromTo(cals[1].card, { rotation: 0 }, { rotation: 1.2, duration: 0.06, yoyo: true, repeat: 5, ease: 'none' }, tAl + 0.1);
    const alN = yoyoCount(tAl + 0.8, c[1] - 0.5, 0.45);
    tl.fromTo(cals[1].st, { scale: 1 }, { scale: 1.1, duration: 0.45, ease: 'sine.inOut', yoyo: true, repeat: alN, immediateRender: false }, tAl + 0.8);

    // --- beat 1: calendars clear, the clipboard expands into the worksheet
    A.out(tl, h0.all, c[1] - 0.25, 'fadeUp', { dur: 0.4 });
    A.out(tl, [cals[0].card, cals[0].st], c[1] - 0.2, 'fadeUp', { dur: 0.45 });
    A.out(tl, [cals[1].card, cals[1].st], c[1] - 0.15, 'fadeUp', { dur: 0.45 });
    A.in(tl, h1.all, c[1] + 0.2, 'fadeUp', { stagger: 0.12 });
    sub.show(tl, 0, c[1] + 0.45);
    A.in(tl, clipB, c[1] + 0.3, 'pop', { dur: 0.5 });
    const org = `${960 - WS.x}px ${620 - WS.y}px`;
    tl.fromTo(ws, { clipPath: `circle(0px at ${org})` }, { clipPath: `circle(1700px at ${org})`, duration: 0.9, ease: 'power2.inOut' }, c[1] + 0.7);
    tl.set(ws, { clipPath: 'none' }, c[1] + 1.6);
    // the badge becomes the title icon at the card's top left
    const tgtC = [WS.x + 56 + 45, WS.y + 30 + 45];
    tl.to(clipB, { x: tgtC[0] - 960, y: tgtC[1] - 620, scale: 0.6, duration: 0.9, ease: 'power2.inOut' }, c[1] + 0.7);
    // the title waits for the badge to land beside it, so the two never cross mid-flight
    A.in(tl, ttl, c[1] + 1.45, 'fade', { dur: 0.5 });
    tl.fromTo(tryB, { opacity: 0, scale: 0.4, rotation: 14 }, { opacity: 1, scale: 1, rotation: 4, duration: 0.7, ease: 'back.out(1.8)' }, c[1] + 1.25);

    // --- beat 2: the table rules draw on "get specific", then each column heading types in as it is said
    sub.show(tl, 1, c[2] + 0.1);
    A.draw(tl, [hline], c[2] + 0.1, 0.7);
    A.draw(tl, dividers, c[2] + 0.2, 0.6, { stagger: 0.08 });
    const HEAD_SAY = ['which dogs', 'how close', 'where', 'when', 'how big', 'one to ten'];
    let tt = c[2] + 0.4;
    heads.concat([scale]).forEach((node, i) => {
      const split = new SplitText(node, { type: 'chars' });
      const t = Math.max(tt, phrase(2, HEAD_SAY[i]) - 0.2);
      tl.fromTo(split.chars, { opacity: 0 }, { opacity: 1, duration: 0.01, stagger: 0.026, ease: 'none' }, t);
      tt = t + split.chars.length * 0.026 + 0.05;
    });

    // --- beat 3: the pencil fills an example row on "big dogs, head-on, after dark", then the quiet-reaction row
    // slides in on "count quiet reactions" and is written on "a freeze or a sudden stop in sniffing".
    // One pencil at a time: each fades out before the next cell's fades in.
    const write = (w, t, d) => {
      tl.fromTo(w.pen, { opacity: 0 }, { opacity: 1, duration: 0.1, ease: 'none' }, t - 0.1);
      tl.fromTo(w.tx, { maxWidth: 0 }, { maxWidth: 520, duration: d, ease: 'none' }, t);
      tl.fromTo(w.pen, { rotation: 0, y: 0 }, { rotation: -10, y: -4, duration: d / 8, ease: 'sine.inOut', yoyo: true, repeat: 7 }, t);
      tl.to(w.pen, { opacity: 0, duration: 0.1, ease: 'none' }, t + d);
    };
    const tW = Math.max(c[3] + 0.25, phrase(3, 'big dogs') - 0.3);
    cells.forEach((w, i) => write(w, tW + i * 0.75, i === 4 ? 0.2 : 0.55));
    const tQ = Math.max(tW + 3.0 + 0.2 + 0.2, phrase(3, 'count quiet') - 0.2);
    tl.fromTo(qrow, { opacity: 0, x: -80 }, { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' }, tQ);
    tl.to(ruled[1], { opacity: 0, duration: 0.3 }, tQ);
    write({ tx: qtx, pen: qpen }, Math.min(end(3) - 1.2, Math.max(tQ + 0.8, phrase(3, 'a freeze') - 0.2)), 1.2);
  });
})();
