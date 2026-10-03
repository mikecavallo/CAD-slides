/* REAL.veg: procedural photoreal trees and shrubs for the build hero (three.js r128, plain script, feet, y up).

   REAL.veg.create(THREE, renderer, opts) -> {
     types:   ["pine","hemlock","oak","shrub","maple","rose","hydrangea"],
     samples: [{type, size, seed, label, footprint}],     one per type (the lab lays them out in a row)
     make(type, size, seed) -> THREE.Group               base at the origin, ~size ft tall (size defaults per type).
                                                         Children: "wood" (bark tubes, Mesh) + "foliage" (alpha-tested
                                                         cards, Mesh with customDepthMaterial/customDistanceMaterial):
                                                         2 draw calls per plant. group.userData.triangles is set.
     batch(list) -> THREE.Group                          many plants merged into one mesh per material (bark + up to three
                                                         foliage atlases), i.e. <= 4 draw calls for the whole planting.
                                                         Items: {type, size, seed, x, y, z, rot (yaw, radians), scale}
     materials: {bark, conifer, broadleaf, flower},      shared by every plant
     triangles(object3D) -> number,  buildMs, timing,  atlases (the painted canvases, for inspection)
   }
   opts: { density: 1 (foliage card multiplier, e.g. 0.6 for weak devices),
           dirAO: 0.5 (how much crown occlusion also dims direct sun inside the shadow frustum; outside it, it is full) }

   Typical sizes (ft): pine 40-60, hemlock 25-40, oak 35-50, shrub 3-5, maple (lace-leaf) 4-6, rose (of sharon) 7-9,
   hydrangea 3-4. Average triangles: pine ~7k, hemlock ~11k, oak ~11k, shrub ~2k, maple ~3.5k, rose ~5k, hydrangea ~1k,
   so 25 trees + 12 shrubs is ~280k. The "oak" type is a generic hardwood: by seed it carries lobed oak or palmate
   maple leaves, with varied crown width, height and lean.

   Technique
   - Three 1024x1024 foliage atlases (2x2 cells of 512) are painted with canvas-2D vector shapes: white-pine needle tufts,
     hemlock sprays, oak and maple leaf clusters, azalea/boxwood rosettes, lace-leaf maple, rose of sharon (leaves +
     flowers, leaves + buds), hydrangea leaves and mophead flowers. Each atlas has an sRGB colour map, a separate alpha map
     (no premultiplied black fringes) and a painted normal map in which every leaf half carries its own tilt (midrib
     fold), so sunlight glints leaf by leaf. Bark is painted the same way (ridges + furrows, colour and normal map).
     Nothing is read back from a canvas; textures build in ~100 ms.
   - Plants are tapered bark tubes (parallel-transport frames) plus many randomly oriented cards. Card vertex normals are
     bent toward the outside of their clump / crown ellipsoid so canopies shade as volumes; a per-vertex "leafAO"
     attribute darkens the crown interior (ambient fully; direct sun partly inside the shadow frustum, fully outside it,
     so backdrop trees beyond the shadow camera still read as volumes) and adds a green inter-reflection tint.
     Back faces keep the bent normal (not flipped); a thin-leaf transmission term lets backlit edge leaves glow.
   - Alpha test is boosted with mip level (foliage does not thin out with distance; the same rule runs in the shadow depth
     material so foliage casts dappled shadows), cards seen edge-on fade out instead of showing as streaks, and leaf
     colour/alpha lookups use a small negative LOD bias for crisper foliage.
   All deterministic per (type, size, seed): REAL.core.rng with fixed seeds, never Math.random. */
(function(){
"use strict";
const REAL = window.REAL = window.REAL || {};
const TAU = Math.PI * 2;
const AT = 1024, CS = 512, PAD = 3;          /* atlas size, cell size, uv inset in px */
const BARK_U = 1.3, BARK_V = 2.6;            /* feet per bark repeat around / along a limb */

/* ------------------------------------------------------------------ math */
function clamp(x, a, b){ return x < a ? a : x > b ? b : x; }
function sstep(a, b, x){ const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }
function lerp(a, b, t){ return a + (b - a) * t; }
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const mad = (a, b, s) => [a[0] + b[0] * s, a[1] + b[1] * s, a[2] + b[2] * s];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const vlen = a => Math.hypot(a[0], a[1], a[2]);
const nrm = a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const vlerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const UP = [0, 1, 0];
function perp(d){ return nrm(cross(d, Math.abs(d[1]) < 0.92 ? UP : [1, 0, 0])); }
function rotate(v, k, a){
  const c = Math.cos(a), s = Math.sin(a), kv = cross(k, v), kd = dot(k, v) * (1 - c);
  return [v[0] * c + kv[0] * s + k[0] * kd, v[1] * c + kv[1] * s + k[1] * kd, v[2] * c + kv[2] * s + k[2] * kd];
}
function sph(r){ const z = r() * 2 - 1, a = r() * TAU, s = Math.sqrt(1 - z * z); return [s * Math.cos(a), z, s * Math.sin(a)]; }
function inBall(r){ for (;;){ const q = [r() * 2 - 1, r() * 2 - 1, r() * 2 - 1]; if (dot(q, q) <= 1) return q; } }
function dirAE(az, el){ const c = Math.cos(el); return [c * Math.cos(az), Math.sin(el), c * Math.sin(az)]; }
function hashStr(s){ let h = 2166136261; for (let i = 0; i < s.length; i++){ h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

/* polyline walker: n steps of L/n from p along d, f(t, d) bends the direction */
function grow(p, d, L, n, f){
  const pts = [p]; let q = p, dd = nrm(d);
  for (let i = 1; i <= n; i++){ if (f) dd = nrm(f(i / n, dd)); q = mad(q, dd, L / n); pts.push(q); }
  return pts;
}
/* arc-length sampler over a 3-D polyline: s in 0..1 -> {p, d} */
function along3(pts){
  const cum = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + vlen(sub(pts[i], pts[i - 1])));
  const tot = cum[cum.length - 1] || 1;
  return function(s){
    const L = clamp(s, 0, 1) * tot; let i = 0;
    while (i < pts.length - 2 && cum[i + 1] < L) i++;
    const seg = cum[i + 1] - cum[i] || 1, t = (L - cum[i]) / seg;
    return {p: vlerp(pts[i], pts[i + 1], t), d: nrm(sub(pts[i + 1], pts[i]))};
  };
}
/* ray from o along d to the inside surface of an ellipsoid (c, r) */
function roomTo(o, d, c, r){
  const oo = [(o[0] - c[0]) / r[0], (o[1] - c[1]) / r[1], (o[2] - c[2]) / r[2]];
  const dd = [d[0] / r[0], d[1] / r[1], d[2] / r[2]];
  const a = dot(dd, dd), b = 2 * dot(oo, dd), cc = dot(oo, oo) - 1, disc = b * b - 4 * a * cc;
  if (disc < 0) return 0;
  return Math.max(0, (-b + Math.sqrt(disc)) / (2 * a));
}
function ellDist(p, c, r){ return Math.hypot((p[0] - c[0]) / r[0], (p[1] - c[1]) / r[1], (p[2] - c[2]) / r[2]); }

/* ------------------------------------------------------------------ geometry builder */
function Builder(){ this.P = []; this.N = []; this.T = []; this.C = []; this.A = []; this.I = []; this.n = 0; }
Builder.prototype.v = function(p, n, u, v, c, a){
  this.P.push(p[0], p[1], p[2]); this.N.push(n[0], n[1], n[2]); this.T.push(u, v); this.C.push(c[0], c[1], c[2]); this.A.push(a);
  return this.n++;
};
/* tapered tube through pts with radii rad (parallel-transport frames, no caps: tips taper, bases sit inside the parent) */
Builder.prototype.tube = function(pts, rad, segs, tint, aoFn){
  const n = pts.length; if (n < 2) return;
  const base = this.n, rep = Math.max(1, Math.round(TAU * rad[0] / BARK_U));
  let N = null, vl = 0;
  for (let i = 0; i < n; i++){
    const t = nrm(sub(pts[Math.min(i + 1, n - 1)], pts[Math.max(i - 1, 0)]));
    if (!N) N = perp(t);
    else { N = sub(N, mul(t, dot(N, t))); const l = vlen(N); N = l > 1e-4 ? mul(N, 1 / l) : perp(t); }
    const B = cross(t, N);
    if (i) vl += vlen(sub(pts[i], pts[i - 1]));
    const ao = aoFn ? aoFn(pts[i]) : 1;
    for (let j = 0; j <= segs; j++){
      const a = j / segs * TAU, ca = Math.cos(a), sa = Math.sin(a);
      const d = [N[0] * ca + B[0] * sa, N[1] * ca + B[1] * sa, N[2] * ca + B[2] * sa];
      this.v(mad(pts[i], d, rad[i]), d, j / segs * rep, vl / BARK_V, tint, ao);
    }
  }
  for (let i = 0; i < n - 1; i++) for (let j = 0; j < segs; j++){
    const a = base + i * (segs + 1) + j, b = a + segs + 1;
    this.I.push(a, a + 1, b, a + 1, b + 1, b);
  }
};
/* one foliage card. p = attach point, up = texture V axis (twig base -> tip), face ~ card normal,
   anchor = fraction of h the base sits behind p, uvr = [u0, vBase, u1, vTip],
   vc/vr = ellipsoid whose outward gradient bends the vertex normals (volume shading), bend 0..1 */
Builder.prototype.card = function(p, up, face, w, h, anchor, uvr, tint, ao, vc, vr, bend, aoFn){
  let R = cross(up, face);
  if (vlen(R) < 1e-3) R = perp(up);
  R = nrm(R);
  const F = cross(R, up);
  const b = mad(p, up, -h * anchor);
  const c0 = mad(b, R, -w / 2), c1 = mad(b, R, w / 2), c2 = mad(c1, up, h), c3 = mad(c0, up, h);
  const cs = [c0, c1, c2, c3], us = [uvr[0], uvr[2], uvr[2], uvr[0]], vs = [uvr[1], uvr[1], uvr[3], uvr[3]];
  const base = this.n;
  for (let k = 0; k < 4; k++){
    const c = cs[k];
    const g = nrm([(c[0] - vc[0]) / (vr[0] * vr[0]), (c[1] - vc[1]) / (vr[1] * vr[1]), (c[2] - vc[2]) / (vr[2] * vr[2])]);
    const s = dot(F, g) < 0 ? -1 : 1;
    const n = nrm([F[0] * s * (1 - bend) + g[0] * bend, F[1] * s * (1 - bend) + g[1] * bend, F[2] * s * (1 - bend) + g[2] * bend]);
    this.v(c, n, us[k], vs[k], tint, clamp(ao * (aoFn ? aoFn(c) : 1), 0.12, 1.15));
  }
  this.I.push(base, base + 1, base + 2, base, base + 2, base + 3);
};
/* append another builder, yawed (three.js rotation.y convention), scaled and translated */
Builder.prototype.append = function(o, rot, s, t){
  const c = Math.cos(rot), sn = Math.sin(rot), off = this.n;
  for (let i = 0; i < o.n; i++){
    const x = o.P[i * 3] * s, y = o.P[i * 3 + 1] * s, z = o.P[i * 3 + 2] * s;
    this.P.push(x * c + z * sn + t[0], y + t[1], -x * sn + z * c + t[2]);
    const nx = o.N[i * 3], ny = o.N[i * 3 + 1], nz = o.N[i * 3 + 2];
    this.N.push(nx * c + nz * sn, ny, -nx * sn + nz * c);
    this.T.push(o.T[i * 2], o.T[i * 2 + 1]);
    this.C.push(o.C[i * 3], o.C[i * 3 + 1], o.C[i * 3 + 2]);
    this.A.push(o.A[i]);
  }
  for (let i = 0; i < o.I.length; i++) this.I.push(o.I[i] + off);
  this.n += o.n;
};
Builder.prototype.geometry = function(THREE){
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(this.P, 3));
  g.setAttribute("normal", new THREE.Float32BufferAttribute(this.N, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(this.T, 2));
  g.setAttribute("color", new THREE.Float32BufferAttribute(this.C, 3));
  g.setAttribute("leafAO", new THREE.Float32BufferAttribute(this.A, 1));
  g.setIndex(this.n > 65535 ? new THREE.Uint32BufferAttribute(this.I, 1) : new THREE.Uint16BufferAttribute(this.I, 1));
  g.computeBoundingBox(); g.computeBoundingSphere();
  return g;
};

/* ------------------------------------------------------------------ texture painting */
function rgbs(c, a){ return a == null ? "rgb(" + (c[0] | 0) + "," + (c[1] | 0) + "," + (c[2] | 0) + ")" : "rgba(" + (c[0] | 0) + "," + (c[1] | 0) + "," + (c[2] | 0) + "," + a + ")"; }
function mixc(a, b, t){ return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
function jit(c, r, amt, hue){ const k = 1 + (r() - 0.5) * 2 * amt, h = (r() - 0.5) * 2 * (hue || 0); return [clamp(c[0] * k * (1 + h), 0, 255), clamp(c[1] * k, 0, 255), clamp(c[2] * k * (1 - h), 0, 255)]; }
/* canvas-space normal (x right, y down, z out of the canvas) -> tangent-space normal map colour (green = +V = canvas up) */
function nstyle(nx, ny, nz){
  const l = Math.hypot(nx, ny, nz) || 1;
  return "rgb(" + Math.round((nx / l * 0.5 + 0.5) * 255) + "," + Math.round((-ny / l * 0.5 + 0.5) * 255) + "," + Math.round((nz / l * 0.5 + 0.5) * 255) + ")";
}
const FLATN = "rgb(128,128,255)";

/* 2-D helpers for painters (cell units 0..1, y down) */
function walk(r, x, y, ang, L, n, curl, wob){
  const pts = [[x, y]], st = L / n, w = wob == null ? 0.1 : wob;
  for (let i = 0; i < n; i++){ ang += curl + (r() - 0.5) * w; x += Math.cos(ang) * st; y += Math.sin(ang) * st; pts.push([x, y]); }
  return pts;
}
function along2(pts){
  const cum = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const tot = cum[cum.length - 1] || 1;
  const f = function(s){
    const L = clamp(s, 0, 1) * tot; let i = 0;
    while (i < pts.length - 2 && cum[i + 1] < L) i++;
    const seg = cum[i + 1] - cum[i] || 1, t = (L - cum[i]) / seg;
    const dx = pts[i + 1][0] - pts[i][0], dy = pts[i + 1][1] - pts[i][1], dl = Math.hypot(dx, dy) || 1;
    return {x: pts[i][0] + dx * t, y: pts[i][1] + dy * t, dx: dx / dl, dy: dy / dl, a: Math.atan2(dy, dx)};
  };
  f.length2 = tot;
  return f;
}
/* leaf outline in leaf-local space (base at 0, axis +x): top (y<0) and bottom halves, base -> tip */
function outline(len, wid, hw, n, r, asym){
  const top = [], bot = [], ph = r() * TAU, a = asym == null ? 0.08 : asym;
  for (let i = 0; i <= n; i++){
    const t = i / n, h = hw(t) * wid, k = a * Math.sin(t * 4 + ph);
    top.push([t * len, -h * (1 + k)]); bot.push([t * len, h * (1 - k)]);
  }
  return {top, bot, len, wid};
}
const ellip = (p, q) => t => Math.pow(Math.max(0, Math.sin(Math.PI * Math.pow(t, p))), q);
const serr = (base, teeth, depth) => t => base(t) * (1 + depth * (((t * teeth) % 1) - 0.5) * sstep(0.04, 0.2, t) * (1 - sstep(0.86, 1, t)));
const oakShape = t => ellip(1.15, 0.7)(t) * (1 - 0.55 * Math.pow(0.5 + 0.5 * Math.cos(TAU * (t * 4.5 - 0.15)), 3) * sstep(0.1, 0.25, t) * (1 - sstep(0.82, 0.97, t)));

/* a cell: the three atlas contexts clipped + scaled to one 512px cell, painted in cell units */
function Cell(ctxs, ox, oy){
  this.c = ctxs[0]; this.a = ctxs[1]; this.n = ctxs[2]; this.all = ctxs;
  for (const x of ctxs){ x.save(); x.beginPath(); x.rect(ox, oy, CS, CS); x.clip(); x.translate(ox, oy); x.scale(CS, CS); x.lineCap = "round"; x.lineJoin = "round"; }
}
Cell.prototype.end = function(){ for (const x of this.all) x.restore(); };
Cell.prototype.twig = function(pts, w0, w1, col){
  const n = pts.length - 1, cs = rgbs(col);
  for (let i = 0; i < n; i++){
    const w = lerp(w0, w1, i / Math.max(1, n - 1));
    const p = new Path2D(); p.moveTo(pts[i][0], pts[i][1]); p.lineTo(pts[i + 1][0], pts[i + 1][1]);
    this.a.lineWidth = this.c.lineWidth = this.n.lineWidth = w;
    this.a.strokeStyle = "#fff"; this.a.stroke(p);
    this.c.strokeStyle = cs; this.c.stroke(p);
    this.n.strokeStyle = FLATN; this.n.stroke(p);
  }
};
/* many quadratic strokes [x0,y0,cx,cy,x1,y1] in one colour (needles) */
Cell.prototype.strokes = function(segs, width, col, ns){
  if (!segs.length) return;
  const p = new Path2D();
  for (const s of segs){ p.moveTo(s[0], s[1]); p.quadraticCurveTo(s[2], s[3], s[4], s[5]); }
  this.a.lineWidth = this.c.lineWidth = this.n.lineWidth = width;
  this.a.strokeStyle = "#fff"; this.a.stroke(p);
  this.c.strokeStyle = rgbs(col); this.c.stroke(p);
  this.n.strokeStyle = ns; this.n.stroke(p);
};
/* one leaf (or petal / sepal / lobe). o: {fold, tilt:[tx,ty], rib, veins, shade, ribCol} */
Cell.prototype.leaf = function(x, y, ang, L, col, o){
  o = o || {};
  const top = L.top, bot = L.bot, c = this.c, a = this.a, n = this.n;
  const full = new Path2D();
  full.moveTo(top[0][0], top[0][1]);
  for (let i = 1; i < top.length; i++) full.lineTo(top[i][0], top[i][1]);
  for (let i = bot.length - 1; i >= 0; i--) full.lineTo(bot[i][0], bot[i][1]);
  full.closePath();
  for (const x2 of this.all){ x2.save(); x2.translate(x, y); x2.rotate(ang); }
  a.fillStyle = "#fff"; a.fill(full);
  c.fillStyle = rgbs(col); c.fill(full);
  const sh = o.shade == null ? 1 : o.shade;
  if (sh){
    const g = c.createLinearGradient(0, -L.wid, 0, L.wid);
    g.addColorStop(0, "rgba(255,250,215," + (0.13 * sh).toFixed(3) + ")");
    g.addColorStop(0.5, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(0,0,0," + (0.16 * sh).toFixed(3) + ")");
    c.fillStyle = g; c.fill(full);
    const g2 = c.createLinearGradient(0, 0, L.len, 0);
    g2.addColorStop(0, "rgba(0,0,0," + (0.12 * sh).toFixed(3) + ")");
    g2.addColorStop(0.35, "rgba(0,0,0,0)");
    g2.addColorStop(1, "rgba(255,255,220," + (0.06 * sh).toFixed(3) + ")");
    c.fillStyle = g2; c.fill(full);
  }
  if (o.rib){
    const rc = o.ribCol || mixc(col, [225, 235, 190], 0.28);
    c.strokeStyle = rgbs(rc, 0.6); c.lineWidth = Math.max(0.0022, L.wid * 0.07);
    c.beginPath(); c.moveTo(0, 0); c.lineTo(L.len * 0.93, 0); c.stroke();
    if (o.veins){
      c.lineWidth = Math.max(0.0016, L.wid * 0.035); c.strokeStyle = rgbs(rc, 0.35);
      c.beginPath();
      const nt = top.length - 1;
      for (let k = 0; k < o.veins; k++){
        const t = (k + 0.8) / (o.veins + 0.6) * 0.86, i = Math.min(nt, Math.round((t + 0.12) * nt));
        const x0 = t * L.len;
        c.moveTo(x0, 0); c.quadraticCurveTo(x0 + L.len * 0.05, top[i][1] * 0.5, top[i][0], top[i][1] * 0.85);
        c.moveTo(x0, 0); c.quadraticCurveTo(x0 + L.len * 0.05, bot[i][1] * 0.5, bot[i][0], bot[i][1] * 0.85);
      }
      c.stroke();
    }
  }
  /* normal map: each half tilted toward (or away from) the midrib, on top of the leaf's own tilt */
  const ca = Math.cos(ang), sa = Math.sin(ang), lx = -sa, ly = ca;
  const t = o.tilt || [0, 0], f = o.fold == null ? 0.3 : o.fold;
  const half = pts => { const p = new Path2D(); p.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) p.lineTo(pts[i][0], pts[i][1]); p.lineTo(L.len, 0); p.lineTo(0, 0); p.closePath(); return p; };
  n.fillStyle = nstyle(t[0] + lx * f, t[1] + ly * f, 1); n.fill(half(top));
  n.fillStyle = nstyle(t[0] - lx * f, t[1] - ly * f, 1); n.fill(half(bot));
  for (const x2 of this.all) x2.restore();
};
/* colour-only radial wash (flower eyes, shading) */
Cell.prototype.wash = function(x, y, rad, inner, outer){
  const g = this.c.createRadialGradient(x, y, 0, x, y, rad);
  g.addColorStop(0, inner); g.addColorStop(1, outer);
  this.c.fillStyle = g; this.c.beginPath(); this.c.arc(x, y, rad, 0, TAU); this.c.fill();
};

/* ---- painters: each is {bg, paint(cell, rnd)} ---- */
function tiltR(r, a){ return [(r() - 0.5) * 2 * a, (r() - 0.5) * 2 * a]; }

/* eastern white pine: soft 5-needle fascicles along a twig, a brush-like tuft at the tip */
function pinePainter(variant){
  return {bg: [54, 78, 58], paint(cell, r){
    const twigs = [];
    if (variant === 0){
      twigs.push({pts: walk(r, 0.5, 0.99, -Math.PI / 2 + (r() - 0.5) * 0.12, 0.6, 8, (r() - 0.5) * 0.03, 0.06), sc: 1});
    } else {
      const m = walk(r, 0.5, 0.99, -Math.PI / 2 + 0.04, 0.3, 4, 0, 0.05), e = m[m.length - 1];
      twigs.push({pts: m, sc: 0.75, from: 0.3});
      twigs.push({pts: walk(r, e[0], e[1], -Math.PI / 2 - 0.55, 0.4, 6, 0.035, 0.06), sc: 0.8});
      twigs.push({pts: walk(r, e[0], e[1], -Math.PI / 2 + 0.5, 0.36, 6, -0.035, 0.06), sc: 0.8});
    }
    const NB = 8, B = []; for (let i = 0; i < NB; i++) B.push([]);
    for (const tw of twigs){
      const f = along2(tw.pts);
      for (let s = tw.from || 0.12; s <= 1.0001; s += 0.02){
        const q = f(s);
        for (let k = 0; k < 5; k++){
          const side = r() < 0.5 ? -1 : 1;
          const spread = (0.28 + 0.95 * r()) * (1 - 0.45 * s);
          const a = q.a + side * spread, L = (0.12 + 0.11 * r()) * tw.sc * (0.8 + 0.25 * s);
          const ex = q.x + Math.cos(a) * L, ey = q.y + Math.sin(a) * L, bend = (r() - 0.25) * 0.22 * L * side;
          const mx = q.x + Math.cos(a) * L * 0.5 - Math.sin(a) * bend, my = q.y + Math.sin(a) * L * 0.5 + Math.cos(a) * bend;
          B[(r() * NB) | 0].push([q.x, q.y, mx, my, ex, ey]);
        }
      }
      const e = f(1);
      for (let k = 0; k < 46; k++){
        const a = e.a + (r() - 0.5) * 1.9, L = (0.09 + 0.1 * r()) * tw.sc;
        const ex = e.x + Math.cos(a) * L, ey = e.y + Math.sin(a) * L, bend = (r() - 0.5) * 0.15 * L;
        B[(NB * (0.35 + 0.65 * r())) | 0].push([e.x, e.y, (e.x + ex) / 2 - Math.sin(a) * bend, (e.y + ey) / 2 + Math.cos(a) * bend, ex, ey]);
      }
    }
    for (const tw of twigs) cell.twig(tw.pts, 0.012 * tw.sc, 0.005, [92, 78, 58]);
    const dark = [44, 68, 50], light = [118, 144, 108];
    for (let b = 0; b < NB; b++){
      const t = b / (NB - 1);
      cell.strokes(B[b], 0.0034, jit(mixc(dark, light, t), r, 0.05, 0.05), nstyle((r() - 0.5) * 0.9, (r() - 0.5) * 0.9, 1));
    }
  }};
}

/* eastern hemlock: flat pinnate spray, two-ranked short flat needles, light new growth at the tips */
function hemlockPainter(variant){
  return {bg: [42, 62, 38], paint(cell, r){
    const axes = [];
    const main = walk(r, 0.5 + (r() - 0.5) * 0.06, 0.985, -Math.PI / 2 + (r() - 0.5) * 0.18, 0.9, 10, (r() - 0.5) * 0.035, 0.05);
    axes.push({pts: main, w: 0.0065});
    const fm = along2(main);
    let side = r() < 0.5 ? -1 : 1;
    const maxL = variant ? 0.3 : 0.36;
    for (let s = 0.06; s < 0.93; s += 0.055 + r() * 0.025){
      side = -side;
      const q = fm(s);
      const L = maxL * Math.pow(1 - s, 0.7) * (0.75 + 0.5 * r()) + 0.03;
      const sp = walk(r, q.x, q.y, q.a + side * (0.95 + r() * 0.3), L, 5, -side * 0.035, 0.08);
      axes.push({pts: sp, w: 0.004});
      if (L > 0.12){
        const fs = along2(sp); let s2 = side;
        for (let t = 0.28; t < 0.85; t += 0.2 + r() * 0.08){
          s2 = -s2; const q2 = fs(t);
          axes.push({pts: walk(r, q2.x, q2.y, q2.a + s2 * 1.0, L * (1 - t) * 0.5 + 0.02, 3, 0, 0.1), w: 0.003});
        }
      }
    }
    const NB = 6, B = [], G = [[], []]; for (let i = 0; i < NB; i++) B.push([]);
    for (const ax of axes){
      const f = along2(ax.pts), tot = f.length2, step = 0.0085 / tot;
      for (let s = 0; s <= 1; s += step){
        const q = f(s);
        for (const sd of [-1, 1]){
          const a = q.a + sd * (1.2 + (r() - 0.5) * 0.4), L = (0.021 + r() * 0.011) * (1 - 0.35 * s);
          const ex = q.x + Math.cos(a) * L, ey = q.y + Math.sin(a) * L;
          const seg = [q.x, q.y, (q.x + ex) / 2, (q.y + ey) / 2, ex, ey];
          if (s > 0.7 && r() < 0.75) G[(r() * 2) | 0].push(seg); else B[(r() * NB) | 0].push(seg);
        }
        if (r() < 0.25){ const a = q.a + (r() - 0.5) * 0.6, L = 0.016; B[(r() * NB) | 0].push([q.x, q.y, q.x + Math.cos(a) * L * 0.5, q.y + Math.sin(a) * L * 0.5, q.x + Math.cos(a) * L, q.y + Math.sin(a) * L]); }
      }
    }
    for (const ax of axes) cell.twig(ax.pts, ax.w, ax.w * 0.6, [86, 66, 46]);
    const dark = [40, 63, 37], light = [80, 108, 60];
    for (let b = 0; b < NB; b++) cell.strokes(B[b], 0.0046, jit(mixc(dark, light, b / (NB - 1)), r, 0.05, 0.04), nstyle((r() - 0.5) * 0.8, (r() - 0.5) * 0.8, 1));
    cell.strokes(G[0], 0.0046, [92, 122, 58], nstyle(0.2, -0.2, 1));
    cell.strokes(G[1], 0.0046, [108, 136, 66], nstyle(-0.25, 0.1, 1));
  }};
}

/* hardwood twig cluster: oak (lobed) or maple (palmate) leaves, whorled at the twig tips */
function broadleafPainter(kind){
  return {bg: kind === "oak" ? [48, 66, 30] : [50, 70, 32], paint(cell, r){
    const main = walk(r, 0.5, 0.99, -Math.PI / 2, 0.22, 3, 0, 0.08), fork = main[main.length - 1];
    const twigs = [main], tips = [];
    const nT = 4;
    for (let k = 0; k < nT; k++){
      const a = -Math.PI / 2 + (k - (nT - 1) / 2) * 0.62 + (r() - 0.5) * 0.2;
      const tw = walk(r, fork[0], fork[1], a, 0.3 + r() * 0.12, 4, (r() - 0.5) * 0.1, 0.12);
      twigs.push(tw); tips.push({p: tw[tw.length - 1], a: a, f: along2(tw)});
    }
    const leaves = [];
    for (const tp of tips){
      const n = 5 + ((r() * 3) | 0);
      for (let j = 0; j < n; j++) leaves.push({x: tp.p[0], y: tp.p[1], a: tp.a + (j / (n - 1) - 0.5) * 2.9 + (r() - 0.5) * 0.3, d: 0.3 + r() * 0.7, s: 0.8 + r() * 0.25});
      for (let j = 0; j < 3; j++){
        const q = tp.f(0.25 + r() * 0.55);
        leaves.push({x: q.x, y: q.y, a: q.a + (j % 2 ? 1 : -1) * (0.7 + r() * 0.6), d: r() * 0.8, s: 0.7 + r() * 0.2});
      }
    }
    leaves.sort((p, q) => p.d - q.d);
    for (const tw of twigs) cell.twig(tw, 0.008, 0.0035, [88, 74, 56]);
    const dark = kind === "oak" ? [46, 70, 30] : [50, 76, 32], light = kind === "oak" ? [94, 122, 50] : [100, 128, 52];
    for (const lf of leaves){
      const col = jit(mixc(dark, light, clamp(lf.d * 0.75 + r() * 0.3, 0, 1)), r, 0.07, 0.05);
      const off = 0.014;
      const x = lf.x + Math.cos(lf.a) * off, y = lf.y + Math.sin(lf.a) * off;
      if (kind === "oak"){
        const L = (0.15 + 0.05 * r()) * lf.s;
        cell.leaf(x, y, lf.a, outline(L, L * 0.34, oakShape, 56, r, 0.1), col, {fold: 0.25 + r() * 0.3, tilt: tiltR(r, 0.35), rib: true, veins: 4});
      } else {
        const R = (0.1 + 0.035 * r()) * lf.s, la = [0, 0.78, -0.78, 1.5, -1.5], ll = [1, 0.86, 0.86, 0.5, 0.5];
        const tilt = tiltR(r, 0.3);
        for (let k = 4; k >= 0; k--){
          const L = R * ll[k];
          cell.leaf(x, y, lf.a + la[k] + (r() - 0.5) * 0.12, outline(L, L * 0.42, serr(ellip(0.72, 0.85), 5, 0.55), 30, r, 0.06), col, {fold: 0.2, tilt: [tilt[0] + (r() - 0.5) * 0.2, tilt[1] + (r() - 0.5) * 0.2], rib: true, veins: 0, shade: 0.7});
        }
      }
    }
  }};
}

/* azalea / boxwood: dense rosettes of small glossy leaves */
function shrubPainter(){
  return {bg: [52, 70, 30], paint(cell, r){
    const leaves = [];
    for (let k = 0; k < 8; k++){
      const cx = 0.5 + (r() - 0.5) * 0.56, cy = 0.2 + 0.62 * r(), n = 5 + ((r() * 3) | 0), a0 = r() * TAU, d = r();
      for (let j = 0; j < n; j++) leaves.push({x: cx, y: cy, a: a0 + j * TAU / n + (r() - 0.5) * 0.4, d: d + 0.15 * r(), L: 0.11 + 0.05 * r()});
    }
    for (let k = 0; k < 26; k++) leaves.push({x: 0.18 + 0.64 * r(), y: 0.12 + 0.76 * r(), a: r() * TAU, d: r() * 0.7, L: 0.1 + 0.05 * r()});
    leaves.sort((p, q) => p.d - q.d);
    const dark = [48, 74, 32], light = [92, 120, 50];
    for (const lf of leaves){
      const col = jit(mixc(dark, light, clamp(lf.d * 0.8 + r() * 0.25, 0, 1)), r, 0.06, 0.06);
      cell.leaf(lf.x, lf.y, lf.a, outline(lf.L, lf.L * 0.36, ellip(0.92, 0.75), 20, r, 0.05), col, {fold: 0.35, tilt: tiltR(r, 0.45), rib: true, shade: 0.9});
    }
  }};
}

/* lace-leaf Japanese maple: finely dissected palmate leaves hanging from a twig, dark red-purple */
function lacePainter(){
  return {bg: [48, 14, 22], paint(cell, r){
    const tw = walk(r, 0.5, 0.99, -Math.PI / 2 + (r() - 0.5) * 0.1, 0.88, 8, (r() - 0.5) * 0.04, 0.08), f = along2(tw);
    const leaves = [];
    let side = 1;
    for (let s = 0.1; s < 0.98; s += 0.085 + r() * 0.03){
      side = -side;
      const q = f(s), pa = q.a + side * (0.8 + r() * 0.6), pl = 0.04 + r() * 0.04;
      leaves.push({x: q.x + Math.cos(pa) * pl, y: q.y + Math.sin(pa) * pl, a: pa + (r() - 0.5) * 0.6, d: r(), R: 0.13 + 0.06 * r(), px: q.x, py: q.y});
    }
    leaves.sort((p, q) => p.d - q.d);
    cell.twig(tw, 0.008, 0.004, [70, 30, 32]);
    const dark = [48, 15, 22], light = [98, 32, 34];
    for (const lf of leaves){
      cell.twig([[lf.px, lf.py], [lf.x, lf.y]], 0.003, 0.003, [90, 30, 34]);
      const base = jit(mixc(dark, light, clamp(lf.d * 0.7 + r() * 0.35, 0, 1)), r, 0.08, 0.04);
      const nl = 9 + ((r() * 3) | 0), fan = 4.4, tilt = tiltR(r, 0.35);
      for (let k = 0; k < nl; k++){
        const t = k / (nl - 1) - 0.5, L = lf.R * (1 - 0.4 * t * t * 4) * (0.8 + 0.3 * r());
        const a = lf.a + t * fan + (r() - 0.5) * 0.2, curl = (r() - 0.5) * 0.3;
        cell.leaf(lf.x, lf.y, a + curl, outline(L, L * 0.13, serr(ellip(0.85, 0.9), 11, 1.5), 66, r, 0.08), jit(base, r, 0.07, 0.03), {fold: 0.35, tilt: [tilt[0] + (r() - 0.5) * 0.35, tilt[1] + (r() - 0.5) * 0.35], rib: true, ribCol: mixc(base, [130, 46, 44], 0.25), shade: 0.5});
      }
    }
  }};
}

/* rose of sharon: toothed 3-lobed leaves; variant 0 adds two open pink-magenta flowers with a dark red eye, variant 1 buds */
function rosePainter(variant){
  return {bg: [46, 68, 32], paint(cell, r){
    const tw = walk(r, 0.5, 0.99, -Math.PI / 2 + (r() - 0.5) * 0.1, 0.84, 7, (r() - 0.5) * 0.03, 0.08), f = along2(tw);
    cell.twig(tw, 0.009, 0.004, [96, 86, 66]);
    const leaves = []; let side = 1;
    for (let s = 0.1; s < 0.98; s += 0.1 + r() * 0.04){ side = -side; const q = f(s); leaves.push({x: q.x, y: q.y, a: q.a + side * (0.7 + r() * 0.45), d: r(), L: (0.16 + 0.07 * r()) * (1 - 0.3 * s)}); }
    leaves.sort((p, q) => p.d - q.d);
    const dark = [50, 76, 34], light = [100, 130, 54];
    const rshape = t => serr(ellip(0.82, 0.85), 8, 0.4)(t) * (1 + 0.22 * Math.exp(-Math.pow((t - 0.45) / 0.1, 2)));
    for (const lf of leaves) cell.leaf(lf.x, lf.y, lf.a, outline(lf.L, lf.L * 0.42, rshape, 40, r, 0.1), jit(mixc(dark, light, clamp(lf.d * 0.8 + r() * 0.25, 0, 1)), r, 0.06, 0.05), {fold: 0.35, tilt: tiltR(r, 0.35), rib: true, veins: 3});
    if (variant === 0){
      const fl = [{x: 0.3 + r() * 0.08, y: 0.3 + r() * 0.1}, {x: 0.64 + r() * 0.08, y: 0.5 + r() * 0.12}];
      for (const F of fl){
        const R = 0.14 + 0.03 * r(), a0 = r() * TAU, base = jit([214, 92, 160], r, 0.06, 0.04);
        for (let k = 0; k < 5; k++){
          const a = a0 + k * TAU / 5 + (r() - 0.5) * 0.25;
          cell.leaf(F.x, F.y, a, outline(R, R * 0.5, ellip(1.7, 0.6), 26, r, 0.12), jit(base, r, 0.06, 0.02), {fold: 0.12, tilt: [-Math.cos(a) * 0.35, -Math.sin(a) * 0.35], rib: true, ribCol: [170, 50, 110], veins: 3, shade: 0.5});
        }
        cell.wash(F.x, F.y, R * 0.42, "rgba(118,8,52,0.95)", "rgba(150,20,80,0)");
        const sa = r() * TAU, sl = R * 0.32;
        cell.twig([[F.x, F.y], [F.x + Math.cos(sa) * sl, F.y + Math.sin(sa) * sl]], 0.008, 0.006, [236, 226, 196]);
        cell.wash(F.x + Math.cos(sa) * sl, F.y + Math.sin(sa) * sl, 0.016, "rgba(244,232,170,1)", "rgba(244,232,170,0.2)");
      }
    } else {
      for (let k = 0; k < 4; k++){
        const q = f(0.35 + k * 0.17), a = q.a + (k % 2 ? 1 : -1) * 0.5;
        const L = 0.05 + r() * 0.02, x = q.x + Math.cos(a) * 0.01, y = q.y + Math.sin(a) * 0.01;
        cell.leaf(x, y, a, outline(L, L * 0.38, ellip(1.0, 0.8), 16, r, 0.05), k % 2 ? [92, 116, 52] : [176, 92, 140], {fold: 0.3, tilt: tiltR(r, 0.3), shade: 0.8});
      }
    }
  }};
}

/* hydrangea: big opposite serrated leaves */
function hydLeafPainter(){
  return {bg: [50, 76, 34], paint(cell, r){
    const tw = walk(r, 0.5, 0.99, -Math.PI / 2, 0.8, 6, 0, 0.06), f = along2(tw);
    cell.twig(tw, 0.012, 0.006, [96, 104, 62]);
    const leaves = [];
    [0.18, 0.46, 0.72, 0.92].forEach((s, i) => {
      const q = f(s), sz = i === 3 ? 0.55 : 1 - i * 0.12;
      for (const sd of [-1, 1]) leaves.push({x: q.x, y: q.y, a: q.a + sd * (0.75 + r() * 0.4), d: r(), L: (0.3 + 0.06 * r()) * sz});
    });
    leaves.sort((p, q) => p.d - q.d);
    const dark = [54, 86, 38], light = [108, 144, 60];
    for (const lf of leaves) cell.leaf(lf.x, lf.y, lf.a, outline(lf.L, lf.L * 0.36, serr(ellip(0.9, 0.8), 13, 0.16), 60, r, 0.06), jit(mixc(dark, light, clamp(lf.d * 0.8 + r() * 0.2, 0, 1)), r, 0.05, 0.04), {fold: 0.3, tilt: tiltR(r, 0.3), rib: true, veins: 6});
  }};
}

/* hydrangea mophead: a ball of four-sepal florets, sphere-shaded in both colour and normal map */
function hydFlowerPainter(){
  return {bg: [170, 186, 214], paint(cell, r){
    const cx = 0.5, cy = 0.5, R = 0.43, fl = [];
    for (let k = 0; k < 230; k++){ const rr = Math.sqrt(r()) * R * 0.97, a = r() * TAU; const dx = Math.cos(a) * rr, dy = Math.sin(a) * rr; fl.push({dx, dy, z: Math.sqrt(Math.max(0, R * R - rr * rr)) / R}); }
    fl.sort((p, q) => p.z - q.z);
    const pal = [[140, 172, 236], [158, 170, 234], [206, 218, 242], [182, 178, 232], [168, 196, 244]];
    for (const F of fl){
      const base = jit(pal[(r() * pal.length) | 0], r, 0.05, 0.03);
      const sh = 0.78 + 0.22 * F.z + 0.08 * (-F.dx - F.dy) / R;
      const col = [base[0] * sh, base[1] * sh, base[2] * sh];
      const s = 0.042 + 0.014 * r(), a0 = r() * TAU, x = cx + F.dx, y = cy + F.dy;
      const tn = [F.dx / R * 0.9, F.dy / R * 0.9];
      for (let k = 0; k < 4; k++){
        const a = a0 + k * TAU / 4 + (r() - 0.5) * 0.3;
        cell.leaf(x, y, a, outline(s, s * 0.62, ellip(1.35, 0.6), 12, r, 0.1), jit(col, r, 0.04, 0.02), {fold: 0.1, tilt: [tn[0] - Math.cos(a) * 0.2, tn[1] - Math.sin(a) * 0.2], shade: 0.5});
      }
      cell.wash(x, y, s * 0.22, "rgba(70,80,130,0.8)", "rgba(70,80,130,0)");
    }
  }};
}

function noiseCanvas(core, seed){
  const S = 128, f = core.normalize(core.fbm(S, S, {base: 4, octaves: 4, persistence: 0.55, seed: seed}));
  return core.paint(f, S, S, v => { const g = 128 + (v - 0.5) * 150; return [g, g, g]; });
}

function paintAtlas(core, painters, seed){
  const col = core.canvas(AT, AT), alp = core.canvas(AT, AT), nor = core.canvas(AT, AT);
  const cc = col.getContext("2d"), ac = alp.getContext("2d"), nc = nor.getContext("2d");
  ac.fillStyle = "#000"; ac.fillRect(0, 0, AT, AT);
  nc.fillStyle = FLATN; nc.fillRect(0, 0, AT, AT);
  const noise = noiseCanvas(core, seed);
  painters.forEach((pt, k) => {
    const ox = (k % 2) * CS, oy = (k >> 1) * CS;
    cc.fillStyle = rgbs(pt.bg); cc.fillRect(ox, oy, CS, CS);
    const cell = new Cell([cc, ac, nc], ox, oy);
    pt.paint(cell, core.rng(seed * 31 + k * 977 + 5));
    cell.end();
    cc.save(); cc.globalCompositeOperation = "soft-light"; cc.globalAlpha = 0.55;
    cc.drawImage(noise, ox, oy, CS, CS); cc.restore();
  });
  return {col, alp, nor};
}
function cellUV(k, mirror){
  const ox = (k % 2) * CS, oy = (k >> 1) * CS;
  const u0 = (ox + PAD) / AT, u1 = (ox + CS - PAD) / AT, vb = 1 - (oy + CS - PAD) / AT, vt = 1 - (oy + PAD) / AT;
  return mirror ? [u1, vb, u0, vt] : [u0, vb, u1, vt];
}

/* ridged bark: staggered columns of long flat-topped ridges separated by dark furrows, merging and splitting
   (oak / pine / hemlock all use it, tinted per species by vertex colour). Colour and normal map are both painted as
   vector shapes (the normal map with per-ridge gradients), so nothing is read back from a canvas.
   256 x 512 = one repeat of BARK_U x BARK_V feet; tiles in both directions. */
function paintBark(core){
  const BW = 256, BH = 512, r = core.rng(4242);
  const col = core.canvas(BW, BH), nor = core.canvas(BW, BH);
  const cc = col.getContext("2d"), nc = nor.getContext("2d");
  cc.fillStyle = "rgb(50,45,40)"; cc.fillRect(0, 0, BW, BH);
  nc.fillStyle = FLATN; nc.fillRect(0, 0, BW, BH);
  const nCol = 8, cw = BW / nCol, plates = [];
  const mk = (x, y, L, w, sk) => { const j = []; for (let i = 0; i <= 24; i++) j.push((r() - 0.5) * 0.35); plates.push({x, y, L, w, sk, tone: r(), lich: r(), ph: r() * 6, j}); };
  for (let c = 0; c < nCol; c++){
    let y = r() * BH;
    const yEnd = y + BH;
    while (y < yEnd){
      const L = 110 + r() * 220, w = cw * (0.6 + r() * 0.35), x = (c + 0.5) * cw + (r() - 0.5) * cw * 0.35;
      mk(x, y, L, w, (r() - 0.5) * 0.1);
      if (r() < 0.3) mk(x + (r() < 0.5 ? -1 : 1) * cw * 0.5, y + L * 0.5, 40 + r() * 50, w * 0.7, (r() - 0.5) * 0.9);
      y += L + 2 + r() * 6;
    }
  }
  /* ridge outline: flat-topped, slightly wavy sides, rounded ends */
  function platePath(ctx, p, ox, oy, inset){
    const n = 12;
    ctx.beginPath();
    for (let i = 0; i <= n; i++){ const t = i / n, hw = Math.pow(Math.sin(Math.PI * t), 0.16) * 0.5 * (p.w - inset) * (0.8 + 0.2 * Math.sin(t * 7 + p.ph) + p.j[i]); ctx.lineTo(ox + p.x + hw + (t - 0.5) * p.L * p.sk, oy + p.y + inset + t * (p.L - inset * 2)); }
    for (let i = n; i >= 0; i--){ const t = i / n, hw = Math.pow(Math.sin(Math.PI * t), 0.16) * 0.5 * (p.w - inset) * (0.8 + 0.2 * Math.sin(t * 5 + p.ph * 1.7) + p.j[i + 12]); ctx.lineTo(ox + p.x - hw + (t - 0.5) * p.L * p.sk, oy + p.y + inset + t * (p.L - inset * 2)); }
    ctx.closePath();
  }
  const nL = nstyle(-0.75, 0, 1), nR = nstyle(0.75, 0, 1), nT = nstyle(0, -0.5, 1), nB = nstyle(0, 0.5, 1);
  for (const p of plates){
    for (const ox of [-BW, 0, BW]) for (const oy of [-BH, 0, BH]){
      if (p.x + ox + p.w < 0 || p.x + ox - p.w > BW || p.y + oy > BH || p.y + oy + p.L < 0) continue;
      const g = 100 + p.tone * 34, lich = p.lich > 0.78;
      cc.fillStyle = lich ? "rgb(" + (g * 0.93 | 0) + "," + (g * 0.99 | 0) + "," + (g * 0.84 | 0) + ")" : "rgb(" + (g | 0) + "," + (g * 0.96 | 0) + "," + (g * 0.9 | 0) + ")";
      platePath(cc, p, ox, oy, 0); cc.fill();
      cc.fillStyle = "rgba(255,252,245,0.08)"; platePath(cc, p, ox - 1, oy, 5); cc.fill();
      const x0 = ox + p.x - p.w / 2, gx = nc.createLinearGradient(x0, 0, x0 + p.w, 0);
      gx.addColorStop(0, nL); gx.addColorStop(0.28, FLATN); gx.addColorStop(0.72, FLATN); gx.addColorStop(1, nR);
      nc.fillStyle = gx; platePath(nc, p, ox, oy, 0); nc.fill();
      const y0 = oy + p.y, gy = nc.createLinearGradient(0, y0, 0, y0 + p.L);
      gy.addColorStop(0, nT); gy.addColorStop(0.08, "rgba(128,128,255,0)"); gy.addColorStop(0.92, "rgba(128,128,255,0)"); gy.addColorStop(1, nB);
      nc.fillStyle = gy; nc.fill();
    }
  }
  /* fine cross-checks and vertical cracks */
  cc.lineWidth = 1; nc.lineWidth = 1.2;
  for (let i = 0; i < 300; i++){
    const x = r() * BW, y = r() * BH, horiz = r() < 0.35, L = horiz ? 4 + r() * 8 : 8 + r() * 30;
    const x2 = horiz ? x + L : x + (r() - 0.5) * 5, y2 = horiz ? y + (r() - 0.5) * 3 : y + L;
    cc.strokeStyle = "rgba(38,33,29," + (0.3 + r() * 0.4).toFixed(2) + ")";
    cc.beginPath(); cc.moveTo(x, y); cc.lineTo(x2, y2); cc.stroke();
    nc.strokeStyle = horiz ? nT : (r() < 0.5 ? nL : nR);
    nc.beginPath(); nc.moveTo(x, y); nc.lineTo(x2, y2); nc.stroke();
  }
  const noise = noiseCanvas(core, 77);
  cc.save(); cc.globalCompositeOperation = "soft-light"; cc.globalAlpha = 0.6; cc.drawImage(noise, 0, 0, BW, BH / 2); cc.drawImage(noise, 0, BH / 2, BW, BH / 2); cc.restore();
  return {col, nm: nor};
}

/* ------------------------------------------------------------------ shaders */
const ALPHA_CODE = `
#ifdef USE_ALPHAMAP
  vec2 vegG = vUv * ${AT.toFixed(1)};
  vec2 vegDx = dFdx( vegG ), vegDy = dFdy( vegG );
  float vegLod = max( 0.0, 0.5 * log2( max( dot( vegDx, vegDx ), dot( vegDy, vegDy ) ) ) - VEG_BIAS );
  diffuseColor.a *= texture2D( alphaMap, vUv, - VEG_BIAS ).g * ( 1.0 + vegLod * 0.3 );
#endif`;
/* cards seen nearly edge-on read as streaks: thin them out using the true (flat) face normal */
const EDGE_CODE = `
  vec3 vegFN = normalize( cross( dFdx( vViewPosition ), dFdy( vViewPosition ) ) );
  diffuseColor.a *= smoothstep( 0.05, 0.3, abs( dot( vegFN, normalize( vViewPosition ) ) ) );`;
/* crown occlusion: always on ambient; on direct sun only partly where the shadow map already self-shadows the crown,
   fully outside the sun's shadow frustum (backdrop trees far from the house) */
const AO_CODE = `
  float vegIn = 0.0;
  #if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
    vec3 vegSC = vDirectionalShadowCoord[ 0 ].xyz / vDirectionalShadowCoord[ 0 ].w;
    vegIn = smoothstep( 0.0, 0.06, min( min( vegSC.x, 1.0 - vegSC.x ), min( vegSC.y, 1.0 - vegSC.y ) ) ) * step( vegSC.z, 1.0 );
  #endif
  float vegDA = mix( 1.0, vegDirAO, vegIn );
  float vegAOd = mix( vLeafAO * min( vLeafAO, 1.0 ), vLeafAO, vegIn );
  reflectedLight.indirectDiffuse *= vegAmb * vLeafAO * mix( vegBounce, vec3( 1.0 ), clamp( vLeafAO, 0.0, 1.0 ) );
  reflectedLight.indirectSpecular *= vLeafAO * vLeafAO * vegSpec;
  reflectedLight.directDiffuse *= mix( 1.0, vegAOd, vegDA );
  reflectedLight.directSpecular *= mix( 1.0, vegAOd, vegDA ) * vLeafAO * vegSpec;`;
const TRANS_CODE = `
void RE_Direct_Veg( const in IncidentLight directLight, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
  RE_Direct_Physical( directLight, geometry, material, reflectedLight );
  float vegBack = saturate( - dot( geometry.normal, directLight.direction ) );
  float vegFwd = pow( saturate( dot( geometry.viewDir, - directLight.direction ) ), 5.0 );
  vec3 vegTint = material.diffuseColor * vec3( 1.0, 1.15, 0.55 );
  reflectedLight.directDiffuse += directLight.color * vegTint * vegTrans * ( 0.4 * vegBack + 1.5 * vegFwd );
}
#undef RE_Direct
#define RE_Direct RE_Direct_Veg`;

function patchMaterial(THREE, m, leaf, trans, dirAO, key){
  m.onBeforeCompile = function(sh){
    sh.uniforms.vegTrans = {value: trans};
    sh.uniforms.vegDirAO = {value: dirAO};
    sh.uniforms.vegSpec = {value: leaf ? 0.55 : 1.0};
    sh.uniforms.vegAmb = {value: leaf ? 1.6 : 1.15};
    sh.uniforms.vegBounce = {value: leaf ? new THREE.Vector3(1.15, 1.3, 0.72) : new THREE.Vector3(1.0, 1.05, 0.85)};
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\nattribute float leafAO;\nvarying float vLeafAO;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvLeafAO = leafAO;");
    let fs = sh.fragmentShader
      .replace("#include <common>", "#include <common>\nvarying float vLeafAO;\nuniform float vegTrans;\nuniform float vegDirAO;\nuniform float vegSpec;\nuniform vec3 vegBounce;\nuniform float vegAmb;")
      .replace("#include <aomap_fragment>", "#include <aomap_fragment>\n" + AO_CODE);
    if (leaf){
      fs = "#define VEG_BIAS 0.6\n" + fs
        .replace("#include <map_fragment>", THREE.ShaderChunk.map_fragment.replace("texture2D( map, vUv )", "texture2D( map, vUv, - VEG_BIAS )"))
        .replace("#include <normal_fragment_begin>", THREE.ShaderChunk.normal_fragment_begin.replace("normal = normal * faceDirection;", ""))
        .replace("#include <normal_fragment_maps>", THREE.ShaderChunk.normal_fragment_maps.replace("perturbNormal2Arb( -vViewPosition, normal, mapN, faceDirection )", "perturbNormal2Arb( -vViewPosition, normal, mapN, 1.0 )"))
        .replace("#include <alphamap_fragment>", ALPHA_CODE + EDGE_CODE)
        .replace("#include <lights_physical_pars_fragment>", "#include <lights_physical_pars_fragment>\n" + TRANS_CODE);
    }
    sh.fragmentShader = fs;
  };
  m.customProgramCacheKey = function(){ return "veg-" + key; };
  return m;
}
function patchDepth(m, key){
  m.onBeforeCompile = function(sh){ sh.fragmentShader = "#define VEG_BIAS 0.0\n" + sh.fragmentShader.replace("#include <alphamap_fragment>", ALPHA_CODE); };
  m.customProgramCacheKey = function(){ return "vegd-" + key; };
  m.extensions = {derivatives: true};
  return m;
}

/* ------------------------------------------------------------------ species */
const BARK = {
  pine: [0.74, 0.66, 0.62], hemlock: [0.86, 0.7, 0.6], oak: [0.92, 0.9, 0.86], shrub: [0.72, 0.66, 0.58],
  maple: [0.66, 0.5, 0.5], rose: [0.8, 0.78, 0.72], hydrangea: [0.74, 0.7, 0.58]
};
const ATLAS_OF = {pine: "conifer", hemlock: "conifer", oak: "broadleaf", shrub: "broadleaf", maple: "broadleaf", rose: "flower", hydrangea: "flower"};
const DEFAULT_SIZE = {pine: 52, hemlock: 32, oak: 44, shrub: 4, maple: 5, rose: 8, hydrangea: 3.5};
const uvr = (k, r) => cellUV(k, r() < 0.5);

/* eastern white pine: tall clear trunk, irregular whorls of near-horizontal limbs that sweep up at the tips,
   foliage in soft tufts at the branchlet ends, dead stubs below the crown */
function genPine(S, H, r){
  const W = S.wood, F = S.leaf, D = S.density;
  const R0 = H * (0.016 + r() * 0.004), lean = [(r() - 0.5) * 0.03, (r() - 0.5) * 0.03], ph = [r() * TAU, r() * TAU];
  const trunkAt = y => { const t = y / H; return [lean[0] * y + Math.sin(t * 4.5 + ph[0]) * 0.3 * t, y, lean[1] * y + Math.sin(t * 3.7 + ph[1]) * 0.3 * t]; };
  const radAt = y => Math.max(0.05, R0 * (1 - 0.88 * Math.pow(y / H, 0.85)) + R0 * 0.55 * Math.exp(-Math.max(0, y) / 0.9));
  const cb = H * (0.34 + r() * 0.1);
  const Lmax = H * (0.22 + r() * 0.05);
  const env = t => Math.pow(1 - t, 0.8) * (0.5 + 0.5 * sstep(0, 0.3, t)) + 0.05;
  const sp = [], rd = [], nS = Math.ceil(H / 1.5);
  for (let i = 0; i <= nS; i++){ const y = i / nS * H * 0.985; sp.push(trunkAt(y)); rd.push(radAt(y)); }
  sp[0] = [sp[0][0], -0.4, sp[0][2]];
  const aoWood = p => p[1] < cb ? 0.9 : 0.55;
  W.tube(sp, rd, 9, BARK.pine, aoWood);
  for (let y = 4 + r() * 3; y < cb + 2; y += 1.2 + r() * 1.8){
    const k = 1 + (r() < 0.4 ? 1 : 0);
    for (let j = 0; j < k; j++){
      const L = 0.5 + r() * 2.6 * (y / cb), p0 = trunkAt(y);
      const pts = grow(p0, dirAE(r() * TAU, -0.2 + r() * 0.35), L, 2, null);
      W.tube(pts, [Math.min(0.12, radAt(y) * 0.22), 0.05, 0.015], 4, BARK.pine, () => 0.75);
    }
  }
  const pads = [];
  let y = cb;
  while (y < H - 1.2){
    const t = (y - cb) / (H - cb), nb = 2 + ((r() * 3) | 0), az0 = r() * TAU;
    for (let k = 0; k < nb; k++){
      if (r() < 0.12 + 0.25 * (1 - t)) continue;
      const az = az0 + k * TAU / nb + (r() - 0.5) * 0.9;
      let L = Lmax * env(t) * (0.6 + 0.65 * r());
      if (r() < 0.14 && t < 0.6) L *= 1.35;
      L = Math.max(L, 1.3);
      const el0 = lerp(-0.1, 0.5, t) + (r() - 0.5) * 0.25, p0 = trunkAt(y);
      const pts = grow(p0, dirAE(az, el0), L, 5, (s, d) => add(d, [0, s < 0.55 ? -0.07 * (1 - t) : 0.13, 0]));
      const rb = clamp(0.06 + L * 0.018, 0.06, radAt(y) * 0.55);
      W.tube(pts, pts.map((_, i) => lerp(rb, 0.025, i / (pts.length - 1))), 5, BARK.pine, aoWood);
      const bf = along3(pts);
      let side = r() < 0.5 ? 1 : -1;
      for (let s = 0.34 + r() * 0.12; s < 0.95; s += (0.95 + r() * 0.6) / L){
        side = -side;
        const q = bf(s), hd = nrm([q.d[0], 0, q.d[2]]);
        const bd = nrm(add(rotate(hd, UP, side * (0.6 + r() * 0.5)), [0, 0.12 + r() * 0.2, 0]));
        const bl = Math.min(3.4, 0.8 + L * (1 - s) * (0.3 + 0.25 * r()));
        const bp = grow(q.p, bd, bl, 2, null);
        W.tube(bp, [0.04, 0.03, 0.015], 3, BARK.pine, aoWood);
        pads.push({c: mad(bp[2], bd, -bl * 0.2), d: bd, pr: 0.95 + bl * 0.33 + r() * 0.35, t});
      }
      const tip = pts[pts.length - 1];
      pads.push({c: tip, d: nrm(sub(tip, pts[pts.length - 2])), pr: 1.3 + r() * 0.6, t});
    }
    y += 1.4 + r() * 1.5;
  }
  const top = trunkAt(H * 0.985);
  pads.push({c: add(top, [0, 0.2, 0]), d: UP, pr: 1.2, t: 1});
  pads.push({c: add(top, [0, -1.0, 0]), d: UP, pr: 1.5, t: 1});
  for (const pd of pads){
    const n = Math.max(3, Math.round((2 + pd.pr * pd.pr * 3.0) * D));
    const k = 0.9 + r() * 0.2, hue = (r() - 0.5) * 0.1, tint = [k * (1 + hue), k, k * (1 - hue)];
    const ty = pd.t, ctr = trunkAt(pd.c[1]);
    const rel = Math.hypot(pd.c[0] - ctr[0], pd.c[2] - ctr[2]) / (Lmax * env(clamp(ty, 0, 1)) + 1.5);
    const ao = lerp(0.55, 1.0, sstep(0.05, 0.85, rel)) * lerp(0.88, 1.05, ty);
    const vc = [pd.c[0], pd.c[1] - pd.pr * 0.55, pd.c[2]], vr = [pd.pr * 1.3, pd.pr * 1.0, pd.pr * 1.3];
    const cy = pd.c[1], pr = pd.pr;
    const aoFn = v => clamp(0.8 + 0.5 * (v[1] - cy) / pr, 0.55, 1.12);
    for (let i = 0; i < n; i++){
      const q = inBall(r), p = [pd.c[0] + q[0] * pr, pd.c[1] + q[1] * pr * 0.5, pd.c[2] + q[2] * pr];
      const up = nrm(add(add(pd.d, mul(sph(r), 0.9)), [0, 0.45, 0]));
      const face = nrm(add(sph(r), [0, 0.35, 0]));
      const sz = 2.0 + r() * 1.0;
      F.card(p, up, face, sz, sz, 0.3, uvr(r() < 0.55 ? 0 : 1, r), tint, ao, vc, vr, 0.6, aoFn);
    }
  }
}

/* eastern hemlock: dense cone of slender drooping limbs to near the ground, flat sprays, nodding leader */
function genHemlock(S, H, r){
  const W = S.wood, F = S.leaf, D = S.density;
  const R0 = H * (0.017 + r() * 0.003), ph = [r() * TAU, r() * TAU], nodAz = r() * TAU;
  const trunkAt = y => {
    const t = y / H, nod = Math.max(0, y - (H - 2.6)) / 2.6;
    return [Math.sin(t * 3.1 + ph[0]) * 0.2 * t + Math.cos(nodAz) * nod * nod * 1.1, y - nod * nod * 0.5, Math.sin(t * 2.7 + ph[1]) * 0.2 * t + Math.sin(nodAz) * nod * nod * 1.1];
  };
  const radAt = y => Math.max(0.03, R0 * (1 - 0.95 * Math.pow(y / H, 0.9)) + R0 * 0.45 * Math.exp(-Math.max(0, y) / 0.8));
  const sp = [], rd = [], nS = Math.ceil(H / 1.2);
  for (let i = 0; i <= nS; i++){ const y = i / nS * H; sp.push(trunkAt(y)); rd.push(radAt(y)); }
  sp[0] = [sp[0][0], -0.4, sp[0][2]];
  W.tube(sp, rd, 8, BARK.hemlock, p => lerp(0.55, 0.8, p[1] / H));
  const Lmax = H * (0.28 + r() * 0.06);
  const env = t => Math.pow(1 - t, 0.9) * (0.84 + 0.16 * sstep(0, 0.12, t)) + 0.04;
  const vc = [0, H * 0.3, 0], vr = [Lmax * 1.1, H * 0.62, Lmax * 1.1];
  let y = 0.8 + r() * 0.8, az = r() * TAU;
  while (y < H - 0.4){
    const t = y / H;
    az += 2.4 + (r() - 0.5) * 0.7;
    if (r() < 0.06){ y += 0.3 + r() * 0.4; continue; }
    const L = Lmax * env(t) * (0.65 + 0.6 * r()) + 0.5;
    const el0 = lerp(-0.12, 0.5, t) + (r() - 0.5) * 0.3, p0 = trunkAt(y);
    const pts = grow(p0, dirAE(az, el0), L, 5, (s, d) => add(d, [0, -0.03 - (0.08 + 0.12 * (1 - t)) * s * s, 0]));
    const rb = clamp(0.035 + L * 0.014, 0.035, radAt(y) * 0.5);
    W.tube(pts, pts.map((_, i) => lerp(rb, 0.018, i / (pts.length - 1))), 4, BARK.hemlock, () => 0.5);
    const bf = along3(pts), step = 0.3 / Math.max(L, 0.5);
    for (let s = Math.min(0.4, 0.3 / L); s <= 1.0001; s += step){
      const q = bf(s), ctr = trunkAt(q.p[1]);
      const rel = Math.hypot(q.p[0] - ctr[0], q.p[2] - ctr[2]) / (Lmax * env(clamp(q.p[1] / H, 0, 1)) + 0.5);
      const ao = lerp(0.5, 1.0, sstep(0.05, 0.95, rel)) * lerp(0.82, 1.04, t);
      const k0 = 0.92 + r() * 0.18, tint = [k0, k0 * (1 + (r() - 0.5) * 0.06), k0];
      const nC = 3 + (r() < 0.3 * D ? 1 : 0);
      for (let k = 0; k < nC; k++){
        const sd = k >= 2 ? (r() - 0.5) : (k ? 1 : -1);
        let up = rotate(q.d, UP, sd * (0.35 + r() * 0.6));
        up = nrm(add(add(up, mul(sph(r), 0.55)), [0, -0.1 - 0.3 * s + (k >= 2 ? 0.35 : 0), 0]));
        const face = nrm(add(sph(r), mul(UP, 0.4)));
        const sz = (1.6 + r() * 0.8) * (0.7 + 0.3 * Math.min(1, L / 3));
        F.card(mad(q.p, sph(r), 0.15), up, face, sz, sz, 0.08, uvr(r() < 0.5 ? 2 : 3, r), tint, ao, vc, vr, 0.5, null);
      }
    }
    y += (0.3 + r() * 0.28) / Math.sqrt(D);
  }
  for (let i = 0; i < 7; i++){
    const p = trunkAt(H - 2.8 + i * 0.42);
    F.card(p, nrm(add(UP, mul(sph(r), 0.5))), sph(r), 1.1, 1.2, 0.4, uvr(2 + (i & 1), r), [1.05, 1.05, 1], 1, vc, vr, 0.5, null);
  }
}

/* oak / maple: short trunk forking into scaffold limbs that branch (lateral + terminal children) inside a broad crown
   ellipsoid; leaf clumps are sampled over the outer crown shell (with a few deliberate sky holes) and tied to the nearest
   limb by a twig, so the canopy is full and rounded but never a ball. Leaf species by seed: lobed oak or palmate maple. */
function genOak(S, H, r){
  const W = S.wood, F = S.leaf, D = S.density;
  const leafCell = r() < 0.55 ? 0 : 1;
  const R0 = H * (0.019 + r() * 0.004);
  const hb = H * (0.2 + r() * 0.14);
  const lean = [(r() - 0.5) * H * 0.1, (r() - 0.5) * H * 0.1];
  const cr = {c: [lean[0], lerp(hb, H, 0.47), lean[1]], r: [H * (0.3 + r() * 0.2), (H - hb) * (0.46 + r() * 0.08), 0]};
  cr.r[2] = cr.r[0] * (0.8 + r() * 0.35);
  const aoAt = p => { const e = ellDist(p, cr.c, cr.r); return lerp(0.5, 1.0, sstep(0.4, 1.0, e)) * lerp(0.8, 1.05, sstep(cr.c[1] - cr.r[1], cr.c[1] + cr.r[1], p[1])); };
  const trunk = grow([0, -0.4, 0], [lean[0] / H * 0.8 + (r() - 0.5) * 0.06, 1, lean[1] / H * 0.8 + (r() - 0.5) * 0.06], hb + 0.4 + 1.5, 6, (s, d) => add(d, mul(sph(r), 0.04)));
  const tPts = trunk.concat([mad(trunk[6], nrm(sub(trunk[6], trunk[5])), R0 * 0.6)]);
  W.tube(tPts, tPts.map((p, i) => i === 7 ? R0 * 0.3 : R0 * (1 - 0.3 * Math.pow(i / 6, 1.5)) + R0 * 0.5 * Math.exp(-Math.max(0, p[1]) / 0.8)), 10, BARK.oak, p => lerp(0.85, 0.6, sstep(0, hb + 2, p[1])));
  const fork = trunk[4];
  const nodes = [];
  const MAXD = 3, KIDS = [[0.3, 0.5, 0.7, 1, 1], [0.5, 1, 1], [1, 1]];
  function limb(p0, d, L, rad, depth){
    const nseg = depth < 2 ? 5 : 3;
    const pts = grow(p0, d, L, nseg, (s, dd) => add(dd, add(mul(sph(r), 0.12), [0, 0.03, 0])));
    const rads = pts.map((_, i) => lerp(rad, rad * 0.62, i / nseg));
    W.tube(pts, rads, depth < 1 ? 8 : depth < 3 ? 5 : 3, BARK.oak, aoAt);
    for (let i = 1; i < pts.length; i++) if (depth >= 1 || i > nseg / 2) nodes.push({p: pts[i], r: rads[i]});
    if (depth >= MAXD) return;
    const f = along3(pts), end = pts[nseg];
    for (const s0 of KIDS[depth]){
      const s = s0 >= 1 ? 1 : s0 + (r() - 0.5) * 0.12, q = s >= 1 ? {p: end, d: d} : f(s);
      const out = nrm([q.p[0] - cr.c[0] + 1e-3, 0, q.p[2] - cr.c[2]]);
      let nd = rotate(q.d, nrm(cross(q.d, sph(r))), (s >= 1 ? 0.3 : 0.65) + r() * 0.4);
      nd = nrm(add(add(nd, mul(out, 0.4)), [0, 0.12, 0]));
      const room = roomTo(q.p, nd, cr.c, cr.r);
      if (room < 1.2) continue;
      const nl = Math.min(L * (s >= 1 ? 0.72 : 0.64) * (0.85 + r() * 0.3), room * (0.55 + 0.25 * r()));
      limb(q.p, nd, nl, rad * (s >= 1 ? 0.66 : 0.5), depth + 1);
    }
  }
  const nS = 3 + ((r() * 1.6) | 0), az0 = r() * TAU;
  for (let k = 0; k < nS; k++){
    const az = az0 + k * TAU / nS + (r() - 0.5) * 0.7, el = 0.7 + r() * 0.45;
    const d = dirAE(az, el), L = (H - hb) * (0.3 + r() * 0.08);
    limb(fork, d, Math.min(L, roomTo(fork, d, cr.c, cr.r) * 0.5), R0 * 0.5, 0);
  }
  limb(trunk[5], nrm([(r() - 0.5) * 0.3, 1, (r() - 0.5) * 0.3]), (H - hb) * 0.38, R0 * 0.5, 1);

  /* leaf clumps over the crown shell */
  const holes = []; for (let k = 0; k < 7; k++){ const d = sph(r); holes.push({d: nrm([d[0], d[1] * 0.6, d[2]]), c: 0.93 + r() * 0.04}); }
  const ravg = (cr.r[0] + cr.r[1] + cr.r[2]) / 3, nC = Math.round(4 * Math.PI * ravg * ravg / 26 * Math.sqrt(D));
  const tintBase = leafCell === 0 ? [1, 1, 1] : [1.02, 1.03, 0.98];
  let made = 0, tries = 0;
  while (made < nC && tries++ < nC * 6){
    let d = sph(r);
    if (d[1] < -0.35 && r() < 0.7) continue;            /* fewer clumps on the crown underside */
    let hole = false; for (const h of holes) if (dot(d, h.d) > h.c){ hole = true; break; }
    if (hole) continue;
    const e = 0.64 + 0.36 * Math.pow(r(), 0.6);
    const c = [cr.c[0] + d[0] * cr.r[0] * e, cr.c[1] + d[1] * cr.r[1] * e, cr.c[2] + d[2] * cr.r[2] * e];
    if (c[1] < hb + 1.5) continue;
    let best = null, bd = 1e9;
    for (const nd of nodes){ const q = sub(c, nd.p), dd = dot(q, q) - nd.r * 40; if (dd < bd){ bd = dd; best = nd; } }
    if (!best) break;
    let tw = sub(c, best.p), tl = vlen(tw);
    if (tl > 4.5){ tw = mul(tw, 4.5 / tl); tl = 4.5; c[0] = best.p[0] + tw[0]; c[1] = best.p[1] + tw[1]; c[2] = best.p[2] + tw[2]; }
    if (tl > 0.6) W.tube([best.p, add(vlerp(best.p, c, 0.5), [0, tl * 0.08, 0]), c], [Math.min(0.07, best.r * 0.6), 0.035, 0.018], 3, BARK.oak, aoAt);
    made++;
    const R = 2.3 + r() * 1.3, n = Math.max(5, Math.round(R * R * 2.2 * Math.sqrt(D)));
    const cd = tl > 0.3 ? mul(tw, 1 / tl) : d;
    const vc = vlerp(c, cr.c, 0.3), vr = [R * 1.7, R * 1.5, R * 1.7];
    const k0 = 0.9 + r() * 0.22, hue = (r() - 0.5) * 0.12, tint = [tintBase[0] * k0 * (1 + hue), tintBase[1] * k0, tintBase[2] * k0 * (1 - hue)];
    const out = nrm(sub(c, cr.c));
    for (let i = 0; i < n; i++){
      const q = inBall(r), p = [c[0] + q[0] * R, c[1] + q[1] * R * 0.75, c[2] + q[2] * R];
      const up = nrm(add(add(cd, mul(sph(r), 1.0)), [0, 0.35, 0]));
      const face = nrm(add(sph(r), mul(out, 0.6)));
      const sz = 2.1 + r() * 0.9;
      F.card(p, up, face, sz, sz, 0.25, uvr(leafCell, r), tint, aoAt(p), vc, vr, 0.62, null);
    }
  }
}

/* rounded foundation shrub (azalea / boxwood) */
function genShrub(S, H, r){
  const W = S.wood, F = S.leaf, D = S.density;
  const rx = H * (0.48 + r() * 0.12), rz = rx * (0.85 + r() * 0.25), ry = H * 0.46, c = [0, H * 0.47, 0];
  const bumps = []; for (let k = 0; k < 6; k++) bumps.push({d: sph(r), a: 0.06 + r() * 0.1});
  const bump = d => { let m = 1; for (const b of bumps) m += b.a * Math.pow(Math.max(0, dot(d, b.d)), 3); return m; };
  for (let k = 0; k < 7; k++){
    const az = r() * TAU, pts = grow([(r() - 0.5) * 0.3, -0.1, (r() - 0.5) * 0.3], dirAE(az, 0.9 + r() * 0.4), H * 0.55, 3, (s, d) => add(d, mul(sph(r), 0.15)));
    W.tube(pts, [0.05, 0.04, 0.03, 0.02], 4, BARK.shrub, () => 0.35);
  }
  const area = 4 * Math.PI * Math.pow((Math.pow(rx * ry, 1.6) + Math.pow(rx * rz, 1.6) + Math.pow(ry * rz, 1.6)) / 3, 1 / 1.6);
  const n = Math.round(area * 13 * D);
  const vc = [0, H * 0.32, 0], vr = [rx, ry * 1.15, rz];
  for (let i = 0; i < n; i++){
    let d = sph(r); if (d[1] < -0.55) d = nrm([d[0], -d[1] * 0.4, d[2]]);
    const k = 1 - 0.28 * Math.pow(r(), 1.8), m = bump(d) * k;
    const p = [c[0] + d[0] * rx * m, Math.max(0.12 + r() * 0.15, c[1] + d[1] * ry * m), c[2] + d[2] * rz * m];
    const face = nrm(add(d, mul(sph(r), 0.5)));
    const up = nrm(add(cross(face, perp(face)), add(mul(sph(r), 0.8), [0, 0.6, 0])));
    const sz = (0.68 + r() * 0.2) * Math.min(1.2, Math.max(0.8, H / 4));
    const ao = lerp(0.38, 1.0, sstep(0.66, 1.0, k)) * lerp(0.6, 1.0, sstep(0.1, H * 0.55, p[1]));
    const kk = 0.9 + r() * 0.18;
    F.card(p, up, face, sz, sz, 0.3, uvr(2, r), [kk, kk, kk * (0.95 + r() * 0.1)], ao, vc, vr, 0.8, null);
  }
}

/* lace-leaf Japanese maple: low weeping mound of arching limbs cascading to the ground */
function genMaple(S, H, r){
  const W = S.wood, F = S.leaf, D = S.density;
  const Wd = H * (0.75 + r() * 0.2), top0 = [0, 0.9, 0];
  W.tube([[0, -0.2, 0], [0.05, 0.5, 0], top0], [0.2, 0.17, 0.14], 6, BARK.maple, () => 0.4);
  const vc = [0, H * 0.15, 0], vr = [Wd * 1.05, H * 1.05, Wd * 1.05];
  const aoAt = p => lerp(0.4, 1.0, sstep(0.45, 1.0, ellDist(p, [0, 0, 0], [Wd, H, Wd]))) * lerp(0.65, 1.0, sstep(0, H * 0.5, p[1]));
  const bez = (a, b, c, d, t) => { const u = 1 - t; return [0, 1, 2].map(i => u * u * u * a[i] + 3 * u * u * t * b[i] + 3 * u * t * t * c[i] + t * t * t * d[i]); };
  const arches = [];
  const nB = 7 + ((r() * 3) | 0), az0 = r() * TAU;
  for (let k = 0; k < nB; k++){
    const az = az0 + k * TAU / nB + (r() - 0.5) * 0.5, dir = [Math.cos(az), 0, Math.sin(az)];
    const pk = H * (0.72 + r() * 0.28), pd = Wd * (0.25 + r() * 0.2), ed = Wd * (0.82 + r() * 0.22), eh = H * (0.12 + r() * 0.3);
    const P = [top0, [dir[0] * pd * 0.25, pk * 1.05, dir[2] * pd * 0.25], [dir[0] * pd * 1.5, pk * 1.08, dir[2] * pd * 1.5], [dir[0] * ed, eh, dir[2] * ed]];
    const pts = []; for (let i = 0; i <= 8; i++) pts.push(bez(P[0], P[1], P[2], P[3], i / 8));
    arches.push({pts, dir});
    W.tube(pts, pts.map((_, i) => lerp(0.1, 0.02, i / 8)), 4, BARK.maple, aoAt);
    for (let j = 0; j < 2; j++){
      const s0 = 0.35 + r() * 0.25, q = along3(pts)(s0), sdir = nrm(add(dir, mul(perp(dir), (r() - 0.5) * 1.6)));
      const l2 = Wd * (0.3 + r() * 0.25), P2 = [q.p, add(q.p, [sdir[0] * l2 * 0.4, H * 0.12, sdir[2] * l2 * 0.4]), add(q.p, [sdir[0] * l2, H * 0.05, sdir[2] * l2]), [q.p[0] + sdir[0] * l2 * 1.3, Math.max(0.2, q.p[1] - H * 0.4), q.p[2] + sdir[2] * l2 * 1.3]];
      const p2 = []; for (let i = 0; i <= 5; i++) p2.push(bez(P2[0], P2[1], P2[2], P2[3], i / 5));
      arches.push({pts: p2, dir: sdir});
      W.tube(p2, p2.map((_, i) => lerp(0.04, 0.015, i / 5)), 3, BARK.maple, aoAt);
    }
  }
  for (const ar of arches){
    const f = along3(ar.pts), L = vlen(sub(ar.pts[ar.pts.length - 1], ar.pts[0])) + 0.5;
    for (let s = 0.2; s <= 1.0001; s += 0.2 / L){
      const q = f(s);
      const nC = 2 + (r() < 0.4 * D ? 1 : 0);
      for (let k = 0; k < nC; k++){
        const p = add(q.p, mul(inBall(r), 0.4));
        const up = nrm(add(add([0, -1, 0], mul(ar.dir, 0.45 + 0.4 * (1 - s))), mul(sph(r), 0.45)));
        const face = nrm(add(add(ar.dir, mul(sph(r), 0.7)), [0, 0.35, 0]));
        const sz = 0.7 + r() * 0.3;
        if (p[1] - sz < 0.05 || (s > 0.8 && r() < 0.5)) continue;
        const kk = 0.86 + r() * 0.26;
        F.card(p, up, face, sz, sz * 1.05, 0.06, uvr(3, r), [kk, kk * 0.96, kk * 0.96], aoAt(p), vc, vr, 0.6, null);
      }
    }
  }
  const nf = Math.round(Wd * Wd * 22 * D);
  for (let i = 0; i < nf; i++){
    let d = sph(r); d = nrm([d[0], Math.abs(d[1]) * 1.1 + 0.08, d[2]]);
    const k = 0.8 + 0.22 * Math.pow(r(), 0.7), sk = 1 + 0.12 * (1 - d[1]);
    const p = [d[0] * Wd * k * sk, d[1] * H * k, d[2] * Wd * k * sk];
    if (p[1] < 0.3) continue;
    const out = nrm([d[0], 0, d[2]]);
    const tan = nrm(sub(mul(out, d[1]), mul(UP, Math.hypot(d[0], d[2]))));     /* down the dome surface */
    const up = nrm(add(add(tan, [0, -0.35, 0]), mul(sph(r), 0.35)));
    const face = nrm(add(d, mul(sph(r), 0.45)));
    const kk = 0.86 + r() * 0.26, sz = 0.8 + r() * 0.3;
    F.card(p, up, face, sz, sz * 1.05, 0.12, uvr(3, r), [kk, kk * 0.96, kk * 0.96], aoAt(p), vc, vr, 0.68, null);
  }
}

/* rose of sharon (hibiscus syriacus): upright vase of many stems, leafy to the top, pink flowers scattered */
function genRose(S, H, r){
  const W = S.wood, F = S.leaf, D = S.density;
  const vc = [0, H * 0.58, 0], vr = [H * 0.26, H * 0.52, H * 0.26];
  const aoAt = p => lerp(0.4, 1.0, sstep(0.35, 1.0, ellDist(p, vc, vr))) * lerp(0.65, 1.0, sstep(0.5, H * 0.6, p[1]));
  const nS = 16 + ((r() * 6) | 0), stems = [];
  for (let k = 0; k < nS; k++){
    const az = r() * TAU, lean = 0.03 + r() * 0.17, b = [Math.cos(az) * 0.25 * r(), -0.2, Math.sin(az) * 0.25 * r()];
    const out = [Math.cos(az), 0, Math.sin(az)];
    const L = H * (0.72 + r() * 0.3) / Math.cos(lean);
    const pts = grow(b, dirAE(az, Math.PI / 2 - lean), L, 6, (s, d) => add(d, add(mul(out, 0.02), mul(sph(r), 0.04))));
    W.tube(pts, pts.map((_, i) => lerp(0.07, 0.02, i / 6)), 4, BARK.rose, aoAt);
    stems.push({pts, from: 0.3});
    const nsh = 2 + ((r() * 3) | 0), f = along3(pts);
    for (let j = 0; j < nsh; j++){
      const q = f(0.45 + r() * 0.45), sd = nrm(add(rotate(q.d, nrm(cross(q.d, sph(r))), 0.5 + r() * 0.3), mul(out, 0.3)));
      const sp = grow(q.p, sd, 0.6 + r() * 1.0, 3, null);
      W.tube(sp, [0.03, 0.025, 0.02, 0.012], 3, BARK.rose, aoAt);
      stems.push({pts: sp, from: 0.1});
    }
  }
  for (const st of stems){
    const f = along3(st.pts), L = vlen(sub(st.pts[st.pts.length - 1], st.pts[0])) + 0.3;
    for (let s = st.from; s <= 1.0001; s += 0.26 / L){
      const q = f(s), nC = 2 + (r() < 0.4 * D ? 1 : 0);
      for (let k = 0; k < nC; k++){
        const p = add(q.p, mul(inBall(r), 0.45));
        const up = nrm(add(q.d, mul(sph(r), 0.9)));
        const face = nrm(add(sph(r), mul(nrm([p[0], 0, p[2]]), 0.6)));
        const sz = 0.85 + r() * 0.3;
        const cell = r() < 0.3 ? 0 : 1;
        const kk = 0.9 + r() * 0.18;
        F.card(p, up, face, sz, sz, 0.1, uvr(cell, r), [kk, kk, kk], aoAt(p), vc, vr, 0.5, null);
      }
    }
  }
}

/* hydrangea: low mound of big leaves topped with pale blue/white mophead flowers */
function genHydrangea(S, H, r){
  const W = S.wood, F = S.leaf, D = S.density;
  const rx = H * (0.5 + r() * 0.1), rz = rx * (0.9 + r() * 0.2), ry = H * 0.45, c = [0, H * 0.43, 0];
  const vc = [0, H * 0.3, 0], vr = [rx, ry * 1.15, rz];
  for (let k = 0; k < 8; k++){
    const pts = grow([(r() - 0.5) * 0.3, -0.1, (r() - 0.5) * 0.3], dirAE(r() * TAU, 0.8 + r() * 0.5), H * 0.6, 3, (s, d) => add(d, mul(sph(r), 0.15)));
    W.tube(pts, [0.05, 0.04, 0.03, 0.02], 4, BARK.hydrangea, () => 0.35);
  }
  const area = 4 * Math.PI * Math.pow((Math.pow(rx * ry, 1.6) + Math.pow(rx * rz, 1.6) + Math.pow(ry * rz, 1.6)) / 3, 1 / 1.6);
  const n = Math.round(area * 4.2 * D);
  for (let i = 0; i < n; i++){
    let d = sph(r); if (d[1] < -0.5) d = nrm([d[0], -d[1] * 0.4, d[2]]);
    const k = 1 - 0.35 * Math.pow(r(), 1.5);
    const p = [c[0] + d[0] * rx * k, Math.max(0.15, c[1] + d[1] * ry * k), c[2] + d[2] * rz * k];
    const up = nrm(add(add(d, mul(sph(r), 0.8)), [0, 0.6, 0]));
    const face = nrm(add(d, mul(sph(r), 0.7)));
    const ao = lerp(0.4, 1.0, sstep(0.66, 1.0, k)) * lerp(0.6, 1.0, sstep(0.1, H * 0.55, p[1]));
    const kk = 0.9 + r() * 0.16;
    F.card(p, up, face, 0.8 + r() * 0.3, 0.85 + r() * 0.3, 0.25, uvr(2, r), [kk, kk, kk], ao, vc, vr, 0.7, null);
  }
  const nH = Math.round(area * 0.55);
  for (let i = 0; i < nH; i++){
    let d = sph(r); if (d[1] < 0.05) d = nrm([d[0], Math.abs(d[1]) + 0.1, d[2]]);
    const k = 0.96 + r() * 0.08, hc = [c[0] + d[0] * rx * k, c[1] + d[1] * ry * k, c[2] + d[2] * rz * k];
    const s = 0.5 + r() * 0.2, hv = [hc[0] - d[0] * 0.12, hc[1] - d[1] * 0.12, hc[2] - d[2] * 0.12];
    const kk = 0.92 + r() * 0.14, tint = [kk, kk, kk];
    const up1 = nrm(add(UP, mul(sph(r), 0.25)));
    const f1 = rotate(nrm([d[0], 0, d[2]]), up1, r() * 0.6);
    for (let j = 0; j < 3; j++) F.card(hc, up1, rotate(f1, up1, j * Math.PI / 3), s, s, 0.5, uvr(3, r), tint, 1.0, hv, [0.4, 0.4, 0.4], 0.85, null);
    F.card(hc, f1, nrm(add(UP, mul(d, 0.3))), s, s, 0.5, uvr(3, r), tint, 1.0, hv, [0.4, 0.4, 0.4], 0.85, null);
  }
}

const GEN = {pine: genPine, hemlock: genHemlock, oak: genOak, shrub: genShrub, maple: genMaple, rose: genRose, hydrangea: genHydrangea};

/* ------------------------------------------------------------------ public */
REAL.veg = {
  create: function(THREE, renderer, opts){
    opts = opts || {};
    const core = REAL.core;
    const density = opts.density == null ? 1 : opts.density, dirAO = opts.dirAO == null ? 0.5 : opts.dirAO;
    const t0 = performance.now(), timing = {}; let tl = t0;
    const lap = k => { const n = performance.now(); timing[k] = Math.round(n - tl); tl = n; };

    const atl = {
      conifer: paintAtlas(core, [pinePainter(0), pinePainter(1), hemlockPainter(0), hemlockPainter(1)], 11),
      broadleaf: null, flower: null
    }; lap("conifer");
    atl.broadleaf = paintAtlas(core, [broadleafPainter("oak"), broadleafPainter("maple"), shrubPainter(), lacePainter()], 23); lap("broadleaf");
    atl.flower = paintAtlas(core, [rosePainter(0), rosePainter(1), hydLeafPainter(), hydFlowerPainter()], 37); lap("flower");
    const bark = paintBark(core); lap("bark");

    const mats = {}, depth = {}, dist = {};
    const leafCfg = {conifer: {rough: 0.7, trans: 0.28, ns: 0.9}, broadleaf: {rough: 0.6, trans: 0.4, ns: 1.0}, flower: {rough: 0.64, trans: 0.42, ns: 0.9}};
    for (const k in atl){
      const a = atl[k], cfg = leafCfg[k];
      const map = core.texture(THREE, a.col, {srgb: true}), alphaMap = core.texture(THREE, a.alp), normalMap = core.texture(THREE, a.nor);
      for (const t of [map, alphaMap, normalMap]) t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
      const m = new THREE.MeshStandardMaterial({map, alphaMap, normalMap, normalScale: new THREE.Vector2(cfg.ns, cfg.ns), roughness: cfg.rough, metalness: 0,
        side: THREE.DoubleSide, alphaTest: 0.5, vertexColors: true});
      m.name = "veg-" + k;
      mats[k] = patchMaterial(THREE, m, true, cfg.trans, dirAO, k);
      depth[k] = patchDepth(new THREE.MeshDepthMaterial({depthPacking: THREE.RGBADepthPacking, alphaMap, alphaTest: 0.5, side: THREE.DoubleSide}), k);
      dist[k] = patchDepth(new THREE.MeshDistanceMaterial({alphaMap, alphaTest: 0.5, side: THREE.DoubleSide}), k + "x");
    }
    const bmap = core.texture(THREE, bark.col, {srgb: true}), bnor = core.texture(THREE, bark.nm);
    mats.bark = patchMaterial(THREE, new THREE.MeshStandardMaterial({map: bmap, normalMap: bnor, normalScale: new THREE.Vector2(1.0, 1.0), roughness: 0.93, metalness: 0, vertexColors: true}), false, 0, dirAO * 0.6, "bark");
    mats.bark.name = "veg-bark";
    lap("materials");
    const buildMs = performance.now() - t0;

    function build(type, size, seed){
      const gen = GEN[type];
      if (!gen) throw new Error("REAL.veg: unknown type '" + type + "'");
      const r = core.rng(((seed == null ? 1 : seed) | 0) * 7919 + (hashStr(type) & 0xffff));
      const S = {wood: new Builder(), leaf: new Builder(), density};
      gen(S, size || DEFAULT_SIZE[type], r);
      return S;
    }
    function meshes(group, W, F, atlas){
      if (W.n){ const m = new THREE.Mesh(W.geometry(THREE), mats.bark); m.name = "wood"; m.castShadow = m.receiveShadow = true; group.add(m); }
      if (F.n){
        const m = new THREE.Mesh(F.geometry(THREE), mats[atlas]); m.name = "foliage";
        m.customDepthMaterial = depth[atlas]; m.customDistanceMaterial = dist[atlas];
        m.castShadow = m.receiveShadow = true; group.add(m);
      }
      return group;
    }
    function make(type, size, seed){
      const S = build(type, size, seed), g = new THREE.Group();
      g.name = "veg-" + type;
      meshes(g, S.wood, S.leaf, ATLAS_OF[type]);
      g.userData.triangles = (S.wood.I.length + S.leaf.I.length) / 3;
      return g;
    }
    function batch(list){
      const wood = new Builder(), leaf = {conifer: new Builder(), broadleaf: new Builder(), flower: new Builder()};
      for (const it of list){
        const S = build(it.type, it.size, it.seed);
        const t = [it.x || 0, it.y || 0, it.z || 0], s = it.scale || 1, rot = it.rot || 0;
        wood.append(S.wood, rot, s, t);
        leaf[ATLAS_OF[it.type]].append(S.leaf, rot, s, t);
      }
      const g = new THREE.Group(); g.name = "veg-batch";
      meshes(g, wood, new Builder(), "conifer");
      for (const k in leaf) if (leaf[k].n) meshes(g, new Builder(), leaf[k], k);
      return g;
    }
    function triangles(o){ let n = 0; o.traverse(m => { if (m.isMesh && m.geometry.index) n += m.geometry.index.count / 3; }); return n; }

    REAL.veg.buildMs = buildMs; REAL.veg.timing = timing;
    return {
      types: Object.keys(GEN),
      samples: [
        {type: "pine", size: 54, seed: 3, label: "white pine 54'", footprint: 24},
        {type: "hemlock", size: 33, seed: 2, label: "hemlock 33'", footprint: 19},
        {type: "oak", size: 46, seed: 3, label: "oak / maple 46'", footprint: 36},
        {type: "shrub", size: 4, seed: 1, label: "azalea 4'", footprint: 5.5},
        {type: "maple", size: 5, seed: 1, label: "lace-leaf maple 5'", footprint: 10},
        {type: "rose", size: 8.5, seed: 1, label: "rose of sharon 8.5'", footprint: 5.5},
        {type: "hydrangea", size: 3.5, seed: 1, label: "hydrangea 3.5'", footprint: 5}
      ],
      make, batch, triangles, materials: mats, buildMs, timing,
      atlases: atl
    };
  }
};
})();
