// Markers and Mechanics: the closing slide (end of Part 4).
//   tm04s07  your key takeaways: training photo, five numbered points (including how to mark behavior in training); logo close
(() => {
  const { at, put } = TM;

  registerScene('tm04s07', ctx => {
    const { stage, tl, cue, end } = ctx;
    TM.style(stage);
    const p = K.photo(stage, 'trainer_with_dog.jpg', { x: 100, y: 300, w: 600, h: 640, pos: '50% 40%' });
    A.in(tl, p.root, 0.1, 'fadeUp', { dur: 0.8 });
    A.kenburns(tl, p.img, { from: 1.02, to: 1.1 });
    const hd = TM.head(ctx, 'Pulling it together', 'Your key takeaways');
    const col = put(stage, K.el('div', 'tm-col'), 790, 300, { width: '1030px', gap: '30px' });
    [
      ['A marker identifies *the moment that earned a treat*, and its game tells your dog *what comes next*.', 0, 'identifies the moment'],
      ['In training: *mark the instant* the behavior happens, pause, then its food game. A sit: *bottom touches the ground*. A check-in: *they look at you*.', 1, 'watch for the behavior'],
      ['Practice without your dog first: *mark, pause, move*.', 2, 'practice your mechanics'],
      ['Introduce *one marker at a time*, then combine. Always follow with its food game.', 3, 'introduce each marker'],
      ['Choose *the game that fits* what you’re teaching and what your dog needs.', 4, 'choose the game'],
    ].forEach(([t, b, ph], i) => {
      const r = TM.row(col, null, t, { num: i + 1, size: 30 });
      A.in(tl, r, at(ctx, b, ph, 0.05), 'fadeRight', { dur: 0.6 });
    });
    col.style.top = Math.round(300 + 320 - col.offsetHeight / 2) + 'px';  // centred on the photo
    SKIT.logoClose(ctx, end(4) + 0.5, [p.root, ...hd.all, col]);
  });
})();
