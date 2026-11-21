# RULES — How the Game Is Played

## The Duel (the whole battle)

The duel is the entire game. No movement, no dodging, no other controls. Typing IS shooting.

**Flow per exchange:**
1. One phrase appears. It is the same phrase for the player and the goon. The race begins.
2. The player types letter by letter. Every correct letter lands a flinch on the goon (visual only). Wrong keys do nothing except waste time: the phrase does not reset, nothing needs to be undone. Typing "breayyyyyyd" for "bread" only registers the correct letters.
3. The goon types the same phrase on his own internal timer. Whoever completes the phrase first fires. Loser of the race takes the hit. This shared-fate race is the mechanic that enables multiplayer later.

**Hit resolution:**
- Player wins the race → goon takes a hit, loses a life, hit animation plays.
- Goon wins the race → the goon fires at the player, sheriff loses a life. (Player-facing consequence on screen; sheriff has no visible avatar — handled as screen effect, e.g. flash/shake.)

## Lives

- **Sheriff: 3 lives.** All duels.
- **Goons: 2 lives each.** All five goons identical.
- **Black Bart: 5 lives.** Mechanically identical to any other duel, just longer — same hit animation on each of his five lives.

## Game Over

Zero lives = game over. **Start from the beginning** (full restart, not a retry checkpoint).

## Words and Phrases

- Both sides type the same phrase; typing speed required is the same across all goons at a given difficulty. What differs is **phrase length and complexity** per goon.
- Yello Billy (the coward) has the simplest, shortest phrases. (Other per-goon phrase flavor to be defined with NARRATIVE.md.)
- No phrase resets, no undo mechanic.

## Difficulty Setting

Easy / Normal / Hard, selected at game start. Difficulty affects the **typing speed needed to win a duel** (the goon's internal timer), nothing else. Story mode balance assumes one default setting (Normal) unless the player changes it.

## Map and Progression

- After the prologue, the player sees the overhead map of Tombwood Creek and picks any tormented location.
- Areas can be tackled **in any order**, except: **Black Bart at Town Hall unlocks only when all five goons are defeated.**
- The map is pure navigation. No stats, no shops, no interactions between duels.
- **No pause.** A duel, once started, plays to its end.

## Failure and Freedom

- Losing a duel costs a life; losing three costs the run. No mid-duel pause, no quit-to-map, no save (v1).

## Non-Goals (v1)

- No practice mode.
- No scoring, star ratings, or timers displayed. Win/lose is the only outcome.
- No player avatar. The player IS the sheriff; consequences are shown as screen effects, not a character model.

## Open Items

- Per-goon phrase length/word flavor table (NARRATIVE.md)
- Exact Easy/Normal/Hard goon typing-speed values (tuning during implementation)
- Sheriff-hit screen effect style (ART-DIRECTION.md)
