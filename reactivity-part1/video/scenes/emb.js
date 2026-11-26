// Management: Everyday Manners, Part 2 (everyday situations). Each slide: heading and a content column at left (what your dog
// practices in red, Manage it and Teach instead in green), Tori's picture whole at right, or a placeholder frame until it arrives.
//   em02s00  teach what you want instead: a clear picture, other options we prefer, practice in many places
//   em02s01  greetings at the door (abc_greet_c): the greeting ritual loop with the jump built in
//   em02s01 and em02s04 play Tori's clips (muted) in the picture's place: the dachshund (jumping, then four paws on the floor)
//            and the loose leash walk (vertical)
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

  // ---------------------------------------------------------------- teach what you want instead (applies to every situation)
  registerScene('em02s00', ctx => {
    const { stage, tl, cue } = ctx;
    css(stage);
    TM.head(ctx, 'Everyday situations', 'Teach what you want instead');
    const no = MG.card(stage, { x: 100, y: 300, w: 820, variant: 'red', label: 'Only what you don’t want', icon: 'circle-x', body: '“No!” tells your dog what to stop, but !!not what to do!!.' });
    tl.fromTo(no, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, at(ctx, 0, 'not just what', 0.2));
    const yes = MG.card(stage, { x: 1000, y: 300, w: 820, variant: 'green', label: 'A clear picture', icon: 'eye', body: 'Know exactly *what you want your dog to do* instead.' });
    tl.fromTo(yes, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, at(ctx, 0, 'clear picture', 0.2));
    const H = Math.max(no.offsetHeight, yes.offsetHeight); no.style.height = yes.style.height = H + 'px';
    // beat 1: telling them no isn't fair; other options we prefer
    const row = put(stage, K.el('div', 'em-chips'), 100, 300 + H + 44, { position: 'absolute', width: '1720px', alignItems: 'center' });
    const nf = TM.word(row, 'Just “no” isn’t fair', { variant: 'red', icon: 'ban', size: 30 });
    const ar = K.iconBadge(row, 'arrow-right', { size: 46 });
    const op = TM.word(row, 'Other options we prefer, that pay off', { variant: 'green', icon: 'check', size: 30 });
    [nf, ar, op].forEach(n => { n.style.position = 'relative'; n.style.left = n.style.top = ''; });
    A.in(tl, nf, at(ctx, 1, 'isn’t fair', 0.3), 'pop', { dur: 0.4 });
    A.in(tl, [ar, op], at(ctx, 1, 'other options', 0.3), 'fadeRight', { dur: 0.5, stagger: 0.15 });
    // beat 2: practice the choices in many places
    const ctxRow = put(stage, K.el('div', 'em-chips'), 100, row.offsetTop + row.offsetHeight + 40, { position: 'absolute', width: '1720px', alignItems: 'center' });
    const lab = K.el('div', 'tm-lab', 'Practice it:'); Object.assign(lab.style, { position: 'relative', fontSize: '32px', color: 'var(--green-dark)' }); ctxRow.appendChild(lab);
    const ctxs = [['At home', 'house'], ['In the yard', 'trees'], ['On walks', 'route'], ['With visitors', 'users']].map(([t, ic]) => { const n = TM.word(ctxRow, t, { variant: 'pale', icon: ic, size: 28 }); n.style.position = 'relative'; n.style.left = n.style.top = ''; return n; });
    A.in(tl, lab, cue(2) + 0.1, 'fadeUp', { dur: 0.5 });
    A.in(tl, ctxs, at(ctx, 2, 'different places', 0.2), 'pop', { dur: 0.4, stagger: 0.15 });
    // beat 3: how each situation slide is laid out
    const prev = put(stage, K.el('div', 'em-chips'), 100, ctxRow.offsetTop + ctxRow.offsetHeight + 50, { position: 'absolute', width: '1720px', gap: '20px' });
    const secs = [PRACT, MANAGE, TEACH].map(([v, l, ic]) => { const sct = EM.section(prev, v, l, ic); sct.style.width = 'auto'; return sct; });
    A.in(tl, secs, cue(3) + 0.2, 'fadeRight', { dur: 0.5, stagger: 0.35 });
  });

  // ---------------------------------------------------------------- greetings at the door
  registerScene('em02s01', ctx => {
    const { stage, tl, cue } = ctx;
    css(stage);
    const m = EM.situation(ctx, { title: 'Greetings at the door', src: 'abc_greet_c.jpg', nat: [611, 364], maxW: 600, maxH: 520, gap: 34 });
    TM.fx.ring(tl, m.ph.sv, m.ph.P(0.36, 0.55), at(ctx, 0, 'jumps all over', 0.6), { r: 46, n: 2, color: 'var(--red)' });
    const s1 = EM.section(m.col, ...PRACT);
    const lead = EM.text(s1, 'A greeting ritual, with !!the jump built in!!:');
    // the ritual loop: jumps, asked to sit, sits, gets attention, and round again
    const loop = K.el('div', 'em-chips'); loop.style.alignItems = 'center'; loop.style.gap = '8px'; loop.style.flexWrap = 'nowrap'; s1.appendChild(loop);
    const step = (t, v, ic) => { const n = TM.word(loop, t, { variant: v, icon: ic, size: 24 }); n.style.padding = '10px 18px'; n.style.position = 'relative'; n.style.left = n.style.top = ''; return n; };
    const arrow = () => { const a = K.iconBadge(loop, 'arrow-right', { size: 30 }); a.style.position = 'relative'; a.style.left = a.style.top = ''; return a; };
    const L = [step('Jumps', 'red', 'repeat'), arrow(), step('Asked to sit', 'pale', 'message-circle'), arrow(), step('Sits', 'pale', 'paw-print'), arrow(), step('Gets attention', 'pale', 'heart')];
    const back = K.iconBadge(loop, 'rotate-ccw', { size: 30 }); back.style.position = 'relative'; back.style.left = back.style.top = '';
    show(tl, s1.querySelector('.lab'), cue(1) + 0.05);
    show(tl, lead, cue(1) + 0.1);
    [['jumps', 0], ['asks for a sit', 2], ['dog sits', 4], ['attention', 6]].forEach(([p, i]) => {
      const t = at(ctx, 1, p, 0.2 + 0.15 * i);
      A.in(tl, L[i], t, 'pop', { dur: 0.4 });
      if (i) A.in(tl, L[i - 1], t - 0.1, 'fade', { dur: 0.3 });
    });
    A.in(tl, back, at(ctx, 1, 'part of the routine', 0.3), 'pop', { dur: 0.4 });
    A.pulse(tl, L[0], at(ctx, 1, 'part of the routine', 0.3) + 0.3, { scale: 1.12 });
    const s2 = EM.section(m.col, ...MANAGE);
    EM.text(s2, 'A *baby gate* or a *leash*, before the door opens.');
    show(tl, s2, at(ctx, 2, 'baby gate', 0.2));
    const s3 = EM.section(m.col, ...TEACH);
    EM.chips(s3, [['For example: four paws on the floor', 'pale', 'paw-print'], ['Go to a mat', 'pale', 'square']], 27);
    show(tl, s3, cue(3) + 0.1);
    // the dachshund clip takes the picture's place (muted, from the lesson's clip block)
    const tV = ctx.info.clip ? ctx.info.clip.at - 0.7 : cue(3);
    tl.to(m.ph.wrap, { opacity: 0, scale: 0.97, duration: 0.5, ease: 'power2.in' }, tV - 0.2);
    TM.videoFrame(ctx, tV).cap.style.display = 'none';
  });

  // ---------------------------------------------------------------- mealtime
  registerScene('em02s02', ctx => {
    const { stage, tl, cue } = ctx;
    css(stage);
    const m = EM.situation(ctx, { title: 'Mealtime', hold: 'Mealtime', maxW: 560, maxH: 600, gap: 30 });
    const s1 = EM.section(m.col, ...PRACT);
    const ch = EM.chips(s1, [['Counter surfing', 'red', 'cookie'], ['Mugging and grabbing', 'red', 'hand'], ['Jumping at meal prep', 'red', 'utensils'], ['Guarding the bowl', 'red', 'shield-alert']], 26);
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
    EM.text(s3, '*Teach what you want instead.* For example: settle on a mat while you cook.', 31);
    show(tl, s3, cue(3) + 0.1);
  });

  // ---------------------------------------------------------------- jumping for things in hands
  registerScene('em02s03', ctx => {
    const { stage, tl, cue } = ctx;
    css(stage);
    const m = EM.situation(ctx, { title: 'Jumping for things in hands', hold: 'Jumping for something in a hand', maxW: 560, maxH: 600, hsize: 58 });
    const s1 = EM.section(m.col, ...PRACT);
    const ch = EM.chips(s1, [['Food', 'red', 'cookie'], ['Toys', 'red', 'bone'], ['The mail', 'red', 'mail']], 28);
    show(tl, s1.querySelector('.lab'), cue(0) + 0.1);
    [['food', 0], ['toys', 1], ['the mail', 2]].forEach(([p, i]) => A.in(tl, ch[i], at(ctx, 0, p, 0.1 + 0.1 * i), 'pop', { dur: 0.4 }));
    const w = EM.text(s1, 'If jumping gets it even once, they’ll !!try again, and harder!!.', 31);
    show(tl, w, at(ctx, 0, 'even once', 0.5));
    const s2 = EM.section(m.col, ...MANAGE);
    const a1 = EM.text(s2, 'Keep things *up and out of reach*.', 31);
    const a2 = EM.text(s2, 'Carrying in the groceries? If it’s too exciting, your dog waits *behind a baby gate*.', 31);
    show(tl, s2.querySelector('.lab'), cue(1) + 0.05);
    show(tl, a1, cue(1) + 0.2);
    show(tl, a2, at(ctx, 1, 'groceries', 0.3));
    const s3 = EM.section(m.col, ...TEACH);
    EM.text(s3, 'For example: a *sit* or *four paws on the floor* earns the toy or the treat.', 31);
    show(tl, s3, cue(2) + 0.1);
  });

  // ---------------------------------------------------------------- pulling on walks
  registerScene('em02s04', ctx => {
    const { stage, tl, cue } = ctx;
    css(stage);
    const m = EM.situation(ctx, { title: 'Pulling on walks', hold: ' ', maxW: 480, maxH: 600, gap: 40 });
    m.ph.wrap.style.visibility = 'hidden';  // the loose leash walking clip sits in this spot instead
    TM.videoFrame(ctx, 0.35).cap.style.display = 'none';
    const s1 = EM.section(m.col, ...PRACT);
    EM.text(s1, 'Pulling gets them where they want to go, so !!pulling works!!.');
    show(tl, s1, cue(0) + 0.1);
    const s2 = EM.section(m.col, ...MANAGE);
    const ch = EM.chips(s2, [['A well fitted harness', 'pale', 'shield-check'], ['A head halter, once conditioned', 'pale', 'check']], 27);
    show(tl, s2.querySelector('.lab'), cue(1) + 0.05);
    A.in(tl, ch[0], at(ctx, 1, 'harness', 0.3), 'pop', { dur: 0.4 });
    A.in(tl, ch[1], at(ctx, 1, 'head halter', 0.5), 'pop', { dur: 0.4 });
    const s3 = EM.section(m.col, ...TEACH);
    EM.text(s3, 'For example: *loose leash walking*, rewarded right next to you.', 31);
    show(tl, s3, cue(2) + 0.1);
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
