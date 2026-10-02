// Chapter 1 (v9): breed history and purpose. Bowl parts come from window.C1 (c1_bowl.js).
//   ch01s06  Breed history and purpose   six breed-job cards (photo of an example breed + job line) around a small bowl;
//                                         each card enlarges in turn into a large panel with a little job vignette;
//                                         "clues, not guarantees" lands over the cards with a row of different dog
//                                         silhouettes beneath them; the cards fly into the bowl as the third ingredient
(() => {
  const CSS = `
  .c1e-q { position: absolute; font: 600 40px/1.1 var(--font-head); color: var(--ink); white-space: nowrap; }
  .c1e-card { position: absolute; width: 680px; height: 178px; background: #fff; border-radius: 24px; border: 1px solid #e6e9e1; }
  .c1e-card .nm { position: absolute; left: 243px; top: 18px; font: 700 32px/1.1 var(--font-head); color: var(--green-dark); white-space: nowrap; }
  .c1e-card .job { position: absolute; left: 243px; top: 64px; width: 414px; font: 500 26px/1.22 var(--font-body); color: var(--ink-soft); }
  .c1e-det { position: absolute; width: 1720px; height: 566px; background: #fff; border-radius: 30px; border: 1px solid #e6e9e1;
    box-shadow: 0 24px 60px rgba(40,60,20,0.18); }
  .c1e-det .dh { position: absolute; left: 763px; top: 36px; display: flex; align-items: center; gap: 22px; }
  .c1e-det .bd { width: 84px; height: 84px; border-radius: 50%; background: var(--green); color: #fff; display: grid; place-items: center; flex: 0 0 auto; }
  .c1e-det .bd svg { width: 46px; height: 46px; stroke-width: 2.2; }
  .c1e-det .dnm { font: 700 60px/1 var(--font-head); color: var(--green-dark); white-space: nowrap; }
  .c1e-det .djob { position: absolute; left: 763px; top: 142px; width: 910px; font: 500 36px/1.25 var(--font-body); color: var(--ink-soft); }
  .c1e-det .photo .tag { left: 20px; bottom: 20px; padding: 10px 20px; font: 600 28px/1 var(--font-body); color: var(--green-deep); }
  .c1e-vig { position: absolute; left: 763px; top: 250px; width: 909px; height: 290px; overflow: hidden; }
  .c1e-pills { position: absolute; left: 0; top: 214px; width: 909px; display: flex; justify-content: center; gap: 18px; }
  .c1e-pill { padding: 12px 28px; border-radius: 999px; background: var(--green-pale); color: var(--green-deep); font: 700 30px/1 var(--font-body); white-space: nowrap; }
  .c1e-tiles { position: absolute; left: 0; top: 20px; width: 909px; display: flex; justify-content: center; gap: 46px; }
  .c1e-tile { display: flex; flex-direction: column; align-items: center; gap: 16px; width: 190px; }
  .c1e-tile .tb { width: 124px; height: 124px; border-radius: 50%; background: var(--green-pale); color: var(--green-dark); display: grid; place-items: center; }
  .c1e-tile .tb svg { width: 64px; height: 64px; stroke-width: 2; }
  .c1e-tile .tl { font: 700 32px/1 var(--font-body); color: var(--ink); white-space: nowrap; }
  .c1e-banrow { position: absolute; display: flex; justify-content: center; }
  .c1e-sil { position: absolute; display: flex; justify-content: center; align-items: flex-end; gap: 96px; }
  .c1e-sil img { display: block; width: auto; }
  .c1e-ban { display: flex; align-items: center; gap: 28px; padding: 28px 56px 28px 28px; border-radius: 30px; background: #fff;
    box-shadow: var(--shadow); border: 1px solid #e6e9e1; }
  .c1e-ban .bi { width: 92px; height: 92px; border-radius: 50%; background: var(--green); color: #fff; display: grid; place-items: center; flex: 0 0 auto; }
  .c1e-ban .bi svg { width: 50px; height: 50px; stroke-width: 2.2; }
  .c1e-ban .bt { font: 700 60px/1.1 var(--font-head); color: var(--ink); white-space: nowrap; }
  .c1e-list { position: absolute; display: flex; flex-direction: column; gap: 24px; align-items: flex-start; }
  .c1e-list .c1-cap { font-size: 34px; padding: 12px 36px 12px 12px; }
  .c1e-list .c1-dot { width: 60px; height: 60px; }
  .c1e-list .c1-dot svg { width: 34px; height: 34px; }
  .c1e-puz { position: absolute; display: flex; align-items: center; gap: 26px; }
  .c1e-puz .pi { width: 96px; height: 96px; border-radius: 50%; background: var(--green-pale); color: var(--green-dark); display: grid; place-items: center; flex: 0 0 auto; }
  .c1e-puz .pi svg { width: 52px; height: 52px; stroke-width: 2.1; }
  .c1e-puz .pt { font: 600 56px/1.1 var(--font-head); color: var(--ink); white-space: nowrap; }
  `;

  // a sheep in the Lucide line style (24 x 24): woolly body, head on the left, legs
  if (window.ICONS && !window.ICONS.sheep) {
    window.ICONS.sheep = '<path d="M8 9.2a2.4 2.4 0 0 1 4-1.6a2.4 2.4 0 0 1 4 0a2.4 2.4 0 0 1 3.4 2.4a2.4 2.4 0 0 1 0 3.8a2.4 2.4 0 0 1-3.4 2.4a2.4 2.4 0 0 1-4 0a2.4 2.4 0 0 1-4-1.6"/>'
      + '<path d="M8 9.2c-1-.6-2.4-.7-3.4 0c-1.3 1-1.4 3.4-.2 4.6c.9.9 2.6 1 3.6.4"/><path d="M4.6 9.3l-1.8-.9"/><path d="M9.5 16.2V20M15.5 16.2V20"/>';
  }

  // Photos: one per job, swap img/breed here when photos change (4:3 crops, 960 x 720, centred on the dog).
  const JOBS = [
    { key: 'herding', nm: 'Herding', job: 'Control and move livestock', ic: 'sheep', img: 'breed_herding.jpg', breed: 'Australian Shepherd' },
    { key: 'guarding', nm: 'Guarding', job: 'Monitor and respond to potential threats', ic: 'shield', img: 'breed_guarding.jpg', breed: 'Great Pyrenees' },
    { key: 'hunting', nm: 'Hunting and pursuit', job: 'Locate, track, chase, or capture animals', ic: 'footprints', img: 'breed_hunting.jpg', breed: 'Beagle' },
    { key: 'terrier', nm: 'Terrier work', job: 'Locate and pursue small animals and vermin', ic: 'rat', img: 'breed_terrier.jpg', breed: 'Jack Russell Terrier' },
    { key: 'sporting', nm: 'Sporting work', job: 'Find, flush, point to, or retrieve game', ic: 'bird', img: 'breed_sporting.jpg', breed: 'Golden Retriever' },
    { key: 'working', nm: 'Working and assistance', job: 'Perform physical, specialized, or human-directed tasks', ic: 'hard-hat', img: 'breed_working.jpg', breed: 'Labrador Retriever' },
  ];
  const CW = 680, CH = 178;
  const GX = [100, 1140], GY = [296, 490, 684];
  const PH = { x: 8, y: 8, w: 213, h: 160, r: 16 }; // 4:3 photo at the card's left edge
  const DET = { x: 100, y: 296, w: 1720, h: 566 }; // the enlarged card covers the whole card area
  const DCX = DET.x + DET.w / 2, DCY = DET.y + DET.h / 2, DS = DET.w / CW;
  const BOWL = { cx: 960, y: 600, scale: 0.36 }; // small bowl between the two columns of cards
  const SH0 = '0 10px 30px rgba(40,60,20,0.10), 0 0 0 0px rgba(97,149,55,0)';
  const SHG = '0 14px 36px rgba(40,60,20,0.14), 0 0 0 4px rgba(184,217,154,1)';

  /** One small breed-job card: photo on the left, job name and job line on the right. */
  function jobCard(parent, g, x, y) {
    const c = K.el('div', 'c1e-card');
    Object.assign(c.style, { left: x + 'px', top: y + 'px', boxShadow: SH0 });
    K.photo(c, g.img, { x: PH.x, y: PH.y, w: PH.w, h: PH.h, radius: PH.r });
    c.appendChild(K.el('div', 'nm', g.nm));
    c.appendChild(K.el('div', 'job', g.job));
    parent.appendChild(c);
    return { c, cx: x + CW / 2, cy: y + CH / 2 };
  }

  /** The enlarged version of a card: big photo with the breed tag, job name, job line and an empty vignette box. */
  function detailCard(parent, g) {
    const d = K.el('div', 'c1e-det');
    Object.assign(d.style, { left: DET.x + 'px', top: DET.y + 'px', opacity: 0 });
    K.photo(d, g.img, { x: 24, y: 24, w: 691, h: 518, radius: 22, tag: g.breed });
    const dh = K.el('div', 'dh');
    const bd = K.el('div', 'bd');
    bd.appendChild(K.icon(g.ic));
    dh.appendChild(bd);
    dh.appendChild(K.el('div', 'dnm', g.nm));
    d.appendChild(dh);
    d.appendChild(K.el('div', 'djob', g.job));
    const vig = K.el('div', 'c1e-vig');
    d.appendChild(vig);
    const svg = K.svgEl('svg', { viewBox: '0 0 909 290', width: 909, height: 290 }, vig);
    Object.assign(svg.style, { position: 'absolute', left: 0, top: 0, overflow: 'visible' });
    parent.appendChild(d);
    return { d, bd, vig, svg };
  }

  /** Row of keyword pills along the bottom of a vignette. */
  function pills(vig, words) {
    const row = K.el('div', 'c1e-pills');
    const ps = words.map(w => {
      const p = K.el('div', 'c1e-pill', w);
      row.appendChild(p);
      return p;
    });
    vig.appendChild(row);
    return ps;
  }

  /** Row of round icon tiles with labels. */
  function tiles(vig, items) {
    const row = K.el('div', 'c1e-tiles');
    const ts = items.map(([ic, lab]) => {
      const t = K.el('div', 'c1e-tile');
      const b = K.el('div', 'tb');
      b.appendChild(K.icon(ic));
      t.appendChild(b);
      t.appendChild(K.el('div', 'tl', lab));
      row.appendChild(t);
      return { t, b };
    });
    vig.appendChild(row);
    return ts;
  }

  /** Arrow head (open chevron) at (x, y) pointing along angle a (degrees). */
  function arrowHead(g, x, y, a, col) {
    const r = (a * Math.PI) / 180, L = 22;
    const p = d => [x - L * Math.cos(r + d), y - L * Math.sin(r + d)];
    const [ax, ay] = p(0.5), [bx, by] = p(-0.5);
    return K.path(g, `M ${ax} ${ay} L ${x} ${y} L ${bx} ${by}`, { stroke: col, 'stroke-width': 6 });
  }

  // dog silhouettes for "individual variation": cut from real dog photos and from the Calling All Dogs logo
  // (assets/img/sil_*.png, brand green), shown at different heights so size varies too
  const DOGS = [['standing', 70], ['chihuahua', 44], ['golden', 80], ['terrier', 40], ['collie', 62], ['dane', 92]];

  // ================================================================== ch01s06 Breed history and purpose
  registerScene('ch01s06', ctx => {
    const { stage, tl, cue, end, dur } = ctx;
    const { C, STD, SLOT, ING, sayAt, clamp } = C1;
    C1.style(stage);
    stage.appendChild(K.el('style', null, CSS));

    const h = K.heading(stage, 'Breed history and purpose', { x: 100, y: 110, size: 72, barGap: 20 });
    A.in(tl, h.all, 0.05, 'fadeUp', { dur: 0.7, stagger: 0.1 });

    const cards = JOBS.map((g, i) => jobCard(stage, g, GX[Math.floor(i / 3)], GY[i % 3]));
    const cardEls = cards.map(k => k.c);

    // the bowl is built at its standard size and parked small between the two columns of cards
    const B = C1.makeBowl(stage, { cx: STD.cx, y: STD.y, s: STD.s, filled: 2 });
    const SM = { x: BOWL.cx - STD.cx, y: BOWL.y - STD.y, scale: BOWL.scale / STD.s };
    gsap.set(B.wrap, { ...SM });
    A.in(tl, B.wrap, 0, 'fade', { dur: 0.6 });
    C1.bob(tl, B, 0, dur);

    const dets = JOBS.map(g => detailCard(stage, g));

    // ---------- beat 0: "ingredient three" (its chip blinks), the line, then the six cards
    const tIng = clamp(sayAt(ctx, 0, 'Ingredient three', 0.02), cue(0) + 0.2, cue(0) + 1.5);
    tl.to(B.slots[2].g, { scale: 1.45, transformOrigin: '50% 50%', duration: 0.3, ease: 'sine.inOut', yoyo: true, repeat: 3 }, tIng);

    const q = C1.put(stage, 'c1e-q', 'Different jobs, *different tendencies*', { x: 100, y: 232 });
    const tQ = clamp(sayAt(ctx, 0, 'selectively bred', 0.3), cue(0) + 0.8, cue(1) - 4);
    A.in(tl, q, tQ, 'fadeUp', { dur: 0.7 });

    const tCards = clamp(sayAt(ctx, 0, 'specific jobs', 0.5), tQ + 0.6, cue(1) - 2.2);
    cards.forEach((k, i) => A.in(tl, k.c, tCards + i * 0.18, 'fadeUp', { dur: 0.7 }));
    // a soft wave across the cards on "naturally notice, respond to, or be motivated to do"
    const tW = clamp(sayAt(ctx, 0, 'naturally notice', 0.75), tCards + 1.8, cue(1) - 1.6);
    cards.forEach((k, i) => tl.to(k.c, { boxShadow: SHG, scale: 1.02, duration: 0.35, ease: 'sine.inOut', yoyo: true, repeat: 1 }, tW + i * 0.18));

    // ---------- beats 1 to 6: each card enlarges into its panel (and shrinks back before the next one)
    const OPEN = 0.65;
    const open = (j, t) => {
      const k = cards[j], D = dets[j].d;
      tl.to(k.c, { x: DCX - k.cx, y: DCY - k.cy, scale: DS, opacity: 0, duration: OPEN, ease: 'power3.inOut' }, t);
      tl.fromTo(D, { x: k.cx - DCX, y: k.cy - DCY, scale: 1 / DS, opacity: 0 }, { x: 0, y: 0, scale: 1, opacity: 1, duration: OPEN, ease: 'power3.inOut', immediateRender: false }, t);
      A.pulse(tl, dets[j].bd, t + OPEN, { scale: 1.12 });
    };
    const close = (j, t) => {
      const k = cards[j], D = dets[j].d;
      tl.to(D, { x: k.cx - DCX, y: k.cy - DCY, scale: 1 / DS, opacity: 0, duration: 0.55, ease: 'power3.inOut' }, t);
      tl.to(k.c, { x: 0, y: 0, scale: 1, opacity: 1, duration: 0.55, ease: 'power3.inOut' }, t);
    };
    const tOpen = j => cue(j + 1) + (j ? 0.4 : 0.05);
    JOBS.forEach((_, j) => {
      open(j, tOpen(j));
      close(j, (j < 5 ? cue(j + 2) : cue(7)) - 0.2);
    });

    const ink = C.greenDark;
    const icon = (g, name, x, y, size, col = ink, sw = 2) => C1.svgIcon(g, name, x, y, size, { stroke: col, 'stroke-width': sw });
    const at = (b, phrase, fb, lo) => clamp(sayAt(ctx, b, phrase, fb, 0.2), lo, end(b) - 0.6);

    // herding: a small flock trots along, a curved arrow turns it; "follow, control, redirect"
    {
      const V = dets[0], t0 = tOpen(0) + OPEN;
      K.line(V.svg, 40, 166, 870, 166, { stroke: C.line, 'stroke-width': 4, 'stroke-dasharray': '2 14' });
      const flock = K.group(V.svg);
      const sheep = [[280, 102, 108], [410, 80, 122], [540, 106, 108]].map(([x, y, s]) => icon(flock, 'sheep', x, y, s, C.olive, 2));
      tl.fromTo(flock, { x: -160, opacity: 0 }, { x: 0, opacity: 1, duration: 2.6, ease: 'power1.out' }, t0);
      sheep.forEach((s, i) => tl.fromTo(s, { y: 0 }, { y: -8, duration: 0.3, ease: 'sine.inOut', yoyo: true, repeat: 7 }, t0 + i * 0.12));
      const arr = K.group(V.svg);
      const curve = K.path(arr, 'M 620 150 C 760 150 800 40 700 26 C 640 18 590 34 560 52', { stroke: C.green, 'stroke-width': 6, fill: 'none' });
      const head = arrowHead(arr, 560, 52, 150, C.green);
      const tA = at(1, 'redirect', 0.85, t0 + 1.6);
      A.draw(tl, curve, tA - 0.3, 0.9);
      A.in(tl, head, tA + 0.5, 'fade', { dur: 0.3 });
      tl.to(flock, { x: -40, duration: 1.2, ease: 'power2.inOut' }, tA + 0.5);
      const ps = pills(V.vig, ['Follow', 'Control', 'Redirect']);
      [['follow', 0.7], ['control', 0.78], ['redirect', 0.86]].forEach(([w, fb], i) => A.in(tl, ps[i], at(1, w, fb, t0 + 0.3 + i * 0.4), 'fadeUp', { dur: 0.5 }));
    }

    // guarding: a person walks toward a home; the home's "alert" eye pops; "people, animals, activity"
    {
      const V = dets[1], t0 = tOpen(1) + OPEN;
      K.line(V.svg, 40, 182, 870, 182, { stroke: C.line, 'stroke-width': 4, 'stroke-dasharray': '2 14' });
      icon(V.svg, 'house', 740, 104, 150, ink, 1.8);
      icon(V.svg, 'fence', 590, 142, 80, C.muted, 1.8);
      const who = icon(V.svg, 'person-standing', 120, 116, 120, C.inkSoft, 1.8);
      tl.fromTo(who, { x: -60, opacity: 0 }, { x: 330, opacity: 1, duration: 3, ease: 'none' }, t0);
      tl.fromTo(who, { y: 0 }, { y: -6, duration: 0.25, ease: 'sine.inOut', yoyo: true, repeat: 11 }, t0);
      const alert = K.group(V.svg);
      K.circle(alert, 846, 46, 34, { fill: C.green });
      icon(alert, 'eye', 846, 46, 40, '#fff', 2.4);
      tl.fromTo(alert, { opacity: 0, scale: 0.4, svgOrigin: '846 46' }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }, t0 + 2.3);
      tl.to(alert, { scale: 1.15, svgOrigin: '846 46', duration: 0.25, ease: 'power2.out', yoyo: true, repeat: 1 }, t0 + 3);
      const ps = pills(V.vig, ['People', 'Animals', 'Activity']);
      [['unfamiliar people', 0.55], ['animals', 0.62], ['activity', 0.7]].forEach(([w, fb], i) => A.in(tl, ps[i], at(2, w, fb, t0 + 0.3 + i * 0.4), 'fadeUp', { dur: 0.5 }));
    }

    // hunting and pursuit: a rabbit runs along a wavy scent trail that appears behind it; "tracking, chasing, following"
    {
      const V = dets[2], t0 = tOpen(2) + OPEN, RUN = 3.2;
      const yAt = x => 100 + 26 * Math.sin((x - 60) / 70);
      const dots = [];
      for (let x = 60; x <= 760; x += 28) dots.push(K.circle(V.svg, x, yAt(x) + 34, 6, { fill: C.greenLight, opacity: 0 }));
      dots.forEach((d, i) => tl.to(d, { opacity: 1, duration: 0.2 }, t0 + (RUN * i) / dots.length));
      const rab = icon(V.svg, 'rabbit', 0, 0, 112, C.olive, 2);
      const keys = [];
      for (let x = 60; x <= 820; x += 38) keys.push({ x, y: yAt(x) });
      gsap.set(rab, { opacity: 0 });
      tl.to(rab, { opacity: 1, duration: 0.3 }, t0);
      tl.to(rab, { keyframes: [{ x: 60, y: yAt(60), duration: 0 }, ...keys.map(k => ({ x: k.x, y: k.y, duration: RUN / keys.length, ease: 'none' }))] }, t0);
      const ps = pills(V.vig, ['Tracking', 'Chasing', 'Following']);
      [['tracking', 0.62], ['chasing', 0.7], ['following', 0.78]].forEach(([w, fb], i) => A.in(tl, ps[i], at(3, w, fb, t0 + 0.3 + i * 0.4), 'fadeUp', { dur: 0.5 }));
    }

    // terrier work: a squirrel darts across, then back, with speed lines; "notice, pursue"
    {
      const V = dets[3], t0 = tOpen(3) + OPEN;
      const sq = K.group(V.svg);
      const flip = K.group(sq, { transform: 'scale(1 1)' }); // mirrored for the run back
      const lines = K.group(flip);
      [[-92, -22, 80], [-112, 6, 100], [-84, 32, 70]].forEach(([x, y, w]) => K.line(lines, x, y, x + w * 0.6, y, { stroke: C.greenLight, 'stroke-width': 6 }));
      const body = icon(flip, 'squirrel', 0, 0, 112, C.olive, 2);
      tl.fromTo(sq, { x: -140, y: 100 }, { x: 1060, duration: 0.9, ease: 'power1.inOut' }, t0 + 0.3);
      tl.set(flip, { attr: { transform: 'scale(-1 1)' } }, t0 + 1.6);
      tl.to(sq, { x: 470, duration: 0.8, ease: 'power3.out' }, t0 + 1.6);
      tl.to(lines, { opacity: 0, duration: 0.3 }, t0 + 2.3);
      tl.to(body, { y: -10, duration: 0.25, ease: 'sine.inOut', yoyo: true, repeat: 3 }, t0 + 2.4);
      const ps = pills(V.vig, ['Notice', 'Pursue']);
      [['notice', 0.55], ['pursue', 0.7]].forEach(([w, fb], i) => A.in(tl, ps[i], at(4, w, fb, t0 + 0.6 + i * 0.4), 'fadeUp', { dur: 0.5 }));
    }

    // sporting work: search, retrieve and handler icons
    {
      const V = dets[4], t0 = tOpen(4) + OPEN;
      const ts = tiles(V.vig, [['search', 'Search'], ['bird', 'Retrieve'], ['person-standing', 'Handler']]);
      [['searching', 0.3], ['retrieving', 0.45], ['the job', 0.72]].forEach(([w, fb], i) => {
        const t = at(5, w, fb, t0 + 0.2 + i * 0.5);
        A.in(tl, ts[i].t, t, 'fadeUp', { dur: 0.55 });
        A.in(tl, ts[i].b, t + 0.1, 'pop', { dur: 0.5 });
      });
    }

    // working and assistance: rescue, pulling, assistance
    {
      const V = dets[5], t0 = tOpen(5) + OPEN;
      const ts = tiles(V.vig, [['life-buoy', 'Rescue'], ['weight', 'Pulling'], ['hand-helping', 'Assistance']]);
      ts.forEach((x, i) => {
        A.in(tl, x.t, t0 + 0.2 + i * 0.35, 'fadeUp', { dur: 0.55 });
        A.in(tl, x.b, t0 + 0.3 + i * 0.35, 'pop', { dur: 0.5 });
      });
    }

    // ---------- beat 7: "clues, not guarantees" lands over the dimmed cards; different dog silhouettes appear beneath them
    const row = K.el('div', 'c1e-banrow');
    Object.assign(row.style, { left: '100px', top: '500px', width: '1720px' });
    const ban = K.el('div', 'c1e-ban');
    const bi = K.el('div', 'bi');
    bi.appendChild(K.icon('search'));
    ban.appendChild(bi);
    ban.appendChild(K.el('div', 'bt', K.md('Breed history gives us *clues*, not guarantees')));
    row.appendChild(ban);
    stage.appendChild(row);
    const tBan = clamp(sayAt(ctx, 7, 'Breed history gives us', 0.35, 0.3), cue(7) + 0.6, end(7) - 3);
    tl.to([...cardEls, B.wrap], { opacity: 0.25, duration: 0.6, ease: 'power2.out' }, tBan - 0.1);
    tl.fromTo(ban, { opacity: 0, y: -44, scale: 1.05 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' }, tBan);
    A.pulse(tl, bi, tBan + 0.6, { scale: 1.12 });

    const sil = K.el('div', 'c1e-sil');
    Object.assign(sil.style, { left: '100px', top: '868px', width: '1720px', height: '94px' });
    const dogs = DOGS.map(([n, hgt]) => {
      const im = K.el('img');
      im.src = '../assets/img/sil_' + n + '.png';
      im.style.height = hgt + 'px';
      sil.appendChild(im);
      return im;
    });
    stage.appendChild(sil);
    const tSil = clamp(sayAt(ctx, 7, 'Individual dogs', 0.7), tBan + 1.2, end(7) - 1.5);
    tl.fromTo(dogs, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.14, ease: 'power3.out' }, tSil);

    // ---------- beat 8: the cards fly into the small bowl's third "?" chip; the bowl grows back and that chip drops in
    const t10 = cue(8);
    A.out(tl, [row, q, sil], t10 - 0.35, 'fadeUp', { dur: 0.45 });
    tl.to([...cardEls, B.wrap], { opacity: 1, duration: 0.35, ease: 'power2.out' }, t10 - 0.3);
    const TX = BOWL.cx + SLOT[2][0] * BOWL.scale, TY = BOWL.y + SLOT[2][1] * BOWL.scale;
    const tFly = t10 + 0.1, FD = 0.95, FS = 0.08;
    cards.forEach((k, i) => {
      const t = tFly + i * FS;
      tl.to(k.c, { x: TX - k.cx, y: TY - k.cy, scale: 0.03, duration: FD, ease: 'power2.in' }, t);
      tl.to(k.c, { opacity: 0, duration: 0.25, ease: 'power1.in' }, t + FD - 0.25);
    });
    const tArr = tFly + 5 * FS + FD;
    tl.to(B.slots[2].g, { scale: 1.7, transformOrigin: '50% 50%', duration: 0.22, ease: 'power2.out', yoyo: true, repeat: 1 }, tArr - 0.1);
    const tGrow = tArr + 0.1;
    tl.fromTo(B.wrap, { ...SM }, { x: 0, y: 0, scale: 1, duration: 1.1, ease: 'power3.inOut', immediateRender: false }, tGrow);
    const land = C1.dropIn(tl, B, 2, tGrow + 1.0);

    const list = K.el('div', 'c1e-list');
    Object.assign(list.style, { left: '100px', top: '330px' });
    stage.appendChild(list);
    const caps = [0, 1, 2].map(k => {
      const p = K.el('div', 'c1-cap');
      const dot = K.el('div', 'c1-dot');
      dot.style.background = ING[k].col;
      dot.appendChild(K.icon(ING[k].icon));
      p.appendChild(dot);
      p.appendChild(K.el('span', null, ING[k].name));
      list.appendChild(p);
      return p;
    });
    A.in(tl, caps.slice(0, 2), tGrow + 0.3, 'fadeRight', { dur: 0.6, stagger: 0.15 });
    A.in(tl, caps[2], land - 0.15, 'fadeRight', { dur: 0.6 });

    const tGlow = land + 0.45;
    const halos = [0, 1, 2].map(k => {
      const o = B.tokens[k].outer;
      const c = K.circle(o, 0, 0, 58, { fill: '#e6f3d6', stroke: C.greenLight, 'stroke-width': 4, opacity: 0 });
      o.insertBefore(c, o.firstChild);
      return c;
    });
    tl.fromTo(halos, { opacity: 0, scale: 0.7, transformOrigin: '50% 50%' }, { opacity: 0.95, scale: 1, duration: 0.8, stagger: 0.12, ease: 'power2.out' }, tGlow);
    tl.fromTo(B.glow, { opacity: 0 }, { opacity: 0.9, duration: 1.2, ease: 'sine.inOut', immediateRender: false }, tGlow);
    tl.to([0, 1, 2].map(k => B.tokens[k].inner), { scale: 1.12, transformOrigin: '50% 50%', duration: 0.35, yoyo: true, repeat: 1, stagger: 0.12, ease: 'sine.inOut' }, tGlow + 0.1);
    tl.to(caps, { boxShadow: '0 0 0 4px rgba(184,217,154,0.9), 0 12px 30px rgba(97,149,55,0.25)', duration: 0.6, stagger: 0.12 }, tGlow);

    // "another ingredient to consider"
    const puz = K.el('div', 'c1e-puz');
    Object.assign(puz.style, { left: '100px', top: '700px' });
    const pi = K.el('div', 'pi');
    pi.appendChild(K.icon('circle-plus'));
    puz.appendChild(pi);
    puz.appendChild(K.el('div', 'pt', K.md('Another *ingredient* to consider')));
    stage.appendChild(puz);
    const tPuz = clamp(sayAt(ctx, 8, 'another ingredient', 0.85, 0.3), land + 1.0, dur - 2.0);
    A.in(tl, puz, tPuz, 'fadeUp', { dur: 0.8 });
    A.in(tl, pi, tPuz + 0.15, 'pop', { dur: 0.6 });
  });
})();
