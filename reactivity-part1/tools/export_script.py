"""Export the narration script for recording.

    python3 tools/export_script.py

Writes
  script/Narration-Script.md    plain text you can paste anywhere (Google Docs, a teleprompter app)
  out/Narration-Script.pdf      large-print script with chapter/scene breaks and on-screen notes
"""
import base64
import html
import re
import shutil
import subprocess
from pathlib import Path

from common import ROOT, load_script, words

OUT = ROOT / "out"
FONTS = ROOT / "assets" / "fonts"


def font_face(family, weight, file):
    data = base64.b64encode((FONTS / file).read_bytes()).decode()
    return f"@font-face{{font-family:'{family}';font-weight:{weight};src:url(data:font/woff2;base64,{data}) format('woff2');}}"


def main():
    s = load_script()
    total = sum(len(words(b["say"])) for c in s["chapters"] for sc in c["scenes"] for b in sc["beats"])
    minutes = total / 150

    # ---------- markdown
    md = [f"# {s['title']}", "", f"Narration script. About {total:,} words, roughly {minutes:.0f} minutes at a relaxed pace.", ""]
    for c in s["chapters"]:
        md += [f"## {c['title']}", ""]
        for sc in c["scenes"]:
            md += [" ".join(b["say"] for b in sc["beats"]), ""]
    (ROOT / "script" / "Narration-Script.md").write_text("\n".join(md))

    # ---------- print HTML -> PDF
    css = "".join([font_face("Rubik", 700, "Rubik-700.woff2"), font_face("Montserrat", 400, "Montserrat-400.woff2"),
                   font_face("Montserrat", 600, "Montserrat-600.woff2"), font_face("Montserrat", 700, "Montserrat-700.woff2")])
    css += """
    @page { size: Letter; margin: 0.8in 0.85in 0.8in 0.85in; }
    body { font-family: Montserrat, sans-serif; color: #212121; }
    h1 { font: 700 34pt/1.1 Rubik, sans-serif; color: #619537; margin: 0 0 10pt; }
    .sub { font-size: 11pt; color: #555; margin-bottom: 18pt; line-height: 1.5; }
    .how { border: 1.5pt solid #b8d99a; background: #f3f8ec; border-radius: 10pt; padding: 12pt 16pt; font-size: 11pt; line-height: 1.55; margin-bottom: 10pt; }
    .how b { color: #3f6b22; }
    .how ol { margin: 6pt 0 0 16pt; padding: 0; }
    h2 { font: 700 24pt/1.15 Rubik, sans-serif; color: #619537; margin: 0 0 4pt; page-break-before: always; }
    .file { font-size: 10pt; color: #777; margin-bottom: 16pt; letter-spacing: .5pt; }
    .scene { margin: 0 0 16pt; padding-top: 10pt; border-top: 1pt solid #dfe5d6; }
    .scene:first-of-type { border-top: 0; padding-top: 0; }
    .onscreen { font-size: 9.5pt; color: #8a8a8a; font-style: italic; margin-bottom: 7pt; }
    p { font-size: 17pt; line-height: 1.6; margin: 0 0 11pt; }
    """
    body = [f"<h1>{html.escape(s['title'])}</h1>",
            f"<div class='sub'>Narration script &middot; about {total:,} words &middot; roughly {minutes:.0f} minutes at a relaxed pace. "
            "Each paragraph is one on-screen moment. The grey notes tell you what the viewer sees; you don't read those.</div>",
            "<div class='how'><b>Recording tips</b><ol>"
            "<li>Record one file per chapter and name it after the chapter code on that page (ch01, ch02 ...). One long take for everything also works; name it <b>full</b>.</li>"
            "<li>Quiet room, phone or mic about a hand's width from your mouth, a little off to the side.</li>"
            "<li>Leave a natural breath between paragraphs. No need to rush; the video stretches to fit your pace.</li>"
            "<li>Flubbed a line? Pause, then say the whole sentence again. Tell me and I'll cut the flub.</li>"
            "<li>Small ad-libs are fine. The software matches your words to the script and times the visuals to your voice.</li>"
            "</ol></div>"]
    for c in s["chapters"]:
        body.append(f"<h2>{html.escape(c['title'])}</h2><div class='file'>RECORD AS: {c['id']}</div>")
        for sc in c["scenes"]:
            body.append("<div class='scene'>")
            vis = sc.get("heading") or ""
            concept = re.sub(r"\s+", " ", sc.get("visual_concept", ""))[:220]
            note = html.escape(vis + (" · " if vis else "") + concept)
            body.append(f"<div class='onscreen'>On screen: {note}</div>")
            for b in sc["beats"]:
                body.append(f"<p>{html.escape(b['say'])}</p>")
            body.append("</div>")
    doc = f"<!doctype html><html><head><meta charset='utf-8'><style>{css}</style></head><body>{''.join(body)}</body></html>"
    OUT.mkdir(exist_ok=True)
    tmp = ROOT / "build" / "script_print.html"
    tmp.parent.mkdir(exist_ok=True)
    tmp.write_text(doc)
    chrome = shutil.which("chromium") or "/opt/pw-browsers/chromium"
    subprocess.run([chrome, "--headless", "--disable-gpu", "--no-sandbox", "--no-pdf-header-footer", f"--print-to-pdf={OUT / 'Narration-Script.pdf'}", tmp.as_uri()],
                   check=True, capture_output=True)
    print(f"script: {total} words (~{minutes:.1f} min). wrote script/Narration-Script.md and out/Narration-Script.pdf")


if __name__ == "__main__":
    main()
