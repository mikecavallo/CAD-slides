// Chapter 1 (v5): scenes built by group d. Bowl parts come from window.C1 (c1_bowl.js).
(() => {
  const DOG = '#2c4a17', DOG_FAR = '#4f7a2e';

  /** Side-view dog silhouette facing right; local box 0..400 x 0..300, paws on y 296. */
  function c1dDog(parent, x, y, s, o = {}) {
    const col = o.col || DOG, far = o.far || DOG_FAR;
    const outer = K.group(parent);
    const g = K.group(outer, { transform: `translate(${x} ${y}) scale(${s})` });
    const shadow = K.svgEl('ellipse', { cx: 206, cy: 298, rx: 160, ry: 9, fill: '#2c4a17', opacity: 0.13 }, g);
    const fig = K.group(g);
    const tail = K.group(fig);
    K.path(tail, 'M 104 134 C 84 124 66 106 54 80', { stroke: col, 'stroke-width': 15, fill: 'none' });
    // far legs
    K.path(fig, 'M 150 176 L 166 176 L 160 238 L 166 290 L 176 292 L 178 297 L 150 297 L 146 238 Z', { fill: far, stroke: far, 'stroke-width': 4 });
    K.path(fig, 'M 262 190 L 282 190 L 280 290 L 294 293 L 294 297 L 264 297 L 264 250 Z', { fill: far, stroke: far, 'stroke-width': 4 });
    // body
    K.path(fig, 'M 100 146 C 100 120 128 112 168 114 L 268 110 C 300 108 322 122 328 146 C 334 178 320 208 288 212 C 244 216 206 198 172 196 C 140 196 104 190 100 146 Z', { fill: col, stroke: 'none' });
    // near legs
    K.path(fig, 'M 98 156 C 94 196 110 214 122 230 L 114 286 C 112 294 118 297 126 297 L 146 297 C 150 297 150 290 142 288 L 136 286 L 144 234 C 152 214 162 196 160 172 Z', { fill: col, stroke: 'none' });
    K.path(fig, 'M 290 180 L 316 184 L 312 286 L 330 290 C 334 292 334 297 328 297 L 294 297 C 290 297 290 292 292 288 Z', { fill: col, stroke: col, 'stroke-width': 2, 'stroke-linejoin': 'round' });
    // head
    const head = K.group(fig);
    K.path(head, 'M 262 126 C 270 100 290 78 310 66 L 342 92 C 338 120 330 150 322 176 Z', { fill: col, stroke: 'none' });
    K.circle(head, 322, 74, 38, { fill: col });
    K.path(head, 'M 330 56 C 354 56 378 64 390 74 C 398 82 396 100 382 104 L 330 108 Z', { fill: col, stroke: 'none' });
    K.circle(head, 390, 80, 9, { fill: '#16260b' });
    K.path(head, 'M 306 48 C 290 54 282 84 288 112 C 294 120 306 116 308 106 C 314 86 316 66 316 52 Z', { fill: '#1d3310', stroke: 'none' });
    K.circle(head, 340, 66, 5, { fill: '#fff' });
    const collar = K.path(head, 'M 290 100 C 302 112 318 122 334 124', { stroke: '#b8d99a', 'stroke-width': 10, fill: 'none' });
    return { outer, g, fig, head, tail, shadow, collar, x, y, s, at: (lx, ly) => [x + lx * s, y + ly * s] };
  }

  registerScene('ch01s08', ctx => {
    const { stage, tl } = ctx;
    C1.style(stage);
    const svg = K.svg(stage, { x: 0, y: 0, w: 1920, h: 1080 });
    const d = c1dDog(svg, 200, 300, 1.4);
    const d2 = c1dDog(svg, 900, 400, 0.8);
    A.in(tl, d.outer, 0.1, 'fade');
  });
})();
