// Chapter 3 homework as a one-page, branded ABC tracker (US Letter, landscape), for the course download.
// Several sightings fit on the page; every blank cell is also a fillable form field, so it can be typed into or printed.
//
//   node tools/homework_pdf.mjs [--rows 5] [--out out/full/Understanding-Dog-Behavior-Ch3-ABC-Tracker.pdf]
//
// The questions and the example row follow the homework slide (ch03s13).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { PDFDocument, PDFName, PDFBool, rgb } from 'pdf-lib';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const opt = (k, d) => { const i = argv.indexOf('--' + k); return i >= 0 ? argv[i + 1] : d; };
const rows = Number(opt('rows', 5));
const out = path.resolve(opt('out', 'out/full/Understanding-Dog-Behavior-Ch3-ABC-Tracker.pdf'));

const font = (family, weight, file, style = 'normal') => `@font-face{font-family:'${family}';font-weight:${weight};font-style:${style};src:url(data:font/woff2;base64,${
  fs.readFileSync(path.join(ROOT, 'assets/fonts', file)).toString('base64')}) format('woff2');}`;
const img = (f) => `data:image/png;base64,${fs.readFileSync(path.join(ROOT, 'assets/img', f)).toString('base64')}`;

// [tile letter or '' for the function target, tile colour, column heading, prompt]
const COLS = [
  ['', '', 'When', 'Date and time'],
  ['A', '#4b5a1e', 'The thing', 'What happened before the behavior?'],
  ['A', '#4b5a1e', 'The context', 'Where were you? How close was it? What else was happening?'],
  ['B', '#619537', 'What your dog did', 'The behavior you saw'],
  ['C', '#2c4a17', 'What happened as a result', 'Did someone move away? Did your dog get something?'],
  ['fn', '#619537', "WTF? What's the Function?", 'What did the behavior accomplish?'],
];
const EX = ['e.g. Tues, 8 am walk', 'e.g. Another dog appears', 'e.g. Same corner, dogs too close', 'e.g. Barked and lunged',
  'e.g. The other dog moved away', 'e.g. More distance?'];
const target = `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#fff" stroke-width="2.4"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`;
const tile = (l, c) => l === '' ? '' : `<span class="tile" style="background:${c}">${l === 'fn' ? target : l}</span>`;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
${font('Montserrat', 400, 'Montserrat-400.woff2')}${font('Montserrat', 500, 'Montserrat-500.woff2')}
${font('Montserrat', 500, 'Montserrat-500i.woff2', 'italic')}${font('Montserrat', 600, 'Montserrat-600.woff2')}
${font('Montserrat', 700, 'Montserrat-700.woff2')}${font('Rubik', 700, 'Rubik-700.woff2')}${font('Rubik', 800, 'Rubik-800.woff2')}
@page { size: Letter landscape; margin: 0.4in 0.45in; }
* { box-sizing: border-box; margin: 0; }
body { width: 10.1in; font-family: Montserrat; color: #212121; -webkit-print-color-adjust: exact; }
header { display: flex; align-items: center; justify-content: space-between; border-bottom: 2.5pt solid #619537; padding-bottom: 7pt; }
.kicker { font: 700 8pt Montserrat; letter-spacing: 3pt; text-transform: uppercase; color: #619537; }
h1 { font: 800 25pt/1.05 Rubik; color: #3f6b22; margin-top: 3pt; }
.sub { font: 500 9.5pt/1.35 Montserrat; color: #4a4a4a; margin-top: 4pt; max-width: 6.6in; }
.sub b { color: #3f6b22; }
header img { height: 0.72in; }
table { width: 100%; border-collapse: separate; border-spacing: 0; margin-top: 9pt; table-layout: fixed; }
th { background: #e8f1dc; text-align: left; vertical-align: top; padding: 6pt 7pt; border-right: 1.5pt solid #fff; }
th:first-child { border-radius: 6pt 0 0 0; } th:last-child { border-radius: 0 6pt 0 0; border-right: 0; }
th .t { display: flex; align-items: center; gap: 5pt; font: 700 9.5pt/1.15 Rubik; color: #2c4a17; }
th .p { font: 500 7.5pt/1.3 Montserrat; color: #4a4a4a; margin-top: 3pt; }
.tile { flex: 0 0 auto; width: 17pt; height: 17pt; border-radius: 4pt; display: grid; place-items: center; color: #fff; font: 800 10pt Rubik; }
td { border-bottom: 1pt solid #c9d2bf; border-right: 1pt dashed #d6ddcc; vertical-align: top; padding: 4pt 7pt; }
td:last-child { border-right: 0; }
tr.ex td { height: 0.36in; font: italic 500 8.5pt/1.25 Montserrat; color: #2f5f8f; background: #f3f8ec; }
tr.blank td { height: ${(4.9 / rows).toFixed(3)}in; }
tr.blank td:first-child { font: 700 9pt Rubik; color: #b8d99a; }
footer { display: flex; justify-content: space-between; align-items: center; margin-top: 8pt; font: 500 8pt Montserrat; color: #7a7a7a; }
footer .goal { font: 700 9.5pt Rubik; color: #3f6b22; }
footer .goal span { color: #619537; }
</style></head><body>
<header>
  <div>
    <div class="kicker">Understanding Dog Behavior · Chapter 3: The ABCs of Behavior</div>
    <h1>Your Dog's ABCs</h1>
    <p class="sub">Each time you see the behavior, fill in one row. Look at the whole picture: what happened before, what your dog did,
      and what happened after. Then ask: <b>WTF? What's the function?</b></p>
  </div>
  <img src="${img('logo.png')}" alt="Calling All Dogs">
</header>
<table>
  <colgroup><col style="width:11%"><col style="width:17%"><col style="width:19%"><col style="width:16%"><col style="width:19%"><col style="width:18%"></colgroup>
  <tr>${COLS.map(([l, c, t, p]) => `<th><div class="t">${tile(l, c)}${t}</div><div class="p">${p}</div></th>`).join('')}</tr>
  <tr class="ex">${EX.map((e) => `<td>${e}</td>`).join('')}</tr>
  ${Array.from({ length: rows }, (_, r) => `<tr class="blank">${COLS.map((_, k) => `<td data-f="r${r + 1}c${k + 1}">${k === 0 ? r + 1 : ''}</td>`).join('')}</tr>`).join('')}
</table>
<footer>
  <div class="goal">Find the thing. <span>Notice the context.</span> See the pattern.</div>
  <div>Tori Ganino, BS, CDBC, CPDT-KA · callingalldogsny.com</div>
</footer>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 970, height: 816 }  /* = the printable area, so screen layout matches print */ });
await page.emulateMedia({ media: 'print' });
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
// cell boxes for the form fields, in CSS px from the page's top left (the PDF adds the @page margins)
const cells = await page.evaluate(() => [...document.querySelectorAll('td[data-f]')].map((td) => {
  const r = td.getBoundingClientRect(); return { name: td.dataset.f, x: r.left, y: r.top, w: r.width, h: r.height };
}));
const pdfBytes = await page.pdf({ format: 'Letter', landscape: true, printBackground: true, preferCSSPageSize: true });
await browser.close();

const doc = await PDFDocument.load(pdfBytes);
if (doc.getPageCount() !== 1) throw new Error(`expected one page, got ${doc.getPageCount()}`);
const pg = doc.getPage(0);
const { height: PH } = pg.getSize();
const PT = 0.75, ML = 0.45 * 72, MT = 0.4 * 72; // px -> pt, @page margins
const form = doc.getForm();
for (const c of cells) {
  const f = form.createTextField(c.name);
  const dx = c.name.endsWith('c1') ? 12 : 0; // keep the row number visible
  f.addToPage(pg, { x: ML + c.x * PT + 2 + dx, y: PH - MT - (c.y + c.h) * PT + 2, width: c.w * PT - 4 - dx, height: c.h * PT - 4,
    borderWidth: process.env.HW_DEBUG ? 1 : 0, backgroundColor: undefined, borderColor: process.env.HW_DEBUG ? rgb(1, 0, 0) : undefined });
  if (!c.name.endsWith('c1')) f.enableMultiline();
  f.setFontSize(9);
}
doc.catalog.lookup(PDFName.of('AcroForm')).set(PDFName.of('NeedAppearances'), PDFBool.True);
doc.setTitle("Your Dog's ABCs");
doc.setAuthor('Tori Ganino, Calling All Dogs');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, await doc.save());
console.log('homework:', path.relative(ROOT, out), `(${rows} rows, ${cells.length} fields)`);
