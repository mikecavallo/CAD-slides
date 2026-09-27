// Chapter 1: What is aggression?
// Scenes: ch01s01 (four jobs of aggression), ch01s02 (communication + iceberg), ch01s03 (the warning ladder).
(function () {
  const css = `
    .c1-out { position:absolute; border:3px dashed #b8d99a; border-radius:26px; background:rgba(255,255,255,0.38);
      display:grid; place-items:center; font:800 104px/1 var(--font-head); color:rgba(97,149,55,0.18); }
    .c1-card { position:absolute; background:#fff; border-radius:26px; border:1px solid #e6e9e1; box-shadow:var(--shadow-soft); padding:0 36px;
      display:flex; flex-direction:column; justify-content:center; }
    .c1-card .top { display:flex; align-items:center; gap:24px; }
    .c1-card .badge { flex:0 0 auto; width:96px; height:96px; border-radius:50%; background:var(--green); color:#fff; display:grid; place-items:center; }
    .c1-card .badge svg { width:52px; height:52px; }
    .c1-card .job { font:700 26px/1 var(--font-body); letter-spacing:6px; text-transform:uppercase; color:var(--green); }
    .c1-card .ttl { margin-top:24px; font:700 38px/1.1 var(--font-head); color:var(--ink); white-space:nowrap; }
    .c1-pin { position:absolute; display:flex; align-items:center; gap:14px; padding:10px 28px 10px 10px; border-radius:999px;
      background:var(--amber); color:#fff; font:700 30px/1 var(--font-body); white-space:nowrap; box-shadow:0 12px 26px rgba(120,70,10,0.26); }
    .c1-pin .eye { width:52px; height:52px; border-radius:50%; background:#fff; color:var(--amber); display:grid; place-items:center; }
    .c1-pin .eye svg { width:32px; height:32px; }

    .c1-fig { position:absolute; border-radius:50%; display:grid; place-items:center; background:var(--green-pale); color:var(--green-dark); box-shadow:var(--shadow-soft); }
    .c1-fig svg { width:56%; height:56%; }
    .c1-fig.other { background:#eceee8; color:var(--ink-soft); }
    .c1-fig.dog { background:var(--green); color:#fff; }
    .c1-ring { position:absolute; border-radius:50%; border:4px dashed #b8d99a; }
    .c1-bub { position:absolute; padding:20px 34px; border-radius:30px; background:var(--green); color:#fff; font:700 38px/1.1 var(--font-body);
      white-space:nowrap; box-shadow:0 12px 28px rgba(44,74,23,0.20); }
    .c1-bub .tail { position:absolute; width:32px; height:32px; background:inherit; bottom:-14px; transform:rotate(45deg); border-radius:0 0 7px 0; }
    .c1-bub.white { background:#fff; color:var(--green-dark); }
    .c1-tip { position:absolute; display:flex; flex-direction:column; align-items:center; gap:18px; }
    .c1-tip .row { display:flex; gap:14px; }
    .c1-tag { padding:12px 26px; border-radius:999px; background:var(--green); color:#fff; font:700 32px/1.1 var(--font-body);
      white-space:nowrap; box-shadow:0 8px 20px rgba(44,74,23,0.20); }
    .c1-emo { position:absolute; text-align:center; font:700 44px/1 var(--font-head); color:var(--green-deep); white-space:nowrap; }
    .c1-emo.big { font-size:60px; }
    .c1-side { position:absolute; font:700 26px/1 var(--font-body); letter-spacing:5px; text-transform:uppercase; color:var(--green-dark); white-space:nowrap; }
    .c1-side.under { color:var(--green-deep); }
    .c1-drive { position:absolute; font:700 42px/1.18 var(--font-head); color:var(--green-dark); }

    .c1-cap { position:absolute; text-align:right; font:700 42px/1.1 var(--font-head); color:var(--green); white-space:nowrap; }
    .c1-tags { position:absolute; display:flex; flex-wrap:wrap; justify-content:flex-end; gap:14px; }
    .c1-tags .chip { position:relative; font-size:28px; padding:14px 26px; }
    .c1-gift-t { position:absolute; font:700 50px/1.12 var(--font-head); color:var(--ink); }
    .c1-note { position:absolute; background:#fff; border-radius:26px; border:1px solid #e6e9e1; box-shadow:var(--shadow); padding:62px 36px 36px; }
    .c1-note .q { font:700 46px/1.14 var(--font-head); color:var(--ink); }
    .c1-try { position:absolute; display:flex; align-items:center; gap:12px; padding:14px 26px 14px 18px; border-radius:999px; background:var(--green);
      color:#fff; font:700 26px/1 var(--font-body); letter-spacing:3px; text-transform:uppercase; white-space:nowrap; box-shadow:0 10px 22px rgba(44,74,23,0.26); }
    .c1-try svg { width:32px; height:32px; }
  `;
  const style = () => K.el('style', null, css);
  const box = (parent, cls, html, o) => {
    const n = K.el('div', cls, html == null ? null : K.md(html));
    K.place(n, o);
    parent.appendChild(n);
    return n;
  };
  // Time of a phrase inside beat i, proportional to where it sits in the beat's narration, so it
  // scales with any recording speed. Leads the word slightly; never earlier than the beat's cue.
  const sayAt = ctx => (i, phrase, lead = 0.3, fb = 0.4) => Math.max(ctx.cue(i), window.phraseTime(ctx, i, phrase, fb) - lead);

  // The shared warning ladder (ch03s04 rebuilds it small with the same six rungs).
  const LADDER = [
    { t: 'Subtle stress signals', icon: 'eye-off' },
    { t: 'Stiffening, hard stare', icon: 'eye' },
    { t: 'Growl', icon: 'volume-2' },
    { t: 'Snarl, lip lift', icon: 'triangle-alert' },
    { t: 'Snap', icon: 'zap' },
    { t: 'Bite', icon: 'octagon-alert' },
  ];

  // ------------------------------------------------------------------ ch01s01: What is aggression?
  registerScene('ch01s01', (ctx) => {
    const { stage, tl, cue } = ctx;
    const at = sayAt(ctx);
    stage.appendChild(style());

    // photo card, left third
    const photo = K.photo(stage, 'photo_aggression.jpg', { x: 100, y: 115, w: 580, h: 845, pos: '50% 38%' });
    A.in(tl, photo.root, Math.max(0, cue(0) - 0.25), 'fadeRight', { dur: 1.0 });
    A.kenburns(tl, photo.img, { from: 1.03, to: 1.13, y0: 0, y1: -2 });

    const RX = 770, RW = 1050, GAP = 30;
    const cw = (RW - GAP) / 2, ch = 238;
    const gx = [RX, RX + cw + GAP], gy = [440, 440 + ch + 26];

    // heading: writes on centered beside the photo, then rises to make room for the grid
    const h = K.heading(stage, 'What is aggression?', { x: RX, y: 180, w: RW, size: 88 });
    tl.fromTo(h.root, { y: 290 }, { y: 0, duration: 0.9, ease: 'power3.inOut' }, cue(1));
    A.in(tl, h.title, cue(0) + 0.35, 'wipe', { dur: 1.1 });
    A.in(tl, h.bar, cue(1) + 0.55, 'grow', { dur: 0.6 });

    // one-line lead under the heading that changes with the idea of the moment
    const leads = ['Behavior aimed at a *goal*', 'It only has to *feel* threatening', '*Four jobs* aggression does']
      .map(s => K.text(stage, s, { x: RX, y: 336, w: RW, cls: 'lead' }));

    // four empty outlines, then the four job cards
    const jobs = [
      { icon: 'move-horizontal', t: 'Create distance' },
      { icon: 'shield', t: 'Stop a threat' },
      { icon: 'bone', t: 'Guard what they value' },
      { icon: 'hand', t: 'Change the outcome' },
    ];
    const outs = jobs.map((j, i) => box(stage, 'c1-out', String(i + 1), { x: gx[i % 2], y: gy[i >> 1], w: cw, h: ch }));
    const cards = jobs.map((j, i) => {
      const c = box(stage, 'c1-card', null, { x: gx[i % 2], y: gy[i >> 1], w: cw, h: ch });
      const top = K.el('div', 'top');
      const b = K.el('div', 'badge');
      b.appendChild(K.icon(j.icon, { stroke: 2.2 }));
      top.appendChild(b);
      top.appendChild(K.el('div', 'job', 'Job ' + (i + 1)));
      c.appendChild(top);
      c.appendChild(K.el('div', 'ttl', j.t));
      return { c, b };
    });
    const fill = (i, t) => {
      tl.to(outs[i], { opacity: 0, duration: 0.4, ease: 'power2.out' }, t);
      tl.fromTo(cards[i].c, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.7 }, t);
      A.in(tl, cards[i].b, t + 0.2, 'pop', { dur: 0.6 });
    };

    // crossfade the lead line: old slides up and out quickly, new rises into the same slot
    const swapLead = (from, to, t) => {
      tl.to(from, { opacity: 0, y: -24, duration: 0.3, ease: 'power2.out' }, t - 0.05);
      tl.fromTo(to, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, t + 0.25);
    };

    // beat 2: heading rises, definition line, then four empty outlines on "four jobs"
    A.in(tl, leads[0], Math.max(cue(1) + 0.7, at(1, 'it describes')), 'fadeUp', { dur: 0.7 });
    A.in(tl, outs, Math.max(cue(1) + 1.2, at(1, 'one of four')), 'scale', { dur: 0.6, stagger: 0.1 });

    // beat 3: each top card fills as the narration names it
    fill(0, cue(2) + 0.05);
    fill(1, Math.max(cue(2) + 1.2, at(2, 'job two')));

    // beat 4: shield card pulses, "Perceived" pin
    const pin = box(stage, 'c1-pin', null, { x: 1548, y: 402 });
    const eye = K.el('div', 'eye');
    eye.appendChild(K.icon('eye', { stroke: 2.4 }));
    pin.appendChild(eye);
    pin.appendChild(K.el('span', null, 'Perceived'));
    A.pulse(tl, cards[1].c, cue(3), { scale: 1.04 });
    tl.fromTo(pin, { opacity: 0, scale: 0.4, rotation: -14 }, { opacity: 1, scale: 1, rotation: -4, duration: 0.7, ease: 'back.out(1.8)' }, cue(3) + 0.35);
    swapLead(leads[0], leads[1], Math.max(cue(3) + 0.9, at(3, 'the threat')));

    // beat 5: bottom row fills, each card on its own job
    fill(2, cue(4) + 0.05);
    fill(3, Math.max(cue(4) + 1.2, at(4, 'job four')));
    swapLead(leads[1], leads[2], cue(4));
  });

  // ------------------------------------------------------------------ ch01s02: It's communication
  registerScene('ch01s02', (ctx) => {
    const { stage, tl, cue, dur } = ctx;
    const at = sayAt(ctx);
    stage.appendChild(style());

    const h = K.heading(stage, 'It’s communication', { x: 100, y: 120, w: 1400, size: 84 });
    A.in(tl, h.title, Math.max(0, cue(0) - 0.2), 'fadeUp', { dur: 0.8 });
    A.in(tl, h.bar, cue(0) + 0.3, 'grow', { dur: 0.6 });

    // --- iceberg diagram (same geometry as the copy in ch03s05; built first so labels sit on top)
    const WL = 562; // waterline y
    const svg = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const defs = K.svgEl('defs', {}, svg);
    const grad = K.svgEl('linearGradient', { id: 'c1-water', x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    K.svgEl('stop', { offset: '0', 'stop-color': '#b8d99a', 'stop-opacity': 0.5 }, grad);
    K.svgEl('stop', { offset: '1', 'stop-color': '#e8f1dc', 'stop-opacity': 0 }, grad);
    let wave = `M0 ${WL}`;
    for (let x = 0; x < 1920; x += 40) wave += ` Q${x + 10} ${WL - 8} ${x + 20} ${WL} Q${x + 30} ${WL + 8} ${x + 40} ${WL}`;
    const water = K.group(svg);
    K.path(water, `${wave} L1920 962 L0 962 Z`, { fill: 'url(#c1-water)', stroke: 'none' });
    const mass = K.group(svg);
    K.path(mass, `M560 ${WL} L466 690 L512 836 L700 934 L1220 934 L1418 826 L1452 684 L1360 ${WL} Z`, { fill: '#d3e5bf', stroke: 'none' });
    K.path(mass, `M1110 ${WL} L1360 ${WL} L1452 684 L1418 826 L1220 934 L1180 934 L1330 760 Z`, { fill: '#c6dcaf', stroke: 'none' });
    const tip = K.group(svg);
    K.path(tip, `M560 ${WL} L700 452 L790 430 L880 318 L960 288 L1040 330 L1150 420 L1250 470 L1360 ${WL} Z`, { fill: '#fbfdf8', stroke: '#a9cf86', 'stroke-width': 4 });
    K.path(tip, `M960 288 L1040 330 L1150 420 L1250 470 L1360 ${WL} L1080 ${WL} L1010 420 Z`, { fill: '#e4efd8', stroke: 'none' });
    const line = K.path(svg, wave, { stroke: '#619537', 'stroke-width': 5, fill: 'none' });

    // --- beat 1: two people in line, one crowding the other
    const R = 220;
    const ring = box(stage, 'c1-ring', null, { x: 870 - 215, y: 630 - 215, w: 430, h: 430 });
    const me = box(stage, 'c1-fig', null, { x: 870 - R / 2, y: 630 - R / 2, w: R, h: R });
    me.appendChild(K.icon('user', { stroke: 1.8 }));
    const other = box(stage, 'c1-fig other', null, { x: 1370 - R / 2, y: 630 - R / 2, w: R, h: R });
    other.appendChild(K.icon('user', { stroke: 1.8 }));
    const excuse = box(stage, 'c1-bub white', 'Excuse me.', { x: 480, y: 330 });
    const et = K.el('div', 'tail'); et.style.right = '46px'; excuse.appendChild(et);

    const t0 = cue(0);
    const creep = Math.max(t0 + 0.5, at(0, 'stands too close'));
    A.in(tl, [me, other], t0, 'pop', { dur: 0.7, stagger: 0.12 });
    A.in(tl, ring, t0 + 0.2, 'scale', { dur: 0.6 });
    tl.to(other, { x: -120, duration: 0.45, ease: 'power2.inOut' }, creep);
    tl.to(other, { x: -250, duration: 0.45, ease: 'power2.inOut' }, creep + 0.5);
    tl.to(ring, { borderColor: '#d9912b', duration: 0.4 }, creep + 0.6);
    tl.fromTo(excuse, { opacity: 0, scale: 0.4, transformOrigin: '85% 100%' }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.8)' },
      Math.max(creep + 1.2, at(0, 'excuse me')));

    // --- beat 2: the dog and its three messages, each popping as it is named
    const DR = 260;
    const dog = box(stage, 'c1-fig dog', null, { x: 960 - DR / 2, y: 650 - DR / 2, w: DR, h: DR });
    dog.appendChild(K.icon('dog', { stroke: 1.7 }));
    // anchors: ax is the bubble's right edge (xp -100), center (xp -50) or left edge (xp 0)
    const bubDefs = [
      { t: 'Back off.', ax: 790, y: 420, xp: -100, tail: 'r', ox: '85% 100%', say: 'back off', cx: 669 },
      { t: 'Go away.', ax: 960, y: 300, xp: -50, tail: 'c', ox: '50% 100%', say: 'go away', cx: 960 },
      { t: 'This is mine.', ax: 1130, y: 420, xp: 0, tail: 'l', ox: '15% 100%', say: 'this is mine', cx: 1287 },
    ];
    const bubs = bubDefs.map(d => {
      const b = box(stage, 'c1-bub', d.t, { x: d.ax, y: d.y });
      gsap.set(b, { xPercent: d.xp });
      const tail = K.el('div', 'tail');
      if (d.tail === 'r') tail.style.right = '44px';
      else if (d.tail === 'l') tail.style.left = '44px';
      else { tail.style.left = '50%'; tail.style.marginLeft = '-16px'; }
      b.appendChild(tail);
      return { b, tail, d };
    });

    const t1 = cue(1);
    A.out(tl, [me, other, ring, excuse], t1 - 0.1, 'shrink', { dur: 0.45 });
    tl.fromTo(dog, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.6)' }, t1 + 0.25);
    A.pulse(tl, dog, Math.max(t1 + 1.1, at(1, 'a hard stare')), { scale: 1.06 });
    let prev = t1 + 1.4;
    bubs.forEach(o => {
      const t = Math.max(prev, at(1, o.d.say));
      tl.fromTo(o.b, { opacity: 0, scale: 0.4, transformOrigin: o.d.ox }, { opacity: 1, scale: 1, duration: 0.55, ease: 'back.out(1.8)' }, t);
      prev = t + 0.35;
    });

    // --- beat 3: the messages shrink into the behaviors we see on the iceberg tip; feelings sit underneath
    const t2 = cue(2);
    A.out(tl, dog, t2, 'shrink', { dur: 0.45 });
    bubs.forEach(o => {
      tl.set(o.b, { transformOrigin: '50% 50%' }, t2);
      tl.to(o.b, { x: 960 - o.d.cx, y: 440 - (o.d.y + 41), scale: 0.3, opacity: 0, duration: 0.65, ease: 'power2.in' }, t2 + 0.05);
    });
    A.draw(tl, line, t2 + 0.2, 1.0);
    A.in(tl, water, t2 + 0.5, 'fade', { dur: 0.8 });
    A.in(tl, tip, t2 + 0.35, 'fade', { dur: 0.7 });
    A.in(tl, mass, t2 + 0.6, 'fadeUp', { dur: 0.8 });

    // four behavior labels, stacked as a small pyramid inside the tip
    const tipBox = box(stage, 'c1-tip', null, { x: 960, y: 372 });
    gsap.set(tipBox, { xPercent: -50 });
    const rowA = K.el('div', 'row'), rowB = K.el('div', 'row');
    tipBox.appendChild(rowA); tipBox.appendChild(rowB);
    const tags = ['Stare', 'Growl', 'Snap', 'Bite'].map((s, k) => {
      const n = K.el('div', 'c1-tag', s);
      (k === 0 ? rowA : rowB).appendChild(n);
      return n;
    });
    A.in(tl, tags, t2 + 0.6, 'pop', { dur: 0.55, stagger: 0.12 });

    const seeL = box(stage, 'c1-side', 'What you see', { x: 130, y: WL - 58 });
    const feelL = box(stage, 'c1-side under', 'What they feel', { x: 130, y: WL + 34 });
    A.in(tl, [seeL, feelL], t2 + 1.0, 'fade', { dur: 0.6, stagger: 0.1 });
    const emos = [
      { n: box(stage, 'c1-emo big', 'Fear', { x: 760, y: 626, w: 400 }), say: 'fear' },
      { n: box(stage, 'c1-emo', 'Frustration', { x: 570, y: 790, w: 400 }), say: 'frustration' },
      { n: box(stage, 'c1-emo', 'Guarding', { x: 940, y: 790, w: 400 }), say: 'guard' },
    ];
    prev = t2 + 1.2;
    emos.forEach(e => {
      const t = Math.max(prev, at(2, e.say));
      A.in(tl, e.n, t, 'fadeUp', { dur: 0.6 });
      prev = t + 0.4;
    });
    // arrow from the emotions up to the behavior, with the takeaway beside it
    const arrow = K.group(svg);
    const shaft = K.path(arrow, 'M1500 878 L1500 470', { stroke: '#3f6b22', 'stroke-width': 6 });
    const head = K.path(arrow, 'M1478 494 L1500 470 L1522 494', { stroke: '#3f6b22', 'stroke-width': 6 });
    const drive = box(stage, 'c1-drive', 'Emotion<br>drives the<br>behavior', { x: 1540, y: 600, w: 280 });
    const ta = Math.max(prev + 0.2, at(2, 'the behavior is'));
    A.draw(tl, shaft, ta, 0.7);
    A.in(tl, head, ta + 0.6, 'fade', { dur: 0.3 });
    A.in(tl, drive, ta + 0.2, 'fadeLeft', { dur: 0.6 });

    // --- beat 4: the iceberg clears; "Behavior with intent." lands beside the photo
    const t3 = cue(3);
    tl.to([svg, tipBox, ...emos.map(e => e.n), seeL, feelL, drive, ...h.all], { opacity: 0, duration: 0.4, ease: 'power2.out' }, t3 - 0.25);
    const photo = K.photo(stage, 'photo_aggression.jpg', { x: 100, y: 115, w: 580, h: 845, pos: '50% 38%' });
    A.in(tl, photo.root, t3 + 0.2, 'fadeRight', { dur: 0.9 });
    A.kenburns(tl, photo.img, { from: 1.03, to: 1.1, t0: t3, t1: dur });
    const f = K.flow(stage, { x: 790, y: 115, w: 1030, h: 845, valign: 'center', gap: 34 });
    const kick = K.kicker(f, 'Aggression is');
    kick.style.fontSize = '30px';
    const big = K.heading(f, 'Behavior<br>with intent.', { size: 132, barGap: 40 });
    big.bar.style.width = '170px';
    big.bar.style.height = '12px';
    A.in(tl, kick, t3 + 0.45, 'fadeUp', { dur: 0.6 });
    A.in(tl, big.title, t3 + 0.6, 'scale', { dur: 0.9 });
    A.in(tl, big.bar, t3 + 1.05, 'grow', { dur: 0.6 });
  });

  // ------------------------------------------------------------------ ch01s03: The warning ladder
  registerScene('ch01s03', (ctx) => {
    const { stage, tl, cue } = ctx;
    const at = sayAt(ctx);
    stage.appendChild(style());

    const h = K.heading(stage, 'The warning ladder', { x: 100, y: 120, w: 1100, size: 84 });
    A.in(tl, h.title, Math.max(0, cue(0) - 0.2), 'fadeUp', { dur: 0.8 });
    A.in(tl, h.bar, cue(0) + 0.3, 'grow', { dur: 0.6 });

    // geometry: rungs top-to-bottom 292..896, rails 272..956
    const LX = 630, LY = 292, RH = 84, RG = 20, LW = 600;
    const L = K.ladder(stage, LADDER, { x: LX, y: LY, w: LW, rungH: RH, gap: RG, size: 32 });
    const HH = LADDER.length * RH + (LADDER.length - 1) * RG;
    const rungTop = i => LY + HH - (i + 1) * RH - i * RG;
    const SHADOW = '0 6px 16px rgba(40,60,20,0.14)';

    // start every rung as an empty outline in its own color
    L.rungs.forEach((r, i) => {
      Object.assign(r.style, { background: 'rgba(255,255,255,0.6)', border: `3px solid ${L.color(i)}`, color: L.color(i), boxShadow: '0 6px 16px rgba(40,60,20,0)' });
      [...r.children].forEach(c => (c.style.opacity = 0));
    });
    const fillRung = (i, t) => {
      const r = L.rungs[i];
      tl.to(r, { backgroundColor: L.color(i), color: '#ffffff', boxShadow: SHADOW, duration: 0.5, ease: 'power2.out' }, t);
      tl.fromTo([...r.children], { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.5, stagger: 0.06 }, t + 0.1);
    };

    // beat 1: the ladder draws itself in, bottom to top
    const t0 = cue(0);
    tl.fromTo(L.rails, { scaleY: 0, transformOrigin: '50% 100%' }, { scaleY: 1, duration: 1.3, ease: 'power2.inOut' }, t0 + 0.1);
    tl.fromTo(L.rungs, { opacity: 0, scaleX: 0.6 }, { opacity: 1, scaleX: 1, duration: 0.5, stagger: 0.14, ease: 'power3.out' }, t0 + 0.3);

    // beat 2: quiet signals (bottom rung + tags as they are named), then the stiff, hard stare
    const t1 = cue(1);
    const quiet = box(stage, 'c1-cap', 'Quiet signals first', { x: 100, y: rungTop(1) + 8, w: 500 });
    const tags = box(stage, 'c1-tags', null, { x: 100, y: rungTop(1) + 76, w: 500 });
    const chips = ['Lip lick', 'Yawn', 'Look away'].map(s => { const c = K.el('div', 'chip pale', s); tags.appendChild(c); return c; });
    fillRung(0, t1 + 0.05);
    A.in(tl, quiet, t1 + 0.3, 'fadeLeft', { dur: 0.6 });
    let prev = t1 + 0.9;
    ['a lip lick', 'a yawn', 'a head turned'].forEach((p, k) => {
      const t = Math.max(prev, at(1, p));
      A.in(tl, chips[k], t, 'fadeUp', { dur: 0.5 });
      prev = t + 0.4;
    });
    fillRung(1, Math.max(prev, at(1, 'then the body')));

    // beat 3: nobody listens (the quiet side dims); growl, snarl, snap fill as each is named
    const t2 = cue(2);
    A.dim(tl, [quiet, tags], t2, 0.4, { dur: 0.6 });
    const loud = box(stage, 'c1-cap', null, { x: LX + LW + 70, y: rungTop(3) + 20, w: 1820 - LX - LW - 70 });
    loud.style.textAlign = 'left';
    const words = ['Growl.', 'Snarl.', 'Snap.'].map((s, k) => {
      const sp = K.el('span', null, s + (k < 2 ? ' ' : ''));
      sp.style.color = L.color(k + 2);
      loud.appendChild(sp);
      return sp;
    });
    prev = t2 + 0.6;
    ['a growl', 'a lip lifted', 'then a snap'].forEach((p, k) => {
      const t = Math.max(prev, at(2, p));
      fillRung(k + 2, t);
      A.in(tl, words[k], t + 0.1, 'fadeRight', { dur: 0.5 });
      prev = t + 0.5;
    });

    // beat 4: attention goes to the very top, then the top rung fills and flashes red on "bite"
    const t3 = cue(3);
    const bite = L.rungs[5];
    A.pulse(tl, bite, t3 + 0.1, { scale: 1.04 });
    const tb = Math.max(t3 + 0.9, at(3, 'comes a bite'));
    fillRung(5, tb);
    tl.to(bite, { boxShadow: '0 0 0 22px rgba(184,69,45,0.30)', scale: 1.06, duration: 0.28, ease: 'power2.out' }, tb + 0.3);
    tl.to(bite, { boxShadow: SHADOW, scale: 1, duration: 0.5, ease: 'power2.inOut' }, tb + 0.58);
    tl.to(bite, { boxShadow: '0 0 0 14px rgba(184,69,45,0.22)', duration: 0.25, ease: 'power2.out' }, tb + 1.1);
    tl.to(bite, { boxShadow: SHADOW, duration: 0.5, ease: 'power2.inOut' }, tb + 1.35);

    // beat 5: a green brace wraps the five warning rungs; the gift lands on "those warnings"
    const t4 = cue(4);
    const y1 = rungTop(4) + 4, y2 = rungTop(0) + RH - 4, mid = (y1 + y2) / 2, bx = LX + LW + 50, r = 24;
    const svg = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const brace = K.path(svg, `M${bx} ${y1} Q${bx + r} ${y1} ${bx + r} ${y1 + r} L${bx + r} ${mid - r} Q${bx + r} ${mid} ${bx + 2 * r} ${mid} ` +
      `M${bx} ${y2} Q${bx + r} ${y2} ${bx + r} ${y2 - r} L${bx + r} ${mid + r} Q${bx + r} ${mid} ${bx + 2 * r} ${mid}`, { stroke: '#619537', 'stroke-width': 6 });
    const gx = bx + 2 * r + 40;
    const gift = K.iconBadge(stage, 'gift', { x: gx, y: mid - 146, size: 136, variant: 'solid' });
    const giftT = box(stage, 'c1-gift-t', 'Warnings are<br>*a gift*', { x: gx, y: mid + 14, w: 1820 - gx });
    tl.to(loud, { opacity: 0, duration: 0.35, ease: 'power2.out' }, t4 - 0.2);
    A.draw(tl, brace, t4 + 0.1, 0.9);
    const tg = Math.max(t4 + 1.0, at(4, 'those warnings'));
    A.in(tl, gift, tg, 'pop', { dur: 0.7 });
    A.in(tl, giftT, tg + 0.25, 'fadeUp', { dur: 0.6 });

    // beat 6: the left annotations clear; a note card with a pinned green "Try this" badge slides in
    // beside the quiet rungs, which then glow
    const t5 = cue(5);
    tl.to([quiet, tags], { opacity: 0, duration: 0.4, ease: 'power2.out' }, t5);
    // "barking and lunging can be loud warnings too": the loud middle rungs give a small nudge
    A.pulse(tl, [L.rungs[2], L.rungs[3], L.rungs[4]], t5 + 0.4, { scale: 1.03 });
    const NY = rungTop(1) - 6;
    const note = box(stage, 'c1-note', null, { x: 124, y: NY, w: 456 });
    note.appendChild(K.el('div', 'q', K.md('Spot the *quiet rungs* first')));
    const tryB = box(stage, 'c1-try', null, { x: 100, y: NY - 30 });
    tryB.appendChild(K.icon('notebook-pen', { stroke: 2.4 }));
    tryB.appendChild(K.el('span', null, 'Try this'));
    const tn = Math.max(t5 + 0.6, at(5, 'this week'));
    tl.fromTo(note, { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, tn);
    tl.fromTo(tryB, { opacity: 0, scale: 0.4, rotation: -14 }, { opacity: 1, scale: 1, rotation: -4, duration: 0.7, ease: 'back.out(1.8)' }, tn + 0.45);
    const quietRungs = [L.rungs[0], L.rungs[1]];
    const G0 = '0 6px 16px rgba(40,60,20,0.14), 0 0 0 0px rgba(143,191,95,0)';
    const G1 = '0 6px 16px rgba(40,60,20,0.14), 0 0 0 16px rgba(143,191,95,0.42)';
    const G2 = '0 6px 16px rgba(40,60,20,0.14), 0 0 0 10px rgba(143,191,95,0.36)';
    const tq = Math.max(tn + 0.9, at(5, 'the quiet rungs'));
    tl.fromTo(quietRungs, { boxShadow: G0 }, { boxShadow: G1, duration: 0.45, ease: 'power2.out' }, tq);
    tl.to(quietRungs, { boxShadow: G2, duration: 0.5, ease: 'power2.inOut' }, tq + 0.45);
    tl.to(quietRungs, { boxShadow: G1, duration: 0.45, ease: 'power2.out' }, tq + 1.0);
    tl.to(quietRungs, { boxShadow: G2, duration: 0.6, ease: 'power2.inOut' }, tq + 1.45);
  });
})();
