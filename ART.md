# AI Art Pipeline — Fastest Fingers in the West

Goal: Leonardo.ai-generated art for the game, quantized to the strict NES palette so it
matches the code-drawn sprites pixel-for-pixel.

## Models (Leonardo, as of late 2026)

| Use | Model | Why |
|---|---|---|
| Base generation | Phoenix 1.0 | Best prompt adherence, stylized illustration, free tier, negative prompts |
| Drafts | Flux Schnell | Fast iterations |
| Consistency batches | Flux Dev + custom Element | Train on accepted renders for a house style |
| Poster art / text | Nano Banana | Multi-image reference for same face, new pose |

No Leonardo model is pixel-art-native, so every generated image is post-processed:
downscale to target sprite size, then quantize to the game's NES palette (`PAL` in
`src/game/config.ts`). The renderer already does palette enforcement, so off-palette
pixels never reach the screen.

## PoC: outlaw #1 CACTUS JACK + main street background

### Cactus Jack (opponent idle, ~44 px tall in-game)

Positive prompt:

```
16-bit pixel art sprite of a Wild West outlaw gunslinger standing idle facing the
viewer, flat-brim cowboy hat with dark band, red bandana covering lower face, brown
leather vest over faded blue shirt, gun belt with holster, black outline around the
whole figure, flat colors, no gradients, no shading highlights, no anti-aliasing,
crisp square pixels, NES video game character, small sprite proportions, centered,
plain solid background
```

Negative prompt:

```
smooth gradients, painterly, soft edges, anti-aliasing, realistic, photograph,
3d render, blurry, watercolor, thin outlines, extra limbs, text, watermark
```

### Background (main street, 8-bit)

```
8-bit pixel art Wild West desert town main street seen from a duel position, dirt
road in the center, wooden storefronts and saloon on both sides, cacti and rocks in
the distance, mountains and blue sky, flat colors, limited NES color palette, no
gradients, crisp square pixels, NES video game background, horizon in upper third
```

## PoC generation plan (5 images, one job each)

1. `cactus-jack-idle` — anchor frame. Full-body outlaw facing viewer, 512x640, plain solid background.
2. `cactus-jack-aim` — image-to-image from idle, arms raised aiming revolvers.
3. `cactus-jack-hit` — image-to-image from idle, recoiling, hat flying.
4. `cactus-jack-down` — image-to-image from idle, lying flat.
5. `main-street` — text-to-image backdrop, 1024x1024, no people.

Flow: Phoenix 1.0 base frame → accept winner → pose frames via `init_image_id`
+ `init_strength` ~0.55 (raise only if frames drift) → fixed seed across the
frame set → change one variable per run, log accepted settings below.

Post-processing: downscale to pixel grid (outlaw ~44 px tall), nearest-neighbor,
quantize to NES palette, trim, save as `*-nes.png`. This step is what makes
AI art match the code-drawn sprites; Leonardo has no pixel-art-native model.

Animation mapping: idle = intro/tension, aim = race, hit+down = outlaw loses
exchange (blood stays procedural), idle = player loses. Muzzle flash, blood,
hat-prop stay code-drawn.

Prompting rules (from Leonardo docs): positive prompt does the heavy lifting
("flat solid colors, crisp square pixels"); negative prompt is short and
specific (gradients, anti-aliasing, soft edges, photograph, 3d render, text,
extra limbs); never write "no" or "don't" in negatives; one reference per job.

## Generation

    LEONARDO_API_KEY=... python3 scripts/generate-art.py

Output lands in `src/game/assets/gen/` as both the raw Leonardo PNG and the
palette-quantized version (`*-nes.png`). The game loads the quantized file.

## Accepted frames log

PoC executed 2026-11-21. cloud.leonardo.ai was unreachable from the build
sandbox (TLS blocked by egress filter), so generation ran through the Kimi
image gateway with the same prompt pack and anchor-then-poses flow. The
Leonardo path above stays ready to run locally with your own key.

All 5 images accepted on first generation:

| Frame | Source | Notes |
|---|---|---|
| cactus-jack-idle | text-to-image, transparent bg, 1024x1280 | anchor frame |
| cactus-jack-aim | idle as reference image | same outlaw, revolvers up |
| cactus-jack-hit | idle as reference image | hat flying, recoiling |
| cactus-jack-down | idle as reference image | fallen, hat beside him |
| main-street | text-to-image, 1024x1024 | no people |

Post-processing: trim to alpha bounding box, nearest-neighbor downscale
(outlaws to 44 px wide, background to 135 px), quantize to NES palette,
alpha thresholded at 128. Output: `src/game/assets/gen/*-nes.png`.

Integration: `DuelScene.preload()` loads the 5 images; outlaw 0 (Cactus Jack)
uses gen art with idle/aim during the race, hit on losing an exchange, down
on defeat. Other outlaws and the code background remain as fallback.

## Phase -1 accepted art (2026-11-22)

- `bg-main-street.png` — duel background v2, approved (very low-detail standard set)
- `poster-yello-billy.png` — WANTED poster v2, approved (head-only black neutral mugshot standard set)
- `map-tombwood-creek.png` — town map v2, approved (icon-readable low-detail standard set)

Regeneration notes: v1 background and map rejected as too detailed; v1 poster (full-body, colored, nervous) rejected in favor of head-only neutral black mugshot.
