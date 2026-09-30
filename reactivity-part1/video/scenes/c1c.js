// Chapter 1 (v5): scenes built by group c. Bowl parts come from window.C1 (c1_bowl.js).
//   ch01s06  Age               bowl shifts left, life-stage ruler, adolescence and social maturity bands, teen parties vs
//                              adult close friends, the dog park card, then the senior dog with a lowering tolerance meter
//   ch01s07  Past experiences  one event on a timeline, a person takes the toy three times, the response comes sooner
//                              with practice, the path across the lawn and a new path
(() => {
  const { C, STD, CAP_Y, svgIcon, sayAt, phraseAt, clamp, layer, put, badge, label, dropIn, caption, sceneBase, callout } = C1;

  const CSS = `
  .c1c-lt { display: flex; flex-direction: column; gap: 10px; }
  .c1c-ls { font: 600 28px/1 var(--font-body); color: var(--ink-soft); white-space: nowrap; }
  .c1c-dog { position: absolute; border-radius: 50%; display: grid; place-items: center; background: #eff1e8; color: #5b6348;
    border: 7px solid #fff; box-shadow: var(--shadow-soft); }
  .c1c-dog svg { width: 56%; height: 56%; stroke-width: 1.7; }
  .c1c-cb { position: absolute; border-radius: 50%; display: grid; place-items: center; background: #fff; color: var(--olive);
    border: 3px solid #dfe5d4; box-shadow: var(--shadow-soft); }
  .c1c-cb svg { width: 54%; height: 54%; stroke-width: 2.1; }
  .c1c-cl { position: absolute; font: 700 30px/1 var(--font-body); color: var(--ink-soft); white-space: nowrap; text-align: right; }
  .c1c-chip { position: absolute; display: inline-flex; align-items: center; gap: 14px; height: 68px; padding: 0 30px 0 22px; border-radius: 999px;
    background: #fff; border: 3px solid #f0cf9c; box-shadow: var(--shadow-soft); font: 700 34px/1 var(--font-body); color: var(--ink); white-space: nowrap; }
  .c1c-chip .d { width: 16px; height: 16px; border-radius: 50%; background: var(--amber); flex: 0 0 auto; }
  .c1c-mlab { position: absolute; font: 700 40px/1 var(--font-head); color: var(--green-dark); white-space: nowrap; text-align: center; }
  .c1c-tube { position: absolute; border-radius: 999px; background: #eceee7; border: 6px solid #fff; box-shadow: var(--shadow-soft); overflow: hidden; }
  .c1c-fill { position: absolute; left: 0; right: 0; bottom: 0; height: 100%; background: hsl(93, 46%, 40%); }
  .c1c-rl { position: absolute; font: 700 44px/1 var(--font-head); color: var(--green-dark); white-space: nowrap; text-align: right; }
  .c1c-soon { position: absolute; font: 700 36px/1 var(--font-body); color: var(--red); white-space: nowrap; text-align: right; }
  .c1c-newp { position: absolute; display: inline-flex; align-items: center; gap: 12px; padding: 14px 28px 14px 20px; border-radius: 999px; background: #fff;
    color: var(--green-dark); font: 700 32px/1 var(--font-body); white-space: nowrap; box-shadow: 0 10px 24px rgba(40,60,20,0.18); }
  .c1c-newp svg { width: 36px; height: 36px; stroke-width: 2.4; }
  `;
  const styleC = stage => stage.appendChild(K.el('style', null, CSS));

  /** Absolutely positioned element with a class at (x, y). */
  const boxC = (parent, cls, html, o) => {
    const n = K.el('div', cls, html == null ? null : K.md(html));
    K.place(n, o || {});
    parent.appendChild(n);
    return n;
  };
  /** Old callout lifts out, new one rises into the same slot. */
  const swapC = (tl, from, to, t) => {
    A.out(tl, from, t - 0.3, 'fadeUp', { dur: 0.4 });
    A.in(tl, to, t + 0.1, 'fadeUp', { dur: 0.8 });
  };

  // ================================================================== ch01s06 Age
  registerScene('ch01s08', ctx => {
    const { stage, tl, cue, end } = ctx;
    styleC(stage);
    const { B } = sceneBase(ctx, 'Age', 4, 84);

    // ---------- beat 0: age drops in, the bowl shifts left, then the life-stage ruler draws beneath it
    const tDrop = Math.max(cue(0) + 0.3, phraseAt(ctx, 0, 'age', 0.12) - 0.4);
    dropIn(tl, B, 4, tDrop);
    const NB = { cx: 340, y: 398, s: 0.5 };
    const tShift = tDrop + 0.6;
    tl.to(B.wrap, { x: NB.cx - STD.cx, y: NB.y - STD.y, scale: NB.s / STD.s, duration: 1.0, ease: 'power3.inOut' }, tShift);
    const cap = caption(stage, 4, 600, 262, { left: true });
    A.in(tl, cap, tShift + 0.8, 'fadeUp', { dur: 0.6 });

    const X = m => 200 + m * 31; // months to x (birth to three years), then a break, then the senior years
    const AX = 740;
    const rsvg = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const axis1 = K.line(rsvg, 180, AX, X(36) + 26, AX, { stroke: '#b9c4ab', 'stroke-width': 6 });
    const axis2 = K.path(rsvg, `M ${X(36) + 66} ${AX} H 1770`, { stroke: '#b9c4ab', 'stroke-width': 6 });
    const brk = [K.line(rsvg, X(36) + 30, AX + 16, X(36) + 42, AX - 16, { stroke: '#b9c4ab', 'stroke-width': 5 }),
      K.line(rsvg, X(36) + 50, AX + 16, X(36) + 62, AX - 16, { stroke: '#b9c4ab', 'stroke-width': 5 })];
    const arrowHead = K.path(rsvg, `M 1756 ${AX - 14} L 1776 ${AX} L 1756 ${AX + 14}`, { stroke: '#b9c4ab', 'stroke-width': 5 });
    const tickMarks = [0, 6, 12, 18, 24, 36].map(m => K.line(rsvg, X(m), AX - 12, X(m), AX + 12, { stroke: '#9aa98a', 'stroke-width': 4 }));
    const tickLabs = [['Birth', 0], ['6 months', 6], ['1 year', 12], ['18 months', 18], ['2 years', 24], ['3 years', 36]]
      .map(([t, m]) => label(stage, t, X(m), AX + 20, { w: 200 }));
    const tAx = Math.max(tShift + 0.5, sayAt(ctx, 0, 'adolescence runs', 0.18, 0.2));
    A.draw(tl, [axis1], tAx, 0.9);
    A.draw(tl, [...brk, axis2, arrowHead], tAx + 0.7, 0.5, { stagger: 0.08 });
    A.in(tl, tickMarks, tAx + 0.3, 'fade', { dur: 0.3, stagger: 0.07 });
    A.in(tl, tickLabs, tAx + 0.4, 'fadeUp', { dur: 0.5, stagger: 0.07 });

    const mkBand = (html, m0, m1, y, bg, bd, fg) => {
      const b = K.el('div', 'c1-band', K.md(html));
      Object.assign(b.style, { left: X(m0) + 'px', top: y + 'px', width: X(m1) - X(m0) + 'px', background: bg, borderColor: bd, color: fg });
      stage.appendChild(b);
      return b;
    };
    const adol = mkBand('Adolescence', 6, 18, 534, C.pale, C.green, C.greenDeep);
    const ext = K.el('div', 'c1-band', 'Big breeds');
    Object.assign(ext.style, { left: X(18) - 24 + 'px', top: '534px', width: X(24) - X(18) + 24 + 'px', background: 'transparent', borderColor: C.green,
      borderStyle: 'dashed', borderLeft: 'none', borderRadius: '0 22px 22px 0', justifyContent: 'center', padding: '0 0 0 24px',
      font: '600 28px/1 var(--font-body)', color: C.greenDark });
    stage.insertBefore(ext, adol);
    const social = mkBand('Social maturity', 12, 36, 628, C.amberPale, C.amber, '#8a5410');

    const CX = 600, CY = 348;
    const call1 = callout(stage, CX, CY, 'Adolescence:', 'about 6 to 18 months', C.green);
    const tAd = tAx + 0.9;
    A.in(tl, adol, tAd, 'wipe', { dur: 0.8 });
    A.in(tl, call1, tAd + 0.15, 'fadeUp', { dur: 0.8 });
    A.in(tl, ext, Math.max(tAd + 1.2, sayAt(ctx, 0, 'up to two years', 0.6, 0.2)), 'wipe', { dur: 0.7 });

    // ---------- beat 1: social maturity, and the volume turns up
    const call2 = callout(stage, CX, CY, 'Social maturity:', 'about 1 to 3 years', C.amberText);
    swapC(tl, call1, call2, cue(1));
    A.in(tl, social, cue(1) - 0.1, 'wipe', { dur: 0.9 });
    const vol = K.el('div', 'c1-badge');
    Object.assign(vol.style, { left: '1080px', top: '530px', width: '84px', height: '84px', background: C.amberPale, color: C.amber,
      border: '4px solid #fff', boxShadow: 'var(--shadow-soft)' });
    const vIcons = ['volume', 'volume-1', 'volume-2'].map((n, i) => {
      const ic = K.icon(n);
      Object.assign(ic.style, { position: 'absolute', left: '50%', top: '50%', width: '48px', height: '48px', marginLeft: '-24px', marginTop: '-24px', opacity: i ? 0 : 1 });
      vol.appendChild(ic);
      return ic;
    });
    stage.appendChild(vol);
    const tVol = Math.max(cue(1) + 1.6, sayAt(ctx, 1, 'gets louder', 0.9, 0.4));
    A.in(tl, vol, Math.max(cue(1) + 0.8, Math.min(tVol - 0.8, sayAt(ctx, 1, 'reactivity or aggression', 0.6))), 'pop', { dur: 0.6 });
    tl.to(vIcons[0], { opacity: 0, duration: 0.2 }, tVol);
    tl.to(vIcons[1], { opacity: 1, duration: 0.2 }, tVol);
    tl.to(vIcons[1], { opacity: 0, duration: 0.2 }, tVol + 0.45);
    tl.to(vIcons[2], { opacity: 1, duration: 0.2 }, tVol + 0.45);
    tl.to(vol, { background: C.amber, color: '#fff', duration: 0.4 }, tVol + 0.45);
    A.pulse(tl, social, tVol + 0.5, { scale: 1.04 });
    A.pulse(tl, vol, tVol + 0.5, { scale: 1.15 });

    // ---------- beat 2: more selective with age. The teen wants the party, the adult a few close friends
    const call3 = callout(stage, CX, CY, 'More selective', 'with age', C.greenDark);
    swapC(tl, call2, call3, cue(2));
    const CARD_Y = 812, CARD_H = 146;
    const mkLife = (x, w, icon, bg, fg, name, sub, dots, dw) => {
      const c = K.el('div', 'c1-life');
      Object.assign(c.style, { left: x + 'px', top: CARD_Y + 'px', width: w + 'px', height: CARD_H + 'px' });
      const ib = K.el('div', 'ib');
      Object.assign(ib.style, { background: bg, color: fg });
      ib.appendChild(K.icon(icon));
      c.appendChild(ib);
      const tx = K.el('div', 'c1c-lt');
      tx.appendChild(K.el('div', 'nm', name));
      tx.appendChild(K.el('div', 'c1c-ls', sub));
      c.appendChild(tx);
      const ds = K.svgEl('svg', { viewBox: `0 0 ${dw} 104`, width: dw, height: 104 }, c);
      ds.style.marginLeft = 'auto';
      ds.style.overflow = 'visible';
      const pts = dots.map(([dx, dy, col, r]) => K.circle(ds, dx, dy, r || 11, { fill: col }));
      stage.appendChild(c);
      return { c, pts };
    };
    const CROWD = [[16, 26, '#9dbb3f'], [44, 14, '#d9912b'], [74, 28, '#619537'], [104, 12, '#c2b235'], [132, 30, '#8fb03a'],
      [28, 56, '#619537'], [58, 48, '#cf6a2c'], [90, 58, '#9dbb3f'], [120, 62, '#d9912b'], [12, 86, '#c2b235'],
      [42, 86, '#8fb03a'], [72, 90, '#619537'], [102, 90, '#9dbb3f'], [134, 88, '#cf6a2c']];
    const FRIENDS = [[26, 40, '#619537', 15], [62, 40, '#8fb03a', 15], [44, 70, '#3f6b22', 15]];
    const teen = mkLife(100, 480, 'party-popper', C.amberPale, C.amber, 'Teen', 'Big parties', CROWD, 146);
    const adult = mkLife(600, 460, 'coffee', C.pale, C.greenDark, 'Adult', 'Close friends', FRIENDS, 88);
    const tTeen = Math.max(cue(2) + 1.2, sayAt(ctx, 2, 'like a teenager', 0.3));
    const tAdult = Math.max(tTeen + 1.5, sayAt(ctx, 2, 'as an adult', 0.65));
    A.in(tl, teen.c, tTeen, 'fadeUp', { dur: 0.7 });
    tl.fromTo(teen.pts, { opacity: 0, scale: 0, transformOrigin: '50% 50%' },
      { opacity: 1, scale: 1, duration: 0.3, stagger: 0.05, ease: 'back.out(2.5)' }, Math.max(tTeen + 0.5, sayAt(ctx, 2, 'ton of friends', 0.5, 0.4)));
    A.in(tl, adult.c, tAdult, 'fadeUp', { dur: 0.7 });
    tl.fromTo(adult.pts, { opacity: 0, scale: 0, transformOrigin: '50% 50%' },
      { opacity: 1, scale: 1, duration: 0.35, stagger: 0.15, ease: 'back.out(2.5)' }, Math.max(tAdult + 0.5, sayAt(ctx, 2, 'few close friends', 0.9, 0.3)));

    // ---------- beat 3: normal, not a problem. The dog park card
    const call4 = callout(stage, CX, CY, 'Normal,', 'not a problem', C.green);
    swapC(tl, call3, call4, cue(3));
    const park = K.el('div', 'c1-park');
    Object.assign(park.style, { left: '1090px', top: CARD_Y + 'px', width: '730px', height: CARD_H + 'px', justifyContent: 'center', gap: '40px' });
    const pib = K.el('div', 'ib');
    pib.appendChild(K.icon('trees'));
    park.appendChild(pib);
    const pcol = K.el('div', 'col');
    const mkLn = (html, icon, bg, fg) => {
      const l = K.el('div', 'ln');
      l.appendChild(K.el('span', null, K.md(html)));
      const mk = K.el('div', 'mk');
      Object.assign(mk.style, { background: bg, color: fg });
      mk.appendChild(K.icon(icon));
      l.appendChild(mk);
      pcol.appendChild(l);
      return { l, mk };
    };
    const ln1 = mkLn('**Age 1:** loved it', 'check', C.green, '#fff');
    const ln2 = mkLn('**Age 3:** not anymore', 'triangle-alert', C.amber, '#fff');
    park.appendChild(pcol);
    stage.appendChild(park);
    const tPark = Math.max(cue(3) + 1.2, sayAt(ctx, 3, 'loved the dog park', 0.45, 0.6));
    const tNo = Math.max(tPark + 1.2, sayAt(ctx, 3, 'at three', 0.72));
    A.in(tl, park, tPark, 'fadeUp', { dur: 0.7 });
    A.in(tl, ln1.l, tPark + 0.3, 'fadeRight', { dur: 0.6 });
    A.in(tl, ln1.mk, tPark + 0.7, 'pop', { dur: 0.5 });
    A.in(tl, ln2.l, tNo, 'fadeRight', { dur: 0.6 });
    A.in(tl, ln2.mk, tNo + 0.4, 'pop', { dur: 0.5 });

    // ---------- beat 4: senior dogs. The cards and the ruler clear; the older dog, what changes, what bothers, tolerance drops
    const t4 = cue(4);
    A.out(tl, [teen.c, adult.c, park], t4 - 0.35, 'fadeDown', { dur: 0.45, stagger: 0.06 });
    A.out(tl, [rsvg, ...tickLabs, adol, ext, social, vol], t4 - 0.2, 'fade', { dur: 0.5 });
    const call5 = callout(stage, CX, CY, 'Senior dogs', 'change too', C.olive);
    swapC(tl, call4, call5, t4);

    const DX = 870, DY = 730, DS = 236;
    const dog = boxC(stage, 'c1c-dog', null, { x: DX - DS / 2, y: DY - DS / 2, w: DS, h: DS });
    dog.appendChild(K.icon('dog'));
    A.in(tl, dog, t4 + 0.35, 'pop', { dur: 0.7 });

    // what changes with age: small badges on the dog's left, labels beside them (head at the top, joints at the bottom)
    const R = 180, CB = 78;
    const conds = [['brain', 'Memory', 226], ['ear', 'Hearing', 196], ['eye', 'Vision', 164], ['bone', 'Sore joints', 134]].map(([ic, t, a]) => {
      const r = (a * Math.PI) / 180, bx = DX + R * Math.cos(r), by = DY + R * Math.sin(r);
      const b = boxC(stage, 'c1c-cb', null, { x: bx - CB / 2, y: by - CB / 2, w: CB, h: CB });
      b.appendChild(K.icon(ic));
      const l = boxC(stage, 'c1c-cl', t, { x: bx - CB / 2 - 18 - 300, y: by - 15, w: 300 });
      return { b, l };
    });
    const tJoint = Math.max(t4 + 1.0, sayAt(ctx, 4, 'sore joints', 0.12, 0.2));
    const tSense = Math.max(tJoint + 0.8, sayAt(ctx, 4, 'fading senses', 0.2, 0.2));
    const tMem = Math.max(tSense + 0.9, sayAt(ctx, 4, 'changes in memory', 0.28, 0.1));
    [[3, tJoint], [2, tSense], [1, tSense + 0.3], [0, tMem]].forEach(([k, t]) => {
      A.in(tl, conds[k].b, t, 'pop', { dur: 0.55 });
      A.in(tl, conds[k].l, t + 0.1, 'fadeLeft', { dur: 0.5 });
    });

    // the tolerance meter: full on "used to tolerate", then it drains while the little things pile up
    const MX = 1610, MY = 596, MW = 104, MH = 300;
    const mlab = boxC(stage, 'c1c-mlab', 'Tolerance', { x: MX - 160, y: MY - 72, w: 320 });
    const tube = boxC(stage, 'c1c-tube', null, { x: MX - MW / 2, y: MY, w: MW, h: MH });
    const fill = K.el('div', 'c1c-fill');
    tube.appendChild(fill);
    const tTol = Math.max(tMem + 0.9, sayAt(ctx, 4, 'used to tolerate', 0.45, 0.2));
    A.in(tl, [mlab, tube], tTol, 'fadeUp', { dur: 0.7, stagger: 0.1 });

    // everyday interactions, one per word, around the dog's right side
    const chips = [['Bumped', 'bumped', -52], ['Crowded', 'crowded', -17], ['Startled', 'startled', 17], ['Bothered', 'bothered', 52]].map(([t, w, a]) => {
      const r = (a * Math.PI) / 180, px = DX + 255 * Math.cos(r), py = DY + 206 * Math.sin(r);
      const c = boxC(stage, 'c1c-chip', null, { x: px - 6, y: py - 34 });
      c.appendChild(K.el('div', 'd'));
      c.appendChild(K.el('span', null, t));
      return { c, w };
    });
    let tPrev = tTol + 0.4;
    const chipAt = chips.map((ch, i) => {
      tPrev = Math.max(tPrev + 0.4, sayAt(ctx, 4, ch.w, 0.62 + i * 0.05, 0.2));
      A.in(tl, ch.c, tPrev, 'fadeLeft', { dur: 0.5 });
      tl.to(dog, { rotation: i % 2 ? 3 : -3, duration: 0.1, yoyo: true, repeat: 1, ease: 'power1.inOut' }, tPrev + 0.15);
      return tPrev;
    });
    const tLow0 = chipAt[0] - 0.1;
    const tLow1 = Math.max(chipAt[chipAt.length - 1] + 1.2, phraseAt(ctx, 4, 'get older', 0.95) + 0.5);
    const D = Math.min(tLow1, end(4)) - tLow0;
    tl.to(fill, { height: '24%', duration: D, ease: 'power1.inOut' }, tLow0);
    tl.to(fill, { backgroundColor: 'hsl(35, 70%, 51%)', duration: D * 0.5, ease: 'none' }, tLow0 + D * 0.2);
    tl.to(fill, { backgroundColor: 'hsl(10, 61%, 45%)', duration: D * 0.3, ease: 'none' }, tLow0 + D * 0.7);
  });

  // ================================================================== ch01s07 Past experiences
  registerScene('ch01s09', ctx => {
    const { stage, tl, cue, end, dur } = ctx;
    styleC(stage);
    const { B } = sceneBase(ctx, 'Past experiences', 5, 80);
    const TY = 320; // the beat's line of on-screen text, left of the bowl

    // ---------- beat 0: past experiences drops in; one event strikes the timeline
    const cap = caption(stage, 5, STD.cx, CAP_Y);
    const land = dropIn(tl, B, 5, Math.max(cue(0) + 0.3, phraseAt(ctx, 0, 'past experiences', 0.1) - 0.3));
    A.in(tl, cap, land - 0.2, 'fadeUp', { dur: 0.6 });

    const LA = layer(stage);
    const t1 = put(LA, 'c1-big', 'One event can be *enough*', { x: 100, y: TY });
    const tT1 = Math.max(land + 0.2, sayAt(ctx, 0, 'a single event', 0.3, 0.2));
    A.in(tl, t1, tT1, 'fadeUp', { dur: 0.8 });
    const SY = 446;
    const tsvg = K.svg(LA, { x: 100, y: SY, w: 1000, h: 380 });
    const LY = 250, SX = 420;
    const base = K.line(tsvg, 40, LY, 960, LY, { stroke: '#d3dbc9', 'stroke-width': 8 });
    const after = K.line(tsvg, SX, LY, 960, LY, { stroke: C.amber, 'stroke-width': 8, opacity: 0.85 });
    const dots = [];
    for (let x = 70; x <= 930; x += 70) dots.push({ x, c: K.circle(tsvg, x, LY, 11, { fill: '#9dbb3f', stroke: '#fff', 'stroke-width': 3 }) });
    const hit = K.circle(tsvg, SX, LY, 22, { fill: C.red, stroke: '#fff', 'stroke-width': 5 });
    const rays = [-180, -150, -120, -90, -60, -30, 0].map(a => {
      const r = (a * Math.PI) / 180;
      return K.line(tsvg, SX + 34 * Math.cos(r), LY + 34 * Math.sin(r), SX + 62 * Math.cos(r), LY + 62 * Math.sin(r), { stroke: C.amber, 'stroke-width': 6 });
    });
    const bolt = K.group(tsvg);
    svgIcon(bolt, 'zap', SX, 128, 132, { fill: C.amber, stroke: '#b36b12', 'stroke-width': 1.2 });
    const one = label(LA, 'One event', 100 + SX, SY + LY + 44, { cls: 'c1-sub', w: 460, color: C.red, size: 40 });
    A.draw(tl, base, tT1 + 0.3, 0.9);
    tl.fromTo(dots.map(d => d.c), { opacity: 0, scale: 0.3, transformOrigin: '50% 50%' },
      { opacity: 1, scale: 1, duration: 0.35, stagger: 0.05, ease: 'back.out(2)' }, tT1 + 0.5);
    const tStrike = Math.max(tT1 + 1.6, sayAt(ctx, 0, 'rushes yours', 0.55, 0.3));
    tl.fromTo(bolt, { opacity: 0, y: -110 }, { opacity: 1, y: 0, duration: 0.28, ease: 'power4.in' }, tStrike);
    tl.fromTo(hit, { opacity: 0, scale: 0.2, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(3)' }, tStrike + 0.26);
    tl.fromTo(rays, { opacity: 0, drawSVG: '0% 0%' }, { opacity: 1, drawSVG: '0% 100%', duration: 0.3, ease: 'power2.out' }, tStrike + 0.26);
    tl.to(rays, { opacity: 0, duration: 0.5 }, tStrike + 0.9);
    A.in(tl, one, tStrike + 0.4, 'fadeUp', { dur: 0.6 });
    // "may never forget it": everything after that moment stays tinted
    const tMem = Math.max(tStrike + 1.0, sayAt(ctx, 0, 'never forget', 0.8, 0.2));
    A.draw(tl, after, tMem, 1.0);
    dots.filter(d => d.x > SX).forEach((d, i) => tl.to(d.c, { attr: { fill: C.amber }, duration: 0.3 }, tMem + 0.1 + i * 0.1));

    // ---------- beat 1: someone keeps taking the toy; the dog's warning grows each time
    A.out(tl, LA, cue(1) - 0.3, 'fadeUp', { dur: 0.45 });
    const LB = layer(stage);
    const t2 = put(LB, 'c1-big', 'Repeated experiences *shape responses*', { x: 100, y: TY });
    A.in(tl, t2, cue(1) + 0.1, 'fadeUp', { dur: 0.8 });
    const bsvg = K.svg(LB, { x: 0, y: 0, w: 1920, h: 1080 });
    const FY = 772;
    const floor = K.line(bsvg, 130, FY, 1060, FY, { stroke: '#dde4d3', 'stroke-width': 6 });
    const DX = 270, DY = 662, PX = 640, OFF = 420;
    const markG = K.group(bsvg); // warning marks sit behind the dog
    const dog = badge(LB, 'dog', DX, DY, 208, C.pale, C.greenDark);
    Object.assign(dog.style, { border: '6px solid #fff', boxShadow: 'var(--shadow-soft)' });
    const person = badge(LB, 'user', PX, DY, 184, '#eceee8', C.inkSoft);
    Object.assign(person.style, { border: '6px solid #fff', boxShadow: 'var(--shadow-soft)' });
    const toy = badge(LB, 'toy-brick', 440, 722, 98, C.amberPale, C.amber);
    Object.assign(toy.style, { border: '4px solid #fff', boxShadow: 'var(--shadow-soft)' });
    // three tally pips under the scene
    const pipRow = K.el('div');
    Object.assign(pipRow.style, { position: 'absolute', left: '500px', top: '822px', display: 'flex', gap: '18px', alignItems: 'center' });
    const rep = K.icon('repeat', { size: 40, stroke: 2.4, color: C.green });
    pipRow.appendChild(rep);
    const pips = [0, 1, 2].map(() => {
      const p = K.el('div');
      Object.assign(p.style, { width: '26px', height: '26px', borderRadius: '50%', border: '4px solid ' + C.greenLight, background: '#fff', boxSizing: 'border-box' });
      pipRow.appendChild(p);
      return p;
    });
    LB.appendChild(pipRow);
    const tStage = cue(1) + 0.5;
    A.draw(tl, floor, tStage, 0.7);
    A.in(tl, dog, tStage + 0.1, 'pop', { dur: 0.6 });
    A.in(tl, toy, tStage + 0.35, 'pop', { dur: 0.5 });
    A.in(tl, pipRow, tStage + 0.5, 'fade', { dur: 0.5 });
    gsap.set(person, { x: OFF, opacity: 0 });

    // warning marks, one set per repetition: longer, thicker and redder each time
    const MARK = [[22, 6, '#d9912b'], [42, 9, '#cf6a2c'], [66, 12, C.red]];
    const markSets = MARK.map(([L, w, col]) => [-152, -122, -92, -62, -32].map(a => {
      const r = (a * Math.PI) / 180, r0 = 122;
      return K.line(markG, DX + r0 * Math.cos(r), DY + r0 * Math.sin(r), DX + (r0 + L) * Math.cos(r), DY + (r0 + L) * Math.sin(r), { stroke: col, 'stroke-width': w, opacity: 0 });
    }));
    // the first take lands on "takes", the third approach meets "reacting"
    const tTake = phraseAt(ctx, 1, 'takes an item', 0.4);
    const tC3 = Math.max(tTake + 2.6, sayAt(ctx, 1, 'reacting', 0.75, 0.5));
    let tC1 = tTake - 0.95;
    for (let j = 0; j < 4; j++) tC1 = tTake - 0.85 * Math.min(1, (tC3 - tC1) / 2 / 2.1) - 0.1;
    tC1 = Math.max(tStage + 0.9, tC1);
    const P = (tC3 - tC1) / 2;
    const k = Math.min(1, P / 2.1); // squeeze the take-away cycle when the narration is quick
    const takeCycle = (t0, i) => {
      const arrive = t0 + 0.85 * k;
      tl.to(pips[i], { background: C.green, borderColor: C.green, duration: 0.3 }, t0);
      tl.to(person, { opacity: 1, duration: 0.3, ease: 'power1.out' }, t0);
      tl.to(person, { x: 0, duration: 0.85 * k, ease: 'power2.out' }, t0);
      tl.fromTo(markSets[i], { opacity: 1, drawSVG: '0% 0%' }, { drawSVG: '0% 100%', duration: 0.3, stagger: 0.04, ease: 'power2.out', immediateRender: false }, t0 + 0.4 * k);
      tl.to(dog, { x: -8, duration: 0.12, yoyo: true, repeat: 1, ease: 'power1.inOut' }, t0 + 0.45 * k);
      tl.to(toy, { x: 118, y: -18, duration: 0.3 * k, ease: 'power2.inOut' }, arrive + 0.05);
      const tGo = arrive + 0.4 * k;
      tl.to([person, toy], { x: `+=${OFF}`, duration: 0.6 * k, ease: 'power2.in' }, tGo);
      tl.to([person, toy], { opacity: 0, duration: 0.3 * k, ease: 'power1.in' }, tGo + 0.3 * k);
      tl.to(markSets[i], { opacity: 0, duration: 0.35 }, tGo + 0.1);
      const tBack = tGo + 0.65 * k;
      tl.set(toy, { x: 0, y: 0 }, tBack);
      tl.to(toy, { opacity: 1, duration: 0.3 }, tBack + 0.02);
    };
    takeCycle(tC1, 0);
    takeCycle(tC1 + P, 1);
    // third time: the dog reacts as soon as the person starts to approach, and the warning is at its biggest
    tl.to(pips[2], { background: C.green, borderColor: C.green, duration: 0.3 }, tC3);
    tl.to(person, { opacity: 1, duration: 0.3, ease: 'power1.out' }, tC3);
    const tArr = Math.max(tC3 + 1.2, phraseAt(ctx, 1, 'approaches', 0.9) + 0.3);
    tl.to(person, { x: 60, duration: tArr - tC3, ease: 'power1.out' }, tC3);
    tl.fromTo(markSets[2], { opacity: 1, drawSVG: '0% 0%' }, { drawSVG: '0% 100%', duration: 0.35, stagger: 0.04, ease: 'power2.out', immediateRender: false }, tC3 + 0.45);
    tl.to(dog, { borderColor: C.red, backgroundColor: C.redPale, color: C.red, duration: 0.4 }, tC3 + 0.45);
    A.pulse(tl, dog, tC3 + 0.5, { scale: 1.06 });

    // ---------- beat 2: practice makes patterns stronger. The same encounter, the response lands sooner each time
    A.out(tl, LB, cue(2) - 0.3, 'fadeUp', { dur: 0.45 });
    const LC = layer(stage);
    const t3 = put(LC, 'c1-big', 'Practice makes *patterns stronger*', { x: 100, y: TY });
    A.in(tl, t3, cue(2) + 0.1, 'fadeUp', { dur: 0.8 });
    const RX = 230, RW = 850, RH = 116, TRK = 58, T0 = 60, T1 = 724, DOGX = 786;
    const ROWS = [['1st', 420, 540, 1.9], ['5th', 560, 330, 1.1], ['20th', 700, 100, 0.35]];
    const rows = ROWS.map(([lab, y, stopX, travel]) => {
      const card = K.el('div', 'c1-card');
      K.place(card, { x: RX, y, w: RW, h: RH });
      LC.appendChild(card);
      const rl = boxC(LC, 'c1c-rl', lab, { x: 60, y: y + RH / 2 - 22, w: 146 });
      const s = K.svg(card, { x: 0, y: 0, w: RW, h: RH });
      K.line(s, T0, TRK, T1, TRK, { stroke: '#d6ddcc', 'stroke-width': 6, 'stroke-dasharray': '2 14' });
      const trail = K.line(s, T0, TRK, stopX, TRK, { stroke: C.greenLight, 'stroke-width': 8 });
      const dg = badge(card, 'dog', DOGX, TRK, 88, C.pale, C.greenDark);
      const pr = badge(card, 'user', T0, TRK, 72, '#eceee8', C.inkSoft);
      Object.assign(pr.style, { border: '3px solid #fff', boxShadow: '0 4px 10px rgba(40,60,20,0.12)' });
      const mx = stopX + 74;
      const ring = badge(card, 'zap', mx, TRK, 60, 'transparent', 'transparent');
      Object.assign(ring.style, { border: '4px solid ' + C.red, opacity: 0 });
      const mk = badge(card, 'zap', mx, TRK, 60, C.red, '#fff');
      Object.assign(mk.style, { border: '4px solid #fff', boxShadow: '0 6px 14px rgba(184,69,45,0.30)' });
      return { card, rl, trail, pr, mk, ring, stopX, travel, mx: RX + mx };
    });
    const tR = [
      Math.max(cue(2) + 0.6, sayAt(ctx, 2, 'practices a response', 0.1, 0.3)),
      sayAt(ctx, 2, 'practice makes patterns', 0.3, 0.3),
      sayAt(ctx, 2, 'repeatedly barks', 0.5, 0.4),
    ];
    tR[1] = Math.max(tR[1], tR[0] + 3.2);
    tR[2] = Math.max(tR[2], tR[1] + 2.6);
    rows.forEach((r, i) => {
      const t = tR[i];
      A.in(tl, [r.rl, r.card], t, 'fadeUp', { dur: 0.6, stagger: 0.08 });
      const tw = t + 0.7;
      tl.to(r.pr, { x: r.stopX - T0, duration: r.travel, ease: 'power1.inOut' }, tw);
      A.draw(tl, r.trail, tw, r.travel, { ease: 'power1.inOut' });
      const tHit = tw + r.travel - 0.05;
      tl.fromTo(r.mk, { opacity: 0, y: -46, scale: 0.6 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(2.6)' }, tHit);
      tl.fromTo(r.ring, { opacity: 0.9, scale: 1 }, { opacity: 0, scale: 1.9, duration: 0.7, ease: 'power2.out', immediateRender: false }, tHit + 0.3);
    });
    // "sooner": an arrow runs back from the first response to the twentieth
    const SYA = 876;
    const asvg = K.svg(LC, { x: 0, y: 0, w: 1920, h: 1080 });
    const aLine = K.line(asvg, rows[0].mx, SYA, rows[2].mx - 6, SYA, { stroke: C.red, 'stroke-width': 6 });
    const aHead = K.path(asvg, `M ${rows[2].mx + 14} ${SYA - 16} L ${rows[2].mx - 6} ${SYA} L ${rows[2].mx + 14} ${SYA + 16}`, { stroke: C.red, 'stroke-width': 6 });
    const soon = boxC(LC, 'c1c-soon', 'Sooner', { x: rows[2].mx - 30 - 200, y: SYA - 18, w: 200 });
    const tSoon = Math.max(tR[2] + 2.0, sayAt(ctx, 2, 'sooner', 0.8, 0.3));
    A.draw(tl, aLine, tSoon, 0.7);
    A.in(tl, aHead, tSoon + 0.6, 'fade', { dur: 0.2 });
    A.in(tl, soon, tSoon + 0.5, 'fadeLeft', { dur: 0.5 });
    rows.forEach((r, i) => A.pulse(tl, r.mk, tSoon + 0.2 + i * 0.15, { scale: 1.18 }));

    // ---------- beat 3: the path across the lawn wears in, then a new path
    tl.to(LC, { opacity: 0, duration: 0.5, ease: 'power2.in' }, cue(3) - 0.3);
    const LD = layer(stage);
    const t4 = put(LD, 'c1-big', 'Every rehearsal *deepens the path*', { x: 100, y: TY });
    A.in(tl, t4, cue(3) + 0.1, 'fadeUp', { dur: 0.8 });
    const LW = 980, LH = 530, LX = 100, LYp = 412;
    const lawn = K.svg(LD, { x: LX, y: LYp, w: LW, h: LH });
    const defs = K.svgEl('defs', {}, lawn);
    const g = K.svgEl('linearGradient', { id: 'c1c-lawn', x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    K.svgEl('stop', { offset: '0', 'stop-color': '#d6e9bf' }, g);
    K.svgEl('stop', { offset: '1', 'stop-color': '#a7cb80' }, g);
    const clip = K.svgEl('clipPath', { id: 'c1c-lawnclip' }, defs);
    K.rect(clip, 0, 0, LW, LH, { rx: 26 });
    const reveal = K.svgEl('clipPath', { id: 'c1c-newclip', clipPathUnits: 'userSpaceOnUse' }, defs);
    const revealR = K.rect(reveal, -40, 0, 0, LH, { fill: '#fff' });
    const body = K.group(lawn, { 'clip-path': 'url(#c1c-lawnclip)' });
    K.rect(body, 0, 0, LW, LH, { fill: 'url(#c1c-lawn)' });
    let seed = 7;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    for (let i = 0; i < 52; i++) {
      const x = 30 + rnd() * (LW - 60), y = 40 + rnd() * (LH - 60), s = 0.8 + rnd() * 0.6;
      K.path(body, `M ${x} ${y} l ${-7 * s} ${-20 * s} M ${x} ${y} l 0 ${-26 * s} M ${x} ${y} l ${7 * s} ${-20 * s}`,
        { stroke: rnd() > 0.5 ? '#86b556' : '#79a94b', 'stroke-width': 4, opacity: 0.55 + rnd() * 0.35 });
    }
    const pathD = 'M -30 380 C 190 385, 305 275, 500 242 S 815 132, 1010 56';
    const newD = 'M -30 482 C 220 482, 362 405, 552 377 S 858 316, 1010 288';
    const worn = K.path(body, pathD, { stroke: '#cdb285', 'stroke-width': 0 });
    const wornIn = K.path(body, pathD, { stroke: '#b8966a', 'stroke-width': 0, opacity: 0.75 });
    const dotted = K.path(body, pathD, { stroke: '#6f6446', 'stroke-width': 7, 'stroke-dasharray': '0.1 24', opacity: 0.6 });
    const freshG = K.group(body, { 'clip-path': 'url(#c1c-newclip)' });
    K.path(freshG, newD, { stroke: '#ffffff', 'stroke-width': 20, 'stroke-dasharray': '0.1 26', opacity: 0.75 });
    K.path(freshG, newD, { stroke: C.greenDark, 'stroke-width': 12, 'stroke-dasharray': '0.1 26' });
    K.rect(lawn, 2, 2, LW - 4, LH - 4, { rx: 25, fill: 'none', stroke: '#ffffff', 'stroke-width': 4, opacity: 0.7 });
    lawn.style.filter = 'drop-shadow(0 18px 40px rgba(40,60,20,0.16))';
    const newp = boxC(LD, 'c1c-newp', null, { x: LX + 700, y: LYp + 400 });
    newp.appendChild(K.icon('sprout'));
    newp.appendChild(K.el('span', null, 'New path'));

    const t3c = cue(3);
    tl.fromTo(lawn, { opacity: 0, scale: 0.96, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' }, t3c + 0.1);
    tl.fromTo(dotted, { opacity: 0 }, { opacity: 0.6, duration: 0.6 }, t3c + 0.6);
    const w1 = clamp(sayAt(ctx, 3, 'walk it every day', 0.25, 0.2), t3c + 1.0, dur - 6.4);
    const w2 = clamp(sayAt(ctx, 3, 'it wears in', 0.4, 0.2), w1 + 1.0, dur - 5.4);
    const w3 = clamp(sayAt(ctx, 3, 'without thinking', 0.6, 0.3), w2 + 0.9, dur - 4.4);
    tl.set(worn, { attr: { 'stroke-width': 12 } }, w1);
    A.draw(tl, worn, w1, 0.9, { ease: 'power1.inOut' });
    tl.to(worn, { attr: { 'stroke-width': 34 }, duration: 0.7, ease: 'power2.out' }, w2);
    tl.to(dotted, { opacity: 0.25, duration: 0.7 }, w2);
    tl.to(worn, { attr: { 'stroke-width': 78 }, duration: 0.8, ease: 'power2.out' }, w3);
    tl.to(wornIn, { attr: { 'stroke-width': 34 }, duration: 0.8, ease: 'power2.out' }, w3 + 0.1);
    tl.to(dotted, { opacity: 0, duration: 0.6 }, w3);
    const tn = clamp(sayAt(ctx, 3, 'the good news', 0.7, 0.1), w3 + 0.9, dur - 2.6);
    tl.fromTo(revealR, { attr: { width: 0 } }, { attr: { width: LW + 80 }, duration: 1.6, ease: 'power1.inOut' }, tn);
    tl.fromTo(newp, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.55, ease: 'back.out(1.8)' },
      Math.min(Math.max(tn + 0.9, sayAt(ctx, 3, 'new path', 0.9, 0.3)), dur - 1.8));
  });
})();
