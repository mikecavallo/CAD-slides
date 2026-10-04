// Markers and Mechanics, Part 5: using your markers during training.
//   tm05s01  mark the moment: the loop Watch, Mark, Pause, Feed the game lit in turn; sit and check-in examples; food ready
//   tm05s02  your key takeaways: training photo, four numbered points; logo close
(() => {
  const { at, put, clamp } = TM;
  const flow = n => { n.style.position = 'relative'; n.style.left = n.style.top = ''; return n; };

  registerScene('tm05s01', ctx => {
    const { stage, tl, cue, end } = ctx;
    TM.style(stage);
    TM.head(ctx, 'Using your markers', 'Mark the moment');
    const NODES = [['Watch', 'eye', 'watch for'], ['Mark', 'volume-2', 'mark the instant'], ['Pause', 'pause', 'pause briefly'], ['Feed the game', 'cookie', 'deliver the matching']];
    const X = [230, 640, 1050, 1460], Y = 290;
    const sv = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const arrows = [0, 1, 2].map(i => K.path(sv, `M ${X[i] + 262} ${Y + 125} L ${X[i + 1] - 14} ${Y + 125}`, { stroke: '#b8d99a', 'stroke-width': 8, fill: 'none', 'stroke-linecap': 'round' }));
    const nodes = NODES.map(([t, ic], i) => {
      const n = put(stage, K.el('div', 'tm-node'), X[i], Y);
      const b = K.el('div', 'ic');
      b.appendChild(K.icon(ic));
      n.appendChild(b);
      n.appendChild(K.el('div', 't', t));
      n.appendChild(K.el('div', 'n', String(i + 1)));
      return n;
    });
    A.in(tl, nodes, cue(0) + 0.3, 'pop', { dur: 0.5, stagger: 0.12 });
    A.draw(tl, arrows, cue(0) + 0.7, 0.5, { stagger: 0.12 });
    const ON = { borderColor: '#619537', boxShadow: '0 18px 40px rgba(63,107,34,0.25)', scale: 1.06, duration: 0.4, ease: 'power2.out' };
    const OFF = { borderColor: '#d9ddd3', boxShadow: '0 10px 30px rgba(40,60,20,0.10)', scale: 1, duration: 0.4, ease: 'power2.out' };
    const ts = NODES.map(([, , p], i) => at(ctx, 1, p, 0.1 + 0.25 * i));
    nodes.forEach((n, i) => {
      tl.to(n, ON, ts[i]);
      tl.to(n, OFF, i < 3 ? ts[i + 1] : cue(2));
    });
    const row = put(stage, K.el('div'), 0, 640, { position: 'absolute', width: '1920px', display: 'flex', justifyContent: 'center', gap: '24px' });
    [['A sit: *bottom touches the ground*', 'circle-check', 'reinforcing a sit'], ['A check-in: *looks at you*', 'eye', 'check-in']].forEach(([w, ic, p]) => {
      const n = flow(TM.word(row, w, { variant: 'pale', icon: ic, size: 32 }));
      A.in(tl, n, at(ctx, 2, p, 0.3), 'pop', { dur: 0.45 });
    });
    const bn = put(stage, K.el('div', 'tm-banner'), 0, 790);
    bn.appendChild(K.icon('cookie'));
    bn.appendChild(K.el('span', null, 'Food ready. <b>Word and hand separate.</b>'));
    TM.centerX(bn, 960);
    A.in(tl, bn, at(ctx, 3, 'food ready', 0.1), 'fadeUp', { dur: 0.6 });
  });

  registerScene('tm05s02', ctx => {
    const { stage, tl, cue, end } = ctx;
    TM.style(stage);
    const p = K.photo(stage, 'trainer_with_dog.jpg', { x: 100, y: 290, w: 620, h: 640, pos: '50% 40%' });
    A.in(tl, p.root, 0.1, 'fadeUp', { dur: 0.8 });
    A.kenburns(tl, p.img, { from: 1.02, to: 1.1 });
    const hd = TM.head(ctx, 'Pulling it together', 'Your key takeaways');
    const col = put(stage, K.el('div', 'tm-col'), 800, 300, { width: '1020px', gap: '36px' });
    const rows = [
      ['A marker marks *the moment that earned a treat*, and its word tells your dog *which game comes next*.', 0, 'identifies the moment'],
      ['Practice without your dog first: *word, pause, then movement*.', 1, 'practice your mechanics'],
      ['Introduce *one marker at a time*, then combine. Always follow with its food game.', 2, 'introduce each marker'],
      ['Choose *the game that fits* what you’re teaching and what your dog needs.', 3, 'choose the game'],
    ].map(([t, b, ph], i) => {
      const r = TM.row(col, null, t, { num: i + 1, size: 32 });
      A.in(tl, r, at(ctx, b, ph, 0.05), 'fadeRight', { dur: 0.6 });
      return r;
    });
    SKIT.logoClose(ctx, end(3) + 0.5, [p.root, ...hd.all, col]);
  });
})();
