// Management: Everyday Manners, Part 3 (putting it together) and the close.
//   em03s01  "Just this once": five small slips drop in, each one more rep on the old path (a red meter fills); consistency callout
//   em03s02  bringing it together: Tori's level house on its foundation; three takeaways; the closing statement
//   em03s03  your assignment: two steps and a worksheet with one example row; logo close
(() => {
  const { at, put } = TM;
  const CSS = `
  .emc-slips { position: absolute; display: flex; flex-direction: column; gap: 18px; }
  .emc-slips .tm-word { position: relative; left: auto; top: auto; align-self: flex-start; }
  .emc-q { position: absolute; font: 600 italic 44px/1.25 var(--font-head); color: var(--ink); }
  .emc-meter { position: absolute; height: 34px; border-radius: 17px; background: #f1e6e2; overflow: hidden; }
  .emc-meter i { position: absolute; left: 0; top: 0; bottom: 0; width: 100%; background: var(--red); transform-origin: left center; border-radius: 17px; }
  .emc-mlab { position: absolute; font: 700 30px/1.2 var(--font-body); color: var(--red); }
  .emc-statement { position: absolute; box-sizing: border-box; padding: 30px 40px; border-radius: 26px; background: var(--green-deep); color: #fff; font: 700 44px/1.2 var(--font-head);
    box-shadow: 0 18px 40px rgba(44,74,23,0.3); }
  .emc-statement b { color: #d6e9a8; }
  .emc-ws { position: absolute; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0; border-radius: 24px; overflow: hidden; background: #fff;
    border: 1px solid #e6e9e1; box-shadow: var(--shadow-soft); }
  .emc-ws .h { display: flex; align-items: center; gap: 12px; padding: 22px 28px; background: var(--green-mist); font: 700 27px/1.2 var(--font-body); color: var(--ink); }
  .emc-ws .h svg { width: 30px; height: 30px; stroke-width: 2.4; flex: 0 0 auto; color: var(--green-dark); }
  .emc-ws .h.red svg { color: var(--red); }
  .emc-ws .c { padding: 22px 28px; min-height: 64px; border-top: 1px solid #e6e9e1; font: 600 30px/1.3 var(--font-body); color: var(--ink); }
  .emc-ws .c.red { color: var(--red); }
  .emc-ws .c.green { color: var(--green-dark); }
  .emc-ws .c + .c, .emc-ws .h + .h { border-left: 1px solid #e6e9e1; }
  .emc-ws .c.blank { min-height: 70px; background: repeating-linear-gradient(180deg, transparent 0 68px, #eef1ea 68px 70px); }
  .emc-statement .k { display: block; margin-bottom: 14px; font: 700 26px/1 var(--font-body); letter-spacing: 5px; text-transform: uppercase; color: var(--green-light); }
  `;
  const css = stage => { EM.css(stage); if (!stage.querySelector('style[data-emc]')) { const s = K.el('style', null, CSS); s.dataset.emc = '1'; stage.appendChild(s); } };

  // ---------------------------------------------------------------- just this once
  registerScene('em03s01', ctx => {
    const { stage, tl, cue } = ctx;
    css(stage);
    TM.head(ctx, 'Putting it together', '“Just this once”');
    const q = put(stage, K.el('div', 'emc-q', '“Just this once won’t hurt.”'), 100, 300, { width: '820px' });
    A.in(tl, q, at(ctx, 0, 'just this once', 0.2), 'fadeUp', { dur: 0.6 });
    const slips = put(stage, K.el('div', 'emc-slips'), 100, 400, { width: '820px' });
    const S = [['A quick jump for a hug', 'repeat', 0, 'quick jump'], ['One bite from the table', 'cookie', 0, 'one bite'], ['One pull to the tree', 'move-right', 1, 'doesn’t know'],
      ['One bark at the window', 'megaphone', 1, 'one more rep'], ['One snack off the counter', 'utensils', 2, 'small slips']];
    const els = S.map(([t, ic]) => TM.word(slips, t, { variant: 'red', icon: ic, size: 30 }));
    els.forEach(n => { n.style.position = 'relative'; n.style.left = n.style.top = ''; });
    // right: your dog's side of it, one more rep each time
    const X = 1000, W = 820;
    const lab = put(stage, K.el('div', 'emc-mlab', 'Reps on the old path'), X, 430, { width: W + 'px' });
    const mt = put(stage, K.el('div', 'emc-meter'), X, 490, { width: W + 'px' });
    const fill = K.el('i'); mt.appendChild(fill);
    tl.set(fill, { scaleX: 0.06 }, 0);
    const side = put(stage, K.el('div', 'mg-lead', 'Your dog doesn’t know it’s just this once. <b style="color:var(--red)">It’s one more rep.</b>'), X, 560, { width: W + 'px', fontSize: '38px' });
    A.in(tl, [lab, mt], cue(1) + 0.05, 'fadeUp', { dur: 0.6, stagger: 0.12 });
    A.in(tl, side, at(ctx, 1, 'one more rep', 0.2), 'fadeUp', { dur: 0.6 });
    els.forEach((n, i) => {
      const [, , b, p] = S[i];
      const t = at(ctx, b, p, 0.3 + 0.1 * i) + (i === 2 || i === 4 ? 0 : 0);
      A.in(tl, n, t, 'fadeRight', { dur: 0.45 });
      tl.to(fill, { scaleX: 0.06 + 0.188 * (i + 1), duration: 0.5, ease: 'power2.out' }, Math.max(t, cue(1) + 0.4) + 0.1);
    });
    const call = MG.callout(stage, 'Small slips add up. <b>Consistency</b> is what makes new manners stick.', { x: X, y: 0, w: W, size: 36 });
    call.style.top = (side.offsetTop + side.offsetHeight + 50) + 'px';
    tl.fromTo(call, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, at(ctx, 2, 'being consistent', 0.4));
  });

  // ---------------------------------------------------------------- the close
  registerScene('em03s02', ctx => {
    const { stage, tl, cue, end } = ctx;
    css(stage);
    const hd = TM.head(ctx, 'Putting it together', 'Bringing it together');
    const NAT = [1268, 1052];
    const { w, h } = MG.fit(NAT, 640, 540);
    const ph = TM.pic(stage, 'mg_house_level.png', { x: 100, y: 330, w, h, nat: NAT, radius: 0, border: 0 });
    ph.root.style.background = 'transparent';
    ph.root.style.boxShadow = 'none';
    tl.fromTo(ph.wrap, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, 0.35);
    const tag = TM.fx.tag(tl, ph.wrap, 'Management', Math.round(w * 0.06), Math.round(h * 0.875), 1.0, 'green');
    tag.style.fontSize = '28px';
    const X = 100 + w + 80, W = 1820 - X;
    const col = put(stage, K.el('div', 'tm-col'), X, 320, { width: W + 'px', gap: '26px' });
    [['What your dog practices, they get better at. *Management prevents the practice.*', 0, 'what your dog practices'],
      ['*Training* teaches what to do instead.', 1, 'training teaches'],
      ['*Everyone* in your home follows the same plan.', 1, 'everyone']].forEach(([t, b, p], i) => {
      const r = TM.row(col, null, t, { num: i + 1, size: 31 });
      A.in(tl, r, at(ctx, b, p, 0.1), 'fadeRight', { dur: 0.6 });
    });
    const st = put(stage, K.el('div', 'emc-statement'), X, 0, { width: W + 'px' });
    st.innerHTML = '<span class="k">The foundation</span>Build on a strong foundation, <b>one without cracks</b> from management slipping, and <b>the manners you teach will last.</b>';
    st.style.top = Math.max(col.offsetTop + col.offsetHeight + 36, 330 + h - st.offsetHeight) + 'px';
    tl.fromTo(st, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, cue(2) + 0.05);
    A.pulse(tl, tag, at(ctx, 2, 'without cracks', 0.3), { scale: 1.12 });
  });

  // ---------------------------------------------------------------- the assignment, then the logo close
  registerScene('em03s03', ctx => {
    const { stage, tl, cue, end } = ctx;
    css(stage);
    const hd = TM.head(ctx, 'Putting it together', 'Your assignment');
    const steps = put(stage, K.el('div', 'tm-col'), 100, 300, { width: '1720px', gap: '22px' });
    const r1 = TM.row(steps, null, 'List the behaviors you don’t want to continue, and *the situations they happen in*. Be specific.', { num: 1, size: 32 });
    const r2 = TM.row(steps, null, 'For each one, *manage the environment temporarily*, so it can’t be practiced while you teach something new.', { num: 2, size: 32 });
    A.in(tl, r1, cue(1) + 0.05, 'fadeRight', { dur: 0.6 });
    A.in(tl, r2, cue(2) + 0.05, 'fadeRight', { dur: 0.6 });
    // the worksheet: three columns, one example row
    const ws = put(stage, K.el('div', 'emc-ws'), 100, steps.offsetTop + steps.offsetHeight + 46, { width: '1720px' });
    const H = [['Behavior I don’t want', 'circle-x', 'red'], ['When and where it happens', 'map-pin', ''], ['How I’ll manage it', 'shield-check', 'green']];
    const cells = [['Jumping on guests', 'red'], ['At the front door, when guests arrive', ''], ['Baby gate up before the door opens', 'green']];
    H.forEach(([t, ic, v]) => { const h = K.el('div', 'h ' + v, K.icon(ic).outerHTML + '<span>' + t + '</span>'); ws.appendChild(h); });
    const cs = cells.map(([t, v]) => { const c = K.el('div', 'c ' + v, t); ws.appendChild(c); return c; });
    [0, 1, 2].forEach(() => { const c = K.el('div', 'c blank'); ws.appendChild(c); });
    tl.fromTo(ws, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, cue(0) + 0.3);
    A.in(tl, cs[0], at(ctx, 1, 'not just jumping', 0.4), 'fadeUp', { dur: 0.5 });
    A.in(tl, cs[1], at(ctx, 1, 'front door', 0.3), 'fadeUp', { dur: 0.5 });
    A.in(tl, cs[2], at(ctx, 2, 'manage the environment', 0.3), 'fadeUp', { dur: 0.5 });
    SKIT.logoClose(ctx, end(2) + 0.8, [...hd.all, steps, ws]);
  });
})();
