// Chapter 3: why the pattern repeats, what training includes, the paths, and training in action. Linear ABC photo strips
// (Tori's panels) with the emotional response shown between A and B; no cycles (Tori, round 3).
//   ch03s11  Why the pattern repeats   before training: A, the emotional response, B, C; getting space makes it more likely
//   ch03s12  What training includes   three cards: management, changing emotions, new behaviors
//   ch03s13  Building a new path      the lawn: the new path wears in; management fences off the old path and the grass
//                                     grows back; a faint trace stays; practice wears it in again
//   ch03s14  Training in action       during training (management, changing emotions, a new behavior, the consequence still
//                                     works); after training (calmer; C changes: less space needed, then building a
//                                     relationship); the three emotional states side by side for the arousal line
(() => {
  const { sayAt, clamp } = C1;
  const { COL } = C3;
  const C = C1.C;

  const CSS = `
  .lin-emo { position: absolute; text-align: center; font: 700 26px/1.1 var(--font-body); color: ${COL.emo}; white-space: nowrap; }
  .lin-bar { position: absolute; display: flex; align-items: center; gap: 18px; font: 700 30px/1 var(--font-head); white-space: nowrap; }
  .lin-bar .tr { position: relative; width: 340px; height: 26px; border-radius: 13px; background: #eceee8; overflow: hidden; }
  .lin-bar .fl { position: absolute; left: 0; top: 0; bottom: 0; width: 100%; border-radius: 13px; transform-origin: 0 50%; }
  .c3s { grid-area: 1 / 1; }
  .lin-sum { position: absolute; display: flex; align-items: center; gap: 16px; font: 600 30px/1.15 var(--font-body); color: var(--ink); white-space: nowrap; }
  .lin-sum b { font-weight: 700; }
  `;
  const css = stage => stage.appendChild(K.el('style', null, CSS));

  /** A linear strip with room between the panels for the emotional response. */
  function strip(stage, o) {
    const S = C3.strip(stage, { x: 140, y: 236, w: 1640, gap: 190, panels: o.imgs, captions: o.caps, label: o.label, labelVariant: o.v });
    const [hx, hy] = S.arrowPt(0);
    const heart = C2.badge(S.wrap, 'heart', hx, hy - 66, o.hs || 76, COL.emo, '#fff');
    heart.style.border = '5px solid #fff';
    heart.style.boxShadow = '0 8px 20px rgba(80,40,90,0.3)';
    const lab = C2.put(S.wrap, 'lin-emo', o.emo, { x: hx - 90, y: hy + 34, w: 180 });
    gsap.set([heart, lab], { opacity: 0 });
    S.heart = heart;
    S.emo = (tl, t) => {
      tl.fromTo(heart, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)', immediateRender: false }, t);
      tl.fromTo(lab, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, immediateRender: false }, t + 0.2);
    };
    S.beat = (tl, t0, t1, per, sc = 1.16) => {
      const n = Math.max(1, Math.floor((t1 - t0) / per));
      for (let k = 0; k < n; k++) tl.to(heart, { scale: sc, duration: 0.14, yoyo: true, repeat: 1, ease: 'power2.out' }, t0 + k * per);
    };
    return S;
  }

  // ================================================================== ch03s11 Why the pattern repeats
  registerScene('ch03s11', ctx => {
    const { stage, tl, cue, end } = ctx;
    C2.style(stage);
    C3.css(stage);
    css(stage);
    const at = (i, p, fb, lead) => sayAt(ctx, i, p, fb, lead);
    C3.head(ctx, 'Why the Pattern Repeats', { size: 72 });
    const S = strip(stage, { label: 'Before training', v: 'red', emo: 'Emotions', hs: 84,
      imgs: ['abc_before_a.jpg', 'abc_before_b.jpg', 'abc_before_c.jpg'],
      caps: ['Another dog appears<br>too close.', 'Barking, lunging,<br>growling', 'Space is given.<br>The situation ends.'] });
    S.frames(tl, 0.2);
    S.show(tl, 0, clamp(at(0, 'Another dog', 0.05), cue(0) + 0.1, end(0) - 0.6));
    const tE = clamp(at(1, 'emotional response', 0.3), cue(1) + 0.1, end(1) - 2);
    S.emo(tl, tE);
    S.beat(tl, tE + 0.6, ctx.dur - 0.6, 0.5, 1.2);
    S.show(tl, 1, clamp(at(1, 'we see the B', 0.6), tE + 0.8, end(1) - 0.4));
    S.show(tl, 2, cue(2) + 0.1);
    const note = C2.put(stage, 'c3-mid', 'Getting more space can make this behavior <b>more likely next time</b>.', { x: 0, y: 862, w: 1920, align: 'center' });
    note.style.color = C.red;
    note.querySelector('b').style.color = C.red;
    A.in(tl, note, clamp(at(3, 'more likely', 0.7), cue(3) + 0.5, end(3) - 0.4), 'fadeUp', { dur: 0.5 });
  });

  // ------------------------------------------------------------------ the relationship picture for the After C panel:
  // Tori's painting of the golden and the border collie playing (abc_after_c2.jpg) fades in over the C photo
  function relationship(panel, tl, t) {
    const img = K.el('img');
    img.src = '../assets/img/abc_after_c2.jpg';
    Object.assign(img.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', objectFit: 'cover' });
    panel.appendChild(img);
    tl.fromTo(img, { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 1.0, ease: 'power2.out' }, t);
    return img;
  }

  // ================================================================== ch03s12 What training includes
  registerScene('ch03s12', ctx => {
    const { stage, tl, cue, end } = ctx;
    C2.style(stage);
    C3.css(stage);
    css(stage);
    const at = (i, p, fb, lead) => sayAt(ctx, i, p, fb, lead);
    C3.head(ctx, 'What Training Includes', { size: 72 });
    const CARDS = [
      { icon: 'shield-check', col: C.greenDeep, t: 'Management', s: 'Keeps the dog out of the situations that bring up those big emotions' },
      { icon: 'heart', col: COL.emo, t: 'Changing emotions', s: 'How the dog feels about the thing' },
      { icon: 'route', col: C.green, t: 'New behaviors', s: 'Something else the dog can do instead' },
    ];
    const W = 540, G = 50, X0 = (1920 - 3 * W - 2 * G) / 2, Y = 290, H = 560;
    const cards = CARDS.map((c, k) => {
      const n = C3.put(stage, 'c3-card', null, { x: X0 + k * (W + G), y: Y, w: W, h: H });
      Object.assign(n.style, { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '56px 40px', gap: '30px', border: '4px dashed #c9d2bf', boxShadow: 'none', background: 'rgba(255,255,255,0.45)' });
      const num = K.el('div', null, String(k + 1));
      Object.assign(num.style, { position: 'absolute', left: '22px', top: '18px', font: '800 40px/1 var(--font-head)', color: '#c9d2bf' });
      n.appendChild(num);
      const inner = K.el('div', null);
      Object.assign(inner.style, { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px', textAlign: 'center' });
      const b = K.el('div', null);
      Object.assign(b.style, { width: '150px', height: '150px', borderRadius: '50%', background: c.col, display: 'grid', placeItems: 'center' });
      b.appendChild(K.icon(c.icon, { size: 84, stroke: 2.1, color: '#fff' }));
      inner.appendChild(b);
      inner.appendChild(K.el('div', null, `<span style="font:700 50px/1.1 var(--font-head);color:${c.col}">${c.t}</span>`));
      inner.appendChild(K.el('div', null, `<span style="font:500 32px/1.3 var(--font-body);color:${C.inkSoft}">${c.s}</span>`));
      n.appendChild(inner);
      gsap.set(inner, { opacity: 0 });
      return { n, inner, b, num, col: c.col };
    });
    A.in(tl, cards.map(c => c.n), clamp(at(0, 'three things', 0.8), cue(0) + 0.5, end(0) - 0.4), 'fade', { dur: 0.5, stagger: 0.12 });
    cards.forEach((c, k) => {
      const t = cue(k + 1) + 0.05;
      tl.to(c.n, { borderColor: c.col, borderStyle: 'solid', backgroundColor: '#ffffff', boxShadow: '0 14px 36px rgba(40,60,20,0.14)', duration: 0.4 }, t);
      tl.to(c.num, { color: c.col, duration: 0.4 }, t);
      tl.fromTo(c.inner, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', immediateRender: false }, t + 0.1);
      tl.fromTo(c.b, { scale: 0.5 }, { scale: 1, duration: 0.6, ease: 'back.out(2)', immediateRender: false }, t + 0.15);
    });
  });

  // ================================================================== ch03s13 Building a new path
  // The lawn: the new path wears in; management fences the old path off and grass grows back over it; a faint trace stays;
  // practice wears it in again.
  registerScene('ch03s13', ctx => {
    const { stage, tl, cue, end } = ctx;
    C2.style(stage);
    C3.css(stage);
    css(stage);
    const at = (i, p, fb, lead) => sayAt(ctx, i, p, fb, lead);
    C3.head(ctx, 'Building a New Path', { size: 72 });
    const LV = C3.layer(stage);
    const LW = C3.lawn(LV, { x: 160, y: 250, w: 1600, h: 560, old: 0.95, neu: 0, bow: 175 });
    tl.fromTo(LV, { opacity: 0 }, { opacity: 1, duration: 0.6, immediateRender: true }, 0.1);
    const [ox, oy] = LW.toStage(...LW.at('old', 0.62)), [nx, ny] = LW.toStage(...LW.at('neu', 0.5));
    const endB = C2.badge(LV, 'move-horizontal', LW.x + LW.ex, LW.y + LW.ey, 110, C.greenDeep, '#fff');
    endB.style.border = '6px solid #fff';
    const oL = C3.chip(LV, 'volume-2', 'Old path: *barking and lunging*', ox, oy + 42, { center: true, col: C.red, size: 30 });
    oL.querySelector('b').style.color = C.red;
    const nL = C3.chip(LV, 'eye', 'New path: *looks back at you*', nx, ny - 104, { center: true, col: C.green, size: 30 });
    gsap.set(nL, { opacity: 0 });

    // beat 0: the old path is worn in
    LW.walk(tl, 'old', cue(0) + 0.8, 2.4, 10, '#5a4524');
    A.in(tl, oL, clamp(at(0, 'old path', 0.4), cue(0) + 0.6, end(0) - 0.5), 'fadeUp', { dur: 0.5 });
    // beat 1: the new path wears in
    const t1 = cue(1);
    A.in(tl, nL, clamp(at(1, 'new path', 0.2), t1 + 0.1, end(1) - 1.5), 'fadeUp', { dur: 0.5 });
    LW.walk(tl, 'neu', t1 + 0.5, 2.2, 10);
    LW.set(tl, 'neu', 0.45, t1 + 0.4, 1.0);
    LW.set(tl, 'neu', 0.95, clamp(at(1, 'stronger', 0.7), t1 + 1.8, end(1) - 1.2), 1.2);

    // beat 2: management fences the old path; the grass grows back over it
    const t2 = cue(2);
    const [fx, fy] = LW.at('old', 0.17);
    const fence = K.group(LW.svg);
    for (let k = -2; k <= 2; k++) K.rect(fence, fx - 8 + k * 30, fy - 70, 16, 140, { rx: 6, fill: '#ffffff', stroke: C.greenDeep, 'stroke-width': 4 });
    K.rect(fence, fx - 80, fy - 40, 160, 16, { rx: 6, fill: '#ffffff', stroke: C.greenDeep, 'stroke-width': 4 });
    K.rect(fence, fx - 80, fy + 20, 160, 16, { rx: 6, fill: '#ffffff', stroke: C.greenDeep, 'stroke-width': 4 });
    const tM = clamp(at(2, 'Management keeps', 0.5), t2 + 1.0, end(2) - 3);
    tl.fromTo(fence, { opacity: 0, y: -80 }, { opacity: 1, y: 0, duration: 0.6, ease: 'bounce.out' }, tM);
    const mg = C3.chip(LV, 'shield-check', '*Management*', LW.x + fx - 110, LW.y + fy - 150, { col: C.greenDeep, size: 30 });
    A.in(tl, mg, tM + 0.4, 'fadeUp', { dur: 0.5 });
    LW.set(tl, 'old', 0.55, t2 + 0.3, 1.4);
    // grass tufts grow back along the old path
    const TUFT = (g, x, y, sc) => {
      const t = K.group(g, { transform: `translate(${x} ${y})` });
      const inner = K.group(t);
      K.path(inner, `M -14 8 L -8 -16 M -4 8 L -1 -22 M 6 8 L 8 -18 M 14 8 L 16 -10`, { stroke: '#7fb054', 'stroke-width': 5 });
      gsap.set(inner, { scale: 0, svgOrigin: '0 8' });
      return inner;
    };
    const tufts = [];
    for (let j = 0; j < 26; j++) {
      const f = 0.24 + 0.68 * (j / 25);
      const [px, py] = LW.at('old', f);
      tufts.push(TUFT(LW.svg, px + ((j * 37) % 40) - 20, py + ((j * 53) % 34) - 17));
    }
    const tG = clamp(at(2, 'grass', 0.85), tM + 1.0, end(2) - 1.4);
    tufts.forEach((tf, j) => tl.to(tf, { scale: 1, svgOrigin: '0 8', duration: 0.5, ease: 'back.out(2)' }, tG + j * 0.04));
    LW.set(tl, 'old', 0.18, tG, 1.4);

    // beat 3: it hasn't vanished: a faint dashed trace
    const t3 = cue(3);
    tl.to(LW.P.old.edge, { opacity: 0.9, attr: { 'stroke-width': 5 }, duration: 0.5 }, t3 + 0.2);
    const st = C3.chip(LV, 'eye', 'Still there', ox + 260, oy - 34, { col: C.muted, size: 28 });
    A.in(tl, st, t3 + 0.4, 'pop', { dur: 0.45 });

    // beat 4: practiced again, it wears back in
    const t4 = cue(4);
    const tA = clamp(at(4, 'practicing the old behavior', 0.3), t4 + 0.1, end(4) - 3);
    tl.to([st, LW.P.old.edge], { opacity: 0, duration: 0.3 }, tA);
    tl.to(fence, { opacity: 0.35, duration: 0.4 }, tA);
    LW.walk(tl, 'old', tA + 0.2, 2.4, 10, '#7a2a1a');
    tufts.forEach((tf, j) => tl.to(tf, { scale: 0, svgOrigin: '0 8', duration: 0.3 }, tA + 0.4 + j * 0.06));
    LW.set(tl, 'old', 0.85, tA + 0.8, 1.8);
    const cb = C3.chip(LV, 'triangle-alert', 'It can come back', ox + 260, oy - 34, { col: C.amber, size: 28 });
    A.in(tl, cb, clamp(at(4, 'stronger again', 0.85), tA + 1.4, end(4) - 0.3), 'pop', { dur: 0.45 });
  });

  // ================================================================== ch03s14 Training in action
  registerScene('ch03s14', ctx => {
    const { stage, tl, cue, end } = ctx;
    C2.style(stage);
    C3.css(stage);
    css(stage);
    const at = (i, p, fb, lead) => sayAt(ctx, i, p, fb, lead);
    C3.head(ctx, 'Training in Action', { size: 72 });

    // ---------- beats 0 to 3: during training
    const D = strip(stage, { label: 'During training', v: '', emo: 'Changing<br>emotions',
      imgs: ['abc_during_a.jpg', 'abc_during_b.jpg', 'abc_during_c.jpg'],
      caps: ['Management.', 'Looks back<br>at you.', 'Space is given.'] });
    D.frames(tl, cue(0) + 0.05);
    D.show(tl, 0, clamp(at(0, 'another dog may still appear', 0.5), cue(0) + 0.4, end(0) - 0.6));
    const tCh = clamp(at(1, 'changing', 0.2), cue(1) + 0.1, end(1) - 2.5);
    D.emo(tl, tCh);
    D.beat(tl, tCh + 0.6, cue(4) - 0.2, 1.0, 1.1);
    D.show(tl, 1, clamp(at(1, 'teaching a new behavior', 0.6), tCh + 0.9, end(1) - 0.5));
    // beat 2: the consequence still needs to work for the dog
    const t2 = cue(2);
    D.show(tl, 2, t2 + 0.3);
    const cw = C3.chip(stage, 'check', 'The consequence *still needs to work* for the dog', 960, 866, { center: true, size: 34, col: C.green });
    cw.style.borderColor = C.green;
    A.in(tl, cw, clamp(at(2, 'still needs to get what it needs', 0.4), t2 + 0.8, end(2) - 0.6), 'fadeUp', { dur: 0.5 });
    tl.to(D.cols[2].panel, { boxShadow: '0 0 0 8px rgba(97,149,55,0.4)', duration: 0.4 }, t2 + 0.6);
    // beat 3: the new pattern gets practiced
    const t3 = cue(3);
    tl.to(cw, { opacity: 0, duration: 0.3 }, t3);
    const np = C3.chip(stage, 'repeat', 'The *new pattern* gets practiced', 960, 866, { center: true, size: 34, col: C.green });
    np.style.borderColor = C.green;
    A.in(tl, np, clamp(at(3, 'gets practiced', 0.7), t3 + 0.5, end(3) - 0.4), 'pop', { dur: 0.5 });

    // ---------- beats 4 to 6: after training
    const t9 = cue(4);
    tl.to([D.wrap, np], { opacity: 0, duration: 0.45 }, t9 - 0.1);
    const Af = strip(stage, { label: 'After training', v: 'green', emo: 'Calmer', hs: 60,
      imgs: ['abc_after_a.jpg', 'abc_after_b.jpg', 'abc_after_c.jpg'],
      caps: ['Less management<br>as skills improve.', 'Readily uses the<br>new behavior.',
        '<span class="c3s">Space is given.</span><span class="c3s">Less space<br>needed.</span><span class="c3s">Building a<br>relationship.</span>'] });
    Af.frames(tl, t9 + 0.1);
    Af.show(tl, 0, t9 + 0.4);
    Af.emo(tl, t9 + 0.9);
    Af.show(tl, 1, t9 + 1.3);
    Af.show(tl, 2, t9 + 1.9);
    const cs = [...Af.cols[2].cap.querySelectorAll('.c3s')];
    gsap.set(cs.slice(1), { opacity: 0 });
    const swapCap = (a, b, t) => {
      tl.to(cs[a], { opacity: 0, y: -8, duration: 0.3 }, t);
      tl.fromTo(cs[b], { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, immediateRender: false }, t + 0.25);
      tl.to(Af.cols[2].cap, { backgroundColor: C.pale, borderColor: C.green, duration: 0.4 }, t);
    };
    swapCap(0, 1, clamp(at(4, 'can change too', 0.8), t9 + 2.6, end(4) - 0.5));
    // beat 5: something new: the C picture becomes the two dogs playing; that's a good thing
    const t10 = cue(5);
    const tR = clamp(at(5, 'build a relationship', 0.5), t10 + 0.2, end(5) - 1.8);
    relationship(Af.cols[2].panel, tl, tR - 0.2);
    swapCap(1, 2, tR);
    tl.to(Af.cols[2].panel, { borderColor: C.green, boxShadow: '0 0 0 8px rgba(97,149,55,0.35)', duration: 0.5 }, tR);
    const good = C3.chip(stage, 'check', 'The dog may want something new. *That’s a good thing.*', 960, 868, { center: true, size: 36, col: C.green });
    good.style.borderColor = C.green;
    A.in(tl, good, clamp(at(5, "that's a good thing", 0.85), tR + 0.8, end(5) - 0.3), 'pop', { dur: 0.55 });
    // beat 6: arousal and stress across the three stages
    const t11 = cue(6);
    tl.to(good, { opacity: 0, duration: 0.3 }, t11);
    const SUM = [['Before:', 'arousal and stress up', C.red, 64], ['During:', 'changing', C.amber, 54], ['After:', 'calmer', C.green, 44]];
    const tS = clamp(at(6, 'arousal and stress', 0.3), t11 + 0.2, end(6) - 3);
    SUM.forEach(([a, b, col, hs], k) => {
      const n = K.el('div', 'lin-sum');
      Object.assign(n.style, { left: [190, 820, 1300][k] + 'px', top: '866px' });
      const hb = K.el('div', null);
      Object.assign(hb.style, { width: hs + 'px', height: hs + 'px', borderRadius: '50%', background: COL.emo, display: 'grid', placeItems: 'center', flex: '0 0 auto' });
      hb.appendChild(K.icon('heart', { size: hs * 0.55, stroke: 2.3, color: '#fff' }));
      n.appendChild(hb);
      n.appendChild(K.el('span', null, `${a} <b style="color:${col}">${b}</b>`));
      stage.appendChild(n);
      A.in(tl, n, tS + k * 0.35, 'fadeUp', { dur: 0.5 });
    });
    const up = C2.bookmark(stage, 'Coming up: *temperature*', 1150, 136, 'thermometer');
    up.querySelectorAll('b').forEach(b => { b.style.color = '#b8d99a'; });
    A.in(tl, up, clamp(at(6, 'add temperature', 0.8), tS + 1.6, end(6) - 0.5), 'fadeLeft', { dur: 0.5 });
  });
})();
