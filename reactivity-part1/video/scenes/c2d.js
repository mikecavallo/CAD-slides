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
  .c2d-step { position: absolute; width: 310px; height: 470px; background: #fff; border-radius: 26px; border: 1px solid #e6e9e1; box-shadow: var(--shadow-soft); }
  .c2d-step .hd { position: absolute; left: 22px; right: 18px; top: 22px; display: flex; gap: 14px; align-items: flex-start; }
  .c2d-step .hd .n { width: 44px; height: 44px; border-radius: 50%; background: var(--green-pale); color: var(--green-dark); display: grid; place-items: center;
    font: 700 26px/1 var(--font-head); flex: 0 0 auto; }
  .c2d-step .hd .t { font: 700 28px/1.15 var(--font-body); color: var(--ink); padding-top: 6px; }
  .c2d-step .sc { position: absolute; left: 14px; top: 120px; width: 280px; height: 230px; }
  .c2d-step .mt { position: absolute; left: 22px; right: 22px; bottom: 26px; }
  .c2d-step .ml { font: 600 26px/1 var(--font-body); color: var(--muted); margin-bottom: 10px; }
  .c2d-step .tr { height: 26px; border-radius: 13px; background: #eef1ea; overflow: hidden; }
  .c2d-step .fl { height: 100%; border-radius: 13px; background: var(--red); }
  .c2d-burst { position: absolute; left: 100px; top: -6px; width: 64px; height: 64px; display: grid; place-items: center; color: #fff;
    font: 800 44px/1 var(--font-head); background: var(--red);
    clip-path: polygon(50% 0, 62% 30%, 96% 22%, 74% 50%, 98% 78%, 62% 70%, 50% 100%, 38% 70%, 4% 78%, 26% 50%, 4% 22%, 38% 30%); }
  .c2d-leg { position: absolute; display: flex; align-items: center; gap: 16px; padding: 10px 26px 10px 10px; border-radius: 999px; background: #fff;
    border: 1px solid #e6e9e1; box-shadow: var(--shadow-soft); }
  .c2d-leg .lb { position: relative; width: 60px; height: 60px; border-radius: 50%; border: 4px solid var(--green); color: var(--green-dark); background: #fff; }
  .c2d-leg .lb svg { position: absolute; left: 11px; top: 11px; width: 30px; height: 30px; stroke-width: 2.3; }
  .c2d-leg .sw { width: 48px; height: 10px; border-radius: 5px; background: var(--red); }
  .c2d-leg .tw { position: relative; height: 34px; width: 392px; }
  .c2d-leg .tx { position: absolute; left: 0; top: 0; font: 600 30px/34px var(--font-body); color: var(--ink); white-space: nowrap; }
  .c2d-leg .tx b { color: var(--red); }
  .c2d-ev { position: absolute; width: 220px; display: flex; flex-direction: column; align-items: center; gap: 8px; }
  .c2d-ev .b { width: 56px; height: 56px; border-radius: 50%; color: #fff; display: grid; place-items: center; border: 4px solid #fff; box-shadow: 0 6px 14px rgba(40,60,20,0.18); }
  .c2d-ev .b svg { width: 30px; height: 30px; stroke-width: 2.3; }
  .c2d-ev .t { font: 700 26px/1.12 var(--font-body); color: var(--ink); text-align: center; }
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
    const sR = C2.put(LA, 'c2d-say', 'More isn’t<br>always *better*', { x: TX1 - 470, y: TY + 120, w: 470, align: 'right' });
    A.in(tl, sR, tMore + 0.6, 'fadeUp', { dur: 0.6 });
    const tLess = clamp(at(0, 'less', 0.6, 0.2), tMore + 1.4, end(0) - 0.5);
    tl.to(knob, { x: TX0 + 40, duration: 1.1, ease: 'power2.inOut' }, tLess);
    const sL = C2.put(LA, 'c2d-say', 'Less doesn’t always<br>mean *calmer*', { x: TX0, y: TY + 120, w: 470 });
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
    const NEEDS = [['paws', 'Physical<br>activity', 'physical activity', 0.35], ['puzzle', 'Mental<br>activity', 'mental activity', 0.5],
      ['dog', 'Natural<br>behaviors', 'natural behaviors', 0.75], ['bed', 'Rest', 'and rest', 0.95]];
    const NC = ['#619537', '#5aa0c8', '#3f6b22', '#4a6fa5'];
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

    // ---------- beat 5: Goldilocks: not too little, not too much, just right; the beam levels
    const t5 = cue(5);
    tl.to([little.c, much.c], { opacity: 0, y: 20, duration: 0.45, ease: 'power2.in' }, t5 - 0.1);
    tl.to(beamWrap, { rotation: 0, duration: 1.0, ease: 'elastic.out(1, 0.6)' }, clamp(at(5, 'just right', 0.85, 0.3), t5 + 0.6, end(5) - 0.4));
    const gold = C2.put(LB, 'c2-big', 'Not too little. Not too much. *Just right.*', { x: 0, y: 720, w: 1920, align: 'center' });
    const gw = A.words(tl, gold, t5 + 0.2, { stagger: 0.09 });
    tl.to(bar, { background: C.green, duration: 0.5 }, clamp(at(5, 'just right', 0.85, 0.3), t5 + 0.6, end(5) - 0.4));
    const gl = C2.pill(LB, 'sparkles', 'Like Goldilocks', { x: 960, y: 640, center: true, variant: 'pale', size: 30 });
    A.in(tl, gl, t5 + 0.1, 'fadeUp', { dur: 0.5 });

    // ---------- beat 6: still on the beam: not simply more; the right balance for this dog
    const t6 = cue(6);
    tl.to([gold, gl], { opacity: 0, duration: 0.4, ease: 'power2.in' }, t6 - 0.1);
    const m1 = C2.pill(LB, 'dumbbell', 'More exercise', { x: 560, y: 690, size: 34, col: C.muted });
    const m2 = C2.pill(LB, 'puzzle', 'More enrichment', { x: 1000, y: 690, size: 34, col: C.muted });
    const tM1 = clamp(at(6, 'more exercise', 0.3, 0.3), t6 + 0.3, end(6) - 4);
    const tM2 = clamp(at(6, 'more enrichment', 0.42, 0.3), tM1 + 0.5, end(6) - 3.5);
    A.in(tl, m1, tM1, 'fadeUp', { dur: 0.5 });
    A.in(tl, m2, tM2, 'fadeUp', { dur: 0.5 });
    [[m1, 560, tM1], [m2, 1000, tM2]].forEach(([m, x, t]) => {
      const st = K.el('div');
      Object.assign(st.style, { position: 'absolute', left: x - 12 + 'px', top: '724px', height: '8px', borderRadius: '4px', background: C.red, width: '0px' });
      LB.appendChild(st);
      tl.fromTo(st, { width: 0 }, { width: () => m.offsetWidth + 24, duration: 0.4, ease: 'power2.inOut', immediateRender: false }, t + 0.6);
      tl.to(m, { opacity: 0.5, duration: 0.3 }, t + 0.8);
    });
    const right = C2.put(LB, 'c2-big', 'The *right balance* for this dog', { x: 0, y: 800, w: 1920, align: 'center' });
    const tR = clamp(at(5, 'right balance', 0.7, 0.3), tM2 + 1.0, end(5) - 0.5);
    A.in(tl, right, tR, 'fadeUp', { dur: 0.7 });
    tl.to(fulc, { fill: C.green, duration: 0.4, yoyo: true, repeat: 1 }, tR);

    // ---------- beat 6: more on this later, on the same slide
    const mk = C2.bookmark(LB, 'More on this later', 0, 0);
    Object.assign(mk.style, { left: '1500px', top: '300px' });
    A.in(tl, mk, cue(6) + 0.1, 'fadeLeft', { dur: 0.6 });
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

    // ---------- beats 1 to 4: the mood graph, laid out cleanly: a legend names the line, events sit under the time axis,
    // words sit above the line where nothing else is
    const LA = C2.layer(stage, tl, cue(1));
    const g = K.svg(LA, { x: 0, y: 0, w: 1920, h: 1080 });
    const GX = 190, GY = 790, GR = 1080, GT = 400; // axis origin, right end, top
    const ZX0 = 300, ZX1 = 500, SX = 790;          // conversation span, someone-else moment
    const t1 = cue(1);
    // legend: whose feelings the line shows
    const leg = K.el('div', 'c2d-leg');
    const lb = K.el('div', 'lb');
    const lbU = K.icon('user'), lbD = K.icon('dog');
    lb.appendChild(lbU);
    lb.appendChild(lbD);
    gsap.set(lbD, { opacity: 0 });
    leg.appendChild(lb);
    leg.appendChild(K.el('div', 'sw'));
    const legT = K.el('div', 'tx', 'How upset <b>you</b> feel');
    const legT2 = K.el('div', 'tx', 'How upset <b>your dog</b> feels');
    const tw = K.el('div', 'tw');
    tw.appendChild(legT);
    tw.appendChild(legT2);
    gsap.set(legT2, { opacity: 0 });
    leg.appendChild(tw);
    Object.assign(leg.style, { left: GX - 10 + 'px', top: '284px' });
    LA.appendChild(leg);
    A.in(tl, leg, t1 + 0.1, 'fadeRight', { dur: 0.6 });
    const axes = K.path(g, `M ${GX} ${GT} L ${GX} ${GY} L ${GR} ${GY} M ${GR - 18} ${GY - 13} L ${GR} ${GY} L ${GR - 18} ${GY + 13}`, { stroke: '#b9c6ad', 'stroke-width': 6, fill: 'none' });
    A.draw(tl, axes, t1 + 0.2, 0.8);
    const xl = C2.put(LA, 'c2d-gl', 'time', { x: GR - 60, y: GY + 18 });
    A.in(tl, xl, t1 + 0.8, 'fade', { dur: 0.4 });
    // the difficult conversation: a shaded stretch with its label under the axis
    const zone = K.rect(g, ZX0, GT, ZX1 - ZX0, GY - GT, { fill: C.amberPale, opacity: 0.95 });
    g.insertBefore(zone, axes);
    const ev1 = K.el('div', 'c2d-ev');
    const e1b = K.el('div', 'b');
    e1b.style.background = C.amber;
    e1b.appendChild(K.icon('message-circle-warning'));
    ev1.appendChild(e1b);
    ev1.appendChild(K.el('div', 't', 'Difficult<br>conversation'));
    Object.assign(ev1.style, { left: (ZX0 + ZX1) / 2 - 110 + 'px', top: GY + 14 + 'px' });
    LA.appendChild(ev1);
    const tConv = clamp(at(1, 'difficult conversation', 0.25, 0.3), t1 + 0.6, end(1) - 2);
    tl.fromTo(zone, { attr: { width: 0 } }, { attr: { width: ZX1 - ZX0 }, duration: 0.8, ease: 'power2.out', immediateRender: false }, tConv);
    tl.set(zone, { attr: { width: 0 } }, 0);
    A.in(tl, ev1, tConv + 0.2, 'fadeUp', { dur: 0.5 });
    const L1 = K.path(g, `M ${GX} 730 C 240 728 270 732 ${ZX0} 728 C 380 720 430 500 ${ZX1} 470`, { stroke: C.red, 'stroke-width': 10, fill: 'none' });
    A.draw(tl, L1, tConv + 0.4, 1.6, { ease: 'power1.inOut' });

    // beat 2: the conversation ends, the feeling stays up
    const t2 = cue(2);
    const endL = K.line(g, ZX1, GT, ZX1, GY, { stroke: C.amber, 'stroke-width': 5, 'stroke-dasharray': '12 10' });
    const tEnd = clamp(at(2, 'conversation ends', 0.15, 0.2), t2, end(2) - 2);
    A.draw(tl, endL, tEnd, 0.4);
    const L2 = K.path(g, `M ${ZX1} 470 C 590 460 690 478 ${SX - 20} 490`, { stroke: C.red, 'stroke-width': 10, fill: 'none' });
    A.draw(tl, L2, tEnd + 0.5, 1.4, { ease: 'none' });
    const still = C2.pill(LA, null, 'Still upset', { x: 645, y: 0, center: true, variant: 'red', size: 28 });
    still.style.top = '370px';
    A.in(tl, still, clamp(at(2, "don't necessarily disappear", 0.6, 0.3), tEnd + 1.0, end(2)), 'fadeUp', { dur: 0.5 });

    // beat 3: someone else approaches (an event under the axis); the line spikes: snappier
    const t3 = cue(3);
    const tSome = clamp(at(3, 'someone else approaches', 0.15, 0.3), t3, end(3) - 3);
    const someL = K.line(g, SX, GT, SX, GY, { stroke: '#9fb38d', 'stroke-width': 5, 'stroke-dasharray': '12 10' });
    const ev2 = K.el('div', 'c2d-ev');
    const e2b = K.el('div', 'b');
    e2b.style.background = C.greenDark;
    e2b.appendChild(K.icon('user'));
    ev2.appendChild(e2b);
    ev2.appendChild(K.el('div', 't', 'Someone else<br>approaches'));
    Object.assign(ev2.style, { left: SX - 110 + 'px', top: GY + 14 + 'px' });
    LA.appendChild(ev2);
    A.draw(tl, someL, tSome, 0.4);
    A.in(tl, ev2, tSome + 0.2, 'fadeUp', { dur: 0.5 });
    const tSnap = clamp(at(3, 'shorter or snappier', 0.55, 0.3), tSome + 0.9, end(3) - 0.8);
    const L3 = K.path(g, `M ${SX - 20} 490 C ${SX - 5} 492 ${SX} 430 ${SX + 18} 420 C ${SX + 40} 412 ${SX + 60} 500 ${GR - 30} 520`, { stroke: C.red, 'stroke-width': 10, fill: 'none' });
    A.draw(tl, L3, tSnap - 0.3, 1.2);
    const burst = K.el('div', 'c2d-burst', '!');
    Object.assign(burst.style, { left: SX + 34 + 'px', top: '362px' });
    LA.appendChild(burst);
    tl.fromTo(burst, { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(2.4)' }, tSnap);
    const snp = C2.pill(LA, null, 'Snappier', { x: SX + 112, y: 366, variant: 'red', size: 28 });
    A.in(tl, snp, tSnap + 0.3, 'fadeRight', { dur: 0.5 });

    // beat 4: dogs too: the legend switches to the dog
    const t4 = cue(4);
    tl.to(lbU, { opacity: 0, duration: 0.3 }, t4 + 0.1);
    tl.fromTo(lbD, { opacity: 0, scale: 0.6, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(2)', immediateRender: false }, t4 + 0.35);
    tl.to(legT, { opacity: 0, duration: 0.3 }, t4 + 0.1);
    tl.fromTo(legT2, { opacity: 0 }, { opacity: 1, duration: 0.4, immediateRender: false }, t4 + 0.4);
    tl.to(leg, { scale: 1.05, transformOrigin: '0% 50%', duration: 0.3, yoyo: true, repeat: 1 }, t4 + 0.5);

    // ---------- beat 5: four emotions drip into the pot; the water rises
    const t5 = cue(5);
    tl.to(LA, { opacity: 0, duration: 0.45, ease: 'power2.in' }, t5 - 0.2);
    const LB = C2.layer(stage, tl, t5);
    const EM = [['frown', 'Fear', 'Fear', 0.05, C.red], ['cloud-drizzle', 'Anxiety', 'anxiety', 0.18, C.amber], ['angry', 'Frustration', 'frustration', 0.32, C.red], ['zap', 'Stressful experiences', 'repeated stressful', 0.5, C.amber]];
    let lo = t5 + 0.2, L = 0.4;
    EM.forEach(([ic, t, p, fb, col], k) => {
      const x = 120 + (k % 2) * 440, y = 330 + Math.floor(k / 2) * 120;
      const c = C2.pill(LB, ic, t, { x, y, size: 34, col });
      const tt = clamp(at(5, p, fb, 0.3), lo, end(5) - 1.6);
      A.in(tl, c, tt, 'fadeRight', { dur: 0.5 });
      const land = P.drip(tl, x + 37, y + 37, tt + 0.3, col, 0.95);
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
    const land = P.drip(tl, 420, 610, tEff - 0.6, C.amber, 0.8);
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
