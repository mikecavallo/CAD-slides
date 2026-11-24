// Shared parts for "Management: Solutions and Setups" (script/lesson-management2.json). Scenes use them through window.MS.
// Built on the Management: The Basics kit (window.MG) and Markers and Mechanics (window.TM). CSS classes are prefixed .ms-.
//
//   MS.css(stage)                inject the TM, MG and MS styles
//   MS.chips(stage, x, y, items, o)  a wrapping row of word chips: items [text, variant, icon, cross] or '>' for an arrow
//   MS.tip(ctx, o)               one setup slide: heading, section chip, Tori's picture whole at right with marks, lead, chips,
//                                and the green "Why it works" card on the bottom of the content area
//   MS.overview(ctx, o)          a section opener: the deck's summary line, then the numbered setups
//   MS.mark(ctx, ph, m, t)       the picture marks of a tip: rings, dotted lines and one tag (fractions of the picture)
(() => {
  const CSS = `
  .ms-lead { position: absolute; font: 600 36px/1.36 var(--font-body); color: var(--ink-soft); }
  .ms-lead b { color: var(--green-dark); }
  .ms-lead.red b { color: var(--red); }
  .ms-row { position: absolute; display: flex; align-items: center; flex-wrap: wrap; gap: 16px 16px; }
  .ms-row .tm-word, .ms-row .iconbadge { position: relative; left: auto; top: auto; }
  .ms-sec { position: absolute; }
  .ms-ov { position: absolute; display: grid; grid-template-columns: 1fr 1fr; gap: 22px 40px; }
  .ms-ov .it { display: flex; align-items: center; gap: 22px; box-sizing: border-box; padding: 18px 26px 18px 20px; border-radius: 22px; background: #fff;
    border: 1px solid #e6e9e1; box-shadow: var(--shadow-soft); font: 700 34px/1.2 var(--font-head); color: var(--ink); }
  .ms-ov .it .n { width: 58px; height: 58px; border-radius: 50%; background: var(--green); color: #fff; font: 700 30px/58px var(--font-head); text-align: center; flex: 0 0 auto; }
  `;
  const css = stage => {
    MG.css(stage);
    if (!stage.querySelector('style[data-ms]')) { const s = K.el('style', null, CSS); s.dataset.ms = '1'; stage.appendChild(s); }
  };
  const { put, at } = TM;
  const flow = n => { n.style.position = 'relative'; n.style.left = n.style.top = ''; return n; };

  function chips(stage, x, y, items, o = {}) {
    const row = put(stage, K.el('div', 'ms-row'), x, y, o.w ? { width: o.w + 'px' } : {});
    const els = items.map(it => {
      if (it === '>') { const a = K.iconBadge(row, 'arrow-right', { size: 46 }); return flow(a); }
      const n = flow(TM.word(row, it[0], { variant: it[1], icon: it[2], size: o.size ?? 30, cross: it[3] }));
      return n;
    });
    return { row, els };
  }

  /** Picture marks. m: { rings: [[fx, fy, r, color, beat, phrase, fb]], dots: [[[fx, fy]...], color]], tag: [text, wx, wy, variant] }. */
  function mark(ctx, ph, w, h, m, t) {
    const { tl } = ctx;
    (m.dots || []).forEach(([pts, col], i) => TM.fx.dots(tl, ph.sv, pts.map(p => ph.P(p[0], p[1])), t + 0.15 * i,
      { color: '#fff', stroke: col || '#d9912b', r: 5, gap: 18, dur: 0.7, hold: 99 }));
    (m.rings || []).forEach(([fx, fy, r, col], i) => TM.fx.ring(tl, ph.sv, ph.P(fx, fy), t + 0.35 * i, { r: r || 40, n: 2, color: col || 'var(--green)' }));
    if (m.tag) {
      const [text, wx, wy, variant] = m.tag;
      const tg = TM.fx.tag(tl, ph.wrap, text, 0, 0, t + 0.45, variant || 'green');
      tg.style.fontSize = '26px';
      // keep the tag inside the picture: wx, wy are fractions of the picture box (right or bottom aligned past 0.5)
      const tw = tg.offsetWidth, th = tg.offsetHeight;
      tg.style.left = Math.round(wx > 0.5 ? w * wx - tw : w * wx) + 'px';
      tg.style.top = Math.round(wy > 0.5 ? h * wy - th : h * wy) + 'px';
    }
  }

  /**
   * One setup. o: { sec, icon, n, title, src, nat, lead, leadRed, leadAt: [beat, phrase], chips: [[text, variant, icon, cross, phrase]],
   * chipsFirst, why, mark: { ..., beat, phrase } }.
   */
  function tip(ctx, o) {
    const { stage, tl, cue } = ctx;
    css(stage);
    const land = o.nat[0] > o.nat[1];
    const maxW = o.maxW ?? (land ? 640 : 520), maxH = o.maxH ?? (land ? 520 : 640);
    const { w, h } = MG.fit(o.nat, maxW, maxH);
    const px = 1820 - w, py = 300 + Math.round((640 - h) / 2);
    const X = 100, W = px - X - 80;
    const hd = TM.head(ctx, 'Setup', o.title, { w: W });
    const ph = TM.pic(stage, o.src, { x: px, y: py, w, h, nat: o.nat, radius: 22 });
    tl.fromTo(ph.wrap, { opacity: 0, y: 40, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out' }, 0.35);
    let y = hd.h.root.offsetTop + hd.h.root.offsetHeight + 34;
    const sec = put(stage, K.el('div', 'mg-chip green ms-sec', `${K.icon(o.icon).outerHTML}<span>${o.sec} · ${String(o.n).padStart(2, '0')}</span>`), X, y);
    A.in(tl, sec, 0.5, 'fadeRight', { dur: 0.6 });
    y += 84 + 6;
    const t1 = cue(1) + 0.05;
    const parts = [];
    const addLead = () => {
      if (!o.lead) return;
      const ld = put(stage, K.el('div', 'ms-lead' + (o.leadRed ? ' red' : ''), K.md(o.lead)), X, y, { width: W + 'px' });
      const t = o.leadAt ? at(ctx, o.leadAt[0], o.leadAt[1], 0.5) : t1;
      A.in(tl, ld, t, 'fadeUp', { dur: 0.6 });
      y += ld.offsetHeight + 28;
      parts.push(ld);
    };
    const addChips = () => {
      if (!o.chips || !o.chips.length) return;
      const items = o.chips.map(c => (c === '>' ? '>' : [c[0], c[1], c[2], c[3]]));
      const r = chips(stage, X, y, items, { w: W, size: o.chipSize ?? 30 });
      let k = 0;
      r.els.forEach((e, i) => {
        const c = o.chips[i];
        if (c === '>') { A.in(tl, e, t1 + 0.4 + 0.3 * i, 'fade', { dur: 0.4 }); return; }
        const t = c[4] ? at(ctx, c[5] ?? 1, c[4], 0.25 + 0.2 * k) : t1 + 0.4 + 0.35 * k;
        A.in(tl, e, t, 'pop', { dur: 0.4 });
        if (c[3]) TM.strike(tl, e, t + 0.35);
        k++;
      });
      y += r.row.offsetHeight + 30;
      parts.push(r.row);
    };
    if (o.chipsFirst) { addChips(); addLead(); } else { addLead(); addChips(); }
    // the green Why it works card on the bottom of the content area
    const why = MG.card(stage, { x: X, y: 0, w: W, variant: 'green', label: 'Why it works', icon: 'lightbulb', body: o.why, size: 31 });
    why.style.top = (948 - why.offsetHeight) + 'px';
    tl.fromTo(why, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, cue(2) + 0.05);
    if (o.mark) {
      const mk = o.mark;
      const t = mk.phrase ? at(ctx, mk.beat ?? 1, mk.phrase, 0.4) : cue(mk.beat ?? 1) + 0.6;
      mark(ctx, ph, w, h, mk, t);
    }
    return { hd, ph, sec, why, parts, X, W, y, px, py, w, h };
  }

  /** Section opener. o: { title, lead, items, icon } -> the summary line and the numbered setups. */
  function overview(ctx, o) {
    const { stage, tl, cue } = ctx;
    css(stage);
    const hd = TM.head(ctx, 'Management in action', o.title);
    const ld = put(stage, K.el('div', 'mg-lead', K.md(o.lead)), 100, 290, { width: '1700px', fontSize: '38px' });
    A.in(tl, ld, cue(0) + 0.4, 'fadeUp', { dur: 0.7 });
    const n = o.items.length, rows = Math.ceil(n / 2);
    const top = 290 + ld.offsetHeight + 46;
    const gap = n > 6 ? 18 : 30;
    const grid = put(stage, K.el('div', 'ms-ov'), 100, top, { width: '1720px', rowGap: gap + 'px' });
    const its = o.items.map((t, i) => {
      const it = K.el('div', 'it', `<span class="n">${i + 1}</span><span>${K.md(t)}</span>`);
      if (n > 6) { it.style.fontSize = '31px'; it.style.padding = '12px 24px 12px 16px'; }
      else { it.style.fontSize = '40px'; it.style.padding = '26px 30px 26px 24px'; }
      grid.appendChild(it);
      return it;
    });
    // column order: down the left column, then the right
    const order = [];
    for (let c = 0; c < 2; c++) for (let r = 0; r < rows; r++) { const i = c * rows + r; if (i < n) order.push(i); }
    its.forEach((it, i) => { it.style.gridColumn = String(Math.floor(i / rows) + 1); it.style.gridRow = String((i % rows) + 1); });
    const t1 = cue(1) + 0.1, step = Math.min(0.22, Math.max(0.12, (ctx.end(1) + 0.8 - t1) / n));
    order.forEach((i, k) => A.in(tl, its[i], t1 + k * step, 'fadeRight', { dur: 0.5 }));
    return { hd, ld, grid, its };
  }

  window.MS = { css, chips, tip, overview, mark };
})();
