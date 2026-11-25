// Management: Solutions and Setups: welcome, the safety principle and Part 1 (going for walks).
//   ms00intro  title slide (shared kit)
//   ms00plan   plan slide: What you'll learn (six setups), Why it matters, Coming up later (behaviors we'll teach)
//   ms00s01    always have two layers of safety between the dog and the trigger: layer 1, the backup; layer 1 fails, the backup holds;
//              side note: a fired-up dog can redirect onto whoever is closest (person on the leash, another dog, the cat)
//   ms01s01-08 one setup each on Tori's pictures
//   ms01recap  recap: the eight setups as they are named, then the deck's summary line
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
    { icon: 'graduation-cap', bg: 'var(--green)', fg: '#fff', lab: 'Coming up later', text: 'In another section, we’ll teach your dog *behaviors that make management easier*.' },
  ], [
    [['on walks', 0.45], ['sights and sounds', 0.55], ['resource guarding', 0.65], ['conflict between dogs', 0.75], ['dogs and cats', 0.85], ['car rides', 0.92]],
    [], [],
  ])));

  /** A dotted arrow along pts (stage px) with its head on the last point, pointing along the last stretch. */
  const arrow = (tl, sv, pts, t, o = {}) => {
    const col = o.color || '#b8452d', dur = o.dur ?? 0.8;
    const dots = TM.fx.dots(tl, sv, pts, t, { color: col, r: o.r ?? 5.5, gap: o.gap ?? 20, dur, hold: 0 });
    const [x1, y1] = pts[pts.length - 2], [x2, y2] = pts[pts.length - 1];
    const ang = Math.atan2(y2 - y1, x2 - x1), L = o.head ?? 22, sp = 0.55;
    const w1 = [x2 - L * Math.cos(ang - sp), y2 - L * Math.sin(ang - sp)], w2 = [x2 - L * Math.cos(ang + sp), y2 - L * Math.sin(ang + sp)];
    const head = K.path(sv, `M ${w1[0]} ${w1[1]} L ${x2} ${y2} L ${w2[0]} ${w2[1]}`, { fill: 'none', stroke: col, 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
    tl.set(head, { opacity: 0 }, 0);
    tl.set(head, { opacity: 1 }, t + dur);
    return [...dots, head];
  };

  // ---------------------------------------------------------------- always have two layers of safety
  registerScene('ms00s01', ctx => {
    const { stage, tl, cue, end } = ctx;
    css(stage);
    TM.head(ctx, 'A safety principle', 'Always have two layers of safety');
    // left: the diagram. The dog at left, the trigger at right, two layers between them.
    const panel = put(stage, K.el('div', 'msa-panel'), 100, 290, { width: '900px', height: '640px' });
    tl.fromTo(panel, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.35);
    const node = (icon, x, y, cls, lab, size = 150) => {
      const n = put(stage, K.el('div', 'msa-node' + (cls ? ' ' + cls : '')), x - size / 2, y - size / 2, { width: size + 'px', height: size + 'px' });
      n.appendChild(K.icon(icon));
      if (size < 150) n.querySelector('svg').style.cssText = `width:${Math.round(size * 0.48)}px;height:${Math.round(size * 0.48)}px`;
      const l = put(stage, K.el('div', 'msa-nlab', lab), x - 120, y + size / 2 + 14, { width: '240px' });
      return { n, l };
    };
    const DOG = [235, 470], TRIG = [865, 470], L1 = 420, L2 = 660;
    const dog = node('dog', ...DOG, '', 'Your dog');
    const trig = node('zap', ...TRIG, 'amber', 'The trigger');
    A.in(tl, [dog.n, dog.l], 0.6, 'pop', { dur: 0.5, stagger: 0.1 });
    A.in(tl, [trig.n, trig.l], 0.9, 'pop', { dur: 0.5, stagger: 0.1 });
    const sv = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    sv.style.overflow = 'visible';
    // beat 0: nothing between them yet
    const tG = at(ctx, 0, 'between your dog', 0.7);
    const gaze = TM.fx.dots(tl, sv, [[DOG[0] + 85, DOG[1]], [TRIG[0] - 85, TRIG[1]]], tG, { color: '#fff', stroke: '#d9912b', r: 6, gap: 22, dur: 0.7, hold: 99 });
    // right, beat 1: a layer is any barrier
    const X = 1060, W = 760;
    const BAR = [['Closed door', 'door-closed', 'closed door'], ['Crate', 'lock', 'a crate'], ['Baby gate', 'fence', 'baby gate'], ['Leash', 'link', 'a leash'], ['Muzzle', 'shield', 'or a muzzle']];
    const cA = put(stage, K.el('div', 'mg-card'), X, 290, { width: W + 'px' });
    cA.innerHTML = `<div class="lab">${K.icon('layers').outerHTML}<span>A layer is any barrier</span></div>`;
    const rowA = K.el('div', 'ms-row'); Object.assign(rowA.style, { position: 'relative', width: '100%', gap: '12px' }); cA.appendChild(rowA);
    const chipsA = BAR.map(([t, ic]) => { const c = TM.word(rowA, t, { variant: 'pale', icon: ic, size: 27 }); c.style.position = 'relative'; c.style.left = c.style.top = ''; return c; });
    tl.fromTo(cA, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, cue(1) + 0.05);
    BAR.forEach(([, , p], i) => A.in(tl, chipsA[i], at(ctx, 1, p, 0.3 + 0.12 * i), 'pop', { dur: 0.4 }));
    // right, beat 2: two at once, for example
    const PAIRS = [[['Closed door', 'door-closed'], ['Baby gate', 'fence'], 'closed door and'], [['Leash', 'link'], ['Baby gate', 'fence'], 'leash and a baby'],
      [['Leash', 'link'], ['Muzzle', 'shield'], 'leash and a muzzle'], [['Muzzle', 'shield'], ['Baby gate', 'fence'], 'muzzle and a baby']];
    const cB = put(stage, K.el('div', 'mg-card'), X, 0, { width: W + 'px', gap: '12px' });
    cB.innerHTML = `<div class="lab">${K.icon('copy-plus').outerHTML}<span>Two at once, for example</span></div>`;
    const prs = PAIRS.map(([a, b]) => {
      const r = K.el('div', 'tm-row', `<span class="ic">${K.icon(a[1]).outerHTML}</span><span class="ic">${K.icon(b[1]).outerHTML}</span><span>${a[0]} <b>+</b> ${b[0].toLowerCase()}</span>`);
      r.style.fontSize = '31px'; r.style.gap = '12px';
      r.querySelectorAll('.ic').forEach(ic => { ic.style.width = ic.style.height = '52px'; });
      cB.appendChild(r);
      return r;
    });
    cB.style.top = (290 + cA.offsetHeight + 20) + 'px';
    const t2 = cue(2) + 0.05;
    tl.fromTo(cB, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, t2);
    // the two layers drop in between the dog and the trigger
    const bar1 = put(stage, K.el('div', 'msa-wall'), L1 - 17, 340, { height: '260px' });
    const bar2 = put(stage, K.el('div', 'msa-wall'), L2 - 17, 340, { height: '260px', background: 'var(--green)' });
    const n1 = put(stage, K.el('div', 'msa-num', '1'), L1 - 26, 300 - 6);
    const n2 = put(stage, K.el('div', 'msa-num', '2'), L2 - 26, 300 - 6);
    tl.fromTo([bar1, bar2], { opacity: 0, scaleY: 0 }, { opacity: 1, scaleY: 1, duration: 0.6, ease: 'power3.out', stagger: 0.25 }, at(ctx, 2, 'two at once', 0.1));
    A.in(tl, [n1, n2], at(ctx, 2, 'two at once', 0.1) + 0.3, 'pop', { dur: 0.4, stagger: 0.25 });
    tl.to(gaze, { opacity: 0, duration: 0.4 }, at(ctx, 2, 'two at once', 0.1));
    // each example lands on the card and names the two layers
    const chipAt = (txt, ic, cx, y) => { const c = TM.word(stage, txt, { variant: 'pale', icon: ic, size: 26 }); c.style.top = y + 'px'; c.style.left = Math.round(cx - c.offsetWidth / 2) + 'px'; return c; };
    let prev = null;
    const tP = PAIRS.map(([a, b, p], k) => {
      const t = at(ctx, 2, p, 0.3 + 0.17 * k);
      A.in(tl, prs[k], t, 'fadeRight', { dur: 0.5 });
      const c1 = chipAt(a[0], a[1], L1, 622), c2 = chipAt(b[0], b[1], L2, 684);
      A.in(tl, [c1, c2], t + 0.1, 'pop', { dur: 0.4, stagger: 0.1 });
      if (prev) tl.to(prev, { opacity: 0, duration: 0.25 }, t);
      A.pulse(tl, prs[k], t + 0.4, { scale: 1.04 });
      prev = [c1, c2];
      return t;
    });
    // beat 3: management can fail; layer 1 slips, the dog gets to layer 2, which holds
    const tF = at(ctx, 3, 'door gets left open', 0.35);
    const ghost = put(stage, K.el('div'), L1 - 17, 340, { position: 'absolute', width: '34px', height: '260px', boxSizing: 'border-box', border: '4px dashed #d9912b', borderRadius: '10px' });
    tl.set(ghost, { opacity: 0 }, 0);
    tl.to(bar1, { opacity: 0, y: -30, duration: 0.5, ease: 'power2.in' }, tF);
    tl.to(ghost, { opacity: 1, duration: 0.4 }, tF + 0.2);
    tl.to(prev, { opacity: 0, duration: 0.4 }, tF);
    const slip = put(stage, K.el('div', 'msa-lab amber', 'One slips'), 0, 626);
    slip.style.left = Math.round(L1 - slip.offsetWidth / 2) + 'px';
    A.in(tl, slip, tF + 0.3, 'pop', { dur: 0.4 });
    tl.to(dog.n, { x: (L2 - 25 - 150) - (DOG[0] - 75), duration: 0.8, ease: 'power2.in' }, tF + 0.6);
    tl.to(dog.l, { opacity: 0, duration: 0.3 }, tF + 0.6);
    A.pulse(tl, bar2, tF + 1.4, { scale: 1.08 });
    const hold = put(stage, K.el('div', 'msa-lab green', 'The other holds'), 0, 688);
    hold.style.left = Math.round(L2 - hold.offsetWidth / 2) + 'px';
    A.in(tl, hold, tF + 1.5, 'pop', { dur: 0.4 });
    const bn = put(stage, K.el('div', 'tm-banner', `${K.icon('shield-check').outerHTML}<span>Management can fail. The second layer is there <b>just in case</b>.</span>`), 130, 790, { width: '840px', boxSizing: 'border-box', fontSize: '32px', padding: '20px 30px' });
    tl.fromTo(bn, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, at(ctx, 3, 'second layer', 0.6));
    const tBack = Math.max(tF + 3.2, end(3) - 0.9);
    tl.to(dog.n, { x: 0, duration: 0.9, ease: 'power2.inOut' }, tBack);
    tl.to(dog.l, { opacity: 1, duration: 0.4 }, tBack + 0.6);
    // beat 4, a side note: a fired-up dog can redirect onto whoever is closest
    const t4 = cue(4) + 0.05;
    tl.to([cA, cB], { opacity: 0, y: -20, duration: 0.5, ease: 'power2.in' }, t4);
    tl.to([bn, slip, hold, ...prev], { opacity: 0, duration: 0.4 }, t4);
    const tUp = at(ctx, 4, 'fired up', 0.15);
    tl.to(dog.n, { borderColor: '#b8452d', duration: 0.3 }, tUp);
    A.pulse(tl, dog.n, tUp + 0.05, { scale: 1.1 });
    A.pulse(tl, trig.n, tUp + 0.05, { scale: 1.08 });
    const note = MG.card(stage, { x: X, y: 290, w: W, variant: 'amber', label: 'Side note: redirection', icon: 'triangle-alert', title: 'Whoever’s closest',
      body: 'A fired-up dog doesn’t always aim at the trigger. That arousal can land on whoever is nearby.', size: 28 });
    tl.fromTo(note, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, t4 + 0.35);
    const col = put(stage, K.el('div', 'tm-col'), X + 10, 290 + note.offsetHeight + 40, { width: W - 10 + 'px', gap: '26px' });
    const NB = [['user', 'The person holding the leash', 'Person on the leash', 'person holding'], ['dog', 'Another dog in the yard', 'Another dog', 'another dog'],
      ['cat', 'The cat in the room', 'The cat', 'the cat']];
    const NY = 805, NX = [195, 450, 705];
    NB.forEach(([ic, row, lab, p], i) => {
      const r = TM.row(col, ic, row, { size: 32 });
      const t = at(ctx, 4, p, 0.55 + 0.12 * i);
      A.in(tl, r, t, 'fadeRight', { dur: 0.5 });
      const sm = node(ic, NX[i], NY, 'amber', lab, 96);
      sm.l.style.fontSize = '26px';
      A.in(tl, [sm.n, sm.l], t, 'pop', { dur: 0.45, stagger: 0.08 });
      // a red dotted arrow from the dog down to each of them
      const a = [DOG[0] + (i - 1) * 40, DOG[1] + 140], e = [a[0] + (NX[i] - a[0]) * 0.9, NY - 58];
      arrow(tl, sv, [a, e], t - 0.2, { dur: 0.5, gap: 18, r: 5 });
    });
  });

  // ---------------------------------------------------------------- Part 1: going for walks
  const SEC = 'Going for walks', IC = 'paw-print';

  const TIPS = [
    { title: 'Choose strategic routes', src: 'ms_s05.jpg', nat: [1400, 1050],
      lead: 'Pick routes with *fewer dogs*. Scout low-traffic streets where you can *easily cross*.',
      chips: [['Big open fields: parks, schools', 'green', 'trees', false, 'big open fields'], ['Barriers to step behind', 'green', 'fence', false, 'barriers your dog']],
      why: 'Plan the route, and *most encounters never happen* in the first place.',
      mark: { rings: [[0.47, 0.56, 54]], tag: ['Quiet, open space', 0.04, 0.05], phrase: 'fewer dogs' } },
    { title: 'Skip tight, no-exit spaces', src: 'ms_s06.jpg', nat: [1026, 1400],
      lead: 'Avoid places where you *can’t make space*:', leadRed: true,
      chips: [['Narrow trails', 'amber', 'trees', false, 'narrow hiking trails'], ['Alleys', 'amber', 'signpost', false, 'alleys'], ['Fenced paths', 'amber', 'fence', false, 'fenced paths']],
      why: 'Room to create distance is *your main tool*. In a pinch point, your dog feels trapped and tips over threshold fast.',
      mark: { dots: [[[[0.27, 0.99], [0.40, 0.66], [0.47, 0.44]]], [[[0.82, 0.99], [0.62, 0.66], [0.55, 0.44]]]], rings: [[0.5, 0.49, 30, 'var(--amber)']],
        tag: ['No room to pass', 0.04, 0.05, 'red'], phrase: 'no room to pass' } },
    { title: 'Increase distance fast', src: 'ms_s07.jpg', nat: [933, 1400],
      lead: 'See a trigger approaching? *Make space right away.*',
      chips: [['Cross the street', 'green', 'move-horizontal', false, 'cross the street'], ['Turn around', 'green', 'undo-2', false, 'turn around'],
        ['Step behind a parked car', 'green', 'car', false, 'parked car']],
      why: 'Distance *lowers the intensity* of the trigger. The farther away, the calmer your dog.',
      mark: { rings: [[0.62, 0.52, 46]], tag: ['Make space fast', 0.04, 0.95], beat: 2, phrase: 'farther away' } },
    { title: 'Use visual barriers', src: 'ms_s08.jpg', nat: [1120, 1400],
      lead: 'Can’t get distance? *Block the line of sight.*',
      chips: [['Step in between', 'green', 'user', false, 'between your dog'], ['A car', 'green', 'car', false, 'a car'], ['A fence', 'green', 'fence', false, 'a fence'], ['A bush', 'green', 'trees', false, 'a bush']],
      why: 'If your dog can’t see the trigger, *there’s nothing to react to*.',
      mark: { rings: [[0.55, 0.14, 80]], tag: ['Out of sight', 0.04, 0.95], phrase: 'a car' } },
    { title: 'Control greetings', src: 'ms_s09.jpg', nat: [1050, 1400],
      lead: 'Don’t let strangers pet your dog, *even when they ask*.',
      chips: [['Politely decline', 'green', 'hand', false, 'politely decline'], ['Keep moving', 'green', 'paw-print', false, 'keep moving']],
      why: 'No reaction practiced, and *no feeling helpless* in a forced greeting, even if your dog isn’t barking.',
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
  registerScene('ms01recap', ctx => MS.recap(ctx, { title: 'going for walks',
    items: ['Choose strategic routes', 'Skip tight, no-exit spaces', 'Increase distance fast', 'Use visual barriers', 'Control greetings',
      'Walk at quieter times of day', 'Avoid high-risk areas', 'Drive to a calmer spot'],
    phrases: ['choose strategic', 'skip tight', 'increase distance', 'use visual', 'control greetings', 'walk at', 'avoid high', 'drive to'],
    summary: '*Plan the route, the timing, and the distance*. When a trigger does appear, *make space, use your training, or both*.' }));
})();
