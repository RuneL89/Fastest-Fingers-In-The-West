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
- **These key frames are character style sheets, not final animation
  frames.** They define how each character looks. Individual frames may be
  regenerated during duel development if an animation needs to be smoother
  or read better in motion.
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

### Goon: Sam Snakeeyes — The Card Sharp (interview complete 2026-11-21)

- **Name:** Sam Snakeeyes (gambler + sneaky/shifty).
- **Build:** Medium build, average height. Slightly hunched sly posture.
- **Head:** Tall black hat with two playing cards tucked in the band. Thin
  long waxed mustache. Heavy-lidded eyes glancing sideways, crooked sneaky
  look, no smile.
- **Colors:** Black long duster over white shirt and dark red vest, dark
  pants, gold watch chain.
- **Prop:** None in hand. Bolo tie with two dice as the slide. The two hat
  cards are the signature. (Ace up the sleeve and rabbit's foot were cut in
  art review.)
- **Aim pose:** One hand only, casual confident grip, eyes narrowed, revolver
  pointed at the player.
- **Hit animation:** Long coat bursts open, cloud of playing cards explodes
  out of him mid-stagger.
- **Defeat:** Lands face down, hat fallen off beside him, scattered cards,
  revolver dropped.
- **Personality (dialogue, deferred batch):** all gambling focused, smooth
  talker.
- **Art:** complete seven-frame duel set integrated 2026-11-22
  (`src/game/assets/gen/sam-snakeeyes-{idle,draw,aim,flinch,fire,hit,down}.png`).
  The original idle, aim, hit, and down frames were retained; draw, flinch,
  and fire were added for the gambling-den duel.

### Goon: Greg Goose — The Trapper (interview complete 2026-11-21)

- **Name:** Greg Goose (Canadian fur trapper).
- **Build:** Broad-shouldered, wide, powerful. Clean simple silhouette.
- **Head:** Raccoon-skin cap with striped tail. Prominent scar over right
  eye. Short stubble, not a beard.
- **Colors:** Heavy brown fur coat over red plaid lumberjack shirt, green
  trousers, plain big leather boots.
- **Weapon:** Long hunting rifle (the only goon with a long gun). Carried in
  both hands.
- **Aim pose:** Rifle shouldered, cheek against stock, one eye squinted
  shut along the sights, barrel pointed at the player.
- **Hit animation:** Hunched forward clutching his belly, rifle dangling in
  one hand.
- **Defeat:** Face down on the ground, raccoon cap off beside his head,
  rifle dropped beside him.
- **Personality (dialogue, deferred batch):** wilderness man, talks about
  people like varmints.
- **Art:** all four frames generated and approved 2026-11-21
  (`src/game/assets/gen/greg-goose-{idle,aim,hit,down}.png`).

### Goon: Dandy Dan — The Dandy Showboat (interview complete 2026-11-21)

- **Name:** Dandy Dan.
- **Build:** Slim, posed, theatrical. Chin raised, hand on hip, hat-tipping
  greeting.
- **Head:** Wide black gambler hat with one large peacock feather. Waxed
  mustache connected to a pointed Van Dyke beard.
- **Colors:** Plain purple vest, white shirt, hot pink sash, plain black
  trousers, simple black boots with small spurs, small red rose in the
  lapel.
- **Personality:** ladies' man. Flirts while he draws; the charm is the
  menace.
- **Aim pose:** Revolver pointed at the player, winking, blowing a kiss.
- **Hit animation:** Theatrical stagger, hand clutching his chest over the
  rose, head thrown back in dramatic shock.
- **Defeat:** Dramatic faint, sinking backward, back of hand pressed to his
  forehead, hat flying off, rose tumbling after.
- **Art:** all four frames generated and approved 2026-11-21
  (`src/game/assets/gen/dandy-dan-{idle,aim,hit,down}.png`).

### Black Bart — The Leader (interview complete 2026-11-21)

- **Name:** Black Bart (locked).
- **Scale:** 1.5x goon sprite height (~132 px on the 270x300 view). He
  dominates the duel frame.
- **Build:** Big, burly, massively muscled. Black hair, full black beard,
  big black eyebrows.
- **Head:** A full real buffalo head with horns and eyes worn over his head
  like a helmet. His face glares out from under it. The head lifts on hits
  and comes off on defeat.
- **Clothes:** Cowboy first: faded red shirt, fur vest, leather gun belt
  with buffalo-skull buckle, denim trousers, spurred cowboy boots.
- **Weapon:** Big sawed-off shotgun, held two-handed.
- **Aim pose:** Angry, both hands on the shotgun, barrels foreshortened
  straight at the player, leaning in.
- **Hit animation:** Shot in the stomach, doubled over, one hand clutching
  his belly, buffalo head tilting back to reveal the pained grimace
  underneath. Must survive being shown up to 4 times without looking
  defeated. (Style-sheet frame; may be regenerated for motion.)
- **Defeat:** Very bloody and dramatic in-engine: flat on his back, arms
  spread, shotgun dropped, the buffalo head off beside him, real face slack.
  The head coming off is the story's final image. (Raw frame generated
  bloodless; the game's pixel-blood burst supplies the gore.)
- **Mechanics:** normal enemy with 5 lives (RULES.md). No foreshadowing,
  no mid-fight story beats (STORY.md). Extra rage frame: deferred, maybe
  later.
- **Art:** all four frames generated and approved 2026-11-21
  (`src/game/assets/gen/black-bart-{idle,aim,hit,down}.png`).

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

### Representative: Busted Ben — Gambling Den (complete 2026-11-22)

- **Role:** An elderly gambler who has lost everything at Snakeeyes' rigged table.
- **Look:** Short grey hair, drooping grey moustache, threadbare patched brown
  suit, and frayed cream shirt.
- **Base state:** Worried, studying an empty open wallet.
- **Flinch state:** Cowering with his hands raised, wallet dropped.
- **Happy state:** Jumping with joy and raising his recovered gold pocket watch.
- **Thank-you line:** "My lucky watch! You're aces, Sheriff. Aces!"
- **Art:** `src/game/assets/gen/rep-gambling-den{,-flinch,-happy}.png`.

## Character interviews

Each identity below is filled by a dedicated interview (goons 1-5, then Bart,
then the five representatives). Status per character:

- [x] Goon 1: Yello Billy (The Coward, art approved)
- [x] Goon 2: Three-Finger Rye (The Drunk, art approved)
- [x] Goon 3: Sam Snakeeyes (The Card Sharp, art approved)
- [x] Goon 4: Greg Goose (The Trapper, art approved)
- [x] Goon 5: Dandy Dan (The Dandy Showboat, art approved)
- [x] Black Bart (Leader, art approved)
- [x] Representative 1: Stew Potts (Main Street, sprite complete)
- [x] Representative 2: Barman (Saloon, sprite complete)
- [x] Representative 3: Busted Ben (Gambling Den, sprite complete)
- [ ] Representative 4
- [ ] Representative 5
