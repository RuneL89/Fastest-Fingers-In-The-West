#!/usr/bin/env python3
"""Generate game art via Leonardo.ai and quantize it to the game's NES palette.

Usage:
    LEONARDO_API_KEY=... python3 scripts/generate-art.py [step]

Steps: idle | poses | background | all (default)

The retired `saloon` step is disabled. Its first-pass prompts remain below as
history only; the approved Phase 1A prompt record is in ART.md. Batch generation
must never overwrite approved canonical artwork.

Flow (see ART.md for the full plan):
  1. idle       — Phoenix 1.0 text-to-image, the anchor frame for Cactus Jack
  2. poses      — image-to-image from the accepted idle frame (aim/hit/down)
  3. background — main street backdrop, text-to-image
Every accepted frame is downscaled + quantized to the NES palette and saved
next to the raw PNG in src/game/assets/gen/.
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
# Phoenix 1.0 — strong prompt adherence, negative-prompt support, free tier.
PHOENIX_ID = "6b645e3a-d64f-4346-97f0-02c9be83da79"
SEED = 4219421  # fixed across the whole frame set for consistency

STYLE_POS = (
    "16-bit pixel art sprite, NES video game character, crisp square pixels, "
    "flat solid colors, black outline around the whole figure, small sprite "
    "proportions, centered, plain solid background"
)
NEG = "gradients, anti-aliasing, soft edges, photograph, 3d render, text, extra limbs"
IDENTITY = (
    "Wild West outlaw gunslinger, flat-brim cowboy hat with dark band, red "
    "bandana covering lower face, brown leather vest over faded blue shirt, "
    "gun belt with holster"
)

RYE_IDENTITY = (
    "drunken Wild West outlaw gunslinger, black flat-brim cowboy hat with red "
    "band and small yellow feather, big red nose, wild brown beard and mustache, "
    "green and yellow checkered shirt with red suspenders, baggy patched brown "
    "pants held by a single gold buckle, grey boots with yellow spurs, whiskey "
    "bottle in his left hand, revolver in his right hand"
)
REPS = (
    "cheerful chunky Wild West townsfolk sprite, big head, friendly face, "
    "16-bit pixel art, NES video game character, crisp square pixels, flat "
    "solid colors, thick black outline, small sprite proportions, centered, "
    "plain solid white background"
)

PROMPTS = {
    # ---- Phase 1A: Saloon set (Three-Finger Rye) ----
    "bg-saloon": {
        "prompt": (
            "8-bit pixel art Wild West saloon interior seen from a duel position, "
            "wooden bar counter with bottles along the left wall, overturned round "
            "tables and smashed whiskey bottles scattered on a wooden plank floor, "
            "saloon swinging doors centered in the back wall, warm brown and amber "
            "tones, very low detail, flat solid colors, limited NES color palette, "
            "crisp square pixels, NES video game background, no people, no characters"
        ),
        "negative_prompt": "gradients, photograph, 3d render, text, watermark, people, characters, detailed, busy",
        "width": 1024, "height": 1024,
    },
    "three-finger-rye-draw": {
        "prompt": f"{RYE_IDENTITY}, right hand pulling the revolver from its holster mid-draw, tense stance, {STYLE_POS}",
        "negative_prompt": NEG,
        "width": 512, "height": 640, "init_from": "three-finger-rye-idle", "init_strength": 0.5,
    },
    "three-finger-rye-flinch": {
        "prompt": f"{RYE_IDENTITY}, sudden recoil flinch, eyes squeezed shut, head jerking back, shoulders hunched, {STYLE_POS}",
        "negative_prompt": NEG,
        "width": 512, "height": 640, "init_from": "three-finger-rye-idle", "init_strength": 0.45,
    },
    "three-finger-rye-fire": {
        "prompt": f"{RYE_IDENTITY}, right arm extended firing the revolver at the viewer, bright muzzle flash, {STYLE_POS}",
        "negative_prompt": NEG,
        "width": 512, "height": 640, "init_from": "three-finger-rye-idle", "init_strength": 0.5,
    },
    "rep-saloon": {
        "prompt": (
            "Wild West saloon barman, slim build, slicked-back dark hair, big "
            "round nose, thin handlebar mustache, black vest over white shirt "
            "with small burgundy bow tie, white towel draped over his left "
            f"forearm, right hand polishing a glass mug with a cloth, sly "
            f"nervous half-smile, {REPS}"
        ),
        "negative_prompt": NEG,
        "width": 512, "height": 640, "init_from": "rep-mainstreet", "init_strength": 0.55,
    },
    "rep-saloon-flinch": {
        "prompt": (
            "Wild West saloon barman, slim build, slicked-back dark hair, big "
            "round nose, thin handlebar mustache, black vest over white shirt "
            "with small burgundy bow tie, cowering in fear, both hands over his "
            f"head, eyes squeezed shut, {REPS}"
        ),
        "negative_prompt": NEG,
        "width": 512, "height": 640, "init_from": "rep-mainstreet", "init_strength": 0.55,
    },
    "rep-saloon-happy": {
        "prompt": (
            "Wild West saloon barman, slim build, slicked-back dark hair, big "
            "round nose, thin handlebar mustache, black vest over white shirt "
            "with small burgundy bow tie, jumping with joy, both arms raised "
            f"high, huge open-mouth grin, {REPS}"
        ),
        "negative_prompt": NEG,
        "width": 512, "height": 640, "init_from": "rep-mainstreet", "init_strength": 0.55,
    },
    # ---- PoC set (kept for reference) ----
    "cactus-jack-idle": {
        "prompt": f"{IDENTITY}, standing idle facing the viewer, {STYLE_POS}",
        "negative_prompt": NEG,
        "width": 512, "height": 640,
    },
    "cactus-jack-aim": {
        "prompt": f"{IDENTITY}, arms raised aiming two revolvers forward at the viewer, {STYLE_POS}",
        "negative_prompt": NEG,
        "width": 512, "height": 640, "init_from": "cactus-jack-idle", "init_strength": 0.55,
    },
    "cactus-jack-hit": {
        "prompt": f"{IDENTITY}, stumbling backward, hat flying off his head, recoiling from a gunshot, {STYLE_POS}",
        "negative_prompt": NEG,
        "width": 512, "height": 640, "init_from": "cactus-jack-idle", "init_strength": 0.5,
    },
    "cactus-jack-down": {
        "prompt": f"{IDENTITY}, lying flat on his back on the ground, arms spread, {STYLE_POS}",
        "negative_prompt": NEG,
        "width": 512, "height": 640, "init_from": "cactus-jack-idle", "init_strength": 0.5,
    },
    "main-street": {
        "prompt": (
            "8-bit pixel art Wild West desert town main street seen from a duel "
            "position, dirt road in the center, wooden storefronts and saloon on "
            "both sides, cacti and rocks in the distance, mountains and blue sky, "
            "flat solid colors, limited NES color palette, crisp square pixels, "
            "NES video game background, horizon in upper third, no people, "
            "no characters"
        ),
        "negative_prompt": "gradients, photograph, 3d render, text, watermark, people, characters",
        "width": 1024, "height": 1024,
    },
}

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


def api_req(method, path, key, payload=None, raw_data=None, content_type="application/json"):
    data = raw_data if raw_data is not None else (
        json.dumps(payload).encode() if payload is not None else None)
    req = urllib.request.Request(
        API + path, data=data, method=method,
        headers={
            "Authorization": f"Bearer {key}",
            "Accept": "application/json",
            "Content-Type": content_type,
        },
    )
    with urllib.request.urlopen(req, timeout=120) as r:
        return json.loads(r.read())


def upload_init_image(key, path):
    """Upload a local PNG to Leonardo and return its init_image_id."""
    boundary = "----ffitw"
    body = (
        f"--{boundary}\r\nContent-Disposition: form-data; name=\"file\"; "
        f"filename=\"{path.name}\"\r\nContent-Type: image/png\r\n\r\n"
    ).encode() + path.read_bytes() + f"\r\n--{boundary}--\r\n".encode()
    resp = api_req("POST", "/init-image", key, raw_data=body,
                   content_type=f"multipart/form-data; boundary={boundary}")
    return resp["uploadInitImage"]["id"]


def generate(key, spec, name, init_id=None):
    payload = {
        "modelId": PHOENIX_ID,
        "prompt": spec["prompt"],
        "negative_prompt": spec["negative_prompt"],
        "width": spec["width"],
        "height": spec["height"],
        "num_images": 1,
        "seed": SEED,
        "public": False,
    }
    if init_id:
        payload["init_image_id"] = init_id
        payload["init_strength"] = spec["init_strength"]
    resp = api_req("POST", "/generations", key, payload)
    gen_id = resp["sdGenerationJob"]["generationId"]
    print(f"[{name}] generation {gen_id} queued")
    for _ in range(48):
        time.sleep(5)
        data = api_req("GET", f"/generations/{gen_id}", key)
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


def run_step(key, step):
    if step == "saloon":
        sys.exit(
            "The first-pass saloon workflow is retired. See ART.md for the "
            "approved Phase 1A prompt record; never overwrite canonical art."
        )
    if step in ("idle", "all"):
        name = "cactus-jack-idle"
        raw = generate(key, PROMPTS[name], name)
        if raw:
            quantize_to_nes(raw, name, target_w=44)
    if step in ("poses", "all"):
        idle_raw = OUT / "cactus-jack-idle.png"
        if not idle_raw.exists():
            sys.exit("cactus-jack-idle.png missing — run the idle step first")
        init_id = upload_init_image(key, idle_raw)
        print(f"init image uploaded: {init_id}")
        for name in ("cactus-jack-aim", "cactus-jack-hit", "cactus-jack-down"):
            raw = generate(key, PROMPTS[name], name, init_id=init_id)
            if raw:
                quantize_to_nes(raw, name, target_w=44)
    if step in ("background", "all"):
        name = "main-street"
        raw = generate(key, PROMPTS[name], name)
        if raw:
            quantize_to_nes(raw, name, target_w=135)


def main():
    key = os.environ.get("LEONARDO_API_KEY")
    if not key:
        sys.exit("Set LEONARDO_API_KEY")
    step = sys.argv[1] if len(sys.argv) > 1 else "all"
    if step not in ("idle", "poses", "background", "saloon", "all"):
        sys.exit("step must be: idle | poses | background | saloon | all")
    run_step(key, step)


if __name__ == "__main__":
    main()
