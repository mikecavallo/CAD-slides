/*
 * Scene framework for the Calling All Dogs explainer video.
 *
 * Every scene is a function registered with registerScene(id, build). The renderer loads
 * index.html?scene=<id>, the framework builds the persistent chrome (background swirl, logo,
 * footer with chapter tab), creates an empty scene layer and a paused GSAP timeline, then calls
 * build(ctx). The scene adds DOM to ctx.stage and tweens to ctx.tl at narration cue times.
 * The renderer then seeks the timeline frame by frame, so ONLY GSAP tweens on ctx.tl may animate
 * (no CSS transitions/animations, no setTimeout, no Date).
 *
 * Timing comes from build/timing.js (window.TIMING). Beat i of the scene starts at ctx.cue(i)
 * seconds (scene-relative). Narration length varies (scratch voice vs the trainer's real voice),
 * so always position tweens relative to cues or ctx.dur, never absolute seconds.
 */
(function () {
  const W = 1920, H = 1080;
  const SCENES = {};
  window.registerScene = (id, build) => { SCENES[id] = build; };
  window.SCENES = SCENES;

  if (window.gsap) {
    const plugins = ['DrawSVGPlugin', 'SplitText', 'MotionPathPlugin', 'MorphSVGPlugin', 'CustomEase'];
    plugins.forEach(p => { if (window[p]) gsap.registerPlugin(window[p]); });
    gsap.defaults({ ease: 'power3.out', duration: 0.7 });
  }

  // ---------------------------------------------------------------- DOM helpers
  function el(tag, cls, html, style) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    if (style) Object.assign(n.style, style);
    return n;
  }
  const px = v => (typeof v === 'number' ? v + 'px' : v);
  function place(n, o = {}) {
    ['left', 'top', 'right', 'bottom', 'width', 'height'].forEach(k => {
      const short = { left: 'x', top: 'y', width: 'w', height: 'h' }[k];
      const v = o[short] ?? o[k];
      if (v != null) n.style[k] = px(v);
    });
    if (o.z != null) n.style.zIndex = o.z;
    return n;
  }
  const SVGNS = 'http://www.w3.org/2000/svg';
  function svgEl(tag, attrs = {}, parent) {
    const n = document.createElementNS(SVGNS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  // tiny markup: *green bold*  _underlined_  **dark bold**  !!red bold!!
  function md(s) {
    return String(s)
      .replace(/\*\*(.+?)\*\*/g, '<b class="em-dark">$1</b>')
      .replace(/\*(.+?)\*/g, '<b class="em-green">$1</b>')
      .replace(/!!(.+?)!!/g, '<b class="em-red">$1</b>')
      .replace(/_(.+?)_/g, '<span class="u-green">$1</span>');
  }

  // ---------------------------------------------------------------- kit (components)
  const K = {};
  K.el = el; K.place = place; K.md = md; K.svgEl = svgEl;

  /** Append n to parent. Inside a K.flow() container, children stack in normal flow (x/y ignored). */
  function add(parent, n) {
    if (parent.classList && parent.classList.contains('flow')) {
      n.style.position = 'relative';
      ['left', 'top', 'right', 'bottom'].forEach(k => (n.style[k] = ''));
    }
    parent.appendChild(n);
    return n;
  }

  /**
   * Vertical flow container: components added into it stack top to bottom with `gap` px spacing,
   * so wrapped headings never collide with the text under them. o: {x, y, w, gap, align:'start'|'center'}
   */
  K.flow = (parent, o = {}) => {
    const f = place(el('div', 'flow'), { x: o.x ?? 100, y: o.y ?? 150, w: o.w ?? 900, h: o.h });
    Object.assign(f.style, { position: 'absolute', display: 'flex', flexDirection: 'column', gap: px(o.gap ?? 34), alignItems: o.align === 'center' ? 'center' : 'flex-start', textAlign: o.align === 'center' ? 'center' : '' });
    if (o.valign === 'center' && o.h) f.style.justifyContent = 'center';
    add(parent, f);
    return f;
  };

  /** Lucide icon as inline <svg>. name: lucide id e.g. 'heart', 'brain', 'triangle-alert'. */
  K.icon = (name, o = {}) => {
    const inner = (window.ICONS || {})[name];
    if (!inner) console.warn('missing icon', name);
    const s = document.createElementNS(SVGNS, 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('fill', 'none');
    s.setAttribute('stroke', o.color || 'currentColor');
    s.setAttribute('stroke-width', o.stroke || 2);
    s.setAttribute('stroke-linecap', 'round');
    s.setAttribute('stroke-linejoin', 'round');
    s.innerHTML = inner || '<circle cx="12" cy="12" r="9"/>';
    if (o.size) { s.style.width = px(o.size); s.style.height = px(o.size); }
    if (o.cls) s.setAttribute('class', o.cls);
    return s;
  };

  /** Green Rubik title with the light-green accent bar under it (deck style). Returns {root, title, bar, all}. */
  K.heading = (parent, text, o = {}) => {
    const root = place(el('div', 'heading-wrap'), { x: o.x ?? 100, y: o.y ?? 120, w: o.w ?? 1500 });
    root.style.position = 'absolute';
    const t = el('div', 'h-title' + (o.cls ? ' ' + o.cls : ''), md(text));
    t.style.position = 'relative';
    if (o.size) t.style.fontSize = px(o.size);
    if (o.color) t.style.color = o.color;
    if (o.align) t.style.textAlign = o.align;
    root.appendChild(t);
    let bar = null;
    if (o.bar !== false) {
      bar = el('div', 'accent-bar');
      Object.assign(bar.style, { position: 'relative', marginTop: px(o.barGap ?? 30) });
      if (o.align === 'center') bar.style.margin = `${px(o.barGap ?? 30)} auto 0`;
      root.appendChild(bar);
    }
    add(parent, root);
    return { root, title: t, bar, all: bar ? [t, bar] : [t] };
  };

  K.kicker = (parent, text, o = {}) => {
    const n = place(el('div', 'kicker', md(text)), { x: o.x ?? 100, y: o.y ?? 100, w: o.w });
    if (o.color) n.style.color = o.color;
    if (o.size) n.style.fontSize = px(o.size);
    add(parent, n);
    return n;
  };

  /** Positioned text block. cls: 'lead' (38px), 'body' (32px), 'label', 'quote', 'note'. */
  K.text = (parent, html, o = {}) => {
    const n = place(el('div', o.cls || 'body', md(html)), { x: o.x ?? 100, y: o.y ?? 300, w: o.w, h: o.h });
    if (o.size) n.style.fontSize = px(o.size);
    if (o.weight) n.style.fontWeight = o.weight;
    if (o.color) n.style.color = o.color;
    if (o.align) n.style.textAlign = o.align;
    if (o.lh) n.style.lineHeight = o.lh;
    if (o.font) n.style.fontFamily = o.font;
    if (o.style) Object.assign(n.style, o.style);
    add(parent, n);
    return n;
  };

  /**
   * Bullet list. items: strings (markup ok) or {html, icon, strong}.
   * icon: 'check' (green circle check, deck style), 'x' (red), 'dot' (green diamond), 'num', or a lucide name.
   * Returns array of row elements (animate each at its own cue).
   */
  K.bullets = (parent, items, o = {}) => {
    const box = place(el('div', 'bullets'), { x: o.x ?? 100, y: o.y ?? 320, w: o.w ?? 1000 });
    if (o.gap != null) box.style.gap = px(o.gap);
    add(parent, box);
    return items.map((it, i) => {
      if (typeof it === 'string') it = { html: it };
      const kind = it.icon || o.icon || 'check';
      const row = el('div', 'bullet' + (it.strong ? ' strong' : ''));
      if (o.size) row.style.fontSize = px(o.size);
      const ico = el('div', 'ico');
      if (kind === 'check') ico.appendChild(K.icon('check'));
      else if (kind === 'x') { ico.classList.add('x'); ico.appendChild(K.icon('x')); }
      else if (kind === 'dot') ico.classList.add('dot');
      else if (kind === 'num') { ico.classList.add('num'); ico.textContent = String(i + 1); }
      else ico.appendChild(K.icon(kind));
      row.appendChild(ico);
      row.appendChild(el('div', 'txt', md(it.html)));
      box.appendChild(row);
      return row;
    });
  };

  /** Framed photo. Returns {root, img}. Use A.kenburns(tl, p.img, ...) for slow motion. */
  K.photo = (parent, src, o = {}) => {
    const root = place(el('div', 'photo' + (o.bleed ? ' bleed' : '')), { x: o.x ?? 0, y: o.y ?? 0, w: o.w ?? 800, h: o.h ?? 1080 });
    if (o.radius != null) root.style.borderRadius = px(o.radius);
    const img = el('img');
    img.src = '../assets/img/' + src;
    if (o.pos) img.style.objectPosition = o.pos;
    root.appendChild(img);
    if (o.tag) root.appendChild(el('div', 'tag', md(o.tag)));
    add(parent, root);
    return { root, img };
  };

  /** White card. o: {x,y,w,h, icon, num, title, body, pill, variant:'green'|'red'} */
  K.card = (parent, o = {}) => {
    const c = place(el('div', 'card' + (o.variant ? ' ' + o.variant : '')), { x: o.x, y: o.y, w: o.w ?? 480, h: o.h });
    if (o.icon) { const b = el('div', 'card-ico'); b.appendChild(K.icon(o.icon)); c.appendChild(b); }
    if (o.num != null) c.appendChild(el('div', 'card-num', String(o.num)));
    if (o.title) c.appendChild(el('div', 'card-title', md(o.title)));
    if (o.body) c.appendChild(el('div', 'card-body', md(o.body)));
    if (o.pill) c.appendChild(el('div', 'card-pill', o.pill));
    if (o.pad != null) c.style.padding = px(o.pad);
    add(parent, c);
    return c;
  };

  /** Pill chip with optional icon. variant: 'green' | 'red' | 'pale' */
  K.chip = (parent, text, o = {}) => {
    const c = place(el('div', 'chip' + (o.variant ? ' ' + o.variant : '')), { x: o.x, y: o.y });
    if (o.icon) c.appendChild(K.icon(o.icon));
    c.appendChild(el('span', null, md(text)));
    if (o.size) c.style.fontSize = px(o.size);
    add(parent, c);
    return c;
  };

  /** Round icon badge. variant: '' | 'solid' | 'red' | 'amber' */
  K.iconBadge = (parent, name, o = {}) => {
    const s = o.size ?? 120;
    const b = place(el('div', 'icon-badge' + (o.variant ? ' ' + o.variant : '')), { x: o.x, y: o.y, w: s, h: s });
    b.appendChild(K.icon(name, { stroke: o.stroke }));
    add(parent, b);
    return b;
  };

  /**
   * Big uppercase statement (deck slide 4 style). lines: array of strings with markup:
   * *word* green, _word_ underlined with light-green bar. Returns {root, lines}.
   */
  K.statement = (parent, lines, o = {}) => {
    const root = place(el('div', 'statement'), { x: o.x ?? 780, y: o.y ?? 300, w: o.w ?? 1040 });
    if (o.size) root.style.fontSize = px(o.size);
    if (o.align) root.style.textAlign = o.align;
    const ls = lines.map(s => {
      const html = String(s).replace(/\*(.+?)\*/g, '<span class="g">$1</span>').replace(/_(.+?)_/g, '<span class="ul">$1</span>');
      const l = el('span', 'line', html);
      root.appendChild(l);
      return l;
    });
    if (o.gap) ls.forEach(l => (l.style.marginBottom = px(o.gap)));
    add(parent, root);
    return { root, lines: ls };
  };

  /**
   * ABC strip in the deck's illustrated style.
   * o: {x, y, w (total width, default 1640), panels:[a,b,c] (asset names), captions:[...], label, labelVariant:'red'|'green'|'',
   *     words (default Antecedent/Behavior/Consequence), panelH (default auto 16:9.4), capH}
   * Returns {label, cols:[{root, head, panel, img, cap}], arrows:[el, el]}.
   */
  K.abc = (parent, o = {}) => {
    const x = o.x ?? 140, y = o.y ?? 170, w = o.w ?? 1640;
    const gap = o.gap ?? 70;
    const colW = (w - 2 * gap) / 3;
    const panelH = o.panelH ?? Math.round(colW * 0.575);
    const words = o.words || ['Antecedent', 'Behavior', 'Consequence'];
    const letters = ['A', 'B', 'C'];
    let label = null;
    const top = o.label ? y + 86 : y;
    if (o.label) {
      label = place(el('div', 'abc-label' + (o.labelVariant ? ' ' + o.labelVariant : ''), md(o.label)), { x, y });
      add(parent, label);
    }
    const cols = [0, 1, 2].map(i => {
      const root = place(el('div', 'abc-col'), { x: x + i * (colW + gap), y: top, w: colW });
      const head = el('div', 'abc-head');
      head.appendChild(el('div', 'letter', letters[i]));
      head.appendChild(el('div', 'word', words[i]));
      root.appendChild(head);
      const panel = el('div', 'panel');
      panel.style.height = px(panelH);
      const img = el('img');
      if (o.panels && o.panels[i]) img.src = '../assets/img/' + o.panels[i];
      panel.appendChild(img);
      root.appendChild(panel);
      let cap = null;
      if (o.captions && o.captions[i] != null) {
        cap = el('div', 'cap', md(o.captions[i]));
        if (o.capH) cap.style.minHeight = px(o.capH);
        root.appendChild(cap);
      }
      add(parent, root);
      return { root, head, panel, img, cap };
    });
    const arrowY = top + 118 + panelH / 2 - 23;
    const arrows = [0, 1].map(i => {
      const a = place(el('div', 'abc-arrow'), { x: x + (i + 1) * colW + i * gap + gap / 2 - 23, y: arrowY });
      a.innerHTML = '<svg viewBox="0 0 24 24"><path d="M3 8h9V3l9 9-9 9v-5H3z" fill="currentColor"/></svg>';
      add(parent, a);
      return a;
    });
    return { label, cols, arrows, colW, panelH, top };
  };

  /** Check / cross list (grid). items: [{t:'Calm', yes:true}, {t:'Surprised', yes:false}]. cols default 2. */
  K.cx = (parent, items, o = {}) => {
    const box = place(el('div', 'cx'), { x: o.x, y: o.y, w: o.w });
    box.style.gridTemplateColumns = `repeat(${o.cols ?? 2}, auto)`;
    if (o.size) box.style.fontSize = px(o.size);
    const rows = items.map(it => {
      const r = el('div', 'it ' + (it.yes ? 'yes' : 'no'));
      r.appendChild(K.icon(it.yes ? 'check' : 'x', { stroke: 3 }));
      r.appendChild(el('span', null, md(it.t)));
      box.appendChild(r);
      return r;
    });
    add(parent, box);
    return { root: box, items: rows };
  };

  /**
   * Escalation ladder (the "ladder of communication"): rungs listed BOTTOM to TOP, colored on a
   * calm-green to amber to red ramp. items: strings or {t, icon}. o: {x, y, w, rungH, gap, rails, size}
   * Returns {root, rungs (bottom to top), rails}. Reveal rungs one by one with A.in(tl, rung, t, 'fadeUp').
   */
  K.ladder = (parent, items, o = {}) => {
    const w = o.w ?? 640, rh = o.rungH ?? 74, gap = o.gap ?? 16, n = items.length;
    const h = n * rh + (n - 1) * gap;
    const root = place(el('div', 'ladder'), { x: o.x ?? 100, y: o.y ?? 150, w: w + 60, h: h + 40 });
    root.style.position = 'absolute';
    const ramp = ['#7fb24a', '#9dbb3f', '#c2b235', '#d9912b', '#cf6a2c', '#c4512d', '#b8452d', '#a33a26'];
    const color = i => ramp[Math.round((i / Math.max(1, n - 1)) * (ramp.length - 1))];
    const rails = [0, 1].map(k => {
      const r = el('div', 'ladder-rail');
      Object.assign(r.style, { position: 'absolute', top: '-20px', bottom: '-20px', width: '12px', borderRadius: '6px', background: '#cfd6c5', left: k ? `${w + 18}px` : '18px' });
      root.appendChild(r);
      return r;
    });
    const rungs = items.map((it, i) => {
      if (typeof it === 'string') it = { t: it };
      const r = el('div', 'ladder-rung');
      Object.assign(r.style, {
        position: 'absolute', left: '40px', width: `${w - 22}px`, height: `${rh}px`, top: `${h - (i + 1) * rh - i * gap}px`,
        borderRadius: '18px', background: color(i), color: '#fff', display: 'flex', alignItems: 'center', gap: '18px',
        padding: '0 26px', font: `700 ${o.size ?? 30}px/1.1 Montserrat, sans-serif`, boxShadow: '0 6px 16px rgba(40,60,20,0.14)',
      });
      if (it.icon) { const ic = K.icon(it.icon, { size: 36, stroke: 2.4 }); r.appendChild(ic); }
      r.appendChild(el('span', null, md(it.t)));
      root.appendChild(r);
      return r;
    });
    add(parent, root);
    return { root, rungs, rails, color };
  };

  /** Absolutely-positioned SVG canvas for custom diagrams/charts. Returns the <svg>. */
  K.svg = (parent, o = {}) => {
    const w = o.w ?? W, h = o.h ?? H;
    const s = svgEl('svg', { viewBox: o.viewBox || `0 0 ${w} ${h}`, width: w, height: h, class: 'svgfill' });
    s.style.left = px(o.x ?? 0); s.style.top = px(o.y ?? 0);
    add(parent, s);
    return s;
  };
  K.path = (svg, d, a = {}) => svgEl('path', Object.assign({ d, fill: 'none', stroke: '#619537', 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, a), svg);
  K.line = (svg, x1, y1, x2, y2, a = {}) => svgEl('line', Object.assign({ x1, y1, x2, y2, stroke: '#619537', 'stroke-width': 4, 'stroke-linecap': 'round' }, a), svg);
  K.rect = (svg, x, y, w, h, a = {}) => svgEl('rect', Object.assign({ x, y, width: w, height: h, rx: 0, fill: '#619537' }, a), svg);
  K.circle = (svg, cx, cy, r, a = {}) => svgEl('circle', Object.assign({ cx, cy, r, fill: '#619537' }, a), svg);
  K.svgText = (svg, x, y, text, a = {}) => {
    const t = svgEl('text', Object.assign({ x, y, fill: '#212121', 'font-family': 'Montserrat', 'font-size': 26, 'font-weight': 600 }, a), svg);
    t.textContent = text;
    return t;
  };
  K.group = (svg, a = {}) => svgEl('g', a, svg);

  // ---------------------------------------------------------------- animation helpers
  // All helpers place tweens on the scene timeline `tl` at scene time `t` (seconds).
  const A = {};
  const PRESETS = {
    fadeUp: { from: { opacity: 0, y: 40 }, to: { opacity: 1, y: 0 } },
    fadeDown: { from: { opacity: 0, y: -40 }, to: { opacity: 1, y: 0 } },
    fadeLeft: { from: { opacity: 0, x: 60 }, to: { opacity: 1, x: 0 } },   // slides in from the right, moving left
    fadeRight: { from: { opacity: 0, x: -60 }, to: { opacity: 1, x: 0 } }, // slides in from the left, moving right
    fade: { from: { opacity: 0 }, to: { opacity: 1 } },
    pop: { from: { opacity: 0, scale: 0.6 }, to: { opacity: 1, scale: 1, ease: 'back.out(1.8)' } },
    scale: { from: { opacity: 0, scale: 1.08 }, to: { opacity: 1, scale: 1 } },
    blur: { from: { opacity: 0, filter: 'blur(14px)' }, to: { opacity: 1, filter: 'blur(0px)' } },
    wipe: { from: { clipPath: 'inset(0% 100% 0% 0%)' }, to: { clipPath: 'inset(0% 0% 0% 0%)', ease: 'power2.inOut' } },
    wipeDown: { from: { clipPath: 'inset(0% 0% 100% 0%)' }, to: { clipPath: 'inset(0% 0% 0% 0%)', ease: 'power2.inOut' } },
    grow: { from: { scaleX: 0, transformOrigin: '0% 50%' }, to: { scaleX: 1, ease: 'power2.inOut' } },
  };
  /** Reveal targets at time t. type: fadeUp|fadeDown|fadeLeft|fadeRight|fade|pop|scale|blur|wipe|wipeDown|grow. opts: {dur, stagger, ease, delay} */
  A.in = (tl, targets, t, type = 'fadeUp', o = {}) => {
    const p = PRESETS[type] || PRESETS.fadeUp;
    const to = Object.assign({}, p.to, { duration: o.dur ?? 0.8, stagger: o.stagger ?? 0 });
    if (o.ease) to.ease = o.ease;
    tl.fromTo(targets, Object.assign({}, p.from), to, t + (o.delay || 0));
    return tl;
  };
  /** Hide targets at time t. type: fade|fadeUp|fadeDown|shrink */
  A.out = (tl, targets, t, type = 'fade', o = {}) => {
    const map = { fade: { opacity: 0 }, fadeUp: { opacity: 0, y: -30 }, fadeDown: { opacity: 0, y: 30 }, shrink: { opacity: 0, scale: 0.8 } };
    tl.to(targets, Object.assign({ duration: o.dur ?? 0.5, ease: 'power2.in', stagger: o.stagger ?? 0 }, map[type] || map.fade), t);
    return tl;
  };
  /** Draw SVG strokes (DrawSVG) from 0 to 100% starting at t. */
  A.draw = (tl, targets, t, dur = 1.2, o = {}) => {
    tl.fromTo(targets, { drawSVG: o.from || '0%' }, { drawSVG: o.to || '100%', duration: dur, ease: o.ease || 'power2.inOut', stagger: o.stagger ?? 0 }, t);
    return tl;
  };
  /** Quick attention pulse (scale up and back). */
  A.pulse = (tl, targets, t, o = {}) => {
    tl.to(targets, { scale: o.scale ?? 1.08, duration: 0.25, ease: 'power2.out', yoyo: true, repeat: 1 }, t);
    return tl;
  };
  /** Dim targets (de-emphasize) at t; A.undim restores. */
  A.dim = (tl, targets, t, opacity = 0.28, o = {}) => { tl.to(targets, { opacity, duration: o.dur ?? 0.5, ease: 'power2.out' }, t); return tl; };
  A.undim = (tl, targets, t, o = {}) => { tl.to(targets, { opacity: 1, duration: o.dur ?? 0.5, ease: 'power2.out' }, t); return tl; };
  /** Slow Ken Burns zoom/pan on an <img> over [t0, t1]. */
  A.kenburns = (tl, img, o = {}) => {
    const t0 = o.t0 ?? 0, t1 = o.t1 ?? tl.__dur;
    tl.fromTo(img, { scale: o.from ?? 1.02, xPercent: o.x0 ?? 0, yPercent: o.y0 ?? 0 }, { scale: o.to ?? 1.12, xPercent: o.x1 ?? 0, yPercent: o.y1 ?? 0, duration: Math.max(0.1, t1 - t0), ease: 'none' }, t0);
    return tl;
  };
  /** Count a number up inside an element. */
  A.count = (tl, node, t, from, to, dur = 1.2, fmt = v => Math.round(v)) => {
    const o = { v: from };
    tl.fromTo(o, { v: from }, { v: to, duration: dur, ease: 'power2.out', onUpdate: () => { node.textContent = fmt(o.v); } }, t);
    node.textContent = fmt(from);
    return tl;
  };
  /** Word-by-word reveal of a text element (SplitText). */
  A.words = (tl, node, t, o = {}) => {
    const split = new SplitText(node, { type: 'words' });
    tl.fromTo(split.words, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: o.dur ?? 0.5, stagger: o.stagger ?? 0.06, ease: 'power3.out' }, t);
    return split.words;
  };
  /** Change color/background at t (e.g. highlight a row). */
  A.set = (tl, targets, t, vars, dur = 0.5) => { tl.to(targets, Object.assign({ duration: dur, ease: 'power2.out' }, vars), t); return tl; };

  window.K = K;
  window.A = A;

  /**
   * Scene time at which `phrase` is spoken inside beat i. Uses real word timestamps when the timeline
   * was built from aligned narration (beats[i].words), otherwise estimates from the phrase's character
   * position in the beat text. Falls back to fraction `fb` of the beat when the phrase isn't found.
   */
  function phraseTime(ctx, i, phrase, fb = 0.5) {
    const b = ctx.beats[i] || {};
    const say = String(b.say || '');
    const norm = w => w.toLowerCase().replace(/\u2019/g, "'").replace(/[^a-z0-9']/g, '').replace(/^'+|'+$/g, '');
    const want = (String(phrase).match(/[A-Za-z0-9'\u2019]+/g) || []).map(norm).filter(Boolean);
    if (b.words && b.words.length && want.length) {
      const ws = b.words.map(w => norm(w.w));
      for (let k = 0; k + want.length <= ws.length; k++) {
        let ok = true;
        for (let j = 0; j < want.length; j++) { if (ws[k + j] !== want[j]) { ok = false; break; } }
        if (ok) return b.words[k].t;
      }
    }
    const low = say.toLowerCase();
    const at = low.indexOf(String(phrase).toLowerCase());
    const f = at >= 0 && low.length ? at / low.length : fb;
    return ctx.cue(i) + (ctx.end(i) - ctx.cue(i)) * f;
  }
  window.phraseTime = phraseTime;

  /**
   * Scene time at fraction f (0..1) of the way through beat i's TEXT. With aligned narration this lands on
   * the word actually being spoken there (pauses and pace changes included); otherwise it is linear in time.
   */
  function fracTime(ctx, i, f) {
    const b = ctx.beats[i] || {};
    const t0 = ctx.cue(i), t1 = ctx.end(i);
    if (!(f > 0 && f < 1) || !b.words || !b.words.length) return t0 + (t1 - t0) * f;
    const say = String(b.say || '');
    const toks = [...say.matchAll(/[A-Za-z0-9'\u2019]+/g)];
    if (toks.length !== b.words.length) return t0 + (t1 - t0) * f;
    const target = f * say.length;
    for (let k = 0; k < toks.length; k++) {
      const s0 = toks[k].index, s1 = k + 1 < toks.length ? toks[k + 1].index : say.length;
      if (target < s1) {
        const w = b.words[k], nt = k + 1 < b.words.length ? b.words[k + 1].t : w.e;
        return w.t + (nt - w.t) * Math.min(1, Math.max(0, (target - s0) / Math.max(1, s1 - s0)));
      }
    }
    return t1;
  }
  window.fracTime = fracTime;

  // ---------------------------------------------------------------- chrome + boot
  function buildChrome(stage, info) {
    stage.appendChild(el('div', 'bg'));
    const logo = el('img', 'chrome-logo');
    const B = window.BRAND || {};
    logo.src = B.logo || '../assets/img/logo.png';
    stage.appendChild(logo);
    const f = el('div', 'chrome-footer');
    f.appendChild(el('div', 'url', 'www.' + (B.url || 'callingalldogsny.com')));
    f.appendChild(el('div', 'rule'));
    const tab = el('div', 'tab');
    tab.appendChild(el('span', null, info.chapterNum ? String(info.chapterNum) : ''));
    f.appendChild(tab);
    stage.appendChild(f);
    const url = f.querySelector('.url');
    return { logo, footer: f, hideUrl: () => (url.style.opacity = 0), hideLogo: () => (logo.style.opacity = 0), hideFooter: () => (f.style.opacity = 0) };
  }

  function buildBumper(ctx) {
    const { stage, tl, info } = ctx;
    const n = String(info.chapterNum).padStart(2, '0');
    const num = el('div', 'bumper-num', n);
    const bar = el('div', 'bumper-bar');
    const kick = el('div', 'bumper-kicker', (info.kicker || 'Chapter') + ' ' + info.chapterNum);
    const title = el('div', 'bumper-title', md(info.chapterTitle || ''));
    [num, bar, kick, title].forEach(x => stage.appendChild(x));
    A.in(tl, num, 0.05, 'fadeRight', { dur: 0.9 });
    A.in(tl, bar, 0.25, 'grow', { dur: 0.6 });
    A.in(tl, kick, 0.35, 'fadeUp', { dur: 0.6 });
    A.in(tl, title, 0.5, 'fadeUp', { dur: 0.8 });
    if ((window.TIMING.series || {}).motion === 'cinematic') {
      // a branded wipe opens each part: two angled green bands sweep across and reveal the card
      const mk = (bg, z) => { const w = el('div'); Object.assign(w.style, { position: 'absolute', top: '-10%', left: '0', width: '140%', height: '120%', background: bg,
        clipPath: 'polygon(12% 0, 100% 0, 88% 100%, 0 100%)', zIndex: z }); stage.appendChild(w); return w; };
      const w1 = mk('var(--green)', 60), w2 = mk('var(--green-deep)', 61);
      tl.fromTo(w2, { xPercent: -100 }, { xPercent: 75, duration: 0.75, ease: 'power3.inOut' }, 0);
      tl.fromTo(w1, { xPercent: -110 }, { xPercent: 75, duration: 0.85, ease: 'power3.inOut' }, 0.06);
    }
  }

  async function boot() {
    const q = new URLSearchParams(location.search);
    const T = window.TIMING;
    const id = q.get('scene') || T.order[0];
    const info = T.scenes[id];
    if (!info) throw new Error('unknown scene ' + id);
    const stage = document.getElementById('stage');
    if (q.get('fit')) {
      document.body.classList.add('fit');
      const s = Math.min(innerWidth / W, innerHeight / H);
      stage.style.transform = `scale(${s})`;
    }
    const chrome = buildChrome(stage, info);
    const layer = el('div', 'scene');
    stage.appendChild(layer);
    if (q.get('safe')) stage.appendChild(el('div', 'debug-safe'));

    const tl = gsap.timeline({ paused: true });
    const dur = info.dur;
    tl.__dur = dur;
    const beats = info.beats || [];
    const ctx = {
      id, info, stage: layer, chrome, tl, dur, beats, K, A, el, md,
      cue: i => (i < 0 ? (beats[beats.length + i] || {}).t ?? 0 : i < beats.length ? beats[i].t : dur),
      end: i => (i < beats.length ? beats[i].end : dur),
      at: (i, off = 0) => ctx.cue(i) + off,
      phrase: (i, text, fb) => phraseTime(ctx, i, text, fb),
      exit: true,
    };
    if (info.kind === 'bumper') buildBumper(ctx);
    else {
      const build = SCENES[id];
      if (!build) throw new Error('scene not implemented: ' + id);
      window.__ctx = ctx;
      build(ctx);
    }
    // series "motion": "cinematic" (lesson file): the background drifts like a slow camera move for the whole slide,
    // and the exit lifts and softens the scene instead of a plain fade
    const cine = (T.series || {}).motion === 'cinematic';
    if (cine) {
      const bg = stage.querySelector('.bg');
      const dir = (T.order.indexOf(id) % 2) ? 1 : -1;
      tl.fromTo(bg, { scale: 1.02, x: 0 }, { scale: 1.07, x: 34 * dir, duration: dur, ease: 'none' }, 0);
    }
    // automatic exit: everything in the scene layer fades out over the last ~0.5s
    if (ctx.exit && layer.children.length) {
      if (cine) tl.to(layer, { opacity: 0, y: -18, filter: 'blur(5px)', duration: 0.45, ease: 'power2.in' }, Math.max(0, dur - 0.52));
      else tl.to(layer, { opacity: 0, duration: 0.42, ease: 'power2.in' }, Math.max(0, dur - 0.5));
    }
    tl.set({}, {}, dur);

    await document.fonts.ready;
    await Promise.all([...document.images].map(i => (i.complete && i.naturalWidth ? null : i.decode().catch(() => console.warn('img failed', i.src)))));
    // prime layout
    tl.totalTime(0.0001); tl.totalTime(0);

    window.seek = t => { tl.totalTime(Math.max(0, Math.min(t, dur))); };
    // true if any tween is active in (t0, t1] so the renderer can reuse identical frames
    const kids = tl.getChildren(false, true, true);
    window.changesBetween = (t0, t1) => kids.some(k => {
      const s = k.startTime(), e = k.endTime();
      return e >= t0 - 1e-6 && s <= t1 + 1e-6;
    });
    window.sceneInfo = { id, dur, fps: T.fps };
    if (q.get('t')) window.seek(parseFloat(q.get('t')));
    if (q.get('play')) { tl.play(0); }
    window.__READY = true;
  }
  window.addEventListener('load', () => boot().catch(e => { window.__ERROR = String(e && e.stack || e); console.error(e); }));
})();
