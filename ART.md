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
- `npc-matron.png`, `npc-oldtimer.png`, `npc-laborer.png`, `npc-townman.png` — townsfolk base bodies v2, approved 2026-11-22 (very low detail standard; kid body dropped per user: no children)
- `npc-*-flinch.png`, `npc-*-happy.png` (4 bases), `rep-mainstreet-flinch.png`, `rep-mainstreet-happy.png` — NPC state frames, approved 2026-11-22
- `yello-billy-draw.png`, `yello-billy-flinch.png`, `yello-billy-fire.png` — Billy motion frames (full set: idle/draw/aim/flinch/fire/hit/down), approved 2026-11-22

## Phase 1A accepted art and final prompts (2026-11-22)

The saloon background, Rye's coherent seven-frame animation set, and the revised barkeeper are approved. The raw PNGs in `src/game/assets/gen/` are the canonical runtime assets. Experimental `*-nes.png` variants for this set were removed. The first-pass saloon workflow in `scripts/generate-art.py` is retired and disabled so it cannot overwrite approved files.

Generation ran through the Kimi image gateway because Leonardo access was unavailable. Final replacement frames used approved images as visual references. The requirements below are the reusable final prompt record; they supersede the earlier first-pass saloon prompts.

### Shared Rye identity

```
Drunken Wild West outlaw gunslinger, black flat-brim cowboy hat with red band
and small yellow feather, big red nose, wild brown beard and mustache, green and
yellow checkered shirt with red suspenders, baggy patched brown pants, grey boots
with yellow spurs, whiskey bottle in his left hand. Full-body 16-bit NES pixel-art
sprite, crisp square pixels, bold flat colors, thick black outline, exaggerated
readable silhouette, transparent background.
```

| Asset | Final prompt requirements and reference |
|---|---|
| `bg-saloon.png` | `8-bit pixel art Wild West saloon interior seen from a duel position, wooden bar counter with bottles along the left wall, overturned round tables and smashed whiskey bottles scattered on a wooden plank floor, saloon swinging doors centered in the back wall, warm brown and amber tones, very low detail, flat solid colors, limited NES color palette, crisp square pixels, NES video game background, no people, no characters.` |
| `three-finger-rye-idle.png` | Use the approved Rye identity reference. `Standing idle facing the viewer, revolver completely holstered on his right hip, left hand raising the whiskey bottle in a drunken toast, relaxed unsteady stance.` The earlier raised-gun idle was rejected. |
| `three-finger-rye-draw.png` | Use the approved replacement idle as reference. `Right hand pulling the revolver from its holster in a clearly readable mid-draw pose, revolver angled downward, bottle retained in the left hand, tense stance.` |
| `three-finger-rye-aim.png` | Existing approved frame retained. Rye aims his right-hand revolver toward the viewer and retains the bottle in his left hand. |
| `three-finger-rye-flinch.png` | First saloon-batch frame retained. `Sudden recoil flinch, eyes squeezed shut, head jerking back, shoulders hunched, same clothing and handedness.` |
| `three-finger-rye-fire.png` | Use the approved Rye frames as reference. `Right arm fully extended toward the viewer, revolver firing directly at the viewer with a bright muzzle flash, forceful recoil, bottle retained in the left hand.` The rejected near-head gun pose was discarded. |
| `three-finger-rye-hit.png` | Existing approved frame retained. |
| `three-finger-rye-down.png` | Existing approved frame retained. |

Approved live sequence: holstered idle → mid-draw → aim → flinch on correct player keys → extended-arm fire → hit → down. Verification confirmed that aim appears for at least one outlaw typing step before fire.

### Unique barkeeper identity

The first chunky barkeeper was rejected because he looked too much like Stew Potts. The approved identity is a slim, sly, nervous professional:

```
Wild West saloon barman, slim build, slicked-back dark hair, big round nose,
thin handlebar mustache, black vest over white shirt with small burgundy bow tie,
white towel draped over his left forearm, right hand polishing a glass mug with
a cloth, sly nervous half-smile. Full-body 16-bit NES pixel-art sprite, crisp
square pixels, flat solid colors, thick black outline, transparent background.
```

| Asset | Final prompt requirements and reference |
|---|---|
| `rep-saloon.png` | Use the unique barkeeper prompt above. Do not use Stew Potts as an identity reference. |
| `rep-saloon-flinch.png` | Use the approved new barkeeper himself as reference. `Same slim barkeeper and clothing, cowering in fear, both hands over his head, eyes squeezed shut, towel retained.` |
| `rep-saloon-happy.png` | Use the approved new barkeeper himself as reference. `Same slim barkeeper and clothing, jumping with joy, both arms raised high, huge open-mouth grin.` |

For opaque first-pass sprite renders, only the contiguous backdrop was removed with border-seeded flood fill and color tolerance. Character interiors were preserved. Approved raw transparent PNGs are loaded directly by the game.

## Saloon v2 scene art (2026-11-22)

The single painted saloon background made furniture occlusion fragile (NPCs read as
embedded in tabletops). The scene is now composited: background architecture +
separate furniture sprites + depth-sorted crowd. See `docs/SCALE-MAP.md` for the
size/perspective system and `src/game/data/locations.ts` for placement.

| Asset | Prompt requirements | Reference |
|---|---|---|
| `bg-saloon-v2.png` | `8-bit pixel art Wild West saloon interior seen from a duel position, wooden bar counter with brass rail running diagonally along the left wall, bottles on shelves behind the counter, saloon swinging doors centered in the back wall, wanted poster and window on the right wall, longhorn skulls, empty wooden plank floor with a few smashed whiskey bottles, warm brown and amber tones, very low detail, flat solid colors, limited NES color palette, crisp square pixels, NES video game background, no people, no characters, no tables, no chairs, no stools, no barrels, keep the bar counter.` | approved `bg-saloon.png` |
| `prop-table-round.png` | `16-bit NES pixel art Wild West saloon round wooden table, upright and sturdy, pedestal base, viewed from a standing duel eye level with a slightly elliptical round top, warm brown planks, flat solid colors, crisp square pixels, thick black outline, very low detail, transparent background` | approved `bg-saloon.png` |
| `prop-table-tilted.png` | Same style; overturned round table lying on its side at a dynamic angle. | approved `bg-saloon.png` |
| `prop-chair-upright.png` | Same style; upright wooden chair, simple plank backrest and legs. | approved `bg-saloon.png` |
| `prop-chair-broken.png` | Same style; smashed chair, snapped leg, knocked aside in a bar fight. | approved `bg-saloon.png` |

All four props are trimmed to their alpha bounding box. A separate bar-counter
prop was generated and rejected (wrong facing angle); the counter stays painted
in the background, exactly as the user directed. Staging files and the rejected
variants live in `art-staging/saloon-v2/`.


## Phase 2A gambling-den art and final prompt record (2026-11-22)

The gambling-den background, separate card table, Snakeeyes motion frames, and Busted Ben representative are complete. Generation ran through the Kimi image gateway. The raw PNGs in `src/game/assets/gen/` are the canonical runtime assets. Transparent sprites are trimmed to their alpha bounding boxes, with no NES quantization applied.

The wording below is the reusable final prompt record. Existing approved Snakeeyes idle, aim, hit, and down frames were retained as identity references.

### Gambling-den set

| Asset | Final prompt requirements | Reference |
|---|---|---|
| `bg-gambling-den.png` | `8-bit pixel art Wild West gambling den interior seen from a duel position, green and brown wooden wall paneling, swinging doors centered in the back wall, green-curtained window on the right, wall lanterns, framed painting of a dog with playing cards, wooden plank floor with scattered playing cards and IOU slips, flat solid colors, limited NES color palette, crisp square pixels, no people, no characters, no tables, no chairs.` | Accepted saloon architecture as style reference |
| `prop-poker-table.png` | `16-bit NES pixel art round wooden card table, green felt playing surface with a few playing cards on top, sturdy pedestal base, viewed from standing duel eye level with a slightly elliptical top, flat solid colors, crisp square pixels, thick black outline, transparent background.` | Accepted saloon furniture as style reference |

The first table request used poker-and-chips wording and was rejected by the generator's safety policy. The accepted prompt describes an ordinary wooden card table with green felt and playing cards. No chips are used.

### Snakeeyes motion frames

Shared identity: medium-built card sharp in a tall black hat with two playing cards in the band, thin waxed moustache, black long duster, white shirt, dark red vest, dark trousers, gold watch chain, and dice bolo tie. Full-body 16-bit NES pixel-art sprite, crisp square pixels, flat colors, thick black outline, transparent background.

| Asset | Final prompt requirements | Reference |
|---|---|---|
| `sam-snakeeyes-draw.png` | `Same Sam Snakeeyes identity and clothing, right hand pulling the revolver from its holster in a readable mid-draw pose, revolver angled downward, confident hunched stance.` | Approved Snakeeyes idle |
| `sam-snakeeyes-flinch.png` | `Same Sam Snakeeyes identity, sudden recoil with shoulders hunched and face tense, one playing card slipping from his hat band, long coat reacting to the movement.` | Approved Snakeeyes idle and aim |
| `sam-snakeeyes-fire.png` | `Same Sam Snakeeyes identity, one-handed revolver shot with the arm extended toward the viewer, bright muzzle flash, forceful but controlled recoil, consistent clothing and handedness.` | Approved Snakeeyes aim and draw |

Live verification confirmed the full sequence: idle, draw, aim, flinch on correct player keys, fire, hit, and down.

### Busted Ben identity and states

```
Elderly Wild West gambler, short grey hair, drooping grey moustache,
threadbare patched brown suit, frayed cream shirt, tired but kind face.
Full-body 16-bit NES pixel-art sprite, crisp square pixels, flat solid colors,
thick black outline, readable expressive pose, transparent background.
```

| Asset | Final prompt requirements | Reference |
|---|---|---|
| `rep-gambling-den.png` | `Worried Busted Ben studying an empty open wallet, shoulders slumped after losing at Snakeeyes' rigged table.` | Busted Ben identity prompt |
| `rep-gambling-den-flinch.png` | `Same elderly gambler and clothing, cowering with his hands up defensively, empty wallet dropped beside him.` | Approved Busted Ben base |
| `rep-gambling-den-happy.png` | `Same elderly gambler and clothing, jumping for joy and raising his recovered gold pocket watch, delighted open-mouth smile.` | Approved Busted Ben base |

Ben's victory line is: `My lucky watch! You're aces, Sheriff. Aces!`
