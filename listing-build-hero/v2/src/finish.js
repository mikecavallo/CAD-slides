/* REAL.finish: photoreal exterior finish materials for 106 Steinmann Ave (1953 Cape).
   REAL.finish.create(THREE, renderer, opts) -> { variants: { shingle, siding, trim, frame, glass, door, steel } }
   Every variant is { material, sample:[sx,sy,sz] (feet), optional rot, spread, count, tile, note }.

   Textures are procedural (canvas 2D + REAL.core noise), deterministic (fixed seeds), authored in physical inches.
   UVs: this module carries its own world-UV shader patch (same scheme as REAL.core.worldUV: feet per repeat, per-instance
   hash offset) because several finishes need things worldUV cannot do:
     - per-axis jitter (shingle courses and siding laps must stay registered to the piece's bottom edge),
     - quantised V jitter (each siding board / shingle strip picks one whole course out of a multi-course texture),
     - glass anchored to the TOP of each pane (blinds hang from the head of the window),
     - low-frequency world-space tone variation (kills visible tiling on big roof and wall areas),
     - face-edge grime (trim, frame, steel),
     - a reflected treeline + cloud break-up in glass (the rig's IBL is a smooth gradient dome; real windows reflect trees). */
(function(){
"use strict";
const REAL = window.REAL = window.REAL || {};

/* ---------------------------------------------------------------- small helpers */
function sstep(a, b, x){ let t = (x - a) / (b - a); t = t < 0 ? 0 : t > 1 ? 1 : t; return t * t * (3 - 2 * t); }

/* scratch Float32 buffers reused across variants (textures are built one after another), released after create() */
let POOL = {};
function buf(name, n, zero){
  let b = POOL[name];
  if (!b || b.length < n) b = POOL[name] = new Float32Array(n);
  else if (zero) b.fill(0, 0, n);
  return b.length === n ? b : b.subarray(0, n);
}

/* shared per-pixel white noise (-0.5..0.5), xorshift32. Callers read G[i + offset] with offset < len - N. */
let GRIT = null;
function grit(n){
  if (GRIT && GRIT.length >= n) return GRIT;
  GRIT = new Float32Array(n);
  let s = 0x2545F491 | 0;
  for (let i = 0; i < n; i++){ s ^= s << 13; s ^= s >>> 17; s ^= s << 5; GRIT[i] = (s >>> 0) / 4294967296 - 0.5; }
  return GRIT;
}

/* low-res tileable fbm normalised to -0.5..0.5 */
function field(C, w, h, o){
  const f = C.normalize(C.fbm(w, h, o));
  for (let i = 0; i < f.length; i++) f[i] -= 0.5;
  return {f, w, h};
}
/* bilinear wrap upsample of a low-res periodic field to W x H */
function up(F, W, H, name){
  const out = name ? buf(name, W * H) : new Float32Array(W * H), w = F.w, h = F.h, f = F.f;
  if (w === W && h === H){ out.set(f); return out; }
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

/* canvases */
function rgbCanvas(C, W, H, rgb){
  const c = C.canvas(W, H), ctx = c.getContext("2d"), img = ctx.createImageData(W, H), d = img.data;
  for (let i = 0, j = 0, k = 0; i < W * H; i++, j += 3, k += 4){ d[k] = rgb[j]; d[k+1] = rgb[j+1]; d[k+2] = rgb[j+2]; d[k+3] = 255; }   /* Uint8ClampedArray clamps + rounds */
  ctx.putImageData(img, 0, 0);
  return c;
}
/* data canvas: g = roughness, b = metalness (three reads roughnessMap.g and metalnessMap.b), values 0..1 */
function dataCanvas(C, W, H, g, b){
  const c = C.canvas(W, H), ctx = c.getContext("2d"), img = ctx.createImageData(W, H), d = img.data;
  for (let i = 0, k = 0; i < W * H; i++, k += 4){
    const gv = g[i] * 255;
    d[k] = gv; d[k+1] = gv; d[k+2] = b ? b[i] * 255 : gv; d[k+3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return c;
}
/* tangent-space normal map (OpenGL, green = +V) from a tileable height field in INCHES; pu/pv = pixel size in inches */
function normalCanvas(C, W, H, hf, pu, pv, k){
  const c = C.canvas(W, H), ctx = c.getContext("2d"), img = ctx.createImageData(W, H), d = img.data;
  const sx = (k || 1) / (2 * pu), sy = (k || 1) / (2 * pv);
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

/* ---------------------------------------------------------------- shader patch
   o: { tile:[uFt,vFt], grain:bool, jit:[ju,jv], vSteps:n (quantise V jitter to 1/n), anchorTop:bool,
        macro:[amp, cyclesPerFoot], edge:[widthFt, amount], refl:{k, mask:bool} } */
const GLSL_FUNCS = `
float finH3(vec3 p){ p = fract(p * 0.3183099 + vec3(0.11, 0.17, 0.13)); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float finVN(vec3 x){
  vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(finH3(i), finH3(i + vec3(1.0, 0.0, 0.0)), f.x), mix(finH3(i + vec3(0.0, 1.0, 0.0)), finH3(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
             mix(mix(finH3(i + vec3(0.0, 0.0, 1.0)), finH3(i + vec3(1.0, 0.0, 1.0)), f.x), mix(finH3(i + vec3(0.0, 1.0, 1.0)), finH3(i + vec3(1.0, 1.0, 1.0)), f.x), f.y), f.z);
}
float finN1(float x){ float i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(fract(sin(mod(i, 289.0) * 127.1) * 43758.5453), fract(sin(mod(i + 1.0, 289.0) * 127.1) * 43758.5453), f); }
/* multiplier on reflected environment radiance (world reflection vector r):
   broken cloud above, ragged treeline of pines / hardwoods at the horizon, sunlit lawn below */
vec3 finTrees(vec3 r, vec3 wp){
  float az = atan(r.z, r.x) + dot(wp.xz, vec2(0.021, 0.013));
  float x = az * 9.0 + 40.0;
  float h = 0.05 + 0.15 * finN1(x * 0.33) + 0.07 * finN1(x * 1.3 + 3.0) + 0.04 * finN1(x * 4.3 + 7.0) + 0.035 * pow(finN1(x * 13.0), 3.0);
  float el = r.y;
  float t = 1.0 - smoothstep(h - 0.01, h + 0.01, el);
  float clump = finN1(x * 5.0 + el * 37.0) * 0.6 + finN1(x * 17.0 - el * 90.0) * 0.4;
  vec3 tree = vec3(0.05, 0.068, 0.042) * (0.45 + 1.2 * clump * clump);
  vec2 cp = r.xz / (max(el, 0.0) + 0.18) * 1.7;
  float cloud = finVN(vec3(cp, 1.3)) * 0.65 + finVN(vec3(cp * 2.7, 4.1)) * 0.35;
  vec3 k = mix(vec3(0.82 + 0.5 * smoothstep(0.35, 0.75, cloud)), tree, t);
  return mix(k, vec3(0.62, 0.78, 0.46) * (0.75 + 0.5 * finN1(x * 3.0)), smoothstep(-0.03, -0.14, el));
}
`;
function finPatch(m, o){
  const f5 = n => (+n).toFixed(5);
  const tile = o.tile || [1, 1], jit = o.jit || [1, 1];
  const key = "fin:" + JSON.stringify(o);
  const vq = o.vSteps ? `fJ.y = floor(fJ.y * ${f5(o.vSteps)}) / ${f5(o.vSteps)};` : "";
  const uvCode = `
    #ifdef USE_UV
      vec2 rUv = uv;
      #ifdef USE_INSTANCING
        vec3 fS = vec3(length(instanceMatrix[0].xyz), length(instanceMatrix[1].xyz), length(instanceMatrix[2].xyz));
        vec3 fN = abs(normal);
        vec2 fD = fN.x > 0.5 ? vec2(fS.z, fS.y) : (fN.y > 0.5 ? vec2(fS.x, fS.z) : vec2(fS.x, fS.y));
        vec2 fP = uv * fD;
        ${o.grain ? "if (fD.x > fD.y){ fP = vec2(uv.y * fD.y, uv.x * fD.x); fD = fD.yx; }" : ""}
        vFinF = vec4(fP, fD);
        ${o.anchorTop ? `fP.y += ${f5(tile[1])} - fD.y;` : ""}
        vec3 fI = instanceMatrix[3].xyz;
        float fH = fract(sin(dot(floor(fI * 2.31 + 0.5), vec3(12.9898, 78.233, 37.719))) * 43758.5453);
        vec2 fJ = vec2(fH, fract(fH * 7.13));
        ${vq}
        rUv = fP / vec2(${f5(tile[0])}, ${f5(tile[1])}) + fJ * vec2(${f5(jit[0])}, ${f5(jit[1])});
      #else
        vFinF = vec4(uv, 1.0, 1.0);
      #endif
      vUv = ( uvTransform * vec3( rUv, 1 ) ).xy;
    #endif`;
  let alb = "";
  if (o.macro) alb += `
    { float mn = finVN(vFinW * ${f5(o.macro[1])}) * 0.65 + finVN(vFinW * ${f5(o.macro[1] * 3.7)} + 5.3) * 0.35;
      diffuseColor.rgb *= 1.0 + ${f5(o.macro[0])} * (mn - 0.5) * 2.0; }`;
  if (o.edge) alb += `
    { vec2 fe = min(vFinF.xy, vFinF.zw - vFinF.xy); float ed = max(min(fe.x, fe.y), 0.0);
      float g = 1.0 - smoothstep(0.0, ${f5(o.edge[0])}, ed);
      float gn = finVN(vec3(vFinF.xy * 9.0, 0.0) + vFinW * 1.7);
      diffuseColor.rgb *= 1.0 - ${f5(o.edge[1])} * g * g * (0.35 + 1.3 * gn) * vec3(0.92, 0.97, 1.08); }`;
  let refl = "";
  if (o.refl) refl = `
    #if defined( USE_ENVMAP )
    { vec3 fr = inverseTransformDirection(reflect(-geometry.viewDir, geometry.normal), viewMatrix);
      vec3 fk = finTrees(fr, vFinW) * ${f5(o.refl.k)};
      ${o.refl.mask ? "float fm = 1.0 - smoothstep(0.10, 0.22, roughnessFactor); fk = mix(vec3(1.0), fk, fm);" : ""}
      radiance *= fk; }
    #endif`;
  m.onBeforeCompile = function(sh){
    sh.vertexShader = "varying vec4 vFinF;\nvarying vec3 vFinW;\n" + sh.vertexShader
      .replace("#include <uv_vertex>", uvCode)
      .replace("#include <worldpos_vertex>", `#include <worldpos_vertex>
        { vec4 fW = vec4(transformed, 1.0);
          #ifdef USE_INSTANCING
            fW = instanceMatrix * fW;
          #endif
          vFinW = (modelMatrix * fW).xyz; }`);
    sh.fragmentShader = "varying vec4 vFinF;\nvarying vec3 vFinW;\n" + sh.fragmentShader
      .replace("#include <common>", "#include <common>\n" + GLSL_FUNCS)
      .replace("#include <map_fragment>", "#include <map_fragment>\n" + alb)
      .replace("#include <lights_fragment_maps>", "#include <lights_fragment_maps>\n" + refl);
  };
  m.customProgramCacheKey = function(){ return key; };
  m.needsUpdate = true;
  return m;
}

/* ================================================================ SHINGLE
   Laminated architectural shingle, medium-grey blend. Tile = 40" (one shingle) x 21.6" = four 5.4" courses;
   each 0.9 ft roof strip shows two courses (V jitter quantised to halves). Canvas bottom (v=0) = downhill butt edge.
   Per course: solid top layer with dragon-tooth tabs; cut-outs between tabs expose the darker backer ("shadow") layer;
   next course's butt casts a thin shadow across the head of the exposure. */
function shingleMaps(C){
  const W = 1024, H = 512, N = W * H, NC = 4, CH = H / NC;
  const pu = 40 / W, pv = 21.6 / H, E = 5.4;
  const rnd = C.rng(7103), G = grit(N * 2);
  const blot = up(field(C, 128, 64, {octaves: 4, base: 5, sx: 2, sy: 1, seed: 11, persistence: 0.55}), W, H, "fa");
  const mott = up(field(C, 256, 128, {octaves: 2, base: 24, sx: 2, sy: 1, seed: 12}), W, H, "fb");
  /* granule clusters (~0.1-0.2in): survive mip-mapping, read as the sandy surface of real shingles */
  const clus = up({f: G.subarray(N, N + 256 * 128), w: 256, h: 128}, W, H, "fc");
  const tone = buf("t1", N), tint = buf("t2", N), shade = buf("t3", N), hgt = buf("hgt", N), rough = buf("rough", N);
  const BASE = [113, 117, 122];
  /* course layouts first: the butt of course k+1 shades the head of course k (more under double-ply tabs) */
  const L = [];
  for (let k = 0; k < NC; k++){
    const seam = Math.floor(rnd() * W), segs = [];
    let x = 0, tooth = true;
    while (x < W){
      let w = tooth ? (2.8 + rnd() * 4.4) / pu : (1.2 + Math.pow(rnd(), 1.2) * 3.4) / pu;
      if (W - x < w + 2.8 / pu) w = W - x;
      const r = rnd(), slant = (rnd() - 0.5) * 0.8;
      segs.push({
        x0: x, x1: x + w, tooth,
        tone: tooth ? (r < 0.3 ? 4 : r < 0.75 ? 0 : r < 0.95 ? -4 : -9) + (rnd() - 0.5) * 4 : -50 + (rnd() - 0.5) * 12,
        tint: (rnd() - 0.5) * 4,
        top: (0.55 + Math.pow(rnd(), 1.3) * 1.1) / pv,         /* cut-out height above the butt, px */
        tsl: (rnd() < 0.5 ? -1 : 1) * (0.06 + rnd() * 0.22),     /* raked cut-out head: dark wedge dashes */
        sl: rnd() < 0.5 ? slant : 0, sr: rnd() < 0.5 ? 0 : -slant   /* dragon-tooth: one side raked */
      });
      x += w; tooth = !tooth;
      if (segs.length > 80) break;
    }
    const cut = new Uint8Array(W);
    segs.forEach(s => { if (!s.tooth) for (let i = Math.floor(s.x0); i < Math.ceil(s.x1); i++) cut[(i + seam) % W] = 1; });
    L.push({seam, segs, cut});
  }
  for (let k = 0; k < NC; k++){
    const {seam, segs} = L[k], above = L[(k + 1) % NC].cut;
    const own = new Float32Array(W), head = new Float32Array(W), tn = new Float32Array(W);
    segs.forEach((s, si) => {
      const a = segs[si - 1] || segs[segs.length - 1], b = segs[si + 1] || segs[0];
      for (let i = Math.floor(s.x0); i < Math.ceil(s.x1); i++){
        const xx = (i + seam) % W, t = (i - s.x0) / (s.x1 - s.x0);
        own[xx] = s.tooth ? s.tone : a.tone + (b.tone - a.tone) * t;
        tn[xx] = s.tooth ? s.tint : a.tint;
      }
    });
    head.set(own);
    const tmp = new Float32Array(W), R = 12;
    for (let pass = 0; pass < 2; pass++){
      for (let i = 0; i < W; i++){ let s = 0; for (let j = -R; j <= R; j++) s += head[(i + j + W) % W]; tmp[i] = s / (2 * R + 1); }
      head.set(tmp);
    }
    /* shadow strength along the head of this course, softened a little sideways */
    const str = new Float32Array(W);
    for (let i = 0; i < W; i++){ let s = 0; for (let j = -3; j <= 3; j++) s += above[(i + j + W) % W]; str[i] = 0.62 - 0.32 * s / 7; }
    for (let t = 0; t < CH; t++){
      const y = H - 1 - (k * CH + t), row = y * W;
      const tin = (t + 0.5) * pv;
      const topW = Math.pow(sstep(E - 0.5, E, tin), 1.4);
      const butt = tin < 0.06 ? 0.72 : tin < 0.13 ? 0.88 : 1;
      const wOwn = 1 - sstep(1.6, 3.8, tin);
      const slope = 0.2 * (1 - tin / E);
      for (let x = 0; x < W; x++){
        const p = row + x;
        tone[p] = head[x] + (own[x] - head[x]) * wOwn; tint[p] = tn[x]; shade[p] = (1 - str[x] * topW) * butt;
        hgt[p] = 0.1 + slope; rough[p] = 0.88;
      }
      for (let si = 0; si < segs.length; si++){
        const s = segs[si];
        if (s.tooth) continue;
        const a = s.x0 + s.sl * t, b = s.x1 + s.sr * t;
        for (let i = Math.floor(a); i < Math.ceil(b); i++){
          const gTop = s.top + s.tsl * (s.tsl > 0 ? i - s.x0 : i - s.x1);
          if (t >= gTop) continue;
          const xx = (i + seam) % W, p = row + xx;
          const dEdge = Math.min(i + 0.5 - a, b - i - 0.5) * pu, dTop = (gTop - t) * pv;
          const occ = 0.8 + 0.2 * sstep(0, 0.25, Math.min(dEdge, dTop));
          tone[p] = s.tone * (1.08 - 0.22 * t / gTop); shade[p] *= occ; hgt[p] = slope; rough[p] = 0.93;
        }
      }
      const p0 = row + seam, p1 = row + (seam + 1) % W;
      tone[p0] = -40; hgt[p0] -= 0.06; tone[p1] -= 8;
    }
  }
  /* granules: per-pixel speckle with light and black granules, blend patches */
  const rgb = buf("rgb", N * 3);
  for (let i = 0; i < N; i++){
    const g0 = G[i], g1 = G[i + 3571], g2 = G[i + 91711];
    let v = tone[i] + blot[i] * 6 + mott[i] * 4 + g0 * 14 + clus[i] * 14;
    if (g1 > 0.47) v += 20 + g2 * 14;
    else if (g1 < -0.445) v -= 18 + g2 * 8;
    const s = shade[i], ti = tint[i];
    rgb[i * 3] = (BASE[0] + v + ti + g2 * 5) * s; rgb[i * 3 + 1] = (BASE[1] + v + ti * 0.4) * s; rgb[i * 3 + 2] = (BASE[2] + v - ti * 0.6 - g2 * 3) * s;
    hgt[i] += g0 * 0.012 + g1 * 0.006 + clus[i] * 0.012 + blot[i] * 0.025;
    rough[i] += mott[i] * 0.06 + g2 * 0.04;
  }
  return {W, H, rgb, hgt, rough, pu, pv};
}

/* ================================================================ SIDING
   Vinyl clapboard, 6" exposure, 6 ft x 2 ft tile = four boards; V jitter quantised to quarters so each 0.5 ft board
   (or each 0.5 ft band of a whole-wall panel) is exactly one board. Canvas bottom (v=0) = underside of a board's butt.
   Embossed cedar-grain streaks, rounded nose, sloped face, occlusion under the next board's butt, occasional end-laps. */
function sidingMaps(C){
  const W = 1024, H = 512, N = W * H, NB = 4, BH = H / NB;
  const pu = 72 / W, pv = 24 / H;
  const rnd = C.rng(4242), G = grit(N * 2);
  const streak = up(field(C, 128, 512, {octaves: 3, base: 7, sx: 1, sy: 18, seed: 31, persistence: 0.65}), W, H, "fa");
  const lines = up(field(C, 128, 512, {octaves: 2, base: 5, sx: 1, sy: 56, seed: 32, persistence: 0.6}), W, H, "fb");
  const mott = up(field(C, 64, 32, {octaves: 3, base: 3, sx: 2, sy: 1, seed: 33}), W, H, "fc");
  const rgb = buf("rgb", N * 3), hgt = buf("hgt", N), rough = buf("rough", N);
  const BASE = [139, 121, 115];
  for (let k = 0; k < NB; k++){
    const bt = (rnd() - 0.5) * 3;
    for (let t = 0; t < BH; t++){
      const y = H - 1 - (k * BH + t), row = y * W;
      const tin = (t + 0.5) * pv;
      let h;
      if (tin < 0.45){ const q = 1 - tin / 0.45; h = 0.58 - 0.34 * q * q; }
      else h = 0.1 + 0.48 * (6 - tin) / (6 - 0.45);
      const occ = (1 - 0.46 * Math.pow(sstep(3.6, 6.0, tin), 1.8))
                * (tin < 0.07 ? 0.62 : tin < 0.15 ? 0.8 : tin < 0.25 ? 0.93 : 1)
                * (1 + 0.05 * sstep(0.3, 0.5, tin) * (1 - sstep(0.55, 1.2, tin)));
      for (let x = 0; x < W; x++){
        const p = row + x;
        const s = streak[p], l = lines[p];
        const dl = sstep(-0.16, -0.34, l);                  /* sparse dark embossed grain lines */
        hgt[p] = h + s * 0.012 - dl * 0.01 + G[p] * 0.002;
        const v = bt + s * 9 - dl * 13 + mott[p] * 5 + G[p] * 4;
        rgb[p * 3] = (BASE[0] + v) * occ; rgb[p * 3 + 1] = (BASE[1] + v * 0.95) * occ; rgb[p * 3 + 2] = (BASE[2] + v * 0.9) * occ;
        rough[p] = 0.5 + s * 0.06 + dl * 0.06 - mott[p] * 0.04 + (1 - occ) * 0.12;
      }
    }
  }
  /* panel end-laps: hairline step, barely visible */
  [[1, 0.31], [3, 0.74]].forEach(([k, u]) => {
    const xs = Math.round(u * W);
    for (let t = 0; t < BH; t++){
      const row = (H - 1 - (k * BH + t)) * W;
      for (let d = -5; d <= 2; d++){
        const p = row + (xs + d + W) % W;
        if (d < 0) hgt[p] += 0.03;
        const f = d === 0 ? 0.8 : d === 1 ? 0.93 : 1;
        rgb[p * 3] *= f; rgb[p * 3 + 1] *= f; rgb[p * 3 + 2] *= f;
      }
    }
  });
  return {W, H, rgb, hgt, rough, pu, pv};
}

/* ================================================================ TRIM / FRAME (white aluminium coil + vinyl extrusions)
   grain runs along canvas V (the piece's length): faint extrusion lines, gentle oil-canning, orange peel, dirt film */
function whiteMaps(C, o){
  const W = o.W, H = o.H, N = W * H, pu = o.inU / W, pv = o.inV / H;
  const G = grit(N * 2);
  const wave = up(field(C, 16, 32, {octaves: 2, base: 2, sx: 1, sy: 2, seed: o.seed}), W, H, "fa");
  const dirt = up(field(C, 64, 64, {octaves: 4, base: 3, seed: o.seed + 1, persistence: 0.6}), W, H, "fb");
  const lines = up(field(C, 128, 8, {octaves: 2, base: 24, sx: 2, sy: 0.125, seed: o.seed + 2}), W, H, "fc");
  const B = o.base;
  const rgb = buf("rgb", N * 3), hgt = buf("hgt", N), rough = buf("rough", N);
  for (let i = 0; i < N; i++){
    const d = Math.max(0, dirt[i] + 0.1), g = G[i], g2 = G[i + 7919];
    const v = -d * d * o.dirt * 60 + lines[i] * o.lines * 6 + g * 2.2 + g2 * 1.2;
    rgb[i * 3] = B[0] + v; rgb[i * 3 + 1] = B[1] + v * 1.03; rgb[i * 3 + 2] = B[2] + v * 1.12;
    hgt[i] = wave[i] * o.wave + lines[i] * o.lines * 0.004 + g2 * 0.0012;
    rough[i] = o.rough + d * 0.12 + g * 0.03;
  }
  return {W, H, rgb, hgt, rough, pu, pv};
}

/* ================================================================ GLASS
   3 ft x 4 ft tile anchored to the TOP of each pane: white mini-blinds hanging from the head (~1.9 ft drop), dim room below.
   Albedo = the interior seen through the glass (dark); reflections = env + treeline/cloud patch.
   Emissive map = warm night glow through the same blinds / room (dark until emissiveIntensity > 0). */
function glassMaps(C){
  const W = 512, H = 512, N = W * H, pu = 36 / W, pv = 48 / H;
  const G = grit(N * 2);
  const room = up(field(C, 32, 32, {octaves: 3, base: 3, seed: 51}), W, H, "fa");
  const fold = up(field(C, 64, 8, {octaves: 2, base: 9, sx: 1, sy: 0.25, seed: 52}), W, H, "fb");
  const rgb = buf("rgb", N * 3), em = buf("em", N * 3);
  const blindBot = 48 - 23;
  const lad = [5.5, 18, 30.5];
  const EC = [255, 194, 124];
  for (let y = 0; y < H; y++){
    const yin = (H - 1 - y + 0.5) * pv;
    let mode = yin > blindBot + 1.1 ? 0 : yin > blindBot ? 1 : 2;
    const ph = (48 - yin) % 1.0, slat = ph < 0.84;
    const curv = slat ? 0.82 + 0.3 * Math.sin(ph / 0.84 * Math.PI) - 0.16 * ph : 0;
    const blindL = slat ? (70 + 32 * curv) * (0.9 + 0.1 * (yin - blindBot) / 23) : 30;
    const blindE = slat ? 0.4 + 0.2 * curv : 0.95;
    const wallE = 0.24 + 0.24 * sstep(0, 24, yin);
    for (let x = 0; x < W; x++){
      const p = y * W + x, xin = (x + 0.5) * pu;
      let v, e, warm = 0;
      if (mode === 0){
        v = blindL + room[p] * 8; e = blindE;
        if (Math.abs(xin - lad[0]) < 0.3 || Math.abs(xin - lad[1]) < 0.3 || Math.abs(xin - lad[2]) < 0.3){ v = v * 0.9 + 6; e *= 0.8; }
      } else if (mode === 1){ v = 104 + room[p] * 6; e = 0.3; }
      else {
        /* room: back wall lit from the window, soft dark furniture masses, curtain panel at one side */
        v = 34 + 12 * sstep(0, 22, yin) + room[p] * 16;
        e = wallE + room[p] * 0.08;
        const sofa = sstep(0, 1.6, Math.min(xin - 3, 26 - xin)) * sstep(0, 1.2, 13.5 - yin);
        v += (19 + fold[p] * 8 - v) * sofa * 0.85; e *= 1 - 0.7 * sofa;
        const dl = (xin - 30) * (xin - 30) + (yin - 19.5) * (yin - 19.5);
        if (dl < 900){ const lamp = Math.exp(-dl / 40); e += 0.8 * lamp; v += 13 * Math.exp(-dl / 8); warm = lamp; }
        if (xin > 33.2){ const c = 0.5 + 0.5 * Math.sin(xin * 4.1 + fold[p] * 3); v = 30 + c * 18; e = 0.4 + c * 0.22; }
      }
      const n = G[p] * 3;
      rgb[p * 3] = v + 2 + n; rgb[p * 3 + 1] = v + n; rgb[p * 3 + 2] = v - 1 + n;
      e = e > 1 ? 1 : e;
      em[p * 3] = EC[0] * e; em[p * 3 + 1] = EC[1] * e * (1 + 0.06 * warm); em[p * 3 + 2] = EC[2] * e;
    }
  }
  /* float-glass waviness: tiny, low-frequency (bends reflections a hair, like real panes) */
  const wave = up(field(C, 32, 32, {octaves: 2, base: 2, seed: 53}), 256, 256);
  for (let i = 0; i < wave.length; i++) wave[i] *= 0.012;
  return {W, H, rgb, em, wave, pu, pv};
}

/* ================================================================ DOOR (white full-view storm door, 36" x 81.6") */
function doorMaps(C){
  const W = 512, H = 1024, N = W * H, pu = 36 / W, pv = 81.6 / H;
  const G = grit(N * 2);
  const dirt = up(field(C, 32, 64, {octaves: 4, base: 3, sx: 1, sy: 2, seed: 61, persistence: 0.6}), W, H, "fa");
  const room = up(field(C, 32, 64, {octaves: 3, base: 3, sx: 1, sy: 2, seed: 62}), W, H, "fb");
  const rgb = buf("rgb", N * 3), hgt = buf("hgt", N), rough = buf("rough", N), metal = buf("metal", N, true);
  const WH = [229, 227, 222];
  const S = 3.0, TOP = 3.0, KICK = 10.5, RAIL = 13.0, BEAD = 0.45, DW = 36, DH = 81.6;
  /* 1. white frame everywhere, with dirt film and splash-back grime toward the bottom */
  for (let y = 0; y < H; y++){
    const yin = (H - 1 - y + 0.5) * pv, low = 10 * (1 - sstep(0, 9, yin));
    for (let x = 0; x < W; x++){
      const p = y * W + x, d = Math.max(0, dirt[p] + 0.15), gm = d * d * 30 + low * (0.5 + d), n = G[p] * 2.4;
      rgb[p * 3] = WH[0] - gm + n; rgb[p * 3 + 1] = WH[1] - gm * 1.04 + n; rgb[p * 3 + 2] = WH[2] - gm * 1.15 + n;
      hgt[p] = 0.5 + G[p + 333] * 0.0015; rough[p] = 0.42 + d * 0.1;
    }
  }
  /* paint helper over a rectangle given in inches (x from left, y from bottom) */
  function rect(x0, y0, x1, y1, fn){
    const ca = Math.max(0, Math.floor(x0 / pu)), cb = Math.min(W, Math.ceil(x1 / pu));
    const ra = Math.max(0, Math.floor(H - y1 / pv)), rb = Math.min(H, Math.ceil(H - y0 / pv));
    for (let y = ra; y < rb; y++){
      const yin = (H - 1 - y + 0.5) * pv; if (yin < y0 || yin >= y1) continue;
      for (let x = ca; x < cb; x++){ const xin = (x + 0.5) * pu; if (xin < x0 || xin >= x1) continue; fn(y * W + x, xin, yin); }
    }
  }
  function set(p, r, g, b, h, ro, me){ rgb[p * 3] = r; rgb[p * 3 + 1] = g; rgb[p * 3 + 2] = b; hgt[p] = h; rough[p] = ro; metal[p] = me; }
  /* 2. glazing: bead, gasket, glass showing the white entry door behind it in shade */
  rect(S, RAIL, DW - S, DH - TOP, (p, xin, yin) => {
    const de = Math.min(xin - S, DW - S - xin, yin - RAIL, DH - TOP - yin);
    if (de < BEAD){ const f = 0.86; rgb[p * 3] *= f; rgb[p * 3 + 1] *= f; rgb[p * 3 + 2] *= f; hgt[p] = 0.5 - 0.25 * de / BEAD; return; }
    if (de < BEAD + 0.12){ set(p, 42, 42, 43, 0.18, 0.6, 0); return; }
    /* entry door behind the glass: white raised panels in shade, soft bevel shading lit from above */
    const ix = Math.abs(xin - 18), side = xin < 18 ? -1 : 1;
    let v = 70 + room[p] * 10;
    const py0 = yin > 47.5 ? 50 : 20, py1 = yin > 47.5 ? 74 : 45;
    if (ix > 2 && ix < 12 && yin > py0 && yin < py1){
      const dl = ix - 2, dr = 12 - ix, db = yin - py0, dt = py1 - yin, pe = Math.min(dl, dr, db, dt);
      if (pe < 1.3){
        const f = pe === dt ? 1.1 : pe === db ? 0.8 : ((pe === dl) === (side > 0) ? 0.93 : 1.03);
        v *= f * (pe < 0.15 ? 0.85 : 1);
      } else v *= 1.03;
    }
    v *= 0.82 + 0.18 * sstep(13, 60, yin);
    const n = G[p] * 3;
    set(p, v + n, v + 1 + n, v + 3 + n, 0, 0.05, 0);
  });
  /* 3. kick panel, pressed recess */
  rect(S, 0.55, DW - S, KICK, p => { hgt[p] = 0.45; });
  rect(S + 2, 2.5, DW - S - 2, KICK - 1.5, (p, xin, yin) => {
    const de = Math.min(xin - S - 2, DW - S - 2 - xin, yin - 2.5, KICK - 1.5 - yin);
    hgt[p] = 0.45 - 0.08 * sstep(0, 0.35, de);
  });
  /* 4. rubber sweep */
  rect(0, 0, DW, 0.55, p => set(p, 66 + G[p] * 6, 66 + G[p] * 6, 67 + G[p] * 6, 0.35, 0.85, 0));
  /* 5. latch-side hardware on the right stile: oil-rubbed bronze plate + pull, brass key cylinder */
  rect(33.85, 33.8, 34.95, 40.2, p => set(p, 46, 42, 38, 0.9, 0.32, 0.75));
  rect(33.95, 34.4, 34.45, 36.7, p => set(p, 36, 34, 32, 1.25, 0.28, 0.75));
  rect(34.1, 37.5, 34.7, 38.1, p => set(p, 150, 128, 84, 1.0, 0.25, 1));
  /* 6. rounded outer edges */
  rect(0, 0, DW, DH, (p, xin, yin) => {
    const fr = Math.min(xin, DW - xin, yin, DH - yin);
    if (fr < 0.25){ hgt[p] -= (0.25 - fr) * 0.8; rgb[p * 3] *= 0.92; rgb[p * 3 + 1] *= 0.92; rgb[p * 3 + 2] *= 0.92; }
  });
  return {W, H, rgb, hgt, rough, metal, pu, pv};
}

/* ================================================================ STEEL (galvanised / grey-painted steel post) */
function steelMaps(C){
  const W = 256, H = 512, N = W * H, pu = 12 / W, pv = 24 / H;
  const rnd = C.rng(8181), G = grit(N * 2);
  const patch = up(field(C, 32, 64, {octaves: 4, base: 2, sx: 1, sy: 2, seed: 71, persistence: 0.5}), W, H, "fa");
  const streak = up(field(C, 64, 32, {octaves: 3, base: 10, sx: 1, sy: 0.25, seed: 72}), W, H, "fb");
  /* zinc spangle: jittered-grid cells, ~0.9" across, each with its own sheen */
  const CS = 0.9, gx = Math.round(12 / CS), gy = Math.round(24 / CS);
  const px = new Float32Array(gx * gy), py = new Float32Array(gx * gy), pt = new Float32Array(gx * gy);
  for (let i = 0; i < gx * gy; i++){ px[i] = rnd(); py[i] = rnd(); pt[i] = rnd() - 0.5; }
  const rgb = buf("rgb", N * 3), hgt = buf("hgt", N), rough = buf("rough", N), metal = buf("metal", N, true);
  for (let y = 0; y < H; y++){
    const fy = (y + 0.5) / H * gy, cy = Math.floor(fy);
    for (let x = 0; x < W; x++){
      const p = y * W + x;
      const fx = (x + 0.5) / W * gx, cx = Math.floor(fx);
      let best = 9, best2 = 9, tone = 0;
      for (let j = -1; j <= 1; j++){
        const iy = (cy + j + gy) % gy;
        for (let i = -1; i <= 1; i++){
          const ix = (cx + i + gx) % gx, c = iy * gx + ix;
          const ddx = cx + i + px[c] - fx, ddy = cy + j + py[c] - fy, dd = ddx * ddx + ddy * ddy;
          if (dd < best){ best2 = best; best = dd; tone = pt[c]; } else if (dd < best2) best2 = dd;
        }
      }
      const edge = sstep(0, 0.02, Math.sqrt(best2) - Math.sqrt(best));
      const ox = Math.max(0, patch[p] + 0.05);
      const v = 128 + tone * 4 * (1 - ox) + streak[p] * 5 + G[p] * 4 - (1 - edge) * 1.5 + ox * 4;
      rgb[p * 3] = v - 1; rgb[p * 3 + 1] = v + 1; rgb[p * 3 + 2] = v + 4;
      metal[p] = 0.8 - ox * 0.5;
      rough[p] = 0.46 + tone * 0.1 + ox * 0.2 + G[p] * 0.04;
      hgt[p] = (1 - edge) * -0.002 + streak[p] * 0.004 + G[p] * 0.0012;
    }
  }
  for (let k = 0; k < 30; k++){
    const sx = Math.floor(rnd() * W), sy = Math.floor(rnd() * H), r = 1 + rnd() * 2;
    for (let j = -3; j <= 3; j++) for (let i = -3; i <= 3; i++){
      const dd = Math.hypot(i, j); if (dd > r) continue;
      const p = ((sy + j + H) % H) * W + (sx + i + W) % W, f = 0.6 + 0.35 * dd / r;
      rgb[p * 3] *= f; rgb[p * 3 + 1] *= f * 0.97; rgb[p * 3 + 2] *= f * 0.92; rough[p] = 0.75; metal[p] = 0.3;
    }
  }
  return {W, H, rgb, hgt, rough, metal, pu, pv};
}

/* ================================================================ public */
REAL.finish = {
  create: function(THREE, renderer, opts){
    opts = opts || {};
    const C = REAL.core;
    const t0 = performance.now();
    const T = REAL.finish.timings = {}; let tl = t0;
    const lap = n => { const t = performance.now(); T[n] = +(t - tl).toFixed(1); tl = t; };
    function std(maps, o){
      const m = new THREE.MeshStandardMaterial({color: 0xffffff, roughness: 1, metalness: maps.metal ? 1 : 0});
      m.map = C.texture(THREE, rgbCanvas(C, maps.W, maps.H, maps.rgb), {srgb: true});
      m.normalMap = C.texture(THREE, normalCanvas(C, maps.W, maps.H, maps.hgt, maps.pu, maps.pv, 1));
      m.normalScale = new THREE.Vector2(o.ns || 1, o.ns || 1);
      const rm = C.texture(THREE, dataCanvas(C, maps.W, maps.H, maps.rough, maps.metal || null));
      m.roughnessMap = rm; if (maps.metal) m.metalnessMap = rm;
      return finPatch(m, o.patch);
    }

    /* roof: tile 40" x 21.6" (4 courses), strips of 0.9 ft pick a course pair; macro weathering blotches ~9 ft */
    const shingle = std(shingleMaps(C), {patch: {tile: [3.33333, 1.8], jit: [1, 1], vSteps: 2, macro: [0.07, 0.11]}});
    lap("shingle");
    /* walls: tile 6 ft x 2 ft (4 boards), boards pick one of four; faint sun-fade variation */
    const siding = std(sidingMaps(C), {patch: {tile: [6, 2], jit: [1, 1], vSteps: 4, macro: [0.03, 0.09]}});
    lap("siding");
    /* trim: warm-white coil stock, satin, grime toward edges */
    const trim = std(whiteMaps(C, {W: 256, H: 256, inU: 24, inV: 24, seed: 81, base: [231, 229, 223], dirt: 0.7, lines: 0.4, wave: 0.03, rough: 0.42}),
                     {patch: {tile: [2, 2], grain: true, jit: [1, 1], macro: [0.025, 0.2], edge: [0.06, 0.2]}});
    lap("trim");
    /* frame: whiter, smoother, glossier vinyl */
    const frame = std(whiteMaps(C, {W: 256, H: 256, inU: 18, inV: 18, seed: 91, base: [231, 230, 226], dirt: 0.25, lines: 1, wave: 0.006, rough: 0.28}),
                      {patch: {tile: [1.5, 1.5], grain: true, jit: [1, 1], edge: [0.035, 0.12]}});
    lap("frame");

    /* glass: double-glazed dielectric (F0 ~0.08 via reflectivity), dark interior albedo, boosted sky / treeline reflection */
    const gl = glassMaps(C);
    const glass = new THREE.MeshPhysicalMaterial({color: 0xffffff, roughness: 0.035, metalness: 0, reflectivity: 0.72});
    glass.map = C.texture(THREE, rgbCanvas(C, gl.W, gl.H, gl.rgb), {srgb: true});
    glass.normalMap = C.texture(THREE, normalCanvas(C, 256, 256, gl.wave, 36 / 256, 48 / 256, 1));
    glass.normalScale = new THREE.Vector2(1, 1);
    glass.emissiveMap = C.texture(THREE, rgbCanvas(C, gl.W, gl.H, gl.em), {srgb: true});
    glass.emissive = new THREE.Color(1, 1, 1);
    glass.emissiveIntensity = 0;            /* integrator raises this at night (about 1.2 - 2.5) */
    finPatch(glass, {tile: [3, 4], jit: [1, 0], anchorTop: true, refl: {k: 5.5}});
    lap("glass");

    const door = std(doorMaps(C), {patch: {tile: [3, 6.8], jit: [0, 0], refl: {k: 12.0, mask: true}}});
    lap("door");
    const steel = std(steelMaps(C), {patch: {tile: [1, 2], grain: true, jit: [1, 1], edge: [0.03, 0.18]}});
    lap("steel");

    POOL = {}; GRIT = null;                 /* release scratch memory */
    const ms = performance.now() - t0;
    REAL.finish.buildMs = ms;
    return {
      buildMs: ms,
      variants: {
        shingle: {material: shingle, sample: [12, 0.07, 0.9], rot: [0.6, 0, 0], spread: [0, 0.45, -0.75], count: 6, tile: [3.33333, 1.8],
                  note: "top face: v=0 (local +z edge) is the DOWNHILL butt edge; each 0.9 ft strip shows two 5.4in courses"},
        siding:  {material: siding, sample: [8, 0.5, 0.05], spread: [0, 0.5, 0], count: 8, tile: [6, 2],
                  note: "a lap butt every 0.5 ft up from the piece's bottom face; works as single boards or whole wall panels"},
        trim:    {material: trim, sample: [0.36, 6, 0.07], count: 3, spread: [0.62, 0, 0], tile: [2, 2]},
        frame:   {material: frame, sample: [0.17, 4, 0.24], count: 3, spread: [0.5, 0, 0], tile: [1.5, 1.5]},
        glass:   {material: glass, sample: [3, 4.5, 0.05], count: 2, spread: [3.4, 0, 0], tile: [3, 4],
                  note: "texture anchored to each pane's top edge; emissiveIntensity 0 by day, raise at night"},
        door:    {material: door, sample: [3, 6.8, 0.16], count: 1, tile: [3, 6.8], note: "one whole storm door per 3 x 6.8 ft face, no jitter"},
        steel:   {material: steel, sample: [0.3, 8, 0.3], tile: [1, 2]}
      }
    };
  }
};
})();
