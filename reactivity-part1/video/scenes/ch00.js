// Chapter 0: cold open and welcome.
(function () {
  const css = `
    .c0-arc { position:absolute; border: 7px solid #fff; border-left-color: transparent; border-bottom-color: transparent; border-radius: 50%; transform: rotate(45deg); }
    .c0-eye { position:absolute; width:118px; height:118px; border-radius:50%; background:rgba(255,255,255,0.94); color:#212121; display:grid; place-items:center; box-shadow:0 10px 30px rgba(0,0,0,0.25); }
    .c0-eye svg { width:62px; height:62px; }
    .c0-big { position:absolute; font:700 64px/1.1 Rubik, sans-serif; color:#fff; text-shadow:0 4px 24px rgba(0,0,0,0.45); }
    .c0-heart { position:absolute; width:210px; height:210px; color: var(--green); }
    .c0-heart svg { width:100%; height:100%; }
    .c0-glow { position:absolute; width:420px; height:420px; border-radius:50%; background: radial-gradient(circle, rgba(184,217,154,0.55) 0%, rgba(184,217,154,0) 70%); }
    .c0-msg { position:absolute; left:0; width:1920px; text-align:center; font:700 58px/1.15 Rubik, sans-serif; color: var(--ink); }
    .c0-msg .g { color: var(--green); }
    .c0-dog { position:absolute; width:150px; height:150px; border-radius:50%; background:#fff; box-shadow: var(--shadow-soft); display:grid; place-items:center; color: var(--ink); }
    .c0-dog svg { width:88px; height:88px; }
    .c0-badge { position:absolute; width:62px; height:62px; border-radius:50%; display:grid; place-items:center; color:#fff; box-shadow:0 4px 12px rgba(0,0,0,0.18); }
    .c0-badge svg { width:36px; height:36px; }
    .c0-row { position:absolute; width:500px; height:236px; background:#fff; border-radius:26px; box-shadow: var(--shadow-soft); border:1px solid #e6e9e1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:18px; }
    .c0-row .ib { width:96px; height:96px; border-radius:50%; background: var(--green-pale); color: var(--green-dark); display:grid; place-items:center; }
    .c0-row .ib svg { width:54px; height:54px; }
    .c0-row .t { font:700 38px/1 Rubik, sans-serif; color: var(--ink); }
    .c0-row .s { font:500 24px/1 Montserrat, sans-serif; color: var(--muted); letter-spacing: 3px; text-transform: uppercase; }
    .c0-strip { position:absolute; left:0; width:1920px; display:flex; justify-content:center; align-items:center; gap:26px; font:700 50px/1 Rubik, sans-serif; color: var(--green-deep); }
    .c0-strip .ib { width:84px; height:84px; border-radius:50%; background: var(--green); color:#fff; display:grid; place-items:center; }
    .c0-strip .ib svg { width:48px; height:48px; }
    .c0-strip .dot { color: var(--green-light); }
  `;
  const style = () => K.el('style', null, css);

  // ------------------------------------------------------------------ cold open
  registerScene('ch00s01', ({ stage, tl, cue, dur, chrome }) => {
    stage.appendChild(style());

    // beat 1: a calm walk on a dotted path, another dog appears at the corner
    const walk = K.el('div'); stage.appendChild(walk);
    const kick = K.kicker(walk, 'A quiet morning walk', { x: 120, y: 190 });
    const svg = K.svg(walk, { x: 0, y: 0, w: 1920, h: 1080 });
    const d = 'M 150 820 C 520 820 700 640 980 640 S 1400 470 1560 330';
    const trail = K.path(svg, d, { stroke: '#b8d99a', 'stroke-width': 10, 'stroke-dasharray': '2 26' });
    const trailSolid = K.path(svg, d, { stroke: '#e8f1dc', 'stroke-width': 46, opacity: 0.9 });
    svg.insertBefore(trailSolid, trail);
    const me = K.iconBadge(walk, 'dog', { x: 0, y: 0, size: 132, variant: 'solid' });
    const prints = K.iconBadge(walk, 'footprints', { x: 0, y: 0, size: 70 });
    const other = K.iconBadge(walk, 'dog', { x: 1500, y: 262, size: 132, variant: 'amber' });
    kick.style.fontSize = '30px';
    const scenery = [['trees', 330, 560, 150], ['trees', 1180, 700, 170], ['house', 1690, 470, 120], ['trees', 760, 380, 130], ['sun', 1320, 150, 110]].map(([ic, x, y, sz]) => {
      const n = K.el('div', null, null, { position: 'absolute', left: `${x}px`, top: `${y}px`, width: `${sz}px`, height: `${sz}px`, color: ic === 'sun' ? '#e7b54a' : '#9cc47a' });
      n.appendChild(K.icon(ic, { stroke: 1.6 })); n.firstChild.style.width = n.firstChild.style.height = '100%';
      walk.appendChild(n);
      return n;
    });
    A.in(tl, kick, 0.15, 'fadeUp');
    A.in(tl, scenery, 0.3, 'fadeUp', { stagger: 0.12 });
    A.draw(tl, [trailSolid, trail], 0.1, 1.4);
    A.in(tl, [me, prints], 0.35, 'pop', { stagger: 0.1 });
    const walkEnd = Math.max(1.6, cue(1) - 1.0);
    const mp = (end, origin) => ({ motionPath: { path: trail, align: trail, alignOrigin: origin, start: 0, end } });
    gsap.set(me, mp(0, [0.5, 0.5]));
    gsap.set(prints, mp(0, [0.5, 1.7]));
    tl.to(me, Object.assign(mp(0.5, [0.5, 0.5]), { duration: walkEnd - 0.4, ease: 'none' }), 0.4);
    tl.to(prints, Object.assign(mp(0.44, [0.5, 1.7]), { duration: walkEnd - 0.4, ease: 'none' }), 0.4);
    A.in(tl, other, Math.max(cue(0) + 2.2, walkEnd - 1.4), 'pop', { dur: 0.6 });
    A.pulse(tl, other, Math.max(cue(0) + 3.0, walkEnd - 0.6), { scale: 1.15 });

    // beat 2: hard cut to the barking dog
    const photo = K.photo(stage, 'photo_reactivity.jpg', { x: 0, y: 0, w: 1920, h: 1080, bleed: true, pos: '50% 30%' });
    photo.root.style.zIndex = 5;
    tl.set(walk, { opacity: 0 }, cue(1));
    tl.fromTo(photo.root, { opacity: 0 }, { opacity: 1, duration: 0.05, ease: 'none' }, cue(1));
    tl.fromTo(photo.img, { scale: 1.2 }, { scale: 1.0, duration: 0.35, ease: 'power4.out' }, cue(1));
    tl.to(photo.img, { scale: 1.05, duration: Math.max(0.5, dur - cue(1) - 0.4), ease: 'none' }, cue(1) + 0.35);
    // two-frame shake
    tl.to(photo.root, { x: 14, y: -8, duration: 0.033, ease: 'none' }, cue(1) + 0.36)
      .to(photo.root, { x: -12, y: 6, duration: 0.033, ease: 'none' }, cue(1) + 0.40)
      .to(photo.root, { x: 0, y: 0, duration: 0.05, ease: 'none' }, cue(1) + 0.44);
    const arcs = [0, 1, 2].map(i => {
      const s = 70 + i * 52;
      const a = K.el('div', 'c0-arc'); Object.assign(a.style, { left: `${1175 - s / 2 + i * 20}px`, top: `${432 - s / 2}px`, width: `${s}px`, height: `${s}px`, zIndex: 6 });
      stage.appendChild(a);
      return a;
    });
    arcs.forEach((a, i) => {
      tl.fromTo(a, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.25, ease: 'power2.out' }, cue(1) + 0.45 + i * 0.12);
      tl.to(a, { opacity: 0.35, duration: 0.3, yoyo: true, repeat: 5, ease: 'sine.inOut' }, cue(1) + 0.8 + i * 0.12);
    });
    tl.set(chrome.footer.querySelector('.url'), { opacity: 0 }, cue(1));

    // beat 3: dim, eyes open around the edges, "Sound familiar?"
    const shade = K.el('div', null, null, { position: 'absolute', inset: '0', background: 'rgba(20,28,12,0.55)', zIndex: 7 });
    stage.appendChild(shade);
    A.in(tl, shade, cue(2), 'fade', { dur: 0.8 });
    A.out(tl, arcs, cue(2), 'fade', { dur: 0.4 });
    const eyes = [[180, 150], [240, 760], [1560, 800]].map(([x, y]) => {
      const e = K.el('div', 'c0-eye'); Object.assign(e.style, { left: `${x}px`, top: `${y}px`, zIndex: 8 });
      e.appendChild(K.icon('eye', { stroke: 2.2 }));
      stage.appendChild(e);
      return e;
    });
    eyes.forEach((e, i) => tl.fromTo(e, { opacity: 0, scaleY: 0.1 }, { opacity: 1, scaleY: 1, duration: 0.35, ease: 'back.out(2)' }, cue(2) + 0.3 + i * 0.45));
    const q = K.el('div', 'c0-big', 'Sound familiar?'); Object.assign(q.style, { left: '0', width: '1920px', textAlign: 'center', top: '480px', zIndex: 8, fontSize: '96px' });
    stage.appendChild(q);
    A.in(tl, q, cue(2) + 1.6, 'fadeUp', { dur: 0.9 });
  });

  // ------------------------------------------------------------------ welcome
  registerScene('ch00s02', ({ stage, tl, cue, dur }) => {
    stage.appendChild(style());

    // beat 1: heart + "Not a bad owner. Not a bad dog."
    const g1 = K.el('div'); stage.appendChild(g1);
    const glow = K.el('div', 'c0-glow'); Object.assign(glow.style, { left: '750px', top: '150px' }); g1.appendChild(glow);
    const heart = K.el('div', 'c0-heart'); Object.assign(heart.style, { left: '855px', top: '255px' });
    const hs = K.icon('heart', { stroke: 1.6 }); heart.appendChild(hs); g1.appendChild(heart);
    const msg1 = K.el('div', 'c0-msg', 'Not a bad owner. <span class="g">Not a bad dog.</span>'); msg1.style.top = '560px'; g1.appendChild(msg1);
    A.in(tl, glow, cue(0) + 0.1, 'scale', { dur: 1.4 });
    A.draw(tl, hs.querySelectorAll('path'), cue(0) + 0.1, 1.3);
    tl.fromTo(hs, { fill: 'rgba(97,149,55,0)' }, { fill: 'rgba(97,149,55,0.18)', duration: 0.8 }, cue(0) + 1.2);
    A.in(tl, msg1, cue(0) + 0.9, 'fadeUp');

    // beat 2: a dog having a hard time (red alert badge becomes a green heart)
    const dog = K.el('div', 'c0-dog'); Object.assign(dog.style, { left: '885px', top: '700px' });
    dog.appendChild(K.icon('dog', { stroke: 1.8 })); g1.appendChild(dog);
    const bad = K.el('div', 'c0-badge'); Object.assign(bad.style, { left: '995px', top: '690px', background: 'var(--red)' }); bad.appendChild(K.icon('triangle-alert', { stroke: 2.4 }));
    const good = K.el('div', 'c0-badge'); Object.assign(good.style, { left: '995px', top: '690px', background: 'var(--green)' }); good.appendChild(K.icon('heart', { stroke: 2.4 }));
    g1.appendChild(bad); g1.appendChild(good);
    const msg2 = K.text(g1, 'A dog having a hard time', { x: 0, y: 875, w: 1920, align: 'center', size: 40, weight: 600, color: 'var(--green-dark)' });
    tl.to(heart, { y: -60, scale: 0.8, duration: 0.8, ease: 'power2.inOut' }, cue(1));
    tl.to(glow, { y: -60, scale: 0.8, duration: 0.8, ease: 'power2.inOut' }, cue(1));
    tl.to(msg1, { y: -110, duration: 0.8, ease: 'power2.inOut' }, cue(1));
    A.in(tl, dog, cue(1) + 0.2, 'pop');
    A.in(tl, bad, cue(1) + 0.5, 'pop');
    tl.to(bad, { scale: 0, rotation: 90, opacity: 0, duration: 0.45, ease: 'power2.in' }, cue(1) + 1.9);
    tl.fromTo(good, { scale: 0, rotation: -90, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: 0.55, ease: 'back.out(2)' }, cue(1) + 2.3);
    A.in(tl, msg2, cue(1) + 2.4, 'fadeUp');

    // beat 3: title card
    A.out(tl, g1, cue(2) - 0.1, 'fadeUp', { dur: 0.5 });
    const kick = K.kicker(stage, 'Part 1 &nbsp;·&nbsp; The foundation', { x: 120, y: 190 });
    const h = K.heading(stage, 'Understanding reactivity<br>and aggression', { x: 116, y: 236, w: 1500, size: 100 });
    const part = K.chip(stage, 'Part 1', { x: 1580, y: 250, variant: 'green', icon: 'graduation-cap', size: 34 });
    A.in(tl, kick, cue(2) + 0.35, 'fadeUp');
    A.in(tl, h.title, cue(2) + 0.45, 'wipe', { dur: 1.1 });
    A.in(tl, h.bar, cue(2) + 1.3, 'grow');
    A.in(tl, part, cue(2) + 1.1, 'fadeLeft');

    // beat 4: three things you'll understand
    const items = [['heart', 'The feeling', 'What they feel'], ['repeat', 'The function', 'What it does'], ['glass-water', 'The full cup', 'Why some days']];
    const rows = items.map(([ic, t, s], i) => {
      const r = K.el('div', 'c0-row'); Object.assign(r.style, { left: `${140 + i * 560}px`, top: '600px', height: '270px' });
      const b = K.el('div', 'ib'); b.appendChild(K.icon(ic)); r.appendChild(b);
      r.appendChild(K.el('div', 't', t));
      r.appendChild(K.el('div', 's', s));
      stage.appendChild(r);
      return r;
    });
    const span3 = Math.max(4, dur - cue(3));
    rows.forEach((r, i) => A.in(tl, r, cue(3) + span3 * (0.08 + i * 0.16), 'fadeUp'));
    rows.forEach((r, i) => A.pulse(tl, r.querySelector('.ib'), cue(3) + span3 * (0.62 + i * 0.1), { scale: 1.12 }));

  });
})();
