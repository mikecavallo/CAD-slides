// Print the handouts to PDF (US Letter) and a PNG preview.
//   node handouts/build.mjs                 -> out/Weekly-Tally-Sheet.pdf, out/Weekly-Tally-Sheet.png
import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import fs from 'node:fs';

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(here, '..', 'out');
fs.mkdirSync(out, { recursive: true });

const SHEETS = [['tally-sheet.html', 'Weekly-Tally-Sheet']];
const browser = await chromium.launch();
for (const [src, name] of SHEETS) {
  const page = await browser.newPage({ viewport: { width: 816, height: 1056 }, deviceScaleFactor: 2 });
  await page.goto(pathToFileURL(path.join(here, src)).href);
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: path.join(out, name + '.pdf'), width: '8.5in', height: '11in', printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }, pageRanges: '1' });
  await page.screenshot({ path: path.join(out, name + '.png'), fullPage: false });
  console.log('wrote', name + '.pdf', name + '.png');
}
await browser.close();
