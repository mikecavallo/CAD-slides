// Chapter 2 (the baseline): welcome, plan, recap and definition. Pot and helpers come from window.C2 (c2_pot.js).
//   ch02intro  Welcome              series title and the chapter line at left; Tori's headshot in a green ring, training photo card
//   ch02plan   Where we're headed   three cards, one per beat: Why it matters, What you'll gain, How we'll get there (three steps)
//   ch02s01    Understanding ...    chapter 1's bowl; four returning ingredients glow and lift out; Changed / Managed / Improved;
//                                    the bowl steps aside and "Your dog's baseline" lands on a level line
//   ch02s02    What is a baseline?  definition card; a time line with the dog on a green starting-state band before
//                                    "something new happens"; the band rises and falls: not fixed
(() => {
  const CSS = `
  .c2a-col { position: absolute; display: flex; flex-direction: column; align-items: flex-start; gap: 30px; }
  .c2a-kick { font: 700 28px/1 var(--font-body); letter-spacing: 6px; text-transform: uppercase; color: var(--green); white-space: nowrap; }
  .c2a-title { font: 700 88px/1.06 var(--font-head); color: var(--ink); }
  .c2a-bar { width: 140px; height: 10px; border-radius: 6px; background: var(--green-light); }
  .c2a-chap { display: flex; flex-direction: column; gap: 10px; }
  .c2a-chap .n { font: 700 30px/1 var(--font-body); letter-spacing: 5px; text-transform: uppercase; color: var(--green-dark); white-space: nowrap; }
  .c2a-chap .t { font: 600 52px/1.12 var(--font-head); color: var(--green); white-space: nowrap; }
  .c2a-who { display: flex; flex-direction: column; gap: 12px; padding-left: 26px; border-left: 8px solid var(--green); margin-top: 18px; }
  .c2a-who .nm { font: 700 46px/1 var(--font-head); color: var(--ink); white-space: nowrap; }
  .c2a-who .cr { font: 700 30px/1 var(--font-body); color: var(--green-dark); letter-spacing: 1px; white-space: nowrap; }
  .c2a-who .og { font: 500 28px/1 var(--font-body); color: var(--ink-soft); white-space: nowrap; }
  .c2a-ring { position: absolute; border-radius: 50%; border: 14px solid #fff; box-shadow: 0 0 0 6px var(--green), 0 24px 60px rgba(40,60,20,0.22); overflow: hidden; background: #ddd; }
  .c2a-ring img, .c2a-snap img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
  .c2a-snap { position: absolute; border: 12px solid #fff; border-radius: 22px; box-shadow: 0 22px 50px rgba(40,60,20,0.26); overflow: hidden; background: #ddd; }

  .c2a-card { position: absolute; width: 560px; height: 620px; box-sizing: border-box; padding: 40px 36px; background: #fff; border-radius: 28px;
    border: 1px solid #e6e9e1; display: flex; flex-direction: column; align-items: flex-start; }
  .c2a-card .bd { width: 84px; height: 84px; border-radius: 50%; display: grid; place-items: center; flex: 0 0 auto; }
  .c2a-card .bd svg { width: 46px; height: 46px; stroke-width: 2.2; }
  .c2a-card .lab { margin-top: 24px; font: 700 48px/1 var(--font-head); color: var(--ink); white-space: nowrap; }
  .c2a-card .rule { margin: 28px 0 26px; width: 100%; height: 2px; background: #eef1ea; }
  .c2a-card .rows { display: flex; flex-direction: column; gap: 22px; width: 100%; }
  .c2a-stmt { font: 600 38px/1.3 var(--font-head); color: var(--ink); }
  .c2a-stmt b { color: var(--green); font-weight: 700; }
  .c2a-row { display: flex; align-items: center; gap: 18px; font: 600 30px/1.2 var(--font-body); color: var(--ink); }
  .c2a-row .ic { width: 50px; height: 50px; border-radius: 50%; display: grid; place-items: center; flex: 0 0 auto; }
  .c2a-row .ic svg { width: 28px; height: 28px; stroke-width: 2.4; }
  .c2a-row .ic.num { font: 700 28px/1 var(--font-head); }

  .c2a-def { position: absolute; display: flex; align-items: center; gap: 30px; padding: 30px 44px 30px 30px; background: #fff; border-radius: 28px;
    border: 1px solid #e6e9e1; box-shadow: var(--shadow-soft); }
  .c2a-def .eq { flex: 0 0 auto; padding: 18px 30px; border-radius: 20px; background: var(--green); color: #fff; font: 700 46px/1 var(--font-head); white-space: nowrap; }
  .c2a-def .tx { font: 500 40px/1.28 var(--font-body); color: var(--ink); }
  .c2a-def .tx b { color: var(--green-dark); font-weight: 700; }
  .c2a-axis { position: absolute; font: 600 28px/1 var(--font-body); color: var(--muted); white-space: nowrap; }
  .c2a-bl { position: absolute; text-align: center; font: 700 88px/1.05 var(--font-head); color: var(--ink); white-space: nowrap; }
  .c2a-bl b { color: var(--green); font-weight: 700; }
  `;
  const SH0 = '0 10px 30px rgba(40,60,20,0.10), 0 0 0 0px rgba(97,149,55,0)';
  const SHH = '0 18px 44px rgba(40,60,20,0.16), 0 0 0 4px rgba(97,149,55,1)';
  const css = stage => stage.appendChild(K.el('style', null, CSS));
  const { sayAt, clamp } = C1;

  // ================================================================== ch02intro Welcome
  registerScene('ch02intro', ctx => {
    const { stage, tl, end, dur } = ctx;
    css(stage);
    const col = K.el('div', 'c2a-col');
    Object.assign(col.style, { left: '100px', top: '190px', width: '1000px' });
    const kick = K.el('div', 'c2a-kick', 'Calling All Dogs');
    const title = K.el('div', 'c2a-title', 'Getting Started with Dog Behavior');
    const bar = K.el('div', 'c2a-bar');
    const chap = K.el('div', 'c2a-chap');
    chap.appendChild(K.el('div', 'n', 'Chapter 2'));
    const chT = K.el('div', 't', 'Understanding Your Dog’s Baseline');
    chap.appendChild(chT);
    const who = K.el('div', 'c2a-who');
    [['nm', 'Tori Ganino'], ['cr', 'BS, CDBC, CPDT-KA'], ['og', 'Calling All Dogs · Training for all breeds']].forEach(([c, t]) => who.appendChild(K.el('div', c, t)));
    [kick, title, bar, chap, who].forEach(n => col.appendChild(n));
    stage.appendChild(col);

    const RR = 270, CX = 1450, CY = 532;
    const ring = K.el('div', 'c2a-ring');
    Object.assign(ring.style, { left: CX - RR + 'px', top: CY - RR + 'px', width: 2 * RR + 'px', height: 2 * RR + 'px' });
    const head = K.el('img');
    head.src = '../assets/img/trainer_headshot.jpg';
    ring.appendChild(head);
    stage.appendChild(ring);
    const snap = K.el('div', 'c2a-snap');
    Object.assign(snap.style, { left: '1060px', top: '664px', width: '392px', height: '294px' });
    const pic = K.el('img');
    pic.src = '../assets/img/trainer_with_dog.jpg';
    snap.appendChild(pic);
    stage.appendChild(snap);

    A.in(tl, kick, 0.1, 'fadeUp', { dur: 0.6 });
    A.in(tl, title, 0.25, 'fadeUp', { dur: 0.8 });
    A.in(tl, bar, 0.55, 'grow', { dur: 0.6 });
    A.in(tl, chap, 0.7, 'fadeUp', { dur: 0.8 });
    tl.fromTo(ring, { opacity: 0, scale: 0.86 }, { opacity: 1, scale: 1, duration: 1.0, ease: 'power3.out' }, 0.45);
    tl.fromTo(head, { scale: 1.08 }, { scale: 1.0, duration: Math.max(1, dur - 0.5), ease: 'none' }, 0.45);
    const tName = clamp(sayAt(ctx, 0, 'Tori Ganino', 0.1), 1.1, end(0) - 5);
    A.in(tl, who, tName, 'fadeRight', { dur: 0.7 });
    const tSnap = clamp(sayAt(ctx, 0, 'Calling All Dogs', 0.25), tName + 0.6, end(0) - 4);
    tl.fromTo(snap, { opacity: 0, y: 40, rotation: 3 }, { opacity: 1, y: 0, rotation: -5, duration: 0.9, ease: 'power3.out' }, tSnap);
    const tTitle = clamp(sayAt(ctx, 0, 'Getting Started', 0.5), tSnap + 0.6, end(0) - 2.5);
    tl.to(bar, { width: 260, duration: 0.8, ease: 'power2.inOut' }, tTitle);
    const tCh = clamp(sayAt(ctx, 0, 'Chapter 2', 0.75), tTitle + 0.6, end(0) - 1);
    tl.to(chT, { scale: 1.06, transformOrigin: '0% 50%', duration: 0.3, yoyo: true, repeat: 1, ease: 'power2.out' }, tCh);
  });

  /** One plan card: icon badge, label, then rows (or a statement). */
  function card(stage, x, o) {
    const c = K.el('div', 'c2a-card');
    Object.assign(c.style, { left: x + 'px', top: '290px', boxShadow: SH0 });
    const bd = K.el('div', 'bd');
    Object.assign(bd.style, { background: o.bg, color: o.fg });
    bd.appendChild(K.icon(o.icon));
    c.appendChild(bd);
    c.appendChild(K.el('div', 'lab', o.lab));
    c.appendChild(K.el('div', 'rule'));
    if (o.text) {
      const st = K.el('div', 'c2a-stmt', K.md(o.text));
      c.appendChild(st);
      stage.appendChild(c);
      return { c, bd, rs: [st] };
    }
    const rows = K.el('div', 'rows');
    const rs = o.rows.map((t, i) => {
      const r = K.el('div', 'c2a-row');
      const ic = K.el('div', 'ic' + (o.num ? ' num' : ''));
      Object.assign(ic.style, { background: o.rowBg, color: o.rowFg });
      if (o.num) ic.textContent = String(i + 1);
      else ic.appendChild(K.icon(o.rowIcons[i]));
      r.appendChild(ic);
      r.appendChild(K.el('span', null, t));
      rows.appendChild(r);
      return r;
    });
    c.appendChild(rows);
    stage.appendChild(c);
    return { c, bd, rs };
  }

  // ================================================================== ch02plan Where we're headed
  registerScene('ch02plan', ctx => {
    const { stage, tl, cue, end } = ctx;
    css(stage);
    const h = K.heading(stage, 'Where we’re headed', { x: 100, y: 110, size: 72, barGap: 20 });
    A.in(tl, h.all, 0.05, 'fadeUp', { dur: 0.7, stagger: 0.1 });
    const cards = [
      card(stage, 100, { icon: 'circle-alert', bg: 'var(--amber-pale)', fg: 'var(--amber)', lab: 'Why it matters',
        rows: ['Fine one day', 'Over the edge the next', 'There’s a reason'], rowIcons: ['smile', 'zap', 'search'],
        rowBg: 'var(--amber-pale)', rowFg: 'var(--amber)' }),
      card(stage, 680, { icon: 'target', bg: 'var(--green-pale)', fg: 'var(--green-dark)', lab: 'What you’ll gain',
        text: 'Know what *raises or lowers* your dog’s baseline, and *what you can do* about it' }),
      card(stage, 1260, { icon: 'route', bg: 'var(--green)', fg: '#fff', lab: 'How we’ll get there',
        rows: ['What a baseline is', 'Four areas that affect it', 'How it adds up, and comes down'], num: true, rowBg: 'var(--green)', rowFg: '#fff' }),
    ];
    const CUES = [
      [['just fine one day', 0.3], ['the next day', 0.55], ['usually a reason', 0.85]],
      [['raise or lower', 0.5]],
      [['First', 0.2], ['Second', 0.45], ['third', 0.72]],
    ];
    cards.forEach((k, b) => {
      const t = cue(b) + 0.05;
      if (b > 0) tl.to(cards[b - 1].c, { boxShadow: SH0, duration: 0.5, ease: 'power2.out' }, t);
      tl.fromTo(k.c, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, t);
      tl.to(k.c, { boxShadow: SHH, duration: 0.6, ease: 'power2.out' }, t + 0.3);
      A.in(tl, k.bd, t + 0.25, 'pop', { dur: 0.55 });
      let lo = t + 0.7;
      k.rs.forEach((r, i) => {
        const [p, fb] = CUES[b][i];
        const tr = clamp(sayAt(ctx, b, p, fb, 0.25), lo, end(b) - 0.4);
        A.in(tl, r, tr, 'fadeRight', { dur: 0.55 });
        lo = tr + 0.35;
      });
    });
  });

  // ================================================================== ch02s01 Understanding Your Dog's Baseline
  registerScene('ch02s01', ctx => {
    const { stage, tl, cue, end, dur } = ctx;
    C1.style(stage);
    C2.style(stage);
    css(stage);
    const at = (i, p, fb, lead) => sayAt(ctx, i, p, fb, lead);
    const h = K.heading(stage, 'Understanding Your Dog’s Baseline', { x: 100, y: 120, w: 1450, size: 76 });
    A.in(tl, h.all, 0.05, 'fadeUp', { dur: 0.7, stagger: 0.1 });

    // ---------- beat 0: chapter 1's bowl, full
    const LB = C2.layer(stage);
    const B = C1.makeBowl(LB, { cx: 600, y: 560, s: 1.05, filled: 8 });
    B.slots.forEach(sl => gsap.set(sl.g, { opacity: 0 }));
    tl.fromTo(B.wrap, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out' }, cue(0) + 0.1);
    tl.fromTo(B.glow, { opacity: 0 }, { opacity: 0.8, duration: 1.0 }, cue(0) + 0.4);
    const cap = C2.pill(LB, 'book-open', 'Chapter 1: *the ingredients*', { x: 600, y: 850, center: true, variant: 'pale' });
    A.in(tl, cap, cue(0) + 0.6, 'fadeUp', { dur: 0.6 });

    // ---------- beat 1: four returning ingredients glow and their names appear at right; the rest dim
    const BACK = [2, 5, 6, 7]; // breed history, past experiences, training tools, pain
    const t1 = at(1, 'some of those factors', 0.2, 0.2);
    A.out(tl, cap, t1, 'fade', { dur: 0.4 });
    tl.to(B.glow, { opacity: 0.25, duration: 0.6 }, t1);
    B.tokens.forEach((tk, k) => {
      if (!BACK.includes(k)) tl.to(tk.outer, { opacity: 0.25, duration: 0.6, ease: 'power2.out' }, t1);
    });
    const pills = BACK.map((k, j) => {
      const g = C1.ING[k];
      const p = C2.pill(LB, g.icon, g.name, { x: 1010, y: 300 + j * 112, col: g.col });
      const tk = B.tokens[k];
      tl.to(tk.inner, { scale: 1.3, transformOrigin: '50% 50%', duration: 0.35, yoyo: true, repeat: 1, ease: 'power2.out' }, t1 + 0.3 + j * 0.25);
      A.in(tl, p, t1 + 0.45 + j * 0.25, 'fadeRight', { dur: 0.6 });
      return p;
    });
    const tInt = clamp(at(1, "That's intentional", 0.8, 0.2), t1 + 1.6, end(1) - 0.3);
    const intent = C2.pill(LB, 'check', 'On purpose', { x: 1010, y: 760, variant: 'green' });
    A.in(tl, intent, tInt, 'pop', { dur: 0.55 });

    // ---------- beat 2: changed, managed, improved; right now; at "a little differently" the bowl view slides away
    const t2 = cue(2);
    tl.to([...pills, intent], { opacity: 0, x: 40, duration: 0.45, stagger: 0.05, ease: 'power2.in' }, t2 - 0.1);
    const TAGS = [['wrench', 'Changed', 'changed'], ['sliders-horizontal', 'Managed', 'managed'], ['trending-up', 'Improved', 'improved']];
    let lo = t2 + 0.4;
    const tags = TAGS.map(([ic, t, p], j) => {
      const n = C2.pill(LB, ic, t, { x: 1010, y: 300 + j * 112, variant: 'green', size: 36 });
      const tt = clamp(at(2, p, 0.15 + j * 0.06, 0.2), lo, end(2) - 4);
      A.in(tl, n, tt, 'pop', { dur: 0.5 });
      lo = tt + 0.35;
      return n;
    });
    const now = C2.pill(LB, 'clock', 'Affecting your dog *right now*', { x: 1010, y: 660, variant: 'amber', size: 34 });
    const tNow = clamp(at(2, 'right now', 0.6, 0.3), lo + 0.3, end(2) - 2);
    A.in(tl, now, tNow, 'fadeUp', { dur: 0.6 });
    tl.to(now.querySelector('.ic'), { rotation: 360, duration: 1.2, ease: 'power2.inOut' }, tNow + 0.4);
    const tDiff = clamp(at(2, 'a little differently', 0.9, 0.2), tNow + 1.0, end(2) - 0.5);
    tl.to(B.wrap, { x: -260, opacity: 0, duration: 0.8, ease: 'power2.in' }, tDiff);
    tl.to([...tags, now], { opacity: 0, x: 60, duration: 0.5, stagger: 0.05, ease: 'power2.in' }, tDiff + 0.1);

    // ---------- beat 3: "Your dog's baseline" on a level line
    const t3 = Math.max(cue(3), tDiff + 0.9);
    const LC = C2.layer(stage, tl, t3);
    const bl = C2.put(LC, 'c2a-bl', 'Your dog’s *baseline*', { x: 0, y: 470, w: 1920 });
    A.in(tl, bl, t3, 'fadeUp', { dur: 0.8 });
    const sv = K.svg(LC, { x: 0, y: 0, w: 1920, h: 1080 });
    const ln = K.line(sv, 460, 640, 1460, 640, { stroke: C2.C.water, 'stroke-width': 12 });
    A.draw(tl, ln, t3 + 0.3, 1.0);
    const wv = K.path(sv, 'M 460 676 q 31 -14 62 0 t 62 0 t 62 0 t 62 0 t 62 0 t 62 0 t 62 0 t 62 0 t 62 0 t 62 0 t 62 0 t 62 0 t 62 0 t 62 0 t 62 0 t 62 0 t 0 0', { stroke: C2.C.waterTop, 'stroke-width': 7, fill: 'none' });
    A.draw(tl, wv, t3 + 0.6, 1.0);
    tl.fromTo(wv, { x: 0 }, { x: -62, duration: 1.4, ease: 'none', repeat: Math.max(0, Math.floor((dur - t3 - 2) / 1.4)) }, t3 + 1.6);
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
    def.appendChild(K.el('div', 'eq', 'Baseline ='));
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

    // ---------- beat 1: the band rises and falls between levels; "Not fixed. It can change."
    const t1 = cue(1);
    const LVS = [660, 820, 700, 780];
    let prev = LV0, t = clamp(at(1, "isn't fixed", 0.3, 0.2), t1, end(1) - 1);
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
    const tCh = clamp(at(1, 'It can change', 0.65, 0.2), t + 0.6, end(1));
    A.in(tl, chip, Math.max(tCh, cue(1) + 0.4), 'pop', { dur: 0.55 });
  });
})();
