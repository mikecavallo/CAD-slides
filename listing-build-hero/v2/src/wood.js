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
function c255(v){ return v < 0 ? 0 : v > 255 ? 255 : v; }

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
  let x0 = x | 0, y0 = y | 0; const tx = x - x0, ty = y - y0;
  if (x0 >= w) x0 -= w; if (y0 >= h) y0 -= h;   /* -tiny + w rounds to exactly w */
  const x1 = x0 + 1 === w ? 0 : x0 + 1, y1 = y0 + 1 === h ? 0 : y0 + 1;
  const a = f[y0 * w + x0], b = f[y0 * w + x1], c = f[y1 * w + x0], d = f[y1 * w + x1];
  const top = a + (b - a) * tx;
  return top + ((c + (d - c) * tx) - top) * ty;
}

/* upsample a low-res periodic field to W x H (bilinear, wrap) in one pass: far cheaper than per-pixel samp() */
function up(F, W, H){
  const out = new Float32Array(W * H), w = F.w, h = F.h, f = F.f;
  const xi0 = new Int32Array(W), xi1 = new Int32Array(W), xt = new Float32Array(W);
  for (let x = 0; x < W; x++){ let fx = (x + 0.5) / W * w - 0.5; if (fx < 0) fx += w; const a = fx | 0; xi0[x] = a; xi1[x] = a + 1 === w ? 0 : a + 1; xt[x] = fx - a; }
  const row = new Float32Array(w);
  for (let y = 0; y < H; y++){
    let fy = (y + 0.5) / H * h - 0.5; if (fy < 0) fy += h;
    const y0 = fy | 0, y1 = y0 + 1 === h ? 0 : y0 + 1, ty = fy - y0, r0 = y0 * w, r1 = y1 * w;
    for (let x = 0; x < w; x++) row[x] = f[r0 + x] + (f[r1 + x] - f[r0 + x]) * ty;
    const o = y * W;
    for (let x = 0; x < W; x++){ const a = row[xi0[x]]; out[o + x] = a + (row[xi1[x]] - a) * xt[x]; }
  }
  return out;
}

/* shared per-pixel grit (-0.5..0.5), xorshift32; callers read it at different offsets */
let GRIT = null;
function grit(n){
  if (GRIT && GRIT.length >= n) return GRIT;
  GRIT = new Float32Array(n);
  let s = 0x9E3779B9 | 0;
  for (let i = 0; i < n; i++){ s ^= s << 13; s ^= s >>> 17; s ^= s << 5; GRIT[i] = (s >>> 0) / 4294967296 - 0.5; }
  return GRIT;
}

/* scratch buffers reused between variants (keeps GC out of the build) */
const POOL = {};
function buf(name, n){ const b = POOL[name]; if (b && b.length === n) return b; return (POOL[name] = new Float32Array(n)); }

/* canvases: opaque colour (RGB float 0..255; never carry alpha here, canvas premultiplies it away), grey data (0..1),
   normal map from height in inches */
function toCanvas(C, W, H, rgb){
  const c = C.canvas(W, H), ctx = c.getContext("2d"), img = ctx.createImageData(W, H), d = img.data;
  for (let i = 0, j = 0, k = 0; i < W * H; i++, j += 3, k += 4){
    d[k] = c255(rgb[j]); d[k+1] = c255(rgb[j+1]); d[k+2] = c255(rgb[j+2]); d[k+3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return c;
}
function greyCanvas(C, W, H, g){
  const c = C.canvas(W, H), ctx = c.getContext("2d"), img = ctx.createImageData(W, H), d = img.data;
  for (let i = 0, k = 0; i < W * H; i++, k += 4){ const v = c255(g[i] * 255); d[k] = d[k+1] = d[k+2] = v; d[k+3] = 255; }
  ctx.putImageData(img, 0, 0);
  return c;
}
/* tangent-space normal map from a tileable height field in INCHES; pu/pv = pixel size in inches. OpenGL convention. */
function normalCanvas(C, W, H, hf, pu, pv, k){
  const c = C.canvas(W, H), ctx = c.getContext("2d"), img = ctx.createImageData(W, H), d = img.data;
  const sx = k / (2 * pu), sy = k / (2 * pv);
  for (let y = 0; y < H; y++){
    const ru = ((y - 1 + H) % H) * W, rd = ((y + 1) % H) * W, row = y * W;
    for (let x = 0; x < W; x++){
      const xl = x === 0 ? W - 1 : x - 1, xr = x === W - 1 ? 0 : x + 1;
      const nx = -(hf[row + xr] - hf[row + xl]) * sx, ny = -(hf[ru + x] - hf[rd + x]) * sy;
      const inv = 1 / Math.sqrt(nx * nx + ny * ny + 1), i = (row + x) * 4;
      d[i] = (nx * inv * 0.5 + 0.5) * 255; d[i+1] = (ny * inv * 0.5 + 0.5) * 255; d[i+2] = (inv * 0.5 + 0.5) * 255; d[i+3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return c;
}
function mat(C, THREE, W, H, rgb, rough, hgt, pu, pv, o){
  return C.material(THREE, Object.assign({
    map: toCanvas(C, W, H, rgb), normalMap: normalCanvas(C, W, H, hgt, pu, pv, 1), normalScale: 1,
    roughnessMap: greyCanvas(C, W, H, rough), roughness: 1, grain: "long", jitter: 1
  }, o));
}

/* ---------------------------------------------------------------- growth-ring field
   The board face is a plane cutting a log whose pith runs almost parallel to the board.
   Ring radius r = sqrt(s^2 + d^2): s = across-face distance from the pith line (made periodic with sin so the
   texture tiles), d = depth of the pith below the face, which drifts slowly along the length -> long flame /
   cathedral figure on flat-sawn areas, tight straight lines toward the rift/quarter-sawn sides.
   Knots add a local radius bump (rings swirl round them) and an irregular core mask.
   Output (per pixel): late 0..1 latewood density, knot 0..1 core, rim 0..1 dark knot boundary, halo 0..1,
   kring knot-internal ring phase, fib fibre streaks (-.5...5), low broad tone (-.5...5). */
function ringField(C, W, H, o){
  const rnd = C.rng(o.seed);
  const uIn = o.uIn, vIn = o.vIn, N = W * H;
  const late = new Float32Array(N), knot = new Float32Array(N), rim = new Float32Array(N), halo = new Float32Array(N),
        kring = new Float32Array(N), fib = new Float32Array(N), low = new Float32Array(N);

  /* irregular ring widths -> phase lookup */
  const rMax = o.d0 + o.dAmp + uIn / Math.PI + 2, step = 0.003, nT = Math.ceil(rMax / step) + 2;
  const bounds = [0]; let rr = 0;
  while (rr < rMax + 1){ rr += (1 / o.rpi) * (1 - o.ringVar + rnd() * 2 * o.ringVar); bounds.push(rr); }
  const phaseT = new Float32Array(nT);
  for (let i = 0, j = 0; i < nT; i++){ const r = i * step; while (bounds[j + 1] < r) j++; phaseT[i] = j + (r - bounds[j]) / (bounds[j + 1] - bounds[j]); }

  /* slow along-length curves: pith depth and pith sideways drift */
  const dN = fbm1(o.dCells || 2, 3, rnd), xN = fbm1(2, 2, rnd);
  const rowD = new Float32Array(H), rowX = new Float32Array(H), x0 = rnd() * uIn;
  for (let y = 0; y < H; y++){ const t = y / H; rowD[y] = o.d0 + o.dAmp * dN(t); rowX[y] = x0 + o.xDrift * uIn * xN(t); }

  const wLow = lowField(C, 32, 64, {base: 1, sx: 2, sy: 3, octaves: 4, seed: o.seed + 11});        /* ring wander */
  const wHi  = lowField(C, 64, 128, {base: 2, sx: 3, sy: 2, octaves: 3, seed: o.seed + 12});       /* small wiggles */
  const fF   = lowField(C, W >> 1, H >> 4, {base: 4, sx: 16, sy: 1, octaves: 3, persistence: 0.65, seed: o.seed + 13}); /* fibres */
  const tF   = lowField(C, 32, 64, {base: 2, sx: 1, sy: 2, octaves: 4, seed: o.seed + 14});        /* tone */

  /* knots (inches): irregular ovals, longer along the grain */
  const knots = [];
  for (let i = 0; i < (o.knots || 0); i++){
    const size = o.knotMin + Math.pow(rnd(), 1.6) * (o.knotMax - o.knotMin);
    knots.push({x: rnd() * uIn, y: (i + 0.2 + rnd() * 0.6) / o.knots * vIn, rx: size * 0.5, ry: size * 0.5 * (1.1 + rnd() * 0.45),
                amp: (0.45 + rnd() * 0.35) * size, dead: rnd() < (o.deadKnots || 0.3) ? 1 : 0, ph: rnd() * 6.28, lob: 1 + rnd() * 2});
  }

  const WL = up(wLow, W, H), WH = up(wHi, W, H), FB = up(fF, W, H), TN = up(tF, W, H);
  const pi = Math.PI, aU = uIn / pi, halfU = uIn / 2, halfV = vIn / 2, invStep = 1 / step;
  for (let y = 0; y < H; y++){
    const v = (y + 0.5) / H, yin = v * vIn, d0 = rowD[y], px = rowX[y];
    for (let x = 0; x < W; x++){
      const u = (x + 0.5) / W, xin = u * uIn, i = y * W + x;
      const wl = WL[i], wh = WH[i];
      const s = Math.sin(pi * (xin - px) / uIn + wl * o.thWarp) * aU;
      const d = d0 + wl * o.dWarp;
      let r = Math.sqrt(s * s + d * d) + wh * o.rWarp;
      let kc = 0, kr = 0, km = 0, kh = 0;
      for (let k = 0; k < knots.length; k++){
        const K = knots[k];
        let dx = xin - K.x, dy = yin - K.y;
        if (dx > halfU) dx -= uIn; else if (dx < -halfU) dx += uIn;
        if (dy > halfV) dy -= vIn; else if (dy < -halfV) dy += vIn;
        const q = (dx * dx) / (K.rx * K.rx) + (dy * dy) / (K.ry * K.ry);
        if (q < 80){
          r += K.amp * Math.exp(-q * 0.09);
          kh = Math.max(kh, Math.exp(-q * 0.22));
          if (q < 3){
            const ang = Math.atan2(dy / K.ry, dx / K.rx);
            const qs = Math.sqrt(q) * (1 + 0.12 * Math.sin(ang * K.lob + K.ph) + wh * 0.35);
            const core = 1 - sstep(0.88, 1.0, qs);
            if (core > kc){ kc = core; kr = qs * 2.6 + wh * 0.6; }
            km = Math.max(km, (sstep(0.7, 0.92, qs) * (1 - sstep(0.96, 1.06, qs))) * (0.35 + 0.65 * K.dead));
          }
        }
      }
      let ri = r * invStep; if (ri > nT - 2) ri = nT - 2; else if (ri < 0) ri = 0;
      const i0 = ri | 0, ph = phaseT[i0] + (phaseT[i0 + 1] - phaseT[i0]) * (ri - i0);
      const t = ph - Math.floor(ph);
      late[i] = t > 0.965 ? sstep(o.lwA, o.lwB, t) * (1 - (t - 0.965) / 0.07) : t < 0.035 ? sstep(o.lwA, o.lwB, 0.965) * (0.5 - t / 0.07) : sstep(o.lwA, o.lwB, t);
      knot[i] = kc; rim[i] = km; halo[i] = kh; kring[i] = kr;
      fib[i] = FB[i];
      low[i] = TN[i];
    }
  }
  return {late, knot, rim, halo, kring, fib, low, W, H, uIn, vIn};
}

/* ---------------------------------------------------------------- SPF framing lumber */
function makeSPF(C, THREE, R){
  const W = 256 * R, H = 1024 * R, uIn = 4.8, vIn = 48, N = W * H;
  const F = ringField(C, W, H, {seed: 101, uIn, vIn, rpi: 11, ringVar: 0.5, d0: 0.85, dAmp: 0.45, dCells: 2, xDrift: 0.18,
                                 thWarp: 0.35, dWarp: 0.25, rWarp: 0.03, lwA: 0.80, lwB: 0.985, knots: 2, knotMin: 0.2, knotMax: 0.8, deadKnots: 0.4});
  const g = grit(N), go = 7919;
  const MO = up(lowField(C, 64, 128, {base: 3, sx: 2, sy: 4, octaves: 4, seed: 103}), W, H);
  /* a couple of faint pitch / mineral streaks: long, thin, darker amber, tapering at both ends */
  const prnd = C.rng(104), streaks = [];
  for (let k = 0; k < 3; k++) streaks.push({x: prnd() * uIn, y: prnd() * vIn, len: 6 + prnd() * 14, w: 0.03 + prnd() * 0.06, a: 0.25 + prnd() * 0.3});
  const rgb = buf("rgb", N * 3), rough = buf("rough", N), hgt = buf("hgt", N);
  const act = [];
  for (let y = 0; y < H; y++){
    const v = (y + 0.5) / H;
    act.length = 0;
    for (let k = 0; k < streaks.length; k++){
      const P = streaks[k];
      let dy = v * vIn - P.y; dy -= Math.round(dy / vIn) * vIn;
      if (Math.abs(dy) > P.len * 0.5) continue;
      const tp = 1 - Math.pow(Math.abs(dy) / (P.len * 0.5), 2);
      act.push(P.x, P.a * tp, 1 / (P.w * P.w * tp + 1e-4));
    }
    for (let x = 0; x < W; x++){
      const i = y * W + x, u = (x + 0.5) / W;
      const L = F.late[i], f = F.fib[i], t = F.low[i], k = F.knot[i], h = F.halo[i], gr = g[(i + go) % g.length];
      const mo = MO[i];
      let ps = 0;
      for (let a = 0; a < act.length; a += 3){
        let dx = u * uIn - act[a] + f * 0.05; dx -= Math.round(dx / uIn) * uIn;
        const e = dx * dx * act[a + 2];
        if (e < 9) ps = Math.max(ps, act[a + 1] * Math.exp(-e));
      }
      /* creamy earlywood, warmer tan latewood */
      let r = 215 - 32 * L, gg = 184 - 42 * L, b = 133 - 42 * L;
      /* broad drift: paler spruce <-> warmer pine/fir, plus a faint grey handling mottle */
      const warm = t * 1.4;
      r += 5 * warm; gg -= 1 * warm; b -= 12 * warm;
      const fm = 1 + f * 0.11 + gr * 0.03 + mo * 0.05;
      r *= fm; gg *= fm; b *= fm;
      /* resinous darker halo round knots */
      r -= h * 14; gg -= h * 24; b -= h * 28;
      if (k > 0){
        const ring = 0.9 + 0.1 * Math.cos(F.kring[i] * 6.283);
        r += (124 * ring - r) * k; gg += (82 * ring - gg) * k; b += (50 * ring - b) * k;
      }
      const m = F.rim[i];
      r += (62 - r) * m; gg += (40 - gg) * m; b += (26 - b) * m;
      r += (168 - r) * ps; gg += (120 - gg) * ps; b += (70 - b) * ps;
      rgb[i*3] = r; rgb[i*3+1] = gg; rgb[i*3+2] = b;
      rough[i] = 0.77 - L * 0.06 + f * 0.07 + gr * 0.05 - k * 0.14 + mo * 0.04;
      hgt[i] = f * 0.004 + L * 0.0012 + gr * 0.0008 + k * 0.001 - m * 0.003;
    }
  }
  return mat(C, THREE, W, H, rgb, rough, hgt, uIn / W, vIn / H, {tile: [uIn / 12, vIn / 12]});
}

/* southern-yellow-pine deck stock: tile spans 12" (two boards' worth) so neighbouring 5.5" boards show
   different parts of the log (flat-sawn cathedral in one, straighter rift grain in the next) */
function deckField(C, R){
  return ringField(C, 256 * R, 1024 * R, {seed: 201, uIn: 12, vIn: 48, rpi: 5, ringVar: 0.45, d0: 2.0, dAmp: 0.8, dCells: 2, xDrift: 0.15,
                                          thWarp: 0.2, dWarp: 0.35, rWarp: 0.02, lwA: 0.5, lwB: 0.82, knots: 1, knotMin: 0.45, knotMax: 0.95, deadKnots: 0.2});
}
/* incised pressure-treated stock is usually hem-fir: finer rings, narrow latewood */
function ptField(C, R){
  return ringField(C, 256 * R, 1024 * R, {seed: 251, uIn: 6, vIn: 48, rpi: 8, ringVar: 0.5, d0: 1.0, dAmp: 0.5, dCells: 2, xDrift: 0.2,
                                          thWarp: 0.3, dWarp: 0.3, rWarp: 0.025, lwA: 0.7, lwB: 0.95, knots: 1, knotMin: 0.4, knotMax: 0.9, deadKnots: 0.3});
}

/* ---------------------------------------------------------------- pressure-treated sill stock (incised) */
function makePT(C, THREE, F){
  const W = F.W, H = F.H, uIn = F.uIn, vIn = F.vIn, N = W * H;
  const g = grit(N), go = 104729, rnd = C.rng(302);
  const BL = up(lowField(C, 32, 128, {base: 3, sx: 1, sy: 2, octaves: 4, seed: 303}), W, H);
  /* incising: staggered slits ~0.45" x 0.08", columns every 0.5", rows every 0.75" */
  const cols = 12, rows = 64, cw = uIn / cols, rh = vIn / rows, slitL = 0.42, slitW = 0.065;
  const jit = new Float32Array(cols * rows * 4);
  for (let i = 0; i < jit.length; i++) jit[i] = rnd() - 0.5;
  const rgb = buf("rgb", N * 3), rough = buf("rough", N), hgt = buf("hgt", N);
  for (let y = 0; y < H; y++){
    const v = (y + 0.5) / H, yin = v * vIn;
    const ry = Math.floor(yin / rh), rowOff = (ry & 1) ? 0.5 : 0, rmod = (ry % rows) * cols;
    for (let x = 0; x < W; x++){
      const i = y * W + x, u = (x + 0.5) / W, xin = u * uIn, gr = g[(i + go) % g.length];
      const L = F.late[i], f = F.fib[i], k = F.knot[i];
      const bl = BL[i];
      const cxf = xin / cw - rowOff, cx = Math.floor(cxf + 0.5);
      const ci = ((((cx % cols) + cols) % cols) + rmod) * 4;
      const sx = (cxf - cx) * cw + jit[ci] * 0.06, sy = (yin - (ry + 0.5) * rh) + jit[ci + 1] * 0.12;
      const qx = Math.abs(sx) / (slitW * (0.85 + jit[ci + 3] * 0.4)), qy = Math.abs(sy) / (slitL * (0.5 + jit[ci + 3] * 0.15));
      let slit = 0, lip = 0;
      if (qy < 1.3 && qx < 6){
        slit = (1 - sstep(0.6, 1.2, qx)) * (1 - sstep(0.7, 1.0, qy)) * (0.6 + jit[ci + 2] * 0.8);
        const ex = qx > 1 ? (qx - 1) * 0.5 : 0;
        lip = Math.exp(-ex * ex) * (1 - slit) * (1 - sstep(0.9, 1.3, qy));
      }
      /* greenish-tan: pale olive-tan earlywood, darker brown-olive latewood, greener copper blotches */
      let r = 166 - 34 * L, gg = 155 - 32 * L, b = 110 - 28 * L;
      const green = bl * 1.2;
      r -= 12 * green; gg += 1 * green; b -= 3 * green;
      const fm = 1 + f * 0.1 + gr * 0.035;
      r *= fm; gg *= fm; b *= fm;
      r -= F.halo[i] * 20; gg -= F.halo[i] * 18; b -= F.halo[i] * 16;
      if (k > 0){ const ring = 0.8 + 0.2 * Math.cos(F.kring[i] * 6.283); r += (104 * ring - r) * k; gg += (88 * ring - gg) * k; b += (54 * ring - b) * k; }
      const m = F.rim[i]; r += (52 - r) * m; gg += (46 - gg) * m; b += (30 - b) * m;
      /* slit: deep olive inside, faint dark lip */
      r = r * (1 - slit * 0.42) - lip * 5; gg = gg * (1 - slit * 0.34) - lip * 4; b = b * (1 - slit * 0.44) - lip * 4;
      rgb[i*3] = r; rgb[i*3+1] = gg; rgb[i*3+2] = b;
      rough[i] = 0.66 - L * 0.06 + f * 0.06 + gr * 0.05 + slit * 0.15 + bl * 0.1;
      hgt[i] = f * 0.006 + L * 0.003 + gr * 0.0015 - slit * 0.035 + lip * 0.004;
    }
  }
  return mat(C, THREE, W, H, rgb, rough, hgt, uIn / W, vIn / H, {tile: [uIn / 12, vIn / 12]});
}

/* ---------------------------------------------------------------- LVL / laminated header stock */
function makeLVL(C, THREE, R){
  const W = 256 * R, H = 1024 * R, uIn = 4.5, vIn = 48, N = W * H;
  const rnd = C.rng(401), g = grit(N), go = 31337;
  /* plies across the tile: ~1/8" each, variable, with per-ply tone and an occasional darker (heartwood) ply */
  const nP = 36, th = [];
  let sum = 0;
  for (let i = 0; i < nP; i++){ const t = 0.75 + rnd() * 0.5; th.push(t); sum += t; }
  const edges = [0]; for (let i = 0; i < nP; i++) edges.push(edges[i] + th[i] / sum * uIn);
  const plyTone = [], plyWarm = [], plyJoint = [];
  for (let i = 0; i < nP; i++){ plyTone.push((rnd() - 0.5) * 0.16); plyWarm.push(rnd() < 0.22 ? 0.6 + rnd() * 0.4 : rnd() * 0.3); plyJoint.push(rnd() * vIn); }
  const plyOf = new Int16Array(W), plyPos = new Float32Array(W);
  for (let x = 0, p = 0; x < W; x++){ const xin = (x + 0.5) / W * uIn; while (edges[p + 1] < xin) p++; plyOf[x] = p; plyPos[x] = (xin - edges[p]) / (edges[p + 1] - edges[p]); }
  const ST = up(lowField(C, W >> 1, H >> 5, {base: 4, sx: 20, sy: 1, octaves: 3, persistence: 0.65, seed: 403}), W, H);
  const FG = up(lowField(C, 64, 128, {base: 2, sx: 1, sy: 6, octaves: 4, seed: 404}), W, H);
  const rgb = buf("rgb", N * 3), rough = buf("rough", N), hgt = buf("hgt", N);
  const pxIn = uIn / W;
  for (let y = 0; y < H; y++){
    const v = (y + 0.5) / H, yin = v * vIn;
    for (let x = 0; x < W; x++){
      const i = y * W + x, u = (x + 0.5) / W, p = plyOf[x], pp = plyPos[x], gr = g[(i + go) % g.length];
      const st = ST[i], fg = FG[i];
      /* phenolic glue line at each ply boundary */
      const dEdge = Math.min(pp, 1 - pp) * (edges[p + 1] - edges[p]);
      const glue = 1 - sstep(0.003, 0.003 + pxIn * 1.1, dEdge);
      /* veneer butt / scarf joint: short dark slanted line across the ply */
      let jd = yin - plyJoint[p] - (pp - 0.5) * 0.3; jd -= Math.round(jd / vIn) * vIn;
      const joint = 1 - sstep(0.015, 0.06, Math.abs(jd));
      /* rotary-cut figure: soft wavy bands, broken by plies */
      const fig = Math.sin((fg * 9 + p * 0.37) * 6.283) * 0.5 + 0.5;
      const w = plyWarm[p];
      const m = 1 + plyTone[p] + st * 0.14 + gr * 0.03 - fig * 0.06;
      let r = (212 - 10 * w) * m, gg = (166 - 26 * w) * m, b = (104 - 24 * w) * m;
      r += (104 - r) * glue * 0.6; gg += (68 - gg) * glue * 0.6; b += (40 - b) * glue * 0.6;
      r += (126 - r) * joint * 0.45; gg += (88 - gg) * joint * 0.45; b += (52 - b) * joint * 0.45;
      rgb[i*3] = r; rgb[i*3+1] = gg; rgb[i*3+2] = b;
      rough[i] = 0.6 + st * 0.1 + gr * 0.04 + glue * 0.08 - fg * 0.06;
      hgt[i] = st * 0.002 + gr * 0.0008 - glue * 0.002 - joint * 0.002;
    }
  }
  return mat(C, THREE, W, H, rgb, rough, hgt, uIn / W, vIn / H, {tile: [uIn / 12, vIn / 12]});
}

/* ---------------------------------------------------------------- stained deck stock
   One pass builds both stains from the same boards: "deck" (semi-transparent brown on the walking surface) and
   "dark" (more opaque, darker stain on joists, rails, posts, stringers). They share normal + roughness maps. */
function makeDeck(C, THREE, F){
  const W = F.W, H = F.H, uIn = F.uIn, vIn = F.vIn, N = W * H;
  const g = grit(N), go = 9001, rnd = C.rng(504);
  const WR = up(lowField(C, 32, 128, {base: 2, sx: 2, sy: 3, octaves: 5, seed: 506}), W, H);
  /* drying checks: thin cracks along the grain */
  const checks = [];
  for (let i = 0; i < 7; i++) checks.push({x: rnd() * uIn, y: rnd() * vIn, len: 2 + rnd() * 8, w: 0.015 + rnd() * 0.02});
  const rgb = buf("rgb", N * 3), rgb2 = buf("rgb2", N * 3), rough = buf("rough", N), hgt = buf("hgt", N);
  /* stain colours (sRGB): earlywood / latewood; the dark stain is more opaque so grain contrast is lower */
  const E = [110, 80, 66], Lw = [97, 70, 58], E2 = [75, 55, 45], L2 = [69, 50, 42];
  const act = [];
  for (let y = 0; y < H; y++){
    const v = (y + 0.5) / H, yin = v * vIn;
    act.length = 0;
    for (let c = 0; c < checks.length; c++){
      const K = checks[c];
      let dy = yin - K.y; dy -= Math.round(dy / vIn) * vIn;
      if (Math.abs(dy) < K.len * 0.5) act.push(K.x, K.w * (1 - Math.pow(Math.abs(dy) / (K.len * 0.5), 2)));
    }
    for (let x = 0; x < W; x++){
      const i = y * W + x, j = i * 3, u = (x + 0.5) / W, xin = u * uIn, gr = g[(i + go) % g.length];
      const L = F.late[i], f = F.fib[i], k = F.knot[i], m = F.rim[i], h = F.halo[i];
      const worn = sstep(0.0, 0.42, WR[i]);
      const fm = 1 + f * 0.15 + gr * 0.035 + F.low[i] * 0.07;
      let ck = 0;
      for (let c = 0; c < act.length; c += 2){
        let dx = xin - act[c] - f * 0.02; dx -= Math.round(dx / uIn) * uIn;
        const wv = act[c + 1];
        ck = Math.max(ck, 1 - sstep(wv * 0.5, wv * 0.5 + 0.025, Math.abs(dx)));
      }
      const ring = k > 0 ? 0.9 + 0.1 * Math.cos(F.kring[i] * 6.283) : 1;
      for (let s = 0; s < 2; s++){
        const e = s ? E2 : E, l = s ? L2 : Lw, out = s ? rgb2 : rgb;
        let r = (e[0] + (l[0] - e[0]) * L) * fm, gg = (e[1] + (l[1] - e[1]) * L) * fm, b = (e[2] + (l[2] - e[2]) * L) * fm;
        /* worn: stain thinned on earlywood -> lighter, greyer */
        const wE = worn * (1 - L * 0.8) * (s ? 0.45 : 1);
        r += (126 - r) * wE * 0.3; gg += (104 - gg) * wE * 0.3; b += (90 - b) * wE * 0.3;
        r -= h * 10; gg -= h * 9; b -= h * 7;
        if (k > 0){ const kk = k * (s ? 0.3 : 0.45); r += (78 * ring - r) * kk; gg += (54 * ring - gg) * kk; b += (43 * ring - b) * kk; }
        const mm = m * (s ? 0.35 : 0.5); r += (50 - r) * mm; gg += (35 - gg) * mm; b += (28 - b) * mm;
        r += (34 - r) * ck * 0.7; gg += (25 - gg) * ck * 0.7; b += (20 - b) * ck * 0.7;
        out[j] = r; out[j+1] = gg; out[j+2] = b;
      }
      /* intact stain keeps a soft sheen; worn wood goes matte */
      rough[i] = 0.54 + worn * 0.2 - L * 0.05 + f * 0.06 + gr * 0.05 + ck * 0.2;
      /* weathered: earlywood erodes so latewood ridges stand proud */
      hgt[i] = L * 0.012 + f * 0.007 + gr * 0.0015 - ck * 0.03 + k * 0.003;
    }
  }
  const deck = mat(C, THREE, W, H, rgb, rough, hgt, uIn / W, vIn / H, {tile: [uIn / 12, vIn / 12]});
  /* dark stain: own colour map, deck's relief at reduced strength, roughness pushed up ~15% (opaque stain is flatter) */
  const dark = C.material(THREE, {map: toCanvas(C, W, H, rgb2), roughness: 1.15, tile: [uIn / 12, vIn / 12], grain: "long", jitter: 1});
  dark.normalMap = deck.normalMap; dark.normalScale = new THREE.Vector2(0.6, 0.6); dark.roughnessMap = deck.roughnessMap;
  dark.needsUpdate = true;
  return {deck, dark};
}

/* ---------------------------------------------------------------- end grain
   Faces perpendicular to a piece's long axis (cut ends) soak up more stain / show darker, rougher end grain.
   Chains onto core.worldUV's onBeforeCompile; k = albedo multiplier on end faces. */
function endGrain(m, k, dr){
  const prev = m.onBeforeCompile;
  m.onBeforeCompile = function(shader, renderer){
    if (prev) prev.call(this, shader, renderer);
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying float vWoodEnd;")
      .replace("#include <begin_vertex>", `#include <begin_vertex>
        vWoodEnd = 0.0;
        #ifdef USE_INSTANCING
          vec3 weS = vec3(length(instanceMatrix[0].xyz), length(instanceMatrix[1].xyz), length(instanceMatrix[2].xyz));
          vec3 weN = abs(normal);
          float weA = weN.x > 0.5 ? weS.x : (weN.y > 0.5 ? weS.y : weS.z);
          float weMax = max(weS.x, max(weS.y, weS.z));
          float weMid = weS.x + weS.y + weS.z - weMax - min(weS.x, min(weS.y, weS.z));
          vWoodEnd = (weA >= weMax * 0.999 && weMax > weMid * 2.0) ? 1.0 : 0.0;
        #endif`);
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nvarying float vWoodEnd;")
      .replace("#include <map_fragment>", "#include <map_fragment>\n  diffuseColor.rgb *= mix(1.0, " + k.toFixed(3) + ", vWoodEnd);")
      .replace("#include <roughnessmap_fragment>", "#include <roughnessmap_fragment>\n  roughnessFactor = min(1.0, roughnessFactor + " + dr.toFixed(3) + " * vWoodEnd);");
  };
  const prevKey = m.customProgramCacheKey;
  m.customProgramCacheKey = function(){ return (prevKey ? prevKey.call(this) : "") + "|woodEnd" + k + ":" + dr; };
  m.needsUpdate = true;
  return m;
}

/* ---------------------------------------------------------------- lattice skirt
   45-degree lattice: 1.5" slats on a 4" pitch (2.5" openings), front family laid over back family.
   The canvas covers 2 x 2 diamond periods (T = 2 * 4" * sqrt2 = 11.3") so it tiles exactly. */
function makeLattice(C, THREE, R){
  const W = 256 * R, H = W, p = 4, sw = 1.5, tIn = 0.3;
  const T = 2 * p * Math.SQRT2, pxIn = T / W, N = W * H, rs2 = Math.SQRT1_2, P4 = 4 * p;
  const rnd = C.rng(601), g = grit(N), go = 4242;
  /* 4 slat loops (2 per family), each 4p long on the torus: own tone, grain phase, wobble, ring density */
  const S = [];
  for (let i = 0; i < 4; i++) S.push({tone: (rnd() - 0.5) * 0.14, off: rnd(), wob: noise1(5, rnd), wob2: noise1(13, rnd), rpi: 4 + rnd() * 3});
  const fibF = lowField(C, 64, 32, {base: 4, sx: 6, sy: 1, octaves: 3, seed: 603});
  const rgb = buf("rgb", N * 3), alpha = buf("alpha", N), hgt = buf("hgt", N), rough = buf("rough", N);
  const E = [86, 62, 50], Lw = [76, 54, 44];
  for (let y = 0; y < H; y++){
    for (let x = 0; x < W; x++){
      const i = y * W + x, X = (x + 0.5) * pxIn, Y = (y + 0.5) * pxIn, gr = g[(i + go) % g.length];
      const tA = (X + Y) * rs2, sA = (X - Y) * rs2;            /* family A: across / along */
      const iA = Math.round(tA / p), dA = tA - iA * p, kA = ((iA % 2) + 2) % 2;
      const iB = Math.round(sA / p), dB = sA - iB * p, kB = ((iB % 2) + 2) % 2;   /* family B: across = sA, along = tA */
      const eA = sw / 2 - Math.abs(dA), eB = sw / 2 - Math.abs(dB);
      const cA = Math.min(1, Math.max(0, eA / pxIn + 0.5)), cB = Math.min(1, Math.max(0, eB / pxIn + 0.5));
      alpha[i] = cA > cB ? cA : cB;
      const front = cA > 0.5;
      let si, d, sc, e;
      if (front){ si = kA; d = dA; e = eA; sc = sA - (iA - kA) * p; }
      else { si = 2 + kB; d = dB; e = eB; sc = tA - (iB - kB) * p; }
      sc = (sc - Math.floor(sc / P4) * P4) / P4;
      const Sl = S[si];
      const gp = (d + Sl.wob(sc) * 0.5 + Sl.wob2(sc) * 0.1) * Sl.rpi + Sl.off;
      const L = sstep(0.55, 0.85, gp - Math.floor(gp));
      const fb = samp(fibF, (d / sw + 0.5) * 0.25 + si * 0.25, sc);
      if (alpha[i] < 0.01){
        /* opening: opaque dark brown so mip levels average toward the shadowed gaps, never black */
        rgb[i*3] = E[0] * 0.45; rgb[i*3+1] = E[1] * 0.45; rgb[i*3+2] = E[2] * 0.45;
        hgt[i] = 0; rough[i] = 0.8;
        continue;
      }
      let m = 1 + Sl.tone + fb * 0.12 + gr * 0.04;
      /* eased edges a touch darker; back slats occluded beside the front slats */
      m *= 1 - 0.2 * (1 - sstep(0, 0.14, e));
      if (!front){ m *= 0.88 * (1 - 0.45 * Math.exp(-Math.max(0, -eA) / 0.2)); }
      rgb[i*3] = (E[0] + (Lw[0] - E[0]) * L) * m; rgb[i*3+1] = (E[1] + (Lw[1] - E[1]) * L) * m; rgb[i*3+2] = (E[2] + (Lw[2] - E[2]) * L) * m;
      hgt[i] = (cA > 0.01 ? tIn * (1 + sstep(0, 0.12, eA)) : (cB > 0.01 ? tIn * sstep(0, 0.12, eB) : 0)) * 0.12 + L * 0.004 + fb * 0.004;
      rough[i] = 0.64 + fb * 0.08 + gr * 0.05 + (1 - sstep(0, 0.12, e)) * 0.05;
    }
  }
  return mat(C, THREE, W, H, rgb, rough, hgt, pxIn, pxIn, {alphaMap: greyCanvas(C, W, H, alpha), alphaTest: 0.5, tile: [T / 12, T / 12], grain: "none"});
}

/* ---------------------------------------------------------------- public */
REAL.wood = {
  create: function(THREE, renderer, opts){
    opts = opts || {};
    const C = REAL.core, R = opts.res === 0.5 ? 0.5 : 1;   /* 0.5 = half-size canvases for weak devices */
    const t0 = performance.now(), T = {}; let tl = t0;
    const lap = k => { const n = performance.now(); T[k] = Math.round(n - tl); tl = n; };
    const spf = makeSPF(C, THREE, R); lap("spf");
    const pt = makePT(C, THREE, ptField(C, R)); lap("pt");
    const lvl = makeLVL(C, THREE, R); lap("lvl");
    const DF = deckField(C, R); lap("deckField");
    const D = makeDeck(C, THREE, DF), deck = D.deck, deckDark = D.dark; lap("deck+deckDark");
    const lattice = makeLattice(C, THREE, R); lap("lattice");
    endGrain(spf, 0.86, 0.08); endGrain(pt, 0.82, 0.08); endGrain(lvl, 0.84, 0.06);
    endGrain(deck, 0.72, 0.15); endGrain(deckDark, 0.8, 0.1);
    for (const k in POOL) delete POOL[k];   /* free the ~10 MB of scratch floats; canvases hold the results */
    GRIT = null;
    const ms = performance.now() - t0;
    REAL.wood.buildMs = ms; REAL.wood.timing = T;
    return {
      buildMs: ms,
      variants: {
        spf:      {material: spf,      sample: [0.125, 8, 0.29]},
        pt:       {material: pt,       sample: [12, 0.125, 0.46], spread: [0, 0, 0.6]},
        lvl:      {material: lvl,      sample: [8, 0.77, 0.29], spread: [0, 0, 0.6]},
        deck:     {material: deck,     sample: [8, 0.1, 0.46], spread: [0, 0, 0.48], count: 5},
        deckDark: {material: deckDark, sample: [8, 0.77, 0.125], spread: [0, 0, 1.33]},
        lattice:  {material: lattice,  sample: [6, 2.7, 0.05], count: 1}
      }
    };
  }
};
})();
