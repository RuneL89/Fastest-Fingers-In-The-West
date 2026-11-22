# Fastest Fingers in the West

A complete 2D Wild West typing-duel game inspired by NES Wild Gunman. You are the sheriff of Tombwood Creek. Five Buffalo Gang goons can be challenged in any order, and Black Bart unlocks at Town Hall after all five are defeated.

Both duelists type the same word. Correct letters fill your side while the outlaw's progress appears letter by letter. Whoever finishes first fires. Wrong keys only cost time.

## Complete story mode

All six duels are playable and verified:

| Location | Opponent | Lives | Representative |
|---|---|---:|---|
| Main Street | Yello Billy | 2 | Stew Potts |
| The Saloon | Three-Finger Rye | 2 | Barman |
| Gambling Den | Sam Snakeeyes | 2 | Busted Ben |
| Gold Mine | Greg Goose | 2 | Dusty Pete |
| The Church | Dandy Dan | 2 | Father Merritt |
| Town Hall | Black Bart | 5 | Mayor Hobart Plum |

Each location has its own background, depth-sorted cast and props, pre-duel dialogue, seven-frame outlaw set, victory reaction, and freed-map state. Father Merritt and the tied Mayor remain visible during their duels and flinch when shots are fired. At the Church, the men and priest celebrate while all three matrons cry.

The sheriff has three lives. Losing all of them causes a full run restart. Bart's defeat leads to the Mayor's thank-you, a celebration map with every freed representative, a short epilogue, and a return to title. Starting again resets the campaign. Version 1 has no pause, practice mode, scoring, or saved progress.

## Controls

- **Space / Enter / tap**: advance dialogue and confirm
- **1 / 2 / 3**, arrow keys, or tap: choose a sheriff dialogue response
- **Letters**: type the revealed word during a duel
- **Esc**: skip the prologue
- **Touch phones**: tap the duel screen to open the OS keyboard. Autocorrect, autocomplete, spellcheck, and predictive text are disabled
- **D on the map**: development shortcut that frees the five regular locations for Town Hall testing. The production campaign verifier does not use it

## Tech

- React, Phaser 3, TypeScript, and Vite
- Phaser CANVAS renderer
- 270 x 300 logical view with a 1080 x 1200 backing canvas
- Data-driven fighters, locations, dialogue, phrases, crowds, representatives, and furniture
- Depth-sorted 2D composition with background occluders
- Raw PNG art loaded directly from `src/game/assets/gen/`
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

Build and run the complete cold production campaign:

```sh
npm run build
npm run verify
```

The campaign check serves `dist/` on a temporary local port and uses a fresh 1080 x 2340 browser. It plays all six duels through the ordinary map UI without debug unlocks. It also checks wrong-key behavior, the Town Hall lock, representative reactions, Bart's five lives, touch ending controls, title return, new-run reset, and zero browser errors.

Reusable individual-duel checks use `http://localhost:8899/` by default. Set `GAME_URL` to test another server, such as a production preview on port 8900.

```sh
npm run dev -- --host 0.0.0.0 --port 8899 --strictPort

LOCATION_ID=gold-mine OUTLAW_ID=greg-goose POSTER_X=0.75 POSTER_Y=0.185 node scripts/verify-duel.mjs
LOCATION_ID=church OUTLAW_ID=dandy-dan POSTER_X=0.185 POSTER_Y=0.535 node scripts/verify-duel.mjs
LOCATION_ID=town-hall OUTLAW_ID=black-bart POSTER_X=0.435 POSTER_Y=0.565 EXCHANGES=5 node scripts/verify-duel.mjs
OUTLAW_ID=black-bart POSTER_X=0.435 POSTER_Y=0.565 node scripts/verify-duel-frames.mjs
node scripts/verify-gameover.mjs
node scripts/verify-loading.mjs
node scripts/verify-title-keyboard.mjs
node scripts/verify-ai-pace.mjs
node scripts/verify-mobile.mjs
```

Screenshots are written to `verification-shots/` as local process artifacts. Android and Clicks Communicator packaging remain a separate later phase.
