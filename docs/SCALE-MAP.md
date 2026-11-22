# Scale Map — Saloon Scene

Every crowd member and furniture prop in the saloon duel derives its pixel
height from a real-world size and its floor depth. Code: `src/game/data/scale.ts`
(`hOf(meters, feetY)`), consumed by `src/game/data/locations.ts`.

## Real-world reference sizes

| Object | Meters |
|---|---|
| Adult townsfolk | 1.75 |
| Round table (pedestal) | 0.85 |
| Upright chair (with backrest) | 0.95 |
| Tipped table (tabletop diameter) | 1.15 |
| Broken chair debris | 0.45 |
| Bar counter (painted in background) | ~1.1 |

## Perspective: pixels per meter by floor depth (270×300 view)

| Feet y | Depth | px/m | Adult | Table | Chair | Tipped table |
|---|---|---|---|---|---|---|
| 150 | back wall | 26 | 46 | 22 | 25 | 30 |
| 200 | mid floor | 40 | 70 | 34 | 38 | 46 |
| 240 | near | 46 | 80 | 39 | 44 | 53 |
| 265 | front edge | 50 | 88 | 42 | 48 | 57 |

Interpolated linearly between rows. `hOf()` rounds to whole pixels.

## Scene rules

- The center duel lane stays clear: no crowd or props near the outlaw at
  (135, 236). People and furniture live along the left and right floor areas.
- Everything is depth-sorted by feet-y (painter's algorithm): a table with a
  higher feet-y than a person draws over them, so they are genuinely behind it.
- The bar counter is part of the background. Its occluder region
  (x 0–104, y 92–168, depth 168) hides the barman (feet 142) behind the
  counter while nearer townsfolk (feet > 168) correctly stand in front of it.
- The outlaw always draws on top of the scene furniture and crowd.
