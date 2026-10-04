// Chapter 3: why the pattern repeats, and why we train. Linear ABC photo strips (Tori's panels), with the emotional
// response shown between A and B. No cycles (Tori, round 3: the cycles next to the linear strips were confusing).
//   ch03s13  Why the pattern repeats   before training: A, the emotional response, B, C; getting space makes it more likely
//   ch03s14  This is why we train      during training (management, changing emotions, a new behavior, space still given);
//                                      path strength bars (old / new) rise and fade; after training (less management,
//                                      calmer, readily uses the new behavior); C changes: less space needed, then building
//                                      a relationship (drawn picture until Tori sends one); the three emotional states side
//                                      by side for the arousal and stress line
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

  // ================================================================== ch03s13 Why the pattern repeats
  registerScene('ch03s13', ctx => {
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

  // ------------------------------------------------------------------ the relationship picture for the After C panel (drawn
  // placeholder in the panel's place until Tori sends a painted one): two dogs greet nose to nose in the park, a heart above
  function relationship(panel, tl, t) {
    const box = K.el('div', null);
    Object.assign(box.style, { position: 'absolute', inset: '0', overflow: 'hidden', borderRadius: '18px' });
    panel.appendChild(box);
    const W = panel.clientWidth || 447, H = panel.clientHeight || 257;
    const bg = K.svg(box, { x: 0, y: 0, w: W, h: H });
    const id = 'c3rel' + Math.round(W);
    K.svgEl('defs', {}, bg).innerHTML = `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dcefd0"/><stop offset="0.62" stop-color="#bfe0a6"/><stop offset="1" stop-color="#9fcd7f"/></linearGradient>`;
    K.rect(bg, 0, 0, W, H, { fill: `url(#${id})` });
    K.path(bg, `M -10 ${H * 0.86} C ${W * 0.3} ${H * 0.78} ${W * 0.7} ${H * 0.8} ${W + 10} ${H * 0.9}`, { stroke: '#d9cfb8', 'stroke-width': 30, opacity: 0.8 });
    [[0.1, 0.36, 40], [0.86, 0.32, 48], [0.95, 0.42, 30]].forEach(([fx, fy, r]) => K.circle(bg, W * fx, H * fy, r, { fill: '#8fbf6c', opacity: 0.7 }));
    const s = 0.4, cy = H * 0.62;
    const sv1 = K.svg(box, { x: 0, y: 0, w: W, h: H });
    const D1 = C2.dog(sv1, W / 2 - 74, cy, s);
    const sv2 = K.svg(box, { x: 0, y: 0, w: W, h: H });
    const D2 = C2.dog(sv2, W / 2 + 74, cy, s);
    gsap.set(D2.outer, { scaleX: -1, svgOrigin: `${W / 2 + 74} ${cy}` });
    sv2.style.filter = 'grayscale(1) brightness(1.55) sepia(0.5)';
    const hs = C2.svgIcon(K.svg(box, { x: 0, y: 0, w: W, h: H }), 'heart', W / 2, cy - 92, 44, { stroke: '#fff', fill: COL.emo, 'stroke-width': 1.6 });
    tl.fromTo(box, { opacity: 0 }, { opacity: 1, duration: 0.8 }, t);
    tl.fromTo(D1.outer, { x: -40 }, { x: 0, duration: 1.0, ease: 'power2.out' }, t);
    tl.fromTo(sv2, { x: 40 }, { x: 0, duration: 1.0, ease: 'power2.out' }, t);
    tl.fromTo(hs, { opacity: 0, scale: 0.3, svgOrigin: `${W / 2} ${cy - 92}` }, { opacity: 1, scale: 1, svgOrigin: `${W / 2} ${cy - 92}`, duration: 0.6, ease: 'back.out(2)' }, t + 1.0);
    C2.wag(tl, D1, t + 0.8, t + 6);
    C2.wag(tl, D2, t + 1.0, t + 6, 0.45);
    return box;
  }

  // ================================================================== ch03s14 This is why we train
  registerScene('ch03s14', ctx => {
    const { stage, tl, cue, end, dur } = ctx;
    C2.style(stage);
    C3.css(stage);
    css(stage);
    const at = (i, p, fb, lead) => sayAt(ctx, i, p, fb, lead);
    C3.head(ctx, 'This Is Why We Train', { size: 72 });

    // path strength bars at the bottom: the old path (red) and the new path (green)
    const bar = (x, label, col, v0) => {
      const n = K.el('div', 'lin-bar');
      n.style.left = x + 'px';
      n.style.top = '872px';
      n.style.color = col;
      n.appendChild(K.el('span', null, label));
      const tr = K.el('div', 'tr');
      const fl = K.el('div', 'fl');
      fl.style.background = col;
      tr.appendChild(fl);
      n.appendChild(tr);
      stage.appendChild(n);
      gsap.set(fl, { scaleX: v0 });
      let cur = v0;
      return { n, fl, set(tl_, v, t, d = 0.9) { tl_.fromTo(fl, { scaleX: cur }, { scaleX: v, duration: d, ease: 'power2.inOut', immediateRender: false }, t); cur = v; } };
    };
    const OLD = bar(230, 'Old path', C.red, 1), NEW = bar(1180, 'New path', C.green, 0);
    A.in(tl, [OLD.n, NEW.n], cue(0) + 0.6, 'fadeUp', { dur: 0.5, stagger: 0.15 });

    // ---------- beat 0: the bridge
    const big = C2.put(stage, 'c3-big', 'Help the <b>new path</b> win', { x: 0, y: 480, w: 1920, align: 'center' });
    big.style.fontSize = '76px';
    A.in(tl, big, clamp(at(0, 'new path win', 0.3), cue(0) + 0.2, end(0) - 1.2), 'fadeUp', { dur: 0.6 });
    tl.to(big, { opacity: 0, y: -20, duration: 0.4 }, Math.max(cue(1) - 0.2, end(0) - 0.2));

    // ---------- beats 1 to 4: during training
    const D = strip(stage, { label: 'During training', v: '', emo: 'Changing<br>emotions',
      imgs: ['abc_during_a.jpg', 'abc_during_b.jpg', 'abc_during_c.jpg'],
      caps: ['Management.', 'Looks back<br>at you.', 'Space is given.'] });
    D.frames(tl, cue(1) + 0.05);
    D.show(tl, 0, clamp(at(1, 'another dog may still appear', 0.15), cue(1) + 0.3, end(1) - 4));
    const tM = clamp(at(1, 'management matters', 0.4), cue(1) + 1.5, end(1) - 2);
    tl.to(D.cols[0].cap, { backgroundColor: C.pale, borderColor: C.green, scale: 1.06, duration: 0.3, yoyo: true, repeat: 1 }, tM);
    const tCh = clamp(at(2, 'changing', 0.2), cue(2) + 0.1, end(2) - 2.5);
    D.emo(tl, tCh);
    D.beat(tl, tCh + 0.6, cue(9) - 0.2, 1.0, 1.1);
    D.show(tl, 1, clamp(at(2, 'teaching a new behavior', 0.6), tCh + 0.9, end(2) - 0.5));
    D.show(tl, 2, clamp(at(3, 'give them space', 0.7), cue(3) + 0.5, end(3) - 0.4));
    NEW.set(tl, 0.35, clamp(at(4, 'gets practiced', 0.7), cue(4) + 0.5, end(4) - 0.9));

    // ---------- beats 5 to 8: the paths
    NEW.set(tl, 0.9, cue(5) + 0.2, 1.2);
    tl.to(NEW.n, { scale: 1.06, duration: 0.3, yoyo: true, repeat: 1, transformOrigin: '0% 50%' }, cue(5) + 0.4);
    OLD.set(tl, 0.14, clamp(at(6, 'begins to fade', 0.7), cue(6) + 0.5, end(6) - 1.2), 1.4);
    const still = C3.chip(stage, 'eye', 'Still there', 810, 862, { size: 26, col: C.muted });
    A.in(tl, still, cue(7) + 0.2, 'pop', { dur: 0.45 });
    tl.to(OLD.n, { opacity: 0.55, duration: 0.3, yoyo: true, repeat: 3 }, cue(7) + 0.4);
    const tBack = clamp(at(8, 'practicing the old behavior', 0.3), cue(8) + 0.2, end(8) - 2.2);
    tl.to(still, { opacity: 0, duration: 0.3 }, tBack);
    OLD.set(tl, 0.7, tBack, 1.4);
    NEW.set(tl, 0.6, tBack, 1.4);
    const back = C3.chip(stage, 'triangle-alert', 'It can come back', 810, 862, { size: 26, col: C.amber });
    A.in(tl, back, tBack + 0.8, 'pop', { dur: 0.45 });

    // ---------- beats 9 to 11: after training
    const t9 = cue(9);
    tl.to([D.wrap, back, OLD.n, NEW.n], { opacity: 0, duration: 0.45 }, t9 - 0.1);
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
    swapCap(0, 1, clamp(at(9, 'can change too', 0.8), t9 + 2.6, end(9) - 0.5));
    // beat 10: something new: the C picture becomes two dogs greeting; that's a good thing
    const t10 = cue(10);
    const tR = clamp(at(10, 'build a relationship', 0.5), t10 + 0.2, end(10) - 1.8);
    relationship(Af.cols[2].panel, tl, tR - 0.2);
    swapCap(1, 2, tR);
    tl.to(Af.cols[2].panel, { borderColor: C.green, boxShadow: '0 0 0 8px rgba(97,149,55,0.35)', duration: 0.5 }, tR);
    const good = C3.chip(stage, 'check', 'The dog may want something new. *That’s a good thing.*', 960, 868, { center: true, size: 36, col: C.green });
    good.style.borderColor = C.green;
    A.in(tl, good, clamp(at(10, "that's a good thing", 0.85), tR + 0.8, end(10) - 0.3), 'pop', { dur: 0.55 });
    // beat 11: arousal and stress across the three stages
    const t11 = cue(11);
    tl.to(good, { opacity: 0, duration: 0.3 }, t11);
    const SUM = [['Before:', 'arousal and stress up', C.red, 64], ['During:', 'changing', C.amber, 54], ['After:', 'calmer', C.green, 44]];
    const tS = clamp(at(11, 'arousal and stress', 0.3), t11 + 0.2, end(11) - 3);
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
    A.in(tl, up, clamp(at(11, 'add temperature', 0.8), tS + 1.6, end(11) - 0.5), 'fadeLeft', { dur: 0.5 });
  });
})();
