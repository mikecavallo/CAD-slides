// Management: The Basics, Part 4 (five common mistakes) and the close.
//   mg04s00  five common mistakes: Tori's five pictures in a row, whole, numbered
//   mg04s01  picking and choosing: the owner's quote; one part managed, one skipped; how to avoid it
//   mg04s02  underestimating the environment: the hound's gaze off to the side; three subtle triggers; the stress bucket fills
//   mg04s03  relaxing management too soon: old and new pathway bars; the line still on; how to avoid it
//   mg04s04  viewing management as punishment: Punishment struck out, Protection; ring on the gate
//   mg04s05  feeding after the reaction has started: Trigger, Bark, Treats (red) vs Trigger, Calmly notices, Treats (green)
//   mg04s06  management is the foundation: the house standing whole; three takeaways; logo close
(() => {
  const { at, put, clamp } = TM;
  const CSS = `
  .mgd-q { position: absolute; box-sizing: border-box; padding: 26px 32px 26px 90px; border-radius: 24px; background: #fff; border: 1px solid #e6e9e1; box-shadow: var(--shadow-soft);
    font: 600 33px/1.38 var(--font-body); font-style: italic; color: var(--ink); }
  .mgd-q svg { position: absolute; left: 28px; top: 28px; width: 42px; height: 42px; color: var(--green-light); stroke-width: 2.4; }
  .mgd-row { position: absolute; display: flex; align-items: center; flex-wrap: wrap; gap: 16px; }
  .mgd-row .tm-word, .mgd-row .iconbadge { position: relative; left: auto; top: auto; }
  .mgd-txt { position: absolute; font: 600 32px/1.35 var(--font-body); color: var(--ink-soft); }
  .mgd-txt b { color: var(--green-dark); }
  .mgd-txt.red b { color: var(--red); }
  .mgd-bar { position: absolute; height: 54px; border-radius: 14px; display: flex; align-items: center; padding: 0 22px; box-sizing: border-box; font: 700 28px/1 var(--font-body);
    color: #fff; white-space: nowrap; transform-origin: left center; }
  .mgd-bar.old { background: var(--red); }
  .mgd-bar.new { background: var(--green); }
  .mgd-blab { position: absolute; font: 700 30px/1 var(--font-head); color: var(--ink); white-space: nowrap; }
  .mgd-meter { position: absolute; height: 30px; border-radius: 15px; background: #efe9dc; overflow: hidden; }
  .mgd-meter i { position: absolute; left: 0; top: 0; bottom: 0; width: 100%; border-radius: 15px; transform-origin: left center; background: linear-gradient(90deg, #d9912b, #b8452d); }
  .mgd-n { position: absolute; width: 56px; height: 56px; border-radius: 50%; background: #fff; color: var(--ink); border: 4px solid var(--green); font: 700 30px/48px var(--font-head);
    text-align: center; box-sizing: border-box; box-shadow: 0 8px 18px rgba(40,60,20,0.2); }
  .mgd-statement { position: absolute; box-sizing: border-box; padding: 30px 40px; border-radius: 26px; background: var(--green-deep); color: #fff; font: 700 44px/1.2 var(--font-head);
    box-shadow: 0 18px 40px rgba(44,74,23,0.3); }
  .mgd-statement b { color: #d6e9a8; }
  .mgd-statement .k { display: block; margin-bottom: 14px; font: 700 26px/1 var(--font-body); letter-spacing: 5px; text-transform: uppercase; color: var(--green-light); }
  `;
  const css = stage => { MG.css(stage); if (!stage.querySelector('style[data-mgd]')) { const s = K.el('style', null, CSS); s.dataset.mgd = '1'; stage.appendChild(s); } };
  const flow = n => { n.style.position = 'relative'; n.style.left = n.style.top = ''; return n; };
  const chipRow = (stage, x, y, items, size = 30) => {
    const row = put(stage, K.el('div', 'mgd-row'), x, y);
    const els = items.map(it => {
      if (it === '>') { const a = K.iconBadge(row, 'arrow-right', { size: 46 }); a.style.position = 'relative'; a.style.left = a.style.top = ''; return a; }
      return flow(TM.word(row, it[0], { variant: it[1], icon: it[2], size, cross: it[3] }));
    });
    return { row, els };
  };
  const mistake = (ctx, o) => { css(ctx.stage); return MG.mistake(ctx, o); };
  // the How to avoid it card, sitting on the bottom of the content area
  const avoid = (ctx, m, text, beat = 3) => {
    const c = MG.avoid(ctx, { x: m.X, y: 0, w: m.W, text, t: ctx.cue(beat) + 0.05, size: 31 });
    c.style.top = (948 - c.offsetHeight) + 'px';
    return c;
  };

  const PICS = [['mg_mistake1.jpg', [1050, 1400], 'Picking and choosing'], ['mg_mistake2.jpg', [933, 1400], 'Missing subtle triggers'], ['mg_mistake3.jpg', [1050, 1400], 'Relaxing too soon'],
    ['mg_mistake4.jpg', [1050, 1400], 'Seeing it as punishment'], ['mg_mistake5.jpg', [1400, 1050], 'Feeding after the reaction']];

  // ---------------------------------------------------------------- five common mistakes
  registerScene('mg04s00', ctx => {
    const { stage, tl, cue, end } = ctx;
    css(stage);
    TM.head(ctx, 'Even with the best intentions', 'Five common mistakes');
    const lead = put(stage, K.el('div', 'mg-lead', 'Even with the best intentions, <b>it’s easy to slip</b>.'), 100, 290, { width: '1700px' });
    A.in(tl, lead, cue(0) + 0.2, 'fadeUp', { dur: 0.6 });
    const H = 360, GAP = 34;
    const ws = PICS.map(([, [nw, nh]]) => Math.round(H * nw / nh));
    let x = (1920 - ws.reduce((a, b) => a + b, 0) - GAP * 4) / 2;
    const t1 = at(ctx, 1, 'five common mistakes', 0.3);
    PICS.forEach(([src, nat, lab], i) => {
      const ph = TM.pic(stage, src, { x, y: 400, w: ws[i], h: H, nat, radius: 18, border: 6 });
      const n = put(stage, K.el('div', 'mgd-n', String(i + 1)), x + 14, 386);
      const l = put(stage, K.el('div', 'mg-plab', lab), x - 10, 790, { width: ws[i] + 20 + 'px' });
      const t = t1 + 0.35 * i;
      tl.fromTo(ph.wrap, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, t);
      A.in(tl, n, t + 0.3, 'pop', { dur: 0.4 });
      A.in(tl, l, t + 0.35, 'fadeUp', { dur: 0.5 });
      x += ws[i] + GAP;
    });
    const sub = put(stage, K.el('div', 'mgd-txt', 'Each one quietly <b>weakens the foundation</b> you’re trying to build.'), 100, 880, { width: '1720px', textAlign: 'center' });
    A.in(tl, sub, at(ctx, 1, 'quietly weakens', 0.75), 'fadeUp', { dur: 0.6 });
  });

  // ---------------------------------------------------------------- 1: picking and choosing
  registerScene('mg04s01', ctx => {
    const { stage, tl, cue } = ctx;
    const m = mistake(ctx, { n: 1, title: 'Picking and choosing which parts to follow', src: 'mg_mistake1.jpg', nat: [1050, 1400] });
    const q = put(stage, K.el('div', 'mgd-q', `${K.icon('quote').outerHTML}“I’ll manage not seeing other dogs, but I don’t need to worry about the barking.”`), m.X, m.top, { width: m.W + 'px' });
    tl.fromTo(q, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, cue(1) + 0.05);
    const y2 = m.top + q.offsetHeight + 24;
    const { els } = chipRow(stage, m.X, y2, [['Other dogs: managed', 'green', 'check'], ['The barking: skipped', 'red', 'x']]);
    A.in(tl, els[0], at(ctx, 2, 'cherry-pick', 0.2), 'pop', { dur: 0.4 });
    A.in(tl, els[1], at(ctx, 2, 'cherry-pick', 0.2) + 0.5, 'pop', { dur: 0.4 });
    const g = put(stage, K.el('div', 'mgd-txt red', 'Skipped parts leave <b>gaps</b> where unwanted behavior gets practiced.'), m.X, y2 + 84, { width: m.W + 'px' });
    A.in(tl, g, at(ctx, 2, 'parts you skip', 0.6), 'fadeUp', { dur: 0.6 });
    avoid(ctx, m, 'Commit to *the entire plan*, even the parts that seem minor. Something doesn’t fit your lifestyle? *Reach out* for an alternative.');
  });

  // ---------------------------------------------------------------- 2: underestimating the environment
  registerScene('mg04s02', ctx => {
    const { stage, tl, cue } = ctx;
    const m = mistake(ctx, { n: 2, title: 'Underestimating the environment', src: 'mg_mistake2.jpg', nat: [933, 1400] });
    const lead = put(stage, K.el('div', 'mgd-txt', 'The obvious triggers get managed. <b>The subtle ones get missed:</b>'), m.X, m.top, { width: m.W + 'px' });
    const t1 = cue(1) + 0.05;
    A.in(tl, lead, t1, 'fadeUp', { dur: 0.6 });
    const { els } = chipRow(stage, m.X, m.top + 66, [['Outside sounds', 'amber', 'volume-2'], ['Shadows at a window', 'amber', 'app-window'], ['Routine changes', 'amber', 'calendar-clock']], 26);
    els[0].parentNode.style.width = m.W + 'px';
    [['sounds', 0], ['shadows', 1], ['routine', 2]].forEach(([p, i]) => A.in(tl, els[i], at(ctx, 1, p, 0.4 + 0.2 * i), 'pop', { dur: 0.4 }));
    // on the picture: the hound looks off to the side, at something we can't see
    const { ph } = m;
    TM.fx.dots(tl, ph.sv, [ph.P(0.58, 0.31), ph.P(0.96, 0.27)], at(ctx, 1, 'sounds', 0.4), { color: '#fff', stroke: '#d9912b', r: 5, gap: 18, dur: 0.6, hold: 3.5 });
    TM.fx.ring(tl, ph.sv, ph.P(0.93, 0.27), at(ctx, 1, 'sounds', 0.4) + 0.6, { r: 26, n: 2, color: 'var(--amber)' });
    // they add up: the stress bucket fills
    const y3 = m.top + 66 + els[0].parentNode.offsetHeight + 34;
    const lab = put(stage, K.el('div', 'mgd-txt red', 'They keep <b>filling the stress bucket</b> and sabotage progress.'), m.X, y3, { width: m.W + 'px' });
    const mt = put(stage, K.el('div', 'mgd-meter'), m.X, y3 + lab.offsetHeight + 20, { width: m.W + 'px' });
    const fill = K.el('i'); mt.appendChild(fill);
    const t2 = cue(2) + 0.05;
    A.in(tl, [lab, mt], t2, 'fadeUp', { dur: 0.6, stagger: 0.15 });
    tl.set(fill, { scaleX: 0.08 }, 0);
    els.forEach((e, i) => { A.pulse(tl, e, t2 + 0.6 + 0.45 * i, { scale: 1.08 }); tl.to(fill, { scaleX: 0.08 + 0.28 * (i + 1), duration: 0.45, ease: 'power2.out' }, t2 + 0.6 + 0.45 * i); });
    avoid(ctx, m, 'Watch what makes your dog *alert, tense, or reactive*. Keep a log: the more thorough you are, *the more complete your plan*.');
  });

  // ---------------------------------------------------------------- 3: relaxing management too soon
  registerScene('mg04s03', ctx => {
    const { stage, tl, cue } = ctx;
    const m = mistake(ctx, { n: 3, title: 'Relaxing management too soon', src: 'mg_mistake3.jpg', nat: [1050, 1400] });
    const lead = put(stage, K.el('div', 'mgd-txt', 'A little improvement, and it’s easy to think <b>the problem is solved</b>.'), m.X, m.top, { width: m.W + 'px' });
    A.in(tl, lead, cue(1) + 0.05, 'fadeUp', { dur: 0.6 });
    const BW = m.W - 300, y1 = m.top + 100;
    const l1 = put(stage, K.el('div', 'mgd-blab', 'Old reaction'), m.X, y1 + 12);
    const b1 = put(stage, K.el('div', 'mgd-bar old', 'Well worn'), m.X + 300, y1, { width: BW + 'px' });
    const l2 = put(stage, K.el('div', 'mgd-blab', 'New response'), m.X, y1 + 82);
    const b2 = put(stage, K.el('div', 'mgd-bar new', 'Not solid yet'), m.X + 300, y1 + 70, { width: Math.round(BW * 0.42) + 'px' });
    const tA = at(ctx, 1, 'new responses', 0.6);
    A.in(tl, [l1, l2], tA - 0.2, 'fadeRight', { dur: 0.5, stagger: 0.12 });
    tl.fromTo(b1, { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'power2.out' }, tA);
    tl.fromTo(b2, { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'power2.out' }, tA + 0.2);
    // the dog reverts: the old pathway wins
    const r = put(stage, K.el('div', 'mgd-txt red', 'In the real world, the dog reverts: <b>the old pathway is still stronger</b>.'), m.X, y1 + 170, { width: m.W + 'px' });
    const tB = cue(2) + 0.05;
    A.in(tl, r, tB, 'fadeUp', { dur: 0.6 });
    A.pulse(tl, b1, tB + 0.6, { scale: 1.04 });
    tl.to([b2, l2], { opacity: 0.55, duration: 0.5 }, tB + 0.6);
    tl.to([b2, l2], { opacity: 1, duration: 0.5 }, cue(3));
    // on the picture: the dog is still on the line
    TM.fx.ring(tl, m.ph.sv, m.ph.P(0.22, 0.75), at(ctx, 3, 'reduce management', 0.4), { r: 34, n: 2 });
    TM.fx.tag(tl, m.ph.wrap, 'Management still on', Math.round(m.w * 0.05), Math.round(m.h * 0.84), at(ctx, 3, 'reduce management', 0.4) + 0.4, 'green').style.fontSize = '26px';
    avoid(ctx, m, 'Be patient and trust the process. Reduce management *gradually*, based on your dog’s *consistent success*, not your own impatience.');
  });

  // ---------------------------------------------------------------- 4: viewing management as punishment
  registerScene('mg04s04', ctx => {
    const { stage, tl, cue } = ctx;
    const m = mistake(ctx, { n: 4, title: 'Viewing management as punishment', src: 'mg_mistake4.jpg', nat: [1050, 1400] });
    const lead = put(stage, K.el('div', 'mgd-txt'), m.X, m.top, { width: m.W + 'px' });
    lead.innerHTML = 'Feeling guilty, as if you’re depriving your dog of <b>freedom or fun</b>? That mindset makes the plan <b style="color:var(--red)">hard to stick to</b>.';
    A.in(tl, lead, cue(1) + 0.05, 'fadeUp', { dur: 0.6 });
    const y2 = m.top + lead.offsetHeight + 40;
    const { els } = chipRow(stage, m.X, y2, [['Punishment', 'red', null, true], '>', ['Protection', 'green', 'shield-check']], 36);
    const tP = at(ctx, 2, 'isn’t punishment', 0.4);
    A.in(tl, els[0], tP, 'pop', { dur: 0.4 });
    TM.strike(tl, els[0], tP + 0.4);
    A.in(tl, [els[1], els[2]], at(ctx, 2, 'protection', 0.55), 'pop', { dur: 0.4, stagger: 0.15 });
    const sub = put(stage, K.el('div', 'mgd-txt'), m.X, y2 + 100, { width: m.W + 'px' });
    sub.innerHTML = 'From stress, and from rehearsing behaviors that <b>make life harder</b>.';
    A.in(tl, sub, at(ctx, 2, 'from stress', 0.7), 'fadeUp', { dur: 0.6 });
    // on the picture: the fence and gate keep the dog safe
    TM.fx.ring(tl, m.ph.sv, m.ph.P(0.55, 0.29), at(ctx, 2, 'protection', 0.55) + 0.3, { r: 70, n: 2 });
    TM.fx.tag(tl, m.ph.wrap, 'Protection', Math.round(m.w * 0.36), Math.round(m.h * 0.06), at(ctx, 2, 'protection', 0.55) + 0.6, 'green').style.fontSize = '26px';
    avoid(ctx, m, 'Reframe your thinking. Management is *a gift*: a chance to feel safe, learn new skills, and build a better future. *Temporary, and essential.*');
  });

  // ---------------------------------------------------------------- 5: feeding after the reaction has started
  registerScene('mg04s05', ctx => {
    const { stage, tl, cue } = ctx;
    const m = mistake(ctx, { n: 5, title: 'Feeding after the reaction has started', src: 'mg_mistake5.jpg', nat: [1400, 1050], maxW: 600 });
    const bad = chipRow(stage, m.X, m.top + 6, [['Trigger appears', 'amber', 'zap'], '>', ['Bark', 'red', 'megaphone'], '>', ['Treats', 'red', 'cookie']], 30);
    const t1 = cue(1) + 0.05;
    A.in(tl, bad.els[0], at(ctx, 1, 'trigger appears', 0.3), 'pop', { dur: 0.4 });
    A.in(tl, [bad.els[1], bad.els[2]], at(ctx, 1, 'your dog barks', 0.6), 'pop', { dur: 0.4, stagger: 0.12 });
    A.in(tl, [bad.els[3], bad.els[4]], at(ctx, 1, 'hand over treats', 0.8), 'pop', { dur: 0.4, stagger: 0.12 });
    TM.fx.ring(tl, m.ph.sv, m.ph.P(0.595, 0.40), at(ctx, 1, 'your dog barks', 0.6), { r: 30, n: 2, color: 'var(--red)' });
    const pays = put(stage, K.el('div', 'mgd-txt red', 'Food after the bark or lunge <b>pays for the reaction</b>, not the calm.'), m.X, m.top + 96, { width: m.W + 'px' });
    A.in(tl, pays, cue(2) + 0.05, 'fadeUp', { dur: 0.6 });
    // the fix: before the reaction
    const t3 = cue(3) + 0.05;
    tl.to([bad.row, pays], { opacity: 0.45, duration: 0.5 }, t3);
    const good = chipRow(stage, m.X, m.top + 96 + pays.offsetHeight + 34, [['Trigger appears', 'amber', 'zap'], '>', ['Calmly notices', 'green', 'eye'], '>', ['Treats', 'green', 'cookie']], 30);
    A.in(tl, good.els, at(ctx, 3, 'feed for calmly', 0.75), 'fadeRight', { dur: 0.4, stagger: 0.12 });
    avoid(ctx, m, 'Stay a step ahead: *cover the window, scan the yard first*. Feed for calmly noticing a trigger, *before the reaction*.');
  });

  // ---------------------------------------------------------------- the close: management is the foundation
  registerScene('mg04s06', ctx => {
    const { stage, tl, cue, end } = ctx;
    css(stage);
    const hd = TM.head(ctx, 'Building block', 'Management is the foundation');
    const NAT = [1268, 1052];
    const { w, h } = MG.fit(NAT, 640, 540);
    const ph = TM.pic(stage, 'mg_house_clean.png', { x: 100, y: 330, w, h, nat: NAT, radius: 0, border: 0 });
    ph.root.style.background = 'transparent';
    ph.root.style.boxShadow = 'none';
    tl.fromTo(ph.wrap, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, 0.35);
    const tag = TM.fx.tag(tl, ph.wrap, 'Management', Math.round(w * 0.06), Math.round(h * 0.875), 1.0, 'green');
    tag.style.fontSize = '28px';
    const X = 100 + w + 80, W = 1820 - X;
    const col = put(stage, K.el('div', 'tm-col'), X, 330, { width: W + 'px', gap: '30px' });
    [['Keep your dog *under threshold*, so old reactions aren’t practiced and *training can build something new*.', 0, 'under threshold'],
      ['Follow it *100% of the time*, with *everyone* in your dog’s life.', 1, 'one hundred percent']].forEach(([t, b, p], i) => {
      const r = TM.row(col, null, t, { num: i + 1, size: 32 });
      A.in(tl, r, at(ctx, b, p, 0.1), 'fadeRight', { dur: 0.6 });
    });
    const st = put(stage, K.el('div', 'mgd-statement'), X, 0, { width: W + 'px' });
    st.innerHTML = '<span class="k">Building block</span>Management is the foundation. <b>Everything else falls apart without it.</b>';
    st.style.top = (330 + h - st.offsetHeight) + 'px';
    tl.fromTo(st, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, cue(2) + 0.05);
    A.pulse(tl, tag, at(ctx, 2, 'foundation', 0.3), { scale: 1.12 });
    SKIT.logoClose(ctx, end(2) + 0.6, [ph.wrap, ...hd.all, col, st]);
  });
})();
