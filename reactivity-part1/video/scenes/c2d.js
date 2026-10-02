// Chapter 2: activity and emotions. Pot and helpers come from window.C2 (c2_pot.js).
//   ch02s07  Activity, stimulation and natural needs   a slider from too little to too much with a green sweet spot; bored / exhausted
//                                                       cards; a balance beam with the four needs that tips to each side with the doc's
//                                                       examples; three dogs with sweet spots in different places; the right balance
//   ch02s08  Emotions and recovery                     a mood graph: a difficult conversation, the feeling that stays, a snappy reply;
//                                                       the person becomes a dog; four emotions drip into the pot; a quiet event still
//                                                       nudges the water up; limited recovery, next chapter
(() => {
  const CSS = `
  .c2d-end { position: absolute; font: 700 34px/1 var(--font-body); color: var(--muted); white-space: nowrap; }
  .c2d-say { position: absolute; font: 600 38px/1.2 var(--font-head); color: var(--ink); white-space: nowrap; }
  .c2d-say b { color: var(--amber-text, #a8650f); font-weight: 700; }
  .c2d-pc { position: absolute; width: 400px; height: 190px; display: flex; align-items: center; gap: 26px; padding: 0 30px; background: #fff;
    border-radius: 26px; border: 3px solid #e6e9e1; box-shadow: var(--shadow-soft); }
  .c2d-pc .bd { width: 104px; height: 104px; border-radius: 50%; display: grid; place-items: center; background: var(--green-pale); color: var(--green-dark); flex: 0 0 auto; position: relative; }
  .c2d-pc .bd svg { width: 58px; height: 58px; stroke-width: 2.1; }
  .c2d-pc .nm { font: 700 38px/1.15 var(--font-head); color: var(--ink); }
  .c2d-pc .mood { position: absolute; right: -14px; bottom: -14px; width: 54px; height: 54px; border-radius: 50%; background: var(--amber); color: #fff;
    display: grid; place-items: center; border: 4px solid #fff; }
  .c2d-pc .mood svg { width: 32px; height: 32px; stroke-width: 2.4; }
  .c2d-blk { position: absolute; width: 196px; display: flex; flex-direction: column; align-items: center; gap: 8px; }
  .c2d-blk .bd { width: 108px; height: 108px; border-radius: 22px; display: grid; place-items: center; color: #fff; box-shadow: 0 10px 20px rgba(40,60,20,0.2); }
  .c2d-blk .bd svg { width: 58px; height: 58px; stroke-width: 2.1; }
  .c2d-blk .lb { font: 700 26px/1.1 var(--font-body); color: var(--ink); text-align: center; }
  .c2d-colh { display: flex; align-items: center; gap: 16px; margin-bottom: 8px; }
  .c2d-colh .t { font: 700 40px/1 var(--font-head); white-space: nowrap; }
  .c2d-col { position: absolute; display: flex; flex-direction: column; gap: 14px; align-items: flex-start; }
  .c2d-ex { display: inline-flex; align-items: center; gap: 12px; padding: 10px 22px 10px 12px; border-radius: 999px; background: #fff; border: 1px solid #e6e9e1;
    font: 600 28px/1 var(--font-body); color: var(--ink); white-space: nowrap; box-shadow: 0 6px 16px rgba(40,60,20,0.08); }
  .c2d-ex i { width: 14px; height: 14px; border-radius: 50%; display: block; flex: 0 0 auto; }
  .c2d-sil { position: absolute; display: flex; flex-direction: column; align-items: center; gap: 22px; width: 420px; }
  .c2d-sil img { display: block; height: 220px; width: auto; }
  .c2d-mini { position: relative; width: 360px; height: 30px; border-radius: 15px; background: #e9eee3; }
  .c2d-mini .z { position: absolute; top: 0; bottom: 0; border-radius: 15px; background: var(--green); }
  .c2d-mini .k { position: absolute; top: -9px; width: 48px; height: 48px; border-radius: 50%; background: #fff; border: 6px solid var(--green-dark); box-sizing: border-box; }
  .c2d-mlab { display: flex; justify-content: space-between; width: 360px; font: 600 26px/1 var(--font-body); color: var(--muted); }
  .c2d-gl { position: absolute; font: 600 28px/1 var(--font-body); color: var(--muted); white-space: nowrap; }
  .c2d-band { position: absolute; display: flex; flex-direction: column; align-items: center; gap: 12px; }
  .c2d-band .t { font: 700 28px/1.15 var(--font-body); color: var(--ink); text-align: center; white-space: nowrap; }
  `;
  const css = stage => stage.appendChild(K.el('style', null, CSS));
  const { sayAt, clamp } = C1;
  const { C } = C2;

  /** Person / situation card with an icon badge and a name. */
  function pcard(parent, icon, name, x, y) {
    const c = K.el('div', 'c2d-pc');
    Object.assign(c.style, { left: x + 'px', top: y + 'px' });
    const bd = K.el('div', 'bd');
    bd.appendChild(K.icon(icon));
    const mood = K.el('div', 'mood');
    mood.appendChild(K.icon('meh'));
    bd.appendChild(mood);
    c.appendChild(bd);
    c.appendChild(K.el('div', 'nm', K.md(name)));
    parent.appendChild(c);
    return { c, bd, mood };
  }

  // ================================================================== ch02s07 Activity, stimulation and natural needs
  registerScene('ch02s07', ctx => {
    const { stage, tl, cue, end, dur } = ctx;
    C2.style(stage);
    css(stage);
    const at = (i, p, fb, lead) => sayAt(ctx, i, p, fb, lead);
    C2.areaHead(ctx, 1, 'Activity, Stimulation & Natural Needs', 64);

    // ---------- beat 0: slider from too little to too much; the knob runs right, then left
    const LA = C2.layer(stage);
    const sv = K.svg(LA, { x: 0, y: 0, w: 1920, h: 1080 });
    const TX0 = 380, TX1 = 1540, TY = 640, MID = (TX0 + TX1) / 2;
    const trk = K.group(sv);
    const defs = K.svgEl('defs', {}, sv);
    defs.innerHTML = `<linearGradient id="c2dtrk" x1="0" x2="1"><stop offset="0" stop-color="${C.amber}"/><stop offset="0.36" stop-color="#e9eee3"/>
      <stop offset="0.64" stop-color="#e9eee3"/><stop offset="1" stop-color="${C.amber}"/></linearGradient>`;
    K.rect(trk, TX0, TY - 18, TX1 - TX0, 36, { rx: 18, fill: 'url(#c2dtrk)' });
    K.rect(trk, MID - 150, TY - 18, 300, 36, { rx: 18, fill: C.green });
    const zl = K.svgText(trk, MID, TY + 72, 'Just right', { 'font-size': 30, 'font-weight': 700, fill: C.greenDark, 'text-anchor': 'middle' });
    const knob = K.group(sv);
    K.circle(knob, 0, 0, 34, { fill: '#fff', stroke: C.greenDark, 'stroke-width': 10 });
    gsap.set(knob, { x: MID, y: TY });
    const eL = C2.put(LA, 'c2d-end', 'Too little', { x: TX0 - 10, y: TY - 84 });
    const eR = C2.put(LA, 'c2d-end', 'Too much', { x: TX1 - 150, y: TY - 84 });
    A.in(tl, trk, cue(0) + 0.1, 'fade', { dur: 0.6 });
    A.in(tl, [eL, eR], cue(0) + 0.3, 'fade', { dur: 0.5 });
    A.in(tl, knob, cue(0) + 0.4, 'pop', { dur: 0.5 });
    const tMore = clamp(at(0, 'More activity', 0.05, 0.1), cue(0) + 0.6, end(0) - 3);
    tl.to(knob, { x: TX1 - 40, duration: 0.9, ease: 'power2.inOut' }, tMore);
    const sR = C2.put(LA, 'c2d-say', 'More isn’t always *better*', { x: TX1 - 470, y: TY + 120 });
    A.in(tl, sR, tMore + 0.6, 'fadeUp', { dur: 0.6 });
    const tLess = clamp(at(0, 'less', 0.6, 0.2), tMore + 1.4, end(0) - 0.5);
    tl.to(knob, { x: TX0 + 40, duration: 1.1, ease: 'power2.inOut' }, tLess);
    const sL = C2.put(LA, 'c2d-say', 'Less isn’t always *calmer*', { x: TX0, y: TY + 120 });
    A.in(tl, sL, tLess + 0.7, 'fadeUp', { dur: 0.6 });
    tl.to(knob, { x: MID, duration: 0.9, ease: 'power2.inOut' }, Math.min(tLess + 1.8, cue(1) + 0.2));

    // ---------- beat 1: bored all day / exhausted
    const bored = pcard(LA, 'sofa', 'Bored<br>all day', TX0 - 60, 316);
    const tired = pcard(LA, 'battery-low', 'Exhausted', TX1 - 340, 316);
    gsap.set([bored.mood, tired.mood], { opacity: 0 });
    A.in(tl, bored.c, clamp(at(1, 'bored all day', 0.45, 0.3), cue(1), end(1) - 2), 'fadeDown', { dur: 0.6 });
    A.in(tl, tired.c, clamp(at(1, 'completely exhausted', 0.7, 0.3), cue(1) + 1, end(1) - 0.5), 'fadeDown', { dur: 0.6 });
    tl.to(knob, { x: TX0 + 40, duration: 0.7, ease: 'power2.inOut' }, clamp(at(1, 'bored all day', 0.45, 0.3), cue(1), end(1) - 2));
    tl.to(knob, { x: TX1 - 40, duration: 0.9, ease: 'power2.inOut' }, clamp(at(1, 'completely exhausted', 0.7, 0.3), cue(1) + 1, end(1) - 0.5));

    // ---------- beat 2: neither feels your best
    const t2 = cue(2);
    tl.to(knob, { x: MID, duration: 0.8, ease: 'power2.inOut' }, t2);
    [bored, tired].forEach(k => {
      tl.to(k.c, { borderColor: C.amber, duration: 0.4 }, t2 + 0.2);
      tl.to(k.bd, { background: C.amberPale, color: C.amber, duration: 0.4 }, t2 + 0.2);
      A.in(tl, k.mood, t2 + 0.4, 'pop', { dur: 0.45 });
    });
    const nei = C2.pill(LA, 'meh', 'Neither feels your best', { x: MID, y: 370, center: true, variant: 'amber', size: 34 });
    A.in(tl, nei, t2 + 0.7, 'fadeUp', { dur: 0.6 });

    // ---------- beat 3: the balance beam with the four needs
    const t3 = cue(3);
    tl.to(LA, { opacity: 0, duration: 0.45, ease: 'power2.in' }, t3 - 0.2);
    const LB = C2.layer(stage, tl, t3);
    const bs = K.svg(LB, { x: 0, y: 0, w: 1920, h: 1080 });
    const PVX = 960, PVY = 520, BW = 1040;
    const fulc = K.path(bs, `M ${PVX} ${PVY + 8} L ${PVX - 64} ${PVY + 110} L ${PVX + 64} ${PVY + 110} Z`, { fill: C.greenDark, stroke: 'none' });
    A.in(tl, fulc, t3 + 0.1, 'fadeUp', { dur: 0.5 });
    const beamWrap = K.el('div');
    Object.assign(beamWrap.style, { position: 'absolute', left: PVX - BW / 2 + 'px', top: PVY - 220 + 'px', width: BW + 'px', height: '230px', transformOrigin: `${BW / 2}px 220px` });
    const bar = K.el('div');
    Object.assign(bar.style, { position: 'absolute', left: '0px', top: '206px', width: BW + 'px', height: '24px', borderRadius: '12px', background: C.olive });
    beamWrap.appendChild(bar);
    LB.appendChild(beamWrap);
    A.in(tl, bar, t3 + 0.2, 'grow', { dur: 0.6 });
    tl.set(bar, { transformOrigin: '50% 50%' }, 0);
    const NEEDS = [['footprints', 'Physical<br>activity', 'physical activity', 0.35], ['puzzle', 'Mental<br>activity', 'mental activity', 0.5],
      ['dog', 'Natural<br>behaviors', 'natural behaviors', 0.75], ['bed', 'Rest', 'and rest', 0.95]];
    const NC = ['#d9912b', '#7a8f2e', '#3f6b22', '#4a6fa5'];
    let lo = t3 + 0.6;
    NEEDS.forEach(([ic, t, p, fb], k) => {
      const b = K.el('div', 'c2d-blk');
      Object.assign(b.style, { left: 70 + k * 245 + 'px', top: '22px' });
      const bd = K.el('div', 'bd');
      bd.style.background = NC[k];
      bd.appendChild(K.icon(ic));
      b.appendChild(bd);
      b.appendChild(K.el('div', 'lb', t));
      beamWrap.appendChild(b);
      const tt = clamp(at(3, p, fb, 0.35), lo, end(3) - 0.6);
      tl.fromTo(b, { opacity: 0, y: -140 }, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.in' }, tt);
      tl.fromTo(beamWrap, { rotation: k % 2 ? 3 : -3 }, { rotation: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)', immediateRender: false }, tt + 0.55);
      lo = tt + 0.4;
    });
    const bal = C2.pill(LB, 'scale', 'Balance', { x: PVX, y: PVY + 140, center: true, variant: 'green', size: 34 });
    A.in(tl, bal, Math.min(lo + 0.6, cue(4) - 0.9), 'fadeUp', { dur: 0.5 });

    // ---------- beat 4: tips to too little, then too much, with the examples under each side
    const t4 = cue(4);
    A.out(tl, bal, t4, 'fade', { dur: 0.3 });
    function column(x, head, mood, items, col, icon) {
      const c = K.el('div', 'c2d-col');
      Object.assign(c.style, { left: x + 'px', top: '690px' });
      const hh = K.el('div', 'c2d-colh');
      const b = K.el('div', 'c2-badge');
      Object.assign(b.style, { position: 'relative', width: '62px', height: '62px', background: col, color: '#fff' });
      b.appendChild(K.icon(icon));
      hh.appendChild(b);
      const tt = K.el('div', 't', K.md(head));
      tt.style.color = col;
      hh.appendChild(tt);
      c.appendChild(hh);
      const md = K.el('div', 'c2d-ex', K.md('**' + mood + '**'));
      md.style.background = C.amberPale;
      md.style.borderColor = C.amberPale;
      c.appendChild(md);
      const grid = K.el('div');
      Object.assign(grid.style, { display: 'grid', gridTemplateColumns: 'auto auto', gap: '12px 12px' });
      const ex = items.map(t => {
        const e = K.el('div', 'c2d-ex');
        const dot = K.el('i');
        dot.style.background = col;
        e.appendChild(dot);
        e.appendChild(K.el('span', null, t));
        grid.appendChild(e);
        return e;
      });
      c.appendChild(grid);
      LB.appendChild(c);
      return { c, hh, md, ex };
    }
    const little = column(100, 'Too little', 'Frustrated, restless',
      ['Physical activity', 'Mental stimulation', 'Natural behaviors', 'Breed-specific needs'], C.amber, 'battery-low');
    const much = column(1000, 'Too much', 'Overtired, highly activated',
      ['Physical activity', '“Wear the dog out”', 'Mental stimulation', 'Not enough rest'], C.red, 'zap');
    const tLit = clamp(at(4, "doesn't have enough", 0.1, 0.3), t4 + 0.2, end(4) - 8);
    tl.to(beamWrap, { rotation: -7, duration: 0.9, ease: 'power2.inOut' }, tLit);
    A.in(tl, little.hh, tLit + 0.3, 'fadeUp', { dur: 0.5 });
    A.in(tl, little.md, clamp(at(4, 'frustrated or restless', 0.3, 0.3), tLit + 0.6, end(4) - 7), 'fadeUp', { dur: 0.5 });
    A.in(tl, little.ex, tLit + 1.2, 'fadeUp', { dur: 0.45, stagger: 0.15 });
    const tMuch = clamp(at(4, 'constantly exercising', 0.5, 0.3), tLit + 3, end(4) - 3);
    tl.to(beamWrap, { rotation: 7, duration: 1.1, ease: 'power2.inOut' }, tMuch);
    A.dim(tl, little.c, tMuch, 0.35);
    A.in(tl, much.hh, tMuch + 0.3, 'fadeUp', { dur: 0.5 });
    A.in(tl, much.ex, tMuch + 0.8, 'fadeUp', { dur: 0.45, stagger: 0.15 });
    A.in(tl, much.md, clamp(at(4, 'overtired or highly activated', 0.85, 0.3), tMuch + 1.6, end(4)), 'fadeUp', { dur: 0.5 });

    // ---------- beat 5: three dogs, each with its sweet spot in a different place
    const t5 = cue(5);
    tl.to(LB, { opacity: 0, duration: 0.45, ease: 'power2.in' }, t5 - 0.2);
    const LC = C2.layer(stage, tl, t5);
    const DOGS = [['collie', 0.18, 0.42], ['terrier', 0.5, 0.82], ['dane', 0.08, 0.3]];
    const sils = DOGS.map(([n, a, b], k) => {
      const w = K.el('div', 'c2d-sil');
      Object.assign(w.style, { left: 150 + k * 560 + 'px', top: '330px' });
      const im = K.el('img');
      im.src = '../assets/img/sil_' + n + '.png';
      w.appendChild(im);
      const mini = K.el('div', 'c2d-mini');
      const z = K.el('div', 'z');
      Object.assign(z.style, { left: a * 100 + '%', width: (b - a) * 100 + '%' });
      const kn = K.el('div', 'k');
      kn.style.left = ((a + b) / 2) * 360 - 24 + 'px';
      mini.appendChild(z);
      mini.appendChild(kn);
      w.appendChild(mini);
      const ml = K.el('div', 'c2d-mlab');
      ml.appendChild(K.el('span', null, 'Less'));
      ml.appendChild(K.el('span', null, 'More'));
      w.appendChild(ml);
      LC.appendChild(w);
      A.in(tl, w, t5 + 0.2 + k * 0.35, 'fadeUp', { dur: 0.6 });
      tl.fromTo(z, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'power2.out' }, t5 + 0.6 + k * 0.35);
      return w;
    });
    const diff = C2.put(LC, 'c2-big', 'Different for *each dog*', { x: 0, y: 760, w: 1920, align: 'center' });
    A.in(tl, diff, clamp(at(5, 'different for each dog', 0.7, 0.3), t5 + 1.2, end(5)), 'fadeUp', { dur: 0.6 });

    // ---------- beat 6: not simply more; the right balance for this dog
    const t6 = cue(6);
    tl.to(LC, { opacity: 0, duration: 0.45, ease: 'power2.in' }, t6 - 0.2);
    const LD = C2.layer(stage, tl, t6);
    const m1 = C2.pill(LD, 'dumbbell', 'More exercise', { x: 520, y: 340, size: 38, col: C.muted });
    const m2 = C2.pill(LD, 'puzzle', 'More enrichment', { x: 1010, y: 340, size: 38, col: C.muted });
    const tM1 = clamp(at(6, 'more exercise', 0.3, 0.3), t6 + 0.1, end(6) - 4);
    const tM2 = clamp(at(6, 'more enrichment', 0.42, 0.3), tM1 + 0.5, end(6) - 3.5);
    A.in(tl, m1, tM1, 'fadeUp', { dur: 0.5 });
    A.in(tl, m2, tM2, 'fadeUp', { dur: 0.5 });
    [[m1, 520, tM1], [m2, 1010, tM2]].forEach(([m, x, t]) => {
      const st = K.el('div', 'c2c-strike');
      Object.assign(st.style, { position: 'absolute', left: x - 12 + 'px', top: '377px', height: '8px', borderRadius: '4px', background: C.red, width: '0px' });
      LD.appendChild(st);
      tl.fromTo(st, { width: 0 }, { width: () => m.offsetWidth + 24, duration: 0.4, ease: 'power2.inOut', immediateRender: false }, t + 0.6);
      tl.to(m, { opacity: 0.5, duration: 0.3 }, t + 0.8);
    });
    const sc = C2.badge(LD, 'scale', 960, 560, 150, C.green, '#fff');
    const right = C2.put(LD, 'c2-big', 'The *right balance* for this dog', { x: 0, y: 680, w: 1920, align: 'center' });
    const tR = clamp(at(6, 'right balance', 0.7, 0.3), tM2 + 1.0, end(6) - 0.5);
    A.in(tl, sc, tR, 'pop', { dur: 0.6 });
    A.in(tl, right, tR + 0.2, 'fadeUp', { dur: 0.7 });
    tl.to(sc, { rotation: -8, duration: 0.5, yoyo: true, repeat: 3, ease: 'sine.inOut' }, tR + 0.6);

    // ---------- beat 7: more on this later
    const mk = C2.bookmark(LD, 'More on this later', 0, 820);
    mk.style.left = '50%';
    gsap.set(mk, { xPercent: -50 });
    A.in(tl, mk, cue(7) + 0.1, 'fadeUp', { dur: 0.6 });
  });

  // ================================================================== ch02s08 Emotions and recovery
  registerScene('ch02s08', ctx => {
    const { stage, tl, cue, end, dur } = ctx;
    C2.style(stage);
    css(stage);
    const at = (i, p, fb, lead) => sayAt(ctx, i, p, fb, lead);
    C2.areaHead(ctx, 2, 'Emotions & Recovery');

    // ---------- beat 0: the pot at right
    const P = C2.makePot(stage, { cx: 1480, y: 470, s: 0.82, level: 0.4 });
    A.in(tl, P.wrap, cue(0) + 0.3, 'fadeUp', { dur: 0.8 });
    P.waves(tl, 0, dur);

    // ---------- beat 1: the mood graph; a difficult conversation pushes the line up
    const LA = C2.layer(stage, tl, cue(1));
    const g = K.svg(LA, { x: 0, y: 0, w: 1920, h: 1080 });
    const GX = 200, GY = 840, GW = 860, GT = 400;
    const axes = K.path(g, `M ${GX} ${GT} L ${GX} ${GY} L ${GX + GW} ${GY}`, { stroke: '#b9c6ad', 'stroke-width': 6, fill: 'none' });
    const t1 = cue(1);
    A.draw(tl, axes, t1 + 0.1, 0.8);
    const yl = C2.put(LA, 'c2d-gl', 'How upset', { x: GX - 100, y: GT - 52 });
    Object.assign(yl.style, { left: GX - 160 + 'px', top: GT + 120 + 'px', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' });
    const xl = C2.put(LA, 'c2d-gl', 'time', { x: GX + GW - 60, y: GY + 18 });
    A.in(tl, [yl, xl], t1 + 0.5, 'fade', { dur: 0.4 });
    const who = C2.badge(LA, 'user', GX - 10, GY + 70, 0, '#fff', C.greenDark);
    const whoW = 96;
    Object.assign(who.style, { left: GX - 140 + 'px', top: GY - 140 + 'px', width: whoW + 'px', height: whoW + 'px', border: '5px solid var(--green)' });
    const whoDog = C2.badge(LA, 'dog', 0, 0, whoW, '#fff', C.greenDark);
    Object.assign(whoDog.style, { left: GX - 140 + 'px', top: GY - 140 + 'px', border: '5px solid var(--green)' });
    gsap.set(whoDog, { opacity: 0 });
    A.in(tl, who, t1 + 0.4, 'pop', { dur: 0.5 });
    const C0 = 320, C1x = 520; // conversation spans x C0..C1x
    const zone = K.rect(g, C0, GT, C1x - C0, GY - GT, { fill: C.amberPale, opacity: 0.9 });
    g.insertBefore(zone, axes);
    const conv = K.el('div', 'c2d-band');
    Object.assign(conv.style, { left: (C0 + C1x) / 2 - 200 + 'px', top: GT - 126 + 'px', width: '400px' });
    const cb = C2.badge(conv, 'message-circle-warning', 0, 0, 72, C.amber, '#fff');
    cb.style.position = 'relative';
    cb.style.left = cb.style.top = '';
    conv.appendChild(K.el('div', 't', 'Difficult conversation'));
    LA.appendChild(conv);
    const tConv = clamp(at(1, 'difficult conversation', 0.25, 0.3), t1 + 0.6, end(1) - 2);
    tl.fromTo(zone, { attr: { width: 0 } }, { attr: { width: C1x - C0 }, duration: 0.8, ease: 'power2.out', immediateRender: false }, tConv);
    tl.set(zone, { attr: { width: 0 } }, 0);
    A.in(tl, conv, tConv + 0.2, 'fade', { dur: 0.5 });
    const L1 = K.path(g, `M ${GX} 770 C 240 768 280 772 ${C0} 768 C 400 760 450 520 ${C1x} 480`, { stroke: C.red, 'stroke-width': 10, fill: 'none' });
    A.draw(tl, L1, tConv + 0.4, 1.6, { ease: 'power1.inOut' });

    // ---------- beat 2: the conversation ends; the feeling stays
    const t2 = cue(2);
    const L2 = K.path(g, `M ${C1x} 480 C 600 470 690 490 760 500`, { stroke: C.red, 'stroke-width': 10, fill: 'none' });
    const endL = K.line(g, C1x, GT, C1x, GY, { stroke: C.amber, 'stroke-width': 5, 'stroke-dasharray': '12 10' });
    const tEnd = clamp(at(2, 'conversation ends', 0.15, 0.2), t2, end(2) - 2);
    A.draw(tl, endL, tEnd, 0.4);
    A.draw(tl, L2, tEnd + 0.5, 1.4, { ease: 'none' });
    const still = C2.pill(LA, null, 'Still upset', { x: 560, y: 380, variant: 'red', size: 30 });
    A.in(tl, still, clamp(at(2, "don't necessarily disappear", 0.6, 0.3), tEnd + 1.0, end(2)), 'fadeUp', { dur: 0.5 });

    // ---------- beat 3: someone else approaches; a snappy reply
    const t3 = cue(3);
    const XS = 780;
    const someone = C2.badge(LA, 'user', XS, GY - 70, 88, C.pale, C.greenDark);
    const tSome = clamp(at(3, 'someone else approaches', 0.15, 0.3), t3, end(3) - 3);
    tl.fromTo(someone, { opacity: 0, x: 120 }, { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' }, tSome);
    const L3 = K.path(g, `M 760 500 C 780 500 790 430 810 420 C 830 410 850 500 ${GX + GW - 20} 520`, { stroke: C.red, 'stroke-width': 10, fill: 'none' });
    const tSnap = clamp(at(3, 'shorter or snappier', 0.55, 0.3), tSome + 0.9, end(3) - 0.8);
    A.draw(tl, L3, tSnap - 0.3, 1.2);
    const burst = K.group(g);
    K.path(burst, 'M 0 -62 L 16 -24 L 58 -36 L 30 -4 L 62 26 L 18 22 L 10 64 L -10 26 L -52 40 L -28 6 L -60 -24 L -18 -22 Z', { fill: C.red, stroke: '#fff', 'stroke-width': 5 });
    K.svgText(burst, 0, 14, '!', { 'font-size': 52, 'font-weight': 800, 'font-family': 'Rubik', fill: '#fff', 'text-anchor': 'middle' });
    gsap.set(burst, { x: 880, y: 330 });
    tl.fromTo(burst, { opacity: 0, scale: 0.3, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(2.4)', immediateRender: false }, tSnap);
    tl.set(burst, { opacity: 0 }, 0);
    const snp = C2.pill(LA, null, 'Snappier', { x: 830, y: 220, variant: 'red', size: 30 });
    snp.style.top = '226px';
    A.in(tl, snp, tSnap + 0.3, 'fadeUp', { dur: 0.5 });

    // ---------- beat 4: dogs too
    const t4 = cue(4);
    tl.to(who, { opacity: 0, scale: 0.7, duration: 0.35, ease: 'power2.in' }, t4 + 0.1);
    tl.fromTo(whoDog, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)', immediateRender: false }, t4 + 0.4);
    tl.to(someone, { background: C.amberPale, duration: 0.3 }, t4 + 0.4);
    const sim = C2.pill(LA, 'dog', 'Dogs can feel it too', { x: 560, y: 900, center: true, variant: 'green', size: 32 });
    sim.style.top = '890px';
    A.in(tl, sim, t4 + 0.8, 'fadeUp', { dur: 0.6 });

    // ---------- beat 5: four emotions drip into the pot; the water rises
    const t5 = cue(5);
    tl.to(LA, { opacity: 0, duration: 0.45, ease: 'power2.in' }, t5 - 0.2);
    const LB = C2.layer(stage, tl, t5);
    const EM = [['frown', 'Fear', 'Fear', 0.05], ['cloud-drizzle', 'Anxiety', 'anxiety', 0.18], ['angry', 'Frustration', 'frustration', 0.32], ['zap', 'Stressful experiences', 'repeated stressful', 0.5]];
    let lo = t5 + 0.2, L = 0.4;
    EM.forEach(([ic, t, p, fb], k) => {
      const x = 120 + (k % 2) * 440, y = 330 + Math.floor(k / 2) * 120;
      const c = C2.pill(LB, ic, t, { x, y, size: 34, col: C2.AREAS[2].col });
      const tt = clamp(at(5, p, fb, 0.3), lo, end(5) - 1.6);
      A.in(tl, c, tt, 'fadeRight', { dur: 0.5 });
      const land = P.drip(tl, x + 37, y + 37, tt + 0.3, C2.AREAS[2].col, 0.95);
      L += 0.085;
      P.setLevel(tl, L, land - 0.05, 0.6);
      lo = tt + 0.6;
    });

    // ---------- beat 6: a quiet event: no big reaction, still an effect
    const t6 = cue(6);
    const calm = C2.badge(LB, 'dog', 220, 680, 130, '#fff', C.greenDark);
    calm.style.border = '6px solid var(--green)';
    const ev = C2.badge(LB, 'bell', 380, 610, 70, C.amberPale, C.amber);
    A.in(tl, calm, t6 + 0.1, 'pop', { dur: 0.5 });
    const tEv = clamp(at(6, "doesn't have to produce", 0.3, 0.3), t6 + 0.5, end(6) - 3);
    A.in(tl, ev, tEv, 'pop', { dur: 0.45 });
    tl.to(ev, { rotation: 14, duration: 0.12, yoyo: true, repeat: 5 }, tEv + 0.4);
    const noR = C2.put(LB, 'c2-lab', 'No big reaction...', { x: 320, y: 676 });
    noR.style.fontSize = '34px';
    A.in(tl, noR, tEv + 0.9, 'fade', { dur: 0.5 });
    const tEff = clamp(at(6, 'to have an effect', 0.85, 0.3), tEv + 1.4, end(6) - 0.4);
    const land = P.drip(tl, 420, 610, tEff - 0.6, C2.AREAS[2].col, 0.8);
    P.setLevel(tl, L + 0.06, land, 0.8);
    L += 0.06;
    const eff = C2.put(LB, 'c2-lab', '**...still an effect**', { x: 320, y: 724 });
    eff.style.fontSize = '38px';
    eff.style.color = 'var(--green-dark)';
    A.in(tl, eff, tEff, 'fadeUp', { dur: 0.5 });

    // ---------- beat 7: limited opportunity for recovery; next chapter
    const t7 = cue(7);
    A.dim(tl, [calm, ev, noR, eff], t7, 0.25);
    const rec = C2.pill(LB, 'hourglass', 'Limited opportunity for *recovery*', { x: 120, y: 840, size: 34, col: C.amber });
    rec.style.top = '836px';
    const tRec = clamp(at(7, 'enough time to recover', 0.55, 0.4), t7 + 0.3, end(7) - 2);
    A.in(tl, rec, tRec, 'fadeRight', { dur: 0.6 });
    tl.to(rec.querySelector('.ic'), { rotation: 180, duration: 0.8, ease: 'power2.inOut' }, tRec + 0.6);
    const mk = C2.bookmark(LB, 'Next chapter', 0, 0, 'arrow-right');
    Object.assign(mk.style, { left: '1340px', top: '890px' });
    A.in(tl, mk, clamp(at(7, 'next chapter', 0.92, 0.4), tRec + 0.8, end(7)), 'fadeLeft', { dur: 0.6 });
  });
})();
