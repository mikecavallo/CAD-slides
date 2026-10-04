// Chapter 3: why the pattern repeats, what training includes, the paths, and training in action. Linear ABC photo strips
// (Tori's panels) with the emotional response shown between A and B; no cycles (Tori, round 3).
//   ch03s11  Why the pattern repeats   before training: A, the emotional response, B, C; getting space makes it more likely
//   ch03s12  What training includes   three cards: management, changing emotions, new behaviors
//   ch03s13  Building a new path      chapter 1's lawn: the new path wears in; a management gate closes the old path and
//                                     the grass grows back; a faint trace stays; practice wears it in again
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
  // Chapter 1's lawn (ch01s09: the worn diagonal path with footprint dots, the new dotted trail), drawn at the same
  // proportions, plus a management gate across the old path. The old path wears in; the new path is revealed and wears in;
  // the gate closes the old path and grass grows back over it; a faint trace stays; practice wears it in again.
  registerScene('ch03s13', ctx => {
    const { stage, tl, cue, end } = ctx;
    C2.style(stage);
    C3.css(stage);
    css(stage);
    stage.appendChild(K.el('style', null, `.c3p-pill { position: absolute; display: inline-flex; align-items: center; gap: 12px; padding: 14px 28px 14px 20px; border-radius: 999px; background: #fff;
      font: 700 32px/1 var(--font-body); white-space: nowrap; box-shadow: 0 10px 24px rgba(40,60,20,0.18); }
      .c3p-pill svg { width: 36px; height: 36px; stroke-width: 2.4; }`));
    const at = (i, p, fb, lead) => sayAt(ctx, i, p, fb, lead);
    C3.head(ctx, 'Building a New Path', { size: 72 });

    // the lawn, in chapter 1's coordinates (980 x 530), scaled up
    const VW = 980, VH = 530, S = 1.32, LW = VW * S, LH = VH * S, LX = (1920 - LW) / 2, LY = 248;
    const lawn = K.svg(stage, { x: LX, y: LY, w: LW, h: LH, viewBox: `0 0 ${VW} ${VH}` });
    const defs = K.svgEl('defs', {}, lawn);
    const g = K.svgEl('linearGradient', { id: 'c3p-lawn', x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    K.svgEl('stop', { offset: '0', 'stop-color': '#d6e9bf' }, g);
    K.svgEl('stop', { offset: '1', 'stop-color': '#a7cb80' }, g);
    const clip = K.svgEl('clipPath', { id: 'c3p-lawnclip' }, defs);
    K.rect(clip, 0, 0, VW, VH, { rx: 26 });
    const reveal = K.svgEl('clipPath', { id: 'c3p-newclip', clipPathUnits: 'userSpaceOnUse' }, defs);
    const revealR = K.rect(reveal, -40, 0, 0, VH, { fill: '#fff' });
    const body = K.group(lawn, { 'clip-path': 'url(#c3p-lawnclip)' });
    K.rect(body, 0, 0, VW, VH, { fill: 'url(#c3p-lawn)' });
    let seed = 7;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    for (let i = 0; i < 52; i++) {
      const x = 30 + rnd() * (VW - 60), y = 40 + rnd() * (VH - 60), s = 0.8 + rnd() * 0.6;
      K.path(body, `M ${x} ${y} l ${-7 * s} ${-20 * s} M ${x} ${y} l 0 ${-26 * s} M ${x} ${y} l ${7 * s} ${-20 * s}`,
        { stroke: rnd() > 0.5 ? '#86b556' : '#79a94b', 'stroke-width': 4, opacity: 0.55 + rnd() * 0.35 });
    }
    const pathD = 'M -30 380 C 190 385, 305 275, 500 242 S 815 132, 1010 56';
    const newD = 'M -30 482 C 220 482, 362 405, 552 377 S 858 316, 1010 288';
    const worn = K.path(body, pathD, { stroke: '#cdb285', 'stroke-width': 0 });
    const wornIn = K.path(body, pathD, { stroke: '#b8966a', 'stroke-width': 0, opacity: 0.75 });
    const trace = K.path(body, pathD, { stroke: '#8d7a55', 'stroke-width': 4, 'stroke-dasharray': '14 12', opacity: 0 });
    const dotted = K.path(body, pathD, { stroke: '#6f6446', 'stroke-width': 7, 'stroke-dasharray': '0.1 24', opacity: 0.6 });
    const newWorn = K.path(body, newD, { stroke: '#cdb285', 'stroke-width': 0 });
    const freshG = K.group(body, { 'clip-path': 'url(#c3p-newclip)' });
    K.path(freshG, newD, { stroke: '#ffffff', 'stroke-width': 20, 'stroke-dasharray': '0.1 26', opacity: 0.75 });
    K.path(freshG, newD, { stroke: C.greenDark, 'stroke-width': 12, 'stroke-dasharray': '0.1 26' });
    // grass that grows back over the old path
    const grassG = K.group(body);
    const tufts = [];
    const len = worn.getTotalLength();
    for (let j = 0; j < 30; j++) {
      const p = worn.getPointAtLength(len * (0.2 + 0.78 * j / 29));
      const x = p.x + ((j * 37) % 34) - 17, y = p.y + ((j * 53) % 30) - 15, s = 0.9 + (j % 3) * 0.2;
      const tf = K.group(grassG, { transform: `translate(${x} ${y})` });
      const inner = K.group(tf);
      K.path(inner, `M 0 0 l ${-7 * s} ${-20 * s} M 0 0 l 0 ${-26 * s} M 0 0 l ${7 * s} ${-20 * s}`, { stroke: j % 2 ? '#86b556' : '#79a94b', 'stroke-width': 4.5 });
      gsap.set(inner, { scale: 0, svgOrigin: '0 0' });
      tufts.push(inner);
    }
    // the management gate across the old path
    const gp = worn.getPointAtLength(len * 0.14);
    const gate = K.group(body, { transform: `translate(${gp.x} ${gp.y})` });
    const gIn = K.group(gate);
    for (let k = -2; k <= 2; k++) K.rect(gIn, -8 + k * 24, -62, 13, 124, { rx: 5, fill: '#ffffff', stroke: C.greenDeep, 'stroke-width': 3.5 });
    K.rect(gIn, -66, -36, 132, 13, { rx: 5, fill: '#ffffff', stroke: C.greenDeep, 'stroke-width': 3.5 });
    K.rect(gIn, -66, 22, 132, 13, { rx: 5, fill: '#ffffff', stroke: C.greenDeep, 'stroke-width': 3.5 });
    gsap.set(gIn, { opacity: 0 });
    K.rect(lawn, 2, 2, VW - 4, VH - 4, { rx: 25, fill: 'none', stroke: '#ffffff', 'stroke-width': 4, opacity: 0.7 });
    lawn.style.filter = 'drop-shadow(0 18px 40px rgba(40,60,20,0.16))';
    const st = (x, y) => [LX + x * S, LY + y * S];

    const pill = (icon, text, col, x, y) => {
      const n = K.el('div', 'c3p-pill');
      n.style.color = col;
      n.appendChild(K.icon(icon));
      n.appendChild(K.el('span', null, text));
      const [sx, sy] = st(x, y);
      Object.assign(n.style, { left: sx + 'px', top: sy + 'px' });
      stage.appendChild(n);
      return n;
    };
    const oldP = pill('volume-2', 'Old path: barking and lunging', C.red, 560, 110);
    const newP = pill('sprout', 'New path: looks back at you', C.greenDark, 560, 405);
    const gateP = pill('shield-check', 'Management', C.greenDeep, 40, 220);

    // ---------- beat 0: the old path wears in
    tl.fromTo(lawn, { opacity: 0, scale: 0.96, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' }, cue(0) + 0.1);
    const w1 = clamp(at(0, 'old path', 0.35), cue(0) + 0.9, end(0) - 2.4);
    tl.set(worn, { attr: { 'stroke-width': 12 } }, w1);
    A.draw(tl, worn, w1, 0.9, { ease: 'power1.inOut' });
    tl.to(worn, { attr: { 'stroke-width': 40 }, duration: 0.7, ease: 'power2.out' }, w1 + 1.0);
    const w3 = clamp(at(0, 'so many times', 0.8), w1 + 1.8, end(0) - 0.6);
    tl.to(worn, { attr: { 'stroke-width': 78 }, duration: 0.8, ease: 'power2.out' }, w3);
    tl.to(wornIn, { attr: { 'stroke-width': 34 }, duration: 0.8, ease: 'power2.out' }, w3 + 0.1);
    tl.to(dotted, { opacity: 0.25, duration: 0.6 }, w3);
    A.in(tl, oldP, w1 + 0.5, 'fadeUp', { dur: 0.5 });

    // ---------- beat 1: the new path appears, then wears in with practice
    const t1 = cue(1);
    tl.fromTo(revealR, { attr: { width: 0 } }, { attr: { width: VW + 80 }, duration: 1.6, ease: 'power1.inOut' }, t1 + 0.2);
    A.in(tl, newP, t1 + 1.1, 'pop', { dur: 0.55 });
    const tS = clamp(at(1, 'stronger', 0.8), t1 + 2.0, end(1) - 0.9);
    tl.set(newWorn, { attr: { 'stroke-width': 10 } }, tS - 0.6);
    A.draw(tl, newWorn, tS - 0.6, 0.6);
    tl.to(newWorn, { attr: { 'stroke-width': 60 }, duration: 1.0, ease: 'power2.out' }, tS);

    // ---------- beat 2: the old path fades; management gates it off and the grass grows back
    const t2 = cue(2);
    tl.to(worn, { attr: { 'stroke-width': 50 }, duration: 1.2, ease: 'power2.inOut' }, t2 + 0.3);
    tl.to(wornIn, { attr: { 'stroke-width': 18 }, duration: 1.2 }, t2 + 0.3);
    const tG = clamp(at(2, 'Management keeps', 0.5), t2 + 1.0, end(2) - 3);
    tl.fromTo(gIn, { opacity: 0, y: -60 }, { opacity: 1, y: 0, duration: 0.6, ease: 'bounce.out' }, tG);
    A.in(tl, gateP, tG + 0.4, 'fadeUp', { dur: 0.5 });
    const tGr = clamp(at(2, 'grass', 0.85), tG + 1.0, end(2) - 1.5);
    tufts.forEach((tf, j) => tl.to(tf, { scale: 1, svgOrigin: '0 0', duration: 0.5, ease: 'back.out(2)' }, tGr + j * 0.04));
    tl.to(worn, { attr: { 'stroke-width': 16 }, opacity: 0.45, duration: 1.4, ease: 'power2.inOut' }, tGr);
    tl.to(wornIn, { attr: { 'stroke-width': 0 }, duration: 1.2 }, tGr);
    tl.to(dotted, { opacity: 0, duration: 0.8 }, tGr);
    tl.to(oldP, { opacity: 0.5, duration: 0.6 }, tGr);

    // ---------- beat 3: it hasn't vanished: a faint trace
    const t3 = cue(3);
    tl.to(trace, { opacity: 0.85, duration: 0.5 }, t3 + 0.2);
    tl.to(trace, { opacity: 0.4, duration: 0.4, yoyo: true, repeat: 3 }, t3 + 0.8);

    // ---------- beat 4: practiced again and it works: the old path wears back in
    const t4 = cue(4);
    const tA = clamp(at(4, 'practicing the old behavior', 0.3), t4 + 0.1, end(4) - 3);
    tl.to(gIn, { opacity: 0.3, duration: 0.4 }, tA);
    tl.to(trace, { opacity: 0, duration: 0.3 }, tA);
    tufts.forEach((tf, j) => tl.to(tf, { scale: 0, svgOrigin: '0 0', duration: 0.3 }, tA + 0.3 + j * 0.05));
    tl.to(dotted, { opacity: 0.6, duration: 0.5 }, tA + 0.3);
    tl.to(worn, { attr: { 'stroke-width': 78 }, opacity: 1, duration: 1.8, ease: 'power2.out' }, tA + 0.6);
    tl.to(wornIn, { attr: { 'stroke-width': 34 }, duration: 1.6 }, tA + 0.9);
    tl.to(oldP, { opacity: 1, duration: 0.4 }, tA + 0.6);
    const cb = C3.chip(stage, 'triangle-alert', 'It can come back', 0, 0, { col: C.amber, size: 30 });
    const [cx, cy] = st(40, 30);
    Object.assign(cb.style, { left: cx + 'px', top: cy + 'px' });
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
