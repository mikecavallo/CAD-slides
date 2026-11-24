// Shared parts for "Management: Solutions and Setups" (script/lesson-management2.json). Scenes use them through window.MS.
// Built on the Management: The Basics kit (window.MG) and Markers and Mechanics (window.TM). CSS classes are prefixed .ms-.
//
//   MS.css(stage)                inject the TM, MG and MS styles
//   MS.chips(stage, x, y, items, o)  a wrapping row of word chips: items [text, variant, icon, cross] or '>' for an arrow
//   MS.tip(ctx, o)               one setup slide: heading, section chip, Tori's picture whole at right with marks, lead, chips,
//                                and the green "Why it works" card on the bottom of the content area
//   MS.recap(ctx, o)             the recap closing a part: the numbered setups as they are named, then the summary banner
//   MS.mark(ctx, ph, m, t)       the picture marks of a tip: rings, dotted lines and one tag (fractions of the picture)
(() => {
  const CSS = `
  .ms-lead { position: absolute; font: 600 40px/1.34 var(--font-body); color: var(--ink-soft); }
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
    (m.tag ? [m.tag] : []).concat(m.tags || []).forEach(([text, wx, wy, variant], i) => {
      const tg = TM.fx.tag(tl, ph.wrap, text, 0, 0, t + 0.45 + 0.4 * i, variant || 'green');
      tg.style.fontSize = '26px';
      // keep the tag inside the picture: wx, wy are fractions of the picture box (right or bottom aligned past 0.5)
      const tw = tg.offsetWidth, th = tg.offsetHeight;
      tg.style.left = Math.round(wx > 0.5 ? w * wx - tw : w * wx) + 'px';
      tg.style.top = Math.round(wy > 0.5 ? h * wy - th : h * wy) + 'px';
    });
  }

  /**
   * One setup. o: { sec, icon, n, title, src, nat, lead, leadRed, leadAt: [beat, phrase], chips: [[text, variant, icon, cross, phrase]],
   * chipsFirst, why, mark: { ..., beat, phrase } }.
   */
  function tip(ctx, o) {
    const { stage, tl, cue } = ctx;
    css(stage);
    const whyBeat = o.whyBeat ?? 2;
    // the picture area at right; a second picture (o.pic2) can replace the first on its beat
    const box = nat => {
      const land = nat[0] > nat[1];
      return MG.fit(nat, o.maxW ?? (land ? 760 : 580), o.maxH ?? (land ? 560 : 680));
    };
    const f1 = box(o.nat), f2 = o.pic2 ? box(o.pic2.nat) : { w: 0, h: 0 };
    const PW = Math.max(f1.w, f2.w);
    const X = 100, W = 1820 - PW - 80 - X;
    const hd = TM.head(ctx, 'Setup', o.title);
    // the content area under the heading; the column and the picture are both centred in it
    const top = hd.h.root.offsetTop + hd.h.root.offsetHeight + 44, bottom = 952, AH = bottom - top;
    const place = (src, nat, f) => {
      let { w, h } = f;
      if (h > AH) { w = Math.round(w * AH / h); h = AH; }
      return TM.pic(stage, src, { x: 1820 - w, y: Math.round(top + (AH - h) / 2), w, h, nat, radius: 22 });
    };
    const ph = place(o.src, o.nat, f1);
    tl.fromTo(ph.wrap, { opacity: 0, y: 40, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out' }, 0.35);
    // the column: section chip, lead, chips, Why it works, stacked with even gaps
    const col = [];
    const sec = put(stage, K.el('div', 'mg-chip green ms-sec', `${K.icon(o.icon).outerHTML}<span>${o.sec} · ${String(o.n).padStart(2, '0')}</span>`), X, 0);
    A.in(tl, sec, 0.5, 'fadeRight', { dur: 0.6 });
    col.push([sec, 30]);
    const t1 = cue(1) + 0.05;
    const parts = [];
    const addLead = () => {
      if (!o.lead) return;
      const ld = put(stage, K.el('div', 'ms-lead' + (o.leadRed ? ' red' : ''), K.md(o.lead)), X, 0, { width: W + 'px' });
      const t = o.leadAt ? at(ctx, o.leadAt[0], o.leadAt[1], 0.5) : t1;
      A.in(tl, ld, t, 'fadeUp', { dur: 0.6 });
      col.push([ld, 30]);
      parts.push(ld);
    };
    const addChips = () => {
      if (!o.chips || !o.chips.length) return;
      const items = o.chips.map(c => (c === '>' ? '>' : [c[0], c[1], c[2], c[3]]));
      const r = chips(stage, X, 0, items, { w: W, size: o.chipSize ?? 32 });
      let k = 0;
      r.els.forEach((e, i) => {
        const c = o.chips[i];
        if (c === '>') { A.in(tl, e, t1 + 0.4 + 0.3 * i, 'fade', { dur: 0.4 }); return; }
        const t = c[4] ? at(ctx, c[5] ?? 1, c[4], 0.25 + 0.2 * k) : t1 + 0.4 + 0.35 * k;
        A.in(tl, e, t, 'pop', { dur: 0.4 });
        if (c[3]) TM.strike(tl, e, t + 0.35);
        k++;
      });
      col.push([r.row, 44]);
      parts.push(r.row);
    };
    if (o.chipsFirst) { addChips(); addLead(); } else { addLead(); addChips(); }
    const why = MG.card(stage, { x: X, y: 0, w: W, variant: 'green', label: 'Why it works', icon: 'lightbulb', body: o.why, size: 34 });
    tl.fromTo(why, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, cue(whyBeat) + 0.05);
    col.push([why, 0]);
    // stack and centre the column in the content area
    const total = col.reduce((s, [n, g], i) => s + n.offsetHeight + (i < col.length - 1 ? g : 0), 0);
    let y = Math.max(top, Math.round(top + (AH - total) / 2));
    col.forEach(([n, g]) => { n.style.top = y + 'px'; y += n.offsetHeight + g; });
    if (o.mark) {
      const mk = o.mark;
      const t = mk.phrase ? at(ctx, mk.beat ?? 1, mk.phrase, 0.4) : cue(mk.beat ?? 1) + 0.6;
      mark(ctx, ph, ph.w, ph.h, mk, t);
    }
    // the second picture: the first steps aside, the second takes its place, with its own marks
    let ph2 = null;
    if (o.pic2) {
      const p2 = o.pic2;
      ph2 = place(p2.src, p2.nat, f2);
      const t2 = p2.phrase ? at(ctx, p2.beat, p2.phrase, 0.1) : cue(p2.beat) + 0.1;
      tl.to(ph.wrap, { opacity: 0, x: -40, duration: 0.6, ease: 'power2.in' }, t2);
      tl.fromTo(ph2.wrap, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out', immediateRender: true }, t2 + 0.35);
      if (p2.mark) mark(ctx, ph2, ph2.w, ph2.h, p2.mark, p2.mark.phrase ? at(ctx, p2.beat, p2.mark.phrase, 0.5) : t2 + 1.0);
    }
    return { hd, ph, ph2, sec, why, parts, X, W };
  }

  /**
   * Recap at the end of a part. o: { title, items, summary, phrases } -> the numbered setups land as they are named
   * ("First, ..."), then the deck's summary line closes the slide as a green banner.
   */
  function recap(ctx, o) {
    const { stage, tl, cue } = ctx;
    css(stage);
    const hd = TM.head(ctx, 'Recap', 'Recap: ' + o.title);
    const n = o.items.length, rows = Math.ceil(n / 2), big = n <= 6;
    const top = hd.h.root.offsetTop + hd.h.root.offsetHeight + 50;
    const grid = put(stage, K.el('div', 'ms-ov'), 100, top, { width: '1720px', rowGap: (big ? 26 : 14) + 'px' });
    const its = o.items.map((t, i) => {
      const it = K.el('div', 'it', `<span class="n">${i + 1}</span><span>${K.md(t)}</span>`);
      if (big) { it.style.fontSize = '40px'; it.style.padding = '24px 30px 24px 24px'; }
      else { it.style.fontSize = '32px'; it.style.padding = '11px 24px 11px 16px'; }
      it.style.gridColumn = String(Math.floor(i / rows) + 1);
      it.style.gridRow = String((i % rows) + 1);
      grid.appendChild(it);
      return it;
    });
    // each setup lands as it is named: the ordinal word starts it
    const ORD = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth'];
    let lo = cue(1) + 0.1;
    its.forEach((it, i) => {
      const t = Math.max(lo, at(ctx, 1, (o.phrases || ORD)[i], (i + 1) / (n + 1)));
      A.in(tl, it, t, 'fadeRight', { dur: 0.5 });
      lo = t + 0.15;
    });
    // the summary line, as a banner under the list
    const bn = put(stage, K.el('div', 'tm-banner', `${K.icon('circle-check').outerHTML}<span>${K.md(o.summary)}</span>`), 100, 0, { width: '1720px', boxSizing: 'border-box' });
    // centre the list and the banner together in the area under the heading
    const G = big ? 56 : 36, block = grid.offsetHeight + G + bn.offsetHeight, y0 = Math.max(top - 20, Math.round(top + (950 - top - block) / 2));
    grid.style.top = y0 + 'px';
    bn.style.top = (y0 + grid.offsetHeight + G) + 'px';
    tl.fromTo(bn, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, cue(2) + 0.05);
    return { hd, grid, its, bn };
  }

  window.MS = { css, chips, tip, recap, mark };
})();
