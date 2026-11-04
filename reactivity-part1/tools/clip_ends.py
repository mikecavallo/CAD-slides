"""The last frame of each in-frame clip, composed exactly as assemble.py shows it (blurred fill + whole picture), so the
slide can sit under the clip showing the same picture: when the clip fades out, nothing else flashes through.

    python3 tools/clip_ends.py      (after timing.py, before render.mjs)

Writes assets/img/clipend_<scene id>.jpg at the frame's box size.
"""
import json
import subprocess

from common import BUILD, ROOT


def main():
    timing = json.loads((BUILD / "timing.json").read_text())
    for s in timing["segments"]:
        c = s.get("clip") or {}
        if not c.get("file") or c.get("full"):
            continue
        x, y, w, h = c["box"]
        w, h = w - w % 2, h - h % 2
        t = c["from"] + max(0.0, c["len"] - 0.08)
        crop = f"crop={c['crop'][2]}:{c['crop'][3]}:{c['crop'][0]}:{c['crop'][1]}," if c.get("crop") else ""
        out = ROOT / "assets" / "img" / f"clipend_{s['id']}.jpg"
        subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-ss", f"{t:.3f}", "-i", str(ROOT / c["file"]), "-frames:v", "1",
                        "-filter_complex",
                        f"[0:v]{crop}split=2[a][b];[a]scale={w}:{h}:force_original_aspect_ratio=increase,crop={w}:{h},boxblur=24:2,"
                        f"eq=brightness=-0.10:saturation=0.75[bg];[b]scale={w}:{h}:force_original_aspect_ratio=decrease,setsar=1[fg];"
                        f"[bg][fg]overlay=(W-w)/2:(H-h)/2", "-q:v", "2", str(out)], check=True)
        print("  ", out.name)


if __name__ == "__main__":
    main()
