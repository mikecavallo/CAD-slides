// Chapter 3: Reactive or aggressive?
// Scenes: ch03s01 (split screen that becomes a Venn), ch03s02 (statement: a reactive dog CAN become aggressive),
// ch03s03 (ways 1 and 2: the loop and the lawn path), ch03s04 (ways 3 and 4: skipped warnings, frustration),
// ch03s05 (never punish a growl: dashboard light, iceberg, action plan).
(function () {
  const GREEN = '#619537', GREEN_DARK = '#3f6b22', GREEN_LIGHT = '#b8d99a', RED = '#b8452d', AMBER = '#d9912b';

  const css = `
    .c3-card { position:absolute; display:flex; align-items:center; gap:24px; padding:0 30px; background:#fff; border-radius:26px;
      border:1px solid #e6e9e1; box-shadow:var(--shadow-soft); }
    .c3-card .ib { flex:0 0 auto; width:88px; height:88px; border-radius:50%; display:grid; place-items:center; }
    .c3-card .ib svg { width:48px; height:48px; }
    .c3-card .ib.amber { background:var(--amber-pale); color:#b8761a; }
    .c3-card .ib.red { background:var(--red-pale); color:var(--red); }
    .c3-card .k { font:700 26px/1 var(--font-body); letter-spacing:5px; text-transform:uppercase; color:var(--ink-soft); white-space:nowrap; }
    .c3-card .t { margin-top:12px; font:700 52px/1 var(--font-head); color:var(--ink); white-space:nowrap; }
    .c3-or { position:absolute; width:76px; height:76px; border-radius:50%; background:#fff; border:4px solid var(--green);
      color:var(--green-dark); display:grid; place-items:center; font:700 30px/1 var(--font-head); box-shadow:var(--shadow-soft); }
    .c3-bub { position:absolute; padding:18px 30px; border-radius:28px; color:#fff; font:700 36px/1.12 var(--font-body);
      white-space:nowrap; box-shadow:0 12px 28px rgba(30,30,20,0.22); }
    .c3-bub .tail { position:absolute; width:30px; height:30px; background:inherit; bottom:-13px; transform:rotate(45deg); border-radius:0 0 7px 0; }
    .c3-bub.amber { background:#c47d1c; }
    .c3-bub.red { background:var(--red); }
    .c3-pill { position:absolute; display:inline-flex; align-items:center; gap:14px; padding:16px 32px; border-radius:999px;
      background:var(--green); color:#fff; font:700 34px/1 var(--font-body); white-space:nowrap; box-shadow:0 12px 26px rgba(44,74,23,0.24); }
    .c3-pill svg { width:36px; height:36px; }

    .c3-stmt { position:absolute; font:800 90px/1.16 var(--font-head); color:var(--ink); text-transform:uppercase; letter-spacing:0.5px; }
    .c3-stmt .ln { display:block; white-space:nowrap; margin-bottom:22px; }
    .c3-stmt .w { position:relative; display:inline-block; }
    .c3-stmt .g { color:var(--green); }
    .c3-stmt .ch { display:inline-block; }
    .c3-stmt .ul { position:absolute; left:-4px; right:-4px; bottom:-4px; height:15px; background:var(--green); border-radius:4px; }
    .c3-notwill { display:inline-block; vertical-align:middle; margin-left:30px; margin-top:-14px; padding:14px 26px; border-radius:999px;
      background:var(--green-pale); color:var(--green-deep); font:700 34px/1 var(--font-body); text-transform:none; letter-spacing:0; }
    .c3-four { position:absolute; font:700 46px/1.1 var(--font-head); color:var(--ink); white-space:nowrap; }
    .c3-tc { position:absolute; width:84px; height:84px; border-radius:50%; background:#fff; border:5px solid var(--green); box-shadow:var(--shadow-soft); }

    .c3-strip { position:absolute; height:40px; }
    .c3-strip .dot { position:absolute; width:32px; height:32px; box-sizing:border-box; border-radius:50%; background:#fff; border:4px solid var(--green-light); }
    .c3-strip .lb { position:absolute; padding:7px 18px; border-radius:999px; background:#fff; border:2px solid var(--green);
      font:700 26px/1 var(--font-body); color:var(--green-dark); white-space:nowrap; }
    .c3-title { position:absolute; font:700 56px/1.12 var(--font-head); color:var(--ink); }
    .c3-title .n { color:var(--green); }
    .c3-sub { position:absolute; border-left:8px solid var(--green-light); padding:6px 0 6px 28px; font:600 40px/1.3 var(--font-body); color:var(--ink); }

    .c3-node { position:absolute; width:116px; height:116px; border-radius:50%; display:grid; place-items:center; box-shadow:var(--shadow-soft); }
    .c3-node svg { width:58px; height:58px; }
    .c3-node.amber { background:#fff4e2; color:#b8761a; border:4px solid #f0cf9c; }
    .c3-node.red { background:#fbece8; color:var(--red); border:4px solid #eebcaf; }
    .c3-node.green { background:var(--green-mist); color:var(--green-dark); border:4px solid var(--green-light); }
    .c3-nlab { position:absolute; font:700 32px/1.2 var(--font-body); color:var(--ink); white-space:nowrap; }
    .c3-nlab.r { text-align:right; }
    .c3-nlab.c { text-align:center; }
    .c3-count { position:absolute; display:flex; align-items:center; gap:30px; padding:0 40px; background:#fff; border-radius:26px;
      border:1px solid #e6e9e1; box-shadow:var(--shadow-soft); }
    .c3-count .ib { flex:0 0 auto; width:100px; height:100px; border-radius:50%; background:var(--green); color:#fff; display:grid; place-items:center; }
    .c3-count .ib svg { width:54px; height:54px; }
    .c3-count .col { display:flex; flex-direction:column; gap:10px; }
    .c3-count .num { position:relative; width:220px; height:120px; }
    .c3-count .num span { position:absolute; left:0; top:0; font:800 124px/0.97 var(--font-head); color:var(--green); }
    .c3-count .lab { font:600 30px/1 var(--font-body); color:var(--ink-soft); white-space:nowrap; }

    .c3-x { position:absolute; }
    .c3-glab { position:absolute; text-align:center; font:700 34px/1 var(--font-head); color:var(--green-dark); white-space:nowrap; }
    .c3-tlab { position:absolute; text-align:center; font:600 26px/1 var(--font-body); color:var(--ink-soft); white-space:nowrap; }
    .c3-redir { position:absolute; text-align:center; font:700 46px/1 var(--font-head); color:var(--red); white-space:nowrap; }
    .c3-newp { position:absolute; display:inline-flex; align-items:center; gap:12px; padding:14px 26px 14px 20px; border-radius:999px; background:#fff;
      color:var(--green-dark); font:700 30px/1 var(--font-body); white-space:nowrap; box-shadow:0 10px 24px rgba(40,60,20,0.18); }
    .c3-newp svg { width:34px; height:34px; }

    .c3-bigh { position:absolute; font:700 80px/1.06 var(--font-head); color:var(--green); white-space:nowrap; letter-spacing:-0.5px; }
    .c3-tape { position:absolute; width:270px; height:88px; background:linear-gradient(180deg, #f5ecd4 0%, #e8d9b2 100%);
      clip-path:polygon(0% 10%, 3% 0%, 6% 12%, 9% 2%, 12% 0%, 88% 0%, 91% 8%, 94% 0%, 97% 12%, 100% 4%, 100% 90%, 97% 100%, 94% 88%, 91% 100%, 88% 94%, 12% 100%, 9% 90%, 6% 100%, 3% 88%, 0% 96%); }
    .c3-tape::after { content:''; position:absolute; left:8%; right:8%; top:30%; height:10px; background:rgba(255,255,255,0.45); border-radius:5px; }
    .c3-cap { position:absolute; font:700 64px/1.14 var(--font-head); color:var(--ink); }
    .c3-emo { position:absolute; text-align:center; font:700 36px/1 var(--font-head); color:var(--green-deep); white-space:nowrap; }
    .c3-emo.big { font-size:48px; }
    .c3-growl { position:absolute; padding:16px 32px; border-radius:28px; background:var(--green); color:#fff; font:700 36px/1.1 var(--font-body);
      white-space:nowrap; }
    .c3-ghost { position:absolute; border-radius:28px; border:4px dashed #8fb96a; }
    .c3-q { position:absolute; font:700 76px/1.1 var(--font-head); color:var(--ink); white-space:nowrap; }
    .c3-q .nw { position:relative; display:inline-block; }
    .c3-q .strike { position:absolute; left:-6px; right:-6px; top:52%; height:9px; margin-top:-4px; background:var(--red); border-radius:5px; }
    .c3-plan { background:#fff; border-radius:26px; border:1px solid #e6e9e1; box-shadow:var(--shadow-soft); padding:64px 44px 42px; }
    .c3-try { position:absolute; display:flex; align-items:center; gap:12px; padding:14px 26px 14px 18px; border-radius:999px; background:var(--green);
      color:#fff; font:700 26px/1 var(--font-body); letter-spacing:3px; text-transform:uppercase; white-space:nowrap; box-shadow:0 10px 22px rgba(44,74,23,0.26); }
    .c3-try svg { width:32px; height:32px; }
  `;
  const style = () => K.el('style', null, css);
  // a mid-beat moment: at least `min` s after the cue, else a fraction of the beat, but never later than `limit`
  const mid = (t, L, frac, min, limit) => Math.min(t + Math.max(min, frac * L), limit);
  // time a reveal to a phrase inside beat i's narration (by its position in the text), leading by `lead` s
  const sayAt = ctx => (i, phrase, lead = 0.3, fb = 0.5) => Math.max(ctx.cue(i), window.phraseTime(ctx, i, phrase, fb) - lead);
  const clamp = (t, lo, hi) => Math.max(lo, Math.min(t, hi));
  const box = (parent, cls, html, o) => {
    const n = K.el('div', cls, html == null ? null : K.md(html));
    K.place(n, o || {});
    parent.appendChild(n);
    return n;
  };
  // Crossfade: old content lifts out quickly, new content rises into the same slot.
  const swap = (tl, from, to, t) => {
    tl.to(from, { opacity: 0, y: -24, duration: 0.3, ease: 'power2.out' }, t - 0.05);
    tl.fromTo(to, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, t + 0.25);
  };

  // The shared warning ladder (same six rungs as ch01s03).
  const LADDER = [
    { t: 'Subtle stress signals', icon: 'eye-off' },
    { t: 'Stiffening, hard stare', icon: 'eye' },
    { t: 'Growl', icon: 'volume-2' },
    { t: 'Snarl, lip lift', icon: 'triangle-alert' },
    { t: 'Snap', icon: 'zap' },
    { t: 'Bite', icon: 'octagon-alert' },
  ];

  // ------------------------------------------------------------------ shared: the "four ways" timeline strip
  // The four circles from ch03s02, now a thin strip pinned across the top (x 100 to 1820). Each circle lights
  // with its short label as its way is taught. Returns {wrap, steps, cns, light(i, t), settle(i, t)}.
  const WAYS = ['Works', 'Practice', 'Warnings lost', 'Boils over'];
  const SDX = [0, 480, 960, 1440]; // dot offsets inside the strip; each label chip sits on the line after its dot
  const DONE_BORDER = '#d9ddd3', DONE_INK = '#4a4a4a';
  function strip(stage, tl, o) {
    const wrap = box(stage, 'c3-strip', null, { x: 100, y: o.y, w: 1720, h: 40 });
    const svg = K.svg(wrap, { x: 0, y: 0, w: 1720, h: 40 });
    const base = K.line(svg, 16, 20, 1710, 20, { stroke: GREEN_LIGHT, 'stroke-width': 4 });
    const head = K.path(svg, 'M 1698 9 L 1711 20 L 1698 31', { stroke: GREEN_LIGHT, 'stroke-width': 4 });
    const done = o.done || [];
    const last = done.length ? Math.max(...done) : 0;
    const prog = K.line(svg, 16, 20, SDX[last] + 16, 20, { stroke: GREEN, 'stroke-width': 4 });
    const steps = WAYS.map((w, i) => {
      const dot = box(wrap, 'dot', null, { x: SDX[i], y: 4 });
      const lb = box(wrap, 'lb', w, { x: SDX[i] + 54, y: -2 });
      if (done.includes(i)) {
        Object.assign(dot.style, { background: GREEN, borderColor: GREEN });
        Object.assign(lb.style, { color: DONE_INK, borderColor: DONE_BORDER });
      } else lb.style.opacity = 0;
      return { dot, lb };
    });
    const light = (i, t) => {
      if (i > 0) tl.to(prog, { attr: { x2: SDX[i] + 16 }, duration: 0.5, ease: 'power2.inOut' }, t - 0.35);
      tl.to(steps[i].dot, { backgroundColor: GREEN, borderColor: GREEN, boxShadow: '0 0 0 9px rgba(97,149,55,0.22)', scale: 1.2, duration: 0.45, ease: 'back.out(2)' }, t);
      tl.fromTo(steps[i].lb, { opacity: 0, x: -14, scale: 0.9 }, { opacity: 1, x: 0, scale: 1, duration: 0.5, ease: 'power3.out' }, t + 0.1);
    };
    const settle = (i, t) => {
      tl.to(steps[i].dot, { boxShadow: '0 0 0 0px rgba(97,149,55,0)', scale: 1, duration: 0.4, ease: 'power2.out' }, t);
      tl.to(steps[i].lb, { color: DONE_INK, borderColor: DONE_BORDER, duration: 0.4 }, t);
    };
    return { wrap, steps, base, head, light, settle };
  }

  // A drawn leash in the Lucide stroke style (hand loop, slack cord, clip): Lucide has no leash icon.
  const LEASH = '<path d="M9.6 9.6C6.2 11.4 1.8 8.4 2.6 4.8C3.4 1.4 8.2 1.4 9.2 4.4C9.8 6.2 9.9 8 9.6 9.6z"/>' +
    '<path d="M9.6 9.6c1.8 3.6 7.6-0.6 9.4 3c0.9 1.8-0.6 2.8-0.6 4"/><rect x="16.3" y="17.2" width="4.2" height="5" rx="1.6"/>';

  // Step title "1. The behavior works" with the number in green.
  const stepTitle = (stage, n, text, o) => box(stage, 'c3-title', `<span class="n">${n}.</span> ${text}`, { x: o.x, y: o.y, w: o.w });

  // ------------------------------------------------------------------ ch03s01: Reactive or aggressive?
  registerScene('ch03s01', (ctx) => {
    const { stage, tl, cue, end, dur } = ctx;
    const at = sayAt(ctx);
    stage.appendChild(style());

    // chapter opener: the accent bar grows and the chapter title wipes on over it before the layout builds
    const h = K.heading(stage, 'Reactive or aggressive?', { x: 100, y: 120, w: 1400, size: 84 });
    A.in(tl, h.bar, 0.05, 'grow', { dur: 0.5 });
    A.in(tl, h.title, 0.15, 'wipe', { dur: 1.0 });

    // --- beat 1: split screen with a divider drawing down the middle
    const PY = 320, PW = 700, PH = 420, LX = 150, RX = 1070;
    const pL = K.photo(stage, 'photo_reactivity.jpg', { x: LX, y: PY, w: PW, h: PH, pos: '50% 0%' });
    const pR = K.photo(stage, 'photo_aggression.jpg', { x: RX, y: PY, w: PW, h: PH, pos: '50% 21%' });
    gsap.set(pR.root, { scaleX: -1 }); // mirrored: the dog faces the divider and stays clear of the Venn overlap
    const div = box(stage, 'divider-v', null, { x: 958, y: 300, w: 4, h: 640 });
    const t0 = Math.max(cue(0), 1.1);
    A.in(tl, pL.root, t0 + 0.05, 'fadeRight', { dur: 0.9 });
    A.in(tl, pR.root, t0 + 0.2, 'fadeLeft', { dur: 0.9 });
    tl.fromTo(div, { scaleY: 0, transformOrigin: '50% 0%' }, { scaleY: 1, duration: 1.1, ease: 'power2.inOut' }, t0 + 0.35);
    A.kenburns(tl, pL.img, { from: 1.02, to: 1.1 });
    A.kenburns(tl, pR.img, { from: 1.02, to: 1.1 });

    // --- beat 2: label cards rise under each photo, joined by "or"
    const CW = 420, CH = 150, CY = 770;
    const card = (x, icon, variant, k, t) => {
      const c = box(stage, 'c3-card', null, { x, y: CY, w: CW, h: CH });
      const ib = K.el('div', 'ib ' + variant);
      ib.appendChild(K.icon(icon, { stroke: 2.2 }));
      c.appendChild(ib);
      const tx = K.el('div', 'tx');
      tx.appendChild(K.el('div', 'k', k));
      tx.appendChild(K.el('div', 't', t));
      c.appendChild(tx);
      return c;
    };
    const cL = card(LX + (PW - CW) / 2, 'volume-2', 'amber', 'Reactivity', 'How big');
    const cR = card(RX + (PW - CW) / 2, 'target', 'red', 'Aggression', 'What for');
    const or1 = box(stage, 'c3-or', 'or', { x: 922, y: CY + CH / 2 - 38 });
    [pL.root, pR.root].forEach(n => (n.style.zIndex = 2));
    [cL, cR].forEach(n => (n.style.zIndex = 1));
    const t1 = cue(1);
    A.in(tl, cL, t1 + 0.05, 'fadeUp', { dur: 0.8 });
    // the right card waits for "Aggression is about intent"; the 'or' joins the pair
    const tR1 = clamp(at(1, 'aggression is about'), t1 + 0.9, cue(2) - 1.4);
    A.in(tl, cR, tR1, 'fadeUp', { dur: 0.8 });
    A.in(tl, or1, tR1 + 0.45, 'pop', { dur: 0.5 });

    // --- beat 3: speech bubbles pop from each photo, again joined by "or"
    const BY = 252;
    const bL = box(stage, 'c3-bub amber', 'This is too much', { x: 815, y: BY });
    gsap.set(bL, { xPercent: -100 });
    const tailL = K.el('div', 'tail'); tailL.style.left = '104px'; bL.appendChild(tailL);
    const bR = box(stage, 'c3-bub red', 'I’ll make this stop', { x: 1105, y: BY });
    const tailR = K.el('div', 'tail'); tailR.style.right = '72px'; bR.appendChild(tailR);
    const or2 = box(stage, 'c3-or', 'or', { x: 922, y: BY + 1 });
    [bL, bR, or1, or2].forEach(n => (n.style.zIndex = 4));
    const t2 = cue(2);
    const tR2 = clamp(at(2, 'the dog using aggression'), t2 + 0.9, cue(3) - 1.2);
    tl.fromTo(bL, { opacity: 0, scale: 0.4, transformOrigin: '28% 100%' }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.8)' }, t2 + 0.1);
    tl.fromTo(bR, { opacity: 0, scale: 0.4, transformOrigin: '80% 100%' }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.8)' }, tR2);
    A.in(tl, or2, tR2 + 0.35, 'pop', { dur: 0.5 });

    // --- beat 4: photos shrink into circles and slide together into a Venn; the overlap tints green
    const t3 = cue(3);
    const R = 230, CYV = 590, CXL = 795, CXR = 1125;
    A.out(tl, [bL, bR, or1, or2, div], t3 - 0.15, 'fade', { dur: 0.4 });
    const morph = { top: CYV - R, width: 2 * R, height: 2 * R, borderRadius: R, duration: 1.0, ease: 'power3.inOut' };
    tl.to(pL.root, Object.assign({ left: CXL - R }, morph), t3);
    tl.to(pR.root, Object.assign({ left: CXR - R }, morph), t3);
    tl.to(pL.img, { objectPosition: '85% 30%', duration: 1.0, ease: 'power3.inOut' }, t3);
    tl.to(cL, { left: 100, top: CYV - CH / 2, duration: 1.0, ease: 'power3.inOut' }, t3 + 0.05);
    tl.to(cR, { left: 1820 - CW, top: CYV - CH / 2, duration: 1.0, ease: 'power3.inOut' }, t3 + 0.05);

    const svg = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    svg.style.zIndex = 3;
    const half = (CXR - CXL) / 2, hh = Math.sqrt(R * R - half * half);
    const lens = K.path(svg, `M 960 ${CYV - hh} A ${R} ${R} 0 0 1 960 ${CYV + hh} A ${R} ${R} 0 0 1 960 ${CYV - hh} Z`,
      { fill: GREEN_LIGHT, 'fill-opacity': 0.62, stroke: GREEN, 'stroke-width': 4 });
    const ringL = K.circle(svg, CXL, CYV, R, { fill: 'none', stroke: AMBER, 'stroke-width': 7, transform: `rotate(-90 ${CXL} ${CYV})` });
    const ringR = K.circle(svg, CXR, CYV, R, { fill: 'none', stroke: RED, 'stroke-width': 7, transform: `rotate(-90 ${CXR} ${CYV})` });
    const conn = K.line(svg, 960, CYV + hh + 8, 960, 846, { stroke: GREEN, 'stroke-width': 4, 'stroke-dasharray': '2 10' });
    A.draw(tl, [ringL, ringR], t3 + 0.55, 0.8);
    A.in(tl, lens, t3 + 0.75, 'fade', { dur: 0.5 });
    A.in(tl, conn, t3 + 0.9, 'fade', { dur: 0.3 });
    const pill = box(stage, 'c3-pill', 'Often a bit of both', { x: 960, y: 850 });
    gsap.set(pill, { xPercent: -50 });
    pill.style.zIndex = 4;
    tl.fromTo(pill, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, t3 + 0.95);
    tl.to(lens, { attr: { 'fill-opacity': 0.8 }, duration: 0.5, yoyo: true, repeat: 1, ease: 'sine.inOut' }, t3 + 1.6);
  });

  // ------------------------------------------------------------------ ch03s02: A reactive dog CAN become aggressive
  registerScene('ch03s02', ({ stage, tl, cue, dur }) => {
    stage.appendChild(style());

    const p = K.photo(stage, 'photo_reactive_to_aggressive.jpg', { x: 100, y: 115, w: 690, h: 845, pos: '50% 45%' });
    A.in(tl, p.root, Math.max(0, cue(0) - 0.25), 'fadeRight', { dur: 1.0 });
    A.kenburns(tl, p.img, { from: 1.03, to: 1.12, x0: 0, x1: -1.5 });

    // statement: built char by char so it can type on; CAN carries its own underline
    const SX = 890, SY = 200;
    const st = box(stage, 'c3-stmt', null, { x: SX, y: SY, w: 930 });
    const LINES = [
      [{ t: 'A' }, { t: 'REACTIVE', g: 1 }, { t: 'DOG' }],
      [{ t: 'CAN', can: 1 }, { t: 'BECOME' }],
      [{ t: 'AGGRESSIVE', g: 1, tight: 1 }, { t: '.' }],
    ];
    const chars = [];
    let canWord = null, lineTwo = null;
    LINES.forEach((words, li) => {
      const ln = K.el('div', 'ln');
      words.forEach((wd, wi) => {
        const w = K.el('span', 'w' + (wd.g ? ' g' : ''));
        [...wd.t].forEach(c => { const s = K.el('span', 'ch', c); w.appendChild(s); chars.push(s); });
        ln.appendChild(w);
        if (wd.can) canWord = w;
        if (wi < words.length - 1 && !wd.tight) ln.appendChild(document.createTextNode(' '));
      });
      if (li === 1) lineTwo = ln;
      st.appendChild(ln);
    });
    const ul = K.el('div', 'ul');
    canWord.appendChild(ul);
    const notWill = K.el('span', 'c3-notwill', 'not will');
    lineTwo.appendChild(notWill);

    // beat 1: statement types on, sitting a little lower so the frame is balanced
    const t0 = cue(0);
    gsap.set(st, { y: 150 });
    tl.fromTo(chars, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.25, stagger: 0.03, ease: 'power2.out' }, t0 + 0.25);

    // beat 2: statement rises, CAN underlined, "not will" tag, four empty circles on a timeline arrow
    const t1 = cue(1);
    tl.to(st, { y: 0, duration: 0.9, ease: 'power3.inOut' }, t1);
    tl.fromTo(ul, { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: 0.5, ease: 'power2.inOut' }, t1 + 0.45);
    tl.fromTo(notWill, { opacity: 0, scale: 0.5, rotation: -12 }, { opacity: 1, scale: 1, rotation: -4, duration: 0.6, ease: 'back.out(1.8)' }, t1 + 0.7);

    const four = box(stage, 'c3-four', '*Four* common ways', { x: SX, y: 650 });
    A.in(tl, four, t1 + 0.6, 'fadeUp', { dur: 0.6 });
    const TY = 780;
    const svg = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const axis = K.path(svg, `M ${SX} ${TY} L 1790 ${TY}`, { stroke: GREEN_LIGHT, 'stroke-width': 6 });
    const head = K.path(svg, `M 1772 ${TY - 18} L 1794 ${TY} L 1772 ${TY + 18}`, { stroke: GREEN_LIGHT, 'stroke-width': 6 });
    A.draw(tl, axis, t1 + 0.7, 0.8);
    A.in(tl, head, t1 + 1.4, 'fade', { dur: 0.25 });
    const circles = [0, 1, 2, 3].map(i => box(stage, 'c3-tc', null, { x: SX + 20 + i * 235, y: TY - 42 }));
    A.in(tl, circles, t1 + 0.85, 'pop', { dur: 0.5, stagger: 0.1 });
  });

  // ------------------------------------------------------------------ ch03s03: It works, and it's practiced
  registerScene('ch03s03', (ctx) => {
    const { stage, tl, cue, end, dur } = ctx;
    const at = sayAt(ctx);
    stage.appendChild(style());

    const h = K.heading(stage, 'It works, and it’s practiced', { x: 100, y: 120, w: 1400, size: 76 });
    A.in(tl, h.title, Math.max(0, cue(0) - 0.25), 'fadeUp', { dur: 0.8 });
    A.in(tl, h.bar, cue(0) + 0.25, 'grow', { dur: 0.6 });

    // the four circles from ch03s02 return as a thin strip across the top
    const sp = strip(stage, tl, { y: 282 });
    A.draw(tl, sp.base, 0.05, 0.9, { ease: 'power2.out' });
    A.in(tl, sp.head, 0.8, 'fade', { dur: 0.25 });
    tl.fromTo(sp.steps.map(s => s.dot), { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.45, stagger: 0.15, ease: 'back.out(2)' }, 0.1);

    const TX = 100, TY = 372, TW = 640, SY = 548;
    const title1 = stepTitle(stage, 1, 'The behavior works', { x: TX, y: TY, w: TW });
    const title2 = stepTitle(stage, 2, 'Practice makes it stronger', { x: TX, y: TY, w: TW });
    const sub1 = box(stage, 'c3-sub', 'Behavior that works<br>*gets repeated*', { x: TX, y: SY, w: 620 });
    const sub3 = box(stage, 'c3-sub', 'Every rehearsal<br>*deepens the path*', { x: TX, y: SY, w: 620 });

    // --- the loop: a ring with three nodes, drawn clockwise from the top
    const CX = 1270, CY = 662, R = 190;
    const ang = [-90, 30, 150];
    const pt = a => [CX + R * Math.cos(a * Math.PI / 180), CY + R * Math.sin(a * Math.PI / 180)];
    const svg = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const ringD = `M ${CX} ${CY - R} A ${R} ${R} 0 1 1 ${CX} ${CY + R} A ${R} ${R} 0 1 1 ${CX} ${CY - R}`;
    const ring = K.path(svg, ringD, { stroke: GREEN_LIGHT, 'stroke-width': 12 });
    // arrowheads (chevrons) on the ring midway between nodes, pointing clockwise
    const chevs = [-30, 90, 210].map(a => {
      const [x, y] = pt(a);
      return K.path(svg, 'M -13 -17 L 7 0 L -13 17', { stroke: GREEN, 'stroke-width': 8, transform: `translate(${x} ${y}) rotate(${a + 90})` });
    });
    // comet that orbits the ring during beat 3
    const comet = K.group(svg, { opacity: 0 });
    const trail = [0.18, 0.32, 0.55].map((o, i) => K.circle(comet, CX, CY - R, 7 + i * 2, { fill: GREEN, opacity: o }));
    const glow = K.circle(comet, CX, CY - R, 30, { fill: GREEN, opacity: 0.18 });
    const dot = K.circle(comet, CX, CY - R, 13, { fill: GREEN_DARK });
    // return arrow (relief reinforces the barking): from node 3 arching back to node 2 inside the ring
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
      const b = box(stage, 'c3-node ' + n.v, null, { x: x - 58, y: y - 58, w: 116, h: 116 });
      b.appendChild(K.icon(n.icon, { stroke: 2.2 }));
      const lab = n.side === 'r' ? box(stage, 'c3-nlab', n.t, { x: x + 78, y: y - 38 })
        : n.side === 't' ? box(stage, 'c3-nlab c', n.t, { x: x - 250, y: y - 112, w: 500 })
          : box(stage, 'c3-nlab r', n.t, { x: x - 78 - 260, y: y - 38, w: 260 });
      return { b, lab, x, y };
    });
    const relief = box(stage, 'c3-pill', null, { x: nodes[2].x - 78 - 212, y: nodes[2].y + 56 });
    relief.appendChild(K.icon('check', { stroke: 3 }));
    relief.appendChild(K.el('span', null, 'Relief'));

    // beat 1: circle one lights with 'Works', title, the loop draws clockwise and the nodes pop as it passes
    const t0 = cue(0);
    sp.light(0, t0 + 0.2);
    A.in(tl, title1, t0 + 0.35, 'fadeUp', { dur: 0.7 });
    A.draw(tl, ring, t0 + 0.3, 1.2, { ease: 'power1.inOut' });
    nodes.forEach((n, i) => {
      tl.fromTo(n.b, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.8)' }, t0 + 0.3 + i * 0.4);
      A.in(tl, n.lab, t0 + 0.4 + i * 0.4, n.side === 'r' ? 'fadeLeft' : n.side === 't' ? 'fadeUp' : 'fadeRight', { dur: 0.5 });
    });
    A.in(tl, chevs, t0 + 0.7, 'fade', { dur: 0.3, stagger: 0.4 });

    // beat 2: Relief glows on node three, the return arrow curves back to "Bark and lunge"
    const t1 = cue(1);
    tl.fromTo(relief, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.8)' }, t1 + 0.1);
    tl.to(relief, { boxShadow: '0 0 0 16px rgba(97,149,55,0.25)', duration: 0.35, ease: 'power2.out' }, t1 + 0.6);
    tl.to(relief, { boxShadow: '0 12px 26px rgba(44,74,23,0.24)', duration: 0.6, ease: 'power2.inOut' }, t1 + 0.95);
    tl.to(nodes[2].b, { boxShadow: '0 0 0 14px rgba(97,149,55,0.22)', duration: 0.35 }, t1 + 0.6);
    tl.to(nodes[2].b, { boxShadow: '0 10px 30px rgba(40,60,20,0.10)', duration: 0.6 }, t1 + 0.95);
    A.draw(tl, ret, t1 + 0.55, 0.8);
    A.in(tl, retHead, t1 + 1.3, 'fade', { dur: 0.2 });
    A.in(tl, sub1, clamp(at(1, 'behavior that works'), t1 + 0.8, cue(2) - 1.5), 'fadeUp', { dur: 0.7 });

    // beat 3: dot two, title swaps, the loop spins faster and faster while a counter ticks up
    const t2 = cue(2);
    sp.settle(0, t2);
    sp.light(1, t2 + 0.1);
    swap(tl, title1, title2, t2);
    tl.to(sub1, { opacity: 0, y: -20, duration: 0.3, ease: 'power2.out' }, t2 - 0.05);
    const cnt = box(stage, 'c3-count', null, { x: TX, y: SY, w: 470, h: 230 });
    const cib = K.el('div', 'ib'); cib.appendChild(K.icon('repeat', { stroke: 2.4 })); cnt.appendChild(cib);
    const col = K.el('div', 'col'); cnt.appendChild(col);
    const num = K.el('div', 'num'); col.appendChild(num);
    const vals = ['1', '5', '20', '50'].map(v => { const s = K.el('span', null, v); num.appendChild(s); return s; });
    col.appendChild(K.el('div', 'lab', 'times practiced'));
    A.in(tl, cnt, t2 + 0.35, 'fadeUp', { dur: 0.7 });
    gsap.set(vals.slice(1), { opacity: 0 });
    const S = Math.max(3, Math.min(end(2) - t2 + 0.4, cue(3) - t2 - 0.7)), LAPS = 5;
    const spinStart = t2 + 0.4;
    const lapAt = k => spinStart + S * Math.sqrt(k / LAPS); // power1.in: progress = p^2
    [1, 2, 3].forEach(k => {
      const at = lapAt(k);
      tl.to(vals[k - 1], { opacity: 0, y: -30, duration: 0.2, ease: 'power2.in' }, at - 0.05);
      tl.fromTo(vals[k], { opacity: 0, y: 30, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'back.out(2)' }, at + 0.1);
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

    // beat 4: the loop fades; a faint dotted line across a lawn wears into a bold path
    const t3 = cue(3), L3 = end(3) - t3;
    const loopBits = [svg, ...nodes.map(n => n.b), ...nodes.map(n => n.lab), relief, cnt];
    tl.to(loopBits, { opacity: 0, duration: 0.5, ease: 'power2.in' }, t3 - 0.2);
    tl.to(nodes.map(n => n.b), { scale: 0.85, duration: 0.5, ease: 'power2.in' }, t3 - 0.2);

    const LW = 1020, LH = 560, LXp = 800, LYp = 372;
    const lawn = K.svg(stage, { x: LXp, y: LYp, w: LW, h: LH });
    const defs = K.svgEl('defs', {}, lawn);
    const g = K.svgEl('linearGradient', { id: 'c3-lawn', x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    K.svgEl('stop', { offset: '0', 'stop-color': '#d6e9bf' }, g);
    K.svgEl('stop', { offset: '1', 'stop-color': '#a7cb80' }, g);
    const clip = K.svgEl('clipPath', { id: 'c3-lawnclip' }, defs);
    K.rect(clip, 0, 0, LW, LH, { rx: 26 });
    const reveal = K.svgEl('clipPath', { id: 'c3-newclip', clipPathUnits: 'userSpaceOnUse' }, defs);
    const revealR = K.rect(reveal, -40, 0, 0, LH, { fill: '#fff' });
    const body = K.group(lawn, { 'clip-path': 'url(#c3-lawnclip)' });
    K.rect(body, 0, 0, LW, LH, { fill: 'url(#c3-lawn)' });
    // seeded grass tufts
    let seed = 7;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    for (let i = 0; i < 54; i++) {
      const x = 30 + rnd() * (LW - 60), y = 40 + rnd() * (LH - 60), s = 0.8 + rnd() * 0.6;
      K.path(body, `M ${x} ${y} l ${-7 * s} ${-20 * s} M ${x} ${y} l 0 ${-26 * s} M ${x} ${y} l ${7 * s} ${-20 * s}`,
        { stroke: rnd() > 0.5 ? '#86b556' : '#79a94b', 'stroke-width': 4, opacity: 0.55 + rnd() * 0.35 });
    }
    // the old path (wears in) and, below it, the fresh path we build instead
    const pathD = 'M -30 400 C 200 405, 320 290, 520 255 S 850 140, 1060 60';
    const newD = 'M -30 505 C 230 505, 380 425, 580 395 S 900 330, 1060 300';
    const worn = K.path(body, pathD, { stroke: '#cdb285', 'stroke-width': 0 });
    const wornIn = K.path(body, pathD, { stroke: '#b8966a', 'stroke-width': 0, opacity: 0.75 });
    const dotted = K.path(body, pathD, { stroke: '#6f6446', 'stroke-width': 7, 'stroke-dasharray': '0.1 24', opacity: 0.6 });
    const freshG = K.group(body, { 'clip-path': 'url(#c3-newclip)' });
    K.path(freshG, newD, { stroke: '#ffffff', 'stroke-width': 20, 'stroke-dasharray': '0.1 26', opacity: 0.75 });
    K.path(freshG, newD, { stroke: GREEN_DARK, 'stroke-width': 12, 'stroke-dasharray': '0.1 26' });
    K.rect(lawn, 2, 2, LW - 4, LH - 4, { rx: 25, fill: 'none', stroke: '#ffffff', 'stroke-width': 4, opacity: 0.7 });
    lawn.style.filter = 'drop-shadow(0 18px 40px rgba(40,60,20,0.16))';
    const newp = box(stage, 'c3-newp', null, { x: LXp + 730, y: LYp + 408 });
    newp.appendChild(K.icon('sprout', { stroke: 2.4 }));
    newp.appendChild(K.el('span', null, 'New path'));

    tl.fromTo(lawn, { opacity: 0, scale: 0.96, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' }, t3 + 0.2);
    tl.fromTo(dotted, { opacity: 0 }, { opacity: 0.6, duration: 0.6 }, t3 + 0.7);
    A.in(tl, sub3, t3 + 0.5, 'fadeUp', { dur: 0.7 });
    // "walk it every day": a thin trace; "it wears in": thicker; "without thinking": a bold, worn path
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
    // "the good news": a fresh green dotted path sketches in beside the worn one
    const tn = clamp(at(3, 'the good news', 0.2), w3 + 1.0, dur - 2.6);
    tl.fromTo(revealR, { attr: { width: 0 } }, { attr: { width: LW + 80 }, duration: 1.6, ease: 'power1.inOut' }, tn);
    tl.fromTo(newp, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.55, ease: 'back.out(1.8)' }, Math.min(tn + 0.9, dur - 1.8));
  });

  // ------------------------------------------------------------------ ch03s04: Warnings and frustration
  registerScene('ch03s04', (ctx) => {
    const { stage, tl, cue, end, dur } = ctx;
    const at = sayAt(ctx);
    stage.appendChild(style());

    const h = K.heading(stage, 'Warnings and frustration', { x: 100, y: 120, w: 1400, size: 76 });
    A.in(tl, h.title, Math.max(0, cue(0) - 0.25), 'fadeUp', { dur: 0.8 });
    A.in(tl, h.bar, cue(0) + 0.25, 'grow', { dur: 0.6 });

    // the timeline strip stays pinned: Works and Practice are already lit
    const sp = strip(stage, tl, { y: 282, done: [0, 1] });
    A.in(tl, sp.wrap, 0, 'fade', { dur: 0.5 });

    const TX = 100, TY = 372, TW = 640, SY = 548;
    const title3 = stepTitle(stage, 3, 'Warnings ignored or punished', { x: TX, y: TY, w: TW });
    const title4 = stepTitle(stage, 4, 'Frustration boils over', { x: TX, y: TY, w: TW });
    const sub1 = box(stage, 'c3-sub', 'The warnings *get skipped*', { x: TX, y: SY, w: 620 });
    const sub3 = box(stage, 'c3-sub', 'Hands clear.<br><span class="l2">*Add distance.*</span>', { x: TX, y: SY, w: 620 });
    const sub3b = sub3.querySelector('.l2');

    // --- the warning ladder, small, on the right
    const LX = 960, LY = 398, RH = 62, RG = 12, LW = 520;
    const L = K.ladder(stage, LADDER, { x: LX, y: LY, w: LW, rungH: RH, gap: RG, size: 28 });
    const HH = LADDER.length * RH + (LADDER.length - 1) * RG;
    const rungTop = i => LY + HH - (i + 1) * RH - i * RG;
    const xs = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const gy = rungTop(2) + RH / 2;
    const X = K.group(xs, { transform: `translate(${LX + 40 + LW - 22 - 150} ${gy})` });
    const XI = K.group(X);
    ['M -30 -30 L 30 30', 'M 30 -30 L -30 30'].forEach(d => K.path(XI, d, { stroke: '#ffffff', 'stroke-width': 26 }));
    ['M -30 -30 L 30 30', 'M 30 -30 L -30 30'].forEach(d => K.path(XI, d, { stroke: RED, 'stroke-width': 14 }));

    const t0 = cue(0);
    sp.light(2, t0 + 0.2);
    A.in(tl, title3, t0 + 0.35, 'fadeUp', { dur: 0.7 });
    tl.fromTo(L.rails, { scaleY: 0, transformOrigin: '50% 100%' }, { scaleY: 1, duration: 0.9, ease: 'power2.inOut' }, t0 + 0.1);
    tl.fromTo(L.rungs, { opacity: 0, scaleX: 0.6 }, { opacity: 1, scaleX: 1, duration: 0.45, stagger: 0.08, ease: 'power3.out' }, t0 + 0.2);
    tl.fromTo(XI, { opacity: 0, scale: 1.9, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, transformOrigin: '50% 50%', duration: 0.35, ease: 'back.out(2.2)' }, t0 + 1.05);
    tl.to(L.rungs[2], { x: 6, duration: 0.05, yoyo: true, repeat: 3, ease: 'none' }, t0 + 1.3);

    // beat 2: lower rungs fade to grey, a red arrow jumps from the bottom rung straight to Bite
    const t1 = cue(1);
    tl.to(L.rungs.slice(0, 5), { backgroundColor: '#d3d8cc', color: '#8c9386', boxShadow: '0 6px 16px rgba(40,60,20,0)', duration: 0.5, stagger: 0.05, ease: 'power2.out' }, t1);
    tl.to(XI, { opacity: 0.45, duration: 0.5 }, t1);
    const yb = rungTop(0) + RH / 2, yt = rungTop(5) + RH / 2, ax = LX + LW + 50;
    const jump = K.path(xs, `M ${ax} ${yb} C ${ax + 190} ${yb - 60}, ${ax + 190} ${yt + 60}, ${ax + 8} ${yt}`, { stroke: RED, 'stroke-width': 9 });
    const jhead = K.path(xs, 'M 18 -18 L -2 0 L 18 18', { stroke: RED, 'stroke-width': 9, transform: `translate(${ax + 6} ${yt})` });
    A.draw(tl, jump, t1 + 0.25, 0.6, { ease: 'power2.in' });
    A.in(tl, jhead, t1 + 0.8, 'fade', { dur: 0.15 });
    const bite = L.rungs[5];
    tl.to(bite, { boxShadow: '0 0 0 18px rgba(184,69,45,0.28)', scale: 1.05, duration: 0.25, ease: 'power2.out' }, t1 + 0.85);
    tl.to(bite, { boxShadow: '0 6px 16px rgba(40,60,20,0.14)', scale: 1, duration: 0.5, ease: 'power2.inOut' }, t1 + 1.1);
    A.in(tl, sub1, t1 + 0.35, 'fadeUp', { dur: 0.7 });

    // beat 3: ladder clears; a pressure gauge fills to red; a zap arcs sideways to leash, dog and hand
    const t2 = cue(2), L2 = end(2) - t2;
    tl.to([L.root, xs], { opacity: 0, duration: 0.45, ease: 'power2.in' }, t2 - 0.2);
    tl.to(sub1, { opacity: 0, y: -20, duration: 0.3, ease: 'power2.out' }, t2 - 0.05);
    sp.settle(2, t2);
    sp.light(3, t2 + 0.1);
    swap(tl, title3, title4, t2);

    const GX = 910, GY = 700, GR = 172;
    const gs = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const gdefs = K.svgEl('defs', {}, gs);
    const grad = K.svgEl('linearGradient', { id: 'c3-press', gradientUnits: 'userSpaceOnUse', x1: GX - GR, y1: 0, x2: GX + GR, y2: 0 }, gdefs);
    K.svgEl('stop', { offset: '0', 'stop-color': '#7fb24a' }, grad);
    K.svgEl('stop', { offset: '0.5', 'stop-color': '#d9912b' }, grad);
    K.svgEl('stop', { offset: '1', 'stop-color': '#b8452d' }, grad);
    const gauge = K.group(gs);
    const PR = 236;
    K.path(gauge, `M ${GX - PR} ${GY + 40} L ${GX - PR} ${GY} A ${PR} ${PR} 0 0 1 ${GX + PR} ${GY} L ${GX + PR} ${GY + 40} Q ${GX + PR} ${GY + 62} ${GX + PR - 22} ${GY + 62} L ${GX - PR + 22} ${GY + 62} Q ${GX - PR} ${GY + 62} ${GX - PR} ${GY + 40} Z`,
      { fill: '#ffffff', stroke: '#e3e7dc', 'stroke-width': 2, style: 'filter: drop-shadow(0 14px 30px rgba(40,60,20,0.14))' });
    const arcD = `M ${GX - GR} ${GY} A ${GR} ${GR} 0 0 1 ${GX + GR} ${GY}`;
    K.path(gauge, arcD, { stroke: '#e8ece2', 'stroke-width': 40, 'stroke-linecap': 'butt' });
    for (let i = 0; i <= 10; i++) {
      const a = Math.PI + (i / 10) * Math.PI;
      const r1 = GR + 30, r2 = GR + (i % 5 === 0 ? 50 : 42);
      K.line(gauge, GX + r1 * Math.cos(a), GY + r1 * Math.sin(a), GX + r2 * Math.cos(a), GY + r2 * Math.sin(a), { stroke: '#c9cfc0', 'stroke-width': i % 5 === 0 ? 6 : 4 });
    }
    const fill = K.path(gauge, arcD, { stroke: 'url(#c3-press)', 'stroke-width': 40, 'stroke-linecap': 'butt' });
    const needle = K.group(gauge);
    K.line(needle, GX, GY, GX, GY - GR + 34, { stroke: '#2f3530', 'stroke-width': 10 });
    K.circle(gauge, GX, GY, 22, { fill: '#2f3530' });
    K.circle(gauge, GX, GY, 8, { fill: '#ffffff' });
    const glab = box(stage, 'c3-glab', 'Pressure', { x: GX - 150, y: GY + 90, w: 300 });

    const gIn = t2 + 0.3;
    tl.fromTo(gauge, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, gIn);
    A.in(tl, glab, gIn + 0.2, 'fadeUp', { dur: 0.6 });
    const fillEnd = mid(t2, L2, 0.5, 3.4, cue(3) - 2.4);
    A.draw(tl, fill, gIn + 0.5, fillEnd - gIn - 0.5, { ease: 'power1.in' });
    tl.fromTo(needle, { rotation: -90, svgOrigin: `${GX} ${GY}` }, { rotation: 86, svgOrigin: `${GX} ${GY}`, duration: fillEnd - gIn - 0.5, ease: 'power1.in' }, gIn + 0.5);
    tl.to(needle, { rotation: 80, svgOrigin: `${GX} ${GY}`, duration: 0.07, yoyo: true, repeat: 9, ease: 'none' }, fillEnd);

    // the zap: a jagged bolt arcing sideways off the gauge, forking to three small icons
    const S0 = [GX + 205, GY - 108], C0 = [1255, 470], E0 = [1380, 585];
    const q = t => [
      (1 - t) * (1 - t) * S0[0] + 2 * t * (1 - t) * C0[0] + t * t * E0[0],
      (1 - t) * (1 - t) * S0[1] + 2 * t * (1 - t) * C0[1] + t * t * E0[1],
    ];
    let boltD = `M ${S0[0]} ${S0[1]}`;
    const N = 8;
    for (let i = 1; i < N; i++) {
      const t = i / N, [x, y] = q(t), [x2, y2] = q(t + 0.01);
      const nx = -(y2 - y), ny = x2 - x, nl = Math.hypot(nx, ny) || 1, off = (i % 2 ? 15 : -15);
      boltD += ` L ${x + nx / nl * off} ${y + ny / nl * off}`;
    }
    boltD += ` L ${E0[0]} ${E0[1]}`;
    const zs = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const boltGlow = K.path(zs, boltD, { stroke: '#fbefd9', 'stroke-width': 22 });
    const bolt = K.path(zs, boltD, { stroke: AMBER, 'stroke-width': 8 });
    const IX = 1500, IYS = [440, 610, 780];
    const forks = IYS.map(y => K.path(zs, `M ${E0[0]} ${E0[1]} L ${IX - 64} ${y}`, { stroke: AMBER, 'stroke-width': 6 }));
    const [zx, zy] = q(0.5);
    const zap = K.iconBadge(stage, 'zap', { x: zx - 46, y: zy - 46, size: 92, variant: 'amber' });
    zap.style.border = '4px solid #f0cf9c';
    const ICONS = [{ n: 'dog', t: 'Leash', svg: LEASH }, { n: 'dog', t: 'Dog' }, { n: 'hand', t: 'Hand' }];
    const targets = ICONS.map((it, i) => {
      const b = K.iconBadge(stage, it.n, { x: IX - 52, y: IYS[i] - 52, size: 104 });
      if (it.svg) b.querySelector('svg').innerHTML = it.svg;
      b.style.border = '4px solid #d8e6c9';
      const lb = box(stage, 'c3-tlab', it.t, { x: IX - 80, y: IYS[i] + 60, w: 160 });
      return { b, lb };
    });
    const zt = mid(t2, L2, 0.56, 4.0, cue(3) - 1.9);
    A.draw(tl, [boltGlow, bolt], zt, 0.45, { ease: 'power2.in' });
    A.in(tl, zap, zt + 0.2, 'pop', { dur: 0.5 });
    A.draw(tl, forks, zt + 0.45, 0.3, { ease: 'power2.in' });
    targets.forEach((o, i) => {
      A.in(tl, o.b, zt + 0.55 + i * 0.12, 'pop', { dur: 0.45 });
      A.in(tl, o.lb, zt + 0.65 + i * 0.12, 'fade', { dur: 0.4 });
    });
    const hand = targets[2].b;
    const ht = mid(t2, L2, 0.84, zt - t2 + 1.2, cue(3) - 0.5);
    tl.to(hand, { backgroundColor: '#f8e3dd', color: RED, borderColor: '#eebcaf', duration: 0.3 }, ht);
    tl.to(hand, { boxShadow: '0 0 0 16px rgba(184,69,45,0.22)', scale: 1.08, duration: 0.25, ease: 'power2.out' }, ht);
    tl.to(hand, { boxShadow: '0 0 0 0px rgba(184,69,45,0)', scale: 1, duration: 0.5, ease: 'power2.inOut' }, ht + 0.25);
    tl.to(forks[2], { attr: { stroke: RED }, duration: 0.3 }, ht);

    // beat 4: "Redirection" names the zap; then the hand slides back out of range and a green
    // distance arrow stretches away from the gauge ("Hands clear. Add distance.")
    const t3 = cue(3);
    const redir = box(stage, 'c3-redir', 'Redirection', { x: zx - 170, y: zy - 122, w: 340 });
    A.in(tl, redir, t3 + 0.15, 'fadeUp', { dur: 0.6 });
    const tSlide = clamp(at(3, 'keep your hands'), t3 + 1.6, dur - 2.8);
    A.in(tl, sub3, tSlide - 0.1, 'fadeUp', { dur: 0.7 });
    const handLab = targets[2].lb;
    tl.to(forks[2], { drawSVG: '0% 0%', duration: 0.45, ease: 'power2.in' }, tSlide);
    tl.to([hand, handLab], { x: 230, y: 20, duration: 0.9, ease: 'power3.inOut' }, tSlide + 0.1);
    tl.to(hand, { backgroundColor: '#e8f1dc', color: GREEN_DARK, borderColor: '#d8e6c9', duration: 0.5 }, tSlide + 0.5);
    const DY = 912, DX0 = GX + 40, DX1 = 1778;
    const dsv = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const dTail = K.line(dsv, DX0, DY - 20, DX0, DY + 20, { stroke: GREEN, 'stroke-width': 7 });
    const dShaft = K.line(dsv, DX0, DY, DX1 - 4, DY, { stroke: GREEN, 'stroke-width': 7 });
    const dHead = K.path(dsv, `M ${DX1 - 22} ${DY - 20} L ${DX1} ${DY} L ${DX1 - 22} ${DY + 20}`, { stroke: GREEN, 'stroke-width': 7 });
    const tDist = clamp(at(3, 'add distance', 1.0), tSlide + 1.1, dur - 1.8);
    A.in(tl, sub3b, tDist, 'fade', { dur: 0.5 });
    A.in(tl, dTail, tDist, 'fade', { dur: 0.25 });
    A.draw(tl, dShaft, tDist + 0.05, 0.7, { ease: 'power2.out' });
    A.in(tl, dHead, tDist + 0.65, 'fade', { dur: 0.2 });
  });

  // ------------------------------------------------------------------ ch03s05: Never punish a growl
  registerScene('ch03s05', (ctx) => {
    const { stage, tl, cue, end, dur } = ctx;
    const at = sayAt(ctx);
    stage.appendChild(style());

    // beat 1: the rule lands large at the center, then settles into the heading slot
    const t0 = cue(0);
    const big = box(stage, 'c3-bigh', 'Never punish a growl.', { x: 960, y: 120 });
    const bar = box(stage, 'accent-bar', null, { x: 960, y: 237 });
    gsap.set(big, { xPercent: -50, y: 355, scale: 1.5, transformOrigin: '50% 50%' });
    gsap.set(bar, { xPercent: -50, y: 385 });
    tl.fromTo(big, { opacity: 0, scale: 1.7 }, { opacity: 1, scale: 1.5, duration: 0.9, ease: 'power3.out' }, t0 + 0.05);
    tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'power2.inOut' }, t0 + 0.6);

    const t1 = cue(1), L1 = end(1) - t1;
    // a slow, calm push-in while the rule holds the screen
    if (t1 - t0 > 2.4) tl.to(big, { scale: 1.54, duration: t1 - t0 - 1.2, ease: 'sine.inOut' }, t0 + 0.95);
    tl.to(big, { xPercent: 0, x: -860, y: 0, scale: 1, duration: 0.9, ease: 'power3.inOut' }, t1 - 0.1);
    tl.to(bar, { xPercent: 0, x: -860, y: 0, duration: 0.9, ease: 'power3.inOut' }, t1 - 0.1);

    // beat 2: a dashboard with an amber check engine light; tape slaps over it; smoke keeps rising
    const DX = 130, DY = 330, DW = 820, DH = 540;
    const dwrap = box(stage, 'c3-dashwrap', null, { x: DX, y: DY, w: DW, h: DH });
    dwrap.style.position = 'absolute';
    const ds = K.svg(dwrap, { x: 0, y: 0, w: DW, h: DH });
    const ddefs = K.svgEl('defs', {}, ds);
    const rg = K.svgEl('radialGradient', { id: 'c3-glow' }, ddefs);
    K.svgEl('stop', { offset: '0', 'stop-color': '#ffb43c', 'stop-opacity': 0.9 }, rg);
    K.svgEl('stop', { offset: '1', 'stop-color': '#ffb43c', 'stop-opacity': 0 }, rg);
    const blur = K.svgEl('filter', { id: 'c3-smokeblur', x: '-50%', y: '-50%', width: '200%', height: '200%' }, ddefs);
    K.svgEl('feGaussianBlur', { stdDeviation: 3.5 }, blur);
    const smoke = [[340, 0.0], [430, 0.6], [505, 1.2]].map(([x, d]) => ({
      p: K.path(ds, `M ${x} 200 C ${x - 30} 160, ${x + 30} 128, ${x} 88 S ${x - 24} 24, ${x + 8} -12`, { stroke: '#b3b8ad', 'stroke-width': 18, filter: 'url(#c3-smokeblur)' }),
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
    const glowC = K.circle(dash, LCX, LCY, 96, { fill: 'url(#c3-glow)', opacity: 0 });
    // check engine symbol
    const eng = K.group(dash, { transform: `translate(${LCX - 50} ${LCY - 34}) scale(1)` });
    const engD = 'M 14 22 h 10 v -8 h 16 v -6 h -8 v -6 h 30 v 6 h -8 v 6 h 18 l 8 8 h 8 v -6 h 8 v 40 h -8 v -6 h -8 l -10 12 h -40 l -8 -8 h -10 v 10 h -8 v -34 h 8 z';
    const engOff = K.path(eng, engD, { fill: '#4a524b', stroke: 'none' });
    const engOn = K.path(eng, engD, { fill: '#f5a623', stroke: 'none', opacity: 0 });
    gsap.set(smoke.map(o => o.p), { opacity: 0 });
    const tape = box(dwrap, 'c3-tape', null, { x: LCX - 135, y: LCY - 44 });
    const cap1 = box(stage, 'c3-cap', 'The problem is<br>*still there*', { x: 1060, y: 520, w: 760 });

    const dIn = t1 + 0.35;
    gsap.set(dwrap, { x: 960 - (DX + DW / 2) });
    tl.fromTo(ds, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, dIn);
    tl.to(engOn, { opacity: 1, duration: 0.3 }, dIn + 0.7);
    tl.to(glowC, { opacity: 1, duration: 0.3 }, dIn + 0.7);
    tl.to(glowC, { opacity: 0.55, duration: 0.45, yoyo: true, repeat: 3, ease: 'sine.inOut' }, dIn + 1.0);
    const tapeAt = mid(t1, L1, 0.3, 2.4, cue(2) - 2.6);
    tl.fromTo(tape, { opacity: 0, scale: 1.5, rotation: -24 }, { opacity: 1, scale: 1, rotation: -9, duration: 0.28, ease: 'power4.out' }, tapeAt);
    tl.to(ds, { x: 5, duration: 0.05, yoyo: true, repeat: 3, ease: 'none' }, tapeAt + 0.25);
    tl.to([glowC, engOn], { opacity: 0, duration: 0.2 }, tapeAt + 0.2);
    // smoke keeps rising behind the dash
    const sEnd = cue(2);
    smoke.forEach(({ p, d }) => {
      const start = dIn + 0.9 + d;
      const n = Math.max(1, Math.floor((sEnd - start) / 1.7));
      tl.to(p, {
        keyframes: [{ opacity: 0, y: 30, duration: 0 }, { opacity: 0.75, y: -10, duration: 0.8, ease: 'sine.out' }, { opacity: 0, y: -60, duration: 0.9, ease: 'sine.in' }],
        repeat: n - 1,
      }, start);
    });
    const capAt = mid(t1, L1, 0.48, 3.6, cue(2) - 1.4);
    tl.to(dwrap, { x: 0, duration: 0.9, ease: 'power3.inOut' }, capAt - 0.3);
    A.in(tl, cap1, capAt + 0.2, 'fadeLeft', { dur: 0.8 });

    // beat 3: the iceberg returns; the growl at its tip is wiped away; the feelings stay put
    const t2 = cue(2), L2 = end(2) - t2;
    tl.to([dwrap, cap1], { opacity: 0, duration: 0.45, ease: 'power2.in' }, t2 - 0.2);

    const S = 0.8, OX = -242.8, OY = 129.6; // ch01 iceberg coordinates, scaled into the left of the frame
    const T = (x, y) => [x * S + OX, y * S + OY];
    const WL = 562 * S + OY;
    const isvg = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const idefs = K.svgEl('defs', {}, isvg);
    const wg = K.svgEl('linearGradient', { id: 'c3-water', x1: 0, y1: 0, x2: 0, y2: 1 }, idefs);
    K.svgEl('stop', { offset: '0', 'stop-color': '#b8d99a', 'stop-opacity': 0.5 }, wg);
    K.svgEl('stop', { offset: '1', 'stop-color': '#e8f1dc', 'stop-opacity': 0 }, wg);
    const W0 = 100, W1 = 960;
    const fg = K.svgEl('linearGradient', { id: 'c3-wfade', gradientUnits: 'userSpaceOnUse', x1: W0, y1: 0, x2: W1, y2: 0 }, idefs);
    [[0, 0], [0.1, 1], [0.9, 1], [1, 0]].forEach(([o, v]) => K.svgEl('stop', { offset: o, 'stop-color': '#fff', 'stop-opacity': v }, fg));
    const mask = K.svgEl('mask', { id: 'c3-wmask', maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: 1920, height: 1080 }, idefs);
    K.rect(mask, W0, 0, W1 - W0, 1080, { fill: 'url(#c3-wfade)' });
    let wave = `M ${W0} ${WL}`;
    for (let x = W0; x < W1; x += 40) wave += ` Q ${x + 10} ${WL - 8} ${x + 20} ${WL} Q ${x + 30} ${WL + 8} ${x + 40} ${WL}`;
    const water = K.group(isvg, { mask: 'url(#c3-wmask)' });
    K.path(water, `${wave} L ${W1} 930 L ${W0} 930 Z`, { fill: 'url(#c3-water)', stroke: 'none' });
    const berg = K.group(isvg, { transform: `translate(${OX} ${OY}) scale(${S})` });
    const mass = K.group(berg);
    K.path(mass, 'M560 562 L466 690 L512 836 L700 934 L1220 934 L1418 826 L1452 684 L1360 562 Z', { fill: '#d3e5bf', stroke: 'none' });
    K.path(mass, 'M1110 562 L1360 562 L1452 684 L1418 826 L1220 934 L1180 934 L1330 760 Z', { fill: '#c6dcaf', stroke: 'none' });
    const tip = K.group(berg);
    K.path(tip, 'M560 562 L700 452 L790 430 L880 318 L960 288 L1040 330 L1150 420 L1250 470 L1360 562 Z', { fill: '#fbfdf8', stroke: '#a9cf86', 'stroke-width': 5 });
    K.path(tip, 'M960 288 L1040 330 L1150 420 L1250 470 L1360 562 L1080 562 L1010 420 Z', { fill: '#e4efd8', stroke: 'none' });
    const wlineG = K.group(isvg, { mask: 'url(#c3-wmask)' });
    const wline = K.path(wlineG, wave, { stroke: GREEN, 'stroke-width': 5 });

    const [gx, gy] = T(960, 468);
    const growl = box(stage, 'c3-growl', 'Growl', { x: gx, y: gy });
    gsap.set(growl, { xPercent: -50, yPercent: -50 });
    const ghost = box(stage, 'c3-ghost', null, { x: gx - 76, y: gy - 36, w: 152, h: 72 });
    const [fx, fy] = T(960, 640), [frx, fry] = T(760, 806), [gux, guy] = T(1160, 806);
    const emos = [
      box(stage, 'c3-emo big', 'Fear', { x: fx - 150, y: fy, w: 300 }),
      box(stage, 'c3-emo', 'Frustration', { x: frx - 150, y: fry, w: 300 }),
      box(stage, 'c3-emo', 'Guarding', { x: gux - 150, y: guy, w: 300 }),
    ];

    const iIn = t2 + 0.05;
    A.draw(tl, wline, iIn, 0.9);
    A.in(tl, water, iIn + 0.2, 'fade', { dur: 0.7 });
    A.in(tl, tip, iIn + 0.2, 'fade', { dur: 0.6 });
    A.in(tl, mass, iIn + 0.3, 'fadeUp', { dur: 0.7 });
    A.in(tl, emos, iIn + 0.55, 'fadeUp', { dur: 0.6, stagger: 0.1 });
    tl.fromTo(growl, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.8)' }, iIn + 0.4);
    const wipeAt = mid(t2, L2, 0.2, 1.4, cue(3) - 2.2);
    tl.fromTo(growl, { clipPath: 'inset(0% 0% 0% 0% round 28px)' }, { clipPath: 'inset(0% 0% 0% 100% round 28px)', duration: 0.6, ease: 'power2.inOut' }, wipeAt);
    tl.fromTo(ghost, { opacity: 0 }, { opacity: 0.8, duration: 0.5 }, wipeAt + 0.45);
    A.pulse(tl, emos, mid(t2, L2, 0.38, 2.6, cue(3) - 1.6), { scale: 1.08 });

    const qx = 1060;
    const qq = box(stage, 'c3-q', 'Out of <span class="nw">nowhere<span class="strike"></span></span>?', { x: qx, y: 360 });
    const strike = qq.querySelector('.strike');
    A.in(tl, qq, clamp(at(2, 'out of nowhere', 0.5), t2 + 2.0, cue(3) - 0.9), 'fadeUp', { dur: 0.7 });

    // beat 4: "nowhere" struck through; the ghost pulses on "erased the warning"; the owner's plan
    // ticks in (three check bullets) with the green "Try this" badge pinned to its top-left corner
    const t3 = cue(3);
    tl.fromTo(strike, { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: 0.45, ease: 'power2.inOut' }, t3 + 0.25);
    const tGhost = clamp(at(3, 'erased the warning'), t3 + 1.0, dur - 6);
    tl.to(ghost, { borderColor: GREEN, scale: 1.12, duration: 0.3, yoyo: true, repeat: 1, ease: 'sine.inOut' }, tGhost);
    const PY0 = 548;
    const plan = K.flow(stage, { x: qx, y: PY0, w: 700, gap: 28 });
    plan.classList.add('c3-plan');
    const rows = K.bullets(plan, ['Thank the warning', 'Give space', 'Note what came before'], { icon: 'check', gap: 26, size: 38 });
    const tryB = box(stage, 'c3-try', null, { x: qx - 26, y: PY0 - 30 });
    tryB.appendChild(K.icon('notebook-pen', { stroke: 2.4 }));
    tryB.appendChild(K.el('span', null, 'Try this'));
    const planIn = clamp(at(3, 'so when your dog growls', 0.5), tGhost + 0.8, dur - 4.6);
    A.in(tl, plan, planIn, 'fadeUp', { dur: 0.7 });
    tl.fromTo(tryB, { opacity: 0, scale: 0.4, rotation: -14 }, { opacity: 1, scale: 1, rotation: -4, duration: 0.7, ease: 'back.out(1.8)' }, planIn + 0.35);
    const rowAt = [['thank them', 0.9], ['give space', 1.5], ['note what came before', 2.1]]
      .map(([p, d], i) => clamp(at(3, p, 0.35), planIn + d, dur - 2.4 + i * 0.35));
    rows.forEach((r, i) => {
      A.in(tl, r, rowAt[i], 'fadeRight', { dur: 0.6 });
      A.in(tl, r.querySelector('.ico'), rowAt[i] + 0.1, 'pop', { dur: 0.5 });
    });
  });
})();
