// Render every timeline segment to its own MP4 (video only), frame-exact, with caching.
//
//   node tools/render.mjs                 render all changed segments
//   node tools/render.mjs --only ch03s02  render specific segment ids (comma separated)
//   node tools/render.mjs --chapter ch03  render one chapter
//   node tools/render.mjs --force         ignore cache
//   node tools/render.mjs --workers 3
//   node tools/render.mjs --scale 2       true 4K (3840 x 2160) for the YouTube upload, cached in build/segments@2x
//   node tools/render.mjs --rehash        mark the segments on disk as current (no rendering)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { serve, openScene, launchBrowser, ROOT } from './serve.mjs';

const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
const has = k => argv.includes(k);

const timing = JSON.parse(fs.readFileSync(path.join(ROOT, 'build/timing.json'), 'utf8'));
const fps = timing.fps;
// --scale 2 renders at 3840 x 2160 (true 4K, sharper text on YouTube) into its own cache, build/segments@2x
const SCALE = Number(arg('--scale', 1));
const OUT = path.join(ROOT, SCALE > 1 ? `build/segments@${SCALE}x` : 'build/segments');
fs.mkdirSync(OUT, { recursive: true });

// index.html counts without its scene <script> lines, so registering a new chapter or video does not re-render the others
let shared = ['video/lib.js', 'video/series.js', 'video/base.css', 'video/index.html'].map(f => fs.readFileSync(path.join(ROOT, f), 'utf8'))
  .map(s => s.replace(/<script src="scenes\/[^"]+"><\/script>\n?/g, '')).join('\n');
// which scene file registers each scene id (files are not always named after their chapter);
// helper files that register no scenes (e.g. the shared bowl c1_bowl.js) belong to their chapter prefix (c1): editing one
// re-renders the scenes in files starting with that prefix. c0.js also uses the chapter 1 helpers, so c1 helpers count for c0.
const SCENE_FILE = {};
const HELPERS = {};
const files = fs.readdirSync(path.join(ROOT, 'video/scenes')).filter(f => f.endsWith('.js')).sort();
const srcs = Object.fromEntries(files.map(f => [f, fs.readFileSync(path.join(ROOT, 'video/scenes', f), 'utf8')]));
const sceneIds = src => [...src.matchAll(/registerScene\('([^']+)'/g)].map(m => m[1]);
for (const f of files) if (!sceneIds(srcs[f]).length) { const k = f.split('_')[0]; HELPERS[k] = (HELPERS[k] || '') + '\n' + srcs[f]; }
// standalone branded videos (v_*.js) and later chapters may use the bowl and pot modules too
const usesC1 = { c0: ['c1'], c2: ['c1'], c3: ['c1', 'c2'], v_: ['c1', 'c2'] };
for (const f of files) {
  const k = f.startsWith('v_') ? 'v_' : f.slice(0, 2);
  const deps = [k, ...(usesC1[k] || [])].map(d => HELPERS[d] || '').join('\n');
  sceneIds(srcs[f]).forEach(id => { SCENE_FILE[id] = srcs[f] + deps; });
}
function segHash(seg) {
  const code = seg.kind === 'bumper' ? '' : (SCENE_FILE[seg.id] || '');
  // start, audio and (for scenes) the chapter title never change what a scene draws, so they do not force a re-render
  const { start, audio, ...rest } = seg;
  if (seg.kind !== 'bumper') delete rest.chapterTitle;
  return crypto.createHash('sha1').update(shared + code + JSON.stringify(rest) + fps).digest('hex').slice(0, 16);
}

let segs = timing.segments;
if (arg('--only')) { const ids = new Set(arg('--only').split(',')); segs = segs.filter(s => ids.has(s.id)); }
if (arg('--chapter')) { const c = new Set(arg('--chapter').split(',')); segs = segs.filter(s => c.has(s.chapter)); }
// --rehash: the segments on disk already match the current timeline; just record their hashes (after a change to
// the hash rules itself, so nothing re-renders for no reason)
if (has('--rehash')) {
  let n = 0;
  for (const s of segs) if (fs.existsSync(path.join(OUT, s.id + '.mp4'))) { fs.writeFileSync(path.join(OUT, s.id + '.hash'), segHash(s)); n++; }
  console.log(`rehashed ${n} segments`);
  process.exit(0);
}
const todo = segs.filter(s => has('--force') || !fs.existsSync(path.join(OUT, s.id + '.mp4')) || (fs.existsSync(path.join(OUT, s.id + '.hash')) ? fs.readFileSync(path.join(OUT, s.id + '.hash'), 'utf8') : '') !== segHash(s));
console.log(`render: ${todo.length} of ${segs.length} segments need rendering`);
if (!todo.length) process.exit(0);

const { srv, base } = await serve();
const browser = await launchBrowser();
const workers = Math.max(1, parseInt(arg('--workers', '3'), 10));
const failures = [];
let done = 0;
const t0 = Date.now();

async function renderSeg(page, seg) {
  const warnings = await openScene(page, base, seg.id);
  if (warnings.length) console.log(`  ! ${seg.id}: ${warnings.slice(0, 3).join(' | ')}`);
  const n = Math.round(seg.dur * fps);
  const tmp = path.join(OUT, seg.id + '.tmp.mp4');
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
    '-vf', 'scale=out_color_matrix=bt709:out_range=tv,format=yuv420p', '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-tune', 'animation',
    '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv',
    '-g', String(fps * 2), '-r', String(fps), '-frames:v', String(n), tmp], { stdio: ['pipe', 'inherit', 'inherit'] });
  const closed = new Promise((res, rej) => ff.on('close', c => (c === 0 ? res() : rej(new Error('ffmpeg exit ' + c)))));
  let last = null, prevT = -1;
  for (let f = 0; f < n; f++) {
    const t = f / fps;
    const changed = await page.evaluate(([a, b]) => { const c = a < 0 || window.changesBetween(a, b); if (c) window.seek(b); return c; }, [prevT, t]);
    if (changed || !last) last = await page.screenshot({ type: 'jpeg', quality: 93 });
    prevT = t;
    if (!ff.stdin.write(last)) await new Promise(r => ff.stdin.once('drain', r));
  }
  ff.stdin.end();
  await closed;
  fs.renameSync(tmp, path.join(OUT, seg.id + '.mp4'));
  fs.writeFileSync(path.join(OUT, seg.id + '.hash'), segHash(seg));
}

const queue = [...todo].sort((a, b) => b.dur - a.dur);
await Promise.all(Array.from({ length: Math.min(workers, queue.length) }, async () => {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: SCALE });
  while (queue.length) {
    const seg = queue.shift();
    const s = Date.now();
    try {
      await renderSeg(page, seg);
      done++;
      console.log(`  [${done}/${todo.length}] ${seg.id} ${seg.dur.toFixed(1)}s in ${((Date.now() - s) / 1000).toFixed(0)}s`);
    } catch (e) {
      failures.push(seg.id);
      console.log(`  FAILED ${seg.id}: ${e.message}`);
    }
  }
  await page.close();
}));
await browser.close();
srv.close();
console.log(`render finished in ${((Date.now() - t0) / 60000).toFixed(1)} min. failures: ${failures.join(', ') || 'none'}`);
process.exit(failures.length ? 1 : 0);
