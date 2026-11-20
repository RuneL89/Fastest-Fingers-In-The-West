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

## Generation

    LEONARDO_API_KEY=... python3 scripts/generate-art.py

Output lands in `src/game/assets/gen/` as both the raw Leonardo PNG and the
palette-quantized version (`*-nes.png`). The game loads the quantized file.
