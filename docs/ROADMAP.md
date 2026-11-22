# ROADMAP — Implementation Plan (art-first structure)

## Goal

Ship "Fastest Fingers in the West" v1 on the Clicks Communicator (Android) by late January 2027: full story mode, six duels, earnest presentation, all docs honored.

## Guiding Rules

- Design is locked in STORY, CHARACTERS, WORLD, RULES, TOWN-MAP, NARRATIVE, ART-DIRECTION. Building follows the docs; deviations go back to the docs.
- **Every development phase is preceded by an art phase.** No development starts on a phase until its art is generated, approved by the user, logged, and pushed.
- Everything is pushed to GitHub as it lands.
- Playable-and-rough beats polished-but-partial: each development phase ends with something you can play in the browser on your laptop.

## Phase -1 — ART: First Duel (COMPLETE 2026-11-22)

Approved and pushed: Main Street background, town map, Yello Billy WANTED poster, 4 townsfolk base bodies (worried/flinch/happy), Stew Potts representative sprite (3 states), Billy full frame set (idle/draw/aim/flinch/fire/hit/down).

## Phase 0 — DEV: Prerequisites (COMPLETE 2026-11-22)

The foundation everything else stands on. No new art needed (uses Phase -1 assets).

1. **Project cleanup.** Remove PoC scaffolding, restructure into a clean screen flow: boot → title → difficulty select → prologue → map → duel → resolution → (map / game over / ending).
2. **Screen/state manager.** Every screen of the game as a discrete state with defined transitions.
3. **Text system.** Pixel font, typewriter text boxes with keypress advance, speaker colors (per NARRATIVE.md).
4. **Asset loading pipeline.** Quantized art loading, sprite registry per fighter/location, audio hookup points.
5. **Data files.** Fighter data (art refs, lives, phrase theme), location data (background, representative, goon), phrase pools, dialogue tables — all as editable data, not hardcoded.

**Exit criteria:** title screen boots, difficulty select works, a placeholder prologue box displays, the game reaches the map screen.

## Phase 0A — ART: Map Presentation Polish (COMPLETE 2026-11-22 — all six posters generated; lock drawn in-engine)

1. Remaining five WANTED posters (Rye, Snakeeyes, Goose, Dan, Bart) — head-only black neutral mugshot standard.
2. Lock overlay art for Town Hall poster.
3. Poster tear-down / representative placement is in-engine; no art needed beyond posters.

## Phase 1 — DEV: Map + First Full Duel (Yello Billy) (COMPLETE 2026-11-22)

1. Map screen: poster overlays, lock logic, freed states (poster off, Stew visible), debug toggle to free all five.
2. Race mechanic carried over from the PoC and cleaned: shared phrase, both sides fill, first to finish fires.
3. Three sheriff lives, Billy 2 lives. Game over → run restart.
4. Intro exchange UI: goon line → pick 1 of 3 sheriff lines → goon closing line → race.
5. Billy phrase pool (simple 3–5 letter everyday words) + dialogue draft (user critiques after).
6. Flinch per keystroke, draw/aim/fire/hit/down frame integration, NPC worried/flinch/happy states.
7. Victory: freed Main Street, Stew's thank-you line, back to map with poster gone.

**Exit criteria:** from the map, through dialogue, through a real 2-life duel against Billy, to a freed Main Street and back. Fully playable.

## Phase 1A — ART: Saloon Set (Three-Finger Rye) (COMPLETE 2026-11-22)

1. Saloon duel background approved: wooden bar, swinging doors, overturned tables, and scattered bottles.
2. Rye WANTED poster was already approved in Phase 0A.
3. Full seven-frame Rye set approved after coherence revisions: holstered idle, mid-draw, aim, flinch, extended-arm fire, hit, and down. Handedness and revolver position remain consistent.
4. Unique slim barkeeper approved with slicked-back dark hair, thin mustache, black vest, burgundy bow tie, forearm towel, and glass-polishing pose. Happy and flinch states use the same identity.

Final prompt requirements and the canonical raw-PNG policy are recorded in `ART.md`.

## Phase 2 — DEV: Rye Duel (COMPLETE 2026-11-22)

The complete two-life saloon duel is playable, with Rye dialogue and phrase pool, saloon NPCs, letter-by-letter outlaw typing, the full live idle/draw/aim/fire sequence, barkeeper thank-you, and freed-saloon map state. Regression coverage includes both victories, game over/restart, loading, desktop and mobile keyboard input, and AI pacing.

## Phase 2A — ART: Gambling Den Set (Sam Snakeeyes) (COMPLETE 2026-11-22)

Completed the green-and-brown den background, separate green-felt card table, Snakeeyes draw/flinch/fire frames, and Busted Ben's worried/flinch/happy representative set. His existing poster and idle/aim/hit/down frames were retained. Final reusable prompts and the raw-PNG policy are recorded in `ART.md`.

## Phase 3 — DEV: Snakeeyes Duel (COMPLETE 2026-11-22)

The complete two-life gambling-den duel is playable with seven depth-sorted townsfolk, four furniture pieces, Snakeeyes dialogue and gambling phrases, pointer and keyboard dialogue selection, the full live idle/draw/aim/fire sequence, Busted Ben's thank-you, and the freed-den map state. Dialogue choices now stack by measured wrapped height so long lines do not overlap.

Verification passed for Billy, Rye, and Snakeeyes victories; both Rye and Snakeeyes animation sequences; game over and full restart; loading; title keyboard opening; AI pacing; and mobile typing. The production build and fresh-browser production checks also passed with zero console errors.

## Phase 3A — ART: Gold Mine Set (Greg Goose)

Mine background, poster, Goose draw/flinch/fire frames, representative interview + sprite.

## Phase 4 — DEV: Goose Duel

## Phase 4A — ART: Church Set (Dandy Dan)

Church background (Dan posing, women on pews, angry priest and men), poster, Dan draw/flinch/fire frames, representative interview (priest) + sprite.

## Phase 5 — DEV: Dan Duel

**Exit criteria:** all five areas freeable, any order, full loop each.

## Phase 5A — ART: Finale Set (Black Bart + Presentation)

1. Town Hall background (Mayor tied up in background).
2. Bart WANTED poster.
3. Bart extra frames as needed (recoil, head-lift variants for 4 surviving hits).
4. Mayor sprite + interview.
5. Prologue slides (~5, narrator text images) and closing slide.
6. Title screen art + wordmark, UI panels, game over card, difficulty select chrome.

## Phase 6 — DEV: Finale

1. Town Hall unlock flow with no foreshadowing (STORY.md).
2. Bart at 1.5× scale, 5 lives, buffalo head hit/defeat logic, in-engine pixel blood burst on final fall.
3. Bart intro exchange; Mayor final thank-you; ending slides; credits; game over card.

**Exit criteria:** the game is complete start-to-finish in the browser.

## Phase 6A — ART: Audio (OPTIONAL POLISH, not a v1 blocker)

The user accepted the existing audio for v1 on 2026-11-22. Revisit this phase only if a later playtest justifies an audio upgrade.

1. Optional duel music upgrade, Bart variation, map banjo, and title sting.
2. Optional SFX expansion beyond the accepted set.

## Phase 7 — DEV: Presentation Polish (OPTIONAL unless playtesting finds a defect)

1. Music + SFX integration only if Phase 6A is reopened.
2. Optional effects polish: sheriff-hit flash + shake, goon impact flash + smoke, victory gleam.

## Phase 8 — DEV: Android for the Clicks Communicator

1. WebView/TWA packaging; physical-key input mapping on the Communicator.
2. On-device playtesting; resolution and performance check at 270×300.
3. Post-device polish bucket: map celebration after Bart, freed-press feedback, difficulty tuning, anything deferred.

**Exit criteria:** installed on the phone, playable on its keyboard.

## Explicitly Out of Scope (v1)

- Multiplayer (the race mechanic stays duel-only).
- Practice mode.
- Scoring/star ratings.
- Saves/checkpoints.

## Open Questions (non-blocking)

- Separate Bart duel track: decide in Phase 6A.
- Map celebration after Bart: decide in Phase 8.
- Representative interviews happen inside each art phase (1A-5A).
