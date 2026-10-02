// Welcome chapter (ch00): the title slide and the problem / promise / plan slide.
//   ch00s01  Welcome             presentation title at left; Tori's headshot in a green ring at right, the training photo as a
//                                tilted card over its corner; name and credentials appear as the name is said
//   ch00s02  Where we're headed  three cards, one per beat: Why you're here, What you'll gain, How we'll get there (two steps)
(() => {
  const CSS = `
  .c0-col { position: absolute; display: flex; flex-direction: column; align-items: flex-start; gap: 30px; }
  .c0-kick { font: 700 28px/1 var(--font-body); letter-spacing: 6px; text-transform: uppercase; color: var(--green); white-space: nowrap; }
  .c0-title { font: 700 88px/1.06 var(--font-head); color: var(--ink); }
  .c0-bar { width: 140px; height: 10px; border-radius: 6px; background: var(--green-light); }
  .c0-sub { font: 600 48px/1.14 var(--font-head); color: var(--green); white-space: nowrap; }
  .c0-who { display: flex; flex-direction: column; gap: 12px; padding-left: 26px; border-left: 8px solid var(--green); margin-top: 26px; }
  .c0-who .nm { font: 700 46px/1 var(--font-head); color: var(--ink); white-space: nowrap; }
  .c0-who .cr { font: 700 30px/1 var(--font-body); color: var(--green-dark); letter-spacing: 1px; white-space: nowrap; }
  .c0-who .og { font: 500 28px/1 var(--font-body); color: var(--ink-soft); white-space: nowrap; }
  .c0-ring { position: absolute; border-radius: 50%; border: 14px solid #fff; box-shadow: 0 0 0 6px var(--green), 0 24px 60px rgba(40,60,20,0.22); overflow: hidden; background: #ddd; }
  .c0-ring img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
  .c0-snap { position: absolute; border: 12px solid #fff; border-radius: 22px; box-shadow: 0 22px 50px rgba(40,60,20,0.26); overflow: hidden; background: #ddd; }
  .c0-snap img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }

  .c0-card { position: absolute; width: 560px; height: 600px; box-sizing: border-box; padding: 40px 36px; background: #fff; border-radius: 28px;
    border: 1px solid #e6e9e1; display: flex; flex-direction: column; align-items: flex-start; }
  .c0-card .bd { width: 84px; height: 84px; border-radius: 50%; display: grid; place-items: center; flex: 0 0 auto; }
  .c0-card .bd svg { width: 46px; height: 46px; stroke-width: 2.2; }
  .c0-card .lab { margin-top: 24px; font: 700 48px/1 var(--font-head); color: var(--ink); white-space: nowrap; }
  .c0-card .sub { margin-top: 12px; font: 500 30px/1.2 var(--font-body); color: var(--muted); white-space: nowrap; }
  .c0-card .rule { margin: 28px 0 26px; width: 100%; height: 2px; background: #eef1ea; }
  .c0-card .rows { display: flex; flex-direction: column; gap: 22px; width: 100%; }
  .c0-stmt { font: 600 38px/1.3 var(--font-head); color: var(--ink); }
  .c0-stmt b { color: var(--green); font-weight: 700; }
  .c0-row { display: flex; align-items: center; gap: 18px; font: 600 30px/1.2 var(--font-body); color: var(--ink); }
  .c0-row .ic { width: 50px; height: 50px; border-radius: 50%; display: grid; place-items: center; flex: 0 0 auto; }
  .c0-row .ic svg { width: 28px; height: 28px; stroke-width: 2.4; }
  .c0-row .ic.num { font: 700 28px/1 var(--font-head); }
  `;
  const SH0 = '0 10px 30px rgba(40,60,20,0.10), 0 0 0 0px rgba(97,149,55,0)';
  const SHH = '0 18px 44px rgba(40,60,20,0.16), 0 0 0 4px rgba(97,149,55,1)';

  // ================================================================== ch00s01 Welcome
  registerScene('ch00s01', ctx => {
    const { stage, tl, cue, end, dur } = ctx;
    const { sayAt, clamp } = C1;
    stage.appendChild(K.el('style', null, CSS));

    const col = K.el('div', 'c0-col');
    Object.assign(col.style, { left: '100px', top: '232px', width: '1000px' });
    const kick = K.el('div', 'c0-kick', 'Calling All Dogs');
    const title = K.el('div', 'c0-title', 'Getting Started with Dog Behavior');
    const bar = K.el('div', 'c0-bar');
    const sub = K.el('div', 'c0-sub', 'Understanding Reactivity and Aggression');
    const who = K.el('div', 'c0-who');
    const nm = K.el('div', 'nm', 'Tori Ganino');
    const cr = K.el('div', 'cr', 'BS, CDBC, CPDT-KA');
    const og = K.el('div', 'og', 'Calling All Dogs · Training for all breeds');
    [nm, cr, og].forEach(n => who.appendChild(n));
    [kick, title, bar, sub, who].forEach(n => col.appendChild(n));
    stage.appendChild(col);

    // the headshot in a ring, and the training photo as a tilted card over its lower left
    const R = 270, CX = 1450, CY = 532;
    const ring = K.el('div', 'c0-ring');
    Object.assign(ring.style, { left: CX - R + 'px', top: CY - R + 'px', width: 2 * R + 'px', height: 2 * R + 'px' });
    const head = K.el('img');
    head.src = '../assets/img/trainer_headshot.jpg';
    ring.appendChild(head);
    stage.appendChild(ring);
    const snap = K.el('div', 'c0-snap');
    Object.assign(snap.style, { left: '1060px', top: '664px', width: '392px', height: '294px' });
    const pic = K.el('img');
    pic.src = '../assets/img/trainer_with_dog.jpg';
    snap.appendChild(pic);
    stage.appendChild(snap);

    // the title is up before the first word; the photo follows; name and the training card land as they are said
    A.in(tl, kick, 0.1, 'fadeUp', { dur: 0.6 });
    A.in(tl, title, 0.25, 'fadeUp', { dur: 0.8 });
    A.in(tl, bar, 0.55, 'grow', { dur: 0.6 });
    A.in(tl, sub, 0.7, 'fadeUp', { dur: 0.8 });
    tl.fromTo(ring, { opacity: 0, scale: 0.86 }, { opacity: 1, scale: 1, duration: 1.0, ease: 'power3.out' }, 0.45);
    tl.fromTo(head, { scale: 1.08 }, { scale: 1.0, duration: Math.max(1, dur - 0.5), ease: 'none' }, 0.45);
    const tName = clamp(sayAt(ctx, 0, 'Tori Ganino', 0.1), 1.1, end(0) - 4);
    A.in(tl, who, tName, 'fadeRight', { dur: 0.7 });
    const tSnap = clamp(sayAt(ctx, 0, 'Calling All Dogs', 0.3), tName + 0.6, end(0) - 3);
    tl.fromTo(snap, { opacity: 0, y: 40, rotation: 3 }, { opacity: 1, y: 0, rotation: -5, duration: 0.9, ease: 'power3.out' }, tSnap);
    const tTitle = clamp(sayAt(ctx, 0, 'Getting Started', 0.5), tSnap + 0.6, end(0) - 1.5);
    tl.to(bar, { width: 260, duration: 0.8, ease: 'power2.inOut' }, tTitle);
  });

  /** One of the three cards: icon badge, label, sub-line, then rows. Returns the card, its badge and its rows. */
  function card(stage, x, o) {
    const c = K.el('div', 'c0-card');
    Object.assign(c.style, { left: x + 'px', top: '300px', boxShadow: SH0 });
    const bd = K.el('div', 'bd');
    Object.assign(bd.style, { background: o.bg, color: o.fg });
    bd.appendChild(K.icon(o.icon));
    c.appendChild(bd);
    c.appendChild(K.el('div', 'lab', o.lab));
    if (o.sub) c.appendChild(K.el('div', 'sub', o.sub));
    c.appendChild(K.el('div', 'rule'));
    if (o.text) {
      const st = K.el('div', 'c0-stmt', K.md(o.text));
      c.appendChild(st);
      stage.appendChild(c);
      return { c, bd, rs: [st] };
    }
    const rows = K.el('div', 'rows');
    const rs = o.rows.map((t, i) => {
      const r = K.el('div', 'c0-row');
      const ic = K.el('div', 'ic' + (o.num ? ' num' : ''));
      Object.assign(ic.style, { background: o.rowBg, color: o.rowFg });
      if (o.num) ic.textContent = String(i + 1);
      else ic.appendChild(K.icon(o.rowIcons ? o.rowIcons[i] : 'check'));
      r.appendChild(ic);
      r.appendChild(K.el('span', null, t));
      rows.appendChild(r);
      return r;
    });
    c.appendChild(rows);
    stage.appendChild(c);
    return { c, bd, rs };
  }

  // ================================================================== ch00s02 Where we're headed
  registerScene('ch00s02', ctx => {
    const { stage, tl, cue, end } = ctx;
    const { C, sayAt, clamp } = C1;
    stage.appendChild(K.el('style', null, CSS));
    const h = K.heading(stage, 'Where we\'re headed', { x: 100, y: 110, size: 72, barGap: 20 });
    A.in(tl, h.all, 0.05, 'fadeUp', { dur: 0.7, stagger: 0.1 });

    const cards = [
      card(stage, 100, { icon: 'circle-alert', bg: 'var(--amber-pale)', fg: 'var(--amber)', lab: 'Why you\'re here',
        rows: ['Stressful walks', 'Barking, lunging, growling', 'Confusing advice'], rowIcons: ['footprints', 'volume-2', 'message-circle-warning'],
        rowBg: 'var(--amber-pale)', rowFg: 'var(--amber)' }),
      card(stage, 680, { icon: 'target', bg: 'var(--green-pale)', fg: 'var(--green-dark)', lab: 'What you\'ll gain',
        text: 'Understand the *factors that set the stage* for your dog\'s behavior' }),
      card(stage, 1260, { icon: 'route', bg: 'var(--green)', fg: '#fff', lab: 'How we\'ll get there',
        rows: ['The difference between reactivity and aggression', 'The ingredients that shape behavior'], num: true, rowBg: 'var(--green)', rowFg: '#fff' }),
    ];
    // each beat: its card slides up and takes the green outline; its rows land as they are said
    const CUES = [
      [['walks feel stressful', 0.35], ['barks, lunges', 0.6], ['the advice', 0.85]],
      [['various factors', 0.45]],
      [['First', 0.25], ['second', 0.7]],
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
})();
