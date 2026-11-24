// Management: Solutions and Setups, Part 3 (resource guarding) and Part 4 (multi-dog conflict).
//   ms03s00     resource guarding: the deck's summary line and the four setups
//   ms03s01-04  one setup each on Tori's pictures
//   ms03s05     see it in action: Knox at mealtime (video slide; Tori's clip plays in the frame once it is in clips/)
//   ms03s06     when surprises keep happening: two weeks of days; one surprise is normal, many mean adjust the plan
//   ms04s00     multi-dog conflict: summary and the four setups
//   ms04s01-04  one setup each
(() => {
  const { at, put } = TM;
  const CSS = `
  .msc-week { position: absolute; display: flex; align-items: center; gap: 18px; }
  .msc-week .wl { width: 150px; font: 700 28px/1 var(--font-body); color: var(--ink-soft); }
  .msc-day { width: 96px; height: 96px; border-radius: 50%; background: #fff; border: 4px solid var(--green-light); box-sizing: border-box; display: grid; place-items: center;
    font: 700 26px/1 var(--font-body); color: var(--green-dark); box-shadow: var(--shadow-soft); }
  .msc-day.hit { background: var(--amber-pale); border-color: var(--amber); color: #8a5410; }
  .msc-big { position: absolute; font: 700 58px/1.18 var(--font-head); color: var(--ink); }
  .msc-big b { color: var(--green); }
  .msc-big.adj b { color: #8a5410; }
  `;
  const css = stage => { MS.css(stage); if (!stage.querySelector('style[data-msc]')) { const s = K.el('style', null, CSS); s.dataset.msc = '1'; stage.appendChild(s); } };

  // ---------------------------------------------------------------- Part 3: resource guarding
  registerScene('ms03s00', ctx => MS.overview(ctx, { title: 'Resource guarding',
    lead: 'Reduce conflict over *food, toys, and space* by managing access, so there’s nothing to guard in the first place.',
    items: ['Remove access to guarded items', 'Feed in a safe, isolated space', 'Prevent stealing opportunities', 'Manage space around the dog'] }));

  const RG = [
    { title: 'Remove access to guarded items', src: 'ms_s26.jpg', nat: [1050, 1400],
      chips: [['Pick up toys', 'green', 'toy-brick', false, 'pick up toys'], ['Block the couch', 'green', 'sofa', false, 'block the couch'],
        ['Feed away from people and pets', 'green', 'utensils', false, 'feed away']],
      why: 'No item to guard means *no opportunity to guard it*.',
      mark: { rings: [[0.6, 0.71, 70]], tag: ['Supervised only', 0.04, 0.05], phrase: 'not supervising' } },
    { title: 'Feed in a safe, isolated space', src: 'ms_s27.jpg', nat: [1400, 1050],
      lead: 'At mealtimes, *no one can approach*:',
      chips: [['A closed room', 'green', 'door-closed', false, 'closed room'], ['A crate', 'green', 'lock', false, 'a crate'], ['Behind a gate', 'green', 'fence', false, 'behind a gate']],
      why: 'Eating undisturbed removes the chance of *mealtime trouble*.',
      mark: { rings: [[0.52, 0.5, 120]], tag: ['Meals in the crate', 0.04, 0.95], phrase: 'a crate' } },
    { title: 'Prevent stealing opportunities', src: 'ms_s28.jpg', nat: [1050, 1400],
      chips: [['Bones', 'red', 'bone', true, 'bones'], ['Bully sticks', 'red', 'cookie', true, 'bully sticks'], ['Special toys', 'red', 'toy-brick', true, 'special toys']], chipsFirst: true,
      lead: 'Offer them *only in controlled situations*.', leadAt: [1, 'offer them only'],
      why: 'High-value items only appear *under your control*. They’re never up for grabs.',
      mark: { rings: [[0.3, 0.62, 80, 'var(--amber)']], tag: ['Out only with you', 0.04, 0.05], phrase: 'offer them only' } },
    { title: 'Manage space around the dog', src: 'ms_s29.jpg', nat: [1050, 1400],
      lead: 'Guards their person? *Keep them off the couch* in social settings.',
      chips: [['A tether', 'green', 'link', false, 'tether'], ['A crate', 'green', 'lock', false, 'a crate'], ['A separate room', 'green', 'door-closed', false, 'separate room']],
      why: 'Controlling proximity prevents *the tension that sparks guarding*.',
      mark: { rings: [[0.74, 0.5, 80, 'var(--amber)']], tag: ['Close to their person', 0.04, 0.05, 'amber'], phrase: 'guards their person' } },
  ];
  RG.forEach((o, i) => registerScene(`ms03s${String(i + 1).padStart(2, '0')}`, ctx => MS.tip(ctx, { sec: 'Resource guarding', icon: 'bone', n: i + 1, ...o })));

  // ---------------------------------------------------------------- see it in action: Knox
  registerScene('ms03s05', ctx => {
    MS.css(ctx.stage);
    TM.videoSlide(ctx, { kicker: 'See it in action', heading: 'See it in action', rows: [
      { icon: 'video', html: 'Client session with *Knox*', beat: 0, phrase: 'knox' },
      { icon: 'door-open', html: 'Leaving the *feeding area*', beat: 0, phrase: 'leaving the feeding' },
      { icon: 'utensils', html: 'Seeing the *empty bowl* picked up', beat: 0, phrase: 'empty bowl' },
    ] });
  });

  // ---------------------------------------------------------------- when surprises keep happening
  registerScene('ms03s06', ctx => {
    const { stage, tl, cue } = ctx;
    css(stage);
    TM.head(ctx, 'When surprises keep happening', 'When surprises keep happening');
    const big = put(stage, K.el('div', 'msc-big', 'An occasional surprise is <b>normal</b>.'), 100, 300, { width: '1720px' });
    A.in(tl, big, cue(0) + 0.1, 'fadeUp', { dur: 0.7 });
    const DAYS = ['Su', 'M', 'T', 'W', 'Th', 'F', 'S'];
    const week = (y, lab, hits) => {
      const w = put(stage, K.el('div', 'msc-week'), 100, y);
      w.appendChild(K.el('div', 'wl', lab));
      const ds = DAYS.map((d, i) => { const n = K.el('div', 'msc-day', d); w.appendChild(n); return n; });
      return { w, ds, hits };
    };
    const w1 = week(420, 'Week 1', [3]);
    const w2 = week(540, 'Week 2', [0, 1, 3, 4, 6]);
    A.in(tl, w1.w, cue(0) + 0.5, 'fadeRight', { dur: 0.6 });
    const hit = (n, t) => { tl.to(n, { backgroundColor: '#fbefd9', borderColor: '#d9912b', color: '#8a5410', duration: 0.3 }, t); A.pulse(tl, n, t, { scale: 1.12 }); };
    hit(w1.ds[3], at(ctx, 0, 'surprise', 0.6) + 0.2);
    const t1 = cue(1) + 0.05;
    A.in(tl, w2.w, t1, 'fadeRight', { dur: 0.6 });
    w2.hits.forEach((d, k) => hit(w2.ds[d], at(ctx, 1, 'happen often', 0.25) + 0.22 * k));
    const adj = put(stage, K.el('div', 'msc-big adj', 'Keeps catching you off guard? Your plan needs <b>a small adjustment</b>.'), 100, 680, { width: '1720px', fontSize: '50px' });
    A.in(tl, adj, at(ctx, 1, 'sign your management', 0.6), 'fadeUp', { dur: 0.7 });
    const b = put(stage, K.el('div', 'tm-banner', `${K.icon('messages-square').outerHTML}<span>Let me know, and <b>we’ll adjust it together</b>.</span>`), 100, 0);
    b.style.top = (948 - b.offsetHeight) + 'px';
    tl.fromTo(b, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, cue(2) + 0.05);
    // the plan icon at the right of the weeks: a small adjustment
    const pl = K.iconBadge(stage, 'clipboard-list', { x: 1240, y: 430, size: 200, variant: 'amber' });
    A.in(tl, pl, at(ctx, 1, 'management plan', 0.7), 'pop', { dur: 0.5 });
    tl.to(pl, { rotation: -8, duration: 0.25, yoyo: true, repeat: 3, ease: 'sine.inOut' }, at(ctx, 1, 'small adjustment', 0.85));
  });

  // ---------------------------------------------------------------- Part 4: multi-dog conflict
  registerScene('ms04s00', ctx => MS.overview(ctx, { title: 'Multi-dog conflict',
    lead: 'Set up *calm routines and separate resources*, so two dogs under one roof stay relaxed around each other.',
    items: ['Separate during high-risk times', 'Control space & supervise', 'Remove competition', 'Manage arrivals & rotate access'] }));

  const MD = [
    { title: 'Separate during high-risk times', src: 'ms_s33.jpg', nat: [1400, 1050],
      lead: 'Split them up at the flashpoints:',
      chips: [['Meals', 'green', 'utensils', false, 'feed in separate'], ['High-value chews', 'green', 'bone', false, 'high-value chews'], ['Greetings at the door', 'green', 'door-open', false, 'greetings']],
      why: 'Removing the flashpoints prevents conflict *before it starts*.',
      mark: { rings: [[0.36, 0.44, 60], [0.67, 0.42, 60]], tag: ['Two dogs, two spaces', 0.04, 0.95], phrase: 'separate rooms' } },
    { title: 'Control space & supervise', src: 'ms_s34.jpg', nat: [540, 960],
      lead: 'Baby gates create *separate zones*. No crowding in tight spaces.',
      chips: [['Any history? Never alone together', 'amber', 'eye', false, 'any history']],
      why: 'Managed space and supervision *stop scuffles* from igniting in tight spots.',
      mark: { rings: [[0.55, 0.6, 110]], tag: ['Separate zones', 0.04, 0.05], phrase: 'separate zones' } },
    { title: 'Remove competition', src: 'ms_s35.jpg', nat: [1050, 1400],
      lead: 'When you’re not supervising:',
      chips: [['Pick up toys, bones, chews', 'green', 'toy-brick', false, 'pick up all'], ['Separate water bowls', 'green', 'droplet', false, 'water bowls']],
      why: 'Nothing to compete over means *nothing to fight over*.',
      mark: { rings: [[0.48, 0.42, 50, 'var(--amber)']], tag: ['Pick it up', 0.04, 0.95, 'amber'], phrase: 'pick up all' } },
    { title: 'Manage arrivals & rotate access', src: 'ms_s36.jpg', nat: [960, 720],
      lead: 'Put one dog away *before* letting the other out.',
      chips: [['The couch: one at a time', 'green', 'sofa', false, 'couch'], ['The bed: one at a time', 'green', 'bed', false, 'one at a time']],
      why: 'Staggering excitement and access *defuses the moments* when conflict flares.',
      mark: { rings: [[0.6, 0.5, 80]], tag: ['One at a time', 0.04, 0.05], phrase: 'one at a time' } },
  ];
  MD.forEach((o, i) => registerScene(`ms04s${String(i + 1).padStart(2, '0')}`, ctx => MS.tip(ctx, { sec: 'Multi-dog conflict', icon: 'dog', n: i + 1, ...o })));
})();
