// Management: Solutions and Setups, Part 7 (set up for success) and the close.
//   ms07s01  be proactive, not reactive: three key reminder cards
//   ms07s02  your management toolkit: nine tool cards, each landing as it is named
//   ms07s03  take home the tally sheet: Tori's sheet at left, four steps at right
//   ms07s04  remember: management isn't forever; logo close
(() => {
  const { at, put } = TM;
  const CSS = `
  .mse-card { position: absolute; box-sizing: border-box; border-radius: 26px; background: #fff; border: 1px solid #e6e9e1; box-shadow: var(--shadow-soft); padding: 34px 36px; }
  .mse-card .ic { width: 84px; height: 84px; border-radius: 50%; background: var(--green-pale); color: var(--green-dark); display: grid; place-items: center; margin-bottom: 22px; }
  .mse-card .ic svg { width: 44px; height: 44px; stroke-width: 2.2; }
  .mse-card .t { font: 700 46px/1.1 var(--font-head); color: var(--ink); }
  .mse-card .b { margin-top: 18px; font: 500 34px/1.42 var(--font-body); color: var(--ink-soft); }
  .mse-tool { position: absolute; box-sizing: border-box; border-radius: 22px; background: #fff; border: 1px solid #e6e9e1; box-shadow: var(--shadow-soft); padding: 22px 26px;
    display: flex; gap: 20px; align-items: flex-start; }
  .mse-tool .ic { width: 64px; height: 64px; border-radius: 50%; background: var(--green-pale); color: var(--green-dark); display: grid; place-items: center; flex: 0 0 auto; }
  .mse-tool .ic svg { width: 34px; height: 34px; stroke-width: 2.2; }
  .mse-tool .t { font: 700 32px/1.1 var(--font-head); color: var(--ink); }
  .mse-tool .b { margin-top: 8px; font: 500 26px/1.32 var(--font-body); color: var(--ink-soft); }
  .mse-rem { position: absolute; left: 160px; width: 1600px; font: 700 76px/1.18 var(--font-head); color: var(--ink); }
  .mse-rem b { color: var(--green); }
  .mse-k { position: absolute; left: 160px; font: 700 30px/1 var(--font-body); letter-spacing: 8px; text-transform: uppercase; color: var(--green); }
  `;
  const css = stage => { MS.css(stage); if (!stage.querySelector('style[data-mse]')) { const s = K.el('style', null, CSS); s.dataset.mse = '1'; stage.appendChild(s); } };

  // ---------------------------------------------------------------- key reminders
  registerScene('ms07s01', ctx => {
    const { stage, tl, cue } = ctx;
    css(stage);
    TM.head(ctx, 'Key reminders', 'Be proactive, not reactive');
    const W = (1720 - 2 * 40) / 3;
    [['shield-check', 'It’s not avoidance', 'These strategies build the *stable environment* your dog needs to learn new, better responses.'],
      ['calendar-check', 'Plan ahead', 'Anticipate situations and set your dog up for success *before the trigger ever appears*.'],
      ['circle-check', 'Prevent the rehearsal', 'Your dog should *never meet the trigger* in an uncontrolled way.']].forEach(([ic, t, b], i) => {
      const c = put(stage, K.el('div', 'mse-card'), 100 + i * (W + 40), 340, { width: W + 'px', height: '500px' });
      c.innerHTML = `<div class="ic">${K.icon(ic).outerHTML}</div><div class="t">${t}</div><div class="b">${K.md(b)}</div>`;
      tl.fromTo(c, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, cue(i + 1) + 0.05);
    });
  });

  // ---------------------------------------------------------------- your management toolkit
  registerScene('ms07s02', ctx => {
    const { stage, tl, cue } = ctx;
    css(stage);
    TM.head(ctx, 'Set up for success', 'Your management toolkit');
    const ld = put(stage, K.el('div', 'mg-lead', 'The right gear does most of the heavy lifting, so you’re <b>never relying on willpower alone</b>.'), 100, 270, { width: '1720px', fontSize: '34px' });
    A.in(tl, ld, cue(0) + 0.4, 'fadeUp', { dur: 0.6 });
    const T = [
      ['link', 'Well-fitted harness', 'Secure and escape-proof.', 1, 'harness'],
      ['ruler', 'Fixed-length leash', '4 to 6 feet, never retractable.', 1, 'six foot leash'],
      ['route', 'Long line', '15 to 30 feet, for wide, open space.', 1, 'long line'],
      ['fence', 'Baby gates & barriers', 'Block rooms and doorways in seconds.', 2, 'baby gates'],
      ['lock', 'Crate or pen', 'A safe den for rest and visitors.', 2, 'crate or pen'],
      ['app-window', 'Window film or covers', 'No moving sights outside.', 2, 'window film'],
      ['volume-2', 'White noise machine', 'Masks the sounds outside.', 2, 'white noise'],
      ['cookie', 'Treat pouch & treats', 'Pay calm the instant it counts.', 3, 'treat pouch'],
      ['shield', 'Basket muzzle', 'A comfortable safety layer.', 3, 'basket muzzle'],
    ];
    const W = (1720 - 2 * 28) / 3, H = 170, Y = 270 + ld.offsetHeight + 40;
    T.forEach(([ic, t, b, beat, p], i) => {
      const c = put(stage, K.el('div', 'mse-tool'), 100 + (i % 3) * (W + 28), Y + Math.floor(i / 3) * (H + 24), { width: W + 'px', height: H + 'px' });
      c.innerHTML = `<div class="ic">${K.icon(ic).outerHTML}</div><div><div class="t">${t}</div><div class="b">${b}</div></div>`;
      tl.fromTo(c, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, at(ctx, beat, p, 0.2));
    });
  });

  // ---------------------------------------------------------------- take home the tally sheet
  registerScene('ms07s03', ctx => {
    const { stage, tl, cue } = ctx;
    css(stage);
    TM.head(ctx, 'Track your progress', 'Take home the tally sheet');
    const NAT = [1200, 1332];
    const { w, h } = MG.fit(NAT, 620, 650);
    const ph = TM.pic(stage, 'ms_tally.png', { x: 100, y: 290, w, h, nat: NAT, radius: 18, border: 0 });
    ph.root.style.boxShadow = '0 22px 54px rgba(40,60,20,0.18)';
    tl.fromTo(ph.wrap, { opacity: 0, y: 40, rotation: -2 }, { opacity: 1, y: 0, rotation: 0, duration: 0.9, ease: 'power3.out' }, 0.4);
    const X = 100 + w + 90, Wc = 1820 - X;
    const col = put(stage, K.el('div', 'tm-col'), X, 330, { width: Wc + 'px', gap: '40px' });
    [['Track *every reaction*: barks at the window, lunges on a walk.', 1, 'track every reaction'],
      ['Tally each one *every day*, then total the week.', 1, 'tally each one'],
      ['Look for *patterns* in when and where reactions spike.', 2, 'look for patterns'],
      ['Use the *notes* for weather, visitors, or schedule changes.', 2, 'use the notes']].forEach(([t, b, p], i) => {
      const r = TM.row(col, null, t, { num: i + 1, size: 34 });
      A.in(tl, r, at(ctx, b, p, 0.1 + 0.4 * (i % 2)), 'fadeRight', { dur: 0.6 });
    });
    // the sheet's first row gets a few tally marks as the steps are said
    const marks = [0.33, 0.42, 0.5].map((fx, k) => {
      const [x, y] = ph.P(fx, 0.315);
      const m = K.path(ph.sv, `M ${x - 6} ${y + 12} L ${x + 6} ${y - 12}`, { stroke: '#619537', 'stroke-width': 5, 'stroke-linecap': 'round', fill: 'none' });
      A.draw(tl, m, at(ctx, 1, 'every day', 0.6) + 0.25 * k, 0.3);
      return m;
    });
  });

  // ---------------------------------------------------------------- remember: the close
  registerScene('ms07s04', ctx => {
    const { stage, tl, cue, end } = ctx;
    css(stage);
    const k = put(stage, K.el('div', 'mse-k', 'Remember'), 160, 330);
    const r = put(stage, K.el('div', 'mse-rem', 'Management isn’t forever. It’s what <b>protects the work</b> while we build something better.'), 160, 390);
    A.in(tl, k, 0.2, 'fadeUp', { dur: 0.6 });
    A.in(tl, r, 0.35, 'fadeUp', { dur: 0.8 });
    SKIT.logoClose(ctx, end(0) + 0.8, [k, r]);
  });
})();
