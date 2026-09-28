// Part 1, one-chapter version: scenes built by group f.
//   ch01s25  Why function matters       function rows, four step chips, "A better way to ask."
//   ch01s26  Warning signals            the eight-rung warning ladder
//   ch01s27  Never punish the warning   statement, taped check engine light, iceberg, action plan
//   ch01s28  Start your list            the worksheet: "My dog's situations"
//   ch01s29  Put it all together        the framework cards, the whole pattern, logo sign-off
(() => {
  const GREEN = '#619537', GREEN_DARK = '#3f6b22', GREEN_LIGHT = '#b8d99a', RED = '#b8452d', AMBER = '#d9912b';

  const CSS = `
    .v4f-layer { position:absolute; }
    .v4f-try { position:absolute; display:inline-flex; align-items:center; gap:12px; padding:14px 26px 14px 18px; border-radius:999px; background:var(--green);
      color:#fff; font:700 26px/1 var(--font-body); letter-spacing:3px; text-transform:uppercase; white-space:nowrap; box-shadow:0 10px 22px rgba(44,74,23,0.26); z-index:7; }
    .v4f-try svg { width:32px; height:32px; stroke-width:2.4; }
    .v4f-halo { position:absolute; border-radius:50%; background:radial-gradient(closest-side, rgba(232,241,220,0.95), rgba(232,241,220,0.55) 55%, rgba(232,241,220,0) 100%); }

    /* ch01s25 */
    .v4f-colh { position:absolute; font:700 28px/1 var(--font-body); letter-spacing:4px; text-transform:uppercase; color:var(--green-dark); white-space:nowrap; }
    .v4f-fn { position:absolute; display:flex; align-items:center; gap:26px; padding:0 30px 0 18px; background:#fff; border-radius:26px;
      border:1px solid #e6e9e1; box-shadow:var(--shadow-soft); }
    .v4f-fn .ib { flex:0 0 auto; width:80px; height:80px; border-radius:50%; background:var(--green-pale); color:var(--green-dark); display:grid; place-items:center; }
    .v4f-fn .ib svg { width:44px; height:44px; stroke-width:2.2; }
    .v4f-fn .t { font:700 46px/1 var(--font-head); color:var(--ink); white-space:nowrap; }
    .v4f-do { position:absolute; display:flex; align-items:center; gap:24px; padding:0 34px 0 38px; background:var(--green-mist); border:2px solid var(--green-pale);
      border-radius:26px; overflow:hidden; box-shadow:var(--shadow-soft); }
    .v4f-do::before { content:''; position:absolute; left:0; top:0; bottom:0; width:12px; background:var(--green); }
    .v4f-do .ck { flex:0 0 auto; width:54px; height:54px; border-radius:50%; background:var(--green); color:#fff; display:grid; place-items:center; }
    .v4f-do .ck svg { width:32px; height:32px; }
    .v4f-do .t { font:700 46px/1 var(--font-head); color:var(--green-dark); white-space:nowrap; }
    .v4f-step { position:absolute; display:flex; align-items:center; gap:18px; padding:0 22px 0 20px; background:#fff; border-radius:26px;
      border:1px solid #e6e9e1; box-shadow:var(--shadow-soft); }
    .v4f-step .n { flex:0 0 auto; width:58px; height:58px; border-radius:50%; background:var(--green); color:#fff; display:grid; place-items:center; font:700 30px/1 var(--font-head); }
    .v4f-step .t { font:700 31px/1.2 var(--font-body); color:var(--ink); }
    .v4f-chev { position:absolute; width:44px; height:44px; color:var(--green); }
    .v4f-chev svg { width:44px; height:44px; stroke-width:3; }

    /* ch01s26 */
    .v4f-pin { position:absolute; display:flex; align-items:center; gap:14px; padding:10px 28px 10px 10px; border-radius:999px;
      background:var(--amber); color:#fff; font:700 32px/1 var(--font-body); white-space:nowrap; box-shadow:0 12px 26px rgba(120,70,10,0.26); }
    .v4f-pin .eye { width:56px; height:56px; border-radius:50%; background:#fff; color:var(--amber); display:grid; place-items:center; }
    .v4f-pin .eye svg { width:34px; height:34px; }
    .v4f-info { position:absolute; font:700 60px/1.05 var(--font-head); color:var(--green); white-space:nowrap; }
    .v4f-info-s { position:absolute; font:600 36px/1.3 var(--font-body); color:var(--ink); }

    /* ch01s27 */
    .v4f-bigh { position:absolute; font:700 80px/1.06 var(--font-head); color:var(--green); white-space:nowrap; letter-spacing:-0.5px; }
    .v4f-tape { position:absolute; width:270px; height:88px; background:linear-gradient(180deg, #f5ecd4 0%, #e8d9b2 100%);
      clip-path:polygon(0% 10%, 3% 0%, 6% 12%, 9% 2%, 12% 0%, 88% 0%, 91% 8%, 94% 0%, 97% 12%, 100% 4%, 100% 90%, 97% 100%, 94% 88%, 91% 100%, 88% 94%, 12% 100%, 9% 90%, 6% 100%, 3% 88%, 0% 96%); }
    .v4f-tape::after { content:''; position:absolute; left:8%; right:8%; top:30%; height:10px; background:rgba(255,255,255,0.45); border-radius:5px; }
    .v4f-cap { position:absolute; font:700 62px/1.14 var(--font-head); color:var(--ink); }
    .v4f-emo { position:absolute; text-align:center; font:700 36px/1 var(--font-head); color:var(--green-deep); white-space:nowrap; }
    .v4f-emo.big { font-size:48px; }
    .v4f-growl { position:absolute; padding:16px 32px; border-radius:28px; background:var(--green); color:#fff; font:700 36px/1.1 var(--font-body); white-space:nowrap; }
    .v4f-ghost { position:absolute; border-radius:28px; border:4px dashed #8fb96a; }
    .v4f-plan { background:#fff; border-radius:26px; border:1px solid #e6e9e1; box-shadow:var(--shadow-soft); padding:64px 44px 42px; }

    /* ch01s28 */
    .v4f-clip { position:absolute; width:150px; height:150px; border-radius:50%; background:var(--green); color:#fff; display:grid; place-items:center;
      border:6px solid #fff; box-shadow:var(--shadow); z-index:6; }
    .v4f-clip svg { width:76px; height:76px; stroke-width:2.2; }
    .v4f-ws { position:absolute; background:#fff; border-radius:26px; box-shadow:var(--shadow); border:1px solid #e6e9e1; }
    .v4f-ws svg.lines { position:absolute; left:0; top:0; overflow:visible; }
    .v4f-ws .ttl { position:absolute; font:700 50px/1 var(--font-head); color:var(--ink); white-space:nowrap; }
    .v4f-ws .th { position:absolute; font:700 32px/1 var(--font-head); color:var(--green-dark); white-space:nowrap; }
    .v4f-ws .th2 { position:absolute; font:600 26px/1 var(--font-body); color:var(--muted); white-space:nowrap; }
    .v4f-ws .cell { position:absolute; }
    .v4f-wr { position:relative; display:inline-block; }
    .v4f-wr .txt { display:block; overflow:hidden; white-space:nowrap; max-width:0; font:italic 500 34px/1.25 var(--font-body); color:var(--ink); }
    .v4f-wr .pen { position:absolute; left:100%; bottom:4px; margin-left:2px; width:52px; height:52px; color:var(--green-dark); }
    .v4f-wr .pen svg { width:52px; height:52px; }
    .v4f-band { position:absolute; border-radius:18px; background:var(--amber-pale); }
    .v4f-eb { position:absolute; width:58px; height:58px; border-radius:50%; background:#fff; color:#a8650f; display:grid; place-items:center; box-shadow:0 4px 12px rgba(120,70,10,0.14); }
    .v4f-eb svg { width:34px; height:34px; stroke-width:2.3; }
    .v4f-rrow { position:absolute; display:flex; justify-content:flex-end; align-items:center; }
    .v4f-hint { position:absolute; right:0; top:0; display:inline-flex; align-items:center; gap:12px; padding:14px 28px; border-radius:999px; background:var(--green-pale);
      color:var(--green-deep); font:700 30px/1 var(--font-body); white-space:nowrap; }
    .v4f-hint svg { width:34px; height:34px; stroke-width:2.3; }
    .v4f-tag { position:absolute; width:46px; height:46px; border-radius:50%; background:var(--green); color:#fff; display:grid; place-items:center;
      font:700 27px/1 var(--font-head); box-shadow:0 5px 12px rgba(44,74,23,0.28); }

    /* ch01s29 */
    .v4f-q { position:absolute; display:flex; align-items:center; gap:26px; padding:0 30px 0 28px; background:#fff; border-radius:26px;
      border:1px solid #e6e9e1; box-shadow:var(--shadow-soft); }
    .v4f-q .lt { flex:0 0 auto; width:96px; height:96px; border-radius:24px; background:var(--olive); color:#fff; display:grid; place-items:center; font:800 58px/1 var(--font-head); }
    .v4f-q .t { font:700 38px/1.18 var(--font-head); color:var(--ink); }
    .v4f-fc { position:absolute; display:flex; align-items:center; gap:30px; padding:0 40px 0 32px; background:var(--green-mist); border:2px solid var(--green-pale);
      border-radius:26px; box-shadow:var(--shadow-soft); }
    .v4f-fc .ib { flex:0 0 auto; width:100px; height:100px; border-radius:50%; background:var(--green); color:#fff; display:grid; place-items:center; }
    .v4f-fc .ib svg { width:54px; height:54px; stroke-width:2.2; }
    .v4f-fc .nm { font:700 46px/1.05 var(--font-head); color:var(--green-dark); white-space:nowrap; }
    .v4f-fc .qq { margin-top:10px; font:500 34px/1.25 var(--font-body); color:var(--ink); white-space:nowrap; }
    .v4f-pill { position:absolute; display:inline-flex; align-items:center; gap:14px; padding:16px 36px; border-radius:999px; background:var(--green); color:#fff;
      font:700 36px/1 var(--font-head); white-space:nowrap; box-shadow:0 12px 26px rgba(44,74,23,0.24); }
    .v4f-pill svg { width:38px; height:38px; stroke-width:2.4; }
    .v4f-close { position:absolute; left:0; width:1920px; text-align:center; white-space:nowrap; }
  `;

  // ------------------------------------------------------------------ helpers
  const setup = stage => { stage.classList.add('v4f'); stage.appendChild(K.el('style', null, CSS)); };
  const box = (parent, cls, html, o) => {
    const n = K.el('div', cls, html == null ? null : K.md(html));
    K.place(n, o || {});
    parent.appendChild(n);
    return n;
  };
  // time a reveal to a phrase inside beat i's narration, leading by `lead` s; never before the beat's cue
  const sayAt = ctx => (i, phrase, lead = 0.3, fb = 0.5) => Math.max(ctx.cue(i), window.phraseTime(ctx, i, phrase, fb) - lead);
  const clamp = (t, lo, hi) => Math.max(lo, Math.min(t, hi));
  const tryBadge = (parent, o) => {
    const b = box(parent, 'v4f-try', null, o);
    b.appendChild(K.icon('notebook-pen', { stroke: 2.4 }));
    b.appendChild(K.el('span', null, 'Try this'));
    return b;
  };
  const layer = parent => box(parent, 'v4f-layer', null, { x: 0, y: 0, w: 1920, h: 1080 });
  /** Straight arrow with an open chevron head. Returns {g, shaft, head}. */
  function arrow(svg, x1, y1, x2, y2, o = {}) {
    const g = K.group(svg);
    const len = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / len, uy = (y2 - y1) / len;
    const sw = o.width ?? 8, hl = o.head ?? 24, a = (40 * Math.PI) / 180, ang = Math.atan2(uy, ux);
    const col = o.color || GREEN;
    const shaft = K.line(g, x1, y1, x2 - ux * 3, y2 - uy * 3, { stroke: col, 'stroke-width': sw });
    const ax = x2 - hl * Math.cos(ang - a), ay = y2 - hl * Math.sin(ang - a);
    const bx = x2 - hl * Math.cos(ang + a), by = y2 - hl * Math.sin(ang + a);
    const head = K.path(g, `M${ax} ${ay} L${x2} ${y2} L${bx} ${by}`, { stroke: col, 'stroke-width': sw, fill: 'none' });
    return { g, shaft, head };
  }

  // ================================================================== ch01s25  Why function matters
  registerScene('ch01s25', (ctx) => {
    const { stage, tl, cue, dur } = ctx;
    const at = sayAt(ctx);
    setup(stage);

    // beat 0: the heading writes on beside a target icon; the left column label follows
    const t0 = cue(0);
    const ib = K.iconBadge(stage, 'target', { x: 100, y: 114, size: 100, variant: 'solid' });
    const h = K.heading(stage, 'Why function matters', { x: 232, y: 120, w: 1300, size: 84 });
    tl.fromTo(ib, { opacity: 0, scale: 0.4, rotation: -40 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.7, ease: 'back.out(1.8)' }, Math.max(0, t0 - 0.2));
    A.in(tl, h.title, t0 + 0.1, 'wipe', { dur: 1.0 });
    A.in(tl, h.bar, t0 + 0.9, 'grow', { dur: 0.6 });

    const ROWS = [
      { icon: 'move-horizontal', fn: 'Distance', act: 'Address distance', say: ['creates distance', 'we address distance'] },
      { icon: 'key', fn: 'Access', act: 'Address access', say: ['about access', 'we address access'] },
      { icon: 'zap', fn: 'Arousal', act: 'Help them regulate', say: ['arousal', 'learn to regulate'] },
    ];
    const LX = 170, LW = 520, AX0 = 722, AX1 = 858, RX = 890, RW = 860, RH = 112, RY = [362, 500, 638];
    const hL = box(stage, 'v4f-colh', 'Understand the function', { x: LX + 4, y: 302 });
    const hR = box(stage, 'v4f-colh', 'Then change the pattern', { x: RX + 4, y: 302 });
    A.in(tl, hL, clamp(at(0, 'what a behavior is accomplishing', 0.3), t0 + 1.4, cue(1) - 1), 'fadeUp', { dur: 0.7 });

    // beat 1: three rows tick in, the function first, then what we address
    const grp = layer(stage);
    const svg = K.svg(grp, { x: 0, y: 0, w: 1920, h: 1080 });
    const rows = ROWS.map((r, i) => {
      const y = RY[i];
      const L = box(grp, 'v4f-fn', null, { x: LX, y, w: LW, h: RH });
      box(L, 'ib').appendChild(K.icon(r.icon));
      box(L, 't', r.fn);
      const ar = arrow(svg, AX0, y + RH / 2, AX1, y + RH / 2, { width: 7, head: 22 });
      const R = box(grp, 'v4f-do', null, { x: RX, y, w: RW, h: RH });
      const ck = box(R, 'ck');
      ck.appendChild(K.icon('check', { stroke: 3 }));
      box(R, 't', r.act);
      return { L, R, ck, ar };
    });
    const t1 = cue(1);
    let prev = t1;
    rows.forEach((r, i) => {
      const tA = Math.max(prev, at(1, ROWS[i].say[0], 0.4));
      A.in(tl, r.L, tA, 'fadeRight', { dur: 0.6 });
      A.draw(tl, r.ar.shaft, tA + 0.35, 0.4);
      A.in(tl, r.ar.head, tA + 0.65, 'fade', { dur: 0.2 });
      const tB = Math.max(tA + 0.9, at(1, ROWS[i].say[1], 0.3));
      if (i === 0) A.in(tl, hR, tB - 0.25, 'fadeUp', { dur: 0.6 });
      A.in(tl, r.R, tB, 'fadeRight', { dur: 0.6 });
      A.in(tl, r.ck, tB + 0.2, 'pop', { dur: 0.5 });
      prev = tB + 0.6;
    });

    // beat 2: the rows slide up and step back; four step chips appear in a line, one per phrase
    const t2 = cue(2);
    A.out(tl, [hL, hR], t2 - 0.1, 'fadeUp', { dur: 0.4 });
    tl.to(grp, { y: -60, opacity: 0.5, duration: 0.9, ease: 'power3.inOut' }, t2 + 0.1);
    const STEPS = [['Understand it', 'understand why'], ['Change the conditions', 'change the conditions'],
      ['Teach a new response', 'teach a new response'], ['Keep it working', 'make sure it still works']];
    const SW = 370, SG = 54, SH = 120, SY = 790, SX = 960 - (4 * SW + 3 * SG) / 2;
    const steps = STEPS.map(([t], i) => {
      const s = box(stage, 'v4f-step', null, { x: SX + i * (SW + SG), y: SY, w: SW, h: SH });
      box(s, 'n', String(i + 1));
      box(s, 't', t);
      return s;
    });
    const chevs = [0, 1, 2].map(i => {
      const c = box(stage, 'v4f-chev', null, { x: SX + (i + 1) * SW + i * SG + (SG - 44) / 2, y: SY + SH / 2 - 22 });
      c.appendChild(K.icon('chevron-right'));
      return c;
    });
    prev = t2 + 0.7;
    steps.forEach((s, i) => {
      const t = Math.max(prev, at(2, STEPS[i][1], 0.3));
      if (i) A.in(tl, chevs[i - 1], t - 0.15, 'fadeRight', { dur: 0.4 });
      A.in(tl, s, t, 'fadeUp', { dur: 0.6 });
      prev = t + 0.55;
    });

    // beat 3: the chips fade and the rows return (what the dog needs); then everything clears and
    // "A better way to ask." settles large in green over its accent bar
    const t3 = cue(3);
    A.out(tl, [...steps, ...chevs], t3 - 0.1, 'fade', { dur: 0.5 });
    tl.to(grp, { opacity: 1, duration: 0.7, ease: 'power2.out' }, t3 + 0.2);
    const ts = clamp(at(3, 'we give them', 0.2), t3 + 1.6, dur - 3.2);
    A.out(tl, [grp, ib, ...h.all], ts - 0.6, 'fade', { dur: 0.5 });
    const halo = box(stage, 'v4f-halo', null, { x: 260, y: 240, w: 1400, h: 620 });
    A.in(tl, halo, ts - 0.2, 'fade', { dur: 1.2 });
    const S = K.heading(stage, 'A better way to ask.', { x: 160, y: 420, w: 1600, size: 128, align: 'center', barGap: 34 });
    tl.fromTo(S.title, { opacity: 0, y: 36, scale: 1.04 }, { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: 'power3.out' }, ts);
    tl.fromTo(S.bar, { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: 'power2.inOut', transformOrigin: '50% 50%' }, ts + 0.5);
  });

  // ================================================================== ch01s26  Warning signals
  registerScene('ch01s26', (ctx) => {
    const { stage, tl, cue } = ctx;
    const at = sayAt(ctx);
    setup(stage);

    const h = K.heading(stage, 'Warning signals', { x: 100, y: 120, size: 84 });
    A.in(tl, h.title, Math.max(0, cue(0) - 0.2), 'fadeUp', { dur: 0.8 });
    A.in(tl, h.bar, cue(0) + 0.3, 'grow', { dur: 0.6 });

    const RUNGS = [
      { t: 'Turn away', icon: 'undo-2' }, { t: 'Freeze', icon: 'snowflake' }, { t: 'Stiffen', icon: 'person-standing' },
      { t: 'Stare', icon: 'eye' }, { t: 'Growl', icon: 'volume-2' }, { t: 'Lip lift', icon: 'triangle-alert' },
      { t: 'Snap', icon: 'zap' }, { t: 'Bite', icon: 'octagon-alert' },
    ];
    // four soft greens, then yellow, amber, orange, red
    const COL = ['#86b851', '#7fb24a', '#8bb543', '#98b83e', '#c4a52b', '#d9912b', '#cf6a2c', '#b8452d'];
    const N = RUNGS.length, LW = 540, RH = 68, RG = 12;
    const HH = N * RH + (N - 1) * RG;
    const LX = Math.round(960 - (LW + 48) / 2), LY = 298;
    const L = K.ladder(stage, RUNGS, { x: LX, y: LY, w: LW, rungH: RH, gap: RG, size: 31 });
    L.rails.forEach(r => (r.style.bottom = '-20px'));
    L.root.style.height = `${HH}px`;
    const rungTop = i => LY + HH - (i + 1) * RH - i * RG;
    const SHADOW = '0 6px 16px rgba(40,60,20,0.14)';

    // every rung starts as an empty outline in its own color
    L.rungs.forEach((r, i) => {
      Object.assign(r.style, { background: 'rgba(255,255,255,0.6)', border: `3px solid ${COL[i]}`, color: COL[i], boxShadow: '0 6px 16px rgba(40,60,20,0)' });
      if (i === 4) r.style.textShadow = '0 1px 3px rgba(80,60,0,0.35)';
      [...r.children].forEach(c => (c.style.opacity = 0));
    });
    const fillRung = (i, t) => {
      const r = L.rungs[i];
      tl.to(r, { backgroundColor: COL[i], color: '#ffffff', boxShadow: SHADOW, duration: 0.5, ease: 'power2.out' }, t);
      tl.fromTo([...r.children], { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.5, stagger: 0.06 }, t + 0.1);
    };

    // beat 0: the ladder draws itself in, bottom to top
    const t0 = cue(0);
    tl.fromTo(L.rails, { scaleY: 0, transformOrigin: '50% 100%' }, { scaleY: 1, duration: 1.5, ease: 'power2.inOut' }, t0 + 0.4);
    tl.fromTo(L.rungs, { opacity: 0, scaleX: 0.6 }, { opacity: 1, scaleX: 1, duration: 0.5, stagger: 0.14, ease: 'power3.out' }, t0 + 0.6);

    // beat 1: the four quiet rungs fill soft green as each is named
    let prev = cue(1);
    ['turning away', 'freezing', 'stiffening', 'a hard stare'].forEach((p, k) => {
      const t = Math.max(prev, at(1, p, 0.2));
      fillRung(k, t);
      prev = t + 0.45;
    });

    // beat 2: louder: growl, lip lift, snap shift yellow to orange; then the top rung flashes red
    prev = cue(2) + 0.2;
    ['a growl', 'a lip lift', 'a snap'].forEach((p, k) => {
      const t = Math.max(prev, at(2, p, 0.2));
      fillRung(k + 4, t);
      prev = t + 0.5;
    });
    const bite = L.rungs[7];
    const tb = Math.max(prev + 0.3, at(2, 'a bite', 0.2));
    fillRung(7, tb);
    tl.to(bite, { boxShadow: '0 0 0 22px rgba(184,69,45,0.30)', scale: 1.06, duration: 0.28, ease: 'power2.out' }, tb + 0.3);
    tl.to(bite, { boxShadow: SHADOW, scale: 1, duration: 0.5, ease: 'power2.inOut' }, tb + 0.58);
    tl.to(bite, { boxShadow: '0 0 0 14px rgba(184,69,45,0.22)', duration: 0.25, ease: 'power2.out' }, tb + 1.1);
    tl.to(bite, { boxShadow: SHADOW, duration: 0.5, ease: 'power2.inOut' }, tb + 1.35);

    // beat 3: three quiet rungs flicker faint; an eye pin marks them "Easy to miss"
    const t3 = cue(3);
    const faint = [L.rungs[0], L.rungs[1], L.rungs[2]];
    tl.to(faint, { opacity: 0.25, duration: 0.14, ease: 'none', yoyo: true, repeat: 5, stagger: 0.09 }, t3 + 0.2);
    tl.to(faint, { opacity: 0.42, duration: 0.5, ease: 'power2.out' }, t3 + 1.3);
    const qTop = rungTop(2), qBot = rungTop(0) + RH, qMid = (qTop + qBot) / 2;
    const bsvg = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const qx = LX - 20;
    const qBrace = K.path(bsvg, `M${qx + 14} ${qTop + 4} L${qx} ${qTop + 4} L${qx} ${qBot - 4} L${qx + 14} ${qBot - 4}`,
      { stroke: AMBER, 'stroke-width': 5, 'stroke-dasharray': '10 10' });
    const pin = box(stage, 'v4f-pin', null, { x: qx - 30, y: qMid - 38 });
    gsap.set(pin, { xPercent: -100 });
    box(pin, 'eye').appendChild(K.icon('eye', { stroke: 2.4 }));
    pin.appendChild(K.el('span', null, 'Easy to miss'));
    const tp = clamp(at(3, 'subtle', 0.4), t3 + 1.0, cue(4) - 1.2);
    A.draw(tl, qBrace, tp - 0.2, 0.6);
    A.in(tl, pin, tp, 'fadeRight', { dur: 0.7 });

    // beat 4: the quiet rungs come back; a green bracket wraps the seven rungs below the bite: "Information"
    const t4 = cue(4);
    tl.to(faint, { opacity: 1, duration: 0.6, ease: 'power2.out' }, t4);
    const y1 = rungTop(6) + 4, y2 = rungTop(0) + RH - 4, mid = (y1 + y2) / 2, bx = LX + LW + 52, r = 24;
    const brace = K.path(bsvg, `M${bx} ${y1} Q${bx + r} ${y1} ${bx + r} ${y1 + r} L${bx + r} ${mid - r} Q${bx + r} ${mid} ${bx + 2 * r} ${mid} ` +
      `M${bx} ${y2} Q${bx + r} ${y2} ${bx + r} ${y2 - r} L${bx + r} ${mid + r} Q${bx + r} ${mid} ${bx + 2 * r} ${mid}`, { stroke: GREEN, 'stroke-width': 6 });
    const ix = bx + 2 * r + 34;
    const info = box(stage, 'v4f-info', 'Information', { x: ix, y: mid - 74 });
    const infoS = box(stage, 'v4f-info-s', 'Earlier information,<br>*more options*', { x: ix, y: mid + 10, w: 1820 - ix });
    A.draw(tl, brace, t4 + 0.2, 0.9);
    const ti = clamp(at(4, 'is information', 0.4), t4 + 0.9, ctx.dur - 4);
    A.in(tl, info, ti, 'fadeLeft', { dur: 0.7 });
    A.in(tl, infoS, clamp(at(4, 'the earlier you notice', 0.3), ti + 0.8, ctx.dur - 2.5), 'fadeUp', { dur: 0.7 });
  });

  // ================================================================== ch01s27  Never punish the warning
  registerScene('ch01s27', (ctx) => {
    const { stage, tl, cue, end, dur } = ctx;
    const at = sayAt(ctx);
    setup(stage);

    // beat 0: the rule lands large at the center of the swirl, then settles into the heading slot
    const t0 = cue(0);
    const BIG = 1.36;
    const big = box(stage, 'v4f-bigh', 'Never punish the warning.', { x: 960, y: 120 });
    const bar = box(stage, 'accent-bar', null, { x: 960, y: 237 });
    gsap.set(big, { xPercent: -50, y: 355, scale: BIG, transformOrigin: '50% 50%' });
    gsap.set(bar, { xPercent: -50, y: 385 });
    tl.fromTo(big, { opacity: 0, scale: BIG + 0.2 }, { opacity: 1, scale: BIG, duration: 0.9, ease: 'power3.out' }, t0 + 0.05);
    tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'power2.inOut' }, t0 + 0.6);

    const t1 = cue(1);
    if (t1 - t0 > 2.4) tl.to(big, { scale: BIG + 0.04, duration: t1 - t0 - 1.2, ease: 'sine.inOut' }, t0 + 0.95);
    tl.to(big, { xPercent: 0, x: -860, y: 0, scale: 1, duration: 0.9, ease: 'power3.inOut' }, t1 - 0.1);
    tl.to(bar, { xPercent: 0, x: -860, y: 0, duration: 0.9, ease: 'power3.inOut' }, t1 - 0.1);

    // beat 1: a dashboard with an amber check engine light; tape slaps over it; smoke keeps rising
    const DX = 130, DY = 330, DW = 820, DH = 540;
    const dwrap = box(stage, 'v4f-layer', null, { x: DX, y: DY, w: DW, h: DH });
    const ds = K.svg(dwrap, { x: 0, y: 0, w: DW, h: DH });
    const ddefs = K.svgEl('defs', {}, ds);
    const rg = K.svgEl('radialGradient', { id: 'v4f-glow' }, ddefs);
    K.svgEl('stop', { offset: '0', 'stop-color': '#ffb43c', 'stop-opacity': 0.9 }, rg);
    K.svgEl('stop', { offset: '1', 'stop-color': '#ffb43c', 'stop-opacity': 0 }, rg);
    const blur = K.svgEl('filter', { id: 'v4f-smokeblur', x: '-50%', y: '-50%', width: '200%', height: '200%' }, ddefs);
    K.svgEl('feGaussianBlur', { stdDeviation: 3.5 }, blur);
    const smoke = [[340, 0.0], [430, 0.6], [505, 1.2]].map(([x, d]) => ({
      p: K.path(ds, `M ${x} 200 C ${x - 30} 160, ${x + 30} 128, ${x} 88 S ${x - 24} 24, ${x + 8} -12`, { stroke: '#b3b8ad', 'stroke-width': 18, filter: 'url(#v4f-smokeblur)' }),
      d,
    }));
    const dash = K.group(ds);
    K.rect(dash, 30, 160, 760, 360, { rx: 70, fill: '#2f3531' });
    K.rect(dash, 52, 182, 716, 316, { rx: 54, fill: 'none', stroke: '#454d46', 'stroke-width': 4 });
    const gaugeAt = (cx, cy, na) => {
      K.circle(dash, cx, cy, 118, { fill: '#232824', stroke: '#566057', 'stroke-width': 6 });
      for (let i = 0; i <= 10; i++) {
        const a = (135 + i * 27) * Math.PI / 180;
        K.line(dash, cx + 90 * Math.cos(a), cy + 90 * Math.sin(a), cx + 106 * Math.cos(a), cy + 106 * Math.sin(a), { stroke: '#c9d1c4', 'stroke-width': i % 5 === 0 ? 6 : 4 });
      }
      const a = na * Math.PI / 180;
      K.line(dash, cx, cy, cx + 80 * Math.cos(a), cy + 80 * Math.sin(a), { stroke: '#e8703f', 'stroke-width': 7 });
      K.circle(dash, cx, cy, 12, { fill: '#6b756c' });
    };
    gaugeAt(200, 330, 200);
    gaugeAt(620, 330, 250);
    const LCX = 410, LCY = 420;
    const glowC = K.circle(dash, LCX, LCY, 96, { fill: 'url(#v4f-glow)', opacity: 0 });
    const eng = K.group(dash, { transform: `translate(${LCX - 50} ${LCY - 34})` });
    const engD = 'M 14 22 h 10 v -8 h 16 v -6 h -8 v -6 h 30 v 6 h -8 v 6 h 18 l 8 8 h 8 v -6 h 8 v 40 h -8 v -6 h -8 l -10 12 h -40 l -8 -8 h -10 v 10 h -8 v -34 h 8 z';
    K.path(eng, engD, { fill: '#4a524b', stroke: 'none' });
    const engOn = K.path(eng, engD, { fill: '#f5a623', stroke: 'none', opacity: 0 });
    gsap.set(smoke.map(o => o.p), { opacity: 0 });
    const tape = box(dwrap, 'v4f-tape', null, { x: LCX - 135, y: LCY - 44 });
    const cap1 = box(stage, 'v4f-cap', 'The problem is<br>*still there*', { x: 1060, y: 520, w: 760 });

    const dIn = t1 + 0.35;
    gsap.set(dwrap, { x: 960 - (DX + DW / 2) });
    tl.fromTo(ds, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, dIn);
    tl.to(engOn, { opacity: 1, duration: 0.3 }, dIn + 0.7);
    tl.to(glowC, { opacity: 1, duration: 0.3 }, dIn + 0.7);
    tl.to(glowC, { opacity: 0.55, duration: 0.45, yoyo: true, repeat: 3, ease: 'sine.inOut' }, dIn + 1.0);
    const tapeAt = clamp(at(1, "the light's gone", 0.5), dIn + 2.9, cue(2) - 3.2);
    tl.fromTo(tape, { opacity: 0, scale: 1.5, rotation: -24 }, { opacity: 1, scale: 1, rotation: -9, duration: 0.28, ease: 'power4.out' }, tapeAt);
    tl.to(ds, { x: 5, duration: 0.05, yoyo: true, repeat: 3, ease: 'none' }, tapeAt + 0.25);
    tl.to([glowC, engOn], { opacity: 0, duration: 0.2 }, tapeAt + 0.2);
    const sEnd = cue(2);
    smoke.forEach(({ p, d }) => {
      const start = dIn + 0.9 + d;
      const n = Math.max(1, Math.floor((sEnd - start) / 1.7));
      tl.to(p, {
        keyframes: [{ opacity: 0, y: 30, duration: 0 }, { opacity: 0.75, y: -10, duration: 0.8, ease: 'sine.out' }, { opacity: 0, y: -60, duration: 0.9, ease: 'sine.in' }],
        repeat: n - 1,
      }, start);
    });
    const capAt = clamp(at(1, 'but the engine problem', 0.2), tapeAt + 1.0, cue(2) - 1.6);
    tl.to(dwrap, { x: 0, duration: 0.9, ease: 'power3.inOut' }, capAt - 0.3);
    A.in(tl, cap1, capAt + 0.2, 'fadeLeft', { dur: 0.8 });

    // beat 2: the iceberg returns; the growl at its tip is wiped away; the feelings stay put
    const t2 = cue(2), L2 = end(2) - t2;
    tl.to([dwrap, cap1], { opacity: 0, duration: 0.45, ease: 'power2.in' }, t2 - 0.2);

    const S = 0.8, OX = -242.8, OY = 129.6; // iceberg coordinates, scaled into the left of the frame
    const T = (x, y) => [x * S + OX, y * S + OY];
    const WL = 562 * S + OY;
    const isvg = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const idefs = K.svgEl('defs', {}, isvg);
    const wg = K.svgEl('linearGradient', { id: 'v4f-water', x1: 0, y1: 0, x2: 0, y2: 1 }, idefs);
    K.svgEl('stop', { offset: '0', 'stop-color': '#b8d99a', 'stop-opacity': 0.5 }, wg);
    K.svgEl('stop', { offset: '1', 'stop-color': '#e8f1dc', 'stop-opacity': 0 }, wg);
    const W0 = 100, W1 = 960;
    const fg = K.svgEl('linearGradient', { id: 'v4f-wfade', gradientUnits: 'userSpaceOnUse', x1: W0, y1: 0, x2: W1, y2: 0 }, idefs);
    [[0, 0], [0.1, 1], [0.9, 1], [1, 0]].forEach(([o, v]) => K.svgEl('stop', { offset: o, 'stop-color': '#fff', 'stop-opacity': v }, fg));
    const mask = K.svgEl('mask', { id: 'v4f-wmask', maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: 1920, height: 1080 }, idefs);
    K.rect(mask, W0, 0, W1 - W0, 1080, { fill: 'url(#v4f-wfade)' });
    let wave = `M ${W0} ${WL}`;
    for (let x = W0; x < W1; x += 40) wave += ` Q ${x + 10} ${WL - 8} ${x + 20} ${WL} Q ${x + 30} ${WL + 8} ${x + 40} ${WL}`;
    const water = K.group(isvg, { mask: 'url(#v4f-wmask)' });
    K.path(water, `${wave} L ${W1} 930 L ${W0} 930 Z`, { fill: 'url(#v4f-water)', stroke: 'none' });
    const berg = K.group(isvg, { transform: `translate(${OX} ${OY}) scale(${S})` });
    const massG = K.group(berg);
    K.path(massG, 'M560 562 L466 690 L512 836 L700 934 L1220 934 L1418 826 L1452 684 L1360 562 Z', { fill: '#d3e5bf', stroke: 'none' });
    K.path(massG, 'M1110 562 L1360 562 L1452 684 L1418 826 L1220 934 L1180 934 L1330 760 Z', { fill: '#c6dcaf', stroke: 'none' });
    const tip = K.group(berg);
    K.path(tip, 'M560 562 L700 452 L790 430 L880 318 L960 288 L1040 330 L1150 420 L1250 470 L1360 562 Z', { fill: '#fbfdf8', stroke: '#a9cf86', 'stroke-width': 5 });
    K.path(tip, 'M960 288 L1040 330 L1150 420 L1250 470 L1360 562 L1080 562 L1010 420 Z', { fill: '#e4efd8', stroke: 'none' });
    const wlineG = K.group(isvg, { mask: 'url(#v4f-wmask)' });
    const wline = K.path(wlineG, wave, { stroke: GREEN, 'stroke-width': 5 });

    const [gx, gy] = T(960, 468);
    const growl = box(stage, 'v4f-growl', 'Growl', { x: gx, y: gy });
    gsap.set(growl, { xPercent: -50, yPercent: -50 });
    const ghost = box(stage, 'v4f-ghost', null, { x: gx - 76, y: gy - 36, w: 152, h: 72 });
    const [fx, fy] = T(960, 640), [frx, fry] = T(760, 806), [gux, guy] = T(1160, 806);
    const emos = [
      box(stage, 'v4f-emo big', 'Fear', { x: fx - 150, y: fy, w: 300 }),
      box(stage, 'v4f-emo', 'Frustration', { x: frx - 150, y: fry, w: 300 }),
      box(stage, 'v4f-emo', 'Guarding', { x: gux - 150, y: guy, w: 300 }),
    ];
    const iIn = t2 + 0.05;
    A.draw(tl, wline, iIn, 0.9);
    A.in(tl, water, iIn + 0.2, 'fade', { dur: 0.7 });
    A.in(tl, tip, iIn + 0.2, 'fade', { dur: 0.6 });
    A.in(tl, massG, iIn + 0.3, 'fadeUp', { dur: 0.7 });
    A.in(tl, emos, iIn + 0.55, 'fadeUp', { dur: 0.6, stagger: 0.1 });
    tl.fromTo(growl, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.8)' }, iIn + 0.4);
    const wipeAt = clamp(at(2, 'stop the growl', 0.2), t2 + 1.4, cue(3) - 2.2);
    tl.fromTo(growl, { clipPath: 'inset(0% 0% 0% 0% round 28px)' }, { clipPath: 'inset(0% 0% 0% 100% round 28px)', duration: 0.6, ease: 'power2.inOut' }, wipeAt);
    tl.fromTo(ghost, { opacity: 0 }, { opacity: 0.8, duration: 0.5 }, wipeAt + 0.45);
    const tUnc = clamp(at(2, "they're still uncomfortable", 0.3), wipeAt + 1.0, cue(3) - 1.2);
    A.pulse(tl, emos, tUnc, { scale: 1.08 });
    const CX = 1060;
    const cap2 = box(stage, 'v4f-cap', 'Still uncomfortable,<br>*less information*', { x: CX, y: 470, w: 760 });
    A.in(tl, cap2, tUnc + 0.1, 'fadeLeft', { dur: 0.8 });

    // beat 3: "out of nowhere": the empty tip flashes; the caption becomes "A growl is information";
    // the owner's plan ticks in (three check bullets) with the green "Try this" badge pinned to its corner
    const t3 = cue(3);
    const tGhost = clamp(at(3, 'out of nowhere', 0.2), t3 + 0.3, dur - 8);
    tl.to(ghost, { borderColor: RED, scale: 1.14, duration: 0.3, yoyo: true, repeat: 3, ease: 'sine.inOut' }, tGhost);
    tl.to(ghost, { borderColor: '#8fb96a', duration: 0.4 }, tGhost + 1.3);
    const cap3 = box(stage, 'v4f-cap', 'A growl is<br>*information*', { x: CX, y: 318, w: 760 });
    const tInfo = clamp(at(3, "a growl isn't", 0.2), tGhost + 1.0, dur - 6);
    tl.to(cap2, { opacity: 0, y: -24, duration: 0.35, ease: 'power2.in' }, tInfo - 0.1);
    A.in(tl, cap3, tInfo + 0.25, 'fadeUp', { dur: 0.7 });
    const PY0 = 548;
    const plan = K.flow(stage, { x: CX, y: PY0, w: 700, gap: 28 });
    plan.classList.add('v4f-plan');
    const rows = K.bullets(plan, ['Stop', 'Create space', 'Look at the ABC'], { icon: 'check', gap: 26, size: 40 });
    const tryB = tryBadge(stage, { x: CX - 26, y: PY0 - 30 });
    const planIn = clamp(at(3, 'so stop', 0.9), tInfo + 1.2, dur - 4.4);
    A.in(tl, plan, planIn, 'fadeUp', { dur: 0.7 });
    tl.fromTo(tryB, { opacity: 0, scale: 0.4, rotation: -14 }, { opacity: 1, scale: 1, rotation: -4, duration: 0.7, ease: 'back.out(1.8)' }, planIn + 0.3);
    const rowAt = [['so stop', 0.6], ['create space', 1.2], ['look at the abc', 1.8]]
      .map(([p, d], i) => clamp(at(3, p, 0.25), planIn + d, dur - 2.4 + i * 0.35));
    rows.forEach((r, i) => {
      A.in(tl, r, rowAt[i], 'fadeRight', { dur: 0.6 });
      A.in(tl, r.querySelector('.ico'), rowAt[i] + 0.1, 'pop', { dur: 0.5 });
    });
  });

  // ================================================================== ch01s28  Start your list
  registerScene('ch01s28', (ctx) => {
    const { stage, tl, cue, end } = ctx;
    const at = sayAt(ctx);
    setup(stage);
    const c = [0, 1, 2, 3].map(cue);

    const h = K.heading(stage, 'Start your list', { x: 100, y: 112, size: 78 });

    // the worksheet card
    const WS = { x: 130, y: 300, w: 1660, h: 624 };
    const ws = box(stage, 'v4f-ws', null, WS);
    const lsvg = K.svgEl('svg', { viewBox: `0 0 ${WS.w} ${WS.h}`, width: WS.w, height: WS.h, class: 'lines' }, ws);
    const ttl = box(ws, 'ttl', 'My dog’s situations', { x: 100, y: 62 });
    const COLX = [100, 460, 810, 1040, 1270], TX = 1436, TEND = 1600;
    const ROWY = [282, 392];
    const ruled = [352, 462, 562].map(y => K.line(lsvg, 40, y, TEND, y, { stroke: '#e3e7dd', 'stroke-width': 3 }));
    const hline = K.line(lsvg, 40, 244, TEND, 244, { stroke: GREEN_LIGHT, 'stroke-width': 5 });
    const dividers = COLX.slice(1).map(x => x - 22).concat([1422]).map(x => K.line(lsvg, x, 150, x, 562, { stroke: '#e8ebe3', 'stroke-width': 3 }));
    const heads = ['What exactly', 'How close', 'Where', 'When', 'How big'].map((t, i) => box(ws, 'th', t, { x: COLX[i], y: 160 }));
    const scale = box(ws, 'th2', '1 to 10', { x: COLX[4], y: 202 });

    // hint pill in the card's header row (swaps per beat)
    const hintRow = box(ws, 'v4f-rrow', null, { x: WS.w - 56 - 800, y: 52, w: 800, h: 62 });
    const hints = [['Get specific', null], ['Quiet reactions count too', 'eye'], ['Your A, B, C', null]].map(([t, ic]) => {
      const p = box(hintRow, 'v4f-hint', null, {});
      if (ic) p.appendChild(K.icon(ic));
      p.appendChild(K.el('span', null, t));
      return p;
    });
    const showHint = (i, t) => {
      if (i > 0) A.out(tl, hints[i - 1], t, 'fadeUp', { dur: 0.35 });
      A.in(tl, hints[i], i > 0 ? t + 0.25 : t, 'fadeUp', { dur: 0.6 });
    };

    const tryB = tryBadge(stage, { x: WS.x - 26, y: WS.y - 30 });
    const clipB = box(stage, 'v4f-clip', null, { x: 960 - 75, y: 612 - 75 });
    clipB.appendChild(K.icon('clipboard-list'));

    // handwritten cells
    const write = (w, t, d) => {
      tl.fromTo(w.pen, { opacity: 0 }, { opacity: 1, duration: 0.1, ease: 'none' }, t - 0.1);
      tl.fromTo(w.tx, { maxWidth: 0 }, { maxWidth: 420, duration: d, ease: 'none' }, t);
      tl.fromTo(w.pen, { rotation: 0, y: 0 }, { rotation: -10, y: -4, duration: d / 8, ease: 'sine.inOut', yoyo: true, repeat: 7 }, t);
      tl.to(w.pen, { opacity: 0, duration: 0.1, ease: 'none' }, t + d);
    };
    const makeCells = (parent, texts, y) => texts.map((t, i) => {
      const cell = box(parent, 'cell', null, { x: COLX[i], y });
      const wr = box(cell, 'v4f-wr');
      const tx = box(wr, 'txt', t);
      const pen = box(wr, 'pen');
      pen.appendChild(K.icon('pencil', { stroke: 2.2 }));
      return { tx, pen };
    });
    const band = box(ws, 'v4f-band', null, { x: 22, y: ROWY[1] - 24, w: TEND - 4, h: 90 });
    const eb = box(band, 'v4f-eb', null, { x: 14, y: 16 });
    eb.appendChild(K.icon('eye'));
    const row1 = makeCells(ws, ['Big dogs, head-on', 'Across the street', 'Our block', 'After dark', '7'], ROWY[0]);
    const row2wrap = box(ws, 'v4f-layer', null, { x: 0, y: 0, w: WS.w, h: WS.h });
    const row2 = makeCells(row2wrap, ['Man in a hood', 'Half a block', 'Park', 'Morning', '4, froze'], ROWY[1]);
    const tags = ROWY.map(y => ['A', 'B', 'C'].map((l, k) => box(ws, 'v4f-tag', l, { x: TX + k * 54, y: y + 21 - 23 })));

    // beat 0: the heading; a clipboard pops and expands into the worksheet; "Try this" pins to its corner
    A.in(tl, h.all, Math.max(0.1, c[0] - 0.2), 'fadeUp', { stagger: 0.12 });
    const tClip = clamp(at(0, 'grab a notebook', 0.3), c[0] + 0.6, c[1] - 4);
    A.in(tl, clipB, tClip, 'pop', { dur: 0.55 });
    const tX = clamp(at(0, 'start a list', 0.4), tClip + 0.8, c[1] - 3);
    const org = `${960 - WS.x}px ${612 - WS.y}px`;
    tl.fromTo(ws, { clipPath: `circle(0px at ${org})` }, { clipPath: `circle(1800px at ${org})`, duration: 1.0, ease: 'power2.inOut' }, tX);
    tl.set(ws, { clipPath: 'none' }, tX + 1.05);
    tl.to(clipB, { scale: 2.4, opacity: 0, duration: 0.6, ease: 'power2.in' }, tX + 0.05);
    const tT = clamp(at(0, 'the situations', 0.3), tX + 0.9, c[1] - 1.8);
    A.in(tl, ttl, tT, 'fadeUp', { dur: 0.6 });
    tl.fromTo(tryB, { opacity: 0, scale: 0.4, rotation: -16 }, { opacity: 1, scale: 1, rotation: -4, duration: 0.7, ease: 'back.out(1.8)' }, tT + 0.6);

    // beat 1: "Get specific"; the table rules draw and each column heading types in as it is said
    showHint(0, c[1] + 0.05);
    A.draw(tl, [hline], c[1] + 0.2, 0.7);
    A.draw(tl, dividers, c[1] + 0.3, 0.6, { stagger: 0.08 });
    A.in(tl, ruled, c[1] + 0.4, 'fade', { dur: 0.6 });
    const HEAD_SAY = ['which dogs', 'how close', 'where', 'when', 'how big', 'one to ten'];
    let tt = c[1] + 0.6;
    heads.concat([scale]).forEach((node, i) => {
      const split = new SplitText(node, { type: 'chars' });
      const t = Math.max(tt, at(1, HEAD_SAY[i], 0.2));
      tl.fromTo(split.chars, { opacity: 0 }, { opacity: 1, duration: 0.01, stagger: 0.026, ease: 'none' }, t);
      tt = t + split.chars.length * 0.026 + 0.05;
    });

    // beat 2: the example row is written in, then the quiet row slides in with its eye icon and is written in
    const tW = clamp(at(2, 'big dogs', 0.3), c[2] + 0.3, c[3] - 7.5);
    row1.forEach((w, i) => write(w, tW + i * 0.55, i === 4 ? 0.2 : 0.5));
    const tQ = clamp(at(2, 'count quiet reactions', 0.3), tW + 5 * 0.55 + 0.1, c[3] - 4.2);
    tl.fromTo(band, { opacity: 0, x: -80 }, { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' }, tQ);
    A.in(tl, eb, tQ + 0.3, 'pop', { dur: 0.5 });
    showHint(1, tQ);
    row2.forEach((w, i) => write(w, tQ + 0.8 + i * 0.55, i === 4 ? 0.35 : 0.45));

    // beat 3: "Your A, B, C": small green A, B and C tags pin to the end of each row, one letter per phrase
    const t3 = c[3];
    let pv = t3 + 0.2;
    ['right before', 'what your dog did', 'right after'].forEach((p, k) => {
      const t = Math.max(pv, at(3, p, 0.2));
      tags.forEach((row, r) => tl.fromTo(row[k], { opacity: 0, scale: 0.3, y: -18 }, { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(2)' }, t + r * 0.12));
      pv = t + 0.6;
    });
    showHint(2, clamp(at(3, "that's your a", 0.3), pv, end(3) - 1.2));
  });

  // ================================================================== ch01s29  Put it all together
  registerScene('ch01s29', (ctx) => {
    const { stage, tl, cue, dur, chrome } = ctx;
    const at = sayAt(ctx);
    setup(stage);

    const g = layer(stage);
    const kick = K.kicker(g, 'The framework', { x: 102, y: 112, size: 26 });
    const h = K.heading(g, 'Put it all together', { x: 100, y: 152, size: 76 });

    // geometry: frame 310..832; A B C cards 338..564; Function / Context cards 594..772
    const QX = 140, QW = 520, QG = 40, QY = 338, QH = 226;
    const QS = [['A', 'What happened before?', 'what happened before'], ['B', 'What did the dog do?', 'what did your dog do'], ['C', 'What happened after?', 'what happened after']];
    const qcards = QS.map(([l, t], i) => {
      const q = box(g, 'v4f-q', null, { x: QX + i * (QW + QG), y: QY, w: QW, h: QH });
      box(q, 'lt', l);
      box(q, 't', t);
      return q;
    });
    const FY = 594, FH = 178, FW = (3 * QW + 2 * QG - QG) / 2;
    const FS = [['target', 'Function', 'What did it accomplish?'], ['layers', 'Context', 'Why this response?']];
    const fcards = FS.map(([ic, nm, qq], i) => {
      const f = box(g, 'v4f-fc', null, { x: QX + i * (FW + QG), y: FY, w: FW, h: FH });
      box(f, 'ib').appendChild(K.icon(ic));
      const col = box(f, null);
      box(col, 'nm', nm);
      box(col, 'qq', qq);
      return f;
    });

    // beat 0: heading; the three ABC cards slide in, one per question
    const t0 = cue(0);
    A.in(tl, kick, Math.max(0, t0 - 0.2), 'fadeUp', { dur: 0.6 });
    A.in(tl, h.all, t0, 'fadeUp', { stagger: 0.12 });
    let prev = t0 + 0.6;
    qcards.forEach((q, i) => {
      const t = Math.max(prev, at(0, QS[i][2], 0.3));
      A.in(tl, q, t, 'fadeLeft', { dur: 0.7 });
      prev = t + 0.6;
    });

    // beat 1: two wider cards drop in beneath: Function, then Context
    prev = cue(1) + 0.1;
    ['what did the behavior accomplish', 'why might your dog'].forEach((p, i) => {
      const t = Math.max(prev, at(1, p, 0.3));
      A.in(tl, fcards[i], t, 'fadeDown', { dur: 0.7 });
      prev = t + 0.7;
    });

    // beat 2: a green frame draws around all five cards; its label lands on "the whole pattern"
    const t2 = cue(2);
    const fsvg = K.svg(g, { x: 0, y: 0, w: 1920, h: 1080 });
    const FR = { x: 112, y: 310, w: 1696, h: 522 };
    const frame = K.rect(fsvg, FR.x, FR.y, FR.w, FR.h, { rx: 34, fill: 'none', stroke: GREEN, 'stroke-width': 6 });
    const pill = box(g, 'v4f-pill', null, { x: 960, y: FR.y + FR.h - 35 });
    gsap.set(pill, { xPercent: -50 });
    pill.appendChild(K.icon('scan-eye'));
    pill.appendChild(K.el('span', null, 'Look at the whole pattern'));
    A.draw(tl, frame, t2 + 0.2, 1.6, { ease: 'power2.inOut' });
    A.in(tl, pill, clamp(at(2, 'the whole pattern', 0.6), t2 + 1.8, cue(3) - 1.2), 'pop', { dur: 0.6 });

    // beat 3: the cards fade; the corner logo steps aside and the Calling All Dogs logo scales in at center
    const t3 = cue(3);
    A.out(tl, g, t3 - 0.1, 'fade', { dur: 0.6 });
    tl.to(chrome.logo, { opacity: 0, duration: 0.4 }, t3);
    const halo = box(stage, 'v4f-halo', null, { x: 360, y: 216, w: 1200, h: 520 });
    A.in(tl, halo, t3 + 0.2, 'fade', { dur: 1.2 });
    const logo = K.el('img', null, null, { position: 'absolute', left: '580px', top: '262px', width: '760px' });
    logo.src = '../assets/img/logo.png';
    stage.appendChild(logo);
    const url = box(stage, 'v4f-close', 'callingalldogsny.com', { y: 632 });
    Object.assign(url.style, { font: '600 42px/1.2 Montserrat, sans-serif', color: 'var(--green-dark)', letterSpacing: '0.5px' });
    const line = box(stage, 'v4f-close', 'Understanding comes *before change*', { y: 736 });
    Object.assign(line.style, { font: '700 58px/1.2 Rubik, sans-serif', color: 'var(--ink)' });
    tl.fromTo(logo, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 1.1, ease: 'power3.out' }, t3 + 0.25);
    A.in(tl, url, t3 + 1.0, 'fadeUp', { dur: 0.7 });
    A.in(tl, line, clamp(at(3, 'then we can change', 0.6), t3 + 1.6, dur - 2.2), 'fadeUp', { dur: 0.8 });
  });
})();
