#!/usr/bin/env python3
"""
Confession Booth — 1080×1080 poster generator.

Takes a high-res puppeteer screenshot of the live booth screen, centers it
on a 1080×1080 dark walnut canvas, then decorates the sides with:
  - a stained-glass color stripe (amber/rose/cobalt/leaf vertical bands)
  - "ALTERU CONFESSIONAL" carved-serif side type
  - candle dot accents

Run:
  node /tmp/gen_cb_poster.cjs    # produces /tmp/cb_poster_raw.png (540×1170)
  ~/miniconda3/bin/python3 gen_poster.py
"""
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W = 1080
HERE = os.path.dirname(os.path.abspath(__file__))
OUTPUT = '/Users/yin/code/games/games/posters/confession-booth.png'
RAW = '/tmp/cb_poster_raw.png'

WOOD       = (10, 7, 5)
WOOD_MID   = (29, 19, 10)
WOOD_LIGHT = (61, 40, 24)
CANDLE     = (243, 228, 194)
BRASS      = (216, 168, 73)
AMBER      = (232, 162, 58)
ROSE       = (198, 72, 115)
COBALT     = (29, 51, 196)
LEAF       = (43, 110, 63)
RUBY       = (138, 26, 26)


def make_wood_bg(w, h):
    img = Image.new('RGB', (w, h), WOOD)
    d = ImageDraw.Draw(img)
    # Vertical gradient: deeper top + bottom, mid lighter
    for y in range(h):
        # ease toward WOOD_MID at mid
        t = abs(y - h / 2) / (h / 2)  # 0 mid, 1 edges
        r = int(WOOD_MID[0] * (1 - t) + WOOD[0] * t)
        g = int(WOOD_MID[1] * (1 - t) + WOOD[1] * t)
        b = int(WOOD_MID[2] * (1 - t) + WOOD[2] * t)
        d.line([(0, y), (w, y)], fill=(r, g, b))
    # Vertical grain streaks
    import random
    random.seed(7)
    for _ in range(120):
        x = random.randint(0, w - 1)
        op = random.randint(8, 32)
        col = tuple(min(255, c + 16) for c in (29, 19, 10))
        for y in range(0, h, 2):
            existing = img.getpixel((x, y))
            r = min(255, existing[0] + (op if random.random() > 0.3 else op // 2))
            g = min(255, existing[1] + op // 2)
            b = min(255, existing[2] + op // 3)
            img.putpixel((x, y), (r, g, b))
    # warm shaft from top center
    overlay = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    for r in range(0, 480, 8):
        a = max(0, 90 - int(r / 6))
        od.ellipse((w / 2 - r, -r, w / 2 + r, r), fill=(243, 228, 194, a))
    overlay = overlay.filter(ImageFilter.GaussianBlur(12))
    img = Image.alpha_composite(img.convert('RGBA'), overlay).convert('RGB')
    return img


def stained_strip(h, w=60):
    """Vertical strip with stained-glass color bands separated by lead lines."""
    s = Image.new('RGB', (w, h), (10, 7, 5))
    d = ImageDraw.Draw(s)
    colors = [AMBER, ROSE, COBALT, LEAF, RUBY, AMBER]
    bands = len(colors)
    band_h = h // bands
    for i, c in enumerate(colors):
        d.rectangle([(0, i * band_h), (w, (i + 1) * band_h - 2)], fill=c)
    # leading lines between
    for i in range(bands + 1):
        y = i * band_h - 1
        d.line([(0, y), (w, y)], fill=(8, 5, 3), width=3)
    # vertical lead trim
    d.line([(0, 0), (0, h)], fill=(8, 5, 3), width=2)
    d.line([(w - 1, 0), (w - 1, h)], fill=(8, 5, 3), width=2)
    return s


def main():
    if not os.path.exists(RAW):
        raise SystemExit(f"missing {RAW} — run /tmp/gen_cb_poster.cjs first")

    canvas = make_wood_bg(W, W)

    raw = Image.open(RAW).convert('RGBA')
    rw, rh = raw.size
    # Scale to 980 height (leaves 50px margin top/bottom)
    target_h = 980
    scale = target_h / rh
    new_w = int(rw * scale)
    raw_scaled = raw.resize((new_w, target_h), Image.LANCZOS)

    # Center horizontally
    x = (W - new_w) // 2
    y = (W - target_h) // 2

    # Outer brass frame (4px gold) around the embedded screenshot
    frame = ImageDraw.Draw(canvas)
    frame.rectangle([(x - 6, y - 6), (x + new_w + 5, y + target_h + 5)], outline=BRASS, width=3)

    canvas_rgba = canvas.convert('RGBA')
    canvas_rgba.paste(raw_scaled, (x, y), raw_scaled)
    canvas = canvas_rgba.convert('RGB')

    # Side stained-glass strips
    strip_w = 36
    left_strip = stained_strip(target_h, strip_w)
    right_strip = stained_strip(target_h, strip_w)
    canvas.paste(left_strip, (x - 6 - strip_w - 14, y))
    canvas.paste(right_strip, (x + new_w + 6 + 14, y))

    # ALTERU CONFESSIONAL side title — drawn rotated 90° on left/right of frame
    d = ImageDraw.Draw(canvas)
    try:
        # Try a serif font; fall back if not found
        title_font = ImageFont.truetype('/System/Library/Fonts/Supplemental/Times New Roman.ttf', 24)
        meta_font = ImageFont.truetype('/System/Library/Fonts/Courier New.ttf', 16)
    except Exception:
        title_font = ImageFont.load_default()
        meta_font = ImageFont.load_default()

    # Left rotated text
    txt = Image.new('RGBA', (target_h, 40), (0, 0, 0, 0))
    td = ImageDraw.Draw(txt)
    td.text((20, 8), 'ALTERU · CONFESSIONAL · 1-800-CONFESS', fill=BRASS, font=title_font)
    txt_rot = txt.rotate(90, expand=True)
    canvas.paste(txt_rot, (8, y), txt_rot)

    # Right rotated text
    txt2 = Image.new('RGBA', (target_h, 40), (0, 0, 0, 0))
    td2 = ImageDraw.Draw(txt2)
    td2.text((20, 8), 'CALLS RECORDED FOR ABSOLUTION TRAINING', fill=BRASS, font=meta_font)
    txt2_rot = txt2.rotate(-90, expand=True)
    canvas.paste(txt2_rot, (W - 40, y), txt2_rot)

    # Top + bottom candle-dot decorations
    for cx in [W * 0.18, W * 0.5, W * 0.82]:
        d.ellipse([(cx - 7, 28), (cx + 7, 42)], fill=AMBER, outline=BRASS)
        d.ellipse([(cx - 7, W - 42), (cx + 7, W - 28)], fill=AMBER, outline=BRASS)

    canvas.save(OUTPUT, optimize=True)
    print(f"wrote {OUTPUT}")


if __name__ == '__main__':
    main()
