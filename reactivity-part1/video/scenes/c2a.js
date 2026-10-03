// Chapter 2 (the baseline): welcome, plan, recap and definition. Pot and helpers come from window.C2 (c2_pot.js).
//   ch02intro  Welcome              the shared title slide (video/series.js)
//   ch02card   Chapter card         the shared narrated chapter card
//   ch02plan   Where we're headed   the shared plan slide: Why it matters, What you'll gain, How we'll get there
//   ch02s01    Understanding ...    chapter 1's bowl; four returning ingredients glow and lift out; Changed / Managed / Improved;
//                                    the bowl steps aside and "Your dog's baseline" lands on a level line
//   ch02s02    What is a baseline?  definition card; a time line with the dog on a green starting-state band before
//                                    "something new happens"; the band rises and falls: not fixed
(() => {
  const CSS = `
  .c2a-chap { display: flex; flex-direction: column; gap: 10px; }
  .c2a-chap .n { font: 700 30px/1 var(--font-body); letter-spacing: 5px; text-transform: uppercase; color: var(--green-dark); white-space: nowrap; }
  .c2a-chap .t { font: 600 52px/1.12 var(--font-head); color: var(--green); white-space: nowrap; }
  .c2a-sub { font: 600 48px/1.14 var(--font-head); color: var(--green); white-space: nowrap; }
  .c2a-ctag { display: flex; align-items: center; gap: 22px; margin-top: 6px; padding: 14px 30px 14px 14px; border-radius: 999px; background: #fff;
    border: 1px solid #e6e9e1; box-shadow: var(--shadow-soft); }
  .c2a-ctag .fu { width: 84px; height: 84px; border-radius: 50%; background: var(--amber); color: #fff; display: grid; place-items: center; border: 5px solid #fff;
    box-shadow: 0 6px 16px rgba(140,90,20,0.25); flex: 0 0 auto; }
  .c2a-ctag .fu svg { width: 46px; height: 46px; stroke-width: 2.2; }
  .c2a-ctag .n { font: 700 24px/1 var(--font-body); letter-spacing: 5px; text-transform: uppercase; color: var(--amber-text, #a8650f); white-space: nowrap; }
  .c2a-ctag .t { font: 700 38px/1.1 var(--font-head); color: var(--ink); white-space: nowrap; margin-top: 8px; }
  .c2a-blt { position: absolute; display: flex; align-items: center; gap: 0; }
  .c2a-blt .tx { font: 700 52px/1 var(--font-head); color: var(--ink); white-space: nowrap; }
  .c2a-blt .tx b { color: var(--green); }
  .c2a-blt .ln { width: 90px; height: 0; border-top: 5px dashed #2f7fae; margin-left: 24px; }
  .c2a-cmi { position: absolute; font: 700 36px/1.2 var(--font-head); color: var(--ink); white-space: nowrap; }
  .c2a-cmi span { color: var(--green); padding: 0 4px; border-radius: 8px; }
  .c2a-focus { position: absolute; display: flex; flex-direction: column; gap: 18px; }
  .c2a-focus .k { font: 700 28px/1 var(--font-body); letter-spacing: 5px; text-transform: uppercase; color: var(--muted); }
  .c2a-focus .w { font: 700 72px/1.05 var(--font-head); color: var(--green); }
  .c2a-pairs { position: absolute; display: grid; grid-template-columns: auto 52px auto; gap: 22px 10px; align-items: center; justify-items: start; }
  .c2a-pairs .hd { font: 600 28px/1.2 var(--font-body); color: var(--muted); max-width: 360px; }
  .c2a-pairs .hd b { color: var(--ink); font-weight: 700; }
  .c2a-pairs .hd.now { color: #2f7fae; font-weight: 700; }
  .c2a-pairs .hd.now span { color: var(--ink); padding: 0 4px; border-radius: 6px; }
  .c2a-pairs .ar { color: var(--muted); display: grid; place-items: center; width: 52px; }
  .c2a-pairs .ar svg { width: 36px; height: 36px; stroke-width: 2.4; }


  .c2a-def { position: absolute; display: flex; align-items: center; gap: 30px; padding: 30px 44px 30px 30px; background: #fff; border-radius: 28px;
    border: 1px solid #e6e9e1; box-shadow: var(--shadow-soft); }
  .c2a-def .eq { flex: 0 0 auto; padding: 18px 30px; border-radius: 20px; background: var(--green); color: #fff; font: 700 46px/1 var(--font-head); white-space: nowrap; }
  .c2a-def .tx { font: 500 40px/1.28 var(--font-body); color: var(--ink); }
  .c2a-def .tx b { color: var(--green-dark); font-weight: 700; }
  .c2a-axis { position: absolute; font: 600 28px/1 var(--font-body); color: var(--muted); white-space: nowrap; }
  .c2a-bl { position: absolute; text-align: center; font: 700 88px/1.05 var(--font-head); color: var(--ink); white-space: nowrap; }
  .c2a-bl b { color: var(--green); font-weight: 700; }
  `;
  const css = stage => stage.appendChild(K.el('style', null, CSS));
  const { sayAt, clamp } = C1;

  // ================================================================== ch02intro Welcome (shared title slide, video/series.js)
  registerScene('ch02intro', ctx => SKIT.titleSlide(ctx));

  // ================================================================== ch02card the chapter card, narrated
  registerScene('ch02card', ctx => SKIT.chapterCard(ctx, 2, 'Your Dog\u2019s Baseline'));

  // ================================================================== ch02plan Where we're headed
  registerScene('ch02plan', ctx => SKIT.planSlide(ctx, [
    { ...SKIT.PLAN.why, rows: ['Fine one day', 'Over the edge the next', 'There’s a reason'], rowIcons: ['smile', 'zap', 'search'] },
    { ...SKIT.PLAN.gain, text: 'Know what *raises or lowers* your dog’s baseline, and *what you can do* about it' },
    { ...SKIT.PLAN.how, rows: ['What a baseline is', 'Four areas that affect it', 'How it adds up, and comes down'] },
  ], [
    [['just fine one day', 0.3], ['the next day', 0.55], ['usually a reason', 0.85]],
    [['raise or lower', 0.5]],
    [['First', 0.2], ['Second', 0.45], ['third', 0.72]],
  ]));

  // ================================================================== ch02s01 Your Dog's Baseline
  registerScene('ch02s01', ctx => {
    const { stage, tl, cue, end, dur } = ctx;
    C1.style(stage);
    C2.style(stage);
    css(stage);
    const at = (i, p, fb, lead) => sayAt(ctx, i, p, fb, lead);
    const h = K.heading(stage, 'Your Dog’s Baseline', { x: 100, y: 120, w: 1450, size: 76 });
    A.in(tl, h.all, 0.05, 'fadeUp', { dur: 0.7, stagger: 0.1 });

    // ---------- beat 0: chapter 1's bowl and its eight ingredients
    const LB = C2.layer(stage);
    const BX = 450, BY = 600;
    const B = C1.makeBowl(LB, { cx: BX, y: BY, s: 1.0, filled: 8 });
    B.slots.forEach(sl => gsap.set(sl.g, { opacity: 0 }));
    tl.fromTo(B.wrap, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out' }, cue(0) + 0.1);
    tl.fromTo(B.glow, { opacity: 0 }, { opacity: 0.8, duration: 1.0 }, cue(0) + 0.4);
    const ingP = C2.pill(LB, 'book-open', 'Chapter 1: *the ingredients*', { x: BX, y: 860, center: true, variant: 'pale' });
    A.in(tl, ingP, cue(0) + 0.6, 'fadeUp', { dur: 0.6 });

    // ---------- beat 1: the four ingredients that come back, each paired with what it means for the water: the ingredient is
    // what shaped the dog before, the water is what is happening now
    const t1 = at(1, 'some of those factors', 0.2, 0.2);
    A.out(tl, ingP, t1, 'fade', { dur: 0.4 });
    const PAIRS = [[2, 'Breed history', 'Breed needs met today'], [5, 'Past experiences', 'Recent stress'],
      [6, 'Training methods', 'How the dog is handled now'], [7, 'Pain', 'Pain right now']];
    const grid = K.el('div', 'c2a-pairs');
    Object.assign(grid.style, { left: '830px', top: '258px' });
    const hThen = K.el('div', 'hd', 'Chapter 1: <b>what shaped the dog</b>');
    const hNow = K.el('div', 'hd now', 'Now: <span>can be changed, managed, or improved</span>');
    grid.appendChild(hThen);
    grid.appendChild(K.el('div'));
    grid.appendChild(hNow);
    const rows = PAIRS.map(([k, a, b]) => {
      const g = C1.ING[k];
      const ca = C2.pill(grid, g.icon, a, { col: g.col, size: 28 });
      const ar = K.el('div', 'ar');
      ar.appendChild(K.icon('arrow-right'));
      const cb = C2.pill(grid, 'droplet', b, { col: C2.C.water, size: 28 });
      [ca, cb].forEach(n => { n.style.position = 'relative'; });
      grid.insertBefore(ar, cb);
      return { k, ca, ar, cb };
    });
    LB.appendChild(grid);
    A.in(tl, hThen, t1 + 0.1, 'fadeUp', { dur: 0.5 });
    rows.forEach((r, j) => {
      const t = t1 + 0.4 + j * 0.45;
      A.in(tl, r.ca, t, 'fadeRight', { dur: 0.5 });
      tl.to(B.tokens[r.k].inner, { scale: 1.3, transformOrigin: '50% 50%', duration: 0.3, yoyo: true, repeat: 1, ease: 'power2.out' }, t);
    });
    const tInt = clamp(at(1, "That's intentional", 0.8, 0.2), t1 + 2.0, end(1) - 0.3);
    A.in(tl, hNow, tInt, 'fadeUp', { dur: 0.5 });
    rows.forEach((r, j) => {
      A.in(tl, r.ar, tInt + 0.2 + j * 0.25, 'fade', { dur: 0.3 });
      A.in(tl, r.cb, tInt + 0.3 + j * 0.25, 'fadeRight', { dur: 0.5 });
    });

    // ---------- beat 2: the "now" column's header lights up as "changed, managed, or improved" is said
    const t2 = cue(2);
    tl.to(hNow.querySelector('span'), { color: '#ffffff', backgroundColor: C2.C.green, duration: 0.4 }, clamp(at(2, 'changed', 0.2, 0.2), t2, end(2) - 3));
    tl.to(rows.map(r => r.cb), { boxShadow: '0 0 0 4px rgba(95,168,207,0.6)', duration: 0.4, stagger: 0.12 }, clamp(at(2, 'right now', 0.6, 0.3), t2 + 1, end(2) - 1));
    const hdr = grid, cant = grid;

    // ---------- beat 3: "we're going to add those ingredients to a pot": the bowl tips and the ingredients drop into an empty pot
    const tDiff = cue(3);
    tl.to([grid], { opacity: 0, duration: 0.4, stagger: 0.03, ease: 'power2.in' }, tDiff - 0.3);
    const cap = C2.pill(LB, 'arrow-down', 'Adding the ingredients *to the pot*', { x: 960, y: 880, center: true, variant: 'pale', size: 32 });
    A.in(tl, cap, tDiff + 0.3, 'fadeUp', { dur: 0.6 });
    const PX = 1350, PY = 470;
    const P = C2.makePot(LB, { cx: PX, y: PY, s: 0.92, level: 0 });
    tl.fromTo(P.wrap, { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' }, tDiff);
    tl.to(B.wrap, { rotation: 32, x: 260, y: -120, duration: 0.7, ease: 'power2.inOut' }, tDiff + 0.3);
    tl.to(B.tokens.map(t => t.outer), { opacity: 0, duration: 0.3, stagger: 0.04 }, tDiff + 0.8);
    const tIn = P.dropIng(tl, tDiff + 0.9);
    tl.to(B.wrap, { opacity: 0, duration: 0.5 }, tIn - 0.4);
    P.waves(tl, tIn, dur);

    // ---------- beat 4: no water yet (it comes when the baseline is explained): "First: your dog's baseline"
    const t4 = Math.max(cue(4), tIn + 0.2);
    A.out(tl, cap, t4 - 0.2, 'fade', { dur: 0.4 });
    const bl = K.el('div', 'c2a-blt');
    bl.appendChild(K.el('div', 'tx', K.md('First: your dog’s *baseline*')));
    Object.assign(bl.style, { right: 1920 - (PX - (C2.R + 90) * 0.92) + 'px', top: PY + 120 + 'px' });
    LB.appendChild(bl);
    A.in(tl, bl, t4 + 0.1, 'fadeRight', { dur: 0.7 });
  });

  // ================================================================== ch02s02 What is a baseline?
  registerScene('ch02s02', ctx => {
    const { stage, tl, cue, end, dur } = ctx;
    C2.style(stage);
    css(stage);
    const at = (i, p, fb, lead) => sayAt(ctx, i, p, fb, lead);
    const h = K.heading(stage, 'What Is a Baseline?', { x: 100, y: 120, size: 80 });
    A.in(tl, h.all, 0.05, 'fadeUp', { dur: 0.7, stagger: 0.1 });

    // ---------- beat 0: definition card, then the time line
    const def = K.el('div', 'c2a-def');
    Object.assign(def.style, { left: '100px', top: '286px', width: '1720px' });
    def.appendChild(K.el('div', 'eq', 'Baseline'));
    def.appendChild(K.el('div', 'tx', K.md('the dog’s overall *starting state* before *something new* happens')));
    stage.appendChild(def);
    A.in(tl, def, cue(0) + 0.2, 'fadeUp', { dur: 0.8 });

    const sv = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const AX = 180, AY = 900, AW = 1560, EV = 1300; // axis origin, axis length, event x
    const axis = K.path(sv, `M ${AX} ${AY} L ${AX + AW} ${AY}`, { stroke: '#b9c6ad', 'stroke-width': 6 });
    const arrow = K.path(sv, `M ${AX + AW - 22} ${AY - 16} L ${AX + AW} ${AY} L ${AX + AW - 22} ${AY + 16}`, { stroke: '#b9c6ad', 'stroke-width': 6, fill: 'none' });
    const tLine = at(0, 'starting state', 0.45, 0.4);
    A.draw(tl, axis, tLine, 0.9);
    A.in(tl, arrow, tLine + 0.8, 'fade', { dur: 0.3 });
    const tlab = C2.put(stage, 'c2a-axis', 'time', { x: AX + AW - 70, y: AY + 22 });
    A.in(tl, tlab, tLine + 0.8, 'fade', { dur: 0.4 });
    // the starting-state band (green), dog badge resting on it
    const LV0 = 800;
    const band = K.group(sv);
    const bandR = K.rect(band, AX, -26, EV - AX - 40, 52, { rx: 26, fill: C2.C.greenLight, opacity: 0.85 });
    const bandL = K.svgText(band, AX + 30, 11, 'Starting state', { 'font-size': 30, 'font-weight': 700, fill: C2.C.greenDeep });
    gsap.set(band, { y: LV0 });
    tl.fromTo(bandR, { attr: { width: 0 } }, { attr: { width: EV - AX - 40 }, duration: 0.9, ease: 'power2.inOut', immediateRender: false }, tLine + 0.5);
    tl.set(bandR, { attr: { width: 0 } }, 0);
    A.in(tl, bandL, tLine + 1.0, 'fade', { dur: 0.5 });
    const dogB = C2.badge(stage, 'dog', 0, 0, 104, '#fff', C2.C.greenDark);
    Object.assign(dogB.style, { left: '840px', top: LV0 - 140 + 'px', border: '5px solid var(--green)' });
    A.in(tl, dogB, tLine + 1.0, 'pop', { dur: 0.55 });
    // something new happens
    const evL = K.line(sv, EV, 600, EV, AY, { stroke: C2.C.amber, 'stroke-width': 6, 'stroke-dasharray': '14 12' });
    const ev = C2.badge(stage, 'bell-ring', EV, 560, 104, C2.C.amber, '#fff');
    const evT = C2.put(stage, 'c2a-axis', '**Something new happens**', { x: EV + 70, y: 540 });
    evT.style.color = 'var(--ink)';
    evT.style.fontSize = '32px';
    const tEv = clamp(at(0, 'something new', 0.85, 0.3), tLine + 1.6, end(0) - 0.2);
    A.draw(tl, evL, tEv, 0.5);
    tl.fromTo(ev, { opacity: 0, y: -60 }, { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.6)' }, tEv);
    A.in(tl, evT, tEv + 0.3, 'fadeRight', { dur: 0.6 });
    tl.to(ev, { rotation: 12, duration: 0.12, yoyo: true, repeat: 5, ease: 'sine.inOut' }, tEv + 0.6);

    // ---------- beat 1: part of that baseline is the dog's mood
    const tM = clamp(at(1, 'mood', 0.7, 0.3), cue(1) + 0.2, end(1));
    const moodP = C2.pill(stage, 'brain', 'Part of the baseline: *mood*', { x: 180, y: 470, size: 34, col: C2.AREAS[2].col });
    A.in(tl, moodP, tM, 'pop', { dur: 0.55 });
    tl.to(bandR, { attr: { fill: '#c9dba0' }, duration: 0.4, yoyo: true, repeat: 1 }, tM + 0.2);

    // ---------- beat 2: emotions keep changing (an irregular line, not a regular up and down); the mood band shifts over the
    // day and over longer periods
    const t2 = cue(2);
    const EY = LV0 - 150, pts = [];
    // an irregular path: changes of different size and length, sometimes holding, sometimes shifting
    let seed = 11, y = EY;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let x = AX; x <= EV - 60;) {
      pts.push(`${x},${y.toFixed(1)}`);
      x += 24 + rnd() * 60;
      y = Math.max(EY - 70, Math.min(EY + 50, y + (rnd() - 0.5) * (rnd() < 0.3 ? 30 : 110)));
    }
    const emo = K.svgEl('polyline', { points: pts.join(' '), fill: 'none', stroke: C2.AREAS[2].col, 'stroke-width': 5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, sv);
    const tEmo = clamp(at(2, 'constantly changing', 0.2, 0.3), t2, end(2) - 4);
    A.draw(tl, emo, tEmo, 2.6, { ease: 'none' });
    const emoL = C2.put(stage, 'c2a-axis', '**Emotions:** constantly changing', { x: AX, y: EY - 96 });
    emoL.style.color = 'var(--ink)';
    A.in(tl, emoL, tEmo + 0.3, 'fadeUp', { dur: 0.5 });
    tl.to(moodP, { opacity: 0, duration: 0.3 }, tEmo);
    const tMood = clamp(at(2, 'broader mood', 0.5, 0.3), tEmo + 1.2, end(2) - 1.5);
    const LVM = 760;
    tl.to(band, { y: LVM, duration: 1.6, ease: 'sine.inOut' }, tMood);
    tl.to(dogB, { y: LVM - LV0, duration: 1.6, ease: 'sine.inOut' }, tMood);
    tl.to(bandL, { opacity: 0, duration: 0.3 }, tMood);
    const moodL = K.svgText(band, AX + 30, 11, 'Mood: shifts over time', { 'font-size': 30, 'font-weight': 700, fill: C2.C.greenDeep, opacity: 0 });
    tl.to(moodL, { opacity: 1, duration: 0.4 }, tMood + 0.3);
    const tLong = clamp(at(2, 'longer periods', 0.85, 0.3), tMood + 1.8, end(2) - 0.3);
    tl.to(band, { y: LVM - 30, duration: 1.2, ease: 'sine.inOut' }, tLong);
    tl.to(dogB, { y: LVM - 30 - LV0, duration: 1.2, ease: 'sine.inOut' }, tLong);

    // ---------- beat 3: the band rises and falls between levels; "Not fixed. It can change."
    const t1 = cue(3);
    tl.to([emo, emoL], { opacity: 0.25, duration: 0.4 }, t1);
    tl.to(moodL, { opacity: 0, duration: 0.3 }, t1);
    tl.to(bandL, { opacity: 1, duration: 0.3 }, t1 + 0.2);
    const LVS = [660, 820, 700, 780];
    let prev = LV0, t = clamp(at(3, "isn't fixed", 0.3, 0.2), t1, end(3) - 1);
    LVS.forEach((lv, k) => {
      tl.to(band, { y: lv, duration: 0.7, ease: 'power2.inOut' }, t + k * 0.75);
      tl.to(dogB, { y: lv - LV0, duration: 0.7, ease: 'power2.inOut' }, t + k * 0.75);
      prev = lv;
    });
    const ud = C2.badge(stage, 'arrow-up-down', 140, 0, 76, C2.C.green, '#fff');
    ud.style.top = LV0 - 38 + 'px';
    ud.style.left = '96px';
    A.in(tl, ud, t, 'pop', { dur: 0.5 });
    tl.to(ud, { y: prev - LV0, duration: 0.7, ease: 'power2.inOut' }, t + 3 * 0.75);
    const chip = C2.pill(stage, 'refresh-cw', 'Not fixed. *It can change.*', { x: 540, y: 470, variant: '', size: 36 });
    chip.style.top = '470px';
    const tCh = clamp(at(3, 'It can change', 0.65, 0.2), t + 0.6, end(3));
    A.in(tl, chip, Math.max(tCh, cue(3) + 0.4), 'pop', { dur: 0.55 });
  });
})();
