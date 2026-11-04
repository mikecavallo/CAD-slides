// Shared parts for "Management: The Basics" (script/lesson-management.json). Scenes use them through window.MG.
// Built on the Markers and Mechanics kit (window.TM: head, pic, fx, row, word, order). CSS classes are prefixed .mg-.
//
//   MG.css(stage)                     inject the TM and MG styles
//   MG.fit(nat, maxW, maxH)           a picture's size shown whole inside maxW x maxH
//   MG.card(parent, o)                a labelled card: { x, y, w, h, variant: 'red' | 'green' | 'amber' | '', label, icon, title, body }
//   MG.callout(parent, html, o)       a line with a coloured bar at its left: { x, y, w, variant: 'red' | 'green', size }
//   MG.avoid(ctx, o)                  the green "How to avoid it" card: { x, y, w, text, t }
//   MG.mistake(ctx, o)                a common-mistake slide: heading at left, Tori's picture whole at right, a "Mistake N" chip
(() => {
  // Ask for every brand font weight as soon as the page is parsed, so they are loaded before the scene measures its
  // text (scenes are built before document.fonts.ready; a heading measured in a fallback font can wrap differently).
  const warm = () => {
    if (document.getElementById('mg-font-warm')) return;
    const w = document.createElement('div');
    w.id = 'mg-font-warm';
    w.setAttribute('aria-hidden', 'true');
    w.style.cssText = 'position:absolute;left:-9999px;top:0;opacity:0;pointer-events:none;white-space:nowrap';
    w.innerHTML = [['Rubik', [500, 600, 700, 800]], ['Montserrat', [400, 500, 600, 700, 800]]]
      .map(([f, ws]) => ws.map(wt => `<span style="font:${wt} 40px '${f}'">Aa</span><i style="font:italic ${wt} 40px '${f}'">Aa</i>`).join('')).join('');
    document.body.appendChild(w);
  };
  if (document.body) warm(); else document.addEventListener('DOMContentLoaded', warm);
})();

(() => {
  const CSS = `
  .mg-card { position: absolute; box-sizing: border-box; border-radius: 26px; background: #fff; border: 1px solid #e6e9e1; box-shadow: var(--shadow-soft);
    padding: 30px 34px; display: flex; flex-direction: column; gap: 14px; }
  .mg-card .lab { display: flex; align-items: center; gap: 12px; font: 700 26px/1 var(--font-body); letter-spacing: 3px; text-transform: uppercase; color: var(--green-dark); }
  .mg-card .lab svg { width: 30px; height: 30px; stroke-width: 2.4; }
  .mg-card .t { font: 700 40px/1.12 var(--font-head); color: var(--ink); }
  .mg-card .b { font: 500 30px/1.38 var(--font-body); color: var(--ink-soft); }
  .mg-card .b b { color: var(--green-dark); }
  .mg-card.green { background: var(--green-mist); border-color: #d9e8c6; }
  .mg-card.red { background: var(--red-pale); border-color: #f0cfc6; }
  .mg-card.red .lab { color: var(--red); }
  .mg-card.red .b b { color: var(--red); }
  .mg-card.amber { background: var(--amber-pale); border-color: #f1dcb5; }
  .mg-card.amber .lab { color: #8a5410; }
  .mg-call { position: absolute; box-sizing: border-box; padding: 22px 30px 22px 34px; border-radius: 0 20px 20px 0; background: #fff; border-left: 10px solid var(--green);
    box-shadow: var(--shadow-soft); font: 700 34px/1.3 var(--font-head); color: var(--ink); }
  .mg-call b { color: var(--green); }
  .mg-call.red { border-left-color: var(--red); background: #fff; }
  .mg-call.red b { color: var(--red); }
  .mg-lead { position: absolute; font: 600 40px/1.3 var(--font-head); color: var(--ink-soft); }
  .mg-lead b { color: var(--green); }
  .mg-chip { position: absolute; display: inline-flex; align-items: center; gap: 12px; padding: 12px 24px; border-radius: 999px; font: 700 28px/1 var(--font-body);
    letter-spacing: 2px; text-transform: uppercase; white-space: nowrap; }
  .mg-chip svg { width: 28px; height: 28px; stroke-width: 2.4; }
  .mg-chip.red { background: var(--red-pale); color: var(--red); }
  .mg-chip.green { background: var(--green-pale); color: var(--green-dark); }
  .mg-num { position: absolute; width: 58px; height: 58px; border-radius: 50%; background: var(--green); color: #fff; font: 700 30px/58px var(--font-head); text-align: center;
    box-shadow: 0 8px 18px rgba(63,107,34,0.3); }
  .mg-plab { position: absolute; font: 700 28px/1.2 var(--font-body); color: var(--ink); text-align: center; }
  `;
  const css = stage => {
    TM.style(stage);
    if (!stage.querySelector('style[data-mg]')) { const s = K.el('style', null, CSS); s.dataset.mg = '1'; stage.appendChild(s); }
  };
  const { put } = TM;

  const fit = ([nw, nh], maxW, maxH) => {
    const s = Math.min(maxW / nw, maxH / nh);
    return { w: Math.round(nw * s), h: Math.round(nh * s) };
  };

  function card(parent, o) {
    const c = put(parent, K.el('div', 'mg-card' + (o.variant ? ' ' + o.variant : '')), o.x, o.y, { width: o.w + 'px' });
    if (o.h) c.style.height = o.h + 'px';
    if (o.label) {
      const l = K.el('div', 'lab');
      if (o.icon) l.appendChild(K.icon(o.icon));
      l.appendChild(K.el('span', null, K.md(o.label)));
      c.appendChild(l);
    }
    if (o.title) c.appendChild(K.el('div', 't', K.md(o.title)));
    if (o.body) c.appendChild(K.el('div', 'b', K.md(o.body)));
    if (o.size) c.querySelectorAll('.b').forEach(b => { b.style.fontSize = o.size + 'px'; });
    return c;
  }

  function callout(parent, html, o = {}) {
    const c = put(parent, K.el('div', 'mg-call' + (o.variant ? ' ' + o.variant : ''), K.md(html)), o.x ?? 100, o.y ?? 820, { width: (o.w ?? 1720) + 'px' });
    if (o.size) c.style.fontSize = o.size + 'px';
    return c;
  }

  /** The "How to avoid it" card, revealed at o.t. */
  function avoid(ctx, o) {
    const c = card(ctx.stage, { x: o.x, y: o.y, w: o.w, variant: 'green', label: 'How to avoid it', icon: 'shield-check', body: o.text, size: o.size ?? 31 });
    ctx.tl.fromTo(c, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, o.t);
    return c;
  }

  /**
   * A common-mistake slide. o: { n, title, src, nat, maxW } -> { hd, ph, X, W, top, bottom }.
   * The picture sits whole at the right (top 300, at most 640 tall); the heading and content share the left.
   */
  function mistake(ctx, o) {
    const { stage, tl } = ctx;
    css(stage);
    const { w, h } = fit(o.nat, o.maxW ?? 520, o.maxH ?? 640);
    const px = 1820 - w, py = 300 + Math.round(((o.maxH ?? 640) - h) / 2);
    const W = px - 100 - 80;
    const hd = TM.head(ctx, 'Common mistakes', o.title, { w: W });
    const ph = TM.pic(stage, o.src, { x: px, y: py, w, h, nat: o.nat, radius: 22 });
    tl.fromTo(ph.wrap, { opacity: 0, y: 40, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out' }, 0.35);
    const top = hd.h.root.offsetTop + hd.h.root.offsetHeight + 34;
    const chip = put(stage, K.el('div', 'mg-chip red', `<span>Mistake ${o.n}</span>`), 100, top);
    A.in(tl, chip, 0.5, 'fadeRight', { dur: 0.6 });
    return { hd, ph, chip, X: 100, W, top: top + 84, px, py, w, h };
  }

  window.MG = { css, fit, card, callout, avoid, mistake };
})();
