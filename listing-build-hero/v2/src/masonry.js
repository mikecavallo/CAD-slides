/* REAL.masonry: procedural photoreal concrete, block, stucco and parge for the build.
   REAL.masonry.create(THREE, renderer, opts) -> { buildMs, variants: { concrete, concreteWet, cmu, stucco, parge, walk } }
   Every variant is { material, sample:[sx,sy,sz] (feet), optional spread, count } (sample/spread/count are lab hints).
   opts.res = 2 doubles the concrete/wet/walk maps to 1024 (about 4x their build time); default 1 = 512.
   All textures are generated with canvas 2D + REAL.core noise; deterministic (fixed seeds), no images.

   Each material is a core.material (world-scaled UVs) plus a small shader patch (enhance()) that adds, in WORLD space:
     - macro variation: a 256px tileable noise texture sampled planar in world feet at four scales unrelated to the
       tile (blotches, sparse darker vertical weathering streaks on vertical faces, medium breakup). Low-frequency
       tone lives here, not in the tile, so 3-4 ft repeats do not show on long slabs and walls, and the variation
       runs continuously across neighbouring pieces;
     - sub-texel grain: a 256px grain map at ~0.7 ft per repeat for albedo, roughness and a derivative bump, so
       close-ups stay crisp; it averages out in the mip chain at distance;
     - cmu: a per-block tone (hash of block index along the course + instance index), so no two blocks match;
     - concreteWet: glossy, flattened bleed-water patches on horizontal faces.
   Note: because the macro is world-anchored, a piece that is MOVED (not just revealed) slides under its macro
   pattern; the per-block cmu tone uses gl_InstanceID (WebGL2) so it stays put. */
(function(){
"use strict";
const REAL = window.REAL = window.REAL || {};

/* ---------------------------------------------------------------- helpers */
function sstep(a, b, x){ let t = (x - a) / (b - a); t = t < 0 ? 0 : t > 1 ? 1 : t; return t * t * (3 - 2 * t); }
function c255(v){ return v < 0 ? 0 : v > 255 ? 255 : v; }
function cl(v, a, b){ return v < a ? a : v > b ? b : v; }
/* index wrap for splats whose reach is always far smaller than the tile */
function wrap(v, n){ return v < 0 ? v + n : v >= n ? v - n : v; }

/* uniform white noise -0.5..0.5 (xorshift32) */
function white(n, seed){
  const f = new Float32Array(n);
  let s = (Math.imul(seed | 0, 2654435761) | 0) || 1;
  for (let i = 0; i < n; i++){ s ^= s << 13; s ^= s >>> 17; s ^= s << 5; f[i] = (s >>> 0) / 4294967296 - 0.5; }
  return f;
}
/* tileable separable box blur (radius r px, wraps), `passes` times; ~gaussian after 2-3 passes */
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
/* zero mean, given standard deviation */
function stdNorm(f, sd){
  let m = 0; for (let i = 0; i < f.length; i++) m += f[i]; m /= f.length;
  let v = 0; for (let i = 0; i < f.length; i++){ const d = f[i] - m; v += d * d; }
  const k = sd / (Math.sqrt(v / f.length) || 1);
  for (let i = 0; i < f.length; i++) f[i] = (f[i] - m) * k;
  return f;
}
/* low-res tileable fbm (-0.5..0.5) upsampled bilinearly (wrap) to W x H: far cheaper than full-res fbm */
function lowField(C, w, h, o){
  const f = C.normalize(C.fbm(w, h, o));
  for (let i = 0; i < f.length; i++) f[i] -= 0.5;
  return {f, w, h};
}
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
function field(C, W, H, lw, lh, o){ return up(lowField(C, lw, lh, o), W, H); }

/* canvases: colour (RGB float 0..255), grey data (0..1), normal map from a height field in INCHES */
function toCanvas(C, W, H, rgb){
  const c = C.canvas(W, H), ctx = c.getContext("2d"), img = ctx.createImageData(W, H), d = img.data;
  for (let i = 0, j = 0, k = 0; i < W * H; i++, j += 3, k += 4){ d[k] = c255(rgb[j]); d[k+1] = c255(rgb[j+1]); d[k+2] = c255(rgb[j+2]); d[k+3] = 255; }
  ctx.putImageData(img, 0, 0);
  return c;
}
function greyCanvas(C, W, H, g){
  const c = C.canvas(W, H), ctx = c.getContext("2d"), img = ctx.createImageData(W, H), d = img.data;
  for (let i = 0, k = 0; i < W * H; i++, k += 4){ const v = c255(g[i] * 255); d[k] = d[k+1] = d[k+2] = v; d[k+3] = 255; }
  ctx.putImageData(img, 0, 0);
  return c;
}
/* tangent-space normal map (OpenGL convention, canvas top = +V); pu/pv = pixel size in inches, k = slope gain */
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

/* a round pit (bughole / pore / void) splatted into height (inches) and cavity (0..1) buffers, wrapping */
function pit(hgt, cav, W, H, cx, cy, rx, ry, depth, dark){
  const x0 = Math.floor(cx - rx - 1), x1 = Math.ceil(cx + rx + 1), y0 = Math.floor(cy - ry - 1), y1 = Math.ceil(cy + ry + 1);
  for (let y = y0; y <= y1; y++){
    const yy = wrap(y, H), dy = (y + 0.5 - cy) / ry, dy2 = dy * dy;
    if (dy2 >= 1.3) continue;
    for (let x = x0; x <= x1; x++){
      const dx = (x + 0.5 - cx) / rx, d2 = dx * dx + dy2;
      if (d2 >= 1.3) continue;
      const i = yy * W + wrap(x, W);
      if (d2 < 1){ const t = Math.sqrt(1 - d2); hgt[i] -= depth * t; const o = dark * Math.min(1, t * 2.2); if (o > cav[i]) cav[i] = o; }
      else { hgt[i] += depth * 0.12 * (1.3 - d2) / 0.3; }   /* tiny raised lip */
    }
  }
}

/* ---------------------------------------------------------------- world-space macro patch
   o = { key, s:[sR, sG, sB, sC] feet per repeat, a:[aR, aG, aB, aC] albedo amplitude, r:[rR, rB] roughness amplitude,
         block: [jointU, jointV, toneAmp] (fractions of the tile) or null,
         puddle: [lo, hi, roughness, darken] glossy flat patches on horizontal faces (wet concrete) or null }
   R = broad isotropic blotches, G = sparse darker vertical streaks (vertical faces only), B = medium breakup,
   C = R again, rotated, at a small scale. Four incommensurate scales so neither the tile nor the macro repeat shows. */
function enhance(THREE, m, macroTex, o){
  const grainTex = macroTex.mcrGrain, dt = o.d || [0.8, 0.05, 0.03, 0];
  const f = v => (+v).toFixed(5);
  const prev = m.onBeforeCompile, prevKey = m.customProgramCacheKey;
  const key = "mcr:" + o.key;
  m.onBeforeCompile = function(shader, renderer){
    if (prev) prev.call(this, shader, renderer);
    shader.uniforms.mcrMap = {value: macroTex};
    shader.uniforms.mcrGrain = {value: grainTex};
    shader.vertexShader = "varying vec3 vMcrW;\nvarying vec3 vMcrN;\nvarying vec3 vMcrI;\n" +
      shader.vertexShader.replace("#include <project_vertex>", `#include <project_vertex>
        vec4 mcrW4 = vec4(transformed, 1.0);
        vec3 mcrN3 = objectNormal;
        vMcrI = vec3(0.0);
        #ifdef USE_INSTANCING
          mcrW4 = instanceMatrix * mcrW4;
          mcrN3 = mat3(instanceMatrix) * mcrN3;
          /* per-instance identity for the block-tone hash: the instance index where available (stable if the
             piece is animated), else its position */
          #if __VERSION__ >= 300
            vMcrI = vec3(float(gl_InstanceID) * 1.618, 0.0, 0.0);
          #else
            vMcrI = instanceMatrix[3].xyz;
          #endif
        #endif
        vMcrW = (modelMatrix * mcrW4).xyz;
        vMcrN = normalize(mat3(modelMatrix) * mcrN3);`);
    let blockCode = "";
    if (o.block){
      blockCode = `
        #ifdef USE_UV
        {
          vec2 mcrF = fract(vUv);
          float mcrFace = smoothstep(${f(o.block[0])}, ${f(o.block[0] * 1.15)}, mcrF.x) * (1.0 - smoothstep(${f(1 - o.block[1] * 1.15)}, ${f(1 - o.block[1])}, mcrF.y));
          vec3 mcrBI = vec3(floor(vUv.x), floor(vUv.y), 0.0) + floor(vMcrI * 3.0 + 0.5) * vec3(1.0, 7.0, 13.0);
          float mcrH = fract(sin(dot(mcrBI, vec3(12.9898, 78.233, 37.719))) * 43758.5453);
          float mcrH2 = fract(mcrH * 17.31 + 0.27), mcrH3 = fract(mcrH * 41.7 + 0.61);
          vec3 mcrTone = vec3(1.0 + (mcrH - 0.5) * ${f(o.block[2])}) * vec3(1.0 + (mcrH2 - 0.5) * 0.035, 1.0, 1.0 - (mcrH2 - 0.5) * 0.035);
          mcrTone *= 1.0 - step(0.93, mcrH3) * 0.07;   /* the odd noticeably darker block */
          diffuseColor.rgb *= mix(vec3(1.0), mcrTone, mcrFace);
        }
        #endif`;
    }
    shader.fragmentShader = "uniform sampler2D mcrMap;\nuniform sampler2D mcrGrain;\nvarying vec3 vMcrW;\nvarying vec3 vMcrN;\nvarying vec3 vMcrI;\n" +
      shader.fragmentShader
        .replace("#include <map_fragment>", `#include <map_fragment>
          vec3 mcrA = abs(vMcrN);
          vec2 mcrP = mcrA.y > 0.5 ? vMcrW.xz : (mcrA.x > 0.5 ? vec2(vMcrW.z, vMcrW.y) : vMcrW.xy);
          float mcrR = texture2D(mcrMap, mcrP * ${f(1 / o.s[0])} + vec2(0.13, 0.71)).r;
          float mcrG = texture2D(mcrMap, mcrP * ${f(1 / o.s[1])} + vec2(0.57, 0.29)).g;
          float mcrB = texture2D(mcrMap, vec2(mcrP.y, -mcrP.x) * ${f(1 / o.s[2])} + vec2(0.41, 0.83)).b;
          float mcrC = texture2D(mcrMap, mat2(0.8, 0.6, -0.6, 0.8) * mcrP * ${f(1 / o.s[3])} + vec2(0.23, 0.37)).r;
          float mcrVert = 1.0 - smoothstep(0.3, 0.7, mcrA.y);
          diffuseColor.rgb *= max(0.2, 1.0 + ${f(o.a[0])} * (mcrR - 0.5) * 2.0 + ${f(o.a[1])} * mcrVert * (mcrG - 0.5) * 2.0 + ${f(o.a[2])} * (mcrB - 0.5) * 2.0 + ${f(o.a[3])} * (mcrC - 0.5) * 2.0);
          /* sub-texel grain: a 256px tileable grain map at ~${dt[0]} ft per repeat; it mips to neutral at distance */
          vec2 mcrQ = mcrP * ${f(1 / dt[0])} + vec2(0.17, 0.53);
          vec4 mcrDt = texture2D(mcrGrain, mcrQ);
          diffuseColor.rgb *= 1.0 + ${f(dt[1])} * (mcrDt.r - 0.5) * 2.0;
          float mcrPud = 0.0;
          ${o.puddle ? `mcrPud = smoothstep(${f(o.puddle[0])}, ${f(o.puddle[1])}, mcrR * 0.55 + mcrB * 0.3 + mcrC * 0.15) * smoothstep(0.6, 0.9, mcrA.y);
          diffuseColor.rgb *= 1.0 - ${f(o.puddle[3])} * mcrPud;` : ""}
          ${blockCode}`)
        .replace("#include <roughnessmap_fragment>", `#include <roughnessmap_fragment>
          roughnessFactor = clamp(roughnessFactor + ${f(o.r[0])} * (mcrR - 0.5) * 2.0 + ${f(o.r[1])} * (mcrB - 0.5) * 2.0 + ${f(dt[2])} * (mcrDt.g - 0.5) * 2.0, 0.04, 1.0);
          ${o.puddle ? `roughnessFactor = mix(roughnessFactor, ${f(o.puddle[2])}, mcrPud);` : ""}`)
        .replace("#include <normal_fragment_maps>", `#include <normal_fragment_maps>
          ${dt[3] > 0 ? `{
            /* sub-texel sand bump from the grain map's B channel (three's derivative bump method); height in feet.
               Pixel-footprint derivatives make it fade out by itself once a grain is smaller than a pixel. */
            vec2 mcrDx = dFdx(mcrQ), mcrDy = dFdy(mcrQ);
            float mcrHll = texture2D(mcrGrain, mcrQ).b;
            vec2 mcrDH = vec2(texture2D(mcrGrain, mcrQ + mcrDx).b - mcrHll, texture2D(mcrGrain, mcrQ + mcrDy).b - mcrHll) * ${f(dt[3])};
            vec3 mcrSp = -vViewPosition;
            vec3 mcrSx = dFdx(mcrSp), mcrSy = dFdy(mcrSp);
            vec3 mcrR1 = cross(mcrSy, normal), mcrR2 = cross(normal, mcrSx);
            float mcrDet = dot(mcrSx, mcrR1) * faceDirection;
            vec3 mcrGrad = sign(mcrDet) * (mcrDH.x * mcrR1 + mcrDH.y * mcrR2);
            normal = normalize(abs(mcrDet) * normal - mcrGrad);
          }` : ""}
          ${o.puddle ? "normal = normalize(mix(normal, geometryNormal, mcrPud * 0.9));" : ""}`);
  };
  m.customProgramCacheKey = function(){ return (prevKey ? prevKey.call(this) : "") + key; };
  m.userData.macro = o;
  m.needsUpdate = true;
  return m;
}

/* 256px RGBA tileable macro noise (linear data): R blotches, G vertical streaks, B medium breakup */
function makeMacro(C, THREE){
  const S = 256, N = S * S;
  const r = C.normalize(C.fbm(S, S, {base: 3, octaves: 5, persistence: 0.55, seed: 9101}));
  const g = C.normalize(C.fbm(S, S, {base: 3, sx: 14, sy: 0.67, octaves: 3, persistence: 0.45, seed: 9102}));
  const gm = C.normalize(C.fbm(S, S, {base: 3, sx: 3, sy: 1, octaves: 3, persistence: 0.5, seed: 9104}));
  const b = C.normalize(C.fbm(S, S, {base: 6, octaves: 4, persistence: 0.55, seed: 9103}));
  const c = C.canvas(S, S), ctx = c.getContext("2d"), img = ctx.createImageData(S, S), d = img.data;
  for (let i = 0; i < N; i++){
    /* soft contrast so blotches read as patches rather than a uniform haze */
    /* G is 0.5 (neutral) except in sparse runs of darker streaks: weathering only ever darkens */
    const rr = sstep(0.1, 0.9, r[i]), gg = 0.5 - 0.5 * sstep(0.48, 0.85, g[i]) * sstep(0.4, 0.75, gm[i]), bb = sstep(0.1, 0.9, b[i]);
    d[i*4] = rr * 255; d[i*4+1] = gg * 255; d[i*4+2] = bb * 255; d[i*4+3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  const t = C.texture(THREE, c);
  /* grain: R = sand-size albedo grain (fine + 2px clumps), G = independent grain for roughness, B = grain height
     for the detail bump; all mean 0.5 so they vanish into the mip chain at distance */
  const gr = stdNorm(white(N, 9111), 0.16), gc = stdNorm(blur(white(N, 9112), S, S, 1, 1), 0.12), gg = stdNorm(blur(white(N, 9113), S, S, 1, 1), 0.2);
  const c2 = C.canvas(S, S), ctx2 = c2.getContext("2d"), img2 = ctx2.createImageData(S, S), d2 = img2.data;
  const gh = stdNorm(blur(white(N, 9114), S, S, 1, 1), 0.17);
  for (let i = 0; i < N; i++){ d2[i*4] = c255((0.5 + gr[i] + gc[i]) * 255); d2[i*4+1] = c255((0.5 + gg[i]) * 255); d2[i*4+2] = c255((0.5 + gh[i] + gr[i] * 0.3) * 255); d2[i*4+3] = 255; }
  ctx2.putImageData(img2, 0, 0);
  t.mcrGrain = C.texture(THREE, c2);   /* r128 textures have no userData */
  return t;
}

function mat(C, THREE, W, H, rgb, rough, hgt, pu, pv, o){
  return C.material(THREE, Object.assign({
    map: toCanvas(C, W, H, rgb), normalMap: normalCanvas(C, W, H, hgt, pu, pv, o.nk || 1), normalScale: 1,
    roughnessMap: greyCanvas(C, W, H, rough), roughness: 1
  }, o));
}

/* ---------------------------------------------------------------- cast-in-place concrete (shared by cured + wet) */
function concreteFields(C, R){
  const W = 512 * R, H = W, N = W * H, Tin = 48, p = Tin / W;
  const mott = field(C, W, H, 128, 128, {base: 3, octaves: 5, persistence: 0.55, seed: 101});
  const mott2 = field(C, W, H, 128, 128, {base: 9, octaves: 4, persistence: 0.5, seed: 102});
  const warm = field(C, W, H, 64, 64, {base: 2, octaves: 3, seed: 103});
  const lift = field(C, W, H, 64, 128, {base: 2, sx: 0.5, sy: 7, octaves: 3, seed: 108});   /* long along U: form-board marks */
  const sand = stdNorm(blur(white(N, 105), W, H, 1, 1), 0.25);
  const fine = stdNorm(white(N, 106), 0.25);
  const pitH = new Float32Array(N), cav = new Float32Array(N), agg = new Float32Array(N);
  const rnd = C.rng(107);
  /* faint aggregate ghosting: rounded stones just under the paste, lighter or darker */
  for (let k = 0; k < 500; k++){
    const cx = rnd() * W, cy = rnd() * H, r = (0.15 + Math.pow(rnd(), 2) * 0.4) / p, asp = 0.6 + rnd() * 0.6;
    const tone = (rnd() - 0.6) * 0.35, x0 = Math.floor(cx - r), x1 = Math.ceil(cx + r), ry = r * asp, y0 = Math.floor(cy - ry), y1 = Math.ceil(cy + ry);
    for (let y = y0; y <= y1; y++){
      const yy = wrap(y, H), dy = (y + 0.5 - cy) / ry;
      for (let x = x0; x <= x1; x++){
        const dx = (x + 0.5 - cx) / r, d2 = dx * dx + dy * dy;
        if (d2 >= 1) continue;
        agg[yy * W + wrap(x, W)] += tone * sstep(1, 0.4, d2);
      }
    }
  }
  /* bugholes: strongly clustered (air trapped in patches), many pinholes, some 1/8-1/4", rare 1/2" */
  const tries = [[3000, 0.02, 0.04, 0.03, 0.35], [500, 0.04, 0.08, 0.06, 0.55], [60, 0.08, 0.16, 0.1, 0.7], [6, 0.16, 0.26, 0.15, 0.75]];
  for (const [n, r0, r1, dep, dk] of tries){
    for (let k = 0; k < n; k++){
      const cx = rnd() * W, cy = rnd() * H, i = (cy | 0) * W + (cx | 0);
      if (mott2[i] * 1.6 + mott[i] * 0.5 + (rnd() - 0.5) * 0.35 < 0.12) continue;
      const r = (r0 + rnd() * (r1 - r0)) / p, asp = 0.65 + rnd() * 0.5;
      pit(pitH, cav, W, H, cx, cy, Math.max(0.55, r), Math.max(0.55, r * asp), dep * (0.6 + rnd() * 0.6), dk);
    }
  }
  return {W, H, N, p, mott, mott2, warm, lift, sand, fine, pitH, cav, agg};
}

function makeConcrete(C, THREE, F, macro){
  const {W, H, N, p} = F, rgb = new Float32Array(N * 3), rough = new Float32Array(N), hgt = new Float32Array(N);
  const B = [150, 149, 144];
  for (let i = 0; i < N; i++){
    const m = F.mott[i], m2 = F.mott2[i], s = F.sand[i], a = F.agg[i], cv = F.cav[i], wv = F.warm[i];
    /* laitance: smoother, slightly lighter cream patches; darker damp-cured clouds */
    const lait = sstep(0.1, 0.3, m2 + m * 0.2);
    let L = 1 + m * 0.05 + m2 * 0.06 + F.lift[i] * 0.04 + s * 0.05 + F.fine[i] * 0.03 + a * 0.10 + lait * 0.03;
    L *= 1 - 0.6 * cv;
    rgb[i*3] = B[0] * L * (1 + wv * 0.04); rgb[i*3+1] = B[1] * L; rgb[i*3+2] = B[2] * L * (1 - wv * 0.05);
    hgt[i] = m * 0.03 + m2 * 0.012 + F.lift[i] * 0.01 + s * 0.006 + F.fine[i] * 0.002 + a * 0.006 + F.pitH[i];
    rough[i] = 0.87 + s * 0.06 + F.fine[i] * 0.04 - lait * 0.08 + cv * 0.1;
  }
  const mt = mat(C, THREE, W, H, rgb, rough, hgt, p, p, {tile: [4, 4], grain: "none", nk: 1});
  return enhance(THREE, mt, macro, {key: "concrete", s: [13.7, 13.9, 5.3, 2.9], a: [0.11, 0.06, 0.09, 0.05], r: [0.04, 0.03], d: [0.75, 0.10, 0.05, 0.0006]});
}

function makeConcreteWet(C, THREE, F, macro){
  const {W, H, N, p} = F, rgb = new Float32Array(N * 3), rough = new Float32Array(N), hgt = new Float32Array(N);
  const B = [90, 94, 97];
  const warp = field(C, W, H, 64, 64, {base: 3, octaves: 3, seed: 111});
  const ampF = field(C, W, H, 64, 64, {base: 2, sx: 0.5, sy: 2, octaves: 3, seed: 112});
  const per = 2.6 / p;   /* bull-float ripple spacing (px) */
  const peel = field(C, W, H, 128, 128, {base: 28, octaves: 2, persistence: 0.5, seed: 113});
  for (let y = 0; y < H; y++){
    for (let x = 0; x < W; x++){
      const i = y * W + x, m = F.mott[i], m2 = F.mott2[i], s = F.sand[i];
      const rip = Math.sin((y + warp[i] * 3.8 / p) / per * 6.2832) * cl(0.5 + ampF[i] * 1.6, 0, 1.2);
      /* matte where the surface has started to stiffen and sand shows; glossy paste elsewhere.
         (Bleed-water puddles are world-space, in the shader patch, so they never repeat with the tile.) */
      const matte = cl(0.5 + m2 * 1.2, 0, 1);   /* smooth: a hard threshold would print the 4 ft tile in the gloss */
      const L = 1 + m * 0.02 + m2 * 0.02 + s * 0.035 + F.agg[i] * 0.04 + matte * 0.015;
      rgb[i*3] = B[0] * L * (1 + F.warm[i] * 0.03); rgb[i*3+1] = B[1] * L; rgb[i*3+2] = B[2] * L * (1 - F.warm[i] * 0.02);
      const hs = m * 0.03 + rip * 0.016 + peel[i] * 0.012 + s * (0.002 + matte * 0.006) + F.fine[i] * 0.0008;
      hgt[i] = hs;
      rough[i] = 0.25 + s * 0.06 + matte * 0.05 + F.fine[i] * 0.04 + peel[i] * 0.06;
    }
  }
  const mt = mat(C, THREE, W, H, rgb, rough, hgt, p, p, {tile: [4, 4], grain: "none", nk: 1});
  return enhance(THREE, mt, macro, {key: "wet", s: [11.3, 9.1, 4.7, 2.6], a: [0.06, 0.0, 0.04, 0.03], r: [0.09, 0.05], d: [0.75, 0.025, 0.05], puddle: [0.64, 0.76, 0.08, 0.05]});
}

/* ---------------------------------------------------------------- CMU block wall
   One tile = one block length x one course: 16" x 7.846" (0.6538 ft). Bed joint along the TOP edge, head joint
   along the LEFT edge, both 3/8". The face is wrap-adjacent to joints on all four sides, so its arrises are symmetric. */
function makeCMU(C, THREE, macro){
  const W = 512, H = 256, N = W * H, Win = 16, Hin = 0.6538 * 12, pu = Win / W, pv = Hin / H, px = (pu + pv) / 2, J = 0.375;
  const rgb = new Float32Array(N * 3), rough = new Float32Array(N), hgt = new Float32Array(N);
  const g1 = stdNorm(blur(white(N, 201), W, H, 1, 1), 0.25);
  const g0 = stdNorm(white(N, 202), 0.25);
  const g2 = stdNorm(blur(white(N, 203), W, H, 2, 2), 0.25);
  const mott = field(C, W, H, 128, 64, {base: 4, sx: 1, sy: 0.5, octaves: 4, seed: 204});
  const edgeN = field(C, W, H, 256, 128, {base: 20, sx: 1, sy: 0.5, octaves: 3, seed: 205});
  const pitH = new Float32Array(N), cav = new Float32Array(N);
  const rnd = C.rng(206);
  /* surface voids of the block face: many 0.5-1.5 mm, a few 2-4 mm */
  for (let k = 0; k < 1700; k++){
    const r = (0.012 + Math.pow(rnd(), 3) * 0.06);
    pit(pitH, cav, W, H, rnd() * W, rnd() * H, Math.max(0.55, r / pu), Math.max(0.55, r * (0.6 + rnd() * 0.6) / pv), 0.02 + r * 0.5, 0.25 + r * 4);
  }
  const BL = [146, 145, 140], MO = [150, 147, 140];
  for (let y = 0; y < H; y++){
    const Y = (y + 0.5) * pv;
    let ay = Math.abs(Y - J / 2); if (ay > Hin / 2) ay = Hin - ay;
    for (let x = 0; x < W; x++){
      const i = y * W + x, X = (x + 0.5) * pu;
      let ax = Math.abs(X - J / 2); if (ax > Win / 2) ax = Win - ax;
      const en = edgeN[i] * 0.09 + g2[i] * 0.04;
      const sdx = ax - J / 2 + en, sdy = ay - J / 2 + en * 0.8;
      const sd = Math.min(sdx, sdy);              /* signed distance into the block face (in) */
      const wf = cl(sd / px + 0.5, 0, 1);         /* face coverage */
      /* block face: open texture = fine clusters of tiny voids, coarse sand, broad mottle */
      const pore = sstep(0.14, 0.32, -g1[i] - g2[i] * 0.5);
      const arr = sd < 0.1 ? 0.045 * Math.pow(1 - cl(sd, 0, 0.1) / 0.1, 2) : 0;
      const fh = g1[i] * 0.01 + g0[i] * 0.005 + g2[i] * 0.01 + mott[i] * 0.02 - pore * 0.018 + pitH[i] - arr;
      const fL = (1 + mott[i] * 0.10 + g1[i] * 0.05 + g0[i] * 0.04 + g2[i] * 0.04) * (1 - 0.12 * pore) * (1 - 0.5 * cav[i]) * (1 - arr * 3);
      /* mortar: tooled concave joint, sandy, shadowed under the arrises; the bed joint's upper half sits under
         the overhanging arris of the block above, so it is baked a little darker (light comes from above) */
      const t = cl((sd + J / 2) / (J / 2), 0, 1);
      const mh = -0.14 + 0.07 * t * t + g1[i] * 0.005 + g0[i] * 0.004;
      const under = sdy < sdx ? cl(1 - Y / J, 0, 1) : 0;
      const mL = (1 + g1[i] * 0.05 + g0[i] * 0.05 + mott[i] * 0.05) * (0.9 - 0.22 * t * t * t) * (1 - 0.18 * under);
      hgt[i] = mh + (fh - mh) * wf;
      const L = mL + (fL - mL) * wf;
      rgb[i*3] = (MO[0] + (BL[0] - MO[0]) * wf) * L; rgb[i*3+1] = (MO[1] + (BL[1] - MO[1]) * wf) * L; rgb[i*3+2] = (MO[2] + (BL[2] - MO[2]) * wf) * L;
      rough[i] = (0.86 + g1[i] * 0.05) + ((0.93 + g0[i] * 0.04 + pore * 0.04) - (0.86 + g1[i] * 0.05)) * wf;
    }
  }
  const mt = mat(C, THREE, W, H, rgb, rough, hgt, pu, pv, {tile: [1.3333, 0.6538], grain: "none", jitter: 0, nk: 1});
  return enhance(THREE, mt, macro, {key: "cmu", s: [10.7, 13.3, 2.37, 5.1], a: [0.06, 0.08, 0.06, 0.03], r: [0.02, 0.02], d: [0.65, 0.07, 0.03, 0.0009], block: [J / Win, J / Hin, 0.2]});
}

/* ---------------------------------------------------------------- stucco (chimney): sand float / light knock-down over block */
function makeStucco(C, THREE, macro){
  const W = 512, H = 512, N = W * H, Tin = 36, p = Tin / W;
  const rgb = new Float32Array(N * 3), rough = new Float32Array(N), hgt = new Float32Array(N);
  const sand = stdNorm(blur(white(N, 301), W, H, 1, 1), 0.25);
  const g0 = stdNorm(white(N, 302), 0.25);
  const blob = field(C, W, H, 256, 256, {base: 40, octaves: 1, seed: 303});
  const blob2 = field(C, W, H, 128, 128, {base: 12, octaves: 3, persistence: 0.5, seed: 304});
  const mott = field(C, W, H, 128, 128, {base: 3, octaves: 5, persistence: 0.55, seed: 305});
  const swirl = new Float32Array(N);
  const rnd = C.rng(306);
  /* float swirls: arcs of fine concentric scratches swept by a 4" float */
  for (let k = 0; k < 16; k++){
    const cx = rnd() * W, cy = rnd() * H, R0 = (3.5 + rnd() * 5) / p, band = (1.3 + rnd() * 1.1) / p;
    const th = rnd() * 6.2832, half = 0.6 + rnd() * 0.9, cmx = Math.cos(th), cmy = Math.sin(th), ch = Math.cos(half), ch2 = Math.cos(half * 0.55);
    const sp = (0.12 + rnd() * 0.08) / p, amp = 0.5 + rnd() * 0.5, Rm = R0 + band, Ri = Math.max(0, R0 - band), k2 = 6.2832 / sp;
    /* walk only the annulus: per row, the outer chord minus the inner chord */
    for (let y = Math.floor(cy - Rm); y <= Math.ceil(cy + Rm); y++){
      const yy = wrap(y, H), dy = y + 0.5 - cy, dy2 = dy * dy;
      if (dy2 > Rm * Rm) continue;
      const xo = Math.sqrt(Rm * Rm - dy2), xi = dy2 < Ri * Ri ? Math.sqrt(Ri * Ri - dy2) : -1;
      for (let x = Math.floor(cx - xo); x <= Math.ceil(cx + xo); x++){
        const dx = x + 0.5 - cx;
        if (dx > -xi && dx < xi) { x = Math.ceil(cx + xi - 0.5) - 1; continue; }   /* next x has dx >= xi */
        const r2 = dx * dx + dy2;
        if (r2 > Rm * Rm) continue;
        const r = Math.sqrt(r2), ca = (dx * cmx + dy * cmy) / r;
        if (ca < ch) continue;
        const wr = 1 - Math.abs(r - R0) / band, wa = sstep(ch, ch2, ca);
        if (wr <= 0) continue;
        swirl[yy * W + wrap(x, W)] += Math.sin(r * k2) * amp * wr * wr * wa;
      }
    }
  }
  /* very faint block coursing ghosting through (7.2" courses, 18" units, half bond) */
  const course = 7.2, unit = 18;
  const B = [117, 100, 106];
  for (let y = 0; y < H; y++){
    const Y = (y + 0.5) * p, ci = Math.floor(Y / course), dyc = Math.abs(Y - (ci + 0.5) * course);
    const jy = sstep(course / 2 - 0.3, course / 2, dyc);
    for (let x = 0; x < W; x++){
      const i = y * W + x, X = (x + 0.5) * p + (ci % 2) * unit / 2;
      const dxc = Math.abs((X % unit) - unit / 2), jx = sstep(unit / 2 - 0.3, unit / 2, dxc);
      const joint = Math.max(jy, jx) * cl(0.6 + blob2[i] * 2, 0, 1);
      /* light knock-down: small flattened pads (~1/2-1") with sandy crevices between them */
      const v = blob[i] + blob2[i] * 0.3 + sand[i] * 0.1;
      const isl = sstep(-0.02, 0.05, v);
      const sw = swirl[i] * (0.5 + isl * 0.5);
      /* darker troweled smears where the float pressed the paste (reference chimney), lighter dry sand on the pads */
      const smear = sstep(0.05, 0.24, blob2[i] + mott[i] * 0.4 + blob[i] * 0.35 - sand[i] * 0.12);
      hgt[i] = isl * 0.016 + sand[i] * 0.013 + g0[i] * 0.006 + sw * 0.004 + mott[i] * 0.015 + blob2[i] * 0.02 - joint * 0.016 - smear * 0.006;
      const L = (1 + mott[i] * 0.05 + blob2[i] * 0.06 + sand[i] * 0.12 + g0[i] * 0.08 + sw * 0.015) * (0.97 + isl * 0.05) * (1 - smear * 0.08) * (1 - joint * 0.07);
      rgb[i*3] = B[0] * L; rgb[i*3+1] = B[1] * L * (1 - mott[i] * 0.02); rgb[i*3+2] = B[2] * L;
      rough[i] = 0.9 + sand[i] * 0.05 - isl * 0.03 + g0[i] * 0.03 - smear * 0.05;
    }
  }
  const mt = mat(C, THREE, W, H, rgb, rough, hgt, p, p, {tile: [3, 3], grain: "none", nk: 1});
  return enhance(THREE, mt, macro, {key: "stucco", s: [9.3, 12.7, 4.1, 2.3], a: [0.10, 0.18, 0.07, 0.08], r: [0.02, 0.02], d: [0.7, 0.08, 0.03, 0.0009]});
}

/* ---------------------------------------------------------------- parge (painted foundation band) */
function makeParge(C, THREE, macro){
  const W = 512, H = 512, N = W * H, Win = 48, Hin = 30, pu = Win / W, pv = Hin / H;
  const rgb = new Float32Array(N * 3), rough = new Float32Array(N), hgt = new Float32Array(N);
  const sand = stdNorm(blur(white(N, 401), W, H, 1, 1), 0.25);
  const g0 = stdNorm(white(N, 402), 0.25);
  const und = field(C, W, H, 128, 128, {base: 5, sx: 1, sy: 0.63, octaves: 4, persistence: 0.5, seed: 403});
  const mott = field(C, W, H, 128, 128, {base: 3, sx: 1, sy: 0.63, octaves: 5, persistence: 0.55, seed: 404});
  const lump = field(C, W, H, 128, 128, {base: 14, sx: 1, sy: 0.63, octaves: 3, persistence: 0.5, seed: 405});
  const trow = new Float32Array(N), tw = new Float32Array(N);
  const rnd = C.rng(406);
  /* trowel passes: slightly tilted flat planes; a soft ridge where the blade edge lifted */
  for (let k = 0; k < 38; k++){
    const cx = rnd() * W, cy = rnd() * H, th = (rnd() - 0.5) * 1.4;
    const len = (8 + rnd() * 10), wid = (3.5 + rnd() * 2), ct = Math.cos(th), st = Math.sin(th), tilt = (rnd() - 0.5) * 0.016;
    const Ri = Math.hypot(len, wid) / 2 + 0.6, Ry = Ri / pv, hl = len / 2 + 0.6, hw = wid / 2 + 0.6;
    for (let y = Math.floor(cy - Ry); y <= Math.ceil(cy + Ry); y++){
      const yy = wrap(y, H), dyi = (y + 0.5 - cy) * pv;
      /* exact x-span of the rotated rectangle on this row: |dx ct + dy st| <= hl and |-dx st + dy ct| <= hw */
      let lo = -1e9, hi = 1e9;
      if (Math.abs(ct) > 1e-6){ const a0 = (-hl - dyi * st) / ct, a1 = (hl - dyi * st) / ct; lo = Math.max(lo, Math.min(a0, a1)); hi = Math.min(hi, Math.max(a0, a1)); }
      else if (Math.abs(dyi * st) > hl) continue;
      if (Math.abs(st) > 1e-6){ const b0 = (dyi * ct - hw) / st, b1 = (dyi * ct + hw) / st; lo = Math.max(lo, Math.min(b0, b1)); hi = Math.min(hi, Math.max(b0, b1)); }
      else if (Math.abs(dyi * ct) > hw) continue;
      if (lo > hi) continue;
      for (let x = Math.floor(cx + lo / pu); x <= Math.ceil(cx + hi / pu); x++){
        const dxi = (x + 0.5 - cx) * pu, a = dxi * ct + dyi * st, b = -dxi * st + dyi * ct;
        const ea = len / 2 - Math.abs(a), eb = wid / 2 - Math.abs(b);
        if (ea < -0.6 || eb < -0.6) continue;
        const i = yy * W + wrap(x, W);
        const inside = sstep(-0.1, 0.8, Math.min(ea, eb));
        const rb = (eb + 0.15) / 0.3, ridge = rb > -3 && rb < 3 ? Math.exp(-rb * rb) * sstep(-0.5, 1.5, ea) : 0;
        trow[i] = trow[i] * (1 - inside * 0.8) + inside * (b * tilt) + ridge * 0.008;
        tw[i] = Math.max(tw[i] * (1 - inside * 0.5), inside);
      }
    }
  }
  const course = 7.5, unit = 16;
  const B = [105, 86, 82];
  for (let y = 0; y < H; y++){
    const Y = (y + 0.5) * pv, ci = Math.floor(Y / course), dyc = Math.abs(Y - (ci + 0.5) * course);
    const jy = 1 - sstep(0, 0.5, course / 2 - dyc);
    for (let x = 0; x < W; x++){
      const i = y * W + x, X = (x + 0.5) * pu + (ci % 2) * unit / 2;
      const dxc = Math.abs((X % unit) - unit / 2), jx = 1 - sstep(0, 0.5, unit / 2 - dxc);
      /* the block joints only telegraph where the parge coat is thin */
      const joint = Math.max(jy, jx) * sstep(0.0, 0.3, lump[i] * 1.5 + sand[i] * 0.2) * 0.8;
      const lp = sstep(0.05, 0.3, lump[i]);
      /* troweled areas are flatter and slightly smoother; lumps and sand show between passes */
      const flat = 1 - tw[i] * 0.6;
      hgt[i] = und[i] * 0.035 + trow[i] + (lp * 0.03 + lump[i] * 0.02) * flat + sand[i] * 0.014 * flat + g0[i] * 0.005 - joint * 0.012;
      const L = (1 + mott[i] * 0.07 + sand[i] * 0.07 * flat + g0[i] * 0.05 + und[i] * 0.02 + lump[i] * 0.03) * (1 - joint * 0.03) * (1 + tw[i] * 0.01);
      /* paint wear: some areas redder-brown, some greyer where the coat is thin */
      rgb[i*3] = B[0] * L * (1 + und[i] * 0.06); rgb[i*3+1] = B[1] * L; rgb[i*3+2] = B[2] * L * (1 + mott[i] * 0.03 - und[i] * 0.03);
      rough[i] = 0.8 + sand[i] * 0.04 * flat + mott[i] * 0.06 + g0[i] * 0.03 - tw[i] * 0.06;
    }
  }
  const mt = mat(C, THREE, W, H, rgb, rough, hgt, pu, pv, {tile: [4, 2.5], grain: "none", nk: 1});
  return enhance(THREE, mt, macro, {key: "parge", s: [11.1, 12.1, 3.7, 2.1], a: [0.12, 0.2, 0.07, 0.06], r: [0.03, 0.02], d: [0.8, 0.07, 0.04, 0.0006]});
}

/* ---------------------------------------------------------------- broom-finished walk (weathered, fine aggregate showing)
   grain:'long' puts the canvas V axis along the walk, so broom striations (canvas rows) run ACROSS it. */
function makeWalk(C, THREE, macro, R){
  const W = 512 * R, H = W, N = W * H, Tin = 48, p = Tin / W;
  const rgb = new Float32Array(N * 3), rough = new Float32Array(N), hgt = new Float32Array(N);
  const g0 = stdNorm(white(N, 501), 0.25);
  const g1 = stdNorm(blur(white(N, 502), W, H, 1, 1), 0.25);
  const mott = field(C, W, H, 128, 128, {base: 3, octaves: 5, persistence: 0.55, seed: 503});
  const mott2 = field(C, W, H, 128, 128, {base: 10, octaves: 3, seed: 504});
  const warp = field(C, W, H, 64, 64, {base: 2, sx: 1, sy: 3, octaves: 3, seed: 505});
  const bamp = field(C, W, H, 128, 64, {base: 2, sx: 0.5, sy: 4, octaves: 3, seed: 506});
  /* 1-D bristle profile along V (the broom drags along U): fine random grooves */
  const prof = white(H, 507); { const t = new Float32Array(H); for (let y = 0; y < H; y++) t[y] = (prof[(y + H - 1) % H] + prof[y] * 2 + prof[(y + 1) % H]) / 4; prof.set(t); stdNorm(prof, 0.25); }
  const agg = new Float32Array(N), aggH = new Float32Array(N), aggW = new Float32Array(N);
  const rnd = C.rng(509);
  /* weathering has opened the paste: scattered sand-to-pea-size stones, mostly greys and tans, low contrast */
  for (let k = 0; k < 8000; k++){
    const cx = rnd() * W, cy = rnd() * H, r = Math.max(0.6, (0.035 + Math.pow(rnd(), 2.5) * 0.15) / p), ry = r * (0.6 + rnd() * 0.5);
    if (mott2[(cy | 0) * W + (cx | 0)] + rnd() * 0.8 < 0.0) continue;
    /* grey trap rock, white quartz, tan/brown gravel */
    const u = rnd(), tone = u < 0.45 ? -(0.1 + rnd() * 0.22) : u < 0.72 ? (0.06 + rnd() * 0.14) : -(0.04 + rnd() * 0.16);
    const warmS = u < 0.45 ? (rnd() - 0.5) * 0.04 : u < 0.72 ? 0.0 : 0.06 + rnd() * 0.08;
    const x0 = Math.floor(cx - r - 1), x1 = Math.ceil(cx + r + 1), y0 = Math.floor(cy - ry - 1), y1 = Math.ceil(cy + ry + 1);
    for (let y = y0; y <= y1; y++){
      const yy = wrap(y, H), dy = (y + 0.5 - cy) / ry;
      for (let x = x0; x <= x1; x++){
        const dx = (x + 0.5 - cx) / r, d2 = dx * dx + dy * dy;
        if (d2 >= 1) continue;
        const i = yy * W + wrap(x, W), c = sstep(1, 0.45, d2);
        agg[i] = agg[i] * (1 - c) + tone * c * (0.85 + 0.3 * (1 - d2)); aggW[i] = aggW[i] * (1 - c) + warmS * c;
        aggH[i] = Math.max(aggH[i], Math.sqrt(1 - d2) * 0.015);
      }
    }
  }
  const B = [166, 158, 146];
  for (let y = 0; y < H; y++){
    for (let x = 0; x < W; x++){
      const i = y * W + x;
      let yy = y + warp[i] * 1.4 / p; yy -= Math.floor(yy / H) * H;
      const y0 = yy | 0, ty = yy - y0, y1 = y0 + 1 === H ? 0 : y0 + 1;
      const br = (prof[y0] + (prof[y1] - prof[y0]) * ty) * cl(0.3 + bamp[i] * 1.6, 0.05, 1);
      const a = agg[i];
      /* sand grains: pixel-scale speckle, a little darker and warmer than the paste */
      const sp = g0[i] > 0.28 ? -0.09 : (g0[i] < -0.34 ? 0.06 : 0);
      const L = 1 + mott[i] * 0.035 + mott2[i] * 0.04 + g1[i] * 0.05 + g0[i] * 0.03 + a + sp + br * 0.03;
      const warmA = aggW[i] + 0.01;
      rgb[i*3] = B[0] * L * (1 + warmA); rgb[i*3+1] = B[1] * L; rgb[i*3+2] = B[2] * L * (1 - warmA * 1.3);
      hgt[i] = br * 0.012 + mott[i] * 0.02 + g1[i] * 0.004 + aggH[i] + g0[i] * 0.002;
      rough[i] = 0.9 + g1[i] * 0.05 + (a > 0 ? -0.05 : 0.0) + g0[i] * 0.03;
    }
  }
  const mt = mat(C, THREE, W, H, rgb, rough, hgt, p, p, {tile: [4, 4], grain: "long", nk: 1});
  return enhance(THREE, mt, macro, {key: "walk", s: [15.3, 9.1, 5.9, 2.7], a: [0.08, 0.0, 0.06, 0.04], r: [0.03, 0.02], d: [0.75, 0.07, 0.03, 0.0007]});
}

/* ---------------------------------------------------------------- public */
REAL.masonry = {
  create: function(THREE, renderer, opts){
    opts = opts || {};
    const C = REAL.core, R = opts.res || 1;
    const t0 = performance.now(), T = {}; let tl = t0;
    const lap = k => { const n = performance.now(); T[k] = Math.round(n - tl); tl = n; };
    const macro = makeMacro(C, THREE); lap("macro");
    const F = concreteFields(C, R); lap("concreteFields");
    const concrete = makeConcrete(C, THREE, F, macro); lap("concrete");
    const concreteWet = makeConcreteWet(C, THREE, F, macro); lap("concreteWet");
    const cmu = makeCMU(C, THREE, macro); lap("cmu");
    const stucco = makeStucco(C, THREE, macro); lap("stucco");
    const parge = makeParge(C, THREE, macro); lap("parge");
    const walk = makeWalk(C, THREE, macro, R); lap("walk");
    const ms = performance.now() - t0;
    REAL.masonry.buildMs = ms; REAL.masonry.timing = T;
    return {
      buildMs: ms,
      variants: {
        concrete:    {material: concrete,    sample: [6, 0.8, 2], spread: [6.4, 0, 0], count: 2},
        concreteWet: {material: concreteWet, sample: [6, 0.8, 2], spread: [6.4, 0, 0], count: 2},
        cmu:         {material: cmu,         sample: [4, 0.6538, 0.667], spread: [0, 0.6538, 0], count: 6},
        stucco:      {material: stucco,      sample: [2.4, 8, 5], count: 1},
        parge:       {material: parge,       sample: [8, 2.5, 0.1], count: 1},
        walk:        {material: walk,        sample: [4, 0.1, 6], count: 1}
      }
    };
  }
};
})();
