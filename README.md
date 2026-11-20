# Fastest Fingers in the West

A Wild West quick-draw typing duel in the spirit of NES Wild Gunman. You face a fixed
ladder of 10 outlaws on a dusty frontier street. A word appears; whoever finishes
typing it first fires. Loser of the exchange loses one of three lives. Your lives
carry across outlaws, so the whole run is one gauntlet. Zero lives: WANTED poster,
game over, bounty booked.

## How to play

- **Space / tap**: start a run (also: new run from game over / victory)
- **Letters**: type the revealed word. Wrong keys do nothing at all; only time is lost
- **Esc**: pause / resume (pause menu: resume, restart run, sound, reset best bounty)
- **M**: sound on/off (outside a race; during a race, M is just a letter)
- **Enter**: start endless mode after a victory
- **R / X**: restart run / reset best bounty (from the pause menu)
- **Touch phones**: tap once to summon the OS keyboard (autocorrect, autocomplete,
  spellcheck and predictive text disabled). Hardware-keyboard devices never see it.

Win all 10 duels to reach the "Railroad Reached" victory screen, then endless mode
recycles the roster with +6 WPM per cycle.

## Outlaws

Cactus Jack (28 WPM) → Black Bart (92 WPM, long words, random stumbles). Fixed
bounties from $100 to $1200. Best bounty persists in localStorage (this browser
only; clearing browser data loses it).

## Tech

- React shell + Phaser 3 (canvas renderer), TypeScript, Vite
- All pixel art generated in code from ASCII grids (16-bit-style outlaw poses with
  NES-style outlines on an 8-bit-style background, strict NES palette subset)
- All audio synthesized in Web Audio: brown-noise wind, scheduled saloon-piano loop,
  gunshot/sting/arpeggio SFX. No audio assets
- Scene is 270x300 logical pixels = the Clicks Communicator's 0.9 aspect; integer 4x
  scaling on the device itself
- Seeded PRNG (mulberry32), pooled blood particles, no per-frame allocation of entities

## Run

```sh
npm install
npm run dev        # port 3000
npm run build      # outputs dist/
npm run preview
```

## Verify

```sh
npm run build && node scripts/verify-game.mjs
```

Real-browser Playwright check: title, race, lenient wrong keys, exchange win,
pause/resume, mute, restart, bounty, game over, full 10-outlaw victory, endless mode,
zero console errors. Screenshots land in verification-shots/ (process artifacts).
