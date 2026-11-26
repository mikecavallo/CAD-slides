// The narration as a branded, learner-facing script PDF (a download for the course platform), one heading per lesson.
//
//   node tools/script_pdf.mjs [--lesson lesson.json] [--out out/full/Understanding-Dog-Behavior-Ch1-Script.pdf]
//        [--learn "What you'll learn sentence(s)"]
//
// Lessons follow the lesson file's "sections" list ([first scene id, title, description]); the text is each beat's
// "say" with [pause] markers removed. Not the recording script: no scene ids, notes or on-screen directions.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const opt = (k, d) => { const i = argv.indexOf('--' + k); return i >= 0 ? argv[i + 1] : d; };
const lessonFile = opt('lesson', process.env.LESSON || 'lesson.json');
const L = JSON.parse(fs.readFileSync(path.join(ROOT, 'script', lessonFile), 'utf8'));
const out = path.resolve(opt('out', 'out/full/Understanding-Dog-Behavior-Ch1-Script.pdf'));
const learn = opt('learn', '');

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const spoken = (s) => s.replace(/\s*\[pause\]\s*/gi, ' ').replace(/\s+/g, ' ').trim();
const font = (family, weight, file) => `@font-face{font-family:'${family}';font-weight:${weight};src:url(data:font/woff2;base64,${
  fs.readFileSync(path.join(ROOT, 'assets/fonts', file)).toString('base64')}) format('woff2');}`;
const img = (f) => `data:image/${f.endsWith('.png') ? 'png' : 'jpeg'};base64,${fs.readFileSync(path.join(ROOT, 'assets/img', f)).toString('base64')}`;

// scenes in play order, split into lessons at each section's first scene
const scenes = L.chapters.flatMap((c) => c.scenes.map((s) => ({ ...s, chapter: c })));
const starts = (L.sections || []).map((r) => r[0]);
const lessons = [];
for (const s of scenes) {
  const k = starts.indexOf(s.id);
  if (k >= 0 || !lessons.length) lessons.push({ title: k >= 0 ? L.sections[k][1] : s.chapter.title, scenes: [] });
  lessons.at(-1).scenes.push(s);
}
const chapter = L.chapters.find((c) => /\d/.test(c.id) && Number(c.id.replace(/\D/g, '')) > 0) || L.chapters[0];
const chNum = Number(chapter.id.replace(/\D/g, ''));

const body = lessons.map((l, i) => `
  <section>
    <div class="num">Lesson ${i + 1}</div>
    <h2>${esc(l.title)}</h2>
    ${l.scenes.flatMap((s) => s.beats.map((b) => `<p>${esc(spoken(b.say))}</p>`)).join('\n    ')}
  </section>`).join('\n');

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
${font('Montserrat', 400, 'Montserrat-400.woff2')}${font('Montserrat', 500, 'Montserrat-500.woff2')}${font('Montserrat', 600, 'Montserrat-600.woff2')}
${font('Montserrat', 700, 'Montserrat-700.woff2')}${font('Rubik', 700, 'Rubik-700.woff2')}${font('Rubik', 800, 'Rubik-800.woff2')}
  @page { size: Letter; margin: 0.8in 0.85in 0.85in; }
  * { box-sizing: border-box; }
  body { margin: 0; font: 400 11pt/1.55 Montserrat, sans-serif; color: #212121; }
  header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 18pt; border-bottom: 2pt solid #619537; margin-bottom: 20pt; }
  .kicker { font: 700 8.5pt Montserrat; letter-spacing: 2.2pt; color: #619537; text-transform: uppercase; }
  h1 { font: 800 27pt/1.1 Rubik; color: #212121; margin: 6pt 0 4pt; }
  .chapter { font: 700 14pt Rubik; color: #3f6b22; }
  .by { margin-top: 10pt; font: 600 10pt Montserrat; color: #212121; }
  .by span { display: block; font: 600 8.5pt Montserrat; color: #619537; letter-spacing: .6pt; }
  header img { width: 1.75in; margin-top: 2pt; }
  .learn { background: #f3f8ec; border-left: 4pt solid #619537; border-radius: 0 10pt 10pt 0; padding: 12pt 16pt; margin: 0 0 22pt; }
  .learn b { display: block; font: 700 8.5pt Montserrat; letter-spacing: 1.6pt; color: #3f6b22; text-transform: uppercase; margin-bottom: 4pt; }
  .learn p { margin: 0; }
  section { margin: 0 0 16pt; }
  .num { font: 700 8pt Montserrat; letter-spacing: 1.8pt; color: #619537; text-transform: uppercase; break-after: avoid; }
  h2 { font: 700 16pt/1.2 Rubik; color: #2c4a17; margin: 2pt 0 8pt; break-after: avoid; }
  p { margin: 0 0 8pt; orphans: 3; widows: 3; }
</style></head><body>
  <header>
    <div>
      <div class="kicker">Calling All Dogs</div>
      <h1>${(L.series?.titleLines || [L.series?.title || L.title]).map(esc).join('<br>')}</h1>
      <div class="chapter">Chapter ${chNum}: ${esc(chapter.title)}</div>
      <div class="by">Tori Ganino<span>BS, CDBC, CPDT-KA</span></div>
    </div>
    <img src="${img('logo.png')}" alt="Calling All Dogs">
  </header>
  ${learn ? `<div class="learn"><b>What you'll learn</b><p>${esc(learn)}</p></div>` : ''}
  ${body}
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
fs.mkdirSync(path.dirname(out), { recursive: true });
await page.pdf({
  path: out, format: 'Letter', printBackground: true, preferCSSPageSize: true, displayHeaderFooter: true,
  headerTemplate: '<span></span>',
  footerTemplate: `<div style="width:100%;font:500 7.5pt Montserrat,sans-serif;color:#7a7a7a;padding:0 0.85in;display:flex;justify-content:space-between">
    <span>callingalldogsny.com</span><span>${esc(L.series?.title || L.title)} · Chapter ${chNum}</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`,
});
await browser.close();
console.log('script:', path.relative(ROOT, out), `(${lessons.length} lessons)`);
