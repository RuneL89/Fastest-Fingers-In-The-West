# ROADMAP — Implementation Plan (art-first structure)

## Goal

Ship "Fastest Fingers in the West" v1 on the Clicks Communicator (Android) by late January 2027: full story mode, six duels, earnest presentation, all docs honored.

## Guiding Rules

- Design is locked in STORY, CHARACTERS, WORLD, RULES, TOWN-MAP, NARRATIVE, ART-DIRECTION. Building follows the docs; deviations go back to the docs.
- **Art before code.** Every development phase is preceded by an art phase whose assets are approved by the user. No dev phase starts on unapproved art.
- Everything is pushed to GitHub as it lands.
- Playable-and-rough beats polished-but-partial: each dev phase ends with something playable in the browser on a laptop.

## Phase -1 — Art for the First Duel (COMPLETE 2026-11-22)

- [x] Main Street background
- [x] Town map
- [x] Yello Billy WANTED poster
- [x] Townsfolk base bodies ×4 (matron, old-timer, laborer, town man) with flinch + happy states
- [x] Stew Potts (Main Street representative) with flinch + happy states
- [x] Yello Billy extra frames: draw, flinch, fire (full set now: idle/draw/aim/flinch/fire/hit/down)

## Phase 0 — Prerequisites + Map + First Duel (DEV)

Foundation plus the first full vertical slice.

1. **Prerequisites:** project cleanup, screen/state manager (boot → title → difficulty → prologue → map → duel → resolution), text system, asset pipeline, data files (fighters, locations, phrase pools, dialogue).
2. **Map screen:** town map image with poster overlays, Town Hall lock, freed states (poster removed, representative shown), state persistence, banjo placeholder loop.
3. **Yello Billy duel end to end:** shared-phrase race (from PoC, cleaned), 3 sheriff lives vs 2 goon lives, intro exchange (goon line → pick 1 of 3 sheriff lines → goon response), simple-word phrase pool, per-keystroke flinch, hit/down/fire frame logic, victory → freed Main Street with Stew's thank-you line → back to map. Game over → full restart.

**Exit criteria:** title → prologue text → map → Billy duel → freed scene → map, playable start to finish in browser.

## Phase 1-A — Art for Goons 2–5 (ART)

- [ ] Saloon, Gambling Den, Gold Mine, Church backgrounds
- [ ] WANTED posters for Rye, Snakeeyes, Goose, Dan
- [ ] Extra frames per goon: draw, flinch, fire (locked to each approved style sheet)
- [ ] Representative sprites for the four locations (interviews resume here: saloon barman, gambling den victim, miner, priest — plus Mayor design for the finale)
- [ ] Bart poster + Town Hall background can land here or in 2-A (decide when we get there)

**Exit criteria:** user approves every asset above.

## Phase 1 — Remaining Four Goons (DEV)

Repeat the Phase 0 duel loop per goon, roster order: Three-Finger Rye → Sam Snakeeyes → Greg Goose → Dandy Dan. Phrase pools, intro exchanges, backgrounds + NPC states, thank-you lines, frame integration with regeneration where motion reads poorly.

**Exit criteria:** all five areas freeable in any order, full loop each.

## Phase 2-A — Art for the Finale (ART)

- [ ] Town Hall background (Mayor tied in the background)
- [ ] Black Bart extra frames: draw, flinch, fire (helmet-lift logic per CHARACTERS.md)
- [ ] Prologue slides (~4) + closing slide
- [ ] Title screen art + wordmark
- [ ] UI panels, text box, game over card, difficulty select art
- [ ] Mayor sprite

**Exit criteria:** user approves all.

## Phase 2 — The Finale (DEV)

Town Hall unlock flow (no foreshadowing), Bart at 1.5× with 5 lives, buffalo-head hit/defeat logic, pixel blood burst on final fall, Mayor's closing line, ending slide, game over card, prologue integration.

**Exit criteria:** complete game start-to-finish in browser.

## Phase 3-A — Audio (ART)

- [ ] Duel track, Bart track (confirm separate), map banjo loop, title sting
- [ ] Full SFX set (keystroke, wrong key, flinch, gunshots, life-lost, poster tear, victory fanfare)

## Phase 3 — Presentation (DEV)

Music/SFX integration, sheriff-hit red flash + shake, goon impact flash + smoke, victory gleam, prologue slides in engine, title screen.

## Phase 4 — Android for the Clicks Communicator

WebView/TWA packaging, physical-key input mapping, on-device playtesting at 270×300. Polish bucket: map celebration after Bart, freed-press feedback, difficulty tuning, deferred items.

## Explicitly Out of Scope (v1)

Multiplayer (race mechanic stays duel-only), practice mode, scoring, saves.

## Open Questions (non-blocking)

- Bart duel track separate from shared duel track: decide in Phase 2-A.
- Map celebration after Bart: decide in Phase 4.
