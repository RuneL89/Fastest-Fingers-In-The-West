# Fastest Fingers in the West

A 2D Wild West typing-duel game inspired by NES Wild Gunman. You are the sheriff of Tombwood Creek. Five Buffalo Gang goons can be challenged in any order, and Black Bart waits at Town Hall after all five are defeated.

Both duelists type the same word. Correct letters fill your side while the outlaw's progress appears letter by letter. Whoever finishes first fires. Wrong keys only cost time.

## Current story-mode status

Playable and verified:

- Main Street: Yello Billy
- The Saloon: Three-Finger Rye
- Gambling Den: Sam Snakeeyes

Each location has its own background, depth-sorted townsfolk and furniture, dialogue exchange, seven-frame outlaw set, victory representative, and freed-map state. The Gold Mine, Church, and Town Hall duels belong to later roadmap phases.

The sheriff has three lives. Goons have two, and Black Bart will have five. Losing all sheriff lives restarts the run. Version 1 has no pause, practice mode, scoring, or saved progress.

## Controls

- **Space / Enter / tap**: advance dialogue and confirm
- **1 / 2 / 3**, arrow keys, or tap: choose a sheriff dialogue response
- **Letters**: type the revealed word during a duel
- **Esc**: skip the prologue
- **Touch phones**: tap the duel screen to open the OS keyboard. Autocorrect, autocomplete, spellcheck, and predictive text are disabled

## Tech

- React, Phaser 3, TypeScript, and Vite
- Phaser CANVAS renderer
- 270 x 300 logical view with a 1080 x 1200 backing canvas
- Data-driven fighters, locations, dialogue, phrases, crowds, and furniture
- Depth-sorted 2D composition with background occluders
- Approved raw PNG art loaded directly from `src/game/assets/gen/`
- Synthesized Web Audio music and sound effects

Art prompts and acceptance records live in `ART.md`. The implementation order is in `docs/ROADMAP.md`, and scene proportions are documented in `docs/SCALE-MAP.md`.

## Run

```sh
npm install
npm run dev
npm run build
npm run preview
```

## Verify

The Playwright scripts use `http://localhost:8899/` by default. Set `GAME_URL` to test another server, such as a production preview on port 8900.

```sh
npx vite --port 8899 --strictPort
node scripts/verify-phase1.mjs
node scripts/verify-rye.mjs
node scripts/verify-rye-frames.mjs
node scripts/verify-snakeeyes.mjs
node scripts/verify-snakeeyes-frames.mjs
node scripts/verify-gameover.mjs
node scripts/verify-loading.mjs
node scripts/verify-title-keyboard.mjs
node scripts/verify-ai-pace.mjs
node scripts/verify-mobile.mjs
```

The checks cover full duel victories, live draw/aim/fire poses, dialogue selection by keyboard and pointer, freed-map states, game over and restart, loading, soft-keyboard input, mobile typing, and outlaw pacing. Screenshots are written to `verification-shots/` as local process artifacts.
