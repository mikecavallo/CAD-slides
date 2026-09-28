"""Render script/lesson.json as the HTML sent to Google Docs for the trainer to edit.

    python3 tools/doc_html.py build/script_v3.html [--note "New in this version: ..."]

Keep the output as the baseline (script/.doc-baseline-vN.html) so the trainer's edits can be diffed later.
"""
import argparse
import html
import json
import re

from common import ROOT

NAMES = [('photo_aggression.jpg', 'the snarling dog photo'), ('photo_reactivity.jpg', 'the barking white dog photo'),
         ('photo_why.jpg', 'the Lab and Pyrenees photo'), ('photo_reactive_to_aggressive.jpg', 'the dog-behind-the-fence photo'),
         ('trigger_wordcloud.jpg', 'the trigger word cloud')]
INTRO = ("Edit the narration however you like: reword, add or cut lines. Each paragraph is one on-screen moment. "
         "The grey line under it is what the viewer sees; change that too if you want different visuals. "
         "Keep the scene labels (like ch02s03) so each change lands in the right place.")


def fix(t):
    for a, b in NAMES:
        t = t.replace(a, b)
    t = re.sub(r'abc_(greet|approach|guard|before|during|after)_([abc])\.jpg', lambda m: f"the {m.group(1)} {m.group(2).upper()} illustration", t)
    return html.escape(t, quote=False)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('out')
    ap.add_argument('--note')
    args = ap.parse_args()
    s = json.loads((ROOT / 'script/lesson.json').read_text())
    out = [f'<p style="color:#666666">{INTRO}</p>']
    if args.note:
        out.append(f'<p style="color:#666666">{html.escape(args.note, quote=False)}</p>')
    for c in s['chapters']:
        out.append(f'<h1>Chapter {int(c["id"][2:])}: {fix(c["title"])}</h1>')
        for sc in c['scenes']:
            head = sc.get('heading') or ''
            out.append(f'<h2>{sc["id"]}{": " + fix(head) if head else ""}</h2>')
            for b in sc['beats']:
                out.append(f'<p>{fix(b["say"])}</p>')
                txt = f'Text: “{fix(b["onscreen"])}” · ' if b.get('onscreen') else ''
                out.append(f'<p style="color:#8a8a8a;font-size:9pt"><i>On screen: {txt}{fix(b["show"].strip())}</i></p>')
    doc = '<html><body>' + ''.join(out) + '</body></html>'
    (ROOT / args.out).write_text(doc)
    print(args.out, len(doc), 'chars')


if __name__ == '__main__':
    main()
