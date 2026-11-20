# Story Mode — "The Sheriff of Dustwater"

## Premise

The town of Dustwater used to be the liveliest stop on the frontier line.
Then the Buffalo Gang rode in, run off old Sheriff Aldous Whitlock, and
divided the town between them. Each gang member holds a location and the
citizens in it. Nobody leaves. Nobody resists. The train still stops, but
the platform is empty.

You are the new sheriff, arriving on the afternoon train. Ten gunmen stand
between you and a free town. The game never shows your face. You see your
own hands and your gun; every player gets to be the sheriff.

## The gang (existing ladder becomes the cast)

The 10-outlaw ladder already has names, looks, and speeds. They slot into a
gang hierarchy naturally:

| # | Outlaw | WPM | Territory | Held citizens |
|---|---|---|---|---|
| 1 | Cactus Jack | 28 | Train Depot | rail workers, porters |
| 2 | Dusty Pete | 36 | Corral & stable | ranch hands |
| 3 | One-Eye Roy | 44 | Chapel | the congregation |
| 4 | Montana Mae | 50 | General Store | shopkeepers |
| 5 | Deadeye Dan | 58 | Saloon | the musicians |
| 6 | Rattlesnake Red | 64 | Bank | the tellers, the vault |
| 7 | Two-Toed Thompson | 72 | Sheriff's Office | the deputies (irony noted) |
| 8 | The Professor | 78 | Schoolhouse | the teacher, the kids |
| 9 | Sidewinder Sam | 84 | Stagecoach Station | the drivers |
| 10 | Black Bart | 92 | Town Hall | Mayor Eliza Pruitt, everyone left |

Black Bart is the ringleader. Sidewinder Sam is his right hand. The ladder
difficulty curve IS the gang's pecking order: the closer to Bart, the
deadlier the gun.

## How the story is told

Three devices, all in-engine, no video:

1. **Prologue cards.** 5 to 7 full-screen painted panels (AI generated,
   same NES pipeline) with a slow pan/zoom, Press Start 2P text at the
   bottom, one sentence each. Cards: the town in its prime, the gang rides
   in at dusk (silhouettes only), Whitlock's star left on the jail door,
   the town gray and shuttered, the train arriving, your boot hitting the
   platform. Any key advances; the last card fades into the map.

2. **The map as story.** One pixel-art overhead map of Dustwater (AI
   generated background, location icons code-drawn so they can change
   state). Held locations are desaturated, dark, with a gang WANTED poster
   nailed to them. Liberated locations regain color, light their windows,
   show tiny citizens moving, and fly a flag. The transformation of the map
   over a run is the story's spine: the player watches the town come back
   to life location by location.

3. **Citizen payoff scenes.** Beating an outlaw plays a short scene: the
   held citizens come out (small pixel sprites, walk-in animation), one
   named citizen says a single line of thanks in text ("The depot's open
   again, Sheriff. First train's got your name on the manifest."), and the
   location on the map updates permanently for the rest of the run.

## Map navigation

- From title: STORY MODE → prologue → map. CONTINUE resumes at the map.
- Map controls: arrow keys or WASD move a sheriff-star cursor between
  locations, Enter rides out. On the Communicator, 1-9/0 jump straight to
  a location.
- Selecting a held location: camera rides to it (map zooms toward the
  building), poster of the gang member fills the screen, RIDE OUT → duel.
- Liberated locations can be revisited: the named citizen has one new line
  of ambient dialogue (stock per location), plus the practice range at the
  freed depot for warming up.
- Only gang-held locations with citizens relevant to the story gate
  nothing: the player may clear locations in any order. Recommended order
  is by the gang's own hierarchy, shown by poster WANTED reward: the map
  suggests, never forces. Beating a higher member early is allowed and
  just makes Bart madder (he gets a line about it before the boss fight).

## Duel integration

The existing duel IS the story mode's combat. What changes is framing:

- Intro phase gains the outlaw's poster and walk-in (already planned in
  Phase 2 of PLAN.md).
- Between-exchanges banter: each outlaw has 3 short barks shown on the
  word strip ("Yer twitchy, lawman."). Pure flavor, no timing effect.
- Losing all lives: not game over, story-wise. You wake at the freed
  doctor's office (or the train platform if none freed yet), keep your
  liberated locations, retry the same outlaw. The gang mocks you in one
  line. Lives are per-duel stakes, not run-ending, in story mode. This
  keeps the story moving and removes rage-quit dead ends.

## Boss fight: Black Bart, Town Hall

Three stages, escalating, lives refresh between stages (player and Bart
both heal to full; it is a duel of honor at that point).

- **Stage 1, "The Parlor":** standard duel at 70 WPM. Bart toys with you.
  Town Hall interior background.
- **Stage 2, "No More Mister Nice Bart":** 84 WPM, zero stumble. His barks
  turn venomous. The lamps flicker (procedural lighting shift).
- **Stage 3, "Last Man Standing":** 100 WPM, and Bart has 5 lives to your
  3. The word pool is the boss tier (sarsaparilla, rambunctious). When he
  falls, the screen desaturates except the gold star rolling to your feet.

Story payoff: Mayor Pruitt walks out of Town Hall, hands you Whitlock's
old star (not a new one: the town's own), citizens fill the street,
credits card with total bounty, accuracy, and the town fully lit behind the
text. Save records STORY CLEARED + best completion stats.

## Epilogue

One final map view, every window lit, citizens everywhere, the train
arriving with passengers. The named citizens each get one closing line as
the camera pans the map. Last card: "Dustwater sleeps safe tonight,
Sheriff." Then: keep patrolling (endless mode unlocks as POSTED PATROL)
or ride on (credits).

## Art checklist for story mode

- 5 to 7 prologue panels (AI, NES pipeline, 270x300 native then quantized)
- 1 overhead town map (AI base, code-drawn dynamic location icons)
- 10 location backgrounds: reuse main street as a base, generate 2 more
  (saloon interior for Dan, town hall interior for Bart stages) and tint
  variants for the rest to start
- Citizen sprites: 4 to 6 small generic townsfolk (code-drawn, cheap)
- Sheriff star badge (code-drawn)
- 10 WANTED posters (reuse idle art + code-drawn poster frame)

## Open questions for the player

1. Bart's stage-3 rule: 5 lives vs your 3 feels epic but maybe unfair.
   Alternative: 4 lives vs 3, or 5 vs 3 with words 20 percent shorter.
2. Prologue tone: melancholy (a town that gave up) or bitter (a town that
   was robbed of its nerve)? Changes the writing on every card.
3. Free-roer on the map: strictly any order, or soft gates (clear 2 of the
   first 3 to draw Sam's attention, etc.)?
4. Does losing a duel cost anything? Current design: only retry time and
   mockery. Should repeated losses against one outlaw escalate (he gets a
   small speed boost each time you lose to him, max +10)?
