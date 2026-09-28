// Part 1, one-chapter version: scenes built by group b.
//   ch01s04  An excited greeting (ABC strip)
//   ch01s05  A person approaches (ABC strip)
//   ch01s06  Guarding a toy (ABC strip)
//   ch01s07  Same behavior, different job (three B panels, 'Just stop the barking' crossed out, A, B, C)
(() => {
  const GREEN_DARK = '#3f6b22', AMBER_DARK = '#b86f14', RED = '#b8452d';

  const CSS = `
  .v4b-strip { position:absolute; left:0; top:0; width:1920px; height:1080px; }
  .v4b-strip .abc-col .panel { background:rgba(255,255,255,0.78); }
  .v4b-rowc { position:absolute; display:flex; justify-content:center; align-items:center; }

  .v4b-stamp { position:absolute; width:152px; height:152px; border-radius:50%; background:var(--green); color:#fff; display:flex; flex-direction:column;
    align-items:center; justify-content:center; text-align:center; font:800 26px/1 var(--font-head); letter-spacing:-0.8px; text-transform:uppercase;
    border:5px solid #fff; box-shadow:0 0 0 3px var(--green), 0 12px 28px rgba(40,60,20,0.32); padding-bottom:2px; }
  .v4b-stamp::before { content:''; position:absolute; inset:4px; border-radius:50%; border:2px dashed rgba(255,255,255,0.55); }
  .v4b-stamp svg { width:24px; height:24px; margin-bottom:2px; }

  .v4b-tag { display:flex; align-items:center; gap:26px; background:#fff; border-radius:24px; padding:14px 44px 14px 14px; box-shadow:var(--shadow-soft); border:2px solid var(--green-light); }
  .v4b-tag .ib { width:78px; height:78px; border-radius:18px; background:var(--green); color:#fff; display:grid; place-items:center; flex:0 0 auto; }
  .v4b-tag .ib svg { overflow:visible; }
  .v4b-tag .ib svg.lu { width:46px; height:46px; }
  .v4b-tag .v { font:600 40px/1.1 var(--font-head); color:var(--ink); white-space:nowrap; }
  .v4b-tag .v b { font-weight:700; color:var(--green-dark); margin-right:14px; }

  .v4b-bwrap { position:absolute; }
  .v4b-frame { position:absolute; inset:0; border:6px solid var(--olive); border-radius:24px; overflow:hidden; box-shadow:var(--shadow); background:#ddd; }
  .v4b-frame img { display:block; width:100%; height:100%; object-fit:cover; }
  .v4b-bbadge { position:absolute; left:-22px; top:-22px; width:80px; height:80px; border-radius:50%; background:var(--olive); color:#fff; display:grid; place-items:center;
    font:800 44px/1 var(--font-head); border:5px solid #fff; box-shadow:0 8px 20px rgba(40,60,20,0.25); padding-top:2px; }
  .v4b-dir { display:flex; align-items:center; gap:24px; background:#fff; border-radius:999px; padding:14px 42px 14px 28px; box-shadow:var(--shadow-soft); font:700 44px/1 var(--font-head); white-space:nowrap; }
  .v4b-dir svg { overflow:visible; flex:0 0 auto; }
  .v4b-dir svg.lu { width:50px; height:50px; }

  .v4b-banner { position:relative; width:1360px; height:124px; display:grid; place-items:center; background:#fff; border-radius:999px;
    box-shadow:0 22px 60px rgba(40,60,20,0.28), 0 4px 12px rgba(40,60,20,0.12); border:3px solid var(--line); font:700 58px/1 var(--font-head); color:var(--ink); white-space:nowrap; }
  .v4b-banner .bt { position:relative; display:inline-block; }
  .v4b-strike { position:absolute; left:-26px; right:-26px; top:50%; height:10px; margin-top:1px; border-radius:5px; background:var(--red); }
  .v4b-xb { position:absolute; right:-36px; top:50%; margin-top:-58px; width:116px; height:116px; border-radius:50%; background:var(--red); color:#fff; display:grid; place-items:center;
    border:6px solid #fff; box-shadow:0 10px 26px rgba(120,30,10,0.3); }
  .v4b-xb svg { width:64px; height:64px; }

  .v4b-abc { position:absolute; left:0; width:1920px; display:flex; flex-direction:column; align-items:center; text-align:center; }
  .v4b-abc .pre { font:700 56px/1 var(--font-head); color:var(--ink); }
  .v4b-abc .big { display:flex; gap:0; margin-top:18px; font:800 220px/1 var(--font-head); color:var(--green); letter-spacing:4px;
    text-shadow:0 0 40px rgba(255,255,255,0.95), 0 0 16px rgba(255,255,255,0.95), 0 8px 30px rgba(40,60,20,0.18); }
  .v4b-abc .big span { display:inline-block; white-space:pre; }
  `;

  // ---------------------------------------------------------------- shared helpers
  const addCss = stage => stage.appendChild(K.el('style', null, CSS));
  const div = (parent, cls, html) => { const n = K.el('div', cls, html); parent.appendChild(n); return n; };
  /** horizontally centered row container at (x, y) with width w */
  const rowC = (parent, x, y, w) => { const r = div(parent, 'v4b-rowc'); K.place(r, { x, y, w }); return r; };

  // ABC strip (deck slides 7 and 8), the same geometry in ch01s04, s05 and s06 (panels 500 px wide)
  const STRIP = { x: 140, y: 130, w: 1640 };
  // 'It worked' stamp over panel C's top-right corner, clear of the 'Consequence' label and the logo
  const STAMP = { x: 1666, y: 209 };
  const TAG_Y = 782;

  function strip(stage, label, panels, captions) {
    const wrap = div(stage, 'v4b-strip');
    const S = K.abc(wrap, Object.assign({}, STRIP, { label, panels, captions }));
    S.wrap = wrap;
    return S;
  }
  /** empty frames settle in just ahead of beat 0, the title tab slides in, then A, B, C fill at fillT[0..2] */
  function stripIntro(tl, S, cue, fillT) {
    const t0 = Math.max(0.05, cue(0) - 0.3);
    A.in(tl, S.cols.map(c => c.head), t0, 'fadeDown', { stagger: 0.08, dur: 0.6 });
    A.in(tl, S.cols.map(c => c.panel), t0 + 0.05, 'fade', { stagger: 0.08, dur: 0.6 });
    A.in(tl, S.arrows, t0 + 0.25, 'fade', { stagger: 0.08, dur: 0.5 });
    A.in(tl, S.label, cue(0), 'fadeRight', { dur: 0.7 });
    S.cols.forEach((c, i) => {
      fillPanel(tl, c.img, fillT[i]);
      A.in(tl, c.cap, fillT[i] + 0.35, 'fadeUp', { dur: 0.6 });
    });
  }
  /** panel fill: the illustration wipes in with a gentle settle */
  function fillPanel(tl, img, t) {
    tl.fromTo(img, { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'power2.inOut' }, t);
    tl.fromTo(img, { scale: 1.12 }, { scale: 1, duration: 1.8, ease: 'power2.out' }, t);
  }
  function stamp(parent, x, y) {
    const s = div(parent, 'v4b-stamp');
    s.appendChild(K.icon('check', { stroke: 3.4 }));
    s.appendChild(K.el('span', null, 'It<br>worked'));
    K.place(s, { x, y });
    return s;
  }
  function stampIn(tl, s, t) {
    tl.fromTo(s, { opacity: 0, scale: 1.9, rotation: -24 }, { opacity: 1, scale: 1, rotation: -10, duration: 0.42, ease: 'power4.in' }, t);
    tl.to(s, { scale: 1.06, duration: 0.12, ease: 'power2.out', yoyo: true, repeat: 1 }, t + 0.42);
  }
  /** two arrows around a dot: pointing in (closer) or out (distance). Returns {svg, left, right, dir} */
  function arrows(parent, inward, color, w = 140) {
    const s = K.svgEl('svg', { viewBox: '0 0 140 48', width: w, height: Math.round(w * 48 / 140) }, parent);
    const a = { stroke: color, 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
    const left = K.group(s), right = K.group(s);
    K.circle(s, 70, 24, 8, { fill: color, stroke: 'none' });
    if (inward) {
      K.path(left, 'M6 24 H50 M38 12 L50 24 L38 36', a);
      K.path(right, 'M134 24 H90 M102 12 L90 24 L102 36', a);
    } else {
      K.path(left, 'M50 24 H6 M18 12 L6 24 L18 36', a);
      K.path(right, 'M90 24 H134 M122 12 L134 24 L122 36', a);
    }
    return { svg: s, left, right, dir: inward ? 1 : -1 };
  }
  /** arrows breathe in their direction a few times */
  function nudge(tl, ar, t, reps = 3) {
    const v = { duration: 0.45, ease: 'sine.inOut', yoyo: true, repeat: reps };
    tl.fromTo(ar.left, { x: 0 }, Object.assign({ x: 6 * ar.dir }, v), t);
    tl.fromTo(ar.right, { x: 0 }, Object.assign({ x: -6 * ar.dir }, v), t);
  }
  /** function tag centered under the strip: icon tile + 'Possible function: value'.
   *  icon: 'in' / 'out' (arrow pair) or a Lucide name */
  function fnTag(parent, icon, value) {
    const r = rowC(parent, STRIP.x, TAG_Y, STRIP.w);
    const t = div(r, 'v4b-tag');
    const ib = div(t, 'ib');
    let ar = null;
    if (icon === 'in' || icon === 'out') ar = arrows(ib, icon === 'in', '#fff', 60);
    else ib.appendChild(K.icon(icon, { stroke: 2.6, cls: 'lu' }));
    div(t, 'v', '<b>Possible function:</b>' + value);
    return { t, ar };
  }
  function fnTagIn(tl, tag, t) {
    A.in(tl, tag.t, t, 'fadeUp', { dur: 0.7 });
    tl.fromTo(tag.t.querySelector('.ib'), { scale: 0.5 }, { scale: 1, duration: 0.6, ease: 'back.out(2)' }, t + 0.2);
    if (tag.ar) nudge(tl, tag.ar, t + 0.7, 3);
  }

  // Worked-example strip scene (ch01s04 to s06): A on beat 0 (at phraseA), B on 1, C on 2 (+ stamp at phraseStamp), tag on 3
  function exampleScene(ctx, o) {
    const { stage, tl, cue, phrase } = ctx;
    addCss(stage);
    const S = strip(stage, o.label, o.panels, o.captions);
    const tA = Math.max(cue(0) + 0.3, phrase(0, o.phraseA, 0.5) - 0.1);
    stripIntro(tl, S, cue, [tA, cue(1) + 0.05, cue(2) + 0.05]);
    const st = stamp(S.wrap, STAMP.x, STAMP.y);
    stampIn(tl, st, Math.max(cue(2) + 1.0, phrase(2, o.phraseStamp, 0.6)));
    const tag = fnTag(S.wrap, o.icon, o.fn);
    fnTagIn(tl, tag, cue(3) + 0.1);
  }

  // ================================================================ ch01s04: An excited greeting
  registerScene('ch01s04', ctx => exampleScene(ctx, {
    label: 'An excited greeting',
    panels: ['abc_greet_a.jpg', 'abc_greet_b.jpg', 'abc_greet_c.jpg'],
    captions: ['A person appears outside<br>the window', 'Jumping at the window<br>and barking', 'The person comes inside;<br>the dog gets attention'],
    phraseA: 'a person appears outside',
    phraseStamp: 'gives your dog attention',
    icon: 'in',
    fn: 'decrease distance, get attention',
  }));

  // ================================================================ ch01s05: A person approaches
  // (the greeting strip is not re-shown: the scene cut already fades it out; the new strip enters fresh)
  registerScene('ch01s05', ctx => exampleScene(ctx, {
    label: 'A person approaches',
    panels: ['abc_approach_a.jpg', 'abc_approach_b.jpg', 'abc_approach_c.jpg'],
    captions: ['A person approaches', 'The dog stands in front of<br>the owner and barks', 'The person goes away'],
    phraseA: "you're out on a walk",
    phraseStamp: 'or moves away',
    icon: 'out',
    fn: 'increase distance',
  }));

  // ================================================================ ch01s06: Guarding a toy
  registerScene('ch01s06', ctx => exampleScene(ctx, {
    label: 'Guarding a toy',
    panels: ['abc_guard_a.jpg', 'abc_guard_b.jpg', 'abc_guard_c.jpg'],
    captions: ['Another dog approaches<br>a dog with a toy', 'The dog gets up and snaps<br>at the approaching dog', 'The other dog goes away:<br>the dog keeps the toy'],
    phraseA: 'another dog walks over',
    phraseStamp: 'keeps the toy',
    icon: 'shield',
    fn: 'maintain access',
  }));

  // ================================================================ ch01s07: Same behavior, different job
  registerScene('ch01s07', ({ stage, tl, cue, end, dur, phrase }) => {
    addCss(stage);

    const h = K.heading(stage, 'Same behavior, different job', { x: 120, y: 120 });
    A.in(tl, h.all, cue(0), 'fadeUp', { stagger: 0.12 });

    // --- beat 0: three B panels slide in side by side (520 px wide), then a job tag pops under each
    const W = 520, H = 306, GAP = 60, Y = 318;
    const X0 = (1920 - (3 * W + 2 * GAP)) / 2;
    const xs = [0, 1, 2].map(i => X0 + i * (W + GAP));
    const mk = (src, x) => {
      const w = div(stage, 'v4b-bwrap');
      K.place(w, { x, y: Y, w: W, h: H });
      const f = div(w, 'v4b-frame');
      const im = K.el('img');
      im.src = '../assets/img/' + src;
      f.appendChild(im);
      const b = div(w, 'v4b-bbadge', 'B');
      return { w, im, b };
    };
    const P = ['abc_greet_b.jpg', 'abc_approach_b.jpg', 'abc_guard_b.jpg'].map((s, i) => mk(s, xs[i]));
    const tIn = Math.max(cue(0) + 0.6, phrase(0, 'These behaviors can look alike', 0.2) - 0.2);
    P.forEach((p, i) => {
      tl.fromTo(p.w, { opacity: 0, y: 70 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, tIn + i * 0.14);
      A.kenburns(tl, p.im, { from: 1.02, to: 1.08, t0: tIn, t1: cue(2) + 0.5 });
    });

    const TAGY = Y + H + 40;
    const pill = (i, label, color) => {
      const r = rowC(stage, xs[i], TAGY, W);
      const p = div(r, 'v4b-dir');
      p.style.color = color;
      return p;
    };
    const closer = pill(0, 'Closer', GREEN_DARK);
    const arC = arrows(closer, true, GREEN_DARK);
    closer.appendChild(K.el('span', null, 'Closer'));
    const gone = pill(1, 'Gone', AMBER_DARK);
    const arG = arrows(gone, false, AMBER_DARK);
    gone.appendChild(K.el('span', null, 'Gone'));
    const keep = pill(2, 'Keep it', RED);
    const shield = K.icon('shield', { stroke: 2.6, cls: 'lu', color: RED });
    keep.appendChild(shield);
    keep.appendChild(K.el('span', null, 'Keep it'));
    const tags = [closer, gone, keep];

    const tT = [
      phrase(0, 'bring someone closer', 0.55),
      phrase(0, 'make someone leave', 0.75),
      phrase(0, 'keep a toy', 0.92),
    ].map((t, i) => Math.max(tIn + 1.0 + i * 0.6, t - 0.1));
    tags.forEach((p, i) => A.in(tl, p, tT[i], 'pop', { dur: 0.6 }));
    nudge(tl, arC, tT[0] + 0.5);
    nudge(tl, arG, tT[1] + 0.5);
    tl.fromTo(shield, { scale: 1 }, { scale: 1.18, duration: 0.3, ease: 'power2.out', yoyo: true, repeat: 1, transformOrigin: '50% 50%' }, tT[2] + 0.5);

    // --- beat 1: 'Just stop the barking' stretches across the images, then a red strike and X
    const c1 = cue(1);
    const br = rowC(stage, 0, Y + H - 150, 1920);
    const banner = div(br, 'v4b-banner');
    const bt = div(banner, 'bt', 'Just stop the barking');
    tl.fromTo(banner, { opacity: 0, scaleX: 0.2 }, { opacity: 1, scaleX: 1, duration: 0.8, ease: 'power3.out' }, c1 + 0.1);
    const strike = div(bt, 'v4b-strike');
    const xb = div(banner, 'v4b-xb');
    xb.appendChild(K.icon('x', { stroke: 3.4 }));
    const tX = Math.max(c1 + 1.2, phrase(1, "you'd get it wrong", 0.3));
    tl.fromTo(strike, { scaleX: 0, rotation: -0.6, transformOrigin: '0% 50%' }, { scaleX: 1, rotation: -0.6, duration: 0.55, ease: 'power2.in' }, tX);
    A.in(tl, xb, tX + 0.45, 'pop', { dur: 0.55 });
    A.set(tl, banner, tX + 0.5, { color: '#8a8a8a' }, 0.4);

    // --- beat 2: the images dim and 'A, B, C' lands large in green over them
    const c2 = cue(2);
    A.out(tl, br, c2 - 0.1, 'fade', { dur: 0.45 });
    A.dim(tl, [...P.map(p => p.w), ...tags], c2 + 0.1, 0.16, { dur: 0.8 });
    const box = div(stage, 'v4b-abc');
    K.place(box, { x: 0, y: 330 });
    const pre = div(box, 'pre', 'Look at the');
    const big = div(box, 'big');
    const letters = ['A,', ' B,', ' C'].map(s => { const n = K.el('span', null, s); big.appendChild(n); return n; });
    const tL = Math.max(c2 + 0.9, phrase(2, 'The ABC gives us', 0.55) - 0.1);
    A.in(tl, pre, tL, 'fadeUp', { dur: 0.6 });
    tl.fromTo(letters, { opacity: 0, scale: 1.7, y: -20 }, { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.16 }, tL + 0.2);
  });
})();
