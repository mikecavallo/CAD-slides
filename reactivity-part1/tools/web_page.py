"""Write the player page for a packaged video (see tools/web_parts.py).

    python3 tools/web_page.py --dir out/web/chapter1 --title "Reactivity Chapter 1 Preview" \
        --heading "..." --sub "..." --label "Current version"
"""
import argparse
import html
import json
import subprocess
from pathlib import Path

PAGE = r"""<title>__TITLE__</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&family=Rubik:wght@600;700&display=swap">
<style>
:root {
  --bg: #f4f6ef; --surface: #ffffff; --ink: #1d2219; --muted: #5a6352; --line: #dce3d2;
  --accent: #4e7d2a; --brand: #619537; --accent-soft: #e5eed9; --screen: #0e120c; --focus: #619537;
  --shadow: 0 1px 2px rgba(29,34,25,.06), 0 8px 28px rgba(29,34,25,.07);
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    color-scheme: dark;
    --bg: #10140e; --surface: #181e15; --ink: #e6ecdf; --muted: #9aa590; --line: #2a3324;
    --accent: #93c56a; --brand: #7fb04f; --accent-soft: #22301a; --screen: #050704; --focus: #93c56a;
    --shadow: 0 1px 2px rgba(0,0,0,.4), 0 8px 28px rgba(0,0,0,.35);
  }
}
:root[data-theme="dark"] {
  color-scheme: dark;
  --bg: #10140e; --surface: #181e15; --ink: #e6ecdf; --muted: #9aa590; --line: #2a3324;
  --accent: #93c56a; --brand: #7fb04f; --accent-soft: #22301a; --screen: #050704; --focus: #93c56a;
  --shadow: 0 1px 2px rgba(0,0,0,.4), 0 8px 28px rgba(0,0,0,.35);
}
* { box-sizing: border-box; }
body { background: var(--bg); color: var(--ink); font: 400 15px/1.55 Montserrat, "Segoe UI", system-ui, sans-serif; }
.wrap { max-width: 1240px; margin: 0 auto; padding-inline: clamp(16px, 4vw, 40px); padding-block: 28px 48px; display: grid; gap: 22px; }
header { display: grid; gap: 8px; }
.kicker { font: 600 12px/1 Montserrat, system-ui, sans-serif; letter-spacing: .14em; text-transform: uppercase; color: var(--accent); }
h1 { margin: 0; font: 700 clamp(26px, 3.4vw, 40px)/1.12 Rubik, "Trebuchet MS", system-ui, sans-serif; letter-spacing: -.01em; text-wrap: balance; }
.sub { margin: 0; max-width: 68ch; color: var(--muted); }
.meta { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 4px; }
.chip { display: inline-flex; align-items: center; gap: 6px; padding: 5px 11px; border-radius: 999px; background: var(--accent-soft); color: var(--ink); font-size: 13px; font-weight: 500; font-variant-numeric: tabular-nums; }
.chip.flag { background: transparent; border: 1px solid var(--line); color: var(--muted); }
.layout { display: grid; grid-template-columns: minmax(0, 1fr) 340px; gap: 22px; align-items: start; }
.stage { display: grid; gap: 10px; }
.screen { background: var(--screen); border-radius: 14px; overflow: hidden; box-shadow: var(--shadow); aspect-ratio: 16 / 9; max-width: 100%; }
video { display: block; width: 100%; height: 100%; background: var(--screen); }
.now { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 6px 16px; font-size: 14px; color: var(--muted); }
.now b { color: var(--ink); font-weight: 600; }
.clock { font-variant-numeric: tabular-nums; }
aside { background: var(--surface); border: 1px solid var(--line); border-radius: 14px; box-shadow: var(--shadow); display: grid; grid-template-rows: auto minmax(0, 1fr); max-height: min(78vh, 720px); }
aside h2 { margin: 0; padding: 14px 16px 10px; font: 600 15px/1.2 Rubik, system-ui, sans-serif; border-bottom: 1px solid var(--line); }
.toc { overflow-y: auto; padding: 6px 0 10px; }
.ch { padding: 12px 16px 4px; font: 600 12px/1.3 Montserrat, system-ui, sans-serif; letter-spacing: .08em; text-transform: uppercase; color: var(--accent); }
.scene { display: grid; grid-template-columns: 48px 1fr; gap: 8px; width: 100%; padding: 7px 16px; border: 0; background: transparent; color: var(--ink); text-align: left; font: 500 14px/1.35 Montserrat, system-ui, sans-serif; cursor: pointer; }
.scene .t { color: var(--muted); font-variant-numeric: tabular-nums; font-size: 13px; padding-top: 1px; }
.scene:hover { background: var(--accent-soft); }
.scene[aria-current="true"] { background: var(--accent-soft); font-weight: 600; }
.scene[aria-current="true"] .t { color: var(--accent); font-weight: 600; }
.scene:focus-visible, video:focus-visible { outline: 3px solid var(--focus); outline-offset: -3px; }
.note { margin: 0; max-width: 72ch; font-size: 13px; color: var(--muted); }
@media (max-width: 900px) {
  .layout { grid-template-columns: 1fr; }
  aside { max-height: none; }
  .toc { overflow: visible; }
}
@media (prefers-reduced-motion: reduce) { * { scroll-behavior: auto !important; } }
</style>

<div class="wrap">
  <header>
    <div class="kicker">Calling All Dogs &middot; Reactivity course</div>
    <h1>__HEADING__</h1>
    <p class="sub">__SUB__</p>
    <div class="meta">__CHIPS__</div>
  </header>
  <div class="layout">
    <div class="stage">
      <div class="screen"><video id="player" controls playsinline preload="metadata" poster="poster.jpg"></video></div>
      <div class="now"><span>Now playing: <b id="nowTitle">__FIRST__</b></span><span class="clock" id="clock">0:00 / __TOTAL__</span></div>
    </div>
    <aside aria-label="Scenes">
      <h2>Scenes</h2>
      <nav class="toc" id="toc">__TOC__</nav>
    </aside>
  </div>
  <p class="note">__NOTE__</p>
</div>

<script type="application/json" id="manifest">__MANIFEST__</script>
<script>
(function () {
  var M = JSON.parse(document.getElementById('manifest').textContent);
  var video = document.getElementById('player');
  var clock = document.getElementById('clock');
  var nowTitle = document.getElementById('nowTitle');
  var rows = Array.prototype.slice.call(document.querySelectorAll('.scene'));
  var cur = -1;
  function fmt(s) { s = Math.max(0, Math.floor(s)); var m = Math.floor(s / 60); var r = s % 60; return m + ':' + (r < 10 ? '0' : '') + r; }
  // captions live in the page (artifacts don't serve .vtt), fed into one text track per part
  var track = video.addTextTrack ? video.addTextTrack('captions', 'English', 'en') : null;
  function setTrack(i) {
    if (!track || !window.VTTCue) return;
    while (track.cues && track.cues.length) track.removeCue(track.cues[0]);
    (M.parts[i].cues || []).forEach(function (c) { track.addCue(new VTTCue(c[0], c[1], c[2])); });
  }
  function load(i, t, play) {
    var go = function () { try { video.currentTime = t; } catch (e) {} if (play) { var p = video.play(); if (p && p.catch) p.catch(function () {}); } };
    if (i !== cur) {
      cur = i;
      video.src = M.parts[i].src;
      setTrack(i);
      video.addEventListener('loadedmetadata', go, { once: true });
      video.load();
    } else { go(); }
  }
  function seekGlobal(T, play) {
    for (var i = M.parts.length - 1; i >= 0; i--) {
      if (T >= M.parts[i].start - 0.01) { load(i, Math.max(0, T - M.parts[i].start), play); return; }
    }
  }
  function update() {
    if (cur < 0) return;
    var T = M.parts[cur].start + (video.currentTime || 0);
    clock.textContent = fmt(T) + ' / ' + fmt(M.total);
    var k = -1;
    rows.forEach(function (r, j) { if (parseFloat(r.dataset.t) <= T + 0.05) k = j; });
    rows.forEach(function (r, j) { r.setAttribute('aria-current', j === k ? 'true' : 'false'); });
    if (k >= 0) nowTitle.textContent = rows[k].dataset.title;
  }
  video.addEventListener('timeupdate', update);
  video.addEventListener('ended', function () { if (cur < M.parts.length - 1) load(cur + 1, 0, true); });
  rows.forEach(function (r) { r.addEventListener('click', function () { seekGlobal(parseFloat(r.dataset.t) + 0.05, true); }); });
  load(0, 0, false);
  update();
})();
</script>
"""


def read_vtt(path):
    """[[start, end, text], ...] from a WebVTT file."""
    import re
    def sec(x):
        h, m, s = x.split(":")
        return round(int(h) * 3600 + int(m) * 60 + float(s), 3)
    cues = []
    for block in re.split(r"\n\s*\n", path.read_text()):
        lines = block.strip().splitlines()
        if lines and "-->" in lines[0]:
            a, b = [x.strip() for x in lines[0].split("-->")]
            cues.append([sec(a), sec(b), "\n".join(lines[1:])])
    return cues


def fmt(s):
    s = int(s)
    return f"{s // 60}:{s % 60:02d}"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dir", required=True)
    ap.add_argument("--title", required=True)
    ap.add_argument("--heading", required=True)
    ap.add_argument("--sub", required=True)
    ap.add_argument("--chips", default="")
    ap.add_argument("--note", required=True)
    ap.add_argument("--poster-video")
    ap.add_argument("--poster-at", type=float, default=8.0)
    args = ap.parse_args()
    d = Path(args.dir)
    m = json.loads((d / "manifest.json").read_text())
    esc = lambda s: html.escape(s, quote=True)

    toc, last_ch, first = [], None, None
    scenes = [s for s in m["scenes"] if s["kind"] == "scene"]
    multi = len({s["chapter"] for s in scenes}) > 1
    for n, s in enumerate(scenes):
        if multi and s["chapter"] != last_ch:
            last_ch = s["chapter"]
            toc.append(f'<div class="ch">{s["chapter"]} &middot; {esc(s["chapterTitle"])}</div>')
        title = s["heading"] or s["chapterTitle"] or f"Scene {n + 1}"
        first = first or title
        toc.append(f'<button type="button" class="scene" data-t="{s["t"]}" data-title="{esc(title)}" aria-current="false">'
                   f'<span class="t">{fmt(s["t"])}</span><span>{esc(title)}</span></button>')
    chips = [f"{fmt(m['total'])} min", f"{len(scenes)} scenes"]
    if multi:
        chips.insert(1, f"{len({s['chapter'] for s in scenes})} chapters")
    chip_html = "".join(f'<span class="chip">{esc(c)}</span>' for c in chips)
    chip_html += "".join(f'<span class="chip flag">{esc(c)}</span>' for c in filter(None, args.chips.split("|")))
    page = (PAGE.replace("__TITLE__", esc(args.title)).replace("__HEADING__", esc(args.heading)).replace("__SUB__", esc(args.sub))
            .replace("__CHIPS__", chip_html).replace("__FIRST__", esc(first)).replace("__TOTAL__", fmt(m["total"]))
            .replace("__TOC__", "".join(toc)).replace("__NOTE__", esc(args.note))
            .replace("__MANIFEST__", json.dumps({"total": m["total"], "parts": [dict({k: p[k] for k in ("src", "start", "dur")}, cues=read_vtt(d / p["vtt"])) for p in m["parts"]]}).replace("</", "<\\/")))
    (d / "index.html").write_text(page)
    if args.poster_video:
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(args.poster_at), "-i", args.poster_video, "-frames:v", "1",
                        "-vf", "scale=1280:-2", "-q:v", "4", str(d / "poster.jpg")], check=True)
    print("wrote", d / "index.html")


if __name__ == "__main__":
    main()
