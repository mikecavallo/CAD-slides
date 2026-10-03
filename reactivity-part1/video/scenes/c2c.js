// Chapter 2: physical health and pain. Pot and helpers come from window.C2 (c2_pot.js).
//   ch02s05  Physical health      the dog with five factor chips; a sleep chart (hours in 24); a person after a bad night with a
//                                  shrinking "What I can handle" bar, then the dog with the same bar; the pot lowers as things improve
//   ch02s06  Pain and discomfort  a magnifier finds hidden pain on the dog; a person with a headache and four everyday demands;
//                                  limping / crying / obviously injured struck through; seven examples around the dog; sudden change
//                                  and the vet card
(() => {
  const CSS = `
  .c2c-row { position: absolute; display: flex; align-items: center; gap: 22px; height: 92px; padding: 0 34px 0 14px; border-radius: 24px;
    background: #fff; border: 1px solid #e6e9e1; box-shadow: var(--shadow-soft); font: 700 34px/1 var(--font-body); color: var(--ink); white-space: nowrap; }
  .c2c-row .ic { width: 64px; height: 64px; border-radius: 50%; display: grid; place-items: center; flex: 0 0 auto; background: var(--red-pale); color: var(--red); }
  .c2c-row .ic svg { width: 36px; height: 36px; stroke-width: 2.2; }
  .c2c-ttl { position: absolute; font: 700 44px/1.1 var(--font-head); color: var(--ink); white-space: nowrap; }
  .c2c-ttl b { color: var(--green); }
  .c2c-who { position: absolute; display: flex; align-items: center; gap: 18px; font: 700 34px/1 var(--font-body); color: var(--ink); white-space: nowrap; }
  .c2c-who .ic { width: 70px; height: 70px; border-radius: 50%; background: var(--green-pale); color: var(--green-dark); display: grid; place-items: center; }
  .c2c-who .ic svg { width: 40px; height: 40px; stroke-width: 2.2; }
  .c2c-hr { position: absolute; font: 700 34px/1 var(--font-body); color: var(--ink); white-space: nowrap; }
  .c2c-tick { position: absolute; font: 600 26px/1 var(--font-body); color: var(--muted); white-space: nowrap; width: 80px; text-align: center; }
  .c2c-meter { position: absolute; }
  .c2c-meter .lab { font: 700 40px/1 var(--font-head); color: var(--ink); white-space: nowrap; margin-bottom: 24px; }
  .c2c-meter .track { position: relative; width: 900px; height: 64px; border-radius: 32px; background: #e9eee3; overflow: hidden; }
  .c2c-meter .fill { position: absolute; left: 0; top: 0; bottom: 0; width: 100%; border-radius: 32px; background: var(--green); }
  .c2c-small { position: absolute; display: flex; flex-direction: column; align-items: center; gap: 12px; width: 220px; }
  .c2c-small .lb { font: 700 28px/1.15 var(--font-body); color: var(--ink); text-align: center; }
  .c2c-strike { position: absolute; height: 8px; border-radius: 4px; background: var(--red); transform-origin: 0% 50%; }
  .c2c-ex { position: absolute; display: flex; flex-direction: column; align-items: center; gap: 10px; width: 200px; }
  .c2c-ex .lb { font: 700 30px/1 var(--font-body); color: var(--ink); white-space: nowrap; }
  .c2c-sud { position: absolute; width: 430px; display: flex; gap: 20px; align-items: flex-start; padding: 26px 28px; background: #fff; border-radius: 26px;
    border: 3px solid #f1dcb4; box-shadow: var(--shadow-soft); }
  .c2c-sud .ic { width: 70px; height: 70px; border-radius: 50%; background: var(--amber); color: #fff; display: grid; place-items: center; flex: 0 0 auto; }
  .c2c-sud .ic svg { width: 40px; height: 40px; stroke-width: 2.3; }
  .c2c-sud .t1 { font: 700 36px/1.1 var(--font-head); color: var(--ink); }
  .c2c-sud .t2 { font: 600 30px/1.25 var(--font-body); color: var(--ink-soft); margin-top: 8px; }
  .c2c-vet { position: absolute; display: flex; align-items: center; gap: 26px; padding: 30px 44px 30px 30px; border-radius: 30px;
    background: var(--green); color: #fff; box-shadow: var(--shadow); }
  .c2c-vet .vi { width: 104px; height: 104px; border-radius: 50%; background: rgba(255,255,255,0.18); display: grid; place-items: center; flex: 0 0 auto; }
  .c2c-vet .vi svg { width: 58px; height: 58px; stroke-width: 2.1; }
  .c2c-vet .t1 { font: 700 46px/1.15 var(--font-head); white-space: nowrap; }
  .c2c-vet .t2 { font: 500 32px/1.2 var(--font-body); margin-top: 10px; white-space: nowrap; opacity: 0.92; }
  `;
  const css = stage => stage.appendChild(K.el('style', null, CSS));
  const { sayAt, clamp } = C1;
  const { C } = C2;

  function row(parent, icon, text, x, y, o = {}) {
    const n = K.el('div', 'c2c-row');
    const ic = K.el('div', 'ic');
    if (o.bg) ic.style.background = o.bg;
    if (o.fg) ic.style.color = o.fg;
    ic.appendChild(K.icon(icon));
    n.appendChild(ic);
    n.appendChild(K.el('span', null, K.md(text)));
    Object.assign(n.style, { left: x + 'px', top: y + 'px' });
    parent.appendChild(n);
    return n;
  }
  /** "What I can handle" meter. Returns {root, fill, lab}. */
  function meter(parent, label, x, y) {
    const m = K.el('div', 'c2c-meter');
    Object.assign(m.style, { left: x + 'px', top: y + 'px' });
    const lab = K.el('div', 'lab', K.md(label));
    const tr = K.el('div', 'track');
    const fill = K.el('div', 'fill');
    tr.appendChild(fill);
    m.appendChild(lab);
    m.appendChild(tr);
    parent.appendChild(m);
    return { root: m, fill, lab };
  }
  /** Small icon badge with a caption under it, centred on (cx, y top). */
  function small(parent, icon, text, cx, y, bg, fg, size = 120) {
    const n = K.el('div', 'c2c-small');
    Object.assign(n.style, { left: cx - 110 + 'px', top: y + 'px' });
    const b = K.el('div', 'c2-badge');
    Object.assign(b.style, { position: 'relative', width: size + 'px', height: size + 'px', background: bg, color: fg });
    b.appendChild(K.icon(icon));
    n.appendChild(b);
    n.appendChild(K.el('div', 'lb', K.md(text)));
    parent.appendChild(n);
    return { n, b };
  }

  // ================================================================== ch02s05 Physical health
  registerScene('ch02s05', ctx => {
    const { stage, tl, cue, end, dur } = ctx;
    C2.style(stage);
    css(stage);
    const at = (i, p, fb, lead) => sayAt(ctx, i, p, fb, lead);
    C2.areaHead(ctx, 0, 'Physical Health');

    // ---------- beat 0: the dog
    const LA = C2.layer(stage);
    const sv = K.svg(LA, { x: 0, y: 0, w: 1920, h: 1080 });
    const D = C2.dog(sv, 560, 620, 1.35);
    A.in(tl, D.outer, cue(0) + 0.2, 'fadeUp', { dur: 0.8 });
    C2.wag(tl, D, cue(0) + 0.8, cue(2));

    // ---------- beat 1: five chips, one per word
    const F = [['moon', 'Sleep', 'Sleep'], ['stethoscope', 'Illness or medical changes', 'illness'], ['utensils', 'Nutrition', 'nutrition'],
      ['pill', 'Medication effects or changes', 'medication'], ['weight', 'Other physical changes', 'other physical']];
    let lo = cue(1);
    const rows = F.map(([ic, t, p], k) => {
      const r = row(LA, ic, t, 1010, 276 + k * 122);
      const tt = clamp(at(1, p, 0.1 + k * 0.14, 0.25), lo, end(1) - 0.4);
      A.in(tl, r, tt, 'fadeLeft', { dur: 0.55 });
      lo = tt + 0.3;
      return r;
    });
    tl.to(D.head, { rotation: -8, svgOrigin: '300 120', duration: 0.5, yoyo: true, repeat: 1, ease: 'sine.inOut' }, cue(1) + 1.2);

    // ---------- beat 2: sleep chart, hours in 24
    const t2 = cue(2);
    tl.to(LA, { opacity: 0, duration: 0.45, ease: 'power2.in' }, t2 - 0.2);
    const LB = C2.layer(stage, tl, t2);
    const ttl = C2.put(LB, 'c2c-ttl', 'Sleep in a *24-hour* day', { x: 100, y: 278 });
    A.in(tl, ttl, t2 + 0.15, 'fadeUp', { dur: 0.6 });
    const X0 = 440, PXH = 50, YS = [430, 580, 730];
    const cs = K.svg(LB, { x: 0, y: 0, w: 1920, h: 1080 });
    // axis ticks every 6 hours
    const axis = K.group(cs);
    [0, 6, 12, 18, 24].forEach(hh => {
      K.line(axis, X0 + hh * PXH, 380, X0 + hh * PXH, 820, { stroke: '#dfe5d8', 'stroke-width': 3, 'stroke-dasharray': '8 10' });
      const tk = C2.put(LB, 'c2c-tick', hh + 'h', { x: X0 + hh * PXH - 40, y: 836 });
      A.in(tl, tk, t2 + 0.5, 'fade', { dur: 0.5 });
    });
    A.in(tl, axis, t2 + 0.4, 'fade', { dur: 0.5 });
    const BARS = [
      { who: 'Adult dogs', icon: 'dog', a: 12, b: 16, txt: '12 to 16 hours', p: 'adult dogs', fb: 0.08 },
      { who: 'Puppies', icon: 'paw-print', a: 18, b: 20, txt: '18 to 20 hours', p: 'Puppies', fb: 0.5 },
      { who: 'Older dogs', icon: 'hourglass', a: 16, b: 22.6, txt: 'Often more', p: 'older dogs', fb: 0.85, more: true },
    ];
    lo = t2 + 0.6;
    BARS.forEach((bb, k) => {
      const y = YS[k];
      const who = K.el('div', 'c2c-who');
      const ic = K.el('div', 'ic');
      ic.appendChild(K.icon(bb.icon));
      who.appendChild(ic);
      who.appendChild(K.el('span', null, bb.who));
      Object.assign(who.style, { left: '100px', top: y - 35 + 'px' });
      LB.appendChild(who);
      K.rect(cs, X0, y - 28, 24 * PXH, 56, { rx: 28, fill: '#eef2ea' });
      const solid = K.rect(cs, X0, y - 28, bb.a * PXH, 56, { rx: 28, fill: '#3d5f8f' });
      const range = K.rect(cs, X0 + bb.a * PXH - 28, y - 28, (bb.b - bb.a) * PXH + 28, 56, { rx: 28, fill: bb.more ? 'url(#c2cfade)' : '#8ea9cf' });
      const hr = C2.put(LB, 'c2c-hr', bb.txt, { x: X0 + bb.b * PXH + 26, y: y - 17 });
      const t = clamp(at(2, bb.p, bb.fb, 0.3), lo, end(2) - 1.2);
      A.in(tl, who, t, 'fadeRight', { dur: 0.5 });
      tl.fromTo(solid, { attr: { width: 0 } }, { attr: { width: bb.a * PXH }, duration: 0.9, ease: 'power2.out', immediateRender: false }, t + 0.1);
      tl.set(solid, { attr: { width: 0 } }, 0);
      A.in(tl, range, t + 0.9, 'grow', { dur: 0.5 });
      A.in(tl, hr, t + 1.1, 'fadeRight', { dur: 0.5 });
      if (bb.more) {
        const chev = K.path(cs, `M ${X0 + bb.b * PXH - 6} ${y - 22} L ${X0 + bb.b * PXH + 16} ${y} L ${X0 + bb.b * PXH - 6} ${y + 22}`, { stroke: '#3d5f8f', 'stroke-width': 7, fill: 'none' });
        A.in(tl, chev, t + 1.2, 'fadeRight', { dur: 0.5 });
        hr.style.left = X0 + bb.b * PXH + 34 + 'px';
        const mv = C2.svgIcon(cs, 'moon', X0 + 8 * PXH, y, 34, { stroke: '#fff', 'stroke-width': 2.4 });
        A.in(tl, mv, t + 0.8, 'fade', { dur: 0.4 });
      } else {
        const mv = C2.svgIcon(cs, 'moon', X0 + 1 * PXH, y, 34, { stroke: '#fff', 'stroke-width': 2.4 });
        A.in(tl, mv, t + 0.8, 'fade', { dur: 0.4 });
      }
      lo = t + 1.0;
    });
    const defs = K.svgEl('defs', {}, cs);
    defs.innerHTML = '<linearGradient id="c2cfade" x1="0" x2="1"><stop offset="0" stop-color="#3d5f8f"/><stop offset="0.6" stop-color="#8ea9cf"/><stop offset="1" stop-color="#8ea9cf" stop-opacity="0.35"/></linearGradient>';

    // ---------- beat 3: a person after a bad night, getting sick, a skipped meal; the bar of what they can handle shrinks
    const t3 = cue(3);
    tl.to(LB, { opacity: 0, duration: 0.45, ease: 'power2.in' }, t3 - 0.2);
    const LC = C2.layer(stage, tl, t3);
    const PCX = 400, PCY = 560;
    const person = C2.badge(LC, 'user', PCX, PCY, 230, '#fff', C.greenDark);
    person.style.border = '6px solid var(--green)';
    const dogB = C2.badge(LC, 'dog', PCX, PCY, 230, '#fff', C.greenDark);
    dogB.style.border = '6px solid var(--green)';
    gsap.set(dogB, { opacity: 0 });
    A.in(tl, person, t3 + 0.1, 'pop', { dur: 0.6 });
    const BAD = [['bed', 'Bad night', 'terrible night', 0.2, 230, 360], ['bug', 'Getting sick', 'getting sick', 0.36, 160, 760], ['utensils-crossed', 'Skipped meal', 'healthy food', 0.5, 640, 760]];
    lo = t3 + 0.4;
    const bads = BAD.map(([ic, t, p, fb, x, y]) => {
      const s = small(LC, ic, t, x, y - 60, C.amberPale, C.amber, 96);
      const tt = clamp(at(3, p, fb, 0.3), lo, end(3) - 3);
      A.in(tl, s.n, tt, 'pop', { dur: 0.5 });
      lo = tt + 0.4;
      return s.n;
    });
    const M = meter(LC, 'What you can handle', 880, 470);
    const tM = clamp(at(3, 'Things you normally handle', 0.6, 0.3), lo, end(3) - 2);
    A.in(tl, M.root, tM, 'fadeLeft', { dur: 0.6 });
    const tShrink = clamp(at(3, 'bother you much more', 0.9, 0.2), tM + 1.0, end(3) - 0.6);
    tl.to(M.fill, { width: '34%', background: C.amber, duration: 1.2, ease: 'power2.inOut' }, tShrink);

    // ---------- beat 4: the person becomes the dog; the same bar refills and shrinks again
    const t4 = cue(4);
    tl.to(bads, { opacity: 0, scale: 0.8, duration: 0.4, stagger: 0.05, ease: 'power2.in' }, t4);
    tl.to(person, { opacity: 0, scale: 0.8, duration: 0.4, ease: 'power2.in' }, t4);
    tl.fromTo(dogB, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.8)', immediateRender: false }, t4 + 0.3);
    const lab2 = K.el('div', 'lab', 'What the dog can handle');
    lab2.style.cssText = 'position:absolute;left:0;top:0;';
    M.root.appendChild(lab2);
    gsap.set(lab2, { opacity: 0 });
    tl.to(M.lab, { opacity: 0, duration: 0.3 }, t4 + 0.2);
    tl.fromTo(lab2, { opacity: 0 }, { opacity: 1, duration: 0.4, immediateRender: false }, t4 + 0.45);
    tl.to(M.fill, { width: '100%', background: C.green, duration: 0.6, ease: 'power2.out' }, t4 + 0.4);
    tl.to(M.fill, { width: '34%', background: C.amber, duration: 1.1, ease: 'power2.inOut' }, t4 + 1.2);
    const same = C2.pill(LC, 'repeat', 'Same change in tolerance', { x: 880, y: 680, variant: 'pale' });
    A.in(tl, same, t4 + 1.6, 'fadeUp', { dur: 0.6 });

    // ---------- beat 5: not automatic; improving them lowers the water
    const t5 = cue(5);
    tl.to(LC, { opacity: 0, duration: 0.45, ease: 'power2.in' }, t5 - 0.2);
    const LD = C2.layer(stage, tl, t5);
    const P = C2.makePot(LD, { cx: 1360, y: 430, s: 0.9, level: 0.74 });
    A.in(tl, P.wrap, t5 + 0.1, 'fadeUp', { dur: 0.7 });
    P.waves(tl, t5, dur);
    const na = C2.pill(LD, 'circle-slash', 'Not an automatic cause', { x: 100, y: 330, variant: 'amber', size: 36 });
    A.in(tl, na, clamp(at(5, "don't automatically", 0.1, 0.2), t5 + 0.3, end(5) - 4), 'fadeRight', { dur: 0.6 });
    const tImp = clamp(at(5, 'improving them', 0.55, 0.3), t5 + 1.6, end(5) - 2);
    const icons = F.map(([ic], k) => {
      const b = C2.badge(LD, ic, 150 + k * 112, 520, 88, C.green, '#fff');
      A.in(tl, b, tImp + k * 0.12, 'pop', { dur: 0.45 });
      return b;
    });
    P.setLevel(tl, 0.34, tImp + 0.6, 1.8);
    const sv2 = K.svg(LD, { x: 0, y: 0, w: 1920, h: 1080 });
    const arr = K.path(sv2, 'M 1360 230 L 1360 330 M 1320 290 L 1360 330 L 1400 290', { stroke: C.green, 'stroke-width': 14, fill: 'none' });
    A.in(tl, arr, tImp + 0.6, 'fadeDown', { dur: 0.6 });
    tl.to(arr, { y: 18, duration: 0.45, yoyo: true, repeat: 3, ease: 'sine.inOut' }, tImp + 1.2);
    const big = C2.put(LD, 'c2-big', 'Improve them,<br>*lower the baseline*', { x: 100, y: 640 });
    A.in(tl, big, tImp + 1.0, 'fadeUp', { dur: 0.7 });
  });

  // ================================================================== ch02s06 Pain and discomfort
  registerScene('ch02s06', ctx => {
    const { stage, tl, cue, end, dur } = ctx;
    C2.style(stage);
    css(stage);
    const at = (i, p, fb, lead) => sayAt(ctx, i, p, fb, lead);
    C2.areaHead(ctx, 0, 'Pain & Discomfort');

    // ---------- beat 0: a magnifier finds hidden pain on the dog
    const LA = C2.layer(stage);
    const sv = K.svg(LA, { x: 0, y: 0, w: 1920, h: 1080 });
    const D = C2.dog(sv, 600, 610, 1.45);
    A.in(tl, D.outer, cue(0) + 0.2, 'fadeUp', { dur: 0.8 });
    const [hx, hy] = D.pt(140, 150);
    const defs = K.svgEl('defs', {}, sv);
    defs.innerHTML = '<radialGradient id="c2cpain"><stop offset="0" stop-color="#e0553a" stop-opacity="0.95"/><stop offset="0.55" stop-color="#e0553a" stop-opacity="0.45"/><stop offset="1" stop-color="#e0553a" stop-opacity="0"/></radialGradient>';
    const pain = K.circle(sv, hx, hy, 70, { fill: 'url(#c2cpain)', opacity: 0 });
    const lens = K.el('div');
    Object.assign(lens.style, { position: 'absolute', left: '0px', top: '0px', width: '190px', height: '190px', borderRadius: '50%', border: '12px solid var(--green-dark)',
      background: 'rgba(255,255,255,0.25)', boxShadow: '0 14px 30px rgba(40,60,20,0.25)' });
    const handle = K.el('div');
    Object.assign(handle.style, { position: 'absolute', left: '150px', top: '150px', width: '22px', height: '110px', borderRadius: '11px', background: 'var(--green-dark)', transform: 'rotate(-45deg)', transformOrigin: '50% 0%' });
    lens.appendChild(handle);
    LA.appendChild(lens);
    const tLens = clamp(at(0, 'easy to miss', 0.7, 0.8), cue(0) + 1.0, end(0) - 1.6);
    tl.fromTo(lens, { opacity: 0, x: 1000, y: 260 }, { opacity: 1, x: 860, y: 300, duration: 0.5, ease: 'power2.out' }, tLens - 0.6);
    tl.to(lens, { x: hx - 95, y: hy - 95, duration: 1.1, ease: 'power2.inOut' }, tLens);
    tl.to(pain, { opacity: 1, duration: 0.6, ease: 'power2.out' }, tLens + 0.9);
    tl.to(pain, { attr: { r: 84 }, duration: 0.6, yoyo: true, repeat: 5, ease: 'sine.inOut' }, tLens + 1.4);
    const cap = C2.pill(LA, 'search', 'Pain may not always be *obvious*', { x: 1080, y: 470, size: 36 });
    A.in(tl, cap, tLens + 1.0, 'fadeLeft', { dur: 0.6 });

    // ---------- beat 1: a person with a headache; four everyday demands, each harder to tolerate
    const t1 = cue(1);
    tl.to(LA, { opacity: 0, duration: 0.45, ease: 'power2.in' }, t1 - 0.2);
    const LB = C2.layer(stage, tl, t1);
    const PCX = 360, PCY = 560;
    const person = C2.badge(LB, 'user', PCX, PCY, 240, '#fff', C.greenDark);
    person.style.border = '6px solid var(--green)';
    A.in(tl, person, t1 + 0.1, 'pop', { dur: 0.6 });
    const ache = K.svg(LB, { x: 0, y: 0, w: 1920, h: 1080 });
    const zz = [[-1, 'M -14 0 L 0 -16 L 10 -4 L 26 -22'], [1, 'M 14 0 L 0 -16 L -10 -4 L -26 -22']].map(([k, d], i) =>
      K.path(ache, d, { stroke: C.red, 'stroke-width': 8, fill: 'none', transform: `translate(${PCX + k * 74} ${PCY - 128})` }));
    const tAche = clamp(at(1, 'headache', 0.1, 0.2), t1 + 0.4, end(1) - 6);
    A.in(tl, zz, tAche, 'pop', { dur: 0.4, stagger: 0.1 });
    tl.to(zz, { opacity: 0.35, duration: 0.4, yoyo: true, repeat: 9, ease: 'sine.inOut' }, tAche + 0.6);
    const DEM = [['hand', 'Touched', 'being touched', 0.42], ['move', 'Bumped into', 'bumped into', 0.52], ['volume-2', 'Noise', 'noise', 0.62], ['message-circle', 'Asked for<br>something', 'ask something', 0.78]];
    let lo = tAche + 1.0;
    const dems = DEM.map(([ic, t, p, fb], k) => {
      const cx = 800 + k * 280;
      const s = small(LB, ic, t, cx, 480, C.pale, C.greenDark, 130);
      const tt = clamp(at(1, p, fb, 0.3), lo, end(1) - 1.2);
      tl.fromTo(s.n, { opacity: 0, x: 80 }, { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' }, tt);
      tl.to(s.b, { background: C.amberPale, color: C.amber, duration: 0.35, ease: 'power2.out' }, tt + 0.6);
      tl.to(s.b, { x: -10, duration: 0.07, yoyo: true, repeat: 5, ease: 'sine.inOut' }, tt + 0.6);
      lo = tt + 0.45;
      return s.n;
    });
    const harder = C2.pill(LB, 'triangle-alert', 'Harder to tolerate', { x: 1220, y: 760, center: true, variant: 'amber', size: 36 });
    A.in(tl, harder, clamp(at(1, 'harder to tolerate', 0.92, 0.3), lo, end(1)), 'fadeUp', { dur: 0.6 });

    // ---------- beat 2: limping, crying, obviously injured: struck through
    const t2 = cue(2);
    tl.to(LB, { opacity: 0, duration: 0.45, ease: 'power2.in' }, t2 - 0.2);
    const LC = C2.layer(stage, tl, t2);
    const NOT = [['footprints', 'Limping', 'limping', 0.25], ['volume-2', 'Crying', 'crying', 0.35], ['bandage', 'Obviously injured', 'obviously injured', 0.45]];
    const xs = [260, 760, 1260];
    lo = t2 + 0.2;
    NOT.forEach(([ic, t, p, fb], k) => {
      const c = C2.pill(LC, ic, t, { x: xs[k], y: 400, size: 38, col: C.muted });
      const tt = clamp(at(2, p, fb, 0.3), lo, end(2) - 2);
      A.in(tl, c, tt, 'fadeUp', { dur: 0.5 });
      const st = K.el('div', 'c2c-strike');
      Object.assign(st.style, { left: xs[k] - 10 + 'px', top: '440px', width: '0px' });
      LC.appendChild(st);
      st.dataset.k = k;
      tl.fromTo(st, { width: 0 }, { width: () => c.offsetWidth + 20, duration: 0.4, ease: 'power2.inOut', immediateRender: false }, tt + 0.45);
      tl.to(c, { opacity: 0.55, duration: 0.3 }, tt + 0.6);
      lo = tt + 0.5;
    });
    const still = C2.put(LC, 'c2-big', 'Discomfort can still *affect behavior*', { x: 0, y: 600, w: 1920, align: 'center' });
    A.in(tl, still, clamp(at(2, 'affect behavior', 0.85, 0.3), lo + 0.3, end(2)), 'fadeUp', { dur: 0.7 });

    // ---------- beat 3: dogs can be very stoic: pain builds long before the limp you notice (unless it is a sudden injury)
    const tS = cue(3);
    tl.to(LC, { opacity: 0, duration: 0.45, ease: 'power2.in' }, tS - 0.2);
    const LS = C2.layer(stage, tl, tS);
    const st = C2.pill(LS, 'shield', 'Dogs can be *very stoic*', { x: 160, y: 286, size: 36 });
    A.in(tl, st, tS + 0.1, 'fadeRight', { dur: 0.6 });
    const ss = K.svg(LS, { x: 0, y: 0, w: 1920, h: 1080 });
    const AX0 = 190, AX1 = 1290, AY = 800, YT = 520;
    // axes: pain up the side, time along the bottom (the axis holds nothing else)
    const axis = K.path(ss, `M ${AX0} ${YT} L ${AX0} ${AY} L ${AX1} ${AY} M ${AX1 - 20} ${AY - 14} L ${AX1} ${AY} L ${AX1 - 20} ${AY + 14}`, { stroke: '#b9c6ad', 'stroke-width': 6, fill: 'none' });
    A.draw(tl, axis, tS + 0.3, 0.8);
    const tml = C2.put(LS, 'c2c-tick', 'time', { x: AX1 - 60, y: AY + 22 });
    const yl = C2.put(LS, 'c2c-tick', '!!pain!!', { x: AX0 - 120, y: YT - 10 });
    yl.style.width = '100px';
    yl.style.textAlign = 'right';
    A.in(tl, [tml, yl], tS + 0.9, 'fade', { dur: 0.4 });
    const painL = K.path(ss, `M ${AX0} ${AY - 30} C 440 ${AY - 48} 700 ${AY - 110} 900 ${AY - 180} S 1100 ${AY - 280} 1160 ${AY - 320}`, { stroke: C.red, 'stroke-width': 10, fill: 'none' });
    // on the outside, the dog looks fine (a note inside the chart, over the early part of the line)
    const looks = C2.put(LS, 'c2-lab', '**Looks fine on the outside**', { x: AX0 + 40, y: AY - 150 });
    Object.assign(looks.style, { fontSize: '30px', color: 'var(--green-dark)' });
    A.in(tl, looks, tS + 1.0, 'fadeUp', { dur: 0.5 });
    A.draw(tl, painL, tS + 0.8, Math.max(1.5, Math.min(4, end(3) - tS - 3.5)), { ease: 'none' });
    // the limp shows up only at the end: a marker on the line itself
    const tLimp = clamp(at(3, 'a limp', 0.7, 0.3), tS + 2.5, end(3) - 1.6);
    const dot = K.circle(ss, 1160, AY - 320, 16, { fill: C.amber, stroke: '#fff', 'stroke-width': 5, opacity: 0 });
    const limpT = C2.pill(LS, 'paws', 'The limp you notice', { x: 1190, y: AY - 356, variant: 'amber', size: 28, col: C.amber });
    tl.fromTo(dot, { opacity: 0, scale: 0.3, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2.4)' }, tLimp);
    A.in(tl, limpT, tLimp + 0.2, 'fadeRight', { dur: 0.5 });
    const brk = K.path(ss, `M ${AX0 + 10} 470 L ${AX0 + 10} 450 L 1150 450 L 1150 470`, { stroke: C.red, 'stroke-width': 5, fill: 'none' });
    const brT = C2.put(LS, 'c2-lab', '!!Already in pain for quite a while!!', { x: AX0, y: 396 });
    brT.style.fontSize = '32px';
    const tWhile = clamp(at(3, 'quite a while', 0.9, 0.3), tLimp + 0.6, end(3) - 0.4);
    A.draw(tl, brk, tWhile, 0.6);
    A.in(tl, brT, tWhile + 0.2, 'fadeUp', { dur: 0.5 });
    // the exception: a sudden injury shows right away
    const card = K.el('div', 'c2c-sud');
    const ci = K.el('div', 'ic');
    ci.appendChild(K.icon('zap'));
    card.appendChild(ci);
    const ct = K.el('div');
    ct.appendChild(K.el('div', 't1', 'Sudden injury'));
    ct.appendChild(K.el('div', 't2', 'like a broken leg:<br>signs right away'));
    card.appendChild(ct);
    Object.assign(card.style, { left: '1370px', top: '640px' });
    LS.appendChild(card);
    A.in(tl, card, clamp(at(3, 'sudden injury', 0.15, 0.3), tS + 0.6, end(3) - 2), 'fadeLeft', { dur: 0.6 });

    // ---------- beat 4: eight examples around the dog
    const t3 = cue(4);
    tl.to(LS, { opacity: 0, duration: 0.45, ease: 'power2.in' }, t3 - 0.2);
    const LD = C2.layer(stage, tl, t3);
    const sv3 = K.svg(LD, { x: 0, y: 0, w: 1920, h: 1080 });
    const DCX = 960, DCY = 600;
    const ring = K.svgEl('ellipse', { cx: DCX, cy: DCY, rx: 620, ry: 250, fill: 'none', stroke: C.greenLight, 'stroke-width': 6, 'stroke-dasharray': '16 14' }, sv3);
    const D2 = C2.dog(sv3, DCX, DCY + 10, 0.95);
    const glow = K.svgEl('ellipse', { cx: DCX, cy: DCY, rx: 620, ry: 250, fill: 'none', stroke: C.green, 'stroke-width': 14, opacity: 0 }, sv3);
    A.in(tl, D2.outer, t3 + 0.1, 'fadeUp', { dur: 0.6 });
    A.draw(tl, ring, t3 + 0.3, 1.0);
    const EX = [['hand', 'Touch', 'touch'], ['move', 'Movement', 'movement'], ['hand-helping', 'Handling', 'handling'], ['users', 'People', 'people'],
      ['dog', 'Other dogs', 'other dogs'], ['volume-2', 'Noise', 'noise'], ['volleyball', 'Activity', 'activity'], ['calendar-days', 'Everyday events', 'everyday events']];
    const ANG = [-155, -115, -65, -25, 25, 155, 115, 65].map(a => a * Math.PI / 180);
    lo = t3 + 0.5;
    EX.forEach(([ic, t, p], k) => {
      const x = DCX + 620 * Math.cos(ANG[k]), y = DCY + 250 * Math.sin(ANG[k]);
      const e = K.el('div', 'c2c-ex');
      Object.assign(e.style, { left: x - 100 + 'px', top: y - 50 + 'px' });
      const b = K.el('div', 'c2-badge');
      Object.assign(b.style, { position: 'relative', width: '100px', height: '100px', background: '#fff', color: C.red, border: '5px solid ' + C.red });
      b.appendChild(K.icon(ic));
      e.appendChild(b);
      e.appendChild(K.el('div', 'lb', t));
      LD.appendChild(e);
      const tt = clamp(at(4, p, 0.25 + k * 0.08, 0.25), lo, end(4) - 0.6);
      A.in(tl, e, tt, 'pop', { dur: 0.5 });
      lo = tt + 0.3;
    });
    const tEv = clamp(at(4, 'everyday events', 0.88, 0.2), lo, end(4) - 0.3);
    tl.to(glow, { opacity: 0.7, duration: 0.5, yoyo: true, repeat: 1, ease: 'sine.inOut' }, tEv);

    // ---------- beat 5: a sudden change, then the vet card
    const t4 = cue(5);
    tl.to(LD, { opacity: 0, duration: 0.45, ease: 'power2.in' }, t4 - 0.2);
    const LE = C2.layer(stage, tl, t4);
    const sv4 = K.svg(LE, { x: 0, y: 0, w: 1920, h: 1080 });
    K.line(sv4, 120, 760, 900, 760, { stroke: '#cfd8c6', 'stroke-width': 5 });
    const lab = C2.put(LE, 'c2c-tick', 'behavior', { x: 120, y: 780 });
    lab.style.width = 'auto';
    const calm = K.path(sv4, 'M 120 640 C 200 630 260 652 340 640 S 480 630 560 642', { stroke: C.green, 'stroke-width': 10, fill: 'none' });
    const jump = K.path(sv4, 'M 560 642 L 600 420 C 640 400 720 440 800 410 S 860 404 900 412', { stroke: C.red, 'stroke-width': 10, fill: 'none' });
    A.in(tl, lab, t4 + 0.1, 'fade', { dur: 0.4 });
    A.draw(tl, calm, t4 + 0.2, 0.9, { ease: 'none' });
    const tSud = clamp(at(5, 'sudden or unusual', 0.3, 0.3), t4 + 1.1, end(5) - 4);
    A.draw(tl, jump, tSud, 0.8, { ease: 'power2.out' });
    const sud = C2.pill(LE, 'zap', 'Sudden or unusual change', { x: 360, y: 300, variant: 'red', size: 32 });
    A.in(tl, sud, tSud + 0.5, 'fadeUp', { dur: 0.6 });
    const vet = K.el('div', 'c2c-vet');
    const vi = K.el('div', 'vi');
    vi.appendChild(K.icon('stethoscope'));
    vet.appendChild(vi);
    const tx = K.el('div');
    tx.appendChild(K.el('div', 't1', 'Consider pain and<br>medical concerns'));
    vet.appendChild(tx);
    Object.assign(vet.style, { left: '1010px', top: '470px' });
    LE.appendChild(vet);
    const tVet = clamp(at(5, 'pain and other medical', 0.75, 0.4), tSud + 1.2, end(5) - 0.8);
    tl.fromTo(vet, { opacity: 0, x: 80 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, tVet);
  });
})();
