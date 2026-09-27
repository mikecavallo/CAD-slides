// Chapter 6: The reactive walk: before, during and after training (deck slides 9 to 13).
// All four scenes share one ABC strip geometry so the chapter reads like the deck building up.
(function () {
  const OLIVE = '#4b5a1e', GREEN = '#619537', GREEN_DARK = '#3f6b22', RED = '#b8452d';
  const PALE_ARROW = '#cdd3c2';

  // ---- shared strip geometry (K.abc with a custom panel height) ----
  const SX = 140, SW = 1640, SG = 70, COLW = (SW - 2 * SG) / 3; // 500 px columns
  const LY = 112;               // tab (label) top
  const PH = 272;               // panel height
  const TOP = LY + 86;          // column top used by K.abc
  const PT = TOP + 128;         // panel top (head 112 + 16 margin)
  const CAP_T = PT + PH + 14;   // caption top
  const CAP_B = CAP_T + 100;    // caption bottom
  const BAND = CAP_B + 22;      // first row below the captions
  const colX = i => SX + i * (COLW + SG);

  const CSS = `
  .c6 .abc-col .panel { overflow: visible; border-color: transparent; background: transparent; box-shadow: none; }
  .c6 .c6-win { position: absolute; inset: 0; overflow: hidden; border-radius: 18px; background: rgba(255,255,255,0.78); }
  .c6 .c6-win img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 62%; }
  .c6 .c6-frame { position: absolute; left: -6px; top: -6px; overflow: visible; pointer-events: none; }
  .c6 .abc-col .cap { min-height: 100px; }
  .c6 .abc-label { transform-origin: 50% 50%; }
  .c6-alarm { position: absolute; width: 66px; height: 66px; }
  .c6-alarm .ring { position: absolute; inset: 0; border-radius: 50%; border: 5px solid var(--red); }
  .c6-alarm .dot { position: absolute; inset: 0; border-radius: 50%; background: var(--red); color: #fff; display: grid; place-items: center; border: 4px solid #fff; box-shadow: 0 6px 16px rgba(60,20,10,0.28); }
  .c6-alarm .dot svg { width: 34px; height: 34px; }
  .c6-note { font: 700 32px/1.3 var(--font-body); color: var(--red); text-align: center; white-space: nowrap; }
  .c6-looplabel { position: absolute; font: 700 30px/1.2 var(--font-body); text-align: center; white-space: nowrap; }
  .c6-callout { position: absolute; border-radius: 26px; background: var(--green-mist); border: 2px solid var(--green-pale); box-shadow: var(--shadow-soft); overflow: hidden; }
  .c6-callout::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 12px; background: var(--green); }
  .c6-callout .ln { position: absolute; inset: 0; display: grid; place-items: center; text-align: center; padding: 0 50px 0 62px; font: 700 54px/1.15 var(--font-head); color: var(--green-dark); }
  .c6-tiles { position: absolute; display: flex; justify-content: space-between; }
  .c6-tile { position: relative; display: flex; flex-direction: column; align-items: center; gap: 8px; }
  .c6-tile .b { width: 64px; height: 64px; border-radius: 50%; background: var(--green-pale); color: var(--green-dark); display: grid; place-items: center; }
  .c6-tile .b svg { width: 36px; height: 36px; stroke-width: 2.2; }
  .c6-tile .l { font: 600 26px/1.2 var(--font-body); color: var(--ink-soft); white-space: nowrap; }
  .c6-eye { position: absolute; width: 68px; height: 68px; border-radius: 50%; background: #fff; color: var(--green-dark); display: grid; place-items: center; box-shadow: 0 6px 18px rgba(30,50,15,0.32); }
  .c6-eye svg { width: 40px; height: 40px; }
  .c6-trythis { position: absolute; display: inline-flex; align-items: center; gap: 10px; padding: 10px 24px 10px 18px; border-radius: 999px; background: var(--green); color: #fff; font: 700 28px/1 var(--font-body); white-space: nowrap; box-shadow: 0 6px 16px rgba(30,50,15,0.25); }
  .c6-trythis svg { width: 32px; height: 32px; }
  .c6-card { position: absolute; background: #fff; border-radius: 30px; box-shadow: var(--shadow); border: 1px solid #e6e9e1; }
  .c6-bubble-txt { position: absolute; display: grid; place-items: center; text-align: center; font: 700 56px/1.1 var(--font-head); color: var(--green-dark); }
  .c6-plan { font: 700 56px/1.15 var(--font-head); color: var(--green-dark); text-align: center; }
  .c6-spark { position: absolute; }
  .c6-halo { position: absolute; border-radius: 50%; background: radial-gradient(closest-side, rgba(232,241,220,0.95), rgba(232,241,220,0.55) 55%, rgba(232,241,220,0) 100%); }
  .c6-wins { font: 600 50px/1.2 var(--font-body); color: var(--ink); text-align: center; }
  `;

  function setup(stage) {
    stage.classList.add('c6');
    stage.appendChild(K.el('style', null, CSS));
  }

  function layer(stage) {
    const g = K.el('div', 'c6-layer');
    g.style.cssText = 'position:absolute;inset:0;';
    stage.appendChild(g);
    return g;
  }

  /** ABC strip with SVG-drawn frames (so frames can draw in) and an inner image window. */
  function strip(parent, o) {
    const S = K.abc(parent, {
      x: SX, y: LY, w: SW, gap: SG, panelH: PH, capH: 100,
      panels: o.panels, captions: o.captions, label: o.label, labelVariant: o.labelVariant,
    });
    S.cols.forEach(c => {
      const win = K.el('div', 'c6-win');
      c.panel.insertBefore(win, c.img);
      win.appendChild(c.img);
      const svg = K.svgEl('svg', { class: 'c6-frame', width: COLW, height: PH, viewBox: `0 0 ${COLW} ${PH}` });
      c.frame = K.svgEl('rect', { x: 3, y: 3, width: COLW - 6, height: PH - 6, rx: 21, fill: 'none', stroke: OLIVE, 'stroke-width': 6 }, svg);
      c.panel.appendChild(svg);
      c.win = win;
    });
    S.arrows.forEach(a => (a.style.top = (PT + PH / 2 - 23) + 'px'));
    return S;
  }

  /** Loop arrow from the top of panel C back to the top of panel B, with an optional label above it. */
  function loop(parent, color, text) {
    const x1 = colX(2) + 100, x2 = colX(1) + COLW - 100, y = PT - 4, peak = PT - 168;
    const svg = K.svg(parent, { x: 0, y: 0, w: 1920, h: 1080 });
    const p = K.path(svg, `M ${x1} ${y} C ${x1} ${peak}, ${x2} ${peak}, ${x2} ${y - 16}`, { stroke: color, 'stroke-width': 8 });
    const head = K.path(svg, `M ${x2 - 16} ${y - 26} L ${x2} ${y - 4} L ${x2 + 16} ${y - 26}`, { stroke: color, 'stroke-width': 8 });
    const label = text ? K.text(parent, text, { cls: 'c6-looplabel', x: (x1 + x2) / 2 - 320, y: PT - 182, w: 640, color }) : null;
    return { svg, p, head, label };
  }

  /** Reveal a loop: draw the curve, then the arrowhead and label. */
  function showLoop(tl, L, t) {
    A.draw(tl, L.p, t, 1.1);
    A.in(tl, L.head, t + 1.0, 'fade', { dur: 0.25 });
    if (L.label) A.in(tl, L.label, t + 0.7, 'fadeUp', { dur: 0.6 });
  }

  /** Fill a panel with its illustration and reveal its caption. */
  function fill(tl, c, t) {
    tl.fromTo(c.img, { opacity: 0, scale: 1.12 }, { opacity: 1, scale: 1, duration: 1.0, ease: 'power2.out' }, t);
    if (c.cap) A.in(tl, c.cap, t + 0.3, 'fadeUp', { dur: 0.6 });
  }

  /** Centered check / cross list under a column. */
  function cxUnder(parent, i, items, y) {
    const f = K.flow(parent, { x: colX(i), y, w: COLW, align: 'center', gap: 0 });
    return K.cx(f, items, { cols: items.length > 1 ? 2 : 1 });
  }

  const BEFORE = ['abc_before_a.jpg', 'abc_before_b.jpg', 'abc_before_c.jpg'];
  const DURING = ['abc_during_a.jpg', 'abc_during_b.jpg', 'abc_during_c.jpg'];
  const AFTER = ['abc_after_a.jpg', 'abc_after_b.jpg', 'abc_after_c.jpg'];
  const CAP_C = 'Space is given.<br>The situation ends.';

  // ================================================================ ch06s01 Before training
  registerScene('ch06s01', ({ stage, tl, cue, end }) => {
    setup(stage);
    const span = i => end(i) - cue(i);
    const at = (i, f) => window.fracTime(window.__ctx, i, f);
    const S = strip(stage, {
      label: 'Before training', labelVariant: 'red', panels: BEFORE,
      captions: ['Another dog appears too close.', 'Barking · Lunging · Growling', CAP_C],
    });

    // beat 0: red tab slides in, three empty frames draw in with arrows between them
    A.in(tl, S.label, Math.max(0, cue(0) - 0.25), 'fadeRight', { dur: 0.7 });
    S.cols.forEach((c, i) => {
      const t = cue(0) + 0.35 + i * 0.45;
      A.in(tl, c.head, t, 'fadeUp', { dur: 0.6 });
      A.draw(tl, c.frame, t + 0.1, 1.0);
      A.in(tl, c.win, t + 0.55, 'fade', { dur: 0.6 });
    });
    S.arrows.forEach((a, i) => A.in(tl, a, cue(0) + 1.05 + i * 0.45, 'fadeRight', { dur: 0.5 }));

    // beats 1 to 3: panels fill with the illustrations and captions
    [0, 1, 2].forEach(i => fill(tl, S.cols[i], cue(i + 1)));

    // beat 1: smoke alarm blinks red in panel A's corner
    const alarm = K.el('div', 'c6-alarm');
    // sits on the frame's top-right corner like a notification badge, clear of the handler's face
    K.place(alarm, { x: colX(0) + COLW - 33, y: PT - 33 });
    const ring = K.el('div', 'ring'), dot = K.el('div', 'dot');
    dot.appendChild(K.icon('alarm-smoke', { stroke: 2.2 }));
    alarm.appendChild(ring); alarm.appendChild(dot);
    stage.appendChild(alarm);
    // the alarm goes off on "The smoke alarm goes off", not before
    const tAlarm = at(1, 0.6);
    A.in(tl, alarm, tAlarm, 'pop', { dur: 0.5 });
    tl.fromTo(ring, { opacity: 0.85, scale: 1 }, { opacity: 0, scale: 1.9, duration: 0.8, ease: 'power1.out', repeat: 4 }, tAlarm + 0.2);
    tl.to(dot, { backgroundColor: '#e8664a', duration: 0.4, yoyo: true, repeat: 7, ease: 'sine.inOut' }, tAlarm + 0.2);

    // beat 4: red loop from C back to B ("barking got it"), then the deck's red note types on
    // (no loop label: the red note is this beat's only text)
    const L = loop(stage, RED, null);
    showLoop(tl, L, at(4, 0.18));
    const nf = K.flow(stage, { x: SX, y: BAND + 66, w: SW, align: 'center', gap: 0 });
    const note = K.text(nf, 'Getting more space can make this behavior more likely next time.', { cls: 'c6-note' });
    const chars = new SplitText(note, { type: 'words,chars' }).chars;
    tl.fromTo(chars, { opacity: 0 }, { opacity: 1, duration: 0.01, stagger: 0.034, ease: 'none' }, at(4, 0.5));

    // beat 5: attention on the payoff box, then on "Leaving is still right" its outline turns bright green
    const capC = S.cols[2].cap;
    A.pulse(tl, capC, cue(5) + 0.2, { scale: 1.04 });
    const tKeep = at(5, 0.56);
    tl.to(capC, { borderColor: GREEN, backgroundColor: '#f3f8ec', boxShadow: '0 0 0 9px rgba(97,149,55,0.22)', duration: 0.7, ease: 'power2.out' }, tKeep);
    A.pulse(tl, capC, tKeep + 0.05, { scale: 1.04 });
    // the green takeaway replaces the red note in the same slot
    const cf = K.flow(stage, { x: SX, y: BAND + 56, w: SW, align: 'center', gap: 0 });
    const chip = K.chip(cf, 'Leaving is still right', { icon: 'circle-check', variant: 'green' });
    A.out(tl, note, tKeep + 0.1, 'fadeUp', { dur: 0.45 });
    A.in(tl, chip, tKeep + 0.4, 'fadeUp', { dur: 0.7 });
  });

  // ================================================================ ch06s02 During training: the A
  registerScene('ch06s02', ({ stage, tl, cue, end }) => {
    setup(stage);
    const span = i => end(i) - cue(i);
    const at = (i, f) => window.fracTime(window.__ctx, i, f);
    const S = strip(stage, { label: 'During training', labelVariant: 'green', panels: DURING, captions: ['Management.'] });
    const [cA, cB, cC] = S.cols;

    // opening state: red tab + empty frames (where the last scene left off)
    const red = K.el('div', 'abc-label red', 'Before training');
    K.place(red, { x: SX, y: LY });
    stage.appendChild(red);
    A.in(tl, red, 0, 'fade', { dur: 0.35 });
    A.in(tl, S.cols.map(c => c.root), 0.05, 'fade', { dur: 0.4 });
    A.in(tl, S.arrows, 0.05, 'fade', { dur: 0.4 });
    S.cols.forEach(c => tl.set(c.img, { opacity: 0 }, 0));

    // beat 0: tab flips to green "During training"; A fills, B and C ghosted
    const t0 = Math.max(0.4, cue(0) - 0.05);
    tl.to(red, { rotationX: -90, transformPerspective: 700, duration: 0.28, ease: 'power2.in' }, t0);
    tl.set(red, { opacity: 0 }, t0 + 0.28);
    tl.fromTo(S.label, { rotationX: 90, transformPerspective: 700 }, { rotationX: 0, duration: 0.45, ease: 'power2.out' }, t0 + 0.28);
    tl.fromTo(cA.img, { opacity: 0, scale: 1.12 }, { opacity: 1, scale: 1, duration: 1.0, ease: 'power2.out' }, t0 + 0.4);
    [cB, cC].forEach((c, k) => {
      c.img.style.filter = 'grayscale(1)';
      tl.fromTo(c.img, { opacity: 0 }, { opacity: 1, duration: 0.9 }, t0 + 0.5 + k * 0.1);
      A.dim(tl, [c.head, c.panel], t0 + 0.5 + k * 0.1, 0.36, { dur: 0.7 });
    });
    S.arrows.forEach(a => A.set(tl, a, t0 + 0.5, { color: PALE_ARROW }, 0.7));

    // callout card (right) carries each beat's short on-screen text
    const card = K.el('div', 'c6-callout');
    K.place(card, { x: colX(1) + 40, y: CAP_T + 52, w: 2 * COLW + SG - 80, h: 220 });
    stage.appendChild(card);
    const lines = ['Change A. Change B. Keep C.', 'A is for management', 'Calm dogs can learn', 'Spot it first'].map(s => {
      const n = K.el('div', 'ln', K.md(s));
      card.appendChild(n);
      return n;
    });
    A.in(tl, card, t0 + 0.9, 'fadeUp', { dur: 0.7 });
    A.in(tl, lines[0], t0 + 1.1, 'fadeUp', { dur: 0.6 });

    // beat 1: "Management." pops under A with four management icons
    A.in(tl, cA.cap, cue(1) + 0.15, 'pop', { dur: 0.6 });
    A.out(tl, lines[0], cue(1) + 0.15, 'fadeUp', { dur: 0.4 });
    A.in(tl, lines[1], cue(1) + 0.45, 'fadeUp', { dur: 0.6 });
    // tiles spread across the full column width so the labels get even breathing room
    const tileRow = K.el('div', 'c6-tiles');
    K.place(tileRow, { x: colX(0) + 4, y: BAND, w: COLW - 8 });
    stage.appendChild(tileRow);
    const tiles = [['move-horizontal', 'Distance'], ['map', 'Routes'], ['clock', 'Timing'], ['undo-2', 'U-turn']].map(([ic, lbl]) => {
      const t = K.el('div', 'c6-tile');
      const b = K.el('div', 'b');
      b.appendChild(K.icon(ic));
      t.appendChild(b);
      t.appendChild(K.el('div', 'l', lbl));
      tileRow.appendChild(t);
      return t;
    });
    [0.25, 0.35, 0.47, 0.64].forEach((f, k) => A.in(tl, tiles[k], at(1, f), 'pop', { dur: 0.55 }));

    // beat 2: X Surprised / Overwhelmed, then check Calm / Learning
    const cx = cxUnder(stage, 0, [
      { t: 'Surprised', yes: false }, { t: 'Calm', yes: true },
      { t: 'Overwhelmed', yes: false }, { t: 'Learning', yes: true },
    ], BAND + 126);
    A.in(tl, cx.items[0], at(2, 0.14), 'fadeRight', { dur: 0.5 });
    A.in(tl, cx.items[2], at(2, 0.27), 'fadeRight', { dur: 0.5 });
    A.in(tl, cx.items[1], at(2, 0.43), 'fadeRight', { dur: 0.5 });
    A.in(tl, cx.items[3], at(2, 0.85), 'fadeRight', { dur: 0.5 });
    A.out(tl, lines[1], at(2, 0.43), 'fadeUp', { dur: 0.4 });
    A.in(tl, lines[2], at(2, 0.43) + 0.3, 'fadeUp', { dur: 0.6 });

    // beat 3: the callout becomes a "Try this" tip card ("Spot it first"); in panel A an eye badge
    // watches over a distance bar stretching between the two dogs (the head start)
    const tip = K.el('div', 'c6-trythis');
    tip.appendChild(K.icon('notebook-pen', { stroke: 2.4 }));
    tip.appendChild(K.el('span', null, 'Try this'));
    K.place(tip, { x: colX(1) + 40 - 22, y: CAP_T + 52 - 26 });
    stage.appendChild(tip);
    tl.set(tip, { rotation: -4 }, 0);
    A.in(tl, tip, cue(3) + 0.1, 'pop', { dur: 0.6 });
    const tSpot = at(3, 0.2);
    A.out(tl, lines[2], tSpot, 'fadeUp', { dur: 0.4 });
    A.in(tl, lines[3], tSpot + 0.3, 'fadeUp', { dur: 0.6 });

    // panel A window: x colX(0)+6, y PT+6, 488 x 260; image drawn at 0.8257 scale, shifted up 12.8 px
    const wx = colX(0) + 6, wy = PT + 6;
    const bx1 = wx + 262, bx2 = wx + 392, by = wy + 104;
    const svg = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const barG = K.group(svg);
    const barShadow = K.line(barG, bx1, by, bx2, by, { stroke: 'rgba(20,35,10,0.45)', 'stroke-width': 11, 'stroke-linecap': 'butt' });
    const bar = K.line(barG, bx1, by, bx2, by, { stroke: '#fff', 'stroke-width': 6, 'stroke-linecap': 'butt' });
    const ends = [bx1, bx2].map(x => K.circle(barG, x, by, 9, { fill: GREEN, stroke: '#fff', 'stroke-width': 4 }));
    const ticks = [[bx1, wy + 140], [bx2, wy + 124]].map(([x, y2]) => K.line(barG, x, by + 10, x, y2, { stroke: '#fff', 'stroke-width': 4, 'stroke-dasharray': '2 8' }));
    const eye = K.el('div', 'c6-eye');
    eye.appendChild(K.icon('eye', { stroke: 2.4 }));
    K.place(eye, { x: (bx1 + bx2) / 2 - 34, y: wy + 14 });
    stage.appendChild(eye);
    A.pulse(tl, cA.panel, tSpot, { scale: 1.03 });
    A.in(tl, eye, tSpot + 0.1, 'pop', { dur: 0.6 });
    const tBar = at(3, 0.5);
    A.in(tl, [bar, barShadow], tBar, 'fade', { dur: 0.1 });
    tl.fromTo([bar, barShadow], { attr: { x2: bx1 } }, { attr: { x2: bx2 }, duration: 0.8, ease: 'power2.inOut' }, tBar + 0.05);
    A.in(tl, ends[0], tBar, 'fade', { dur: 0.3 });
    A.in(tl, ends[1], tBar + 0.75, 'fade', { dur: 0.3 });
    A.in(tl, ticks, tBar + 0.8, 'fade', { dur: 0.4 });
  });

  // ================================================================ ch06s03 During training: the B and C
  registerScene('ch06s03', ({ stage, tl, cue, end }) => {
    setup(stage);
    const span = i => end(i) - cue(i);
    const at = (i, f) => window.fracTime(window.__ctx, i, f);
    const G = layer(stage);
    const S = strip(G, {
      label: 'During training', labelVariant: 'green', panels: DURING,
      captions: ['Management.', 'Teaching new behaviors.', CAP_C],
    });
    stage.appendChild(S.label);
    const [cA, cB, cC] = S.cols;
    const cxA = cxUnder(G, 0, [
      { t: 'Surprised', yes: false }, { t: 'Calm', yes: true },
      { t: 'Overwhelmed', yes: false }, { t: 'Learning', yes: true },
    ], BAND);

    // opening state: A in color with its list, B and C ghosted (end of the last scene)
    [cB, cC].forEach(c => {
      c.img.style.filter = 'grayscale(1)';
      c.head.style.opacity = 0.36;
      c.panel.style.opacity = 0.36;
    });
    S.arrows.forEach(a => (a.style.color = PALE_ARROW));
    A.in(tl, [S.label, ...S.cols.map(c => c.root), ...S.arrows, cxA.root], 0, 'fade', { dur: 0.45 });

    // beat 0: B comes into full color, "Teaching new behaviors."
    const t0 = cue(0);
    A.undim(tl, [cB.head, cB.panel], t0, { dur: 0.8 });
    A.set(tl, cB.img, t0, { filter: 'grayscale(0)' }, 0.9);
    A.set(tl, S.arrows[0], t0, { color: OLIVE }, 0.6);
    A.in(tl, cB.cap, t0 + 0.35, 'pop', { dur: 0.6 });
    A.dim(tl, [cA.panel, cA.cap, cA.head, cxA.root], t0 + 0.2, 0.55, { dur: 0.8 });

    // beat 1: X barking / growling / lunging, then checks for the new behaviors
    const cxB = cxUnder(G, 1, [
      { t: 'Barking', yes: false }, { t: 'Check-ins', yes: true },
      { t: 'Growling', yes: false }, { t: 'Loose leash', yes: true },
      { t: 'Lunging', yes: false }, { t: 'Leave it', yes: true },
    ], BAND);
    // timed to the words: "...barking, growling or lunging away" then "check-ins", "loose-leash", "leave it"
    [0.07, 0.11, 0.17].forEach((f, k) => A.in(tl, cxB.items[2 * k], at(1, f), 'fadeRight', { dur: 0.5 }));
    [0.47, 0.69, 0.78].forEach((f, k) => A.in(tl, cxB.items[2 * k + 1], at(1, f), 'fadeRight', { dur: 0.5 }));

    // beat 2: C comes into full color with its caption and "Same payoff: relief"
    const t2 = cue(2);
    A.undim(tl, [cC.head, cC.panel], t2, { dur: 0.8 });
    A.set(tl, cC.img, t2, { filter: 'grayscale(0)' }, 0.9);
    A.set(tl, S.arrows[1], t2, { color: OLIVE }, 0.6);
    A.in(tl, cC.cap, t2 + 0.35, 'pop', { dur: 0.6 });
    const cxC = cxUnder(G, 2, [{ t: 'Same payoff: *relief*', yes: true }], BAND);
    A.in(tl, cxC.items[0], t2 + 1.1, 'fadeUp', { dur: 0.6 });

    // beat 3: toddler analogy (the strip steps back while the card is up)
    const t3 = cue(3);
    A.out(tl, G, t3, 'fade', { dur: 0.5 });
    const card = K.el('div', 'c6-card');
    const CX = 330, CY = 262, CW = 1260, CH = 500;
    K.place(card, { x: CX, y: CY, w: CW, h: CH });
    stage.appendChild(card);
    const baby = K.iconBadge(card, 'baby', { x: 100, y: 88, size: 230, variant: 'red' });
    // speech bubble: jagged red scribble bubble that smooths into a calm one
    const BW = 760, BH = 300;
    const bub = K.el('div');
    bub.style.cssText = `position:absolute;left:400px;top:40px;width:${BW}px;height:${BH}px;`;
    card.appendChild(bub);
    const bsvg = K.svg(bub, { x: 0, y: 0, w: BW, h: BH });
    const smoothD = 'M 110 20 H 700 Q 740 20 740 60 V 220 Q 740 260 700 260 H 170 L 30 290 L 100 238 Q 70 226 70 196 V 60 Q 70 20 110 20 Z';
    const n = 26, cxp = 412, cyp = 140, rx = 318, ry = 116;
    const pts = [];
    for (let k = 0; k < n; k++) {
      const a = Math.PI + (k / n) * Math.PI * 2;
      const r = k % 2 ? 0.82 : 1.05;
      pts.push(`${(cxp + Math.cos(a) * rx * r).toFixed(1)} ${(cyp + Math.sin(a) * ry * r).toFixed(1)}`);
    }
    // the tail (pointing at the baby) sits between two outline points on the lower left
    const jaggedD = 'M ' + pts.map((p, k) => (k === 23 ? 'L 30 290 L ' : k ? 'L ' : '') + p).join(' ') + ' Z';
    const bubble = K.path(bsvg, jaggedD, { fill: '#f8e3dd', stroke: RED, 'stroke-width': 7 });
    let sd = '';
    for (let k = 0; k <= 180; k++) {
      const u = k / 180, th = u * Math.PI * 2 * 5.5;
      sd += (k ? ' L ' : 'M ') + (262 + 300 * u + 36 * Math.cos(th + Math.PI)).toFixed(1) + ' ' + (140 + 44 * Math.sin(th)).toFixed(1);
    }
    const scribble = K.path(bsvg, sd, { stroke: RED, 'stroke-width': 6 });
    const btxt = K.el('div', 'c6-bubble-txt', 'I need a break');
    btxt.style.cssText += 'left:70px;top:20px;width:670px;height:240px;';
    bub.appendChild(btxt);
    const lesson = K.el('div', 'c6-plan', '<span class="c6-l1">Same need,</span> <span class="c6-l2">new words</span>');
    K.place(lesson, { x: 0, y: 378, w: CW });
    lesson.style.position = 'absolute';
    card.appendChild(lesson);

    A.in(tl, card, t3 + 0.35, 'fadeUp', { dur: 0.7 });
    A.in(tl, baby, t3 + 0.6, 'pop', { dur: 0.6 });
    A.in(tl, bub, t3 + 0.9, 'pop', { dur: 0.5 });
    A.draw(tl, scribble, t3 + 1.1, 1.2);
    tl.to(bub, { x: 5, duration: 0.07, yoyo: true, repeat: 13, ease: 'none' }, t3 + 1.3);
    const tm = at(3, 0.64);
    tl.to(scribble, { opacity: 0, duration: 0.3 }, tm);
    tl.to(bubble, { morphSVG: smoothD, duration: 1.0, ease: 'power2.inOut' }, tm);
    tl.to(bubble, { fill: '#f3f8ec', stroke: GREEN, duration: 1.0, ease: 'power2.inOut' }, tm);
    tl.to(baby, { backgroundColor: '#e8f1dc', color: GREEN_DARK, duration: 1.0 }, tm);
    A.in(tl, btxt, tm + 0.6, 'fadeUp', { dur: 0.6 });
    // "Same need," lands on "you don't cancel the break"; "new words" only once the bubble has become words
    const [l1, l2] = lesson.querySelectorAll('span');
    [l1, l2].forEach(s => (s.style.display = 'inline-block'));
    A.in(tl, l1, at(3, 0.45), 'fadeUp', { dur: 0.7 });
    A.in(tl, l2, tm + 1.0, 'fadeUp', { dur: 0.7 });

    // beat 4: back to the strip, green loop from C back to B
    const t4 = cue(4);
    A.out(tl, card, t4 - 0.15, 'fade', { dur: 0.45 });
    tl.to(G, { opacity: 1, duration: 0.6, ease: 'power2.out' }, t4 + 0.2);
    const L = loop(G, GREEN, 'Now calm gets reinforced');
    showLoop(tl, L, t4 + 0.6);
  });

  // ================================================================ ch06s04 After training
  registerScene('ch06s04', ({ stage, tl, cue, end, dur }) => {
    setup(stage);
    const span = i => end(i) - cue(i);
    const at = (i, f) => window.fracTime(window.__ctx, i, f);
    const S = strip(stage, {
      label: 'After training', labelVariant: 'green', panels: AFTER,
      captions: ['Less management as skills improve.', 'Readily uses the new behavior.', CAP_C],
    });
    const [cA, cB, cC] = S.cols;

    // beat 0: on "And after training?" the green tab slides in and the empty frames draw in;
    // then the after panels fill one per clause (less management / new behavior / still ends with space)
    A.in(tl, S.label, Math.max(0, cue(0) - 0.25), 'fadeRight', { dur: 0.7 });
    S.cols.forEach((c, i) => {
      const t = cue(0) + 0.2 + i * 0.25;
      A.in(tl, c.head, t, 'fadeUp', { dur: 0.6 });
      A.draw(tl, c.frame, t + 0.05, 0.8);
      A.in(tl, c.win, t + 0.4, 'fade', { dur: 0.5 });
    });
    A.in(tl, S.arrows, cue(0) + 0.7, 'fadeRight', { dur: 0.5, stagger: 0.25 });
    [0.15, 0.33, 0.8].forEach((f, i) => fill(tl, S.cols[i], Math.max(cue(0) + 1.2 + i * 0.3, at(0, f))));

    // beat 1: A and C dim to 40 percent; panel B scales gently in place (about 115 percent, so the
    // 591 px raster is shown at roughly 575 px and stays sharp) and its frame glows green
    const t1 = cue(1);
    A.dim(tl, [cA.root, cC.root], t1, 0.4, { dur: 0.8 });
    A.out(tl, S.arrows, t1, 'fade', { dur: 0.5 });
    tl.to(cB.root, { scale: 1.15, transformOrigin: `50% ${PT - TOP + PH / 2}px`, duration: 2.2, ease: 'power2.inOut' }, t1 + 0.1);
    tl.to(cB.frame, { attr: { stroke: GREEN }, duration: 0.8, ease: 'power2.out' }, t1 + 0.5);
    tl.fromTo(cB.panel, { boxShadow: '0 0 0 0px rgba(97,149,55,0), 0 0 0px rgba(97,149,55,0)' },
      { boxShadow: '0 0 0 8px rgba(97,149,55,0.25), 0 0 44px rgba(97,149,55,0.55)', duration: 0.9, ease: 'power2.out' }, t1 + 0.5);
    A.kenburns(tl, cB.img, { from: 1.0, to: 1.05, t0: t1 + 0.3, t1: cue(2) + 0.6 });
    const pf = K.flow(stage, { x: 160, y: 782, w: 1600, align: 'center', gap: 0 });
    const plan = K.text(pf, 'A dog with a better plan', { cls: 'c6-plan' });
    A.in(tl, plan, at(1, 0.66), 'fadeUp', { dur: 0.8 });

    // beat 2: panels fade, "A better way to ask." settles large over the accent bar
    const t2 = cue(2);
    A.out(tl, [...S.cols.map(c => c.root), plan, S.label], t2, 'fade', { dur: 0.6 });
    const halo = K.el('div', 'c6-halo');
    K.place(halo, { x: 260, y: 250, w: 1400, h: 620 });
    stage.appendChild(halo);
    A.in(tl, halo, t2 + 0.3, 'fade', { dur: 1.2 });
    const H = K.heading(stage, 'A better way to ask.', { x: 160, y: 372, w: 1600, size: 128, align: 'center', barGap: 34 });
    tl.fromTo(H.title, { opacity: 0, y: 36, scale: 1.04 }, { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: 'power3.out' }, t2 + 0.45);
    tl.fromTo(H.bar, { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: 'power2.inOut', transformOrigin: '50% 50%' }, t2 + 0.95);

    // beat 3: sparkles twinkle around the statement, "Celebrate small wins"
    const t3 = cue(3);
    const wf = K.flow(stage, { x: 160, y: 648, w: 1600, align: 'center', gap: 0 });
    const wins = K.text(wf, 'Celebrate small wins', { cls: 'c6-wins' });
    A.in(tl, wins, t3 + 0.5, 'fadeUp', { dur: 0.8 });
    const SP = [
      [300, 330, 80, GREEN], [200, 548, 46, '#8fbf63'], [430, 742, 58, GREEN_DARK], [610, 262, 40, '#8fbf63'],
      [1330, 252, 44, GREEN_DARK], [1600, 318, 72, GREEN], [1720, 540, 48, GREEN_DARK], [1492, 748, 62, '#8fbf63'],
      [960, 820, 40, GREEN],
    ];
    const sparks = SP.map(([x, y, s, col]) => {
      const d = K.el('div', 'c6-spark');
      K.place(d, { x: x - s / 2, y: y - s / 2, w: s, h: s });
      d.appendChild(K.icon('sparkle', { size: s, color: col, stroke: 1.8 }));
      d.firstChild.setAttribute('fill', col);
      stage.appendChild(d);
      return d;
    });
    sparks.forEach((d, k) => {
      const t = t3 + 0.1 + k * 0.12;
      tl.fromTo(d, { opacity: 0, scale: 0, rotation: -40 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.6, ease: 'back.out(2)' }, t);
      const tw = t + 0.7 + (k % 3) * 0.25;
      const reps = Math.max(1, Math.floor((dur - 0.6 - tw) / 0.8));
      tl.to(d, { scale: 0.62, opacity: 0.55, duration: 0.8, yoyo: true, repeat: reps, ease: 'sine.inOut' }, tw);
    });
  });
})();
