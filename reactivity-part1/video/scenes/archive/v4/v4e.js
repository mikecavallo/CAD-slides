// Part 1, one-chapter version: scenes built by group e.
// ch01s19 (why behavior gets repeated: the cycle and the lawn path), ch01s20 (reinforcement isn't always food),
// ch01s21 to ch01s24 (the leash walk as an ABC strip: before, during the A, during the B and C, after).
(() => {
  const GREEN = '#619537', GREEN_DARK = '#3f6b22', GREEN_LIGHT = '#b8d99a', RED = '#b8452d', OLIVE = '#4b5a1e';
  const PALE_ARROW = '#cdd3c2';

  // ------------------------------------------------------------------ shared ABC strip geometry (ch01s21 to s24)
  const SX = 140, SW = 1640, SG = 70, COLW = (SW - 2 * SG) / 3; // 500 px columns (raster 591 px: always sharp)
  const LY = 112;               // tab (label) top
  const PH = 272;               // panel height
  const TOP = LY + 86;          // column top used by K.abc
  const PT = TOP + 128;         // panel top (head 112 + 16 margin)
  const CAP_T = PT + PH + 14;   // caption top
  const CAP_B = CAP_T + 100;    // caption bottom
  const BAND = CAP_B + 22;      // first row below the captions
  const FN_X = SX + 432;        // the "Function: get space" chip, beside the tab
  const colX = i => SX + i * (COLW + SG);

  const CSS = `
  .v4e .abc-col .panel { overflow: visible; border-color: transparent; background: transparent; box-shadow: none; }
  .v4e-win { position: absolute; inset: 0; overflow: hidden; border-radius: 18px; background: rgba(255,255,255,0.78); }
  .v4e-win img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 62%; }
  .v4e-frame { position: absolute; left: -6px; top: -6px; overflow: visible; pointer-events: none; }
  .v4e .abc-col .cap { min-height: 100px; }
  .v4e .abc-label { transform-origin: 50% 50%; }
  .v4e-fn { position: absolute; display: inline-flex; align-items: center; gap: 12px; padding: 14px 26px 14px 16px; border-radius: 999px;
    background: var(--green); color: #fff; font: 600 30px/1 var(--font-body); white-space: nowrap; box-shadow: 0 8px 20px rgba(44,74,23,0.22); }
  .v4e-fn .ib { width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.22); display: grid; place-items: center; }
  .v4e-fn .ib svg { width: 26px; height: 26px; }
  .v4e-fn b { font-weight: 800; }
  .v4e-alarm { position: absolute; width: 66px; height: 66px; }
  .v4e-alarm .ring { position: absolute; inset: 0; border-radius: 50%; border: 5px solid var(--red); }
  .v4e-alarm .dot { position: absolute; inset: 0; border-radius: 50%; background: var(--red); color: #fff; display: grid; place-items: center; border: 4px solid #fff; box-shadow: 0 6px 16px rgba(60,20,10,0.28); }
  .v4e-alarm .dot svg { width: 34px; height: 34px; }
  .v4e-note { font: 700 32px/1.3 var(--font-body); color: var(--red); text-align: center; white-space: nowrap; }
  .v4e-looplabel { position: absolute; font: 700 30px/1.2 var(--font-body); text-align: center; white-space: nowrap; }
  .v4e-keep { position: absolute; display: inline-flex; align-items: center; gap: 8px; padding: 8px 18px 8px 12px; border-radius: 999px; background: var(--green);
    color: #fff; font: 700 26px/1 var(--font-body); white-space: nowrap; box-shadow: 0 8px 18px rgba(44,74,23,0.25); }
  .v4e-keep svg { width: 28px; height: 28px; }
  .v4e-callout { position: absolute; border-radius: 26px; background: var(--green-mist); border: 2px solid var(--green-pale); box-shadow: var(--shadow-soft); overflow: hidden; }
  .v4e-callout::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 12px; background: var(--green); }
  .v4e-callout .ln { position: absolute; inset: 0; display: grid; place-items: center; text-align: center; padding: 0 40px 0 52px; font: 700 54px/1.15 var(--font-head); color: var(--green-dark); }
  .v4e-callout.sm .ln { font-size: 46px; }
  .v4e-tilewrap { position: absolute; display: flex; justify-content: center; }
  .v4e-tiles { display: grid; grid-template-columns: auto auto; column-gap: 22px; row-gap: 10px; }
  .v4e-tile { display: flex; align-items: center; gap: 12px; }
  .v4e-tile .b { flex: 0 0 auto; width: 48px; height: 48px; border-radius: 50%; background: var(--green-pale); color: var(--green-dark); display: grid; place-items: center; }
  .v4e-tile .b svg { width: 28px; height: 28px; stroke-width: 2.2; }
  .v4e-tile .l { font: 600 27px/1.1 var(--font-body); color: var(--ink); white-space: nowrap; }
  .v4e-eye { position: absolute; width: 68px; height: 68px; border-radius: 50%; background: #fff; color: var(--green-dark); display: grid; place-items: center; box-shadow: 0 6px 18px rgba(30,50,15,0.32); }
  .v4e-eye svg { width: 40px; height: 40px; }
  .v4e-try { position: absolute; display: inline-flex; align-items: center; gap: 12px; padding: 14px 26px 14px 18px; border-radius: 999px; background: var(--green); color: #fff;
    font: 700 26px/1 var(--font-body); letter-spacing: 3px; text-transform: uppercase; white-space: nowrap; box-shadow: 0 10px 22px rgba(44,74,23,0.26); }
  .v4e-try svg { width: 32px; height: 32px; }
  .v4e-card { position: absolute; background: #fff; border-radius: 30px; box-shadow: var(--shadow); border: 1px solid #e6e9e1; }
  .v4e-bubble-txt { position: absolute; display: grid; place-items: center; text-align: center; font: 700 56px/1.1 var(--font-head); color: var(--green-dark); }
  .v4e-plan { font: 700 56px/1.15 var(--font-head); color: var(--green-dark); text-align: center; }
  .v4e-spark { position: absolute; }
  .v4e-halo { position: absolute; border-radius: 50%; background: radial-gradient(closest-side, rgba(232,241,220,0.95), rgba(232,241,220,0.55) 55%, rgba(232,241,220,0) 100%); }
  .v4e-wins { font: 600 50px/1.2 var(--font-body); color: var(--ink); text-align: center; }
  .v4e-changed { font: 700 50px/1.15 var(--font-head); color: var(--green-dark); text-align: center; white-space: nowrap; }

  /* ch01s19: the cycle */
  .v4e-sub { position: absolute; border-left: 8px solid var(--green-light); padding: 6px 0 6px 28px; font: 600 40px/1.3 var(--font-body); color: var(--ink); }
  .v4e-node { position: absolute; width: 116px; height: 116px; border-radius: 50%; display: grid; place-items: center; box-shadow: var(--shadow-soft); }
  .v4e-node svg { width: 58px; height: 58px; }
  .v4e-node.amber { background: #fff4e2; color: #b8761a; border: 4px solid #f0cf9c; }
  .v4e-node.red { background: #fbece8; color: var(--red); border: 4px solid #eebcaf; }
  .v4e-node.green { background: var(--green-mist); color: var(--green-dark); border: 4px solid var(--green-light); }
  .v4e-nlab { position: absolute; font: 700 32px/1.2 var(--font-body); color: var(--ink); white-space: nowrap; }
  .v4e-nlab.r { text-align: right; }
  .v4e-nlab.c { text-align: center; }
  .v4e-pill { position: absolute; display: inline-flex; align-items: center; gap: 14px; padding: 16px 32px; border-radius: 999px;
    background: var(--green); color: #fff; font: 700 34px/1 var(--font-body); white-space: nowrap; box-shadow: 0 12px 26px rgba(44,74,23,0.24); }
  .v4e-pill svg { width: 36px; height: 36px; }
  .v4e-tag { position: absolute; display: inline-flex; align-items: center; gap: 12px; padding: 10px 24px 10px 10px; border-radius: 999px; background: #fff;
    border: 3px solid var(--green-light); font: 700 28px/1 var(--font-body); color: var(--green-deep); white-space: nowrap; box-shadow: var(--shadow-soft); }
  .v4e-tag .ib { width: 46px; height: 46px; border-radius: 50%; background: var(--green-pale); color: var(--green-dark); display: grid; place-items: center; }
  .v4e-tag .ib svg { width: 26px; height: 26px; }
  .v4e-tag .pin { position: absolute; left: 50%; top: -10px; width: 18px; height: 18px; margin-left: -9px; border-radius: 50%; background: var(--green-dark);
    border: 3px solid #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.25); }
  .v4e-count { position: absolute; display: flex; align-items: center; gap: 30px; padding: 0 40px; background: #fff; border-radius: 26px;
    border: 1px solid #e6e9e1; box-shadow: var(--shadow-soft); }
  .v4e-count .ib { flex: 0 0 auto; width: 100px; height: 100px; border-radius: 50%; background: var(--green); color: #fff; display: grid; place-items: center; }
  .v4e-count .ib svg { width: 54px; height: 54px; }
  .v4e-count .col { display: flex; flex-direction: column; gap: 10px; }
  .v4e-count .num { position: relative; width: 220px; height: 120px; }
  .v4e-count .num span { position: absolute; left: 0; top: 0; font: 800 124px/0.97 var(--font-head); color: var(--green); }
  .v4e-count .lab { font: 600 30px/1 var(--font-body); color: var(--ink-soft); white-space: nowrap; }
  .v4e-newp { position: absolute; display: inline-flex; align-items: center; gap: 12px; padding: 14px 26px 14px 20px; border-radius: 999px; background: #fff;
    color: var(--green-dark); font: 700 30px/1 var(--font-body); white-space: nowrap; box-shadow: 0 10px 24px rgba(40,60,20,0.18); }
  .v4e-newp svg { width: 34px; height: 34px; }

  /* ch01s20: reinforcement isn't always food */
  .v4e-bnode { position: absolute; border-radius: 50%; background: var(--green); color: #fff; display: grid; place-items: center;
    font: 700 42px/1 var(--font-head); box-shadow: 0 16px 36px rgba(44,74,23,0.30); border: 8px solid #fff; }
  .v4e-oc { position: absolute; display: inline-flex; align-items: center; gap: 16px; padding: 14px 32px 14px 14px; border-radius: 999px; background: #fff;
    border: 3px solid var(--green-light); box-shadow: var(--shadow-soft); font: 700 38px/1 var(--font-body); color: var(--ink); white-space: nowrap; }
  .v4e-oc .ib { width: 66px; height: 66px; border-radius: 50%; background: var(--green-pale); color: var(--green-dark); display: grid; place-items: center; }
  .v4e-oc .ib svg { width: 36px; height: 36px; stroke-width: 2.2; }
  .v4e-cookie { position: absolute; border-radius: 50%; background: var(--amber-pale); color: #b8761a; display: grid; place-items: center;
    border: 5px solid #f0cf9c; box-shadow: var(--shadow-soft); }
  .v4e-cookie svg { width: 56%; height: 56%; stroke-width: 1.8; }
  .v4e-take { font: 700 54px/1.1 var(--font-head); color: var(--green-dark); text-align: center; white-space: nowrap; }
  `;

  function setup(stage) {
    stage.classList.add('v4e');
    stage.appendChild(K.el('style', null, CSS));
  }
  const box = (parent, cls, html, o) => {
    const n = K.el('div', cls, html == null ? null : K.md(html));
    K.place(n, o || {});
    parent.appendChild(n);
    return n;
  };
  const clamp = (t, lo, hi) => Math.max(lo, Math.min(t, hi));
  // time a reveal to a phrase inside beat i's narration, leading by `lead` s (never before the beat's cue)
  const sayAt = ctx => (i, phrase, lead = 0.3, fb = 0.5) => Math.max(ctx.cue(i), ctx.phrase(i, phrase, fb) - lead);
  // Crossfade: old content lifts out quickly, new content rises into the same slot.
  const swap = (tl, from, to, t) => {
    tl.to(from, { opacity: 0, y: -24, duration: 0.3, ease: 'power2.out' }, t - 0.05);
    tl.fromTo(to, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, t + 0.25);
  };
  const layer = stage => {
    const g = K.el('div', 'v4e-layer');
    g.style.cssText = 'position:absolute;inset:0;';
    stage.appendChild(g);
    return g;
  };

  // ------------------------------------------------------------------ ABC strip helpers
  /** ABC strip with SVG-drawn frames (so frames can draw in) and an inner image window. */
  function strip(parent, o) {
    const S = K.abc(parent, {
      x: SX, y: LY, w: SW, gap: SG, panelH: PH, capH: 100,
      panels: o.panels, captions: o.captions, label: o.label, labelVariant: o.labelVariant,
    });
    S.cols.forEach(c => {
      const win = K.el('div', 'v4e-win');
      c.panel.insertBefore(win, c.img);
      win.appendChild(c.img);
      const svg = K.svgEl('svg', { class: 'v4e-frame', width: COLW, height: PH, viewBox: `0 0 ${COLW} ${PH}` });
      c.frame = K.svgEl('rect', { x: 3, y: 3, width: COLW - 6, height: PH - 6, rx: 21, fill: 'none', stroke: OLIVE, 'stroke-width': 6 }, svg);
      c.panel.appendChild(svg);
      c.win = win;
    });
    S.arrows.forEach(a => (a.style.top = (PT + PH / 2 - 23) + 'px'));
    return S;
  }

  /** The green "Function: get space" chip that sits beside the tab through the whole walk. */
  function fnChip(parent) {
    const c = box(parent, 'v4e-fn', null, { x: FN_X, y: LY + 5 });
    const ib = K.el('div', 'ib');
    ib.appendChild(K.icon('move-horizontal', { stroke: 2.6 }));
    c.appendChild(ib);
    c.appendChild(K.el('span', null, '<b>Function:</b> get space'));
    return c;
  }

  /** Loop arrow from the top of panel C back to the top of panel B, with an optional label above it. */
  function loop(parent, color, text) {
    const x1 = colX(2) + 100, x2 = colX(1) + COLW - 100, y = PT - 4, peak = PT - 168;
    const svg = K.svg(parent, { x: 0, y: 0, w: 1920, h: 1080 });
    const p = K.path(svg, `M ${x1} ${y} C ${x1} ${peak}, ${x2} ${peak}, ${x2} ${y - 16}`, { stroke: color, 'stroke-width': 8 });
    const head = K.path(svg, `M ${x2 - 16} ${y - 26} L ${x2} ${y - 4} L ${x2 + 16} ${y - 26}`, { stroke: color, 'stroke-width': 8 });
    const label = text ? K.text(parent, text, { cls: 'v4e-looplabel', x: (x1 + x2) / 2 - 320, y: PT - 186, w: 640, color }) : null;
    return { svg, p, head, label };
  }
  function showLoop(tl, L, t) {
    A.draw(tl, L.p, t, 1.1);
    A.in(tl, L.head, t + 1.0, 'fade', { dur: 0.25 });
  }

  /** Fill a panel with its illustration and reveal its caption. */
  function fill(tl, c, t) {
    tl.fromTo(c.img, { opacity: 0, scale: 1.12 }, { opacity: 1, scale: 1, duration: 1.0, ease: 'power2.out' }, t);
    if (c.cap) A.in(tl, c.cap, t + 0.3, 'fadeUp', { dur: 0.6 });
  }

  /** Centered check / cross list under a column. */
  function cxUnder(parent, i, items, y, o = {}) {
    const f = K.flow(parent, { x: colX(i), y, w: COLW, align: 'center', gap: 0 });
    return K.cx(f, items, { cols: o.cols ?? (items.length > 1 ? 2 : 1), size: o.size });
  }

  /** Callout card whose lines swap in place (one per beat). */
  function callout(parent, o, texts) {
    const card = box(parent, 'v4e-callout' + (o.sm ? ' sm' : ''), null, { x: o.x, y: o.y, w: o.w, h: o.h });
    const lines = texts.map(s => {
      const n = K.el('div', 'ln', K.md(s));
      card.appendChild(n);
      return n;
    });
    return { card, lines };
  }

  const BEFORE = ['abc_before_a.jpg', 'abc_before_b.jpg', 'abc_before_c.jpg'];
  const DURING = ['abc_during_a.jpg', 'abc_during_b.jpg', 'abc_during_c.jpg'];
  const AFTER = ['abc_after_a.jpg', 'abc_after_b.jpg', 'abc_after_c.jpg'];
  const CAP_C = 'Space is given.<br>The situation ends.';

  // ================================================================== ch01s19 Why behavior gets repeated
  registerScene('ch01s19', (ctx) => {
    const { stage, tl, cue, end, dur } = ctx;
    const at = sayAt(ctx);
    setup(stage);

    const h = K.heading(stage, 'Why behavior gets repeated', { x: 100, y: 120, w: 1400, size: 80 });
    A.in(tl, h.title, Math.max(0, cue(0) - 0.25), 'fadeUp', { dur: 0.8 });
    A.in(tl, h.bar, cue(0) + 0.25, 'grow', { dur: 0.6 });

    const TX = 100, SY = 400;
    const sub1 = box(stage, 'v4e-sub', 'If it works,<br>*it may be repeated*', { x: TX, y: SY, w: 600 });
    const sub2 = box(stage, 'v4e-sub', 'Behavior that works<br>*gets repeated*', { x: TX, y: SY, w: 600 });
    const sub3 = box(stage, 'v4e-sub', 'Every rehearsal<br>*deepens the path*', { x: TX, y: SY, w: 600 });

    // --- the loop: a ring with three nodes, drawn clockwise from the top
    const CX = 1180, CY = 646, R = 205;
    const ang = [-90, 30, 150];
    const pt = a => [CX + R * Math.cos(a * Math.PI / 180), CY + R * Math.sin(a * Math.PI / 180)];
    const svg = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const ringD = `M ${CX} ${CY - R} A ${R} ${R} 0 1 1 ${CX} ${CY + R} A ${R} ${R} 0 1 1 ${CX} ${CY - R}`;
    const track = K.path(svg, ringD, { stroke: GREEN_LIGHT, 'stroke-width': 4, 'stroke-dasharray': '2 16', opacity: 0 });
    const ring = K.path(svg, ringD, { stroke: GREEN_LIGHT, 'stroke-width': 12 });
    const chevs = [-30, 90, 210].map(a => {
      const [x, y] = pt(a);
      return K.path(svg, 'M -13 -17 L 7 0 L -13 17', { stroke: GREEN, 'stroke-width': 8, transform: `translate(${x} ${y}) rotate(${a + 90})` });
    });
    // comet that orbits the ring during beat 3
    const comet = K.group(svg, { opacity: 0 });
    const trail = [0.18, 0.32, 0.55].map((o, i) => K.circle(comet, CX, CY - R, 7 + i * 2, { fill: GREEN, opacity: o }));
    const glow = K.circle(comet, CX, CY - R, 30, { fill: GREEN, opacity: 0.18 });
    const dot = K.circle(comet, CX, CY - R, 13, { fill: GREEN_DARK });
    // return arrow (relief makes barking more likely): from node 3 arching back to node 2 inside the ring
    const [n3x, n3y] = pt(150), [n2x, n2y] = pt(30);
    const retD = `M ${n3x + 62} ${n3y - 44} Q ${CX} ${CY - 120} ${n2x - 62} ${n2y - 44}`;
    const ret = K.path(svg, retD, { stroke: GREEN, 'stroke-width': 8 });
    const retHead = K.path(svg, 'M -16 -15 L 4 0 L -16 15', { stroke: GREEN, 'stroke-width': 8 });
    {
      const ex = n2x - 62, ey = n2y - 44, cx = CX, cy = CY - 120;
      const a = Math.atan2(ey - cy, ex - cx) * 180 / Math.PI;
      retHead.setAttribute('transform', `translate(${ex} ${ey}) rotate(${a})`);
    }

    const NODES = [
      { icon: 'triangle-alert', v: 'amber', t: 'Scary thing appears', side: 't' },
      { icon: 'volume-2', v: 'red', t: 'Bark and<br>lunge', side: 'r' },
      { icon: 'footprints', v: 'green', t: 'Scary thing<br>leaves', side: 'l' },
    ];
    const nodes = NODES.map((n, i) => {
      const [x, y] = pt(ang[i]);
      const b = box(stage, 'v4e-node ' + n.v, null, { x: x - 58, y: y - 58, w: 116, h: 116 });
      b.appendChild(K.icon(n.icon, { stroke: 2.2 }));
      const lab = n.side === 'r' ? box(stage, 'v4e-nlab', n.t, { x: x + 78, y: y - 38 })
        : n.side === 't' ? box(stage, 'v4e-nlab c', n.t, { x: x - 250, y: y - 112, w: 500 })
          : box(stage, 'v4e-nlab r', n.t, { x: x - 78 - 260, y: y - 38, w: 260 });
      return { b, lab, x, y };
    });
    const relief = box(stage, 'v4e-pill', null, { x: nodes[2].x - 78 - 212, y: nodes[2].y + 56 });
    relief.appendChild(K.icon('check', { stroke: 3 }));
    relief.appendChild(K.el('span', null, 'Relief'));

    // the two other outcomes that work the same way, pinned beside the loop (upper right)
    const tags = [['user-plus', 'Brings them closer', 404], ['bone', 'Keeps the toy', 496]].map(([ic, t, y], k) => {
      const g = box(stage, 'v4e-tag', null, { y });
      g.style.right = (k ? 170 : 128) + 'px';
      const ib = K.el('div', 'ib'); ib.appendChild(K.icon(ic, { stroke: 2.4 })); g.appendChild(ib);
      g.appendChild(K.el('span', null, t));
      g.appendChild(K.el('div', 'pin'));
      return g;
    });

    // beat 1: the loop draws clockwise in step with "Say barking makes something scary go away"
    const t0 = cue(0);
    const tTrack = clamp(at(0, 'what happens next time', 0.2), t0 + 1.0, cue(1) - 5);
    tl.to(track, { opacity: 1, duration: 0.8, ease: 'power2.out' }, tTrack);
    const tN1 = clamp(at(0, 'Say barking', 0.4), tTrack + 0.8, cue(1) - 2.6);
    const tN2 = clamp(at(0, 'makes something scary', 0.2), tN1 + 0.9, cue(1) - 1.6);
    const tN3 = clamp(at(0, 'go away', 0.3), tN2 + 0.8, cue(1) - 0.8);
    const nodeAt = [tN1, tN2, tN3];
    const seg = (to, t) => tl.to(ring, { drawSVG: '0% ' + to, duration: 0.7, ease: 'power1.inOut' }, t);
    tl.fromTo(ring, { drawSVG: '0% 0%' }, { drawSVG: '0% 0.5%', duration: 0.2 }, tN1 + 0.1);
    seg('33.4%', tN2 - 0.7);
    seg('66.7%', tN3 - 0.7);
    seg('100%', tN3 + 0.3);
    tl.to(track, { opacity: 0, duration: 0.5 }, tN3 + 0.9);
    nodes.forEach((n, i) => {
      tl.fromTo(n.b, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.8)' }, nodeAt[i]);
      A.in(tl, n.lab, nodeAt[i] + 0.1, n.side === 'r' ? 'fadeLeft' : n.side === 't' ? 'fadeUp' : 'fadeRight', { dur: 0.5 });
    });
    [tN2 - 0.35, tN3 - 0.35, tN3 + 0.7].forEach((t, i) => A.in(tl, chevs[i], t, 'fade', { dur: 0.3 }));

    // beat 2: Relief glows on node three, the return arrow curves back to "Bark and lunge",
    // then the two other outcomes pin beside the loop, one per phrase
    const t1 = cue(1);
    tl.fromTo(relief, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.8)' }, t1 + 0.1);
    tl.to(relief, { boxShadow: '0 0 0 16px rgba(97,149,55,0.25)', duration: 0.35, ease: 'power2.out' }, t1 + 0.6);
    tl.to(relief, { boxShadow: '0 12px 26px rgba(44,74,23,0.24)', duration: 0.6, ease: 'power2.inOut' }, t1 + 0.95);
    tl.to(nodes[2].b, { boxShadow: '0 0 0 14px rgba(97,149,55,0.22)', duration: 0.35 }, t1 + 0.6);
    tl.to(nodes[2].b, { boxShadow: '0 10px 30px rgba(40,60,20,0.10)', duration: 0.6 }, t1 + 0.95);
    const tRet = clamp(at(1, 'so barking gets more likely'), t1 + 1.0, cue(2) - 6);
    A.draw(tl, ret, tRet, 0.8);
    A.in(tl, retHead, tRet + 0.75, 'fade', { dur: 0.2 });
    A.in(tl, sub1, clamp(at(1, 'more likely next time'), tRet + 0.5, cue(2) - 5), 'fadeUp', { dur: 0.7 });
    const tTag1 = clamp(at(1, 'brings someone closer'), tRet + 1.5, cue(2) - 2.5);
    const tTag2 = clamp(at(1, 'keeps another dog off the toy'), tTag1 + 1.0, cue(2) - 1.2);
    [tTag1, tTag2].forEach((t, k) => tl.fromTo(tags[k], { opacity: 0, y: -34, rotation: k ? 6 : -6, scale: 0.9 },
      { opacity: 1, y: 0, rotation: k ? 1.5 : -1.5, scale: 1, duration: 0.6, ease: 'back.out(1.8)' }, t));

    // beat 3: the tags fade; the loop spins faster and faster while a counter ticks up 1, 5, 20, 50
    const t2 = cue(2);
    A.out(tl, tags, t2, 'fadeUp', { dur: 0.45 });
    swap(tl, sub1, sub2, clamp(at(2, 'behavior that works'), t2 + 0.3, cue(3) - 6));
    const cnt = box(stage, 'v4e-count', null, { x: TX, y: 590, w: 470, h: 230 });
    const cib = K.el('div', 'ib'); cib.appendChild(K.icon('repeat', { stroke: 2.4 })); cnt.appendChild(cib);
    const col = K.el('div', 'col'); cnt.appendChild(col);
    const num = K.el('div', 'num'); col.appendChild(num);
    const vals = ['1', '5', '20', '50'].map(v => { const s = K.el('span', null, v); num.appendChild(s); return s; });
    col.insertBefore(K.el('div', 'lab', 'Times practiced'), num);
    const spinStart = clamp(at(2, 'Every time the loop runs', 0.2), t2 + 1.2, cue(3) - 4);
    A.in(tl, cnt, spinStart - 0.1, 'fadeUp', { dur: 0.7 });
    gsap.set(vals.slice(1), { opacity: 0 });
    const S = Math.max(3, Math.min(end(2) - spinStart + 0.4, cue(3) - spinStart - 0.7)), LAPS = 5;
    const lapAt = k => spinStart + S * Math.sqrt(k / LAPS); // power1.in: progress = p^2
    [1, 2, 3].forEach(k => {
      const tt = lapAt(k);
      tl.to(vals[k - 1], { opacity: 0, y: -30, duration: 0.2, ease: 'power2.in' }, tt - 0.05);
      tl.fromTo(vals[k], { opacity: 0, y: 30, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'back.out(2)' }, tt + 0.1);
    });
    const orbit = { a: -90 };
    const place = () => {
      const pos = off => {
        const r = (orbit.a - off) * Math.PI / 180;
        return [CX + R * Math.cos(r), CY + R * Math.sin(r)];
      };
      const [x, y] = pos(0);
      dot.setAttribute('cx', x); dot.setAttribute('cy', y);
      glow.setAttribute('cx', x); glow.setAttribute('cy', y);
      trail.forEach((c, i) => { const [tx, ty] = pos((3 - i) * 9); c.setAttribute('cx', tx); c.setAttribute('cy', ty); });
    };
    tl.to(comet, { opacity: 1, duration: 0.4 }, spinStart - 0.1);
    tl.fromTo(orbit, { a: -90 }, { a: -90 + 360 * LAPS, duration: S, ease: 'power1.in', onUpdate: place }, spinStart);
    tl.to(ring, { attr: { 'stroke-width': 22, stroke: '#8fbf5f' }, duration: S, ease: 'power1.in' }, spinStart);
    tl.to(orbit, { a: -90 + 360 * (LAPS + 1.2), duration: 1.4, ease: 'power1.out', onUpdate: place }, spinStart + S);
    place();

    // beat 4: the loop fades; a faint dotted line across a lawn wears into a bold path, then a new path
    const t3 = cue(3);
    const loopBits = [svg, ...nodes.map(n => n.b), ...nodes.map(n => n.lab), relief, cnt];
    tl.to(loopBits, { opacity: 0, duration: 0.5, ease: 'power2.in' }, t3 - 0.2);
    tl.to(nodes.map(n => n.b), { scale: 0.85, duration: 0.5, ease: 'power2.in' }, t3 - 0.2);
    swap(tl, sub2, sub3, t3 + 0.2);

    const LW = 1020, LH = 560, LXp = 800, LYp = 372;
    const lawn = K.svg(stage, { x: LXp, y: LYp, w: LW, h: LH });
    const defs = K.svgEl('defs', {}, lawn);
    const g = K.svgEl('linearGradient', { id: 'v4e-lawn', x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    K.svgEl('stop', { offset: '0', 'stop-color': '#d6e9bf' }, g);
    K.svgEl('stop', { offset: '1', 'stop-color': '#a7cb80' }, g);
    const clip = K.svgEl('clipPath', { id: 'v4e-lawnclip' }, defs);
    K.rect(clip, 0, 0, LW, LH, { rx: 26 });
    const reveal = K.svgEl('clipPath', { id: 'v4e-newclip', clipPathUnits: 'userSpaceOnUse' }, defs);
    const revealR = K.rect(reveal, -40, 0, 0, LH, { fill: '#fff' });
    const body = K.group(lawn, { 'clip-path': 'url(#v4e-lawnclip)' });
    K.rect(body, 0, 0, LW, LH, { fill: 'url(#v4e-lawn)' });
    let seed = 7;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    for (let i = 0; i < 54; i++) {
      const x = 30 + rnd() * (LW - 60), y = 40 + rnd() * (LH - 60), s = 0.8 + rnd() * 0.6;
      K.path(body, `M ${x} ${y} l ${-7 * s} ${-20 * s} M ${x} ${y} l 0 ${-26 * s} M ${x} ${y} l ${7 * s} ${-20 * s}`,
        { stroke: rnd() > 0.5 ? '#86b556' : '#79a94b', 'stroke-width': 4, opacity: 0.55 + rnd() * 0.35 });
    }
    const pathD = 'M -30 400 C 200 405, 320 290, 520 255 S 850 140, 1060 60';
    const newD = 'M -30 505 C 230 505, 380 425, 580 395 S 900 330, 1060 300';
    const worn = K.path(body, pathD, { stroke: '#cdb285', 'stroke-width': 0 });
    const wornIn = K.path(body, pathD, { stroke: '#b8966a', 'stroke-width': 0, opacity: 0.75 });
    const dotted = K.path(body, pathD, { stroke: '#6f6446', 'stroke-width': 7, 'stroke-dasharray': '0.1 24', opacity: 0.6 });
    const freshG = K.group(body, { 'clip-path': 'url(#v4e-newclip)' });
    K.path(freshG, newD, { stroke: '#ffffff', 'stroke-width': 20, 'stroke-dasharray': '0.1 26', opacity: 0.75 });
    K.path(freshG, newD, { stroke: GREEN_DARK, 'stroke-width': 12, 'stroke-dasharray': '0.1 26' });
    K.rect(lawn, 2, 2, LW - 4, LH - 4, { rx: 25, fill: 'none', stroke: '#ffffff', 'stroke-width': 4, opacity: 0.7 });
    lawn.style.filter = 'drop-shadow(0 18px 40px rgba(40,60,20,0.16))';
    const newp = box(stage, 'v4e-newp', null, { x: LXp + 730, y: LYp + 408 });
    newp.appendChild(K.icon('sprout', { stroke: 2.4 }));
    newp.appendChild(K.el('span', null, 'New path'));

    tl.fromTo(lawn, { opacity: 0, scale: 0.96, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' }, t3 + 0.2);
    tl.fromTo(dotted, { opacity: 0 }, { opacity: 0.6, duration: 0.6 }, t3 + 0.7);
    const w1 = clamp(at(3, 'walk it every day'), t3 + 1.2, dur - 6.4);
    const w2 = clamp(at(3, 'it wears in'), w1 + 1.0, dur - 5.4);
    const w3 = clamp(at(3, 'without thinking'), w2 + 0.9, dur - 4.4);
    tl.set(worn, { attr: { 'stroke-width': 12 } }, w1);
    A.draw(tl, worn, w1, 0.9, { ease: 'power1.inOut' });
    tl.to(worn, { attr: { 'stroke-width': 34 }, duration: 0.7, ease: 'power2.out' }, w2);
    tl.to(dotted, { opacity: 0.25, duration: 0.7 }, w2);
    tl.to(worn, { attr: { 'stroke-width': 78 }, duration: 0.8, ease: 'power2.out' }, w3);
    tl.to(wornIn, { attr: { 'stroke-width': 34 }, duration: 0.8, ease: 'power2.out' }, w3 + 0.1);
    tl.to(dotted, { opacity: 0, duration: 0.6 }, w3);
    const tn = clamp(at(3, 'The good news', 0.2), w3 + 1.0, dur - 2.6);
    tl.fromTo(revealR, { attr: { width: 0 } }, { attr: { width: LW + 80 }, duration: 1.6, ease: 'power1.inOut' }, tn);
    tl.fromTo(newp, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.55, ease: 'back.out(1.8)' }, Math.min(tn + 0.9, dur - 1.8));
  });

  // ================================================================== ch01s20 Reinforcement isn't always food
  registerScene('ch01s20', (ctx) => {
    const { stage, tl, cue, end, dur } = ctx;
    const at = sayAt(ctx);
    setup(stage);

    // beat 1: the heading writes on; a cookie appears, then slides aside
    const h = K.heading(stage, 'Reinforcement isn’t always food.', { x: 100, y: 120, w: 1460, size: 78 });
    const chars = new SplitText(h.title, { type: 'words,chars' }).chars;
    tl.fromTo(chars, { opacity: 0 }, { opacity: 1, duration: 0.05, stagger: 0.035, ease: 'none' }, Math.max(0, cue(0) - 0.2));
    A.in(tl, h.bar, cue(0) + 0.35 + chars.length * 0.035, 'grow', { dur: 0.6 });

    const NX = 1120, NY = 536, NR = 128;
    const CK = 230;
    const cookie = box(stage, 'v4e-cookie', null, { x: 960 - CK / 2, y: NY - CK / 2, w: CK, h: CK });
    cookie.appendChild(K.icon('cookie', { stroke: 1.8 }));
    const tCookie = clamp(at(0, 'treats', 0.35), cue(0) + 1.4, end(0) - 2.2);
    A.in(tl, cookie, tCookie, 'pop', { dur: 0.6 });
    const tAside = clamp(at(0, 'The world reinforces', 0.1), tCookie + 1.1, cue(1) - 0.6);
    // slides aside to the left and steps back: food is one reinforcer among many
    tl.to(cookie, { x: 280 - 960, scale: 0.8, opacity: 0.75, duration: 1.0, ease: 'power3.inOut' }, tAside);

    // beat 2: a central "Behavior" node; four outcome chips pop in one per word, each with an arrow into it
    const svg = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const node = box(stage, 'v4e-bnode', 'Behavior', { x: NX - NR, y: NY - NR, w: NR * 2, h: NR * 2 });
    const OUT = [
      { t: 'Distance', icon: 'move-horizontal', dx: -1, dy: -1, w: 'distance' },
      { t: 'Access', icon: 'key', dx: 1, dy: -1, w: 'access' },
      { t: 'Attention', icon: 'eye', dx: -1, dy: 1, w: 'attention' },
      { t: 'Relief', icon: 'heart', dx: 1, dy: 1, w: 'relief' },
    ];
    const OX = 470, OY = 196;
    const chips = OUT.map(o => {
      const cx = NX + o.dx * OX, cy = NY + o.dy * OY;
      const c = box(stage, 'v4e-oc', null, { y: cy - 48 });
      const ib = K.el('div', 'ib'); ib.appendChild(K.icon(o.icon)); c.appendChild(ib);
      c.appendChild(K.el('span', null, o.t));
      // anchor the chip's inner end (the end facing the node) so every arrow is the same length
      const inner = cx - o.dx * 150;
      if (o.dx < 0) c.style.right = (1920 - inner) + 'px';
      else c.style.left = inner + 'px';
      // arrow from just beside the chip's inner end into the node's rim
      const sx = inner - o.dx * 22, sy = cy;
      const ux = NX - sx, uy = NY - sy, L = Math.hypot(ux, uy), nx = ux / L, ny = uy / L;
      const x0 = sx, y0 = sy;
      const x1 = NX - nx * (NR + 24), y1 = NY - ny * (NR + 24);
      const line = K.path(svg, `M ${x0} ${y0} L ${x1} ${y1}`, { stroke: GREEN, 'stroke-width': 7 });
      const ang = Math.atan2(y1 - y0, x1 - x0) * 180 / Math.PI;
      const head = K.path(svg, 'M -18 -16 L 2 0 L -18 16', { stroke: GREEN, 'stroke-width': 7, transform: `translate(${x1} ${y1}) rotate(${ang})` });
      const pulse = K.circle(svg, x0, y0, 11, { fill: GREEN_DARK, opacity: 0 });
      return { c, line, head, pulse, x0, y0, x1, y1, word: o.w };
    });
    const t1 = cue(1);
    tl.fromTo(node, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.8)' }, t1 + 0.05);
    let prev = t1 + 0.3;
    chips.forEach((o, k) => {
      const t = Math.max(prev + (k ? 0.45 : 0), clamp(at(1, o.word, 0.25), t1 + 0.3, end(1) - 0.3));
      prev = t;
      tl.fromTo(o.c, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.55, ease: 'back.out(1.8)' }, t);
      A.draw(tl, o.line, t + 0.2, 0.5);
      A.in(tl, o.head, t + 0.6, 'fade', { dur: 0.2 });
    });

    // beat 3: the arrows pulse into the node; the takeaway line lands beneath
    const t2 = cue(2);
    [0, 1].forEach(r => {
      const tp = t2 + 0.2 + r * 1.1;
      chips.forEach(o => {
        tl.set(o.pulse, { attr: { cx: o.x0, cy: o.y0 }, opacity: 0 }, tp);
        tl.to(o.pulse, { opacity: 1, duration: 0.15 }, tp);
        tl.to(o.pulse, { attr: { cx: o.x1, cy: o.y1 }, duration: 0.7, ease: 'power1.in' }, tp);
        tl.to(o.pulse, { opacity: 0, duration: 0.12 }, tp + 0.62);
      });
      tl.fromTo(node, { boxShadow: '0 0 0 0px rgba(97,149,55,0.35), 0 16px 36px rgba(44,74,23,0.30)' },
        { boxShadow: '0 0 0 26px rgba(97,149,55,0), 0 16px 36px rgba(44,74,23,0.30)', duration: 0.8, ease: 'power2.out' }, tp + 0.7);
      A.pulse(tl, node, tp + 0.68, { scale: 1.07 });
    });
    const tf = K.flow(stage, { x: NX - 700, y: 836, w: 1400, align: 'center', gap: 16 });
    const take = K.text(tf, 'The outcome changes next time', { cls: 'v4e-take' });
    const tbar = K.el('div', 'accent-bar');
    tbar.style.position = 'relative';
    tf.appendChild(tbar);
    const tTake = clamp(at(2, 'The outcome alone', 0.3), t2 + 1.2, dur - 2.5);
    A.in(tl, take, tTake, 'fadeUp', { dur: 0.8 });
    tl.fromTo(tbar, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'power2.inOut', transformOrigin: '50% 50%' }, tTake + 0.4);
  });

  // ================================================================== ch01s21 The leash walk: before training
  registerScene('ch01s21', (ctx) => {
    const { stage, tl, cue, end } = ctx;
    const at = sayAt(ctx);
    setup(stage);
    const S = strip(stage, {
      label: 'Before training', labelVariant: 'red', panels: BEFORE,
      captions: ['Another dog appears too close.', 'Barking · Lunging · Growling', CAP_C],
    });
    const fn = fnChip(stage);

    // beat 1: three empty frames draw in with arrows between them; the function chip on "who wants space",
    // the red tab on "before training"
    S.cols.forEach((c, i) => {
      const t = cue(0) + 0.3 + i * 0.45;
      A.in(tl, c.head, t, 'fadeUp', { dur: 0.6 });
      A.draw(tl, c.frame, t + 0.1, 1.0);
      A.in(tl, c.win, t + 0.55, 'fade', { dur: 0.6 });
    });
    S.arrows.forEach((a, i) => A.in(tl, a, cue(0) + 1.0 + i * 0.45, 'fadeRight', { dur: 0.5 }));
    const tFn = clamp(at(0, 'who wants space', 0.3), cue(0) + 2.2, cue(1) - 2.2);
    const tTab = clamp(at(0, 'before training', 0.3), tFn + 1.0, cue(1) - 0.9);
    tl.fromTo(fn, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.8)' }, tFn);
    A.in(tl, S.label, tTab, 'fadeRight', { dur: 0.7 });

    // beats 2 to 4: panels fill with the illustrations and captions
    [0, 1, 2].forEach(i => fill(tl, S.cols[i], cue(i + 1)));

    // beat 2: the smoke alarm blinks red in panel A's corner, on "The smoke alarm goes off"
    const alarm = box(stage, 'v4e-alarm', null, { x: colX(0) + COLW - 33, y: PT - 33 });
    const ring = K.el('div', 'ring'), dot = K.el('div', 'dot');
    dot.appendChild(K.icon('alarm-smoke', { stroke: 2.2 }));
    alarm.appendChild(ring); alarm.appendChild(dot);
    const tAlarm = clamp(at(1, 'The smoke alarm', 0.1), cue(1) + 0.6, cue(2) - 1.2);
    A.in(tl, alarm, tAlarm, 'pop', { dur: 0.5 });
    tl.fromTo(ring, { opacity: 0.85, scale: 1 }, { opacity: 0, scale: 1.9, duration: 0.8, ease: 'power1.out', repeat: 4 }, tAlarm + 0.2);
    tl.to(dot, { backgroundColor: '#e8664a', duration: 0.4, yoyo: true, repeat: 7, ease: 'sine.inOut' }, tAlarm + 0.2);

    // beat 5: a red loop from C back to B ("repeats again and again"), the red note types on
    // ("the behavior worked"), and the loop gets its label ("more practice")
    const L = loop(stage, RED, 'Pattern gets practiced');
    const t4 = cue(4);
    const tLoop = clamp(at(4, 'this pattern repeats', 0.2), t4 + 0.2, end(4) - 5);
    showLoop(tl, L, tLoop);
    const nf = K.flow(stage, { x: SX, y: BAND + 76, w: SW, align: 'center', gap: 0 });
    const note = K.text(nf, 'Getting more space can make this behavior more likely next time.', { cls: 'v4e-note' });
    const nchars = new SplitText(note, { type: 'words,chars' }).chars;
    const tNote = clamp(at(4, 'the behavior worked', 0.3), tLoop + 1.3, end(4) - 2.6);
    tl.fromTo(nchars, { opacity: 0 }, { opacity: 1, duration: 0.01, stagger: 0.03, ease: 'none' }, tNote);
    const tLab = clamp(at(4, 'every repeat', 0.2), tNote + nchars.length * 0.03 + 0.1, cue(5) - 0.8);
    A.in(tl, L.label, tLab, 'fadeUp', { dur: 0.6 });

    // beat 6: on "Leaving is still right" the C caption's outline turns bright green with a small
    // "Keep the space" tag, and the green takeaway replaces the red note
    const capC = S.cols[2].cap;
    const tKeep = clamp(at(5, 'Leaving is still right', 0.3), cue(5) + 1.0, end(5) - 3);
    tl.to(capC, { borderColor: '#6fbf3a', backgroundColor: '#f3f8ec', boxShadow: '0 0 0 9px rgba(97,149,55,0.22)', duration: 0.7, ease: 'power2.out' }, tKeep);
    A.pulse(tl, capC, tKeep + 0.05, { scale: 1.04 });
    const kf = K.flow(stage, { x: colX(2), y: CAP_B + 18, w: COLW, align: 'center', gap: 0 });
    const keep = K.el('div', 'v4e-keep');
    keep.style.position = 'relative';
    keep.appendChild(K.icon('circle-check', { stroke: 2.6 }));
    keep.appendChild(K.el('span', null, 'Keep the space'));
    kf.appendChild(keep);
    tl.fromTo(keep, { opacity: 0, scale: 0.6, y: -10 }, { opacity: 1, scale: 1, y: 0, duration: 0.55, ease: 'back.out(1.8)' }, tKeep + 0.35);
    const cf = K.flow(stage, { x: SX, y: BAND + 64, w: SW, align: 'center', gap: 0 });
    const chip = K.chip(cf, 'Leaving is still right', { icon: 'circle-check', variant: 'green' });
    A.out(tl, [note, L.label], tKeep + 0.6, 'fadeUp', { dur: 0.45 });
    A.in(tl, chip, tKeep + 0.95, 'fadeUp', { dur: 0.7 });
  });

  // ================================================================== ch01s22 During training: change the A
  registerScene('ch01s22', (ctx) => {
    const { stage, tl, cue, end } = ctx;
    const at = sayAt(ctx);
    setup(stage);
    const S = strip(stage, { label: 'During training', labelVariant: 'green', panels: DURING, captions: ['Management.'] });
    const [cA, cB, cC] = S.cols;
    const fn = fnChip(stage);

    // quick entrance: the red tab, the function chip and the empty frames
    const red = box(stage, 'abc-label red', 'Before training', { x: SX, y: LY });
    A.in(tl, [red, fn], 0, 'fade', { dur: 0.35 });
    A.in(tl, S.cols.map(c => c.root), 0.05, 'fade', { dur: 0.4 });
    A.in(tl, S.arrows, 0.05, 'fade', { dur: 0.4 });
    S.cols.forEach(c => tl.set(c.img, { opacity: 0 }, 0));

    // beat 1: the tab flips to green "During training" (the chip stays put); A fills, B and C ghosted
    const t0 = Math.max(0.45, cue(0) - 0.05);
    tl.to(red, { rotationX: -90, transformPerspective: 700, duration: 0.28, ease: 'power2.in' }, t0);
    tl.set(red, { opacity: 0 }, t0 + 0.28);
    tl.fromTo(S.label, { rotationX: 90, transformPerspective: 700 }, { rotationX: 0, duration: 0.45, ease: 'power2.out' }, t0 + 0.28);
    tl.fromTo(cA.img, { opacity: 0, scale: 1.12 }, { opacity: 1, scale: 1, duration: 1.0, ease: 'power2.out' }, t0 + 0.4);
    [cB, cC].forEach((c, k) => {
      c.img.style.filter = 'grayscale(1)';
      tl.fromTo(c.img, { opacity: 0 }, { opacity: 1, duration: 0.9 }, t0 + 0.5 + k * 0.1);
      A.dim(tl, [c.head, c.panel], t0 + 0.5 + k * 0.1, 0.36, { dur: 0.7 });
    });
    S.arrows.forEach(a => A.set(tl, a, t0 + 0.5, { color: PALE_ARROW }, 0.7));

    // callout card (under the ghosted B and C) carries each beat's short on-screen text
    const CO = { x: colX(1) + 60, y: CAP_T + 52, w: colX(2) + COLW - 40 - (colX(1) + 60), h: 220 };
    const co = callout(stage, CO, ['Change the A', 'Change the setup', 'Calm dogs can learn', 'Spot it first']);
    const tA = clamp(at(0, 'we change is the A', 0.4), t0 + 1.2, end(0) - 1.5);
    A.in(tl, co.card, tA - 0.2, 'fadeUp', { dur: 0.7 });
    A.in(tl, co.lines[0], tA, 'fadeUp', { dur: 0.6 });
    // "your dog still gets space": the function chip answers with a small pulse
    A.pulse(tl, fn, clamp(at(0, 'still gets space', 0.1), tA + 1.2, cue(1) - 0.6), { scale: 1.08 });

    // beat 2: "Management." pops under A; four labeled management icons appear one per phrase
    const tSetup = clamp(at(1, 'we change the setup', 0.3), cue(1) + 0.3, end(1) - 5);
    A.in(tl, cA.cap, tSetup, 'pop', { dur: 0.6 });
    swap(tl, co.lines[0], co.lines[1], tSetup);
    const wrap = box(stage, 'v4e-tilewrap', null, { x: colX(0) - 30, y: BAND - 4, w: COLW + 80 });
    const grid = K.el('div', 'v4e-tiles');
    wrap.appendChild(grid);
    const TILES = [['move-horizontal', 'More distance'], ['map', 'Manageable place'], ['clock', 'Better timing'], ['undo-2', 'Less rehearsal']];
    const tiles = TILES.map(([ic, lbl]) => {
      const t = K.el('div', 'v4e-tile');
      const b = K.el('div', 'b');
      b.appendChild(K.icon(ic));
      t.appendChild(b);
      t.appendChild(K.el('div', 'l', lbl));
      grid.appendChild(t);
      return t;
    });
    let prev = tSetup + 0.4;
    ['More distance', 'a manageable place', 'better timing', 'less rehearsal'].forEach((p, k) => {
      const t = Math.max(prev + 0.4, clamp(at(1, p, 0.2), cue(1), end(1) - 0.3));
      prev = t;
      A.in(tl, tiles[k], t, 'pop', { dur: 0.55 });
    });

    // beat 3: X Surprised / Overwhelmed, then check Calm / Learning, one per phrase
    const cx = cxUnder(stage, 0, [
      { t: 'Surprised', yes: false }, { t: 'Calm', yes: true },
      { t: 'Overwhelmed', yes: false }, { t: 'Learning', yes: true },
    ], BAND + 120);
    const t2 = cue(2);
    const tSur = clamp(at(2, 'adjust before', 0.2), t2 + 0.3, end(2) - 4);
    const tOver = clamp(at(2, 'overwhelmed', 0.2), tSur + 0.5, end(2) - 3);
    const tCalm = clamp(at(2, 'calm enough', 0.2), tOver + 0.5, end(2) - 2);
    const tLearn = clamp(at(2, 'can learn', 0.2), tCalm + 0.5, end(2) - 0.3);
    A.in(tl, cx.items[0], tSur, 'fadeRight', { dur: 0.5 });
    A.in(tl, cx.items[2], tOver, 'fadeRight', { dur: 0.5 });
    A.in(tl, cx.items[1], tCalm, 'fadeRight', { dur: 0.5 });
    A.in(tl, cx.items[3], tLearn, 'fadeRight', { dur: 0.5 });
    swap(tl, co.lines[1], co.lines[2], tCalm);

    // beat 4: a "Try this" badge pins to the callout's top left corner; "Spot it first"; in panel A an eye badge
    // watches over a distance bar stretching between the two dogs (the head start)
    const tip = box(stage, 'v4e-try', null, { x: CO.x - 26, y: CO.y - 30 });
    tip.appendChild(K.icon('notebook-pen', { stroke: 2.4 }));
    tip.appendChild(K.el('span', null, 'Try this'));
    // on "Try this" the badge pins and the old line lifts off; "Spot it first" rises on "spot the other dog"
    const tTry = clamp(at(3, 'Try this', 0.2), cue(3), end(3) - 6);
    tl.fromTo(tip, { opacity: 0, scale: 0.4, rotation: -14 }, { opacity: 1, scale: 1, rotation: -4, duration: 0.7, ease: 'back.out(1.8)' }, tTry);
    tl.to(co.lines[2], { opacity: 0, y: -24, duration: 0.3, ease: 'power2.out' }, tTry);
    const tSpot = clamp(at(3, 'spot the other dog', 0.2), tTry + 0.9, end(3) - 4);
    tl.fromTo(co.lines[3], { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, tSpot);

    // panel A window: x colX(0)+6, y PT+6, 488 x 260
    const wx = colX(0) + 6, wy = PT + 6;
    const bx1 = wx + 262, bx2 = wx + 392, by = wy + 104;
    const svg = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const barG = K.group(svg);
    const barShadow = K.line(barG, bx1, by, bx2, by, { stroke: 'rgba(20,35,10,0.45)', 'stroke-width': 11, 'stroke-linecap': 'butt' });
    const bar = K.line(barG, bx1, by, bx2, by, { stroke: '#fff', 'stroke-width': 6, 'stroke-linecap': 'butt' });
    const ends = [bx1, bx2].map(x => K.circle(barG, x, by, 9, { fill: GREEN, stroke: '#fff', 'stroke-width': 4 }));
    const ticks = [[bx1, wy + 140], [bx2, wy + 124]].map(([x, y2]) => K.line(barG, x, by + 10, x, y2, { stroke: '#fff', 'stroke-width': 4, 'stroke-dasharray': '2 8' }));
    const eye = box(stage, 'v4e-eye', null, { x: (bx1 + bx2) / 2 - 34, y: wy + 14 });
    eye.appendChild(K.icon('eye', { stroke: 2.4 }));
    A.pulse(tl, cA.panel, tSpot, { scale: 1.03 });
    A.in(tl, eye, tSpot + 0.1, 'pop', { dur: 0.6 });
    const tBar = clamp(at(3, 'That head start', 0.2), tSpot + 1.0, end(3) - 1.2);
    A.in(tl, [bar, barShadow], tBar, 'fade', { dur: 0.1 });
    tl.fromTo([bar, barShadow], { attr: { x2: bx1 } }, { attr: { x2: bx2 }, duration: 0.8, ease: 'power2.inOut' }, tBar + 0.05);
    A.in(tl, ends[0], tBar, 'fade', { dur: 0.3 });
    A.in(tl, ends[1], tBar + 0.75, 'fade', { dur: 0.3 });
    A.in(tl, ticks, tBar + 0.8, 'fade', { dur: 0.4 });
  });

  // ================================================================== ch01s23 During training: change the B, keep the C
  registerScene('ch01s23', (ctx) => {
    const { stage, tl, cue, end } = ctx;
    const at = sayAt(ctx);
    setup(stage);
    const G = layer(stage);
    const S = strip(G, {
      label: 'During training', labelVariant: 'green', panels: DURING,
      captions: ['Management.', 'Teaching new behaviors.', CAP_C],
    });
    stage.appendChild(S.label);
    const fn = fnChip(stage);
    const [cA, cB, cC] = S.cols;

    // quick entrance: A in color, B and C ghosted
    [cB, cC].forEach(c => {
      c.img.style.filter = 'grayscale(1)';
      c.head.style.opacity = 0.36;
      c.panel.style.opacity = 0.36;
    });
    S.arrows.forEach(a => (a.style.color = PALE_ARROW));
    A.in(tl, [S.label, fn, ...S.cols.map(c => c.root), ...S.arrows], 0, 'fade', { dur: 0.45 });

    // callout under the (now quiet) A column carries each beat's short on-screen text
    const co = callout(G, { x: colX(0), y: BAND + 4, w: COLW, h: 196, sm: true },
      ['Change the B', 'Something else<br>to do', 'Keep the C<br>meaningful', 'Now calm<br>is what works']);

    // beat 1: B comes into full color, "Teaching new behaviors."; X's then checks, one per word
    const t0 = clamp(at(0, 'the B', 0.2), Math.max(0.6, cue(0)), end(0) - 6);
    A.undim(tl, [cB.head, cB.panel], t0, { dur: 0.8 });
    A.set(tl, cB.img, t0, { filter: 'grayscale(0)' }, 0.9);
    A.set(tl, S.arrows[0], t0, { color: OLIVE }, 0.6);
    A.in(tl, cB.cap, t0 + 0.35, 'pop', { dur: 0.6 });
    A.dim(tl, [cA.panel, cA.cap, cA.head], t0 + 0.2, 0.5, { dur: 0.8 });
    A.in(tl, co.card, t0 + 0.6, 'fadeUp', { dur: 0.7 });
    A.in(tl, co.lines[0], t0 + 0.8, 'fadeUp', { dur: 0.6 });
    const cxB = cxUnder(G, 1, [
      { t: 'Barking', yes: false }, { t: 'Look at you', yes: true },
      { t: 'Growling', yes: false }, { t: 'Check in', yes: true },
      { t: 'Lunging', yes: false }, { t: 'Move with you', yes: true },
    ], BAND + 6, { size: 28 });
    let prev = t0 + 0.8;
    ['barking', 'growling', 'lunging', 'looking at you', 'checking in', 'moving with you'].forEach((p, k) => {
      const t = Math.max(prev + 0.35, clamp(at(0, p, 0.15), t0 + 1.0, end(0) - 0.3));
      prev = t;
      const idx = k < 3 ? 2 * k : 2 * (k - 3) + 1;
      A.in(tl, cxB.items[idx], t, 'fadeRight', { dur: 0.5 });
    });

    // beat 2: the green checks pulse once; "Something else to do"
    const t1 = cue(1);
    const checks = [1, 3, 5].map(i => cxB.items[i]);
    const tPulse = clamp(at(1, 'something else to do', 0.3), t1 + 0.3, end(1) - 1.2);
    tl.to(checks, { scale: 1.14, color: GREEN_DARK, duration: 0.3, ease: 'power2.out', transformOrigin: '0% 50%', stagger: 0.1 }, tPulse);
    tl.to(checks, { scale: 1, color: '#212121', duration: 0.45, ease: 'power2.inOut', stagger: 0.1 }, tPulse + 0.35);
    swap(tl, co.lines[0], co.lines[1], tPulse);

    // beat 3: C comes into full color with its caption
    const t2 = cue(2);
    const tC = clamp(at(2, 'If your dog needs space', 0.3), t2 + 0.3, end(2) - 3);
    A.undim(tl, [cC.head, cC.panel], tC, { dur: 0.8 });
    A.set(tl, cC.img, tC, { filter: 'grayscale(0)' }, 0.9);
    A.set(tl, S.arrows[1], tC, { color: OLIVE }, 0.6);
    A.in(tl, cC.cap, tC + 0.35, 'pop', { dur: 0.6 });

    // beat 4: three green checks under C, one per word: Space, Relief, Safety
    const t3 = cue(3);
    const cxC = cxUnder(G, 2, [{ t: 'Space', yes: true }, { t: 'Relief', yes: true }, { t: 'Safety', yes: true }], BAND + 6, { cols: 1, size: 28 });
    const tKeepC = clamp(at(3, 'we keep the C meaningful', 0.3), t3, end(3) - 4);
    swap(tl, co.lines[1], co.lines[2], tKeepC);
    prev = tKeepC + 0.3;
    ['space, relief', 'relief, safety', 'safety. We'].forEach((p, k) => {
      const t = Math.max(prev + 0.4, clamp(at(3, p, 0.15), t3 + 0.5, end(3) - 0.3));
      prev = t;
      A.in(tl, cxC.items[k], t, 'fadeRight', { dur: 0.5 });
    });

    // beat 5: toddler analogy (the strip steps back while the card is up)
    const t4 = cue(4);
    A.out(tl, G, t4, 'fade', { dur: 0.5 });
    const card = box(stage, 'v4e-card', null, { x: 330, y: 262, w: 1260, h: 500 });
    const baby = K.iconBadge(card, 'baby', { x: 100, y: 88, size: 230, variant: 'red' });
    const BW = 760, BH = 300;
    const bub = K.el('div');
    bub.style.cssText = `position:absolute;left:400px;top:40px;width:${BW}px;height:${BH}px;`;
    card.appendChild(bub);
    const bsvg = K.svg(bub, { x: 0, y: 0, w: BW, h: BH });
    const smoothD = 'M 110 20 H 700 Q 740 20 740 60 V 220 Q 740 260 700 260 H 170 L 30 290 L 100 238 Q 70 226 70 196 V 60 Q 70 20 110 20 Z';
    const n = 26, cxp = 412, cyp = 140, rx = 318, ry = 116;
    const pts = [];
    for (let k = 0; k < n; k++) {
      const a = Math.PI + (k / n) * Math.PI * 2;
      const r = k % 2 ? 0.82 : 1.05;
      pts.push(`${(cxp + Math.cos(a) * rx * r).toFixed(1)} ${(cyp + Math.sin(a) * ry * r).toFixed(1)}`);
    }
    const jaggedD = 'M ' + pts.map((p, k) => (k === 23 ? 'L 30 290 L ' : k ? 'L ' : '') + p).join(' ') + ' Z';
    const bubble = K.path(bsvg, jaggedD, { fill: '#f8e3dd', stroke: RED, 'stroke-width': 7 });
    let sd = '';
    for (let k = 0; k <= 180; k++) {
      const u = k / 180, th = u * Math.PI * 2 * 5.5;
      sd += (k ? ' L ' : 'M ') + (262 + 300 * u + 36 * Math.cos(th + Math.PI)).toFixed(1) + ' ' + (140 + 44 * Math.sin(th)).toFixed(1);
    }
    const scribble = K.path(bsvg, sd, { stroke: RED, 'stroke-width': 6 });
    const btxt = K.el('div', 'v4e-bubble-txt', 'I need a break');
    btxt.style.cssText += 'left:70px;top:20px;width:670px;height:240px;';
    bub.appendChild(btxt);
    const lesson = K.el('div', 'v4e-plan', '<span>Same need,</span> <span>new words</span>');
    K.place(lesson, { x: 0, y: 378, w: 1260 });
    lesson.style.position = 'absolute';
    card.appendChild(lesson);

    A.in(tl, card, t4 + 0.35, 'fadeUp', { dur: 0.7 });
    A.in(tl, baby, t4 + 0.6, 'pop', { dur: 0.6 });
    const tMelt = clamp(at(4, 'melts down', 0.3), t4 + 0.9, end(4) - 6);
    A.in(tl, bub, tMelt, 'pop', { dur: 0.5 });
    A.draw(tl, scribble, tMelt + 0.2, 1.2);
    tl.to(bub, { x: 5, duration: 0.07, yoyo: true, repeat: 13, ease: 'none' }, tMelt + 0.4);
    const tm = clamp(at(4, 'You teach them', 0.2), tMelt + 2.2, end(4) - 2);
    tl.to(scribble, { opacity: 0, duration: 0.3 }, tm);
    tl.to(bubble, { morphSVG: smoothD, duration: 1.0, ease: 'power2.inOut' }, tm);
    tl.to(bubble, { fill: '#f3f8ec', stroke: GREEN, duration: 1.0, ease: 'power2.inOut' }, tm);
    tl.to(baby, { backgroundColor: '#e8f1dc', color: GREEN_DARK, duration: 1.0 }, tm);
    A.in(tl, btxt, tm + 0.6, 'fadeUp', { dur: 0.6 });
    const [l1, l2] = lesson.querySelectorAll('span');
    [l1, l2].forEach(s => (s.style.display = 'inline-block'));
    A.in(tl, l1, clamp(at(4, "You don't cancel the break", 0.2), tMelt + 1.4, tm - 0.4), 'fadeUp', { dur: 0.7 });
    A.in(tl, l2, tm + 1.0, 'fadeUp', { dur: 0.7 });

    // beat 6: back to the strip, a green loop from C back to B; "Now calm is what works"
    // (the card holds into the first words of the beat so its last line can be read)
    const t5 = cue(5);
    A.out(tl, card, t5 + 0.35, 'fade', { dur: 0.35 });
    tl.to(G, { opacity: 1, duration: 0.45, ease: 'power2.out' }, t5 + 0.7);
    tl.set(co.lines[2], { opacity: 0 }, t5);
    A.in(tl, co.lines[3], clamp(at(5, 'calm is what works', 0.3), t5 + 1.0, end(5) - 1), 'fadeUp', { dur: 0.6 });
    const L = loop(G, GREEN, null);
    showLoop(tl, L, t5 + 0.95);
  });

  // ================================================================== ch01s24 After training
  registerScene('ch01s24', (ctx) => {
    const { stage, tl, cue, end, dur } = ctx;
    const at = sayAt(ctx);
    setup(stage);
    const S = strip(stage, {
      label: 'After training', labelVariant: 'green', panels: AFTER,
      captions: ['Less management as skills improve.', 'Readily uses the new behavior.', CAP_C],
    });
    const fn = fnChip(stage);
    const [cA, cB, cC] = S.cols;

    // beat 1: the green tab slides in with the function chip, the frames draw in; then the after
    // panels fill one per clause (the trigger appears / they use the new behavior / space is given)
    A.in(tl, S.label, Math.max(0, cue(0) - 0.25), 'fadeRight', { dur: 0.7 });
    A.in(tl, fn, cue(0) + 0.2, 'fade', { dur: 0.6 });
    S.cols.forEach((c, i) => {
      const t = cue(0) + 0.2 + i * 0.25;
      A.in(tl, c.head, t, 'fadeUp', { dur: 0.6 });
      A.draw(tl, c.frame, t + 0.05, 0.8);
      A.in(tl, c.win, t + 0.4, 'fade', { dur: 0.5 });
    });
    A.in(tl, S.arrows, cue(0) + 0.7, 'fadeRight', { dur: 0.5, stagger: 0.25 });
    const tFa = clamp(at(0, 'The trigger appears', 0.2), cue(0) + 1.3, end(0) - 4);
    const tFb = clamp(at(0, 'they use the new behavior', 0.3), tFa + 1.2, end(0) - 1.6);
    const tFc = Math.min(tFb + 1.1, cue(1) - 0.3);
    [tFa, tFb, tFc].forEach((t, i) => fill(tl, S.cols[i], t));

    // beat 2: A and C dim to 40 percent; panel B scales gently in place (115 percent: the 591 px raster is
    // shown at 575 px and stays sharp) and its frame glows green; "The ABC has changed"
    const t1 = cue(1);
    A.dim(tl, [cA.root, cC.root], t1, 0.4, { dur: 0.8 });
    A.out(tl, S.arrows, t1, 'fade', { dur: 0.5 });
    // origin just below the head so the column grows mostly downward and clears the chip above it
    tl.to(cB.root, { scale: 1.15, transformOrigin: '50% 66px', duration: 2.2, ease: 'power2.inOut' }, t1 + 0.1);
    tl.to(cB.frame, { attr: { stroke: GREEN }, duration: 0.8, ease: 'power2.out' }, t1 + 0.5);
    tl.fromTo(cB.panel, { boxShadow: '0 0 0 0px rgba(97,149,55,0), 0 0 0px rgba(97,149,55,0)' },
      { boxShadow: '0 0 0 8px rgba(97,149,55,0.25), 0 0 44px rgba(97,149,55,0.55)', duration: 0.9, ease: 'power2.out' }, t1 + 0.5);
    A.kenburns(tl, cB.img, { from: 1.0, to: 1.05, t0: t1 + 0.3, t1: cue(2) + 0.6 });
    const pf = K.flow(stage, { x: 160, y: 836, w: 1600, align: 'center', gap: 0 });
    const changed = K.text(pf, 'The ABC has changed', { cls: 'v4e-changed' });
    A.in(tl, changed, clamp(at(1, 'The ABC has changed', 0.3), t1 + 1.2, end(1) - 0.6), 'fadeUp', { dur: 0.8 });

    // beat 3: the panels fade; "A dog with a better plan." settles large in green, sparkles twinkle around it
    const t2 = cue(2);
    A.out(tl, [...S.cols.map(c => c.root), changed, S.label, fn], t2, 'fade', { dur: 0.6 });
    const halo = box(stage, 'v4e-halo', null, { x: 260, y: 230, w: 1400, h: 640 });
    A.in(tl, halo, t2 + 0.3, 'fade', { dur: 1.2 });
    const H = K.heading(stage, 'A dog with a better plan.', { x: 160, y: 372, w: 1600, size: 104, align: 'center', barGap: 34 });
    const tPlan = clamp(at(2, 'a dog with a better plan', 0.4), t2 + 0.6, end(2) - 6);
    tl.fromTo(H.title, { opacity: 0, y: 36, scale: 1.04 }, { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: 'power3.out' }, tPlan);
    tl.fromTo(H.bar, { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: 'power2.inOut', transformOrigin: '50% 50%' }, tPlan + 0.5);
    const wf = K.flow(stage, { x: 160, y: 640, w: 1600, align: 'center', gap: 0 });
    const wins = K.text(wf, 'Celebrate small wins', { cls: 'v4e-wins' });
    // on "small moments" (the line needs time to be read before the scene ends)
    A.in(tl, wins, clamp(at(2, 'small moments', 0.2), tPlan + 1.5, dur - 1.6), 'fadeUp', { dur: 0.8 });
    const SP = [
      [300, 330, 80, GREEN], [200, 548, 46, '#8fbf63'], [430, 742, 58, GREEN_DARK], [610, 262, 40, '#8fbf63'],
      [1330, 252, 44, GREEN_DARK], [1600, 318, 72, GREEN], [1720, 540, 48, GREEN_DARK], [1492, 748, 62, '#8fbf63'],
      [960, 820, 40, GREEN],
    ];
    const sparks = SP.map(([x, y, s, col]) => {
      const d = box(stage, 'v4e-spark', null, { x: x - s / 2, y: y - s / 2, w: s, h: s });
      d.appendChild(K.icon('sparkle', { size: s, color: col, stroke: 1.8 }));
      d.firstChild.setAttribute('fill', col);
      return d;
    });
    sparks.forEach((d, k) => {
      const t = tPlan + 0.5 + k * 0.12;
      tl.fromTo(d, { opacity: 0, scale: 0, rotation: -40 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.6, ease: 'back.out(2)' }, t);
      const tw = t + 0.7 + (k % 3) * 0.25;
      const reps = Math.max(1, Math.floor((dur - 0.6 - tw) / 0.8));
      tl.to(d, { scale: 0.62, opacity: 0.55, duration: 0.8, yoyo: true, repeat: reps, ease: 'sine.inOut' }, tw);
    });
  });
})();
