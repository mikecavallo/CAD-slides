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
  .c2a-who { display: flex; flex-direction: column; gap: 12px; padding-left: 26px; border-left: 8px solid var(--green); margin-top: 26px; }
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
    // the presentation's own title, exactly as in Chapter 1; the chapter number sits in the footer tab, the chapter title on the next card
    const col = K.el('div', 'c2a-col');
    Object.assign(col.style, { left: '100px', top: '232px', width: '1000px' });
    const kick = K.el('div', 'c2a-kick', 'Calling All Dogs');
    const title = K.el('div', 'c2a-title', 'Understanding<br>Dog Behavior');
    const bar = K.el('div', 'c2a-bar');
    const who = K.el('div', 'c2a-who');
    [['nm', 'Tori Ganino'], ['cr', 'BS, CDBC, CPDT-KA'], ['og', 'Calling All Dogs · Training for all breeds']].forEach(([c, t]) => who.appendChild(K.el('div', c, t)));
    [kick, title, bar, who].forEach(n => col.appendChild(n));
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
    tl.fromTo(ring, { opacity: 0, scale: 0.86 }, { opacity: 1, scale: 1, duration: 1.0, ease: 'power3.out' }, 0.45);
    tl.fromTo(head, { scale: 1.08 }, { scale: 1.0, duration: Math.max(1, dur - 0.5), ease: 'none' }, 0.45);
    const tName = clamp(sayAt(ctx, 0, 'Tori Ganino', 0.1), 1.1, end(0) - 6);
    A.in(tl, who, tName, 'fadeRight', { dur: 0.7 });
    const tSnap = clamp(sayAt(ctx, 0, 'Calling All Dogs', 0.2), tName + 0.6, end(0) - 5);
    tl.fromTo(snap, { opacity: 0, y: 40, rotation: 3 }, { opacity: 1, y: 0, rotation: -5, duration: 0.9, ease: 'power3.out' }, tSnap);
    const tTitle = clamp(sayAt(ctx, 0, 'Understanding Dog Behavior', 0.6), tSnap + 0.6, end(0) - 3);
    tl.to(bar, { width: 260, duration: 0.8, ease: 'power2.inOut' }, tTitle);
  });

  // ================================================================== ch02card the chapter card, narrated
  // the same look as the automatic chapter cards (base.css .bumper-*), as a scene so Tori's "This is Chapter 2" plays over it
  registerScene('ch02card', ctx => {
    const { stage, tl } = ctx;
    const num = K.el('div', 'bumper-num', '02');
    const bar = K.el('div', 'bumper-bar');
    const kick = K.el('div', 'bumper-kicker', 'Chapter 2');
    const title = K.el('div', 'bumper-title', 'Understanding Your Dog\u2019s Baseline');
    [num, bar, kick, title].forEach(x => stage.appendChild(x));
    A.in(tl, num, 0.05, 'fadeRight', { dur: 0.9 });
    A.in(tl, bar, 0.25, 'grow', { dur: 0.6 });
    A.in(tl, kick, 0.35, 'fadeUp', { dur: 0.6 });
    A.in(tl, title, 0.5, 'fadeUp', { dur: 0.8 });
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

    // ---------- beat 0: chapter 1's bowl and its eight ingredients
    const LB = C2.layer(stage);
    const BX = 560, BY = 600;
    const B = C1.makeBowl(LB, { cx: BX, y: BY, s: 1.0, filled: 8 });
    B.slots.forEach(sl => gsap.set(sl.g, { opacity: 0 }));
    tl.fromTo(B.wrap, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out' }, cue(0) + 0.1);
    tl.fromTo(B.glow, { opacity: 0 }, { opacity: 0.8, duration: 1.0 }, cue(0) + 0.4);
    const ingP = C2.pill(LB, 'book-open', 'Chapter 1: *the ingredients*', { x: BX, y: 860, center: true, variant: 'pale' });
    A.in(tl, ingP, cue(0) + 0.6, 'fadeUp', { dur: 0.6 });

    // ---------- beat 1: four returning ingredients glow and their names appear at right, under one header that says why
    // (they can be changed, managed, or improved); the rest dim (they can't)
    const BACK = [2, 5, 6, 7]; // breed history, past experiences, training tools, pain
    const t1 = at(1, 'some of those factors', 0.2, 0.2);
    A.out(tl, ingP, t1, 'fade', { dur: 0.4 });
    tl.to(B.glow, { opacity: 0.25, duration: 0.6 }, t1);
    B.tokens.forEach((tk, k) => { if (!BACK.includes(k)) tl.to(tk.outer, { opacity: 0.25, duration: 0.6, ease: 'power2.out' }, t1); });
    const hdr = K.el('div', 'c2a-cmi');
    hdr.innerHTML = 'Can be <span>changed,</span> <span>managed,</span> or <span>improved</span>';
    Object.assign(hdr.style, { left: '1080px', top: '268px' });
    LB.appendChild(hdr);
    const words = [...hdr.querySelectorAll('span')];
    const pills = BACK.map((k, j) => {
      const g = C1.ING[k];
      const p = C2.pill(LB, g.icon, g.name, { x: 1080, y: 340 + j * 100, col: g.col });
      tl.to(B.tokens[k].inner, { scale: 1.3, transformOrigin: '50% 50%', duration: 0.35, yoyo: true, repeat: 1, ease: 'power2.out' }, t1 + 0.3 + j * 0.25);
      A.in(tl, p, t1 + 0.45 + j * 0.25, 'fadeRight', { dur: 0.6 });
      return p;
    });
    const tInt = clamp(at(1, "That's intentional", 0.8, 0.2), t1 + 1.6, end(1) - 0.3);
    A.in(tl, hdr, tInt, 'fadeUp', { dur: 0.55 });
    const cant = C2.pill(LB, 'lock', 'The rest can’t be changed', { x: BX, y: 860, center: true, size: 30, col: C2.C.muted, variant: 'pale' });
    A.in(tl, cant, tInt + 0.4, 'fadeUp', { dur: 0.55 });

    // ---------- beat 2: the same header lights up word by word; a dashed pill adds the chapter's other factors; right now
    const t2 = cue(2);
    let lo = t2 + 0.2;
    [['changed', 0.2], ['managed', 0.26], ['improved', 0.32]].forEach(([p, fb], j) => {
      const tt = clamp(at(2, p, fb, 0.2), lo, end(2) - 3);
      tl.to(words[j], { color: '#ffffff', backgroundColor: C2.C.green, duration: 0.3 }, tt);
      lo = tt + 0.3;
    });
    const more = C2.pill(LB, 'plus', 'More factors in this chapter', { x: 1080, y: 740, size: 30, col: C2.C.green });
    Object.assign(more.style, { border: '3px dashed var(--green)', background: 'var(--green-mist)' });
    A.in(tl, more, lo + 0.2, 'fadeRight', { dur: 0.55 });
    const now = C2.pill(LB, 'clock', 'Affecting your dog *right now*', { x: 1080, y: 846, variant: 'amber', size: 32 });
    const tNow = clamp(at(2, 'right now', 0.6, 0.3), lo + 0.6, end(2) - 0.8);
    A.in(tl, now, tNow, 'fadeUp', { dur: 0.6 });

    // ---------- beat 3: "we're going to add those ingredients to a pot": the bowl tips and the ingredients drop into an empty pot
    const tDiff = cue(3);
    tl.to([...pills, hdr, more, now, cant], { opacity: 0, duration: 0.4, stagger: 0.03, ease: 'power2.in' }, tDiff - 0.3);
    tl.to(B.tokens.map(t => t.outer), { opacity: 1, duration: 0.3 }, tDiff - 0.3);
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
