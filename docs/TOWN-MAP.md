# TOWN-MAP — Navigation Screen

## Concept

A **top-down drawn map** of Tombwood Creek. This is a map, not an aerial shot: a still illustrated view from above, no movement, no wandering NPCs. Same 270×300 resolution and 16-bit NES pixel art as the rest of the game (Clicks Communicator target).

## Layout

- **Town Hall in the center** — the biggest building, slightly grander than the rest.
- **Gold Mine in the top-right corner** — the tunnel entrance drawn into a small hillside.
- **The five goon buildings spread around the map**: Main Street (open square for Billy), the Saloon, the Gambling Den, and the Church placed along the dirt roads.
- **Dirt roads visibly connect every location**, like a real town: a road network radiating from the town hall, with side streets to the saloon, church, den, and main street, and a track leading out to the mine.
- **Wild West flavoring only**: cactuses outside the city edges, maybe a tumbleweed or two, distant mesas at the map border. No other buildings than the six duel locations — only duel places exist on this map.

## Buildings

Each building is a **simplified version of its duel background** — same identity, drawn top-down, readable at small size. The building looks the same whether tormented or freed: the **story is told by what's pinned on it**, not by changing the building itself.

## Location States

**Tormented (not yet defeated):**
- A **WANTED poster** with the goon's face is pinned on the location.
- The poster is a dedicated **mugshot** drawn in traditional Wild West wanted-poster style (not a crop of the duel art).
- **Town Hall additionally shows a visible lock** on its poster: Black Bart's WANTED poster hangs there, but the lock marks it as not yet enterable.

**Freed (goon defeated):**
- The WANTED poster is **torn down**.
- The location's **named representative stands outside their building**, drawn happy and waving (static pose — this is a map, no animation).
- Example: freed Main Street shows its cheerful citizen in the square where Billy loitered; freed Church shows the priest or a parishioner out front.

## Navigation

- v1: **tap/press a WANTED poster → straight cut to that duel's intro.** No zoom, no walk-up animation.
- Freed locations are inert: nothing happens when pressed (or a small "already freed" acknowledgment — to be decided in implementation).
- Town Hall while locked: pressing it does nothing (or a locked jingle — to be decided in implementation).

## Audio

One **generic slow cowboy banjo loop** across the whole map screen. Same track before and after victories; no per-location variation (v1).

## Sequence

1. **Prologue** (text + images) plays first.
2. Then the map appears for the first time.
3. Player picks any of the five unlocked posters, in any order.
4. When all five are freed, Town Hall's lock comes off.
5. Final state after Bart falls: **celebration on the map — deferred**, to be decided later in development.

## Open Items

- Map celebration/credits after Bart (deferred by user)
- Locked-press and freed-press feedback details (implementation tuning)
- Mugshot poster art: six dedicated WANTED poster images, one per fighter (ART-DIRECTION.md)
