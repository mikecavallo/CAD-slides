// Chapter 10: where to go from here (deck slide 16) and the close.
(function () {
  const css = `
    .c10-step { position:absolute; top:330px; width:520px; height:350px; border-radius:26px; padding:34px 36px; border:3px dashed #cfdcc0; background:rgba(255,255,255,0.4); }
    .c10-step .fill { position:absolute; inset:-3px; border-radius:26px; background:#fff; border:1px solid #e3e8dc; box-shadow: var(--shadow-soft); }
    .c10-step .top { position:relative; display:flex; align-items:center; gap:18px; }
    .c10-step .n { width:66px; height:66px; border-radius:18px; background: var(--green-pale); color: var(--green-dark); display:grid; place-items:center; font:800 36px/1 Rubik, sans-serif; }
    .c10-step .n.ghost { background:transparent; border:3px dashed #cfdcc0; color:#c3d3b1; }
    .c10-step .ib { width:66px; height:66px; border-radius:50%; background: var(--green); color:#fff; display:grid; place-items:center; }
    .c10-step .ib svg { width:36px; height:36px; }
    .c10-step .t { position:relative; margin-top:26px; font:700 40px/1.15 Rubik, sans-serif; color: var(--ink); }
    .c10-step .b { position:relative; margin-top:14px; font:400 27px/1.42 Montserrat, sans-serif; color: var(--ink-soft); }
    .c10-step .pill { position:absolute; left:36px; bottom:30px; padding:9px 18px; border-radius:999px; background: var(--green-pale); color: var(--green-dark); font:700 19px/1 Montserrat, sans-serif; letter-spacing:2px; }
    .c10-step .mini { position:absolute; right:30px; bottom:24px; display:flex; gap:10px; }
    .c10-step .mini div { width:52px; height:52px; border-radius:50%; background: var(--green-mist); border:2px solid var(--green-light); color: var(--green-dark); display:grid; place-items:center; }
    .c10-step .mini svg { width:28px; height:28px; }
    .c10-def { position:absolute; top:720px; height:220px; width:760px; border-radius:24px; background:#fff; border:2px solid var(--green-light); box-shadow: var(--shadow-soft); padding:26px 32px; }
    .c10-def .dt { font:700 34px/1 Rubik, sans-serif; color: var(--green-dark); }
    .c10-def .dd { margin-top:10px; font:500 27px/1.3 Montserrat, sans-serif; color: var(--ink); }
    .c10-eq { position:absolute; left:32px; bottom:24px; display:flex; align-items:center; gap:16px; font:700 40px/1 Rubik, sans-serif; color: var(--muted); }
    .c10-eq .e { width:72px; height:72px; border-radius:50%; display:grid; place-items:center; }
    .c10-eq .e svg { width:40px; height:40px; }
    .c10-link { position:absolute; width:3px; background: var(--green-light); }
    .c10-lab { position:absolute; display:flex; align-items:center; gap:18px; padding:18px 30px 18px 18px; border-radius:999px; background:rgba(255,255,255,0.95); box-shadow:0 12px 36px rgba(0,0,0,0.22); font:700 42px/1 Rubik, sans-serif; color: var(--ink); }
    .c10-lab .ib { width:74px; height:74px; border-radius:50%; background: var(--green); color:#fff; display:grid; place-items:center; }
    .c10-lab .ib svg { width:42px; height:42px; }
    .c10-close { position:absolute; left:0; width:1920px; text-align:center; font:700 64px/1.15 Rubik, sans-serif; color: var(--ink); }
    .c10-close .g { color: var(--green); }
  `;

  // ------------------------------------------------------------------ the roadmap
  registerScene('ch10s01', ({ stage, tl, cue }) => {
    stage.appendChild(K.el('style', null, css));
    const h = K.heading(stage, 'Where to go from here', { x: 116, y: 120, size: 80 });
    const sub = K.text(stage, 'Understanding the *why* comes first.', { cls: 'lead', x: 120, y: 262, w: 1300 });
    A.in(tl, h.title, cue(0), 'wipe', { dur: 0.9 });
    A.in(tl, h.bar, cue(0) + 0.7, 'grow');
    A.in(tl, sub, cue(0) + 0.9, 'fadeUp');

    const STEPS = [
      { icon: 'shield-check', t: 'Manage first', b: 'Prevent rehearsal and keep everyone safe while you work.', pill: 'MANAGEMENT' },
      { icon: 'heart', t: 'Change the emotion', b: 'Build a new feeling about the trigger.', pill: 'TRAINING FOUNDATIONS' },
      { icon: 'map', t: 'Then your situation', b: 'Setups for walks, visitors, guarding and dog-to-dog.', pill: 'THE PLAYBOOKS' },
    ];
    const steps = STEPS.map((s, i) => {
      const card = K.el('div', 'c10-step'); card.style.left = `${110 + i * 580}px`;
      const fill = K.el('div', 'fill');
      const top = K.el('div', 'top');
      const ghost = K.el('div', 'n ghost', String(i + 1));
      top.appendChild(ghost);
      const content = K.el('div', null, null, { position: 'absolute', inset: '34px 36px' });
      const top2 = K.el('div', 'top');
      top2.appendChild(K.el('div', 'n', String(i + 1)));
      const ib = K.el('div', 'ib'); ib.appendChild(K.icon(s.icon)); top2.appendChild(ib);
      content.appendChild(top2);
      content.appendChild(K.el('div', 't', s.t));
      content.appendChild(K.el('div', 'b', s.b));
      const pill = K.el('div', 'pill', s.pill); pill.style.left = '0'; pill.style.bottom = '-4px';
      content.appendChild(pill);
      [fill, top, content].forEach(n => card.appendChild(n));
      stage.appendChild(card);
      return { card, fill, content, ib };
    });
    steps.forEach((s, i) => tl.fromTo(s.card, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 }, cue(0) + 1.2 + i * 0.15));
    const fillStep = (s, t) => {
      tl.fromTo(s.fill, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.6 }, t);
      tl.fromTo(s.content, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6 }, t + 0.15);
      tl.fromTo(s.ib, { scale: 0.4 }, { scale: 1, duration: 0.5, ease: 'back.out(2)' }, t + 0.35);
    };
    fillStep(steps[0], cue(1));
    // the worn lawn path from chapter 3 grows back over
    const lawn = K.svg(steps[0].card, { x: 318, y: 262, w: 170, h: 72, viewBox: '0 0 190 80' });
    lawn.style.zIndex = 2;
    const path = K.path(lawn, 'M 6 70 C 60 60 90 30 184 12', { stroke: '#b89a6a', 'stroke-width': 12, opacity: 0.75 });
    const fresh = K.path(lawn, 'M 6 44 C 60 36 90 10 184 -8', { stroke: '#619537', 'stroke-width': 7 });
    A.in(tl, path, cue(1) + 0.9, 'fade');
    tl.to(path, { opacity: 0.45, duration: 1.2 }, cue(1) + 2.8);
    A.draw(tl, fresh, cue(1) + 3.0, 1.4);

    fillStep(steps[1], cue(2));
    // definition cards hang off card 2
    const link = K.el('div', 'c10-link'); Object.assign(link.style, { left: `${110 + 580 + 260}px`, top: '683px', height: '37px' });
    stage.appendChild(link);
    const defA = K.el('div', 'c10-def'); defA.style.left = '160px';
    defA.innerHTML = '<div class="dt">Counterconditioning</div><div class="dd">Trigger means good things</div>';
    const eq = K.el('div', 'c10-eq');
    const eqItem = (ic, bg, fg) => { const e = K.el('div', 'e', null, { background: bg, color: fg }); e.appendChild(K.icon(ic)); return e; };
    [eqItem('triangle-alert', 'var(--amber-pale)', 'var(--amber)'), K.el('span', null, '+'), eqItem('cookie', 'var(--green-pale)', 'var(--green-dark)'), K.el('span', null, '='), eqItem('heart', 'var(--green)', '#fff')].forEach(n => eq.appendChild(n));
    defA.appendChild(eq);
    const defB = K.el('div', 'c10-def'); defB.style.left = '1000px';
    defB.innerHTML = '<div class="dt">Desensitization</div><div class="dd">Start easy, build slowly</div>';
    const slider = K.svg(defB, { x: 32, y: 128, w: 690, h: 70, viewBox: '0 0 690 70' });
    K.line(slider, 20, 40, 560, 40, { stroke: '#e3e8dc', 'stroke-width': 10 });
    [60, 190, 320, 450].forEach(x => K.line(slider, x, 30, x, 50, { stroke: '#cfdcc0', 'stroke-width': 4 }));
    K.svgText(slider, 20, 14, 'FAR', { 'font-size': 18, 'font-weight': 700, fill: '#7a7a7a', 'letter-spacing': 2 });
    K.svgText(slider, 470, 14, 'CLOSER', { 'font-size': 18, 'font-weight': 700, fill: '#7a7a7a', 'letter-spacing': 2 });
    const knob = K.circle(slider, 60, 40, 18, { fill: '#619537', stroke: '#fff', 'stroke-width': 5 });
    const trigger = K.el('div', 'e', null, { position: 'absolute', right: '28px', top: '112px', width: '72px', height: '72px', borderRadius: '50%', background: 'var(--amber-pale)', color: 'var(--amber)', display: 'grid', placeItems: 'center' });
    trigger.appendChild(K.icon('dog', { size: 40 })); defB.appendChild(trigger);
    [defA, defB].forEach(d => stage.appendChild(d));
    A.in(tl, link, cue(3) - 0.2, 'wipeDown', { dur: 0.4 });
    tl.fromTo(defA, { opacity: 0, rotationX: -80, transformOrigin: '50% 0%' }, { opacity: 1, rotationX: 0, duration: 0.8, ease: 'power3.out' }, cue(3));
    A.in(tl, [...eq.children], cue(3) + 1.2, 'pop', { stagger: 0.35 });
    tl.fromTo(defB, { opacity: 0, rotationX: -80, transformOrigin: '50% 0%' }, { opacity: 1, rotationX: 0, duration: 0.8, ease: 'power3.out' }, cue(4));
    [190, 320, 450].forEach((x, i) => tl.to(knob, { attr: { cx: x }, duration: 0.5, ease: 'power2.inOut' }, cue(4) + 1.3 + i * 1.1));

    fillStep(steps[2], cue(5));
    const mini = K.el('div', 'mini');
    ['footprints', 'house', 'bone', 'dog'].forEach(ic => { const d = K.el('div'); d.appendChild(K.icon(ic)); mini.appendChild(d); });
    Object.assign(mini.style, { bottom: 'auto', top: '7px', right: '0' });
    steps[2].content.appendChild(mini);
    A.in(tl, [...mini.children], cue(5) + 0.9, 'pop', { stagger: 0.2 });
  });

  // ------------------------------------------------------------------ the close
  registerScene('ch10s02', ({ stage, tl, cue, dur, chrome }) => {
    stage.appendChild(K.el('style', null, css));

    // beats 1-2: progress, not perfection
    const g1 = K.el('div'); stage.appendChild(g1);
    const h = K.heading(g1, 'It can get a lot better', { x: 116, y: 120, size: 80 });
    const sub = K.text(g1, 'Progress, *not perfection*', { cls: 'lead', x: 120, y: 262, w: 1200, size: 42 });
    A.in(tl, h.title, cue(0), 'wipe', { dur: 0.9 });
    A.in(tl, h.bar, cue(0) + 0.7, 'grow');
    const svg = K.svg(g1, { x: 160, y: 340, w: 1600, h: 600, viewBox: '0 0 1600 600' });
    K.line(svg, 40, 560, 1560, 560, { stroke: '#d9ddd3', 'stroke-width': 4 });
    K.line(svg, 40, 560, 40, 40, { stroke: '#d9ddd3', 'stroke-width': 4 });
    K.svgText(svg, 1560, 596, 'TIME', { 'text-anchor': 'end', 'font-size': 22, 'font-weight': 700, fill: '#7a7a7a', 'letter-spacing': 3 });
    K.svgText(svg, 60, 40, 'PROGRESS', { 'font-size': 22, 'font-weight': 700, fill: '#7a7a7a', 'letter-spacing': 3 });
    const pts = [[40, 540], [180, 500], [270, 470], [330, 505], [450, 420], [560, 390], [630, 430], [760, 330], [880, 300], [950, 345], [1080, 240], [1200, 200], [1270, 235], [1400, 130], [1540, 80]];
    const d = 'M ' + pts.map(p => p.join(' ')).join(' L ');
    const trend = K.path(svg, 'M 40 540 L 1540 80', { stroke: '#b8d99a', 'stroke-width': 6, 'stroke-dasharray': '4 18', opacity: 0 });
    const glowLine = K.path(svg, d, { stroke: '#b8d99a', 'stroke-width': 26, opacity: 0 });
    const line = K.path(svg, d, { stroke: '#619537', 'stroke-width': 9 });
    const dips = [[330, 505], [630, 430], [950, 345], [1270, 235]].map(([x, y]) => K.circle(svg, x, y, 16, { fill: '#d9912b', stroke: '#fff', 'stroke-width': 5 }));
    const arrow = K.path(svg, 'M 1500 76 L 1545 78 L 1522 118', { stroke: '#619537', 'stroke-width': 9 });
    A.draw(tl, line, cue(0) + 0.6, Math.max(2, (cue(1) - cue(0)) - 0.8), { ease: 'power1.inOut' });
    A.in(tl, arrow, cue(1) - 0.3, 'fade', { dur: 0.3 });
    A.in(tl, sub, cue(1), 'fadeUp');
    A.in(tl, dips, cue(1) + 0.6, 'pop', { stagger: 0.3 });
    tl.to(glowLine, { opacity: 0.7, duration: 1 }, cue(1) + 2);
    tl.to(trend, { opacity: 1, duration: 0.8 }, cue(1) + 2.2);

    // beat 3: back to the opening walk, now with new eyes
    A.out(tl, g1, cue(2) - 0.1, 'fade', { dur: 0.5 });
    const photo = K.photo(stage, 'photo_reactivity.jpg', { x: 0, y: 0, w: 1920, h: 1080, bleed: true, pos: '50% 30%' });
    const wash = K.el('div', null, null, { position: 'absolute', inset: '0', background: 'linear-gradient(90deg, rgba(247,248,246,0.94) 0%, rgba(247,248,246,0.75) 45%, rgba(247,248,246,0.1) 80%)' });
    photo.root.appendChild(wash);
    tl.fromTo(photo.root, { opacity: 0 }, { opacity: 1, duration: 1.0, ease: 'power2.out' }, cue(2) + 0.2);
    tl.fromTo(photo.img, { scale: 1.08 }, { scale: 1.0, duration: Math.max(1, cue(3) - cue(2) + 0.6), ease: 'none' }, cue(2) + 0.2);
    tl.set(chrome.footer.querySelector('.url'), { opacity: 0 }, cue(2) + 0.5);
    tl.set(chrome.footer.querySelector('.url'), { opacity: 1 }, cue(3) + 0.6);
    const labs = [['heart', 'Feeling'], ['repeat', 'Function'], ['stress-cup', 'Full cup']].map(([ic, t], i) => {
      const l = K.el('div', 'c10-lab'); Object.assign(l.style, { left: `${150 + i * 70}px`, top: `${300 + i * 170}px` });
      const b = K.el('div', 'ib'); b.appendChild(K.icon(ic)); l.appendChild(b); l.appendChild(K.el('span', null, t));
      stage.appendChild(l);
      return l;
    });
    // time the labels to the three words near the end of the beat
    const span = Math.max(3, cue(3) - cue(2));
    labs.forEach((l, i) => A.in(tl, l, cue(2) + span * (0.62 + i * 0.1), 'fadeRight', { dur: 0.7 }));

    // beat 4: they're having a hard time
    A.out(tl, [photo.root, ...labs], cue(3) - 0.1, 'fade', { dur: 0.6 });
    const heart = K.el('div', null, null, { position: 'absolute', left: '865px', top: '230px', width: '190px', height: '190px', color: 'var(--green)' });
    const hs = K.icon('heart', { stroke: 1.6 }); hs.style.width = hs.style.height = '100%'; heart.appendChild(hs);
    stage.appendChild(heart);
    const line1 = K.el('div', 'c10-close', 'Not giving you a hard time.'); line1.style.top = '500px'; line1.style.color = 'var(--muted)'; line1.style.fontSize = '54px';
    const line2 = K.el('div', 'c10-close', '<span class="g">Having</span> a hard time.'); line2.style.top = '590px'; line2.style.fontSize = '80px';
    stage.appendChild(line1); stage.appendChild(line2);
    A.draw(tl, hs.querySelectorAll('path'), cue(3) + 0.3, 1.2);
    tl.fromTo(hs, { fill: 'rgba(97,149,55,0)' }, { fill: 'rgba(97,149,55,0.2)', duration: 0.8 }, cue(3) + 1.3);
    A.in(tl, line1, cue(3) + 0.6, 'fadeUp');
    A.in(tl, line2, cue(3) + 1.6, 'fadeUp');

    // beat 5: sign-off
    A.out(tl, [heart, line1, line2], cue(4) - 0.1, 'fade', { dur: 0.5 });
    tl.to(chrome.logo, { opacity: 0, duration: 0.4 }, cue(4));
    const logo = K.el('img', null, null, { position: 'absolute', left: '560px', top: '250px', width: '800px' });
    logo.src = '../assets/img/logo.png';
    stage.appendChild(logo);
    const url = K.el('div', 'c10-close', 'callingalldogsny.com'); Object.assign(url.style, { top: '660px', fontSize: '44px', color: 'var(--green-dark)', fontFamily: 'Montserrat', fontWeight: 600 });
    const bye = K.el('div', 'c10-close', 'See you in the next lesson'); Object.assign(bye.style, { top: '770px', fontSize: '40px', color: 'var(--muted)', fontWeight: 600 });
    stage.appendChild(url); stage.appendChild(bye);
    tl.fromTo(logo, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 1.1, ease: 'power3.out' }, cue(4) + 0.2);
    A.in(tl, url, cue(4) + 1.0, 'fadeUp');
    A.in(tl, bye, cue(4) + 1.6, 'fadeUp');
  });
})();
