// Management: Solutions and Setups, Part 2 (at home: sights and sounds).
//   ms02s00     the deck's summary line and the nine setups
//   ms02s01-09  one setup each on Tori's pictures
//   ms02s10     see it in action: the fence reactivity client session (video slide; Tori's clip plays in the frame once it is in clips/)
//   ms02s11     what it looks like, day to day: Tori's five real-life pictures, tagged as they are named
(() => {
  const { at, put } = TM;
  const SEC = 'At home', IC = 'house';


  const TIPS = [
    { title: 'Turn off the doorbell', src: 'ms_s14.jpg', nat: [1400, 1050],
      lead: 'If the bell is the trigger:',
      chips: [['Doorbell', 'red', 'bell', true, 'disconnect it'], ['Text or knock quietly', 'green', 'message-square', false, 'text or knock']],
      why: 'Remove the sound, and you remove *what starts the whole chain reaction*.',
      mark: { rings: [[0.42, 0.47, 70]], tag: ['Quiet at the door', 0.04, 0.05], phrase: 'text or knock' } },
    { title: 'Have guests wait before entering', src: 'ms_s15.jpg', nat: [1050, 1400],
      lead: 'Visitors *pause outside* while you secure your dog.',
      chips: [['Guest waits', 'pale', 'door-closed', false, 'pause outside'], '>', ['Dog secured', 'pale', 'lock', false, 'secure your dog'], '>', ['Door opens', 'green', 'door-open', false, 'secure your dog']],
      chipSize: 28,
      why: 'A calm, staged entry replaces *the chaotic rush* when the door swings open.',
      mark: { rings: [[0.5, 0.42, 70]], tag: ['Secured first', 0.04, 0.95], phrase: 'secure your dog' } },
    { title: 'Create physical barriers', src: 'ms_s16.jpg', nat: [1050, 1400],
      lead: 'Before guests arrive, *no access to the door*:',
      chips: [['A separate room', 'green', 'door-closed', false, 'separate room'], ['A baby gate', 'green', 'fence', false, 'baby gate'], ['A crate and a chew', 'green', 'bone', false, 'their crate']],
      why: 'No access, no door rushing. A barrier makes it *physically impossible*, so it can’t be practiced.',
      mark: { rings: [[0.5, 0.68, 110]], tag: ['Gate up first', 0.04, 0.05], phrase: 'baby gate' } },
    { title: 'Move deliveries away from the house', src: 'ms_s17.jpg', nat: [933, 1400],
      lead: 'A drop spot for packages and mail, *away from the porch*:',
      chips: [['A parcel box', 'green', 'package', false, 'parcel box'], ['By the mailbox', 'green', 'mailbox', false, 'mailbox']],
      why: 'If the carrier never comes close to the door, there’s *far less to see or hear*.',
      mark: { rings: [[0.35, 0.6, 90]], tag: ['Drop spot', 0.04, 0.05], phrase: 'parcel box' } },
    { title: 'Block visual access to windows', src: 'ms_s18.jpg', nat: [960, 720],
      lead: 'So your dog *can’t see people walking by*:',
      chips: [['Curtains', 'green', 'panel-top', false, 'curtains'], ['Blinds', 'green', 'blinds', false, 'blinds'], ['Frosted film', 'green', 'app-window', false, 'frosted film'], ['Furniture', 'green', 'sofa', false, 'furniture'],
        ['Bottom-half shades', 'green', 'sun', false, 'bottom half', 2]],
      why: 'No sight of passersby, *no reaction to rehearse*.', whyBeat: 3,
      mark: { rings: [[0.75, 0.3, 70]], tag: ['Shades down', 0.04, 0.95], phrase: 'blinds' },
      // Tori's bay window: the shade covers only the bottom; light comes in over the top
      pic2: { src: 'ms_shade_bottom.jpg', nat: [1050, 1400], beat: 2, phrase: 'another option',
        mark: { dots: [[[[0.16, 0.70], [0.80, 0.70]], '#619537']], tags: [['Sunlight in', 0.96, 0.18], ['View blocked', 0.96, 0.76]], phrase: 'sunlight' } } },
    { title: 'Manage outdoor time', src: 'ms_s19.jpg', nat: [720, 960],
      lead: 'No yard barker outside *unsupervised*. Bring them in when:',
      chips: [['Deliveries are due', 'green', 'truck', false, 'delivery drivers'], ['The street is busy', 'green', 'users', false, 'street is busy'],
        ['The neighbors’ dog is out', 'green', 'dog', false, 'neighbors usually'], ['A neighbor in the yard', 'green', 'user', false, 'neighbor might']],
      why: 'When you’re supervising, you can *step in before the barking starts*.',
      mark: { rings: [[0.08, 0.56, 40]], tag: ['Supervised', 0.96, 0.95], phrase: 'unsupervised' } },
    { title: 'Mask or eliminate sounds', src: 'ms_s20.jpg', nat: [1400, 933],
      lead: 'Cover the sounds that set your dog off:',
      chips: [['Noise machines', 'green', 'volume-2', false, 'noise machines'], ['Fans', 'green', 'fan', false, 'fans'], ['Calming music', 'green', 'music', false, 'calming music'],
        ['A quieter chime', 'green', 'bell', false, 'quieter chime']],
      why: 'Covered triggers simply *don’t reach your dog at the same intensity*.',
      mark: { rings: [[0.47, 0.46, 80]], tag: ['Noise machine on', 0.04, 0.05], phrase: 'noise machines' } },
    { title: 'Create a safe space', src: 'ms_s21.jpg', nat: [1050, 1400],
      lead: 'A quiet room or crate in the *most soundproof* part of your home.',
      chips: [['For predictable noisy events', 'pale', 'calendar-days', false, 'predictable noisy'], ['Conditioned to love it', 'green', 'heart', false, 'condition your dog']],
      why: 'A quiet retreat *keeps stress low*, even when it’s loud outside.',
      mark: { rings: [[0.46, 0.42, 90]], tag: ['Quiet den', 0.04, 0.05], phrase: 'quiet room' } },
    { title: 'Plan around predictable events', src: 'ms_s22.jpg', nat: [1050, 1400],
      lead: 'Garbage truck every Tuesday at 10?',
      chips: [['Tuesday, 10:00', 'amber', 'calendar-clock', false, 'tuesday'], '>', ['Frozen Kong first', 'green', 'bone', false, 'frozen kong'], ['Sound machine on', 'green', 'volume-2', false, 'sound machine']],
      why: 'Preparation turns a predictable trigger *into a non-event*.',
      mark: { rings: [[0.38, 0.67, 60]], tag: ['Frozen Kong first', 0.04, 0.05], phrase: 'frozen kong' } },
  ];
  TIPS.forEach((o, i) => registerScene(`ms02s${String(i + 1).padStart(2, '0')}`, ctx => MS.tip(ctx, { sec: SEC, icon: IC, n: i + 1, ...o })));
  registerScene('ms02recap', ctx => MS.recap(ctx, { title: 'sights & sounds at home',
    items: ['Turn off the doorbell', 'Have guests wait before entering', 'Create physical barriers', 'Move deliveries away from the house', 'Block visual access to windows',
      'Manage outdoor time', 'Mask or eliminate sounds', 'Create a safe space', 'Plan around predictable events'],
    phrases: ['turn off', 'have guests', 'create physical', 'move deliveries', 'block visual', 'manage outdoor', 'mask or', 'create a', 'plan around'],
    summary: 'Manage the *windows, the yard, the doorbell, and deliveries*, so your dog’s *foundation doesn’t crack* and unwanted behaviors don’t get practiced.' }));

  // ---------------------------------------------------------------- see it in action: fence reactivity
  registerScene('ms02s10', ctx => {
    MS.css(ctx.stage);
    TM.videoSlide(ctx, { kicker: 'See it in action', heading: 'See it in action', rows: [
      { icon: 'video', html: 'A real *client session*', beat: 0, phrase: 'client session' },
      { icon: 'fence', html: 'Managing *fence reactivity* in the yard', beat: 0, phrase: 'fence reactivity' },
      { icon: 'link', html: '*Two leashes*: one keeps the dog off the fence', beat: 1, phrase: 'one is set up' },
      { icon: 'door-open', html: 'The other reaches the door; the dog is *transferred* between them', beat: 1, phrase: 'second leash' },
    ] });
  });

  // ---------------------------------------------------------------- day to day: Tori's five pictures
  registerScene('ms02s11', ctx => {
    const { stage, tl, cue } = ctx;
    MS.css(stage);
    TM.head(ctx, 'Management in real life', 'What it looks like, day to day');
    const H = 320, G = 20, CG = 30, Y = 292;
    const L = 2 * H + G, M = Math.round(H * 4 / 3);
    const x0 = Math.round(100 + (1720 - (L + CG + M + CG + M)) / 2);
    const P = [
      ['ms_s24_1.jpg', [960, 960], x0, Y, L, L, 'Gates at the doors', 'gates'],
      ['ms_s24_2.jpg', [1400, 1050], x0 + L + CG, Y, M, H, 'A second fence line', 'second fence'],
      ['ms_s24_3.jpg', [960, 720], x0 + L + CG + M + CG, Y, M, H, 'Frosted window film', 'frosted film'],
      ['ms_s24_4.jpg', [960, 720], x0 + L + CG, Y + H + G, M, H, 'Cardboard on the couch window', 'cardboard'],
      ['ms_s24_5.jpg', [720, 960], x0 + L + CG + M + CG + Math.round((M - H * 0.75) / 2), Y + H + G, Math.round(H * 0.75), H, 'A screen', 'screen in front'],
    ];
    const pics = P.map(([src, nat, x, y, w, h, lab, phrase], i) => {
      const ph = TM.pic(stage, src, { x, y, w, h, nat, radius: 18, border: 6 });
      const t = at(ctx, 1, phrase, 0.1 + 0.18 * i);
      tl.fromTo(ph.wrap, { opacity: 0, y: 30, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power3.out' }, t);
      const tg = TM.fx.tag(tl, ph.wrap, lab, 0, 0, t + 0.35, 'green');
      tg.style.fontSize = '24px';
      tg.style.left = '18px';
      tg.style.top = (h - tg.offsetHeight - 18) + 'px';
      return { ph, tg };
    });
    // the close: none of it is fancy
    const b = put(stage, K.el('div', 'tm-banner', `${K.icon('circle-check').outerHTML}<span>It doesn’t have to cost a lot <b>to work in your home</b>.</span>`), 0, 0);
    b.style.left = Math.round(960 - b.offsetWidth / 2) + 'px';
    b.style.top = Math.round(Y + H + G / 2 - b.offsetHeight / 2) + 'px';
    b.style.zIndex = 6;
    const t2 = cue(2) + 0.05;
    tl.to(pics.map(p => p.ph.wrap), { opacity: 0.5, duration: 0.6 }, t2);
    tl.fromTo(b, { opacity: 0, y: 30, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' }, t2 + 0.1);
  });
})();
