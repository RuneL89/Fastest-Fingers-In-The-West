#!/usr/bin/env python3
"""Generate game art via Leonardo.ai and quantize it to the game's NES palette.

Usage:
    LEONARDO_API_KEY=... python3 scripts/generate-art.py

PoC scope: Cactus Jack outlaw sprite + Wild West main street background.
Raw downloads and NES-quantized output go to src/game/assets/gen/.
"""
import json
import os
import sys
import time
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "src" / "game" / "assets" / "gen"
OUT.mkdir(parents=True, exist_ok=True)

API = "https://cloud.leonardo.ai/api/rest/v1"
# Phoenix 1.0 — Leonardo's own model, strong prompt adherence, free tier.
PHOENIX_ID = "6b645e3a-d64f-4346-97f0-02c9be83da79"

# NES 2C02 master palette subset used by the game (mirrors PAL in src/game/config.ts).
NES_PALETTE = [
    (0, 0, 0), (252, 252, 252), (188, 188, 188), (124, 124, 124),
    (60, 60, 60), (252, 0, 0), (188, 0, 0), (124, 0, 0),
    (252, 188, 188), (252, 128, 0), (188, 96, 0), (124, 64, 0),
    (252, 252, 128), (128, 252, 0), (0, 188, 0), (0, 124, 0),
    (188, 252, 188), (0, 252, 128), (0, 188, 188), (0, 124, 124),
    (188, 252, 252), (0, 128, 252), (0, 0, 188), (0, 0, 124),
    (188, 188, 252), (128, 0, 252), (188, 128, 252), (104, 68, 40),
    (68, 40, 16), (168, 96, 56), (252, 192, 128), (224, 160, 96),
    (128, 64, 32), (64, 32, 16), (32, 16, 8),
]

PROMPTS = {
    "cactus-jack": {
        "prompt": (
            "16-bit pixel art sprite of a Wild West outlaw gunslinger standing idle "
            "facing the viewer, flat-brim cowboy hat with dark band, red bandana "
            "covering lower face, brown leather vest over faded blue shirt, gun belt "
            "with holster, black outline around the whole figure, flat colors, no "
            "gradients, no shading highlights, no anti-aliasing, crisp square pixels, "
            "NES video game character, small sprite proportions, centered, plain "
            "solid background"
        ),
        "negative_prompt": (
            "smooth gradients, painterly, soft edges, anti-aliasing, realistic, "
            "photograph, 3d render, blurry, watercolor, thin outlines, extra limbs, "
            "text, watermark"
        ),
        "width": 512,
        "height": 640,
    },
    "main-street": {
        "prompt": (
            "8-bit pixel art Wild West desert town main street seen from a duel "
            "position, dirt road in the center, wooden storefronts and saloon on "
            "both sides, cacti and rocks in the distance, mountains and blue sky, "
            "flat colors, limited NES color palette, no gradients, crisp square "
            "pixels, NES video game background, horizon in upper third"
        ),
        "negative_prompt": (
            "smooth gradients, painterly, realistic, photograph, 3d render, blurry, "
            "text, watermark, characters, people"
        ),
        "width": 1024,
        "height": 1024,
    },
}


def api_post(path, payload, key):
    req = urllib.request.Request(
        API + path,
        data=json.dumps(payload).encode(),
        headers={
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    )
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read())


def generate(key, spec, name):
    resp = api_post(
        "/generations",
        {
            "modelId": PHOENIX_ID,
            "prompt": spec["prompt"],
            "negative_prompt": spec["negative_prompt"],
            "width": spec["width"],
            "height": spec["height"],
            "num_images": 1,
            "public": False,
        },
        key,
    )
    gen_id = resp["sdGenerationJob"]["generationId"]
    print(f"[{name}] generation {gen_id} queued")
    for _ in range(40):
        time.sleep(5)
        with urllib.request.urlopen(
            urllib.request.Request(
                f"{API}/generations/{gen_id}", headers={"Authorization": f"Bearer {key}"}
            ),
            timeout=30,
        ) as r:
            data = json.loads(r.read())
        gen = data["generations_by_pk"]
        if gen and gen.get("status") == "COMPLETE":
            url = gen["generated_images"][0]["url"]
            raw = OUT / f"{name}.png"
            urllib.request.urlretrieve(url, raw)
            print(f"[{name}] saved {raw}")
            return raw
        if gen and gen.get("status") in ("FAILED", "CANCELLED"):
            print(f"[{name}] generation {gen['status']}", file=sys.stderr)
            return None
    print(f"[{name}] timed out waiting for generation", file=sys.stderr)
    return None


def quantize_to_nes(path, name, target_w):
    from PIL import Image

    img = Image.open(path).convert("RGB")
    ratio = target_w / img.width
    img = img.resize((target_w, max(1, round(img.height * ratio))), Image.NEAREST)
    pal_img = Image.new("P", (1, 1))
    flat = []
    for c in NES_PALETTE:
        flat += list(c)
    flat += [0] * (768 - len(flat))
    pal_img.putpalette(flat)
    q = img.quantize(palette=pal_img, dither=Image.Dither.NONE)
    out = OUT / f"{name}-nes.png"
    q.convert("RGB").save(out)
    print(f"[{name}] quantized -> {out} ({q.width}x{q.height})")
    return out


def main():
    key = os.environ.get("LEONARDO_API_KEY")
    if not key:
        sys.exit("Set LEONARDO_API_KEY")
    for name, spec in PROMPTS.items():
        raw = generate(key, spec, name)
        if raw:
            quantize_to_nes(raw, name, target_w=44 if name == "cactus-jack" else 135)


if __name__ == "__main__":
    main()
