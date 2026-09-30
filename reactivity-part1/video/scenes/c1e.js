// Chapter 1 (v6): breed history and purpose. Bowl parts come from window.C1 (c1_bowl.js).
//   ch01s06  Breed history and purpose   six AKC breed-group cards in a 2 x 3 grid beside a small bowl; each card highlights in turn,
//                                         a photo of a dog from that group (with a breed tag) fills its right side and the example
//                                         breeds appear under its job line; "clues, not guarantees" lands over the grid; the cards
//                                         fly into the bowl and become the third ingredient
(() => {
  const CSS = `
  .c1e-q { position: absolute; font: 600 40px/1.1 var(--font-head); color: var(--ink); white-space: nowrap; }
  .c1e-q .em-green { font-weight: 600; }
  .c1e-akc { position: absolute; display: inline-flex; align-items: center; gap: 12px; padding: 8px 22px 8px 10px; border-radius: 999px;
    background: var(--green-pale); color: var(--green-deep); font: 600 28px/1 var(--font-body); white-space: nowrap; }
  .c1e-akc .ai { width: 40px; height: 40px; border-radius: 50%; background: var(--green); color: #fff; display: grid; place-items: center; }
  .c1e-akc .ai svg { width: 23px; height: 23px; stroke-width: 2.3; }
  .c1e-card { position: absolute; width: 848px; height: 212px; background: #fff; border-radius: 26px; border: 1px solid #e6e9e1; }
  .c1e-card .bd { position: absolute; left: 20px; top: 18px; width: 56px; height: 56px; border-radius: 50%; display: grid; place-items: center;
    background: var(--green-pale); color: var(--green-dark); }
  .c1e-card .bd svg { width: 31px; height: 31px; stroke-width: 2.2; }
  .c1e-card .nm { position: absolute; left: 92px; top: 18px; height: 56px; display: flex; align-items: center; font: 700 37px/1 var(--font-head);
    color: var(--green-dark); white-space: nowrap; }
  .c1e-card .job { position: absolute; left: 22px; top: 86px; width: 537px; font: 500 27px/1.18 var(--font-body); color: var(--ink-soft); white-space: nowrap; }
  .c1e-card .ex { position: absolute; left: 22px; top: 130px; width: 537px; font: 600 26px/1.2 var(--font-body); color: var(--green-dark); }
  .c1e-card .btrow { display: none; } /* breed tags hidden: they covered the dogs; the example line names the breeds */
  .c1e-card .btag { padding: 7px 14px; border-radius: 999px; background: rgba(255,255,255,0.94); box-shadow: 0 3px 10px rgba(40,60,20,0.18);
    font: 500 26px/1 var(--font-head); color: var(--green-deep); white-space: nowrap; }
  .c1e-card .photo { background: var(--green-mist); box-shadow: inset 0 0 0 1px rgba(97,149,55,0.10); }
  .c1e-card .photo .ph0 { position: absolute; inset: 0; display: grid; place-items: center; color: var(--green-light); }
  .c1e-card .photo .ph0 svg { width: 64px; height: 64px; stroke-width: 1.8; opacity: 0.7; }
  .c1e-banrow { position: absolute; display: flex; justify-content: center; }
  .c1e-ban { display: flex; align-items: center; gap: 28px; padding: 28px 56px 28px 28px; border-radius: 30px; background: #fff;
    box-shadow: var(--shadow); border: 1px solid #e6e9e1; }
  .c1e-ban .bi { width: 92px; height: 92px; border-radius: 50%; background: var(--green); color: #fff; display: grid; place-items: center; flex: 0 0 auto; }
  .c1e-ban .bi svg { width: 50px; height: 50px; stroke-width: 2.2; }
  .c1e-ban .bt { font: 700 60px/1.1 var(--font-head); color: var(--ink); white-space: nowrap; }
  .c1e-list { position: absolute; display: flex; flex-direction: column; gap: 24px; align-items: flex-start; }
  .c1e-list .c1-cap { font-size: 34px; padding: 12px 36px 12px 12px; }
  .c1e-list .c1-dot { width: 60px; height: 60px; }
  .c1e-list .c1-dot svg { width: 34px; height: 34px; }
  .c1e-puz { position: absolute; display: flex; align-items: center; gap: 26px; }
  .c1e-puz .pi { width: 96px; height: 96px; border-radius: 50%; background: var(--green-pale); color: var(--green-dark); display: grid; place-items: center; flex: 0 0 auto; }
  .c1e-puz .pi svg { width: 52px; height: 52px; stroke-width: 2.1; }
  .c1e-puz .pt { font: 600 56px/1.1 var(--font-head); color: var(--ink); white-space: nowrap; }
  `;

  // Photos and breed-name tags, one entry per group: swap img/breed here when photos change.
  // The photos are 4:3 crops already framed on the dog's head, shown centred in a 4:3 frame.
  const PHOTOS = {
    sporting: { img: 'breed_sporting.jpg', breed: 'Labrador Retriever' },
    hound: { img: 'breed_hounds.jpg', breed: 'Beagle' },
    working: { img: 'breed_working.jpg', breed: 'Great Pyrenees' },
    terrier: { img: 'breed_terriers.jpg', breed: 'Russell Terrier' },
    toy: { img: 'breed_toy.jpg', breed: 'Chihuahua' },
    herding: { img: 'breed_herding.jpg', breed: 'Border Collie' },
  };

  // the six AKC breed groups in narration order (beats 2 to 7): icon, job line, example breeds (revealed on `say`, fb = fallback fraction)
  const GROUPS = [
    { key: 'sporting', nm: 'Sporting Group', job: 'Find, flush, or retrieve game', ic: 'bird',
      ex: 'Golden Retrievers, Labrador Retrievers, Pointers, Spaniels', say: 'like Golden Retrievers', fb: 0.32 },
    { key: 'hound', nm: 'Hound Group', job: 'Pursue game by sight or scent', ic: 'footprints',
      ex: 'Beagles, Bloodhounds, Greyhounds, Dachshunds', say: 'like Beagles', fb: 0.27 },
    { key: 'working', nm: 'Working Group', job: 'Guard, pull, rescue and other jobs', ic: 'hard-hat',
      ex: 'Rottweilers, Great Danes, Siberian Huskies, Newfoundlands', say: 'like Rottweilers', fb: 0.32 },
    { key: 'terrier', nm: 'Terrier Group', job: 'Hunt vermin and small animals', ic: 'rat',
      ex: 'Parson Russell Terriers, Airedale Terriers, Miniature Schnauzers', say: 'like Parson Russell', fb: 0.32 },
    { key: 'toy', nm: 'Toy Group', job: 'Bred for companionship', ic: 'heart',
      ex: 'Chihuahuas, Pomeranians, Maltese, Yorkshire Terriers', say: 'like Chihuahuas', fb: 0.26 },
    { key: 'herding', nm: 'Herding Group', job: 'Control and move livestock', ic: 'move',
      ex: 'German Shepherd Dogs, Border Collies, Australian Shepherds, Corgis', say: 'like German Shepherd', fb: 0.23 },
  ];
  const CW = 848, CH = 212;
  const GX = [100, 972], GY = [300, 524, 748];
  // 4:3 photo frame at the card's right edge (card inner box is 846 x 210), 8 px inset; the text column gets the rest
  const PH = { x: 579, y: 8, w: 259, h: 194, r: 18 };
  const SH0 = '0 10px 30px rgba(40,60,20,0.10), 0 0 0 0px rgba(97,149,55,0)';
  const SHG = '0 14px 36px rgba(40,60,20,0.14), 0 0 0 4px rgba(184,217,154,1)';
  const SHH = '0 20px 46px rgba(40,60,20,0.18), 0 0 0 4px rgba(97,149,55,1)';

  /** One breed-group card with a softly tinted, still empty photo frame; returns its parts and centre. */
  function groupCard(parent, g, x, y) {
    const P = PHOTOS[g.key];
    const c = K.el('div', 'c1e-card');
    Object.assign(c.style, { left: x + 'px', top: y + 'px', boxShadow: SH0 });
    const bd = K.el('div', 'bd');
    bd.appendChild(K.icon(g.ic));
    c.appendChild(bd);
    c.appendChild(K.el('div', 'nm', g.nm));
    c.appendChild(K.el('div', 'job', g.job));
    const ex = K.el('div', 'ex', g.ex);
    c.appendChild(ex);
    const ph = K.photo(c, P.img, { x: PH.x, y: PH.y, w: PH.w, h: PH.h, radius: PH.r, pos: '50% 50%' });
    const ph0 = K.el('div', 'ph0');
    ph0.appendChild(K.icon('paw-print'));
    ph.root.insertBefore(ph0, ph.img);
    const tagRow = K.el('div', 'btrow');
    const tag = K.el('div', 'btag', P.breed);
    tagRow.appendChild(tag);
    ph.root.appendChild(tagRow);
    parent.appendChild(c);
    return { c, bd, ph, ex, tag, cx: x + CW / 2, cy: y + CH / 2 };
  }

  // ================================================================== ch01s06 Breed history and purpose
  registerScene('ch01s06', ctx => {
    const { stage, tl, cue, end, dur } = ctx;
    const { C, STD, SLOT, ING, sayAt, clamp } = C1;
    C1.style(stage);
    stage.appendChild(K.el('style', null, CSS));

    const h = K.heading(stage, 'Breed history and purpose', { x: 100, y: 110, size: 72, barGap: 20 });
    A.in(tl, h.all, 0.05, 'fadeUp', { dur: 0.7, stagger: 0.1 });

    // the bowl is built at its standard size and parked small at the top right while the cards are up
    const B = C1.makeBowl(stage, { cx: STD.cx, y: STD.y, s: STD.s, filled: 2 });
    const SM = { x: 1320 - STD.cx, y: 208 - STD.y, scale: 0.25 / STD.s }; // 0.25 = on-screen bowl scale
    gsap.set(B.wrap, { ...SM });
    A.in(tl, B.wrap, 0, 'fade', { dur: 0.6 });
    C1.bob(tl, B, 0, dur);

    // ---------- beat 0: "ingredient three" (its chip blinks), the question, the "AKC breed groups" label, then the six cards
    const tIng = clamp(sayAt(ctx, 0, 'Ingredient three', 0.02), cue(0) + 0.2, cue(0) + 1.5);
    tl.to(B.slots[2].g, { scale: 1.45, transformOrigin: '50% 50%', duration: 0.3, ease: 'sine.inOut', yoyo: true, repeat: 3 }, tIng);

    const q = C1.put(stage, 'c1e-q', 'What was this dog *bred to do?*', { x: 100, y: 232 });
    const tQ = clamp(sayAt(ctx, 0, 'selectively bred', 0.22), cue(0) + 0.8, cue(1) - 4);
    A.in(tl, q, tQ, 'fadeUp', { dur: 0.7 });

    // small label beside the question, on "The American Kennel Club"
    const akc = K.el('div', 'c1e-akc');
    Object.assign(akc.style, { left: '722px', top: '228px' });
    const ai = K.el('div', 'ai');
    ai.appendChild(K.icon('layout-grid'));
    akc.appendChild(ai);
    akc.appendChild(K.el('span', null, 'AKC breed groups'));
    stage.appendChild(akc);
    const tAkc = clamp(sayAt(ctx, 0, 'American Kennel Club', 0.44), tQ + 0.8, cue(1) - 3);
    A.in(tl, akc, tAkc, 'fadeRight', { dur: 0.6 });
    A.in(tl, ai, tAkc + 0.15, 'pop', { dur: 0.5 });

    const cards = GROUPS.map((g, i) => groupCard(stage, g, GX[i % 2], GY[Math.floor(i / 2)]));
    const cardEls = cards.map(k => k.c);
    stage.appendChild(B.wrap); // bowl above the cards, so they fly into it
    const tCards = clamp(sayAt(ctx, 0, 'sorts many breeds into groups', 0.52), tAkc + 0.5, cue(1) - 2.2);
    cards.forEach((k, i) => {
      const t = tCards + i * 0.2;
      A.in(tl, k.c, t, 'fadeUp', { dur: 0.7 });
      A.in(tl, k.bd, t + 0.2, 'pop', { dur: 0.55 });
    });

    // ---------- beat 1: all six pulse gently together
    const pulseAll = t => {
      tl.to(cardEls, { scale: 1.025, boxShadow: SHG, duration: 0.45, ease: 'sine.inOut', yoyo: true, repeat: 1 }, t);
      tl.to(cards.map(k => k.bd), { scale: 1.18, duration: 0.45, ease: 'sine.inOut', yoyo: true, repeat: 1 }, t);
    };
    const tP1 = cue(1) + 0.15;
    pulseAll(tP1);
    pulseAll(clamp(sayAt(ctx, 1, 'what behaviors', 0.7, 0.2), tP1 + 1.6, cue(2) - 1.2));

    // ---------- beats 2 to 7: one card at a time lights up (the rest dim), its dog photo fades in with the breed tag,
    // and the example breeds appear under the job line as they are named ("like Golden Retrievers, ...")
    cards.forEach((k, j) => {
      const g = GROUPS[j], b = j + 2, t = cue(b) - 0.15;
      tl.to(cardEls.filter((_, i) => i !== j), { opacity: 0.3, scale: 1, boxShadow: SH0, duration: 0.5, ease: 'power2.out' }, t);
      tl.to(k.c, { opacity: 1, scale: 1.03, boxShadow: SHH, duration: 0.55, ease: 'power2.out' }, t);
      tl.to(k.bd, { backgroundColor: C.green, color: '#fff', duration: 0.45, ease: 'power2.out' }, t + 0.1);
      A.pulse(tl, k.bd, t + 0.2, { scale: 1.15 });
      tl.fromTo(k.ph.img, { opacity: 0, scale: 1.14 }, { opacity: 1, scale: 1, duration: 1.4, ease: 'power2.out' }, t + 0.3);
      A.in(tl, k.tag, t + 0.9, 'fadeUp', { dur: 0.5 });
      const tEx = clamp(sayAt(ctx, b, g.say, g.fb, 0.15), t + 1.2, end(b) - 1.5);
      A.in(tl, k.ex, tEx, 'fadeUp', { dur: 0.6 });
    });
    // then all six stay up, each with its photo
    const tAll = clamp(end(7) - 0.9, cue(7) + 2.5, cue(8) + 0.3);
    tl.to(cardEls, { opacity: 1, scale: 1, boxShadow: SH0, duration: 0.6, ease: 'power2.out' }, tAll);

    // ---------- beat 8: "clues, not guarantees" lands over the dimmed cards
    const row = K.el('div', 'c1e-banrow');
    Object.assign(row.style, { left: '100px', top: '550px', width: '1720px' });
    const ban = K.el('div', 'c1e-ban');
    const bi = K.el('div', 'bi');
    bi.appendChild(K.icon('search'));
    ban.appendChild(bi);
    ban.appendChild(K.el('div', 'bt', K.md('Breed history gives us *clues*, not guarantees.')));
    row.appendChild(ban);
    stage.appendChild(row);
    const tBan = clamp(sayAt(ctx, 8, 'Breed history gives us', 0.55, 0.3), tAll + 0.8, end(8) - 1.2);
    tl.to(cardEls, { opacity: 0.22, duration: 0.6, ease: 'power2.out' }, tBan - 0.1);
    tl.fromTo(ban, { opacity: 0, y: -44, scale: 1.05 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' }, tBan);
    A.pulse(tl, bi, tBan + 0.6, { scale: 1.12 });

    // ---------- beat 9: the cards fly into the small bowl's third "?" chip; the bowl grows back and that chip drops in
    const t9 = cue(9);
    A.out(tl, [row, q, akc], t9 - 0.35, 'fadeUp', { dur: 0.45 });
    tl.to(cardEls, { opacity: 1, duration: 0.35, ease: 'power2.out' }, t9 - 0.3);
    const TX = STD.cx + SM.x + SLOT[2][0] * 0.25, TY = STD.y + SM.y + SLOT[2][1] * 0.25;
    const tFly = t9 + 0.1, FD = 0.95, FS = 0.08;
    cards.forEach((k, i) => {
      const t = tFly + i * FS;
      tl.to(k.c, { x: TX - k.cx, y: TY - k.cy, scale: 0.03, duration: FD, ease: 'power2.in' }, t);
      tl.to(k.c, { opacity: 0, duration: 0.25, ease: 'power1.in' }, t + FD - 0.25);
    });
    const tArr = tFly + 5 * FS + FD;
    tl.to(B.slots[2].g, { scale: 1.7, transformOrigin: '50% 50%', duration: 0.22, ease: 'power2.out', yoyo: true, repeat: 1 }, tArr - 0.1);
    const tGrow = tArr + 0.1;
    tl.fromTo(B.wrap, { ...SM }, { x: 0, y: 0, scale: 1, duration: 1.1, ease: 'power3.inOut', immediateRender: false }, tGrow);
    const land = C1.dropIn(tl, B, 2, tGrow + 1.0);

    const list = K.el('div', 'c1e-list');
    Object.assign(list.style, { left: '100px', top: '330px' });
    stage.appendChild(list);
    const pills = [0, 1, 2].map(k => {
      const p = K.el('div', 'c1-cap');
      const dot = K.el('div', 'c1-dot');
      dot.style.background = ING[k].col;
      dot.appendChild(K.icon(ING[k].icon));
      p.appendChild(dot);
      p.appendChild(K.el('span', null, ING[k].name));
      list.appendChild(p);
      return p;
    });
    A.in(tl, pills.slice(0, 2), tGrow + 0.3, 'fadeRight', { dur: 0.6, stagger: 0.15 });
    A.in(tl, pills[2], land - 0.15, 'fadeRight', { dur: 0.6 });

    const tGlow = land + 0.45;
    const halos = [0, 1, 2].map(k => {
      const o = B.tokens[k].outer;
      const c = K.circle(o, 0, 0, 58, { fill: '#e6f3d6', stroke: C.greenLight, 'stroke-width': 4, opacity: 0 });
      o.insertBefore(c, o.firstChild);
      return c;
    });
    tl.fromTo(halos, { opacity: 0, scale: 0.7, transformOrigin: '50% 50%' }, { opacity: 0.95, scale: 1, duration: 0.8, stagger: 0.12, ease: 'power2.out' }, tGlow);
    tl.fromTo(B.glow, { opacity: 0 }, { opacity: 0.9, duration: 1.2, ease: 'sine.inOut', immediateRender: false }, tGlow);
    tl.to([0, 1, 2].map(k => B.tokens[k].inner), { scale: 1.12, transformOrigin: '50% 50%', duration: 0.35, yoyo: true, repeat: 1, stagger: 0.12, ease: 'sine.inOut' }, tGlow + 0.1);
    tl.to(pills, { boxShadow: '0 0 0 4px rgba(184,217,154,0.9), 0 12px 30px rgba(97,149,55,0.25)', duration: 0.6, stagger: 0.12 }, tGlow);

    // "another piece of the puzzle"
    const puz = K.el('div', 'c1e-puz');
    Object.assign(puz.style, { left: '100px', top: '700px' });
    const pi = K.el('div', 'pi');
    pi.appendChild(K.icon('puzzle'));
    puz.appendChild(pi);
    puz.appendChild(K.el('div', 'pt', K.md('Another piece of the *puzzle*')));
    stage.appendChild(puz);
    const tPuz = clamp(sayAt(ctx, 9, 'another piece of the puzzle', 0.88, 0.3), land + 1.0, dur - 2.0);
    A.in(tl, puz, tPuz, 'fadeUp', { dur: 0.8 });
    A.in(tl, pi, tPuz + 0.15, 'pop', { dur: 0.6 });
  });
})();
