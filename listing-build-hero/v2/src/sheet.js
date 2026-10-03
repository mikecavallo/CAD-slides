/* REAL.sheet: sheet goods for the photoreal build.
   osb  oriented strand board (wall sheathing, subfloor, roof deck)
   ply  sanded softwood plywood face (subfloor alternate)
   Everything is generated procedurally on canvas; deterministic (fixed seeds). */
(function(){
"use strict";
const REAL = window.REAL = window.REAL || {};

function clamp(v, a, b){ return v < a ? a : v > b ? b : v; }
/* CPU-backed 2D context: these canvases are read back, and thousands of small transformed draws are far
   cheaper on the software rasteriser than on a GPU canvas that then has to be read back */
function ctx2d(c){ return c.getContext("2d", {willReadFrequently: true}); }
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

/* tileable height (Float32, 0..1) -> tangent-space normal map canvas, written straight into ImageData */
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

/* bilinear periodic sample of a small field (used to upsample low-frequency noise cheaply) */
function sampler(f, w, h){
  return function(x, y){
    x = ((x % w) + w) % w; y = ((y % h) + h) % h;
    const x0 = x | 0, y0 = y | 0, tx = x - x0, ty = y - y0, x1 = (x0 + 1) % w, y1 = (y0 + 1) % h;
    const a = f[y0 * w + x0], b = f[y0 * w + x1], c = f[y1 * w + x0], e = f[y1 * w + x1];
    return (a + (b - a) * tx) + ((c + (e - c) * tx) - (a + (b - a) * tx)) * ty;
  };
}

/* ------------------------------------------------------------------ OSB */
function buildOSB(core){
  const N = 1024, PPI = N / 48;               /* tile = 4 ft = 48 in */
  const rnd = core.rng(7151);
  const gauss = () => (rnd() + rnd() + rnd() - 1.5) * 1.414;

  /* strand sprite atlas: colour (RGBA) + data (R = height, G = roughness, A = coverage) */
  const CW = 150, CH = 40, COLS = 6, ROWS = 25, AW = CW * COLS, AH = CH * ROWS, NS = COLS * ROWS;
  const T = [performance.now()];
  const atlasC = core.canvas(AW, AH), atlasD = core.canvas(AW, AH);
  const ac = ctx2d(atlasC), ad = ctx2d(atlasD);
  const imC = ac.createImageData(AW, AH), imD = ad.createImageData(AW, AH);
  const pc = imC.data, pd = imD.data;

  /* strand tones (sRGB) with weights: aspen/pine OSB is mostly golden tan with paler and browner flakes */
  const tones = [
    [[212, 178, 124], 3.0], [[200, 160, 102], 4.0], [[186, 148, 100], 3.0], [[220, 192, 142], 1.4],
    [[188, 132, 78], 1.2], [[158, 114, 72], 1.0], [[124, 88, 56], 0.35], [[176, 154, 120], 0.8], [[205, 170, 112], 2.0]
  ];
  const tw = tones.reduce((a, t) => a + t[1], 0);
  function pickTone(){
    let r = rnd() * tw;
    for (const t of tones){ r -= t[1]; if (r <= 0) return t[0]; }
    return tones[0][0];
  }

  for (let s = 0; s < NS; s++){
    const col = s % COLS, row = (s / COLS) | 0, ox = col * CW, oy = row * CH;
    const L = (3 + 3.3 * Math.pow(rnd(), 0.85)) * PPI;
    let Win = 0.5 + 0.5 * rnd();
    const kind = rnd();
    if (kind < 0.13) Win = 1.0 + 0.4 * rnd(); else if (kind < 0.25) Win = 0.28 + 0.2 * rnd();
    const W = Win * PPI;
    const x0 = (CW - L) / 2, cy = CH / 2;
    const wob1 = noise1(rnd, 6), wob2 = noise1(rnd, 6), wobA = 0.5 + 0.05 * W;
    const taper = rnd() < 0.3 ? rnd() * 0.4 : 0, taperEnd = rnd() < 0.5;
    const jagL = noise1(rnd, 16), jagR = noise1(rnd, 16), combL = noise1(rnd, 32), combR = noise1(rnd, 32);
    const AL = 1 + 4 * rnd(), AR = 1 + 4 * rnd(), CL = 1 + 4 * rnd() * rnd(), CR = 1 + 4 * rnd() * rnd();
    const sL = rnd() < 0.35 ? (rnd() * 2 - 1) * 1.3 : (rnd() * 2 - 1) * 0.2;
    const sR = rnd() < 0.35 ? (rnd() * 2 - 1) * 1.3 : (rnd() * 2 - 1) * 0.2;
    const fib = noise1(rnd, 64), med = noise1(rnd, 12), fibU = noise1(rnd, 16);
    const slant = (rnd() * 2 - 1) * 0.05;
    const hasBand = rnd() < 0.55, bc = (rnd() - 0.5) * W * 0.9, bw = 0.8 + 2.4 * rnd(), bs = (rnd() * 2 - 1) * 0.12, bDark = 0.18 + 0.25 * rnd();
    const hasBand2 = rnd() < 0.3, bc2 = (rnd() - 0.5) * W, bw2 = 0.6 + 1.2 * rnd(), bs2 = (rnd() * 2 - 1) * 0.1;
    const base = pickTone(), lum = 0.9 + 0.18 * rnd(), warm = (rnd() - 0.5) * 0.08;
    const tr = base[0] * lum * (1 + warm), tg = base[1] * lum, tb = base[2] * lum * (1 - warm * 1.5);
    const grad = (rnd() * 2 - 1) * 0.14, edgeDark = 0.22 + 0.2 * rnd();
    const hBase = 0.58 + 0.12 * rnd(), rBase = 0.5 + 0.22 * rnd();
    const fibAmp = 0.05 + 0.07 * rnd(), medAmp = 0.06 + 0.08 * rnd();

    const vx0 = Math.max(0, Math.floor(x0 - 2)), vx1 = Math.min(CW, Math.ceil(x0 + L + 2));
    const vy0 = Math.max(0, Math.floor(cy - W / 2 - wobA - 2)), vy1 = Math.min(CH, Math.ceil(cy + W / 2 + wobA + 2));
    for (let py = vy0; py < vy1; py++){
      const v = py + 0.5 - cy, vn = (v + W / 2) / W;
      const eL = AL * (0.5 + 0.5 * jagL(vn * 16)) + CL * Math.abs(combL(vn * W * 0.7)) + Math.max(0, sL * v + Math.abs(sL) * W / 2);
      const eR = L - (AR * (0.5 + 0.5 * jagR(vn * 16)) + CR * Math.abs(combR(vn * W * 0.7)) + Math.max(0, sR * v + Math.abs(sR) * W / 2));
      for (let px = vx0; px < vx1; px++){
        const u = px + 0.5 - x0, tu = clamp(u / L, 0, 1);
        const tt = taperEnd ? tu : 1 - tu;
        const hw = W / 2 * (1 - taper * tt * tt);
        const lo = -hw + wobA * wob1(tu * 6), hi = hw + wobA * wob2(tu * 6);
        const d = Math.min(v - lo, hi - v, u - eL, eR - u);
        if (d < -0.6) continue;
        const a = clamp(d + 0.6, 0, 1);
        const t = v + slant * u;
        const f = fib(t * 0.9 + 0.35 * fibU(u * 0.08)), m = med(t * 0.22 + u * 0.01);
        let band = 0;
        if (hasBand){ const q = (v - bc - bs * u) / bw; band += bDark * Math.exp(-q * q); }
        if (hasBand2){ const q = (v - bc2 - bs2 * u) / bw2; band += 0.15 * Math.exp(-q * q); }
        const edge = 1 - edgeDark * Math.exp(-Math.max(d, 0) / 1.4);
        const sh = (1 + medAmp * m + fibAmp * f - band) * edge * (1 + grad * (tu - 0.5));
        const o = ((oy + py) * AW + ox + px) * 4;
        pc[o] = clamp(tr * sh, 0, 255); pc[o + 1] = clamp(tg * sh, 0, 255); pc[o + 2] = clamp(tb * sh * (1 - band * 0.3), 0, 255); pc[o + 3] = a * 255;
        const hv = (hBase + 0.05 * m + 0.035 * f - 0.03 * band) ;
        const hb = 0.28 + (hv - 0.28) * sstep(-0.6, 2.8, d);
        pd[o] = clamp(hb * 255, 0, 255);
        pd[o + 1] = clamp((rBase + 0.06 * f + 0.2 * (1 - sstep(0, 3, d))) * 255, 0, 255);
        pd[o + 2] = 0; pd[o + 3] = a * 255;
      }
    }
  }
  ac.putImageData(imC, 0, 0); ad.putImageData(imD, 0, 0);

  /* lay strands: two layers, the lower one darkened so gaps read as depth */
  T.push(performance.now());
  const cC = core.canvas(N, N), cD = core.canvas(N, N);
  const xc = ctx2d(cC), xd = ctx2d(cD);
  xc.fillStyle = "rgb(88,60,36)"; xc.fillRect(0, 0, N, N);
  xd.fillStyle = "rgb(40,250,0)"; xd.fillRect(0, 0, N, N);
  const R = Math.hypot(CW, CH) / 2 * 1.2 + 2;
  function pass(count){
    for (let i = 0; i < count; i++){
      const k = (rnd() * NS) | 0, sx = (k % COLS) * CW, sy = ((k / COLS) | 0) * CH;
      const x = rnd() * N, y = rnd() * N;
      const th = Math.PI / 2 + (rnd() < 0.12 ? (rnd() - 0.5) * Math.PI : gauss() * 0.28);
      const sc = 0.85 + 0.3 * rnd(), fx = rnd() < 0.5 ? -sc : sc, fy = rnd() < 0.5 ? -sc : sc;
      const co = Math.cos(th), si = Math.sin(th);
      for (let ox = -N; ox <= N; ox += N){
        if (x + ox + R < 0 || x + ox - R > N) continue;
        for (let oy = -N; oy <= N; oy += N){
          if (y + oy + R < 0 || y + oy - R > N) continue;
          xc.setTransform(co * fx, si * fx, -si * fy, co * fy, x + ox, y + oy);
          xc.drawImage(atlasC, sx, sy, CW, CH, -CW / 2, -CH / 2, CW, CH);
          xd.setTransform(co * fx, si * fx, -si * fy, co * fy, x + ox, y + oy);
          xd.drawImage(atlasD, sx, sy, CW, CH, -CW / 2, -CH / 2, CW, CH);
        }
      }
    }
    xc.setTransform(1, 0, 0, 1, 0, 0); xd.setTransform(1, 0, 0, 1, 0, 0);
  }
  const strandArea = 4.6 * PPI * 0.72 * PPI * 0.85;
  pass(Math.round(1.6 * N * N / strandArea));
  xc.globalCompositeOperation = "multiply"; xc.fillStyle = "rgb(150,128,110)"; xc.fillRect(0, 0, N, N);
  xc.globalCompositeOperation = "source-over";
  xd.fillStyle = "rgba(0,255,0,0.4)"; xd.fillRect(0, 0, N, N);
  pass(Math.round(2.2 * N * N / strandArea));

  T.push(performance.now());
  /* finishing pass: low-frequency mottling on colour, roughness map, normal map */
  const MW = 64, mot = core.normalize(core.fbm(MW, MW, {octaves: 4, base: 3, seed: 913})), ms = sampler(mot, MW, MW);
  const ic = xc.getImageData(0, 0, N, N), id = xd.getImageData(0, 0, N, N), dc = ic.data, dd = id.data;
  const cR = core.canvas(N, N), xr = ctx2d(cR), ir = xr.createImageData(N, N), dr = ir.data;
  const hf = new Float32Array(N * N), k = MW / N;
  for (let y = 0; y < N; y++){
    for (let x = 0; x < N; x++){
      const i = y * N + x, o = i * 4;
      const mv = ms(x * k, y * k), f = 0.93 + 0.14 * mv;
      dc[o] = clamp(dc[o] * f, 0, 255); dc[o + 1] = clamp(dc[o + 1] * f, 0, 255); dc[o + 2] = clamp(dc[o + 2] * (f * 0.98), 0, 255);
      hf[i] = dd[o] / 255;
      const rv = clamp(dd[o + 1] + (mv - 0.5) * 20, 0, 255);
      dr[o] = rv; dr[o + 1] = rv; dr[o + 2] = rv; dr[o + 3] = 255;
    }
  }
  xc.putImageData(ic, 0, 0); xr.putImageData(ir, 0, 0);
  T.push(performance.now());
  const cN = normalCanvas(core, hf, N, N, 3.2);
  T.push(performance.now());
  REAL.sheet.osbSteps = T.slice(1).map((t, i) => (t - T[i]).toFixed(0)).join("/");
  return {map: cC, normalMap: cN, roughnessMap: cR};
}

/* ------------------------------------------------------------------ plywood */
function buildPly(core){
  const W = 512, H = 1024;                    /* tile = 4 ft x 8 ft, canvas V runs along the 8 ft grain */
  const rnd = core.rng(4242);
  const fig = core.fbm(W, H, {octaves: 5, base: 3, sx: 2, sy: 1, persistence: 0.5, seed: 31});
  core.normalize(fig);
  const fibF = core.fbm(W, H, {octaves: 3, base: 4, sx: 32, sy: 1, persistence: 0.55, seed: 77});
  core.normalize(fibF);
  const MW = 64, MH = 128, mot = core.normalize(core.fbm(MW, MH, {octaves: 4, base: 2, sx: 1, sy: 2, seed: 5})), ms = sampler(mot, MW, MH);

  /* veneer strips: strip B occupies [sb0, sb1); strip A wraps around the tile edge */
  const sb0 = 178, sb1 = 362;
  const K = [9.5, 11.5], OFF = [0.0, 0.37];
  /* knots bend the rings around them */
  const knots = [];
  for (let i = 0; i < 6; i++) knots.push({x: rnd() * W, y: rnd() * H, r: 4 + 8 * rnd(), a: (rnd() < 0.5 ? -1 : 1) * (0.8 + 1.2 * rnd()), dark: rnd() < 0.6});
  /* football (boat) patches and synthetic filler patches */
  const patches = [];
  for (let i = 0; i < 5; i++) patches.push({x: rnd() * W, y: rnd() * H, a: 18 + 8 * rnd(), b: 7 + 3 * rnd(), synth: i >= 3, tone: 0.97 + 0.08 * rnd(), ph: rnd() * 10});

  const early = [214, 190, 150], late = [178, 128, 80];
  const cC = core.canvas(W, H), xc = ctx2d(cC), ic = xc.createImageData(W, H), dc = ic.data;
  const cR = core.canvas(W, H), xr = ctx2d(cR), ir = xr.createImageData(W, H), dr = ir.data;
  const hf = new Float32Array(W * H);
  const wrapd = (d, P) => { d = d % P; if (d > P / 2) d -= P; else if (d < -P / 2) d += P; return d; };

  for (let y = 0; y < H; y++){
    for (let x = 0; x < W; x++){
      const i = y * W + x, o = i * 4;
      const s = (x >= sb0 && x < sb1) ? 1 : 0;
      const hv = s ? fig[(H - 1 - y) * W + (W - 1 - x)] : fig[i];
      const fb = fibF[i];
      let ph = hv * K[s] + OFF[s] + (fb - 0.5) * 0.12;
      let knotDark = 0;
      for (let k = 0; k < knots.length; k++){
        const kn = knots[k], dx = wrapd(x - kn.x, W), dy = wrapd(y - kn.y, H) * 0.45;
        const q = (dx * dx + dy * dy) / (kn.r * kn.r * 9);
        if (q < 9){ ph += kn.a * Math.exp(-q); if (kn.dark){ const qq = (dx * dx + dy * dy * 4) / (kn.r * kn.r * 0.12); knotDark = Math.max(knotDark, Math.exp(-qq)); } }
      }
      let p = ph - Math.floor(ph);
      let lw = sstep(0.5, 0.9, p) * (1 - sstep(0.95, 0.985, p));
      let fibAmp = 1, rough = 0.8, hgt = 0.5 + 0.06 * lw + 0.03 * (fb - 0.5), tone = s ? 1.02 : 0.99, line = 0;
      /* seams */
      const ds = Math.min(Math.abs(x + 0.5 - sb0), Math.abs(x + 0.5 - sb1));
      if (ds < 1.2){ line = Math.max(line, 0.12 * (1 - ds / 1.2)); hgt -= 0.08 * (1 - ds / 1.2); }
      let synth = 0;
      for (let k = 0; k < patches.length; k++){
        const pt = patches[k], dx = wrapd(x - pt.x, W), dy = wrapd(y - pt.y, H);
        if (Math.abs(dy) > pt.a + 2 || Math.abs(dx) > pt.b + 2) continue;
        const ty = dy / pt.a, wy = pt.b * (1 - ty * ty);
        const e = Math.abs(dx) - wy;           /* < 0 inside, ~px distance across */
        if (e < 1.2 && Math.abs(ty) < 1.05){
          if (e < -0.4){
            if (pt.synth){ synth = 1; }
            else { const pp = (dx * 0.04 + fb * 0.35 + pt.ph + dy * 0.002) * 3; const q = pp - Math.floor(pp); lw = sstep(0.6, 0.92, q) * (1 - sstep(0.95, 0.99, q)) * 0.8; tone = pt.tone; }
          }
          const ln = 1 - Math.abs(e + 0.2) / 1.0;
          if (ln > 0){ line = Math.max(line, 0.35 * ln); hgt -= 0.1 * ln; }
        }
      }
      const mv = ms(x * MW / W, y * MH / H);
      let r, g, b;
      if (synth){
        const n = 1 + (fb - 0.5) * 0.03;
        r = 206 * n; g = 182 * n; b = 140 * n; rough = 0.62; hgt = 0.48;
      } else {
        const L = lw * 0.85;
        const f = (1 + (fb - 0.5) * 0.12 * fibAmp) * tone * (0.95 + 0.1 * mv);
        r = (early[0] + (late[0] - early[0]) * L) * f; g = (early[1] + (late[1] - early[1]) * L) * f; b = (early[2] + (late[2] - early[2]) * L) * f;
        if (knotDark > 0){ const kd = knotDark * 0.6; r = r * (1 - kd) + 96 * kd; g = g * (1 - kd) + 62 * kd; b = b * (1 - kd) + 38 * kd; }
        rough = 0.82 - 0.1 * lw + (fb - 0.5) * 0.06;
      }
      const lf = 1 - line;
      dc[o] = clamp(r * lf, 0, 255); dc[o + 1] = clamp(g * lf, 0, 255); dc[o + 2] = clamp(b * lf * 0.98, 0, 255); dc[o + 3] = 255;
      const rv = clamp(rough * 255, 0, 255); dr[o] = rv; dr[o + 1] = rv; dr[o + 2] = rv; dr[o + 3] = 255;
      hf[i] = hgt;
    }
  }
  xc.putImageData(ic, 0, 0); xr.putImageData(ir, 0, 0);
  const cN = normalCanvas(core, hf, W, H, 2.0);
  return {map: cC, normalMap: cN, roughnessMap: cR};
}

REAL.sheet = {
  create: function(THREE, renderer, opts){
    const core = REAL.core;
    const t0 = performance.now();
    const o = buildOSB(core);
    const t1 = performance.now();
    const p = buildPly(core);
    const t2 = performance.now();
    REAL.sheet.timing = {osb: t1 - t0, ply: t2 - t1};
    /* grain:"long" keeps the strand orientation / veneer grain on the sheet's long (8 ft) axis whether the
       sheet stands on a wall or lies flat as subfloor; the tile is square for OSB so nothing else changes. */
    const osb = core.material(THREE, {map: o.map, normalMap: o.normalMap, normalScale: 1.0, roughnessMap: o.roughnessMap, roughness: 1, tile: [4, 4], grain: "long", jitter: 1});
    const ply = core.material(THREE, {map: p.map, normalMap: p.normalMap, normalScale: 0.6, roughnessMap: p.roughnessMap, roughness: 1, tile: [4, 8], grain: "long", jitter: 1});
    return { variants: {
      osb: {material: osb, sample: [4, 8, 0.06], count: 3, spread: [4.02, 0, 0]},
      ply: {material: ply, sample: [8, 0.06, 4], count: 2, spread: [0, 0, 4.02]}
    }};
  }
};
})();
