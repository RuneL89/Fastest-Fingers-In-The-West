# Characters

Fastest Fingers in the West — Story Mode design document.

_Status: framing locked (2026-11-21). Individual identities defined per
character interviews, appended below as they are decided._

## Roster

Six characters with unique identities: five male goons and the leader,
Black Bart. Townsfolk are separate (see below).

Proposed goon names (duel order), to be confirmed or replaced in each
goon's interview:

1. Cactus Jack — PoC art already exists
2. Whiskey Wade
3. Tumbleweed Tom
4. Slim Sawyer
5. Bull Nolan

Leader: **Black Bart** (name locked).

## Goons: identity rules

**Design direction (locked): Punch-Out!!-style opponents.** Each goon is one
exaggerated archetype, the way Mike Tyson's Punch-Out!! built its roster
(Glass Joe the coward, Von Kaiser the military martinet, Don Flamenco the
narcissist, King Hippo the glutton king, Bald Bull the raging brute). The
formula to follow:

- The name IS the gimmick (Glass Joe = fragile; Bald Bull = charges like a bull).
- One visual exaggeration that silhouettes at 44 px.
- Dialogue is pre-duel only: the exchange before the fight is where the
  personality speaks. During the duel, identity is carried by the sprite
  animation frames alone. Battle mechanics are identical for all goons
  (STORY.md: equal difficulty); no typing-behavior tells.
- Earnest tone rule (from STORY.md): archetypes must stay fond, never cruel.
  Goons are menacing clowns, not mockeries of anyone real.

## Goon archetypes (locked 2026-11-21)

Five goons, five archetypes, duel order to be set in the individual
interviews:

| Archetype | Punch-Out ancestor | Core image |
|---|---|---|
| The Coward | Glass Joe | Huge hat, hunched, bluster that cracks |
| The Drunk | Soda Popinski | Stained vest, flask, sways in idle |
| The Card Sharp | new | Sleeve garters, coin flip, bets and odds |
| The Trapper | new | Bear-fur coat, wide furry silhouette |
| The Dandy Showboat | Don Flamenco | Feather, garish colors, preening |

## Goon identities

## Art style (locked from Yello Billy approval, 2026-11-21)

All characters share this direction, proven by the Cactus Jack PoC and the
Yello Billy set:

- 16-bit pixel art sprite, NES video game character look, crisp square
  pixels, flat solid colors, no gradients, no anti-aliasing.
- Thick black outline around the whole figure, so the sprite reads on any
  background at 44 px tall.
- Full body, facing the viewer (duels are head-on, Wild Gunman style).
- One exaggerated silhouette feature per character; everything else stays
  proportional enough to ground the exaggeration.
- Face is where personality lives: expressive eyes and mouth, readable at
  sprite size. Bandanas only if the character concept demands it.
- Color palette is per-character and meaningful (Yello Billy: muted and
  washed out because he'd rather not be seen).
- Generated at 1024x1280 on a transparent background; pose frames
  (idle/aim/hit/down) are generated from the accepted idle anchor as
  reference so identity stays locked across the set.
- Aim frame points the weapon at the viewer (the player), foreshortened
  barrel.
- Palette per character is quantized to the game NES palette on import; raw
  generations keep their natural palette for approval review.

### Goon: Yello Billy — The Coward (interview complete 2026-11-21)

- **Name:** Yello Billy (play on yellow-belly).
- **Build:** Tall, lanky, thin, comically bow-legged, thin legs.
- **Head:** Oversized flat-brim hat, too large for his head. Big wide eyes
  shifting nervously side to side in idle. No bandana; the scared face is
  the point.
- **Colors:** Muted, washed-out drab (beige, faded gray). A man who would
  rather not be seen.
- **Prop:** None. The shaking two-handed grip on a normal revolver is the
  whole image.
- **Draw pose:** Both hands, shaking, holding the revolver like it's a snake.
- **Per-keystroke animation:** Yes (all goons): a tiny flinch/recoil frame
  on each correct letter the player types. Visual only, zero mechanical
  effect.
- **Defeat:** His legs give out and he lands hard on his butt; hat tips
  forward over his eyes.
- **Voice:** Stammering fake confidence. Sample line: "I-i-I'll show you
  l-l-lawman."
- **Art:** all four frames generated and approved 2026-11-21
  (`src/game/assets/gen/yello-billy-{idle,aim,hit,down}.png`). Down frame:
  legs give out, lands on butt, revolver dropped, hat over eyes. Aim frame:
  revolver pointed at the player.
- **OPEN (deferred):** sheriff's three option tones for his duel
  (NARRATIVE.md), citizens' relief line (representative interview).

### Goon: Three-Finger Rye — The Drunk (interview complete 2026-11-21)

- **Name:** Three-Finger Rye.
- **Build:** Short, stocky, wide, heavy. Big bushy mustache connected to
  sideburns.
- **Head:** Small bowler hat with red band. Big round red nose. Belligerent
  permanent grin.
- **Colors:** Loud and clashing on purpose: green-and-yellow plaid shirt,
  bright red suspenders, brown patched pants.
- **Prop:** Whiskey bottle with XXX label, in his fist even while drawing.
- **Aim pose:** Body swaying to one side, one eye squinted shut to focus,
  revolver pointed at the player, bottle still in the off hand.
- **Defeat:** Falls flat on his back, bowler hat over his face, bottle
  spilled beside him, stars circling.
- **Art:** all four frames generated and approved 2026-11-21
  (`src/game/assets/gen/three-finger-rye-{idle,aim,hit,down}.png`).
- **OPEN (deferred):** his duel dialogue line (batch with all goon dialogue
  later, per player decision), citizens' relief line (representative
  interview).

Every goon has a unique identity in two places:

- **Visually**: distinct hat, bandana, vest, colors, body type, and one
  signature feature. Differentiated from every other goon at a glance.
- **In text**: each duel opens with an exchange. The sheriff speaks first
  (the player picks one of three offered lines), the goon responds with his
  own line. The goon's personality lives in that response.

Goon-to-location assignment happens in WORLD.md, after the individual
characters are defined.

## Black Bart

- Much larger than the goons (roughly 1.5x sprite height), more detailed,
  and wears a real buffalo head as his hat. His size and visuals are the
  fight's identity.
- No foreshadowing: the story does not mention him before he appears as the
  final duel. He is simply there.
- Mechanically a normal enemy with five lives instead of three. No
  mid-fight story beats, no wounding states, no anger phases. Difference is
  size, visuals, and lives, nothing more.

## Townsfolk

Every location has:

- **One named, unique representative character** who speaks the short
  thank-you line after the duel is won.
- **A few generic townsfolk** in the background. The same generic set
  recurs across all locations with color swaps only.

No personal connections between citizens and goons (no forced-to-pour
backstories, no family ties).

## Character interviews

Each identity below is filled by a dedicated interview (goons 1-5, then Bart,
then the five representatives). Status per character:

- [x] Goon 1: Yello Billy (The Coward, art approved)
- [x] Goon 2: Three-Finger Rye (The Drunk, art approved)
- [ ] Goon 3: Tumbleweed Tom
- [ ] Goon 4: Slim Sawyer
- [ ] Goon 5: Bull Nolan
- [ ] Black Bart
- [ ] Representative 1
- [ ] Representative 2
- [ ] Representative 3
- [ ] Representative 4
- [ ] Representative 5
