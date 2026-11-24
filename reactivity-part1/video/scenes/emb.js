// Management: Everyday Manners, Part 2 (everyday situations). Each slide: heading and a content column at left (what your dog
// practices in red, Manage it and Teach instead in green), Tori's picture whole at right, or a placeholder frame until it arrives.
//   em02s01  greetings at the door (abc_greet_c: the golden jumping on a guest at the door)
//   em02s02  mealtime (picture pending): counter surfing, mugging, jumping at meal prep, guarding the bowl
//   em02s03  jumping for things in hands (picture pending)
//   em02s04  pulling on walks (picture pending): harness; head halter, once conditioned; shorter walks while training
//   em02s05  barking at people (abc_greet_b: the golden barking at a man through the window); they may want the person closer; ABCs course
(() => {
  const { at, put } = TM;
  const CSS = `
  .emb-abc { position: relative; box-sizing: border-box; display: flex; align-items: center; gap: 30px; padding: 22px 30px; border-radius: 24px; background: #fff;
    border: 1px solid #e6e9e1; box-shadow: var(--shadow-soft); width: 100%; }
  .emb-abc .tiles { display: flex; gap: 10px; }
  .emb-abc .tiles span { width: 70px; height: 70px; border-radius: 16px; background: var(--green); color: #fff; display: grid; place-items: center; font: 800 44px/1 var(--font-head); }
  .emb-abc .k { font: 700 23px/1 var(--font-body); letter-spacing: 3px; text-transform: uppercase; color: var(--green-dark); }
  .emb-abc .t { margin-top: 8px; font: 700 40px/1.1 var(--font-head); color: var(--ink); }
  `;
  const css = stage => { EM.css(stage); if (!stage.querySelector('style[data-emb]')) { const s = K.el('style', null, CSS); s.dataset.emb = '1'; stage.appendChild(s); } };
  const show = (tl, n, t, type = 'fadeUp') => A.in(tl, n, t, type, { dur: 0.55 });
  const PRACT = ['red', 'What they practice', 'repeat'], MANAGE = ['green', 'Manage it', 'shield-check'], TEACH = ['green', 'Teach instead', 'graduation-cap'];

  // ---------------------------------------------------------------- greetings at the door
  registerScene('em02s01', ctx => {
    const { stage, tl, cue } = ctx;
    css(stage);
    const m = EM.situation(ctx, { title: 'Greetings at the door', src: 'abc_greet_c.jpg', nat: [611, 364], maxW: 760, maxH: 560 });
    const s1 = EM.section(m.col, ...PRACT);
    EM.text(s1, 'Jumping on guests becomes !!the way your dog says hello!!.');
    show(tl, s1, at(ctx, 0, 'jumps all over', 0.4));
    TM.fx.ring(tl, m.ph.sv, m.ph.P(0.36, 0.55), at(ctx, 0, 'jumps all over', 0.6), { r: 46, n: 2, color: 'var(--red)' });
    const s2 = EM.section(m.col, ...MANAGE);
    EM.text(s2, 'A *baby gate* or a *leash*, before the door opens.');
    show(tl, s2, cue(1) + 0.1);
    const s3 = EM.section(m.col, ...TEACH);
    EM.chips(s3, [['Four paws on the floor', 'pale', 'paw-print'], ['Go to a mat', 'pale', 'square']], 28);
    show(tl, s3, cue(2) + 0.1);
  });

  // ---------------------------------------------------------------- mealtime
  registerScene('em02s02', ctx => {
    const { stage, tl, cue } = ctx;
    css(stage);
    const m = EM.situation(ctx, { title: 'Mealtime', hold: 'Mealtime', maxW: 560, maxH: 600, gap: 28 });
    const s1 = EM.section(m.col, ...PRACT);
    const ch = EM.chips(s1, [['Counter surfing', 'red', 'cookie'], ['Mugging', 'red', 'hand'], ['Jumping at meal prep', 'red', 'utensils'], ['Guarding the bowl', 'red', 'shield-alert']], 26);
    show(tl, s1.querySelector('.lab'), cue(0) + 0.1);
    [['counter surfing', 0], ['mugging', 1], ['jumping up', 2], ['guarding', 3]].forEach(([p, i]) => A.in(tl, ch[i], at(ctx, 0, p, 0.15 + 0.2 * i), 'pop', { dur: 0.4 }));
    const s2 = EM.section(m.col, ...MANAGE);
    const r1 = EM.text(s2, '*Food out of reach*, off the counters.', 31);
    const r2 = EM.text(s2, 'A *gate, crate, or mat* while you make meals and eat.', 31);
    const r3 = EM.text(s2, 'Guarding? *A quiet spot* to eat in peace. Getting worse? *Reach out.*', 31);
    show(tl, s2.querySelector('.lab'), cue(1) + 0.05);
    show(tl, r1, at(ctx, 1, 'food off', 0.2));
    show(tl, r2, at(ctx, 1, 'gate', 0.5));
    show(tl, r3, cue(2) + 0.1);
    const s3 = EM.section(m.col, ...TEACH);
    EM.text(s3, 'A calm *sit or wait*. The bowl goes down *when your dog is calm*.', 31);
    show(tl, s3, cue(3) + 0.1);
  });

  // ---------------------------------------------------------------- jumping for things in hands
  registerScene('em02s03', ctx => {
    const { stage, tl, cue } = ctx;
    css(stage);
    const m = EM.situation(ctx, { title: 'Jumping for things in hands', hold: 'Jumping for something in a hand', maxW: 560, maxH: 600, hsize: 58 });
    const s1 = EM.section(m.col, ...PRACT);
    const ch = EM.chips(s1, [['Food', 'red', 'cookie'], ['Toys', 'red', 'bone'], ['Shoes', 'red', 'footprints'], ['The mail', 'red', 'mail']], 28);
    show(tl, s1.querySelector('.lab'), cue(0) + 0.1);
    [['food', 0], ['toys', 1], ['shoes', 2], ['the mail', 3]].forEach(([p, i]) => A.in(tl, ch[i], at(ctx, 0, p, 0.1 + 0.1 * i), 'pop', { dur: 0.4 }));
    const w = EM.text(s1, 'If jumping gets it even once, they’ll !!try again, and harder!!.', 31);
    show(tl, w, at(ctx, 0, 'even once', 0.5));
    const s2 = EM.section(m.col, ...MANAGE);
    EM.text(s2, 'Keep things *up and out of reach*. A *leash or tether* when people are carrying something your dog wants.', 31);
    show(tl, s2, cue(1) + 0.1);
    const s3 = EM.section(m.col, ...TEACH);
    EM.text(s3, 'A *sit* or *four paws on the floor* earns the toy or the treat.', 31);
    show(tl, s3, cue(2) + 0.1);
  });

  // ---------------------------------------------------------------- pulling on walks
  registerScene('em02s04', ctx => {
    const { stage, tl, cue } = ctx;
    css(stage);
    const m = EM.situation(ctx, { title: 'Pulling on walks', hold: 'Pulling on the leash', maxW: 560, maxH: 600, gap: 30 });
    const s1 = EM.section(m.col, ...PRACT);
    EM.text(s1, 'Pulling gets them where they want to go, so !!pulling works!!.');
    show(tl, s1, cue(0) + 0.1);
    const s2 = EM.section(m.col, ...MANAGE);
    const ch = EM.chips(s2, [['A well fitted harness', 'pale', 'shield-check'], ['A head halter, once conditioned', 'pale', 'check']], 27);
    const r3 = EM.text(s2, '*Shorter, calmer walks* while you’re training.', 31);
    show(tl, s2.querySelector('.lab'), cue(1) + 0.05);
    A.in(tl, ch[0], at(ctx, 1, 'harness', 0.3), 'pop', { dur: 0.4 });
    A.in(tl, ch[1], at(ctx, 1, 'head halter', 0.5), 'pop', { dur: 0.4 });
    show(tl, r3, cue(2) + 0.1);
    const s3 = EM.section(m.col, ...TEACH);
    EM.text(s3, '*Loose leash walking*: reward your dog for walking next to you.', 31);
    show(tl, s3, cue(3) + 0.1);
  });

  // ---------------------------------------------------------------- barking at people
  registerScene('em02s05', ctx => {
    const { stage, tl, cue } = ctx;
    css(stage);
    const m = EM.situation(ctx, { title: 'Barking at people', src: 'abc_greet_b.jpg', nat: [610, 364], maxW: 760, maxH: 560, gap: 28 });
    const s1 = EM.section(m.col, ...PRACT);
    EM.chips(s1, [['At the window', 'red', 'app-window'], ['On walks', 'red', 'footprints']], 27).forEach((c, i) => A.in(tl, c, cue(0) + 0.5 + 0.2 * i, 'pop', { dur: 0.4 }));
    show(tl, s1.querySelector('.lab'), cue(0) + 0.1);
    TM.fx.ring(tl, m.ph.sv, m.ph.P(0.5, 0.33), cue(0) + 0.4, { r: 36, n: 2, color: 'var(--red)' });
    const why = EM.text(s1, 'Sometimes they *want the person to come closer*. When that happens, !!barking works!!.', 31);
    show(tl, why, at(ctx, 1, 'come closer', 0.3));
    TM.fx.dots(tl, m.ph.sv, [m.ph.P(0.56, 0.3), m.ph.P(0.8, 0.3)], at(ctx, 1, 'come closer', 0.3), { color: '#fff', stroke: '#619537', r: 5, gap: 18, dur: 0.6, hold: 2.5 });
    const s2 = EM.section(m.col, ...MANAGE);
    EM.text(s2, '*Block the view* with window film or closed blinds. On walks, *give people space* before the barking starts.', 31);
    show(tl, s2, cue(2) + 0.1);
    // the ABCs course card
    const abc = K.el('div', 'emb-abc');
    abc.innerHTML = `<div class="tiles"><span>A</span><span>B</span><span>C</span></div><div><div class="k">Why your dog barks matters</div><div class="t">The ABCs of Behavior course</div></div>`;
    m.col.appendChild(abc);
    tl.fromTo(abc, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, at(ctx, 3, 'ABCs', 0.6));
    abc.querySelectorAll('.tiles span').forEach((s, i) => A.in(tl, s, at(ctx, 3, 'ABCs', 0.6) + 0.2 + 0.12 * i, 'pop', { dur: 0.4 }));
  });
})();
