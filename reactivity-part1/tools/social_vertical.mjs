// Vertical (1080x1920) social clip frame: renders bg.png (logo, 'From my course', course title, a 16:9 slot at y 620,
// callingalldogsny.com) and one transparent caption PNG per .srt cue (Montserrat 700, 52 px, placed at y 1290).
//   node tools/social_vertical.mjs <outdir> <clip.srt>   then overlay the clip (scale 1080:608 at 0:620) and each
//   caption PNG (overlay=0:1290 with enable=between(t,a,b) from <outdir>/caps.json) with ffmpeg. See CLAUDE.md.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire('/home/user/CAD-slides/reactivity-part1/package.json');
const { chromium } = require('playwright');
const ROOT = '/home/user/CAD-slides/reactivity-part1';
const OUT = process.argv[2];
const srt = fs.readFileSync(process.argv[3], 'utf8').trim().split(/\n\s*\n/).map((b) => {
  const l = b.split('\n'); const [a, z] = l[1].split(' --> ');
  const sec = (s) => { const [h, m, r] = s.split(':'); const [x, ms] = r.split(','); return +h * 3600 + +m * 60 + +x + +ms / 1000; };
  return { a: sec(a), z: sec(z), text: l.slice(2).join(' ') };
});
const font = (fam, w, f) => `@font-face{font-family:'${fam}';font-weight:${w};src:url(file://${ROOT}/assets/fonts/${f}) format('woff2');}`;
const css = font('Montserrat', 600, 'Montserrat-600.woff2') + font('Montserrat', 700, 'Montserrat-700.woff2') + font('Rubik', 800, 'Rubik-800.woff2');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
const bgHtml = path.join(OUT, 'bg.html');
fs.writeFileSync(bgHtml, `<html><head><style>${css}
  *{margin:0;box-sizing:border-box} body{width:1080px;height:1920px;position:relative;background:#fff url(file://${ROOT}/assets/img/bg_swirl.jpg) center/cover;font-family:Montserrat}
  .top{position:absolute;top:150px;left:0;right:0;text-align:center}
  .top img{width:340px}
  .k{margin-top:46px;font:700 26px Montserrat;letter-spacing:7px;color:#619537;text-transform:uppercase}
  h1{margin-top:14px;font:800 66px/1.05 Rubik;color:#212121}
  .slot{position:absolute;top:620px;left:0;width:1080px;height:608px;box-shadow:0 24px 60px rgba(40,60,20,.25)}
  .foot{position:absolute;bottom:120px;left:0;right:0;text-align:center;font:600 28px Montserrat;color:#3f6b22;letter-spacing:1px}
</style></head><body>
  <div class="top"><img src="file://${ROOT}/assets/img/logo.png"><div class="k">From my course</div><h1>Understanding<br>Dog Behavior</h1></div>
  <div class="slot"></div><div class="foot">callingalldogsny.com</div></body></html>`);
await page.goto('file://' + bgHtml);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
await page.screenshot({ path: path.join(OUT, 'bg.png') });
const cap = await browser.newPage({ viewport: { width: 1080, height: 300 } });
const list = [];
for (const [i, c] of srt.entries()) {
  const capHtml = path.join(OUT, 'cap.html');
  fs.writeFileSync(capHtml, `<html><head><style>${css} *{margin:0} html,body{background:transparent;width:1080px;height:300px}
    body{display:flex;align-items:flex-start;justify-content:center;padding-top:10px}
    p{max-width:940px;text-align:center;font:700 52px/1.25 Montserrat;color:#212121}</style></head><body><p>${c.text.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</p></body></html>`);
  await cap.goto('file://' + capHtml);
  await cap.evaluate(() => document.fonts.ready);
  const f = path.join(OUT, `cap_${String(i).padStart(2, '0')}.png`);
  await cap.screenshot({ path: f, omitBackground: true });
  list.push({ f, a: c.a, z: c.z });
}
fs.writeFileSync(path.join(OUT, 'caps.json'), JSON.stringify(list));
await browser.close();
console.log('frame + captions:', list.length);
