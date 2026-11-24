// Shared parts for "Management: Everyday Manners" (script/lesson-everyday.json). Scenes use them through window.EM.
// Built on the Management: The Basics kit (window.MG) and the Markers and Mechanics kit (window.TM). CSS classes are prefixed .em-.
//
//   EM.css(stage)                      inject the TM, MG and EM styles
//   EM.picOrHold(ctx, o)               Tori's picture shown whole ({src, nat}), or a labelled placeholder frame while it's missing ({hold})
//   EM.situation(ctx, o)               an everyday-situation slide: heading at left, picture at right, m.col for the content column
//   EM.section(col, variant, label, icon)  a labelled block in the column: 'red' (what they practice) or 'green' (manage it, teach instead)
//   EM.chips(parent, items, size)      a wrapping row of word chips ([text, variant, icon]); returns the chips
(() => {
  const CSS = `
  .em-hold { position: absolute; box-sizing: border-box; border-radius: 22px; border: 4px dashed #c9dcb4; background: var(--green-mist);
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 18px; text-align: center; padding: 30px; }
  .em-hold svg { width: 84px; height: 84px; color: #a9c98a; stroke-width: 1.8; }
  .em-hold .k { font: 700 24px/1 var(--font-body); letter-spacing: 4px; text-transform: uppercase; color: #8fb86a; }
  .em-hold .t { font: 700 34px/1.2 var(--font-head); color: var(--green-dark); }
  .em-sec { position: relative; display: flex; flex-direction: column; gap: 14px; width: 100%; }
  .em-sec .lab { display: inline-flex; align-self: flex-start; align-items: center; gap: 10px; padding: 9px 20px; border-radius: 999px;
    font: 700 24px/1 var(--font-body); letter-spacing: 3px; text-transform: uppercase; white-space: nowrap; }
  .em-sec .lab svg { width: 26px; height: 26px; stroke-width: 2.4; }
  .em-sec.red .lab { background: var(--red-pale); color: var(--red); }
  .em-sec.green .lab { background: var(--green-pale); color: var(--green-dark); }
  .em-sec .txt { font: 600 34px/1.32 var(--font-body); color: var(--ink); }
  .em-sec.red .txt b { color: var(--red); }
  .em-sec.green .txt b { color: var(--green-dark); }
  .em-chips { position: relative; display: flex; flex-wrap: wrap; gap: 14px; }
  .em-chips .tm-word { position: relative; left: auto; top: auto; }
  `;
  const css = stage => {
    MG.css(stage);
    if (!stage.querySelector('style[data-em]')) { const s = K.el('style', null, CSS); s.dataset.em = '1'; stage.appendChild(s); }
  };
  const { put } = TM;

  /** Tori's picture whole inside maxW x maxH at (x, y) (right-aligned to x + maxW when o.right), or a placeholder frame. */
  function picOrHold(ctx, o) {
    const { stage, tl } = ctx;
    let r;
    if (o.src) {
      const { w, h } = MG.fit(o.nat, o.maxW, o.maxH);
      const x = o.right ? o.x + o.maxW - w : o.x, y = o.y + Math.round((o.maxH - h) / 2);
      const ph = TM.pic(stage, o.src, { x, y, w, h, nat: o.nat, radius: 22 });
      r = { ...ph, x, y, w, h };
    } else {
      const w = o.holdW ?? Math.min(o.maxW, 560), h = o.holdH ?? Math.min(o.maxH, 600);
      const x = o.right ? o.x + o.maxW - w : o.x, y = o.y + Math.round((o.maxH - h) / 2);
      const wrap = put(stage, K.el('div', 'em-hold'), x, y, { width: w + 'px', height: h + 'px' });
      wrap.innerHTML = `${K.icon('image').outerHTML}<div class="k">Picture coming</div><div class="t">${o.hold}</div>`;
      r = { wrap, x, y, w, h, hold: true };
    }
    tl.fromTo(r.wrap, { opacity: 0, y: 40, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out' }, o.t ?? 0.35);
    return r;
  }

  /** An everyday-situation slide: heading and content column at left, the picture at right. */
  function situation(ctx, o) {
    const { stage } = ctx;
    css(stage);
    const ph = picOrHold(ctx, { src: o.src, nat: o.nat, hold: o.hold, x: 1820 - (o.maxW ?? 640), y: 300, maxW: o.maxW ?? 640, maxH: o.maxH ?? 600, right: true });
    const W = ph.x - 100 - 70;
    const hd = TM.head(ctx, 'Everyday situations', o.title, { w: W, size: o.hsize ?? 62 });
    const top = hd.h.root.offsetTop + hd.h.root.offsetHeight + 40;
    const col = put(stage, K.el('div'), 100, top, { position: 'absolute', width: W + 'px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: (o.gap ?? 44) + 'px' });
    return { hd, ph, col, X: 100, W, top };
  }

  function section(col, variant, label, icon) {
    const s = K.el('div', 'em-sec ' + variant);
    const l = K.el('div', 'lab');
    l.appendChild(K.icon(icon));
    l.appendChild(K.el('span', null, label));
    s.appendChild(l);
    col.appendChild(s);
    return s;
  }
  const text = (parent, html, size) => { const n = K.el('div', 'txt', K.md(html)); if (size) n.style.fontSize = size + 'px'; parent.appendChild(n); return n; };

  function chips(parent, items, size = 28) {
    const row = K.el('div', 'em-chips');
    parent.appendChild(row);
    return items.map(([t, v, ic]) => { const n = TM.word(row, t, { variant: v, icon: ic, size }); n.style.position = 'relative'; n.style.left = n.style.top = ''; return n; });
  }

  window.EM = { css, picOrHold, situation, section, text, chips };
})();
