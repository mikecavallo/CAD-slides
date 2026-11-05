// Management: The Basics, Part 3 (the golden rule), second half.
//   mg03s05  "Just this once": Tori's house, levelled, builds floor by floor on its foundation; a crack opens, runs up, and the house shifts
//   mg03s06  a dangerous myth: The myth / A fearful dog: what happens; a loop (trigger, bark and lunge, it goes away) that grows stronger; WTF
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
  .mgc-wtf { position: absolute; box-sizing: border-box; display: flex; align-items: center; gap: 40px; padding: 26px 36px; border-radius: 26px; background: #fff;
    border: 1px solid #e6e9e1; box-shadow: var(--shadow-soft); }
  .mgc-wtf .tiles { display: flex; align-items: center; gap: 12px; }
  .mgc-wtf .tiles span { width: 84px; height: 84px; border-radius: 18px; background: var(--green); color: #fff; display: grid; place-items: center; font: 800 52px/1 var(--font-head); }
  .mgc-wtf .tiles em { font: 800 60px/1 var(--font-head); color: var(--green); font-style: normal; margin-left: 4px; }
  .mgc-wtf .t { font: 700 48px/1.1 var(--font-head); color: var(--ink); }
  .mgc-wtf .s { margin-top: 12px; display: flex; align-items: center; gap: 12px; font: 600 30px/1.2 var(--font-body); color: var(--ink-soft); }
  .mgc-wtf .s svg { width: 34px; height: 34px; color: var(--green); stroke-width: 2.3; }
  .mgc-wtf .s b { color: var(--green-dark); }
  `;
  const css = stage => { MG.css(stage); if (!stage.querySelector('style[data-mgc]')) { const s = K.el('style', null, CSS); s.dataset.mgc = '1'; stage.appendChild(s); } };
  const flow = n => { n.style.position = 'relative'; n.style.left = n.style.top = ''; return n; };

  // Tori's house, levelled (tools: scratchpad level_house.py): the house body and the foundation slab are separate layers
  // (mg_house_body.png, mg_house_slab.png, same 1268 x 1052 box), so the house can stand straight, then shift on its own
  // when the foundation cracks. The crack is Tori's original crack, mapped onto the levelled house.
  const NAT = [1268, 1052], SLAB = 885, TH = 3, PIV = [630, 878];
  const lev = ([x, y]) => {
    if (y >= SLAB) return [x, y];
    const t = TH * Math.PI / 180, dx = x - PIV[0], dy = y - PIV[1];
    return [PIV[0] + dx * Math.cos(t) - dy * Math.sin(t), PIV[1] + dx * Math.sin(t) + dy * Math.cos(t)];
  };
  const CRACK_SLAB = [[656, 1020], [622, 988], [668, 958], [610, 935], [636, 887]];
  const CRACK_BODY = [[636, 884], [598, 840], [648, 790], [596, 720], [640, 652], [598, 585], [645, 510], [600, 445]].map(lev);
  const BRANCH = [[[598, 585], [528, 574]], [[640, 652], [720, 622]], [[596, 720], [531, 712]], [[648, 790], [718, 756]]].map(p => p.map(lev));

  // ---------------------------------------------------------------- just this once won't hurt
  registerScene('mg03s05', ctx => {
    const { stage, tl, cue, end } = ctx;
    css(stage);
    TM.head(ctx, 'Inconsistency is the enemy', '“Just this once”');
    const { w, h } = MG.fit(NAT, 760, 620);
    const X0 = 100, Y0 = 320, sx = w / NAT[0], sy = h / NAT[1];
    const F = ([x, y]) => [x * sx, y * sy];
    const box = put(stage, K.el('div'), X0, Y0, { position: 'absolute', width: w + 'px', height: h + 'px' });
    const layer = (src) => {
      const d = put(box, K.el('div'), 0, 0, { position: 'absolute', width: w + 'px', height: h + 'px' });
      const img = put(d, K.el('img'), 0, 0, { position: 'absolute', width: w + 'px', height: h + 'px' });
      img.src = '../assets/img/' + src;
      const sv = K.svg(d, { x: 0, y: 0, w, h });
      sv.style.overflow = 'visible';
      return { d, img, sv };
    };
    // the house body pivots on its bottom left corner, sinking at the right into the cracked foundation (the slab is on top)
    const body = layer('mg_house_body.png');
    body.d.style.transformOrigin = `${(197 / NAT[0]) * 100}% ${(SLAB / NAT[1]) * 100}%`;
    const slab = layer('mg_house_slab.png');
    const pathOf = pts => 'M ' + pts.map(p => F(p).join(' ')).join(' L ');
    const CW = Math.max(5, w * 0.009);

    // beat 0: the foundation, level and solid
    tl.fromTo(slab.d, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, cue(0) + 0.3);
    // beat 1: built floor by floor, straight on the foundation
    const tF = at(ctx, 1, 'floor by floor', 0.2);
    tl.set(body.img, { clipPath: 'inset(84.2% 0% 0% 0%)' }, 0);
    [62, 39.4, 17.6, 0].forEach((p, i) => tl.to(body.img, { clipPath: `inset(${p}% 0% 0% 0%)`, duration: 0.5, ease: 'power2.out' }, tF + 0.45 * i));
    const X = X0 + w + 80, W = 1820 - X;
    const lead = put(stage, K.el('div', 'mg-lead', 'A house built <b>floor by floor</b>, on a level foundation.'), X, 340, { width: W + 'px', fontSize: '38px' });
    A.in(tl, lead, tF, 'fadeUp', { dur: 0.6 });
    // a crack opens in the foundation; the house shifts a little
    const tC = at(ctx, 1, 'has a crack', 0.5);
    const c1 = K.path(slab.sv, pathOf(CRACK_SLAB), { fill: 'none', stroke: '#c4491f', 'stroke-width': CW, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' });
    A.draw(tl, c1, tC + 0.2, 0.7);
    const l2 = put(stage, K.el('div', 'mg-lead', 'A crack in the foundation, and the whole structure <b style="color:var(--red)">shifts, splits, and comes down</b>.'), X, 0, { width: W + 'px', fontSize: '38px' });
    l2.style.top = (lead.offsetTop + lead.offsetHeight + 34) + 'px';
    A.in(tl, l2, tC, 'fadeUp', { dur: 0.6 });
    tl.to(body.d, { rotation: 1, duration: 0.8, ease: 'power2.inOut' }, at(ctx, 1, 'shifts', 0.75));

    // beat 2: management is that foundation; another crack runs up through the house, and it starts to fall
    const tag = TM.fx.tag(tl, box, 'Management', Math.round(w * 0.05), Math.round(h * 0.865), at(ctx, 2, 'management is that foundation', 0.1), 'green');
    tag.style.fontSize = '28px';
    const tR = at(ctx, 2, 'another crack', 0.5);
    const tag2 = TM.fx.tag(tl, box, 'Just this once', Math.round(w * 0.6), Math.round(h * 0.865), tR - 0.2, 'red');
    Object.assign(tag2.style, { fontSize: '28px', background: '#fff' });
    const c2 = K.path(body.sv, pathOf(CRACK_BODY), { fill: 'none', stroke: '#c4491f', 'stroke-width': CW, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' });
    A.draw(tl, c2, tR, 1.3);
    BRANCH.forEach(([p, q], k) => {
      const br = K.path(body.sv, `M ${F(p).join(' ')} L ${F(q).join(' ')}`, { fill: 'none', stroke: '#c4491f', 'stroke-width': Math.max(3, w * 0.006), 'stroke-linecap': 'round' });
      A.draw(tl, br, tR + 0.9 - 0.18 * k, 0.4);
    });
    tl.to(body.d, { rotation: 3.5, duration: 1.4, ease: 'power2.inOut' }, at(ctx, 2, 'starts to fall', 0.2));
    tl.to([lead, l2], { opacity: 0.5, duration: 0.5 }, cue(2));
    const l3 = put(stage, K.el('div', 'mg-lead', 'Every rehearsal of an unwanted behavior <b style="color:var(--red)">is another crack</b>.'), X, 0, { width: W + 'px', fontSize: '38px' });
    l3.style.top = (l2.offsetTop + l2.offsetHeight + 34) + 'px';
    A.in(tl, l3, tR, 'fadeUp', { dur: 0.6 });
    const call = MG.callout(stage, 'A cracked foundation brings <b>the whole house down</b>.', { x: X, y: 0, w: W, variant: 'red', size: 36 });
    call.style.top = (l3.offsetTop + l3.offsetHeight + 44) + 'px';
    tl.fromTo(call, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, cue(3) + 0.05);
    tl.to(l3, { opacity: 0.5, duration: 0.5 }, cue(3));
  });

  // ---------------------------------------------------------------- exposure alone doesn't fade reactivity
  registerScene('mg03s06', ctx => {
    const { stage, tl, cue, end } = ctx;
    css(stage);
    TM.head(ctx, 'A dangerous myth', 'A dangerous myth');
    const myth = MG.card(stage, { x: 100, y: 300, w: 840, variant: 'red', label: 'The myth', icon: 'circle-x' });
    myth.appendChild(K.el('div', 'mgc-quote', '“Let him see the trigger enough times. It’s fine, nothing bad happened, he’ll get over it.”'));
    tl.fromTo(myth, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, cue(1) + 0.05);
    const st = TM.word(myth, 'Dogs don’t work that way', { variant: 'red', size: 26 });
    Object.assign(st.style, { position: 'relative', left: 'auto', top: 'auto', alignSelf: 'flex-start', marginTop: '6px' });
    A.in(tl, st, at(ctx, 1, 'dogs don’t work', 0.85), 'pop', { dur: 0.4 });
    const what = MG.card(stage, { x: 980, y: 300, w: 840, size: 32, label: 'A fearful dog: what happens', icon: 'eye',
      body: 'They don’t decide the trigger was harmless. The barking and lunging **worked**: the scary thing went away.' });
    tl.fromTo(what, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, cue(2) + 0.05);
    const CB = 300 + Math.max(myth.offsetHeight, what.offsetHeight);  // both cards end on one line
    [myth, what].forEach(c => { c.style.height = CB - 300 + 'px'; });

    // the loop: trigger, bark and lunge, it goes away; the behavior gets stronger every time round
    const loop = put(stage, K.el('div', 'mgc-loop'), 100, CB + 50);
    const items = [['Trigger appears', 'amber', 'zap'], null, ['Bark and lunge', 'red', 'megaphone'], null, ['Trigger goes away', 'pale', 'arrow-right'], null, ['Again', 'red', 'repeat']];
    const els = items.map(it => {
      if (!it) { const a = K.iconBadge(loop, 'arrow-right', { size: 48 }); a.style.position = 'relative'; a.style.left = a.style.top = ''; return a; }
      return flow(TM.word(loop, it[0], { variant: it[1], icon: it[2], size: 30 }));
    });
    const tL = at(ctx, 2, 'barking and lunging', 0.4);
    A.in(tl, els, tL, 'fadeRight', { dur: 0.45, stagger: 0.22 });
    const meter = put(stage, K.el('div', 'mgc-meter'), 400, CB + 164, { width: '1060px' });
    const fill = K.el('i'); meter.appendChild(fill);
    const ml = put(stage, K.el('div', 'mgc-mlab', 'Stronger every time'), 100, CB + 163);
    const tS = at(ctx, 2, 'stronger every time', 0.85);
    A.in(tl, [ml, meter], tS - 0.4, 'fadeUp', { dur: 0.5 });
    tl.set(fill, { scaleX: 0.15 }, 0);
    [0.4, 0.68, 1].forEach((v, k) => {
      tl.to(fill, { scaleX: v, duration: 0.45, ease: 'power2.out' }, tS + 0.5 * k);
      A.pulse(tl, els[6], tS + 0.5 * k, { scale: 1.1 });
    });
    const call = MG.callout(stage, 'Repeated exposure with no plan doesn’t fade reactivity out. <b>It drills it in.</b>', { x: 100, y: CB + 236, w: 1720, variant: 'red', size: 34 });
    tl.fromTo(call, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, cue(3) + 0.05);

    // beat 4: WTF, What's the Function? (explained in The ABCs of Behavior): it takes the loop's place
    const t4 = cue(4) + 0.05;
    tl.to([loop, meter, ml], { opacity: 0, y: -10, duration: 0.4, ease: 'power2.in' }, t4 - 0.1);
    const wtf = put(stage, K.el('div', 'mgc-wtf'), 100, CB + 40, { width: '1720px' });
    wtf.innerHTML = `<div class="tiles"><span>W</span><span>T</span><span>F</span><em>?</em></div>
      <div class="tx"><div class="t">What’s the Function?</div><div class="s">${K.icon('circle-play').outerHTML}<span>Explained in another video: <b>The ABCs of Behavior</b></span></div></div>`;
    tl.fromTo(wtf, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, t4 + 0.25);
    A.in(tl, wtf.querySelectorAll('.tiles span'), at(ctx, 4, 'WTF', 0.5), 'pop', { dur: 0.4, stagger: 0.12 });
  });

  // ---------------------------------------------------------------- calm isn't the same as cured
  registerScene('mg03s07', ctx => {
    const { stage, tl, cue, end } = ctx;
    css(stage);
    TM.head(ctx, 'Calm isn’t cured', 'Calm isn’t cured');
    const looks = MG.card(stage, { x: 100, y: 300, w: 840, size: 32, variant: 'amber', label: 'Looks like progress', icon: 'eye',
      body: 'A dog can stare at a trigger, stay under threshold, never make a sound, and **still feel the same, or worse,** about it tomorrow.' });
    tl.fromTo(looks, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, cue(1) + 0.05);
    const truth = MG.card(stage, { x: 980, y: 300, w: 840, size: 32, variant: 'green', label: 'The truth', icon: 'lightbulb',
      body: 'Quietly tolerating something isn’t feeling good about it. Your dog won’t connect the dots alone: *we help them build the association*.' });
    tl.fromTo(truth, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, cue(2) + 0.05);
    const CB = 300 + Math.max(looks.offsetHeight, truth.offsetHeight);
    [looks, truth].forEach(c => { c.style.height = CB - 300 + 'px'; });

    // trigger shows up, good things happen: over and over, on purpose
    const t3 = cue(3) + 0.05;
    const strip = TM.order(stage, ['Trigger shows up', 'Good things happen'], { x: 100, y: CB + 60, size: 36, icons: ['zap', 'cookie'] });
    A.in(tl, strip.items, t3, 'fadeRight', { dur: 0.5, stagger: 0.3 });
    const rep = put(stage, K.el('div', 'tm-word pale'), 0, CB + 64);
    rep.appendChild(K.icon('repeat'));
    rep.appendChild(K.el('span', null, 'Over and over, on purpose'));
    rep.style.fontSize = '32px';
    rep.style.left = (strip.row.offsetLeft + strip.row.offsetWidth + 40) + 'px';
    A.in(tl, rep, at(ctx, 3, 'over and over', 0.35), 'pop', { dur: 0.45 });
    const bn = put(stage, K.el('div', 'tm-banner'), 100, CB + 190, { width: '1720px', boxSizing: 'border-box', fontSize: '34px' });
    bn.appendChild(K.icon('heart'));
    bn.appendChild(K.el('span', null, 'That’s what changes how they feel, and <b>why planned training sessions exist</b>.'));
    tl.fromTo(bn, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, at(ctx, 3, 'changes how they feel', 0.65));
  });
})();
