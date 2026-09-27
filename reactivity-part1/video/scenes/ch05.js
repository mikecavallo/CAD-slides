/* Chapter 5: What's the function? (deck slides 6 to 8)
 * ch05s01  the question, reinforcement, and the A, B, C frame with its C-to-B loop
 * ch05s02  worked example: an excited greeting (positive reinforcement)
 * ch05s03  worked example: a person approaches (negative reinforcement)
 * ch05s04  same behavior, different job, then the A, B, C worksheet homework
 */
(() => {
  const GREEN = '#619537', GREEN_DARK = '#3f6b22', OLIVE = '#4b5a1e';
  const LIGHT_BORDER = '#cdd7c0';

  const CSS = `
  .c5-hero { position:absolute; left:0; top:330px; width:1920px; display:flex; justify-content:center; align-items:center; gap:44px; }
  .c5-hero svg { overflow:visible; flex:0 0 auto; }
  .c5-tb .h-title { position:relative; font-size:96px; white-space:nowrap; }
  .c5-tb .accent-bar { position:relative; margin-top:24px; }
  .c5-rowc { position:absolute; display:flex; justify-content:center; align-items:center; }
  .c5-reinf { display:flex; align-items:center; gap:34px; background:#fff; border-radius:26px; padding:30px 60px 30px 34px; box-shadow:var(--shadow-soft); border:1px solid #e6e9e1; }
  .c5-reinf .ibs { display:flex; gap:16px; }
  .c5-reinf .ib { width:100px; height:100px; border-radius:50%; display:grid; place-items:center; }
  .c5-reinf .ib.solid { background:var(--green); color:#fff; }
  .c5-reinf .ib.pale { background:var(--green-pale); color:var(--green-dark); }
  .c5-reinf .ib svg { width:54px; height:54px; }
  .c5-reinf .word { font:700 64px/1.05 var(--font-head); color:var(--green-dark); white-space:nowrap; }
  .c5-reinf .def { font:500 38px/1.3 var(--font-body); color:var(--ink-soft); margin-top:6px; }
  .c5-chip { position:relative; }
  .c5-col { position:absolute; display:flex; flex-direction:column; align-items:center; text-align:center; }
  .c5-disc { width:200px; height:200px; border-radius:50%; background:#fff; border:6px solid var(--green-light); display:grid; place-items:center;
    font:800 124px/1 var(--font-head); color:var(--green); padding-top:4px;
    box-shadow:0 0 0 0px rgba(97,149,55,0), 0 14px 34px rgba(40,60,20,0.14); }
  .c5-word { font:700 46px/1.1 var(--font-head); color:var(--ink); margin-top:26px; }
  .c5-desc { font:500 34px/1.25 var(--font-body); color:var(--ink-soft); margin-top:8px; }
  .c5-halo { position:absolute; width:200px; height:200px; border-radius:50%; border:6px solid var(--green); opacity:0; }

  .c5-strip { position:absolute; left:0; top:0; width:1920px; height:1080px; }
  .c5-strip .abc-col .panel { background:var(--green-mist); }
  .c5-strip .abc-col .panel img.c5-over { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
  .c5-strip .abc-col .cap { display:grid; }
  .c5-strip .abc-col .cap .c5-cs { grid-area:1/1; align-self:center; }
  .c5-stamp { position:absolute; width:160px; height:160px; border-radius:50%; background:var(--green); color:#fff; display:flex; flex-direction:column;
    align-items:center; justify-content:center; text-align:center; font:800 26px/1.04 var(--font-head); letter-spacing:0; text-transform:uppercase;
    border:5px solid #fff; box-shadow:0 0 0 3px var(--green), 0 12px 28px rgba(40,60,20,0.32); }
  .c5-stamp::before { content:''; position:absolute; inset:6px; border-radius:50%; border:2px dashed rgba(255,255,255,0.6); }
  .c5-stamp svg { width:32px; height:32px; margin-bottom:3px; }
  .c5-msg { position:absolute; display:flex; align-items:center; gap:24px; white-space:nowrap; }
  .c5-msg .rule { width:10px; height:72px; border-radius:5px; background:var(--green); }
  .c5-msg .t { font:700 46px/1.1 var(--font-head); color:var(--ink); }
  .c5-tag { display:flex; align-items:center; gap:22px; background:#fff; border-radius:22px; padding:16px 34px 16px 16px; box-shadow:var(--shadow-soft); border:2px solid var(--green-light); }
  .c5-tag .ib { width:74px; height:74px; border-radius:18px; background:var(--green); color:#fff; display:grid; place-items:center; flex:0 0 auto; }
  .c5-tag .ib svg { width:48px; height:48px; stroke-width:3; }
  .c5-tag .k { font:700 26px/1 var(--font-body); letter-spacing:4px; text-transform:uppercase; color:var(--green); }
  .c5-tag .v { font:700 36px/1.15 var(--font-head); color:var(--ink); margin-top:8px; white-space:nowrap; }
  .c5-note { display:flex; align-items:center; gap:26px; background:#fff; border-radius:24px; padding:20px 44px 20px 20px; box-shadow:var(--shadow); border:1px solid #e6e9e1; }
  .c5-note .ib { width:78px; height:78px; border-radius:50%; background:var(--green-pale); color:var(--green-dark); display:grid; place-items:center; flex:0 0 auto; }
  .c5-note .ib svg { width:44px; height:44px; }
  .c5-note .t { font:600 38px/1.2 var(--font-body); color:var(--ink); white-space:nowrap; }

  .c5-bwrap { position:absolute; }
  .c5-frame { position:absolute; inset:0; border:6px solid var(--olive); border-radius:24px; overflow:hidden; box-shadow:var(--shadow); background:#ddd; }
  .c5-frame img { display:block; width:100%; height:100%; object-fit:cover; }
  .c5-bbadge { position:absolute; left:-24px; top:-24px; width:84px; height:84px; border-radius:50%; background:var(--olive); color:#fff; display:grid; place-items:center;
    font:800 46px/1 var(--font-head); border:5px solid #fff; box-shadow:0 8px 20px rgba(40,60,20,0.25); padding-top:2px; }
  .c5-dir { display:flex; align-items:center; gap:28px; background:#fff; border-radius:999px; padding:14px 44px 14px 30px; box-shadow:var(--shadow-soft); font:700 44px/1 var(--font-head); }
  .c5-dir svg { overflow:visible; }
  .c5-banner { position:relative; min-width:1180px; height:124px; display:grid; place-items:center; background:#fff; border-radius:999px; padding:0 70px;
    box-shadow:0 22px 60px rgba(40,60,20,0.28), 0 4px 12px rgba(40,60,20,0.12); border:3px solid var(--line); font:700 56px/1 var(--font-head); color:var(--ink); white-space:nowrap; }
  .c5-banner svg.c5-strike { position:absolute; left:0; top:0; overflow:visible; }
  .c5-xb { position:absolute; right:-40px; top:50%; margin-top:-56px; width:112px; height:112px; border-radius:50%; background:var(--red); color:#fff; display:grid; place-items:center;
    border:6px solid #fff; box-shadow:0 10px 26px rgba(120,30,10,0.3); }
  .c5-xb svg { width:62px; height:62px; stroke-width:3.4; }

  .c5-sheet { position:absolute; background:#fff; border-radius:26px; box-shadow:var(--shadow); border:1px solid #e6e9e1; padding:56px 70px 56px 56px; display:flex; flex-direction:column; gap:50px; }
  .c5-sheet .row { display:flex; align-items:center; gap:44px; }
  .c5-sheet .tile { flex:0 0 auto; width:120px; height:120px; border-radius:26px; background:var(--olive); color:#fff; display:grid; place-items:center; font:800 70px/1 var(--font-head); padding-top:4px; }
  .c5-sheet .bd { flex:1; }
  .c5-sheet .lab { font:700 30px/1 var(--font-body); color:var(--green); }
  .c5-sheet .ln { position:relative; margin-top:12px; height:78px; border-bottom:3px solid var(--line); }
  .c5-sheet .wr { position:absolute; left:4px; bottom:10px; display:inline-block; }
  .c5-sheet .wr .txt { display:block; overflow:hidden; white-space:nowrap; max-width:0; font:italic 500 44px/1.25 var(--font-body); color:var(--ink); }
  .c5-sheet .wr .pen { position:absolute; left:100%; bottom:6px; margin-left:2px; width:64px; height:64px; color:var(--green-dark); }
  .c5-sheet .wr .pen svg { width:64px; height:64px; }
  .c5-nb { position:absolute; width:110px; height:110px; border-radius:50%; background:var(--green); color:#fff; display:grid; place-items:center; border:6px solid #fff; box-shadow:var(--shadow-soft); }
  .c5-nb svg { width:56px; height:56px; }
  `;

  // ---------------------------------------------------------------- shared helpers
  const addCss = stage => stage.appendChild(K.el('style', null, CSS));
  const div = (parent, cls, html) => { const n = K.el('div', cls, html); parent.appendChild(n); return n; };
  /** a time a fraction of the way through beat i's narration */
  const frac = (cue, end) => (i, f) => cue(i) + (end(i) - cue(i)) * f;
  /** horizontally centered row container at (x, y) with width w */
  const rowC = (parent, x, y, w) => { const r = div(parent, 'c5-rowc'); K.place(r, { x, y, w }); return r; };

  // ABC strip (deck slides 7 to 8), same geometry in s02 and s03
  const STRIP = { x: 140, y: 130, w: 1640 };
  const COL_X = [0, 1, 2].map(i => STRIP.x + i * 570);      // left edge of each column (colW 500, gap 70)
  const COL_CX = COL_X.map(x => x + 250);                    // column centers
  function strip(stage, label, panels, captions) {
    const wrap = div(stage, 'c5-strip');
    const S = K.abc(wrap, Object.assign({}, STRIP, { label, panels: panels.map(p => p), captions }));
    S.wrap = wrap;
    return S;
  }
  /** panel fill: border turns olive, the illustration wipes in with a gentle settle */
  function fillPanel(tl, panel, img, t) {
    tl.to(panel, { borderColor: OLIVE, duration: 0.5, ease: 'power2.out' }, t);
    tl.fromTo(img, { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'power2.inOut' }, t);
    tl.fromTo(img, { scale: 1.12 }, { scale: 1, duration: 1.8, ease: 'power2.out' }, t);
  }
  function stamp(parent, x, y) {
    const s = div(parent, 'c5-stamp');
    s.appendChild(K.icon('check', { stroke: 3.4 }));
    s.appendChild(K.el('span', null, 'It<br>worked'));
    K.place(s, { x, y });
    return s;
  }
  function stampIn(tl, s, t) {
    tl.fromTo(s, { opacity: 0, scale: 1.9, rotation: -24 }, { opacity: 1, scale: 1, rotation: -10, duration: 0.42, ease: 'power4.in' }, t);
    tl.to(s, { scale: 1.06, duration: 0.12, ease: 'power2.out', yoyo: true, repeat: 1 }, t + 0.42);
  }
  function msg(parent, html, x, y) {
    const m = div(parent, 'c5-msg');
    K.place(m, { x, y });
    div(m, 'rule');
    div(m, 't', K.md(html));
    return m;
  }
  function fnTag(parent, icon, value, cx, y) {
    const r = rowC(parent, cx - 300, y, 600);
    const t = div(r, 'c5-tag');
    div(t, 'ib').appendChild(K.icon(icon, { stroke: 3 }));
    const tx = div(t, 'tx');
    div(tx, 'k', 'Function');
    div(tx, 'v', value);
    return t;
  }

  // ================================================================ s01: What's the function?
  registerScene('ch05s01', ({ stage, tl, cue, end }) => {
    addCss(stage);
    const at = frac(cue, end);

    // --- hero: target + title (beat 0), centered, later becomes the header
    const hero = div(stage, 'c5-hero');
    const tg = K.svgEl('svg', { viewBox: '0 0 160 160', width: 150, height: 150 }, hero);
    const disc = K.circle(tg, 80, 80, 76, { fill: '#e8f1dc' });
    const r1 = K.circle(tg, 80, 80, 58, { fill: 'none', stroke: GREEN, 'stroke-width': 9 });
    const r2 = K.circle(tg, 80, 80, 35, { fill: 'none', stroke: GREEN, 'stroke-width': 9 });
    const bull = K.circle(tg, 80, 80, 13, { fill: GREEN_DARK });
    const dart = K.group(tg);
    K.path(dart, 'M84 76 L134 26', { stroke: GREEN_DARK, 'stroke-width': 7 });
    K.path(dart, 'M124 36 L124 18 M124 36 L142 36 M134 26 L134 8 M134 26 L152 26', { stroke: GREEN_DARK, 'stroke-width': 6 });
    const tb = div(hero, 'c5-tb');
    const title = div(tb, 'h-title', 'What’s the function?');
    const bar = div(tb, 'accent-bar');

    const c0 = cue(0);
    gsap.set(hero, { y: 120 });
    tl.fromTo(disc, { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.7, ease: 'back.out(1.6)' }, c0);
    A.draw(tl, [r1, r2], c0 + 0.15, 0.8, { stagger: 0.15 });
    tl.fromTo(bull, { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.4, ease: 'back.out(2)' }, c0 + 0.55);
    const split = new SplitText(title, { type: 'words,chars' });
    tl.fromTo(split.chars, { opacity: 0, y: 34 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.035, ease: 'power3.out' }, c0 + 0.25);
    A.in(tl, bar, c0 + 1.0, 'grow', { dur: 0.6 });
    tl.fromTo(dart, { x: 60, y: -60, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 0.45, ease: 'power4.in' }, c0 + 1.2);
    tl.to(tg, { scale: 1.07, duration: 0.14, ease: 'power2.out', yoyo: true, repeat: 1 }, c0 + 1.65);

    // --- beat 1: reinforcement card under the heading
    const c1 = cue(1);
    tl.to(hero, { y: 0, duration: 0.9, ease: 'power3.inOut' }, c1 - 0.1);
    const rr = rowC(stage, 0, 562, 1920);
    const card = div(rr, 'c5-reinf');
    const ibs = div(card, 'ibs');
    const up = div(ibs, 'ib solid');
    const upI = K.icon('arrow-up', { stroke: 2.8 });
    up.appendChild(upI);
    const rp = div(ibs, 'ib pale');
    const rpI = K.icon('repeat', { stroke: 2.4 });
    rp.appendChild(rpI);
    const tx = div(card, 'tx');
    const word = div(tx, 'word', 'Reinforcement:');
    const def = div(tx, 'def', 'more likely next time');
    A.in(tl, card, c1 + 0.15, 'fadeUp', { dur: 0.7 });
    A.in(tl, [up, rp], c1 + 0.4, 'pop', { stagger: 0.15, dur: 0.6 });
    tl.to(upI, { y: -9, duration: 0.3, ease: 'power2.out', yoyo: true, repeat: 1 }, c1 + 1.1);
    tl.fromTo(rpI, { rotation: 0 }, { rotation: 360, duration: 1.1, ease: 'power2.inOut' }, c1 + 1.3);
    const ws = new SplitText(word, { type: 'chars' });
    tl.fromTo(ws.chars, { opacity: 0 }, { opacity: 1, duration: 0.02, stagger: 0.065, ease: 'none' }, c1 + 0.55);
    A.in(tl, def, at(1, 0.5), 'fadeUp', { dur: 0.7 });

    // --- beat 2: heading becomes the header, the A, B, C frame drops in
    const c2 = cue(2);
    A.out(tl, card, c2 - 0.3, 'fadeDown', { dur: 0.45 });
    tl.to(hero, { y: -220, scale: 0.72, transformOrigin: '50% 0%', duration: 1.0, ease: 'power3.inOut' }, c2 - 0.2);
    const cr = rowC(stage, 0, 252, 1920);
    const chip = div(cr, 'chip pale c5-chip');
    chip.appendChild(K.icon('list-checks'));
    chip.appendChild(K.el('span', null, 'The A, B, C'));
    A.in(tl, chip, c2 + 0.5, 'fadeUp', { dur: 0.6 });

    const CX = [390, 960, 1530];
    const letters = ['A', 'B', 'C'];
    const words = ['Antecedent', 'Behavior', 'Consequence'];
    const descs = ['right before', 'what they did', 'right after'];
    const cols = CX.map((cx, i) => {
      const col = div(stage, 'c5-col');
      K.place(col, { x: cx - 240, y: 362, w: 480 });
      const d = div(col, 'c5-disc', letters[i]);
      const w = div(col, 'c5-word', words[i]);
      const s = div(col, 'c5-desc', descs[i]);
      return { d, w, s };
    });
    cols.forEach((c, i) => tl.fromTo(c.d, { opacity: 0, y: -80 }, { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.5)' }, c2 + 0.55 + i * 0.15));

    const sv = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const arrows = [[526, 824], [1096, 1394]].map(([x1, x2]) => {
      const y = 462;
      const l = K.line(sv, x1, y, x2, y, { stroke: GREEN, 'stroke-width': 8 });
      const h = K.path(sv, `M${x2 - 22} ${y - 20} L${x2} ${y} L${x2 - 22} ${y + 20}`, { stroke: GREEN, 'stroke-width': 8 });
      return { l, h };
    });
    arrows.forEach((a, i) => {
      A.draw(tl, a.l, c2 + 0.85 + i * 0.15, 0.4);
      A.draw(tl, a.h, c2 + 1.2 + i * 0.15, 0.2);
    });
    A.in(tl, [cols[0].w, cols[0].s], at(2, 0.40), 'fadeUp', { stagger: 0.12 });
    A.in(tl, [cols[1].w, cols[1].s], at(2, 0.70), 'fadeUp', { stagger: 0.12 });

    // --- beat 3: consequence label, C glows, loop from C back to B
    const c3 = cue(3);
    A.in(tl, [cols[2].w, cols[2].s], c3 + 0.05, 'fadeUp', { stagger: 0.12 });
    const glowT = at(3, 0.34);
    const halos = [0, 1].map(() => { const h = div(stage, 'c5-halo'); K.place(h, { x: 1530 - 100, y: 362 }); return h; });
    halos.forEach((h, k) => {
      tl.set(h, { opacity: 0.85, scale: 1 }, glowT + k * 0.45);
      tl.to(h, { opacity: 0, scale: 1.55, duration: 1.3, ease: 'power2.out' }, glowT + k * 0.45);
    });
    tl.to(cols[2].d, {
      backgroundColor: GREEN, borderColor: GREEN, color: '#fff',
      boxShadow: '0 0 0 18px rgba(97,149,55,0.22), 0 14px 44px rgba(97,149,55,0.5)', duration: 0.6, ease: 'power2.out',
    }, glowT);
    A.pulse(tl, cols[2].d, glowT, { scale: 1.08 });

    const loopT = at(3, 0.45);
    const loop = K.path(sv, 'M1530 717 C1530 892 960 892 960 732', { stroke: GREEN, 'stroke-width': 8 });
    const loopHead = K.path(sv, 'M940 752 L960 728 L980 752', { stroke: GREEN, 'stroke-width': 8 });
    A.draw(tl, loop, loopT, 1.2, { ease: 'power2.inOut' });
    A.draw(tl, loopHead, loopT + 1.15, 0.25);
    const lr = rowC(stage, 945, 820, 600);
    const lchip = div(lr, 'chip green c5-chip');
    lchip.appendChild(K.icon('repeat'));
    lchip.appendChild(K.el('span', null, 'C decides what comes back'));
    A.in(tl, lchip, loopT + 0.55, 'pop', { dur: 0.6 });
  });

  // ================================================================ s02: An excited greeting
  registerScene('ch05s02', ({ stage, tl, cue, end }) => {
    addCss(stage);
    const at = frac(cue, end);
    const S = strip(stage, 'An excited greeting',
      ['abc_greet_a.jpg', 'abc_greet_b.jpg', 'abc_greet_c.jpg'],
      ['A person appears outside<br>the window.', 'Jumping at the window<br>and barking.', 'The person comes inside.<br>The dog gets attention.']);
    S.cols.forEach(c => (c.panel.style.borderColor = LIGHT_BORDER));

    // empty frame settles in just ahead of the first beat
    const t0 = Math.max(0.05, cue(0) - 0.3);
    A.in(tl, S.cols.map(c => c.head), t0, 'fadeDown', { stagger: 0.08, dur: 0.6 });
    A.in(tl, S.cols.map(c => c.panel), t0 + 0.05, 'fade', { stagger: 0.08, dur: 0.6 });
    A.in(tl, S.arrows, t0 + 0.25, 'fade', { stagger: 0.08, dur: 0.5 });
    A.in(tl, S.label, cue(0), 'fadeRight', { dur: 0.7 });

    const fillT = [cue(0) + 0.3, cue(1), cue(2)];
    S.cols.forEach((c, i) => {
      fillPanel(tl, c.panel, c.img, fillT[i]);
      A.in(tl, c.cap, fillT[i] + 0.35, 'fadeUp', { dur: 0.6 });
    });

    // beat 2: it worked
    const st = stamp(S.wrap, 1660, 225);
    stampIn(tl, st, at(2, 0.48));
    const m1 = msg(S.wrap, '*Barking* opened the door', 140, 786);
    A.in(tl, m1, at(2, 0.56), 'fadeRight', { dur: 0.7 });

    // beat 3: function tag, positive means added
    const tg = fnTag(S.wrap, 'plus', 'Bring them closer', COL_CX[2], 772);
    A.in(tl, tg, cue(3) + 0.1, 'fadeUp', { dur: 0.7 });
    const m2 = msg(S.wrap, '*Positive* means added', 140, 786);
    A.out(tl, m1, at(3, 0.46), 'fadeUp', { dur: 0.4 });
    A.in(tl, m2, at(3, 0.46) + 0.3, 'fadeUp', { dur: 0.7 });

    // beat 4: strip steps back, reflective note slides up
    const c4 = cue(4);
    A.out(tl, m2, c4 - 0.1, 'fade', { dur: 0.4 });
    tl.to(S.wrap, { scale: 0.88, transformOrigin: '960px 130px', duration: 0.9, ease: 'power3.inOut' }, c4);
    const nr = rowC(stage, 0, 824, 1920);
    const note = div(nr, 'c5-note');
    div(note, 'ib').appendChild(K.icon('house'));
    div(note, 't', 'Has this happened at your house?');
    tl.fromTo(note, { opacity: 0, y: 90 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, c4 + 0.35);
  });

  // ================================================================ s03: A person approaches
  registerScene('ch05s03', ({ stage, tl, cue, end }) => {
    addCss(stage);
    const at = frac(cue, end);
    const S = strip(stage, 'An excited greeting',
      ['abc_greet_a.jpg', 'abc_greet_b.jpg', 'abc_greet_c.jpg'],
      ['A person appears outside<br>the window.', 'Jumping at the window<br>and barking.', 'The person comes inside.<br>The dog gets attention.']);
    const newCaps = ['A person approaches.', 'The dog stands in front of<br>the owner and barks.', 'The person goes away.'];
    const newImgs = ['abc_approach_a.jpg', 'abc_approach_b.jpg', 'abc_approach_c.jpg'];
    const oldSp = [], newSp = [], overs = [];
    S.cols.forEach((c, i) => {
      const old = c.cap.innerHTML;
      c.cap.innerHTML = '';
      const o = K.el('span', 'c5-cs', old), n = K.el('span', 'c5-cs', newCaps[i]);
      c.cap.append(o, n);
      gsap.set(n, { opacity: 0 });
      oldSp.push(o); newSp.push(n);
      const im = K.el('img', 'c5-over');
      im.src = '../assets/img/' + newImgs[i];
      c.panel.appendChild(im);
      overs.push(im);
    });
    const lab2 = K.el('div', 'abc-label', 'A person approaches');
    K.place(lab2, { x: STRIP.x, y: STRIP.y });
    S.wrap.appendChild(lab2);

    // the greeting strip is back for a moment, then clears
    A.in(tl, S.wrap, 0, 'fade', { dur: 0.35 });
    const c0 = cue(0);
    A.out(tl, S.label, c0 - 0.2, 'fade', { dur: 0.35 });
    A.in(tl, lab2, c0 + 0.1, 'fadeRight', { dur: 0.7 });
    [1, 2].forEach(i => {
      const t = c0 - 0.2 + (i - 1) * 0.1;
      tl.fromTo(S.cols[i].img, { clipPath: 'inset(0% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 100%)', duration: 0.7, ease: 'power2.inOut', immediateRender: false }, t);
      tl.to(S.cols[i].panel, { borderColor: LIGHT_BORDER, duration: 0.5, ease: 'power2.out' }, t);
      A.out(tl, S.cols[i].cap, t, 'fade', { dur: 0.35 });
    });
    tl.set([oldSp[1], oldSp[2]], { opacity: 0 }, c0 + 0.5);
    tl.set([newSp[1], newSp[2]], { opacity: 1 }, c0 + 0.5);

    // beat 0: panel A wipes over to the new example
    tl.fromTo(overs[0], { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'power2.inOut' }, c0 + 0.3);
    tl.fromTo(overs[0], { scale: 1.12 }, { scale: 1, duration: 1.8, ease: 'power2.out' }, c0 + 0.3);
    tl.to(oldSp[0], { opacity: 0, duration: 0.3, ease: 'power2.in' }, c0 + 0.35);
    tl.to(newSp[0], { opacity: 1, duration: 0.5, ease: 'power2.out' }, c0 + 0.6);

    // beats 1 and 2: B and C fill
    [[1, cue(1)], [2, cue(2)]].forEach(([i, t]) => {
      fillPanel(tl, S.cols[i].panel, overs[i], t);
      tl.to(S.cols[i].cap, { opacity: 1, duration: 0.6, ease: 'power2.out' }, t + 0.35);
    });

    const m1 = msg(S.wrap, '*Barking* made them leave', 140, 786);
    A.in(tl, m1, at(2, 0.44), 'fadeRight', { dur: 0.7 });
    const st = stamp(S.wrap, 1660, 225);
    stampIn(tl, st, at(2, 0.8));

    // beat 3: function tag, negative means removed
    const tg = fnTag(S.wrap, 'minus', 'Make them leave', COL_CX[2], 772);
    A.in(tl, tg, cue(3) + 0.1, 'fadeUp', { dur: 0.7 });
    const m2 = msg(S.wrap, '*Negative* means removed', 140, 786);
    A.out(tl, m1, at(3, 0.5), 'fadeUp', { dur: 0.4 });
    A.in(tl, m2, at(3, 0.5) + 0.3, 'fadeUp', { dur: 0.7 });
  });

  // ================================================================ s04: Same behavior, different job
  registerScene('ch05s04', ({ stage, tl, cue, end, dur }) => {
    addCss(stage);
    const at = frac(cue, end);

    // headings: one bar, three titles that swap in place
    const h1 = K.heading(stage, 'Same behavior, opposite jobs', { x: 100, y: 120 });
    const h2 = K.heading(stage, 'Name the A, B and C', { x: 100, y: 120, bar: false });
    const h3 = K.heading(stage, 'Write down one A, B, C', { x: 100, y: 120, bar: false });

    // --- beat 0: the two B panels meet in the middle
    const c0 = cue(0);
    A.in(tl, h1.all, c0, 'fadeUp', { stagger: 0.12 });
    const W = 700, H = 414, Y = 296;
    const mk = (src, x) => {
      const w = div(stage, 'c5-bwrap');
      K.place(w, { x, y: Y, w: W, h: H });
      const f = div(w, 'c5-frame');
      const im = K.el('img');
      im.src = '../assets/img/' + src;
      f.appendChild(im);
      div(w, 'c5-bbadge', 'B');
      return { w, im };
    };
    const L = mk('abc_greet_b.jpg', 230), R = mk('abc_approach_b.jpg', 990);
    tl.fromTo(L.w, { opacity: 0, x: -260 }, { opacity: 1, x: 0, duration: 1.0, ease: 'power3.out' }, c0 + 0.3);
    tl.fromTo(R.w, { opacity: 0, x: 260 }, { opacity: 1, x: 0, duration: 1.0, ease: 'power3.out' }, c0 + 0.3);
    A.kenburns(tl, L.im, { from: 1.02, to: 1.08, t0: c0 + 0.3, t1: cue(2) });
    A.kenburns(tl, R.im, { from: 1.02, to: 1.08, t0: c0 + 0.3, t1: cue(2) });

    const dirPill = (cx, label, color, inward) => {
      const r = rowC(stage, cx - 300, 752, 600);
      const p = div(r, 'c5-dir');
      p.style.color = color;
      const s = K.svgEl('svg', { viewBox: '0 0 140 48', width: 140, height: 48 }, p);
      const a = { stroke: color, 'stroke-width': 6 };
      const left = K.group(s), right = K.group(s);
      K.circle(s, 70, 24, 8, { fill: color });
      if (inward) {
        K.path(left, 'M4 24 H48 M36 12 L48 24 L36 36', a);
        K.path(right, 'M136 24 H92 M104 12 L92 24 L104 36', a);
      } else {
        K.path(left, 'M52 24 H8 M20 12 L8 24 L20 36', a);
        K.path(right, 'M88 24 H132 M120 12 L132 24 L120 36', a);
      }
      p.appendChild(K.el('span', null, label));
      return { p, left, right };
    };
    const closer = dirPill(230 + W / 2, 'Closer', GREEN_DARK, true);
    const gone = dirPill(990 + W / 2, 'Gone', '#b86f14', false);
    const tC = at(0, 0.6), tG = at(0, 0.8);
    A.in(tl, closer.p, tC, 'fadeUp', { dur: 0.7 });
    tl.fromTo(closer.left, { x: -10 }, { x: 3, duration: 0.5, ease: 'power2.inOut', yoyo: true, repeat: 3 }, tC + 0.3);
    tl.fromTo(closer.right, { x: 10 }, { x: -3, duration: 0.5, ease: 'power2.inOut', yoyo: true, repeat: 3 }, tC + 0.3);
    A.in(tl, gone.p, tG, 'fadeUp', { dur: 0.7 });
    tl.fromTo(gone.left, { x: 3 }, { x: -10, duration: 0.5, ease: 'power2.inOut', yoyo: true, repeat: 3 }, tG + 0.3);
    tl.fromTo(gone.right, { x: -3 }, { x: 10, duration: 0.5, ease: 'power2.inOut', yoyo: true, repeat: 3 }, tG + 0.3);

    // --- beat 1: "Just stop the barking" across both, crossed out
    const c1 = cue(1);
    const br = rowC(stage, 0, 442, 1920);
    const banner = div(br, 'c5-banner', 'Just stop the barking');
    tl.fromTo(banner, { opacity: 0, scaleX: 0.2 }, { opacity: 1, scaleX: 1, duration: 0.8, ease: 'power3.out' }, c1 + 0.1);
    const ss = K.svgEl('svg', { viewBox: '0 0 1180 124', width: 1180, height: 124, class: 'c5-strike' }, banner);
    const strike = K.path(ss, 'M150 64 L1030 60', { stroke: '#b8452d', 'stroke-width': 10 });
    const xb = div(banner, 'c5-xb');
    xb.appendChild(K.icon('x', { stroke: 3.4 }));
    const tX = at(1, 0.55);
    A.draw(tl, strike, tX, 0.55, { ease: 'power2.in' });
    A.in(tl, xb, tX + 0.45, 'pop', { dur: 0.55 });
    A.set(tl, banner, tX + 0.5, { color: '#8a8a8a' }, 0.4);

    // --- beat 2: the images clear, a blank worksheet slides up
    const c2 = cue(2);
    A.out(tl, [L.w, R.w, closer.p, gone.p, banner], c2 - 0.2, 'fadeDown', { dur: 0.45 });
    A.out(tl, h1.title, c2 - 0.15, 'fadeUp', { dur: 0.4 });
    A.in(tl, h2.title, c2 + 0.3, 'fadeUp', { dur: 0.7 });

    const sheet = div(stage, 'c5-sheet');
    K.place(sheet, { x: 260, y: 300, w: 1400 });
    const rows = [
      ['A', 'Antecedent', 'Mail carrier walks up the steps'],
      ['B', 'Behavior', 'Barks and jumps at the door'],
      ['C', 'Consequence', 'Mail carrier leaves'],
    ].map(([l, lab, txt]) => {
      const r = div(sheet, 'row');
      const tile = div(r, 'tile', l);
      const bd = div(r, 'bd');
      div(bd, 'lab', lab);
      const ln = div(bd, 'ln');
      const wr = div(ln, 'wr');
      const t = div(wr, 'txt', txt);
      const pen = div(wr, 'pen');
      pen.appendChild(K.icon('pencil', { stroke: 2.2 }));
      return { tile, t, pen };
    });
    const nb = div(stage, 'c5-nb');
    K.place(nb, { x: 1605, y: 250 });
    nb.appendChild(K.icon('notebook-pen', { stroke: 2.2 }));
    tl.fromTo(sheet, { opacity: 0, y: 140 }, { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' }, c2 + 0.35);
    A.in(tl, rows.map(r => r.tile), c2 + 0.9, 'pop', { stagger: 0.15, dur: 0.55 });
    A.in(tl, nb, c2 + 1.2, 'pop', { dur: 0.6 });

    // --- beat 3: the pencil writes a sample line into each row
    const c3 = cue(3);
    A.out(tl, h2.title, c3 - 0.15, 'fadeUp', { dur: 0.4 });
    A.in(tl, h3.title, c3 + 0.3, 'fadeUp', { dur: 0.7 });
    // spacing adapts to the beat length so all three lines finish before the scene ends
    const step = Math.min(1.5, Math.max(0.9, (dur - 1.2 - (c3 + 0.6)) / 3));
    const wdur = step * 1.2;
    rows.forEach((r, i) => {
      const t = c3 + 0.6 + i * step;
      tl.fromTo(r.pen, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'none' }, t - 0.2);
      tl.fromTo(r.t, { maxWidth: 0 }, { maxWidth: 1100, duration: wdur, ease: 'none' }, t);
      tl.fromTo(r.pen, { rotation: 0, y: 0 }, { rotation: -10, y: -4, duration: step / 14, ease: 'sine.inOut', yoyo: true, repeat: 7 }, t);
      if (i < rows.length - 1) tl.to(r.pen, { opacity: 0, duration: 0.2, ease: 'none' }, t + step - 0.15);
    });
  });
})();
