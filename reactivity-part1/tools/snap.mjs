// Still frames for design QA.
//
//   node tools/snap.mjs ch03s02             one still per beat (after its reveal) + the last frame, plus a contact sheet
//   node tools/snap.mjs ch03s02 4.5 10      stills at specific scene times (seconds)
//   node tools/snap.mjs --chapter ch03      every scene in a chapter
// Output: build/snaps/<id>_<label>.jpg and build/snaps/<id>_sheet.jpg
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { serve, openScene, launchBrowser, ROOT } from './serve.mjs';

const argv = process.argv.slice(2);
const timing = JSON.parse(fs.readFileSync(path.join(ROOT, 'build/timing.json'), 'utf8'));
const OUT = path.join(ROOT, 'build/snaps');
fs.mkdirSync(OUT, { recursive: true });

let ids, times = null;
if (argv[0] === '--chapter') ids = timing.segments.filter(s => s.chapter === argv[1] && s.kind === 'scene').map(s => s.id);
else { ids = [argv[0]]; if (argv.length > 1) times = argv.slice(1).map(Number); }

const { srv, base } = await serve();
const browser = await launchBrowser();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
for (const id of ids) {
  const seg = timing.segments.find(s => s.id === id);
  if (!seg) { console.log('unknown segment', id); continue; }
  let warnings;
  try { warnings = await openScene(page, base, id); } catch (e) { console.log('ERROR', e.message); continue; }
  if (warnings.length) console.log(`  ! ${id}: ${warnings.join(' | ')}`);
  const shots = times ? times.map(t => [t.toFixed(2), t])
    : [...seg.beats.map((b, i) => [`b${i + 1}`, Math.min(b.t + 1.6, seg.dur - 0.7)]), ['end', seg.dur - 0.62]];
  const files = [];
  for (const [label, t] of shots) {
    await page.evaluate(t => window.seek(t), t);
    const f = path.join(OUT, `${id}_${label}.jpg`);
    await page.screenshot({ path: f, type: 'jpeg', quality: 85 });
    files.push(f);
  }
  // contact sheet (3 columns, 640x360 tiles) via ffmpeg
  const cols = 3, rows = Math.ceil(files.length / cols);
  const sheet = path.join(OUT, `${id}_sheet.jpg`);
  const inputs = files.flatMap(f => ['-i', f]);
  const pads = Array.from({ length: cols * rows - files.length }, () => ['-f', 'lavfi', '-i', 'color=c=white:s=1920x1080']).flat();
  const total = cols * rows;
  const layout = Array.from({ length: total }, (_, i) => `${(i % cols) * 640}_${Math.floor(i / cols) * 360}`).join('|');
  const scale = Array.from({ length: total }, (_, i) => `[${i}:v]scale=640:360[v${i}]`).join(';');
  const tiles = Array.from({ length: total }, (_, i) => `[v${i}]`).join('');
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...inputs, ...pads, '-filter_complex', `${scale};${tiles}xstack=inputs=${total}:layout=${layout}`, '-frames:v', '1', '-q:v', '3', sheet]);
  console.log(`${id}: ${files.length} stills -> ${path.relative(ROOT, sheet)}`);
}
await browser.close();
srv.close();
