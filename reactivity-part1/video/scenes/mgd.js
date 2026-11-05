// Management: The Basics, Part 4 (five common mistakes) and the close.
//   mg04s00  five common mistakes: Tori's five pictures in a row, whole, numbered (an intro, so no labels yet)
//   mg04s01  picking and choosing: the owner's quote; skipped parts leave gaps; how to avoid it
//   mg04s02  missing subtle triggers: the hound's gaze off to the side; three subtle triggers; the stress bucket fills
//   mg04s03  relaxing too soon: Tori's brain picture again, the new pathway faint, the old one red; the line still on
//   mg04s04  seeing it as punishment: Punishment struck out, Protection
//   mg04s05  feeding too late: Trigger, Bark, Treats (red) vs Trigger, Calmly notices, Treats (green)
//   mg04s06  bringing it together: the level house on its foundation; two takeaways and the closing statement; logo close
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
  const mistake = (ctx, o) => { css(ctx.stage); return MG.mistake(ctx, o); };
  // the How to avoid it card, sitting on the bottom of the content area
  const avoid = (ctx, m, text, beat = 3) => {
    const c = MG.avoid(ctx, { x: m.X, y: 0, w: m.W, text, t: ctx.cue(beat) + 0.05, size: 31 });
    c.style.top = (948 - c.offsetHeight) + 'px';
    return c;
  };

  // a row of chips (with arrows) inside a mistake slide's content column
  const rowIn = (col, items, size = 30) => {
    const row = K.el('div', 'mgd-row');
    Object.assign(row.style, { position: 'relative', left: 'auto', top: 'auto' });
    col.appendChild(row);
    const els = items.map(it => {
      if (it === '>') { const a = K.iconBadge(row, 'arrow-right', { size: 46 }); a.style.position = 'relative'; a.style.left = a.style.top = ''; return a; }
      return flow(TM.word(row, it[0], { variant: it[1], icon: it[2], size, cross: it[3] }));
    });
    return { row, els };
  };
  const txtIn = (col, html, cls = '') => { const n = K.el('div', 'mgd-txt' + (cls ? ' ' + cls : ''), html); Object.assign(n.style, { position: 'relative', width: '100%' }); col.appendChild(n); return n; };

  const PICS = [['mg_mistake1.jpg', [1050, 1400]], ['mg_mistake2.jpg', [933, 1400]], ['mg_mistake3.jpg', [1050, 1400]], ['mg_mistake4.jpg', [1050, 1400]], ['mg_mistake5.jpg', [1400, 1050]]];

  // ---------------------------------------------------------------- five common mistakes (the intro: numbered pictures, no labels yet)
  registerScene('mg04s00', ctx => {
    const { stage, tl, cue, end } = ctx;
    css(stage);
    TM.head(ctx, 'Even with the best intentions', 'Five common mistakes');
    const lead = put(stage, K.el('div', 'mg-lead', 'Even with the best intentions, <b>it’s easy to slip</b>.'), 100, 290, { width: '1700px' });
    A.in(tl, lead, cue(0) + 0.2, 'fadeUp', { dur: 0.6 });
    const H = 380, GAP = 26;
    const ws = PICS.map(([, [nw, nh]]) => Math.round(H * nw / nh));
    let x = (1920 - ws.reduce((a, b) => a + b, 0) - GAP * 4) / 2;
    const t1 = at(ctx, 1, 'five common mistakes', 0.3);
    PICS.forEach(([src, nat], i) => {
      const ph = TM.pic(stage, src, { x, y: 400, w: ws[i], h: H, nat, radius: 18, border: 6 });
      const n = put(stage, K.el('div', 'mgd-n', String(i + 1)), x + 14, 386);
      const t = t1 + 0.35 * i;
      tl.fromTo(ph.wrap, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, t);
      A.in(tl, n, t + 0.3, 'pop', { dur: 0.4 });
      x += ws[i] + GAP;
    });
    const sub = put(stage, K.el('div', 'mgd-txt', 'What to watch for, and <b>how to avoid each one</b>.'), 100, 846, { width: '1720px', textAlign: 'center' });
    A.in(tl, sub, at(ctx, 1, 'how to avoid', 0.75), 'fadeUp', { dur: 0.6 });
  });

  // ---------------------------------------------------------------- 1: picking and choosing
  registerScene('mg04s01', ctx => {
    const { stage, tl, cue } = ctx;
    const m = mistake(ctx, { n: 1, title: 'Picking and choosing', src: 'mg_mistake1.jpg', nat: [1050, 1400] });
    const q = K.el('div', 'mgd-q', `${K.icon('quote').outerHTML}“I’ll manage not seeing other dogs, but I don’t need to worry about the barking.”`);
    Object.assign(q.style, { position: 'relative', width: '100%' });
    m.col.appendChild(q);
    tl.fromTo(q, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, cue(1) + 0.05);
    const g = txtIn(m.col, 'Skipped parts leave <b>gaps</b> where unwanted behavior gets practiced.', 'red');
    A.in(tl, g, at(ctx, 2, 'parts you skip', 0.6), 'fadeUp', { dur: 0.6 });
    avoid(ctx, m, 'Commit to *the entire plan*, even the parts that seem minor. Something doesn’t fit your lifestyle? *Reach out* for an alternative.');
  });

  // ---------------------------------------------------------------- 2: missing subtle triggers
  registerScene('mg04s02', ctx => {
    const { stage, tl, cue } = ctx;
    const m = mistake(ctx, { n: 2, title: 'Missing subtle triggers', src: 'mg_mistake2.jpg', nat: [933, 1400] });
    const lead = txtIn(m.col, 'The obvious triggers get managed. <b>The subtle ones get missed:</b>');
    A.in(tl, lead, cue(1) + 0.05, 'fadeUp', { dur: 0.6 });
    const { row, els } = rowIn(m.col, [['Outside sounds', 'amber', 'volume-2'], ['Shadows at a window', 'amber', 'app-window'], ['Routine changes', 'amber', 'calendar-clock']], 26);
    [['sounds', 0], ['shadows', 1], ['routine', 2]].forEach(([p, i]) => A.in(tl, els[i], at(ctx, 1, p, 0.4 + 0.2 * i), 'pop', { dur: 0.4 }));
    // on the picture: the hound looks off to the side, at something we can't see
    const { ph } = m;
    TM.fx.dots(tl, ph.sv, [ph.P(0.58, 0.31), ph.P(0.96, 0.27)], at(ctx, 1, 'sounds', 0.4), { color: '#fff', stroke: '#d9912b', r: 5, gap: 18, dur: 0.6, hold: 3.5 });
    // they add up: the stress bucket fills
    const box = K.el('div');
    Object.assign(box.style, { position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', gap: '18px' });
    m.col.appendChild(box);
    const lab = txtIn(box, 'They keep <b>filling the stress bucket</b> and sabotage progress.', 'red');
    const mt = K.el('div', 'mgd-meter'); Object.assign(mt.style, { position: 'relative', width: '100%' }); box.appendChild(mt);
    const fill = K.el('i'); mt.appendChild(fill);
    const t2 = cue(2) + 0.05;
    A.in(tl, [lab, mt], t2, 'fadeUp', { dur: 0.6, stagger: 0.15 });
    tl.set(fill, { scaleX: 0.08 }, 0);
    els.forEach((e, i) => { A.pulse(tl, e, t2 + 0.6 + 0.45 * i, { scale: 1.08 }); tl.to(fill, { scaleX: 0.08 + 0.28 * (i + 1), duration: 0.45, ease: 'power2.out' }, t2 + 0.6 + 0.45 * i); });
    avoid(ctx, m, 'Watch what makes your dog *alert, tense, or reactive*. Keep a log: the more thorough you are, *the more complete your plan*.');
  });

  // ---------------------------------------------------------------- 3: relaxing too soon (back to the brain: the new pathway isn't solid yet)
  registerScene('mg04s03', ctx => {
    const { stage, tl, cue } = ctx;
    const m = mistake(ctx, { n: 3, title: 'Relaxing too soon', src: 'mg_mistake3.jpg', nat: [1050, 1400] });
    const NAT = [682, 788], BH = 330, BW = Math.round(BH * NAT[0] / NAT[1]);
    const row = K.el('div');
    Object.assign(row.style, { position: 'relative', display: 'flex', alignItems: 'center', gap: '44px' });
    m.col.appendChild(row);
    const hold = K.el('div'); Object.assign(hold.style, { position: 'relative', width: BW + 'px', height: BH + 'px', flex: '0 0 auto' }); row.appendChild(hold);
    const br = TM.pic(hold, 'mg_brain.png', { x: 0, y: 0, w: BW, h: BH, nat: NAT, radius: 0, border: 0 });
    br.root.style.background = 'transparent';
    br.root.style.boxShadow = 'none';
    const F = (x, y) => br.P(x / NAT[0], y / NAT[1]);
    const OLD = [[318, 295], [218, 352], [160, 460], [145, 570]].map(p => F(...p));
    const NEW = [[330, 283], [440, 352], [500, 460], [533, 568]].map(p => F(...p));
    const tA = cue(1) + 0.05;
    tl.fromTo(br.wrap, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' }, tA);
    // the new pathway is only partly there: a soft wash over its far end and the check, a thin dashed line in its place
    const fog = K.group(br.sv);
    NEW.slice(1).forEach(p => K.circle(fog, p[0], p[1], 20, { fill: '#e3ecd6', stroke: 'none' }));
    K.circle(fog, ...F(533, 568), 30, { fill: '#e3ecd6', stroke: 'none' });
    K.path(fog, 'M ' + NEW.map(p => p.join(' ')).join(' L '), { fill: 'none', stroke: '#e3ecd6', 'stroke-width': 16, 'stroke-linecap': 'round' });
    tl.set(fog, { opacity: 0.88 }, 0);
    const thin = K.path(br.sv, 'M ' + NEW.slice(0, 3).map(p => p.join(' ')).join(' L '), { fill: 'none', stroke: '#619537', 'stroke-width': 4, 'stroke-dasharray': '6 8', 'stroke-linecap': 'round' });
    const col2 = K.el('div'); Object.assign(col2.style, { position: 'relative', display: 'flex', flexDirection: 'column', gap: '20px' }); row.appendChild(col2);
    const cNew = flow(TM.word(col2, 'New pathway: not solid yet', { variant: 'pale', icon: 'arrow-up', size: 28 }));
    const cOld = flow(TM.word(col2, 'Old pathway: still stronger', { variant: 'red', icon: 'arrow-down', size: 28 }));
    const tN = at(ctx, 1, 'isn’t solid yet', 0.75);
    A.draw(tl, thin, tN - 0.2, 0.8);
    A.in(tl, cNew, tN, 'fadeRight', { dur: 0.5 });
    // the old pathway lights up red: it's still the stronger route
    const tO = at(ctx, 2, 'old pathway', 0.6);
    const old = K.path(br.sv, 'M ' + OLD.map(p => p.join(' ')).join(' L '), { fill: 'none', stroke: '#b8452d', 'stroke-width': 10, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
    A.draw(tl, old, tO - 0.2, 0.9);
    A.in(tl, cOld, tO, 'fadeRight', { dur: 0.5 });
    // on the picture: the dog is still on the line
    TM.fx.tag(tl, m.ph.wrap, 'Management still on', Math.round(m.w * 0.05), Math.round(m.h * 0.84), at(ctx, 3, 'reduce management', 0.4), 'green').style.fontSize = '26px';
    avoid(ctx, m, 'Be patient. Reduce management *gradually*, based on your dog’s *consistent success*, not your own timeline.');
  });

  // ---------------------------------------------------------------- 4: seeing it as punishment
  registerScene('mg04s04', ctx => {
    const { stage, tl, cue } = ctx;
    const m = mistake(ctx, { n: 4, title: 'Seeing it as punishment', src: 'mg_mistake4.jpg', nat: [1050, 1400] });
    const lead = txtIn(m.col, 'Feeling guilty, as if you’re depriving your dog of <b>freedom or fun</b>? That mindset makes the plan <b style="color:var(--red)">hard to stick to</b>.');
    A.in(tl, lead, cue(1) + 0.05, 'fadeUp', { dur: 0.6 });
    const { els } = rowIn(m.col, [['Punishment', 'red', null, true], '>', ['Protection', 'green', 'shield-check']], 36);
    const tP = at(ctx, 2, 'isn’t punishment', 0.4);
    A.in(tl, els[0], tP, 'pop', { dur: 0.4 });
    TM.strike(tl, els[0], tP + 0.4);
    A.in(tl, [els[1], els[2]], at(ctx, 2, 'protection', 0.55), 'pop', { dur: 0.4, stagger: 0.15 });
    const sub = txtIn(m.col, 'From stress, and from rehearsing behaviors that <b>make life harder</b>.');
    A.in(tl, sub, at(ctx, 2, 'from stress', 0.7), 'fadeUp', { dur: 0.6 });
    avoid(ctx, m, 'Reframe your thinking. Management is *a gift*: a chance to feel safe, learn new skills, and build a better future. *Temporary, and essential.*');
  });

  // ---------------------------------------------------------------- 5: feeding too late
  registerScene('mg04s05', ctx => {
    const { stage, tl, cue } = ctx;
    const m = mistake(ctx, { n: 5, title: 'Feeding too late', src: 'mg_mistake5.jpg', nat: [1400, 1050], maxW: 560 });
    const bad = rowIn(m.col, [['Trigger appears', 'amber', 'zap'], '>', ['Bark', 'red', 'megaphone'], '>', ['Treats', 'red', 'cookie']], 28);
    A.in(tl, bad.els[0], at(ctx, 1, 'trigger appears', 0.3), 'pop', { dur: 0.4 });
    A.in(tl, [bad.els[1], bad.els[2]], at(ctx, 1, 'your dog barks', 0.6), 'pop', { dur: 0.4, stagger: 0.12 });
    A.in(tl, [bad.els[3], bad.els[4]], at(ctx, 1, 'hand over treats', 0.8), 'pop', { dur: 0.4, stagger: 0.12 });
    TM.fx.ring(tl, m.ph.sv, m.ph.P(0.595, 0.40), at(ctx, 1, 'your dog barks', 0.6), { r: 30, n: 2, color: 'var(--red)' });
    const pays = txtIn(m.col, 'Food after the bark or lunge <b>pays for the reaction</b>, not the calm.', 'red');
    A.in(tl, pays, cue(2) + 0.05, 'fadeUp', { dur: 0.6 });
    // the fix: before the reaction
    const t3 = cue(3) + 0.05;
    tl.to([bad.row, pays], { opacity: 0.45, duration: 0.5 }, t3);
    const good = rowIn(m.col, [['Trigger appears', 'amber', 'zap'], '>', ['Calmly notices', 'green', 'eye'], '>', ['Treats', 'green', 'cookie']], 28);
    A.in(tl, good.els, at(ctx, 3, 'feed for calmly', 0.75), 'fadeRight', { dur: 0.4, stagger: 0.12 });
    avoid(ctx, m, 'Stay a step ahead: *cover the window, scan the yard first*. Feed for calmly noticing a trigger, *before the reaction*.');
  });

  // ---------------------------------------------------------------- the close: management is the foundation
  registerScene('mg04s06', ctx => {
    const { stage, tl, cue, end } = ctx;
    css(stage);
    const hd = TM.head(ctx, 'Building block', 'Bringing it together');
    const NAT = [1268, 1052];
    const { w, h } = MG.fit(NAT, 640, 540);
    const ph = TM.pic(stage, 'mg_house_level.png', { x: 100, y: 330, w, h, nat: NAT, radius: 0, border: 0 });
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
