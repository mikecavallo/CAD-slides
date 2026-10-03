/**
 * Brand and series kit: the parts every chapter of every course shares.
 *
 *   window.BRAND    who and what is on every video (one brand: Calling All Dogs). Edit here, never in a scene.
 *   window.SERIES   the course this lesson belongs to, from the lesson file's "series" block (via build/timing.js):
 *                   { title: "Understanding Dog Behavior", titleLines: ["Understanding", "Dog Behavior"] }
 *   SKIT.titleSlide(ctx)              series title, presenter, headshot ring and training photo
 *   SKIT.chapterCard(ctx, num, title) the narrated chapter card (same look as the automatic bumper)
 *   SKIT.planSlide(ctx, cards, cues)  "Where we're headed": two to four cards, one per beat (any label, icon, colour, rows or text)
 *   SKIT.logoClose(ctx, tL, hide)     the closing logo, url, presenter and credentials
 *
 * Loaded after lib.js and before the scene files. tools/render.mjs hashes this file into every segment.
 */
(() => {
  const BRAND = {
    org: 'Calling All Dogs',
    tagline: 'Training for all breeds',
    url: 'callingalldogsny.com',
    presenter: 'Tori Ganino',
    credentials: 'BS, CDBC, CPDT-KA',
    logo: '../assets/img/logo.png',
    headshot: '../assets/img/trainer_headshot.jpg',
    photo: '../assets/img/trainer_with_dog.jpg',
  };
  const T = window.TIMING || {};
  const SERIES = Object.assign({ title: 'Understanding Dog Behavior' }, T.series || {});
  if (!SERIES.titleLines) SERIES.titleLines = [SERIES.title];

  const CSS = `
  .sk-col { position: absolute; display: flex; flex-direction: column; align-items: flex-start; gap: 30px; }
  .sk-kick { font: 700 28px/1 var(--font-body); letter-spacing: 6px; text-transform: uppercase; color: var(--green); white-space: nowrap; }
  .sk-title { font: 700 88px/1.06 var(--font-head); color: var(--ink); }
  .sk-bar { width: 140px; height: 10px; border-radius: 6px; background: var(--green-light); }
  .sk-who { display: flex; flex-direction: column; gap: 12px; padding-left: 26px; border-left: 8px solid var(--green); margin-top: 26px; }
  .sk-who .nm { font: 700 46px/1 var(--font-head); color: var(--ink); white-space: nowrap; }
  .sk-who .cr { font: 700 30px/1 var(--font-body); color: var(--green-dark); letter-spacing: 1px; white-space: nowrap; }
  .sk-who .og { font: 500 28px/1 var(--font-body); color: var(--ink-soft); white-space: nowrap; }
  .sk-ring { position: absolute; border-radius: 50%; border: 14px solid #fff; box-shadow: 0 0 0 6px var(--green), 0 24px 60px rgba(40,60,20,0.22); overflow: hidden; background: #ddd; }
  .sk-ring img, .sk-snap img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
  .sk-snap { position: absolute; border: 12px solid #fff; border-radius: 22px; box-shadow: 0 22px 50px rgba(40,60,20,0.26); overflow: hidden; background: #ddd; }
  .sk-card { position: absolute; width: 560px; height: 620px; box-sizing: border-box; padding: 40px 36px; background: #fff; border-radius: 28px;
    border: 1px solid #e6e9e1; display: flex; flex-direction: column; align-items: flex-start; }
  .sk-card .bd { width: 84px; height: 84px; border-radius: 50%; display: grid; place-items: center; flex: 0 0 auto; }
  .sk-card .bd svg { width: 46px; height: 46px; stroke-width: 2.2; }
  .sk-card .lab { margin-top: 24px; font: 700 48px/1 var(--font-head); color: var(--ink); white-space: nowrap; }
  .sk-card .rule { margin: 28px 0 26px; width: 100%; height: 2px; background: #eef1ea; }
  .sk-card .rows { display: flex; flex-direction: column; gap: 22px; width: 100%; }
  .sk-card.narrow .lab { font-size: 38px; }
  .sk-card.narrow .sk-row { font-size: 26px; }
  .sk-card.narrow .sk-stmt { font-size: 32px; }
  .sk-stmt { font: 600 38px/1.3 var(--font-head); color: var(--ink); }
  .sk-stmt b { color: var(--green); font-weight: 700; }
  .sk-row { display: flex; align-items: center; gap: 18px; font: 600 30px/1.2 var(--font-body); color: var(--ink); }
  .sk-row .ic { width: 50px; height: 50px; border-radius: 50%; display: grid; place-items: center; flex: 0 0 auto; }
  .sk-row .ic svg { width: 28px; height: 28px; stroke-width: 2.4; }
  .sk-row .ic.num { font: 700 28px/1 var(--font-head); }
  .sk-halo { position: absolute; border-radius: 50%; background: radial-gradient(closest-side, rgba(232,241,220,0.95), rgba(232,241,220,0.55) 55%, rgba(232,241,220,0) 100%); }
  .sk-close { position: absolute; left: 0; width: 1920px; text-align: center; white-space: nowrap; font: 600 42px/1.2 var(--font-body); color: var(--green-dark); letter-spacing: 0.5px; }
  `;
  const style = stage => { if (!stage.querySelector('style[data-sk]')) { const s = K.el('style', null, CSS); s.dataset.sk = '1'; stage.appendChild(s); } };
  const say = (ctx, i, phrase, fb = 0.5, lead = 0.3) => Math.max(ctx.cue(i), ctx.phrase(i, phrase, fb) - lead);
  const clamp = (t, lo, hi) => Math.max(lo, Math.min(t, hi));
  const SH0 = '0 10px 30px rgba(40,60,20,0.10), 0 0 0 0px rgba(97,149,55,0)';
  const SHH = '0 18px 44px rgba(40,60,20,0.16), 0 0 0 4px rgba(97,149,55,1)';

  /** Title slide: the series title at left with the presenter block; headshot ring and training photo at right. */
  function titleSlide(ctx) {
    const { stage, tl, end, dur } = ctx;
    style(stage);
    const col = K.el('div', 'sk-col');
    Object.assign(col.style, { left: '100px', top: '232px', width: '1000px' });
    const kick = K.el('div', 'sk-kick', BRAND.org);
    const title = K.el('div', 'sk-title', SERIES.titleLines.join('<br>'));
    const bar = K.el('div', 'sk-bar');
    const who = K.el('div', 'sk-who');
    [['nm', BRAND.presenter], ['cr', BRAND.credentials], ['og', `${BRAND.org} · ${BRAND.tagline}`]].forEach(([c, t]) => who.appendChild(K.el('div', c, t)));
    [kick, title, bar, who].forEach(n => col.appendChild(n));
    stage.appendChild(col);

    const RR = 270, CX = 1450, CY = 532;
    const ring = K.el('div', 'sk-ring');
    Object.assign(ring.style, { left: CX - RR + 'px', top: CY - RR + 'px', width: 2 * RR + 'px', height: 2 * RR + 'px' });
    const head = K.el('img');
    head.src = BRAND.headshot;
    ring.appendChild(head);
    stage.appendChild(ring);
    const snap = K.el('div', 'sk-snap');
    Object.assign(snap.style, { left: '1060px', top: '664px', width: '392px', height: '294px' });
    const pic = K.el('img');
    pic.src = BRAND.photo;
    snap.appendChild(pic);
    stage.appendChild(snap);

    A.in(tl, kick, 0.1, 'fadeUp', { dur: 0.6 });
    A.in(tl, title, 0.25, 'fadeUp', { dur: 0.8 });
    A.in(tl, bar, 0.55, 'grow', { dur: 0.6 });
    tl.fromTo(ring, { opacity: 0, scale: 0.86 }, { opacity: 1, scale: 1, duration: 1.0, ease: 'power3.out' }, 0.45);
    tl.fromTo(head, { scale: 1.08 }, { scale: 1.0, duration: Math.max(1, dur - 0.5), ease: 'none' }, 0.45);
    const tName = clamp(say(ctx, 0, BRAND.presenter, 0.1), 1.1, end(0) - 6);
    A.in(tl, who, tName, 'fadeRight', { dur: 0.7 });
    const tSnap = clamp(say(ctx, 0, BRAND.org, 0.2), tName + 0.6, end(0) - 5);
    tl.fromTo(snap, { opacity: 0, y: 40, rotation: 3 }, { opacity: 1, y: 0, rotation: -5, duration: 0.9, ease: 'power3.out' }, tSnap);
    const tTitle = clamp(say(ctx, 0, SERIES.title, 0.6), tSnap + 0.6, end(0) - 3);
    tl.to(bar, { width: 260, duration: 0.8, ease: 'power2.inOut' }, tTitle);
  }

  /** Narrated chapter card: the automatic bumper's look (base.css .bumper-*), as a scene so the narration plays over it. */
  function chapterCard(ctx, num, title) {
    const { stage, tl } = ctx;
    const n = K.el('div', 'bumper-num', String(num).padStart(2, '0'));
    const bar = K.el('div', 'bumper-bar');
    const kick = K.el('div', 'bumper-kicker', 'Chapter ' + num);
    const tt = K.el('div', 'bumper-title', K.md(title));
    [n, bar, kick, tt].forEach(x => stage.appendChild(x));
    A.in(tl, n, 0.05, 'fadeRight', { dur: 0.9 });
    A.in(tl, bar, 0.25, 'grow', { dur: 0.6 });
    A.in(tl, kick, 0.35, 'fadeUp', { dur: 0.6 });
    A.in(tl, tt, 0.5, 'fadeUp', { dur: 0.8 });
  }

  /** One plan card: icon badge, label, then rows (or a statement). */
  function card(stage, x, o, w = 560) {
    const c = K.el('div', 'sk-card' + (w < 480 ? ' narrow' : ''));
    Object.assign(c.style, { left: x + 'px', top: '290px', width: w + 'px', boxShadow: SH0 });
    const bd = K.el('div', 'bd');
    Object.assign(bd.style, { background: o.bg, color: o.fg });
    bd.appendChild(K.icon(o.icon));
    c.appendChild(bd);
    c.appendChild(K.el('div', 'lab', o.lab));
    c.appendChild(K.el('div', 'rule'));
    if (o.text) {
      const st = K.el('div', 'sk-stmt', K.md(o.text));
      c.appendChild(st);
      stage.appendChild(c);
      return { c, bd, rs: [st] };
    }
    const rows = K.el('div', 'rows');
    const rs = o.rows.map((t, i) => {
      const r = K.el('div', 'sk-row');
      const ic = K.el('div', 'ic' + (o.num ? ' num' : ''));
      Object.assign(ic.style, { background: o.rowBg, color: o.rowFg });
      if (o.num) ic.textContent = String(i + 1);
      else ic.appendChild(K.icon(o.rowIcons[i]));
      r.appendChild(ic);
      r.appendChild(K.el('span', null, t));
      rows.appendChild(r);
      return r;
    });
    c.appendChild(rows);
    stage.appendChild(c);
    return { c, bd, rs };
  }

  /** Plan slide presets for the three cards, so every chapter's plan looks the same. */
  const PLAN = {
    why: { icon: 'circle-alert', bg: 'var(--amber-pale)', fg: 'var(--amber)', lab: 'Why it matters', rowBg: 'var(--amber-pale)', rowFg: 'var(--amber)' },
    gain: { icon: 'target', bg: 'var(--green-pale)', fg: 'var(--green-dark)', lab: 'What you’ll gain' },
    how: { icon: 'route', bg: 'var(--green)', fg: '#fff', lab: 'How we’ll get there', num: true, rowBg: 'var(--green)', rowFg: '#fff' },
  };

  /**
   * "Where we're headed": two to four cards, one per beat. cards: option objects, either a PLAN preset spread with rows,
   * rowIcons or text, or a card of your own: { icon, bg, fg, lab, rows | text, rowIcons | num, rowBg, rowFg }; cues: per card, [phrase, fallback] for each row, so each row lands as it is said.
   */
  function planSlide(ctx, cards, cues, heading = 'Where we’re headed') {
    const { stage, tl, cue, end } = ctx;
    style(stage);
    const h = K.heading(stage, heading, { x: 100, y: 110, size: 72, barGap: 20 });
    A.in(tl, h.all, 0.05, 'fadeUp', { dur: 0.7, stagger: 0.1 });
    // two to four cards share the width between the margins (three cards: 560 px each, as in Chapter 2)
    const n = cards.length, w = (1720 - 20 * (n - 1)) / n;
    const ks = cards.map((o, i) => card(stage, 100 + i * (w + 20), o, w));
    ks.forEach((k, b) => {
      const t = cue(b) + 0.05;
      if (b > 0) tl.to(ks[b - 1].c, { boxShadow: SH0, duration: 0.5, ease: 'power2.out' }, t);
      tl.fromTo(k.c, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, t);
      tl.to(k.c, { boxShadow: SHH, duration: 0.6, ease: 'power2.out' }, t + 0.3);
      A.in(tl, k.bd, t + 0.25, 'pop', { dur: 0.55 });
      let lo = t + 0.7;
      k.rs.forEach((r, i) => {
        const [p, fb] = (cues[b] || [])[i] || ['', 0.3 + 0.25 * i];
        const tr = clamp(say(ctx, b, p, fb, 0.25), lo, end(b) - 0.4);
        A.in(tl, r, tr, 'fadeRight', { dur: 0.55 });
        lo = tr + 0.35;
      });
    });
    return { h, cards: ks };
  }

  /** The closing logo: hide `hide`, the corner logo steps aside, the logo, url, presenter and credentials settle at centre. */
  function logoClose(ctx, tL, hide) {
    const { stage, tl, chrome } = ctx;
    style(stage);
    if (hide && (!Array.isArray(hide) || hide.length)) tl.to(hide, { opacity: 0, duration: 0.5, ease: 'power2.in' }, tL - 0.1);
    tl.to(chrome.logo, { opacity: 0, duration: 0.4 }, tL);
    const halo = K.el('div', 'sk-halo');
    Object.assign(halo.style, { left: '360px', top: '190px', width: '1200px', height: '560px' });
    stage.appendChild(halo);
    A.in(tl, halo, tL + 0.1, 'fade', { dur: 1.0 });
    const logo = K.el('img', null, null, { position: 'absolute', left: '610px', top: '268px', width: '700px' });
    logo.src = BRAND.logo;
    stage.appendChild(logo);
    tl.fromTo(logo, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out' }, tL + 0.15);
    const url = K.el('div', 'sk-close', BRAND.url);
    url.style.top = '610px';
    stage.appendChild(url);
    A.in(tl, url, tL + 0.45, 'fadeUp', { dur: 0.6 });
    const nm = K.el('div', 'sk-close', `<b>${BRAND.presenter}</b>, ${BRAND.credentials}`);
    Object.assign(nm.style, { top: '700px', color: 'var(--ink)', fontSize: '40px' });
    stage.appendChild(nm);
    A.in(tl, nm, tL + 0.7, 'fadeUp', { dur: 0.6 });
  }

  window.BRAND = BRAND;
  window.SERIES = SERIES;
  window.SKIT = { BRAND, SERIES, PLAN, style, titleSlide, chapterCard, planSlide, logoClose };
})();
