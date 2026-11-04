// Management: The Basics, Part 3 (the golden rule), second half.
//   mg03s05  "Just this once won't hurt." But it does: Tori's house picture (crack removed) builds floor by floor; a crack runs up from the foundation
//   mg03s06  exposure alone doesn't fade reactivity: The myth / What actually happens; a loop (trigger, bark and lunge, it goes away) that grows stronger
//   mg03s07  calm isn't the same as cured: Looks like progress / The truth; Trigger shows up, good things happen, over and over
(() => {
  const { at, put, clamp } = TM;
  const CSS = `
  .mgc-loop { position: absolute; display: flex; align-items: center; gap: 16px; }
  .mgc-loop .tm-word { position: relative; left: auto; top: auto; }
  .mgc-meter { position: absolute; height: 26px; border-radius: 13px; background: #f1e6e2; overflow: hidden; }
  .mgc-meter i { position: absolute; left: 0; top: 0; bottom: 0; width: 100%; background: var(--red); transform-origin: left center; border-radius: 13px; }
  .mgc-mlab { position: absolute; font: 700 28px/1 var(--font-body); color: var(--red); white-space: nowrap; }
  .mgc-quote { font: 600 32px/1.38 var(--font-body); color: var(--ink); font-style: italic; }
  `;
  const css = stage => { MG.css(stage); if (!stage.querySelector('style[data-mgc]')) { const s = K.el('style', null, CSS); s.dataset.mgc = '1'; stage.appendChild(s); } };
  const flow = n => { n.style.position = 'relative'; n.style.left = n.style.top = ''; return n; };

  // the crack in Tori's original picture (mg_house.png, same size and place as the clean copy), drawn back in as it "runs"
  const NAT = [1268, 1052];
  const CRACK = [[656, 1020], [622, 988], [668, 958], [610, 935], [636, 887], [598, 840], [648, 790], [596, 720], [640, 652], [598, 585], [645, 510], [600, 445]];
  const BRANCH = [[[598, 585], [528, 574]], [[640, 652], [720, 622]], [[596, 720], [531, 712]], [[648, 790], [718, 756]]];

  // ---------------------------------------------------------------- just this once won't hurt
  registerScene('mg03s05', ctx => {
    const { stage, tl, cue, end } = ctx;
    css(stage);
    TM.head(ctx, 'Inconsistency is the enemy', '“Just this once won’t hurt.” But it does.');
    const { w, h } = MG.fit(NAT, 760, 620);
    const ph = TM.pic(stage, 'mg_house_clean.png', { x: 100, y: 310, w, h, nat: NAT, radius: 0, border: 0 });
    ph.root.style.background = 'transparent';
    ph.root.style.boxShadow = 'none';
    ph.wrap.style.transformOrigin = '50% 92%';
    const F = (x, y) => ph.P(x / NAT[0], y / NAT[1]);
    // built floor by floor: the foundation first, then each floor, then the roof
    const tB = cue(0) + 0.3, tF = at(ctx, 1, 'floor by floor', 0.2);
    tl.set(ph.root, { clipPath: 'inset(100% 0% 0% 0%)' }, 0);
    tl.to(ph.root, { clipPath: 'inset(84% 0% 0% 0%)', duration: 0.6, ease: 'power2.out' }, tB);
    [64, 41, 20, 0].forEach((p, i) => tl.to(ph.root, { clipPath: `inset(${p}% 0% 0% 0%)`, duration: 0.5, ease: 'power2.out' }, tF + 0.45 * i));

    const X = 100 + w + 80, W = 1820 - X;
    const lead = put(stage, K.el('div', 'mg-lead', 'Picture a house built <b>floor by floor</b>. The rooms can be flawless...'), X, 330, { width: W + 'px', fontSize: '38px' });
    A.in(tl, lead, tF, 'fadeUp', { dur: 0.6 });
    const l2 = put(stage, K.el('div', 'mg-lead', '...but a crack in the foundation and the whole structure <b style="color:var(--red)">shifts, splits, and comes down</b>.'), X, 470, { width: W + 'px', fontSize: '38px' });
    const tC = at(ctx, 1, 'has a crack', 0.5);
    A.in(tl, l2, tC, 'fadeUp', { dur: 0.6 });

    // the crack: a short split in the foundation first, then it runs up through the house
    const crack = K.path(ph.sv, 'M ' + CRACK.map(p => F(...p).join(' ')).join(' L '), { fill: 'none', stroke: '#c4491f', 'stroke-width': Math.max(5, w * 0.009), 'stroke-linejoin': 'round', 'stroke-linecap': 'round' });
    const tR = at(ctx, 2, 'another crack', 0.5);
    tl.fromTo(crack, { drawSVG: '0%' }, { drawSVG: '0% 22%', duration: 0.7, ease: 'power2.out' }, tC + 0.3);
    tl.to(crack, { drawSVG: '0% 100%', duration: 1.3, ease: 'power2.inOut' }, tR);
    BRANCH.forEach(([a, b], k) => {
      const br = K.path(ph.sv, `M ${F(...a).join(' ')} L ${F(...b).join(' ')}`, { fill: 'none', stroke: '#c4491f', 'stroke-width': Math.max(3, w * 0.006), 'stroke-linecap': 'round' });
      A.draw(tl, br, tR + 0.9 - 0.18 * k, 0.4);
    });
    // the house shifts on its cracked foundation
    tl.to(ph.wrap, { rotation: 2.2, x: 6, duration: 1.2, ease: 'power2.inOut' }, tR + 1.3);
    // Management is that foundation
    const tag = TM.fx.tag(tl, ph.wrap, 'Management', Math.round(w * 0.06), Math.round(h * 0.875), at(ctx, 2, 'management is that foundation', 0.1), 'green');
    tag.style.fontSize = '28px';
    const tag2 = TM.fx.tag(tl, ph.wrap, 'Just this once', Math.round(w * 0.6), Math.round(h * 0.875), tR + 0.2, 'red');
    tag2.style.fontSize = '28px';
    tag2.style.background = '#fff';
    tl.to([lead, l2], { opacity: 0.5, duration: 0.5 }, cue(2));
    const l3 = put(stage, K.el('div', 'mg-lead', 'Every rehearsal of an unwanted behavior <b style="color:var(--red)">is another crack</b>, and the work on top starts to fall.'), X, 610, { width: W + 'px', fontSize: '38px' });
    A.in(tl, l3, tR, 'fadeUp', { dur: 0.6 });
    const call = MG.callout(stage, 'A cracked foundation brings <b>the whole house down</b>.', { x: X, y: 800, w: W, variant: 'red', size: 36 });
    tl.fromTo(call, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, cue(3) + 0.05);
    tl.to(l3, { opacity: 0.5, duration: 0.5 }, cue(3));
  });

  // ---------------------------------------------------------------- exposure alone doesn't fade reactivity
  registerScene('mg03s06', ctx => {
    const { stage, tl, cue, end } = ctx;
    css(stage);
    TM.head(ctx, 'A dangerous myth', 'Exposure alone doesn’t fade reactivity');
    const myth = MG.card(stage, { x: 100, y: 300, w: 840, h: 330, variant: 'red', label: 'The myth', icon: 'circle-x' });
    myth.appendChild(K.el('div', 'mgc-quote', '“Let him see the trigger enough times and he’ll learn: it’s fine, nothing bad happened, I’ll get over it.”'));
    tl.fromTo(myth, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, cue(1) + 0.05);
    const st = TM.word(myth, 'Dogs don’t work that way', { variant: 'red', size: 26 });
    Object.assign(st.style, { position: 'relative', left: 'auto', top: 'auto', alignSelf: 'flex-start', marginTop: '6px' });
    A.in(tl, st, at(ctx, 1, 'dogs don’t work', 0.85), 'pop', { dur: 0.4 });
    const what = MG.card(stage, { x: 980, y: 300, w: 840, h: 330, label: 'What actually happens', icon: 'eye',
      body: 'The dog doesn’t decide the trigger was harmless. The barking and lunging **worked**: the scary thing went away.' });
    tl.fromTo(what, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, cue(2) + 0.05);

    // the loop: trigger, bark and lunge, it goes away; the behavior gets stronger every time round
    const loop = put(stage, K.el('div', 'mgc-loop'), 100, 680);
    const items = [['Trigger appears', 'amber', 'zap'], null, ['Bark and lunge', 'red', 'megaphone'], null, ['Trigger goes away', 'pale', 'arrow-right'], null, ['Again', 'red', 'repeat']];
    const els = items.map(it => {
      if (!it) { const a = K.iconBadge(loop, 'arrow-right', { size: 48 }); a.style.position = 'relative'; a.style.left = a.style.top = ''; return a; }
      return flow(TM.word(loop, it[0], { variant: it[1], icon: it[2], size: 30 }));
    });
    const tL = at(ctx, 2, 'barking and lunging', 0.4);
    A.in(tl, els, tL, 'fadeRight', { dur: 0.45, stagger: 0.22 });
    const meter = put(stage, K.el('div', 'mgc-meter'), 400, 800, { width: '1060px' });
    const fill = K.el('i'); meter.appendChild(fill);
    const ml = put(stage, K.el('div', 'mgc-mlab', 'Stronger every time'), 100, 799);
    const tS = at(ctx, 2, 'stronger every time', 0.85);
    A.in(tl, [ml, meter], tS - 0.4, 'fadeUp', { dur: 0.5 });
    tl.set(fill, { scaleX: 0.15 }, 0);
    [0.4, 0.68, 1].forEach((v, k) => {
      tl.to(fill, { scaleX: v, duration: 0.45, ease: 'power2.out' }, tS + 0.5 * k);
      A.pulse(tl, els[6], tS + 0.5 * k, { scale: 1.1 });
    });
    const call = MG.callout(stage, 'Repeated exposure with no plan doesn’t fade reactivity out. <b>It drills it in.</b>', { x: 100, y: 860, w: 1720, variant: 'red', size: 34 });
    tl.fromTo(call, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, cue(3) + 0.05);
  });

  // ---------------------------------------------------------------- calm isn't the same as cured
  registerScene('mg03s07', ctx => {
    const { stage, tl, cue, end } = ctx;
    css(stage);
    TM.head(ctx, 'And calm isn’t the same as cured', 'Even quiet watching won’t change how they feel', { w: 1480, size: 60 });
    const lead = put(stage, K.el('div', 'mg-lead', 'Calm isn’t the same as <b>cured</b>.'), 100, 290, { width: '1700px' });
    A.in(tl, lead, cue(0) + 0.1, 'fadeUp', { dur: 0.6 });
    const looks = MG.card(stage, { x: 100, y: 380, w: 840, h: 300, variant: 'amber', label: 'Looks like progress', icon: 'eye',
      body: 'A dog can stare at a trigger, stay under threshold, never make a sound, and **still feel exactly the same** about it tomorrow.' });
    tl.fromTo(looks, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, cue(1) + 0.05);
    const truth = MG.card(stage, { x: 980, y: 380, w: 840, h: 300, variant: 'green', label: 'The truth', icon: 'lightbulb',
      body: 'Quietly tolerating something isn’t feeling good about it. Your dog won’t connect the dots alone: *we help them build the association*.' });
    tl.fromTo(truth, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, cue(2) + 0.05);

    // trigger shows up, good things happen: over and over, on purpose
    const t3 = cue(3) + 0.05;
    const strip = TM.order(stage, ['Trigger shows up', 'Good things happen'], { x: 100, y: 730, size: 36, icons: ['zap', 'cookie'] });
    A.in(tl, strip.items, t3, 'fadeRight', { dur: 0.5, stagger: 0.3 });
    const rep = put(stage, K.el('div', 'tm-word pale'), 0, 730);
    rep.appendChild(K.icon('repeat'));
    rep.appendChild(K.el('span', null, 'Over and over, on purpose'));
    rep.style.fontSize = '32px';
    rep.style.left = (strip.row.offsetLeft + strip.row.offsetWidth + 40) + 'px';
    A.in(tl, rep, at(ctx, 3, 'over and over', 0.35), 'pop', { dur: 0.45 });
    const bn = put(stage, K.el('div', 'tm-banner'), 100, 850, { width: '1720px', boxSizing: 'border-box', fontSize: '34px' });
    bn.appendChild(K.icon('heart'));
    bn.appendChild(K.el('span', null, 'That’s what changes how they feel, and <b>why planned training sessions exist</b>.'));
    tl.fromTo(bn, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, at(ctx, 3, 'changes how they feel', 0.65));
  });
})();
