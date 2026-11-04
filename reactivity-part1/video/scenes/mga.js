// Management: The Basics: welcome, Part 1 (where management fits) and Part 2 (what it is and isn't).
//   mg00intro  title slide (shared kit)
//   mg00plan   plan slide: What you'll learn (four parts), Why it matters
//   mg01s01    triggers and thresholds: trigger and threshold cards; a gauge with over (red) and under (green) zones; the job of management
//   mg01s02    management is the training foundation: Management as the slab, Training on top, Get out at the side
//   mg02s01    what management is and isn't: your dog's world shrinks on purpose, then opens back up; It is not / It is
(() => {
  const { at, put, clamp } = TM;
  const CSS = `
  .mga-ex { display: flex; gap: 14px; flex-wrap: wrap; margin-top: 4px; }
  .mga-ex .tm-word { position: relative; left: auto; top: auto; font-size: 26px; padding: 10px 20px; }
  .mga-zone { position: absolute; box-sizing: border-box; border-radius: 26px; padding: 28px 32px; display: flex; flex-direction: column; gap: 12px; }
  .mga-zone .t { display: flex; align-items: center; gap: 14px; font: 700 40px/1 var(--font-head); }
  .mga-zone .t svg { width: 40px; height: 40px; stroke-width: 2.4; }
  .mga-zone .b { font: 500 29px/1.36 var(--font-body); color: var(--ink-soft); }
  .mga-zone.over { background: var(--red-pale); }
  .mga-zone.over .t { color: var(--red); }
  .mga-zone.under { background: var(--green-mist); border: 2px solid #d9e8c6; }
  .mga-zone.under .t { color: var(--green-dark); }
  .mga-here { display: inline-flex; align-items: center; gap: 10px; margin-top: 4px; font: 700 28px/1 var(--font-body); color: var(--green); }
  .mga-here svg { width: 30px; height: 30px; stroke-width: 2.8; }
  .mga-tline { position: absolute; height: 0; border-top: 4px dashed var(--ink-soft); }
  .mga-tlab { position: absolute; font: 700 26px/1 var(--font-body); letter-spacing: 6px; color: var(--ink-soft); background: #fff; padding: 6px 16px; border-radius: 999px; }
  .mga-gauge { position: absolute; width: 22px; border-radius: 11px; background: linear-gradient(180deg, #b8452d, #d9912b 45%, #b8d99a 58%, #619537); }
  .mga-paw { position: absolute; width: 64px; height: 64px; border-radius: 50%; background: #fff; border: 4px solid var(--green); display: grid; place-items: center;
    box-shadow: 0 8px 20px rgba(40,60,20,0.22); }
  .mga-paw svg { width: 34px; height: 34px; color: var(--green-dark); stroke-width: 2.4; }
  .mga-banner { position: absolute; left: 100px; width: 1720px; box-sizing: border-box; display: flex; align-items: center; gap: 22px; padding: 24px 36px; border-radius: 22px;
    background: var(--green-deep); color: #fff; font: 700 34px/1.25 var(--font-head); box-shadow: 0 16px 36px rgba(44,74,23,0.28); }
  .mga-banner svg { width: 42px; height: 42px; stroke-width: 2.3; flex: 0 0 auto; color: var(--green-light); }
  .mga-banner b { color: var(--green-light); }
  .mga-blk { position: absolute; box-sizing: border-box; border-radius: 24px; padding: 26px 34px; display: flex; flex-direction: column; justify-content: center; gap: 10px; }
  .mga-blk .top { display: flex; align-items: center; gap: 18px; }
  .mga-blk .n { width: 56px; height: 56px; border-radius: 50%; display: grid; place-items: center; font: 700 30px/1 var(--font-head); flex: 0 0 auto; }
  .mga-blk .t { font: 700 44px/1 var(--font-head); }
  .mga-blk .tag { margin-left: auto; font: 700 24px/1 var(--font-body); letter-spacing: 3px; text-transform: uppercase; padding: 10px 18px; border-radius: 999px; white-space: nowrap; }
  .mga-blk .b { font: 500 30px/1.35 var(--font-body); }
  .mga-blk.slab { background: var(--green); color: #fff; box-shadow: 0 20px 44px rgba(63,107,34,0.32); }
  .mga-blk.slab .n { background: #fff; color: var(--green-dark); }
  .mga-blk.slab .tag { background: rgba(255,255,255,0.18); color: #fff; }
  .mga-blk.slab .b { color: #f3f8ec; }
  .mga-blk.white { background: #fff; border: 1px solid #e6e9e1; box-shadow: var(--shadow-soft); color: var(--ink); }
  .mga-blk.white .n { background: var(--green-pale); color: var(--green-dark); }
  .mga-blk.white .tag { background: var(--green-pale); color: var(--green-dark); }
  .mga-blk.white .b { color: var(--ink-soft); }
  .mga-blk .ic { width: 96px; height: 96px; border-radius: 50%; background: var(--green-pale); color: var(--green-dark); display: grid; place-items: center; margin-bottom: 8px; }
  .mga-blk .ic svg { width: 52px; height: 52px; stroke-width: 2.1; }
  .mga-world { position: absolute; border-radius: 30px; background: var(--green-mist); border: 2px solid #e3ecd6; overflow: hidden; }
  .mga-trig { position: absolute; width: 74px; height: 74px; border-radius: 50%; background: var(--amber-pale); color: var(--amber); border: 3px solid var(--amber);
    display: grid; place-items: center; box-sizing: border-box; }
  .mga-trig svg { width: 36px; height: 36px; stroke-width: 2.3; }
  .mga-wlab { position: absolute; left: 0; width: 100%; text-align: center; font: 700 30px/1.2 var(--font-head); color: var(--green-dark); }
  `;
  const css = stage => { MG.css(stage); if (!stage.querySelector('style[data-mga]')) { const s = K.el('style', null, CSS); s.dataset.mga = '1'; stage.appendChild(s); } };
  const flow = n => { n.style.position = 'relative'; n.style.left = n.style.top = ''; return n; };

  registerScene('mg00intro', ctx => SKIT.titleSlide(ctx));

  registerScene('mg00plan', ctx => SKIT.planSlide(ctx, [
    { ...SKIT.PLAN.gain, lab: 'What you’ll learn', rows: ['Where management fits', 'What it is, and what it isn’t', 'The golden rule', 'Five common mistakes'],
      rowIcons: ['layers', 'scale', 'badge-check', 'list-checks'], rowBg: 'var(--green-pale)', rowFg: 'var(--green-dark)' },
    { ...SKIT.PLAN.why, text: 'Management is *the foundation*. Everything else you teach stands on it.' },
  ], [
    [['where management fits', 0.15], ['what management is', 0.35], ['golden rule', 0.6], ['five common mistakes', 0.8]],
    [],
  ]));

  // ---------------------------------------------------------------- a quick recap: triggers and thresholds
  registerScene('mg01s01', ctx => {
    const { stage, tl, cue, end } = ctx;
    css(stage);
    TM.head(ctx, 'A quick recap', 'A quick recap: triggers and thresholds');

    // left: the two definitions
    const c1 = MG.card(stage, { x: 100, y: 292, w: 800, label: 'A trigger', icon: 'zap', body: 'Anything that *sets your dog off*.' });
    const ex = K.el('div', 'mga-ex');
    [['Another dog', 'dog', 'another dog'], ['The mail carrier', 'mail', 'mail carrier'], ['A knock at the door', 'door-closed', 'knock']].forEach(([t, ic, p]) => {
      const n = flow(TM.word(ex, t, { variant: 'amber', icon: ic, size: 26 }));
      A.in(tl, n, at(ctx, 1, p, 0.5), 'pop', { dur: 0.4 });
    });
    c1.appendChild(ex);
    tl.fromTo(c1, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, cue(1) + 0.05);
    const c2 = MG.card(stage, { x: 100, y: 292 + c1.offsetHeight + 24, w: 800, label: 'The threshold', icon: 'gauge',
      body: 'The point where your dog *stops being comfortable* and stress signs start to show.' });
    tl.fromTo(c2, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, cue(2) + 0.05);
    const LB = c2.offsetTop + c2.offsetHeight;  // bottom of the left column

    // right: the gauge, the threshold line and the two zones, matching the left column's height
    const ZX = 1060, ZW = 760, OY = 292, GAPZ = 56, OH = Math.round((LB - OY - GAPZ) * 0.47), UY = OY + OH + GAPZ, UH = LB - UY, LY = OY + OH + GAPZ / 2;
    const gauge = put(stage, K.el('div', 'mga-gauge'), 970, OY, { height: UY + UH - OY + 'px' });
    tl.fromTo(gauge, { opacity: 0, scaleY: 0, transformOrigin: '50% 100%' }, { opacity: 1, scaleY: 1, duration: 0.9, ease: 'power2.out' }, cue(2) + 0.3);
    const line = put(stage, K.el('div', 'mga-tline'), 940, LY, { width: ZX + ZW - 940 + 'px' });
    tl.fromTo(line, { opacity: 0, scaleX: 0, transformOrigin: '0% 50%' }, { opacity: 1, scaleX: 1, duration: 0.8, ease: 'power2.inOut' }, at(ctx, 2, 'point', 0.3));
    const tlab = put(stage, K.el('div', 'mga-tlab', 'THRESHOLD'), 0, LY - 21);
    TM.centerX(tlab, ZX + ZW / 2);
    A.in(tl, tlab, at(ctx, 2, 'point', 0.3) + 0.5, 'pop', { dur: 0.4 });
    const over = put(stage, K.el('div', 'mga-zone over'), ZX, OY, { width: ZW + 'px', height: OH + 'px' });
    over.innerHTML = `<div class="t">${K.icon('triangle-alert').outerHTML}<span>Over threshold</span></div><div class="b">Barking, lunging, panicking. Adrenaline takes over: <b style="color:var(--red)">can’t listen or learn.</b></div>`;
    tl.fromTo(over, { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, cue(3) + 0.05);
    const under = put(stage, K.el('div', 'mga-zone under'), ZX, UY, { width: ZW + 'px', height: UH + 'px' });
    under.innerHTML = `<div class="t">${K.icon('circle-check').outerHTML}<span>Under threshold</span></div><div class="b">Notices the trigger but stays calm. <b style="color:var(--green-dark)">Can think, settle, and learn.</b></div>`;
    const here = K.el('div', 'mga-here', `${K.icon('check').outerHTML}<span>Management keeps your dog here</span>`);
    under.appendChild(here);
    tl.fromTo(under, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, cue(4) + 0.05);
    tl.set(here, { opacity: 0 }, 0);

    // the dog on the gauge: rises into the red as "over" is described, settles into the green
    const paw = put(stage, K.el('div', 'mga-paw', K.icon('paw-print').outerHTML), 949, 0);
    const py = y => y - 32;
    tl.fromTo(paw, { opacity: 0, top: py(UY + UH - 50) }, { opacity: 1, top: py(UY + UH - 50), duration: 0.5 }, cue(2) + 0.9);
    tl.to(paw, { top: py(OY + 60), duration: 1.0, ease: 'power2.inOut' }, cue(3) + 0.3);
    tl.to(paw, { top: py(UY + 90), duration: 1.0, ease: 'power2.inOut' }, cue(4) + 0.3);

    const ban = put(stage, K.el('div', 'mga-banner'), 100, LB + 30);
    ban.innerHTML = `${K.icon('shield-check').outerHTML}<span>Management has one job: <b>keep your dog under threshold</b>, where learning can happen.</span>`;
    const tB = cue(5) + 0.05;
    tl.fromTo(ban, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, tB);
    tl.to(here, { opacity: 1, duration: 0.5 }, at(ctx, 5, 'under threshold', 0.5));
    tl.to(under, { boxShadow: '0 0 0 5px rgba(97,149,55,1), 0 18px 40px rgba(63,107,34,0.2)', duration: 0.6 }, at(ctx, 5, 'under threshold', 0.5));
    tl.to(over, { opacity: 0.55, duration: 0.6 }, at(ctx, 5, 'under threshold', 0.5));
  });

  // ---------------------------------------------------------------- management is the training foundation
  registerScene('mg01s02', ctx => {
    const { stage, tl, cue, end } = ctx;
    css(stage);
    TM.head(ctx, 'Where management fits', 'Management is the training foundation');
    const lead = put(stage, K.el('div', 'mg-lead', 'Management is <b>the foundation</b> of your training plan.'), 100, 290, { width: '1700px' });
    A.in(tl, lead, at(ctx, 0, 'foundation', 0.6), 'fadeUp', { dur: 0.6 });

    const blk = (cls, n, t, tag, body, x, y, w, h) => {
      const b = put(stage, K.el('div', 'mga-blk ' + cls), x, y, { width: w + 'px', height: h + 'px' });
      b.innerHTML = `<div class="top"><div class="n">${n}</div><div class="t">${t}</div><div class="tag">${tag}</div></div><div class="b">${K.md(body)}</div>`;
      return b;
    };
    // the slab at the bottom, Training built on it, Get out at the side
    const slab = blk('slab', 1, 'Management', 'The foundation', 'Set up your dog’s life so they don’t get hit with triggers you didn’t plan for.', 100, 680, 1180, 230);
    const trn = blk('white', 2, 'Training', 'Creates change', 'Planned sessions where you pair the trigger with *good things*.', 170, 410, 1040, 230);
    const out = put(stage, K.el('div', 'mga-blk white'), 1330, 410, { width: '490px', height: '500px', justifyContent: 'flex-start' });
    out.innerHTML = `<div class="ic">${K.icon('door-open').outerHTML}</div><div class="top"><div class="n">3</div><div class="t">Get out</div></div>
      <div class="tag" style="margin-left:0;align-self:flex-start;background:var(--green-pale);color:var(--green-dark)">Escape hatch</div>
      <div class="b">Remove your dog from the situation if an <b style="color:var(--ink)">unexpected trigger</b> appears.</div>`;
    tl.fromTo(slab, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, cue(1) + 0.05);
    tl.fromTo(trn, { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: 0.8, ease: 'bounce.out' }, cue(2) + 0.05);
    tl.fromTo(out, { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, cue(3) + 0.05);
    // the groundwork: the slab glows, the lead line changes
    const tG = cue(4) + 0.1;
    tl.to(lead, { opacity: 0, duration: 0.35 }, tG - 0.1);
    const lead2 = put(stage, K.el('div', 'mg-lead', 'Get this right, and everything else has <b>something solid to stand on</b>.'), 100, 290, { width: '1700px' });
    A.in(tl, lead2, tG + 0.3, 'fadeUp', { dur: 0.6 });
    tl.to(slab, { boxShadow: '0 0 0 8px rgba(184,217,154,1), 0 24px 54px rgba(63,107,34,0.4)', scale: 1.02, duration: 0.7, ease: 'power2.out' }, tG);
    tl.to([trn, out], { opacity: 0.6, duration: 0.6 }, tG);
    tl.to([trn, out], { opacity: 1, duration: 0.6 }, at(ctx, 4, 'everything else', 0.6));
  });

  // ---------------------------------------------------------------- what management is, and isn't
  registerScene('mg02s01', ctx => {
    const { stage, tl, cue, end } = ctx;
    css(stage);
    TM.head(ctx, 'The basics', 'What management is, and isn’t');
    const lead = put(stage, K.el('div', 'mg-lead', 'Controlling <b>the environment</b>, not changing the behavior itself.'), 100, 290, { width: '1720px' });
    A.in(tl, lead, cue(0) + 0.2, 'fadeUp', { dur: 0.6 });

    // your dog's world: a circle around the dog that shrinks on purpose, keeping the triggers out, then opens back up
    const WX = 100, WY = 380, WW = 800, WH = 540;
    const world = put(stage, K.el('div', 'mga-world'), WX, WY, { width: WW + 'px', height: WH + 'px' });
    A.in(tl, world, cue(0) + 0.5, 'fadeUp', { dur: 0.7 });
    const sv = K.svg(world, { x: 0, y: 0, w: WW, h: WH });
    const CX = WW / 2, CY = 250;
    const circ = K.circle(sv, CX, CY, 200, { fill: '#fff', stroke: 'var(--green)', 'stroke-width': 6 });
    tl.fromTo(circ, { attr: { r: 0 }, opacity: 0 }, { attr: { r: 200 }, opacity: 1, duration: 0.9, ease: 'power3.out' }, cue(0) + 0.8);
    const dog = put(world, K.el('div', 'mga-paw', K.icon('paw-print').outerHTML), CX - 32, CY - 32);
    A.in(tl, dog, cue(0) + 1.1, 'pop', { dur: 0.5 });
    const wl = put(world, K.el('div', 'mga-wlab', 'Your dog’s world'), 0, 474);
    A.in(tl, wl, cue(0) + 1.2, 'fadeUp', { dur: 0.5 });
    // triggers sit inside the big world: dog, mail, door, car
    const TR = [['dog', -130, -110], ['mail', 140, -90], ['door-closed', -150, 100], ['car', 130, 115]];
    const trs = TR.map(([ic, dx, dy]) => {
      const n = put(world, K.el('div', 'mga-trig', K.icon(ic).outerHTML), CX + dx - 37, CY + dy - 37);
      A.in(tl, n, cue(0) + 1.4, 'pop', { dur: 0.4 });
      return { n, dx, dy };
    });
    // beat 1: the world shrinks; the triggers end up outside it
    const tS = at(ctx, 1, 'shrink', 0.15);
    tl.to(circ, { attr: { r: 95 }, duration: 1.1, ease: 'power3.inOut' }, tS);
    trs.forEach(({ n, dx, dy }) => tl.to(n, { x: dx * 0.55, y: dy * 0.55 * 0.9, duration: 1.1, ease: 'power3.inOut' }, tS));
    tl.to(wl, { opacity: 0, duration: 0.3 }, tS);
    const wl2 = put(world, K.el('div', 'mga-wlab', 'A smaller world, on purpose'), 0, 474);
    A.in(tl, wl2, tS + 0.9, 'fadeUp', { dur: 0.5 });
    // beat 2: it opens back up, on our terms: the triggers are back inside, now calm (green)
    const tO = at(ctx, 2, 'open it back up', 0.4);
    tl.to(circ, { attr: { r: 230 }, duration: 1.4, ease: 'power2.inOut' }, tO);
    trs.forEach(({ n }, k) => {
      tl.to(n, { x: 0, y: 0, duration: 1.4, ease: 'power2.inOut' }, tO);
      tl.to(n, { backgroundColor: '#e8f1dc', borderColor: '#619537', color: '#3f6b22', duration: 0.5 }, tO + 1.0 + 0.15 * k);
    });
    tl.to(wl2, { opacity: 0, duration: 0.3 }, tO);
    const wl3 = put(world, K.el('div', 'mga-wlab', 'Opened back up, <span style="color:var(--green)">on our terms</span>'), 0, 474);
    A.in(tl, wl3, tO + 1.0, 'fadeUp', { dur: 0.5 });

    // right: it is not / it is
    const no = MG.card(stage, { x: 980, y: 380, w: 840, variant: 'red', label: 'It is not', icon: 'circle-x', body: 'Changing how your dog feels. *That’s the job of training.*' });
    no.querySelector('.b b').style.color = 'var(--ink)';
    tl.fromTo(no, { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, cue(3) + 0.05);
    const yes = MG.card(stage, { x: 980, y: 380 + no.offsetHeight + 30, w: 840, variant: 'green', label: 'It is', icon: 'circle-check', body: 'Preventing the unwanted behavior from *ever being practiced*.' });
    tl.fromTo(yes, { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, cue(4) + 0.05);
    tl.to(yes, { boxShadow: '0 0 0 5px rgba(97,149,55,1), 0 18px 40px rgba(63,107,34,0.2)', duration: 0.6 }, at(ctx, 4, 'ever being practiced', 0.7));
  });
})();
