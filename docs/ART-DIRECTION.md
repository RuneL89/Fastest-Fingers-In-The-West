# ART-DIRECTION — The Visual Bible

## Master Style

**16-bit NES pixel art** in the style of the approved character frames: thick black outlines, bold flat colors, exaggerated readable silhouettes, family-friendly and earnest. Every asset in the game follows this one style: characters, backgrounds, map, UI, effects. No exceptions, no mixed styles.

**Palette:** the same "NES-inspired" palette used for the character art (richer than the strict 54-color NES set, but disciplined: flat color blocks, no gradients). One palette rule for all assets keeps characters and backgrounds cohesive.

**Resolution:** 270×300 game view everywhere (Clicks Communicator target). Fighters target ~112px tall in that view, about 37% of the view height, with Bart at 1.5× (~168px). Background townsfolk are scaled down enough to frame the duel but large enough to read clearly on a phone.

## Asset Pipeline

All raster art is AI-generated with the established pipeline: text-to-image anchor → reference-locked pose frames → NES quantization on import (the `*-nes.png` step already in the repo). Mugshots, backgrounds, map, slides: all through the same generator with style-locked prompts, then quantized the same way.

## Characters (locked — see CHARACTERS.md)

Six fighters, style sheets approved, key frames are character references not final animation frames. Per-keystroke flinch on every correct letter (all goons, visual only). Bart: buffalo head lifts on hit, off on defeat; in-engine pixel blood burst on his final fall (all other defeats stay bloodless).

## Backgrounds

Six duel backgrounds, one per location: Main Street, Saloon, Gambling Den, Gold Mine, Church, Town Hall.

- Same pixel style, but **simpler and lower-contrast than fighters** so the duelist always reads against them: muted earth tones, sun-bleached boards, dusty shadows.
- **Detail rule (approved with Main Street v2): backgrounds stay very low-detail and clean** — flat solid sky, simple large building shapes, minimal shading or texture, tiny simple NPC faces. The first detailed Main Street was rejected as too busy; the simpler version is the standard for all six backgrounds.
- One state per location, with **swappable NPC states in-engine**: same background, tormented citizens (cowering, peeking) before victory, celebrating citizens after. No second painted background per location.
- Each background shows its torment per WORLD.md (overturned tables, scattered cards, idle miners' tools, etc.), and the torment details are part of the painted scene: after victory they stay — life snaps back via the NPCs, not a repaint.
- Backgrounds are 270×300 full-view scenes; the fighter stands center-frame on a ground line, Wild Gunman-style.

## Generic Townsfolk

A small set of **4 base bodies** (e.g. round matron, lanky old-timer, sturdy laborer, kid), each with palette swaps, used as background NPCs in duels. Simple enough for in-engine pose swaps (cower/cheer/cry) without generated frame sets. Named representatives get their own small sprite for the map (standing, waving) — derived from their duel-scene design, drawn at map scale.

## WANTED Posters

Six dedicated **mugshot posters**, traditional Wild West wanted-poster style: aged paper, "WANTED" woodtype, reward amount, the goon's mugshot. **Approved standard (Billy v2): head and shoulders only, rendered in black ink silhouette-style, completely neutral deadpan expression.** Same pipeline, quantized. Used on the map (tormented state) and as the goon's portrait in duel intros.

## The Map

One full **top-down map image** of Tombwood Creek (AI-generated, style-locked, quantized). **Approved v2 standard: very low-detail, icon-readable buildings** — small square buildings with tiny identifying icons (beer mug for the saloon, card for the den, cross for the church), town hall center, mine tunnel in a small hill, thin dirt roads, minimal decoration, flat sand color. Posters, the lock, and freed representatives are overlaid sprites in-engine.

## Prologue & Closing Slides

Painted full-screen scenes in the same style, one per beat: gang in town, the three torments, the player arriving; one freed-town closing image. ~5 slides total. Same pipeline.

## UI

- **Font:** the game's NES pixel font for everything; white with black outline; speaker names colored per character.
- **Chrome:** dark wooden panels with simple nail details for text boxes and menus — frontier without clutter.
- **Title screen:** the wordmark over a painted Main Street scene with the six fighters' silhouettes; "PRESS START" blink.
- **Wordmark:** "FASTEST FINGERS IN THE WEST" in western woodtype slab-serif, arched, wood-and-brass colors.
- **Game over card:** black screen, woodtype GAME OVER, the narrator line in a paper text box.
- **Difficulty select:** three cards on a corkboard, easy/normal/hard.

## Effects

- **Sheriff hit:** red vignette flash + screen shake + a bullet-hole crack overlay. No player avatar exists (RULES.md), so the screen itself takes the wound.
- **Goon hit:** white impact flash frame + smoke puff (in-engine particles).
- **Victory:** goon defeat animation + a small sun-gleam on the freed citizens.
- **Pixel blood:** Bart only, on his final fall — short burst, then done. Matches the bloodless raw frame workaround.

## Audio Direction

- **Music:** 8-bit chiptune in the NES spirit (square/triangle/noise channels). One duel track shared by all goons (v1), a tenser variation for Bart. Map: the slow cowboy banjo loop (confirmed). Title: a short heroic sting loop.
- **SFX:** 8-bit blips — keystroke tick, wrong-key dull thud, goon flinch yelp, gunshot crack, life-lost sting, poster-tear jingle, victory fanfare. Bart's gunshot is deeper and doubled (sawed-off).
- No voice acting, ever.

## Anti-Inspiration (explicitly NOT wanted)

No photorealism, no anime influence, no dark gritty revisionism, no gore beyond Bart's single burst, no modern UI gloss.

## Asset Checklist (v1)

- [x] 6 fighter style-sheet sets (done, approved)
- [x] Main Street background (approved 2026-11-22)
- [x] Yello Billy WANTED poster (approved 2026-11-22)
- [x] Town map (approved 2026-11-22)
- [ ] 3 remaining goon posters + Bart poster
- [ ] 5 remaining duel backgrounds
- [ ] NPC base bodies ×4 + palette swaps + pose swaps
- [ ] 5 named representative sprites + Mayor (paused with interviews)
- [ ] 6 WANTED mugshot posters
- [ ] 1 top-down town map
- [ ] ~5 prologue/closing slides
- [ ] Title screen + wordmark
- [ ] UI panels, text box, game over card, difficulty select
- [ ] Effects: flash, shake, smoke, blood burst, gleam
- [ ] Audio: 3 music tracks + SFX set

## Open Items

- Sheriff-hit effect tuning (red flash vs. sepia wound filter — try in implementation)
- Duel music: one shared track vs. per-goon variations (v1 says shared)
- Bart duel track: separate tenser track, yes/no
