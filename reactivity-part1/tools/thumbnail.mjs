// YouTube thumbnail in the Calling All Dogs look (1920x1080 JPEG, under 2 MB).
//   node tools/thumbnail.mjs --out out/thumb.jpg [--hook 'Reactive or <em>aggressive?</em>'] [--num 1]
//        [--chapter 'Starting with the Basics'] [--series 'Understanding Dog Behavior'] [--photo photo_reactivity.jpg]
//        [--pos '60% 40%'] [--face trainer_headshot.jpg|none]
// Pictures come from assets/img. <em> in the hook turns those words light green.
import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opts = {};
for (let i = 0; i < args.length; i += 2) opts[args[i].replace(/^--/, '')] = args[i + 1];
const out = path.resolve(opts.out || 'out/thumbnail.jpg');
delete opts.out;
const url = 'file://' + path.join(here, 'thumb', 'thumb.html') + '?' + new URLSearchParams(opts);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1.5 });
await page.goto(url);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
await page.screenshot({ path: out, type: 'jpeg', quality: 90 });
await browser.close();
console.log('thumbnail:', out);
