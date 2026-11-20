# Fastest Fingers in the West — Full Game Plan

Status of the PoC (2026-11-21): playable 10-outlaw ladder, 3 lives per side,
endless mode, procedural audio, AI art pipeline proven with Cactus Jack
(4-pose frame set + main street background, NES-quantized, in-game).

## Design pillars

1. Typing is the gun. Every mechanic rewards typing speed and accuracy.
2. Every outlaw has a face and a tells. Visual identity per opponent.
3. The fantasy is the showdown: tension, reveal, draw, consequence.
4. Runs are short (10-15 min), replayable, and the endless ladder scales
   with the player forever.

## Phase 1 — Content: the full ladder (art pipeline at scale)

Goal: 10 visually distinct AI outlaws, each with idle/aim/hit/down frames.

- Identity block per outlaw: name, hat shape, bandana color, vest color,
  distinguishing feature (eyepatch, mustache, beard, scar, hair), weapon pose.
- Generation flow per outlaw: text-to-image anchor (seed varies per outlaw,
  style block fixed), then 3 reference-locked pose frames.
- Two more backgrounds: a dusk/night variant and a canyon variant, swapped
  per outlaw group (duels 1-3, 4-7, 8-10) so the ladder has scenery arcs.
- Tumbleweed, vulture, and saloon props stay procedural.
- Acceptance bar: palette-quantized sprite reads at 44 px, identity obvious,
  pose set consistent. Regenerate max twice per frame, then accept and move on.
- Keep the code-drawn sprites as fallback and as the endless-mode "generic
  bandit" pool after outlaw 10.

Deliverable: `src/game/assets/gen/` holds 40 outlaw frames + 3 backgrounds.
`DuelScene` gets a per-outlaw art table; missing frames fall back per-pose.

## Phase 2 — Gameplay depth

1. **Post-duel results card.** WPM vs outlaw WPM, accuracy, fastest word,
   streak. Shown between outlaws, skippable with any key.
2. **Combo streaks.** Consecutive exchange wins without a loss build a streak;
   at 3/5/8 the player's hat gets a badge (feather, silver star, gold star).
   Purely cosmetic, highly motivating.
3. **Player speed calibration.** First two outlaws measure the player's real
   WPM and gently retarget the ladder base (never below outlaw minimums).
   The game gets fairer the more you play.
4. **Outlaw walk-in intro.** Banner + outlaw slides in from the side during
   the intro phase. Reinforces "new face, new duel."
5. **Deeper word pool.** 3 tiers (short/common, medium, long/rare) matched to
   outlaw WPM so late-ladder words demand speed on harder strings.
6. **Practice range mode.** No lives, no stakes, endless words vs a dummy
   target, live WPM readout. For warming up before a real run.

## Phase 3 — Presentation

- Title screen art (AI generated, same pipeline) with the 10-outlaw
  progression shown as WANTED posters.
- Wanted poster per outlaw: generated portrait, name, bounty. Shown during
  intro phase, feeds the results card.
- Procedural audio stays (wind, saloon piano) plus: per-duel tension sting
  at 1 life left, victory fanfare on ladder clear, distinct shot pitch per
  side so you always know who fired.
- Settings on title screen: mute (exists), practice mode, how-to-play card.

## Phase 4 — Android on the Clicks Communicator

Target: installable APK on the Communicator when it ships (late Jan 2027).

- TWA or WebView wrapper around the built game; offline, no server needed.
- Physical keyboard: already the primary input path; verify keymap quirks
  of the capacitive board (alt symbols, long-press).
- Progressive enhancements, standard Android APIs only (no Clicks SDK):
  - Signal Light LED: flash red on player death, gold on outlaw down.
  - Prompt Key: hold to dictate a word in practice mode (on-device STT).
  - Barometer: purely cosmetic for now, logged as an idea, not a feature.
- Saves: local, survive app updates.

## Phase 5 — Multiplayer duel (after single-player ships)

Original brainstorm item, deliberately last. Two devices, same word reveal,
first to finish shoots. Options ranked by effort: shared-screen hotseat,
WebRTC peer duel, async daily-duel (same seeded word ladder, compare WPM).
Decision deferred until Phase 1-3 are done and played.

## Sequencing and effort

| Phase | Depends on | Rough size |
|---|---|---|
| 1 ladder art | done PoC pipeline | biggest single chunk |
| 2 gameplay | none (parallel with 1) | medium |
| 3 presentation | 1 (posters), 2 (results) | small-medium |
| 4 Android | 1-3 stable | medium, needs device in hand |
| 5 multiplayer | everything else | large, optional forever |

Open questions for the player (answers shape phases 1-3):
- Wanted posters: AI portraits or reuse the full-body frames?
- Difficulty: should the ladder be beatable by a 40 WPM casual typist?
- Scope: ship single-player first, or hold everything for one big release?
