/**
 * phrases.ts — per-goon phrase pools, themed per NARRATIVE.md.
 * Lowercase letters only. Billy's pool is complete (Phase 1);
 * the other pools are stubs for later phases.
 */
export const PHRASE_POOLS: Record<string, readonly string[]> = {
  "yello-billy": [
    "gun", "boot", "dust", "hat", "horse", "bread", "wagon", "chair",
    "door", "horse", "water", "table", "shoe", "clock", "rope", "bell",
    "cup", "key", "floor", "house", "wheel", "plate", "fence", "road",
    "broom", "lamp", "bucket", "spoon", "coat", "stairs", "window",
  ],
  "three-finger-rye": ["whiskey", "saloon", "bottle", "barrel", "tavern", "drunk"],
  "sam-snakeeyes": ["poker", "gamble", "dealer", "aces", "cheat", "ante", "flush"],
  "greg-goose": ["beaver", "timber", "trapper", "moose", "forest", "cabin", "pelts"],
  "dandy-dan": ["romance", "darling", "flowers", "dearest", "heartthrob", "adore"],
  "black-bart": ["buffalo", "revenge", "outlaw", "destruction", "showdown"],
};

export function phraseFor(fighterId: string, rnd: () => number): string {
  const pool = PHRASE_POOLS[fighterId];
  return pool[Math.floor(rnd() * pool.length)];
}
