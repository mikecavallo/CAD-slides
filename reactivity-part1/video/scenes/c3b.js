// Chapter 3: the three worked examples and "same behavior, different job".
//   ch03s04  An excited greeting   photo ABC strip; question badge; possible function: decrease distance / gain attention
//   ch03s05  A person approaches   same, increase distance
//   ch03s06  Guarding a toy        same, maintain access
//   ch03s07  Same behavior. Different job.   three B photos with the same Bark chip; each gets its C outcome and job
(() => {
  const { sayAt, clamp } = C1;
  const { COL } = C3;
  const C = C1.C;

  // A worked example: o.beatA (index of the beat that shows panel A), captions, cue phrases, function tag
  function example(ctx, o) {
    const { stage, tl, cue, end } = ctx;
    C2.style(stage);
    C3.css(stage);
    const at = (i, p, fb, lead) => sayAt(ctx, i, p, fb, lead);
    C3.head(ctx, o.title, { size: 72 });
    const S = C3.strip(stage, { y: 236, panels: o.panels, captions: o.captions });
    const b = o.beatA;
    S.frames(tl, b === 0 ? 0.2 : cue(0) + 0.2);
    S.show(tl, 0, Math.max(cue(b) + 0.1, at(b, o.pA, 0.1, 0.3)));
    S.show(tl, 1, cue(b + 1) + 0.05);
    S.show(tl, 2, cue(b + 2) + 0.05);
    // the question: over the C panel
    const cx = S.colX(2) + S.colW - 30, cy = S.top + 140;
    const q = C3.qBadge(S.wrap, cx, cy, 104);
    // (only the first example asks the question aloud; the others show the badge as the answer starts)
    const fb = o.noQ ? b + 3 : b + 4;
    A.in(tl, q, cue(b + 3) + 0.05, 'pop', { dur: 0.55 });
    tl.to(S.cols[2].panel, { boxShadow: '0 0 0 8px rgba(217,145,43,0.55)', duration: 0.4 }, cue(b + 3) + 0.2);
    // the possible function
    const tag = C3.fnTag(S.wrap, o.icon, o.fn, 960, 838);
    const tF = clamp(at(fb, o.pF, 0.3, 0.3), cue(fb) + (o.noQ ? 0.9 : 0.1), end(fb) - 1.0);
    tag.show(tl, tF);
    tl.to(S.cols[2].panel, { boxShadow: '0 0 0 0px rgba(217,145,43,0)', duration: 0.4 }, tF);
    tl.to(q, { backgroundColor: C.green, duration: 0.4 }, tF);
    return S;
  }

  registerScene('ch03s04', ctx => example(ctx, {
    title: 'An Excited Greeting', beatA: 0, pA: 'A person appears',
    panels: ['abc_greet_a.jpg', 'abc_greet_b.jpg', 'abc_greet_c.jpg'],
    captions: ['A person appears<br>outside the window', 'The dog jumps at the<br>window and barks', 'The person comes inside<br>and gives attention'],
    icon: 'in', fn: 'Decrease distance / gain attention', pF: 'get closer',
  }));
  registerScene('ch03s05', ctx => example(ctx, {
    title: 'A Person Approaches', beatA: 1, noQ: true, pA: 'a person heads',
    panels: ['abc_approach_a.jpg', 'abc_approach_b.jpg', 'abc_approach_c.jpg'],
    captions: ['A person approaches<br>on a walk', 'The dog stops<br>and barks', 'The person stops<br>or moves away'],
    icon: 'out', fn: 'Increase distance', pF: 'create more distance',
  }));
  registerScene('ch03s06', ctx => example(ctx, {
    title: 'Guarding a Toy', beatA: 0, noQ: true, pA: 'another dog approaches',
    panels: ['abc_guard_a.jpg', 'abc_guard_b.jpg', 'abc_guard_c.jpg'],
    captions: ['Another dog approaches<br>a dog with a toy', 'Stiffens, barks, growls,<br>and may snap', 'The other dog backs away;<br>the dog keeps the toy'],
    icon: 'shield', fn: 'Maintain access', pF: 'keep access',
  }));

  // ================================================================== ch03s07 Same behavior. Different job.
  registerScene('ch03s07', ctx => {
    const { stage, tl, cue, end } = ctx;
    C2.style(stage);
    C3.css(stage);
    const at = (i, p, fb, lead) => sayAt(ctx, i, p, fb, lead);
    C3.head(ctx, 'Same Behavior. Different Job.', { size: 72 });

    const W = 500, H = 280, GAP = 70, X0 = (1920 - 3 * W - 2 * GAP) / 2, Y = 250;
    const xs = [0, 1, 2].map(k => X0 + k * (W + GAP));
    const B = ['abc_greet_b.jpg', 'abc_approach_b.jpg', 'abc_guard_b.jpg'];
    const CC = ['abc_greet_c.jpg', 'abc_approach_c.jpg', 'abc_guard_c.jpg'];
    const JOB = [['in', 'Get closer'], ['out', 'Create distance'], ['shield', 'Keep access']];

    // ---------- beat 0: the three B photos
    const ph = B.map((src, k) => {
      const p = K.photo(stage, src, { x: xs[k], y: Y, w: W, h: H, radius: 24 });
      p.root.style.border = '6px solid ' + C.olive;
      tl.fromTo(p.root, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, cue(0) + 0.1 + k * 0.15);
      return p;
    });

    // ---------- beat 1: the same Bark chip on each
    const barks = xs.map((x, k) => {
      const c = C3.chip(stage, 'volume-2', 'Bark', x + W / 2, Y + H - 34, { col: COL.B, center: true, size: 34 });
      c.style.borderColor = COL.B;
      return c;
    });
    const tB = clamp(at(1, 'barked', 0.6), cue(1) + 0.2, end(1) - 0.6);
    barks.forEach((c, k) => tl.fromTo(c, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }, cue(1) + 0.15 + k * 0.35));
    A.pulse(tl, barks, Math.max(tB, cue(1) + 1.2));

    // ---------- beat 2: a dashed line drops from each to an empty slot
    const SY = 640, SH = 230;
    const sv = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const lines = xs.map(x => K.path(sv, `M ${x + W / 2} ${Y + H + 34} L ${x + W / 2} ${SY - 6}`, { stroke: C.muted, 'stroke-width': 5, 'stroke-dasharray': '10 10' }));
    const slots = xs.map(x => C3.put(stage, 'c3-card', null, { x, y: SY, w: W, h: SH }));
    slots.forEach(s => { s.style.border = '4px dashed #c9d2bf'; s.style.boxShadow = 'none'; s.style.background = 'rgba(255,255,255,0.5)'; });
    A.draw(tl, lines, cue(2) + 0.3, 0.5, { stagger: 0.12 });
    A.in(tl, slots, cue(2) + 0.6, 'fade', { dur: 0.5, stagger: 0.12 });

    // ---------- still beat 2: each slot fills with its C outcome and the job, one after another
    const fills = [0, 1, 2].map(k => {
      const t = cue(2) + 1.0 + k * 0.75;
      const s = slots[k];
      const p = K.photo(s, CC[k], { x: 18, y: 18, w: 250, h: 186, radius: 16 });
      p.root.style.border = '4px solid ' + C.olive;
      const lab = K.el('div', null);
      Object.assign(lab.style, { position: 'absolute', left: '290px', top: '30px', width: '190px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' });
      const ib = K.el('div', null);
      Object.assign(ib.style, { width: '82px', height: '82px', borderRadius: '20px', background: C.green, display: 'grid', placeItems: 'center' });
      let ar = null;
      if (JOB[k][0] === 'shield') ib.appendChild(K.icon('shield', { size: 48, stroke: 2.4, color: '#fff' }));
      else ar = C3.arrows(ib, JOB[k][0] === 'in', '#fff', 60, 10);
      lab.appendChild(ib);
      lab.appendChild(K.el('div', null, `<span style="font:700 34px/1.1 var(--font-head);color:${C.greenDark};text-align:center;display:block">${JOB[k][1]}</span>`));
      s.appendChild(lab);
      tl.to(s, { borderColor: C.green, borderStyle: 'solid', backgroundColor: '#ffffff', duration: 0.4 }, t);
      tl.fromTo(p.root, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' }, t);
      const tJ = t + 0.4;
      A.in(tl, lab, tJ, 'fadeUp', { dur: 0.5 });
      if (ar) C3.nudge(tl, ar, tJ + 0.5, 2);
      tl.to(lines[k], { stroke: C.green, duration: 0.4 }, t);
      return s;
    });

    // ---------- beat 3: same behavior, different outcome, different possible function
    const t6 = Math.max(cue(3), cue(2) + 3.4);
    const all = [...ph.map(p => p.root), ...barks, ...fills, sv];
    tl.to(all, { opacity: 0.18, duration: 0.6 }, t6);
    const box = C3.put(stage, 'c3-card', null, { x: 460, y: 300, w: 1000, h: 470 });
    box.style.display = 'flex';
    box.style.flexDirection = 'column';
    box.style.justifyContent = 'center';
    box.style.alignItems = 'center';
    box.style.gap = '34px';
    const LINES = [['Same behavior.', C.ink, 'Same behavior'], ['Different outcome.', C.green, 'Different outcome'], ['Different possible function.', C.greenDark, 'possible function']];
    A.in(tl, box, t6 + 0.1, 'fadeUp', { dur: 0.6 });
    let lo = t6 + 0.3;
    LINES.forEach(([tx, col, p], k) => {
      const n = K.el('div', null, tx);
      Object.assign(n.style, { font: '700 62px/1.05 var(--font-head)', color: col, whiteSpace: 'nowrap' });
      box.appendChild(n);
      const tt = clamp(at(3, p, 0.1 + 0.33 * k), lo, end(3) - 0.3);
      A.in(tl, n, tt, 'fadeUp', { dur: 0.5 });
      lo = tt + 0.4;
    });

    // ---------- beat 4: not by looking at the behavior alone
    const t7 = cue(4);
    tl.to(box, { opacity: 0, scale: 0.96, duration: 0.4 }, t7);
    tl.to(all, { opacity: 1, duration: 0.6 }, t7 + 0.1);
    tl.to(ph.map(p => p.root), { opacity: 0.35, duration: 0.6 }, t7 + 0.8);
    const pl = C3.chip(stage, 'search', 'Look at the *whole ABC*, not just the behavior', 960, 400, { center: true, size: 40, col: C.green });
    pl.style.borderColor = C.green;
    A.in(tl, pl, t7 + 1.0, 'pop', { dur: 0.6 });

    // ---------- beat 5: in all three the barking worked, so it's more likely to be repeated
    const t8 = cue(5);
    tl.to(pl, { opacity: 0, duration: 0.3 }, t8);
    fills.forEach((f, k) => {
      const ck = C2.badge(stage, 'check', xs[k] + W - 18, SY + 4, 64, C.green, '#fff');
      ck.style.border = '5px solid #fff';
      A.in(tl, ck, t8 + 0.3 + k * 0.3, 'pop', { dur: 0.45 });
      tl.to(f, { boxShadow: '0 0 0 6px rgba(97,149,55,0.45), 0 10px 30px rgba(40,60,20,0.10)', duration: 0.4 }, t8 + 0.3 + k * 0.3);
    });
    const ml = C3.chip(stage, 'repeat', 'It worked, so it\u2019s *more likely to be repeated*', 960, 400, { center: true, size: 40, col: C.green });
    ml.style.borderColor = C.green;
    A.in(tl, ml, clamp(at(5, 'more likely to be repeated', 0.6), t8 + 1.4, end(5) - 0.4), 'pop', { dur: 0.6 });
  });
})();
