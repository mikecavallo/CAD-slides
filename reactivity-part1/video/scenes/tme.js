// Markers and Mechanics, Part 5: using your markers during training.
//   tm05s01  mark the moment: the loop Watch, Mark, Pause, Feed the game lit in turn; sit and check-in examples; food ready
//   tm05s02  your key takeaways: training photo, four numbered points; logo close
(() => {
  const { at, put, clamp } = TM;
  const flow = n => { n.style.position = 'relative'; n.style.left = n.style.top = ''; return n; };

  const CSS = `
  .tme-seq { position: absolute; left: 100px; top: 290px; width: 1720px; height: 290px; background: #fff; border-radius: 26px; border: 1px solid #e6e9e1;
    box-shadow: var(--shadow-soft); overflow: hidden; display: grid; grid-template-columns: repeat(4, 1fr); }
  .tme-seq .rail { position: absolute; left: 0; top: 0; height: 8px; width: 100%; background: #eef1ea; }
  .tme-seq .fill { position: absolute; left: 0; top: 0; height: 8px; width: 100%; background: var(--green); transform-origin: left center; }
  .tme-step { position: relative; padding: 44px 40px 0; border-left: 2px solid #eef1ea; }
  .tme-step:first-of-type { border-left: none; }
  .tme-step .n { font: 700 30px/1 var(--font-body); letter-spacing: 4px; color: var(--green-light); }
  .tme-step .t { margin-top: 18px; font: 700 50px/1 var(--font-head); color: var(--ink); }
  .tme-step .d { margin-top: 16px; font: 500 29px/1.35 var(--font-body); color: var(--ink-soft); }
  .tme-ex { position: absolute; top: 630px; width: 840px; height: 150px; box-sizing: border-box; border-radius: 22px; background: var(--green-mist);
    border: 1px solid #e3ecd6; display: flex; align-items: center; gap: 26px; padding: 0 34px; }
  .tme-ex .b { width: 84px; height: 84px; border-radius: 50%; background: #fff; color: var(--green-dark); display: grid; place-items: center; flex: 0 0 auto;
    box-shadow: 0 6px 16px rgba(40,60,20,0.10); }
  .tme-ex .b svg { width: 44px; height: 44px; stroke-width: 2; }
  .tme-ex .k { font: 700 26px/1 var(--font-body); letter-spacing: 3px; text-transform: uppercase; color: var(--green); }
  .tme-ex .v { margin-top: 10px; font: 600 34px/1.2 var(--font-head); color: var(--ink); }
  .tme-note { position: absolute; left: 100px; top: 830px; display: flex; align-items: center; gap: 18px; font: 600 32px/1.2 var(--font-body); color: var(--ink); }
  .tme-note .r { width: 6px; height: 56px; border-radius: 3px; background: var(--green); }
  .tme-note b { color: var(--green-dark); }
  `;
  const css = stage => { TM.style(stage); if (!stage.querySelector('style[data-tme]')) { const s = K.el('style', null, CSS); s.dataset.tme = '1'; stage.appendChild(s); } };

  registerScene('tm05s01', ctx => {
    const { stage, tl, cue, end } = ctx;
    css(stage);
    TM.head(ctx, 'Using your markers', 'Mark the moment');
    // the sequence: four quiet columns, a progress rule fills as each step is said
    const seq = put(stage, K.el('div', 'tme-seq'), 100, 290);
    const rail = K.el('div', 'rail'), fill = K.el('div', 'fill');
    seq.appendChild(rail); seq.appendChild(fill);
    const STEPS = [['Watch', 'for the behavior you want', 'watch for'], ['Mark', 'the instant it happens', 'mark the instant'], ['Pause', 'briefly, hand still', 'pause briefly'], ['Feed', 'the matching food game', 'deliver the matching']];
    const cols = STEPS.map(([t, d], i) => {
      const c = K.el('div', 'tme-step', `<div class="n">0${i + 1}</div><div class="t">${t}</div><div class="d">${d}</div>`);
      seq.appendChild(c);
      return c;
    });
    tl.fromTo(seq, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, cue(0) + 0.2);
    tl.set(fill, { scaleX: 0 }, 0);
    tl.set(cols, { opacity: 0.35 }, 0);
    const ts = STEPS.map(([, , p], i) => at(ctx, 1, p, 0.1 + 0.25 * i));
    ts.forEach((t, i) => {
      tl.to(cols[i], { opacity: 1, duration: 0.4 }, t);
      tl.to(fill, { scaleX: (i + 1) / 4, duration: 0.5, ease: 'power2.out' }, t);
      tl.to(cols[i].querySelector('.n'), { color: '#619537', duration: 0.4 }, t);
    });
    // examples
    [['Reinforcing a sit', 'Mark when the bottom touches the ground', 'circle-check', 'reinforcing a sit', 100], ['Reinforcing a check-in', 'Mark when they look at you', 'eye', 'check-in', 980]].forEach(([k, v, ic, p, x]) => {
      const e = put(stage, K.el('div', 'tme-ex'), x, 630);
      const b = K.el('div', 'b'); b.appendChild(K.icon(ic));
      e.appendChild(b);
      e.appendChild(K.el('div', null, `<div class="k">${k}</div><div class="v">${v}</div>`));
      tl.fromTo(e, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, at(ctx, 2, p, 0.3));
    });
    const note = put(stage, K.el('div', 'tme-note', '<span class="r"></span><span>Have your food ready, and keep <b>the mark and your hand movement separate</b>.</span>'), 100, 830);
    A.in(tl, note, at(ctx, 3, 'food ready', 0.1), 'fadeRight', { dur: 0.6 });
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
      ['A marker identifies *the moment that earned a treat*, and its game tells your dog *what comes next*.', 0, 'identifies the moment'],
      ['Practice without your dog first: *mark, pause, then movement*.', 1, 'practice your mechanics'],
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
