# NARRATIVE — The Text of the Game

## Voice and Tone

Earnest, warm, lightly comic. The people of Tombwood Creek are good-natured and a little helpless; the gang are louts, not monsters. Everything is family-friendly frontier: no cruelty, no grit. The player is the sheriff — townsfolk speak TO the player, facing the screen. The sheriff never gets a backstory, a face, or narration in their head.

## The Prologue

Format: a short sequence of **illustrated slides** — one image with one or two lines of text each, advancing on a keypress. Total 4–5 sentences.

Voice: an **omniscient narrator**, simple and storybook-plain. The prologue opens with the gang **already in town** (per STORY.md, the story begins mid-occupation): a shot of the gang loafing around Tombwood Creek, the townsfolk keeping their heads down, then the arrival of the new sheriff — the player.

Draft:

> "The Buffalo Gang rode into Tombwood Creek one dusty morning, and the good folk of this quiet gold and cattle town were too peaceful to stop them. Now the saloon pours free whiskey, the poker table is rigged, and the mine stands idle. Somebody had to do something. Somebody with fast fingers and a steady nerve. That somebody... is you, Sheriff."

(Each sentence maps to one slide: gang in town / the three torments / call for help / the player arrives.)

## Duel Intro Exchange

Once per duel, before the first exchange. The goon speaks, then the player picks **one of three sheriff lines**, the goon gives a closing response, and the duel starts.

- The three options offer different **tones** (e.g. stern lawman / dry wit / gentle warning). Pure flavor — no mechanical effect, no goon reaction difference (v1).
- The sheriff's lines are written open enough to work regardless of the player's chosen tone.
- After the goon's final hit, no more talk — straight to the defeat animation.

## Battle Speech

**None.** No barks, no hit grunts as text, no mid-duel dialogue from anyone. Bart says nothing as his lives drop. Sound effects carry everything (to be defined in implementation).

## Duel Phrases (what the player types)

Each goon has his own themed pool. Phrases get longer and trickier as the roster goes on; all are ordinary English words, frontier-flavored, family-safe.

| Goon | Theme | Length/Style |
|---|---|---|
| Yello Billy | Everyday simple words | 3–5 letters, one syllable |
| Three-Finger Rye | Drinking & the saloon | 5–7 letters, plain words |
| Sam Snakeeyes | Gambling & cards | 6–8 letters, sly words |
| Greg Goose | Wilderness & trapping | 6–8 letters, rugged words |
| Dandy Dan | Romance & flattery | 7–9 letters, flowery words |
| Black Bart | Menace & the gang | 7–10 letters, hard words |

Wrong keys do nothing but cost time (per RULES.md). No punctuation, no capitals mid-phrase, no apostrophes in v1.

## Victory — Thank-You Lines

After each goon falls, the scene resolves: the freed location, its **named representative** facing the screen, speaking **one short unique line** (speech bubble, NES-style text box). One line only, then back to the map where the poster is gone.

Examples (final lines per representative interview):
- Saloon barman: "First round's on the house, Sheriff. The good stuff, this time."
- Miner: "You got the mine back! The whole town eats because of you!"

## Black Bart — The Finale

Town Hall unlocks, no ceremony, no foreshadowing (per STORY.md). Bart's intro exchange happens on the town hall steps with the **Mayor tied up in the background** — visible but silent during the duel.

When Bart falls: the **Mayor delivers the final thank-you line**, the town's voice of relief.

## Ending

Bart down → Mayor's line → cut back to the map in its celebration state (exact celebration deferred, per TOWN-MAP.md). A short closing slide mirrors the prologue: 1–2 sentences of narrator text over an image of a freed town. Then title screen.

Draft closing:

> "The mine rings with picks again, the piano plays every night, and Tombwood Creek is quiet the way it likes to be. Somebody had to do something. Good thing you showed up, Sheriff."

## Game Over

On the third lost life: a simple **GAME OVER** card with one narrator line —

> "The Buffalo Gang keeps Tombwood Creek... for now."

— and straight back to the title screen. Starting again begins the run from the top (per RULES.md).

## Text Presentation

- All text in the game's NES-style pixel font, white with black outline.
- Speaker names in color per character; narrator text unadorned.
- Text boxes advance on keypress; no auto-advance.

## Open Items

- Final prologue/closing wording (critique above)
- Actual phrase pools (written during implementation, per goon theme table)
- Per-goon intro exchanges and the three sheriff option tones (drafted after representative interviews resume, or on request)
- Representative thank-you lines (written in the representative interviews)
- Bart's intro exchange (needs his dialogue voice defined)
