// Chapter 9: your key takeaways (deck slide 15). Two scenes share one six-card grid so the cut between them is seamless.
(function () {
  const css = `
    .c9-card { position:absolute; width:835px; height:196px; border-radius:26px; padding:0; background:rgba(255,255,255,0.45); border:3px dashed #cfdcc0; }
    .c9-card .fill { position:absolute; inset:-3px; border-radius:26px; background:#fff; border:1px solid #e3e8dc; box-shadow: var(--shadow-soft); }
    .c9-card .num { position:absolute; left:34px; top:64px; font:800 64px/1 Rubik, sans-serif; color:#cfdcc0; }
    .c9-card .num.on { color: var(--green); }
    .c9-card .txt { position:absolute; left:150px; top:50%; transform:translateY(-50%); font:500 31px/1.34 Montserrat, sans-serif; color: var(--ink); width:540px; }
    .c9-card .txt b { font-weight:700; color: var(--green-dark); }
    .c9-card .ib { position:absolute; right:30px; top:55px; width:86px; height:86px; border-radius:50%; background: var(--green-pale); color: var(--green-dark); display:grid; place-items:center; }
    .c9-card .ib svg { width:48px; height:48px; }
    .c9-card .ib.warn { background: var(--amber-pale); color: var(--amber); }
    .c9-card .glow { position:absolute; inset:-7px; border-radius:30px; box-shadow: 0 0 0 4px var(--green-light), 0 0 40px rgba(97,149,55,0.35); opacity:0; }
    .c9-help { position:absolute; display:flex; gap:12px; right:26px; top:58px; }
    .c9-help .ib2 { width:80px; height:80px; flex:0 0 auto; border-radius:50%; background: var(--green); color:#fff; display:grid; place-items:center; }
    .c9-help .ib2 svg { width:44px; height:44px; }
  `;
  const CARDS = [
    { icon: 'alarm-smoke', html: 'Reactivity is an <b>emotional response</b>, not disobedience.' },
    { icon: 'gauge', html: 'Read the <b>threshold</b>: under it they learn, over it they can’t.' },
    { icon: 'clipboard-list', html: 'Every dog has their own <b>list of triggers</b>. Get specific.' },
    { icon: 'stress-cup', html: 'Stress <b>stacks up</b>: over time, or all at once.' },
    { icon: 'triangle-alert', warn: true, html: 'Aggression is <b>communication</b>. Never punish a growl.' },
    { icon: null, html: 'Bites or escalation? See a <b>force-free pro</b> and rule out pain.' },
  ];

  function grid(stage) {
    stage.appendChild(K.el('style', null, css));
    const kick = K.kicker(stage, 'Pulling it together', { x: 120, y: 112, size: 30 }); // 30 px like the ch00 and ch01 kickers
    const h = K.heading(stage, 'Your key takeaways', { x: 116, y: 150, size: 80 });
    const cards = CARDS.map((c, i) => {
      const x = 110 + (i % 2) * 865, y = 312 + Math.floor(i / 2) * 216;
      const card = K.el('div', 'c9-card'); Object.assign(card.style, { left: `${x}px`, top: `${y}px` });
      const fill = K.el('div', 'fill');
      const ghostNum = K.el('div', 'num', String(i + 1).padStart(2, '0'));
      const num = K.el('div', 'num on', String(i + 1).padStart(2, '0'));
      const txt = K.el('div', 'txt', c.html);
      const ib = K.el('div', 'ib' + (c.warn ? ' warn' : '')); if (c.icon) ib.appendChild(K.icon(c.icon)); else ib.style.display = 'none';
      const glow = K.el('div', 'glow');
      [glow, fill, ghostNum, num, txt, ib].forEach(n => card.appendChild(n));
      stage.appendChild(card);
      return { card, fill, num, txt, ib, glow };
    });
    return { kick, h, cards };
  }

  function fillCard(tl, c, t) {
    tl.fromTo(c.fill, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' }, t);
    tl.fromTo(c.num, { opacity: 0 }, { opacity: 1, duration: 0.4 }, t + 0.1);
    tl.fromTo(c.txt, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, t + 0.25);
    tl.fromTo(c.ib, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.55, ease: 'back.out(2)' }, t + 0.45);
  }
  function setFilled(c) {
    gsap.set([c.fill, c.num, c.txt, c.ib], { opacity: 1 });
  }

  registerScene('ch09s01', (ctx) => {
    const { stage, tl, cue } = ctx;
    const g = grid(stage);
    A.in(tl, g.kick, cue(0), 'fadeUp');
    A.in(tl, g.h.title, cue(0) + 0.1, 'wipe', { dur: 0.9 });
    A.in(tl, g.h.bar, cue(0) + 0.8, 'grow');
    g.cards.forEach((c, i) => {
      tl.fromTo(c.card, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 }, cue(0) + 0.9 + i * 0.1);
      gsap.set([c.fill, c.num, c.txt, c.ib], { opacity: 0 });
    });
    [0, 1, 2].forEach(i => fillCard(tl, g.cards[i], cue(i + 1)));
    A.pulse(tl, g.cards[2].ib, ctx.phrase(3, 'get specific', 0.4), { scale: 1.15 });
    ctx.exit = false; // continues seamlessly into ch09s02
  });

  registerScene('ch09s02', (ctx) => {
    const { stage, tl, cue, end, dur } = ctx;
    const at = (i, p, fb) => ctx.phrase(i, p, fb);
    const g = grid(stage);
    g.cards.forEach((c, i) => { if (i < 3) setFilled(c); else gsap.set([c.fill, c.num, c.txt, c.ib], { opacity: 0 }); });
    fillCard(tl, g.cards[3], cue(0));
    fillCard(tl, g.cards[4], cue(1));
    // "don't tape over the warning light": the warning light blinks once
    A.pulse(tl, g.cards[4].ib, Math.max(cue(1) + 1.5, at(1, 'warning light', 0.5) - 0.1), { scale: 1.18 });
    fillCard(tl, g.cards[5], cue(2));
    // help icons join card 06, then a shield, then every card glows together
    const help = K.el('div', 'c9-help');
    const hb = ['users', 'stethoscope', 'shield-check'].map(ic => { const b = K.el('div', 'ib2'); b.appendChild(K.icon(ic)); help.appendChild(b); return b; });
    g.cards[5].card.appendChild(help);
    g.cards[5].txt.style.width = '355px'; g.cards[5].txt.style.fontSize = '29px';
    // each helper arrives as it is named: the pro, the vet (pulsing again for the veterinary behaviorist),
    // then the shield for safety; every card glows together as the chapter wraps up
    const tPro = Math.max(cue(3), at(3, 'force free pro', 0.05) - 0.2);
    const tVet = Math.max(tPro + 1.2, at(3, 'have your vet', 0.3) - 0.2);
    const tVb = Math.max(tVet + 2, at(3, 'veterinary behaviorist', 0.65) - 0.1);
    A.in(tl, hb[0], tPro, 'pop');
    A.in(tl, hb[1], tVet, 'pop');
    A.pulse(tl, hb[1], tVb, { scale: 1.18 });
    const tSafe = Math.max(cue(4), at(4, 'keep everyone safe', 0.1) - 0.2);
    const tKids = Math.max(tSafe + 1.5, at(4, 'never leave kids', 0.35) - 0.1);
    const tGlow = Math.min(dur - 2.6, Math.max(tKids + 2, at(4, 'muzzle training', 0.8) - 0.3));
    A.in(tl, hb[2], tSafe, 'pop');
    A.pulse(tl, hb[2], tKids, { scale: 1.18 });
    tl.to(g.cards.map(c => c.glow), { opacity: 1, duration: 0.8, stagger: 0.08, ease: 'power2.out' }, tGlow);
  });
})();
