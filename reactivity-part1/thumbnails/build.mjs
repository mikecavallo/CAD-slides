// Section thumbnails (1920x1080 JPG) for a lesson cut into section videos (tools/section_videos.py).
//   node thumbnails/build.mjs management2      -> out/sections/<prefix>-NN-<Title>.jpg
// Each section: the course title, the big section number, "Part N" (as on the video's Part card), the section title,
// and one of Tori's pictures from that section, shown whole.
import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');

const SETS = {
  management2: {
    lesson: 'lesson-management2.json', prefix: 'Management-Solutions-and-Setups', course: 'Management: Solutions and Setups',
    pics: { 1: 'ms_s09.jpg', 2: 'ms_s15.jpg', 3: 'ms_s26.jpg', 4: 'ms_s33.jpg', 5: 'ms_s40.jpg', 6: 'ms_s44.jpg', 7: 'ms_s39.jpg' },
  },
};

const set = SETS[process.argv[2] || 'management2'];
const lesson = JSON.parse(fs.readFileSync(path.join(root, 'script', set.lesson), 'utf8'));
const out = path.join(root, 'out', 'sections');
fs.mkdirSync(out, { recursive: true });

// picture sizes, read from the JPEG headers
const jpegSize = f => {
  const b = fs.readFileSync(f);
  for (let i = 2; i < b.length;) {
    const m = b[i + 1], len = b.readUInt16BE(i + 2);
    if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
    i += 2 + len;
  }
  throw new Error('no size in ' + f);
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
for (const ch of lesson.chapters) {
  const welcome = ch.num === 0;
  const kicker = ch.kicker || 'Chapter';
  const d = welcome
    ? { course: 'Calling All Dogs', label: 'Welcome', title: set.course, welcome: true }
    : { course: set.course, num: ch.num, label: `${kicker} ${ch.num}`, title: ch.title, pic: set.pics[ch.num], nat: jpegSize(path.join(root, 'assets', 'img', set.pics[ch.num])) };
  const url = pathToFileURL(path.join(here, 'thumb.html')).href + '#' + encodeURIComponent(JSON.stringify(d));
  await page.goto('about:blank');
  await page.goto(url);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => document.body.dataset.ready === '1' && [...document.images].every(i => i.complete && i.naturalWidth));
  const slug = ch.title.replace(/&/g, 'and').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const dest = path.join(out, `${set.prefix}-${String(ch.num).padStart(2, '0')}-${slug}.jpg`);
  await page.screenshot({ path: dest, type: 'jpeg', quality: 92 });
  console.log('wrote', path.basename(dest));
}
await browser.close();
