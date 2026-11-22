# Scale Map — Duel Scenes

Every scaled crowd member and furniture prop derives its pixel height from a real-world size and its floor depth. Code: `src/game/data/scale.ts` (`hOf(meters, feetY)`), consumed by `src/game/data/locations.ts`.

## Real-world reference sizes

| Object | Meters |
|---|---:|
| Adult townsfolk | 1.75 |
| Round table on pedestal | 0.85 |
| Upright chair with backrest | 0.95 |
| Tipped table, tabletop diameter | 1.15 |
| Broken chair debris | 0.45 |
| Mine cart | 1.15 |
| Mining crate | 0.95 |
| Church pew | 1.05 |
| Saloon bar counter, painted in background | approximately 1.1 |

## Perspective: pixels per meter by floor depth

Logical view: 270 x 300.

| Feet y | Depth | px/m | Adult | Table | Chair | Tipped table |
|---|---|---:|---:|---:|---:|---:|
| 150 | back wall | 26 | 46 | 22 | 25 | 30 |
| 200 | mid floor | 40 | 70 | 34 | 38 | 46 |
| 240 | near | 46 | 80 | 39 | 44 | 53 |
| 265 | front edge | 50 | 88 | 42 | 48 | 57 |

`hOf()` interpolates linearly between rows and rounds to whole pixels. The same depth curve is reused in the Saloon, Gambling Den, Gold Mine, and Church so recurring people and furniture retain coherent proportions.

## Scene rules

- The center duel lane stays clear around the ordinary outlaw at `(135, 236)`. People and furniture live along the sides and back.
- Everything is depth-sorted by feet-y with the painter's algorithm. A table with a higher feet-y than a person draws over their legs, placing the person genuinely behind it.
- The outlaw draws after the crowd and props. HUD, typing displays, and dialogue draw last.
- Representatives have independent map anchors and duel anchors. A persistent representative can remain visible during a duel and switch between base, flinch, and happy textures without changing target height.
- Transparent source images are trimmed at alpha 128 before runtime scaling. Target display heights remain stable across pose changes.

## Location notes

### Saloon

Seven townsfolk and the barman share the room with six separate furniture pieces. The bar counter is part of the approved background. Its occluder region `(x 0–104, y 92–168, depth 168)` hides the barman at feet `142` while nearer townsfolk correctly stand in front of it.

### Gambling Den

Seven townsfolk stand behind or beside two card tables and two chairs. The green-felt table on the right and the round table on the left are separate depth-sorted sprites.

### Gold Mine

Seven miners gather around the blocked tunnel. The separate mine cart sits at `(215, 220)` and the mining crate at `(55, 235)`. Dusty Pete's duel anchor is `(92, 178)` with a target height of 72 pixels.

### Church

Seven congregants and four pews leave the central aisle clear. Pews use the 1.05 m reference size. Father Merritt remains visible at `(185, 168)` with a target height of 64 pixels. Three matrons use their crying texture on victory while the men and priest use happy textures.

### Town Hall

The Mayor is the only background person. His tied chair sits at `(211, 187)` with a target height of 66 pixels, clear of Bart's larger central silhouette. Bart uses a 168-pixel target height, which is 1.5 times the ordinary 112-pixel fighter height. His tied, flinch, and freed-happy poses all retain the same target height.
