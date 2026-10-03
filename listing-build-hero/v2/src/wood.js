/* REAL.wood: procedural photoreal lumber for the build.
   REAL.wood.create(THREE, renderer, opts) -> { variants: { spf, pt, lvl, deck, deckDark, lattice } }
   Every variant is { material, sample:[sx,sy,sz] (feet), optional rot, spread, count }.
   Grain runs along the canvas V axis (vertical) so core.worldUV(grain:"long") lays it along each board.
   All textures are generated with canvas 2D + REAL.core noise; deterministic (fixed seeds). */
(function(){
"use strict";
const REAL = window.REAL = window.REAL || {};

/* ---------------------------------------------------------------- helpers */
function sstep(a, b, x){ let t = (x - a) / (b - a); t = t < 0 ? 0 : t > 1 ? 1 : t; return t * t * (3 - 2 * t); }
function clamp255(v){ return v < 0 ? 0 : v > 255 ? 255 : v; }

/* periodic 1-D value noise (period 1), output -1..1 */
function noise1(n, rnd){
  const v = new Float32Array(n);
  for (let i = 0; i < n; i++) v[i] = rnd() * 2 - 1;
  return function(t){
    t = (t - Math.floor(t)) * n;
    const i = Math.floor(t), f = t - i, s = f * f * (3 - 2 * f);
    const a = v[i % n], b = v[(i + 1) % n];
    return a + (b - a) * s;
  };
}
function fbm1(n, oct, rnd){
  const fs = [];
  for (let k = 0; k < oct; k++) fs.push(noise1(n << k, rnd));
  return function(t){ let s = 0, a = 1, tot = 0; for (let k = 0; k < oct; k++){ s += fs[k](t) * a; tot += a; a *= 0.5; } return s / tot; };
}

/* low-res tileable 2-D field (core.fbm, normalised to -0.5..0.5) sampled bilinearly with wrap */
function lowField(C, w, h, o){
  const f = C.normalize(C.fbm(w, h, o));
  for (let i = 0; i < f.length; i++) f[i] -= 0.5;
  return {f, w, h};
}
function samp(F, u, v){
  const w = F.w, h = F.h, f = F.f;
  let x = (u - Math.floor(u)) * w - 0.5, y = (v - Math.floor(v)) * h - 0.5;
  if (x < 0) x += w; if (y < 0) y += h;
  const x0 = x | 0, y0 = y | 0, tx = x - x0, ty = y - y0;
  const x1 = x0 + 1 === w ? 0 : x0 + 1, y1 = y0 + 1 === h ? 0 : y0 + 1;
  const a = f[y0 * w + x0], b = f[y0 * w + x1], c = f[y1 * w + x0], d = f[y1 * w + x1];
  const top = a + (b - a) * tx;
  return top + ((c + (d - c) * tx) - top) * ty;
}

/* write an RGB(A) float buffer (0..255) into a canvas */
function toCanvas(C, W, H, rgb, alpha){
  const c = C.canvas(W, H), ctx = c.getContext("2d"), img = ctx.createImageData(W, H), d = img.data;
  for (let i = 0, j = 0; i < W * H; i++, j += 3){
    d[i*4] = clamp255(rgb[j]); d[i*4+1] = clamp255(rgb[j+1]); d[i*4+2] = clamp255(rgb[j+2]);
    d[i*4+3] = alpha ? clamp255(alpha[i]) : 255;
  }
  ctx.putImageData(img, 0, 0);
  return c;
}
/* grey data canvas (roughness / alpha), values 0..1 */
function greyCanvas(C, W, H, g){
  const c = C.canvas(W, H), ctx = c.getContext("2d"), img = ctx.createImageData(W, H), d = img.data;
  for (let i = 0; i < W * H; i++){ const v = clamp255(g[i] * 255); d[i*4] = d[i*4+1] = d[i*4+2] = v; d[i*4+3] = 255; }
  ctx.putImageData(img, 0, 0);
  return c;
}
/* tangent-space normal map from a tileable height field measured in INCHES.
   pu/pv = pixel size in inches across/along; k = exaggeration. OpenGL convention (green = +v = canvas up). */
function normalCanvas(C, W, H, hf, pu, pv, k){
  const c = C.canvas(W, H), ctx = c.getContext("2d"), img = ctx.createImageData(W, H), d = img.data;
  const sx = k / (2 * pu), sy = k / (2 * pv);
  for (let y = 0; y < H; y++){
    const yu = (y - 1 + H) % H, yd = (y + 1) % H, row = y * W;
    for (let x = 0; x < W; x++){
      const xl = x === 0 ? W - 1 : x - 1, xr = x === W - 1 ? 0 : x + 1;
      const nx = -(hf[row + xr] - hf[row + xl]) * sx, ny = -(hf[yu * W + x] - hf[yd * W + x]) * sy;
      const inv = 1 / Math.sqrt(nx * nx + ny * ny + 1), i = (row + x) * 4;
      d[i] = (nx * inv * 0.5 + 0.5) * 255; d[i+1] = (ny * inv * 0.5 + 0.5) * 255; d[i+2] = (inv * 0.5 + 0.5) * 255; d[i+3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

/* ---------------------------------------------------------------- growth-ring field
   Models the board face as a plane cutting through a log whose pith runs (almost) along the board.
   Ring radius r = sqrt(dx^2 + d^2), with dx made periodic across the tile (sin) so the texture tiles;
   d (pith depth below the face) and the pith's x drift slowly along the length -> cathedral / flame figure.
   Knots add a local radius bump (rings swirl around them) plus a dark core mask.
   Returns per-pixel: late (latewood density 0..1), knot (core mask), halo, fib (fibre streaks -0.5..0.5), low (tone -0.5..0.5). */
function ringField(C, W, H, o){
  const rnd = C.rng(o.seed);
  const uIn = o.uIn, vIn = o.vIn, N = W * H;
  const late = new Float32Array(N), knot = new Float32Array(N), halo = new Float32Array(N), fib = new Float32Array(N), low = new Float32Array(N), kring = new Float32Array(N);

  /* irregular ring widths -> phase lookup table */
  const rMax = o.d0 + o.dAmp + uIn + 3, step = 0.004, nT = Math.ceil(rMax / step) + 2;
  const bounds = [0]; let rr = 0;
  while (rr < rMax + 2){ rr += (1 / o.rpi) * (1 - o.ringVar + rnd() * 2 * o.ringVar); bounds.push(rr); }
  const phaseT = new Float32Array(nT);
  for (let i = 0, j = 0; i < nT; i++){ const r = i * step; while (bounds[j + 1] < r) j++; phaseT[i] = j + (r - bounds[j]) / (bounds[j + 1] - bounds[j]); }

  /* slow along-length curves */
  const dN = fbm1(3, 3, rnd), xN = fbm1(2, 3, rnd);
  const rowD = new Float32Array(H), rowX = new Float32Array(H);
  const x0 = rnd() * uIn;
  for (let y = 0; y < H; y++){ const t = y / H; rowD[y] = o.d0 + o.dAmp * dN(t); rowX[y] = x0 + o.xDrift * uIn * xN(t); }

  const wLow = lowField(C, 64, 64, {base: 2, sx: 1, sy: 3, octaves: 4, seed: o.seed + 11});        /* broad ring wander */
  const wHi  = lowField(C, 128, 128, {base: 3, sx: 3, sy: 2, octaves: 3, seed: o.seed + 12});      /* small wiggles */
  const fF   = lowField(C, W >> 1, H >> 4, {base: 4, sx: 16, sy: 1, octaves: 3, persistence: 0.6, seed: o.seed + 13}); /* fibres */
  const tF   = lowField(C, 32, 64, {base: 2, sx: 1, sy: 2, octaves: 4, seed: o.seed + 14});        /* tone */

  /* knots: positions in inches, radii in inches (core ellipse, longer along grain) */
  const knots = [];
  for (let i = 0; i < (o.knots || 0); i++){
    const size = o.knotMin + rnd() * (o.knotMax - o.knotMin);
    knots.push({x: rnd() * uIn, y: (i + 0.15 + rnd() * 0.7) / o.knots * vIn, rx: size * 0.5, ry: size * 0.5 * (1.3 + rnd() * 0.6),
                amp: (0.6 + rnd() * 0.6) * (3 / o.rpi), dark: 0.75 + rnd() * 0.25, ph: rnd()});
  }

  const pi = Math.PI, aU = uIn / pi, halfU = uIn / 2, halfV = vIn / 2;
  for (let y = 0; y < H; y++){
    const v = (y + 0.5) / H, yin = v * vIn, d0 = rowD[y], px = rowX[y];
    for (let x = 0; x < W; x++){
      const u = (x + 0.5) / W, xin = u * uIn, i = y * W + x;
      const wl = samp(wLow, u, v), wh = samp(wHi, u, v);
      const s = Math.sin(pi * (xin - px) / uIn + wl * o.thWarp) * aU;
      const d = d0 + wl * o.dWarp;
      let r = Math.sqrt(s * s + d * d) + wh * o.rWarp;
      let kc = 0, kh = 0, kr = 0;
      for (let k = 0; k < knots.length; k++){
        const K = knots[k];
        let dx = xin - K.x, dy = yin - K.y;
        if (dx > halfU) dx -= uIn; else if (dx < -halfU) dx += uIn;
        if (dy > halfV) dy -= vIn; else if (dy < -halfV) dy += vIn;
        const q = (dx * dx) / (K.rx * K.rx) + (dy * dy) / (K.ry * K.ry);
        if (q < 60){
          r += K.amp * Math.exp(-q * 0.09);
          const qs = Math.sqrt(q);
          const core = 1 - sstep(0.85, 1.08, qs + wh * 0.25);
          if (core > kc){ kc = core * K.dark; kr = qs * 3.2 + K.ph + wh; }
          kh = Math.max(kh, Math.exp(-q * 0.18));
        }
      }
      let ri = r / step; if (ri > nT - 2) ri = nT - 2;
      const i0 = ri | 0, ph = phaseT[i0] + (phaseT[i0 + 1] - phaseT[i0]) * (ri - i0);
      const t = ph - Math.floor(ph);
      late[i] = sstep(o.lwA, o.lwB, t) * (1 - sstep(0.0, 0.02, -t + 0.0)) ;
      knot[i] = kc; halo[i] = kh; kring[i] = kr;
      fib[i] = samp(fF, u + wh * 0.004, v);
      low[i] = samp(tF, u, v);
    }
  }
  return {late, knot, halo, kring, fib, low, W, H, uIn, vIn};
}

/* deterministic per-pixel hash noise (-0.5..0.5) for grit */
function grit(W, H, seed){
  const g = new Float32Array(W * H), rnd = REAL.core.rng(seed);
  for (let i = 0; i < g.length; i++) g[i] = rnd() - 0.5;
  return g;
}

/* ---------------------------------------------------------------- variants */
function makeSPF(C, THREE, R){
  const W = 512 * R, H = 1024 * R, uIn = 4.8, vIn = 36;
  const F = ringField(C, W, H, {seed: 101, uIn, vIn, rpi: 9, ringVar: 0.45, d0: 1.3, dAmp: 0.55, xDrift: 0.25,
                                 thWarp: 0.5, dWarp: 0.35, rWarp: 0.05, lwA: 0.72, lwB: 0.97, knots: 2, knotMin: 0.35, knotMax: 0.8});
  const g = grit(W, H, 102);
  const N = W * H, rgb = new Float32Array(N * 3), rough = new Float32Array(N), hgt = new Float32Array(N);
  for (let i = 0; i < N; i++){
    const L = F.late[i], f = F.fib[i], t = F.low[i], k = F.knot[i], h = F.halo[i];
    /* earlywood creamy, latewood a warmer tan; broad tone drifts between paler spruce and warmer pine/fir */
    let r = 224 - 30 * L, gg = 200 - 40 * L, b = 154 - 46 * L;
    const warm = t * 1.2;
    r += 6 * warm; gg -= 2 * warm; b -= 12 * warm;
    const fm = 1 + f * 0.10 + g[i] * 0.025;
    r *= fm; gg *= fm; b *= fm;
    /* resin halo around knots */
    r -= h * 16; gg -= h * 26; b -= h * 34;
    if (k > 0){
      const kr = F.kring[i], ring = 0.75 + 0.25 * Math.cos(kr * 6.283);
      r = r + (118 * ring - r) * k; gg = gg + (74 * ring - gg) * k; b = b + (42 * ring - b) * k;
    }
    rgb[i*3] = r; rgb[i*3+1] = gg; rgb[i*3+2] = b;
    rough[i] = 0.76 - L * 0.07 + f * 0.06 + g[i] * 0.04 - k * 0.12;
    hgt[i] = f * 0.004 + L * 0.0015 + g[i] * 0.0012 - k * 0.002;
  }
  const map = toCanvas(C, W, H, rgb), nm = normalCanvas(C, W, H, hgt, uIn / W, vIn / H, 1), rm = greyCanvas(C, W, H, rough);
  return C.material(THREE, {map, normalMap: nm, normalScale: 1, roughnessMap: rm, roughness: 1, tile: [uIn / 12, vIn / 12], grain: "long", jitter: 1});
}

/* southern-yellow-pine style field shared by pressure-treated and deck stock */
function sypField(C, R){
  const W = 512 * R, H = 1024 * R, uIn = 6, vIn = 48;
  return ringField(C, W, H, {seed: 201, uIn, vIn, rpi: 5, ringVar: 0.4, d0: 1.6, dAmp: 0.7, xDrift: 0.3,
                             thWarp: 0.45, dWarp: 0.45, rWarp: 0.06, lwA: 0.48, lwB: 0.78, knots: 2, knotMin: 0.5, knotMax: 1.1});
}

function makePT(C, THREE, F){
  const W = F.W, H = F.H, uIn = F.uIn, vIn = F.vIn, N = W * H;
  const g = grit(W, H, 301), rnd = C.rng(302);
  const blot = lowField(C, 32, 128, {base: 3, sx: 1, sy: 2, octaves: 4, seed: 303});
  /* incising: staggered slits 0.42" x 0.06", columns every 0.5", rows every 0.75" */
  const cols = 12, rows = 64, cw = uIn / cols, rh = vIn / rows, slitL = 0.42, slitW = 0.065;
  const jit = new Float32Array(cols * rows * 2);
  for (let i = 0; i < jit.length; i++) jit[i] = rnd() - 0.5;
  const rgb = new Float32Array(N * 3), rough = new Float32Array(N), hgt = new Float32Array(N);
  for (let y = 0; y < H; y++){
    const v = (y + 0.5) / H, yin = v * vIn;
    for (let x = 0; x < W; x++){
      const i = y * W + x, u = (x + 0.5) / W, xin = u * uIn;
      const L = F.late[i], f = F.fib[i], k = F.knot[i];
      const bl = samp(blot, u, v);
      /* incision lookup */
      const ry = Math.floor(yin / rh), rowOff = (ry & 1) ? 0.5 : 0;
      const cxf = xin / cw - rowOff, cx = Math.floor(cxf + 0.5);
      const ci = (((cx % cols) + cols) % cols) + ((ry % rows) * cols);
      const sx = (cxf - cx) * cw + jit[ci * 2] * 0.05, sy = (yin - (ry + 0.5) * rh) + jit[ci * 2 + 1] * 0.1;
      const qx = Math.abs(sx) / (slitW * 0.5), qy = Math.abs(sy) / (slitL * 0.5);
      const slit = (1 - sstep(0.7, 1.15, qx)) * (1 - sstep(0.75, 1.0, qy));
      const lip = Math.exp(-((Math.max(0, qx - 1) * 0.6) ** 2) - (Math.max(0, qy - 1) * 3) ** 2) * (1 - slit) * (qy < 1.4 ? 1 : 0);
      /* greenish-tan: earlywood pale olive-tan, latewood darker brown-olive; copper blotches push greener */
      let r = 168 - 44 * L, gg = 162 - 42 * L, b = 114 - 36 * L;
      const green = bl * 1.6;
      r -= 12 * green; gg += 2 * green; b -= 4 * green;
      const fm = 1 + f * 0.10 + g[i] * 0.03;
      r *= fm; gg *= fm; b *= fm;
      r -= F.halo[i] * 18; gg -= F.halo[i] * 16; b -= F.halo[i] * 14;
      if (k > 0){ const ring = 0.75 + 0.25 * Math.cos(F.kring[i] * 6.283); r += (86 * ring - r) * k; gg += (70 * ring - gg) * k; b += (40 * ring - b) * k; }
      /* slit: darker, more saturated green inside, faint dark rim */
      r = r * (1 - slit * 0.52) - lip * 6; gg = gg * (1 - slit * 0.42) - lip * 5; b = b * (1 - slit * 0.55) - lip * 5;
      rgb[i*3] = r; rgb[i*3+1] = gg; rgb[i*3+2] = b;
      rough[i] = 0.64 - L * 0.06 + f * 0.06 + g[i] * 0.04 + slit * 0.15 + bl * 0.08;
      hgt[i] = f * 0.006 + L * 0.003 + g[i] * 0.0015 - slit * 0.03 + lip * 0.004;
    }
  }
  const map = toCanvas(C, W, H, rgb), nm = normalCanvas(C, W, H, hgt, uIn / W, vIn / H, 1), rm = greyCanvas(C, W, H, rough);
  return {map, nm, rm, tile: [uIn / 12, vIn / 12]};
}

function makeLVL(C, THREE, R){
  const W = 512 * R, H = 1024 * R, uIn = 6, vIn = 48, N = W * H;
  const rnd = C.rng(401), g = grit(W, H, 402);
  /* plies across the tile: ~1/8" each, variable, plus per-ply tone */
  const nP = 48, th = [];
  let sum = 0;
  for (let i = 0; i < nP; i++){ const t = 0.8 + rnd() * 0.4; th.push(t); sum += t; }
  const edges = [0]; for (let i = 0; i < nP; i++) edges.push(edges[i] + th[i] / sum * uIn);
  const plyTone = [], plyWarm = [], plyJoint = [];
  for (let i = 0; i < nP; i++){ plyTone.push((rnd() - 0.5) * 0.22); plyWarm.push(rnd() < 0.25 ? 0.6 + rnd() * 0.4 : rnd() * 0.3); plyJoint.push(rnd() * vIn); }
  const plyOf = new Int16Array(W), plyPos = new Float32Array(W);
  for (let x = 0, p = 0; x < W; x++){ const xin = (x + 0.5) / W * uIn; while (edges[p + 1] < xin) p++; plyOf[x] = p; plyPos[x] = (xin - edges[p]) / (edges[p + 1] - edges[p]); }
  const streak = lowField(C, W >> 1, H >> 5, {base: 4, sx: 24, sy: 1, octaves: 3, persistence: 0.65, seed: 403});
  const tone = lowField(C, 32, 64, {base: 2, sx: 1, sy: 3, octaves: 4, seed: 404});
  const rgb = new Float32Array(N * 3), rough = new Float32Array(N), hgt = new Float32Array(N);
  const pxIn = uIn / W;
  for (let y = 0; y < H; y++){
    const v = (y + 0.5) / H, yin = v * vIn;
    for (let x = 0; x < W; x++){
      const i = y * W + x, u = (x + 0.5) / W, p = plyOf[x], pp = plyPos[x];
      const st = samp(streak, u, v), tn = samp(tone, u, v);
      /* glue line at each ply boundary (~0.012" dark phenolic) */
      const dEdge = Math.min(pp, 1 - pp) * (edges[p + 1] - edges[p]);
      const glue = 1 - sstep(0.004, 0.004 + pxIn * 1.2, dEdge);
      /* veneer butt/scarf joint: short dark slanted line across the ply */
      let jd = yin - plyJoint[p] - (pp - 0.5) * 0.35; jd -= Math.round(jd / vIn) * vIn;
      const joint = 1 - sstep(0.01, 0.05, Math.abs(jd));
      const w = plyWarm[p];
      const m = 1 + plyTone[p] + st * 0.16 + tn * 0.08 + g[i] * 0.03;
      let r = (214 - 8 * w) * m, gg = (168 - 24 * w) * m, b = (104 - 22 * w) * m;
      r += (96 - r) * glue * 0.75; gg += (62 - gg) * glue * 0.75; b += (36 - b) * glue * 0.75;
      r += (120 - r) * joint * 0.5; gg += (84 - gg) * joint * 0.5; b += (50 - b) * joint * 0.5;
      rgb[i*3] = r; rgb[i*3+1] = gg; rgb[i*3+2] = b;
      rough[i] = 0.58 + st * 0.1 + g[i] * 0.04 + glue * 0.1 - tn * 0.06;
      hgt[i] = st * 0.002 + g[i] * 0.001 - glue * 0.003 - joint * 0.002;
    }
  }
  const map = toCanvas(C, W, H, rgb), nm = normalCanvas(C, W, H, hgt, uIn / W, vIn / H, 1), rm = greyCanvas(C, W, H, rough);
  return C.material(THREE, {map, normalMap: nm, normalScale: 1, roughnessMap: rm, roughness: 1, tile: [uIn / 12, vIn / 12], grain: "long", jitter: 1});
}

/* stained deck stock; dark=true gives the more opaque, darker framing stain */
function makeDeck(C, THREE, F, dark){
  const W = F.W, H = F.H, uIn = F.uIn, vIn = F.vIn, N = W * H;
  const g = grit(W, H, dark ? 501 : 502), rnd = C.rng(dark ? 503 : 504);
  const wear = lowField(C, 32, 128, {base: 2, sx: 2, sy: 3, octaves: 5, seed: dark ? 505 : 506});
  /* drying checks: thin dark cracks along the grain */
  const checks = [];
  for (let i = 0; i < (dark ? 4 : 7); i++) checks.push({x: rnd() * uIn, y: rnd() * vIn, len: 2 + rnd() * 9, w: 0.012 + rnd() * 0.02});
  const rgb = new Float32Array(N * 3), rough = new Float32Array(N), hgt = new Float32Array(N);
  /* base stain colours (sRGB 0..255) */
  const E = dark ? [84, 58, 47] : [114, 79, 62], Lw = dark ? [64, 44, 36] : [86, 58, 46];
  for (let y = 0; y < H; y++){
    const v = (y + 0.5) / H, yin = v * vIn;
    for (let x = 0; x < W; x++){
      const i = y * W + x, u = (x + 0.5) / W, xin = u * uIn;
      const L = F.late[i], f = F.fib[i], k = F.knot[i];
      const wr = samp(wear, u, v);
      const worn = sstep(0.05, 0.4, wr) * (dark ? 0.5 : 1);
      let r = E[0] + (Lw[0] - E[0]) * L, gg = E[1] + (Lw[1] - E[1]) * L, b = E[2] + (Lw[2] - E[2]) * L;
      const fm = 1 + f * 0.14 + g[i] * 0.035 + F.low[i] * 0.08;
      r *= fm; gg *= fm; b *= fm;
      /* worn: lighter, greyer, wood showing through on earlywood */
      const wE = worn * (1 - L * 0.7);
      r += (128 - r) * wE * 0.35; gg += (102 - gg) * wE * 0.35; b += (86 - b) * wE * 0.35;
      if (k > 0){ const ring = 0.8 + 0.2 * Math.cos(F.kring[i] * 6.283); r += (52 * ring - r) * k; gg += (34 * ring - gg) * k; b += (26 * ring - b) * k; }
      /* checks */
      let ck = 0;
      for (let c = 0; c < checks.length; c++){
        const K = checks[c];
        let dy = yin - K.y; dy -= Math.round(dy / vIn) * vIn;
        if (Math.abs(dy) > K.len * 0.5) continue;
        let dx = xin - K.x - F.fib[i] * 0.01; dx -= Math.round(dx / uIn) * uIn;
        const taper = 1 - Math.pow(Math.abs(dy) / (K.len * 0.5), 2);
        const wv = K.w * taper;
        ck = Math.max(ck, 1 - sstep(wv * 0.5, wv * 0.5 + 0.02, Math.abs(dx)));
      }
      r += (34 - r) * ck * 0.85; gg += (24 - gg) * ck * 0.85; b += (19 - b) * ck * 0.85;
      rgb[i*3] = r; rgb[i*3+1] = gg; rgb[i*3+2] = b;
      /* intact stain has a soft sheen; worn wood goes matte */
      rough[i] = (dark ? 0.6 : 0.52) + worn * 0.25 - L * 0.05 + f * 0.06 + g[i] * 0.05 + ck * 0.2;
      /* weathered: earlywood erodes, latewood ridges stand proud */
      hgt[i] = L * (dark ? 0.006 : 0.012) + f * 0.006 + g[i] * 0.002 - ck * 0.03;
    }
  }
  const map = toCanvas(C, W, H, rgb), nm = normalCanvas(C, W, H, hgt, uIn / W, vIn / H, 1), rm = greyCanvas(C, W, H, rough);
  return C.material(THREE, {map, normalMap: nm, normalScale: 1, roughnessMap: rm, roughness: 1, tile: [uIn / 12, vIn / 12], grain: "long", jitter: 1});
}

/* 45-degree lattice: 1.5" slats on a 4" pitch (2.5" openings), two layers (front family over back family).
   Canvas covers 2 x 2 diamond periods (T = 2*p*sqrt2) so it tiles exactly. */
function makeLattice(C, THREE, R){
  const W = 512 * R, H = W, p = 4, sw = 1.5, tIn = 0.3;              /* inches */
  const T = 2 * p * Math.SQRT2, pxIn = T / W, N = W * H, rs2 = 1 / Math.SQRT2;
  const rnd = C.rng(601), g = grit(W, H, 602);
  /* per slat loop (2 per family, each loop 4p long): tone, grain phase, wobble */
  const slats = [];
  for (let i = 0; i < 4; i++) slats.push({tone: (rnd() - 0.5) * 0.14, off: rnd(), wob: noise1(6, rnd), wob2: noise1(17, rnd), rpi: 4 + rnd() * 3});
  const fibF = lowField(C, 256, 64, {base: 4, sx: 8, sy: 1, octaves: 3, seed: 603});
  const rgb = new Float32Array(N * 3), alpha = new Float32Array(N), hgt = new Float32Array(N), rough = new Float32Array(N);
  const E = [104, 72, 57], Lw = [80, 54, 43];
  function slat(t, s, fam){
    /* t = across coordinate (in), s = along coordinate (in). returns {i, d, sc} */
    const i = Math.round(t / p), d = t - i * p, k = ((i % 2) + 2) % 2;
    let sc = s - (i - k) * p; sc = sc - Math.floor(sc / (4 * p)) * 4 * p;
    return [k + fam * 2, d, sc / (4 * p)];
  }
  for (let y = 0; y < H; y++){
    for (let x = 0; x < W; x++){
      const i = y * W + x, X = (x + 0.5) * pxIn, Y = (y + 0.5) * pxIn;
      const tA = (X + Y) * rs2, sA = (X - Y) * rs2, tB = (X - Y) * rs2, sB = (X + Y) * rs2;
      const A = slat(tA, sA, 0), B = slat(tB, sB, 1);
      const eA = sw / 2 - Math.abs(A[1]), eB = sw / 2 - Math.abs(B[1]);   /* distance inside slat edge */
      const cA = Math.min(1, Math.max(0, eA / pxIn + 0.5)), cB = Math.min(1, Math.max(0, eB / pxIn + 0.5));
      alpha[i] = Math.max(cA, cB) * 255;
      const front = cA > 0.5;
      const S = front ? slats[A[0]] : slats[B[0]], d = front ? A[1] : B[1], sc = front ? A[2] : B[2], e = front ? eA : eB;
      /* grain lines along the slat */
      const gp = (d + S.wob(sc) * 0.5 + S.wob2(sc) * 0.12) * S.rpi + S.off;
      const tt = gp - Math.floor(gp), L = sstep(0.55, 0.85, tt);
      const fb = samp(fibF, (d + 0.75) / 1.5 * 0.25 + (front ? 0 : 0.5) + S.off, sc);
      let m = 1 + S.tone + fb * 0.12 + g[i] * 0.04;
      /* soft edge darkening on eased corners; back slats occluded beside the front slats */
      const ease = 1 - 0.18 * (1 - sstep(0, 0.12, e));
      let ao = 1;
      if (!front){ const dist = -eA; ao = 1 - 0.45 * Math.exp(-Math.max(0, dist) / 0.22); m *= 0.9; }
      m *= ease * ao;
      rgb[i*3] = (E[0] + (Lw[0] - E[0]) * L) * m; rgb[i*3+1] = (E[1] + (Lw[1] - E[1]) * L) * m; rgb[i*3+2] = (E[2] + (Lw[2] - E[2]) * L) * m;
      const prof = sstep(0, 0.1, e);
      hgt[i] = (cA > 0.01 ? (tIn + tIn * sstep(0, 0.1, eA)) : (cB > 0.01 ? tIn * sstep(0, 0.1, eB) : 0)) * 0.12 + L * 0.004 + fb * 0.004;
      rough[i] = 0.62 + fb * 0.08 + g[i] * 0.05 + (1 - prof) * 0.05;
    }
  }
  const map = toCanvas(C, W, H, rgb), am = greyCanvas(C, W, H, alpha.map(a => a / 255)), nm = normalCanvas(C, W, H, hgt, pxIn, pxIn, 1), rm = greyCanvas(C, W, H, rough);
  const mat = C.material(THREE, {map, normalMap: nm, normalScale: 1, roughnessMap: rm, roughness: 1, alphaMap: am, alphaTest: 0.5, tile: [T / 12, T / 12], grain: "none", jitter: 1});
  return mat;
}

/* ---------------------------------------------------------------- public */
REAL.wood = {
  create: function(THREE, renderer, opts){
    opts = opts || {};
    const C = REAL.core, R = opts.res || 1;
    const t0 = performance.now(), T = {}; let tl = t0;
    const lap = k => { const n = performance.now(); T[k] = Math.round(n - tl); tl = n; };
    const spf = makeSPF(C, THREE, R); lap("spf");
    const F = sypField(C, R); lap("sypField");
    const ptT = makePT(C, THREE, F);
    const pt = C.material(THREE, {map: ptT.map, normalMap: ptT.nm, normalScale: 1, roughnessMap: ptT.rm, roughness: 1, tile: ptT.tile, grain: "long", jitter: 1}); lap("pt");
    const lvl = makeLVL(C, THREE, R); lap("lvl");
    const deck = makeDeck(C, THREE, F, false); lap("deck");
    const deckDark = makeDeck(C, THREE, F, true); lap("deckDark");
    const lattice = makeLattice(C, THREE, R); lap("lattice");
    const ms = performance.now() - t0;
    REAL.wood.timing = T;
    REAL.wood.buildMs = ms;
    return {
      buildMs: ms,
      variants: {
        spf:      {material: spf,      sample: [0.125, 8, 0.29]},
        pt:       {material: pt,       sample: [12, 0.125, 0.46], spread: [0, 0.3, 0]},
        lvl:      {material: lvl,      sample: [8, 0.77, 0.29], spread: [0, 0, 0.6]},
        deck:     {material: deck,     sample: [8, 0.1, 0.46], spread: [0, 0, 0.49], count: 5},
        deckDark: {material: deckDark, sample: [8, 0.77, 0.125], spread: [0, 0, 1.33]},
        lattice:  {material: lattice,  sample: [6, 2.7, 0.05], count: 1}
      }
    };
  }
};
})();
