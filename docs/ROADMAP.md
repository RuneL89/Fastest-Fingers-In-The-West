# ROADMAP — Implementation Plan

## Goal

Ship "Fastest Fingers in the West" v1 on the Clicks Communicator (Android) by late January 2027: full story mode, six duels, earnest presentation, all docs honored.

## Guiding Rules

- Design is locked in STORY, CHARACTERS, WORLD, RULES, TOWN-MAP, NARRATIVE, ART-DIRECTION. Building follows the docs; deviations go back to the docs.
- Everything is pushed to GitHub as it lands.
- Playable-and-rough beats polished-but-partial: each milestone ends with something you can play in the browser on your laptop.

## Phase -1 — Art for the First Duel (user-approved before Phase 0)

All art needed through the end of the Yello Billy duel, generated and approved by the user before any building starts:

1. Main Street duel background (tormented townsfolk peeking, center kept clear for the fighter)
2. Yello Billy WANTED mugshot poster (traditional wild west style, for the map)
3. Top-down town map (six locations, dirt roads, wild west flavoring)
4. Townsfolk base bodies ×4 (matron, old-timer, laborer, kid; palette-swappable, pose swaps in-engine)
5. Main Street representative sprite (pending representative interview; placeholder if needed)

## Phase 0 — Prerequisites

The foundation everything else stands on. Nothing here is visible gameplay; all of it is structural.

1. **Project cleanup.** Remove PoC scaffolding, restructure scenes/screens into a clean flow: boot → title → difficulty select → prologue → map → duel → resolution → (map / game over / ending).
2. **Screen/state manager.** Every screen of the game as a discrete state with defined transitions.
3. **Text system.** Pixel font, typewriter text boxes with keypress advance, speaker colors (per NARRATIVE.md).
4. **Asset loading pipeline.** Quantized art (`*-nes.png`) loading, sprite registry per fighter/location, audio hookup points.
5. **Data files.** Fighter data (art refs, lives, phrase theme), location data (background, representative, goon), phrase pools, dialogue tables — all as editable data, not hardcoded.

**Exit criteria:** title screen boots, difficulty select works, a placeholder prologue box displays, the game reaches an empty map screen.

## Phase 1 — The Map

Navigation skeleton per TOWN-MAP.md.

1. Top-down map screen at 270×300: town hall center, mine top-right, six locations, dirt roads (placeholder art OK — gray boxes first, real map art later).
2. WANTED poster overlays with lock on Town Hall; tap → cut to duel stub; freed state = poster off, representative placeholder visible.
3. State persistence across map visits (which areas are freed).
4. Banjo loop placeholder (any calm loop).

**Exit criteria:** you can tap five unlocked posters, get a "duel coming soon" stub, and watch the lock fall off Town Hall in code when all five are marked freed (debug toggle).

## Phase 2 — One Duel, End to End (Yello Billy)

The first full vertical slice, per CHARACTERS.md + RULES.md + NARRATIVE.md.

1. Race mechanic carried over from the PoC and cleaned: shared phrase, both sides fill, first to finish fires.
2. Three sheriff lives, goon lives per data (Billy: 2). Game over → run restart.
3. Intro exchange UI: goon line → pick 1 of 3 sheriff lines → goon closing line → race.
4. Phrase pool per NARRATIVE theme table (Billy: simple 3–5 letter everyday words).
5. Flinch per correct keystroke; hit/down frame swaps from his approved style sheet.
6. Victory: freed-state on Main Street, representative thank-you stub, back to map with poster gone.
7. Main Street background art (first of six).

**Exit criteria:** from the map, through dialogue, through a real 2-life duel against Billy, to a freed Main Street and back. Fully playable.

## Phase 3 — Remaining Four Goons, One at a Time

Repeat the Phase 2 loop per goon, in roster order: Three-Finger Rye (Saloon) → Sam Snakeeyes (Gambling Den) → Greg Goose (Gold Mine) → Dandy Dan (Church). Per goon:

1. Phrase pool per theme table.
2. Intro exchange (goon line + three sheriff options + response).
3. Background art with its torment scene and NPC states (cowering → celebrating) using the shared townsfolk bases.
4. Representative thank-you line (short interview per representative before their build slot — resumes the paused interviews).
5. Style-sheet frame integration; regenerate any frame that reads poorly in motion.

**Exit criteria:** all five areas freeable, any order, full loop each.

## Phase 4 — The Finale: Black Bart

1. Town Hall unlock flow with no foreshadowing (STORY.md).
2. Bart at 1.5× scale, 5 lives, buffalo head hit/defeat logic, in-engine pixel blood burst on the final fall.
3. Mayor tied in the background; Mayor's final thank-you line.
4. Town Hall background; ending slide (freed town + narrator line); credits.
5. Game over card with narrator line.

**Exit criteria:** the game is complete start-to-finish in the browser.

## Phase 5 — Presentation & Audio

1. Duel music, tenser Bart track (open item: confirm separate track), map banjo, title sting.
2. Full SFX set per ART-DIRECTION.
3. Effects: sheriff-hit red flash + shake, goon impact flash + smoke, victory gleam.
4. Prologue slides and title screen art; wordmark.

## Phase 6 — Android for the Clicks Communicator

1. WebView/TWA packaging of the build; physical-key input mapping on the Communicator.
2. On-device playtesting; resolution and performance check at 270×300.
3. Post-device polish bucket: map celebration after Bart, freed-press feedback, difficulty tuning, anything deferred.

**Exit criteria:** installed on the phone, playable on its keyboard.

## Explicitly Out of Scope (v1)

- Multiplayer (the race mechanic stays duel-only).
- Practice mode.
- Scoring/star ratings.
- Saves/checkpoints.

## Open Questions (non-blocking)

- Separate Bart duel track: decide in Phase 5.
- Map celebration after Bart: decide in Phase 6.
