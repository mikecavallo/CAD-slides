/* REAL.sheet: sheet goods for the photoreal build.
   osb  oriented strand board (wall sheathing, subfloor, roof deck)
   ply  sanded softwood plywood face (subfloor alternate)
   Everything is generated procedurally on canvas; deterministic (fixed seeds). */
(function(){
"use strict";
const REAL = window.REAL = window.REAL || {};

/* CPU-backed 2D context: these canvases are read back, and thousands of small transformed draws are far
   cheaper on the software rasteriser than on a GPU canvas that then has to be read back */
function ctx2d(c){ return c.getContext("2d", {willReadFrequently: true}); }
function clamp(v, a, b){ return v < a ? a : v > b ? b : v; }
function sstep(a, b, x){ const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }

/* periodic 1D value noise: n lattice points, t in lattice units, returns -1..1 */
function noise1(rnd, n){
  const lat = new Float32Array(n + 1);
  for (let i = 0; i < n; i++) lat[i] = rnd() * 2 - 1;
  lat[n] = lat[0];
  return function(t){
    t = t % n; if (t < 0) t += n;
    const i = t | 0, f = t - i, s = f * f * (3 - 2 * f);
    return lat[i] + (lat[i + 1] - lat[i]) * s;
  };
}

/* tileable height (Float32) -> tangent-space normal map canvas (OpenGL convention), written straight into ImageData */
function normalCanvas(core, hf, w, h, strength){
  const c = core.canvas(w, h), ctx = ctx2d(c), img = ctx.createImageData(w, h), d = img.data;
  for (let y = 0; y < h; y++){
    const yr = y * w, yu = ((y - 1 + h) % h) * w, yd = ((y + 1) % h) * w;
    for (let x = 0; x < w; x++){
      const xl = x === 0 ? w - 1 : x - 1, xr = x === w - 1 ? 0 : x + 1;
      const dx = (hf[yr + xr] - hf[yr + xl]) * strength, dy = (hf[yu + x] - hf[yd + x]) * strength;
      const il = 1 / Math.sqrt(dx * dx + dy * dy + 1), o = (yr + x) * 4;
      d[o] = (-dx * il * 0.5 + 0.5) * 255; d[o + 1] = (-dy * il * 0.5 + 0.5) * 255; d[o + 2] = (il * 0.5 + 0.5) * 255; d[o + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

/* small periodic field -> canvas with a 1px wrapped border, so a scaled drawImage of its inner rect tiles cleanly */
function wrapCanvas(core, f, w, h, fn){
  const c = core.canvas(w + 2, h + 2), ctx = ctx2d(c), img = ctx.createImageData(w + 2, h + 2), d = img.data;
  for (let y = 0; y < h + 2; y++) for (let x = 0; x < w + 2; x++){
    const v = f[((y + h - 1) % h) * w + ((x + w - 1) % w)], px = fn(v), o = (y * (w + 2) + x) * 4;
    d[o] = px[0]; d[o + 1] = px[1]; d[o + 2] = px[2]; d[o + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

/* ------------------------------------------------------------------ OSB */
function buildOSB(core){
  const NSTR = 0.6, RIM = 1.4, RIMA = 0.3;
  const N = 1024, PPI = N / 48;               /* tile = 4 ft = 48 in -> 21.3 px per inch */
  const rnd = core.rng(7151);
  const gauss = () => (rnd() + rnd() + rnd() - 1.5) * 1.414;

  /* flake sprite atlas: each cell holds one flake drawn lengthwise along x, with a tight bounding box */
  const CW = 146, CH = 60, COLS = 7, ROWS = 13, AW = CW * COLS, AH = CH * ROWS, NS = COLS * ROWS;
  const atlas = core.canvas(AW, AH), ac = ctx2d(atlas);
  const im = ac.createImageData(AW, AH), pc = im.data;
  const boxes = [];

  /* flake tones (sRGB) with weights: mostly honey/golden tan, some paler, browner and redder flakes, a few dark bark-brown ones */
  const tones = [
    [[188, 150, 96], 4.0], [[178, 138, 86], 4.0], [[196, 160, 104], 2.5], [[166, 126, 80], 3.0],
    [[198, 164, 112], 0.6], [[176, 120, 68], 1.6], [[150, 106, 64], 1.2], [[120, 84, 52], 0.35]
  ];
  const tw = tones.reduce((a, t) => a + t[1], 0);
  function pickTone(){
    let r = rnd() * tw;
    for (const t of tones){ r -= t[1]; if (r <= 0) return t[0]; }
    return tones[0][0];
  }
  const cLo = new Float32Array(CW), cHi = new Float32Array(CW), cG = new Float32Array(CW), cF = new Float32Array(CW), cB = new Float32Array(CW);

  for (let s = 0; s < NS; s++){
    const col = s % COLS, row = (s / COLS) | 0, ox = col * CW, oy = row * CH;
    const L = (3 + 3.4 * Math.pow(rnd(), 0.9)) * PPI;
    let Win = 0.85 + 0.75 * rnd();
    const kind = rnd();
    if (kind < 0.22) Win = 1.6 + 0.6 * rnd(); else if (kind < 0.3) Win = 0.45 + 0.3 * rnd();
    const W = Win * PPI;
    const x0 = (CW - L) / 2, cy = CH / 2;
    const wob1 = noise1(rnd, 6), wob2 = noise1(rnd, 6), wobA = 0.4 + 0.04 * W;
    const taper = rnd() < 0.3 ? rnd() * 0.45 : 0, taperEnd = rnd() < 0.5;
    const jagL = noise1(rnd, 8), jagR = noise1(rnd, 8), combL = noise1(rnd, 40), combR = noise1(rnd, 40);
    const AL = 1 + 3 * rnd(), AR = 1 + 3 * rnd(), CL = 0.3 + 1.6 * rnd() * rnd(), CR = 0.3 + 1.6 * rnd() * rnd();
    const sL = rnd() < 0.4 ? (rnd() * 2 - 1) * 1.1 : (rnd() * 2 - 1) * 0.2;
    const sR = rnd() < 0.4 ? (rnd() * 2 - 1) * 1.1 : (rnd() * 2 - 1) * 0.2;
    const fib = noise1(rnd, 96), med = noise1(rnd, 12), fibU = noise1(rnd, 16), spot = noise1(rnd, 24), bend = noise1(rnd, 6), bendA = 3 * rnd() * rnd();
    const slant = (rnd() * 2 - 1) * 0.06;
    const nb = rnd() < 0.45 ? 1 + ((rnd() * 1.6) | 0) : 0, bands = [];
    for (let b = 0; b < nb; b++) bands.push([(rnd() - 0.5) * W * 0.95, 0.8 + 2.4 * rnd(), (rnd() * 2 - 1) * 0.1, 0.05 + 0.12 * rnd()]);
    const base = pickTone(), lum = 0.9 + 0.12 * rnd(), warm = (rnd() - 0.5) * 0.08;
    const tr = base[0] * lum * (1 + warm), tg = base[1] * lum, tb = base[2] * lum * (1 - warm * 1.5);
    const grad = (rnd() * 2 - 1) * 0.12, edgeDark = 0.06 + 0.1 * rnd();
    const fibAmp = 0.02 + 0.035 * rnd(), medAmp = 0.06 + 0.07 * rnd();

    let bx0 = CW, by0 = CH, bx1 = 0, by1 = 0;
    const vx0 = Math.max(0, Math.floor(x0 - 4)), vx1 = Math.min(CW, Math.ceil(x0 + L + 4));
    const vy0 = Math.max(0, Math.floor(cy - W / 2 - wobA - 4)), vy1 = Math.min(CH, Math.ceil(cy + W / 2 + wobA + 4));
    for (let px = vx0; px < vx1; px++){
      const u = px + 0.5 - x0, tu = clamp(u / L, 0, 1), tt = taperEnd ? tu : 1 - tu, hw = W / 2 * (1 - taper * tt * tt);
      cLo[px] = -hw + wobA * wob1(tu * 6); cHi[px] = hw + wobA * wob2(tu * 6);
      cG[px] = 1 + grad * (tu - 0.5); cF[px] = 0.4 * fibU(u * 0.07); cB[px] = bendA * bend(tu * 3);
    }
    for (let py = vy0; py < vy1; py++){
      const v = py + 0.5 - cy, vn = (v + W / 2) / W;
      const eL = AL * (0.5 + 0.5 * jagL(vn * 8)) + CL * Math.abs(combL(vn * W * 0.5)) + Math.max(0, sL * v + Math.abs(sL) * W / 2);
      const eR = L - (AR * (0.5 + 0.5 * jagR(vn * 8)) + CR * Math.abs(combR(vn * W * 0.5)) + Math.max(0, sR * v + Math.abs(sR) * W / 2));
      for (let px = vx0; px < vx1; px++){
        const u = px + 0.5 - x0;
        let d = v - cLo[px];
        const d2 = cHi[px] - v, d3 = u - eL, d4 = eR - u;
        if (d2 < d) d = d2; if (d3 < d) d = d3; if (d4 < d) d = d4;
        if (d < -0.6 - RIM) continue;
        const o = ((oy + py) * AW + ox + px) * 4;
        /* coverage c, plus a soft contact shadow just outside the flake (draws the crevice where it overlaps another) */
        const c = d > 0.4 ? 1 : d < -0.6 ? 0 : d + 0.6;
        const sa = d > 0.4 ? 0 : RIMA * clamp(1 - (-d - 0.6) / RIM, 0, 1);
        const A = c + (1 - c) * sa;
        if (c === 0){ pc[o] = 58; pc[o + 1] = 40; pc[o + 2] = 24; pc[o + 3] = A * 255; continue; }
        const t = v + slant * u + cB[px];
        const f = fib(t * 1.1 + cF[px]), m = med(t * 0.2 + u * 0.012);
        let band = 0;
        for (let b = 0; b < nb; b++){ const B = bands[b], q = (v - B[0] - B[2] * u) / B[1]; if (q > -3 && q < 3) band += B[3] * Math.exp(-q * q); }
        const sp = spot(u * 0.05 + t * 0.15);
        const edge = d > 4 ? 1 : 1 - edgeDark * Math.exp(-(d > 0 ? d : 0));
        const sh = (1 + medAmp * m + fibAmp * f - band - (sp > 0.75 ? (sp - 0.75) * 0.5 : 0)) * edge * cG[px];
        const kc = c / A, ks = (1 - c) * sa / A;
        pc[o] = tr * sh * kc + 58 * ks; pc[o + 1] = tg * sh * kc + 40 * ks; pc[o + 2] = tb * sh * (1 - band * 0.4) * kc + 24 * ks; pc[o + 3] = A * 255;
        if (px < bx0) bx0 = px; if (px > bx1) bx1 = px; if (py < by0) by0 = py; if (py > by1) by1 = py;
      }
    }
    boxes.push([ox + bx0, oy + by0, bx1 - bx0 + 1, by1 - by0 + 1, bx0 - CW / 2, by0 - CH / 2]);
  }
  ac.putImageData(im, 0, 0);

  /* flake placement shared by both layers: random position, orientation along V with scatter, flips, wrapped copies */
  function lay(ctx, size, count, scale){
    for (let i = 0; i < count; i++){
      let bx = boxes[(rnd() * NS) | 0];
      const x = rnd() * size, y = rnd() * size;
      const cross = rnd() < 0.07;
      /* only broad flakes lie across the grain: thin cross slivers become repeating landmarks once the tile repeats */
      if (cross) for (let k = 0; k < 6 && bx[3] < 30; k++) bx = boxes[(rnd() * NS) | 0];
      const th = Math.PI / 2 + (cross ? (rnd() - 0.5) * Math.PI : gauss() * 0.3);
      const sc = (cross ? 0.7 + 0.2 * rnd() : 0.88 + 0.26 * rnd()) * scale, fx = rnd() < 0.5 ? -sc : sc, fy = rnd() < 0.5 ? -sc : sc;
      const co = Math.cos(th), si = Math.sin(th);
      const R = (Math.max(Math.abs(bx[4]), Math.abs(bx[4] + bx[2])) + CH / 2) * sc + 2;
      for (let ox = -size; ox <= size; ox += size){
        if (x + ox + R < 0 || x + ox - R > size) continue;
        for (let oy = -size; oy <= size; oy += size){
          if (y + oy + R < 0 || y + oy - R > size) continue;
          ctx.setTransform(co * fx, si * fx, -si * fy, co * fy, x + ox, y + oy);
          ctx.drawImage(atlas, bx[0], bx[1], bx[2], bx[3], bx[4], bx[5], bx[2], bx[3]);
        }
      }
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
  const flakeArea = 4.7 * 1.25 * 0.85 * PPI * PPI;

  /* lower layer, only ever seen through voids between top flakes: laid at half resolution (cheap), darkened,
     then upscaled through a 1px wrapped border so it still tiles; its softness reads as depth */
  const H2 = N / 2, cL = core.canvas(H2, H2), xl = ctx2d(cL);
  xl.fillStyle = "rgb(124,92,60)"; xl.fillRect(0, 0, H2, H2);
  lay(xl, H2, Math.round(2.0 * N * N / flakeArea), 0.5);
  xl.globalCompositeOperation = "multiply"; xl.fillStyle = "rgb(186,168,150)"; xl.fillRect(0, 0, H2, H2);
  const cLw = core.canvas(H2 + 2, H2 + 2), xlw = ctx2d(cLw);
  for (let oy = -1; oy <= 1; oy++) for (let ox = -1; ox <= 1; ox++) xlw.drawImage(cL, 1 + ox * H2, 1 + oy * H2);
  const cC = core.canvas(N, N), xc = ctx2d(cC);
  xc.imageSmoothingEnabled = true;
  xc.drawImage(cLw, 1, 1, H2, H2, 0, 0, N, N);

  /* top layer: individually placed flakes, oriented along V (the sheet's long axis) with scatter */
  lay(xc, N, Math.round(2.25 * N * N / flakeArea), 1);

  /* faint mill grade stamp (generic wording, no brand): patchy dark ink running along the long axis */
  {
    const SW = 200, SH = 76, st = core.canvas(SW, SH), xs = ctx2d(st);
    xs.fillStyle = "#000"; xs.textBaseline = "top";
    xs.lineWidth = 2.2; xs.strokeRect(3, 3, SW - 6, SH - 6);
    xs.font = "bold 17px Arial, Helvetica, sans-serif"; xs.fillText("RATED SHEATHING", 12, 8);
    xs.font = "bold 13px Arial, Helvetica, sans-serif"; xs.fillText("24/16   7/16 INCH", 12, 29);
    xs.font = "11px Arial, Helvetica, sans-serif"; xs.fillText("SIZED FOR SPACING", 12, 45); xs.fillText("EXPOSURE 1   PS 2-10", 12, 58);
    const sd = xs.getImageData(0, 0, SW, SH), sp = sd.data, inkN = core.fbm(64, 32, {octaves: 3, base: 6, seed: 404});
    for (let y = 0; y < SH; y++) for (let x = 0; x < SW; x++){
      const o = (y * SW + x) * 4, nv = inkN[((y * 32 / SH) | 0) * 64 + ((x * 64 / SW) | 0)];
      const k = clamp((nv - 0.28) * 3.2, 0, 1) * (0.7 + 0.3 * rnd());
      sp[o] = 26; sp[o + 1] = 26; sp[o + 2] = 40; sp[o + 3] *= 0.85 * k;
    }
    xs.putImageData(sd, 0, 0);
    xc.setTransform(0, -1, 1, 0, N * 0.47, N * 0.6);
    xc.drawImage(st, 0, 0);
    xc.setTransform(1, 0, 0, 1, 0, 0);
  }

  /* broad, soft tone variation across the panel (multiply) */
  const MW = 32, mot = core.normalize(core.fbm(MW, MW, {octaves: 3, base: 3, seed: 913}));
  const mc = wrapCanvas(core, mot, MW, MW, v => { const k = 232 + v * 23; return [k, k, k * 0.99]; });
  xc.globalCompositeOperation = "multiply";
  xc.imageSmoothingEnabled = true;
  xc.drawImage(mc, 1, 1, MW, MW, 0, 0, N, N);
  xc.globalCompositeOperation = "source-over";

  /* height and roughness follow the composited flakes (darker = flake edges, lower layer, voids). They are built from a
     2x downsample, which keeps flake-level relief and drops fibre-level noise, and costs a quarter of the readback. */
  const M = N / 2, cS = core.canvas(M, M), xs = ctx2d(cS);
  xs.imageSmoothingEnabled = true; xs.drawImage(cC, 0, 0, M, M);
  const ic = xs.getImageData(0, 0, M, M), dc = ic.data;
  const hf = new Float32Array(M * M);
  for (let i = 0, o = 0; i < M * M; i++, o += 4){
    const l = (dc[o] * 0.3 + dc[o + 1] * 0.6 + dc[o + 2] * 0.1) / 255;
    hf[i] = l;
    const rv = clamp(255 * (0.86 - 0.42 * l), 0, 255);
    dc[o] = rv; dc[o + 1] = rv; dc[o + 2] = rv; dc[o + 3] = 255;
  }
  xs.putImageData(ic, 0, 0);
  const cN = normalCanvas(core, hf, M, M, NSTR);
  return {map: cC, normalMap: cN, roughnessMap: cS};
}

/* ------------------------------------------------------------------ plywood */
function buildPly(core){
  const W = 512, H = 1024;                    /* tile = 4 ft x 8 ft, canvas V runs along the 8 ft grain; 10.7 px per inch */
  const rnd = core.rng(4242);
  /* rotary-cut figure: growth rings are contours of a smooth field stretched along the grain.
     Computed at half resolution and upsampled bilinearly (it is smooth). */
  const FW = 256, FH = 512;
  const fig = core.normalize(core.fbm(FW, FH, {octaves: 3, base: 2, sx: 3, sy: 1, persistence: 0.4, seed: 31}));
  /* fibre streaks: full resolution across the grain, 1/8 along it */
  const SW = 512, SH = 128;
  const fibF = core.normalize(core.fbm(SW, SH, {octaves: 3, base: 4, sx: 24, sy: 1, persistence: 0.6, seed: 77}));

  /* veneer strips: strip B occupies [sb0, sb1); strip A wraps around the tile edge */
  const sb0 = 178, sb1 = 362;
  const K = [5.5, 6.5], OFF = [0.0, 0.37], RAMP = [5, -6], WARP = 0.2;

  /* knots (phase bumps the rings bend around) and patches, stamped into side buffers over their bounding boxes */
  const bump = new Float32Array(W * H), knotD = new Float32Array(W * H);
  const patchE = new Float32Array(W * H).fill(99), patchK = new Int8Array(W * H).fill(-1);
  for (let i = 0; i < 6; i++){
    const kx = rnd() * W, ky = rnd() * H, r = 4 + 8 * rnd(), a = (rnd() < 0.5 ? -1 : 1) * (0.8 + 1.2 * rnd()), dark = rnd() < 0.6;
    const ex = Math.ceil(r * 6), ey = Math.ceil(r * 6 / 0.45);
    for (let yy = -ey; yy <= ey; yy++){
      const y = ((Math.round(ky) + yy) % H + H) % H, dy = yy * 0.45;
      for (let xx = -ex; xx <= ex; xx++){
        const x = ((Math.round(kx) + xx) % W + W) % W, q = (xx * xx + dy * dy) / (r * r * 9);
        if (q > 4) continue;
        const i2 = y * W + x;
        bump[i2] += a * Math.exp(-q);
        if (dark && q < 0.2){ const qq = (xx * xx + dy * dy * 4) / (r * r * 0.12); knotD[i2] = Math.max(knotD[i2], Math.exp(-qq)); }
      }
    }
  }
  const patches = [];
  for (let i = 0; i < 5; i++){
    const pt = {x: rnd() * W, y: rnd() * H, a: 18 + 8 * rnd(), b: 7 + 3 * rnd(), synth: i >= 3, tone: 0.97 + 0.08 * rnd(), ph: rnd() * 10};
    patches.push(pt);
    for (let yy = -Math.ceil(pt.a + 2); yy <= Math.ceil(pt.a + 2); yy++){
      const y = ((Math.round(pt.y) + yy) % H + H) % H, ty = yy / pt.a;
      if (Math.abs(ty) > 1.05) continue;
      const wy = pt.b * (1 - ty * ty);
      for (let xx = -Math.ceil(pt.b + 2); xx <= Math.ceil(pt.b + 2); xx++){
        const x = ((Math.round(pt.x) + xx) % W + W) % W, e = Math.abs(xx) - wy, i2 = y * W + x;
        if (e < 1.2 && e < patchE[i2]){ patchE[i2] = e; patchK[i2] = i; }
      }
    }
  }

  const early = [214, 189, 146], late = [170, 122, 78];
  const cC = core.canvas(W, H), xc = ctx2d(cC), ic = xc.createImageData(W, H), dc = ic.data;
  const cR = core.canvas(W, H), xr = ctx2d(cR), ir = xr.createImageData(W, H), dr = ir.data;
  const hf = new Float32Array(W * H), PH = new Float32Array(W * H), FB = new Float32Array(W * H);
  const MW = 32, MH = 64, mot = core.normalize(core.fbm(MW, MH, {octaves: 3, base: 2, sx: 1, sy: 2, seed: 5}));

  /* pass 1: ring phase (figure field + along-grain ramp + fibre warp + knot bumps) */
  for (let y = 0; y < H; y++){
    const fy = y * FH / H, fy0 = fy | 0, fty = fy - fy0, fy1 = (fy0 + 1) % FH;
    const fyM = (H - 1 - y) * FH / H, fm0 = fyM | 0, ftm = fyM - fm0, fm1 = (fm0 + 1) % FH;
    const sy = y * SH / H, sy0 = sy | 0, sty = sy - sy0, sy1 = (sy0 + 1) % SH;
    for (let x = 0; x < W; x++){
      const i = y * W + x, s = (x >= sb0 && x < sb1) ? 1 : 0;
      let hv;
      if (s){
        const xm = (W - 1 - x) * FW / W, x0 = xm | 0, tx = xm - x0, x1 = (x0 + 1) % FW;
        const a = fig[fm0 * FW + x0], b = fig[fm0 * FW + x1], c = fig[fm1 * FW + x0], d = fig[fm1 * FW + x1];
        hv = (a + (b - a) * tx) * (1 - ftm) + (c + (d - c) * tx) * ftm;
      } else {
        const xf = x * FW / W, x0 = xf | 0, tx = xf - x0, x1 = (x0 + 1) % FW;
        const a = fig[fy0 * FW + x0], b = fig[fy0 * FW + x1], c = fig[fy1 * FW + x0], d = fig[fy1 * FW + x1];
        hv = (a + (b - a) * tx) * (1 - fty) + (c + (d - c) * tx) * fty;
      }
      const fb = fibF[sy0 * SW + x] * (1 - sty) + fibF[sy1 * SW + x] * sty;
      FB[i] = fb;
      PH[i] = hv * K[s] + OFF[s] + RAMP[s] * y / H + (fb - 0.5) * WARP + bump[i];
    }
  }

  /* pass 2: band profile with edges widened to the local phase gradient (no stair-stepped contours), then colour */
  for (let y = 0; y < H; y++){
    const yu = ((y - 1 + H) % H) * W, yd = ((y + 1) % H) * W, yr = y * W;
    const my = y * MH / H, my0 = my | 0, mty = my - my0, my1 = (my0 + 1) % MH;
    for (let x = 0; x < W; x++){
      const i = yr + x, o = i * 4, s = (x >= sb0 && x < sb1) ? 1 : 0;
      const ph = PH[i], fb = FB[i];
      let gx = PH[yr + (x === W - 1 ? 0 : x + 1)] - PH[yr + (x === 0 ? W - 1 : x - 1)]; gx -= Math.round(gx);
      let gy = PH[yd + x] - PH[yu + x]; gy -= Math.round(gy);
      const fw = Math.min(0.2, 0.004 + 0.4 * (Math.abs(gx) + Math.abs(gy)));
      const p = ph - Math.floor(ph);
      let lw = sstep(0.66 - fw, 0.84 + fw, p) * (1 - sstep(0.945 - fw, 0.965 + fw, p));
      const mx = x * MW / W, mx0 = mx | 0, mtx = mx - mx0, mx1 = (mx0 + 1) % MW;
      const mv = (mot[my0 * MW + mx0] * (1 - mtx) + mot[my0 * MW + mx1] * mtx) * (1 - mty) + (mot[my1 * MW + mx0] * (1 - mtx) + mot[my1 * MW + mx1] * mtx) * mty;
      let rough, hgt = 0.5 + 0.05 * lw + 0.03 * (fb - 0.5), tone = s ? 1.02 : 0.99, line = 0, synth = 0;
      const ds = Math.min(Math.abs(x + 0.5 - sb0), Math.abs(x + 0.5 - sb1));
      if (ds < 1.2){ line = 0.12 * (1 - ds / 1.2); hgt -= 0.08 * (1 - ds / 1.2); }
      const pk = patchK[i];
      if (pk >= 0){
        const pt = patches[pk], e = patchE[i];
        if (e < -0.4){
          if (pt.synth) synth = 1;
          else {
            /* inset veneer: straighter, finer grain, slightly paler and yellower than the face around it */
            const dx = x - pt.x, pp = dx * 0.11 + (fb - 0.5) * 0.6 + pt.ph, q = pp - Math.floor(pp);
            lw = sstep(0.7, 0.88, q) * (1 - sstep(0.94, 0.98, q)) * 0.55; tone = pt.tone * 1.03;
          }
        }
        const ln = 1 - Math.abs(e + 0.2) * 1.3;
        if (ln > 0){ line = Math.max(line, 0.28 * ln); hgt -= 0.1 * ln; }
      }
      let r, g, b;
      if (synth){
        const n = 1 + (fb - 0.5) * 0.03;
        r = 206 * n; g = 182 * n; b = 140 * n; rough = 0.62; hgt = 0.48;
      } else {
        const L = lw * 0.82, f = (1 + (fb - 0.5) * 0.1) * tone * (0.95 + 0.1 * mv);
        r = (early[0] + (late[0] - early[0]) * L) * f; g = (early[1] + (late[1] - early[1]) * L) * f; b = (early[2] + (late[2] - early[2]) * L) * f;
        const kd = knotD[i] * 0.6;
        if (kd > 0.001){ r = r * (1 - kd) + 96 * kd; g = g * (1 - kd) + 62 * kd; b = b * (1 - kd) + 38 * kd; }
        rough = 0.82 - 0.1 * lw + (fb - 0.5) * 0.06;
      }
      const lf = 1 - line;
      dc[o] = r * lf; dc[o + 1] = g * lf; dc[o + 2] = b * lf * 0.98; dc[o + 3] = 255;
      const rv = rough * 255; dr[o] = rv; dr[o + 1] = rv; dr[o + 2] = rv; dr[o + 3] = 255;
      hf[i] = hgt;
    }
  }
  xc.putImageData(ic, 0, 0); xr.putImageData(ir, 0, 0);
  const cN = normalCanvas(core, hf, W, H, 2.0);
  return {map: cC, normalMap: cN, roughnessMap: cR};
}

/* canvases are built once per page and shared by every create() call */
let built = null;

REAL.sheet = {
  create: function(THREE, renderer, opts){
    const core = REAL.core;
    if (!built){
      const t0 = performance.now();
      const o = buildOSB(core);
      const t1 = performance.now();
      const p = buildPly(core);
      REAL.sheet.timing = {osb: t1 - t0, ply: performance.now() - t1};
      built = {o, p};
    }
    const o = built.o, p = built.p;
    /* grain:"long" keeps the strand orientation / veneer grain on the sheet's long (8 ft) axis whether the sheet
       stands on a wall, lies flat as subfloor or runs across rafters as roof deck; the OSB tile is square, so this
       only decides which way the strands run. Roughness lives in the maps (material roughness 1 = map value). */
    const osb = core.material(THREE, {map: o.map, normalMap: o.normalMap, normalScale: 1.0, roughnessMap: o.roughnessMap, roughness: 1, tile: [4, 4], grain: "long", jitter: 1});
    const ply = core.material(THREE, {map: p.map, normalMap: p.normalMap, normalScale: 0.6, roughnessMap: p.roughnessMap, roughness: 1, tile: [4, 8], grain: "long", jitter: 1});
    return { variants: {
      /* oriented strand board: wall sheathing, subfloor, roof deck. tile 4 ft square (texture repeats twice along an 8 ft sheet) */
      osb: {material: osb, sample: [4, 8, 0.06], count: 3, spread: [4.02, 0, 0]},
      /* sanded softwood plywood face: one tile = one 4 x 8 sheet, so a sheet never repeats within itself */
      ply: {material: ply, sample: [8, 0.06, 4], count: 2, spread: [0, 0, 4.02]}
    }};
  }
};
})();
