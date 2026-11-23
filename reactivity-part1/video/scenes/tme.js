// Markers and Mechanics: the closing slide (end of Part 4).
//   tm04s07  your key takeaways: training photo, five numbered points (practice second; how to mark in training third, with its examples as bullets); logo close
(() => {
  const { at, put } = TM;

  registerScene('tm04s07', ctx => {
    const { stage, tl, cue, end } = ctx;
    TM.style(stage);
    const p = K.photo(stage, 'trainer_with_dog.jpg', { x: 100, y: 300, w: 600, h: 640, pos: '50% 40%' });
    A.in(tl, p.root, 0.1, 'fadeUp', { dur: 0.8 });
    A.kenburns(tl, p.img, { from: 1.02, to: 1.1 });
    const hd = TM.head(ctx, 'Pulling it together', 'Your key takeaways');
    const col = put(stage, K.el('div', 'tm-col'), 790, 300, { width: '1030px', gap: '26px' });
    [
      ['A marker identifies *the moment that earned a treat*, and its game tells your dog *what comes next*.', 0, 'identifies the moment'],
      ['Practice without your dog first: *mark, pause, move*.', 1, 'practice your mechanics'],
      ['In training: *mark the instant* the behavior happens, then its food game.', 2, 'watch for the behavior',
        [['A sit: *bottom touches the ground*', 'for a sit'], ['A check-in: *they look at you*', 'for a check-in']]],
      ['Introduce *one marker at a time*, then mix them in slowly. Always follow through.', 3, 'introduce each marker'],
      ['Choose *the game that fits* what you’re teaching and what your dog needs.', 4, 'choose the game'],
    ].forEach(([t, b, ph, bullets], i) => {
      const r = TM.row(col, null, t, { num: i + 1, size: 29 });
      A.in(tl, r, at(ctx, b, ph, 0.05), 'fadeRight', { dur: 0.6 });
      if (!bullets) return;
      // the examples as bullet points under the row's text
      r.style.alignItems = 'flex-start';  // the number sits level with the row's first line, not the middle of its bullets
      const span = r.lastChild;
      const ul = K.el('div');
      Object.assign(ul.style, { display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' });
      bullets.forEach(([bt, bp]) => {
        const li = K.el('div', null, `<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:var(--green);margin:0 16px 4px 4px"></span>${K.md(bt)}`);
        Object.assign(li.style, { font: '600 27px/1.3 var(--font-body)', color: 'var(--ink-soft)' });
        ul.appendChild(li);
        A.in(tl, li, at(ctx, b, bp, 0.2), 'fadeRight', { dur: 0.5 });
      });
      span.appendChild(ul);
    });
    col.style.top = Math.round(300 + 320 - col.offsetHeight / 2) + 'px';  // centred on the photo
    SKIT.logoClose(ctx, end(4) + 0.5, [p.root, ...hd.all, col]);
  });
})();
