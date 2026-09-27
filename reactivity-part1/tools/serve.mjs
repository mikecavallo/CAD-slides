// Tiny static file server for the player (fonts need http://, not file://).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TYPES = {
  '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.wav': 'audio/wav', '.mp3': 'audio/mpeg',
};

export function serve() {
  return new Promise(resolve => {
    const srv = http.createServer((req, res) => {
      const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      const f = path.join(ROOT, path.normalize(p));
      if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      fs.createReadStream(f).pipe(res);
    });
    srv.listen(0, '127.0.0.1', () => resolve({ srv, base: `http://127.0.0.1:${srv.address().port}` }));
  });
}

export async function openScene(page, base, id, extra = '') {
  const errors = [];
  page.removeAllListeners('pageerror');
  page.removeAllListeners('console');
  page.removeAllListeners('response');
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if ((m.type() === 'error' || m.type() === 'warning') && !m.text().startsWith('Failed to load resource')) errors.push(`${m.type()}: ${m.text()}`); });
  page.on('response', r => { if (r.status() >= 400 && !/\/scenes\/ch\d+\.js$/.test(r.url())) errors.push(`HTTP ${r.status()} ${r.url()}`); });
  await page.goto(`${base}/video/index.html?scene=${encodeURIComponent(id)}${extra}`);
  await page.waitForFunction(() => window.__READY || window.__ERROR, null, { timeout: 60000 });
  const err = await page.evaluate(() => window.__ERROR);
  if (err) throw new Error(`${id}: ${err}`);
  return errors;
}

// Prefer Playwright's own browser; fall back to a preinstalled Chromium (cloud sandbox).
export async function launchBrowser() {
  const args = ['--disable-gpu', '--font-render-hinting=none', '--disable-lcd-text', '--force-color-profile=srgb'];
  try { return await chromium.launch({ args }); } catch (e) {
    for (const p of [process.env.CHROMIUM_PATH, '/opt/pw-browsers/chromium'].filter(Boolean)) {
      if (fs.existsSync(p)) return chromium.launch({ args, executablePath: p });
    }
    throw e;
  }
}
