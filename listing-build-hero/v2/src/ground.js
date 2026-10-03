/* REAL.ground: procedural photoreal ground surfaces for the build (soil, crushed stone, bark mulch, lawn).
   REAL.ground.create(THREE, renderer, opts) -> {
     buildMs,
     variants: { soil, gravel, mulch, lawnBox },          box pieces with world-scaled UVs (core.worldUV)
     lawnMaterial(sizeFeet) -> MeshStandardMaterial      for ONE flat PlaneGeometry(sizeFeet, sizeFeet), plain 0..1 UVs
   }
   REAL.ground.grass(THREE, renderer, {areas:[{x0,x1,z0,z1}], density, height, seed, max}) -> InstancedMesh of 3D grass tufts

   How it is made (no images; deterministic seeds; canvas 2D + REAL.core noise):
   - Detail maps are drawn by a small JS scanline rasteriser that writes colour, tangent normal, height and roughness
     for every primitive at once, so the maps agree pixel for pixel: individual grass blades (V-folded, leaning, cut or
     pointed tips), clover leaflets, shredded-bark strips with fibres, faceted crushed stones (each facet a plane with an
     analytic normal), soil clods and partly buried stones.
   - Each material gets a shader patch (groundPatch) that, in WORLD space:
       * samples every map twice (second copy rotated + rescaled) and picks between the two by height with a
         low-frequency world noise bias, so the tile never repeats visibly and transitions stay crisp (taller blade /
         chip / stone wins instead of a blurry cross-fade);
       * applies a 256px macro noise texture at four unrelated scales for tone, hue and roughness variation;
       * lawn only: clover patches (a second detail texture), dry/yellow patches, lush dark patches, view-dependent
         mowing stripes (anti-aliased with fwidth so they never moire at distance), and a grazing-angle canopy fill
         (looking across a lawn you see blade sides, not the dark gaps between them);
       * soil only: damp, darker, glossier patches.
   - Data maps: roughness texture R = height (0..1, used for the height blend), G = roughness (three reads .g). */
(function(){
"use strict";
const REAL = window.REAL = window.REAL || {};

/* ---------------------------------------------------------------- small helpers */
function cl(v, a, b){ return v < a ? a : v > b ? b : v; }
function c255(v){ return v < 0 ? 0 : v > 255 ? 255 : v; }
function wrap(v, n){ return v < 0 ? v + n : v >= n ? v - n : v; }
function sstep(a, b, x){ let t = (x - a) / (b - a); t = t < 0 ? 0 : t > 1 ? 1 : t; return t * t * (3 - 2 * t); }

/* uniform white noise -0.5..0.5 (xorshift32) */
function white(n, seed){
  const f = new Float32Array(n);
  let s = (Math.imul(seed | 0, 2654435761) | 0) || 1;
  for (let i = 0; i < n; i++){ s ^= s << 13; s ^= s >>> 17; s ^= s << 5; f[i] = (s >>> 0) / 4294967296 - 0.5; }
  return f;
}
/* tileable separable box blur, radius r px, `passes` times */
function blur(f, W, H, r, passes){
  if (r < 1) return f;
  const tmp = new Float32Array(Math.max(W, H)), inv = 1 / (2 * r + 1);
  for (let p = 0; p < (passes || 1); p++){
    for (let y = 0; y < H; y++){
      const row = y * W; let s = 0;
      for (let k = -r; k <= r; k++) s += f[row + ((k % W) + W) % W];
      for (let x = 0; x < W; x++){
        tmp[x] = s * inv;
        let a = x + r + 1; if (a >= W) a -= W;
        let b = x - r; if (b < 0) b += W;
        s += f[row + a] - f[row + b];
      }
      for (let x = 0; x < W; x++) f[row + x] = tmp[x];
    }
    for (let x = 0; x < W; x++){
      let s = 0;
      for (let k = -r; k <= r; k++) s += f[(((k % H) + H) % H) * W + x];
      for (let y = 0; y < H; y++){
        tmp[y] = s * inv;
        let a = y + r + 1; if (a >= H) a -= H;
        let b = y - r; if (b < 0) b += H;
        s += f[a * W + x] - f[b * W + x];
      }
      for (let y = 0; y < H; y++) f[y * W + x] = tmp[y];
    }
  }
  return f;
}
/* low-res tileable fbm (-0.5..0.5) upsampled bilinearly (wrapping) to W x H */
function field(C, W, H, lw, lh, o){
  const f = C.normalize(C.fbm(lw, lh, o));
  const out = new Float32Array(W * H);
  const xi0 = new Int32Array(W), xi1 = new Int32Array(W), xt = new Float32Array(W), row = new Float32Array(lw);
  for (let x = 0; x < W; x++){ let fx = (x + 0.5) / W * lw - 0.5; if (fx < 0) fx += lw; const a = fx | 0; xi0[x] = a; xi1[x] = a + 1 === lw ? 0 : a + 1; xt[x] = fx - a; }
  for (let y = 0; y < H; y++){
    let fy = (y + 0.5) / H * lh - 0.5; if (fy < 0) fy += lh;
    const y0 = fy | 0, y1 = y0 + 1 === lh ? 0 : y0 + 1, ty = fy - y0, r0 = y0 * lw, r1 = y1 * lw;
    for (let x = 0; x < lw; x++) row[x] = f[r0 + x] + (f[r1 + x] - f[r0 + x]) * ty;
    const o2 = y * W;
    for (let x = 0; x < W; x++){ const a = row[xi0[x]]; out[o2 + x] = a + (row[xi1[x]] - a) * xt[x] - 0.5; }
  }
  return out;
}
/* smooth periodic 1D noise table (len 1024, -1..1) for fibres and ragged edges */
function table(seed){
  const n = 1024, f = white(n, seed);
  const g = new Float32Array(n);
  for (let p = 0; p < 2; p++){
    for (let i = 0; i < n; i++){ let s = 0; for (let k = -3; k <= 3; k++) s += f[(i + k + n) & (n - 1)]; g[i] = s / 7; }
    f.set(g);
  }
  let m = 0; for (let i = 0; i < n; i++) m = Math.max(m, Math.abs(f[i]));
  for (let i = 0; i < n; i++) f[i] /= m;
  return f;
}

/* raster buffers: colour in sRGB 0..255, normal xy in CANVAS coords (x right, y down), height 0..1-ish, roughness 0..1 */
const POOL = {};
function buffers(n){
  /* pooled: every generator initialises all channels in its base pass, so buffers are reused across textures */
  if (!POOL[n]) POOL[n] = { r: new Float32Array(n), g: new Float32Array(n), b: new Float32Array(n),
           nx: new Float32Array(n), ny: new Float32Array(n), h: new Float32Array(n), ro: new Float32Array(n) };
  return POOL[n];
}

/* ---------------------------------------------------------------- canvases */
function rgbCanvas(C, W, H, B){
  const c = C.canvas(W, H), ctx = c.getContext("2d"), img = ctx.createImageData(W, H), d = img.data;
  for (let i = 0, k = 0; i < W * H; i++, k += 4){ d[k] = c255(B.r[i]); d[k+1] = c255(B.g[i]); d[k+2] = c255(B.b[i]); d[k+3] = 255; }
  ctx.putImageData(img, 0, 0);
  return c;
}
/* normal map from explicit normals (canvas coords); OpenGL convention, canvas up = +V */
function nrmCanvas(C, W, H, B){
  const c = C.canvas(W, H), ctx = c.getContext("2d"), img = ctx.createImageData(W, H), d = img.data;
  for (let i = 0, k = 0; i < W * H; i++, k += 4){
    let x = B.nx[i], y = B.ny[i], q = x * x + y * y;
    if (q > 0.92){ const s = Math.sqrt(0.92 / q); x *= s; y *= s; q = 0.92; }
    const z = Math.sqrt(1 - q);
    d[k] = (x * 0.5 + 0.5) * 255; d[k+1] = (-y * 0.5 + 0.5) * 255; d[k+2] = (z * 0.5 + 0.5) * 255; d[k+3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return c;
}
/* normal map from a height field in INCHES (pixel = pu inches), slope gain k, optionally mixed with explicit normals */
function heightNrmCanvas(C, W, H, hf, pu, k, B){
  const c = C.canvas(W, H), ctx = c.getContext("2d"), img = ctx.createImageData(W, H), d = img.data;
  const s = k / (2 * pu);
  for (let y = 0; y < H; y++){
    const ru = ((y - 1 + H) % H) * W, rd = ((y + 1) % H) * W, row = y * W;
    for (let x = 0; x < W; x++){
      const xl = x === 0 ? W - 1 : x - 1, xr = x === W - 1 ? 0 : x + 1, i = row + x;
      let nx = -(hf[row + xr] - hf[row + xl]) * s, ny = (hf[ru + x] - hf[rd + x]) * s, nz = 1;   /* ny: +V = canvas up */
      if (B){ nx += B.nx[i]; ny -= B.ny[i]; }
      const inv = 1 / Math.sqrt(nx * nx + ny * ny + nz * nz), k4 = i * 4;
      d[k4] = (nx * inv * 0.5 + 0.5) * 255; d[k4+1] = (ny * inv * 0.5 + 0.5) * 255; d[k4+2] = (nz * inv * 0.5 + 0.5) * 255; d[k4+3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return c;
}
/* data map: R = height (0..1), G = roughness, B = 0 */
function dataCanvas(C, W, H, hgt, ro, hlo, hhi){
  const c = C.canvas(W, H), ctx = c.getContext("2d"), img = ctx.createImageData(W, H), d = img.data;
  const hr = 1 / ((hhi - hlo) || 1);
  for (let i = 0, k = 0; i < W * H; i++, k += 4){ d[k] = c255((hgt[i] - hlo) * hr * 255); d[k+1] = c255(ro[i] * 255); d[k+2] = 0; d[k+3] = 255; }
  ctx.putImageData(img, 0, 0);
  return c;
}

/* ---------------------------------------------------------------- rasteriser: one leaning grass blade
   Base at (bx,by), unit direction (dx,dy), projected length L px, base width w px, curv = sideways bend,
   blunt = mower-cut tip. Colour c0 (base) -> c1 (tip). nL/nR = normals of the two halves of the V-fold (canvas
   coords). Height z0 (base) -> z1 (tip). Everything wraps so the tile is seamless. */
const BL = { c0: [0,0,0], c1: [0,0,0], nL: [0,0], nR: [0,0] };
function blade(B, W, H, bx, by, dx, dy, L, w, curv, blunt, z0, z1, ro){
  const hl = L * 0.5, cx = bx + dx * hl, cy = by + dy * hl;
  const hwm = w * 0.5 + Math.abs(curv) * L + 1, A = hl + 1;
  const ax = Math.abs(dx), ay = Math.abs(dy);
  const ex = ax * A + ay * hwm, ey = ay * A + ax * hwm;
  const y0 = Math.floor(cy - ey), y1 = Math.ceil(cy + ey);
  const c0 = BL.c0, c1 = BL.c1, nL = BL.nL, nR = BL.nR, iL = 1 / L, hw0 = w * 0.5;
  const Rr = B.r, Rg = B.g, Rb = B.b, Nx = B.nx, Ny = B.ny, Hh = B.h, Ro = B.ro;
  const c0r = c0[0], c0g = c0[1], c0b = c0[2], dr = c1[0] - c0r, dg = c1[1] - c0g, db = c1[2] - c0b;
  for (let y = y0; y <= y1; y++){
    const py = y + 0.5 - cy;
    let lo = -ex - 1, hi = ex + 1;
    if (ax > 1e-4){ let a = (-A - py * dy) / dx, b = (A - py * dy) / dx; if (a > b){ const t = a; a = b; b = t; } if (a > lo) lo = a; if (b < hi) hi = b; }
    if (ay > 1e-4){ let a = (py * dx - hwm) / dy, b = (py * dx + hwm) / dy; if (a > b){ const t = a; a = b; b = t; } if (a > lo) lo = a; if (b < hi) hi = b; }
    if (lo > hi) continue;
    const xa = Math.ceil(cx + lo - 0.5), xb = Math.floor(cx + hi - 0.5), row = (y < 0 ? y + H : y >= H ? y - H : y) * W;
    for (let x = xa; x <= xb; x++){
      const qx = x + 0.5 - cx;
      const u = qx * dx + py * dy + hl, v = -qx * dy + py * dx;
      if (u < -0.5 || u > L + 0.5) continue;
      const t = u < 0 ? 0 : u > L ? 1 : u * iL;
      const vc = v - curv * u * t;
      const hw = blunt ? hw0 * (1 - 0.3 * t) : hw0 * (1 - t * Math.sqrt(t));
      const av = vc < 0 ? -vc : vc;
      let cov = hw - av + 0.5; if (cov <= 0) continue; if (cov > 1) cov = 1;
      const e0 = u + 0.5, e1 = L - u + 0.5;
      if (e0 < 1) cov *= e0; if (e1 < 1) cov *= e1;
      const i = row + (x < 0 ? x + W : x >= W ? x - W : x);
      const sd = vc >= 0 ? 1.07 : 0.93;
      const k = av < 0.45 * hw ? sd * 1.04 : sd;      /* V-fold halves + faint lighter midrib */
      Rr[i] += ((c0r + dr * t) * k - Rr[i]) * cov;
      Rg[i] += ((c0g + dg * t) * k - Rg[i]) * cov;
      Rb[i] += ((c0b + db * t) * k - Rb[i]) * cov;
      const n = vc >= 0 ? nL : nR;
      Nx[i] += (n[0] - Nx[i]) * cov; Ny[i] += (n[1] - Ny[i]) * cov;
      Hh[i] += (z0 + (z1 - z0) * t - Hh[i]) * cov;
      Ro[i] += (ro - Ro[i]) * cov;
    }
  }
}

/* one leaning blade with random parameters; px = inches per pixel */
function grassBlade(B, W, H, rnd, px, z, pal, o){
  const ang = rnd() * 6.2831853, dx = Math.cos(ang), dy = Math.sin(ang);
  const sinT = o.lean0 + o.lean1 * rnd(), cosT = Math.sqrt(1 - sinT * sinT);
  const len3 = (o.len0 + o.len1 * Math.pow(rnd(), 1.4)) / px;
  const L = Math.max(2, len3 * sinT);
  const w = (o.w0 + o.w1 * rnd()) / px;
  const curv = (rnd() - 0.5) * 0.3;
  const blunt = rnd() < o.cut;
  /* colour: palette pick with jitter; depth shading; dead straw blades */
  let c;
  const pr = rnd();
  if (pr < o.dead) c = [136 + rnd() * 20, 128 + rnd() * 16, 78 + rnd() * 14];
  else { const p = pal[(rnd() * pal.length) | 0], j = 0.9 + rnd() * 0.2, jh = (rnd() - 0.5) * 0.12; c = [p[0] * j * (1 + jh), p[1] * j, p[2] * j * (1 - jh)]; }
  const sh = o.sh0 + o.sh1 * Math.pow(z, 0.9);
  BL.c0[0] = c[0] * sh * 0.72; BL.c0[1] = c[1] * sh * 0.74; BL.c0[2] = c[2] * sh * 0.72;
  BL.c1[0] = c[0] * sh; BL.c1[1] = c[1] * sh; BL.c1[2] = c[2] * sh;
  if (blunt && rnd() < o.frayed){ BL.c1[0] = BL.c1[0] * 0.75 + 34 * sh; BL.c1[1] = BL.c1[1] * 0.8 + 30 * sh; BL.c1[2] = BL.c1[2] * 0.75 + 18 * sh; }
  /* normals: blade face normal (-d cos, sin) plus a sideways V-fold, in canvas coords (x right, y down) */
  const f = o.fold, pxv = -dy, pyv = dx;
  let ax = -dx * cosT + pxv * f, ay = -dy * cosT + pyv * f, az = sinT, il = 1 / Math.sqrt(ax * ax + ay * ay + az * az);
  BL.nL[0] = ax * il; BL.nL[1] = ay * il;
  ax = -dx * cosT - pxv * f; ay = -dy * cosT - pyv * f; il = 1 / Math.sqrt(ax * ax + ay * ay + az * az);
  BL.nR[0] = ax * il; BL.nR[1] = ay * il;
  blade(B, W, H, rnd() * W, rnd() * H, dx, dy, L, w, curv, blunt, z - 0.12, z, o.ro0 + o.ro1 * rnd());
}

/* base under the canopy: dark thatch / soil */
function thatch(C, B, W, H, seed, lo, hi){
  const n = W * H;
  const f1 = field(C, W, H, 64, 64, {octaves: 4, base: 4, seed: seed});
  const wn = blur(white(n, seed + 7), W, H, 1, 1);
  for (let i = 0; i < n; i++){
    const t = cl(0.5 + f1[i] * 0.8 + wn[i] * 2.4, 0, 1);
    B.r[i] = lo[0] + (hi[0] - lo[0]) * t; B.g[i] = lo[1] + (hi[1] - lo[1]) * t; B.b[i] = lo[2] + (hi[2] - lo[2]) * t;
    B.nx[i] = wn[i] * 0.6; B.ny[i] = f1[i] * 0.2; B.h[i] = 0; B.ro[i] = 0.95;
  }
}

/* ---------------------------------------------------------------- lawn: 512px = 3 ft (0.07 in/px) */
const LAWN_FT = 3;
const LAWN_PAL = [
  [116, 148, 38],   /* sunny yellow-green */
  [100, 136, 36],
  [86, 124, 34],    /* mid green */
  [74, 112, 34],
  [64, 104, 40],    /* deep blue-green */
  [108, 140, 44],
  [124, 146, 50]    /* pale */
];
function makeLawn(C, N, seed){
  const W = N, H = N, px = LAWN_FT * 12 / N, B = buffers(W * H), rnd = C.rng(seed);
  thatch(C, B, W, H, seed + 1, [22, 28, 10], [50, 54, 22]);
  const o = { lean0: 0.32, lean1: 0.6, len0: 0.7, len1: 1.6, w0: 0.13, w1: 0.17, cut: 0.72, frayed: 0.3, dead: 0.012,
              sh0: 0.36, sh1: 0.64, fold: 0.38, ro0: 0.52, ro1: 0.18 };
  const layers = 8, total = Math.round(14000 * (N * N) / (512 * 512));
  for (let k = 0; k < layers; k++){
    const cnt = Math.round(total / layers);
    for (let j = 0; j < cnt; j++) grassBlade(B, W, H, rnd, px, (k + rnd()) / layers, LAWN_PAL, o);
  }
  return { W, H, B };
}

/* clover / broadleaf plants drawn ONTO the finished lawn buffers (same tile, same UVs), so where a clover plant is absent
   the clover texture is identical to the lawn. Each plant writes a random rank (0..1, 0 = no leaf) that the shader
   compares with the local patch density, revealing whole plants one by one at a patch fringe. */
function makeCloverOnto(C, lawn, seed){
  const W = lawn.W, H = lawn.H, B = lawn.B, px = LAWN_FT * 12 / W, rnd = C.rng(seed);
  B.h.fill(0);
  const plants = Math.round(3600 * (W * H) / (512 * 512)), lLayers = 6;
  const leafPal = [[118, 158, 50], [104, 148, 48], [92, 138, 50], [126, 164, 58], [84, 128, 48]];
  for (let k = 0; k < lLayers; k++){
    for (let j = 0; j < plants / lLayers; j++){
      const z = 0.45 + 0.55 * (k + rnd()) / lLayers, rank = 0.03 + 0.97 * rnd();
      const cx = rnd() * W, cy = rnd() * H, a = (0.2 + 0.14 * rnd()) / px, phi = rnd() * 6.283;
      const p = leafPal[(rnd() * leafPal.length) | 0], sh = 0.6 + 0.4 * z, j2 = 0.9 + 0.2 * rnd();
      const tilt = (rnd() - 0.5) * 0.5, tx = Math.cos(phi + 1.3) * tilt, ty = Math.sin(phi + 1.3) * tilt;
      for (let l = 0; l < 3; l++){
        const an = phi + l * 2.0944 + (rnd() - 0.5) * 0.4, dx = Math.cos(an), dy = Math.sin(an);
        const aa = a * (0.85 + 0.3 * rnd());
        leaflet(B, W, H, cx + dx * aa * 0.95, cy + dy * aa * 0.95, dx, dy, aa, aa * 0.82, p[0] * sh * j2, p[1] * sh * j2, p[2] * sh * j2, rank, tx, ty);
      }
    }
  }
  return lawn;
}
/* clover normal map: RG = normal xy, B = plant rank (the shader rebuilds z from xy) */
function cloverNrmCanvas(C, W, H, B){
  const c = C.canvas(W, H), ctx = c.getContext("2d"), img = ctx.createImageData(W, H), d = img.data;
  for (let i = 0, k = 0; i < W * H; i++, k += 4){
    let x = B.nx[i], y = B.ny[i], q = x * x + y * y;
    if (q > 0.92){ const s = Math.sqrt(0.92 / q); x *= s; y *= s; }
    d[k] = (x * 0.5 + 0.5) * 255; d[k+1] = (-y * 0.5 + 0.5) * 255; d[k+2] = c255(B.h[i] * 255); d[k+3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return c;
}
/* one obovate leaflet with a pale chevron; slightly cupped */
function leaflet(B, W, H, cx, cy, dx, dy, a, b, cr, cg, cb, z, tx, ty){
  const R = Math.ceil(a + 1);
  for (let y = Math.floor(cy - R); y <= Math.ceil(cy + R); y++){
    const py = y + 0.5 - cy, row = wrap(y, H) * W;
    for (let x = Math.floor(cx - R); x <= Math.ceil(cx + R); x++){
      const qx = x + 0.5 - cx, u = (qx * dx + py * dy) / a, v = (-qx * dy + py * dx) / b;
      /* obovate: wider toward the outer end (u>0), notched at the tip */
      const wv = v / (0.8 + 0.25 * u);
      const d = Math.sqrt(u * u + wv * wv) + (u > 0.6 ? Math.max(0, 0.18 - Math.abs(v) * 0.9) : 0);
      let cov = (1 - d) * a + 0.5; if (cov <= 0) continue; if (cov > 1) cov = 1;
      const i = row + wrap(x, W);
      const chev = Math.abs(Math.abs(v) - (0.25 + u * 0.45));
      const k = (chev < 0.09 && u > -0.4 && u < 0.6 ? 1.22 : 1) * (0.9 + 0.12 * (u + 1) * 0.5);
      B.r[i] += (cr * k - B.r[i]) * cov; B.g[i] += (cg * k - B.g[i]) * cov; B.b[i] += (cb * k - B.b[i]) * cov;
      /* cupped: normal tilts toward the leaflet axis, plus whole-leaf tilt */
      const nx = tx + (dx * u * 0.3 - dy * v * 0.25) * 0.8, ny = ty + (dy * u * 0.3 + dx * v * 0.25) * 0.8;
      B.nx[i] += (nx - B.nx[i]) * cov; B.ny[i] += (ny - B.ny[i]) * cov;
      if (cov > 0.5) B.h[i] = z; B.ro[i] += (0.48 - B.ro[i]) * cov;
    }
  }
}

/* ---------------------------------------------------------------- soil: 1024px = 6 ft (0.07 in/px)
   Connecticut glacial till as dug: yellowish/greyish brown silt-sand with darker topsoil streaks, clods, crumbs,
   rounded grey stones from grit to small cobbles, damp darker patches. */
const SOIL_FT = 6;
function makeSoil(C, N, seed){
  const W = N, H = N, n = W * H, pu = SOIL_FT * 12 / N, rnd = C.rng(seed);
  const B = buffers(n), hf = B.h;
  const Rr = B.r, Rg = B.g, Rb = B.b, Ro = B.ro;
  /* smooth fields at half resolution (looked up with x>>1, y>>1), detail fields at full resolution */
  const W2 = W >> 1, H2 = H >> 1;
  const tone = field(C, W2, H2, 32, 32, {octaves: 4, base: 2, seed: seed + 1});
  const hue = field(C, W2, H2, 32, 32, {octaves: 3, base: 3, seed: seed + 2});
  const lumpH = field(C, W2, H2, 64, 64, {octaves: 4, base: 5, seed: seed + 6});
  const mid = field(C, W, H, 128, 128, {octaves: 4, base: 10, seed: seed + 3});
  const wn2 = white(n, seed + 5), wn = blur(Float32Array.from(wn2), W, H, 1, 1);
  const lump = new Float32Array(n);
  /* base: crumbly till. colours (sRGB): yellowish till, greyish till, dark topsoil streaks */
  for (let i = 0; i < n; i++){
    const i2 = ((i / W | 0) >> 1) * W2 + ((i % W) >> 1);
    const hh = cl(0.5 + hue[i2] * 1.3, 0, 1), dk = sstep(-0.32, 0.12, tone[i2]);
    let r = 128 - 16 * hh, g = 104 - 4 * hh, b = 76 + 10 * hh;
    r = 74 + (r - 74) * dk; g = 58 + (g - 58) * dk; b = 44 + (b - 44) * dk;
    const gr = 1 + wn[i] * 0.5 + wn2[i] * 0.09 + mid[i] * 0.16;
    Rr[i] = r * gr; Rg[i] = g * gr; Rb[i] = b * gr;
    lump[i] = lumpH[i2] * 0.32 + mid[i] * 0.1;          /* base relief in inches (the clod bed) */
    hf[i] = lump[i] + wn[i] * 0.07 + wn2[i] * 0.012;
    Ro[i] = 0.93 + wn[i] * 0.1;
  }
  /* clods: flat-topped, tilted, irregular lumps sitting on the bed; dry crust slightly lighter */
  const clods = Math.round(1200 * n / (1024 * 1024));
  for (let c = 0; c < clods; c++){
    const rIn = 0.18 + 1.9 * Math.pow(rnd(), 2.3), r = rIn / pu, cx = rnd() * W, cy = rnd() * H;
    const ar = 0.55 + 0.45 * rnd(), ang = rnd() * 3.1416, ca = Math.cos(ang), sa = Math.sin(ang);
    const amp = rIn * (0.1 + 0.16 * rnd()), tu = (rnd() - 0.5) * 0.5 * amp, tv = (rnd() - 0.5) * 0.5 * amp;
    const lift = 1.0 + 0.08 * rnd(), R = Math.ceil(r * 1.2 + 1), sharp = 0.25 + 0.3 * rnd();
    for (let y = Math.floor(cy - R); y <= Math.ceil(cy + R); y++){
      const py = y + 0.5 - cy, row = wrap(y, H) * W;
      for (let x = Math.floor(cx - R); x <= Math.ceil(cx + R); x++){
        const qx = x + 0.5 - cx, i = row + wrap(x, W);
        const u = (qx * ca + py * sa) / r, v = (-qx * sa + py * ca) / (r * ar);
        const d2 = u * u + v * v + mid[i] * 1.2 + wn[i] * 0.5;
        if (d2 >= 1) continue;
        const prof = sstep(0, sharp, 1 - d2);
        const top = lump[i] + amp * prof + (tu * u + tv * v) * prof + wn[i] * 0.05;
        if (top > hf[i]){
          hf[i] = top;
          const k = 1 + (lift - 1) * prof;
          Rr[i] *= k; Rg[i] *= k; Rb[i] *= k;
          Ro[i] = 0.96;
        }
      }
    }
  }
  /* stones: grit to small cobbles, rounded, partly buried and coated with soil; damp ring around */
  const stonePal = [[124, 120, 114], [106, 104, 100], [136, 124, 112], [160, 154, 144], [114, 102, 88], [92, 92, 92], [130, 128, 122]];
  const nst = Math.round(800 * n / (1024 * 1024));
  for (let s2 = 0; s2 < nst; s2++){
    const big = rnd();
    const rIn = big < 0.86 ? 0.05 + 0.18 * rnd() : big < 0.99 ? 0.28 + 0.6 * rnd() : 1.0 + 1.2 * rnd();
    const r = rIn / pu, cx = rnd() * W, cy = rnd() * H, ar = 0.6 + 0.4 * rnd(), ang = rnd() * 3.1416;
    const ca = Math.cos(ang), sa = Math.sin(ang), p = stonePal[(rnd() * stonePal.length) | 0], j = 0.88 + 0.24 * rnd();
    const amp = rIn * (0.3 + 0.25 * rnd()), coat = 0.25 + 0.45 * rnd(), R = Math.ceil(r * 1.45 + 1);
    for (let y = Math.floor(cy - R); y <= Math.ceil(cy + R); y++){
      const py = y + 0.5 - cy, row = wrap(y, H) * W;
      for (let x = Math.floor(cx - R); x <= Math.ceil(cx + R); x++){
        const qx = x + 0.5 - cx, i = row + wrap(x, W);
        const u = (qx * ca + py * sa) / r, v = (-qx * sa + py * ca) / (r * ar);
        const d2 = u * u + v * v + mid[i] * 0.3;
        if (d2 >= 2.0) continue;
        if (d2 >= 1){ const k = 1 - 0.1 * (2 - d2); Rr[i] *= k; Rg[i] *= k; Rb[i] *= k; continue; }  /* damp halo */
        const hgt = lump[i] + amp * Math.sqrt(1 - d2 * d2) * 0.8 + 0.03;
        if (hgt > hf[i] - 0.03){
          if (hgt > hf[i]) hf[i] = hgt;
          const m = cl(coat + mid[i] * 1.6 + wn[i] * 0.8 - (1 - d2) * 0.35, 0, 1);   /* soil coating, thicker toward the rim */
          const q = j * (1 + wn[i] * 0.2), sr = p[0] * q, sg = p[1] * q, sb = p[2] * q;
          Rr[i] = sr + (Rr[i] - sr) * m; Rg[i] = sg + (Rg[i] - sg) * m; Rb[i] = sb + (Rb[i] - sb) * m;
          Ro[i] = 0.62 + 0.3 * m;
        }
      }
    }
  }
  /* crumbs: tiny light and dark specks */
  const ncr = Math.round(16000 * n / (1024 * 1024));
  for (let k2 = 0; k2 < ncr; k2++){
    const x = (rnd() * W) | 0, y = (rnd() * H) | 0, i = y * W + x, k = rnd() < 0.55 ? 0.78 : 1.15;
    Rr[i] *= k; Rg[i] *= k; Rb[i] *= k; hf[i] += 0.03;
    if (rnd() < 0.5){ const i2 = y * W + ((x + 1) % W); Rr[i2] *= k; Rg[i2] *= k; Rb[i2] *= k; hf[i2] += 0.02; }
  }
  return { W, H, B, hf, pu };
}

/* ---------------------------------------------------------------- crushed stone: 1024px = 3 ft (0.035 in/px)
   3/4 in clean crushed stone: angular stones with flat fracture facets, piled in layers, dark fines between. */
const GRAVEL_FT = 3;
function makeGravel(C, N, seed){
  const W = N, H = N, n = W * H, pu = GRAVEL_FT * 12 / N, rnd = C.rng(seed);
  const B = buffers(n), Z = new Float32Array(n);
  const f1 = field(C, W, H, 64, 64, {octaves: 4, base: 8, seed: seed + 1});
  const wn = white(n, seed + 2);
  for (let i = 0; i < n; i++){
    const t = 0.5 + f1[i] * 0.8 + wn[i] * 0.5;
    B.r[i] = 62 + 26 * t; B.g[i] = 59 + 25 * t; B.b[i] = 55 + 22 * t;
    B.nx[i] = wn[i] * 0.8; B.ny[i] = f1[i] * 0.8; B.ro[i] = 0.92; Z[i] = -1e3; B.h[i] = 0;
  }
  const pal = [[120, 121, 123], [130, 129, 126], [140, 138, 134], [110, 111, 113], [128, 123, 117], [136, 130, 126], [116, 117, 116], [148, 146, 141]];
  const vx = new Float32Array(10), vy = new Float32Array(10), enx = new Float32Array(10), eny = new Float32Array(10), es = new Float32Array(10), ec = new Float32Array(10), fsh = new Float32Array(11);
  const layers = 4, perLayer = Math.round(2700 * n / (1024 * 1024));
  for (let k = 0; k < layers; k++){
    for (let s = 0; s < perLayer; s++){
      const fine = rnd() < 0.22;
      const rIn = fine ? 0.08 + 0.12 * rnd() : 0.24 + 0.22 * rnd();   /* radius in inches: 1/2..1 in stones, plus fines */
      const r = rIn / pu, cx = rnd() * W, cy = rnd() * H, base = (k + rnd() * 0.8) * 0.28 / pu;   /* layer base in px-height units */
      const nv = 5 + ((rnd() * 4) | 0), a0 = rnd() * 6.283;
      const elong = 0.7 + 0.3 * rnd(), ea = rnd() * 3.1416, eca = Math.cos(ea), esa = Math.sin(ea);
      for (let v = 0; v < nv; v++){
        const an = a0 + (v + (rnd() - 0.5) * 0.7) * 6.2832 / nv, rr = r * (0.75 + 0.4 * rnd());
        let lx = Math.cos(an) * rr, ly = Math.sin(an) * rr * elong;
        vx[v] = cx + lx * eca - ly * esa; vy[v] = cy + lx * esa + ly * eca;
      }
      /* peak (crest of the stone) and facet planes through each edge */
      const pkx = cx + (rnd() - 0.5) * r * 0.6, pky = cy + (rnd() - 0.5) * r * 0.6, pkh = r * (0.45 + 0.35 * rnd());
      let ok = true;
      for (let v = 0; v < nv; v++){
        const w2 = (v + 1) % nv, ex = vx[w2] - vx[v], ey = vy[w2] - vy[v], el = Math.sqrt(ex * ex + ey * ey) || 1;
        let nx = -ey / el, ny = ex / el;                 /* inward for CCW */
        let dp = (pkx - vx[v]) * nx + (pky - vy[v]) * ny;
        if (dp < 0){ nx = -nx; ny = -ny; dp = -dp; }
        if (dp < 0.5){ ok = false; break; }
        enx[v] = nx; eny[v] = ny; es[v] = pkh / dp; ec[v] = -(vx[v] * nx + vy[v] * ny);
        fsh[v] = 0.9 + 0.2 * rnd();
      }
      if (!ok) continue;
      const cap = pkh * (0.6 + 0.35 * rnd()), tX = (rnd() - 0.5) * 0.5, tY = (rnd() - 0.5) * 0.5;
      fsh[nv] = 1.0 + 0.08 * rnd();
      const p = pal[(rnd() * pal.length) | 0], j = 0.86 + 0.28 * rnd();
      const sh = 0.62 + 0.38 * (k + 1) / layers;
      const sr = p[0] * j * sh, sg = p[1] * j * sh, sb = p[2] * j * sh;
      let bx0 = 1e9, bx1 = -1e9, by0 = 1e9, by1 = -1e9;
      for (let v = 0; v < nv; v++){ if (vx[v] < bx0) bx0 = vx[v]; if (vx[v] > bx1) bx1 = vx[v]; if (vy[v] < by0) by0 = vy[v]; if (vy[v] > by1) by1 = vy[v]; }
      for (let y = Math.floor(by0); y <= Math.ceil(by1); y++){
        const py = y + 0.5, row = wrap(y, H) * W;
        for (let x = Math.floor(bx0); x <= Math.ceil(bx1); x++){
          const qx = x + 0.5;
          let hmin = 1e9, fi = -1;
          for (let v = 0; v < nv; v++){
            const d = qx * enx[v] + py * eny[v] + ec[v];
            if (d < 0){ fi = -2; break; }
            const hh = d * es[v];
            if (hh < hmin){ hmin = hh; fi = v; }
          }
          if (fi < 0) continue;
          let gx, gy, fs;
          if (hmin > cap){ hmin = cap; gx = 0; gy = 0; fs = fsh[nv]; } else { gx = es[fi] * enx[fi]; gy = es[fi] * eny[fi]; fs = fsh[fi]; }
          const zz = base + hmin + tX * (qx - cx) + tY * (py - cy);
          const i = row + wrap(x, W);
          if (zz <= Z[i]) continue;
          Z[i] = zz;
          gx += tX; gy += tY;
          /* edge darkening where facets are steep (tiny shadowed chips) and dust on flat tops */
          const steep = Math.min(1, Math.sqrt(gx * gx + gy * gy));
          const dust = 1 + 0.08 * (1 - steep);
          const kk = fs * dust * (1 + wn[i] * 0.12);
          B.r[i] = sr * kk; B.g[i] = sg * kk; B.b[i] = sb * kk;
          const gl2 = 1 / Math.sqrt(1 + gx * gx + gy * gy);
          B.nx[i] = -gx * gl2; B.ny[i] = -gy * gl2; B.ro[i] = 0.62 + 0.18 * steep;
        }
      }
    }
  }
  let zmax = -1e9;
  for (let i = 0; i < n; i++){ if (Z[i] < -100) Z[i] = -0.1 / pu; if (Z[i] > zmax) zmax = Z[i]; }
  for (let i = 0; i < n; i++) B.h[i] = Z[i];
  return { W, H, B, zlo: -0.1 / pu, zhi: zmax };
}

/* ---------------------------------------------------------------- shredded bark mulch: 1024px = 3 ft (0.035 in/px) */
const MULCH_FT = 3;
function makeMulch(C, N, seed){
  const W = N, H = N, n = W * H, pu = MULCH_FT * 12 / N, rnd = C.rng(seed);
  const B = buffers(n), hf = new Float32Array(n);
  const f1 = field(C, W, H, 64, 64, {octaves: 4, base: 6, seed: seed + 1});
  const wn = white(n, seed + 2);
  for (let i = 0; i < n; i++){
    const t = 0.5 + f1[i] * 0.8 + wn[i] * 0.4;
    B.r[i] = 22 + 14 * t; B.g[i] = 16 + 10 * t; B.b[i] = 12 + 7 * t; B.ro[i] = 0.95; hf[i] = 0;
  }
  const fib = table(seed + 3), rag = table(seed + 4);
  /* dark-dyed hardwood bark shreds, a few grey weathered and paler inner-wood pieces */
  const pal = [[78, 54, 38], [90, 62, 44], [68, 47, 34], [98, 66, 46], [84, 60, 44], [108, 92, 78], [118, 102, 86], [58, 41, 31], [124, 96, 70]];
  const pw = [0.18, 0.17, 0.16, 0.12, 0.12, 0.07, 0.05, 0.09, 0.04];
  const layers = 9, total = Math.round(11500 * n / (1024 * 1024));
  for (let k = 0; k < layers; k++){
    for (let s = 0; s < total / layers; s++){
      const z = (k + rnd()) / layers;
      const Lin = 0.45 + 2.6 * Math.pow(rnd(), 1.6), Win = 0.12 + 0.5 * Math.pow(rnd(), 1.5);
      const L = Lin / pu, w = Math.min(Win, Lin * 0.6) / pu;
      const ang = rnd() * 6.2832, dx = Math.cos(ang), dy = Math.sin(ang);
      let pr = rnd(), pi = 0; while (pi < pw.length - 1 && pr > pw[pi]){ pr -= pw[pi]; pi++; }
      const p = pal[pi], j = 0.85 + 0.3 * rnd(), sh = 0.38 + 0.62 * Math.pow(z, 0.8);
      const cr = p[0] * j * sh, cg = p[1] * j * sh, cb = p[2] * j * sh;
      const zh = z * 0.9, thick = (0.02 + 0.04 * rnd()), curv = (rnd() - 0.5) * 0.2;
      const tu = (rnd() - 0.5) * 0.12, tv = (rnd() - 0.5) * 0.25;      /* tilt (in/in) along and across */
      const fph = rnd() * 1024, fsc = 2.5 + 2.0 * rnd(), rph = rnd() * 1024, rph2 = rnd() * 1024;
      strip(B, hf, W, H, rnd() * W, rnd() * H, dx, dy, L, w, curv, cr, cg, cb, zh, thick, tu * pu, tv * pu, fib, fph, fsc, rag, rph, rph2, pu);
    }
  }
  return { W, H, B, hf, pu };
}
/* one bark shred: ragged rectangle with fibres along its length, convex across its width */
function strip(B, hf, W, H, cx, cy, dx, dy, L, w, curv, cr, cg, cb, zh, thick, tu, tv, fib, fph, fsc, rag, rph, rph2, pu){
  const hl = L * 0.5, hw = w * 0.5, hwm = hw * 1.3 + Math.abs(curv) * hl + 1, A = hl + 1;
  const ax = Math.abs(dx), ay = Math.abs(dy), ex = ax * A + ay * hwm, ey = ay * A + ax * hwm;
  const y0 = Math.floor(cy - ey), y1 = Math.ceil(cy + ey);
  for (let y = y0; y <= y1; y++){
    const py = y + 0.5 - cy;
    let lo = -ex - 1, hi = ex + 1;
    if (ax > 1e-4){ let a = (-A - py * dy) / dx, b = (A - py * dy) / dx; if (a > b){ const t = a; a = b; b = t; } if (a > lo) lo = a; if (b < hi) hi = b; }
    if (ay > 1e-4){ let a = (py * dx - hwm) / dy, b = (py * dx + hwm) / dy; if (a > b){ const t = a; a = b; b = t; } if (a > lo) lo = a; if (b < hi) hi = b; }
    if (lo > hi) continue;
    const xa = Math.ceil(cx + lo - 0.5), xb = Math.floor(cx + hi - 0.5), row = wrap(y, H) * W;
    for (let x = xa; x <= xb; x++){
      const qx = x + 0.5 - cx, u = qx * dx + py * dy;
      let v = -qx * dy + py * dx;
      v -= curv * u * u / (hl || 1);
      /* ragged width along the length and ragged, fibrous ends */
      const ru = rag[((u * 0.35 + rph) | 0) & 1023], rv = rag[((v * 1.7 + rph2) | 0) & 1023];
      const hwu = hw * (1 + 0.22 * ru);
      const hlu = hl * (1 - 0.12 - 0.12 * rv);
      const av = v < 0 ? -v : v, au = u < 0 ? -u : u;
      let cov = Math.min(hwu - av + 0.5, hlu - au + 0.5);
      if (cov <= 0) continue; if (cov > 1) cov = 1;
      const i = row + wrap(x, W);
      const vn = av / hwu;
      const fv = fib[((v * fsc + fph) | 0) & 1023], fu = fib[((u * 0.08 + fph * 0.5) | 0) & 1023];
      const k = 1 + 0.16 * fv + 0.05 * fu - 0.06 * vn * vn;
      B.r[i] += (cr * k - B.r[i]) * cov; B.g[i] += (cg * k - B.g[i]) * cov; B.b[i] += (cb * k - B.b[i]) * cov;
      const hh = zh + thick * Math.sqrt(Math.max(0, 1 - vn * vn)) + 0.012 * fv + u * tu + v * tv;
      hf[i] += (hh - hf[i]) * cov;
      B.ro[i] += (0.82 + 0.1 * fv - B.ro[i]) * cov;
    }
  }
}

/* ---------------------------------------------------------------- macro noise: 256px RGB, three independent fbm fields */
function makeMacro(C, THREE){
  const S = 256, a = field(C, S, S, 128, 128, {octaves: 5, base: 4, seed: 9101}),
        b = field(C, S, S, 128, 128, {octaves: 5, base: 4, seed: 9203}),
        c = field(C, S, S, 128, 128, {octaves: 5, base: 4, seed: 9307});
  for (let i = 0; i < S * S; i++){ a[i] += 0.5; b[i] += 0.5; c[i] += 0.5; }
  const cv = C.canvas(S, S), ctx = cv.getContext("2d"), img = ctx.createImageData(S, S), d = img.data;
  for (let i = 0, k = 0; i < S * S; i++, k += 4){ d[k] = a[i] * 255; d[k+1] = b[i] * 255; d[k+2] = c[i] * 255; d[k+3] = 255; }
  ctx.putImageData(img, 0, 0);
  const t = C.texture(THREE, cv);
  t.anisotropy = 1;
  return t;
}

/* ---------------------------------------------------------------- the shader patch
   o = { key,
         rep: number | 0         plane mode: vUv = uv * rep (one large plane, plain UVs; textures stay shared)
         s: [s0,s1,s2,s3] ft     macro scales;  a: [a0..a3] tone amplitudes;  hue: warm/cool shift amplitude
         r: [r0, r1]             roughness amplitudes
         blend: [scaleFt, rotRad, uvScale, bias]   second-sample anti-tiling
         lawn: { side:[r,g,b] linear canopy colour seen at grazing, graze, stripe, band, cloverK, dry } | null
         damp: [lo, hi, darken, roughness] | null } */
function groundPatch(THREE, m, T, o){
  const f = v => (+v).toFixed(5);
  const prev = m.onBeforeCompile, prevKey = m.customProgramCacheKey;
  const key = "gnd:" + o.key + (o.rep ? ":p" : "");
  const bl = o.blend, cb = Math.cos(bl[1]), sb = Math.sin(bl[1]);
  const L = o.lawn;
  m.onBeforeCompile = function(shader, renderer){
    if (prev) prev.call(this, shader, renderer);
    shader.uniforms.gMacro = {value: T.macro};
    if (L){ shader.uniforms.gClo = {value: T.clover}; shader.uniforms.gCloN = {value: T.cloverN}; }
    if (o.rep) shader.uniforms.gRep = {value: o.rep};
    let vs = shader.vertexShader;
    if (o.rep) vs = vs.replace("#include <uv_vertex>", "#ifdef USE_UV\n  vUv = uv * gRep;\n#endif");
    shader.vertexShader = "varying vec3 vGW;\nvarying vec3 vGN;\n" + (o.rep ? "uniform float gRep;\n" : "") +
      vs.replace("#include <project_vertex>", `#include <project_vertex>
        vec4 gW4 = vec4(transformed, 1.0);
        vec3 gN3 = objectNormal;
        #ifdef USE_INSTANCING
          gW4 = instanceMatrix * gW4;
          gN3 = mat3(instanceMatrix) * gN3;
        #endif
        vGW = (modelMatrix * gW4).xyz;
        vGN = normalize(mat3(modelMatrix) * gN3);`);
    const lawnMap = L ? `
          /* grazing-angle canopy fill: across a lawn you see blade sides, not the dark gaps between blades */
          vec3 gV = normalize(cameraPosition - vGW);
          float gNV = clamp(dot(normalize(vGN), gV), 0.0, 1.0);
          float gGr = pow(1.0 - gNV, 2.0) * ${f(L.graze)};
          gCol = mix(gCol, vec3(${f(L.side[0])}, ${f(L.side[1])}, ${f(L.side[2])}) * (0.85 + 0.3 * gH), gGr * (1.0 - gH * 0.6));
          /* clover / broadleaf patches: plants appear one by one (rank in cloverN.b) as patch density rises;
             at distance (minified) fall back to blending the mip colour by density */
          float gMC = texture2D(gMacro, mat2(0.96, -0.28, 0.28, 0.96) * gP * ${f(1 / 37.0)} + vec2(0.61, 0.17)).b;
          float gMC2 = texture2D(gMacro, mat2(0.6, 0.8, -0.8, 0.6) * gP * ${f(1 / 6.3)} + vec2(0.33, 0.77)).g;
          float gMask = smoothstep(${f(L.clover[0])}, ${f(L.clover[1])}, gMC + (gMC2 - 0.5) * 0.35);
          vec4 gCNa = texture2D(gCloN, vUv), gCNb = texture2D(gCloN, gUvB);
          vec4 gCN = mix(gCNa, gCNb, gBl);
          vec3 gTC = mix(mapTexelToLinear(texture2D(gClo, vUv)).rgb, mapTexelToLinear(texture2D(gClo, gUvB)).rgb, gBl);
          vec2 gTs = vec2(textureSize(gCloN, 0));
          float gLod = log2(max(1.0, max(length(dFdx(vUv) * gTs), length(dFdy(vUv) * gTs))));
          float gFar = smoothstep(0.6, 2.2, gLod);
          float gNear = smoothstep(-0.03, 0.03, gCN.b - (1.0 - gMask)) * step(0.015, gCN.b);
          gCl = mix(gNear, gMask, gFar);
          gCol = mix(gCol, gTC, gCl);
          /* dry, yellower patches and lusher, darker patches */
          float gDry = smoothstep(0.56, 0.8, gM2 * 0.7 + gMC2 * 0.3);
          gCol *= mix(vec3(1.0), vec3(1.32, 1.1, 0.78), gDry * ${f(L.dry)});
          float gLush = smoothstep(0.55, 0.8, gM0);
          gCol *= mix(vec3(1.0), vec3(0.86, 0.94, 0.92), gLush * 0.8);
          /* mowing stripes: passes along gMw; each pass lies the grass one way, so it reads light or dark by view */
          vec2 gMw = vec2(0.8, 0.6);
          float gSc = dot(gP, vec2(-gMw.y, gMw.x)) / ${f(L.band)} + (gM1 - 0.5) * 1.6;
          float gSg = clamp(sin(gSc * 3.14159) * 3.0, -1.0, 1.0);
          float gAA = 1.0 - smoothstep(0.12, 0.45, fwidth(gSc));
          vec2 gVh = gV.xz / max(length(gV.xz), 1e-3);
          gStr = gSg * dot(gVh, gMw) * gAA * smoothstep(0.6, 0.9, gAN.y) * (1.0 - gCl * 0.6);
          gCol *= 1.0 + ${f(L.stripe)} * gStr;` : "";
    const dampMap = o.damp ? `
          gDp = smoothstep(${f(o.damp[0])}, ${f(o.damp[1])}, gM0 * 0.55 + gM2 * 0.3 + gM3 * 0.15);
          gCol *= 1.0 - ${f(o.damp[2])} * gDp;` : "";
    shader.fragmentShader = "uniform sampler2D gMacro;\nvarying vec3 vGW;\nvarying vec3 vGN;\n" +
      (L ? "uniform sampler2D gClo;\nuniform sampler2D gCloN;\n" : "") +
      shader.fragmentShader
        .replace("#include <map_fragment>", `
          vec3 gAN = abs(vGN);
          vec2 gP = gAN.y > 0.5 ? vGW.xz : (gAN.x > 0.5 ? vec2(vGW.z, vGW.y) : vGW.xy);
          float gM0 = texture2D(gMacro, gP * ${f(1 / o.s[0])} + vec2(0.13, 0.71)).r;
          float gM1 = texture2D(gMacro, mat2(0.8, 0.6, -0.6, 0.8) * gP * ${f(1 / o.s[1])} + vec2(0.57, 0.29)).g;
          float gM2 = texture2D(gMacro, vec2(gP.y, -gP.x) * ${f(1 / o.s[2])} + vec2(0.41, 0.83)).b;
          float gM3 = texture2D(gMacro, mat2(0.6, -0.8, 0.8, 0.6) * gP * ${f(1 / o.s[3])} + vec2(0.23, 0.37)).r;
          float gMB = texture2D(gMacro, mat2(0.28, 0.96, -0.96, 0.28) * gP * ${f(1 / bl[0])} + vec2(0.71, 0.05)).g;
          /* second, rotated + rescaled sample; height decides which one shows */
          vec2 gUvB = mat2(${f(cb)}, ${f(sb)}, ${f(-sb)}, ${f(cb)}) * vUv * ${f(bl[2])} + vec2(0.37, 0.61);
          vec4 gRA = texture2D(roughnessMap, vUv), gRB = texture2D(roughnessMap, gUvB);
          float gBl = smoothstep(-0.08, 0.08, gRB.r - gRA.r + (gMB - 0.5) * ${f(bl[3])});
          vec4 gTA = mapTexelToLinear(texture2D(map, vUv));
          vec4 gTB = mapTexelToLinear(texture2D(map, gUvB));
          vec3 gCol = mix(gTA.rgb, gTB.rgb, gBl);
          float gH = mix(gRA.r, gRB.r, gBl);
          float gCl = 0.0, gStr = 0.0, gDp = 0.0;
          ${lawnMap}
          ${dampMap}
          gCol *= max(0.2, 1.0 + ${f(o.a[0])} * (gM0 - 0.5) * 2.0 + ${f(o.a[1])} * (gM1 - 0.5) * 2.0 + ${f(o.a[2])} * (gM2 - 0.5) * 2.0 + ${f(o.a[3])} * (gM3 - 0.5) * 2.0);
          gCol *= 1.0 + ${f(o.hue)} * (gM1 - 0.5) * 2.0 * vec3(1.0, 0.15, -0.9);
          diffuseColor.rgb *= gCol;`)
        .replace("#include <roughnessmap_fragment>", `
          float roughnessFactor = roughness * mix(gRA.g, gRB.g, gBl);
          roughnessFactor = clamp(roughnessFactor + ${f(o.r[0])} * (gM0 - 0.5) * 2.0 + ${f(o.r[1])} * (gM2 - 0.5) * 2.0, 0.04, 1.0);
          ${L ? "roughnessFactor = mix(roughnessFactor, 0.5, gCl * 0.5) * (1.0 - 0.06 * gStr);" : ""}
          ${o.damp ? `roughnessFactor = mix(roughnessFactor, ${f(o.damp[3])}, gDp);` : ""}`)
        .replace("#include <normal_fragment_maps>", `
          vec3 gNA = texture2D(normalMap, vUv).xyz * 2.0 - 1.0;
          vec3 gNB = texture2D(normalMap, gUvB).xyz * 2.0 - 1.0;
          gNB.xy = mat2(${f(cb)}, ${f(-sb)}, ${f(sb)}, ${f(cb)}) * gNB.xy;
          vec3 mapN = normalize(mix(gNA, gNB, gBl));
          ${L ? "vec3 gNC = vec3(gCN.xy * 2.0 - 1.0, 0.0); gNC.z = sqrt(max(0.08, 1.0 - dot(gNC.xy, gNC.xy))); mapN = normalize(mix(mapN, gNC, gCl * (1.0 - gFar * 0.5)));" : ""}
          ${o.damp ? "mapN = normalize(mix(mapN, vec3(0.0, 0.0, 1.0), gDp * 0.35));" : ""}
          mapN.xy *= normalScale;
          normal = perturbNormal2Arb(-vViewPosition, normal, mapN, faceDirection);`);
  };
  m.customProgramCacheKey = function(){ return (prevKey ? prevKey.call(this) : "") + key; };
  m.userData.ground = o;
  m.needsUpdate = true;
  return m;
}

/* ---------------------------------------------------------------- 3D grass tufts (optional) */
function tuftTexture(C, seed){
  const S = 256, col = C.canvas(S, S), alp = C.canvas(S, S), rnd = C.rng(seed);
  const cc = col.getContext("2d"), ac = alp.getContext("2d");
  cc.fillStyle = "rgb(64,92,36)"; cc.fillRect(0, 0, S, S);
  ac.fillStyle = "#000"; ac.fillRect(0, 0, S, S);
  const n = 46;
  for (let b = 0; b < n; b++){
    const x0 = S * (0.2 + 0.6 * rnd()), lean = (rnd() - 0.5) * S * 0.5, hgt = S * (0.55 + 0.43 * rnd());
    const w = S * (0.012 + 0.014 * rnd()), x1 = x0 + lean, y1 = S - hgt;
    const p = LAWN_PAL[(rnd() * LAWN_PAL.length) | 0], j = 0.85 + 0.3 * rnd();
    const g = cc.createLinearGradient(0, S, 0, y1);
    g.addColorStop(0, `rgb(${p[0] * 0.45 * j | 0},${p[1] * 0.5 * j | 0},${p[2] * 0.45 * j | 0})`);
    g.addColorStop(1, `rgb(${p[0] * j | 0},${p[1] * j | 0},${p[2] * j | 0})`);
    const path = new Path2D();
    path.moveTo(x0 - w, S);
    path.quadraticCurveTo(x0 + lean * 0.2 - w, S - hgt * 0.6, x1, y1);
    path.quadraticCurveTo(x0 + lean * 0.2 + w, S - hgt * 0.6, x0 + w, S);
    path.closePath();
    cc.fillStyle = g; cc.fill(path);
    ac.fillStyle = "#fff"; ac.fill(path);
  }
  return {col, alp};
}

REAL.ground = {
  /* generators exposed for profiling/tests */
  _gen: { makeLawn: (C, N, s) => makeLawn(C, N, s), makeClover: (C, N, s) => makeCloverOnto(C, makeLawn(C, N, s), s + 1), makeSoil: (C, N, s) => makeSoil(C, N, s),
          makeGravel: (C, N, s) => makeGravel(C, N, s), makeMulch: (C, N, s) => makeMulch(C, N, s) },
  create: function(THREE, renderer, opts){
    opts = opts || {};
    const C = REAL.core;
    const t0 = performance.now(), Tm = {}; let tl = t0;
    const lap = k => { const now = performance.now(); Tm[k] = Math.round(now - tl); tl = now; };
    const T = {};
    T.macro = makeMacro(C, THREE); lap("macro");

    /* lawn */
    const lawn = makeLawn(C, 512, 4101); lap("lawnRaster");
    const lawnCol = rgbCanvas(C, lawn.W, lawn.H, lawn.B), lawnN = nrmCanvas(C, lawn.W, lawn.H, lawn.B), lawnD = dataCanvas(C, lawn.W, lawn.H, lawn.B.h, lawn.B.ro, 0, 1);
    lap("lawnCanvas");
    makeCloverOnto(C, lawn, 4207); lap("cloverRaster");
    T.clover = C.texture(THREE, rgbCanvas(C, lawn.W, lawn.H, lawn.B), {srgb: true});
    T.cloverN = C.texture(THREE, cloverNrmCanvas(C, lawn.W, lawn.H, lawn.B));
    lap("cloverCanvas");
    const lawnTex = { map: C.texture(THREE, lawnCol, {srgb: true}), normalMap: C.texture(THREE, lawnN), roughnessMap: C.texture(THREE, lawnD) };
    /* average blade-side colour (linear) seen at grazing angles */
    const lawnSide = [0.085, 0.15, 0.032];
    const lawnPatch = (key, rep) => ({
      key, rep, s: [97, 41, 13.3, 5.7], a: [0.12, 0.06, 0.07, 0.04], hue: 0.05, r: [0.05, 0.04],
      blend: [17.0, 0.6, 0.731, 5.0],
      lawn: { side: lawnSide, graze: 0.75, stripe: 0.07, band: 1.75, clover: [0.60, 0.80], dry: 0.55 }
    });
    function lawnMat(rep){
      const m = new THREE.MeshStandardMaterial({color: 0xffffff, roughness: 1.0, metalness: 0});
      m.map = lawnTex.map; m.normalMap = lawnTex.normalMap; m.roughnessMap = lawnTex.roughnessMap;
      m.normalScale = new THREE.Vector2(0.9, 0.9);
      m.envMapIntensity = 0.85;
      return m;
    }
    const lawnBox = lawnMat(0);
    C.worldUV(lawnBox, {tile: [LAWN_FT, LAWN_FT], grain: "none", jitter: 1});
    groundPatch(THREE, lawnBox, T, lawnPatch("lawnBox", 0));
    lap("lawnMat");

    /* soil */
    const so = makeSoil(C, 1024, 5101); lap("soilRaster");
    const soil = C.material(THREE, {
      map: rgbCanvas(C, so.W, so.H, so.B), normalMap: heightNrmCanvas(C, so.W, so.H, so.hf, so.pu, 1.0, null),
      roughnessMap: dataCanvas(C, so.W, so.H, so.hf, so.B.ro, -0.3, 0.8), normalScale: 1.0, roughness: 1.0,
      tile: [SOIL_FT, SOIL_FT], grain: "none", jitter: 1
    });
    groundPatch(THREE, soil, T, { key: "soil", s: [23, 11.3, 4.1, 1.9], a: [0.10, 0.05, 0.06, 0.04], hue: 0.06, r: [0.03, 0.02],
      blend: [9.0, 2.1, 0.77, 5.0], lawn: null, damp: [0.52, 0.72, 0.32, 0.62] });
    lap("soilCanvas");

    /* gravel */
    const gr = makeGravel(C, 512, 6101); lap("gravelRaster");
    const gravel = C.material(THREE, {
      map: rgbCanvas(C, gr.W, gr.H, gr.B), normalMap: nrmCanvas(C, gr.W, gr.H, gr.B),
      roughnessMap: dataCanvas(C, gr.W, gr.H, gr.B.h, gr.B.ro, gr.zlo, gr.zhi), normalScale: 1.0, roughness: 1.0,
      tile: [GRAVEL_FT, GRAVEL_FT], grain: "none", jitter: 1
    });
    groundPatch(THREE, gravel, T, { key: "gravel", s: [19, 8.7, 3.3, 1.3], a: [0.08, 0.04, 0.05, 0.03], hue: 0.03, r: [0.03, 0.02],
      blend: [5.3, 1.3, 0.81, 4.0], lawn: null, damp: null });
    lap("gravelCanvas");

    /* mulch */
    const mu = makeMulch(C, 512, 7101); lap("mulchRaster");
    let hmax = 0; for (let i = 0; i < mu.hf.length; i++) if (mu.hf[i] > hmax) hmax = mu.hf[i];
    const mulch = C.material(THREE, {
      map: rgbCanvas(C, mu.W, mu.H, mu.B), normalMap: heightNrmCanvas(C, mu.W, mu.H, mu.hf, mu.pu, 1.0, null),
      roughnessMap: dataCanvas(C, mu.W, mu.H, mu.hf, mu.B.ro, 0, hmax), normalScale: 1.0, roughness: 1.0,
      tile: [MULCH_FT, MULCH_FT], grain: "none", jitter: 1
    });
    groundPatch(THREE, mulch, T, { key: "mulch", s: [17, 7.9, 3.1, 1.4], a: [0.10, 0.05, 0.06, 0.04], hue: 0.05, r: [0.03, 0.02],
      blend: [4.7, 0.9, 0.79, 4.0], lawn: null, damp: null });
    lap("mulchCanvas");

    const ms = performance.now() - t0;
    REAL.ground.buildMs = ms; REAL.ground.timing = Tm;
    return {
      buildMs: ms,
      textures: T,
      variants: {
        soil:    {material: soil,    sample: [8, 3, 8],    count: 1},
        gravel:  {material: gravel,  sample: [8, 0.2, 8],  count: 1},
        mulch:   {material: mulch,   sample: [8, 0.08, 6], count: 1},
        lawnBox: {material: lawnBox, sample: [8, 0.05, 8], count: 1}
      },
      /* one big flat lawn plane: PlaneGeometry(sizeFeet, sizeFeet) with plain 0..1 UVs */
      lawnMaterial: function(sizeFeet){
        const m = lawnMat((sizeFeet || 100) / LAWN_FT);
        groundPatch(THREE, m, T, lawnPatch("lawnPlane", (sizeFeet || 100) / LAWN_FT));
        return m;
      }
    };
  },

  /* 3D grass tufts for lawn edges (foundation, walks, beds): crossed alpha-tested cards, normals pointing up so they
     shade like the lawn they grow from. areas: [{x0,x1,z0,z1}] in feet at y = o.y (default 0). density: tufts / sq ft. */
  grass: function(THREE, renderer, o){
    o = o || {};
    const C = REAL.core, rnd = C.rng(o.seed || 77);
    const areas = o.areas || [{x0: -4, x1: 4, z0: -0.5, z1: 0.5}], dens = o.density == null ? 6 : o.density;
    const hgt = o.height || 0.32, maxN = o.max || 6000, y0 = o.y || 0;
    let area = 0; areas.forEach(a => area += Math.abs((a.x1 - a.x0) * (a.z1 - a.z0)));
    const count = Math.max(1, Math.min(maxN, Math.round(area * dens)));
    /* geometry: two crossed quads, 4 triangles */
    const pos = [], uv = [], nrm = [], idx = [];
    for (let q = 0; q < 2; q++){
      const a = q * Math.PI / 2, cx = Math.cos(a) * 0.5, sz = Math.sin(a) * 0.5, b = pos.length / 3;
      pos.push(-cx, 0, -sz,  cx, 0, sz,  cx, 1, sz,  -cx, 1, -sz);
      uv.push(0, 0, 1, 0, 1, 1, 0, 1);
      for (let k = 0; k < 4; k++) nrm.push(0, 1, 0);
      idx.push(b, b + 1, b + 2, b, b + 2, b + 3);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute("normal", new THREE.Float32BufferAttribute(nrm, 3));
    geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    geo.setIndex(idx);
    const tx = tuftTexture(C, (o.seed || 77) + 1);
    const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.72, metalness: 0, side: THREE.DoubleSide });
    mat.map = C.texture(THREE, tx.col, {srgb: true});
    mat.alphaMap = C.texture(THREE, tx.alp);
    mat.alphaTest = 0.5;
    const mesh = new THREE.InstancedMesh(geo, mat, count);
    const m4 = new THREE.Matrix4(), qq = new THREE.Quaternion(), e = new THREE.Euler(), p = new THREE.Vector3(), s = new THREE.Vector3(), c = new THREE.Color();
    let i = 0;
    areas.forEach(a => {
      const n = Math.round(count * Math.abs((a.x1 - a.x0) * (a.z1 - a.z0)) / (area || 1));
      for (let k = 0; k < n && i < count; k++, i++){
        p.set(a.x0 + (a.x1 - a.x0) * rnd(), y0 - 0.02, a.z0 + (a.z1 - a.z0) * rnd());
        qq.setFromEuler(e.set((rnd() - 0.5) * 0.25, rnd() * Math.PI, (rnd() - 0.5) * 0.25));
        const h = hgt * (0.6 + 0.7 * rnd()), w = h * (0.7 + 0.6 * rnd());
        m4.compose(p, qq, s.set(w, h, w));
        mesh.setMatrixAt(i, m4);
        const v = 0.9 + 0.15 * rnd();
        mesh.setColorAt(i, c.setRGB(v * (0.97 + rnd() * 0.06), v, v * (0.95 + rnd() * 0.05)));
      }
    });
    mesh.count = i;
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.castShadow = false; mesh.receiveShadow = true;
    mesh.frustumCulled = false;
    return mesh;
  }
};
})();
