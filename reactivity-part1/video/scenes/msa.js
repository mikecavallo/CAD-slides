// Management: Solutions and Setups: welcome, the safety principle and Part 1 (going for walks).
//   ms00intro  title slide (shared kit)
//   ms00plan   plan slide: What you'll learn (six setups), Why it matters
//   ms00s01    always have two layers of safety: the fired-up dog redirects onto the cat; layer 1, the backup layer; layer 1 fails, the backup holds
//   ms01s00    going for walks: the deck's summary line and the eight setups
//   ms01s01-08 one setup each on Tori's pictures
(() => {
  const { at, put } = TM;
  const CSS = `
  .msa-node { position: absolute; width: 150px; height: 150px; border-radius: 50%; box-sizing: border-box; display: grid; place-items: center; background: #fff;
    border: 6px solid var(--green); box-shadow: 0 14px 30px rgba(40,60,20,0.18); }
  .msa-node svg { width: 74px; height: 74px; stroke-width: 2; color: var(--green-dark); }
  .msa-node.amber { border-color: var(--amber); background: var(--amber-pale); }
  .msa-node.amber svg { color: #8a5410; }
  .msa-nlab { position: absolute; width: 220px; text-align: center; font: 700 28px/1.15 var(--font-body); color: var(--ink); }
  .msa-wall { position: absolute; width: 34px; border-radius: 10px; background: var(--green-deep); box-shadow: 0 10px 24px rgba(44,74,23,0.3); transform-origin: 50% 0%; }
  .msa-gate { position: absolute; width: 60px; box-sizing: border-box; border: 6px solid var(--green); border-radius: 10px;
    background: repeating-linear-gradient(90deg, transparent 0 8px, var(--green) 8px 14px); }
  .msa-num { position: absolute; width: 52px; height: 52px; border-radius: 50%; background: var(--green); color: #fff; font: 700 28px/52px var(--font-head); text-align: center;
    box-shadow: 0 6px 14px rgba(63,107,34,0.3); }
  .msa-panel { position: absolute; border-radius: 30px; background: var(--green-mist); border: 2px solid #e3ecd6; }
  .msa-lab { position: absolute; font: 700 30px/1.2 var(--font-body); white-space: nowrap; }
  .msa-lab.red { color: var(--red); }
  .msa-lab.green { color: var(--green-dark); }
  .msa-lab.amber { color: #8a5410; }
  `;
  const css = stage => { MS.css(stage); if (!stage.querySelector('style[data-msa]')) { const s = K.el('style', null, CSS); s.dataset.msa = '1'; stage.appendChild(s); } };

  registerScene('ms00intro', ctx => SKIT.titleSlide(ctx));

  // six rows: tighten the plan card's row spacing so they fit inside the card
  registerScene('ms00plan', ctx => (ctx.stage.appendChild(K.el('style', null, '.sk-card .rows { gap: 8px !important; } .sk-card .rule { margin: 18px 0 14px !important; } .sk-card .lab { margin-top: 18px !important; }')), SKIT.planSlide(ctx, [
    { ...SKIT.PLAN.gain, lab: 'What you’ll learn', rows: ['Going for walks', 'At home: sights & sounds', 'Resource guarding', 'Multi-dog conflict', 'Dog & cat conflict', 'Going for rides'],
      rowIcons: ['paw-print', 'house', 'bone', 'dog', 'cat', 'car'], rowBg: 'var(--green-pale)', rowFg: 'var(--green-dark)' },
    { ...SKIT.PLAN.why, text: 'Simple setups that *stop the reaction before it starts*.' },
  ], [
    [['on walks', 0.45], ['sights and sounds', 0.55], ['resource guarding', 0.65], ['conflict between dogs', 0.75], ['dogs and cats', 0.85], ['car rides', 0.92]],
    [],
  ])));

  // ---------------------------------------------------------------- always have two layers of safety
  registerScene('ms00s01', ctx => {
    const { stage, tl, cue, end } = ctx;
    css(stage);
    TM.head(ctx, 'A safety principle', 'Always have two layers of safety');
    // left: the diagram. The dog at left, the cat at right, the trigger above the dog.
    const panel = put(stage, K.el('div', 'msa-panel'), 100, 300, { width: '900px', height: '600px' });
    tl.fromTo(panel, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.35);
    const node = (icon, x, y, cls, lab) => {
      const n = put(stage, K.el('div', 'msa-node' + (cls ? ' ' + cls : '')), x - 75, y - 75);
      n.appendChild(K.icon(icon));
      const l = put(stage, K.el('div', 'msa-nlab', lab), x - 110, y + 92);
      return { n, l };
    };
    const DOG = [250, 640], CAT = [850, 640], TRIG = [250, 390];
    const dog = node('dog', ...DOG, '', 'Your dog');
    const cat = node('cat', ...CAT, '', 'Whoever’s closest');
    A.in(tl, [dog.n, dog.l], 0.6, 'pop', { dur: 0.5, stagger: 0.1 });
    A.in(tl, [cat.n, cat.l], 0.9, 'pop', { dur: 0.5, stagger: 0.1 });
    // beat 1: a trigger fires the dog up; the arousal spills over onto the cat
    const trig = put(stage, K.el('div', 'msa-node amber'), TRIG[0] - 55, TRIG[1] - 55, { width: '110px', height: '110px' });
    trig.appendChild(K.icon('zap'));
    trig.querySelector('svg').style.cssText = 'width:54px;height:54px';
    const tlab = put(stage, K.el('div', 'msa-lab amber', 'A trigger'), TRIG[0] + 75, TRIG[1] - 16);
    const t1 = at(ctx, 1, 'fired up', 0.15);
    A.in(tl, [trig, tlab], t1, 'pop', { dur: 0.45, stagger: 0.1 });
    tl.to(dog.n, { borderColor: '#b8452d', duration: 0.3 }, t1 + 0.4);
    A.pulse(tl, dog.n, t1 + 0.45, { scale: 1.1 });
    const sv = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    sv.style.overflow = 'visible';
    // the spill-over: red dots arc from the dog over to whoever is closest
    const bez = (u, a, b, c, d) => (1 - u) ** 3 * a + 3 * (1 - u) ** 2 * u * b + 3 * (1 - u) * u * u * c + u ** 3 * d;
    const A0 = [DOG[0] + 82, DOG[1] - 30], A3 = [CAT[0] - 90, CAT[1] - 30];
    const pts = Array.from({ length: 24 }, (_, k) => { const u = k / 23; return [bez(u, A0[0], 430, 670, A3[0]), bez(u, A0[1], 520, 520, A3[1])]; });
    const tR = at(ctx, 1, 'spill over', 0.5);
    const arc = TM.fx.dots(tl, sv, pts, tR, { color: '#b8452d', r: 6, gap: 22, dur: 0.9, hold: 0 });
    const head = K.path(sv, `M ${A3[0] - 26} ${A3[1] - 14} L ${A3[0]} ${A3[1]} L ${A3[0] - 22} ${A3[1] + 20}`,
      { fill: 'none', stroke: '#b8452d', 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
    tl.fromTo(head, { opacity: 0 }, { opacity: 1, duration: 0.2, immediateRender: true }, tR + 0.85);
    const rlab = put(stage, K.el('div', 'msa-lab red', 'Redirects onto whoever’s closest'), 0, 452);
    rlab.style.left = Math.round(550 - rlab.offsetWidth / 2) + 'px';
    A.in(tl, rlab, tR + 0.5, 'fadeUp', { dur: 0.5 });
    tl.to(cat.n, { borderColor: '#b8452d', duration: 0.3 }, tR + 0.9);
    // right: the cards
    const X = 1060, W = 760;
    const c1 = MG.card(stage, { x: X, y: 300, w: W, label: 'First layer', icon: 'door-closed', title: 'A solid separation', body: 'A closed door, a secure crate, or a dog in its own room.', size: 28 });
    const c2 = MG.card(stage, { x: X, y: 0, w: W, label: 'Backup layer', icon: 'fence', title: 'A second barrier behind it', body: 'A baby gate, or a leash on the dog.', size: 28 });
    c2.style.top = (300 + c1.offsetHeight + 22) + 'px';
    const c3 = MG.card(stage, { x: X, y: 0, w: W, variant: 'red', label: 'Why two', icon: 'triangle-alert', body: 'One barrier will eventually fail. Two layers: a *near miss, never a bite*.', size: 28 });
    c3.style.top = (c2.offsetTop + c2.offsetHeight + 22) + 'px';
    // beat 2: the first layer drops in and stops the arrow
    const WALL = 470, GATE = 640;
    const wall = put(stage, K.el('div', 'msa-wall'), WALL - 17, 490, { height: '310px' });
    const n1 = put(stage, K.el('div', 'msa-num', '1'), WALL - 26, 820);
    const t2 = cue(2) + 0.1;
    tl.fromTo(wall, { opacity: 0, scaleY: 0 }, { opacity: 1, scaleY: 1, duration: 0.6, ease: 'power3.out' }, at(ctx, 2, 'first layer', 0.3));
    A.in(tl, n1, at(ctx, 2, 'first layer', 0.3) + 0.3, 'pop', { dur: 0.4 });
    tl.to([...arc, head], { opacity: 0, duration: 0.5 }, t2);
    tl.to([dog.n, cat.n], { borderColor: '#619537', duration: 0.5 }, t2);
    tl.to(rlab, { opacity: 0, duration: 0.4 }, t2);
    tl.fromTo(c1, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, at(ctx, 2, 'first layer', 0.3) + 0.2);
    // beat 3: the backup layer
    const gate = put(stage, K.el('div', 'msa-gate'), GATE - 30, 540, { height: '240px' });
    const n2 = put(stage, K.el('div', 'msa-num', '2'), GATE - 26, 820);
    const t3 = at(ctx, 3, 'backup layer', 0.2);
    tl.fromTo(gate, { opacity: 0, y: -40 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, t3);
    A.in(tl, n2, t3 + 0.3, 'pop', { dur: 0.4 });
    tl.fromTo(c2, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, t3 + 0.2);
    // beat 4: the first layer fails (left open); the dog rushes to the gate; the backup holds
    const tF = at(ctx, 4, 'door gets left open', 0.35);
    const ghost = put(stage, K.el('div'), WALL - 17, 490, { position: 'absolute', width: '34px', height: '310px', boxSizing: 'border-box', border: '4px dashed #d9912b', borderRadius: '10px' });
    tl.set(ghost, { opacity: 0 }, 0);
    tl.to(wall, { opacity: 0, y: -30, duration: 0.5, ease: 'power2.in' }, tF);
    tl.to(ghost, { opacity: 1, duration: 0.4 }, tF + 0.2);
    const open = put(stage, K.el('div', 'msa-lab amber', 'Left open'), WALL - 140, 448);
    A.in(tl, open, tF + 0.3, 'pop', { dur: 0.4 });
    tl.to(dog.n, { x: (GATE - 42 - 150) - (DOG[0] - 75), duration: 0.8, ease: 'power2.in' }, tF + 0.6);
    tl.to(dog.l, { opacity: 0, duration: 0.3 }, tF + 0.6);
    A.pulse(tl, gate, tF + 1.4, { scale: 1.08 });
    const hold = put(stage, K.el('div', 'msa-lab green', 'The backup holds'), GATE - 40, 492);
    A.in(tl, hold, tF + 1.5, 'pop', { dur: 0.4 });
    tl.fromTo(c3, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, at(ctx, 4, 'two layers', 0.6));
    tl.to(dog.n, { x: 0, duration: 0.9, ease: 'power2.inOut' }, Math.min(end(4) - 0.6, tF + 3.2));
    tl.to(dog.l, { opacity: 1, duration: 0.4 }, Math.min(end(4) - 0.2, tF + 3.8));
  });

  // ---------------------------------------------------------------- Part 1: going for walks
  const SEC = 'Going for walks', IC = 'paw-print';
  registerScene('ms01s00', ctx => MS.overview(ctx, { title: 'Going for walks',
    lead: 'Plan the *route, the timing, and the distance*, so most encounters never happen. When one does, *make space fast*.',
    items: ['Choose strategic routes', 'Skip tight, no-exit spaces', 'Increase distance fast', 'Use visual barriers', 'Control greetings',
      'Walk at quieter times of day', 'Avoid high-risk areas', 'Drive to a calmer spot'] }));

  const TIPS = [
    { title: 'Choose strategic routes', src: 'ms_s05.jpg', nat: [1400, 1050],
      lead: 'Pick routes with *fewer dogs*. Scout low-traffic streets where you can *easily cross*.',
      why: 'Plan the route, and *most encounters never happen* in the first place.',
      mark: { rings: [[0.47, 0.56, 54]], tag: ['Quiet, open space', 0.04, 0.05], phrase: 'fewer dogs' } },
    { title: 'Skip tight, no-exit spaces', src: 'ms_s06.jpg', nat: [1026, 1400],
      lead: 'Avoid places where you *can’t make space*:', leadRed: true,
      chips: [['Narrow trails', 'amber', 'trees', false, 'narrow hiking trails'], ['Alleys', 'amber', 'signpost', false, 'alleys'], ['Fenced paths', 'amber', 'fence', false, 'fenced paths']],
      why: 'Room to create distance is *your main tool*. In a pinch point, your dog feels trapped and tips over threshold fast.',
      mark: { dots: [[[[0.27, 0.99], [0.40, 0.66], [0.47, 0.44]]], [[[0.82, 0.99], [0.62, 0.66], [0.55, 0.44]]]], rings: [[0.5, 0.49, 30, 'var(--amber)']],
        tag: ['No room to pass', 0.04, 0.05, 'red'], phrase: 'no room to pass' } },
    { title: 'Increase distance fast', src: 'ms_s07.jpg', nat: [933, 1400],
      lead: 'See a dog approaching? *Make space right away.*',
      chips: [['Cross the street', 'green', 'move-horizontal', false, 'cross the street'], ['Turn around', 'green', 'undo-2', false, 'turn around'],
        ['Step behind a parked car', 'green', 'car', false, 'parked car']],
      why: 'Distance *lowers the intensity* of the trigger. The farther away, the calmer your dog.',
      mark: { rings: [[0.62, 0.52, 46]], tag: ['Make space fast', 0.04, 0.95], beat: 2, phrase: 'farther away' } },
    { title: 'Use visual barriers', src: 'ms_s08.jpg', nat: [1120, 1400],
      lead: 'Can’t get distance? *Block the line of sight.*',
      chips: [['Step in between', 'green', 'user', false, 'between your dog'], ['A car', 'green', 'car', false, 'a car'], ['A fence', 'green', 'fence', false, 'a fence'], ['A bush', 'green', 'trees', false, 'a bush']],
      why: 'If your dog can’t see the other dog, *there’s nothing to react to*.',
      mark: { rings: [[0.55, 0.14, 80]], tag: ['Out of sight', 0.04, 0.95], phrase: 'a car' } },
    { title: 'Control greetings', src: 'ms_s09.jpg', nat: [1050, 1400],
      lead: 'Don’t let strangers pet your dog, *even when they ask*.',
      chips: [['Politely decline', 'green', 'hand', false, 'politely decline'], ['Keep moving', 'green', 'paw-print', false, 'keep moving']],
      why: 'Every declined greeting is *a reaction that never gets practiced*.',
      mark: { rings: [[0.31, 0.63, 80]], tag: ['No petting, thanks', 0.04, 0.05], phrase: 'politely decline' } },
    { title: 'Walk at quieter times of day', src: 'ms_s10.jpg', nat: [1400, 1067],
      lead: 'Fewer dogs, people, and delivery trucks *out and about*.',
      chips: [['Early morning', 'green', 'sunrise', false, 'early in the morning'], ['Later evening', 'green', 'moon', false, 'later in the evening']], chipsFirst: true,
      leadAt: [1, 'fewer dogs'],
      why: 'Fewer triggers around means *fewer chances to rehearse* a reaction.',
      mark: { rings: [[0.36, 0.73, 40]], tag: ['Quiet hours', 0.04, 0.05], phrase: 'fewer dogs' } },
    { title: 'Avoid high-risk areas', src: 'ms_s11.jpg', nat: [1400, 933],
      chips: [['Dog parks', 'red', 'dog', true, 'dog parks'], ['Pet store entrances', 'red', 'store', true, 'pet store'], ['Busy trails', 'red', 'users', true, 'busy trails']], chipsFirst: true,
      lead: 'Take several *short, controlled walks* instead of one long one.', leadAt: [1, 'several short'],
      why: 'Fewer surprises means *fewer chances to rehearse* the reaction.',
      mark: { rings: [[0.24, 0.53, 46, 'var(--amber)'], [0.1, 0.63, 34, 'var(--amber)']], tag: ['Busy and crowded', 0.04, 0.05, 'red'], phrase: 'busy trails' } },
    { title: 'Drive to a calmer spot', src: 'ms_s12.jpg', nat: [1050, 1400],
      lead: 'Is your block *full of triggers*? Drive somewhere quieter:',
      chips: [['A quieter park', 'green', 'trees', false, 'quieter park'], ['A trail', 'green', 'route', false, 'trail'], ['An empty lot', 'green', 'square-parking', false, 'empty lot']],
      why: 'A short drive can turn a stressful outing *into an easy one*.',
      mark: { rings: [[0.5, 0.56, 44]], tag: ['A calmer spot', 0.04, 0.05], phrase: 'quieter park' } },
  ];
  TIPS.forEach((o, i) => registerScene(`ms01s${String(i + 1).padStart(2, '0')}`, ctx => MS.tip(ctx, { sec: SEC, icon: IC, n: i + 1, ...o })));
})();
